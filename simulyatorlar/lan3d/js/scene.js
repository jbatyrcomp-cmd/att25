/* ==========================================================================
   THREE.JS SCENE SETUP, LIGHTS, CAMERA, FLOOR & INTERACTION RAYCASTER
   ========================================================================== */

const canvas = document.getElementById('scene');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputEncoding = THREE.sRGBEncoding;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0B0E14);
scene.fog = new THREE.Fog(0x0B0E14, 18, 42);

const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 200);
const target = new THREE.Vector3(0, 1.1, 0);
let camTheta = Math.PI * 0.22, camPhi = Math.PI * 0.32, camRadius = 17;

function updateCamera(){
  const p = new THREE.Vector3(
    camRadius * Math.sin(camPhi) * Math.sin(camTheta),
    camRadius * Math.cos(camPhi),
    camRadius * Math.sin(camPhi) * Math.cos(camTheta)
  );
  camera.position.copy(target).add(p);
  camera.lookAt(target);
}

function onResize(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onResize);
onResize();
updateCamera();

/* Lights */
scene.add(new THREE.HemisphereLight(0x8FB3E0, 0x0A0E16, 0.9));
const dir = new THREE.DirectionalLight(0xffffff, 1.0);
dir.position.set(8, 14, 6);
scene.add(dir);
const fillLight = new THREE.PointLight(0x4FC7E8, 0.5, 30);
fillLight.position.set(-6, 6, -4);
scene.add(fillLight);

/* Floor Grid & Boundary Glow */
const FLOOR_R = 13.5;
const floorMat = new THREE.MeshStandardMaterial({ color: 0x0E141F, roughness: 0.95, metalness: 0.05 });
const floor = new THREE.Mesh(new THREE.CircleGeometry(FLOOR_R, 64), floorMat);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

const grid = new THREE.GridHelper(FLOOR_R * 2, 28, 0x2A3650, 0x1A2338);
grid.position.y = 0.005;
scene.add(grid);

const ringGlow = new THREE.Mesh(
  new THREE.RingGeometry(FLOOR_R - 0.06, FLOOR_R, 80),
  new THREE.MeshBasicMaterial({ color: 0x2E4066, transparent: true, opacity: 0.5, side: THREE.DoubleSide })
);
ringGlow.rotation.x = -Math.PI / 2;
ringGlow.position.y = 0.01;
scene.add(ringGlow);

const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

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
  raycaster.setFromCamera(mouseNDC, camera);
  const meshes = [];
  devices.forEach(d => meshes.push(...d.pickMeshes));
  const hits = raycaster.intersectObjects(meshes, false);
  if(hits.length) return hits[0].object.userData.deviceId;
  return null;
}

function pickConnection(){
  raycaster.setFromCamera(mouseNDC, camera);
  const meshes = [];
  connections.forEach(c => { if(c.hitMesh) meshes.push(c.hitMesh); });
  const hits = raycaster.intersectObjects(meshes, false);
  if(hits.length) return hits[0].object.userData.connectionId;
  return null;
}

function floorPoint(){
  raycaster.setFromCamera(mouseNDC, camera);
  const pt = new THREE.Vector3();
  const hit = raycaster.ray.intersectPlane(floorPlane, pt);
  return hit ? pt : null;
}
