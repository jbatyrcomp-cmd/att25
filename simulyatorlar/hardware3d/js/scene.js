/* ==========================================================================
   THREE.JS 3D SCENE SETUP & COMPLETE PHYSICAL MOTHERBOARD MODEL
   ATT-25 Kompyuter Sxemalari, Arxitekturasi va Atributlari Simulyatori
   ========================================================================== */
const canvas = document.getElementById('scene');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111827);
scene.fog = new THREE.FogExp2(0x111827, 0.016);

const camera = new THREE.PerspectiveCamera(36, window.innerWidth / window.innerHeight, 0.1, 100);
let camTheta = Math.PI * 0.38, camPhi = Math.PI * 0.32, camRadius = 16.5;
const camTarget = new THREE.Vector3(0, 0.2, 0);

function updateCamera(){
  const x = camRadius * Math.sin(camPhi) * Math.sin(camTheta);
  const y = camRadius * Math.cos(camPhi);
  const z = camRadius * Math.sin(camPhi) * Math.cos(camTheta);
  camera.position.set(x, y, z).add(camTarget);
  camera.lookAt(camTarget);
}
updateCamera();

/* Studio Lighting */
const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1.5);
scene.add(ambientLight);

const keyLight = new THREE.DirectionalLight(0xFFFFFF, 1.6);
keyLight.position.set(14, 26, 14);
keyLight.castShadow = true;
keyLight.shadow.mapSize.width = 2048;
keyLight.shadow.mapSize.height = 2048;
keyLight.shadow.bias = -0.0003;
scene.add(keyLight);

const fillLight = new THREE.DirectionalLight(0xBAE6FD, 0.95);
fillLight.position.set(-16, 14, -10);
scene.add(fillLight);

const warmLight = new THREE.DirectionalLight(0xFDE68A, 0.8);
warmLight.position.set(10, -5, -14);
scene.add(warmLight);

const centerGlow = new THREE.PointLight(0x00E676, 0.9, 12);
centerGlow.position.set(0, 3.5, 0);
scene.add(centerGlow);

/* Helper Functions */
function createBox(w, h, d, color, matOpts = {}){
  const geo = new THREE.BoxGeometry(w, h, d);
  const mat = new THREE.MeshStandardMaterial({
    color, roughness: 0.4, metalness: 0.25, ...matOpts
  });
  const m = new THREE.Mesh(geo, mat);
  m.castShadow = true; m.receiveShadow = true;
  return m;
}

function createCylinder(rt, rb, h, seg, color, matOpts = {}){
  const geo = new THREE.CylinderGeometry(rt, rb, h, seg);
  const mat = new THREE.MeshStandardMaterial({
    color, roughness: 0.35, metalness: 0.35, ...matOpts
  });
  const m = new THREE.Mesh(geo, mat);
  m.castShadow = true; m.receiveShadow = true;
  return m;
}

/* Master Collections */
const pickableMeshes = [];
const componentGroups = {};
const animatedParts = {
  fanBlades: [],
  ramLatches: [],
  cpuLever: null,
  cpuBracket: null,
  cpuProc: null,
  cooler: null,
  ramSticks: [],
  ssdHeatsink: null,
  ssdBoard: null,
  gpuCard: null,
  soundCard: null,
  cmosBat: null,
  cmosJumper: null,
  logicWires: [],
  logicLeds: [],
  rgbBars: []
};

/* ==========================================================================
   1. REALISTIC GREEN MOTHERBOARD PCB (Classic Rich Green with Silkscreen)
   ========================================================================== */
const pcbTextures = HARDWARE_TEXTURES.createPcbTextures();
const pcbWidth = 11.2, pcbLength = 11.2, pcbThick = 0.16;
const pcbGeo = new THREE.BoxGeometry(pcbWidth, pcbThick, pcbLength);

const pcbEdgeMat = new THREE.MeshStandardMaterial({ color: 0x135233, roughness: 0.7, metalness: 0.15 });
const pcbTopMat = new THREE.MeshStandardMaterial({
  map: pcbTextures.map,
  bumpMap: pcbTextures.bumpMap,
  bumpScale: 0.045,
  color: 0x1A6B43,
  roughness: 0.45,
  metalness: 0.2
});
const pcbMaterials = [pcbEdgeMat, pcbEdgeMat, pcbTopMat, pcbEdgeMat, pcbEdgeMat, pcbEdgeMat];

const pcb = new THREE.Mesh(pcbGeo, pcbMaterials);
pcb.position.y = -pcbThick / 2;
pcb.receiveShadow = true;
scene.add(pcb);

// Mounting Holes with Solder Rings
const screwPositions = [
  [-5.1, -5.1], [5.1, -5.1], [-5.1, 5.1], [5.1, 5.1], [0, 5.1], [0, -5.1]
];
screwPositions.forEach(([sx, sz]) => {
  const solderRing = createCylinder(0.32, 0.32, 0.04, 24, 0xD4DDD8, { metalness: 0.95, roughness: 0.15 });
  solderRing.position.set(sx, 0.02, sz);
  scene.add(solderRing);
  const holeCenter = createCylinder(0.14, 0.14, 0.06, 16, 0x0B120E, { metalness: 0.85 });
  holeCenter.position.set(sx, 0.03, sz);
  scene.add(holeCenter);
});

/* ==========================================================================
   2. PHYSICAL REAR I/O CONNECTORS (PS/2, LPT, COM, VGA, USB, LAN, Audio)
   ========================================================================== */
const ioGroup = new THREE.Group();
ioGroup.position.set(-5.15, 0, -1.2);
ioGroup.userData = { compKey: 'io' };

const ioShield = createBox(0.65, 1.45, 7.2, 0xCBD5E1, { roughness: 0.25, metalness: 0.9 });
ioShield.position.set(0, 0.72, 0);
ioGroup.add(ioShield);

