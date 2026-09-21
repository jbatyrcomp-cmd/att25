/* ==========================================================================
   CIRCUIT COMPONENTS LIBRARY (SCHEMATIC & BREADBOARD RENDERERS)
   ATT-25 Circuit Lab Component Classes & Graphic Representations
   ========================================================================== */

const RESISTOR_COLORS = [
  { val: 0, color: '#000000', name: 'Qora' },
  { val: 1, color: '#8B4513', name: 'Jigarrang' },
  { val: 2, color: '#EF4444', name: 'Qizil' },
  { val: 3, color: '#F97316', name: 'To‘q sariq' },
  { val: 4, color: '#FBBF24', name: 'Sariq' },
  { val: 5, color: '#10B981', name: 'Yashil' },
  { val: 6, color: '#3B82F6', name: 'Moviy' },
  { val: 7, color: '#8B5CF6', name: 'Binafsha' },
  { val: 8, color: '#6B7280', name: 'Kulrang' },
  { val: 9, color: '#FFFFFF', name: 'Oq' }
];

class CircuitComponent {
  constructor(id, type, name, x = 100, y = 100) {
    this.id = id || 'comp_' + Math.random().toString(36).substr(2, 9);
    this.type = type;
    this.name = name;
    this.x = x;
    this.y = y;
    this.rotation = 0; // 0, 90, 180, 270 deg
    this.pins = [];
    this.current = 0;
    this.voltageDrop = 0;
    this.selected = false;
  }

  getPinPos(pin) {
    const rad = (this.rotation * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const rx = pin.relX * cos - pin.relY * sin;
    const ry = pin.relX * sin + pin.relY * cos;
    return { x: this.x + rx, y: this.y + ry };
  }

  isPointInside(px, py) {
    const dx = px - this.x;
    const dy = py - this.y;
    return Math.sqrt(dx * dx + dy * dy) <= (this.radius || 32);
  }

  getConductance() {
    return 1 / (this.resistance || 1000);
  }
}

/* ==========================================================================
   1. BATTERY (1.5V / 9V / DC SOURCE)
   ========================================================================== */
class BatteryComponent extends CircuitComponent {
  constructor(x, y, voltage = 9.0) {
    super(null, 'battery', voltage >= 9 ? '9V Krona Batareya' : '1.5V Batareya', x, y);
    this.voltage = voltage;
    this.radius = 34;
    this.pins = [
      { id: this.id + '_p', name: '+', relX: -24, relY: 0, voltage: 0 },
      { id: this.id + '_n', name: '-', relX: 24, relY: 0, voltage: 0 }
    ];
  }

  drawSchematic(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);

    // Terminals
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-34, 0); ctx.lineTo(-14, 0);
    ctx.moveTo(14, 0); ctx.lineTo(34, 0);
    ctx.stroke();

    // Plates: Long thin plate (+) on left, short thick plate (-) on right
    ctx.strokeStyle = '#00FF87'; // Long (+)
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-14, -20); ctx.lineTo(-14, 20);
    ctx.stroke();

    ctx.strokeStyle = '#EF4444'; // Short (-)
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(14, -12); ctx.lineTo(14, 12);
    ctx.stroke();

    // Polarity Labels
    ctx.fillStyle = '#00FF87';
    ctx.font = 'bold 13px JetBrains Mono';
    ctx.fillText('+', -22, -10);
    ctx.fillStyle = '#EF4444';
    ctx.fillText('-', 18, -10);

    // Value text
    ctx.fillStyle = '#F8FAFC';
    ctx.font = '11px Plus Jakarta Sans';
    ctx.textAlign = 'center';
    ctx.fillText(`${this.voltage}V`, 0, 32);

    ctx.restore();
  }

  drawBreadboard(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);

    if (this.voltage >= 8) {
      // 9V Battery Block
      ctx.fillStyle = '#1E293B';
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(-24, -34, 48, 68, 6);
      ctx.fill(); ctx.stroke();

      // Top contacts
      ctx.fillStyle = '#94A3B8'; // Hexagon +
      ctx.beginPath();
      ctx.arc(-12, -34, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#CBD5E1'; // Round -
      ctx.beginPath();
      ctx.arc(12, -34, 5, 0, Math.PI * 2);
      ctx.fill();

      // Label
      ctx.fillStyle = '#FBBF24';
      ctx.font = 'bold 12px Oswald';
      ctx.textAlign = 'center';
      ctx.fillText('9V ALKALINE', 0, 4);
    } else {
      // Cylindrical AA Battery
      ctx.fillStyle = '#0284C7';
      ctx.strokeStyle = '#0369A1';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(-28, -14, 56, 28, 4);
      ctx.fill(); ctx.stroke();

      // Golden positive nipple
      ctx.fillStyle = '#FBBF24';
      ctx.fillRect(-32, -6, 4, 12);

      // Label
      ctx.fillStyle = '#FFF';
      ctx.font = 'bold 10px JetBrains Mono';
      ctx.textAlign = 'center';
      ctx.fillText(`${this.voltage}V`, 0, 4);
    }

    ctx.restore();
  }
}

/* ==========================================================================
   2. RESISTOR (OHM'S LAW WITH COLOR BANDS)
   ========================================================================== */
class ResistorComponent extends CircuitComponent {
  constructor(x, y, resistance = 220) {
    super(null, 'resistor', 'Rezistor', x, y);
    this.resistance = resistance; // Ohms
    this.radius = 32;
    this.pins = [
      { id: this.id + '_1', name: '1', relX: -28, relY: 0, voltage: 0 },
      { id: this.id + '_2', name: '2', relX: 28, relY: 0, voltage: 0 }
    ];
  }

  getColorBands() {
    let r = Math.round(this.resistance);
    let str = r.toString();
    let d1 = parseInt(str[0], 10) || 1;
    let d2 = parseInt(str[1], 10) || 0;
    let mult = str.length - 2;
    if (mult < 0) mult = 0;

    return [
      RESISTOR_COLORS[d1] ? RESISTOR_COLORS[d1].color : '#8B4513',
      RESISTOR_COLORS[d2] ? RESISTOR_COLORS[d2].color : '#000000',
      RESISTOR_COLORS[mult] ? RESISTOR_COLORS[mult].color : '#EF4444',
      '#D4AF37' // Gold 5% tolerance
    ];
  }

  drawSchematic(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);

    // Terminals
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-32, 0); ctx.lineTo(-18, 0);
    ctx.moveTo(18, 0); ctx.lineTo(32, 0);
    ctx.stroke();

    // Standard Zigzag (IEEE)
    ctx.strokeStyle = '#00FF87';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-18, 0);
    ctx.lineTo(-14, -8);
    ctx.lineTo(-7, 8);
    ctx.lineTo(0, -8);
    ctx.lineTo(7, 8);
    ctx.lineTo(14, -8);
    ctx.lineTo(18, 0);
    ctx.stroke();

    // Value text
    ctx.fillStyle = '#F8FAFC';
    ctx.font = '11px JetBrains Mono';
    ctx.textAlign = 'center';
    let label = this.resistance >= 1000 ? (this.resistance / 1000).toFixed(1) + ' kΩ' : this.resistance + ' Ω';
    ctx.fillText(label, 0, 24);

    ctx.restore();
  }

  drawBreadboard(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);

    // Metal leads
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-32, 0); ctx.lineTo(-16, 0);
    ctx.moveTo(16, 0); ctx.lineTo(32, 0);
    ctx.stroke();

    // Beige resistor body
    ctx.fillStyle = '#D6B588';
    ctx.strokeStyle = '#A88350';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(-16, -7, 32, 14, 5);
    ctx.fill(); ctx.stroke();

    // 4 Color bands
    const bands = this.getColorBands();
    const bandX = [-10, -5, 0, 7];
    bands.forEach((bColor, i) => {
      ctx.fillStyle = bColor;
      ctx.fillRect(bandX[i], -7, 3.5, 14);
    });

    ctx.restore();
  }
}

/* ==========================================================================
   3. LIGHT BULB (INCANDESCENT LAMP WITH GLOWING FILAMENT)
   ========================================================================== */
class BulbComponent extends CircuitComponent {
  constructor(x, y, nominalVoltage = 6.0) {
    super(null, 'bulb', 'Qizdirma Lampochka', x, y);
    this.nominalVoltage = nominalVoltage;
    this.resistance = 20; // Cold resistance ~ 20 Ohms
    this.radius = 34;
    this.pins = [
      { id: this.id + '_1', name: 'A', relX: -26, relY: 0, voltage: 0 },
      { id: this.id + '_2', name: 'B', relX: 26, relY: 0, voltage: 0 }
    ];
  }

  drawSchematic(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);

