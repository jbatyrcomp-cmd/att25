/* ==========================================================================
   ATT-25 AI DOSKA — CANVAS BOARD ENGINE (board.js)
   Cheksiz Vektorli Canvas, Pan/Zoom, Grid, Undo/Redo, Ob'ektlar boshqaruvi
   ========================================================================== */

class WhiteboardEngine {
  constructor(canvasId, minimapId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');

    this.minimapCanvas = document.getElementById(minimapId);
    this.minimapCtx = this.minimapCanvas ? this.minimapCanvas.getContext('2d') : null;
    this.minimapViewport = document.getElementById('minimapViewport');

    // Viewport holati (Pan va Zoom)
    this.panX = 0;
    this.panY = 0;
    this.zoom = 1.0;
    this.minZoom = 0.2;
    this.maxZoom = 4.0;

    // Mavzu va To'r rejimi
    this.theme = 'chalkboard'; // chalkboard, dark, light
    this.gridMode = 'dots';    // dots, lines, clean
    this.gridSize = 24;        // Piksel qadami

    // Ob'ektlar ro'yxati va Tarix
    this.objects = [];
    this.selectedObject = null;
    this.undoStack = [];
    this.redoStack = [];
    this.maxHistory = 50;

    // Laser pointer izi
    this.laserTrail = []; // [{x, y, alpha, time}]

    // O'lchamlarni sozlash va render loop
    this.initCanvasSize();
    this.centerBoard();
    this.startRenderLoop();
  }

  /* ==========================================================================
     CANVAS O'LCHAMLARI VA EKSTENTLAR
     ========================================================================== */
  initCanvasSize() {
    const dpr = window.devicePixelRatio || 1;
    this.dpr = dpr;
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.canvas.style.width = this.width + 'px';
    this.canvas.style.height = this.height + 'px';

    this.ctx.scale(dpr, dpr);
  }

  centerBoard() {
    this.panX = this.width / 2;
    this.panY = this.height / 2;
    this.zoom = 1.0;
  }

  /* ==========================================================================
     KOORDINATA O'ZGARISHLARI (Screen <-> World)
     ========================================================================== */
  screenToWorld(sx, sy) {
    return {
      x: (sx - this.panX) / this.zoom,
      y: (sy - this.panY) / this.zoom
    };
  }

  worldToScreen(wx, wy) {
    return {
      x: wx * this.zoom + this.panX,
      y: wy * this.zoom + this.panY
    };
  }

  setZoom(newZoom, centerX = this.width / 2, centerY = this.height / 2) {
    const clamped = Math.max(this.minZoom, Math.min(this.maxZoom, newZoom));
    if (Math.abs(clamped - this.zoom) < 0.001) return;

    // Sichqoncha joylashgan dunyo nuqtasini o'zgarmas saqlash
    const worldBefore = this.screenToWorld(centerX, centerY);
    this.zoom = clamped;
    this.panX = centerX - worldBefore.x * this.zoom;
    this.panY = centerY - worldBefore.y * this.zoom;

    this.updateZoomIndicator();
  }

  updateZoomIndicator() {
    const el = document.getElementById('btnZoomReset');
    if (el) el.textContent = `${Math.round(this.zoom * 100)}%`;
  }

  /* ==========================================================================
     TARIХ VA UNDO / REDO
     ========================================================================== */
  saveState() {
    // Ob'ektlar holatini JSON klonlash
    const snapshot = JSON.stringify(this.objects);
    this.undoStack.push(snapshot);
    if (this.undoStack.length > this.maxHistory) {
      this.undoStack.shift();
    }
    this.redoStack = []; // Yangi amal bajarilganda redo tozalanadi
    this.updateUndoRedoButtons();
    this.autoSaveToStorage();
  }

  undo() {
    if (this.undoStack.length === 0) return;
    const current = JSON.stringify(this.objects);
    this.redoStack.push(current);
    const prev = this.undoStack.pop();
    this.objects = JSON.parse(prev);
    this.selectedObject = null;
    this.updateUndoRedoButtons();
    this.autoSaveToStorage();
  }

  redo() {
    if (this.redoStack.length === 0) return;
    const current = JSON.stringify(this.objects);
    this.undoStack.push(current);
    const next = this.redoStack.pop();
    this.objects = JSON.parse(next);
    this.selectedObject = null;
    this.updateUndoRedoButtons();
    this.autoSaveToStorage();
  }

  updateUndoRedoButtons() {
    const btnUndo = document.getElementById('btnUndo');
    const btnRedo = document.getElementById('btnRedo');
    if (btnUndo) btnUndo.disabled = this.undoStack.length === 0;
    if (btnRedo) btnRedo.disabled = this.redoStack.length === 0;
  }

  autoSaveToStorage() {
    try {
      const payload = {
        title: document.getElementById('boardTitleInput')?.value || 'Doska',
        theme: this.theme,
        gridMode: this.gridMode,
        panX: this.panX,
        panY: this.panY,
        zoom: this.zoom,
        objects: this.objects
      };
      localStorage.setItem('att25_ai_board_save', JSON.stringify(payload));
    } catch (e) {
      console.warn('Auto-save error:', e);
    }
  }

  loadFromStorage() {
    try {
      const raw = localStorage.getItem('att25_ai_board_save');
      if (!raw) return false;
      const data = JSON.parse(raw);
      if (data.objects && Array.isArray(data.objects)) {
        this.objects = data.objects;
        if (data.theme) this.setTheme(data.theme);
        if (data.gridMode) this.setGridMode(data.gridMode);
        if (data.panX !== undefined) this.panX = data.panX;
        if (data.panY !== undefined) this.panY = data.panY;
        if (data.zoom !== undefined) this.zoom = data.zoom;
        const titleEl = document.getElementById('boardTitleInput');
        if (titleEl && data.title) titleEl.value = data.title;
        this.updateZoomIndicator();
        return true;
      }
    } catch (e) {
      console.warn('Load from storage error:', e);
    }
    return false;
  }

  /* ==========================================================================
     OB'EKTLARNI QO'SHISH VA O'CHIRISH
     ========================================================================== */
  addObject(obj, recordState = true) {
    if (!obj.id) obj.id = 'obj_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
    this.objects.push(obj);
    if (recordState) this.saveState();
    return obj;
  }

  removeObject(obj, recordState = true) {
    const idx = this.objects.indexOf(obj);
    if (idx !== -1) {
      this.objects.splice(idx, 1);
      if (this.selectedObject === obj) this.selectedObject = null;
      if (recordState) this.saveState();
    }
  }

  replaceStrokesWithObject(strokesToRemove, newObject) {
    if (!strokesToRemove || strokesToRemove.length === 0 || !newObject) return null;

    this.saveState();

    strokesToRemove.forEach(st => {
      const idx = this.objects.indexOf(st);
      if (idx !== -1) this.objects.splice(idx, 1);
    });

    if (!newObject.id) newObject.id = 'obj_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
    this.objects.push(newObject);
    this.selectedObject = newObject;

    this.autoSaveToStorage();
    return newObject;
  }

