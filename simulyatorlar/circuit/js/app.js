/* ==========================================================================
   CIRCUIT LAB MAIN CONTROLLER & APPLICATION LOGIC
   ATT-25 Sxemotexnika, Mikroelektronika va 3D Maket Plata Laboratoriyasi
   ========================================================================== */

(function(){
"use strict";

/* DOM Elements */
const canvas = document.getElementById('circuitCanvas');
const ctx = canvas.getContext('2d');
const container = document.getElementById('canvasContainer');
const bb3dContainer = document.getElementById('breadboard3dContainer');
const workspaceEl = document.getElementById('workspace');

const btnModeSchematic = document.getElementById('btnModeSchematic');
const btnModeBreadboard = document.getElementById('btnModeBreadboard');
const btnModeSplit = document.getElementById('btnModeSplit');

const btnSimPlay = document.getElementById('btnSimPlay');
const btnClear = document.getElementById('btnClear');
const btnLabs = document.getElementById('btnLabs');
const btnDmmToggle = document.getElementById('btnDmmToggle');
const btnScopeToggle = document.getElementById('btnScopeToggle');
const btnSound = document.getElementById('btnSound');
const btnTroubleshoot = document.getElementById('btnTroubleshoot');
const btnReport = document.getElementById('btnReport');
const btnResetBurned = document.getElementById('btnResetBurned');

const troubleshootModal = document.getElementById('troubleshootModal');
const closeTroubleshootModal = document.getElementById('closeTroubleshootModal');
const troubleshootList = document.getElementById('troubleshootList');

const reportModal = document.getElementById('reportModal');
const closeReportModal = document.getElementById('closeReportModal');
const btnPrintReport = document.getElementById('btnPrintReport');
const reportContent = document.getElementById('reportContent');

const btnPresetsDropdown = document.getElementById('btnPresetsDropdown');
const presetsMenu = document.getElementById('presetsMenu');

const quickActionBubble = document.getElementById('quickActionBubble');
const bubbleRotateBtn = document.getElementById('bubbleRotateBtn');
const bubbleConfigBtn = document.getElementById('bubbleConfigBtn');
const bubbleDeleteBtn = document.getElementById('bubbleDeleteBtn');

const inspector = document.getElementById('inspector');
const inspTitle = document.getElementById('inspTitle');
const inspProps = document.getElementById('inspProps');
const btnCloseInspector = document.getElementById('btnCloseInspector');

const dmmWindow = document.getElementById('dmmWindow');
const scopeWindow = document.getElementById('scopeWindow');
const toastEl = document.getElementById('toast');
const shortWarning = document.getElementById('shortWarning');

const labsModal = document.getElementById('labsModal');
const closeLabsModal = document.getElementById('closeLabsModal');
const labsList = document.getElementById('labsList');

/* State */
let mode = 'schematic'; // 'schematic' (default) or 'breadboard'
let engine = new CircuitEngine();
let breadboard3d = null;
let multimeter = new DigitalMultimeter(engine);
let oscilloscope = new VirtualOscilloscope('scopeCanvas');
let functionGenerator = new FunctionGenerator();
let acAnalysis = new ACAnalysis(engine);
let dcSweep = new DCSweepAnalysis(engine);
let transientAn = new TransientAnalysis(engine);

let selectedComp = null;
let selectedWire = null;
let draggingComp = null;
let dragOffset = { x: 0, y: 0 };
let activeWireStartPin = null;
let currentWireMousePos = { x: 0, y: 0 };
let activeWireColor = '#38BDF8';
let activeProbeDrag = null; // 'red' or 'black'
let hoveredPin = null;
let placementPendingType = null; // Click-to-place from palette

let soundEnabled = true;
let audioCtx = null;
let buzzerOsc = null;

/* Audio Synthesizer */
function initAudio() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) audioCtx = new AudioContext();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playTone(freq, type = 'sine', duration = 0.08, vol = 0.15) {
  if (!soundEnabled) return;
  initAudio();
  if (!audioCtx) return;
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

function playSwitchSound() {
  playTone(340, 'square', 0.04, 0.2);
}
window.playSwitchSound = playSwitchSound;

function playSparkSound() {
  playTone(140, 'sawtooth', 0.15, 0.35);
}

function playContinuityBeep() {
  playTone(1200, 'square', 0.05, 0.12);
}
window.playContinuityBeep = playContinuityBeep;

function updateBuzzerSound() {
  const activeBuzzer = engine.components.find(c => c.type === 'buzzer' && Math.abs(c.current) > 0.01);
  if (activeBuzzer && soundEnabled) {
    initAudio();
    if (!buzzerOsc && audioCtx) {
      buzzerOsc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      buzzerOsc.type = 'square';
      buzzerOsc.frequency.setValueAtTime(2400, audioCtx.currentTime); // 2.4 kHz piezo tone
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      buzzerOsc.connect(gain);
      gain.connect(audioCtx.destination);
      buzzerOsc.start();
    }
  } else {
    if (buzzerOsc) {
      try { buzzerOsc.stop(); buzzerOsc.disconnect(); } catch(e){}
      buzzerOsc = null;
    }
  }
}

/* Toast */
let toastTimer = null;
function toast(msg) {
  if (!toastEl) return;
  toastEl.innerHTML = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2400);
}
window.toast = toast;

/* Resize Canvas */
function resizeCanvas() {
  const rect = container.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
  if (breadboard3d) breadboard3d.onResize();
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

/* Initialize 3D Breadboard */
if (window.Breadboard3D) {
  breadboard3d = new Breadboard3D('breadboard3dContainer', engine);
  breadboard3d.onWireCreated = (fromPinId, toPinId, color) => {
    const w = engine.addWire(fromPinId, toPinId, color);
    if (w) {
      toast(`✅ Sim muvaffaqiyatli ulandi! (3D)`);
      breadboard3d.syncFromEngine();
    }
  };
}

/* ==========================================================================
   COMPONENT CREATION HELPER
   ========================================================================== */
function addComponent(type, x, y) {
  let comp = null;
  if (type === 'battery_9v' || type === 'battery') comp = new CircuitComponents.Battery(x, y, 9.0);
  else if (type === 'battery_1v5') comp = new CircuitComponents.Battery(x, y, 1.5);
  else if (type === 'resistor') comp = new CircuitComponents.Resistor(x, y, 220);
  else if (type === 'resistor_1k') comp = new CircuitComponents.Resistor(x, y, 1000);
  else if (type === 'bulb') comp = new CircuitComponents.Bulb(x, y, 6.0);
  else if (type === 'led') comp = new CircuitComponents.Led(x, y, '#EF4444');
  else if (type === 'led_green') comp = new CircuitComponents.Led(x, y, '#10B981');
  else if (type === 'switch') comp = new CircuitComponents.Switch(x, y);
  else if (type === 'buzzer') comp = new CircuitComponents.Buzzer(x, y);
  else if (type === 'ground') comp = new CircuitComponents.Ground(x, y);
  else if (type === 'potentiometer') comp = new CircuitComponents.Potentiometer(x, y, 10000);
  else if (type === 'ldr') comp = new CircuitComponents.Ldr(x, y);
  else if (type === 'capacitor') comp = new CircuitComponents.Capacitor(x, y, 0.0001);
  else if (type === 'transistor_npn') comp = new CircuitComponents.TransistorNpn(x, y);
  else if (type === 'motor') comp = new CircuitComponents.DcMotor(x, y);
  else if (type === 'gate_and') comp = new CircuitComponents.LogicGate(x, y, 'and');
  else if (type === 'gate_or') comp = new CircuitComponents.LogicGate(x, y, 'or');
  else if (type === 'gate_not') comp = new CircuitComponents.LogicGate(x, y, 'not');
  else if (type === 'gate_nand') comp = new CircuitComponents.LogicGate(x, y, 'nand');
  else if (type === 'gate_nor') comp = new CircuitComponents.LogicGate(x, y, 'nor');
  else if (type === 'gate_xor') comp = new CircuitComponents.LogicGate(x, y, 'xor');
  else if (type === 'seven_segment') comp = new CircuitComponents.SevenSegment(x, y);
  else if (type === 'timer_555') comp = new CircuitComponents.Timer555(x, y);
  else if (type === 'arduino_uno') comp = new ArduinoComponent(x, y);
  // === YANGI KOMPONENTLAR ===
  else if (type === 'ammeter') comp = new CircuitComponents.Ammeter(x, y);
  else if (type === 'voltmeter') comp = new CircuitComponents.Voltmeter(x, y);
  else if (type === 'diode') comp = new CircuitComponents.Diode(x, y);
  else if (type === 'dc_source_5v') comp = new CircuitComponents.DcSource(x, y, 5.0);
  else if (type === 'dc_source_12v') comp = new CircuitComponents.DcSource(x, y, 12.0);
  else if (type === 'dc_source_3v3') comp = new CircuitComponents.DcSource(x, y, 3.3);
  // === FAZA 1: YANGI KOMPONENTLAR (Multisim darajasi) ===
  else if (type === 'transistor_pnp') comp = new CircuitComponents.TransistorPnp(x, y);
  else if (type === 'mosfet_n') comp = new CircuitComponents.MOSFETn(x, y);
  else if (type === 'mosfet_p') comp = new CircuitComponents.MOSFETp(x, y);
  else if (type === 'inductor') comp = new CircuitComponents.Inductor(x, y, 0.001);
  else if (type === 'transformer') comp = new CircuitComponents.Transformer(x, y, 1, 1);

  if (comp) {
    engine.addComponent(comp);
    selectComponent(comp);
    toast(`<b>${comp.name}</b> sxemaga qo‘shildi`);
    playTone(600, 'sine', 0.04, 0.1);
    if (breadboard3d && mode === 'breadboard') breadboard3d.syncFromEngine();
  }
  return comp;
}

function clearCircuit() {
  engine.components = [];
  engine.wires = [];
  selectComponent(null);
  selectedWire = null;
  toast("Sxema tozalandi");
  if (breadboard3d) breadboard3d.syncFromEngine();
}

/* ==========================================================================
   QUICK ACTION FLOATING BUBBLE FOR SELECTED COMPONENT
   ========================================================================== */
function updateQuickActionBubble() {
  if (!quickActionBubble) return;
  if (!selectedComp || mode !== 'schematic') {
    quickActionBubble.classList.remove('show');
    return;
  }

  quickActionBubble.style.left = selectedComp.x + 'px';
  quickActionBubble.style.top = (selectedComp.y - (selectedComp.radius || 32)) + 'px';
  quickActionBubble.classList.add('show');
}

if (bubbleRotateBtn) {
  bubbleRotateBtn.addEventListener('click', () => {
    if (selectedComp) {
      selectedComp.rotation = (selectedComp.rotation + 90) % 360;
      playTone(400, 'sine', 0.03, 0.1);
      toast("Element 90° burildi");
    }
  });
}

if (bubbleConfigBtn) {
  bubbleConfigBtn.addEventListener('click', () => {
    if (selectedComp) inspector.classList.add('show');
  });
}

if (bubbleDeleteBtn) {
  bubbleDeleteBtn.addEventListener('click', () => {
    if (selectedComp) {
      engine.removeComponent(selectedComp);
      selectComponent(null);
      toast("Element o‘chirildi");
      playTone(280, 'sine', 0.04, 0.1);
      if (breadboard3d && mode === 'breadboard') breadboard3d.syncFromEngine();
    }
  });
}

/* ==========================================================================
   INSPECTOR PROPERTIES PANEL
   ========================================================================== */
function selectComponent(comp) {
  selectedComp = comp;
  selectedWire = null;
  engine.components.forEach(c => c.selected = (c === comp));
  updateQuickActionBubble();

  if (!comp) {
    inspector.classList.remove('show');
    return;
  }

  inspTitle.textContent = comp.name;
  inspProps.innerHTML = '';

  // 1. Common Info (Voltage Drop, Current, Power)
  const metricsCard = document.createElement('div');
  metricsCard.className = 'live-metrics-card';
  const vDrop = Math.abs(comp.voltageDrop || 0).toFixed(2);
  const curMa = (Math.abs(comp.current || 0) * 1000).toFixed(1);
  const pMw = (Math.abs(comp.voltageDrop || 0) * Math.abs(comp.current || 0) * 1000).toFixed(1);

  metricsCard.innerHTML = `
    <div class="metric-row"><span class="k">Kuchlanish tushishi:</span><span class="v">${vDrop} V</span></div>
    <div class="metric-row"><span class="k">Tok kuchi:</span><span class="v">${curMa} mA</span></div>
    <div class="metric-row"><span class="k">Quvvat sarfi:</span><span class="v">${pMw} mW</span></div>
  `;
  inspProps.appendChild(metricsCard);

  // 2. Specific Component Controls
  if (comp.type === 'battery') {
    const grp = document.createElement('div');
    grp.className = 'prop-group';
    grp.innerHTML = `
      <div class="prop-label">Kuchlanish (Volts): <span>${comp.voltage} V</span></div>
      <input type="range" class="prop-input" min="1" max="24" step="0.5" value="${comp.voltage}">
    `;
    const input = grp.querySelector('input');
    input.addEventListener('input', (e) => {
      comp.voltage = parseFloat(e.target.value);
      grp.querySelector('span').textContent = comp.voltage + ' V';
    });
    inspProps.appendChild(grp);
  } else if (comp.type === 'resistor') {
    const grp = document.createElement('div');
    grp.className = 'prop-group';
    grp.innerHTML = `
      <div class="prop-label">Qarshilik (Ohms): <span>${comp.resistance} Ω</span></div>
      <input type="number" class="prop-input" value="${comp.resistance}" min="1" max="10000000">
      <div class="resistor-bands-preview" id="resBandsPreview" style="margin-top:6px;"></div>
    `;
    const input = grp.querySelector('input');
    const preview = grp.querySelector('#resBandsPreview');

    function updateBands() {
      preview.innerHTML = '';
      comp.getColorBands().forEach(c => {
        const b = document.createElement('div');
        b.className = 'color-band';
        b.style.backgroundColor = c;
        preview.appendChild(b);
      });
    }
    updateBands();

    input.addEventListener('change', (e) => {
      comp.resistance = Math.max(1, parseInt(e.target.value, 10) || 100);
      grp.querySelector('span').textContent = comp.resistance + ' Ω';
      updateBands();
    });
    inspProps.appendChild(grp);
  } else if (comp.type === 'switch') {
    const grp = document.createElement('div');
    grp.className = 'prop-group';
    grp.innerHTML = `
      <button class="btn-action ${comp.isOpen ? '' : 'active-pulse'}" style="width:100%; justify-content:center;">
        ${comp.isOpen ? '🔓 Kalitni Yopish (Ulash)' : '🔒 Kalitni Ochish (Uzish)'}
      </button>
    `;
    const btn = grp.querySelector('button');
    btn.addEventListener('click', () => {
      comp.toggle();
      btn.textContent = comp.isOpen ? '🔓 Kalitni Yopish (Ulash)' : '🔒 Kalitni Ochish (Uzish)';
      btn.classList.toggle('active-pulse', !comp.isOpen);
      playSwitchSound();
    });
    inspProps.appendChild(grp);
  } else if (comp.type === 'led') {
    const grp = document.createElement('div');
    grp.className = 'prop-group';
    grp.innerHTML = `
      <div class="prop-label">LED Rangi</div>
      <div style="display:flex; gap:8px; margin-top:4px;">
        <button class="color-dot" style="background:#EF4444;" data-color="#EF4444"></button>
        <button class="color-dot" style="background:#10B981;" data-color="#10B981"></button>
        <button class="color-dot" style="background:#3B82F6;" data-color="#3B82F6"></button>
        <button class="color-dot" style="background:#FBBF24;" data-color="#FBBF24"></button>
      </div>
    `;
    grp.querySelectorAll('.color-dot').forEach(b => {
      b.addEventListener('click', () => {
        comp.ledColor = b.dataset.color;
      });
    });
    inspProps.appendChild(grp);
  } else if (comp.type === 'potentiometer') {
    const grp = document.createElement('div');
    grp.className = 'prop-group';
    grp.innerHTML = `
      <div class="prop-label">Potensiometr Holati: <span>${Math.round(comp.ratio * 100)}% (${Math.round(comp.getResistance())} Ω)</span></div>
      <input type="range" class="prop-input" min="0.01" max="0.99" step="0.01" value="${comp.ratio}">
    `;
    const input = grp.querySelector('input');
    input.addEventListener('input', (e) => {
      comp.ratio = parseFloat(e.target.value);
      grp.querySelector('span').textContent = `${Math.round(comp.ratio * 100)}% (${Math.round(comp.getResistance())} Ω)`;
    });
    inspProps.appendChild(grp);
  } else if (comp.type === 'ldr') {
    const grp = document.createElement('div');
    grp.className = 'prop-group';
    grp.innerHTML = `
      <div class="prop-label">Yorug‘lik Darajasi: <span>${Math.round(comp.lightLevel * 100)}%</span></div>
      <input type="range" class="prop-input" min="0" max="1" step="0.05" value="${comp.lightLevel}">
      <div style="font-size:0.75rem; color:var(--text-muted); margin-top:4px;">Qarshilik: <b>${comp.getResistance()} Ω</b></div>
    `;
    const input = grp.querySelector('input');
    input.addEventListener('input', (e) => {
      comp.lightLevel = parseFloat(e.target.value);
      grp.querySelector('span').textContent = `${Math.round(comp.lightLevel * 100)}%`;
      grp.querySelector('b').textContent = `${comp.getResistance()} Ω`;
    });
    inspProps.appendChild(grp);
  } else if (comp.type === 'capacitor') {
    const grp = document.createElement('div');
    grp.className = 'prop-group';
    grp.innerHTML = `
      <div class="prop-label">Kondensator Sig‘imi: <span>100 µF</span></div>
      <div style="font-size:0.8rem; color:var(--cyan); margin-top:4px;">Zaryad Kuchlanishi: <b>${(comp.chargeVoltage || 0).toFixed(2)} V</b></div>
      <button class="btn-action" style="margin-top:8px; width:100%; justify-content:center;">⚡ Zaryadsizlantirish</button>
    `;
    grp.querySelector('button').addEventListener('click', () => {
      comp.chargeVoltage = 0;
      toast("Kondensator zaryadsizlantirildi");
    });
    inspProps.appendChild(grp);
  } else if (comp.type === 'transistor_npn') {
    const grp = document.createElement('div');
    grp.className = 'prop-group';
    const vBE = Math.abs((comp.pins[1]?.voltage || 0) - (comp.pins[2]?.voltage || 0));
    const isOpen = vBE > 0.65;
    grp.innerHTML = `
      <div class="prop-label">NPN Tranzistor Holati</div>
      <div style="font-size:0.8rem; margin-top:4px;">Holat: <b style="color:${isOpen ? 'var(--accent)' : 'var(--text-muted)'};">${isOpen ? 'Ochiq (O‘tkazmoqda)' : 'Qulfda (Yopiq)'}</b></div>
      <div style="font-size:0.75rem; color:var(--text-muted); margin-top:4px;">V_BE: ${vBE.toFixed(2)} V (Bo‘sag‘a: 0.65V)</div>
      <div style="font-size:0.75rem; color:var(--text-muted);">hFE / Beta: ${comp.beta || 100}</div>
    `;
    inspProps.appendChild(grp);
  } else if (comp.type === 'motor') {
    const grp = document.createElement('div');
    grp.className = 'prop-group';
    grp.innerHTML = `
      <div class="prop-label">Dvigatel Aylanish Tezligi</div>
      <div style="font-size:1.1rem; font-weight:700; color:var(--gold); margin-top:4px;">${Math.round(Math.abs(comp.speed || 0))} RPM</div>
      <div style="font-size:0.75rem; color:var(--text-muted); margin-top:4px;">Ichki qarshilik: 25 Ω</div>
    `;
    inspProps.appendChild(grp);
  } else if (comp.type === 'arduino_uno') {
    const grp = document.createElement('div');
    grp.className = 'prop-group';
    grp.innerHTML = `
      <div class="prop-label">Arduino Uno R3</div>
      <button class="btn-action" style="width:100%; justify-content:center; background:linear-gradient(135deg, #00878F, #00FF87); color:#020617; font-weight:bold; margin-top:8px;" id="btnOpenArduinoCode">
        💻 Kod Muharririni Ochish (C++)
      </button>
      <div style="font-size:0.75rem; color:var(--text-muted); margin-top:8px;">
        Holat: <b>${comp.isRunning ? '🟢 Bajarilmoqda' : '⏹ To‘xtatilgan'}</b>
      </div>
    `;
    const btn = grp.querySelector('#btnOpenArduinoCode');
    btn.addEventListener('click', () => {
      openArduinoCodeModal(comp);
    });
    inspProps.appendChild(grp);

  } else if (comp.type === 'ammeter') {
    const r = comp.getReading ? comp.getReading() : { val: '0.00', unit: 'mA' };
    const grp = document.createElement('div');
    grp.className = 'prop-group';
    const aColor = comp.overloaded ? '#EF4444' : '#38BDF8';
    grp.innerHTML = `
      <div class="prop-label">Ampermetr O'qishi</div>
      <div style="font-size:1.6rem;font-weight:800;color:${aColor};letter-spacing:-1px;margin:8px 0;font-family:'JetBrains Mono',monospace;">
        ${comp.overloaded ? 'OL' : r.val} <span style="font-size:1rem;">${comp.overloaded ? 'OVERLOAD' : r.unit}</span>
      </div>
      <div style="font-size:0.73rem;color:var(--text-muted);border-top:1px solid var(--border);padding-top:6px;">
        Ketma-ket (serie) ulash kerak<br>
        A+ = tok kelish tomoni, A- = tok ketish tomoni<br>
        Ichki R: <b>0.001 Ohm</b> | Max: <b>${comp.maxCurrent || 5}A</b>
      </div>
    `;
    inspProps.appendChild(grp);

  } else if (comp.type === 'voltmeter') {
    const r = comp.getReading ? comp.getReading() : { val: '0.000', unit: 'V' };
    const grp = document.createElement('div');
    grp.className = 'prop-group';
    const vColor = comp.overloaded ? '#EF4444' : '#A78BFA';
    grp.innerHTML = `
      <div class="prop-label">Voltmetr O'qishi</div>
      <div style="font-size:1.6rem;font-weight:800;color:${vColor};letter-spacing:-1px;margin:8px 0;font-family:'JetBrains Mono',monospace;">
        ${comp.overloaded ? 'OL' : r.val} <span style="font-size:1rem;">${comp.overloaded ? 'OVERLOAD' : r.unit}</span>
      </div>
      <div style="font-size:0.73rem;color:var(--text-muted);border-top:1px solid var(--border);padding-top:6px;">
        Element ustiga parallel ulang<br>
        V+ = yuqori potensial, V- = GND tomoni<br>
        Ichki R: <b>1 MOhm</b> | Max: <b>${comp.maxVoltage || 50}V</b>
      </div>
    `;
    inspProps.appendChild(grp);

  } else if (comp.type === 'diode') {
    const isCond = (comp.voltageDrop || 0) > (comp.forwardVoltage || 0.7);
    const grp = document.createElement('div');
    grp.className = 'prop-group';
    grp.innerHTML = `
      <div class="prop-label">Diod 1N4007 Holati</div>
      <div style="font-size:1rem;font-weight:700;color:${isCond ? '#FBBF24' : '#64748B'};margin:8px 0;">
        ${isCond ? 'To\'g\'ri yo\'nalish — tok o\'tyapti' : 'Teskari yo\'nalish — blok'}
      </div>
      <div style="font-size:0.8rem;color:var(--text-muted);">
        V_drop: <b style="color:var(--cyan);">${(comp.voltageDrop || 0).toFixed(3)} V</b><br>
        Vf: <b>${comp.forwardVoltage || 0.7} V</b> | Rf: <b>${comp.internalResistance || 2} Ohm</b>
      </div>
    `;
    inspProps.appendChild(grp);

  } else if (comp.type === 'dc_source') {
    const grp = document.createElement('div');
    grp.className = 'prop-group';
    grp.innerHTML = `
      <div class="prop-label">Kuchlanish: <span>${comp.voltage} V</span></div>
      <input type="range" class="prop-input" min="1" max="30" step="0.5" value="${comp.voltage}">
      <div style="display:flex;gap:6px;margin-top:8px;flex-wrap:wrap;">
        <button class="btn-action" style="font-size:0.72rem;padding:4px 10px;" data-v="3.3">3.3V</button>
        <button class="btn-action" style="font-size:0.72rem;padding:4px 10px;" data-v="5">5V</button>
        <button class="btn-action" style="font-size:0.72rem;padding:4px 10px;" data-v="9">9V</button>
        <button class="btn-action" style="font-size:0.72rem;padding:4px 10px;" data-v="12">12V</button>
        <button class="btn-action" style="font-size:0.72rem;padding:4px 10px;" data-v="24">24V</button>
      </div>
    `;
    const spanEl = grp.querySelector('span');
    const slider = grp.querySelector('input');
    slider.addEventListener('input', (e) => {
      comp.voltage = parseFloat(e.target.value);
      comp.name = 'DC Manba ' + comp.voltage + 'V';
      spanEl.textContent = comp.voltage + ' V';
    });
    grp.querySelectorAll('button[data-v]').forEach(b => {
      b.addEventListener('click', () => {
        comp.voltage = parseFloat(b.dataset.v);
        comp.name = 'DC Manba ' + comp.voltage + 'V';
        slider.value = comp.voltage;
        spanEl.textContent = comp.voltage + ' V';
      });
    });
    inspProps.appendChild(grp);
  }
}


if (btnCloseInspector) {
  btnCloseInspector.addEventListener('click', () => {
    inspector.classList.remove('show');
  });
}

/* ==========================================================================
   EASY SCHEMATIC & MAGNETIC PIN SNAP LOGIC
   ========================================================================== */
function getCanvasPos(e) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
}

// Check if near a pin with generous 26px magnetic snapping
function findPinAt(px, py, radius = 26) {
  for (const comp of engine.components) {
    for (const pin of comp.pins) {
      const pos = comp.getPinPos(pin);
      if (Math.hypot(pos.x - px, pos.y - py) <= radius) {
        return { pin, comp, pos };
      }
    }
  }
  return null;
}

function findProbeAt(px, py, radius = 20) {
  if (Math.hypot(multimeter.redProbe.x - px, multimeter.redProbe.y - py) <= radius) return 'red';
  if (Math.hypot(multimeter.blackProbe.x - px, multimeter.blackProbe.y - py) <= radius) return 'black';
  return null;
}

// Find wire near point
function findWireAt(px, py, tolerance = 8) {
  for (const wire of engine.wires) {
    const pFrom = engine.getPinById(wire.fromPinId);
    const pTo = engine.getPinById(wire.toPinId);
    if (!pFrom || !pTo) continue;

    const p1 = pFrom.comp.getPinPos(pFrom.pin);
    const p2 = pTo.comp.getPinPos(pTo.pin);
    const midX = (p1.x + p2.x) / 2;

    // 3 segments of orthogonal routing: (p1.x, p1.y)->(midX, p1.y)->(midX, p2.y)->(p2.x, p2.y)
    const distToSeg = (x1, y1, x2, y2) => {
      const l2 = (x2 - x1)**2 + (y2 - y1)**2;
      if (l2 === 0) return Math.hypot(px - x1, py - y1);
      let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
      t = Math.max(0, Math.min(1, t));
      return Math.hypot(px - (x1 + t * (x2 - x1)), py - (y1 + t * (y2 - y1)));
    };

    const d1 = distToSeg(p1.x, p1.y, midX, p1.y);
    const d2 = distToSeg(midX, p1.y, midX, p2.y);
    const d3 = distToSeg(midX, p2.y, p2.x, p2.y);

    if (Math.min(d1, d2, d3) <= tolerance) return wire;
  }
  return null;
}

/* Canvas Pointer Interactions */
canvas.addEventListener('pointerdown', (e) => {
  if (e.button !== 0) return; // Only left click
  const pos = getCanvasPos(e);

  // 1. Check Placement Pending (Click-to-place from palette)
  if (placementPendingType) {
    addComponent(placementPendingType, pos.x, pos.y);
    placementPendingType = null;
    return;
  }

  // 2. Check Multimeter Probes
  const probe = findProbeAt(pos.x, pos.y);
  if (probe) {
    activeProbeDrag = probe;
    return;
  }

  // 3. Check Pins for Wire Creation (Magnetic Click-to-Connect)
  const pinHit = findPinAt(pos.x, pos.y);
  if (pinHit) {
    if (!activeWireStartPin) {
      // Start Wire
      activeWireStartPin = pinHit;
      currentWireMousePos = { x: pinHit.pos.x, y: pinHit.pos.y };
      playTone(540, 'sine', 0.04, 0.12);
      toast("Sim boshlandi. Ikkinchi pinni bosing.");
    } else if (activeWireStartPin.pin.id !== pinHit.pin.id) {
      // Finish Wire on Click
      const wire = engine.addWire(activeWireStartPin.pin.id, pinHit.pin.id, activeWireColor);
      if (wire) {
        playTone(720, 'triangle', 0.05, 0.15);
        toast("Sim ulandi!");
        if (breadboard3d && mode === 'breadboard') breadboard3d.syncFromEngine();
      }
      activeWireStartPin = null;
    }
    return;
  }

  // 4. Check Components for Dragging / Toggle
  for (let i = engine.components.length - 1; i >= 0; i--) {
    const comp = engine.components[i];
    if (comp.isPointInside(pos.x, pos.y)) {
      selectComponent(comp);

      // If switch, click toggles it
      if (comp.type === 'switch') {
        comp.toggle();
        playSwitchSound();
        if (breadboard3d && mode === 'breadboard') breadboard3d.syncFromEngine();
      }

      draggingComp = comp;
      dragOffset = { x: pos.x - comp.x, y: pos.y - comp.y };
      return;
    }
  }

  // 5. Check Wires for Selection / Deletion
  const wireHit = findWireAt(pos.x, pos.y);
  if (wireHit) {
    selectedWire = wireHit;
    selectComponent(null);
    playTone(380, 'sine', 0.03, 0.1);
    toast("Sim tanlandi. O‘chirish uchun <b>Delete</b> tugmasini bosing.");
    return;
  }

  // 6. Clicked on Empty Space
  if (activeWireStartPin) {
    activeWireStartPin = null;
    toast("Sim bekor qilindi");
  }
  selectComponent(null);
  selectedWire = null;
});

canvas.addEventListener('dblclick', (e) => {
  const pos = getCanvasPos(e);
  for (let i = engine.components.length - 1; i >= 0; i--) {
    const comp = engine.components[i];
    if (comp.isPointInside(pos.x, pos.y)) {
      if (comp.type === 'arduino_uno') {
        openArduinoCodeModal(comp);
      }
      return;
    }
  }
});

canvas.addEventListener('pointermove', (e) => {
  const pos = getCanvasPos(e);

  // Magnetic Pin Snapping Detection
  hoveredPin = findPinAt(pos.x, pos.y);

  // Handle Probe Drag
  if (activeProbeDrag) {
    if (activeProbeDrag === 'red') {
      multimeter.redProbe.x = pos.x;
      multimeter.redProbe.y = pos.y;
      multimeter.redProbe.connectedPin = hoveredPin ? hoveredPin.pin : null;
    } else {
      multimeter.blackProbe.x = pos.x;
      multimeter.blackProbe.y = pos.y;
      multimeter.blackProbe.connectedPin = hoveredPin ? hoveredPin.pin : null;
    }
    return;
  }

  // Handle Wire Drawing Drag
  if (activeWireStartPin) {
    // If hovering near target pin, snap line directly to it
    if (hoveredPin) {
      currentWireMousePos = { x: hoveredPin.pos.x, y: hoveredPin.pos.y };
    } else {
      currentWireMousePos = { x: pos.x, y: pos.y };
    }
    return;
  }

  // Handle Component Dragging (Snap to 12px grid)
  if (draggingComp) {
    let nx = Math.round((pos.x - dragOffset.x) / 12) * 12;
    let ny = Math.round((pos.y - dragOffset.y) / 12) * 12;
    draggingComp.x = nx;
    draggingComp.y = ny;
    updateQuickActionBubble();
  }
});

canvas.addEventListener('pointerup', () => {
  draggingComp = null;
  activeProbeDrag = null;
});

// Cancel wire drawing on Escape or right-click
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (activeWireStartPin) {
      activeWireStartPin = null;
      toast("Sim bekor qilindi");
    }
  } else if (e.key === 'r' || e.key === 'R') {
    if (selectedComp) {
      selectedComp.rotation = (selectedComp.rotation + 90) % 360;
      playTone(400, 'sine', 0.03, 0.1);
      toast("Element 90° burildi");
    }
  } else if (e.key === 'Delete' || e.key === 'Backspace') {
    if (selectedComp) {
      engine.removeComponent(selectedComp);
      selectComponent(null);
      toast("Element o‘chirildi");
      playTone(280, 'sine', 0.04, 0.1);
      if (breadboard3d && mode === 'breadboard') breadboard3d.syncFromEngine();
    } else if (selectedWire) {
      engine.removeWire(selectedWire);
      selectedWire = null;
      toast("Sim o‘chirildi");
      playTone(280, 'sine', 0.04, 0.1);
      if (breadboard3d && mode === 'breadboard') breadboard3d.syncFromEngine();
    }
  }
});

