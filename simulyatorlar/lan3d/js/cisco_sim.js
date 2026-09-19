/* ==========================================================================
   CISCO PACKET TRACER SIMULATION ENGINE, ROUTING & SIMULATION DOCK
   ========================================================================== */

/* BFS Shortest Path Algorithm across Network Topology */
function findNetworkPath(srcId, dstId){
  if(srcId === dstId) return null;
  const queue = [[srcId]];
  const visited = new Set([srcId]);
  while(queue.length > 0){
    const path = queue.shift();
    const curr = path[path.length - 1];
    if(curr === dstId) return path;
    const neighbors = [];
    connections.forEach(c=>{
      if(c.a === curr && !visited.has(c.b)) neighbors.push(c.b);
      if(c.b === curr && !visited.has(c.a)) neighbors.push(c.a);
    });
    for(const n of neighbors){
      visited.add(n);
      queue.push([...path, n]);
    }
  }
  return null;
}

function logSimEvent(srcName, dstName, type, currentHopName, status, info){
  const timeStr = (typeof clock !== 'undefined' ? clock.getElapsedTime().toFixed(2) : "0.00") + "s";
  const ev = { id: simEventIdCounter++, time: timeStr, srcName, dstName, type, currentHopName, status, info };
  simEventsLog.unshift(ev);
  if(simEventsLog.length > 80) simEventsLog.pop();
  renderSimEventTable();
}

function renderSimEventTable(){
  const tbody = document.getElementById('simEventTbody');
  if(!tbody) return;
  if(simEventsLog.length === 0){
    tbody.innerHTML = `<tr><td colspan="6" class="empty">Hali paket uzatish hodisalari mavjud emas. "Fayl / PDU" tugmasini bosib simulyatsiyani boshlang.</td></tr>`;
    return;
  }
  tbody.innerHTML = simEventsLog.slice(0, 30).map(ev => `
    <tr>
      <td style="color:var(--ink-dim);">${ev.time}</td>
      <td><b>${ev.srcName}</b></td>
      <td><b>${ev.dstName}</b></td>
      <td><span class="badge ${ev.type.toLowerCase()}">${ev.type.toUpperCase()}</span></td>
      <td style="color:#6FE3C4;">${ev.currentHopName}</td>
      <td><span style="color:${ev.status.includes('Muvaffaqiyatli')||ev.status.includes('ACK')?'#00FF87':ev.status.includes('Xatolik')?'#EF4444':'#FFB454'}">${ev.status}</span> · <span style="color:var(--ink-dim);">${ev.info}</span></td>
    </tr>
  `).join('');
}

function createPayloadMesh(type){
  const g = new THREE.Group();
  if(type === 'ftp'){
    const c = box(0.24, 0.24, 0.24, mat(0xFBBF24, {metalness:0.8, roughness:0.2, emissive:0xFBBF24, emissiveIntensity:1.2}));
    g.add(c);
    const halo = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 12), new THREE.MeshBasicMaterial({color:0xFBBF24, transparent:true, opacity:0.35}));
    g.add(halo);
  } else if(type === 'icmp'){
    const s = new THREE.Mesh(new THREE.SphereGeometry(0.13, 14, 14), emissiveMat(0x4FC7E8, 2.2));
    g.add(s);
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.16, 0.22, 20), new THREE.MeshBasicMaterial({color:0x4FC7E8, transparent:true, opacity:0.6, side:THREE.DoubleSide}));
    ring.rotation.x = Math.PI / 2;
    g.add(ring);
  } else if(type === 'http'){
    const b = box(0.22, 0.15, 0.22, emissiveMat(0xEC4899, 1.8));
    g.add(b);
    const halo = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 12), new THREE.MeshBasicMaterial({color:0xEC4899, transparent:true, opacity:0.35}));
    g.add(halo);
  } else {
    const d = new THREE.Mesh(new THREE.OctahedronGeometry(0.16), emissiveMat(0x6FE3C4, 2.0));
    g.add(d);
  }
  scene.add(g);
  return g;
}

