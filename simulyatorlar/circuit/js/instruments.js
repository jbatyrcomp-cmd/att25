/* ==========================================================================
   VIRTUAL INSTRUMENTS (DIGITAL MULTIMETER & 2-CHANNEL OSCILLOSCOPE)
   ATT-25 Circuit Lab Measurement Tools
   ========================================================================== */

class DigitalMultimeter {
  constructor(engine) {
    this.engine = engine;
    this.mode = 'voltage'; // 'voltage', 'current', 'resistance', 'continuity'
    this.redProbe = { x: 300, y: 150, connectedPin: null };
    this.blackProbe = { x: 350, y: 150, connectedPin: null };
    this.displayVal = '0.00';
    this.displayUnit = 'V';
  }

  update() {
    let vRed = 0, vBlack = 0;
    if (this.redProbe.connectedPin) {
      vRed = this.redProbe.connectedPin.voltage || 0;
    }
    if (this.blackProbe.connectedPin) {
      vBlack = this.blackProbe.connectedPin.voltage || 0;
    }

    if (this.mode === 'voltage') {
      const vDiff = vRed - vBlack;
      this.displayVal = Math.abs(vDiff) < 0.001 ? '0.00' : vDiff.toFixed(2);
      this.displayUnit = 'V DC';
    } else if (this.mode === 'current') {
      // If connected to a component's pins
      let current = 0;
      if (this.redProbe.connectedPin && this.blackProbe.connectedPin) {
        const { comp: c1 } = this.engine.getPinById(this.redProbe.connectedPin.id) || {};
        const { comp: c2 } = this.engine.getPinById(this.blackProbe.connectedPin.id) || {};
        if (c1 && c1 === c2) {
          current = Math.abs(c1.current || 0);
        }
      }
      if (current < 1.0) {
        this.displayVal = (current * 1000).toFixed(1);
        this.displayUnit = 'mA';
      } else {
        this.displayVal = current.toFixed(3);
        this.displayUnit = 'A';
      }
    } else if (this.mode === 'resistance') {
      let r = 0;
      if (this.redProbe.connectedPin && this.blackProbe.connectedPin) {
        const { comp: c1 } = this.engine.getPinById(this.redProbe.connectedPin.id) || {};
        const { comp: c2 } = this.engine.getPinById(this.blackProbe.connectedPin.id) || {};
        if (c1 && c1 === c2) {
          r = c1.resistance || 0;
        }
      }
      if (r >= 1000000) {
        this.displayVal = (r / 1000000).toFixed(2);
        this.displayUnit = 'MΩ';
      } else if (r >= 1000) {
        this.displayVal = (r / 1000).toFixed(2);
        this.displayUnit = 'kΩ';
      } else {
        this.displayVal = r.toFixed(1);
        this.displayUnit = 'Ω';
      }
    } else if (this.mode === 'continuity') {
      let isContinuous = false;
      let r = 999999;
      if (this.redProbe.connectedPin && this.blackProbe.connectedPin) {
        const nRed = this.engine.nodeMap.get(this.redProbe.connectedPin.id);
        const nBlack = this.engine.nodeMap.get(this.blackProbe.connectedPin.id);
        if (nRed && nBlack && nRed === nBlack) {
          isContinuous = true;
          r = 0.1;
        } else {
          const { comp: c1 } = this.engine.getPinById(this.redProbe.connectedPin.id) || {};
          const { comp: c2 } = this.engine.getPinById(this.blackProbe.connectedPin.id) || {};
          if (c1 && c1 === c2 && (c1.resistance || 0) < 30) {
            isContinuous = true;
            r = c1.resistance || 0;
          }
        }
      }
      if (isContinuous) {
        this.displayVal = r.toFixed(1);
        this.displayUnit = 'Ω 🔊 BEEP';
        if (window.playContinuityBeep) window.playContinuityBeep();
      } else {
        this.displayVal = 'O.L';
        this.displayUnit = 'OPEN';
      }
    }
  }

  drawProbes(ctx) {
    // Draw Red Probe
    this.drawSingleProbe(ctx, this.redProbe.x, this.redProbe.y, '#EF4444', '+');
    // Draw Black Probe
    this.drawSingleProbe(ctx, this.blackProbe.x, this.blackProbe.y, '#1E293B', '-');
  }