/* Palette 1-Click to Place & Drag-and-Drop */
document.querySelectorAll('.comp-item').forEach(item => {
  item.addEventListener('click', () => {
    placementPendingType = item.dataset.type;
    toast(`<b>${item.querySelector('.comp-name').textContent}</b> tanlandi. Joylashtirish uchun chizmani bosing.`);
  });
  item.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', item.dataset.type);
  });
});

container.addEventListener('dragover', (e) => e.preventDefault());
container.addEventListener('drop', (e) => {
  e.preventDefault();
  const type = e.dataTransfer.getData('text/plain');
  if (type) {
    const pos = getCanvasPos(e);
    addComponent(type, pos.x, pos.y);
  }
});

/* ==========================================================================
   QUICK PRESETS (1-CLICK CIRCUITS)
   ========================================================================== */
function loadPreset(presetKey) {
  clearCircuit();

  if (presetKey === 'simple_bulb') {
    const bat = addComponent('battery_9v', 180, 240);
    const bulb = addComponent('bulb', 380, 240);
    engine.addWire(bat.pins[0].id, bulb.pins[0].id, '#EF4444');
    engine.addWire(bulb.pins[1].id, bat.pins[1].id, '#38BDF8');
    toast("💡 Oddiy Chiroq zanjiri yuklandi");
  } else if (presetKey === 'switch_bulb') {
    const bat = addComponent('battery_9v', 160, 240);
    const sw = addComponent('switch', 320, 160);
    sw.isOpen = false; // Closed by default so lamp glows immediately!
    const bulb = addComponent('bulb', 320, 320);
    engine.addWire(bat.pins[0].id, sw.pins[0].id, '#EF4444');
    engine.addWire(sw.pins[1].id, bulb.pins[0].id, '#FBBF24');
    engine.addWire(bulb.pins[1].id, bat.pins[1].id, '#38BDF8');
    toast("🔘 Kalitli Chiroq zanjiri yuklandi (Kalit yopiq, chiroq yonmoqda)");
  } else if (presetKey === 'ohms_law') {
    const bat = addComponent('battery_9v', 180, 240);
    const res = addComponent('resistor', 360, 240);
    engine.addWire(bat.pins[0].id, res.pins[0].id, '#EF4444');
    engine.addWire(res.pins[1].id, bat.pins[1].id, '#38BDF8');
    multimeter.redProbe.x = 330; multimeter.redProbe.y = 240;
    multimeter.redProbe.connectedPin = res.pins[0];
    multimeter.blackProbe.x = 390; multimeter.blackProbe.y = 240;
    multimeter.blackProbe.connectedPin = res.pins[1];
    toast("⚡ Ohm Qonuni zanjiri yuklandi (9V / 220Ω ≈ 40.9mA)");
  } else if (presetKey === 'safe_led') {
    const bat = addComponent('battery_9v', 160, 240);
    const res = addComponent('resistor', 300, 180);
    const led = addComponent('led', 420, 240);
    engine.addWire(bat.pins[0].id, res.pins[0].id, '#EF4444');
    engine.addWire(res.pins[1].id, led.pins[0].id, '#FBBF24');
    engine.addWire(led.pins[1].id, bat.pins[1].id, '#38BDF8');
    toast("🔴 Xavfsiz LED zanjiri yuklandi (Ballast rezistor bilan)");
  } else if (presetKey === 'parallel_bulbs') {
    const bat = addComponent('battery_9v', 160, 240);
    const b1 = addComponent('bulb', 340, 160);
    const b2 = addComponent('bulb', 340, 320);
    engine.addWire(bat.pins[0].id, b1.pins[0].id, '#EF4444');
    engine.addWire(bat.pins[0].id, b2.pins[0].id, '#EF4444');
    engine.addWire(b1.pins[1].id, bat.pins[1].id, '#38BDF8');
    engine.addWire(b2.pins[1].id, bat.pins[1].id, '#38BDF8');
    toast("💡💡 Parallel Chiroqlar zanjiri yuklandi");
  } else if (presetKey === 'buzzer_alarm') {
    const bat = addComponent('battery_9v', 160, 240);
    const sw = addComponent('switch', 300, 180);
    const bz = addComponent('buzzer', 420, 240);
    engine.addWire(bat.pins[0].id, sw.pins[0].id, '#EF4444');
    engine.addWire(sw.pins[1].id, bz.pins[0].id, '#FBBF24');
    engine.addWire(bz.pins[1].id, bat.pins[1].id, '#38BDF8');
    toast("🔔 Signalizatsiya zanjiri yuklandi");
  }

  if (breadboard3d && mode === 'breadboard') breadboard3d.syncFromEngine();
}

