/* ==========================================================================
   SCADA DISPATCHER TELEMETRY & BREAKER CONTROLS
   ATT-25 Smart Grid - Energetika Dispetcherlik Pulti
   ========================================================================== */

class ScadaDispatcher {
  constructor(engine) {
    this.engine = engine;
  }

  // Bind UI Elements & Event Listeners
  initUI() {
    this.renderBreakers();
    this.bindControls();
    this.updateTelemetry();
  }

  // Render Breaker Controls
  renderBreakers() {
    const listEl = document.getElementById('scadaBreakerList');
    if (!listEl) return;
    listEl.innerHTML = '';

    for (const key in this.engine.breakers) {
      const brk = this.engine.breakers[key];
      const item = document.createElement('div');
      item.className = `breaker-item ${brk.closed ? 'closed' : 'open'} ${brk.trip ? 'trip' : ''}`;
      item.innerHTML = `
        <div class="breaker-label">
          <span class="status-indicator ${brk.closed ? 'on' : 'off'}"></span>
          <span class="brk-name">${brk.name}</span>
        </div>
        <button class="btn-breaker-toggle ${brk.closed ? 'btn-red' : 'btn-green'}" data-brk="${key}">
          ${brk.closed ? "O'CHIRISH (OFF)" : "ULASH (ON)"}
        </button>
      `;

      item.querySelector('.btn-breaker-toggle').addEventListener('click', () => {
        this.engine.toggleBreaker(key);
        this.renderBreakers();
        if (window.playSwitchSound) window.playSwitchSound();
      });

      listEl.appendChild(item);
    }
  }

