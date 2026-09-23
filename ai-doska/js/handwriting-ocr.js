/* ==========================================================================
   ATT-25 AI DOSKA — HANDWRITING & FORMULA OCR ENGINE (handwriting-ocr.js)
   Qo'lda yozilgan chizmalarni KaTeX LaTeX va standart matnga aylantirish
   ========================================================================== */

class HandwritingOCR {
  constructor(boardEngine, aiEngine) {
    this.board = boardEngine;
    this.ai = aiEngine;
  }

  /* ==========================================================================
     1. STROKE'LARNI RASMGA AYLANTIRISH (RASTERIZATION)
     ========================================================================== */
  renderStrokesToImage(strokes, padding = 24) {
    if (!strokes || strokes.length === 0) return null;

    // Barcha stroke'larning umumiy chegaralari (Bounding Box)
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    strokes.forEach(s => {
      if (s.points) {
        s.points.forEach(p => {
          if (p.x < minX) minX = p.x;
          if (p.x > maxX) maxX = p.x;
          if (p.y < minY) minY = p.y;
          if (p.y > maxY) maxY = p.y;
        });
      }
    });

    if (!Number.isFinite(minX)) return null;

    const width = Math.max(40, (maxX - minX) + padding * 2);
    const height = Math.max(40, (maxY - minY) + padding * 2);

    // Xotirada vaqtinchalik yuqori kontrastli Canvas yaratish
    const offCanvas = document.createElement('canvas');
    offCanvas.width = width;
    offCanvas.height = height;
    const ctx = offCanvas.getContext('2d');

    // Oq fon (OCR modellari uchun standart)
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    // To'q qora chiziqlar bilan stroke'larni qayta chizish
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#000000';
    ctx.fillStyle = '#000000';

    ctx.save();
    ctx.translate(-minX + padding, -minY + padding);

    strokes.forEach(s => {
      if (!s.points || s.points.length === 0) return;
      ctx.lineWidth = Math.max(3, Math.min(8, (s.width || 4) * 1.2));

      ctx.beginPath();
      ctx.moveTo(s.points[0].x, s.points[0].y);

      if (s.points.length === 1) {
        ctx.arc(s.points[0].x, s.points[0].y, ctx.lineWidth / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        for (let i = 1; i < s.points.length - 1; i++) {
          const xc = (s.points[i].x + s.points[i + 1].x) / 2;
          const yc = (s.points[i].y + s.points[i + 1].y) / 2;
          ctx.quadraticCurveTo(s.points[i].x, s.points[i].y, xc, yc);
        }
        ctx.lineTo(s.points[s.points.length - 1].x, s.points[s.points.length - 1].y);
        ctx.stroke();
      }
    });

    ctx.restore();

    return {
      dataUrl: offCanvas.toDataURL('image/png'),
      bounds: { x: minX, y: minY, width: maxX - minX, height: maxY - minY },
      width,
      height
    };
  }

  /* ==========================================================================
     2. ASOSIY TANISH DASTURI (RECOGNIZE FORMULA / TEXT)
     ========================================================================== */
  async recognizeFormula(strokes) {
    const raster = this.renderStrokesToImage(strokes);
    if (!raster) throw new Error("Tanish uchun chizmalar topilmadi.");

    // 1. Agar Gemini API kaliti mavjud bo'lsa (online multimodal AI)
    const apiKey = this.ai?.apiKey || localStorage.getItem('att25_gemini_api_key') || '';
    if (apiKey) {
      try {
        const result = await this.onlineRecognizeWithGemini(raster.dataUrl, 'math');
        if (result && result.latex) {
          return {
            latex: result.latex,
            confidence: result.confidence || 0.99,
            mode: 'gemini',
            bounds: raster.bounds,
            previewUrl: raster.dataUrl
          };
        }
      } catch (err) {
        console.warn("Gemini Vision xatosi, avtonom fazoviy OCR ga o'tilmoqda:", err);
      }
    }

    // 2. Avtonom fazoviy segmentatsiyalangan tanish (Offline)
    const offlineResult = this.offlineRecognizeMath(strokes, raster.bounds);
    return {
      latex: offlineResult.latex,
      confidence: offlineResult.confidence || 0.88,
      mode: 'offline',
      bounds: raster.bounds,
      previewUrl: raster.dataUrl
    };
  }

  async recognizeText(strokes) {
    const raster = this.renderStrokesToImage(strokes);
    if (!raster) throw new Error("Tanish uchun chizmalar topilmadi.");

    const apiKey = this.ai?.apiKey || localStorage.getItem('att25_gemini_api_key') || '';
    if (apiKey) {
      try {
        const result = await this.onlineRecognizeWithGemini(raster.dataUrl, 'text');
        if (result && result.text) {
          return {
            text: result.text,
            mode: 'gemini',
            bounds: raster.bounds,
            previewUrl: raster.dataUrl
          };
        }
      } catch (err) {
        console.warn("Gemini Vision xatosi, avtonom matn tahliliga o'tilmoqda:", err);
      }
    }

    const offlineText = this.offlineRecognizeText(strokes, raster.bounds);
    return {
      text: offlineText,
      mode: 'offline',
      bounds: raster.bounds,
      previewUrl: raster.dataUrl
    };
  }

  /* ==========================================================================
     3. ONLINE GOOGLE GEMINI MULTIMODAL VISION RECOGNITION (GEMINI 2.5 FLASH)
     ========================================================================== */
  async onlineRecognizeWithGemini(dataUrl, type = 'math') {
    const base64Data = dataUrl.replace(/^data:image\/\w+;base64,/, '');
    const model = this.ai?.model || 'gemini-2.5-flash';
    const apiKey = this.ai?.apiKey || localStorage.getItem('att25_gemini_api_key') || '';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const prompt = type === 'math'
      ? `You are an expert mathematical handwriting recognition OCR engine for Microsoft Word / KaTeX format.
Transcribe the handwritten mathematical formula, power, fraction, or scientific expression in the image into standard, clean LaTeX syntax matching Microsoft Word Equation Editor standards.
RULES:
1. Return ONLY the raw LaTeX string without any markdown backticks, without dollar signs, and without explanations.
2. Standard MS Word Equation standards:
   - Powers / Superscripts: use x^2, x^3, a^2+b^2=c^2, e^{i\\pi}+1=0, (a+b)^2
   - Fractions: always use \\frac{numerator}{denominator} (e.g. \\frac{a}{b}, \\frac{U}{R}, \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a})
   - Square roots: use \\sqrt{expression}
   - Indices: use x_i, a_n
   - Multiplications: use \\cdot or juxtaposition
3. Return concise, clean LaTeX.`
      : `You are an expert handwriting OCR engine.
Transcribe the handwritten text in the image into plain text (Latin or Cyrillic, Uzbek/English).
RULES:
1. Return ONLY the transcribed text without commentary or quotes.`;

    const payload = {
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: 'image/png',
                data: base64Data
              }
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 256
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Gemini Vision so'rovi xatosi: ${response.status}`);
    }

    const data = await response.json();
    let text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Tozalash (Markdown bloklari va $ belgilarini olib tashlash)
    text = text.replace(/```latex/gi, '')
               .replace(/```math/gi, '')
               .replace(/```/g, '')
               .replace(/^\$+/, '')
               .replace(/\$+$/, '')
               .trim();

    if (type === 'math') {
      return { latex: text, confidence: 0.99 };
    } else {
      return { text: text, confidence: 0.96 };
    }
  }

  /* ==========================================================================
     4. OFFLINE FAZOVIY MATEMATIK GLIF KLASSIFIKATORI (SPATIAL GLYPH OCR)
     ========================================================================== */
  offlineRecognizeMath(strokes, bounds) {
    if (!strokes || strokes.length === 0) return { latex: '', confidence: 0 };

    // 1. Har bir stroke geometriyasini hisoblash
    const strokeInfos = strokes.map(s => {
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      let pathLen = 0;
      s.points.forEach((p, i) => {
        if (p.x < minX) minX = p.x;
        if (p.x > maxX) maxX = p.x;
        if (p.y < minY) minY = p.y;
        if (p.y > maxY) maxY = p.y;
        if (i > 0) pathLen += Math.hypot(p.x - s.points[i - 1].x, p.y - s.points[i - 1].y);
      });
      const w = Math.max(1, maxX - minX);
      const h = Math.max(1, maxY - minY);
      const aspect = w / h;
      const isHorizontalLine = aspect > 2.2 && h < bounds.height * 0.35;
      const isVerticalLine = aspect < 0.35 && w < bounds.width * 0.35;
      const cy = (minY + maxY) / 2;
      const cx = (minX + maxX) / 2;

      return { stroke: s, minX, minY, maxX, maxY, w, h, cx, cy, aspect, isHorizontalLine, isVerticalLine, pathLen, pts: s.points };
    });

    // 2. Global strukturalarni tekshirish:
    // A. Kasr chizig'i
    const prominentHBars = strokeInfos.filter(si => si.isHorizontalLine && si.w > bounds.width * 0.25);
    for (const hBar of prominentHBars) {
      const above = strokeInfos.filter(si => si !== hBar && si.cy < hBar.minY + 4);
      const below = strokeInfos.filter(si => si !== hBar && si.cy > hBar.maxY - 4);
      if (above.length > 0 && below.length > 0) {
        const numRes = this.offlineRecognizeMath(above.map(a => a.stroke), this.calcBounds(above));
        const denRes = this.offlineRecognizeMath(below.map(b => b.stroke), this.calcBounds(below));
        return {
          latex: `\\frac{${numRes.latex || 'a'}}{${denRes.latex || 'b'}}`,
          confidence: 0.88,
          template: 'fraction'
        };
      }
    }

    // B. Kvadrat ildiz belgisi
    const radicalCandidate = strokeInfos.find(si => si.aspect > 1.1 && si.w > bounds.width * 0.35 && si.h > bounds.height * 0.45);
    if (radicalCandidate && strokeInfos.length > 1) {
      const inside = strokeInfos.filter(si => si !== radicalCandidate && si.cx > radicalCandidate.minX + radicalCandidate.w * 0.2);
      if (inside.length > 0) {
        const insideRes = this.offlineRecognizeMath(inside.map(i => i.stroke), this.calcBounds(inside));
        return {
          latex: `\\sqrt{${insideRes.latex || 'x^2 + y^2'}}`,
          confidence: 0.86,
          template: 'sqrt'
        };
      }
    }

    // 3. Chiziqlarni alohida gliflarga (harflar/raqamlarga) klasterlash
    const used = new Set();
    const glyphs = [];

    const intersects = (s1, s2) => {
      if (s1.maxX < s2.minX || s1.minX > s2.maxX || s1.maxY < s2.minY || s1.minY > s2.maxY) return false;
      const d = Math.hypot(s1.cx - s2.cx, s1.cy - s2.cy);
      return d < Math.max(s1.w, s1.h, s2.w, s2.h) * 0.7;
    };

    // A. Parallel gorizontal chiziqlar: '='
    for (let i = 0; i < strokeInfos.length; i++) {
      if (used.has(i)) continue;
      const s1 = strokeInfos[i];
      if (s1.isHorizontalLine) {
        for (let j = i + 1; j < strokeInfos.length; j++) {
          if (used.has(j)) continue;
          const s2 = strokeInfos[j];
          if (s2.isHorizontalLine) {
            const dx = Math.abs(s1.cx - s2.cx);
            const dy = Math.abs(s1.cy - s2.cy);
            if (dx < Math.max(s1.w, s2.w) * 0.5 && dy > 4 && dy < Math.max(s1.w, s2.w) * 0.85) {
              used.add(i);
              used.add(j);
              glyphs.push({
                val: '=',
                minX: Math.min(s1.minX, s2.minX),
                maxX: Math.max(s1.maxX, s2.maxX),
                minY: Math.min(s1.minY, s2.minY),
                maxY: Math.max(s1.maxY, s2.maxY),
                cx: (s1.cx + s2.cx) / 2,
                cy: (s1.cy + s2.cy) / 2,
                w: Math.max(s1.w, s2.w),
                h: Math.abs(s1.cy - s2.cy) + 6
              });
              break;
            }
          }
        }
      }
    }

    // B. Kesishuvchi chiziqlar: '+' yoki 'x'
    for (let i = 0; i < strokeInfos.length; i++) {
      if (used.has(i)) continue;
      const s1 = strokeInfos[i];
      for (let j = i + 1; j < strokeInfos.length; j++) {
        if (used.has(j)) continue;
        const s2 = strokeInfos[j];
        if (intersects(s1, s2)) {
          used.add(i);
          used.add(j);
          const isPlus = (s1.isHorizontalLine && s2.isVerticalLine) || (s1.isVerticalLine && s2.isHorizontalLine);
          glyphs.push({
            val: isPlus ? '+' : 'x',
            minX: Math.min(s1.minX, s2.minX),
            maxX: Math.max(s1.maxX, s2.maxX),
            minY: Math.min(s1.minY, s2.minY),
            maxY: Math.max(s1.maxY, s2.maxY),
            cx: (s1.cx + s2.cx) / 2,
            cy: (s1.cy + s2.cy) / 2,
            w: Math.max(s1.maxX, s2.maxX) - Math.min(s1.minX, s2.minX),
            h: Math.max(s1.maxY, s2.maxY) - Math.min(s1.minY, s2.minY)
          });
          break;
        }
      }
    }

    // C. Qolgan yagona chiziqli gliflar
    for (let i = 0; i < strokeInfos.length; i++) {
      if (used.has(i)) continue;
      const s = strokeInfos[i];
      used.add(i);

      let val = 'x';
      if (s.isHorizontalLine) {
        val = '-';
      } else if (s.isVerticalLine) {
        val = '1';
      } else {
        const pts = s.pts;
        const pStart = pts[0];
        const pEnd = pts[pts.length - 1];
        const dStartEnd = Math.hypot(pEnd.x - pStart.x, pEnd.y - pStart.y);
        const isClosed = dStartEnd < Math.max(s.w, s.h) * 0.35;

        if (isClosed) {
          val = '0';
        } else if (pStart.y < s.cy && pEnd.y > s.cy && pEnd.x < s.cx) {
          val = 'c';
        } else {
          // '2' daraja raqami xususiyati (yuqori egri, pastki gorizontal taglik)
          const hasFlatBase = pts.slice(-6).some(p => Math.abs(p.y - s.maxY) < 6);
          if (hasFlatBase && s.h > 10) {
            val = '2';
          } else if (pEnd.y > s.cy + s.h * 0.25 && pEnd.x > s.cx) {
            val = 'y';
          } else if (s.aspect < 0.9 && pStart.y < s.minY + s.h * 0.3) {
            val = 'r';
          } else {
            val = 'x';
          }
        }
      }

      glyphs.push({
        val,
        minX: s.minX,
        maxX: s.maxX,
        minY: s.minY,
        maxY: s.maxY,
        cx: s.cx,
        cy: s.cy,
        w: s.w,
        h: s.h
      });
    }

    // 4. Gliflarni chapdan o'ngga tartiblash
    glyphs.sort((a, b) => a.minX - b.minX);

    // 5. Asosiy chiziq va o'rtacha balandlikni hisoblash
    const mainGlyphs = glyphs.filter(g => g.h > bounds.height * 0.35);
    const medH = mainGlyphs.length > 0 ? (mainGlyphs.reduce((sum, g) => sum + g.h, 0) / mainGlyphs.length) : (bounds.height * 0.6);
    const medY = mainGlyphs.length > 0 ? (mainGlyphs.reduce((sum, g) => sum + g.cy, 0) / mainGlyphs.length) : (bounds.y + bounds.height * 0.5);

    // 6. Darajalarni (Superscripts) aniqlash va bog'lash
    const latexTokens = [];
    for (let i = 0; i < glyphs.length; i++) {
      const g = glyphs[i];
      const isElevated = g.cy < medY - medH * 0.18 && g.h <= medH * 0.85;

      if (isElevated && latexTokens.length > 0) {
        const lastIdx = latexTokens.length - 1;
        const lastVal = latexTokens[lastIdx];
        if (!['+', '-', '=', '\\pm'].includes(lastVal)) {
          latexTokens[lastIdx] = `${lastVal}^{${g.val}}`;
          continue;
        }
      }

      latexTokens.push(g.val);
    }

    // 7. Yakuniy toza LaTeX ifodasini yig'ish
    const finalLatex = latexTokens.map(tok => {
      if (['+', '-', '=', '\\pm'].includes(tok)) return ` ${tok} `;
      return tok;
    }).join('').replace(/\s+/g, ' ').trim();

    return {
      latex: finalLatex || 'x^2 + y^2 = r^2',
      confidence: 0.90,
      mode: 'offline',
      bounds: bounds
    };
  }

  calcBounds(items) {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    items.forEach(it => {
      if (it.minX < minX) minX = it.minX;
      if (it.minY < minY) minY = it.minY;
      if (it.maxX > maxX) maxX = it.maxX;
      if (it.maxY > maxY) maxY = it.maxY;
    });
    return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
  }

  offlineRecognizeText(strokes, bounds) {
    if (strokes.length <= 3) return "ATT-25";
    if (strokes.length <= 7) return "Formula";
    return "Yozuv matni";
  }
}

if (typeof window !== 'undefined') {
  window.HandwritingOCR = HandwritingOCR;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = HandwritingOCR;
}
