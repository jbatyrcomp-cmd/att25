/* ==========================================================================
   ATT-25 AI DOSKA — MATHEMATICS & PHYSICS SOLVER + PLOTTER (math-solver.js)
   Tenglamalarni bosqichma-bosqich yechish va 2D Funksiya grafigini chizish
   ========================================================================== */

class MathSolver {
  constructor(boardEngine) {
    this.board = boardEngine;
  }

  /* ==========================================================================
     1. TENGLAMALAR VA MASALALARNI YECHISH
     ========================================================================== */
  solve(equationStr) {
    const raw = equationStr.replace(/\s+/g, '').replace(/\\cdot/g, '*').replace(/\\times/g, '*');

    // a) Kvadrat tenglama: ax^2 + bx + c = 0
    const quadMatch = this.matchQuadratic(raw);
    if (quadMatch) {
      return this.solveQuadratic(quadMatch.a, quadMatch.b, quadMatch.c, equationStr);
    }

    // b) Chiziqli tenglama: ax + b = c
    const linMatch = this.matchLinear(raw);
    if (linMatch) {
      return this.solveLinear(linMatch.a, linMatch.b, linMatch.c, equationStr);
    }

    // c) Ohm qonuni: I=U/R, U=I*R, R=U/I
    if (raw.includes('U') && (raw.includes('I') || raw.includes('R'))) {
      return this.solveOhmsLaw(raw, equationStr);
    }

    // d) Pifagor teoremasi: a^2 + b^2 = c^2
    if (raw.includes('^2') && (raw.includes('a') || raw.includes('b') || raw.includes('c'))) {
      return this.solvePythagoras(raw, equationStr);
    }

    // e) Umumiy arifmetik / algebraik ifoda
    return this.solveGeneral(equationStr);
  }

  // Kvadrat tenglama koeffitsientlarini ajratish
  matchQuadratic(str) {
    // Shabloni: a?x^2 [+-] b?x [+-] c = 0
    // Masalan: x^2-5x+6=0, 2x^2+3x-5=0, x^2-9=0, x^2+4x=0
    const eqIdx = str.indexOf('=');
    const left = eqIdx !== -1 ? str.substring(0, eqIdx) : str;

    if (!left.includes('x^2')) return null;

    let a = 0, b = 0, c = 0;

    // x^2 qismi
    const x2Match = left.match(/([+-]?\d*)x\^2/);
    if (x2Match) {
      if (x2Match[1] === '' || x2Match[1] === '+') a = 1;
      else if (x2Match[1] === '-') a = -1;
      else a = parseFloat(x2Match[1]);
    }

    // x qismi (x^2 bo'lmagan)
    const afterX2 = left.replace(/[+-]?\d*x\^2/, '');
    const xMatch = afterX2.match(/([+-]?\d*)x(?!\^)/);
    if (xMatch) {
      if (xMatch[1] === '' || xMatch[1] === '+') b = 1;
      else if (xMatch[1] === '-') b = -1;
      else b = parseFloat(xMatch[1]);
    }

    // Ozod had c
    const afterX = afterX2.replace(/[+-]?\d*x(?!\^)/, '');
    if (afterX) {
      c = parseFloat(afterX) || 0;
    }

    // Agar o'ng tomonda son bo'lsa: = d => c -= d
    if (eqIdx !== -1) {
      const right = parseFloat(str.substring(eqIdx + 1)) || 0;
      c -= right;
    }

    return a !== 0 ? { a, b, c } : null;
  }

