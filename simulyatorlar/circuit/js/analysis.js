/* ==========================================================================
   CIRCUIT ANALYSIS ENGINE (AC ANALYSIS + DC SWEEP + TRANSIENT PLOT)
   ATT-25 Circuit Lab — Multisim-darajasi tahlil vositalari
   AC Tahlil: Bode diagrammasi (amplituda + faza)
   DC Sweep: Manba kuchlanishi o'zgarganda kuchlanish/tok grafigi
   ========================================================================== */

/* --------------------------------------------------------------------------
   COMPLEX NUMBER HELPER
   -------------------------------------------------------------------------- */
class Complex {
  constructor(re = 0, im = 0) { this.re = re; this.im = im; }
  add(c) { return new Complex(this.re + c.re, this.im + c.im); }
  sub(c) { return new Complex(this.re - c.re, this.im - c.im); }
  mul(c) { return new Complex(this.re * c.re - this.im * c.im, this.re * c.im + this.im * c.re); }
  div(c) {
    const d = c.re * c.re + c.im * c.im;
    if (d === 0) return new Complex(0, 0);
    return new Complex((this.re * c.re + this.im * c.im) / d, (this.im * c.re - this.re * c.im) / d);
  }
  abs() { return Math.sqrt(this.re * this.re + this.im * this.im); }
  angle() { return Math.atan2(this.im, this.re); }
  static fromPolar(r, theta) { return new Complex(r * Math.cos(theta), r * Math.sin(theta)); }
  static j(im = 1) { return new Complex(0, im); }
  static fromNum(n) { return new Complex(n, 0); }
}

/* --------------------------------------------------------------------------
   AC ANALYSIS — Bode Plot (chastota bo'yicha amplituda va faza)
   Yondashuv: Har bir chastota uchun impedans matritsasini yechish,
              H(jω) = Vout / Vin nisbatini hisoblash
   -------------------------------------------------------------------------- */
class ACAnalysis {
  constructor(engine) {
    this.engine = engine;
    this.results = null;
  }

  /**
   * Zanjirda barcha simvollarni aniqlash
   * @param {string} sourceType - 'battery'|'dc_source'|'function_gen' — AC kirish manbasi
   * @param {number} fMin - Minimal chastota (Hz)
   * @param {number} fMax - Maksimal chastota (Hz)
   * @param {number} points - Chastota nuqtalari soni
   * @returns {object} { freqs, mag_db, phase_deg, vin_rms, vout_node }
   */
  run(fMin = 1, fMax = 1e6, points = 100) {
    const engine = this.engine;
    engine.buildNodes();

    const freqs = [];
    const mag_db = [];
    const phase_deg = [];
    const mag_linear = [];

    // Chastota nuqtalarini logarifmik taqsimlash
    const logMin = Math.log10(fMin);
    const logMax = Math.log10(fMax);
    for (let i = 0; i < points; i++) {
      const logF = logMin + (logMax - logMin) * i / (points - 1);
      freqs.push(Math.pow(10, logF));
    }

    // Kirish va chiqish tugunlarini aniqlash
    let sourceComp = engine.components.find(c =>
      c.type === 'battery' || c.type === 'dc_source' || c.type === 'function_gen'
    );
    if (!sourceComp) {
      return { error: 'AC manba topilmadi. Zanjirga Batareya yoki DC Manba qo\'ying.', freqs, mag_db, phase_deg };
    }

    // Har bir chastota uchun H(jω) hisoblash
    for (const freq of freqs) {
      const omega = 2 * Math.PI * freq;
      const H = this._computeTransfer(engine, omega, sourceComp);
      const absMag = H.abs();
      const dbVal = absMag > 1e-12 ? 20 * Math.log10(absMag) : -120;
      mag_db.push(isFinite(dbVal) ? dbVal : -120);
      mag_linear.push(absMag);
      phase_deg.push(H.angle() * 180 / Math.PI);
    }

    // Bandwidth (-3dB) hisoblash
    const maxMag = Math.max(...mag_linear.filter(v => isFinite(v)));
    const cutoff3dB = maxMag * Math.SQRT1_2;
    let bw3dB = null;
    for (let i = 0; i < mag_linear.length - 1; i++) {
      if (mag_linear[i] >= cutoff3dB && mag_linear[i + 1] < cutoff3dB) {
        bw3dB = freqs[i];
        break;
      }
    }

    this.results = { freqs, mag_db, phase_deg, mag_linear, bw3dB, maxMag };
    return this.results;
  }

