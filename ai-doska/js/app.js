/* ==========================================================================
   ATT-25 AI DOSKA — MAIN CONTROLLER (app.js)
   Ilova initsializatsiyasi, Modallar, AI boshqaruvi, Eksport va Hodisalar
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // XSS himoyasi va xavfsiz render yordamchilari
  function sanitizeHTML(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function safeFormatMarkdown(text) {
    if (typeof text !== 'string') return '';
    let safe = sanitizeHTML(text);
    safe = safe
      .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
      .replace(/\*(.*?)\*/g, '<i>$1</i>')
      .replace(/`([^`]+)`/g, '<code style="background:rgba(255,255,255,0.1);padding:1px 5px;border-radius:3px;font-family:monospace;">$1</code>')
      .replace(/\n/g, '<br>');
    return safe;
  }

  window.att25SafeFormatMarkdown = safeFormatMarkdown;

  // 1. Asosiy modullarni işga tuşiriş
  const engine = new WhiteboardEngine('whiteboardCanvas', 'minimapCanvas');
  const toolManager = new ToolManager(engine);
  const mathSolver = new MathSolver(engine);
  const codeBridge = new CodeBridge(engine);
  const handwritingOCR = new HandwritingOCR(engine);
  const voiceAssistant = new VoiceAssistant(mathSolver, engine);
  const smartboard = new SmartboardManager(engine, toolManager);
  const documentReader = (typeof DocumentReader !== 'undefined') ? new DocumentReader(engine) : null;

  // Global ob'ektlar (debug va qulaylik uçun)
  window.boardEngine = engine;
  window.toolManager = toolManager;
  window.mathSolver = mathSolver;
  window.codeBridge = codeBridge;
  window.handwritingOCR = handwritingOCR;
  window.voiceAssistant = voiceAssistant;
  window.smartboard = smartboard;
  window.documentReader = documentReader;

  // 2. Mahalliy xotiradan yuklaş (yoki boşlanğiç şablon)
  const hasSaved = engine.loadFromStorage();
  if (!hasSaved) {
    // Böş bölsa boşlanğiç çiroyli xuş kelibsiz stikeri va diagramma
    const center = engine.screenToWorld(engine.width / 2, engine.height / 2);
    engine.addObject({
      type: 'sticky',
      x: center.x - 280,
      y: center.y - 120,
      width: 220,
      height: 160,
      bgColor: '#FEF08A',
      textColor: '#1E293B',
      text: '👋 XUŞ KELIBSIZ!\n\nBu ATT-25 ning mustaqil AI Doskasi.\n\n• Qalam (P), Şakllar (S), Stiker (N)\n• AI Assistent (Ctrl+I) orqali matndan diagramma çizing!'
    }, false);

    // Kiçik tarmoq namunasi
    engine.addObject({ type: 'net_node', x: center.x + 80, y: center.y - 40, nodeType: 'router', label: 'Boş Router', ip: '192.168.1.1' }, false);
    engine.addObject({ type: 'net_node', x: center.x + 240, y: center.y - 40, nodeType: 'server', label: 'Portal Server', ip: '10.0.0.5' }, false);
    engine.addObject({ type: 'arrow', x1: center.x + 110, y1: center.y - 40, x2: center.x + 210, y2: center.y - 40, color: '#10B981', strokeWidth: 3 }, false);
    engine.saveState();
  }

  // Oyna ölçami özgarganda
  window.addEventListener('resize', () => {
    engine.initCanvasSize();
  });

  /* ==========================================================================
     YAGONA ASOSIY MENYU VA HEADER QUICK ACTIONS
     ========================================================================== */
  const btnMainMenu = document.getElementById('btnMainMenu');
  const btnCloseMainMenu = document.getElementById('btnCloseMainMenu');
  const mainMenuOverlay = document.getElementById('mainMenuOverlay');
  const mainMenuDrawer = document.getElementById('mainMenuDrawer');
  const exportModal = document.getElementById('exportModal');

  function openMainMenu() {
    mainMenuDrawer?.classList.remove('hidden');
    mainMenuOverlay?.classList.remove('hidden');
  }

  function closeMainMenu() {
    mainMenuDrawer?.classList.add('hidden');
    mainMenuOverlay?.classList.add('hidden');
  }

  btnMainMenu?.addEventListener('click', openMainMenu);
  btnCloseMainMenu?.addEventListener('click', closeMainMenu);
  mainMenuOverlay?.addEventListener('click', closeMainMenu);

  // Esc bosilganda asosiy menyuni yopiş
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mainMenuDrawer && !mainMenuDrawer.classList.contains('hidden')) {
      closeMainMenu();
    }
  });

  // Header quick buttons: Undo/Redo & Zoom
  const btnUndo = document.getElementById('btnUndo');
  const btnRedo = document.getElementById('btnRedo');
  if (btnUndo) btnUndo.addEventListener('click', () => engine.undo());
  if (btnRedo) btnRedo.addEventListener('click', () => engine.redo());

  const btnZoomIn = document.getElementById('btnZoomIn');
  const btnZoomOut = document.getElementById('btnZoomOut');
  const btnZoomReset = document.getElementById('btnZoomReset');

  if (btnZoomIn) btnZoomIn.addEventListener('click', () => engine.setZoom(engine.zoom * 1.15));
  if (btnZoomOut) btnZoomOut.addEventListener('click', () => engine.setZoom(engine.zoom * 0.85));
  if (btnZoomReset) btnZoomReset.addEventListener('click', () => engine.setZoom(1.0));

  // Smartboard va Fullscreen boşqaruvi
  const btnSmartboardToggle = document.getElementById('btnSmartboardToggle');
  const btnBoardFullscreen = document.getElementById('btnBoardFullscreen');

  const updateSmartboardBtnUI = () => {
    if (!btnSmartboardToggle) return;
    const mode = smartboard.detector.mode;
    const isActive = smartboard.detector.isSmartboard;
    btnSmartboardToggle.classList.toggle('active', isActive);
    btnSmartboardToggle.title = `Interaktiv Doska Rejimi: ${mode === 'auto' ? 'Avtomatik (' + (isActive ? 'Faol' : "O'chirilgan") + ')' : (mode === 'on' ? 'Doimiy Yoqilgan' : "O'chirilgan")}`;
  };

  smartboard.detector.onChange(() => {
    updateSmartboardBtnUI();
  });
  updateSmartboardBtnUI();

  btnSmartboardToggle?.addEventListener('click', () => {
    const current = smartboard.detector.mode;
    const nextMode = current === 'auto' ? (smartboard.detector.isSmartboard ? 'off' : 'on') : (current === 'on' ? 'off' : 'auto');
    smartboard.detector.setMode(nextMode);
    updateSmartboardBtnUI();
    toast(`📺 Interaktiv Doska Rejimi: ${nextMode === 'on' ? 'Doimiy Yoqildi' : (nextMode === 'off' ? "O'çirildi" : 'Avtomatik aniqlash')}`);
  });

  btnBoardFullscreen?.addEventListener('click', () => {
    smartboard.toggleFullscreen();
  });

  // Sensorli virtual klaviaturani oçiş tugmalari
  document.getElementById('btnToggleVirtualKeyboard')?.addEventListener('click', () => smartboard.keyboard.toggle());
  document.getElementById('btnFloatingKeyboard')?.addEventListener('click', () => smartboard.keyboard.toggle());

  // Menyu içidagi Eksport tugmasi
  document.getElementById('menuBtnExport')?.addEventListener('click', () => {
    closeMainMenu();
    exportModal?.classList.remove('hidden');
  });

  // Menyu içidagi Doskani Tozalaş tugmasi
  document.getElementById('menuBtnClearBoard')?.addEventListener('click', () => {
    closeMainMenu();
    if (confirm("Haqiqatan ham doskadagi barça elementlarni tozalamoqçimisiz?")) {
      engine.clearBoard();
      toast("Doska tozalandi (Ctrl+Z bilan qaytariş mumkin)");
    }
  });

  // Menyu içidagi Mavzu tanlaş (Theme)
  document.querySelectorAll('.theme-choice-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.theme-choice-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const theme = btn.getAttribute('data-theme');
      engine.setTheme(theme);
      toast(`Mavzu: ${btn.textContent.trim()}`);
    });
  });

  // Menyu içidagi To'r tanlash (Grid)
  document.querySelectorAll('.grid-choice-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.grid-choice-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const grid = btn.getAttribute('data-grid');
      engine.setGridMode(grid);
      toast(`Tör rejimi: ${btn.textContent.trim()}`);
    });
  });

  /* ==========================================================================
     EKSPORT MODALI
     ========================================================================== */
  const btnOpenExport = document.getElementById('btnOpenExport');
  const btnCloseExport = document.getElementById('btnCloseExport');

  if (btnOpenExport && exportModal) {
    btnOpenExport.addEventListener('click', () => exportModal.classList.remove('hidden'));
  }
  if (btnCloseExport && exportModal) {
    btnCloseExport.addEventListener('click', () => exportModal.classList.add('hidden'));
  }

  // Eksport amallari
  document.getElementById('btnExportPng')?.addEventListener('click', () => {
    engine.exportPNG();
    exportModal.classList.add('hidden');
    toast("PNG rasm muvaffaqiyatli yuklab olindi");
  });

  document.getElementById('btnExportSvg')?.addEventListener('click', () => {
    engine.exportSVG();
    exportModal.classList.add('hidden');
    toast("SVG vektorli çizma yuklab olindi");
  });

  document.getElementById('btnExportJson')?.addEventListener('click', () => {
    engine.exportJSON();
    exportModal.classList.add('hidden');
    toast("Doska loyihasi JSON faylga saqlandi");
  });

  document.getElementById('btnExportPdf')?.addEventListener('click', () => {
    engine.exportPDF(true);
    exportModal?.classList.add('hidden');
    toast("📄 PDF formatidagi hujjat yuklab olindi");
  });


  const importInput = document.getElementById('importJsonInput');
  if (importInput) {
    importInput.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const success = engine.importJSON(ev.target.result);
        if (success) {
          toast("Doska loyihasi muvaffaqiyatli oçildi!");
          exportModal.classList.add('hidden');
        } else {
          toast("⚠️ Fayl formati notöğri yoki buzilgan.");
        }
      };
      reader.readAsText(file);
    });
  }

  /* ==========================================================================
     MATEMATIK FORMULA MODALI
     ========================================================================== */
  const formulaModal = document.getElementById('formulaModal');
  const btnFormulaTool = document.getElementById('btnFormulaTool');
  const btnCloseFormula = document.getElementById('btnCloseFormula');
  const formulaLatexInput = document.getElementById('formulaLatexInput');
  const formulaLivePreview = document.getElementById('formulaLivePreview');
  const btnInsertFormula = document.getElementById('btnInsertFormula');
  const formulaFontSize = document.getElementById('formulaFontSize');

  const updateFormulaPreview = () => {
    if (!formulaLivePreview || !formulaLatexInput) return;
    const latex = formulaLatexInput.value.trim();
    if (!latex) {
      formulaLivePreview.innerHTML = '<span style="opacity:0.4;">Formula kiriting...</span>';
      return;
    }
    if (typeof window !== 'undefined' && window.katex) {
      try {
        formulaLivePreview.innerHTML = window.katex.renderToString(latex, { displayMode: true, throwOnError: false });
        return;
      } catch (e) {
        // Fallback
      }
    }
    formulaLivePreview.textContent = latex;
  };

  if (btnFormulaTool && formulaModal) {
    btnFormulaTool.addEventListener('click', () => {
      formulaModal.classList.remove('hidden');
      updateFormulaPreview();
      formulaLatexInput?.focus();
    });
  }

  if (btnCloseFormula && formulaModal) {
    btnCloseFormula.addEventListener('click', () => formulaModal.classList.add('hidden'));
  }

  if (formulaLatexInput) {
    formulaLatexInput.addEventListener('input', updateFormulaPreview);
  }

  // Keypad tugmalari
  document.querySelectorAll('#formulaModal .fkey-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const snip = btn.getAttribute('data-insert');
      if (!formulaLatexInput || !snip) return;
      const start = formulaLatexInput.selectionStart;
      const end = formulaLatexInput.selectionEnd;
      const text = formulaLatexInput.value;
      formulaLatexInput.value = text.substring(0, start) + snip + text.substring(end);
      formulaLatexInput.selectionStart = formulaLatexInput.selectionEnd = start + snip.length;
      formulaLatexInput.focus();
      updateFormulaPreview();
    });
  });

  // Preset formulalar
  document.querySelectorAll('#formulaModal .fpreset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const latex = btn.getAttribute('data-latex');
      if (!formulaLatexInput || !latex) return;
      formulaLatexInput.value = latex;
      updateFormulaPreview();
    });
  });

  // Doskaga joylashtirish
  if (btnInsertFormula && formulaLatexInput) {
    btnInsertFormula.addEventListener('click', () => {
      const latex = formulaLatexInput.value.trim();
      if (!latex) {
        toast("Iltimos, formula kiriting!");
        formulaLatexInput.focus();
        return;
      }
      const size = parseInt(formulaFontSize?.value, 10) || 26;
      const center = engine.screenToWorld(engine.width / 2, engine.height / 2);

      engine.addObject({
        type: 'formula',
        x: Math.round(center.x - 140),
        y: Math.round(center.y - 40),
        latex: latex,
        color: toolManager.currentColor || '#38BDF8',
        fontSize: size
      });

      formulaModal.classList.add('hidden');
      toast("📐 Matematik formula doskaga joylaştirildi!");
    });
  }

  /* ==========================================================================
     2D FUNKSIYA GRAFIGI VA TENGLAMA YECHUVCHI MODALI
     ========================================================================== */
  const graphModal = document.getElementById('graphModal');
  const btnGraphModalTool = document.getElementById('btnGraphModalTool');
  const btnCloseGraph = document.getElementById('btnCloseGraph');
  const graphFuncInput = document.getElementById('graphFuncInput');
  const graphMinX = document.getElementById('graphMinX');
  const graphMaxX = document.getElementById('graphMaxX');
  const graphColorSelect = document.getElementById('graphColorSelect');
  const btnInsertGraph = document.getElementById('btnInsertGraph');
  const btnSolveMathSteps = document.getElementById('btnSolveMathSteps');

  if (btnGraphModalTool && graphModal) {
    btnGraphModalTool.addEventListener('click', () => {
      graphModal.classList.remove('hidden');
      graphFuncInput?.focus();
    });
  }
  if (btnCloseGraph && graphModal) {
    btnCloseGraph.addEventListener('click', () => graphModal.classList.add('hidden'));
  }

  document.querySelectorAll('#graphModal .fpreset-btn[data-graph]').forEach(btn => {
    btn.addEventListener('click', () => {
      const g = btn.getAttribute('data-graph');
      if (graphFuncInput) graphFuncInput.value = g;
    });
  });

  if (btnInsertGraph && graphFuncInput) {
    btnInsertGraph.addEventListener('click', () => {
      const funcStr = graphFuncInput.value.trim();
      if (!funcStr) {
        toast("Iltimos, funksiya ifodasini kiriting!");
        graphFuncInput.focus();
        return;
      }
      const minX = parseFloat(graphMinX?.value) || -6;
      const maxX = parseFloat(graphMaxX?.value) || 6;
      const color = graphColorSelect?.value || '#00FF87';
      const center = engine.screenToWorld(engine.width / 2, engine.height / 2);

      const graphObj = {
        type: 'graph',
        x: Math.round(center.x - 210),
        y: Math.round(center.y - 145),
        width: 420,
        height: 290,
        funcStr: funcStr,
        title: `y = ${funcStr}`,
        color: color,
        rangeX: [minX, maxX],
        rangeY: [-4, 6]
      };

      engine.saveState();
      engine.addObject(graphObj);
      engine.selectedObject = graphObj;
      graphModal.classList.add('hidden');
      toast("📈 2D Funksiya grafigi doskaga muvaffaqiyatli çizildi!");
    });
  }

  if (btnSolveMathSteps && graphFuncInput) {
    btnSolveMathSteps.addEventListener('click', () => {
      const expr = graphFuncInput.value.trim();
      if (!expr) {
        toast("Iltimos, yeçiş uçun tenglamani kiriting!");
        graphFuncInput.focus();
        return;
      }
      const center = engine.screenToWorld(engine.width / 2, engine.height / 2);
      const solution = mathSolver.solve(expr);
      if (solution && solution.steps && solution.steps.length > 0) {
        mathSolver.renderSolutionOnBoard(solution, center.x - 240, center.y - 180);
        graphModal.classList.add('hidden');
        toast(`🧮 "${solution.type.toUpperCase()}" yeçimi bosqiçma-bosqiç doskaga joylaştirildi!`);
      } else {
        toast("⚠️ Bu tenglama uçun yeçim qadamlari hisoblanmadi.");
      }
    });
  }

  /* ==========================================================================
     KOD <-> BLOK-SXEMA TRANSFORMASIYASI MODALI
     ========================================================================== */
  const codeBridgeModal = document.getElementById('codeBridgeModal');
  const btnCodeModalTool = document.getElementById('btnCodeModalTool');
  const btnCloseCodeBridge = document.getElementById('btnCloseCodeBridge');
  const codeBridgeInput = document.getElementById('codeBridgeInput');
  const codeLanguageSelect = document.getElementById('codeLanguageSelect');
  const btnCodeToFlowchart = document.getElementById('btnCodeToFlowchart');
  const btnFlowchartToCode = document.getElementById('btnFlowchartToCode');
  const btnCodePresetEven = document.getElementById('btnCodePresetEven');
  const btnCodePresetFactorial = document.getElementById('btnCodePresetFactorial');

  if (btnCodeModalTool && codeBridgeModal) {
    btnCodeModalTool.addEventListener('click', () => {
      codeBridgeModal.classList.remove('hidden');
      codeBridgeInput?.focus();
    });
  }
  if (btnCloseCodeBridge && codeBridgeModal) {
    btnCloseCodeBridge.addEventListener('click', () => codeBridgeModal.classList.add('hidden'));
  }

  if (btnCodePresetEven && codeBridgeInput) {
    btnCodePresetEven.addEventListener('click', () => {
      codeBridgeInput.value = `number = int(input())\nif number % 2 == 0:\n    print("Juft son")\nelse:\n    print("Toq son")`;
    });
  }
  if (btnCodePresetFactorial && codeBridgeInput) {
    btnCodePresetFactorial.addEventListener('click', () => {
      codeBridgeInput.value = `n = 5\nfact = 1\nwhile n > 1:\n    fact = fact * n\n    n = n - 1\nprint(fact)`;
    });
  }

  if (btnCodeToFlowchart && codeBridgeInput) {
    btnCodeToFlowchart.addEventListener('click', () => {
      const code = codeBridgeInput.value.trim();
      if (!code) {
        toast("Iltimos, kod matnini kiriting!");
        codeBridgeInput.focus();
        return;
      }
      const center = engine.screenToWorld(engine.width / 2, engine.height / 2);
      codeBridge.codeToFlowchart(code, center.x, center.y - 180);
      codeBridgeModal.classList.add('hidden');
      toast("💻 Algoritm blok-sxemasi doskaga çizildi!");
    });
  }

  if (btnFlowchartToCode && codeBridgeInput) {
    btnFlowchartToCode.addEventListener('click', () => {
      const lang = codeLanguageSelect ? codeLanguageSelect.value : 'python';
      const code = codeBridge.flowchartToCode(lang);
      codeBridgeInput.value = code;
      toast(`✅ Doskadagi elementlardan ${lang.toUpperCase()} kodi tuzildi!`);
    });
  }

  /* ==========================================================================
     INTERAKTIV BILIM TESTI MODALI
     ========================================================================== */
  const quizModal = document.getElementById('quizModal');
  const btnQuizModalTool = document.getElementById('btnQuizModalTool');
  const btnCloseQuiz = document.getElementById('btnCloseQuiz');
  const quizTopicInput = document.getElementById('quizTopicInput');
  const quizQuestionInput = document.getElementById('quizQuestionInput');
  const quizCorrectSelect = document.getElementById('quizCorrectSelect');
  const quizOptA = document.getElementById('quizOptA');
  const quizOptB = document.getElementById('quizOptB');
  const quizOptC = document.getElementById('quizOptC');
  const quizOptD = document.getElementById('quizOptD');
  const quizExplanationInput = document.getElementById('quizExplanationInput');
  const btnInsertQuizCard = document.getElementById('btnInsertQuizCard');

  if (btnQuizModalTool && quizModal) {
    btnQuizModalTool.addEventListener('click', () => {
      quizModal.classList.remove('hidden');
      quizQuestionInput?.focus();
    });
  }
  if (btnCloseQuiz && quizModal) {
    btnCloseQuiz.addEventListener('click', () => quizModal.classList.add('hidden'));
  }

  document.querySelectorAll('#quizModal .fpreset-btn[data-quiz]').forEach(btn => {
    btn.addEventListener('click', () => {
      const q = btn.getAttribute('data-quiz');
      if (q === 'osi') {
        quizTopicInput.value = 'TARMOQ PROTOKOLLARI';
        quizQuestionInput.value = 'OSI modelining 3-qatlamida (Tarmoq qatlamida) qaysi protokol işlaydi?';
        quizOptA.value = 'TCP (Transport)';
        quizOptB.value = 'IP (Internet Protocol)';
        quizOptC.value = 'HTTP (Ilova)';
        quizOptD.value = 'Ethernet (Kanal)';
        quizCorrectSelect.value = '1';
        quizExplanationInput.value = 'IP protokoli paketlarni marşrutlaş bilan şuğullanadi va OSI ning 3-qatlamida işlaydi.';
      } else if (q === 'quad') {
        quizTopicInput.value = 'MATEMATIKA & ALGEBRA';
        quizQuestionInput.value = 'Kvadrat tenglama D > 0 bölganda neçta haqiqiy ildizga ega böladi?';
        quizOptA.value = '2 ta turli haqiqiy ildiz';
        quizOptB.value = '1 ta karrali ildiz';
        quizOptC.value = 'Haqiqiy ildizga ega emas';
        quizOptD.value = 'Çeksiz köp ildiz';
        quizCorrectSelect.value = '0';
        quizExplanationInput.value = 'Diskriminant musbat (D > 0) bölsa, tenglama doimo 2 ta haqiqiy ildizga ega böladi.';
      } else if (q === 'ohm') {
        quizTopicInput.value = 'FIZIKA & ELEKTR';
        quizQuestionInput.value = 'Zanjir qismi uçun Ohm qonunining töğri ifodasini toping:';
        quizOptA.value = 'I = U * R';
        quizOptB.value = 'R = I * U';
        quizOptC.value = 'I = U / R';
        quizOptD.value = 'U = I / R';
        quizCorrectSelect.value = '2';
        quizExplanationInput.value = 'Tok kuçi (I) kuçlanişga (U) töğri, qarşilikka (R) teskari proportsionaldir.';
      } else if (q === 'dsa') {
        quizTopicInput.value = 'ALGORITMLAR & DSA';
        quizQuestionInput.value = 'Massivning ixtiyoriy indeksidagi elementiga kiriş vaqti qanday baholanadi?';
        quizOptA.value = 'O(n)';
        quizOptB.value = 'O(1) — Özgarmas vaqt';
        quizOptC.value = 'O(log n)';
        quizOptD.value = 'O(n^2)';
        quizCorrectSelect.value = '1';
        quizExplanationInput.value = 'Massiv xotirada ketma-ket joylaşgani uçun indeks orqali töğridan-töğri O(1) vaqtda öqiladi.';
      }
    });
  });

  if (btnInsertQuizCard) {
    btnInsertQuizCard.addEventListener('click', () => {
      const topic = quizTopicInput?.value.trim() || 'BILIM TESTI';
      const question = quizQuestionInput?.value.trim();
      if (!question) {
        toast("Iltimos, savol matnini kiriting!");
        quizQuestionInput?.focus();
        return;
      }
      const options = [
        quizOptA?.value.trim() || 'A) Variant',
        quizOptB?.value.trim() || 'B) Variant',
        quizOptC?.value.trim() || 'C) Variant',
        quizOptD?.value.trim() || 'D) Variant'
      ];
      const correctIndex = parseInt(quizCorrectSelect?.value, 10) || 0;
      const explanation = quizExplanationInput?.value.trim() || '';

      const center = engine.screenToWorld(engine.width / 2, engine.height / 2);
      const quizObj = {
        type: 'quiz_card',
        x: Math.round(center.x - 180),
        y: Math.round(center.y - 130),
        width: 360,
        topic,
        question,
        options,
        correctIndex,
        selectedIndex: null,
        revealed: false,
        explanation
      };

      engine.saveState();
      engine.addObject(quizObj);
      engine.selectedObject = quizObj;
      quizModal.classList.add('hidden');
      toast("❓ Interaktiv test kartoçkasi doskaga joylaştirildi!");
    });
  }

  /* ==========================================================================
     IP & SUBNET / VLSM KALKULYATOR MODALI
     ========================================================================== */
  const subnetModal = document.getElementById('subnetModal');
  const btnSubnetModalTool = document.getElementById('btnSubnetModalTool');
  const btnCloseSubnet = document.getElementById('btnCloseSubnet');
  const subnetIpInput = document.getElementById('subnetIpInput');
  const subnetCidrSlider = document.getElementById('subnetCidrSlider');
  const subnetCidrLabel = document.getElementById('subnetCidrLabel');
  const resSubnetNet = document.getElementById('resSubnetNet');
  const resSubnetMask = document.getElementById('resSubnetMask');
  const resSubnetWildcard = document.getElementById('resSubnetWildcard');
  const resSubnetRange = document.getElementById('resSubnetRange');
  const resSubnetBroadcast = document.getElementById('resSubnetBroadcast');
  const resSubnetHosts = document.getElementById('resSubnetHosts');
  const resSubnetScope = document.getElementById('resSubnetScope');
  const btnInsertSubnetTable = document.getElementById('btnInsertSubnetTable');
  const btnInsertSubnetTopology = document.getElementById('btnInsertSubnetTopology');

  let currentSubnetCalc = null;

  function updateSubnetMetrics() {
    if (!subnetIpInput || !subnetCidrSlider || typeof window.SubnetCalculator === 'undefined') return;
    const ip = subnetIpInput.value.trim() || '192.168.10.0';
    const cidr = parseInt(subnetCidrSlider.value, 10);
    if (subnetCidrLabel) subnetCidrLabel.textContent = `/${cidr}`;

    const res = window.SubnetCalculator.calculate(ip, cidr);
    currentSubnetCalc = res;

    if (res && res.success) {
      if (resSubnetNet) resSubnetNet.textContent = `${res.networkIp} /${res.cidr}`;
      if (resSubnetMask) resSubnetMask.textContent = res.maskIp;
      if (resSubnetWildcard) resSubnetWildcard.textContent = res.wildcardIp;
      if (resSubnetRange) resSubnetRange.textContent = `${res.firstUsableIp} – ${res.lastUsableIp}`;
      if (resSubnetBroadcast) resSubnetBroadcast.textContent = res.broadcastIp;
      if (resSubnetHosts) resSubnetHosts.textContent = `${res.usableHosts.toLocaleString()} ta xost (${res.totalHosts.toLocaleString()} jami)`;
      if (resSubnetScope) resSubnetScope.textContent = `Class ${res.ipClass} • ${res.scope}`;
    }
  }

  if (btnSubnetModalTool && subnetModal) {
    btnSubnetModalTool.addEventListener('click', () => {
      subnetModal.classList.remove('hidden');
      updateSubnetMetrics();
      subnetIpInput?.focus();
    });
  }
  if (btnCloseSubnet && subnetModal) {
    btnCloseSubnet.addEventListener('click', () => subnetModal.classList.add('hidden'));
  }
  if (subnetIpInput) subnetIpInput.addEventListener('input', updateSubnetMetrics);
  if (subnetCidrSlider) subnetCidrSlider.addEventListener('input', updateSubnetMetrics);

  document.querySelectorAll('#subnetModal .subnet-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('#subnetModal .subnet-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const cidr = chip.getAttribute('data-cidr');
      if (subnetCidrSlider) subnetCidrSlider.value = cidr;
      updateSubnetMetrics();
    });
  });

  if (btnInsertSubnetTable) {
    btnInsertSubnetTable.addEventListener('click', () => {
      updateSubnetMetrics();
      if (!currentSubnetCalc || !currentSubnetCalc.success) {
        toast("Iltimos, töğri IPv4 manzilini kiriting!");
        return;
      }
      const center = engine.screenToWorld(engine.width / 2, engine.height / 2);
      const objects = window.SubnetCalculator.generateBoardTable(currentSubnetCalc, center.x - 270, center.y - 165);
      engine.saveState();
      objects.forEach(obj => engine.addObject(obj, false));
      engine.render();
      subnetModal.classList.add('hidden');
      toast(`🔢 ${currentSubnetCalc.inputIp}/${currentSubnetCalc.cidr} hisob jadvali doskaga joylaştirildi!`);
    });
  }

  if (btnInsertSubnetTopology) {
    btnInsertSubnetTopology.addEventListener('click', () => {
      updateSubnetMetrics();
      if (!currentSubnetCalc || !currentSubnetCalc.success) {
        toast("Iltimos, töğri IPv4 manzilini kiriting!");
        return;
      }
      const center = engine.screenToWorld(engine.width / 2, engine.height / 2);
      const objects = window.SubnetCalculator.generateNetworkTopology(currentSubnetCalc, center.x, center.y);
      engine.saveState();
      objects.forEach(obj => engine.addObject(obj, false));
      engine.render();
      subnetModal.classList.add('hidden');
      toast(`🌐 ${currentSubnetCalc.networkIp}/${currentSubnetCalc.cidr} topologiyasi doskaga çizildi!`);
    });
  }

  /* ==========================================================================
     TEXNIK TAQQOSLASH JADVALLARI MODALI
     ========================================================================== */
  const comparisonModal = document.getElementById('comparisonModal');
  const btnComparisonModalTool = document.getElementById('btnComparisonModalTool');
  const btnCloseComparison = document.getElementById('btnCloseComparison');
  const comparisonPreviewWrap = document.getElementById('comparisonPreviewWrap');
  const btnInsertComparisonTable = document.getElementById('btnInsertComparisonTable');

  let currentComparisonPreset = 'tcp_vs_udp';

  function renderComparisonPreview(presetKey) {
    if (!comparisonPreviewWrap || typeof window.ComparisonTablesEngine === 'undefined') return;
    const presets = window.ComparisonTablesEngine.getPresets();
    const data = presets[presetKey] || presets.tcp_vs_udp;
    currentComparisonPreset = presetKey;

    let html = `<table class="comparison-preview-table"><thead><tr>`;
    data.cols.forEach(c => { html += `<th>${c}</th>`; });
    html += `</tr></thead><tbody>`;
    data.rows.forEach(r => {
      html += `<tr>`;
      r.forEach(c => { html += `<td>${c.replace(/\n/g, '<br>')}</td>`; });
      html += `</tr>`;
    });
    html += `</tbody></table>`;
    if (data.note) {
      html += `<div style="margin-top: 10px; font-size: 11px; color: #38BDF8;">${data.note}</div>`;
    }
    comparisonPreviewWrap.innerHTML = html;
  }

  if (btnComparisonModalTool && comparisonModal) {
    btnComparisonModalTool.addEventListener('click', () => {
      comparisonModal.classList.remove('hidden');
      renderComparisonPreview(currentComparisonPreset);
    });
  }
  if (btnCloseComparison && comparisonModal) {
    btnCloseComparison.addEventListener('click', () => comparisonModal.classList.add('hidden'));
  }

  document.querySelectorAll('#comparisonModal .comparison-preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#comparisonModal .comparison-preset-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const preset = btn.getAttribute('data-preset');
      renderComparisonPreview(preset);
    });
  });

  if (btnInsertComparisonTable) {
    btnInsertComparisonTable.addEventListener('click', () => {
      if (typeof window.ComparisonTablesEngine === 'undefined') return;
      const center = engine.screenToWorld(engine.width / 2, engine.height / 2);
      const objects = window.ComparisonTablesEngine.generateBoardTable(currentComparisonPreset, center.x - 360, center.y - 180);
      engine.saveState();
      objects.forEach(obj => engine.addObject(obj, false));
      engine.render();
      comparisonModal.classList.add('hidden');
      toast("📊 Taqqoslaş jadvali doskaga muvaffaqiyatli joylaştirildi!");
    });
  }

  /* ==========================================================================
     HUJJATLARNI O'QIŞ VA TO'G'RIDAN-TO'G'RI NAMOYIŞ (DOCUMENT & PRESENTER)
     ========================================================================== */
  const btnDocumentImportTool = document.getElementById('btnDocumentImportTool');
  const menuBtnImportDoc = document.getElementById('menuBtnImportDoc');
  const btnHeaderPresent = document.getElementById('btnHeaderPresent');
  const menuBtnDirectPresent = document.getElementById('menuBtnDirectPresent');
  const btnDirectPresentTool = document.getElementById('btnDirectPresentTool');

  // Oddiy Doska Namoyişi elementlari
  const boardPresenterBar = document.getElementById('boardPresenterBar');
  const btnBoardPresPrev = document.getElementById('btnBoardPresPrev');
  const btnBoardPresNext = document.getElementById('btnBoardPresNext');
  const boardPresPageNum = document.getElementById('boardPresPageNum');
  const boardPresTotalPages = document.getElementById('boardPresTotalPages');
  const btnBoardPresLaser = document.getElementById('btnBoardPresLaser');
  const btnBoardPresPen = document.getElementById('btnBoardPresPen');
  const btnBoardPresFit = document.getElementById('btnBoardPresFit');
  const btnBoardPresExit = document.getElementById('btnBoardPresExit');

  let isBoardPresentationActive = false;
  let prevToolBeforePresentation = 'select';

  function updateBoardPresPageNumbers() {
    if (!engine || !engine.pages) return;
    const currentIdx = engine.pages.findIndex(p => p.id === engine.currentPageId);
    if (boardPresPageNum) boardPresPageNum.textContent = String(currentIdx >= 0 ? currentIdx + 1 : 1);
    if (boardPresTotalPages) boardPresTotalPages.textContent = String(engine.pages.length);
  }

  function startBoardPresentation() {
    isBoardPresentationActive = true;
    prevToolBeforePresentation = toolManager.currentTool;

    document.body.classList.add('board-presentation-active');
    boardPresenterBar?.classList.remove('hidden');

    updateBoardPresPageNumbers();
    toolManager.setTool('laser');
    btnBoardPresLaser?.classList.add('active');
    btnBoardPresPen?.classList.remove('active');

    // Doskani ekranga moslaştiriş (Zoom to Fit)
    if (typeof engine.zoomToFit === 'function') {
      engine.zoomToFit(60);
    }

    toast("▶️ Doska Namoyişi (Lazer: L, Sahifalar: →, Çiqiş: Esc)");
  }

  function exitBoardPresentation() {
    isBoardPresentationActive = false;
    document.body.classList.remove('board-presentation-active');
    boardPresenterBar?.classList.add('hidden');
    toolManager.setTool(prevToolBeforePresentation || 'select');
    toast("Namoyiş yakunlandi");
  }

  function triggerDirectPresentation() {
    // 1. Agar yuklangan hujjat bo'lsa — hujjat namoyishini ochadi
    if (window.documentReader && window.documentReader.currentDoc) {
      window.documentReader.startPresentation(0);
      return;
    }

    // 2. Agar hujjat bo'lmasa — to'g'ridan-to'g'ri doskani namoyiş qiladi!
    startBoardPresentation();
  }

  btnBoardPresExit?.addEventListener('click', exitBoardPresentation);

  btnBoardPresPrev?.addEventListener('click', () => {
    if (!engine || !engine.pages) return;
    const currentIdx = engine.pages.findIndex(p => p.id === engine.currentPageId);
    if (currentIdx > 0) {
      engine.switchPage(engine.pages[currentIdx - 1].id);
      updateBoardPresPageNumbers();
      engine.zoomToFit?.(60);
    }
  });

  btnBoardPresNext?.addEventListener('click', () => {
    if (!engine || !engine.pages) return;
    const currentIdx = engine.pages.findIndex(p => p.id === engine.currentPageId);
    if (currentIdx < engine.pages.length - 1) {
      engine.switchPage(engine.pages[currentIdx + 1].id);
      updateBoardPresPageNumbers();
      engine.zoomToFit?.(60);
    }
  });

  btnBoardPresLaser?.addEventListener('click', () => {
    toolManager.setTool('laser');
    btnBoardPresLaser.classList.add('active');
    btnBoardPresPen?.classList.remove('active');
  });

  btnBoardPresPen?.addEventListener('click', () => {
    toolManager.setTool('pen');
    btnBoardPresPen.classList.add('active');
    btnBoardPresLaser?.classList.remove('active');
  });

  btnBoardPresFit?.addEventListener('click', () => {
    engine.zoomToFit?.(60);
  });

  btnHeaderPresent?.addEventListener('click', triggerDirectPresentation);
  menuBtnDirectPresent?.addEventListener('click', () => {
    closeMainMenu();
    triggerDirectPresentation();
  });
  btnDirectPresentTool?.addEventListener('click', () => {
    document.getElementById('moreToolsAnchor')?.classList.remove('open');
    triggerDirectPresentation();
  });

  if (btnDocumentImportTool) {
    btnDocumentImportTool.addEventListener('click', () => {
      document.getElementById('moreToolsAnchor')?.classList.remove('open');
      if (window.documentReader) {
        window.documentReader.openModal();
      }
    });
  }

  if (menuBtnImportDoc) {
    menuBtnImportDoc.addEventListener('click', () => {
      closeMainMenu();
      if (window.documentReader) {
        window.documentReader.openModal();
      }
    });
  }

  /* ==========================================================================
     TARMOQ QURILMALARI POP-UP TUGMALARI (NET NODE MENU)
     ========================================================================== */
  document.querySelectorAll('#netNodeMenu .popover-item[data-node]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const nodeType = btn.getAttribute('data-node');
      if (!nodeType) return;

      toolManager.currentNodeType = nodeType;
      toolManager.setTool('net_node');

      const center = engine.screenToWorld(engine.width / 2, engine.height / 2);
      const labelMap = {
        router: 'Router', switch: 'Switch', server: 'Server',
        cloud: 'Internet', pc: 'Kompyuter', firewall: 'Firewall'
      };
      const ipMap = {
        router: '192.168.1.1', switch: '192.168.1.2', server: '10.0.0.1',
        cloud: '0.0.0.0', pc: '192.168.1.10', firewall: '10.0.0.254'
      };

      engine.saveState();
      const newNode = {
        id: 'obj_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
        type: 'net_node',
        x: Math.round(center.x),
        y: Math.round(center.y),
        nodeType: nodeType,
        label: labelMap[nodeType] || nodeType,
        ip: ipMap[nodeType] || ''
      };
      engine.addObject(newNode);
      engine.selectObject(newNode);

      toast(`🌐 ${labelMap[nodeType] || nodeType} doskaga joylaştirildi`);

      document.getElementById('moreToolsAnchor')?.classList.remove('open');
      btn.parentElement?.classList.remove('open');
    });
  });

  /* ==========================================================================
     QO'LYOZMA OCR VA FORMULALARNI STANDARTLASHTIRISH
     ========================================================================== */
  const ocrFloatingToolbar = document.getElementById('ocrFloatingToolbar');
  const btnOcrToFormula = document.getElementById('btnOcrToFormula');
  const btnOcrToText = document.getElementById('btnOcrToText');
  const btnCloseOcrFloating = document.getElementById('btnCloseOcrFloating');

  const ocrConfirmModal = document.getElementById('ocrConfirmModal');
  const btnCloseOcrConfirm = document.getElementById('btnCloseOcrConfirm');
  const btnCancelOcr = document.getElementById('btnCancelOcr');
  const btnApplyOcrResult = document.getElementById('btnApplyOcrResult');
  const ocrSourcePreviewImg = document.getElementById('ocrSourcePreviewImg');
  const ocrFormulaLivePreview = document.getElementById('ocrFormulaLivePreview');
  const ocrLatexResultInput = document.getElementById('ocrLatexResultInput');
  const ocrStatusBadge = document.getElementById('ocrStatusBadge');

  let activeOcrStrokes = null;
  let activeOcrBounds = null;

  window.setActiveOcrStrokes = (strokes, bounds) => {
    activeOcrStrokes = strokes;
    activeOcrBounds = bounds;
  };

  if (btnCloseOcrFloating) {
    btnCloseOcrFloating.addEventListener('click', () => {
      toolManager.hideOcrFloatingToolbar();
    });
  }

  // 1. Qo'lyozmani KaTeX formulaga aylantiriş
  if (btnOcrToFormula) {
    btnOcrToFormula.addEventListener('click', async () => {
      const strokes = toolManager.selectedStrokesForOcr;
      if (!strokes || strokes.length === 0) {
        toast("⚠️ Taniş uçun çizmalar tanlanmadi.");
        return;
      }

      toast("⏳ Qo'lda yozilgan formula tahlil qilinmoqda...");
      try {
        const res = await handwritingOCR.recognizeFormula(strokes);
        activeOcrStrokes = strokes;
        activeOcrBounds = res.bounds;

        if (ocrSourcePreviewImg) ocrSourcePreviewImg.src = res.previewUrl;
        if (ocrLatexResultInput) ocrLatexResultInput.value = res.latex;
        if (ocrStatusBadge) {
          ocrStatusBadge.innerHTML = `⚡ Avtonom evristik qolip orqali tanildi (Offline)`;
        }

        // KaTeX render
        if (ocrFormulaLivePreview) {
          if (typeof window.katex !== 'undefined') {
            try {
              ocrFormulaLivePreview.innerHTML = window.katex.renderToString(res.latex, { displayMode: true, throwOnError: false });
            } catch (e) {
              ocrFormulaLivePreview.textContent = res.latex;
            }
          } else {
            ocrFormulaLivePreview.textContent = res.latex;
          }
        }

        toolManager.hideOcrFloatingToolbar();
        ocrConfirmModal?.classList.remove('hidden');
      } catch (err) {
        toast(`❌ Xatolik: ${err.message}`);
      }
    });
  }

  // Jonli KaTeX tahrirlaş (LaTeX input özgarganda)
  if (ocrLatexResultInput && ocrFormulaLivePreview) {
    ocrLatexResultInput.addEventListener('input', () => {
      const val = ocrLatexResultInput.value.trim();
      if (typeof window.katex !== 'undefined') {
        try {
          ocrFormulaLivePreview.innerHTML = window.katex.renderToString(val, { displayMode: true, throwOnError: false });
        } catch (e) {
          ocrFormulaLivePreview.textContent = val;
        }
      } else {
        ocrFormulaLivePreview.textContent = val;
      }
    });
  }

  // Formulani doskaga tatbiq etiş (Replace strokes with Word-style KaTeX formula)
  if (btnApplyOcrResult) {
    btnApplyOcrResult.addEventListener('click', () => {
      if (!activeOcrStrokes || !activeOcrBounds) return;
      const finalLatex = ocrLatexResultInput ? ocrLatexResultInput.value.trim() : '';
      if (!finalLatex) {
        toast("Iltimos, formula LaTeX kodini kiriting!");
        return;
      }

      const formulaObj = {
        type: 'formula',
        x: activeOcrBounds.x,
        y: activeOcrBounds.y,
        width: Math.max(140, activeOcrBounds.width),
        height: Math.max(56, activeOcrBounds.height),
        latex: finalLatex,
        color: toolManager.currentColor || (engine.theme === 'light' ? '#0F172A' : '#FFFFFF'),
        fontSize: 26
      };

      engine.replaceStrokesWithObject(activeOcrStrokes, formulaObj);
      ocrConfirmModal?.classList.add('hidden');
      activeOcrStrokes = null;
      activeOcrBounds = null;
      toast("✅ Qo'lyozma Word standart formulasiga o'tkazildi!");
    });
  }

  if (btnCloseOcrConfirm) btnCloseOcrConfirm.addEventListener('click', () => ocrConfirmModal?.classList.add('hidden'));
  if (btnCancelOcr) btnCancelOcr.addEventListener('click', () => ocrConfirmModal?.classList.add('hidden'));

  // 2. Qölyozmani standart matnga aylantiriş
  if (btnOcrToText) {
    btnOcrToText.addEventListener('click', async () => {
      const strokes = toolManager.selectedStrokesForOcr;
      if (!strokes || strokes.length === 0) return;

      toast("⏳ Yozuv matni tahlil qilinmoqda...");
      try {
        const res = await handwritingOCR.recognizeText(strokes);
        const bounds = res.bounds;

        const textObj = {
          type: 'text',
          x: bounds.x,
          y: bounds.y,
          text: res.text,
          color: toolManager.currentColor || '#F8FAFC',
          fontSize: 20
        };

        engine.replaceStrokesWithObject(strokes, textObj);
        toolManager.hideOcrFloatingToolbar();
        toast(`📝 Yozuv matnga aylantirildi: "${res.text}"`);
      } catch (err) {
        toast(`❌ Xatolik: ${err.message}`);
      }
    });
  }
  // AI paneli vaqtincha olib tashlandi; yangi AI UI keyingi bosqichda quriladi.

  // Global hotkeys

  window.addEventListener('keydown', (e) => {
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

    // Ctrl+F: Qidiruv panelini ochish
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
      e.preventDefault();
      openSearchBar();
      return;
    }

    // Global hotkeys — faqat hech qanday modal ochiq bo'lmagan va modifier tugmalar bosilmagan paytda
    const isAnyModalOpen = () => {
      return document.querySelector('.modal-backdrop:not(.hidden)') !== null ||
             false;
    };

    // F5: To'g'ridan-to'g'ri Namoyiş (Presenter Mode)
    if (e.key === 'F5') {
      e.preventDefault();
      triggerDirectPresentation();
      return;
    }

    // Doska namoyişi faol paytidagi tezkor tugmalar
    if (isBoardPresentationActive) {
      if (e.key === 'Escape') {
        e.preventDefault();
        exitBoardPresentation();
        return;
      }
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        btnBoardPresNext?.click();
        return;
      }
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        btnBoardPresPrev?.click();
        return;
      }
      if (e.key.toLowerCase() === 'l') {
        btnBoardPresLaser?.click();
        return;
      }
      if (e.key.toLowerCase() === 'p') {
        btnBoardPresPen?.click();
        return;
      }
      if (e.key.toLowerCase() === 'f') {
        btnBoardPresFit?.click();
        return;
      }
    }

    // Ctrl+O: Hujjat yuklaş (Document Import) modali
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'o') {
      e.preventDefault();
      btnDocumentImportTool?.click();
      return;
    }

    if (!e.ctrlKey && !e.metaKey && !e.altKey && !isAnyModalOpen()) {
      // G: 2D Funksiya grafigi modali
      if (e.key.toLowerCase() === 'g') {
        btnGraphModalTool?.click();
      }
      // C: Kod <-> Blok-sxema modali
      else if (e.key.toLowerCase() === 'c') {
        btnCodeModalTool?.click();
      }
      // Q: Quiz kartoçkasi modali
      else if (e.key.toLowerCase() === 'q') {
        btnQuizModalTool?.click();
      }
      // D: Hujjat import qiliş modali
      else if (e.key.toLowerCase() === 'd') {
        btnDocumentImportTool?.click();
      }
    }
  });
});

/* ==========================================================================
   TOAST BILDIRIŞNOMA YORDAMÇISI
   ========================================================================== */
function toast(message, duration = 2800) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const t = document.createElement('div');
  t.className = 'board-toast';
  t.setAttribute('role', 'alert');
  t.textContent = typeof message === 'string' ? message : String(message);
  container.appendChild(t);

  setTimeout(() => {
    if (t.parentElement) t.remove();
  }, duration);
}
window.toast = toast;
