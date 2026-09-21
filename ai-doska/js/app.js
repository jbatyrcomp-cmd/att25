/* ==========================================================================
   ATT-25 AI DOSKA — MAIN CONTROLLER (app.js)
   Ilova initsializatsiyasi, Modallar, AI boshqaruvi, Eksport va Hodisalar
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Asosiy modullarni ishga tushirish
  const engine = new WhiteboardEngine('whiteboardCanvas', 'minimapCanvas');
  const toolManager = new ToolManager(engine);
  const aiEngine = new AIBoardEngine(engine);

  // Global ob'ektlar (debug va qulaylik uchun)
  window.boardEngine = engine;
  window.toolManager = toolManager;
  window.aiEngine = aiEngine;

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
     TOP BAR HODISALARI (UNDO/REDO, ZOOM, TO'R, MAVZU, TOZALASH)
     ========================================================================== */
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

  // To'r (Grid) menyusi
  const btnGridSelect = document.getElementById('btnGridSelect');
  if (btnGridSelect) {
    btnGridSelect.addEventListener('click', (e) => {
      e.stopPropagation();
      btnGridSelect.parentElement.classList.toggle('open');
    });
  }

  document.querySelectorAll('#gridMenu .dropdown-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelectorAll('#gridMenu .dropdown-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      const mode = item.getAttribute('data-grid');
      engine.setGridMode(mode);
      btnGridSelect.parentElement.classList.remove('open');
      toast(`To'r rejimi: ${item.textContent}`);
    });
  });

  // Mavzu (Theme) menyusi
  const btnThemeSelect = document.getElementById('btnThemeSelect');
  if (btnThemeSelect) {
    btnThemeSelect.addEventListener('click', (e) => {
      e.stopPropagation();
      btnThemeSelect.parentElement.classList.toggle('open');
    });
  }

  document.querySelectorAll('#themeMenu .dropdown-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelectorAll('#themeMenu .dropdown-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      const theme = item.getAttribute('data-theme');
      engine.setTheme(theme);
      btnThemeSelect.parentElement.classList.remove('open');
      toast(`Mavzu o'zgartirildi: ${item.textContent}`);
    });
  });

  // Tozalash tugmasi
  const btnClearBoard = document.getElementById('btnClearBoard');
  if (btnClearBoard) {
    btnClearBoard.addEventListener('click', () => {
      if (confirm("Haqiqatan ham doskadagi barcha elementlarni tozalamoqchimisiz?")) {
        engine.clearBoard();
        toast("Doska tozalandi (Ctrl+Z bilan qaytarish mumkin)");
      }
    });
  }

  /* ==========================================================================
     SHABLONLAR MODALI
     ========================================================================== */
  const templatesModal = document.getElementById('templatesModal');
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
  const exportModal = document.getElementById('exportModal');
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
     AI YON PANELI (AI DRAWER)
     ========================================================================== */
  const aiDrawer = document.getElementById('aiDrawer');
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
  const aiPromptInput = document.getElementById('aiPromptInput');
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
          aiGenStatus.innerHTML = `❌ <b>Xatolik:</b> ${err.message}`;
        }
      } finally {
        btnAiRun.disabled = false;
        btnAiRun.innerHTML = `<span>Doskaga Chizish</span> <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
      }
    });
  }

  // Tezkor Preset chiplar
  document.querySelectorAll('.ai-chip[data-preset]').forEach(chip => {
    chip.addEventListener('click', () => {
      const preset = chip.getAttribute('data-preset');
      aiPromptInput.value = chip.textContent.trim();
      btnAiRun.click();
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
      // Formatlash: yangi qatorlarni <br>, **qalin** so'zlarni <b>
      const htmlFormatted = resultText
        .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
        .replace(/\n/g, '<br>');
      aiAnalysisResult.innerHTML = htmlFormatted;
    } catch (e) {
      aiAnalysisResult.innerHTML = `❌ Tahlil qilishda xatolik: ${e.message}`;
    }
  };

  if (btnAiSummarize) btnAiSummarize.addEventListener('click', () => runAnalysis('summarize'));
  if (btnAiExplain) btnAiExplain.addEventListener('click', () => runAnalysis('explain'));

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
  });

  // Global hotkey: Ctrl+I orqali AI panelini ochish
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'i') {
      e.preventDefault();
      aiDrawer.classList.toggle('open');
      if (aiDrawer.classList.contains('open')) {
        aiPromptInput.focus();
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
  t.innerHTML = message;
  container.appendChild(t);

  setTimeout(() => {
    if (t.parentElement) t.remove();
  }, duration);
}
window.toast = toast;
