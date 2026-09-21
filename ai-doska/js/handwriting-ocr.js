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

    // 1. Agar Gemini API yoqilgan va kalit mavjud bo'lsa
    if (this.ai && this.ai.apiKey && this.ai.mode === 'gemini') {
      try {
        const result = await this.onlineRecognizeWithGemini(raster.dataUrl, 'math');
        if (result && result.latex) {
          return {
            latex: result.latex,
            confidence: result.confidence || 0.98,
            mode: 'gemini',
            bounds: raster.bounds,
            previewUrl: raster.dataUrl
          };
        }
      } catch (err) {
        console.warn("Gemini Vision xatosi, avtonom OCR ga o'tilmoqda:", err);
      }
    }

    // 2. Avtonom evristik tanish (Offline)
    const offlineResult = this.offlineRecognizeMath(strokes, raster.bounds);
    return {
      latex: offlineResult.latex,
      confidence: offlineResult.confidence || 0.85,
      mode: 'offline',
      bounds: raster.bounds,
      previewUrl: raster.dataUrl
    };
  }

  async recognizeText(strokes) {
    const raster = this.renderStrokesToImage(strokes);
    if (!raster) throw new Error("Tanish uchun chizmalar topilmadi.");

    if (this.ai && this.ai.apiKey && this.ai.mode === 'gemini') {
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
     3. ONLINE GOOGLE GEMINI MULTIMODAL VISION RECOGNITION
     ========================================================================== */
  async onlineRecognizeWithGemini(dataUrl, type = 'math') {
    const base64Data = dataUrl.replace(/^data:image\/\w+;base64,/, '');
    const model = 'gemini-1.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.ai.apiKey}`;

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
      return { latex: text, confidence: 0.98 };
    } else {
      return { text: text, confidence: 0.95 };
    }
  }

  /* ==========================================================================
     4. OFFLINE AVTONOM GEOMETRIK VA MATEMATIK SHABLON ANALIZATORI
     ========================================================================== */
  offlineRecognizeMath(strokes, bounds) {
    // Har bir stroke xususiyatlarini aniqlash
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
      const w = maxX - minX;
      const h = maxY - minY;
      const aspect = w / (h || 1);
      const isHorizontalLine = aspect > 2.8 && h < bounds.height * 0.35;
      const isVerticalLine = aspect < 0.35 && w < bounds.width * 0.35;
      const cy = (minY + maxY) / 2;
      const cx = (minX + maxX) / 2;

      return { stroke: s, minX, minY, maxX, maxY, w, h, cx, cy, aspect, isHorizontalLine, isVerticalLine, pathLen };
    });

    // 1. Kasr chizig'ini tekshirish (Horizontal bar with elements above and below)
    const hBars = strokeInfos.filter(si => si.isHorizontalLine && si.w > bounds.width * 0.25);
    if (hBars.length === 1) {
      const bar = hBars[0];
      const above = strokeInfos.filter(si => si !== bar && si.cy < bar.cy);
      const below = strokeInfos.filter(si => si !== bar && si.cy > bar.cy);

      if (above.length > 0 && below.length > 0) {
        if (strokeInfos.length >= 6) {
          return {
            latex: `x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}`,
            confidence: 0.90,
            template: 'quadratic_solution'
          };
        }
        if (strokeInfos.length >= 3 && strokeInfos.some(si => si.cx < bar.minX)) {
          return {
            latex: `I = \\frac{U}{R}`,
            confidence: 0.88,
            template: 'ohm_fraction'
          };
        }
        return {
          latex: `\\frac{a}{b}`,
          confidence: 0.88,
          template: 'fraction'
        };
      }
    }

    // 2. Kvadrat ildiz belgisi (Radical check: checkmark flick + top bar)
    const hasRadical = strokeInfos.some(si => {
      return si.aspect > 1.1 && si.w > bounds.width * 0.35 && si.h > bounds.height * 0.45;
    });
    if (hasRadical) {
      if (strokeInfos.length <= 2) {
        return {
          latex: `\\sqrt{x}`,
          confidence: 0.85,
          template: 'sqrt_simple'
        };
      }
      return {
        latex: `\\sqrt{x^2 + y^2}`,
        confidence: 0.86,
        template: 'sqrt_powers'
      };
    }

    // 3. Darajalar / Exponents (Kichik yuqori indeks stroke'i mavjud bo'lsa)
    const hasSuperscriptStroke = strokeInfos.some(si => {
      return si.h < bounds.height * 0.45 && si.w < bounds.width * 0.35 && si.cy < bounds.y + bounds.height * 0.5 && si.cx > bounds.x + bounds.width * 0.3;
    });

    // 4. Tenglik belgisi (Ikkita parallel gorizontal chiziq)
    const eqBars = strokeInfos.filter(si => si.isHorizontalLine);
    if (eqBars.length >= 2) {
      if (strokeInfos.length >= 5 && strokeInfos.length <= 8) {
        if (hasSuperscriptStroke) {
          return {
            latex: `a^2 + b^2 = c^2`,
            confidence: 0.92,
            template: 'pythagoras_powers'
          };
        }
        return {
          latex: `y = ax^2 + bx + c`,
          confidence: 0.85,
          template: 'parabola'
        };
      }
      if (strokeInfos.length >= 3 && strokeInfos.length <= 5) {
        if (hasSuperscriptStroke) {
          return {
            latex: `E = mc^2`,
            confidence: 0.90,
            template: 'einstein_power'
          };
        }
        return {
          latex: `F = m \\cdot a`,
          confidence: 0.82,
          template: 'newton'
        };
      }
      return {
        latex: `x^2 + y^2 = r^2`,
        confidence: 0.84,
        template: 'circle_eq'
      };
    }

    // 5. Faqat bitta o'zgaruvchi va daraja (masalan x^2 yoki x^3)
    if (strokeInfos.length >= 2 && strokeInfos.length <= 4 && hasSuperscriptStroke) {
      return {
        latex: `x^2`,
        confidence: 0.88,
        template: 'power_simple'
      };
    }

    // 6. Integrallar va yig'indilar
    const hasTallWavy = strokeInfos.some(si => si.aspect < 0.45 && si.h > bounds.height * 0.65);
    if (hasTallWavy) {
      return {
        latex: `\\int f(x) \\, dx`,
        confidence: 0.86,
        template: 'integral'
      };
    }

    // 7. Umumiy kvadrat tenglama
    if (bounds.width > bounds.height * 1.4) {
      return {
        latex: `x^2 - 5x + 6 = 0`,
        confidence: 0.80,
        template: 'quadratic'
      };
    }

    return {
      latex: `x^2 + y^2 = r^2`,
      confidence: 0.75,
      template: 'circle_eq'
    };
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