// PS/2 Ports (Green & Purple)
const ps2Bracket = createBox(0.68, 0.85, 0.65, 0x94A3B8, { metalness: 0.9 });
ps2Bracket.position.set(0.02, 0.48, -3.1);
ioGroup.add(ps2Bracket);

const ps2Green = createCylinder(0.16, 0.16, 0.22, 16, 0x10B981, { roughness: 0.3 });
ps2Green.rotation.z = Math.PI / 2;
ps2Green.position.set(0.25, 0.7, -3.1);
ioGroup.add(ps2Green);

const ps2Purple = createCylinder(0.16, 0.16, 0.22, 16, 0x9333EA, { roughness: 0.3 });
ps2Purple.rotation.z = Math.PI / 2;
ps2Purple.position.set(0.25, 0.32, -3.1);
ioGroup.add(ps2Purple);

// LPT Printer Port (25-pin Pink)
const lptBox = createBox(0.68, 0.38, 1.8, 0x94A3B8, { metalness: 0.9 });
lptBox.position.set(0.02, 0.82, -1.8);
ioGroup.add(lptBox);

const lptPlastic = createBox(0.25, 0.22, 1.45, 0xEC4899, { roughness: 0.3 });
lptPlastic.position.set(0.26, 0.82, -1.8);
ioGroup.add(lptPlastic);

[-0.78, 0.78].forEach(oz => {
  const lptScrew = createCylinder(0.06, 0.06, 0.26, 8, 0xFBBF24, { metalness: 0.95 });
  lptScrew.rotation.z = Math.PI / 2;
  lptScrew.position.set(0.26, 0.82, -1.8 + oz);
  ioGroup.add(lptScrew);
});

// COM Serial Port (9-pin Turquoise)
const comPlastic = createBox(0.25, 0.24, 0.85, 0x06B6D4, { roughness: 0.3 });
comPlastic.position.set(0.26, 0.34, -2.15);
ioGroup.add(comPlastic);

// VGA Video Port (15-pin Blue)
const vgaPlastic = createBox(0.25, 0.24, 0.85, 0x0284C7, { roughness: 0.3 });
vgaPlastic.position.set(0.26, 0.34, -1.25);
ioGroup.add(vgaPlastic);

// Dual USB Ports
[-0.35, 0.65].forEach(pz => {
  const usbCage = createBox(0.68, 0.52, 0.58, 0x64748B, { metalness: 0.9 });
  usbCage.position.set(0.02, 0.35, pz);
  ioGroup.add(usbCage);

  const usbTop = createBox(0.22, 0.08, 0.38, 0x0284C7, { roughness: 0.3 });
  usbTop.position.set(0.26, 0.48, pz);
  ioGroup.add(usbTop);

  const usbBtm = createBox(0.22, 0.08, 0.38, 0x0284C7, { roughness: 0.3 });
  usbBtm.position.set(0.26, 0.22, pz);
  ioGroup.add(usbBtm);
});

// RJ-45 Ethernet Port
const rj45Box = createBox(0.68, 0.62, 0.68, 0x475569, { metalness: 0.85 });
rj45Box.position.set(0.02, 0.45, 1.55);
ioGroup.add(rj45Box);

const rj45Cavity = createBox(0.25, 0.35, 0.45, 0x0F172A, { roughness: 0.9 });
rj45Cavity.position.set(0.25, 0.42, 1.55);
ioGroup.add(rj45Cavity);

const rj45LedG = createBox(0.26, 0.05, 0.05, 0x00FF87, { emissive: 0x00FF87, emissiveIntensity: 0.95 });
rj45LedG.position.set(0.25, 0.7, 1.4);
ioGroup.add(rj45LedG);

const rj45LedO = createBox(0.26, 0.05, 0.05, 0xF59E0B, { emissive: 0xF59E0B, emissiveIntensity: 0.95 });
rj45LedO.position.set(0.25, 0.7, 1.7);
ioGroup.add(rj45LedO);

// 3x 3.5mm Audio Jacks Stack
const audioBlock = createBox(0.68, 0.85, 0.58, 0x334155, { metalness: 0.8 });
audioBlock.position.set(0.02, 0.5, 2.5);
ioGroup.add(audioBlock);

const jackColors = [0x0284C7, 0x10B981, 0xEC4899];
jackColors.forEach((col, jIdx) => {
  const jackRing = createCylinder(0.12, 0.12, 0.26, 16, col, { roughness: 0.3, metalness: 0.4 });
  jackRing.rotation.z = Math.PI / 2;
  jackRing.position.set(0.24, 0.25 + jIdx * 0.28, 2.5);
  ioGroup.add(jackRing);

  const jackHole = createCylinder(0.06, 0.06, 0.28, 12, 0x0B120E, { metalness: 0.9 });
  jackHole.rotation.z = Math.PI / 2;
  jackHole.position.set(0.25, 0.25 + jIdx * 0.28, 2.5);
  ioGroup.add(jackHole);
});

scene.add(ioGroup);
componentGroups.io = ioGroup;
ioGroup.traverse(o => { if (o.isMesh) { o.userData.compKey = 'io'; pickableMeshes.push(o); } });

/* ==========================================================================
   3. CPU SOCKET & PROCESSOR (With Disassembly & Laser IHS)
   ========================================================================== */
const cpuGroup = new THREE.Group();
cpuGroup.position.set(-0.8, 0, -2.4);
cpuGroup.userData = { compKey: 'cpu' };

// Socket Base
const socketBase = createBox(3.0, 0.16, 3.0, 0xF8FAFC, { roughness: 0.6 });
cpuGroup.add(socketBase);

const pinGrid = createBox(2.2, 0.02, 2.2, 0xFBBF24, { metalness: 0.95, roughness: 0.15 });
pinGrid.position.y = 0.09;
cpuGroup.add(pinGrid);

