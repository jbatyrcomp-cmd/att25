/* ==========================================================================
   3D DEVICE MODELS, BUILDERS, LABELS & DEVICE MANAGEMENT
   ========================================================================== */

function buildRouter(c){
  const g = new THREE.Group();
  const body = box(1.7, 0.26, 1.05, mat(c));
  body.position.y = 0.15;
  g.add(body);
  [[-0.55, -0.32], [0.55, -0.32]].forEach(([x, z])=>{
    const ant = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 0.55, 8), mat(0x232B3A, {roughness:0.6}));
    ant.position.set(x, 0.28 + 0.27, z);
    ant.rotation.z = x < 0 ? 0.35 : -0.35;
    g.add(ant);
  });
  for(let i = 0; i < 4; i++){
    const led = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), emissiveMat(0x6FE3C4, 1.6));
    led.position.set(-0.55 + i * 0.35, 0.16, 0.53);
    g.add(led);
  }
  return g;
}

function buildModem(c){
  const g = new THREE.Group();
  const body = box(1.3, 0.32, 0.95, mat(c));
  body.position.y = 0.17;
  g.add(body);
  const ant = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 0.4, 8), mat(0x232B3A, {roughness:0.6}));
  ant.position.set(0.45, 0.33 + 0.2, -0.3);
  ant.rotation.z = -0.3;
  g.add(ant);
  for(let i = 0; i < 3; i++){
    const led = new THREE.Mesh(new THREE.SphereGeometry(0.032, 8, 8), emissiveMat(0xFF8C4B, 1.5));
    led.position.set(-0.4 + i * 0.32, 0.18, 0.49);
    g.add(led);
  }
  return g;
}

function buildServer(c){
  const g = new THREE.Group();
  const tower = box(0.95, 1.7, 0.95, mat(c));
  tower.position.y = 0.85;
  g.add(tower);
  for(let i = 0; i < 5; i++){
    const slot = box(0.72, 0.045, 0.02, mat(0x1B2230, {roughness:0.8, metalness:0.1}));
    slot.position.set(0, 0.35 + i * 0.22, 0.48);
    g.add(slot);
    const led = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), emissiveMat(i % 2 === 0 ? 0x6FE3C4 : 0xFFB454, 1.7));
    led.position.set(0.3, 0.35 + i * 0.22, 0.49);
    g.add(led);
  }
  return g;
}

function buildDesktop(c){
  const g = new THREE.Group();
  const tower = box(0.42, 1.0, 0.42, mat(c));
  tower.position.set(0.55, 0.5, 0);
  g.add(tower);
  const led = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 8), emissiveMat(0x6FE3C4, 1.6));
  led.position.set(0.55, 0.85, 0.22);
  g.add(led);
  const standPole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.35, 8), mat(0x232B3A));
  standPole.position.set(-0.35, 0.35, 0);
  g.add(standPole);
  const standBase = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.03, 16), mat(0x232B3A));
  standBase.position.set(-0.35, 0.18, 0);
  g.add(standBase);
  const monitor = box(0.85, 0.55, 0.05, mat(0x151B27, {roughness:0.5, metalness:0.4}));
  monitor.position.set(-0.35, 0.58, 0);
  g.add(monitor);
  const screen = box(0.75, 0.46, 0.01, emissiveMat(c, 0.7));
  screen.position.set(-0.35, 0.58, 0.03);
  g.add(screen);
  return g;
}

function buildLaptop(c){
  const g = new THREE.Group();
  const base = box(0.95, 0.06, 0.62, mat(c));
  base.position.y = 0.06;
  g.add(base);
  const hinge = new THREE.Group();
  hinge.position.set(0, 0.09, -0.30);
  const screen = box(0.95, 0.6, 0.035, mat(0x151B27, {roughness:0.5, metalness:0.4}));
  screen.position.set(0, 0.30, -0.01);
  screen.rotation.x = -0.35;
  hinge.add(screen);
  const disp = box(0.83, 0.48, 0.01, emissiveMat(c, 0.65));
  disp.position.set(0, 0.315, 0.01);
  disp.rotation.x = -0.35;
  hinge.add(disp);
  g.add(hinge);
  return g;
}