if (btnPresetsDropdown && presetsMenu) {
  btnPresetsDropdown.addEventListener('click', (e) => {
    e.stopPropagation();
    presetsMenu.classList.toggle('show');
    if (saveMenu) saveMenu.classList.remove('show');
    if (loadMenu) loadMenu.classList.remove('show');
  });

  document.querySelectorAll('.preset-opt').forEach(opt => {
    opt.addEventListener('click', () => {
      if (opt.dataset.preset) {
        loadPreset(opt.dataset.preset);
        presetsMenu.classList.remove('show');
      }
    });
  });

  window.addEventListener('click', () => {
    presetsMenu.classList.remove('show');
  });
}

/* ==========================================================================
   CIRCUIT STORAGE & FILE SAVE / LOAD
   ========================================================================== */
const storage = new CircuitStorage(engine, () => breadboard3d, () => canvas);

const btnSaveDropdown = document.getElementById('btnSaveDropdown');
const saveMenu = document.getElementById('saveMenu');
const btnLoadDropdown = document.getElementById('btnLoadDropdown');
const loadMenu = document.getElementById('loadMenu');

if (btnSaveDropdown && saveMenu) {
  btnSaveDropdown.addEventListener('click', (e) => {
    e.stopPropagation();
    saveMenu.classList.toggle('show');
    if (presetsMenu) presetsMenu.classList.remove('show');
    if (loadMenu) loadMenu.classList.remove('show');
  });

  document.getElementById('optSaveFile')?.addEventListener('click', () => {
    storage.saveToFile();
    saveMenu.classList.remove('show');
    toast("📁 Sxema .json fayliga saqlandi!");
  });

  document.getElementById('optSaveBrowser')?.addEventListener('click', () => {
    const name = prompt("Sxema nomini kiriting:", "Sxema_" + (storage.getBrowserSaves().length + 1));
    if (name) {
      storage.saveToBrowser(name);
      saveMenu.classList.remove('show');
      toast(`💾 <b>${name}</b> brauzer xotirasiga saqlandi!`);
    }
  });

  document.getElementById('optExportImage')?.addEventListener('click', () => {
    storage.exportImage();
    saveMenu.classList.remove('show');
    toast("📸 Sxema PNG rasm sifatida yuklab olindi!");
  });
}