  clearBoard() {
    if (this.objects.length === 0) return;
    this.saveState();
    this.objects = [];
    this.selectedObject = null;
    this.autoSaveToStorage();
  }

  /* ==========================================================================
     HIT TEST (OB'EKTNI BOSISHNI ANIQLASH)
     ========================================================================== */
  hitTest(wx, wy) {
    // Eng yuqoridagi ob'ektdan pastga qarab tekshirish
    for (let i = this.objects.length - 1; i >= 0; i--) {
      const obj = this.objects[i];
      if (this.isPointInsideObject(wx, wy, obj)) {
        return obj;
      }
    }
    return null;
  }

  isPointInsideObject(px, py, obj) {
    const pad = 8; // Tanlash oson bo'lishi uchun yostiqcha
    switch (obj.type) {
      case 'rect':
      case 'sticky':
        return px >= obj.x - pad && px <= obj.x + obj.width + pad &&
               py >= obj.y - pad && py <= obj.y + obj.height + pad;

      case 'circle': {
        const cx = obj.x + obj.radiusX;
        const cy = obj.y + obj.radiusY;
        const rx = obj.radiusX + pad;
        const ry = obj.radiusY + pad;
        const dx = (px - cx) / rx;
        const dy = (py - cy) / ry;
        return (dx * dx + dy * dy) <= 1;
      }

      case 'diamond': {
        const cx = obj.x + obj.width / 2;
        const cy = obj.y + obj.height / 2;
        const dx = Math.abs(px - cx) / (obj.width / 2 + pad);
        const dy = Math.abs(py - cy) / (obj.height / 2 + pad);
        return (dx + dy) <= 1;
      }

      case 'triangle':
        return px >= obj.x - pad && px <= obj.x + obj.width + pad &&
               py >= obj.y - pad && py <= obj.y + obj.height + pad;

      case 'line':
      case 'arrow':
        return this.distToSegment(px, py, obj.x1, obj.y1, obj.x2, obj.y2) <= (obj.strokeWidth / 2 + 10);

      case 'text':
      case 'formula':
        return px >= obj.x - pad && px <= obj.x + (obj.width || 160) + pad &&
               py >= obj.y - pad && py <= obj.y + (obj.height || 64) + pad;

      case 'graph':
        return px >= obj.x - pad && px <= obj.x + (obj.width || 420) + pad &&
               py >= obj.y - pad && py <= obj.y + (obj.height || 290) + pad;

      case 'quiz_card':
        return px >= obj.x - pad && px <= obj.x + (obj.width || 360) + pad &&
               py >= obj.y - pad && py <= obj.y + (obj.height || 260) + pad;

      case 'image':
        return px >= obj.x - pad && px <= obj.x + (obj.width || 240) + pad &&
               py >= obj.y - pad && py <= obj.y + (obj.height || 180) + pad;

      case 'net_node':
        return px >= obj.x - 30 && px <= obj.x + 30 &&
               py >= obj.y - 30 && py <= obj.y + 30;

      case 'stroke':
        if (!obj.points || obj.points.length < 2) return false;
        for (let i = 0; i < obj.points.length - 1; i++) {
          const p1 = obj.points[i];
          const p2 = obj.points[i + 1];
          if (this.distToSegment(px, py, p1.x, p1.y, p2.x, p2.y) <= (obj.width / 2 + 8)) {
            return true;
          }
        }
        return false;

      default:
        return false;
    }
  }

  distToSegment(px, py, x1, y1, x2, y2) {
    const l2 = (x2 - x1) ** 2 + (y2 - y1) ** 2;
    if (l2 === 0) return Math.hypot(px - x1, py - y1);
    let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(px - (x1 + t * (x2 - x1)), py - (y1 + t * (y2 - y1)));
  }

  /* ==========================================================================
     RENDER LOOP VA ASOSIY CHIZISH
     ========================================================================== */
  startRenderLoop() {
    const render = () => {
      this.draw();
      this.drawMinimap();
      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
  }

  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    // 1. To'rni (Grid) chizish
    this.drawGrid(ctx);

    // 2. Dunyo koordinatalari tizimiga o'tish
    ctx.save();
    ctx.translate(this.panX, this.panY);
    ctx.scale(this.zoom, this.zoom);

    // 3. Ob'ektlarni qatlamlar tartibida chizish
    // a) Stikerlar va to'ldirilgan shakllar (orqada)
    for (const obj of this.objects) {
      if (obj.type === 'sticky') this.drawStickyNote(ctx, obj);
    }

    // b) Erkin chizmalar (Highlighter & Qalam)
    for (const obj of this.objects) {
      if (obj.type === 'stroke') this.drawStroke(ctx, obj);
    }

    // c) Geometrik shakllar, chiziqlar, strelkalar
    for (const obj of this.objects) {
      if (['rect', 'circle', 'diamond', 'triangle', 'line', 'arrow'].includes(obj.type)) {
        this.drawShape(ctx, obj);
      }
    }

    // d) Tarmoq qurilmalari tugunlari (Network Nodes)
    for (const obj of this.objects) {
      if (obj.type === 'net_node') this.drawNetworkNode(ctx, obj);
    }

    // e) Rasmlar, Grafiklar, Test kartochkalari, Formulalar va Matnlar (oldinda)
    for (const obj of this.objects) {
      if (obj.type === 'image') this.drawImageObj(ctx, obj);
      else if (obj.type === 'graph') this.drawGraph(ctx, obj);
      else if (obj.type === 'quiz_card') this.drawQuizCard(ctx, obj);
      else if (obj.type === 'text') this.drawText(ctx, obj);
      else if (obj.type === 'formula') this.drawFormula(ctx, obj);
    }

    // 4. Tanlangan ob'ekt atrofidagi ramka (Selection Bounding Box)
    if (this.selectedObject) {
      this.drawSelectionBox(ctx, this.selectedObject);
    }

    ctx.restore();

    // 5. Laser Pointer izini chizish (Screen coords)
    this.drawLaserTrail(ctx);
  }

