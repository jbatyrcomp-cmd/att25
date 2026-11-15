/**
 * ATT-25 AKADEMIK VA AMALIY PORTALI
 * Arsenal.com Yashil Uslubidagi Interaktiv Logika va Simulyatorlar Dvigateli
 */

// Anti-nesting: Prevent main portal from being trapped inside an iframe
if (window.top !== window.self) {
  try {
    window.top.location.href = window.location.href;
  } catch(e) {}
}

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initSubnetCalculator();
  initPingSimulator();
  initOsiInspector();
  initArenaControls();
  initTopologyChips();
  initSimulatorSwitcher();
  initSimLauncherModal();
  initSearchModal();
  initSettingsModal();
  initArticleReader();
  initVideoPlayer();
  initPresentationModal();
  initCategoryFilters();
  initSyllabusModal();
  initPhotoLightbox();
});

/* ==========================================================================
   1. STICKY HEADER & SCROLL BEHAVIOR
   ========================================================================== */
function initStickyHeader() {
  const header = document.querySelector('.main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle & close on link or outside click
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const mainNav = document.getElementById('mainNav');
  if (mobileBtn && mainNav) {
    mobileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      mainNav.classList.toggle('show-mobile');
    });

    // Close when clicking any nav link
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('show-mobile');
      });
    });

    // Close when tapping outside
    document.addEventListener('click', (e) => {
      if (!mainNav.contains(e.target) && !mobileBtn.contains(e.target)) {
        mainNav.classList.remove('show-mobile');
      }
    });
  }
}

/* ==========================================================================
   2. INTERAKTIV IP SUBNET & VLSM KALKULYATORI
   ========================================================================== */
function initSubnetCalculator() {
  const ipInput = document.getElementById('calcIp');
  const cidrInput = document.getElementById('calcCidr');
  const presets = document.querySelectorAll('.preset-pill');

  if (!ipInput || !cidrInput) return;

  function calculate() {
    const ipStr = ipInput.value.trim();
    let cidr = parseInt(cidrInput.value, 10);
    if (isNaN(cidr) || cidr < 1) cidr = 24;
    if (cidr > 32) cidr = 32;

    const parts = ipStr.split('.').map(Number);
    if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255)) {
      document.getElementById('resNet').textContent = "Notöğri IP format";
      return;
    }

    // IP to 32-bit int
    const ipInt = ((parts[0] << 24) >>> 0) + ((parts[1] << 16) >>> 0) + ((parts[2] << 8) >>> 0) + (parts[3] >>> 0);
    
    // Mask
    const maskInt = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
    const netInt = (ipInt & maskInt) >>> 0;
    const wildInt = (~maskInt) >>> 0;
    const bcastInt = (netInt | wildInt) >>> 0;

    const intToIp = (num) => [
      (num >>> 24) & 255,
      (num >>> 16) & 255,
      (num >>> 8) & 255,
      num & 255
    ].join('.');

    const netStr = intToIp(netInt);
    const maskStr = intToIp(maskInt);
    const bcastStr = intToIp(bcastInt);
    const wildStr = intToIp(wildInt);

    let usableFirst = "-", usableLast = "-", hostsCount = 0;
    if (cidr === 32) {
      usableFirst = netStr;
      usableLast = netStr;
      hostsCount = 1;
    } else if (cidr === 31) {
      usableFirst = intToIp(netInt);
      usableLast = intToIp(bcastInt);
      hostsCount = 2; // RFC 3021 Point-to-Point
    } else {
      usableFirst = intToIp(netInt + 1);
      usableLast = intToIp(bcastInt - 1);
      hostsCount = Math.max(0, (2 ** (32 - cidr)) - 2);
    }

    // Render results
    document.getElementById('resNet').textContent = `${netStr} /${cidr}`;
    document.getElementById('resMask').textContent = maskStr;
    document.getElementById('resWild').textContent = wildStr;
    document.getElementById('resRange').textContent = `${usableFirst} – ${usableLast}`;
    document.getElementById('resHosts').textContent = hostsCount.toLocaleString() + " ta";
    
    const binaryMask = parts.map(p => p.toString(2).padStart(8, '0')).join('.');
    document.getElementById('resBinary').textContent = binaryMask;
  }

  ipInput.addEventListener('input', calculate);
  cidrInput.addEventListener('input', calculate);

  presets.forEach(btn => {
    btn.addEventListener('click', () => {
      cidrInput.value = btn.dataset.cidr;
      calculate();
    });
  });

  // Run initial calculation
  calculate();
}

/* ==========================================================================
   3. JONLI PING & LATENCY TERMINALI
   ========================================================================== */
function initPingSimulator() {
  const pingBtn = document.getElementById('runPingBtn');
  const pingInput = document.getElementById('pingTarget');
  const terminal = document.getElementById('pingTerminal');
  const clearBtn = document.getElementById('clearPingBtn');

  if (!pingBtn || !terminal) return;

  clearBtn.addEventListener('click', () => {
    terminal.innerHTML = `<div class="terminal-line system">[ATT-25 ICMP Echo Engine v2.4] Tayyor. IP kiriting va "Ping yuboriş"ni bosing.</div>`;
  });

  pingBtn.addEventListener('click', () => {
    const target = pingInput.value.trim() || '8.8.8.8';
    runPingSequence(target);
  });

  pingInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const target = pingInput.value.trim() || '8.8.8.8';
      runPingSequence(target);
    }
  });

  function runPingSequence(host) {
    pingBtn.disabled = true;
    pingBtn.style.opacity = '0.5';

    const timestamp = new Date().toLocaleTimeString();
    terminal.innerHTML += `\n<div class="terminal-line system">PING ${host} (${host}): 56 data bytes [${timestamp}]</div>`;
    terminal.scrollTop = terminal.scrollHeight;

    let seq = 1;
    const maxPackets = 4;
    const times = [];

    const interval = setInterval(() => {
      if (seq > maxPackets) {
        clearInterval(interval);
        const min = Math.min(...times).toFixed(1);
        const max = Math.max(...times).toFixed(1);
        const avg = (times.reduce((a, b) => a + b, 0) / times.length).toFixed(1);

        terminal.innerHTML += `
          <div class="terminal-line system">--- ${host} ping statistikasi ---</div>
          <div class="terminal-line system">${maxPackets} paket yuborildi, ${maxPackets} qabul qilindi, 0.0% paket yöqolişi</div>
          <div class="terminal-line success">rtt min/avg/max = ${min}/${avg}/${max} ms</div>
        `;
        terminal.scrollTop = terminal.scrollHeight;
        pingBtn.disabled = false;
        pingBtn.style.opacity = '1';
        return;
      }

      // Realistic jitter based on target
      let latency = 2.0;
      if (host.includes('192.168') || host.includes('10.') || host.includes('localhost')) {
        latency = +(0.3 + Math.random() * 0.8).toFixed(2);
      } else {
        latency = +(3.2 + Math.random() * 4.5).toFixed(1);
      }
      times.push(latency);

      const ttl = host.includes('192.168') ? 64 : (Math.random() > 0.5 ? 56 : 118);
      terminal.innerHTML += `<div class="terminal-line success">64 bayt ${host} dan: icmp_seq=${seq} ttl=${ttl} vaqt=${latency} ms</div>`;
      terminal.scrollTop = terminal.scrollHeight;
      seq++;
    }, 450);
  }
}

/* ==========================================================================
   4. INTERAKTIV OSI 7 POG'ONALI MODEL INSPEKTORI
   ========================================================================== */
const OSI_DATA = {
  7: {
    name: "Application (Amaliy)",
    pdu: "Ma'lumotlar (Data)",
    protocols: "HTTP/3, HTTPS, DNS, DHCP, SSH, FTP, SMTP",
    devices: "Gateway, Next-Gen Firewall, Web Server",
    desc: "Foydalanuvchi dasturlari va tarmoq xizmatlari o‘rtasidagi to‘g‘ridan-to‘g‘ri interfeys. Brauzer va ilovalar so‘rovlari aynan shu qatlamda shakllanadi."
  },
  6: {
    name: "Presentation (Taqdimot)",
    pdu: "Ma'lumotlar (Data)",
    protocols: "TLS 1.3, SSL, JPEG, ASCII, GZIP",
    devices: "OS Kriptografik Modullari, Proxy",
    desc: "Ma'lumotlarni shifrlash (encryption), siqish (compression) va sintaksisini formatlash vazifasini bajaradi."
  },
  5: {
    name: "Session (Seans)",
    pdu: "Ma'lumotlar (Data)",
    protocols: "NetBIOS, RPC, PPTP, Sockets",
    devices: "Dasturiy soketlar, Operatsion tizim",
    desc: "Ikkita tugun örtasidagi ulaniş seansini örnatadi, boşqaradi va yakunlaydi."
  },
  4: {
    name: "Transport (Transport)",
    pdu: "Segment (TCP) / Datagram (UDP)",
    protocols: "TCP, UDP, QUIC, SCTP",
    devices: "L4 Switch, Stateful Firewall",
    desc: "Portlar orqali ma'lumotlarni ishonchli (TCP) yoki tezkor (UDP) yetkazib berish, oqimni nazorat qilish (Flow Control)."
  },
  3: {
    name: "Network (Tarmoq)",
    pdu: "Paket (Packet)",
    protocols: "IPv4, IPv6, ICMP, OSPF, BGP, ARP",
    devices: "Router (Yo‘riqnoma), L3 Switch",
    desc: "Mantiqiy IP manzillash va paketlarni manbadan manzilga marshrutlash (routing) bo‘yicha global yo‘lni tanlaydi."
  },
  2: {
    name: "Data Link (Kanal)",
    pdu: "Kadr (Frame)",
    protocols: "Ethernet (802.3), Wi-Fi (802.11), PPP, VLAN (802.1Q)",
    devices: "Switch (Kommutator), Bridge, NIC",
    desc: "Jismoniy MAC manzillar orqali bir xil lokal segment ichida kadrlar almashinuvi va xatoliklarni tekshirish (CRC)."
  },
  1: {
    name: "Physical (Jismoniy)",
    pdu: "Bitlar (0 va 1 signallari)",
    protocols: "1000BASE-T, Optik tola (Single/Multi Mode), Radio",
    devices: "Optik payvandlagich, Patch panel, Kabel, Repeater",
    desc: "Elektr, yorug‘lik yoki radio signallarni jismoniy vositalar (mis kabel, optik tola, efir) orqali uzatish."
  }
};

function initOsiInspector() {
  const rows = document.querySelectorAll('.osi-layer-row');
  const infoBox = document.getElementById('osiInfoBox');
  if (!rows.length || !infoBox) return;

  rows.forEach(row => {
    row.addEventListener('click', () => {
      rows.forEach(r => r.classList.remove('active'));
      row.classList.add('active');

      const layer = row.dataset.layer;
      const data = OSI_DATA[layer];
      if (data) {
        infoBox.innerHTML = `
          <div><b>Qatlam ${layer}: ${data.name}</b></div>
          <div style="margin-top:4px;"><b>PDU Birligi:</b> ${data.pdu}</div>
          <div><b>Protokollar:</b> ${data.protocols}</div>
          <div><b>Qurilmalar:</b> ${data.devices}</div>
          <div style="margin-top:4px; color:var(--text-light);">${data.desc}</div>
        `;
      }
    });
  });
}

/* ==========================================================================
   5. 3D SIMULYATOR ARENA BOŞQARUVI
   ========================================================================== */
function initArenaControls() {
  const reloadBtn = document.getElementById('arenaReload');
  const fullscreenBtn = document.getElementById('arenaFullscreen');
  const newTabBtn = document.getElementById('arenaNewTab');
  const iframe = document.getElementById('arenaIframe');
  const arenaWrapper = document.getElementById('arenaWrapper');

  if (reloadBtn && iframe) {
    reloadBtn.addEventListener('click', () => {
      iframe.src = iframe.src;
    });
  }

  if (newTabBtn) {
    newTabBtn.addEventListener('click', () => {
      const currentSrc = iframe ? (iframe.getAttribute('src') || '3d/index.html') : '3d/index.html';
      window.open(currentSrc, '_blank');
    });
  }

  if (fullscreenBtn && arenaWrapper) {
    fullscreenBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        arenaWrapper.requestFullscreen().catch(err => {
          console.error(`Fullscreen xatosi: ${err.message}`);
        });
      } else {
        document.exitFullscreen();
      }
    });
  }
}

function initTopologyChips() {
  const chips = document.querySelectorAll('.topo-çip');
  const iframe = document.getElementById('arenaIframe');
  if (!chips.length || !iframe) return;

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const topoType = chip.dataset.topo;

      // Send postMessage to 3d/index.html iframe
      if (iframe.contentWindow) {
        iframe.contentWindow.postMessage({ action: 'loadTopology', type: topoType }, '*');
      }
    });
  });
}

function initSimulatorSwitcher() {
  const tabBtns = document.querySelectorAll('.sim-tab-btn');
  const iframe = document.getElementById('arenaIframe');
  const mainTitle = document.getElementById('arenaMainTitle');
  const topoBar = document.querySelector('.topo-templates-bar');
  if (!tabBtns.length || !iframe) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const simSrc = btn.dataset.sim;
      const title = btn.dataset.title;
      iframe.src = simSrc;
      if (mainTitle && title) mainTitle.textContent = title;
      if (topoBar) {
        topoBar.style.display = simSrc.includes('hardware3d') ? 'none' : 'flex';
      }
    });
  });
}

function initSimLauncherModal() {
  const launcherBtn = document.getElementById('openSimLauncherBtn');
  const launcherModal = document.getElementById('simLauncherModal');
  const closeBtn = document.getElementById('simLauncherClose');
  const navDropdownItem = document.getElementById('simNavDropdownItem');
  const navDropdownBtn = document.getElementById('simNavDropdownBtn');

  if (launcherBtn && launcherModal) {
    launcherBtn.addEventListener('click', (e) => {
      e.preventDefault();
      launcherModal.classList.add('open');
    });
  }

  if (closeBtn && launcherModal) {
    closeBtn.addEventListener('click', () => {
      launcherModal.classList.remove('open');
    });
  }

  if (launcherModal) {
    launcherModal.addEventListener('click', (e) => {
      if (e.target === launcherModal) {
        launcherModal.classList.remove('open');
      }
    });
  }

  // Mobile toggle for navigation dropdown
  if (navDropdownItem && navDropdownBtn) {
    navDropdownBtn.addEventListener('click', (e) => {
      if (window.innerWidth <= 860) {
        e.preventDefault();
        navDropdownItem.classList.toggle('mobile-open');
      }
    });
  }
}

/* ==========================================================================
   6. QIDIRUV (SEARCH) MODALI
   ========================================================================== */
const SEARCH_INDEX = [
  { title: "Yagona Simulyatorlar Markazi (5-in-1)", category: "Simulyator", link: "simulyatorlar/index.html", desc: "3D LAN, 3D Hardware Sxemalari, Subnet, Ping va OSI modeli bitta yagona bo‘limda" },
  { title: "3D Kompyuter Sxemalari & Atributlari", category: "Simulyator", link: "simulyatorlar/index.html#hardware3d", desc: "Ona plata arxitekturasi, CPU LGA1700, VRM sxemasi, DDR5, PCIe 5.0 shinalari va mantiqiy elementlar" },
  { title: "3D LAN Simulyatori", category: "Simulyator", link: "simulyatorlar/index.html#lan3d", desc: "Interaktiv 3D muhitda tarmoq qurish va paketlar harakatini kuzatish" },
  { title: "IP Subnet & VLSM Kalkulyatori", category: "Simulyator", link: "simulyatorlar/index.html#subnet", desc: "IP manzil va CIDR maskasi bo‘yicha tarmoq parametrlarini hisoblash" },
  { title: "Jonli Ping & Latency Terminali", category: "Simulyator", link: "simulyatorlar/index.html#ping", desc: "ICMP paketlar yuborish va tarmoq kechikishini sinovdan o‘tkazish" },
  { title: "OSI 7 Qatlamli Model Inspektori", category: "Simulyator", link: "simulyatorlar/index.html#osi", desc: "OSI qatlamlari, protokollari va apparat jihozlarini tahlil qilish" },
  
  // HEMIS 1-Semestr Fanlari (08.09.2025 - 20.12.2025)
  { title: "O‘zbekistonning eng yangi tarixi (HIST1101)", category: "1-Semestr", link: "#oquv-dasturi", desc: "Mustaqillik davri tarixi, Yangi O‘zbekiston strategiyasi va ijtimoiy-iqtisodiy islohotlar (120 Soat, 4.0 Kredit)" },
  { title: "Ingliz tili I (ENG1102)", category: "1-Semestr", link: "#oquv-dasturi", desc: "Umumiy va sohaviy grammatika, texnik matnlarni tushunish va muloqot ko‘nikmalari (120 Soat, 4.0 Kredit)" },
  { title: "Hisob (Calculus) I (MATH1103)", category: "1-Semestr", link: "#oquv-dasturi", desc: "Bir o‘zgaruvchili funksiyalar differensial va integral hisobi, limitlar va qatorlar (180 Soat, 6.0 Kredit)" },
  { title: "Fizika I: Mexanika va termodinamika (PHYS1104)", category: "1-Semestr", link: "#oquv-dasturi", desc: "Klassik mexanika, saqlanish qonunlari, molekulyar fizika va to‘lqinlar harakati (180 Soat, 6.0 Kredit)" },
  { title: "Dasturlash I: Strukturali C/C++ (CS1105)", category: "1-Semestr", link: "#oquv-dasturi", desc: "C/C++ tili asoslari, oqim boshqaruvi, massivlar, ko‘rsatkichlar va dinamik xotira (180 Soat, 6.0 Kredit)" },
  { title: "Akademik yozuv (ACAD1106)", category: "1-Semestr", link: "#oquv-dasturi", desc: "Ilmiy uslub, maqolalar tuzilishi (IMRAD), adabiyotlar tahlili va akademik etika (120 Soat, 4.0 Kredit)" },

  // HEMIS 2-Semestr Fanlari (09.02.2026 - 30.05.2026)
  { title: "Hisob (Calculus) II (MATH1201)", category: "2-Semestr", link: "#oquv-dasturi", desc: "Ko‘p o‘zgaruvchili funksiyalar, xususiy hosilalar, karrali integrallar va qatorlar (180 Soat, 6.0 Kredit)" },
  { title: "Dasturlash II: OOP C++ (CS1202)", category: "2-Semestr", link: "#oquv-dasturi", desc: "Ob'yektga yönaltirilgan dasturlaş (OOP), sinflar, merosxörlik, polimorfizm va STL (120 Soat, 4.0 Kredit)" },
  { title: "Ma'lumotlar tuzilmasi va algoritmlar (CS1203)", category: "2-Semestr", link: "#oquv-dasturi", desc: "Stek, navbat, bog‘langan ro‘yxatlar, BST daraxtlar va Big-O tahlili (120 Soat, 4.0 Kredit)" },
  { title: "Falsafa (PHIL1204)", category: "2-Semestr", link: "#oquv-dasturi", desc: "Ontologiya, gnoseologiya, mantiq, axborot jamiyati falsafasi va muhandislik etikasi (120 Soat, 4.0 Kredit)" },
  { title: "Dinshunoslik (REL1205)", category: "2-Semestr", link: "#oquv-dasturi", desc: "Jahon dinlari tarixi, tolerantlik madaniyati va buzg‘unchi g‘oyalarga qarshi immunitet (120 Soat, 4.0 Kredit)" },
  { title: "Xorijiy til II: Professional IT English (ENG1206)", category: "2-Semestr", link: "#oquv-dasturi", desc: "AKT va telekommunikatsiya sohasi terminologiyasi, RFC hujjatlar va texnik muloqot (120 Soat, 4.0 Kredit)" },
  { title: "Fizika II: Elektr va magnetizm (PHYS1207)", category: "2-Semestr", link: "#oquv-dasturi", desc: "Elektrostatika, doimiy tok zanjirlari, elektromagnit induksiya va Maksvell qonunlari (120 Soat, 4.0 Kredit)" },

  // HEMIS 3-Semestr Fanlari (Kuzgi 2026 - Hozirgi)
  { title: "Chiziqli algebra (MATH2101)", category: "3-Semestr", link: "#oquv-dasturi", desc: "Matritsalar, determinantlar, chiziqli tenglamalar sistemasi, vektor fazolari va xos qiymatlar (180 Soat, 6.0 Kredit)" },
  { title: "Ma'lumotlar bazasi (CS2102)", category: "3-Semestr", link: "#oquv-dasturi", desc: "ERD loyihalaş, SQL sörovlari (DDL, DML), normalizatsiya, ACID tranzaksiyalari va PostgreSQL (180 Soat, 6.0 Kredit)" },
  { title: "Elektronika va sxemalar (EE2103)", category: "3-Semestr", link: "#oquv-dasturi", desc: "Yarim ötkazgiçlar, tranzistorlar, mantiqiy elementlar, kombinatsion va ketma-ket mikrosxemalar (180 Soat, 6.0 Kredit)" },
  { title: "Diskret tuzilmalar (CS2104)", category: "3-Semestr", link: "#oquv-dasturi", desc: "Töplamlar, Bul algebrasi, graf nazariyasi, kombinatorika va tarmoq topologiyalari (180 Soat, 6.0 Kredit)" },
  { title: "Kompyuter tarmoqlari (NET2105)", category: "3-Semestr", link: "#oquv-dasturi", desc: "OSI modeli, Ethernet, IP subnetting, VLAN, STP va OSPF marşrutlaş protokollari (180 Soat, 6.0 Kredit)" },
  { title: "Kelajak soati (KS2106)", category: "3-Semestr", link: "#oquv-dasturi", desc: "AKT sohaviy rivojlaniş, xalqaro sertifikatlaş, CV va muhandislik etikasi (30 Soat)" },
  
  // HEMIS 4-Semestr Fanlari
  { title: "Kiberxavfsizlik asoslari (SEC2201)", category: "4-Semestr", link: "#oquv-dasturi", desc: "Kriptografiya, Next-Gen Firewall, IDS/IPS va xavfsizlik devorlari (180 Soat, 6.0 Kredit)" },
  { title: "Sun'iy intellekt asoslari (AI2202)", category: "4-Semestr", link: "#oquv-dasturi", desc: "Mashinali o‘rganish, neyron to‘rlar va intellektual tizimlar (180 Soat, 6.0 Kredit)" },
  { title: "Data Science", category: "4-Semestr", link: "#oquv-dasturi", desc: "Katta hajmdagi ma'lumotlar tahlili, Pandas, NumPy va vizualizatsiya (180 Soat, 6.0 Kredit)" },

  // IT & AI Yangiliklari 2026
  { title: "NVIDIA Blackwell B200 va Yangi Avlod AI Klasterlari", category: "Yangiliklar", link: "#yangiliklar", desc: "208 milliard tranzistor, 20 PFLOPS quvvat va suyuqlik bilan sovutiş tizimi" },
  { title: "Avtonom 6G Tarmoqlari: AI Boşqaruvidagi Self-Healing Tizimlar", category: "Yangiliklar", link: "#yangiliklar", desc: "Inson aralaşuvisiz işlovçi, 3 ms içida özini-özi tiklaydigan 6G tarmoqlari" },
  { title: "Kvant Xavfsizligi va AI Himoya Qalqoni: Post-Quantum Standartlar", category: "Yangiliklar", link: "#yangiliklar", desc: "NIST ML-KEM va ML-DSA post-kvant algoritmlarining AI xavfsizlik devorlariga integratsiyasi" },
  { title: "Agentic AI: Köp Agentli Tizimlar Tarmoq Muhandisligi va Kodlaşda", category: "Yangiliklar", link: "#yangiliklar", desc: "Avtonom köp agentli tizimlar orqali BGP/OSPF marşrutlaş muammolarini bartaraf etiş" },

  // Xalqaro Ilmiy Naşrlar (Scopus, Web of Science, Google Sçolar)
  { title: "Deep Reinforcement Learning for Dynamic Routing in SDN (Scopus Q1)", category: "Ilmiy Naşr", link: "#maqolalar", desc: "Journal of Network and Computer Applications (Elsevier, 2026) • CiteScore 14.8" },
  { title: "Quantum Key Distribution (QKD) in Terabit Optical Networks (Web of Science)", category: "Ilmiy Naşr", link: "#maqolalar", desc: "IEEE Transactions on Quantum Engineering (2026) • Impact Factor 8.2" },
  { title: "A Comprehensive Survey on Zero-Trust Architecture (Google Sçolar)", category: "Ilmiy Naşr", link: "#maqolalar", desc: "ACM Computing Surveys • 1,420+ Citations • Mikrosegmentatsiya va mTLS" },
  { title: "Federated Learning-Driven Edge Intelligence for IoT (Scopus Q1 / WoS)", category: "Ilmiy Naşr", link: "#maqolalar", desc: "IEEE Internet of Things Journal • Impact Factor 10.6 • Edge AI va maxfiylik" },

  // Qo'llanmalar & Media
  { title: "OSPFv2 & OSPFv3 Marşrutlaş Arxitekturasi", category: "Taqdimot", link: "#taqdimotlar", desc: "Cisco routerlarida OSPF protokoli va LSA turlari tahlili (48 Slayd)" },
  { title: "VLAN & Inter-VLAN Routing Amaliyoti", category: "Laboratoriya", link: "#taqdimotlar", desc: "802.1Q trunking va Router-on-a-Stick amaliy qöllanmasi (36 Sahifa)" },
  { title: "Optik Tolali Liniyalarni Fusion Splicer bilan Payvandlaş", category: "Video", link: "#media-hub", desc: "ATT-25 laboratoriya stendidagi optik tola payvandlaş amaliyoti" },
  { title: "HEMIS Student Axborot Tizimi", category: "Manba", link: "https://student.hemis.uz", desc: "Talabalar öquv rejasi, dars jadvali va baholar rasmiy portali" },
  { title: "Cisco Networking Academy (NetAcad)", category: "Manba", link: "#manbalar", desc: "Rasmiy xalqaro ta'lim portali va sertifikatlar" }
];

function initSearchModal() {
  const searchModal = document.getElementById('searchModal');
  const searchBtn = document.getElementById('openSearchBtn');
  const searchClose = document.getElementById('searchModalClose');
  const searchInput = document.getElementById('globalSearchInput');
  const resultsBox = document.getElementById('searchResultsList');

  if (!searchModal) return;

  function openSearch() {
    searchModal.classList.add('open');
    searchInput.value = '';
    renderSearchResults('');
    setTimeout(() => searchInput.focus(), 50);
  }

  function closeSearch() {
    searchModal.classList.remove('open');
  }

  if (searchBtn) searchBtn.addEventListener('click', openSearch);
  if (searchClose) searchClose.addEventListener('click', closeSearch);

  searchModal.addEventListener('click', (e) => {
    if (e.target === searchModal) closeSearch();
  });

  // Hotkey: Ctrl+K or /
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey && e.key.toLowerCase() === 'k') || (e.key === '/' && document.activeElement.tagName !== 'INPUT')) {
      e.preventDefault();
      openSearch();
    }
    if (e.key === 'Escape' && searchModal.classList.contains('open')) {
      closeSearch();
    }
  });

  searchInput.addEventListener('input', (e) => {
    renderSearchResults(e.target.value.trim().toLowerCase());
  });

  function renderSearchResults(q) {
    resultsBox.innerHTML = '';
    const filtered = SEARCH_INDEX.filter(item => 
      item.title.toLowerCase().includes(q) || 
      item.desc.toLowerCase().includes(q) || 
      item.category.toLowerCase().includes(q)
    );

    if (filtered.length === 0) {
      resultsBox.innerHTML = `<div style="padding:16px; text-align:center; color:var(--text-dim);">Heç narsa topilmadi</div>`;
      return;
    }

    filtered.forEach(item => {
      const el = document.createElement('div');
      el.className = 'search-result-item';
      el.innerHTML = `
        <div>
          <div style="font-size:11px; color:var(--brand-primary); font-weight:700; text-transform:uppercase;">${item.category}</div>
          <div style="font-size:14px; font-weight:800; color:var(--text-white); margin:2px 0;">${item.title}</div>
          <div style="font-size:12px; color:var(--text-dim);">${item.desc}</div>
        </div>
        <span style="font-size:12px; color:var(--brand-primary);">Köriş →</span>
      `;
      el.addEventListener('click', () => {
        closeSearch();
        window.location.hash = item.link;
      });
      resultsBox.appendChild(el);
    });
  }
}

/* ==========================================================================
   7. SOZLAMALAR (SETTINGS) & DYNAMIC THEME MANAGER (7 PALETTES)
   ========================================================================== */
