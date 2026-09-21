/* ==========================================================================
   SMART GRID POWER PHYSICS ENGINE
   ATT-25 Smart Grid: GESdan Xonadongacha Elektr Tizimi Dvigateli
   Physics: Hydrodynamics, 3-Phase AC, Step-Up/Down Transformers,
   Transmission Line Loss, Voltage Drops, Grid Frequency, Relay Protection
   ========================================================================== */

class PowerGridEngine {
  constructor() {
    // 1. GES (Hydroelectric Power Plant) Parameters
    this.ges = {
      name: "To'palang GES (Namunaviy Yirik GES)",
      waterHead: 120,          // Suv bosim balandligi H (metr) [50 - 180m]
      waterFlow: 85,           // Suv sarfi Q (m³/s) [10 - 150 m³/s]
      efficiencyTurbine: 0.93, // Turbina F.I.K.
      efficiencyGen: 0.97,     // Generator F.I.K.
      nominalVoltage: 10.5,    // Generator kuchlanishi (kV)
      voltage: 10.5,           // Haqiqiy kuchlanish (kV)
      powerMW: 0,              // Ishlab chiqarilayotgan aktiv quvvat (MVt)
      reactivePowerMVAr: 0,    // Reaktiv quvvat (MVAr)
      frequency: 50.00,        // Tarmoq chastotasi (Hz)
      rpm: 375,                // Turbina aylanish tezligi (ayl/daq)
      gateOpenPercent: 85,     // Yo'naltiruvchi apparat ochilishi (%)
      isRunning: true
    };

    // 2. Kuchaytiruvchi Podstansiya (ORU-220 kV)
    this.oru220 = {
      name: "GES Ochiq Taqsimlash Qurilmasi (ORU-220 kV)",
      t1_nominalMVA: 125,      // T-1 transformator quvvati (MVA)
      ratio: 230 / 10.5,       // Transformatsiya koeffitsienti (~21.9)
      voltageHV: 228.0,        // Yuqori kuchlanish chiqishi (kV)
      currentLV: 0,            // 10.5 kV tomondagi tok (A)
      currentHV: 0,            // 220 kV tomondagi tok (A)
      tempC: 58,               // Transformator moyi harorati (°C)
      fanRunning: false
    };

    // 3. Magistral Havo Elektr Uzatish Liniyasi (LEP-220 kV)
    this.lep220 = {
      name: "220 kV Magistral Havo Liniyasi (Dala orqali)",
      lengthKm: 85,            // Liniya uzunligi (km)
      wireType: "2xAS-240/32", // Faza o'tkazgichi turi
      r0: 0.118,               // 1 km solishtirma faol qarshiligi (Om/km)
      x0: 0.405,               // 1 km induktiv qarshiligi (Om/km)
      totalResistance: 0,      // Umumiy R (Om)
      totalReactance: 0,       // Umumiy X (Om)
      current: 0,              // Liniyadagi tok (A)
      lossMW: 0,               // Joule-Lenz issiqlik isrofi (MVt)
      lossPercent: 0,          // Isrof foizi (%)
      voltageDropKV: 0,        // Kuchlanish tushishi (kV)
      coronaDischarge: false,  // Toj razryadi effekti
      isHighVoltageMode: true  // 220 kV rejimi (false bo'lsa 10 kV da uzatish tajribasi)
    };
    this.lep220.totalResistance = this.lep220.r0 * this.lep220.lengthKm;
    this.lep220.totalReactance = this.lep220.x0 * this.lep220.lengthKm;

    // 4. Shahar va Tuman Bosh Podstansiyasi (GPP-220/35/10 kV)
    this.gpp = {
      name: "Tuman Bosh Pasaytiruvchi Podstansiyasi (GPP)",
      voltageInputKV: 220.0,   // Kirish kuchlanishi (kV)
      voltageBus10KV: 10.3,    // 10 kV shahar shinalari kuchlanishi (kV)
      voltageBus35KV: 34.5,    // 35 kV qishloq shinalari kuchlanishi (kV)
      cityLoadMW: 45.0,        // Shahar umumiy yuklamasi (MVt)
      industrialLoadMW: 25.0,  // Sanoat korxonalari yuklamasi (MVt)
      villageFeederMW: 6.5,    // Qishloq yo'nalishidagi quvvat (MVt)
      totalLoadMW: 0           // Jami podstansiya yuki (MVt)
    };

    // 5. Mahalla Transformator Punkti (KTP 10/0.4 kV)
    this.ktp = {
      name: "Mahalla Transformatori (KTP-400/10/0.4)",
      voltageInputKV: 10.3,    // Kirish 10 kV
      voltageOutputV: 400,     // 3-faza chiqish (V)
      voltagePhaseV: 231,      // 1-faza chiqish (V)
      nominalKVA: 400,         // Transformator quvvati (kVA)
      currentLoadKW: 180,      // Mahalla jami iste'moli (kVt)
      powerFactor: 0.92,       // cos φ
      oilTempC: 48
    };

    // 6. Namunaviy Xonadon Ichki Elektr Tarmog'i
    this.house = {
      voltage: 228.0,          // Xonadondagi haqiqiy kuchlanish (V)
      current: 0,              // Umumiy iste'mol toki (A)
      powerKW: 0,              // Aktiv quvvat (kVt)
      energyKWh: 142.6,        // Smart hisoblagich ko'rsatkichi (kVt*s)
      mainBreakerTripped: false, // Kirish avtomati holati
      appliances: {
        ac: { name: "Konditsioner (Inverter)", powerW: 1800, on: true, cosPhi: 0.88, icon: "❄️" },
        kettle: { name: "Elektr Choynak", powerW: 2200, on: false, cosPhi: 1.0, icon: "🫖" },
        fridge: { name: "Muzlatgich (No-Frost)", powerW: 350, on: true, cosPhi: 0.82, icon: "🧊" },
        washing: { name: "Kir Yuvish Mashinasi", powerW: 2000, on: false, cosPhi: 0.85, icon: "🧺" },
        tv: { name: "Smart TV 65'' & Akustika", powerW: 180, on: true, cosPhi: 0.95, icon: "📺" },
        lights: { name: "Xonadon LED Yoritgichlari", powerW: 120, on: true, cosPhi: 0.98, icon: "💡" },
        iron: { name: "Dazmol", powerW: 1600, on: false, cosPhi: 1.0, icon: "👔" }
      }
    };

    // 7. O'chirgichlar va Kommutatsiya Tizimi (Circuit Breakers)
    this.breakers = {
      Q_GEN: { name: "Q-GEN: Generator O'chirgichi (10 kV)", closed: true, trip: false },
      Q_T1_LV: { name: "Q-T1-LV: Transformator 10 kV Kirish", closed: true, trip: false },
      Q_T1_HV: { name: "Q-T1-HV: 220 kV Chiqish SF6 O'chirgichi", closed: true, trip: false },
      Q_LEP1: { name: "Q-LEP1: 220 kV Liniya Boshlanishi", closed: true, trip: false },
      Q_LEP2: { name: "Q-LEP2: 220 kV Liniya Yakuni (GPP)", closed: true, trip: false },
      Q_CITY: { name: "Q-CITY: Shahar 10 kV Fideri", closed: true, trip: false },
      Q_VILLAGE: { name: "Q-VIL: Qishloq 35/10 kV Fideri", closed: true, trip: false },
      Q_KTP: { name: "Q-KTP: Mahalla KTP 10 kV Kirishi", closed: true, trip: false },
      Q_HOUSE: { name: "Q-UY: Xonadon Kirish Avtomati (25A)", closed: true, trip: false },
      Q_SOLAR: { name: "Q-SES: Quyosh Stansiyasi 35 kV Fideri", closed: true, trip: false },
      Q_WIND: { name: "Q-VET: Shamol Stansiyasi 35 kV Fideri", closed: true, trip: false },
      Q_BESS: { name: "Q-BESS: Akkumulyator Tizimi 35 kV Ulanishi", closed: true, trip: false }
    };

    // 7b. Yashil Energetika (Quyosh, Shamol va BESS Megapack)
    this.solar = {
      name: "Quyosh Fotoelektr Stansiyasi (SES)",
      nominalMW: 45.0,
      solarRadiation: 850, // W/m²
      cloudCoverPercent: 10,
      powerMW: 0,
      inverterEfficiency: 0.98
    };

    this.wind = {
      name: "Shamol Elektr Stansiyasi (VET)",
      nominalMW: 30.0,
      windSpeed: 9.5, // m/s
      powerMW: 0,
      turbineCount: 3,
      cutInSpeed: 3.0,
      ratedSpeed: 12.0,
      cutOutSpeed: 25.0
    };

    this.bess = {
      name: "Megapack BESS Energiya Saqlash Tizimi",
      capacityMWh: 50.0,
      socPercent: 68.5, // State of Charge (0 - 100%)
      maxPowerMW: 25.0,
      powerMW: 0, // Musbat = Zaryadsizlanish (tarmoqqa berish), Manfiy = Zaryadlash
      mode: 'auto', // 'auto', 'charge', 'discharge', 'idle'
      efficiency: 0.94
    };

    // 8. Tizim Avariya & Himoya Holatlari (Relay Protection)
    this.alarms = [];
    this.faults = {
      lineShortCircuit: false, // Liniyada qisqa tutashuv
      transformerOverheat: false,
      houseOverload: false,
      apvPending: false
    };

    // Dynamic Time & Weather
    this.timeOfDay = 14.0; // Soat (0 - 24)
    this.weather = "sunny"; // 'sunny', 'rain', 'storm', 'night'
    this.simSpeed = 1.0;

    // Listeners for telemetry
    this.onUpdate = null;
  }

