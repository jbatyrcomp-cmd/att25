/* ==========================================================================
   THREE.JS 3D SCENE SETUP & PROCEDURAL MOTHERBOARD COMPONENTS
   ========================================================================== */
const canvas = document.getElementById('scene');
const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:false});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x060B08);
scene.fog = new THREE.FogExp2(0x060B08, 0.035);

const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);
let camTheta = Math.PI * 0.25, camPhi = Math.PI * 0.35, camRadius = 14;
const camTarget = new THREE.Vector3(0, 0, 0);

function updateCamera(){
  const x = camRadius * Math.sin(camPhi) * Math.sin(camTheta);
  const y = camRadius * Math.cos(camPhi);
  const z = camRadius * Math.sin(camPhi) * Math.cos(camTheta);
  camera.position.set(x, y, z).add(camTarget);
  camera.lookAt(camTarget);
}
updateCamera();

/* Lighting */
const ambientLight = new THREE.AmbientLight(0x243E2E, 1.4);
scene.add(ambientLight);

const mainSpot = new THREE.DirectionalLight(0x00FF87, 1.2);
mainSpot.position.set(8, 15, 8);
mainSpot.castShadow = true;
scene.add(mainSpot);

const fillLight = new THREE.DirectionalLight(0x38BDF8, 0.8);
fillLight.position.set(-10, 8, -6);
scene.add(fillLight);

const goldLight = new THREE.PointLight(0xFBBF24, 1.2, 12);
goldLight.position.set(0, 3, 0);
scene.add(goldLight);

/* Helper Box */
function createBox(w, h, d, color, matOpts={}){
  const geo = new THREE.BoxGeometry(w, h, d);
  const mat = new THREE.MeshStandardMaterial({
    color, roughness:0.4, metalness:0.3, ...matOpts
  });
  const m = new THREE.Mesh(geo, mat);
  m.castShadow = true; m.receiveShadow = true;
  return m;
}

/* 1. PCB Mainboard Base */
const pcbWidth = 9.4, pcbLength = 9.4, pcbThick = 0.12;
const pcbGeo = new THREE.BoxGeometry(pcbWidth, pcbThick, pcbLength);
const pcbMat = new THREE.MeshStandardMaterial({
  color: 0x0A1810, roughness: 0.6, metalness: 0.2
});
const pcb = new THREE.Mesh(pcbGeo, pcbMat);
pcb.position.y = -pcbThick/2;
pcb.receiveShadow = true;
scene.add(pcb);

/* Golden silkscreen grid tracks */
const gridHelper = new THREE.GridHelper(pcbWidth * 0.95, 24, 0x00E676, 0x143320);
gridHelper.position.y = 0.01;
scene.add(gridHelper);

/* Procedural Components Assembly */
const pickableMeshes = [];
const componentGroups = {};

/* 2. CPU Socket & Processor Assembly */
const cpuGroup = new THREE.Group();
cpuGroup.position.set(0, 0, -1.6);
cpuGroup.userData = { compKey: 'cpu' };

const socketBase = createBox(2.6, 0.16, 2.6, 0x1A2520, {roughness:0.7});
cpuGroup.add(socketBase);

const ihs = createBox(2.1, 0.18, 2.1, 0xC8D3CC, {roughness:0.25, metalness:0.85});
ihs.position.y = 0.12;
cpuGroup.add(ihs);

const dieGlow = createBox(0.9, 0.02, 0.9, 0x00E676, {emissive:0x00E676, emissiveIntensity:0.8});
dieGlow.position.y = 0.22;
cpuGroup.add(dieGlow);

scene.add(cpuGroup);
componentGroups.cpu = cpuGroup;
cpuGroup.traverse(o => { if(o.isMesh) { o.userData.compKey = 'cpu'; pickableMeshes.push(o); } });

/* 3. VRM Power Delivery */
const vrmGroup = new THREE.Group();
vrmGroup.position.set(-2.4, 0, -1.6);
vrmGroup.userData = { compKey: 'vrm' };

const vrmHeatsink = createBox(0.9, 0.9, 3.2, 0x101712, {roughness:0.3, metalness:0.7});
vrmHeatsink.position.set(-0.2, 0.45, 0);
vrmGroup.add(vrmHeatsink);

for(let f = -1.3; f <= 1.3; f += 0.3){
  const fin = createBox(0.85, 0.2, 0.06, 0x00E676, {emissive:0x00E676, emissiveIntensity:0.3});
  fin.position.set(-0.2, 0.85, f);
  vrmGroup.add(fin);
}

for(let c = -1.2; c <= 1.2; c += 0.45){
  const choke = createBox(0.32, 0.32, 0.32, 0x222C26, {roughness:0.5});
  choke.position.set(0.48, 0.16, c);
  vrmGroup.add(choke);
}