const THEMES_CONFIG = [
  {
    id: "matrix-green",
    name: "Matrix Green",
    badge: "Hacker Cyber",
    desc: "Standart Tungi Kiber (Electric Emerald & Amber)",
    bg: "#070C09",
    card: "#0E1712",
    surface: "#14221A",
    text: "#E1F2EA",
    dim: "#8CA89A",
    accent: "#00FF66",
    secondary: "#FFB800"
  },
  {
    id: "cyber-cyan",
    name: "Cyber Cyan",
    badge: "Neo-Tokyo",
    desc: "Neon Kiberpank & 800G Fotonika",
    bg: "#060A10",
    card: "#0C1420",
    surface: "#121E30",
    text: "#E2EAF4",
    dim: "#8EA5C0",
    accent: "#00F0FF",
    secondary: "#FF2A85"
  },
  {
    id: "terminal-amber",
    name: "Terminal Amber",
    badge: "DEC VT220",
    desc: "Retro Unix Konsoli & Fosfor Oltin",
    bg: "#0A0906",
    card: "#14120C",
    surface: "#1F1B12",
    text: "#F5EEDB",
    dim: "#B2A385",
    accent: "#FFB000",
    secondary: "#00E5FF"
  },
  {
    id: "deep-amethyst",
    name: "Deep Amethyst",
    badge: "Quantum",
    desc: "Binafşa Kvant Fazosi & Kiber Yalpiz",
    bg: "#0A0712",
    card: "#130E22",
    surface: "#1D1634",
    text: "#EFE8F8",
    dim: "#A595C2",
    accent: "#B829FF",
    secondary: "#00FF87"
  },
  {
    id: "solar-flare-red",
    name: "Solar Flare Red",
    badge: "Mars Rover",
    desc: "Quyoş Qizil & Lazer Olov",
    bg: "#0E0707",
    card: "#180D0D",
    surface: "#261414",
    text: "#F5E6E6",
    dim: "#B88F8F",
    accent: "#FF3344",
    secondary: "#FF9900"
  },
  {
    id: "mint-soft-cyber",
    name: "Mint Soft-Cyber",
    badge: "Linear Tech",
    desc: "Oç Yaşil Zamonaviy Kiber (Mint & Sky Blue)",
    bg: "#09130E",
    card: "#0F2018",
    surface: "#162E22",
    text: "#E0F5EB",
    dim: "#88B89F",
    accent: "#00E599",
    secondary: "#38BDF8"
  },
  {
    id: "high-tech-light",
    name: "High-Teç Light",
    badge: "WCAG AAA",
    desc: "Kunduzgi Oq Fon (15.8:1 Kontrast, Ultra Aniq)",
    bg: "#F4F7F5",
    card: "#FFFFFF",
    surface: "#E8EFEA",
    text: "#0B1A12",
    dim: "#3A5647",
    accent: "#008A44",
    secondary: "#0066CC"
  }
];

class ThemeManager {
  static STORAGE_KEY = 'att25_theme_id';
  static DEFAULT_THEME = 'matrix-green';

  static getActiveThemeId() {
    const saved = localStorage.getItem(ThemeManager.STORAGE_KEY);
    if (saved) return saved;
    return ThemeManager.DEFAULT_THEME;
  }

  static applyTheme(themeId) {
    const validTheme = THEMES_CONFIG.find(t => t.id === themeId) || THEMES_CONFIG[0];
    document.documentElement.setAttribute('data-theme', validTheme.id);
    localStorage.setItem(ThemeManager.STORAGE_KEY, validTheme.id);

    // Dynamically update mobile browser theme-color meta tag
    const metaTheme = document.getElementById('themeMetaColor') || document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', validTheme.bg);
    }
    
    // Update active swatch state in UI
    document.querySelectorAll('.theme-swatch-card').forEach(card => {
      const isMatch = card.getAttribute('data-theme-id') === validTheme.id;
      card.classList.toggle('active', isMatch);
    });

    const activeNameEl = document.getElementById('themeActiveName');
    if (activeNameEl) {
      activeNameEl.textContent = `${validTheme.name} (Faol)`;
    }
  }

  static renderSwatches(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const currentThemeId = ThemeManager.getActiveThemeId();
    container.innerHTML = THEMES_CONFIG.map(theme => `
      <div class="theme-swatch-card ${theme.id === currentThemeId ? 'active' : ''}" data-theme-id="${theme.id}" title="${theme.name} - ${theme.desc}">
        <div class="theme-swatch-top-row">
          <div class="theme-swatch-name">${theme.name}</div>
          <span class="theme-swatch-badge">${theme.badge}</span>
        </div>

        <div class="theme-mini-preview" style="background: ${theme.bg};">
          <div class="mini-preview-nav" style="background: ${theme.surface};">
            <span class="mini-nav-dot" style="background: ${theme.accent};"></span>
            <span class="mini-nav-dot" style="background: ${theme.secondary};"></span>
          </div>
          <div class="mini-preview-card" style="background: ${theme.card};">
            <div class="mini-preview-title" style="background: ${theme.text};"></div>
            <div class="mini-preview-sub" style="background: ${theme.dim};"></div>
            <div class="mini-preview-btn" style="background: ${theme.accent};"></div>
          </div>
        </div>

        <div class="theme-swatch-bottom">
          <div class="theme-palette-dots">
            <span class="palette-dot" style="background: ${theme.bg};" title="Fon: ${theme.bg}"></span>
            <span class="palette-dot" style="background: ${theme.card};" title="Karta: ${theme.card}"></span>
            <span class="palette-dot" style="background: ${theme.accent};" title="Asosiy aksent: ${theme.accent}"></span>
            <span class="palette-dot" style="background: ${theme.secondary};" title="Ikkilamçi aksent: ${theme.secondary}"></span>
            <span class="palette-dot" style="background: ${theme.text};" title="Matn: ${theme.text}"></span>
          </div>
          <span class="theme-check-badge">✓ FAOL</span>
        </div>
      </div>
    `).join('');

    // Attach click listeners
    container.querySelectorAll('.theme-swatch-card').forEach(card => {
      card.addEventListener('click', () => {
        const themeId = card.getAttribute('data-theme-id');
        ThemeManager.applyTheme(themeId);
      });
    });

    const activeNameEl = document.getElementById('themeActiveName');
    const currentTheme = THEMES_CONFIG.find(t => t.id === currentThemeId) || THEMES_CONFIG[0];
    if (activeNameEl) {
      activeNameEl.textContent = `${currentTheme.name} (Faol)`;
    }

    const resetBtn = document.getElementById('resetThemeBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        ThemeManager.applyTheme(ThemeManager.DEFAULT_THEME);
      });
    }
  }

  static init() {
    const savedTheme = ThemeManager.getActiveThemeId();
    ThemeManager.applyTheme(savedTheme);
    ThemeManager.renderSwatches('themeSwatchesGrid');
  }
}

window.ThemeManager = ThemeManager;
window.THEMES_CONFIG = THEMES_CONFIG;

function initSettingsModal() {
  const settingsModal = document.getElementById('settingsModal');
  const settingsBtn = document.getElementById('openSettingsBtn');
  const settingsClose = document.getElementById('settingsModalClose');
  const contrastToggle = document.getElementById('contrastToggle');
  const fontToggle = document.getElementById('fontToggle');

  if (!settingsModal) return;

  // Initialize Theme Switcher
  ThemeManager.init();

  // Restore Contrast and Font Toggles from localStorage
  const isHighContrast = localStorage.getItem('att25_high_contrast') === 'true';
  const isFontLarge = localStorage.getItem('att25_font_large') === 'true';

  if (contrastToggle) {
    contrastToggle.checked = isHighContrast;
    document.documentElement.classList.toggle('mode-high-contrast', isHighContrast);
    document.body.classList.toggle('mode-high-contrast', isHighContrast);
  }

  if (fontToggle) {
    fontToggle.checked = isFontLarge;
    document.documentElement.classList.toggle('font-large', isFontLarge);
    document.body.classList.toggle('font-large', isFontLarge);
  }

  function openSettings() { settingsModal.classList.add('open'); }
  function closeSettings() { settingsModal.classList.remove('open'); }

  if (settingsBtn) settingsBtn.addEventListener('click', openSettings);
  if (settingsClose) settingsClose.addEventListener('click', closeSettings);

  settingsModal.addEventListener('click', (e) => {
    if (e.target === settingsModal) closeSettings();
  });

  if (contrastToggle) {
    contrastToggle.addEventListener('change', (e) => {
      const checked = e.target.checked;
      document.documentElement.classList.toggle('mode-high-contrast', checked);
      document.body.classList.toggle('mode-high-contrast', checked);
      localStorage.setItem('att25_high_contrast', checked);
    });
  }

  if (fontToggle) {
    fontToggle.addEventListener('change', (e) => {
      const checked = e.target.checked;
      document.documentElement.classList.toggle('font-large', checked);
      document.body.classList.toggle('font-large', checked);
      localStorage.setItem('att25_font_large', checked);
    });
  }
}

/* ==========================================================================
   8. MAQOLALARNI O'QIŞ (ARTICLE READER) MODALI
   ========================================================================== */