function buildPrinter(c){
  const g = new THREE.Group();
  const body = box(0.95, 0.5, 0.72, mat(c));
  body.position.y = 0.28;
  g.add(body);
  const tray = box(0.65, 0.05, 0.5, mat(0x232B3A));
  tray.position.set(0, 0.56, -0.05);
  g.add(tray);
  const slot = box(0.7, 0.02, 0.03, mat(0x0E141F));
  slot.position.set(0, 0.35, 0.37);
  g.add(slot);
  const led = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 8), emissiveMat(0xB07A2E, 1.6));
  led.position.set(0.35, 0.4, 0.37);
  g.add(led);
  return g;
}

function buildPhone(c){
  const g = new THREE.Group();
  const standBase = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.03, 16), mat(0x232B3A));
  standBase.position.y = 0.015;
  g.add(standBase);
  const body = box(0.26, 0.55, 0.03, mat(0x151B27, {roughness:0.4, metalness:0.5}));
  body.position.set(0, 0.32, 0);
  body.rotation.x = -0.18;
  g.add(body);
  const screen = box(0.21, 0.47, 0.01, emissiveMat(c, 0.7));
  screen.position.set(0, 0.325, 0.018);
  screen.rotation.x = -0.18;
  g.add(screen);
  return g;
}

function buildSwitch(c){
  const g = new THREE.Group();
  // 1U Rackmount Chassis Body
  const body = box(1.85, 0.22, 1.1, mat(c, {roughness:0.35, metalness:0.45}));
  body.position.y = 0.12;
  g.add(body);

  // Rackmount ears on both sides
  [[-0.95, 0.12], [0.95, 0.12]].forEach(([x, y])=>{
    const ear = box(0.06, 0.24, 0.35, mat(0x1B2332, {roughness:0.5, metalness:0.6}));
    ear.position.set(x, y, 0.35);
    g.add(ear);
    const hole1 = box(0.07, 0.04, 0.04, mat(0x0E141F));
    hole1.position.set(x, y + 0.06, 0.35);
    g.add(hole1);
    const hole2 = box(0.07, 0.04, 0.04, mat(0x0E141F));
    hole2.position.set(x, y - 0.06, 0.35);
    g.add(hole2);
  });

  // Front dark faceplate
  const faceplate = box(1.78, 0.18, 0.03, mat(0x111722, {roughness:0.7, metalness:0.2}));
  faceplate.position.set(0, 0.12, 0.555);
  g.add(faceplate);

  // Dual-row RJ45 Ethernet ports (16 ports)
  const portWidth = 0.08, portHeight = 0.045;
  for(let col = 0; col < 8; col++){
    const px = -0.55 + col * 0.12;
    const topPort = box(portWidth, portHeight, 0.02, mat(0x070B12, {roughness:0.9}));
    topPort.position.set(px, 0.155, 0.57);
    g.add(topPort);
    const btmPort = box(portWidth, portHeight, 0.02, mat(0x070B12, {roughness:0.9}));
    btmPort.position.set(px, 0.085, 0.57);
    g.add(btmPort);

    const ledColor = (col === 1 || col === 5) ? 0xFFB454 : 0x6FE3C4;
    const led = new THREE.Mesh(new THREE.SphereGeometry(0.016, 6, 6), emissiveMat(ledColor, 1.8));
    led.position.set(px, 0.19, 0.57);
    g.add(led);
  }

  // SFP+ 10G Optical Uplink cages
  for(let s = 0; s < 2; s++){
    const sfp = box(0.11, 0.10, 0.03, mat(0x2A3548, {metalness:0.8, roughness:0.25}));
    sfp.position.set(0.55 + s * 0.15, 0.12, 0.568);
    g.add(sfp);
    const sfpLed = new THREE.Mesh(new THREE.SphereGeometry(0.016, 6, 6), emissiveMat(0x4FC7E8, 2.0));
    sfpLed.position.set(0.55 + s * 0.15, 0.19, 0.57);
    g.add(sfpLed);
  }

  // System & Power Status LEDs
  const pwrLed = new THREE.Mesh(new THREE.SphereGeometry(0.02, 6, 6), emissiveMat(0x6FE3C4, 1.9));
  pwrLed.position.set(-0.76, 0.15, 0.57);
  g.add(pwrLed);
  const statLed = new THREE.Mesh(new THREE.SphereGeometry(0.02, 6, 6), emissiveMat(0x6FE3C4, 1.6));
  statLed.position.set(-0.76, 0.09, 0.57);
  g.add(statLed);

  // Top switching emblem
  const emblem = box(0.42, 0.008, 0.42, mat(0x182130, {roughness:0.4, metalness:0.5}));
  emblem.position.set(0, 0.232, 0);
  g.add(emblem);
  const arrowH = box(0.32, 0.01, 0.04, emissiveMat(c, 0.9));
  arrowH.position.set(0, 0.236, 0);
  g.add(arrowH);
  const arrowV = box(0.04, 0.01, 0.32, emissiveMat(c, 0.9));
  arrowV.position.set(0, 0.236, 0);
  g.add(arrowV);

  return g;
}