scene.add(vrmGroup);
componentGroups.vrm = vrmGroup;
vrmGroup.traverse(o => { if(o.isMesh) { o.userData.compKey = 'vrm'; pickableMeshes.push(o); } });

/* 4. RAM Slots & Dual DDR5 Sticks */
const ramGroup = new THREE.Group();
ramGroup.position.set(2.4, 0, -1.6);
ramGroup.userData = { compKey: 'ram' };

for(let s = -0.6; s <= 0.6; s += 0.4){
  const slot = createBox(0.18, 0.25, 3.4, 0x16201A, {roughness:0.8});
  slot.position.set(s, 0.12, 0);
  ramGroup.add(slot);
}

[-0.2, 0.2].forEach(posX => {
  const stick = createBox(0.12, 0.7, 3.2, 0x1A2920, {roughness:0.4, metalness:0.5});
  stick.position.set(posX, 0.45, 0);
  ramGroup.add(stick);

  const rgbBar = createBox(0.13, 0.08, 3.1, 0x00FF87, {emissive:0x00FF87, emissiveIntensity:0.9});
  rgbBar.position.set(posX, 0.82, 0);
  ramGroup.add(rgbBar);
});

scene.add(ramGroup);
componentGroups.ram = ramGroup;
ramGroup.traverse(o => { if(o.isMesh) { o.userData.compKey = 'ram'; pickableMeshes.push(o); } });

/* 5. PCIe 5.0 x16 Slot & GPU Interface */
const gpuGroup = new THREE.Group();
gpuGroup.position.set(0, 0, 1.6);
gpuGroup.userData = { compKey: 'gpu' };

const pcieSlot = createBox(5.6, 0.28, 0.28, 0xA0B0A8, {roughness:0.3, metalness:0.8});
pcieSlot.position.set(0, 0.14, 0);
gpuGroup.add(pcieSlot);

const gpuBoard = createBox(5.2, 0.5, 0.08, 0x0E2616, {roughness:0.5});
gpuBoard.position.set(0, 0.42, 0);
gpuGroup.add(gpuBoard);

const contacts = createBox(4.8, 0.06, 0.09, 0xFBBF24, {metalness:0.9, roughness:0.2});
contacts.position.set(0, 0.16, 0);
gpuGroup.add(contacts);

scene.add(gpuGroup);
componentGroups.gpu = gpuGroup;
gpuGroup.traverse(o => { if(o.isMesh) { o.userData.compKey = 'gpu'; pickableMeshes.push(o); } });

/* 6. M.2 NVMe SSD Slot & Thermal Armor */
const ssdGroup = new THREE.Group();
ssdGroup.position.set(0, 0, 0.35);
ssdGroup.userData = { compKey: 'ssd' };

const m2Heatsink = createBox(3.2, 0.16, 0.85, 0x1A2520, {roughness:0.3, metalness:0.7});
m2Heatsink.position.set(0, 0.1, 0);
ssdGroup.add(m2Heatsink);

const m2Stripe = createBox(2.8, 0.02, 0.08, 0x00E676, {emissive:0x00E676, emissiveIntensity:0.7});
m2Stripe.position.set(0, 0.19, 0);
ssdGroup.add(m2Stripe);

scene.add(ssdGroup);
componentGroups.ssd = ssdGroup;
ssdGroup.traverse(o => { if(o.isMesh) { o.userData.compKey = 'ssd'; pickableMeshes.push(o); } });

/* 7. Chipset PCH & Heatsink */
const chipsetGroup = new THREE.Group();
chipsetGroup.position.set(2.6, 0, 2.6);
chipsetGroup.userData = { compKey: 'chipset' };

const pchHeatsink = createBox(2.0, 0.35, 2.0, 0x152219, {roughness:0.3, metalness:0.7});
pchHeatsink.position.set(0, 0.18, 0);
chipsetGroup.add(pchHeatsink);

const pchGlow = createBox(0.9, 0.02, 0.9, 0xFBBF24, {emissive:0xFBBF24, emissiveIntensity:0.7});
pchGlow.position.set(0, 0.36, 0);
chipsetGroup.add(pchGlow);

scene.add(chipsetGroup);
componentGroups.chipset = chipsetGroup;
chipsetGroup.traverse(o => { if(o.isMesh) { o.userData.compKey = 'chipset'; pickableMeshes.push(o); } });

/* 8. Logic Circuit Matrix (ALU / Logic Gates) */
const logicGroup = new THREE.Group();
logicGroup.position.set(-2.8, 0, 2.8);
logicGroup.userData = { compKey: 'logic' };

const logicBase = createBox(1.8, 0.14, 1.8, 0x16241C, {roughness:0.5});
logicBase.position.set(0, 0.08, 0);
logicGroup.add(logicBase);