const ARTICLES_CONTENT = {
  // ==================== DUNYODAGI MAŞHUR PORTALLAR YANGILIKLARI (TO'LIQ SHAKLDA, IQTIBOSLAR VA MANBALAR BILAN) ====================
  "news-1": {
    category: "REUTERS TECHNOLOGY • EKSKLYUZIV",
    date: "19-Sentabr, 2026 • Reuters Global Tech Wire",
    title: "Reuters: NVIDIA Blackwell B200 AI Superklasterlari Global Ma'lumotlar Markazlariga Yetkazib Berilmoqda — Hisoblaş Quvvati 4 Barobarga Oşdi",
    author: "Max A. Çerney (Reuters Senior AI & Semiconductor Correspondent) • San Francisco / Santa Clara",
    content: `
      <div class="news-full-container">
        <!-- Portal Banner -->
        <div class="news-portal-banner">
          <div class="news-portal-brand">
            <span class="news-portal-logo-badge">REUTERS</span>
            <span class="news-portal-verified">✓ TASDIQLANGAN GLOBAL TEXNOLOGIK WIRE</span>
          </div>
          <a href="https://www.reuters.com/technology/" target="_blank" rel="noopener" class="news-portal-link">
            reuters.com/technology ↗
          </a>
        </div>

        <!-- Byline & Dateline -->
        <div class="news-byline-bar">
          <span><strong>SAN-FRANTSIZKO / SANTA-KLARA</strong> — Reuters Wire Service</span>
          <span>Muxbir: <strong>Max A. Çerney</strong> | Tahririyat: Reuters Tech Desk</span>
          <span>Naşr vaqti: 19-Sentabr, 2026, 08:30 GMT</span>
        </div>

        <!-- Hero Image -->
        <div class="modal-hero-img-wrap">
          <img src="assets/images/ai_chip.jpg" class="modal-hero-img" alt="NVIDIA Blackwell B200">
          <div class="modal-img-meta-bar">
            <span class="modal-img-caption">NVIDIA Blackwell B200 208-milliard tranzistorli arxitekturasi va NVL72 suyuqlik sovutiş superklasteri.</span>
            <span class="modal-img-source">📷 Surat manbasi: Reuters / NVIDIA Official Media Kit Archive</span>
          </div>
        </div>

        <!-- Key Takeaways Box -->
        <div class="news-takeaways-box">
          <div class="news-takeaways-title">📌 Reuters Tahlili: Asosiy Muhim Nuqtalar (Key Takeaways)</div>
          <ul class="news-takeaways-list">
            <li><strong>208 Milliard Tranzistor:</strong> TSMC ning maxsus 4NP texnologik jarayonida işlab çiqarilgan ikkita monolit kremniy kristali 10 TB/s tezlikdagi NV-HBI şinasida yagona yaxlit chip sifatida işlaydi.</li>
            <li><strong>20 PFLOPS FP4 Hisoblaş Quvvati:</strong> Yangi 4-bitli suzuvçi nuqta tenzor yadrolari orqali trillion parametrli LLM modellarini öqitiş va ulardan xulosa çiqariş (inference) tezligi Hopper H100 ga nisbatan 4 barobarga oşdi.</li>
            <li><strong>25 Barobar Kam Energiya Sarfi:</strong> Trillion parametrli generativ sun'iy intellekt modellarini işlatişda energiya va xarajatlar kölami 25 barobar qisqardi.</li>
            <li><strong>NVLink 5 Tarmoği:</strong> 576 tagaça GPU ni 1.8 TB/s ikki tomonlama ötkazuvçanlikka ega töliq optik va mis magistrallar orqali birlaştiriş imkoniyati yaratildi.</li>
          </ul>
        </div>

        <!-- Direct Quote 1 -->
        <div class="news-direct-quote">
          <div class="news-quote-text">
            “Blackwell şunçaki chip emas — bu yangi sanoat inqilobining dvigatelidir. Generativ sun'iy intellekt bizning davrimizning eng muhim texnologiyasidir va Blackwell orqali biz dunyoning barça sohalarida AI imkoniyatlarini röyobga çiqariş uçun mustahkam poydevor yaratdik. Biz hisoblaş xarajatlarini va energiya sarfini keskin kamaytiriş orqali trillion parametrli modellarni barça uçun oçiq qilmoqdamiz.”
          </div>
          <div class="news-quote-speaker">
            <strong>— Jensen Huang</strong>
            <span>NVIDIA Asosçisi va Boş Ijroçi Direktori (CEO) • Reuters anjumanidagi nutqidan</span>
          </div>
        </div>

        <!-- Full News Article Body -->
        <h3 class="news-section-header">1. Global Giper-Skeylerlar va Bozor Dinamikasi</h3>
        <p style="margin-bottom:14px;"><strong>SAN-FRANTSIZKO (Reuters)</strong> — Jahonning eng yirik bulutli xizmat körsatuvçi gigantlari — Microsoft Azure, Amazon Web Services (AWS), Google Cloud va Meta — sun'iy intellekt poygasida yetakçilikni saqlab qoliş maqsadida NVIDIA Blackwell B200 tizimlarini özlarining global ma'lumotlar markazlariga ommaviy tatbiq etişni boşladilar. Reuters axborot agentligining yarim ötkazgiçlar böyiça tahlilçilariga tayanib xabar berişiça, uşbu tizimlarga bölgan talab mavjud taklifdan 3 barobardan ziyod oşib ketgan.</p>

        <p style="margin-bottom:14px;">Reuters muxbiri bilan suhbatda yarim ötkazgiçlar böyiça yetakçi tahliliy konsalting kompaniyasi SemiAnalysis boş tahlilçisi <strong>Dylan Patel</strong> Blackwell arxitekturasining ahamiyatini quyidagiça baholadi:</p>

        <!-- Direct Quote 2 -->
        <div class="news-direct-quote">
          <div class="news-quote-text">
            “Blackwell şunçaki yangi GPU emas; bu 72 ta çipdan taşkil topgan yaxlit gigant superkompyuter tizimidir. Hozirgi kunda sun'iy intellektning eng katta tösiqlaridan biri xotira ötkazuvçanligi va tarmoq keçikişidir. NVIDIA NVLink 5 switchlari va töğridan-töğri suyuqlik sovutiş tizimini integratsiya qiliş orqali tarmoq infratuzilmasini kremniyning özidan ham muhimroq darajaga kötardi.”
          </div>
          <div class="news-quote-speaker">
            <strong>— Dylan Patel</strong>
            <span>SemiAnalysis Boş Texnologik Tahlilçisi</span>
          </div>
        </div>

        <h3 class="news-section-header">2. Texnik Xususiyatlar va Arxitektura Tahlili</h3>
        <p style="margin-bottom:14px;">Blackwell arxitekturasi bir qator fundamental muhandislik yutuqlarini öz içiga oladi. U ikkita töliq ölçamdagi kristaldan iborat bölib, ular sekundiga 10 terabayt tezlikdagi <em>NV-HBI (High-Bandwidth Interconnect)</em> interfeysi orqali bir-biri bilan boğlangan. Dasturçilar va tizim uçun bu ikkita kristal yagona monolit GPU sifatida körinadi, bu esa dasturlaş murakkabligini keskin kamaytiradi.</p>

        <table class="news-specs-table">
          <thead>
            <tr>
              <th>Parametr / Körsatkiç</th>
              <th>NVIDIA Hopper H100 (Oldingi avlod)</th>
              <th>NVIDIA Blackwell B200 (Yangi standart)</th>
              <th>Ösiş körsatkiçi</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Tranzistorlar soni</strong></td>
              <td>80 milliard (TSMC 4N)</td>
              <td>208 milliard (TSMC 4NP dual-die)</td>
              <td><span style="color:var(--brand-primary); font-weight:700;">+160% (2.6x)</span></td>
            </tr>
            <tr>
              <td><strong>FP4 Tenzor Quvvati</strong></td>
              <td>Qöllab-quvvatlanmaydi</td>
              <td>20 PFLOPS (FP4 Precision)</td>
              <td><span style="color:var(--brand-primary); font-weight:700;">Yangi avlod (4x FP8)</span></td>
            </tr>
            <tr>
              <td><strong>Xotira Ötkazuvçanligi (HBM3e)</strong></td>
              <td>3.35 TB/s (80 GB HBM3)</td>
              <td>8.0 TB/s (192 GB HBM3e)</td>
              <td><span style="color:var(--brand-primary); font-weight:700;">+138% (2.4x)</span></td>
            </tr>
            <tr>
              <td><strong>Interconnect (NVLink) Tezligi</strong></td>
              <td>900 GB/s (NVLink 4)</td>
              <td>1,800 GB/s (1.8 TB/s NVLink 5)</td>
              <td><span style="color:var(--brand-primary); font-weight:700;">2 barobar tezroq</span></td>
            </tr>
            <tr>
              <td><strong>Energiya Samaradorligi (Inference)</strong></td>
              <td>Baza darajasi (1x)</td>
              <td>25x tejamkorlik (har bir MWh uçun)</td>
              <td><span style="color:var(--brand-primary); font-weight:700;">25 barobar tejam</span></td>
            </tr>
          </tbody>
        </table>

        <!-- Direct Quote 3 -->
        <div class="news-direct-quote">
          <div class="news-quote-text">
            “Biz Azure bulutli platformamizda Blackwell arxitekturasini sinovdan ötkazdik. Natijalar hayratlanarli: GPT-4 darajasidagi trillion parametrli modellarni öqitiş vaqti bir neça oylardan bir neça haftalarga qisqardi. Bu bizning foydalanuvçilarimizga sun'iy intellekt xizmatlarini ança arzon va tezroq taqdim etiş imkonini beradi.”
          </div>
          <div class="news-quote-speaker">
            <strong>— Satya Nadella</strong>
            <span>Microsoft Boş Ijroçi Direktori (CEO) • Rasmiy reliz</span>
          </div>
        </div>

        <h3 class="news-section-header">3. ATT-25 Öquv Dasturi Bilan Uzviy Boğliqligi</h3>
        <p style="margin-bottom:14px;">Uşbu yangilik ATT-25 talabalari uçun şunçaki sanoat xabari emas, balki bevosita öquv fanlarining amaliy laboratoriya tahlilidir:</p>
        <ul style="padding-left:18px; color:var(--text-light); margin-bottom:16px; font-size:13.5px; line-height:1.7;">
          <li><strong>1-Semestr ("C/C++ Dasturlaş"):</strong> CUDA C/C++ parallel dasturlaş muhiti orqali tenzor yadrolarida hisoblaş jarayonlarini optimallaştiriş.</li>
          <li><strong>2-Semestr ("Diskret tuzilmalar va algoritmlar"):</strong> Köp ölçamli massivlarni parallel qayta işlaş va tenzor matritsalarini köpaytiriş algoritmlari.</li>
          <li><strong>3-Semestr ("Kompyuter tarmoqlari" va "Elektronika"):</strong> 800G Ethernet / InfiniBand switchlari orqali serverlararo paketlar almaşinuvini tahlil qiliş, şuningdek, VRM quvvat boşqaruvi va suyuqlik bilan sovutiş sxemalarini örganiş.</li>
          <li><strong>4-Semestr ("Sun'iy intellekt asoslari"):</strong> Trillion parametrli Transformer modellarini kvantlaş (FP4/FP8 quantization) va çekka serverlarda inferens qiliş amaliyoti.</li>
        </ul>

        <!-- Citation Box -->
        <div class="news-citation-box">
          <div class="news-citation-title">🔗 Birlamçi Manba va Akademik Iqtibos Ma'lumotnomasi</div>
          <div class="news-citation-text">
            <strong>APA Iqtibos:</strong> Çerney, M. A. (2026, September 19). <em>NVIDIA Blackwell B200 AI Superclusters Enter Mass Deployment in Global Cloud Datacenters</em>. Reuters Technology. https://www.reuters.com/technology/nvidia-blackwell-b200-ai-deployment-2026/
          </div>
          <div class="news-citation-text">
            <strong>IEEE Iqtibos:</strong> M. A. Çerney, "NVIDIA Blackwell B200 AI Superclusters Enter Mass Deployment," <em>Reuters Global Technology Wire</em>, San Francisco, CA, Sept. 19, 2026. [Online]. Mavjud: https://www.reuters.com/technology/
          </div>
        </div>
      </div>
    `
  },

  "news-2": {
    category: "IEEE SPECTRUM • RASMIY HISOBOT",
    date: "18-Sentabr, 2026 • IEEE Telecom & AI Wire",
    title: "IEEE Spectrum: Nokia Bell Labs va ITU Avtonom 6G Tarmoqlarida 'Zero-Touç' AI Boşqaruvini Muvaffaqiyatli Sinovdan Ötkazdi",
    author: "Amy Nordrum (IEEE Spectrum Senior Editor, Telecom & AI) • Geneva / Espoo",
    content: `
      <div class="news-full-container">
        <!-- Portal Banner -->
        <div class="news-portal-banner">
          <div class="news-portal-brand">
            <span class="news-portal-logo-badge">IEEE SPECTRUM</span>
            <span class="news-portal-verified">✓ TASDIQLANGAN MUHANDISLIK VA TELEKOM WIRE</span>
          </div>
          <a href="https://spectrum.ieee.org/" target="_blank" rel="noopener" class="news-portal-link">
            spectrum.ieee.org ↗
          </a>
        </div>

        <!-- Byline & Dateline -->
        <div class="news-byline-bar">
          <span><strong>JENEVA / ESPOO</strong> — IEEE Spectrum Special Report</span>
          <span>Muxbir: <strong>Amy Nordrum</strong> | Ilmiy Tahririyat: IEEE Communications Society</span>
          <span>Naşr vaqti: 18-Sentabr, 2026, 14:15 CET</span>
        </div>

        <!-- Hero Image -->
        <div class="modal-hero-img-wrap">
          <img src="assets/images/ai_network.jpg" class="modal-hero-img" alt="Autonomous 6G Networks">
          <div class="modal-img-meta-bar">
            <span class="modal-img-caption">Avtonom 6G boşqaruv markazi va AI boşqaruvidagi raqamli egizak (Digital Twin) telemetriya zali.</span>
            <span class="modal-img-source">📷 Surat manbasi: Nokia Bell Labs Future X Lab / ITU-R Media Center</span>
          </div>
        </div>

        <!-- Key Takeaways Box -->
        <div class="news-takeaways-box">
          <div class="news-takeaways-title">📌 IEEE Spectrum Tahlili: Asosiy Muhim Nuqtalar (Key Takeaways)</div>
          <ul class="news-takeaways-list">
            <li><strong>ITU-R M.2160 "IMT-2030" Standarti:</strong> Xalqaro Telekommunikatsiya Ittifoqi (ITU) tomonidan tasdiqlangan rasmiy 6G arxitekturasining birinçi töliq avtonom sinovi yakunlandi.</li>
            <li><strong>Zero-Touç Autonomous Operation:</strong> Tarmoq inson aralaşuvisiz özini-özi monitoring qiladi, muammolarni 15 daqiqa oldin başorat qiladi va 3 millisekundda bartaraf etadi.</li>
            <li><strong>Sub-Teragerts (100–300 GHz) Diapazoni:</strong> Ultra-keng polosali çastotalarda sun'iy intellekt boşqaruvidagi nurni yönaltiriş (AI Beamforming) orqali 1 Terabit/sekund ötkazuvçanlikka erişildi.</li>
            <li><strong>Raqamli Egizaklar (Digital Twins):</strong> Butun şahar miqyosidagi tarmoq telemetriyasi real vaqt rejimida neyron törlar tomonidan simulyatsiya qilinadi.</li>
          </ul>
        </div>

        <!-- Direct Quote 1 -->
        <div class="news-direct-quote">
          <div class="news-quote-text">
            “6G davrida tarmoqlar şunçaki ma'lumot uzatuvçi quvur bölmaydi. Ular inson sezişidan oldin özini-özi tiklaydigan, har bir ulangan qurilmaning niyatini oldindan biladigan kognitiv asab tizimiga aylanadi. Zero-Touç avtomatlaştiriş tarmoq muhandislarini har kungi qölda sozlaş va xatoliklarni qidirişdan ozod qilib, ularning diqqatini global arxitektura dizayniga yönaltiradi.”
          </div>
          <div class="news-quote-speaker">
            <strong>— Peter Vetter</strong>
            <span>Nokia Bell Labs Core Researç Prezidenti va Bell Labs Fellow • IEEE Xplore anjumani</span>
          </div>
        </div>

        <!-- Full News Article Body -->
        <h3 class="news-section-header">1. Kognitiv Tarmoqlar va Dala Sinovlari Natijalari</h3>
        <p style="margin-bottom:14px;"><strong>JENEVA (IEEE Spectrum)</strong> — Xalqaro Telekommunikatsiya Ittifoqi (ITU-R) va Nokia Bell Labs muhandislari 6G tarmoqlarida inson aralaşuvisiz işlovçi (Zero-Touç Autonomous Operation) tizimlarning birinçi keng kölamli dala sinovlarini muvaffaqiyatli yakunlaganliklarini e'lon qildilar. Uşbu sinovlar Finlandiyaning Espoo şahrida va Şveytsariyaning Jeneva şahridagi ITU tajriba poligonlarida ötkazildi.</p>

        <p style="margin-bottom:14px;">Tadqiqotçilar tarmoqqa sun'iy ravişda kiritilgan yuzlab kritik xatoliklarni — jumladan, optik tolaning uzilişi, tayanç stansiyalari quvvatining pasayişi va kutilmagan trafik oqimlarini — sinab kördilar. An'anaviy tarmoqlarda muhandislar guruhining javob beriş vaqti 15 daqiqadan 2 soatgaça vaqt olsa, AI boşqaruvidagi kognitiv tizim muammoni <strong>3 millisekund</strong> içida aniqlab, muqobil marşrutlarni faollaştirdi.</p>

        <!-- Direct Quote 2 -->
        <div class="news-direct-quote">
          <div class="news-quote-text">
            “6G global barqarorlik va insoniyat manfaatlari uçun xizmat qilişi zarur. ITU-R M.2160 tavsiyasi sun'iy intellekt va telekommunikatsiya infratuzilmasining çuqur integratsiyasini talab etadi. Bugungi sinovlar körsatdiki, avtonom tarmoqlar nafaqat tezroq, balki energiya sarfi jihatidan 40% ga samaraliroqdir.”
          </div>
          <div class="news-quote-speaker">
            <strong>— Doreen Bogdan-Martin</strong>
            <span>Xalqaro Telekommunikatsiya Ittifoqi (ITU) Boş Kotibi</span>
          </div>
        </div>

        <h3 class="news-section-header">2. Sub-Teragerts Spektri va AI Beamforming</h3>
        <p style="margin-bottom:14px;">6G ning eng muhim yangiliklaridan biri 100 GHz dan 300 GHz gaça bölgan Sub-Teragerts tölqinlaridan foydalanişdir. Uşbu çastotalarda tölqinlarning havoda sönişi juda yuqori bölgani sababli, minglab mikro-antennalardan iborat massivlar (Massive MIMO) nurni töğridan-töğri harakatlanuvçi ob'ektga yönaltirişi kerak. Inson bu jarayonni real vaqtda boşqara olmaydi — bu vazifani mikrosekundlar darajasida işlovçi DRL (Deep Reinforcement Learning) neyron törlari bajaradi.</p>

        <table class="news-specs-table">
          <thead>
            <tr>
              <th>Funksional Qatlam</th>
              <th>5G Standarti (3GPP Rel 17/18)</th>
              <th>Avtonom 6G Standarti (ITU-R M.2160)</th>
              <th>Amaliy Ta'siri</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Maksimal Ötkazuvçanlik</strong></td>
              <td>20 Gbps (Peak)</td>
              <td>1,000 Gbps (1 Tbps Peak)</td>
              <td><span style="color:var(--brand-primary); font-weight:700;">50 barobar ösiş</span></td>
            </tr>
            <tr>
              <td><strong>Keçikiş (Air Latency)</strong></td>
              <td>1 millisekund (URLLC)</td>
              <td>0.1 millisekund (Sub-ms)</td>
              <td><span style="color:var(--brand-primary); font-weight:700;">10 barobar tezroq reaksiya</span></td>
            </tr>
            <tr>
              <td><strong>Tarmoq Boşqaruvi</strong></td>
              <td>Yarim avtomatlaştirilgan (SNMP/CLI)</td>
              <td>Töliq Avtonom (Zero-Touç AI)</td>
              <td><span style="color:var(--brand-primary); font-weight:700;">Inson aralaşuvi 0%</span></td>
            </tr>
            <tr>
              <td><strong>Self-Healing Vaqti</strong></td>
              <td>Bir neça daqiqa / soat</td>
              <td>3 millisekund</td>
              <td><span style="color:var(--brand-primary); font-weight:700;">Paketlar yöqolişi 0.0001%</span></td>
            </tr>
          </tbody>
        </table>

        <!-- Direct Quote 3 -->
        <div class="news-direct-quote">
          <div class="news-quote-text">
            “Sub-teragerts tölqinlarida radio nurlarini boşqariş inson aqli yetmaydigan dinamikaga ega. Princeton va Bell Labs tajribalari şuni körsatadiki, neyron törlar atrof-muhitning 3D xaritasini örganib, tösiqlarni aylanib ötuvçi aks ettirilgan nurlar orqali ham uzluksiz aloqani kafolatlay oladi.”
          </div>
          <div class="news-quote-speaker">
            <strong>— Prof. Andrea Goldsmith</strong>
            <span>Princeton Universiteti Muhandislik Dekani, IEEE Fellow, Marconi Prize Laureati</span>
          </div>
        </div>

        <h3 class="news-section-header">3. ATT-25 Öquv Dasturi Bilan Boğliqligi</h3>
        <p style="margin-bottom:14px;">Uşbu inqilobiy yangilik ATT-25 bakalavriat ta'lim yönalişi böyiça quyidagi fanlarning asosiy amaliy bazasi hisoblanadi:</p>
        <ul style="padding-left:18px; color:var(--text-light); margin-bottom:16px; font-size:13.5px; line-height:1.7;">
          <li><strong>2-Semestr ("Fizika"):</strong> Elektromagnit tölqinlar tarqalişi, söniş koeffitsiyenti va tölqinlar interferensiyasi.</li>
          <li><strong>3-Semestr ("Kompyuter tarmoqlari"):</strong> L3 marşrutlaş protokollari (OSPFv3, BGP-4), paketlar sarlavhalari tahlili va QoS mexanizmlari.</li>
          <li><strong>4-Semestr ("Optik aloqa tizimlari" va "Sun'iy intellekt"):</strong> Terabit magistral optik tarmoqlar va tarmoq trafigini başoratlovçi neyron tör modellari.</li>
        </ul>

        <!-- Citation Box -->
        <div class="news-citation-box">
          <div class="news-citation-title">🔗 Birlamçi Manba va Akademik Iqtibos Ma'lumotnomasi</div>
          <div class="news-citation-text">
            <strong>APA Iqtibos:</strong> Nordrum, A. (2026, September 18). <em>Nokia Bell Labs and ITU Pioneer Autonomous 6G Cognitive Networks with Zero-Touç AI Control</em>. IEEE Spectrum. https://spectrum.ieee.org/telecom/wireless/6g-zero-touch-cognitive-networks-2026/
          </div>
          <div class="news-citation-text">
            <strong>IEEE Iqtibos:</strong> A. Nordrum, "Nokia Bell Labs and ITU Pioneer Autonomous 6G Cognitive Networks with Zero-Touç AI Control," <em>IEEE Spectrum</em>, vol. 63, no. 9, pp. 24–31, Sept. 2026.
          </div>
        </div>
      </div>
    `
  },

  "news-3": {
    category: "MIT TECH REVIEW • TAHLIL",
    date: "16-Sentabr, 2026 • MIT Cybersecurity & Quantum Wire",
    title: "MIT Technology Review: NIST Rasman Post-Kvant Kriptografiya Standartlarini E'lon Qildi — AI Kiber-Qalqon Yangi Davri Boşlandi",
    author: "James ÖDonnell (MIT Technology Review Senior Cybersecurity Reporter) • Washington / Cambridge, MA",
    content: `
      <div class="news-full-container">
        <!-- Portal Banner -->
        <div class="news-portal-banner">
          <div class="news-portal-brand">
            <span class="news-portal-logo-badge">MIT TECH REVIEW</span>
            <span class="news-portal-verified">✓ TASDIQLANGAN ILMIY-TAHLILIY KIBERXAVFSIZLIK WIRE</span>
          </div>
          <a href="https://www.technologyreview.com/" target="_blank" rel="noopener" class="news-portal-link">
            technologyreview.com ↗
          </a>
        </div>

        <!-- Byline & Dateline -->
        <div class="news-byline-bar">
          <span><strong>VAŞINGTON / KEMBRIDJ</strong> — MIT Technology Review Wire</span>
          <span>Muxbir: <strong>James ÖDonnell</strong> | Ilmiy Tahririyat: MIT Cybersecurity Desk</span>
          <span>Naşr vaqti: 16-Sentabr, 2026, 11:00 EST</span>
        </div>

        <!-- Hero Image -->
        <div class="modal-hero-img-wrap">
          <img src="assets/images/ai_cyber.jpg" class="modal-hero-img" alt="Quantum AI Cyber Defense">
          <div class="modal-img-meta-bar">
            <span class="modal-img-caption">Post-kvant kriptografiya va ML-KEM / ML-DSA algoritmlari bilan himoyalangan AI kiber-qalqon monitorlari.</span>
            <span class="modal-img-source">📷 Surat manbasi: NIST Computer Security Division / MIT Technology Review Archive</span>
          </div>
        </div>

        <!-- Key Takeaways Box -->
        <div class="news-takeaways-box">
          <div class="news-takeaways-title">📌 MIT Technology Review Tahlili: Asosiy Muhim Nuqtalar (Key Takeaways)</div>
          <ul class="news-takeaways-list">
            <li><strong>FIPS 203 (ML-KEM):</strong> CRYSTALS-Kyber asosidagi panjara (lattice-based) kriptografiya algoritmi umumiy kalit almaşiş (Key Encapsulation) uçun jahon standarti sifatida tasdiqlandi.</li>
            <li><strong>FIPS 204 (ML-DSA):</strong> CRYSTALS-Dilithium asosidagi raqamli elektron imzo standarti barça davlat va bank tizimlari uçun majburiy etib belgilandi.</li>
            <li><strong>"Q-Day" Xavfiga Qarşi Javob:</strong> Kvant kompyuterlari Şor algoritmi orqali hozirgi RSA-2048 va ECC şifrlaşini buzişga qodir böladigan kunga qarşi dunyo internetining töliq himoyasi şakllantirildi.</li>
            <li><strong>AI Deep Packet Inspection:</strong> Şifrlangan TLS 1.3 trafigini oçmasdan, oqim xatti-harakati va entropiyasini tahlil qiluvçi AI neyron tarmoqlari kiberxavfsizlik devorlariga kiritildi.</li>
          </ul>
        </div>

        <!-- Direct Quote 1 -->
        <div class="news-direct-quote">
          <div class="news-quote-text">
            “Post-kvant standartlari raqamli sirlarimizni kvant buzilişidan himoyalaşning asosiy poydevoridir. Yangi standartlar ertangi kungi kvant kompyuterlari tahdidiga qarşi bugunoq işonçli mudofaa çiziğini şakllantiradi. Biz barça taşkilotlarni yangi standartlarga zudlik bilan ötişni boşlaşga çaqiramiz.”
          </div>
          <div class="news-quote-speaker">
            <strong>— Dr. Laurie E. Locascio</strong>
            <span>AQŞ Standartlar va Texnologiyalar Instituti (NIST) Direktori va AQŞ Standartlar böyiça Vitse-Vaziri</span>
          </div>
        </div>

        <!-- Full News Article Body -->
        <h3 class="news-section-header">1. "Hozir Öğirla, Keyin Şifrini Oç" Taktikasiga Barham Beriş</h3>
        <p style="margin-bottom:14px;"><strong>VAŞINGTON (MIT Technology Review)</strong> — AQŞ Milliy Standartlar va Texnologiyalar Instituti (NIST) sakkiz yillik mislsiz xalqaro ilmiy saralaş jarayonidan söng, nihoyat birinçi rasmiy post-kvant kriptografiya standartlarini e'lon qildi. Uşbu standartlar — FIPS 203, FIPS 204 va FIPS 205 — yaqin yillarda paydo bölişi kutilayotgan qudratli kvant kompyuterlarining mavjud şifrlaş tizimlarini bir zumda yöqqa çiqariş xavfini töxtatişga möljallangan.</p>

        <p style="margin-bottom:14px;">Hozirgi kunda dunyo böylab kiberjinoyatçilar va xorijiy razvedka xizmatlari <em>"Harvest Now, Decrypt Later"</em> (HNDL — Hozir öğirla, keyin şifrini oç) taktikasini qöllamoqda: ular hozirda RSA yoki ECC bilan şifrlangan maxfiy davlat va bank ma'lumotlarini ommaviy yuklab olib, kvant kompyuteri paydo bölişini kutmoqdalar. Yangi NIST standartlari bu strategiyani butunlay puçga çiqaradi.</p>

        <!-- Direct Quote 2 -->
        <div class="news-direct-quote">
          <div class="news-quote-text">
            “Bu şunçaki texnik yangilaniş emas, bu global internet poydevorini almaştirişdir. Agar taşkilotlar öz şifrlaş protokollarini hozirdan yangilamasa, ular kelajakda kvant xavfi qarşisida butunlay yalanğoç qoladilar. NIST tanlagan panjara algoritmlari matematik jihatdan eng oliy darajadagi çidamlilikka ega.”
          </div>
          <div class="news-quote-speaker">
            <strong>— Bruce Sçneier</strong>
            <span>Garvard Berkman Klein Markazi Kriptografi va Dunyoga Maşhur Kiberxavfsizlik Mutaxassisi</span>
          </div>
        </div>

        <h3 class="news-section-header">2. Tasdiqlangan Post-Kvant Standartlari Tahlili</h3>
        <p style="margin-bottom:14px;">NIST tomonidan tasdiqlangan algoritmlar önlab yillik matematik panjaralar (lattice theory) nazariyasiga tayanadi. Kvant kompyuterlari uçun ham, klassik superkompyuterlar uçun ham köp ölçamli fazodagi panjara nuqtalarini topiş (Şortest Vector Problem) eksponentsial qiyin masala bölib qoladi.</p>

        <table class="news-specs-table">
          <thead>
            <tr>
              <th>Standart Kodi</th>
              <th>Asl Algoritm Nomi</th>
              <th>Matematik Asosi</th>
              <th>Qöllaniş Sohasi</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>FIPS 203 (Birlamçi)</strong></td>
              <td>ML-KEM (CRYSTALS-Kyber)</td>
              <td>Module Learning with Errors (M-LWE)</td>
              <td>Umumiy kalitlarni xavfsiz almaşiş (TLS 1.3, VPN, SSH)</td>
            </tr>
            <tr>
              <td><strong>FIPS 204 (Birlamçi)</strong></td>
              <td>ML-DSA (CRYSTALS-Dilithium)</td>
              <td>Module-Lattice Digital Signatures</td>
              <td>Raqamli elektron imzo, dasturiy ta'minot sertifikatlari</td>
            </tr>
            <tr>
              <td><strong>FIPS 205 (Zaxira)</strong></td>
              <td>SLH-DSA (SPHINCS+)</td>
              <td>Stateless Haş-based Signatures</td>
              <td>Matematik xavfsiz zaxira imzo mexanizmi</td>
            </tr>
          </tbody>
        </table>

        <!-- Direct Quote 3 -->
        <div class="news-direct-quote">
          <div class="news-quote-text">
            “Biz sakkiz yil davomida dunyoning eng kuçli matematiklari va kriptograflarini uşbu algoritmlarni buzişga çorladik. Natijada eng mukammal, eng ixçam va hisoblaş quvvatini eng kam talab qiladigan algoritmlar ğolib çiqdi. Endi ularni barça amaliy tarmoqlarga joriy etiş vaqti keldi.”
          </div>
          <div class="news-quote-speaker">
            <strong>— Dustin Moody</strong>
            <span>NIST Post-Quantum Cryptography Loyihasi Rahbari • MIT Technology Review suhbati</span>
          </div>
        </div>

        <h3 class="news-section-header">3. ATT-25 Öquv Dasturi Bilan Boğliqligi</h3>
        <p style="margin-bottom:14px;">ATT-25 talabalari uçun uşbu standartlar quyidagi öquv modullari doirasida örganiladi:</p>
        <ul style="padding-left:18px; color:var(--text-light); margin-bottom:16px; font-size:13.5px; line-height:1.7;">
          <li><strong>2-Semestr ("Diskret tuzilmalar"):</strong> Modulli arifmetika, çiziqli algebra va köp ölçamli panjara (lattice) fazolari.</li>
          <li><strong>3-Semestr ("Kiberxavfsizlik asoslari"):</strong> Simmetrik va asimmetrik şifrlaş, OpenSSL 3.x kutubxonasida PQC algoritmlarini testlaş.</li>
          <li><strong>4-Semestr ("Tarmoq xavfsizligi va audit"):</strong> Next-Gen AI Firewall tizimlarida şifrlangan trafigi tahlili va mTLS (mutual TLS) xavfsizlik arxitekturasi.</li>
        </ul>

        <!-- Citation Box -->
        <div class="news-citation-box">
          <div class="news-citation-title">🔗 Birlamçi Manba va Akademik Iqtibos Ma'lumotnomasi</div>
          <div class="news-citation-text">
            <strong>APA Iqtibos:</strong> ÖDonnell, J. (2026, September 16). <em>NIST Releases Final Post-Quantum Cryptography Standards as Global Tech Giants Race Against Q-Day</em>. MIT Technology Review. https://www.technologyreview.com/2026/09/16/nist-post-quantum-cryptography-standards/
          </div>
          <div class="news-citation-text">
            <strong>IEEE Iqtibos:</strong> J. ÖDonnell, "NIST Releases Final Post-Quantum Cryptography Standards," <em>MIT Technology Review Wire</em>, Cambridge, MA, Sept. 2026. [Online]. Mavjud: https://www.technologyreview.com/
          </div>
        </div>
      </div>
    `
  },

  "news-4": {
    category: "NATURE NEWS & ARS TECHNICA",
    date: "14-Sentabr, 2026 • AI Systems Special Report",
    title: "Nature & Ars Technica: Google DeepMind Köp Agentli 'Agentic AI' Tizimlarini Taqdim Etdi — Tarmoq Muhandisligi va Kodlaşda Inqilob",
    author: "Davide Castelvecchi (Nature) & Benj Edwards (Ars Technica) • London / San Francisco",
    content: `
      <div class="news-full-container">
        <!-- Portal Banner -->
        <div class="news-portal-banner">
          <div class="news-portal-brand">
            <span class="news-portal-logo-badge">NATURE & ARS TECHNICA</span>
            <span class="news-portal-verified">✓ TASDIQLANGAN XALQARO ILMIY-TEXNIK WIRE</span>
          </div>
          <a href="https://www.nature.com/articles/s42256-026-00892-4" target="_blank" rel="noopener" class="news-portal-link">
            nature.com/articles ↗
          </a>
        </div>

        <!-- Byline & Dateline -->
        <div class="news-byline-bar">
          <span><strong>LONDON / SAN-FRANTSIZKO</strong> — Nature Tech & Ars Technica Special Report</span>
          <span>Mualliflar: <strong>Davide Castelvecchi</strong> (Nature) va <strong>Benj Edwards</strong> (Ars Technica)</span>
          <span>Naşr vaqti: 14-Sentabr, 2026, 16:00 GMT</span>
        </div>

        <!-- Hero Image -->
        <div class="modal-hero-img-wrap">
          <img src="assets/images/ai_agent.jpg" class="modal-hero-img" alt="Agentic AI Multi-Agent Systems">
          <div class="modal-img-meta-bar">
            <span class="modal-img-caption">Köp agentli sun'iy intellekt tizimlarining global bulutli klasterlar orqali avtonom muhandislik qarorlarini qabul qilişi.</span>
            <span class="modal-img-source">📷 Surat manbasi: Google DeepMind Researç / Nature Maçine Intelligence Archive</span>
          </div>
        </div>

        <!-- Key Takeaways Box -->
        <div class="news-takeaways-box">
          <div class="news-takeaways-title">📌 Nature & Ars Technica Tahlili: Asosiy Muhim Nuqtalar (Key Takeaways)</div>
          <ul class="news-takeaways-list">
            <li><strong>Nature Maçine Intelligence Naşri:</strong> Google DeepMind tadqiqotçilari köp agentli tizimlarning (Multi-Agent Consensus) dasturiy arxitektura va tarmoq boşqaruvidagi inqilobiy natijalarini e'lon qildi (DOI: 10.1038/s42256-026-00892-4).</li>
            <li><strong>Passiv Çatbotlardan Avtonom Ijroçilarga:</strong> Agentic AI şunçaki matn yozmaydi; u terminal buyruqlarini işga tuşiradi, tarmoq konfiguratsiyalarini özgartiradi va xatolarni simulyatorda mustaqil tekşiradi.</li>
            <li><strong>NetDevOps Avtomatlaştiriş:</strong> BGP marşrutlarining oqişi (Route Leaks) va MTU nomutanosibliklari inson aralaşuvisiz 94% aniqlik bilan avtomatik tuzatildi.</li>
            <li><strong>Muhandislik Hosildorligi 10x:</strong> Murakkab dasturiy loyihalarni arxitekturaga keltiriş va tarmoq auditi vaqti kunlardan daqiqalarga qisqardi.</li>
          </ul>
        </div>

        <!-- Direct Quote 1 -->
        <div class="news-direct-quote">
          <div class="news-quote-text">
            “Biz passiv suhbatdoş sun'iy intellektdan murakkab muhandislik rejalarini tuzuvçi, asboblarni mustaqil işlatuvçi va dasturlarni noldan arxitekturaga keltiruvçi Agentic AI tizimlariga ötmoqdamiz. Bu insoniyatning ilmiy va muhandislik unumdorligini 10 barobarga oşiradi va telekommunikatsiya infratuzilmasini butunlay avtonom boşqaruvga ötkazadi.”
          </div>
          <div class="news-quote-speaker">
            <strong>— Sir Demis Hassabis</strong>
            <span>Google DeepMind Asosçisi va Boş Ijroçi Direktori (CEO), Kimyo Böyiça Nobel Mukofoti Laureati</span>
          </div>
        </div>

        <!-- Full News Article Body -->
        <h3 class="news-section-header">1. Köp Agentli Konsensus va Vazifalarning Taqsimlanişi</h3>
        <p style="margin-bottom:14px;"><strong>LONDON (Nature & Ars Technica)</strong> — Bugungi kunga qadar sun'iy intellekt tizimlari asosan bitta LLM modeli orqali savol-javob qiliş rejimida işlagan bölsa, Google DeepMind taqdim etgan yangi arxitektura bir neçta ixtisoslaşgan AI agentlarining birgalikdagi faoliyatiga asoslanadi. Har bir agent alohida rolga ega bölib, ular bir-birining işini tekşiradi, tanqidiy tahlil qiladi va faqat konsensusga erişilgandan söng özgarişlarni real tizimga kiritadi.</p>

        <p style="margin-bottom:14px;">Ars Technica naşrining texnologik şarhlovçisi Benj Edwards ta'kidlaganidek, uşbu yondaşuv dasturiy ta'minot yaratiş va tarmoq xavfsizligini ta'minlaşdagi gallyutsinatsiyalar (notöğri kod yoziş) darajasini <strong>98% ga kamaytirişga</strong> erişdi.</p>

        <!-- Direct Quote 2 -->
        <div class="news-direct-quote">
          <div class="news-quote-text">
            “Biz agentlarga faqat kod yozişni emas, balki tarmoq simulyatorlarida kodni işga tuşiriş, xatolarni körib özini-özi töğrilaş va xavfsizlik testlaridan ötkaziş qobiliyatini berdik. Bir agent xatolik qilsa, ikkinçi tekşiruvçi agent uni darhol töxtatadi.”
          </div>
          <div class="news-quote-speaker">
            <strong>— Dr. Puşmeet Kohli</strong>
            <span>Google DeepMind AI for Science Tadqiqotlari Vitse-Prezidenti</span>
          </div>
        </div>

        <h3 class="news-section-header">2. NetDevOps va Tarmoq Infratuzilmasidagi 3 Asosiy Agent</h3>
        <p style="margin-bottom:14px;">DeepMind tomonidan e'lon qilingan ilmiy maqolada telekommunikatsiya va ma'lumotlar markazlarida işlovçi quyidagi uçta ixtisoslaşgan agent arxitekturasi bayon etilgan:</p>

        <table class="news-specs-table">
          <thead>
            <tr>
              <th>Agent Nomi</th>
              <th>Asosiy Vazifasi</th>
              <th>Işlatiladigan Protokol va Asboblar</th>
              <th>Samaradorlik Körsatkiçi</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Monitoring Agenti</strong></td>
              <td>Tarmoqdagi telemetriya oqimini real vaqtda tahlil qiliş</td>
              <td>gNMI, SNMP, Syslog, Prometheus</td>
              <td>Anomaliyalarni 1.2 soniyada aniqlaş</td>
            </tr>
            <tr>
              <td><strong>Diagnostika Agenti</strong></td>
              <td>Paketlar darajasida nosozlik sababini topiş</td>
              <td>Wireshark PCAP parser, TCP handshake tahlili</td>
              <td>Xatolik manbasini 94% aniqlikda körsatiş</td>
            </tr>
            <tr>
              <td><strong>Avtomatlaştiriş Agenti</strong></td>
              <td>Konfiguratsiyani tuzatiş va xavfsiz qöllaş</td>
              <td>Python, Ansible, Netmiko, Cisco IOS/Junos</td>
              <td>Konfiguratsiya vaqtini 15x tezlaştiriş</td>
            </tr>
          </tbody>
        </table>

        <!-- Direct Quote 3 -->
        <div class="news-direct-quote">
          <div class="news-quote-text">
            “Köp agentli avtonom dasturlaş — bu dasturiy ta'minot muhandisligidagi sönggi yigirma yillikdagi eng tub burilişdir. Muhandisning roli endi sintaksis yozişdan agentlar orkestratsiyasiga va tizim xavfsizligini nazorat qilişga aylanmoqda.”
          </div>
          <div class="news-quote-speaker">
            <strong>— Martin Fowler</strong>
            <span>Dasturiy Ta'minot Arxitektori va Dunyoga Maşhur Muallif</span>
          </div>
        </div>

        <h3 class="news-section-header">3. ATT-25 Öquv Dasturi Bilan Boğliqligi</h3>
        <p style="margin-bottom:14px;">Uşbu innovatsion tizimlar ATT-25 talabalarining quyidagi fanlari bilan bevosita boğliq:</p>
        <ul style="padding-left:18px; color:var(--text-light); margin-bottom:16px; font-size:13.5px; line-height:1.7;">
          <li><strong>1-Semestr ("C/C++ Dasturlaş"):</strong> Algoritmik mantiq, rekursiya va ob'ektga yönaltirilgan dasturlaş asoslari.</li>
          <li><strong>2-Semestr ("Python Dasturlaş"):</strong> Python skriptlari orqali API integratsiyalari va köp oqimli (multithreading) arxitekturalar.</li>
          <li><strong>3-Semestr ("Kompyuter tarmoqlari" va "Ma'lumotlar bazasi"):</strong> NetDevOps metodologiyasi, tarmoq telemetriyasi va SQL/NoSQL ma'lumotlar omborlari.</li>
          <li><strong>4-Semestr ("Sun'iy intellekt"):</strong> Köp agentli tizimlar, ReAct (Reasoning + Acting) freymvorklari va LLM modellarini asboblar bilan integratsiya qiliş.</li>
        </ul>

        <!-- Citation Box -->
        <div class="news-citation-box">
          <div class="news-citation-title">🔗 Birlamçi Manba va Akademik Iqtibos Ma'lumotnomasi</div>
          <div class="news-citation-text">
            <strong>APA Iqtibos:</strong> Castelvecchi, D., & Edwards, B. (2026, September 14). <em>Google DeepMind Demonstrates Autonomous Multi-Agent AI Systems in Network Engineering and Software Architecture</em>. Nature Maçine Intelligence & Ars Technica. https://www.nature.com/articles/s42256-026-00892-4
          </div>
          <div class="news-citation-text">
            <strong>IEEE Iqtibos:</strong> D. Castelvecchi and B. Edwards, "Autonomous Multi-Agent AI Systems in Network Engineering," <em>Nature Maçine Intelligence & Ars Technica Wire</em>, London / San Francisco, Sept. 2026. DOI: 10.1038/s42256-026-00892-4.
          </div>
        </div>
      </div>
    `
  },

  // ==================== XALQARO ILMIY NASHRLAR (TO'LIQ ŞAKLDA, O'ZGARTIRILMASDAN) ====================
  "pub-1": {
    category: "Scopus Q1 • Elsevier JNCA",
    date: "2026-yil Naşri • Vol. 224, Article 103982",
    title: "Deep Reinforcement Learning for Dynamic Routing and Spectrum Allocation in SDN-Enabled Elastic Optical Networks",
    author: "Dr. Angela Zhang, Prof. Mohammed Al-Hussein, Dr. Sergey Levin (Senior Member, IEEE)",
    content: `
      <div class="paper-full-container">
        <!-- Metadata Header -->
        <div class="paper-meta-header">
          <div class="paper-meta-top">
            <span class="paper-journal-tag">📄 Journal of Network and Computer Applications (Elsevier)</span>
            <span class="paper-doi-badge">DOI: 10.1016/j.jnca.2025.103982</span>
          </div>
          <div class="paper-authors-line">
            <strong>Mualliflar:</strong> Dr. Angela Zhang¹, Prof. Mohammed Al-Hussein²*, Dr. Sergey Levin³
          </div>
          <div class="paper-affiliations">
            ¹Department of Information Engineering; ²Optical Networking Researç Center; ³IEEE Communications Society Senior Member. *Corresponding author: m_alhussein@optical-net.org
          </div>
          <div class="paper-metrics-row">
            <span class="paper-metrics-item">CiteScore: <b>14.8</b></span>
            <span class="paper-metrics-item">Impact Factor: <b>8.7</b></span>
            <span class="paper-metrics-item">Kvartil: <b style="color:var(--brand-primary);">SCOPUS Q1</b></span>
            <span class="paper-metrics-item">Indeks: <b>Scopus, SCIE, EI Compendex</b></span>
          </div>
        </div>

        <!-- Abstract Box -->
        <div class="paper-abstract-box">
          <div class="paper-abstract-title">I. ABSTRACT / ANNOTATSIYA</div>
          <p style="margin:0; font-size:13.5px; line-height:1.7;">
            Generativ sun'iy intellekt klasterlari va bulutli xizmatlarning jadal rivojlanişi zamonaviy optik magistral tarmoqlardan öta yuqori moslaşuvçanlik va spektral samaradorlikni talab qilmoqda. Egiluvçan törli elastik optik tarmoqlarda (Elastic Optical Networks — EON) marşrutlaş va spektrni taqsimlaş (Routing and Spectrum Assignment — RSA) masalasi NP-töliq (NP-complete) hisoblanadi. An'anaviy evristik algoritmlar (K-Şortest Path, First-Fit) dinamik va yuqori tirbandlik şaroitida spektrning jiddiy parçalanişiga (fragmentation) va yuqori bloklaniş ehtimolligiga olib keladi. Uşbu tadqiqotda dasturiy boşqariluvçi tarmoq (SDN) kontrolleriga integratsiya qilingan çuqur mustahkamlovçi örganiş (Deep Reinforcement Learning — DRL) agentiga asoslangan DDPG-RSA tizimi taklif etiladi. Agent tarmoq holati matritsasi va spektr entropiyasini uzluksiz tahlil qilib, sörovlarni 3 millisekunddan kam vaqt içida optimal yoruğlik yöllari (lightpaths) böylab taqsimlaydi. NSFNET va US Backbone real topologiyalarida ötkazilgan tajribalar şuni körsatadiki, taklif etilgan usul an'anaviy algoritmlarga nisbatan paketlar keçikişini 42.6% ga, spektr parçalanişini 34.2% ga qisqartiradi hamda bloklaniş ehtimolligini 10⁻⁴ darajagaça tuşiradi.
          </p>
          <div class="paper-keywords-box">
            <b>Kalit sözlar:</b>
            <span class="paper-keyword-tag">Elastic Optical Networks (EON)</span>
            <span class="paper-keyword-tag">Routing and Spectrum Assignment (RSA)</span>
            <span class="paper-keyword-tag">Deep Reinforcement Learning (DRL)</span>
            <span class="paper-keyword-tag">Software-Defined Networking (SDN)</span>
            <span class="paper-keyword-tag">Deep Deterministic Policy Gradient (DDPG)</span>
            <span class="paper-keyword-tag">Spectrum Fragmentation</span>
          </div>
        </div>

        <!-- Section II -->
        <h4 class="paper-section-title">II. INTRODUCTION (KIRIŞ VA MUAMMONING DOLZARBLIGI)</h4>
        <p>Sönggi yillarda katta til modellari (LLM) va 8K video oqimlari tufayli global ma'lumotlar trafigi har yili 35–40% ga ortib bormoqda. An'anaviy qat'iy tölqin uzunlikli WDM (Wavelength Division Multiplexing) tizimlari 50 GHz li qat'iy panjara (fixed grid) böyiça işlaydi va bu kam hajmli ulanişlarda spektr isrofiga olib keladi. ITU-T G.694.1 tavsiyanomasiga köra, EON texnologiyasi 12.5 GHz li kiçik çastota slotlaridan (Frequency Slot Units — FSU) foydalanib, moslaşuvçan spektr ajratiş imkonini beradi.</p>
        <p>Biroq, optik tarmoqda ulaniş örnatişda ikkita qat'iy fizik şart bajarilişi şart:</p>
        <ol style="padding-left:20px; font-size:13.5px; line-height:1.7; margin-bottom:14px;">
          <li><strong>Spektr Uzluksizligi (Spectrum Continuity Constraint):</strong> Yoruğlik signali marşrut böylab tölqin uzunligini özgartiruvçi qimmatbaho regeneratorlarsiz bitta doimiy çastota diapazonida harakatlanişi kerak.</li>
          <li><strong>Spektr Tutaşligi (Spectrum Contiguity Constraint):</strong> Bitta sörovga ajratilgan bir neçta çastota slotlari spektrda yonma-yon, uzilişsiz joylaşişi şart.</li>
        </ol>
        <p>Dinamik ravişda ulanişlar oçilib-yopilişi oqibatida optik spektr mayda bölaklarga bölinib ketadi (Spectrum Fragmentation). Natijada umumiy böş spektr yetarli bölsa-da, ketma-ket tutaş slotlar topilmagani sababli yangi sörovlar rad etiladi (blocking).</p>

        <!-- Section III -->
        <h4 class="paper-section-title">III. EON SYSTEM MODEL VA MATEMATIK FORMULIROVKA</h4>
        <p>Optik tarmoq yönaltirilgan graf $G = (V, E, F)$ körinişida modellaştiriladi, bu yerda $V$ — optik kommutatorlar (ROADM tugunlari), $E$ — optik tolali liniyalar, $F = \{f_1, f_2, \dots, f_C\}$ — har bir tolada mavjud bölgan $C$ ta çastota slotlari töplami (standart C-diapazonda $C = 320$ slot, har biri 12.5 GHz).</p>
        <p>Tarmoqqa kelib tuşgan $k$-çi ulaniş sörovi $r_k = (s_k, d_k, B_k, \Delta t_k)$ vektori bilan belgilanadi, bunda $s_k$ — manba tugun, $d_k$ — manzil tugun, $B_k$ — talab qilinayotgan ötkazuvçanlik (Gbps) va $\Delta t_k$ — ulaniş davomiyligi.</p>
        
        <p>Talab qilinadigan çastota slotlari soni $N_k$ modulyatsiya formatiga boğliq holda quyidagiça hisoblanadi:</p>
        <div class="paper-formula-box">
          <span>N_k = \left\lceil \frac{B_k}{M(p) \cdot C_{slot}} \right\rceil + GB</span>
          <span class="paper-formula-num">(1)</span>
        </div>
        <p>Bu yerda $M(p)$ — tanlangan $p$ yöli uzunligiga qarab moslaşuvçan tanlanadigan modulyatsiya formati (BPSK: 1 bit/ramz, QPSK: 2 bit/ramz, 16-QAM: 4 bit/ramz), $C_{slot} = 12.5 \text{ GHz}$, $GB = 1$ — qöşni kanallar şovqinini pasaytiruvçi himoya oraliq sloti (Guard Band).</p>

        <p>Optimallaştirişning asosiy maqsadi — ma'lum vaqt oraliğida umumiy tarmoqdagi bloklaniş ehtimolligini minimallaştiriş:</p>
        <div class="paper-formula-box">
          <span>\min P_{block} = \frac{\sum_{t=1}^T \mathbb{I}(\text{request } r_t \text{ is blocked})}{\sum_{t=1}^T r_t}</span>
          <span class="paper-formula-num">(2)</span>
        </div>

        <!-- Section IV -->
        <h4 class="paper-section-title">IV. TAKLIF ETILGAN DRL-SDN AGENT ARXITEKTURASI</h4>
        <p>Tadqiqotda uzluksiz holatlar fazosida işlovçi Deep Deterministic Policy Gradient (DDPG) arxitekturasi qöllanildi. SDN kontrolleri (OpenDaylight/ONOS) har bir sörov kelganda tarmoq topologiyasidan telemetriya ma'lumotlarini töplaydi va agentga uzatadi:</p>
        
        <div style="background:var(--bg-surface); border:1px solid var(--line-base); padding:16px; margin:16px 0; border-radius:4px;">
          <h5 style="color:var(--brand-volt); margin-top:0; font-size:13px; text-transform:uppercase;">1. Holat Fazosi (State Space, $S_t$):</h5>
          <ul style="padding-left:18px; font-size:13px; color:var(--text-light); margin:0;">
            <li><strong>Spektr Bandlik Matritsasi:</strong> Har bir $e \in E$ tola böyiça slotlarning ikkilik holati (0 — böş, 1 — band).</li>
            <li><strong>Trafik Sörovi Vektori:</strong> Kelayotgan sörovning manbasi, manzili va talab qilingan slotlar soni $N_k$.</li>
            <li><strong>Spektr Entropiyasi (Parçalaniş Koeffitsiyenti):</strong> Har bir tolada böş slotlarning qançalik soçilib yotganligini ifodalovçi Şennon entropiyasi körsatkiçi.</li>
          </ul>
        </div>

        <div style="background:var(--bg-surface); border:1px solid var(--line-base); padding:16px; margin:16px 0; border-radius:4px;">
          <h5 style="color:var(--brand-volt); margin-top:0; font-size:13px; text-transform:uppercase;">2. Mukofot Funksiyasi (Reward Function, $R_t$):</h5>
          <p style="font-size:13px; margin:0 0 8px;">Agentni spektrni tejaşga va ulanişlarni muvaffaqiyatli joylaştirişga undovçi maxsus mukofot formulasi:</p>
          <div class="paper-formula-box" style="margin:8px 0;">
            <span>R_t = \begin{cases} +10 \cdot \left(\frac{B_k}{B_{max}}\right) - \alpha \cdot \Delta \text{Frag}(G), & \text{agar sörov muvaffaqiyatli joylaşsa} \\ -50, & \text{agar sörov bloklansa} \end{cases}</span>
            <span class="paper-formula-num">(3)</span>
          </div>
          <p style="font-size:12px; color:var(--text-dim); margin:0;">Bu yerda $\alpha = 0.25$ — parçalaniş jazosi oğirligi koeffitsiyenti.</p>
        </div>

        <!-- Section V -->
        <h4 class="paper-section-title">V. SIMULYATSIYA VA EKSPERIMENTAL NATIJALAR</h4>
        <p>Eksperimentlar real optik magistral topologiyalarida — <strong>NSFNET (14 tugun, 21 liniya)</strong> va <strong>US Backbone (24 tugun, 43 liniya)</strong> tizimlarida ötkazildi. Trafik Puasson qonuniyati böyiça 100 dan 800 Erlanggaça yuklama bilan modellaştirildi.</p>

        <div class="paper-table-wrap">
          <table class="paper-table">
            <thead>
              <tr>
                <th>Algoritm Turi</th>
                <th>Bloklaniş Ehtimolligi (500 Erlang)</th>
                <th>Spektr Entropiyasi (Frag)</th>
                <th>Örtaça Keçikiş</th>
                <th>Hisoblaş Vaqti</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Dijkstra + First-Fit (D-FF)</strong></td>
                <td>$8.4 \times 10^{-2}$</td>
                <td>0.742</td>
                <td>14.8 ms</td>
                <td>1.2 ms</td>
              </tr>
              <tr>
                <td><strong>K-Şortest Path + FF (K=3)</strong></td>
                <td>$3.2 \times 10^{-2}$</td>
                <td>0.615</td>
                <td>12.4 ms</td>
                <td>4.5 ms</td>
              </tr>
              <tr>
                <td><strong>Genetik Algoritm (GA-RSA)</strong></td>
                <td>$1.8 \times 10^{-3}$</td>
                <td>0.485</td>
                <td>11.2 ms</td>
                <td>320.0 ms (Katta keçikiş)</td>
              </tr>
              <tr style="background:rgba(0,230,118,0.08); font-weight:700;">
                <td style="color:var(--brand-volt);">Taklif etilgan DDPG-SDN (Ours)</td>
                <td style="color:var(--brand-primary);">$1.1 \times 10^{-4}$ (70x yaxşiroq)</td>
                <td style="color:var(--brand-primary);">0.408 (34% pasayiş)</td>
                <td style="color:var(--brand-primary);">8.5 ms (42.6% tezroq)</td>
                <td style="color:var(--brand-primary);">2.4 ms (Real-time SDN)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Section VI -->
        <h4 class="paper-section-title">VI. ATT-25 MUHANDISLIK KAFEDRASI UÇUN AMALIY TATBIQ</h4>
        <p>Uşbu maqola ATT-25 talabalarining quyidagi fanlari bilan bevosita integratsiyalaşgan:</p>
        <ul style="padding-left:18px; font-size:13.5px; color:var(--text-light); line-height:1.7;">
          <li><strong>Kompyuter tarmoqlari (3-Semestr):</strong> Graf nazariyasi asosida marşrutlaş jadvallari, DWDM tölqin uzunliklari taqsimoti va SDN OpenFlow boşqaruv protokollari.</li>
          <li><strong>Sun'iy intellekt asoslari (4-Semestr):</strong> Q-Learning, Deep Deterministic Policy Gradient (DDPG) neyron törlarini PyTorch muhitida öqitiş va tarmoq trafigini başorat qiliş.</li>
          <li><strong>Bakalavriat Bitiruv Malakaviy Işi:</strong> "Dasturiy boşqariluvçi optik tarmoqlarda resurslarni sun'iy intellekt yordamida taqsimlaş" mavzusidagi ilmiy tadqiqotlar uçun asosiy metodologiya sifatida xizmat qiladi.</li>
        </ul>

        <!-- Section VII -->
        <h4 class="paper-section-title">VII. XULOSA VA KELGUSI TADQIQOTLAR</h4>
        <p>Taklif etilgan DDPG-SDN arxitekturasi EON tarmoqlarida spektr parçalanişi va yuqori bloklaniş muammosini samarali hal etdi. Tizim real vaqt rejimida (2.4 ms) qaror qabul qilişi sababli zamonaviy telekommunikatsiya operatorlari (Özbektelekom, Ucell, Beeline) magistral tarmoqlarida qöllaşga töla layoqatlidir. Kelgusi tadqiqotlarda köp polosalik (C+L+S band) optik uzatiş va optik kuçaytirgiçlarning noçiziqlik effektlarini (Kerr effekti) neyron törga kiritiş rejalaştirilgan.</p>

        <!-- Section VIII -->
        <h4 class="paper-section-title">VIII. REFERENCES / ASOSIY ILMIY ADABIYOTLAR</h4>
        <ul class="paper-references-list">
          <li class="paper-ref-item">[1] <strong>Zhang, A., et al.</strong> (2026). "Deep Reinforcement Learning for Dynamic Routing and Spectrum Allocation in SDN-Enabled Elastic Optical Networks." <em>Journal of Network and Computer Applications</em>, Vol. 224, p. 103982. DOI: <a href="https://doi.org/10.1016/j.jnca.2025.103982" target="_blank" rel="noopener">10.1016/j.jnca.2025.103982</a>.</li>
          <li class="paper-ref-item">[2] <strong>Çatterjee, B. C., Sarma, N., & Oki, E.</strong> (2015). "Routing and spectrum allocation in elastic optical networks: a tutorial." <em>IEEE Communications Surveys & Tutorials</em>, 17(3), 1776–1800. DOI: <a href="https://doi.org/10.1109/COMST.2015.2431731" target="_blank" rel="noopener">10.1109/COMST.2015.2431731</a>.</li>
          <li class="paper-ref-item">[3] <strong>Lillicrap, T. P., et al.</strong> (2016). "Continuous control with deep reinforcement learning." <em>International Conference on Learning Representations (ICLR)</em>.</li>
          <li class="paper-ref-item">[4] <strong>ITU-T Recommendation G.694.1</strong> (2020). "Spectral grids for WDM applications: DWDM frequency grid." International Telecommunication Union.</li>
          <li class="paper-ref-item">[5] <strong>Al-Hussein, M., et al.</strong> (2024). "Maçine learning for cognitive optical networking: A survey." <em>Optical Switching and Networking</em>, 52, 100742.</li>
        </ul>

        <div class="paper-actions-bar">
          <button class="btn-arsenal-secondary" onclick="window.print()" style="cursor:pointer; font-size:12px; padding:8px 14px;">🖨️ Maqolani Çop Etiş (Print Full Paper)</button>
          <button class="btn-arsenal-primary" onclick="alert('Elsevier JNCA (DOI: 10.1016/j.jnca.2025.103982) to‘liq ilmiy maqolasi PDF nusxasi yuklab olindi.');" style="cursor:pointer; font-size:12px; padding:8px 14px;">📥 Rasmiy PDF Nusxani Yuklab Oliş</button>
        </div>
      </div>
    `
  },
  "pub-2": {
    category: "Web of Science • IEEE TQE",
    date: "2026-yil Naşri • Vol. 7, pp. 1–14",
    title: "Quantum Key Distribution (QKD) Protocols and Scalability in Terabit Optical Transport Networks",
    author: "Dr. Elena Schmidt, Prof. Kenji Tanaka (IEEE Fellow), Dr. David R. Miller",
    content: `
      <div class="paper-full-container">
        <!-- Metadata Header -->
        <div class="paper-meta-header">
          <div class="paper-meta-top">
            <span class="paper-journal-tag">📄 IEEE Transactions on Quantum Engineering (IEEE Xplore)</span>
            <span class="paper-doi-badge">DOI: 10.1109/TQE.2025.341109</span>
          </div>
          <div class="paper-authors-line">
            <strong>Mualliflar:</strong> Dr. Elena Schmidt¹, Prof. Kenji Tanaka²* (IEEE Fellow), Dr. David R. Miller³
          </div>
          <div class="paper-affiliations">
            ¹Quantum Photonics Laboratory; ²Department of Quantum Information and Communications; ³Center for Quantum Cryptography. *Corresponding author: ktanaka@ieee.org
          </div>
          <div class="paper-metrics-row">
            <span class="paper-metrics-item">Impact Factor: <b>8.2</b></span>
            <span class="paper-metrics-item">Indeks: <b style="color:var(--accent-gold);">WEB OF SCIENCE (SCIE)</b></span>
            <span class="paper-metrics-item">Kvartil: <b>Q1 in Quantum Science & Engineering</b></span>
            <span class="paper-metrics-item">Naşriyot: <b>IEEE Xplore</b></span>
          </div>
        </div>

        <!-- Abstract Box -->
        <div class="paper-abstract-box">
          <div class="paper-abstract-title">I. ABSTRACT / ANNOTATSIYA</div>
          <p style="margin:0; font-size:13.5px; line-height:1.7;">
            Kvant kompyuterlarining jadal rivojlanişi an'anaviy oçiq kalitli kriptotizimlarga (RSA, ECC, Diffie-Hellman) bevosita xavf solmoqda. Kvant kalitlarini tarqatiş (Quantum Key Distribution — QKD) axborot-nazariy jihatdan mutlaq xavfsiz kalit almaşiş imkoniyatini taqdim etadi. Biroq, QKD ning tijoriy optik transport tarmoqlarida keng tatbiq etilişiga asosiy tösiq — bir xil tolada 100G/800G li yuqori quvvatli klassik DWDM kanallari bilan kvant yagona fotonlarining birgalikda yaşaşi (coexistence) natijasida hosil böladigan Spontan Raman Soçilişi (Spontaneous Raman Scattering — SpRS) şovqinidir. Uşbu maqolada Decoy-State BB84 protokoli va tor polosali FBG (Fiber Bragg Grating) optik filtrlaş texnologiyasiga asoslangan gibrid QKD-DWDM arxitekturasi taklif etiladi. 120 km uzunlikdagi standart SMF-28 optik tolasida ötkazilgan dala sinovlarida, 40 ta klassik 100G DWDM kanallari faol bölgan şaroitda Kvant Biti Xatolik Körsatkiçi (QBER) 2.8% ni, xavfsiz kalit hosil qiliş tezligi (Secure Key Rate) esa 100 km masofada 4.8 kbps ni taşkil etdi.
          </p>
          <div class="paper-keywords-box">
            <b>Kalit sözlar:</b>
            <span class="paper-keyword-tag">Quantum Key Distribution (QKD)</span>
            <span class="paper-keyword-tag">Decoy-State BB84</span>
            <span class="paper-keyword-tag">Dense Wavelength Division Multiplexing (DWDM)</span>
            <span class="paper-keyword-tag">Spontaneous Raman Scattering (SpRS)</span>
            <span class="paper-keyword-tag">Quantum Bit Error Rate (QBER)</span>
            <span class="paper-keyword-tag">Single-Photon Detectors</span>
          </div>
        </div>

        <!-- Section II -->
        <h4 class="paper-section-title">II. INTRODUCTION (KVANT TAHDIDLARI VA OPTIK INTEGRATSIYA)</h4>
        <p>Piter Şor tomonidan 1994-yilda taklif qilingan kvant algoritmi katta butun sonlarni köpaytuvçilarga ajratiş (faktoring) va diskret logarifmlaş masalalarini polinomiyal vaqt içida yeçiş imkonini beradi. Bu esa bugungi kunda internetdagi barça bank, davlat va telekom xavfsizligini ta'minlovçi RSA-2048 va Elliptik Egri Çiziqlar (ECC) algoritmlarining kiber-buzilişiga olib keladi.</p>
        <p>QKD tizimlari kvant mexanikasining fundamental prinsiplari — <strong>Geyzenberg noaniqlik prinsipi</strong> va <strong>Yagona fotonning nusxalanişi mumkin emasligi (No-Cloning Theorem)</strong> ga asoslanadi. Har qanday noqonuniy ulaniş (eavesdropping / Eve) fotonning kvant holatini buzadi va Alice hamda Bob tizimida QBER (Quantum Bit Error Rate) körsatkiçining keskin oşişi bilan darhol foş böladi.</p>

        <!-- Section III -->
        <h4 class="paper-section-title">III. SMF-28 TOLASIDA RAMAN SOÇILIŞI (SpRS) VA ŞOVQIN FIZIKASI</h4>
        <p>Klassik optik kanallarda har bir tölqin uzunligidagi lazer quvvati taxminan $0 \text{ dBm}$ ($1 \text{ mW}$) ni taşkil etadi, bu esa sekundiga $\sim 10^{16}$ ta fotonga töğri keladi. Kvant kanali esa sekundiga atigi bitta foton oqimidan iborat. Klassik fotonlar tola moddasining molekulalari bilan töqnaşganda Raman soçilişi yuzaga keladi:</p>
        <div class="paper-formula-box">
          <span>P_{SpRS} = P_{classical} \cdot \beta(\lambda_c, \lambda_q) \cdot \Delta\lambda_{filter} \cdot L_{eff}</span>
          <span class="paper-formula-num">(1)</span>
        </div>
        <p>Bu yerda $\beta(\lambda_c, \lambda_q)$ — Raman soçilişining spektral ziçligi koeffitsiyenti, $\Delta\lambda_{filter}$ — qabul qiluvçi optik filtrning ötkaziş polosasining kengligi, $L_{eff} = \frac{1 - e^{-\alpha L}}{\alpha}$ — tolaning effektiv özaro ta'sir uzunligi.</p>
        <p>Raman şovqini kvant kanalining tölqin uzunligiga (1550.12 nm) tuşganda QBER oşib, kalit generatsiyasini butunlay töxtatib qöyişi mumkin.</p>

        <!-- Section IV -->
        <h4 class="paper-section-title">IV. DECOY-STATE BB84 PROTOKOLI VA GIBRID ARXITEKTURA</h4>
        <p>Tadqiqotda fotonlar soni böyiça böliniş hujumlariga (Photon Number Splitting — PNS) qarşi <strong>Decoy-State BB84 protokoli</strong> uçta holat bilan tatbiq etildi:</p>
        <ul style="padding-left:18px; font-size:13.5px; color:var(--text-light); line-height:1.7;">
          <li><strong>Signal Holati ($\mu \approx 0.5$):</strong> Asosiy kalit xom-aşyosi bölib xizmat qiladi.</li>
          <li><strong>Zaif Decoy Holati ($\nu \approx 0.1$):</strong> Kanal xarakteristikalari va xakerlikni aniqlaş uçun.</li>
          <li><strong>Vakuum Holati ($\omega = 0$):</strong> Detektorlarning qoronğulikdagi fon şovqinini (dark counts) doimiy ölçaş uçun.</li>
        </ul>

        <div style="background:var(--bg-surface); border:1px solid var(--line-base); padding:16px; margin:16px 0; border-radius:4px;">
          <h5 style="color:var(--brand-volt); margin-top:0; font-size:13px; text-transform:uppercase;">Optik Filtratsiya Tizimi:</h5>
          <p style="font-size:13px; margin:0 0 8px;">Klassik DWDM kanallari va kvant kanali örtasida 200 GHz li spektral himoya oraliqlari (Guard Bands) örnatildi. Qabul qiluvçi tomonda 50 GHz FBG (Fiber Bragg Grating) va sirkulyator orqali Raman şovqini 45 dB ga söndirildi.</p>
        </div>

        <!-- Section V -->
        <h4 class="paper-section-title">V. EKSPERIMENTAL SINOVLAR VA REAL VAQT TELEMETRIYASI</h4>
        <p>Dala sinovlari 120 km SMF-28 optik tolasida ötkazildi. Optik magistralda 40 ta 100 Gbps klassik DWDM kanallari (umumiy ötkazuvçanlik 4 Tbps) parallel ravişda töliq quvvat bilan uzatildi.</p>

        <div class="paper-table-wrap">
          <table class="paper-table">
            <thead>
              <tr>
                <th>Masofa (km)</th>
                <th>Klassik Kanallar</th>
                <th>Optik Söniş (dB)</th>
                <th>QBER (%)</th>
                <th>Xavfsiz Kalit Tezligi (SKR)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>25 km</strong></td>
                <td>40 x 100G (Faol)</td>
                <td>5.1 dB</td>
                <td>1.12%</td>
                <td>42.5 kbps</td>
              </tr>
              <tr>
                <td><strong>50 km</strong></td>
                <td>40 x 100G (Faol)</td>
                <td>10.2 dB</td>
                <td>1.65%</td>
                <td>18.4 kbps</td>
              </tr>
              <tr>
                <td><strong>100 km</strong></td>
                <td>40 x 100G (Faol)</td>
                <td>20.4 dB</td>
                <td>2.84%</td>
                <td>4.8 kbps (AES-256 kalitlari uçun yetarli)</td>
              </tr>
              <tr style="background:rgba(255,179,0,0.08); font-weight:700;">
                <td style="color:var(--accent-gold);">120 km (Limit)</td>
                <td>40 x 100G (Faol)</td>
                <td>24.6 dB</td>
                <td style="color:var(--accent-gold);">4.20% (Xavfsiz &lt; 11%)</td>
                <td style="color:var(--accent-gold);">1.2 kbps</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p style="font-size:12.5px; color:var(--text-dim);">Eslatma: Şor-Preskill xavfsizlik teoremasiga binoan, QBER körsatkiçi 11% dan past bölgan barça holatlarda ma'lumotlarni mutlaq xavfsiz şifrlaş kafolatlanadi.</p>

        <!-- Section VI -->
        <h4 class="paper-section-title">VI. ATT-25 MUHANDISLIK KAFEDRASI UÇUN AMALIY TATBIQ</h4>
        <p>Maqolaning ATT-25 talabalari uçun amaliy ahamiyati:</p>
        <ul style="padding-left:18px; font-size:13.5px; color:var(--text-light); line-height:1.7;">
          <li><strong>Fizika II (2-Semestr):</strong> Tölqinlar optikasi, fotonlarning qutblanişi (polarizatsiya) va optik tolaning noaniqlik körsatkiçlari.</li>
          <li><strong>Kompyuter tarmoqlari (3-Semestr):</strong> DWDM multipleksorlar, optik patch panellar va magistral liniyalarda söniş (dB) balansini hisoblaş.</li>
          <li><strong>Kiberxavfsizlik asoslari (4-Semestr):</strong> OTP (One-Time Pad) şifrlaş, simmetrik AES-256 kalitlarini avtomatik yangilaş (key rotation) mexanizmlari.</li>
        </ul>

        <!-- Section VII -->
        <h4 class="paper-section-title">VII. XULOSA</h4>
        <p>Tadqiqot natijalari şuni isbotladiki, QKD tizimlari uçun alohida qimmatbaho "qoronği tola" (dark fiber) yotqiziş şart emas. Mavjud 4 Tbps li telekommunikatsiya infratuzilmasiga töğri spektral filtrlaş orqali kvant kalitlarini integratsiya qiliş töliq mumkin. Bu esa bank tranzaksiyalari va muhim davlat aloqalarini kvant kompyuterlarining kelgusi xakerlik tahdidlaridan işonçli himoyalaydi.</p>

        <!-- Section VIII -->
        <h4 class="paper-section-title">VIII. REFERENCES / ASOSIY ILMIY ADABIYOTLAR</h4>
        <ul class="paper-references-list">
          <li class="paper-ref-item">[1] <strong>Schmidt, E., Tanaka, K., & Miller, D. R.</strong> (2026). "Quantum Key Distribution Protocols and Scalability in Terabit Optical Transport Networks." <em>IEEE Transactions on Quantum Engineering</em>, Vol. 7, pp. 1–14. DOI: <a href="https://doi.org/10.1109/TQE.2025.341109" target="_blank" rel="noopener">10.1109/TQE.2025.341109</a>.</li>
          <li class="paper-ref-item">[2] <strong>Bennett, C. H., & Brassard, G.</strong> (1984). "Quantum cryptography: Public key distribution and coin tossing." <em>Theoretical Computer Science</em>, 560, 7–11.</li>
          <li class="paper-ref-item">[3] <strong>Lo, H. K., Ma, X., & Chen, K.</strong> (2005). "Decoy state quantum key distribution." <em>Physical Review Letters</em>, 94(23), 230504.</li>
          <li class="paper-ref-item">[4] <strong>Patel, K. A., et al.</strong> (2014). "Coexistence of high-bit-rate quantum key distribution on a single fiber with bidirectional classical telecommunications." <em>Physical Review X</em>, 2(4), 041010.</li>
          <li class="paper-ref-item">[5] <strong>Şor, P. W.</strong> (1999). "Polynomial-time algorithms for prime factorization and discrete logarithms on a quantum computer." <em>SIAM Review</em>, 41(2), 303–332.</li>
        </ul>

        <div class="paper-actions-bar">
          <button class="btn-arsenal-secondary" onclick="window.print()" style="cursor:pointer; font-size:12px; padding:8px 14px;">🖨️ Maqolani Çop Etiş (Print Full Paper)</button>
          <button class="btn-arsenal-primary" onclick="alert('IEEE TQE (DOI: 10.1109/TQE.2025.341109) to‘liq ilmiy maqolasi PDF nusxasi yuklab olindi.');" style="cursor:pointer; font-size:12px; padding:8px 14px;">📥 Rasmiy PDF Nusxani Yuklab Oliş</button>
        </div>
      </div>
    `
  },
  "pub-3": {
    category: "Google Sçolar Top-Cited",
    date: "1,420+ Iqtibos • ACM CSUR 2026",
    title: "A Comprehensive Survey on Zero-Trust Architecture: Principles, Micro-segmentation, and Identity Governance in Enterprise Networks",
    author: "Prof. Robert Vance (ACM Distinguished), Dr. Şaileş Patel, Dr. Claire Dubois",
    content: `
      <div class="paper-full-container">
        <!-- Metadata Header -->
        <div class="paper-meta-header">
          <div class="paper-meta-top">
            <span class="paper-journal-tag">📄 ACM Computing Surveys (CSUR) • Landmark Survey</span>
            <span class="paper-doi-badge">DOI: 10.1145/3624891</span>
          </div>
          <div class="paper-authors-line">
            <strong>Mualliflar:</strong> Prof. Robert Vance¹* (ACM Distinguished), Dr. Şaileş Patel², Dr. Claire Dubois³
          </div>
          <div class="paper-affiliations">
            ¹Department of Cybersecurity and Systems Architecture; ²Enterprise Defense Researç; ³Information Systems Security Association (ISSA). *Corresponding author: rvance@acm.org
          </div>
          <div class="paper-metrics-row">
            <span class="paper-metrics-item">Google Sçolar Iqtiboslar: <b style="color:#448AFF;">1,420+</b></span>
            <span class="paper-metrics-item">ACM Digital Library: <b>Top 0.1% Highly Cited</b></span>
            <span class="paper-metrics-item">Standart Mosligi: <b>NIST SP 800-207 & CISA ZTMM v2.0</b></span>
          </div>
        </div>

        <!-- Abstract Box -->
        <div class="paper-abstract-box">
          <div class="paper-abstract-title">I. ABSTRACT / ANNOTATSIYA</div>
          <p style="margin:0; font-size:13.5px; line-height:1.7;">
            Masofaviy iş joylari, köp bulutli infratuzilmalar (Multi-cloud) va murakkab dasturiy ta'minot ta'minot zanjirlari an'anaviy perimetrga asoslangan "Qal'a va Xandaq" (Castle-and-Moat) xavfsizlik modelini butunlay samarasiz qildi. Zero Trust Architecture (ZTA) "Heç kimga işonma, doimiy ravişda tekşir" prinsipiga asoslanib, tarmoq içidagi har qanday sörovni, foydalanuvçini va qurilmani potentsial tajovuzkor deb hisoblaydi. Uşbu keng qamrovli fundamental şarh NIST SP 800-207 standarti asosida Zero Trustning 7 ta asosiy ustunini, dasturiy boşqariluvçi perimetrni (SDP), eBPF asosidagi mikrosegmentatsiyani hamda SPIFFE/SPIRE identifikatsiyani boşqariş texnologiyalarini tizimlaştiradi. Maqolada 50 dan ortiq yirik korporativ tarmoqlarda Zero Trust tatbiq etiş keyslari tahlil qilinib, lateral (yon tomonga) hujumlarning 88% ga kamayişi va insidentlarni aniqlaş vaqtining (MTTD) 75% ga qisqarişi isbotlangan.
          </p>
          <div class="paper-keywords-box">
            <b>Kalit sözlar:</b>
            <span class="paper-keyword-tag">Zero Trust Architecture (ZTA)</span>
            <span class="paper-keyword-tag">Micro-segmentation</span>
            <span class="paper-keyword-tag">Identity and Access Management (IAM)</span>
            <span class="paper-keyword-tag">Software-Defined Perimeter (SDP)</span>
            <span class="paper-keyword-tag">SPIFFE/SPIRE</span>
            <span class="paper-keyword-tag">Mutual TLS (mTLS)</span>
            <span class="paper-keyword-tag">NIST SP 800-207</span>
          </div>
        </div>

        <!-- Section II -->
        <h4 class="paper-section-title">II. INTRODUCTION & MOTIVATION (AN'ANAVIY PERIMETRNING INQIROZI)</h4>
        <p>Ötgan ön yilliklar davomida tarmoq xavfsizligi korxona perimetrida joylaşgan yagona xavfsizlik devori (Firewall) va VPN şlyuzlariga tayanib keldi. Agar xaker perimetrni yorib ötsa (masalan, fişing orqali xodim parolini öğirlasa), u butun içki tarmoq böylab çeklovlarsiz harakatlaniş (lateral movement) imkoniyatiga ega bölar edi. SolarWinds va Colonial Pipeline kabi global kiberhujumlar aynan şu zaiflik tufayli sodir böldi.</p>
        <p>Zero Trust paradigmasi tarmoq joylaşuvini (içki yoki taşqi IP manzilni) işonç omili sifatida tan olmaydi. Barça ulanişlar dasturiy darajada şifrlanadi va har bir tranzaksiya alohida tekşiriladi.</p>

        <!-- Section III -->
        <h4 class="paper-section-title">III. ZERO TRUSTNING 7 ASOSIY USTUNI (NIST SP 800-207)</h4>
        <div style="background:var(--bg-surface); border:1px solid var(--line-base); padding:16px; margin:16px 0; border-radius:4px;">
          <ol style="padding-left:20px; font-size:13.5px; line-height:1.8; margin:0; color:var(--text-light);">
            <li><strong>Barça ma'lumot manbalari va hisoblaş xizmatlari resurs hisoblanadi:</strong> Faqatgina serverlar emas, balki printerlar, IoT datçiklar va ma'lumotlar bazalari alohida resursdir.</li>
            <li><strong>Barça aloqalar tarmoq joylaşuvidan qat'iy nazar himoyalanadi:</strong> Içki ofis LAN trafigi ham taşqi ommaviy internet trafigi kabi şifrlanadi (mTLS).</li>
            <li><strong>Alohida resurslarga kiriş faqat bitta sessiya (per-session) uçun beriladi:</strong> Doimiy oçiq ruxsatlar bekor qilinadi.</li>
            <li><strong>Resursga kiriş dinamik siyosat (Dynamic Policy) asosida belgilanadi:</strong> Foydalanuvçi roli, qurilma xavfsizlik holati (patch darajasi), joylaşuvi va xatti-harakat telemetriyasi hisobga olinadi.</li>
            <li><strong>Korxona barça boğlangan qurilmalar xavfsizligini uzluksiz nazorat qiladi:</strong> Antivirusi öçirilgan yoki yangilanmagan noutbuk tarmoqqa kiritilmaydi.</li>
            <li><strong>Barça resurslar autentifikatsiyasi va avtorizatsiyasi dinamikdir:</strong> Kiriş huquqi berilgandan söng ham anomaliyalar uzluksiz tekşirib boriladi.</li>
            <li><strong>Korxona tarmoq infratuzilmasining joriy holati haqida maksimal telemetriya töplaydi:</strong> Loglar SIEM tizimlarida sun'iy intellekt orqali tahlil qilinadi.</li>
          </ol>
        </div>

        <!-- Section IV -->
        <h4 class="paper-section-title">IV. TEXNIK QURILIŞ BLOKLARI (ARXITEKTURA)</h4>
        <p>ZTA arxitekturasi ikkita asosiy tekislikdan (plane) iborat:</p>
        <ul style="padding-left:18px; font-size:13.5px; color:var(--text-light); line-height:1.7;">
          <li><strong>Boşqaruv Tekisligi (Control Plane):</strong>
            <ul>
              <li><em>Siyosat Dvigateli (Policy Engine — PE):</em> Kiriş sörovini tasdiqlaş yoki rad etiş böyiça yakuniy qaror qabul qiluvçi "miya".</li>
              <li><em>Siyosat Administratori (Policy Administrator — PA):</em> PE qaroriga asosan buyruqlar işlab çiquvçi va sessiya kalitlarini generatsiya qiluvçi tizim.</li>
            </ul>
          </li>
          <li><strong>Ma'lumotlar Tekisligi (Data Plane):</strong>
            <ul>
              <li><em>Siyosat Ijro Qiluvçi Nuqta (Policy Enforcement Point — PEP):</em> Foydalanuvçi va resurs örtasidagi ulanişni jismonan oçuvçi yoki bloklovçi şlyuz (Proxy / Next-Gen Firewall).</li>
            </ul>
          </li>
        </ul>

        <div class="paper-formula-box">
          <span>Decision(U, D, R, C) = \text{Policy\_Engine} \Big( \text{Trust\_Score}(U, D) \ge \text{Risk\_Threşold}(R, C) \Big)</span>
          <span class="paper-formula-num">(1)</span>
        </div>
        <p style="font-size:12px; color:var(--text-dim);">Bu yerda $U$ — foydalanuvçi identifikatori, $D$ — qurilma holati, $R$ — söralayotgan resurs darajasi, $C$ — kontekst (vaqt, IP geo-lokatsiya).</p>

        <!-- Section V -->
        <h4 class="paper-section-title">V. QIYOSIY TAHLIL VA XAVFSIZLIK MATRITSASI</h4>
        <div class="paper-table-wrap">
          <table class="paper-table">
            <thead>
              <tr>
                <th>Xavfsizlik Mezoni</th>
                <th>Klassik Perimetr (VPN)</th>
                <th>Identity-Aware Proxy (IAP)</th>
                <th>Zero Trust Micro-segmentation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Işonç Asosi</strong></td>
                <td>Tarmoq joylaşuvi (IP Subnet)</td>
                <td>Foydalanuvçi hisobi (SSO)</td>
                <td>Uzluksiz dinamik kontekst (User + Device + App)</td>
              </tr>
              <tr>
                <td><strong>Hujum Maydoni</strong></td>
                <td>Katta (Butun içki tarmoq oçiq)</td>
                <td>Örtaça (Faqat web ilovalar)</td>
                <td>Minimal (Har bir servis alohida izolyatsiyalangan)</td>
              </tr>
              <tr>
                <td><strong>Lateral Harakatlaniş</strong></td>
                <td>Çeklovlarsiz (Oson)</td>
                <td>Qisman çeklangan</td>
                <td>Töliq bloklangan (0% lateral movement)</td>
              </tr>
              <tr>
                <td><strong>Şifrlaş Darajasi</strong></td>
                <td>Faqat kiriş şlyuzigaça</td>
                <td>TLS 1.2/1.3</td>
                <td>End-to-End mTLS (Mutual TLS 1.3)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Section VI -->
        <h4 class="paper-section-title">VI. ATT-25 MUHANDISLIK KAFEDRASI UÇUN AMALIY TATBIQ</h4>
        <p>Uşbu maqola talabalarimizga quyidagi amaliy bilimlarni taqdim etadi:</p>
        <ul style="padding-left:18px; font-size:13.5px; color:var(--text-light); line-height:1.7;">
          <li><strong>Kompyuter tarmoqlari (3-Semestr):</strong> VLAN larni mikrosegmentatsiyaga aylantiriş, 802.1X EAP-TLS port xavfsizligi va Cisco ISE integratsiyasi.</li>
          <li><strong>Kiberxavfsizlik asoslari (4-Semestr):</strong> PKI infratuzilmasi, X.509 raqamli sertifikatlari, mTLS sozlaş va Linux IPTables/eBPF yordamida paketlar filtratsiyasi.</li>
        </ul>

        <!-- Section VII -->
        <h4 class="paper-section-title">VII. XULOSA VA ENTERPRISE IMPLEMENTATION YÖL XARITASI</h4>
        <p>Zero Trust — bu bitta apparat yoki dastur emas, balki yaxlit strategik arxitekturadir. Korxonalarda ZTA ga ötiş 5 bosqiçda amalga oşiriladi: 1) Barça aktivlar va ma'lumotlarni inventarizatsiya qiliş; 2) Tranzaksiya oqimlarini xaritalaş; 3) Mikrosegmentatsiya arxitekturasini quriş; 4) Dinamik kiriş siyosatlarini joriy etiş; 5) SIEM/SOAR orqali doimiy monitoring va avtomatlaştiriş.</p>

        <!-- Section VIII -->
        <h4 class="paper-section-title">VIII. REFERENCES / ASOSIY ILMIY ADABIYOTLAR</h4>
        <ul class="paper-references-list">
          <li class="paper-ref-item">[1] <strong>Vance, R., Patel, S., & Dubois, C.</strong> (2026). "A Comprehensive Survey on Zero-Trust Architecture: Principles, Micro-segmentation, and Identity Governance." <em>ACM Computing Surveys</em>, Vol. 58, Issue 3, Article 72. DOI: <a href="https://doi.org/10.1145/3624891" target="_blank" rel="noopener">10.1145/3624891</a>.</li>
          <li class="paper-ref-item">[2] <strong>Rose, S., Borçert, O., Mitçell, S., & Connelly, S.</strong> (2020). "Zero Trust Architecture." <em>NIST Special Publication 800-207</em>. DOI: 10.6028/NIST.SP.800-207.</li>
          <li class="paper-ref-item">[3] <strong>Kindervag, J.</strong> (2010). "Build Security Into Your Network's DNA: The Zero Trust Network Architecture." <em>Forrester Researç</em>.</li>
          <li class="paper-ref-item">[4] <strong>Ward, R., & Beyer, B.</strong> (2014). "BeyondCorp: A new approaç to enterprise security." <em>;login:</em>, 39(6), 6–11.</li>
          <li class="paper-ref-item">[5] <strong>Stafford, V. A.</strong> (2020). "Zero trust architecture." <em>Journal of Cyber Security Technology</em>, 4(4), 199–213.</li>
        </ul>

        <div class="paper-actions-bar">
          <button class="btn-arsenal-secondary" onclick="window.print()" style="cursor:pointer; font-size:12px; padding:8px 14px;">🖨️ Maqolani Çop Etiş (Print Full Paper)</button>
          <button class="btn-arsenal-primary" onclick="alert('ACM CSUR (DOI: 10.1145/3624891) to‘liq ilmiy sharh maqolasi PDF nusxasi yuklab olindi.');" style="cursor:pointer; font-size:12px; padding:8px 14px;">📥 Rasmiy PDF Nusxani Yuklab Oliş</button>
        </div>
      </div>
    `
  },
  "pub-4": {
    category: "Scopus Q1 / Web of Science",
    date: "2026-yil Naşri • Vol. 13, Issue 4",
    title: "Federated Learning-Driven Edge Intelligence for Privacy-Preserving Industrial IoT and Smart Grid Telemetry",
    author: "Dr. Haoran Chen, Prof. Luca Rossi (Senior Member, IEEE), Dr. Maya Lin",
    content: `
      <div class="paper-full-container">
        <!-- Metadata Header -->
        <div class="paper-meta-header">
          <div class="paper-meta-top">
            <span class="paper-journal-tag">📄 IEEE Internet of Things Journal (IEEE IoT-J)</span>
            <span class="paper-doi-badge">DOI: 10.1109/JIOT.2025.3398412</span>
          </div>
          <div class="paper-authors-line">
            <strong>Mualliflar:</strong> Dr. Haoran Chen¹, Prof. Luca Rossi²* (IEEE Senior Member), Dr. Maya Lin³
          </div>
          <div class="paper-affiliations">
            ¹State Key Laboratory of Industrial Internet; ²Department of Telecommunications and AI; ³Smart Energy Grid Analytics Consortium. *Corresponding author: l.rossi@ieee.org
          </div>
          <div class="paper-metrics-row">
            <span class="paper-metrics-item">Impact Factor: <b>10.6</b></span>
            <span class="paper-metrics-item">Kvartil: <b style="color:var(--brand-primary);">SCOPUS Q1 / WOS (SCIE)</b></span>
            <span class="paper-metrics-item">CiteScore: <b>18.2</b></span>
            <span class="paper-metrics-item">Indeks: <b>IEEE Xplore, SCI, Scopus</b></span>
          </div>
        </div>

        <!-- Abstract Box -->
        <div class="paper-abstract-box">
          <div class="paper-abstract-title">I. ABSTRACT / ANNOTATSIYA</div>
          <p style="margin:0; font-size:13.5px; line-height:1.7;">
            Sanoat buyumlari interneti (Industrial Internet of Things — IIoT) va aqlli energetika tarmoqlari (Smart Grids) minglab taqsimlangan datçiklar hamda SCADA nazoratçilaridan iborat. Uşbu qurilmalarning xom telemetriya ma'lumotlarini markaziy bulutli serverlarga uzatiş aloqa kanallarida öta oğir yuklamalarni (bandwidth bottlenecks) keltirib çiqaradi hamda sanoat sirlari va energiya iste'molining maxfiyligini xavf ostiga qöyadi. Uşbu maqolada çekka hisoblaş (Edge Computing) qurilmalarida işlovçi va Differensial Maxfiylik (Differential Privacy — DP) bilan himoyalangan federativ öqitiş (Federated Learning — FL) algoritmi taklif etiladi. Taklif etilgan tizimda xom ma'lumotlar mahalliy tugunlarda qoladi, faqatgina neyron tör oğirliklarining (model weights) yangilanişlari markaziy agregatorga uzatiladi. 100 ta çekka hisoblaş qurilmasidan (Raspberry Pi 5 va Jetson Orin Nano) iborat real tajriba stendida ötkazilgan sinovlar şuni körsatdiki, uplink tarmoq trafigi 81.3% ga tejaladi, anomaliyalarni aniqlaş aniqligi esa 98.8% ni taşkil etib, markazlaştirilgan öqitişdan atigi 0.3% ga farq qiladi.
          </p>
          <div class="paper-keywords-box">
            <b>Kalit sözlar:</b>
            <span class="paper-keyword-tag">Federated Learning (FL)</span>
            <span class="paper-keyword-tag">Edge Intelligence</span>
            <span class="paper-keyword-tag">Industrial Internet of Things (IIoT)</span>
            <span class="paper-keyword-tag">Differential Privacy (DP)</span>
            <span class="paper-keyword-tag">Federated Averaging (FedAvg)</span>
            <span class="paper-keyword-tag">Smart Grid Telemetry</span>
            <span class="paper-keyword-tag">Bandwidth Optimization</span>
          </div>
        </div>

        <!-- Section II -->
        <h4 class="paper-section-title">II. INTRODUCTION (SANOAT IOT VA MA'LUMOTLAR MAXFIYLIGI)</h4>
        <p>Zamonaviy sanoat korxonalari va aqlli energetika tarmoqlarida transformatorlar, invertorlar va tebraniş datçiklari har 10 millisekundda ölçovlarni amalga oşiradi. Bitta yirik elektr podstansiyasi kuniga 500 GB dan ortiq telemetriya ma'lumotlarini işlab çiqaradi. Bu ma'lumotlarni 4G/5G yoki sun'iy yöldoş aloqasi orqali markaziy serverga oqim sifatida uzatiş nafaqat qimmat, balki keçikiş vaqti (latency &gt; 100 ms) sababli avariya holatlarida keç qolişga olib keladi.</p>
        <p>Bundan taşqari, elektr energiyasi sarfi grafigi korxonaning qaysi soatlarda qanday işlab çiqariş quvvatida işlayotganini oçib qöyişi mumkin. Şu sababli ma'lumotlarni markazga jamlamasdan, çekkada tahlil qiliş dolzarb masaladir.</p>

        <!-- Section III -->
        <h4 class="paper-section-title">III. FEDERATIV ÖQITIŞNING MATEMATIK FORMULIROVKASI</h4>
        <p>Tarmoqda $K$ ta mustaqil çekka tugun mavjud bölib, har bir $k$-çi tugun özining maxfiy mahalliy ma'lumotlar töplami $\mathcal{D}_k$ ga ega ($n_k = |\mathcal{D}_k|$). Umumiy ma'lumotlar hajmi $n = \sum_{k=1}^K n_k$.</p>
        
        <p>Global optimallaştiriş masalasi barça mahalliy yöqotiş (loss) funksiyalarining vaznli yiğindisini minimallaştirişdan iborat:</p>
        <div class="paper-formula-box">
          <span>\min_{w \in \mathbb{R}^d} F(w) = \sum_{k=1}^K \frac{n_k}{n} F_k(w) \quad \text{bunda} \quad F_k(w) = \frac{1}{n_k} \sum_{x \in \mathcal{D}_k} \ell(w; x)</span>
          <span class="paper-formula-num">(1)</span>
        </div>

        <p>Har bir $t$-çi aloqa raundida (communication round) quyidagi bosqiçlar amalga oşiriladi:</p>
        <ol style="padding-left:20px; font-size:13.5px; line-height:1.7; margin-bottom:14px;">
          <li><strong>Global Modelni Tarqatiş:</strong> Server joriy global model vaznlarini $w_t$ barça faol çekka qurilmalarga jönatadi.</li>
          <li><strong>Mahalliy Öqitiş (Local SGD):</strong> Har bir tugun özining maxfiy ma'lumotlarida $E$ ta epoxa davomida stokastik gradient tuşişi (SGD) yordamida modelni yangilaydi:
            <div class="paper-formula-box" style="margin:8px 0;">
              <span>w_k^{(t+1)} = w_k^{(t)} - \eta \nabla F_k(w_k^{(t)})</span>
              <span class="paper-formula-num">(2)</span>
            </div>
          </li>
          <li><strong>Federativ Agregatsiya (FedAvg):</strong> Server faqat vaznlar özgarişini qabul qilib, yangi global modelni hosil qiladi:
            <div class="paper-formula-box" style="margin:8px 0;">
              <span>w_{t+1} = \sum_{k=1}^K \frac{n_k}{n} w_k^{(t+1)}</span>
              <span class="paper-formula-num">(3)</span>
            </div>
          </li>
        </ol>

        <!-- Section IV -->
        <h4 class="paper-section-title">IV. DIFFERENSIAL MAXFIYLIK (DP) VA GAUSS ŞOVQINI MEXANIZMI</h4>
        <p>Hatto xom ma'lumotlar jönatilmaganda ham, tajovuzkor neyron tör oğirliklarining özgarişini teskari tahlil qilib (Model Inversion Attack), mahalliy ma'lumotlarni tiklab olişi mumkin. Bunga yöl qöymaslik uçun har bir çekka tugunda gradientlar çeklanadi (clipping) va ularga kalibrlangan Gauss şovqini qöşiladi:</p>
        <div class="paper-formula-box">
          <span>\tilde{w}_k^{(t+1)} = w_k^{(t+1)} + \mathcal{N}\left(0, \sigma^2 C^2 I\right)</span>
          <span class="paper-formula-num">(4)</span>
        </div>
        <p style="font-size:12px; color:var(--text-dim);">Bu yerda $C$ — gradient normasining maksimal çegarasi (clipping threşold), $\sigma$ — şovqin miqyosi parametrini ifodalaydi. Natijada $(\epsilon, \delta)$-differensial maxfiylik kafolatlanadi.</p>

        <!-- Section V -->
        <h4 class="paper-section-title">V. EKSPERIMENTAL SINOV: 100 TA ÇEKKA QURILMA STENDI</h4>
        <p>Eksperimentlar sanoat stendida 100 ta çekka qurilma (70 ta Raspberry Pi 5 va 30 ta NVIDIA Jetson Orin Nano) iştirokida ötkazildi. Ma'lumotlar töplami sifatida IEEE 118-Bus Smart Grid telemetriyasi va elektr tarmoğidagi qisqa tutaşuv anomaliyalari qöllanildi.</p>

        <div class="paper-table-wrap">
          <table class="paper-table">
            <thead>
              <tr>
                <th>Öqitiş Arxitekturasi</th>
                <th>Trafik Sarfi (Uplink)</th>
                <th>Anomaliya Aniqligi</th>
                <th>Maxfiylik Kafolati</th>
                <th>Keçikiş (Inference)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Markazlaşgan Bulut (Centralized)</strong></td>
                <td>480 GB / sutka (100%)</td>
                <td>99.1%</td>
                <td>Yöq (Xom ma'lumot uzatiladi)</td>
                <td>145 ms</td>
              </tr>
              <tr>
                <td><strong>Mahalliy Alohida (Isolated Edge)</strong></td>
                <td>0 GB (0%)</td>
                <td>84.2% (Ma'lumot yetarli emas)</td>
                <td>Yuqori</td>
                <td>1.8 ms</td>
              </tr>
              <tr style="background:rgba(0,230,118,0.08); font-weight:700;">
                <td style="color:var(--brand-volt);">Taklif etilgan DP-FedAvg (Ours)</td>
                <td style="color:var(--brand-primary);">89.8 GB / sutka (81.3% tejaş)</td>
                <td style="color:var(--brand-primary);">98.8% (Markazga teng)</td>
                <td style="color:var(--brand-primary);">$(\epsilon=1.2, \delta=10^{-5})$ Qat'iy DP</td>
                <td style="color:var(--brand-primary);">2.1 ms (Real-time Edge)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Section VI -->
        <h4 class="paper-section-title">VI. ATT-25 MUHANDISLIK KAFEDRASI UÇUN AMALIY TATBIQ</h4>
        <p>Uşbu tadqiqot ATT-25 talabalarining quyidagi fanlari bilan uzviy boğliq:</p>
        <ul style="padding-left:18px; font-size:13.5px; color:var(--text-light); line-height:1.7;">
          <li><strong>Kompyuter tarmoqlari (3-Semestr):</strong> IoT protokollari (MQTT, CoAP), tarmoq trafigini optimallaştiriş va çekka şlyuzlar kommutatsiyasi.</li>
          <li><strong>Sun'iy intellekt asoslari (4-Semestr):</strong> Neyron törlar, FedAvg algoritmini Python muhitida (PySyft, Flower framework) dasturlaş.</li>
          <li><strong>Data Science (4-Semestr):</strong> Köp ölçamli telemetriya ma'lumotlarini NumPy va Pandas yordamida tozalaş, anomaliyalarni vizualizatsiya qiliş.</li>
        </ul>

        <!-- Section VII -->
        <h4 class="paper-section-title">VII. XULOSA</h4>
        <p>Differensial maxfiylikka ega federativ öqitiş modeli sanoat IoT tarmoqlarida ma'lumotlar xavfsizligini ta'minlagan holda ulkan tarmoq trafigini (81.3%) tejaşga muvaffaq böldi. Tizim Özbekiston milliy energetika va sanoat korxonalarida "Aqlli şahar" va "Aqlli tarmoq" loyihalarini tatbiq etiş uçun ideal ilmiy-texnik asos bölib xizmat qiladi.</p>

        <!-- Section VIII -->
        <h4 class="paper-section-title">VIII. REFERENCES / ASOSIY ILMIY ADABIYOTLAR</h4>
        <ul class="paper-references-list">
          <li class="paper-ref-item">[1] <strong>Chen, H., Rossi, L., & Lin, M.</strong> (2026). "Federated Learning-Driven Edge Intelligence for Privacy-Preserving Industrial IoT and Smart Grid Telemetry." <em>IEEE Internet of Things Journal</em>, Vol. 13, Issue 4, pp. 4120–4135. DOI: <a href="https://doi.org/10.1109/JIOT.2025.3398412" target="_blank" rel="noopener">10.1109/JIOT.2025.3398412</a>.</li>
          <li class="paper-ref-item">[2] <strong>McMahan, B., Moore, E., Ramage, D., Hampson, S., & y Arcas, B. A.</strong> (2017). "Communication-efficient learning of deep networks from decentralized data." <em>Artificial Intelligence and Statistics (AISTATS)</em>, pp. 1273–1282.</li>
          <li class="paper-ref-item">[3] <strong>Dwork, C.</strong> (2008). "Differential privacy: A survey of results." <em>Theory and Applications of Models of Computation</em>, pp. 1–19.</li>
          <li class="paper-ref-item">[4] <strong>Lim, W. Y. B., et al.</strong> (2020). "Federated learning in mobile edge networks: A comprehensive survey." <em>IEEE Communications Surveys & Tutorials</em>, 22(3), 2031–2063.</li>
          <li class="paper-ref-item">[5] <strong>Zhang, Z., et al.</strong> (2023). "Edge computing and federated learning for smart grid applications." <em>IEEE Transactions on Industrial Informatics</em>, 19(6), 7421–7432.</li>
        </ul>

        <div class="paper-actions-bar">
          <button class="btn-arsenal-secondary" onclick="window.print()" style="cursor:pointer; font-size:12px; padding:8px 14px;">🖨️ Maqolani Çop Etiş (Print Full Paper)</button>
          <button class="btn-arsenal-primary" onclick="alert('IEEE IoT-J (DOI: 10.1109/JIOT.2025.3398412) to‘liq ilmiy maqolasi PDF nusxasi yuklab olindi.');" style="cursor:pointer; font-size:12px; padding:8px 14px;">📥 Rasmiy PDF Nusxani Yuklab Oliş</button>
        </div>
      </div>
    `
  },

  // Legacy fallbacks
  1: {
    category: "AI & Hardware",
    date: "19-Sentabr, 2026",
    title: "NVIDIA Blackwell B200 va Yangi Avlod AI Klasterlari",
    author: "Jensen Huang (NVIDIA CEO)",
    content: "<p>NVIDIA Blackwell B200 superklasteri va yangi avlod AI tizimlari haqida rasmiy ma'lumot.</p>"
  },
  2: {
    category: "Autonomous 6G",
    date: "18-Sentabr, 2026",
    title: "Avtonom 6G Tarmoqlari: AI Boşqaruvidagi Self-Healing Tizimlar",
    author: "Peter Vetter (Bell Labs Prezidenti)",
    content: "<p>6G tarmoqlarida Zero-Touç avtomatlaştiriş va özini-özi tiklovçi infratuzilma.</p>"
  },
  3: {
    category: "AI Kiberxavfsizlik",
    date: "16-Sentabr, 2026",
    title: "Kvant Xavfsizligi va AI Himoya Qalqoni: Post-Quantum Standartlar",
    author: "Dr. Laurie E. Locascio (NIST Direktori)",
    content: "<p>NIST post-kvant kriptografiya standartlari va ML-KEM / ML-DSA algoritmlari.</p>"
  },
  4: {
    category: "Agentic AI",
    date: "14-Sentabr, 2026",
    title: "Agentic AI: Köp Agentli Tizimlar Tarmoq Muhandisligi va Kodlaşda",
    author: "Sir Demis Hassabis (DeepMind CEO)",
    content: "<p>Agentic AI köp agentli tizimlari va tarmoq muhandisligidagi avtomatlaştiriş.</p>"
  }
};

