/* ==========================================================================
   HARDWARE ATTRIBUTES DATABASE (Kompyuter Qismlari, Sxemalar va Atributlari)
   ATT-25 To‘liq Apparat Laboratoriyasi
   ========================================================================== */
const HARDWARE_DATA = {
  cpu: {
    name: "Markaziy Protsessor (CPU)",
    type: "Intel Core i9-13900K / Socket 370 & LGA Gibrid",
    status: "FAOL • 4.2 GHz Boost • 1.15V VCore",
    desc: "Kompyuterning arifmetik va mantiqiy markazi. Dasturiy buyruqlarni dekodlaydi, L1/L2/L3 keş xotiraga ega, içki xotira nazoratçisi (IMC) va PCIe magistralini boşqaradi.",
    schematic: "CPU Core ↔ [L1/L2/L3 Keş] ↔ IMC Xotira Nazoratçisi ↔ Dual-Çannel RAM\nVRM 12V ➔ DrMOS ➔ [1.15V VCore] ➔ CPU Kremniy Kristali\nCPU ↔ [PCIe / AGP Magistral] ➔ Kengaytma Kartalari",
    specs: [
      {k:"Yadrolar / Oqimlar:", v:"24 Yadro (8P + 16E) / 32 Oqim"},
      {k:"Baza / Boost Takt:", v:"3.0 GHz / 5.8 GHz"},
      {k:"L3 Keş Xotira:", v:"36 MB Smart Cache"},
      {k:"TDP Issiqlik Paketi:", v:"125 W (Max Turbo 253 W)"},
      {k:"Soket Turi:", v:"LGA / ZIF Köp Pinli Soket"},
      {k:"Soket Dastagi:", v:"Pölat bosuvçi qulf mexanizmi (Lever)"},
      {k:"Işlab Çiqariş:", v:"10nm SuperFin / FinFET"}
    ]
  },
  cooler: {
    name: "CPU Sovutiş Tizimi (Pin-Fin Kuler)",
    type: "Massiv Qora Ignasimon Radiator + PWM Ventilyator",
    status: "AYLANMOQDA • 1850 RPM • 26 dBA",
    desc: "Protsessor ustiga bevosita örnatiladigan 121 ta (11x11) vertikal ignali qovurğalardan iborat massiv pin-fin radiatori va uni sovituvçi faol ventilyator.",
    schematic: "CPU IHS ➔ Termopasta ➔ Mis Asos ➔ 121 ta Pin-Fin Qovurğalar ➔ Faol Havo Oqimi",
    specs: [
      {k:"Radiator Turi:", v:"Extruded Aluminum Pin-Fin Array"},
      {k:"Qovurğalar Soni:", v:"121 ta mustaqil vertikal ignalar"},
      {k:"Ventilyator:", v:"80mm PWM soket sovutgiçi"},
      {k:"Aylaniş Tezligi:", v:"1200 - 2400 RPM (Avtomatik)"},
      {k:"Issiqlik Tarqatiş:", v:"TDP 150W gaça samarali"},
      {k:"Mahkamlaş:", v:"4 nuqtali prujinali klameralar"}
    ]
  },
  rom: {
    name: "Doimiy Xotira (ROM / BIOS & CMOS)",
    type: "SPI Flash ROM + NVRAM CMOS + Zaxira Dual-BIOS",
    status: "BARQAROR • UEFI / Legacy BIOS v2.4",
    desc: "Kompyuter yoqilganda eng birinçi işga tuşuvçi dasturiy ta'minot (Firmware). POST (Power-On Self-Test) tekşiruvini ötkazadi, apparat qismlarini initsializatsiya qiladi va OT ni yuklaydi.",
    schematic: "Quvvat Yoqilişi ➔ Reset Vector ➔ [Winbond SPI Flash ROM] ➔ POST Tekşiruvi ➔ CMOS Sozlamalar ➔ Boot Loader (SSD/HDD)",
    specs: [
      {k:"Asosiy BIOS Çipi:", v:"Winbond 25Q128 (128M-bit / 16MB SPI Flash)"},
      {k:"Zaxira BIOS:", v:"Dual-BIOS (Favqulodda tiklaş çipi)"},
      {k:"CMOS Batareyasi:", v:"CR2032 3V Litiy tanga batareya (NVRAM ta'minoti)"},
      {k:"Clear CMOS Jumper:", v:"CLRTC 3-pinli qayta tiklaş jumperi"},
      {k:"Korpus Turi:", v:"8-pinli SOIC-8 / DIP-8 rozetkali"},
      {k:"Vazifasi:", v:"POST tekşiruvi, boot boşqaruvi, fan profillari"}
    ]
  },
  ssd: {
    name: "Saqlaş Tizimi (M.2 NVMe SSD & SATA)",
    type: "M.2 2280 PCIe Gen4 x4 NVMe & 4x SATA 6Gb/s",
    status: "TAYYOR • 7300 MB/s Öqiş • 6800 MB/s Yoziş",
    desc: "Operatsion tizim va darslik materiallarini ultra-yuqori tezlikda yuklovçi M.2 2280 fleş xotira moduli hamda taşqi disklar uçun 4 ta SATA 6Gb/s portlari.",
    schematic: "CPU PCIe x4 Liniyasi ↔ NVMe 1.4 Protokoli ↔ Phison Kontroller ↔ 3D TLC NAND\nPCH Chipset ↔ 4x SATA 6Gb/s ↔ Qattiq Disk / SSD / ODD",
    specs: [
      {k:"M.2 Standarti:", v:"M.2 2280 (M-Key PCIe 4.0 x4)"},
      {k:"Fleş Xotira:", v:"3D TLC NAND (176 qatlamli kristallar)"},
      {k:"Kontroller:", v:"Phison PS5018-E18 8-kanalli"},
      {k:"DRAM Keş:", v:"2GB DDR4 Tezkor Keş"},
      {k:"Radiator:", v:"Alyuminiy M.2 Şield Frozr + Termal prokladka"},
      {k:"SATA Portlari:", v:"4x SATA 6Gb/s L-şaklli qulflanuvçi"}
    ]
  },
  ram: {
    name: "Operativ Xotira (Dual-Çannel RAM)",
    type: "4x DIMM Slotlari (2 Moviy, 2 Qora) + DDR Modullari",
    status: "FAOL • Dual-Çannel 128-bit • 6400 MT/s",
    desc: "Protsessorga ma'lumotlarni keçikişlarsiz uzatuvçi operativ xotira. Rangli slotlar (Moviy va Qora) ikki kanalli rejimda ötkaziş qobiliyatini 2 barobarga oşiradi.",
    schematic: "CPU IMC ➔ Kanal A (Slot 1-Moviy, Slot 2-Qora) & Kanal B (Slot 3-Moviy, Slot 4-Qora) ➔ BGA DRAM Çiplari",
    specs: [
      {k:"Slotlar Soni:", v:"4 ta 288-pinli DIMM (2 Moviy, 2 Qora)"},
      {k:"Arxitektura:", v:"Dual-Çannel 128-bit Interleaved"},
      {k:"Örnatilgan Xotira:", v:"32 GB (2x 16GB Modullar)"},
      {k:"BGA Çiplar:", v:"Har bir modulda 16 ta DRAM kristallari"},
      {k:"Fiksatorlar:", v:"Ikki tomonlama oq plastik qisqiçlar (Latçes)"},
      {k:"SPD Çipi:", v:"8-pinli konfiguratsiya EEPROM çipi"}
    ]
  },
  gpu: {
    name: "Kengaytma Slotalari (AGP / PCIe & PCI)",
    type: "1x AGP/PCIe x16 + 3x 32-bit PCI Sloti + 2 ta Karta",
    status: "ULANGAN • Videokarta & Ovoz/Tarmoq Kartasi Faol",
    desc: "Tizim imkoniyatlarini kengaytiruvçi magistral slotalar. Töq jigar rangli tezyurar slotga videokarta, oq PCI slotlariga esa tovuş yoki tarmoq kartalari ulanadi.",
    schematic: "CPU / Chipset ↔ [AGP 8X / PCIe x16] ↔ Videokarta (GPU)\nChipset ↔ [32-bit 33MHz PCI Şina] ↔ Ovoz & Tarmoq Kartalari",
    specs: [
      {k:"Grafik Slot:", v:"1x AGP 8X / PCIe x16 töq jigar rangli slot"},
      {k:"PCI Slotalari:", v:"3x Klassik oq 32-bitli PCI slotalari (Key tösiqli)"},
      {k:"Örnatilgan Karta 1:", v:"Baland yaşil videokarta (Radiator, çiplar va orqa qavs)"},
      {k:"Örnatilgan Karta 2:", v:"Yaşil PCI kengaytma platasi (Ovoz/Tarmoq kartasi)"},
      {k:"Moviy Radiatorlar:", v:"Pastki öng burçakdagi 4 ta havorang alyuminiy sovutgiç"},
      {k:"Slot Qulfi:", v:"Prujinali plastik mahkamlagiç"}
    ]
  },
  vrm: {
    name: "VRM Quvvat Zanjiri & Kondensatorlar",
    type: "Köp Fazali Digital PWM + Elektrolitik Kondensatorlar",
    status: "BARQAROR • 12V DC ➔ 1.15V VCore",
    desc: "Protsessor va tizim elementlarini toza, barqaror elektr quvvati bilan ta'minlovçi köp fazali impulsli kuçlaniş stabilizatori, rangli kondensatorlar va toroid ğaltaklar.",
    schematic: "+12V Kiriş ➔ Kiriş Kondensatorlari ➔ DrMOS Tranzistorlar ➔ Ferrit Drossellar & Toroid Coils ➔ Çiqiş Kondensatorlari ➔ CPU VCore",
    specs: [
      {k:"Fazalar Soni:", v:"16 + 1 + 1 Digital Power Stages"},
      {k:"Kondensatorlar:", v:"Magenta (binafşa), yaşil va moviy elektrolitik silindrlar"},
      {k:"Toroid Ğaltaklar:", v:"Dumaloq ferrit halqali mis simli drossellar"},
      {k:"Drossellar:", v:"R22 / R15 germetik ferrit drossellar"},
      {k:"Xavfsizlik:", v:"Kumuş qopqoqdagi krestsimon portlaşdan himoya öyiqlari"},
      {k:"Samaradorlik:", v:"94.5% energiya tejamkorligi"}
    ]
  },
  io: {
    name: "Orqa Fizik Portlar Klasteri (I/O Connectors)",
    type: "Standart Taşqi Interfeyslar Paneli",
    status: "ULANGAN • PS/2, LPT, COM, VGA, USB, LAN, Audio",
    desc: "Taşqi periferik qurilmalarni kompyuterga ulaş uçun möljallangan fizik portlar: klaviatura/siçqonça (PS/2), printer (LPT 25-pin), ketma-ket aloqa (COM 9-pin), monitor (VGA 15-pin), tarmoq kabeli (RJ-45) va 3.5mm audio razyomlar.",
    schematic: "Taşqi Qurilmalar ➔ Fizik Portlar ➔ ESD Himoya Diodlari ➔ Super I/O (ITE IT8712F) & Chipset ➔ CPU",
    specs: [
      {k:"PS/2 Portlar:", v:"2x Mini-DIN 6-pin (Yaşil siçqonça, Binafşa klaviatura)"},
      {k:"LPT Printer:", v:"1x DB-25 Parallel Port (Puşti IEEE 1284)"},
      {k:"COM Serial:", v:"1x RS-232 DB-9 Ketma-ket Port (Moviy D-Sub)"},
      {k:"Video Çiqiş:", v:"1x VGA D-Sub 15-pin Analog Video (Kök)"},
      {k:"USB Portlar:", v:"4x USB 2.0 / 3.0 Type-A metall korpusli"},
      {k:"Tarmoq (LAN):", v:"1x RJ-45 8-pinli prujinali kontaktlar + Dual LED"},
      {k:"Audio Uyalar:", v:"3x 3.5mm (Havorang Line-In, Yaşil Line-Out, Puşti Mic)"}
    ]
  },
  power: {
    name: "Platadagi Fizik Ulagiçlar & Boşqaruv",
    type: "ATX Quvvat, IDE, Floppy, DIP Switch & Super I/O",
    status: "BARQAROR • 12V, 5V, 3.3V Liniyalari Faol",
    desc: "Platadagi içki fizik portlar: 24-pinli sarğiş-oq ATX quvvat rozetkasi, 40-pinli kök IDE şleyf headeri, 34-pinli qora Floppy porti, qizil 4-pozitsiyali DIP kaliti va ITE Super I/O kontrolleri.",
    schematic: "Blok Pitaniya ➔ 24-Pin ATX Rozetkasi ➔ Şinalar ➔ VRM & Slotalar\nIDE 40-Pin ↔ [Lenta Şleyf Kabeli] ↔ Qattiq Disk / CD-ROM",
    specs: [
      {k:"Asosiy Quvvat:", v:"24-pin ATX Cream/Beige yon qulfli rozetka"},
      {k:"IDE Porti:", v:"1x 40-pinli kök plastik devorli (Key notç bilan)"},
      {k:"Floppy Porti:", v:"1x 34-pinli qora şleyf konnektori"},
      {k:"DIP Switch:", v:"4-pozitsiyali qizil mikrouzgiçlar bloki"},
      {k:"Super I/O Chip:", v:"ITE IT8712F (128-pinli QFP kontroller)"},
      {k:"Kuler Headerlari:", v:"3x Oq rangli 3-pin / 4-pin fiksatorli razyomlar"}
    ]
  },
  chipset: {
    name: "Chipset Northbridge & Kuler",
    type: "Host Bridge & Xotira/Grafika Nazoratçisi",
    status: "BARQAROR • Faol Kuler Aylanmoqda",
    desc: "Protsessorni operativ xotira va AGP/PCIe grafik magistrali bilan boğlovçi tezyurar şimoliy köprik. Özining qora radiatori va faol aylanuvçi ventilyatoriga ega.",
    schematic: "CPU FSB ↔ [Northbridge Chipset] ↔ Dual-Çannel RAM & AGP/PCIe Karta\nNorthbridge ↔ [Içki Şina] ↔ Southbridge / PÇ",
    specs: [
      {k:"Vazifasi:", v:"CPU, RAM va Video karta örtasidagi boş kommutator"},
      {k:"Sovutiş:", v:"Qora törtburçak alyuminiy kuler + Mini fan"},
      {k:"Şina Tezligi:", v:"800 MHz FSB / Yuqori ötkazuvçanlik"},
      {k:"Joylaşuvi:", v:"CPU va RAM slotlari örtasida markazda"}
    ]
  },
  logic: {
    name: "Raqamli Mantiqiy Elementlar (ALU & Gates)",
    type: "Tranzistorli Mantiqiy Zanjirlar Sxemasi",
    status: "SIMULYATSIYA • AND, OR, NOT, XOR, Half-Adder",
    desc: "Protsessor içidagi har qanday arifmetik qöşiş, ayiriş yoki taqqoslaş amali millionlab mantiqiy elementlar (ventillar) kaskadi orqali amalga oşiriladi.",
    schematic: "Kiriş A, B ➔ [XOR Ventili (Yiğindi S)] & [AND Ventili (Köçiriş C)] ➔ Yarim Qöşgiç (Half Adder)",
    specs: [
      {k:"Asosiy Elementlar:", v:"AND, OR, NOT, NAND, NOR, XOR"},
      {k:"Arifmetik Blok:", v:"ALU (Arithmetic Logic Unit)"},
      {k:"Yarim Qöşgiç:", v:"Sum = A ⊕ B, Carry = A • B"},
      {k:"ATT-25 Darsligi:", v:"Kompyuter Sxemotexnikasi 3-modul"}
    ]
  }
};