    // Terminals
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-30, 0); ctx.lineTo(-16, 0);
    ctx.moveTo(16, 0); ctx.lineTo(30, 0);
    ctx.stroke();

    // Circle
    ctx.strokeStyle = '#F8FAFC';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, Math.PI * 2);
    ctx.stroke();

    // Cross inside circle
    const d = 11;
    ctx.beginPath();
    ctx.moveTo(-d, -d); ctx.lineTo(d, d);
    ctx.moveTo(-d, d); ctx.lineTo(d, -d);
    ctx.stroke();

    // Glow effect if current is flowing
    const brightness = Math.min(1.0, Math.abs(this.current) * 3.5);
    if (brightness > 0.05) {
      ctx.fillStyle = `rgba(251, 191, 36, ${brightness * 0.45})`;
      ctx.beginPath();
      ctx.arc(0, 0, 24 * (1 + brightness * 0.5), 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  drawBreadboard(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);

    // Glow aura
    const brightness = Math.min(1.0, Math.abs(this.current) * 3.5);
    if (brightness > 0.05) {
      const grad = ctx.createRadialGradient(0, 0, 5, 0, 0, 45 * brightness);
      grad.addColorStop(0, `rgba(254, 240, 138, ${brightness})`);
      grad.addColorStop(0.5, `rgba(251, 191, 36, ${brightness * 0.5})`);
      grad.addColorStop(1, 'rgba(251, 191, 36, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, 50, 0, Math.PI * 2);
      ctx.fill();
    }

    // Glass bulb
    ctx.fillStyle = brightness > 0.1 ? `rgba(254, 240, 138, ${0.4 + brightness * 0.6})` : 'rgba(255, 255, 255, 0.15)';
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();

    // Tungsten filament
    ctx.strokeStyle = brightness > 0.1 ? '#FFF' : '#64748B';
    ctx.lineWidth = brightness > 0.1 ? 2.5 : 1.5;
    ctx.beginPath();
    ctx.moveTo(-6, 8); ctx.lineTo(-3, -4); ctx.lineTo(3, -4); ctx.lineTo(6, 8);
    ctx.stroke();

    ctx.restore();
  }
}

/* ==========================================================================
   4. LED (LIGHT EMITTING DIODE)
   ========================================================================== */
class LedComponent extends CircuitComponent {
  constructor(x, y, color = '#EF4444') {
    super(null, 'led', 'Yorug‘lik Diodi (LED)', x, y);
    this.ledColor = color;
    this.forwardVoltage = 1.8; // Volts
    this.internalResistance = 12; // Ohms
    this.isBlown = false;
    this.radius = 30;
    this.pins = [
      { id: this.id + '_a', name: 'Anod (+)', relX: -26, relY: 0, voltage: 0 },
      { id: this.id + '_k', name: 'Katod (-)', relX: 26, relY: 0, voltage: 0 }
    ];
  }

  getConductance(vDiff) {
    if (this.isBlown) return 0;
    return vDiff > this.forwardVoltage ? (1 / this.internalResistance) : 1e-8;
  }

  drawSchematic(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);

    // Terminals
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-28, 0); ctx.lineTo(-12, 0);
    ctx.moveTo(12, 0); ctx.lineTo(28, 0);
    ctx.stroke();

    // Diode Triangle (Anode -> Cathode)
    ctx.fillStyle = this.isBlown ? '#334155' : this.ledColor;
    ctx.strokeStyle = '#F8FAFC';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-12, -12); ctx.lineTo(12, 0); ctx.lineTo(-12, 12);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Cathode Bar
    ctx.beginPath();
    ctx.moveTo(12, -12); ctx.lineTo(12, 12);
    ctx.stroke();

    // Optical Emission Arrows
    if (!this.isBlown && this.current > 0.002) {
      ctx.strokeStyle = '#FBBF24';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, -14); ctx.lineTo(8, -22);
      ctx.moveTo(8, -14); ctx.lineTo(16, -22);
      ctx.stroke();
    }

    if (this.isBlown) {
      // Burned skull / X
      ctx.strokeStyle = '#EF4444';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-8, -8); ctx.lineTo(8, 8);
      ctx.moveTo(-8, 8); ctx.lineTo(8, -8);
      ctx.stroke();
    }

    ctx.restore();
  }

  drawBreadboard(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);

    const brightness = this.isBlown ? 0 : Math.min(1.0, this.current * 45);

    // Glow aura
    if (brightness > 0.05) {
      const grad = ctx.createRadialGradient(0, 0, 4, 0, 0, 36 * brightness);
      grad.addColorStop(0, this.ledColor);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, 40, 0, Math.PI * 2);
      ctx.fill();
    }

    // Dome body
    ctx.fillStyle = this.isBlown ? '#1E293B' : this.ledColor;
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, 14, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();

    // Flat edge on cathode side (right)
    ctx.fillStyle = '#94A3B8';
    ctx.fillRect(10, -8, 3, 16);

    ctx.restore();
  }
}

/* ==========================================================================
   5. SWITCH (SPST TOGGLE SWITCH)
   ========================================================================== */
class SwitchComponent extends CircuitComponent {
  constructor(x, y) {
    super(null, 'switch', 'Kalit (Pereklyuchatel)', x, y);
    this.isOpen = true;
    this.resistance = 0.001; // Closed resistance ~ 0
    this.radius = 30;
    this.pins = [
      { id: this.id + '_1', name: '1', relX: -26, relY: 0, voltage: 0 },
      { id: this.id + '_2', name: '2', relX: 26, relY: 0, voltage: 0 }
    ];
  }

  toggle() {
    this.isOpen = !this.isOpen;
  }

  getConductance() {
    return this.isOpen ? 1e-10 : 1000;
  }

  drawSchematic(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);

    // Terminals
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-30, 0); ctx.lineTo(-14, 0);
    ctx.moveTo(14, 0); ctx.lineTo(30, 0);
    ctx.stroke();

    // Contact dots
    ctx.fillStyle = '#00FF87';
    ctx.beginPath();
    ctx.arc(-14, 0, 3.5, 0, Math.PI * 2);
    ctx.arc(14, 0, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Lever arm
    ctx.strokeStyle = this.isOpen ? '#EF4444' : '#00FF87';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-14, 0);
    if (this.isOpen) {
      ctx.lineTo(10, -16); // Open angled
    } else {
      ctx.lineTo(14, 0); // Closed flat
    }
    ctx.stroke();

    // State text
    ctx.fillStyle = this.isOpen ? '#EF4444' : '#00FF87';
    ctx.font = 'bold 11px JetBrains Mono';
    ctx.textAlign = 'center';
    ctx.fillText(this.isOpen ? 'OCHIQ' : 'YOPIQ', 0, 24);

    ctx.restore();
  }

  drawBreadboard(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);

    // Switch case
    ctx.fillStyle = '#1E293B';
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(-20, -12, 40, 24, 6);
    ctx.fill(); ctx.stroke();

    // Toggle button slider
    ctx.fillStyle = this.isOpen ? '#EF4444' : '#00FF87';
    const leverX = this.isOpen ? -8 : 8;
    ctx.beginPath();
    ctx.roundRect(leverX - 6, -8, 12, 16, 3);
    ctx.fill();

    ctx.restore();
  }
}

/* ==========================================================================
   6. BUZZER (PIEZO SOUND GENERATOR)
   ========================================================================== */
class BuzzerComponent extends CircuitComponent {
  constructor(x, y) {
    super(null, 'buzzer', 'Pyezo Buzzer', x, y);
    this.resistance = 80;
    this.radius = 32;
    this.pins = [
      { id: this.id + '_p', name: '+', relX: -26, relY: 0, voltage: 0 },
      { id: this.id + '_n', name: '-', relX: 26, relY: 0, voltage: 0 }
    ];
  }

  drawSchematic(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);

    // Terminals
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-30, 0); ctx.lineTo(-14, 0);
    ctx.moveTo(14, 0); ctx.lineTo(30, 0);
    ctx.stroke();

    // Speaker / Buzzer body
    ctx.fillStyle = '#1E293B';
    ctx.strokeStyle = '#FBBF24';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.rect(-14, -14, 12, 28);
    ctx.fill(); ctx.stroke();

    // Cone
    ctx.beginPath();
    ctx.moveTo(-2, -8);
    ctx.lineTo(14, -18);
    ctx.lineTo(14, 18);
    ctx.lineTo(-2, 8);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Sound waves if active
    if (this.current > 0.01) {
      ctx.strokeStyle = '#FBBF24';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(18, 0, 8, -Math.PI * 0.35, Math.PI * 0.35);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(22, 0, 14, -Math.PI * 0.35, Math.PI * 0.35);
      ctx.stroke();
    }

    ctx.restore();
  }

  drawBreadboard(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);

    // Round black piezo cylinder
    ctx.fillStyle = '#0F172A';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 20, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();

    // Center sound hole
    ctx.fillStyle = '#020617';
    ctx.beginPath();
    ctx.arc(0, 0, 6, 0, Math.PI * 2);
    ctx.fill();

    // Plus mark
    ctx.fillStyle = '#EF4444';
    ctx.font = 'bold 12px JetBrains Mono';
    ctx.fillText('+', -14, -8);

    ctx.restore();
  }
}