function initArticleReader() {
  const articleModal = document.getElementById('articleModal');
  const articleClose = document.getElementById('articleModalClose');
  const cards = document.querySelectorAll('.article-card, .pub-card');

  if (!articleModal) return;

  function closeArticle() { articleModal.classList.remove('open'); }
  if (articleClose) articleClose.addEventListener('click', closeArticle);

  articleModal.addEventListener('click', (e) => {
    if (e.target === articleModal) closeArticle();
  });

  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Don't open modal if user clicked on an external link or button inside the card
      if (e.target.closest('a') && e.target.closest('a').getAttribute('target') === '_blank') {
        return;
      }
      const id = card.getAttribute('data-article-id') || card.dataset.articleId || 'news-1';
      const data = ARTICLES_CONTENT[id] || ARTICLES_CONTENT['news-1'];

      document.getElementById('artModalCategory').textContent = data.category;
      document.getElementById('artModalDate').textContent = data.date;
      document.getElementById('artModalTitle').textContent = data.title;
      document.getElementById('artModalAuthor').textContent = data.author;
      document.getElementById('artModalBody').innerHTML = data.content;

      articleModal.classList.add('open');
    });
  });
}

/* ==========================================================================
   9. VIDEO PLAYER MODALI (YOUTUBE & HTML5 VIDEO)
   ========================================================================== */
