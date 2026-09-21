/* ==========================================================================
   ARDUINO UNO R3 SIMULATION ENGINE & COMPONENT
   ATT-25 Circuit Lab - Microcontroller Simulation & C++ Code Runner
   ========================================================================== */

// Standard Examples Library in Uzbek
const ARDUINO_EXAMPLES = {
  blink: {
    name: "1. LED Miltillash (Blink - D13)",
    code: `// ATT-25 Arduino Uno - 13-pindagi LED miltillashi
// Built-in 'L' LED va D13 piniga ulangan tashqi LED

void setup() {
  pinMode(13, OUTPUT);
  Serial.begin(9600);
  Serial.println("Blink dasturi ishga tushdi!");
}

void loop() {
  digitalWrite(13, HIGH); // LEDni yoqish (5V)
  Serial.println("LED: Yondi (HIGH)");
  delay(500);             // 500 millisekund kutish

  digitalWrite(13, LOW);  // LEDni o'chirish (0V)
  Serial.println("LED: O'chdi (LOW)");
  delay(500);             // 500 millisekund kutish
}`
  },

  traffic: {
    name: "2. Svetofor Loyihasi (D13, D12, D11)",
    code: `// ATT-25 Arduino Svetofor loyihasi
// D13 - Qizil LED, D12 - Sariq LED, D11 - Yashil LED

void setup() {
  pinMode(13, OUTPUT); // Qizil
  pinMode(12, OUTPUT); // Sariq
  pinMode(11, OUTPUT); // Yashil
  Serial.begin(9600);
  Serial.println("Svetofor ishga tushdi!");
}

void loop() {
  // 1. QIZIL chiroq
  Serial.println(">> QIZIL: To'xtang!");
  digitalWrite(13, HIGH);
  digitalWrite(12, LOW);
  digitalWrite(11, LOW);
  delay(3000);

  // 2. QIZIL + SARIQ
  Serial.println(">> SARIQ: Tayyorlaning...");
  digitalWrite(12, HIGH);
  delay(1000);

  // 3. YASHIL chiroq
  Serial.println(">> YASHIL: Harakatlaning!");
  digitalWrite(13, LOW);
  digitalWrite(12, LOW);
  digitalWrite(11, HIGH);
  delay(3000);

  // 4. SARIQ miltillash
  Serial.println(">> SARIQ: Diqqat!");
  digitalWrite(11, LOW);
  for (int i = 0; i < 3; i++) {
    digitalWrite(12, HIGH);
    delay(300);
    digitalWrite(12, LOW);
    delay(300);
  }
}`
  },

  button: {
    name: "3. Tugmacha va LED (Input Pullup)",
    code: `// D2 - Tugmacha (GND ga ulangan, INPUT_PULLUP)
// D13 - LED (Tugmacha bosilganda yonadi)

void setup() {
  pinMode(2, INPUT_PULLUP);
  pinMode(13, OUTPUT);
  Serial.begin(9600);
  Serial.println("Tugmacha nazoratchisi faol.");
}

void loop() {
  int holat = digitalRead(2);

  if (holat == LOW) { // Tugmacha bosildi (GND ga tutashdi)
    digitalWrite(13, HIGH);
    Serial.println("Tugmacha BOSILDI -> LED YONDI");
  } else {
    digitalWrite(13, LOW);
  }
  delay(50);
}`
  },

  pwm: {
    name: "4. PWM Dimmer (AnalogRead A0 & PWM D9)",
    code: `// A0 - Potensiometr o'rta chiqishi (0..5V)
// D9 - LED (PWM orqali silliq yorug'lik)

void setup() {
  pinMode(9, OUTPUT);
  Serial.begin(9600);
  Serial.println("PWM Dimmer tizimi faol.");
}

void loop() {
  int potQiymat = analogRead(A0); // 0 dan 1023 gacha
  int yoruglik = potQiymat / 4;    // 0 dan 255 gacha (PWM)

  analogWrite(9, yoruglik);

  Serial.print("A0: ");
  Serial.print(potQiymat);
  Serial.print(" | PWM: ");
  Serial.println(yoruglik);

  delay(100);
}`
  },

  seven_segment: {
    name: "5. 7-Segmentli Hisoblagich (0-9 sanovchi)",
    code: `// D2..D8 pinlari 7-segment displeyning a,b,c,d,e,f,g segmentlariga
const byte raqamlar[10] = {
  0b00111111, // 0
  0b00000110, // 1
  0b01011011, // 2
  0b01001111, // 3
  0b01100110, // 4
  0b01101101, // 5
  0b01111101, // 6
  0b00000111, // 7
  0b01111111, // 8
  0b01101111  // 9
};

void setup() {
  for (int p = 2; p <= 8; p++) {
    pinMode(p, OUTPUT);
  }
  Serial.begin(9600);
  Serial.println("7-Segment 0..9 hisoblagich boshlandi!");
}

void loop() {
  for (int i = 0; i < 10; i++) {
    byte mask = raqamlar[i];
    for (int p = 2; p <= 8; p++) {
      int bit = (mask >> (p - 2)) & 1;
      digitalWrite(p, bit ? HIGH : LOW);
    }
    Serial.print("Raqam: ");
    Serial.println(i);
    delay(1000);
  }
}`
  }
};

