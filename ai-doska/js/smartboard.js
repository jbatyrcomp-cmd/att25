/* ==========================================================================
   ATT-25 AI DOSKA — SMARTBOARD & TOUCH ADAPTER (smartboard.js)
   Interaktiv sensorli doskalar (SMART Board, Promethean, ViewSonic va h.k.)
   uchun avtomatik moslashuv, Multi-touch imo-ishoralar, Kaft bilan o'chirish
   va O'zbek/Lotin + Matematik Virtual Ekran Klaviaturasi.
   ========================================================================== */

class DeviceDetector {
  constructor() {
    this.mode = localStorage.getItem('att25_smartboard_mode') || 'auto'; // 'auto' | 'on' | 'off'
    this.isTouchDevice = false;
    this.isLargeScreen = false;
    this.isSmartboard = false;
    this.listeners = [];

    this.detect();
    window.addEventListener('resize', () => this.detect());
  }

  detect() {
    // 1. Sensorli ekran tekshiruvi (Touch / Pointer coarse)
    const hasCoarsePointer = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    const hasTouchPoints = Boolean(navigator.maxTouchPoints && navigator.maxTouchPoints > 0);
    const hasTouchEvents = 'ontouchstart' in window;
    this.isTouchDevice = hasCoarsePointer || hasTouchPoints || hasTouchEvents;

    // 2. Katta ekran tekshiruvi (Katta dars doskalari: odatda 1024px va undan katta)
    const width = window.innerWidth || document.documentElement.clientWidth;
    const height = window.innerHeight || document.documentElement.clientHeight;
    this.isLargeScreen = width >= 900 && height >= 500;

    // 3. User agent yoki maxsus belgilar
    const ua = (navigator.userAgent || '').toLowerCase();
    const isInteractiveKiosk = ua.includes('smartboard') || ua.includes('promethean') || ua.includes('viewboard') || ua.includes('ideahub');

    // 4. Yakuniy holat
    if (this.mode === 'on') {
      this.isSmartboard = true;
    } else if (this.mode === 'off') {
      this.isSmartboard = false;
    } else {
      // Auto: Sensorli ekran va yetarli o'lcham bo'lsa
      this.isSmartboard = (this.isTouchDevice && this.isLargeScreen) || isInteractiveKiosk || this.isTouchDevice;
    }

    this.applyClass();
    this.notify();
    return this.isSmartboard;
  }

  setMode(newMode) {
    this.mode = newMode;
    localStorage.setItem('att25_smartboard_mode', newMode);
    this.detect();
  }

  applyClass() {
    if (this.isSmartboard) {
      document.body.classList.add('smartboard-mode');
    } else {
      document.body.classList.remove('smartboard-mode');
    }
  }

  onChange(callback) {
    this.listeners.push(callback);
  }

  notify() {
    this.listeners.forEach(cb => {
      try { cb(this.isSmartboard, this.mode); } catch (e) { console.error(e); }
    });
  }
}

/* ==========================================================================
   MULTI-TOUCH IMO-ISHORALAR VA KAFT O'CHIRG'ICH (GESTURE CONTROLLER)
   ========================================================================== */
class MultiTouchController {
  constructor(engine, toolManager) {
    this.engine = engine;
    this.toolManager = toolManager;
    this.activePointers = new Map();

    // Pinch-zoom & Pan holati
    this.initialPinchDist = null;
    this.initialZoom = 1.0;
    this.initialMidWorld = null;
    this.initialPan = { x: 0, y: 0 };
    this.isTwoFingerGesture = false;

    // Long-press (Bosib turish orqali kontekst menyuni chiqarish)
    this.longPressTimer = null;
    this.longPressStartPos = null;
    this.longPressThreshold = 10; // px
    this.longPressDuration = 520; // ms
    this.rippleEl = null;

    // Kaft (Palm) bilan o'chirish holati
    this.isPalmActive = false;
    this.palmEraserRadius = 36; // px

    this.createRippleElement();
  }

