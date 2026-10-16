/**
 * ATT-25 TALABALAR PORTALI - KO'P TILLILIK TIZIMI (i18n)
 * Qollab-quvvatlanadigan tillar: O'zbek tili (uz) & Türkmen dili (tm)
 */

const ATT25_I18N = {
  uz: {
    // Top Bar
    "topbar.lab_status": "LAB STATUS: 100% ONLINE",
    "topbar.group": "GURUH: ATT-25-23A",
    "topbar.semester": "SEMESTR: KUZGI 2026",
    "topbar.search": "QIDIRUV",
    "topbar.settings": "SOZLAMALAR",
    "topbar.lang": "TIL",

    // Brand
    "brand.title": "ATT-25",
    "brand.subtitle": "Talabalar Portali",
    "brand.crest_title": "ATT-25 Kiber-Emblemasi",

    // Navigation
    "nav.home": "Bosh Sahifa",
    "nav.simulators": "Simulyatorlar",
    "nav.simulators_badge": "5 IN 1",
    "nav.aiboard": "🤖 AI Doska",
    "nav.aiboard_badge": "YANGI",
    "nav.curriculum": "Dastur",
    "nav.slides": "Slaydlar",
    "nav.media": "Media",
    "nav.news": "Yangiliklar",
    "nav.articles": "Maqolalar",
    "nav.resources": "Manbalar",
    "nav.sim_center_btn": "Simulyatorlar ↗",

    // Hero 3D LAN Topologiya Card
    "hero.badge": "Asosiy Amaliy Vosita • 3D LAN",
    "hero.title": "3D Interaktiv LAN & Topologiya Simulyatori",
    "hero.desc": "Uch o‘lchamli fazoda router, modem, server va kompyuterlarni real vaqtda joylashtiring, kabellarni ulang va axborot paketlarining rangli trafigini kuzating.",
    "hero.stat_devices": "7 XIL",
    "hero.stat_devices_lbl": "Qurilma Turi",
    "hero.stat_physics": "REAL-TIME",
    "hero.stat_physics_lbl": "Fizika & Paketlar",
    "hero.stat_hybrid": "ETHERNET / WI-FI",
    "hero.stat_hybrid_lbl": "Gibrid Ulanish",
    "hero.cta_main": "Simulyatorlar Markaziga Kirish",
    "hero.cta_aidoska": "🤖 AI Doska ↗",
    "hero.cta_lan": "🌐 3D LAN Topologiya ↗",
    "hero.cta_hardware": "⚡ 3D Sxemalar ↗",

    // Simulators Promo Banner
    "sim_promo.badge": "Yagona Amaliy Bo‘lim • 5-in-1 Laboratoriya",
    "sim_promo.title": "ATT-25 Simulyatorlar Markazi",
    "sim_promo.desc": "Barcha 3D tarmoq topologiyalari, kompyuter apparat sxemalari (CPU/VRM/DDR5/ALU), IP Subnet kalkulyatori, jonli Ping terminali va OSI 7 qatlamli model bitta yagona interaktiv bo‘limda jamlandi.",
    "sim_promo.cta": "Simulyatorlar Markaziga Kirish ↗",

    // AI Doska Promo Banner
    "ai_promo.badge": "YANGI BO‘LIM • SUN'IY INTELLEKT ILG'OR MAYDONI",
    "ai_promo.title": "🤖 AI Doska — Interaktiv Aqlli Maydon",
    "ai_promo.desc": "Cheksiz vektorli doska, erkin qalam va geometrik shakllar, rangli stikerlar, tarmoq qurilmalari sxemalari hamda Sun'iy Intellekt (AI) yordamchisi. Birgina buyruq (prompt) bilan professional diagramma va aqliy hujum (mindmap) generatsiya qiling!",
    "ai_promo.chip1": "🪄 Matndan Diagramma Generatori",
    "ai_promo.chip2": "🧠 Aqliy Hujum (Mindmap)",
    "ai_promo.chip3": "🌐 Tarmoq Topologiyasi Stikerlari",
    "ai_promo.chip4": "📝 Doskani Avtomatik Tahlil & Konspekt",
    "ai_promo.chip5": "💾 PNG, SVG va JSON Eksport",
    "ai_promo.cta": "AI Doskaga O‘tish ↗",

    // Curriculum (O'quv Dasturi)
    "curr.pretitle": "HEMIS Akademik O‘quv Rejasi • ATT-25-23a",
    "curr.title": "O‘quv Dasturi & Fan Modullari",
    "curr.filter_all": "Barchasi",
    "curr.filter_c1": "1-kurs",
    "curr.filter_c2": "2-kurs",
    "curr.filter_c3": "3-kurs",
    "curr.filter_c4": "4-kurs",
    "curr.mandatory": "Majburiy",
    "curr.elective": "Tanlov",
    "curr.credits": "Kredit",
    "curr.hours": "soat",
    "curr.btn_syllabus": "Silabus & Mavzular",
    "curr.btn_hemis": "HEMIS Tizimi ↗",

    // Presentations (Slaydlar)
    "slides.pretitle": "Ma'ruzalar va Amaliy Taqdimotlar",
    "slides.title": "O‘quv Taqdimotlari & Slaydlar",
    "slides.filter_all": "Barchasi",
    "slides.filter_net": "Tarmoq",
    "slides.filter_arch": "Arxitektura",
    "slides.filter_db": "Ma'lumotlar Bazasi",
    "slides.filter_sec": "Xavfsizlik",
    "slides.btn_view": "Ko‘rish",
    "slides.btn_download": "Yuklab Olish",

    // Media Hub
    "media.pretitle": "Amaliyot va Dars Jarayonlari",
    "media.title": "Video & Foto Laboratoriya",
    "media.filter_all": "Barchasi",
    "media.filter_fiber": "Optik Tolali Liniyalar",
    "media.filter_equip": "Tarmoq Uskunalari",
    "media.filter_arch": "Kompyuter Arxitekturasi",
    "media.filter_cabling": "Kabel Tizimlari",
    "media.btn_watch": "Tomosha Qilish",

    // News
    "news.pretitle": "Eng So‘nggi E'lonlar va Ma'lumotlar",
    "news.title": "Yangiliklar & Bildirishnomalar",
    "news.read_more": "To‘liq Yangilikni O‘qish →",

    // Articles
    "articles.pretitle": "Talabalar va O‘qituvchilar Tadqiqotlari",
    "articles.title": "Ilmiy & Texnik Maqolalar",
    "articles.btn_read": "Maqolani O‘qish →",

    // Resources
    "res.pretitle": "Foydali Resurslar & Havolalar",
    "res.title": "Manbalar & Elektron Kutubxona",
    "res.open_btn": "Manbani Ochish ↗",

    // Footer
    "footer.mission": "Axborot tizimlari va texnologiyalari (ATT-25-23a) yo‘nalishi talabalari uchun amaliy ko‘nikmalar, 3D simulyatsiyalar, HEMIS o‘quv rejasi va zamonaviy ta'lim resurslari platformasi.",
    "footer.quick_links": "Tezkor Havolalar",
    "footer.study_sections": "O‘quv Bo‘limlari",
    "footer.contacts_title": "Aloqa & Kafedra",
    "footer.lbl_group": "Guruh:",
    "footer.lbl_dept": "Kafedra:",
    "footer.lbl_admin": "Admin:",
    "footer.lbl_phone": "Telefon:",
    "footer.dept_name": "Axborot texnologiyalari",
    "footer.simulators": "Simulyatorlar",
    "footer.platforms": "Hamkor Platformalar",
    "footer.contacts": "Bog‘lanish & Manzil",
    "footer.address": "O‘zbekiston, Samarqand shahri, TATU Samarqand filiali, ATT kafedrasi",
    "footer.copy": "© 2026 ATT-25 Yo‘nalishi.",
    "footer.founder": "JUMAMYRADOV BATYR",

    // Settings Modal
    "settings.modal_title": "Portal Sozlamalari & Ranglar Palitrasi",
    "settings.lang_badge": "🌐 INTERFEYS TILI / DILI",
    "settings.lang_title": "Portal Tilini Tanlang / Dili Saýlaň",
    "settings.lang_desc": "O‘zbek tili va Türkmen dili o‘rtasida tezkor almashtirish",
    "settings.themes_badge": "🎨 RANGLAR & MAVZULAR (7 TA PALITRA)",
    "settings.themes_title": "Kiber-Texnik Mavzuni Tanlang",
    "settings.themes_desc": "Tungi kiber-neon, klassik terminal, yumshoq och yashil va yuqori kontrastli kunduzgi oq fon",
    "settings.btn_reset": "↺ Standartga qaytarish",
    "settings.extra_badge": "⚙️ QO‘SHIMCHA SOZLAMALAR",
    "settings.contrast_title": "Ultra-Kontrastli Rejim",
    "settings.contrast_desc": "Yorqinlik va elementlar chegarasini maksimal darajada kuchaytirish",
    "settings.font_title": "Kattaroq Shrift",
    "settings.font_desc": "Matnlarni o‘qishni osonlashtirish uchun kattalashtirish",
    "settings.anim_title": "Animatsiyalarni Kamaytirish",
    "settings.anim_desc": "Zaif qurilmalar uchun fon va kiber effektlarni pasaytirish",

    // Search Modal
    "search.modal_title": "ATT-25 Global Qidiruv Tizimi",
    "search.placeholder": "Mavzu, fan, simulyator yoki maqolani qidiring...",
    "search.quick_tags": "Ommabop:",
    "search.close_hint": "Yopish uchun [ESC]",

    // Simulator Center Specific
    "hub.center_title": "ATT-25 SIMULYATORLAR",
    "hub.center_subtitle": "Talabalar Portali • Yagona 3D Laboratoriya Markazi",
    "hub.tab_lan": "🌐 3D LAN Topologiya",
    "hub.tab_hardware": "⚡ 3D Hardware Sxemalari",
    "hub.tab_circuit": "📐 Circuit Lab (Sxema)",
    "hub.tab_powergrid": "⚡ Smart Grid (GES ➔ Uy)",
    "hub.tab_subnet": "🔢 Subnet Kalkulyator",
    "hub.tab_ping": "💻 Jonli Ping Terminali",
    "hub.tab_osi": "📶 OSI 7 Qatlam Modeli",
    "hub.fullscreen": "To‘liq Ekran",
    "hub.back_portal": "Talabalar Portali ↗",

    // AI Doska Specific
    "aidoska.app_badge": "ATT-25 · AI DOSKA",
    "aidoska.drawer_title": "ATT-25 AI Doska",
    "aidoska.drawer_sub": "Talabalar Portali",
    "aidoska.nav_title": "Navigatsiya",
    "aidoska.back_portal": "Talabalar Portaliga Qaytish",
    "aidoska.back_portal_sub": "ATT-25 umumiy laboratoriya va simulyatorlar",
    "aidoska.ai_title": "Aqlli Sun'iy Intellekt",
    "aidoska.ai_assistant": "AI Assistent & Tahlilchi",
    "aidoska.ai_sub": "Matndan diagramma, tahlil va konspekt",
    "aidoska.fullscreen": "To‘liq Ekran",
    "aidoska.menu_btn": "Menyu",
    "aidoska.undo": "Orqaga qaytarish",
    "aidoska.redo": "Oldinga qaytarish",
    "aidoska.search": "Doskadan qidirish",

    // Section Filters
    "curr.sem1": "1-Semestr (6 ta)",
    "curr.sem2": "2-Semestr (7 ta)",
    "curr.sem3": "3-Semestr (6 ta • Faol)",
    "curr.sem4": "4-Semestr (7 ta)",
    "curr.sem_all": "Barchasi (26 ta fan)",
    "slides.all": "Barchasi",
    "slides.pres": "Taqdimotlar",
    "slides.lab": "Laboratoriya",
    "slides.handbook": "Qo‘llanmalar",
    "media.all": "Barchasi",
    "media.video": "Videolar",
    "media.photo": "Foto Galereya",
    "news.ticker": "⚡ Jonli Texnologik Lenta • 4 ta Asosiy Yangilik",
    "pub.all": "Barchasi (4 ta)",
    "pub.scopus": "Scopus Q1 (2 ta)",
    "pub.wos": "Web of Science (2 ta)",
    "pub.scholar": "Google Scholar (1 ta)",

    // Subnet Calculator
    "subnet.title": "IP Subnet & VLSM Kalkulyatori",
    "subnet.desc": "Tarmoq maskasi, hostlar soni, wildcard va ikkilik ko‘rinishini hisoblash vositasi",
    "subnet.status": "REAL-TIME HISOBLASH",
    "subnet.ip_lbl": "IP Manzil",
    "subnet.cidr_lbl": "CIDR (Prefiks /)",
    "subnet.res_net": "Tarmoq ID:",
    "subnet.res_mask": "Tarmoq Maskasi:",
    "subnet.res_wild": "Wildcard Maska:",
    "subnet.res_range": "Hostlar Oralig‘i:",
    "subnet.res_hosts": "Foydalanuvchi Hostlar:",
    "subnet.res_bcast": "Broadcast Manzil:",
    "subnet.res_binary": "Ikkilik (Binary):",

    // Ping Terminal
    "ping.title": "Jonli Ping & Latency Terminali",
    "ping.desc": "Tugunlararo kechikish, ICMP paketlar yo‘qolishi va RTT statistikasini emulyatsiya qilish",
    "ping.badge": "ICMP ECHO EMULYATORI",
    "ping.target_lbl": "Nishon Tugun (IP yoki Domen)",
    "ping.count_lbl": "Paketlar Soni",
    "ping.btn_send": "Ping Yuborish",

    // OSI Inspector
    "osi.title": "OSI 7 Qatlamli Model Inspektori",
    "osi.desc": "Qatlamlararo PDU birliklari, tarmoq protokollari va apparat vositalarini chuqur tahlil qiling",
    "osi.badge": "ISO/IEC 7498-1 STANDARTI",

    // 3D Launcher & Other Modals
    "launcher.tag": "3D Laboratoriya Markazi",
    "launcher.title": "3D Simulyatorni Tanlang",
    "launcher.desc": "Quyidagi simulyatorlardan birini tanlang. Ular alohida to‘liq ekranli 3D fazoviy laboratoriya sifatida ishga tushadi:",
    "launcher.enter": "Laboratoriyaga Kirish ↗",
    "launcher.card_lan_title": "LAN & Topologiyalar Simulyatori",
    "launcher.card_lan_desc": "Star, Ring, Bus, Tree, Mesh va Ofis topologiyalari, real-time paketlar trafigi va qurilmalar ulanishi.",
    "launcher.card_hw_title": "Kompyuter Sxemalari & Atributlari",
    "launcher.card_hw_desc": "Ona plata ATX PCB, CPU LGA1700, 16-faza VRM, DDR5, PCIe 5.0 shinalar signallari va mantiqiy ALU darvozalari.",
    "launcher.card_grid_title": "Smart Grid: GESdan Xonadongacha",
    "launcher.card_grid_desc": "Tog' daryosi, to'g'on, gidroturbina, 220 kV dala LEP magistrali, tuman GPP, qishloq KTP va xonadon smart-hisoblagichi.",
    "syl.tag": "HEMIS O‘quv Dasturi",
    "syl.title": "Fan Silabusi & O‘quv Rejasi",
    "pres_modal.title": "Taqdimot Ko‘rinishi",
    "pres_modal.ready": "Taqdimot Yuklab Olishga Tayyor",
    "pres_modal.desc": "Ushbu o‘quv taqdimoti va laboratoriya uslubiy ko‘rsatmasi PDF hamda PPTX formatlarida tayyorlangan.",
    "pres_modal.download_pdf": "Yuklab Olish (PDF)",
    "pres_modal.view_pptx": "Slaydlarni Ko‘rish (PPTX)",

    // Hub Center Header & Tabs
    "sim.lan_title": "3D LAN Simulyatori",
    "sim.hw_title": "3D Hardware Sxemalari",
    "sim.cir_title": "Circuit Lab (Sxema)",
    "sim.grid_title": "Smart Grid 3D (GES ➔ Uy)",
    "hub.center_subtitle": "Talabalar Portali • Yagona 3D Laboratoriya Markazi",
    "hub.tab_lan": "🌐 3D LAN Topologiya",
    "hub.tab_hardware": "⚡ 3D Hardware Sxemalari",
    "hub.tab_circuit": "📐 Circuit Lab (Sxema)",
    "hub.tab_powergrid": "⚡ Smart Grid (GES ➔ Uy)",
    "hub.tab_subnet": "🔢 Subnet Kalkulyator",
    "hub.tab_ping": "💻 Jonli Ping Terminali",
    "hub.tab_osi": "📶 OSI 7 Qatlam Modeli",
    "hub.fullscreen": "To‘liq Ekran",
    "hub.back_portal": "Talabalar Portali ↗",

    // Hardware 3D
    "hw.mode_all": "⚡ Barcha Sxemalar",
    "hw.mode_cpu": "🧠 CPU & Kesh",
    "hw.mode_rom": "💾 ROM & BIOS",
    "hw.mode_ssd": "⚡ M.2 SSD & SATA",
    "hw.mode_ram": "💾 RAM & Shina",
    "hw.mode_vrm": "🔋 VRM Quvvat",
    "hw.mode_gpu": "🚀 Kengaytma Slotalar",
    "hw.mode_io": "🔌 Fizik Portlar",
    "hw.mode_logic": "🔲 Mantiqiy (ALU)",
    "hw.mode_disasm": "🔧 Yig‘ish / Ajratish",
    "hw.mode_thermal": "🔥 Overclock & Termal",
    "hw.btn_test": "Test",

    // Smart Grid 3D
    "grid.spot_ges": "🏔️ GES & To'g'on",
    "grid.spot_oru": "⚡ 220 kV ORU",
    "grid.spot_pylon": "🌾 Dala LEP",
    "grid.spot_gpp": "🏭 Tuman GPP",
    "grid.spot_ktp": "🛖 Mahalla KTP",
    "grid.spot_house": "🏠 Xonadon",
    "grid.spot_solar": "☀️ Quyosh SES",
    "grid.spot_wind": "🌬️ Shamol VET",
    "grid.spot_bess": "🔋 BESS Saqlash",
    "grid.act_drone": "🚁 Dron Sayohati",
    "grid.act_experiments": "🔬 Tajribalar & Avariyalar",
    "grid.act_house": "🏠 Xonadon Jihozlari",

    // LAN 3D
    "lan.btn_devices": "Qurilmalar",
    "lan.btn_center": "Markaz",
    "lan.btn_portal": "Talabalar Portali",
    "lan.btn_topo": "Topologiyalar ▼",
    "lan.btn_walk_room": "Xonada Yurish",
    "lan.btn_light": "Yorug‘lik",
    "lan.btn_collab": "Umumiy Xona",
    "lan.btn_clear": "Tozalash",
    "lan.fps_walk": "Yurish",
    "lan.fps_mouse": "Sichqoncha",
    "lan.fps_look": "360° Qarash",
    "lan.fps_run": "Yugurish",
    "lan.fps_interact": "Bosish — Boshqarish",
    "lan.fps_crouch": "Egilish",
    "lan.fps_exit": "Chiqish",

    // Circuit 2D/3D
    "cir.mode_schematic": "📐 Sxema",
    "cir.mode_breadboard": "🔌 3D Maket",
    "cir.mode_split": "⚡ Split View",
    "cir.templates": "📚 200 ta Shablon",
    "cir.presets": "⚡ Sxemalar ▾"
  },

  tm: {
    // Top Bar
    "topbar.lab_status": "LAB ÝAGDAÝY: 100% ONLAÝN",
    "topbar.group": "TOPAR: ATT-25-23A",
    "topbar.semester": "SEMESTR: GÜÝZ 2026",
    "topbar.search": "GÖZLEG",
    "topbar.settings": "SAZLAMALAR",
    "topbar.lang": "DIL",

    // Brand
    "brand.title": "ATT-25",
    "brand.subtitle": "Talyplar Portaly",
    "brand.crest_title": "ATT-25 Kiber-Nyşany",

    // Navigation
    "nav.home": "Baş Sahypa",
    "nav.simulators": "Simulýatorlar",
    "nav.simulators_badge": "5-I 1-DE",
    "nav.aiboard": "🤖 AI Tagtasy",
    "nav.aiboard_badge": "TÄZE",
    "nav.curriculum": "Meýilnama",
    "nav.slides": "Slaýdlar",
    "nav.media": "Media",
    "nav.news": "Täzelikler",
    "nav.articles": "Makalalar",
    "nav.resources": "Çeşmeler",
    "nav.sim_center_btn": "Simulýatorlar ↗",

    // Hero 3D LAN Topologiya Card
    "hero.badge": "Esasy Tejribe Guraly • 3D LAN",
    "hero.title": "3D Interaktiw LAN & Topologiýa Simulýatory",
    "hero.desc": "Üç ölçegli giňişlikde ugrukdyryjy (router), modem, serwer we kompýuterleri hakyky wagtda ýerleşdiriň, kabelleri birikdiriň we maglumat paketleriniň reňkli trafigini synlaň.",
    "hero.stat_devices": "7 GÖRNÜŞ",
    "hero.stat_devices_lbl": "Enjam Görnüşi",
    "hero.stat_physics": "HAKYKY WAGT",
    "hero.stat_physics_lbl": "Fizika & Paketler",
    "hero.stat_hybrid": "ETHERNET / WI-FI",
    "hero.stat_hybrid_lbl": "Gatyşyk Birikme",
    "hero.cta_main": "Simulýatorlar Merkezine Giriş",
    "hero.cta_aidoska": "🤖 AI Tagtasy ↗",
    "hero.cta_lan": "🌐 3D LAN Topologiýa ↗",
    "hero.cta_hardware": "⚡ 3D Çyzgylar ↗",

    // Simulators Promo Banner
    "sim_promo.badge": "Ýeke-täk Tejribe Bölümi • 5-i 1-de Laboratoriýa",
    "sim_promo.title": "ATT-25 Simulýatorlar Merkezi",
    "sim_promo.desc": "Ähli 3D tor topologiýalary, kompýuter enjam çyzgylary (CPU/VRM/DDR5/ALU), IP Subnet kalkulýatory, göni Ping terminaly we OSI 7 gatlak modeli bir bitewi interaktiw bölümde jemlendi.",
    "sim_promo.cta": "Simulýatorlar Merkezine Giriş ↗",

    // AI Doska Promo Banner
    "ai_promo.badge": "TÄZE BÖLÜM • EMELI AŇ ILGARY GIŇIŞLIGI",
    "ai_promo.title": "🤖 AI Tagtasy — Interaktiw Akylly Giňişlik",
    "ai_promo.desc": "Çäksiz wektor tagtasy, erkin galam we geometrik şekiller, reňkli stikerler, tor enjam çyzgylary hem-de Emeli Aň (AI) kömekçisi. Ýeke-täk buýruk (prompt) bilen hünär derejesindäki diagramma we aň hüjümini (mindmap) dörediň!",
    "ai_promo.chip1": "🪄 Tekstden Diagramma Dörediji",
    "ai_promo.chip2": "🧠 Aň Hüjümi (Mindmap)",
    "ai_promo.chip3": "🌐 Tor Topologiýasy Stikerleri",
    "ai_promo.chip4": "📝 Tagtany Awtomatik Derňew & Konspekt",
    "ai_promo.chip5": "💾 PNG, SVG we JSON Eksport",
    "ai_promo.cta": "AI Tagtasyna Geçmek ↗",

    // Curriculum (Okuw Meýilnamasy)
    "curr.pretitle": "HEMIS Akademiki Okuw Meýilnamasy • ATT-25-23a",
    "curr.title": "Okuw Meýilnamasy & Ders Modullary",
    "curr.filter_all": "Ählisi",
    "curr.filter_c1": "1-nji ýyl",
    "curr.filter_c2": "2-nji ýyl",
    "curr.filter_c3": "3-nji ýyl",
    "curr.filter_c4": "4-nji ýyl",
    "curr.mandatory": "Hökmany",
    "curr.elective": "Saýlawly",
    "curr.credits": "Kredit",
    "curr.hours": "sagat",
    "curr.btn_syllabus": "Sillabus & Temalar",
    "curr.btn_hemis": "HEMIS Ulgamy ↗",

    // Presentations (Slaýdlar)
    "slides.pretitle": "Leksiýalar we Tejribe Tanyşdyryşlary",
    "slides.title": "Okuw Tanyşdyryşlary & Slaýdlar",
    "slides.filter_all": "Ählisi",
    "slides.filter_net": "Tor",
    "slides.filter_arch": "Binagärlik",
    "slides.filter_db": "Maglumatlar Binasy",
    "slides.filter_sec": "Howpsuzlyk",
    "slides.btn_view": "Görmek",
    "slides.btn_download": "Ýükläp Almak",

    // Media Hub
    "media.pretitle": "Tejribe we Sapak Prosesleri",
    "media.title": "Wideo & Foto Laboratoriýa",
    "media.filter_all": "Ählisi",
    "media.filter_fiber": "Optiki Süýümli Ulgamlar",
    "media.filter_equip": "Tor Enjamlary",
    "media.filter_arch": "Kompýuter Binagärligi",
    "media.filter_cabling": "Kabel Ulgamlary",
    "media.btn_watch": "Tomaşa Etmek",

    // News
    "news.pretitle": "Iň Täze Bildirişler we Maglumatlar",
    "news.title": "Täzelikler & Bildirişler",
    "news.read_more": "Doly Täzeligi Okamak →",

    // Articles
    "articles.pretitle": "Talyplar we Mugallymlar Ylmy Barlaglary",
    "articles.title": "Ylmy & Tehniki Makalalar",
    "articles.btn_read": "Makalany Okamak →",

    // Resources
    "res.pretitle": "Peýdaly Çeşmeler & Baglanyşyklar",
    "res.title": "Çeşmeler & Elektron Kitaphana",
    "res.open_btn": "Çeşmäni Açmak ↗",

    // Footer
    "footer.mission": "Maglumat ulgamlary we tehnologiýalary (ATT-25-23a) ugry talyplary üçin tejribe başarnyklary, 3D simulýasiýalar, HEMIS okuw meýilnamasy we döwrebap bilim çeşmeleri platformasy.",
    "footer.quick_links": "Çalt Baglanyşyklar",
    "footer.study_sections": "Okuw Bölümleri",
    "footer.contacts_title": "Habarlaşmak & Kafedra",
    "footer.lbl_group": "Topar:",
    "footer.lbl_dept": "Kafedra:",
    "footer.lbl_admin": "Admin:",
    "footer.lbl_phone": "Telefon:",
    "footer.dept_name": "Maglumat tehnologiýalary",
    "footer.simulators": "Simulýatorlar",
    "footer.platforms": "Hyzmatdaş Platformalar",
    "footer.contacts": "Habarlaşmak & Salgy",
    "footer.address": "Özbegistan, Samarkant şäheri, TATU Samarkant şahamçasy, ATT kafedrasy",
    "footer.copy": "© 2026 ATT-25 Ugry.",
    "footer.founder": "JUMAMYRADOW BATYR",

    // Settings Modal
    "settings.modal_title": "Portal Sazlamalary & Reňkler Palitrasy",
    "settings.lang_badge": "🌐 DIL SAÝLAWY / INTERFEÝS DILI",
    "settings.lang_title": "Portal Dilini Saýlaň / Dili Saýlaň",
    "settings.lang_desc": "Özbek dili we Türkmen dili arasynda çalt geçirmek",
    "settings.themes_badge": "🎨 REŇKLER & TEMALAR (7 PALITRA)",
    "settings.themes_title": "Kiber-Tehniki Temany Saýlaň",
    "settings.themes_desc": "Gijeki kiber-neon, nusgawy terminal, ýumşak ýaşyl we ýokary kontrastly gündizki ak fon",
    "settings.btn_reset": "↺ Bellenen ýagdaýa gaýtarmak",
    "settings.extra_badge": "⚙️ GOŞMAÇA SAZLAMALAR",
    "settings.contrast_title": "Aşa-Kontrastly Rejim",
    "settings.contrast_desc": "Ýagtylygy we elementleriň çäklerini iň ýokary derejede güýçlendirmek",
    "settings.font_title": "Uly Şrift",
    "settings.font_desc": "Tekstleri aňsat okamak üçin ulaltmak",
    "settings.anim_title": "Hereketleri (Animasiýalary) Azaltmak",
    "settings.anim_desc": "Gowşak enjamlar üçin fon we kiber effektleri peseltmek",

    // Search Modal
    "search.modal_title": "ATT-25 Ählumumy Gözleg Ulgamy",
    "search.placeholder": "Tema, ders, simulýator ýa-da makala gözläň...",
    "search.quick_tags": "Meşhur:",
    "search.close_hint": "Ýapmak üçin [ESC]",

    // Simulator Center Specific
    "hub.center_title": "ATT-25 SIMULÝATORLAR",
    "hub.center_subtitle": "Talyplar Portaly • Ýeke-täk 3D Laboratoriýa Merkezi",
    "hub.tab_lan": "🌐 3D LAN Topologiýa",
    "hub.tab_hardware": "⚡ 3D Enjam Çyzgylary",
    "hub.tab_circuit": "📐 Circuit Lab (Çyzgy)",
    "hub.tab_powergrid": "⚡ Smart Grid (GES ➔ Öý)",
    "hub.tab_subnet": "🔢 Subnet Kalkulýatory",
    "hub.tab_ping": "💻 Göni Ping Terminaly",
    "hub.tab_osi": "📶 OSI 7 Gatlak Modeli",
    "hub.fullscreen": "Doly Ekran",
    "hub.back_portal": "Talyplar Portaly ↗",

    // AI Doska Specific
    "aidoska.app_badge": "ATT-25 · AI TAGTASY",
    "aidoska.drawer_title": "ATT-25 AI Tagtasy",
    "aidoska.drawer_sub": "Talyplar Portaly",
    "aidoska.nav_title": "Nawigasiýa",
    "aidoska.back_portal": "Talyplar Portalyna Gaýtmak",
    "aidoska.back_portal_sub": "ATT-25 umumy laboratoriýa we simulýatorlar",
    "aidoska.ai_title": "Akylly Emeli Aň",
    "aidoska.ai_assistant": "AI Kömekçi & Derňewçi",
    "aidoska.ai_sub": "Tekstden diagramma, derňew we konspekt",
    "aidoska.fullscreen": "Doly Ekran",
    "aidoska.menu_btn": "Menýu",
    "aidoska.undo": "Yza gaýtarmak",
    "aidoska.redo": "Öňe gaýtarmak",
    "aidoska.search": "Tagtadan gözlemek",

    // Section Filters
    "curr.sem1": "1-nji Semestr (6 sany)",
    "curr.sem2": "2-nji Semestr (7 sany)",
    "curr.sem3": "3-nji Semestr (6 sany • Işjeň)",
    "curr.sem4": "4-nji Semestr (7 sany)",
    "curr.sem_all": "Ählisi (26 sany ders)",
    "slides.all": "Ählisi",
    "slides.pres": "Tanyşdyryşlar",
    "slides.lab": "Laboratoriýa",
    "slides.handbook": "Gollanmalar",
    "media.all": "Ählisi",
    "media.video": "Wideolar",
    "media.photo": "Surat Galereýasy",
    "news.ticker": "⚡ Göni Tehnologiki Lenta • 4 Esasy Täzelik",
    "pub.all": "Ählisi (4 sany)",
    "pub.scopus": "Scopus Q1 (2 sany)",
    "pub.wos": "Web of Science (2 sany)",
    "pub.scholar": "Google Scholar (1 sany)",

    // Subnet Calculator
    "subnet.title": "IP Subnet & VLSM Kalkulýatory",
    "subnet.desc": "Tor maskasy, hostlar sany, wildcard we ikilik görnüşini hasaplamak guraly",
    "subnet.status": "HAKYKY WAGTDA HASAPLAMAK",
    "subnet.ip_lbl": "IP Salgy",
    "subnet.cidr_lbl": "CIDR (Prefiks /)",
    "subnet.res_net": "Tor ID:",
    "subnet.res_mask": "Tor Maskasy:",
    "subnet.res_wild": "Wildcard Maska:",
    "subnet.res_range": "Hostlar Aralygy:",
    "subnet.res_hosts": "Ulanyjy Hostlary:",
    "subnet.res_bcast": "Broadcast Salgysy:",
    "subnet.res_binary": "Ikilik (Binary):",

    // Ping Terminal
    "ping.title": "Göni Ping & Latency Terminaly",
    "ping.desc": "Düwünlerara gijikme, ICMP paket ýitgisi we RTT statistikasyny emulýasiýa etmek",
    "ping.badge": "ICMP ECHO EMULÝATORY",
    "ping.target_lbl": "Nyşana Düwün (IP ýa-da Domen)",
    "ping.count_lbl": "Paketler Sany",
    "ping.btn_send": "Ping Ugratmak",

    // OSI Inspector
    "osi.title": "OSI 7 Gatlakly Model Inspektory",
    "osi.desc": "Gatlaklarara PDU birlikleri, tor protokollary we enjam serişdelerini çuňňur derňäň",
    "osi.badge": "ISO/IEC 7498-1 STANDARTY",

    // 3D Launcher & Other Modals
    "launcher.tag": "3D Laboratoriýa Merkezi",
    "launcher.title": "3D Simulýatory Saýlaň",
    "launcher.desc": "Aşakdaky simulýatorlardan birini saýlaň. Olar aýratyn doly ekranly 3D giňişlik laboratoriýasy bolup işlär:",
    "launcher.enter": "Laboratoriýa Giriş ↗",
    "launcher.card_lan_title": "LAN & Topologiýalar Simulýatory",
    "launcher.card_lan_desc": "Star, Ring, Bus, Tree, Mesh we Ofis topologiýalary, hakyky wagt paket trafigi we enjam baglanyşygy.",
    "launcher.card_hw_title": "Kompýuter Çyzgylary & Atributlary",
    "launcher.card_hw_desc": "Ene plata ATX PCB, CPU LGA1700, 16-faza VRM, DDR5, PCIe 5.0 şina signallary we logiki ALU derwezeleri.",
    "launcher.card_grid_title": "Smart Grid: GES-den Öýe Çenli",
    "launcher.card_grid_desc": "Dag derýasy, bent, gidroturbina, 220 kV meýdan EGE magistraly, etrap GPP, oba KTP we öý smart-hasaplaýjysy.",
    "syl.tag": "HEMIS Okuw Meýilnamasy",
    "syl.title": "Ders Sillabusy & Okuw Meýilnamasy",
    "pres_modal.title": "Tanyşdyryş Görünüşi",
    "pres_modal.ready": "Tanyşdyryş Ýükläp Almaga Taýyn",
    "pres_modal.desc": "Bu okuw tanyşdyryşy we laboratoriýa usuly gollanmasy PDF hem-de PPTX formatlarynda taýýarlanyldy.",
    "pres_modal.download_pdf": "Ýükläp Almak (PDF)",
    "pres_modal.view_pptx": "Slaýdlary Görmek (PPTX)",

    // Hub Center Header & Tabs
    "sim.lan_title": "3D LAN Simulýatory",
    "sim.hw_title": "3D Hardware Çyzgylary",
    "sim.cir_title": "Circuit Lab (Çyzgy)",
    "sim.grid_title": "Smart Grid 3D (GES ➔ Öý)",
    "hub.center_subtitle": "Talyplar Portaly • Ýeke-täk 3D Laboratoriýa Merkezi",
    "hub.tab_lan": "🌐 3D LAN Topologiýa",
    "hub.tab_hardware": "⚡ 3D Hardware Çyzgylary",
    "hub.tab_circuit": "📐 Circuit Lab (Çyzgy)",
    "hub.tab_powergrid": "⚡ Smart Grid (GES ➔ Öý)",
    "hub.tab_subnet": "🔢 Subnet Kalkulýatory",
    "hub.tab_ping": "💻 Göni Ping Terminaly",
    "hub.tab_osi": "📶 OSI 7 Gatlakly Modeli",
    "hub.fullscreen": "Doly Ekran",
    "hub.back_portal": "Talyplar Portaly ↗",

    // Hardware 3D
    "hw.mode_all": "⚡ Ähli Çyzgylar",
    "hw.mode_cpu": "🧠 CPU & Keş",
    "hw.mode_rom": "💾 ROM & BIOS",
    "hw.mode_ssd": "⚡ M.2 SSD & SATA",
    "hw.mode_ram": "💾 RAM & Şina",
    "hw.mode_vrm": "🔋 VRM Güýç",
    "hw.mode_gpu": "🚀 Giňeltme Slotlary",
    "hw.mode_io": "🔌 Fiziki Portlar",
    "hw.mode_logic": "🔲 Logiki (ALU)",
    "hw.mode_disasm": "🔧 Ýygnamak / Bölmek",
    "hw.mode_thermal": "🔥 Overclock & Termal",
    "hw.btn_test": "Synag",

    // Smart Grid 3D
    "grid.spot_ges": "🏔️ GES & Bent",
    "grid.spot_oru": "⚡ 220 kV ORU",
    "grid.spot_pylon": "🌾 Meýdan EGE",
    "grid.spot_gpp": "🏭 Etrap GPP",
    "grid.spot_ktp": "🛖 Oba KTP",
    "grid.spot_house": "🏠 Öý & Smart Grid",
    "grid.spot_solar": "☀️ Gün SES",
    "grid.spot_wind": "🌬️ Şemal ÝES",
    "grid.spot_bess": "🔋 BESS Saklaýyş",
    "grid.act_drone": "🚁 Dron Syýahaty",
    "grid.act_experiments": "🔬 Synaglar & Heläkçilikler",
    "grid.act_house": "🏠 Öý Enjamlary",

    // LAN 3D
    "lan.btn_devices": "Enjamlar",
    "lan.btn_center": "Merkez",
    "lan.btn_portal": "Talyplar Portaly",
    "lan.btn_topo": "Topologiýalar ▼",
    "lan.btn_walk_room": "Otagda Ýöremek",
    "lan.btn_light": "Yşyklandyryş",
    "lan.btn_collab": "Umumy Otag",
    "lan.btn_clear": "Arassalamak",
    "lan.fps_walk": "Ýöremek",
    "lan.fps_mouse": "Syçanjyk",
    "lan.fps_look": "360° Seretmek",
    "lan.fps_run": "Ylgamak",
    "lan.fps_interact": "Basmak — Dolandyrmak",
    "lan.fps_crouch": "Egilmek",
    "lan.fps_exit": "Çykmak",

    // Circuit 2D/3D
    "cir.mode_schematic": "📐 Çyzgy",
    "cir.mode_breadboard": "🔌 3D Maket",
    "cir.mode_split": "⚡ Split View",
    "cir.templates": "📚 200 Şablon",
    "cir.presets": "⚡ Çyzgylar ▾"
  }
};

