/* ==========================================================================
   ATT-25 AI DOSKA — VOICE AI ASSISTANT (voice-assistant.js)
   Ovozli buyruqlarni qabul qilish (Speech-to-Text) va semantik boshqaruv
   ========================================================================== */

class VoiceAssistant {
  constructor(aiEngine, mathSolver, boardEngine) {
    this.ai = aiEngine;
    this.math = mathSolver;
    this.board = boardEngine;

    this.recognition = null;
    this.isListening = false;
    this.lang = 'uz-UZ'; // Standart O'zbek tili
    this.onStatusChange = null;
    this.onTranscript = null;

    this.initRecognition();
  }

  initRecognition() {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      console.warn("Brauzerda Web Speech API (Ovozni tanish) qo'llab-quvvatlanmaydi.");
      return;
    }

    this.recognition = new SpeechRec();
    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.lang = this.lang;

    this.recognition.onstart = () => {
      this.isListening = true;
      if (this.onStatusChange) this.onStatusChange('listening');
    };

    this.recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      const text = (finalTranscript || interimTranscript).trim();
      if (this.onTranscript) this.onTranscript(text, !!finalTranscript);

      if (finalTranscript) {
        this.handleVoiceCommand(finalTranscript);
      }
    };

    this.recognition.onerror = (event) => {
      console.warn('Ovozni tanishda xatolik:', event.error);
      this.isListening = false;
      if (this.onStatusChange) this.onStatusChange('error', event.error);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (this.onStatusChange) this.onStatusChange('idle');
    };
  }

  isSupported() {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  setLanguage(langCode) {
    this.lang = langCode;
    if (this.recognition) {
      this.recognition.lang = langCode;
    }
  }

  start() {
    if (!this.recognition) {
      throw new Error("Sizning brauzeringiz ovozli boshqaruvni qo'llab-quvvatlamaydi (Google Chrome yoki Edge tavsiya etiladi).");
    }
    if (this.isListening) return;

    try {
      this.recognition.start();
    } catch (e) {
      console.warn("Speech recognition start xatosi:", e);
    }
  }

  stop() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  toggle() {
    if (this.isListening) {
      this.stop();
    } else {
      this.start();
    }
  }

  /* ==========================================================================
     OVOZLI BUYRUQLARNI SEMANTIK TAHLIL QILISH VA IJRO ETISH
     ========================================================================== */
  async handleVoiceCommand(rawText) {
    const text = rawText.trim().toLowerCase();
    console.log("Ovozli buyruq qabul qilindi:", rawText);

    // 1. Doskani tozalash
    if (text.includes('tozala') || text.includes('o\'chir') || text.includes('ochir') || text.includes('clear board')) {
      if (confirm("Ovozli buyruq: Doskadagi barcha elementlarni tozalamoqchimisiz?")) {
        this.board.clearBoard();
        this.showToast("Doska tozalandi");
      }
      return;
    }

    // 2. Konspekt tuzish / Tahlil qilish
    if (text.includes('konspekt') || text.includes('tahlil') || text.includes('xulosa') || text.includes('summarize')) {
      this.showToast("Doska tahlil qilinmoqda...");
      try {
        const res = await this.ai.analyzeBoard('summarize');
        // AI Drawer-ni ochish
        const aiDrawer = document.getElementById('aiDrawer');
        if (aiDrawer) {
          aiDrawer.classList.add('open');
          const tabAnalyze = document.querySelector('.ai-tab[data-tab="aiAnalyze"]');
          if (tabAnalyze) tabAnalyze.click();
          const resBox = document.getElementById('aiAnalysisResult');
          if (resBox) resBox.innerHTML = res.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
        }
      } catch (e) {
        this.showToast("Tahlil xatosi: " + e.message);
      }
      return;
    }

    // 3. Doskadan test / quiz yaratish
    if (text.includes('test') || text.includes('savol') || text.includes('quiz')) {
      this.showToast("Doska asosida test tuzilmoqda...");
      try {
        await this.ai.generateQuizFromBoard();
      } catch (e) {
        this.showToast("Test yaratish xatosi: " + e.message);
      }
      return;
    }

    // 4. Chizmalarni tekislash (Auto-align)
    if (text.includes('tekisla') || text.includes('tartib') || text.includes('beautify') || text.includes('align')) {
      this.showToast("Doska elementlari tekislanmoqda...");
      this.ai.beautifyAndAlign();
      return;
    }

    // 5. Matematik tenglama yoki hisoblash
    if (text.startsWith('yech') || text.startsWith('hisobla') || text.includes('tenglama') || text.includes('hosila') || text.includes('integral')) {
      let mathExpr = rawText
        .replace(/yech/gi, '')
        .replace(/hisobla/gi, '')
        .replace(/tenglama/gi, '')
        .replace(/hosilasini top/gi, '')
        .replace(/integralini top/gi, '')
        .trim();

      if (!mathExpr) mathExpr = 'x^2 - 5x + 6 = 0';

      this.showToast(`Matematik masala yechilmoqda: ${mathExpr}`);
      try {
        const solution = this.math.solve(mathExpr);
        const center = this.board.screenToWorld(this.board.width / 2, this.board.height / 2);
        const objs = this.math.placeSolutionOnBoard(solution, center.x - 160, center.y - 120);
        if (objs && objs.length > 0) {
          this.board.saveState();
          objs.forEach(o => this.board.addObject(o, false));
        }
      } catch (e) {
        this.showToast("Matematika xatosi: " + e.message);
      }
      return;
    }

    // 6. Doskaga diagramma / sxema chizish (Umumiy prompt)
    let prompt = rawText
      .replace(/chizib ber/gi, '')
      .replace(/chiz/gi, '')
      .replace(/sxemasini/gi, '')
      .replace(/diagrammasini/gi, '')
      .trim();

    if (prompt.length < 3) prompt = rawText;

    this.showToast(`AI doskaga chizmoqda: "${prompt}"`);
    try {
      await this.ai.generateFromPrompt(prompt, 'diagram');
    } catch (e) {
      this.showToast("Chizishda xatolik: " + e.message);
    }
  }

  showToast(msg) {
    if (typeof window.toast === 'function') {
      window.toast(msg);
    } else {
      console.log("[VoiceAssistant]", msg);
    }
  }
}

if (typeof window !== 'undefined') {
  window.VoiceAssistant = VoiceAssistant;
}