function startPacketTransfer(opts){
  const { srcId, dstId, type = 'ftp', fileName = 'fayl.dat', fileSize = '2.4 MB', onComplete } = opts;
  const srcDev = devices.get(srcId);
  const dstDev = devices.get(dstId);
  if(!srcDev || !dstDev){
    toast("Qurilma topilmadi!");
    return false;
  }

  const path = findNetworkPath(srcId, dstId);
  if(!path || path.length < 2){
    toast("⚠️ Xatolik: " + srcDev.name + " va " + dstDev.name + " o‘rtasida aloqa mavjud emas!");
    logSimEvent(srcDev.name, dstDev.name, type, "—", "Xatolik: Aloqa yo‘q", "Destination Host Unreachable");
    if(onComplete) onComplete(false);
    return false;
  }

  const hops = [];
  for(let i = 0; i < path.length - 1; i++){
    const conn = getConnectionBetween(path[i], path[i + 1]);
    if(conn) hops.push({ from: path[i], to: path[i + 1], conn });
  }

  const mesh = createPayloadMesh(type);
  const transfer = {
    id: "tr_" + Math.random().toString(36).substr(2, 9),
    srcId, dstId, srcName: srcDev.name, dstName: dstDev.name,
    type, fileName, fileSize,
    path, hops, currentHopIndex: 0,
    t: 0,
    speed: 0.9 * simSpeed,
    isReturnAck: false,
    mesh, onComplete
  };

  active3DTransfers.push(transfer);
  const firstHopDev = devices.get(hops[0].to);
  logSimEvent(srcDev.name, dstDev.name, type, srcDev.name, "Yuborilmoqda", `${fileName || type.toUpperCase()} (${fileSize}) ➔ ${firstHopDev.name}`);
  toast(`🚀 ${type.toUpperCase()} uzatilmoqda: ${srcDev.name} ➔ ${dstDev.name}`);
  return true;
}

function update3DTransfers(dt){
  if(simPaused) return;
  for(let i = active3DTransfers.length - 1; i >= 0; i--){
    const tr = active3DTransfers[i];
    const hop = tr.hops[tr.currentHopIndex];
    if(!hop){
      cleanupTransfer(i);
      continue;
    }

    const curve = hop.conn.curveFn();
    if(!curve){
      cleanupTransfer(i);
      continue;
    }

    tr.t += dt * (tr.speed * simSpeed);
    const isForward = (hop.from === hop.conn.a);
    const curveT = isForward ? Math.min(tr.t, 1) : Math.max(1 - tr.t, 0);
    const pos = curve.getPointAt(curveT);
    tr.mesh.position.copy(pos);
    tr.mesh.rotation.y += dt * 4;

    if(tr.t >= 1){
      const hopDst = devices.get(hop.to);
      if(hopDst && typeof flashDeviceLeds === 'function') flashDeviceLeds(hopDst);

      tr.currentHopIndex++;
      tr.t = 0;

      if(tr.currentHopIndex < tr.hops.length){
        const nextHop = tr.hops[tr.currentHopIndex];
        const nextDev = devices.get(nextHop.to);
        logSimEvent(tr.srcName, tr.dstName, tr.type, hopDst ? hopDst.name : '—', "Tranzit uzatish", `➔ ${nextDev ? nextDev.name : '—'}`);
      } else {
        if(!tr.isReturnAck){
          logSimEvent(tr.srcName, tr.dstName, tr.type, tr.dstName, "Manzilga yetdi", "ACK tasdig‘i qaytarilmoqda");
          tr.isReturnAck = true;
          tr.currentHopIndex = 0;
          tr.t = 0;
          const revHops = [];
          for(let h = tr.hops.length - 1; h >= 0; h--){
            revHops.push({ from: tr.hops[h].to, to: tr.hops[h].from, conn: tr.hops[h].conn });
          }
          tr.hops = revHops;
          tr.mesh.traverse(o=>{ if(o.material) o.material.color = new THREE.Color(0x00FF87); });
        } else {
          logSimEvent(tr.srcName, tr.dstName, tr.type, tr.srcName, "Muvaffaqiyatli (ACK)", `${tr.fileName || tr.type.toUpperCase()} to‘liq yetkazildi`);
          toast(`✅ ${tr.srcName} ↔ ${tr.dstName} uzatish muvaffaqiyatli yakunlandi!`);
          if(tr.onComplete) tr.onComplete(true);
          cleanupTransfer(i);
        }
      }
    }
  }
}