  solveQuadratic(a, b, c, orig) {
    const D = b * b - 4 * a * c;
    const steps = [];

    steps.push({
      title: '1-Qadam: Koeffitsientlarni aniqlash',
      latex: `a = ${a}, \\quad b = ${b}, \\quad c = ${c}`,
      desc: `Kvadrat tenglamaning umumiy ko'rinishi: ax^2 + bx + c = 0`
    });

    const dFormula = `D = b^2 - 4ac = (${b})^2 - 4 \\cdot (${a}) \\cdot (${c}) = ${b * b} - (${4 * a * c}) = ${D}`;
    steps.push({
      title: '2-Qadam: Diskriminantni hisoblash',
      latex: dFormula,
      desc: D > 0 ? `D > 0 bo'lgani uchun 2 ta haqiqiy ildiz mavjud.` : (D === 0 ? `D = 0 bo'lgani uchun 1 ta karrali ildiz mavjud.` : `D < 0 bo'lgani uchun haqiqiy ildizlar yo'q (kompleks ildizlar mavjud).`)
    });

    if (D > 0) {
      const sqrtD = Math.sqrt(D);
      const isInt = Number.isInteger(sqrtD);
      const sqrtStr = isInt ? sqrtD.toString() : `\\sqrt{${D}} \\approx ${sqrtD.toFixed(3)}`;
      const x1 = (-b + sqrtD) / (2 * a);
      const x2 = (-b - sqrtD) / (2 * a);

      steps.push({
        title: '3-Qadam: Ildizlar formulasini qo\'llash',
        latex: `x_{1,2} = \\frac{-b \\pm \\sqrt{D}}{2a} = \\frac{-(${b}) \\pm ${sqrtStr}}{2 \\cdot (${a})}`,
        desc: `Musbat va manfiy ishora bo'yicha hisoblaymiz`
      });

      steps.push({
        title: '4-Qadam: Yakuniy javob',
        latex: `x_1 = ${isInt && Number.isInteger(x1) ? x1 : x1.toFixed(3)}, \\quad x_2 = ${isInt && Number.isInteger(x2) ? x2 : x2.toFixed(3)}`,
        desc: `✅ Tenglama ildizlari muvaffaqiyatli topildi.`
      });
    } else if (D === 0) {
      const x = -b / (2 * a);
      steps.push({
        title: '3-Qadam: Yagona ildizni hisoblash',
        latex: `x = \\frac{-b}{2a} = \\frac{-(${b})}{2 \\cdot (${a})} = ${x}`,
        desc: `✅ Yagona haqiqiy ildiz.`
      });
    } else {
      const realPart = (-b / (2 * a)).toFixed(2);
      const imagPart = (Math.sqrt(-D) / (2 * a)).toFixed(2);
      steps.push({
        title: '3-Qadam: Kompleks ildizlar',
        latex: `x_{1,2} = ${realPart} \\pm ${Math.abs(imagPart)}i`,
        desc: `✅ Kompleks sonlar maydonidagi ildizlar.`
      });
    }

    return {
      type: 'quadratic',
      orig,
      steps,
      funcStr: `${a}*x^2 + ${b}*x + ${c}`,
      roots: D >= 0 ? [(-b + Math.sqrt(Math.max(0, D))) / (2 * a), (-b - Math.sqrt(Math.max(0, D))) / (2 * a)] : []
    };
  }

  // Chiziqli tenglama: ax + b = c
  matchLinear(str) {
    if (str.includes('x^2')) return null;
    const eqIdx = str.indexOf('=');
    if (!str.includes('x') || eqIdx === -1) return null;

    const left = str.substring(0, eqIdx);
    const right = parseFloat(str.substring(eqIdx + 1)) || 0;

    let a = 1, b = 0;
    const xMatch = left.match(/([+-]?\d*)x/);
    if (xMatch) {
      if (xMatch[1] === '' || xMatch[1] === '+') a = 1;
      else if (xMatch[1] === '-') a = -1;
      else a = parseFloat(xMatch[1]);
    }

    const rest = left.replace(/[+-]?\d*x/, '');
    if (rest) b = parseFloat(rest) || 0;

    return a !== 0 ? { a, b, c: right } : null;
  }

  solveLinear(a, b, c, orig) {
    const steps = [];
    steps.push({
      title: '1-Qadam: Tenglamani soddalashtirish',
      latex: `${a}x + (${b}) = ${c}`,
      desc: `Ozod hadni o'ng tomonga o'tkazamiz`
    });

    const rhs = c - b;
    steps.push({
      title: '2-Qadam: O\'zgaruvchini ajratish',
      latex: `${a}x = ${c} - (${b}) = ${rhs}`,
      desc: `Ikkala tomonni ${a} ga bo'lamiz`
    });

    const ans = rhs / a;
    steps.push({
      title: '3-Qadam: Natija',
      latex: `x = \\frac{${rhs}}{${a}} = ${Number.isInteger(ans) ? ans : ans.toFixed(3)}`,
      desc: `✅ Chiziqli tenglama yechimi.`
    });

    return { type: 'linear', orig, steps, funcStr: `${a}*x + ${b - c}`, roots: [ans] };
  }

  solveOhmsLaw(raw, orig) {
    const steps = [];
    steps.push({
      title: 'Ohm Qonuni va Zanjir Formulalari',
      latex: `I = \\frac{U}{R}, \\quad U = I \\cdot R, \\quad R = \\frac{U}{I}, \\quad P = U \\cdot I`,
      desc: `Zanjir qismidagi tok kuchi kuchlanishga to'g'ri, qarshilikka teskari mutanosib.`
    });
    steps.push({
      title: 'O\'lchov Birliklari',
      latex: `[I] = \\text{Amper (A)}, \\quad [U] = \\text{Volt (V)}, \\quad [R] = \\text{Ohm (}\\Omega\\text{)}, \\quad [P] = \\text{Vatt (W)}`,
      desc: `SI xalqaro birliklar tizimida ifodalanishi.`
    });
    return { type: 'ohms_law', orig, steps, roots: [] };
  }