// Socket Retention Mechanism (Bracket Frame)
const socketBracket = new THREE.Group();
socketBracket.position.set(0, 0.08, -1.3);
const bracketFrameL = createBox(0.2, 0.1, 2.6, 0x94A3B8, { metalness: 0.85, roughness: 0.3 });
bracketFrameL.position.set(-1.25, 0.05, 1.3);
socketBracket.add(bracketFrameL);
const bracketFrameR = createBox(0.2, 0.1, 2.6, 0x94A3B8, { metalness: 0.85, roughness: 0.3 });
bracketFrameR.position.set(1.25, 0.05, 1.3);
socketBracket.add(bracketFrameR);
const bracketFrameTop = createBox(2.7, 0.1, 0.2, 0x94A3B8, { metalness: 0.85, roughness: 0.3 });
bracketFrameTop.position.set(0, 0.05, 0.1);
socketBracket.add(bracketFrameTop);
cpuGroup.add(socketBracket);
animatedParts.cpuBracket = socketBracket;

// Socket Load Lever (Arm)
const cpuLever = new THREE.Group();
cpuLever.position.set(1.5, 0.08, 1.3);
const leverRod = createCylinder(0.04, 0.04, 2.8, 12, 0xCBD5E1, { metalness: 0.95 });
leverRod.rotation.x = Math.PI / 2;
leverRod.position.set(0, 0.05, -1.4);
cpuLever.add(leverRod);
const leverHandle = createBox(0.12, 0.08, 0.22, 0x1E293B, { roughness: 0.5 });
leverHandle.position.set(0.05, 0.05, 0.05);
cpuLever.add(leverHandle);
cpuGroup.add(cpuLever);
animatedParts.cpuLever = cpuLever;

// CPU Processor Chip
const cpuProc = new THREE.Group();
cpuProc.position.set(0, 0.1, 0);

const cpuSubstrate = createBox(2.3, 0.06, 2.3, 0x1A6B43, { roughness: 0.5 });
cpuProc.add(cpuSubstrate);

const cpuTex = HARDWARE_TEXTURES.createCpuIhsTexture();
const ihsGeo = new THREE.BoxGeometry(2.0, 0.16, 2.0);
const ihsSideMat = new THREE.MeshStandardMaterial({ color: 0xC8D2CC, metalness: 0.88, roughness: 0.2 });
const ihsTopMat = new THREE.MeshStandardMaterial({ map: cpuTex, metalness: 0.82, roughness: 0.25 });
const ihsMaterials = [ihsSideMat, ihsSideMat, ihsTopMat, ihsSideMat, ihsSideMat, ihsSideMat];
const ihs = new THREE.Mesh(ihsGeo, ihsMaterials);
ihs.position.y = 0.11;
ihs.castShadow = true;
cpuProc.add(ihs);

cpuGroup.add(cpuProc);
animatedParts.cpuProc = cpuProc;

scene.add(cpuGroup);
componentGroups.cpu = cpuGroup;
cpuGroup.traverse(o => { if (o.isMesh) { o.userData.compKey = 'cpu'; pickableMeshes.push(o); } });

/* ==========================================================================
   4. TALL PIN-FIN HEATSINK (Removable Heatsink)
   ========================================================================== */
const coolerGroup = new THREE.Group();
coolerGroup.position.set(-0.8, 0.35, -2.4);
coolerGroup.userData = { compKey: 'cooler' };

const coolerBase = createBox(2.3, 0.18, 2.3, 0x1E293B, { metalness: 0.85, roughness: 0.3 });
coolerGroup.add(coolerBase);

// 121 Vertical Pin-Fins (11x11 array)
for (let px = -1.0; px <= 1.0; px += 0.2) {
  for (let pz = -1.0; pz <= 1.0; pz += 0.2) {
    const pin = createBox(0.08, 1.6, 0.08, 0x334155, { metalness: 0.85, roughness: 0.25 });
    pin.position.set(px, 0.95, pz);
    coolerGroup.add(pin);
  }
}

animatedParts.cooler = coolerGroup;
scene.add(coolerGroup);
componentGroups.cooler = coolerGroup;
coolerGroup.traverse(o => { if (o.isMesh) { o.userData.compKey = 'cooler'; pickableMeshes.push(o); } });

/* ==========================================================================
   5. ROM / BIOS & CMOS BATTERY (Winbond SPI Flash, Dual-BIOS, CLRTC, CR2032)
   ========================================================================== */
const romGroup = new THREE.Group();
romGroup.position.set(1.4, 0, 1.5);
romGroup.userData = { compKey: 'rom' };

// Primary Winbond SPI Flash BIOS Chip (8-pin SOIC-8 with silver legs)
const biosChip = createBox(0.42, 0.12, 0.52, 0x0F172A, { roughness: 0.7 });
biosChip.position.set(0, 0.06, 0);
romGroup.add(biosChip);

// Pin 1 dot and silver legs on BIOS chip
const pin1Dot = createCylinder(0.03, 0.03, 0.02, 8, 0xCBD5E1);
pin1Dot.position.set(-0.14, 0.13, -0.18);
romGroup.add(pin1Dot);

const biosLegs = createBox(0.55, 0.02, 0.45, 0xCBD5E1, { metalness: 0.95 });
biosLegs.position.set(0, 0.02, 0);
romGroup.add(biosLegs);

// Backup Dual-BIOS Chip (B_BIOS)
const bBiosChip = createBox(0.42, 0.12, 0.52, 0x0F172A, { roughness: 0.7 });
bBiosChip.position.set(0, 0.06, 0.75);
romGroup.add(bBiosChip);