if (btnLoadDropdown && loadMenu) {
  btnLoadDropdown.addEventListener('click', (e) => {
    e.stopPropagation();
    loadMenu.classList.toggle('show');
    if (presetsMenu) presetsMenu.classList.remove('show');
    if (saveMenu) saveMenu.classList.remove('show');
  });

  document.getElementById('optLoadFile')?.addEventListener('click', () => {
    loadMenu.classList.remove('show');
    storage.loadFromFile({
      clearCircuit,
      onSuccess: (fn) => toast(`📁 <b>${fn}</b> muvaffaqiyatli yuklandi!`),
      onError: (msg) => toast(`⚠️ Xatolik: ${msg}`)
    });
  });

  document.getElementById('optLoadBrowser')?.addEventListener('click', () => {
    loadMenu.classList.remove('show');
    renderSavedCircuitsList();
    document.getElementById('savedCircuitsModal')?.classList.add('show');
  });
}

function renderSavedCircuitsList() {
  const listEl = document.getElementById('savedCircuitsList');
  if (!listEl) return;
  listEl.innerHTML = '';
  const saves = storage.getBrowserSaves();
  if (saves.length === 0) {
    listEl.innerHTML = '<div style="color:var(--text-muted); text-align:center; padding:20px;">Hozircha saqlangan sxemalar yo‘q.</div>';
    return;
  }
  saves.forEach(name => {
    const row = document.createElement('div');
    row.className = 'lab-card';
    row.style.marginBottom = '8px';
    row.innerHTML = `
      <div class="lab-info">
        <div class="lab-title">📁 ${name}</div>
        <div class="lab-desc">Brauzer xotirasida saqlangan</div>
      </div>
      <div style="display:flex; gap:8px;">
        <button class="btn-action open-btn" style="color:var(--accent); border-color:var(--accent);">Ochish</button>
        <button class="btn-action del-btn danger" style="padding:4px 8px;">🗑️</button>
      </div>
    `;
    row.querySelector('.open-btn').addEventListener('click', () => {
      try {
        storage.loadFromBrowser(name, { clearCircuit });
        document.getElementById('savedCircuitsModal')?.classList.remove('show');
        toast(`📁 <b>${name}</b> sxemasi ochildi!`);
      } catch(err) {
        toast(`⚠️ Xatolik: ${err.message}`);
      }
    });
    row.querySelector('.del-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      if (confirm(`"${name}" sxemasini o‘chirmoqchimisiz?`)) {
        storage.deleteBrowserSave(name);
        renderSavedCircuitsList();
        toast("Sxema o‘chirildi");
      }
    });
    listEl.appendChild(row);
  });
}