for(let px = -0.7; px <= 0.7; px += 0.35){
  for(let pz = -0.7; pz <= 0.7; pz += 0.35){
    const led = createBox(0.12, 0.06, 0.12, 0x38BDF8, {emissive:0x38BDF8, emissiveIntensity:0.6});
    led.position.set(px, 0.16, pz);
    logicGroup.add(led);
  }
}

scene.add(logicGroup);
componentGroups.logic = logicGroup;
logicGroup.traverse(o => { if(o.isMesh) { o.userData.compKey = 'logic'; pickableMeshes.push(o); } });

/* Selection highlight wireframe box */
const selBoxGeo = new THREE.BoxGeometry(1, 1, 1);
const selBoxMat = new THREE.MeshBasicMaterial({color:0x00FF87, wireframe:true, transparent:true, opacity:0.85});
const selBox = new THREE.Mesh(selBoxGeo, selBoxMat);
selBox.visible = false;
scene.add(selBox);

/* Data buses & animated signal particles */
const busLines = [
  { from: new THREE.Vector3(1.1, 0.04, -1.6), to: new THREE.Vector3(1.8, 0.04, -1.6), color: 0x00E676, speed: 2.8 },
  { from: new THREE.Vector3(-1.8, 0.04, -1.6), to: new THREE.Vector3(-1.1, 0.04, -1.6), color: 0xFBBF24, speed: 2.2 },
  { from: new THREE.Vector3(0, 0.04, -0.4), to: new THREE.Vector3(0, 0.04, 1.4), color: 0x38BDF8, speed: 3.2 },
  { from: new THREE.Vector3(0.8, 0.04, -0.8), to: new THREE.Vector3(2.4, 0.04, 1.8), color: 0x00FF87, speed: 2.5 },
  { from: new THREE.Vector3(1.8, 0.04, 2.6), to: new THREE.Vector3(-1.8, 0.04, 2.8), color: 0x00E676, speed: 2.0 }
];

const particleSystem = [];
const particleGeo = new THREE.SphereGeometry(0.06, 8, 8);

busLines.forEach(bus => {
  const points = [bus.from, bus.to];
  const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
  const lineMat = new THREE.LineBasicMaterial({color: bus.color, transparent:true, opacity:0.65});
  const line = new THREE.Line(lineGeo, lineMat);
  scene.add(line);

  for(let i=0; i<3; i++){
    const pMat = new THREE.MeshBasicMaterial({color: bus.color});
    const pMesh = new THREE.Mesh(particleGeo, pMat);
    scene.add(pMesh);
    particleSystem.push({
      mesh: pMesh,
      from: bus.from,
      to: bus.to,
      t: i * 0.33,
      speed: bus.speed
    });
  }
});

/* Floating 3D Labels */
const labelsContainer = document.getElementById('labels');
const LABEL_DEFS = [
  { key: 'cpu', text: 'CPU Socket', tag: 'LGA 1700', pos: new THREE.Vector3(0, 0.6, -1.6) },
  { key: 'vrm', text: 'VRM Quvvat', tag: '16-Faza', pos: new THREE.Vector3(-2.4, 1.1, -1.6) },
  { key: 'ram', text: 'DDR5 RAM', tag: '6400 MT/s', pos: new THREE.Vector3(2.4, 1.1, -1.6) },
  { key: 'gpu', text: 'PCIe 5.0 x16', tag: '64 GB/s', pos: new THREE.Vector3(0, 0.6, 1.6) },
  { key: 'ssd', text: 'M.2 NVMe', tag: 'Gen4 x4', pos: new THREE.Vector3(0, 0.4, 0.35) },
  { key: 'chipset', text: 'PCH Chipset', tag: 'DMI 4.0', pos: new THREE.Vector3(2.6, 0.6, 2.6) },
  { key: 'logic', text: 'Mantiqiy ALU', tag: 'CMOS Gates', pos: new THREE.Vector3(-2.8, 0.4, 2.8) }
];

LABEL_DEFS.forEach(l => {
  const el = document.createElement('div');
  el.className = 'complabel';
  el.innerHTML = `<span class="dot"></span><span>${l.text}</span><span class="bus-tag">${l.tag}</span>`;
  labelsContainer.appendChild(el);
  l.element = el;
});

function updateLabels(){
  const tempV = new THREE.Vector3();
  LABEL_DEFS.forEach(l => {
    tempV.copy(l.pos);
    tempV.project(camera);
    const x = (tempV.x * 0.5 + 0.5) * window.innerWidth;
    const y = (-(tempV.y * 0.5) + 0.5) * window.innerHeight;
    l.element.style.left = `${x}px`;
    l.element.style.top = `${y}px`;
    l.element.style.display = tempV.z > 1 ? 'none' : 'flex';
  });
}