  createRippleElement() {
    const r = document.createElement('div');
    r.className = 'touch-longpress-ripple hidden';
    document.body.appendChild(r);
    this.rippleEl = r;
  }

  showRipple(x, y) {
    if (!this.rippleEl) return;
    this.rippleEl.style.left = `${x}px`;
    this.rippleEl.style.top = `${y}px`;
    this.rippleEl.classList.remove('hidden');
    this.rippleEl.classList.remove('animate');
    // Force reflow
    void this.rippleEl.offsetWidth;
    this.rippleEl.classList.add('animate');
  }

  hideRipple() {
    if (!this.rippleEl) return;
    this.rippleEl.classList.add('hidden');
    this.rippleEl.classList.remove('animate');
  }

  // Pointer ro'yxatga olish
  handlePointerDown(e) {
    this.activePointers.set(e.pointerId, {
      id: e.pointerId,
      clientX: e.clientX,
      clientY: e.clientY,
      pointerType: e.pointerType,
      width: e.width || 1,
      height: e.height || 1,
      contactArea: (e.width || 1) * (e.height || 1),
      time: performance.now()
    });

    // 1. Kaft bilan o'chirish (Palm Eraser Detection)
    // Ekranga keng yuzali narsa (kaft, qo'l qirrasi) tegsa
    if (e.pointerType === 'touch' && (e.width > 34 || e.height > 34 || (e.width * e.height) > 1200)) {
      this.isPalmActive = true;
      this.cancelLongPress();
      this.performPalmErase(e.clientX, e.clientY);
      return { handled: true, isPalm: true };
    }

    // 2. Ikki barmoq bosilganda (Pinch-to-zoom & Two-finger Pan)
    if (this.activePointers.size === 2) {
      this.cancelLongPress();
      this.startTwoFingerGesture();
      return { handled: true, isPinch: true };
    }

    // 3. Yakka teginishda Long-Press taymerini ishga tushirish (Sichqonchasiz o'ng klik menyusi)
    if (this.activePointers.size === 1 && e.pointerType !== 'mouse') {
      this.startLongPress(e);
    }

    return { handled: false };
  }

  handlePointerMove(e) {
    if (!this.activePointers.has(e.pointerId)) return { handled: false };

    const ptr = this.activePointers.get(e.pointerId);
    ptr.clientX = e.clientX;
    ptr.clientY = e.clientY;
    ptr.width = e.width || ptr.width;
    ptr.height = e.height || ptr.height;

    // 1. Kaft o'chirish faol bo'lsa
    if (this.isPalmActive) {
      this.performPalmErase(e.clientX, e.clientY);
      return { handled: true };
    }

    // 2. Ikki barmoqli imo-ishora (Pinch Zoom & Pan)
    if (this.isTwoFingerGesture && this.activePointers.size >= 2) {
      this.updateTwoFingerGesture();
      return { handled: true };
    }

    // 3. Long-press tekshiruvi (agar barmoq siljigan bo'lsa bekor qilish)
    if (this.longPressTimer && this.longPressStartPos) {
      const dist = Math.hypot(e.clientX - this.longPressStartPos.x, e.clientY - this.longPressStartPos.y);
      if (dist > this.longPressThreshold) {
        this.cancelLongPress();
      }
    }

    return { handled: false };
  }

  handlePointerUp(e) {
    this.activePointers.delete(e.pointerId);
    this.cancelLongPress();

    if (this.isPalmActive && this.activePointers.size === 0) {
      this.isPalmActive = false;
      this.engine.saveState();
      this.engine.markDirty();
    }

    if (this.isTwoFingerGesture && this.activePointers.size < 2) {
      this.isTwoFingerGesture = false;
      this.initialPinchDist = null;
      this.engine.markDirty();
    }
  }

