/* ==========================================================================
   LIVE CIRCUIT CONTROLS & AMBIENT LIGHT (KUN / TUN) CONTROLLER
   ATT-25 Circuit Lab - Real-Time Interactive Component Controls & Environment
   ========================================================================== */

class LiveCircuitControls {
  constructor(app) {
    this.app = app;
    this.engine = app.engine;
    this.ambientLight = 0.8; // Default: 80% daylight
    this.isNight = false;
    this.hudContainer = document.getElementById('liveControlsHud');
    this.ambientSlider = document.getElementById('ambientLightSlider');
    this.btnDay = document.getElementById('btnAmbientDay');
    this.btnNight = document.getElementById('btnAmbientNight');
    this.ambientValText = document.getElementById('ambientValText');

    this.bindEvents();
    this.updateAmbientUI();
  }

  bindEvents() {
    // 1. Day / Night Toggle Buttons
    if (this.btnDay) {
      this.btnDay.addEventListener('click', () => {
        this.setAmbientLight(1.0);
        if (this.app.toast) this.app.toast("☀️ Kunduzgi yorug'lik yoqildi (100%)");
      });
    }

    if (this.btnNight) {
      this.btnNight.addEventListener('click', () => {
        this.setAmbientLight(0.0);
        if (this.app.toast) this.app.toast("🌙 Tungi qorong'ulik yoqildi (0%) — Tungi chiroq yonadi!");
      });
    }

    // 2. Ambient Light Slider
    if (this.ambientSlider) {
      this.ambientSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        this.setAmbientLight(val, false);
      });
    }

    // 3. Listen to circuit updates
    const origAddComponent = this.app.addComponent;
    if (origAddComponent) {
      this.app.addComponent = (...args) => {
        const comp = origAddComponent.apply(this.app, args);
        if (comp && comp.type === 'ldr') {
          comp.lightLevel = this.ambientLight;
        }
        this.renderHud();
        return comp;
      };
    }

    const origClearCircuit = this.app.clearCircuit;
    if (origClearCircuit) {
      this.app.clearCircuit = (...args) => {
        origClearCircuit.apply(this.app, args);
        this.renderHud();
      };
    }

    // Periodically update dynamic HUD values (e.g. LDR resistance, motor RPM)
    setInterval(() => {
      this.updateHudMetrics();
    }, 250);
  }

  setAmbientLight(val, updateSlider = true) {
    this.ambientLight = Math.max(0, Math.min(1, val));
    this.isNight = this.ambientLight < 0.3;

    if (updateSlider && this.ambientSlider) {
      this.ambientSlider.value = this.ambientLight;
    }

    // Update all LDR components in the engine
    if (this.engine && this.engine.components) {
      this.engine.components.forEach(comp => {
        if (comp.type === 'ldr') {
          comp.lightLevel = this.ambientLight;
        }
      });
    }

    this.updateAmbientUI();
    this.renderHud();

    // Visual atmospheric effect on canvas
    const canvas = document.getElementById('circuitCanvas');
    if (canvas) {
      if (this.ambientLight <= 0.15) {
        canvas.style.filter = 'brightness(0.75) contrast(1.1)';
      } else if (this.ambientLight >= 0.85) {
        canvas.style.filter = 'brightness(1.05)';
      } else {
        canvas.style.filter = 'brightness(0.9)';
      }
    }

    // Sync 3D Breadboard if active
    if (this.app.breadboard3d && (this.app.mode === 'breadboard' || this.app.mode === 'split')) {
      this.app.breadboard3d.syncFromEngine();
    }
  }

  updateAmbientUI() {
    const pct = Math.round(this.ambientLight * 100);
    if (this.ambientValText) {
      this.ambientValText.textContent = `${pct}%`;
    }

    if (this.btnDay && this.btnNight) {
      this.btnDay.classList.toggle('active', this.ambientLight >= 0.6);
      this.btnNight.classList.toggle('active', this.ambientLight <= 0.2);
    }
  }

  // Scan components and render interactive Live Controls HUD
  renderHud() {
    if (!this.hudContainer) return;

    const components = this.engine ? this.engine.components : [];
    const interactiveComps = components.filter(c =>
      ['switch', 'ldr', 'potentiometer', 'motor', 'capacitor', 'arduino_uno'].includes(c.type)
    );

    if (interactiveComps.length === 0) {
      this.hudContainer.classList.remove('has-items');
      this.hudContainer.innerHTML = '';
      return;
    }

    this.hudContainer.classList.add('has-items');

    let html = `
      <div class="hud-header">
        <div class="hud-title">
          <span class="hud-icon">🎮</span>
          <span>Jonli Boshqaruv Paneli</span>
        </div>
        <button class="hud-toggle-btn" id="btnToggleHud" title="Yig'ish / Yoyish">▾</button>
      </div>
      <div class="hud-body" id="hudBody">
    `;

    // 1. Day / Night quick control if LDR exists
    const hasLdr = interactiveComps.some(c => c.type === 'ldr');
    if (hasLdr) {
      const pct = Math.round(this.ambientLight * 100);
      html += `
        <div class="hud-item hud-ambient-box">
          <div class="hud-item-header">
            <span class="hud-item-label">☀️ Atrofdagi Yorug'lik (Kun/Tun)</span>
            <span class="hud-val-tag" id="hudAmbientTag">${pct}% ${pct < 30 ? '🌙 Qorong\'i' : '☀️ Yorug\''}</span>
          </div>
          <div class="hud-ambient-actions">
            <button class="hud-btn-day ${this.ambientLight >= 0.6 ? 'active' : ''}" id="hudBtnDay">☀️ Kun (100%)</button>
            <button class="hud-btn-night ${this.ambientLight <= 0.2 ? 'active' : ''}" id="hudBtnNight">🌙 Tun (0%)</button>
          </div>
          <input type="range" class="hud-slider" id="hudAmbientSlider" min="0" max="1" step="0.05" value="${this.ambientLight}">
        </div>
      `;
    }

    // 2. Render controls for each interactive component
    interactiveComps.forEach((comp, idx) => {
      if (comp.type === 'switch') {
        const isClosed = !comp.isOpen;
        html += `
          <div class="hud-item" data-comp-id="${comp.id}">
            <div class="hud-item-header">
              <span class="hud-item-label">🔘 ${comp.name || 'Kalit #' + (idx + 1)}</span>
              <span class="hud-status-badge ${isClosed ? 'status-on' : 'status-off'}">${isClosed ? 'Yopiq (ON)' : 'Ochiq (OFF)'}</span>
            </div>
            <button class="hud-action-btn ${isClosed ? 'btn-active' : ''}" data-action="toggle-switch" data-comp-id="${comp.id}">
              ${isClosed ? '🔓 Kalitni Ochish (O\'chirish)' : '🔒 Kalitni Yopish (Yoqish)'}
            </button>
          </div>
        `;
      } else if (comp.type === 'potentiometer') {
        const pct = Math.round((comp.ratio || 0.5) * 100);
        const rVal = Math.round(comp.getResistance ? comp.getResistance() : 5000);
        html += `
          <div class="hud-item" data-comp-id="${comp.id}">
            <div class="hud-item-header">
              <span class="hud-item-label">🎛️ ${comp.name || 'Potensiometr'}</span>
              <span class="hud-val-tag" id="potVal_${comp.id}">${pct}% (${rVal} Ω)</span>
            </div>
            <input type="range" class="hud-slider" data-action="slide-pot" data-comp-id="${comp.id}" min="0.01" max="0.99" step="0.01" value="${comp.ratio || 0.5}">
          </div>
        `;
      } else if (comp.type === 'motor') {
        const rpm = Math.round(Math.abs(comp.speed || 0));
        html += `
          <div class="hud-item" data-comp-id="${comp.id}">
            <div class="hud-item-header">
              <span class="hud-item-label">🌀 DC Dvigatel</span>
              <span class="hud-val-tag" style="color:var(--gold);" id="motorVal_${comp.id}">${rpm} RPM</span>
            </div>
            <div class="hud-meter-bar">
              <div class="hud-meter-fill" id="motorFill_${comp.id}" style="width:${Math.min(100, rpm / 25)}%;"></div>
            </div>
          </div>
        `;
      } else if (comp.type === 'capacitor') {
        const vCap = (comp.chargeVoltage || 0).toFixed(2);
        html += `
          <div class="hud-item" data-comp-id="${comp.id}">
            <div class="hud-item-header">
              <span class="hud-item-label">🔋 Kondensator (100 µF)</span>
              <span class="hud-val-tag" id="capVal_${comp.id}">${vCap} V</span>
            </div>
            <button class="hud-action-btn" data-action="discharge-cap" data-comp-id="${comp.id}">
              ⚡ Zaryadsizlantirish
            </button>
          </div>
        `;
      } else if (comp.type === 'arduino_uno') {
        html += `
          <div class="hud-item" data-comp-id="${comp.id}">
            <div class="hud-item-header">
              <span class="hud-item-label">🤖 Arduino Uno R3</span>
              <span class="hud-status-badge ${comp.isRunning ? 'status-on' : 'status-off'}">${comp.isRunning ? '🟢 Ishlamoqda' : '⏹ To\'xtatilgan'}</span>
            </div>
            <div style="display:flex; gap:6px; margin-top:6px;">
              <button class="hud-action-btn" data-action="run-arduino" data-comp-id="${comp.id}" style="flex:1; background:linear-gradient(135deg,#00878F,#00FF87); color:#020617; font-weight:bold;">
                ▶ Run
              </button>
              <button class="hud-action-btn" data-action="stop-arduino" data-comp-id="${comp.id}" style="flex:1; color:var(--danger); border-color:var(--danger);">
                ⏹ Stop
              </button>
            </div>
          </div>
        `;
      }
    });

    html += `</div>`;
    this.hudContainer.innerHTML = html;

    // Bind dynamic HUD events
    this.bindHudEvents();
  }

  bindHudEvents() {
    // Toggle HUD minimize/expand
    const btnToggle = document.getElementById('btnToggleHud');
    const hudBody = document.getElementById('hudBody');
    if (btnToggle && hudBody) {
      btnToggle.addEventListener('click', () => {
        hudBody.classList.toggle('collapsed');
        btnToggle.textContent = hudBody.classList.contains('collapsed') ? '▴' : '▾';
      });
    }

    // HUD Day / Night buttons
    const hudBtnDay = document.getElementById('hudBtnDay');
    const hudBtnNight = document.getElementById('hudBtnNight');
    const hudSlider = document.getElementById('hudAmbientSlider');

    if (hudBtnDay) {
      hudBtnDay.addEventListener('click', () => this.setAmbientLight(1.0));
    }
    if (hudBtnNight) {
      hudBtnNight.addEventListener('click', () => this.setAmbientLight(0.0));
    }
    if (hudSlider) {
      hudSlider.addEventListener('input', (e) => {
        this.setAmbientLight(parseFloat(e.target.value), false);
      });
    }

    // Switch toggles
    this.hudContainer.querySelectorAll('[data-action="toggle-switch"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const compId = btn.dataset.compId;
        const comp = this.engine.components.find(c => c.id === compId);
        if (comp && comp.toggle) {
          comp.toggle();
          if (this.app.playSwitchSound) this.app.playSwitchSound();
          if (this.app.toast) {
            this.app.toast(comp.isOpen ? "🔓 Kalit ochildi (o'chirildi)" : "🔒 Kalit yopildi (yoqildi)");
          }
          if (this.app.breadboard3d && (this.app.mode === 'breadboard' || this.app.mode === 'split')) {
            this.app.breadboard3d.syncFromEngine();
          }
          this.renderHud();
        }
      });
    });

    // Potentiometer sliders
    this.hudContainer.querySelectorAll('[data-action="slide-pot"]').forEach(slider => {
      slider.addEventListener('input', (e) => {
        const compId = slider.dataset.compId;
        const comp = this.engine.components.find(c => c.id === compId);
        if (comp) {
          comp.ratio = parseFloat(e.target.value);
          const tag = document.getElementById(`potVal_${comp.id}`);
          if (tag) {
            const pct = Math.round(comp.ratio * 100);
            const rVal = Math.round(comp.getResistance ? comp.getResistance() : 5000);
            tag.textContent = `${pct}% (${rVal} Ω)`;
          }
        }
      });
    });

    // Capacitor discharge
    this.hudContainer.querySelectorAll('[data-action="discharge-cap"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const compId = btn.dataset.compId;
        const comp = this.engine.components.find(c => c.id === compId);
        if (comp) {
          comp.chargeVoltage = 0;
          if (this.app.toast) this.app.toast("⚡ Kondensator zaryadsizlantirildi");
          this.updateHudMetrics();
        }
      });
    });

    // Arduino Run / Stop
    this.hudContainer.querySelectorAll('[data-action="run-arduino"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const compId = btn.dataset.compId;
        const comp = this.engine.components.find(c => c.id === compId);
        if (comp && comp.vm) {
          comp.vm.run(comp.code);
          if (this.app.toast) this.app.toast("Arduino dasturi ishga tushirildi!");
          this.renderHud();
        }
      });
    });

    this.hudContainer.querySelectorAll('[data-action="stop-arduino"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const compId = btn.dataset.compId;
        const comp = this.engine.components.find(c => c.id === compId);
        if (comp && comp.vm) {
          comp.vm.stop();
          if (this.app.toast) this.app.toast("Arduino to'xtatildi");
          this.renderHud();
        }
      });
    });
  }

  // Update dynamic values in HUD in real-time
  updateHudMetrics() {
    if (!this.hudContainer || !this.hudContainer.classList.contains('has-items')) return;

    this.engine.components.forEach(comp => {
      if (comp.type === 'motor') {
        const tag = document.getElementById(`motorVal_${comp.id}`);
        const fill = document.getElementById(`motorFill_${comp.id}`);
        const rpm = Math.round(Math.abs(comp.speed || 0));
        if (tag) tag.textContent = `${rpm} RPM`;
        if (fill) fill.style.width = `${Math.min(100, rpm / 25)}%`;
      } else if (comp.type === 'capacitor') {
        const tag = document.getElementById(`capVal_${comp.id}`);
        if (tag) tag.textContent = `${(comp.chargeVoltage || 0).toFixed(2)} V`;
      } else if (comp.type === 'ldr') {
        const tag = document.getElementById('hudAmbientTag');
        if (tag) {
          const pct = Math.round(this.ambientLight * 100);
          const rVal = comp.getResistance ? comp.getResistance() : 1000;
          const rStr = rVal >= 1000 ? (rVal / 1000).toFixed(1) + ' kΩ' : rVal + ' Ω';
          tag.textContent = `${pct}% (R = ${rStr})`;
        }
      }
    });
  }
}

window.LiveCircuitControls = LiveCircuitControls;