  drawSingleProbe(ctx, x, y, color, label) {
    ctx.save();
    ctx.translate(x, y);

    // Needle tip
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 0); ctx.lineTo(0, 12);
    ctx.stroke();

    // Body handle
    ctx.fillStyle = color;
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(-5, 12, 10, 36, 3);
    ctx.fill(); ctx.stroke();

    // Label
    ctx.fillStyle = '#FFF';
    ctx.font = 'bold 10px JetBrains Mono';
    ctx.textAlign = 'center';
    ctx.fillText(label, 0, 26);

    ctx.restore();
  }
}

class VirtualOscilloscope {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.buffer = [];
    this.maxSamples = 200;
    this.voltsPerDiv = 2.0; // 2V per grid division
    this.timeBase = 1.0;
  }

  pushSample(val) {
    this.buffer.push(val);
    if (this.buffer.length > this.maxSamples) {
      this.buffer.shift();
    }
    this.render();
  }

  render() {
    if (!this.ctx || !this.canvas) return;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const ctx = this.ctx;

    ctx.fillStyle = '#061019';
    ctx.fillRect(0, 0, w, h);

    // Grid lines (green phosphor style)
    ctx.strokeStyle = 'rgba(0, 255, 135, 0.12)';
    ctx.lineWidth = 1;
    const gridSize = 25;

    for (let x = 0; x < w; x += gridSize) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y < h; y += gridSize) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    // Center axes
    ctx.strokeStyle = 'rgba(0, 255, 135, 0.25)';
    ctx.beginPath();
    ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2);
    ctx.moveTo(w / 2, 0); ctx.lineTo(w / 2, h);
    ctx.stroke();

    // Draw waveform
    if (this.buffer.length < 2) return;

    ctx.strokeStyle = '#00FF87';
    ctx.lineWidth = 2;
    ctx.shadowColor = 'rgba(0, 255, 135, 0.8)';
    ctx.shadowBlur = 6;
    ctx.beginPath();

    const stepX = w / this.maxSamples;
    const midY = h / 2;
    const scaleY = gridSize / this.voltsPerDiv;

    for (let i = 0; i < this.buffer.length; i++) {
      const px = i * stepX;
      const py = midY - this.buffer[i] * scaleY;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
  }
}

/* ==========================================================================
   FUNCTION GENERATOR — Virtual Signal Manba (Multisim FG kabi)
   Sin / Kvadrat / Uchburchak / Tishli (Sawtooth) to'lqinlar
   ========================================================================== */
class FunctionGenerator {
  constructor() {
    this.waveform = 'sine';     // 'sine'|'square'|'triangle'|'sawtooth'
    this.frequency = 1000;       // Hz
    this.amplitude = 5.0;        // V (peak)
    this.dcOffset = 0;           // V (DC offset)
    this.phase = 0;              // degrees
    this.enabled = false;
    this._time = 0;
    // UI state
    this.panelEl = null;
  }

  /**
   * Berilgan vaqtda chiqish kuchlanishini qaytarish
   * @param {number} t - Vaqt (soniya)
   * @returns {number} - Kuchlanish (V)
   */
  getVoltage(t) {
    if (!this.enabled) return this.dcOffset;
    const T = 1 / (this.frequency || 1);
    const phi = (this.phase * Math.PI) / 180;
    const tNorm = ((t % T) + T) % T; // [0, T)
    const x = tNorm / T; // [0, 1)
    const A = this.amplitude;
    let v = 0;

    switch (this.waveform) {
      case 'sine':
        v = A * Math.sin(2 * Math.PI * x + phi);
        break;
      case 'square':
        v = A * (Math.sin(2 * Math.PI * x + phi) >= 0 ? 1 : -1);
        break;
      case 'triangle':
        v = A * (2 * Math.abs(2 * (x - Math.floor(x + 0.5))) - 1);
        break;
      case 'sawtooth':
        v = A * (2 * (x - Math.floor(x + 0.5)));
        break;
      default:
        v = 0;
    }
    return v + this.dcOffset;
  }