/* ==========================================================================
   7b. GROUND (0V REFERENCE GND)
   ========================================================================== */
class GroundComponent extends CircuitComponent {
  constructor(x, y) {
    super(null, 'ground', 'Yerlash (GND 0V)', x, y);
    this.radius = 24;
    this.pins = [
      { id: this.id + '_gnd', name: 'GND', relX: 0, relY: -16, voltage: 0 }
    ];
  }

  drawSchematic(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);

    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, -16);
    ctx.lineTo(0, 0);
    ctx.stroke();

    // 3 horizontal bars decreasing in size
    ctx.strokeStyle = '#00FF87';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-16, 0); ctx.lineTo(16, 0);
    ctx.moveTo(-10, 6); ctx.lineTo(10, 6);
    ctx.moveTo(-4, 12); ctx.lineTo(4, 12);
    ctx.stroke();

    ctx.restore();
  }

  drawBreadboard(ctx) {
    this.drawSchematic(ctx);
  }
}

/* ==========================================================================
   8. POTENTIOMETER (VARIABLE RESISTOR / TRIMMER 10kΩ)
   ========================================================================== */
class PotentiometerComponent extends CircuitComponent {
  constructor(x, y, maxResistance = 10000) {
    super(null, 'potentiometer', 'Potensiometr (10 kΩ)', x, y);
    this.maxResistance = maxResistance;
    this.ratio = 0.5; // Wiper position 0.0 to 1.0 (50% default)
    this.radius = 32;
    this.pins = [
      { id: this.id + '_1', name: '1', relX: -28, relY: -14, voltage: 0 },
      { id: this.id + '_w', name: 'W', relX: 0, relY: 26, voltage: 0 },
      { id: this.id + '_2', name: '2', relX: 28, relY: -14, voltage: 0 }
    ];
  }

  getResistance() {
    return Math.max(1, this.maxResistance * this.ratio);
  }

  drawSchematic(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);

    // Terminals 1 and 2
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-32, -14); ctx.lineTo(-18, -14);
    ctx.moveTo(18, -14); ctx.lineTo(32, -14);
    ctx.stroke();

    // Wiper terminal W
    ctx.beginPath();
    ctx.moveTo(0, 26); ctx.lineTo(0, 4);
    ctx.stroke();

    // Resistor body (Zigzag)
    ctx.strokeStyle = '#00FF87';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-18, -14);
    ctx.lineTo(-14, -20);
    ctx.lineTo(-7, -8);
    ctx.lineTo(0, -20);
    ctx.lineTo(7, -8);
    ctx.lineTo(14, -20);
    ctx.lineTo(18, -14);
    ctx.stroke();

    // Wiper Arrow pointing to resistor
    ctx.strokeStyle = '#FBBF24';
    ctx.fillStyle = '#FBBF24';
    ctx.beginPath();
    ctx.moveTo(0, 4);
    const arrowX = -14 + this.ratio * 28;
    ctx.lineTo(arrowX, -6);
    ctx.stroke();

    // Arrow tip
    ctx.beginPath();
    ctx.moveTo(arrowX, -6);
    ctx.lineTo(arrowX - 4, 0);
    ctx.lineTo(arrowX + 4, 0);
    ctx.closePath();
    ctx.fill();

    // Value text
    ctx.fillStyle = '#F8FAFC';
    ctx.font = '10px JetBrains Mono';
    ctx.textAlign = 'center';
    ctx.fillText(`${Math.round(this.getResistance())} Ω (${Math.round(this.ratio * 100)}%)`, 0, -26);

    ctx.restore();
  }

  drawBreadboard(ctx) {
    this.drawSchematic(ctx);
  }
}

/* ==========================================================================
   9. PHOTORESISTOR (LDR - LIGHT DEPENDENT RESISTOR)
   ========================================================================== */
class LdrComponent extends CircuitComponent {
  constructor(x, y) {
    super(null, 'ldr', 'Fotorezistor (LDR)', x, y);
    this.lightLevel = 0.5; // 0 (dark) to 1 (bright daylight)
    this.radius = 30;
    this.pins = [
      { id: this.id + '_1', name: '1', relX: -26, relY: 0, voltage: 0 },
      { id: this.id + '_2', name: '2', relX: 26, relY: 0, voltage: 0 }
    ];
  }

  getResistance() {
    // 100Ω at full sunlight (1.0), 500kΩ in dark (0.0)
    return Math.round(100 + (500000 - 100) * Math.pow(1 - this.lightLevel, 2));
  }

  drawSchematic(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);

    // Terminals
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-30, 0); ctx.lineTo(-16, 0);
    ctx.moveTo(16, 0); ctx.lineTo(30, 0);
    ctx.stroke();

    // Circle boundary
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, Math.PI * 2);
    ctx.stroke();

    // Resistor zigzag inside
    ctx.strokeStyle = '#FBBF24';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-12, 0);
    ctx.lineTo(-8, -6);
    ctx.lineTo(-4, 6);
    ctx.lineTo(0, -6);
    ctx.lineTo(4, 6);
    ctx.lineTo(8, -6);
    ctx.lineTo(12, 0);
    ctx.stroke();

    // Incoming light arrows
    ctx.strokeStyle = '#FBBF24';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-16, -24); ctx.lineTo(-8, -16);
    ctx.moveTo(-10, -26); ctx.lineTo(-2, -18);
    ctx.stroke();

    // Value text
    ctx.fillStyle = '#F8FAFC';
    ctx.font = '10px JetBrains Mono';
    ctx.textAlign = 'center';
    const r = this.getResistance();
    const rStr = r >= 1000 ? (r / 1000).toFixed(1) + ' kΩ' : r + ' Ω';
    ctx.fillText(rStr, 0, 26);

    ctx.restore();
  }

  drawBreadboard(ctx) {
    this.drawSchematic(ctx);
  }
}

/* ==========================================================================
   10. CAPACITOR (100 µF ELECTROLYTIC)
   ========================================================================== */
class CapacitorComponent extends CircuitComponent {
  constructor(x, y, capacitance = 0.0001) { // 100 µF
    super(null, 'capacitor', 'Kondensator (100 µF)', x, y);
    this.capacitance = capacitance; // Farads
    this.chargeVoltage = 0; // Current voltage across plates
    this.radius = 28;
    this.pins = [
      { id: this.id + '_p', name: '+', relX: -26, relY: 0, voltage: 0 },
      { id: this.id + '_n', name: '-', relX: 26, relY: 0, voltage: 0 }
    ];
  }

  getConductance() {
    return 1 / 15; // Dynamic model
  }

  drawSchematic(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);

    // Terminals
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-28, 0); ctx.lineTo(-8, 0);
    ctx.moveTo(8, 0); ctx.lineTo(28, 0);
    ctx.stroke();

    // Straight Plate (+)
    ctx.strokeStyle = '#00FF87';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-8, -16); ctx.lineTo(-8, 16);
    ctx.stroke();

    // Curved Plate (-) for Electrolytic
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(14, 0, 16, Math.PI * 0.7, Math.PI * 1.3);
    ctx.stroke();

    // + sign
    ctx.fillStyle = '#00FF87';
    ctx.font = 'bold 11px JetBrains Mono';
    ctx.fillText('+', -18, -10);

    // Label
    ctx.fillStyle = '#F8FAFC';
    ctx.font = '10px JetBrains Mono';
    ctx.textAlign = 'center';
    ctx.fillText('100 µF', 0, 24);

    ctx.restore();
  }

  drawBreadboard(ctx) {
    this.drawSchematic(ctx);
  }
}

/* ==========================================================================
   11. NPN BIPOLAR TRANSISTOR (2N2222)
   ========================================================================== */
class TransistorNpnComponent extends CircuitComponent {
  constructor(x, y) {
    super(null, 'transistor_npn', 'NPN Tranzistor (2N2222)', x, y);
    this.beta = 100; // Gain hFE
    this.radius = 32;
    this.pins = [
      { id: this.id + '_c', name: 'C', relX: 20, relY: -22, voltage: 0 },
      { id: this.id + '_b', name: 'B', relX: -26, relY: 0, voltage: 0 },
      { id: this.id + '_e', name: 'E', relX: 20, relY: 22, voltage: 0 }
    ];
  }

  drawSchematic(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);