  // Toggle Breaker state
  toggleBreaker(id) {
    if (this.breakers[id]) {
      this.breakers[id].closed = !this.breakers[id].closed;
      this.breakers[id].trip = false;
      this.addLog(`[KOMMUTATSIYA] ${this.breakers[id].name}: ${this.breakers[id].closed ? "ULANDI (ON)" : "UZILDI (OFF)"}`);
      this.updatePhysics();
    }
  }

  // Toggle House Appliance
  toggleAppliance(key) {
    if (this.house.appliances[key]) {
      this.house.appliances[key].on = !this.house.appliances[key].on;
      this.updatePhysics();
    }
  }

  addLog(msg) {
    const timeStr = new Date().toLocaleTimeString();
    this.alarms.unshift({ time: timeStr, text: msg });
    if (this.alarms.length > 50) this.alarms.pop();
  }

  // Main Electrical Physics Calculation Loop
  updatePhysics(dt = 0.05) {
    // 1. Calculate House Power & Current
    let houseP = 0;
    let houseQ = 0;

    if (this.breakers.Q_HOUSE.closed && !this.house.mainBreakerTripped) {
      for (const key in this.house.appliances) {
        const app = this.house.appliances[key];
        if (app.on) {
          houseP += app.powerW;
          const sinPhi = Math.sqrt(1 - Math.min(1, app.cosPhi * app.cosPhi));
          houseQ += app.powerW * (sinPhi / app.cosPhi);
        }
      }
    }

    this.house.powerKW = houseP / 1000.0;
    // House current at nominal 230V
    this.house.current = houseP > 0 ? (houseP / (this.house.voltage || 220)) : 0;

    // Check House Main Breaker (25A C-curve breaker trip at > 32A)
    if (this.house.current > 32.0 && !this.house.mainBreakerTripped) {
      this.house.mainBreakerTripped = true;
      this.breakers.Q_HOUSE.closed = false;
      this.breakers.Q_HOUSE.trip = true;
      this.faults.houseOverload = true;
      this.addLog("⚠️ [XONADON AVTOMATI URDI] Ortiqcha yuklama (>32A). Avtomat o'chirgich uzildi!");
    }

    // Energy meter accumulation (kWh)
    this.house.energyKWh += (this.house.powerKW * (dt / 3600)) * this.simSpeed;

    // 2. KTP Load (Mahalla: 120 xonadon ekvivalenti + joriy xonadon)
    const baseVillageKW = 140.0; // Boshqa xonadonlar foni
    this.ktp.currentLoadKW = (this.breakers.Q_KTP.closed ? baseVillageKW + this.house.powerKW * 4.5 : 0);

    // 3. GPP Substation Total Demand (MW)
    const cityActive = this.breakers.Q_CITY.closed ? (this.gpp.cityLoadMW + this.gpp.industrialLoadMW) : 0;
    const villageActive = this.breakers.Q_VILLAGE.closed ? (this.gpp.villageFeederMW + (this.ktp.currentLoadKW / 1000.0)) : 0;
    this.gpp.totalLoadMW = cityActive + villageActive;

    // 4. Yashil Energetika Hisoblari (SES, VET, BESS)
    // 4a. Quyosh Stansiyasi (SES)
    const isDay = this.timeOfDay >= 6.0 && this.timeOfDay <= 18.0;
    const sunAngle = isDay ? ((this.timeOfDay - 6.0) / 12.0) * Math.PI : 0;
    const effectiveRadiation = isDay ? Math.sin(sunAngle) * (1 - this.solar.cloudCoverPercent / 100.0) : 0;
    this.solar.powerMW = (this.breakers.Q_SOLAR.closed ? this.solar.nominalMW * effectiveRadiation * this.solar.inverterEfficiency : 0);

    // 4b. Shamol Stansiyasi (VET)
    const v = this.wind.windSpeed;
    let windP = 0;
    if (v >= this.wind.cutInSpeed && v <= this.wind.cutOutSpeed) {
      if (v < this.wind.ratedSpeed) {
        windP = this.wind.nominalMW * Math.pow((v - this.wind.cutInSpeed) / (this.wind.ratedSpeed - this.wind.cutInSpeed), 3);
      } else {
        windP = this.wind.nominalMW;
      }
    }
    this.wind.powerMW = this.breakers.Q_WIND.closed ? windP : 0;

    // 4c. BESS Akkumulyator Tizimi (50 MWh)
    let bessTargetP = 0;
    const netRenewableMW = this.solar.powerMW + this.wind.powerMW;
    const totalDemandMW = this.gpp.totalLoadMW;

    if (this.breakers.Q_BESS.closed) {
      if (this.bess.mode === 'auto') {
        // Avtomat rejim: Agar qayta tiklanuvchi energiya ko'p bo'lsa zaryadlaydi, kam bo'lsa zaryadsizlanadi
        if (netRenewableMW > totalDemandMW * 0.7 && this.bess.socPercent < 98) {
          bessTargetP = -Math.min(this.bess.maxPowerMW, (netRenewableMW - totalDemandMW * 0.6));
        } else if (netRenewableMW < totalDemandMW * 0.4 && this.bess.socPercent > 10) {
          bessTargetP = Math.min(this.bess.maxPowerMW, (totalDemandMW * 0.4 - netRenewableMW));
        }
      } else if (this.bess.mode === 'charge' && this.bess.socPercent < 99) {
        bessTargetP = -this.bess.maxPowerMW;
      } else if (this.bess.mode === 'discharge' && this.bess.socPercent > 5) {
        bessTargetP = this.bess.maxPowerMW;
      }

      this.bess.powerMW += (bessTargetP - this.bess.powerMW) * 0.2;

      // Update SoC (%)
      // ΔSoC = (-P_bess * dt / (capacity * 3600)) * 100
      const dSoC = (-this.bess.powerMW * (dt / 3600.0) / this.bess.capacityMWh) * 100.0 * this.simSpeed;
      this.bess.socPercent = Math.max(0, Math.min(100, this.bess.socPercent + dSoC));
    } else {
      this.bess.powerMW = 0;
    }

    // 4d. Hydroelectric Power Generation (GES)
    // Formula: P = ρ * g * Q * H * η
    const rho = 1000; // kg/m³
    const g = 9.81;   // m/s²
    const Q = this.ges.waterFlow * (this.ges.gateOpenPercent / 100.0); // m³/s
    const H = this.ges.waterHead; // m
    const eta = this.ges.efficiencyTurbine * this.ges.efficiencyGen;

    const maxP_Watts = rho * g * Q * H * eta;
    const maxP_MW = maxP_Watts / 1e6; // MVt

    // GES power output follows remaining demand
    const isGridConnected = this.breakers.Q_GEN.closed && 
                            this.breakers.Q_T1_LV.closed && 
                            this.breakers.Q_T1_HV.closed && 
                            this.breakers.Q_LEP1.closed && 
                            this.breakers.Q_LEP2.closed;

    if (isGridConnected) {
      // Required generation = Total demand + LEP loss - (SES + VET + BESS)
      const remainingDemand = Math.max(0, (this.gpp.totalLoadMW * 1.03) - (this.solar.powerMW + this.wind.powerMW + this.bess.powerMW));
      const targetGenMW = Math.min(maxP_MW, remainingDemand);
      this.ges.powerMW += (targetGenMW - this.ges.powerMW) * 0.15;
    } else {
      // Idling generation
      this.ges.powerMW += (1.5 - this.ges.powerMW) * 0.1;
    }

    // Grid Frequency Dynamics (50.00 Hz nominal)
    // Δf = (P_total_gen - P_total_load) / Inertia
    if (isGridConnected) {
      const totalGenMW = this.ges.powerMW + this.solar.powerMW + this.wind.powerMW + this.bess.powerMW;
      const imbalanceMW = totalGenMW - (this.gpp.totalLoadMW + this.lep220.lossMW);
      const targetFreq = 50.00 + (imbalanceMW / 18.0);
      this.ges.frequency += (targetFreq - this.ges.frequency) * 0.08;
    } else {
      this.ges.frequency += (50.00 - this.ges.frequency) * 0.05;
    }
    this.ges.frequency = Math.max(47.5, Math.min(52.5, this.ges.frequency));

    // 5. High Voltage Transmission & Joule-Lenz Losses
    const P_trans_MW = isGridConnected ? this.gpp.totalLoadMW : 0;
    const cosPhi = 0.93;

    if (this.lep220.isHighVoltageMode) {
      // 220 kV Transmission Mode
      const U_send = 228.0; // kV
      // I = P / (√3 * U * cosφ)
      const currentA = P_trans_MW > 0 ? (P_trans_MW * 1e6) / (Math.sqrt(3) * (U_send * 1e3) * cosPhi) : 0;
      this.lep220.current = currentA;

      // Loss: Ploss = 3 * I² * R_line
      const lossWatts = 3 * Math.pow(currentA, 2) * this.lep220.totalResistance;
      this.lep220.lossMW = lossWatts / 1e6;
      this.lep220.lossPercent = P_trans_MW > 0 ? (this.lep220.lossMW / P_trans_MW) * 100 : 0;

      // Voltage drop: ΔU = (P*R + Q*X) / U
      const Q_trans_MVAr = P_trans_MW * Math.tan(Math.acos(cosPhi));
      const deltaU_kV = (P_trans_MW * this.lep220.totalResistance + Q_trans_MVAr * this.lep220.totalReactance) / U_send;
      this.lep220.voltageDropKV = deltaU_kV;

      this.gpp.voltageInputKV = Math.max(180, U_send - deltaU_kV);
    } else {
      // Experimental LOW VOLTAGE (10.5 kV) Transmission Mode
      // User can test what happens if we sent 70 MW through 10.5 kV!
      const U_send = 10.5; // kV
      const currentA = P_trans_MW > 0 ? (P_trans_MW * 1e6) / (Math.sqrt(3) * (U_send * 1e3) * cosPhi) : 0;
      this.lep220.current = currentA;

      const lossWatts = 3 * Math.pow(currentA, 2) * this.lep220.totalResistance;
      this.lep220.lossMW = lossWatts / 1e6;
      this.lep220.lossPercent = P_trans_MW > 0 ? Math.min(100, (this.lep220.lossMW / P_trans_MW) * 100) : 0;
      this.lep220.voltageDropKV = Math.min(10.5, (P_trans_MW * this.lep220.totalResistance) / U_send);
      this.gpp.voltageInputKV = Math.max(0, U_send - this.lep220.voltageDropKV);
    }

    // 6. Substation Output Voltages
    const gppRatio = this.gpp.voltageInputKV / 220.0;
    this.gpp.voltageBus10KV = 10.5 * gppRatio;
    this.gpp.voltageBus35KV = 35.0 * gppRatio;

    // 7. KTP and House Voltage
    const ktpRatio = this.gpp.voltageBus10KV / 10.5;
    this.ktp.voltageOutputV = 400 * ktpRatio;
    this.ktp.voltagePhaseV = 230 * ktpRatio;

    // Voltage at house terminals considering street line drop
    const streetDrop = (this.house.current * 0.25); // 0.25 Ohm line drop
    this.house.voltage = isGridConnected && this.breakers.Q_KTP.closed && this.breakers.Q_HOUSE.closed 
      ? Math.max(160, Math.round((this.ktp.voltagePhaseV - streetDrop) * 10) / 10)
      : 0;

    // 8. Substation Oil Temperature
    const loadFactor = Math.min(1.5, this.gpp.totalLoadMW / 100.0);
    const targetTemp = 40 + Math.pow(loadFactor, 2) * 45;
    this.oru220.tempC += (targetTemp - this.oru220.tempC) * 0.05;
    this.oru220.fanRunning = this.oru220.tempC > 65;

    // Notify listeners
    if (typeof this.onUpdate === 'function') {
      this.onUpdate(this);
    }
  }

