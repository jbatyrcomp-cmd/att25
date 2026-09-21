/* ==========================================================================
   THREE.JS SCENE SETUP, 3D VIRTUAL MAYDON (ARENA & LAB), LIGHTS,
   DUAL CAMERA (ORBIT + FPS WALKTHROUGH), ROOM COLLISION & RAYCASTER
   ========================================================================== */

const canvas = document.getElementById('scene');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0A0D14);
scene.fog = new THREE.FogExp2(0x0A0D14, 0.018);

/* ==========================================================================
   CAMERA & CONTROLLERS (DUAL-MODE: ORBIT & FPS WALKTHROUGH)
   ========================================================================== */
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 250);

// Orbit Camera Variables
const target = new THREE.Vector3(0, 1.1, 0);
let camTheta = Math.PI * 0.22, camPhi = Math.PI * 0.32, camRadius = 18;

// FPS Walkthrough Camera Variables
let isFpsMode = false;
const fpsPos = new THREE.Vector3(0, 1.7, 7);
let fpsYaw = 0; // horizontal rotation in radians
let fpsPitch = 0; // vertical rotation in radians
const fpsVel = new THREE.Vector3();
let isCrouched = false;
const PLAYER_HEIGHT = 1.7;
const CROUCH_HEIGHT = 1.0;

// Arena Walkable Boundary Constraints
const ARENA_HALF_W = 16.5; // X: -16.5 to +16.5
const ARENA_HALF_L = 16.5; // Z: -16.5 to +16.5

function updateCamera(){
  if(!isFpsMode){
    const p = new THREE.Vector3(
      camRadius * Math.sin(camPhi) * Math.sin(camTheta),
      camRadius * Math.cos(camPhi),
      camRadius * Math.sin(camPhi) * Math.cos(camTheta)
    );
    camera.position.copy(target).add(p);
    camera.lookAt(target);
  } else {
    camera.position.copy(fpsPos);
    camera.position.y = isCrouched ? CROUCH_HEIGHT : PLAYER_HEIGHT;
    
    // Calculate look direction from yaw and pitch
    const dir = new THREE.Vector3(
      Math.sin(fpsYaw) * Math.cos(fpsPitch),
      Math.sin(fpsPitch),
      -Math.cos(fpsYaw) * Math.cos(fpsPitch)
    );
    camera.lookAt(camera.position.clone().add(dir));
  }
}

function setCameraMode(fps){
  isFpsMode = !!fps;
  const crosshair = document.getElementById('crosshair');
  const fpsHud = document.getElementById('fpsControlsHud');
  const camModeBtn = document.getElementById('camModeBtn');
  const miniRadar = document.getElementById('miniRadar');

  if(isFpsMode){
    if(crosshair) crosshair.style.display = 'block';
    if(fpsHud) {
      fpsHud.classList.add('show');
      setTimeout(()=>fpsHud.classList.remove('show'), 5500);
    }
    if(camModeBtn) {
      camModeBtn.classList.add('on');
      camModeBtn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg> Topologik Rejim`;
    }
    if(miniRadar) miniRadar.style.display = 'block';

    // Position player nicely facing the center arena
    fpsPos.set(0, PLAYER_HEIGHT, 8);
    fpsYaw = Math.PI; // Look towards center (Z = 0)
    fpsPitch = -0.08;
    toast("🚶 Xonada yurish rejimi yoqildi! W, A, S, D — Harakat | Sichqoncha — Qarash");
  } else {
    if(crosshair) crosshair.style.display = 'none';
    if(camModeBtn) {
      camModeBtn.classList.remove('on');
      camModeBtn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M13 4v16M7 8l-4 4 4 4M17 8l4 4-4 4"/></svg> Xonada Yurish (WASD)`;
    }
    if(document.pointerLockElement === canvas){
      document.exitPointerLock();
    }
    toast("🌐 Topologik umumiy ko‘rinish rejimiga qaytildi");
  }
  updateCamera();
}