    // Base terminal line
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-26, 0); ctx.lineTo(-8, 0);
    ctx.stroke();

    // Base vertical bar
    ctx.strokeStyle = '#F8FAFC';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(-8, -16); ctx.lineTo(-8, 16);
    ctx.stroke();

    // Collector lead (angled)
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-8, -8); ctx.lineTo(14, -20); ctx.lineTo(20, -20);
    ctx.stroke();

    // Emitter lead with Arrow (NPN points OUT)
    ctx.beginPath();
    ctx.moveTo(-8, 8); ctx.lineTo(14, 20); ctx.lineTo(20, 20);
    ctx.stroke();

    // Emitter arrow tip
    ctx.fillStyle = '#00FF87';
    ctx.beginPath();
    ctx.moveTo(14, 20);
    ctx.lineTo(8, 13);
    ctx.lineTo(13, 11);
    ctx.closePath();
    ctx.fill();

    // Pin labels
    ctx.fillStyle = '#94A3B8';
    ctx.font = 'bold 9px JetBrains Mono';
    ctx.fillText('B', -20, -6);
    ctx.fillText('C', 14, -24);
    ctx.fillText('E', 14, 28);

    ctx.restore();
  }

  drawBreadboard(ctx) {
    this.drawSchematic(ctx);
  }
}

/* ==========================================================================
   12. DC MOTOR (ELECTRIC MOTOR WITH ROTATING PROPELLER)
   ========================================================================== */
class DcMotorComponent extends CircuitComponent {
  constructor(x, y) {
    super(null, 'motor', 'DC Elektrodvigatel', x, y);
    this.resistance = 25; // Ohms
    this.speed = 0; // RPM
    this.angle = 0; // Rotation angle
    this.radius = 34;
    this.pins = [
      { id: this.id + '_p', name: '+', relX: -28, relY: 0, voltage: 0 },
      { id: this.id + '_n', name: '-', relX: 28, relY: 0, voltage: 0 }
    ];
  }

  drawSchematic(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);

    // Terminals
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-32, 0); ctx.lineTo(-18, 0);
    ctx.moveTo(18, 0); ctx.lineTo(32, 0);
    ctx.stroke();

    // Motor Circle
    ctx.strokeStyle = '#00FF87';
    ctx.fillStyle = '#1E293B';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();

    // 'M' letter
    ctx.fillStyle = '#F8FAFC';
    ctx.font = 'bold 14px Oswald';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('M', 0, 0);

    // Rotating 2-blade Propeller indicator if running
    if (Math.abs(this.current) > 0.01) {
      this.angle += (this.current > 0 ? 0.25 : -0.25);
      ctx.save();
      ctx.rotate(this.angle);
      ctx.strokeStyle = '#FBBF24';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-26, 0); ctx.lineTo(26, 0);
      ctx.stroke();
      ctx.restore();
    }

    // RPM label
    ctx.fillStyle = '#38BDF8';
    ctx.font = '9px JetBrains Mono';
    ctx.fillText(`${Math.round(Math.abs(this.speed))} RPM`, 0, 28);

    ctx.restore();
  }

  drawBreadboard(ctx) {
    this.drawSchematic(ctx);
  }
}

/* ==========================================================================
   13. DIGITAL LOGIC GATES (AND, OR, NOT, NAND, NOR, XOR)
   ========================================================================== */
class LogicGateComponent extends CircuitComponent {
  constructor(x, y, gateType = 'and') {
    const names = {
      and: 'VA (AND) Mantiqiy Element',
      or: 'YOKI (OR) Mantiqiy Element',
      not: 'EMAS (NOT) Invertor',
      nand: 'VA-EMAS (NAND) Element',
      nor: 'YOKI-EMAS (NOR) Element',
      xor: 'XOR (Inkor YOKI) Element'
    };
    super(null, 'gate_' + gateType, names[gateType] || 'Mantiqiy Element', x, y);
    this.gateType = gateType;
    this.radius = 32;
    this.outputVoltage = 0;

    if (gateType === 'not') {
      this.pins = [
        { id: this.id + '_in', name: 'A', relX: -28, relY: 0, voltage: 0 },
        { id: this.id + '_out', name: 'Y', relX: 28, relY: 0, voltage: 0 }
      ];
    } else {
      this.pins = [
        { id: this.id + '_a', name: 'A', relX: -28, relY: -12, voltage: 0 },
        { id: this.id + '_b', name: 'B', relX: -28, relY: 12, voltage: 0 },
        { id: this.id + '_out', name: 'Y', relX: 28, relY: 0, voltage: 0 }
      ];
    }
  }

  evaluate() {
    if (this.gateType === 'not') {
      const inA = (this.pins[0].voltage || 0) > 2.0;
      this.outputVoltage = inA ? 0.0 : 5.0;
    } else {
      const inA = (this.pins[0].voltage || 0) > 2.0;
      const inB = (this.pins[1].voltage || 0) > 2.0;
      let out = false;
      if (this.gateType === 'and') out = inA && inB;
      else if (this.gateType === 'or') out = inA || inB;
      else if (this.gateType === 'nand') out = !(inA && inB);
      else if (this.gateType === 'nor') out = !(inA || inB);
      else if (this.gateType === 'xor') out = inA !== inB;
      this.outputVoltage = out ? 5.0 : 0.0;
    }
    const outPin = this.pins[this.pins.length - 1];
    outPin.voltage = this.outputVoltage;
    return this.outputVoltage;
  }

  drawSchematic(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);

    const isHigh = this.outputVoltage > 2.5;