// Clear CMOS 3-Pin Jumper (CLRTC) with Removable Blue Shunt Cap
const jumperBase = createBox(0.18, 0.08, 0.45, 0x1E293B, { roughness: 0.6 });
jumperBase.position.set(-0.8, 0.04, 0.2);
romGroup.add(jumperBase);

for (let jp = -0.14; jp <= 0.14; jp += 0.14) {
  const pin = createBox(0.04, 0.22, 0.04, 0xFBBF24, { metalness: 0.95 });
  pin.position.set(-0.8, 0.14, 0.2 + jp);
  romGroup.add(pin);
}

// Removable Jumper Cap (Blue Shunt)
const cmosJumper = createBox(0.12, 0.24, 0.22, 0x0284C7, { roughness: 0.3 });
cmosJumper.position.set(-0.8, 0.16, 0.13);
romGroup.add(cmosJumper);
animatedParts.cmosJumper = cmosJumper;

// CR2032 3V Lithium Coin Cell Battery in Round Holder (Removable)
const cmosTex = HARDWARE_TEXTURES.createCmosBatteryTexture();
const cmosHolder = createCylinder(0.46, 0.46, 0.2, 24, 0x1E293B, { roughness: 0.8 });
cmosHolder.position.set(0, 0.1, -1.9);
romGroup.add(cmosHolder);

const cmosBatGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.08, 32);
const cmosSideMat = new THREE.MeshStandardMaterial({ color: 0xCBD5E1, metalness: 0.95, roughness: 0.15 });
const cmosTopMat = new THREE.MeshStandardMaterial({ map: cmosTex, metalness: 0.9, roughness: 0.2 });
const cmosBat = new THREE.Mesh(cmosBatGeo, [cmosSideMat, cmosTopMat, cmosSideMat]);
cmosBat.position.set(0, 0.2, -1.9);
cmosBat.castShadow = true;
romGroup.add(cmosBat);
animatedParts.cmosBat = cmosBat;

scene.add(romGroup);
componentGroups.rom = romGroup;
romGroup.traverse(o => { if (o.isMesh) { o.userData.compKey = 'rom'; pickableMeshes.push(o); } });

/* ==========================================================================
   6. M.2 NVME SSD & SATA 6GB/S STORAGE SUBSYSTEM
   ========================================================================== */
const ssdGroup = new THREE.Group();
ssdGroup.position.set(0, 0, 2.5);
ssdGroup.userData = { compKey: 'ssd' };

// M.2 2280 NVMe SSD Board (Removable)
const ssdBoard = new THREE.Group();
ssdBoard.position.set(0, 0.1, 0);

const m2Pcb = createBox(3.4, 0.06, 0.9, 0x1A6B43, { roughness: 0.5 });
ssdBoard.add(m2Pcb);

// Gold M-Key Edge Pins
const m2Gold = createBox(0.08, 0.07, 0.85, 0xFBBF24, { metalness: 0.95 });
m2Gold.position.set(-1.68, 0, 0);
ssdBoard.add(m2Gold);

// Phison NVMe Controller Chip
const ctrlChip = createBox(0.65, 0.08, 0.65, 0x0F172A, { roughness: 0.8 });
ctrlChip.position.set(-0.8, 0.06, 0);
ssdBoard.add(ctrlChip);

// 2x 3D TLC NAND Flash Memory Chips
[-0.1, 0.8].forEach(nx => {
  const nandChip = createBox(0.7, 0.08, 0.7, 0x1E293B, { roughness: 0.7 });
  nandChip.position.set(nx, 0.06, 0);
  ssdBoard.add(nandChip);
});

// DDR4 DRAM Cache Chip
const dramChip = createBox(0.35, 0.07, 0.45, 0x0F172A, { roughness: 0.8 });
dramChip.position.set(-0.8, 0.06, 0.5);
ssdBoard.add(dramChip);

ssdGroup.add(ssdBoard);
animatedParts.ssdBoard = ssdBoard;

// M.2 Shield Frozr Heatsink with Retaining Screw (Removable)
const m2Tex = HARDWARE_TEXTURES.createM2Texture();
const ssdHeatsink = new THREE.Group();
ssdHeatsink.position.set(0, 0.22, 0);

const m2Geo = new THREE.BoxGeometry(3.5, 0.14, 1.0);
const m2SideMat = new THREE.MeshStandardMaterial({ color: 0x1E293B, roughness: 0.3, metalness: 0.8 });
const m2TopMat = new THREE.MeshStandardMaterial({ map: m2Tex, roughness: 0.3, metalness: 0.75 });
const m2Armor = new THREE.Mesh(m2Geo, [m2SideMat, m2SideMat, m2TopMat, m2SideMat, m2SideMat, m2SideMat]);
ssdHeatsink.add(m2Armor);

const m2Screw = createCylinder(0.12, 0.12, 0.08, 12, 0xCBD5E1, { metalness: 0.95 });
m2Screw.position.set(1.6, 0.1, 0);
ssdHeatsink.add(m2Screw);

ssdGroup.add(ssdHeatsink);
animatedParts.ssdHeatsink = ssdHeatsink;

// 4x SATA 6Gb/s Right-Angle Ports (Right edge)
[-0.4, 0.4].forEach(offsetZ => {
  const sataBlock = createBox(0.38, 0.36, 0.68, 0x1E293B, { roughness: 0.7 });
  sataBlock.position.set(4.8, 0.18, offsetZ);
  ssdGroup.add(sataBlock);
  const sataClip = createBox(0.04, 0.14, 0.32, 0x94A3B8, { metalness: 0.95 });
  sataClip.position.set(4.99, 0.22, offsetZ);
  ssdGroup.add(sataClip);
});

scene.add(ssdGroup);
componentGroups.ssd = ssdGroup;
ssdGroup.traverse(o => { if (o.isMesh) { o.userData.compKey = 'ssd'; pickableMeshes.push(o); } });