  // Bind Sliders and Weather Controls
  bindControls() {
    // Water Flow Slider (Dam Gate)
    const waterFlowSlider = document.getElementById('waterFlowSlider');
    const waterFlowVal = document.getElementById('waterFlowVal');
    if (waterFlowSlider && waterFlowVal) {
      waterFlowSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        this.engine.ges.gateOpenPercent = val;
        waterFlowVal.textContent = `${val}%`;
        this.engine.updatePhysics();
      });
    }

    // Time of Day Slider (0 - 24 hours)
    const timeOfDaySlider = document.getElementById('timeOfDaySlider');
    const timeOfDayVal = document.getElementById('timeOfDayVal');
    if (timeOfDaySlider && timeOfDayVal) {
      timeOfDaySlider.addEventListener('input', (e) => {
        const h = parseFloat(e.target.value);
        this.engine.timeOfDay = h;
        const hr = Math.floor(h);
        const mn = Math.floor((h - hr) * 60);
        timeOfDayVal.textContent = `${String(hr).padStart(2, '0')}:${String(mn).padStart(2, '0')}`;
        
        // Notify 3D scene about sun position
        if (window.gridScene3D) {
          window.gridScene3D.setTimeOfDay(h);
        }
      });
    }

    // Wind Speed Slider (0 - 25 m/s)
    const windSpeedSlider = document.getElementById('windSpeedSlider');
    const windSpeedVal = document.getElementById('windSpeedVal');
    if (windSpeedSlider && windSpeedVal) {
      windSpeedSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        this.engine.wind.windSpeed = val;
        windSpeedVal.textContent = `${val.toFixed(1)} m/s`;
        this.engine.updatePhysics();
      });
    }

    // Cloud Cover Slider (0 - 100%)
    const cloudCoverSlider = document.getElementById('cloudCoverSlider');
    const cloudCoverVal = document.getElementById('cloudCoverVal');
    if (cloudCoverSlider && cloudCoverVal) {
      cloudCoverSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        this.engine.solar.cloudCoverPercent = val;
        cloudCoverVal.textContent = `${val}%`;
        this.engine.updatePhysics();
      });
    }

    // BESS Mode Selector
    const bessModeSelect = document.getElementById('bessModeSelect');
    if (bessModeSelect) {
      bessModeSelect.addEventListener('change', (e) => {
        this.engine.bess.mode = e.target.value;
        this.engine.addLog(`🔋 [BESS REJIMI] Akkumulyator rejimi o'zgartirildi: ${e.target.value.toUpperCase()}`);
        this.engine.updatePhysics();
      });
    }

    // Reset Breakers Button
    const btnResetAllBreakers = document.getElementById('btnResetAllBreakers');
    if (btnResetAllBreakers) {
      btnResetAllBreakers.addEventListener('click', () => {
        for (const k in this.engine.breakers) {
          this.engine.breakers[k].closed = true;
          this.engine.breakers[k].trip = false;
        }
        this.engine.house.mainBreakerTripped = false;
        this.engine.faults.lineShortCircuit = false;
        this.engine.faults.houseOverload = false;
        this.engine.addLog("✅ [TIZIM] Barcha o'chirgichlar va himoyalar dastlabki holatga qaytarildi.");
        this.renderBreakers();
        this.engine.updatePhysics();
      });
    }
  }

  // Update SCADA Telemetry Cards
  updateTelemetry() {
    // 1. GES
    const gesPowerEl = document.getElementById('scadaGesPower');
    const gesFreqEl = document.getElementById('scadaGesFreq');
    const gesFlowEl = document.getElementById('scadaGesFlow');
    const gesVoltEl = document.getElementById('scadaGesVolt');

    if (gesPowerEl) gesPowerEl.textContent = `${this.engine.ges.powerMW.toFixed(1)} MVt`;
    if (gesFreqEl) {
      gesFreqEl.textContent = `${this.engine.ges.frequency.toFixed(2)} Hz`;
      gesFreqEl.style.color = Math.abs(this.engine.ges.frequency - 50.0) > 0.4 ? '#EF4444' : '#00FF87';
    }
    if (gesFlowEl) gesFlowEl.textContent = `${(this.engine.ges.waterFlow * (this.engine.ges.gateOpenPercent / 100)).toFixed(1)} m³/s`;
    if (gesVoltEl) gesVoltEl.textContent = `${this.engine.ges.nominalVoltage.toFixed(1)} kV`;

    // 2. 220 kV LEP
    const lepVoltEl = document.getElementById('scadaLepVolt');
    const lepCurrentEl = document.getElementById('scadaLepCurrent');
    const lepLossEl = document.getElementById('scadaLepLoss');
    const lepLossPctEl = document.getElementById('scadaLepLossPct');

    if (lepVoltEl) lepVoltEl.textContent = `${(this.engine.lep220.isHighVoltageMode ? 228.0 : 10.5).toFixed(1)} kV`;
    if (lepCurrentEl) lepCurrentEl.textContent = `${this.engine.lep220.current.toFixed(1)} A`;
    if (lepLossEl) lepLossEl.textContent = `${this.engine.lep220.lossMW.toFixed(2)} MVt`;
    if (lepLossPctEl) {
      lepLossPctEl.textContent = `${this.engine.lep220.lossPercent.toFixed(1)}%`;
      lepLossPctEl.style.color = this.engine.lep220.lossPercent > 10 ? '#EF4444' : '#38BDF8';
    }

    // 3. GPP Substation
    const gppInputEl = document.getElementById('scadaGppInput');
    const gppCityEl = document.getElementById('scadaGppCity');
    const gppVilEl = document.getElementById('scadaGppVil');
    const gppTotalEl = document.getElementById('scadaGppTotal');

    if (gppInputEl) gppInputEl.textContent = `${this.engine.gpp.voltageInputKV.toFixed(1)} kV`;
    if (gppCityEl) gppCityEl.textContent = `${(this.engine.gpp.cityLoadMW + this.engine.gpp.industrialLoadMW).toFixed(1)} MVt`;
    if (gppVilEl) gppVilEl.textContent = `${this.engine.gpp.villageFeederMW.toFixed(1)} MVt`;
    if (gppTotalEl) gppTotalEl.textContent = `${this.engine.gpp.totalLoadMW.toFixed(1)} MVt`;

    // 4. KTP Mahalla
    const ktpInEl = document.getElementById('scadaKtpIn');
    const ktpOutEl = document.getElementById('scadaKtpOut');
    const ktpLoadEl = document.getElementById('scadaKtpLoad');

    if (ktpInEl) ktpInEl.textContent = `${this.engine.ktp.voltageInputKV.toFixed(1)} kV`;
    if (ktpOutEl) ktpOutEl.textContent = `${this.engine.ktp.voltagePhaseV.toFixed(1)} V`;
    if (ktpLoadEl) ktpLoadEl.textContent = `${this.engine.ktp.currentLoadKW.toFixed(0)} kVt`;

    // 5. Yashil Energetika (SES, VET, BESS)
    const solarPowerEl = document.getElementById('scadaSolarPower');
    const windPowerEl = document.getElementById('scadaWindPower');
    const bessPowerEl = document.getElementById('scadaBessPower');
    const bessSocEl = document.getElementById('scadaBessSoc');

    if (solarPowerEl) solarPowerEl.textContent = `${this.engine.solar.powerMW.toFixed(1)} MVt`;
    if (windPowerEl) windPowerEl.textContent = `${this.engine.wind.powerMW.toFixed(1)} MVt`;
    if (bessPowerEl) {
      const p = this.engine.bess.powerMW;
      bessPowerEl.textContent = `${p >= 0 ? '+' : ''}${p.toFixed(1)} MVt`;
      bessPowerEl.style.color = p > 0.5 ? '#00FF87' : (p < -0.5 ? '#38BDF8' : '#94A3B8');
    }
    if (bessSocEl) {
      bessSocEl.textContent = `${this.engine.bess.socPercent.toFixed(1)}%`;
      bessSocEl.style.color = this.engine.bess.socPercent < 20 ? '#EF4444' : '#FBBF24';
    }

    // 5. Update Log Box
    const logBox = document.getElementById('scadaAlarmLog');
    if (logBox && this.engine.alarms.length > 0) {
      logBox.innerHTML = this.engine.alarms.map(a => `
        <div class="log-entry">
          <span class="log-time">[${a.time}]</span>
          <span class="log-text">${a.text}</span>
        </div>
      `).join('');
    }
  }
}

window.ScadaDispatcher = ScadaDispatcher;