    // Terminal lines
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 2;
    if (this.gateType === 'not') {
      ctx.beginPath();
      ctx.moveTo(-28, 0); ctx.lineTo(-14, 0);
      ctx.moveTo(18, 0); ctx.lineTo(28, 0);
      ctx.stroke();

      // Triangle
      ctx.fillStyle = '#1E293B';
      ctx.strokeStyle = isHigh ? '#00FF87' : '#94A3B8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-14, -16);
      ctx.lineTo(10, 0);
      ctx.lineTo(-14, 16);
      ctx.closePath();
      ctx.fill(); ctx.stroke();

      // Inversion bubble
      ctx.beginPath();
      ctx.arc(14, 0, 4, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      // Inputs A & B
      ctx.beginPath();
      ctx.moveTo(-28, -12); ctx.lineTo(-10, -12);
      ctx.moveTo(-28, 12); ctx.lineTo(-10, 12);
      ctx.moveTo(18, 0); ctx.lineTo(28, 0);
      ctx.stroke();

      // Gate outline
      ctx.fillStyle = '#1E293B';
      ctx.strokeStyle = isHigh ? '#00FF87' : '#94A3B8';
      ctx.lineWidth = 2.5;

      if (this.gateType === 'and' || this.gateType === 'nand') {
        ctx.beginPath();
        ctx.moveTo(-10, -18);
        ctx.lineTo(2, -18);
        ctx.arc(2, 0, 18, -Math.PI / 2, Math.PI / 2);
        ctx.lineTo(-10, 18);
        ctx.closePath();
        ctx.fill(); ctx.stroke();

        if (this.gateType === 'nand') {
          ctx.beginPath();
          ctx.arc(23, 0, 3.5, 0, Math.PI * 2);
          ctx.stroke();
        }
      } else if (this.gateType === 'or' || this.gateType === 'nor' || this.gateType === 'xor') {
        if (this.gateType === 'xor') {
          ctx.beginPath();
          ctx.arc(-18, 0, 20, -Math.PI / 3, Math.PI / 3);
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.moveTo(-10, -18);
        ctx.quadraticCurveTo(8, -16, 20, 0);
        ctx.quadraticCurveTo(8, 16, -10, 18);
        ctx.quadraticCurveTo(-2, 0, -10, -18);
        ctx.closePath();
        ctx.fill(); ctx.stroke();

        if (this.gateType === 'nor') {
          ctx.beginPath();
          ctx.arc(23, 0, 3.5, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    }

    // Name label
    ctx.fillStyle = isHigh ? '#00FF87' : '#F8FAFC';
    ctx.font = 'bold 10px JetBrains Mono';
    ctx.textAlign = 'center';
    ctx.fillText(this.gateType.toUpperCase(), 0, 4);

    // State badge
    ctx.font = '8px JetBrains Mono';
    ctx.fillStyle = isHigh ? '#00FF87' : '#64748B';
    ctx.fillText(`OUT: ${isHigh ? '1 (5V)' : '0 (0V)'}`, 0, 26);

    ctx.restore();
  }

  drawBreadboard(ctx) {
    this.drawSchematic(ctx);
  }
}

/* ==========================================================================
   14. 7-SEGMENT LED DISPLAY (COMMON CATHODE)
   ========================================================================== */
class SevenSegmentComponent extends CircuitComponent {
  constructor(x, y) {
    super(null, 'seven_segment', '7-Segment Displey (LED)', x, y);
    this.radius = 38;
    this.pins = [
      { id: this.id + '_a', name: 'a', relX: -24, relY: -32, voltage: 0 },
      { id: this.id + '_b', name: 'b', relX: -8, relY: -32, voltage: 0 },
      { id: this.id + '_c', name: 'c', relX: 8, relY: -32, voltage: 0 },
      { id: this.id + '_d', name: 'd', relX: 24, relY: -32, voltage: 0 },
      { id: this.id + '_e', name: 'e', relX: -24, relY: 32, voltage: 0 },
      { id: this.id + '_f', name: 'f', relX: -8, relY: 32, voltage: 0 },
      { id: this.id + '_g', name: 'g', relX: 8, relY: 32, voltage: 0 },
      { id: this.id + '_gnd', name: 'GND', relX: 24, relY: 32, voltage: 0 }
    ];
  }

  drawSchematic(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);

    // Module bezel
    ctx.fillStyle = '#0F172A';
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(-28, -32, 56, 64, 6);
    ctx.fill(); ctx.stroke();

    // Segments mapping: a, b, c, d, e, f, g
    const segPins = {
      a: this.pins[0],
      b: this.pins[1],
      c: this.pins[2],
      d: this.pins[3],
      e: this.pins[4],
      f: this.pins[5],
      g: this.pins[6]
    };
    const gnd = this.pins[7].voltage || 0;

    const isLit = (pin) => ((pin.voltage || 0) - gnd) > 1.6;

    const drawSeg = (x1, y1, x2, y2, active) => {
      ctx.strokeStyle = active ? '#EF4444' : 'rgba(239, 68, 68, 0.15)';
      if (active) {
        ctx.shadowColor = '#EF4444';
        ctx.shadowBlur = 8;
      }
      ctx.lineWidth = 4.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    // a (top horizontal)
    drawSeg(-12, -18, 12, -18, isLit(segPins.a));
    // b (top right vertical)
    drawSeg(14, -16, 14, -2, isLit(segPins.b));
    // c (bottom right vertical)
    drawSeg(14, 2, 14, 16, isLit(segPins.c));
    // d (bottom horizontal)
    drawSeg(-12, 18, 12, 18, isLit(segPins.d));
    // e (bottom left vertical)
    drawSeg(-14, 2, -14, 16, isLit(segPins.e));
    // f (top left vertical)
    drawSeg(-14, -16, -14, -2, isLit(segPins.f));
    // g (middle horizontal)
    drawSeg(-12, 0, 12, 0, isLit(segPins.g));

    // Decimal point (DP)
    ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
    ctx.beginPath();
    ctx.arc(20, 18, 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  drawBreadboard(ctx) {
    this.drawSchematic(ctx);
  }
}

/* ==========================================================================
   15. NE555 PRECISION TIMER IC
   ========================================================================== */
class Timer555Component extends CircuitComponent {
  constructor(x, y) {
    super(null, 'timer_555', 'NE555 Taymer Mikrosxemasi', x, y);
    this.radius = 42;
    this.flipFlop = false;
    this.outputVoltage = 0;
    this.pins = [
      { id: this.id + '_1', name: '1:GND', relX: -32, relY: -22, voltage: 0 },
      { id: this.id + '_2', name: '2:TRIG', relX: -32, relY: -7, voltage: 0 },
      { id: this.id + '_3', name: '3:OUT', relX: -32, relY: 7, voltage: 0 },
      { id: this.id + '_4', name: '4:RST', relX: -32, relY: 22, voltage: 0 },
      { id: this.id + '_8', name: '8:VCC', relX: 32, relY: -22, voltage: 0 },
      { id: this.id + '_7', name: '7:DIS', relX: 32, relY: -7, voltage: 0 },
      { id: this.id + '_6', name: '6:THR', relX: 32, relY: 7, voltage: 0 },
      { id: this.id + '_5', name: '5:CV', relX: 32, relY: 22, voltage: 0 }
    ];
  }

  evaluate() {
    const vGnd = this.pins[0].voltage || 0;
    const vTrig = this.pins[1].voltage || 0;
    const vRst = this.pins[3].voltage || 5;
    const vVcc = this.pins[4].voltage || 0;
    const vThr = this.pins[6].voltage || 0;

    const vDiff = Math.max(0, vVcc - vGnd);
    if (vDiff < 3.0) {
      this.outputVoltage = 0;
      this.pins[2].voltage = 0;
      return 0;
    }

    // Comparators: 1/3 VCC and 2/3 VCC
    const vLo = vGnd + vDiff / 3.0;
    const vHi = vGnd + (vDiff * 2.0) / 3.0;

    if (vRst - vGnd < 0.7) {
      this.flipFlop = false;
    } else {
      if (vTrig < vLo) {
        this.flipFlop = true;
      } else if (vThr > vHi) {
        this.flipFlop = false;
      }
    }

    this.outputVoltage = this.flipFlop ? (vVcc - 1.2) : vGnd;
    this.pins[2].voltage = this.outputVoltage;

    if (!this.flipFlop) {
      this.pins[5].voltage = vGnd;
    }

    return this.outputVoltage;
  }

  drawSchematic(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);

    // DIP-8 Body
    ctx.fillStyle = '#0F172A';
    ctx.strokeStyle = '#00FF87';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(-32, -34, 64, 68, 6);
    ctx.fill(); ctx.stroke();

    // Top orientation notch
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, -34, 7, 0, Math.PI);
    ctx.stroke();

    // Chip text
    ctx.fillStyle = '#F8FAFC';
    ctx.font = 'bold 11px JetBrains Mono';
    ctx.textAlign = 'center';
    ctx.fillText('NE555', 0, -6);
    ctx.fillStyle = '#94A3B8';
    ctx.font = '8px JetBrains Mono';
    ctx.fillText('TIMER IC', 0, 8);

    const isHigh = this.outputVoltage > 2.5;
    ctx.fillStyle = isHigh ? '#00FF87' : '#64748B';
    ctx.fillText(`OUT: ${isHigh ? 'HIGH' : 'LOW'}`, 0, 22);

    // Pin labels
    ctx.font = '7px JetBrains Mono';
    ctx.fillStyle = '#38BDF8';
    ctx.textAlign = 'left';
    ctx.fillText('1:GND', -28, -20);
    ctx.fillText('2:TRG', -28, -5);
    ctx.fillText('3:OUT', -28, 9);
    ctx.fillText('4:RST', -28, 24);

    ctx.textAlign = 'right';
    ctx.fillText('8:VCC', 28, -20);
    ctx.fillText('7:DIS', 28, -5);
    ctx.fillText('6:THR', 28, 9);
    ctx.fillText('5:CV', 28, 24);

    ctx.restore();
  }

  drawBreadboard(ctx) {
    this.drawSchematic(ctx);
  }
}

// Global registry
window.CircuitComponents = {
  Battery: BatteryComponent,
  Resistor: ResistorComponent,
  Bulb: BulbComponent,
  Led: LedComponent,
  Switch: SwitchComponent,
  Buzzer: BuzzerComponent,
  Ground: GroundComponent,
  Potentiometer: PotentiometerComponent,
  Ldr: LdrComponent,
  Capacitor: CapacitorComponent,
  TransistorNpn: TransistorNpnComponent,
  TransistorPnp: TransistorPNPComponent,
  MOSFETn: MOSFETNComponent,
  MOSFETp: MOSFETPComponent,
  Inductor: InductorComponent,
  Transformer: TransformerComponent,
  DcMotor: DcMotorComponent,
  LogicGate: LogicGateComponent,
  SevenSegment: SevenSegmentComponent,
  Timer555: Timer555Component,
  Ammeter: AmmeterComponent,
  Voltmeter: VoltmeterComponent,
  Diode: DiodeComponent,
  DcSource: DcSourceComponent
};



/* ==========================================================================
   17. AMMETER (AMPERMETR — Serie ulanadi, tok kuchini o'lchaydi)
   Internal resistance: 0.001 Ω (amalda ideal)
   ========================================================================== */
class AmmeterComponent extends CircuitComponent {
  constructor(x, y) {
    super(null, 'ammeter', 'Ampermetr (A)', x, y);
    this.resistance = 0.001; // ~0 Ohm — ideal ammeter
    this.radius = 30;
    this.maxCurrent = 5.0; // 5A maksimum o'lchash chegarasi
    this.overloaded = false;
    this.pins = [
      { id: this.id + '_p', name: 'A+', relX: -28, relY: 0, voltage: 0 },
      { id: this.id + '_n', name: 'A-', relX: 28, relY: 0, voltage: 0 }
    ];
  }

  getConductance() {
    return 1 / this.resistance; // Juda katta o'tkazuvchanlik
  }

  getReading() {
    const I = Math.abs(this.current || 0);
    this.overloaded = (I > this.maxCurrent);
    if (I >= 1.0) return { val: I.toFixed(3), unit: 'A' };
    if (I >= 0.001) return { val: (I * 1000).toFixed(2), unit: 'mA' };
    return { val: (I * 1000000).toFixed(1), unit: 'µA' };
  }

  drawSchematic(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);

    // Terminal wires
    ctx.strokeStyle = this.overloaded ? '#EF4444' : '#38BDF8';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-28, 0); ctx.lineTo(-18, 0);
    ctx.moveTo(18, 0); ctx.lineTo(28, 0);
    ctx.stroke();

    // Circle body
    const glowColor = this.overloaded ? '#EF4444' : '#38BDF8';
    ctx.strokeStyle = glowColor;
    ctx.lineWidth = 2.5;
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = this.overloaded ? 12 : 6;
    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // "A" label
    ctx.fillStyle = glowColor;
    ctx.font = 'bold 14px JetBrains Mono';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('A', 0, 0);

    // Reading display
    const r = this.getReading();
    ctx.fillStyle = this.overloaded ? '#EF4444' : '#F8FAFC';
    ctx.font = this.overloaded ? 'bold 9px JetBrains Mono' : '9px JetBrains Mono';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(this.overloaded ? '⚠ OL' : `${r.val} ${r.unit}`, 0, 36);

    // Polarity markers
    ctx.font = 'bold 10px JetBrains Mono';
    ctx.fillStyle = '#00FF87';
    ctx.textAlign = 'left';
    ctx.fillText('+', -28, -6);
    ctx.fillStyle = '#EF4444';
    ctx.textAlign = 'right';
    ctx.fillText('−', 28, -6);

    ctx.restore();
  }

  drawBreadboard(ctx) { this.drawSchematic(ctx); }
}

/* ==========================================================================
   18. VOLTMETER (VOLTMETR — Parallel ulanadi, kuchlanishni o'lchaydi)
   Internal resistance: 1,000,000 Ω (10MΩ — ideal voltmeter)
   ========================================================================== */
class VoltmeterComponent extends CircuitComponent {
  constructor(x, y) {
    super(null, 'voltmeter', 'Voltmetr (V)', x, y);
    this.resistance = 1000000; // 1MΩ — ideal voltmeter
    this.radius = 30;
    this.maxVoltage = 50.0; // 50V maksimum
    this.overloaded = false;
    this.pins = [
      { id: this.id + '_p', name: 'V+', relX: -28, relY: 0, voltage: 0 },
      { id: this.id + '_n', name: 'V-', relX: 28, relY: 0, voltage: 0 }
    ];
  }

  getConductance() {
    return 1 / this.resistance; // Juda kichik tok o'tkazadi
  }

  getReading() {
    const V = this.voltageDrop || 0;
    this.overloaded = (Math.abs(V) > this.maxVoltage);
    if (Math.abs(V) >= 1.0) return { val: V.toFixed(3), unit: 'V' };
    if (Math.abs(V) >= 0.001) return { val: (V * 1000).toFixed(2), unit: 'mV' };
    return { val: '0.00', unit: 'V' };
  }

  drawSchematic(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);

    // Terminal wires
    ctx.strokeStyle = this.overloaded ? '#EF4444' : '#A78BFA';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-28, 0); ctx.lineTo(-18, 0);
    ctx.moveTo(18, 0); ctx.lineTo(28, 0);
    ctx.stroke();

    // Circle body
    const glowColor = this.overloaded ? '#EF4444' : '#A78BFA';
    ctx.strokeStyle = glowColor;
    ctx.lineWidth = 2.5;
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = this.overloaded ? 12 : 6;
    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // "V" label
    ctx.fillStyle = glowColor;
    ctx.font = 'bold 14px JetBrains Mono';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('V', 0, 0);

    // Reading display
    const r = this.getReading();
    ctx.fillStyle = this.overloaded ? '#EF4444' : '#F8FAFC';
    ctx.font = this.overloaded ? 'bold 9px JetBrains Mono' : '9px JetBrains Mono';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(this.overloaded ? '⚠ OL' : `${r.val} ${r.unit}`, 0, 36);

    // Polarity markers
    ctx.font = 'bold 10px JetBrains Mono';
    ctx.fillStyle = '#00FF87';
    ctx.textAlign = 'left';
    ctx.fillText('+', -28, -6);
    ctx.fillStyle = '#EF4444';
    ctx.textAlign = 'right';
    ctx.fillText('−', 28, -6);

    ctx.restore();
  }