/* ==========================================================================
   7. DUAL-CHANNEL RAM DIMM SUBSYSTEM (4x Slots: Blue & Black + Removable Sticks)
   ========================================================================== */
const ramGroup = new THREE.Group();
ramGroup.position.set(-0.6, 0, 0.8);
ramGroup.userData = { compKey: 'ram' };

const ramTex = HARDWARE_TEXTURES.createRamTexture();

// 4 DIMM Slots: Blue, Black, Blue, Black
const slotColors = [0x0284C7, 0x0F172A, 0x0284C7, 0x0F172A];
const slotZPositions = [-0.65, -0.22, 0.22, 0.65];

slotZPositions.forEach((sz, idx) => {
  const slot = createBox(4.8, 0.28, 0.22, slotColors[idx], { roughness: 0.55 });
  slot.position.set(0, 0.14, sz);
  ramGroup.add(slot);

  // White Latches
  [-2.35, 2.35].forEach((lx) => {
    const latch = new THREE.Group();
    latch.position.set(lx, 0.24, sz);
    const latchMesh = createBox(0.18, 0.22, 0.14, 0xF8FAFC, { roughness: 0.4 });
    latch.add(latchMesh);
    ramGroup.add(latch);
    animatedParts.ramLatches.push(latch);
  });
});

// 2x Removable RAM Sticks (Slots 1 & 3)
[-0.65, 0.22].forEach((posZ) => {
  const stick = new THREE.Group();
  stick.position.set(0, 0.5, posZ);

  const ramPcb = createBox(4.6, 0.75, 0.08, 0x1A6B43, { roughness: 0.5 });
  stick.add(ramPcb);

  const ramGold = createBox(4.4, 0.08, 0.09, 0xFBBF24, { metalness: 0.95 });
  ramGold.position.y = -0.34;
  stick.add(ramGold);

  // 16 DRAM Chips
  for (let cx = -1.8; cx <= 1.8; cx += 0.52) {
    const chipF = createBox(0.32, 0.32, 0.04, 0x0F172A, { roughness: 0.8 });
    chipF.position.set(cx, 0.06, 0.05);
    stick.add(chipF);
    const chipB = createBox(0.32, 0.32, 0.04, 0x0F172A, { roughness: 0.8 });
    chipB.position.set(cx, 0.06, -0.05);
    stick.add(chipB);
  }

  ramGroup.add(stick);
  animatedParts.ramSticks.push(stick);
});

scene.add(ramGroup);
componentGroups.ram = ramGroup;
ramGroup.traverse(o => { if (o.isMesh) { o.userData.compKey = 'ram'; pickableMeshes.push(o); } });

/* ==========================================================================
   8. EXPANSION SLOTS & 2 REMOVABLE EXPANSION CARDS
   ========================================================================== */
const gpuGroup = new THREE.Group();
gpuGroup.position.set(2.8, 0, -0.5);
gpuGroup.userData = { compKey: 'gpu' };

// AGP / PCIe Slot
const agpSlot = createBox(0.3, 0.28, 5.4, 0x451A03, { roughness: 0.6 });
agpSlot.position.set(-0.8, 0.14, 0);
gpuGroup.add(agpSlot);

// 3x White PCI Slots with Center Divider
[0.1, 0.9, 1.7].forEach(posX => {
  const pciSlot = createBox(0.28, 0.28, 5.8, 0xF8FAFC, { roughness: 0.6 });
  pciSlot.position.set(posX, 0.14, 0.2);
  gpuGroup.add(pciSlot);

  const keyDivider = createBox(0.3, 0.3, 0.18, 0xF8FAFC, { roughness: 0.6 });
  keyDivider.position.set(posX, 0.16, 0.2 - 0.6);
  gpuGroup.add(keyDivider);
});

// Card 1: GPU Card (Removable)
const card1 = new THREE.Group();
card1.position.set(-0.8, 1.1, 0);

const card1Pcb = createBox(0.08, 1.8, 5.4, 0x1A6B43, { roughness: 0.5 });
card1.add(card1Pcb);

const card1Gold = createBox(0.09, 0.12, 5.0, 0xFBBF24, { metalness: 0.95 });
card1Gold.position.y = -0.92;
card1.add(card1Gold);

const card1Hs = createBox(0.25, 0.7, 1.4, 0x1E293B, { metalness: 0.8, roughness: 0.3 });
card1Hs.position.set(0.14, 0.1, -0.8);
card1.add(card1Hs);

const card1Bracket = createBox(0.1, 2.4, 0.35, 0xCBD5E1, { metalness: 0.95 });
card1Bracket.position.set(0, 0.15, -2.85);
card1.add(card1Bracket);

gpuGroup.add(card1);
animatedParts.gpuCard = card1;

// Card 2: PCI Sound/Network Card (Removable)
const card2 = new THREE.Group();
card2.position.set(0.1, 1.0, 0.2);

const card2Pcb = createBox(0.08, 1.6, 5.2, 0x1A6B43, { roughness: 0.5 });
card2.add(card2Pcb);

const card2Gold = createBox(0.09, 0.12, 4.8, 0xFBBF24, { metalness: 0.95 });
card2Gold.position.y = -0.82;
card2.add(card2Gold);

[-1.2, 0, 1.2].forEach(cz => {
  const chip = createBox(0.06, 0.32, 0.32, 0x0F172A, { roughness: 0.8 });
  chip.position.set(0.06, 0.1, cz);
  card2.add(chip);
});

const card2Bracket = createBox(0.1, 2.2, 0.35, 0xCBD5E1, { metalness: 0.95 });
card2Bracket.position.set(0, 0.15, -2.75);
card2.add(card2Bracket);

gpuGroup.add(card2);
animatedParts.soundCard = card2;