  /* ==========================================================================
     GRID (TO'R) CHIZISH
     ========================================================================== */
  drawGrid(ctx) {
    if (this.gridMode === 'clean') return;

    const step = this.gridSize * this.zoom;
    if (step < 8) return; // Masshtab juda kichik bo'lsa ortiqcha to'r chizilmaydi

    const startX = ((this.panX % step) + step) % step;
    const startY = ((this.panY % step) + step) % step;

    ctx.save();
    if (this.theme === 'chalkboard') {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    } else if (this.theme === 'dark') {
      ctx.fillStyle = 'rgba(56, 189, 248, 0.18)';
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
    } else {
      ctx.fillStyle = 'rgba(100, 116, 139, 0.25)';
      ctx.strokeStyle = 'rgba(100, 116, 139, 0.12)';
    }

    if (this.gridMode === 'dots') {
      const radius = this.zoom > 1.5 ? 1.5 : 1.0;
      for (let x = startX; x < this.width; x += step) {
        for (let y = startY; y < this.height; y += step) {
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } else if (this.gridMode === 'lines') {
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = startX; x < this.width; x += step) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, this.height);
      }
      for (let y = startY; y < this.height; y += step) {
        ctx.moveTo(0, y);
        ctx.lineTo(this.width, y);
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  /* ==========================================================================
     INDIVIDUAL OB'EKTLAR RENDERI
     ========================================================================== */

  // 1. Erkin chizma (Qalam / Marker)
  drawStroke(ctx, obj) {
    if (!obj.points || obj.points.length < 1) return;
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (obj.isHighlighter) {
      ctx.globalAlpha = 0.35;
      ctx.lineWidth = obj.width * 2.5;
      ctx.strokeStyle = obj.color;
    } else {
      ctx.globalAlpha = 1.0;
      ctx.lineWidth = obj.width;
      ctx.strokeStyle = obj.color;

      // Chalkboard mavzusida bo'r effekti
      if (this.theme === 'chalkboard' && obj.color === '#FFFFFF') {
        ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
        ctx.shadowBlur = 2;
      }
    }

    ctx.beginPath();
    ctx.moveTo(obj.points[0].x, obj.points[0].y);

    if (obj.points.length === 1) {
      ctx.arc(obj.points[0].x, obj.points[0].y, obj.width / 2, 0, Math.PI * 2);
      ctx.fillStyle = obj.color;
      ctx.fill();
    } else {
      // Quadratic Bezier smoothing
      for (let i = 1; i < obj.points.length - 1; i++) {
        const xc = (obj.points[i].x + obj.points[i + 1].x) / 2;
        const yc = (obj.points[i].y + obj.points[i + 1].y) / 2;
        ctx.quadraticCurveTo(obj.points[i].x, obj.points[i].y, xc, yc);
      }
      ctx.lineTo(obj.points[obj.points.length - 1].x, obj.points[obj.points.length - 1].y);
      ctx.stroke();
    }
    ctx.restore();
  }

  // 2. Geometrik Shakllar
  drawShape(ctx, obj) {
    ctx.save();
    ctx.lineWidth = obj.strokeWidth || 3;
    ctx.strokeStyle = obj.color || '#38BDF8';
    ctx.fillStyle = obj.filled ? (obj.fillColor || 'rgba(56, 189, 248, 0.2)') : 'transparent';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    switch (obj.type) {
      case 'rect': {
        const rx = 6;
        ctx.beginPath();
        ctx.roundRect(obj.x, obj.y, obj.width, obj.height, rx);
        if (obj.filled) ctx.fill();
        ctx.stroke();
        break;
      }
      case 'circle': {
        const cx = obj.x + obj.radiusX;
        const cy = obj.y + obj.radiusY;
        ctx.beginPath();
        ctx.ellipse(cx, cy, Math.abs(obj.radiusX), Math.abs(obj.radiusY), 0, 0, Math.PI * 2);
        if (obj.filled) ctx.fill();
        ctx.stroke();
        break;
      }
      case 'diamond': {
        const cx = obj.x + obj.width / 2;
        const cy = obj.y + obj.height / 2;
        ctx.beginPath();
        ctx.moveTo(cx, obj.y);
        ctx.lineTo(obj.x + obj.width, cy);
        ctx.lineTo(cx, obj.y + obj.height);
        ctx.lineTo(obj.x, cy);
        ctx.closePath();
        if (obj.filled) ctx.fill();
        ctx.stroke();
        break;
      }
      case 'triangle': {
        ctx.beginPath();
        ctx.moveTo(obj.x + obj.width / 2, obj.y);
        ctx.lineTo(obj.x + obj.width, obj.y + obj.height);
        ctx.lineTo(obj.x, obj.y + obj.height);
        ctx.closePath();
        if (obj.filled) ctx.fill();
        ctx.stroke();
        break;
      }
      case 'line': {
        ctx.beginPath();
        ctx.moveTo(obj.x1, obj.y1);
        ctx.lineTo(obj.x2, obj.y2);
        ctx.stroke();
        break;
      }
      case 'arrow': {
        ctx.beginPath();
        ctx.moveTo(obj.x1, obj.y1);
        ctx.lineTo(obj.x2, obj.y2);
        ctx.stroke();

        // Strelka uchi (Arrowhead)
        const angle = Math.atan2(obj.y2 - obj.y1, obj.x2 - obj.x1);
        const headLen = Math.max(12, obj.strokeWidth * 3.5);
        ctx.beginPath();
        ctx.moveTo(obj.x2, obj.y2);
        ctx.lineTo(obj.x2 - headLen * Math.cos(angle - Math.PI / 6), obj.y2 - headLen * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(obj.x2 - headLen * Math.cos(angle + Math.PI / 6), obj.y2 - headLen * Math.sin(angle + Math.PI / 6));
        ctx.closePath();
        ctx.fillStyle = obj.color;
        ctx.fill();
        break;
      }
    }
    ctx.restore();
  }

  // 3. Rangli Stiker (Sticky Note)
  drawStickyNote(ctx, obj) {
    ctx.save();
    const w = obj.width || 160;
    const h = obj.height || 140;

    // Soyasi
    ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
    ctx.shadowBlur = 14;
    ctx.shadowOffsetY = 6;

    // Stiker foni va burchak bukilishi
    ctx.fillStyle = obj.bgColor || '#FEF08A';
    ctx.beginPath();
    ctx.roundRect(obj.x, obj.y, w, h, [6, 6, 16, 6]);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    // Qirrasi
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Matn
    if (obj.text) {
      ctx.fillStyle = obj.textColor || '#1E293B';
      ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
      ctx.textBaseline = 'top';
      this.wrapText(ctx, obj.text, obj.x + 12, obj.y + 12, w - 24, 18);
    }
    ctx.restore();
  }

  // 4. Matn Bloki
  drawText(ctx, obj) {
    if (!obj.text) return;
    ctx.save();
    ctx.fillStyle = obj.color || '#F8FAFC';
    ctx.font = `${obj.fontWeight || 600} ${obj.fontSize || 16}px "${obj.fontFamily || 'Plus Jakarta Sans'}", sans-serif`;
    ctx.textBaseline = 'top';

    const lines = obj.text.split('\n');
    const lineHeight = (obj.fontSize || 16) * 1.35;
    lines.forEach((line, i) => {
      ctx.fillText(line, obj.x, obj.y + i * lineHeight);
    });

    // O'lchamlarni hisoblash
    let maxW = 0;
    lines.forEach(l => {
      const m = ctx.measureText(l);
      if (m.width > maxW) maxW = m.width;
    });
    obj.width = maxW;
    obj.height = lines.length * lineHeight;
    ctx.restore();
  }

  // 5. Tarmoq Qurilmasi Tuguni (Network Node)
  drawNetworkNode(ctx, obj) {
    ctx.save();
    const x = obj.x;
    const y = obj.y;
    const size = 26;

    // Tugun foni (doira/badge)
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 2;
    ctx.shadowColor = 'rgba(56, 189, 248, 0.35)';
    ctx.shadowBlur = 8;

    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.shadowColor = 'transparent';

    // Piktogramma (Emoji / SVG ramz)
    ctx.font = '20px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    let icon = '🌐';
    if (obj.nodeType === 'router') icon = '🌐';
    else if (obj.nodeType === 'switch') icon = '🔀';
    else if (obj.nodeType === 'server') icon = '🖥️';
    else if (obj.nodeType === 'cloud') icon = '☁️';
    else if (obj.nodeType === 'pc') icon = '💻';
    else if (obj.nodeType === 'firewall') icon = '🛡️';
    ctx.fillText(icon, x, y);

    // Labels
    ctx.fillStyle = '#F8FAFC';
    ctx.font = '700 11px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(obj.label || obj.nodeType.toUpperCase(), x, y + size + 6);

    if (obj.ip) {
      ctx.fillStyle = '#38BDF8';
      ctx.font = '500 10px "JetBrains Mono", monospace';
      ctx.fillText(obj.ip, x, y + size + 20);
    }
    ctx.restore();
  }

  // 4b. Matematik Formula (MS Word & KaTeX Math Editor Style)
  drawFormula(ctx, obj) {
    if (!obj.latex) return;
    ctx.save();

    const color = obj.color || (this.theme === 'light' ? '#0F172A' : '#FFFFFF');
    const fontSize = obj.fontSize || 26;

    // Ob'ekt o'lchamini dinamik baholash
    const textLen = obj.latex.length;
    const estWidth = Math.max(140, Math.min(720, textLen * (fontSize * 0.58) + 40));
    const estHeight = Math.max(56, fontSize * 2.2);
    obj.width = obj.width || estWidth;
    obj.height = obj.height || estHeight;

    // MS Word uslubidagi fon qutisi: toza, nozik, shaffof doska foni
    const isSelected = this.selectedObject === obj;
    ctx.fillStyle = this.theme === 'chalkboard'
      ? 'rgba(10, 27, 20, 0.65)'
      : (this.theme === 'dark' ? 'rgba(15, 23, 42, 0.75)' : 'rgba(255, 255, 255, 0.85)');
    
    // Tanlanganda Word Equation ramkasi
    ctx.strokeStyle = isSelected ? '#A855F7' : (this.theme === 'light' ? 'rgba(15, 23, 42, 0.15)' : 'rgba(255, 255, 255, 0.12)');
    ctx.lineWidth = isSelected ? 1.5 : 1;
    ctx.beginPath();
    ctx.roundRect(obj.x, obj.y, obj.width, obj.height, 6);
    ctx.fill();
    ctx.stroke();

    // KaTeX orqali SVG tasvir tayyorlash yoki qayta foydalanish
    if (typeof window !== 'undefined' && window.katex) {
      if (!obj._img || obj._lastLatex !== obj.latex || obj._lastColor !== color || obj._lastSize !== fontSize) {
        try {
          const rawHtml = window.katex.renderToString(obj.latex, { displayMode: true, throwOnError: false });
          const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" width="${obj.width}" height="${obj.height}">
            <foreignObject width="100%" height="100%">
              <div xmlns="http://www.w3.org/1999/xhtml" style="color:${color}; font-size:${fontSize}px; display:flex; align-items:center; justify-content:center; height:100%; margin:0; padding:0 8px; font-family:'Cambria Math', 'Latin Modern Math', 'STIX Two Math', 'Times New Roman', serif; text-rendering:geometricPrecision;">
                <style>
                  @import url('https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css');
                  .katex { font-family: 'Cambria Math', 'Latin Modern Math', 'STIX Two Math', 'Times New Roman', serif !important; }
                  .frac-line { border-bottom-width: 0.05em !important; }
                </style>
                ${rawHtml}
              </div>
            </foreignObject>
          </svg>`;
          const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          const img = new Image();
          img.onload = () => {
            obj._img = img;
            URL.revokeObjectURL(url);
          };
          img.src = url;
          obj._lastLatex = obj.latex;
          obj._lastColor = color;
          obj._lastSize = fontSize;
        } catch (e) {
          console.warn('Formula render error:', e);
        }
      }

      if (obj._img && obj._img.complete && obj._img.naturalWidth > 0) {
        ctx.drawImage(obj._img, obj.x, obj.y, obj.width, obj.height);
        ctx.restore();
        return;
      }
    }

    // Fallback Canvas Math matni (Word Equation uslubida darajalar va kasrlar)
    ctx.fillStyle = color;
    ctx.font = `600 ${fontSize}px "Cambria Math", "Latin Modern Math", "Georgia", serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    let cleanText = obj.latex
      .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1 / $2)')
      .replace(/\\sqrt\{([^}]+)\}/g, '√($1)')
      .replace(/\\sqrt\[(\d+)\]\{([^}]+)\}/g, '$1√($2)')
      .replace(/\\sum_\{([^}]+)\}\^\{([^}]+)\}/g, '∑($1..$2)')
      .replace(/\\int_\{([^}]+)\}\^\{([^}]+)\}/g, '∫($1..$2)')
      .replace(/\\int/g, '∫')
      .replace(/\\sum/g, '∑')
      .replace(/\\lim/g, 'lim')
      .replace(/\\alpha/g, 'α')
      .replace(/\\beta/g, 'β')
      .replace(/\\pi/g, 'π')
      .replace(/\\theta/g, 'θ')
      .replace(/\\omega/g, 'ω')
      .replace(/\\Delta/g, 'Δ')
      .replace(/\\lambda/g, 'λ')
      .replace(/\\infty/g, '∞')
      .replace(/\\pm/g, '±')
      .replace(/\\cdot/g, '·')
      .replace(/\\log_2/g, 'log₂')
      .replace(/\^0/g, '⁰')
      .replace(/\^1/g, '¹')
      .replace(/\^2/g, '²')
      .replace(/\^3/g, '³')
      .replace(/\^4/g, '⁴')
      .replace(/\^5/g, '⁵')
      .replace(/\^6/g, '⁶')
      .replace(/\^7/g, '⁷')
      .replace(/\^8/g, '⁸')
      .replace(/\^9/g, '⁹')
      .replace(/\^n/g, 'ⁿ')
      .replace(/\^x/g, 'ˣ')
      .replace(/_0/g, '₀')
      .replace(/_1/g, '₁')
      .replace(/_2/g, '₂')
      .replace(/_3/g, '₃')
      .replace(/_4/g, '₄')
      .replace(/_5/g, '₅')
      .replace(/_6/g, '₆')
      .replace(/_7/g, '₇')
      .replace(/_8/g, '₈')
      .replace(/_9/g, '₉')
      .replace(/_i/g, 'ᵢ')
      .replace(/_j/g, 'ⱼ')
      .replace(/_k/g, 'ₖ')
      .replace(/_n/g, 'ₙ');

