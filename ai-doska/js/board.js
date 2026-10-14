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
    this.selectedObjects = [];
    this.undoStack = [];
    this.redoStack = [];
    this.maxHistory = 50;

    // Multi-Select Marquee
    this.marqueeBox = null;
    // Temp Connector (chizilayotgan)
    this.tempConnector = null;
    // Ctrl+F orqali topilgan elementni vaqtinchalik ajratib ko'rsatish
    this.highlightedObject = null;
    this._highlightTimer = null;
    // Nusxa olish buferi (Clipboard)
    this._clipboard = [];

    // Selection o'zgarishini tinglovchi callback
    this._onSelectionChange = null;

    // Ko'p sahifali doska (Multi-Page)
    this.initPages();

    // Rasm dataUrl Registry — undo stackdan og'ir base64 larni ajratib saqlash
    this.imgRegistry = new Map(); // imgId → dataUrl
    this._imgIdCounter = 0;

    // Dirty flag — faqat o'zgarganda render qilinadi
    this.isDirty = true;
    // autoSave debounce timer
    this._autoSaveTimer = null;

    // Laser pointer izi
    this.laserTrail = []; // [{x, y, alpha, time}]

    // O'lchamlarni sozlash va render loop
    this.initCanvasSize();
    this.centerBoard();
    this.startRenderLoop();
  }

  // Backwards-compatible getter & setter for selectedObject
  get selectedObject() {
    return this.selectedObjects.length > 0 ? this.selectedObjects[this.selectedObjects.length - 1] : null;
  }

  set selectedObject(obj) {
    if (!obj) {
      this.selectedObjects = [];
    } else {
      this.selectedObjects = [obj];
    }
    this._notifySelectionChange();
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

    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(dpr, dpr);
    this.isDirty = true;
  }

  centerBoard() {
    this.panX = this.width / 2;
    this.panY = this.height / 2;
    this.zoom = 1.0;
  }

  zoomToFit(padding = 50) {
    if (!this.objects || this.objects.length === 0) {
      this.panTo(0, 0, 1.0);
      return;
    }

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    this.objects.forEach(obj => {
      const b = this.getObjectBounds(obj);
      if (b) {
        if (b.x < minX) minX = b.x;
        if (b.y < minY) minY = b.y;
        if (b.x + b.width > maxX) maxX = b.x + b.width;
        if (b.y + b.height > maxY) maxY = b.y + b.height;
      }
    });

    if (minX === Infinity || maxX === -Infinity) {
      this.panTo(0, 0, 1.0);
      return;
    }

    const contentW = maxX - minX;
    const contentH = maxY - minY;
    const centerX = minX + contentW / 2;
    const centerY = minY + contentH / 2;

    const availableW = this.width - padding * 2;
    const availableH = this.height - padding * 2;

    const scaleX = availableW / (contentW || 1);
    const scaleY = availableH / (contentH || 1);
    const targetZoom = Math.max(this.minZoom, Math.min(1.4, Math.min(scaleX, scaleY)));

    this.panTo(centerX, centerY, targetZoom);
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
     IMAGE REGISTRY — og'ir base64 dataUrls undo stackdan ajratilgan saqlash
     ========================================================================== */
  _registerImg(dataUrl) {
    if (!dataUrl) return null;
    // Agar allaqachon ro'yxatda bo'lsa id ni qaytarish
    for (const [id, url] of this.imgRegistry) {
      if (url === dataUrl) return id;
    }
    const id = `__img_${++this._imgIdCounter}`;
    this.imgRegistry.set(id, dataUrl);
    return id;
  }

  _serializeObjects(objs) {
    // Rasm src va formula img larini registry id ga almashtirish
    return JSON.stringify(objs.map(obj => {
      if (obj.type === 'image' && obj.src && obj.src.startsWith('data:')) {
        return { ...obj, src: this._registerImg(obj.src), _imgRef: true };
      }
      // KaTeX cached image — saqlashda o'chirish (qayta render qilinadi)
      if (obj._img) { const c = { ...obj }; delete c._img; return c; }
      return obj;
    }));
  }

  _deserializeObjects(json) {
    const VALID_TYPES = new Set([
      'stroke','rect','circle','sticky','text','formula','graph','image',
      'net_node','arrow','line','diamond','triangle','quiz_card','connector'
    ]);
    return JSON.parse(json)
      .filter(obj => VALID_TYPES.has(obj.type)) // Schema validatsiya
      .map(obj => {
        if (obj._imgRef && obj.src) {
          return { ...obj, src: this.imgRegistry.get(obj.src) || obj.src, _imgRef: false };
        }
        return obj;
      });
  }

  /* ==========================================================================
     TARIХ VA UNDO / REDO
     ========================================================================== */
  saveState() {
    try {
      const snapshot = this._serializeObjects(this.objects);
      this.undoStack.push(snapshot);
      if (this.undoStack.length > this.maxHistory) {
        this.undoStack.shift();
      }
      this.redoStack = [];
      this.isDirty = true;
      this.updateUndoRedoButtons();
      this.autoSaveToStorage();
    } catch (e) {
      console.error('saveState xatosi:', e);
      if (typeof window.toast === 'function') window.toast('⚠️ Holat saqlashda xatolik yuz berdi');
    }
  }

  undo() {
    if (this.undoStack.length === 0) return;
    try {
      const current = this._serializeObjects(this.objects);
      this.redoStack.push(current);
      const prev = this.undoStack.pop();
      this.objects = this._deserializeObjects(prev);
      this.selectedObjects = [];
      this.isDirty = true;
      this.updateUndoRedoButtons();
      this.autoSaveToStorage();
      this._notifySelectionChange();
    } catch (e) {
      console.error('Undo xatosi:', e);
      if (typeof window.toast === 'function') window.toast('⚠️ Orqaga qaytarishda xatolik');
    }
  }

  redo() {
    if (this.redoStack.length === 0) return;
    try {
      const current = this._serializeObjects(this.objects);
      this.undoStack.push(current);
      const next = this.redoStack.pop();
      this.objects = this._deserializeObjects(next);
      this.selectedObjects = [];
      this.isDirty = true;
      this.updateUndoRedoButtons();
      this.autoSaveToStorage();
      this._notifySelectionChange();
    } catch (e) {
      console.error('Redo xatosi:', e);
      if (typeof window.toast === 'function') window.toast('⚠️ Oldinga qaytarishda xatolik');
    }
  }

  updateUndoRedoButtons() {
    const btnUndo = document.getElementById('btnUndo');
    const btnRedo = document.getElementById('btnRedo');
    if (btnUndo) btnUndo.disabled = this.undoStack.length === 0;
    if (btnRedo) btnRedo.disabled = this.redoStack.length === 0;
  }

  // 600ms debounce — chizish vaqtida har harakatda serialize qilinmaydi
  autoSaveToStorage() {
    clearTimeout(this._autoSaveTimer);
    this._autoSaveTimer = setTimeout(() => {
      try {
        this.saveCurrentPageState();
        const payload = {
          title: document.getElementById('boardTitleInput')?.value || 'Doska',
          theme: this.theme,
          gridMode: this.gridMode,
          currentPageId: this.currentPageId,
          pages: this.pages.map(page => ({
            id: page.id,
            title: page.title,
            panX: page.panX,
            panY: page.panY,
            zoom: page.zoom,
            objects: (page.objects || []).map(obj => {
              if (obj._imgRef && obj.src) return { ...obj, src: this.imgRegistry.get(obj.src) || obj.src };
              if (obj._img) { const c = { ...obj }; delete c._img; return c; }
              return obj;
            })
          })),
          // Orqaga muvofiqlik (Backwards compatibility)
          panX: this.panX,
          panY: this.panY,
          zoom: this.zoom,
          objects: this.objects.map(obj => {
            if (obj._imgRef && obj.src) return { ...obj, src: this.imgRegistry.get(obj.src) || obj.src };
            if (obj._img) { const c = { ...obj }; delete c._img; return c; }
            return obj;
          })
        };
        const jsonStr = JSON.stringify(payload);
        const sizeMB = (jsonStr.length * 2) / (1024 * 1024);
        if (sizeMB > 4 && typeof window.toast === 'function') {
          window.toast(`⚠️ Doska hajmi katta (${sizeMB.toFixed(1)} MB). Saqlash xavfi bor!`, 5000);
        }
        localStorage.setItem('att25_ai_board_save', jsonStr);
      } catch (e) {
        console.error('Auto-save xatosi:', e);
        if (typeof window.toast === 'function') {
          if (e.name === 'QuotaExceededError' || e.code === 22) {
            window.toast('🚨 Xotira to\'ldi! Doskani JSON fayl sifatida saqlang (Eksport → JSON)', 6000);
          } else {
            window.toast('⚠️ Avtomatik saqlashda xatolik yuz berdi');
          }
        }
      }
    }, 600);
  }

  loadFromStorage() {
    const VALID_TYPES = new Set([
      'stroke','rect','circle','sticky','text','formula','graph','image',
      'net_node','arrow','line','diamond','triangle','quiz_card','connector'
    ]);
    try {
      const raw = localStorage.getItem('att25_ai_board_save');
      if (!raw) return false;
      const data = JSON.parse(raw);
      if (data.theme) this.setTheme(data.theme);
      if (data.gridMode) this.setGridMode(data.gridMode);
      const titleEl = document.getElementById('boardTitleInput');
      if (titleEl && data.title) titleEl.value = data.title;

      // Ko'p sahifali format
      if (data.pages && Array.isArray(data.pages) && data.pages.length > 0) {
        this.pages = data.pages.map(p => ({
          id: p.id,
          title: p.title || 'Sahifa',
          panX: p.panX !== undefined ? p.panX : 0,
          panY: p.panY !== undefined ? p.panY : 0,
          zoom: p.zoom !== undefined ? p.zoom : 1.0,
          objects: (p.objects || []).filter(o => VALID_TYPES.has(o.type)),
          undoStack: [],
          redoStack: []
        }));
        this.currentPageId = data.currentPageId || this.pages[0].id;
        const cur = this.getCurrentPage();
        this.objects = cur.objects;
        this.panX = cur.panX;
        this.panY = cur.panY;
        this.zoom = cur.zoom;
        this.updateZoomIndicator();
        this.isDirty = true;
        if (this._onPageChange) this._onPageChange(this.pages, this.currentPageId);
        return true;
      }

      // Legacy bir sahifali format
      if (data.objects && Array.isArray(data.objects)) {
        this.objects = data.objects.filter(obj => VALID_TYPES.has(obj.type));
        if (data.panX !== undefined) this.panX = data.panX;
        if (data.panY !== undefined) this.panY = data.panY;
        if (data.zoom !== undefined) this.zoom = data.zoom;
        this.initPages();
        this.updateZoomIndicator();
        this.isDirty = true;
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
      this.selectedObjects = this.selectedObjects.filter(o => o !== obj);
      // Agar o'chirilgan ob'ektga ulangan connectorlar bo'lsa, ularni ham tozalash
      this.objects = this.objects.filter(o => {
        if (o.type === 'connector' && (o.fromId === obj.id || o.toId === obj.id)) return false;
        return true;
      });
      if (recordState) this.saveState();
    }
  }

  deleteSelected() {
    if (this.selectedObjects.length === 0) return;
    this.saveState();
    const toDelete = [...this.selectedObjects];
    toDelete.forEach(obj => {
      const idx = this.objects.indexOf(obj);
      if (idx !== -1) this.objects.splice(idx, 1);
      this.objects = this.objects.filter(o => {
        if (o.type === 'connector' && (o.fromId === obj.id || o.toId === obj.id)) return false;
        return true;
      });
    });
    this.clearSelection();
    this.isDirty = true;
    this.autoSaveToStorage();
  }

  clearSelection() {
    this.selectedObjects = [];
    this.isDirty = true;
    this._notifySelectionChange();
  }

  selectAll() {
    this.selectedObjects = [...this.objects];
    this.isDirty = true;
    this._notifySelectionChange();
  }

  selectObject(obj, addToSelection = false) {
    if (!obj) {
      this.clearSelection();
      return;
    }
    if (addToSelection) {
      const idx = this.selectedObjects.indexOf(obj);
      if (idx !== -1) {
        this.selectedObjects.splice(idx, 1);
      } else {
        this.selectedObjects.push(obj);
      }
    } else {
      this.selectedObjects = [obj];
    }
    this.isDirty = true;
    this._notifySelectionChange();
  }

  onSelectionChange(callback) {
    this._onSelectionChange = callback;
  }

  _notifySelectionChange() {
    if (typeof this._onSelectionChange === 'function') {
      try {
        this._onSelectionChange(this.selectedObjects);
      } catch (err) {
        console.error('onSelectionChange callback xatosi:', err);
      }
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
    this.selectedObjects = [];
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

    // Agar ob'ekt aylantirilgan (rotation) bo'lsa, nuqtani teskari burchakka aylantirib tekshirish
    if (obj.rotation && !['line', 'arrow', 'stroke', 'connector'].includes(obj.type)) {
      const b = this.getObjectBounds(obj);
      if (b) {
        const cx = b.x + b.width / 2;
        const cy = b.y + b.height / 2;
        const cos = Math.cos(-obj.rotation);
        const sin = Math.sin(-obj.rotation);
        const dx = px - cx;
        const dy = py - cy;
        px = cx + dx * cos - dy * sin;
        py = cy + dx * sin + dy * cos;
      }
    }

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

      case 'connector': {
        const fromObj = this.findObjectById(obj.fromId);
        const toObj = this.findObjectById(obj.toId);
        if (!fromObj || !toObj) return false;
        const p1 = this.getObjectAnchorPoint(fromObj, obj.fromAnchor || 'right');
        const p2 = this.getObjectAnchorPoint(toObj, obj.toAnchor || 'left');
        return this.distToSegment(px, py, p1.x, p1.y, p2.x, p2.y) <= ((obj.strokeWidth || 2) + 12);
      }

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

  findObjectById(id) {
    if (!id) return null;
    return this.objects.find(o => o.id === id) || null;
  }

  /* ==========================================================================
     AQLLI ULANISHLAR UCHUN ANCHOR NUQTALARI (SMART CONNECTOR ANCHORS)
     ========================================================================== */
  getObjectAnchorPoint(obj, anchor = 'center') {
    const b = this.getObjectBounds(obj);
    if (!b) return { x: obj.x || 0, y: obj.y || 0 };
    const cx = b.x + b.width / 2;
    const cy = b.y + b.height / 2;
    let pt = { x: cx, y: cy };

    if (obj.type === 'circle') {
      const rx = Math.abs(obj.radiusX);
      const ry = Math.abs(obj.radiusY);
      switch (anchor) {
        case 'top': pt = { x: cx, y: cy - ry }; break;
        case 'bottom': pt = { x: cx, y: cy + ry }; break;
        case 'left': pt = { x: cx - rx, y: cy }; break;
        case 'right': pt = { x: cx + rx, y: cy }; break;
        default: pt = { x: cx, y: cy }; break;
      }
    } else {
      switch (anchor) {
        case 'top': pt = { x: cx, y: b.y }; break;
        case 'bottom': pt = { x: cx, y: b.y + b.height }; break;
        case 'left': pt = { x: b.x, y: cy }; break;
        case 'right': pt = { x: b.x + b.width, y: cy }; break;
        default: pt = { x: cx, y: cy }; break;
      }
    }

    if (obj.rotation) {
      const cos = Math.cos(obj.rotation);
      const sin = Math.sin(obj.rotation);
      const dx = pt.x - cx;
      const dy = pt.y - cy;
      pt = {
        x: cx + dx * cos - dy * sin,
        y: cy + dx * sin + dy * cos
      };
    }
    return pt;
  }

  getNearestAnchor(obj, px, py) {
    const anchors = ['top', 'right', 'bottom', 'left'];
    let bestAnchor = 'right';
    let bestDist = Infinity;
    for (const a of anchors) {
      const p = this.getObjectAnchorPoint(obj, a);
      const d = Math.hypot(px - p.x, py - p.y);
      if (d < bestDist) {
        bestDist = d;
        bestAnchor = a;
      }
    }
    return { anchor: bestAnchor, dist: bestDist };
  }

  isPointOnRotateHandle(wx, wy, obj) {
    if (!obj || ['line', 'arrow', 'connector', 'stroke'].includes(obj.type)) return false;
    const b = this.getObjectBounds(obj);
    if (!b) return false;
    const cx = b.x + b.width / 2;
    const cy = b.y + b.height / 2;
    const pad = 6 / this.zoom;
    const handleDist = 22 / this.zoom;
    const handleX = cx;
    const handleY = b.y - pad - handleDist;

    let px = wx;
    let py = wy;
    if (obj.rotation) {
      const cos = Math.cos(-obj.rotation);
      const sin = Math.sin(-obj.rotation);
      const dx = wx - cx;
      const dy = wy - cy;
      px = cx + dx * cos - dy * sin;
      py = cy + dx * sin + dy * cos;
    }
    return Math.hypot(px - handleX, py - handleY) <= (14 / this.zoom);
  }

  findObjectsInRect(x1, y1, x2, y2) {
    const rx = Math.min(x1, x2);
    const ry = Math.min(y1, y2);
    const rw = Math.abs(x2 - x1);
    const rh = Math.abs(y2 - y1);
    return this.objects.filter(obj => {
      const b = this.getObjectBounds(obj);
      if (!b) return false;
      return (
        b.x < rx + rw &&
        b.x + b.width > rx &&
        b.y < ry + rh &&
        b.y + b.height > ry
      );
    });
  }

  /* ==========================================================================
     RENDER LOOP VA ASOSIY CHIZISH
     ========================================================================== */
  startRenderLoop() {
    const render = () => {
      // Laser trail vaqt bilan so'nadi — har frame tekshirish kerak
      const hasActiveLaser = this.laserTrail.length > 0;
      if (this.isDirty || hasActiveLaser) {
        this.draw();
        this.drawMinimap();
        this.isDirty = false;
      }
      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
  }

  // isDirty flag ni tashqi modullar (tools.js, app.js) uchun
  markDirty() { this.isDirty = true; }

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
      try {
        if (obj.type === 'sticky') this.drawStickyNote(ctx, obj);
      } catch (e) {
        console.warn('drawStickyNote xatosi:', e);
      }
    }

    // b) Erkin chizmalar (Highlighter & Qalam)
    for (const obj of this.objects) {
      try {
        if (obj.type === 'stroke') this.drawStroke(ctx, obj);
      } catch (e) {
        console.warn('drawStroke xatosi:', e);
      }
    }

    // c) Geometrik shakllar, chiziqlar, strelkalar
    for (const obj of this.objects) {
      try {
        if (['rect', 'circle', 'diamond', 'triangle', 'line', 'arrow'].includes(obj.type)) {
          this.drawShape(ctx, obj);
        }
      } catch (e) {
        console.warn('drawShape xatosi:', e);
      }
    }

    // c.1) Aqlli Bog'lovchilar (Smart Connectors)
    for (const obj of this.objects) {
      try {
        if (obj.type === 'connector') this.drawConnector(ctx, obj);
      } catch (e) {
        console.warn('drawConnector xatosi:', e);
      }
    }

    // d) Tarmoq qurilmalari tugunlari (Network Nodes)
    for (const obj of this.objects) {
      try {
        if (obj.type === 'net_node') this.drawNetworkNode(ctx, obj);
      } catch (e) {
        console.warn('drawNetworkNode xatosi:', e);
      }
    }

    // e) Rasmlar, Grafiklar, Test kartochkalari, Formulalar va Matnlar (oldinda)
    for (const obj of this.objects) {
      try {
        if (obj.type === 'image') this.drawImageObj(ctx, obj);
        else if (obj.type === 'graph') this.drawGraph(ctx, obj);
        else if (obj.type === 'quiz_card') this.drawQuizCard(ctx, obj);
        else if (obj.type === 'text') this.drawText(ctx, obj);
        else if (obj.type === 'formula') this.drawFormula(ctx, obj);
      } catch (e) {
        console.warn('drawItem xatosi:', e);
      }
    }

    // Vaqtinchalik chizilayotgan bog'lovchi
    if (this.tempConnector) {
      this.drawTempConnector(ctx, this.tempConnector);
    }

    // Ctrl+F orqali qidirilgan ob'ektni porlatish
    if (this.highlightedObject) {
      this.drawHighlightGlow(ctx, this.highlightedObject);
    }

    // 4. Tanlangan ob'ekt(lar) atrofidagi ramka
    if (this.selectedObjects && this.selectedObjects.length > 0) {
      this.drawMultiSelection(ctx);
    }

    // Marquee to'rtburchak tanlov ramkasi
    if (this.marqueeBox) {
      this.drawMarqueeBox(ctx, this.marqueeBox);
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

    // O'lchamlarni FAQAT birinchi render da hisoblash (cache) —
    // render vaqtida obj ni mutatsiya qilmaslik uchun _measured ishlatiladi
    if (!obj._measuredWidth || obj._lastText !== obj.text || obj._lastFontSize !== obj.fontSize) {
      let maxW = 0;
      lines.forEach(l => {
        const m = ctx.measureText(l);
        if (m.width > maxW) maxW = m.width;
      });
      obj._measuredWidth = maxW;
      obj._measuredHeight = lines.length * lineHeight;
      obj._lastText = obj.text;
      obj._lastFontSize = obj.fontSize;
      // width/height faqat shu yerda bir marta yangilanadi
      obj.width = maxW;
      obj.height = obj._measuredHeight;
    }
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
      // safeMathEval math-solver.js da aniqlangan — xavfsiz, cache'li evaluator
      if (typeof safeMathEval === 'function') {
        return safeMathEval(obj.funcStr, xVal);
      }
      // Fallback: MathSolver.eval (ham safeMathEval ga yo'naltiradi)
      if (window.MathSolver && typeof window.MathSolver.eval === 'function') {
        return window.MathSolver.eval(obj.funcStr, xVal);
      }
      return null;
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

  // 6. Tanlangan yakka ob'ekt ramkasi (Selection Bounding Box & Rotation Handle)
  drawSelectionBox(ctx, obj) {
    ctx.save();
    ctx.strokeStyle = '#00FF87';
    ctx.lineWidth = 1.5 / this.zoom;
    ctx.setLineDash([4 / this.zoom, 4 / this.zoom]);

    let bounds = this.getObjectBounds(obj);
    if (bounds) {
      const cx = bounds.x + bounds.width / 2;
      const cy = bounds.y + bounds.height / 2;

      // Agar ob'ekt aylangan bo'lsa, ramkani ham birga aylantirish
      if (obj.rotation && !['line', 'arrow', 'connector', 'stroke'].includes(obj.type)) {
        ctx.translate(cx, cy);
        ctx.rotate(obj.rotation);
        ctx.translate(-cx, -cy);
      }

      const pad = 6 / this.zoom;
      ctx.strokeRect(bounds.x - pad, bounds.y - pad, bounds.width + pad * 2, bounds.height + pad * 2);

      // Burchak tutqichlari (Corner Handles)
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

      // Aylantirish tutqichi (Rotation Handle)
      if (!['line', 'arrow', 'connector', 'stroke'].includes(obj.type)) {
        const handleDist = 22 / this.zoom;
        const handleY = bounds.y - pad - handleDist;
        ctx.strokeStyle = '#00FF87';
        ctx.lineWidth = 1.5 / this.zoom;
        ctx.beginPath();
        ctx.moveTo(cx, bounds.y - pad);
        ctx.lineTo(cx, handleY);
        ctx.stroke();

        ctx.fillStyle = '#00FF87';
        ctx.beginPath();
        ctx.arc(cx, handleY, 5 / this.zoom, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#0A1B14';
        ctx.lineWidth = 1 / this.zoom;
        ctx.stroke();
      }

      // Qulflangan bo'lsa (Locked Badge)
      if (obj.locked) {
        ctx.font = `${Math.max(12, 14 / this.zoom)}px sans-serif`;
        ctx.fillText('🔒', bounds.x + bounds.width - 6 / this.zoom, bounds.y - 12 / this.zoom);
      }
    }
    ctx.restore();
  }

  // 7. Bir nechta ob'ekt tanlanganda umumiy guruh ramkasi (Multi-Selection Box)
  drawMultiSelection(ctx) {
    if (!this.selectedObjects || this.selectedObjects.length === 0) return;
    if (this.selectedObjects.length === 1) {
      this.drawSelectionBox(ctx, this.selectedObjects[0]);
      return;
    }

    ctx.save();
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    // Har bir tanlangan elementga nozik kontur
    ctx.strokeStyle = 'rgba(0, 255, 135, 0.45)';
    ctx.lineWidth = 1 / this.zoom;
    ctx.setLineDash([3 / this.zoom, 3 / this.zoom]);

    this.selectedObjects.forEach(obj => {
      const b = this.getObjectBounds(obj);
      if (b) {
        minX = Math.min(minX, b.x);
        minY = Math.min(minY, b.y);
        maxX = Math.max(maxX, b.x + b.width);
        maxY = Math.max(maxY, b.y + b.height);
        ctx.strokeRect(b.x - 3 / this.zoom, b.y - 3 / this.zoom, b.width + 6 / this.zoom, b.height + 6 / this.zoom);
      }
    });

    if (minX !== Infinity) {
      const pad = 10 / this.zoom;
      const w = maxX - minX + pad * 2;
      const h = maxY - minY + pad * 2;
      const bx = minX - pad;
      const by = minY - pad;

      ctx.strokeStyle = '#00FF87';
      ctx.lineWidth = 1.5 / this.zoom;
      ctx.setLineDash([5 / this.zoom, 4 / this.zoom]);
      ctx.strokeRect(bx, by, w, h);

      // Burchak tutqichlari
      ctx.setLineDash([]);
      ctx.fillStyle = '#00FF87';
      const hs = 6 / this.zoom;
      [
        { x: bx, y: by },
        { x: bx + w, y: by },
        { x: bx + w, y: by + h },
        { x: bx, y: by + h }
      ].forEach(p => {
        ctx.fillRect(p.x - hs / 2, p.y - hs / 2, hs, hs);
      });

      // Nechta element tanlanganligi badge'i
      ctx.font = `bold ${Math.max(10, 11 / this.zoom)}px "Plus Jakarta Sans", sans-serif`;
      const badgeText = `${this.selectedObjects.length} ta ob'ekt tanlandi`;
      const textW = ctx.measureText(badgeText).width;
      const bgW = textW + 16 / this.zoom;
      const bgH = 20 / this.zoom;
      ctx.fillStyle = '#0A1B14';
      ctx.fillRect(bx, by - bgH - 4 / this.zoom, bgW, bgH);
      ctx.strokeStyle = '#00FF87';
      ctx.lineWidth = 1 / this.zoom;
      ctx.strokeRect(bx, by - bgH - 4 / this.zoom, bgW, bgH);
      ctx.fillStyle = '#00FF87';
      ctx.textBaseline = 'middle';
      ctx.fillText(badgeText, bx + 8 / this.zoom, by - bgH / 2 - 4 / this.zoom);
    }

    ctx.restore();
  }

  // 8. Marquee (To'rtburchak tanlash ramkasi)
  drawMarqueeBox(ctx, box) {
    if (!box) return;
    ctx.save();
    ctx.strokeStyle = '#00FF87';
    ctx.fillStyle = 'rgba(0, 255, 135, 0.08)';
    ctx.lineWidth = 1 / this.zoom;
    ctx.setLineDash([4 / this.zoom, 4 / this.zoom]);
    const x = Math.min(box.x1, box.x2);
    const y = Math.min(box.y1, box.y2);
    const w = Math.abs(box.x2 - box.x1);
    const h = Math.abs(box.y2 - box.y1);
    ctx.fillRect(x, y, w, h);
    ctx.strokeRect(x, y, w, h);
    ctx.restore();
  }

  // 9. Qidiruv orqali topilgan ob'ekt atrofidagi porlovchi nishon
  drawHighlightGlow(ctx, obj) {
    const b = this.getObjectBounds(obj);
    if (!b) return;
    ctx.save();
    const pad = 10 / this.zoom;
    ctx.strokeStyle = '#FACC15';
    ctx.lineWidth = 3 / this.zoom;
    ctx.shadowColor = '#FACC15';
    ctx.shadowBlur = 16;
    ctx.setLineDash([]);
    ctx.strokeRect(b.x - pad, b.y - pad, b.width + pad * 2, b.height + pad * 2);
    ctx.restore();
  }

  // 10. Aqlli Bog'lovchi (Smart Connector)
  drawConnector(ctx, conn) {
    const fromObj = this.findObjectById(conn.fromId);
    const toObj = this.findObjectById(conn.toId);
    if (!fromObj || !toObj) return;

    const p1 = this.getObjectAnchorPoint(fromObj, conn.fromAnchor || 'right');
    const p2 = this.getObjectAnchorPoint(toObj, conn.toAnchor || 'left');

    ctx.save();
    ctx.strokeStyle = conn.color || '#00FF87';
    ctx.lineWidth = conn.strokeWidth || 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    if (conn.style === 'dashed') {
      ctx.setLineDash([6 / this.zoom, 4 / this.zoom]);
    }

    // Bezier egri chizig'ining boshqaruv nuqtalari
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    let cp1 = { ...p1 };
    let cp2 = { ...p2 };
    const offset = Math.max(30, Math.min(Math.abs(dx) * 0.5, 120));

    if (conn.fromAnchor === 'right') cp1.x += offset;
    else if (conn.fromAnchor === 'left') cp1.x -= offset;
    else if (conn.fromAnchor === 'bottom') cp1.y += offset;
    else if (conn.fromAnchor === 'top') cp1.y -= offset;
    else cp1.x += dx * 0.25;

    if (conn.toAnchor === 'right') cp2.x += offset;
    else if (conn.toAnchor === 'left') cp2.x -= offset;
    else if (conn.toAnchor === 'bottom') cp2.y += offset;
    else if (conn.toAnchor === 'top') cp2.y -= offset;
    else cp2.x -= dx * 0.25;

    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, p2.x, p2.y);
    ctx.stroke();

    // Arrowhead at p2
    if (conn.hasArrow !== false) {
      const tdx = p2.x - cp2.x;
      const tdy = p2.y - cp2.y;
      const len = Math.hypot(tdx, tdy);
      if (len > 0.1) {
        const angle = Math.atan2(tdy, tdx);
        const arrowLen = Math.max(10, (conn.strokeWidth || 2) * 4);
        const arrowAngle = Math.PI / 7;

        ctx.setLineDash([]);
        ctx.fillStyle = conn.color || '#00FF87';
        ctx.beginPath();
        ctx.moveTo(p2.x, p2.y);
        ctx.lineTo(
          p2.x - arrowLen * Math.cos(angle - arrowAngle),
          p2.y - arrowLen * Math.sin(angle - arrowAngle)
        );
        ctx.lineTo(
          p2.x - arrowLen * Math.cos(angle + arrowAngle),
          p2.y - arrowLen * Math.sin(angle + arrowAngle)
        );
        ctx.closePath();
        ctx.fill();
      }
    }

    // Anchor visual dots if selected
    if (this.selectedObjects && this.selectedObjects.includes(conn)) {
      ctx.fillStyle = '#00FF87';
      ctx.beginPath();
      ctx.arc(p1.x, p1.y, 4 / this.zoom, 0, Math.PI * 2);
      ctx.arc(p2.x, p2.y, 4 / this.zoom, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  // 11. Chizilayotgan vaqtinchalik ulanish
  drawTempConnector(ctx, temp) {
    if (!temp || !temp.p1 || !temp.p2) return;
    ctx.save();
    ctx.strokeStyle = '#00FF87';
    ctx.lineWidth = 2 / this.zoom;
    ctx.setLineDash([5 / this.zoom, 4 / this.zoom]);
    ctx.beginPath();
    ctx.moveTo(temp.p1.x, temp.p1.y);
    ctx.lineTo(temp.p2.x, temp.p2.y);
    ctx.stroke();

    ctx.setLineDash([]);
    ctx.fillStyle = '#00FF87';
    ctx.beginPath();
    ctx.arc(temp.p1.x, temp.p1.y, 4 / this.zoom, 0, Math.PI * 2);
    ctx.arc(temp.p2.x, temp.p2.y, 4 / this.zoom, 0, Math.PI * 2);
    ctx.fill();
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
      case 'connector': {
        const fromObj = this.findObjectById(obj.fromId);
        const toObj = this.findObjectById(obj.toId);
        if (!fromObj || !toObj) return null;
        const p1 = this.getObjectAnchorPoint(fromObj, obj.fromAnchor || 'right');
        const p2 = this.getObjectAnchorPoint(toObj, obj.toAnchor || 'left');
        return {
          x: Math.min(p1.x, p2.x),
          y: Math.min(p1.y, p2.y),
          width: Math.abs(p2.x - p1.x) || 12,
          height: Math.abs(p2.y - p1.y) || 12
        };
      }
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
      else if (obj.type === 'connector') this.drawConnector(tCtx, obj);
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

  /* ==========================================================================
     PDF EKSPORT (JSPDF ORQALI)
     ========================================================================== */
  async exportPDF(allPages = false) {
    if (!window.jspdf || !window.jspdf.jsPDF) {
      alert("jsPDF kutubxonasi yuklanmoqda yoki mavjud emas.");
      return;
    }

    const { jsPDF } = window.jspdf;
    const titleEl = document.getElementById('boardTitleInput');
    const boardTitle = titleEl ? titleEl.value.trim() : 'ATT25_Doska';

    if (allPages && this.pages && this.pages.length > 1) {
      // Ko'p sahifali to'liq loyihani PDF ga eksport qilish
      this.saveCurrentPageState();
      const origPageId = this.currentPageId;
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [1920, 1080] });

      for (let i = 0; i < this.pages.length; i++) {
        if (i > 0) pdf.addPage([1920, 1080], 'landscape');
        const page = this.pages[i];
        const dataUrl = await this.renderPageToDataURL(page, 1920, 1080);
        pdf.addImage(dataUrl, 'PNG', 0, 0, 1920, 1080);
        pdf.setFontSize(14);
        pdf.setTextColor(140, 150, 160);
        pdf.text(`${boardTitle} — ${page.title || ('Sahifa ' + (i + 1))}`, 40, 1050);
      }
      this.switchPage(origPageId);
      pdf.save(`${boardTitle}_Toliq_${Date.now()}.pdf`);
    } else {
      // Joriy sahifani yuqori sifatli PDF ga eksport qilish
      const dataUrl = await this.renderPageToDataURL(this.getCurrentPage(), 1920, 1080);
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [1920, 1080] });
      pdf.addImage(dataUrl, 'PNG', 0, 0, 1920, 1080);
      pdf.save(`${boardTitle}_${Date.now()}.pdf`);
    }
  }

  async renderPageToDataURL(page, width = 1920, height = 1080) {
    const offCanvas = document.createElement('canvas');
    offCanvas.width = width;
    offCanvas.height = height;
    const offCtx = offCanvas.getContext('2d');

    // Fonni to'ldirish
    offCtx.fillStyle = this.theme === 'chalkboard' ? '#0a1b14' : (this.theme === 'dark' ? '#070C14' : '#F8FAFC');
    offCtx.fillRect(0, 0, width, height);

    const objs = page.objects || [];
    if (objs.length > 0) {
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      objs.forEach(o => {
        const b = this.getObjectBounds(o);
        if (b) {
          minX = Math.min(minX, b.x);
          minY = Math.min(minY, b.y);
          maxX = Math.max(maxX, b.x + b.width);
          maxY = Math.max(maxY, b.y + b.height);
        }
      });
      if (minX !== Infinity) {
        const pad = 60;
        minX -= pad; minY -= pad; maxX += pad; maxY += pad;
        const bw = Math.max(100, maxX - minX);
        const bh = Math.max(100, maxY - minY);
        const scale = Math.min(width / bw, height / bh, 1.8);
        const ox = (width - bw * scale) / 2 - minX * scale;
        const oy = (height - bh * scale) / 2 - minY * scale;

        offCtx.save();
        offCtx.translate(ox, oy);
        offCtx.scale(scale, scale);

        // Ob'ektlarni chizish
        objs.forEach(obj => {
          if (obj.type === 'sticky') this.drawStickyNote(offCtx, obj);
          else if (obj.type === 'stroke') this.drawStroke(offCtx, obj);
          else if (['rect', 'circle', 'diamond', 'triangle', 'line', 'arrow'].includes(obj.type)) this.drawShape(offCtx, obj);
          else if (obj.type === 'connector') this.drawConnector(offCtx, obj);
          else if (obj.type === 'net_node') this.drawNetworkNode(offCtx, obj);
          else if (obj.type === 'text') this.drawText(offCtx, obj);
          else if (obj.type === 'formula') this.drawFormula(offCtx, obj);
          else if (obj.type === 'graph') this.drawGraph(offCtx, obj);
          else if (obj.type === 'quiz_card') this.drawQuizCard(offCtx, obj);
          else if (obj.type === 'image') this.drawImageObj(offCtx, obj);
        });

        offCtx.restore();
      }
    }

    return offCanvas.toDataURL('image/png');
  }

  exportJSON() {
    this.saveCurrentPageState();
    const payload = {
      version: 2,
      appName: 'ATT-25 AI Doska',
      createdAt: new Date().toISOString(),
      theme: this.theme,
      gridMode: this.gridMode,
      currentPageId: this.currentPageId,
      pages: this.pages.map(page => ({
        id: page.id,
        title: page.title,
        panX: page.panX,
        panY: page.panY,
        zoom: page.zoom,
        objects: page.objects
      })),
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
    const VALID_TYPES = new Set([
      'stroke','rect','circle','sticky','text','formula','graph','image',
      'net_node','arrow','line','diamond','triangle','quiz_card','connector'
    ]);
    try {
      const data = JSON.parse(jsonText);
      this.saveState();
      if (data.theme) this.setTheme(data.theme);
      if (data.gridMode) this.setGridMode(data.gridMode);

      if (data.pages && Array.isArray(data.pages) && data.pages.length > 0) {
        this.pages = data.pages.map(p => ({
          id: p.id,
          title: p.title || 'Sahifa',
          panX: p.panX !== undefined ? p.panX : 0,
          panY: p.panY !== undefined ? p.panY : 0,
          zoom: p.zoom !== undefined ? p.zoom : 1.0,
          objects: (p.objects || []).filter(o => VALID_TYPES.has(o.type)),
          undoStack: [],
          redoStack: []
        }));
        this.currentPageId = data.currentPageId || this.pages[0].id;
        const cur = this.getCurrentPage();
        this.objects = cur.objects;
        this.panX = cur.panX;
        this.panY = cur.panY;
        this.zoom = cur.zoom;
        if (this._onPageChange) this._onPageChange(this.pages, this.currentPageId);
      } else if (data.objects && Array.isArray(data.objects)) {
        this.objects = data.objects.filter(o => VALID_TYPES.has(o.type));
        this.initPages();
      }
      this.centerBoard();
      this.isDirty = true;
      this.autoSaveToStorage();
      return true;
    } catch (e) {
      console.error('Import error:', e);
    }
    return false;
  }

  /* ==========================================================================
     KO'P SAHIFA BOSHQARUVI (MULTI-PAGE BOARD)
     ========================================================================== */
  initPages() {
    this.pages = [
      {
        id: 'page_1',
        title: 'Sahifa 1',
        objects: this.objects || [],
        panX: this.panX || 0,
        panY: this.panY || 0,
        zoom: this.zoom || 1.0,
        undoStack: [],
        redoStack: []
      }
    ];
    this.currentPageId = 'page_1';
  }

  getCurrentPage() {
    return this.pages.find(p => p.id === this.currentPageId) || this.pages[0];
  }

  addPage(title = null) {
    this.saveCurrentPageState();
    const newIdx = this.pages.length + 1;
    const pageId = 'page_' + Date.now().toString(36);
    const newPage = {
      id: pageId,
      title: title || `Sahifa ${newIdx}`,
      objects: [],
      panX: 0,
      panY: 0,
      zoom: 1.0,
      undoStack: [],
      redoStack: []
    };
    this.pages.push(newPage);
    this.switchPage(pageId);
    return newPage;
  }

  saveCurrentPageState() {
    const cur = this.getCurrentPage();
    if (cur) {
      cur.objects = this.objects;
      cur.panX = this.panX;
      cur.panY = this.panY;
      cur.zoom = this.zoom;
      cur.undoStack = this.undoStack;
      cur.redoStack = this.redoStack;
    }
  }

  switchPage(pageId) {
    if (pageId === this.currentPageId && this.objects === this.getCurrentPage().objects) return;
    this.saveCurrentPageState();
    const target = this.pages.find(p => p.id === pageId);
    if (!target) return;

    this.currentPageId = pageId;
    this.objects = target.objects || [];
    this.panX = target.panX !== undefined ? target.panX : 0;
    this.panY = target.panY !== undefined ? target.panY : 0;
    this.zoom = target.zoom !== undefined ? target.zoom : 1.0;
    this.undoStack = target.undoStack || [];
    this.redoStack = target.redoStack || [];
    this.selectedObjects = [];
    this.updateZoomIndicator();
    this.updateUndoRedoButtons();
    this.isDirty = true;
    this.autoSaveToStorage();
    this._notifySelectionChange();
    if (this._onPageChange) this._onPageChange(this.pages, this.currentPageId);
  }

  deletePage(pageId) {
    if (this.pages.length <= 1) {
      if (typeof window.toast === 'function') window.toast("Kamida bitta sahifa qolishi kerak");
      return false;
    }
    const idx = this.pages.findIndex(p => p.id === pageId);
    if (idx === -1) return false;

    this.pages.splice(idx, 1);
    if (this.currentPageId === pageId) {
      const nextIdx = Math.max(0, idx - 1);
      const target = this.pages[nextIdx];
      this.currentPageId = target.id;
      this.objects = target.objects || [];
      this.panX = target.panX || 0;
      this.panY = target.panY || 0;
      this.zoom = target.zoom || 1.0;
      this.undoStack = target.undoStack || [];
      this.redoStack = target.redoStack || [];
      this.selectedObjects = [];
    }
    this.isDirty = true;
    this.autoSaveToStorage();
    this._notifySelectionChange();
    if (this._onPageChange) this._onPageChange(this.pages, this.currentPageId);
    return true;
  }

  renamePage(pageId, newTitle) {
    const p = this.pages.find(item => item.id === pageId);
    if (p && newTitle && newTitle.trim()) {
      p.title = newTitle.trim();
      this.autoSaveToStorage();
      if (this._onPageChange) this._onPageChange(this.pages, this.currentPageId);
    }
  }

  onPageChange(cb) {
    this._onPageChange = cb;
  }

  /* ==========================================================================
     QATLAM VA BUFER AMALLARI (LAYERS & CLIPBOARD)
     ========================================================================== */
  bringToFront(obj) {
    const target = obj || this.selectedObject;
    if (!target) return;
    const idx = this.objects.indexOf(target);
    if (idx !== -1 && idx < this.objects.length - 1) {
      this.saveState();
      this.objects.splice(idx, 1);
      this.objects.push(target);
      this.markDirty();
      if (typeof window.toast === 'function') window.toast("Eng oldingi qatlamga o'tkazildi");
    }
  }

  sendToBack(obj) {
    const target = obj || this.selectedObject;
    if (!target) return;
    const idx = this.objects.indexOf(target);
    if (idx > 0) {
      this.saveState();
      this.objects.splice(idx, 1);
      this.objects.unshift(target);
      this.markDirty();
      if (typeof window.toast === 'function') window.toast("Eng orqa qatlamga o'tkazildi");
    }
  }

  duplicateSelected() {
    if (this.selectedObjects.length === 0) return;
    this.saveState();
    const newSelected = [];
    this.selectedObjects.forEach(orig => {
      const clone = JSON.parse(JSON.stringify(orig));
      clone.id = 'obj_' + Date.now() + '_' + Math.floor(Math.random() * 10000);
      if (clone.x !== undefined) clone.x += 30;
      if (clone.y !== undefined) clone.y += 30;
      if (clone.x1 !== undefined) { clone.x1 += 30; clone.x2 += 30; clone.y1 += 30; clone.y2 += 30; }
      if (clone.points) clone.points.forEach(p => { p.x += 30; p.y += 30; });
      this.objects.push(clone);
      newSelected.push(clone);
    });
    this.selectedObjects = newSelected;
    this.markDirty();
    this._notifySelectionChange();
    if (typeof window.toast === 'function') window.toast(`${newSelected.length} ta ob'ekt nusxalandi`);
  }

  copySelected() {
    if (this.selectedObjects.length === 0) return;
    this._clipboard = this.selectedObjects.map(o => JSON.parse(JSON.stringify(o)));
    if (typeof window.toast === 'function') window.toast(`${this._clipboard.length} ta ob'ekt nusxalandi`);
  }

  paste() {
    if (!this._clipboard || this._clipboard.length === 0) return;
    this.saveState();
    const newSelected = [];
    this._clipboard.forEach(orig => {
      const clone = JSON.parse(JSON.stringify(orig));
      clone.id = 'obj_' + Date.now() + '_' + Math.floor(Math.random() * 10000);
      if (clone.x !== undefined) clone.x += 40;
      if (clone.y !== undefined) clone.y += 40;
      if (clone.x1 !== undefined) { clone.x1 += 40; clone.x2 += 40; clone.y1 += 40; clone.y2 += 40; }
      if (clone.points) clone.points.forEach(p => { p.x += 40; p.y += 40; });
      this.objects.push(clone);
      newSelected.push(clone);
    });
    this.selectedObjects = newSelected;
    this.markDirty();
    this._notifySelectionChange();
    if (typeof window.toast === 'function') window.toast(`${newSelected.length} ta ob'ekt qo'yildi`);
  }

  toggleLockSelected() {
    if (this.selectedObjects.length === 0) return;
    const anyUnlocked = this.selectedObjects.some(o => !o.locked);
    this.selectedObjects.forEach(o => { o.locked = anyUnlocked; });
    this.saveState();
    this.markDirty();
    if (typeof window.toast === 'function') {
      window.toast(anyUnlocked ? "🔒 Ob'ekt(lar) qulflandi" : "🔓 Ob'ekt(lar) qulfdan ochildi");
    }
  }

  /* ==========================================================================
     QIDIRUV VA ANIMATSIYALI KO'RISH (SEARCH & SMOOTH PAN)
     ========================================================================== */
  findObjects(query) {
    if (!query || !query.trim()) return [];
    const q = query.trim().toLowerCase();
    const results = [];

    this.objects.forEach((obj, idx) => {
      let matchedText = '';
      if (obj.text && obj.text.toLowerCase().includes(q)) matchedText = obj.text;
      else if (obj.question && obj.question.toLowerCase().includes(q)) matchedText = obj.question;
      else if (obj.options && obj.options.some(opt => opt.toLowerCase().includes(q))) matchedText = obj.options.join(', ');
      else if (obj.latex && obj.latex.toLowerCase().includes(q)) matchedText = obj.latex;
      else if (obj.label && obj.label.toLowerCase().includes(q)) matchedText = obj.label;
      else if (obj.funcStr && obj.funcStr.toLowerCase().includes(q)) matchedText = obj.funcStr;
      else if (obj.code && obj.code.toLowerCase().includes(q)) matchedText = obj.code;

      if (matchedText) {
        results.push({ obj, index: idx, matchedText });
      }
    });
    return results;
  }

  panTo(targetX, targetY, targetZoom = null) {
    const finalZoom = targetZoom !== null ? targetZoom : this.zoom;
    const targetPanX = this.width / 2 - targetX * finalZoom;
    const targetPanY = this.height / 2 - targetY * finalZoom;

    const startPanX = this.panX;
    const startPanY = this.panY;
    const startZoom = this.zoom;
    const startTime = performance.now();
    const duration = 350;

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const ease = 1 - Math.pow(1 - progress, 3);

      this.panX = startPanX + (targetPanX - startPanX) * ease;
      this.panY = startPanY + (targetPanY - startPanY) * ease;
      this.zoom = startZoom + (finalZoom - startZoom) * ease;
      this.updateZoomIndicator();
      this.markDirty();

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }

  highlightObject(obj) {
    this.highlightedObject = obj;
    this.markDirty();
    clearTimeout(this._highlightTimer);
    this._highlightTimer = setTimeout(() => {
      this.highlightedObject = null;
      this.markDirty();
    }, 2500);
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

    const esc = (str) => (str || '').toString().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

    this.objects.forEach(obj => {
      if (obj.type === 'stroke' && obj.points && obj.points.length > 1) {
        let d = `M ${obj.points[0].x} ${obj.points[0].y}`;
        for (let i = 1; i < obj.points.length; i++) {
          d += ` L ${obj.points[i].x} ${obj.points[i].y}`;
        }
        const opacity = obj.isHighlighter ? '0.4' : '1';
        svg += `  <path d="${d}" fill="none" stroke="${esc(obj.color || '#F8FAFC')}" stroke-width="${obj.width || 3}" stroke-linecap="round" stroke-linejoin="round" opacity="${opacity}"/>\n`;
      } else if (obj.type === 'rect') {
        svg += `  <rect x="${obj.x}" y="${obj.y}" width="${obj.width}" height="${obj.height}" rx="6" fill="${obj.filled ? (esc(obj.fillColor) || 'rgba(56,189,248,0.2)') : 'none'}" stroke="${esc(obj.color || '#38BDF8')}" stroke-width="${obj.strokeWidth || 2}"/>\n`;
      } else if (obj.type === 'circle') {
        svg += `  <ellipse cx="${obj.x + obj.radiusX}" cy="${obj.y + obj.radiusY}" rx="${Math.abs(obj.radiusX)}" ry="${Math.abs(obj.radiusY)}" fill="${obj.filled ? (esc(obj.fillColor) || 'rgba(56,189,248,0.2)') : 'none'}" stroke="${esc(obj.color || '#38BDF8')}" stroke-width="${obj.strokeWidth || 2}"/>\n`;
      } else if (obj.type === 'diamond') {
        const cx = obj.x + obj.width / 2;
        const cy = obj.y + obj.height / 2;
        const pts = `${cx},${obj.y} ${obj.x + obj.width},${cy} ${cx},${obj.y + obj.height} ${obj.x},${cy}`;
        svg += `  <polygon points="${pts}" fill="${obj.filled ? (esc(obj.fillColor) || 'rgba(56,189,248,0.2)') : 'none'}" stroke="${esc(obj.color || '#38BDF8')}" stroke-width="${obj.strokeWidth || 2}"/>\n`;
      } else if (obj.type === 'triangle') {
        const pts = `${obj.x + obj.width / 2},${obj.y} ${obj.x + obj.width},${obj.y + obj.height} ${obj.x},${obj.y + obj.height}`;
        svg += `  <polygon points="${pts}" fill="${obj.filled ? (esc(obj.fillColor) || 'rgba(56,189,248,0.2)') : 'none'}" stroke="${esc(obj.color || '#38BDF8')}" stroke-width="${obj.strokeWidth || 2}"/>\n`;
      } else if (obj.type === 'line' || obj.type === 'arrow') {
        svg += `  <line x1="${obj.x1}" y1="${obj.y1}" x2="${obj.x2}" y2="${obj.y2}" stroke="${esc(obj.color || '#38BDF8')}" stroke-width="${obj.strokeWidth || 2}"/>\n`;
      } else if (obj.type === 'connector') {
        svg += `  <line x1="${obj.x1}" y1="${obj.y1}" x2="${obj.x2}" y2="${obj.y2}" stroke="${esc(obj.color || '#64748B')}" stroke-width="${obj.strokeWidth || 2}" stroke-dasharray="6 4"/>\n`;
      } else if (obj.type === 'net_node') {
        svg += `  <rect x="${obj.x - 30}" y="${obj.y - 20}" width="60" height="40" rx="8" fill="rgba(56,189,248,0.2)" stroke="#38BDF8" stroke-width="2"/>\n`;
        svg += `  <text x="${obj.x}" y="${obj.y + 4}" fill="#F8FAFC" font-family="sans-serif" font-size="11" text-anchor="middle">${esc(obj.label || obj.nodeType)}</text>\n`;
        if (obj.ip) svg += `  <text x="${obj.x}" y="${obj.y + 28}" fill="#94A3B8" font-family="monospace" font-size="9" text-anchor="middle">${esc(obj.ip)}</text>\n`;
      } else if (obj.type === 'sticky') {
        svg += `  <rect x="${obj.x}" y="${obj.y}" width="${obj.width}" height="${obj.height}" rx="10" fill="${esc(obj.bgColor || '#FEF08A')}"/>\n`;
        svg += `  <text x="${obj.x + 12}" y="${obj.y + 24}" fill="${esc(obj.textColor || '#1E293B')}" font-family="sans-serif" font-size="13">${esc(obj.text)}</text>\n`;
      } else if (obj.type === 'text') {
        svg += `  <text x="${obj.x}" y="${obj.y + 16}" fill="${esc(obj.color || '#F8FAFC')}" font-family="sans-serif" font-size="${obj.fontSize || 16}">${esc(obj.text)}</text>\n`;
      } else if (obj.type === 'formula') {
        svg += `  <text x="${obj.x}" y="${obj.y + 20}" fill="${esc(obj.color || '#38BDF8')}" font-family="serif" font-size="${obj.fontSize || 20}" font-style="italic">${esc(obj.latex)}</text>\n`;
      } else if (obj.type === 'quiz_card') {
        svg += `  <rect x="${obj.x}" y="${obj.y}" width="${obj.width || 320}" height="${obj.height || 220}" rx="12" fill="#1E293B" stroke="#6366F1" stroke-width="2"/>\n`;
        svg += `  <text x="${obj.x + 14}" y="${obj.y + 28}" fill="#F8FAFC" font-family="sans-serif" font-size="13" font-weight="bold">${esc(obj.question || 'Test')}</text>\n`;
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