document.getElementById('closeSavedCircuitsModal')?.addEventListener('click', () => {
  document.getElementById('savedCircuitsModal')?.classList.remove('show');
});

window.addEventListener('click', () => {
  if (saveMenu) saveMenu.classList.remove('show');
  if (loadMenu) loadMenu.classList.remove('show');
});

/* ==========================================================================
   MODE SWITCHING (SCHEMATIC <-> 3D BREADBOARD <-> SPLIT VIEW)
   ========================================================================== */
if (btnModeSchematic && btnModeBreadboard && btnModeSplit) {
  btnModeSchematic.addEventListener('click', () => {
    mode = 'schematic';
    btnModeSchematic.classList.add('active');
    btnModeBreadboard.classList.remove('active');
    btnModeSplit.classList.remove('active');
    workspaceEl.classList.remove('split-view-active');
    container.style.display = 'block';
    bb3dContainer.classList.remove('show');
    const tb3d = document.getElementById('wireColorToolbar3D');
    if (tb3d) tb3d.style.display = 'none';
    updateQuickActionBubble();
    resizeCanvas();
    toast("📐 Standart Sxema (Chizma) rejimi");
    playTone(500, 'sine', 0.04, 0.1);
  });

  btnModeBreadboard.addEventListener('click', () => {
    mode = 'breadboard';
    btnModeBreadboard.classList.add('active');
    btnModeSchematic.classList.remove('active');
    btnModeSplit.classList.remove('active');
    workspaceEl.classList.remove('split-view-active');
    container.style.display = 'none';
    bb3dContainer.classList.add('show');
    const tb3d = document.getElementById('wireColorToolbar3D');
    if (tb3d) tb3d.style.display = 'flex';
    updateQuickActionBubble();
    if (breadboard3d) {
      breadboard3d.onResize();
      breadboard3d.syncFromEngine();
    }
    toast("🔌 <b>3D Maket Plata Laboratoriyasi:</b> Sichqoncha bilan 360° aylantiring");
    playTone(500, 'sine', 0.04, 0.1);
  });

  btnModeSplit.addEventListener('click', () => {
    mode = 'split';
    btnModeSplit.classList.add('active');
    btnModeSchematic.classList.remove('active');
    btnModeBreadboard.classList.remove('active');
    workspaceEl.classList.add('split-view-active');
    container.style.display = 'block';
    bb3dContainer.classList.add('show');
    const tb3d = document.getElementById('wireColorToolbar3D');
    if (tb3d) tb3d.style.display = 'flex';
    updateQuickActionBubble();
    resizeCanvas();
    if (breadboard3d) {
      breadboard3d.onResize();
      breadboard3d.syncFromEngine();
    }
    toast("⚡ <b>Split View (2-in-1):</b> Chapda Sxema, O‘ngda 3D Maket!");
    playTone(600, 'sine', 0.04, 0.1);
  });
}

/* Toolbar Buttons */
if (btnSimPlay) {
  btnSimPlay.addEventListener('click', () => {
    engine.simRunning = !engine.simRunning;
    btnSimPlay.classList.toggle('running', !engine.simRunning);
    btnSimPlay.querySelector('span').textContent = engine.simRunning ? "Simulyatsiya: Faol" : "Simulyatsiya: To‘xtatilgan";
    toast(engine.simRunning ? "⚡ Simulyatsiya ishga tushirildi" : "⏸️ Simulyatsiya to‘xtatildi");
    playTone(engine.simRunning ? 640 : 320, 'sine', 0.05, 0.15);
  });
}

if (btnClear) btnClear.addEventListener('click', clearCircuit);

if (btnDmmToggle) {
  btnDmmToggle.addEventListener('click', () => {
    dmmWindow.classList.toggle('show');
    btnDmmToggle.classList.toggle('active-pulse', dmmWindow.classList.contains('show'));
    playTone(580, 'sine', 0.04, 0.1);
  });
}

if (btnScopeToggle) {
  btnScopeToggle.addEventListener('click', () => {
    scopeWindow.classList.toggle('show');
    btnScopeToggle.classList.toggle('active-pulse', scopeWindow.classList.contains('show'));
    playTone(580, 'sine', 0.04, 0.1);
  });
}

if (btnSound) {
  btnSound.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    btnSound.classList.toggle('active-pulse', soundEnabled);
    btnSound.querySelector('span').textContent = soundEnabled ? 'Ovoz: Yoqiq' : 'Ovoz: O‘chiq';
    toast(soundEnabled ? "🔊 Ovoz effektlari yoqildi" : "🔇 Ovoz o‘chirildi");
  });
}

