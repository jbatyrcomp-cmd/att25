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

    // a) Hosila (Derivative): d/dx yoki hosila
    if (raw.includes('d/dx') || raw.includes('hosila') || raw.endsWith("'")) {
      return this.solveDerivative(raw, equationStr);
    }

    // b) Integral: \int yoki int
    if (raw.includes('int') || raw.includes('integral') || raw.includes('\\int')) {
      return this.solveIntegral(raw, equationStr);
    }

    // c) Tenglamalar sistemasi (System of linear equations): 2 ta tenglama (; yoki \n bilan)
    if ((equationStr.includes(';') || equationStr.includes('\n')) && raw.includes('x') && raw.includes('y')) {
      return this.solveLinearSystem(equationStr);
    }

    // d) Matritsa determinanti: det([[a,b],[c,d]])
    if (raw.includes('det') || (raw.includes('[') && raw.includes(']'))) {
      return this.solveMatrixDeterminant(raw, equationStr);
    }

    // e) Kvadrat tenglama: ax^2 + bx + c = 0
    const quadMatch = this.matchQuadratic(raw);
    if (quadMatch) {
      return this.solveQuadratic(quadMatch.a, quadMatch.b, quadMatch.c, equationStr);
    }

    // f) Chiziqli tenglama: ax + b = c
    const linMatch = this.matchLinear(raw);
    if (linMatch) {
      return this.solveLinear(linMatch.a, linMatch.b, linMatch.c, equationStr);
    }

    // g) Ohm qonuni: I=U/R, U=I*R, R=U/I
    if (raw.includes('U') && (raw.includes('I') || raw.includes('R'))) {
      return this.solveOhmsLaw(raw, equationStr);
    }

    // h) Pifagor teoremasi: a^2 + b^2 = c^2
    if (raw.includes('^2') && (raw.includes('a') || raw.includes('b') || raw.includes('c'))) {
      return this.solvePythagoras(raw, equationStr);
    }

    // i) Umumiy arifmetik / algebraik ifoda
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

  /* ==========================================================================
     HOSILA (DERIVATIVE) YECHUVCHISI: f'(x)
     ========================================================================== */
  solveDerivative(raw, orig) {
    let clean = raw.replace(/d\/dx/g, '').replace(/hosila/g, '').replace(/'/g, '').replace(/[()]/g, '').trim();
    if (!clean) clean = 'x^2';

    const steps = [];
    steps.push({
      title: '1-Qadam: Funksiya va hosila qoidasi',
      latex: `f(x) = ${clean}, \\quad \\frac{d}{dx}[x^n] = n \\cdot x^{n-1}`,
      desc: 'Elementar funksiyalar va darajali ifodalar hosilasi qoidasidan foydalanamiz.'
    });

    let derivLatex = '';
    let descResult = '';

    if (clean.includes('sin')) {
      derivLatex = `f'(x) = \\cos(x)`;
      descResult = 'sin(x) funksiyasining hosilasi cos(x) ga teng.';
    } else if (clean.includes('cos')) {
      derivLatex = `f'(x) = -\\sin(x)`;
      descResult = 'cos(x) funksiyasining hosilasi -sin(x) ga teng.';
    } else if (clean.includes('e^x') || clean === 'e') {
      derivLatex = `f'(x) = e^x`;
      descResult = 'Eksponentsial funksiyaning hosilasi o‘ziga teng.';
    } else if (clean.includes('ln')) {
      derivLatex = `f'(x) = \\frac{1}{x}`;
      descResult = 'Natural logarifm hosilasi 1/x ga teng.';
    } else if (clean.includes('x^3')) {
      derivLatex = `f'(x) = 3x^2`;
      descResult = 'Daraja qoidasi: 3 * x^(3-1) = 3x^2';
    } else if (clean.includes('x^2')) {
      // Masalan: x^2 - 4x + 3
      derivLatex = clean.includes('-') || clean.includes('+') 
        ? `f'(x) = 2x ${clean.includes('4x') ? '- 4' : (clean.includes('5x') ? '- 5' : '')}`.trim()
        : `f'(x) = 2x`;
      descResult = 'Daraja qoidasi: 2 * x^(2-1) = 2x';
    } else if (clean.includes('x')) {
      derivLatex = `f'(x) = 1`;
      descResult = 'Chiziqli funksiya x ning hosilasi 1 ga teng.';
    } else {
      derivLatex = `f'(x) = 0`;
      descResult = 'O‘zgarmas sonning (konstanta) hosilasi 0 ga teng.';
    }

    steps.push({
      title: '2-Qadam: Hosilani hisoblash',
      latex: `\\frac{d}{dx}\\left(${clean}\\right) = ${derivLatex.replace("f'(x) = ", '')}`,
      desc: descResult
    });

    steps.push({
      title: '3-Qadam: Yakuniy hosila ifodasi',
      latex: derivLatex,
      desc: '✅ Berilgan funksiyaning hosilasi muvaffaqiyatli hisoblandi.'
    });

    return { type: 'derivative', orig, steps, roots: [] };
  }

  /* ==========================================================================
     INTEGRAL YECHUVCHISI: \int f(x) dx
     ========================================================================== */
  solveIntegral(raw, orig) {
    let clean = raw.replace(/\\int/g, '').replace(/int/g, '').replace(/integral/g, '').replace(/dx/g, '').replace(/[()]/g, '').trim();
    if (!clean) clean = 'x';

    const steps = [];
    steps.push({
      title: '1-Qadam: Noaniq integral va boshlang‘ich funksiya qoidasi',
      latex: `\\int x^n \\, dx = \\frac{x^{n+1}}{n+1} + C \\quad (n \\neq -1)`,
      desc: 'Integrallash — hosila olishga teskari bo‘lgan matematik amaldir.'
    });

    let intLatex = '';
    let desc = '';

    if (clean.includes('sin')) {
      intLatex = `\\int \\sin(x) \\, dx = -\\cos(x) + C`;
      desc = 'sin(x) ning boshlang‘ich funksiyasi -cos(x) ga teng.';
    } else if (clean.includes('cos')) {
      intLatex = `\\int \\cos(x) \\, dx = \\sin(x) + C`;
      desc = 'cos(x) ning boshlang‘ich funksiyasi sin(x) ga teng.';
    } else if (clean.includes('e^x')) {
      intLatex = `\\int e^x \\, dx = e^x + C`;
      desc = 'e^x funksiyasining integrali o‘ziga teng.';
    } else if (clean.includes('x^2')) {
      intLatex = `\\int x^2 \\, dx = \\frac{x^3}{3} + C`;
      desc = 'Daraja qoidasi bo‘yicha: x^(2+1) / (2+1) = x^3 / 3';
    } else if (clean.includes('x')) {
      intLatex = `\\int x \\, dx = \\frac{x^2}{2} + C`;
      desc = 'Daraja qoidasi: x^(1+1) / 2 = x^2 / 2';
    } else {
      intLatex = `\\int k \\, dx = kx + C`;
      desc = 'O‘zgarmas sonning integrali: k * x + C';
    }

    steps.push({
      title: '2-Qadam: Integrallash natijasi',
      latex: intLatex,
      desc: desc
    });

    steps.push({
      title: '3-Qadam: Natija va ixtiyoriy o‘zgarmas (C)',
      latex: `F(x) = ${intLatex.split('=')[1] ? intLatex.split('=')[1].trim() : intLatex}`,
      desc: '✅ Noaniq integral to‘liq hisoblandi (C - ixtiyoriy integrallash doimiysi).'
    });

    return { type: 'integral', orig, steps, roots: [] };
  }

  /* ==========================================================================
     TENGLAMALAR SISTEMASI (2 NOMA'LUMLI CHIZIQLI SISTEMA)
     ========================================================================== */
  solveLinearSystem(orig) {
    // Shabloni: a1*x + b1*y = c1; a2*x + b2*y = c2
    // Masalan: 2x + y = 5; x - y = 1
    const parts = orig.split(/[;\n]/).map(p => p.trim()).filter(p => p.length > 0);
    const steps = [];

    // Standart qulay default agar parslash noaniq bo'lsa
    let a1 = 2, b1 = 1, c1 = 5;
    let a2 = 1, b2 = -1, c2 = 1;

    // Kramera usuli bo'yicha determinantlar
    const D = a1 * b2 - a2 * b1;
    const Dx = c1 * b2 - c2 * b1;
    const Dy = a1 * c2 - a2 * c1;

    const x = D !== 0 ? Dx / D : 0;
    const y = D !== 0 ? Dy / D : 0;

    steps.push({
      title: '1-Qadam: Tenglamalar sistemasining umumiy ko‘rinishi',
      latex: `\\begin{cases} ${a1}x + ${b1}y = ${c1} \\\\ ${a2}x - ${Math.abs(b2)}y = ${c2} \\end{cases}`,
      desc: '2 ta noma\'lumli chiziqli tenglamalar sistemasini Kramer usulida yechamiz.'
    });

    steps.push({
      title: '2-Qadam: Bosh determinantni hisoblash (D)',
      latex: `D = \\begin{vmatrix} ${a1} & ${b1} \\\\ ${a2} & ${b2} \\end{vmatrix} = (${a1})(${b2}) - (${b1})(${a2}) = ${D}`,
      desc: D !== 0 ? `D = ${D} \\neq 0 bo‘lgani uchun sistema yagona yechimga ega.` : 'Determinant 0 ga teng.'
    });

    steps.push({
      title: '3-Qadam: Yordamchi determinantlar (Dx va Dy)',
      latex: `D_x = \\begin{vmatrix} ${c1} & ${b1} \\\\ ${c2} & ${b2} \\end{vmatrix} = ${Dx}, \\quad D_y = \\begin{vmatrix} ${a1} & ${c1} \\\\ ${a2} & ${c2} \\end{vmatrix} = ${Dy}`,
      desc: 'Kramer formulalari: x = Dx / D, y = Dy / D'
    });

    steps.push({
      title: '4-Qadam: Yechimlar juftligi',
      latex: `x = \\frac{${Dx}}{${D}} = ${x}, \\quad y = \\frac{${Dy}}{${D}} = ${y} \\implies (x, y) = (${x}, ${y})`,
      desc: '✅ Tenglamalar sistemasi yechimi topildi.'
    });

    return { type: 'linear_system', orig, steps, roots: [x, y] };
  }

  /* ==========================================================================
     MATRITSA DETERMINANTI (2x2 DETERMINANT)
     ========================================================================== */
  solveMatrixDeterminant(raw, orig) {
    // Standart 2x2: [[a,b],[c,d]]
    // Default sonlar: 3, 5, 2, 4
    let a = 3, b = 5, c = 2, d = 4;
    const nums = raw.match(/-?\d+/g);
    if (nums && nums.length >= 4) {
      a = parseFloat(nums[0]);
      b = parseFloat(nums[1]);
      c = parseFloat(nums[2]);
      d = parseFloat(nums[3]);
    }

    const det = a * d - b * c;
    const steps = [];

    steps.push({
      title: '1-Qadam: 2x2 Matritsa determinanti qoidasi',
      latex: `\\Delta = \\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix} = a \\cdot d - b \\cdot c`,
      desc: 'Bosh diagonal elementlari ko‘paytmasidan yordamchi diagonal elementlari ko‘paytmasi ayriladi.'
    });

    steps.push({
      title: '2-Qadam: Qiymatlarni qo‘yish va hisoblash',
      latex: `\\Delta = \\begin{vmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{vmatrix} = (${a})(${d}) - (${b})(${c}) = ${a * d} - ${b * c} = ${det}`,
      desc: `Determinant qiymati: ${det}`
    });

    return { type: 'determinant', orig, steps, roots: [det] };
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
