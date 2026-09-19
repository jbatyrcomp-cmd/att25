/* ==========================================================================
   NETWORK CONNECTIONS, CABLES, CURVES, PORT SELECTION MODAL
   ========================================================================== */

function connExists(a, b){
  for(const c of connections.values()){
    if((c.a === a && c.b === b) || (c.a === b && c.b === a)) return true;
  }
  return false;
}

function getConnectionBetween(a, b){
  for(const c of connections.values()){
    if((c.a === a && c.b === b) || (c.a === b && c.b === a)) return c;
  }
  return null;
}

function makeCurveFn(a, b, sag){
  return function(){
    const ra = devices.get(a), rb = devices.get(b);
    if(!ra || !rb) return null;
    const p1 = ra.group.position.clone(); p1.y += ra.port;
    const p2 = rb.group.position.clone(); p2.y += rb.port;
    const mid = p1.clone().add(p2).multiplyScalar(0.5);
    mid.y += sag;
    return new THREE.QuadraticBezierCurve3(p1, mid, p2);
  };
}

function addConnection(a, b, opts = {}){
  if(a === b || connExists(a, b)) return;
  const ra = devices.get(a), rb = devices.get(b);
  if(!ra || !rb) return;

  // Resolve ports
  let portA = opts.portA ? ra.ports.find(p => p.id === opts.portA) : null;
  if(!portA) portA = ra.ports.find(p => !p.connectedTo) || ra.ports[0];

  let portB = opts.portB ? rb.ports.find(p => p.id === opts.portB) : null;
  if(!portB) portB = rb.ports.find(p => !p.connectedTo) || rb.ports[0];

  const wan = (ra.type === "router" && rb.type === "modem") || (ra.type === "modem" && rb.type === "router") || portA.type === 'wan' || portB.type === 'wan';
  const wireless = !wan && (TYPES[ra.type].forcesWireless || TYPES[rb.type].forcesWireless || portA.type === 'wireless' || portB.type === 'wireless');
  const dist = ra.group.position.distanceTo(rb.group.position);
  const sag = wireless ? Math.min(dist * 0.22, 1.4) : -Math.min(dist * 0.12, 0.8);

  const id = "c" + (connCounter++);
  const curveFn = makeCurveFn(a, b, sag);
  let curve = curveFn();

  // Cable type handling
  let cableType = opts.cableType || 'auto';
  if(cableType === 'auto'){
    if(wireless) cableType = 'wireless';
    else if(wan) cableType = 'wan';
    else if((ra.type === rb.type && (ra.type === 'router' || ra.type === 'desktop' || ra.type === 'switch')) || (ra.type === 'switch' && rb.type === 'switch')){
      cableType = 'crossover';
    } else if(portA.id.includes('Gi') && portB.id.includes('Gi') && (ra.type === 'server' || rb.type === 'server' || ra.type === 'switch')){
      cableType = 'fiber';
    } else {
      cableType = 'straight';
    }
  }

  let mesh, hitMesh = null;
  let color;
  if(cableType === 'fiber') color = 0x00FF87;
  else if(cableType === 'crossover') color = 0xFFB454;
  else if(wan) color = 0xFF8C4B;
  else if(wireless) color = 0x4FC7E8;
  else color = 0x6FE3C4; // straight

  if(wireless){
    const pts = curve.getPoints(40);
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const lmat = new THREE.LineDashedMaterial({ color, dashSize: 0.22, gapSize: 0.14, linewidth: 1, transparent: true, opacity: 0.85 });
    mesh = new THREE.Line(geo, lmat);
    mesh.computeLineDistances();
  } else {
    const tubeRadius = cableType === 'fiber' ? 0.045 : wan ? 0.05 : 0.035;
    const geo = new THREE.TubeGeometry(curve, 24, tubeRadius, 8, false);
    mesh = new THREE.Mesh(geo, mat(color, { roughness: 0.4, metalness: cableType === 'fiber' ? 0.7 : 0.2, emissive: color, emissiveIntensity: cableType === 'fiber' ? 0.45 : 0.12 }));
    const hitGeo = new THREE.TubeGeometry(curve, 24, 0.16, 8, false);
    hitMesh = new THREE.Mesh(hitGeo, new THREE.MeshBasicMaterial({ visible: false }));
    hitMesh.userData.connectionId = id;
    scene.add(hitMesh);
  }
  scene.add(mesh);

  // Link ports
  portA.connectedTo = { devId: b, portId: portB.id, connId: id };
  portB.connectedTo = { devId: a, portId: portA.id, connId: id };

  const packets = [];
  const pn = wan ? 2 : 1;
  for(let i = 0; i < pn; i++) packets.push({ t: Math.random(), speed: (cableType === 'fiber' ? 0.22 : 0.12) + Math.random() * 0.1, mesh: null });

  connections.set(id, { id, a, b, portA: portA.id, portB: portB.id, cableType, wireless, wan, mesh, hitMesh, packets, curveFn, sag, color });
  const cableName = cableType === 'fiber' ? 'Optik tola (10G)' : cableType === 'crossover' ? 'Krossover' : cableType === 'straight' ? 'To‘g‘ri (Straight)' : wireless ? 'Wi-Fi' : 'WAN';
  toast(`Ulanish yaratildi: ${ra.name} [${portA.id}] ↔ ${rb.name} [${portB.id}] (${cableName})`);
}

