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
    const p1 = ra.group.position.clone().add(ra.portOffset || new THREE.Vector3(0, ra.port, 0));
    const p2 = rb.group.position.clone().add(rb.portOffset || new THREE.Vector3(0, rb.port, 0));
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

  // Cable type handling from CABLE_TYPES_DB
  let cableType = opts.cableType || 'auto';
  if(cableType === 'auto'){
    if(wireless) cableType = 'wireless';
    else if(wan) cableType = 'wan';
    else if((ra.type === rb.type && (ra.type === 'router' || ra.type === 'desktop' || ra.type === 'switch')) || (ra.type === 'switch' && rb.type === 'switch')){
      cableType = 'crossover';
    } else if(portA.id.includes('Gi') && portB.id.includes('Gi') && (ra.type === 'server' || rb.type === 'server' || ra.type === 'switch')){
      cableType = 'fiber_single';
    } else {
      cableType = 'cat6';
    }
  }

  const cableDef = (typeof CABLE_TYPES_DB !== 'undefined' && CABLE_TYPES_DB[cableType])
    ? CABLE_TYPES_DB[cableType]
    : null;

  let mesh, hitMesh = null;
  let color = cableDef ? cableDef.color : 0x6FE3C4;
  if(wan) color = 0xFF8C4B;
  if(wireless) color = 0x4FC7E8;

  let connMeshA = null, connMeshB = null;

  if(wireless){
    const pts = curve.getPoints(40);
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const lmat = new THREE.LineDashedMaterial({ color, dashSize: 0.22, gapSize: 0.14, linewidth: 1, transparent: true, opacity: 0.85 });
    mesh = new THREE.Line(geo, lmat);
    mesh.computeLineDistances();
  } else {
    const tubeRadius = cableDef ? (cableDef.diameter || 0.035) : wan ? 0.05 : 0.035;
    const geo = new THREE.TubeGeometry(curve, 28, tubeRadius, 8, false);
    mesh = new THREE.Mesh(geo, mat(color, { roughness: 0.4, metalness: cableType.includes('fiber') ? 0.6 : 0.2, emissive: color, emissiveIntensity: cableType.includes('fiber') ? 0.45 : 0.12 }));
    const hitGeo = new THREE.TubeGeometry(curve, 28, 0.16, 8, false);
    hitMesh = new THREE.Mesh(hitGeo, new THREE.MeshBasicMaterial({ visible: false }));
    hitMesh.userData.connectionId = id;
    scene.add(hitMesh);

    // 3D Physical Connectors at both cable ends
    if(typeof buildConnectorMesh === 'function'){
      const cType = cableDef ? cableDef.connectorType : 'rj45_transparent';
      connMeshA = buildConnectorMesh(cType);
      connMeshB = buildConnectorMesh(cType);
      connMeshA.position.copy(curve.getPoint(0.01));
      connMeshA.lookAt(curve.getPoint(0.06));
      connMeshB.position.copy(curve.getPoint(0.99));
      connMeshB.lookAt(curve.getPoint(0.94));
      scene.add(connMeshA);
      scene.add(connMeshB);
    }
  }
  scene.add(mesh);

  // Link ports
  portA.connectedTo = { devId: b, portId: portB.id, connId: id };
  portB.connectedTo = { devId: a, portId: portA.id, connId: id };

  const packets = [];
  const pn = wan ? 2 : 1;
  for(let i = 0; i < pn; i++) packets.push({ t: Math.random(), speed: (cableType.includes('fiber') ? 0.22 : 0.12) + Math.random() * 0.1, mesh: null });

  connections.set(id, { id, a, b, portA: portA.id, portB: portB.id, cableType, wireless, wan, mesh, hitMesh, connMeshA, connMeshB, packets, curveFn, sag, color });
  const cableName = cableDef ? cableDef.name : cableType;
  toast(`Ulanish yaratildi: ${ra.name} [${portA.id}] ↔ ${rb.name} [${portB.id}] (${cableName})`);

  if(!opts._remote && typeof Multiplayer !== 'undefined' && Multiplayer.active){
    Multiplayer.broadcast({
      type: 'topo_connect',
      fromId: a,
      toId: b,
      portA: portA.id,
      portB: portB.id,
      cableType: cableType
    });
  }
}