/* Test / Quiz Savollar Bazasi (Bilimni tekshirish) */
const HARDWARE_QUIZ = [
  {
    q: "Ona platadagi ROM (Read-Only Memory) çipida qanday dasturiy ta'minot saqlanadi?",
    options: [
      "Operatsion tizim (Windows/Linux fayllari)",
      "BIOS / UEFI firmware (POST tekşiruvi va boşlanğiç yuklaş kodi)",
      "Faqat foydalanuvçining şaxsiy rasmlari",
      "Kulerning aylaniş tezligi keş xotirasi"
    ],
    correct: 1,
    exp: "ROM (masalan, Winbond SPI Flash) çipida kompyuterning eng muhim bazaviy dasturi — BIOS/UEFI saqlanadi va elektr uzilganda ham öçib ketmaydi."
  },
  {
    q: "M.2 NVMe SSD qattiq disk (HDD) yoki oddiy SATA SSD dan nima bilan ustun turadi?",
    options: [
      "Kattaroq oğirligi va köproq qizişi bilan",
      "Töğridan-töğri protsessorning tezyurar PCIe liniyalariga ulanib, 7000+ MB/s tezlik berişi bilan",
      "Faqat 5400 RPM tezlikda aylanişi bilan",
      "Maxsus lentali şleyf kabel talab qilişi bilan"
    ],
    correct: 1,
    exp: "M.2 NVMe drayverlari SATA çeklovlaridan (600 MB/s) xalos bölib, töğridan-töğri PCIe liniyalari orqali bir neça gigabayt/sekund tezlikka erişadi."
  },
  {
    q: "Ona platadagi CR2032 batareyasining asosiy vazifasi nima?",
    options: [
      "Butun kompyuterni elektr quvvati bilan ta'minlaş",
      "Kompyuter öçiq bölganda CMOS xotira (sana, vaqt, BIOS sozlamalari)ni saqlab turiş",
      "Protsessorni sovutiş",
      "Monitor ekranini yoqiş"
    ],
    correct: 1,
    exp: "CR2032 3V batareyasi kompyuter elektr tarmoğidan uzilganda ham real vaqt soati (RTC) va CMOS sozlamalari öçmasligini ta'minlaydi."
  },
  {
    q: "Nima sababdan RAM slotlari ona platada ikki xil rangda (masalan, Moviy va Qora) böladi?",
    options: [
      "Faqat çiroyli dizayn uçun",
      "Dual-Çannel (ikki kanalli) rejimni töğri örnatiş va ötkaziş tezligini 2 barobarga oşiriş uçun",
      "Biriga faqat öyinlar, ikkinçisiga faqat fayllar yozilişi uçun",
      "Har xil kuçlanişdagi modullarni farqlaş uçun"
    ],
    correct: 1,
    exp: "Xotira modullarini bir xil rangdagi slotlarga (masalan, 1 va 3 - Moviy) örnatiş orqali Dual-Çannel rejimi yoqiladi va şina kengligi 64-bitdan 128-bitga çiqadi."
  },
  {
    q: "Protsessordagi ALU (Arifmetik-Mantiqiy Qurilma)ning asosiy vazifasi nima?",
    options: [
      "Faqat ma'lumotlarni qattiq diskda saqlaş",
      "Arifmetik amallarni qöşiş, ayiriş va mantiqiy (AND, OR, XOR) soliştirişlarni bajariş",
      "Ona plataga elektr quvvatini taqsimlaş",
      "Monitor ekraniga tasvirni çiqariş"
    ],
    correct: 1,
    exp: "ALU (Arithmetic Logic Unit) protsessorning matematik yuragi bölib, barça arifmetik va mantiqiy hisoblaşlarni bajaradi."
  }
];
