/* ==========================================================================
   EDUCATIONAL EXPERIMENTS & LAB SCENARIOS
   ATT-25 Smart Grid - Energetik Tajribalar va Avariya Ssenariylari
   ========================================================================== */

class GridExperiments {
  constructor(engine, dispatcher) {
    this.engine = engine;
    this.dispatcher = dispatcher;
  }

  // Bind experiment trigger buttons
  initUI() {
    const btnExp1 = document.getElementById('btnExpHighVoltage');
    const btnExp2 = document.getElementById('btnExpPeakLoad');
    const btnExp3 = document.getElementById('btnExpShortCircuit');
    const btnExp4 = document.getElementById('btnExpHouseOverload');
    const btnExp5 = document.getElementById('btnExpDuckCurve');
    const btnExp6 = document.getElementById('btnExpBessRapid');

    if (btnExp1) btnExp1.addEventListener('click', () => this.runExpHighVoltage());
    if (btnExp2) btnExp2.addEventListener('click', () => this.runExpPeakLoad());
    if (btnExp3) btnExp3.addEventListener('click', () => this.runExpShortCircuit());
    if (btnExp4) btnExp4.addEventListener('click', () => this.runExpHouseOverload());
    if (btnExp5) btnExp5.addEventListener('click', () => this.runExpDuckCurve());
    if (btnExp6) btnExp6.addEventListener('click', () => this.runExpBessRapid());
  }

  // 1. High Voltage vs Low Voltage Transmission Loss Test
  runExpHighVoltage() {
    this.engine.lep220.isHighVoltageMode = !this.engine.lep220.isHighVoltageMode;
    const isHV = this.engine.lep220.isHighVoltageMode;
    
    if (!isHV) {
      this.engine.addLog("🔬 [TAJRIBA 1: 10.5 kV DA UZATISH] Transformator chetlab o'tildi! 70 MVt quvvat 10.5 kV da uzatilmoqda.");
      if (window.toast) {
        window.toast("⚠️ <b>10.5 kV Tajriba Rejimi:</b> Tok 4,000+ Ampergacha sakradi! Simlarda ulkan isrof va kuchlanish tushishi yuz berdi!", 4000);
      }
    } else {
      this.engine.addLog("✅ [TAJRIBA 1: 220 kV MAGISTRAL REJIMI] 220 kV ga ko'tarildi. Tok 20 baravar kamaydi, isrof minimal darajaga tushdi.");
      if (window.toast) {
        window.toast("⚡ <b>220 kV Magistral Rejimi:</b> Tok atigi ~200 A. Isrof 1.5% gacha pasaydi!", 3000);
      }
    }

    this.engine.updatePhysics();
    this.dispatcher.updateTelemetry();
  }

  // 2. Peak Load & Blackout Test
  runExpPeakLoad() {
    this.engine.addLog("🌆 [TAJRIBA 2: KECHKI PIK SOATLAR] Shahar va qishloq iste'moli maksimal darajaga (120 MVt) oshirildi!");
    
    // Increase city load drastically
    this.engine.gpp.cityLoadMW = 75.0;
    this.engine.gpp.industrialLoadMW = 35.0;
    this.engine.gpp.villageFeederMW = 14.0;
    this.engine.timeOfDay = 20.5; // 20:30 (Evening peak)

    const timeSlider = document.getElementById('timeOfDaySlider');
    if (timeSlider) timeSlider.value = 20.5;
    const timeVal = document.getElementById('timeOfDayVal');
    if (timeVal) timeVal.textContent = "20:30";

    if (window.gridScene3D) {
      window.gridScene3D.setTimeOfDay(20.5);
    }

    if (window.toast) {
      window.toast("🌆 <b>Kechki Pik Soatlar (20:30):</b> Tarmoqqa haddan tashqari yuklama tushdi. Chastota pasayishini kuzating!", 4000);
    }

    this.engine.updatePhysics();
    this.dispatcher.updateTelemetry();
  }

