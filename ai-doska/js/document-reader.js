/* ==========================================================================
   ATT-25 AI DOSKA — DOCUMENT READER & IMPORTER (document-reader.js)
   Ko'p formatli hujjatlarni o'qish (PDF, DOCX, XLSX, PPTX, TXT),
   doskaga slaydlar/jadvallar qilib joylashtirish va AI yordamida tahlil qilish
   ========================================================================== */

class DocumentReader {
  constructor(boardEngine, aiEngine) {
    this.board = boardEngine;
    this.ai = aiEngine;

    // Hozirgi yuklangan va tahlil qilingan hujjat
    this.currentDoc = null;

    // DOM elementlari
    this.modal = document.getElementById('documentImportModal');
    this.btnCloseModal = document.getElementById('btnCloseDocImport');
    this.dropZone = document.getElementById('docDropZone');
    this.fileInput = document.getElementById('docFileInput');
    this.loadingBox = document.getElementById('docLoadingBox');
    this.loadingText = document.getElementById('docLoadingText');
    this.previewSection = document.getElementById('docPreviewSection');

    this.init();
  }

  init() {
    // 1. PDF.js Worker sozlamasi
    if (typeof window !== 'undefined' && window.pdfjsLib) {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }

    // 2. Hodisalarni ulash
    this.bindEvents();

    // 3. Taqdimot / Namoyish rejimini ishga tushirish
    this.initPresenter();
  }

