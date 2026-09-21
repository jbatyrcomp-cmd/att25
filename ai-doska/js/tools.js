/* ==========================================================================
   ATT-25 AI DOSKA — TOOLS & INTERACTION MANAGER (tools.js)
   Qalam, Marker, Shakllar, Stikerlar, Matn, O'chirg'ich, Pointer boshqaruvi
   ========================================================================== */

class ToolManager {
  constructor(engine) {
    this.engine = engine;
    this.viewport = document.getElementById('canvasViewport');

    // Joriy faol asbob
    this.currentTool = 'select'; // select, pan, pen, highlighter, eraser, shape_rect, shape_circle, shape_diamond, shape_triangle, shape_line, shape_arrow, text, sticky, net_node, laser
    this.currentShape = 'shape_rect';
    this.currentNodeType = 'router';

    // Stil sozlamalari
    this.currentColor = '#00FF87';
    this.currentSize = 4;
    this.isFilled = false;

    // Harakat holati
    this.isPointerDown = false;
    this.startScreenPos = { x: 0, y: 0 };
    this.startWorldPos = { x: 0, y: 0 };
    this.currentDrawingObject = null;
    this.isDraggingObject = false;
    this.dragOffset = { x: 0, y: 0 };
    this.spacebarHeld = false;

    // Matn tahrirlagich overlay
    this.textOverlay = document.getElementById('textEditorOverlay');
    this.textInput = document.getElementById('inlineTextInput');
    this.activeTextObj = null;

    // Laser pointer elementi
    this.laserDot = document.getElementById('laserPointerDot');

    this.bindCanvasEvents();
    this.bindToolbarEvents();
    this.bindKeyboardShortcuts();
  }

