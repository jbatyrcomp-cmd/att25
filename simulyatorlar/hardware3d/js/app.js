/* ==========================================================================
   INTERACTIVE SELECTION, CONTROLS & ANIMATION LOOP
   ========================================================================== */
(function(){
"use strict";

const panel = document.getElementById('panel');
const pName = document.getElementById('pName');
const pType = document.getElementById('pType');
const pStatusText = document.getElementById('pStatusText');
const pDesc = document.getElementById('pDesc');
const pSchematic = document.getElementById('pSchematic');
const pSpecs = document.getElementById('pSpecs');
const pClose = document.getElementById('pClose');
const toastEl = document.getElementById('toast');

let toastTimer = null;
function toast(msg){
  if(!toastEl) return;
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>toastEl.classList.remove('show'), 2000);
}

function selectComponent(key){
  const data = HARDWARE_DATA[key];
  if(!data) return;

  pName.textContent = data.name;
  pType.textContent = data.type;
  pStatusText.textContent = data.status;
  pDesc.textContent = data.desc;
  pSchematic.innerHTML = data.schematic.replace(/\n/g, '<br>');

  pSpecs.innerHTML = '';
  data.specs.forEach(s => {
    const row = document.createElement('div');
    row.className = 'spec-row';
    row.innerHTML = `<span class="k">${s.k}</span><span class="v">${s.v}</span>`;
    pSpecs.appendChild(row);
  });

  panel.classList.add('show');

  // Highlight 3D bounding box
  const grp = componentGroups[key];
  if(grp){
    const bbox = new THREE.Box3().setFromObject(grp);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    bbox.getSize(size);
    bbox.getCenter(center);

    selBox.scale.set(size.x + 0.2, size.y + 0.2, size.z + 0.2);
    selBox.position.copy(center);
    selBox.visible = true;
  }

  toast(data.name + " tanlandi");
}

pClose.addEventListener('click', ()=>{
  panel.classList.remove('show');
  selBox.visible = false;
});

/* Raycasting for Click Selection */
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('pointerdown', (e)=>{
  if(e.target.closest('#toolbar, #panel, #bottomBar')) return;

  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(pickableMeshes);

  if(hits.length > 0){
    const key = hits[0].object.userData.compKey;
    if(key) selectComponent(key);
  }
});

/* Modes & Camera Focus */
const modeButtons = document.querySelectorAll('.modebtn');
modeButtons.forEach(btn => {
  btn.addEventListener('click', ()=>{
    modeButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const mode = btn.dataset.mode;

    if(mode === 'all'){
      camTarget.set(0, 0, 0);
      camRadius = 14; camPhi = Math.PI * 0.35; camTheta = Math.PI * 0.25;
      panel.classList.remove('show');
      selBox.visible = false;
      toast("Barcha ona plata sxemalari ko‘rinishi");
    } else if(HARDWARE_DATA[mode]) {
      selectComponent(mode);
      const grp = componentGroups[mode];
      if(grp){
        camTarget.copy(grp.position);
        camRadius = 8; camPhi = Math.PI * 0.3;
        toast(HARDWARE_DATA[mode].name + " sxemasiga yaqinlashildi");
      }
    }
    updateCamera();
  });
});

/* Pulse Speed Button */
const pulseSpeedBtn = document.getElementById('pulseSpeedBtn');
let speedMultiplier = 1.0;
pulseSpeedBtn.addEventListener('click', ()=>{
  if(speedMultiplier === 1.0){
    speedMultiplier = 2.2;
    pulseSpeedBtn.querySelector('span').textContent = 'Takt: 5.4 GHz Turbo';
    toast("⚡ Takt chastotasi oshirildi: 5.4 GHz Turbo");
  } else if(speedMultiplier === 2.2){
    speedMultiplier = 0.4;
    pulseSpeedBtn.querySelector('span').textContent = 'Takt: 1.2 GHz Eco';
    toast("🌱 Takt chastotasi tushirildi: 1.2 GHz Eco");
  } else {
    speedMultiplier = 1.0;
    pulseSpeedBtn.querySelector('span').textContent = 'Takt: 4.2 GHz';
    toast("⚖️ Normal takt rejimi: 4.2 GHz");
  }
});

/* Reset Cam Button */
document.getElementById('resetCamBtn').addEventListener('click', ()=>{
  camTarget.set(0, 0, 0);
  camRadius = 14; camPhi = Math.PI * 0.35; camTheta = Math.PI * 0.25;
  updateCamera();
  panel.classList.remove('show');
  selBox.visible = false;
  toast("Kamera boshlang‘ich holatga qaytarildi");
});

/* Fullscreen Button */
const hwFsBtn = document.getElementById('hwFsBtn');
if(hwFsBtn){
  hwFsBtn.addEventListener('click', ()=>{
    if(!document.fullscreenElement){
      const req = document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen || document.documentElement.mozRequestFullScreen || document.documentElement.msRequestFullscreen;
      if(req) req.call(document.documentElement).catch(()=>{});
      toast("⛶ To‘liq ekran yoqildi");
    } else {
      const exit = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen;
      if(exit) exit.call(document).catch(()=>{});
      toast("Oynaga qaytildi");
    }
  });
}

/* Orbit & Touch Controls */
let isDragging = false, prevMouseX = 0, prevMouseY = 0;

window.addEventListener('pointerdown', (e)=>{
  if(e.target.closest('#toolbar, #panel, #bottomBar')) return;
  isDragging = true;
  prevMouseX = e.clientX;
  prevMouseY = e.clientY;
});

window.addEventListener('pointermove', (e)=>{
  if(!isDragging) return;
  const dx = e.clientX - prevMouseX;
  const dy = e.clientY - prevMouseY;
  prevMouseX = e.clientX;
  prevMouseY = e.clientY;

  camTheta -= dx * 0.007;
  camPhi = Math.max(0.12, Math.min(Math.PI * 0.48, camPhi - dy * 0.007));
  updateCamera();
});

window.addEventListener('pointerup', ()=>{ isDragging = false; });

window.addEventListener('wheel', (e)=>{
  camRadius = Math.max(4, Math.min(22, camRadius + e.deltaY * 0.012));
  updateCamera();
}, {passive:true});

/* Resize Handler */
function onResize(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  updateCamera();
}
window.addEventListener('resize', onResize);

/* Animation Loop */
const clock = new THREE.Clock();

function animate(){
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05);

  particleSystem.forEach(p => {
    p.t += dt * (p.speed * 0.35 * speedMultiplier);
    if(p.t > 1) p.t -= 1;
    p.mesh.position.lerpVectors(p.from, p.to, p.t);
  });

  goldLight.intensity = 1.0 + Math.sin(clock.elapsedTime * 4) * 0.3;

  updateLabels();
  renderer.render(scene, camera);
}

setTimeout(()=>selectComponent('cpu'), 400);

animate();

})();
