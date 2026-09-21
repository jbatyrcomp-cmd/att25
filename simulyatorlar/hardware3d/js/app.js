/* ==========================================================================
   INTERACTIVE SELECTION, CONTROLS, COMPLETE DISASSEMBLY & ANIMATION LOOP
   ATT-25 Kompyuter Sxemalari, Arxitekturasi va Atributlari Simulyatori
   ========================================================================== */
(function(){
"use strict";

/* DOM References */
const panel = document.getElementById('panel');
const pName = document.getElementById('pName');
const pType = document.getElementById('pType');
const pStatusText = document.getElementById('pStatusText');
const pDesc = document.getElementById('pDesc');
const pSchematic = document.getElementById('pSchematic');
const pSpecs = document.getElementById('pSpecs');
const pClose = document.getElementById('pClose');
const toastEl = document.getElementById('toast');

/* Sub-bars */
const disassemblyBar = document.getElementById('disassemblyBar');
const thermalBar = document.getElementById('thermalBar');
const logicBar = document.getElementById('logicBar');

/* Toast Message */
let toastTimer = null;
function toast(msg){
  if(!toastEl) return;
  toastEl.innerHTML = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>toastEl.classList.remove('show'), 2400);
}

/* ==========================================================================
   WEB AUDIO API SOUND SYNTHESIZER
   ========================================================================== */
let audioCtx = null;
let soundEnabled = true;

function initAudio(){
  if(!audioCtx){
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if(AudioContext) audioCtx = new AudioContext();
  }
  if(audioCtx && audioCtx.state === 'suspended'){
    audioCtx.resume();
  }
}

function playTone(freq, type = 'sine', duration = 0.08, vol = 0.15){
  if(!soundEnabled) return;
  initAudio();
  if(!audioCtx) return;

  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(vol, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch(e){}
}

function playClickSound(){
  playTone(800, 'triangle', 0.04, 0.12);
}

function playSnapSound(){
  playTone(320, 'square', 0.06, 0.18);
  setTimeout(()=>playTone(640, 'triangle', 0.04, 0.12), 20);
}

function playLeverSound(){
  playTone(220, 'sawtooth', 0.12, 0.15);
  setTimeout(()=>playTone(440, 'sine', 0.08, 0.1), 50);
}

const soundToggleBtn = document.getElementById('soundToggleBtn');
if(soundToggleBtn){
  soundToggleBtn.addEventListener('click', ()=>{
    soundEnabled = !soundEnabled;
    if(soundEnabled){
      initAudio();
      soundToggleBtn.classList.add('pulse-on');
      soundToggleBtn.querySelector('span').textContent = 'Ovoz: Yoqiq';
      toast("🔊 Ovoz effektlari yoqildi");
      playClickSound();
    } else {
      soundToggleBtn.classList.remove('pulse-on');
      soundToggleBtn.querySelector('span').textContent = 'Ovoz: O‘chiq';
      toast("🔇 Ovoz effektlari o‘chirildi");
    }
  });
}

/* ==========================================================================
   COMPONENT SELECTION & INSPECTOR PANEL
   ========================================================================== */
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
  playClickSound();

  // Highlight 3D bounding box
  const grp = componentGroups[key];
  if(grp){
    const bbox = new THREE.Box3().setFromObject(grp);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    bbox.getSize(size);
    bbox.getCenter(center);

    selBox.scale.set(size.x + 0.25, size.y + 0.25, size.z + 0.25);
    selBox.position.copy(center);
    selBox.visible = true;
  }

  toast(`<b>${data.name}</b> tanlandi`);
}

pClose.addEventListener('click', ()=>{
  panel.classList.remove('show');
  selBox.visible = false;
  playClickSound();
});

/* ==========================================================================
   COMPLETE DISASSEMBLY & ASSEMBLY STATE AND EXPLODED VIEW
   ========================================================================== */
const disassembly = {
  coolerMounted: true,
  leverOpen: false,
  cpuSeated: true,
  ramSeated: true,
  gpuSeated: true,
  card2Seated: true,
  ssdSeated: true,
  batterySeated: true,
  jumperSeated: true,
  explodeFactor: 0
};

function updateDisassemblyPositions(){
  const ef = disassembly.explodeFactor;

  // 1. Cooler
  if(animatedParts.cooler){
    const baseCoolerY = disassembly.coolerMounted ? 0.35 : 4.8;
    animatedParts.cooler.position.y = baseCoolerY + ef * 3.8;
  }

  // 2. CPU Lever & Bracket
  if(animatedParts.cpuLever){
    animatedParts.cpuLever.rotation.z = disassembly.leverOpen ? -1.3 : 0;
  }
  if(animatedParts.cpuBracket){
    animatedParts.cpuBracket.rotation.x = disassembly.leverOpen ? -0.8 : 0;
  }

  // 3. CPU Processor
  if(animatedParts.cpuProc){
    const baseCpuY = disassembly.cpuSeated ? 0.1 : 2.4;
    animatedParts.cpuProc.position.y = baseCpuY + ef * 1.8;
  }

  // 4. RAM Sticks & Latches
  animatedParts.ramSticks.forEach(stick => {
    const baseRamY = disassembly.ramSeated ? 0.5 : 2.4;
    stick.position.y = baseRamY + ef * 2.0;
  });
  animatedParts.ramLatches.forEach(latch => {
    latch.rotation.x = disassembly.ramSeated ? 0 : 0.35;
  });

  // 5. Expansion Cards (GPU & Sound Card)
  if(animatedParts.gpuCard){
    const baseGpuY = disassembly.gpuSeated ? 1.1 : 3.6;
    animatedParts.gpuCard.position.y = baseGpuY + ef * 2.6;
  }
  if(animatedParts.soundCard){
    const baseCard2Y = disassembly.card2Seated ? 1.0 : 3.4;
    animatedParts.soundCard.position.y = baseCard2Y + ef * 2.4;
  }

  // 6. M.2 SSD & Heatsink
  if(animatedParts.ssdHeatsink){
    animatedParts.ssdHeatsink.position.y = (disassembly.ssdSeated ? 0.22 : 1.8) + ef * 1.4;
  }
  if(animatedParts.ssdBoard){
    animatedParts.ssdBoard.position.y = (disassembly.ssdSeated ? 0.1 : 1.0) + ef * 0.9;
    animatedParts.ssdBoard.rotation.z = disassembly.ssdSeated ? 0 : 0.35;
  }

  // 7. CR2032 Battery
  if(animatedParts.cmosBat){
    const baseBatY = disassembly.batterySeated ? 0.2 : 1.6;
    animatedParts.cmosBat.position.y = baseBatY + ef * 1.2;
  }

  // 8. CMOS Jumper Shunt
  if(animatedParts.cmosJumper){
    const baseJmpY = disassembly.jumperSeated ? 0.16 : 0.9;
    animatedParts.cmosJumper.position.y = baseJmpY + ef * 0.8;
  }
}

// Exploded View Slider
const explodeSlider = document.getElementById('explodeSlider');
const explodeVal = document.getElementById('explodeVal');
if(explodeSlider){
  explodeSlider.addEventListener('input', (e)=>{
    const val = parseInt(e.target.value, 10);
    explodeVal.textContent = val + '%';
    disassembly.explodeFactor = val / 100;
    updateDisassemblyPositions();
  });
}

// Disassembly Buttons
const toggleCoolerBtn = document.getElementById('toggleCoolerBtn');
if(toggleCoolerBtn){
  toggleCoolerBtn.addEventListener('click', ()=>{
    disassembly.coolerMounted = !disassembly.coolerMounted;
    toggleCoolerBtn.textContent = disassembly.coolerMounted ? "❄️ Kuler: O‘rnatilgan" : "❌ Kuler: Yechilgan";
    toggleCoolerBtn.classList.toggle('pulse-on', disassembly.coolerMounted);
    playSnapSound();
    updateDisassemblyPositions();
    toast(disassembly.coolerMounted ? "❄️ Pin-Fin kuler soket ustiga o‘rnatildi" : "⚠️ Kuler yechildi — CPU ochiq");
  });
}

const toggleLeverBtn = document.getElementById('toggleLeverBtn');
if(toggleLeverBtn){
  toggleLeverBtn.addEventListener('click', ()=>{
    disassembly.leverOpen = !disassembly.leverOpen;
    toggleLeverBtn.textContent = disassembly.leverOpen ? "🔓 Soket Dastagi: Ochiq" : "🔒 Soket Dastagi: Yopiq";
    toggleLeverBtn.classList.toggle('pulse-on', !disassembly.leverOpen);
    playLeverSound();
    updateDisassemblyPositions();
    toast(disassembly.leverOpen ? "🔓 Soket dastagi ko‘tarildi — CPU ni olish mumkin" : "🔒 Soket dastagi mahkamlandi");
  });
}

const toggleCpuBtn = document.getElementById('toggleCpuBtn');
if(toggleCpuBtn){
  toggleCpuBtn.addEventListener('click', ()=>{
    if(!disassembly.leverOpen && disassembly.cpuSeated){
      toast("⚠️ Avval <b>Soket Dastagini</b> oching!");
      playTone(180, 'sawtooth', 0.15, 0.2);
      return;
    }
    disassembly.cpuSeated = !disassembly.cpuSeated;
    toggleCpuBtn.textContent = disassembly.cpuSeated ? "🧠 CPU: Soketda" : "❌ CPU: Chiqarilgan";
    toggleCpuBtn.classList.toggle('pulse-on', disassembly.cpuSeated);
    playClickSound();
    updateDisassemblyPositions();
    toast(disassembly.cpuSeated ? "🧠 Protsessor soketga o‘rnatildi" : "📦 CPU chiqarildi — Pinlar paneli ko‘rindi");
  });
}

const toggleRamBtn = document.getElementById('toggleRamBtn');
if(toggleRamBtn){
  toggleRamBtn.addEventListener('click', ()=>{
    disassembly.ramSeated = !disassembly.ramSeated;
    toggleRamBtn.textContent = disassembly.ramSeated ? "💾 RAM: Qulflangan" : "❌ RAM: Chiqarilgan";
    toggleRamBtn.classList.toggle('pulse-on', disassembly.ramSeated);
    playSnapSound();
    updateDisassemblyPositions();
    toast(disassembly.ramSeated ? "💾 Dual-Channel RAM modullari slotga qistirildi (Click!)" : "🔓 RAM fiksatorlari ochildi va modullar yechildi");
  });
}

const toggleGpuBtn = document.getElementById('toggleGpuBtn');
if(toggleGpuBtn){
  toggleGpuBtn.addEventListener('click', ()=>{
    disassembly.gpuSeated = !disassembly.gpuSeated;
    toggleGpuBtn.textContent = disassembly.gpuSeated ? "🚀 GPU: Slotda" : "❌ GPU: Chiqarilgan";
    toggleGpuBtn.classList.toggle('pulse-on', disassembly.gpuSeated);
    playSnapSound();
    updateDisassemblyPositions();
    toast(disassembly.gpuSeated ? "🚀 Videokarta AGP/PCIe slotiga ulandi" : "⚠️ Videokarta chiqarildi — Slot bo‘sh");
  });
}

const toggleCard2Btn = document.getElementById('toggleCard2Btn');
if(toggleCard2Btn){
  toggleCard2Btn.addEventListener('click', ()=>{
    disassembly.card2Seated = !disassembly.card2Seated;
    toggleCard2Btn.textContent = disassembly.card2Seated ? "🎵 Ovoz Kartasi: Slotda" : "❌ Ovoz Kartasi: Chiqarilgan";
    toggleCard2Btn.classList.toggle('pulse-on', disassembly.card2Seated);
    playSnapSound();
    updateDisassemblyPositions();
    toast(disassembly.card2Seated ? "🎵 Ovoz kartasi PCI slotiga ulandi" : "⚠️ Ovoz kartasi chiqarildi");
  });
}

const toggleSsdBtn = document.getElementById('toggleSsdBtn');
if(toggleSsdBtn){
  toggleSsdBtn.addEventListener('click', ()=>{
    disassembly.ssdSeated = !disassembly.ssdSeated;
    toggleSsdBtn.textContent = disassembly.ssdSeated ? "⚡ M.2 SSD: O‘rnatilgan" : "❌ M.2 SSD: Chiqarilgan";
    toggleSsdBtn.classList.toggle('pulse-on', disassembly.ssdSeated);
    playClickSound();
    updateDisassemblyPositions();
    toast(disassembly.ssdSeated ? "⚡ M.2 NVMe SSD vinti qotirildi" : "🔩 M.2 radiatori va SSD chiqarib olindi");
  });
}

const toggleBatteryBtn = document.getElementById('toggleBatteryBtn');
if(toggleBatteryBtn){
  toggleBatteryBtn.addEventListener('click', ()=>{
    disassembly.batterySeated = !disassembly.batterySeated;
    toggleBatteryBtn.textContent = disassembly.batterySeated ? "🔋 Batareya: O‘rnatilgan" : "❌ Batareya: Chiqarilgan";
    toggleBatteryBtn.classList.toggle('pulse-on', disassembly.batterySeated);
    playSnapSound();
    updateDisassemblyPositions();
    toast(disassembly.batterySeated ? "🔋 CR2032 3V batareyasi joyiga o‘rnatildi" : "⚠️ CMOS batareyasi chiqarildi — Sozlamalar va vaqt nollanadi!");
  });
}

const toggleJumperBtn = document.getElementById('toggleJumperBtn');
if(toggleJumperBtn){
  toggleJumperBtn.addEventListener('click', ()=>{
    disassembly.jumperSeated = !disassembly.jumperSeated;
    toggleJumperBtn.textContent = disassembly.jumperSeated ? "⚙️ CMOS Jumper: 1-2" : "⚙️ CMOS Jumper: 2-3 (Reset)";
    toggleJumperBtn.classList.toggle('pulse-on', disassembly.jumperSeated);
    playClickSound();
    updateDisassemblyPositions();
    toast(disassembly.jumperSeated ? "⚙️ CLRTC Jumper: 1-2 (Normal holat)" : "⚡ CLRTC Jumper: 2-3 (Clear CMOS — BIOS sozlamalari tiklandi)");
  });
}

/* ==========================================================================
   INTERACTIVE LOGIC GATES & ALU SANDBOX
   ========================================================================== */
const logicState = {
  A: 0,
  B: 0
};

const btnInputA = document.getElementById('btnInputA');
const btnInputB = document.getElementById('btnInputB');
const outSum = document.getElementById('outSum');
const outCarry = document.getElementById('outCarry');

function updateLogicCircuit(){
  const A = logicState.A;
  const B = logicState.B;
  const S = A ^ B; // XOR for Sum
  const C = A & B; // AND for Carry

  if(btnInputA) btnInputA.querySelector('b').textContent = A;
  if(btnInputB) btnInputB.querySelector('b').textContent = B;
  if(outSum) outSum.textContent = S;
  if(outCarry) outCarry.textContent = C;

  ['00', '01', '10', '11'].forEach(code => {
    const row = document.getElementById('ttRow' + code);
    if(row) row.classList.remove('active');
  });
  const activeRow = document.getElementById(`ttRow${A}${B}`);
  if(activeRow) activeRow.classList.add('active');

  animatedParts.logicLeds.forEach(l => {
    const isLit = l.key === 'Sum' ? (S === 1) : (C === 1);
    l.mesh.material.emissive.setHex(isLit ? 0x00FF87 : 0x1E293B);
    l.mesh.material.emissiveIntensity = isLit ? 1.0 : 0.1;
  });

  animatedParts.logicWires.forEach(w => {
    const val = w.key === 'A' ? A : B;
    w.mesh.material.color.setHex(val === 1 ? 0x00FF87 : 0x38BDF8);
  });

  playTone(A || B ? 520 : 380, 'sine', 0.05, 0.1);
  toast(`ALU Kirish: <b>A=${A}, B=${B}</b> ➔ Yig‘indi=${S}, Ko‘chirish=${C}`);
}

if(btnInputA){
  btnInputA.addEventListener('click', ()=>{
    logicState.A = logicState.A === 0 ? 1 : 0;
    updateLogicCircuit();
  });
}
if(btnInputB){
  btnInputB.addEventListener('click', ()=>{
    logicState.B = logicState.B === 0 ? 1 : 0;
    updateLogicCircuit();
  });
}

/* ==========================================================================
   OVERCLOCKING & THERMAL SIMULATION
   ========================================================================== */
const thermalState = {
  ghz: 4.2,
  vcore: 1.15,
  cooler: 'tower',
  isStressTest: false,
  fanRpm: 1450,
  temp: 48,
  power: 125
};

const ghzSlider = document.getElementById('ghzSlider');
const ghzVal = document.getElementById('ghzVal');
const vcoreSlider = document.getElementById('vcoreSlider');
const vcoreVal = document.getElementById('vcoreVal');
const coolerSelect = document.getElementById('coolerSelect');
const cpuTempGauge = document.getElementById('cpuTempGauge');
const tempStatus = document.getElementById('tempStatus');
const powerGauge = document.getElementById('powerGauge');
const fanRpmGauge = document.getElementById('fanRpmGauge');
const stressTestBtn = document.getElementById('stressTestBtn');

function calculateThermal(){
  const { ghz, vcore, cooler, isStressTest } = thermalState;

  const vFactor = Math.pow(vcore / 1.15, 2);
  const fFactor = ghz / 4.2;
  const loadFactor = isStressTest ? 1.85 : 1.0;
  let power = Math.round(125 * vFactor * fFactor * loadFactor);

  let coolerDissipation = 180;
  if(cooler === 'box') coolerDissipation = 85;
  if(cooler === 'aio') coolerDissipation = 320;

  let temp = Math.round(28 + (power / coolerDissipation) * 42);
  let fanRpm = Math.min(2600, Math.round(800 + (temp / 100) * 1600));

  thermalState.temp = temp;
  thermalState.power = power;
  thermalState.fanRpm = fanRpm;

  if(cpuTempGauge){
    cpuTempGauge.textContent = temp + ' °C';
    if(temp < 55){
      cpuTempGauge.style.color = 'var(--accent)';
      tempStatus.textContent = "Optimal Sovutish";
    } else if(temp < 75){
      cpuTempGauge.style.color = 'var(--gold)';
      tempStatus.textContent = "Iliq / O‘rtacha Yuklama";
    } else if(temp < 95){
      cpuTempGauge.style.color = 'var(--danger)';
      tempStatus.textContent = "⚠️ Yuqori Harorat (Ogohlik)";
    } else {
      cpuTempGauge.style.color = '#FF0055';
      tempStatus.textContent = "🚨 THERMAL THROTTLING! (100°C+)";
      toast("🚨 <b>DIQQAT:</b> CPU harorati 95°C dan oshdi! Termal throttling!");
    }
  }

  if(powerGauge) powerGauge.textContent = power + ' W';
  if(fanRpmGauge) fanRpmGauge.textContent = fanRpm + ' RPM';

  if(temp > 85){
    keyLight.color.setHex(0xFF4422);
  } else {
    keyLight.color.setHex(0xFFFFFF);
  }
}

if(ghzSlider){
  ghzSlider.addEventListener('input', (e)=>{
    thermalState.ghz = parseFloat((e.target.value / 10).toFixed(1));
    ghzVal.textContent = thermalState.ghz + ' GHz';
    calculateThermal();
  });
}
if(vcoreSlider){
  vcoreSlider.addEventListener('input', (e)=>{
    thermalState.vcore = parseFloat((e.target.value / 100).toFixed(2));
    vcoreVal.textContent = thermalState.vcore + ' V';
    calculateThermal();
  });
}
if(coolerSelect){
  coolerSelect.addEventListener('change', (e)=>{
    thermalState.cooler = e.target.value;
    calculateThermal();
    playSnapSound();
    toast(`Sovutish tizimi o‘zgartirildi: <b>${e.target.options[e.target.selectedIndex].text}</b>`);
  });
}
if(stressTestBtn){
  stressTestBtn.addEventListener('click', ()=>{
    thermalState.isStressTest = !thermalState.isStressTest;
    stressTestBtn.classList.toggle('pulse-on', thermalState.isStressTest);
    stressTestBtn.textContent = thermalState.isStressTest ? "🔥 Yuklama To‘xtatish" : "⚡ Stress Test (100%)";
    calculateThermal();
    playTone(thermalState.isStressTest ? 600 : 300, 'square', 0.1, 0.15);
    toast(thermalState.isStressTest ? "⚡ 100% AVX2 Stress-test boshlandi!" : "Normal rejimga qaytildi");
  });
}

/* ==========================================================================
   INSTRUCTION CYCLE MODES (Fetch-Decode-Execute, DMA, Normal)
   ========================================================================== */
let cycleMode = 'normal';
const cycleModeBtn = document.getElementById('cycleModeBtn');

if(cycleModeBtn){
  cycleModeBtn.addEventListener('click', ()=>{
    if(cycleMode === 'normal'){
      cycleMode = 'fde';
      cycleModeBtn.querySelector('span').textContent = 'Sikl: Buyruq (F-D-E)';
      toast("🔄 <b>Buyruq Sikli:</b> Fetch ➔ Decode ➔ Execute ➔ Writeback");
    } else if(cycleMode === 'fde'){
      cycleMode = 'dma';
      cycleModeBtn.querySelector('span').textContent = 'Sikl: Xotira DMA';
      toast("💾 <b>DMA Oqimi:</b> M.2 SSD ➔ Chipset ➔ RAM");
    } else if(cycleMode === 'dma'){
      cycleMode = 'pcie';
      cycleModeBtn.querySelector('span').textContent = 'Sikl: PCIe / AGP Magistral';
      toast("🚀 <b>PCIe / AGP Magistral:</b> CPU ➔ Kengaytma Kartalari");
    } else {
      cycleMode = 'normal';
      cycleModeBtn.querySelector('span').textContent = 'Sikl: Oddiy';
      toast("⚡ Barcha shinalar parallel ishlamoqda");
    }
    playClickSound();
  });
}

/* Pulse Speed Button */
const pulseSpeedBtn = document.getElementById('pulseSpeedBtn');
let speedMultiplier = 1.0;
if(pulseSpeedBtn){
  pulseSpeedBtn.addEventListener('click', ()=>{
    if(speedMultiplier === 1.0){
      speedMultiplier = 2.4;
      pulseSpeedBtn.querySelector('span').textContent = 'Takt: 5.8 GHz Turbo';
      toast("⚡ Takt chastotasi oshirildi: 5.8 GHz Turbo");
    } else if(speedMultiplier === 2.4){
      speedMultiplier = 0.4;
      pulseSpeedBtn.querySelector('span').textContent = 'Takt: 1.2 GHz Eco';
      toast("🌱 Takt chastotasi tushirildi: 1.2 GHz Eco");
    } else {
      speedMultiplier = 1.0;
      pulseSpeedBtn.querySelector('span').textContent = 'Takt: 4.2 GHz';
      toast("⚖️ Normal takt rejimi: 4.2 GHz");
    }
    playClickSound();
  });
}

/* ==========================================================================
   MODES & CAMERA FOCUS
   ========================================================================== */
const modeButtons = document.querySelectorAll('.modebtn');
modeButtons.forEach(btn => {
  btn.addEventListener('click', ()=>{
    modeButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const mode = btn.dataset.mode;
    playClickSound();

    disassemblyBar.classList.remove('show');
    thermalBar.classList.remove('show');
    logicBar.classList.remove('show');

    if(mode === 'all'){
      camTarget.set(0, 0.2, 0);
      camRadius = 16.5; camPhi = Math.PI * 0.32; camTheta = Math.PI * 0.38;
      panel.classList.remove('show');
      selBox.visible = false;
      toast("Barcha ona plata sxemalari ko‘rinishi");
    } else if(mode === 'disassembly'){
      disassemblyBar.classList.add('show');
      camTarget.set(0, 0.5, 0);
      camRadius = 14.5; camPhi = Math.PI * 0.3; camTheta = Math.PI * 0.3;
      toast("🔧 <b>Yig‘ish / Ajratish rejimi:</b> Qismlarni yechish yoki Exploded View ni boshqaring");
    } else if(mode === 'thermal'){
      thermalBar.classList.add('show');
      camTarget.set(-1.0, 0.5, -2.4);
      camRadius = 10; camPhi = Math.PI * 0.28;
      selectComponent('cpu');
      toast("🔥 <b>Termal & Overclocking:</b> Chastota va kuchlanishni sinab ko‘ring");
    } else if(mode === 'logic'){
      logicBar.classList.add('show');
      selectComponent('logic');
      if(componentGroups.logic){
        camTarget.copy(componentGroups.logic.position);
        camRadius = 7.0; camPhi = Math.PI * 0.24;
      }
      toast("🔲 <b>Mantiqiy Elementlar (ALU):</b> Kirish A va B qiymatlarini bosing");
    } else if(HARDWARE_DATA[mode]) {
      selectComponent(mode);
      const grp = componentGroups[mode];
      if(grp){
        camTarget.copy(grp.position);
        camRadius = 9.0; camPhi = Math.PI * 0.3;
        toast(HARDWARE_DATA[mode].name + " sxemasiga yaqinlashildi");
      }
    }
    updateCamera();
  });
});

/* Reset Cam Button */
document.getElementById('resetCamBtn').addEventListener('click', ()=>{
  camTarget.set(0, 0.2, 0);
  camRadius = 16.5; camPhi = Math.PI * 0.32; camTheta = Math.PI * 0.38;
  updateCamera();
  panel.classList.remove('show');
  selBox.visible = false;
  disassemblyBar.classList.remove('show');
  thermalBar.classList.remove('show');
  logicBar.classList.remove('show');
  toast("Kamera boshlang‘ich burchakka qaytarildi");
  playClickSound();
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
    playClickSound();
  });
}

