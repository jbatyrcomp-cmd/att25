/* ==========================================================================
   ATT-25 AI DOSKA — CODE & FLOWCHART BRIDGE (code-bridge.js)
   Python / JS Kodini Blok-sxemaga va Blok-sxemani Kodga aylantirish
   ========================================================================== */

class CodeBridge {
  constructor(boardEngine) {
    this.board = boardEngine;
  }

  /* ==========================================================================
     1. KODDAN BLOK-SXEMA GENERATSIYA QILISH (CODE TO FLOWCHART)
     ========================================================================== */
  codeToFlowchart(codeText, originX = 0, originY = -200) {
    const lines = codeText.split('\n').map(l => l.trim()).filter(l => l.length > 0 && !l.startsWith('#') && !l.startsWith('//'));
    const objects = [];

    const w = 220;
    const h = 50;
    const gap = 34;

    let currY = originY;

    // 1. Boshlanish
    objects.push({
      type: 'circle',
      x: originX - 70,
      y: currY,
      radiusX: 70,
      radiusY: 26,
      color: '#10B981',
      strokeWidth: 2,
      filled: true,
      fillColor: 'rgba(16,185,129,0.2)'
    });
    objects.push({
      type: 'text',
      x: originX - 44,
      y: currY + 16,
      text: 'Boshlash',
      color: '#F8FAFC',
      fontSize: 14,
      fontWeight: 700
    });

    let prevY = currY + 52;
    currY += 52 + gap;

    // Har bir kod qatorini tahlil qilish
    lines.forEach((line, idx) => {
      // Strelka
      objects.push({
        type: 'arrow',
        x1: originX,
        y1: prevY,
        x2: originX,
        y2: currY,
        color: '#64748B',
        strokeWidth: 2
      });

      // a) Shart: if / else if
      if (line.startsWith('if ') || line.startsWith('elif ') || line.startsWith('if(')) {
        const cond = line.replace(/^(if|elif|\()\s*/, '').replace(/[:{)]/g, '').trim();
        objects.push({
          type: 'diamond',
          x: originX - w / 2,
          y: currY,
          width: w,
          height: 68,
          color: '#F59E0B',
          strokeWidth: 2,
          filled: true,
          fillColor: 'rgba(245,158,11,0.2)'
        });
        objects.push({
          type: 'text',
          x: originX - w / 2 + 25,
          y: currY + 24,
          text: `${cond} ?`,
          color: '#F8FAFC',
          fontSize: 13,
          fontWeight: 700
        });

        // Yon tomonga "Ha" yo'nalishi
        objects.push({
          type: 'arrow',
          x1: originX + w / 2,
          y1: currY + 34,
          x2: originX + w / 2 + 80,
          y2: currY + 34,
          color: '#10B981',
          strokeWidth: 2
        });
        objects.push({
          type: 'text',
          x: originX + w / 2 + 15,
          y: currY + 16,
          text: 'Ha',
          color: '#10B981',
          fontSize: 11,
          fontWeight: 700
        });

        prevY = currY + 68;
        currY += 68 + gap;
        return;
      }

      // b) Sikl: for / while
      if (line.startsWith('for ') || line.startsWith('while ') || line.startsWith('while(')) {
        const loopCond = line.replace(/[:{]/g, '').trim();
        objects.push({
          type: 'diamond',
          x: originX - w / 2,
          y: currY,
          width: w,
          height: 68,
          color: '#A855F7',
          strokeWidth: 2,
          filled: true,
          fillColor: 'rgba(168,85,247,0.2)'
        });
        objects.push({
          type: 'text',
          x: originX - w / 2 + 20,
          y: currY + 24,
          text: loopCond,
          color: '#F8FAFC',
          fontSize: 12,
          fontWeight: 700
        });

        prevY = currY + 68;
        currY += 68 + gap;
        return;
      }

      // c) Kirish / Chiqish: print / input / console.log
      if (line.includes('print') || line.includes('input') || line.includes('console.log')) {
        objects.push({
          type: 'rect',
          x: originX - w / 2,
          y: currY,
          width: w,
          height: h,
          color: '#06B6D4',
          strokeWidth: 2,
          filled: true,
          fillColor: 'rgba(6,182,212,0.2)'
        });
        objects.push({
          type: 'text',
          x: originX - w / 2 + 16,
          y: currY + 16,
          text: line.length > 26 ? line.substring(0, 24) + '...' : line,
          color: '#F8FAFC',
          fontSize: 12,
          fontWeight: 600
        });

        prevY = currY + h;
        currY += h + gap;
        return;
      }

      // d) Oddiy jarayon (Assignment / Process)
      objects.push({
        type: 'rect',
        x: originX - w / 2,
        y: currY,
        width: w,
        height: h,
        color: '#38BDF8',
        strokeWidth: 2,
        filled: true,
        fillColor: 'rgba(56,189,248,0.2)'
      });
      objects.push({
        type: 'text',
        x: originX - w / 2 + 16,
        y: currY + 16,
        text: line.length > 26 ? line.substring(0, 24) + '...' : line,
        color: '#F8FAFC',
        fontSize: 12,
        fontWeight: 600
      });

      prevY = currY + h;
      currY += h + gap;
    });

    // Tugash (End Oval)
    objects.push({
      type: 'arrow',
      x1: originX,
      y1: prevY,
      x2: originX,
      y2: currY,
      color: '#64748B',
      strokeWidth: 2
    });

    objects.push({
      type: 'circle',
      x: originX - 70,
      y: currY,
      radiusX: 70,
      radiusY: 26,
      color: '#EF4444',
      strokeWidth: 2,
      filled: true,
      fillColor: 'rgba(239,68,68,0.2)'
    });
    objects.push({
      type: 'text',
      x: originX - 38,
      y: currY + 16,
      text: 'Tamom',
      color: '#F8FAFC',
      fontSize: 14,
      fontWeight: 700
    });

    this.board.saveState();
    objects.forEach(o => this.board.addObject(o, false));
    return objects;
  }

  /* ==========================================================================
     2. BLOK-SXEMADAN KOD GENERATSIYA QILISH (FLOWCHART TO CODE)
     ========================================================================== */
  flowchartToCode(language = 'python') {
    const objs = this.board.objects;
    const texts = objs.filter(o => o.type === 'text').map(o => o.text);

    let code = language === 'python' ? '# ATT-25 AI Doska tomonidan generatsiya qilingan kod\n\n' : '// ATT-25 AI Doska tomonidan generatsiya qilingan kod\n\n';

    texts.forEach(t => {
      if (t === 'Boshlash' || t === 'Tamom' || t === 'Ha' || t === 'Yo‘q') return;

      if (t.includes('?')) {
        const cond = t.replace('?', '').trim();
        code += language === 'python' ? `if ${cond}:\n    pass  # Shart bajarilganda\n` : `if (${cond}) {\n    // Shart bajarilganda\n}\n`;
      } else if (t.includes('=')) {
        code += `${t}\n`;
      } else if (t.includes('print') || t.includes('Chiqarish')) {
        code += language === 'python' ? `print("${t}")\n` : `console.log("${t}");\n`;
      } else {
        code += `# Jarayon: ${t}\n`;
      }
    });

    return code;
  }
}

if (typeof window !== 'undefined') {
  window.CodeBridge = CodeBridge;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CodeBridge;
}
