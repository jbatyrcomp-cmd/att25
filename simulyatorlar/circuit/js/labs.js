/* ==========================================================================
   GUIDED LABS & AUTOMATIC VERIFICATION ENGINE
   ATT-25 Circuit Lab 7-Stage Curriculum
   ========================================================================== */

const GUIDED_LABS = [
  {
    id: 'lab1',
    badge: '1-BOSQICH • ODDIY ZANJIR',
    title: 'Mening Birinchi Zanjirim',
    desc: '9V batareya, kalit va lampochkani simlar bilan ulab, yopiq elektr zanjirini hosil qiling va kalitni bosing.',
    theory: 'Elektr toki faqat yopiq zanjir bo‘ylab oqadi. Musbat (+) qutbdan chiquvchi tok yuklama orqali manfiy (-) qutbga qaytadi.',
    check: (engine) => {
      const hasBat = engine.components.some(c => c.type === 'battery');
      const hasBulb = engine.components.some(c => c.type === 'bulb');
      const hasSwitch = engine.components.some(c => c.type === 'switch');
      const bulbLit = engine.components.some(c => c.type === 'bulb' && Math.abs(c.current) > 0.02);
      return hasBat && hasBulb && hasSwitch && bulbLit;
    },
    setup: (app) => {
      app.clearCircuit();
      const bat = app.addComponent('battery', 180, 240);
      const sw = app.addComponent('switch', 340, 160);
      const bulb = app.addComponent('bulb', 340, 320);
      // Let student connect the wires or provide initial placed parts
    }
  },
  {
    id: 'lab2',
    badge: '2-BOSQICH • OHM QONUNI',
    title: 'Ohm Qonunini Isbotlash',
    desc: '9V manbaga 220Ω rezistorni ulang. Multimetr yordamida zanjirdagi tok kuchini o‘lchang: I = U / R (≈ 40.9 mA).',
    theory: 'Ohm qonuniga ko‘ra, o‘tkazgichdagi tok kuchi uning uchlaridagi kuchlanishga to‘g‘ri va qarshilikka teskari mutanosibdir (I = U / R).',
    check: (engine) => {
      const rComp = engine.components.find(c => c.type === 'resistor');
      return rComp && Math.abs(rComp.current) > 0.005;
    },
    setup: (app) => {
      app.clearCircuit();
      app.addComponent('battery', 180, 240);
      app.addComponent('resistor', 340, 240);
    }
  },
  {
    id: 'lab3',
    badge: '3-BOSQICH • YARIMO‘TKAZGICHLAR',
    title: 'LED ni To‘g‘ri Yoqish (Kuyishdan Himoyalash)',
    desc: 'LED ni 9V manbaga to‘g‘ridan-to‘g‘ri ulamang (u kuyib ketadi!). Cheklovchi 330Ω rezistor orqali xavfsiz yoqing.',
    theory: 'Yorug‘lik diodi (LED) minimal ichki qarshilikka ega. To‘g‘ridan-to‘g‘ri yuqori kuchlanishga ulasangiz, 30mA dan yuqori tok o‘tib uni kuydiradi.',
    check: (engine) => {
      const led = engine.components.find(c => c.type === 'led');
      const r = engine.components.find(c => c.type === 'resistor');
      return led && r && !led.isBlown && Math.abs(led.current) > 0.005 && Math.abs(led.current) < 0.04;
    },
    setup: (app) => {
      app.clearCircuit();
      app.addComponent('battery', 160, 240);
      app.addComponent('resistor', 300, 180);
      app.addComponent('led', 420, 240);
    }
  },
  {
    id: 'lab4',
    badge: '4-BOSQICH • ULASH USULLARI',
    title: 'Ketma-ket va Parallel Ulanish',
    desc: '2 ta lampochkani parallel ulang va har biriga to‘liq 9V kuchlanish tushishini tekshiring.',
    theory: 'Ketma-ket ulanganda kuchlanish bo‘linadi (U = U1 + U2), parallel ulanganda esa barcha shoxobchalarda kuchlanish bir xil bo‘ladi (U = U1 = U2).',
    check: (engine) => {
      const bulbs = engine.components.filter(c => c.type === 'bulb');
      const bothLit = bulbs.length >= 2 && bulbs.every(b => Math.abs(b.current) > 0.05);
      return bothLit;
    },
    setup: (app) => {
      app.clearCircuit();
      app.addComponent('battery', 160, 240);
      app.addComponent('bulb', 320, 170);
      app.addComponent('bulb', 320, 310);
    }
  },
  {
    id: 'lab5',
    badge: '5-BOSQICH • SIGNALIZATSIYA',
    title: 'Pyezo Buzzerli Xavfsizlik Qo‘ng‘irog‘i',
    desc: 'Batareya, kalit va pyezo buzzerni ulab, signalizatsiya zanjirini yarating. Kalit bosilganda haqiqiy ovoz chiqadi.',
    theory: 'Pyezo buzzer elektr energiyasini pyezoelektrik kristal tebranishlari orqali akustik tovush to‘lqinlariga aylantiradi.',
    check: (engine) => {
      const bz = engine.components.find(c => c.type === 'buzzer');
      return bz && Math.abs(bz.current) > 0.01;
    },
    setup: (app) => {
      app.clearCircuit();
      app.addComponent('battery', 160, 240);
      app.addComponent('switch', 300, 180);
      app.addComponent('buzzer', 420, 240);
    }
  },
  {
    id: 'lab6',
    badge: '6-BOSQICH • RAQAMLI MANTIQ',
    title: 'Mantiqiy "VA" (AND) Sxemasi',
    desc: 'Ikkita kalitni ketma-ket ulang: faqat ikkala kalit ham yopilgandagina lampochka yonishi kerak (A ∧ B = Y).',
    theory: 'Mantiqiy "VA" (AND) amali: chiqish faqat barcha kirishlar "1" (yoqiq) bo‘lgandagina "1" bo‘ladi.',
    check: (engine) => {
      const switches = engine.components.filter(c => c.type === 'switch');
      const bulb = engine.components.find(c => c.type === 'bulb');
      return switches.length >= 2 && bulb && Math.abs(bulb.current) > 0.02;
    },
    setup: (app) => {
      app.clearCircuit();
      app.addComponent('battery', 140, 240);
      app.addComponent('switch', 280, 160);
      app.addComponent('switch', 400, 160);
      app.addComponent('bulb', 400, 320);
    }
  },
  {
    id: 'lab7',
    badge: '7-BOSQICH • ERKIN IJOD',
    title: 'Erkin Laboratoriya (Sandbox)',
    desc: 'Cheklovlarsiz istalgan elektr sxemasini o‘zingiz noldan loyihalashtiring va o‘lchov asboblari bilan sinang.',
    theory: 'Kreativ muhandislik: bilimlaringizni qo‘llab murakkab sxemalar yarating.',
    check: () => true,
    setup: (app) => {
      app.clearCircuit();
      app.toast("Erkin laboratoriya ochildi! Palitradan elementlarni tortib qo'ying.");
    }
  }
];

window.GUIDED_LABS = GUIDED_LABS;