/* ==========================================================================
   KNOWLEDGE QUIZ MODAL
   ========================================================================== */
const quizBtn = document.getElementById('quizBtn');
const quizModal = document.getElementById('quizModal');
const closeQuizBtn = document.getElementById('closeQuizBtn');
const quizQuestionText = document.getElementById('quizQuestionText');
const quizOptionsList = document.getElementById('quizOptionsList');
const quizExplanation = document.getElementById('quizExplanation');
const quizProgress = document.getElementById('quizProgress');
const quizScoreText = document.getElementById('quizScoreText');
const nextQuizBtn = document.getElementById('nextQuizBtn');

let currentQuizIdx = 0;
let quizScore = 0;
let quizAnswered = false;

function loadQuizQuestion(idx){
  if(idx >= HARDWARE_QUIZ.length){
    quizQuestionText.textContent = `Tabriklaymiz! Test yakunlandi. Sizning natijangiz: ${quizScore} / ${HARDWARE_QUIZ.length}`;
    quizOptionsList.innerHTML = '';
    quizExplanation.style.display = 'none';
    nextQuizBtn.textContent = 'Qayta Boshlash';
    return;
  }

  quizAnswered = false;
  const q = HARDWARE_QUIZ[idx];
  quizProgress.textContent = `Savol ${idx + 1} / ${HARDWARE_QUIZ.length}`;
  quizScoreText.textContent = `To‘g‘ri javoblar: ${quizScore} / ${idx}`;
  quizQuestionText.textContent = q.q;
  quizExplanation.classList.remove('show');
  quizExplanation.textContent = '';
  quizOptionsList.innerHTML = '';

  q.options.forEach((opt, optIdx) => {
    const btn = document.createElement('button');
    btn.className = 'q-opt';
    btn.textContent = opt;
    btn.addEventListener('click', ()=>{
      if(quizAnswered) return;
      quizAnswered = true;
      if(optIdx === q.correct){
        btn.classList.add('correct');
        quizScore++;
        playTone(880, 'sine', 0.1, 0.2);
      } else {
        btn.classList.add('wrong');
        const correctBtn = quizOptionsList.children[q.correct];
        if(correctBtn) correctBtn.classList.add('correct');
        playTone(220, 'sawtooth', 0.15, 0.2);
      }
      quizExplanation.textContent = '💡 ' + q.exp;
      quizExplanation.classList.add('show');
      quizScoreText.textContent = `To‘g‘ri javoblar: ${quizScore} / ${idx + 1}`;
    });
    quizOptionsList.appendChild(btn);
  });
}