// Wire Color Selection
document.querySelectorAll('.wire-color-picker .color-dot').forEach(dot => {
  dot.addEventListener('click', () => {
    document.querySelectorAll('.wire-color-picker .color-dot').forEach(d => d.classList.remove('active'));
    dot.classList.add('active');
    activeWireColor = dot.dataset.color;
  });
});

// Multimeter Dial Buttons
document.querySelectorAll('.dial-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.dial-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    multimeter.mode = btn.dataset.mode;
    playTone(700, 'sine', 0.03, 0.1);
  });
});

/* ==========================================================================
   FUNCTION GENERATOR WINDOW EVENTS
   ========================================================================== */
const fgWindow = document.getElementById('fgWindow');
const btnFgToggle = document.getElementById('btnFgToggle');
const fgCloseBtn = document.getElementById('fgCloseBtn');

let fgPanelRendered = false;

if (btnFgToggle && fgWindow) {
  btnFgToggle.addEventListener('click', () => {
    fgWindow.classList.toggle('show');
    if (fgWindow.classList.contains('show') && !fgPanelRendered) {
      functionGenerator.renderPanel('fgPanelContainer');
      fgPanelRendered = true;
    }
    playTone(560, 'triangle', 0.05, 0.12);
    toast('🌊 Funksiya Generatori ' + (fgWindow.classList.contains('show') ? 'ochildi' : 'yopildi'));
  });
}
if (fgCloseBtn && fgWindow) {
  fgCloseBtn.addEventListener('click', () => fgWindow.classList.remove('show'));
}

/* ==========================================================================
   ANALYSIS WINDOW EVENTS (BODE / DC SWEEP / TRANSIENT)
   ========================================================================== */
const analysisWindow = document.getElementById('analysisWindow');
const btnAnalysis = document.getElementById('btnAnalysis');
const analysisCloseBtn = document.getElementById('analysisCloseBtn');

// Tab switching
function switchAnalysisTab(activeId) {
  ['paneBode', 'paneDcSweep', 'paneTransient'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('hidden', id !== activeId);
  });
  ['tabBode', 'tabDcSweep', 'tabTransient'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('active', id === activeId.replace('pane', 'tab').replace(/[A-Z]/, s => s.toLowerCase()));
  });
}

document.getElementById('tabBode')?.addEventListener('click', () => {
  switchAnalysisTab('paneBode');
  ['tabBode', 'tabDcSweep', 'tabTransient'].forEach(id => document.getElementById(id)?.classList.remove('active'));
  document.getElementById('tabBode')?.classList.add('active');
});
document.getElementById('tabDcSweep')?.addEventListener('click', () => {
  ['paneBode', 'paneDcSweep', 'paneTransient'].forEach(id => document.getElementById(id)?.classList.add('hidden'));
  document.getElementById('paneDcSweep')?.classList.remove('hidden');
  ['tabBode', 'tabDcSweep', 'tabTransient'].forEach(id => document.getElementById(id)?.classList.remove('active'));
  document.getElementById('tabDcSweep')?.classList.add('active');
});
document.getElementById('tabTransient')?.addEventListener('click', () => {
  ['paneBode', 'paneDcSweep', 'paneTransient'].forEach(id => document.getElementById(id)?.classList.add('hidden'));
  document.getElementById('paneTransient')?.classList.remove('hidden');
  ['tabBode', 'tabDcSweep', 'tabTransient'].forEach(id => document.getElementById(id)?.classList.remove('active'));
  document.getElementById('tabTransient')?.classList.add('active');
});

// Bode Plot Run
document.getElementById('btnRunAC')?.addEventListener('click', () => {
  const fMin = parseFloat(document.getElementById('acFMin')?.value) || 1;
  const fMax = parseFloat(document.getElementById('acFMax')?.value) || 1e6;
  const pts = parseInt(document.getElementById('acPoints')?.value) || 100;
  const results = acAnalysis.run(fMin, fMax, pts);
  const resultEl = document.getElementById('acResult');

  if (results.error) {
    if (resultEl) resultEl.textContent = '⚠️ ' + results.error;
    return;
  }
  const canvas = document.getElementById('bodeCanvas');
  acAnalysis.drawBode(canvas, results);
  if (resultEl) {
    const bwStr = results.bw3dB
      ? (results.bw3dB >= 1000 ? (results.bw3dB / 1000).toFixed(1) + ' kHz' : results.bw3dB.toFixed(0) + ' Hz')
      : 'Aniqlanmadi';
    resultEl.textContent = `✅ Tahlil yakunlandi | -3dB Bandwidth: ${bwStr} | Max: ${(20 * Math.log10(results.maxMag)).toFixed(1)} dB`;
  }
  toast('📈 Bode diagrammasi chizildi!');
});

// DC Sweep Run
document.getElementById('btnRunSweep')?.addEventListener('click', () => {
  const vMin = parseFloat(document.getElementById('swVMin')?.value) || 0;
  const vMax = parseFloat(document.getElementById('swVMax')?.value) || 12;
  const steps = parseInt(document.getElementById('swSteps')?.value) || 100;
  const plotMode = document.getElementById('swPlotMode')?.value || 'vi';

  const src = engine.components.find(c => c.type === 'battery' || c.type === 'dc_source');
  if (!src) {
    document.getElementById('sweepResult').textContent = '⚠️ Kuchlanish manbasi topilmadi!';
    return;
  }
  const results = dcSweep.run(src, vMin, vMax, steps);
  const canvas = document.getElementById('sweepCanvas');
  dcSweep.drawSweep(canvas, results, plotMode);
  const maxI = Math.max(...results.currents);
  document.getElementById('sweepResult').textContent =
    `✅ DC Sweep yakunlandi | Max tok: ${maxI >= 1 ? maxI.toFixed(3) + 'A' : (maxI * 1000).toFixed(1) + 'mA'} | ${vMin}V → ${vMax}V`;
  toast('⚡ DC Sweep tahlili yakunlandi!');
});

// Transient Run
document.getElementById('btnRunTransient')?.addEventListener('click', () => {
  const durMs = parseFloat(document.getElementById('trDuration')?.value) || 50;
  const steps = parseInt(document.getElementById('trSteps')?.value) || 500;
  const results = transientAn.run(durMs / 1000, steps);
  const canvas = document.getElementById('transientCanvas');
  transientAn.drawTransient(canvas, results);
  const tau = results.Rv && results.Cv ? (results.Rv * results.Cv * 1000).toFixed(2) + ' ms' :
              results.Rv && results.Lv ? ((results.Lv / results.Rv) * 1000).toFixed(2) + ' ms' : 'N/A';
  document.getElementById('transientResult').textContent =
    `✅ Tranzient tahlil yakunlandi | τ = ${tau} | ${durMs} ms vaqt oralig'i`;
  toast('⏱️ Tranzient tahlili yakunlandi!');
});

if (btnAnalysis && analysisWindow) {
  btnAnalysis.addEventListener('click', () => {
    analysisWindow.classList.toggle('show');
    playTone(700, 'triangle', 0.05, 0.12);
    toast('📊 Tahlil oynasi ' + (analysisWindow.classList.contains('show') ? 'ochildi' : 'yopildi'));
  });
}
if (analysisCloseBtn && analysisWindow) {
  analysisCloseBtn.addEventListener('click', () => analysisWindow.classList.remove('show'));
}


/* Guided Labs Modal */
function renderLabs() {
  if (!labsList) return;
  labsList.innerHTML = '';
  GUIDED_LABS.forEach((lab) => {
    const card = document.createElement('div');
    card.className = 'lab-card';
    card.innerHTML = `
      <div class="lab-info">
        <span class="lab-badge">${lab.badge}</span>
        <div class="lab-title">${lab.title}</div>
        <div class="lab-desc">${lab.desc}</div>
      </div>
      <div class="lab-status-icon">
        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
      </div>
    `;
    card.addEventListener('click', () => {
      lab.setup({ addComponent, clearCircuit, toast });
      labsModal.classList.remove('show');
      toast(`<b>${lab.title}</b> boshlandi!`);
      if (breadboard3d && mode === 'breadboard') breadboard3d.syncFromEngine();
    });
    labsList.appendChild(card);
  });
}

if (btnLabs) {
  btnLabs.addEventListener('click', () => {
    renderLabs();
    labsModal.classList.add('show');
  });
}
if (closeLabsModal) {
  closeLabsModal.addEventListener('click', () => {
    labsModal.classList.remove('show');
  });
}

/* ==========================================================================
   TROUBLESHOOTING CHALLENGES (NOSOZLIKNI TOP VA TUZAT)
   ========================================================================== */