  bindEvents() {
    // Modal ochish / yopish
    if (this.btnCloseModal) {
      this.btnCloseModal.addEventListener('click', () => this.closeModal());
    }

    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) this.closeModal();
      });
    }

    // Drop zone klik qilganda fayl tanlagichni ochish
    if (this.dropZone && this.fileInput) {
      this.dropZone.addEventListener('click', () => {
        this.fileInput.click();
      });

      this.fileInput.addEventListener('change', (e) => {
        const file = e.target.files?.[0];
        if (file) this.handleFile(file);
      });

      // Drag & Drop hodisalari
      ['dragenter', 'dragover'].forEach(evtName => {
        this.dropZone.addEventListener(evtName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.dropZone.classList.add('drag-over');
        });
      });

      ['dragleave', 'drop'].forEach(evtName => {
        this.dropZone.addEventListener(evtName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.dropZone.classList.remove('drag-over');
        });
      });

      this.dropZone.addEventListener('drop', (e) => {
        const file = e.dataTransfer?.files?.[0];
        if (file) this.handleFile(file);
      });
    }

    // Canvas ustiga global Drag & Drop (to'g'ridan-to'g'ri doskaga tashlash)
    const canvasViewport = document.getElementById('canvasViewport') || document.body;
    canvasViewport.addEventListener('dragover', (e) => {
      // Faqat fayl sudrab kelinayotganda
      if (e.dataTransfer?.types?.includes('Files')) {
        e.preventDefault();
      }
    });

    canvasViewport.addEventListener('drop', (e) => {
      if (!e.dataTransfer?.files || e.dataTransfer.files.length === 0) return;
      const file = e.dataTransfer.files[0];
      const ext = this.getFileExtension(file.name);

      // Agar hujjat formati bo'lsa (PDF, Word, Excel, PPTX, TXT)
      const docExts = ['pdf', 'docx', 'xlsx', 'xls', 'csv', 'pptx', 'txt', 'md'];
      if (docExts.includes(ext)) {
        e.preventDefault();
        e.stopPropagation();
        this.openModal();
        this.handleFile(file);
      }
    });

    // Boshqa fayl tanlash tugmasi
    const btnChange = document.getElementById('btnDocChangeFile');
    if (btnChange && this.fileInput) {
      btnChange.addEventListener('click', () => this.fileInput.click());
    }

    // Modal ichidagi Tablar (Ko'rinish vs Amallar)
    document.querySelectorAll('.doc-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.doc-tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.doc-tab-content').forEach(c => c.classList.remove('active'));

        btn.classList.add('active');
        const tabKey = btn.getAttribute('data-doctab');
        const target = document.getElementById(`docTab${tabKey.charAt(0).toUpperCase() + tabKey.slice(1)}`);
        if (target) target.classList.add('active');
      });
    });

    // Amallar tugmalari
    this.bindActionButtons();
  }

  bindActionButtons() {
    // 0. To'g'ridan-to'g'ri Namoyish (Slayd-shou / Presenter Mode)
    document.getElementById('btnActionDirectPresent')?.addEventListener('click', () => {
      if (!this.currentDoc) return;
      this.closeModal();
      this.startPresentation(0);
    });

    document.getElementById('btnDocDirectPresentHeader')?.addEventListener('click', () => {
      if (!this.currentDoc) return;
      this.closeModal();
      this.startPresentation(0);
    });

    // 1. Slaydlar sifatida joriy doskaga joylash
    document.getElementById('btnActionInsertCurrentBoard')?.addEventListener('click', () => {
      if (!this.currentDoc) return;
      this.insertSlidesToCurrentBoard(this.currentDoc);
      this.closeModal();
    });

    // 2. Ko'p sahifali doskaga import qilish (Multi-Page)
    document.getElementById('btnActionInsertMultiPage')?.addEventListener('click', () => {
      if (!this.currentDoc) return;
      this.insertSlidesToMultiPage(this.currentDoc);
      this.closeModal();
    });

    // 3. Stikerlar klasteri sifatida joylash
    document.getElementById('btnActionInsertStickyCluster')?.addEventListener('click', () => {
      if (!this.currentDoc) return;
      this.insertSectionsAsStickyCluster(this.currentDoc);
      this.closeModal();
    });

    // 4. Jadval sifatida joylash (Excel / CSV)
    document.getElementById('btnActionInsertTable')?.addEventListener('click', () => {
      if (!this.currentDoc) return;
      this.insertTableToBoard(this.currentDoc);
      this.closeModal();
    });

    // 5. AI Konspekt va Tahlil
    document.getElementById('btnActionAiSummarize')?.addEventListener('click', () => {
      if (!this.currentDoc) return;
      this.sendToAI('summarize', this.currentDoc);
      this.closeModal();
    });

    // 6. AI Mindmap / Sxema
    document.getElementById('btnActionAiMindmap')?.addEventListener('click', () => {
      if (!this.currentDoc) return;
      this.sendToAI('mindmap', this.currentDoc);
      this.closeModal();
    });

    // 7. AI Test Savollari (Quiz)
    document.getElementById('btnActionAiQuiz')?.addEventListener('click', () => {
      if (!this.currentDoc) return;
      this.sendToAI('quiz', this.currentDoc);
      this.closeModal();
    });
  }

  openModal() {
    if (this.modal) {
      this.modal.classList.remove('hidden');
    }
  }

  closeModal() {
    if (this.modal) {
      this.modal.classList.add('hidden');
    }
  }

  getFileExtension(filename) {
    return (filename || '').split('.').pop().toLowerCase();
  }

  /* ==========================================================================
     ASOSIY FAYL PARSER DISPETCHERI
     ========================================================================== */
  async handleFile(file) {
    if (!file) return;

    this.showLoading(true, `"${file.name}" yuklanmoqda va tahlil qilinmoqda...`);
    this.previewSection?.classList.add('hidden');

    try {
      const ext = this.getFileExtension(file.name);
      let parsed = null;

      if (ext === 'pdf') {
        parsed = await this.parsePDF(file);
      } else if (ext === 'docx') {
        parsed = await this.parseDOCX(file);
      } else if (['xlsx', 'xls', 'csv'].includes(ext)) {
        parsed = await this.parseExcel(file);
      } else if (ext === 'pptx') {
        parsed = await this.parsePPTX(file);
      } else if (['txt', 'md'].includes(ext)) {
        parsed = await this.parseText(file);
      } else {
        throw new Error(`Qo'llab-quvvatlanmaydigan fayl formati: .${ext}`);
      }

      this.currentDoc = parsed;
      this.showLoading(false);
      this.renderPreview(parsed);
      if (typeof window.toast === 'function') {
        window.toast(`✅ "${file.name}" muvaffaqiyatli tahlil qilindi!`);
      }
    } catch (err) {
      this.showLoading(false);
      console.error('Hujjatni o\'qishda xatolik:', err);
      if (typeof window.toast === 'function') {
        window.toast(`❌ Hujjatni o'qib bo'lmadi: ${err.message}`);
      }
    }
  }

  showLoading(show, message = 'Hujjat tahlil qilinmoqda...') {
    if (!this.loadingBox) return;
    if (show) {
      this.loadingBox.classList.remove('hidden');
      if (this.loadingText) this.loadingText.textContent = message;
    } else {
      this.loadingBox.classList.add('hidden');
    }
  }

  /* ==========================================================================
     1. PDF PARSER (PDF.js)
     ========================================================================== */
  async parsePDF(file) {
    if (!window.pdfjsLib) {
      throw new Error('PDF.js kutubxonasi yuklanmagan');
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const numPages = pdfDoc.numPages;

    const maxPagesToRender = Math.min(numPages, 24); // Brauzer xotirasi xavfsizligi
    const pages = [];
    let fullText = '';

    for (let i = 1; i <= maxPagesToRender; i++) {
      if (this.loadingText) {
        this.loadingText.textContent = `PDF sahifalari render qilinmoqda: ${i} / ${numPages}...`;
      }

      const page = await pdfDoc.getPage(i);

      // 1. Matnni ajratish
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += `\n--- Sahifa ${i} ---\n` + pageText;

      // 2. Sahifani yuqori sifatli rasmga chizish (Canvas render)
      const viewport = page.getViewport({ scale: 1.4 });
      const offCanvas = document.createElement('canvas');
      offCanvas.width = viewport.width;
      offCanvas.height = viewport.height;
      const offCtx = offCanvas.getContext('2d');

      await page.render({
        canvasContext: offCtx,
        viewport: viewport
      }).promise;

      const dataUrl = offCanvas.toDataURL('image/png');

      pages.push({
        pageNum: i,
        width: Math.round(viewport.width),
        height: Math.round(viewport.height),
        dataUrl: dataUrl,
        text: pageText.trim()
      });
    }

    return {
      type: 'pdf',
      name: file.name,
      size: file.size,
      pageCount: numPages,
      renderedCount: pages.length,
      pages: pages,
      text: fullText.trim(),
      title: file.name.replace(/\.pdf$/i, '')
    };
  }

  /* ==========================================================================
     2. WORD PARSER (DOCX — Mammoth.js)
     ========================================================================== */
  async parseDOCX(file) {
    if (!window.mammoth) {
      throw new Error('Mammoth.js kutubxonasi yuklanmagan');
    }

    const arrayBuffer = await file.arrayBuffer();
    const rawResult = await window.mammoth.extractRawText({ arrayBuffer });
    const fullText = rawResult.value || '';

    // HTML ko'rinishida ham olish (sarlavhalar va jadvallarni ajratish uchun)
    const htmlResult = await window.mammoth.convertToHtml({ arrayBuffer });
    const html = htmlResult.value || '';

    // Matnni sarlavhalar yoki paragraflar bo'yicha bo'limlarga ajratish
    const lines = fullText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const sections = [];
    let curSection = { heading: file.name.replace(/\.docx$/i, ''), content: [] };

    lines.forEach(line => {
      // Qisqa bosh harflar bilan yozilgan qatorlarni sarlavha deb hisoblaymiz
      const isHeading = (line.length < 70 && !line.endsWith('.') && (line === line.toUpperCase() || line.endsWith(':')));
      if (isHeading && curSection.content.length > 0) {
        sections.push({
          heading: curSection.heading,
          text: curSection.content.join('\n')
        });
        curSection = { heading: line, content: [] };
      } else {
        curSection.content.push(line);
      }
    });

    if (curSection.content.length > 0) {
      sections.push({
        heading: curSection.heading,
        text: curSection.content.join('\n')
      });
    }

    return {
      type: 'docx',
      name: file.name,
      size: file.size,
      pageCount: Math.max(1, Math.ceil(lines.length / 28)),
      sections: sections,
      text: fullText,
      html: html,
      title: file.name.replace(/\.docx$/i, '')
    };
  }

  /* ==========================================================================
     3. EXCEL / CSV PARSER (SheetJS — XLSX)
     ========================================================================== */
  async parseExcel(file) {
    if (!window.XLSX) {
      throw new Error('SheetJS (XLSX) kutubxonasi yuklanmagan');
    }

    const arrayBuffer = await file.arrayBuffer();
    const workbook = window.XLSX.read(arrayBuffer, { type: 'array' });
    const sheetNames = workbook.SheetNames || [];

    if (sheetNames.length === 0) {
      throw new Error('Excel faylida varaqlar topilmadi');
    }

    const tables = [];
    let fullText = '';

    sheetNames.forEach(sheetName => {
      const sheet = workbook.Sheets[sheetName];
      const rows = window.XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

      if (rows && rows.length > 0) {
        const headers = (rows[0] || []).map(h => String(h || '').trim());
        const dataRows = rows.slice(1).filter(r => r.some(cell => String(cell).trim() !== ''));

        tables.push({
          name: sheetName,
          headers: headers,
          rows: dataRows
        });

        fullText += `\n[Varaq: ${sheetName}]\n`;
        fullText += headers.join(' | ') + '\n';
        dataRows.slice(0, 30).forEach(r => {
          fullText += r.join(' | ') + '\n';
        });
      }
    });

    return {
      type: 'xlsx',
      name: file.name,
      size: file.size,
      pageCount: sheetNames.length,
      sheetNames: sheetNames,
      tables: tables,
      text: fullText.trim(),
      title: file.name.replace(/\.(xlsx|xls|csv)$/i, '')
    };
  }

  /* ==========================================================================
     4. POWERPOINT PARSER (PPTX — JSZip)
     ========================================================================== */
  async parsePPTX(file) {
    if (!window.JSZip) {
      throw new Error('JSZip kutubxonasi yuklanmagan');
    }

    const zip = await window.JSZip.loadAsync(file);
    const slideFiles = [];

    // ppt/slides/slide1.xml, slide2.xml larni qidirish
    zip.forEach((relPath, zipEntry) => {
      if (/^ppt\/slides\/slide\d+\.xml$/i.test(relPath)) {
        slideFiles.push({ path: relPath, entry: zipEntry });
      }
    });

    // Slaydlarni raqami bo'yicha to'g'ri saralash
    slideFiles.sort((a, b) => {
      const numA = parseInt(a.path.match(/\d+/)[0], 10);
      const numB = parseInt(b.path.match(/\d+/)[0], 10);
      return numA - numB;
    });

    if (slideFiles.length === 0) {
      throw new Error('PPTX faylida slaydlar topilmadi');
    }

    const slides = [];
    let fullText = '';
    const domParser = new DOMParser();

    for (let i = 0; i < slideFiles.length; i++) {
      const xmlStr = await slideFiles[i].entry.async('string');
      const xmlDoc = domParser.parseFromString(xmlStr, 'application/xml');

      // Matnlarni olish (<a:t> teglari)
      const textNodes = xmlDoc.getElementsByTagName('a:t');
      const textLines = [];
      for (let j = 0; j < textNodes.length; j++) {
        const val = textNodes[j].textContent?.trim();
        if (val) textLines.push(val);
      }

      // Slayd sarlavhasi odatda birinchi matn qatori bo'ladi
      const slideTitle = textLines.length > 0 ? textLines[0] : `Slayd ${i + 1}`;
      const slideBody = textLines.slice(1).join('\n');

      slides.push({
        slideNum: i + 1,
        title: slideTitle,
        bullets: textLines.slice(1),
        text: textLines.join('\n')
      });

      fullText += `\n--- Slayd ${i + 1}: ${slideTitle} ---\n` + slideBody;
    }

    return {
      type: 'pptx',
      name: file.name,
      size: file.size,
      pageCount: slides.length,
      slides: slides,
      text: fullText.trim(),
      title: file.name.replace(/\.pptx$/i, '')
    };
  }

  /* ==========================================================================
     5. ODDIY MATN VA MARKDOWN PARSER (TXT, MD)
     ========================================================================== */
  async parseText(file) {
    const text = await file.text();
    const lines = text.split(/\r?\n/).filter(Boolean);

    return {
      type: 'text',
      name: file.name,
      size: file.size,
      pageCount: Math.max(1, Math.ceil(lines.length / 35)),
      text: text,
      title: file.name.replace(/\.(txt|md)$/i, '')
    };
  }

  /* ==========================================================================
     PREVIEW VA METADATA CHIZISH
     ========================================================================== */
  renderPreview(doc) {
    if (!this.previewSection) return;
    this.previewSection.classList.remove('hidden');

    // Metama'lumotlarni to'ldirish
    const iconMap = {
      pdf: '📕',
      docx: '📘',
      xlsx: '📊',
      pptx: '📙',
      text: '📄'
    };

    const typeIconEl = document.getElementById('docPreviewTypeIcon');
    const fileNameEl = document.getElementById('docPreviewFileName');
    const metaPagesEl = document.getElementById('docPreviewMetaPages');
    const metaSizeEl = document.getElementById('docPreviewMetaSize');
    const metaCharsEl = document.getElementById('docPreviewMetaChars');

    if (typeIconEl) typeIconEl.textContent = iconMap[doc.type] || '📄';
    if (fileNameEl) fileNameEl.textContent = doc.name;
    if (metaPagesEl) {
      const label = doc.type === 'xlsx' ? 'varaq' : (doc.type === 'pptx' ? 'slayd' : 'sahifa');
      metaPagesEl.textContent = `${doc.pageCount} ${label}`;
    }
    if (metaSizeEl) metaSizeEl.textContent = `${(doc.size / 1024).toFixed(1)} KB`;
    if (metaCharsEl) metaCharsEl.textContent = `${doc.text.length.toLocaleString()} belgi`;

    // Amallar mosligini yoqish/o'chirish
    const btnMultiPage = document.getElementById('btnActionInsertMultiPage');
    const btnSticky = document.getElementById('btnActionInsertStickyCluster');
    const btnTable = document.getElementById('btnActionInsertTable');
    const btnCurrentBoard = document.getElementById('btnActionInsertCurrentBoard');

    if (btnTable) {
      btnTable.style.display = doc.type === 'xlsx' ? 'flex' : 'none';
    }
    if (btnMultiPage) {
      btnMultiPage.style.display = (doc.type === 'pdf' || doc.type === 'pptx') ? 'flex' : 'none';
    }
    if (btnSticky) {
      btnSticky.style.display = (doc.type === 'docx' || doc.type === 'text') ? 'flex' : 'none';
    }
    if (btnCurrentBoard) {
      btnCurrentBoard.style.display = 'flex';
    }

    // Miniatura / Thumbnail panjara
    const thumbGrid = document.getElementById('docThumbnailGrid');
    const textPreviewBox = document.getElementById('docTextPreviewBox');

    if (thumbGrid) {
      thumbGrid.innerHTML = '';
      if (doc.type === 'pdf' && doc.pages && doc.pages.length > 0) {
        thumbGrid.style.display = 'grid';
        doc.pages.slice(0, 12).forEach(p => {
          const card = document.createElement('div');
          card.className = 'doc-thumb-card';
          card.innerHTML = `
            <img src="${p.dataUrl}" alt="Sahifa ${p.pageNum}">
            <span>Sahifa ${p.pageNum}</span>
          `;
          thumbGrid.appendChild(card);
        });
      } else {
        thumbGrid.style.display = 'none';
      }
    }

    if (textPreviewBox) {
      const snippet = doc.text.substring(0, 1200);
      textPreviewBox.innerHTML = `
        <pre style="white-space: pre-wrap; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #CBD5E1; line-height: 1.6;">${snippet}${doc.text.length > 1200 ? '\n\n... (qolgan matn qisqartirildi) ...' : ''}</pre>
      `;
    }
  }

  /* ==========================================================================
     DOSKAGA JOYLASHTIRISH METODLARI
     ========================================================================== */

  // 1. Slaydlar / Kartalarni joriy doskaga panjara tartibida joylash
  insertSlidesToCurrentBoard(doc) {
    this.board.saveState();
    const center = this.board.screenToWorld(this.board.width / 2, this.board.height / 2);
    let startX = Math.round(center.x - 400);
    let startY = Math.round(center.y - 250);

    if (doc.type === 'pdf' && doc.pages && doc.pages.length > 0) {
      const cols = Math.min(3, doc.pages.length);
      const cardW = 380;
      const spacingX = 420;
      const spacingY = 320;

      doc.pages.forEach((p, idx) => {
        const col = idx % cols;
        const row = Math.floor(idx / cols);
        const curX = startX + col * spacingX;
        const curY = startY + row * spacingY;
        const cardH = Math.round(cardW * (p.height / p.width));

        // Sahifa foni va rasmi
        this.board.addObject({
          type: 'image',
          x: curX,
          y: curY,
          width: cardW,
          height: cardH,
          src: p.dataUrl
        }, false);

        // Sahifa raqami nishoni (badge)
        this.board.addObject({
          type: 'text',
          x: curX + 12,
          y: curY + cardH + 20,
          text: `📄 ${doc.name} — ${p.pageNum}-sahifa`,
          color: '#94A3B8',
          fontSize: 12,
          fontWeight: 600
        }, false);
      });

      this.board.markDirty();
      this.board.autoSaveToStorage();
      if (typeof window.toast === 'function') {
        window.toast(`🖼️ ${doc.pages.length} ta PDF sahifasi doskaga joylashtirildi!`);
      }
    } else if (doc.type === 'pptx' && doc.slides) {
      const cols = 2;
      const cardW = 380;
      const cardH = 220;
      const spacingX = 420;
      const spacingY = 260;

      doc.slides.forEach((sl, idx) => {
        const col = idx % cols;
        const row = Math.floor(idx / cols);
        const curX = startX + col * spacingX;
        const curY = startY + row * spacingY;

        // Slayd ramkasi
        this.board.addObject({
          type: 'rect',
          x: curX,
          y: curY,
          width: cardW,
          height: cardH,
          color: '#38BDF8',
          strokeWidth: 2,
          filled: true,
          fillColor: '#0F172A'
        }, false);

        // Slayd sarlavhasi
        this.board.addObject({
          type: 'text',
          x: curX + 16,
          y: curY + 28,
          text: `Slayd ${sl.slideNum}: ${sl.title.substring(0, 36)}`,
          color: '#F8FAFC',
          fontSize: 14,
          fontWeight: 700
        }, false);

        // Slayd matni
        const bodySnippet = sl.bullets.slice(0, 4).map(b => `• ${b}`).join('\n') || sl.text.substring(0, 140);
        this.board.addObject({
          type: 'text',
          x: curX + 16,
          y: curY + 60,
          text: bodySnippet,
          color: '#94A3B8',
          fontSize: 12,
          fontWeight: 500
        }, false);
      });

      this.board.markDirty();
      this.board.autoSaveToStorage();
      if (typeof window.toast === 'function') {
        window.toast(`📙 ${doc.slides.length} ta taqdimot slaydi doskaga joylashtirildi!`);
      }
    } else {
      // DOCX, XLSX yoki TXT uchun
      this.insertSectionsAsStickyCluster(doc);
    }
  }

  // 2. Ko'p sahifali doskaga import (Multi-Page: Har bir sahifa alohida doska sahifasiga)
  insertSlidesToMultiPage(doc) {
    if (!this.board.pages || !this.board.addPage) {
      if (typeof window.toast === 'function') {
        window.toast("Ko'p sahifali doska rejimi topilmadi");
      }
      return;
    }

    this.board.saveState();
    const firstPageId = this.board.currentPageId;

    if (doc.type === 'pdf' && doc.pages && doc.pages.length > 0) {
      doc.pages.forEach((p, idx) => {
        let pageId;
        if (idx === 0) {
          pageId = firstPageId;
          this.board.renamePage(pageId, `${doc.name} - 1`);
        } else {
          const newP = this.board.addPage(`${doc.name} - ${p.pageNum}`);
          pageId = newP.id;
        }

        this.board.switchPage(pageId);
        const center = this.board.screenToWorld(this.board.width / 2, this.board.height / 2);
        const cardW = 600;
        const cardH = Math.round(cardW * (p.height / p.width));

        this.board.addObject({
          type: 'image',
          x: Math.round(center.x - cardW / 2),
          y: Math.round(center.y - cardH / 2),
          width: cardW,
          height: cardH,
          src: p.dataUrl
        }, false);
      });

      this.board.switchPage(firstPageId);
      if (typeof window.toast === 'function') {
        window.toast(`📑 ${doc.pages.length} ta sahifali doska yaratildi!`);
      }
    } else if (doc.type === 'pptx' && doc.slides) {
      doc.slides.forEach((sl, idx) => {
        let pageId;
        if (idx === 0) {
          pageId = firstPageId;
          this.board.renamePage(pageId, `Slayd 1`);
        } else {
          const newP = this.board.addPage(`Slayd ${sl.slideNum}`);
          pageId = newP.id;
        }

        this.board.switchPage(pageId);
        const center = this.board.screenToWorld(this.board.width / 2, this.board.height / 2);
        const cardW = 640;
        const cardH = 380;
        const x = Math.round(center.x - cardW / 2);
        const y = Math.round(center.y - cardH / 2);

        this.board.addObject({
          type: 'rect',
          x: x,
          y: y,
          width: cardW,
          height: cardH,
          color: '#38BDF8',
          strokeWidth: 2,
          filled: true,
          fillColor: '#0F172A'
        }, false);

        this.board.addObject({
          type: 'text',
          x: x + 24,
          y: y + 42,
          text: sl.title,
          color: '#F8FAFC',
          fontSize: 18,
          fontWeight: 700
        }, false);

        this.board.addObject({
          type: 'text',
          x: x + 24,
          y: y + 84,
          text: sl.bullets.map(b => `• ${b}`).join('\n\n') || sl.text,
          color: '#94A3B8',
          fontSize: 14,
          fontWeight: 500
        }, false);
      });

      this.board.switchPage(firstPageId);
      if (typeof window.toast === 'function') {
        window.toast(`📑 ${doc.slides.length} ta slayd doska sahifalariga o'tkazildi!`);
      }
    }
  }

  // 3. Bo'limlar va stikerlar klasteri (Word DOCX & Matn uchun)
  insertSectionsAsStickyCluster(doc) {
    this.board.saveState();
    const center = this.board.screenToWorld(this.board.width / 2, this.board.height / 2);
    const colors = ['#FEF08A', '#BAE6FD', '#BBF7D0', '#DDD6FE', '#FED7AA'];

    const items = doc.sections && doc.sections.length > 0
      ? doc.sections
      : [{ heading: doc.title, text: doc.text.substring(0, 1500) }];

    const cols = Math.min(3, items.length);
    const cardW = 280;
    const cardH = 200;
    const spacingX = 310;
    const spacingY = 230;

    items.slice(0, 9).forEach((sec, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const curX = Math.round(center.x - 300) + col * spacingX;
      const curY = Math.round(center.y - 180) + row * spacingY;
      const bg = colors[idx % colors.length];

      const headerText = sec.heading ? `📌 ${sec.heading}\n\n` : '';
      const bodySnippet = (sec.text || '').substring(0, 220);

      this.board.addObject({
        type: 'sticky',
        x: curX,
        y: curY,
        width: cardW,
        height: cardH,
        bgColor: bg,
        textColor: '#1E293B',
        text: `${headerText}${bodySnippet}...`
      }, false);
    });

    this.board.markDirty();
    this.board.autoSaveToStorage();
    if (typeof window.toast === 'function') {
      window.toast(`📌 ${Math.min(items.length, 9)} ta stiker klasteri yaratildi!`);
    }
  }

  // 4. Excel / CSV ma'lumotlarini doskaga jadval sifatida chizish
  insertTableToBoard(doc) {
    if (!doc.tables || doc.tables.length === 0) return;
    const table = doc.tables[0];
    const headers = table.headers.slice(0, 6); // Ko'pi bilan 6 ustun
    const rows = table.rows.slice(0, 12).map(r => r.slice(0, 6)); // Ko'pi bilan 12 qator

    if (headers.length === 0) return;

    this.board.saveState();
    const center = this.board.screenToWorld(this.board.width / 2, this.board.height / 2);

    const colW = Math.max(120, Math.min(220, Math.floor(700 / headers.length)));
    const rowH = 34;
    const totalW = colW * headers.length;
    const totalH = rowH * (rows.length + 1) + 40;
    const startX = Math.round(center.x - totalW / 2);
    const startY = Math.round(center.y - totalH / 2);

    // Tashqi konteyner ramka
    this.board.addObject({
      type: 'rect',
      x: startX,
      y: startY,
      width: totalW,
      height: totalH,
      color: '#10B981',
      strokeWidth: 2,
      filled: true,
      fillColor: '#070C14'
    }, false);

    // Sarlavha
    this.board.addObject({
      type: 'text',
      x: startX + 16,
      y: startY + 24,
      text: `📊 ${doc.name} — ${table.name}`,
      color: '#10B981',
      fontSize: 14,
      fontWeight: 700
    }, false);

    // Ustun sarlavhalari foni
    const headerY = startY + 36;
    this.board.addObject({
      type: 'rect',
      x: startX + 2,
      y: headerY,
      width: totalW - 4,
      height: rowH,
      color: 'rgba(16, 185, 129, 0.3)',
      strokeWidth: 1,
      filled: true,
      fillColor: 'rgba(16, 185, 129, 0.15)'
    }, false);

    // Sarlavha matnlari
    headers.forEach((h, cIdx) => {
      this.board.addObject({
        type: 'text',
        x: startX + cIdx * colW + 10,
        y: headerY + 22,
        text: String(h).substring(0, 20),
        color: '#F8FAFC',
        fontSize: 11,
        fontWeight: 700
      }, false);
    });

    // Qatorlar
    rows.forEach((row, rIdx) => {
      const curRowY = headerY + (rIdx + 1) * rowH;

      // Qator ajratgich chiziq
      this.board.addObject({
        type: 'line',
        x1: startX + 2,
        y1: curRowY,
        x2: startX + totalW - 2,
        y2: curRowY,
        color: 'rgba(255, 255, 255, 0.08)',
        strokeWidth: 1
      }, false);

      row.forEach((cellVal, cIdx) => {
        const textStr = String(cellVal || '').trim();
        this.board.addObject({
          type: 'text',
          x: startX + cIdx * colW + 10,
          y: curRowY + 22,
          text: textStr.length > 24 ? textStr.substring(0, 22) + '...' : textStr,
          color: cIdx === 0 ? '#38BDF8' : '#CBD5E1',
          fontSize: 11,
          fontWeight: cIdx === 0 ? 600 : 400
        }, false);
      });
    });

    this.board.markDirty();
    this.board.autoSaveToStorage();
    if (typeof window.toast === 'function') {
      window.toast(`📊 "${table.name}" jadvali doskaga chizildi!`);
    }
  }

  /* ==========================================================================
     AI INTEGRATSIYASI (KONSPEKT, MINDMAP, QUIZ)
     ========================================================================== */
  async sendToAI(action, doc) {
    if (!this.ai) return;

    const aiDrawer = document.getElementById('aiDrawer');
    const aiPromptInput = document.getElementById('aiPromptInput');
    const aiGenType = document.getElementById('aiGenType');
    const btnAiRun = document.getElementById('btnAiRunGenerate');

    if (action === 'summarize') {
      if (typeof window.toast === 'function') {
        window.toast(`🪄 AI "${doc.name}" bo'yicha konspekt tayyorlamoqda...`);
      }

      const prompt = `Quyidagi hujjat matnini diqqat bilan o'rganib chiq:
Nomi: ${doc.name}
Matn mazmuni:
${doc.text.substring(0, 2500)}

Vazifa: Ushbu hujjatning eng muhim qoidalarini, xulosalarini va asosiy g'oyasini o'quvchiga tushunarli qilib 5-6 banddan iborat qisqa, aniq konspekt (xulosa) shaklida tuzib ber.`;

      try {
        const res = await this.ai.chatWithAssistant(prompt);
        const center = this.board.screenToWorld(this.board.width / 2, this.board.height / 2);

        this.board.saveState();
        this.board.addObject({
          type: 'sticky',
          x: Math.round(center.x - 160),
          y: Math.round(center.y - 120),
          width: 320,
          height: 240,
          bgColor: '#FEF08A',
          textColor: '#1E293B',
          text: `📑 "${doc.name}" KONSPEKTI:\n\n${res.reply.substring(0, 480)}...`
        });

        if (typeof window.toast === 'function') {
          window.toast("✅ AI konspekt stikeri doskaga joylashtirildi!");
        }
      } catch (err) {
        if (typeof window.toast === 'function') {
          window.toast(`❌ AI xatosi: ${err.message}`);
        }
      }
    } else if (action === 'mindmap') {
      // AI Drawer-ni ochish va promptni yuborish
      if (aiDrawer) aiDrawer.classList.add('open');
      if (aiGenType) aiGenType.value = 'mindmap';
      if (aiPromptInput) {
        aiPromptInput.value = `${doc.title} aqliy xaritasi (mindmap)`;
      }
      setTimeout(() => {
        btnAiRun?.click();
      }, 300);
      if (typeof window.toast === 'function') {
        window.toast("🧠 Mindmap generatsiya qilinmoqda...");
      }
    } else if (action === 'quiz') {
      if (typeof window.toast === 'function') {
        window.toast(`❓ AI "${doc.name}" bo'yicha test savolini yaratmoqda...`);
      }

      const prompt = `Quyidagi matn bo'yicha talabalar bilimini sinash uchun bitta qiziqarli test savoli tuz:
${doc.text.substring(0, 1800)}

Quyidagi JSON formatda qaytar:
{
  "topic": "${doc.title}",
  "question": "Savol matni?",
  "options": ["A variant", "B variant", "C variant", "D variant"],
  "correct": 0,
  "explanation": "Nima uchun bu to'g'ri ekanligi tushuntirish"
}`;

      try {
        const res = await this.ai.chatWithAssistant(prompt);
        // JSON ni ajratib olish
        const jsonMatch = res.reply.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const qData = JSON.parse(jsonMatch[0]);
          const center = this.board.screenToWorld(this.board.width / 2, this.board.height / 2);

          this.board.saveState();
          this.board.addObject({
            type: 'quiz_card',
            x: Math.round(center.x - 170),
            y: Math.round(center.y - 120),
            width: 340,
            height: 240,
            topic: qData.topic || doc.title,
            question: qData.question,
            options: qData.options,
            correctIndex: qData.correct !== undefined ? qData.correct : 0,
            explanation: qData.explanation || ''
          });

          if (typeof window.toast === 'function') {
            window.toast("🧠 Interaktiv test kartochkasi yaratildi!");
          }
        } else {
          throw new Error("JSON formatda javob olinmadi");
        }
      } catch (err) {
        // Fallback: Oddiy test kartasi yaratish
        const center = this.board.screenToWorld(this.board.width / 2, this.board.height / 2);
        this.board.saveState();
        this.board.addObject({
          type: 'quiz_card',
          x: Math.round(center.x - 170),
          y: Math.round(center.y - 120),
          width: 340,
          height: 240,
          topic: doc.title,
          question: `"${doc.title}" hujjatining asosiy mavzusi nima?`,
          options: ["Nazariy asoslar", "Amaliy tadqiqot", "Tarmoq arxitekturasi", "Hisobot tahlili"],
          correctIndex: 0,
          explanation: "Hujjat matni asosida umumlashtirilgan savol."
        });
        if (typeof window.toast === 'function') {
          window.toast("🧠 Hujjat testi doskaga joylashtirildi!");
        }
      }
    }
  }

  /* ==========================================================================
     TO'G'RIDAN-TO'G'RI NAMOYISH REJIMI (INTERACTIVE PRESENTATION MODE)
     ========================================================================== */
  initPresenter() {
    this.presenterOverlay = document.getElementById('presentationOverlay');
    this.presenterSlideImg = document.getElementById('presenterSlideImg');
    this.presenterSlideCard = document.getElementById('presenterSlideCard');
    this.presenterDrawCanvas = document.getElementById('presenterDrawCanvas');
    this.presenterDrawCtx = this.presenterDrawCanvas ? this.presenterDrawCanvas.getContext('2d') : null;
    this.presenterLaserDot = document.getElementById('presenterLaserDot');
    this.presenterPageNum = document.getElementById('presenterPageNum');
    this.presenterTotalPages = document.getElementById('presenterTotalPages');
    this.presenterDocBadge = document.getElementById('presenterDocBadge');
    this.presenterDocTitle = document.getElementById('presenterDocTitle');
    this.presenterThumbDrawer = document.getElementById('presenterThumbnailDrawer');
    this.presenterThumbGrid = document.getElementById('presenterThumbGrid');
    this.presenterAiPanel = document.getElementById('presenterAiPanel');
    this.presenterAiContent = document.getElementById('presenterAiContent');
    this.presenterAiLoading = document.getElementById('presenterAiLoading');

    this.currentSlideIndex = 0;
    this.isPresentationActive = false;
    this.slideDrawings = new Map(); // slideIndex -> array of strokes
    this.currentDrawTool = 'cursor'; // cursor, laser, pen, highlighter
    this.currentDrawColor = '#F43F5E';
    this.isDrawing = false;
    this.currentStroke = null;

    // Tugmalarni bog'lash
    document.getElementById('btnClosePresenter')?.addEventListener('click', () => this.closePresentation());
    document.getElementById('btnPresenterPrev')?.addEventListener('click', () => this.prevSlide());
    document.getElementById('btnPresenterNext')?.addEventListener('click', () => this.nextSlide());
    document.getElementById('btnPresenterCounter')?.addEventListener('click', () => this.toggleThumbnailDrawer());
    document.getElementById('btnPresenterToggleThumbnails')?.addEventListener('click', () => this.toggleThumbnailDrawer());
    document.getElementById('btnClosePresenterThumbDrawer')?.addEventListener('click', () => this.toggleThumbnailDrawer(false));

    // Fullscreen
    document.getElementById('btnPresenterFullscreen')?.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        this.presenterOverlay?.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    });

    // Send to Board
    document.getElementById('btnPresenterSendToBoard')?.addEventListener('click', () => this.sendCurrentSlideToBoard());

    // AI Izoh & Quiz
    document.getElementById('btnPresenterAiExplain')?.addEventListener('click', () => this.toggleAiPanel());
    document.getElementById('btnClosePresenterAi')?.addEventListener('click', () => this.toggleAiPanel(false));
    document.getElementById('btnPresenterAiQuiz')?.addEventListener('click', () => this.generateAiSlideQuiz());
    document.getElementById('btnPresenterAiKeyPoints')?.addEventListener('click', () => this.explainCurrentSlideWithAI());

    // Chizish asboblari
    document.querySelectorAll('.presenter-tool-btn[data-ptool]').forEach(btn => {
      btn.addEventListener('click', () => {
        const tool = btn.getAttribute('data-ptool');
        this.setDrawTool(tool);
      });
    });

    // Rang tanlagich
    document.querySelectorAll('.presenter-color-picker .pcolor-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        document.querySelectorAll('.presenter-color-picker .pcolor-dot').forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
        this.currentDrawColor = dot.getAttribute('data-color') || '#F43F5E';
        if (this.currentDrawTool === 'cursor' || this.currentDrawTool === 'laser') {
          this.setDrawTool('pen');
        }
      });
    });

    // Chizmalarni tozalash
    document.getElementById('btnPresenterClearDraw')?.addEventListener('click', () => this.clearCurrentSlideDrawings());

    // Chizish hodisalari (Canvas mouse / touch)
    if (this.presenterDrawCanvas) {
      this.bindPresenterCanvasEvents();
    }

    // Klaviatura boshqaruvi
    window.addEventListener('keydown', (e) => {
      if (!this.isPresentationActive) return;

      // Agar biror inputda yozilayotgan bo'lsa
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        this.closePresentation();
      } else if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter' || e.key === 'PageDown') {
        e.preventDefault();
        this.nextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'Backspace' || e.key === 'PageUp') {
        e.preventDefault();
        this.prevSlide();
      } else if (e.key === 'Home') {
        e.preventDefault();
        this.showSlide(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        const total = this.getTotalSlides();
        if (total > 0) this.showSlide(total - 1);
      } else if (e.key.toLowerCase() === 'l') {
        this.setDrawTool(this.currentDrawTool === 'laser' ? 'cursor' : 'laser');
      } else if (e.key.toLowerCase() === 'p') {
        this.setDrawTool('pen');
      } else if (e.key.toLowerCase() === 'h') {
        this.setDrawTool('highlighter');
      } else if (e.key.toLowerCase() === 'v') {
        this.setDrawTool('cursor');
      } else if (e.key.toLowerCase() === 'c') {
        this.clearCurrentSlideDrawings();
      } else if (e.key.toLowerCase() === 'f') {
        document.getElementById('btnPresenterFullscreen')?.click();
      }
    });
  }

  startPresentation(startPage = 0) {
    if (!this.currentDoc) {
      if (typeof window.toast === 'function') {
        window.toast("Iltimos, avval namoyish qilish uchun hujjat yuklang!");
      }
      this.openModal();
      return;
    }

    this.closeModal();
    this.isPresentationActive = true;
    if (this.presenterOverlay) {
      this.presenterOverlay.classList.remove('hidden');
      this.presenterOverlay.focus();
    }

    this.renderThumbnailsDrawer();
    this.setDrawTool('cursor');
    this.showSlide(startPage);

    if (typeof window.toast === 'function') {
      window.toast("▶️ To'g'ridan-to'g'ri Namoyish (Slayd: →, Lazer: L, Qalam: P, Chiqish: Esc)");
    }
  }

  closePresentation() {
    this.isPresentationActive = false;
    if (this.presenterOverlay) {
      this.presenterOverlay.classList.add('hidden');
    }
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  }

  getTotalSlides() {
    if (!this.currentDoc) return 0;
    const doc = this.currentDoc;
    if (doc.type === 'pdf') return (doc.pages && doc.pages.length) || 1;
    if (doc.type === 'pptx') return (doc.slides && doc.slides.length) || 1;
    if (doc.type === 'docx' || doc.type === 'text') return (doc.sections && doc.sections.length) || 1;
    if (doc.type === 'xlsx') return (doc.sheets && doc.sheets.length) || 1;
    return 1;
  }

  showSlide(index) {
    const total = this.getTotalSlides();
    if (total === 0) return;
    if (index < 0) index = 0;
    if (index >= total) index = total - 1;

    this.currentSlideIndex = index;

    if (this.presenterPageNum) this.presenterPageNum.textContent = String(index + 1);
    if (this.presenterTotalPages) this.presenterTotalPages.textContent = String(total);
    if (this.presenterDocBadge) this.presenterDocBadge.textContent = `${this.currentDoc.type.toUpperCase()} NAMOYISH`;
    if (this.presenterDocTitle) this.presenterDocTitle.textContent = this.currentDoc.name;

    const doc = this.currentDoc;

    if (doc.type === 'pdf' && doc.pages && doc.pages[index]) {
      const page = doc.pages[index];
      this.presenterSlideCard?.classList.add('hidden');
      if (this.presenterSlideImg) {
        this.presenterSlideImg.classList.remove('hidden');
        this.presenterSlideImg.src = page.dataUrl;
        this.presenterSlideImg.onload = () => {
          this.syncCanvasSize();
          this.redrawSlideDrawings(index);
        };
      }
    } else if (doc.type === 'pptx' && doc.slides && doc.slides[index]) {
      const slide = doc.slides[index];
      this.presenterSlideImg?.classList.add('hidden');
      if (this.presenterSlideCard) {
        this.presenterSlideCard.classList.remove('hidden');
        const bulletsHtml = (slide.bullets && slide.bullets.length > 0)
          ? slide.bullets.map(b => `
              <div class="presenter-slide-bullet">
                <span class="presenter-slide-bullet-icon">▸</span>
                <span>${b}</span>
              </div>
            `).join('')
          : (slide.text ? `<p style="font-size: 20px; line-height: 1.6; color: #CBD5E1;">${slide.text}</p>` : '');

        this.presenterSlideCard.innerHTML = `
          <div class="presenter-slide-badge">SLAYD ${slide.slideNum} / ${total}</div>
          <h2 class="presenter-slide-title">${slide.title || 'Mavzu'}</h2>
          <div class="presenter-slide-bullets">
            ${bulletsHtml}
          </div>
        `;
        setTimeout(() => {
          this.syncCanvasSize();
          this.redrawSlideDrawings(index);
        }, 50);
      }
    } else if ((doc.type === 'docx' || doc.type === 'text') && doc.sections && doc.sections[index]) {
      const sec = doc.sections[index];
      this.presenterSlideImg?.classList.add('hidden');
      if (this.presenterSlideCard) {
        this.presenterSlideCard.classList.remove('hidden');
        this.presenterSlideCard.innerHTML = `
          <div class="presenter-slide-badge">BO'LIM ${index + 1} / ${total}</div>
          <h2 class="presenter-slide-title">${sec.title || 'Bo\'lim sarlavhasi'}</h2>
          <div style="font-size: 19px; line-height: 1.7; color: #E2E8F0; white-space: pre-wrap; margin-top: 10px;">${sec.content || ''}</div>
        `;
        setTimeout(() => {
          this.syncCanvasSize();
          this.redrawSlideDrawings(index);
        }, 50);
      }
    } else if (doc.type === 'xlsx' && doc.sheets && doc.sheets[index]) {
      const sheet = doc.sheets[index];
      this.presenterSlideImg?.classList.add('hidden');
      if (this.presenterSlideCard) {
        this.presenterSlideCard.classList.remove('hidden');
        const rowsHtml = sheet.rows.slice(0, 15).map(r => `
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.06);">
            ${sheet.headers.map(h => `<td style="padding: 10px 14px; font-size: 13px; color: #E2E8F0;">${r[h] ?? ''}</td>`).join('')}
          </tr>
        `).join('');

        this.presenterSlideCard.innerHTML = `
          <div class="presenter-slide-badge">VARAQ: ${sheet.name} (${index + 1} / ${total})</div>
          <h3 style="font-size: 22px; font-weight: 700; color: #10B981; margin: 0 0 16px 0;">Jadval Ko'rinishi</h3>
          <div style="overflow-x: auto; max-height: 55vh; border: 1px solid rgba(255,255,255,0.1); border-radius: 10px;">
            <table style="width: 100%; border-collapse: collapse; text-align: left;">
              <thead>
                <tr style="background: rgba(16, 185, 129, 0.15); border-bottom: 2px solid rgba(16, 185, 129, 0.3);">
                  ${sheet.headers.map(h => `<th style="padding: 12px 14px; font-size: 13px; font-weight: 700; color: #34D399;">${h}</th>`).join('')}
                </tr>
              </thead>
              <tbody>${rowsHtml}</tbody>
            </table>
          </div>
        `;
        setTimeout(() => {
          this.syncCanvasSize();
          this.redrawSlideDrawings(index);
        }, 50);
      }
    }

    // Miniaturalar draweridagi faol slaydni yangilash
    document.querySelectorAll('.presenter-thumb-item').forEach((item, idx) => {
      item.classList.toggle('active', idx === index);
    });
  }

  nextSlide() {
    this.showSlide(this.currentSlideIndex + 1);
  }

  prevSlide() {
    this.showSlide(this.currentSlideIndex - 1);
  }

  syncCanvasSize() {
    const canvas = this.presenterDrawCanvas;
    if (!canvas) return;

    let targetEl = this.presenterSlideImg;
    if (this.presenterSlideImg && !this.presenterSlideImg.classList.contains('hidden')) {
      targetEl = this.presenterSlideImg;
    } else if (this.presenterSlideCard && !this.presenterSlideCard.classList.contains('hidden')) {
      targetEl = this.presenterSlideCard;
    }

    if (!targetEl) return;
    const w = targetEl.clientWidth || targetEl.offsetWidth;
    const h = targetEl.clientHeight || targetEl.offsetHeight;

    if (w > 0 && h > 0) {
      canvas.width = w;
      canvas.height = h;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    }
  }

  setDrawTool(tool) {
    this.currentDrawTool = tool;
    document.querySelectorAll('.presenter-tool-btn[data-ptool]').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-ptool') === tool);
    });

    if (this.presenterDrawCanvas) {
      this.presenterDrawCanvas.classList.toggle('cursor-mode', tool === 'cursor');
      this.presenterDrawCanvas.classList.toggle('laser-mode', tool === 'laser');
    }

    if (tool !== 'laser' && this.presenterLaserDot) {
      this.presenterLaserDot.classList.add('hidden');
    }
  }

  bindPresenterCanvasEvents() {
    const canvas = this.presenterDrawCanvas;
    if (!canvas) return;

    const getPos = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX);
      const clientY = e.clientY ?? (e.touches && e.touches[0]?.clientY);
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    };

    canvas.addEventListener('pointerdown', (e) => {
      if (this.currentDrawTool === 'cursor' || this.currentDrawTool === 'laser') return;

      this.isDrawing = true;
      canvas.setPointerCapture?.(e.pointerId);
      const pos = getPos(e);
      this.currentStroke = {
        tool: this.currentDrawTool,
        color: this.currentDrawColor,
        points: [pos]
      };
    });

    canvas.addEventListener('pointermove', (e) => {
      const pos = getPos(e);

      // Lazer ko'rsatkich harakati
      if (this.currentDrawTool === 'laser' && this.presenterLaserDot) {
        this.presenterLaserDot.style.left = `${pos.x}px`;
        this.presenterLaserDot.style.top = `${pos.y}px`;
        this.presenterLaserDot.classList.remove('hidden');
      }

      if (!this.isDrawing || !this.currentStroke) return;
      this.currentStroke.points.push(pos);
      this.drawLiveStrokeSegment(this.currentStroke);
    });

    const endDraw = () => {
      if (this.isDrawing && this.currentStroke && this.currentStroke.points.length > 0) {
        const strokes = this.slideDrawings.get(this.currentSlideIndex) || [];
        strokes.push(this.currentStroke);
        this.slideDrawings.set(this.currentSlideIndex, strokes);
      }
      this.isDrawing = false;
      this.currentStroke = null;
    };

    canvas.addEventListener('pointerup', endDraw);
    canvas.addEventListener('pointercancel', endDraw);
    canvas.addEventListener('pointerleave', () => {
      if (this.presenterLaserDot) this.presenterLaserDot.classList.add('hidden');
      if (this.isDrawing) endDraw();
    });
  }

  drawLiveStrokeSegment(stroke) {
    const ctx = this.presenterDrawCtx;
    if (!ctx || stroke.points.length < 2) return;

    const p1 = stroke.points[stroke.points.length - 2];
    const p2 = stroke.points[stroke.points.length - 1];

    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (stroke.tool === 'highlighter') {
      ctx.globalAlpha = 0.35;
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = 24;
    } else {
      ctx.globalAlpha = 1.0;
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = 3.5;
    }

    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
    ctx.restore();
  }

  redrawSlideDrawings(index) {
    const ctx = this.presenterDrawCtx;
    if (!ctx || !this.presenterDrawCanvas) return;

    ctx.clearRect(0, 0, this.presenterDrawCanvas.width, this.presenterDrawCanvas.height);
    const strokes = this.slideDrawings.get(index) || [];

    strokes.forEach(stroke => {
      if (!stroke.points || stroke.points.length < 2) return;
      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (stroke.tool === 'highlighter') {
        ctx.globalAlpha = 0.35;
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = 24;
      } else {
        ctx.globalAlpha = 1.0;
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = 3.5;
      }

      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }
      ctx.stroke();
      ctx.restore();
    });
  }

  clearCurrentSlideDrawings() {
    this.slideDrawings.delete(this.currentSlideIndex);
    if (this.presenterDrawCtx && this.presenterDrawCanvas) {
      this.presenterDrawCtx.clearRect(0, 0, this.presenterDrawCanvas.width, this.presenterDrawCanvas.height);
    }
    if (typeof window.toast === 'function') {
      window.toast("Slayd izohlari tozalandi");
    }
  }

  toggleThumbnailDrawer(forceState = null) {
    if (!this.presenterThumbDrawer) return;
    const isHidden = this.presenterThumbDrawer.classList.contains('hidden');
    const show = forceState !== null ? forceState : isHidden;
    this.presenterThumbDrawer.classList.toggle('hidden', !show);
    if (show) {
      this.renderThumbnailsDrawer();
    }
  }

  renderThumbnailsDrawer() {
    if (!this.presenterThumbGrid || !this.currentDoc) return;
    this.presenterThumbGrid.innerHTML = '';
    const doc = this.currentDoc;
    const total = this.getTotalSlides();

    const countEl = document.getElementById('presenterThumbCount');
    if (countEl) countEl.textContent = String(total);

    for (let i = 0; i < total; i++) {
      const item = document.createElement('div');
      item.className = `presenter-thumb-item ${i === this.currentSlideIndex ? 'active' : ''}`;

      if (doc.type === 'pdf' && doc.pages && doc.pages[i]) {
        item.innerHTML = `
          <img src="${doc.pages[i].dataUrl}" alt="Slayd ${i + 1}">
          <span class="thumb-label">${i + 1}</span>
        `;
      } else {
        const title = doc.slides?.[i]?.title || doc.sections?.[i]?.title || doc.sheets?.[i]?.name || `Slayd ${i + 1}`;
        item.innerHTML = `
          <div style="padding: 10px; font-size: 11px; color: #CBD5E1; line-height: 1.3;">
            <strong style="color: #38BDF8; display: block; margin-bottom: 4px;">#${i + 1}</strong>
            ${title.substring(0, 36)}
          </div>
          <span class="thumb-label">${i + 1}</span>
        `;
      }

      item.addEventListener('click', () => {
        this.showSlide(i);
        this.toggleThumbnailDrawer(false);
      });

      this.presenterThumbGrid.appendChild(item);
    }
  }

  toggleAiPanel(forceState = null) {
    if (!this.presenterAiPanel) return;
    const isHidden = this.presenterAiPanel.classList.contains('hidden');
    const show = forceState !== null ? forceState : isHidden;
    this.presenterAiPanel.classList.toggle('hidden', !show);
    if (show && (!this.presenterAiContent || !this.presenterAiContent.textContent.trim())) {
      this.explainCurrentSlideWithAI();
    }
  }

  async explainCurrentSlideWithAI() {
    if (!this.currentDoc || !this.ai) return;
    this.toggleAiPanel(true);
    if (this.presenterAiLoading) this.presenterAiLoading.classList.remove('hidden');
    if (this.presenterAiContent) this.presenterAiContent.innerHTML = '';

    const doc = this.currentDoc;
    const index = this.currentSlideIndex;
    let slideText = '';

    if (doc.type === 'pdf' && doc.pages && doc.pages[index]) {
      slideText = doc.pages[index].text || `Sahifa ${index + 1}`;
    } else if (doc.type === 'pptx' && doc.slides && doc.slides[index]) {
      const sl = doc.slides[index];
      slideText = `${sl.title}\n${sl.bullets.join('\n')}\n${sl.text}`;
    } else if (doc.sections && doc.sections[index]) {
      const sec = doc.sections[index];
      slideText = `${sec.title}\n${sec.content}`;
    } else {
      slideText = doc.name;
    }

    try {
      const prompt = `Ushbu taqdimot slaydi matni: "${slideText.substring(0, 900)}".
Ma'ruzachi (o'qituvchi) darsda talabalarga ushbu slaydni tushuntirib berishi uchun 3 ta asosiy va muhim tezis va jonli misollar yozib ber. O'zbek tilida, qisqa va lo'nda bo'lsin.`;
      const res = await this.ai.chatWithAssistant(prompt);
      if (this.presenterAiLoading) this.presenterAiLoading.classList.add('hidden');
      if (this.presenterAiContent) {
        this.presenterAiContent.innerHTML = `<div style="line-height: 1.6;">${(res.reply || '').replace(/\n/g, '<br>')}</div>`;
      }
    } catch (err) {
      if (this.presenterAiLoading) this.presenterAiLoading.classList.add('hidden');
      if (this.presenterAiContent) {
        this.presenterAiContent.innerHTML = `<div style="color: #F87171;">Izohni olishda xatolik yuz berdi: ${err.message}</div>`;
      }
    }
  }

  async generateAiSlideQuiz() {
    if (!this.currentDoc || !this.ai) return;
    this.toggleAiPanel(true);
    if (this.presenterAiLoading) this.presenterAiLoading.classList.remove('hidden');

    const doc = this.currentDoc;
    const index = this.currentSlideIndex;
    let slideText = '';

    if (doc.type === 'pdf' && doc.pages && doc.pages[index]) {
      slideText = doc.pages[index].text || `Sahifa ${index + 1}`;
    } else if (doc.type === 'pptx' && doc.slides && doc.slides[index]) {
      const sl = doc.slides[index];
      slideText = `${sl.title}\n${sl.bullets.join('\n')}\n${sl.text}`;
    } else if (doc.sections && doc.sections[index]) {
      const sec = doc.sections[index];
      slideText = `${sec.title}\n${sec.content}`;
    }

    try {
      const prompt = `Ushbu slayd: "${slideText.substring(0, 700)}" bo'yicha talabalarga berish uchun 1 ta test savoli (A, B, C, D variantlari bilan) va to'g'ri javobni yozib ber.`;
      const res = await this.ai.chatWithAssistant(prompt);
      if (this.presenterAiLoading) this.presenterAiLoading.classList.add('hidden');
      if (this.presenterAiContent) {
        this.presenterAiContent.innerHTML = `
          <div style="background: rgba(0,255,135,0.08); border: 1px solid rgba(0,255,135,0.25); border-radius: 8px; padding: 12px; margin-bottom: 10px;">
            <strong style="color: #00FF87;">❓ Slayd Test Savoli:</strong>
            <div style="margin-top: 6px;">${(res.reply || '').replace(/\n/g, '<br>')}</div>
          </div>
        `;
      }
    } catch (err) {
      if (this.presenterAiLoading) this.presenterAiLoading.classList.add('hidden');
    }
  }

  sendCurrentSlideToBoard() {
    if (!this.currentDoc) return;
    const doc = this.currentDoc;
    const index = this.currentSlideIndex;
    const center = this.board.screenToWorld(this.board.width / 2, this.board.height / 2);

    this.board.saveState();

    if (doc.type === 'pdf' && doc.pages && doc.pages[index]) {
      const page = doc.pages[index];
      const w = 620;
      const h = Math.round(w * (page.height / page.width));

      this.board.addObject({
        type: 'image',
        x: Math.round(center.x - w / 2),
        y: Math.round(center.y - h / 2),
        width: w,
        height: h,
        src: page.dataUrl
      });

      this.board.addObject({
        type: 'text',
        x: Math.round(center.x - w / 2 + 10),
        y: Math.round(center.y + h / 2 + 20),
        text: `📌 ${doc.name} — ${page.pageNum}-sahifa (Namoyishdan saqlandi)`,
        color: '#00FF87',
        fontSize: 13,
        fontWeight: 700
      });
    } else if (doc.type === 'pptx' && doc.slides && doc.slides[index]) {
      const sl = doc.slides[index];
      this.board.addObject({
        type: 'rect',
        x: Math.round(center.x - 300),
        y: Math.round(center.y - 180),
        width: 600,
        height: 340,
        color: '#38BDF8',
        strokeWidth: 2,
        filled: true,
        fillColor: '#0F172A'
      });
      this.board.addObject({
        type: 'text',
        x: Math.round(center.x - 270),
        y: Math.round(center.y - 140),
        text: `Slayd ${sl.slideNum}: ${sl.title}`,
        color: '#F8FAFC',
        fontSize: 18,
        fontWeight: 800
      });
      const bodySnippet = sl.bullets.map(b => `• ${b}`).join('\n') || sl.text;
      this.board.addObject({
        type: 'text',
        x: Math.round(center.x - 270),
        y: Math.round(center.y - 90),
        text: bodySnippet.substring(0, 320),
        color: '#CBD5E1',
        fontSize: 14,
        fontWeight: 500
      });
    }

    this.board.markDirty();
    this.board.autoSaveToStorage();

    if (typeof window.toast === 'function') {
      window.toast("📌 Slayd doskaga muvaffaqiyatli saqlandi!");
    }
  }
}

// Global eksport
if (typeof window !== 'undefined') {
  window.DocumentReader = DocumentReader;
}