function cleanupTransfer(idx){
  const tr = active3DTransfers[idx];
  if(!tr) return;
  scene.remove(tr.mesh);
  tr.mesh.traverse(o=>{
    if(o.geometry) o.geometry.dispose();
    if(o.material) o.material.dispose();
  });
  active3DTransfers.splice(idx, 1);
}

/* ==========================================================================
   PDU / FILE TRANSFER MODAL & UI
   ========================================================================== */
const pduModal = document.getElementById('pduModal');
const pduSrcSelect = document.getElementById('pduSrcSelect');
const pduDstSelect = document.getElementById('pduDstSelect');
const pduProtoTabs = document.getElementById('pduProtoTabs');
const pduFileSelect = document.getElementById('pduFileSelect');
const pduPingCount = document.getElementById('pduPingCount');
const pduRoutePreview = document.getElementById('pduRoutePreview');
const pduClose = document.getElementById('pduClose');
const pduCancelBtn = document.getElementById('pduCancelBtn');
const pduSendBtn = document.getElementById('pduSendBtn');
const ftpFileSection = document.getElementById('ftpFileSection');
const icmpCountSection = document.getElementById('icmpCountSection');

let selectedPduProto = 'ftp';

function openPduModal(preSrcId, preDstId){
  if(devices.size < 2){
    toast("Fayl / PDU uzatish uchun kamida 2 ta qurilma kerak!");
    return;
  }

  pduSrcSelect.innerHTML = '';
  pduDstSelect.innerHTML = '';

  devices.forEach(d => {
    const optS = document.createElement('option');
    optS.value = d.id; optS.textContent = `${d.name} (${d.ip})`;
    pduSrcSelect.appendChild(optS);

    const optD = document.createElement('option');
    optD.value = d.id; optD.textContent = `${d.name} (${d.ip})`;
    pduDstSelect.appendChild(optD);
  });

  const devKeys = [...devices.keys()];
  pduSrcSelect.value = preSrcId || selectedDeviceId || devKeys[0];
  pduDstSelect.value = preDstId || (devKeys.find(k => k !== pduSrcSelect.value) || devKeys[1]);

  updatePduRoutePreview();
  pduModal.classList.add('show');
}

function closePduModal(){
  pduModal.classList.remove('show');
}

function updatePduRoutePreview(){
  const s = pduSrcSelect.value;
  const d = pduDstSelect.value;
  if(!s || !d || s === d){
    pduRoutePreview.textContent = "Marshrut: Jo'natuvchi va qabul qiluvchi turli qurilma bo'lishi kerak.";
    pduRoutePreview.style.color = "#EF4444";
    return;
  }
  const path = findNetworkPath(s, d);
  if(!path){
    pduRoutePreview.textContent = "⚠️ Topologiyada bu qurilmalar o'rtasida ulanish yo'q (Aloqa uzilgan).";
    pduRoutePreview.style.color = "#EF4444";
  } else {
    const names = path.map(id => devices.get(id).name);
    pduRoutePreview.textContent = "Marshrut (" + (path.length - 1) + " ta sakrash): " + names.join(" ➔ ");
    pduRoutePreview.style.color = "#6FE3C4";
  }
}

if(pduSrcSelect) pduSrcSelect.addEventListener('change', updatePduRoutePreview);
if(pduDstSelect) pduDstSelect.addEventListener('change', updatePduRoutePreview);