const TROUBLE_CHALLENGES = [
  {
    id: 'broken_wire',
    title: '1. Lampochka yonmayapti (Uzilgan zanjir)',
    badge: 'Oson',
    badgeClass: 'easy',
    desc: 'Batareya va lampochka ulangan, ammo lampochka yonmayapti. Multimetr yordamida uzilgan ulanishni aniqlang va simni qayta ulang.',
    setup: () => {
      clearCircuit();
      const bat = addComponent('battery_9v', 180, 240);
      const bulb = addComponent('bulb', 420, 240);
      engine.addWire(bat.pins[0].id, bulb.pins[0].id, '#EF4444');
      toast("🔍 <b>Sinov:</b> Nega chiroq yonmayapti? Multimetr bilan tekshiring va yetishmayotgan manfiy simni ulang.");
    }
  },
  {
    id: 'burnt_resistor',
    title: '2. Kuygan rezistor (Ochiq zanjir)',
    badge: 'O‘rtacha',
    badgeClass: 'medium',
    desc: 'Zanjirda 9V batareya va chiroq bor, lekin chiroq yonmayapti. Qaysi rezistor kuyganligini aniqlang va uni yangisiga almashtiring.',
    setup: () => {
      clearCircuit();
      const bat = addComponent('battery_9v', 160, 240);
      const res = addComponent('resistor', 300, 240);
      res.isBurned = true;
      res.resistance = 1e8;
      const bulb = addComponent('bulb', 440, 240);
      engine.addWire(bat.pins[0].id, res.pins[0].id, '#EF4444');
      engine.addWire(res.pins[1].id, bulb.pins[0].id, '#FBBF24');
      engine.addWire(bulb.pins[1].id, bat.pins[1].id, '#38BDF8');
      toast("🔍 <b>Sinov:</b> Rezistorni tekshiring. Agar u kuygan bo‘lsa, uni o‘chirib yangi 220Ω rezistor qo‘ying.");
    }
  },
  {
    id: 'reversed_led',
    title: '3. LED polariteti teskari ulangan',
    badge: 'Oson',
    badgeClass: 'easy',
    desc: 'Yorug‘lik diodi (LED) bir tomonlama o‘tkazuvchi yarimo‘tkazgich. Sxemada LED teskari ulangan. Uni burib to‘g‘rilang.',
    setup: () => {
      clearCircuit();
      const bat = addComponent('battery_9v', 160, 240);
      const res = addComponent('resistor', 300, 180);
      const led = addComponent('led', 420, 240);
      led.rotation = 180;
      engine.addWire(bat.pins[0].id, res.pins[0].id, '#EF4444');
      engine.addWire(res.pins[1].id, led.pins[0].id, '#FBBF24');
      engine.addWire(led.pins[1].id, bat.pins[1].id, '#38BDF8');
      toast("🔍 <b>Sinov:</b> LED nima uchun yonmayapti? LED musbat (+) va manfiy (-) qutblarini tekshiring.");
    }
  },
  {
    id: 'short_circuit_hazard',
    title: '4. Xavfli qisqa tutashuv (KЗ)',
    badge: 'Qiyin',
    badgeClass: 'danger',
    desc: 'Batareya qisqa tutashgan va qizib ketmoqda. Ortiqcha tutashtiruvchi noto‘g‘ri simni toping va uni darhol o‘chiring.',
    setup: () => {
      clearCircuit();
      const bat = addComponent('battery_9v', 160, 240);
      const sw = addComponent('switch', 300, 160);
      const bulb = addComponent('bulb', 300, 320);
      engine.addWire(bat.pins[0].id, sw.pins[0].id, '#EF4444');
      engine.addWire(sw.pins[1].id, bulb.pins[0].id, '#FBBF24');
      engine.addWire(bulb.pins[1].id, bat.pins[1].id, '#38BDF8');
      engine.addWire(bat.pins[0].id, bat.pins[1].id, '#EF4444');
      toast("⚠️ <b>XAVF:</b> Zanjirda qisqa tutashuv bor! Qaysi sim qisqa tutashtirganini topib o‘chiring!");
    }
  }
];

function renderTroubleshootList() {
  if (!troubleshootList) return;
  troubleshootList.innerHTML = '';
  TROUBLE_CHALLENGES.forEach(c => {
    const card = document.createElement('div');
    card.className = 'trouble-card';
    card.innerHTML = `
      <div class="trouble-header">
        <span class="trouble-title">${c.title}</span>
        <span class="trouble-badge ${c.badgeClass}">${c.badge}</span>
      </div>
      <div class="trouble-desc">${c.desc}</div>
      <div class="trouble-action">▶️ Sinovni Boshlash →</div>
    `;
    card.addEventListener('click', () => {
      c.setup();
      troubleshootModal.classList.remove('show');
      if (breadboard3d && (mode === 'breadboard' || mode === 'split')) breadboard3d.syncFromEngine();
    });
    troubleshootList.appendChild(card);
  });
}

if (btnTroubleshoot) {
  btnTroubleshoot.addEventListener('click', () => {
    renderTroubleshootList();
    troubleshootModal.classList.add('show');
  });
}
if (closeTroubleshootModal) {
  closeTroubleshootModal.addEventListener('click', () => {
    troubleshootModal.classList.remove('show');
  });
}

/* ==========================================================================
   LAB REPORT GENERATOR
   ========================================================================== */
function generateLabReport() {
  if (!reportContent) return;
  const now = new Date();
  const dateStr = now.toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long', day: 'numeric' });
  const timeStr = now.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });

  let totalCurrent = 0;
  let totalPower = 0;
  let activeVoltage = 0;

  for (const comp of engine.components) {
    if (comp.type === 'battery' || comp.type === 'dc_source') {
      activeVoltage = Math.max(activeVoltage, comp.voltage || 0);
      totalCurrent += Math.abs(comp.current || 0);
    }
    totalPower += Math.abs((comp.voltageDrop || 0) * (comp.current || 0));
  }

  let tableRows = '';
  engine.components.forEach((c, i) => {
    const u = Math.abs(c.voltageDrop || 0).toFixed(2);
    const iMa = (Math.abs(c.current || 0) * 1000).toFixed(1);
    const pMw = (Math.abs(c.voltageDrop || 0) * Math.abs(c.current || 0) * 1000).toFixed(1);
    const r = c.resistance ? `${c.resistance} Ω` : (c.getResistance ? `${Math.round(c.getResistance())} Ω` : '-');
    tableRows += `
      <tr>
        <td>${i + 1}</td>
        <td><b>${c.name}</b></td>
        <td>${c.type.toUpperCase()}</td>
        <td>${u} V</td>
        <td>${iMa} mA</td>
        <td>${r}</td>
        <td>${pMw} mW</td>
        <td>${c.isBurned ? '⚠️ Kuygan' : (Math.abs(c.current) > 0.001 ? '✅ Faol' : '⚪ Kutishda')}</td>
      </tr>
    `;
  });

  reportContent.innerHTML = `
    <div class="report-section">
      <div class="report-header-box">
        <div><span class="f-label">Laboratoriya nomi:</span> <span class="f-val">Elektr Zanjirlari va Sxemotexnika Tahlili</span></div>
        <div><span class="f-label">Sana va vaqt:</span> <span class="f-val">${dateStr}, ${timeStr}</span></div>
        <div><span class="f-label">O‘quvchi / Talaba:</span> <span class="f-val">ATT-25 Foydalanuvchisi</span></div>
        <div><span class="f-label">Platforma:</span> <span class="f-val">ATT-25 Circuit Lab & 3D Workbench</span></div>
      </div>

      <h3 style="margin-top:10px; font-size:0.95rem; color:var(--accent);">1. Sxema Parametrlari va O‘lchov Natijalari Jadvali</h3>
      <table class="report-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Element</th>
            <th>Turi</th>
            <th>Kuchlanish (U)</th>
            <th>Tok (I)</th>
            <th>Qarshilik (R)</th>
            <th>Quvvat (P)</th>
            <th>Holati</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows || '<tr><td colspan="8" style="text-align:center;">Elementlar mavjud emas</td></tr>'}
        </tbody>
      </table>

      <h3 style="margin-top:10px; font-size:0.95rem; color:var(--accent);">2. Fizik Qonuniyatlar va Xulosa</h3>
      <div class="report-summary-box">
        <div>• <b>Ohm Qonuni tekshiruvi:</b> U = I × R. Zanjirdagi asosiy manba kuchlanishi: <b>${activeVoltage.toFixed(2)} V</b>, umumiy tok kuchi: <b>${(totalCurrent * 1000).toFixed(1)} mA</b>.</div>
        <div>• <b>Umumiy iste’mol quvvati:</b> <b>${(totalPower * 1000).toFixed(1)} mW</b> (Joul-Lents qonuni bo‘yicha ajralayotgan energiya).</div>
        <div>• <b>Kirchhoffning 1-qonuni (Toklar balansi):</b> Barcha tugunlardagi kiruvchi va chiquvchi toklar yig‘indisi nolga teng (Σ I = 0).</div>
        <div>• <b>Xulosa:</b> Sxema to‘liq tahlil qilindi, o‘lchovlar nominal parametrlarga mos keldi.</div>
      </div>
    </div>
  `;
}

if (btnReport) {
  btnReport.addEventListener('click', () => {
    generateLabReport();
    reportModal.classList.add('show');
  });
}
if (closeReportModal) {
  closeReportModal.addEventListener('click', () => {
    reportModal.classList.remove('show');
  });
}
if (btnPrintReport) {
  btnPrintReport.addEventListener('click', () => {
    window.print();
  });
}

// Reset Burned Components
if (btnResetBurned) {
  btnResetBurned.addEventListener('click', () => {
    engine.resetBurned();
    toast("🔄 Barcha kuygan qismlar yangisiga almashtirildi!");
    playTone(520, 'sine', 0.05, 0.15);
    if (breadboard3d) breadboard3d.syncFromEngine();
  });
}

/* ==========================================================================
   RENDER & ANIMATION LOOP
   ========================================================================== */
let lastTime = performance.now();