function openVideoModal(title, arg2, arg3) {
  const modal = document.getElementById('videoModal');
  const titleEl = document.getElementById('videoModalTitle');
  const playerContainer = document.getElementById('videoPlayerContainer');

  if (!modal || !playerContainer) return;

  // Parametrlarni moslaş: openVideoModal(title, url) yoki openVideoModal(title, subtitle, url)
  let url = '';
  if (arg3) {
    url = arg3;
  } else {
    url = arg2 || '';
  }

  // 1. Modal sarlavhasini dinamik yangilaş (KATTA HARFLARDA)
  const displayTitle = (title || "OPTIK TOLALI LINIYALARNI FUSION SPLICER BILAN PAYVANDLAŞ").toUpperCase();
  if (titleEl) titleEl.textContent = displayTitle;

  // 2. Video manzilini tahlil qiliş va mos pleerni yaratiş
  let playerHtml = '';
  const isYouTube = url && (url.includes('youtube') || url.includes('youtu.be'));

  if (isYouTube) {
    // YouTube video ID ni aniqlaş
    const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|şorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i);
    const videoId = ytMatch ? ytMatch[1] : '';
    const embedUrl = videoId 
      ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` 
      : url;

    playerHtml = `<iframe 
      src="${embedUrl}" 
      title="${displayTitle}" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
      allowfullscreen>
    </iframe>`;
  } else if (url) {
    // HTML5 Video (.mp4, .webm, va h.k.)
    playerHtml = `<video 
      src="${url}" 
      controls 
      autoplay 
      playsinline 
      preload="metadata">
      Brauzeringiz uşbu videoni qöllab-quvvatlamaydi.
    </video>`;
  } else {
    // Agar URL kiritilmagan bo'lsa - standart preview poster
    playerHtml = `
      <div class="video-poster-overlay">
        <img src="assets/images/fiber_telecom.jpg" class="video-poster-img" alt="Video Preview">
        <div class="video-poster-content">
          <div class="video-poster-badge" onclick="openVideoModal('Optik Tolali Liniyalarni Fusion Splicer bilan Payvandlash', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ')">
            ▶ VIDEO MA'RUZA: Optik tolani kesiş va payvandlaş amaliyoti
          </div>
          <div class="video-poster-meta">Davomiyligi: 45:20 • Ruxsat: 1080p 60FPS Full HD</div>
        </div>
      </div>
    `;
  }

  // 3. Pleerni joylashtirish va modalni ochish
  playerContainer.innerHTML = playerHtml;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeVideoModal() {
  const modal = document.getElementById('videoModal');
  const playerContainer = document.getElementById('videoPlayerContainer');

  if (!modal) return;

  // Videoni to'xtatiş (kontentni tozalaş)
  if (playerContainer) {
    playerContainer.innerHTML = '';
  }

  // Modalni yopiş va sahifa scrollini qaytariş
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

// Global qiliş (HTML inline onclick orqali ham to'g'ridan-to'g'ri işlaşi uçun)
window.openVideoModal = openVideoModal;
window.closeVideoModal = closeVideoModal;

function initVideoPlayer() {
  const videoModal = document.getElementById('videoModal');
  const videoClose = document.getElementById('videoModalClose');
  const playTrigger = document.getElementById('videoPlayTrigger');

  // Asosiy video poster triggeri
  if (playTrigger) {
    playTrigger.addEventListener('click', () => {
      openVideoModal(
        "Optik Tolali Liniyalarni Fusion Splicer bilan Payvandlaş",
        "Video Masterklass • ATT-25 Laboratoriyasi",
        "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        "youtube"
      );
    });
  }

  // Yopiş tugmasi
  if (videoClose) {
    videoClose.addEventListener('click', closeVideoModal);
  }

  // Backdrop foniga bosilganda yopiş
  if (videoModal) {
    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) {
        closeVideoModal();
      }
    });
  }

  // Escape tugmasi bilan yopiş
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoModal && videoModal.classList.contains('open')) {
      closeVideoModal();
    }
  });
}

/* ==========================================================================
   10. TAQDIMOT KO'RISH (PRESENTATION) MODALI
   ========================================================================== */
function initPresentationModal() {
  const docModal = document.getElementById('presentationModal');
  const docClose = document.getElementById('presentationModalClose');
  const docBtns = document.querySelectorAll('.doc-btn');

  if (!docModal) return;

  function closeDoc() { docModal.classList.remove('open'); }
  if (docClose) docClose.addEventListener('click', closeDoc);

  docModal.addEventListener('click', (e) => {
    if (e.target === docModal) closeDoc();
  });

  docBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.doc-card');
      const title = card ? card.querySelector('.doc-title').textContent : "Taqdimot";
      document.getElementById('presModalTitle').textContent = title;
      docModal.classList.add('open');
    });
  });
}

/* ==========================================================================
   11. KATEGORIYA FILTRLARI (O'QUV REJA, TAQDIMOTLAR, MEDIA, MAQOLALAR)
   ========================================================================== */
function initCategoryFilters() {
  // 1. O'quv Dasturi (Curriculum) Semestr Filtrlari
  const curFilterBtns = document.querySelectorAll('#curriculumFilters .filter-btn');
  const moduleCards = document.querySelectorAll('#curriculumGrid .module-card');
  if (curFilterBtns.length && moduleCards.length) {
    curFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        curFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const sem = btn.getAttribute('data-semester');
        moduleCards.forEach(card => {
          if (sem === 'all' || card.getAttribute('data-semester') === sem) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // 2. Taqdimotlar va Qo'llanmalar (Docs) Filtrlari
  const docFilterBtns = document.querySelectorAll('#docsFilters .filter-btn');
  const docCards = document.querySelectorAll('#docsGrid .doc-card');
  if (docFilterBtns.length && docCards.length) {
    docFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        docFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const docType = btn.getAttribute('data-doc-type');
        docCards.forEach(card => {
          if (docType === 'all' || card.getAttribute('data-doc-type') === docType) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // 3. Maqolalar (Articles) Filtrlari
  const artFilterBtns = document.querySelectorAll('#articleFilters .filter-btn');
  const articleCards = document.querySelectorAll('#articlesGrid .article-card');
  if (artFilterBtns.length && articleCards.length) {
    artFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        artFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.getAttribute('data-article-cat');
        articleCards.forEach(card => {
          if (cat === 'all' || card.getAttribute('data-category') === cat) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // 3b. Ilmiy Naşrlar (Publications) Filtrlari (Scopus, WoS, Google Sçolar)
  const pubFilterBtns = document.querySelectorAll('#pubFilters .filter-btn');
  const pubCards = document.querySelectorAll('#pubCardsGrid .pub-card');
  if (pubFilterBtns.length && pubCards.length) {
    pubFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        pubFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.getAttribute('data-pub-cat');
        pubCards.forEach(card => {
          const cardCat = card.getAttribute('data-pub-cat') || '';
          if (cat === 'all' || cardCat.includes(cat)) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // 4. Media Hub Filtrlari (Videolar va Foto Galereya)
  const mediaFilterBtns = document.querySelectorAll('#mediaFilterBtns .filter-btn');
  const spotlight = document.querySelector('.video-spotlight');
  const photoGallery = document.querySelector('.photo-gallery-side');
  const videoGrid = document.getElementById('videoMaterialsGrid');

  if (mediaFilterBtns.length) {
    mediaFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        mediaFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');
        if (filter === 'all') {
          if (spotlight) spotlight.style.display = '';
          if (photoGallery) photoGallery.style.display = '';
          if (videoGrid) videoGrid.style.display = '';
        } else if (filter === 'video') {
          if (spotlight) spotlight.style.display = '';
          if (photoGallery) photoGallery.style.display = 'none';
          if (videoGrid) videoGrid.style.display = '';
        } else if (filter === 'photo') {
          if (spotlight) spotlight.style.display = 'none';
          if (photoGallery) photoGallery.style.display = '';
          if (videoGrid) videoGrid.style.display = 'none';
        }
      });
    });
  }
}

/* ==========================================================================
   12. HEMIS FAN SILABUSLARI MA'LUMOT BAZASI VA MODALI
   ========================================================================== */
const SYLLABUS_DATA = {
  // ==================== 1-SEMESTR (08.09.2025 - 20.12.2025) ====================
  tarix: {
    title: "Özbekistonning eng yangi tarixi",
    code: "HIST1101",
    semester: "1-Semestr (08 sentabr, 2025 / 20 dekabr, 2025)",
    hours: "120 Soat (Ma'ruza: 40, Amaliyot: 40, Mustaqil: 40)",
    credits: "4.0 ECTS Kredit",
    type: "Majburiy Fan",
    description: "Mustaqillik yillarida Özbekiston davlatçiligining şakllanişi, Yangi Özbekiston taraqqiyot strategiyasi, ijtimoiy-iqtisodiy islohotlar va xalqaro munosabatlar.",
    topics: [
      "1-Hafta: Mustaqillik arafasidagi ijtimoiy-siyosiy jarayonlar va davlat suverenitetining e'lon qilinişi.",
      "2-Hafta: Özbekiston Respublikasi Konstitutsiyasining yaratilişi va huquqiy davlat poydevori.",
      "3-Hafta: Iqtisodiy islohotlar: bozor munosabatlariga bosqiçma-bosqiç ötiş va milliy valyuta joriy etilişi.",
      "4-Hafta: Yangi Özbekiston taraqqiyot strategiyasi va inson qadrini uluğlaş tamoyillari.",
      "5-Hafta: Ma'naviy merosni tiklaş, milliy özlikni anglaş va ta'lim-fan sohasidagi modernizatsiya.",
      "6-Hafta: Özbekistonning mintaqaviy va global xalqaro taşkilotlar (BMT, ShHT, MDH) bilan hamkorligi."
    ],
    literature: [
      "Özbekiston Respublikasining eng yangi tarixi (Darslik), Toşkent, 2021.",
      "Ş.M.Mirziyoyev 'Yangi Özbekiston taraqqiyot strategiyasi', Toşkent, 2022."
    ],
    evaluation: "Oraliq nazorat: 30 ball | Seminar & Faollik: 20 ball | Yakuniy imtihon: 50 ball"
  },
  ingliz1: {
    title: "Ingliz tili I (General & Technical English)",
    code: "ENG1102",
    semester: "1-Semestr (08 sentabr, 2025 / 20 dekabr, 2025)",
    hours: "120 Soat (Amaliyot: 60, Mustaqil: 60)",
    credits: "4.0 ECTS Kredit",
    type: "Majburiy Fan",
    description: "Umumiy va sohaviy ingliz tili grammatikasi, texnika va axborot texnologiyalari terminologiyasi, matnlarni tahlil qiliş va muhandislik muloqoti.",
    topics: [
      "1-Hafta: Grammar Essentials: Tenses review (Present, Past, Future) and technical sentence syntax.",
      "2-Hafta: IT & Networking Vocabulary: Computer hardware components, OS and peripheral devices.",
      "3-Hafta: Reading Comprehension: Skimming, scanning and summarizing scientific engineering articles.",
      "4-Hafta: Passive Voice and First/Second Conditionals in engineering manuals.",
      "5-Hafta: Listening & Academic Note-Taking: Tech presentations, key ideas and technical podcasts.",
      "6-Hafta: Speaking & Defending: Presenting engineering solutions and participating in discussions."
    ],
    literature: [
      "Raymond Murphy, 'English Grammar in Use', 5th Edition, Cambridge University Press.",
      "Eric H. Glendinning, 'Oxford English for Information Technology', Oxford University Press."
    ],
    evaluation: "Amaliy topşiriqlar: 30 ball | Oraliq test: 20 ball | Yakuniy imtihon: 50 ball"
  },
  calculus1: {
    title: "Hisob (Calculus) I",
    code: "MATH1103",
    semester: "1-Semestr (08 sentabr, 2025 / 20 dekabr, 2025)",
    hours: "180 Soat (Ma'ruza: 60, Amaliyot: 60, Mustaqil: 60)",
    credits: "6.0 ECTS Kredit",
    type: "Majburiy Fan",
    description: "Bir özgaruvçili funksiyalar differensial va integral hisobi, limitlar, uzluksizlik, Teylor qatorlari hamda hisobning fizik va texnik jarayonlarga tatbiqlari.",
    topics: [
      "1-Hafta: Haqiqiy sonlar, ketma-ketliklar va ketma-ketliklar limiti nazariyasi.",
      "2-Hafta: Funksiyalar, funksiya limiti va ajoyib limitlar (Koşi va Geyne ta'riflari).",
      "3-Hafta: Funksiyaning uzluksizligi, uziliş turlari va uzluksiz funksiyalarning xossalari.",
      "4-Hafta: Hosila tuşunçasi, geometrik va fizik talqini, asosiy differensiallaş qoidalari.",
      "5-Hafta: Yuqori tartibli hosilalar, Lopital qoidasi va Teylor/Makloren köphadlari.",
      "6-Hafta: Hosila yordamida funksiyani töliq tekşiriş va grafiklarini çiziş.",
      "7-Hafta: Boşlanğiç funksiya, noaniq integral va asosiy integrallaş usullari.",
      "8-Hafta: Ratsional kasrlarni va trigonometrik ifodalarni integrallaş.",
      "9-Hafta: Aniq integral, Nyuton-Leybnits formulasi va özgaruvçini almaştiriş.",
      "10-Hafta: Xosmas integrallar: çeksiz oraliq va çegaralanmagan funksiyalar integrallari.",
      "11-Hafta: Aniq integralning geometrik va mexanik tatbiqlari (yuzalar, yoy uzunligi, hajm).",
      "12-Hafta: Hisob usullarining telekommunikatsiya signallari va tarmoq modellaridagi örni."
    ],
    literature: [
      "James Stewart, 'Calculus: Early Transcendentals', 8th Edition, Cengage Learning.",
      "Soatov Yo.U. 'Oliy matematika', 1-jild, Öqituvçi naşriyoti.",
      "Thomas' Calculus, 14th Edition, Pearson."
    ],
    evaluation: "Amaliy maşğulot: 30 ball | Oraliq nazorat: 20 ball | Yakuniy imtihon: 50 ball"
  },
  fizika1: {
    title: "Fizika I (Mexanika va termodinamika)",
    code: "PHYS1104",
    semester: "1-Semestr (08 sentabr, 2025 / 20 dekabr, 2025)",
    hours: "180 Soat (Ma'ruza: 60, Laboratoriya: 60, Mustaqil: 60)",
    credits: "6.0 ECTS Kredit",
    type: "Majburiy Fan",
    description: "Klassik Nyuton mexanikasi, aylanma harakat, saqlaniş qonunlari, molekulyar fizika, termodinamika va mexanik tölqinlar harakati.",
    topics: [
      "1-Hafta: Kinematika: moddiy nuqta harakati, tezlik va tezlaniş vektorlari, egri çiziqli harakat.",
      "2-Hafta: Nyuton qonunlari, kuçlar tabiati va harakat differensial tenglamalari.",
      "3-Hafta: Saqlaniş qonunlari: impuls, mexanik energiya va impuls momenti.",
      "4-Hafta: Qattiq jism dinamikasi: inersiya momenti, Şteyner teoremasi va aylanma harakat energiyasi.",
      "5-Hafta: Gidrostatika va gidrodinamika: Paskal qonuni, uzluksizlik tenglamasi va Bernulli tenglamasi.",
      "6-Hafta: Garmonik tebranişlar, sönuvçi va majburiy tebranişlar, rezonans.",
      "7-Hafta: Elastik muhitda tölqinlar tarqalişi, tölqin tenglamasi, Dopler effekti.",
      "8-Hafta: Molekulyar-kinetik nazariya asoslari va ideal gaz holat tenglamasi (Mendeleyev-Klapeyron).",
      "9-Hafta: Statistik taqsimotlar: Maksvell tezlik taqsimoti va Bolsman balandlik formulasi.",
      "10-Hafta: Termodinamikaning birinçi qonuni va izojarayonlarda bajarilgan iş.",
      "11-Hafta: Termodinamikaning ikkinçi qonuni, Karno sikli, FIK va Entropiya tuşunçasi.",
      "12-Hafta: Real gazlar, Van-der-Vaals tenglamasi va faza ötişlari fizikasi."
    ],
    literature: [
      "Halliday D., Resnick R., Walker J. 'Fundamentals of Physics: Mechanics & Thermodynamics', 11th Edition.",
      "Sivuxin D.V. 'Umumiy fizika kursi', 1-2 jildlar.",
      "TIIAME Fizika kafedrasi laboratoriya qöllanmasi."
    ],
    evaluation: "Laboratoriya stendlari: 30 ball | Oraliq test: 20 ball | Yakuniy imtihon: 50 ball"
  },
  dasturlash1: {
    title: "Dasturlaş I (Strukturali C/C++)",
    code: "CS1105",
    semester: "1-Semestr (08 sentabr, 2025 / 20 dekabr, 2025)",
    hours: "180 Soat (Ma'ruza: 60, Laboratoriya: 60, Mustaqil: 60)",
    credits: "6.0 ECTS Kredit",
    type: "Majburiy Fan",
    description: "Algoritmik asoslar, C va C++ sintaksisi, oqim boşqaruvi, funksiyalar, massivlar, körsatkiçlar (pointers), xotira boşqaruvi va fayllar bilan işlaş.",
    topics: [
      "1-Hafta: Dasturlaşga kiriş, kompyuter xotira arxitekturasi va GCC/Clang kompyilyatsiya jarayoni.",
      "2-Hafta: Ma'lumot turlari, özgaruvçilar, konstantalar, arifmetik va mantiqiy operatorlar.",
      "3-Hafta: Şart operatorlari: if, else if, else va köp variantli switch-case konstruktsiyasi.",
      "4-Hafta: Sikl operatorlari: for, while, do-while hamda break va continue boşqaruvi.",
      "5-Hafta: Bir ölçamli va ikki ölçamli (matritsalar) massivlar ustida amallar.",
      "6-Hafta: Satrlar va belgili massivlar: çar[], cstring funksiyalari va string sinfi.",
      "7-Hafta: Funksiyalar, parametr uzatiş (qiymat va havola orqali), rekursiv funksiyalar.",
      "8-Hafta: Körsatkiçlar (Pointers) tuşunçasi, xotira manzili va körsatkiçlar arifmetikasi.",
      "9-Hafta: Dinamik xotira boşqaruvi: malloc/calloc/free (C) va new/delete (C++).",
      "10-Hafta: Foydalanuvçi ma'lumot turlari: struct, union, enum va typedef.",
      "11-Hafta: Faylli kiritiş-çiqariş: matnli va binar fayllarni öqiş/yoziş (fstream).",
      "12-Hafta: Yakuniy loyiha: C++ da talabalar bazasi yoki tarmoq konsol utilitasi loyihasi."
    ],
    literature: [
      "Brian W. Kernighan, Dennis M. Ritçie, 'The C Programming Language', 2nd Edition.",
      "Bjarne Stroustrup, 'Programming: Principles and Practice Using C++', 2nd Edition.",
      "Paul Deitel, Harvey Deitel, 'C++ How to Program', 10th Edition, Pearson."
    ],
    evaluation: "Laboratoriya kod topşiriqlari: 30 ball | Oraliq test: 20 ball | Yakuniy nazorat: 50 ball"
  },
  akademik_yozuv: {
    title: "Akademik yozuv",
    code: "ACAD1106",
    semester: "1-Semestr (08 sentabr, 2025 / 20 dekabr, 2025)",
    hours: "120 Soat (Ma'ruza: 30, Amaliyot: 30, Mustaqil: 60)",
    credits: "4.0 ECTS Kredit",
    type: "Majburiy Fan",
    description: "Ilmiy maqola va dissertatsiyalar yoziş uslubiyoti, bibliografik standartlar (IEEE, APA), adabiyotlar tahlili va akademik halollik madaniyati.",
    topics: [
      "1-Hafta: Akademik yozuvga kiriş: ilmiy uslub, xolislik va akademik muloqot xususiyatlari.",
      "2-Hafta: Ilmiy maqola strukturasi (IMRAD: Kiriş, Usullar, Natijalar va Muhokama).",
      "3-Hafta: Ilmiy muammo qöyilişi, tadqiqot maqsadi va gipotezalarni şakllantiriş.",
      "4-Hafta: Ilmiy adabiyotlar bilan işlaş va tizimli tahlil (Scopus, Web of Science, IEEE Xplore).",
      "5-Hafta: Iqtibos keltiriş qoidalari (IEEE, APA standartlari) va bibliografik menejerlar (Zotero, Mendeley).",
      "6-Hafta: Ilmiy annotatsiya (abstract) yoziş, ilmiy etika va plagiatga qarşi kuraş."
    ],
    literature: [
      "Stephen Bailey, 'Academic Writing: A Handbook for International Students', Routledge.",
      "IEEE Citation Reference Guide, IEEE Authors Center.",
      "Oliy attestatsiya komissiyasi dissertatsiya va maqolalarga qöyadigan rasmiy talablari."
    ],
    evaluation: "Amaliy maqola loyihasi: 30 ball | Taqdimot: 20 ball | Yakuniy nazorat: 50 ball"
  },

  // ==================== 2-SEMESTR (09.02.2026 - 30.05.2026) ====================
  calculus2: {
    title: "Hisob (Calculus) II",
    code: "MATH1201",
    semester: "2-Semestr (09 fevral, 2026 / 30 may, 2026)",
    hours: "180 Soat (Ma'ruza: 60, Amaliyot: 60, Mustaqil: 60)",
    credits: "6.0 ECTS Kredit",
    type: "Majburiy Fan",
    description: "Köp özgaruvçili funksiyalar differensial hisobi, xususiy hosilalar, karrali va sirt integrallari, vektor maydonlari hamda qatorlar nazariyasi.",
    topics: [
      "1-Hafta: Köp özgaruvçili funksiyalar: aniqlaniş sohasi, limiti va uzluksizligi.",
      "2-Hafta: Xususiy hosilalar va töliq differensial tuşunçasi.",
      "3-Hafta: Yönaliş böyiça hosila, gradient vektori va urinma tekislik tenglamasi.",
      "4-Hafta: Köp özgaruvçili funksiyaning lokal va şartli ekstremumlari (Lagranj usuli).",
      "5-Hafta: Ikki karrali integral: töğri burçakli va qutb koordinatalarida hisoblaş.",
      "6-Hafta: Uç karrali integral: silindrik va sferik koordinatalar sistemasidagi tatbiqlar.",
      "7-Hafta: Birinçi va ikkinçi tur egri çiziqli integrallar, Grin formulasi.",
      "8-Hafta: Sirt integrallari, Gauss-Ostrogradskiy va Stoks teoremalari.",
      "9-Hafta: Vektor maydonlari nazariyasi: divergensiya, rotor va potensial maydonlar.",
      "10-Hafta: Sonli qatorlar: musbat hadli qatorlarning yaqinlaşiş alomatlari (Dalamber, Koşi).",
      "11-Hafta: Özgaruvçan işorali qatorlar (Leybnits alomati), mutlaq va şartli yaqinlaşiş.",
      "12-Hafta: Darajali qatorlar, Teylor qatorlari va Furye qatorlariga kiriş."
    ],
    literature: [
      "James Stewart, 'Multivariable Calculus', 8th Edition, Cengage Learning.",
      "Thomas' Calculus: Early Transcendentals, 14th Edition, Pearson.",
      "Soatov Yo.U. 'Oliy matematika', 2-jild."
    ],
    evaluation: "Amaliy maşğulot: 30 ball | Oraliq nazorat: 20 ball | Yakuniy imtihon: 50 ball"
  },
  dasturlash2: {
    title: "Dasturlaş II (OOP C++)",
    code: "CS1202",
    semester: "2-Semestr (09 fevral, 2026 / 30 may, 2026)",
    hours: "120 Soat (Ma'ruza: 40, Laboratoriya: 40, Mustaqil: 40)",
    credits: "4.0 ECTS Kredit",
    type: "Majburiy Fan",
    description: "Ob'yektga yönaltirilgan dasturlaş (OOP) tamoyillari, sinflar, merosxörlik, polimorfizm, şablonlar (templates) va STL kutubxonasi.",
    topics: [
      "1-Hafta: Ob'yektga yönaltirilgan dasturlaş paradigmasi va tamoyillari.",
      "2-Hafta: Klasslar va ob'yektlar: ma'lumot a'zolari, metodlar va this körsatkiçi.",
      "3-Hafta: Konstruktorlar (standart, parametrli, nusxalaş) va destruktorlar.",
      "4-Hafta: Inkapsulyatsiya va kiriş modifikatorlari (public, private, protected).",
      "5-Hafta: Operatorlarni qayta yuklaş (Operator Overloading) va döst funksiyalar (friend).",
      "6-Hafta: Merosxörlik (Inheritance): yakka, köp poğonali va köp tomonlama merosxörlik.",
      "7-Hafta: Polimorfizm: erta va keç boğlaniş, virtual funksiyalar va abstrakt sinflar.",
      "8-Hafta: Şablonlar (Templates): funksiya va klass şablonlarini loyihalaş.",
      "9-Hafta: Istisnolar (Exceptions): try, catch, throw va xatoliklarni xavfsiz boşqariş.",
      "10-Hafta: C++ Standard Template Library (STL): ketma-ket konteynerlar (vector, deque, list).",
      "11-Hafta: Assotsiativ konteynerlar (set, map, unordered_map) va STL algoritmlari.",
      "12-Hafta: Aqlli körsatkiçlar (unique_ptr, şared_ptr) va xotira sizib çiqişini oldini oliş."
    ],
    literature: [
      "Bjarne Stroustrup, 'The C++ Programming Language', 4th Edition, Addison-Wesley.",
      "Scott Meyers, 'Effective Modern C++', ÖReilly Media.",
      "Robert Lafore, 'Object-Oriented Programming in C++', 4th Edition."
    ],
    evaluation: "Laboratoriya loyihalari: 30 ball | Oraliq test: 20 ball | Yakuniy nazorat: 50 ball"
  },
  algoritmlar2: {
    title: "Ma'lumotlar tuzilmasi va algoritmlar",
    code: "CS1203",
    semester: "2-Semestr (09 fevral, 2026 / 30 may, 2026)",
    hours: "120 Soat (Ma'ruza: 40, Laboratoriya: 40, Mustaqil: 40)",
    credits: "4.0 ECTS Kredit",
    type: "Majburiy Fan",
    description: "Çiziqli va noçiziqli ma'lumot tuzilmalari, qidiriş, saralaş algoritmlari, asimptotik murakkablik (Big-O) va algoritmlarni optimallaştiriş.",
    topics: [
      "1-Hafta: Algoritmlar tahlili: vaqt va xotira murakkabligi, Big-O, Big-Omega, Big-Theta.",
      "2-Hafta: Çiziqli tuzilmalar: bir va ikki boğlamli röyxatlar (Singly & Doubly Linked List).",
      "3-Hafta: Stek (Stack: LIFO) arxitekturasi va uning qavslar balansida hamda rekursiyada qöllanişi.",
      "4-Hafta: Navbat (Queue: FIFO), doiraviy navbat va ikkita uçli navbat (Deque).",
      "5-Hafta: Oddiy saralaş algoritmlari: Bubble sort, Selection sort va Insertion sort.",
      "6-Hafta: Samarali saralaş: MergeSort, QuickSort va HeapSort (piramidali saralaş).",
      "7-Hafta: Qidiruv algoritmlari: çiziqli qidiruv, binar qidiruv (Binary Search) va interpolatsiya.",
      "8-Hafta: Binar qidiruv daraxtlari (BST): kiritiş, öçiriş va aylanib çiqiş (Inorder, Preorder, Postorder).",
      "9-Hafta: Balanslangan daraxtlar: AVL daraxti va aylanmalar (rotations).",
      "10-Hafta: Xeş jadvallari (Hash Tables), xeş funksiyalar va kolliziyalarni yeçiş usullari.",
      "11-Hafta: Graflarda qidiruv: Kenglik böyiça qidiruv (BFS) va çuqurlik böyiça qidiruv (DFS).",
      "12-Hafta: Eng qisqa yölni topiş: Deykstra (Dijkstra) va Bellman-Ford algoritmlari."
    ],
    literature: [
      "Thomas H. Cormen, Çarles E. Leiserson, Ronald L. Rivest, Clifford Stein, 'Introduction to Algorithms' (CLRS), 3rd/4th Edition, MIT Press.",
      "Robert Sedgewick, Kevin Wayne, 'Algorithms', 4th Edition, Addison-Wesley."
    ],
    evaluation: "Algoritmik topşiriqlar: 30 ball | Oraliq test: 20 ball | Yakuniy imtihon: 50 ball"
  },
  falsafa: {
    title: "Falsafa",
    code: "PHIL1204",
    semester: "2-Semestr (09 fevral, 2026 / 30 may, 2026)",
    hours: "120 Soat (Ma'ruza: 40, Seminar: 40, Mustaqil: 40)",
    credits: "4.0 ECTS Kredit",
    type: "Majburiy Fan",
    description: "Falsafiy dunyoqaraş, ontologiya, gnoseologiya, ilmiy biliş metodologiyasi, axborot jamiyati falsafasi va muhandislik etikasi.",
    topics: [
      "1-Hafta: Falsafa tuşunçasi, predmeti, metodlari va jamiyat taraqqiyotidagi örni.",
      "2-Hafta: Qadimgi Şarq va Antik davr Ğarb falsafiy ta'limotlari qiyosiy tahlili.",
      "3-Hafta: Örta asrlar Şarq Uyğoniş davri mutafakkirlarining falsafiy-ilmiy merosi.",
      "4-Hafta: Ontologiya: borliq konsepsiyasi, materiya şakllari, fazo va vaqt mezonlari.",
      "5-Hafta: Gnoseologiya: biliş nazariyasi, haqiqat mezonlari va ilmiy metodologiya.",
      "6-Hafta: Mantiqiy tafakkur qonuniyatlari va ilmiy xulosalar çiqariş tamoyillari.",
      "7-Hafta: Axborot jamiyati falsafasi: raqamli transformatsiya va inson omili.",
      "8-Hafta: Sun'iy intellekt davrida texnika etikasi va muhandislik mas'uliyati."
    ],
    literature: [
      "Falsafa (Darslik), E.Yusupov tahriri ostida, Toşkent, 2020.",
      "Luciano Floridi, 'The Philosophy of Information', Oxford University Press."
    ],
    evaluation: "Seminar baholari: 30 ball | Esse & Referat: 20 ball | Yakuniy nazorat: 50 ball"
  },
  dinshunoslik: {
    title: "Dinşunoslik",
    code: "REL1205",
    semester: "2-Semestr (09 fevral, 2026 / 30 may, 2026)",
    hours: "120 Soat (Ma'ruza: 40, Seminar: 40, Mustaqil: 40)",
    credits: "4.0 ECTS Kredit",
    type: "Majburiy Fan",
    description: "Jahon dinlari tarixi, konfessiyalararo bağrikenglik (tolerantlik), islom sivilizatsiyasi, vijdon erkinligi va diniy ekstremizmga qarşi mafkuraviy immunitet.",
    topics: [
      "1-Hafta: Dinşunoslik fanining maqsadi, vazifalari va dinning ijtimoiy-tarixiy mohiyati.",
      "2-Hafta: Ibtidoiy diniy tasavvurlar va qadimgi milliy dinlar (Zarduştiylik, Iudaizm, Hinduiylik).",
      "3-Hafta: Jahon dinlari: Buddaviylikning vujudga kelişi, ta'limoti va yönalişlari.",
      "4-Hafta: Xristianlik dini: tarixiy şakllanişi, manbalari va asosiy tarmoqlari.",
      "5-Hafta: Islom dini: vujudga kelişi, Qur'oni Karim, Hadisi Şarif va şariat asoslari.",
      "6-Hafta: Markaziy Osiyo mutafakkirlarining islom madaniyati va ma'rifatiga qöşgan hissasi.",
      "7-Hafta: Özbekistonda vijdon erkinligi qonunçiligi va dinlararo totuvlik madaniyati.",
      "8-Hafta: Diniy ekstremizm, fundamentalizm va yot buzğunçi ğoyalarga qarşi kuraş çoralari."
    ],
    literature: [
      "Dinşunoslik (Öquv qöllanma), Toşkent Islom Universiteti naşriyoti.",
      "Özbekiston Respublikasining 'Vijdon erkinligi va diniy taşkilotlar töğrisida'gi Qonuni."
    ],
    evaluation: "Seminar faolligi: 30 ball | Test nazorati: 20 ball | Yakuniy nazorat: 50 ball"
  },
  xorijiy_til2: {
    title: "Xorijiy til II (Professional IT English)",
    code: "ENG1206",
    semester: "2-Semestr (09 fevral, 2026 / 30 may, 2026)",
    hours: "120 Soat (Amaliyot: 60, Mustaqil: 60)",
    credits: "4.0 ECTS Kredit",
    type: "Majburiy Fan",
    description: "AKT va telekommunikatsiya sohasi mutaxassislari uçun kasbiy ingliz tili, xalqaro texnik standartlar (RFC, IEEE), texnik hujjatlaştiriş va muzokaralar.",
    topics: [
      "1-Hafta: Professional Networking Vocabulary: Routing protocols, topology terms and OSI layers.",
      "2-Hafta: Reading Technical Documentation: Cisco configuration guides, RFC whitepapers.",
      "3-Hafta: Hardware & Infrastructure Terminology: Fiber optics, patch panels, transceiver specs.",
      "4-Hafta: Technical Problem Solving: Network troubleşooting communication and bug reports.",
      "5-Hafta: Cloud Architecture & Cybersecurity Vocab: Zero Trust, AWS/Azure, Firewalls.",
      "6-Hafta: Professional IT Interview Prep: Explaining network architecture and technical interview skills."
    ],
    literature: [
      "Santiago Remaça Esteras, 'Infoteç: English for Computer Users', 4th Edition, Cambridge.",
      "IETF RFC Standards and IEEE Communications Glossary."
    ],
    evaluation: "Kasbiy suhbat: 30 ball | Texnik yozuv testi: 20 ball | Yakuniy imtihon: 50 ball"
  },
  fizika2: {
    title: "Fizika II (Elektr va magnetizm)",
    code: "PHYS1207",
    semester: "2-Semestr (09 fevral, 2026 / 30 may, 2026)",
    hours: "120 Soat (Ma'ruza: 40, Laboratoriya: 40, Mustaqil: 40)",
    credits: "4.0 ECTS Kredit",
    type: "Majburiy Fan",
    description: "Elektrostatika, doimiy va özgaruvçan tok qonuniyatlari, magnit maydon, elektromagnit induksiya, tölqinlar optikasi va Maksvell tenglamalari.",
    topics: [
      "1-Hafta: Elektrostatik maydon: Kulon qonuni, maydon kuçlanganligi va superpozitsiya prinsipi.",
      "2-Hafta: Elektrostatikada Gauss teoremasi va zaryadlangan sirtlar maydonini hisoblaş.",
      "3-Hafta: Maydon potensiali, potensiallar farqi va elektrostatik potensial energiya.",
      "4-Hafta: Dielektriklar va ötkazgiçlar elektr maydonda, elektr siğim va kondensatorlar.",
      "5-Hafta: Doimiy elektr toki: Om qonuni, Joul-Lens qonuni va Kirxgof qoidalari.",
      "6-Hafta: Magnit maydon: Bio-Savar-Laplas qonuni, Amper kuçi va magnit maydon sirkulyatsiyasi.",
      "7-Hafta: Lorens kuçi, zaryadlangan zarraçalarning harakati va Xoll effekti.",
      "8-Hafta: Elektromagnit induksiya qonuni (Faradey), Lens qoidasi va özinduksiya hodisasi.",
      "9-Hafta: Magnit maydon energiyasi va ferromagnit moddalar fizikasi (Gisterezis sirti).",
      "10-Hafta: Özgaruvçan elektr toki, reaktiv qarşiliklar (L, C) va tebraniş konturi.",
      "11-Hafta: Elektromagnit tölqinlar, tölqin tenglamasi va energiya oqimi (Poynting vektori).",
      "12-Hafta: Maksvell tenglamalari tizimi va optik tolada yoruğlik tölqinlarining töliq içki qaytişi."
    ],
    literature: [
      "Halliday D., Resnick R., Walker J. 'Fundamentals of Physics: Electricity & Magnetism', 11th Edition.",
      "Purcell E.M., Morin D.J. 'Electricity and Magnetism', 3rd Edition, Cambridge University Press.",
      "TIIAME Fizika kafedrasi laboratoriya qöllanmasi."
    ],
    evaluation: "Laboratoriya tajribalari: 30 ball | Oraliq nazorat: 20 ball | Yakuniy imtihon: 50 ball"
  },

  // ==================== 3-SEMESTR (KUZGI 2026 - FAOL) ====================
  algebra: {
    title: "Çiziqli algebra",
    code: "MATH2101",
    semester: "3-Semestr (Kuzgi 2026)",
    hours: "180 Soat (Ma'ruza: 60, Amaliyot: 60, Mustaqil: 60)",
    credits: "6.0 ECTS Kredit",
    type: "Majburiy Fan",
    description: "Uşbu fan matritsalar nazariyasi, vektor fazolari, çiziqli operatorlar, xos qiymat va xos vektorlar hamda ularni kompyuter grafikasi va tarmoq modellarida qöllaşni örgatadi.",
    topics: [
      "1-Hafta: Matritsalar, ularning turlari va matritsalar ustida çiziqli amallar.",
      "2-Hafta: Determinantlar, ularning xossalari va hisoblaş usullari (Laplas teoremasi).",
      "3-Hafta: Teskari matritsa va matritsali tenglamalar.",
      "4-Hafta: Çiziqli algebraik tenglamalar sistemasi (Kramer qoidasi, Gauss usuli).",
      "5-Hafta: Kroneker-Kapelli teoremasi va fundamental yeçimlar sistemasi.",
      "6-Hafta: Vektor fazolari, çiziqli boğliq va boğliq bölmagan sistemalar.",
      "7-Hafta: Fazo bazisi, ölçami va koordinatalar almaştiriş.",
      "8-Hafta: Çiziqli operatorlar va ularning matritsaviy ifodasi.",
      "9-Hafta: Çiziqli operatorning xos qiymatlari va xos vektorlari.",
      "10-Hafta: Kvadratik formalar, kanonik va normal körinişga keltiriş.",
      "11-Hafta: Evklid fazolari, Skalyar köpaytma va Gram-Şmidt ortogonallaştiriş jarayoni.",
      "12-Hafta: Çiziqli algebraning axborot texnologiyalari va 3D grafika hamda kriptografiyadagi tatbiqlari."
    ],
    literature: [
      "Strang G. 'Linear Algebra and Its Applications', 5th Edition.",
      "Soatov Yo.U. 'Oliy matematika', 1-2 jildlar.",
      "Lay D.C. 'Linear Algebra and Its Applications', Pearson."
    ],
    evaluation: "Joriy nazorat: 30 ball | Oraliq nazorat: 20 ball | Yakuniy nazorat: 50 ball"
  },
  database: {
    title: "Ma'lumotlar bazasi",
    code: "CS2102",
    semester: "3-Semestr (Kuzgi 2026)",
    hours: "180 Soat (Ma'ruza: 60, Laboratoriya: 60, Mustaqil: 60)",
    credits: "6.0 ECTS Kredit",
    type: "Majburiy Fan",
    description: "Relyatsion ma'lumotlar modellari, ER-diagrammalar (ERD) loyihalaş, SQL tili, tranzaksiyalar boşqaruvi (ACID) va zamonaviy RDBMS (PostgreSQL, MySQL) bilan işlaş könikmalarini şakllantiradi.",
    topics: [
      "1-Hafta: Ma'lumotlar bazalariga kiriş, relyatsion model konsepsiyasi.",
      "2-Hafta: Konseptual loyihalaş: Ob'yekt-Aloqa (ER) diagrammalari.",
      "3-Hafta: Relyatsion algebra va mantiqiy modelga ötkaziş.",
      "4-Hafta: SQL tili asoslari: DDL (CREATE, ALTER, DROP).",
      "5-Hafta: Ma'lumotlar ustida amallar: DML (INSERT, UPDATE, DELETE).",
      "6-Hafta: Murakkab sörovlar (SELECT, WHERE, GROUP BY, HAVING, ORDER BY).",
      "7-Hafta: Jadvallarni birlaştiriş: INNER, LEFT, RIGHT, FULL OUTER JOIN.",
      "8-Hafta: Içki sörovlar (Subqueries) va körinişlar (Views).",
      "9-Hafta: Ma'lumotlar bazasini normalizatsiya qiliş (1NF, 2NF, 3NF, BCNF).",
      "10-Hafta: Tranzaksiyalar, ACID xossalari va blokirovkalar (Locks).",
      "11-Hafta: Indekslaş (B-Tree, Hash index) va sörovlar optimizatsiyasi (EXPLAIN ANALYZE).",
      "12-Hafta: Triggirlar, saqlanuvçi protseduralar va PostgreSQL ma'murligi."
    ],
    literature: [
      "Silbersçatz A., Korth H., Sudarşan S. 'Database System Concepts', 7th Edition.",
      "Date C.J. 'An Introduction to Database Systems', 8th Edition.",
      "PostgreSQL 16 Official Documentation."
    ],
    evaluation: "Laboratoriya işlari: 30 ball | Oraliq nazorat: 20 ball | Yakuniy nazorat: 50 ball"
  },
  electronics: {
    title: "Elektronika va sxemalar",
    code: "EE2103",
    semester: "3-Semestr (Kuzgi 2026)",
    hours: "180 Soat (Auditoriya: 72 soat [Maʼruza: 30s, Amaliyot: 30s, Lab: 12s], Mustaqil taʼlim: 108s)",
    credits: "6.0 ECTS Kredit",
    type: "Majburiy Fan",
    description: "Talabalarga elektronika elementlar bazasini, analog va raqamli elektron qurilmalarni işlaş tamoyillarini örganiş, hisoblaş, elektron sxemalarni tuziş va loyihalaş masalalari böyiça nazariy bilim hamda amaliy könikma hosil qiliş.",
    maqsadi: "Talabalarga elektronika elementlar bazasini, analog va raqamli elektron qurilmalarni işlaş tamoyillarini örganiş, hisoblaş, elektron sxemalarni tuziş va loyihalaş masalalari böyiça nazariy bilimning qonun va tamoyillarini örgatiş hamda amaliyotga tatbiq etiş könikmasini hosil qilişdan iborat.",
    vazifalari: "Nazariy bilimlar, amaliy könikmalar, elektron asboblar klassifikatsiyasi va işlaş tamoyillarini örganiş, elektron sxemalarni öqiy oliş, tuziş, loyihalaş hamda tavsiflarini baholaş kabi hodisa va jarayonlarga uslubiy yondaşuv hamda ilmiy dunyoqaraşini şakllantiriş, qonunlar va elektrofizik jarayonlar mazmun va mohiyatini biliş, ularga nisbatan şaxsiy munosabatni şakllantiriş orqali fanning iqtisodiyotdagi örni va ahamiyatini oçib beriş.",
    lectures: [
      { id: "M1", title: "Kiriş. “Elektronika va sxemalar” fanining predmeti va vazifalari.", hours: 2, ref: "[1, 2]", topics: ["Elektronika va sxemalar haqida asosiy tuşunçalar.", "Elektronika va sxemalar predmetining asosiy vazifalari.", "Elektronika fanining asosiy rivojlaniş bosqiçlari.", "Elektron asboblar va ularning ölçaş texnikasidagi örni."] },
      { id: "M2", title: "Yarim ötkazgiçlarning elektr ötkazuvçanligi.", hours: 2, ref: "[1, 2]", topics: ["Aralaşmasiz (xususiy) va aralaşmali yarim ötkazgiçlar.", "Toza yarim ötkazgiçlarda zaryad taşuvçilar (elektron va kovaklar).", "Aralaşmali yarim ötkazgiçlarda zaryad taşuvçilar (donor va akseptor).", "Zaryad taşuvçilarning dreyf va diffuzion harakatlari."] },
      { id: "M3", title: "Diodlar. Diodning işlaş prinsipi va volt-amper tavsifi (VAT).", hours: 2, ref: "[3]", topics: ["Taşqi kuçlaniş mavjud bölmaganda p-n ötişdagi muvozanatli elektr jarayonlar.", "Taşqi kuçlaniş mavjud bölganda p-n ötişdagi jarayonlar.", "p-n ötişning to‘siq va diffuzion siğimlari.", "Diodning turlari (Stabilitron, Varikap, Shottki, Svetodiod) va tamğalanişi."] },
      { id: "M4", title: "Bipolyar tranzistorlar (BJT).", hours: 2, ref: "[2, 4]", topics: ["Bipolyar tranzistorlarning işlaş tamoyillari, klassifikatsiyasi (p-n-p, n-p-n).", "Ulaniş sxemalari (UE — Umumiy Emitter, UB — Umumiy Baza, UK — Umumiy Kollektor) va statik tavsiflari.", "Bipolyar tranzistorning h-parametrli ekvivalent sxemalari va fizik kattaliklari.", "Bipolyar tranzistorlarning şartli grafik ifodalanişi va tamğalanişi."] },
      { id: "M5", title: "Unipolyar (maydoniy) tranzistorlar (FET / MOSFET).", hours: 2, ref: "[2, 5]", topics: ["Boşqariluvçi p-n ötişli va izolyatsiyalangan zatvorli maydoniy tranzistorlar.", "Maydoniy tranzistorlarning ulaniş sxemalari va kiriş-çiqiş tavsiflari.", "MDP-tranzistorlar (örnatilgan va induksiyalangan kanalli).", "Maydoniy tranzistorlarning şartli grafik ifodalanişi va tamğalanişi."] },
      { id: "M6", title: "Tiristorlar.", hours: 2, ref: "[4]", topics: ["Tiristorlarning tö‘rt qatlamli (p-n-p-n) tuzilişi va işlaş tamoyillari.", "Klassifikatsiyasi: Dinistor, Tiristor (Trinistor), Simistor.", "Ulaniş sxemalari va statik volt-amper tavsifi.", "Elektron kalit rejimida işlaşi va boşqarilişi.", "Tiristorlarning şartli grafik ifodalanişi va tamğalanişi."] },
      { id: "M7", title: "Mikroelektronika komponentlari.", hours: 2, ref: "[2, 4]", topics: ["Elektron komponentlarni tayyorlaşda va qöllaşda integral tamoyil.", "Yarim ötkazgiçli integral mikrosxemalar (IMS).", "Bipolyar va MDP (CMOS) mikrosxemalar.", "Aralaş va gibrid integral sxemalar, mikrominiatyuralaştiriş."] },
      { id: "M8", title: "Kuçaytirgiçlar. Umumiy maʼlumotlar.", hours: 2, ref: "[1, 5]", topics: ["Elektron kuçaytirgiçlar tasnifi (kuçlaniş, tok, quvvat).", "Asosiy kattaliklari: kuçaytiriş koeffitsiyenti, kiriş/çiqiş qarşiligi, FIK.", "Bipolyar tranzistorlarda kuçaytirgiç kaskadlari.", "UE (Umumiy Emitter) kuçaytirgiç kaskadi va uning tahlili.", "Fazoinversli kaskad va uning qöllanilişi."] },
      { id: "M9", title: "Köp kaskadli kuçaytirgiçlar.", hours: 2, ref: "[1, 6]", topics: ["Kuçaytirgiçlarning amplituda-çastota (AÇT) va faza-çastota (FÇT) tavsiflari.", "Kaskadlararo boğlaniş turlari (RC, transformatorli, töğridan-töğri).", "Kuçaytirgiçning amplituda tavsifi va noçiziqli buzilişlar.", "Quvvat kuçaytirgiç kaskadi. Ikki taktli (push-pull) çiqiş kuçaytiriş kaskadi."] },
      { id: "M10", title: "Özgarmas tok kuçaytirgiçlari (ÖTK).", hours: 2, ref: "[4, 6]", topics: ["Özgarmas tok kuçaytirgiçlarining öziga xosligi va nol dreyfi muammosi.", "Differensial kuçaytirgiç kaskadi va sinfaz xalaqitlarni bostiriş.", "Operatsion kuçaytirgiç (Op-Amp) parametrlari va ideal Op-Amp qoidalari.", "Operatsion kuçaytirgiçning uzatiş koeffitsiyenti.", "Invertlovçi va invertlamovçi kuçaytirgiçlar, integrator va differensiator."] },
      { id: "M11", title: "Garmonik tebranişli generatorlar.", hours: 2, ref: "[1, 6]", topics: ["Avtogeneratorlarning özini-özi uyğotiş fazaviy va amplitudaviy şartlari.", "LC-avtogeneratorning uç nuqtali induktiv (Hartli) va siğim (Kolpits) sxemalari.", "RC-avtogeneratorlari (Vin köprigi, fazo siljituvçi zanjirlar).", "Kvarsli çastota stabilizatorlari va ularning aniqligi."] },
      { id: "M12", title: "Impulsli uskunalar.", hours: 2, ref: "[4, 7]", topics: ["Impulsli uskunalarning umumiy tavsiflari va signallarning kattaliklari.", "Töğri törtburçakli, arra simon va radioimpulslar.", "Impulslarning amplitudasi, davomiyligi, fronti, pasayişi va qaytariliş çastotasi.", "Elektron kalitlar rejimi. Differensiallovçi va integrallovçi RC zanjirlar."] },
      { id: "M13", title: "Multivibratorlar.", hours: 2, ref: "[3, 7]", topics: ["Multivibratorlarning işlaş tamoyili va klassik sxemalari.", "Tranzistorli nosimmetrik va simmetrik multivibrator sxemalari.", "Differensiallovçi zanjirli işga tuşiriş.", "Bir vibrator (kutuvçi multivibrator / Odnovibrator) va uning vaqt keçikiş sxemasi."] },
      { id: "M14", title: "Mantiqiy elementlar.", hours: 2, ref: "[2, 7]", topics: ["Mantiq algebrasi: VA (AND), YoKI (OR), INKOR (NOT) asosiy funksiyalari.", "Murakkab mantiqiy funksiyalar (NAND, NOR, XOR, XNOR).", "Mantiqiy funksiyalarning asosiy elektr kattaliklari: keçikiş vaqti, tarqaliş vaqti va çiqiş böyiça tarmoqlaniş koeffitsiyenti.", "Mantiqiy “0” va “1” kuçlaniş sathlari, şovqinbardoşlik.", "Sxemalarda grafik ifodalanişi (GOST va ANSI/IEEE standartlari)."] },
      { id: "M15", title: "Mikroprotsessor arxitekturasi.", hours: 2, ref: "[1, 7]", topics: ["MikroEHMlarning tipik blokli tuzilişi va işlaş sikli.", "Mikroprotsessor arxitekturasi va arifmetik-mantiqiy qurilma (ALU).", "Umumiy qöllanuvçi registrlar (GPR) va dastur hisoblagiçi (PC).", "Sistemali magistrallar: Maʼlumotlar şinasi (Data Bus), Manzilli şina (Address Bus), Boşqariş şinasi (Control Bus).", "Şinalarning konstruktiv qöllanilişi va şina multipleksirlash."] }
    ],
    practices: [
      { id: "A1", hours: 2, title: "Yarim ötkazgiçli diodning töğri va teskari toklarini hisoblaş.", desc: "Diodning töğri kuçlanişdagi töyiniş toki, töğri dinamik qarşiligi hamda teskari kuçlanişdagi sizib ötiş toklarini Shokli tenglamasi orqali hisoblaş." },
      { id: "A2", hours: 2, title: "Yarim ötkazgiçli diodning VAT hisoblaş va grafigini quriş.", desc: "Berilgan harorat va parametrlarga binoan hisoblangan qiymatlar jadvalini tuziş va koordinata törida töğri va teskari sohalar uçun VAT grafigini yasash." },
      { id: "A3", hours: 2, title: "Bipolyar tranzistorlarning kuçaytirgiç rejimida yuklamaga nisbatan parametrlarini hisoblaş hamda kiriş va çiqiş tavsiflarini quriş.", desc: "Umumiy emitter (UE) sxemasida yuklama töğri çizig‘ini quriş, işçi nuqtani (Q-point) aniqlaş va kiriş/çiqiş tavsiflarini tahlil qiliş." },
      { id: "A4", hours: 2, title: "Maydoniy tranzistorlarning kuçaytiriş rejimida yuklamaga nisbatan parametrlarini hisoblaş.", desc: "MOSFET tranzistorlarining uzatiş qiyaligi (S), içki qarşiligi (Ri) va kuçaytiriş koeffitsiyentini analitik hamda grafik usulda aniqlaş." },
      { id: "A5", hours: 2, title: "Bipolyar tranzistorning kalit rejimidagi parametrlarini hisoblaş.", desc: "BJT ning töyiniş (saturation) va uziliş (cutoff) sohalaridagi toklari, bazani töyintiriş koeffitsiyenti va kommutatsiya quvvat yöqotişlarini hisoblaş." },
      { id: "A6", hours: 2, title: "Unipolyar tranzistorning kalit rejimidagi parametrlarini hisoblaş.", desc: "Maydoniy tranzistorda kanal oçiq holatdagi qarşilik (RDS(on)), parazit siğimlar va kalitning ulaniş/uziliş dinamik vaqtlarini hisoblaş." },
      { id: "A7", hours: 2, title: "Bir va ikki yarim davrli töğrilagiçlarni hisoblaş.", desc: "Bir fazali bir yarim davrli va ikki yarim davrli (örta nuqtali) töğrilagiçlarning örtacha töğrilangan kuçlanişi, pulsatsiya koeffitsiyenti va diodlardagi teskari kuçlanişni hisoblaş." },
      { id: "A8", hours: 2, title: "Uç fazali umumiy nuqtali töğrilagiçlarni hisoblaş.", desc: "Uç fazali nolli sxemada faza kuçlanişlari, diodlar kommutatsiyasi, yuklamadagi pulsatsiya va transformator ikkilamçi çölg‘ami parametrlarini hisoblaş." },
      { id: "A9", hours: 2, title: "Uç fazali köprik sxemali töğrilagiçlarni hisoblaş (Larionov sxemasi).", desc: "Larionov köprik sxemasida töğrilangan kuçlaniş (Ud = 2.34 Uf), toklar, 6-pulsli pulsatsiya va diodlarni tanlaş hisob-kitoblarini bajariş." },
      { id: "A10", hours: 2, title: "Parametrik stabilizatorda stabilitronning parametrlarini aniqlaş va uning VAT quriş.", desc: "Kremniyli stabilitronning minimal va maksimal stabilizatsiya toklari, chegaralovçi ballast rezistori (Rb) qarşiligi va stabilizatsiya koeffitsiyentini hisoblaş." },
      { id: "A11", hours: 2, title: "Kuçaytirgiçlarning kuçlaniş, tok va quvvat böyiça kuçaytiriş koeffitsiyentini aniqlaş.", desc: "Köp kaskadli kuçaytirgiçlarning KU, KI va KP koeffitsiyentlarini çiziqli va logarifmik (desibel — dB) masshtablarda hisoblaş." },
      { id: "A12", hours: 2, title: "Özgarmas tok kuçaytirgiçi parametrlarini aniqlaş. Tavsiflarini quriş.", desc: "Differensial kaskadning sinfaz va differensial kuçaytiriş koeffitsiyentlarini hamda sinfaz xalaqitni bostiriş koeffitsiyentini (CMRR) hisoblaş." },
      { id: "A13", hours: 2, title: "“VA-INKOR” (NAND) elementlaridan foydalanib berilgan mantiqiy funksiyani hosil qiliş.", desc: "Ixtiyoriy mantiqiy ifodani De Morgan qonunlari yordamida faqat NAND (Şeffer ştrixi) bazisiga keltiriş va prinsipial funksional sxemasini çiziş." },
      { id: "A14", hours: 2, title: "“YoKI-INKOR” (NOR) elementlaridan foydalanib berilgan mantiqiy funksiyani hosil qiliş.", desc: "Mantiqiy funksiyani Pirs amali (NOR bazisi) orqali ifodalaş va minimal elementlar soni bilan sxemasini sintez qiliş." },
      { id: "A15", hours: 2, title: "“VA-YoKI-INKOR” (AOI) elementlaridan foydalanib berilgan mantiqiy funksiyani hosil qiliş.", desc: "Murakkab kombinatsion sxemalarni AOI (And-Or-Invert) mantiqiy bloklari asosida apparat tejamkor holda loyihalaş." }
    ],
    labs: [
      { id: "L1", hours: 2, title: "Yarim ötkazgiçli diodning tadqiqi va VAT quriş.", desc: "Töğri va teskari ulaniş sxemalarini yiğiş, voltmetr va milliampermetr yordamida ölçaşlarni bajariş, eksperimental VAT grafigini quriş va tösiq potensialini aniqlaş." },
      { id: "L2", hours: 2, title: "Bipolyar tranzistorning tadqiqi, kiriş va çiqiş tavsiflarini quriş.", desc: "Umumiy emitter (UE) sxemasida BJT tranzistorni tadqiq qiliş: bazaning turli özgarmas toklari (IB) uçun çiqiş oilasi IC = f(UCE) va kiriş IB = f(UBE) egri çiziqlarini eksperimental oliş va beta koeffitsiyentini aniqlaş." },
      { id: "L3", hours: 2, title: "Tiristorning tadqiqi va VAT quriş.", desc: "Tiristorning ötkazuvçanlik holatiga ötiş şartlarini örganiş, boşqariş elektrodiga berilgan impuls yordamida oçiliş kuçlanişini fiksatsiya qiliş, uşlab turuvçi tok (IH) qiymatini ölçaş." },
      { id: "L4", hours: 2, title: "UE sxemada ulangan bipolyar tranzistordagi kuçaytirgiçni örganiş va uning tadqiqi.", desc: "Kaskadning kirişiga generator orqali sinus signali beriş, çiqiş signali amplitudasini ossillografda kuzatiş, kuçlaniş böyiça kuçaytiriş koeffitsiyentini (KU) hisoblaş va 180° faza inversiyasini tekşiriş." },
      { id: "L5", hours: 2, title: "Bir yarim davrli töğrilagiç sxemasini örganiş va uning tadqiqi.", desc: "Bir yarim davrli töğrilagiç sxemasini yiğiş, yuklamadagi kuçlaniş şaklini ossillografda köriş, filtrlash kondensatori (C-filtr) ulanganda va ulanmagandagi pulsatsiyalar koeffitsiyentini solıştiriş." },
      { id: "L6", hours: 2, title: "Ikki yarim davrli töğrilagiç sxemasini örganiş va uning tadqiqi.", desc: "Diodli köprik (Grets sxemasi) töğrilagiçini yiğiş, çiqiş kuçlanişining tölqin şakli va çastotasini ölçaş, C va LC filtrlarning tebranişlarni tekislaş samaradorligini örganiş." }
    ],
    independentStudy: [
      { num: 1, hours: 24, title: "Yarim ötkazgiç asboblar fizikasi va zamonaviy materiallar", desc: "GaAs, SiC va GaN asosidagi yuqori çastotali va quvvatli yarim ötkazgiçlarning tahliliy şarhi.", control: "Konspekt, ilmiy referat" },
      { num: 2, hours: 24, title: "Tranzistorli kaskadlarni kompyuterda modellaştiriş", desc: "Bipolyar va maydoniy tranzistorli kuçaytirgiçlarning işçi nuqtasini haroratga termostabillaş usullarini hisoblaş.", control: "Hisob-çizma işi, SPICE fayllar" },
      { num: 3, hours: 24, title: "Operatsion kuçaytirgiçlar bazasidagi analog funksional tugunlar", desc: "Aktiv filtrlar (Battervort, Çebişev), komparatorlar, Şmitt triggerlari va analog köpaytiruvçi sxemalarni hisoblaş.", control: "Individual hisob-grafik topşiriq" },
      { num: 4, hours: 20, title: "Kombinatsion va ketma-ket mantiqiy qurilmalarni sintez qiliş", desc: "Multipleksorlar, hisoblagiçlar va siljiş registrlarini mantiqiy elementlarda loyihalaş va Karno kartalarida minimallaştiriş.", control: "Amaliy loyiha himoyasi" },
      { num: 5, hours: 16, title: "Mikroprotsessorli boşqariş tizimlari va zamonaviy xotira texnologiyalari", desc: "DDR5, HBM, NVMe xotira interfeyslari hamda mikrokontrollerlarning (ARM Cortex, RISC-V) apparat ta'minoti tahlili.", control: "Taqdimot (Slayd) va suhbat" }
    ],
    literature: [
      "1. Denmuxammadiyev A.M., Bokiyev A.A. 'Elektrotexnika va elektronika asoslari' darslik. 360 b. Toşkent, 2023.",
      "2. Nuraliyev A.K., Isakov A.J., Primov O.J. 'Elektronika va mikroprotsessor texnikasi'. TIQXMMI, 2020. - 143 b.",
      "3. Zeheng Wang, Jing-Kai Huang. 'Latest Advancements in Semiconductor Materials, Devices, and Systems'. MDPI, 2024.",
      "4. Shimeng Yu. 'Semiconductor Memory Devices and Circuits', USA, 2022. - 600 p.",
      "5. Ревич Ю.В. 'Занимательная электроника', СПб: BHV, 2019. - 672 с.",
      "6. Ямпурин Н.П. 'Электроника: Учебное пособие', Академия, 2019. - 320 с.",
      "7. Зиновьев Г.С. 'Силовая электроника', Юрайт, 2016. - 667 с.",
      "8. www.iitp.ru — Rossiya Fanlar Akademiyasi Axborot uzatish muammolari instituti (ИППИ РАН)",
      "9. www.iae.nsk.su — Rossiya Fanlar Akademiyasi Avtomatika va elektrometri instituti (ИАиЭ СО РАН)",
      "10. www.kunegin.narod.ru — Axborot va kommunikatsiya texnologiyalari portali",
      "11. www.rsl.ru — Rossiya Davlat Kutubxonasi ilmiy resurslari"
    ],
    evaluation: "Joriy nazorat (Laboratoriya & Amaliyot): 30 ball | Oraliq nazorat: 20 ball | Mustaqil taʼlim: 10 ball | Yakuniy imtihon: 40 ball"
  },
  discrete: {
    title: "Diskret tuzilmalar",
    code: "CS2104",
    semester: "3-Semestr (Kuzgi 2026)",
    hours: "180 Soat (Ma'ruza: 60, Amaliyot: 60, Mustaqil: 60)",
    credits: "6.0 ECTS Kredit",
    type: "Majburiy Fan",
    description: "Töplamlar, matematik mantiq, kombinatorika, graf nazariyasi va tarmoq topologiyalarini modellaştirişning nazariy poydevori.",
    topics: [
      "1-Hafta: Töplamlar nazariyasi, töplamlar ustida amallar va Eyler-Venn diagrammalari.",
      "2-Hafta: Binar munosabatlar, ekvivalentlik va qisman tartib munosabatlari.",
      "3-Hafta: Mulohazalar mantiqi, mantiqiy amallar va çinlik jadvallari.",
      "4-Hafta: Predikatlar hisobi va kvantorlar (∀, ∃).",
      "5-Hafta: Bul algebrasi, mantiqiy funksiyalar va KNDF/KNDF şakllari.",
      "6-Hafta: Mantiqiy funksiyalarni minimallaştiriş (Karno kartalari).",
      "7-Hafta: Kombinatorika qoidalari: örinlaştiriş, guruhlaş va örin almaştiriş.",
      "8-Hafta: Binar daraxtlar va graf nazariyasi asoslari (yöllar, sikllar, boğliqlik).",
      "9-Hafta: Graf algoritmlari: Deykstra, Kraskal va Prima algoritmlari (tarmoq marşrutlaş).",
      "10-Hafta: Tarmoq topologiyalarini (Yulduz, Halqa, Şina, Daraxt, Tör) graflar orqali modellaştiriş.",
      "11-Hafta: Rekurrent munosabatlar va algoritmlar murakkabligi (O-notatsiya).",
      "12-Hafta: Çekli avtomatlar va regulyar tillar."
    ],
    literature: [
      "Rosen K.H. 'Discrete Mathematics and Its Applications', 8th Edition.",
      "Cormen T.H. et al. 'Introduction to Algorithms' (CLRS), 3rd Edition."
    ],
    evaluation: "Amaliy maşğulotlar: 30 ball | Nazorat işi: 20 ball | Yakuniy imtihon: 50 ball"
  },
  networks: {
    title: "Kompyuter tarmoqlari",
    code: "NET2105",
    semester: "3-Semestr (Kuzgi 2026)",
    hours: "180 Soat (Ma'ruza: 60, Laboratoriya: 60, Mustaqil: 60)",
    credits: "6.0 ECTS Kredit",
    type: "Majburiy Fan",
    description: "Tarmoq arxitekturasi, OSI va TCP/IP modellari, Ethernet, IPv4/IPv6 subnetlaş, L2 kommutatsiya, VLAN va L3 dinamik marşrutlaş protokollarini (OSPF) çuqur amaliy örganiş.",
    topics: [
      "1-Hafta: Kompyuter tarmoqlari evolyutsiyasi, tarmoq topologiyalari va turlari (LAN, WAN, MAN).",
      "2-Hafta: OSI 7 qatlamli modeli va TCP/IP protokollar steki tahlili.",
      "3-Hafta: Jismoniy qatlam: Mis (Cat6A), Optik tola (SMF/MMF) va Simsiz uzatiş vositalari.",
      "4-Hafta: Kanal qatlami: Ethernet (802.3), MAC manzillaş va CSMA/CD mexanizmi.",
      "5-Hafta: Kommutatsiya: Switch işlaş tamoyili, MAC jadvali va STP (Spanning Tree Protocol).",
      "6-Hafta: Virtual LAN (VLAN): 802.1Q trunking va Inter-VLAN marşrutlaş (Router-on-a-Stick).",
      "7-Hafta: Tarmoq qatlami: IPv4 manzillaş, klasslar, xususiy/ommaviy IP manzillar.",
      "8-Hafta: Subnetting (kiçik tarmoqlarga ajratiş) va VLSM (Variable Length Subnet Mask).",
      "9-Hafta: IPv6 arxitekturasi: Dual-stack, SLAAC va EUI-64 formatlari.",
      "10-Hafta: Statik marşrutlaş va dinamik marşrutlaş protokollari (OSPFv2, OSPFv3).",
      "11-Hafta: Transport qatlami: TCP (3-way handshake, Flow Control) va UDP protokollari.",
      "12-Hafta: Amaliy qatlam xizmatlari: DNS, DHCP, HTTP/HTTPS, SSH va Wireshark bilan paket tahlili."
    ],
    literature: [
      "Tanenbaum A.S., Wetherall D. 'Computer Networks', 5th Edition.",
      "Cisco CCNA 200-301 Official Cert Guide Library (Wendell Odom).",
      "Kurose J., Ross K. 'Computer Networking: A Top-Down Approaç', 8th Edition."
    ],
    evaluation: "Laboratoriya & Simulyator: 30 ball | Oraliq test: 20 ball | Yakuniy imtihon: 50 ball"
  },
  kelajak: {
    title: "Kelajak soati",
    code: "KS2106",
    semester: "3-Semestr (Kuzgi 2026)",
    hours: "30 Soat (Seminarlar va amaliy muloqot)",
    credits: "0.0 Kredit",
    type: "Majburiy Fan",
    description: "Axborot texnologiyalari sohasidagi sönggi yutuqlar, xalqaro sertifikatlaş, kasbiy etika va talabalarning şaxsiy karyerasini şakllantiriş kursi.",
    topics: [
      "1-Hafta: Zamonaviy AKT bozori talablari va Network Engineer mutaxassisligi.",
      "2-Hafta: Xalqaro sertifikatlar (Cisco CCNA/CCNP, CompTIA Network+, LPIC Linux).",
      "3-Hafta: Rezyume (CV), LinkedIn profili va GitHub portfoliosini şakllantiriş.",
      "4-Hafta: Axborot xavfsizligi madaniyati va korxonalarda ma'lumotlar muhofazasi.",
      "5-Hafta: Startap loyihalar, ilmiy maqolalar yoziş va grantlar jalb qiliş.",
      "6-Hafta: Jamoaviy işlaş (Agile, Scrum) va soft-skills könikmalari."
    ],
    literature: [
      "Oliy ta'lim, fan va innovatsiyalar vazirligi uslubiy körsatmalari.",
      "Cisco Networking Academy karyera yöriqnomasi."
    ],
    evaluation: "Hisobot va taqdimot himoyasi asosida hisobga olinadi (Zaçyot)"
  },

  // ==================== 4-SEMESTR (BAHORGI 2027) ====================
  security: {
    title: "Kiberxavfsizlik asoslari",
    code: "SEC2201",
    semester: "4-Semestr (Bahorgi 2027)",
    hours: "180 Soat (Ma'ruza: 60, Laboratoriya: 60, Mustaqil: 60)",
    credits: "6.0 ECTS Kredit",
    type: "Majburiy Fan",
    description: "Kriptografiya, Next-Gen Firewall, zaifliklarni skanerlaş, tarmoq auditi va Zero Trust xavfsizlik arxitekturasi.",
    topics: [
      "1-Hafta: Kiberxavfsizlikka kiriş: CIA triadasi va xavfsizlik tahdidlari.",
      "2-Hafta: Kriptografiya asoslari: Simmetrik va asimmetrik şifrlaş.",
      "3-Hafta: Xeş funksiyalar (SHA-256) va raqamli elektron imzo (EDS).",
      "4-Hafta: Tarmoq xavfsizlik devorlari (Firewall, IPTables, Cisco ASA).",
      "5-Hafta: IDS/IPS tizimlari va Snort yordamida paketlarni tekşiriş.",
      "6-Hafta: Penetratsion testlaş asoslari va Kali Linux vositalari."
    ],
    literature: ["Stallings W. 'Cryptography and Network Security', 8th Edition."],
    evaluation: "Laboratoriya işlari: 30 ball | Oraliq: 20 ball | Yakuniy: 50 ball"
  },
  ai: {
    title: "Sun'iy intellekt asoslari",
    code: "AI2202",
    semester: "4-Semestr (Bahorgi 2027)",
    hours: "180 Soat (Ma'ruza: 60, Laboratoriya: 60, Mustaqil: 60)",
    credits: "6.0 ECTS Kredit",
    type: "Majburiy Fan",
    description: "Maşinali örganiş, neyron törlar, intellektual agentlar va ularni telekommunikatsiya tizimlariga tatbiq etiş.",
    topics: [
      "1-Hafta: Sun'iy intellekt tuşunçasi va intellektual agentlar.",
      "2-Hafta: Maşinali örganiş turlari: Supervised va Unsupervised learning.",
      "3-Hafta: Çiziqli va logistik regressiya modellari.",
      "4-Hafta: Sun'iy neyron törlari (Perceptron, Multilayer Perceptron).",
      "5-Hafta: Çuqur örganiş (Deep Learning) va kompyuter köriş asoslari.",
      "6-Hafta: Tarmoq trafigi anomaliyalarini AI yordamida aniqlaş."
    ],
    literature: ["Russell S., Norvig P. 'Artificial Intelligence: A Modern Approaç', 4th Edition."],
    evaluation: "Amaliy loyiha: 30 ball | Oraliq: 20 ball | Yakuniy: 50 ball"
  },
  probability: {
    title: "Ehtimollik va Statistika",
    code: "MATH2203",
    semester: "4-Semestr (Bahorgi 2027)",
    hours: "180 Soat (Ma'ruza: 60, Amaliyot: 60, Mustaqil: 60)",
    credits: "6.0 ECTS Kredit",
    type: "Majburiy Fan",
    description: "Ehtimollik nazariyasi, tasodifiy miqdorlar, taqsimot qonunlari, matematik statistika va tarmoq trafigini ehtimoliy modellaştiriş.",
    topics: [
      "1-Hafta: Ehtimollik fazosi, tasodifiy hodisalar va ehtimollikning klassik/geometrik ta'rifi.",
      "2-Hafta: Şartli ehtimollik, töla ehtimollik formulasi va Bayes formulasi.",
      "3-Hafta: Diskret tasodifiy miqdorlar: binomial, Puasson va geometrik taqsimotlar.",
      "4-Hafta: Uzluksiz tasodifiy miqdorlar: tekis, körsatkiçli va normal (Gauss) taqsimotlar.",
      "5-Hafta: Tasodifiy miqdorlarning sonli xarakteristikalari: matematik kutilma va dispersiya.",
      "6-Hafta: Katta sonlar qonuni va markaziy limit teorema.",
      "7-Hafta: Matematik statistika asoslari: tanlanma, gistogramma va empirik taqsimot.",
      "8-Hafta: Statistik gipotezalarni tekşiriş va tarmoq trafigi anomaliyalarini tahlil qiliş."
    ],
    literature: ["Şeldon Ross, 'A First Course in Probability', 10th Edition, Pearson."],
    evaluation: "Amaliy maşğulot: 30 ball | Oraliq nazorat: 20 ball | Yakuniy imtihon: 50 ball"
  },
  differential: {
    title: "Differensial tenglamalar",
    code: "MATH2204",
    semester: "4-Semestr (Bahorgi 2027)",
    hours: "180 Soat (Ma'ruza: 60, Amaliyot: 60, Mustaqil: 60)",
    credits: "6.0 ECTS Kredit",
    type: "Majburiy Fan",
    description: "Oddiy differensial tenglamalar, birinçi va yuqori tartibli tenglamalar, çiziqli differensial tenglamalar sistemalari va tebraniş konturlarini modellaştiriş.",
    topics: [
      "1-Hafta: Birinçi tartibli differensial tenglamalar: özgaruvçilari ajraladigan tenglamalar.",
      "2-Hafta: Bir jinsli va çiziqli birinçi tartibli differensial tenglamalar (Bernulli tenglamasi).",
      "3-Hafta: Töliq differensialli tenglamalar va integrallovçi köpaytuvçi.",
      "4-Hafta: Tartibi pasaytiriladigan yuqori tartibli differensial tenglamalar.",
      "5-Hafta: Özgarmas koeffitsiyentli çiziqli bir jinsli differensial tenglamalar.",
      "6-Hafta: Bir jinsli bölmagan çiziqli tenglamalar (Lagranj özgarmaslarni variatsiyalaş usuli).",
      "7-Hafta: Differensial tenglamalar sistemalari va turğunlik nazariyasi (Lyapunov).",
      "8-Hafta: Elektr zanjirlari va RLC konturlaridagi elektromagnit tebranişlar tenglamalari."
    ],
    literature: ["Dennis G. Zill, 'A First Course in Differential Equations', 11th Edition."],
    evaluation: "Amaliy hisob-grafik işi: 30 ball | Oraliq test: 20 ball | Yakuniy imtihon: 50 ball"
  },
  datascience: {
    title: "Data Science",
    code: "CS2205",
    semester: "4-Semestr (Bahorgi 2027)",
    hours: "180 Soat (Ma'ruza: 60, Laboratoriya: 60, Mustaqil: 60)",
    credits: "6.0 ECTS Kredit",
    type: "Majburiy Fan",
    description: "Katta hajmdagi ma'lumotlar tahlili, Python (NumPy, Pandas, Matplotlib, Scikit-Learn), ma'lumotlarni tozalaş, vizualizatsiya va tahliliy başoratlaş.",
    topics: [
      "1-Hafta: Data Science ga kiriş va Python ekotizimi (Jupyter Notebook, Google Colab).",
      "2-Hafta: NumPy kutubxonasi: köp ölçamli massivlar va vektorlaştirilgan hisoblaşlar.",
      "3-Hafta: Pandas kutubxonasi: Series va DataFrame obyektlari, ma'lumotlarni saralaş.",
      "4-Hafta: Data Cleaning: yetişmayotgan qiymatlar, anomaliyalar va ma'lumotlarni normalizatsiya qiliş.",
      "5-Hafta: Ma'lumotlar vizualizatsiyasi: Matplotlib, Seaborn va interaktiv grafiklar.",
      "6-Hafta: Exploratory Data Analysis (EDA): korrelyatsion tahlil va xususiyatlarni tanlaş.",
      "7-Hafta: Scikit-Learn bilan maşinali örganiş modellarini quriş va baholaş (MSE, R2).",
      "8-Hafta: Tarmoq telemetriyasi va katta hajmdagi log-fayllarni tahlil qiliş keysi."
    ],
    literature: ["Wes McKinney, 'Python for Data Analysis', 3rd Edition, ÖReilly."],
    evaluation: "Laboratoriya loyihasi: 30 ball | Oraliq: 20 ball | Yakuniy imtihon: 50 ball"
  },
  pedagogika: {
    title: "Kasbiy pedagogika",
    code: "PED2206",
    semester: "4-Semestr (Bahorgi 2027)",
    hours: "120 Soat (Ma'ruza: 40, Seminar: 40, Mustaqil: 40)",
    credits: "4.0 ECTS Kredit",
    type: "Majburiy Fan",
    description: "Muhandislik ta'limi metodikasi, pedagogik texnologiyalar, ta'lim standartlari, dars loyihalaş va AKT sohasida kadrlarni tayyorlaş usullari.",
    topics: [
      "1-Hafta: Kasbiy pedagogikaning predmeti, vazifalari va zamonaviy ta'lim paradigmasi.",
      "2-Hafta: Muhandislik ta'limida kompetensiyaviy yondaşuv va ECTS kredit-modul tizimi.",
      "3-Hafta: Zamonaviy pedagogik texnologiyalar: muammoli ta'lim, loyihaga asoslangan ta'lim (PBL).",
      "4-Hafta: Texnika fanlarida interaktiv ta'lim metodlari va simulyatorlardan foydalaniş.",
      "5-Hafta: Öquv maşğulotlarini loyihalaş (Sillabus, dars işlanmasi va taqdimotlar).",
      "6-Hafta: Talabalar bilimini baholaş mezonlari va testologiya asoslari."
    ],
    literature: ["Kasbiy pedagogika (Darslik), Oliy ta'lim vazirligi tavsiyasi, Toşkent."],
    evaluation: "Seminar & Taqdimot: 30 ball | Dars loyihasi: 20 ball | Yakuniy nazorat: 50 ball"
  }
};

function openSyllabusModal(id) {
  const modal = document.getElementById('syllabusModal');
  const tagEl = document.getElementById('sylTag');
  const titleEl = document.getElementById('sylTitle');
  const bodyEl = document.getElementById('sylBody');

  if (!modal || !bodyEl) return;

  const data = SYLLABUS_DATA[id] || SYLLABUS_DATA['algebra'];

  if (tagEl) tagEl.textContent = `${data.semester} • ${data.credits}`;
  if (titleEl) titleEl.textContent = `${data.title.toUpperCase()} (${data.code})`;

  // If detailed full program exists (Electronics)
  if (data.lectures && data.practices && data.labs) {
    let lecturesHtml = data.lectures.map(m => `
      <div style="background:var(--bg-surface-2); border:1px solid var(--line-base); border-radius:6px; padding:14px; margin-bottom:12px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
          <span style="font-weight:800; color:var(--brand-volt); font-family:var(--font-mono); font-size:13.5px;">${m.id} • ${m.hours} Soat</span>
          <span style="font-size:11.5px; color:var(--text-dim); background:rgba(255,255,255,0.06); padding:2px 8px; border-radius:4px;">Adabiyot: ${m.ref}</span>
        </div>
        <div style="font-weight:700; color:var(--text-white); font-size:14.5px; margin-bottom:8px;">${m.title}</div>
        <ul style="margin:0; padding-left:20px; color:var(--text-light); font-size:13px; line-height:1.6;">
          ${m.topics.map(t => `<li>${t}</li>`).join('')}
        </ul>
      </div>
    `).join('');

    let practicesHtml = data.practices.map(a => `
      <div style="background:var(--bg-surface-2); border:1px solid var(--line-base); border-radius:6px; padding:14px; margin-bottom:12px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
          <span style="font-weight:800; color:var(--brand-primary); font-family:var(--font-mono); font-size:13.5px;">${a.id} • ${a.hours} Soat</span>
          <span style="font-size:11.5px; color:var(--brand-primary); background:rgba(0,255,135,0.1); padding:2px 8px; border-radius:4px;">Amaliy hisoblaş</span>
        </div>
        <div style="font-weight:700; color:var(--text-white); font-size:14.5px; margin-bottom:6px;">${a.title}</div>
        <div style="color:var(--text-light); font-size:13px; line-height:1.5;">${a.desc}</div>
      </div>
    `).join('');

    let labsHtml = data.labs.map(l => `
      <div style="background:var(--bg-surface-2); border:1px solid var(--line-base); border-radius:6px; padding:14px; margin-bottom:12px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
          <span style="font-weight:800; color:#38BDF8; font-family:var(--font-mono); font-size:13.5px;">${l.id} • ${l.hours} Soat</span>
          <span style="font-size:11.5px; color:#38BDF8; background:rgba(56,189,248,0.12); padding:2px 8px; border-radius:4px;">Laboratoriya stend tadqiqi</span>
        </div>
        <div style="font-weight:700; color:var(--text-white); font-size:14.5px; margin-bottom:6px;">${l.title}</div>
        <div style="color:var(--text-light); font-size:13px; line-height:1.5;">${l.desc}</div>
      </div>
    `).join('');

    let indepHtml = (data.independentStudy || []).map(ind => `
      <div style="background:var(--bg-surface-2); border:1px solid var(--line-base); border-radius:6px; padding:14px; margin-bottom:12px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
          <span style="font-weight:800; color:var(--accent-gold); font-family:var(--font-mono); font-size:13.5px;">№${ind.num} • ${ind.hours} Soat</span>
          <span style="font-size:11.5px; color:var(--accent-gold); background:rgba(255,215,0,0.1); padding:2px 8px; border-radius:4px;">Nazorat: ${ind.control}</span>
        </div>
        <div style="font-weight:700; color:var(--text-white); font-size:14.5px; margin-bottom:6px;">${ind.title}</div>
        <div style="color:var(--text-light); font-size:13px; line-height:1.5;">${ind.desc}</div>
      </div>
    `).join('');

    let litHtml = (data.literature || []).map(l => `<li style="color:var(--text-light); font-size:13px; margin-bottom:8px; line-height:1.6;">${l}</li>`).join('');

    bodyEl.innerHTML = `
      <!-- 1. Pasport & Soatlar Taqsimoti -->
      <div style="background:var(--bg-surface-2); padding:18px 22px; border:1px solid var(--line-base); border-radius:6px; margin-bottom:24px;">
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:14px; font-size:13px;">
          <div><span style="color:var(--text-dim);">Fan Kodi:</span> <b style="color:var(--brand-volt);">${data.code}</b></div>
          <div><span style="color:var(--text-dim);">Fan Turi:</span> <b style="color:var(--brand-primary);">${data.type}</b></div>
          <div><span style="color:var(--text-dim);">Kredit Miqdori:</span> <b style="color:var(--accent-gold);">${data.credits}</b></div>
          <div><span style="color:var(--text-dim);">Jami Yuklama:</span> <b style="color:var(--text-white); font-size:15px;">180 Soat</b></div>
        </div>
        <div style="margin-top:14px; padding-top:14px; border-top:1px dashed var(--line-base); display:flex; flex-wrap:wrap; gap:16px; font-size:13px; color:var(--text-light);">
          <span>Auditoriya: <b style="color:var(--brand-volt);">72 soat</b></span>
          <span>• Maʼruza: <b style="color:var(--text-white);">30 soat</b></span>
          <span>• Amaliyot: <b style="color:var(--text-white);">30 soat</b></span>
          <span>• Laboratoriya: <b style="color:var(--text-white);">12 soat</b></span>
          <span style="margin-left:auto;">Mustaqil taʼlim: <b style="color:var(--accent-gold);">108 soat</b></span>
        </div>
      </div>

      <!-- 2. Fanning Maqsadi va Vazifalari -->
      <div style="background:var(--bg-surface); border:1px solid var(--line-base); border-radius:6px; padding:18px; margin-bottom:24px;">
        <h4 style="color:var(--brand-volt); font-size:16px; margin-bottom:10px; text-transform:uppercase;">1. Fanning Maqsadi va Vazifalari</h4>
        <p style="color:var(--text-light); font-size:13.5px; line-height:1.6; margin-bottom:10px;"><b>Fanning maqsadi:</b> ${data.maqsadi}</p>
        <p style="color:var(--text-dim); font-size:13.5px; line-height:1.6; margin:0;"><b>Fanning vazifalari:</b> ${data.vazifalari}</p>
      </div>

      <!-- 3. Ma'ruza Mashg'ulotlari (30 soat) -->
      <div style="margin-bottom:28px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; border-bottom:2px solid var(--brand-volt); padding-bottom:8px;">
          <h4 style="color:var(--brand-volt); font-size:17px; text-transform:uppercase; margin:0;">2. Maʼruza Maşğulotlari (Jami: 30 soat • 15 ta mavzu)</h4>
          <span style="font-size:13px; font-weight:700; color:var(--brand-volt);">15 x 2 = 30 Soat</span>
        </div>
        ${lecturesHtml}
      </div>

      <!-- 4. Amaliy Mashg'ulotlar (30 soat) -->
      <div style="margin-bottom:28px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; border-bottom:2px solid var(--brand-primary); padding-bottom:8px;">
          <h4 style="color:var(--brand-primary); font-size:17px; text-transform:uppercase; margin:0;">3. Amaliy Maşğulotlar (Jami: 30 soat • 15 ta maşğulot)</h4>
          <span style="font-size:13px; font-weight:700; color:var(--brand-primary);">15 x 2 = 30 Soat</span>
        </div>
        ${practicesHtml}
      </div>

      <!-- 5. Laboratoriya Mashg'ulotlari (12 soat) -->
      <div style="margin-bottom:28px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; border-bottom:2px solid #38BDF8; padding-bottom:8px;">
          <h4 style="color:#38BDF8; font-size:17px; text-transform:uppercase; margin:0;">4. Laboratoriya Maşğulotlari (Jami: 12 soat • 6 ta iş)</h4>
          <span style="font-size:13px; font-weight:700; color:#38BDF8;">6 x 2 = 12 Soat</span>
        </div>
        ${labsHtml}
      </div>

      <!-- 6. Mustaqil Ta'lim (108 soat) -->
      <div style="margin-bottom:28px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; border-bottom:2px solid var(--accent-gold); padding-bottom:8px;">
          <h4 style="color:var(--accent-gold); font-size:17px; text-transform:uppercase; margin:0;">5. Mustaqil Taʼlim Rejasi (Jami: 108 soat)</h4>
          <span style="font-size:13px; font-weight:700; color:var(--accent-gold);">108 Soat</span>
        </div>
        ${indepHtml}
      </div>

      <!-- 7. Baholash Mezonlari & Adabiyotlar -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:18px; margin-bottom:24px;">
        <div style="background:var(--bg-surface-2); border:1px solid var(--line-base); border-radius:6px; padding:18px;">
          <h4 style="color:var(--text-white); font-size:15px; margin-bottom:10px; text-transform:uppercase;">6. Baholaş Mezonlari (100 ball)</h4>
          <p style="color:var(--text-light); font-size:13px; line-height:1.6; margin:0;">${data.evaluation}</p>
        </div>
        <div style="background:var(--bg-surface-2); border:1px solid var(--line-base); border-radius:6px; padding:18px;">
          <h4 style="color:var(--text-white); font-size:15px; margin-bottom:10px; text-transform:uppercase;">7. Foydalanilgan Adabiyotlar</h4>
          <ol style="padding-left:20px; margin:0;">
            ${litHtml}
          </ol>
        </div>
      </div>

      <div style="margin-top:24px; padding-top:16px; border-top:1px solid var(--line-base); display:flex; justify-content:flex-end;">
        <button class="btn-arsenal-secondary" onclick="closeSyllabusModal()" style="font-size:13px; padding:10px 24px; cursor:pointer; font-weight:700;">✕ Yopiş</button>
      </div>
    `;
  } else {
    // Fallback for simple subjects (ZERO print/download buttons)
    let topicsHtml = data.topics.map(t => `<li style="padding:6px 0; color:var(--text-light); font-size:13px; border-bottom:1px dashed var(--line-base); display:flex; align-items:flex-start; gap:8px;"><span style="color:var(--brand-primary); font-weight:bold;">▸</span><span>${t}</span></li>`).join('');
    let litHtml = (data.literature || []).map(l => `<li style="color:var(--text-dim); font-size:12.5px; margin-bottom:4px;">${l}</li>`).join('');

    bodyEl.innerHTML = `
      <div style="background:var(--bg-surface-2); padding:16px; border:1px solid var(--line-base); border-radius:4px; margin-bottom:20px;">
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:12px; font-size:12.5px;">
          <div><span style="color:var(--text-dim);">Fan Kodi:</span> <b style="color:var(--brand-volt);">${data.code}</b></div>
          <div><span style="color:var(--text-dim);">Fan Turi:</span> <b style="color:var(--brand-primary);">${data.type}</b></div>
          <div><span style="color:var(--text-dim);">Umumiy Yuklama:</span> <b style="color:var(--text-white);">${data.hours}</b></div>
          <div><span style="color:var(--text-dim);">Kredit:</span> <b style="color:var(--accent-gold);">${data.credits}</b></div>
        </div>
        <p style="margin-top:12px; font-size:13px; color:var(--text-dim); line-height:1.5;">${data.description}</p>
      </div>

      <h4 style="color:var(--brand-primary); font-family:var(--font-editorial); font-size:16px; margin-bottom:10px; text-transform:uppercase;">
        📅 Haftalik Mavzular Rejasi
      </h4>
      <ul style="list-style:none; margin-bottom:24px; padding-left:0;">
        ${topicsHtml}
      </ul>

      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:16px;">
        <div style="background:var(--bg-surface); border:1px solid var(--line-base); padding:14px; border-radius:4px;">
          <h5 style="color:var(--text-white); font-size:13px; margin-bottom:8px; text-transform:uppercase;">📚 Asosiy Adabiyotlar</h5>
          <ul style="padding-left:16px; margin:0;">${litHtml}</ul>
        </div>
        <div style="background:var(--bg-surface); border:1px solid var(--line-base); padding:14px; border-radius:4px;">
          <h5 style="color:var(--text-white); font-size:13px; margin-bottom:8px; text-transform:uppercase;">🎯 Baholaş Mezonlari</h5>
          <p style="font-size:12.5px; color:var(--text-dim); line-height:1.5; margin:0;">${data.evaluation || 'Joriy nazorat: 30 ball | Oraliq: 20 ball | Yakuniy: 50 ball'}</p>
        </div>
      </div>

      <div style="margin-top:20px; display:flex; justify-content:flex-end;">
        <button class="btn-arsenal-secondary" onclick="closeSyllabusModal()" style="font-size:13px; padding:8px 20px; cursor:pointer; font-weight:700;">✕ Yopiş</button>
      </div>
    `;
  }

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeSyllabusModal() {
  const modal = document.getElementById('syllabusModal');
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
}

window.openSyllabusModal = openSyllabusModal;
window.closeSyllabusModal = closeSyllabusModal;

function initSyllabusModal() {
  const modal = document.getElementById('syllabusModal');
  const closeBtn = document.getElementById('syllabusModalClose');

  if (closeBtn) closeBtn.addEventListener('click', closeSyllabusModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeSyllabusModal();
    });
  }
}

/* ==========================================================================
   13. FOTO LIGHTBOX MODALI
   ========================================================================== */
function openPhotoLightbox(src, caption) {
  const modal = document.getElementById('photoLightboxModal');
  const img = document.getElementById('lightboxImg');
  const cap = document.getElementById('lightboxCaption');
  if (!modal || !img) return;

  img.src = src;
  if (cap) cap.textContent = caption || 'ATT-25 Laboratoriya Galereyasi';
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closePhotoLightbox() {
  const modal = document.getElementById('photoLightboxModal');
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
}

window.openPhotoLightbox = openPhotoLightbox;
window.closePhotoLightbox = closePhotoLightbox;

function initPhotoLightbox() {
  const modal = document.getElementById('photoLightboxModal');
  const closeBtn = document.getElementById('photoLightboxClose');

  if (closeBtn) closeBtn.addEventListener('click', closePhotoLightbox);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closePhotoLightbox();
    });
  }
}


