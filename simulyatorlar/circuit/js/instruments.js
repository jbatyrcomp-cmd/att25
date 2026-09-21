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

window.DigitalMultimeter = DigitalMultimeter;
window.VirtualOscilloscope = VirtualOscilloscope;