  drawBreadboard(ctx) { this.drawSchematic(ctx); }
}

/* ==========================================================================
   19. DIODE (1N4007 Yarimo'tkazgich diod — faqat bir yo'nalishda tok o'tkazadi)
   Forward voltage: 0.7V | Reverse blocking
   ========================================================================== */
class DiodeComponent extends CircuitComponent {
  constructor(x, y) {
    super(null, 'diode', 'Diod (1N4007)', x, y);
    this.forwardVoltage = 0.7;   // Kремний diod Vf
    this.internalResistance = 2; // Forward resistance (Ω)
    this.radius = 30;
    this.pins = [
      { id: this.id + '_a', name: 'Anod (+)', relX: -28, relY: 0, voltage: 0 },
      { id: this.id + '_k', name: 'Katod (-)', relX: 28, relY: 0, voltage: 0 }
    ];
  }

  getConductance(vDrop) {
    const v = (vDrop !== undefined) ? vDrop : (this.voltageDrop || 0);
    if (v > this.forwardVoltage) {
      return 1 / this.internalResistance; // Forward bias — tok o'tkazadi
    }
    return 1e-9; // Reverse bias — deyarli tok o'tkazmasmaydi
  }

  drawSchematic(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);

    const isConducting = (this.voltageDrop || 0) > this.forwardVoltage;
    const bodyColor = isConducting ? '#FBBF24' : '#94A3B8';
    const glowIntensity = isConducting ? 8 : 0;

    // Terminal wires
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-28, 0); ctx.lineTo(-14, 0);
    ctx.moveTo(14, 0); ctx.lineTo(28, 0);
    ctx.stroke();

    // Triangle (Anode body)
    ctx.fillStyle = bodyColor;
    ctx.strokeStyle = bodyColor;
    ctx.lineWidth = 2;
    ctx.shadowColor = bodyColor;
    ctx.shadowBlur = glowIntensity;
    ctx.beginPath();
    ctx.moveTo(-14, -14);
    ctx.lineTo(-14, 14);
    ctx.lineTo(14, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Cathode bar
    ctx.strokeStyle = bodyColor;
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(14, -14); ctx.lineTo(14, 14);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Polarity labels
    ctx.fillStyle = '#94A3B8';
    ctx.font = '9px JetBrains Mono';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText('A', -16, -18);
    ctx.fillText('K', 16, -18);

    // Status
    ctx.fillStyle = isConducting ? '#FBBF24' : '#475569';
    ctx.font = '9px JetBrains Mono';
    ctx.fillText(isConducting ? `↑ ${(this.current * 1000).toFixed(1)}mA` : 'BLOCK', 0, 32);

    ctx.restore();
  }

  drawBreadboard(ctx) { this.drawSchematic(ctx); }
}

/* ==========================================================================
   20. DC SOURCE (Sozlanuvchi to'g'ridan-to'g'ri tok manbai — 1..30V)
   ========================================================================== */
class DcSourceComponent extends CircuitComponent {
  constructor(x, y, voltage = 5.0) {
    super(null, 'dc_source', `DC Manba ${voltage}V`, x, y);
    this.voltage = voltage;
    this.radius = 34;
    this.pins = [
      { id: this.id + '_p', name: '+', relX: -26, relY: 0, voltage: 0 },
      { id: this.id + '_n', name: '-', relX: 26, relY: 0, voltage: 0 }
    ];
  }

  drawSchematic(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);

    // Terminal wires
    ctx.strokeStyle = '#F8FAFC';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-36, 0); ctx.lineTo(-18, 0);
    ctx.moveTo(18, 0); ctx.lineTo(36, 0);
    ctx.stroke();

    // Outer circle
    ctx.strokeStyle = '#F97316';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#F97316';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Inner symbol: sine-like wave replaced by DC flat line with arrow
    ctx.strokeStyle = '#F97316';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-10, 0); ctx.lineTo(10, 0);
    ctx.moveTo(6, -4); ctx.lineTo(10, 0); ctx.lineTo(6, 4);
    ctx.stroke();

    // Polarity
    ctx.fillStyle = '#00FF87';
    ctx.font = 'bold 11px JetBrains Mono';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('+', -26, -10);
    ctx.fillStyle = '#EF4444';
    ctx.fillText('−', 26, -10);

    // Value
    ctx.fillStyle = '#F8FAFC';
    ctx.font = '11px Plus Jakarta Sans';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(`${this.voltage}V DC`, 0, 36);

    ctx.restore();
  }

  drawBreadboard(ctx) { this.drawSchematic(ctx); }
}
/* ==========================================================================
   19. PNP BIPOLAR TRANSISTOR (2N3906 / BC557)
   Pinlar: Emitter(E) [0], Base(B) [1], Collector(C) [2]
   ========================================================================== */
class TransistorPNPComponent extends CircuitComponent {
  constructor(x, y) {
    super(null, 'transistor_pnp', 'PNP Tranzistor (2N3906)', x, y);
    this.beta = 100;         // Kuchayish koeffitsienti hFE
    this.radius = 32;
    this.pins = [
      { id: this.id + '_e', name: 'E', relX: 22, relY: -18, voltage: 0 },  // Emitter (yuqori)
      { id: this.id + '_b', name: 'B', relX: -26, relY: 0, voltage: 0 },   // Base
      { id: this.id + '_c', name: 'C', relX: 22, relY: 18, voltage: 0 }    // Collector (quyi)
    ];
  }