  // 3. Short Circuit & Relay Protection (APV)
  runExpShortCircuit() {
    if (window.toast) {
      window.toast("⚡ <b>LEPda Qisqa Tutashuv:</b> Chaqmoq tushdi! Rele himoyasi va APV sinovi boshlandi...", 4000);
    }
    this.engine.triggerLineShortCircuit();
    this.dispatcher.renderBreakers();
    this.dispatcher.updateTelemetry();
  }

  // 4. Household Overload & Breaker Trip
  runExpHouseOverload() {
    this.engine.addLog("🏠 [TAJRIBA 4: XONADON ORTIQCHA YUKLAMASI] Barcha maishiy texnikalar bir vaqtda yoqildi!");
    
    for (const key in this.engine.house.appliances) {
      this.engine.house.appliances[key].on = true;
    }

    if (window.houseSim) {
      window.houseSim.renderApplianceControls(document.getElementById('applianceListContainer'));
    }

    if (window.toast) {
      window.toast("🫖 <b>Xonadonda Hamma Jihozlar Yoqildi:</b> Tok 35+ Amperdan oshib, avtomat sharaqlab o'chadi!", 4000);
    }

    this.engine.updatePhysics();
    this.dispatcher.updateTelemetry();
  }

  // 5. Duck Curve: Solar drop and BESS / Hydro rapid balancing
  runExpDuckCurve() {
    this.engine.addLog("🦆 [TAJRIBA 5: O'RDAK EGRI CHIZIG'I] Quyosh botdi (19:30), xonadonlar yuklamasi oshdi. BESS batareyasi zaryadsizlanishga o'tdi!");
    
    this.engine.timeOfDay = 19.5; // 19:30 Sunset
    this.engine.solar.cloudCoverPercent = 80;
    this.engine.bess.mode = 'discharge';

    const timeSlider = document.getElementById('timeOfDaySlider');
    if (timeSlider) timeSlider.value = 19.5;
    const timeVal = document.getElementById('timeOfDayVal');
    if (timeVal) timeVal.textContent = "19:30";

    const bessSelect = document.getElementById('bessModeSelect');
    if (bessSelect) bessSelect.value = 'discharge';

    if (window.gridScene3D) {
      window.gridScene3D.setTimeOfDay(19.5);
    }

    if (window.toast) {
      window.toast("🦆 <b>O'rdak Egri Chizig'i (Duck Curve):</b> Quyosh botdi. BESS batareyasi +25 MVt berib, tarmoqni muvozanatlamoqda!", 4500);
    }

    this.engine.updatePhysics();
    this.dispatcher.updateTelemetry();
  }

  // 6. Rapid Primary Frequency Response (FCR) from BESS
  runExpBessRapid() {
    this.engine.addLog("⚡ [TAJRIBA 6: BESS TEZKOR JAVOBI] GES generatorda nosozlik! BESS 20 ms da to'liq 25 MVt berib tarmoqni qutqardi.");
    
    // Temporarily trip GES breaker
    this.engine.breakers.Q_GEN.closed = false;
    this.engine.breakers.Q_GEN.trip = true;
    this.engine.bess.mode = 'discharge';

    if (window.toast) {
      window.toast("🔋 <b>BESS Tezkor FCR Javobi:</b> Generator uzildi, lekin BESS akkumulyatori 25 MVt berib, blackout'ning oldini oldi!", 4500);
    }

    this.dispatcher.renderBreakers();
    this.engine.updatePhysics();
    this.dispatcher.updateTelemetry();

    // Restore after 4 seconds
    setTimeout(() => {
      this.engine.breakers.Q_GEN.closed = true;
      this.engine.breakers.Q_GEN.trip = false;
      this.engine.bess.mode = 'auto';
      this.dispatcher.renderBreakers();
      this.engine.updatePhysics();
      this.dispatcher.updateTelemetry();
      this.engine.addLog("✅ [BESS] Generator qayta ulandi. Tizim barqarorlashdi.");
    }, 4000);
  }
}

window.GridExperiments = GridExperiments;