/* ==========================================================================
   ARDUINO COMPONENT CLASS (CIRCUIT LAB INTEGRATION)
   ========================================================================== */
class ArduinoComponent extends CircuitComponent {
  constructor(x = 200, y = 200) {
    super(null, 'arduino_uno', 'Arduino Uno R3', x, y);
    this.radius = 80;
    this.width = 190;
    this.height = 140;

    // Pin definitions (Physical positions on Uno R3 board)
    // Top header: AREF, GND, D13..D8, D7..D0
    // Bottom header: RESET, 3V3, 5V, GND1, GND2, VIN, A0..A5
    this.pins = [
      // Top header (right to left on real board, relY = -62)
      { id: this.id + '_aref', name: 'AREF', relX: -76, relY: -62, voltage: 0, isAnalog: false },
      { id: this.id + '_gnd0', name: 'GND', relX: -66, relY: -62, voltage: 0, isGround: true },
      { id: this.id + '_d13', name: 'D13', relX: -56, relY: -62, voltage: 0, pinNum: 13, isPwm: false },
      { id: this.id + '_d12', name: 'D12', relX: -46, relY: -62, voltage: 0, pinNum: 12, isPwm: false },
      { id: this.id + '_d11', name: 'D11~', relX: -36, relY: -62, voltage: 0, pinNum: 11, isPwm: true },
      { id: this.id + '_d10', name: 'D10~', relX: -26, relY: -62, voltage: 0, pinNum: 10, isPwm: true },
      { id: this.id + '_d9', name: 'D9~', relX: -16, relY: -62, voltage: 0, pinNum: 9, isPwm: true },
      { id: this.id + '_d8', name: 'D8', relX: -6, relY: -62, voltage: 0, pinNum: 8, isPwm: false },

      { id: this.id + '_d7', name: 'D7', relX: 10, relY: -62, voltage: 0, pinNum: 7, isPwm: false },
      { id: this.id + '_d6', name: 'D6~', relX: 20, relY: -62, voltage: 0, pinNum: 6, isPwm: true },
      { id: this.id + '_d5', name: 'D5~', relX: 30, relY: -62, voltage: 0, pinNum: 5, isPwm: true },
      { id: this.id + '_d4', name: 'D4', relX: 40, relY: -62, voltage: 0, pinNum: 4, isPwm: false },
      { id: this.id + '_d3', name: 'D3~', relX: 50, relY: -62, voltage: 0, pinNum: 3, isPwm: true },
      { id: this.id + '_d2', name: 'D2', relX: 60, relY: -62, voltage: 0, pinNum: 2, isPwm: false },
      { id: this.id + '_d1', name: 'D1/TX', relX: 70, relY: -62, voltage: 0, pinNum: 1, isPwm: false },
      { id: this.id + '_d0', name: 'D0/RX', relX: 80, relY: -62, voltage: 0, pinNum: 0, isPwm: false },

      // Bottom header (relY = 62)
      { id: this.id + '_rst', name: 'RESET', relX: -76, relY: 62, voltage: 5.0 },
      { id: this.id + '_3v3', name: '3.3V', relX: -66, relY: 62, voltage: 3.3, isPower: true },
      { id: this.id + '_5v', name: '5V', relX: -56, relY: 62, voltage: 5.0, isPower: true },
      { id: this.id + '_gnd1', name: 'GND', relX: -46, relY: 62, voltage: 0, isGround: true },
      { id: this.id + '_gnd2', name: 'GND', relX: -36, relY: 62, voltage: 0, isGround: true },
      { id: this.id + '_vin', name: 'VIN', relX: -26, relY: 62, voltage: 0 },

      { id: this.id + '_a0', name: 'A0', relX: -6, relY: 62, voltage: 0, analogNum: 0 },
      { id: this.id + '_a1', name: 'A1', relX: 10, relY: 62, voltage: 0, analogNum: 1 },
      { id: this.id + '_a2', name: 'A2', relX: 26, relY: 62, voltage: 0, analogNum: 2 },
      { id: this.id + '_a3', name: 'A3', relX: 42, relY: 62, voltage: 0, analogNum: 3 },
      { id: this.id + '_a4', name: 'A4', relX: 58, relY: 62, voltage: 0, analogNum: 4 },
      { id: this.id + '_a5', name: 'A5', relX: 74, relY: 62, voltage: 0, analogNum: 5 }
    ];

    // Microcontroller Virtual State
    this.pinModes = new Array(14).fill('INPUT');
    this.digitalOutputs = new Array(14).fill(0); // 0 or 1
    this.pwmOutputs = new Array(14).fill(0); // 0 to 255
    this.analogInputs = new Array(6).fill(0); // 0 to 1023

    // Indicators
    this.ledOn = true; // Power LED
    this.ledL = false; // Built-in Pin 13 LED
    this.ledTx = false;
    this.ledRx = false;

    // Code & Runtime
    this.code = ARDUINO_EXAMPLES.blink.code;
    this.isRunning = false;
    this.serialLogs = [];
    this.vm = new ArduinoVM(this);
  }