const BUILDERS = {
  router: buildRouter,
  switch: buildSwitch,
  modem: buildModem,
  server: buildServer,
  desktop: buildDesktop,
  laptop: buildLaptop,
  tablet: function(c){
    return (typeof MODELS_DB !== 'undefined' && MODELS_DB.tablet && MODELS_DB.tablet.tablet_stand)
      ? MODELS_DB.tablet.tablet_stand.builder(c)
      : buildPhone(c);
  },
  printer: buildPrinter,
  phone: buildPhone
};

/* Device Ports Initialization */
function initDevicePorts(rec){
  rec.ports = [];
  if(rec.type === 'switch'){
    for(let i = 1; i <= 24; i++) rec.ports.push({ id: `Fa0/${i}`, name: `FastEthernet0/${i}`, type: 'fastethernet', connectedTo: null });
    rec.ports.push({ id: 'Gi0/1', name: 'GigabitEthernet0/1 (SFP)', type: 'gigabit', connectedTo: null });
    rec.ports.push({ id: 'Gi0/2', name: 'GigabitEthernet0/2 (SFP)', type: 'gigabit', connectedTo: null });
  } else if(rec.type === 'router'){
    for(let i = 0; i < 4; i++) rec.ports.push({ id: `Gi0/${i}`, name: `GigabitEthernet0/${i}`, type: 'gigabit', connectedTo: null });
    rec.ports.push({ id: 'WLAN0', name: 'Wi-Fi AP (5GHz / 2.4GHz)', type: 'wireless', connectedTo: null });
  } else if(rec.type === 'server'){
    rec.ports.push({ id: 'Gi0/1', name: 'GigabitEthernet0/1 (10G)', type: 'gigabit', connectedTo: null });
    rec.ports.push({ id: 'Gi0/2', name: 'GigabitEthernet0/2 (10G)', type: 'gigabit', connectedTo: null });
  } else if(rec.type === 'modem'){
    rec.ports.push({ id: 'WAN', name: 'Internet (WAN DSL/Coax/GPON)', type: 'wan', connectedTo: null });
    rec.ports.push({ id: 'LAN1', name: 'LAN 1 (Ethernet)', type: 'fastethernet', connectedTo: null });
  } else if(rec.type === 'laptop'){
    rec.ports.push({ id: 'Fa0/1', name: 'FastEthernet0/1', type: 'fastethernet', connectedTo: null });
    rec.ports.push({ id: 'WLAN0', name: 'Wi-Fi (802.11ax)', type: 'wireless', connectedTo: null });
  } else if(rec.type === 'tablet'){
    rec.ports.push({ id: 'WLAN0', name: 'Wi-Fi (802.11ax/6E)', type: 'wireless', connectedTo: null });
  } else if(rec.type === 'phone'){
    rec.ports.push({ id: 'WLAN0', name: 'Wi-Fi (5GHz)', type: 'wireless', connectedTo: null });
  } else if(rec.type === 'printer'){
    rec.ports.push({ id: 'Fa0/1', name: 'FastEthernet0/1', type: 'fastethernet', connectedTo: null });
    rec.ports.push({ id: 'WLAN0', name: 'Wi-Fi (WLAN0)', type: 'wireless', connectedTo: null });
  } else { // desktop
    rec.ports.push({ id: 'Fa0/1', name: 'FastEthernet0/1', type: 'fastethernet', connectedTo: null });
  }
}

/* Labels DOM container */
const labelsEl = document.getElementById('labels');