  /**
   * Har bir frame da vaqtni yangilash (dt soniyada)
   */
  tick(dt) {
    this._time += dt;
    return this.getVoltage(this._time);
  }

  /**
   * Function Generator panelini render qilish
   */
  renderPanel(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const waveIcons = {
      sine: '〜', square: '⊓', triangle: '∧', sawtooth: '╱'
    };

    container.innerHTML = `
      <div class="fg-panel" id="fgPanel">
        <div class="fg-header">
          <span class="fg-title">
            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" stroke-width="2.5">
              <path d="M2 12h4l2-5 4 10 4-5h6"/>
            </svg>
            FUNKSIYA GENERATORI
          </span>
          <label class="fg-toggle">
            <input type="checkbox" id="fgEnableToggle" ${this.enabled ? 'checked' : ''}>
            <span class="fg-toggle-label">${this.enabled ? '🟢 FAOL' : '⚫ NOFAOL'}</span>
          </label>
        </div>

        <div class="fg-display">
          <div class="fg-display-val" id="fgDisplayVal">${this.getVoltage(this._time).toFixed(2)}</div>
          <div class="fg-display-unit">V</div>
        </div>

        <div class="fg-waveform-row">
          ${['sine', 'square', 'triangle', 'sawtooth'].map(w => `
            <button class="fg-wave-btn ${this.waveform === w ? 'active' : ''}" data-wave="${w}" title="${w}">
              ${waveIcons[w]}
            </button>
          `).join('')}
        </div>

        <div class="fg-params">
          <div class="fg-param-row">
            <label>Chastota (Hz)</label>
            <input type="range" id="fgFreqSlider" min="1" max="100000" step="1" value="${this.frequency}" class="fg-slider">
            <input type="number" id="fgFreqInput" value="${this.frequency}" min="0.1" max="1000000" step="1" class="fg-num-input">
          </div>
          <div class="fg-param-row">
            <label>Amplituda (V)</label>
            <input type="range" id="fgAmpSlider" min="0.1" max="20" step="0.1" value="${this.amplitude}" class="fg-slider">
            <input type="number" id="fgAmpInput" value="${this.amplitude}" min="0" max="50" step="0.1" class="fg-num-input">
          </div>
          <div class="fg-param-row">
            <label>DC Offset (V)</label>
            <input type="range" id="fgOffsetSlider" min="-20" max="20" step="0.1" value="${this.dcOffset}" class="fg-slider">
            <input type="number" id="fgOffsetInput" value="${this.dcOffset}" min="-50" max="50" step="0.1" class="fg-num-input">
          </div>
          <div class="fg-param-row">
            <label>Faza (°)</label>
            <input type="range" id="fgPhaseSlider" min="0" max="360" step="1" value="${this.phase}" class="fg-slider">
            <input type="number" id="fgPhaseInput" value="${this.phase}" min="0" max="360" step="1" class="fg-num-input">
          </div>
        </div>

        <canvas id="fgPreviewCanvas" width="340" height="80" class="fg-preview"></canvas>

        <div class="fg-info">
          <span>T = ${(1000 / this.frequency).toFixed(2)} ms</span>
          <span>Vpp = ${(2 * this.amplitude).toFixed(1)} V</span>
          <span>Vrms = ${(this.waveform === 'sine' ? this.amplitude / Math.SQRT2 : this.amplitude).toFixed(2)} V</span>
        </div>
      </div>
    `;

    this.panelEl = container.querySelector('#fgPanel');
    this._bindPanelEvents();
    this._drawPreview();
  }