function onResize(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onResize);
onResize();
updateCamera();

/* ==========================================================================
   LIGHTING SYSTEM & DAY / CYBER THEMES
   ========================================================================== */
let isCyberTheme = false;
const hemiLight = new THREE.HemisphereLight(0x8FB3E0, 0x0A0E16, 0.85);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.95);
dirLight.position.set(12, 18, 10);
scene.add(dirLight);

// High-tech accent ceiling strip & spot lights
const labSpot1 = new THREE.SpotLight(0x38BDF8, 1.2, 35, Math.PI * 0.25, 0.4);
labSpot1.position.set(-8, 6.8, -8);
scene.add(labSpot1);

const labSpot2 = new THREE.SpotLight(0x00FF87, 1.0, 35, Math.PI * 0.25, 0.4);
labSpot2.position.set(8, 6.8, -8);
scene.add(labSpot2);

const labSpotCenter = new THREE.PointLight(0x8FB3E0, 0.6, 25);
labSpotCenter.position.set(0, 6.5, 0);
scene.add(labSpotCenter);

function toggleLightingMode(){
  isCyberTheme = !isCyberTheme;
  const btn = document.getElementById('lightModeBtn');
  if(isCyberTheme){
    scene.background.setHex(0x05070B);
    scene.fog.color.setHex(0x05070B);
    hemiLight.color.setHex(0x1E3A8A);
    hemiLight.groundColor.setHex(0x020617);
    dirLight.intensity = 0.45;
    labSpot1.color.setHex(0x00F0FF);
    labSpot1.intensity = 1.8;
    labSpot2.color.setHex(0x00FF66);
    labSpot2.intensity = 1.6;
    if(btn) btn.innerHTML = `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg> Yorug‘lik: Kiber`;
    toast("🌙 Kiber qorong‘i neon rejimiga o‘tildi");
  } else {
    scene.background.setHex(0x0A0D14);
    scene.fog.color.setHex(0x0A0D14);
    hemiLight.color.setHex(0x8FB3E0);
    hemiLight.groundColor.setHex(0x0A0E16);
    dirLight.intensity = 0.95;
    labSpot1.color.setHex(0x38BDF8);
    labSpot1.intensity = 1.2;
    labSpot2.color.setHex(0x00FF87);
    labSpot2.intensity = 1.0;
    if(btn) btn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg> Yorug‘lik: Kunduzgi`;
    toast("☀️ Laboratoriya kunduzgi yorug‘lik rejimiga o‘tildi");
  }
}

/* ==========================================================================
   3D VIRTUAL MAYDON (ARENA, DATA CENTER, LAB WALLS, RACKS & INFRASTRUCTURE)
   ========================================================================== */
const arenaGroup = new THREE.Group();
scene.add(arenaGroup);

// 1. Procedural Data Center Raised Access Floor Texture (Anti-static 60x60cm Tiles)
function createDataCenterFloorTexture(){
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#0F1522';
  ctx.fillRect(0, 0, size, size);

  // Draw metallic edge tile seams
  const tiles = 4;
  const tileSize = size / tiles;
  for(let i = 0; i < tiles; i++){
    for(let j = 0; j < tiles; j++){
      const x = i * tileSize, y = j * tileSize;
      ctx.fillStyle = (i + j) % 2 === 0 ? '#111827' : '#0F1522';
      ctx.fillRect(x + 2, y + 2, tileSize - 4, tileSize - 4);

      // Fine corner screwholes for data center raised panels
      ctx.fillStyle = '#222F46';
      ctx.fillRect(x + 5, y + 5, 4, 4);
      ctx.fillRect(x + tileSize - 9, y + 5, 4, 4);
      ctx.fillRect(x + 5, y + tileSize - 9, 4, 4);
      ctx.fillRect(x + tileSize - 9, y + tileSize - 9, 4, 4);
    }
  }

  // Tile grid lines
  ctx.strokeStyle = '#1D283C';
  ctx.lineWidth = 2;
  for(let i = 0; i <= tiles; i++){
    ctx.beginPath();
    ctx.moveTo(i * tileSize, 0); ctx.lineTo(i * tileSize, size);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i * tileSize); ctx.lineTo(size, i * tileSize);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(14, 14);
  return tex;
}

const floorTex = createDataCenterFloorTexture();
const floorGeo = new THREE.PlaneGeometry(36, 36);
const floorMat = new THREE.MeshStandardMaterial({
  map: floorTex,
  roughness: 0.75,
  metalness: 0.35
});
const floorMesh = new THREE.Mesh(floorGeo, floorMat);
floorMesh.rotation.x = -Math.PI / 2;
floorMesh.receiveShadow = true;
arenaGroup.add(floorMesh);

// Central Networking Sandbox Zone Overlay (Radius 13.5)
const FLOOR_R = 13.5;
const centerGrid = new THREE.GridHelper(FLOOR_R * 2, 28, 0x00FF87, 0x1E3A5F);
centerGrid.position.y = 0.006;
arenaGroup.add(centerGrid);

const arenaRing = new THREE.Mesh(
  new THREE.RingGeometry(FLOOR_R - 0.08, FLOOR_R, 80),
  new THREE.MeshBasicMaterial({ color: 0x38BDF8, transparent: true, opacity: 0.65, side: THREE.DoubleSide })
);
arenaRing.rotation.x = -Math.PI / 2;
arenaRing.position.y = 0.01;
arenaGroup.add(arenaRing);

const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

// 2. Arena Walls & Architectural Architecture (36m x 36m, height 7.5m)
const WALL_H = 7.5;
const wallMat = new THREE.MeshStandardMaterial({
  color: 0x121A28,
  roughness: 0.85,
  metalness: 0.2
});
const wallAccentMat = new THREE.MeshBasicMaterial({ color: 0x00FF87, transparent: true, opacity: 0.7 });
const wallAccentBlue = new THREE.MeshBasicMaterial({ color: 0x38BDF8, transparent: true, opacity: 0.7 });

function createWall(w, h, x, y, z, rotY){
  const g = new THREE.Group();
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), wallMat);
  g.add(mesh);

  // Lower protective baseboard / kickplate
  const kick = new THREE.Mesh(new THREE.PlaneGeometry(w, 0.4), new THREE.MeshStandardMaterial({ color: 0x080C14, metalness: 0.7, roughness: 0.3 }));
  kick.position.set(0, -h / 2 + 0.2, 0.02);
  g.add(kick);

  // Glowing tech horizontal accent line
  const accentLine = new THREE.Mesh(new THREE.PlaneGeometry(w, 0.05), wallAccentMat);
  accentLine.position.set(0, -h / 2 + 1.2, 0.02);
  g.add(accentLine);

  // Top cable raceway border
  const topTrim = new THREE.Mesh(new THREE.PlaneGeometry(w, 0.25), new THREE.MeshStandardMaterial({ color: 0x1E293B, metalness: 0.5 }));
  topTrim.position.set(0, h / 2 - 0.12, 0.02);
  g.add(topTrim);

  g.position.set(x, y, z);
  g.rotation.y = rotY;
  return g;
}

// 4 Enclosing Walls
const wallN = createWall(36, WALL_H, 0, WALL_H / 2, -18, 0); // North (Server Bay)
const wallS = createWall(36, WALL_H, 0, WALL_H / 2, 18, Math.PI); // South (Entrance & Lab Bay)
const wallE = createWall(36, WALL_H, 18, WALL_H / 2, 0, -Math.PI / 2); // East (Power & HVAC)
const wallW = createWall(36, WALL_H, -18, WALL_H / 2, 0, Math.PI / 2); // West (NOC Glass Window)
arenaGroup.add(wallN, wallS, wallE, wallW);

// 3. West Wall NOC Observation Window
const glassWin = new THREE.Mesh(
  new THREE.PlaneGeometry(16, 3.5),
  new THREE.MeshPhysicalMaterial({
    color: 0x0A1828,
    transparent: true,
    opacity: 0.45,
    roughness: 0.1,
    metalness: 0.1,
    transmission: 0.6,
    ior: 1.5
  })
);
glassWin.position.set(-17.9, 3.8, 0);
glassWin.rotation.y = Math.PI / 2;
arenaGroup.add(glassWin);

// Window Frame
const winFrame = new THREE.Mesh(
  new THREE.BoxGeometry(0.1, 3.7, 16.2),
  new THREE.MeshStandardMaterial({ color: 0x223147, metalness: 0.8, roughness: 0.3 })
);
winFrame.position.set(-17.85, 3.8, 0);
arenaGroup.add(winFrame);

// 4. Suspended Industrial Grid Ceiling
const ceilingTex = createDataCenterFloorTexture();
ceilingTex.repeat.set(10, 10);
const ceilingMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(36, 36),
  new THREE.MeshStandardMaterial({ map: ceilingTex, color: 0x0E1420, roughness: 0.9 })
);
ceilingMesh.position.set(0, WALL_H, 0);
ceilingMesh.rotation.x = Math.PI / 2;
arenaGroup.add(ceilingMesh);

// 5. Overhead Yellow Fiber Cable Raceways & Wire Basket Trays
const racewayMat = new THREE.MeshStandardMaterial({ color: 0xF59E0B, roughness: 0.4, metalness: 0.2 }); // Yellow fiber tray
function createCableTray(length, x, y, z, rotY = 0){
  const g = new THREE.Group();
  const bottom = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.04, length), racewayMat);
  const sideL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.25, length), racewayMat);
  sideL.position.x = -0.3; sideL.position.y = 0.1;
  const sideR = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.25, length), racewayMat);
  sideR.position.x = 0.3; sideR.position.y = 0.1;

  // Hanging steel rods from ceiling
  for(let i = -length / 2 + 2; i <= length / 2 - 2; i += 4){
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 1.2, 8), new THREE.MeshStandardMaterial({ color: 0x64748B, metalness: 0.8 }));
    rod.position.set(0, 0.6, i);
    g.add(rod);
  }

  g.add(bottom, sideL, sideR);
  g.position.set(x, y, z);
  g.rotation.y = rotY;
  return g;
}

// Overhead cable trays spanning north-to-south and across server racks
arenaGroup.add(createCableTray(30, -9, 6.2, 0, 0));
arenaGroup.add(createCableTray(30, 9, 6.2, 0, 0));
arenaGroup.add(createCableTray(20, 0, 6.4, -9, Math.PI / 2));
arenaGroup.add(createCableTray(20, 0, 6.4, 9, Math.PI / 2));

// 6. Datacenter 42U Server Racks with Blinking Activity LEDs
const rackLeds = []; // Array of led meshes to animate

function createServerRack(x, z, rotY = 0){
  const g = new THREE.Group();
  const rackW = 1.0, rackH = 3.2, rackD = 1.1;

  // Outer Metal Cabinet Frame
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x111827, metalness: 0.85, roughness: 0.3 });
  const frame = new THREE.Mesh(new THREE.BoxGeometry(rackW, rackH, rackD), frameMat);
  frame.position.y = rackH / 2;
  g.add(frame);

  // Perforated smoked glass front door
  const doorMat = new THREE.MeshPhysicalMaterial({
    color: 0x050810,
    transparent: true,
    opacity: 0.65,
    roughness: 0.2,
    metalness: 0.1
  });
  const door = new THREE.Mesh(new THREE.BoxGeometry(rackW * 0.92, rackH * 0.94, 0.05), doorMat);
  door.position.set(0, rackH / 2, rackD / 2 + 0.02);
  g.add(door);

  // Internal 1U and 2U Server Units with Status LEDs
  const serverUnitMat = new THREE.MeshStandardMaterial({ color: 0x1F2937, metalness: 0.6, roughness: 0.4 });
  for(let u = 0; u < 9; u++){
    const y = 0.4 + u * 0.3;
    const server = new THREE.Mesh(new THREE.BoxGeometry(rackW * 0.85, 0.22, rackD * 0.85), serverUnitMat);
    server.position.set(0, y, 0.02);
    g.add(server);

    // Green, Amber, Blue status LEDs
    for(let l = 0; l < 4; l++){
      const col = (l % 2 === 0) ? 0x00FF87 : (l === 1 ? 0x38BDF8 : 0xF59E0B);
      const led = new THREE.Mesh(
        new THREE.SphereGeometry(0.018, 8, 8),
        new THREE.MeshBasicMaterial({ color: col })
      );
      led.position.set(-0.3 + l * 0.1, y, rackD / 2 - 0.04);
      led.userData.baseColor = col;
      led.userData.blinkRate = 1.5 + Math.random() * 4.0;
      led.userData.phase = Math.random() * Math.PI * 2;
      g.add(led);
      rackLeds.push(led);
    }
  }

  g.position.set(x, 0, z);
  g.rotation.y = rotY;
  return g;
}

// Place Server Racks along the North Wall & Side Bays
for(let i = -6; i <= 6; i += 2.2){
  arenaGroup.add(createServerRack(i, -16.5, 0));
}
// Side Server Bays
arenaGroup.add(createServerRack(-16.5, -8, Math.PI / 2));
arenaGroup.add(createServerRack(-16.5, -5.5, Math.PI / 2));
arenaGroup.add(createServerRack(-16.5, -3, Math.PI / 2));

arenaGroup.add(createServerRack(16.5, -8, -Math.PI / 2));
arenaGroup.add(createServerRack(16.5, -5.5, -Math.PI / 2));
arenaGroup.add(createServerRack(16.5, -3, -Math.PI / 2));

// 7. Tech Lab Workbenches (South Wall)
function createWorkbench(x, z, rotY = 0){
  const g = new THREE.Group();
  const top = new THREE.Mesh(
    new THREE.BoxGeometry(3.2, 0.08, 1.2),
    new THREE.MeshStandardMaterial({ color: 0x1E293B, metalness: 0.4, roughness: 0.5 })
  );
  top.position.y = 0.95;
  g.add(top);

  // Steel legs
  const legMat = new THREE.MeshStandardMaterial({ color: 0x0F172A, metalness: 0.9, roughness: 0.2 });
  [[-1.4, -0.45], [1.4, -0.45], [-1.4, 0.45], [1.4, 0.45]].forEach(([lx, lz])=>{
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.95, 12), legMat);
    leg.position.set(lx, 0.475, lz);
    g.add(leg);
  });

  // Dual Lab Diagnostics Monitors on the desk
  for(let m = -0.6; m <= 0.6; m += 1.2){
    const mon = new THREE.Mesh(
      new THREE.BoxGeometry(0.9, 0.55, 0.04),
      new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.4 })
    );
    mon.position.set(m, 1.35, -0.2);
    const scr = new THREE.Mesh(
      new THREE.PlaneGeometry(0.82, 0.48),
      new THREE.MeshBasicMaterial({ color: 0x00FF87 })
    );
    scr.position.set(m, 1.35, -0.178);
    g.add(mon, scr);
  }

  g.position.set(x, 0, z);
  g.rotation.y = rotY;
  return g;
}

arenaGroup.add(createWorkbench(-8, 16.5, Math.PI));
arenaGroup.add(createWorkbench(8, 16.5, Math.PI));

/* Selection & Link Indicator Rings */
const selRing = new THREE.Mesh(
  new THREE.RingGeometry(0.5, 0.6, 40),
  new THREE.MeshBasicMaterial({ color: 0xFFB454, transparent: true, opacity: 0.9, side: THREE.DoubleSide })
);
selRing.rotation.x = -Math.PI / 2;
selRing.visible = false;
scene.add(selRing);

const linkRing = new THREE.Mesh(
  new THREE.RingGeometry(0.5, 0.6, 40),
  new THREE.MeshBasicMaterial({ color: 0x4FC7E8, transparent: true, opacity: 0.9, side: THREE.DoubleSide })
);
linkRing.rotation.x = -Math.PI / 2;
linkRing.visible = false;
scene.add(linkRing);

/* 3D Wi-Fi Coverage Zone Mesh */
const wifiCoverageGeo = new THREE.SphereGeometry(1, 36, 18, 0, Math.PI * 2, 0, Math.PI * 0.5);
const wifiCoverageMat = new THREE.MeshBasicMaterial({
  color: 0x38BDF8,
  transparent: true,
  opacity: 0.12,
  side: THREE.DoubleSide,
  depthWrite: false
});
const wifiCoverageMesh = new THREE.Mesh(wifiCoverageGeo, wifiCoverageMat);
wifiCoverageMesh.visible = false;
scene.add(wifiCoverageMesh);

const wifiCoverageRingGeo = new THREE.RingGeometry(0.96, 1.0, 56);
const wifiCoverageRingMat = new THREE.MeshBasicMaterial({
  color: 0x38BDF8,
  transparent: true,
  opacity: 0.5,
  side: THREE.DoubleSide
});
const wifiCoverageRing = new THREE.Mesh(wifiCoverageRingGeo, wifiCoverageRingMat);
wifiCoverageRing.rotation.x = -Math.PI / 2;
wifiCoverageRing.position.y = 0.03;
wifiCoverageMesh.add(wifiCoverageRing);

function updateWifiCoverageVisual(){
  let targetDev = null;
  const wifiModalEl = document.getElementById('wifiModal');
  if(wifiModalEl && wifiModalEl.classList.contains('show') && typeof activeWifiDevId !== 'undefined' && activeWifiDevId){
    targetDev = devices.get(activeWifiDevId);
  } else if(selectedDeviceId){
    targetDev = devices.get(selectedDeviceId);
  }

  if(targetDev && targetDev.wifi && targetDev.wifi.enabled && (targetDev.wifi.isAp || targetDev.wifi.hotspotMode)){
    wifiCoverageMesh.visible = true;
    wifiCoverageMesh.position.copy(targetDev.group.position);
    const r = targetDev.wifi.radius || 10;
    const pulse = 1 + Math.sin(clock.elapsedTime * 2.5) * 0.025;
    wifiCoverageMesh.scale.set(r * pulse, (r * 0.45) * pulse, r * pulse);
  } else {
    wifiCoverageMesh.visible = false;
  }
}

/* Animate Rack Blinking LEDs */
function updateRackLeds(time){
  for(let i = 0; i < rackLeds.length; i++){
    const led = rackLeds[i];
    const val = Math.sin(time * led.userData.blinkRate + led.userData.phase);
    led.visible = val > 0.1;
  }
}

/* Spawn Placement Logic */
function spawnPosition(){
  const n = devices.size;
  const ring = Math.floor(n / 8);
  const idx = n % 8;
  const radius = 2.6 + ring * 2.6;
  const angle = (idx / 8) * Math.PI * 2 + ring * 0.35;
  return new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
}

/* Raycasting & Interaction Helpers */
const raycaster = new THREE.Raycaster();
const mouseNDC = new THREE.Vector2();

function setMouse(e){
  const r = canvas.getBoundingClientRect();
  mouseNDC.x = ((e.clientX - r.left) / r.width) * 2 - 1;
  mouseNDC.y = -((e.clientY - r.top) / r.height) * 2 + 1;
}

function pickDevice(){
  if(isFpsMode){
    // In FPS mode, raycast straight from center of screen (crosshair)
    raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
  } else {
    raycaster.setFromCamera(mouseNDC, camera);
  }
  const meshes = [];
  devices.forEach(d => meshes.push(...d.pickMeshes));
  const hits = raycaster.intersectObjects(meshes, false);
  if(hits.length){
    // If in FPS mode, check maximum interaction distance (4.5m)
    if(isFpsMode && hits[0].distance > 5.5) return null;
    return hits[0].object.userData.deviceId;
  }
  return null;
}

function pickConnection(){
  if(isFpsMode){
    raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
  } else {
    raycaster.setFromCamera(mouseNDC, camera);
  }
  const meshes = [];
  connections.forEach(c => { if(c.hitMesh) meshes.push(c.hitMesh); });
  const hits = raycaster.intersectObjects(meshes, false);
  if(hits.length){
    if(isFpsMode && hits[0].distance > 5.5) return null;
    return hits[0].object.userData.connectionId;
  }
  return null;
}

function floorPoint(){
  if(isFpsMode) return null;
  raycaster.setFromCamera(mouseNDC, camera);
  const pt = new THREE.Vector3();
  const hit = raycaster.ray.intersectPlane(floorPlane, pt);
  return hit ? pt : null;
}

/* Mini Radar / Room Compass Updater */
function updateMiniRadar(){
  const radarCanvas = document.getElementById('radarCanvas');
  if(!radarCanvas) return;
  const ctx = radarCanvas.getContext('2d');
  const w = radarCanvas.width, h = radarCanvas.height;
  ctx.clearRect(0, 0, w, h);

  // Radar circular background
  ctx.fillStyle = 'rgba(10, 16, 26, 0.85)';
  ctx.beginPath();
  ctx.arc(w / 2, h / 2, w / 2 - 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Grid rings
  ctx.strokeStyle = 'rgba(37, 48, 72, 0.6)';
  ctx.beginPath();
  ctx.arc(w / 2, h / 2, (w / 2) * 0.5, 0, Math.PI * 2);
  ctx.stroke();

  const scale = (w / 2 - 8) / ARENA_HALF_W;

  // Draw devices as glowing dots
  devices.forEach(d => {
    const dx = w / 2 + d.group.position.x * scale;
    const dz = h / 2 + d.group.position.z * scale;
    ctx.fillStyle = d.type === 'server' ? '#FFB454' : d.type === 'switch' ? '#6FE3C4' : '#38BDF8';
    ctx.beginPath();
    ctx.arc(dx, dz, 2.5, 0, Math.PI * 2);
    ctx.fill();
  });

  // Draw other multiplayer peers
  if(typeof Multiplayer !== 'undefined' && Multiplayer.active){
    Multiplayer.peers.forEach(p => {
      const px = w / 2 + p.x * scale;
      const pz = h / 2 + p.z * scale;
      ctx.fillStyle = p.color || '#A78BFA';
      ctx.beginPath();
      ctx.arc(px, pz, 3.5, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  // Draw current player dot and viewing frustum cone
  const px = w / 2 + (isFpsMode ? fpsPos.x : target.x) * scale;
  const pz = h / 2 + (isFpsMode ? fpsPos.z : target.z) * scale;
  const yaw = isFpsMode ? fpsYaw : camTheta;

  // Viewing cone
  ctx.fillStyle = 'rgba(0, 255, 135, 0.2)';
  ctx.beginPath();
  ctx.moveTo(px, pz);
  ctx.arc(px, pz, 16, yaw - Math.PI / 2 - 0.5, yaw - Math.PI / 2 + 0.5);
  ctx.closePath();
  ctx.fill();

  // Player dot
  ctx.fillStyle = '#00FF87';
  ctx.beginPath();
  ctx.arc(px, pz, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 1.5;
  ctx.stroke();
}
