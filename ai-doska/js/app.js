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

  // 1. Asosiy modullarni ishga tushirish
  const engine = new WhiteboardEngine('whiteboardCanvas', 'minimapCanvas');
  const toolManager = new ToolManager(engine);
  const aiEngine = new AIBoardEngine(engine);
  const mathSolver = new MathSolver(engine);
  const codeBridge = new CodeBridge(engine);
  const handwritingOCR = new HandwritingOCR(engine, aiEngine);
  const voiceAssistant = new VoiceAssistant(aiEngine, mathSolver, engine);
  const smartboard = new SmartboardManager(engine, toolManager);

  // Global ob'ektlar (debug va qulaylik uchun)
  window.boardEngine = engine;
  window.toolManager = toolManager;
  window.aiEngine = aiEngine;
  window.mathSolver = mathSolver;
  window.codeBridge = codeBridge;
  window.handwritingOCR = handwritingOCR;
  window.voiceAssistant = voiceAssistant;
  window.smartboard = smartboard;

  // 2. Mahalliy xotiradan yuklash (yoki boshlang'ich shablon)
  const hasSaved = engine.loadFromStorage();
  if (!hasSaved) {
    // Bo'sh bo'lsa boshlang'ich chiroyli xush kelibsiz stikeri va diagramma
    const center = engine.screenToWorld(engine.width / 2, engine.height / 2);
    engine.addObject({
      type: 'sticky',
      x: center.x - 280,
      y: center.y - 120,
      width: 220,
      height: 160,
      bgColor: '#FEF08A',
      textColor: '#1E293B',
      text: '👋 XUSH KELIBSIZ!\n\nBu ATT-25 ning mustaqil AI Doskasi.\n\n• Qalam (P), Shakllar (S), Stiker (N)\n• AI Assistent (Ctrl+I) orqali matndan diagramma chizing!'
    }, false);

    // Kichik tarmoq namunasi
    engine.addObject({ type: 'net_node', x: center.x + 80, y: center.y - 40, nodeType: 'router', label: 'Bosh Router', ip: '192.168.1.1' }, false);
    engine.addObject({ type: 'net_node', x: center.x + 240, y: center.y - 40, nodeType: 'server', label: 'Portal Server', ip: '10.0.0.5' }, false);
    engine.addObject({ type: 'arrow', x1: center.x + 110, y1: center.y - 40, x2: center.x + 210, y2: center.y - 40, color: '#10B981', strokeWidth: 3 }, false);
    engine.saveState();
  }

  // Oyna o'lchami o'zgarganda
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
  const aiDrawer = document.getElementById('aiDrawer');
  const aiPromptInput = document.getElementById('aiPromptInput');
  const templatesModal = document.getElementById('templatesModal');
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

  // Esc bosilganda asosiy menyuni yopish
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

  // Smartboard va Fullscreen boshqaruvi
  const btnSmartboardToggle = document.getElementById('btnSmartboardToggle');
  const btnBoardFullscreen = document.getElementById('btnBoardFullscreen');

  const updateSmartboardBtnUI = () => {
    if (!btnSmartboardToggle) return;
    const mode = smartboard.detector.mode;
    const isActive = smartboard.detector.isSmartboard;
    btnSmartboardToggle.classList.toggle('active', isActive);
    btnSmartboardToggle.title = `Interaktiv Doska Rejimi: ${mode === 'auto' ? 'Avtomatik (' + (isActive ? 'Faol' : "O'chiq") + ')' : (mode === 'on' ? 'Doimiy Yoqilgan' : "O'chirilgan")}`;
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
    toast(`📺 Interaktiv Doska Rejimi: ${nextMode === 'on' ? 'Doimiy Yoqildi' : (nextMode === 'off' ? "O'chirildi" : 'Avtomatik aniqlash')}`);
  });

  btnBoardFullscreen?.addEventListener('click', () => {
    smartboard.toggleFullscreen();
  });

  // Sensorli virtual klaviaturani ochish tugmalari
  document.getElementById('btnToggleVirtualKeyboard')?.addEventListener('click', () => smartboard.keyboard.toggle());
  document.getElementById('btnFloatingKeyboard')?.addEventListener('click', () => smartboard.keyboard.toggle());



  // Menyu ichidagi AI Assistent tugmasi
  document.getElementById('menuBtnOpenAi')?.addEventListener('click', () => {
    closeMainMenu();
    if (aiDrawer) {
      aiDrawer.classList.add('open');
      aiPromptInput?.focus();
    }
  });

  // Menyu ichidagi Shablonlar tugmasi
  document.getElementById('menuBtnTemplates')?.addEventListener('click', () => {
    closeMainMenu();
    templatesModal?.classList.remove('hidden');
  });

  // Menyu ichidagi Eksport tugmasi
  document.getElementById('menuBtnExport')?.addEventListener('click', () => {
    closeMainMenu();
    exportModal?.classList.remove('hidden');
  });

  // Menyu ichidagi Doskani Tozalash tugmasi
  document.getElementById('menuBtnClearBoard')?.addEventListener('click', () => {
    closeMainMenu();
    if (confirm("Haqiqatan ham doskadagi barcha elementlarni tozalamoqchimisiz?")) {
      engine.clearBoard();
      toast("Doska tozalandi (Ctrl+Z bilan qaytarish mumkin)");
    }
  });

  // Menyu ichidagi Mavzu tanlash (Theme)
  document.querySelectorAll('.theme-choice-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.theme-choice-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const theme = btn.getAttribute('data-theme');
      engine.setTheme(theme);
      toast(`Mavzu: ${btn.textContent.trim()}`);
    });
  });

  // Menyu ichidagi To'r tanlash (Grid)
  document.querySelectorAll('.grid-choice-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.grid-choice-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const grid = btn.getAttribute('data-grid');
      engine.setGridMode(grid);
      toast(`To'r rejimi: ${btn.textContent.trim()}`);
    });
  });

  /* ==========================================================================
     SHABLONLAR MODALI
     ========================================================================== */
  const btnOpenTemplates = document.getElementById('btnOpenTemplates');
  const btnCloseTemplates = document.getElementById('btnCloseTemplates');
  const templatesGrid = document.getElementById('templatesGrid');

  // Shablon kartochkalarini render qilish
  if (templatesGrid && window.BoardTemplates) {
    templatesGrid.innerHTML = '';
    Object.values(window.BoardTemplates).forEach(tmpl => {
      const card = document.createElement('div');
      card.className = 'template-card';
      card.innerHTML = `
        <div class="template-icon-wrap">${tmpl.icon || '📄'}</div>
        <div class="template-title">${tmpl.title}</div>
        <div class="template-info">${tmpl.desc}</div>
      `;
      card.addEventListener('click', () => {
        const center = engine.screenToWorld(engine.width / 2, engine.height / 2);
        const objs = tmpl.generate(center.x, center.y);
        if (objs && objs.length > 0) {
          engine.saveState();
          objs.forEach(o => engine.addObject(o, false));
          toast(`"${tmpl.title}" shabloni joylashtirildi`);
          templatesModal.classList.add('hidden');
        }
      });
      templatesGrid.appendChild(card);
    });
  }

  if (btnOpenTemplates && templatesModal) {
    btnOpenTemplates.addEventListener('click', () => templatesModal.classList.remove('hidden'));
  }
  if (btnCloseTemplates && templatesModal) {
    btnCloseTemplates.addEventListener('click', () => templatesModal.classList.add('hidden'));
  }

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
    toast("SVG vektorli chizma yuklab olindi");
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
          toast("Doska loyihasi muvaffaqiyatli ochildi!");
          exportModal.classList.add('hidden');
        } else {
          toast("⚠️ Fayl formati noto'g'ri yoki buzilgan.");
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
      toast("📐 Matematik formula doskaga joylashtirildi!");
    });
  }

  /* ==========================================================================
     MAGIC INK TOGGLE
     ========================================================================== */
  const btnMagicInkToggle = document.getElementById('btnMagicInkToggle');
  if (btnMagicInkToggle) {
    btnMagicInkToggle.addEventListener('click', () => {
      toolManager.magicInkEnabled = !toolManager.magicInkEnabled;
      btnMagicInkToggle.classList.toggle('active-feature', toolManager.magicInkEnabled);
      toast(`✨ Magic Ink: ${toolManager.magicInkEnabled ? "Faollashtirildi (Qo'lda chizilgan shakllar avtomatik to'g'irlanadi)" : "O'chirildi"}`);
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
      toast("📈 2D Funksiya grafigi doskaga muvaffaqiyatli chizildi!");
    });
  }

  if (btnSolveMathSteps && graphFuncInput) {
    btnSolveMathSteps.addEventListener('click', () => {
      const expr = graphFuncInput.value.trim();
      if (!expr) {
        toast("Iltimos, yechish uchun tenglamani kiriting!");
        graphFuncInput.focus();
        return;
      }
      const center = engine.screenToWorld(engine.width / 2, engine.height / 2);
      const solution = mathSolver.solve(expr);
      if (solution && solution.steps && solution.steps.length > 0) {
        mathSolver.renderSolutionOnBoard(solution, center.x - 240, center.y - 180);
        graphModal.classList.add('hidden');
        toast(`🧮 "${solution.type.toUpperCase()}" yechimi bosqichma-bosqich doskaga joylashtirildi!`);
      } else {
        toast("⚠️ Bu tenglama uchun yechim qadamlari hisoblanmadi.");
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
      toast("💻 Algoritm blok-sxemasi doskaga chizildi!");
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
        quizQuestionInput.value = 'OSI modelining 3-qatlamida (Tarmoq qatlamida) qaysi protokol ishlaydi?';
        quizOptA.value = 'TCP (Transport)';
        quizOptB.value = 'IP (Internet Protocol)';
        quizOptC.value = 'HTTP (Ilova)';
        quizOptD.value = 'Ethernet (Kanal)';
        quizCorrectSelect.value = '1';
        quizExplanationInput.value = 'IP protokoli paketlarni marshrutlash bilan shug‘ullanadi va OSI ning 3-qatlamida ishlaydi.';
      } else if (q === 'quad') {
        quizTopicInput.value = 'MATEMATIKA & ALGEBRA';
        quizQuestionInput.value = 'Kvadrat tenglama D > 0 bo‘lganda nechta haqiqiy ildizga ega bo‘ladi?';
        quizOptA.value = '2 ta turli haqiqiy ildiz';
        quizOptB.value = '1 ta karrali ildiz';
        quizOptC.value = 'Haqiqiy ildizga ega emas';
        quizOptD.value = 'Cheksiz ko‘p ildiz';
        quizCorrectSelect.value = '0';
        quizExplanationInput.value = 'Diskriminant musbat (D > 0) bo‘lsa, tenglama doimo 2 ta haqiqiy ildizga ega bo‘ladi.';
      } else if (q === 'ohm') {
        quizTopicInput.value = 'FIZIKA & ELEKTR';
        quizQuestionInput.value = 'Zanjir qismi uchun Ohm qonunining to‘g‘ri ifodasini toping:';
        quizOptA.value = 'I = U * R';
        quizOptB.value = 'R = I * U';
        quizOptC.value = 'I = U / R';
        quizOptD.value = 'U = I / R';
        quizCorrectSelect.value = '2';
        quizExplanationInput.value = 'Tok kuchi (I) kuchlanishga (U) to‘g‘ri, qarshilikka (R) teskari proportsionaldir.';
      } else if (q === 'dsa') {
        quizTopicInput.value = 'ALGORITMLAR & DSA';
        quizQuestionInput.value = 'Massivning ixtiyoriy indeksidagi elementiga kirish vaqti qanday baholanadi?';
        quizOptA.value = 'O(n)';
        quizOptB.value = 'O(1) — O‘zgarmas vaqt';
        quizOptC.value = 'O(log n)';
        quizOptD.value = 'O(n^2)';
        quizCorrectSelect.value = '1';
        quizExplanationInput.value = 'Massiv xotirada ketma-ket joylashgani uchun indeks orqali to‘g‘ridan-to‘g‘ri O(1) vaqtda o‘qiladi.';
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
      toast("❓ Interaktiv test kartochkasi doskaga joylashtirildi!");
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
        toast("Iltimos, to'g'ri IPv4 manzilini kiriting!");
        return;
      }
      const center = engine.screenToWorld(engine.width / 2, engine.height / 2);
      const objects = window.SubnetCalculator.generateBoardTable(currentSubnetCalc, center.x - 270, center.y - 165);
      engine.saveState();
      objects.forEach(obj => engine.addObject(obj, false));
      engine.render();
      subnetModal.classList.add('hidden');
      toast(`🔢 ${currentSubnetCalc.inputIp}/${currentSubnetCalc.cidr} hisob jadvali doskaga joylashtirildi!`);
    });
  }

  if (btnInsertSubnetTopology) {
    btnInsertSubnetTopology.addEventListener('click', () => {
      updateSubnetMetrics();
      if (!currentSubnetCalc || !currentSubnetCalc.success) {
        toast("Iltimos, to'g'ri IPv4 manzilini kiriting!");
        return;
      }
      const center = engine.screenToWorld(engine.width / 2, engine.height / 2);
      const objects = window.SubnetCalculator.generateNetworkTopology(currentSubnetCalc, center.x, center.y);
      engine.saveState();
      objects.forEach(obj => engine.addObject(obj, false));
      engine.render();
      subnetModal.classList.add('hidden');
      toast(`🌐 ${currentSubnetCalc.networkIp}/${currentSubnetCalc.cidr} topologiyasi doskaga chizildi!`);
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
      toast("📊 Taqqoslash jadvali doskaga muvaffaqiyatli joylashtirildi!");
    });
  }

  /* ==========================================================================
     SUZUVCHI SELECTION AI TEZKOR BUYRUQLAR BAR
     ========================================================================== */
  const selectionFloatingBar = document.getElementById('selectionFloatingBar');
  const btnSelAiExplain = document.getElementById('btnSelAiExplain');
  const btnSelAiQuiz = document.getElementById('btnSelAiQuiz');
  const btnSelAiColor = document.getElementById('btnSelAiColor');
  const btnSelAiAlign = document.getElementById('btnSelAiAlign');

  engine.onSelectionChange((selected) => {
    if (selectionFloatingBar) {
      selectionFloatingBar.classList.toggle('active', Boolean(selected && selected.length > 0));
    }
  });

  btnSelAiExplain?.addEventListener('click', async () => {
    const obj = engine.selectedObject;
    if (!obj) { toast("Avval doskadan element tanlang!"); return; }
    toast("💡 AI elementni tushuntirmoqda...");
    const desc = obj.text || obj.label || obj.latex || obj.type;
    const center = engine.getObjectBounds ? engine.getObjectBounds(obj) : { x: obj.x, y: obj.y, width: 200, height: 100 };
    const stickyX = (center?.x || obj.x || 0) + (center?.width || 200) + 24;
    const stickyY = (center?.y || obj.y || 0);

    const prompt = `Element: ${desc}. Ushbu mavzuni qisqa va aniq konspekt qilib tushuntir.`;
    const resp = await aiEngine.chatWithAssistant(prompt);

    const stickyObj = {
      type: 'sticky',
      x: Math.round(stickyX),
      y: Math.round(stickyY),
      width: 260,
      height: 150,
      bgColor: '#FEF08A',
      textColor: '#1E293B',
      text: `💡 AI IZOHI:\n\n${(resp.reply || '').substring(0, 220)}...`
    };

    engine.saveState();
    engine.addObject(stickyObj);
    engine.render();
    toast("✅ AI tushuntirish stikeri joylashtirildi!");
  });

  btnSelAiQuiz?.addEventListener('click', async () => {
    const res = await aiEngine.generateQuizFromBoard();
    if (res && res.success) {
      toast(`🧠 "${res.topic}" bo'yicha interaktiv test kartochkasi yaratildi!`);
    }
  });

  const PALETTE_CYCLE = [
    { main: '#00FF87', fill: 'rgba(0,255,135,0.18)' },
    { main: '#38BDF8', fill: 'rgba(56,189,248,0.18)' },
    { main: '#F59E0B', fill: 'rgba(245,158,11,0.18)' },
    { main: '#A855F7', fill: 'rgba(168,85,247,0.18)' }
  ];
  let paletteIdx = 0;

  btnSelAiColor?.addEventListener('click', () => {
    if (engine.selectedObjects.length === 0) return;
    engine.saveState();
    paletteIdx = (paletteIdx + 1) % PALETTE_CYCLE.length;
    const current = PALETTE_CYCLE[paletteIdx];
    engine.selectedObjects.forEach(obj => {
      obj.color = current.main;
      if (obj.fillColor) obj.fillColor = current.fill;
    });
    engine.render();
    toast(`🎨 Element rangi o'zgartirildi: ${current.main}`);
  });

  btnSelAiAlign?.addEventListener('click', () => {
    const count = aiEngine.beautifyAndAlign();
    toast(`📏 ${count} ta element kataklarga tekislandi!`);
  });

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

      toast(`🌐 ${labelMap[nodeType] || nodeType} doskaga joylashtirildi`);

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

  // 1. Qo'lyozmani KaTeX formulaga aylantirish
  if (btnOcrToFormula) {
    btnOcrToFormula.addEventListener('click', async () => {
      const strokes = toolManager.selectedStrokesForOcr;
      if (!strokes || strokes.length === 0) {
        toast("⚠️ Tanish uchun chizmalar tanlanmadi.");
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
          ocrStatusBadge.innerHTML = res.mode === 'gemini'
            ? `✨ Google Gemini Vision orqali 99% aniqlikda tanildi`
            : `⚡ Avtonom evristik qolip orqali tanildi (Offline)`;
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

  // Jonli KaTeX tahrirlash (LaTeX input o'zgarganda)
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

  // Formulani doskaga tatbiq etish (Replace strokes with Word-style KaTeX formula)
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

  // 2. Qo'lyozmani standart matnga aylantirish
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

  /* ==========================================================================
     AI YON PANELI (AI DRAWER)
     ========================================================================== */
  const btnToggleAi = document.getElementById('btnToggleAi');
  const btnCloseAi = document.getElementById('btnCloseAi');

  if (btnToggleAi && aiDrawer) {
    btnToggleAi.addEventListener('click', () => {
      aiDrawer.classList.toggle('open');
    });
  }
  if (btnCloseAi && aiDrawer) {
    btnCloseAi.addEventListener('click', () => {
      aiDrawer.classList.remove('open');
    });
  }

  // AI Tab almashtirish
  document.querySelectorAll('.ai-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.ai-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.ai-pane').forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetId = tab.getAttribute('data-tab');
      const pane = document.getElementById(targetId.replace('ai', 'paneAi'));
      if (pane) pane.classList.add('active');
    });
  });

  // AI Generatsiya qilish tugmasi
  const btnAiRun = document.getElementById('btnAiRunGenerate');
  const aiGenType = document.getElementById('aiGenType');
  const aiGenStatus = document.getElementById('aiGenStatus');

  if (btnAiRun) {
    btnAiRun.addEventListener('click', async () => {
      const prompt = aiPromptInput.value.trim();
      if (!prompt) {
        toast("Iltimos, AI ga buyruq matnini kiriting!");
        aiPromptInput.focus();
        return;
      }

      btnAiRun.disabled = true;
      btnAiRun.innerHTML = `<span>Chizilmoqda...</span>`;
      if (aiGenStatus) {
        aiGenStatus.classList.remove('hidden');
        aiGenStatus.innerHTML = `⏳ AI doskaga diagramma elementlarini hisoblab joylashtirmoqda...`;
      }

      try {
        const type = aiGenType ? aiGenType.value : 'diagram';
        const res = await aiEngine.generateFromPrompt(prompt, type);
        toast(`✨ AI muvaffaqiyatli ${res.count} ta element chizdi!`);
        if (aiGenStatus) {
          aiGenStatus.innerHTML = `✅ <b>Muvaffaqiyatli:</b> ${res.count} ta element doskaga joylashtirildi (${res.mode === 'gemini' ? 'Gemini AI' : 'Tezkor generator'}).`;
        }
      } catch (err) {
        toast(`⚠️ Xatolik: ${err.message}`);
        if (aiGenStatus) {
          aiGenStatus.innerHTML = `❌ <b>Xatolik:</b> ${sanitizeHTML(err.message)}`;
        }
      } finally {
        btnAiRun.disabled = false;
        btnAiRun.innerHTML = `<span>Doskaga Chizish</span> <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
      }
    });
  }

  // Tezkor Preset chiplar — preset ID → aniq prompt
  const PRESET_PROMPTS = {
    microservices: 'Microservices API Gateway arxitektura',
    docker_k8s: 'Docker Kubernetes K8s konteyner klaster',
    cicd: 'CI/CD pipeline devops',
    git_flow: 'Git branching flow commit',
    neural_net: "Neyron tarmoq sun'iy intellekt deep learning",
    sql_joins: 'SQL Join relyatsion ma\'lumotlar bazasi',
    load_balancer: 'Load Balancer Nginx proxy',
    dns: 'DNS domen ip qidirish',
    osi: 'OSI 7 qatlam modeli',
    client_server: 'Client server mijoz arxitektura',
    tcp_handshake: 'TCP handshake syn',
    flowchart: 'Algoritm flowchart blok sxema',
    ospf_bgp: 'OSPF BGP marshrutlash protokol',
    zero_trust: 'Zero-Trust ZTNA sifr ishonch',
    rest_api: 'REST API dizayn HTTP metod endpoint',
    oauth_jwt: 'OAuth JWT autentifikatsiya token',
    cloud_arch: 'Cloud AWS Azure bulut arxitektura',
    cache_redis: 'Cache Redis kesh arxitektura',
    kafka: 'Kafka Message Queue rabbitmq navbat',
    vlan: 'VLAN kommutatsiya switch trunk 802.1q',
    dhcp: 'DHCP ip berish ip discovery',
    tls: 'TLS SSL HTTPS shifrlash handshake',
    erd: "ERD entity ma'lumotlar bazasi diagramma",
    big_o: 'Big O algoritmlar murakkablik tahlil',
    sorting: 'Sorting saralash quicksort mergesort algoritm',
    swot: 'SWOT kuchli zaif',
    math_formulas: 'Formula matematik fizika tenglama',
    subnet_calc: '192.168.10.0/26 subnet hisob',
    tcp_udp_comp: 'TCP vs UDP taqqos jadval',
    osi_comp: 'OSI vs TCP/IP solishtir jadval',
    pki_flow: 'PKI raqamli imzo kriptografiya',
    webrtc_call: 'WebRTC video call p2p',
    cicd_gitops: 'DevOps CI/CD GitOps pipeline',
  };

  document.querySelectorAll('.ai-chip[data-preset]').forEach(chip => {
    chip.addEventListener('click', () => {
      const preset = chip.getAttribute('data-preset');
      const promptText = PRESET_PROMPTS[preset] || chip.textContent.trim();
      if (aiPromptInput) aiPromptInput.value = promptText;
      if (btnAiRun) btnAiRun.click();
    });
  });

  // Doska Tahlili (Konspekt & Tushuntirish)
  const btnAiSummarize = document.getElementById('btnAiSummarize');
  const btnAiExplain = document.getElementById('btnAiExplain');
  const aiAnalysisResult = document.getElementById('aiAnalysisResult');

  const runAnalysis = async (action) => {
    if (!aiAnalysisResult) return;
    aiAnalysisResult.innerHTML = `⏳ <i>Doska tahlil qilinmoqda, iltimos kuting...</i>`;

    try {
      const resultText = await aiEngine.analyzeBoard(action);
      aiAnalysisResult.innerHTML = safeFormatMarkdown(resultText);
    } catch (e) {
      aiAnalysisResult.innerHTML = `❌ Tahlil qilishda xatolik: ${sanitizeHTML(e.message)}`;
    }
  };

  if (btnAiSummarize) btnAiSummarize.addEventListener('click', () => runAnalysis('summarize'));
  if (btnAiExplain) btnAiExplain.addEventListener('click', () => runAnalysis('explain'));

  // Yangi: doska bo'yicha quiz generatsiyasi tahlil ko'rinishida
  const btnAiQuizAnalysis = document.getElementById('btnAiQuizAnalysis');
  if (btnAiQuizAnalysis) btnAiQuizAnalysis.addEventListener('click', () => runAnalysis('quiz'));

  // Yangi: AI Rang Tavsiyachi
  const btnAiColorPalette = document.getElementById('btnAiColorPalette');
  if (btnAiColorPalette && aiAnalysisResult) {
    btnAiColorPalette.addEventListener('click', () => {
      const palette = aiEngine.suggestColorPalette('tech');
      aiAnalysisResult.innerHTML = `
        <b>🎨 AI Tavsiya Etgan Rang Palitasi:</b><br>
        <div style="display:flex;gap:6px;margin:8px 0;flex-wrap:wrap;">
          ${palette.colors.map(c => `<div title="${c}" onclick="navigator.clipboard.writeText('${c}');toast('Rang nusxalandi: ${c}')" style="cursor:pointer;width:36px;height:36px;border-radius:6px;background:${c};border:2px solid rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;font-size:9px;color:rgba(0,0,0,0.7);" title="${c}"></div>`).join('')}
        </div>
        <b>Fon:</b> <code style="background:rgba(255,255,255,0.1);padding:1px 6px;border-radius:3px;">${palette.bg}</code><br>
        <br><span style="color:#94A3B8;font-size:11px;">Rangni bosing — buferga ko'chiriladi</span>
      `;
      toast('🎨 Tavsiya rang palitasi ko\'rsatildi');
    });
  }

  // Chizmalarni tekislash (Smart Beautifier & Auto-align)
  const btnAiBeautify = document.getElementById('btnAiBeautify');
  if (btnAiBeautify) {
    btnAiBeautify.addEventListener('click', () => {
      const count = aiEngine.beautifyAndAlign();
      if (aiAnalysisResult) {
        aiAnalysisResult.innerHTML = `
          <div class="validation-card success">
            <strong>✨ Chizmalar Muvaffaqiyatli Tekislandi!</strong>
            Doskadagi ${count} ta element to'r bo'yicha mukammal tekislandi va tartibga keltirildi. (Kerak bo'lsa, Ctrl+Z orqali qaytarishingiz mumkin).
          </div>
        `;
      }
      toast(`✨ ${count} ta element tekislandi`);
    });
  }

  // Xatoliklarni tekshirish (Validator & Sanity Check)
  const btnAiValidate = document.getElementById('btnAiValidate');
  if (btnAiValidate) {
    btnAiValidate.addEventListener('click', () => {
      const findings = aiEngine.validateBoardLogic();
      if (aiAnalysisResult) {
        aiAnalysisResult.innerHTML = findings.map(f => `
          <div class="validation-card ${f.type}">
            <strong>${f.type === 'warning' ? '⚠️' : (f.type === 'success' ? '✅' : 'ℹ️')} ${f.title}</strong>
            ${f.message}
          </div>
        `).join('');
      }
      toast("🔍 Doska mantiqi tekshirildi");
    });
  }

  /* ==========================================================================
     OVOZLI BOSHQARUV (VOICE ASSISTANT WIRED)
     ========================================================================== */
  const btnVoicePrompt = document.getElementById('btnVoicePrompt');
  const btnVoiceChat = document.getElementById('btnVoiceChat');
  const voiceLangSelect = document.getElementById('voiceLangSelect');

  if (voiceLangSelect) {
    voiceLangSelect.addEventListener('change', () => {
      voiceAssistant.setLanguage(voiceLangSelect.value);
      toast(`Ovozli til: ${voiceLangSelect.options[voiceLangSelect.selectedIndex].text}`);
    });
  }

  let activeVoiceTarget = 'prompt'; // 'prompt' or 'chat'
  voiceAssistant.onStatusChange = (status) => {
    const isL = status === 'listening';
    [btnVoicePrompt, btnVoiceChat].forEach(btn => {
      if (!btn) return;
      if (isL) {
        btn.classList.add('listening');
        if (btn.querySelector('span')) btn.querySelector('span').textContent = "Tinglanmoqda...";
      } else {
        btn.classList.remove('listening');
        if (btn.querySelector('span')) btn.querySelector('span').textContent = "Ovoz";
      }
    });
  };

  voiceAssistant.onTranscript = (text, isFinal) => {
    if (activeVoiceTarget === 'prompt') {
      if (aiPromptInput) aiPromptInput.value = text;
    } else {
      const chatInput = document.getElementById('aiChatInput');
      if (chatInput) chatInput.value = text;
    }
  };

  if (btnVoicePrompt) {
    btnVoicePrompt.addEventListener('click', () => {
      activeVoiceTarget = 'prompt';
      voiceAssistant.toggle();
    });
  }
  if (btnVoiceChat) {
    btnVoiceChat.addEventListener('click', () => {
      activeVoiceTarget = 'chat';
      voiceAssistant.toggle();
    });
  }

  /* ==========================================================================
     AI REPETITOR & CO-PILOT (CHAT ENGINE WIRED)
     ========================================================================== */
  const aiChatMessages = document.getElementById('aiChatMessages');
  const aiChatInput = document.getElementById('aiChatInput');
  const btnSendChat = document.getElementById('btnSendChat');

  const appendChatMessage = (text, sender = 'bot') => {
    if (!aiChatMessages) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg ${sender}`;

    const formatted = safeFormatMarkdown(text);

    let innerHtml = `<div class="chat-bubble">${formatted}</div>`;

    if (sender === 'bot') {
      innerHtml += `
        <div class="chat-actions">
          <button class="btn-chat-insert" title="Ushbu ma'lumotni doskaga stiker qilib joylashtirish">📥 Doskaga qo'shish</button>
        </div>
      `;
    }

    msgDiv.innerHTML = innerHtml;

    if (sender === 'bot') {
      const btnInsert = msgDiv.querySelector('.btn-chat-insert');
      if (btnInsert) {
        btnInsert.addEventListener('click', () => {
          aiEngine.insertChatResponseToBoard(text);
          toast("✅ AI javobi doskaga stiker sifatida joylashtirildi!");
        });
      }
    }

    aiChatMessages.appendChild(msgDiv);
    aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
  };

  const sendChatMessage = async () => {
    if (!aiChatInput) return;
    const q = aiChatInput.value.trim();
    if (!q) return;

    appendChatMessage(q, 'user');
    aiChatInput.value = '';

    // O'ylamoqda animatsiyasi
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-msg bot';
    typingDiv.innerHTML = `<div class="chat-bubble" style="font-style: italic; color: #94A3B8;">⏳ AI javob tayyorlamoqda...</div>`;
    aiChatMessages.appendChild(typingDiv);
    aiChatMessages.scrollTop = aiChatMessages.scrollHeight;

    try {
      const res = await aiEngine.chatWithAssistant(q);
      typingDiv.remove();
      appendChatMessage(res.reply, 'bot');
    } catch (err) {
      typingDiv.remove();
      appendChatMessage(`Kechirasiz, xatolik yuz berdi: ${err.message}`, 'bot');
    }
  };

  if (btnSendChat) btnSendChat.addEventListener('click', sendChatMessage);
  if (aiChatInput) {
    aiChatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendChatMessage();
      }
    });
  }

  document.querySelectorAll('.chat-quick-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const q = chip.getAttribute('data-q');
      if (aiChatInput && q) {
        aiChatInput.value = q;
        sendChatMessage();
      }
    });
  });

  // Chat tarixini tozalash
  const btnClearChat = document.getElementById('btnClearChat');
  if (btnClearChat && aiChatMessages) {
    btnClearChat.addEventListener('click', () => {
      aiEngine.clearHistory();
      aiChatMessages.innerHTML = `
        <div class="chat-msg bot">
          <div class="chat-bubble">💬 Suhbat tarixi tozalandi. Yangi suhbat boshlandi! Nima haqida gaplashamiz?</div>
        </div>
      `;
      toast('🗑️ Chat tarixi tozalandi');
    });
  }

  /* ==========================================================================
     YANGI: AI ELEMENTLARNI TAHRIRLASH PANELI
     ========================================================================== */
  const aiEditInput = document.getElementById('aiEditInput');
  const btnAiEdit = document.getElementById('btnAiEdit');
  const aiEditStatus = document.getElementById('aiEditStatus');

  if (btnAiEdit && aiEditInput) {
    btnAiEdit.addEventListener('click', async () => {
      const instruction = aiEditInput.value.trim();
      if (!instruction) {
        toast('Iltimos, tahrirlash buyrug\'ini kiriting!');
        aiEditInput.focus();
        return;
      }

      btnAiEdit.disabled = true;
      btnAiEdit.textContent = 'Bajarilmoqda...';

      try {
        const res = await aiEngine.editSelectedWithAI(instruction);
        if (aiEditStatus) {
          aiEditStatus.classList.remove('hidden');
          aiEditStatus.innerHTML = res.success
            ? `<span style="color:#10B981;">✅ ${res.message}</span>`
            : `<span style="color:#F59E0B;">⚠️ ${res.message}</span>`;
        }
        if (res.success) {
          aiEditInput.value = '';
          toast(res.message);
        }
      } catch (e) {
        if (aiEditStatus) aiEditStatus.innerHTML = `<span style="color:#F43F5E;">❌ ${e.message}</span>`;
      } finally {
        btnAiEdit.disabled = false;
        btnAiEdit.textContent = '✦ Bajar';
      }
    });

    // Enter bosilganda
    aiEditInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); btnAiEdit.click(); }
    });
  }

  // AI tahrirlash quick chiplar
  document.querySelectorAll('.ai-edit-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      if (aiEditInput) {
        aiEditInput.value = chip.getAttribute('data-cmd') || chip.textContent.trim();
        aiEditInput.focus();
      }
    });
  });

  /* ==========================================================================
     DOSKADAN AVTOMATIK TEST YARATISH (AUTO-QUIZ WIRED)
     ========================================================================== */
  const btnAiAutoQuiz = document.getElementById('btnAiAutoQuiz');
  const aiQuizStatus = document.getElementById('aiQuizStatus');

  if (btnAiAutoQuiz) {
    btnAiAutoQuiz.addEventListener('click', async () => {
      btnAiAutoQuiz.disabled = true;
      btnAiAutoQuiz.innerHTML = `<span>Savol generatsiya qilinmoqda...</span>`;

      try {
        const res = await aiEngine.generateQuizFromBoard();
        if (aiQuizStatus) {
          aiQuizStatus.classList.remove('hidden');
          aiQuizStatus.innerHTML = `
            ✅ <b>"${res.topic}"</b> mavzusida test yaratildi va doska markaziga joylashtirildi!<br>
            <span style="font-size: 11px; color: #CBD5E1;">Savol: ${res.question}</span>
          `;
        }
        toast("🧠 Doskadan test kartochkasi yaratildi!");
      } catch (e) {
        toast("Test yaratish xatosi: " + e.message);
      } finally {
        btnAiAutoQuiz.disabled = false;
        btnAiAutoQuiz.innerHTML = `<span>Doska Asosida Test Yaratish</span> <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
      }
    });
  }

  // AI Sozlamalar
  const geminiKeyInput = document.getElementById('geminiApiKeyInput');
  const btnSaveKey = document.getElementById('btnSaveApiKey');
  const geminiBlock = document.getElementById('geminiKeyBlock');

  if (geminiKeyInput && aiEngine.apiKey) {
    geminiKeyInput.value = aiEngine.apiKey;
  }

  document.querySelectorAll('input[name="aiMode"]').forEach(radio => {
    if (radio.value === aiEngine.mode) radio.checked = true;
    radio.addEventListener('change', () => {
      aiEngine.mode = radio.value;
      localStorage.setItem('att25_ai_mode', radio.value);
      if (geminiBlock) {
        geminiBlock.style.opacity = radio.value === 'gemini' ? '1' : '0.5';
      }
      toast(`AI rejimi: ${radio.value === 'gemini' ? 'Google Gemini API' : 'Avtonom Tezkor'}`);
    });
  });

  if (geminiBlock) {
    geminiBlock.style.opacity = aiEngine.mode === 'gemini' ? '1' : '0.5';
  }

  if (btnSaveKey && geminiKeyInput) {
    btnSaveKey.addEventListener('click', () => {
      const key = geminiKeyInput.value.trim();
      aiEngine.saveApiKey(key);
      toast(key ? "✅ Gemini API kaliti saqlandi va faollashtirildi!" : "Kalit tozalandi.");
    });
  }

  // Modallarni tashqi fonga bosilganda yopish
  window.addEventListener('click', (e) => {
    if (e.target === templatesModal) templatesModal.classList.add('hidden');
    if (e.target === exportModal) exportModal.classList.add('hidden');
    if (e.target === formulaModal) formulaModal.classList.add('hidden');
    if (e.target === graphModal) graphModal.classList.add('hidden');
    if (e.target === codeBridgeModal) codeBridgeModal.classList.add('hidden');
    if (e.target === quizModal) quizModal.classList.add('hidden');
    if (e.target === ocrConfirmModal) ocrConfirmModal.classList.add('hidden');
    if (e.target === subnetModal) subnetModal.classList.add('hidden');
    if (e.target === comparisonModal) comparisonModal.classList.add('hidden');
  });

  /* ==========================================================================
     KO'P SAHIFA (MULTI-PAGE) BOSHQARUV TIZIMI
     ========================================================================== */
  const pagesTabsContainer = document.getElementById('pagesTabsContainer');
  const btnAddPage = document.getElementById('btnAddPage');

  function renderPagesTabs() {
    if (!pagesTabsContainer || !engine.pages) return;
    pagesTabsContainer.innerHTML = '';

    engine.pages.forEach((p, idx) => {
      const tab = document.createElement('div');
      tab.className = `page-tab ${p.id === engine.currentPageId ? 'active' : ''}`;
      tab.title = "Ochish uchun bosing. Nomini o'zgartirish uchun ikki marta bosing.";

      const titleSpan = document.createElement('span');
      titleSpan.className = 'page-tab-title';
      titleSpan.textContent = p.title || `Sahifa ${idx + 1}`;

      tab.appendChild(titleSpan);

      // Faqat 1 tadan ko'p sahifa bo'lganda o'chirish tugmasi ko'rinadi
      if (engine.pages.length > 1) {
        const closeBtn = document.createElement('button');
        closeBtn.className = 'page-tab-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.title = "Ushbu sahifani o'chirish";
        closeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (confirm(`"${p.title || `Sahifa ${idx + 1}`}" sahifasini o'chirmoqchimisiz?`)) {
            engine.deletePage(p.id);
            toast("Sahifa o'chirildi");
          }
        });
        tab.appendChild(closeBtn);
      }

      // Sahifaga o'tish
      tab.addEventListener('click', () => {
        if (p.id !== engine.currentPageId) {
          engine.switchPage(p.id);
        }
      });

      // Sahifa nomini tahrirlash (Dblclick)
      tab.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        const newTitle = prompt("Sahifa nomini kiriting:", p.title || `Sahifa ${idx + 1}`);
        if (newTitle && newTitle.trim()) {
          engine.renamePage(p.id, newTitle.trim());
        }
      });

      pagesTabsContainer.appendChild(tab);
    });
  }

  // Engine hodisasiga bog'lash
  engine.onPageChange(() => {
    renderPagesTabs();
  });

  // Boshlang'ich render
  renderPagesTabs();

  // Yangi sahifa qo'shish
  btnAddPage?.addEventListener('click', () => {
    const newPage = engine.addPage();
    toast(`📄 Yangi sahifa ochildi: "${newPage.title}"`);
  });

  /* ==========================================================================
     OB'EKTLARNI QIDIRISH (SEARCH - CTRL+F) SUZUVCHI PANELI
     ========================================================================== */
  const boardSearchBar = document.getElementById('boardSearchBar');
  const boardSearchInput = document.getElementById('boardSearchInput');
  const boardSearchCount = document.getElementById('boardSearchCount');
  const btnSearchPrev = document.getElementById('btnSearchPrev');
  const btnSearchNext = document.getElementById('btnSearchNext');
  const btnCloseSearch = document.getElementById('btnCloseSearch');
  const btnOpenSearch = document.getElementById('btnOpenSearch');

  let searchMatches = [];
  let currentMatchIndex = -1;

  function openSearchBar() {
    if (!boardSearchBar) return;
    boardSearchBar.classList.remove('hidden');
    boardSearchInput?.focus();
    boardSearchInput?.select();
    if (boardSearchInput && boardSearchInput.value.trim()) {
      runSearch(boardSearchInput.value.trim());
    }
  }

  function closeSearchBar() {
    if (!boardSearchBar) return;
    boardSearchBar.classList.add('hidden');
    engine.highlightedObject = null;
    engine.markDirty();
  }

  function runSearch(query) {
    if (!query || !query.trim()) {
      searchMatches = [];
      currentMatchIndex = -1;
      if (boardSearchCount) boardSearchCount.textContent = '0/0';
      engine.highlightedObject = null;
      engine.markDirty();
      return;
    }

    searchMatches = engine.findObjects(query);
    if (searchMatches.length > 0) {
      currentMatchIndex = 0;
      if (boardSearchCount) boardSearchCount.textContent = `1/${searchMatches.length}`;
      goToMatch(currentMatchIndex);
    } else {
      currentMatchIndex = -1;
      if (boardSearchCount) boardSearchCount.textContent = '0/0';
      engine.highlightedObject = null;
      engine.markDirty();
    }
  }

  function goToMatch(index) {
    if (index < 0 || index >= searchMatches.length) return;
    currentMatchIndex = index;
    if (boardSearchCount) boardSearchCount.textContent = `${currentMatchIndex + 1}/${searchMatches.length}`;

    const match = searchMatches[currentMatchIndex];
    const obj = match.obj;
    const b = engine.getObjectBounds(obj);
    const centerX = b.x + b.width / 2;
    const centerY = b.y + b.height / 2;

    engine.panTo(centerX, centerY);
    engine.highlightObject(obj);
    engine.selectObject(obj, false);
  }

  btnOpenSearch?.addEventListener('click', openSearchBar);
  btnCloseSearch?.addEventListener('click', closeSearchBar);

  boardSearchInput?.addEventListener('input', (e) => {
    runSearch(e.target.value);
  });

  boardSearchInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (searchMatches.length === 0) return;
      if (e.shiftKey) {
        currentMatchIndex = (currentMatchIndex - 1 + searchMatches.length) % searchMatches.length;
      } else {
        currentMatchIndex = (currentMatchIndex + 1) % searchMatches.length;
      }
      goToMatch(currentMatchIndex);
    } else if (e.key === 'Escape') {
      closeSearchBar();
    }
  });

  btnSearchNext?.addEventListener('click', () => {
    if (searchMatches.length === 0) return;
    currentMatchIndex = (currentMatchIndex + 1) % searchMatches.length;
    goToMatch(currentMatchIndex);
  });

  btnSearchPrev?.addEventListener('click', () => {
    if (searchMatches.length === 0) return;
    currentMatchIndex = (currentMatchIndex - 1 + searchMatches.length) % searchMatches.length;
    goToMatch(currentMatchIndex);
  });

  // Global hotkeys

  window.addEventListener('keydown', (e) => {
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

    // Ctrl+F: Qidiruv panelini ochish
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
      e.preventDefault();
      openSearchBar();
      return;
    }

    // Ctrl+I: AI panelini ochish
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'i') {
      e.preventDefault();
      aiDrawer.classList.toggle('open');
      if (aiDrawer.classList.contains('open')) {
        aiPromptInput?.focus();
      }
      return;
    }

    // Ctrl+Shift+A: Doska AI tahlili
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
      e.preventDefault();
      aiDrawer?.classList.add('open');
      setTimeout(() => {
        const analyzeTab = document.querySelector('.ai-tab[data-tab="aiAnalyze"]');
        analyzeTab?.click();
        document.getElementById('btnAiSummarize')?.click();
      }, 100);
      toast('🔍 Doska tahlil qilinmoqda...');
      return;
    }

    // Ctrl+Shift+E: Tanlangan elementni AI bilan tahrirlash
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'e') {
      e.preventDefault();
      aiDrawer?.classList.add('open');
      setTimeout(() => {
        const editTab = document.querySelector('.ai-tab[data-tab="aiEdit"]');
        editTab?.click();
        document.getElementById('aiEditInput')?.focus();
      }, 100);
      toast('✦ AI Tahrirlash paneli ochildi');
      return;
    }

    // Global hotkeys — faqat hech qanday modal ochiq bo'lmagan va modifier tugmalar bosilmagan paytda
    const isAnyModalOpen = () => {
      return document.querySelector('.modal-backdrop:not(.hidden)') !== null ||
             (aiDrawer && aiDrawer.classList.contains('open'));
    };

    if (!e.ctrlKey && !e.metaKey && !e.altKey && !isAnyModalOpen()) {
      // G: 2D Funksiya grafigi modali
      if (e.key.toLowerCase() === 'g') {
        btnGraphModalTool?.click();
      }
      // C: Kod <-> Blok-sxema modali
      else if (e.key.toLowerCase() === 'c') {
        btnCodeModalTool?.click();
      }
      // Q: Quiz kartochkasi modali
      else if (e.key.toLowerCase() === 'q') {
        btnQuizModalTool?.click();
      }
    }
  });
});

/* ==========================================================================
   TOAST BILDIRISHNOMA YORDAMCHISI
   ========================================================================== */
function toast(message, duration = 2800) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const t = document.createElement('div');
  t.className = 'board-toast';
  t.setAttribute('role', 'alert');
  t.innerHTML = message;
  container.appendChild(t);

  setTimeout(() => {
    if (t.parentElement) t.remove();
  }, duration);
}
window.toast = toast;