  isPointInside(px, py) {
    const dx = Math.abs(px - this.x);
    const dy = Math.abs(py - this.y);
    return dx <= this.width / 2 + 10 && dy <= this.height / 2 + 10;
  }

  evaluate() {
    // 1. Maintain Power Pins
    const p5V = this.pins.find(p => p.name === '5V');
    if (p5V) p5V.voltage = 5.0;

    const p3V3 = this.pins.find(p => p.name === '3.3V');
    if (p3V3) p3V3.voltage = 3.3;

    // GND pins
    this.pins.filter(p => p.isGround).forEach(p => p.voltage = 0);

    // 2. Drive Digital Outputs
    for (let i = 0; i <= 13; i++) {
      const pinObj = this.pins.find(p => p.pinNum === i);
      if (!pinObj) continue;

      const mode = this.pinModes[i];
      if (mode === 'OUTPUT') {
        if (pinObj.isPwm && this.pwmOutputs[i] > 0) {
          pinObj.voltage = (this.pwmOutputs[i] / 255.0) * 5.0;
        } else {
          pinObj.voltage = this.digitalOutputs[i] ? 5.0 : 0.0;
        }
      } else if (mode === 'INPUT_PULLUP') {
        // Weak pull-up towards 5V if not driven externally
        if (pinObj.voltage === undefined || isNaN(pinObj.voltage)) {
          pinObj.voltage = 5.0;
        }
      }
    }

    // 3. Read Analog Inputs (A0..A5)
    for (let i = 0; i <= 5; i++) {
      const pinObj = this.pins.find(p => p.analogNum === i);
      if (pinObj) {
        const v = Math.max(0, Math.min(5.0, pinObj.voltage || 0));
        this.analogInputs[i] = Math.round((v / 5.0) * 1023);
      }
    }

    // Update Built-in Pin 13 LED
    this.ledL = this.digitalOutputs[13] > 0 || (this.pins.find(p => p.pinNum === 13)?.voltage || 0) > 2.5;

    return 5.0;
  }

  drawSchematic(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);

    const w = this.width;
    const h = this.height;

    // Arduino Board PCB (Dark Navy Teal)
    ctx.fillStyle = '#064E3B'; // Deep Forest/Teal PCB
    ctx.strokeStyle = '#00FF87';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(-w / 2, -h / 2, w, h, 8);
    ctx.fill();
    ctx.stroke();

    // USB Jack (Silver Metal Box) on left
    ctx.fillStyle = '#94A3B8';
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 1.5;
    ctx.fillRect(-w / 2 - 14, -40, 24, 34);
    ctx.strokeRect(-w / 2 - 14, -40, 24, 34);

    // DC Barrel Jack (Black Box) on bottom-left
    ctx.fillStyle = '#1E293B';
    ctx.strokeStyle = '#475569';
    ctx.fillRect(-w / 2 - 8, 14, 28, 38);
    ctx.strokeRect(-w / 2 - 8, 14, 28, 38);

    // ATmega328P DIP IC in the center
    ctx.fillStyle = '#0F172A';
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(-25, -12, 70, 24, 3);
    ctx.fill(); ctx.stroke();

    ctx.fillStyle = '#F8FAFC';
    ctx.font = 'bold 8px JetBrains Mono';
    ctx.textAlign = 'center';
    ctx.fillText('ATmega328P', 10, 3);