  drawSchematic(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);

    const vB = this.pins[1].voltage || 0;
    const vE = this.pins[0].voltage || 0;
    const conducting = (vE - vB) > 0.65;

    // Terminal wires
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-26, 0); ctx.lineTo(-12, 0);
    ctx.moveTo(12, -12); ctx.lineTo(22, -18);
    ctx.moveTo(12, 12); ctx.lineTo(22, 18);
    ctx.stroke();

    // Body circle
    ctx.fillStyle = '#1E293B';
    ctx.strokeStyle = conducting ? '#A78BFA' : '#64748B';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, 0, 20, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();

    // Base line (vertical)
    ctx.strokeStyle = conducting ? '#A78BFA' : '#94A3B8';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-12, -18); ctx.lineTo(-12, 18);
    ctx.stroke();

    // Emitter line (with arrow INWARD for PNP)
    ctx.beginPath();
    ctx.moveTo(-12, -10); ctx.lineTo(12, -16);
    ctx.stroke();
    // PNP arrow (pointing inward toward base)
    const angle1 = Math.atan2(-10 - (-16), -12 - 12);
    ctx.save();
    ctx.translate(-12 + 8, -10 - 3);
    ctx.rotate(angle1);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(8, -4);
    ctx.lineTo(8, 4);
    ctx.closePath();
    ctx.fillStyle = conducting ? '#A78BFA' : '#94A3B8';
    ctx.fill();
    ctx.restore();

    // Collector line
    ctx.strokeStyle = conducting ? '#A78BFA' : '#94A3B8';
    ctx.beginPath();
    ctx.moveTo(-12, 10); ctx.lineTo(12, 16);
    ctx.stroke();

    // Pin labels
    ctx.fillStyle = '#94A3B8';
    ctx.font = 'bold 9px JetBrains Mono';
    ctx.textAlign = 'center';
    ctx.fillText('E', 28, -18);
    ctx.fillText('B', -32, 4);
    ctx.fillText('C', 28, 18);

    // IC label
    ctx.fillStyle = conducting ? '#A78BFA' : '#64748B';
    ctx.font = 'bold 9px JetBrains Mono';
    ctx.fillText('PNP', 0, 5);

    // Current display
    if (Math.abs(this.current) > 0.0001) {
      ctx.fillStyle = '#A78BFA';
      ctx.font = '9px JetBrains Mono';
      ctx.fillText((Math.abs(this.current) * 1000).toFixed(1) + 'mA', 0, 34);
    }

    ctx.restore();
  }

  drawBreadboard(ctx) { this.drawSchematic(ctx); }
}

/* ==========================================================================
   20. N-CHANNEL MOSFET (2N7000 / IRF540N)
   Pinlar: Gate(G) [0], Drain(D) [1], Source(S) [2]
   ========================================================================== */
class MOSFETNComponent extends CircuitComponent {
  constructor(x, y) {
    super(null, 'mosfet_n', 'N-MOSFET (2N7000)', x, y);
    this.Vth = 2.0;          // Threshold kuchlanish (V)
    this.K = 0.5;            // Transconductance parametri (A/V²)
    this.radius = 32;
    this.pins = [
      { id: this.id + '_g', name: 'G', relX: -26, relY: 0, voltage: 0 },   // Gate
      { id: this.id + '_d', name: 'D', relX: 20, relY: -20, voltage: 0 },  // Drain
      { id: this.id + '_s', name: 'S', relX: 20, relY: 20, voltage: 0 }    // Source
    ];
  }

  // MOSFET mintaqasini aniqlash
  getRegion(vGs, vDs) {
    const vTh = this.Vth;
    if (vGs < vTh) return 'cutoff';
    if (vDs < (vGs - vTh)) return 'linear';
    return 'saturation';
  }

  getCurrent(vGs, vDs) {
    const K = this.K;
    const vTh = this.Vth;
    const region = this.getRegion(vGs, vDs);
    if (region === 'cutoff') return 0;
    if (region === 'linear') return K * ((vGs - vTh) * vDs - 0.5 * vDs * vDs);
    return 0.5 * K * (vGs - vTh) ** 2; // Saturation
  }

  drawSchematic(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);

    const vGs = (this.pins[0].voltage || 0) - (this.pins[2].voltage || 0);
    const vDs = (this.pins[1].voltage || 0) - (this.pins[2].voltage || 0);
    const region = this.getRegion(vGs, vDs);
    const isOn = region !== 'cutoff';

    // Terminals
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-26, 0); ctx.lineTo(-14, 0);     // Gate
    ctx.moveTo(14, -10); ctx.lineTo(20, -20);   // Drain
    ctx.moveTo(14, 10); ctx.lineTo(20, 20);     // Source
    ctx.stroke();

    // Body
    ctx.fillStyle = '#1E293B';
    ctx.strokeStyle = isOn ? '#F97316' : '#64748B';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, 0, 20, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();

    // Gate insulator (dashed line)
    ctx.strokeStyle = isOn ? '#F97316' : '#94A3B8';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([2, 2]);
    ctx.beginPath();
    ctx.moveTo(-8, -18); ctx.lineTo(-8, 18);
    ctx.stroke();
    ctx.setLineDash([]);

    // Channel
    ctx.beginPath();
    ctx.moveTo(-4, -12); ctx.lineTo(14, -10);
    ctx.moveTo(-4, 12); ctx.lineTo(14, 10);
    if (isOn) {
      ctx.moveTo(-4, -12); ctx.lineTo(-4, 12);
    }
    ctx.stroke();

    // Arrow (N-channel: pointing inward)
    ctx.fillStyle = isOn ? '#F97316' : '#94A3B8';
    ctx.beginPath();
    ctx.moveTo(-4, 0);
    ctx.lineTo(-10, -5);
    ctx.lineTo(-10, 5);
    ctx.closePath();
    ctx.fill();

    // Labels
    ctx.font = 'bold 8px JetBrains Mono';
    ctx.fillStyle = '#94A3B8';
    ctx.textAlign = 'center';
    ctx.fillText('G', -32, 4);
    ctx.fillText('D', 26, -18);
    ctx.fillText('S', 26, 18);
    ctx.fillStyle = isOn ? '#F97316' : '#64748B';
    ctx.fillText('NMOS', 0, 5);

    // Region badge
    const regionColors = { cutoff: '#64748B', linear: '#38BDF8', saturation: '#F97316' };
    ctx.fillStyle = regionColors[region];
    ctx.font = '8px JetBrains Mono';
    ctx.fillText(region.toUpperCase(), 0, 34);

    ctx.restore();
  }

  drawBreadboard(ctx) { this.drawSchematic(ctx); }
}

/* ==========================================================================
   21. P-CHANNEL MOSFET (IRF9540 / BS250)
   Pinlar: Gate(G) [0], Drain(D) [1], Source(S) [2]
   ========================================================================== */
class MOSFETPComponent extends CircuitComponent {
  constructor(x, y) {
    super(null, 'mosfet_p', 'P-MOSFET (IRF9540)', x, y);
    this.Vth = -2.0;
    this.K = 0.5;
    this.radius = 32;
    this.pins = [
      { id: this.id + '_g', name: 'G', relX: -26, relY: 0, voltage: 0 },
      { id: this.id + '_d', name: 'D', relX: 20, relY: -20, voltage: 0 },
      { id: this.id + '_s', name: 'S', relX: 20, relY: 20, voltage: 0 }
    ];
  }

  getRegion(vGs, vDs) {
    if (vGs > this.Vth) return 'cutoff';
    if (vDs > (vGs - this.Vth)) return 'linear';
    return 'saturation';
  }

  drawSchematic(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);

    const vGs = (this.pins[0].voltage || 0) - (this.pins[2].voltage || 0);
    const vDs = (this.pins[1].voltage || 0) - (this.pins[2].voltage || 0);
    const isOn = this.getRegion(vGs, vDs) !== 'cutoff';

    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-26, 0); ctx.lineTo(-14, 0);
    ctx.moveTo(14, -10); ctx.lineTo(20, -20);
    ctx.moveTo(14, 10); ctx.lineTo(20, 20);
    ctx.stroke();

    ctx.fillStyle = '#1E293B';
    ctx.strokeStyle = isOn ? '#A78BFA' : '#64748B';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, 0, 20, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();

    ctx.strokeStyle = isOn ? '#A78BFA' : '#94A3B8';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([2, 2]);
    ctx.beginPath();
    ctx.moveTo(-8, -18); ctx.lineTo(-8, 18);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.beginPath();
    ctx.moveTo(-4, -12); ctx.lineTo(14, -10);
    ctx.moveTo(-4, 12); ctx.lineTo(14, 10);
    if (isOn) { ctx.moveTo(-4, -12); ctx.lineTo(-4, 12); }
    ctx.stroke();

    // P-channel arrow (pointing outward)
    ctx.fillStyle = isOn ? '#A78BFA' : '#94A3B8';
    ctx.beginPath();
    ctx.moveTo(-10, 0);
    ctx.lineTo(-4, -5);
    ctx.lineTo(-4, 5);
    ctx.closePath();
    ctx.fill();

    ctx.font = 'bold 8px JetBrains Mono';
    ctx.fillStyle = '#94A3B8';
    ctx.textAlign = 'center';
    ctx.fillText('G', -32, 4);
    ctx.fillText('D', 26, -18);
    ctx.fillText('S', 26, 18);
    ctx.fillStyle = isOn ? '#A78BFA' : '#64748B';
    ctx.fillText('PMOS', 0, 5);
    ctx.restore();
  }

  drawBreadboard(ctx) { this.drawSchematic(ctx); }
}