  startLongPress(e) {
    this.cancelLongPress();
    this.longPressStartPos = { x: e.clientX, y: e.clientY };
    this.showRipple(e.clientX, e.clientY);

    this.longPressTimer = setTimeout(() => {
      this.hideRipple();
      this.longPressTimer = null;
      // Kontekst menyuni chaqirish
      if (this.toolManager && typeof this.toolManager.onContextMenu === 'function') {
        const fakeEv = {
          preventDefault: () => {},
          clientX: this.longPressStartPos.x,
          clientY: this.longPressStartPos.y
        };
        this.toolManager.onContextMenu(fakeEv);
        // Haptic feedback (Vibratsiya - agar qurilma qo'llab-quvvatlasa)
        if (navigator.vibrate) {
          try { navigator.vibrate(40); } catch (err) {}
        }
      }
    }, this.longPressDuration);
  }

  cancelLongPress() {
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }
    this.hideRipple();
  }

  startTwoFingerGesture() {
    const pts = Array.from(this.activePointers.values()).slice(0, 2);
    const p1 = pts[0];
    const p2 = pts[1];

    this.initialPinchDist = Math.hypot(p2.clientX - p1.clientX, p2.clientY - p1.clientY);
    this.initialZoom = this.engine.zoom;
    this.initialPan = { x: this.engine.panX, y: this.engine.panY };

    const midScreen = {
      x: (p1.clientX + p2.clientX) / 2,
      y: (p1.clientY + p2.clientY) / 2
    };
    this.initialMidScreen = midScreen;
    this.initialMidWorld = this.engine.screenToWorld(midScreen.x, midScreen.y);
    this.isTwoFingerGesture = true;
  }

  updateTwoFingerGesture() {
    const pts = Array.from(this.activePointers.values()).slice(0, 2);
    if (pts.length < 2 || !this.initialPinchDist) return;

    const p1 = pts[0];
    const p2 = pts[1];
    const currentDist = Math.hypot(p2.clientX - p1.clientX, p2.clientY - p1.clientY);
    if (currentDist < 5) return;

    // Masshtablash omili (Zoom factor)
    const scale = currentDist / this.initialPinchDist;
    const newZoom = Math.min(4.0, Math.max(0.15, this.initialZoom * scale));

    const currentMidScreen = {
      x: (p1.clientX + p2.clientX) / 2,
      y: (p1.clientY + p2.clientY) / 2
    };

    // Zoom markazi bo'yicha siljitish (Pan)
    this.engine.zoom = newZoom;
    this.engine.panX = currentMidScreen.x - this.initialMidWorld.x * newZoom;
    this.engine.panY = currentMidScreen.y - this.initialMidWorld.y * newZoom;

    this.engine.updateZoomIndicator();
    this.engine.markDirty();
  }

  performPalmErase(screenX, screenY) {
    const worldPos = this.engine.screenToWorld(screenX, screenY);
    const radiusWorld = this.palmEraserRadius / this.engine.zoom;

    let modified = false;
    for (let i = this.engine.objects.length - 1; i >= 0; i--) {
      const obj = this.engine.objects[i];
      if (obj.locked) continue;

      if (obj.type === 'stroke') {
        const pts = obj.points;
        const hit = pts && pts.some(p => Math.hypot(p.x - worldPos.x, p.y - worldPos.y) <= radiusWorld);
        if (hit) {
          this.engine.objects.splice(i, 1);
          modified = true;
        }
      } else {
        const b = this.engine.getObjectBounds(obj);
        if (
          worldPos.x + radiusWorld >= b.x &&
          worldPos.x - radiusWorld <= b.x + b.width &&
          worldPos.y + radiusWorld >= b.y &&
          worldPos.y - radiusWorld <= b.y + b.height
        ) {
          this.engine.objects.splice(i, 1);
          modified = true;
        }
      }
    }

    if (modified) {
      this.engine.markDirty();
    }
  }
}

/* ==========================================================================
   SENSORLI EKRAN VIRTUAL KLAVIATURASI (VIRTUAL ON-SCREEN KEYBOARD)
   O'zbekcha / Lotin, Ingliz tili, Raqamlar va Tezkor Matematik belgilar
   ========================================================================== */