/* Add / Remove Devices */
function addDevice(type, modelKey){
  if(devices.size >= 26){
    toast("Ko'p qurilma qo'shildi — birinchi tozalab qayta boshlang.");
    return;
  }
  const def = TYPES[type];
  
  // Check MODELS_DB for specific model
  let modelDef = null;
  if(typeof MODELS_DB !== 'undefined' && MODELS_DB[type]){
    if(modelKey && MODELS_DB[type][modelKey]){
      modelDef = MODELS_DB[type][modelKey];
    } else {
      // Pick first model as default
      const firstKey = Object.keys(MODELS_DB[type])[0];
      modelKey = firstKey;
      modelDef = MODELS_DB[type][firstKey];
    }
  }

  const group = (modelDef && typeof modelDef.builder === 'function')
    ? modelDef.builder(def.color)
    : BUILDERS[type](def.color);

  const pos = spawnPosition();
  group.position.copy(pos);
  const id = nextId();

  const pickMeshes = [];
  group.traverse(o=>{ if(o.isMesh){ o.userData.deviceId = id; pickMeshes.push(o); } });

  // Generous invisible hitbox so grabbing the device is easy
  const hitBox = new THREE.Mesh(new THREE.BoxGeometry(2.0, 2.6, 2.0), new THREE.MeshBasicMaterial({visible:false}));
  hitBox.position.y = 1.0;
  hitBox.userData.deviceId = id;
  group.add(hitBox);
  pickMeshes.push(hitBox);

  scene.add(group);

  const nameCount = [...devices.values()].filter(d => d.type === type).length + 1;
  const ip = type === "modem" ? wanIP() : nextIP();
  const rec = {
    id, type, group, pickMeshes, hitBox,
    modelKey: modelKey || 'default',
    modelName: modelDef ? modelDef.name : def.label,
    portOffset: group.userData.portOffset || new THREE.Vector3(0, def.port, 0),
    name: (modelDef ? modelDef.name : def.label) + (nameCount > 1 ? " " + nameCount : ""),
    ip: ip,
    mask: '255.255.255.0',
    gw: type === 'router' ? ip : '192.168.1.1',
    dns: '8.8.8.8',
    ipMode: 'static',
    inbox: [],
    mac: macAddr(),
    port: def.port,
  };
  initDevicePorts(rec);
  if(typeof initDeviceWifi === 'function') initDeviceWifi(rec);
  if(rec.type === 'switch' && typeof initSwitchVlans === 'function') initSwitchVlans(rec);
  if(rec.type === 'router' && typeof initRouterSubinterfaces === 'function') initRouterSubinterfaces(rec);
  devices.set(id, rec);

  const label = document.createElement('div');
  label.className = 'devlabel';
  label.innerHTML = `<span class="dot" style="background:#${def.color.toString(16).padStart(6,'0')}"></span><span class="nm">${rec.name}</span><span class="ip">${rec.ip}</span>`;
  labelsEl.appendChild(label);
  rec.label = label;

  toast((modelDef ? modelDef.name : def.label) + " qo'shildi");
  return rec;
}

function changeDeviceModel(deviceId, newModelKey){
  const rec = devices.get(deviceId);
  if(!rec) return;
  if(typeof MODELS_DB === 'undefined' || !MODELS_DB[rec.type] || !MODELS_DB[rec.type][newModelKey]) return;
  const modelDef = MODELS_DB[rec.type][newModelKey];

  // Remove existing visual children (except hitBox)
  const toRemove = [];
  rec.group.children.forEach(c => {
    if(c !== rec.hitBox) toRemove.push(c);
  });
  toRemove.forEach(c => rec.group.remove(c));

  // Build new 3D model
  const def = TYPES[rec.type];
  const newGroup = modelDef.builder(def.color);

  // portOffset ni bolalar ko'chirilishidan AVVAL saqlash (newGroup keyin bo'shaydi)
  const newPortOffset = newGroup.userData.portOffset;

  while(newGroup.children.length > 0){
    rec.group.add(newGroup.children[0]);
  }

  // Re-index pick meshes
  rec.pickMeshes = [];
  rec.group.traverse(o => {
    if(o.isMesh){
      o.userData.deviceId = rec.id;
      rec.pickMeshes.push(o);
    }
  });
  if(rec.hitBox) rec.pickMeshes.push(rec.hitBox);

  rec.modelKey = newModelKey;
  rec.modelName = modelDef.name;
  rec.portOffset = newPortOffset || new THREE.Vector3(0, def.port, 0);

  if(selectedDeviceId === rec.id && typeof refreshPanel === 'function'){
    refreshPanel();
  }
  if(typeof updateConnectionsGeometry === 'function'){
    updateConnectionsGeometry();
  }

  toast(`Model o‘zgartirildi: ${modelDef.name}`);
}
window.changeDeviceModel = changeDeviceModel;