  // Trigger Short Circuit on Transmission Line (Demonstrates Relay Protection)
  triggerLineShortCircuit() {
    this.faults.lineShortCircuit = true;
    this.addLog("⚡ [AVARIYA: QISQA TUTASHUV] 220 kV LEPda fazalararo tutashuv yuz berdi! Tok: 8,400 A!");
    
    // Relay Protection (MTZ) trips in 0.08s
    setTimeout(() => {
      this.breakers.Q_LEP1.closed = false;
      this.breakers.Q_LEP1.trip = true;
      this.breakers.Q_LEP2.closed = false;
      this.breakers.Q_LEP2.trip = true;
      this.addLog("🛡️ [RELE HIMOYASI] 220 kV o'chirgichlar (Q-LEP1, Q-LEP2) avariyaviy uzildi!");
      this.updatePhysics();

      // APV (Avtomatik Qayta Ulash) after 2.5s
      this.faults.apvPending = true;
      this.addLog("⏳ [APV TIZIMI] Avtomatik Qayta Ulash zanjiri ishga tushdi (2.5 soniya)...");

      setTimeout(() => {
        this.faults.lineShortCircuit = false;
        this.faults.apvPending = false;
        this.breakers.Q_LEP1.closed = true;
        this.breakers.Q_LEP1.trip = false;
        this.breakers.Q_LEP2.closed = true;
        this.breakers.Q_LEP2.trip = false;
        this.addLog("✅ [APV MUVAFFAQIYATLI] Liniyada tutashuv bartaraf bo'ldi. 220 kV tarmoq qayta ulandi!");
        this.updatePhysics();
      }, 2500);
    }, 120);
  }

  // Reset House Breaker
  resetHouseBreaker() {
    this.house.mainBreakerTripped = false;
    this.faults.houseOverload = false;
    this.breakers.Q_HOUSE.closed = true;
    this.breakers.Q_HOUSE.trip = false;
    this.addLog("🔧 [XONADON] Kirish avtomati qayta yoqildi.");
    this.updatePhysics();
  }
}

window.PowerGridEngine = PowerGridEngine;
