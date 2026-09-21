/* ==========================================================================
   HARDWARE ATTRIBUTES DATABASE (Kompyuter Qismlari, Sxemalar va Atributlari)
   ATT-25 To‘liq Apparat Laboratoriyasi
   ========================================================================== */
const HARDWARE_DATA = {
  cpu: {
    name: "Markaziy Protsessor (CPU)",
    type: "Intel Core i9-13900K / Socket 370 & LGA Gibrid",
    status: "FAOL • 4.2 GHz Boost • 1.15V VCore",
    desc: "Kompyuterning arifmetik va mantiqiy markazi. Dasturiy buyruqlarni dekodlaydi, L1/L2/L3 kesh xotiraga ega, ichki xotira nazoratchisi (IMC) va PCIe magistralini boshqaradi.",
    schematic: "CPU Core ↔ [L1/L2/L3 Kesh] ↔ IMC Xotira Nazoratchisi ↔ Dual-Channel RAM\nVRM 12V ➔ DrMOS ➔ [1.15V VCore] ➔ CPU Kremniy Kristali\nCPU ↔ [PCIe / AGP Magistral] ➔ Kengaytma Kartalari",
    specs: [
      {k:"Yadrolar / Oqimlar:", v:"24 Yadro (8P + 16E) / 32 Oqim"},
      {k:"Baza / Boost Takt:", v:"3.0 GHz / 5.8 GHz"},
      {k:"L3 Kesh Xotira:", v:"36 MB Smart Cache"},
      {k:"TDP Issiqlik Paketi:", v:"125 W (Max Turbo 253 W)"},
      {k:"Soket Turi:", v:"LGA / ZIF Ko‘p Pinli Soket"},
      {k:"Soket Dastagi:", v:"Po‘lat bosuvchi qulf mexanizmi (Lever)"},
      {k:"Ishlab Chiqarish:", v:"10nm SuperFin / FinFET"}
    ]
  },
  cooler: {
    name: "CPU Sovutish Tizimi (Pin-Fin Kuler)",
    type: "Massiv Qora Ignasimon Radiator + PWM Ventilyator",
    status: "AYLANMOQDA • 1850 RPM • 26 dBA",
    desc: "Protsessor ustiga bevosita o‘rnatiladigan 121 ta (11x11) vertikal ignali qovurg‘alardan iborat massiv pin-fin radiatori va uni sovituvchi faol ventilyator.",
    schematic: "CPU IHS ➔ Termopasta ➔ Mis Asos ➔ 121 ta Pin-Fin Qovurg‘alar ➔ Faol Havo Oqimi",
    specs: [
      {k:"Radiator Turi:", v:"Extruded Aluminum Pin-Fin Array"},
      {k:"Qovurg‘alar Soni:", v:"121 ta mustaqil vertikal ignalar"},
      {k:"Ventilyator:", v:"80mm PWM soket sovutgichi"},
      {k:"Aylanish Tezligi:", v:"1200 - 2400 RPM (Avtomatik)"},
      {k:"Issiqlik Tarqatish:", v:"TDP 150W gacha samarali"},
      {k:"Mahkamlash:", v:"4 nuqtali prujinali klameralar"}
    ]
  },
  rom: {
    name: "Doimiy Xotira (ROM / BIOS & CMOS)",
    type: "SPI Flash ROM + NVRAM CMOS + Zaxira Dual-BIOS",
    status: "BARQAROR • UEFI / Legacy BIOS v2.4",
    desc: "Kompyuter yoqilganda eng birinchi ishga tushuvchi dasturiy ta'minot (Firmware). POST (Power-On Self-Test) tekshiruvini o‘tkazadi, apparat qismlarini initsializatsiya qiladi va OT ni yuklaydi.",
    schematic: "Quvvat Yoqilishi ➔ Reset Vector ➔ [Winbond SPI Flash ROM] ➔ POST Tekshiruvi ➔ CMOS Sozlamalar ➔ Boot Loader (SSD/HDD)",
    specs: [
      {k:"Asosiy BIOS Chipi:", v:"Winbond 25Q128 (128M-bit / 16MB SPI Flash)"},
      {k:"Zaxira BIOS:", v:"Dual-BIOS (Favqulodda tiklash chipi)"},
      {k:"CMOS Batareyasi:", v:"CR2032 3V Litiy tanga batareya (NVRAM ta'minoti)"},
      {k:"Clear CMOS Jumper:", v:"CLRTC 3-pinli qayta tiklash jumperi"},
      {k:"Korpus Turi:", v:"8-pinli SOIC-8 / DIP-8 rozetkali"},
      {k:"Vazifasi:", v:"POST tekshiruvi, boot boshqaruvi, fan profillari"}
    ]
  },
  ssd: {
    name: "Saqlash Tizimi (M.2 NVMe SSD & SATA)",
    type: "M.2 2280 PCIe Gen4 x4 NVMe & 4x SATA 6Gb/s",
    status: "TAYYOR • 7300 MB/s O‘qish • 6800 MB/s Yozish",
    desc: "Operatsion tizim va darslik materiallarini ultra-yuqori tezlikda yuklovchi M.2 2280 flesh xotira moduli hamda tashqi disklar uchun 4 ta SATA 6Gb/s portlari.",
    schematic: "CPU PCIe x4 Liniyasi ↔ NVMe 1.4 Protokoli ↔ Phison Kontroller ↔ 3D TLC NAND\nPCH Chipset ↔ 4x SATA 6Gb/s ↔ Qattiq Disk / SSD / ODD",
    specs: [
      {k:"M.2 Standarti:", v:"M.2 2280 (M-Key PCIe 4.0 x4)"},
      {k:"Flesh Xotira:", v:"3D TLC NAND (176 qatlamli kristallar)"},
      {k:"Kontroller:", v:"Phison PS5018-E18 8-kanalli"},
      {k:"DRAM Kesh:", v:"2GB DDR4 Tezkor Kesh"},
      {k:"Radiator:", v:"Alyuminiy M.2 Shield Frozr + Termal prokladka"},
      {k:"SATA Portlari:", v:"4x SATA 6Gb/s L-shaklli qulflanuvchi"}
    ]
  },
  ram: {
    name: "Operativ Xotira (Dual-Channel RAM)",
    type: "4x DIMM Slotlari (2 Moviy, 2 Qora) + DDR Modullari",
    status: "FAOL • Dual-Channel 128-bit • 6400 MT/s",
    desc: "Protsessorga ma'lumotlarni kechikishlarsiz uzatuvchi operativ xotira. Rangli slotlar (Moviy va Qora) ikki kanalli rejimda o‘tkazish qobiliyatini 2 barobarga oshiradi.",
    schematic: "CPU IMC ➔ Kanal A (Slot 1-Moviy, Slot 2-Qora) & Kanal B (Slot 3-Moviy, Slot 4-Qora) ➔ BGA DRAM Chiplari",
    specs: [
      {k:"Slotlar Soni:", v:"4 ta 288-pinli DIMM (2 Moviy, 2 Qora)"},
      {k:"Arxitektura:", v:"Dual-Channel 128-bit Interleaved"},
      {k:"O‘rnatilgan Xotira:", v:"32 GB (2x 16GB Modullar)"},
      {k:"BGA Chiplar:", v:"Har bir modulda 16 ta DRAM kristallari"},
      {k:"Fiksatorlar:", v:"Ikki tomonlama oq plastik qisqichlar (Latches)"},
      {k:"SPD Chipi:", v:"8-pinli konfiguratsiya EEPROM chipi"}
    ]
  },
  gpu: {
    name: "Kengaytma Slotalari (AGP / PCIe & PCI)",
    type: "1x AGP/PCIe x16 + 3x 32-bit PCI Sloti + 2 ta Karta",
    status: "ULANGAN • Videokarta & Ovoz/Tarmoq Kartasi Faol",
    desc: "Tizim imkoniyatlarini kengaytiruvchi magistral slotalar. To‘q jigar rangli tezyurar slotga videokarta, oq PCI slotlariga esa tovush yoki tarmoq kartalari ulanadi.",
    schematic: "CPU / Chipset ↔ [AGP 8X / PCIe x16] ↔ Videokarta (GPU)\nChipset ↔ [32-bit 33MHz PCI Shina] ↔ Ovoz & Tarmoq Kartalari",
    specs: [
      {k:"Grafik Slot:", v:"1x AGP 8X / PCIe x16 to‘q jigar rangli slot"},
      {k:"PCI Slotalari:", v:"3x Klassik oq 32-bitli PCI slotalari (Key to‘siqli)"},
      {k:"O‘rnatilgan Karta 1:", v:"Baland yashil videokarta (Radiator, chiplar va orqa qavs)"},
      {k:"O‘rnatilgan Karta 2:", v:"Yashil PCI kengaytma platasi (Ovoz/Tarmoq kartasi)"},
      {k:"Moviy Radiatorlar:", v:"Pastki o‘ng burchakdagi 4 ta havorang alyuminiy sovutgich"},
      {k:"Slot Qulfi:", v:"Prujinali plastik mahkamlagich"}
    ]
  },
  vrm: {
    name: "VRM Quvvat Zanjiri & Kondensatorlar",
    type: "Ko‘p Fazali Digital PWM + Elektrolitik Kondensatorlar",
    status: "BARQAROR • 12V DC ➔ 1.15V VCore",
    desc: "Protsessor va tizim elementlarini toza, barqaror elektr quvvati bilan ta'minlovchi ko‘p fazali impulsli kuchlanish stabilizatori, rangli kondensatorlar va toroid g‘altaklar.",
    schematic: "+12V Kirish ➔ Kirish Kondensatorlari ➔ DrMOS Tranzistorlar ➔ Ferrit Drossellar & Toroid Coils ➔ Chiqish Kondensatorlari ➔ CPU VCore",
    specs: [
      {k:"Fazalar Soni:", v:"16 + 1 + 1 Digital Power Stages"},
      {k:"Kondensatorlar:", v:"Magenta (binafsha), yashil va moviy elektrolitik silindrlar"},
      {k:"Toroid G‘altaklar:", v:"Dumaloq ferrit halqali mis simli drossellar"},
      {k:"Drossellar:", v:"R22 / R15 germetik ferrit drossellar"},
      {k:"Xavfsizlik:", v:"Kumush qopqoqdagi krestsimon portlashdan himoya o‘yiqlari"},
      {k:"Samaradorlik:", v:"94.5% energiya tejamkorligi"}
    ]
  },
  io: {
    name: "Orqa Fizik Portlar Klasteri (I/O Connectors)",
    type: "Standart Tashqi Interfeyslar Paneli",
    status: "ULANGAN • PS/2, LPT, COM, VGA, USB, LAN, Audio",
    desc: "Tashqi periferik qurilmalarni kompyuterga ulash uchun mo‘ljallangan fizik portlar: klaviatura/sichqoncha (PS/2), printer (LPT 25-pin), ketma-ket aloqa (COM 9-pin), monitor (VGA 15-pin), tarmoq kabeli (RJ-45) va 3.5mm audio razyomlar.",
    schematic: "Tashqi Qurilmalar ➔ Fizik Portlar ➔ ESD Himoya Diodlari ➔ Super I/O (ITE IT8712F) & Chipset ➔ CPU",
    specs: [
      {k:"PS/2 Portlar:", v:"2x Mini-DIN 6-pin (Yashil sichqoncha, Binafsha klaviatura)"},
      {k:"LPT Printer:", v:"1x DB-25 Parallel Port (Pushti IEEE 1284)"},
      {k:"COM Serial:", v:"1x RS-232 DB-9 Ketma-ket Port (Moviy D-Sub)"},
      {k:"Video Chiqish:", v:"1x VGA D-Sub 15-pin Analog Video (Ko‘k)"},
      {k:"USB Portlar:", v:"4x USB 2.0 / 3.0 Type-A metall korpusli"},
      {k:"Tarmoq (LAN):", v:"1x RJ-45 8-pinli prujinali kontaktlar + Dual LED"},
      {k:"Audio Uyalar:", v:"3x 3.5mm (Havorang Line-In, Yashil Line-Out, Pushti Mic)"}
    ]
  },
  power: {
    name: "Platadagi Fizik Ulagichlar & Boshqaruv",
    type: "ATX Quvvat, IDE, Floppy, DIP Switch & Super I/O",
    status: "BARQAROR • 12V, 5V, 3.3V Liniyalari Faol",
    desc: "Platadagi ichki fizik portlar: 24-pinli sarg‘ish-oq ATX quvvat rozetkasi, 40-pinli ko‘k IDE shleyf headeri, 34-pinli qora Floppy porti, qizil 4-pozitsiyali DIP kaliti va ITE Super I/O kontrolleri.",
    schematic: "Blok Pitaniya ➔ 24-Pin ATX Rozetkasi ➔ Shinalar ➔ VRM & Slotalar\nIDE 40-Pin ↔ [Lenta Shleyf Kabeli] ↔ Qattiq Disk / CD-ROM",
    specs: [
      {k:"Asosiy Quvvat:", v:"24-pin ATX Cream/Beige yon qulfli rozetka"},
      {k:"IDE Porti:", v:"1x 40-pinli ko‘k plastik devorli (Key notch bilan)"},
      {k:"Floppy Porti:", v:"1x 34-pinli qora shleyf konnektori"},
      {k:"DIP Switch:", v:"4-pozitsiyali qizil mikrouzgichlar bloki"},
      {k:"Super I/O Chip:", v:"ITE IT8712F (128-pinli QFP kontroller)"},
      {k:"Kuler Headerlari:", v:"3x Oq rangli 3-pin / 4-pin fiksatorli razyomlar"}
    ]
  },
  chipset: {
    name: "Chipset Northbridge & Kuler",
    type: "Host Bridge & Xotira/Grafika Nazoratchisi",
    status: "BARQAROR • Faol Kuler Aylanmoqda",
    desc: "Protsessorni operativ xotira va AGP/PCIe grafik magistrali bilan bog‘lovchi tezyurar shimoliy ko‘prik. O‘zining qora radiatori va faol aylanuvchi ventilyatoriga ega.",
    schematic: "CPU FSB ↔ [Northbridge Chipset] ↔ Dual-Channel RAM & AGP/PCIe Karta\nNorthbridge ↔ [Ichki Shina] ↔ Southbridge / PCH",
    specs: [
      {k:"Vazifasi:", v:"CPU, RAM va Video karta o‘rtasidagi bosh kommutator"},
      {k:"Sovutish:", v:"Qora to‘rtburchak alyuminiy kuler + Mini fan"},
      {k:"Shina Tezligi:", v:"800 MHz FSB / Yuqori o‘tkazuvchanlik"},
      {k:"Joylashuvi:", v:"CPU va RAM slotlari o‘rtasida markazda"}
    ]
  },
  logic: {
    name: "Raqamli Mantiqiy Elementlar (ALU & Gates)",
    type: "Tranzistorli Mantiqiy Zanjirlar Sxemasi",
    status: "SIMULYATSIYA • AND, OR, NOT, XOR, Half-Adder",
    desc: "Protsessor ichidagi har qanday arifmetik qo‘shish, ayirish yoki taqqoslash amali millionlab mantiqiy elementlar (ventillar) kaskadi orqali amalga oshiriladi.",
    schematic: "Kirish A, B ➔ [XOR Ventili (Yig‘indi S)] & [AND Ventili (Ko‘chirish C)] ➔ Yarim Qo‘shgich (Half Adder)",
    specs: [
      {k:"Asosiy Elementlar:", v:"AND, OR, NOT, NAND, NOR, XOR"},
      {k:"Arifmetik Blok:", v:"ALU (Arithmetic Logic Unit)"},
      {k:"Yarim Qo‘shgich:", v:"Sum = A ⊕ B, Carry = A • B"},
      {k:"ATT-25 Darsligi:", v:"Kompyuter Sxemotexnikasi 3-modul"}
    ]
  }
};