if(pduProtoTabs){
  pduProtoTabs.querySelectorAll('.proto-btn').forEach(btn => {
    btn.addEventListener('click', ()=>{
      pduProtoTabs.querySelectorAll('.proto-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedPduProto = btn.dataset.proto;
      if(selectedPduProto === 'ftp'){
        ftpFileSection.style.display = 'block';
        icmpCountSection.style.display = 'none';
      } else if(selectedPduProto === 'icmp'){
        ftpFileSection.style.display = 'none';
        icmpCountSection.style.display = 'block';
      } else {
        ftpFileSection.style.display = 'none';
        icmpCountSection.style.display = 'none';
      }
    });
  });
}

if(pduClose) pduClose.addEventListener('click', closePduModal);
if(pduCancelBtn) pduCancelBtn.addEventListener('click', closePduModal);

if(pduSendBtn){
  pduSendBtn.addEventListener('click', ()=>{
    const srcId = pduSrcSelect.value;
    const dstId = pduDstSelect.value;
    if(srcId === dstId){
      toast("Jo'natuvchi va qabul qiluvchi bir xil bo'lishi mumkin emas!");
      return;
    }

    let fileName = 'fayl.dat';
    let fileSize = '1.2 MB';
    if(selectedPduProto === 'ftp'){
      const fileParts = pduFileSelect.value.split('|');
      fileName = fileParts[0];
      fileSize = fileParts[1] || '4.2 MB';
    } else if(selectedPduProto === 'icmp'){
      fileName = 'ICMP Ping Request';
      fileSize = '64 bytes';
    } else if(selectedPduProto === 'http'){
      fileName = 'HTTP GET /index.html';
      fileSize = '1.8 KB';
    } else {
      fileName = 'ARP Who has IP?';
      fileSize = '28 bytes';
    }

    closePduModal();
    startPacketTransfer({
      srcId, dstId, type: selectedPduProto, fileName, fileSize
    });

    toggleSimDock(true);
  });
}

/* ==========================================================================
   CISCO PACKET TRACER SIMULATION DOCK (EVENT LIST)
   ========================================================================== */
const simDock = document.getElementById('simDock');
const simDockClose = document.getElementById('simDockClose');
const simPlayPauseBtn = document.getElementById('simPlayPauseBtn');
const simSpeedSelect = document.getElementById('simSpeedSelect');
const simClearEventsBtn = document.getElementById('simClearEventsBtn');
const dockStatusText = document.getElementById('dockStatusText');

function toggleSimDock(forceShow){
  if(!simDock) return;
  if(forceShow === true) simDock.classList.add('show');
  else if(forceShow === false) simDock.classList.remove('show');
  else simDock.classList.toggle('show');
}

if(simDockClose) simDockClose.addEventListener('click', ()=>toggleSimDock(false));

if(simPlayPauseBtn){
  simPlayPauseBtn.addEventListener('click', ()=>{
    simPaused = !simPaused;
    simPlayPauseBtn.classList.toggle('on', !simPaused);
    simPlayPauseBtn.querySelector('span').textContent = simPaused ? 'Davom ettirish' : 'To‘xtatish';
    if(dockStatusText){
      dockStatusText.textContent = simPaused ? 'To‘xtatilgan (PAUSED)' : 'Real-Time rejim';
      dockStatusText.style.color = simPaused ? '#FBBF24' : 'var(--ink-dim)';
    }
    toast(simPaused ? 'Simulyatsiya to‘xtatildi' : 'Simulyatsiya davom etmoqda');
  });
}

if(simSpeedSelect){
  simSpeedSelect.addEventListener('change', ()=>{
    simSpeed = parseFloat(simSpeedSelect.value) || 1.0;
    toast(`Simulyatsiya tezligi: ${simSpeed}x`);
  });
}

if(simClearEventsBtn){
  simClearEventsBtn.addEventListener('click', ()=>{
    simEventsLog.length = 0;
    renderSimEventTable();
    toast("Hodisalar jurnali tozalandi");
  });
}
