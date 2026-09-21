/* ==========================================================================
   RESIDENTIAL ELECTRICAL NETWORK & SMART METER SIMULATOR
   ATT-25 Smart Grid - Xonadon Ichki Elektr Tarmog'i va Smart Hisoblagich
   ========================================================================== */

class HouseSimulator {
  constructor(engine) {
    this.engine = engine;
    this.impulseCount = 0;
    this.meterBlinkState = false;
    this.lastBlinkTime = performance.now();
  }

  // Render Appliance Cards inside House View Modal / Drawer
  renderApplianceControls(containerEl) {
    if (!containerEl) return;
    containerEl.innerHTML = '';

    const apps = this.engine.house.appliances;
    for (const key in apps) {
      const app = apps[key];
      const card = document.createElement('div');
      card.className = `appliance-card ${app.on ? 'active' : ''}`;
      card.innerHTML = `
        <div class="app-icon">${app.icon}</div>
        <div class="app-info">
          <div class="app-name">${app.name}</div>
          <div class="app-power">${app.powerW} Vt • cos φ ${app.cosPhi}</div>
        </div>
        <button class="app-toggle-btn ${app.on ? 'btn-on' : 'btn-off'}" data-app="${key}">
          ${app.on ? 'YONIQ' : "O'CHIQ"}
        </button>
      `;

      card.querySelector('.app-toggle-btn').addEventListener('click', () => {
        this.engine.toggleAppliance(key);
        this.renderApplianceControls(containerEl);
        this.updateMeterDisplay();
      });

      containerEl.appendChild(card);
    }
  }

  // Update Smart Meter LCD and Breaker states
  updateMeterDisplay() {
    const vEl = document.getElementById('meterVoltage');
    const iEl = document.getElementById('meterCurrent');
    const pEl = document.getElementById('meterPower');
    const eEl = document.getElementById('meterEnergy');
    const ledEl = document.getElementById('meterLedImpulse');
    const breakerEl = document.getElementById('houseBreakerStatus');
    const breakerLever = document.getElementById('houseBreakerLever');

    if (vEl) vEl.textContent = `${this.engine.house.voltage.toFixed(1)} V`;
    if (iEl) iEl.textContent = `${this.engine.house.current.toFixed(2)} A`;
    if (pEl) pEl.textContent = `${this.engine.house.powerKW.toFixed(2)} kVt`;
    if (eEl) eEl.textContent = `${this.engine.house.energyKWh.toFixed(3)} kVt*s`;

    // Breaker status
    const isTripped = this.engine.house.mainBreakerTripped || !this.engine.breakers.Q_HOUSE.closed;
    if (breakerEl) {
      breakerEl.textContent = isTripped ? "UZILGAN (TRIP)" : "ULANGAN (ON)";
      breakerEl.style.color = isTripped ? "#EF4444" : "#00FF87";
    }
    if (breakerLever) {
      breakerLever.classList.toggle('tripped', isTripped);
    }

    // Pulse Smart Meter LED (1600 imp / kWh)
    const now = performance.now();
    const currentKW = this.engine.house.powerKW;
    if (currentKW > 0) {
      // Milliseconds per impulse: (3600 / (1600 * currentKW)) * 1000
      const msPerImpulse = Math.max(120, (2250 / currentKW));
      if (now - this.lastBlinkTime > msPerImpulse) {
        this.lastBlinkTime = now;
        if (ledEl) {
          ledEl.classList.add('pulse');
          setTimeout(() => ledEl.classList.remove('pulse'), 60);
        }
      }
    }
  }
}

window.HouseSimulator = HouseSimulator;