function animate(now) {
  requestAnimationFrame(animate);
  const dt = Math.min((now - lastTime) / 1000, 0.1);
  lastTime = now;

  // 1. Solve Circuit
  engine.solve();
  engine.updateParticles(dt);
  multimeter.update();
  updateBuzzerSound();

  // Short circuit warning banner
  if (shortWarning) {
    if (engine.isShortCircuit) {
      shortWarning.style.display = 'flex';
      shortWarning.innerHTML = `<span>⚠️</span> ${engine.shortCircuitMessage}`;
      playSparkSound();
    } else {
      shortWarning.style.display = 'none';
    }
  }

  // Update Multimeter HUD
  const dmmValEl = document.getElementById('dmmVal');
  const dmmUnitEl = document.getElementById('dmmUnit');
  if (dmmValEl) dmmValEl.textContent = multimeter.displayVal;
  if (dmmUnitEl) dmmUnitEl.textContent = multimeter.displayUnit;

  // Push sample to Oscilloscope (probe voltage difference)
  if (oscilloscope && scopeWindow.classList.contains('show')) {
    const vRed = multimeter.redProbe.connectedPin ? multimeter.redProbe.connectedPin.voltage : 0;
    const vBlack = multimeter.blackProbe.connectedPin ? multimeter.blackProbe.connectedPin.voltage : 0;
    oscilloscope.pushSample(vRed - vBlack);
  }

  // Check for any burned components
  const hasBurned = engine.components.some(c => c.isBurned || c.isBlown);
  if (btnResetBurned) {
    btnResetBurned.style.display = hasBurned ? 'inline-flex' : 'none';
  }

  // If in pure 3D breadboard mode, 2D canvas does not need redraw (in 'schematic' or 'split', redraw canvas)
  if (mode === 'breadboard') return;

  // 2. Clear Canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 3. Draw Wires
  for (const wire of engine.wires) {
    const pFrom = engine.getPinById(wire.fromPinId);
    const pTo = engine.getPinById(wire.toPinId);
    if (!pFrom || !pTo) continue;

    const pos1 = pFrom.comp.getPinPos(pFrom.pin);
    const pos2 = pTo.comp.getPinPos(pTo.pin);

    // If selected, highlight red
    const isWireSel = (selectedWire === wire);
    ctx.strokeStyle = isWireSel ? '#EF4444' : (wire.color || '#38BDF8');
    ctx.lineWidth = isWireSel ? 4.5 : 3;
    ctx.lineCap = 'round';
    ctx.beginPath();

    // Orthogonal Manhattan routing (X first, then Y)
    const midX = (pos1.x + pos2.x) / 2;
    ctx.moveTo(pos1.x, pos1.y);
    ctx.lineTo(midX, pos1.y);
    ctx.lineTo(midX, pos2.y);
    ctx.lineTo(pos2.x, pos2.y);
    ctx.stroke();

    // Flowing Current Particles (+ to -)
    if (wire.particles && wire.particles.length > 0) {
      ctx.fillStyle = '#FBBF24'; // Gold particles
      ctx.shadowColor = 'rgba(251, 191, 36, 0.8)';
      ctx.shadowBlur = 6;

      for (const t of wire.particles) {
        let px = 0, py = 0;
        if (t < 0.33) {
          const st = t / 0.33;
          px = pos1.x + (midX - pos1.x) * st;
          py = pos1.y;
        } else if (t < 0.66) {
          const st = (t - 0.33) / 0.33;
          px = midX;
          py = pos1.y + (pos2.y - pos1.y) * st;
        } else {
          const st = (t - 0.66) / 0.34;
          px = midX + (pos2.x - midX) * st;
          py = pos2.y;
        }

        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    }
  }

  // Active rubber-band wire being drawn
  if (activeWireStartPin) {
    const p1 = activeWireStartPin.comp.getPinPos(activeWireStartPin.pin);
    const p2 = currentWireMousePos;
    const midX = (p1.x + p2.x) / 2;

    ctx.strokeStyle = activeWireColor;
    ctx.lineWidth = 2.5;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(midX, p1.y);
    ctx.lineTo(midX, p2.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // 4. Draw Components
  for (const comp of engine.components) {
    comp.drawSchematic(ctx);

    // Draw pin contact dots
    for (const pin of comp.pins) {
      const pos = comp.getPinPos(pin);
      const isHovered = (hoveredPin && hoveredPin.pin.id === pin.id);

      if (isHovered) {
        // Pulsing Magnetic Snap Target Ring
        ctx.strokeStyle = '#00FF87';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 8, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.fillStyle = isHovered ? '#00FF87' : '#38BDF8';
      ctx.strokeStyle = '#070B12';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 4.5, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
    }

    // Selection highlight
    if (comp.selected) {
      ctx.strokeStyle = '#00FF87';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(comp.x, comp.y, (comp.radius || 32) + 4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  // 5. Draw Multimeter Probes
  multimeter.drawProbes(ctx);
}

/* ==========================================================================
   ARDUINO CODE EDITOR & VIRTUAL RUNNER
   ========================================================================== */
let activeArduinoComp = null;
const arduinoCodeModal = document.getElementById('arduinoCodeModal');
const closeArduinoModalBtn = document.getElementById('closeArduinoModal');
const arduinoExampleSelect = document.getElementById('arduinoExampleSelect');
const arduinoCodeTextarea = document.getElementById('arduinoCodeTextarea');
const arduinoRunBtn = document.getElementById('arduinoRunBtn');
const arduinoStopBtn = document.getElementById('arduinoStopBtn');
const arduinoClearLogBtn = document.getElementById('arduinoClearLogBtn');
const arduinoRunStatus = document.getElementById('arduinoRunStatus');
const arduinoSerialOutput = document.getElementById('arduinoSerialOutput');

function openArduinoCodeModal(comp) {
  activeArduinoComp = comp || engine.components.find(c => c.type === 'arduino_uno');
  if (!activeArduinoComp) {
    activeArduinoComp = addComponent('arduino_uno', 300, 240);
  }

  if (arduinoCodeTextarea) {
    arduinoCodeTextarea.value = activeArduinoComp.code || (window.ARDUINO_EXAMPLES ? window.ARDUINO_EXAMPLES.blink.code : '');
  }
  if (arduinoSerialOutput) {
    arduinoSerialOutput.textContent = activeArduinoComp.serialLogs.join('\n');
  }
  if (arduinoRunStatus) {
    arduinoRunStatus.textContent = activeArduinoComp.isRunning ? '🟢 Ishlamoqda' : 'Tayyor';
    arduinoRunStatus.style.color = activeArduinoComp.isRunning ? '#00FF87' : '#38BDF8';
  }
  if (arduinoCodeModal) {
    arduinoCodeModal.classList.add('show');
  }
}
window.openArduinoCodeModal = openArduinoCodeModal;

if (closeArduinoModalBtn) {
  closeArduinoModalBtn.addEventListener('click', () => {
    if (activeArduinoComp && arduinoCodeTextarea) {
      activeArduinoComp.code = arduinoCodeTextarea.value;
    }
    arduinoCodeModal.classList.remove('show');
  });
}

if (arduinoExampleSelect) {
  arduinoExampleSelect.addEventListener('change', (e) => {
    const exKey = e.target.value;
    if (window.ARDUINO_EXAMPLES && window.ARDUINO_EXAMPLES[exKey]) {
      arduinoCodeTextarea.value = window.ARDUINO_EXAMPLES[exKey].code;
      toast(`Namuna yuklandi: ${window.ARDUINO_EXAMPLES[exKey].name}`);
    }
  });
}

if (arduinoRunBtn) {
  arduinoRunBtn.addEventListener('click', () => {
    if (!activeArduinoComp) {
      activeArduinoComp = engine.components.find(c => c.type === 'arduino_uno');
    }
    if (!activeArduinoComp) {
      toast("Sxemada Arduino Uno topilmadi!");
      return;
    }

    activeArduinoComp.code = arduinoCodeTextarea.value;
    activeArduinoComp.vm.run(activeArduinoComp.code);
    arduinoRunStatus.textContent = '🟢 Ishlamoqda';
    arduinoRunStatus.style.color = '#00FF87';
    toast("Arduino dasturi ishga tushirildi!");
    playTone(880, 'sine', 0.08, 0.15);
  });
}

if (arduinoStopBtn) {
  arduinoStopBtn.addEventListener('click', () => {
    if (activeArduinoComp) {
      activeArduinoComp.vm.stop();
      arduinoRunStatus.textContent = "⏹ To'xtatildi";
      arduinoRunStatus.style.color = '#EF4444';
      toast("Arduino to'xtatildi");
    }
  });
}

if (arduinoClearLogBtn) {
  arduinoClearLogBtn.addEventListener('click', () => {
    if (activeArduinoComp) {
      activeArduinoComp.vm.clearLog();
      arduinoSerialOutput.textContent = '';
      toast("Serial Monitor tozalandi");
    }
  });
}

// 3D Wire Color Picker
document.querySelectorAll('.color-dot-3d').forEach(dot => {
  dot.addEventListener('click', () => {
    document.querySelectorAll('.color-dot-3d').forEach(d => d.classList.remove('active'));
    dot.classList.add('active');
    if (breadboard3d) {
      breadboard3d.activeWireColor = dot.dataset.color;
    }
  });
});

// Initialize 200 Circuit Templates Modal
if (window.CircuitTemplatesModal) {
  const templatesModal = new window.CircuitTemplatesModal({
    storage,
    clearCircuit,
    breadboard3d,
    get mode() { return mode; },
    toast
  });
  window.templatesModal = templatesModal;
}

// Initialize Live Circuit Controls HUD & Ambient Light
let liveControls = null;
if (window.LiveCircuitControls) {
  liveControls = new window.LiveCircuitControls({
    engine,
    addComponent,
    clearCircuit,
    breadboard3d,
    get mode() { return mode; },
    toast,
    playSwitchSound
  });
  window.liveControls = liveControls;
}

// Initial default circuit: 9V Battery + Switch + Bulb
function setupDefaultCircuit() {
  loadPreset('switch_bulb');
  if (liveControls) liveControls.renderHud();
}

setupDefaultCircuit();
requestAnimationFrame(animate);

})();
