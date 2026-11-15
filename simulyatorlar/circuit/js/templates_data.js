/* ==========================================================================
   ATT-25 CIRCUIT LAB - 200 READY-MADE CIRCUIT TEMPLATES DATABASE
   Full 200 Interactive Electronics & Circuit Design Templates in Uzbek
   ========================================================================== */

const CIRCUIT_TEMPLATES = [
  {
    "id": "tmpl_001",
    "num": 1,
    "title": "Oddiy Lampoçka Zanjiri",
    "category": "basic",
    "categoryName": "Boşlanğiç & Oddiy Zanjirlar",
    "difficulty": "beginner",
    "difficultyName": "Boşlanğiç",
    "tags": [
      "Lampoçka",
      "Batareya",
      "Yopiq zanjir"
    ],
    "desc": "9V batareya va lampoçkadan iborat eng sodda yopiq elektr zanjiri.",
    "theory": "Elektr toki manbaning musbat (+) qutbidan çiqib yuklama orqali manfiy (-) qutbga oqadi.",
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
      "Lampoçkaning qizib porlaşini kuzating."
    ]
  },
  {
    "id": "tmpl_002",
    "num": 2,
    "title": "Kalitli Çiroq Zanjiri",
    "category": "basic",
    "categoryName": "Boşlanğiç & Oddiy Zanjirlar",
    "difficulty": "beginner",
    "difficultyName": "Boşlanğiç",
    "tags": [
      "Kalit",
      "Switch",
      "Boşqaruv",
      "Lampoçka"
    ],
    "desc": "Kalit yordamida lampoçkani yoqiş va öçiriş sxemasi.",
    "theory": "Kalit zanjirni uzganda tok oqimi töxtaydi (oçiq zanjir), ulanganda esa tok oqadi (yopiq zanjir).",
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
      "Kalit ustiga bosib zanjirni oçing va yoping.",
      "Çiroq qanday munosabat bildirişini köring."
    ]
  },
  {
    "id": "tmpl_003",
    "num": 3,
    "title": "Qizil LED (Ballast Rezistor bilan)",
    "category": "basic",
    "categoryName": "Boşlanğiç & Oddiy Zanjirlar",
    "difficulty": "beginner",
    "difficultyName": "Boşlanğiç",
    "tags": [
      "LED",
      "Rezistor",
      "Tok çeklovçi",
      "Yoruğlik diodi"
    ],
    "desc": "Qizil LED ni 470Ω tok çeklovçi rezistor orqali xavfsiz yoqiş.",
    "theory": "Yoruğlik diodi (LED) minimal içki qarşilikka ega. Ballast rezistori bölmasa, tok oşib LED kuyadi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_004",
    "num": 4,
    "title": "Yaşil LED Zanjiri (330Ω)",
    "category": "basic",
    "categoryName": "Boşlanğiç & Oddiy Zanjirlar",
    "difficulty": "beginner",
    "difficultyName": "Boşlanğiç",
    "tags": [
      "Yaşil LED",
      "Rezistor 330",
      "Optoelektronika"
    ],
    "desc": "Yaşil LED (işçi kuçlanişi 2.1V) ni 330Ω rezistor orqali yoqiş.",
    "theory": "Yaşil LED qizil LED ga qaraganda bir oz yuqoriroq töğri kuçlaniş tuşişiga ega (2.1V).",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_005",
    "num": 5,
    "title": "1.5V Batareya va Kiçik Lampoçka",
    "category": "basic",
    "categoryName": "Boşlanğiç & Oddiy Zanjirlar",
    "difficulty": "beginner",
    "difficultyName": "Boşlanğiç",
    "tags": [
      "1.5V",
      "AA Batareya",
      "Past kuçlaniş"
    ],
    "desc": "1.5V AA batareya orqali kam quvvatli lampoçkani quvvatlaş.",
    "theory": "1.5V kuçlaniş inson tanasi uçun mutlaqo xavfsiz va kiçik portativ asboblarda keng qöllaniladi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_006",
    "num": 6,
    "title": "Doimiy Pyezo Buzzer Signali",
    "category": "basic",
    "categoryName": "Boşlanğiç & Oddiy Zanjirlar",
    "difficulty": "beginner",
    "difficultyName": "Boşlanğiç",
    "tags": [
      "Buzzer",
      "Tovuş",
      "Pyezoelektrik"
    ],
    "desc": "9V manbaga ulangan pyezo buzzerdan uzluksiz tovuş çiqariş.",
    "theory": "Pyezo buzzer içidagi pyezokeramik diskka kuçlaniş berilganda u tebranib 2.5kHz akustik signal tarqatadi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_007",
    "num": 7,
    "title": "Eşik Qönğiroği (Tugmali Buzzer)",
    "category": "basic",
    "categoryName": "Boşlanğiç & Oddiy Zanjirlar",
    "difficulty": "beginner",
    "difficultyName": "Boşlanğiç",
    "tags": [
      "Qönğiroq",
      "Buzzer",
      "Kalit",
      "Xavfsizlik"
    ],
    "desc": "Tugma bosilgandagina tovuş çiqaruvçi eşik qönğiroği modeli.",
    "theory": "Kalit normal holatda oçiq bölib, faqat bosib turilganda zanjir yopiladi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_008",
    "num": 8,
    "title": "DC Dvigatel va Ventilyator",
    "category": "basic",
    "categoryName": "Boşlanğiç & Oddiy Zanjirlar",
    "difficulty": "beginner",
    "difficultyName": "Boşlanğiç",
    "tags": [
      "Motor",
      "DC Dvigatel",
      "Elektromexanika",
      "Aylaniş"
    ],
    "desc": "Kalit yordamida elektr dvigatelini işga tuşiriş va töxtatiş.",
    "theory": "Elektr toki dvigatel çulğamlarida magnit maydon hosil qilib rotorni aylantiradi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_009",
    "num": 9,
    "title": "Umumiy Tuproqlaş (GND) Zanjiri",
    "category": "basic",
    "categoryName": "Boşlanğiç & Oddiy Zanjirlar",
    "difficulty": "beginner",
    "difficultyName": "Boşlanğiç",
    "tags": [
      "GND",
      "Tuproqlaş",
      "0V Malumot"
    ],
    "desc": "Manfiy qutb umumiy tuproqlaş (GND) orqali yopiladigan klassik sxema.",
    "theory": "Elektronikada barça potensiallar GND (0V) nuqtasiga nisbatan ölçanadi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_010",
    "num": 10,
    "title": "Past Qarşilikli Himoya Rezistori",
    "category": "basic",
    "categoryName": "Boşlanğiç & Oddiy Zanjirlar",
    "difficulty": "beginner",
    "difficultyName": "Boşlanğiç",
    "tags": [
      "Himoya",
      "Rezistor",
      "Saqlagiç"
    ],
    "desc": "Qisqa tutaşuvdan asrovçi kam qarşilikli (10Ω) himoya elementi.",
    "theory": "Zanjirda tok ortib ketganda himoya rezistori yuklamani ortiqça tokdan asraydi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_011",
    "num": 11,
    "title": "Lampoçka Dimmeri (Potensiometr)",
    "category": "basic",
    "categoryName": "Boşlanğiç & Oddiy Zanjirlar",
    "difficulty": "beginner",
    "difficultyName": "Boşlanğiç",
    "tags": [
      "Dimmer",
      "Potensiometr",
      "Yoruğlikni rostlaş"
    ],
    "desc": "Potensiometr burilişi orqali lampoçkaning yorqinligini silliq rostlaş.",
    "theory": "Potensiometr qarşiligi ortganda zanjirdagi tok kamayadi (I = U/R), çiroq xiralaşadi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_012",
    "num": 12,
    "title": "Motor Tezligini Rostlaş (Reostat)",
    "category": "basic",
    "categoryName": "Boşlanğiç & Oddiy Zanjirlar",
    "difficulty": "beginner",
    "difficultyName": "Boşlanğiç",
    "tags": [
      "Motor",
      "Tezlik",
      "Reostat",
      "Potensiometr"
    ],
    "desc": "Potensiometr yordamida DC motorning aylaniş tezligini boşqariş.",
    "theory": "Dvigatelga berilayotgan kuçlaniş va tok özgartirilganda uning burçak tezligi özgaradi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_013",
    "num": 13,
    "title": "Buzzer Ovozini Sozlaş",
    "category": "basic",
    "categoryName": "Boşlanğiç & Oddiy Zanjirlar",
    "difficulty": "beginner",
    "difficultyName": "Boşlanğiç",
    "tags": [
      "Buzzer",
      "Ovoz balandligi",
      "Potensiometr"
    ],
    "desc": "Rezistor orqali pyezo buzzerning ovoz balandligini pasaytiriş.",
    "theory": "Buzzerga ketayotgan tokni çeklaş orqali uning akustik kuçi boşqariladi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_014",
    "num": 14,
    "title": "Ikki Kalitli Xavfsizlik Zanjiri",
    "category": "basic",
    "categoryName": "Boşlanğiç & Oddiy Zanjirlar",
    "difficulty": "beginner",
    "difficultyName": "Boşlanğiç",
    "tags": [
      "Ketma-ket kalitlar",
      "Xavfsizlik",
      "Interlok"
    ],
    "desc": "Faqat ikkala kalit ham bir vaqtda bosilgandagina lampoçka yonişi.",
    "theory": "Sanoat uskunalarida xavfsizlik uçun ikkala qöl bilan 2 ta tugmani bosiş talab qilinadi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_015",
    "num": 15,
    "title": "Parallel Kalitlar (OR mantiği)",
    "category": "basic",
    "categoryName": "Boşlanğiç & Oddiy Zanjirlar",
    "difficulty": "beginner",
    "difficultyName": "Boşlanğiç",
    "tags": [
      "Parallel kalitlar",
      "Boşqaruv",
      "Zanjir"
    ],
    "desc": "Istalgan kalit bosilganda lampoçka yonadigan parallel kalitli sxema.",
    "theory": "Kalitlar parallel ulanganda, heç bölmaganda biri yopilişi tok oqişi uçun kifoya qiladi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_016",
    "num": 16,
    "title": "Yölak Kaliti Modeli (Krossover)",
    "category": "basic",
    "categoryName": "Boşlanğiç & Oddiy Zanjirlar",
    "difficulty": "beginner",
    "difficultyName": "Boşlanğiç",
    "tags": [
      "Yölak kaliti",
      "Ötiş kaliti",
      "Uy elektrigi"
    ],
    "desc": "Uzun yölakning ikki boşidan çiroqni yoqiş va öçiriş sxemasi.",
    "theory": "Köp qavatli uylar va uzun yölaklarda qulaylik uçun ötuvçi kalitlar örnatiladi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_017",
    "num": 17,
    "title": "Batareyalarni Ketma-ket Ulaş (3V Manba)",
    "category": "basic",
    "categoryName": "Boşlanğiç & Oddiy Zanjirlar",
    "difficulty": "beginner",
    "difficultyName": "Boşlanğiç",
    "tags": [
      "1.5V x 2",
      "3V",
      "Ketma-ket batareya"
    ],
    "desc": "Ikkita 1.5V elementni ketma-ket ulab 3.0V hosil qiliş va qizil LED ni yoqiş.",
    "theory": "Batareyalar ketma-ket ulanganda ularning kuçlanişlari qöşiladi: U = U1 + U2.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_018",
    "num": 18,
    "title": "Batareyalarni Parallel Ulaş",
    "category": "basic",
    "categoryName": "Boşlanğiç & Oddiy Zanjirlar",
    "difficulty": "beginner",
    "difficultyName": "Boşlanğiç",
    "tags": [
      "Parallel batareya",
      "Siğim",
      "Mustahkamlik"
    ],
    "desc": "Ikkita 9V batareyani parallel ulab yuklamani quvvatlaş.",
    "theory": "Parallel ulanganda kuçlaniş özgarmaydi, lekin manbalarning umumiy tok beriş qobiliyati va işlaş vaqti 2 baravar oşadi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_019",
    "num": 19,
    "title": "Qisqa Tutaşuv Namoyişi (K3)",
    "category": "basic",
    "categoryName": "Boşlanğiç & Oddiy Zanjirlar",
    "difficulty": "beginner",
    "difficultyName": "Boşlanğiç",
    "tags": [
      "Qisqa tutaşuv",
      "K3",
      "Xavfsizlik"
    ],
    "desc": "Yuklamasiz batareya qutblarini töğridan-töğri kalit orqali ulaş tajribasi.",
    "theory": "Qisqa tutaşuvda qarşilik deyarli 0 ga teng bölib, tok çeksiz ösadi va simlar qiziydi.",
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
      "Kalitni bosing va yuqori panelda Qisqa Tutaşuv (K3) ogohlantirişini köring."
    ]
  },
  {
    "id": "tmpl_020",
    "num": 20,
    "title": "LED Teskari Qutblanişi",
    "category": "basic",
    "categoryName": "Boşlanğiç & Oddiy Zanjirlar",
    "difficulty": "beginner",
    "difficultyName": "Boşlanğiç",
    "tags": [
      "Teskari qutb",
      "Diod",
      "Yopiq holat"
    ],
    "desc": "LED katodi musbatga, anodi manfiyga ulanganda tok ötmasligini isbotlaş.",
    "theory": "Diodlar faqat bir tomonlama (anoddan katodga) tok ötkazadi. Teskari ulansa u oçiq kalit kabi işlaydi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_021",
    "num": 21,
    "title": "Ketma-ket 2 ta Lampoçka",
    "category": "laws",
    "categoryName": "Ulaniş Usullari & Qonunlar",
    "difficulty": "beginner",
    "difficultyName": "Boşlanğiç",
    "tags": [
      "Ketma-ket",
      "Series",
      "Kuçlaniş bölinişi"
    ],
    "desc": "Ikkita bir xil lampoçkani ketma-ket ulaş (har biriga 4.5V tuşadi).",
    "theory": "Ketma-ket ulanişda zanjirning umumiy qarşiligi oşadi (R = R1 + R2), şuning uçun lampoçkalar xiraroq yonadi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_022",
    "num": 22,
    "title": "Ketma-ket 3 ta Lampoçka",
    "category": "laws",
    "categoryName": "Ulaniş Usullari & Qonunlar",
    "difficulty": "beginner",
    "difficultyName": "Boşlanğiç",
    "tags": [
      "Ketma-ket 3x",
      "Çiroqlar",
      "Kuçlaniş"
    ],
    "desc": "Uçta lampoçka ketma-ket ulanganda kuçlaniş teng uçga bölinadi (3V dan).",
    "theory": "Agar zanjirdagi bitta lampoçka kuysa yoki uzilsa, barça lampoçkalar öçadi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_023",
    "num": 23,
    "title": "Parallel 2 ta Lampoçka",
    "category": "laws",
    "categoryName": "Ulaniş Usullari & Qonunlar",
    "difficulty": "beginner",
    "difficultyName": "Boşlanğiç",
    "tags": [
      "Parallel",
      "Töliq kuçlaniş",
      "Mustaqil"
    ],
    "desc": "Ikkita lampoçka parallel ulanganda har biriga töliq 9V beriladi va ikkalasi ham yoruğ yonadi.",
    "theory": "Parallel ulanişda şoxobçalardan birortasi uzilsa ham, qolganlari işlaşda davom etadi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_024",
    "num": 24,
    "title": "Parallel 3 ta Lampoçka",
    "category": "laws",
    "categoryName": "Ulaniş Usullari & Qonunlar",
    "difficulty": "beginner",
    "difficultyName": "Boşlanğiç",
    "tags": [
      "Parallel 3x",
      "Katta tok",
      "Yoruğlik"
    ],
    "desc": "Uçta mustaqil tarmoqda parallel ulangan lampoçkalar.",
    "theory": "Parallel zanjirda umumiy tok har bir tarmoq toklari yiğindisiga teng: I = I1 + I2 + I3.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_025",
    "num": 25,
    "title": "Aralaş Ulaniş: 1 Ketma-ket + 2 Parallel",
    "category": "laws",
    "categoryName": "Ulaniş Usullari & Qonunlar",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "Aralaş ulaniş",
      "Murakkab zanjir"
    ],
    "desc": "Bitta lampoçka ketma-ket, undan keyin ikkita lampoçka parallel ulangan.",
    "theory": "Boşlanğiç lampoçkadan töliq tok ötadi, keyin esa tok ikki parallel şoxobçaga bölinadi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_026",
    "num": 26,
    "title": "Aralaş Ulaniş: 2 ta Ketma-ket Guruh Parallel",
    "category": "laws",
    "categoryName": "Ulaniş Usullari & Qonunlar",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "Aralaş ulaniş 2",
      "Simmetriya"
    ],
    "desc": "Ikkita parallel tarmoqning har birida ikkitadan ketma-ket lampoçka.",
    "theory": "Har bir tarmoqqa 9V tuşadi va har bir tarmoqdagi lampoçkalar 4.5V dan oladi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_027",
    "num": 27,
    "title": "Ohm Qonuni: 9V va 220Ω Rezistor",
    "category": "laws",
    "categoryName": "Ulaniş Usullari & Qonunlar",
    "difficulty": "beginner",
    "difficultyName": "Boşlanğiç",
    "tags": [
      "Ohm qonuni",
      "I = U / R",
      "Tok kuçi"
    ],
    "desc": "I = U / R formulasini amalda tekşiriş: 9V / 220Ω ≈ 40.9 mA.",
    "theory": "Ötkazgiçdagi tok kuçi kuçlanişga töğri, qarşilikka esa teskari mutanosibdir.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_028",
    "num": 28,
    "title": "Ohm Qonuni: 9V va 1000Ω Rezistor",
    "category": "laws",
    "categoryName": "Ulaniş Usullari & Qonunlar",
    "difficulty": "beginner",
    "difficultyName": "Boşlanğiç",
    "tags": [
      "Ohm qonuni 1k",
      "Kiçik tok"
    ],
    "desc": "Kattaroq qarşilikda tokning kamayişi: 9V / 1000Ω = 9.0 mA.",
    "theory": "Qarşilik 4.5 baravar ortganda tok ham xuddi şunça baravar kamayadi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_029",
    "num": 29,
    "title": "Kuçlaniş Böluvçi: 9V -> 4.5V (Teng R)",
    "category": "laws",
    "categoryName": "Ulaniş Usullari & Qonunlar",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "Kuçlaniş böluvçi",
      "Voltage Divider",
      "4.5V"
    ],
    "desc": "Ikkita bir xil 1kΩ rezistor yordamida 9V kuçlanişni teng 2 ga böliş.",
    "theory": "U_çiq = U_kir * (R2 / (R1 + R2)) = 9V * (1000 / 2000) = 4.5V.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_030",
    "num": 30,
    "title": "Nometrik Böluvçi: 1000Ω va 220Ω",
    "category": "laws",
    "categoryName": "Ulaniş Usullari & Qonunlar",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "Böluvçi",
      "Nisbat",
      "Turli R"
    ],
    "desc": "Turli qiymatli rezistorlar orqali 9V dan taxminan 1.62V oliş.",
    "theory": "R2 (220Ω) uçlaridagi kuçlaniş: 9V * 220 / (1000 + 220) ≈ 1.62V.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_031",
    "num": 31,
    "title": "Kirçhoff 1-Qonuni: Tugun Toklari Balansi",
    "category": "laws",
    "categoryName": "Ulaniş Usullari & Qonunlar",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "Kirçhoff",
      "Tugun toki",
      "KCL"
    ],
    "desc": "Tugunga kiruvçi umumiy tok tarmoqlardan çiquvçi toklar yiğindisiga tengligi.",
    "theory": "∑ I_kiruvçi = ∑ I_çiquvçi. Elektr zaryadi yöqolmaydi va yiğilib qolmaydi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_032",
    "num": 32,
    "title": "Kirçhoff 2-Qonuni: Kontur Kuçlanişlari",
    "category": "laws",
    "categoryName": "Ulaniş Usullari & Qonunlar",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "Kirçhoff 2",
      "KVL",
      "Kontur balansi"
    ],
    "desc": "Yopiq konturdagi EYuK lari yiğindisi kuçlaniş tuşişlari yiğindisiga teng.",
    "theory": "∑ E = ∑ (I * R). Manba kuçlanişi (9V) rezistorlar tuşişi yiğindisiga (U1 + U2) teng böladi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_033",
    "num": 33,
    "title": "Parallel Rezistorlar: 2x 220Ω = 110Ω",
    "category": "laws",
    "categoryName": "Ulaniş Usullari & Qonunlar",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "Parallel R",
      "110 Ohm",
      "Ekvivalent qarşilik"
    ],
    "desc": "Ikkita teng rezistor parallel ulanganda umumiy qarşilik 2 baravarga kamayadi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_034",
    "num": 34,
    "title": "Ketma-ket Rezistorlar: 220Ω + 1000Ω = 1220Ω",
    "category": "laws",
    "categoryName": "Ulaniş Usullari & Qonunlar",
    "difficulty": "beginner",
    "difficultyName": "Boşlanğiç",
    "tags": [
      "Ketma-ket R",
      "1220 Ohm",
      "Qarşiliklar yiğindisi"
    ],
    "desc": "Ketma-ket ulanişda qarşiliklarning töğridan-töğri qöşiliş qoidasi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_035",
    "num": 35,
    "title": "Balanslangan Uitson Köprigi (Wheatstone)",
    "category": "laws",
    "categoryName": "Ulaniş Usullari & Qonunlar",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "Uitson köprigi",
      "Wheatstone",
      "Balans",
      "Ölçov"
    ],
    "desc": "Köprik muvozanatda bölganda (R1/R2 = R3/R4) diagonalda kuçlaniş va tok 0V böladi.",
    "theory": "Uitson köprigi noma'lum qarşiliklarni yuqori aniqlikda ölçaşda standart usul hisoblanadi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_036",
    "num": 36,
    "title": "Balanslanmagan Köprikli Zanjir",
    "category": "laws",
    "categoryName": "Ulaniş Usullari & Qonunlar",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "Balanssiz köprik",
      "Diagonal toki"
    ],
    "desc": "Yelkalardan birining qarşiligi özgarganda diagonal orqali tok oqişi.",
    "theory": "Datçiklar (tenzodatçik, fotorezistor) köprik yelkasiga qöyilib, nomutanosiblik signali kuçaytiriladi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_037",
    "num": 37,
    "title": "Ketma-ket 3 ta Qizil LED",
    "category": "laws",
    "categoryName": "Ulaniş Usullari & Qonunlar",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "Ketma-ket LED",
      "LED paneli"
    ],
    "desc": "3 ta qizil LED (har biri ~1.8V) va 1 ta çeklovçi 180Ω rezistor.",
    "theory": "LED lar töğri kuçlanişlari qöşiladi (3 * 1.8V = 5.4V). Qolgan 3.6V rezistorda söndiriladi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_038",
    "num": 38,
    "title": "Parallel LED lar (Alohida Rezistorlar Bilan)",
    "category": "laws",
    "categoryName": "Ulaniş Usullari & Qonunlar",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "Parallel LED",
      "Alohida ballast",
      "Töğri sxema"
    ],
    "desc": "Har bir LED özining şaxsiy rezistoriga ega bölgan töğri parallel ulaniş.",
    "theory": "Har bir LED öz rezistoriga ega bölsa, ularning volt-amper xarakteristikasi farq qilsa ham tok barqaror taqsimlanadi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_039",
    "num": 39,
    "title": "Yagona Rezistorli Parallel LED (Oqibat)",
    "category": "laws",
    "categoryName": "Ulaniş Usullari & Qonunlar",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "Notöğri parallel",
      "Tok notekisligi",
      "Xavf"
    ],
    "desc": "Ikkita LED ni bitta umumiy rezistor orqali parallel ulaşdagi xatolik tahlili.",
    "theory": "Yaşil LED (2.1V) va Qizil LED (1.8V) bitta umumiy rezistorga ulansa, pastroq kuçlanişli qizil LED barça tokni tortib oladi!",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_040",
    "num": 40,
    "title": "Elektr Quvvati Sarfi (P = U * I)",
    "category": "laws",
    "categoryName": "Ulaniş Usullari & Qonunlar",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "Quvvat",
      "P = U * I",
      "Joul-Lens"
    ],
    "desc": "Zanjirdagi ajralayotgan elektr quvvatini hisoblaş va tahlil qiliş.",
    "theory": "P = U * I = I² * R. Kiçikroq qarşilik köproq tok ötkazadi va köproq quvvat sarflaydi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_041",
    "num": 41,
    "title": "Multimetr bilan Batareya Kuçlanişini Ölçaş",
    "category": "measuring",
    "categoryName": "Ölçov & Diagnostika",
    "difficulty": "beginner",
    "difficultyName": "Boşlanğiç",
    "tags": [
      "Ölçov",
      "Multimetr",
      "Diagnostika",
      "Sinov",
      "Tok",
      "Kuçlaniş"
    ],
    "desc": "Batareya klemmalaridagi 9.0V EYUK ni voltmetr yordamida ölçaş.",
    "theory": "Voltmetr zanjirga har doim parallel ulanadi va juda katta içki qarşilikka ega.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_042",
    "num": 42,
    "title": "Yuklama Ostida Kuçlaniş Tuşişi",
    "category": "measuring",
    "categoryName": "Ölçov & Diagnostika",
    "difficulty": "beginner",
    "difficultyName": "Boşlanğiç",
    "tags": [
      "Ölçov",
      "Multimetr",
      "Diagnostika",
      "Sinov",
      "Tok",
      "Kuçlaniş"
    ],
    "desc": "Lampoçka ulanganda uning uçlaridagi işçi kuçlanişni tekşiriş.",
    "theory": "Yuklama ulanganda manbaning içki qarşiligi sababli kuçlaniş biroz pasayişi mumkin.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_043",
    "num": 43,
    "title": "Zanjirdagi Tok Kuçini Ölçaş (Ampermetr)",
    "category": "measuring",
    "categoryName": "Ölçov & Diagnostika",
    "difficulty": "beginner",
    "difficultyName": "Boşlanğiç",
    "tags": [
      "Ölçov",
      "Multimetr",
      "Diagnostika",
      "Sinov",
      "Tok",
      "Kuçlaniş"
    ],
    "desc": "Ampermetrni ketma-ket ulaş qoidasi va tokni aniqlaş.",
    "theory": "Ampermetr har doim zanjirga KETMA-KET ulanadi, parallel ulansa qisqa tutaşuv yuz beradi!",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_044",
    "num": 44,
    "title": "Rezistor Qarşiligini Ölçaş (Ommetr)",
    "category": "measuring",
    "categoryName": "Ölçov & Diagnostika",
    "difficulty": "beginner",
    "difficultyName": "Boşlanğiç",
    "tags": [
      "Ölçov",
      "Multimetr",
      "Diagnostika",
      "Sinov",
      "Tok",
      "Kuçlaniş"
    ],
    "desc": "Zanjirdan uzilgan holatda rezistorning haqiqiy qarşiligini tekşiriş.",
    "theory": "Ommetr bilan ölçaş faqat zanjir töliq öçirilgan holatda amalga oşirilişi şart.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_045",
    "num": 45,
    "title": "LED Işçi Kuçlanişini Ölçaş",
    "category": "measuring",
    "categoryName": "Ölçov & Diagnostika",
    "difficulty": "beginner",
    "difficultyName": "Boşlanğiç",
    "tags": [
      "Ölçov",
      "Multimetr",
      "Diagnostika",
      "Sinov",
      "Tok",
      "Kuçlaniş"
    ],
    "desc": "Yoniq turgan LED uçlaridagi töğri kuçlaniş tuşişini ölçaş.",
    "theory": "Qizil LED odatda 1.8V - 2.0V kuçlanişda barqaror yoruğlik çiqaradi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_046",
    "num": 46,
    "title": "Otsillograf bilan Doimiy Kuçlanişni Kuzatiş",
    "category": "measuring",
    "categoryName": "Ölçov & Diagnostika",
    "difficulty": "beginner",
    "difficultyName": "Boşlanğiç",
    "tags": [
      "Ölçov",
      "Multimetr",
      "Diagnostika",
      "Sinov",
      "Tok",
      "Kuçlaniş"
    ],
    "desc": "9V DC kuçlanişning töğri çiziqli vaqt grafigi.",
    "theory": "Otsillograf kuçlanişning vaqt böyiça özgarişini körsatuvçi eng muhim vizual asbobdir.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_047",
    "num": 47,
    "title": "Kalit Ulanişidagi Sakraş (Contact Bounce)",
    "category": "measuring",
    "categoryName": "Ölçov & Diagnostika",
    "difficulty": "beginner",
    "difficultyName": "Boşlanğiç",
    "tags": [
      "Ölçov",
      "Multimetr",
      "Diagnostika",
      "Sinov",
      "Tok",
      "Kuçlaniş"
    ],
    "desc": "Kalit yopilgandagi ötiş jarayoni va tokning keskin ösişi.",
    "theory": "Mexanik kontaktlar ulanganda bir neça mikrosekund davomida mikrosakraşlar yuz beradi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_048",
    "num": 48,
    "title": "Potensiometr Kuçlaniş Böluvçisini Ölçaş",
    "category": "measuring",
    "categoryName": "Ölçov & Diagnostika",
    "difficulty": "beginner",
    "difficultyName": "Boşlanğiç",
    "tags": [
      "Ölçov",
      "Multimetr",
      "Diagnostika",
      "Sinov",
      "Tok",
      "Kuçlaniş"
    ],
    "desc": "Potensiometr burilganda örta çiqişdagi kuçlaniş (0..9V).",
    "theory": "Potensiometrning suriluvçi kontakti kuçlanişni silliq bölib beradi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_049",
    "num": 49,
    "title": "Buzzer Tokini Ölçaş",
    "category": "measuring",
    "categoryName": "Ölçov & Diagnostika",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "Ölçov",
      "Multimetr",
      "Diagnostika",
      "Sinov",
      "Tok",
      "Kuçlaniş"
    ],
    "desc": "Pyezo buzzer işlayotganda sarflaydigan kiçik tokni aniqlaş.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_050",
    "num": 50,
    "title": "Qisqa Tutaşuv Diagnostikasi",
    "category": "measuring",
    "categoryName": "Ölçov & Diagnostika",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "Ölçov",
      "Multimetr",
      "Diagnostika",
      "Sinov",
      "Tok",
      "Kuçlaniş"
    ],
    "desc": "Tokning sakraşi va kuçlanişning 0V ga tuşişi simulyatsiyasi.",
    "theory": "K3 holatida manba qutblari orasidagi kuçlaniş deyarli nolga teng bölib qoladi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_051",
    "num": 51,
    "title": "Parallel Tarmoqlar Toklarini Soliştiriş",
    "category": "measuring",
    "categoryName": "Ölçov & Diagnostika",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "Ölçov",
      "Multimetr",
      "Diagnostika",
      "Sinov",
      "Tok",
      "Kuçlaniş"
    ],
    "desc": "I1 va I2 şoxobça toklari yiğindisi umumiy tokka tengligini ölçaş.",
    "theory": "Har bir şoxobçadagi tok uning qarşiligiga teskari mutanosib taqsimlanadi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_052",
    "num": 52,
    "title": "Ketma-ket Tarmoqlarda Tok Tengligi",
    "category": "measuring",
    "categoryName": "Ölçov & Diagnostika",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "Ölçov",
      "Multimetr",
      "Diagnostika",
      "Sinov",
      "Tok",
      "Kuçlaniş"
    ],
    "desc": "Ketma-ket zanjirning turli nuqtalarida bir xil tok oqişini tekşiriş.",
    "theory": "Ketma-ket zanjirda tok heç qayerga yöqolmaydi: I_kir = I_çiq = I_har_nuqta.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_053",
    "num": 53,
    "title": "Sim Qarşiligi Effekti",
    "category": "measuring",
    "categoryName": "Ölçov & Diagnostika",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "Ölçov",
      "Multimetr",
      "Diagnostika",
      "Sinov",
      "Tok",
      "Kuçlaniş"
    ],
    "desc": "Katta masofadagi kuçlaniş yöqotilişi modeli.",
    "theory": "Haqiqiy elektr tarmoqlarida uzun simlar öz qarşiligiga ega bölib, energiya yöqotiladi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_054",
    "num": 54,
    "title": "Nosozlikni Qidiriş: Oçiq Zanjir (Uziliş)",
    "category": "measuring",
    "categoryName": "Ölçov & Diagnostika",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "Ölçov",
      "Multimetr",
      "Diagnostika",
      "Sinov",
      "Tok",
      "Kuçlaniş"
    ],
    "desc": "Uzilgan sim yoki oçiq qolgan kontaktni voltmetr bilan aniqlaş.",
    "theory": "Uziliş nuqtasining ikki tomonida töliq manba kuçlanişi hosil böladi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_055",
    "num": 55,
    "title": "Nosozlikni Qidiriş: Kuygan Rezistor",
    "category": "measuring",
    "categoryName": "Ölçov & Diagnostika",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "Ölçov",
      "Multimetr",
      "Diagnostika",
      "Sinov",
      "Tok",
      "Kuçlaniş"
    ],
    "desc": "Kuyib içki qarşiligi çeksiz bölib qolgan element diagnostikasi.",
    "theory": "Kuygan element tok ötkazmaydi va butun kuçlaniş uning uçlariga tuşadi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_056",
    "num": 56,
    "title": "Nosozlikni Qidiriş: Notöğri Nominal",
    "category": "measuring",
    "categoryName": "Ölçov & Diagnostika",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "Ölçov",
      "Multimetr",
      "Diagnostika",
      "Sinov",
      "Tok",
      "Kuçlaniş"
    ],
    "desc": "Keragidan 10 baravar katta qarşilik qöyilgandagi holat.",
    "theory": "Rezistor nominali haddan taşqari katta bölsa, zanjirdagi tok yetarli bölmay qoladi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_057",
    "num": 57,
    "title": "Manba Içki Qarşiligi Tahlili",
    "category": "measuring",
    "categoryName": "Ölçov & Diagnostika",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "Ölçov",
      "Multimetr",
      "Diagnostika",
      "Sinov",
      "Tok",
      "Kuçlaniş"
    ],
    "desc": "Salt yuriş va töliq yuklama kuçlanişlari farqi.",
    "theory": "Haqiqiy batareyalar öz içki qarşiligiga (r) ega bölib, katta tokda qiziydi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_058",
    "num": 58,
    "title": "Kondensator Zaryad Kuçlanişi Grafigi",
    "category": "measuring",
    "categoryName": "Ölçov & Diagnostika",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "Ölçov",
      "Multimetr",
      "Diagnostika",
      "Sinov",
      "Tok",
      "Kuçlaniş"
    ],
    "desc": "Vaqt ötişi bilan kuçlanişning eksponensial ösişi.",
    "theory": "Kondensator dastlab tez, keyin esa sekinlaşib maksimal kuçlanişgaça zaryadlanadi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_059",
    "num": 59,
    "title": "Motor Işga Tuşiş Toki (Inruş Current)",
    "category": "measuring",
    "categoryName": "Ölçov & Diagnostika",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "Ölçov",
      "Multimetr",
      "Diagnostika",
      "Sinov",
      "Tok",
      "Kuçlaniş"
    ],
    "desc": "Dvigatel start olgandagi dastlabki yuqori tok tahlili.",
    "theory": "Rotor töxtab turganda qarşi-EYUK yöqligi sababli start toki 3-5 baravar katta böladi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_060",
    "num": 60,
    "title": "Töliq Laboratoriya Sinov Stendi",
    "category": "measuring",
    "categoryName": "Ölçov & Diagnostika",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "Ölçov",
      "Multimetr",
      "Diagnostika",
      "Sinov",
      "Tok",
      "Kuçlaniş"
    ],
    "desc": "Voltmetr, Ampermetr va Otsillograf bir vaqtning özida.",
    "theory": "Kompleks diagnostika: barça elektr kattaliklarini bir vaqtning özida nazorat qiliş.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_061",
    "num": 61,
    "title": "LED ning Anod va Katod Qutblari",
    "category": "diodes",
    "categoryName": "Diodlar & Yarimötkazgiçlar",
    "difficulty": "beginner",
    "difficultyName": "Boşlanğiç",
    "tags": [
      "LED",
      "Diod",
      "Yarimötkazgiç",
      "Yoruğlik",
      "Anod",
      "Katod"
    ],
    "desc": "LED ning qutblarini töğri aniqlaş va ulaş qoidalari.",
    "theory": "Anod (+) uzun oyoqça, Katod (-) kalta oyoqça va korpusida kesik böladi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_062",
    "num": 62,
    "title": "Qarama-qarşi Parallel LED lar",
    "category": "diodes",
    "categoryName": "Diodlar & Yarimötkazgiçlar",
    "difficulty": "beginner",
    "difficultyName": "Boşlanğiç",
    "tags": [
      "LED",
      "Diod",
      "Yarimötkazgiç",
      "Yoruğlik",
      "Anod",
      "Katod"
    ],
    "desc": "Qutblaniş almaşganda qizil yoki yaşil LED navbat bilan yonişi.",
    "theory": "Teskari parallel ulangan diodlar özgaruvçan tok yönalişini körsatişda işlatiladi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_063",
    "num": 63,
    "title": "Svetofor Modeli (Qizil, Sariq, Yaşil)",
    "category": "diodes",
    "categoryName": "Diodlar & Yarimötkazgiçlar",
    "difficulty": "beginner",
    "difficultyName": "Boşlanğiç",
    "tags": [
      "LED",
      "Diod",
      "Yarimötkazgiç",
      "Yoruğlik",
      "Anod",
      "Katod"
    ],
    "desc": "3 ta alohida kalit bilan boşqariladigan svetofor LED lari.",
    "theory": "Har bir rangdagi LED öz töğri kuçlanişiga ega (Qizil: 1.8V, Sariq: 2.0V, Yaşil: 2.2V).",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_064",
    "num": 64,
    "title": "Yuqori Kuçlanişli LED Himoyasi",
    "category": "diodes",
    "categoryName": "Diodlar & Yarimötkazgiçlar",
    "difficulty": "beginner",
    "difficultyName": "Boşlanğiç",
    "tags": [
      "LED",
      "Diod",
      "Yarimötkazgiç",
      "Yoruğlik",
      "Anod",
      "Katod"
    ],
    "desc": "Katta kuçlanişda LED ni saqlab qoluvçi yuqori qarşilikli rezistor.",
    "theory": "Ballast qarşiligi R = (U_manba - U_led) / I_led formulasi bilan hisoblanadi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_065",
    "num": 65,
    "title": "Bipolyar Yönaliş Indikatori",
    "category": "diodes",
    "categoryName": "Diodlar & Yarimötkazgiçlar",
    "difficulty": "beginner",
    "difficultyName": "Boşlanğiç",
    "tags": [
      "LED",
      "Diod",
      "Yarimötkazgiç",
      "Yoruğlik",
      "Anod",
      "Katod"
    ],
    "desc": "Tok manbai qutblari töğriligini körsatuvçi ikki rangli indikator.",
    "theory": "Tok bir tomonga oqsa qizil, teskari oqsa yaşil LED yonadi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_066",
    "num": 66,
    "title": "Ketma-ket 4 ta LED Zanjiri",
    "category": "diodes",
    "categoryName": "Diodlar & Yarimötkazgiçlar",
    "difficulty": "beginner",
    "difficultyName": "Boşlanğiç",
    "tags": [
      "LED",
      "Diod",
      "Yarimötkazgiç",
      "Yoruğlik",
      "Anod",
      "Katod"
    ],
    "desc": "9V manbaga 4 ta qizil LED ni ketma-ket ulaş.",
    "theory": "4 ta LED * 1.8V = 7.2V töğri tuşiş hosil qiladi, energiya samaradorligi yuqori böladi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_067",
    "num": 67,
    "title": "Kaskadli LED Indikatori",
    "category": "diodes",
    "categoryName": "Diodlar & Yarimötkazgiçlar",
    "difficulty": "beginner",
    "difficultyName": "Boşlanğiç",
    "tags": [
      "LED",
      "Diod",
      "Yarimötkazgiç",
      "Yoruğlik",
      "Anod",
      "Katod"
    ],
    "desc": "3 ta LED orqali darajani körsatiş modeli.",
    "theory": "Avtomobil panellarida va audio uskunalarda daraja körsatkiçlari şu prinsipda quriladi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_068",
    "num": 68,
    "title": "LED + Kondensator (Silliq Öçiş)",
    "category": "diodes",
    "categoryName": "Diodlar & Yarimötkazgiçlar",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "LED",
      "Diod",
      "Yarimötkazgiç",
      "Yoruğlik",
      "Anod",
      "Katod"
    ],
    "desc": "Quvvat uzilgandan söng LED ning sekin sönişi.",
    "theory": "Kondensatorda töplangan zaryad quvvat uzilgaç LED orqali asta-sekin razryadlanadi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_069",
    "num": 69,
    "title": "LED Çaqnaş Modeli",
    "category": "diodes",
    "categoryName": "Diodlar & Yarimötkazgiçlar",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "LED",
      "Diod",
      "Yarimötkazgiç",
      "Yoruğlik",
      "Anod",
      "Katod"
    ],
    "desc": "Kalitni bosib uzganda tezkor yoruğlik impulslari hosil qiliş.",
    "theory": "LED larning inertsiya vaqti juda kiçik (nanosekundlar), şuning uçun çaqnaşga tez javob beradi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_070",
    "num": 70,
    "title": "Optojuftlik (Optocoupler) Boşlanğiç Modeli",
    "category": "diodes",
    "categoryName": "Diodlar & Yarimötkazgiçlar",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "LED",
      "Diod",
      "Yarimötkazgiç",
      "Yoruğlik",
      "Anod",
      "Katod"
    ],
    "desc": "Yoruğlik orqali galvanik ajratilgan signal uzatiş asosi.",
    "theory": "Optronlar yuqori kuçlanişli zanjirlarni past kuçlanişli boşqaruvdan himoya qiladi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_071",
    "num": 71,
    "title": "Motor Çötkalari Şovqinidan Diodli Himoya",
    "category": "diodes",
    "categoryName": "Diodlar & Yarimötkazgiçlar",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "LED",
      "Diod",
      "Yarimötkazgiç",
      "Yoruğlik",
      "Anod",
      "Katod"
    ],
    "desc": "Dvigatel öçirilgandagi induktiv zarbani söndiriş.",
    "theory": "Induktiv yuklamalar öçirilganda teskari EYuK hosil qiladi va elektron qismlarni kuydirişi mumkin.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_072",
    "num": 72,
    "title": "Bir Yarim Davrli Töğrilagiç Modeli",
    "category": "diodes",
    "categoryName": "Diodlar & Yarimötkazgiçlar",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "LED",
      "Diod",
      "Yarimötkazgiç",
      "Yoruğlik",
      "Anod",
      "Katod"
    ],
    "desc": "Diodning bir tomonlama tok ötkaziş xususiyatini tekşiriş.",
    "theory": "Diod faqat musbat yarim davrni ötkazadi, manfiy yarim davrni esa tösadi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_073",
    "num": 73,
    "title": "Diod orqali Kuçlanişni 0.7V ga Pasaytiriş",
    "category": "diodes",
    "categoryName": "Diodlar & Yarimötkazgiçlar",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "LED",
      "Diod",
      "Yarimötkazgiç",
      "Yoruğlik",
      "Anod",
      "Katod"
    ],
    "desc": "Silitsiy diodi orqali kuçlaniş tuşişini hosil qiliş.",
    "theory": "Ötkazuvçan holatdagi p-n ötişda doimiy ~0.7V kuçlaniş tuşişi mavjud böladi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_074",
    "num": 74,
    "title": "Ketma-ket 3 ta Diod (2.1V Pasaytiriş)",
    "category": "diodes",
    "categoryName": "Diodlar & Yarimötkazgiçlar",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "LED",
      "Diod",
      "Yarimötkazgiç",
      "Yoruğlik",
      "Anod",
      "Katod"
    ],
    "desc": "9V manbadan 6.9V barqaror kuçlaniş hosil qiliş.",
    "theory": "Diodlar zanjiri past kuçlanişli stabilizator vazifasini bajarişi mumkin.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_075",
    "num": 75,
    "title": "LED Stroboskop Zanjiri",
    "category": "diodes",
    "categoryName": "Diodlar & Yarimötkazgiçlar",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "LED",
      "Diod",
      "Yarimötkazgiç",
      "Yoruğlik",
      "Anod",
      "Katod"
    ],
    "desc": "Tez-tez çaqnab turuvçi stroboskopik yoritiş zanjiri.",
    "theory": "Tez miltillaş orqali harakatlanuvçi mexanizmlarni vizual töxtatib köriş mumkin.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_076",
    "num": 76,
    "title": "Batareya Holati Indikatori",
    "category": "diodes",
    "categoryName": "Diodlar & Yarimötkazgiçlar",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "LED",
      "Diod",
      "Yarimötkazgiç",
      "Yoruğlik",
      "Anod",
      "Katod"
    ],
    "desc": "Batareya quvvati yetarli bölgandagina yonuvçi indikator zanjiri.",
    "theory": "Kuçlaniş ma'lum çegaradan pastga tuşganda LED öçadi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_077",
    "num": 77,
    "title": "LED Matritsasi Asosi (2x2)",
    "category": "diodes",
    "categoryName": "Diodlar & Yarimötkazgiçlar",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "LED",
      "Diod",
      "Yarimötkazgiç",
      "Yoruğlik",
      "Anod",
      "Katod"
    ],
    "desc": "Törtta LED dan iborat matritsali displey poydevori.",
    "theory": "Matritsali boşqaruv kamroq simlar bilan köp sonli piksellarni yoqiş imkonini beradi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_078",
    "num": 78,
    "title": "Qayta Ulanişdan Himoyalangan Zanjir",
    "category": "diodes",
    "categoryName": "Diodlar & Yarimötkazgiçlar",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "LED",
      "Diod",
      "Yarimötkazgiç",
      "Yoruğlik",
      "Anod",
      "Katod"
    ],
    "desc": "Batareya teskari ulansa ham kuymaydigan diodli xavfsiz zanjir.",
    "theory": "Diod batareya teskari ulanganda tokni butunlay tösib, qimmatbaho çiplarni asraydi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_079",
    "num": 79,
    "title": "LED va Buzzer Sinxron Indikatori",
    "category": "diodes",
    "categoryName": "Diodlar & Yarimötkazgiçlar",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "LED",
      "Diod",
      "Yarimötkazgiç",
      "Yoruğlik",
      "Anod",
      "Katod"
    ],
    "desc": "Bir vaqtning özida ham tovuş, ham yoruğlik signali beriş.",
    "theory": "Ogohlantiriş tizimlarida eşitiş va köriş analizatorlariga birga ta'sir qilinadi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_080",
    "num": 80,
    "title": "Yuqori Yorqinlikdagi LED Klasteri",
    "category": "diodes",
    "categoryName": "Diodlar & Yarimötkazgiçlar",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "LED",
      "Diod",
      "Yarimötkazgiç",
      "Yoruğlik",
      "Anod",
      "Katod"
    ],
    "desc": "Bir neçta LED larni klaster qilib yoritiş maydonini oşiriş.",
    "theory": "Klasterli LED modullari projektorlar va köça yoritgiçlarida keng qöllaniladi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_081",
    "num": 81,
    "title": "Oddiy Tungi Çiroq (LDR + LED)",
    "category": "sensors",
    "categoryName": "Sensorlar & Fotorezistorlar LDR",
    "difficulty": "beginner",
    "difficultyName": "Boşlanğiç",
    "tags": [
      "LDR",
      "Sensor",
      "Datçik",
      "Fotorezistor",
      "Avtomatika",
      "Yoruğlik"
    ],
    "desc": "Qoronği tuşganda fotorezistor qarşiligi ortişi va çiroqni yoqiş.",
    "theory": "Fotorezistor (LDR) yoruğlikda past (100Ω), qoronğida yuqori qarşilikka (1MΩ) ega böladi.",
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
      "2. '☀️ Kun' tugmasini bosing: LDR qarşiligi pasayadi va LED ÖÇADI.",
      "3. '🌙 Tun' tugmasini bosing: LDR qarşiligi ortadi va LED YONADI!",
      "4. Kalitni oçsangiz: çiroq qoronğida ham butunlay öçadi."
    ]
  },
  {
    "id": "tmpl_082",
    "num": 82,
    "title": "Kunduzgi Signalizatsiya (LDR + Buzzer)",
    "category": "sensors",
    "categoryName": "Sensorlar & Fotorezistorlar LDR",
    "difficulty": "beginner",
    "difficultyName": "Boşlanğiç",
    "tags": [
      "LDR",
      "Sensor",
      "Datçik",
      "Fotorezistor",
      "Avtomatika",
      "Yoruğlik"
    ],
    "desc": "Tong otganda yoki yoruğlik tuşganda signal çaluvçi zanjir.",
    "theory": "Yoruğlik tuşganda LDR qarşiligi pasayadi va buzzer orqali tok oqib signal çaladi.",
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
      "1. Kalitni bosib sxemani yoqing yoki öçiring.",
      "2. '☀️ Kun' / '🌙 Tun' tugmalari orqali LDR qarşiligini özgartiring."
    ]
  },
  {
    "id": "tmpl_083",
    "num": 83,
    "title": "LDR Kuçlaniş Böluvçi",
    "category": "sensors",
    "categoryName": "Sensorlar & Fotorezistorlar LDR",
    "difficulty": "beginner",
    "difficultyName": "Boşlanğiç",
    "tags": [
      "LDR",
      "Sensor",
      "Datçik",
      "Fotorezistor",
      "Avtomatika",
      "Yoruğlik"
    ],
    "desc": "Yoruğlik darajasiga mutanosib analog kuçlaniş oliş sxemasi.",
    "theory": "U_out = U_in * (R_pastki / (R_yuqori + R_pastki)) qoidasi böyiça yoruğlik voltga aylanadi.",
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
      "1. Kalitni bosib sxemani yoqing yoki öçiring.",
      "2. '☀️ Kun' / '🌙 Tun' tugmalari orqali LDR qarşiligini özgartiring."
    ]
  },
  {
    "id": "tmpl_084",
    "num": 84,
    "title": "Avtomatik Köça Çiroği Modeli",
    "category": "sensors",
    "categoryName": "Sensorlar & Fotorezistorlar LDR",
    "difficulty": "beginner",
    "difficultyName": "Boşlanğiç",
    "tags": [
      "LDR",
      "Sensor",
      "Datçik",
      "Fotorezistor",
      "Avtomatika",
      "Yoruğlik"
    ],
    "desc": "Şahar köça çiroqlarining avtomatik oqşomda yonişi modeli.",
    "theory": "Fotoelektr relelar quyoş botganda taşqi yoritiş tizimlarini avtomatik işga tuşiradi.",
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
      "1. Potensiometr orqali çiroq qaysi qoronğilik çegarasida yonişini sozlang.",
      "2. '☀️ Kun' va '🌙 Tun' rejimlarida avtomatika işlaşini sinang."
    ]
  },
  {
    "id": "tmpl_085",
    "num": 85,
    "title": "Lazerli Xavfsizlik Qöriqçisi",
    "category": "sensors",
    "categoryName": "Sensorlar & Fotorezistorlar LDR",
    "difficulty": "beginner",
    "difficultyName": "Boşlanğiç",
    "tags": [
      "LDR",
      "Sensor",
      "Datçik",
      "Fotorezistor",
      "Avtomatika",
      "Yoruğlik"
    ],
    "desc": "Lazer nuri tösilganda zudlik bilan signal beruvçi qöriqlaş zanjiri.",
    "theory": "Lazer nuri LDR ga tuşib turganda zanjir tinç, nurni tösiq uzişi bilanoq signal işlaydi.",
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
      "1. Lazer nuri LDR ga tuşib turganda (Kun/Yoruğ) tizim tinç.",
      "2. '🌙 Tun' tugmasini bosib nur tösilgandek qiling: bir zumda buzzer va qizil LED signal beradi!"
    ]
  },
  {
    "id": "tmpl_086",
    "num": 86,
    "title": "Soya Detektori (Qöl yaqinlaşişi)",
    "category": "sensors",
    "categoryName": "Sensorlar & Fotorezistorlar LDR",
    "difficulty": "beginner",
    "difficultyName": "Boşlanğiç",
    "tags": [
      "LDR",
      "Sensor",
      "Datçik",
      "Fotorezistor",
      "Avtomatika",
      "Yoruğlik"
    ],
    "desc": "Qöl yaqinlaşib soya tuşirganda işga tuşuvçi datçik.",
    "theory": "Ob'ektning yaqinlaşişini yoruğlik oqimining kamayişi orqali aniqlaş usuli.",
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
      "1. Kalitni bosib sxemani yoqing yoki öçiring.",
      "2. '☀️ Kun' / '🌙 Tun' tugmalari orqali LDR qarşiligini özgartiring."
    ]
  },
  {
    "id": "tmpl_087",
    "num": 87,
    "title": "Optik Ölçagiç (Lyuksmeter asosi)",
    "category": "sensors",
    "categoryName": "Sensorlar & Fotorezistorlar LDR",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "LDR",
      "Sensor",
      "Datçik",
      "Fotorezistor",
      "Avtomatika",
      "Yoruğlik"
    ],
    "desc": "Yoruğlik miqdorini multimetr orqali voltlarda ölçaş.",
    "theory": "Yoruğlik kuçi oşgan sari kuçlaniş böluvçi çiqişidagi potensial mutanosib özgaradi.",
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
      "1. Kalitni bosib sxemani yoqing yoki öçiring.",
      "2. '☀️ Kun' / '🌙 Tun' tugmalari orqali LDR qarşiligini özgartiring."
    ]
  },
  {
    "id": "tmpl_088",
    "num": 88,
    "title": "Quyoş Paneli Yönaliş Datçigi",
    "category": "sensors",
    "categoryName": "Sensorlar & Fotorezistorlar LDR",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "LDR",
      "Sensor",
      "Datçik",
      "Fotorezistor",
      "Avtomatika",
      "Yoruğlik"
    ],
    "desc": "Yoruğlik qayerdan tuşayotganini aniqlovçi datçik asosi.",
    "theory": "Ikkita fotorezistor soliştirilib, quyoşga qaragan burçak aniqlanadi.",
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
      "1. Kalitni bosib sxemani yoqing yoki öçiring.",
      "2. '☀️ Kun' / '🌙 Tun' tugmalari orqali LDR qarşiligini özgartiring."
    ]
  },
  {
    "id": "tmpl_089",
    "num": 89,
    "title": "Sezgirligi Sozlanuvçi LDR Zanjiri",
    "category": "sensors",
    "categoryName": "Sensorlar & Fotorezistorlar LDR",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "LDR",
      "Sensor",
      "Datçik",
      "Fotorezistor",
      "Avtomatika",
      "Yoruğlik"
    ],
    "desc": "Potensiometr orqali yoruğlik çegarasini erkin sozlaş.",
    "theory": "Potensiometr va LDR böluvçisi orqali har qanday xona yoruğligiga moslaşiş mumkin.",
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
      "1. Kalitni bosib sxemani yoqing yoki öçiring.",
      "2. '☀️ Kun' / '🌙 Tun' tugmalari orqali LDR qarşiligini özgartiring."
    ]
  },
  {
    "id": "tmpl_090",
    "num": 90,
    "title": "Ikkala Tomonlama Komparator Modeli",
    "category": "sensors",
    "categoryName": "Sensorlar & Fotorezistorlar LDR",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "LDR",
      "Sensor",
      "Datçik",
      "Fotorezistor",
      "Avtomatika",
      "Yoruğlik"
    ],
    "desc": "Ikki LDR orasidagi yoruğlik farqini aniqlaş.",
    "theory": "Differensial fotodatçiklar robotlarning yoruğlik manbasiga qarab yurişida qöllaniladi.",
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
      "1. Kalitni bosib sxemani yoqing yoki öçiring.",
      "2. '☀️ Kun' / '🌙 Tun' tugmalari orqali LDR qarşiligini özgartiring."
    ]
  },
  {
    "id": "tmpl_091",
    "num": 91,
    "title": "Avtomatik Oyna Pardalari Modeli",
    "category": "sensors",
    "categoryName": "Sensorlar & Fotorezistorlar LDR",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "LDR",
      "Sensor",
      "Datçik",
      "Fotorezistor",
      "Avtomatika",
      "Yoruğlik"
    ],
    "desc": "Yoruğlik kuçayganda motorni işga tuşiruvçi tizim.",
    "theory": "Quyoş nuri xonani qizdirmasligi uçun avtomatik pardalar yopiladi.",
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
      "1. Kalitni bosib sxemani yoqing yoki öçiring.",
      "2. '☀️ Kun' / '🌙 Tun' tugmalari orqali LDR qarşiligini özgartiring."
    ]
  },
  {
    "id": "tmpl_092",
    "num": 92,
    "title": "Qoronğulikda Çiroq + Buzzer",
    "category": "sensors",
    "categoryName": "Sensorlar & Fotorezistorlar LDR",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "LDR",
      "Sensor",
      "Datçik",
      "Fotorezistor",
      "Avtomatika",
      "Yoruğlik"
    ],
    "desc": "Avariya xavfsizligi: qoronği bölib qolsa ikkita signal beriş.",
    "theory": "Vizual va tovuşli ogohlantiriş avariya holatlarida işonçlilikni oşiradi.",
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
      "1. Kalitni bosib sxemani yoqing yoki öçiring.",
      "2. '☀️ Kun' / '🌙 Tun' tugmalari orqali LDR qarşiligini özgartiring."
    ]
  },
  {
    "id": "tmpl_093",
    "num": 93,
    "title": "Yoruğlik Pulsatsiyasi Kuzatuvi",
    "category": "sensors",
    "categoryName": "Sensorlar & Fotorezistorlar LDR",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "LDR",
      "Sensor",
      "Datçik",
      "Fotorezistor",
      "Avtomatika",
      "Yoruğlik"
    ],
    "desc": "Otsillografda yoruğlik özgarişini real vaqt rejimida köriş.",
    "theory": "Sun'iy çiroqlarning közga körinmas miltillaşini LDR orqali otsillografda tahlil qiliş mumkin.",
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
      "1. Kalitni bosib sxemani yoqing yoki öçiring.",
      "2. '☀️ Kun' / '🌙 Tun' tugmalari orqali LDR qarşiligini özgartiring."
    ]
  },
  {
    "id": "tmpl_094",
    "num": 94,
    "title": "Aqlli Xona Yoritiş Tizimi",
    "category": "sensors",
    "categoryName": "Sensorlar & Fotorezistorlar LDR",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "LDR",
      "Sensor",
      "Datçik",
      "Fotorezistor",
      "Avtomatika",
      "Yoruğlik"
    ],
    "desc": "Xona yoritilganligiga qarab LED larni bosqiçma-bosqiç yoqiş.",
    "theory": "Energiyani tejaş uçun tabiiy yoruğlik yetarli bölganda elektr çiroqlar öçiriladi.",
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
      "1. Kalitni bosib sxemani yoqing yoki öçiring.",
      "2. '☀️ Kun' / '🌙 Tun' tugmalari orqali LDR qarşiligini özgartiring."
    ]
  },
  {
    "id": "tmpl_095",
    "num": 95,
    "title": "Olov va Yonğin Detektori Modeli",
    "category": "sensors",
    "categoryName": "Sensorlar & Fotorezistorlar LDR",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "LDR",
      "Sensor",
      "Datçik",
      "Fotorezistor",
      "Avtomatika",
      "Yoruğlik"
    ],
    "desc": "Olov yoruğligining öziga xos çaqnaşi va intensivligini tutiş.",
    "theory": "Optik yonğin datçiklari tutun tarqalişidan avval olov nurini tezda payqaydi.",
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
      "1. Kalitni bosib sxemani yoqing yoki öçiring.",
      "2. '☀️ Kun' / '🌙 Tun' tugmalari orqali LDR qarşiligini özgartiring."
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
      "Datçik",
      "Fotorezistor",
      "Avtomatika",
      "Yoruğlik"
    ],
    "desc": "Parrak aylanganda nurning tösiliş çastotasini ölçaş.",
    "theory": "Aylanuvçi valning har bir aylanişida datçik impuls hosil qiladi.",
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
      "1. Kalitni bosib sxemani yoqing yoki öçiring.",
      "2. '☀️ Kun' / '🌙 Tun' tugmalari orqali LDR qarşiligini özgartiring."
    ]
  },
  {
    "id": "tmpl_097",
    "num": 97,
    "title": "Kunduzgi Energiyani Tejovçi Öçirgiç",
    "category": "sensors",
    "categoryName": "Sensorlar & Fotorezistorlar LDR",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "LDR",
      "Sensor",
      "Datçik",
      "Fotorezistor",
      "Avtomatika",
      "Yoruğlik"
    ],
    "desc": "Tong otişi bilan yuklamalarni öçiruvçi avtomat.",
    "theory": "Quyoş çiqqandan keyin keraksiz sarf bölayotgan elektr quvvatini uzadi.",
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
      "1. Kalitni bosib sxemani yoqing yoki öçiring.",
      "2. '☀️ Kun' / '🌙 Tun' tugmalari orqali LDR qarşiligini özgartiring."
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
      "Datçik",
      "Fotorezistor",
      "Avtomatika",
      "Yoruğlik"
    ],
    "desc": "LED nuri LDR ga tuşganda öz-özini rostlaş tajribasi.",
    "theory": "Optik teskari aloqa orqali yoruğlik intensivligini barqaror saqlaş mumkin.",
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
      "1. Kalitni bosib sxemani yoqing yoki öçiring.",
      "2. '☀️ Kun' / '🌙 Tun' tugmalari orqali LDR qarşiligini özgartiring."
    ]
  },
  {
    "id": "tmpl_099",
    "num": 99,
    "title": "Qoronğilik Darajasi Körsatkiçi",
    "category": "sensors",
    "categoryName": "Sensorlar & Fotorezistorlar LDR",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "LDR",
      "Sensor",
      "Datçik",
      "Fotorezistor",
      "Avtomatika",
      "Yoruğlik"
    ],
    "desc": "Yoruğlikka qarab 3 xil darajani indikatsiya qiliş.",
    "theory": "Yoruğ, xira va töliq qoronği zonalarni ajratib körsatiş.",
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
      "1. Kalitni bosib sxemani yoqing yoki öçiring.",
      "2. '☀️ Kun' / '🌙 Tun' tugmalari orqali LDR qarşiligini özgartiring."
    ]
  },
  {
    "id": "tmpl_100",
    "num": 100,
    "title": "Optoelektronik Xavfsizlik Tösiği",
    "category": "sensors",
    "categoryName": "Sensorlar & Fotorezistorlar LDR",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "LDR",
      "Sensor",
      "Datçik",
      "Fotorezistor",
      "Avtomatika",
      "Yoruğlik"
    ],
    "desc": "Sanoat stanoklarida xavfli hududga qöl kirsa töxtatiş.",
    "theory": "Optik tösiq uzilganda zudlik bilan dvigatelni töxtatuvçi xavfsizlik standarti.",
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
      "1. Kalitni bosib sxemani yoqing yoki öçiring.",
      "2. '☀️ Kun' / '🌙 Tun' tugmalari orqali LDR qarşiligini özgartiring."
    ]
  },
  {
    "id": "tmpl_101",
    "num": 101,
    "title": "Kondensatorning Zaryadlanişi (RC)",
    "category": "capacitors",
    "categoryName": "Kondensatorlar & RC Zanjirlar",
    "difficulty": "beginner",
    "difficultyName": "Boşlanğiç",
    "tags": [
      "Kondensator",
      "Capacitor",
      "RC",
      "Filtr",
      "Zaryad",
      "Razryad"
    ],
    "desc": "9V manbadan 1kΩ rezistor orqali 100µF kondensatorni zaryadlaş.",
    "theory": "Vaqt doimiysi τ = R * C = 1000Ω * 0.0001F = 0.1 soniya. Töliq zaryad ~5τ da erişiladi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_102",
    "num": 102,
    "title": "Kondensatorning Razryadlanişi",
    "category": "capacitors",
    "categoryName": "Kondensatorlar & RC Zanjirlar",
    "difficulty": "beginner",
    "difficultyName": "Boşlanğiç",
    "tags": [
      "Kondensator",
      "Capacitor",
      "RC",
      "Filtr",
      "Zaryad",
      "Razryad"
    ],
    "desc": "Zaryadlangan kondensator energiyasi orqali LED ni yoqiş.",
    "theory": "Kondensator öz qoplamalarida elektr maydon energiyasini W = (C * U²) / 2 saqlaydi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_103",
    "num": 103,
    "title": "Sekin Yonuvçi Çiroq Zanjiri",
    "category": "capacitors",
    "categoryName": "Kondensatorlar & RC Zanjirlar",
    "difficulty": "beginner",
    "difficultyName": "Boşlanğiç",
    "tags": [
      "Kondensator",
      "Capacitor",
      "RC",
      "Filtr",
      "Zaryad",
      "Razryad"
    ],
    "desc": "Kondensator zaryadlangani sari LED yorqinlaşib boradi.",
    "theory": "Kondensator boşida qisqa tutaşuv kabi, tölgandan söng oçiq zanjir kabi harakat qiladi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_104",
    "num": 104,
    "title": "Sekin Öçuvçi Çiroq (Fading LED)",
    "category": "capacitors",
    "categoryName": "Kondensatorlar & RC Zanjirlar",
    "difficulty": "beginner",
    "difficultyName": "Boşlanğiç",
    "tags": [
      "Kondensator",
      "Capacitor",
      "RC",
      "Filtr",
      "Zaryad",
      "Razryad"
    ],
    "desc": "Kalit uzilgaç LED ning 3-5 soniya davomida asta sönişi.",
    "theory": "Kondensator yiğilgan zaryadni LED va rezistor orqali asta-sekin böşatadi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_105",
    "num": 105,
    "title": "RC Filtr (Kuçlaniş Tekislaş)",
    "category": "capacitors",
    "categoryName": "Kondensatorlar & RC Zanjirlar",
    "difficulty": "beginner",
    "difficultyName": "Boşlanğiç",
    "tags": [
      "Kondensator",
      "Capacitor",
      "RC",
      "Filtr",
      "Zaryad",
      "Razryad"
    ],
    "desc": "Özgaruvçan pulsatsiyalarni tekislaş va şovqinni yutiş.",
    "theory": "Siğim filtrlari töğrilagiçlardan söng pulsatsiyalarni bartaraf etişda işlatiladi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_106",
    "num": 106,
    "title": "Vaqt Keçikişli Öçirgiç (Delay OFF)",
    "category": "capacitors",
    "categoryName": "Kondensatorlar & RC Zanjirlar",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "Kondensator",
      "Capacitor",
      "RC",
      "Filtr",
      "Zaryad",
      "Razryad"
    ],
    "desc": "Kalit oçilgaç ma'lum vaqt ötib yuklamaning öçişi.",
    "theory": "Avtomobil salonida eşik yopilgaç çiroqning biroz yonib turişi şu usulda qilinadi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_107",
    "num": 107,
    "title": "Vaqt Keçikişli Yoquvçi (Delay ON)",
    "category": "capacitors",
    "categoryName": "Kondensatorlar & RC Zanjirlar",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "Kondensator",
      "Capacitor",
      "RC",
      "Filtr",
      "Zaryad",
      "Razryad"
    ],
    "desc": "Kalit yopilgaç kondensator zaryadlangunça keçikib yoqiliş.",
    "theory": "Elektron uskunalarni tarmoqdagi kuçlaniş barqarorlaşgaç işga tuşirişda qöllaniladi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_108",
    "num": 108,
    "title": "Kondensatorli Sönuvçi Ovoz",
    "category": "capacitors",
    "categoryName": "Kondensatorlar & RC Zanjirlar",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "Kondensator",
      "Capacitor",
      "RC",
      "Filtr",
      "Zaryad",
      "Razryad"
    ],
    "desc": "Buzzer ovozining sekin pasayib sönib borişi.",
    "theory": "Buzzerga berilayotgan kuçlaniş kondensator razryadi bilan pasayib boradi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_109",
    "num": 109,
    "title": "Parallel Kondensatorlar (Siğimni Oşiriş)",
    "category": "capacitors",
    "categoryName": "Kondensatorlar & RC Zanjirlar",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "Kondensator",
      "Capacitor",
      "RC",
      "Filtr",
      "Zaryad",
      "Razryad"
    ],
    "desc": "2 ta 100µF kondensator parallel = 200µF umumiy siğim.",
    "theory": "Parallel ulanganda qoplamalar maydoni qöşiladi: C_umumiy = C1 + C2.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_110",
    "num": 110,
    "title": "Ketma-ket Kondensatorlar",
    "category": "capacitors",
    "categoryName": "Kondensatorlar & RC Zanjirlar",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "Kondensator",
      "Capacitor",
      "RC",
      "Filtr",
      "Zaryad",
      "Razryad"
    ],
    "desc": "2 ta 100µF kondensator ketma-ket = 50µF umumiy siğim.",
    "theory": "Ketma-ket ulanganda 1/C = 1/C1 + 1/C2. Işçi kuçlaniş esa ikki baravar ortadi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_111",
    "num": 111,
    "title": "RC Differensiallovçi Zanjir",
    "category": "capacitors",
    "categoryName": "Kondensatorlar & RC Zanjirlar",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "Kondensator",
      "Capacitor",
      "RC",
      "Filtr",
      "Zaryad",
      "Razryad"
    ],
    "desc": "Kuçlaniş sakraşlaridan qisqa ignasimon impulslar ajratib oliş.",
    "theory": "Tez özgaruvçi signallarni ajratib oliş va frontlarni detektlaşda xizmat qiladi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_112",
    "num": 112,
    "title": "RC Integrallovçi Zanjir",
    "category": "capacitors",
    "categoryName": "Kondensatorlar & RC Zanjirlar",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "Kondensator",
      "Capacitor",
      "RC",
      "Filtr",
      "Zaryad",
      "Razryad"
    ],
    "desc": "Impulslarni silliqlab uçburçaksimon şaklga keltiriş.",
    "theory": "Integrallovçi zanjir signallarni örtaça qiymatini hisoblaşda işlatiladi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_113",
    "num": 113,
    "title": "Fotoçaqnoq (Flash) Zanjiri Modeli",
    "category": "capacitors",
    "categoryName": "Kondensatorlar & RC Zanjirlar",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "Kondensator",
      "Capacitor",
      "RC",
      "Filtr",
      "Zaryad",
      "Razryad"
    ],
    "desc": "Sekin zaryadlaniş va bir lahzada kuçli razryad orqali çaqnaş.",
    "theory": "Kam quvvatli manbadan katta oniy quvvat olişning ajoyib namunasi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_114",
    "num": 114,
    "title": "Qisqa Uzilişlardan Himoya Buferi",
    "category": "capacitors",
    "categoryName": "Kondensatorlar & RC Zanjirlar",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "Kondensator",
      "Capacitor",
      "RC",
      "Filtr",
      "Zaryad",
      "Razryad"
    ],
    "desc": "Manba 0.5 soniyaga uzilsa ham yuklama öçmay turişi.",
    "theory": "Kritik mikrosxemalar va xotira elementlarini tarmoq miltillaşlaridan asraydi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_115",
    "num": 115,
    "title": "Avtomatik Boşlanğiç Reset (Power-On Reset)",
    "category": "capacitors",
    "categoryName": "Kondensatorlar & RC Zanjirlar",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "Kondensator",
      "Capacitor",
      "RC",
      "Filtr",
      "Zaryad",
      "Razryad"
    ],
    "desc": "Tizimga quvvat berilganda avtomatik reset impulsi hosil qiliş.",
    "theory": "Barça kompyuter va kontrollerlar işga tuşişida POR zanjiri zarur.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_116",
    "num": 116,
    "title": "Dvigatel Şovqinini Filtrlovçi Kondensator",
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
    "desc": "DC motor kollektori çötkalaridagi uçqun şovqinini bostiriş.",
    "theory": "Kondensator yuqori çastotali şovqinlarni töğridan-töğri GND ga tuşiradi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_117",
    "num": 117,
    "title": "Otsillografda RC Eksponentasini Kuzatiş",
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
    "desc": "Zaryadlaniş egri çiziğini vaqt öqi böyiça tahlil qiliş.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_118",
    "num": 118,
    "title": "Sozlanuvçi Keçikişli RC Zanjir",
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
    "desc": "Potensiometr orqali keçikiş vaqtini 1 dan 10 soniyagaça sozlaş.",
    "theory": "Rezistor qiymatini özgartiriş orqali vaqt doimiysi τ silliq özgartiriladi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_119",
    "num": 119,
    "title": "Ikki Bosqiçli RC Kaskad",
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
    "desc": "Ikki kaskadli filtr orqali yanada toza doimiy kuçlaniş oliş.",
    "theory": "Köp bosqiçli filtrlaş çastota tuşiş qiyaligini oşiradi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
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
    "desc": "Kondensator qoplamalarida kuçlaniş darajasini saqlaş.",
    "theory": "Zamonaviy dinamik operativ xotira (DRAM) katakçalari aynan şunday işlaydi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_121",
    "num": 121,
    "title": "NPN Tranzistor Kalit Rejimida",
    "category": "transistors",
    "categoryName": "Tranzistorlar NPN & Bipolyar",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "Tranzistor",
      "NPN",
      "Kuçaytirgiç",
      "Kalit",
      "Bipolyar",
      "2N2222"
    ],
    "desc": "Kiçik baza toki (1mA) bilan katta yuklama tokini (100mA) boşqariş.",
    "theory": "Tranzistor töyiniş rejimida kollektor-emitter ötişi deyarli 0 qarşilikka ega böladi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_122",
    "num": 122,
    "title": "Sensorli Tugma (Touch Switch)",
    "category": "transistors",
    "categoryName": "Tranzistorlar NPN & Bipolyar",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "Tranzistor",
      "NPN",
      "Kuçaytirgiç",
      "Kalit",
      "Bipolyar",
      "2N2222"
    ],
    "desc": "Inson tanasi orqali ötuvçi mikroskopik tok bilan LED ni yoqiş.",
    "theory": "Inson tanasi katta qarşilikka ega bölsa ham, tranzistor kuçaytirişi hisobiga LED yonadi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_123",
    "num": 123,
    "title": "Tranzistorli Invertor (NOT Funksiyasi)",
    "category": "transistors",
    "categoryName": "Tranzistorlar NPN & Bipolyar",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "Tranzistor",
      "NPN",
      "Kuçaytirgiç",
      "Kalit",
      "Bipolyar",
      "2N2222"
    ],
    "desc": "Bazaga signal berilganda çiqişdagi LED öçadigan zanjir.",
    "theory": "Baza toki bölganda tranzistor oçilib, çiqişni GND ga tortadi (çiqiş 0 böladi).",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_124",
    "num": 124,
    "title": "Darlington Juftligi (Super Kuçaytirgiç)",
    "category": "transistors",
    "categoryName": "Tranzistorlar NPN & Bipolyar",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "Tranzistor",
      "NPN",
      "Kuçaytirgiç",
      "Kalit",
      "Bipolyar",
      "2N2222"
    ],
    "desc": "Ikkita NPN tranzistorni ketma-ket ulab tok kuçaytiriş koeffitsientini köpaytiriş.",
    "theory": "Darlington juftligida umumiy kuçaytiriş β = β1 * β2 (100 * 100 = 10,000 baravar!).",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_125",
    "num": 125,
    "title": "Suv Sathi / Namlik Datçigi",
    "category": "transistors",
    "categoryName": "Tranzistorlar NPN & Bipolyar",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "Tranzistor",
      "NPN",
      "Kuçaytirgiç",
      "Kalit",
      "Bipolyar",
      "2N2222"
    ],
    "desc": "Suv orqali tok ötganda tranzistor oçilib LED yoki buzzerni yoqadi.",
    "theory": "Suvdagi erigan tuzlar ionlar hosil qilib tok ötkazadi va tranzistor bazasini oçadi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_126",
    "num": 126,
    "title": "Tranzistorli Avtomatik Tungi Çiroq",
    "category": "transistors",
    "categoryName": "Tranzistorlar NPN & Bipolyar",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "Tranzistor",
      "NPN",
      "Kuçaytirgiç",
      "Kalit",
      "Bipolyar",
      "2N2222"
    ],
    "desc": "LDR va tranzistor kombinatsiyasi orqali yoruğlik avtomatikasi.",
    "theory": "Qoronğida LDR qarşiligi oşadi, baza kuçlanişi kötariladi va tranzistor oçiladi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_127",
    "num": 127,
    "title": "Tranzistorli Tonggi Qönğiroq",
    "category": "transistors",
    "categoryName": "Tranzistorlar NPN & Bipolyar",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "Tranzistor",
      "NPN",
      "Kuçaytirgiç",
      "Kalit",
      "Bipolyar",
      "2N2222"
    ],
    "desc": "Yoruğlik tuşganda tranzistor oçilib signal beruvçi zanjir.",
    "theory": "LDR va rezistor örni almaştirilsa, tizim qoronğida emas, yoruğlikda işlaydi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_128",
    "num": 128,
    "title": "Tranzistorli Motor Drayveri",
    "category": "transistors",
    "categoryName": "Tranzistorlar NPN & Bipolyar",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "Tranzistor",
      "NPN",
      "Kuçaytirgiç",
      "Kalit",
      "Bipolyar",
      "2N2222"
    ],
    "desc": "Kiçik mantiqiy signal bilan quvvatli DC motorni aylantiriş.",
    "theory": "Mikrokontroller yoki sensorlar töğridan-töğri motorga tok bera olmaydi, tranzistor drayver kerak.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_129",
    "num": 129,
    "title": "Tranzistorli Vaqt Rele (Keçikiş)",
    "category": "transistors",
    "categoryName": "Tranzistorlar NPN & Bipolyar",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "Tranzistor",
      "NPN",
      "Kuçaytirgiç",
      "Kalit",
      "Bipolyar",
      "2N2222"
    ],
    "desc": "Kondensator bazada zaryadlangunça keçikib yoqiluvçi rele.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_130",
    "num": 130,
    "title": "Tranzistorli Multivibrator Asosi",
    "category": "transistors",
    "categoryName": "Tranzistorlar NPN & Bipolyar",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "Tranzistor",
      "NPN",
      "Kuçaytirgiç",
      "Kalit",
      "Bipolyar",
      "2N2222"
    ],
    "desc": "Ikkita tranzistor yordamida navbatma-navbat miltillovçi sxema.",
    "theory": "Simmetrik multivibrator taşqi generatsiyasiz öz-özidan tebranadi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_131",
    "num": 131,
    "title": "Harorat Datçigi Tranzistorli Modeli",
    "category": "transistors",
    "categoryName": "Tranzistorlar NPN & Bipolyar",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "Tranzistor",
      "NPN",
      "Kuçaytirgiç",
      "Kalit",
      "Bipolyar",
      "2N2222"
    ],
    "desc": "Harorat kötarilganda qarşilik özgarişiga sezgir zanjir.",
    "theory": "Tranzistorning baza-emitter kuçlanişi haroratga juda sezgir (-2mV/°C).",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_132",
    "num": 132,
    "title": "Tovuş Signali Boşlanğiç Kuçaytirgiçi",
    "category": "transistors",
    "categoryName": "Tranzistorlar NPN & Bipolyar",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "Tranzistor",
      "NPN",
      "Kuçaytirgiç",
      "Kalit",
      "Bipolyar",
      "2N2222"
    ],
    "desc": "Kiçik özgaruvçan signal amplitudasini oşiriş.",
    "theory": "Umumiy emitterli sxema kuçlaniş va tokni bir vaqtda kuçaytiradi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_133",
    "num": 133,
    "title": "Tranzistorli Tok Çeklovçi (Barqaror Tok)",
    "category": "transistors",
    "categoryName": "Tranzistorlar NPN & Bipolyar",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "Tranzistor",
      "NPN",
      "Kuçaytirgiç",
      "Kalit",
      "Bipolyar",
      "2N2222"
    ],
    "desc": "Yuklama qarşiligi özgarsa ham tokni bir me'yorda uşlab turuvçi zanjir.",
    "theory": "LED lar uzoq xizmat qilişi uçun doimiy kuçlaniş emas, doimiy tok talab etiladi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
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
      "Kuçaytirgiç",
      "Kalit",
      "Bipolyar",
      "2N2222"
    ],
    "desc": "Plastik taroq yoki kiyimdagi statik zaryadga ta'sirçan datçik.",
    "theory": "Darlington juftligining öta yuqori sezgirligi havodagi elektrostatik maydonni payqaydi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
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
      "Kuçaytirgiç",
      "Kalit",
      "Bipolyar",
      "2N2222"
    ],
    "desc": "Pyezo buzzer uçun tebraniş hosil qiluvçi avtogenerator.",
    "theory": "Ijobiy teskari aloqa orqali doimiy tok özgaruvçan tovuş tebranişiga aylanadi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_136",
    "num": 136,
    "title": "Tranzistorli Signalizatsiya Bloki (Latç)",
    "category": "transistors",
    "categoryName": "Tranzistorlar NPN & Bipolyar",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "Tranzistor",
      "NPN",
      "Kuçaytirgiç",
      "Kalit",
      "Bipolyar",
      "2N2222"
    ],
    "desc": "Bir marta signal berilgaç öz-özini uşlab qoluvçi elektron rele.",
    "theory": "Qöriqlaş tizimlarida datçik bir zumda uzilib qayta ulansa ham trevoga öçmay qolişi şart.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_137",
    "num": 137,
    "title": "Qisqa Tutaşuvdan Tranzistorli Himoya",
    "category": "transistors",
    "categoryName": "Tranzistorlar NPN & Bipolyar",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "Tranzistor",
      "NPN",
      "Kuçaytirgiç",
      "Kalit",
      "Bipolyar",
      "2N2222"
    ],
    "desc": "Tok me'yordan oşganda yuklamani 1 millisekundda uzuvçi himoya.",
    "theory": "Eriydigan saqlagiçlarga qaraganda elektron himoya million marta tezroq işlaydi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_138",
    "num": 138,
    "title": "Dvigatelni Silliq Töxtatiş (Soft Stop)",
    "category": "transistors",
    "categoryName": "Tranzistorlar NPN & Bipolyar",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "Tranzistor",
      "NPN",
      "Kuçaytirgiç",
      "Kalit",
      "Bipolyar",
      "2N2222"
    ],
    "desc": "Baza kondensatori orqali motorni birdan emas, sekin töxtatiş.",
    "theory": "Mexanizmlarning tişli ğildiraklari yemirilmasligi uçun silliq töxtatiş kerak.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_139",
    "num": 139,
    "title": "Dvigatelni Silliq Yurgiziş (Soft Start)",
    "category": "transistors",
    "categoryName": "Tranzistorlar NPN & Bipolyar",
    "difficulty": "advanced",
    "difficultyName": "Murakkab",
    "tags": [
      "Tranzistor",
      "NPN",
      "Kuçaytirgiç",
      "Kalit",
      "Bipolyar",
      "2N2222"
    ],
    "desc": "Baza kuçlanişining asta ösişi orqali start tokini kamaytiriş.",
    "theory": "Katta dvigatellarni işga tuşirişda tarmoqqa ortiqça zarba bermaslik usuli.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
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
      "Kuçaytirgiç",
      "Kalit",
      "Bipolyar",
      "2N2222"
    ],
    "desc": "Tranzistorlar yordamida NOR mantiqiy elementini yasaş.",
    "theory": "Birinçi avlod kompyuterlari (Apollo fazo kemasi) aynan RTL mantiqda qurilgan.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_141",
    "num": 141,
    "title": "Mantiqiy AND (VA) Elementi",
    "category": "logic",
    "categoryName": "Raqamli Mantiq Logic Gates",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "Mantiq",
      "Logic Gates",
      "AND",
      "OR",
      "XOR",
      "NOT",
      "Raqamli"
    ],
    "desc": "Faqat ikkala kiriş ham '1' bölgandagina çiqiş '1' (5V) böladi.",
    "theory": "Mantiqiy köpaytiriş amali (Y = A ∧ B). Ikkala şart bajarilişi talab qilinadi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_142",
    "num": 142,
    "title": "Mantiqiy OR (YOKI) Elementi",
    "category": "logic",
    "categoryName": "Raqamli Mantiq Logic Gates",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "Mantiq",
      "Logic Gates",
      "AND",
      "OR",
      "XOR",
      "NOT",
      "Raqamli"
    ],
    "desc": "Heç bölmaganda bitta kiriş '1' bölsa çiqiş '1' böladi.",
    "theory": "Mantiqiy qöşiş amali (Y = A ∨ B). Alternativ şartlar uçun işlatiladi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_143",
    "num": 143,
    "title": "Mantiqiy NOT (EMAS) Invertor",
    "category": "logic",
    "categoryName": "Raqamli Mantiq Logic Gates",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "Mantiq",
      "Logic Gates",
      "AND",
      "OR",
      "XOR",
      "NOT",
      "Raqamli"
    ],
    "desc": "Kiriş '1' bölsa çiqiş '0', kiriş '0' bölsa çiqiş '1'.",
    "theory": "Mantiqiy inkor amali (Y = ¬A). Signal qutbini teskarisiga özgartiradi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_144",
    "num": 144,
    "title": "Mantiqiy NAND (VA-EMAS) Elementi",
    "category": "logic",
    "categoryName": "Raqamli Mantiq Logic Gates",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "Mantiq",
      "Logic Gates",
      "AND",
      "OR",
      "XOR",
      "NOT",
      "Raqamli"
    ],
    "desc": "Universal mantiq elementi: faqat ikkala kiriş '1' bölgandagina çiqiş '0'.",
    "theory": "NAND elementidan istalgan boşqa mantiqiy elementni (AND, OR, NOT, XOR) yasaş mumkin.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_145",
    "num": 145,
    "title": "Mantiqiy NOR (YOKI-EMAS) Elementi",
    "category": "logic",
    "categoryName": "Raqamli Mantiq Logic Gates",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "Mantiq",
      "Logic Gates",
      "AND",
      "OR",
      "XOR",
      "NOT",
      "Raqamli"
    ],
    "desc": "Ikkala kiriş ham '0' bölgandagina çiqiş '1' böladi.",
    "theory": "Inkor qöşiş amali. Kosmik apparatlarning xotira va triggerlarida keng qöllanilgan.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_146",
    "num": 146,
    "title": "Mantiqiy XOR (Inkor YOKI) Elementi",
    "category": "logic",
    "categoryName": "Raqamli Mantiq Logic Gates",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "Mantiq",
      "Logic Gates",
      "AND",
      "OR",
      "XOR",
      "NOT",
      "Raqamli"
    ],
    "desc": "Kirişlar har xil bölgandagina çiqiş '1' böladi.",
    "theory": "Taqqoslaş va paritet tekşiruvida, şuningdek ikkilik arifmetikasida işlatiladi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_147",
    "num": 147,
    "title": "NAND Elementidan NOT Invertor Yasaş",
    "category": "logic",
    "categoryName": "Raqamli Mantiq Logic Gates",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "Mantiq",
      "Logic Gates",
      "AND",
      "OR",
      "XOR",
      "NOT",
      "Raqamli"
    ],
    "desc": "NAND ning ikkala kirişini birlaştirib invertor hosil qiliş.",
    "theory": "Agar A = B bölsa, NAND çiqişi ¬(A ∧ A) = ¬A ga teng böladi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_148",
    "num": 148,
    "title": "NAND Elementlaridan AND Elementi",
    "category": "logic",
    "categoryName": "Raqamli Mantiq Logic Gates",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "Mantiq",
      "Logic Gates",
      "AND",
      "OR",
      "XOR",
      "NOT",
      "Raqamli"
    ],
    "desc": "NAND çiqişiga NOT invertor ulab oddiy AND yasaş.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
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
    "desc": "Kirişlari invertlangan NAND elementi OR vazifasini bajarişi.",
    "theory": "¬(¬A ∧ ¬B) = A ∨ B. Mantiqiy ifodalarni bir xil elementlarga keltiriş usuli.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_150",
    "num": 150,
    "title": "1-Bitli Yarim Jamlagiç (Half Adder)",
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
    "desc": "Ikkita 1-bitli sonni qöşiş: Yiğindi (XOR) va Köçiriş (AND).",
    "theory": "Barça zamonaviy protsessorlarning arifmetik-mantiqiy qurilmasi (ALU) asosi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_151",
    "num": 151,
    "title": "Töliq Jamlagiç (Full Adder) Modeli",
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
    "desc": "Oldingi razryaddan köçirişni ham hisobga oluvçi 3 kirişli jamlagiç.",
    "theory": "Köp xonali sonlarni ketma-ket qöşiş uçun töliq jamlagiçlar kaskadi kerak.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_152",
    "num": 152,
    "title": "RS-Trigger (Oddiy Xotira Katakçasi)",
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
    "desc": "Set (örnatiş) va Reset (tiklaş) signallari bilan 1 bit saqlaş.",
    "theory": "Trigger bir lahzalik impulsdan keyin ham öz holatini doimiy eslab qoladi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
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
    "desc": "Takt signali kelgandagina ma'lumotni eslab qoluvçi trigger.",
    "theory": "Zamonaviy registrlar va keş xotiralar D-triggerlar asosida quriladi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_154",
    "num": 154,
    "title": "2-Kirişli Multipleksor (MUX 2:1)",
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
    "desc": "Boşqaruv signali orqali 2 ta kirişdan birini çiqişga ulaş.",
    "theory": "Raqamli ma'lumotlar oqimini kommutatsiya qiliş va kanallarni taqsimlaş qurilmasi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
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
    "desc": "Bitta kiriş signalini 2 ta yönalişdan biriga yönaltiriş.",
    "theory": "Multipleksorning teskarisi bölib, signallarni qabul qiluvçi bloklarga yöllaydi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
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
    "desc": "Ikki signalning tengligini tekşiruvçi raqamli zanjir.",
    "theory": "XNOR amali: ikkala kiriş bir xil bölsa (0-0 yoki 1-1) çiqişda '1' beradi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_157",
    "num": 157,
    "title": "Kod Özgartiruvçi (Oddiy Enkoder)",
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
    "desc": "Tugmalar bosilişini 2-bitli ikkilik kodga aylantiriş.",
    "theory": "Klaviaturalarda tugma bosilişini kompyuter tuşunadigan ikkilik kodga ötkaziş asosi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_158",
    "num": 158,
    "title": "7-Segment Displey: '1' Raqamini Çiqariş",
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
    "desc": "b va c segmentlariga yuqori kuçlaniş berib '1' raqamini yoqiş.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_159",
    "num": 159,
    "title": "7-Segment Displey: '8' Raqamini Çiqariş",
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
    "desc": "Barça 7 ta segmentni (a..g) bir vaqtda yoqiş.",
    "theory": "'8' raqami displeyning barça segmentlari töğri işlayotganini tekşiriş testi hisoblanadi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_160",
    "num": 160,
    "title": "Paritet (Juftlik) Tekşiruvi Modeli",
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
    "desc": "Ma'lumotlar uzatilişida xatolik yuz berganini XOR orqali aniqlaş.",
    "theory": "Tarmoq protokollarida va xotirada ma'lumot butunligini nazorat qiliş usuli.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_161",
    "num": 161,
    "title": "555 Standart LED Miltillatuvçi (1 Hz)",
    "category": "timer555",
    "categoryName": "NE555 Taymer & Generatorlar",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "NE555",
      "Taymer",
      "Generator",
      "PWM",
      "Multivibrator",
      "Impuls"
    ],
    "desc": "Sekundiga 1 marta öçib-yonuvçi klassik astabil generator.",
    "theory": "Çastota f = 1.44 / ((R1 + 2*R2) * C) formulasi bilan aniqlanadi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_162",
    "num": 162,
    "title": "555 Tezkor Miltillatuvçi (Stroboskop 10 Hz)",
    "category": "timer555",
    "categoryName": "NE555 Taymer & Generatorlar",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "NE555",
      "Taymer",
      "Generator",
      "PWM",
      "Multivibrator",
      "Impuls"
    ],
    "desc": "Tez çaqnovçi LED stroboskop zanjiri.",
    "theory": "Kiçikroq kondensator va rezistorlar orqali çaqnaş çastotasi oşiriladi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_163",
    "num": 163,
    "title": "555 Monostabil Rejim (5 Soniyalik Taymer)",
    "category": "timer555",
    "categoryName": "NE555 Taymer & Generatorlar",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "NE555",
      "Taymer",
      "Generator",
      "PWM",
      "Multivibrator",
      "Impuls"
    ],
    "desc": "Tugma bir marta bosilganda LED 5 soniya yonib, söng öçadi.",
    "theory": "Monostabil rejimda bitta kiriş impulsi aniq vaqtli bitta çiqiş impulsini yaratadi: T = 1.1 * R * C.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_164",
    "num": 164,
    "title": "555 Pyezo Tovuş Generatori (1 kHz)",
    "category": "timer555",
    "categoryName": "NE555 Taymer & Generatorlar",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "NE555",
      "Taymer",
      "Generator",
      "PWM",
      "Multivibrator",
      "Impuls"
    ],
    "desc": "Inson quloğiga yaxşi eşitiluvçi jarangdor akustik signal.",
    "theory": "Tovuş çastotasi pyezo elementning rezonans çastotasiga yaqinlaştiriladi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_165",
    "num": 165,
    "title": "555 Ikki Ohangli Politsiya Sirenasi",
    "category": "timer555",
    "categoryName": "NE555 Taymer & Generatorlar",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "NE555",
      "Taymer",
      "Generator",
      "PWM",
      "Multivibrator",
      "Impuls"
    ],
    "desc": "Ikki xil çastota orasida almaşinuvçi tovuş generatori.",
    "theory": "Boşqaruv pini (CV) orqali içki komparator kuçlanişi modulyatsiya qilinadi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_166",
    "num": 166,
    "title": "555 Ikki Rangli LED Almaşinuvi",
    "category": "timer555",
    "categoryName": "NE555 Taymer & Generatorlar",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "NE555",
      "Taymer",
      "Generator",
      "PWM",
      "Multivibrator",
      "Impuls"
    ],
    "desc": "Qizil va yaşil LED lar navbat bilan galma-galdan yonişi.",
    "theory": "Çiqiş 3-pini HIGH bölganda bitta LED, LOW bölganda ikkinçi LED yonadi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_167",
    "num": 167,
    "title": "555 PWM (KHM) Dvigatel Tezligi Boşqaruvi",
    "category": "timer555",
    "categoryName": "NE555 Taymer & Generatorlar",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "NE555",
      "Taymer",
      "Generator",
      "PWM",
      "Multivibrator",
      "Impuls"
    ],
    "desc": "Impuls kengligini özgartiriş orqali dvigatel quvvatini yöqotişsiz sozlaş.",
    "theory": "PWM orqali motorga töliq kuçlaniş impulslari beriladi, şuning uçun past tezlikda ham tortiş kuçi saqlanadi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_168",
    "num": 168,
    "title": "555 PWM LED Dimmer",
    "category": "timer555",
    "categoryName": "NE555 Taymer & Generatorlar",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "NE555",
      "Taymer",
      "Generator",
      "PWM",
      "Multivibrator",
      "Impuls"
    ],
    "desc": "Yoruğlikni miltillaşsiz silliq boşqariş (0..100%).",
    "theory": "Inson közi 100 Hz dan yuqori çastotali PWM ni sezmaydi va silliq yoruğlik deb qabul qiladi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
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
    "desc": "Musiqaçilar uçun bir maromda tovuş zarbalari beruvçi metronom.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_170",
    "num": 170,
    "title": "555 Yöqolgan Impuls Detektori (Watchdog)",
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
    "desc": "Signal uzilib qolsa darhol ogohlantiruvçi xavfsizlik nazoratçisi.",
    "theory": "Sanoat tizimlarida mikrokontroller muzlab qolişini aniqlaşda qöllaniladi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
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
    "desc": "Har 10 soniyada 2 soniyaga suv nasosini işga tuşiruvçi siklik rejim.",
    "theory": "Ösimliklarni tomçilatib suğoriş va akvarium filtrlari uçun tayyor avtomat.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_172",
    "num": 172,
    "title": "555 Sozlanuvçi Çastota Generatori",
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
    "desc": "Potensiometr orqali 100 Hz dan 5 kHz gaça çastotani özgartiriş.",
    "theory": "Laboratoriyalarda turli signallarni sinaş uçun örganiş stendi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_173",
    "num": 173,
    "title": "555 Ovoz Balandligi Sozlanuvçi Sirena",
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
    "desc": "Çiqişda pot va pyezo buzzer yordamida ohang va balandlikni boşqariş.",
    "theory": "Signalizatsiya tizimlarida zarur ovoz bosimini örnatiş imkoniyati.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_174",
    "num": 174,
    "title": "555 Töğri Burçakli Tölqin Generatori (50% Duty)",
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
    "desc": "Simmetrik meandr tölqini generatori.",
    "theory": "Raqamli soatlar va hisoblagiçlar uçun aniq 50% li takt impulslari.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
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
    "desc": "LDR datçigiga qöl yaqinlaşganda tovuş ohangi özgarişi.",
    "theory": "Qöl harakati bilan havodan musiqa çaluvçi maşhur fizika asbobi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
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
    "desc": "Raqamli triggerlar va registrlar uçun sinxronlaş signali.",
    "theory": "Raqamli sxemalar faqat CLK impulsi kelgandagina yangi holatga ötadi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
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
    "desc": "Katta siğim va qarşilik bilan 30 soniyalik kutiş zanjiri.",
    "theory": "Inson xonadan çiqib ketgunça çiroqni öçirmay turuvçi keçikiş.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
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
    "desc": "Dvigatelni navbat bilan oldinga va orqaga aylantiruvçi generator.",
    "theory": "Mexanik sinov stendlarida resursni tekşiriş uçun siklik harakat.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_179",
    "num": 179,
    "title": "555 Tranzistorli Quvvat Kuçaytirgiç",
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
    "desc": "555 çiqişiga quvvatli tranzistor ulab katta yuklamani boşqariş.",
    "theory": "555 IC maksimal 200mA tok bera oladi, undan katta yuklamalar uçun tranzistor şart.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_180",
    "num": 180,
    "title": "555 Avtonom Qöriqlaş Tizimi",
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
    "desc": "Datçik işga tuşganda 10 soniya sirena çalib öçuvçi signalizatsiya.",
    "theory": "Qöriqlanadigan ob'ektlar uçun tejamkor va işonçli xavfsizlik bloki.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_181",
    "num": 181,
    "title": "Arduino Standart Blink (D13)",
    "category": "arduino",
    "categoryName": "Arduino & Aqlli Tizimlar",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "Arduino",
      "Mikrokontroller",
      "C++",
      "Uno R3",
      "Aqlli tizim",
      "Dasturlaş"
    ],
    "desc": "13-pindagi örnatilgan 'L' LED ni 1 soniya oraliğida miltillatiş.",
    "theory": "Arduino dasturlaşining eng birinçi darsi: pinMode, digitalWrite va delay funksiyalari.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_182",
    "num": 182,
    "title": "Arduino Taşqi Qizil LED Boşqaruvi",
    "category": "arduino",
    "categoryName": "Arduino & Aqlli Tizimlar",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "Arduino",
      "Mikrokontroller",
      "C++",
      "Uno R3",
      "Aqlli tizim",
      "Dasturlaş"
    ],
    "desc": "8-pin orqali taşqi LED ni yoqiş va öçiriş.",
    "theory": "Taşqi komponentlar uçun tok çegaralovçi 220Ω rezistor ulanişi şart.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_183",
    "num": 183,
    "title": "Arduino Svetofor Avtomatikasi",
    "category": "arduino",
    "categoryName": "Arduino & Aqlli Tizimlar",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "Arduino",
      "Mikrokontroller",
      "C++",
      "Uno R3",
      "Aqlli tizim",
      "Dasturlaş"
    ],
    "desc": "3 ta LED (Qizil, Sariq, Yaşil) orqali töliq svetofor sikli.",
    "theory": "Haqiqiy şahar svetoforlarining vaqt algoritmlari dasturlaştiriladi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_184",
    "num": 184,
    "title": "Arduino Piyodalar Svetofori (Tugmali)",
    "category": "arduino",
    "categoryName": "Arduino & Aqlli Tizimlar",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "Arduino",
      "Mikrokontroller",
      "C++",
      "Uno R3",
      "Aqlli tizim",
      "Dasturlaş"
    ],
    "desc": "Tugma bosilgandagina avtomobillar töxtab, piyodaga yaşil çiroq yonişi.",
    "theory": "Tugma holatini digitalRead() bilan tekşirib dinamik özgariş kiritiş.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_185",
    "num": 185,
    "title": "Arduino Tugmali Kalit (Toggle Rejim)",
    "category": "arduino",
    "categoryName": "Arduino & Aqlli Tizimlar",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "Arduino",
      "Mikrokontroller",
      "C++",
      "Uno R3",
      "Aqlli tizim",
      "Dasturlaş"
    ],
    "desc": "Tugmani 1 marta bossa yonadi, yana 1 marta bossa öçadi.",
    "theory": "Holat özgaruvçisi (state toggle) orqali bitta tugma bilan 2 ta holatni boşqariş.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_186",
    "num": 186,
    "title": "Arduino Tugma Tebranişini Filtrlaş (Debounce)",
    "category": "arduino",
    "categoryName": "Arduino & Aqlli Tizimlar",
    "difficulty": "intermediate",
    "difficultyName": "Örta",
    "tags": [
      "Arduino",
      "Mikrokontroller",
      "C++",
      "Uno R3",
      "Aqlli tizim",
      "Dasturlaş"
    ],
    "desc": "Mexanik kontaktlarning şovqinini dasturiy yöl bilan tozalaş.",
    "theory": "Kontakt tebranişi notöğri bir neça marta bosiliş deb qabul qilinişini oldini oliş.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_187",
    "num": 187,
    "title": "Arduino PWM Silliq Yoniş (Fade Effect)",
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
      "Dasturlaş"
    ],
    "desc": "analogWrite() orqali LED yoruğligini nafas olişdek silliq oşiriş.",
    "theory": "PWM 0 dan 255 gaça qiymat qabul qilib, örtaça kuçlanişni 0V dan 5V gaça özgartiradi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_188",
    "num": 188,
    "title": "Arduino Potensiometr bilan Analog Öqiş (ADC)",
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
      "Dasturlaş"
    ],
    "desc": "A0 pinidan 0 dan 1023 gaça bölgan kuçlaniş qiymatini öqiş.",
    "theory": "ATmega328P ning 10-bitli analog-raqamli özgartirgiçi (ADC) 0..5V ni 1024 poğonaga böladi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
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
      "Dasturlaş"
    ],
    "desc": "map() funksiyasi orqali ADC (0..1023) ni PWM (0..255) ga ötkaziş.",
    "theory": "Qölda boşqariladigan silliq mikrokontrollerli dimmer.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_190",
    "num": 190,
    "title": "Arduino LDR Aqlli Tungi Çiroq",
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
      "Dasturlaş"
    ],
    "desc": "Qoronği tuşganda avtomatik yonuvçi mikrokontrollerli köça çiroği.",
    "theory": "LDR datçigi öqilib, çegara qiymatidan (masalan, 500) past bölsa LED yoqiladi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_191",
    "num": 191,
    "title": "Arduino LDR Yoruğlik Darajasini Ölçaş",
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
      "Dasturlaş"
    ],
    "desc": "Yoruğlik miqdorini Serial Monitorga foizlarda çiqariş.",
    "theory": "Serial.print() orqali datçik ma'lumotlarini kompyuterga uzatiş.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
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
      "Dasturlaş"
    ],
    "desc": "tone() funksiyasi yordamida musiqiy notalarni çaliş.",
    "theory": "Har bir musiqa notasi (Do, Re, Mi...) öz çastotasiga (Hz) ega bölib, tone() bilan çiqariladi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
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
      "Dasturlaş"
    ],
    "desc": "Ikki xil çastotani navbat bilan çiqaruvçi akustik sirenasi.",
    "theory": "Favqulodda xizmatlar transporti uçun ogohlantiruvçi signal.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_194",
    "num": 194,
    "title": "Arduino DC Motor Boşqaruvi (Tranzistor orqali)",
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
      "Dasturlaş"
    ],
    "desc": "D9 pini orqali tranzistorni oçib dvigatelni yoqiş.",
    "theory": "Arduino pinlari maksimal 40mA tok bera oladi, şuning uçun motorlar tranzistor orqali boşqariladi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_195",
    "num": 195,
    "title": "Arduino PWM Motor Tezligini Sozlaş",
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
      "Dasturlaş"
    ],
    "desc": "Potensiometr burilganda dvigatelning silliq tezlaşişi.",
    "theory": "Sanoat konveyerlari va robot ğildiraklari tezligini boşqariş standarti.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_196",
    "num": 196,
    "title": "Arduino 7-Segment Hisoblagiç (0 dan 9 gaça)",
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
      "Dasturlaş"
    ],
    "desc": "D2..D8 pinlari orqali raqamlarni birma-bir sanaş.",
    "theory": "Binar massivlar va bitli mantiq orqali 7 ta segmentni sinxron boşqariş.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
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
      "Dasturlaş"
    ],
    "desc": "Nur tösilganda uzluksiz qizil çiroq va sirena beruvçi qöriqçi.",
    "theory": "Bir vaqtning özida sensor, vizual indikator va tovuşni uyğun boşqariş.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_198",
    "num": 198,
    "title": "Arduino Start / Stop Ikki Tugmali Boşqaruv",
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
      "Dasturlaş"
    ],
    "desc": "1-tugma yoqadi, 2-tugma öçiradi (Sanoat standarti).",
    "theory": "Xavfsizlik talablariga köra yoqiş va öçiriş har doim alohida jismoniy tugmalar bilan böladi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  },
  {
    "id": "tmpl_199",
    "num": 199,
    "title": "Arduino Qayta Sanaş Taymeri (Countdown)",
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
      "Dasturlaş"
    ],
    "desc": "Belgilangan vaqt tugagaç pyezo signal beruvçi taymer.",
    "theory": "Oşxona taymerlari va jarayon nazoratçilarining işlaş mexanizmi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
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
      "Dasturlaş"
    ],
    "desc": "Yoritiş, datçik, motor va indikator birgalikda işlovçi boşqaruv markazi.",
    "theory": "Barça örganilgan sensorlar va ijro mexanizmlarining yagona aqlli tizimga birlaşişi.",
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
      "Multimetr yoki otsillograf yordamida parametrlarini tekşiring."
    ]
  }
];