  /* ==========================================================================
     ASOSIY CANVAS HODISALARI (POINTER DOWN, MOVE, UP)
     ========================================================================== */
  bindCanvasEvents() {
    const canvas = this.engine.canvas;

    canvas.addEventListener('pointerdown', (e) => this.onPointerDown(e));
    window.addEventListener('pointermove', (e) => this.onPointerMove(e));
    window.addEventListener('pointerup', (e) => this.onPointerUp(e));

    // Sichqoncha g'ildiragi orqali masshtablash (Zoom) va siljitish
    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      if (e.ctrlKey || e.metaKey) {
        // Zoom in / out
        const factor = e.deltaY < 0 ? 1.1 : 0.9;
        this.engine.setZoom(this.engine.zoom * factor, e.clientX, e.clientY);
      } else {
        // 2D Pan (Touchpad yoki g'ildirak)
        this.engine.panX -= e.deltaX;
        this.engine.panY -= e.deltaY;
      }
    }, { passive: false });

    // Kontekst menyuni bloklash (chizish qulay bo'lishi uchun)
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  onPointerDown(e) {
    if (e.target !== this.engine.canvas) return;
    this.isPointerDown = true;
    this.startScreenPos = { x: e.clientX, y: e.clientY };
    this.startWorldPos = this.engine.screenToWorld(e.clientX, e.clientY);

    // O'rta tugma yoki Bo'sh joy (Space) bosilgan bo'lsa Pan qilish
    if (e.button === 1 || this.spacebarHeld || this.currentTool === 'pan') {
      this.viewport.className = 'canvas-viewport mode-panning';
      return;
    }

    const wx = this.startWorldPos.x;
    const wy = this.startWorldPos.y;

    // 1. Tanlash vositasi (Select)
    if (this.currentTool === 'select') {
      const hit = this.engine.hitTest(wx, wy);
      if (hit) {
        this.engine.selectedObject = hit;
        this.isDraggingObject = true;
        this.dragOffset = {
          x: wx - (hit.x !== undefined ? hit.x : hit.x1),
          y: wy - (hit.y !== undefined ? hit.y : hit.y1)
        };
      } else {
        this.engine.selectedObject = null;
      }
      return;
    }

    // 2. Qalam yoki Marker (Pen / Highlighter)
    if (this.currentTool === 'pen' || this.currentTool === 'highlighter') {
      const isHighlighter = this.currentTool === 'highlighter';
      this.currentDrawingObject = {
        type: 'stroke',
        points: [{ x: wx, y: wy }],
        color: this.currentColor,
        width: this.currentSize,
        isHighlighter: isHighlighter
      };
      this.engine.addObject(this.currentDrawingObject, false);
      return;
    }

    // 3. O'chirg'ich (Eraser)
    if (this.currentTool === 'eraser') {
      const hit = this.engine.hitTest(wx, wy);
      if (hit) {
        this.engine.removeObject(hit);
      }
      return;
    }

    // 4. Geometrik Shakllar
    if (this.currentTool.startsWith('shape_')) {
      const shapeType = this.currentTool.replace('shape_', '');
      const fillColor = this.isFilled ? this.getFillColor() : 'transparent';

      if (shapeType === 'rect') {
        this.currentDrawingObject = {
          type: 'rect',
          x: wx, y: wy, width: 1, height: 1,
          color: this.currentColor, strokeWidth: this.currentSize,
          filled: this.isFilled, fillColor: fillColor
        };
      } else if (shapeType === 'circle') {
        this.currentDrawingObject = {
          type: 'circle',
          x: wx, y: wy, radiusX: 1, radiusY: 1,
          color: this.currentColor, strokeWidth: this.currentSize,
          filled: this.isFilled, fillColor: fillColor
        };
      } else if (shapeType === 'diamond') {
        this.currentDrawingObject = {
          type: 'diamond',
          x: wx, y: wy, width: 1, height: 1,
          color: this.currentColor, strokeWidth: this.currentSize,
          filled: this.isFilled, fillColor: fillColor
        };
      } else if (shapeType === 'triangle') {
        this.currentDrawingObject = {
          type: 'triangle',
          x: wx, y: wy, width: 1, height: 1,
          color: this.currentColor, strokeWidth: this.currentSize,
          filled: this.isFilled, fillColor: fillColor
        };
      } else if (shapeType === 'line' || shapeType === 'arrow') {
        this.currentDrawingObject = {
          type: shapeType,
          x1: wx, y1: wy, x2: wx, y2: wy,
          color: this.currentColor, strokeWidth: this.currentSize
        };
      }

      if (this.currentDrawingObject) {
        this.engine.addObject(this.currentDrawingObject, false);
      }
      return;
    }

    // 5. Stiker (Sticky Note)
    if (this.currentTool === 'sticky') {
      const stickyObj = {
        type: 'sticky',
        x: wx, y: wy,
        width: 160, height: 140,
        bgColor: this.getStickyColor(),
        textColor: '#1E293B',
        text: 'Yangi stiker...'
      };
      this.engine.addObject(stickyObj);
      this.engine.selectedObject = stickyObj;
      this.openTextEditor(stickyObj, e.clientX, e.clientY);
      this.setTool('select');
      return;
    }

    // 6. Matn (Text)
    if (this.currentTool === 'text') {
      const textObj = {
        type: 'text',
        x: wx, y: wy,
        text: 'Matn kiriting',
        color: this.currentColor,
        fontSize: 18,
        fontFamily: 'Plus Jakarta Sans'
      };
      this.engine.addObject(textObj);
      this.engine.selectedObject = textObj;
      this.openTextEditor(textObj, e.clientX, e.clientY);
      this.setTool('select');
      return;
    }

    // 7. Tarmoq Tuguni (Network Node)
    if (this.currentTool === 'net_node') {
      const nodeObj = {
        type: 'net_node',
        x: wx, y: wy,
        nodeType: this.currentNodeType || 'router',
        label: this.currentNodeType.toUpperCase(),
        ip: '192.168.1.' + Math.floor(Math.random() * 250 + 1)
      };
      this.engine.addObject(nodeObj);
      this.engine.selectedObject = nodeObj;
      this.setTool('select');
      return;
    }

    // 8. Laser Pointer
    if (this.currentTool === 'laser') {
      this.engine.addLaserPoint(e.clientX, e.clientY);
      return;
    }
  }

  onPointerMove(e) {
    // Laser pointer koordinatasi
    if (this.currentTool === 'laser' && this.laserDot) {
      this.laserDot.style.left = e.clientX + 'px';
      this.laserDot.style.top = e.clientY + 'px';
      if (this.isPointerDown) {
        this.engine.addLaserPoint(e.clientX, e.clientY);
      }
    }

    if (!this.isPointerDown) return;

    // Viewport siljitish (Pan)
    if (this.spacebarHeld || this.currentTool === 'pan' || e.buttons === 4) {
      const dx = e.clientX - this.startScreenPos.x;
      const dy = e.clientY - this.startScreenPos.y;
      this.engine.panX += dx;
      this.engine.panY += dy;
      this.startScreenPos = { x: e.clientX, y: e.clientY };
      return;
    }

    const currWorld = this.engine.screenToWorld(e.clientX, e.clientY);

    // O'chirg'ich harakatda bo'lsa
    if (this.currentTool === 'eraser') {
      const hit = this.engine.hitTest(currWorld.x, currWorld.y);
      if (hit) this.engine.removeObject(hit);
      return;
    }

    // Tanlangan ob'ektni ko'chirish
    if (this.currentTool === 'select' && this.isDraggingObject && this.engine.selectedObject) {
      const obj = this.engine.selectedObject;
      const nx = currWorld.x - this.dragOffset.x;
      const ny = currWorld.y - this.dragOffset.y;

      if (obj.x !== undefined && obj.y !== undefined) {
        const dx = nx - obj.x;
        const dy = ny - obj.y;
        obj.x = nx;
        obj.y = ny;
        // Agar stroke bo'lsa barcha nuqtalarni siljitish
        if (obj.type === 'stroke' && obj.points) {
          obj.points.forEach(p => { p.x += dx; p.y += dy; });
        }
      } else if (obj.x1 !== undefined) {
        const dx = nx - obj.x1;
        const dy = ny - obj.y1;
        obj.x1 = nx; obj.y1 = ny;
        obj.x2 += dx; obj.y2 += dy;
      }
      return;
    }

    // Qalam / Marker davom ettirish
    if (this.currentDrawingObject && this.currentDrawingObject.type === 'stroke') {
      this.currentDrawingObject.points.push({ x: currWorld.x, y: currWorld.y });
      return;
    }

    // Shakllar o'lchamini tortish (Drag resize during creation)
    if (this.currentDrawingObject) {
      const obj = this.currentDrawingObject;
      const sx = this.startWorldPos.x;
      const sy = this.startWorldPos.y;
      const cx = currWorld.x;
      const cy = currWorld.y;

      if (['rect', 'diamond', 'triangle'].includes(obj.type)) {
        obj.x = Math.min(sx, cx);
        obj.y = Math.min(sy, cy);
        obj.width = Math.max(4, Math.abs(cx - sx));
        obj.height = Math.max(4, Math.abs(cy - sy));
      } else if (obj.type === 'circle') {
        const rx = (cx - sx) / 2;
        const ry = (cy - sy) / 2;
        obj.x = sx;
        obj.y = sy;
        obj.radiusX = rx;
        obj.radiusY = ry;
      } else if (obj.type === 'line' || obj.type === 'arrow') {
        obj.x2 = cx;
        obj.y2 = cy;
      }
    }
  }

  onPointerUp(e) {
    if (!this.isPointerDown) return;
    this.isPointerDown = false;
    this.isDraggingObject = false;

    if (this.currentDrawingObject) {
      this.engine.saveState(); // Yangi chizilgan shaklni saqlash
      this.currentDrawingObject = null;
    }

    this.updateViewportCursor();
  }

  /* ==========================================================================
     INLINE TEXT TAHRIRLAGICH
     ========================================================================== */
  openTextEditor(obj, screenX, screenY) {
    this.activeTextObj = obj;
    this.textOverlay.classList.remove('hidden');
    this.textOverlay.style.left = screenX + 'px';
    this.textOverlay.style.top = screenY + 'px';
    this.textInput.value = obj.text || '';
    this.textInput.focus();
    this.textInput.select();

    const commit = () => {
      if (this.activeTextObj) {
        this.activeTextObj.text = this.textInput.value.trim() || ' ';
        this.engine.saveState();
        this.activeTextObj = null;
      }
      this.textOverlay.classList.add('hidden');
      window.removeEventListener('pointerdown', handleOutside);
    };

    const handleOutside = (ev) => {
      if (!this.textOverlay.contains(ev.target)) {
        commit();
      }
    };

    setTimeout(() => window.addEventListener('pointerdown', handleOutside), 100);

    this.textInput.onkeydown = (ev) => {
      if (ev.key === 'Enter' && !ev.shiftKey && obj.type !== 'sticky') {
        ev.preventDefault();
        commit();
      } else if (ev.key === 'Escape') {
        commit();
      }
    };
  }

  /* ==========================================================================
     TOOLBAR VA ASBOB O'ZGARISHLARI
     ========================================================================== */
  bindToolbarEvents() {
    // 1. Asosiy Asboblar tugmalari
    const toolBtns = document.querySelectorAll('.floating-toolbar .tool-btn[data-tool]');
    toolBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tool = btn.getAttribute('data-tool');
        this.setTool(tool);
      });
    });

    // 2. Shakllar menyusi (Shape Popover)
    const btnShapeTool = document.getElementById('btnShapeTool');
    const shapeMenu = document.getElementById('shapeMenu');
    if (btnShapeTool) {
      btnShapeTool.addEventListener('click', (e) => {
        e.stopPropagation();
        btnShapeTool.parentElement.classList.toggle('open');
      });
    }

    document.querySelectorAll('#shapeMenu .popover-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const shape = item.getAttribute('data-shape');
        this.currentShape = shape;
        this.setTool(shape);
        btnShapeTool.parentElement.classList.remove('open');
      });
    });

    // 3. Tarmoq Qurilmalari menyusi (Network Node Popover)
    const btnNetNode = document.getElementById('btnNetNodeTool');
    if (btnNetNode) {
      btnNetNode.addEventListener('click', (e) => {
        e.stopPropagation();
        btnNetNode.parentElement.classList.toggle('open');
      });
    }

    document.querySelectorAll('#netNodeMenu .popover-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const nodeType = item.getAttribute('data-node');
        this.currentNodeType = nodeType;
        this.setTool('net_node');
        btnNetNode.parentElement.classList.remove('open');
      });
    });

    // Tashqariga bosganda popoverlarni yopish
    window.addEventListener('click', () => {
      document.querySelectorAll('.tool-popover-anchor.open').forEach(el => el.classList.remove('open'));
      document.querySelectorAll('.dropdown-wrapper.open').forEach(el => el.classList.remove('open'));
    });

    // 4. Ranglar palitrasi
    document.querySelectorAll('#colorPalette .color-swatch').forEach(swatch => {
      swatch.addEventListener('click', () => {
        document.querySelectorAll('#colorPalette .color-swatch').forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');
        this.currentColor = swatch.getAttribute('data-color');

        if (this.engine.selectedObject) {
          this.engine.selectedObject.color = this.currentColor;
          if (this.engine.selectedObject.type === 'rect' || this.engine.selectedObject.type === 'circle') {
            this.engine.selectedObject.fillColor = this.getFillColor();
          }
          this.engine.saveState();
        }
      });
    });

    // 5. Qalinlik tanlagich
    document.querySelectorAll('#strokeSizeSelector .size-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#strokeSizeSelector .size-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentSize = parseInt(btn.getAttribute('data-size'), 10) || 4;

        if (this.engine.selectedObject && this.engine.selectedObject.strokeWidth) {
          this.engine.selectedObject.strokeWidth = this.currentSize;
          this.engine.saveState();
        }
      });
    });

    // 6. Shakl ichini bo'yash (Fill toggle)
    const btnFill = document.getElementById('btnToggleFill');
    if (btnFill) {
      btnFill.addEventListener('click', () => {
        this.isFilled = !this.isFilled;
        btnFill.classList.toggle('filled', this.isFilled);
        const label = document.getElementById('fillLabel');
        if (label) label.textContent = this.isFilled ? "Bo'yalgan" : "Shaffof";

        if (this.engine.selectedObject && ['rect', 'circle', 'diamond', 'triangle'].includes(this.engine.selectedObject.type)) {
          this.engine.selectedObject.filled = this.isFilled;
          this.engine.selectedObject.fillColor = this.getFillColor();
          this.engine.saveState();
        }
      });
    }
  }

  setTool(toolName) {
    this.currentTool = toolName;

    // Asosiy toolbar tugmalarini yangilash
    document.querySelectorAll('.floating-toolbar .tool-btn').forEach(b => {
      const dt = b.getAttribute('data-tool');
      if (dt === toolName || (toolName.startsWith('shape_') && b.id === 'btnShapeTool')) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });

    // Laser pointer ko'rinishini sozlash
    if (this.laserDot) {
      this.laserDot.classList.toggle('hidden', toolName !== 'laser');
    }

    this.updateViewportCursor();
  }

  updateViewportCursor() {
    this.viewport.className = 'canvas-viewport';
    if (this.currentTool === 'select') this.viewport.classList.add('mode-select');
    else if (this.currentTool === 'pan') this.viewport.classList.add('mode-pan');
    else if (this.currentTool === 'laser') this.viewport.classList.add('mode-laser');
  }

  getFillColor() {
    return this.currentColor + '33'; // 20% shaffoflikdagi rang
  }

  getStickyColor() {
    // Stikerlar uchun chiroyli pastel ranglar
    const colors = ['#FEF08A', '#BAE6FD', '#BBF7D0', '#FBCFE8', '#DDD6FE'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  /* ==========================================================================
     KLAVIATURA TEZKOR TUGMALARI (SHORTCUTS)
     ========================================================================== */
  bindKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      // Matn yozilayotgan bo'lsa hotkeylarni chetlab o'tish
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

      if (e.code === 'Space' && !this.spacebarHeld) {
        this.spacebarHeld = true;
        this.viewport.className = 'canvas-viewport mode-pan';
      }

      // Undo / Redo
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) this.engine.redo();
        else this.engine.undo();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        this.engine.redo();
      }

      // O'chirish (Delete / Backspace)
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (this.engine.selectedObject) {
          this.engine.removeObject(this.engine.selectedObject);
        }
      }

      // Asboblar klavishlari
      const key = e.key.toLowerCase();
      if (key === 'v') this.setTool('select');
      else if (key === 'h') this.setTool('pan');
      else if (key === 'p') this.setTool('pen');
      else if (key === 'm') this.setTool('highlighter');
      else if (key === 'e') this.setTool('eraser');
      else if (key === 's') this.setTool(this.currentShape || 'shape_rect');
      else if (key === 't') this.setTool('text');
      else if (key === 'n') this.setTool('sticky');
      else if (key === 'l') this.setTool('laser');
    });

    window.addEventListener('keyup', (e) => {
      if (e.code === 'Space') {
        this.spacebarHeld = false;
        this.updateViewportCursor();
      }
    });
  }
}

// Global eksport
window.ToolManager = ToolManager;