  /**
   * Kompleks o'tkazish funksiyasi H(jω) hisoblash
   * Faqat passiv 2-terminal komponentlar uchun (R, L, C)
   * Soddalashtirilgan: zanjir uchun umumiy impedans nisbati
   */
  _computeTransfer(engine, omega, sourceComp) {
    // Barcha komponentlarning impedanslarini hisoblash
    let totalImpedance = new Complex(1e-9, 0); // kichik cheklov (manba ichki qarshilik)
    let outputImpedance = new Complex(0, 0);   // chiqish impedansi (kondensator yoki induktivlik)
    let hasOutputElement = false;

    const comps = engine.components.filter(c => c !== sourceComp);

    for (const comp of comps) {
      let Z = this._getImpedance(comp, omega);
      if (!Z) continue;

      // Chiqish elementi aniqlash (kondensator yoki induktivlik oxirida)
      if (comp.type === 'capacitor' || comp.type === 'inductor') {
        if (!hasOutputElement) {
          outputImpedance = Z;
          hasOutputElement = true;
        }
      }
      totalImpedance = totalImpedance.add(Z);
    }

    if (totalImpedance.abs() < 1e-12) return new Complex(1, 0);

    if (hasOutputElement) {
      // Kuchlanish bo'luvchi formula: H = Zout / Ztotal
      return outputImpedance.div(totalImpedance);
    }

    // Shunchaki kuchlanish o'tkazish (rezistiv bo'linma)
    return new Complex(1, 0);
  }

  /**
   * Komponent impedansini kompleks sonda qaytarish
   */
  _getImpedance(comp, omega) {
    switch (comp.type) {
      case 'resistor':
        return new Complex(comp.resistance || 1000, 0);
      case 'capacitor': {
        const C = comp.capacitance || 1e-4;
        // Z_C = 1 / (jωC)
        const denom = omega * C;
        return new Complex(0, denom < 1e-30 ? 1e9 : -1 / denom);
      }
      case 'inductor': {
        const L = comp.inductance || 0.001;
        // Z_L = jωL
        return new Complex(0, omega * L);
      }
      case 'ammeter':
        return new Complex(0.001, 0);
      case 'voltmeter':
        return new Complex(1e6, 0);
      case 'led':
        return new Complex((comp.internalResistance || 15) + (comp.forwardVoltage || 1.8) / 0.01, 0);
      case 'diode':
        return new Complex((comp.internalResistance || 2) + (comp.forwardVoltage || 0.7) / 0.01, 0);
      default:
        return comp.resistance ? new Complex(comp.resistance, 0) : null;
    }
  }