  solvePythagoras(raw, orig) {
    const steps = [];
    steps.push({
      title: 'Pifagor Teoremasi',
      latex: `a^2 + b^2 = c^2 \\implies c = \\sqrt{a^2 + b^2}`,
      desc: `To'g'ri burchakli uchburchak gipotenuzasining kvadrati katetlar kvadratlari yig'indisiga teng.`
    });
    steps.push({
      title: 'Katetlarni hisoblash',
      latex: `a = \\sqrt{c^2 - b^2}, \\quad b = \\sqrt{c^2 - a^2}`,
      desc: `Ixtiyoriy noma'lum tomonni topish formulalari.`
    });
    return { type: 'pythagoras', orig, steps, roots: [] };
  }

  solveGeneral(orig) {
    return {
      type: 'general',
      orig,
      steps: [{
        title: 'Formula Ifodasi',
        latex: orig,
        desc: `Kiritilgan matematik yoki fizik formula.`
      }],
      roots: []
    };
  }

  /* ==========================================================================
     2. YECHIMNI DOSKAGA JOYLASHTIRISH (STIKERLAR KLASTERI)
     ========================================================================== */
  renderSolutionOnBoard(solution, startX, startY) {
    return this.placeSolutionOnBoard(solution, startX, startY);
  }

  placeSolutionOnBoard(solution, startX, startY) {
    const objects = [];
    const w = 320;
    const h = 100;
    const gap = 20;

    // Sarlavha stikeri
    objects.push({
      type: 'sticky',
      x: startX,
      y: startY,
      width: w,
      height: 90,
      bgColor: '#BAE6FD',
      textColor: '#0C4A6E',
      text: `🧮 MASALA YECHIMI\n• Masala: ${solution.orig}\n• Turi: ${solution.type.toUpperCase()}`
    });

    // Har bir qadam uchun formula va izoh
    solution.steps.forEach((s, i) => {
      const y = startY + 110 + i * (h + gap);

      // Formula bloki
      objects.push({
        type: 'formula',
        x: startX,
        y: y,
        width: w,
        height: 70,
        latex: s.latex,
        color: '#10B981',
        fontSize: 22
      });

      // Izoh matni
      objects.push({
        type: 'text',
        x: startX + 10,
        y: y + 74,
        text: `• ${s.title}: ${s.desc}`,
        color: '#CBD5E1',
        fontSize: 11,
        fontWeight: 600
      });

      // Bog'lovchi strelka (navbatdagi qadamga)
      if (i < solution.steps.length - 1) {
        objects.push({
          type: 'arrow',
          x1: startX + w / 2,
          y1: y + h - 5,
          x2: startX + w / 2,
          y2: y + h + gap - 10,
          color: '#64748B',
          strokeWidth: 2
        });
      }
    });

    // Agar funksiya grafigi mavjud bo'lsa, o'ng tomoniga 2D grafigini ham joylash!
    if (solution.funcStr) {
      objects.push(this.createGraphObject(solution.funcStr, startX + w + 50, startY + 20, 380, 280));
    }

    this.board.saveState();
    objects.forEach(o => this.board.addObject(o, false));
    return objects;
  }

  /* ==========================================================================
     3. 2D FUNKSIYA GRAFIGI DVIGATELI (GRAPH PLOTTER)
     ========================================================================== */
  createGraphObject(funcStr, x, y, width = 420, height = 300) {
    return {
      type: 'graph',
      x: x,
      y: y,
      width: width,
      height: height,
      funcStr: funcStr,
      title: `y = ${funcStr}`,
      color: '#00FF87',
      rangeX: [-6, 6],
      rangeY: [-4, 6]
    };
  }

  // Matematik ifodani x bo'yicha baholash: f(x)
  evaluateFunction(funcStr, x) {
    return MathSolver.eval(funcStr, x);
  }

  static eval(funcStr, x) {
    try {
      let expr = funcStr
        .replace(/(\d+)x/g, '$1*x')
        .replace(/x\^(\d+)/g, 'Math.pow(x, $1)')
        .replace(/x\^2/g, 'x*x')
        .replace(/x\^3/g, 'x*x*x')
        .replace(/sin/g, 'Math.sin')
        .replace(/cos/g, 'Math.cos')
        .replace(/tan/g, 'Math.tan')
        .replace(/sqrt/g, 'Math.sqrt')
        .replace(/abs/g, 'Math.abs')
        .replace(/ln/g, 'Math.log')
        .replace(/log/g, 'Math.log10')
        .replace(/pi/g, 'Math.PI')
        .replace(/e/g, 'Math.E');

      const fn = new Function('x', `return ${expr};`);
      const val = fn(x);
      return Number.isFinite(val) ? val : null;
    } catch (e) {
      return null;
    }
  }
}

if (typeof window !== 'undefined') {
  window.MathSolver = MathSolver;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MathSolver;
}