  _bindPanelEvents() {
    const panel = this.panelEl;
    if (!panel) return;

    // Enable toggle
    panel.querySelector('#fgEnableToggle')?.addEventListener('change', (e) => {
      this.enabled = e.target.checked;
      const label = panel.querySelector('.fg-toggle-label');
      if (label) label.textContent = this.enabled ? '🟢 FAOL' : '⚫ NOFAOL';
    });

    // Waveform buttons
    panel.querySelectorAll('.fg-wave-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.waveform = btn.dataset.wave;
        panel.querySelectorAll('.fg-wave-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this._updateInfo();
        this._drawPreview();
      });
    });

    // Slider + number input pairs
    const pairs = [
      ['fgFreqSlider', 'fgFreqInput', 'frequency', 0.1, 1e6],
      ['fgAmpSlider', 'fgAmpInput', 'amplitude', 0, 50],
      ['fgOffsetSlider', 'fgOffsetInput', 'dcOffset', -50, 50],
      ['fgPhaseSlider', 'fgPhaseInput', 'phase', 0, 360]
    ];

    for (const [sliderId, inputId, prop, min, max] of pairs) {
      const slider = panel.querySelector(`#${sliderId}`);
      const numInput = panel.querySelector(`#${inputId}`);
      if (!slider || !numInput) continue;

      slider.addEventListener('input', (e) => {
        const v = Math.max(min, Math.min(max, parseFloat(e.target.value)));
        this[prop] = v;
        numInput.value = v;
        this._updateInfo();
        this._drawPreview();
      });

      numInput.addEventListener('input', (e) => {
        const v = Math.max(min, Math.min(max, parseFloat(e.target.value) || 0));
        this[prop] = v;
        slider.value = Math.min(parseFloat(slider.max), v);
        this._updateInfo();
        this._drawPreview();
      });
    }
  }

  _updateInfo() {
    if (!this.panelEl) return;
    const infoEl = this.panelEl.querySelector('.fg-info');
    if (infoEl) {
      infoEl.innerHTML = `
        <span>T = ${(1000 / this.frequency).toFixed(2)} ms</span>
        <span>Vpp = ${(2 * this.amplitude).toFixed(1)} V</span>
        <span>Vrms = ${(this.waveform === 'sine' ? this.amplitude / Math.SQRT2 : this.amplitude).toFixed(2)} V</span>
      `;
    }
  }

  _drawPreview() {
    const canvas = this.panelEl ? this.panelEl.querySelector('#fgPreviewCanvas') : null;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;

    ctx.fillStyle = '#060E1A';
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = 'rgba(56,189,248,0.12)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(0, H / 2); ctx.lineTo(W, H / 2);
    ctx.moveTo(W / 4, 0); ctx.lineTo(W / 4, H);
    ctx.moveTo(W / 2, 0); ctx.lineTo(W / 2, H);
    ctx.moveTo(3 * W / 4, 0); ctx.lineTo(3 * W / 4, H);
    ctx.stroke();

    // Waveform (2 tam zikl)
    const cycles = 2;
    const T = 1 / Math.max(this.frequency, 0.001);
    const totalTime = T * cycles;
    const A = this.amplitude;
    const offset = this.dcOffset;
    const maxV = A + Math.abs(offset) + 0.5;

    ctx.strokeStyle = '#00FF87';
    ctx.lineWidth = 2;
    ctx.shadowColor = 'rgba(0,255,135,0.5)';
    ctx.shadowBlur = 4;
    ctx.beginPath();
    for (let px = 0; px < W; px++) {
      const t = (px / W) * totalTime;
      const v = this.getVoltage(t);
      const y = H / 2 - (v / maxV) * (H / 2 - 6);
      if (px === 0) ctx.moveTo(px, y); else ctx.lineTo(px, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Label
    ctx.fillStyle = '#38BDF8';
    ctx.font = '9px JetBrains Mono';
    ctx.textAlign = 'left';
    ctx.fillText(`${this.frequency >= 1000 ? (this.frequency / 1000).toFixed(1) + 'kHz' : this.frequency + 'Hz'} | ${this.waveform}`, 6, 12);
  }

  /**
   * Animatsiya loopida har frame da chaqiriladi
   */
  updateDisplay(dt) {
    this._time += dt;
    if (this.panelEl) {
      const dispEl = this.panelEl.querySelector('#fgDisplayVal');
      if (dispEl) dispEl.textContent = this.getVoltage(this._time).toFixed(3);
    }
  }
}

window.DigitalMultimeter = DigitalMultimeter;
window.VirtualOscilloscope = VirtualOscilloscope;
window.FunctionGenerator = FunctionGenerator;
