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

    // Aqlli Shakllarni aniqlash (Magic Ink / AI Shape Recognition)
    this.magicInkEnabled = true;

    // AI Formula Rejimi (Active Real-time Handwriting Math OCR Mode)
    this.formulaModeActive = false;
    this.activeFormulaSession = null;
    this.formulaModeBanner = document.getElementById('formulaModeBanner');
    this.formulaLiveBadge = document.getElementById('formulaLiveBadge');
    this.fbadgeLoading = document.getElementById('fbadgeLoading');
    this.fbadgeReady = document.getElementById('fbadgeReady');
    this.fbadgeKatexPreview = document.getElementById('fbadgeKatexPreview');

    this.bindCanvasEvents();
    this.bindToolbarEvents();
    this.bindFormulaModeEvents();
    this.bindKeyboardShortcuts();
    this.bindImageDropAndPaste();
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
      this.updateOcrToolbarPosition();
      this.updateFormulaBadgePosition();
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
        // Agar bosilgan ob'ekt interaktiv Quiz Card bo'lsa
        if (hit.type === 'quiz_card') {
          const hx = hit.x, hy = hit.y, hw = hit.width || 360;
          const relX = wx - hx;
          const relY = wy - hy;
          const qLineH = 18;
          const estQLines = Math.ceil((hit.question || '').length / 38);
          const qH = Math.max(36, estQLines * qLineH + 12);
          const headerH = 38;
          const optStartY = headerH + qH;
          const opts = hit.options || [];

          // Variantlar bosildimi?
          let optionClicked = false;
          for (let i = 0; i < opts.length; i++) {
            const optY = optStartY + i * 36;
            if (relY >= optY && relY <= optY + 28 && relX >= 14 && relX <= hw - 14) {
              hit.selectedIndex = i;
              this.engine.saveState();
              if (typeof window.toast === 'function') {
                window.toast(`Variant tanlandi: ${opts[i]}`);
              }
              optionClicked = true;
              break;
            }
          }

          if (optionClicked) {
            this.engine.selectedObject = hit;
            return;
          }

          // Javobni ko'rsatish / yashirish tugmasi bosildimi?
          const btnY = optStartY + opts.length * 36 + 8;
          if (relY >= btnY && relY <= btnY + 28 && relX >= 14 && relX <= hw - 14) {
            hit.revealed = !hit.revealed;
            this.engine.saveState();
            if (typeof window.toast === 'function') {
              window.toast(hit.revealed ? "✅ To'g'ri javob ochildi" : "Javob yashirildi");
            }
            this.engine.selectedObject = hit;
            return;
          }
        }

        this.engine.selectedObject = hit;
        this.isDraggingObject = true;
        this.dragOffset = {
          x: wx - (hit.x !== undefined ? hit.x : hit.x1),
          y: wy - (hit.y !== undefined ? hit.y : hit.y1)
        };

        // Agar tanlangan element chizma (stroke) bo'lsa, atrofidagi barcha bog'liq chizmalarni klasterlab OCR panelini ko'rsatish
        if (hit.type === 'stroke') {
          const cluster = this.getClusteredStrokes(hit);
          this.showOcrFloatingToolbar(cluster);
        } else {
          this.hideOcrFloatingToolbar();
        }
      } else {
        this.engine.selectedObject = null;
        this.hideOcrFloatingToolbar();
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
      this.updateOcrToolbarPosition();
      this.updateFormulaBadgePosition();
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
      if (obj.type === 'stroke') {
        this.updateOcrToolbarPosition();
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
      // 1. AI Formula Rejimi faol bo'lsa: formulani fonda tahlil qilish
      if (this.formulaModeActive && this.currentDrawingObject.type === 'stroke' && !this.currentDrawingObject.isHighlighter) {
        this.handleFormulaStrokeComplete(this.currentDrawingObject);
        this.engine.saveState();
        this.currentDrawingObject = null;
        this.updateViewportCursor();
        return;
      }

      // 2. Magic Ink: erkin chizilgan qalam shaklini geometrik shaklga aylantirish
      if (this.magicInkEnabled && this.currentDrawingObject.type === 'stroke' && !this.currentDrawingObject.isHighlighter) {
        const magicShape = this.tryMagicInkRecognition(this.currentDrawingObject);
        if (magicShape) {
          this.engine.removeObject(this.currentDrawingObject, false);
          this.engine.addObject(magicShape, false);
          this.engine.selectedObject = magicShape;
          this.engine.saveState();
          this.currentDrawingObject = null;
          this.updateViewportCursor();
          if (typeof window.toast === 'function') {
            window.toast(`✨ Magic Ink: ${magicShape.magicName || 'Shakl'} tanildi!`);
          }
          return;
        }
      }

      this.engine.saveState(); // Yangi chizilgan shaklni saqlash
      this.currentDrawingObject = null;
    }

    this.updateViewportCursor();
  }

  /* ==========================================================================
     MAGIC INK (AQLLI SHAKLLARNI TANISH)
     ========================================================================== */
  tryMagicInkRecognition(strokeObj) {
    const pts = strokeObj.points;
    if (!pts || pts.length < 8) return null;

    // 1. Bounding box va xarakteristikalar
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    let pathLen = 0;
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
      if (i > 0) {
        pathLen += Math.hypot(p.x - pts[i - 1].x, p.y - pts[i - 1].y);
      }
    }

    const w = maxX - minX;
    const h = maxY - minY;
    if (w < 16 && h < 16) return null; // Juda kichik nuqta/chiziqcha

    const diag = Math.hypot(w, h);
    const startP = pts[0];
    const endP = pts[pts.length - 1];
    const dStartEnd = Math.hypot(endP.x - startP.x, endP.y - startP.y);

    const isClosed = dStartEnd < Math.min(60, diag * 0.35);

    const color = strokeObj.color || this.currentColor;
    const strokeWidth = strokeObj.width || this.currentSize;
    const filled = this.isFilled;
    const fillColor = filled ? this.getFillColor() : 'transparent';

    if (isClosed) {
      // Markaz va o'rtacha radius
      const cx = (minX + maxX) / 2;
      const cy = (minY + maxY) / 2;
      const rx = w / 2;
      const ry = h / 2;

      // Aylanasimonlikni tekshirish (Circularity test)
      let radialDiffSum = 0;
      for (const p of pts) {
        const d = Math.hypot((p.x - cx) / (rx || 1), (p.y - cy) / (ry || 1));
        radialDiffSum += Math.abs(d - 1.0);
      }
      const avgRadialDiff = radialDiffSum / pts.length;

      // a) Agar barcha nuqtalar markazdan taxminan bir xil uzoqlikda bo'lsa -> Aylana / Ellips
      if (avgRadialDiff < 0.22) {
        return {
          type: 'circle',
          x: minX,
          y: minY,
          radiusX: rx,
          radiusY: ry,
          color,
          strokeWidth,
          filled,
          fillColor,
          magicName: "Aylana"
        };
      }

      // b) Burchaklar (Corners) tahlili
      const step = Math.max(2, Math.floor(pts.length / 16));
      let cornerCount = 0;
      for (let i = step; i < pts.length - step; i += step) {
        const prev = pts[i - step];
        const curr = pts[i];
        const next = pts[i + step];

        const v1x = curr.x - prev.x, v1y = curr.y - prev.y;
        const v2x = next.x - curr.x, v2y = next.y - curr.y;
        const l1 = Math.hypot(v1x, v1y), l2 = Math.hypot(v2x, v2y);

        if (l1 > 3 && l2 > 3) {
          const dot = (v1x * v2x + v1y * v2y) / (l1 * l2);
          const clampedDot = Math.max(-1, Math.min(1, dot));
          const angleDeg = Math.acos(clampedDot) * (180 / Math.PI);
          if (angleDeg > 45 && angleDeg < 135) {
            cornerCount++;
          }
        }
      }

      // Uchburchak
      if (cornerCount >= 2 && cornerCount <= 4 && pathLen < diag * 3.5) {
        if (cornerCount === 3 || (cornerCount === 2 && pts.length < 32)) {
          return {
            type: 'triangle',
            x: minX,
            y: minY,
            width: w,
            height: h,
            color,
            strokeWidth,
            filled,
            fillColor,
            magicName: "Uchburchak"
          };
        }
      }

      // To'g'ri to'rtburchak
      return {
        type: 'rect',
        x: minX,
        y: minY,
        width: w,
        height: h,
        color,
        strokeWidth,
        filled,
        fillColor,
        magicName: "To'g'ri to'rtburchak"
      };
    } else {
      // Ochiq chizma: Chiziq yoki Strelka
      const straightRatio = pathLen / (dStartEnd || 1);

      if (straightRatio < 1.35 && dStartEnd > 24) {
        // Oxirgi 25% qismida burilish / strelka uchi bormi?
        const lastIdx = Math.floor(pts.length * 0.75);
        let hasFlick = false;
        for (let i = lastIdx; i < pts.length - 1; i++) {
          const p = pts[i];
          const dToStart = Math.hypot(p.x - startP.x, p.y - startP.y);
          const dNextToStart = Math.hypot(pts[i+1].x - startP.x, pts[i+1].y - startP.y);
          if (dNextToStart < dToStart - 4) {
            hasFlick = true;
            break;
          }
        }

        if (hasFlick) {
          return {
            type: 'arrow',
            x1: startP.x,
            y1: startP.y,
            x2: endP.x,
            y2: endP.y,
            color,
            strokeWidth,
            magicName: "Yo'naltirilgan Strelka"
          };
        } else {
          return {
            type: 'line',
            x1: startP.x,
            y1: startP.y,
            x2: endP.x,
            y2: endP.y,
            color,
            strokeWidth,
            magicName: "To'g'ri Chiziq"
          };
        }
      }
    }

    return null;
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
        btnNetNode?.parentElement?.classList.remove('open');
        document.getElementById('moreToolsAnchor')?.classList.remove('open');
      });
    });

    // 4. Qo'shimcha / Maxsus Asboblar Menyusi (More Tools Popover)
    const btnMoreTools = document.getElementById('btnMoreTools');
    const moreToolsAnchor = document.getElementById('moreToolsAnchor');
    if (btnMoreTools && moreToolsAnchor) {
      btnMoreTools.addEventListener('click', (e) => {
        e.stopPropagation();
        moreToolsAnchor.classList.toggle('open');
      });
    }

    document.querySelectorAll('#moreToolsMenu .tool-btn-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const tool = item.getAttribute('data-tool');
        if (tool) {
          this.setTool(tool);
        }
        moreToolsAnchor?.classList.remove('open');
      });
    });

    // Magic Ink toggle
    const btnMagicInk = document.getElementById('btnMagicInkToggle');
    if (btnMagicInk) {
      btnMagicInk.addEventListener('click', (e) => {
        e.stopPropagation();
        this.magicInkEnabled = !this.magicInkEnabled;
        btnMagicInk.classList.toggle('active-feature', this.magicInkEnabled);
        if (typeof window.toast === 'function') {
          window.toast(`Magic Ink: ${this.magicInkEnabled ? "Yoqildi (Avto-shakl)" : "O'chirildi"}`);
        }
        moreToolsAnchor?.classList.remove('open');
      });
    }

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
    if (toolName === 'formula') {
      const modal = document.getElementById('formulaModal');
      if (modal) modal.classList.remove('hidden');
      return;
    }

    if (toolName === 'formula_mode') {
      this.toggleFormulaMode();
      return;
    }

    if (toolName !== 'pen' && this.formulaLiveBadge && !this.formulaLiveBadge.classList.contains('hidden')) {
      this.dismissFormulaSession();
    }

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

    // Stil panelini (rang & qalinlik) faqat chizish asboblari faol bo'lganda ko'rsatish
    const styleBar = document.getElementById('styleBar');
    if (styleBar) {
      const needsStyle = ['pen', 'highlighter', 'text'].includes(toolName) || toolName.startsWith('shape_');
      styleBar.classList.toggle('hidden', !needsStyle && !this.engine.selectedObject);
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

      // Alt+F: AI Formula Rejimini yoqish/o'chirish
      if (e.altKey && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        this.toggleFormulaMode();
        return;
      }

      // Enter: Agar formula tayyor bo'lsa uni tasdiqlash
      if (e.key === 'Enter' && !e.shiftKey) {
        if (this.formulaLiveBadge && !this.formulaLiveBadge.classList.contains('hidden') && this.fbadgeReady && !this.fbadgeReady.classList.contains('hidden')) {
          e.preventDefault();
          this.confirmFormulaSession();
          return;
        }
      }

      // Escape: Formulani bekor qilish
      if (e.key === 'Escape') {
        if (this.formulaLiveBadge && !this.formulaLiveBadge.classList.contains('hidden')) {
          this.dismissFormulaSession();
          return;
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
      else if (key === 'f') document.getElementById('btnFormulaTool')?.click();
      else if (key === 'l') this.setTool('laser');
    });

    window.addEventListener('keyup', (e) => {
      if (e.code === 'Space') {
        this.spacebarHeld = false;
        this.updateViewportCursor();
      }
    });
  }

  /* ==========================================================================
     VISION & RASM YUKLASH (CLIPBOARD PASTE & DRAG-AND-DROP)
     ========================================================================== */
  bindImageDropAndPaste() {
    // 1. Clipboard Paste (Ctrl+V)
    window.addEventListener('paste', (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

      const items = (e.clipboardData || e.originalEvent?.clipboardData)?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          this.handleImageFile(file);
          e.preventDefault();
          break;
        }
      }
    });

    // 2. Drag and Drop
    const vp = this.viewport;
    if (!vp) return;

    vp.addEventListener('dragover', (e) => {
      e.preventDefault();
      if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
    });

    vp.addEventListener('drop', (e) => {
      e.preventDefault();
      const files = e.dataTransfer?.files;
      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          if (files[i].type.startsWith('image/')) {
            this.handleImageFile(files[i], e.clientX, e.clientY);
            break;
          }
        }
      }
    });
  }

  handleImageFile(file, screenX, screenY) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target.result;
      const center = (screenX !== undefined && screenY !== undefined)
        ? this.engine.screenToWorld(screenX, screenY)
        : this.engine.screenToWorld(this.engine.width / 2, this.engine.height / 2);

      const imgObj = {
        type: 'image',
        x: Math.round(center.x - 160),
        y: Math.round(center.y - 120),
        width: 320,
        height: 240,
        src: src,
        caption: file.name ? file.name.substring(0, 24) : 'Rasm'
      };

      this.engine.saveState();
      this.engine.addObject(imgObj);
      this.engine.selectedObject = imgObj;
      if (typeof window.toast === 'function') {
        window.toast(`🖼️ Rasm doskaga muvaffaqiyatli qo'yildi!`);
      }
    };
    reader.readAsDataURL(file);
  }

  /* ==========================================================================
     QO'LYOZMA KLASTERLASH VA SUZUVCHI OCR PANELI
     ========================================================================== */
  getClusteredStrokes(initialStroke, maxDist = 60) {
    const allStrokes = this.engine.objects.filter(o => o.type === 'stroke');
    const cluster = new Set([initialStroke]);
    let added = true;

    while (added) {
      added = false;
      for (const s of allStrokes) {
        if (!cluster.has(s)) {
          const sBounds = this.engine.getObjectBounds(s);
          if (!sBounds) continue;

          for (const c of cluster) {
            const cBounds = this.engine.getObjectBounds(c);
            if (!cBounds) continue;

            const dx = Math.max(0, Math.max(sBounds.x - (cBounds.x + cBounds.width), cBounds.x - (sBounds.x + sBounds.width)));
            const dy = Math.max(0, Math.max(sBounds.y - (cBounds.y + cBounds.height), cBounds.y - (sBounds.y + sBounds.height)));
            const dist = Math.hypot(dx, dy);

            if (dist <= maxDist) {
              cluster.add(s);
              added = true;
              break;
            }
          }
        }
      }
    }

    return Array.from(cluster);
  }

  showOcrFloatingToolbar(strokes) {
    this.selectedStrokesForOcr = strokes;
    const toolbar = document.getElementById('ocrFloatingToolbar');
    if (!toolbar || !strokes || strokes.length === 0) return;

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    strokes.forEach(s => {
      const b = this.engine.getObjectBounds(s);
      if (b) {
        if (b.x < minX) minX = b.x;
        if (b.y < minY) minY = b.y;
        if (b.x + b.width > maxX) maxX = b.x + b.width;
        if (b.y + b.height > maxY) maxY = b.y + b.height;
      }
    });

    if (!Number.isFinite(minX)) return;

    const screenTopLeft = this.engine.worldToScreen(minX, minY);
    const screenBotRight = this.engine.worldToScreen(maxX, maxY);

    toolbar.classList.remove('hidden');
    toolbar.style.left = `${(screenTopLeft.x + screenBotRight.x) / 2}px`;
    toolbar.style.top = `${Math.max(70, screenTopLeft.y - 36)}px`;
  }

  hideOcrFloatingToolbar() {
    const toolbar = document.getElementById('ocrFloatingToolbar');
    if (toolbar) toolbar.classList.add('hidden');
    this.selectedStrokesForOcr = null;
  }

  updateOcrToolbarPosition() {
    if (this.selectedStrokesForOcr && this.selectedStrokesForOcr.length > 0) {
      this.showOcrFloatingToolbar(this.selectedStrokesForOcr);
    }
  }

  /* ==========================================================================
     AI FORMULA REJIMI METODLARI (ACTIVE REAL-TIME MATH OCR)
     ========================================================================== */
  bindFormulaModeEvents() {
    const btnMode = document.getElementById('btnAiFormulaMode');
    if (btnMode) {
      btnMode.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleFormulaMode();
      });
    }

    const btnExit = document.getElementById('btnExitFormulaMode');
    if (btnExit) {
      btnExit.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleFormulaMode(false);
      });
    }

    document.getElementById('btnConfirmLiveFormula')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.confirmFormulaSession();
    });

    document.getElementById('btnEditLiveFormula')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.editFormulaSession();
    });

    document.getElementById('btnDismissLiveFormula')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.dismissFormulaSession();
    });
  }

  toggleFormulaMode(forceState = null) {
    this.formulaModeActive = forceState !== null ? forceState : !this.formulaModeActive;

    const btnMode = document.getElementById('btnAiFormulaMode');
    if (btnMode) {
      btnMode.classList.toggle('active', this.formulaModeActive);
      btnMode.classList.toggle('active-formula-mode', this.formulaModeActive);
    }

    if (this.formulaModeBanner) {
      this.formulaModeBanner.classList.toggle('hidden', !this.formulaModeActive);
    }

    if (this.formulaModeActive) {
      this.setTool('pen');
      if (typeof window.toast === 'function') {
        window.toast("✨ AI Formula Rejimi faollashtirildi! Doskaga formula yozing...");
      }
    } else {
      this.dismissFormulaSession();
      if (typeof window.toast === 'function') {
        window.toast("AI Formula Rejimi o'chirildi.");
      }
    }
  }

  handleFormulaStrokeComplete(stroke) {
    if (!this.activeFormulaSession) {
      this.activeFormulaSession = {
        strokes: [],
        timer: null,
        recognizedLatex: '',
        bounds: null
      };
    }

    this.activeFormulaSession.strokes.push(stroke);

    // Suzuvchi tahlil nishonini ko'rsatish
    this.showFormulaLiveBadgeLoading();

    // Debounce: foydalanuvchi keyingi belgilarni yozayotgan bo'lsa kutish
    if (this.activeFormulaSession.timer) {
      clearTimeout(this.activeFormulaSession.timer);
    }

    const session = this.activeFormulaSession;
    session.timer = setTimeout(async () => {
      if (!this.formulaModeActive || !this.activeFormulaSession || this.activeFormulaSession !== session) return;

      try {
        if (window.handwritingOCR) {
          const res = await window.handwritingOCR.recognizeFormula(session.strokes);
          if (!this.activeFormulaSession || this.activeFormulaSession !== session) return;

          session.recognizedLatex = res.latex;
          session.bounds = res.bounds;

          this.showFormulaLiveBadgeReady(res.latex, res.mode);
        }
      } catch (err) {
        console.warn("Formula OCR xatosi:", err);
      }
    }, 850);
  }

  showFormulaLiveBadgeLoading() {
    if (!this.formulaLiveBadge || !this.activeFormulaSession) return;
    this.updateFormulaBadgePosition();
    this.formulaLiveBadge.classList.remove('hidden');
    this.fbadgeLoading?.classList.remove('hidden');
    this.fbadgeReady?.classList.add('hidden');
  }

  showFormulaLiveBadgeReady(latex, mode = 'gemini') {
    if (!this.formulaLiveBadge || !this.activeFormulaSession) return;

    const modeIndicator = document.getElementById('fbadgeModeIndicator');
    if (modeIndicator) {
      if (mode === 'gemini') {
        modeIndicator.textContent = '✨ Gemini 2.5 Vision';
        modeIndicator.style.color = '#10B981';
      } else {
        modeIndicator.textContent = '⚡ Lokal Fazoviy OCR';
        modeIndicator.style.color = '#38BDF8';
      }
    }

    if (this.fbadgeKatexPreview) {
      if (typeof window.katex !== 'undefined') {
        try {
          this.fbadgeKatexPreview.innerHTML = window.katex.renderToString(latex, { displayMode: true, throwOnError: false });
        } catch (e) {
          this.fbadgeKatexPreview.textContent = latex;
        }
      } else {
        this.fbadgeKatexPreview.textContent = latex;
      }
    }

    this.fbadgeLoading?.classList.add('hidden');
    this.fbadgeReady?.classList.remove('hidden');
    this.updateFormulaBadgePosition();
  }

  updateFormulaBadgePosition() {
    if (!this.formulaLiveBadge || !this.activeFormulaSession || this.activeFormulaSession.strokes.length === 0) return;

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    this.activeFormulaSession.strokes.forEach(s => {
      const b = this.engine.getObjectBounds(s);
      if (b) {
        if (b.x < minX) minX = b.x;
        if (b.y < minY) minY = b.y;
        if (b.x + b.width > maxX) maxX = b.x + b.width;
        if (b.y + b.height > maxY) maxY = b.y + b.height;
      }
    });

    if (!Number.isFinite(minX)) return;
    this.activeFormulaSession.bounds = { x: minX, y: minY, width: maxX - minX, height: maxY - minY };

    const centerScreen = this.engine.worldToScreen((minX + maxX) / 2, minY);
    this.formulaLiveBadge.style.left = `${Math.max(160, Math.min(window.innerWidth - 160, centerScreen.x))}px`;
    this.formulaLiveBadge.style.top = `${Math.max(80, centerScreen.y)}px`;
  }

  confirmFormulaSession() {
    if (!this.activeFormulaSession || !this.activeFormulaSession.recognizedLatex) return;
    const session = this.activeFormulaSession;
    const b = session.bounds || { x: 100, y: 100, width: 220, height: 60 };

    const formulaObj = {
      type: 'formula',
      x: b.x,
      y: b.y,
      width: Math.max(140, b.width),
      height: Math.max(56, b.height),
      latex: session.recognizedLatex,
      color: this.currentColor || (this.engine.theme === 'light' ? '#0F172A' : '#FFFFFF'),
      fontSize: 26
    };

    this.engine.replaceStrokesWithObject(session.strokes, formulaObj);
    this.dismissFormulaSession();

    if (typeof window.toast === 'function') {
      window.toast("✅ Formula Word standartiga muvaffaqiyatli o'tkazildi!");
    }
  }

  editFormulaSession() {
    if (!this.activeFormulaSession) return;
    const session = this.activeFormulaSession;
    const ocrConfirmModal = document.getElementById('ocrConfirmModal');
    const ocrLatexResultInput = document.getElementById('ocrLatexResultInput');
    const ocrFormulaLivePreview = document.getElementById('ocrFormulaLivePreview');
    const ocrSourcePreviewImg = document.getElementById('ocrSourcePreviewImg');

    if (ocrLatexResultInput) ocrLatexResultInput.value = session.recognizedLatex;
    if (ocrFormulaLivePreview && typeof window.katex !== 'undefined') {
      try {
        ocrFormulaLivePreview.innerHTML = window.katex.renderToString(session.recognizedLatex, { displayMode: true, throwOnError: false });
      } catch (e) {
        ocrFormulaLivePreview.textContent = session.recognizedLatex;
      }
    }

    if (window.handwritingOCR && session.strokes.length > 0) {
      const raster = window.handwritingOCR.renderStrokesToImage(session.strokes);
      if (raster && ocrSourcePreviewImg) ocrSourcePreviewImg.src = raster.dataUrl;
    }

    // Set globally for confirmation button in modal
    if (typeof window.setActiveOcrStrokes === 'function') {
      window.setActiveOcrStrokes(session.strokes, session.bounds);
    }

    ocrConfirmModal?.classList.remove('hidden');
    this.dismissFormulaSession();
  }

  dismissFormulaSession() {
    if (this.activeFormulaSession?.timer) {
      clearTimeout(this.activeFormulaSession.timer);
    }
    this.activeFormulaSession = null;
    if (this.formulaLiveBadge) {
      this.formulaLiveBadge.classList.add('hidden');
    }
  }
}

// Global eksport
window.ToolManager = ToolManager;