  /**
   * Bode diagrammasini canvas ga chizish
   */
  drawBode(canvas, results, theme = {}) {
    if (!canvas || !results || !results.freqs || results.freqs.length < 2) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    const PAD = { left: 64, right: 20, top: 20, bottom: 60 };

    const plotW = W - PAD.left - PAD.right;
    const plotH = (H - PAD.top - PAD.bottom) / 2 - 8;

    // Background
    ctx.fillStyle = '#060E1A';
    ctx.fillRect(0, 0, W, H);

    // Borde & divider
    ctx.strokeStyle = 'rgba(56,189,248,0.15)';
    ctx.lineWidth = 1;
    ctx.strokeRect(PAD.left, PAD.top, plotW, H - PAD.top - PAD.bottom);

    const midY = PAD.top + plotH + 8;
    ctx.beginPath();
    ctx.moveTo(PAD.left, midY);
    ctx.lineTo(PAD.left + plotW, midY);
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#38BDF8';
    ctx.font = 'bold 11px JetBrains Mono';
    ctx.textAlign = 'right';
    ctx.fillText('dB', PAD.left - 4, PAD.top + 14);
    ctx.fillText('°', PAD.left - 4, midY + 14);

    // Title
    ctx.fillStyle = '#94A3B8';
    ctx.font = '10px Plus Jakarta Sans';
    ctx.textAlign = 'center';
    ctx.fillText('Amplituda (dB)', PAD.left + plotW / 2, PAD.top - 4);
    ctx.fillText('Faza (°)', PAD.left + plotW / 2, midY - 4);

    const freqs = results.freqs;
    const mag_db = results.mag_db;
    const phase_deg = results.phase_deg;

    const fMin = freqs[0], fMax = freqs[freqs.length - 1];
    const logFMin = Math.log10(fMin), logFMax = Math.log10(fMax);

    const toX = f => PAD.left + (Math.log10(f) - logFMin) / (logFMax - logFMin) * plotW;

    // dB range
    const dbMin = Math.min(...mag_db) - 10;
    const dbMax = Math.max(...mag_db) + 10;
    const toY_db = db => PAD.top + plotH - (db - dbMin) / (dbMax - dbMin) * plotH;

    // Phase range
    const phMin = -190, phMax = 10;
    const toY_ph = ph => midY + 8 + plotH - (ph - phMin) / (phMax - phMin) * plotH;

    // Grid lines (logarifmik chastota)
    ctx.strokeStyle = 'rgba(56,189,248,0.1)';
    ctx.lineWidth = 0.5;
    const decades = Math.ceil(logFMax) - Math.floor(logFMin);
    for (let d = 0; d <= decades; d++) {
      const f = Math.pow(10, Math.floor(logFMin) + d);
      for (let m = 1; m <= 9; m++) {
        const fx = toX(f * m);
        if (fx < PAD.left || fx > PAD.left + plotW) continue;
        ctx.beginPath();
        ctx.moveTo(fx, PAD.top);
        ctx.lineTo(fx, H - PAD.bottom);
        ctx.stroke();
      }
    }

    // Frequency labels
    ctx.fillStyle = '#64748B';
    ctx.font = '9px JetBrains Mono';
    ctx.textAlign = 'center';
    for (let d = 0; d <= decades; d++) {
      const f = Math.pow(10, Math.floor(logFMin) + d);
      const fx = toX(f);
      if (fx < PAD.left || fx > PAD.left + plotW) continue;
      const label = f >= 1e6 ? (f / 1e6).toFixed(0) + 'M' :
                    f >= 1e3 ? (f / 1e3).toFixed(0) + 'k' : f.toFixed(0);
      ctx.fillText(label + 'Hz', fx, H - PAD.bottom + 14);
    }

    // dB horizontal grid
    for (let db = Math.ceil(dbMin / 10) * 10; db <= dbMax; db += 20) {
      const y = toY_db(db);
      if (y < PAD.top || y > midY - 4) continue;
      ctx.strokeStyle = 'rgba(56,189,248,0.08)';
      ctx.beginPath(); ctx.moveTo(PAD.left, y); ctx.lineTo(PAD.left + plotW, y); ctx.stroke();
      ctx.fillStyle = '#64748B';
      ctx.textAlign = 'right';
      ctx.fillText(db + '', PAD.left - 4, y + 4);
    }

    // -3dB horizontal dashed line
    if (results.maxMag > 0) {
      const db3 = 20 * Math.log10(results.maxMag * Math.SQRT1_2);
      const y3 = toY_db(db3);
      if (y3 >= PAD.top && y3 <= midY) {
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = 'rgba(251,191,36,0.5)';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(PAD.left, y3); ctx.lineTo(PAD.left + plotW, y3); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#FBBF24';
        ctx.font = '9px JetBrains Mono';
        ctx.textAlign = 'left';
        ctx.fillText('-3dB', PAD.left + 4, y3 - 3);
        if (results.bw3dB) {
          const xBw = toX(results.bw3dB);
          ctx.strokeStyle = 'rgba(251,191,36,0.4)';
          ctx.setLineDash([4, 4]);
          ctx.beginPath(); ctx.moveTo(xBw, PAD.top); ctx.lineTo(xBw, midY); ctx.stroke();
          ctx.setLineDash([]);
          ctx.fillStyle = '#FBBF24';
          ctx.textAlign = 'center';
          const fLabel = results.bw3dB >= 1e3 ? (results.bw3dB / 1e3).toFixed(1) + 'kHz' : results.bw3dB.toFixed(0) + 'Hz';
          ctx.fillText('fc=' + fLabel, xBw, PAD.top + 10);
        }
      }
    }

    // Draw magnitude curve (amplituda — yashil)
    ctx.strokeStyle = '#00FF87';
    ctx.lineWidth = 2.2;
    ctx.shadowColor = 'rgba(0,255,135,0.5)';
    ctx.shadowBlur = 5;
    ctx.beginPath();
    for (let i = 0; i < freqs.length; i++) {
      const x = toX(freqs[i]);
      const y = toY_db(mag_db[i]);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Draw phase curve (faza — to'q sariq)
    ctx.strokeStyle = '#F97316';
    ctx.lineWidth = 2;
    ctx.shadowColor = 'rgba(249,115,22,0.5)';
    ctx.shadowBlur = 4;
    ctx.beginPath();
    for (let i = 0; i < freqs.length; i++) {
      const x = toX(freqs[i]);
      const y = toY_ph(phase_deg[i]);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Legend
    ctx.font = '10px Plus Jakarta Sans';
    ctx.fillStyle = '#00FF87';
    ctx.textAlign = 'left';
    ctx.fillRect(PAD.left + 8, PAD.top + 4, 14, 2);
    ctx.fillText('Amplituda', PAD.left + 26, PAD.top + 10);
    ctx.fillStyle = '#F97316';
    ctx.fillRect(PAD.left + 100, PAD.top + 4, 14, 2);
    ctx.fillText('Faza', PAD.left + 118, PAD.top + 10);
  }
}

/* --------------------------------------------------------------------------
   DC SWEEP ANALYSIS — Kirish kuchlanishi o'zgarganda chiqish parametrlari
   -------------------------------------------------------------------------- */
class DCSweepAnalysis {
  constructor(engine) {
    this.engine = engine;
    this.results = null;
  }

  /**
   * @param {object} sourceComp - Kuchlanish manbasi (battery / dc_source)
   * @param {number} vMin - Boshlang'ich kuchlanish (V)
   * @param {number} vMax - Oxirgi kuchlanish (V)
   * @param {number} steps - Qadamlar soni
   * @param {object} outputComp - Chiqish komponenti (voltmeter, led, rezistor yoki null)
   */
  run(sourceComp, vMin = 0, vMax = 12, steps = 100, outputComp = null) {
    const engine = this.engine;
    const origVoltage = sourceComp.voltage;

    const voltages = [];
    const currents = [];
    const powers = [];
    const vouts = [];

    for (let i = 0; i <= steps; i++) {
      const v = vMin + (vMax - vMin) * i / steps;
      sourceComp.voltage = v;
      engine.solve();

      voltages.push(v);

      // Chiqish komponentidan o'lchash
      const target = outputComp || engine.components.find(c =>
        c !== sourceComp && (c.type === 'resistor' || c.type === 'led' || c.type === 'diode' || c.type === 'voltmeter')
      );

      if (target) {
        currents.push(Math.abs(target.current || 0));
        vouts.push(Math.abs(target.voltageDrop || 0));
        powers.push(Math.abs((target.current || 0) * (target.voltageDrop || 0)));
      } else {
        currents.push(Math.abs(sourceComp.current || 0));
        vouts.push(v);
        powers.push(0);
      }
    }

    // Asl kuchlanishni tiklash
    sourceComp.voltage = origVoltage;
    engine.solve();

    this.results = { voltages, currents, powers, vouts, outputComp: outputComp ? outputComp.name : 'Zanjir' };
    return this.results;
  }

  /**
   * DC Sweep natijasini canvas ga chizish
   */
  drawSweep(canvas, results, plotMode = 'vi') {
    if (!canvas || !results) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    const PAD = { left: 64, right: 20, top: 24, bottom: 50 };
    const plotW = W - PAD.left - PAD.right;
    const plotH = H - PAD.top - PAD.bottom;

    // Bg
    ctx.fillStyle = '#060E1A';
    ctx.fillRect(0, 0, W, H);

    const vs = results.voltages;
    const ys = plotMode === 'vi' ? results.currents :
               plotMode === 'vp' ? results.powers : results.vouts;

    const vMin = Math.min(...vs), vMax = Math.max(...vs);
    const yMin = 0, yMax = Math.max(...ys) * 1.1 || 1;

    const toX = v => PAD.left + (v - vMin) / (vMax - vMin || 1) * plotW;
    const toY = y => PAD.top + plotH - (y - yMin) / (yMax - yMin || 1) * plotH;

    // Grid
    ctx.strokeStyle = 'rgba(56,189,248,0.1)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 5; i++) {
      const y = PAD.top + plotH * i / 5;
      ctx.beginPath(); ctx.moveTo(PAD.left, y); ctx.lineTo(PAD.left + plotW, y); ctx.stroke();
      const yVal = yMax - (yMax - yMin) * i / 5;
      ctx.fillStyle = '#64748B';
      ctx.font = '9px JetBrains Mono';
      ctx.textAlign = 'right';
      const label = plotMode === 'vi' ?
        (yVal >= 1 ? yVal.toFixed(2) + 'A' : (yVal * 1000).toFixed(1) + 'mA') :
        plotMode === 'vp' ? yVal.toFixed(3) + 'W' : yVal.toFixed(2) + 'V';
      ctx.fillText(label, PAD.left - 4, y + 4);
    }

    // X-axis labels
    ctx.fillStyle = '#64748B';
    ctx.font = '9px JetBrains Mono';
    ctx.textAlign = 'center';
    for (let i = 0; i <= 6; i++) {
      const v = vMin + (vMax - vMin) * i / 6;
      ctx.fillText(v.toFixed(1) + 'V', toX(v), H - PAD.bottom + 14);
    }

    // Axes
    ctx.strokeStyle = 'rgba(56,189,248,0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(PAD.left, PAD.top, plotW, plotH);

    // Curve
    const colors = { vi: '#00FF87', vp: '#F97316', vv: '#A78BFA' };
    ctx.strokeStyle = colors[plotMode] || '#38BDF8';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = ctx.strokeStyle;
    ctx.shadowBlur = 6;
    ctx.beginPath();
    for (let i = 0; i < vs.length; i++) {
      const x = toX(vs[i]);
      const y = toY(ys[i]);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Title
    ctx.fillStyle = '#94A3B8';
    ctx.font = '10px Plus Jakarta Sans';
    ctx.textAlign = 'center';
    const titleMap = { vi: 'Kuchlanish–Tok (V–I)', vp: 'Kuchlanish–Quvvat (V–P)', vv: 'Kirish–Chiqish (Vin–Vout)' };
    ctx.fillText(titleMap[plotMode] || 'DC Sweep', PAD.left + plotW / 2, PAD.top - 6);

    // X axis label
    ctx.fillStyle = '#64748B';
    ctx.fillText('Kirish kuchlanishi (V)', PAD.left + plotW / 2, H - 8);
  }
}

/* --------------------------------------------------------------------------
   TRANSIENT ANALYSIS — R, L, C vaqt grafigi
   -------------------------------------------------------------------------- */
class TransientAnalysis {
  constructor(engine) {
    this.engine = engine;
    this.results = null;
  }

  /**
   * RC/RL/RLC tranzient javobini hisoblash (analitik formulalar)
   * @param {number} duration - Vaqt oralig'i (soniya)
   * @param {number} steps - Nuqtalar soni
   */
  run(duration = 0.05, steps = 500) {
    const engine = this.engine;
    const comps = engine.components;

    // Manbani topish
    const src = comps.find(c => c.type === 'battery' || c.type === 'dc_source');
    const R = comps.find(c => c.type === 'resistor');
    const C = comps.find(c => c.type === 'capacitor');
    const L = comps.find(c => c.type === 'inductor');

    const Vs = src ? (src.voltage || 0) : 0;
    const Rv = R ? (R.resistance || 1000) : 1000;
    const Cv = C ? (C.capacitance || 1e-4) : null;
    const Lv = L ? (L.inductance || 0.001) : null;

    const times = [];
    const vC = [];
    const iC = [];
    const vL = [];

    for (let i = 0; i <= steps; i++) {
      const t = duration * i / steps;
      times.push(t);

      if (Cv && !Lv) {
        // RC zanjir: vc(t) = Vs * (1 - e^(-t/RC))
        const tau = Rv * Cv;
        const vc = Vs * (1 - Math.exp(-t / tau));
        vC.push(vc);
        iC.push((Vs - vc) / Rv);
        vL.push(0);
      } else if (Lv && !Cv) {
        // RL zanjir: i(t) = (Vs/R) * (1 - e^(-Rt/L))
        const tau = Lv / Rv;
        const il = (Vs / Rv) * (1 - Math.exp(-t / tau));
        vC.push(il * Rv);
        iC.push(il);
        vL.push(Vs - il * Rv);
      } else if (Cv && Lv) {
        // RLC zanjir: ikkinchi tartibli differentsial tenglama
        const alpha = Rv / (2 * Lv);
        const omega0 = 1 / Math.sqrt(Lv * Cv);
        const wSq = omega0 * omega0 - alpha * alpha;
        let vc;
        if (wSq > 0) {
          // Kam so'nish (underdamped)
          const wd = Math.sqrt(wSq);
          vc = Vs * (1 - Math.exp(-alpha * t) * (Math.cos(wd * t) + alpha / wd * Math.sin(wd * t)));
        } else if (wSq < 0) {
          // Ko'p so'nish (overdamped)
          const s1 = -alpha + Math.sqrt(-wSq);
          const s2 = -alpha - Math.sqrt(-wSq);
          const A = Vs * s2 / (s2 - s1);
          const B = -Vs * s1 / (s2 - s1);
          vc = Vs + A * Math.exp(s1 * t) + B * Math.exp(s2 * t);
        } else {
          // Kritik so'nish
          vc = Vs * (1 - Math.exp(-alpha * t) * (1 + alpha * t));
        }
        vC.push(isFinite(vc) ? vc : Vs);
        iC.push(Cv * (vC[i] - (vC[i - 1] || 0)) / (duration / steps + 1e-12));
        vL.push(Lv * (iC[i] - (iC[i - 1] || 0)) / (duration / steps + 1e-12));
      } else {
        // Faqat rezistiv zanjir — bosqichli javob
        vC.push(Vs);
        iC.push(Vs / Rv);
        vL.push(0);
      }
    }

    this.results = { times, vC, iC, vL, Rv, Cv, Lv, Vs, duration };
    return this.results;
  }

  /**
   * Transient natijasini canvas ga chizish
   */
  drawTransient(canvas, results, showVoltage = true, showCurrent = true) {
    if (!canvas || !results) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    const PAD = { left: 64, right: 20, top: 24, bottom: 50 };
    const plotW = W - PAD.left - PAD.right;
    const plotH = H - PAD.top - PAD.bottom;

    ctx.fillStyle = '#060E1A';
    ctx.fillRect(0, 0, W, H);

    const { times, vC, iC, Vs, duration } = results;
    const vMax = Math.max(Vs * 1.1, Math.max(...vC) * 1.1, 1);
    const vMin = Math.min(0, Math.min(...vC) * 1.1);
    const iMax = Math.max(...iC.map(Math.abs)) * 1.1 || 0.001;

    const toX = t => PAD.left + t / duration * plotW;
    const toYv = v => PAD.top + plotH - (v - vMin) / (vMax - vMin) * plotH;

    // Grid
    ctx.strokeStyle = 'rgba(56,189,248,0.1)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 5; i++) {
      const y = PAD.top + plotH * i / 5;
      ctx.beginPath(); ctx.moveTo(PAD.left, y); ctx.lineTo(PAD.left + plotW, y); ctx.stroke();
      const v = vMax - (vMax - vMin) * i / 5;
      ctx.fillStyle = '#64748B';
      ctx.font = '9px JetBrains Mono';
      ctx.textAlign = 'right';
      ctx.fillText(v.toFixed(2) + 'V', PAD.left - 4, y + 4);
    }

    // Time labels
    ctx.fillStyle = '#64748B';
    ctx.font = '9px JetBrains Mono';
    ctx.textAlign = 'center';
    for (let i = 0; i <= 5; i++) {
      const t = duration * i / 5;
      const label = t >= 1 ? t.toFixed(1) + 's' : t >= 0.001 ? (t * 1000).toFixed(1) + 'ms' : (t * 1e6).toFixed(0) + 'µs';
      ctx.fillText(label, toX(t), H - PAD.bottom + 14);
    }

    // Vout (kondensator/induktivlik kuchlanishi)
    if (showVoltage) {
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = 'rgba(56,189,248,0.5)';
      ctx.shadowBlur = 5;
      ctx.beginPath();
      for (let i = 0; i < times.length; i++) {
        const x = toX(times[i]);
        const y = toYv(vC[i]);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // Iout (tok)
    if (showCurrent && iMax > 0) {
      const toYi = i_val => PAD.top + plotH - (Math.abs(i_val) / iMax) * plotH;
      ctx.strokeStyle = '#00FF87';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 3]);
      ctx.beginPath();
      for (let i = 0; i < times.length; i++) {
        const x = toX(times[i]);
        const y = toYi(iC[i]);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Legend
    ctx.font = '10px Plus Jakarta Sans';
    ctx.fillStyle = '#38BDF8';
    ctx.fillRect(PAD.left + 8, PAD.top + 6, 18, 2);
    ctx.textAlign = 'left';
    ctx.fillText('V(t)', PAD.left + 30, PAD.top + 12);
    if (showCurrent) {
      ctx.fillStyle = '#00FF87';
      ctx.fillRect(PAD.left + 70, PAD.top + 6, 18, 2);
      ctx.fillText('I(t)', PAD.left + 92, PAD.top + 12);
    }

    // Title
    ctx.fillStyle = '#94A3B8';
    ctx.textAlign = 'center';
    ctx.fillText('Tranzient tahlil — V(t) va I(t)', PAD.left + plotW / 2, PAD.top - 6);
    ctx.fillText('Vaqt (t)', PAD.left + plotW / 2, H - 8);
  }
}

/* --------------------------------------------------------------------------
   GLOBAL EXPORT
   -------------------------------------------------------------------------- */
window.ACAnalysis = ACAnalysis;
window.DCSweepAnalysis = DCSweepAnalysis;
window.TransientAnalysis = TransientAnalysis;
window.Complex = Complex;