function removeConnection(cid){
  const c = connections.get(cid);
  if(!c) return;
  const ra = devices.get(c.a), rb = devices.get(c.b);
  if(ra && ra.ports){
    const pa = ra.ports.find(p => p.id === c.portA || (p.connectedTo && p.connectedTo.connId === cid));
    if(pa) pa.connectedTo = null;
  }
  if(rb && rb.ports){
    const pb = rb.ports.find(p => p.id === c.portB || (p.connectedTo && p.connectedTo.connId === cid));
    if(pb) pb.connectedTo = null;
  }

  // Clear Wi-Fi client connection state if applicable
  if(ra && ra.wifi && ra.wifi.connectedApId === c.b){
    ra.wifi.connectedApId = null;
    ra.wifi.connectedSsid = null;
  }
  if(rb && rb.wifi && rb.wifi.connectedApId === c.a){
    rb.wifi.connectedApId = null;
    rb.wifi.connectedSsid = null;
  }
  if(ra && ra.wifi && ra.wifi.connectedClients){
    ra.wifi.connectedClients = ra.wifi.connectedClients.filter(cl => cl.devId !== c.b);
  }
  if(rb && rb.wifi && rb.wifi.connectedClients){
    rb.wifi.connectedClients = rb.wifi.connectedClients.filter(cl => cl.devId !== c.a);
  }

  scene.remove(c.mesh);
  if(c.hitMesh) scene.remove(c.hitMesh);
  c.mesh.geometry.dispose();
  if(c.hitMesh) c.hitMesh.geometry.dispose();
  connections.delete(cid);
}

function updateConnectionsGeometry(){
  connections.forEach(c=>{
    const curve = c.curveFn();
    if(!curve) return;
    if(c.wireless){
      const pts = curve.getPoints(40);
      c.mesh.geometry.setFromPoints(pts);
      c.mesh.computeLineDistances();
      c.mesh.geometry.attributes.position.needsUpdate = true;
    } else {
      c.mesh.geometry.dispose();
      c.mesh.geometry = new THREE.TubeGeometry(curve, 24, c.wan ? 0.05 : 0.035, 8, false);
      if(c.hitMesh){
        c.hitMesh.geometry.dispose();
        c.hitMesh.geometry = new THREE.TubeGeometry(curve, 24, 0.16, 8, false);
      }
    }
  });
}

function getPacketMesh(color){
  const m = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 10), emissiveMat(color, 2.0));
  scene.add(m);
  return m;
}

function updatePackets(dt){
  connections.forEach(c=>{
    const curve = c.curveFn();
    if(!curve) return;
    c.packets.forEach(p=>{
      p.t += dt * p.speed;
      if(p.t > 1) p.t -= 1;
      if(!p.mesh) p.mesh = getPacketMesh(c.color);
      const pos = curve.getPointAt(Math.min(Math.max(p.t, 0), 1));
      p.mesh.position.copy(pos);
      const pulse = 0.85 + Math.sin(clock.elapsedTime * 6 + p.t * 10) * 0.15;
      p.mesh.scale.setScalar(pulse);
    });
  });
}