    // Silk screen text: ARDUINO UNO
    ctx.fillStyle = '#F1F5F9';
    ctx.font = 'bold 13px Outfit, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('ARDUINO', -20, -32);
    ctx.font = 'bold 10px Outfit, sans-serif';
    ctx.fillStyle = '#38BDF8';
    ctx.fillText('UNO R3', 44, -32);

    // Silk screen subtitle
    ctx.fillStyle = '#94A3B8';
    ctx.font = '7px JetBrains Mono';
    ctx.fillText('ATT-25 SIMULATOR', -20, -22);

    // Power LED (ON - Green)
    ctx.fillStyle = this.ledOn ? '#00FF87' : '#334155';
    ctx.shadowColor = this.ledOn ? '#00FF87' : 'transparent';
    ctx.shadowBlur = this.ledOn ? 8 : 0;
    ctx.beginPath();
    ctx.arc(68, -26, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#E2E8F0';
    ctx.font = '6px JetBrains Mono';
    ctx.fillText('ON', 65, -34);

    // Built-in 'L' LED (Pin 13 - Amber/Orange)
    const isLOn = this.ledL;
    ctx.fillStyle = isLOn ? '#FBBF24' : '#334155';
    ctx.shadowColor = isLOn ? '#FBBF24' : 'transparent';
    ctx.shadowBlur = isLOn ? 10 : 0;
    ctx.beginPath();
    ctx.arc(68, -12, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#E2E8F0';
    ctx.font = '6px JetBrains Mono';
    ctx.fillText('L', 66, -18);

    // Reset Button
    ctx.fillStyle = '#EF4444';
    ctx.beginPath();
    ctx.arc(-w / 2 + 18, -h / 2 + 18, 5, 0, Math.PI * 2);
    ctx.fill();

    // Draw Pin Headers & Labels
    for (const pin of this.pins) {
      // Header Socket (Black Square)
      ctx.fillStyle = '#020617';
      ctx.fillRect(pin.relX - 4, pin.relY - 4, 8, 8);

      // Pin Hole / Contact
      ctx.fillStyle = pin.voltage > 2.5 ? '#00FF87' : (pin.isGround ? '#64748B' : '#FBBF24');
      ctx.beginPath();
      ctx.arc(pin.relX, pin.relY, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Pin Label
      ctx.fillStyle = '#E2E8F0';
      ctx.font = 'bold 7px JetBrains Mono';
      ctx.textAlign = 'center';
      if (pin.relY < 0) {
        // Top labels
        ctx.fillText(pin.name, pin.relX, pin.relY + 14);
      } else {
        // Bottom labels
        ctx.fillText(pin.name, pin.relX, pin.relY - 8);
      }
    }

    ctx.restore();
  }

  drawBreadboard(ctx) {
    this.drawSchematic(ctx);
  }
}

/* ==========================================================================
   ARDUINO VIRTUAL MACHINE & C++ TRANSPILER
   Safely runs Arduino setup() and loop() with async delay() handling
   ========================================================================== */
class ArduinoVM {
  constructor(component) {
    this.comp = component;
    this.isRunning = false;
    this.timerId = null;
  }

  log(msg) {
    const time = new Date().toLocaleTimeString();
    const formatted = `[${time}] ${msg}`;
    this.comp.serialLogs.push(formatted);
    if (this.comp.serialLogs.length > 200) this.comp.serialLogs.shift();

    // If modal serial monitor is open, update it
    const monitor = document.getElementById('arduinoSerialOutput');
    if (monitor) {
      monitor.textContent = this.comp.serialLogs.join('\n');
      monitor.scrollTop = monitor.scrollHeight;
    }
  }

  clearLog() {
    this.comp.serialLogs = [];
    const monitor = document.getElementById('arduinoSerialOutput');
    if (monitor) monitor.textContent = '';
  }

  // Transpile basic Arduino C++ code to asynchronous JavaScript
  transpile(code) {
    let js = code;

    // Remove comments safely
    js = js.replace(/\/\*[\s\S]*?\*\//g, '');
    js = js.replace(/\/\/.*/g, '');

    // Replace types
    js = js.replace(/\b(int|byte|float|double|long|unsigned long|boolean|bool|char|word|void|const byte|const int)\s+/g, 'let ');

    // Replace Arduino Constants
    js = js.replace(/\bHIGH\b/g, '1');
    js = js.replace(/\bLOW\b/g, '0');
    js = js.replace(/\bOUTPUT\b/g, '"OUTPUT"');
    js = js.replace(/\bINPUT\b/g, '"INPUT"');
    js = js.replace(/\bINPUT_PULLUP\b/g, '"INPUT_PULLUP"');

    // Analog pin constants
    js = js.replace(/\bA0\b/g, '0');
    js = js.replace(/\bA1\b/g, '1');
    js = js.replace(/\bA2\b/g, '2');
    js = js.replace(/\bA3\b/g, '3');
    js = js.replace(/\bA4\b/g, '4');
    js = js.replace(/\bA5\b/g, '5');

    // Transpile delay(ms) -> await delay(ms)
    js = js.replace(/\bdelay\s*\(/g, 'await delay(');

    // Transpile Serial.begin / print / println
    js = js.replace(/\bSerial\.begin\s*\([^)]*\);?/g, '');
    js = js.replace(/\bSerial\.println\s*\(([^)]*)\)/g, 'Serial_println($1)');
    js = js.replace(/\bSerial\.print\s*\(([^)]*)\)/g, 'Serial_print($1)');

    // Transpile setup() and loop() into async functions
    js = js.replace(/\bsetup\s*\(\s*\)/g, 'async function setup()');
    js = js.replace(/\bloop\s*\(\s*\)/g, 'async function loop()');

    return js;
  }

  async run(code) {
    this.stop();
    this.clearLog();
    this.isRunning = true;
    this.comp.isRunning = true;
    this.log("Kompilyatsiya qilinmoqda...");

    try {
      const transpiled = this.transpile(code);

      // Environment sandbox functions
      const comp = this.comp;
      const self = this;

      const pinMode = (pin, mode) => {
        if (pin >= 0 && pin <= 13) {
          comp.pinModes[pin] = mode;
        }
      };

      const digitalWrite = (pin, val) => {
        if (pin >= 0 && pin <= 13) {
          comp.digitalOutputs[pin] = val ? 1 : 0;
          if (pin === 13) comp.ledL = val ? true : false;
        }
      };

      const digitalRead = (pin) => {
        if (pin >= 0 && pin <= 13) {
          const pinObj = comp.pins.find(p => p.pinNum === pin);
          return (pinObj?.voltage || 0) >= 2.5 ? 1 : 0;
        }
        return 0;
      };

      const analogWrite = (pin, val) => {
        if (pin >= 0 && pin <= 13) {
          comp.pwmOutputs[pin] = Math.max(0, Math.min(255, val));
        }
      };

      const analogRead = (pin) => {
        const pNum = typeof pin === 'number' ? pin : parseInt(pin);
        if (pNum >= 0 && pNum <= 5) {
          return comp.analogInputs[pNum] || 0;
        }
        return 0;
      };

      const delay = (ms) => {
        return new Promise(resolve => {
          if (!self.isRunning) return resolve();
          self.timerId = setTimeout(resolve, Math.max(5, ms));
        });
      };

      let printBuffer = '';
      const Serial_print = (msg) => {
        printBuffer += (msg !== undefined ? msg : '');
      };
      const Serial_println = (msg) => {
        printBuffer += (msg !== undefined ? msg : '');
        self.log(printBuffer);
        printBuffer = '';
      };

      // Wrap and execute
      const runner = new Function(
        'pinMode', 'digitalWrite', 'digitalRead', 'analogWrite', 'analogRead',
        'delay', 'Serial_print', 'Serial_println',
        `return (async () => {
          ${transpiled}
          if (typeof setup === 'function') await setup();
          return typeof loop === 'function' ? loop : null;
        })();`
      );

      const loopFn = await runner(
        pinMode, digitalWrite, digitalRead, analogWrite, analogRead,
        delay, Serial_print, Serial_println
      );

      this.log("Yuklandi! Arduino ishlamoqda...");

      // Execute loop repeatedly while running
      if (loopFn) {
        (async () => {
          while (this.isRunning) {
            try {
              await loopFn();
              await delay(10); // yield loop execution
            } catch (err) {
              this.log(`⚠️ Loop Xatolik: ${err.message}`);
              this.stop();
              break;
            }
          }
        })();
      }

    } catch (err) {
      this.log(`❌ Kompilyatsiya Xatosi: ${err.message}`);
      this.stop();
    }
  }

  stop() {
    this.isRunning = false;
    this.comp.isRunning = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    // Turn off outputs
    this.comp.digitalOutputs.fill(0);
    this.comp.pwmOutputs.fill(0);
    this.comp.ledL = false;
    this.log("Arduino to'xtatildi.");
  }
}

// Register in CircuitComponents
if (window.CircuitComponents) {
  window.CircuitComponents.Arduino = ArduinoComponent;
}
window.ArduinoComponent = ArduinoComponent;
window.ARDUINO_EXAMPLES = ARDUINO_EXAMPLES;