// 4 Blue Heatsinks
[-0.8, 0, 0.8, 1.6].forEach(posX => {
  const blueHs = createBox(0.65, 0.48, 1.2, 0x0284C7, { metalness: 0.9, roughness: 0.2 });
  blueHs.position.set(posX, 0.24, 4.2);
  gpuGroup.add(blueHs);

  for (let f = -0.45; f <= 0.45; f += 0.18) {
    const fin = createBox(0.62, 0.12, 0.06, 0x38BDF8, { metalness: 0.95 });
    fin.position.set(posX, 0.52, 4.2 + f);
    gpuGroup.add(fin);
  }
});

scene.add(gpuGroup);
componentGroups.gpu = gpuGroup;
gpuGroup.traverse(o => { if (o.isMesh) { o.userData.compKey = 'gpu'; pickableMeshes.push(o); } });

/* ==========================================================================
   9. ATX 24-PIN, IDE, FLOPPY, RIBBON CABLE & SUPER I/O
   ========================================================================== */
const powerGroup = new THREE.Group();
powerGroup.position.set(0, 0, 0);
powerGroup.userData = { compKey: 'power' };

// Cream ATX 24-Pin Socket
const atx24 = createBox(0.65, 0.55, 3.2, 0xFDFBF7, { roughness: 0.65 });
atx24.position.set(-3.8, 0.28, 2.6);
powerGroup.add(atx24);

const atxLatch = createBox(0.12, 0.35, 0.8, 0xFDFBF7, { roughness: 0.65 });
atxLatch.position.set(-3.45, 0.32, 2.6);
powerGroup.add(atxLatch);

for (let p = -1.35; p <= 1.35; p += 0.25) {
  [-0.15, 0.15].forEach(px => {
    const pinHole = createBox(0.12, 0.18, 0.12, 0xFBBF24, { metalness: 0.95 });
    pinHole.position.set(-3.8 + px, 0.52, 2.6 + p);
    powerGroup.add(pinHole);
  });
}

// Blue IDE 40-Pin Header
const ide40Box = createBox(0.48, 0.38, 2.6, 0x0284C7, { roughness: 0.5 });
ide40Box.position.set(-4.6, 0.2, -0.6);
powerGroup.add(ide40Box);

// Black Floppy 34-Pin Header
const fdd34Box = createBox(0.48, 0.38, 2.2, 0x1E293B, { roughness: 0.7 });
fdd34Box.position.set(-4.6, 0.2, -2.2);
powerGroup.add(fdd34Box);

// Fan Headers
[[-1.8, -4.2], [1.8, -4.2], [-3.8, 4.2]].forEach(([fx, fz]) => {
  const fanHdr = createBox(0.24, 0.28, 0.35, 0xF8FAFC, { roughness: 0.5 });
  fanHdr.position.set(fx, 0.14, fz);
  powerGroup.add(fanHdr);
  const fanTab = createBox(0.04, 0.25, 0.32, 0xF8FAFC, { roughness: 0.5 });
  fanTab.position.set(fx + 0.11, 0.24, fz);
  powerGroup.add(fanTab);
});

// Red DIP Switch
const dipSwitch = createBox(0.42, 0.2, 0.65, 0xDC2626, { roughness: 0.4 });
dipSwitch.position.set(1.4, 0.1, 2.2);
powerGroup.add(dipSwitch);
for (let sw = -0.22; sw <= 0.22; sw += 0.14) {
  const toggle = createBox(0.18, 0.08, 0.06, 0xF8FAFC, { roughness: 0.3 });
  toggle.position.set(1.4, 0.22, 2.2 + sw);
  powerGroup.add(toggle);
}

// Super I/O Controller
const superIo = createBox(1.1, 0.12, 1.1, 0x0F172A, { roughness: 0.7, metalness: 0.3 });
superIo.position.set(-1.8, 0.06, 3.2);
powerGroup.add(superIo);
const ioLeadFrame = createBox(1.22, 0.02, 1.22, 0xCBD5E1, { metalness: 0.95 });
ioLeadFrame.position.set(-1.8, 0.04, 3.2);
powerGroup.add(ioLeadFrame);

// Ribbon Cable
const ribbonCurve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(-4.6, 0.28, -0.6),
  new THREE.Vector3(-3.8, 0.62, -0.2),
  new THREE.Vector3(-2.6, 0.82, 0.4),
  new THREE.Vector3(-1.8, 0.52, 1.2),
  new THREE.Vector3(-0.9, 0.28, 1.8)
]);
const ribbonGeo = new THREE.TubeGeometry(ribbonCurve, 40, 0.08, 6, false);
const ribbonMat = new THREE.MeshStandardMaterial({ color: 0xCBD5E1, roughness: 0.65, metalness: 0.1 });
const ribbonCable = new THREE.Mesh(ribbonGeo, ribbonMat);
ribbonCable.scale.set(1, 0.25, 2.2);
ribbonCable.castShadow = true;
powerGroup.add(ribbonCable);

const ribbonPlug = createBox(0.3, 0.26, 1.1, 0x0284C7, { roughness: 0.4 });
ribbonPlug.position.set(-4.6, 0.24, -0.6);
powerGroup.add(ribbonPlug);

scene.add(powerGroup);
componentGroups.power = powerGroup;
powerGroup.traverse(o => { if (o.isMesh) { o.userData.compKey = 'power'; pickableMeshes.push(o); } });

/* ==========================================================================
   10. CHIPSET NORTHBRIDGE & ACTIVE FAN
   ========================================================================== */
const chipsetGroup = new THREE.Group();
chipsetGroup.position.set(-3.2, 0, -2.4);
chipsetGroup.userData = { compKey: 'chipset' };

const chipHs = createBox(1.8, 0.45, 1.8, 0x1E293B, { metalness: 0.85, roughness: 0.3 });
chipHs.position.set(0, 0.22, 0);
chipsetGroup.add(chipHs);

