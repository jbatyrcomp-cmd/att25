/* ==========================================================================
   SMART GRID MAIN CONTROLLER & APPLICATION ENTRY POINT
   ATT-25 Smart Grid - GESdan Xonadongacha Elektr Tizimi Simulyatori
   ========================================================================== */

(function() {
  'use strict';

  // =========================================================================
  // 1. ADVANCED SPATIAL 3D AUDIO SYSTEM (Web Audio API)
  // =========================================================================
  class SpatialAudioSystem {
    constructor() {
      this.ctx = null;
      this.isMuted = false;
      this.isInitialized = false;

      // Master Nodes
      this.masterGain = null;

      // Sound channels
      this.waterRoarNode = null;
      this.waterGain = null;

      this.hum50HzOsc = null;
      this.hum100HzOsc = null;
      this.humGain = null;

      this.windNoiseNode = null;
      this.windGain = null;
      this.windFilter = null;

      this.houseGain = null;

      // Positions in 3D world
      this.positions = {
        dam: new THREE.Vector3(-70, 15, -70),
        substation: new THREE.Vector3(-40, 5, -40),
        wind: new THREE.Vector3(-25, 25, 75),
        house: new THREE.Vector3(130, 5, 108)
      };
    }

    init() {
      if (this.isInitialized) return;
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();
        if (!this.ctx) return;

        // Master Gain
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0.0 : 0.85, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        // A. Continuous White/Pink Noise Buffer (2 seconds looping)
        const bufferSize = this.ctx.sampleRate * 2;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          // Pink noise filter approximation
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
          b6 = white * 0.115926;
        }

        // 1. Dam & Waterfall Roar (Lowpass filtered noise)
        const waterNoiseSource = this.ctx.createBufferSource();
        waterNoiseSource.buffer = noiseBuffer;
        waterNoiseSource.loop = true;

        const waterFilter = this.ctx.createBiquadFilter();
        waterFilter.type = 'lowpass';
        waterFilter.frequency.setValueAtTime(380, this.ctx.currentTime);
        waterFilter.Q.setValueAtTime(2.0, this.ctx.currentTime);

        this.waterGain = this.ctx.createGain();
        this.waterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);

        waterNoiseSource.connect(waterFilter);
        waterFilter.connect(this.waterGain);
        this.waterGain.connect(this.masterGain);
        waterNoiseSource.start();

        // 2. 50 Hz Substation & Transformer Hum
        this.hum50HzOsc = this.ctx.createOscillator();
        this.hum50HzOsc.type = 'sine';
        this.hum50HzOsc.frequency.setValueAtTime(50, this.ctx.currentTime);

        this.hum100HzOsc = this.ctx.createOscillator();
        this.hum100HzOsc.type = 'sawtooth';
        this.hum100HzOsc.frequency.setValueAtTime(100, this.ctx.currentTime);

        const hum100Gain = this.ctx.createGain();
        hum100Gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
        this.hum100HzOsc.connect(hum100Gain);

        const humFilter = this.ctx.createBiquadFilter();
        humFilter.type = 'lowpass';
        humFilter.frequency.setValueAtTime(220, this.ctx.currentTime);

        this.humGain = this.ctx.createGain();
        this.humGain.gain.setValueAtTime(0.001, this.ctx.currentTime);

        this.hum50HzOsc.connect(humFilter);
        hum100Gain.connect(humFilter);
        humFilter.connect(this.humGain);
        this.humGain.connect(this.masterGain);

        this.hum50HzOsc.start();
        this.hum100HzOsc.start();

        // 3. Wind Turbine Whoosh (Modulated Bandpass Noise)
        const windNoiseSource = this.ctx.createBufferSource();
        windNoiseSource.buffer = noiseBuffer;
        windNoiseSource.loop = true;

        this.windFilter = this.ctx.createBiquadFilter();
        this.windFilter.type = 'bandpass';
        this.windFilter.frequency.setValueAtTime(550, this.ctx.currentTime);
        this.windFilter.Q.setValueAtTime(3.5, this.ctx.currentTime);

        this.windGain = this.ctx.createGain();
        this.windGain.gain.setValueAtTime(0.001, this.ctx.currentTime);

        windNoiseSource.connect(this.windFilter);
        this.windFilter.connect(this.windGain);
        this.windGain.connect(this.masterGain);
        windNoiseSource.start();

        // 4. House Interior Electrical Ambiance
        const houseOsc = this.ctx.createOscillator();
        houseOsc.type = 'triangle';
        houseOsc.frequency.setValueAtTime(120, this.ctx.currentTime);

        this.houseGain = this.ctx.createGain();
        this.houseGain.gain.setValueAtTime(0.001, this.ctx.currentTime);

        houseOsc.connect(this.houseGain);
        this.houseGain.connect(this.masterGain);
        houseOsc.start();

        this.isInitialized = true;
      } catch (e) {
        console.warn("Spatial Audio init warning:", e);
      }
    }

    // Distance attenuation function: 1.0 at minDistance, 0.0 at maxDistance
    calcAttenuation(cameraPos, targetPos, minDist, maxDist) {
      if (!cameraPos) return 0;
      const dist = cameraPos.distanceTo(targetPos);
      if (dist <= minDist) return 1.0;
      if (dist >= maxDist) return 0.0;
      return 1.0 - (dist - minDist) / (maxDist - minDist);
    }

    safeSetGain(gainNode, targetVal, time, ramp) {
      if (!gainNode || !gainNode.gain) return;
      const safe = (typeof targetVal === 'number' && Number.isFinite(targetVal))
        ? Math.max(0.0001, Math.min(1.0, targetVal))
        : 0.0001;
      gainNode.gain.setTargetAtTime(safe, time, ramp);
    }

    // Called every frame or tick to update spatial gains based on camera position
    update(camera, engine) {
      if (!this.isInitialized || !this.ctx || !camera) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }

      const camPos = camera.position;
      const now = this.ctx.currentTime;
      const ramp = 0.18;

      // 1. Dam & Waterfall Roar
      const damAtt = this.calcAttenuation(camPos, this.positions.dam, 15, 140);
      const hydroFlow = (engine.hydro && typeof engine.hydro.flowRate === 'number') ? (engine.hydro.flowRate / 120.0) : 0.8;
      const targetWaterGain = damAtt * hydroFlow * 0.45;
      this.safeSetGain(this.waterGain, targetWaterGain, now, ramp);

      // 2. Substation & KTP 50 Hz Hum
      const subAtt = this.calcAttenuation(camPos, this.positions.substation, 8, 90);
      const ktpAtt = this.calcAttenuation(camPos, new THREE.Vector3(98, 4, 82), 6, 60);
      const gppAtt = this.calcAttenuation(camPos, new THREE.Vector3(65, 8, 40), 8, 75);
      const totalHumAtt = Math.max(subAtt, ktpAtt, gppAtt);
      const lepP = (engine.lep && typeof engine.lep.pMW === 'number') ? Math.abs(engine.lep.pMW) / 100.0 : 0.5;
      const targetHumGain = totalHumAtt * Math.min(1.2, 0.15 + lepP * 0.35) * 0.35;
      this.safeSetGain(this.humGain, targetHumGain, now, ramp);

      // 3. Wind Turbines Whoosh
      const windAtt = this.calcAttenuation(camPos, this.positions.wind, 15, 120);
      const windSpd = (engine.wind && typeof engine.wind.windSpeed === 'number') ? engine.wind.windSpeed : 8;
      const windFactor = Math.max(0, Math.min(1.2, (windSpd - 3) / 10.0));
      const targetWindGain = windAtt * windFactor * 0.35;
      this.safeSetGain(this.windGain, targetWindGain, now, ramp);

      // 4. House Interior Electrical Ambiance
      const houseAtt = this.calcAttenuation(camPos, this.positions.house, 4, 35);
      const houseLoadKW = (engine.house && typeof engine.house.powerKW === 'number') ? engine.house.powerKW : 2.0;
      const targetHouseGain = houseAtt * Math.min(1.0, 0.05 + (houseLoadKW / 8.0) * 0.25) * 0.15;
      this.safeSetGain(this.houseGain, targetHouseGain, now, ramp);
    }

    toggleMute() {
      this.isMuted = !this.isMuted;
      if (!this.isInitialized) {
        this.init();
      }
      if (this.masterGain && this.ctx) {
        const target = this.isMuted ? 0.0 : 0.85;
        this.masterGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.08);
      }
      return !this.isMuted;
    }

    playUiTone(freq, type = 'sine', duration = 0.08, vol = 0.12) {
      try {
        if (!this.isInitialized) this.init();
        if (!this.ctx || this.isMuted) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(vol, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.masterGain || this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {}
    }

    playSwitchSound() {
      this.playUiTone(280, 'triangle', 0.05, 0.16);
      setTimeout(() => this.playUiTone(160, 'square', 0.07, 0.12), 40);
    }
  }

  const spatialAudio = new SpatialAudioSystem();
  window.spatialAudio = spatialAudio;
  window.playSwitchSound = () => spatialAudio.playSwitchSound();

  // One-time user interaction listener to unlock Web Audio context
  const unlockAudio = () => {
    spatialAudio.init();
    window.removeEventListener('click', unlockAudio);
    window.removeEventListener('keydown', unlockAudio);
  };
  window.addEventListener('click', unlockAudio, { once: true });
  window.addEventListener('keydown', unlockAudio, { once: true });

  // =========================================================================
  // 2. TOAST NOTIFICATION HELPER
  // =========================================================================
  const toastEl = document.getElementById('toast');
  let toastTimer = null;
  function toast(msg, duration = 3200) {
    if (!toastEl) return;
    toastEl.innerHTML = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), duration);
  }
  window.toast = toast;

  // =========================================================================
  // 3. INITIALIZE CORE SUBSYSTEMS
  // =========================================================================
  const engine = new PowerGridEngine();
  const scene3d = new GridScene3D('scene3dContainer', engine);
  window.gridScene3D = scene3d;

  const dispatcher = new ScadaDispatcher(engine);
  const houseSim = new HouseSimulator(engine);
  window.houseSim = houseSim;

  const experiments = new GridExperiments(engine, dispatcher);

  dispatcher.initUI();
  experiments.initUI();
  houseSim.renderApplianceControls(document.getElementById('applianceListContainer'));

  // =========================================================================
  // 4. DRONE INSPECTION TOUR CONTROLS
  // =========================================================================
  const btnDroneTour = document.getElementById('btnDroneTour');
  if (btnDroneTour) {
    btnDroneTour.addEventListener('click', () => {
      spatialAudio.init();
      if (scene3d.isDroneTourActive) {
        scene3d.stopDroneInspection();
        btnDroneTour.classList.remove('drone-active');
        btnDroneTour.innerHTML = '🚁 Dron Sayohati';
        toast("⏹️ Dron sayohati to'xtatildi.");
      } else {
        scene3d.startDroneInspection();
        btnDroneTour.classList.add('drone-active');
        btnDroneTour.innerHTML = '⏹️ Parvozni To\'xtatish';
        toast("🚁 <b>Dron Ekskursiyasi:</b> GES to'g'onidan xonadongacha havo parvozi boshlandi!", 4500);
      }
      spatialAudio.playUiTone(580, 'sine', 0.06, 0.15);
    });

    // Handle natural tour end callback
    scene3d.onDroneTourEnd = () => {
      btnDroneTour.classList.remove('drone-active');
      btnDroneTour.innerHTML = '🚁 Dron Sayohati';
    };
  }

  // =========================================================================
  // 5. AUDIO TOGGLE BUTTON
  // =========================================================================
  const btnAudioToggle = document.getElementById('btnAudioToggle');
  if (btnAudioToggle) {
    btnAudioToggle.addEventListener('click', () => {
      const isSoundOn = spatialAudio.toggleMute();
      if (isSoundOn) {
        btnAudioToggle.classList.remove('muted');
        btnAudioToggle.innerHTML = '🔊 Ovoz: Yoniq';
        toast("🔊 Fazoviy 3D Ovoz Yoqildi (Sharshara, 50 Hz podstansiya g'uvillashi, shamol)");
      } else {
        btnAudioToggle.classList.add('muted');
        btnAudioToggle.innerHTML = '🔇 Ovoz: O\'chiq';
        toast("🔇 Ovoz O'chirildi");
      }
    });
  }

  // =========================================================================
  // 6. HOTSPOT NAVIGATION BAR LISTENERS
  // =========================================================================
  document.querySelectorAll('.hotspot-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      // If drone is active, stop it upon user selecting a hotspot
      if (scene3d.isDroneTourActive) {
        scene3d.stopDroneInspection();
        if (btnDroneTour) {
          btnDroneTour.classList.remove('drone-active');
          btnDroneTour.innerHTML = '🚁 Dron Sayohati';
        }
      }

      document.querySelectorAll('.hotspot-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const spot = btn.dataset.spot;
      scene3d.gotoHotspot(spot);
      spatialAudio.playUiTone(520, 'sine', 0.05, 0.1);
    });
  });

  // =========================================================================
  // 7. HOUSE BREAKER RESET BUTTON
  // =========================================================================
  const btnResetHouseBreaker = document.getElementById('btnResetHouseBreaker');
  if (btnResetHouseBreaker) {
    btnResetHouseBreaker.addEventListener('click', () => {
      engine.resetHouseBreaker();
      houseSim.updateMeterDisplay();
      dispatcher.renderBreakers();
      dispatcher.updateTelemetry();
      spatialAudio.playSwitchSound();
      toast("✅ Xonadon kirish avtomati yoqildi");
    });
  }

  // =========================================================================
  // 8. EXPERIMENTS MODAL TOGGLE
  // =========================================================================
  const btnOpenExperiments = document.getElementById('btnOpenExperiments');
  const experimentsModal = document.getElementById('experimentsModal');
  const closeExperimentsModal = document.getElementById('closeExperimentsModal');

  if (btnOpenExperiments && experimentsModal) {
    btnOpenExperiments.addEventListener('click', () => {
      experimentsModal.classList.add('show');
      spatialAudio.playUiTone(600, 'sine', 0.04, 0.1);
    });
  }

  if (closeExperimentsModal && experimentsModal) {
    closeExperimentsModal.addEventListener('click', () => {
      experimentsModal.classList.remove('show');
    });
  }

  // =========================================================================
  // 9. HOUSE APPLIANCES MODAL TOGGLE
  // =========================================================================
  const btnOpenHouseModal = document.getElementById('btnOpenHouseModal');
  const houseModal = document.getElementById('houseModal');
  const closeHouseModal = document.getElementById('closeHouseModal');

  if (btnOpenHouseModal && houseModal) {
    btnOpenHouseModal.addEventListener('click', () => {
      houseModal.classList.add('show');
      scene3d.gotoHotspot('house');
      document.querySelectorAll('.hotspot-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.spot === 'house');
      });
      spatialAudio.playUiTone(640, 'sine', 0.04, 0.1);
    });
  }

  if (closeHouseModal && houseModal) {
    closeHouseModal.addEventListener('click', () => {
      houseModal.classList.remove('show');
    });
  }

  // =========================================================================
  // 10. MAIN SIMULATION & SPATIAL AUDIO LOOP (Runs at 20 Hz)
  // =========================================================================
  setInterval(() => {
    engine.updatePhysics(0.05);
    dispatcher.updateTelemetry();
    houseSim.updateMeterDisplay();

    // Update 3D spatial audio based on camera position
    if (scene3d && scene3d.camera) {
      spatialAudio.update(scene3d.camera, engine);
    }
  }, 50);

  // Initial greeting
  setTimeout(() => {
    toast("⚡ <b>ATT-25 Smart Grid:</b> GESdan xonadongacha butun elektr zanjiriga xush kelibsiz! Yuqoridagi tugmalar orqali ob'ektlarga o'ting yoki 🚁 Dron sayohatini ishga tushiring.", 5000);
  }, 800);

})();