if(quizBtn){
  quizBtn.addEventListener('click', ()=>{
    currentQuizIdx = 0;
    quizScore = 0;
    nextQuizBtn.textContent = 'Keyingi Savol ➔';
    loadQuizQuestion(currentQuizIdx);
    quizModal.classList.add('show');
    playClickSound();
  });
}
if(closeQuizBtn){
  closeQuizBtn.addEventListener('click', ()=>{
    quizModal.classList.remove('show');
    playClickSound();
  });
}
if(nextQuizBtn){
  nextQuizBtn.addEventListener('click', ()=>{
    playClickSound();
    if(currentQuizIdx >= HARDWARE_QUIZ.length){
      currentQuizIdx = 0;
      quizScore = 0;
      nextQuizBtn.textContent = 'Keyingi Savol ➔';
      loadQuizQuestion(currentQuizIdx);
    } else {
      currentQuizIdx++;
      loadQuizQuestion(currentQuizIdx);
    }
  });
}

/* ==========================================================================
   RAYCASTING & INTERACTION
   ========================================================================== */
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('pointerdown', (e)=>{
  if(e.target.closest('#toolbar, #panel, #bottomBar, .sub-bar, .modal-card')) return;

  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(pickableMeshes, true);

  if(hits.length > 0){
    const hitObj = hits[0].object;

    if(hitObj.userData.isLogicSwitch === 'A'){
      logicState.A = logicState.A === 0 ? 1 : 0;
      updateLogicCircuit();
      return;
    }
    if(hitObj.userData.isLogicSwitch === 'B'){
      logicState.B = logicState.B === 0 ? 1 : 0;
      updateLogicCircuit();
      return;
    }

    let key = hitObj.userData.compKey;
    let parent = hitObj.parent;
    while(!key && parent){
      key = parent.userData ? parent.userData.compKey : null;
      parent = parent.parent;
    }

    if(key) selectComponent(key);
  }
});