/* Test / Quiz Savollar Bazasi (Bilimni tekshirish) */
const HARDWARE_QUIZ = [
  {
    q: "Ona platadagi ROM (Read-Only Memory) chipida qanday dasturiy ta'minot saqlanadi?",
    options: [
      "Operatsion tizim (Windows/Linux fayllari)",
      "BIOS / UEFI firmware (POST tekshiruvi va boshlang‘ich yuklash kodi)",
      "Faqat foydalanuvchining shaxsiy rasmlari",
      "Kulerning aylanish tezligi kesh xotirasi"
    ],
    correct: 1,
    exp: "ROM (masalan, Winbond SPI Flash) chipida kompyuterning eng muhim bazaviy dasturi — BIOS/UEFI saqlanadi va elektr uzilganda ham o‘chib ketmaydi."
  },
  {
    q: "M.2 NVMe SSD qattiq disk (HDD) yoki oddiy SATA SSD dan nima bilan ustun turadi?",
    options: [
      "Kattaroq og‘irligi va ko‘proq qizishi bilan",
      "To‘g‘ridan-to‘g‘ri protsessorning tezyurar PCIe liniyalariga ulanib, 7000+ MB/s tezlik berishi bilan",
      "Faqat 5400 RPM tezlikda aylanishi bilan",
      "Maxsus lentali shleyf kabel talab qilishi bilan"
    ],
    correct: 1,
    exp: "M.2 NVMe drayverlari SATA cheklovlaridan (600 MB/s) xalos bo‘lib, to‘g‘ridan-to‘g‘ri PCIe liniyalari orqali bir necha gigabayt/sekund tezlikka erishadi."
  },
  {
    q: "Ona platadagi CR2032 batareyasining asosiy vazifasi nima?",
    options: [
      "Butun kompyuterni elektr quvvati bilan ta'minlash",
      "Kompyuter o‘chiq bo‘lganda CMOS xotira (sana, vaqt, BIOS sozlamalari)ni saqlab turish",
      "Protsessorni sovutish",
      "Monitor ekranini yoqish"
    ],
    correct: 1,
    exp: "CR2032 3V batareyasi kompyuter elektr tarmog‘idan uzilganda ham real vaqt soati (RTC) va CMOS sozlamalari o‘chmasligini ta'minlaydi."
  },
  {
    q: "Nima sababdan RAM slotlari ona platada ikki xil rangda (masalan, Moviy va Qora) bo‘ladi?",
    options: [
      "Faqat chiroyli dizayn uchun",
      "Dual-Channel (ikki kanalli) rejimni to‘g‘ri o‘rnatish va o‘tkazish tezligini 2 barobarga oshirish uchun",
      "Biriga faqat o‘yinlar, ikkinchisiga faqat fayllar yozilishi uchun",
      "Har xil kuchlanishdagi modullarni farqlash uchun"
    ],
    correct: 1,
    exp: "Xotira modullarini bir xil rangdagi slotlarga (masalan, 1 va 3 - Moviy) o‘rnatish orqali Dual-Channel rejimi yoqiladi va shina kengligi 64-bitdan 128-bitga chiqadi."
  },
  {
    q: "Protsessordagi ALU (Arifmetik-Mantiqiy Qurilma)ning asosiy vazifasi nima?",
    options: [
      "Faqat ma'lumotlarni qattiq diskda saqlash",
      "Arifmetik amallarni qo‘shish, ayirish va mantiqiy (AND, OR, XOR) solishtirishlarni bajarish",
      "Ona plataga elektr quvvatini taqsimlash",
      "Monitor ekraniga tasvirni chiqarish"
    ],
    correct: 1,
    exp: "ALU (Arithmetic Logic Unit) protsessorning matematik yuragi bo‘lib, barcha arifmetik va mantiqiy hisoblashlarni bajaradi."
  }
];