/* ==========================================================================
   22. INDUCTOR / COIL — Katushka (L)
   Pinlar: pin1 [0], pin2 [1]
   ========================================================================== */
class InductorComponent extends CircuitComponent {
  constructor(x, y, inductance = 0.001) {
    super(null, 'inductor', 'Induktivlik / Katushka', x, y);
    this.inductance = inductance; // Henri (H)
    this.inductanceLabel = inductance >= 1 ? inductance.toFixed(1) + ' H' :
                           inductance >= 0.001 ? (inductance * 1000).toFixed(1) + ' mH' :
                           (inductance * 1e6).toFixed(0) + ' µH';
    this.radius = 32;
    this.chargeVoltage = 0; // vL tranzient
    this.currentL = 0;      // Katushka toki
    this.pins = [
      { id: this.id + '_1', name: '1', relX: -32, relY: 0, voltage: 0 },
      { id: this.id + '_2', name: '2', relX: 32, relY: 0, voltage: 0 }
    ];
  }

  // Ekvivalent qarshilik (induktivlik uchun AC impedansi ω×L)
  getConductance(v) {
    const Rl = 1.0; // Katushka ichki qarshilik (∼1Ω)
    return 1 / Math.max(Rl, 1);
  }

  drawSchematic(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);

    const energized = Math.abs(this.current) > 0.001;

    // Terminal wires
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-32, 0); ctx.lineTo(-22, 0);
    ctx.moveTo(22, 0); ctx.lineTo(32, 0);
    ctx.stroke();

    // Spiral coil — 4 ta yarim aylana
    ctx.strokeStyle = energized ? '#FBBF24' : '#94A3B8';
    ctx.lineWidth = 2.5;
    if (energized) {
      ctx.shadowColor = 'rgba(251,191,36,0.6)';
      ctx.shadowBlur = 6;
    }
    ctx.beginPath();
    const coilCenters = [-16, -8, 0, 8, 16];
    for (let i = 0; i < coilCenters.length - 1; i++) {
      ctx.arc(coilCenters[i] + 4, 0, 6, Math.PI, 0);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Mag-core (to'liq katushka uchun) — ikki parallel chiziq
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-20, 9); ctx.lineTo(20, 9);
    ctx.moveTo(-20, 12); ctx.lineTo(20, 12);
    ctx.stroke();

    // Value
    ctx.fillStyle = '#F8FAFC';
    ctx.font = '10px JetBrains Mono';
    ctx.textAlign = 'center';
    ctx.fillText(this.inductanceLabel, 0, -14);

    // Current
    if (Math.abs(this.current) > 0.001) {
      ctx.fillStyle = '#FBBF24';
      ctx.font = '9px JetBrains Mono';
      ctx.fillText((Math.abs(this.current) * 1000).toFixed(1) + 'mA', 0, 26);
    }

    ctx.restore();
  }

  drawBreadboard(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);

    // Silindrli katushka ko'rinishi
    const energized = Math.abs(this.current) > 0.001;
    ctx.fillStyle = '#1E293B';
    ctx.strokeStyle = energized ? '#FBBF24' : '#475569';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(-22, -10, 44, 20, 4);
    ctx.fill(); ctx.stroke();

    // Spiral chiziqlar
    ctx.strokeStyle = energized ? '#FBBF24' : '#94A3B8';
    ctx.lineWidth = 1.5;
    [-12, -4, 4, 12].forEach(cx => {
      ctx.beginPath();
      ctx.arc(cx, 0, 6, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Terminal wires
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-32, 0); ctx.lineTo(-22, 0);
    ctx.moveTo(22, 0); ctx.lineTo(32, 0);
    ctx.stroke();

    ctx.fillStyle = '#F8FAFC';
    ctx.font = '9px JetBrains Mono';
    ctx.textAlign = 'center';
    ctx.fillText('L', 0, 0);

    ctx.restore();
  }
}

/* ==========================================================================
   23. TRANSFORMER — Ideal Transformator (n1:n2)
   Pinlar: Prim-1 [0], Prim-2 [1], Sec-1 [2], Sec-2 [3]
   ========================================================================== */
class TransformerComponent extends CircuitComponent {
  constructor(x, y, n1 = 1, n2 = 1) {
    super(null, 'transformer', `Transformator (${n1}:${n2})`, x, y);
    this.n1 = n1; // Birlamchi o'ramlar soni
    this.n2 = n2; // Ikkilamchi o'ramlar soni
    this.ratio = n2 / n1; // Kuchlanish nisbati
    this.radius = 42;
    this.pins = [
      { id: this.id + '_p1', name: 'P1', relX: -38, relY: -16, voltage: 0 }, // Birlamchi +
      { id: this.id + '_p2', name: 'P2', relX: -38, relY: 16, voltage: 0 },  // Birlamchi -
      { id: this.id + '_s1', name: 'S1', relX: 38, relY: -16, voltage: 0 },  // Ikkilamchi +
      { id: this.id + '_s2', name: 'S2', relX: 38, relY: 16, voltage: 0 }    // Ikkilamchi -
    ];
  }

  // Ikkilamchi kuchlanishni hisoblash
  getSecVoltage() {
    const vP = (this.pins[0].voltage || 0) - (this.pins[1].voltage || 0);
    return vP * this.ratio;
  }

  drawSchematic(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);

    const vPrim = Math.abs((this.pins[0].voltage || 0) - (this.pins[1].voltage || 0));
    const active = vPrim > 0.5;

    // Terminal wires
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-38, -16); ctx.lineTo(-26, -16);
    ctx.moveTo(-38, 16); ctx.lineTo(-26, 16);
    ctx.moveTo(26, -16); ctx.lineTo(38, -16);
    ctx.moveTo(26, 16); ctx.lineTo(38, 16);
    ctx.stroke();

    // Primary coil (chap)
    ctx.strokeStyle = active ? '#38BDF8' : '#64748B';
    ctx.lineWidth = 2.5;
    if (active) { ctx.shadowColor = 'rgba(56,189,248,0.5)'; ctx.shadowBlur = 5; }
    ctx.beginPath();
    [-16, -8, 0, 8].forEach(cy => {
      ctx.arc(-22, cy, 6, Math.PI * 1.5, Math.PI * 0.5);
    });
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Secondary coil (o'ng)
    ctx.strokeStyle = active ? '#00FF87' : '#64748B';
    if (active) { ctx.shadowColor = 'rgba(0,255,135,0.5)'; ctx.shadowBlur = 5; }
    ctx.beginPath();
    [-16, -8, 0, 8].forEach(cy => {
      ctx.arc(22, cy, 6, -Math.PI * 0.5, Math.PI * 0.5);
    });
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Core lines (markazda)
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-4, -22); ctx.lineTo(-4, 22);
    ctx.moveTo(4, -22); ctx.lineTo(4, 22);
    ctx.stroke();

    // Polarity dots
    ctx.fillStyle = '#F8FAFC';
    ctx.beginPath(); ctx.arc(-24, -20, 3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(24, -20, 3, 0, Math.PI * 2); ctx.fill();

    // Labels
    ctx.fillStyle = '#94A3B8';
    ctx.font = '10px JetBrains Mono';
    ctx.textAlign = 'center';
    ctx.fillText(`${this.n1}:${this.n2}`, 0, 32);
    ctx.fillStyle = '#38BDF8';
    ctx.font = '9px JetBrains Mono';
    ctx.fillText('P', -24, -28);
    ctx.fillStyle = '#00FF87';
    ctx.fillText('S', 24, -28);

    // Ikkilamchi kuchlanish
    if (active) {
      const vSec = this.getSecVoltage();
      ctx.fillStyle = '#00FF87';
      ctx.font = '9px Plus Jakarta Sans';
      ctx.fillText(`Vs=${vSec.toFixed(1)}V`, 0, -32);
    }

    ctx.restore();
  }

  drawBreadboard(ctx) { this.drawSchematic(ctx); }
}


