/* ==========================================================================
   HARDWARE ATTRIBUTES DATABASE (Kompyuter Qismlari va Atributlari)
   ========================================================================== */
const HARDWARE_DATA = {
  cpu: {
    name: "Markaziy Protsessor (CPU)",
    type: "LGA 1700 / X86-64 Micro-Arxitektura",
    status: "FAOL • 4.2 GHz Boost • 1.15V",
    desc: "Kompyuterning miyasi. Dasturiy buyruqlarni dekodlaydi, arifmetik-mantiqiy hisoblashlarni (ALU) bajaradi va xotira boshqaruvchisiga (IMC) ega.",
    schematic: "CPU Core ↔ [L1/L2/L3 Kesh] ↔ IMC Xotira Nazoratchisi ↔ DDR5 Shina\nVRM 12V ➔ PWM ➔ [1.15V VCore] ➔ CPU Kremniy Kristali",
    specs: [
      {k:"Yadrolar / Oqimlar:", v:"16 Yadro (8P + 8E) / 24 Oqim"},
      {k:"Baza / Boost Takt:", v:"3.4 GHz / 5.4 GHz"},
      {k:"L3 Kesh Xotira:", v:"30 MB Smart Cache"},
      {k:"TDP Issiqlik Paketi:", v:"125 W (Max Turbo 253 W)"},
      {k:"Ishchi Harorat:", v:"48 °C (Norma)"},
      {k:"Ishlab Chiqarish:", v:"Intel 7 (10nm SuperFin)"}
    ]
  },
  vrm: {
    name: "VRM Quvvat Zanjiri (Voltage Regulator)",
    type: "16+1+1 Fazali Digital PWM Sxemasi",
    status: "BARQAROR • 12V DC ➔ 1.15V VCore",
    desc: "Quvvat manbaidan keluvchi 12V kuchlanishni protsessor kristali talab qiladigan ultra-toza 0.8V - 1.3V oraliqdagi kuchlanishga tushirib beruvchi ko‘p fazali sxema.",
    schematic: "+12V Kirish ➔ Kirish Kondensatorlari ➔ High/Low MOSFET ➔ Ferrit Drossel (0.22uH) ➔ Chiqish Polimer Kondensatorlari ➔ CPU VCore",
    specs: [
      {k:"Fazalar Soni:", v:"16 + 1 + 1 Digital DrMOS"},
      {k:"Har bir Faza Sig‘imi:", v:"90A Smart Power Stage"},
      {k:"PWM Nazoratchi:", v:"Renesas Digital RAA229"},
      {k:"Sovutish Radiatori:", v:"Ikkitalik qalin alyuminiy fin"},
      {k:"F.I.K (Samaradorlik):", v:"94.2% energiya tejamkorligi"},
      {k:"VRM Harorati:", v:"52 °C"}
    ]
  },
  ram: {
    name: "DDR5 Tezkor Xotira (RAM)",
    type: "Dual-Channel 128-bit Xotira Shinalari",
    status: "FAOL • 6400 MT/s • CL32 1.35V",
    desc: "Protsessorga soniyasiga o‘nlab gigabayt ma'lumotlarni kechikishlarsiz yetkazib beruvchi yuqori tezlikdagi dinamik xotira (On-Die ECC xatolik to‘g‘rilash bilan).",
    schematic: "CPU IMC ➔ 2x 32-bit Sub-Channel A/B ➔ SPD Hub ➔ PMIC Quvvat ➔ 8x BGA Xotira Kristallari (16GB Modul)",
    specs: [
      {k:"Jami Sig‘im:", v:"32 GB (2x 16GB Dual Kit)"},
      {k:"O‘tkazish Qobiliyati:", v:"102.4 GB/s (Nazariy)"},
      {k:"Takt Chastotasi:", v:"6400 MHz (XMP 3.0)"},
      {k:"Tayminglar:", v:"CL32-39-39-102"},
      {k:"Kuchlanish:", v:"1.35 V (Ichki PMIC orqali)"},
      {k:"RGB Yoritish:", v:"Sinxron dasturiy nazorat"}
    ]
  },
  gpu: {
    name: "PCIe 5.0 x16 Slot & GPU Shina",
    type: "Magistral Video Interfeysi (High Bandwidth)",
    status: "ULANGAN • PCIe 5.0 x16 (64 GB/s)",
    desc: "Grafik kartani to‘g‘ridan-to‘g‘ri protsessorning 16 ta PCIe 5.0 liniyasiga ulovchi, po‘lat bilan mustahkamlangan ultra-tezkor kengaytmali slot.",
    schematic: "CPU PCIe Controller ↔ [16 Differential Pairs Tx/Rx] ↔ PCIe 5.0 Slot ↔ GPU VRAM & Shaders",
    specs: [
      {k:"Interfeys Standarti:", v:"PCI Express 5.0"},
      {k:"Liniyalar Soni:", v:"x16 Full Speed"},
      {k:"Ikki Tomonlama Tezlik:", v:"63.0 GB/s o‘tkazish"},
      {k:"Slot Himoyasi:", v:"Steel Armor metall korpus"},
      {k:"Signallash Kengligi:", v:"32 GT/s har bir liniya"},
      {k:"Quvvat Ta'minoti:", v:"Slotdan 75W gacha"}
    ]
  },
  ssd: {
    name: "M.2 NVMe PCIe 4.0 SSD",
    type: "To‘g‘ridan-to‘g‘ri Flesh Xotira Arxitekturasi",
    status: "TAYYOR • 7300 MB/s O‘qish",
    desc: "Operatsion tizim va darslik materiallarini sekundning ulushida yuklovchi 3D TLC NAND xotira, termal alyuminiy radiator bilan himoyalangan.",
    schematic: "CPU PCIe x4 Liniyasi ↔ NVMe 1.4 Protokoli ↔ 8-Kanalli Kontroller ↔ 3D NAND Flesh Bloki",
    specs: [
      {k:"Interfeys:", v:"M.2 2280 (NVMe PCIe 4.0 x4)"},
      {k:"Ketma-ket O‘qish:", v:"7300 MB/s"},
      {k:"Ketma-ket Yozish:", v:"6800 MB/s"},
      {k:"IOPS Tasodifiy Tezlik:", v:"1,000,000 IOPS"},
      {k:"Sovutgich:", v:"Qalin M.2 Shield Frozr"},
      {k:"Ishonchlilik (TBW):", v:"1200 Terabayt"}
    ]
  },
  chipset: {
    name: "Chipset PCH (Janubiy Ko‘prik)",
    type: "Platform Controller Hub (I/O Master)",
    status: "BARQAROR • DMI 4.0 x8 Aloqa",
    desc: "Barcha tashqi kiritish-chiqarish qurilmalari: USB portlar, tarmoq kartasi (LAN), Wi-Fi moduli, audio kodek va SATA disklarni birlashtiruvchi markaziy kommutator.",
    schematic: "CPU ↔ [DMI 4.0 x8: 15.75 GB/s] ↔ PCH Chipset ➔ USB 3.2, 2.5G LAN, Realtek ALC1220 Audio",
    specs: [
      {k:"Bog‘lanish Shinası:", v:"DMI 4.0 (PCIe 4.0 x8 ekvivalenti)"},
      {k:"PCIe Liniyalar:", v:"20 ta qo‘shimcha PCIe 4.0"},
      {k:"USB Portlar Sig‘imi:", v:"10x USB 3.2 Gen 2x2 (20Gbps)"},
      {k:"Tarmoq Kontrolleri:", v:"Intel 2.5 Gbps Ethernet"},
      {k:"Audio Kodek:", v:"7.1 HD Audio DAC"},
      {k:"TDP Quvvat:", v:"6 W"}
    ]
  },
  logic: {
    name: "Raqamli Mantiqiy Elementlar (ALU & Gates)",
    type: "Tranzistorli Mantiqiy Zanjirlar Sxemasi",
    status: "SIMULYATSIYA • AND, OR, NOT, XOR, Flip-Flop",
    desc: "Protsessor ichidagi har qanday arifmetik qo‘shish, ayirish yoki taqqoslash amali millionlab mantiqiy elementlar (ventillar) kaskadi orqali amalga oshiriladi.",
    schematic: "Kirish A, B ➔ [XOR Ventili (Yig‘indi)] & [AND Ventili (Ko‘chirish)] ➔ Yarim Qo‘shgich (Half Adder)",
    specs: [
      {k:"Asosiy Elementlar:", v:"AND, OR, NOT, NAND, NOR, XOR"},
      {k:"Ventil Tranzistorlari:", v:"CMOS (P-MOS va N-MOS juftligi)"},
      {k:"Kommutatsiya Vaqti:", v:"15 pikosekund (ps)"},
      {k:"Arifmetik Blok:", v:"ALU (Arithmetic Logic Unit)"},
      {k:"Ro‘yxat Registrlari:", v:"D-Flip-Flop triggers"},
      {k:"ATT-25 Darsligi:", v:"Sxemotexnika 3-modul"}
    ]
  }
};
