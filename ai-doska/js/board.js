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

    // e) Matnlar va Formulalar (oldinda)
    for (const obj of this.objects) {
      if (obj.type === 'text') this.drawText(ctx, obj);
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

  // 4b. Matematik Formula (KaTeX & Canvas Math)
  drawFormula(ctx, obj) {
    if (!obj.latex) return;
    ctx.save();

    const color = obj.color || '#38BDF8';
    const fontSize = obj.fontSize || 26;

    // Ob'ekt o'lchamini dinamik baholash
    const textLen = obj.latex.length;
    const estWidth = Math.max(160, Math.min(640, textLen * (fontSize * 0.55) + 48));
    const estHeight = Math.max(64, fontSize * 2.5);
    obj.width = obj.width || estWidth;
    obj.height = obj.height || estHeight;

    // Fon qutisi (Chiroyli doska ramkasi)
    ctx.fillStyle = this.theme === 'chalkboard' ? 'rgba(10, 27, 20, 0.75)' : (this.theme === 'dark' ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.95)');
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(obj.x, obj.y, obj.width, obj.height, 8);
    ctx.fill();
    ctx.stroke();

    // Yuqori burchakdagi kichik '∑ FORMULA' nishoni
    ctx.fillStyle = color;
    ctx.font = '700 9px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('∑ FORMULA', obj.x + 8, obj.y + 6);

    // KaTeX orqali SVG tasvir tayyorlash yoki qayta foydalanish
    if (typeof window !== 'undefined' && window.katex) {
      if (!obj._img || obj._lastLatex !== obj.latex || obj._lastColor !== color || obj._lastSize !== fontSize) {
        try {
          const rawHtml = window.katex.renderToString(obj.latex, { displayMode: true, throwOnError: false });
          const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" width="${obj.width}" height="${obj.height}">
            <foreignObject width="100%" height="100%">
              <div xmlns="http://www.w3.org/1999/xhtml" style="color:${color}; font-size:${fontSize}px; display:flex; align-items:center; justify-content:center; height:100%; margin:0; padding:0; font-family:serif;">
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
        ctx.drawImage(obj._img, obj.x, obj.y + 6, obj.width, obj.height - 6);
        ctx.restore();
        return;
      }
    }

    // Fallback Canvas Math matni
    ctx.fillStyle = color;
    ctx.font = `600 ${fontSize}px "Cambria Math", "Latin Modern Math", "Georgia", serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    let cleanText = obj.latex
      .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1 / $2)')
      .replace(/\\sqrt\{([^}]+)\}/g, '√($1)')
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
      .replace(/\^2/g, '²')
      .replace(/\^3/g, '³')
      .replace(/_i/g, 'ᵢ');

    ctx.fillText(cleanText, obj.x + obj.width / 2, obj.y + obj.height / 2 + 4);
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