function selectConnectionPrompt(cid){
  const c = connections.get(cid);
  const ra = devices.get(c.a), rb = devices.get(c.b);
  if(!ra || !rb) return;
  if(confirm("Aloqa o'chirilsinmi?\n" + ra.name + " ↔ " + rb.name)){
    removeConnection(cid);
    toast("Ulanish o'chirildi");
    if(typeof refreshConnList === 'function') refreshConnList();
  }
}

/* ==========================================================================
   PORT SELECTION & CABLE TYPE MODAL
   ========================================================================== */
const portModal = document.getElementById('portSelectModal');
const portDevAName = document.getElementById('portDevAName');
const portDevBName = document.getElementById('portDevBName');
const portDevASelect = document.getElementById('portDevASelect');
const portDevBSelect = document.getElementById('portDevBSelect');
const cableTypeTabs = document.getElementById('cableTypeTabs');
const cableInfoText = document.getElementById('cableInfoText');
const portClose = document.getElementById('portClose');
const portCancelBtn = document.getElementById('portCancelBtn');
const portConnectBtn = document.getElementById('portConnectBtn');

let pendingPortDevAId = null;
let pendingPortDevBId = null;
let selectedCableType = 'auto';

function openPortSelectModal(devAId, devBId){
  const ra = devices.get(devAId);
  const rb = devices.get(devBId);
  if(!ra || !rb) return;

  pendingPortDevAId = devAId;
  pendingPortDevBId = devBId;

  portDevAName.textContent = `${ra.name} (${TYPES[ra.type].label})`;
  portDevBName.textContent = `${rb.name} (${TYPES[rb.type].label})`;

  portDevASelect.innerHTML = '';
  ra.ports.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = `${p.name} ${p.connectedTo ? '(Band 🔴)' : '(Bo‘sh 🟢)'}`;
    if(p.connectedTo) opt.disabled = true;
    portDevASelect.appendChild(opt);
  });
  const freeA = ra.ports.find(p => !p.connectedTo);
  if(freeA) portDevASelect.value = freeA.id;

  portDevBSelect.innerHTML = '';
  rb.ports.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = `${p.name} ${p.connectedTo ? '(Band 🔴)' : '(Bo‘sh 🟢)'}`;
    if(p.connectedTo) opt.disabled = true;
    portDevBSelect.appendChild(opt);
  });
  const freeB = rb.ports.find(p => !p.connectedTo);
  if(freeB) portDevBSelect.value = freeB.id;

  // Reset cable tabs to auto
  selectedCableType = 'auto';
  if(cableTypeTabs){
    cableTypeTabs.querySelectorAll('.proto-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.cable === 'auto');
    });
  }
  if(cableInfoText) cableInfoText.textContent = CABLE_DESCRIPTIONS.auto;

  portModal.classList.add('show');
}

function closePortSelectModal(){
  portModal.classList.remove('show');
  pendingPortDevAId = null;
  pendingPortDevBId = null;
  connectFirstId = null;
  linkRing.visible = false;
}

if(portClose) portClose.addEventListener('click', closePortSelectModal);
if(portCancelBtn) portCancelBtn.addEventListener('click', closePortSelectModal);

if(cableTypeTabs){
  cableTypeTabs.querySelectorAll('.proto-btn').forEach(btn => {
    btn.addEventListener('click', ()=>{
      cableTypeTabs.querySelectorAll('.proto-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedCableType = btn.dataset.cable;
      if(cableInfoText) cableInfoText.textContent = CABLE_DESCRIPTIONS[selectedCableType] || '';
    });
  });
}

if(portConnectBtn){
  portConnectBtn.addEventListener('click', ()=>{
    if(!pendingPortDevAId || !pendingPortDevBId) return;
    const pA = portDevASelect.value;
    const pB = portDevBSelect.value;
    if(!pA || !pB){
      toast("Ikkala qurilmadan ham bo‘sh port tanlang!");
      return;
    }
    addConnection(pendingPortDevAId, pendingPortDevBId, {
      portA: pA,
      portB: pB,
      cableType: selectedCableType
    });
    closePortSelectModal();
  });
}