class I18nManager {
  constructor() {
    this.currentLang = this.getSavedLanguage();
    this.init();
  }

  getSavedLanguage() {
    try {
      const saved = localStorage.getItem('att25_lang');
      if (saved === 'tm' || saved === 'uz') return saved;
    } catch (e) {}
    return 'uz';
  }

  init() {
    // Global click listener for any language switch buttons/cards
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.lang-btn, .lang-choice-card');
      if (btn && btn.dataset.lang) {
        this.setLanguage(btn.dataset.lang);
      }
    });

    // Cross-tab / cross-frame storage listener
    window.addEventListener('storage', (e) => {
      if (e.key === 'att25_lang' && (e.newValue === 'uz' || e.newValue === 'tm')) {
        this.currentLang = e.newValue;
        this.applyLanguage(e.newValue);
      }
    });

    // PostMessage listener for iframes
    window.addEventListener('message', (e) => {
      if (e.data && e.data.type === 'att25_set_language' && (e.data.lang === 'uz' || e.data.lang === 'tm')) {
        this.currentLang = e.data.lang;
        this.applyLanguage(e.data.lang);
      }
    });

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.applyLanguage(this.currentLang));
    } else {
      this.applyLanguage(this.currentLang);
    }
  }

  t(key, lang = this.currentLang) {
    const dict = ATT25_I18N[lang] || ATT25_I18N['uz'];
    return dict[key] || ATT25_I18N['uz'][key] || key;
  }

  setLanguage(lang) {
    if (lang !== 'uz' && lang !== 'tm') return;
    this.currentLang = lang;
    try {
      localStorage.setItem('att25_lang', lang);
    } catch (e) {}
    this.applyLanguage(lang);

    // Notify other components or iframes
    window.dispatchEvent(new CustomEvent('att25_language_changed', { detail: { lang } }));

    // Broadcast to any child iframes on page
    document.querySelectorAll('iframe').forEach((frame) => {
      try {
        if (frame.contentWindow) {
          frame.contentWindow.postMessage({ type: 'att25_set_language', lang }, '*');
        }
      } catch (e) {}
    });
  }

  applyLanguage(lang) {
    document.documentElement.setAttribute('lang', lang);

    // Update all elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      const val = this.t(key, lang);
      if (val) {
        el.textContent = val;
      }
    });

    // Update titles / tooltips
    document.querySelectorAll('[data-i18n-title]').forEach((el) => {
      const key = el.getAttribute('data-i18n-title');
      const val = this.t(key, lang);
      if (val) {
        el.setAttribute('title', val);
      }
    });

    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder');
      const val = this.t(key, lang);
      if (val) {
        el.setAttribute('placeholder', val);
      }
    });

    // Update active class on language toggle buttons
    document.querySelectorAll('.lang-btn').forEach((btn) => {
      const btnLang = btn.getAttribute('data-lang');
      if (btnLang === lang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update settings modal language options if present
    document.querySelectorAll('.lang-choice-card').forEach((card) => {
      const cardLang = card.getAttribute('data-lang');
      if (cardLang === lang) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });
  }
}

// Global instance
window.att25I18n = new I18nManager();
