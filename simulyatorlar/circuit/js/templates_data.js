/* ==========================================================================
   ATT-25 CIRCUIT LAB - 200 READY-MADE CIRCUIT TEMPLATES DATABASE
   Full 200 Interactive Electronics & Circuit Design Templates in Uzbek
   ========================================================================== */

const CIRCUIT_TEMPLATES = [
  {
    "id": "tmpl_001",
    "num": 1,
    "title": "Oddiy Lampochka Zanjiri",
    "category": "basic",
    "categoryName": "Boshlang'ich & Oddiy Zanjirlar",
    "difficulty": "beginner",
    "difficultyName": "Boshlang'ich",
    "tags": [
      "Lampochka",
      "Batareya",
      "Yopiq zanjir"
    ],
    "desc": "9V batareya va lampochkadan iborat eng sodda yopiq elektr zanjiri.",
    "theory": "Elektr toki manbaning musbat (+) qutbidan chiqib yuklama orqali manfiy (-) qutbga oqadi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 160,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "l1",
        "type": "bulb",
        "x": 360,
        "y": 240,
        "voltage": 6.0
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "l1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "l1_2",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing.",
      "Lampochkaning qizib porlashini kuzating."
    ]
  },
  {
    "id": "tmpl_002",
    "num": 2,
    "title": "Kalitli Chiroq Zanjiri",
    "category": "basic",
    "categoryName": "Boshlang'ich & Oddiy Zanjirlar",
    "difficulty": "beginner",
    "difficultyName": "Boshlang'ich",
    "tags": [
      "Kalit",
      "Switch",
      "Boshqaruv",
      "Lampochka"
    ],
    "desc": "Kalit yordamida lampochkani yoqish va o'chirish sxemasi.",
    "theory": "Kalit zanjirni uzganda tok oqimi to'xtaydi (ochiq zanjir), ulanganda esa tok oqadi (yopiq zanjir).",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 160,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 300,
        "y": 160,
        "isOpen": false
      },
      {
        "id": "l1",
        "type": "bulb",
        "x": 300,
        "y": 320,
        "voltage": 6.0
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "sw1_2",
        "toPinId": "l1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "l1_2",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Kalit ustiga bosib zanjirni oching va yoping.",
      "Chiroq qanday munosabat bildirishini ko'ring."
    ]
  },
  {
    "id": "tmpl_003",
    "num": 3,
    "title": "Qizil LED (Ballast Rezistor bilan)",
    "category": "basic",
    "categoryName": "Boshlang'ich & Oddiy Zanjirlar",
    "difficulty": "beginner",
    "difficultyName": "Boshlang'ich",
    "tags": [
      "LED",
      "Rezistor",
      "Tok cheklovchi",
      "Yorug'lik diodi"
    ],
    "desc": "Qizil LED ni 470Ω tok cheklovchi rezistor orqali xavfsiz yoqish.",
    "theory": "Yorug'lik diodi (LED) minimal ichki qarshilikka ega. Ballast rezistori bo'lmasa, tok oshib LED kuyadi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 160,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 300,
        "y": 180,
        "resistance": 470
      },
      {
        "id": "led1",
        "type": "led",
        "x": 420,
        "y": 240,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "r1_2",
        "toPinId": "led1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_004",
    "num": 4,
    "title": "Yashil LED Zanjiri (330Ω)",
    "category": "basic",
    "categoryName": "Boshlang'ich & Oddiy Zanjirlar",
    "difficulty": "beginner",
    "difficultyName": "Boshlang'ich",
    "tags": [
      "Yashil LED",
      "Rezistor 330",
      "Optoelektronika"
    ],
    "desc": "Yashil LED (ishchi kuchlanishi 2.1V) ni 330Ω rezistor orqali yoqish.",
    "theory": "Yashil LED qizil LED ga qaraganda bir oz yuqoriroq to'g'ri kuchlanish tushishiga ega (2.1V).",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 160,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 300,
        "y": 180,
        "resistance": 330
      },
      {
        "id": "led1",
        "type": "led_green",
        "x": 420,
        "y": 240,
        "ledColor": "#10B981"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "r1_2",
        "toPinId": "led1_a",
        "color": "#00FF87"
      },
      {
        "id": "w3",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_005",
    "num": 5,
    "title": "1.5V Batareya va Kichik Lampochka",
    "category": "basic",
    "categoryName": "Boshlang'ich & Oddiy Zanjirlar",
    "difficulty": "beginner",
    "difficultyName": "Boshlang'ich",
    "tags": [
      "1.5V",
      "AA Batareya",
      "Past kuchlanish"
    ],
    "desc": "1.5V AA batareya orqali kam quvvatli lampochkani quvvatlash.",
    "theory": "1.5V kuchlanish inson tanasi uchun mutlaqo xavfsiz va kichik portativ asboblarda keng qo'llaniladi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_1v5",
        "x": 180,
        "y": 240,
        "voltage": 1.5
      },
      {
        "id": "l1",
        "type": "bulb",
        "x": 360,
        "y": 240,
        "voltage": 1.5
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "l1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "l1_2",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_006",
    "num": 6,
    "title": "Doimiy Pyezo Buzzer Signali",
    "category": "basic",
    "categoryName": "Boshlang'ich & Oddiy Zanjirlar",
    "difficulty": "beginner",
    "difficultyName": "Boshlang'ich",
    "tags": [
      "Buzzer",
      "Tovush",
      "Pyezoelektrik"
    ],
    "desc": "9V manbaga ulangan pyezo buzzerdan uzluksiz tovush chiqarish.",
    "theory": "Pyezo buzzer ichidagi pyezokeramik diskka kuchlanish berilganda u tebranib 2.5kHz akustik signal tarqatadi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 180,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "bz1",
        "type": "buzzer",
        "x": 380,
        "y": 240
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "bz1_p",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "bz1_n",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_007",
    "num": 7,
    "title": "Eshik Qo'ng'irog'i (Tugmali Buzzer)",
    "category": "basic",
    "categoryName": "Boshlang'ich & Oddiy Zanjirlar",
    "difficulty": "beginner",
    "difficultyName": "Boshlang'ich",
    "tags": [
      "Qo'ng'iroq",
      "Buzzer",
      "Kalit",
      "Xavfsizlik"
    ],
    "desc": "Tugma bosilgandagina tovush chiqaruvchi eshik qo'ng'irog'i modeli.",
    "theory": "Kalit normal holatda ochiq bo'lib, faqat bosib turilganda zanjir yopiladi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 160,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 300,
        "y": 180,
        "isOpen": true
      },
      {
        "id": "bz1",
        "type": "buzzer",
        "x": 420,
        "y": 240
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "sw1_2",
        "toPinId": "bz1_p",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "bz1_n",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_008",
    "num": 8,
    "title": "DC Dvigatel va Ventilyator",
    "category": "basic",
    "categoryName": "Boshlang'ich & Oddiy Zanjirlar",
    "difficulty": "beginner",
    "difficultyName": "Boshlang'ich",
    "tags": [
      "Motor",
      "DC Dvigatel",
      "Elektromexanika",
      "Aylanish"
    ],
    "desc": "Kalit yordamida elektr dvigatelini ishga tushirish va to'xtatish.",
    "theory": "Elektr toki dvigatel chulg'amlarida magnit maydon hosil qilib rotorni aylantiradi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 160,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 300,
        "y": 180,
        "isOpen": false
      },
      {
        "id": "m1",
        "type": "motor",
        "x": 420,
        "y": 240
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "sw1_2",
        "toPinId": "m1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "m1_2",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_009",
    "num": 9,
    "title": "Umumiy Tuproqlash (GND) Zanjiri",
    "category": "basic",
    "categoryName": "Boshlang'ich & Oddiy Zanjirlar",
    "difficulty": "beginner",
    "difficultyName": "Boshlang'ich",
    "tags": [
      "GND",
      "Tuproqlash",
      "0V Malumot"
    ],
    "desc": "Manfiy qutb umumiy tuproqlash (GND) orqali yopiladigan klassik sxema.",
    "theory": "Elektronikada barcha potensiallar GND (0V) nuqtasiga nisbatan o'lchanadi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 180,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "l1",
        "type": "bulb",
        "x": 360,
        "y": 240,
        "voltage": 6.0
      },
      {
        "id": "gnd1",
        "type": "ground",
        "x": 270,
        "y": 340
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "l1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "l1_2",
        "toPinId": "gnd1_gnd",
        "color": "#38BDF8"
      },
      {
        "id": "w3",
        "fromPinId": "b1_n",
        "toPinId": "gnd1_gnd",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_010",
    "num": 10,
    "title": "Past Qarshilikli Himoya Rezistori",
    "category": "basic",
    "categoryName": "Boshlang'ich & Oddiy Zanjirlar",
    "difficulty": "beginner",
    "difficultyName": "Boshlang'ich",
    "tags": [
      "Himoya",
      "Rezistor",
      "Saqlagich"
    ],
    "desc": "Qisqa tutashuvdan asrovchi kam qarshilikli (10Ω) himoya elementi.",
    "theory": "Zanjirda tok ortib ketganda himoya rezistori yuklamani ortiqcha tokdan asraydi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 160,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 280,
        "y": 180,
        "resistance": 10
      },
      {
        "id": "l1",
        "type": "bulb",
        "x": 400,
        "y": 240,
        "voltage": 6.0
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "r1_2",
        "toPinId": "l1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "l1_2",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_011",
    "num": 11,
    "title": "Lampochka Dimmeri (Potensiometr)",
    "category": "basic",
    "categoryName": "Boshlang'ich & Oddiy Zanjirlar",
    "difficulty": "beginner",
    "difficultyName": "Boshlang'ich",
    "tags": [
      "Dimmer",
      "Potensiometr",
      "Yorug'likni rostlash"
    ],
    "desc": "Potensiometr burilishi orqali lampochkaning yorqinligini silliq rostlash.",
    "theory": "Potensiometr qarshiligi ortganda zanjirdagi tok kamayadi (I = U/R), chiroq xiralashadi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 160,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "pot1",
        "type": "potentiometer",
        "x": 300,
        "y": 180,
        "maxResistance": 1000,
        "ratio": 0.5
      },
      {
        "id": "l1",
        "type": "bulb",
        "x": 440,
        "y": 240,
        "voltage": 6.0
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "pot1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "pot1_w",
        "toPinId": "l1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "l1_2",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_012",
    "num": 12,
    "title": "Motor Tezligini Rostlash (Reostat)",
    "category": "basic",
    "categoryName": "Boshlang'ich & Oddiy Zanjirlar",
    "difficulty": "beginner",
    "difficultyName": "Boshlang'ich",
    "tags": [
      "Motor",
      "Tezlik",
      "Reostat",
      "Potensiometr"
    ],
    "desc": "Potensiometr yordamida DC motorning aylanish tezligini boshqarish.",
    "theory": "Dvigatelga berilayotgan kuchlanish va tok o'zgartirilganda uning burchak tezligi o'zgaradi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 160,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "pot1",
        "type": "potentiometer",
        "x": 300,
        "y": 180,
        "maxResistance": 500,
        "ratio": 0.8
      },
      {
        "id": "m1",
        "type": "motor",
        "x": 440,
        "y": 240
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "pot1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "pot1_w",
        "toPinId": "m1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "m1_2",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_013",
    "num": 13,
    "title": "Buzzer Ovozini Sozlash",
    "category": "basic",
    "categoryName": "Boshlang'ich & Oddiy Zanjirlar",
    "difficulty": "beginner",
    "difficultyName": "Boshlang'ich",
    "tags": [
      "Buzzer",
      "Ovoz balandligi",
      "Potensiometr"
    ],
    "desc": "Rezistor orqali pyezo buzzerning ovoz balandligini pasaytirish.",
    "theory": "Buzzerga ketayotgan tokni cheklash orqali uning akustik kuchi boshqariladi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 160,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 300,
        "y": 180,
        "resistance": 1000
      },
      {
        "id": "bz1",
        "type": "buzzer",
        "x": 420,
        "y": 240
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "r1_2",
        "toPinId": "bz1_p",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "bz1_n",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_014",
    "num": 14,
    "title": "Ikki Kalitli Xavfsizlik Zanjiri",
    "category": "basic",
    "categoryName": "Boshlang'ich & Oddiy Zanjirlar",
    "difficulty": "beginner",
    "difficultyName": "Boshlang'ich",
    "tags": [
      "Ketma-ket kalitlar",
      "Xavfsizlik",
      "Interlok"
    ],
    "desc": "Faqat ikkala kalit ham bir vaqtda bosilgandagina lampochka yonishi.",
    "theory": "Sanoat uskunalarida xavfsizlik uchun ikkala qo'l bilan 2 ta tugmani bosish talab qilinadi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 260,
        "y": 180,
        "isOpen": false
      },
      {
        "id": "sw2",
        "type": "switch",
        "x": 380,
        "y": 180,
        "isOpen": false
      },
      {
        "id": "l1",
        "type": "bulb",
        "x": 460,
        "y": 260,
        "voltage": 6.0
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "sw1_2",
        "toPinId": "sw2_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "sw2_2",
        "toPinId": "l1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "l1_2",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_015",
    "num": 15,
    "title": "Parallel Kalitlar (OR mantig'i)",
    "category": "basic",
    "categoryName": "Boshlang'ich & Oddiy Zanjirlar",
    "difficulty": "beginner",
    "difficultyName": "Boshlang'ich",
    "tags": [
      "Parallel kalitlar",
      "Boshqaruv",
      "Zanjir"
    ],
    "desc": "Istalgan kalit bosilganda lampochka yonadigan parallel kalitli sxema.",
    "theory": "Kalitlar parallel ulanganda, hech bo'lmaganda biri yopilishi tok oqishi uchun kifoya qiladi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 280,
        "y": 160,
        "isOpen": false
      },
      {
        "id": "sw2",
        "type": "switch",
        "x": 280,
        "y": 280,
        "isOpen": true
      },
      {
        "id": "l1",
        "type": "bulb",
        "x": 420,
        "y": 220,
        "voltage": 6.0
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "b1_p",
        "toPinId": "sw2_1",
        "color": "#EF4444"
      },
      {
        "id": "w3",
        "fromPinId": "sw1_2",
        "toPinId": "l1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "sw2_2",
        "toPinId": "l1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "l1_2",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_016",
    "num": 16,
    "title": "Yo'lak Kaliti Modeli (Krossover)",
    "category": "basic",
    "categoryName": "Boshlang'ich & Oddiy Zanjirlar",
    "difficulty": "beginner",
    "difficultyName": "Boshlang'ich",
    "tags": [
      "Yo'lak kaliti",
      "O'tish kaliti",
      "Uy elektrigi"
    ],
    "desc": "Uzun yo'lakning ikki boshidan chiroqni yoqish va o'chirish sxemasi.",
    "theory": "Ko'p qavatli uylar va uzun yo'laklarda qulaylik uchun o'tuvchi kalitlar o'rnatiladi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 260,
        "y": 180,
        "isOpen": false
      },
      {
        "id": "sw2",
        "type": "switch",
        "x": 380,
        "y": 180,
        "isOpen": false
      },
      {
        "id": "l1",
        "type": "bulb",
        "x": 460,
        "y": 260,
        "voltage": 6.0
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "sw1_2",
        "toPinId": "sw2_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "sw2_2",
        "toPinId": "l1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "l1_2",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_017",
    "num": 17,
    "title": "Batareyalarni Ketma-ket Ulash (3V Manba)",
    "category": "basic",
    "categoryName": "Boshlang'ich & Oddiy Zanjirlar",
    "difficulty": "beginner",
    "difficultyName": "Boshlang'ich",
    "tags": [
      "1.5V x 2",
      "3V",
      "Ketma-ket batareya"
    ],
    "desc": "Ikkita 1.5V elementni ketma-ket ulab 3.0V hosil qilish va qizil LED ni yoqish.",
    "theory": "Batareyalar ketma-ket ulanganda ularning kuchlanishlari qo'shiladi: U = U1 + U2.",
    "components": [
      {
        "id": "b1",
        "type": "battery_1v5",
        "x": 140,
        "y": 240,
        "voltage": 1.5
      },
      {
        "id": "b2",
        "type": "battery_1v5",
        "x": 260,
        "y": 240,
        "voltage": 1.5
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 380,
        "y": 180,
        "resistance": 100
      },
      {
        "id": "led1",
        "type": "led",
        "x": 480,
        "y": 240,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_n",
        "toPinId": "b2_p",
        "color": "#00FF87"
      },
      {
        "id": "w2",
        "fromPinId": "b2_n",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w3",
        "fromPinId": "r1_2",
        "toPinId": "led1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "led1_k",
        "toPinId": "b1_p",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_018",
    "num": 18,
    "title": "Batareyalarni Parallel Ulash",
    "category": "basic",
    "categoryName": "Boshlang'ich & Oddiy Zanjirlar",
    "difficulty": "beginner",
    "difficultyName": "Boshlang'ich",
    "tags": [
      "Parallel batareya",
      "Sig'im",
      "Mustahkamlik"
    ],
    "desc": "Ikkita 9V batareyani parallel ulab yuklamani quvvatlash.",
    "theory": "Parallel ulanganda kuchlanish o'zgarmaydi, lekin manbalarning umumiy tok berish qobiliyati va ishlash vaqti 2 baravar oshadi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 180,
        "voltage": 9.0
      },
      {
        "id": "b2",
        "type": "battery_9v",
        "x": 140,
        "y": 300,
        "voltage": 9.0
      },
      {
        "id": "l1",
        "type": "bulb",
        "x": 360,
        "y": 240,
        "voltage": 6.0
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "b2_p",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "b1_n",
        "toPinId": "b2_n",
        "color": "#38BDF8"
      },
      {
        "id": "w3",
        "fromPinId": "b1_p",
        "toPinId": "l1_1",
        "color": "#EF4444"
      },
      {
        "id": "w4",
        "fromPinId": "l1_2",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_019",
    "num": 19,
    "title": "Qisqa Tutashuv Namoyishi (K3)",
    "category": "basic",
    "categoryName": "Boshlang'ich & Oddiy Zanjirlar",
    "difficulty": "beginner",
    "difficultyName": "Boshlang'ich",
    "tags": [
      "Qisqa tutashuv",
      "K3",
      "Xavfsizlik"
    ],
    "desc": "Yuklamasiz batareya qutblarini to'g'ridan-to'g'ri kalit orqali ulash tajribasi.",
    "theory": "Qisqa tutashuvda qarshilik deyarli 0 ga teng bo'lib, tok cheksiz o'sadi va simlar qiziydi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 180,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 360,
        "y": 240,
        "isOpen": true
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "sw1_2",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Kalitni bosing va yuqori panelda Qisqa Tutashuv (K3) ogohlantirishini ko'ring."
    ]
  },
  {
    "id": "tmpl_020",
    "num": 20,
    "title": "LED Teskari Qutblanishi",
    "category": "basic",
    "categoryName": "Boshlang'ich & Oddiy Zanjirlar",
    "difficulty": "beginner",
    "difficultyName": "Boshlang'ich",
    "tags": [
      "Teskari qutb",
      "Diod",
      "Yopiq holat"
    ],
    "desc": "LED katodi musbatga, anodi manfiyga ulanganda tok o'tmasligini isbotlash.",
    "theory": "Diodlar faqat bir tomonlama (anoddan katodga) tok o'tkazadi. Teskari ulansa u ochiq kalit kabi ishlaydi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 160,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 300,
        "y": 180,
        "resistance": 330
      },
      {
        "id": "led1",
        "type": "led",
        "x": 420,
        "y": 240,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "r1_2",
        "toPinId": "led1_k",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "led1_a",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_021",
    "num": 21,
    "title": "Ketma-ket 2 ta Lampochka",
    "category": "laws",
    "categoryName": "Ulanish Usullari & Qonunlar",
    "difficulty": "beginner",
    "difficultyName": "Boshlang'ich",
    "tags": [
      "Ketma-ket",
      "Series",
      "Kuchlanish bo'linishi"
    ],
    "desc": "Ikkita bir xil lampochkani ketma-ket ulash (har biriga 4.5V tushadi).",
    "theory": "Ketma-ket ulanishda zanjirning umumiy qarshiligi oshadi (R = R1 + R2), shuning uchun lampochkalar xiraroq yonadi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 160,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "l1",
        "type": "bulb",
        "x": 300,
        "y": 180,
        "voltage": 6.0
      },
      {
        "id": "l2",
        "type": "bulb",
        "x": 420,
        "y": 180,
        "voltage": 6.0
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "l1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "l1_2",
        "toPinId": "l2_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "l2_2",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_022",
    "num": 22,
    "title": "Ketma-ket 3 ta Lampochka",
    "category": "laws",
    "categoryName": "Ulanish Usullari & Qonunlar",
    "difficulty": "beginner",
    "difficultyName": "Boshlang'ich",
    "tags": [
      "Ketma-ket 3x",
      "Chiroqlar",
      "Kuchlanish"
    ],
    "desc": "Uchta lampochka ketma-ket ulanganda kuchlanish teng uchga bo'linadi (3V dan).",
    "theory": "Agar zanjirdagi bitta lampochka kuysa yoki uzilsa, barcha lampochkalar o'chadi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "l1",
        "type": "bulb",
        "x": 260,
        "y": 180,
        "voltage": 6.0
      },
      {
        "id": "l2",
        "type": "bulb",
        "x": 380,
        "y": 180,
        "voltage": 6.0
      },
      {
        "id": "l3",
        "type": "bulb",
        "x": 500,
        "y": 180,
        "voltage": 6.0
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "l1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "l1_2",
        "toPinId": "l2_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "l2_2",
        "toPinId": "l3_1",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "l3_2",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_023",
    "num": 23,
    "title": "Parallel 2 ta Lampochka",
    "category": "laws",
    "categoryName": "Ulanish Usullari & Qonunlar",
    "difficulty": "beginner",
    "difficultyName": "Boshlang'ich",
    "tags": [
      "Parallel",
      "To'liq kuchlanish",
      "Mustaqil"
    ],
    "desc": "Ikkita lampochka parallel ulanganda har biriga to'liq 9V beriladi va ikkalasi ham yorug' yonadi.",
    "theory": "Parallel ulanishda shoxobchalardan birortasi uzilsa ham, qolganlari ishlashda davom etadi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 160,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "l1",
        "type": "bulb",
        "x": 340,
        "y": 160,
        "voltage": 6.0
      },
      {
        "id": "l2",
        "type": "bulb",
        "x": 340,
        "y": 320,
        "voltage": 6.0
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "l1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "b1_p",
        "toPinId": "l2_1",
        "color": "#EF4444"
      },
      {
        "id": "w3",
        "fromPinId": "l1_2",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      },
      {
        "id": "w4",
        "fromPinId": "l2_2",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_024",
    "num": 24,
    "title": "Parallel 3 ta Lampochka",
    "category": "laws",
    "categoryName": "Ulanish Usullari & Qonunlar",
    "difficulty": "beginner",
    "difficultyName": "Boshlang'ich",
    "tags": [
      "Parallel 3x",
      "Katta tok",
      "Yorug'lik"
    ],
    "desc": "Uchta mustaqil tarmoqda parallel ulangan lampochkalar.",
    "theory": "Parallel zanjirda umumiy tok har bir tarmoq toklari yig'indisiga teng: I = I1 + I2 + I3.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "l1",
        "type": "bulb",
        "x": 320,
        "y": 140,
        "voltage": 6.0
      },
      {
        "id": "l2",
        "type": "bulb",
        "x": 320,
        "y": 240,
        "voltage": 6.0
      },
      {
        "id": "l3",
        "type": "bulb",
        "x": 320,
        "y": 340,
        "voltage": 6.0
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "l1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "b1_p",
        "toPinId": "l2_1",
        "color": "#EF4444"
      },
      {
        "id": "w3",
        "fromPinId": "b1_p",
        "toPinId": "l3_1",
        "color": "#EF4444"
      },
      {
        "id": "w4",
        "fromPinId": "l1_2",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      },
      {
        "id": "w5",
        "fromPinId": "l2_2",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      },
      {
        "id": "w6",
        "fromPinId": "l3_2",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_025",
    "num": 25,
    "title": "Aralash Ulanish: 1 Ketma-ket + 2 Parallel",
    "category": "laws",
    "categoryName": "Ulanish Usullari & Qonunlar",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "Aralash ulanish",
      "Murakkab zanjir"
    ],
    "desc": "Bitta lampochka ketma-ket, undan keyin ikkita lampochka parallel ulangan.",
    "theory": "Boshlang'ich lampochkadan to'liq tok o'tadi, keyin esa tok ikki parallel shoxobchaga bo'linadi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "l1",
        "type": "bulb",
        "x": 260,
        "y": 240,
        "voltage": 6.0
      },
      {
        "id": "l2",
        "type": "bulb",
        "x": 420,
        "y": 160,
        "voltage": 6.0
      },
      {
        "id": "l3",
        "type": "bulb",
        "x": 420,
        "y": 320,
        "voltage": 6.0
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "l1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "l1_2",
        "toPinId": "l2_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "l1_2",
        "toPinId": "l3_1",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "l2_2",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      },
      {
        "id": "w5",
        "fromPinId": "l3_2",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_026",
    "num": 26,
    "title": "Aralash Ulanish: 2 ta Ketma-ket Guruh Parallel",
    "category": "laws",
    "categoryName": "Ulanish Usullari & Qonunlar",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "Aralash ulanish 2",
      "Simmetriya"
    ],
    "desc": "Ikkita parallel tarmoqning har birida ikkitadan ketma-ket lampochka.",
    "theory": "Har bir tarmoqqa 9V tushadi va har bir tarmoqdagi lampochkalar 4.5V dan oladi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 120,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "l1",
        "type": "bulb",
        "x": 260,
        "y": 160,
        "voltage": 6.0
      },
      {
        "id": "l2",
        "type": "bulb",
        "x": 400,
        "y": 160,
        "voltage": 6.0
      },
      {
        "id": "l3",
        "type": "bulb",
        "x": 260,
        "y": 320,
        "voltage": 6.0
      },
      {
        "id": "l4",
        "type": "bulb",
        "x": 400,
        "y": 320,
        "voltage": 6.0
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "l1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "b1_p",
        "toPinId": "l3_1",
        "color": "#EF4444"
      },
      {
        "id": "w3",
        "fromPinId": "l1_2",
        "toPinId": "l2_1",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "l3_2",
        "toPinId": "l4_1",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "l2_2",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      },
      {
        "id": "w6",
        "fromPinId": "l4_2",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_027",
    "num": 27,
    "title": "Ohm Qonuni: 9V va 220Ω Rezistor",
    "category": "laws",
    "categoryName": "Ulanish Usullari & Qonunlar",
    "difficulty": "beginner",
    "difficultyName": "Boshlang'ich",
    "tags": [
      "Ohm qonuni",
      "I = U / R",
      "Tok kuchi"
    ],
    "desc": "I = U / R formulasini amalda tekshirish: 9V / 220Ω ≈ 40.9 mA.",
    "theory": "O'tkazgichdagi tok kuchi kuchlanishga to'g'ri, qarshilikka esa teskari mutanosibdir.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 180,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 380,
        "y": 240,
        "resistance": 220
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "r1_2",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_028",
    "num": 28,
    "title": "Ohm Qonuni: 9V va 1000Ω Rezistor",
    "category": "laws",
    "categoryName": "Ulanish Usullari & Qonunlar",
    "difficulty": "beginner",
    "difficultyName": "Boshlang'ich",
    "tags": [
      "Ohm qonuni 1k",
      "Kichik tok"
    ],
    "desc": "Kattaroq qarshilikda tokning kamayishi: 9V / 1000Ω = 9.0 mA.",
    "theory": "Qarshilik 4.5 baravar ortganda tok ham xuddi shuncha baravar kamayadi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 180,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "r1",
        "type": "resistor_1k",
        "x": 380,
        "y": 240,
        "resistance": 1000
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "r1_2",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_029",
    "num": 29,
    "title": "Kuchlanish Bo'luvchi: 9V -> 4.5V (Teng R)",
    "category": "laws",
    "categoryName": "Ulanish Usullari & Qonunlar",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "Kuchlanish bo'luvchi",
      "Voltage Divider",
      "4.5V"
    ],
    "desc": "Ikkita bir xil 1kΩ rezistor yordamida 9V kuchlanishni teng 2 ga bo'lish.",
    "theory": "U_chiq = U_kir * (R2 / (R1 + R2)) = 9V * (1000 / 2000) = 4.5V.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "r1",
        "type": "resistor_1k",
        "x": 300,
        "y": 160,
        "resistance": 1000
      },
      {
        "id": "r2",
        "type": "resistor_1k",
        "x": 300,
        "y": 280,
        "resistance": 1000
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "r1_2",
        "toPinId": "r2_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "r2_2",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_030",
    "num": 30,
    "title": "Nometrik Bo'luvchi: 1000Ω va 220Ω",
    "category": "laws",
    "categoryName": "Ulanish Usullari & Qonunlar",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "Bo'luvchi",
      "Nisbat",
      "Turli R"
    ],
    "desc": "Turli qiymatli rezistorlar orqali 9V dan taxminan 1.62V olish.",
    "theory": "R2 (220Ω) uchlaridagi kuchlanish: 9V * 220 / (1000 + 220) ≈ 1.62V.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "r1",
        "type": "resistor_1k",
        "x": 300,
        "y": 160,
        "resistance": 1000
      },
      {
        "id": "r2",
        "type": "resistor",
        "x": 300,
        "y": 280,
        "resistance": 220
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "r1_2",
        "toPinId": "r2_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "r2_2",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_031",
    "num": 31,
    "title": "Kirchhoff 1-Qonuni: Tugun Toklari Balansi",
    "category": "laws",
    "categoryName": "Ulanish Usullari & Qonunlar",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "Kirchhoff",
      "Tugun toki",
      "KCL"
    ],
    "desc": "Tugunga kiruvchi umumiy tok tarmoqlardan chiquvchi toklar yig'indisiga tengligi.",
    "theory": "∑ I_kiruvchi = ∑ I_chiquvchi. Elektr zaryadi yo'qolmaydi va yig'ilib qolmaydi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 320,
        "y": 160,
        "resistance": 220
      },
      {
        "id": "r2",
        "type": "resistor_1k",
        "x": 320,
        "y": 320,
        "resistance": 1000
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "b1_p",
        "toPinId": "r2_1",
        "color": "#EF4444"
      },
      {
        "id": "w3",
        "fromPinId": "r1_2",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      },
      {
        "id": "w4",
        "fromPinId": "r2_2",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_032",
    "num": 32,
    "title": "Kirchhoff 2-Qonuni: Kontur Kuchlanishlari",
    "category": "laws",
    "categoryName": "Ulanish Usullari & Qonunlar",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "Kirchhoff 2",
      "KVL",
      "Kontur balansi"
    ],
    "desc": "Yopiq konturdagi EYuK lari yig'indisi kuchlanish tushishlari yig'indisiga teng.",
    "theory": "∑ E = ∑ (I * R). Manba kuchlanishi (9V) rezistorlar tushishi yig'indisiga (U1 + U2) teng bo'ladi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 280,
        "y": 180,
        "resistance": 220
      },
      {
        "id": "r2",
        "type": "resistor_1k",
        "x": 420,
        "y": 180,
        "resistance": 1000
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "r1_2",
        "toPinId": "r2_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "r2_2",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_033",
    "num": 33,
    "title": "Parallel Rezistorlar: 2x 220Ω = 110Ω",
    "category": "laws",
    "categoryName": "Ulanish Usullari & Qonunlar",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "Parallel R",
      "110 Ohm",
      "Ekvivalent qarshilik"
    ],
    "desc": "Ikkita teng rezistor parallel ulanganda umumiy qarshilik 2 baravarga kamayadi.",
    "theory": "1 / R_umumiy = 1/R1 + 1/R2 => R_umumiy = (220 * 220) / (220 + 220) = 110 Ω.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 320,
        "y": 160,
        "resistance": 220
      },
      {
        "id": "r2",
        "type": "resistor",
        "x": 320,
        "y": 320,
        "resistance": 220
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "b1_p",
        "toPinId": "r2_1",
        "color": "#EF4444"
      },
      {
        "id": "w3",
        "fromPinId": "r1_2",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      },
      {
        "id": "w4",
        "fromPinId": "r2_2",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_034",
    "num": 34,
    "title": "Ketma-ket Rezistorlar: 220Ω + 1000Ω = 1220Ω",
    "category": "laws",
    "categoryName": "Ulanish Usullari & Qonunlar",
    "difficulty": "beginner",
    "difficultyName": "Boshlang'ich",
    "tags": [
      "Ketma-ket R",
      "1220 Ohm",
      "Qarshiliklar yig'indisi"
    ],
    "desc": "Ketma-ket ulanishda qarshiliklarning to'g'ridan-to'g'ri qo'shilish qoidasi.",
    "theory": "R_umumiy = R1 + R2 = 220 + 1000 = 1220 Ω. Umumiy tok I = 9 / 1220 ≈ 7.37 mA.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 280,
        "y": 180,
        "resistance": 220
      },
      {
        "id": "r2",
        "type": "resistor_1k",
        "x": 420,
        "y": 180,
        "resistance": 1000
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "r1_2",
        "toPinId": "r2_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "r2_2",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_035",
    "num": 35,
    "title": "Balanslangan Uitson Ko'prigi (Wheatstone)",
    "category": "laws",
    "categoryName": "Ulanish Usullari & Qonunlar",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "Uitson ko'prigi",
      "Wheatstone",
      "Balans",
      "O'lchov"
    ],
    "desc": "Ko'prik muvozanatda bo'lganda (R1/R2 = R3/R4) diagonalda kuchlanish va tok 0V bo'ladi.",
    "theory": "Uitson ko'prigi noma'lum qarshiliklarni yuqori aniqlikda o'lchashda standart usul hisoblanadi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 120,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 260,
        "y": 140,
        "resistance": 220
      },
      {
        "id": "r2",
        "type": "resistor",
        "x": 400,
        "y": 140,
        "resistance": 220
      },
      {
        "id": "r3",
        "type": "resistor",
        "x": 260,
        "y": 340,
        "resistance": 220
      },
      {
        "id": "r4",
        "type": "resistor",
        "x": 400,
        "y": 340,
        "resistance": 220
      },
      {
        "id": "l1",
        "type": "bulb",
        "x": 330,
        "y": 240,
        "voltage": 6.0
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "b1_p",
        "toPinId": "r3_1",
        "color": "#EF4444"
      },
      {
        "id": "w3",
        "fromPinId": "r1_2",
        "toPinId": "r2_1",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "r3_2",
        "toPinId": "r4_1",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "r1_2",
        "toPinId": "l1_1",
        "color": "#00FF87"
      },
      {
        "id": "w6",
        "fromPinId": "r3_2",
        "toPinId": "l1_2",
        "color": "#00FF87"
      },
      {
        "id": "w7",
        "fromPinId": "r2_2",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      },
      {
        "id": "w8",
        "fromPinId": "r4_2",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_036",
    "num": 36,
    "title": "Balanslanmagan Ko'prikli Zanjir",
    "category": "laws",
    "categoryName": "Ulanish Usullari & Qonunlar",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "Balanssiz ko'prik",
      "Diagonal toki"
    ],
    "desc": "Yelkalardan birining qarshiligi o'zgarganda diagonal orqali tok oqishi.",
    "theory": "Datchiklar (tenzodatchik, fotorezistor) ko'prik yelkasiga qo'yilib, nomutanosiblik signali kuchaytiriladi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 120,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 260,
        "y": 140,
        "resistance": 220
      },
      {
        "id": "r2",
        "type": "resistor_1k",
        "x": 400,
        "y": 140,
        "resistance": 1000
      },
      {
        "id": "r3",
        "type": "resistor",
        "x": 260,
        "y": 340,
        "resistance": 220
      },
      {
        "id": "r4",
        "type": "resistor",
        "x": 400,
        "y": 340,
        "resistance": 220
      },
      {
        "id": "l1",
        "type": "bulb",
        "x": 330,
        "y": 240,
        "voltage": 6.0
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "b1_p",
        "toPinId": "r3_1",
        "color": "#EF4444"
      },
      {
        "id": "w3",
        "fromPinId": "r1_2",
        "toPinId": "r2_1",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "r3_2",
        "toPinId": "r4_1",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "r1_2",
        "toPinId": "l1_1",
        "color": "#00FF87"
      },
      {
        "id": "w6",
        "fromPinId": "r3_2",
        "toPinId": "l1_2",
        "color": "#00FF87"
      },
      {
        "id": "w7",
        "fromPinId": "r2_2",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      },
      {
        "id": "w8",
        "fromPinId": "r4_2",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_037",
    "num": 37,
    "title": "Ketma-ket 3 ta Qizil LED",
    "category": "laws",
    "categoryName": "Ulanish Usullari & Qonunlar",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "Ketma-ket LED",
      "LED paneli"
    ],
    "desc": "3 ta qizil LED (har biri ~1.8V) va 1 ta cheklovchi 180Ω rezistor.",
    "theory": "LED lar to'g'ri kuchlanishlari qo'shiladi (3 * 1.8V = 5.4V). Qolgan 3.6V rezistorda so'ndiriladi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 120,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 240,
        "y": 180,
        "resistance": 180
      },
      {
        "id": "led1",
        "type": "led",
        "x": 340,
        "y": 180,
        "ledColor": "#EF4444"
      },
      {
        "id": "led2",
        "type": "led",
        "x": 440,
        "y": 180,
        "ledColor": "#EF4444"
      },
      {
        "id": "led3",
        "type": "led",
        "x": 540,
        "y": 180,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "r1_2",
        "toPinId": "led1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "led1_k",
        "toPinId": "led2_a",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "led2_k",
        "toPinId": "led3_a",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "led3_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_038",
    "num": 38,
    "title": "Parallel LED lar (Alohida Rezistorlar Bilan)",
    "category": "laws",
    "categoryName": "Ulanish Usullari & Qonunlar",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "Parallel LED",
      "Alohida ballast",
      "To'g'ri sxema"
    ],
    "desc": "Har bir LED o'zining shaxsiy rezistoriga ega bo'lgan to'g'ri parallel ulanish.",
    "theory": "Har bir LED o'z rezistoriga ega bo'lsa, ularning volt-amper xarakteristikasi farq qilsa ham tok barqaror taqsimlanadi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 280,
        "y": 160,
        "resistance": 470
      },
      {
        "id": "led1",
        "type": "led",
        "x": 420,
        "y": 160,
        "ledColor": "#EF4444"
      },
      {
        "id": "r2",
        "type": "resistor",
        "x": 280,
        "y": 320,
        "resistance": 470
      },
      {
        "id": "led2",
        "type": "led_green",
        "x": 420,
        "y": 320,
        "ledColor": "#10B981"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "b1_p",
        "toPinId": "r2_1",
        "color": "#EF4444"
      },
      {
        "id": "w3",
        "fromPinId": "r1_2",
        "toPinId": "led1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "r2_2",
        "toPinId": "led2_a",
        "color": "#00FF87"
      },
      {
        "id": "w5",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      },
      {
        "id": "w6",
        "fromPinId": "led2_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_039",
    "num": 39,
    "title": "Yagona Rezistorli Parallel LED (Oqibat)",
    "category": "laws",
    "categoryName": "Ulanish Usullari & Qonunlar",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "Noto'g'ri parallel",
      "Tok notekisligi",
      "Xavf"
    ],
    "desc": "Ikkita LED ni bitta umumiy rezistor orqali parallel ulashdagi xatolik tahlili.",
    "theory": "Yashil LED (2.1V) va Qizil LED (1.8V) bitta umumiy rezistorga ulansa, pastroq kuchlanishli qizil LED barcha tokni tortib oladi!",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 280,
        "y": 240,
        "resistance": 330
      },
      {
        "id": "led1",
        "type": "led",
        "x": 420,
        "y": 160,
        "ledColor": "#EF4444"
      },
      {
        "id": "led2",
        "type": "led_green",
        "x": 420,
        "y": 320,
        "ledColor": "#10B981"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "r1_2",
        "toPinId": "led1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "r1_2",
        "toPinId": "led2_a",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      },
      {
        "id": "w5",
        "fromPinId": "led2_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_040",
    "num": 40,
    "title": "Elektr Quvvati Sarfi (P = U * I)",
    "category": "laws",
    "categoryName": "Ulanish Usullari & Qonunlar",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "Quvvat",
      "P = U * I",
      "Joul-Lens"
    ],
    "desc": "Zanjirdagi ajralayotgan elektr quvvatini hisoblash va tahlil qilish.",
    "theory": "P = U * I = I² * R. Kichikroq qarshilik ko'proq tok o'tkazadi va ko'proq quvvat sarflaydi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 160,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 340,
        "y": 180,
        "resistance": 220
      },
      {
        "id": "l1",
        "type": "bulb",
        "x": 460,
        "y": 240,
        "voltage": 6.0
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "r1_2",
        "toPinId": "l1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "l1_2",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_041",
    "num": 41,
    "title": "Multimetr bilan Batareya Kuchlanishini O'lchash",
    "category": "measuring",
    "categoryName": "O'lchov & Diagnostika",
    "difficulty": "beginner",
    "difficultyName": "Boshlang'ich",
    "tags": [
      "O'lchov",
      "Multimetr",
      "Diagnostika",
      "Sinov",
      "Tok",
      "Kuchlanish"
    ],
    "desc": "Batareya klemmalaridagi 9.0V EYUK ni voltmetr yordamida o'lchash.",
    "theory": "Voltmetr zanjirga har doim parallel ulanadi va juda katta ichki qarshilikka ega.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 160,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 320,
        "y": 180,
        "resistance": 220
      },
      {
        "id": "l1",
        "type": "led",
        "x": 440,
        "y": 240,
        "voltage": 6.0,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "r1_2",
        "toPinId": "l1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "l1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_042",
    "num": 42,
    "title": "Yuklama Ostida Kuchlanish Tushishi",
    "category": "measuring",
    "categoryName": "O'lchov & Diagnostika",
    "difficulty": "beginner",
    "difficultyName": "Boshlang'ich",
    "tags": [
      "O'lchov",
      "Multimetr",
      "Diagnostika",
      "Sinov",
      "Tok",
      "Kuchlanish"
    ],
    "desc": "Lampochka ulanganda uning uchlaridagi ishchi kuchlanishni tekshirish.",
    "theory": "Yuklama ulanganda manbaning ichki qarshiligi sababli kuchlanish biroz pasayishi mumkin.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 160,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 320,
        "y": 180,
        "resistance": 1000
      },
      {
        "id": "l1",
        "type": "bulb",
        "x": 440,
        "y": 240,
        "voltage": 6.0,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "r1_2",
        "toPinId": "l1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "l1_2",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_043",
    "num": 43,
    "title": "Zanjirdagi Tok Kuchini O'lchash (Ampermetr)",
    "category": "measuring",
    "categoryName": "O'lchov & Diagnostika",
    "difficulty": "beginner",
    "difficultyName": "Boshlang'ich",
    "tags": [
      "O'lchov",
      "Multimetr",
      "Diagnostika",
      "Sinov",
      "Tok",
      "Kuchlanish"
    ],
    "desc": "Ampermetrni ketma-ket ulash qoidasi va tokni aniqlash.",
    "theory": "Ampermetr har doim zanjirga KETMA-KET ulanadi, parallel ulansa qisqa tutashuv yuz beradi!",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 160,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 320,
        "y": 180,
        "resistance": 220
      },
      {
        "id": "l1",
        "type": "bulb",
        "x": 440,
        "y": 240,
        "voltage": 6.0,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "r1_2",
        "toPinId": "l1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "l1_2",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_044",
    "num": 44,
    "title": "Rezistor Qarshiligini O'lchash (Ommetr)",
    "category": "measuring",
    "categoryName": "O'lchov & Diagnostika",
    "difficulty": "beginner",
    "difficultyName": "Boshlang'ich",
    "tags": [
      "O'lchov",
      "Multimetr",
      "Diagnostika",
      "Sinov",
      "Tok",
      "Kuchlanish"
    ],
    "desc": "Zanjirdan uzilgan holatda rezistorning haqiqiy qarshiligini tekshirish.",
    "theory": "Ommetr bilan o'lchash faqat zanjir to'liq o'chirilgan holatda amalga oshirilishi shart.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 160,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 320,
        "y": 180,
        "resistance": 1000
      },
      {
        "id": "l1",
        "type": "led",
        "x": 440,
        "y": 240,
        "voltage": 6.0,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "r1_2",
        "toPinId": "l1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "l1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_045",
    "num": 45,
    "title": "LED Ishchi Kuchlanishini O'lchash",
    "category": "measuring",
    "categoryName": "O'lchov & Diagnostika",
    "difficulty": "beginner",
    "difficultyName": "Boshlang'ich",
    "tags": [
      "O'lchov",
      "Multimetr",
      "Diagnostika",
      "Sinov",
      "Tok",
      "Kuchlanish"
    ],
    "desc": "Yoniq turgan LED uchlaridagi to'g'ri kuchlanish tushishini o'lchash.",
    "theory": "Qizil LED odatda 1.8V - 2.0V kuchlanishda barqaror yorug'lik chiqaradi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 160,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 320,
        "y": 180,
        "resistance": 220
      },
      {
        "id": "l1",
        "type": "bulb",
        "x": 440,
        "y": 240,
        "voltage": 6.0,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "r1_2",
        "toPinId": "l1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "l1_2",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_046",
    "num": 46,
    "title": "Otsillograf bilan Doimiy Kuchlanishni Kuzatish",
    "category": "measuring",
    "categoryName": "O'lchov & Diagnostika",
    "difficulty": "beginner",
    "difficultyName": "Boshlang'ich",
    "tags": [
      "O'lchov",
      "Multimetr",
      "Diagnostika",
      "Sinov",
      "Tok",
      "Kuchlanish"
    ],
    "desc": "9V DC kuchlanishning to'g'ri chiziqli vaqt grafigi.",
    "theory": "Otsillograf kuchlanishning vaqt bo'yicha o'zgarishini ko'rsatuvchi eng muhim vizual asbobdir.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 160,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 320,
        "y": 180,
        "resistance": 1000
      },
      {
        "id": "l1",
        "type": "bulb",
        "x": 440,
        "y": 240,
        "voltage": 6.0,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "r1_2",
        "toPinId": "l1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "l1_2",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_047",
    "num": 47,
    "title": "Kalit Ulanishidagi Sakrash (Contact Bounce)",
    "category": "measuring",
    "categoryName": "O'lchov & Diagnostika",
    "difficulty": "beginner",
    "difficultyName": "Boshlang'ich",
    "tags": [
      "O'lchov",
      "Multimetr",
      "Diagnostika",
      "Sinov",
      "Tok",
      "Kuchlanish"
    ],
    "desc": "Kalit yopilgandagi o'tish jarayoni va tokning keskin o'sishi.",
    "theory": "Mexanik kontaktlar ulanganda bir necha mikrosekund davomida mikrosakrashlar yuz beradi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 160,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 320,
        "y": 180,
        "resistance": 220
      },
      {
        "id": "l1",
        "type": "led",
        "x": 440,
        "y": 240,
        "voltage": 6.0,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "r1_2",
        "toPinId": "l1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "l1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_048",
    "num": 48,
    "title": "Potensiometr Kuchlanish Bo'luvchisini O'lchash",
    "category": "measuring",
    "categoryName": "O'lchov & Diagnostika",
    "difficulty": "beginner",
    "difficultyName": "Boshlang'ich",
    "tags": [
      "O'lchov",
      "Multimetr",
      "Diagnostika",
      "Sinov",
      "Tok",
      "Kuchlanish"
    ],
    "desc": "Potensiometr burilganda o'rta chiqishdagi kuchlanish (0..9V).",
    "theory": "Potensiometrning suriluvchi kontakti kuchlanishni silliq bo'lib beradi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 160,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 320,
        "y": 180,
        "resistance": 1000
      },
      {
        "id": "l1",
        "type": "bulb",
        "x": 440,
        "y": 240,
        "voltage": 6.0,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "r1_2",
        "toPinId": "l1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "l1_2",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_049",
    "num": 49,
    "title": "Buzzer Tokini O'lchash",
    "category": "measuring",
    "categoryName": "O'lchov & Diagnostika",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "O'lchov",
      "Multimetr",
      "Diagnostika",
      "Sinov",
      "Tok",
      "Kuchlanish"
    ],
    "desc": "Pyezo buzzer ishlayotganda sarflaydigan kichik tokni aniqlash.",
    "theory": "Pyezo buzzerlar odatda atigi 10-25 mA tok sarflaydigan juda tejamkor akustik elementlardir.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 160,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 320,
        "y": 180,
        "resistance": 220
      },
      {
        "id": "l1",
        "type": "bulb",
        "x": 440,
        "y": 240,
        "voltage": 6.0,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "r1_2",
        "toPinId": "l1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "l1_2",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_050",
    "num": 50,
    "title": "Qisqa Tutashuv Diagnostikasi",
    "category": "measuring",
    "categoryName": "O'lchov & Diagnostika",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "O'lchov",
      "Multimetr",
      "Diagnostika",
      "Sinov",
      "Tok",
      "Kuchlanish"
    ],
    "desc": "Tokning sakrashi va kuchlanishning 0V ga tushishi simulyatsiyasi.",
    "theory": "K3 holatida manba qutblari orasidagi kuchlanish deyarli nolga teng bo'lib qoladi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 160,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 320,
        "y": 180,
        "resistance": 1000
      },
      {
        "id": "l1",
        "type": "led",
        "x": 440,
        "y": 240,
        "voltage": 6.0,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "r1_2",
        "toPinId": "l1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "l1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_051",
    "num": 51,
    "title": "Parallel Tarmoqlar Toklarini Solishtirish",
    "category": "measuring",
    "categoryName": "O'lchov & Diagnostika",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "O'lchov",
      "Multimetr",
      "Diagnostika",
      "Sinov",
      "Tok",
      "Kuchlanish"
    ],
    "desc": "I1 va I2 shoxobcha toklari yig'indisi umumiy tokka tengligini o'lchash.",
    "theory": "Har bir shoxobchadagi tok uning qarshiligiga teskari mutanosib taqsimlanadi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 160,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 320,
        "y": 180,
        "resistance": 220
      },
      {
        "id": "l1",
        "type": "bulb",
        "x": 440,
        "y": 240,
        "voltage": 6.0,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "r1_2",
        "toPinId": "l1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "l1_2",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_052",
    "num": 52,
    "title": "Ketma-ket Tarmoqlarda Tok Tengligi",
    "category": "measuring",
    "categoryName": "O'lchov & Diagnostika",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "O'lchov",
      "Multimetr",
      "Diagnostika",
      "Sinov",
      "Tok",
      "Kuchlanish"
    ],
    "desc": "Ketma-ket zanjirning turli nuqtalarida bir xil tok oqishini tekshirish.",
    "theory": "Ketma-ket zanjirda tok hech qayerga yo'qolmaydi: I_kir = I_chiq = I_har_nuqta.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 160,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 320,
        "y": 180,
        "resistance": 1000
      },
      {
        "id": "l1",
        "type": "bulb",
        "x": 440,
        "y": 240,
        "voltage": 6.0,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "r1_2",
        "toPinId": "l1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "l1_2",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_053",
    "num": 53,
    "title": "Sim Qarshiligi Effekti",
    "category": "measuring",
    "categoryName": "O'lchov & Diagnostika",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "O'lchov",
      "Multimetr",
      "Diagnostika",
      "Sinov",
      "Tok",
      "Kuchlanish"
    ],
    "desc": "Katta masofadagi kuchlanish yo'qotilishi modeli.",
    "theory": "Haqiqiy elektr tarmoqlarida uzun simlar o'z qarshiligiga ega bo'lib, energiya yo'qotiladi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 160,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 320,
        "y": 180,
        "resistance": 220
      },
      {
        "id": "l1",
        "type": "led",
        "x": 440,
        "y": 240,
        "voltage": 6.0,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "r1_2",
        "toPinId": "l1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "l1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_054",
    "num": 54,
    "title": "Nosozlikni Qidirish: Ochiq Zanjir (Uzilish)",
    "category": "measuring",
    "categoryName": "O'lchov & Diagnostika",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "O'lchov",
      "Multimetr",
      "Diagnostika",
      "Sinov",
      "Tok",
      "Kuchlanish"
    ],
    "desc": "Uzilgan sim yoki ochiq qolgan kontaktni voltmetr bilan aniqlash.",
    "theory": "Uzilish nuqtasining ikki tomonida to'liq manba kuchlanishi hosil bo'ladi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 160,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 320,
        "y": 180,
        "resistance": 1000
      },
      {
        "id": "l1",
        "type": "bulb",
        "x": 440,
        "y": 240,
        "voltage": 6.0,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "r1_2",
        "toPinId": "l1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "l1_2",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_055",
    "num": 55,
    "title": "Nosozlikni Qidirish: Kuygan Rezistor",
    "category": "measuring",
    "categoryName": "O'lchov & Diagnostika",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "O'lchov",
      "Multimetr",
      "Diagnostika",
      "Sinov",
      "Tok",
      "Kuchlanish"
    ],
    "desc": "Kuyib ichki qarshiligi cheksiz bo'lib qolgan element diagnostikasi.",
    "theory": "Kuygan element tok o'tkazmaydi va butun kuchlanish uning uchlariga tushadi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 160,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 320,
        "y": 180,
        "resistance": 220
      },
      {
        "id": "l1",
        "type": "bulb",
        "x": 440,
        "y": 240,
        "voltage": 6.0,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "r1_2",
        "toPinId": "l1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "l1_2",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_056",
    "num": 56,
    "title": "Nosozlikni Qidirish: Noto'g'ri Nominal",
    "category": "measuring",
    "categoryName": "O'lchov & Diagnostika",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "O'lchov",
      "Multimetr",
      "Diagnostika",
      "Sinov",
      "Tok",
      "Kuchlanish"
    ],
    "desc": "Keragidan 10 baravar katta qarshilik qo'yilgandagi holat.",
    "theory": "Rezistor nominali haddan tashqari katta bo'lsa, zanjirdagi tok yetarli bo'lmay qoladi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 160,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 320,
        "y": 180,
        "resistance": 1000
      },
      {
        "id": "l1",
        "type": "led",
        "x": 440,
        "y": 240,
        "voltage": 6.0,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "r1_2",
        "toPinId": "l1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "l1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_057",
    "num": 57,
    "title": "Manba Ichki Qarshiligi Tahlili",
    "category": "measuring",
    "categoryName": "O'lchov & Diagnostika",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "O'lchov",
      "Multimetr",
      "Diagnostika",
      "Sinov",
      "Tok",
      "Kuchlanish"
    ],
    "desc": "Salt yurish va to'liq yuklama kuchlanishlari farqi.",
    "theory": "Haqiqiy batareyalar o'z ichki qarshiligiga (r) ega bo'lib, katta tokda qiziydi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 160,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 320,
        "y": 180,
        "resistance": 220
      },
      {
        "id": "l1",
        "type": "bulb",
        "x": 440,
        "y": 240,
        "voltage": 6.0,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "r1_2",
        "toPinId": "l1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "l1_2",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_058",
    "num": 58,
    "title": "Kondensator Zaryad Kuchlanishi Grafigi",
    "category": "measuring",
    "categoryName": "O'lchov & Diagnostika",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "O'lchov",
      "Multimetr",
      "Diagnostika",
      "Sinov",
      "Tok",
      "Kuchlanish"
    ],
    "desc": "Vaqt o'tishi bilan kuchlanishning eksponensial o'sishi.",
    "theory": "Kondensator dastlab tez, keyin esa sekinlashib maksimal kuchlanishgacha zaryadlanadi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 160,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 320,
        "y": 180,
        "resistance": 1000
      },
      {
        "id": "l1",
        "type": "bulb",
        "x": 440,
        "y": 240,
        "voltage": 6.0,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "r1_2",
        "toPinId": "l1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "l1_2",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_059",
    "num": 59,
    "title": "Motor Ishga Tushish Toki (Inrush Current)",
    "category": "measuring",
    "categoryName": "O'lchov & Diagnostika",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "O'lchov",
      "Multimetr",
      "Diagnostika",
      "Sinov",
      "Tok",
      "Kuchlanish"
    ],
    "desc": "Dvigatel start olgandagi dastlabki yuqori tok tahlili.",
    "theory": "Rotor to'xtab turganda qarshi-EYUK yo'qligi sababli start toki 3-5 baravar katta bo'ladi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 160,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 320,
        "y": 180,
        "resistance": 220
      },
      {
        "id": "l1",
        "type": "led",
        "x": 440,
        "y": 240,
        "voltage": 6.0,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "r1_2",
        "toPinId": "l1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "l1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_060",
    "num": 60,
    "title": "To'liq Laboratoriya Sinov Stendi",
    "category": "measuring",
    "categoryName": "O'lchov & Diagnostika",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "O'lchov",
      "Multimetr",
      "Diagnostika",
      "Sinov",
      "Tok",
      "Kuchlanish"
    ],
    "desc": "Voltmetr, Ampermetr va Otsillograf bir vaqtning o'zida.",
    "theory": "Kompleks diagnostika: barcha elektr kattaliklarini bir vaqtning o'zida nazorat qilish.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 160,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 320,
        "y": 180,
        "resistance": 1000
      },
      {
        "id": "l1",
        "type": "bulb",
        "x": 440,
        "y": 240,
        "voltage": 6.0,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "r1_2",
        "toPinId": "l1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "l1_2",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_061",
    "num": 61,
    "title": "LED ning Anod va Katod Qutblari",
    "category": "diodes",
    "categoryName": "Diodlar & Yarimo'tkazgichlar",
    "difficulty": "beginner",
    "difficultyName": "Boshlang'ich",
    "tags": [
      "LED",
      "Diod",
      "Yarimo'tkazgich",
      "Yorug'lik",
      "Anod",
      "Katod"
    ],
    "desc": "LED ning qutblarini to'g'ri aniqlash va ulash qoidalari.",
    "theory": "Anod (+) uzun oyoqcha, Katod (-) kalta oyoqcha va korpusida kesik bo'ladi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 280,
        "y": 180,
        "resistance": 330
      },
      {
        "id": "led1",
        "type": "led",
        "x": 400,
        "y": 180,
        "ledColor": "#EF4444"
      },
      {
        "id": "led2",
        "type": "led_green",
        "x": 400,
        "y": 300,
        "ledColor": "#10B981"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "r1_2",
        "toPinId": "led1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "b1_p",
        "toPinId": "led2_a",
        "color": "#EF4444"
      },
      {
        "id": "w4",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      },
      {
        "id": "w5",
        "fromPinId": "led2_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_062",
    "num": 62,
    "title": "Qarama-qarshi Parallel LED lar",
    "category": "diodes",
    "categoryName": "Diodlar & Yarimo'tkazgichlar",
    "difficulty": "beginner",
    "difficultyName": "Boshlang'ich",
    "tags": [
      "LED",
      "Diod",
      "Yarimo'tkazgich",
      "Yorug'lik",
      "Anod",
      "Katod"
    ],
    "desc": "Qutblanish almashganda qizil yoki yashil LED navbat bilan yonishi.",
    "theory": "Teskari parallel ulangan diodlar o'zgaruvchan tok yo'nalishini ko'rsatishda ishlatiladi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 280,
        "y": 180,
        "resistance": 330
      },
      {
        "id": "led1",
        "type": "led",
        "x": 400,
        "y": 180,
        "ledColor": "#EF4444"
      },
      {
        "id": "led2",
        "type": "led_green",
        "x": 400,
        "y": 300,
        "ledColor": "#10B981"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "r1_2",
        "toPinId": "led1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "b1_p",
        "toPinId": "led2_a",
        "color": "#EF4444"
      },
      {
        "id": "w4",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      },
      {
        "id": "w5",
        "fromPinId": "led2_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_063",
    "num": 63,
    "title": "Svetofor Modeli (Qizil, Sariq, Yashil)",
    "category": "diodes",
    "categoryName": "Diodlar & Yarimo'tkazgichlar",
    "difficulty": "beginner",
    "difficultyName": "Boshlang'ich",
    "tags": [
      "LED",
      "Diod",
      "Yarimo'tkazgich",
      "Yorug'lik",
      "Anod",
      "Katod"
    ],
    "desc": "3 ta alohida kalit bilan boshqariladigan svetofor LED lari.",
    "theory": "Har bir rangdagi LED o'z to'g'ri kuchlanishiga ega (Qizil: 1.8V, Sariq: 2.0V, Yashil: 2.2V).",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 280,
        "y": 180,
        "resistance": 330
      },
      {
        "id": "led1",
        "type": "led",
        "x": 400,
        "y": 180,
        "ledColor": "#EF4444"
      },
      {
        "id": "led2",
        "type": "led_green",
        "x": 400,
        "y": 300,
        "ledColor": "#10B981"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "r1_2",
        "toPinId": "led1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "b1_p",
        "toPinId": "led2_a",
        "color": "#EF4444"
      },
      {
        "id": "w4",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      },
      {
        "id": "w5",
        "fromPinId": "led2_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_064",
    "num": 64,
    "title": "Yuqori Kuchlanishli LED Himoyasi",
    "category": "diodes",
    "categoryName": "Diodlar & Yarimo'tkazgichlar",
    "difficulty": "beginner",
    "difficultyName": "Boshlang'ich",
    "tags": [
      "LED",
      "Diod",
      "Yarimo'tkazgich",
      "Yorug'lik",
      "Anod",
      "Katod"
    ],
    "desc": "Katta kuchlanishda LED ni saqlab qoluvchi yuqori qarshilikli rezistor.",
    "theory": "Ballast qarshiligi R = (U_manba - U_led) / I_led formulasi bilan hisoblanadi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 280,
        "y": 180,
        "resistance": 330
      },
      {
        "id": "led1",
        "type": "led",
        "x": 400,
        "y": 180,
        "ledColor": "#EF4444"
      },
      {
        "id": "led2",
        "type": "led_green",
        "x": 400,
        "y": 300,
        "ledColor": "#10B981"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "r1_2",
        "toPinId": "led1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "b1_p",
        "toPinId": "led2_a",
        "color": "#EF4444"
      },
      {
        "id": "w4",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      },
      {
        "id": "w5",
        "fromPinId": "led2_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_065",
    "num": 65,
    "title": "Bipolyar Yo'nalish Indikatori",
    "category": "diodes",
    "categoryName": "Diodlar & Yarimo'tkazgichlar",
    "difficulty": "beginner",
    "difficultyName": "Boshlang'ich",
    "tags": [
      "LED",
      "Diod",
      "Yarimo'tkazgich",
      "Yorug'lik",
      "Anod",
      "Katod"
    ],
    "desc": "Tok manbai qutblari to'g'riligini ko'rsatuvchi ikki rangli indikator.",
    "theory": "Tok bir tomonga oqsa qizil, teskari oqsa yashil LED yonadi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 280,
        "y": 180,
        "resistance": 330
      },
      {
        "id": "led1",
        "type": "led",
        "x": 400,
        "y": 180,
        "ledColor": "#EF4444"
      },
      {
        "id": "led2",
        "type": "led_green",
        "x": 400,
        "y": 300,
        "ledColor": "#10B981"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "r1_2",
        "toPinId": "led1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "b1_p",
        "toPinId": "led2_a",
        "color": "#EF4444"
      },
      {
        "id": "w4",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      },
      {
        "id": "w5",
        "fromPinId": "led2_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_066",
    "num": 66,
    "title": "Ketma-ket 4 ta LED Zanjiri",
    "category": "diodes",
    "categoryName": "Diodlar & Yarimo'tkazgichlar",
    "difficulty": "beginner",
    "difficultyName": "Boshlang'ich",
    "tags": [
      "LED",
      "Diod",
      "Yarimo'tkazgich",
      "Yorug'lik",
      "Anod",
      "Katod"
    ],
    "desc": "9V manbaga 4 ta qizil LED ni ketma-ket ulash.",
    "theory": "4 ta LED * 1.8V = 7.2V to'g'ri tushish hosil qiladi, energiya samaradorligi yuqori bo'ladi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 280,
        "y": 180,
        "resistance": 330
      },
      {
        "id": "led1",
        "type": "led",
        "x": 400,
        "y": 180,
        "ledColor": "#EF4444"
      },
      {
        "id": "led2",
        "type": "led_green",
        "x": 400,
        "y": 300,
        "ledColor": "#10B981"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "r1_2",
        "toPinId": "led1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "b1_p",
        "toPinId": "led2_a",
        "color": "#EF4444"
      },
      {
        "id": "w4",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      },
      {
        "id": "w5",
        "fromPinId": "led2_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_067",
    "num": 67,
    "title": "Kaskadli LED Indikatori",
    "category": "diodes",
    "categoryName": "Diodlar & Yarimo'tkazgichlar",
    "difficulty": "beginner",
    "difficultyName": "Boshlang'ich",
    "tags": [
      "LED",
      "Diod",
      "Yarimo'tkazgich",
      "Yorug'lik",
      "Anod",
      "Katod"
    ],
    "desc": "3 ta LED orqali darajani ko'rsatish modeli.",
    "theory": "Avtomobil panellarida va audio uskunalarda daraja ko'rsatkichlari shu prinsipda quriladi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 280,
        "y": 180,
        "resistance": 330
      },
      {
        "id": "led1",
        "type": "led",
        "x": 400,
        "y": 180,
        "ledColor": "#EF4444"
      },
      {
        "id": "led2",
        "type": "led_green",
        "x": 400,
        "y": 300,
        "ledColor": "#10B981"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "r1_2",
        "toPinId": "led1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "b1_p",
        "toPinId": "led2_a",
        "color": "#EF4444"
      },
      {
        "id": "w4",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      },
      {
        "id": "w5",
        "fromPinId": "led2_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_068",
    "num": 68,
    "title": "LED + Kondensator (Silliq O'chish)",
    "category": "diodes",
    "categoryName": "Diodlar & Yarimo'tkazgichlar",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "LED",
      "Diod",
      "Yarimo'tkazgich",
      "Yorug'lik",
      "Anod",
      "Katod"
    ],
    "desc": "Quvvat uzilgandan so'ng LED ning sekin so'nishi.",
    "theory": "Kondensatorda to'plangan zaryad quvvat uzilgach LED orqali asta-sekin razryadlanadi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 280,
        "y": 180,
        "resistance": 330
      },
      {
        "id": "led1",
        "type": "led",
        "x": 400,
        "y": 180,
        "ledColor": "#EF4444"
      },
      {
        "id": "led2",
        "type": "led_green",
        "x": 400,
        "y": 300,
        "ledColor": "#10B981"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "r1_2",
        "toPinId": "led1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "b1_p",
        "toPinId": "led2_a",
        "color": "#EF4444"
      },
      {
        "id": "w4",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      },
      {
        "id": "w5",
        "fromPinId": "led2_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_069",
    "num": 69,
    "title": "LED Chaqnash Modeli",
    "category": "diodes",
    "categoryName": "Diodlar & Yarimo'tkazgichlar",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "LED",
      "Diod",
      "Yarimo'tkazgich",
      "Yorug'lik",
      "Anod",
      "Katod"
    ],
    "desc": "Kalitni bosib uzganda tezkor yorug'lik impulslari hosil qilish.",
    "theory": "LED larning inertsiya vaqti juda kichik (nanosekundlar), shuning uchun chaqnashga tez javob beradi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 280,
        "y": 180,
        "resistance": 330
      },
      {
        "id": "led1",
        "type": "led",
        "x": 400,
        "y": 180,
        "ledColor": "#EF4444"
      },
      {
        "id": "led2",
        "type": "led_green",
        "x": 400,
        "y": 300,
        "ledColor": "#10B981"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "r1_2",
        "toPinId": "led1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "b1_p",
        "toPinId": "led2_a",
        "color": "#EF4444"
      },
      {
        "id": "w4",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      },
      {
        "id": "w5",
        "fromPinId": "led2_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_070",
    "num": 70,
    "title": "Optojuftlik (Optocoupler) Boshlang'ich Modeli",
    "category": "diodes",
    "categoryName": "Diodlar & Yarimo'tkazgichlar",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "LED",
      "Diod",
      "Yarimo'tkazgich",
      "Yorug'lik",
      "Anod",
      "Katod"
    ],
    "desc": "Yorug'lik orqali galvanik ajratilgan signal uzatish asosi.",
    "theory": "Optronlar yuqori kuchlanishli zanjirlarni past kuchlanishli boshqaruvdan himoya qiladi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 280,
        "y": 180,
        "resistance": 330
      },
      {
        "id": "led1",
        "type": "led",
        "x": 400,
        "y": 180,
        "ledColor": "#EF4444"
      },
      {
        "id": "led2",
        "type": "led_green",
        "x": 400,
        "y": 300,
        "ledColor": "#10B981"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "r1_2",
        "toPinId": "led1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "b1_p",
        "toPinId": "led2_a",
        "color": "#EF4444"
      },
      {
        "id": "w4",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      },
      {
        "id": "w5",
        "fromPinId": "led2_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_071",
    "num": 71,
    "title": "Motor Cho'tkalari Shovqinidan Diodli Himoya",
    "category": "diodes",
    "categoryName": "Diodlar & Yarimo'tkazgichlar",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "LED",
      "Diod",
      "Yarimo'tkazgich",
      "Yorug'lik",
      "Anod",
      "Katod"
    ],
    "desc": "Dvigatel o'chirilgandagi induktiv zarbani so'ndirish.",
    "theory": "Induktiv yuklamalar o'chirilganda teskari EYuK hosil qiladi va elektron qismlarni kuydirishi mumkin.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 280,
        "y": 180,
        "resistance": 330
      },
      {
        "id": "led1",
        "type": "led",
        "x": 400,
        "y": 180,
        "ledColor": "#EF4444"
      },
      {
        "id": "led2",
        "type": "led_green",
        "x": 400,
        "y": 300,
        "ledColor": "#10B981"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "r1_2",
        "toPinId": "led1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "b1_p",
        "toPinId": "led2_a",
        "color": "#EF4444"
      },
      {
        "id": "w4",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      },
      {
        "id": "w5",
        "fromPinId": "led2_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_072",
    "num": 72,
    "title": "Bir Yarim Davrli To'g'rilagich Modeli",
    "category": "diodes",
    "categoryName": "Diodlar & Yarimo'tkazgichlar",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "LED",
      "Diod",
      "Yarimo'tkazgich",
      "Yorug'lik",
      "Anod",
      "Katod"
    ],
    "desc": "Diodning bir tomonlama tok o'tkazish xususiyatini tekshirish.",
    "theory": "Diod faqat musbat yarim davrni o'tkazadi, manfiy yarim davrni esa to'sadi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 280,
        "y": 180,
        "resistance": 330
      },
      {
        "id": "led1",
        "type": "led",
        "x": 400,
        "y": 180,
        "ledColor": "#EF4444"
      },
      {
        "id": "led2",
        "type": "led_green",
        "x": 400,
        "y": 300,
        "ledColor": "#10B981"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "r1_2",
        "toPinId": "led1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "b1_p",
        "toPinId": "led2_a",
        "color": "#EF4444"
      },
      {
        "id": "w4",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      },
      {
        "id": "w5",
        "fromPinId": "led2_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_073",
    "num": 73,
    "title": "Diod orqali Kuchlanishni 0.7V ga Pasaytirish",
    "category": "diodes",
    "categoryName": "Diodlar & Yarimo'tkazgichlar",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "LED",
      "Diod",
      "Yarimo'tkazgich",
      "Yorug'lik",
      "Anod",
      "Katod"
    ],
    "desc": "Silitsiy diodi orqali kuchlanish tushishini hosil qilish.",
    "theory": "O'tkazuvchan holatdagi p-n o'tishda doimiy ~0.7V kuchlanish tushishi mavjud bo'ladi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 280,
        "y": 180,
        "resistance": 330
      },
      {
        "id": "led1",
        "type": "led",
        "x": 400,
        "y": 180,
        "ledColor": "#EF4444"
      },
      {
        "id": "led2",
        "type": "led_green",
        "x": 400,
        "y": 300,
        "ledColor": "#10B981"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "r1_2",
        "toPinId": "led1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "b1_p",
        "toPinId": "led2_a",
        "color": "#EF4444"
      },
      {
        "id": "w4",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      },
      {
        "id": "w5",
        "fromPinId": "led2_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_074",
    "num": 74,
    "title": "Ketma-ket 3 ta Diod (2.1V Pasaytirish)",
    "category": "diodes",
    "categoryName": "Diodlar & Yarimo'tkazgichlar",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "LED",
      "Diod",
      "Yarimo'tkazgich",
      "Yorug'lik",
      "Anod",
      "Katod"
    ],
    "desc": "9V manbadan 6.9V barqaror kuchlanish hosil qilish.",
    "theory": "Diodlar zanjiri past kuchlanishli stabilizator vazifasini bajarishi mumkin.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 280,
        "y": 180,
        "resistance": 330
      },
      {
        "id": "led1",
        "type": "led",
        "x": 400,
        "y": 180,
        "ledColor": "#EF4444"
      },
      {
        "id": "led2",
        "type": "led_green",
        "x": 400,
        "y": 300,
        "ledColor": "#10B981"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "r1_2",
        "toPinId": "led1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "b1_p",
        "toPinId": "led2_a",
        "color": "#EF4444"
      },
      {
        "id": "w4",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      },
      {
        "id": "w5",
        "fromPinId": "led2_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_075",
    "num": 75,
    "title": "LED Stroboskop Zanjiri",
    "category": "diodes",
    "categoryName": "Diodlar & Yarimo'tkazgichlar",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "LED",
      "Diod",
      "Yarimo'tkazgich",
      "Yorug'lik",
      "Anod",
      "Katod"
    ],
    "desc": "Tez-tez chaqnab turuvchi stroboskopik yoritish zanjiri.",
    "theory": "Tez miltillash orqali harakatlanuvchi mexanizmlarni vizual to'xtatib ko'rish mumkin.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 280,
        "y": 180,
        "resistance": 330
      },
      {
        "id": "led1",
        "type": "led",
        "x": 400,
        "y": 180,
        "ledColor": "#EF4444"
      },
      {
        "id": "led2",
        "type": "led_green",
        "x": 400,
        "y": 300,
        "ledColor": "#10B981"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "r1_2",
        "toPinId": "led1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "b1_p",
        "toPinId": "led2_a",
        "color": "#EF4444"
      },
      {
        "id": "w4",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      },
      {
        "id": "w5",
        "fromPinId": "led2_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_076",
    "num": 76,
    "title": "Batareya Holati Indikatori",
    "category": "diodes",
    "categoryName": "Diodlar & Yarimo'tkazgichlar",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "LED",
      "Diod",
      "Yarimo'tkazgich",
      "Yorug'lik",
      "Anod",
      "Katod"
    ],
    "desc": "Batareya quvvati yetarli bo'lgandagina yonuvchi indikator zanjiri.",
    "theory": "Kuchlanish ma'lum chegaradan pastga tushganda LED o'chadi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 280,
        "y": 180,
        "resistance": 330
      },
      {
        "id": "led1",
        "type": "led",
        "x": 400,
        "y": 180,
        "ledColor": "#EF4444"
      },
      {
        "id": "led2",
        "type": "led_green",
        "x": 400,
        "y": 300,
        "ledColor": "#10B981"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "r1_2",
        "toPinId": "led1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "b1_p",
        "toPinId": "led2_a",
        "color": "#EF4444"
      },
      {
        "id": "w4",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      },
      {
        "id": "w5",
        "fromPinId": "led2_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_077",
    "num": 77,
    "title": "LED Matritsasi Asosi (2x2)",
    "category": "diodes",
    "categoryName": "Diodlar & Yarimo'tkazgichlar",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "LED",
      "Diod",
      "Yarimo'tkazgich",
      "Yorug'lik",
      "Anod",
      "Katod"
    ],
    "desc": "To'rtta LED dan iborat matritsali displey poydevori.",
    "theory": "Matritsali boshqaruv kamroq simlar bilan ko'p sonli piksellarni yoqish imkonini beradi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 280,
        "y": 180,
        "resistance": 330
      },
      {
        "id": "led1",
        "type": "led",
        "x": 400,
        "y": 180,
        "ledColor": "#EF4444"
      },
      {
        "id": "led2",
        "type": "led_green",
        "x": 400,
        "y": 300,
        "ledColor": "#10B981"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "r1_2",
        "toPinId": "led1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "b1_p",
        "toPinId": "led2_a",
        "color": "#EF4444"
      },
      {
        "id": "w4",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      },
      {
        "id": "w5",
        "fromPinId": "led2_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_078",
    "num": 78,
    "title": "Qayta Ulanishdan Himoyalangan Zanjir",
    "category": "diodes",
    "categoryName": "Diodlar & Yarimo'tkazgichlar",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "LED",
      "Diod",
      "Yarimo'tkazgich",
      "Yorug'lik",
      "Anod",
      "Katod"
    ],
    "desc": "Batareya teskari ulansa ham kuymaydigan diodli xavfsiz zanjir.",
    "theory": "Diod batareya teskari ulanganda tokni butunlay to'sib, qimmatbaho chiplarni asraydi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 280,
        "y": 180,
        "resistance": 330
      },
      {
        "id": "led1",
        "type": "led",
        "x": 400,
        "y": 180,
        "ledColor": "#EF4444"
      },
      {
        "id": "led2",
        "type": "led_green",
        "x": 400,
        "y": 300,
        "ledColor": "#10B981"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "r1_2",
        "toPinId": "led1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "b1_p",
        "toPinId": "led2_a",
        "color": "#EF4444"
      },
      {
        "id": "w4",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      },
      {
        "id": "w5",
        "fromPinId": "led2_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_079",
    "num": 79,
    "title": "LED va Buzzer Sinxron Indikatori",
    "category": "diodes",
    "categoryName": "Diodlar & Yarimo'tkazgichlar",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "LED",
      "Diod",
      "Yarimo'tkazgich",
      "Yorug'lik",
      "Anod",
      "Katod"
    ],
    "desc": "Bir vaqtning o'zida ham tovush, ham yorug'lik signali berish.",
    "theory": "Ogohlantirish tizimlarida eshitish va ko'rish analizatorlariga birga ta'sir qilinadi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 280,
        "y": 180,
        "resistance": 330
      },
      {
        "id": "led1",
        "type": "led",
        "x": 400,
        "y": 180,
        "ledColor": "#EF4444"
      },
      {
        "id": "led2",
        "type": "led_green",
        "x": 400,
        "y": 300,
        "ledColor": "#10B981"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "r1_2",
        "toPinId": "led1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "b1_p",
        "toPinId": "led2_a",
        "color": "#EF4444"
      },
      {
        "id": "w4",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      },
      {
        "id": "w5",
        "fromPinId": "led2_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_080",
    "num": 80,
    "title": "Yuqori Yorqinlikdagi LED Klasteri",
    "category": "diodes",
    "categoryName": "Diodlar & Yarimo'tkazgichlar",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "LED",
      "Diod",
      "Yarimo'tkazgich",
      "Yorug'lik",
      "Anod",
      "Katod"
    ],
    "desc": "Bir nechta LED larni klaster qilib yoritish maydonini oshirish.",
    "theory": "Klasterli LED modullari projektorlar va ko'cha yoritgichlarida keng qo'llaniladi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 280,
        "y": 180,
        "resistance": 330
      },
      {
        "id": "led1",
        "type": "led",
        "x": 400,
        "y": 180,
        "ledColor": "#EF4444"
      },
      {
        "id": "led2",
        "type": "led_green",
        "x": 400,
        "y": 300,
        "ledColor": "#10B981"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "r1_2",
        "toPinId": "led1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "b1_p",
        "toPinId": "led2_a",
        "color": "#EF4444"
      },
      {
        "id": "w4",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      },
      {
        "id": "w5",
        "fromPinId": "led2_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_081",
    "num": 81,
    "title": "Oddiy Tungi Chiroq (LDR + LED)",
    "category": "sensors",
    "categoryName": "Sensorlar & Fotorezistorlar LDR",
    "difficulty": "beginner",
    "difficultyName": "Boshlang'ich",
    "tags": [
      "LDR",
      "Sensor",
      "Datchik",
      "Fotorezistor",
      "Avtomatika",
      "Yorug'lik"
    ],
    "desc": "Qorong'i tushganda fotorezistor qarshiligi ortishi va chiroqni yoqish.",
    "theory": "Fotorezistor (LDR) yorug'likda past (100Ω), qorong'ida yuqori qarshilikka (1MΩ) ega bo'ladi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 100,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 200,
        "y": 160,
        "isOpen": false
      },
      {
        "id": "r_base",
        "type": "resistor_1k",
        "x": 320,
        "y": 160,
        "resistance": 10000
      },
      {
        "id": "ldr1",
        "type": "ldr",
        "x": 320,
        "y": 300,
        "lightLevel": 0.0
      },
      {
        "id": "q1",
        "type": "transistor_npn",
        "x": 440,
        "y": 240
      },
      {
        "id": "r_col",
        "type": "resistor",
        "x": 440,
        "y": 140,
        "resistance": 330
      },
      {
        "id": "led1",
        "type": "led",
        "x": 560,
        "y": 200,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "sw1_2",
        "toPinId": "r_base_1",
        "color": "#EF4444"
      },
      {
        "id": "w3",
        "fromPinId": "sw1_2",
        "toPinId": "r_col_1",
        "color": "#EF4444"
      },
      {
        "id": "w4",
        "fromPinId": "r_base_2",
        "toPinId": "q1_b",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "q1_b",
        "toPinId": "ldr1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w6",
        "fromPinId": "ldr1_2",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      },
      {
        "id": "w7",
        "fromPinId": "r_col_2",
        "toPinId": "led1_a",
        "color": "#00FF87"
      },
      {
        "id": "w8",
        "fromPinId": "led1_k",
        "toPinId": "q1_c",
        "color": "#00FF87"
      },
      {
        "id": "w9",
        "fromPinId": "q1_e",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "1. Kalitni bosing: zanjirga quvvat beriladi (yoki uziladi).",
      "2. '☀️ Kun' tugmasini bosing: LDR qarshiligi pasayadi va LED O'CHADI.",
      "3. '🌙 Tun' tugmasini bosing: LDR qarshiligi ortadi va LED YONADI!",
      "4. Kalitni ochsangiz: chiroq qorong'ida ham butunlay o'chadi."
    ]
  },
  {
    "id": "tmpl_082",
    "num": 82,
    "title": "Kunduzgi Signalizatsiya (LDR + Buzzer)",
    "category": "sensors",
    "categoryName": "Sensorlar & Fotorezistorlar LDR",
    "difficulty": "beginner",
    "difficultyName": "Boshlang'ich",
    "tags": [
      "LDR",
      "Sensor",
      "Datchik",
      "Fotorezistor",
      "Avtomatika",
      "Yorug'lik"
    ],
    "desc": "Tong otganda yoki yorug'lik tushganda signal chaluvchi zanjir.",
    "theory": "Yorug'lik tushganda LDR qarshiligi pasayadi va buzzer orqali tok oqib signal chaladi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 120,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 220,
        "y": 180,
        "isOpen": false
      },
      {
        "id": "ldr1",
        "type": "ldr",
        "x": 340,
        "y": 180,
        "lightLevel": 0.5
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 440,
        "y": 180,
        "resistance": 470
      },
      {
        "id": "led1",
        "type": "led",
        "x": 540,
        "y": 240,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "sw1_2",
        "toPinId": "ldr1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "ldr1_2",
        "toPinId": "r1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "r1_2",
        "toPinId": "led1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "1. Kalitni bosib sxemani yoqing yoki o'chiring.",
      "2. '☀️ Kun' / '🌙 Tun' tugmalari orqali LDR qarshiligini o'zgartiring."
    ]
  },
  {
    "id": "tmpl_083",
    "num": 83,
    "title": "LDR Kuchlanish Bo'luvchi",
    "category": "sensors",
    "categoryName": "Sensorlar & Fotorezistorlar LDR",
    "difficulty": "beginner",
    "difficultyName": "Boshlang'ich",
    "tags": [
      "LDR",
      "Sensor",
      "Datchik",
      "Fotorezistor",
      "Avtomatika",
      "Yorug'lik"
    ],
    "desc": "Yorug'lik darajasiga mutanosib analog kuchlanish olish sxemasi.",
    "theory": "U_out = U_in * (R_pastki / (R_yuqori + R_pastki)) qoidasi bo'yicha yorug'lik voltga aylanadi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 120,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 220,
        "y": 180,
        "isOpen": false
      },
      {
        "id": "ldr1",
        "type": "ldr",
        "x": 340,
        "y": 180,
        "lightLevel": 0.5
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 440,
        "y": 180,
        "resistance": 470
      },
      {
        "id": "led1",
        "type": "led",
        "x": 540,
        "y": 240,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "sw1_2",
        "toPinId": "ldr1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "ldr1_2",
        "toPinId": "r1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "r1_2",
        "toPinId": "led1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "1. Kalitni bosib sxemani yoqing yoki o'chiring.",
      "2. '☀️ Kun' / '🌙 Tun' tugmalari orqali LDR qarshiligini o'zgartiring."
    ]
  },
  {
    "id": "tmpl_084",
    "num": 84,
    "title": "Avtomatik Ko'cha Chirog'i Modeli",
    "category": "sensors",
    "categoryName": "Sensorlar & Fotorezistorlar LDR",
    "difficulty": "beginner",
    "difficultyName": "Boshlang'ich",
    "tags": [
      "LDR",
      "Sensor",
      "Datchik",
      "Fotorezistor",
      "Avtomatika",
      "Yorug'lik"
    ],
    "desc": "Shahar ko'cha chiroqlarining avtomatik oqshomda yonishi modeli.",
    "theory": "Fotoelektr relelar quyosh botganda tashqi yoritish tizimlarini avtomatik ishga tushiradi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 100,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 200,
        "y": 160,
        "isOpen": false
      },
      {
        "id": "pot1",
        "type": "potentiometer",
        "x": 320,
        "y": 160,
        "maxResistance": 20000,
        "ratio": 0.5
      },
      {
        "id": "ldr1",
        "type": "ldr",
        "x": 320,
        "y": 300,
        "lightLevel": 0.0
      },
      {
        "id": "q1",
        "type": "transistor_npn",
        "x": 440,
        "y": 240
      },
      {
        "id": "r_col",
        "type": "resistor",
        "x": 440,
        "y": 140,
        "resistance": 330
      },
      {
        "id": "led1",
        "type": "led",
        "x": 560,
        "y": 200,
        "ledColor": "#FBBF24"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "sw1_2",
        "toPinId": "pot1_1",
        "color": "#EF4444"
      },
      {
        "id": "w3",
        "fromPinId": "sw1_2",
        "toPinId": "r_col_1",
        "color": "#EF4444"
      },
      {
        "id": "w4",
        "fromPinId": "pot1_w",
        "toPinId": "q1_b",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "q1_b",
        "toPinId": "ldr1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w6",
        "fromPinId": "ldr1_2",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      },
      {
        "id": "w7",
        "fromPinId": "r_col_2",
        "toPinId": "led1_a",
        "color": "#00FF87"
      },
      {
        "id": "w8",
        "fromPinId": "led1_k",
        "toPinId": "q1_c",
        "color": "#00FF87"
      },
      {
        "id": "w9",
        "fromPinId": "q1_e",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "1. Potensiometr orqali chiroq qaysi qorong'ilik chegarasida yonishini sozlang.",
      "2. '☀️ Kun' va '🌙 Tun' rejimlarida avtomatika ishlashini sinang."
    ]
  },
  {
    "id": "tmpl_085",
    "num": 85,
    "title": "Lazerli Xavfsizlik Qo'riqchisi",
    "category": "sensors",
    "categoryName": "Sensorlar & Fotorezistorlar LDR",
    "difficulty": "beginner",
    "difficultyName": "Boshlang'ich",
    "tags": [
      "LDR",
      "Sensor",
      "Datchik",
      "Fotorezistor",
      "Avtomatika",
      "Yorug'lik"
    ],
    "desc": "Lazer nuri to'silganda zudlik bilan signal beruvchi qo'riqlash zanjiri.",
    "theory": "Lazer nuri LDR ga tushib turganda zanjir tinch, nurni to'siq uzishi bilanoq signal ishlaydi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 100,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 200,
        "y": 160,
        "isOpen": false
      },
      {
        "id": "r_base",
        "type": "resistor_1k",
        "x": 320,
        "y": 160,
        "resistance": 10000
      },
      {
        "id": "ldr1",
        "type": "ldr",
        "x": 320,
        "y": 300,
        "lightLevel": 1.0
      },
      {
        "id": "q1",
        "type": "transistor_npn",
        "x": 440,
        "y": 240
      },
      {
        "id": "bz1",
        "type": "buzzer",
        "x": 560,
        "y": 180
      },
      {
        "id": "led1",
        "type": "led",
        "x": 560,
        "y": 280,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "sw1_2",
        "toPinId": "r_base_1",
        "color": "#EF4444"
      },
      {
        "id": "w3",
        "fromPinId": "sw1_2",
        "toPinId": "bz1_p",
        "color": "#EF4444"
      },
      {
        "id": "w4",
        "fromPinId": "sw1_2",
        "toPinId": "led1_a",
        "color": "#EF4444"
      },
      {
        "id": "w5",
        "fromPinId": "r_base_2",
        "toPinId": "q1_b",
        "color": "#FBBF24"
      },
      {
        "id": "w6",
        "fromPinId": "q1_b",
        "toPinId": "ldr1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w7",
        "fromPinId": "ldr1_2",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      },
      {
        "id": "w8",
        "fromPinId": "bz1_n",
        "toPinId": "q1_c",
        "color": "#00FF87"
      },
      {
        "id": "w9",
        "fromPinId": "led1_k",
        "toPinId": "q1_c",
        "color": "#00FF87"
      },
      {
        "id": "w10",
        "fromPinId": "q1_e",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "1. Lazer nuri LDR ga tushib turganda (Kun/Yorug') tizim tinch.",
      "2. '🌙 Tun' tugmasini bosib nur to'silgandek qiling: bir zumda buzzer va qizil LED signal beradi!"
    ]
  },
  {
    "id": "tmpl_086",
    "num": 86,
    "title": "Soya Detektori (Qo'l yaqinlashishi)",
    "category": "sensors",
    "categoryName": "Sensorlar & Fotorezistorlar LDR",
    "difficulty": "beginner",
    "difficultyName": "Boshlang'ich",
    "tags": [
      "LDR",
      "Sensor",
      "Datchik",
      "Fotorezistor",
      "Avtomatika",
      "Yorug'lik"
    ],
    "desc": "Qo'l yaqinlashib soya tushirganda ishga tushuvchi datchik.",
    "theory": "Ob'ektning yaqinlashishini yorug'lik oqimining kamayishi orqali aniqlash usuli.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 120,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 220,
        "y": 180,
        "isOpen": false
      },
      {
        "id": "ldr1",
        "type": "ldr",
        "x": 340,
        "y": 180,
        "lightLevel": 0.5
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 440,
        "y": 180,
        "resistance": 470
      },
      {
        "id": "led1",
        "type": "led",
        "x": 540,
        "y": 240,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "sw1_2",
        "toPinId": "ldr1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "ldr1_2",
        "toPinId": "r1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "r1_2",
        "toPinId": "led1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "1. Kalitni bosib sxemani yoqing yoki o'chiring.",
      "2. '☀️ Kun' / '🌙 Tun' tugmalari orqali LDR qarshiligini o'zgartiring."
    ]
  },
  {
    "id": "tmpl_087",
    "num": 87,
    "title": "Optik O'lchagich (Lyuksmeter asosi)",
    "category": "sensors",
    "categoryName": "Sensorlar & Fotorezistorlar LDR",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "LDR",
      "Sensor",
      "Datchik",
      "Fotorezistor",
      "Avtomatika",
      "Yorug'lik"
    ],
    "desc": "Yorug'lik miqdorini multimetr orqali voltlarda o'lchash.",
    "theory": "Yorug'lik kuchi oshgan sari kuchlanish bo'luvchi chiqishidagi potensial mutanosib o'zgaradi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 120,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 220,
        "y": 180,
        "isOpen": false
      },
      {
        "id": "ldr1",
        "type": "ldr",
        "x": 340,
        "y": 180,
        "lightLevel": 0.5
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 440,
        "y": 180,
        "resistance": 470
      },
      {
        "id": "led1",
        "type": "led",
        "x": 540,
        "y": 240,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "sw1_2",
        "toPinId": "ldr1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "ldr1_2",
        "toPinId": "r1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "r1_2",
        "toPinId": "led1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "1. Kalitni bosib sxemani yoqing yoki o'chiring.",
      "2. '☀️ Kun' / '🌙 Tun' tugmalari orqali LDR qarshiligini o'zgartiring."
    ]
  },
  {
    "id": "tmpl_088",
    "num": 88,
    "title": "Quyosh Paneli Yo'nalish Datchigi",
    "category": "sensors",
    "categoryName": "Sensorlar & Fotorezistorlar LDR",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "LDR",
      "Sensor",
      "Datchik",
      "Fotorezistor",
      "Avtomatika",
      "Yorug'lik"
    ],
    "desc": "Yorug'lik qayerdan tushayotganini aniqlovchi datchik asosi.",
    "theory": "Ikkita fotorezistor solishtirilib, quyoshga qaragan burchak aniqlanadi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 120,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 220,
        "y": 180,
        "isOpen": false
      },
      {
        "id": "ldr1",
        "type": "ldr",
        "x": 340,
        "y": 180,
        "lightLevel": 0.5
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 440,
        "y": 180,
        "resistance": 470
      },
      {
        "id": "led1",
        "type": "led",
        "x": 540,
        "y": 240,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "sw1_2",
        "toPinId": "ldr1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "ldr1_2",
        "toPinId": "r1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "r1_2",
        "toPinId": "led1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "1. Kalitni bosib sxemani yoqing yoki o'chiring.",
      "2. '☀️ Kun' / '🌙 Tun' tugmalari orqali LDR qarshiligini o'zgartiring."
    ]
  },
  {
    "id": "tmpl_089",
    "num": 89,
    "title": "Sezgirligi Sozlanuvchi LDR Zanjiri",
    "category": "sensors",
    "categoryName": "Sensorlar & Fotorezistorlar LDR",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "LDR",
      "Sensor",
      "Datchik",
      "Fotorezistor",
      "Avtomatika",
      "Yorug'lik"
    ],
    "desc": "Potensiometr orqali yorug'lik chegarasini erkin sozlash.",
    "theory": "Potensiometr va LDR bo'luvchisi orqali har qanday xona yorug'ligiga moslashish mumkin.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 120,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 220,
        "y": 180,
        "isOpen": false
      },
      {
        "id": "ldr1",
        "type": "ldr",
        "x": 340,
        "y": 180,
        "lightLevel": 0.5
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 440,
        "y": 180,
        "resistance": 470
      },
      {
        "id": "led1",
        "type": "led",
        "x": 540,
        "y": 240,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "sw1_2",
        "toPinId": "ldr1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "ldr1_2",
        "toPinId": "r1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "r1_2",
        "toPinId": "led1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "1. Kalitni bosib sxemani yoqing yoki o'chiring.",
      "2. '☀️ Kun' / '🌙 Tun' tugmalari orqali LDR qarshiligini o'zgartiring."
    ]
  },
  {
    "id": "tmpl_090",
    "num": 90,
    "title": "Ikkala Tomonlama Komparator Modeli",
    "category": "sensors",
    "categoryName": "Sensorlar & Fotorezistorlar LDR",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "LDR",
      "Sensor",
      "Datchik",
      "Fotorezistor",
      "Avtomatika",
      "Yorug'lik"
    ],
    "desc": "Ikki LDR orasidagi yorug'lik farqini aniqlash.",
    "theory": "Differensial fotodatchiklar robotlarning yorug'lik manbasiga qarab yurishida qo'llaniladi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 120,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 220,
        "y": 180,
        "isOpen": false
      },
      {
        "id": "ldr1",
        "type": "ldr",
        "x": 340,
        "y": 180,
        "lightLevel": 0.5
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 440,
        "y": 180,
        "resistance": 470
      },
      {
        "id": "led1",
        "type": "led",
        "x": 540,
        "y": 240,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "sw1_2",
        "toPinId": "ldr1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "ldr1_2",
        "toPinId": "r1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "r1_2",
        "toPinId": "led1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "1. Kalitni bosib sxemani yoqing yoki o'chiring.",
      "2. '☀️ Kun' / '🌙 Tun' tugmalari orqali LDR qarshiligini o'zgartiring."
    ]
  },
  {
    "id": "tmpl_091",
    "num": 91,
    "title": "Avtomatik Oyna Pardalari Modeli",
    "category": "sensors",
    "categoryName": "Sensorlar & Fotorezistorlar LDR",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "LDR",
      "Sensor",
      "Datchik",
      "Fotorezistor",
      "Avtomatika",
      "Yorug'lik"
    ],
    "desc": "Yorug'lik kuchayganda motorni ishga tushiruvchi tizim.",
    "theory": "Quyosh nuri xonani qizdirmasligi uchun avtomatik pardalar yopiladi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 120,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 220,
        "y": 180,
        "isOpen": false
      },
      {
        "id": "ldr1",
        "type": "ldr",
        "x": 340,
        "y": 180,
        "lightLevel": 0.5
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 440,
        "y": 180,
        "resistance": 470
      },
      {
        "id": "led1",
        "type": "led",
        "x": 540,
        "y": 240,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "sw1_2",
        "toPinId": "ldr1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "ldr1_2",
        "toPinId": "r1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "r1_2",
        "toPinId": "led1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "1. Kalitni bosib sxemani yoqing yoki o'chiring.",
      "2. '☀️ Kun' / '🌙 Tun' tugmalari orqali LDR qarshiligini o'zgartiring."
    ]
  },
  {
    "id": "tmpl_092",
    "num": 92,
    "title": "Qorong'ulikda Chiroq + Buzzer",
    "category": "sensors",
    "categoryName": "Sensorlar & Fotorezistorlar LDR",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "LDR",
      "Sensor",
      "Datchik",
      "Fotorezistor",
      "Avtomatika",
      "Yorug'lik"
    ],
    "desc": "Avariya xavfsizligi: qorong'i bo'lib qolsa ikkita signal berish.",
    "theory": "Vizual va tovushli ogohlantirish avariya holatlarida ishonchlilikni oshiradi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 120,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 220,
        "y": 180,
        "isOpen": false
      },
      {
        "id": "ldr1",
        "type": "ldr",
        "x": 340,
        "y": 180,
        "lightLevel": 0.5
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 440,
        "y": 180,
        "resistance": 470
      },
      {
        "id": "led1",
        "type": "led",
        "x": 540,
        "y": 240,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "sw1_2",
        "toPinId": "ldr1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "ldr1_2",
        "toPinId": "r1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "r1_2",
        "toPinId": "led1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "1. Kalitni bosib sxemani yoqing yoki o'chiring.",
      "2. '☀️ Kun' / '🌙 Tun' tugmalari orqali LDR qarshiligini o'zgartiring."
    ]
  },
  {
    "id": "tmpl_093",
    "num": 93,
    "title": "Yorug'lik Pulsatsiyasi Kuzatuvi",
    "category": "sensors",
    "categoryName": "Sensorlar & Fotorezistorlar LDR",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "LDR",
      "Sensor",
      "Datchik",
      "Fotorezistor",
      "Avtomatika",
      "Yorug'lik"
    ],
    "desc": "Otsillografda yorug'lik o'zgarishini real vaqt rejimida ko'rish.",
    "theory": "Sun'iy chiroqlarning ko'zga ko'rinmas miltillashini LDR orqali otsillografda tahlil qilish mumkin.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 120,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 220,
        "y": 180,
        "isOpen": false
      },
      {
        "id": "ldr1",
        "type": "ldr",
        "x": 340,
        "y": 180,
        "lightLevel": 0.5
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 440,
        "y": 180,
        "resistance": 470
      },
      {
        "id": "led1",
        "type": "led",
        "x": 540,
        "y": 240,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "sw1_2",
        "toPinId": "ldr1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "ldr1_2",
        "toPinId": "r1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "r1_2",
        "toPinId": "led1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "1. Kalitni bosib sxemani yoqing yoki o'chiring.",
      "2. '☀️ Kun' / '🌙 Tun' tugmalari orqali LDR qarshiligini o'zgartiring."
    ]
  },
  {
    "id": "tmpl_094",
    "num": 94,
    "title": "Aqlli Xona Yoritish Tizimi",
    "category": "sensors",
    "categoryName": "Sensorlar & Fotorezistorlar LDR",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "LDR",
      "Sensor",
      "Datchik",
      "Fotorezistor",
      "Avtomatika",
      "Yorug'lik"
    ],
    "desc": "Xona yoritilganligiga qarab LED larni bosqichma-bosqich yoqish.",
    "theory": "Energiyani tejash uchun tabiiy yorug'lik yetarli bo'lganda elektr chiroqlar o'chiriladi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 120,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 220,
        "y": 180,
        "isOpen": false
      },
      {
        "id": "ldr1",
        "type": "ldr",
        "x": 340,
        "y": 180,
        "lightLevel": 0.5
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 440,
        "y": 180,
        "resistance": 470
      },
      {
        "id": "led1",
        "type": "led",
        "x": 540,
        "y": 240,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "sw1_2",
        "toPinId": "ldr1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "ldr1_2",
        "toPinId": "r1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "r1_2",
        "toPinId": "led1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "1. Kalitni bosib sxemani yoqing yoki o'chiring.",
      "2. '☀️ Kun' / '🌙 Tun' tugmalari orqali LDR qarshiligini o'zgartiring."
    ]
  },
  {
    "id": "tmpl_095",
    "num": 95,
    "title": "Olov va Yong'in Detektori Modeli",
    "category": "sensors",
    "categoryName": "Sensorlar & Fotorezistorlar LDR",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "LDR",
      "Sensor",
      "Datchik",
      "Fotorezistor",
      "Avtomatika",
      "Yorug'lik"
    ],
    "desc": "Olov yorug'ligining o'ziga xos chaqnashi va intensivligini tutish.",
    "theory": "Optik yong'in datchiklari tutun tarqalishidan avval olov nurini tezda payqaydi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 120,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 220,
        "y": 180,
        "isOpen": false
      },
      {
        "id": "ldr1",
        "type": "ldr",
        "x": 340,
        "y": 180,
        "lightLevel": 0.5
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 440,
        "y": 180,
        "resistance": 470
      },
      {
        "id": "led1",
        "type": "led",
        "x": 540,
        "y": 240,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "sw1_2",
        "toPinId": "ldr1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "ldr1_2",
        "toPinId": "r1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "r1_2",
        "toPinId": "led1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "1. Kalitni bosib sxemani yoqing yoki o'chiring.",
      "2. '☀️ Kun' / '🌙 Tun' tugmalari orqali LDR qarshiligini o'zgartiring."
    ]
  },
  {
    "id": "tmpl_096",
    "num": 96,
    "title": "Optik Takometr Asosi",
    "category": "sensors",
    "categoryName": "Sensorlar & Fotorezistorlar LDR",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "LDR",
      "Sensor",
      "Datchik",
      "Fotorezistor",
      "Avtomatika",
      "Yorug'lik"
    ],
    "desc": "Parrak aylanganda nurning to'silish chastotasini o'lchash.",
    "theory": "Aylanuvchi valning har bir aylanishida datchik impuls hosil qiladi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 120,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 220,
        "y": 180,
        "isOpen": false
      },
      {
        "id": "ldr1",
        "type": "ldr",
        "x": 340,
        "y": 180,
        "lightLevel": 0.5
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 440,
        "y": 180,
        "resistance": 470
      },
      {
        "id": "led1",
        "type": "led",
        "x": 540,
        "y": 240,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "sw1_2",
        "toPinId": "ldr1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "ldr1_2",
        "toPinId": "r1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "r1_2",
        "toPinId": "led1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "1. Kalitni bosib sxemani yoqing yoki o'chiring.",
      "2. '☀️ Kun' / '🌙 Tun' tugmalari orqali LDR qarshiligini o'zgartiring."
    ]
  },
  {
    "id": "tmpl_097",
    "num": 97,
    "title": "Kunduzgi Energiyani Tejovchi O'chirgich",
    "category": "sensors",
    "categoryName": "Sensorlar & Fotorezistorlar LDR",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "LDR",
      "Sensor",
      "Datchik",
      "Fotorezistor",
      "Avtomatika",
      "Yorug'lik"
    ],
    "desc": "Tong otishi bilan yuklamalarni o'chiruvchi avtomat.",
    "theory": "Quyosh chiqqandan keyin keraksiz sarf bo'layotgan elektr quvvatini uzadi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 120,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 220,
        "y": 180,
        "isOpen": false
      },
      {
        "id": "ldr1",
        "type": "ldr",
        "x": 340,
        "y": 180,
        "lightLevel": 0.5
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 440,
        "y": 180,
        "resistance": 470
      },
      {
        "id": "led1",
        "type": "led",
        "x": 540,
        "y": 240,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "sw1_2",
        "toPinId": "ldr1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "ldr1_2",
        "toPinId": "r1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "r1_2",
        "toPinId": "led1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "1. Kalitni bosib sxemani yoqing yoki o'chiring.",
      "2. '☀️ Kun' / '🌙 Tun' tugmalari orqali LDR qarshiligini o'zgartiring."
    ]
  },
  {
    "id": "tmpl_098",
    "num": 98,
    "title": "Optik Qaytma Aloqa Zanjiri",
    "category": "sensors",
    "categoryName": "Sensorlar & Fotorezistorlar LDR",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "LDR",
      "Sensor",
      "Datchik",
      "Fotorezistor",
      "Avtomatika",
      "Yorug'lik"
    ],
    "desc": "LED nuri LDR ga tushganda o'z-o'zini rostlash tajribasi.",
    "theory": "Optik teskari aloqa orqali yorug'lik intensivligini barqaror saqlash mumkin.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 120,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 220,
        "y": 180,
        "isOpen": false
      },
      {
        "id": "ldr1",
        "type": "ldr",
        "x": 340,
        "y": 180,
        "lightLevel": 0.5
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 440,
        "y": 180,
        "resistance": 470
      },
      {
        "id": "led1",
        "type": "led",
        "x": 540,
        "y": 240,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "sw1_2",
        "toPinId": "ldr1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "ldr1_2",
        "toPinId": "r1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "r1_2",
        "toPinId": "led1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "1. Kalitni bosib sxemani yoqing yoki o'chiring.",
      "2. '☀️ Kun' / '🌙 Tun' tugmalari orqali LDR qarshiligini o'zgartiring."
    ]
  },
  {
    "id": "tmpl_099",
    "num": 99,
    "title": "Qorong'ilik Darajasi Ko'rsatkichi",
    "category": "sensors",
    "categoryName": "Sensorlar & Fotorezistorlar LDR",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "LDR",
      "Sensor",
      "Datchik",
      "Fotorezistor",
      "Avtomatika",
      "Yorug'lik"
    ],
    "desc": "Yorug'likka qarab 3 xil darajani indikatsiya qilish.",
    "theory": "Yorug', xira va to'liq qorong'i zonalarni ajratib ko'rsatish.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 120,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 220,
        "y": 180,
        "isOpen": false
      },
      {
        "id": "ldr1",
        "type": "ldr",
        "x": 340,
        "y": 180,
        "lightLevel": 0.5
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 440,
        "y": 180,
        "resistance": 470
      },
      {
        "id": "led1",
        "type": "led",
        "x": 540,
        "y": 240,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "sw1_2",
        "toPinId": "ldr1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "ldr1_2",
        "toPinId": "r1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "r1_2",
        "toPinId": "led1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "1. Kalitni bosib sxemani yoqing yoki o'chiring.",
      "2. '☀️ Kun' / '🌙 Tun' tugmalari orqali LDR qarshiligini o'zgartiring."
    ]
  },
  {
    "id": "tmpl_100",
    "num": 100,
    "title": "Optoelektronik Xavfsizlik To'sig'i",
    "category": "sensors",
    "categoryName": "Sensorlar & Fotorezistorlar LDR",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "LDR",
      "Sensor",
      "Datchik",
      "Fotorezistor",
      "Avtomatika",
      "Yorug'lik"
    ],
    "desc": "Sanoat stanoklarida xavfli hududga qo'l kirsa to'xtatish.",
    "theory": "Optik to'siq uzilganda zudlik bilan dvigatelni to'xtatuvchi xavfsizlik standarti.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 120,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 220,
        "y": 180,
        "isOpen": false
      },
      {
        "id": "ldr1",
        "type": "ldr",
        "x": 340,
        "y": 180,
        "lightLevel": 0.5
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 440,
        "y": 180,
        "resistance": 470
      },
      {
        "id": "led1",
        "type": "led",
        "x": 540,
        "y": 240,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "sw1_2",
        "toPinId": "ldr1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "ldr1_2",
        "toPinId": "r1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "r1_2",
        "toPinId": "led1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "1. Kalitni bosib sxemani yoqing yoki o'chiring.",
      "2. '☀️ Kun' / '🌙 Tun' tugmalari orqali LDR qarshiligini o'zgartiring."
    ]
  },
  {
    "id": "tmpl_101",
    "num": 101,
    "title": "Kondensatorning Zaryadlanishi (RC)",
    "category": "capacitors",
    "categoryName": "Kondensatorlar & RC Zanjirlar",
    "difficulty": "beginner",
    "difficultyName": "Boshlang'ich",
    "tags": [
      "Kondensator",
      "Capacitor",
      "RC",
      "Filtr",
      "Zaryad",
      "Razryad"
    ],
    "desc": "9V manbadan 1kΩ rezistor orqali 100µF kondensatorni zaryadlash.",
    "theory": "Vaqt doimiysi τ = R * C = 1000Ω * 0.0001F = 0.1 soniya. To'liq zaryad ~5τ da erishiladi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 260,
        "y": 180,
        "isOpen": false
      },
      {
        "id": "r1",
        "type": "resistor_1k",
        "x": 380,
        "y": 180,
        "resistance": 1000
      },
      {
        "id": "cap1",
        "type": "capacitor",
        "x": 480,
        "y": 240,
        "capacitance": 0.0001
      },
      {
        "id": "led1",
        "type": "led",
        "x": 580,
        "y": 240,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "sw1_2",
        "toPinId": "r1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "r1_2",
        "toPinId": "cap1_p",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "cap1_p",
        "toPinId": "led1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "cap1_n",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      },
      {
        "id": "w6",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_102",
    "num": 102,
    "title": "Kondensatorning Razryadlanishi",
    "category": "capacitors",
    "categoryName": "Kondensatorlar & RC Zanjirlar",
    "difficulty": "beginner",
    "difficultyName": "Boshlang'ich",
    "tags": [
      "Kondensator",
      "Capacitor",
      "RC",
      "Filtr",
      "Zaryad",
      "Razryad"
    ],
    "desc": "Zaryadlangan kondensator energiyasi orqali LED ni yoqish.",
    "theory": "Kondensator o'z qoplamalarida elektr maydon energiyasini W = (C * U²) / 2 saqlaydi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 260,
        "y": 180,
        "isOpen": false
      },
      {
        "id": "r1",
        "type": "resistor_1k",
        "x": 380,
        "y": 180,
        "resistance": 1000
      },
      {
        "id": "cap1",
        "type": "capacitor",
        "x": 480,
        "y": 240,
        "capacitance": 0.0001
      },
      {
        "id": "led1",
        "type": "led",
        "x": 580,
        "y": 240,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "sw1_2",
        "toPinId": "r1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "r1_2",
        "toPinId": "cap1_p",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "cap1_p",
        "toPinId": "led1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "cap1_n",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      },
      {
        "id": "w6",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_103",
    "num": 103,
    "title": "Sekin Yonuvchi Chiroq Zanjiri",
    "category": "capacitors",
    "categoryName": "Kondensatorlar & RC Zanjirlar",
    "difficulty": "beginner",
    "difficultyName": "Boshlang'ich",
    "tags": [
      "Kondensator",
      "Capacitor",
      "RC",
      "Filtr",
      "Zaryad",
      "Razryad"
    ],
    "desc": "Kondensator zaryadlangani sari LED yorqinlashib boradi.",
    "theory": "Kondensator boshida qisqa tutashuv kabi, to'lgandan so'ng ochiq zanjir kabi harakat qiladi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 260,
        "y": 180,
        "isOpen": false
      },
      {
        "id": "r1",
        "type": "resistor_1k",
        "x": 380,
        "y": 180,
        "resistance": 1000
      },
      {
        "id": "cap1",
        "type": "capacitor",
        "x": 480,
        "y": 240,
        "capacitance": 0.0001
      },
      {
        "id": "led1",
        "type": "led",
        "x": 580,
        "y": 240,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "sw1_2",
        "toPinId": "r1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "r1_2",
        "toPinId": "cap1_p",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "cap1_p",
        "toPinId": "led1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "cap1_n",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      },
      {
        "id": "w6",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_104",
    "num": 104,
    "title": "Sekin O'chuvchi Chiroq (Fading LED)",
    "category": "capacitors",
    "categoryName": "Kondensatorlar & RC Zanjirlar",
    "difficulty": "beginner",
    "difficultyName": "Boshlang'ich",
    "tags": [
      "Kondensator",
      "Capacitor",
      "RC",
      "Filtr",
      "Zaryad",
      "Razryad"
    ],
    "desc": "Kalit uzilgach LED ning 3-5 soniya davomida asta so'nishi.",
    "theory": "Kondensator yig'ilgan zaryadni LED va rezistor orqali asta-sekin bo'shatadi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 260,
        "y": 180,
        "isOpen": false
      },
      {
        "id": "r1",
        "type": "resistor_1k",
        "x": 380,
        "y": 180,
        "resistance": 1000
      },
      {
        "id": "cap1",
        "type": "capacitor",
        "x": 480,
        "y": 240,
        "capacitance": 0.0001
      },
      {
        "id": "led1",
        "type": "led",
        "x": 580,
        "y": 240,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "sw1_2",
        "toPinId": "r1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "r1_2",
        "toPinId": "cap1_p",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "cap1_p",
        "toPinId": "led1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "cap1_n",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      },
      {
        "id": "w6",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_105",
    "num": 105,
    "title": "RC Filtr (Kuchlanish Tekislash)",
    "category": "capacitors",
    "categoryName": "Kondensatorlar & RC Zanjirlar",
    "difficulty": "beginner",
    "difficultyName": "Boshlang'ich",
    "tags": [
      "Kondensator",
      "Capacitor",
      "RC",
      "Filtr",
      "Zaryad",
      "Razryad"
    ],
    "desc": "O'zgaruvchan pulsatsiyalarni tekislash va shovqinni yutish.",
    "theory": "Sig'im filtrlari to'g'rilagichlardan so'ng pulsatsiyalarni bartaraf etishda ishlatiladi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 260,
        "y": 180,
        "isOpen": false
      },
      {
        "id": "r1",
        "type": "resistor_1k",
        "x": 380,
        "y": 180,
        "resistance": 1000
      },
      {
        "id": "cap1",
        "type": "capacitor",
        "x": 480,
        "y": 240,
        "capacitance": 0.0001
      },
      {
        "id": "led1",
        "type": "led",
        "x": 580,
        "y": 240,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "sw1_2",
        "toPinId": "r1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "r1_2",
        "toPinId": "cap1_p",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "cap1_p",
        "toPinId": "led1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "cap1_n",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      },
      {
        "id": "w6",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_106",
    "num": 106,
    "title": "Vaqt Kechikishli O'chirgich (Delay OFF)",
    "category": "capacitors",
    "categoryName": "Kondensatorlar & RC Zanjirlar",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "Kondensator",
      "Capacitor",
      "RC",
      "Filtr",
      "Zaryad",
      "Razryad"
    ],
    "desc": "Kalit ochilgach ma'lum vaqt o'tib yuklamaning o'chishi.",
    "theory": "Avtomobil salonida eshik yopilgach chiroqning biroz yonib turishi shu usulda qilinadi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 260,
        "y": 180,
        "isOpen": false
      },
      {
        "id": "r1",
        "type": "resistor_1k",
        "x": 380,
        "y": 180,
        "resistance": 1000
      },
      {
        "id": "cap1",
        "type": "capacitor",
        "x": 480,
        "y": 240,
        "capacitance": 0.0001
      },
      {
        "id": "led1",
        "type": "led",
        "x": 580,
        "y": 240,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "sw1_2",
        "toPinId": "r1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "r1_2",
        "toPinId": "cap1_p",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "cap1_p",
        "toPinId": "led1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "cap1_n",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      },
      {
        "id": "w6",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_107",
    "num": 107,
    "title": "Vaqt Kechikishli Yoquvchi (Delay ON)",
    "category": "capacitors",
    "categoryName": "Kondensatorlar & RC Zanjirlar",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "Kondensator",
      "Capacitor",
      "RC",
      "Filtr",
      "Zaryad",
      "Razryad"
    ],
    "desc": "Kalit yopilgach kondensator zaryadlanguncha kechikib yoqilish.",
    "theory": "Elektron uskunalarni tarmoqdagi kuchlanish barqarorlashgach ishga tushirishda qo'llaniladi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 260,
        "y": 180,
        "isOpen": false
      },
      {
        "id": "r1",
        "type": "resistor_1k",
        "x": 380,
        "y": 180,
        "resistance": 1000
      },
      {
        "id": "cap1",
        "type": "capacitor",
        "x": 480,
        "y": 240,
        "capacitance": 0.0001
      },
      {
        "id": "led1",
        "type": "led",
        "x": 580,
        "y": 240,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "sw1_2",
        "toPinId": "r1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "r1_2",
        "toPinId": "cap1_p",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "cap1_p",
        "toPinId": "led1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "cap1_n",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      },
      {
        "id": "w6",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_108",
    "num": 108,
    "title": "Kondensatorli So'nuvchi Ovoz",
    "category": "capacitors",
    "categoryName": "Kondensatorlar & RC Zanjirlar",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "Kondensator",
      "Capacitor",
      "RC",
      "Filtr",
      "Zaryad",
      "Razryad"
    ],
    "desc": "Buzzer ovozining sekin pasayib so'nib borishi.",
    "theory": "Buzzerga berilayotgan kuchlanish kondensator razryadi bilan pasayib boradi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 260,
        "y": 180,
        "isOpen": false
      },
      {
        "id": "r1",
        "type": "resistor_1k",
        "x": 380,
        "y": 180,
        "resistance": 1000
      },
      {
        "id": "cap1",
        "type": "capacitor",
        "x": 480,
        "y": 240,
        "capacitance": 0.0001
      },
      {
        "id": "led1",
        "type": "led",
        "x": 580,
        "y": 240,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "sw1_2",
        "toPinId": "r1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "r1_2",
        "toPinId": "cap1_p",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "cap1_p",
        "toPinId": "led1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "cap1_n",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      },
      {
        "id": "w6",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_109",
    "num": 109,
    "title": "Parallel Kondensatorlar (Sig'imni Oshirish)",
    "category": "capacitors",
    "categoryName": "Kondensatorlar & RC Zanjirlar",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "Kondensator",
      "Capacitor",
      "RC",
      "Filtr",
      "Zaryad",
      "Razryad"
    ],
    "desc": "2 ta 100µF kondensator parallel = 200µF umumiy sig'im.",
    "theory": "Parallel ulanganda qoplamalar maydoni qo'shiladi: C_umumiy = C1 + C2.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 260,
        "y": 180,
        "isOpen": false
      },
      {
        "id": "r1",
        "type": "resistor_1k",
        "x": 380,
        "y": 180,
        "resistance": 1000
      },
      {
        "id": "cap1",
        "type": "capacitor",
        "x": 480,
        "y": 240,
        "capacitance": 0.0001
      },
      {
        "id": "led1",
        "type": "led",
        "x": 580,
        "y": 240,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "sw1_2",
        "toPinId": "r1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "r1_2",
        "toPinId": "cap1_p",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "cap1_p",
        "toPinId": "led1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "cap1_n",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      },
      {
        "id": "w6",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_110",
    "num": 110,
    "title": "Ketma-ket Kondensatorlar",
    "category": "capacitors",
    "categoryName": "Kondensatorlar & RC Zanjirlar",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "Kondensator",
      "Capacitor",
      "RC",
      "Filtr",
      "Zaryad",
      "Razryad"
    ],
    "desc": "2 ta 100µF kondensator ketma-ket = 50µF umumiy sig'im.",
    "theory": "Ketma-ket ulanganda 1/C = 1/C1 + 1/C2. Ishchi kuchlanish esa ikki baravar ortadi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 260,
        "y": 180,
        "isOpen": false
      },
      {
        "id": "r1",
        "type": "resistor_1k",
        "x": 380,
        "y": 180,
        "resistance": 1000
      },
      {
        "id": "cap1",
        "type": "capacitor",
        "x": 480,
        "y": 240,
        "capacitance": 0.0001
      },
      {
        "id": "led1",
        "type": "led",
        "x": 580,
        "y": 240,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "sw1_2",
        "toPinId": "r1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "r1_2",
        "toPinId": "cap1_p",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "cap1_p",
        "toPinId": "led1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "cap1_n",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      },
      {
        "id": "w6",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_111",
    "num": 111,
    "title": "RC Differensiallovchi Zanjir",
    "category": "capacitors",
    "categoryName": "Kondensatorlar & RC Zanjirlar",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "Kondensator",
      "Capacitor",
      "RC",
      "Filtr",
      "Zaryad",
      "Razryad"
    ],
    "desc": "Kuchlanish sakrashlaridan qisqa ignasimon impulslar ajratib olish.",
    "theory": "Tez o'zgaruvchi signallarni ajratib olish va frontlarni detektlashda xizmat qiladi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 260,
        "y": 180,
        "isOpen": false
      },
      {
        "id": "r1",
        "type": "resistor_1k",
        "x": 380,
        "y": 180,
        "resistance": 1000
      },
      {
        "id": "cap1",
        "type": "capacitor",
        "x": 480,
        "y": 240,
        "capacitance": 0.0001
      },
      {
        "id": "led1",
        "type": "led",
        "x": 580,
        "y": 240,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "sw1_2",
        "toPinId": "r1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "r1_2",
        "toPinId": "cap1_p",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "cap1_p",
        "toPinId": "led1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "cap1_n",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      },
      {
        "id": "w6",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_112",
    "num": 112,
    "title": "RC Integrallovchi Zanjir",
    "category": "capacitors",
    "categoryName": "Kondensatorlar & RC Zanjirlar",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "Kondensator",
      "Capacitor",
      "RC",
      "Filtr",
      "Zaryad",
      "Razryad"
    ],
    "desc": "Impulslarni silliqlab uchburchaksimon shaklga keltirish.",
    "theory": "Integrallovchi zanjir signallarni o'rtacha qiymatini hisoblashda ishlatiladi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 260,
        "y": 180,
        "isOpen": false
      },
      {
        "id": "r1",
        "type": "resistor_1k",
        "x": 380,
        "y": 180,
        "resistance": 1000
      },
      {
        "id": "cap1",
        "type": "capacitor",
        "x": 480,
        "y": 240,
        "capacitance": 0.0001
      },
      {
        "id": "led1",
        "type": "led",
        "x": 580,
        "y": 240,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "sw1_2",
        "toPinId": "r1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "r1_2",
        "toPinId": "cap1_p",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "cap1_p",
        "toPinId": "led1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "cap1_n",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      },
      {
        "id": "w6",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_113",
    "num": 113,
    "title": "Fotochaqnoq (Flash) Zanjiri Modeli",
    "category": "capacitors",
    "categoryName": "Kondensatorlar & RC Zanjirlar",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "Kondensator",
      "Capacitor",
      "RC",
      "Filtr",
      "Zaryad",
      "Razryad"
    ],
    "desc": "Sekin zaryadlanish va bir lahzada kuchli razryad orqali chaqnash.",
    "theory": "Kam quvvatli manbadan katta oniy quvvat olishning ajoyib namunasi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 260,
        "y": 180,
        "isOpen": false
      },
      {
        "id": "r1",
        "type": "resistor_1k",
        "x": 380,
        "y": 180,
        "resistance": 1000
      },
      {
        "id": "cap1",
        "type": "capacitor",
        "x": 480,
        "y": 240,
        "capacitance": 0.0001
      },
      {
        "id": "led1",
        "type": "led",
        "x": 580,
        "y": 240,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "sw1_2",
        "toPinId": "r1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "r1_2",
        "toPinId": "cap1_p",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "cap1_p",
        "toPinId": "led1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "cap1_n",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      },
      {
        "id": "w6",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_114",
    "num": 114,
    "title": "Qisqa Uzilishlardan Himoya Buferi",
    "category": "capacitors",
    "categoryName": "Kondensatorlar & RC Zanjirlar",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "Kondensator",
      "Capacitor",
      "RC",
      "Filtr",
      "Zaryad",
      "Razryad"
    ],
    "desc": "Manba 0.5 soniyaga uzilsa ham yuklama o'chmay turishi.",
    "theory": "Kritik mikrosxemalar va xotira elementlarini tarmoq miltillashlaridan asraydi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 260,
        "y": 180,
        "isOpen": false
      },
      {
        "id": "r1",
        "type": "resistor_1k",
        "x": 380,
        "y": 180,
        "resistance": 1000
      },
      {
        "id": "cap1",
        "type": "capacitor",
        "x": 480,
        "y": 240,
        "capacitance": 0.0001
      },
      {
        "id": "led1",
        "type": "led",
        "x": 580,
        "y": 240,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "sw1_2",
        "toPinId": "r1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "r1_2",
        "toPinId": "cap1_p",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "cap1_p",
        "toPinId": "led1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "cap1_n",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      },
      {
        "id": "w6",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_115",
    "num": 115,
    "title": "Avtomatik Boshlang'ich Reset (Power-On Reset)",
    "category": "capacitors",
    "categoryName": "Kondensatorlar & RC Zanjirlar",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "Kondensator",
      "Capacitor",
      "RC",
      "Filtr",
      "Zaryad",
      "Razryad"
    ],
    "desc": "Tizimga quvvat berilganda avtomatik reset impulsi hosil qilish.",
    "theory": "Barcha kompyuter va kontrollerlar ishga tushishida POR zanjiri zarur.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 260,
        "y": 180,
        "isOpen": false
      },
      {
        "id": "r1",
        "type": "resistor_1k",
        "x": 380,
        "y": 180,
        "resistance": 1000
      },
      {
        "id": "cap1",
        "type": "capacitor",
        "x": 480,
        "y": 240,
        "capacitance": 0.0001
      },
      {
        "id": "led1",
        "type": "led",
        "x": 580,
        "y": 240,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "sw1_2",
        "toPinId": "r1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "r1_2",
        "toPinId": "cap1_p",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "cap1_p",
        "toPinId": "led1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "cap1_n",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      },
      {
        "id": "w6",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_116",
    "num": 116,
    "title": "Dvigatel Shovqinini Filtrlovchi Kondensator",
    "category": "capacitors",
    "categoryName": "Kondensatorlar & RC Zanjirlar",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "Kondensator",
      "Capacitor",
      "RC",
      "Filtr",
      "Zaryad",
      "Razryad"
    ],
    "desc": "DC motor kollektori cho'tkalaridagi uchqun shovqinini bostirish.",
    "theory": "Kondensator yuqori chastotali shovqinlarni to'g'ridan-to'g'ri GND ga tushiradi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 260,
        "y": 180,
        "isOpen": false
      },
      {
        "id": "r1",
        "type": "resistor_1k",
        "x": 380,
        "y": 180,
        "resistance": 1000
      },
      {
        "id": "cap1",
        "type": "capacitor",
        "x": 480,
        "y": 240,
        "capacitance": 0.0001
      },
      {
        "id": "led1",
        "type": "led",
        "x": 580,
        "y": 240,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "sw1_2",
        "toPinId": "r1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "r1_2",
        "toPinId": "cap1_p",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "cap1_p",
        "toPinId": "led1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "cap1_n",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      },
      {
        "id": "w6",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_117",
    "num": 117,
    "title": "Otsillografda RC Eksponentasini Kuzatish",
    "category": "capacitors",
    "categoryName": "Kondensatorlar & RC Zanjirlar",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "Kondensator",
      "Capacitor",
      "RC",
      "Filtr",
      "Zaryad",
      "Razryad"
    ],
    "desc": "Zaryadlanish egri chizig'ini vaqt o'qi bo'yicha tahlil qilish.",
    "theory": "U(t) = U0 * (1 - e^(-t/RC)) formulasining haqiqiy osillogrammasi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 260,
        "y": 180,
        "isOpen": false
      },
      {
        "id": "r1",
        "type": "resistor_1k",
        "x": 380,
        "y": 180,
        "resistance": 1000
      },
      {
        "id": "cap1",
        "type": "capacitor",
        "x": 480,
        "y": 240,
        "capacitance": 0.0001
      },
      {
        "id": "led1",
        "type": "led",
        "x": 580,
        "y": 240,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "sw1_2",
        "toPinId": "r1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "r1_2",
        "toPinId": "cap1_p",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "cap1_p",
        "toPinId": "led1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "cap1_n",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      },
      {
        "id": "w6",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_118",
    "num": 118,
    "title": "Sozlanuvchi Kechikishli RC Zanjir",
    "category": "capacitors",
    "categoryName": "Kondensatorlar & RC Zanjirlar",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "Kondensator",
      "Capacitor",
      "RC",
      "Filtr",
      "Zaryad",
      "Razryad"
    ],
    "desc": "Potensiometr orqali kechikish vaqtini 1 dan 10 soniyagacha sozlash.",
    "theory": "Rezistor qiymatini o'zgartirish orqali vaqt doimiysi τ silliq o'zgartiriladi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 260,
        "y": 180,
        "isOpen": false
      },
      {
        "id": "r1",
        "type": "resistor_1k",
        "x": 380,
        "y": 180,
        "resistance": 1000
      },
      {
        "id": "cap1",
        "type": "capacitor",
        "x": 480,
        "y": 240,
        "capacitance": 0.0001
      },
      {
        "id": "led1",
        "type": "led",
        "x": 580,
        "y": 240,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "sw1_2",
        "toPinId": "r1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "r1_2",
        "toPinId": "cap1_p",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "cap1_p",
        "toPinId": "led1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "cap1_n",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      },
      {
        "id": "w6",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_119",
    "num": 119,
    "title": "Ikki Bosqichli RC Kaskad",
    "category": "capacitors",
    "categoryName": "Kondensatorlar & RC Zanjirlar",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "Kondensator",
      "Capacitor",
      "RC",
      "Filtr",
      "Zaryad",
      "Razryad"
    ],
    "desc": "Ikki kaskadli filtr orqali yanada toza doimiy kuchlanish olish.",
    "theory": "Ko'p bosqichli filtrlash chastota tushish qiyaligini oshiradi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 260,
        "y": 180,
        "isOpen": false
      },
      {
        "id": "r1",
        "type": "resistor_1k",
        "x": 380,
        "y": 180,
        "resistance": 1000
      },
      {
        "id": "cap1",
        "type": "capacitor",
        "x": 480,
        "y": 240,
        "capacitance": 0.0001
      },
      {
        "id": "led1",
        "type": "led",
        "x": 580,
        "y": 240,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "sw1_2",
        "toPinId": "r1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "r1_2",
        "toPinId": "cap1_p",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "cap1_p",
        "toPinId": "led1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "cap1_n",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      },
      {
        "id": "w6",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_120",
    "num": 120,
    "title": "Kondensatorli 1-Bitli Analog Xotira",
    "category": "capacitors",
    "categoryName": "Kondensatorlar & RC Zanjirlar",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "Kondensator",
      "Capacitor",
      "RC",
      "Filtr",
      "Zaryad",
      "Razryad"
    ],
    "desc": "Kondensator qoplamalarida kuchlanish darajasini saqlash.",
    "theory": "Zamonaviy dinamik operativ xotira (DRAM) katakchalari aynan shunday ishlaydi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 260,
        "y": 180,
        "isOpen": false
      },
      {
        "id": "r1",
        "type": "resistor_1k",
        "x": 380,
        "y": 180,
        "resistance": 1000
      },
      {
        "id": "cap1",
        "type": "capacitor",
        "x": 480,
        "y": 240,
        "capacitance": 0.0001
      },
      {
        "id": "led1",
        "type": "led",
        "x": 580,
        "y": 240,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "sw1_2",
        "toPinId": "r1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "r1_2",
        "toPinId": "cap1_p",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "cap1_p",
        "toPinId": "led1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "cap1_n",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      },
      {
        "id": "w6",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_121",
    "num": 121,
    "title": "NPN Tranzistor Kalit Rejimida",
    "category": "transistors",
    "categoryName": "Tranzistorlar NPN & Bipolyar",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "Tranzistor",
      "NPN",
      "Kuchaytirgich",
      "Kalit",
      "Bipolyar",
      "2N2222"
    ],
    "desc": "Kichik baza toki (1mA) bilan katta yuklama tokini (100mA) boshqarish.",
    "theory": "Tranzistor to'yinish rejimida kollektor-emitter o'tishi deyarli 0 qarshilikka ega bo'ladi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 240,
        "y": 160,
        "isOpen": false
      },
      {
        "id": "r_base",
        "type": "resistor_1k",
        "x": 340,
        "y": 160,
        "resistance": 1000
      },
      {
        "id": "q1",
        "type": "transistor_npn",
        "x": 420,
        "y": 240
      },
      {
        "id": "r_col",
        "type": "resistor",
        "x": 420,
        "y": 120,
        "resistance": 330
      },
      {
        "id": "led1",
        "type": "led",
        "x": 520,
        "y": 180,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "sw1_2",
        "toPinId": "r_base_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "r_base_2",
        "toPinId": "q1_b",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "b1_p",
        "toPinId": "r_col_1",
        "color": "#EF4444"
      },
      {
        "id": "w5",
        "fromPinId": "r_col_2",
        "toPinId": "led1_a",
        "color": "#EF4444"
      },
      {
        "id": "w6",
        "fromPinId": "led1_k",
        "toPinId": "q1_c",
        "color": "#FBBF24"
      },
      {
        "id": "w7",
        "fromPinId": "q1_e",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_122",
    "num": 122,
    "title": "Sensorli Tugma (Touch Switch)",
    "category": "transistors",
    "categoryName": "Tranzistorlar NPN & Bipolyar",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "Tranzistor",
      "NPN",
      "Kuchaytirgich",
      "Kalit",
      "Bipolyar",
      "2N2222"
    ],
    "desc": "Inson tanasi orqali o'tuvchi mikroskopik tok bilan LED ni yoqish.",
    "theory": "Inson tanasi katta qarshilikka ega bo'lsa ham, tranzistor kuchaytirishi hisobiga LED yonadi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 240,
        "y": 160,
        "isOpen": false
      },
      {
        "id": "r_base",
        "type": "resistor_1k",
        "x": 340,
        "y": 160,
        "resistance": 1000
      },
      {
        "id": "q1",
        "type": "transistor_npn",
        "x": 420,
        "y": 240
      },
      {
        "id": "r_col",
        "type": "resistor",
        "x": 420,
        "y": 120,
        "resistance": 330
      },
      {
        "id": "led1",
        "type": "led",
        "x": 520,
        "y": 180,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "sw1_2",
        "toPinId": "r_base_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "r_base_2",
        "toPinId": "q1_b",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "b1_p",
        "toPinId": "r_col_1",
        "color": "#EF4444"
      },
      {
        "id": "w5",
        "fromPinId": "r_col_2",
        "toPinId": "led1_a",
        "color": "#EF4444"
      },
      {
        "id": "w6",
        "fromPinId": "led1_k",
        "toPinId": "q1_c",
        "color": "#FBBF24"
      },
      {
        "id": "w7",
        "fromPinId": "q1_e",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_123",
    "num": 123,
    "title": "Tranzistorli Invertor (NOT Funksiyasi)",
    "category": "transistors",
    "categoryName": "Tranzistorlar NPN & Bipolyar",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "Tranzistor",
      "NPN",
      "Kuchaytirgich",
      "Kalit",
      "Bipolyar",
      "2N2222"
    ],
    "desc": "Bazaga signal berilganda chiqishdagi LED o'chadigan zanjir.",
    "theory": "Baza toki bo'lganda tranzistor ochilib, chiqishni GND ga tortadi (chiqish 0 bo'ladi).",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 240,
        "y": 160,
        "isOpen": false
      },
      {
        "id": "r_base",
        "type": "resistor_1k",
        "x": 340,
        "y": 160,
        "resistance": 1000
      },
      {
        "id": "q1",
        "type": "transistor_npn",
        "x": 420,
        "y": 240
      },
      {
        "id": "r_col",
        "type": "resistor",
        "x": 420,
        "y": 120,
        "resistance": 330
      },
      {
        "id": "led1",
        "type": "led",
        "x": 520,
        "y": 180,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "sw1_2",
        "toPinId": "r_base_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "r_base_2",
        "toPinId": "q1_b",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "b1_p",
        "toPinId": "r_col_1",
        "color": "#EF4444"
      },
      {
        "id": "w5",
        "fromPinId": "r_col_2",
        "toPinId": "led1_a",
        "color": "#EF4444"
      },
      {
        "id": "w6",
        "fromPinId": "led1_k",
        "toPinId": "q1_c",
        "color": "#FBBF24"
      },
      {
        "id": "w7",
        "fromPinId": "q1_e",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_124",
    "num": 124,
    "title": "Darlington Juftligi (Super Kuchaytirgich)",
    "category": "transistors",
    "categoryName": "Tranzistorlar NPN & Bipolyar",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "Tranzistor",
      "NPN",
      "Kuchaytirgich",
      "Kalit",
      "Bipolyar",
      "2N2222"
    ],
    "desc": "Ikkita NPN tranzistorni ketma-ket ulab tok kuchaytirish koeffitsientini ko'paytirish.",
    "theory": "Darlington juftligida umumiy kuchaytirish β = β1 * β2 (100 * 100 = 10,000 baravar!).",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 240,
        "y": 160,
        "isOpen": false
      },
      {
        "id": "r_base",
        "type": "resistor_1k",
        "x": 340,
        "y": 160,
        "resistance": 1000
      },
      {
        "id": "q1",
        "type": "transistor_npn",
        "x": 420,
        "y": 240
      },
      {
        "id": "r_col",
        "type": "resistor",
        "x": 420,
        "y": 120,
        "resistance": 330
      },
      {
        "id": "led1",
        "type": "led",
        "x": 520,
        "y": 180,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "sw1_2",
        "toPinId": "r_base_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "r_base_2",
        "toPinId": "q1_b",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "b1_p",
        "toPinId": "r_col_1",
        "color": "#EF4444"
      },
      {
        "id": "w5",
        "fromPinId": "r_col_2",
        "toPinId": "led1_a",
        "color": "#EF4444"
      },
      {
        "id": "w6",
        "fromPinId": "led1_k",
        "toPinId": "q1_c",
        "color": "#FBBF24"
      },
      {
        "id": "w7",
        "fromPinId": "q1_e",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_125",
    "num": 125,
    "title": "Suv Sathi / Namlik Datchigi",
    "category": "transistors",
    "categoryName": "Tranzistorlar NPN & Bipolyar",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "Tranzistor",
      "NPN",
      "Kuchaytirgich",
      "Kalit",
      "Bipolyar",
      "2N2222"
    ],
    "desc": "Suv orqali tok o'tganda tranzistor ochilib LED yoki buzzerni yoqadi.",
    "theory": "Suvdagi erigan tuzlar ionlar hosil qilib tok o'tkazadi va tranzistor bazasini ochadi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 240,
        "y": 160,
        "isOpen": false
      },
      {
        "id": "r_base",
        "type": "resistor_1k",
        "x": 340,
        "y": 160,
        "resistance": 1000
      },
      {
        "id": "q1",
        "type": "transistor_npn",
        "x": 420,
        "y": 240
      },
      {
        "id": "r_col",
        "type": "resistor",
        "x": 420,
        "y": 120,
        "resistance": 330
      },
      {
        "id": "led1",
        "type": "led",
        "x": 520,
        "y": 180,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "sw1_2",
        "toPinId": "r_base_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "r_base_2",
        "toPinId": "q1_b",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "b1_p",
        "toPinId": "r_col_1",
        "color": "#EF4444"
      },
      {
        "id": "w5",
        "fromPinId": "r_col_2",
        "toPinId": "led1_a",
        "color": "#EF4444"
      },
      {
        "id": "w6",
        "fromPinId": "led1_k",
        "toPinId": "q1_c",
        "color": "#FBBF24"
      },
      {
        "id": "w7",
        "fromPinId": "q1_e",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_126",
    "num": 126,
    "title": "Tranzistorli Avtomatik Tungi Chiroq",
    "category": "transistors",
    "categoryName": "Tranzistorlar NPN & Bipolyar",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "Tranzistor",
      "NPN",
      "Kuchaytirgich",
      "Kalit",
      "Bipolyar",
      "2N2222"
    ],
    "desc": "LDR va tranzistor kombinatsiyasi orqali yorug'lik avtomatikasi.",
    "theory": "Qorong'ida LDR qarshiligi oshadi, baza kuchlanishi ko'tariladi va tranzistor ochiladi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 240,
        "y": 160,
        "isOpen": false
      },
      {
        "id": "r_base",
        "type": "resistor_1k",
        "x": 340,
        "y": 160,
        "resistance": 1000
      },
      {
        "id": "q1",
        "type": "transistor_npn",
        "x": 420,
        "y": 240
      },
      {
        "id": "r_col",
        "type": "resistor",
        "x": 420,
        "y": 120,
        "resistance": 330
      },
      {
        "id": "led1",
        "type": "led",
        "x": 520,
        "y": 180,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "sw1_2",
        "toPinId": "r_base_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "r_base_2",
        "toPinId": "q1_b",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "b1_p",
        "toPinId": "r_col_1",
        "color": "#EF4444"
      },
      {
        "id": "w5",
        "fromPinId": "r_col_2",
        "toPinId": "led1_a",
        "color": "#EF4444"
      },
      {
        "id": "w6",
        "fromPinId": "led1_k",
        "toPinId": "q1_c",
        "color": "#FBBF24"
      },
      {
        "id": "w7",
        "fromPinId": "q1_e",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_127",
    "num": 127,
    "title": "Tranzistorli Tonggi Qo'ng'iroq",
    "category": "transistors",
    "categoryName": "Tranzistorlar NPN & Bipolyar",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "Tranzistor",
      "NPN",
      "Kuchaytirgich",
      "Kalit",
      "Bipolyar",
      "2N2222"
    ],
    "desc": "Yorug'lik tushganda tranzistor ochilib signal beruvchi zanjir.",
    "theory": "LDR va rezistor o'rni almashtirilsa, tizim qorong'ida emas, yorug'likda ishlaydi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 240,
        "y": 160,
        "isOpen": false
      },
      {
        "id": "r_base",
        "type": "resistor_1k",
        "x": 340,
        "y": 160,
        "resistance": 1000
      },
      {
        "id": "q1",
        "type": "transistor_npn",
        "x": 420,
        "y": 240
      },
      {
        "id": "r_col",
        "type": "resistor",
        "x": 420,
        "y": 120,
        "resistance": 330
      },
      {
        "id": "led1",
        "type": "led",
        "x": 520,
        "y": 180,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "sw1_2",
        "toPinId": "r_base_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "r_base_2",
        "toPinId": "q1_b",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "b1_p",
        "toPinId": "r_col_1",
        "color": "#EF4444"
      },
      {
        "id": "w5",
        "fromPinId": "r_col_2",
        "toPinId": "led1_a",
        "color": "#EF4444"
      },
      {
        "id": "w6",
        "fromPinId": "led1_k",
        "toPinId": "q1_c",
        "color": "#FBBF24"
      },
      {
        "id": "w7",
        "fromPinId": "q1_e",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_128",
    "num": 128,
    "title": "Tranzistorli Motor Drayveri",
    "category": "transistors",
    "categoryName": "Tranzistorlar NPN & Bipolyar",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "Tranzistor",
      "NPN",
      "Kuchaytirgich",
      "Kalit",
      "Bipolyar",
      "2N2222"
    ],
    "desc": "Kichik mantiqiy signal bilan quvvatli DC motorni aylantirish.",
    "theory": "Mikrokontroller yoki sensorlar to'g'ridan-to'g'ri motorga tok bera olmaydi, tranzistor drayver kerak.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 240,
        "y": 160,
        "isOpen": false
      },
      {
        "id": "r_base",
        "type": "resistor_1k",
        "x": 340,
        "y": 160,
        "resistance": 1000
      },
      {
        "id": "q1",
        "type": "transistor_npn",
        "x": 420,
        "y": 240
      },
      {
        "id": "r_col",
        "type": "resistor",
        "x": 420,
        "y": 120,
        "resistance": 330
      },
      {
        "id": "led1",
        "type": "led",
        "x": 520,
        "y": 180,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "sw1_2",
        "toPinId": "r_base_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "r_base_2",
        "toPinId": "q1_b",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "b1_p",
        "toPinId": "r_col_1",
        "color": "#EF4444"
      },
      {
        "id": "w5",
        "fromPinId": "r_col_2",
        "toPinId": "led1_a",
        "color": "#EF4444"
      },
      {
        "id": "w6",
        "fromPinId": "led1_k",
        "toPinId": "q1_c",
        "color": "#FBBF24"
      },
      {
        "id": "w7",
        "fromPinId": "q1_e",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_129",
    "num": 129,
    "title": "Tranzistorli Vaqt Rele (Kechikish)",
    "category": "transistors",
    "categoryName": "Tranzistorlar NPN & Bipolyar",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "Tranzistor",
      "NPN",
      "Kuchaytirgich",
      "Kalit",
      "Bipolyar",
      "2N2222"
    ],
    "desc": "Kondensator bazada zaryadlanguncha kechikib yoqiluvchi rele.",
    "theory": "RC vaqt zanjiri tranzistor bazasi bilan birgalikda aniq vaqt taymerini hosil qiladi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 240,
        "y": 160,
        "isOpen": false
      },
      {
        "id": "r_base",
        "type": "resistor_1k",
        "x": 340,
        "y": 160,
        "resistance": 1000
      },
      {
        "id": "q1",
        "type": "transistor_npn",
        "x": 420,
        "y": 240
      },
      {
        "id": "r_col",
        "type": "resistor",
        "x": 420,
        "y": 120,
        "resistance": 330
      },
      {
        "id": "led1",
        "type": "led",
        "x": 520,
        "y": 180,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "sw1_2",
        "toPinId": "r_base_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "r_base_2",
        "toPinId": "q1_b",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "b1_p",
        "toPinId": "r_col_1",
        "color": "#EF4444"
      },
      {
        "id": "w5",
        "fromPinId": "r_col_2",
        "toPinId": "led1_a",
        "color": "#EF4444"
      },
      {
        "id": "w6",
        "fromPinId": "led1_k",
        "toPinId": "q1_c",
        "color": "#FBBF24"
      },
      {
        "id": "w7",
        "fromPinId": "q1_e",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_130",
    "num": 130,
    "title": "Tranzistorli Multivibrator Asosi",
    "category": "transistors",
    "categoryName": "Tranzistorlar NPN & Bipolyar",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "Tranzistor",
      "NPN",
      "Kuchaytirgich",
      "Kalit",
      "Bipolyar",
      "2N2222"
    ],
    "desc": "Ikkita tranzistor yordamida navbatma-navbat miltillovchi sxema.",
    "theory": "Simmetrik multivibrator tashqi generatsiyasiz o'z-o'zidan tebranadi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 240,
        "y": 160,
        "isOpen": false
      },
      {
        "id": "r_base",
        "type": "resistor_1k",
        "x": 340,
        "y": 160,
        "resistance": 1000
      },
      {
        "id": "q1",
        "type": "transistor_npn",
        "x": 420,
        "y": 240
      },
      {
        "id": "r_col",
        "type": "resistor",
        "x": 420,
        "y": 120,
        "resistance": 330
      },
      {
        "id": "led1",
        "type": "led",
        "x": 520,
        "y": 180,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "sw1_2",
        "toPinId": "r_base_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "r_base_2",
        "toPinId": "q1_b",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "b1_p",
        "toPinId": "r_col_1",
        "color": "#EF4444"
      },
      {
        "id": "w5",
        "fromPinId": "r_col_2",
        "toPinId": "led1_a",
        "color": "#EF4444"
      },
      {
        "id": "w6",
        "fromPinId": "led1_k",
        "toPinId": "q1_c",
        "color": "#FBBF24"
      },
      {
        "id": "w7",
        "fromPinId": "q1_e",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_131",
    "num": 131,
    "title": "Harorat Datchigi Tranzistorli Modeli",
    "category": "transistors",
    "categoryName": "Tranzistorlar NPN & Bipolyar",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "Tranzistor",
      "NPN",
      "Kuchaytirgich",
      "Kalit",
      "Bipolyar",
      "2N2222"
    ],
    "desc": "Harorat ko'tarilganda qarshilik o'zgarishiga sezgir zanjir.",
    "theory": "Tranzistorning baza-emitter kuchlanishi haroratga juda sezgir (-2mV/°C).",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 240,
        "y": 160,
        "isOpen": false
      },
      {
        "id": "r_base",
        "type": "resistor_1k",
        "x": 340,
        "y": 160,
        "resistance": 1000
      },
      {
        "id": "q1",
        "type": "transistor_npn",
        "x": 420,
        "y": 240
      },
      {
        "id": "r_col",
        "type": "resistor",
        "x": 420,
        "y": 120,
        "resistance": 330
      },
      {
        "id": "led1",
        "type": "led",
        "x": 520,
        "y": 180,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "sw1_2",
        "toPinId": "r_base_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "r_base_2",
        "toPinId": "q1_b",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "b1_p",
        "toPinId": "r_col_1",
        "color": "#EF4444"
      },
      {
        "id": "w5",
        "fromPinId": "r_col_2",
        "toPinId": "led1_a",
        "color": "#EF4444"
      },
      {
        "id": "w6",
        "fromPinId": "led1_k",
        "toPinId": "q1_c",
        "color": "#FBBF24"
      },
      {
        "id": "w7",
        "fromPinId": "q1_e",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_132",
    "num": 132,
    "title": "Tovush Signali Boshlang'ich Kuchaytirgichi",
    "category": "transistors",
    "categoryName": "Tranzistorlar NPN & Bipolyar",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "Tranzistor",
      "NPN",
      "Kuchaytirgich",
      "Kalit",
      "Bipolyar",
      "2N2222"
    ],
    "desc": "Kichik o'zgaruvchan signal amplitudasini oshirish.",
    "theory": "Umumiy emitterli sxema kuchlanish va tokni bir vaqtda kuchaytiradi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 240,
        "y": 160,
        "isOpen": false
      },
      {
        "id": "r_base",
        "type": "resistor_1k",
        "x": 340,
        "y": 160,
        "resistance": 1000
      },
      {
        "id": "q1",
        "type": "transistor_npn",
        "x": 420,
        "y": 240
      },
      {
        "id": "r_col",
        "type": "resistor",
        "x": 420,
        "y": 120,
        "resistance": 330
      },
      {
        "id": "led1",
        "type": "led",
        "x": 520,
        "y": 180,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "sw1_2",
        "toPinId": "r_base_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "r_base_2",
        "toPinId": "q1_b",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "b1_p",
        "toPinId": "r_col_1",
        "color": "#EF4444"
      },
      {
        "id": "w5",
        "fromPinId": "r_col_2",
        "toPinId": "led1_a",
        "color": "#EF4444"
      },
      {
        "id": "w6",
        "fromPinId": "led1_k",
        "toPinId": "q1_c",
        "color": "#FBBF24"
      },
      {
        "id": "w7",
        "fromPinId": "q1_e",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_133",
    "num": 133,
    "title": "Tranzistorli Tok Cheklovchi (Barqaror Tok)",
    "category": "transistors",
    "categoryName": "Tranzistorlar NPN & Bipolyar",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "Tranzistor",
      "NPN",
      "Kuchaytirgich",
      "Kalit",
      "Bipolyar",
      "2N2222"
    ],
    "desc": "Yuklama qarshiligi o'zgarsa ham tokni bir me'yorda ushlab turuvchi zanjir.",
    "theory": "LED lar uzoq xizmat qilishi uchun doimiy kuchlanish emas, doimiy tok talab etiladi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 240,
        "y": 160,
        "isOpen": false
      },
      {
        "id": "r_base",
        "type": "resistor_1k",
        "x": 340,
        "y": 160,
        "resistance": 1000
      },
      {
        "id": "q1",
        "type": "transistor_npn",
        "x": 420,
        "y": 240
      },
      {
        "id": "r_col",
        "type": "resistor",
        "x": 420,
        "y": 120,
        "resistance": 330
      },
      {
        "id": "led1",
        "type": "led",
        "x": 520,
        "y": 180,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "sw1_2",
        "toPinId": "r_base_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "r_base_2",
        "toPinId": "q1_b",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "b1_p",
        "toPinId": "r_col_1",
        "color": "#EF4444"
      },
      {
        "id": "w5",
        "fromPinId": "r_col_2",
        "toPinId": "led1_a",
        "color": "#EF4444"
      },
      {
        "id": "w6",
        "fromPinId": "led1_k",
        "toPinId": "q1_c",
        "color": "#FBBF24"
      },
      {
        "id": "w7",
        "fromPinId": "q1_e",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_134",
    "num": 134,
    "title": "Statik Elektr Detektori",
    "category": "transistors",
    "categoryName": "Tranzistorlar NPN & Bipolyar",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "Tranzistor",
      "NPN",
      "Kuchaytirgich",
      "Kalit",
      "Bipolyar",
      "2N2222"
    ],
    "desc": "Plastik taroq yoki kiyimdagi statik zaryadga ta'sirchan datchik.",
    "theory": "Darlington juftligining o'ta yuqori sezgirligi havodagi elektrostatik maydonni payqaydi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 240,
        "y": 160,
        "isOpen": false
      },
      {
        "id": "r_base",
        "type": "resistor_1k",
        "x": 340,
        "y": 160,
        "resistance": 1000
      },
      {
        "id": "q1",
        "type": "transistor_npn",
        "x": 420,
        "y": 240
      },
      {
        "id": "r_col",
        "type": "resistor",
        "x": 420,
        "y": 120,
        "resistance": 330
      },
      {
        "id": "led1",
        "type": "led",
        "x": 520,
        "y": 180,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "sw1_2",
        "toPinId": "r_base_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "r_base_2",
        "toPinId": "q1_b",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "b1_p",
        "toPinId": "r_col_1",
        "color": "#EF4444"
      },
      {
        "id": "w5",
        "fromPinId": "r_col_2",
        "toPinId": "led1_a",
        "color": "#EF4444"
      },
      {
        "id": "w6",
        "fromPinId": "led1_k",
        "toPinId": "q1_c",
        "color": "#FBBF24"
      },
      {
        "id": "w7",
        "fromPinId": "q1_e",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_135",
    "num": 135,
    "title": "Tranzistorli Akustik Generator",
    "category": "transistors",
    "categoryName": "Tranzistorlar NPN & Bipolyar",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "Tranzistor",
      "NPN",
      "Kuchaytirgich",
      "Kalit",
      "Bipolyar",
      "2N2222"
    ],
    "desc": "Pyezo buzzer uchun tebranish hosil qiluvchi avtogenerator.",
    "theory": "Ijobiy teskari aloqa orqali doimiy tok o'zgaruvchan tovush tebranishiga aylanadi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 240,
        "y": 160,
        "isOpen": false
      },
      {
        "id": "r_base",
        "type": "resistor_1k",
        "x": 340,
        "y": 160,
        "resistance": 1000
      },
      {
        "id": "q1",
        "type": "transistor_npn",
        "x": 420,
        "y": 240
      },
      {
        "id": "r_col",
        "type": "resistor",
        "x": 420,
        "y": 120,
        "resistance": 330
      },
      {
        "id": "led1",
        "type": "led",
        "x": 520,
        "y": 180,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "sw1_2",
        "toPinId": "r_base_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "r_base_2",
        "toPinId": "q1_b",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "b1_p",
        "toPinId": "r_col_1",
        "color": "#EF4444"
      },
      {
        "id": "w5",
        "fromPinId": "r_col_2",
        "toPinId": "led1_a",
        "color": "#EF4444"
      },
      {
        "id": "w6",
        "fromPinId": "led1_k",
        "toPinId": "q1_c",
        "color": "#FBBF24"
      },
      {
        "id": "w7",
        "fromPinId": "q1_e",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_136",
    "num": 136,
    "title": "Tranzistorli Signalizatsiya Bloki (Latch)",
    "category": "transistors",
    "categoryName": "Tranzistorlar NPN & Bipolyar",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "Tranzistor",
      "NPN",
      "Kuchaytirgich",
      "Kalit",
      "Bipolyar",
      "2N2222"
    ],
    "desc": "Bir marta signal berilgach o'z-o'zini ushlab qoluvchi elektron rele.",
    "theory": "Qo'riqlash tizimlarida datchik bir zumda uzilib qayta ulansa ham trevoga o'chmay qolishi shart.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 240,
        "y": 160,
        "isOpen": false
      },
      {
        "id": "r_base",
        "type": "resistor_1k",
        "x": 340,
        "y": 160,
        "resistance": 1000
      },
      {
        "id": "q1",
        "type": "transistor_npn",
        "x": 420,
        "y": 240
      },
      {
        "id": "r_col",
        "type": "resistor",
        "x": 420,
        "y": 120,
        "resistance": 330
      },
      {
        "id": "led1",
        "type": "led",
        "x": 520,
        "y": 180,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "sw1_2",
        "toPinId": "r_base_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "r_base_2",
        "toPinId": "q1_b",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "b1_p",
        "toPinId": "r_col_1",
        "color": "#EF4444"
      },
      {
        "id": "w5",
        "fromPinId": "r_col_2",
        "toPinId": "led1_a",
        "color": "#EF4444"
      },
      {
        "id": "w6",
        "fromPinId": "led1_k",
        "toPinId": "q1_c",
        "color": "#FBBF24"
      },
      {
        "id": "w7",
        "fromPinId": "q1_e",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_137",
    "num": 137,
    "title": "Qisqa Tutashuvdan Tranzistorli Himoya",
    "category": "transistors",
    "categoryName": "Tranzistorlar NPN & Bipolyar",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "Tranzistor",
      "NPN",
      "Kuchaytirgich",
      "Kalit",
      "Bipolyar",
      "2N2222"
    ],
    "desc": "Tok me'yordan oshganda yuklamani 1 millisekundda uzuvchi himoya.",
    "theory": "Eriydigan saqlagichlarga qaraganda elektron himoya million marta tezroq ishlaydi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 240,
        "y": 160,
        "isOpen": false
      },
      {
        "id": "r_base",
        "type": "resistor_1k",
        "x": 340,
        "y": 160,
        "resistance": 1000
      },
      {
        "id": "q1",
        "type": "transistor_npn",
        "x": 420,
        "y": 240
      },
      {
        "id": "r_col",
        "type": "resistor",
        "x": 420,
        "y": 120,
        "resistance": 330
      },
      {
        "id": "led1",
        "type": "led",
        "x": 520,
        "y": 180,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "sw1_2",
        "toPinId": "r_base_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "r_base_2",
        "toPinId": "q1_b",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "b1_p",
        "toPinId": "r_col_1",
        "color": "#EF4444"
      },
      {
        "id": "w5",
        "fromPinId": "r_col_2",
        "toPinId": "led1_a",
        "color": "#EF4444"
      },
      {
        "id": "w6",
        "fromPinId": "led1_k",
        "toPinId": "q1_c",
        "color": "#FBBF24"
      },
      {
        "id": "w7",
        "fromPinId": "q1_e",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_138",
    "num": 138,
    "title": "Dvigatelni Silliq To'xtatish (Soft Stop)",
    "category": "transistors",
    "categoryName": "Tranzistorlar NPN & Bipolyar",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "Tranzistor",
      "NPN",
      "Kuchaytirgich",
      "Kalit",
      "Bipolyar",
      "2N2222"
    ],
    "desc": "Baza kondensatori orqali motorni birdan emas, sekin to'xtatish.",
    "theory": "Mexanizmlarning tishli g'ildiraklari yemirilmasligi uchun silliq to'xtatish kerak.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 240,
        "y": 160,
        "isOpen": false
      },
      {
        "id": "r_base",
        "type": "resistor_1k",
        "x": 340,
        "y": 160,
        "resistance": 1000
      },
      {
        "id": "q1",
        "type": "transistor_npn",
        "x": 420,
        "y": 240
      },
      {
        "id": "r_col",
        "type": "resistor",
        "x": 420,
        "y": 120,
        "resistance": 330
      },
      {
        "id": "led1",
        "type": "led",
        "x": 520,
        "y": 180,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "sw1_2",
        "toPinId": "r_base_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "r_base_2",
        "toPinId": "q1_b",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "b1_p",
        "toPinId": "r_col_1",
        "color": "#EF4444"
      },
      {
        "id": "w5",
        "fromPinId": "r_col_2",
        "toPinId": "led1_a",
        "color": "#EF4444"
      },
      {
        "id": "w6",
        "fromPinId": "led1_k",
        "toPinId": "q1_c",
        "color": "#FBBF24"
      },
      {
        "id": "w7",
        "fromPinId": "q1_e",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_139",
    "num": 139,
    "title": "Dvigatelni Silliq Yurgizish (Soft Start)",
    "category": "transistors",
    "categoryName": "Tranzistorlar NPN & Bipolyar",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "Tranzistor",
      "NPN",
      "Kuchaytirgich",
      "Kalit",
      "Bipolyar",
      "2N2222"
    ],
    "desc": "Baza kuchlanishining asta o'sishi orqali start tokini kamaytirish.",
    "theory": "Katta dvigatellarni ishga tushirishda tarmoqqa ortiqcha zarba bermaslik usuli.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 240,
        "y": 160,
        "isOpen": false
      },
      {
        "id": "r_base",
        "type": "resistor_1k",
        "x": 340,
        "y": 160,
        "resistance": 1000
      },
      {
        "id": "q1",
        "type": "transistor_npn",
        "x": 420,
        "y": 240
      },
      {
        "id": "r_col",
        "type": "resistor",
        "x": 420,
        "y": 120,
        "resistance": 330
      },
      {
        "id": "led1",
        "type": "led",
        "x": 520,
        "y": 180,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "sw1_2",
        "toPinId": "r_base_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "r_base_2",
        "toPinId": "q1_b",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "b1_p",
        "toPinId": "r_col_1",
        "color": "#EF4444"
      },
      {
        "id": "w5",
        "fromPinId": "r_col_2",
        "toPinId": "led1_a",
        "color": "#EF4444"
      },
      {
        "id": "w6",
        "fromPinId": "led1_k",
        "toPinId": "q1_c",
        "color": "#FBBF24"
      },
      {
        "id": "w7",
        "fromPinId": "q1_e",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_140",
    "num": 140,
    "title": "RTL Mantiqiy Elementi (Resistor-Transistor Logic)",
    "category": "transistors",
    "categoryName": "Tranzistorlar NPN & Bipolyar",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "Tranzistor",
      "NPN",
      "Kuchaytirgich",
      "Kalit",
      "Bipolyar",
      "2N2222"
    ],
    "desc": "Tranzistorlar yordamida NOR mantiqiy elementini yasash.",
    "theory": "Birinchi avlod kompyuterlari (Apollo fazo kemasi) aynan RTL mantiqda qurilgan.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 240,
        "y": 160,
        "isOpen": false
      },
      {
        "id": "r_base",
        "type": "resistor_1k",
        "x": 340,
        "y": 160,
        "resistance": 1000
      },
      {
        "id": "q1",
        "type": "transistor_npn",
        "x": 420,
        "y": 240
      },
      {
        "id": "r_col",
        "type": "resistor",
        "x": 420,
        "y": 120,
        "resistance": 330
      },
      {
        "id": "led1",
        "type": "led",
        "x": 520,
        "y": 180,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "sw1_2",
        "toPinId": "r_base_1",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "r_base_2",
        "toPinId": "q1_b",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "b1_p",
        "toPinId": "r_col_1",
        "color": "#EF4444"
      },
      {
        "id": "w5",
        "fromPinId": "r_col_2",
        "toPinId": "led1_a",
        "color": "#EF4444"
      },
      {
        "id": "w6",
        "fromPinId": "led1_k",
        "toPinId": "q1_c",
        "color": "#FBBF24"
      },
      {
        "id": "w7",
        "fromPinId": "q1_e",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_141",
    "num": 141,
    "title": "Mantiqiy AND (VA) Elementi",
    "category": "logic",
    "categoryName": "Raqamli Mantiq Logic Gates",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "Mantiq",
      "Logic Gates",
      "AND",
      "OR",
      "XOR",
      "NOT",
      "Raqamli"
    ],
    "desc": "Faqat ikkala kirish ham '1' bo'lgandagina chiqish '1' (5V) bo'ladi.",
    "theory": "Mantiqiy ko'paytirish amali (Y = A ∧ B). Ikkala shart bajarilishi talab qilinadi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 5.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 260,
        "y": 180,
        "isOpen": false
      },
      {
        "id": "sw2",
        "type": "switch",
        "x": 260,
        "y": 300,
        "isOpen": false
      },
      {
        "id": "g1",
        "type": "gate_and",
        "x": 400,
        "y": 240
      },
      {
        "id": "led1",
        "type": "led",
        "x": 520,
        "y": 240,
        "ledColor": "#00FF87"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "b1_p",
        "toPinId": "sw2_1",
        "color": "#EF4444"
      },
      {
        "id": "w3",
        "fromPinId": "sw1_2",
        "toPinId": "g1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "sw2_2",
        "toPinId": "g1_b",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "g1_out",
        "toPinId": "led1_a",
        "color": "#00FF87"
      },
      {
        "id": "w6",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_142",
    "num": 142,
    "title": "Mantiqiy OR (YOKI) Elementi",
    "category": "logic",
    "categoryName": "Raqamli Mantiq Logic Gates",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "Mantiq",
      "Logic Gates",
      "AND",
      "OR",
      "XOR",
      "NOT",
      "Raqamli"
    ],
    "desc": "Hech bo'lmaganda bitta kirish '1' bo'lsa chiqish '1' bo'ladi.",
    "theory": "Mantiqiy qo'shish amali (Y = A ∨ B). Alternativ shartlar uchun ishlatiladi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 5.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 260,
        "y": 180,
        "isOpen": false
      },
      {
        "id": "sw2",
        "type": "switch",
        "x": 260,
        "y": 300,
        "isOpen": false
      },
      {
        "id": "g1",
        "type": "gate_or",
        "x": 400,
        "y": 240
      },
      {
        "id": "led1",
        "type": "led",
        "x": 520,
        "y": 240,
        "ledColor": "#00FF87"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "b1_p",
        "toPinId": "sw2_1",
        "color": "#EF4444"
      },
      {
        "id": "w3",
        "fromPinId": "sw1_2",
        "toPinId": "g1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "sw2_2",
        "toPinId": "g1_b",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "g1_out",
        "toPinId": "led1_a",
        "color": "#00FF87"
      },
      {
        "id": "w6",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_143",
    "num": 143,
    "title": "Mantiqiy NOT (EMAS) Invertor",
    "category": "logic",
    "categoryName": "Raqamli Mantiq Logic Gates",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "Mantiq",
      "Logic Gates",
      "AND",
      "OR",
      "XOR",
      "NOT",
      "Raqamli"
    ],
    "desc": "Kirish '1' bo'lsa chiqish '0', kirish '0' bo'lsa chiqish '1'.",
    "theory": "Mantiqiy inkor amali (Y = ¬A). Signal qutbini teskarisiga o'zgartiradi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 5.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 260,
        "y": 180,
        "isOpen": false
      },
      {
        "id": "sw2",
        "type": "switch",
        "x": 260,
        "y": 300,
        "isOpen": false
      },
      {
        "id": "g1",
        "type": "gate_not",
        "x": 400,
        "y": 240
      },
      {
        "id": "led1",
        "type": "led",
        "x": 520,
        "y": 240,
        "ledColor": "#00FF87"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "sw1_2",
        "toPinId": "g1_in",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "g1_out",
        "toPinId": "led1_a",
        "color": "#00FF87"
      },
      {
        "id": "w4",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_144",
    "num": 144,
    "title": "Mantiqiy NAND (VA-EMAS) Elementi",
    "category": "logic",
    "categoryName": "Raqamli Mantiq Logic Gates",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "Mantiq",
      "Logic Gates",
      "AND",
      "OR",
      "XOR",
      "NOT",
      "Raqamli"
    ],
    "desc": "Universal mantiq elementi: faqat ikkala kirish '1' bo'lgandagina chiqish '0'.",
    "theory": "NAND elementidan istalgan boshqa mantiqiy elementni (AND, OR, NOT, XOR) yasash mumkin.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 5.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 260,
        "y": 180,
        "isOpen": false
      },
      {
        "id": "sw2",
        "type": "switch",
        "x": 260,
        "y": 300,
        "isOpen": false
      },
      {
        "id": "g1",
        "type": "gate_nand",
        "x": 400,
        "y": 240
      },
      {
        "id": "led1",
        "type": "led",
        "x": 520,
        "y": 240,
        "ledColor": "#00FF87"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "b1_p",
        "toPinId": "sw2_1",
        "color": "#EF4444"
      },
      {
        "id": "w3",
        "fromPinId": "sw1_2",
        "toPinId": "g1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "sw2_2",
        "toPinId": "g1_b",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "g1_out",
        "toPinId": "led1_a",
        "color": "#00FF87"
      },
      {
        "id": "w6",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_145",
    "num": 145,
    "title": "Mantiqiy NOR (YOKI-EMAS) Elementi",
    "category": "logic",
    "categoryName": "Raqamli Mantiq Logic Gates",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "Mantiq",
      "Logic Gates",
      "AND",
      "OR",
      "XOR",
      "NOT",
      "Raqamli"
    ],
    "desc": "Ikkala kirish ham '0' bo'lgandagina chiqish '1' bo'ladi.",
    "theory": "Inkor qo'shish amali. Kosmik apparatlarning xotira va triggerlarida keng qo'llanilgan.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 5.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 260,
        "y": 180,
        "isOpen": false
      },
      {
        "id": "sw2",
        "type": "switch",
        "x": 260,
        "y": 300,
        "isOpen": false
      },
      {
        "id": "g1",
        "type": "gate_nor",
        "x": 400,
        "y": 240
      },
      {
        "id": "led1",
        "type": "led",
        "x": 520,
        "y": 240,
        "ledColor": "#00FF87"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "b1_p",
        "toPinId": "sw2_1",
        "color": "#EF4444"
      },
      {
        "id": "w3",
        "fromPinId": "sw1_2",
        "toPinId": "g1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "sw2_2",
        "toPinId": "g1_b",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "g1_out",
        "toPinId": "led1_a",
        "color": "#00FF87"
      },
      {
        "id": "w6",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_146",
    "num": 146,
    "title": "Mantiqiy XOR (Inkor YOKI) Elementi",
    "category": "logic",
    "categoryName": "Raqamli Mantiq Logic Gates",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "Mantiq",
      "Logic Gates",
      "AND",
      "OR",
      "XOR",
      "NOT",
      "Raqamli"
    ],
    "desc": "Kirishlar har xil bo'lgandagina chiqish '1' bo'ladi.",
    "theory": "Taqqoslash va paritet tekshiruvida, shuningdek ikkilik arifmetikasida ishlatiladi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 5.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 260,
        "y": 180,
        "isOpen": false
      },
      {
        "id": "sw2",
        "type": "switch",
        "x": 260,
        "y": 300,
        "isOpen": false
      },
      {
        "id": "g1",
        "type": "gate_xor",
        "x": 400,
        "y": 240
      },
      {
        "id": "led1",
        "type": "led",
        "x": 520,
        "y": 240,
        "ledColor": "#00FF87"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "b1_p",
        "toPinId": "sw2_1",
        "color": "#EF4444"
      },
      {
        "id": "w3",
        "fromPinId": "sw1_2",
        "toPinId": "g1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "sw2_2",
        "toPinId": "g1_b",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "g1_out",
        "toPinId": "led1_a",
        "color": "#00FF87"
      },
      {
        "id": "w6",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_147",
    "num": 147,
    "title": "NAND Elementidan NOT Invertor Yasash",
    "category": "logic",
    "categoryName": "Raqamli Mantiq Logic Gates",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "Mantiq",
      "Logic Gates",
      "AND",
      "OR",
      "XOR",
      "NOT",
      "Raqamli"
    ],
    "desc": "NAND ning ikkala kirishini birlashtirib invertor hosil qilish.",
    "theory": "Agar A = B bo'lsa, NAND chiqishi ¬(A ∧ A) = ¬A ga teng bo'ladi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 5.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 260,
        "y": 180,
        "isOpen": false
      },
      {
        "id": "sw2",
        "type": "switch",
        "x": 260,
        "y": 300,
        "isOpen": false
      },
      {
        "id": "g1",
        "type": "gate_not",
        "x": 400,
        "y": 240
      },
      {
        "id": "led1",
        "type": "led",
        "x": 520,
        "y": 240,
        "ledColor": "#00FF87"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "sw1_2",
        "toPinId": "g1_in",
        "color": "#FBBF24"
      },
      {
        "id": "w3",
        "fromPinId": "g1_out",
        "toPinId": "led1_a",
        "color": "#00FF87"
      },
      {
        "id": "w4",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_148",
    "num": 148,
    "title": "NAND Elementlaridan AND Elementi",
    "category": "logic",
    "categoryName": "Raqamli Mantiq Logic Gates",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "Mantiq",
      "Logic Gates",
      "AND",
      "OR",
      "XOR",
      "NOT",
      "Raqamli"
    ],
    "desc": "NAND chiqishiga NOT invertor ulab oddiy AND yasash.",
    "theory": "¬(¬(A ∧ B)) = A ∧ B. De Morgan qonunlari amalda.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 5.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 260,
        "y": 180,
        "isOpen": false
      },
      {
        "id": "sw2",
        "type": "switch",
        "x": 260,
        "y": 300,
        "isOpen": false
      },
      {
        "id": "g1",
        "type": "gate_and",
        "x": 400,
        "y": 240
      },
      {
        "id": "led1",
        "type": "led",
        "x": 520,
        "y": 240,
        "ledColor": "#00FF87"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "b1_p",
        "toPinId": "sw2_1",
        "color": "#EF4444"
      },
      {
        "id": "w3",
        "fromPinId": "sw1_2",
        "toPinId": "g1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "sw2_2",
        "toPinId": "g1_b",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "g1_out",
        "toPinId": "led1_a",
        "color": "#00FF87"
      },
      {
        "id": "w6",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_149",
    "num": 149,
    "title": "NAND Elementlaridan OR Elementi",
    "category": "logic",
    "categoryName": "Raqamli Mantiq Logic Gates",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "Mantiq",
      "Logic Gates",
      "AND",
      "OR",
      "XOR",
      "NOT",
      "Raqamli"
    ],
    "desc": "Kirishlari invertlangan NAND elementi OR vazifasini bajarishi.",
    "theory": "¬(¬A ∧ ¬B) = A ∨ B. Mantiqiy ifodalarni bir xil elementlarga keltirish usuli.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 5.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 260,
        "y": 180,
        "isOpen": false
      },
      {
        "id": "sw2",
        "type": "switch",
        "x": 260,
        "y": 300,
        "isOpen": false
      },
      {
        "id": "g1",
        "type": "gate_or",
        "x": 400,
        "y": 240
      },
      {
        "id": "led1",
        "type": "led",
        "x": 520,
        "y": 240,
        "ledColor": "#00FF87"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "b1_p",
        "toPinId": "sw2_1",
        "color": "#EF4444"
      },
      {
        "id": "w3",
        "fromPinId": "sw1_2",
        "toPinId": "g1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "sw2_2",
        "toPinId": "g1_b",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "g1_out",
        "toPinId": "led1_a",
        "color": "#00FF87"
      },
      {
        "id": "w6",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_150",
    "num": 150,
    "title": "1-Bitli Yarim Jamlagich (Half Adder)",
    "category": "logic",
    "categoryName": "Raqamli Mantiq Logic Gates",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "Mantiq",
      "Logic Gates",
      "AND",
      "OR",
      "XOR",
      "NOT",
      "Raqamli"
    ],
    "desc": "Ikkita 1-bitli sonni qo'shish: Yig'indi (XOR) va Ko'chirish (AND).",
    "theory": "Barcha zamonaviy protsessorlarning arifmetik-mantiqiy qurilmasi (ALU) asosi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 5.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 260,
        "y": 180,
        "isOpen": false
      },
      {
        "id": "sw2",
        "type": "switch",
        "x": 260,
        "y": 300,
        "isOpen": false
      },
      {
        "id": "g1",
        "type": "gate_xor",
        "x": 400,
        "y": 240
      },
      {
        "id": "led1",
        "type": "led",
        "x": 520,
        "y": 240,
        "ledColor": "#00FF87"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "b1_p",
        "toPinId": "sw2_1",
        "color": "#EF4444"
      },
      {
        "id": "w3",
        "fromPinId": "sw1_2",
        "toPinId": "g1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "sw2_2",
        "toPinId": "g1_b",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "g1_out",
        "toPinId": "led1_a",
        "color": "#00FF87"
      },
      {
        "id": "w6",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_151",
    "num": 151,
    "title": "To'liq Jamlagich (Full Adder) Modeli",
    "category": "logic",
    "categoryName": "Raqamli Mantiq Logic Gates",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "Mantiq",
      "Logic Gates",
      "AND",
      "OR",
      "XOR",
      "NOT",
      "Raqamli"
    ],
    "desc": "Oldingi razryaddan ko'chirishni ham hisobga oluvchi 3 kirishli jamlagich.",
    "theory": "Ko'p xonali sonlarni ketma-ket qo'shish uchun to'liq jamlagichlar kaskadi kerak.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 5.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 260,
        "y": 180,
        "isOpen": false
      },
      {
        "id": "sw2",
        "type": "switch",
        "x": 260,
        "y": 300,
        "isOpen": false
      },
      {
        "id": "g1",
        "type": "gate_xor",
        "x": 400,
        "y": 240
      },
      {
        "id": "led1",
        "type": "led",
        "x": 520,
        "y": 240,
        "ledColor": "#00FF87"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "b1_p",
        "toPinId": "sw2_1",
        "color": "#EF4444"
      },
      {
        "id": "w3",
        "fromPinId": "sw1_2",
        "toPinId": "g1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "sw2_2",
        "toPinId": "g1_b",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "g1_out",
        "toPinId": "led1_a",
        "color": "#00FF87"
      },
      {
        "id": "w6",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_152",
    "num": 152,
    "title": "RS-Trigger (Oddiy Xotira Katakchasi)",
    "category": "logic",
    "categoryName": "Raqamli Mantiq Logic Gates",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "Mantiq",
      "Logic Gates",
      "AND",
      "OR",
      "XOR",
      "NOT",
      "Raqamli"
    ],
    "desc": "Set (o'rnatish) va Reset (tiklash) signallari bilan 1 bit saqlash.",
    "theory": "Trigger bir lahzalik impulsdan keyin ham o'z holatini doimiy eslab qoladi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 5.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 260,
        "y": 180,
        "isOpen": false
      },
      {
        "id": "sw2",
        "type": "switch",
        "x": 260,
        "y": 300,
        "isOpen": false
      },
      {
        "id": "g1",
        "type": "gate_xor",
        "x": 400,
        "y": 240
      },
      {
        "id": "led1",
        "type": "led",
        "x": 520,
        "y": 240,
        "ledColor": "#00FF87"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "b1_p",
        "toPinId": "sw2_1",
        "color": "#EF4444"
      },
      {
        "id": "w3",
        "fromPinId": "sw1_2",
        "toPinId": "g1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "sw2_2",
        "toPinId": "g1_b",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "g1_out",
        "toPinId": "led1_a",
        "color": "#00FF87"
      },
      {
        "id": "w6",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_153",
    "num": 153,
    "title": "D-Trigger Xotira Elementi",
    "category": "logic",
    "categoryName": "Raqamli Mantiq Logic Gates",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "Mantiq",
      "Logic Gates",
      "AND",
      "OR",
      "XOR",
      "NOT",
      "Raqamli"
    ],
    "desc": "Takt signali kelgandagina ma'lumotni eslab qoluvchi trigger.",
    "theory": "Zamonaviy registrlar va kesh xotiralar D-triggerlar asosida quriladi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 5.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 260,
        "y": 180,
        "isOpen": false
      },
      {
        "id": "sw2",
        "type": "switch",
        "x": 260,
        "y": 300,
        "isOpen": false
      },
      {
        "id": "g1",
        "type": "gate_xor",
        "x": 400,
        "y": 240
      },
      {
        "id": "led1",
        "type": "led",
        "x": 520,
        "y": 240,
        "ledColor": "#00FF87"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "b1_p",
        "toPinId": "sw2_1",
        "color": "#EF4444"
      },
      {
        "id": "w3",
        "fromPinId": "sw1_2",
        "toPinId": "g1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "sw2_2",
        "toPinId": "g1_b",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "g1_out",
        "toPinId": "led1_a",
        "color": "#00FF87"
      },
      {
        "id": "w6",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_154",
    "num": 154,
    "title": "2-Kirishli Multipleksor (MUX 2:1)",
    "category": "logic",
    "categoryName": "Raqamli Mantiq Logic Gates",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "Mantiq",
      "Logic Gates",
      "AND",
      "OR",
      "XOR",
      "NOT",
      "Raqamli"
    ],
    "desc": "Boshqaruv signali orqali 2 ta kirishdan birini chiqishga ulash.",
    "theory": "Raqamli ma'lumotlar oqimini kommutatsiya qilish va kanallarni taqsimlash qurilmasi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 5.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 260,
        "y": 180,
        "isOpen": false
      },
      {
        "id": "sw2",
        "type": "switch",
        "x": 260,
        "y": 300,
        "isOpen": false
      },
      {
        "id": "g1",
        "type": "gate_xor",
        "x": 400,
        "y": 240
      },
      {
        "id": "led1",
        "type": "led",
        "x": 520,
        "y": 240,
        "ledColor": "#00FF87"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "b1_p",
        "toPinId": "sw2_1",
        "color": "#EF4444"
      },
      {
        "id": "w3",
        "fromPinId": "sw1_2",
        "toPinId": "g1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "sw2_2",
        "toPinId": "g1_b",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "g1_out",
        "toPinId": "led1_a",
        "color": "#00FF87"
      },
      {
        "id": "w6",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_155",
    "num": 155,
    "title": "Demultipleksor Modeli (DEMUX 1:2)",
    "category": "logic",
    "categoryName": "Raqamli Mantiq Logic Gates",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "Mantiq",
      "Logic Gates",
      "AND",
      "OR",
      "XOR",
      "NOT",
      "Raqamli"
    ],
    "desc": "Bitta kirish signalini 2 ta yo'nalishdan biriga yo'naltirish.",
    "theory": "Multipleksorning teskarisi bo'lib, signallarni qabul qiluvchi bloklarga yo'llaydi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 5.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 260,
        "y": 180,
        "isOpen": false
      },
      {
        "id": "sw2",
        "type": "switch",
        "x": 260,
        "y": 300,
        "isOpen": false
      },
      {
        "id": "g1",
        "type": "gate_xor",
        "x": 400,
        "y": 240
      },
      {
        "id": "led1",
        "type": "led",
        "x": 520,
        "y": 240,
        "ledColor": "#00FF87"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "b1_p",
        "toPinId": "sw2_1",
        "color": "#EF4444"
      },
      {
        "id": "w3",
        "fromPinId": "sw1_2",
        "toPinId": "g1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "sw2_2",
        "toPinId": "g1_b",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "g1_out",
        "toPinId": "led1_a",
        "color": "#00FF87"
      },
      {
        "id": "w6",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_156",
    "num": 156,
    "title": "1-Bitli Mantiqiy Komparator (A == B)",
    "category": "logic",
    "categoryName": "Raqamli Mantiq Logic Gates",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "Mantiq",
      "Logic Gates",
      "AND",
      "OR",
      "XOR",
      "NOT",
      "Raqamli"
    ],
    "desc": "Ikki signalning tengligini tekshiruvchi raqamli zanjir.",
    "theory": "XNOR amali: ikkala kirish bir xil bo'lsa (0-0 yoki 1-1) chiqishda '1' beradi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 5.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 260,
        "y": 180,
        "isOpen": false
      },
      {
        "id": "sw2",
        "type": "switch",
        "x": 260,
        "y": 300,
        "isOpen": false
      },
      {
        "id": "g1",
        "type": "gate_xor",
        "x": 400,
        "y": 240
      },
      {
        "id": "led1",
        "type": "led",
        "x": 520,
        "y": 240,
        "ledColor": "#00FF87"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "b1_p",
        "toPinId": "sw2_1",
        "color": "#EF4444"
      },
      {
        "id": "w3",
        "fromPinId": "sw1_2",
        "toPinId": "g1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "sw2_2",
        "toPinId": "g1_b",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "g1_out",
        "toPinId": "led1_a",
        "color": "#00FF87"
      },
      {
        "id": "w6",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_157",
    "num": 157,
    "title": "Kod O'zgartiruvchi (Oddiy Enkoder)",
    "category": "logic",
    "categoryName": "Raqamli Mantiq Logic Gates",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "Mantiq",
      "Logic Gates",
      "AND",
      "OR",
      "XOR",
      "NOT",
      "Raqamli"
    ],
    "desc": "Tugmalar bosilishini 2-bitli ikkilik kodga aylantirish.",
    "theory": "Klaviaturalarda tugma bosilishini kompyuter tushunadigan ikkilik kodga o'tkazish asosi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 5.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 260,
        "y": 180,
        "isOpen": false
      },
      {
        "id": "sw2",
        "type": "switch",
        "x": 260,
        "y": 300,
        "isOpen": false
      },
      {
        "id": "g1",
        "type": "gate_xor",
        "x": 400,
        "y": 240
      },
      {
        "id": "led1",
        "type": "led",
        "x": 520,
        "y": 240,
        "ledColor": "#00FF87"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "b1_p",
        "toPinId": "sw2_1",
        "color": "#EF4444"
      },
      {
        "id": "w3",
        "fromPinId": "sw1_2",
        "toPinId": "g1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "sw2_2",
        "toPinId": "g1_b",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "g1_out",
        "toPinId": "led1_a",
        "color": "#00FF87"
      },
      {
        "id": "w6",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_158",
    "num": 158,
    "title": "7-Segment Displey: '1' Raqamini Chiqarish",
    "category": "logic",
    "categoryName": "Raqamli Mantiq Logic Gates",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "Mantiq",
      "Logic Gates",
      "AND",
      "OR",
      "XOR",
      "NOT",
      "Raqamli"
    ],
    "desc": "b va c segmentlariga yuqori kuchlanish berib '1' raqamini yoqish.",
    "theory": "Raqamli indikatorlarda har bir raqam alohida segmentlar kombinatsiyasidan iborat.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 5.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 260,
        "y": 180,
        "isOpen": false
      },
      {
        "id": "sw2",
        "type": "switch",
        "x": 260,
        "y": 300,
        "isOpen": false
      },
      {
        "id": "g1",
        "type": "gate_xor",
        "x": 400,
        "y": 240
      },
      {
        "id": "led1",
        "type": "led",
        "x": 520,
        "y": 240,
        "ledColor": "#00FF87"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "b1_p",
        "toPinId": "sw2_1",
        "color": "#EF4444"
      },
      {
        "id": "w3",
        "fromPinId": "sw1_2",
        "toPinId": "g1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "sw2_2",
        "toPinId": "g1_b",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "g1_out",
        "toPinId": "led1_a",
        "color": "#00FF87"
      },
      {
        "id": "w6",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_159",
    "num": 159,
    "title": "7-Segment Displey: '8' Raqamini Chiqarish",
    "category": "logic",
    "categoryName": "Raqamli Mantiq Logic Gates",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "Mantiq",
      "Logic Gates",
      "AND",
      "OR",
      "XOR",
      "NOT",
      "Raqamli"
    ],
    "desc": "Barcha 7 ta segmentni (a..g) bir vaqtda yoqish.",
    "theory": "'8' raqami displeyning barcha segmentlari to'g'ri ishlayotganini tekshirish testi hisoblanadi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 5.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 260,
        "y": 180,
        "isOpen": false
      },
      {
        "id": "sw2",
        "type": "switch",
        "x": 260,
        "y": 300,
        "isOpen": false
      },
      {
        "id": "g1",
        "type": "gate_xor",
        "x": 400,
        "y": 240
      },
      {
        "id": "led1",
        "type": "led",
        "x": 520,
        "y": 240,
        "ledColor": "#00FF87"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "b1_p",
        "toPinId": "sw2_1",
        "color": "#EF4444"
      },
      {
        "id": "w3",
        "fromPinId": "sw1_2",
        "toPinId": "g1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "sw2_2",
        "toPinId": "g1_b",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "g1_out",
        "toPinId": "led1_a",
        "color": "#00FF87"
      },
      {
        "id": "w6",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_160",
    "num": 160,
    "title": "Paritet (Juftlik) Tekshiruvi Modeli",
    "category": "logic",
    "categoryName": "Raqamli Mantiq Logic Gates",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "Mantiq",
      "Logic Gates",
      "AND",
      "OR",
      "XOR",
      "NOT",
      "Raqamli"
    ],
    "desc": "Ma'lumotlar uzatilishida xatolik yuz berganini XOR orqali aniqlash.",
    "theory": "Tarmoq protokollarida va xotirada ma'lumot butunligini nazorat qilish usuli.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 140,
        "y": 240,
        "voltage": 5.0
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 260,
        "y": 180,
        "isOpen": false
      },
      {
        "id": "sw2",
        "type": "switch",
        "x": 260,
        "y": 300,
        "isOpen": false
      },
      {
        "id": "g1",
        "type": "gate_xor",
        "x": 400,
        "y": 240
      },
      {
        "id": "led1",
        "type": "led",
        "x": 520,
        "y": 240,
        "ledColor": "#00FF87"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "sw1_1",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "b1_p",
        "toPinId": "sw2_1",
        "color": "#EF4444"
      },
      {
        "id": "w3",
        "fromPinId": "sw1_2",
        "toPinId": "g1_a",
        "color": "#FBBF24"
      },
      {
        "id": "w4",
        "fromPinId": "sw2_2",
        "toPinId": "g1_b",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "g1_out",
        "toPinId": "led1_a",
        "color": "#00FF87"
      },
      {
        "id": "w6",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_161",
    "num": 161,
    "title": "555 Standart LED Miltillatuvchi (1 Hz)",
    "category": "timer555",
    "categoryName": "NE555 Taymer & Generatorlar",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "NE555",
      "Taymer",
      "Generator",
      "PWM",
      "Multivibrator",
      "Impuls"
    ],
    "desc": "Sekundiga 1 marta o'chib-yonuvchi klassik astabil generator.",
    "theory": "Chastota f = 1.44 / ((R1 + 2*R2) * C) formulasi bilan aniqlanadi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 120,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "ic1",
        "type": "timer_555",
        "x": 340,
        "y": 240
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 220,
        "y": 140,
        "resistance": 1000
      },
      {
        "id": "r2",
        "type": "resistor",
        "x": 220,
        "y": 280,
        "resistance": 10000
      },
      {
        "id": "cap1",
        "type": "capacitor",
        "x": 220,
        "y": 380,
        "capacitance": 1e-05
      },
      {
        "id": "led1",
        "type": "led",
        "x": 480,
        "y": 240,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "ic1_8",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "b1_p",
        "toPinId": "ic1_4",
        "color": "#EF4444"
      },
      {
        "id": "w3",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w4",
        "fromPinId": "r1_2",
        "toPinId": "ic1_7",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "ic1_7",
        "toPinId": "r2_1",
        "color": "#FBBF24"
      },
      {
        "id": "w6",
        "fromPinId": "r2_2",
        "toPinId": "ic1_6",
        "color": "#FBBF24"
      },
      {
        "id": "w7",
        "fromPinId": "ic1_6",
        "toPinId": "ic1_2",
        "color": "#FBBF24"
      },
      {
        "id": "w8",
        "fromPinId": "ic1_2",
        "toPinId": "cap1_p",
        "color": "#FBBF24"
      },
      {
        "id": "w9",
        "fromPinId": "cap1_n",
        "toPinId": "ic1_1",
        "color": "#38BDF8"
      },
      {
        "id": "w10",
        "fromPinId": "ic1_1",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      },
      {
        "id": "w11",
        "fromPinId": "ic1_3",
        "toPinId": "led1_a",
        "color": "#00FF87"
      },
      {
        "id": "w12",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_162",
    "num": 162,
    "title": "555 Tezkor Miltillatuvchi (Stroboskop 10 Hz)",
    "category": "timer555",
    "categoryName": "NE555 Taymer & Generatorlar",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "NE555",
      "Taymer",
      "Generator",
      "PWM",
      "Multivibrator",
      "Impuls"
    ],
    "desc": "Tez chaqnovchi LED stroboskop zanjiri.",
    "theory": "Kichikroq kondensator va rezistorlar orqali chaqnash chastotasi oshiriladi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 120,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "ic1",
        "type": "timer_555",
        "x": 340,
        "y": 240
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 220,
        "y": 140,
        "resistance": 1000
      },
      {
        "id": "r2",
        "type": "resistor",
        "x": 220,
        "y": 280,
        "resistance": 10000
      },
      {
        "id": "cap1",
        "type": "capacitor",
        "x": 220,
        "y": 380,
        "capacitance": 1e-05
      },
      {
        "id": "led1",
        "type": "led",
        "x": 480,
        "y": 240,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "ic1_8",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "b1_p",
        "toPinId": "ic1_4",
        "color": "#EF4444"
      },
      {
        "id": "w3",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w4",
        "fromPinId": "r1_2",
        "toPinId": "ic1_7",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "ic1_7",
        "toPinId": "r2_1",
        "color": "#FBBF24"
      },
      {
        "id": "w6",
        "fromPinId": "r2_2",
        "toPinId": "ic1_6",
        "color": "#FBBF24"
      },
      {
        "id": "w7",
        "fromPinId": "ic1_6",
        "toPinId": "ic1_2",
        "color": "#FBBF24"
      },
      {
        "id": "w8",
        "fromPinId": "ic1_2",
        "toPinId": "cap1_p",
        "color": "#FBBF24"
      },
      {
        "id": "w9",
        "fromPinId": "cap1_n",
        "toPinId": "ic1_1",
        "color": "#38BDF8"
      },
      {
        "id": "w10",
        "fromPinId": "ic1_1",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      },
      {
        "id": "w11",
        "fromPinId": "ic1_3",
        "toPinId": "led1_a",
        "color": "#00FF87"
      },
      {
        "id": "w12",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_163",
    "num": 163,
    "title": "555 Monostabil Rejim (5 Soniyalik Taymer)",
    "category": "timer555",
    "categoryName": "NE555 Taymer & Generatorlar",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "NE555",
      "Taymer",
      "Generator",
      "PWM",
      "Multivibrator",
      "Impuls"
    ],
    "desc": "Tugma bir marta bosilganda LED 5 soniya yonib, so'ng o'chadi.",
    "theory": "Monostabil rejimda bitta kirish impulsi aniq vaqtli bitta chiqish impulsini yaratadi: T = 1.1 * R * C.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 120,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "ic1",
        "type": "timer_555",
        "x": 340,
        "y": 240
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 220,
        "y": 140,
        "resistance": 1000
      },
      {
        "id": "r2",
        "type": "resistor",
        "x": 220,
        "y": 280,
        "resistance": 10000
      },
      {
        "id": "cap1",
        "type": "capacitor",
        "x": 220,
        "y": 380,
        "capacitance": 1e-05
      },
      {
        "id": "led1",
        "type": "led",
        "x": 480,
        "y": 240,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "ic1_8",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "b1_p",
        "toPinId": "ic1_4",
        "color": "#EF4444"
      },
      {
        "id": "w3",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w4",
        "fromPinId": "r1_2",
        "toPinId": "ic1_7",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "ic1_7",
        "toPinId": "r2_1",
        "color": "#FBBF24"
      },
      {
        "id": "w6",
        "fromPinId": "r2_2",
        "toPinId": "ic1_6",
        "color": "#FBBF24"
      },
      {
        "id": "w7",
        "fromPinId": "ic1_6",
        "toPinId": "ic1_2",
        "color": "#FBBF24"
      },
      {
        "id": "w8",
        "fromPinId": "ic1_2",
        "toPinId": "cap1_p",
        "color": "#FBBF24"
      },
      {
        "id": "w9",
        "fromPinId": "cap1_n",
        "toPinId": "ic1_1",
        "color": "#38BDF8"
      },
      {
        "id": "w10",
        "fromPinId": "ic1_1",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      },
      {
        "id": "w11",
        "fromPinId": "ic1_3",
        "toPinId": "led1_a",
        "color": "#00FF87"
      },
      {
        "id": "w12",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_164",
    "num": 164,
    "title": "555 Pyezo Tovush Generatori (1 kHz)",
    "category": "timer555",
    "categoryName": "NE555 Taymer & Generatorlar",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "NE555",
      "Taymer",
      "Generator",
      "PWM",
      "Multivibrator",
      "Impuls"
    ],
    "desc": "Inson qulog'iga yaxshi eshitiluvchi jarangdor akustik signal.",
    "theory": "Tovush chastotasi pyezo elementning rezonans chastotasiga yaqinlashtiriladi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 120,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "ic1",
        "type": "timer_555",
        "x": 340,
        "y": 240
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 220,
        "y": 140,
        "resistance": 1000
      },
      {
        "id": "r2",
        "type": "resistor",
        "x": 220,
        "y": 280,
        "resistance": 10000
      },
      {
        "id": "cap1",
        "type": "capacitor",
        "x": 220,
        "y": 380,
        "capacitance": 1e-05
      },
      {
        "id": "led1",
        "type": "led",
        "x": 480,
        "y": 240,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "ic1_8",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "b1_p",
        "toPinId": "ic1_4",
        "color": "#EF4444"
      },
      {
        "id": "w3",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w4",
        "fromPinId": "r1_2",
        "toPinId": "ic1_7",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "ic1_7",
        "toPinId": "r2_1",
        "color": "#FBBF24"
      },
      {
        "id": "w6",
        "fromPinId": "r2_2",
        "toPinId": "ic1_6",
        "color": "#FBBF24"
      },
      {
        "id": "w7",
        "fromPinId": "ic1_6",
        "toPinId": "ic1_2",
        "color": "#FBBF24"
      },
      {
        "id": "w8",
        "fromPinId": "ic1_2",
        "toPinId": "cap1_p",
        "color": "#FBBF24"
      },
      {
        "id": "w9",
        "fromPinId": "cap1_n",
        "toPinId": "ic1_1",
        "color": "#38BDF8"
      },
      {
        "id": "w10",
        "fromPinId": "ic1_1",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      },
      {
        "id": "w11",
        "fromPinId": "ic1_3",
        "toPinId": "led1_a",
        "color": "#00FF87"
      },
      {
        "id": "w12",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_165",
    "num": 165,
    "title": "555 Ikki Ohangli Politsiya Sirenasi",
    "category": "timer555",
    "categoryName": "NE555 Taymer & Generatorlar",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "NE555",
      "Taymer",
      "Generator",
      "PWM",
      "Multivibrator",
      "Impuls"
    ],
    "desc": "Ikki xil chastota orasida almashinuvchi tovush generatori.",
    "theory": "Boshqaruv pini (CV) orqali ichki komparator kuchlanishi modulyatsiya qilinadi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 120,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "ic1",
        "type": "timer_555",
        "x": 340,
        "y": 240
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 220,
        "y": 140,
        "resistance": 1000
      },
      {
        "id": "r2",
        "type": "resistor",
        "x": 220,
        "y": 280,
        "resistance": 10000
      },
      {
        "id": "cap1",
        "type": "capacitor",
        "x": 220,
        "y": 380,
        "capacitance": 1e-05
      },
      {
        "id": "led1",
        "type": "led",
        "x": 480,
        "y": 240,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "ic1_8",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "b1_p",
        "toPinId": "ic1_4",
        "color": "#EF4444"
      },
      {
        "id": "w3",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w4",
        "fromPinId": "r1_2",
        "toPinId": "ic1_7",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "ic1_7",
        "toPinId": "r2_1",
        "color": "#FBBF24"
      },
      {
        "id": "w6",
        "fromPinId": "r2_2",
        "toPinId": "ic1_6",
        "color": "#FBBF24"
      },
      {
        "id": "w7",
        "fromPinId": "ic1_6",
        "toPinId": "ic1_2",
        "color": "#FBBF24"
      },
      {
        "id": "w8",
        "fromPinId": "ic1_2",
        "toPinId": "cap1_p",
        "color": "#FBBF24"
      },
      {
        "id": "w9",
        "fromPinId": "cap1_n",
        "toPinId": "ic1_1",
        "color": "#38BDF8"
      },
      {
        "id": "w10",
        "fromPinId": "ic1_1",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      },
      {
        "id": "w11",
        "fromPinId": "ic1_3",
        "toPinId": "led1_a",
        "color": "#00FF87"
      },
      {
        "id": "w12",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_166",
    "num": 166,
    "title": "555 Ikki Rangli LED Almashinuvi",
    "category": "timer555",
    "categoryName": "NE555 Taymer & Generatorlar",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "NE555",
      "Taymer",
      "Generator",
      "PWM",
      "Multivibrator",
      "Impuls"
    ],
    "desc": "Qizil va yashil LED lar navbat bilan galma-galdan yonishi.",
    "theory": "Chiqish 3-pini HIGH bo'lganda bitta LED, LOW bo'lganda ikkinchi LED yonadi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 120,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "ic1",
        "type": "timer_555",
        "x": 340,
        "y": 240
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 220,
        "y": 140,
        "resistance": 1000
      },
      {
        "id": "r2",
        "type": "resistor",
        "x": 220,
        "y": 280,
        "resistance": 10000
      },
      {
        "id": "cap1",
        "type": "capacitor",
        "x": 220,
        "y": 380,
        "capacitance": 1e-05
      },
      {
        "id": "led1",
        "type": "led",
        "x": 480,
        "y": 240,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "ic1_8",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "b1_p",
        "toPinId": "ic1_4",
        "color": "#EF4444"
      },
      {
        "id": "w3",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w4",
        "fromPinId": "r1_2",
        "toPinId": "ic1_7",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "ic1_7",
        "toPinId": "r2_1",
        "color": "#FBBF24"
      },
      {
        "id": "w6",
        "fromPinId": "r2_2",
        "toPinId": "ic1_6",
        "color": "#FBBF24"
      },
      {
        "id": "w7",
        "fromPinId": "ic1_6",
        "toPinId": "ic1_2",
        "color": "#FBBF24"
      },
      {
        "id": "w8",
        "fromPinId": "ic1_2",
        "toPinId": "cap1_p",
        "color": "#FBBF24"
      },
      {
        "id": "w9",
        "fromPinId": "cap1_n",
        "toPinId": "ic1_1",
        "color": "#38BDF8"
      },
      {
        "id": "w10",
        "fromPinId": "ic1_1",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      },
      {
        "id": "w11",
        "fromPinId": "ic1_3",
        "toPinId": "led1_a",
        "color": "#00FF87"
      },
      {
        "id": "w12",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_167",
    "num": 167,
    "title": "555 PWM (KHM) Dvigatel Tezligi Boshqaruvi",
    "category": "timer555",
    "categoryName": "NE555 Taymer & Generatorlar",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "NE555",
      "Taymer",
      "Generator",
      "PWM",
      "Multivibrator",
      "Impuls"
    ],
    "desc": "Impuls kengligini o'zgartirish orqali dvigatel quvvatini yo'qotishsiz sozlash.",
    "theory": "PWM orqali motorga to'liq kuchlanish impulslari beriladi, shuning uchun past tezlikda ham tortish kuchi saqlanadi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 120,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "ic1",
        "type": "timer_555",
        "x": 340,
        "y": 240
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 220,
        "y": 140,
        "resistance": 1000
      },
      {
        "id": "r2",
        "type": "resistor",
        "x": 220,
        "y": 280,
        "resistance": 10000
      },
      {
        "id": "cap1",
        "type": "capacitor",
        "x": 220,
        "y": 380,
        "capacitance": 1e-05
      },
      {
        "id": "led1",
        "type": "led",
        "x": 480,
        "y": 240,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "ic1_8",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "b1_p",
        "toPinId": "ic1_4",
        "color": "#EF4444"
      },
      {
        "id": "w3",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w4",
        "fromPinId": "r1_2",
        "toPinId": "ic1_7",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "ic1_7",
        "toPinId": "r2_1",
        "color": "#FBBF24"
      },
      {
        "id": "w6",
        "fromPinId": "r2_2",
        "toPinId": "ic1_6",
        "color": "#FBBF24"
      },
      {
        "id": "w7",
        "fromPinId": "ic1_6",
        "toPinId": "ic1_2",
        "color": "#FBBF24"
      },
      {
        "id": "w8",
        "fromPinId": "ic1_2",
        "toPinId": "cap1_p",
        "color": "#FBBF24"
      },
      {
        "id": "w9",
        "fromPinId": "cap1_n",
        "toPinId": "ic1_1",
        "color": "#38BDF8"
      },
      {
        "id": "w10",
        "fromPinId": "ic1_1",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      },
      {
        "id": "w11",
        "fromPinId": "ic1_3",
        "toPinId": "led1_a",
        "color": "#00FF87"
      },
      {
        "id": "w12",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_168",
    "num": 168,
    "title": "555 PWM LED Dimmer",
    "category": "timer555",
    "categoryName": "NE555 Taymer & Generatorlar",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "NE555",
      "Taymer",
      "Generator",
      "PWM",
      "Multivibrator",
      "Impuls"
    ],
    "desc": "Yorug'likni miltillashsiz silliq boshqarish (0..100%).",
    "theory": "Inson ko'zi 100 Hz dan yuqori chastotali PWM ni sezmaydi va silliq yorug'lik deb qabul qiladi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 120,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "ic1",
        "type": "timer_555",
        "x": 340,
        "y": 240
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 220,
        "y": 140,
        "resistance": 1000
      },
      {
        "id": "r2",
        "type": "resistor",
        "x": 220,
        "y": 280,
        "resistance": 10000
      },
      {
        "id": "cap1",
        "type": "capacitor",
        "x": 220,
        "y": 380,
        "capacitance": 1e-05
      },
      {
        "id": "led1",
        "type": "led",
        "x": 480,
        "y": 240,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "ic1_8",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "b1_p",
        "toPinId": "ic1_4",
        "color": "#EF4444"
      },
      {
        "id": "w3",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w4",
        "fromPinId": "r1_2",
        "toPinId": "ic1_7",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "ic1_7",
        "toPinId": "r2_1",
        "color": "#FBBF24"
      },
      {
        "id": "w6",
        "fromPinId": "r2_2",
        "toPinId": "ic1_6",
        "color": "#FBBF24"
      },
      {
        "id": "w7",
        "fromPinId": "ic1_6",
        "toPinId": "ic1_2",
        "color": "#FBBF24"
      },
      {
        "id": "w8",
        "fromPinId": "ic1_2",
        "toPinId": "cap1_p",
        "color": "#FBBF24"
      },
      {
        "id": "w9",
        "fromPinId": "cap1_n",
        "toPinId": "ic1_1",
        "color": "#38BDF8"
      },
      {
        "id": "w10",
        "fromPinId": "ic1_1",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      },
      {
        "id": "w11",
        "fromPinId": "ic1_3",
        "toPinId": "led1_a",
        "color": "#00FF87"
      },
      {
        "id": "w12",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_169",
    "num": 169,
    "title": "555 Musiqiy Metronom Sxemasi",
    "category": "timer555",
    "categoryName": "NE555 Taymer & Generatorlar",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "NE555",
      "Taymer",
      "Generator",
      "PWM",
      "Multivibrator",
      "Impuls"
    ],
    "desc": "Musiqachilar uchun bir maromda tovush zarbalari beruvchi metronom.",
    "theory": "Potensiometr yordamida daqiqadagi zarbalar soni (BPM) sozlanadi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 120,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "ic1",
        "type": "timer_555",
        "x": 340,
        "y": 240
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 220,
        "y": 140,
        "resistance": 1000
      },
      {
        "id": "r2",
        "type": "resistor",
        "x": 220,
        "y": 280,
        "resistance": 10000
      },
      {
        "id": "cap1",
        "type": "capacitor",
        "x": 220,
        "y": 380,
        "capacitance": 1e-05
      },
      {
        "id": "led1",
        "type": "led",
        "x": 480,
        "y": 240,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "ic1_8",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "b1_p",
        "toPinId": "ic1_4",
        "color": "#EF4444"
      },
      {
        "id": "w3",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w4",
        "fromPinId": "r1_2",
        "toPinId": "ic1_7",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "ic1_7",
        "toPinId": "r2_1",
        "color": "#FBBF24"
      },
      {
        "id": "w6",
        "fromPinId": "r2_2",
        "toPinId": "ic1_6",
        "color": "#FBBF24"
      },
      {
        "id": "w7",
        "fromPinId": "ic1_6",
        "toPinId": "ic1_2",
        "color": "#FBBF24"
      },
      {
        "id": "w8",
        "fromPinId": "ic1_2",
        "toPinId": "cap1_p",
        "color": "#FBBF24"
      },
      {
        "id": "w9",
        "fromPinId": "cap1_n",
        "toPinId": "ic1_1",
        "color": "#38BDF8"
      },
      {
        "id": "w10",
        "fromPinId": "ic1_1",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      },
      {
        "id": "w11",
        "fromPinId": "ic1_3",
        "toPinId": "led1_a",
        "color": "#00FF87"
      },
      {
        "id": "w12",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_170",
    "num": 170,
    "title": "555 Yo'qolgan Impuls Detektori (Watchdog)",
    "category": "timer555",
    "categoryName": "NE555 Taymer & Generatorlar",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "NE555",
      "Taymer",
      "Generator",
      "PWM",
      "Multivibrator",
      "Impuls"
    ],
    "desc": "Signal uzilib qolsa darhol ogohlantiruvchi xavfsizlik nazoratchisi.",
    "theory": "Sanoat tizimlarida mikrokontroller muzlab qolishini aniqlashda qo'llaniladi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 120,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "ic1",
        "type": "timer_555",
        "x": 340,
        "y": 240
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 220,
        "y": 140,
        "resistance": 1000
      },
      {
        "id": "r2",
        "type": "resistor",
        "x": 220,
        "y": 280,
        "resistance": 10000
      },
      {
        "id": "cap1",
        "type": "capacitor",
        "x": 220,
        "y": 380,
        "capacitance": 1e-05
      },
      {
        "id": "led1",
        "type": "led",
        "x": 480,
        "y": 240,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "ic1_8",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "b1_p",
        "toPinId": "ic1_4",
        "color": "#EF4444"
      },
      {
        "id": "w3",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w4",
        "fromPinId": "r1_2",
        "toPinId": "ic1_7",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "ic1_7",
        "toPinId": "r2_1",
        "color": "#FBBF24"
      },
      {
        "id": "w6",
        "fromPinId": "r2_2",
        "toPinId": "ic1_6",
        "color": "#FBBF24"
      },
      {
        "id": "w7",
        "fromPinId": "ic1_6",
        "toPinId": "ic1_2",
        "color": "#FBBF24"
      },
      {
        "id": "w8",
        "fromPinId": "ic1_2",
        "toPinId": "cap1_p",
        "color": "#FBBF24"
      },
      {
        "id": "w9",
        "fromPinId": "cap1_n",
        "toPinId": "ic1_1",
        "color": "#38BDF8"
      },
      {
        "id": "w10",
        "fromPinId": "ic1_1",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      },
      {
        "id": "w11",
        "fromPinId": "ic1_3",
        "toPinId": "led1_a",
        "color": "#00FF87"
      },
      {
        "id": "w12",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_171",
    "num": 171,
    "title": "555 Avtomatik Nasos Taymeri",
    "category": "timer555",
    "categoryName": "NE555 Taymer & Generatorlar",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "NE555",
      "Taymer",
      "Generator",
      "PWM",
      "Multivibrator",
      "Impuls"
    ],
    "desc": "Har 10 soniyada 2 soniyaga suv nasosini ishga tushiruvchi siklik rejim.",
    "theory": "O'simliklarni tomchilatib sug'orish va akvarium filtrlari uchun tayyor avtomat.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 120,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "ic1",
        "type": "timer_555",
        "x": 340,
        "y": 240
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 220,
        "y": 140,
        "resistance": 1000
      },
      {
        "id": "r2",
        "type": "resistor",
        "x": 220,
        "y": 280,
        "resistance": 10000
      },
      {
        "id": "cap1",
        "type": "capacitor",
        "x": 220,
        "y": 380,
        "capacitance": 1e-05
      },
      {
        "id": "led1",
        "type": "led",
        "x": 480,
        "y": 240,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "ic1_8",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "b1_p",
        "toPinId": "ic1_4",
        "color": "#EF4444"
      },
      {
        "id": "w3",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w4",
        "fromPinId": "r1_2",
        "toPinId": "ic1_7",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "ic1_7",
        "toPinId": "r2_1",
        "color": "#FBBF24"
      },
      {
        "id": "w6",
        "fromPinId": "r2_2",
        "toPinId": "ic1_6",
        "color": "#FBBF24"
      },
      {
        "id": "w7",
        "fromPinId": "ic1_6",
        "toPinId": "ic1_2",
        "color": "#FBBF24"
      },
      {
        "id": "w8",
        "fromPinId": "ic1_2",
        "toPinId": "cap1_p",
        "color": "#FBBF24"
      },
      {
        "id": "w9",
        "fromPinId": "cap1_n",
        "toPinId": "ic1_1",
        "color": "#38BDF8"
      },
      {
        "id": "w10",
        "fromPinId": "ic1_1",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      },
      {
        "id": "w11",
        "fromPinId": "ic1_3",
        "toPinId": "led1_a",
        "color": "#00FF87"
      },
      {
        "id": "w12",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_172",
    "num": 172,
    "title": "555 Sozlanuvchi Chastota Generatori",
    "category": "timer555",
    "categoryName": "NE555 Taymer & Generatorlar",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "NE555",
      "Taymer",
      "Generator",
      "PWM",
      "Multivibrator",
      "Impuls"
    ],
    "desc": "Potensiometr orqali 100 Hz dan 5 kHz gacha chastotani o'zgartirish.",
    "theory": "Laboratoriyalarda turli signallarni sinash uchun o'rganish stendi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 120,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "ic1",
        "type": "timer_555",
        "x": 340,
        "y": 240
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 220,
        "y": 140,
        "resistance": 1000
      },
      {
        "id": "r2",
        "type": "resistor",
        "x": 220,
        "y": 280,
        "resistance": 10000
      },
      {
        "id": "cap1",
        "type": "capacitor",
        "x": 220,
        "y": 380,
        "capacitance": 1e-05
      },
      {
        "id": "led1",
        "type": "led",
        "x": 480,
        "y": 240,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "ic1_8",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "b1_p",
        "toPinId": "ic1_4",
        "color": "#EF4444"
      },
      {
        "id": "w3",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w4",
        "fromPinId": "r1_2",
        "toPinId": "ic1_7",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "ic1_7",
        "toPinId": "r2_1",
        "color": "#FBBF24"
      },
      {
        "id": "w6",
        "fromPinId": "r2_2",
        "toPinId": "ic1_6",
        "color": "#FBBF24"
      },
      {
        "id": "w7",
        "fromPinId": "ic1_6",
        "toPinId": "ic1_2",
        "color": "#FBBF24"
      },
      {
        "id": "w8",
        "fromPinId": "ic1_2",
        "toPinId": "cap1_p",
        "color": "#FBBF24"
      },
      {
        "id": "w9",
        "fromPinId": "cap1_n",
        "toPinId": "ic1_1",
        "color": "#38BDF8"
      },
      {
        "id": "w10",
        "fromPinId": "ic1_1",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      },
      {
        "id": "w11",
        "fromPinId": "ic1_3",
        "toPinId": "led1_a",
        "color": "#00FF87"
      },
      {
        "id": "w12",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_173",
    "num": 173,
    "title": "555 Ovoz Balandligi Sozlanuvchi Sirena",
    "category": "timer555",
    "categoryName": "NE555 Taymer & Generatorlar",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "NE555",
      "Taymer",
      "Generator",
      "PWM",
      "Multivibrator",
      "Impuls"
    ],
    "desc": "Chiqishda pot va pyezo buzzer yordamida ohang va balandlikni boshqarish.",
    "theory": "Signalizatsiya tizimlarida zarur ovoz bosimini o'rnatish imkoniyati.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 120,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "ic1",
        "type": "timer_555",
        "x": 340,
        "y": 240
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 220,
        "y": 140,
        "resistance": 1000
      },
      {
        "id": "r2",
        "type": "resistor",
        "x": 220,
        "y": 280,
        "resistance": 10000
      },
      {
        "id": "cap1",
        "type": "capacitor",
        "x": 220,
        "y": 380,
        "capacitance": 1e-05
      },
      {
        "id": "led1",
        "type": "led",
        "x": 480,
        "y": 240,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "ic1_8",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "b1_p",
        "toPinId": "ic1_4",
        "color": "#EF4444"
      },
      {
        "id": "w3",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w4",
        "fromPinId": "r1_2",
        "toPinId": "ic1_7",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "ic1_7",
        "toPinId": "r2_1",
        "color": "#FBBF24"
      },
      {
        "id": "w6",
        "fromPinId": "r2_2",
        "toPinId": "ic1_6",
        "color": "#FBBF24"
      },
      {
        "id": "w7",
        "fromPinId": "ic1_6",
        "toPinId": "ic1_2",
        "color": "#FBBF24"
      },
      {
        "id": "w8",
        "fromPinId": "ic1_2",
        "toPinId": "cap1_p",
        "color": "#FBBF24"
      },
      {
        "id": "w9",
        "fromPinId": "cap1_n",
        "toPinId": "ic1_1",
        "color": "#38BDF8"
      },
      {
        "id": "w10",
        "fromPinId": "ic1_1",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      },
      {
        "id": "w11",
        "fromPinId": "ic1_3",
        "toPinId": "led1_a",
        "color": "#00FF87"
      },
      {
        "id": "w12",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_174",
    "num": 174,
    "title": "555 To'g'ri Burchakli To'lqin Generatori (50% Duty)",
    "category": "timer555",
    "categoryName": "NE555 Taymer & Generatorlar",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "NE555",
      "Taymer",
      "Generator",
      "PWM",
      "Multivibrator",
      "Impuls"
    ],
    "desc": "Simmetrik meandr to'lqini generatori.",
    "theory": "Raqamli soatlar va hisoblagichlar uchun aniq 50% li takt impulslari.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 120,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "ic1",
        "type": "timer_555",
        "x": 340,
        "y": 240
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 220,
        "y": 140,
        "resistance": 1000
      },
      {
        "id": "r2",
        "type": "resistor",
        "x": 220,
        "y": 280,
        "resistance": 10000
      },
      {
        "id": "cap1",
        "type": "capacitor",
        "x": 220,
        "y": 380,
        "capacitance": 1e-05
      },
      {
        "id": "led1",
        "type": "led",
        "x": 480,
        "y": 240,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "ic1_8",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "b1_p",
        "toPinId": "ic1_4",
        "color": "#EF4444"
      },
      {
        "id": "w3",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w4",
        "fromPinId": "r1_2",
        "toPinId": "ic1_7",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "ic1_7",
        "toPinId": "r2_1",
        "color": "#FBBF24"
      },
      {
        "id": "w6",
        "fromPinId": "r2_2",
        "toPinId": "ic1_6",
        "color": "#FBBF24"
      },
      {
        "id": "w7",
        "fromPinId": "ic1_6",
        "toPinId": "ic1_2",
        "color": "#FBBF24"
      },
      {
        "id": "w8",
        "fromPinId": "ic1_2",
        "toPinId": "cap1_p",
        "color": "#FBBF24"
      },
      {
        "id": "w9",
        "fromPinId": "cap1_n",
        "toPinId": "ic1_1",
        "color": "#38BDF8"
      },
      {
        "id": "w10",
        "fromPinId": "ic1_1",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      },
      {
        "id": "w11",
        "fromPinId": "ic1_3",
        "toPinId": "led1_a",
        "color": "#00FF87"
      },
      {
        "id": "w12",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_175",
    "num": 175,
    "title": "555 Teremin Optik Musiqa Asobi",
    "category": "timer555",
    "categoryName": "NE555 Taymer & Generatorlar",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "NE555",
      "Taymer",
      "Generator",
      "PWM",
      "Multivibrator",
      "Impuls"
    ],
    "desc": "LDR datchigiga qo'l yaqinlashganda tovush ohangi o'zgarishi.",
    "theory": "Qo'l harakati bilan havodan musiqa chaluvchi mashhur fizika asbobi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 120,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "ic1",
        "type": "timer_555",
        "x": 340,
        "y": 240
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 220,
        "y": 140,
        "resistance": 1000
      },
      {
        "id": "r2",
        "type": "resistor",
        "x": 220,
        "y": 280,
        "resistance": 10000
      },
      {
        "id": "cap1",
        "type": "capacitor",
        "x": 220,
        "y": 380,
        "capacitance": 1e-05
      },
      {
        "id": "led1",
        "type": "led",
        "x": 480,
        "y": 240,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "ic1_8",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "b1_p",
        "toPinId": "ic1_4",
        "color": "#EF4444"
      },
      {
        "id": "w3",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w4",
        "fromPinId": "r1_2",
        "toPinId": "ic1_7",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "ic1_7",
        "toPinId": "r2_1",
        "color": "#FBBF24"
      },
      {
        "id": "w6",
        "fromPinId": "r2_2",
        "toPinId": "ic1_6",
        "color": "#FBBF24"
      },
      {
        "id": "w7",
        "fromPinId": "ic1_6",
        "toPinId": "ic1_2",
        "color": "#FBBF24"
      },
      {
        "id": "w8",
        "fromPinId": "ic1_2",
        "toPinId": "cap1_p",
        "color": "#FBBF24"
      },
      {
        "id": "w9",
        "fromPinId": "cap1_n",
        "toPinId": "ic1_1",
        "color": "#38BDF8"
      },
      {
        "id": "w10",
        "fromPinId": "ic1_1",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      },
      {
        "id": "w11",
        "fromPinId": "ic1_3",
        "toPinId": "led1_a",
        "color": "#00FF87"
      },
      {
        "id": "w12",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_176",
    "num": 176,
    "title": "555 Takt Impulslari Generatori (CLK)",
    "category": "timer555",
    "categoryName": "NE555 Taymer & Generatorlar",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "NE555",
      "Taymer",
      "Generator",
      "PWM",
      "Multivibrator",
      "Impuls"
    ],
    "desc": "Raqamli triggerlar va registrlar uchun sinxronlash signali.",
    "theory": "Raqamli sxemalar faqat CLK impulsi kelgandagina yangi holatga o'tadi.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 120,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "ic1",
        "type": "timer_555",
        "x": 340,
        "y": 240
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 220,
        "y": 140,
        "resistance": 1000
      },
      {
        "id": "r2",
        "type": "resistor",
        "x": 220,
        "y": 280,
        "resistance": 10000
      },
      {
        "id": "cap1",
        "type": "capacitor",
        "x": 220,
        "y": 380,
        "capacitance": 1e-05
      },
      {
        "id": "led1",
        "type": "led",
        "x": 480,
        "y": 240,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "ic1_8",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "b1_p",
        "toPinId": "ic1_4",
        "color": "#EF4444"
      },
      {
        "id": "w3",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w4",
        "fromPinId": "r1_2",
        "toPinId": "ic1_7",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "ic1_7",
        "toPinId": "r2_1",
        "color": "#FBBF24"
      },
      {
        "id": "w6",
        "fromPinId": "r2_2",
        "toPinId": "ic1_6",
        "color": "#FBBF24"
      },
      {
        "id": "w7",
        "fromPinId": "ic1_6",
        "toPinId": "ic1_2",
        "color": "#FBBF24"
      },
      {
        "id": "w8",
        "fromPinId": "ic1_2",
        "toPinId": "cap1_p",
        "color": "#FBBF24"
      },
      {
        "id": "w9",
        "fromPinId": "cap1_n",
        "toPinId": "ic1_1",
        "color": "#38BDF8"
      },
      {
        "id": "w10",
        "fromPinId": "ic1_1",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      },
      {
        "id": "w11",
        "fromPinId": "ic1_3",
        "toPinId": "led1_a",
        "color": "#00FF87"
      },
      {
        "id": "w12",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_177",
    "num": 177,
    "title": "555 Uzaytirilgan Vaqt Taymeri (30 soniya)",
    "category": "timer555",
    "categoryName": "NE555 Taymer & Generatorlar",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "NE555",
      "Taymer",
      "Generator",
      "PWM",
      "Multivibrator",
      "Impuls"
    ],
    "desc": "Katta sig'im va qarshilik bilan 30 soniyalik kutish zanjiri.",
    "theory": "Inson xonadan chiqib ketguncha chiroqni o'chirmay turuvchi kechikish.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 120,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "ic1",
        "type": "timer_555",
        "x": 340,
        "y": 240
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 220,
        "y": 140,
        "resistance": 1000
      },
      {
        "id": "r2",
        "type": "resistor",
        "x": 220,
        "y": 280,
        "resistance": 10000
      },
      {
        "id": "cap1",
        "type": "capacitor",
        "x": 220,
        "y": 380,
        "capacitance": 1e-05
      },
      {
        "id": "led1",
        "type": "led",
        "x": 480,
        "y": 240,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "ic1_8",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "b1_p",
        "toPinId": "ic1_4",
        "color": "#EF4444"
      },
      {
        "id": "w3",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w4",
        "fromPinId": "r1_2",
        "toPinId": "ic1_7",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "ic1_7",
        "toPinId": "r2_1",
        "color": "#FBBF24"
      },
      {
        "id": "w6",
        "fromPinId": "r2_2",
        "toPinId": "ic1_6",
        "color": "#FBBF24"
      },
      {
        "id": "w7",
        "fromPinId": "ic1_6",
        "toPinId": "ic1_2",
        "color": "#FBBF24"
      },
      {
        "id": "w8",
        "fromPinId": "ic1_2",
        "toPinId": "cap1_p",
        "color": "#FBBF24"
      },
      {
        "id": "w9",
        "fromPinId": "cap1_n",
        "toPinId": "ic1_1",
        "color": "#38BDF8"
      },
      {
        "id": "w10",
        "fromPinId": "ic1_1",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      },
      {
        "id": "w11",
        "fromPinId": "ic1_3",
        "toPinId": "led1_a",
        "color": "#00FF87"
      },
      {
        "id": "w12",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_178",
    "num": 178,
    "title": "555 Dvigatel Reversi Avtomatikasi",
    "category": "timer555",
    "categoryName": "NE555 Taymer & Generatorlar",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "NE555",
      "Taymer",
      "Generator",
      "PWM",
      "Multivibrator",
      "Impuls"
    ],
    "desc": "Dvigatelni navbat bilan oldinga va orqaga aylantiruvchi generator.",
    "theory": "Mexanik sinov stendlarida resursni tekshirish uchun siklik harakat.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 120,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "ic1",
        "type": "timer_555",
        "x": 340,
        "y": 240
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 220,
        "y": 140,
        "resistance": 1000
      },
      {
        "id": "r2",
        "type": "resistor",
        "x": 220,
        "y": 280,
        "resistance": 10000
      },
      {
        "id": "cap1",
        "type": "capacitor",
        "x": 220,
        "y": 380,
        "capacitance": 1e-05
      },
      {
        "id": "led1",
        "type": "led",
        "x": 480,
        "y": 240,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "ic1_8",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "b1_p",
        "toPinId": "ic1_4",
        "color": "#EF4444"
      },
      {
        "id": "w3",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w4",
        "fromPinId": "r1_2",
        "toPinId": "ic1_7",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "ic1_7",
        "toPinId": "r2_1",
        "color": "#FBBF24"
      },
      {
        "id": "w6",
        "fromPinId": "r2_2",
        "toPinId": "ic1_6",
        "color": "#FBBF24"
      },
      {
        "id": "w7",
        "fromPinId": "ic1_6",
        "toPinId": "ic1_2",
        "color": "#FBBF24"
      },
      {
        "id": "w8",
        "fromPinId": "ic1_2",
        "toPinId": "cap1_p",
        "color": "#FBBF24"
      },
      {
        "id": "w9",
        "fromPinId": "cap1_n",
        "toPinId": "ic1_1",
        "color": "#38BDF8"
      },
      {
        "id": "w10",
        "fromPinId": "ic1_1",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      },
      {
        "id": "w11",
        "fromPinId": "ic1_3",
        "toPinId": "led1_a",
        "color": "#00FF87"
      },
      {
        "id": "w12",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_179",
    "num": 179,
    "title": "555 Tranzistorli Quvvat Kuchaytirgich",
    "category": "timer555",
    "categoryName": "NE555 Taymer & Generatorlar",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "NE555",
      "Taymer",
      "Generator",
      "PWM",
      "Multivibrator",
      "Impuls"
    ],
    "desc": "555 chiqishiga quvvatli tranzistor ulab katta yuklamani boshqarish.",
    "theory": "555 IC maksimal 200mA tok bera oladi, undan katta yuklamalar uchun tranzistor shart.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 120,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "ic1",
        "type": "timer_555",
        "x": 340,
        "y": 240
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 220,
        "y": 140,
        "resistance": 1000
      },
      {
        "id": "r2",
        "type": "resistor",
        "x": 220,
        "y": 280,
        "resistance": 10000
      },
      {
        "id": "cap1",
        "type": "capacitor",
        "x": 220,
        "y": 380,
        "capacitance": 1e-05
      },
      {
        "id": "led1",
        "type": "led",
        "x": 480,
        "y": 240,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "ic1_8",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "b1_p",
        "toPinId": "ic1_4",
        "color": "#EF4444"
      },
      {
        "id": "w3",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w4",
        "fromPinId": "r1_2",
        "toPinId": "ic1_7",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "ic1_7",
        "toPinId": "r2_1",
        "color": "#FBBF24"
      },
      {
        "id": "w6",
        "fromPinId": "r2_2",
        "toPinId": "ic1_6",
        "color": "#FBBF24"
      },
      {
        "id": "w7",
        "fromPinId": "ic1_6",
        "toPinId": "ic1_2",
        "color": "#FBBF24"
      },
      {
        "id": "w8",
        "fromPinId": "ic1_2",
        "toPinId": "cap1_p",
        "color": "#FBBF24"
      },
      {
        "id": "w9",
        "fromPinId": "cap1_n",
        "toPinId": "ic1_1",
        "color": "#38BDF8"
      },
      {
        "id": "w10",
        "fromPinId": "ic1_1",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      },
      {
        "id": "w11",
        "fromPinId": "ic1_3",
        "toPinId": "led1_a",
        "color": "#00FF87"
      },
      {
        "id": "w12",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_180",
    "num": 180,
    "title": "555 Avtonom Qo'riqlash Tizimi",
    "category": "timer555",
    "categoryName": "NE555 Taymer & Generatorlar",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "NE555",
      "Taymer",
      "Generator",
      "PWM",
      "Multivibrator",
      "Impuls"
    ],
    "desc": "Datchik ishga tushganda 10 soniya sirena chalib o'chuvchi signalizatsiya.",
    "theory": "Qo'riqlanadigan ob'ektlar uchun tejamkor va ishonchli xavfsizlik bloki.",
    "components": [
      {
        "id": "b1",
        "type": "battery_9v",
        "x": 120,
        "y": 240,
        "voltage": 9.0
      },
      {
        "id": "ic1",
        "type": "timer_555",
        "x": 340,
        "y": 240
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 220,
        "y": 140,
        "resistance": 1000
      },
      {
        "id": "r2",
        "type": "resistor",
        "x": 220,
        "y": 280,
        "resistance": 10000
      },
      {
        "id": "cap1",
        "type": "capacitor",
        "x": 220,
        "y": 380,
        "capacitance": 1e-05
      },
      {
        "id": "led1",
        "type": "led",
        "x": 480,
        "y": 240,
        "ledColor": "#EF4444"
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "b1_p",
        "toPinId": "ic1_8",
        "color": "#EF4444"
      },
      {
        "id": "w2",
        "fromPinId": "b1_p",
        "toPinId": "ic1_4",
        "color": "#EF4444"
      },
      {
        "id": "w3",
        "fromPinId": "b1_p",
        "toPinId": "r1_1",
        "color": "#EF4444"
      },
      {
        "id": "w4",
        "fromPinId": "r1_2",
        "toPinId": "ic1_7",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "ic1_7",
        "toPinId": "r2_1",
        "color": "#FBBF24"
      },
      {
        "id": "w6",
        "fromPinId": "r2_2",
        "toPinId": "ic1_6",
        "color": "#FBBF24"
      },
      {
        "id": "w7",
        "fromPinId": "ic1_6",
        "toPinId": "ic1_2",
        "color": "#FBBF24"
      },
      {
        "id": "w8",
        "fromPinId": "ic1_2",
        "toPinId": "cap1_p",
        "color": "#FBBF24"
      },
      {
        "id": "w9",
        "fromPinId": "cap1_n",
        "toPinId": "ic1_1",
        "color": "#38BDF8"
      },
      {
        "id": "w10",
        "fromPinId": "ic1_1",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      },
      {
        "id": "w11",
        "fromPinId": "ic1_3",
        "toPinId": "led1_a",
        "color": "#00FF87"
      },
      {
        "id": "w12",
        "fromPinId": "led1_k",
        "toPinId": "b1_n",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_181",
    "num": 181,
    "title": "Arduino Standart Blink (D13)",
    "category": "arduino",
    "categoryName": "Arduino & Aqlli Tizimlar",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "Arduino",
      "Mikrokontroller",
      "C++",
      "Uno R3",
      "Aqlli tizim",
      "Dasturlash"
    ],
    "desc": "13-pindagi o'rnatilgan 'L' LED ni 1 soniya oralig'ida miltillatish.",
    "theory": "Arduino dasturlashining eng birinchi darsi: pinMode, digitalWrite va delay funksiyalari.",
    "components": [
      {
        "id": "ard1",
        "type": "arduino_uno",
        "x": 280,
        "y": 240
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 460,
        "y": 160,
        "resistance": 220
      },
      {
        "id": "led1",
        "type": "led",
        "x": 560,
        "y": 160,
        "ledColor": "#EF4444"
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 460,
        "y": 280,
        "isOpen": true
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "ard1_d13",
        "toPinId": "r1_1",
        "color": "#00FF87"
      },
      {
        "id": "w2",
        "fromPinId": "r1_2",
        "toPinId": "led1_a",
        "color": "#00FF87"
      },
      {
        "id": "w3",
        "fromPinId": "led1_k",
        "toPinId": "ard1_gnd0",
        "color": "#38BDF8"
      },
      {
        "id": "w4",
        "fromPinId": "ard1_d2",
        "toPinId": "sw1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "sw1_2",
        "toPinId": "ard1_gnd0",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_182",
    "num": 182,
    "title": "Arduino Tashqi Qizil LED Boshqaruvi",
    "category": "arduino",
    "categoryName": "Arduino & Aqlli Tizimlar",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "Arduino",
      "Mikrokontroller",
      "C++",
      "Uno R3",
      "Aqlli tizim",
      "Dasturlash"
    ],
    "desc": "8-pin orqali tashqi LED ni yoqish va o'chirish.",
    "theory": "Tashqi komponentlar uchun tok chegaralovchi 220Ω rezistor ulanishi shart.",
    "components": [
      {
        "id": "ard1",
        "type": "arduino_uno",
        "x": 280,
        "y": 240
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 460,
        "y": 160,
        "resistance": 220
      },
      {
        "id": "led1",
        "type": "led",
        "x": 560,
        "y": 160,
        "ledColor": "#EF4444"
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 460,
        "y": 280,
        "isOpen": true
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "ard1_d13",
        "toPinId": "r1_1",
        "color": "#00FF87"
      },
      {
        "id": "w2",
        "fromPinId": "r1_2",
        "toPinId": "led1_a",
        "color": "#00FF87"
      },
      {
        "id": "w3",
        "fromPinId": "led1_k",
        "toPinId": "ard1_gnd0",
        "color": "#38BDF8"
      },
      {
        "id": "w4",
        "fromPinId": "ard1_d2",
        "toPinId": "sw1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "sw1_2",
        "toPinId": "ard1_gnd0",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_183",
    "num": 183,
    "title": "Arduino Svetofor Avtomatikasi",
    "category": "arduino",
    "categoryName": "Arduino & Aqlli Tizimlar",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "Arduino",
      "Mikrokontroller",
      "C++",
      "Uno R3",
      "Aqlli tizim",
      "Dasturlash"
    ],
    "desc": "3 ta LED (Qizil, Sariq, Yashil) orqali to'liq svetofor sikli.",
    "theory": "Haqiqiy shahar svetoforlarining vaqt algoritmlari dasturlashtiriladi.",
    "components": [
      {
        "id": "ard1",
        "type": "arduino_uno",
        "x": 280,
        "y": 240
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 460,
        "y": 160,
        "resistance": 220
      },
      {
        "id": "led1",
        "type": "led",
        "x": 560,
        "y": 160,
        "ledColor": "#EF4444"
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 460,
        "y": 280,
        "isOpen": true
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "ard1_d13",
        "toPinId": "r1_1",
        "color": "#00FF87"
      },
      {
        "id": "w2",
        "fromPinId": "r1_2",
        "toPinId": "led1_a",
        "color": "#00FF87"
      },
      {
        "id": "w3",
        "fromPinId": "led1_k",
        "toPinId": "ard1_gnd0",
        "color": "#38BDF8"
      },
      {
        "id": "w4",
        "fromPinId": "ard1_d2",
        "toPinId": "sw1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "sw1_2",
        "toPinId": "ard1_gnd0",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_184",
    "num": 184,
    "title": "Arduino Piyodalar Svetofori (Tugmali)",
    "category": "arduino",
    "categoryName": "Arduino & Aqlli Tizimlar",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "Arduino",
      "Mikrokontroller",
      "C++",
      "Uno R3",
      "Aqlli tizim",
      "Dasturlash"
    ],
    "desc": "Tugma bosilgandagina avtomobillar to'xtab, piyodaga yashil chiroq yonishi.",
    "theory": "Tugma holatini digitalRead() bilan tekshirib dinamik o'zgarish kiritish.",
    "components": [
      {
        "id": "ard1",
        "type": "arduino_uno",
        "x": 280,
        "y": 240
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 460,
        "y": 160,
        "resistance": 220
      },
      {
        "id": "led1",
        "type": "led",
        "x": 560,
        "y": 160,
        "ledColor": "#EF4444"
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 460,
        "y": 280,
        "isOpen": true
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "ard1_d13",
        "toPinId": "r1_1",
        "color": "#00FF87"
      },
      {
        "id": "w2",
        "fromPinId": "r1_2",
        "toPinId": "led1_a",
        "color": "#00FF87"
      },
      {
        "id": "w3",
        "fromPinId": "led1_k",
        "toPinId": "ard1_gnd0",
        "color": "#38BDF8"
      },
      {
        "id": "w4",
        "fromPinId": "ard1_d2",
        "toPinId": "sw1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "sw1_2",
        "toPinId": "ard1_gnd0",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_185",
    "num": 185,
    "title": "Arduino Tugmali Kalit (Toggle Rejim)",
    "category": "arduino",
    "categoryName": "Arduino & Aqlli Tizimlar",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "Arduino",
      "Mikrokontroller",
      "C++",
      "Uno R3",
      "Aqlli tizim",
      "Dasturlash"
    ],
    "desc": "Tugmani 1 marta bossa yonadi, yana 1 marta bossa o'chadi.",
    "theory": "Holat o'zgaruvchisi (state toggle) orqali bitta tugma bilan 2 ta holatni boshqarish.",
    "components": [
      {
        "id": "ard1",
        "type": "arduino_uno",
        "x": 280,
        "y": 240
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 460,
        "y": 160,
        "resistance": 220
      },
      {
        "id": "led1",
        "type": "led",
        "x": 560,
        "y": 160,
        "ledColor": "#EF4444"
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 460,
        "y": 280,
        "isOpen": true
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "ard1_d13",
        "toPinId": "r1_1",
        "color": "#00FF87"
      },
      {
        "id": "w2",
        "fromPinId": "r1_2",
        "toPinId": "led1_a",
        "color": "#00FF87"
      },
      {
        "id": "w3",
        "fromPinId": "led1_k",
        "toPinId": "ard1_gnd0",
        "color": "#38BDF8"
      },
      {
        "id": "w4",
        "fromPinId": "ard1_d2",
        "toPinId": "sw1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "sw1_2",
        "toPinId": "ard1_gnd0",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_186",
    "num": 186,
    "title": "Arduino Tugma Tebranishini Filtrlash (Debounce)",
    "category": "arduino",
    "categoryName": "Arduino & Aqlli Tizimlar",
    "difficulty": "intermediate",
    "difficultyName": "O'rta",
    "tags": [
      "Arduino",
      "Mikrokontroller",
      "C++",
      "Uno R3",
      "Aqlli tizim",
      "Dasturlash"
    ],
    "desc": "Mexanik kontaktlarning shovqinini dasturiy yo'l bilan tozalash.",
    "theory": "Kontakt tebranishi noto'g'ri bir necha marta bosilish deb qabul qilinishini oldini olish.",
    "components": [
      {
        "id": "ard1",
        "type": "arduino_uno",
        "x": 280,
        "y": 240
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 460,
        "y": 160,
        "resistance": 220
      },
      {
        "id": "led1",
        "type": "led",
        "x": 560,
        "y": 160,
        "ledColor": "#EF4444"
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 460,
        "y": 280,
        "isOpen": true
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "ard1_d13",
        "toPinId": "r1_1",
        "color": "#00FF87"
      },
      {
        "id": "w2",
        "fromPinId": "r1_2",
        "toPinId": "led1_a",
        "color": "#00FF87"
      },
      {
        "id": "w3",
        "fromPinId": "led1_k",
        "toPinId": "ard1_gnd0",
        "color": "#38BDF8"
      },
      {
        "id": "w4",
        "fromPinId": "ard1_d2",
        "toPinId": "sw1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "sw1_2",
        "toPinId": "ard1_gnd0",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_187",
    "num": 187,
    "title": "Arduino PWM Silliq Yonish (Fade Effect)",
    "category": "arduino",
    "categoryName": "Arduino & Aqlli Tizimlar",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "Arduino",
      "Mikrokontroller",
      "C++",
      "Uno R3",
      "Aqlli tizim",
      "Dasturlash"
    ],
    "desc": "analogWrite() orqali LED yorug'ligini nafas olishdek silliq oshirish.",
    "theory": "PWM 0 dan 255 gacha qiymat qabul qilib, o'rtacha kuchlanishni 0V dan 5V gacha o'zgartiradi.",
    "components": [
      {
        "id": "ard1",
        "type": "arduino_uno",
        "x": 280,
        "y": 240
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 460,
        "y": 160,
        "resistance": 220
      },
      {
        "id": "led1",
        "type": "led",
        "x": 560,
        "y": 160,
        "ledColor": "#EF4444"
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 460,
        "y": 280,
        "isOpen": true
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "ard1_d13",
        "toPinId": "r1_1",
        "color": "#00FF87"
      },
      {
        "id": "w2",
        "fromPinId": "r1_2",
        "toPinId": "led1_a",
        "color": "#00FF87"
      },
      {
        "id": "w3",
        "fromPinId": "led1_k",
        "toPinId": "ard1_gnd0",
        "color": "#38BDF8"
      },
      {
        "id": "w4",
        "fromPinId": "ard1_d2",
        "toPinId": "sw1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "sw1_2",
        "toPinId": "ard1_gnd0",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_188",
    "num": 188,
    "title": "Arduino Potensiometr bilan Analog O'qish (ADC)",
    "category": "arduino",
    "categoryName": "Arduino & Aqlli Tizimlar",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "Arduino",
      "Mikrokontroller",
      "C++",
      "Uno R3",
      "Aqlli tizim",
      "Dasturlash"
    ],
    "desc": "A0 pinidan 0 dan 1023 gacha bo'lgan kuchlanish qiymatini o'qish.",
    "theory": "ATmega328P ning 10-bitli analog-raqamli o'zgartirgichi (ADC) 0..5V ni 1024 pog'onaga bo'ladi.",
    "components": [
      {
        "id": "ard1",
        "type": "arduino_uno",
        "x": 280,
        "y": 240
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 460,
        "y": 160,
        "resistance": 220
      },
      {
        "id": "led1",
        "type": "led",
        "x": 560,
        "y": 160,
        "ledColor": "#EF4444"
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 460,
        "y": 280,
        "isOpen": true
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "ard1_d13",
        "toPinId": "r1_1",
        "color": "#00FF87"
      },
      {
        "id": "w2",
        "fromPinId": "r1_2",
        "toPinId": "led1_a",
        "color": "#00FF87"
      },
      {
        "id": "w3",
        "fromPinId": "led1_k",
        "toPinId": "ard1_gnd0",
        "color": "#38BDF8"
      },
      {
        "id": "w4",
        "fromPinId": "ard1_d2",
        "toPinId": "sw1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "sw1_2",
        "toPinId": "ard1_gnd0",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_189",
    "num": 189,
    "title": "Arduino Potensiometr bilan LED Yorqinligi",
    "category": "arduino",
    "categoryName": "Arduino & Aqlli Tizimlar",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "Arduino",
      "Mikrokontroller",
      "C++",
      "Uno R3",
      "Aqlli tizim",
      "Dasturlash"
    ],
    "desc": "map() funksiyasi orqali ADC (0..1023) ni PWM (0..255) ga o'tkazish.",
    "theory": "Qo'lda boshqariladigan silliq mikrokontrollerli dimmer.",
    "components": [
      {
        "id": "ard1",
        "type": "arduino_uno",
        "x": 280,
        "y": 240
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 460,
        "y": 160,
        "resistance": 220
      },
      {
        "id": "led1",
        "type": "led",
        "x": 560,
        "y": 160,
        "ledColor": "#EF4444"
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 460,
        "y": 280,
        "isOpen": true
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "ard1_d13",
        "toPinId": "r1_1",
        "color": "#00FF87"
      },
      {
        "id": "w2",
        "fromPinId": "r1_2",
        "toPinId": "led1_a",
        "color": "#00FF87"
      },
      {
        "id": "w3",
        "fromPinId": "led1_k",
        "toPinId": "ard1_gnd0",
        "color": "#38BDF8"
      },
      {
        "id": "w4",
        "fromPinId": "ard1_d2",
        "toPinId": "sw1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "sw1_2",
        "toPinId": "ard1_gnd0",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_190",
    "num": 190,
    "title": "Arduino LDR Aqlli Tungi Chiroq",
    "category": "arduino",
    "categoryName": "Arduino & Aqlli Tizimlar",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "Arduino",
      "Mikrokontroller",
      "C++",
      "Uno R3",
      "Aqlli tizim",
      "Dasturlash"
    ],
    "desc": "Qorong'i tushganda avtomatik yonuvchi mikrokontrollerli ko'cha chirog'i.",
    "theory": "LDR datchigi o'qilib, chegara qiymatidan (masalan, 500) past bo'lsa LED yoqiladi.",
    "components": [
      {
        "id": "ard1",
        "type": "arduino_uno",
        "x": 280,
        "y": 240
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 460,
        "y": 160,
        "resistance": 220
      },
      {
        "id": "led1",
        "type": "led",
        "x": 560,
        "y": 160,
        "ledColor": "#EF4444"
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 460,
        "y": 280,
        "isOpen": true
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "ard1_d13",
        "toPinId": "r1_1",
        "color": "#00FF87"
      },
      {
        "id": "w2",
        "fromPinId": "r1_2",
        "toPinId": "led1_a",
        "color": "#00FF87"
      },
      {
        "id": "w3",
        "fromPinId": "led1_k",
        "toPinId": "ard1_gnd0",
        "color": "#38BDF8"
      },
      {
        "id": "w4",
        "fromPinId": "ard1_d2",
        "toPinId": "sw1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "sw1_2",
        "toPinId": "ard1_gnd0",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_191",
    "num": 191,
    "title": "Arduino LDR Yorug'lik Darajasini O'lchash",
    "category": "arduino",
    "categoryName": "Arduino & Aqlli Tizimlar",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "Arduino",
      "Mikrokontroller",
      "C++",
      "Uno R3",
      "Aqlli tizim",
      "Dasturlash"
    ],
    "desc": "Yorug'lik miqdorini Serial Monitorga foizlarda chiqarish.",
    "theory": "Serial.print() orqali datchik ma'lumotlarini kompyuterga uzatish.",
    "components": [
      {
        "id": "ard1",
        "type": "arduino_uno",
        "x": 280,
        "y": 240
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 460,
        "y": 160,
        "resistance": 220
      },
      {
        "id": "led1",
        "type": "led",
        "x": 560,
        "y": 160,
        "ledColor": "#EF4444"
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 460,
        "y": 280,
        "isOpen": true
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "ard1_d13",
        "toPinId": "r1_1",
        "color": "#00FF87"
      },
      {
        "id": "w2",
        "fromPinId": "r1_2",
        "toPinId": "led1_a",
        "color": "#00FF87"
      },
      {
        "id": "w3",
        "fromPinId": "led1_k",
        "toPinId": "ard1_gnd0",
        "color": "#38BDF8"
      },
      {
        "id": "w4",
        "fromPinId": "ard1_d2",
        "toPinId": "sw1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "sw1_2",
        "toPinId": "ard1_gnd0",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_192",
    "num": 192,
    "title": "Arduino Pyezo Melodiya Generatori",
    "category": "arduino",
    "categoryName": "Arduino & Aqlli Tizimlar",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "Arduino",
      "Mikrokontroller",
      "C++",
      "Uno R3",
      "Aqlli tizim",
      "Dasturlash"
    ],
    "desc": "tone() funksiyasi yordamida musiqiy notalarni chalish.",
    "theory": "Har bir musiqa notasi (Do, Re, Mi...) o'z chastotasiga (Hz) ega bo'lib, tone() bilan chiqariladi.",
    "components": [
      {
        "id": "ard1",
        "type": "arduino_uno",
        "x": 280,
        "y": 240
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 460,
        "y": 160,
        "resistance": 220
      },
      {
        "id": "led1",
        "type": "led",
        "x": 560,
        "y": 160,
        "ledColor": "#EF4444"
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 460,
        "y": 280,
        "isOpen": true
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "ard1_d13",
        "toPinId": "r1_1",
        "color": "#00FF87"
      },
      {
        "id": "w2",
        "fromPinId": "r1_2",
        "toPinId": "led1_a",
        "color": "#00FF87"
      },
      {
        "id": "w3",
        "fromPinId": "led1_k",
        "toPinId": "ard1_gnd0",
        "color": "#38BDF8"
      },
      {
        "id": "w4",
        "fromPinId": "ard1_d2",
        "toPinId": "sw1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "sw1_2",
        "toPinId": "ard1_gnd0",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_193",
    "num": 193,
    "title": "Arduino Tez Yordam Sirena Ovozli Tizimi",
    "category": "arduino",
    "categoryName": "Arduino & Aqlli Tizimlar",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "Arduino",
      "Mikrokontroller",
      "C++",
      "Uno R3",
      "Aqlli tizim",
      "Dasturlash"
    ],
    "desc": "Ikki xil chastotani navbat bilan chiqaruvchi akustik sirenasi.",
    "theory": "Favqulodda xizmatlar transporti uchun ogohlantiruvchi signal.",
    "components": [
      {
        "id": "ard1",
        "type": "arduino_uno",
        "x": 280,
        "y": 240
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 460,
        "y": 160,
        "resistance": 220
      },
      {
        "id": "led1",
        "type": "led",
        "x": 560,
        "y": 160,
        "ledColor": "#EF4444"
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 460,
        "y": 280,
        "isOpen": true
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "ard1_d13",
        "toPinId": "r1_1",
        "color": "#00FF87"
      },
      {
        "id": "w2",
        "fromPinId": "r1_2",
        "toPinId": "led1_a",
        "color": "#00FF87"
      },
      {
        "id": "w3",
        "fromPinId": "led1_k",
        "toPinId": "ard1_gnd0",
        "color": "#38BDF8"
      },
      {
        "id": "w4",
        "fromPinId": "ard1_d2",
        "toPinId": "sw1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "sw1_2",
        "toPinId": "ard1_gnd0",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_194",
    "num": 194,
    "title": "Arduino DC Motor Boshqaruvi (Tranzistor orqali)",
    "category": "arduino",
    "categoryName": "Arduino & Aqlli Tizimlar",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "Arduino",
      "Mikrokontroller",
      "C++",
      "Uno R3",
      "Aqlli tizim",
      "Dasturlash"
    ],
    "desc": "D9 pini orqali tranzistorni ochib dvigatelni yoqish.",
    "theory": "Arduino pinlari maksimal 40mA tok bera oladi, shuning uchun motorlar tranzistor orqali boshqariladi.",
    "components": [
      {
        "id": "ard1",
        "type": "arduino_uno",
        "x": 280,
        "y": 240
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 460,
        "y": 160,
        "resistance": 220
      },
      {
        "id": "led1",
        "type": "led",
        "x": 560,
        "y": 160,
        "ledColor": "#EF4444"
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 460,
        "y": 280,
        "isOpen": true
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "ard1_d13",
        "toPinId": "r1_1",
        "color": "#00FF87"
      },
      {
        "id": "w2",
        "fromPinId": "r1_2",
        "toPinId": "led1_a",
        "color": "#00FF87"
      },
      {
        "id": "w3",
        "fromPinId": "led1_k",
        "toPinId": "ard1_gnd0",
        "color": "#38BDF8"
      },
      {
        "id": "w4",
        "fromPinId": "ard1_d2",
        "toPinId": "sw1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "sw1_2",
        "toPinId": "ard1_gnd0",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_195",
    "num": 195,
    "title": "Arduino PWM Motor Tezligini Sozlash",
    "category": "arduino",
    "categoryName": "Arduino & Aqlli Tizimlar",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "Arduino",
      "Mikrokontroller",
      "C++",
      "Uno R3",
      "Aqlli tizim",
      "Dasturlash"
    ],
    "desc": "Potensiometr burilganda dvigatelning silliq tezlashishi.",
    "theory": "Sanoat konveyerlari va robot g'ildiraklari tezligini boshqarish standarti.",
    "components": [
      {
        "id": "ard1",
        "type": "arduino_uno",
        "x": 280,
        "y": 240
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 460,
        "y": 160,
        "resistance": 220
      },
      {
        "id": "led1",
        "type": "led",
        "x": 560,
        "y": 160,
        "ledColor": "#EF4444"
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 460,
        "y": 280,
        "isOpen": true
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "ard1_d13",
        "toPinId": "r1_1",
        "color": "#00FF87"
      },
      {
        "id": "w2",
        "fromPinId": "r1_2",
        "toPinId": "led1_a",
        "color": "#00FF87"
      },
      {
        "id": "w3",
        "fromPinId": "led1_k",
        "toPinId": "ard1_gnd0",
        "color": "#38BDF8"
      },
      {
        "id": "w4",
        "fromPinId": "ard1_d2",
        "toPinId": "sw1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "sw1_2",
        "toPinId": "ard1_gnd0",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_196",
    "num": 196,
    "title": "Arduino 7-Segment Hisoblagich (0 dan 9 gacha)",
    "category": "arduino",
    "categoryName": "Arduino & Aqlli Tizimlar",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "Arduino",
      "Mikrokontroller",
      "C++",
      "Uno R3",
      "Aqlli tizim",
      "Dasturlash"
    ],
    "desc": "D2..D8 pinlari orqali raqamlarni birma-bir sanash.",
    "theory": "Binar massivlar va bitli mantiq orqali 7 ta segmentni sinxron boshqarish.",
    "components": [
      {
        "id": "ard1",
        "type": "arduino_uno",
        "x": 280,
        "y": 240
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 460,
        "y": 160,
        "resistance": 220
      },
      {
        "id": "led1",
        "type": "led",
        "x": 560,
        "y": 160,
        "ledColor": "#EF4444"
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 460,
        "y": 280,
        "isOpen": true
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "ard1_d13",
        "toPinId": "r1_1",
        "color": "#00FF87"
      },
      {
        "id": "w2",
        "fromPinId": "r1_2",
        "toPinId": "led1_a",
        "color": "#00FF87"
      },
      {
        "id": "w3",
        "fromPinId": "led1_k",
        "toPinId": "ard1_gnd0",
        "color": "#38BDF8"
      },
      {
        "id": "w4",
        "fromPinId": "ard1_d2",
        "toPinId": "sw1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "sw1_2",
        "toPinId": "ard1_gnd0",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_197",
    "num": 197,
    "title": "Arduino Xavfsizlik Signalizatsiyasi (LDR+Buzzer+LED)",
    "category": "arduino",
    "categoryName": "Arduino & Aqlli Tizimlar",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "Arduino",
      "Mikrokontroller",
      "C++",
      "Uno R3",
      "Aqlli tizim",
      "Dasturlash"
    ],
    "desc": "Nur to'silganda uzluksiz qizil chiroq va sirena beruvchi qo'riqchi.",
    "theory": "Bir vaqtning o'zida sensor, vizual indikator va tovushni uyg'un boshqarish.",
    "components": [
      {
        "id": "ard1",
        "type": "arduino_uno",
        "x": 280,
        "y": 240
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 460,
        "y": 160,
        "resistance": 220
      },
      {
        "id": "led1",
        "type": "led",
        "x": 560,
        "y": 160,
        "ledColor": "#EF4444"
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 460,
        "y": 280,
        "isOpen": true
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "ard1_d13",
        "toPinId": "r1_1",
        "color": "#00FF87"
      },
      {
        "id": "w2",
        "fromPinId": "r1_2",
        "toPinId": "led1_a",
        "color": "#00FF87"
      },
      {
        "id": "w3",
        "fromPinId": "led1_k",
        "toPinId": "ard1_gnd0",
        "color": "#38BDF8"
      },
      {
        "id": "w4",
        "fromPinId": "ard1_d2",
        "toPinId": "sw1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "sw1_2",
        "toPinId": "ard1_gnd0",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_198",
    "num": 198,
    "title": "Arduino Start / Stop Ikki Tugmali Boshqaruv",
    "category": "arduino",
    "categoryName": "Arduino & Aqlli Tizimlar",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "Arduino",
      "Mikrokontroller",
      "C++",
      "Uno R3",
      "Aqlli tizim",
      "Dasturlash"
    ],
    "desc": "1-tugma yoqadi, 2-tugma o'chiradi (Sanoat standarti).",
    "theory": "Xavfsizlik talablariga ko'ra yoqish va o'chirish har doim alohida jismoniy tugmalar bilan bo'ladi.",
    "components": [
      {
        "id": "ard1",
        "type": "arduino_uno",
        "x": 280,
        "y": 240
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 460,
        "y": 160,
        "resistance": 220
      },
      {
        "id": "led1",
        "type": "led",
        "x": 560,
        "y": 160,
        "ledColor": "#EF4444"
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 460,
        "y": 280,
        "isOpen": true
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "ard1_d13",
        "toPinId": "r1_1",
        "color": "#00FF87"
      },
      {
        "id": "w2",
        "fromPinId": "r1_2",
        "toPinId": "led1_a",
        "color": "#00FF87"
      },
      {
        "id": "w3",
        "fromPinId": "led1_k",
        "toPinId": "ard1_gnd0",
        "color": "#38BDF8"
      },
      {
        "id": "w4",
        "fromPinId": "ard1_d2",
        "toPinId": "sw1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "sw1_2",
        "toPinId": "ard1_gnd0",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_199",
    "num": 199,
    "title": "Arduino Qayta Sanash Taymeri (Countdown)",
    "category": "arduino",
    "categoryName": "Arduino & Aqlli Tizimlar",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "Arduino",
      "Mikrokontroller",
      "C++",
      "Uno R3",
      "Aqlli tizim",
      "Dasturlash"
    ],
    "desc": "Belgilangan vaqt tugagach pyezo signal beruvchi taymer.",
    "theory": "Oshxona taymerlari va jarayon nazoratchilarining ishlash mexanizmi.",
    "components": [
      {
        "id": "ard1",
        "type": "arduino_uno",
        "x": 280,
        "y": 240
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 460,
        "y": 160,
        "resistance": 220
      },
      {
        "id": "led1",
        "type": "led",
        "x": 560,
        "y": 160,
        "ledColor": "#EF4444"
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 460,
        "y": 280,
        "isOpen": true
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "ard1_d13",
        "toPinId": "r1_1",
        "color": "#00FF87"
      },
      {
        "id": "w2",
        "fromPinId": "r1_2",
        "toPinId": "led1_a",
        "color": "#00FF87"
      },
      {
        "id": "w3",
        "fromPinId": "led1_k",
        "toPinId": "ard1_gnd0",
        "color": "#38BDF8"
      },
      {
        "id": "w4",
        "fromPinId": "ard1_d2",
        "toPinId": "sw1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "sw1_2",
        "toPinId": "ard1_gnd0",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  },
  {
    "id": "tmpl_200",
    "num": 200,
    "title": "Arduino Aqlli Uy Kompleks Laboratoriyasi",
    "category": "arduino",
    "categoryName": "Arduino & Aqlli Tizimlar",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "Arduino",
      "Mikrokontroller",
      "C++",
      "Uno R3",
      "Aqlli tizim",
      "Dasturlash"
    ],
    "desc": "Yoritish, datchik, motor va indikator birgalikda ishlovchi boshqaruv markazi.",
    "theory": "Barcha o'rganilgan sensorlar va ijro mexanizmlarining yagona aqlli tizimga birlashishi.",
    "components": [
      {
        "id": "ard1",
        "type": "arduino_uno",
        "x": 280,
        "y": 240
      },
      {
        "id": "r1",
        "type": "resistor",
        "x": 460,
        "y": 160,
        "resistance": 220
      },
      {
        "id": "led1",
        "type": "led",
        "x": 560,
        "y": 160,
        "ledColor": "#EF4444"
      },
      {
        "id": "sw1",
        "type": "switch",
        "x": 460,
        "y": 280,
        "isOpen": true
      }
    ],
    "wires": [
      {
        "id": "w1",
        "fromPinId": "ard1_d13",
        "toPinId": "r1_1",
        "color": "#00FF87"
      },
      {
        "id": "w2",
        "fromPinId": "r1_2",
        "toPinId": "led1_a",
        "color": "#00FF87"
      },
      {
        "id": "w3",
        "fromPinId": "led1_k",
        "toPinId": "ard1_gnd0",
        "color": "#38BDF8"
      },
      {
        "id": "w4",
        "fromPinId": "ard1_d2",
        "toPinId": "sw1_1",
        "color": "#FBBF24"
      },
      {
        "id": "w5",
        "fromPinId": "sw1_2",
        "toPinId": "ard1_gnd0",
        "color": "#38BDF8"
      }
    ],
    "instructions": [
      "Simulyatsiyani yoqing va elektr tokining harakatini kuzating.",
      "Multimetr yoki otsillograf yordamida parametrlarini tekshiring."
    ]
  }
];

// Category definitions with icons and counts
const CIRCUIT_CATEGORIES = [
  { id: "all", name: "Barchasi", icon: "⚡", count: 200 },
  { id: "basic", name: "Boshlang'ich & Asosiy", icon: "💡", count: 20 },
  { id: "laws", name: "Ulanish Usullari & Qonunlar", icon: "📐", count: 20 },
  { id: "measuring", name: "O'lchov & Diagnostika", icon: "📟", count: 20 },
  { id: "diodes", name: "Diodlar & Yarimo'tkazgichlar", icon: "🔴", count: 20 },
  { id: "sensors", name: "Sensorlar & LDR", icon: "☀️", count: 20 },
  { id: "capacitors", name: "Kondensatorlar & RC", icon: "🔋", count: 20 },
  { id: "transistors", name: "Tranzistorlar NPN", icon: "🔀", count: 20 },
  { id: "logic", name: "Raqamli Mantiq (Gates)", icon: "🔲", count: 20 },
  { id: "timer555", name: "NE555 Generatorlar", icon: "⏱️", count: 20 },
  { id: "arduino", name: "Arduino & Aqlli Tizimlar", icon: "🤖", count: 20 }
];

window.CIRCUIT_TEMPLATES = CIRCUIT_TEMPLATES;
window.CIRCUIT_CATEGORIES = CIRCUIT_CATEGORIES;