// Category definitions with icons and counts
const CIRCUIT_CATEGORIES = [
  { id: "all", name: "Barçasi", icon: "⚡", count: 200 },
  { id: "basic", name: "Boşlanğiç & Asosiy", icon: "💡", count: 20 },
  { id: "laws", name: "Ulaniş Usullari & Qonunlar", icon: "📐", count: 20 },
  { id: "measuring", name: "Ölçov & Diagnostika", icon: "📟", count: 20 },
  { id: "diodes", name: "Diodlar & Yarimötkazgiçlar", icon: "🔴", count: 20 },
  { id: "sensors", name: "Sensorlar & LDR", icon: "☀️", count: 20 },
  { id: "capacitors", name: "Kondensatorlar & RC", icon: "🔋", count: 20 },
  { id: "transistors", name: "Tranzistorlar NPN", icon: "🔀", count: 20 },
  { id: "logic", name: "Raqamli Mantiq (Gates)", icon: "🔲", count: 20 },
  { id: "timer555", name: "NE555 Generatorlar", icon: "⏱️", count: 20 },
  { id: "arduino", name: "Arduino & Aqlli Tizimlar", icon: "🤖", count: 20 }
];

window.CIRCUIT_TEMPLATES = CIRCUIT_TEMPLATES;
window.CIRCUIT_CATEGORIES = CIRCUIT_CATEGORIES;