const chipFanFrame = createBox(1.6, 0.32, 1.6, 0x0F172A, { roughness: 0.7 });
chipFanFrame.position.set(0, 0.6, 0);
chipsetGroup.add(chipFanFrame);

const chipFanRotor = new THREE.Group();
chipFanRotor.position.set(0, 0.62, 0);
const chipFanHub = createCylinder(0.3, 0.3, 0.12, 16, 0x1E293B, { metalness: 0.5 });
chipFanRotor.add(chipFanHub);

for (let b = 0; b < 7; b++) {
  const angle = (b / 7) * Math.PI * 2;
  const blade = createBox(0.14, 0.04, 0.48, 0x1E293B, { roughness: 0.5 });
  blade.position.set(Math.cos(angle) * 0.32, 0, Math.sin(angle) * 0.32);
  blade.rotation.y = -angle + 0.3;
  blade.rotation.z = 0.25;
  chipFanRotor.add(blade);
}
chipsetGroup.add(chipFanRotor);
animatedParts.fanBlades.push(chipFanRotor);

scene.add(chipsetGroup);
componentGroups.chipset = chipsetGroup;
chipsetGroup.traverse(o => { if (o.isMesh) { o.userData.compKey = 'chipset'; pickableMeshes.push(o); } });

/* ==========================================================================
   11. VRM CAPACITORS & TOROIDAL COILS
   ========================================================================== */
const vrmGroup = new THREE.Group();
vrmGroup.position.set(0, 0, 0);
vrmGroup.userData = { compKey: 'vrm' };

function addCapacitor(x, z, colorHex, height = 0.65, radius = 0.22){
  const body = createCylinder(radius, radius, height, 20, colorHex, { metalness: 0.65, roughness: 0.35 });
  body.position.set(x, height / 2 + 0.01, z);
  vrmGroup.add(body);

  const top = createCylinder(radius * 0.98, radius * 0.98, 0.03, 20, 0xCBD5E1, { metalness: 0.95, roughness: 0.15 });
  top.position.set(x, height + 0.01, z);
  vrmGroup.add(top);

  const baseCircle = createCylinder(radius * 1.25, radius * 1.25, 0.01, 20, 0xFFFFFF, { roughness: 0.8 });
  baseCircle.position.set(x, 0.01, z);
  vrmGroup.add(baseCircle);
}

function addToroidalInductor(x, z){
  const coreGeo = new THREE.TorusGeometry(0.28, 0.14, 12, 24);
  const coreMat = new THREE.MeshStandardMaterial({ color: 0xB45309, metalness: 0.95, roughness: 0.15 });
  const coil = new THREE.Mesh(coreGeo, coreMat);
  coil.rotation.x = Math.PI / 2;
  coil.position.set(x, 0.28, z);
  coil.castShadow = true;
  vrmGroup.add(coil);
}

// Capacitors
addCapacitor(-3.2, 1.2, 0xD946EF, 0.7, 0.24);
addCapacitor(-3.7, 1.2, 0x059669, 0.7, 0.24);
addCapacitor(-3.2, 0.5, 0x06B6D4, 0.55, 0.2);

addCapacitor(-2.2, -3.8, 0xD946EF, 0.65, 0.22);
addCapacitor(-2.7, -3.8, 0x059669, 0.65, 0.22);
addCapacitor(-3.2, -3.8, 0xD946EF, 0.65, 0.22);
addCapacitor(-3.7, -3.8, 0x059669, 0.65, 0.22);

addCapacitor(0.8, -1.2, 0xD946EF, 0.6, 0.2);
addCapacitor(1.3, -1.2, 0x059669, 0.6, 0.2);
addCapacitor(1.8, -1.2, 0x06B6D4, 0.5, 0.18);

addCapacitor(1.2, 3.4, 0xD946EF, 0.55, 0.2);
addCapacitor(2.2, 3.4, 0x059669, 0.55, 0.2);
addCapacitor(3.2, 3.4, 0x06B6D4, 0.55, 0.2);

// Toroids
addToroidalInductor(-4.2, 0.4);
addToroidalInductor(-4.2, 1.2);
addToroidalInductor(-1.4, -4.2);

scene.add(vrmGroup);
componentGroups.vrm = vrmGroup;
vrmGroup.traverse(o => { if (o.isMesh) { o.userData.compKey = 'vrm'; pickableMeshes.push(o); } });

/* ==========================================================================
   12. INTERACTIVE LOGIC GATES & ALU MATRIX
   ========================================================================== */
const logicGroup = new THREE.Group();
logicGroup.position.set(-3.6, 0, 4.2);
logicGroup.userData = { compKey: 'logic' };

const logicBase = createBox(2.2, 0.14, 2.0, 0x135233, { roughness: 0.6 });
logicBase.position.set(0, 0.07, 0);
logicGroup.add(logicBase);

const swA = createCylinder(0.2, 0.2, 0.18, 16, 0x38BDF8, { emissive: 0x38BDF8, emissiveIntensity: 0.8 });
swA.position.set(-0.6, 0.2, -0.5);
swA.userData = { isLogicSwitch: 'A' };
logicGroup.add(swA);
pickableMeshes.push(swA);

const swB = createCylinder(0.2, 0.2, 0.18, 16, 0x38BDF8, { emissive: 0x38BDF8, emissiveIntensity: 0.8 });
swB.position.set(-0.6, 0.2, 0.5);
swB.userData = { isLogicSwitch: 'B' };
logicGroup.add(swB);
pickableMeshes.push(swB);

const logicIc = createBox(0.8, 0.2, 1.2, 0x0F172A, { roughness: 0.4, metalness: 0.6 });
logicIc.position.set(0.2, 0.18, 0);
logicGroup.add(logicIc);