class VirtualKeyboard {
  constructor(engine) {
    this.engine = engine;
    this.container = document.getElementById('virtualKeyboardContainer');
    this.activeInput = null;
    this.isShifted = false;
    this.isSymbols = false;
    this.isMathMode = false;
    this.isOpen = false;

    // Web Speech API — Ovozli kiritish (Voice Dictation)
    this.recognition = null;
    this.isListening = false;
    this.initSpeech();

    this.render();
    this.bindGlobalInputTriggers();
  }

  initSpeech() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    try {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'uz-UZ';

      this.recognition.onstart = () => {
        this.isListening = true;
        this.updateMicBtn();
        if (typeof window.toast === 'function') window.toast("🎙️ Eshitilmoqda... Gapiring!");
      };

      this.recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        if (text) {
          this.insertText(text);
          if (typeof window.toast === 'function') window.toast(`📝 Yozildi: "${text}"`);
        }
      };

      this.recognition.onerror = () => {
        this.isListening = false;
        this.updateMicBtn();
      };

      this.recognition.onend = () => {
        this.isListening = false;
        this.updateMicBtn();
      };
    } catch (e) {
      console.warn("Speech recognition error:", e);
    }
  }

  toggleSpeech() {
    if (!this.recognition) {
      if (typeof window.toast === 'function') window.toast("⚠️ Brauzer ovozli yozishni qo'llab-quvvatlamaydi.");
      return;
    }
    if (this.isListening) {
      this.recognition.stop();
    } else {
      try {
        this.recognition.start();
      } catch (err) {
        console.error(err);
      }
    }
  }

  updateMicBtn() {
    const mic = this.container?.querySelector('.vk-key-mic');
    if (mic) {
      mic.classList.toggle('listening', this.isListening);
    }
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="vk-header">
        <div class="vk-header-title">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="4" width="20" height="16" rx="3"/>
            <line x1="6" y1="8" x2="6.01" y2="8"/>
            <line x1="10" y1="8" x2="10.01" y2="8"/>
            <line x1="14" y1="8" x2="14.01" y2="8"/>
            <line x1="18" y1="8" x2="18.01" y2="8"/>
            <line x1="6" y1="12" x2="6.01" y2="12"/>
            <line x1="10" y1="12" x2="10.01" y2="12"/>
            <line x1="14" y1="12" x2="14.01" y2="12"/>
            <line x1="18" y1="12" x2="18.01" y2="12"/>
            <line x1="7" y1="16" x2="17" y2="16"/>
          </svg>
          <span>Sensorli Klaviatura (Smartboard)</span>
        </div>
        <div class="vk-header-actions">
          <button class="vk-mode-btn ${this.isMathMode ? 'active' : ''}" id="vkBtnMath">📐 Matematika</button>
          <button class="vk-mode-btn ${this.isSymbols ? 'active' : ''}" id="vkBtnSymbols">?123</button>
          <button class="vk-close-btn" id="vkBtnClose" title="Yopish">&times;</button>
        </div>
      </div>
      <div class="vk-body" id="vkBody">
        <!-- Tugmalar dinamik generatsiya qilinadi -->
      </div>
    `;

    this.renderKeys();

    // Rejim tugmalari
    document.getElementById('vkBtnMath')?.addEventListener('click', () => {
      this.isMathMode = !this.isMathMode;
      this.isSymbols = false;
      this.render();
    });

    document.getElementById('vkBtnSymbols')?.addEventListener('click', () => {
      this.isSymbols = !this.isSymbols;
      this.isMathMode = false;
      this.render();
    });

    document.getElementById('vkBtnClose')?.addEventListener('click', () => {
      this.close();
    });
  }

  renderKeys() {
    const vkBody = document.getElementById('vkBody');
    if (!vkBody) return;

    let rows = [];

    if (this.isMathMode) {
      // Matematik formulalar va tezkor belgilar
      rows = [
        ['sin', 'cos', 'tan', 'log', 'ln', 'lim', '(', ')', '^', '√', 'π'],
        ['x', 'y', 'z', '=', '+', '-', '*', '/', '\\frac', '\\sqrt', '\\alpha'],
        ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.'],
        ['ABC', 'Space', 'Backspace', 'Enter']
      ];
    } else if (this.isSymbols) {
      // Raqamlar va maxsus belgilar
      rows = [
        ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
        ['@', '#', '$', '%', '&', '*', '-', '+', '=', '/', '\\'],
        ['(', ')', '<', '>', '[', ']', '{', '}', '_', ':', ';', '"'],
        ['ABC', ',', 'Space', '.', 'Backspace', 'Enter']
      ];
    } else {
      // Asosiy O'zbekcha / Lotin QWERTY (O', G', Sh, Ch qo'llab-quvvatlanadi)
      const r1 = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', "o'", "g'"];
      const r2 = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'sh', 'ch'];
      const r3 = ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'Backspace'];
      const r4 = ['?123', 'Mic', 'Space', '.', 'Enter'];

      rows = [
        r1.map(k => this.isShifted ? k.toUpperCase() : k),
        r2.map(k => this.isShifted ? k.toUpperCase() : k),
        r3.map(k => (k === 'Shift' || k === 'Backspace') ? k : (this.isShifted ? k.toUpperCase() : k)),
        r4
      ];
    }

    vkBody.innerHTML = '';
    rows.forEach(row => {
      const rowDiv = document.createElement('div');
      rowDiv.className = 'vk-row';

      row.forEach(key => {
        const btn = document.createElement('button');
        btn.className = 'vk-key';
        btn.textContent = key;

        if (key === 'Shift') {
          btn.classList.add('vk-key-special', 'vk-key-shift');
          btn.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"/></svg>`;
          if (this.isShifted) btn.classList.add('active');
        } else if (key === 'Backspace') {
          btn.classList.add('vk-key-special', 'vk-key-backspace');
          btn.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/><line x1="18" y1="9" x2="12" y2="15"/><line x1="12" y1="9" x2="18" y2="15"/></svg>`;
        } else if (key === 'Enter') {
          btn.classList.add('vk-key-special', 'vk-key-enter');
          btn.textContent = 'Enter ↵';
        } else if (key === 'Space') {
          btn.classList.add('vk-key-space');
          btn.textContent = 'Bo\'sh joy (Space)';
        } else if (key === 'Mic') {
          btn.classList.add('vk-key-special', 'vk-key-mic');
          if (this.isListening) btn.classList.add('listening');
          btn.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>`;
        } else if (key === 'ABC' || key === '?123') {
          btn.classList.add('vk-key-special');
        }

        btn.addEventListener('pointerdown', (e) => {
          e.preventDefault();
          this.handleKeyPress(key);
        });

        rowDiv.appendChild(btn);
      });

      vkBody.appendChild(rowDiv);
    });
  }

  handleKeyPress(key) {
    if (key === 'Shift') {
      this.isShifted = !this.isShifted;
      this.renderKeys();
      return;
    }
    if (key === 'ABC') {
      this.isSymbols = false;
      this.isMathMode = false;
      this.render();
      return;
    }
    if (key === '?123') {
      this.isSymbols = true;
      this.isMathMode = false;
      this.render();
      return;
    }
    if (key === 'Mic') {
      this.toggleSpeech();
      return;
    }

    if (key === 'Backspace') {
      this.backspace();
      return;
    }

    if (key === 'Enter') {
      this.pressEnter();
      return;
    }

    const textToInsert = key === 'Space' ? ' ' : key;
    this.insertText(textToInsert);
  }

  insertText(text) {
    // 1. Agar inline textarea faol bo'lsa
    if (this.activeInput) {
      const el = this.activeInput;
      const start = el.selectionStart !== undefined ? el.selectionStart : el.value.length;
      const end = el.selectionEnd !== undefined ? el.selectionEnd : el.value.length;
      const val = el.value;

      el.value = val.substring(0, start) + text + val.substring(end);
      el.selectionStart = el.selectionEnd = start + text.length;
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.focus();
      return;
    }

    // 2. Agar aktiv ob'ekt mavjud bo'lsa (masalan tanlangan text yoki sticky)
    if (this.engine.selectedObjects.length === 1) {
      const obj = this.engine.selectedObjects[0];
      if (obj.type === 'text' || obj.type === 'sticky') {
        obj.text = (obj.text || '') + text;
        this.engine.saveState();
        this.engine.markDirty();
      }
    }
  }

  backspace() {
    if (this.activeInput) {
      const el = this.activeInput;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const val = el.value;

      if (start === end && start > 0) {
        el.value = val.substring(0, start - 1) + val.substring(end);
        el.selectionStart = el.selectionEnd = start - 1;
      } else if (start !== end) {
        el.value = val.substring(0, start) + val.substring(end);
        el.selectionStart = el.selectionEnd = start;
      }
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.focus();
      return;
    }

    if (this.engine.selectedObjects.length === 1) {
      const obj = this.engine.selectedObjects[0];
      if ((obj.type === 'text' || obj.type === 'sticky') && obj.text && obj.text.length > 0) {
        obj.text = obj.text.slice(0, -1);
        this.engine.saveState();
        this.engine.markDirty();
      }
    }
  }

  pressEnter() {
    if (this.activeInput) {
      const el = this.activeInput;
      if (el.tagName === 'TEXTAREA') {
        this.insertText('\n');
      } else {
        el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      }
    }
  }

  openFor(inputEl = null) {
    if (inputEl) {
      this.activeInput = inputEl;
    } else {
      const active = document.activeElement;
      if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) {
        this.activeInput = active;
      }
    }
    this.container?.classList.remove('hidden');
    this.isOpen = true;
  }

  close() {
    this.container?.classList.add('hidden');
    this.isOpen = false;
    if (this.isListening && this.recognition) {
      this.recognition.stop();
    }
  }

  toggle() {
    if (this.isOpen) this.close();
    else this.openFor();
  }

  bindGlobalInputTriggers() {
    // Har qanday <input> yoki <textarea> bosilganda, agar smartboard rejimida bo'lsa, klaviaturani ochish
    document.addEventListener('focusin', (e) => {
      const tag = e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') {
        // Faqat file yoki checkbox bo'lmasa
        if (e.target.type !== 'file' && e.target.type !== 'checkbox' && e.target.type !== 'radio') {
          if (document.body.classList.contains('smartboard-mode')) {
            this.openFor(e.target);
          }
        }
      }
    });
  }
}

/* ==========================================================================
   SMARTBOARD MANAGER ASOSIY BOSHQARUVCHI
   ========================================================================== */
class SmartboardManager {
  constructor(engine, toolManager) {
    this.engine = engine;
    this.toolManager = toolManager;

    this.detector = new DeviceDetector();
    this.gestures = new MultiTouchController(engine, toolManager);
    this.keyboard = new VirtualKeyboard(engine);

    // Integratsiyalar
    this.initFullscreen();
  }

  initFullscreen() {
    // To'liq ekran rejimini qo'llab-quvvatlash
    this.isFullscreen = false;
    document.addEventListener('fullscreenchange', () => {
      this.isFullscreen = Boolean(document.fullscreenElement);
      const btn = document.getElementById('btnBoardFullscreen');
      if (btn) btn.classList.toggle('active', this.isFullscreen);
    });
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn("Fullscreen rad etildi:", err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }
}

window.DeviceDetector = DeviceDetector;
window.MultiTouchController = MultiTouchController;
window.VirtualKeyboard = VirtualKeyboard;
window.SmartboardManager = SmartboardManager;