function removeDevice(id){
  const rec = devices.get(id);
  if(!rec) return;

  for(let i = active3DTransfers.length - 1; i >= 0; i--){
    if(active3DTransfers[i].path && active3DTransfers[i].path.includes(id)){
      if(typeof cleanupTransfer === 'function') cleanupTransfer(i);
    }
  }

  [...connections.values()].filter(c => c.a === id || c.b === id).forEach(c => removeConnection(c.id));
  scene.remove(rec.group);
  rec.label.remove();
  devices.delete(id);

  if(selectedDeviceId === id){
    selectedDeviceId = null;
    selRing.visible = false;
    if(typeof closePanel === 'function') closePanel();
  }
  if(connectFirstId === id){
    connectFirstId = null;
    linkRing.visible = false;
  }
}

function flashDeviceLeds(devRec){
  if(!devRec || !devRec.group) return;
  devRec.group.traverse(o=>{
    if(o.isMesh && o.material && o.material.emissive){
      const orig = o.material.emissiveIntensity;
      o.material.emissiveIntensity = 3.5;
      setTimeout(()=>{
        if(o.material) o.material.emissiveIntensity = orig;
      }, 250);
    }
  });
}

/* Label & Ring Screen Position Updates */
const tmpV = new THREE.Vector3();

function updateLabels(){
  devices.forEach(rec=>{
    tmpV.copy(rec.group.position);
    tmpV.y += rec.port * 2 + 0.55;
    tmpV.project(camera);
    if(tmpV.z > 1){ rec.label.style.display = 'none'; return; }
    const x = (tmpV.x * 0.5 + 0.5) * window.innerWidth;
    const y = (-tmpV.y * 0.5 + 0.5) * window.innerHeight;
    rec.label.style.display = 'flex';
    rec.label.style.left = x + "px";
    rec.label.style.top = y + "px";

    // Update Wi-Fi indicator in label
    const wifiIndicator = rec.label.querySelector('.wifi-ind');
    const isWifiActive = rec.wifi && (rec.wifi.connectedSsid || (rec.wifi.enabled && (rec.wifi.isAp || rec.wifi.hotspotMode)));
    if(isWifiActive && !wifiIndicator){
      const sp = document.createElement('span');
      sp.className = 'wifi-ind';
      sp.textContent = '📶';
      sp.style.fontSize = '10px';
      sp.style.marginLeft = '2px';
      rec.label.appendChild(sp);
    } else if(!isWifiActive && wifiIndicator){
      wifiIndicator.remove();
    }
  });

  // Update floating 3D speech bubbles
  const now = Date.now();
  for(let i = activeSpeechBubbles.length - 1; i >= 0; i--){
    const sb = activeSpeechBubbles[i];
    if(now > sb.expiresAt){
      sb.el.remove();
      activeSpeechBubbles.splice(i, 1);
      continue;
    }
    const dev = devices.get(sb.devId);
    if(!dev || !dev.group){
      sb.el.remove();
      activeSpeechBubbles.splice(i, 1);
      continue;
    }
    tmpV.copy(dev.group.position);
    tmpV.y += dev.port * 2 + 1.25;
    tmpV.project(camera);
    if(tmpV.z > 1){ sb.el.style.display = 'none'; continue; }
    const x = (tmpV.x * 0.5 + 0.5) * window.innerWidth;
    const y = (-tmpV.y * 0.5 + 0.5) * window.innerHeight;
    sb.el.style.display = 'block';
    sb.el.style.left = x + "px";
    sb.el.style.top = y + "px";
  }
}

function updateRings(){
  if(selRing.visible && selectedDeviceId){
    const rec = devices.get(selectedDeviceId);
    if(rec) selRing.position.set(rec.group.position.x, 0.02, rec.group.position.z);
  }
  if(linkRing.visible && connectFirstId){
    const rec = devices.get(connectFirstId);
    if(rec) linkRing.position.set(rec.group.position.x, 0.02, rec.group.position.z);
  }
  const t = clock.elapsedTime;
  selRing.scale.setScalar(1 + Math.sin(t * 3) * 0.06);
  linkRing.scale.setScalar(1 + Math.sin(t * 4) * 0.08);
}