/* Orbit & Touch Drag Controls */
let isDragging = false, prevMouseX = 0, prevMouseY = 0;

window.addEventListener('pointerdown', (e)=>{
  if(e.target.closest('#toolbar, #panel, #bottomBar, .sub-bar, .modal-card')) return;
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
  camRadius = Math.max(4, Math.min(24, camRadius + e.deltaY * 0.012));
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

/* ==========================================================================
   ANIMATION LOOP
   ========================================================================== */
const clock = new THREE.Clock();

function animate(){
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05);

  const fanSpeed = (thermalState.fanRpm / 60) * Math.PI * 2 * dt;
  animatedParts.fanBlades.forEach(f => {
    f.rotation.z += fanSpeed;
  });

  particleSystem.forEach(p => {
    let busActive = true;
    if(cycleMode === 'fde'){
      busActive = (p.type === 'address' || p.type === 'data');
    } else if(cycleMode === 'dma'){
      busActive = (p.type === 'power' || p.type === 'dmi');
    } else if(cycleMode === 'pcie'){
      busActive = (p.type === 'pcie');
    }

    if(busActive){
      p.mesh.visible = true;
      p.t += dt * (p.speed * 0.38 * speedMultiplier);
      if(p.t > 1) p.t -= 1;
      p.mesh.position.lerpVectors(p.from, p.to, p.t);
    } else {
      p.mesh.visible = false;
    }
  });

  centerGlow.intensity = 0.9 + Math.sin(clock.elapsedTime * 4) * 0.25;

  updateLabels();
  renderer.render(scene, camera);
}

setTimeout(()=>{
  selectComponent('cpu');
  calculateThermal();
}, 450);

animate();

})();