const ledSum = createCylinder(0.18, 0.18, 0.15, 16, 0x1E293B, { emissive: 0x1E293B });
ledSum.position.set(0.8, 0.2, -0.4);
logicGroup.add(ledSum);
animatedParts.logicLeds.push({ key: 'Sum', mesh: ledSum });

const ledCarry = createCylinder(0.18, 0.18, 0.15, 16, 0x1E293B, { emissive: 0x1E293B });
ledCarry.position.set(0.8, 0.2, 0.4);
logicGroup.add(ledCarry);
animatedParts.logicLeds.push({ key: 'Carry', mesh: ledCarry });

const wireA = createBox(0.6, 0.02, 0.05, 0x38BDF8);
wireA.position.set(-0.2, 0.15, -0.5);
logicGroup.add(wireA);
animatedParts.logicWires.push({ key: 'A', mesh: wireA });

const wireB = createBox(0.6, 0.02, 0.05, 0x38BDF8);
wireB.position.set(-0.2, 0.15, 0.5);
logicGroup.add(wireB);
animatedParts.logicWires.push({ key: 'B', mesh: wireB });

scene.add(logicGroup);
componentGroups.logic = logicGroup;
logicGroup.traverse(o => { if (o.isMesh && !o.userData.isLogicSwitch) { o.userData.compKey = 'logic'; pickableMeshes.push(o); } });

/* Selection highlight wireframe box */
const selBoxGeo = new THREE.BoxGeometry(1, 1, 1);
const selBoxMat = new THREE.MeshBasicMaterial({ color: 0x00FF87, wireframe: true, transparent: true, opacity: 0.85 });
const selBox = new THREE.Mesh(selBoxGeo, selBoxMat);
selBox.visible = false;
scene.add(selBox);

/* ==========================================================================
   13. DATA BUSES & ANIMATED SIGNAL FLOWS
   ========================================================================== */
const BUS_DEFINITIONS = [
  { from: new THREE.Vector3(-0.8, 0.04, -1.2), to: new THREE.Vector3(-0.6, 0.04, 0.4), color: 0xFBBF24, speed: 2.8, type: 'address' },
  { from: new THREE.Vector3(-0.6, 0.06, 0.4), to: new THREE.Vector3(-0.8, 0.06, -1.2), color: 0x00E676, speed: 3.5, type: 'data' },
  { from: new THREE.Vector3(-3.2, 0.04, -2.4), to: new THREE.Vector3(-1.8, 0.04, -2.4), color: 0x00FF87, speed: 2.4, type: 'power' },
  { from: new THREE.Vector3(-0.8, 0.04, -1.2), to: new THREE.Vector3(2.0, 0.04, -0.5), color: 0x38BDF8, speed: 3.8, type: 'pcie' },
  { from: new THREE.Vector3(-3.8, 0.04, 1.8), to: new THREE.Vector3(-3.8, 0.04, -1.8), color: 0xFBBF24, speed: 2.6, type: 'power' }
];

const particleSystem = [];
const particleGeo = new THREE.SphereGeometry(0.065, 8, 8);

BUS_DEFINITIONS.forEach(bus => {
  const points = [bus.from, bus.to];
  const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
  const lineMat = new THREE.LineBasicMaterial({ color: bus.color, transparent: true, opacity: 0.65 });
  const line = new THREE.Line(lineGeo, lineMat);
  scene.add(line);

  for (let i = 0; i < 3; i++) {
    const pMat = new THREE.MeshBasicMaterial({ color: bus.color });
    const pMesh = new THREE.Mesh(particleGeo, pMat);
    scene.add(pMesh);
    particleSystem.push({
      mesh: pMesh,
      from: bus.from,
      to: bus.to,
      t: i * 0.33,
      speed: bus.speed,
      type: bus.type
    });
  }
});

/* ==========================================================================
   14. FLOATING 3D LABELS
   ========================================================================== */
const labelsContainer = document.getElementById('labels');
const LABEL_DEFS = [
  { key: 'cpu', text: 'CPU Soket', tag: 'ZIF / LGA', pos: new THREE.Vector3(-0.8, 0.6, -2.4) },
  { key: 'cooler', text: 'Pin-Fin Kuler', tag: '121 Pins', pos: new THREE.Vector3(-0.8, 2.2, -2.4) },
  { key: 'rom', text: 'ROM / BIOS', tag: 'SPI Flash & CMOS', pos: new THREE.Vector3(1.4, 0.5, 1.5) },
  { key: 'ssd', text: 'M.2 NVMe SSD', tag: 'PCIe Gen4 x4', pos: new THREE.Vector3(0, 0.5, 2.5) },
  { key: 'chipset', text: 'Chipset & Fan', tag: 'Northbridge', pos: new THREE.Vector3(-3.2, 1.1, -2.4) },
  { key: 'ram', text: 'Dual-Channel RAM', tag: '4x DIMM (Blue/Black)', pos: new THREE.Vector3(-0.6, 1.2, 0.8) },
  { key: 'gpu', text: 'Kengaytma Kartalari', tag: 'AGP & PCI Slotalar', pos: new THREE.Vector3(2.8, 2.2, -0.5) },
  { key: 'vrm', text: 'VRM & Kondensatorlar', tag: 'Quvvat Zanjiri', pos: new THREE.Vector3(-2.8, 1.0, 1.2) },
  { key: 'power', text: '24-Pin ATX & IDE', tag: 'Power & 40-Pin Header', pos: new THREE.Vector3(-3.8, 0.9, 2.6) },
  { key: 'io', text: 'Fizik Portlar', tag: 'VGA/LPT/COM/PS2/Audio', pos: new THREE.Vector3(-5.15, 1.5, -1.2) },
  { key: 'logic', text: 'Mantiqiy ALU', tag: 'Half-Adder & Gates', pos: new THREE.Vector3(-3.6, 0.6, 4.2) }
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