    ctx.fillText(cleanText, obj.x + obj.width / 2, obj.y + obj.height / 2);
    ctx.restore();
  }

  // 4c. 2D Funksiya Grafigi (Graph Plotter)
  drawGraph(ctx, obj) {
    ctx.save();
    const w = obj.width || 420;
    const h = obj.height || 290;
    const x = obj.x;
    const y = obj.y;
    const color = obj.color || '#00FF87';
    const rangeX = obj.rangeX || [-6, 6];
    const rangeY = obj.rangeY || [-4, 6];

    // 1. Tashqi shaffof fon qutisi (Dark glass card)
    ctx.fillStyle = this.theme === 'chalkboard' ? 'rgba(10, 27, 20, 0.88)' : (this.theme === 'dark' ? 'rgba(15, 23, 42, 0.92)' : 'rgba(255, 255, 255, 0.95)');
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 12);
    ctx.fill();
    ctx.stroke();

    // Yuqori sarlavha paneli
    ctx.fillStyle = color;
    ctx.font = '700 11px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(`📈 GRAFIK: ${obj.title || ('y = ' + obj.funcStr)}`, x + 14, y + 10);

    // Kichik oraliq ko'rsatgichi
    ctx.fillStyle = '#94A3B8';
    ctx.font = '500 10px "JetBrains Mono", monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`x ∈ [${rangeX[0]}, ${rangeX[1]}]`, x + w - 14, y + 10);

    // 2. Chizma maydoni (Plot Area)
    const padL = 36;
    const padR = 16;
    const padT = 32;
    const padB = 26;
    const pX = x + padL;
    const pY = y + padT;
    const pW = w - padL - padR;
    const pH = h - padT - padB;

    // Chizma foni
    ctx.fillStyle = this.theme === 'light' ? 'rgba(241, 245, 249, 0.7)' : 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.roundRect(pX, pY, pW, pH, 6);
    ctx.fill();

    // To'r va o'qlarni chizish
    const xMin = rangeX[0], xMax = rangeX[1];
    const yMin = rangeY[0], yMax = rangeY[1];

    const toScreenX = (val) => pX + ((val - xMin) / (xMax - xMin)) * pW;
    const toScreenY = (val) => pY + pH - ((val - yMin) / (yMax - yMin)) * pH;

    // Katakchalar (Grid)
    ctx.strokeStyle = this.theme === 'light' ? 'rgba(100, 116, 139, 0.15)' : 'rgba(255, 255, 255, 0.07)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let gx = Math.ceil(xMin); gx <= Math.floor(xMax); gx++) {
      const sx = toScreenX(gx);
      ctx.moveTo(sx, pY);
      ctx.lineTo(sx, pY + pH);
    }
    for (let gy = Math.ceil(yMin); gy <= Math.floor(yMax); gy++) {
      const sy = toScreenY(gy);
      ctx.moveTo(pX, sy);
      ctx.lineTo(pX + pW, sy);
    }
    ctx.stroke();

    // Asosiy koordinata o'qlari (X = 0 va Y = 0)
    const originXScreen = toScreenX(0);
    const originYScreen = toScreenY(0);

    ctx.strokeStyle = this.theme === 'light' ? 'rgba(71, 85, 105, 0.6)' : 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    if (originYScreen >= pY && originYScreen <= pY + pH) {
      ctx.moveTo(pX, originYScreen);
      ctx.lineTo(pX + pW, originYScreen);
    }
    if (originXScreen >= pX && originXScreen <= pX + pW) {
      ctx.moveTo(originXScreen, pY);
      ctx.lineTo(originXScreen, pY + pH);
    }
    ctx.stroke();

    // O'q belgilari (X, Y yozuvlari)
    ctx.fillStyle = '#CBD5E1';
    ctx.font = '600 9px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'bottom';
    if (originXScreen >= pX && originXScreen <= pX + pW) {
      ctx.fillText('Y', originXScreen + 4, pY + 12);
    }
    if (originYScreen >= pY && originYScreen <= pY + pH) {
      ctx.textAlign = 'right';
      ctx.fillText('X', pX + pW - 4, originYScreen - 4);
    }

    // 3. Funksiya egri chizig'ini hisoblash va chizish
    ctx.save();
    ctx.beginPath();
    ctx.rect(pX, pY, pW, pH); // Plot maydonidan chiqib ketmasligi uchun clip
    ctx.clip();

    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.shadowColor = color;
    ctx.shadowBlur = 6;

    const evalFn = (xVal) => {
      if (window.MathSolver && typeof window.MathSolver.eval === 'function') {
        return window.MathSolver.eval(obj.funcStr, xVal);
      }
      try {
        let expr = obj.funcStr
          .replace(/(\d+)x/g, '$1*x')
          .replace(/x\^(\d+)/g, 'Math.pow(x, $1)')
          .replace(/x\^2/g, 'x*x')
          .replace(/x\^3/g, 'x*x*x')
          .replace(/sin/g, 'Math.sin')
          .replace(/cos/g, 'Math.cos')
          .replace(/tan/g, 'Math.tan')
          .replace(/sqrt/g, 'Math.sqrt')
          .replace(/abs/g, 'Math.abs');
        const fn = new Function('x', `return ${expr};`);
        const v = fn(xVal);
        return Number.isFinite(v) ? v : null;
      } catch (e) {
        return null;
      }
    };

    let isDrawing = false;
    ctx.beginPath();
    const stepPx = 1.5;
    for (let px = pX; px <= pX + pW; px += stepPx) {
      const xVal = xMin + ((px - pX) / pW) * (xMax - xMin);
      const yVal = evalFn(xVal);

      if (yVal !== null && Number.isFinite(yVal)) {
        const py = toScreenY(yVal);
        if (!isDrawing) {
          ctx.moveTo(px, py);
          isDrawing = true;
        } else {
          if (py < pY - 150 || py > pY + pH + 150) {
            isDrawing = false;
          } else {
            ctx.lineTo(px, py);
          }
        }
      } else {
        isDrawing = false;
      }
    }
    ctx.stroke();
    ctx.restore();

    ctx.restore();
  }

  // 4d. Interaktiv Bilim Test Kartochkasi (Quiz Flashcard)
  drawQuizCard(ctx, obj) {
    ctx.save();
    const w = obj.width || 360;
    const x = obj.x;
    const y = obj.y;
    const topic = obj.topic || 'BILIM TESTI';
    const question = obj.question || 'Savol matni kiritilmagan';
    const options = obj.options || ['A) Variant 1', 'B) Variant 2', 'C) Variant 3', 'D) Variant 4'];
    const correctIdx = obj.correctIndex !== undefined ? obj.correctIndex : 0;
    const selectedIdx = obj.selectedIndex;
    const revealed = !!obj.revealed;

    const headerH = 38;
    const qLineH = 18;
    const estQLines = Math.ceil(question.length / 38);
    const qH = Math.max(36, estQLines * qLineH + 12);
    const optH = options.length * 36;
    const expH = (revealed && obj.explanation) ? 55 : 0;
    const btnH = 36;
    const totalH = headerH + qH + optH + btnH + expH + 24;
    obj.height = totalH;

    // Karta foni
    ctx.fillStyle = this.theme === 'chalkboard' ? 'rgba(10, 27, 20, 0.92)' : (this.theme === 'dark' ? 'rgba(15, 23, 42, 0.94)' : 'rgba(255, 255, 255, 0.96)');
    ctx.strokeStyle = revealed ? '#10B981' : '#38BDF8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(x, y, w, totalH, 12);
    ctx.fill();
    ctx.stroke();

    // Yuqori sarlavha paneli
    ctx.fillStyle = revealed ? 'rgba(16, 185, 129, 0.15)' : 'rgba(56, 189, 248, 0.15)';
    ctx.beginPath();
    ctx.roundRect(x, y, w, headerH, [12, 12, 0, 0]);
    ctx.fill();

    // Badge va mavzu
    ctx.fillStyle = revealed ? '#10B981' : '#38BDF8';
    ctx.font = '700 11px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(`❓ AI TEST • ${topic.toUpperCase()}`, x + 14, y + headerH / 2);

    // Savol matni
    let curY = y + headerH + 10;
    ctx.fillStyle = this.theme === 'light' ? '#0F172A' : '#F8FAFC';
    ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    this.wrapText(ctx, question, x + 14, curY, w - 28, qLineH);

    curY += qH;

    // Variantlar (Options)
    options.forEach((opt, idx) => {
      const optY = curY + idx * 36;
      const isSelected = selectedIdx === idx;
      const isCorrect = correctIdx === idx;

      let boxBg = this.theme === 'light' ? 'rgba(241, 245, 249, 0.8)' : 'rgba(255, 255, 255, 0.05)';
      let boxBorder = 'rgba(255, 255, 255, 0.1)';
      let textColor = this.theme === 'light' ? '#334155' : '#E2E8F0';

      if (revealed) {
        if (isCorrect) {
          boxBg = 'rgba(16, 185, 129, 0.2)';
          boxBorder = '#10B981';
          textColor = '#10B981';
        } else if (isSelected && !isCorrect) {
          boxBg = 'rgba(239, 68, 68, 0.2)';
          boxBorder = '#EF4444';
          textColor = '#EF4444';
        }
      } else if (isSelected) {
        boxBg = 'rgba(56, 189, 248, 0.18)';
        boxBorder = '#38BDF8';
        textColor = '#38BDF8';
      }

      ctx.fillStyle = boxBg;
      ctx.strokeStyle = boxBorder;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(x + 14, optY, w - 28, 28, 6);
      ctx.fill();
      ctx.stroke();

      // Radio tugma nishoni
      ctx.fillStyle = boxBorder;
      ctx.beginPath();
      ctx.arc(x + 28, optY + 14, 6, 0, Math.PI * 2);
      ctx.stroke();
      if (isSelected || (revealed && isCorrect)) {
        ctx.fillStyle = (revealed && isCorrect) ? '#10B981' : (isSelected && !isCorrect && revealed ? '#EF4444' : '#38BDF8');
        ctx.beginPath();
        ctx.arc(x + 28, optY + 14, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Variant matni
      ctx.fillStyle = textColor;
      ctx.font = '500 12px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      const labelText = opt.length > 40 ? opt.substring(0, 38) + '...' : opt;
      ctx.fillText(labelText, x + 44, optY + 14);
    });

    curY += optH + 8;

    // Javobni ko'rish tugmasi
    ctx.fillStyle = revealed ? 'rgba(16, 185, 129, 0.25)' : 'rgba(56, 189, 248, 0.25)';
    ctx.strokeStyle = revealed ? '#10B981' : '#38BDF8';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(x + 14, curY, w - 28, 28, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = revealed ? '#10B981' : '#38BDF8';
    ctx.font = '700 11px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(revealed ? '✅ JAVOB OCHILGAN (YOPISH UCHUN BOSING)' : '👁️ TO‘G‘RI JAVOBNI KO‘RSATISH', x + w / 2, curY + 14);

    // Agar ochilgan bo'lsa izoh qutisi
    if (revealed && obj.explanation) {
      curY += 34;
      ctx.fillStyle = 'rgba(16, 185, 129, 0.1)';
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.3)';
      ctx.beginPath();
      ctx.roundRect(x + 14, curY, w - 28, 42, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#CBD5E1';
      ctx.font = '500 11px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      this.wrapText(ctx, `💡 Izoh: ${obj.explanation}`, x + 20, curY + 6, w - 40, 15);
    }

    ctx.restore();
  }

  // 4e. Rasm Ob'ekti (Pasted / Uploaded Image)
  drawImageObj(ctx, obj) {
    if (!obj.src) return;
    ctx.save();
    const w = obj.width || 240;
    const h = obj.height || 180;
    const x = obj.x;
    const y = obj.y;

    if (!obj._img) {
      const img = new Image();
      img.onload = () => {
        obj._img = img;
        if (!obj.width && img.naturalWidth) {
          obj.width = Math.min(480, img.naturalWidth);
          obj.height = Math.round(img.naturalHeight * (obj.width / img.naturalWidth));
        }
      };
      img.src = obj.src;
    }

    if (obj._img && obj._img.complete && obj._img.naturalWidth > 0) {
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 8);
      ctx.clip();
      ctx.drawImage(obj._img, x, y, w, h);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    } else {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#94A3B8';
      ctx.font = '500 12px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🖼️ Rasm yuklanmoqda...', x + w / 2, y + h / 2);
    }

    if (obj.caption) {
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.beginPath();
      ctx.roundRect(x + 8, y + h - 26, w - 16, 20, 4);
      ctx.fill();

      ctx.fillStyle = '#F8FAFC';
      ctx.font = '600 10px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(obj.caption, x + w / 2, y + h - 16);
    }
    ctx.restore();
  }

  // Ko'p qatorli matnni sig'dirish yordamchisi
  wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let currY = y;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, currY);
        line = words[n] + ' ';
        currY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, currY);
  }

  // 6. Tanlangan ob'ekt ramkasi
  drawSelectionBox(ctx, obj) {
    ctx.save();
    ctx.strokeStyle = '#00FF87';
    ctx.lineWidth = 1.5 / this.zoom;
    ctx.setLineDash([4 / this.zoom, 4 / this.zoom]);

    let bounds = this.getObjectBounds(obj);
    if (bounds) {
      const pad = 6 / this.zoom;
      ctx.strokeRect(bounds.x - pad, bounds.y - pad, bounds.width + pad * 2, bounds.height + pad * 2);

      // Burchak tutqichlari (Handles)
      ctx.setLineDash([]);
      ctx.fillStyle = '#00FF87';
      const hSize = 6 / this.zoom;
      const pts = [
        { x: bounds.x - pad, y: bounds.y - pad },
        { x: bounds.x + bounds.width + pad, y: bounds.y - pad },
        { x: bounds.x + bounds.width + pad, y: bounds.y + bounds.height + pad },
        { x: bounds.x - pad, y: bounds.y + bounds.height + pad }
      ];
      pts.forEach(p => {
        ctx.fillRect(p.x - hSize / 2, p.y - hSize / 2, hSize, hSize);
      });
    }
    ctx.restore();
  }

  getObjectBounds(obj) {
    switch (obj.type) {
      case 'rect':
      case 'sticky':
        return { x: obj.x, y: obj.y, width: obj.width, height: obj.height };
      case 'circle':
        return { x: obj.x, y: obj.y, width: obj.radiusX * 2, height: obj.radiusY * 2 };
      case 'diamond':
      case 'triangle':
        return { x: obj.x, y: obj.y, width: obj.width, height: obj.height };
      case 'line':
      case 'arrow':
        return {
          x: Math.min(obj.x1, obj.x2),
          y: Math.min(obj.y1, obj.y2),
          width: Math.abs(obj.x2 - obj.x1),
          height: Math.abs(obj.y2 - obj.y1)
        };
      case 'text':
      case 'formula':
        return { x: obj.x, y: obj.y, width: obj.width || 180, height: obj.height || 64 };
      case 'graph':
        return { x: obj.x, y: obj.y, width: obj.width || 420, height: obj.height || 290 };
      case 'quiz_card':
        return { x: obj.x, y: obj.y, width: obj.width || 360, height: obj.height || 260 };
      case 'image':
        return { x: obj.x, y: obj.y, width: obj.width || 240, height: obj.height || 180 };
      case 'net_node':
        return { x: obj.x - 30, y: obj.y - 30, width: 60, height: 60 };
      case 'stroke': {
        if (!obj.points || obj.points.length === 0) return null;
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        obj.points.forEach(p => {
          if (p.x < minX) minX = p.x;
          if (p.x > maxX) maxX = p.x;
          if (p.y < minY) minY = p.y;
          if (p.y > maxY) maxY = p.y;
        });
        return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
      }
      default:
        return null;
    }
  }

  /* ==========================================================================
     LASER POINTER IZI
     ========================================================================== */
  addLaserPoint(sx, sy) {
    this.laserTrail.push({ x: sx, y: sy, time: Date.now() });
  }

  drawLaserTrail(ctx) {
    const now = Date.now();
    this.laserTrail = this.laserTrail.filter(p => now - p.time < 500);
    if (this.laserTrail.length < 2) return;

    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    for (let i = 0; i < this.laserTrail.length - 1; i++) {
      const p1 = this.laserTrail[i];
      const p2 = this.laserTrail[i + 1];
      const age = now - p1.time;
      const alpha = Math.max(0, 1 - age / 500);

      ctx.strokeStyle = `rgba(244, 63, 94, ${alpha})`;
      ctx.lineWidth = 6 * alpha;
      ctx.shadowColor = '#F43F5E';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
    ctx.restore();
  }

  /* ==========================================================================
     MINIMAP (PASTKI O'NG BURCHAKDA DOSKA HARITASI)
     ========================================================================== */
  drawMinimap() {
    if (!this.minimapCtx) return;
    const mCtx = this.minimapCtx;
    const mW = this.minimapCanvas.width;
    const mH = this.minimapCanvas.height;

    mCtx.clearRect(0, 0, mW, mH);
    mCtx.fillStyle = this.theme === 'chalkboard' ? '#0a1b14' : (this.theme === 'dark' ? '#070C14' : '#E2E8F0');
    mCtx.fillRect(0, 0, mW, mH);

    // Barcha ob'ektlarning umumiy chegaralarini aniqlash
    if (this.objects.length === 0) return;

    let bMinX = -1000, bMinY = -800, bMaxX = 1000, bMaxY = 800;
    this.objects.forEach(obj => {
      const b = this.getObjectBounds(obj);
      if (b) {
        if (b.x < bMinX) bMinX = b.x;
        if (b.y < bMinY) bMinY = b.y;
        if (b.x + b.width > bMaxX) bMaxX = b.x + b.width;
        if (b.y + b.height > bMaxY) bMaxY = b.y + b.height;
      }
    });

    const bW = (bMaxX - bMinX) || 1;
    const bH = (bMaxY - bMinY) || 1;
    const scale = Math.min(mW / bW, mH / bH) * 0.8;
    const offX = (mW - bW * scale) / 2;
    const offY = (mH - bH * scale) / 2;

    // Ob'ektlarni nuqta/kichik to'rtburchaklar shaklida chizish
    mCtx.fillStyle = '#10B981';
    this.objects.forEach(obj => {
      const b = this.getObjectBounds(obj);
      if (b) {
        const mx = offX + (b.x - bMinX) * scale;
        const my = offY + (b.y - bMinY) * scale;
        const mw = Math.max(2, b.width * scale);
        const mh = Math.max(2, b.height * scale);
        mCtx.fillRect(mx, my, mw, mh);
      }
    });

    // Viewport to'rtburchagi
    if (this.minimapViewport) {
      const vTopLeft = this.screenToWorld(0, 0);
      const vBotRight = this.screenToWorld(this.width, this.height);
      const vx = offX + (vTopLeft.x - bMinX) * scale;
      const vy = offY + (vTopLeft.y - bMinY) * scale;
      const vw = (vBotRight.x - vTopLeft.x) * scale;
      const vh = (vBotRight.y - vTopLeft.y) * scale;

      this.minimapViewport.style.left = Math.max(0, Math.min(mW - 10, vx)) + 'px';
      this.minimapViewport.style.top = Math.max(0, Math.min(mH - 10, vy)) + 'px';
      this.minimapViewport.style.width = Math.max(10, Math.min(mW, vw)) + 'px';
      this.minimapViewport.style.height = Math.max(10, Math.min(mH, vh)) + 'px';
    }
  }

  /* ==========================================================================
     EKSPORT TIZIMI (PNG, SVG, JSON)
     ========================================================================== */
  exportPNG(transparent = false) {
    // Vaqtinchalik yuqori sifatli kanvas yaratish
    let bMinX = Infinity, bMinY = Infinity, bMaxX = -Infinity, bMaxY = -Infinity;
    if (this.objects.length === 0) {
      bMinX = -400; bMinY = -300; bMaxX = 400; bMaxY = 300;
    } else {
      this.objects.forEach(obj => {
        const b = this.getObjectBounds(obj);
        if (b) {
          if (b.x < bMinX) bMinX = b.x;
          if (b.y < bMinY) bMinY = b.y;
          if (b.x + b.width > bMaxX) bMaxX = b.x + b.width;
          if (b.y + b.height > bMaxY) bMaxY = b.y + b.height;
        }
      });
    }

    const pad = 60;
    const outW = Math.max(600, (bMaxX - bMinX) + pad * 2);
    const outH = Math.max(400, (bMaxY - bMinY) + pad * 2);

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = outW;
    tempCanvas.height = outH;
    const tCtx = tempCanvas.getContext('2d');

    if (!transparent) {
      tCtx.fillStyle = this.theme === 'chalkboard' ? '#0a1b14' : (this.theme === 'dark' ? '#070C14' : '#F8FAFC');
      tCtx.fillRect(0, 0, outW, outH);
    }

    tCtx.save();
    tCtx.translate(-bMinX + pad, -bMinY + pad);

    // Har bir ob'ektni chizish
    this.objects.forEach(obj => {
      if (obj.type === 'sticky') this.drawStickyNote(tCtx, obj);
      else if (obj.type === 'stroke') this.drawStroke(tCtx, obj);
      else if (['rect', 'circle', 'diamond', 'triangle', 'line', 'arrow'].includes(obj.type)) this.drawShape(tCtx, obj);
      else if (obj.type === 'net_node') this.drawNetworkNode(tCtx, obj);
      else if (obj.type === 'text') this.drawText(tCtx, obj);
      else if (obj.type === 'formula') this.drawFormula(tCtx, obj);
      else if (obj.type === 'graph') this.drawGraph(tCtx, obj);
      else if (obj.type === 'quiz_card') this.drawQuizCard(tCtx, obj);
      else if (obj.type === 'image') this.drawImageObj(tCtx, obj);
    });
    tCtx.restore();

    const link = document.createElement('a');
    link.download = `ATT25_Doska_${Date.now()}.png`;
    link.href = tempCanvas.toDataURL('image/png');
    link.click();
  }

  exportJSON() {
    const payload = {
      version: 1,
      appName: 'ATT-25 AI Doska',
      createdAt: new Date().toISOString(),
      theme: this.theme,
      gridMode: this.gridMode,
      objects: this.objects
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `ATT25_Doska_${Date.now()}.json`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  }

  importJSON(jsonText) {
    try {
      const data = JSON.parse(jsonText);
      if (data.objects && Array.isArray(data.objects)) {
        this.saveState();
        this.objects = data.objects;
        if (data.theme) this.setTheme(data.theme);
        if (data.gridMode) this.setGridMode(data.gridMode);
        this.centerBoard();
        return true;
      }
    } catch (e) {
      console.error('Import error:', e);
    }
    return false;
  }

  exportSVG() {
    let bMinX = Infinity, bMinY = Infinity, bMaxX = -Infinity, bMaxY = -Infinity;
    if (this.objects.length === 0) {
      bMinX = 0; bMinY = 0; bMaxX = 800; bMaxY = 600;
    } else {
      this.objects.forEach(obj => {
        const b = this.getObjectBounds(obj);
        if (b) {
          if (b.x < bMinX) bMinX = b.x;
          if (b.y < bMinY) bMinY = b.y;
          if (b.x + b.width > bMaxX) bMaxX = b.x + b.width;
          if (b.y + b.height > bMaxY) bMaxY = b.y + b.height;
        }
      });
    }

    const pad = 40;
    const w = (bMaxX - bMinX) + pad * 2;
    const h = (bMaxY - bMinY) + pad * 2;
    const bgColor = this.theme === 'chalkboard' ? '#0a1b14' : (this.theme === 'dark' ? '#070C14' : '#F8FAFC');

    let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${bMinX - pad} ${bMinY - pad} ${w} ${h}" width="${w}" height="${h}">\n`;
    svg += `  <rect x="${bMinX - pad}" y="${bMinY - pad}" width="${w}" height="${h}" fill="${bgColor}"/>\n`;

    this.objects.forEach(obj => {
      if (obj.type === 'rect') {
        svg += `  <rect x="${obj.x}" y="${obj.y}" width="${obj.width}" height="${obj.height}" rx="6" fill="${obj.filled ? (obj.fillColor || 'rgba(56,189,248,0.2)') : 'none'}" stroke="${obj.color}" stroke-width="${obj.strokeWidth}"/>\n`;
      } else if (obj.type === 'circle') {
        svg += `  <ellipse cx="${obj.x + obj.radiusX}" cy="${obj.y + obj.radiusY}" rx="${Math.abs(obj.radiusX)}" ry="${Math.abs(obj.radiusY)}" fill="${obj.filled ? (obj.fillColor || 'rgba(56,189,248,0.2)') : 'none'}" stroke="${obj.color}" stroke-width="${obj.strokeWidth}"/>\n`;
      } else if (obj.type === 'line' || obj.type === 'arrow') {
        svg += `  <line x1="${obj.x1}" y1="${obj.y1}" x2="${obj.x2}" y2="${obj.y2}" stroke="${obj.color}" stroke-width="${obj.strokeWidth}"/>\n`;
      } else if (obj.type === 'sticky') {
        svg += `  <rect x="${obj.x}" y="${obj.y}" width="${obj.width}" height="${obj.height}" rx="10" fill="${obj.bgColor}"/>\n`;
        svg += `  <text x="${obj.x + 12}" y="${obj.y + 24}" fill="${obj.textColor}" font-family="sans-serif" font-size="13">${obj.text.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</text>\n`;
      } else if (obj.type === 'text') {
        svg += `  <text x="${obj.x}" y="${obj.y + 16}" fill="${obj.color}" font-family="sans-serif" font-size="${obj.fontSize}">${obj.text.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</text>\n`;
      }
    });

    svg += '</svg>';

    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `ATT25_Doska_${Date.now()}.svg`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  }

  /* ==========================================================================
     MAVZU VA TO'R O'ZGARTIRGICHLAR
     ========================================================================== */
  setTheme(themeName) {
    this.theme = themeName;
    document.documentElement.setAttribute('data-theme', themeName);
    const label = document.getElementById('currentThemeLabel');
    if (label) {
      if (themeName === 'chalkboard') label.textContent = 'Maktab Doskasi';
      else if (themeName === 'dark') label.textContent = 'Cyber Dark';
      else if (themeName === 'light') label.textContent = 'Zamonaviy Oq';
    }
  }

  setGridMode(mode) {
    this.gridMode = mode;
    const label = document.getElementById('currentGridLabel');
    if (label) {
      if (mode === 'dots') label.textContent = 'Nuqtalar';
      else if (mode === 'lines') label.textContent = 'Kataklar';
      else if (mode === 'clean') label.textContent = 'Toza doska';
    }
  }
}

// Global eksport
window.WhiteboardEngine = WhiteboardEngine;