function removeConnection(cid, opts = {}){
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
  if(c.connMeshA) scene.remove(c.connMeshA);
  if(c.connMeshB) scene.remove(c.connMeshB);
  c.mesh.geometry.dispose();
  if(c.hitMesh) c.hitMesh.geometry.dispose();
  connections.delete(cid);

  if(!opts._remote && typeof Multiplayer !== 'undefined' && Multiplayer.active){
    Multiplayer.broadcast({
      type: 'topo_remove_connection',
      connId: cid,
      a: c.a,
      b: c.b
    });
  }
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
      // cableDef dan to'g'ri tubeRadius ni olish (fiber va boshqa kabellar uchun)
      const cableDef = (typeof CABLE_TYPES_DB !== 'undefined' && CABLE_TYPES_DB[c.cableType])
        ? CABLE_TYPES_DB[c.cableType] : null;
      const tubeRadius = cableDef ? (cableDef.diameter || 0.035) : c.wan ? 0.05 : 0.035;

      c.mesh.geometry.dispose();
      c.mesh.geometry = new THREE.TubeGeometry(curve, 28, tubeRadius, 8, false);
      if(c.hitMesh){
        c.hitMesh.geometry.dispose();
        c.hitMesh.geometry = new THREE.TubeGeometry(curve, 28, 0.16, 8, false);
      }
      if(c.connMeshA){
        c.connMeshA.position.copy(curve.getPoint(0.01));
        c.connMeshA.lookAt(curve.getPoint(0.06));
      }
      if(c.connMeshB){
        c.connMeshB.position.copy(curve.getPoint(0.99));
        c.connMeshB.lookAt(curve.getPoint(0.94));
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
let activeSelectedCable = 'auto';
let selectedConnectionId = null;

/* --------------------------------------------------------------------------
   CABLE COMPATIBILITY & VALIDATION ENGINE
   Determines valid cables based on physical port types & device roles
   -------------------------------------------------------------------------- */
function getCompatibleCables(ra, portA, rb, portB){
  if(!ra || !rb || !portA || !portB) {
    return { compatible: ['auto'], recommended: 'auto', reasons: {} };
  }

  const reasons = {};

  // 1. Console Port Check
  const isConsoleA = (portA.id && portA.id.toLowerCase().includes('console')) || portA.type === 'console';
  const isConsoleB = (portB.id && portB.id.toLowerCase().includes('console')) || portB.type === 'console';
  if(isConsoleA || isConsoleB){
    return {
      compatible: ['console'],
      recommended: 'console',
      reasons: {
        auto: 'Konsol porti uchun faqat Cisco Console (Rollover) kabeli mos keladi',
        cat6: 'Konsol portiga RJ-45 to‘g‘ri Ethernet ulanmaydi',
        cat7: 'Konsol portiga ekranli Cat7 ulanmaydi',
        fiber_single: 'Konsol porti optik tolani qo‘llab-quvvatlamaydi',
        fiber_multi: 'Konsol porti optik tolani qo‘llab-quvvatlamaydi',
        dac_twinax: 'Konsol porti SFP+ Twinax kabelni qo‘llab-quvvatlamaydi',
        crossover: 'Konsol portiga Crossover kabel ulanmaydi'
      }
    };
  }

  // 2. Fiber / SFP / 10G Ports Check
  const isFiberA = portA.type === 'fiber' || portA.type === 'sfp' || (portA.id && portA.id.startsWith('Gi') && (ra.type === 'server' || ra.type === 'switch'));
  const isFiberB = portB.type === 'fiber' || portB.type === 'sfp' || (portB.id && portB.id.startsWith('Gi') && (rb.type === 'server' || rb.type === 'switch'));

  if(isFiberA && isFiberB){
    return {
      compatible: ['auto', 'fiber_single', 'fiber_multi', 'dac_twinax'],
      recommended: 'fiber_single',
      reasons: {
        console: 'Faqat boshqaruv konsol porti uchun',
        cat6: 'SFP/Optik portlarga to‘g‘ridan-to‘g‘ri RJ-45 mis kabel ulanmaydi (SFP optik modul yoki DAC kerak)',
        cat7: 'SFP/Optik portlarga to‘g‘ridan-to‘g‘ri RJ-45 mis kabel ulanmaydi',
        crossover: 'SFP/Optik portlar Crossover kabelni qo‘llab-quvvatlamaydi'
      }
    };
  }

  // 3. Copper RJ-45 Ethernet (FastEthernet / GigabitEthernet RJ-45)
  const sameLayer = (ra.type === rb.type && (ra.type === 'desktop' || ra.type === 'router')) || (ra.type === 'switch' && rb.type === 'switch');
  const recommended = sameLayer ? 'crossover' : 'cat6';

  return {
    compatible: ['auto', 'cat6', 'cat7', 'crossover'],
    recommended: recommended,
    reasons: {
      console: 'Faqat boshqaruv konsol porti uchun mo‘ljallangan',
      fiber_single: 'RJ-45 mis port optik LC konnektoriga mos kelmaydi',
      fiber_multi: 'RJ-45 mis port optik LC konnektoriga mos kelmaydi',
      dac_twinax: 'SFP+ Twinax faqat SFP cage slotlariga ulanadi'
    }
  };
}

/* --------------------------------------------------------------------------
   PORT & CABLE SELECTION MODAL
   -------------------------------------------------------------------------- */
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

  // Use activeSelectedCable from toolbar if set, otherwise auto
  selectedCableType = activeSelectedCable || 'auto';

  // Function to refresh cable options and highlight compatible ones
  function refreshModalCables(){
    const pA = ra.ports.find(p => p.id === portDevASelect.value) || ra.ports[0];
    const pB = rb.ports.find(p => p.id === portDevBSelect.value) || rb.ports[0];
    const comp = getCompatibleCables(ra, pA, rb, pB);

    // If current selected cable is not compatible, switch to recommended
    if(!comp.compatible.includes(selectedCableType)){
      selectedCableType = comp.recommended || 'auto';
    }

    const grid = document.getElementById('cableSelectGrid');
    if(grid && typeof CABLE_TYPES_DB !== 'undefined'){
      grid.innerHTML = '';

      // Auto Option Card
      const autoCard = buildCableModalCard({
        id: 'auto',
        name: '⚡ Avtomatik (Auto MDI/MDI-X)',
        hexColor: '#00FF87',
        speed: 'Optimal standart',
        desc: 'Port turini avtomatik aniqlash va eng mos kabelni ulash'
      }, true, comp.recommended === 'auto', '');
      grid.appendChild(autoCard);

      // Specific Cables Cards
      Object.keys(CABLE_TYPES_DB).forEach(k => {
        const c = CABLE_TYPES_DB[k];
        const isComp = comp.compatible.includes(k);
        const isRec = comp.recommended === k;
        const reason = comp.reasons[k] || '';
        const card = buildCableModalCard(c, isComp, isRec, reason);
        grid.appendChild(card);
      });
    }

    if(cableInfoText){
      const recDef = (typeof CABLE_TYPES_DB !== 'undefined' && CABLE_TYPES_DB[comp.recommended]) ? CABLE_TYPES_DB[comp.recommended] : null;
      cableInfoText.innerHTML = `<b>Tavsiya etiladi:</b> ${recDef ? recDef.name : 'Avtomatik aniqlash'}`;
    }
  }

  portDevASelect.onchange = refreshModalCables;
  portDevBSelect.onchange = refreshModalCables;
  refreshModalCables();

  portModal.classList.add('show');
}

function buildCableModalCard(c, isComp, isRec, reason){
  const card = document.createElement('div');
  card.className = 'cable-select-card' + (isComp ? ' compatible' : ' disabled') + (selectedCableType === c.id ? ' active' : '');
  card.dataset.cable = c.id;

  let badgeHtml = '';
  if(isRec){
    badgeHtml = `<span class="cable-badge rec">⭐ Tavsiya etiladi</span>`;
  } else if(isComp){
    badgeHtml = `<span class="cable-badge ok">🟢 Mos keladi</span>`;
  } else {
    badgeHtml = `<span class="cable-badge no" title="${reason}">⚠️ Mos emas</span>`;
  }

  card.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
      <div style="display:flex; align-items:center; gap:6px;">
        <span class="cable-dot" style="background:${c.hexColor || '#38BDF8'};"></span>
        <b style="font-size:11.5px; color:var(--ink);">${c.name}</b>
      </div>
      ${badgeHtml}
    </div>
    <div style="font-size:10px; color:var(--ink-dim);">${c.speed ? `Tezlik: ${c.speed}` : ''}</div>
    ${reason ? `<div style="font-size:9.5px; color:#F87171; margin-top:2px;">${reason}</div>` : ''}
  `;

  if(isComp){
    card.addEventListener('click', ()=>{
      selectedCableType = c.id;
      const grid = document.getElementById('cableSelectGrid');
      if(grid) grid.querySelectorAll('.cable-select-card').forEach(el => el.classList.remove('active'));
      card.classList.add('active');
      if(cableInfoText) cableInfoText.innerHTML = `<b>Tanlandi:</b> ${c.name} (${c.desc || ''})`;
    });
  } else {
    card.addEventListener('click', ()=>{
      if(typeof toast === 'function'){
        toast(`⚠️ Ushbu kabel tanlangan portlarga mos kelmaydi: ${reason}`);
      }
    });
  }

  return card;
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

/* --------------------------------------------------------------------------
   TOOLBAR CABLE SELECTOR
   -------------------------------------------------------------------------- */
function selectActiveCable(type){
  activeSelectedCable = type;
  selectedCableType = type;
  connectMode = true;
  const connectBtn = document.getElementById('connectModeBtn');
  if(connectBtn) connectBtn.classList.add('on');
  connectFirstId = null;
  linkRing.visible = false;

  const cableMenu = document.getElementById('cableMenu');
  if(cableMenu) cableMenu.classList.remove('show');

  const cableDef = (typeof CABLE_TYPES_DB !== 'undefined' && CABLE_TYPES_DB[type]) ? CABLE_TYPES_DB[type] : null;
  const name = cableDef ? cableDef.name : 'Avtomatik kabel';
  toast(`🔌 Kabel tanlandi: "${name}" — ulamoqchi bo‘lgan 1-qurilmani bosing`);
}

/* --------------------------------------------------------------------------
   3D CABLE INSPECTOR & SELECTION
   -------------------------------------------------------------------------- */
function selectConnection(connId){
  const c = connections.get(connId);
  if(!c) return;

  selectedConnectionId = connId;

  // Deselect device and room panels
  if(typeof closePanel === 'function') closePanel();
  if(typeof deselectRoom === 'function') deselectRoom();

  openCablePanel(c);
}

function deselectConnection(){
  selectedConnectionId = null;
  closeCablePanel();
}

function openCablePanel(c){
  const cablePanel = document.getElementById('cablePanel');
  if(!cablePanel) return;

  cablePanel.classList.add('show');
  syncCablePanelValues(c);
}

function closeCablePanel(){
  const cablePanel = document.getElementById('cablePanel');
  if(cablePanel) cablePanel.classList.remove('show');
}

function calculateCableLength(c){
  if(!c || !c.curveFn) return 5.0;
  const curve = c.curveFn();
  if(!curve) return 5.0;
  return (curve.getLength ? curve.getLength() : 5.0) * 1.8;
}

function syncCablePanelValues(c){
  if(!c) return;

  const ra = devices.get(c.a);
  const rb = devices.get(c.b);
  const cableDef = (typeof CABLE_TYPES_DB !== 'undefined' && CABLE_TYPES_DB[c.cableType]) ? CABLE_TYPES_DB[c.cableType] : null;

  const cableTitle = document.getElementById('cableTitle');
  if(cableTitle) cableTitle.textContent = cableDef ? cableDef.name : 'Tarmoq Kabeli';

  const cableTypeBadge = document.getElementById('cableTypeBadge');
  if(cableTypeBadge){
    cableTypeBadge.textContent = c.cableType.toUpperCase();
    cableTypeBadge.style.color = cableDef ? cableDef.hexColor : '#38BDF8';
  }

  const lengthM = calculateCableLength(c);
  const delayMs = (lengthM * 0.005).toFixed(3);

  const cableLengthVal = document.getElementById('cableLengthVal');
  if(cableLengthVal) cableLengthVal.textContent = `${lengthM.toFixed(1)} metr`;

  const cableDelayVal = document.getElementById('cableDelayVal');
  if(cableDelayVal) cableDelayVal.textContent = `${delayMs} ms`;

  const cableSpeedVal = document.getElementById('cableSpeedVal');
  if(cableSpeedVal) cableSpeedVal.textContent = cableDef ? cableDef.speed : '1 Gbps';

  const cableEndpointsVal = document.getElementById('cableEndpointsVal');
  if(cableEndpointsVal && ra && rb){
    cableEndpointsVal.innerHTML = `<b>${ra.name}</b> [${c.portA}] ↔ <b>${rb.name}</b> [${c.portB}]`;
  }

  // Populate Switchable Cable Types (only compatible ones!)
  const cableChangeSelect = document.getElementById('cableChangeSelect');
  if(cableChangeSelect && ra && rb){
    cableChangeSelect.innerHTML = '';
    const pA = ra.ports.find(p => p.id === c.portA) || ra.ports[0];
    const pB = rb.ports.find(p => p.id === c.portB) || rb.ports[0];
    const comp = getCompatibleCables(ra, pA, rb, pB);

    comp.compatible.forEach(k => {
      const opt = document.createElement('option');
      opt.value = k;
      const def = (typeof CABLE_TYPES_DB !== 'undefined' && CABLE_TYPES_DB[k]) ? CABLE_TYPES_DB[k] : null;
      opt.textContent = def ? def.name : k;
      if(c.cableType === k) opt.selected = true;
      cableChangeSelect.appendChild(opt);
    });
  }
}

function changeConnectionCableType(connId, newCableType){
  const c = connections.get(connId);
  if(!c) return;

  const ra = devices.get(c.a);
  const rb = devices.get(c.b);
  if(!ra || !rb) return;

  const pA = ra.ports.find(p => p.id === c.portA) || ra.ports[0];
  const pB = rb.ports.find(p => p.id === c.portB) || rb.ports[0];
  const comp = getCompatibleCables(ra, pA, rb, pB);

  if(!comp.compatible.includes(newCableType)){
    toast(`⚠️ Bu kabel turi mos kelmaydi: ${comp.reasons[newCableType] || ''}`);
    return;
  }

  const oldA = c.a, oldB = c.b, oldPA = c.portA, oldPB = c.portB;
  removeConnection(connId);
  addConnection(oldA, oldB, { portA: oldPA, portB: oldPB, cableType: newCableType });

  const newConn = getConnectionBetween(oldA, oldB);
  if(newConn) selectConnection(newConn.id);

  const cableDef = (typeof CABLE_TYPES_DB !== 'undefined' && CABLE_TYPES_DB[newCableType]) ? CABLE_TYPES_DB[newCableType] : null;
  toast(`Kabel almashtirildi: ${cableDef ? cableDef.name : newCableType}`);
}

/* --------------------------------------------------------------------------
   SETUP CABLE EVENTS & CLICK LISTENERS
   -------------------------------------------------------------------------- */
function setupCableEvents(){
  const cableCloseBtn = document.getElementById('cableCloseBtn');
  if(cableCloseBtn) cableCloseBtn.addEventListener('click', deselectConnection);

  const cableDeleteBtn = document.getElementById('cableDeleteBtn');
  if(cableDeleteBtn){
    cableDeleteBtn.addEventListener('click', ()=>{
      if(!selectedConnectionId) return;
      if(confirm("Ushbu kabel uzilsinmi?")){
        const cid = selectedConnectionId;
        deselectConnection();
        removeConnection(cid);
        toast("Kabel uzildi");
      }
    });
  }

  const cableChangeSelect = document.getElementById('cableChangeSelect');
  if(cableChangeSelect){
    cableChangeSelect.addEventListener('change', ()=>{
      if(!selectedConnectionId) return;
      changeConnectionCableType(selectedConnectionId, cableChangeSelect.value);
    });
  }

  // Toolbar Cable Dropdown
  const cableMenuBtn = document.getElementById('cableMenuBtn');
  const cableMenu = document.getElementById('cableMenu');
  if(cableMenuBtn && cableMenu){
    cableMenuBtn.addEventListener('click', (e)=>{
      e.stopPropagation();
      cableMenu.classList.toggle('show');
    });
    document.addEventListener('click', ()=>{ cableMenu.classList.remove('show'); });
  }

  // Raycaster click listener for 3D cables
  if(typeof canvas !== 'undefined'){
    canvas.addEventListener('pointerdown', (e)=>{
      if(e.button !== 0) return;
      if(typeof connectMode !== 'undefined' && connectMode) return; // in connect mode, click is for devices

      const rect = canvas.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);

      const hitMeshes = [];
      connections.forEach(c => {
        if(c.hitMesh) hitMeshes.push(c.hitMesh);
      });

      if(hitMeshes.length > 0){
        const hits = raycaster.intersectObjects(hitMeshes, false);
        if(hits.length > 0){
          const cid = hits[0].object.userData.connectionId;
          if(cid){
            selectConnection(cid);
            e.stopPropagation();
            return;
          }
        }
      }

      if(selectedConnectionId && !e.target.closest('#cablePanel')){
        deselectConnection();
      }
    });
  }
}

// Auto-init
if(typeof window !== 'undefined'){
  window.selectActiveCable = selectActiveCable;
  window.selectConnection = selectConnection;
  window.deselectConnection = deselectConnection;
  window.changeConnectionCableType = changeConnectionCableType;

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', setupCableEvents);
  } else {
    setTimeout(setupCableEvents, 200);
  }
}
