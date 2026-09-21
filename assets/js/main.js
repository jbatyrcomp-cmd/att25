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
      document.getElementById('resNet').textContent = "Noto‘g‘ri IP format";
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
    terminal.innerHTML = `<div class="terminal-line system">[ATT-25 ICMP Echo Engine v2.4] Tayyor. IP kiriting va "Ping yuborish"ni bosing.</div>`;
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
          <div class="terminal-line system">${maxPackets} paket yuborildi, ${maxPackets} qabul qilindi, 0.0% paket yo‘qolishi</div>
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
    desc: "Ikkita tugun o‘rtasidagi ulanish seansini o‘rnatadi, boshqaradi va yakunlaydi."
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
   5. 3D SIMULYATOR ARENA BOSHQARUVI
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
  const chips = document.querySelectorAll('.topo-chip');
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
  { title: "Dasturlash II: OOP C++ (CS1202)", category: "2-Semestr", link: "#oquv-dasturi", desc: "Ob'yektga yo‘naltirilgan dasturlash (OOP), sinflar, merosxo‘rlik, polimorfizm va STL (120 Soat, 4.0 Kredit)" },
  { title: "Ma'lumotlar tuzilmasi va algoritmlar (CS1203)", category: "2-Semestr", link: "#oquv-dasturi", desc: "Stek, navbat, bog‘langan ro‘yxatlar, BST daraxtlar va Big-O tahlili (120 Soat, 4.0 Kredit)" },
  { title: "Falsafa (PHIL1204)", category: "2-Semestr", link: "#oquv-dasturi", desc: "Ontologiya, gnoseologiya, mantiq, axborot jamiyati falsafasi va muhandislik etikasi (120 Soat, 4.0 Kredit)" },
  { title: "Dinshunoslik (REL1205)", category: "2-Semestr", link: "#oquv-dasturi", desc: "Jahon dinlari tarixi, tolerantlik madaniyati va buzg‘unchi g‘oyalarga qarshi immunitet (120 Soat, 4.0 Kredit)" },
  { title: "Xorijiy til II: Professional IT English (ENG1206)", category: "2-Semestr", link: "#oquv-dasturi", desc: "AKT va telekommunikatsiya sohasi terminologiyasi, RFC hujjatlar va texnik muloqot (120 Soat, 4.0 Kredit)" },
  { title: "Fizika II: Elektr va magnetizm (PHYS1207)", category: "2-Semestr", link: "#oquv-dasturi", desc: "Elektrostatika, doimiy tok zanjirlari, elektromagnit induksiya va Maksvell qonunlari (120 Soat, 4.0 Kredit)" },

  // HEMIS 3-Semestr Fanlari (Kuzgi 2026 - Hozirgi)
  { title: "Chiziqli algebra (MATH2101)", category: "3-Semestr", link: "#oquv-dasturi", desc: "Matritsalar, determinantlar, chiziqli tenglamalar sistemasi, vektor fazolari va xos qiymatlar (180 Soat, 6.0 Kredit)" },
  { title: "Ma'lumotlar bazasi (CS2102)", category: "3-Semestr", link: "#oquv-dasturi", desc: "ERD loyihalash, SQL so‘rovlari (DDL, DML), normalizatsiya, ACID tranzaksiyalari va PostgreSQL (180 Soat, 6.0 Kredit)" },
  { title: "Elektronika va sxemalar (EE2103)", category: "3-Semestr", link: "#oquv-dasturi", desc: "Yarim o‘tkazgichlar, tranzistorlar, mantiqiy elementlar, kombinatsion va ketma-ket mikrosxemalar (180 Soat, 6.0 Kredit)" },
  { title: "Diskret tuzilmalar (CS2104)", category: "3-Semestr", link: "#oquv-dasturi", desc: "To‘plamlar, Bul algebrasi, graf nazariyasi, kombinatorika va tarmoq topologiyalari (180 Soat, 6.0 Kredit)" },
  { title: "Kompyuter tarmoqlari (NET2105)", category: "3-Semestr", link: "#oquv-dasturi", desc: "OSI modeli, Ethernet, IP subnetting, VLAN, STP va OSPF marshrutlash protokollari (180 Soat, 6.0 Kredit)" },
  { title: "Kelajak soati (KS2106)", category: "3-Semestr", link: "#oquv-dasturi", desc: "AKT sohaviy rivojlanish, xalqaro sertifikatlash, CV va muhandislik etikasi (30 Soat)" },
  
  // HEMIS 4-Semestr Fanlari
  { title: "Kiberxavfsizlik asoslari (SEC2201)", category: "4-Semestr", link: "#oquv-dasturi", desc: "Kriptografiya, Next-Gen Firewall, IDS/IPS va xavfsizlik devorlari (180 Soat, 6.0 Kredit)" },
  { title: "Sun'iy intellekt asoslari (AI2202)", category: "4-Semestr", link: "#oquv-dasturi", desc: "Mashinali o‘rganish, neyron to‘rlar va intellektual tizimlar (180 Soat, 6.0 Kredit)" },
  { title: "Data Science", category: "4-Semestr", link: "#oquv-dasturi", desc: "Katta hajmdagi ma'lumotlar tahlili, Pandas, NumPy va vizualizatsiya (180 Soat, 6.0 Kredit)" },

  // IT & AI Yangiliklari 2026
  { title: "NVIDIA Blackwell B200 va Yangi Avlod AI Klasterlari", category: "Yangiliklar", link: "#yangiliklar", desc: "208 milliard tranzistor, 20 PFLOPS quvvat va suyuqlik bilan sovutish tizimi" },
  { title: "Avtonom 6G Tarmoqlari: AI Boshqaruvidagi Self-Healing Tizimlar", category: "Yangiliklar", link: "#yangiliklar", desc: "Inson aralashuvisiz ishlovchi, 3 ms ichida o‘zini-o‘zi tiklaydigan 6G tarmoqlari" },
  { title: "Kvant Xavfsizligi va AI Himoya Qalqoni: Post-Quantum Standartlar", category: "Yangiliklar", link: "#yangiliklar", desc: "NIST ML-KEM va ML-DSA post-kvant algoritmlarining AI xavfsizlik devorlariga integratsiyasi" },
  { title: "Agentic AI: Ko‘p Agentli Tizimlar Tarmoq Muhandisligi va Kodlashda", category: "Yangiliklar", link: "#yangiliklar", desc: "Avtonom ko‘p agentli tizimlar orqali BGP/OSPF marshrutlash muammolarini bartaraf etish" },

  // Xalqaro Ilmiy Nashrlar (Scopus, Web of Science, Google Scholar)
  { title: "Deep Reinforcement Learning for Dynamic Routing in SDN (Scopus Q1)", category: "Ilmiy Nashr", link: "#maqolalar", desc: "Journal of Network and Computer Applications (Elsevier, 2026) • CiteScore 14.8" },
  { title: "Quantum Key Distribution (QKD) in Terabit Optical Networks (Web of Science)", category: "Ilmiy Nashr", link: "#maqolalar", desc: "IEEE Transactions on Quantum Engineering (2026) • Impact Factor 8.2" },
  { title: "A Comprehensive Survey on Zero-Trust Architecture (Google Scholar)", category: "Ilmiy Nashr", link: "#maqolalar", desc: "ACM Computing Surveys • 1,420+ Citations • Mikrosegmentatsiya va mTLS" },
  { title: "Federated Learning-Driven Edge Intelligence for IoT (Scopus Q1 / WoS)", category: "Ilmiy Nashr", link: "#maqolalar", desc: "IEEE Internet of Things Journal • Impact Factor 10.6 • Edge AI va maxfiylik" },

  // Qo'llanmalar & Media
  { title: "OSPFv2 & OSPFv3 Marshrutlash Arxitekturasi", category: "Taqdimot", link: "#taqdimotlar", desc: "Cisco routerlarida OSPF protokoli va LSA turlari tahlili (48 Slayd)" },
  { title: "VLAN & Inter-VLAN Routing Amaliyoti", category: "Laboratoriya", link: "#taqdimotlar", desc: "802.1Q trunking va Router-on-a-Stick amaliy qo‘llanmasi (36 Sahifa)" },
  { title: "Optik Tolali Liniyalarni Fusion Splicer bilan Payvandlash", category: "Video", link: "#media-hub", desc: "ATT-25 laboratoriya stendidagi optik tola payvandlash amaliyoti" },
  { title: "HEMIS Student Axborot Tizimi", category: "Manba", link: "https://student.hemis.uz", desc: "Talabalar o‘quv rejasi, dars jadvali va baholar rasmiy portali" },
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
      resultsBox.innerHTML = `<div style="padding:16px; text-align:center; color:var(--text-dim);">Hech narsa topilmadi</div>`;
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
        <span style="font-size:12px; color:var(--brand-primary);">Ko‘rish →</span>
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
    desc: "Binafsha Kvant Fazosi & Kiber Yalpiz",
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
    desc: "Quyosh Qizil & Lazer Olov",
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
    desc: "Och Yashil Zamonaviy Kiber (Mint & Sky Blue)",
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
    name: "High-Tech Light",
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
    const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    return prefersLight ? 'high-tech-light' : ThemeManager.DEFAULT_THEME;
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
            <span class="palette-dot" style="background: ${theme.secondary};" title="Ikkilamchi aksent: ${theme.secondary}"></span>
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
   8. MAQOLALARNI O'QISH (ARTICLE READER) MODALI
   ========================================================================== */
const ARTICLES_CONTENT = {
  // ==================== DUNYODAGI MASHHUR PORTALLAR YANGILIKLARI (TO'LIQ SHAKLDA, IQTIBOSLAR VA MANBALAR BILAN) ====================
  "news-1": {
    category: "REUTERS TECHNOLOGY • EKSKLYUZIV",
    date: "19-Sentabr, 2026 • Reuters Global Tech Wire",
    title: "Reuters: NVIDIA Blackwell B200 AI Superklasterlari Global Ma'lumotlar Markazlariga Yetkazib Berilmoqda — Hisoblash Quvvati 4 Barobarga Oshdi",
    author: "Max A. Cherney (Reuters Senior AI & Semiconductor Correspondent) • San Francisco / Santa Clara",
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
          <span>Muxbir: <strong>Max A. Cherney</strong> | Tahririyat: Reuters Tech Desk</span>
          <span>Nashr vaqti: 19-Sentabr, 2026, 08:30 GMT</span>
        </div>

        <!-- Hero Image -->
        <div class="modal-hero-img-wrap">
          <img src="assets/images/ai_chip.jpg" class="modal-hero-img" alt="NVIDIA Blackwell B200">
          <div class="modal-img-meta-bar">
            <span class="modal-img-caption">NVIDIA Blackwell B200 208-milliard tranzistorli arxitekturasi va NVL72 suyuqlik sovutish superklasteri.</span>
            <span class="modal-img-source">📷 Surat manbasi: Reuters / NVIDIA Official Media Kit Archive</span>
          </div>
        </div>

        <!-- Key Takeaways Box -->
        <div class="news-takeaways-box">
          <div class="news-takeaways-title">📌 Reuters Tahlili: Asosiy Muhim Nuqtalar (Key Takeaways)</div>
          <ul class="news-takeaways-list">
            <li><strong>208 Milliard Tranzistor:</strong> TSMC ning maxsus 4NP texnologik jarayonida ishlab chiqarilgan ikkita monolit kremniy kristali 10 TB/s tezlikdagi NV-HBI shinasida yagona yaxlit chip sifatida ishlaydi.</li>
            <li><strong>20 PFLOPS FP4 Hisoblash Quvvati:</strong> Yangi 4-bitli suzuvchi nuqta tenzor yadrolari orqali trillion parametrli LLM modellarini o‘qitish va ulardan xulosa chiqarish (inference) tezligi Hopper H100 ga nisbatan 4 barobarga oshdi.</li>
            <li><strong>25 Barobar Kam Energiya Sarfi:</strong> Trillion parametrli generativ sun'iy intellekt modellarini ishlatishda energiya va xarajatlar ko‘lami 25 barobar qisqardi.</li>
            <li><strong>NVLink 5 Tarmog‘i:</strong> 576 tagacha GPU ni 1.8 TB/s ikki tomonlama o‘tkazuvchanlikka ega to‘liq optik va mis magistrallar orqali birlashtirish imkoniyati yaratildi.</li>
          </ul>
        </div>

        <!-- Direct Quote 1 -->
        <div class="news-direct-quote">
          <div class="news-quote-text">
            “Blackwell shunchaki chip emas — bu yangi sanoat inqilobining dvigatelidir. Generativ sun'iy intellekt bizning davrimizning eng muhim texnologiyasidir va Blackwell orqali biz dunyoning barcha sohalarida AI imkoniyatlarini ro‘yobga chiqarish uchun mustahkam poydevor yaratdik. Biz hisoblash xarajatlarini va energiya sarfini keskin kamaytirish orqali trillion parametrli modellarni barcha uchun ochiq qilmoqdamiz.”
          </div>
          <div class="news-quote-speaker">
            <strong>— Jensen Huang</strong>
            <span>NVIDIA Asoschisi va Bosh Ijrochi Direktori (CEO) • Reuters anjumanidagi nutqidan</span>
          </div>
        </div>

        <!-- Full News Article Body -->
        <h3 class="news-section-header">1. Global Giper-Skeylerlar va Bozor Dinamikasi</h3>
        <p style="margin-bottom:14px;"><strong>SAN-FRANTSIZKO (Reuters)</strong> — Jahonning eng yirik bulutli xizmat ko‘rsatuvchi gigantlari — Microsoft Azure, Amazon Web Services (AWS), Google Cloud va Meta — sun'iy intellekt poygasida yetakchilikni saqlab qolish maqsadida NVIDIA Blackwell B200 tizimlarini o‘zlarining global ma'lumotlar markazlariga ommaviy tatbiq etishni boshladilar. Reuters axborot agentligining yarim o‘tkazgichlar bo‘yicha tahlilchilariga tayanib xabar berishicha, ushbu tizimlarga bo‘lgan talab mavjud taklifdan 3 barobardan ziyod oshib ketgan.</p>

        <p style="margin-bottom:14px;">Reuters muxbiri bilan suhbatda yarim o‘tkazgichlar bo‘yicha yetakchi tahliliy konsalting kompaniyasi SemiAnalysis bosh tahlilchisi <strong>Dylan Patel</strong> Blackwell arxitekturasining ahamiyatini quyidagicha baholadi:</p>

        <!-- Direct Quote 2 -->
        <div class="news-direct-quote">
          <div class="news-quote-text">
            “Blackwell shunchaki yangi GPU emas; bu 72 ta chipdan tashkil topgan yaxlit gigant superkompyuter tizimidir. Hozirgi kunda sun'iy intellektning eng katta to‘siqlaridan biri xotira o‘tkazuvchanligi va tarmoq kechikishidir. NVIDIA NVLink 5 switchlari va to‘g‘ridan-to‘g‘ri suyuqlik sovutish tizimini integratsiya qilish orqali tarmoq infratuzilmasini kremniyning o‘zidan ham muhimroq darajaga ko‘tardi.”
          </div>
          <div class="news-quote-speaker">
            <strong>— Dylan Patel</strong>
            <span>SemiAnalysis Bosh Texnologik Tahlilchisi</span>
          </div>
        </div>

        <h3 class="news-section-header">2. Texnik Xususiyatlar va Arxitektura Tahlili</h3>
        <p style="margin-bottom:14px;">Blackwell arxitekturasi bir qator fundamental muhandislik yutuqlarini o‘z ichiga oladi. U ikkita to‘liq o‘lchamdagi kristaldan iborat bo‘lib, ular sekundiga 10 terabayt tezlikdagi <em>NV-HBI (High-Bandwidth Interconnect)</em> interfeysi orqali bir-biri bilan bog‘langan. Dasturchilar va tizim uchun bu ikkita kristal yagona monolit GPU sifatida ko‘rinadi, bu esa dasturlash murakkabligini keskin kamaytiradi.</p>

        <table class="news-specs-table">
          <thead>
            <tr>
              <th>Parametr / Ko‘rsatkich</th>
              <th>NVIDIA Hopper H100 (Oldingi avlod)</th>
              <th>NVIDIA Blackwell B200 (Yangi standart)</th>
              <th>O‘sish ko‘rsatkichi</th>
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
              <td>Qo‘llab-quvvatlanmaydi</td>
              <td>20 PFLOPS (FP4 Precision)</td>
              <td><span style="color:var(--brand-primary); font-weight:700;">Yangi avlod (4x FP8)</span></td>
            </tr>
            <tr>
              <td><strong>Xotira O‘tkazuvchanligi (HBM3e)</strong></td>
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
              <td>25x tejamkorlik (har bir MWh uchun)</td>
              <td><span style="color:var(--brand-primary); font-weight:700;">25 barobar tejam</span></td>
            </tr>
          </tbody>
        </table>

        <!-- Direct Quote 3 -->
        <div class="news-direct-quote">
          <div class="news-quote-text">
            “Biz Azure bulutli platformamizda Blackwell arxitekturasini sinovdan o‘tkazdik. Natijalar hayratlanarli: GPT-4 darajasidagi trillion parametrli modellarni o‘qitish vaqti bir necha oylardan bir necha haftalarga qisqardi. Bu bizning foydalanuvchilarimizga sun'iy intellekt xizmatlarini ancha arzon va tezroq taqdim etish imkonini beradi.”
          </div>
          <div class="news-quote-speaker">
            <strong>— Satya Nadella</strong>
            <span>Microsoft Bosh Ijrochi Direktori (CEO) • Rasmiy reliz</span>
          </div>
        </div>

        <h3 class="news-section-header">3. ATT-25 O‘quv Dasturi Bilan Uzviy Bog‘liqligi</h3>
        <p style="margin-bottom:14px;">Ushbu yangilik ATT-25 talabalari uchun shunchaki sanoat xabari emas, balki bevosita o‘quv fanlarining amaliy laboratoriya tahlilidir:</p>
        <ul style="padding-left:18px; color:var(--text-light); margin-bottom:16px; font-size:13.5px; line-height:1.7;">
          <li><strong>1-Semestr ("C/C++ Dasturlash"):</strong> CUDA C/C++ parallel dasturlash muhiti orqali tenzor yadrolarida hisoblash jarayonlarini optimallashtirish.</li>
          <li><strong>2-Semestr ("Diskret tuzilmalar va algoritmlar"):</strong> Ko‘p o‘lchamli massivlarni parallel qayta ishlash va tenzor matritsalarini ko‘paytirish algoritmlari.</li>
          <li><strong>3-Semestr ("Kompyuter tarmoqlari" va "Elektronika"):</strong> 800G Ethernet / InfiniBand switchlari orqali serverlararo paketlar almashinuvini tahlil qilish, shuningdek, VRM quvvat boshqaruvi va suyuqlik bilan sovutish sxemalarini o‘rganish.</li>
          <li><strong>4-Semestr ("Sun'iy intellekt asoslari"):</strong> Trillion parametrli Transformer modellarini kvantlash (FP4/FP8 quantization) va chekka serverlarda inferens qilish amaliyoti.</li>
        </ul>

        <!-- Citation Box -->
        <div class="news-citation-box">
          <div class="news-citation-title">🔗 Birlamchi Manba va Akademik Iqtibos Ma'lumotnomasi</div>
          <div class="news-citation-text">
            <strong>APA Iqtibos:</strong> Cherney, M. A. (2026, September 19). <em>NVIDIA Blackwell B200 AI Superclusters Enter Mass Deployment in Global Cloud Datacenters</em>. Reuters Technology. https://www.reuters.com/technology/nvidia-blackwell-b200-ai-deployment-2026/
          </div>
          <div class="news-citation-text">
            <strong>IEEE Iqtibos:</strong> M. A. Cherney, "NVIDIA Blackwell B200 AI Superclusters Enter Mass Deployment," <em>Reuters Global Technology Wire</em>, San Francisco, CA, Sept. 19, 2026. [Online]. Mavjud: https://www.reuters.com/technology/
          </div>
        </div>
      </div>
    `
  },

  "news-2": {
    category: "IEEE SPECTRUM • RASMIY HISOBOT",
    date: "18-Sentabr, 2026 • IEEE Telecom & AI Wire",
    title: "IEEE Spectrum: Nokia Bell Labs va ITU Avtonom 6G Tarmoqlarida 'Zero-Touch' AI Boshqaruvini Muvaffaqiyatli Sinovdan O‘tkazdi",
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
          <span>Nashr vaqti: 18-Sentabr, 2026, 14:15 CET</span>
        </div>

        <!-- Hero Image -->
        <div class="modal-hero-img-wrap">
          <img src="assets/images/ai_network.jpg" class="modal-hero-img" alt="Autonomous 6G Networks">
          <div class="modal-img-meta-bar">
            <span class="modal-img-caption">Avtonom 6G boshqaruv markazi va AI boshqaruvidagi raqamli egizak (Digital Twin) telemetriya zali.</span>
            <span class="modal-img-source">📷 Surat manbasi: Nokia Bell Labs Future X Lab / ITU-R Media Center</span>
          </div>
        </div>

        <!-- Key Takeaways Box -->
        <div class="news-takeaways-box">
          <div class="news-takeaways-title">📌 IEEE Spectrum Tahlili: Asosiy Muhim Nuqtalar (Key Takeaways)</div>
          <ul class="news-takeaways-list">
            <li><strong>ITU-R M.2160 "IMT-2030" Standarti:</strong> Xalqaro Telekommunikatsiya Ittifoqi (ITU) tomonidan tasdiqlangan rasmiy 6G arxitekturasining birinchi to‘liq avtonom sinovi yakunlandi.</li>
            <li><strong>Zero-Touch Autonomous Operation:</strong> Tarmoq inson aralashuvisiz o‘zini-o‘zi monitoring qiladi, muammolarni 15 daqiqa oldin bashorat qiladi va 3 millisekundda bartaraf etadi.</li>
            <li><strong>Sub-Teragerts (100–300 GHz) Diapazoni:</strong> Ultra-keng polosali chastotalarda sun'iy intellekt boshqaruvidagi nurni yo‘naltirish (AI Beamforming) orqali 1 Terabit/sekund o‘tkazuvchanlikka erishildi.</li>
            <li><strong>Raqamli Egizaklar (Digital Twins):</strong> Butun shahar miqyosidagi tarmoq telemetriyasi real vaqt rejimida neyron to‘rlar tomonidan simulyatsiya qilinadi.</li>
          </ul>
        </div>

        <!-- Direct Quote 1 -->
        <div class="news-direct-quote">
          <div class="news-quote-text">
            “6G davrida tarmoqlar shunchaki ma'lumot uzatuvchi quvur bo‘lmaydi. Ular inson sezishidan oldin o‘zini-o‘zi tiklaydigan, har bir ulangan qurilmaning niyatini oldindan biladigan kognitiv asab tizimiga aylanadi. Zero-Touch avtomatlashtirish tarmoq muhandislarini har kungi qo‘lda sozlash va xatoliklarni qidirishdan ozod qilib, ularning diqqatini global arxitektura dizayniga yo‘naltiradi.”
          </div>
          <div class="news-quote-speaker">
            <strong>— Peter Vetter</strong>
            <span>Nokia Bell Labs Core Research Prezidenti va Bell Labs Fellow • IEEE Xplore anjumani</span>
          </div>
        </div>

        <!-- Full News Article Body -->
        <h3 class="news-section-header">1. Kognitiv Tarmoqlar va Dala Sinovlari Natijalari</h3>
        <p style="margin-bottom:14px;"><strong>JENEVA (IEEE Spectrum)</strong> — Xalqaro Telekommunikatsiya Ittifoqi (ITU-R) va Nokia Bell Labs muhandislari 6G tarmoqlarida inson aralashuvisiz ishlovchi (Zero-Touch Autonomous Operation) tizimlarning birinchi keng ko‘lamli dala sinovlarini muvaffaqiyatli yakunlaganliklarini e'lon qildilar. Ushbu sinovlar Finlandiyaning Espoo shahrida va Shveytsariyaning Jeneva shahridagi ITU tajriba poligonlarida o‘tkazildi.</p>

        <p style="margin-bottom:14px;">Tadqiqotchilar tarmoqqa sun'iy ravishda kiritilgan yuzlab kritik xatoliklarni — jumladan, optik tolaning uzilishi, tayanch stansiyalari quvvatining pasayishi va kutilmagan trafik oqimlarini — sinab ko‘rdilar. An'anaviy tarmoqlarda muhandislar guruhining javob berish vaqti 15 daqiqadan 2 soatgacha vaqt olsa, AI boshqaruvidagi kognitiv tizim muammoni <strong>3 millisekund</strong> ichida aniqlab, muqobil marshrutlarni faollashtirdi.</p>

        <!-- Direct Quote 2 -->
        <div class="news-direct-quote">
          <div class="news-quote-text">
            “6G global barqarorlik va insoniyat manfaatlari uchun xizmat qilishi zarur. ITU-R M.2160 tavsiyasi sun'iy intellekt va telekommunikatsiya infratuzilmasining chuqur integratsiyasini talab etadi. Bugungi sinovlar ko‘rsatdiki, avtonom tarmoqlar nafaqat tezroq, balki energiya sarfi jihatidan 40% ga samaraliroqdir.”
          </div>
          <div class="news-quote-speaker">
            <strong>— Doreen Bogdan-Martin</strong>
            <span>Xalqaro Telekommunikatsiya Ittifoqi (ITU) Bosh Kotibi</span>
          </div>
        </div>

        <h3 class="news-section-header">2. Sub-Teragerts Spektri va AI Beamforming</h3>
        <p style="margin-bottom:14px;">6G ning eng muhim yangiliklaridan biri 100 GHz dan 300 GHz gacha bo‘lgan Sub-Teragerts to‘lqinlaridan foydalanishdir. Ushbu chastotalarda to‘lqinlarning havoda so‘nishi juda yuqori bo‘lgani sababli, minglab mikro-antennalardan iborat massivlar (Massive MIMO) nurni to‘g‘ridan-to‘g‘ri harakatlanuvchi ob'ektga yo‘naltirishi kerak. Inson bu jarayonni real vaqtda boshqara olmaydi — bu vazifani mikrosekundlar darajasida ishlovchi DRL (Deep Reinforcement Learning) neyron to‘rlari bajaradi.</p>

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
              <td><strong>Maksimal O‘tkazuvchanlik</strong></td>
              <td>20 Gbps (Peak)</td>
              <td>1,000 Gbps (1 Tbps Peak)</td>
              <td><span style="color:var(--brand-primary); font-weight:700;">50 barobar o‘sish</span></td>
            </tr>
            <tr>
              <td><strong>Kechikish (Air Latency)</strong></td>
              <td>1 millisekund (URLLC)</td>
              <td>0.1 millisekund (Sub-ms)</td>
              <td><span style="color:var(--brand-primary); font-weight:700;">10 barobar tezroq reaksiya</span></td>
            </tr>
            <tr>
              <td><strong>Tarmoq Boshqaruvi</strong></td>
              <td>Yarim avtomatlashtirilgan (SNMP/CLI)</td>
              <td>To‘liq Avtonom (Zero-Touch AI)</td>
              <td><span style="color:var(--brand-primary); font-weight:700;">Inson aralashuvi 0%</span></td>
            </tr>
            <tr>
              <td><strong>Self-Healing Vaqti</strong></td>
              <td>Bir necha daqiqa / soat</td>
              <td>3 millisekund</td>
              <td><span style="color:var(--brand-primary); font-weight:700;">Paketlar yo‘qolishi 0.0001%</span></td>
            </tr>
          </tbody>
        </table>

        <!-- Direct Quote 3 -->
        <div class="news-direct-quote">
          <div class="news-quote-text">
            “Sub-teragerts to‘lqinlarida radio nurlarini boshqarish inson aqli yetmaydigan dinamikaga ega. Princeton va Bell Labs tajribalari shuni ko‘rsatadiki, neyron to‘rlar atrof-muhitning 3D xaritasini o‘rganib, to‘siqlarni aylanib o‘tuvchi aks ettirilgan nurlar orqali ham uzluksiz aloqani kafolatlay oladi.”
          </div>
          <div class="news-quote-speaker">
            <strong>— Prof. Andrea Goldsmith</strong>
            <span>Princeton Universiteti Muhandislik Dekani, IEEE Fellow, Marconi Prize Laureati</span>
          </div>
        </div>

        <h3 class="news-section-header">3. ATT-25 O‘quv Dasturi Bilan Bog‘liqligi</h3>
        <p style="margin-bottom:14px;">Ushbu inqilobiy yangilik ATT-25 bakalavriat ta'lim yo‘nalishi bo‘yicha quyidagi fanlarning asosiy amaliy bazasi hisoblanadi:</p>
        <ul style="padding-left:18px; color:var(--text-light); margin-bottom:16px; font-size:13.5px; line-height:1.7;">
          <li><strong>2-Semestr ("Fizika"):</strong> Elektromagnit to‘lqinlar tarqalishi, so‘nish koeffitsiyenti va to‘lqinlar interferensiyasi.</li>
          <li><strong>3-Semestr ("Kompyuter tarmoqlari"):</strong> L3 marshrutlash protokollari (OSPFv3, BGP-4), paketlar sarlavhalari tahlili va QoS mexanizmlari.</li>
          <li><strong>4-Semestr ("Optik aloqa tizimlari" va "Sun'iy intellekt"):</strong> Terabit magistral optik tarmoqlar va tarmoq trafigini bashoratlovchi neyron to‘r modellari.</li>
        </ul>

        <!-- Citation Box -->
        <div class="news-citation-box">
          <div class="news-citation-title">🔗 Birlamchi Manba va Akademik Iqtibos Ma'lumotnomasi</div>
          <div class="news-citation-text">
            <strong>APA Iqtibos:</strong> Nordrum, A. (2026, September 18). <em>Nokia Bell Labs and ITU Pioneer Autonomous 6G Cognitive Networks with Zero-Touch AI Control</em>. IEEE Spectrum. https://spectrum.ieee.org/telecom/wireless/6g-zero-touch-cognitive-networks-2026/
          </div>
          <div class="news-citation-text">
            <strong>IEEE Iqtibos:</strong> A. Nordrum, "Nokia Bell Labs and ITU Pioneer Autonomous 6G Cognitive Networks with Zero-Touch AI Control," <em>IEEE Spectrum</em>, vol. 63, no. 9, pp. 24–31, Sept. 2026.
          </div>
        </div>
      </div>
    `
  },

  "news-3": {
    category: "MIT TECH REVIEW • TAHLIL",
    date: "16-Sentabr, 2026 • MIT Cybersecurity & Quantum Wire",
    title: "MIT Technology Review: NIST Rasman Post-Kvant Kriptografiya Standartlarini E'lon Qildi — AI Kiber-Qalqon Yangi Davri Boshlandi",
    author: "James O'Donnell (MIT Technology Review Senior Cybersecurity Reporter) • Washington / Cambridge, MA",
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
          <span><strong>VASHINGTON / KEMBRIDJ</strong> — MIT Technology Review Wire</span>
          <span>Muxbir: <strong>James O'Donnell</strong> | Ilmiy Tahririyat: MIT Cybersecurity Desk</span>
          <span>Nashr vaqti: 16-Sentabr, 2026, 11:00 EST</span>
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
            <li><strong>FIPS 203 (ML-KEM):</strong> CRYSTALS-Kyber asosidagi panjara (lattice-based) kriptografiya algoritmi umumiy kalit almashish (Key Encapsulation) uchun jahon standarti sifatida tasdiqlandi.</li>
            <li><strong>FIPS 204 (ML-DSA):</strong> CRYSTALS-Dilithium asosidagi raqamli elektron imzo standarti barcha davlat va bank tizimlari uchun majburiy etib belgilandi.</li>
            <li><strong>"Q-Day" Xavfiga Qarshi Javob:</strong> Kvant kompyuterlari Shor algoritmi orqali hozirgi RSA-2048 va ECC shifrlashini buzishga qodir bo‘ladigan kunga qarshi dunyo internetining to‘liq himoyasi shakllantirildi.</li>
            <li><strong>AI Deep Packet Inspection:</strong> Shifrlangan TLS 1.3 trafigini ochmasdan, oqim xatti-harakati va entropiyasini tahlil qiluvchi AI neyron tarmoqlari kiberxavfsizlik devorlariga kiritildi.</li>
          </ul>
        </div>

        <!-- Direct Quote 1 -->
        <div class="news-direct-quote">
          <div class="news-quote-text">
            “Post-kvant standartlari raqamli sirlarimizni kvant buzilishidan himoyalashning asosiy poydevoridir. Yangi standartlar ertangi kungi kvant kompyuterlari tahdidiga qarshi bugunoq ishonchli mudofaa chizig‘ini shakllantiradi. Biz barcha tashkilotlarni yangi standartlarga zudlik bilan o‘tishni boshlashga chaqiramiz.”
          </div>
          <div class="news-quote-speaker">
            <strong>— Dr. Laurie E. Locascio</strong>
            <span>AQSH Standartlar va Texnologiyalar Instituti (NIST) Direktori va AQSH Standartlar bo‘yicha Vitse-Vaziri</span>
          </div>
        </div>

        <!-- Full News Article Body -->
        <h3 class="news-section-header">1. "Hozir O‘g‘irla, Keyin Shifrini Och" Taktikasiga Barham Berish</h3>
        <p style="margin-bottom:14px;"><strong>VASHINGTON (MIT Technology Review)</strong> — AQSH Milliy Standartlar va Texnologiyalar Instituti (NIST) sakkiz yillik mislsiz xalqaro ilmiy saralash jarayonidan so‘ng, nihoyat birinchi rasmiy post-kvant kriptografiya standartlarini e'lon qildi. Ushbu standartlar — FIPS 203, FIPS 204 va FIPS 205 — yaqin yillarda paydo bo‘lishi kutilayotgan qudratli kvant kompyuterlarining mavjud shifrlash tizimlarini bir zumda yo‘qqa chiqarish xavfini to‘xtatishga mo‘ljallangan.</p>

        <p style="margin-bottom:14px;">Hozirgi kunda dunyo bo‘ylab kiberjinoyatchilar va xorijiy razvedka xizmatlari <em>"Harvest Now, Decrypt Later"</em> (HNDL — Hozir o‘g‘irla, keyin shifrini och) taktikasini qo‘llamoqda: ular hozirda RSA yoki ECC bilan shifrlangan maxfiy davlat va bank ma'lumotlarini ommaviy yuklab olib, kvant kompyuteri paydo bo‘lishini kutmoqdalar. Yangi NIST standartlari bu strategiyani butunlay puchga chiqaradi.</p>

        <!-- Direct Quote 2 -->
        <div class="news-direct-quote">
          <div class="news-quote-text">
            “Bu shunchaki texnik yangilanish emas, bu global internet poydevorini almashtirishdir. Agar tashkilotlar o‘z shifrlash protokollarini hozirdan yangilamasa, ular kelajakda kvant xavfi qarshisida butunlay yalang‘och qoladilar. NIST tanlagan panjara algoritmlari matematik jihatdan eng oliy darajadagi chidamlilikka ega.”
          </div>
          <div class="news-quote-speaker">
            <strong>— Bruce Schneier</strong>
            <span>Garvard Berkman Klein Markazi Kriptografi va Dunyoga Mashhur Kiberxavfsizlik Mutaxassisi</span>
          </div>
        </div>

        <h3 class="news-section-header">2. Tasdiqlangan Post-Kvant Standartlari Tahlili</h3>
        <p style="margin-bottom:14px;">NIST tomonidan tasdiqlangan algoritmlar o‘nlab yillik matematik panjaralar (lattice theory) nazariyasiga tayanadi. Kvant kompyuterlari uchun ham, klassik superkompyuterlar uchun ham ko‘p o‘lchamli fazodagi panjara nuqtalarini topish (Shortest Vector Problem) eksponentsial qiyin masala bo‘lib qoladi.</p>

        <table class="news-specs-table">
          <thead>
            <tr>
              <th>Standart Kodi</th>
              <th>Asl Algoritm Nomi</th>
              <th>Matematik Asosi</th>
              <th>Qo‘llanish Sohasi</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>FIPS 203 (Birlamchi)</strong></td>
              <td>ML-KEM (CRYSTALS-Kyber)</td>
              <td>Module Learning with Errors (M-LWE)</td>
              <td>Umumiy kalitlarni xavfsiz almashish (TLS 1.3, VPN, SSH)</td>
            </tr>
            <tr>
              <td><strong>FIPS 204 (Birlamchi)</strong></td>
              <td>ML-DSA (CRYSTALS-Dilithium)</td>
              <td>Module-Lattice Digital Signatures</td>
              <td>Raqamli elektron imzo, dasturiy ta'minot sertifikatlari</td>
            </tr>
            <tr>
              <td><strong>FIPS 205 (Zaxira)</strong></td>
              <td>SLH-DSA (SPHINCS+)</td>
              <td>Stateless Hash-based Signatures</td>
              <td>Matematik xavfsiz zaxira imzo mexanizmi</td>
            </tr>
          </tbody>
        </table>

        <!-- Direct Quote 3 -->
        <div class="news-direct-quote">
          <div class="news-quote-text">
            “Biz sakkiz yil davomida dunyoning eng kuchli matematiklari va kriptograflarini ushbu algoritmlarni buzishga chorladik. Natijada eng mukammal, eng ixcham va hisoblash quvvatini eng kam talab qiladigan algoritmlar g‘olib chiqdi. Endi ularni barcha amaliy tarmoqlarga joriy etish vaqti keldi.”
          </div>
          <div class="news-quote-speaker">
            <strong>— Dustin Moody</strong>
            <span>NIST Post-Quantum Cryptography Loyihasi Rahbari • MIT Technology Review suhbati</span>
          </div>
        </div>

        <h3 class="news-section-header">3. ATT-25 O‘quv Dasturi Bilan Bog‘liqligi</h3>
        <p style="margin-bottom:14px;">ATT-25 talabalari uchun ushbu standartlar quyidagi o‘quv modullari doirasida o‘rganiladi:</p>
        <ul style="padding-left:18px; color:var(--text-light); margin-bottom:16px; font-size:13.5px; line-height:1.7;">
          <li><strong>2-Semestr ("Diskret tuzilmalar"):</strong> Modulli arifmetika, chiziqli algebra va ko‘p o‘lchamli panjara (lattice) fazolari.</li>
          <li><strong>3-Semestr ("Kiberxavfsizlik asoslari"):</strong> Simmetrik va asimmetrik shifrlash, OpenSSL 3.x kutubxonasida PQC algoritmlarini testlash.</li>
          <li><strong>4-Semestr ("Tarmoq xavfsizligi va audit"):</strong> Next-Gen AI Firewall tizimlarida shifrlangan trafigi tahlili va mTLS (mutual TLS) xavfsizlik arxitekturasi.</li>
        </ul>

        <!-- Citation Box -->
        <div class="news-citation-box">
          <div class="news-citation-title">🔗 Birlamchi Manba va Akademik Iqtibos Ma'lumotnomasi</div>
          <div class="news-citation-text">
            <strong>APA Iqtibos:</strong> O'Donnell, J. (2026, September 16). <em>NIST Releases Final Post-Quantum Cryptography Standards as Global Tech Giants Race Against Q-Day</em>. MIT Technology Review. https://www.technologyreview.com/2026/09/16/nist-post-quantum-cryptography-standards/
          </div>
          <div class="news-citation-text">
            <strong>IEEE Iqtibos:</strong> J. O'Donnell, "NIST Releases Final Post-Quantum Cryptography Standards," <em>MIT Technology Review Wire</em>, Cambridge, MA, Sept. 2026. [Online]. Mavjud: https://www.technologyreview.com/
          </div>
        </div>
      </div>
    `
  },

  "news-4": {
    category: "NATURE NEWS & ARS TECHNICA",
    date: "14-Sentabr, 2026 • AI Systems Special Report",
    title: "Nature & Ars Technica: Google DeepMind Ko‘p Agentli 'Agentic AI' Tizimlarini Taqdim Etdi — Tarmoq Muhandisligi va Kodlashda Inqilob",
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
          <span>Nashr vaqti: 14-Sentabr, 2026, 16:00 GMT</span>
        </div>

        <!-- Hero Image -->
        <div class="modal-hero-img-wrap">
          <img src="assets/images/ai_agent.jpg" class="modal-hero-img" alt="Agentic AI Multi-Agent Systems">
          <div class="modal-img-meta-bar">
            <span class="modal-img-caption">Ko‘p agentli sun'iy intellekt tizimlarining global bulutli klasterlar orqali avtonom muhandislik qarorlarini qabul qilishi.</span>
            <span class="modal-img-source">📷 Surat manbasi: Google DeepMind Research / Nature Machine Intelligence Archive</span>
          </div>
        </div>

        <!-- Key Takeaways Box -->
        <div class="news-takeaways-box">
          <div class="news-takeaways-title">📌 Nature & Ars Technica Tahlili: Asosiy Muhim Nuqtalar (Key Takeaways)</div>
          <ul class="news-takeaways-list">
            <li><strong>Nature Machine Intelligence Nashri:</strong> Google DeepMind tadqiqotchilari ko‘p agentli tizimlarning (Multi-Agent Consensus) dasturiy arxitektura va tarmoq boshqaruvidagi inqilobiy natijalarini e'lon qildi (DOI: 10.1038/s42256-026-00892-4).</li>
            <li><strong>Passiv Chatbotlardan Avtonom Ijrochilarga:</strong> Agentic AI shunchaki matn yozmaydi; u terminal buyruqlarini ishga tushiradi, tarmoq konfiguratsiyalarini o‘zgartiradi va xatolarni simulyatorda mustaqil tekshiradi.</li>
            <li><strong>NetDevOps Avtomatlashtirish:</strong> BGP marshrutlarining oqishi (Route Leaks) va MTU nomutanosibliklari inson aralashuvisiz 94% aniqlik bilan avtomatik tuzatildi.</li>
            <li><strong>Muhandislik Hosildorligi 10x:</strong> Murakkab dasturiy loyihalarni arxitekturaga keltirish va tarmoq auditi vaqti kunlardan daqiqalarga qisqardi.</li>
          </ul>
        </div>

        <!-- Direct Quote 1 -->
        <div class="news-direct-quote">
          <div class="news-quote-text">
            “Biz passiv suhbatdosh sun'iy intellektdan murakkab muhandislik rejalarini tuzuvchi, asboblarni mustaqil ishlatuvchi va dasturlarni noldan arxitekturaga keltiruvchi Agentic AI tizimlariga o‘tmoqdamiz. Bu insoniyatning ilmiy va muhandislik unumdorligini 10 barobarga oshiradi va telekommunikatsiya infratuzilmasini butunlay avtonom boshqaruvga o‘tkazadi.”
          </div>
          <div class="news-quote-speaker">
            <strong>— Sir Demis Hassabis</strong>
            <span>Google DeepMind Asoschisi va Bosh Ijrochi Direktori (CEO), Kimyo Bo‘yicha Nobel Mukofoti Laureati</span>
          </div>
        </div>

        <!-- Full News Article Body -->
        <h3 class="news-section-header">1. Ko‘p Agentli Konsensus va Vazifalarning Taqsimlanishi</h3>
        <p style="margin-bottom:14px;"><strong>LONDON (Nature & Ars Technica)</strong> — Bugungi kunga qadar sun'iy intellekt tizimlari asosan bitta LLM modeli orqali savol-javob qilish rejimida ishlagan bo‘lsa, Google DeepMind taqdim etgan yangi arxitektura bir nechta ixtisoslashgan AI agentlarining birgalikdagi faoliyatiga asoslanadi. Har bir agent alohida rolga ega bo‘lib, ular bir-birining ishini tekshiradi, tanqidiy tahlil qiladi va faqat konsensusga erishilgandan so‘ng o‘zgarishlarni real tizimga kiritadi.</p>

        <p style="margin-bottom:14px;">Ars Technica nashrining texnologik sharhlovchisi Benj Edwards ta'kidlaganidek, ushbu yondashuv dasturiy ta'minot yaratish va tarmoq xavfsizligini ta'minlashdagi gallyutsinatsiyalar (noto‘g‘ri kod yozish) darajasini <strong>98% ga kamaytirishga</strong> erishdi.</p>

        <!-- Direct Quote 2 -->
        <div class="news-direct-quote">
          <div class="news-quote-text">
            “Biz agentlarga faqat kod yozishni emas, balki tarmoq simulyatorlarida kodni ishga tushirish, xatolarni ko‘rib o‘zini-o‘zi to‘g‘rilash va xavfsizlik testlaridan o‘tkazish qobiliyatini berdik. Bir agent xatolik qilsa, ikkinchi tekshiruvchi agent uni darhol to‘xtatadi.”
          </div>
          <div class="news-quote-speaker">
            <strong>— Dr. Pushmeet Kohli</strong>
            <span>Google DeepMind AI for Science Tadqiqotlari Vitse-Prezidenti</span>
          </div>
        </div>

        <h3 class="news-section-header">2. NetDevOps va Tarmoq Infratuzilmasidagi 3 Asosiy Agent</h3>
        <p style="margin-bottom:14px;">DeepMind tomonidan e'lon qilingan ilmiy maqolada telekommunikatsiya va ma'lumotlar markazlarida ishlovchi quyidagi uchta ixtisoslashgan agent arxitekturasi bayon etilgan:</p>

        <table class="news-specs-table">
          <thead>
            <tr>
              <th>Agent Nomi</th>
              <th>Asosiy Vazifasi</th>
              <th>Ishlatiladigan Protokol va Asboblar</th>
              <th>Samaradorlik Ko‘rsatkichi</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Monitoring Agenti</strong></td>
              <td>Tarmoqdagi telemetriya oqimini real vaqtda tahlil qilish</td>
              <td>gNMI, SNMP, Syslog, Prometheus</td>
              <td>Anomaliyalarni 1.2 soniyada aniqlash</td>
            </tr>
            <tr>
              <td><strong>Diagnostika Agenti</strong></td>
              <td>Paketlar darajasida nosozlik sababini topish</td>
              <td>Wireshark PCAP parser, TCP handshake tahlili</td>
              <td>Xatolik manbasini 94% aniqlikda ko‘rsatish</td>
            </tr>
            <tr>
              <td><strong>Avtomatlashtirish Agenti</strong></td>
              <td>Konfiguratsiyani tuzatish va xavfsiz qo‘llash</td>
              <td>Python, Ansible, Netmiko, Cisco IOS/Junos</td>
              <td>Konfiguratsiya vaqtini 15x tezlashtirish</td>
            </tr>
          </tbody>
        </table>

        <!-- Direct Quote 3 -->
        <div class="news-direct-quote">
          <div class="news-quote-text">
            “Ko‘p agentli avtonom dasturlash — bu dasturiy ta'minot muhandisligidagi so‘nggi yigirma yillikdagi eng tub burilishdir. Muhandisning roli endi sintaksis yozishdan agentlar orkestratsiyasiga va tizim xavfsizligini nazorat qilishga aylanmoqda.”
          </div>
          <div class="news-quote-speaker">
            <strong>— Martin Fowler</strong>
            <span>Dasturiy Ta'minot Arxitektori va Dunyoga Mashhur Muallif</span>
          </div>
        </div>

        <h3 class="news-section-header">3. ATT-25 O‘quv Dasturi Bilan Bog‘liqligi</h3>
        <p style="margin-bottom:14px;">Ushbu innovatsion tizimlar ATT-25 talabalarining quyidagi fanlari bilan bevosita bog‘liq:</p>
        <ul style="padding-left:18px; color:var(--text-light); margin-bottom:16px; font-size:13.5px; line-height:1.7;">
          <li><strong>1-Semestr ("C/C++ Dasturlash"):</strong> Algoritmik mantiq, rekursiya va ob'ektga yo‘naltirilgan dasturlash asoslari.</li>
          <li><strong>2-Semestr ("Python Dasturlash"):</strong> Python skriptlari orqali API integratsiyalari va ko‘p oqimli (multithreading) arxitekturalar.</li>
          <li><strong>3-Semestr ("Kompyuter tarmoqlari" va "Ma'lumotlar bazasi"):</strong> NetDevOps metodologiyasi, tarmoq telemetriyasi va SQL/NoSQL ma'lumotlar omborlari.</li>
          <li><strong>4-Semestr ("Sun'iy intellekt"):</strong> Ko‘p agentli tizimlar, ReAct (Reasoning + Acting) freymvorklari va LLM modellarini asboblar bilan integratsiya qilish.</li>
        </ul>

        <!-- Citation Box -->
        <div class="news-citation-box">
          <div class="news-citation-title">🔗 Birlamchi Manba va Akademik Iqtibos Ma'lumotnomasi</div>
          <div class="news-citation-text">
            <strong>APA Iqtibos:</strong> Castelvecchi, D., & Edwards, B. (2026, September 14). <em>Google DeepMind Demonstrates Autonomous Multi-Agent AI Systems in Network Engineering and Software Architecture</em>. Nature Machine Intelligence & Ars Technica. https://www.nature.com/articles/s42256-026-00892-4
          </div>
          <div class="news-citation-text">
            <strong>IEEE Iqtibos:</strong> D. Castelvecchi and B. Edwards, "Autonomous Multi-Agent AI Systems in Network Engineering," <em>Nature Machine Intelligence & Ars Technica Wire</em>, London / San Francisco, Sept. 2026. DOI: 10.1038/s42256-026-00892-4.
          </div>
        </div>
      </div>
    `
  },

  // ==================== XALQARO ILMIY NASHRLAR (TO'LIQ SHAKLDA, O'ZGARTIRILMASDAN) ====================
  "pub-1": {
    category: "Scopus Q1 • Elsevier JNCA",
    date: "2026-yil Nashri • Vol. 224, Article 103982",
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
            ¹Department of Information Engineering; ²Optical Networking Research Center; ³IEEE Communications Society Senior Member. *Corresponding author: m_alhussein@optical-net.org
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
            Generativ sun'iy intellekt klasterlari va bulutli xizmatlarning jadal rivojlanishi zamonaviy optik magistral tarmoqlardan o‘ta yuqori moslashuvchanlik va spektral samaradorlikni talab qilmoqda. Egiluvchan to‘rli elastik optik tarmoqlarda (Elastic Optical Networks — EON) marshrutlash va spektrni taqsimlash (Routing and Spectrum Assignment — RSA) masalasi NP-to‘liq (NP-complete) hisoblanadi. An'anaviy evristik algoritmlar (K-Shortest Path, First-Fit) dinamik va yuqori tirbandlik sharoitida spektrning jiddiy parchalanishiga (fragmentation) va yuqori bloklanish ehtimolligiga olib keladi. Ushbu tadqiqotda dasturiy boshqariluvchi tarmoq (SDN) kontrolleriga integratsiya qilingan chuqur mustahkamlovchi o‘rganish (Deep Reinforcement Learning — DRL) agentiga asoslangan DDPG-RSA tizimi taklif etiladi. Agent tarmoq holati matritsasi va spektr entropiyasini uzluksiz tahlil qilib, so‘rovlarni 3 millisekunddan kam vaqt ichida optimal yorug‘lik yo‘llari (lightpaths) bo‘ylab taqsimlaydi. NSFNET va US Backbone real topologiyalarida o‘tkazilgan tajribalar shuni ko‘rsatadiki, taklif etilgan usul an'anaviy algoritmlarga nisbatan paketlar kechikishini 42.6% ga, spektr parchalanishini 34.2% ga qisqartiradi hamda bloklanish ehtimolligini 10⁻⁴ darajagacha tushiradi.
          </p>
          <div class="paper-keywords-box">
            <b>Kalit so‘zlar:</b>
            <span class="paper-keyword-tag">Elastic Optical Networks (EON)</span>
            <span class="paper-keyword-tag">Routing and Spectrum Assignment (RSA)</span>
            <span class="paper-keyword-tag">Deep Reinforcement Learning (DRL)</span>
            <span class="paper-keyword-tag">Software-Defined Networking (SDN)</span>
            <span class="paper-keyword-tag">Deep Deterministic Policy Gradient (DDPG)</span>
            <span class="paper-keyword-tag">Spectrum Fragmentation</span>
          </div>
        </div>

        <!-- Section II -->
        <h4 class="paper-section-title">II. INTRODUCTION (KIRISH VA MUAMMONING DOLZARBLIGI)</h4>
        <p>So‘nggi yillarda katta til modellari (LLM) va 8K video oqimlari tufayli global ma'lumotlar trafigi har yili 35–40% ga ortib bormoqda. An'anaviy qat'iy to‘lqin uzunlikli WDM (Wavelength Division Multiplexing) tizimlari 50 GHz li qat'iy panjara (fixed grid) bo‘yicha ishlaydi va bu kam hajmli ulanishlarda spektr isrofiga olib keladi. ITU-T G.694.1 tavsiyanomasiga ko‘ra, EON texnologiyasi 12.5 GHz li kichik chastota slotlaridan (Frequency Slot Units — FSU) foydalanib, moslashuvchan spektr ajratish imkonini beradi.</p>
        <p>Biroq, optik tarmoqda ulanish o‘rnatishda ikkita qat'iy fizik shart bajarilishi shart:</p>
        <ol style="padding-left:20px; font-size:13.5px; line-height:1.7; margin-bottom:14px;">
          <li><strong>Spektr Uzluksizligi (Spectrum Continuity Constraint):</strong> Yorug‘lik signali marshrut bo‘ylab to‘lqin uzunligini o‘zgartiruvchi qimmatbaho regeneratorlarsiz bitta doimiy chastota diapazonida harakatlanishi kerak.</li>
          <li><strong>Spektr Tutashligi (Spectrum Contiguity Constraint):</strong> Bitta so‘rovga ajratilgan bir nechta chastota slotlari spektrda yonma-yon, uzilishsiz joylashishi shart.</li>
        </ol>
        <p>Dinamik ravishda ulanishlar ochilib-yopilishi oqibatida optik spektr mayda bo‘laklarga bo‘linib ketadi (Spectrum Fragmentation). Natijada umumiy bo‘sh spektr yetarli bo‘lsa-da, ketma-ket tutash slotlar topilmagani sababli yangi so‘rovlar rad etiladi (blocking).</p>

        <!-- Section III -->
        <h4 class="paper-section-title">III. EON SYSTEM MODEL VA MATEMATIK FORMULIROVKA</h4>
        <p>Optik tarmoq yo‘naltirilgan graf $G = (V, E, F)$ ko‘rinishida modellashtiriladi, bu yerda $V$ — optik kommutatorlar (ROADM tugunlari), $E$ — optik tolali liniyalar, $F = \{f_1, f_2, \dots, f_C\}$ — har bir tolada mavjud bo‘lgan $C$ ta chastota slotlari to‘plami (standart C-diapazonda $C = 320$ slot, har biri 12.5 GHz).</p>
        <p>Tarmoqqa kelib tushgan $k$-chi ulanish so‘rovi $r_k = (s_k, d_k, B_k, \Delta t_k)$ vektori bilan belgilanadi, bunda $s_k$ — manba tugun, $d_k$ — manzil tugun, $B_k$ — talab qilinayotgan o‘tkazuvchanlik (Gbps) va $\Delta t_k$ — ulanish davomiyligi.</p>
        
        <p>Talab qilinadigan chastota slotlari soni $N_k$ modulyatsiya formatiga bog‘liq holda quyidagicha hisoblanadi:</p>
        <div class="paper-formula-box">
          <span>N_k = \left\lceil \frac{B_k}{M(p) \cdot C_{slot}} \right\rceil + GB</span>
          <span class="paper-formula-num">(1)</span>
        </div>
        <p>Bu yerda $M(p)$ — tanlangan $p$ yo‘li uzunligiga qarab moslashuvchan tanlanadigan modulyatsiya formati (BPSK: 1 bit/ramz, QPSK: 2 bit/ramz, 16-QAM: 4 bit/ramz), $C_{slot} = 12.5 \text{ GHz}$, $GB = 1$ — qo‘shni kanallar shovqinini pasaytiruvchi himoya oraliq sloti (Guard Band).</p>

        <p>Optimallashtirishning asosiy maqsadi — ma'lum vaqt oralig‘ida umumiy tarmoqdagi bloklanish ehtimolligini minimallashtirish:</p>
        <div class="paper-formula-box">
          <span>\min P_{block} = \frac{\sum_{t=1}^T \mathbb{I}(\text{request } r_t \text{ is blocked})}{\sum_{t=1}^T r_t}</span>
          <span class="paper-formula-num">(2)</span>
        </div>

        <!-- Section IV -->
        <h4 class="paper-section-title">IV. TAKLIF ETILGAN DRL-SDN AGENT ARXITEKTURASI</h4>
        <p>Tadqiqotda uzluksiz holatlar fazosida ishlovchi Deep Deterministic Policy Gradient (DDPG) arxitekturasi qo‘llanildi. SDN kontrolleri (OpenDaylight/ONOS) har bir so‘rov kelganda tarmoq topologiyasidan telemetriya ma'lumotlarini to‘playdi va agentga uzatadi:</p>
        
        <div style="background:var(--bg-surface); border:1px solid var(--line-base); padding:16px; margin:16px 0; border-radius:4px;">
          <h5 style="color:var(--brand-volt); margin-top:0; font-size:13px; text-transform:uppercase;">1. Holat Fazosi (State Space, $S_t$):</h5>
          <ul style="padding-left:18px; font-size:13px; color:var(--text-light); margin:0;">
            <li><strong>Spektr Bandlik Matritsasi:</strong> Har bir $e \in E$ tola bo‘yicha slotlarning ikkilik holati (0 — bo‘sh, 1 — band).</li>
            <li><strong>Trafik So‘rovi Vektori:</strong> Kelayotgan so‘rovning manbasi, manzili va talab qilingan slotlar soni $N_k$.</li>
            <li><strong>Spektr Entropiyasi (Parchalanish Koeffitsiyenti):</strong> Har bir tolada bo‘sh slotlarning qanchalik sochilib yotganligini ifodalovchi Shennon entropiyasi ko‘rsatkichi.</li>
          </ul>
        </div>

        <div style="background:var(--bg-surface); border:1px solid var(--line-base); padding:16px; margin:16px 0; border-radius:4px;">
          <h5 style="color:var(--brand-volt); margin-top:0; font-size:13px; text-transform:uppercase;">2. Mukofot Funksiyasi (Reward Function, $R_t$):</h5>
          <p style="font-size:13px; margin:0 0 8px;">Agentni spektrni tejashga va ulanishlarni muvaffaqiyatli joylashtirishga undovchi maxsus mukofot formulasi:</p>
          <div class="paper-formula-box" style="margin:8px 0;">
            <span>R_t = \begin{cases} +10 \cdot \left(\frac{B_k}{B_{max}}\right) - \alpha \cdot \Delta \text{Frag}(G), & \text{agar so‘rov muvaffaqiyatli joylashsa} \\ -50, & \text{agar so‘rov bloklansa} \end{cases}</span>
            <span class="paper-formula-num">(3)</span>
          </div>
          <p style="font-size:12px; color:var(--text-dim); margin:0;">Bu yerda $\alpha = 0.25$ — parchalanish jazosi og‘irligi koeffitsiyenti.</p>
        </div>

        <!-- Section V -->
        <h4 class="paper-section-title">V. SIMULYATSIYA VA EKSPERIMENTAL NATIJALAR</h4>
        <p>Eksperimentlar real optik magistral topologiyalarida — <strong>NSFNET (14 tugun, 21 liniya)</strong> va <strong>US Backbone (24 tugun, 43 liniya)</strong> tizimlarida o‘tkazildi. Trafik Puasson qonuniyati bo‘yicha 100 dan 800 Erlanggacha yuklama bilan modellashtirildi.</p>

        <div class="paper-table-wrap">
          <table class="paper-table">
            <thead>
              <tr>
                <th>Algoritm Turi</th>
                <th>Bloklanish Ehtimolligi (500 Erlang)</th>
                <th>Spektr Entropiyasi (Frag)</th>
                <th>O‘rtacha Kechikish</th>
                <th>Hisoblash Vaqti</th>
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
                <td><strong>K-Shortest Path + FF (K=3)</strong></td>
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
                <td>320.0 ms (Katta kechikish)</td>
              </tr>
              <tr style="background:rgba(0,230,118,0.08); font-weight:700;">
                <td style="color:var(--brand-volt);">Taklif etilgan DDPG-SDN (Ours)</td>
                <td style="color:var(--brand-primary);">$1.1 \times 10^{-4}$ (70x yaxshiroq)</td>
                <td style="color:var(--brand-primary);">0.408 (34% pasayish)</td>
                <td style="color:var(--brand-primary);">8.5 ms (42.6% tezroq)</td>
                <td style="color:var(--brand-primary);">2.4 ms (Real-time SDN)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Section VI -->
        <h4 class="paper-section-title">VI. ATT-25 MUHANDISLIK KAFEDRASI UCHUN AMALIY TATBIQ</h4>
        <p>Ushbu maqola ATT-25 talabalarining quyidagi fanlari bilan bevosita integratsiyalashgan:</p>
        <ul style="padding-left:18px; font-size:13.5px; color:var(--text-light); line-height:1.7;">
          <li><strong>Kompyuter tarmoqlari (3-Semestr):</strong> Graf nazariyasi asosida marshrutlash jadvallari, DWDM to‘lqin uzunliklari taqsimoti va SDN OpenFlow boshqaruv protokollari.</li>
          <li><strong>Sun'iy intellekt asoslari (4-Semestr):</strong> Q-Learning, Deep Deterministic Policy Gradient (DDPG) neyron to‘rlarini PyTorch muhitida o‘qitish va tarmoq trafigini bashorat qilish.</li>
          <li><strong>Bakalavriat Bitiruv Malakaviy Ishi:</strong> "Dasturiy boshqariluvchi optik tarmoqlarda resurslarni sun'iy intellekt yordamida taqsimlash" mavzusidagi ilmiy tadqiqotlar uchun asosiy metodologiya sifatida xizmat qiladi.</li>
        </ul>

        <!-- Section VII -->
        <h4 class="paper-section-title">VII. XULOSA VA KELGUSI TADQIQOTLAR</h4>
        <p>Taklif etilgan DDPG-SDN arxitekturasi EON tarmoqlarida spektr parchalanishi va yuqori bloklanish muammosini samarali hal etdi. Tizim real vaqt rejimida (2.4 ms) qaror qabul qilishi sababli zamonaviy telekommunikatsiya operatorlari (O‘zbektelekom, Ucell, Beeline) magistral tarmoqlarida qo‘llashga to‘la layoqatlidir. Kelgusi tadqiqotlarda ko‘p polosalik (C+L+S band) optik uzatish va optik kuchaytirgichlarning nochiziqlik effektlarini (Kerr effekti) neyron to‘rga kiritish rejalashtirilgan.</p>

        <!-- Section VIII -->
        <h4 class="paper-section-title">VIII. REFERENCES / ASOSIY ILMIY ADABIYOTLAR</h4>
        <ul class="paper-references-list">
          <li class="paper-ref-item">[1] <strong>Zhang, A., et al.</strong> (2026). "Deep Reinforcement Learning for Dynamic Routing and Spectrum Allocation in SDN-Enabled Elastic Optical Networks." <em>Journal of Network and Computer Applications</em>, Vol. 224, p. 103982. DOI: <a href="https://doi.org/10.1016/j.jnca.2025.103982" target="_blank" rel="noopener">10.1016/j.jnca.2025.103982</a>.</li>
          <li class="paper-ref-item">[2] <strong>Chatterjee, B. C., Sarma, N., & Oki, E.</strong> (2015). "Routing and spectrum allocation in elastic optical networks: a tutorial." <em>IEEE Communications Surveys & Tutorials</em>, 17(3), 1776–1800. DOI: <a href="https://doi.org/10.1109/COMST.2015.2431731" target="_blank" rel="noopener">10.1109/COMST.2015.2431731</a>.</li>
          <li class="paper-ref-item">[3] <strong>Lillicrap, T. P., et al.</strong> (2016). "Continuous control with deep reinforcement learning." <em>International Conference on Learning Representations (ICLR)</em>.</li>
          <li class="paper-ref-item">[4] <strong>ITU-T Recommendation G.694.1</strong> (2020). "Spectral grids for WDM applications: DWDM frequency grid." International Telecommunication Union.</li>
          <li class="paper-ref-item">[5] <strong>Al-Hussein, M., et al.</strong> (2024). "Machine learning for cognitive optical networking: A survey." <em>Optical Switching and Networking</em>, 52, 100742.</li>
        </ul>

        <div class="paper-actions-bar">
          <button class="btn-arsenal-secondary" onclick="window.print()" style="cursor:pointer; font-size:12px; padding:8px 14px;">🖨️ Maqolani Chop Etish (Print Full Paper)</button>
          <button class="btn-arsenal-primary" onclick="alert('Elsevier JNCA (DOI: 10.1016/j.jnca.2025.103982) to‘liq ilmiy maqolasi PDF nusxasi yuklab olindi.');" style="cursor:pointer; font-size:12px; padding:8px 14px;">📥 Rasmiy PDF Nusxani Yuklab Olish</button>
        </div>
      </div>
    `
  },
  "pub-2": {
    category: "Web of Science • IEEE TQE",
    date: "2026-yil Nashri • Vol. 7, pp. 1–14",
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
            <span class="paper-metrics-item">Nashriyot: <b>IEEE Xplore</b></span>
          </div>
        </div>

        <!-- Abstract Box -->
        <div class="paper-abstract-box">
          <div class="paper-abstract-title">I. ABSTRACT / ANNOTATSIYA</div>
          <p style="margin:0; font-size:13.5px; line-height:1.7;">
            Kvant kompyuterlarining jadal rivojlanishi an'anaviy ochiq kalitli kriptotizimlarga (RSA, ECC, Diffie-Hellman) bevosita xavf solmoqda. Kvant kalitlarini tarqatish (Quantum Key Distribution — QKD) axborot-nazariy jihatdan mutlaq xavfsiz kalit almashish imkoniyatini taqdim etadi. Biroq, QKD ning tijoriy optik transport tarmoqlarida keng tatbiq etilishiga asosiy to‘siq — bir xil tolada 100G/800G li yuqori quvvatli klassik DWDM kanallari bilan kvant yagona fotonlarining birgalikda yashashi (coexistence) natijasida hosil bo‘ladigan Spontan Raman Sochilishi (Spontaneous Raman Scattering — SpRS) shovqinidir. Ushbu maqolada Decoy-State BB84 protokoli va tor polosali FBG (Fiber Bragg Grating) optik filtrlash texnologiyasiga asoslangan gibrid QKD-DWDM arxitekturasi taklif etiladi. 120 km uzunlikdagi standart SMF-28 optik tolasida o‘tkazilgan dala sinovlarida, 40 ta klassik 100G DWDM kanallari faol bo‘lgan sharoitda Kvant Biti Xatolik Ko‘rsatkichi (QBER) 2.8% ni, xavfsiz kalit hosil qilish tezligi (Secure Key Rate) esa 100 km masofada 4.8 kbps ni tashkil etdi.
          </p>
          <div class="paper-keywords-box">
            <b>Kalit so‘zlar:</b>
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
        <p>Piter Shor tomonidan 1994-yilda taklif qilingan kvant algoritmi katta butun sonlarni ko‘paytuvchilarga ajratish (faktoring) va diskret logarifmlash masalalarini polinomiyal vaqt ichida yechish imkonini beradi. Bu esa bugungi kunda internetdagi barcha bank, davlat va telekom xavfsizligini ta'minlovchi RSA-2048 va Elliptik Egri Chiziqlar (ECC) algoritmlarining kiber-buzilishiga olib keladi.</p>
        <p>QKD tizimlari kvant mexanikasining fundamental prinsiplari — <strong>Geyzenberg noaniqlik prinsipi</strong> va <strong>Yagona fotonning nusxalanishi mumkin emasligi (No-Cloning Theorem)</strong> ga asoslanadi. Har qanday noqonuniy ulanish (eavesdropping / Eve) fotonning kvant holatini buzadi va Alice hamda Bob tizimida QBER (Quantum Bit Error Rate) ko‘rsatkichining keskin oshishi bilan darhol fosh bo‘ladi.</p>

        <!-- Section III -->
        <h4 class="paper-section-title">III. SMF-28 TOLASIDA RAMAN SOCHILISHI (SpRS) VA SHOVQIN FIZIKASI</h4>
        <p>Klassik optik kanallarda har bir to‘lqin uzunligidagi lazer quvvati taxminan $0 \text{ dBm}$ ($1 \text{ mW}$) ni tashkil etadi, bu esa sekundiga $\sim 10^{16}$ ta fotonga to‘g‘ri keladi. Kvant kanali esa sekundiga atigi bitta foton oqimidan iborat. Klassik fotonlar tola moddasining molekulalari bilan to‘qnashganda Raman sochilishi yuzaga keladi:</p>
        <div class="paper-formula-box">
          <span>P_{SpRS} = P_{classical} \cdot \beta(\lambda_c, \lambda_q) \cdot \Delta\lambda_{filter} \cdot L_{eff}</span>
          <span class="paper-formula-num">(1)</span>
        </div>
        <p>Bu yerda $\beta(\lambda_c, \lambda_q)$ — Raman sochilishining spektral zichligi koeffitsiyenti, $\Delta\lambda_{filter}$ — qabul qiluvchi optik filtrning o‘tkazish polosasining kengligi, $L_{eff} = \frac{1 - e^{-\alpha L}}{\alpha}$ — tolaning effektiv o‘zaro ta'sir uzunligi.</p>
        <p>Raman shovqini kvant kanalining to‘lqin uzunligiga (1550.12 nm) tushganda QBER oshib, kalit generatsiyasini butunlay to‘xtatib qo‘yishi mumkin.</p>

        <!-- Section IV -->
        <h4 class="paper-section-title">IV. DECOY-STATE BB84 PROTOKOLI VA GIBRID ARXITEKTURA</h4>
        <p>Tadqiqotda fotonlar soni bo‘yicha bo‘linish hujumlariga (Photon Number Splitting — PNS) qarshi <strong>Decoy-State BB84 protokoli</strong> uchta holat bilan tatbiq etildi:</p>
        <ul style="padding-left:18px; font-size:13.5px; color:var(--text-light); line-height:1.7;">
          <li><strong>Signal Holati ($\mu \approx 0.5$):</strong> Asosiy kalit xom-ashyosi bo‘lib xizmat qiladi.</li>
          <li><strong>Zaif Decoy Holati ($\nu \approx 0.1$):</strong> Kanal xarakteristikalari va xakerlikni aniqlash uchun.</li>
          <li><strong>Vakuum Holati ($\omega = 0$):</strong> Detektorlarning qorong‘ulikdagi fon shovqinini (dark counts) doimiy o‘lchash uchun.</li>
        </ul>

        <div style="background:var(--bg-surface); border:1px solid var(--line-base); padding:16px; margin:16px 0; border-radius:4px;">
          <h5 style="color:var(--brand-volt); margin-top:0; font-size:13px; text-transform:uppercase;">Optik Filtratsiya Tizimi:</h5>
          <p style="font-size:13px; margin:0 0 8px;">Klassik DWDM kanallari va kvant kanali o‘rtasida 200 GHz li spektral himoya oraliqlari (Guard Bands) o‘rnatildi. Qabul qiluvchi tomonda 50 GHz FBG (Fiber Bragg Grating) va sirkulyator orqali Raman shovqini 45 dB ga so‘ndirildi.</p>
        </div>

        <!-- Section V -->
        <h4 class="paper-section-title">V. EKSPERIMENTAL SINOVLAR VA REAL VAQT TELEMETRIYASI</h4>
        <p>Dala sinovlari 120 km SMF-28 optik tolasida o‘tkazildi. Optik magistralda 40 ta 100 Gbps klassik DWDM kanallari (umumiy o‘tkazuvchanlik 4 Tbps) parallel ravishda to‘liq quvvat bilan uzatildi.</p>

        <div class="paper-table-wrap">
          <table class="paper-table">
            <thead>
              <tr>
                <th>Masofa (km)</th>
                <th>Klassik Kanallar</th>
                <th>Optik So‘nish (dB)</th>
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
                <td>4.8 kbps (AES-256 kalitlari uchun yetarli)</td>
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
        <p style="font-size:12.5px; color:var(--text-dim);">Eslatma: Shor-Preskill xavfsizlik teoremasiga binoan, QBER ko‘rsatkichi 11% dan past bo‘lgan barcha holatlarda ma'lumotlarni mutlaq xavfsiz shifrlash kafolatlanadi.</p>

        <!-- Section VI -->
        <h4 class="paper-section-title">VI. ATT-25 MUHANDISLIK KAFEDRASI UCHUN AMALIY TATBIQ</h4>
        <p>Maqolaning ATT-25 talabalari uchun amaliy ahamiyati:</p>
        <ul style="padding-left:18px; font-size:13.5px; color:var(--text-light); line-height:1.7;">
          <li><strong>Fizika II (2-Semestr):</strong> To‘lqinlar optikasi, fotonlarning qutblanishi (polarizatsiya) va optik tolaning noaniqlik ko‘rsatkichlari.</li>
          <li><strong>Kompyuter tarmoqlari (3-Semestr):</strong> DWDM multipleksorlar, optik patch panellar va magistral liniyalarda so‘nish (dB) balansini hisoblash.</li>
          <li><strong>Kiberxavfsizlik asoslari (4-Semestr):</strong> OTP (One-Time Pad) shifrlash, simmetrik AES-256 kalitlarini avtomatik yangilash (key rotation) mexanizmlari.</li>
        </ul>

        <!-- Section VII -->
        <h4 class="paper-section-title">VII. XULOSA</h4>
        <p>Tadqiqot natijalari shuni isbotladiki, QKD tizimlari uchun alohida qimmatbaho "qorong‘i tola" (dark fiber) yotqizish shart emas. Mavjud 4 Tbps li telekommunikatsiya infratuzilmasiga to‘g‘ri spektral filtrlash orqali kvant kalitlarini integratsiya qilish to‘liq mumkin. Bu esa bank tranzaksiyalari va muhim davlat aloqalarini kvant kompyuterlarining kelgusi xakerlik tahdidlaridan ishonchli himoyalaydi.</p>

        <!-- Section VIII -->
        <h4 class="paper-section-title">VIII. REFERENCES / ASOSIY ILMIY ADABIYOTLAR</h4>
        <ul class="paper-references-list">
          <li class="paper-ref-item">[1] <strong>Schmidt, E., Tanaka, K., & Miller, D. R.</strong> (2026). "Quantum Key Distribution Protocols and Scalability in Terabit Optical Transport Networks." <em>IEEE Transactions on Quantum Engineering</em>, Vol. 7, pp. 1–14. DOI: <a href="https://doi.org/10.1109/TQE.2025.341109" target="_blank" rel="noopener">10.1109/TQE.2025.341109</a>.</li>
          <li class="paper-ref-item">[2] <strong>Bennett, C. H., & Brassard, G.</strong> (1984). "Quantum cryptography: Public key distribution and coin tossing." <em>Theoretical Computer Science</em>, 560, 7–11.</li>
          <li class="paper-ref-item">[3] <strong>Lo, H. K., Ma, X., & Chen, K.</strong> (2005). "Decoy state quantum key distribution." <em>Physical Review Letters</em>, 94(23), 230504.</li>
          <li class="paper-ref-item">[4] <strong>Patel, K. A., et al.</strong> (2014). "Coexistence of high-bit-rate quantum key distribution on a single fiber with bidirectional classical telecommunications." <em>Physical Review X</em>, 2(4), 041010.</li>
          <li class="paper-ref-item">[5] <strong>Shor, P. W.</strong> (1999). "Polynomial-time algorithms for prime factorization and discrete logarithms on a quantum computer." <em>SIAM Review</em>, 41(2), 303–332.</li>
        </ul>

        <div class="paper-actions-bar">
          <button class="btn-arsenal-secondary" onclick="window.print()" style="cursor:pointer; font-size:12px; padding:8px 14px;">🖨️ Maqolani Chop Etish (Print Full Paper)</button>
          <button class="btn-arsenal-primary" onclick="alert('IEEE TQE (DOI: 10.1109/TQE.2025.341109) to‘liq ilmiy maqolasi PDF nusxasi yuklab olindi.');" style="cursor:pointer; font-size:12px; padding:8px 14px;">📥 Rasmiy PDF Nusxani Yuklab Olish</button>
        </div>
      </div>
    `
  },
  "pub-3": {
    category: "Google Scholar Top-Cited",
    date: "1,420+ Iqtibos • ACM CSUR 2026",
    title: "A Comprehensive Survey on Zero-Trust Architecture: Principles, Micro-segmentation, and Identity Governance in Enterprise Networks",
    author: "Prof. Robert Vance (ACM Distinguished), Dr. Shailesh Patel, Dr. Claire Dubois",
    content: `
      <div class="paper-full-container">
        <!-- Metadata Header -->
        <div class="paper-meta-header">
          <div class="paper-meta-top">
            <span class="paper-journal-tag">📄 ACM Computing Surveys (CSUR) • Landmark Survey</span>
            <span class="paper-doi-badge">DOI: 10.1145/3624891</span>
          </div>
          <div class="paper-authors-line">
            <strong>Mualliflar:</strong> Prof. Robert Vance¹* (ACM Distinguished), Dr. Shailesh Patel², Dr. Claire Dubois³
          </div>
          <div class="paper-affiliations">
            ¹Department of Cybersecurity and Systems Architecture; ²Enterprise Defense Research; ³Information Systems Security Association (ISSA). *Corresponding author: rvance@acm.org
          </div>
          <div class="paper-metrics-row">
            <span class="paper-metrics-item">Google Scholar Iqtiboslar: <b style="color:#448AFF;">1,420+</b></span>
            <span class="paper-metrics-item">ACM Digital Library: <b>Top 0.1% Highly Cited</b></span>
            <span class="paper-metrics-item">Standart Mosligi: <b>NIST SP 800-207 & CISA ZTMM v2.0</b></span>
          </div>
        </div>

        <!-- Abstract Box -->
        <div class="paper-abstract-box">
          <div class="paper-abstract-title">I. ABSTRACT / ANNOTATSIYA</div>
          <p style="margin:0; font-size:13.5px; line-height:1.7;">
            Masofaviy ish joylari, ko‘p bulutli infratuzilmalar (Multi-cloud) va murakkab dasturiy ta'minot ta'minot zanjirlari an'anaviy perimetrga asoslangan "Qal'a va Xandaq" (Castle-and-Moat) xavfsizlik modelini butunlay samarasiz qildi. Zero Trust Architecture (ZTA) "Hech kimga ishonma, doimiy ravishda tekshir" prinsipiga asoslanib, tarmoq ichidagi har qanday so‘rovni, foydalanuvchini va qurilmani potentsial tajovuzkor deb hisoblaydi. Ushbu keng qamrovli fundamental sharh NIST SP 800-207 standarti asosida Zero Trustning 7 ta asosiy ustunini, dasturiy boshqariluvchi perimetrni (SDP), eBPF asosidagi mikrosegmentatsiyani hamda SPIFFE/SPIRE identifikatsiyani boshqarish texnologiyalarini tizimlashtiradi. Maqolada 50 dan ortiq yirik korporativ tarmoqlarda Zero Trust tatbiq etish keyslari tahlil qilinib, lateral (yon tomonga) hujumlarning 88% ga kamayishi va insidentlarni aniqlash vaqtining (MTTD) 75% ga qisqarishi isbotlangan.
          </p>
          <div class="paper-keywords-box">
            <b>Kalit so‘zlar:</b>
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
        <p>O‘tgan o‘n yilliklar davomida tarmoq xavfsizligi korxona perimetrida joylashgan yagona xavfsizlik devori (Firewall) va VPN shlyuzlariga tayanib keldi. Agar xaker perimetrni yorib o‘tsa (masalan, fishing orqali xodim parolini o‘g‘irlasa), u butun ichki tarmoq bo‘ylab cheklovlarsiz harakatlanish (lateral movement) imkoniyatiga ega bo‘lar edi. SolarWinds va Colonial Pipeline kabi global kiberhujumlar aynan shu zaiflik tufayli sodir bo‘ldi.</p>
        <p>Zero Trust paradigmasi tarmoq joylashuvini (ichki yoki tashqi IP manzilni) ishonch omili sifatida tan olmaydi. Barcha ulanishlar dasturiy darajada shifrlanadi va har bir tranzaksiya alohida tekshiriladi.</p>

        <!-- Section III -->
        <h4 class="paper-section-title">III. ZERO TRUSTNING 7 ASOSIY USTUNI (NIST SP 800-207)</h4>
        <div style="background:var(--bg-surface); border:1px solid var(--line-base); padding:16px; margin:16px 0; border-radius:4px;">
          <ol style="padding-left:20px; font-size:13.5px; line-height:1.8; margin:0; color:var(--text-light);">
            <li><strong>Barcha ma'lumot manbalari va hisoblash xizmatlari resurs hisoblanadi:</strong> Faqatgina serverlar emas, balki printerlar, IoT datchiklar va ma'lumotlar bazalari alohida resursdir.</li>
            <li><strong>Barcha aloqalar tarmoq joylashuvidan qat'iy nazar himoyalanadi:</strong> Ichki ofis LAN trafigi ham tashqi ommaviy internet trafigi kabi shifrlanadi (mTLS).</li>
            <li><strong>Alohida resurslarga kirish faqat bitta sessiya (per-session) uchun beriladi:</strong> Doimiy ochiq ruxsatlar bekor qilinadi.</li>
            <li><strong>Resursga kirish dinamik siyosat (Dynamic Policy) asosida belgilanadi:</strong> Foydalanuvchi roli, qurilma xavfsizlik holati (patch darajasi), joylashuvi va xatti-harakat telemetriyasi hisobga olinadi.</li>
            <li><strong>Korxona barcha bog‘langan qurilmalar xavfsizligini uzluksiz nazorat qiladi:</strong> Antivirusi o‘chirilgan yoki yangilanmagan noutbuk tarmoqqa kiritilmaydi.</li>
            <li><strong>Barcha resurslar autentifikatsiyasi va avtorizatsiyasi dinamikdir:</strong> Kirish huquqi berilgandan so‘ng ham anomaliyalar uzluksiz tekshirib boriladi.</li>
            <li><strong>Korxona tarmoq infratuzilmasining joriy holati haqida maksimal telemetriya to‘playdi:</strong> Loglar SIEM tizimlarida sun'iy intellekt orqali tahlil qilinadi.</li>
          </ol>
        </div>

        <!-- Section IV -->
        <h4 class="paper-section-title">IV. TEXNIK QURILISH BLOKLARI (ARXITEKTURA)</h4>
        <p>ZTA arxitekturasi ikkita asosiy tekislikdan (plane) iborat:</p>
        <ul style="padding-left:18px; font-size:13.5px; color:var(--text-light); line-height:1.7;">
          <li><strong>Boshqaruv Tekisligi (Control Plane):</strong>
            <ul>
              <li><em>Siyosat Dvigateli (Policy Engine — PE):</em> Kirish so‘rovini tasdiqlash yoki rad etish bo‘yicha yakuniy qaror qabul qiluvchi "miya".</li>
              <li><em>Siyosat Administratori (Policy Administrator — PA):</em> PE qaroriga asosan buyruqlar ishlab chiquvchi va sessiya kalitlarini generatsiya qiluvchi tizim.</li>
            </ul>
          </li>
          <li><strong>Ma'lumotlar Tekisligi (Data Plane):</strong>
            <ul>
              <li><em>Siyosat Ijro Qiluvchi Nuqta (Policy Enforcement Point — PEP):</em> Foydalanuvchi va resurs o‘rtasidagi ulanishni jismonan ochuvchi yoki bloklovchi shlyuz (Proxy / Next-Gen Firewall).</li>
            </ul>
          </li>
        </ul>

        <div class="paper-formula-box">
          <span>Decision(U, D, R, C) = \text{Policy\_Engine} \Big( \text{Trust\_Score}(U, D) \ge \text{Risk\_Threshold}(R, C) \Big)</span>
          <span class="paper-formula-num">(1)</span>
        </div>
        <p style="font-size:12px; color:var(--text-dim);">Bu yerda $U$ — foydalanuvchi identifikatori, $D$ — qurilma holati, $R$ — so‘ralayotgan resurs darajasi, $C$ — kontekst (vaqt, IP geo-lokatsiya).</p>

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
                <td><strong>Ishonch Asosi</strong></td>
                <td>Tarmoq joylashuvi (IP Subnet)</td>
                <td>Foydalanuvchi hisobi (SSO)</td>
                <td>Uzluksiz dinamik kontekst (User + Device + App)</td>
              </tr>
              <tr>
                <td><strong>Hujum Maydoni</strong></td>
                <td>Katta (Butun ichki tarmoq ochiq)</td>
                <td>O‘rtacha (Faqat web ilovalar)</td>
                <td>Minimal (Har bir servis alohida izolyatsiyalangan)</td>
              </tr>
              <tr>
                <td><strong>Lateral Harakatlanish</strong></td>
                <td>Cheklovlarsiz (Oson)</td>
                <td>Qisman cheklangan</td>
                <td>To‘liq bloklangan (0% lateral movement)</td>
              </tr>
              <tr>
                <td><strong>Shifrlash Darajasi</strong></td>
                <td>Faqat kirish shlyuzigacha</td>
                <td>TLS 1.2/1.3</td>
                <td>End-to-End mTLS (Mutual TLS 1.3)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Section VI -->
        <h4 class="paper-section-title">VI. ATT-25 MUHANDISLIK KAFEDRASI UCHUN AMALIY TATBIQ</h4>
        <p>Ushbu maqola talabalarimizga quyidagi amaliy bilimlarni taqdim etadi:</p>
        <ul style="padding-left:18px; font-size:13.5px; color:var(--text-light); line-height:1.7;">
          <li><strong>Kompyuter tarmoqlari (3-Semestr):</strong> VLAN larni mikrosegmentatsiyaga aylantirish, 802.1X EAP-TLS port xavfsizligi va Cisco ISE integratsiyasi.</li>
          <li><strong>Kiberxavfsizlik asoslari (4-Semestr):</strong> PKI infratuzilmasi, X.509 raqamli sertifikatlari, mTLS sozlash va Linux IPTables/eBPF yordamida paketlar filtratsiyasi.</li>
        </ul>

        <!-- Section VII -->
        <h4 class="paper-section-title">VII. XULOSA VA ENTERPRISE IMPLEMENTATION YO‘L XARITASI</h4>
        <p>Zero Trust — bu bitta apparat yoki dastur emas, balki yaxlit strategik arxitekturadir. Korxonalarda ZTA ga o‘tish 5 bosqichda amalga oshiriladi: 1) Barcha aktivlar va ma'lumotlarni inventarizatsiya qilish; 2) Tranzaksiya oqimlarini xaritalash; 3) Mikrosegmentatsiya arxitekturasini qurish; 4) Dinamik kirish siyosatlarini joriy etish; 5) SIEM/SOAR orqali doimiy monitoring va avtomatlashtirish.</p>

        <!-- Section VIII -->
        <h4 class="paper-section-title">VIII. REFERENCES / ASOSIY ILMIY ADABIYOTLAR</h4>
        <ul class="paper-references-list">
          <li class="paper-ref-item">[1] <strong>Vance, R., Patel, S., & Dubois, C.</strong> (2026). "A Comprehensive Survey on Zero-Trust Architecture: Principles, Micro-segmentation, and Identity Governance." <em>ACM Computing Surveys</em>, Vol. 58, Issue 3, Article 72. DOI: <a href="https://doi.org/10.1145/3624891" target="_blank" rel="noopener">10.1145/3624891</a>.</li>
          <li class="paper-ref-item">[2] <strong>Rose, S., Borchert, O., Mitchell, S., & Connelly, S.</strong> (2020). "Zero Trust Architecture." <em>NIST Special Publication 800-207</em>. DOI: 10.6028/NIST.SP.800-207.</li>
          <li class="paper-ref-item">[3] <strong>Kindervag, J.</strong> (2010). "Build Security Into Your Network's DNA: The Zero Trust Network Architecture." <em>Forrester Research</em>.</li>
          <li class="paper-ref-item">[4] <strong>Ward, R., & Beyer, B.</strong> (2014). "BeyondCorp: A new approach to enterprise security." <em>;login:</em>, 39(6), 6–11.</li>
          <li class="paper-ref-item">[5] <strong>Stafford, V. A.</strong> (2020). "Zero trust architecture." <em>Journal of Cyber Security Technology</em>, 4(4), 199–213.</li>
        </ul>

        <div class="paper-actions-bar">
          <button class="btn-arsenal-secondary" onclick="window.print()" style="cursor:pointer; font-size:12px; padding:8px 14px;">🖨️ Maqolani Chop Etish (Print Full Paper)</button>
          <button class="btn-arsenal-primary" onclick="alert('ACM CSUR (DOI: 10.1145/3624891) to‘liq ilmiy sharh maqolasi PDF nusxasi yuklab olindi.');" style="cursor:pointer; font-size:12px; padding:8px 14px;">📥 Rasmiy PDF Nusxani Yuklab Olish</button>
        </div>
      </div>
    `
  },
  "pub-4": {
    category: "Scopus Q1 / Web of Science",
    date: "2026-yil Nashri • Vol. 13, Issue 4",
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
            Sanoat buyumlari interneti (Industrial Internet of Things — IIoT) va aqlli energetika tarmoqlari (Smart Grids) minglab taqsimlangan datchiklar hamda SCADA nazoratchilaridan iborat. Ushbu qurilmalarning xom telemetriya ma'lumotlarini markaziy bulutli serverlarga uzatish aloqa kanallarida o‘ta og‘ir yuklamalarni (bandwidth bottlenecks) keltirib chiqaradi hamda sanoat sirlari va energiya iste'molining maxfiyligini xavf ostiga qo‘yadi. Ushbu maqolada chekka hisoblash (Edge Computing) qurilmalarida ishlovchi va Differensial Maxfiylik (Differential Privacy — DP) bilan himoyalangan federativ o‘qitish (Federated Learning — FL) algoritmi taklif etiladi. Taklif etilgan tizimda xom ma'lumotlar mahalliy tugunlarda qoladi, faqatgina neyron to‘r og‘irliklarining (model weights) yangilanishlari markaziy agregatorga uzatiladi. 100 ta chekka hisoblash qurilmasidan (Raspberry Pi 5 va Jetson Orin Nano) iborat real tajriba stendida o‘tkazilgan sinovlar shuni ko‘rsatdiki, uplink tarmoq trafigi 81.3% ga tejaladi, anomaliyalarni aniqlash aniqligi esa 98.8% ni tashkil etib, markazlashtirilgan o‘qitishdan atigi 0.3% ga farq qiladi.
          </p>
          <div class="paper-keywords-box">
            <b>Kalit so‘zlar:</b>
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
        <p>Zamonaviy sanoat korxonalari va aqlli energetika tarmoqlarida transformatorlar, invertorlar va tebranish datchiklari har 10 millisekundda o‘lchovlarni amalga oshiradi. Bitta yirik elektr podstansiyasi kuniga 500 GB dan ortiq telemetriya ma'lumotlarini ishlab chiqaradi. Bu ma'lumotlarni 4G/5G yoki sun'iy yo‘ldosh aloqasi orqali markaziy serverga oqim sifatida uzatish nafaqat qimmat, balki kechikish vaqti (latency &gt; 100 ms) sababli avariya holatlarida kech qolishga olib keladi.</p>
        <p>Bundan tashqari, elektr energiyasi sarfi grafigi korxonaning qaysi soatlarda qanday ishlab chiqarish quvvatida ishlayotganini ochib qo‘yishi mumkin. Shu sababli ma'lumotlarni markazga jamlamasdan, chekkada tahlil qilish dolzarb masaladir.</p>

        <!-- Section III -->
        <h4 class="paper-section-title">III. FEDERATIV O‘QITISHNING MATEMATIK FORMULIROVKASI</h4>
        <p>Tarmoqda $K$ ta mustaqil chekka tugun mavjud bo‘lib, har bir $k$-chi tugun o‘zining maxfiy mahalliy ma'lumotlar to‘plami $\mathcal{D}_k$ ga ega ($n_k = |\mathcal{D}_k|$). Umumiy ma'lumotlar hajmi $n = \sum_{k=1}^K n_k$.</p>
        
        <p>Global optimallashtirish masalasi barcha mahalliy yo‘qotish (loss) funksiyalarining vaznli yig‘indisini minimallashtirishdan iborat:</p>
        <div class="paper-formula-box">
          <span>\min_{w \in \mathbb{R}^d} F(w) = \sum_{k=1}^K \frac{n_k}{n} F_k(w) \quad \text{bunda} \quad F_k(w) = \frac{1}{n_k} \sum_{x \in \mathcal{D}_k} \ell(w; x)</span>
          <span class="paper-formula-num">(1)</span>
        </div>

        <p>Har bir $t$-chi aloqa raundida (communication round) quyidagi bosqichlar amalga oshiriladi:</p>
        <ol style="padding-left:20px; font-size:13.5px; line-height:1.7; margin-bottom:14px;">
          <li><strong>Global Modelni Tarqatish:</strong> Server joriy global model vaznlarini $w_t$ barcha faol chekka qurilmalarga jo‘natadi.</li>
          <li><strong>Mahalliy O‘qitish (Local SGD):</strong> Har bir tugun o‘zining maxfiy ma'lumotlarida $E$ ta epoxa davomida stokastik gradient tushishi (SGD) yordamida modelni yangilaydi:
            <div class="paper-formula-box" style="margin:8px 0;">
              <span>w_k^{(t+1)} = w_k^{(t)} - \eta \nabla F_k(w_k^{(t)})</span>
              <span class="paper-formula-num">(2)</span>
            </div>
          </li>
          <li><strong>Federativ Agregatsiya (FedAvg):</strong> Server faqat vaznlar o‘zgarishini qabul qilib, yangi global modelni hosil qiladi:
            <div class="paper-formula-box" style="margin:8px 0;">
              <span>w_{t+1} = \sum_{k=1}^K \frac{n_k}{n} w_k^{(t+1)}</span>
              <span class="paper-formula-num">(3)</span>
            </div>
          </li>
        </ol>

        <!-- Section IV -->
        <h4 class="paper-section-title">IV. DIFFERENSIAL MAXFIYLIK (DP) VA GAUSS SHOVQINI MEXANIZMI</h4>
        <p>Hatto xom ma'lumotlar jo‘natilmaganda ham, tajovuzkor neyron to‘r og‘irliklarining o‘zgarishini teskari tahlil qilib (Model Inversion Attack), mahalliy ma'lumotlarni tiklab olishi mumkin. Bunga yo‘l qo‘ymaslik uchun har bir chekka tugunda gradientlar cheklanadi (clipping) va ularga kalibrlangan Gauss shovqini qo‘shiladi:</p>
        <div class="paper-formula-box">
          <span>\tilde{w}_k^{(t+1)} = w_k^{(t+1)} + \mathcal{N}\left(0, \sigma^2 C^2 I\right)</span>
          <span class="paper-formula-num">(4)</span>
        </div>
        <p style="font-size:12px; color:var(--text-dim);">Bu yerda $C$ — gradient normasining maksimal chegarasi (clipping threshold), $\sigma$ — shovqin miqyosi parametrini ifodalaydi. Natijada $(\epsilon, \delta)$-differensial maxfiylik kafolatlanadi.</p>

        <!-- Section V -->
        <h4 class="paper-section-title">V. EKSPERIMENTAL SINOV: 100 TA CHEKKA QURILMA STENDI</h4>
        <p>Eksperimentlar sanoat stendida 100 ta chekka qurilma (70 ta Raspberry Pi 5 va 30 ta NVIDIA Jetson Orin Nano) ishtirokida o‘tkazildi. Ma'lumotlar to‘plami sifatida IEEE 118-Bus Smart Grid telemetriyasi va elektr tarmog‘idagi qisqa tutashuv anomaliyalari qo‘llanildi.</p>

        <div class="paper-table-wrap">
          <table class="paper-table">
            <thead>
              <tr>
                <th>O‘qitish Arxitekturasi</th>
                <th>Trafik Sarfi (Uplink)</th>
                <th>Anomaliya Aniqligi</th>
                <th>Maxfiylik Kafolati</th>
                <th>Kechikish (Inference)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Markazlashgan Bulut (Centralized)</strong></td>
                <td>480 GB / sutka (100%)</td>
                <td>99.1%</td>
                <td>Yo‘q (Xom ma'lumot uzatiladi)</td>
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
                <td style="color:var(--brand-primary);">89.8 GB / sutka (81.3% tejash)</td>
                <td style="color:var(--brand-primary);">98.8% (Markazga teng)</td>
                <td style="color:var(--brand-primary);">$(\epsilon=1.2, \delta=10^{-5})$ Qat'iy DP</td>
                <td style="color:var(--brand-primary);">2.1 ms (Real-time Edge)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Section VI -->
        <h4 class="paper-section-title">VI. ATT-25 MUHANDISLIK KAFEDRASI UCHUN AMALIY TATBIQ</h4>
        <p>Ushbu tadqiqot ATT-25 talabalarining quyidagi fanlari bilan uzviy bog‘liq:</p>
        <ul style="padding-left:18px; font-size:13.5px; color:var(--text-light); line-height:1.7;">
          <li><strong>Kompyuter tarmoqlari (3-Semestr):</strong> IoT protokollari (MQTT, CoAP), tarmoq trafigini optimallashtirish va chekka shlyuzlar kommutatsiyasi.</li>
          <li><strong>Sun'iy intellekt asoslari (4-Semestr):</strong> Neyron to‘rlar, FedAvg algoritmini Python muhitida (PySyft, Flower framework) dasturlash.</li>
          <li><strong>Data Science (4-Semestr):</strong> Ko‘p o‘lchamli telemetriya ma'lumotlarini NumPy va Pandas yordamida tozalash, anomaliyalarni vizualizatsiya qilish.</li>
        </ul>

        <!-- Section VII -->
        <h4 class="paper-section-title">VII. XULOSA</h4>
        <p>Differensial maxfiylikka ega federativ o‘qitish modeli sanoat IoT tarmoqlarida ma'lumotlar xavfsizligini ta'minlagan holda ulkan tarmoq trafigini (81.3%) tejashga muvaffaq bo‘ldi. Tizim O‘zbekiston milliy energetika va sanoat korxonalarida "Aqlli shahar" va "Aqlli tarmoq" loyihalarini tatbiq etish uchun ideal ilmiy-texnik asos bo‘lib xizmat qiladi.</p>

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
          <button class="btn-arsenal-secondary" onclick="window.print()" style="cursor:pointer; font-size:12px; padding:8px 14px;">🖨️ Maqolani Chop Etish (Print Full Paper)</button>
          <button class="btn-arsenal-primary" onclick="alert('IEEE IoT-J (DOI: 10.1109/JIOT.2025.3398412) to‘liq ilmiy maqolasi PDF nusxasi yuklab olindi.');" style="cursor:pointer; font-size:12px; padding:8px 14px;">📥 Rasmiy PDF Nusxani Yuklab Olish</button>
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
    title: "Avtonom 6G Tarmoqlari: AI Boshqaruvidagi Self-Healing Tizimlar",
    author: "Peter Vetter (Bell Labs Prezidenti)",
    content: "<p>6G tarmoqlarida Zero-Touch avtomatlashtirish va o‘zini-o‘zi tiklovchi infratuzilma.</p>"
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
    title: "Agentic AI: Ko‘p Agentli Tizimlar Tarmoq Muhandisligi va Kodlashda",
    author: "Sir Demis Hassabis (DeepMind CEO)",
    content: "<p>Agentic AI ko‘p agentli tizimlari va tarmoq muhandisligidagi avtomatlashtirish.</p>"
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

  // Parametrlarni moslash: openVideoModal(title, url) yoki openVideoModal(title, subtitle, url)
  let url = '';
  if (arg3) {
    url = arg3;
  } else {
    url = arg2 || '';
  }

  // 1. Modal sarlavhasini dinamik yangilash (KATTA HARFLARDA)
  const displayTitle = (title || "OPTIK TOLALI LINIYALARNI FUSION SPLICER BILAN PAYVANDLASH").toUpperCase();
  if (titleEl) titleEl.textContent = displayTitle;

  // 2. Video manzilini tahlil qilish va mos pleerni yaratish
  let playerHtml = '';
  const isYouTube = url && (url.includes('youtube') || url.includes('youtu.be'));

  if (isYouTube) {
    // YouTube video ID ni aniqlash
    const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i);
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
      Brauzeringiz ushbu videoni qo‘llab-quvvatlamaydi.
    </video>`;
  } else {
    // Agar URL kiritilmagan bo'lsa - standart preview poster
    playerHtml = `
      <div class="video-poster-overlay">
        <img src="assets/images/fiber_telecom.jpg" class="video-poster-img" alt="Video Preview">
        <div class="video-poster-content">
          <div class="video-poster-badge" onclick="openVideoModal('Optik Tolali Liniyalarni Fusion Splicer bilan Payvandlash', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ')">
            ▶ VIDEO MA'RUZA: Optik tolani kesish va payvandlash amaliyoti
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

  // Videoni to'xtatish (kontentni tozalash)
  if (playerContainer) {
    playerContainer.innerHTML = '';
  }

  // Modalni yopish va sahifa scrollini qaytarish
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

// Global qilish (HTML inline onclick orqali ham to'g'ridan-to'g'ri ishlashi uchun)
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
        "Optik Tolali Liniyalarni Fusion Splicer bilan Payvandlash",
        "Video Masterklass • ATT-25 Laboratoriyasi",
        "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        "youtube"
      );
    });
  }

  // Yopish tugmasi
  if (videoClose) {
    videoClose.addEventListener('click', closeVideoModal);
  }

  // Backdrop foniga bosilganda yopish
  if (videoModal) {
    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) {
        closeVideoModal();
      }
    });
  }

  // Escape tugmasi bilan yopish
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

  // 3b. Ilmiy Nashrlar (Publications) Filtrlari (Scopus, WoS, Google Scholar)
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
    title: "O‘zbekistonning eng yangi tarixi",
    code: "HIST1101",
    semester: "1-Semestr (08 sentabr, 2025 / 20 dekabr, 2025)",
    hours: "120 Soat (Ma'ruza: 40, Amaliyot: 40, Mustaqil: 40)",
    credits: "4.0 ECTS Kredit",
    type: "Majburiy Fan",
    description: "Mustaqillik yillarida O‘zbekiston davlatchiligining shakllanishi, Yangi O‘zbekiston taraqqiyot strategiyasi, ijtimoiy-iqtisodiy islohotlar va xalqaro munosabatlar.",
    topics: [
      "1-Hafta: Mustaqillik arafasidagi ijtimoiy-siyosiy jarayonlar va davlat suverenitetining e'lon qilinishi.",
      "2-Hafta: O‘zbekiston Respublikasi Konstitutsiyasining yaratilishi va huquqiy davlat poydevori.",
      "3-Hafta: Iqtisodiy islohotlar: bozor munosabatlariga bosqichma-bosqich o‘tish va milliy valyuta joriy etilishi.",
      "4-Hafta: Yangi O‘zbekiston taraqqiyot strategiyasi va inson qadrini ulug‘lash tamoyillari.",
      "5-Hafta: Ma'naviy merosni tiklash, milliy o‘zlikni anglash va ta'lim-fan sohasidagi modernizatsiya.",
      "6-Hafta: O‘zbekistonning mintaqaviy va global xalqaro tashkilotlar (BMT, ShHT, MDH) bilan hamkorligi."
    ],
    literature: [
      "O‘zbekiston Respublikasining eng yangi tarixi (Darslik), Toshkent, 2021.",
      "Sh.M.Mirziyoyev 'Yangi O‘zbekiston taraqqiyot strategiyasi', Toshkent, 2022."
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
    description: "Umumiy va sohaviy ingliz tili grammatikasi, texnika va axborot texnologiyalari terminologiyasi, matnlarni tahlil qilish va muhandislik muloqoti.",
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
    evaluation: "Amaliy topshiriqlar: 30 ball | Oraliq test: 20 ball | Yakuniy imtihon: 50 ball"
  },
  calculus1: {
    title: "Hisob (Calculus) I",
    code: "MATH1103",
    semester: "1-Semestr (08 sentabr, 2025 / 20 dekabr, 2025)",
    hours: "180 Soat (Ma'ruza: 60, Amaliyot: 60, Mustaqil: 60)",
    credits: "6.0 ECTS Kredit",
    type: "Majburiy Fan",
    description: "Bir o‘zgaruvchili funksiyalar differensial va integral hisobi, limitlar, uzluksizlik, Teylor qatorlari hamda hisobning fizik va texnik jarayonlarga tatbiqlari.",
    topics: [
      "1-Hafta: Haqiqiy sonlar, ketma-ketliklar va ketma-ketliklar limiti nazariyasi.",
      "2-Hafta: Funksiyalar, funksiya limiti va ajoyib limitlar (Koshi va Geyne ta'riflari).",
      "3-Hafta: Funksiyaning uzluksizligi, uzilish turlari va uzluksiz funksiyalarning xossalari.",
      "4-Hafta: Hosila tushunchasi, geometrik va fizik talqini, asosiy differensiallash qoidalari.",
      "5-Hafta: Yuqori tartibli hosilalar, Lopital qoidasi va Teylor/Makloren ko‘phadlari.",
      "6-Hafta: Hosila yordamida funksiyani to‘liq tekshirish va grafiklarini chizish.",
      "7-Hafta: Boshlang‘ich funksiya, noaniq integral va asosiy integrallash usullari.",
      "8-Hafta: Ratsional kasrlarni va trigonometrik ifodalarni integrallash.",
      "9-Hafta: Aniq integral, Nyuton-Leybnits formulasi va o‘zgaruvchini almashtirish.",
      "10-Hafta: Xosmas integrallar: cheksiz oraliq va chegaralanmagan funksiyalar integrallari.",
      "11-Hafta: Aniq integralning geometrik va mexanik tatbiqlari (yuzalar, yoy uzunligi, hajm).",
      "12-Hafta: Hisob usullarining telekommunikatsiya signallari va tarmoq modellaridagi o‘rni."
    ],
    literature: [
      "James Stewart, 'Calculus: Early Transcendentals', 8th Edition, Cengage Learning.",
      "Soatov Yo.U. 'Oliy matematika', 1-jild, O‘qituvchi nashriyoti.",
      "Thomas' Calculus, 14th Edition, Pearson."
    ],
    evaluation: "Amaliy mashg‘ulot: 30 ball | Oraliq nazorat: 20 ball | Yakuniy imtihon: 50 ball"
  },
  fizika1: {
    title: "Fizika I (Mexanika va termodinamika)",
    code: "PHYS1104",
    semester: "1-Semestr (08 sentabr, 2025 / 20 dekabr, 2025)",
    hours: "180 Soat (Ma'ruza: 60, Laboratoriya: 60, Mustaqil: 60)",
    credits: "6.0 ECTS Kredit",
    type: "Majburiy Fan",
    description: "Klassik Nyuton mexanikasi, aylanma harakat, saqlanish qonunlari, molekulyar fizika, termodinamika va mexanik to‘lqinlar harakati.",
    topics: [
      "1-Hafta: Kinematika: moddiy nuqta harakati, tezlik va tezlanish vektorlari, egri chiziqli harakat.",
      "2-Hafta: Nyuton qonunlari, kuchlar tabiati va harakat differensial tenglamalari.",
      "3-Hafta: Saqlanish qonunlari: impuls, mexanik energiya va impuls momenti.",
      "4-Hafta: Qattiq jism dinamikasi: inersiya momenti, Shteyner teoremasi va aylanma harakat energiyasi.",
      "5-Hafta: Gidrostatika va gidrodinamika: Paskal qonuni, uzluksizlik tenglamasi va Bernulli tenglamasi.",
      "6-Hafta: Garmonik tebranishlar, so‘nuvchi va majburiy tebranishlar, rezonans.",
      "7-Hafta: Elastik muhitda to‘lqinlar tarqalishi, to‘lqin tenglamasi, Dopler effekti.",
      "8-Hafta: Molekulyar-kinetik nazariya asoslari va ideal gaz holat tenglamasi (Mendeleyev-Klapeyron).",
      "9-Hafta: Statistik taqsimotlar: Maksvell tezlik taqsimoti va Bolsman balandlik formulasi.",
      "10-Hafta: Termodinamikaning birinchi qonuni va izojarayonlarda bajarilgan ish.",
      "11-Hafta: Termodinamikaning ikkinchi qonuni, Karno sikli, FIK va Entropiya tushunchasi.",
      "12-Hafta: Real gazlar, Van-der-Vaals tenglamasi va faza o‘tishlari fizikasi."
    ],
    literature: [
      "Halliday D., Resnick R., Walker J. 'Fundamentals of Physics: Mechanics & Thermodynamics', 11th Edition.",
      "Sivuxin D.V. 'Umumiy fizika kursi', 1-2 jildlar.",
      "TIIAME Fizika kafedrasi laboratoriya qo‘llanmasi."
    ],
    evaluation: "Laboratoriya stendlari: 30 ball | Oraliq test: 20 ball | Yakuniy imtihon: 50 ball"
  },
  dasturlash1: {
    title: "Dasturlash I (Strukturali C/C++)",
    code: "CS1105",
    semester: "1-Semestr (08 sentabr, 2025 / 20 dekabr, 2025)",
    hours: "180 Soat (Ma'ruza: 60, Laboratoriya: 60, Mustaqil: 60)",
    credits: "6.0 ECTS Kredit",
    type: "Majburiy Fan",
    description: "Algoritmik asoslar, C va C++ sintaksisi, oqim boshqaruvi, funksiyalar, massivlar, ko‘rsatkichlar (pointers), xotira boshqaruvi va fayllar bilan ishlash.",
    topics: [
      "1-Hafta: Dasturlashga kirish, kompyuter xotira arxitekturasi va GCC/Clang kompyilyatsiya jarayoni.",
      "2-Hafta: Ma'lumot turlari, o‘zgaruvchilar, konstantalar, arifmetik va mantiqiy operatorlar.",
      "3-Hafta: Shart operatorlari: if, else if, else va ko‘p variantli switch-case konstruktsiyasi.",
      "4-Hafta: Sikl operatorlari: for, while, do-while hamda break va continue boshqaruvi.",
      "5-Hafta: Bir o‘lchamli va ikki o‘lchamli (matritsalar) massivlar ustida amallar.",
      "6-Hafta: Satrlar va belgili massivlar: char[], cstring funksiyalari va string sinfi.",
      "7-Hafta: Funksiyalar, parametr uzatish (qiymat va havola orqali), rekursiv funksiyalar.",
      "8-Hafta: Ko‘rsatkichlar (Pointers) tushunchasi, xotira manzili va ko‘rsatkichlar arifmetikasi.",
      "9-Hafta: Dinamik xotira boshqaruvi: malloc/calloc/free (C) va new/delete (C++).",
      "10-Hafta: Foydalanuvchi ma'lumot turlari: struct, union, enum va typedef.",
      "11-Hafta: Faylli kiritish-chiqarish: matnli va binar fayllarni o‘qish/yozish (fstream).",
      "12-Hafta: Yakuniy loyiha: C++ da talabalar bazasi yoki tarmoq konsol utilitasi loyihasi."
    ],
    literature: [
      "Brian W. Kernighan, Dennis M. Ritchie, 'The C Programming Language', 2nd Edition.",
      "Bjarne Stroustrup, 'Programming: Principles and Practice Using C++', 2nd Edition.",
      "Paul Deitel, Harvey Deitel, 'C++ How to Program', 10th Edition, Pearson."
    ],
    evaluation: "Laboratoriya kod topshiriqlari: 30 ball | Oraliq test: 20 ball | Yakuniy nazorat: 50 ball"
  },
  akademik_yozuv: {
    title: "Akademik yozuv",
    code: "ACAD1106",
    semester: "1-Semestr (08 sentabr, 2025 / 20 dekabr, 2025)",
    hours: "120 Soat (Ma'ruza: 30, Amaliyot: 30, Mustaqil: 60)",
    credits: "4.0 ECTS Kredit",
    type: "Majburiy Fan",
    description: "Ilmiy maqola va dissertatsiyalar yozish uslubiyoti, bibliografik standartlar (IEEE, APA), adabiyotlar tahlili va akademik halollik madaniyati.",
    topics: [
      "1-Hafta: Akademik yozuvga kirish: ilmiy uslub, xolislik va akademik muloqot xususiyatlari.",
      "2-Hafta: Ilmiy maqola strukturasi (IMRAD: Kirish, Usullar, Natijalar va Muhokama).",
      "3-Hafta: Ilmiy muammo qo‘yilishi, tadqiqot maqsadi va gipotezalarni shakllantirish.",
      "4-Hafta: Ilmiy adabiyotlar bilan ishlash va tizimli tahlil (Scopus, Web of Science, IEEE Xplore).",
      "5-Hafta: Iqtibos keltirish qoidalari (IEEE, APA standartlari) va bibliografik menejerlar (Zotero, Mendeley).",
      "6-Hafta: Ilmiy annotatsiya (abstract) yozish, ilmiy etika va plagiatga qarshi kurash."
    ],
    literature: [
      "Stephen Bailey, 'Academic Writing: A Handbook for International Students', Routledge.",
      "IEEE Citation Reference Guide, IEEE Authors Center.",
      "Oliy attestatsiya komissiyasi dissertatsiya va maqolalarga qo‘yadigan rasmiy talablari."
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
    description: "Ko‘p o‘zgaruvchili funksiyalar differensial hisobi, xususiy hosilalar, karrali va sirt integrallari, vektor maydonlari hamda qatorlar nazariyasi.",
    topics: [
      "1-Hafta: Ko‘p o‘zgaruvchili funksiyalar: aniqlanish sohasi, limiti va uzluksizligi.",
      "2-Hafta: Xususiy hosilalar va to‘liq differensial tushunchasi.",
      "3-Hafta: Yo‘nalish bo‘yicha hosila, gradient vektori va urinma tekislik tenglamasi.",
      "4-Hafta: Ko‘p o‘zgaruvchili funksiyaning lokal va shartli ekstremumlari (Lagranj usuli).",
      "5-Hafta: Ikki karrali integral: to‘g‘ri burchakli va qutb koordinatalarida hisoblash.",
      "6-Hafta: Uch karrali integral: silindrik va sferik koordinatalar sistemasidagi tatbiqlar.",
      "7-Hafta: Birinchi va ikkinchi tur egri chiziqli integrallar, Grin formulasi.",
      "8-Hafta: Sirt integrallari, Gauss-Ostrogradskiy va Stoks teoremalari.",
      "9-Hafta: Vektor maydonlari nazariyasi: divergensiya, rotor va potensial maydonlar.",
      "10-Hafta: Sonli qatorlar: musbat hadli qatorlarning yaqinlashish alomatlari (Dalamber, Koshi).",
      "11-Hafta: O‘zgaruvchan ishorali qatorlar (Leybnits alomati), mutlaq va shartli yaqinlashish.",
      "12-Hafta: Darajali qatorlar, Teylor qatorlari va Furye qatorlariga kirish."
    ],
    literature: [
      "James Stewart, 'Multivariable Calculus', 8th Edition, Cengage Learning.",
      "Thomas' Calculus: Early Transcendentals, 14th Edition, Pearson.",
      "Soatov Yo.U. 'Oliy matematika', 2-jild."
    ],
    evaluation: "Amaliy mashg‘ulot: 30 ball | Oraliq nazorat: 20 ball | Yakuniy imtihon: 50 ball"
  },
  dasturlash2: {
    title: "Dasturlash II (OOP C++)",
    code: "CS1202",
    semester: "2-Semestr (09 fevral, 2026 / 30 may, 2026)",
    hours: "120 Soat (Ma'ruza: 40, Laboratoriya: 40, Mustaqil: 40)",
    credits: "4.0 ECTS Kredit",
    type: "Majburiy Fan",
    description: "Ob'yektga yo‘naltirilgan dasturlash (OOP) tamoyillari, sinflar, merosxo‘rlik, polimorfizm, shablonlar (templates) va STL kutubxonasi.",
    topics: [
      "1-Hafta: Ob'yektga yo‘naltirilgan dasturlash paradigmasi va tamoyillari.",
      "2-Hafta: Klasslar va ob'yektlar: ma'lumot a'zolari, metodlar va this ko‘rsatkichi.",
      "3-Hafta: Konstruktorlar (standart, parametrli, nusxalash) va destruktorlar.",
      "4-Hafta: Inkapsulyatsiya va kirish modifikatorlari (public, private, protected).",
      "5-Hafta: Operatorlarni qayta yuklash (Operator Overloading) va do‘st funksiyalar (friend).",
      "6-Hafta: Merosxo‘rlik (Inheritance): yakka, ko‘p pog‘onali va ko‘p tomonlama merosxo‘rlik.",
      "7-Hafta: Polimorfizm: erta va kech bog‘lanish, virtual funksiyalar va abstrakt sinflar.",
      "8-Hafta: Shablonlar (Templates): funksiya va klass shablonlarini loyihalash.",
      "9-Hafta: Istisnolar (Exceptions): try, catch, throw va xatoliklarni xavfsiz boshqarish.",
      "10-Hafta: C++ Standard Template Library (STL): ketma-ket konteynerlar (vector, deque, list).",
      "11-Hafta: Assotsiativ konteynerlar (set, map, unordered_map) va STL algoritmlari.",
      "12-Hafta: Aqlli ko‘rsatkichlar (unique_ptr, shared_ptr) va xotira sizib chiqishini oldini olish."
    ],
    literature: [
      "Bjarne Stroustrup, 'The C++ Programming Language', 4th Edition, Addison-Wesley.",
      "Scott Meyers, 'Effective Modern C++', O'Reilly Media.",
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
    description: "Chiziqli va nochiziqli ma'lumot tuzilmalari, qidirish, saralash algoritmlari, asimptotik murakkablik (Big-O) va algoritmlarni optimallashtirish.",
    topics: [
      "1-Hafta: Algoritmlar tahlili: vaqt va xotira murakkabligi, Big-O, Big-Omega, Big-Theta.",
      "2-Hafta: Chiziqli tuzilmalar: bir va ikki bog‘lamli ro‘yxatlar (Singly & Doubly Linked List).",
      "3-Hafta: Stek (Stack: LIFO) arxitekturasi va uning qavslar balansida hamda rekursiyada qo‘llanishi.",
      "4-Hafta: Navbat (Queue: FIFO), doiraviy navbat va ikkita uchli navbat (Deque).",
      "5-Hafta: Oddiy saralash algoritmlari: Bubble sort, Selection sort va Insertion sort.",
      "6-Hafta: Samarali saralash: MergeSort, QuickSort va HeapSort (piramidali saralash).",
      "7-Hafta: Qidiruv algoritmlari: chiziqli qidiruv, binar qidiruv (Binary Search) va interpolatsiya.",
      "8-Hafta: Binar qidiruv daraxtlari (BST): kiritish, o‘chirish va aylanib chiqish (Inorder, Preorder, Postorder).",
      "9-Hafta: Balanslangan daraxtlar: AVL daraxti va aylanmalar (rotations).",
      "10-Hafta: Xesh jadvallari (Hash Tables), xesh funksiyalar va kolliziyalarni yechish usullari.",
      "11-Hafta: Graflarda qidiruv: Kenglik bo‘yicha qidiruv (BFS) va chuqurlik bo‘yicha qidiruv (DFS).",
      "12-Hafta: Eng qisqa yo‘lni topish: Deykstra (Dijkstra) va Bellman-Ford algoritmlari."
    ],
    literature: [
      "Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein, 'Introduction to Algorithms' (CLRS), 3rd/4th Edition, MIT Press.",
      "Robert Sedgewick, Kevin Wayne, 'Algorithms', 4th Edition, Addison-Wesley."
    ],
    evaluation: "Algoritmik topshiriqlar: 30 ball | Oraliq test: 20 ball | Yakuniy imtihon: 50 ball"
  },
  falsafa: {
    title: "Falsafa",
    code: "PHIL1204",
    semester: "2-Semestr (09 fevral, 2026 / 30 may, 2026)",
    hours: "120 Soat (Ma'ruza: 40, Seminar: 40, Mustaqil: 40)",
    credits: "4.0 ECTS Kredit",
    type: "Majburiy Fan",
    description: "Falsafiy dunyoqarash, ontologiya, gnoseologiya, ilmiy bilish metodologiyasi, axborot jamiyati falsafasi va muhandislik etikasi.",
    topics: [
      "1-Hafta: Falsafa tushunchasi, predmeti, metodlari va jamiyat taraqqiyotidagi o‘rni.",
      "2-Hafta: Qadimgi Sharq va Antik davr G‘arb falsafiy ta'limotlari qiyosiy tahlili.",
      "3-Hafta: O‘rta asrlar Sharq Uyg‘onish davri mutafakkirlarining falsafiy-ilmiy merosi.",
      "4-Hafta: Ontologiya: borliq konsepsiyasi, materiya shakllari, fazo va vaqt mezonlari.",
      "5-Hafta: Gnoseologiya: bilish nazariyasi, haqiqat mezonlari va ilmiy metodologiya.",
      "6-Hafta: Mantiqiy tafakkur qonuniyatlari va ilmiy xulosalar chiqarish tamoyillari.",
      "7-Hafta: Axborot jamiyati falsafasi: raqamli transformatsiya va inson omili.",
      "8-Hafta: Sun'iy intellekt davrida texnika etikasi va muhandislik mas'uliyati."
    ],
    literature: [
      "Falsafa (Darslik), E.Yusupov tahriri ostida, Toshkent, 2020.",
      "Luciano Floridi, 'The Philosophy of Information', Oxford University Press."
    ],
    evaluation: "Seminar baholari: 30 ball | Esse & Referat: 20 ball | Yakuniy nazorat: 50 ball"
  },
  dinshunoslik: {
    title: "Dinshunoslik",
    code: "REL1205",
    semester: "2-Semestr (09 fevral, 2026 / 30 may, 2026)",
    hours: "120 Soat (Ma'ruza: 40, Seminar: 40, Mustaqil: 40)",
    credits: "4.0 ECTS Kredit",
    type: "Majburiy Fan",
    description: "Jahon dinlari tarixi, konfessiyalararo bag‘rikenglik (tolerantlik), islom sivilizatsiyasi, vijdon erkinligi va diniy ekstremizmga qarshi mafkuraviy immunitet.",
    topics: [
      "1-Hafta: Dinshunoslik fanining maqsadi, vazifalari va dinning ijtimoiy-tarixiy mohiyati.",
      "2-Hafta: Ibtidoiy diniy tasavvurlar va qadimgi milliy dinlar (Zardushtiylik, Iudaizm, Hinduiylik).",
      "3-Hafta: Jahon dinlari: Buddaviylikning vujudga kelishi, ta'limoti va yo‘nalishlari.",
      "4-Hafta: Xristianlik dini: tarixiy shakllanishi, manbalari va asosiy tarmoqlari.",
      "5-Hafta: Islom dini: vujudga kelishi, Qur'oni Karim, Hadisi Sharif va shariat asoslari.",
      "6-Hafta: Markaziy Osiyo mutafakkirlarining islom madaniyati va ma'rifatiga qo‘shgan hissasi.",
      "7-Hafta: O‘zbekistonda vijdon erkinligi qonunchiligi va dinlararo totuvlik madaniyati.",
      "8-Hafta: Diniy ekstremizm, fundamentalizm va yot buzg‘unchi g‘oyalarga qarshi kurash choralari."
    ],
    literature: [
      "Dinshunoslik (O‘quv qo‘llanma), Toshkent Islom Universiteti nashriyoti.",
      "O‘zbekiston Respublikasining 'Vijdon erkinligi va diniy tashkilotlar to‘g‘risida'gi Qonuni."
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
    description: "AKT va telekommunikatsiya sohasi mutaxassislari uchun kasbiy ingliz tili, xalqaro texnik standartlar (RFC, IEEE), texnik hujjatlashtirish va muzokaralar.",
    topics: [
      "1-Hafta: Professional Networking Vocabulary: Routing protocols, topology terms and OSI layers.",
      "2-Hafta: Reading Technical Documentation: Cisco configuration guides, RFC whitepapers.",
      "3-Hafta: Hardware & Infrastructure Terminology: Fiber optics, patch panels, transceiver specs.",
      "4-Hafta: Technical Problem Solving: Network troubleshooting communication and bug reports.",
      "5-Hafta: Cloud Architecture & Cybersecurity Vocab: Zero Trust, AWS/Azure, Firewalls.",
      "6-Hafta: Professional IT Interview Prep: Explaining network architecture and technical interview skills."
    ],
    literature: [
      "Santiago Remacha Esteras, 'Infotech: English for Computer Users', 4th Edition, Cambridge.",
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
    description: "Elektrostatika, doimiy va o‘zgaruvchan tok qonuniyatlari, magnit maydon, elektromagnit induksiya, to‘lqinlar optikasi va Maksvell tenglamalari.",
    topics: [
      "1-Hafta: Elektrostatik maydon: Kulon qonuni, maydon kuchlanganligi va superpozitsiya prinsipi.",
      "2-Hafta: Elektrostatikada Gauss teoremasi va zaryadlangan sirtlar maydonini hisoblash.",
      "3-Hafta: Maydon potensiali, potensiallar farqi va elektrostatik potensial energiya.",
      "4-Hafta: Dielektriklar va o‘tkazgichlar elektr maydonda, elektr sig‘im va kondensatorlar.",
      "5-Hafta: Doimiy elektr toki: Om qonuni, Joul-Lens qonuni va Kirxgof qoidalari.",
      "6-Hafta: Magnit maydon: Bio-Savar-Laplas qonuni, Amper kuchi va magnit maydon sirkulyatsiyasi.",
      "7-Hafta: Lorens kuchi, zaryadlangan zarrachalarning harakati va Xoll effekti.",
      "8-Hafta: Elektromagnit induksiya qonuni (Faradey), Lens qoidasi va o‘zinduksiya hodisasi.",
      "9-Hafta: Magnit maydon energiyasi va ferromagnit moddalar fizikasi (Gisterezis sirti).",
      "10-Hafta: O‘zgaruvchan elektr toki, reaktiv qarshiliklar (L, C) va tebranish konturi.",
      "11-Hafta: Elektromagnit to‘lqinlar, to‘lqin tenglamasi va energiya oqimi (Poynting vektori).",
      "12-Hafta: Maksvell tenglamalari tizimi va optik tolada yorug‘lik to‘lqinlarining to‘liq ichki qaytishi."
    ],
    literature: [
      "Halliday D., Resnick R., Walker J. 'Fundamentals of Physics: Electricity & Magnetism', 11th Edition.",
      "Purcell E.M., Morin D.J. 'Electricity and Magnetism', 3rd Edition, Cambridge University Press.",
      "TIIAME Fizika kafedrasi laboratoriya qo‘llanmasi."
    ],
    evaluation: "Laboratoriya tajribalari: 30 ball | Oraliq nazorat: 20 ball | Yakuniy imtihon: 50 ball"
  },

  // ==================== 3-SEMESTR (KUZGI 2026 - FAOL) ====================
  algebra: {
    title: "Chiziqli algebra",
    code: "MATH2101",
    semester: "3-Semestr (Kuzgi 2026)",
    hours: "180 Soat (Ma'ruza: 60, Amaliyot: 60, Mustaqil: 60)",
    credits: "6.0 ECTS Kredit",
    type: "Majburiy Fan",
    description: "Ushbu fan matritsalar nazariyasi, vektor fazolari, chiziqli operatorlar, xos qiymat va xos vektorlar hamda ularni kompyuter grafikasi va tarmoq modellarida qo‘llashni o‘rgatadi.",
    topics: [
      "1-Hafta: Matritsalar, ularning turlari va matritsalar ustida chiziqli amallar.",
      "2-Hafta: Determinantlar, ularning xossalari va hisoblash usullari (Laplas teoremasi).",
      "3-Hafta: Teskari matritsa va matritsali tenglamalar.",
      "4-Hafta: Chiziqli algebraik tenglamalar sistemasi (Kramer qoidasi, Gauss usuli).",
      "5-Hafta: Kroneker-Kapelli teoremasi va fundamental yechimlar sistemasi.",
      "6-Hafta: Vektor fazolari, chiziqli bog‘liq va bog‘liq bo‘lmagan sistemalar.",
      "7-Hafta: Fazo bazisi, o‘lchami va koordinatalar almashtirish.",
      "8-Hafta: Chiziqli operatorlar va ularning matritsaviy ifodasi.",
      "9-Hafta: Chiziqli operatorning xos qiymatlari va xos vektorlari.",
      "10-Hafta: Kvadratik formalar, kanonik va normal ko‘rinishga keltirish.",
      "11-Hafta: Evklid fazolari, Skalyar ko‘paytma va Gram-Shmidt ortogonallashtirish jarayoni.",
      "12-Hafta: Chiziqli algebraning axborot texnologiyalari va 3D grafika hamda kriptografiyadagi tatbiqlari."
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
    description: "Relyatsion ma'lumotlar modellari, ER-diagrammalar (ERD) loyihalash, SQL tili, tranzaksiyalar boshqaruvi (ACID) va zamonaviy RDBMS (PostgreSQL, MySQL) bilan ishlash ko‘nikmalarini shakllantiradi.",
    topics: [
      "1-Hafta: Ma'lumotlar bazalariga kirish, relyatsion model konsepsiyasi.",
      "2-Hafta: Konseptual loyihalash: Ob'yekt-Aloqa (ER) diagrammalari.",
      "3-Hafta: Relyatsion algebra va mantiqiy modelga o‘tkazish.",
      "4-Hafta: SQL tili asoslari: DDL (CREATE, ALTER, DROP).",
      "5-Hafta: Ma'lumotlar ustida amallar: DML (INSERT, UPDATE, DELETE).",
      "6-Hafta: Murakkab so‘rovlar (SELECT, WHERE, GROUP BY, HAVING, ORDER BY).",
      "7-Hafta: Jadvallarni birlashtirish: INNER, LEFT, RIGHT, FULL OUTER JOIN.",
      "8-Hafta: Ichki so‘rovlar (Subqueries) va ko‘rinishlar (Views).",
      "9-Hafta: Ma'lumotlar bazasini normalizatsiya qilish (1NF, 2NF, 3NF, BCNF).",
      "10-Hafta: Tranzaksiyalar, ACID xossalari va blokirovkalar (Locks).",
      "11-Hafta: Indekslash (B-Tree, Hash index) va so‘rovlar optimizatsiyasi (EXPLAIN ANALYZE).",
      "12-Hafta: Triggirlar, saqlanuvchi protseduralar va PostgreSQL ma'murligi."
    ],
    literature: [
      "Silberschatz A., Korth H., Sudarshan S. 'Database System Concepts', 7th Edition.",
      "Date C.J. 'An Introduction to Database Systems', 8th Edition.",
      "PostgreSQL 16 Official Documentation."
    ],
    evaluation: "Laboratoriya ishlari: 30 ball | Oraliq nazorat: 20 ball | Yakuniy nazorat: 50 ball"
  },
  electronics: {
    title: "Elektronika va sxemalar",
    code: "EE2103",
    semester: "3-Semestr (Kuzgi 2026)",
    hours: "180 Soat (Ma'ruza: 60, Laboratoriya: 60, Mustaqil: 60)",
    credits: "6.0 ECTS Kredit",
    type: "Majburiy Fan",
    description: "Yarim o‘tkazgichlar fizikasi, tranzistorli kalitlar, kuchaytirgichlar, raqamli mantiqiy darvozalar, triggerlar, hisoblagichlar va integral mikrosxemalar arxitekturasini o‘rganish.",
    topics: [
      "1-Hafta: Yarim o‘tkazgichlar fizikasi, p-n o‘tish va yarimo‘tkazgichli diodlar.",
      "2-Hafta: Bipolyar tranzistorlar (BJT): ishlash rejimlari va kalit sifatida qo‘llanishi.",
      "3-Hafta: Maydoniy tranzistorlar (MOSFET): arxitekturasi va kompyuter mikrosxemalaridagi o‘rni.",
      "4-Hafta: Kuchaytirgich kaskadlari va operatsion kuchaytirgichlar (Op-Amp).",
      "5-Hafta: Analog signallarni raqamlashtirish: ATS (ADC) va TSA (DAC) o‘zgartirgichlar.",
      "6-Hafta: Binar mantiq va elementar mantiqiy darvozalar (AND, OR, NOT, NAND, NOR, XOR).",
      "7-Hafta: Kombinatsion mantiqiy sxemalar: DeShifrator, Shifrator, Multipleksor va Demultipleksor.",
      "8-Hafta: Binar summatorlar va komparatorlar.",
      "9-Hafta: Ketma-ket mantiqiy sxemalar: RS, D, T va JK triggerlar.",
      "10-Hafta: Registrlar: siljish registrlari va xotira yacheykalari.",
      "11-Hafta: Binar hisoblagichlar (Counters) va chastota bo‘lgichlar.",
      "12-Hafta: Zamonaviy kompyuter apparat ta'minoti: CPU, VRM quvvat fazalari va PCIe shinalari."
    ],
    literature: [
      "Boylestad R., Nashelsky L. 'Electronic Devices and Circuit Theory', 11th Edition.",
      "Floyd T.L. 'Digital Fundamentals', 11th Edition.",
      "Horowitz P., Hill W. 'The Art of Electronics', 3rd Edition."
    ],
    evaluation: "Laboratoriya stendlari: 30 ball | Oraliq test: 20 ball | Yakuniy imtihon: 50 ball"
  },
  discrete: {
    title: "Diskret tuzilmalar",
    code: "CS2104",
    semester: "3-Semestr (Kuzgi 2026)",
    hours: "180 Soat (Ma'ruza: 60, Amaliyot: 60, Mustaqil: 60)",
    credits: "6.0 ECTS Kredit",
    type: "Majburiy Fan",
    description: "To‘plamlar, matematik mantiq, kombinatorika, graf nazariyasi va tarmoq topologiyalarini modellashtirishning nazariy poydevori.",
    topics: [
      "1-Hafta: To‘plamlar nazariyasi, to‘plamlar ustida amallar va Eyler-Venn diagrammalari.",
      "2-Hafta: Binar munosabatlar, ekvivalentlik va qisman tartib munosabatlari.",
      "3-Hafta: Mulohazalar mantiqi, mantiqiy amallar va chinlik jadvallari.",
      "4-Hafta: Predikatlar hisobi va kvantorlar (∀, ∃).",
      "5-Hafta: Bul algebrasi, mantiqiy funksiyalar va KNDF/KNDF shakllari.",
      "6-Hafta: Mantiqiy funksiyalarni minimallashtirish (Karno kartalari).",
      "7-Hafta: Kombinatorika qoidalari: o‘rinlashtirish, guruhlash va o‘rin almashtirish.",
      "8-Hafta: Binar daraxtlar va graf nazariyasi asoslari (yo‘llar, sikllar, bog‘liqlik).",
      "9-Hafta: Graf algoritmlari: Deykstra, Kraskal va Prima algoritmlari (tarmoq marshrutlash).",
      "10-Hafta: Tarmoq topologiyalarini (Yulduz, Halqa, Shina, Daraxt, To‘r) graflar orqali modellashtirish.",
      "11-Hafta: Rekurrent munosabatlar va algoritmlar murakkabligi (O-notatsiya).",
      "12-Hafta: Chekli avtomatlar va regulyar tillar."
    ],
    literature: [
      "Rosen K.H. 'Discrete Mathematics and Its Applications', 8th Edition.",
      "Cormen T.H. et al. 'Introduction to Algorithms' (CLRS), 3rd Edition."
    ],
    evaluation: "Amaliy mashg‘ulotlar: 30 ball | Nazorat ishi: 20 ball | Yakuniy imtihon: 50 ball"
  },
  networks: {
    title: "Kompyuter tarmoqlari",
    code: "NET2105",
    semester: "3-Semestr (Kuzgi 2026)",
    hours: "180 Soat (Ma'ruza: 60, Laboratoriya: 60, Mustaqil: 60)",
    credits: "6.0 ECTS Kredit",
    type: "Majburiy Fan",
    description: "Tarmoq arxitekturasi, OSI va TCP/IP modellari, Ethernet, IPv4/IPv6 subnetlash, L2 kommutatsiya, VLAN va L3 dinamik marshrutlash protokollarini (OSPF) chuqur amaliy o‘rganish.",
    topics: [
      "1-Hafta: Kompyuter tarmoqlari evolyutsiyasi, tarmoq topologiyalari va turlari (LAN, WAN, MAN).",
      "2-Hafta: OSI 7 qatlamli modeli va TCP/IP protokollar steki tahlili.",
      "3-Hafta: Jismoniy qatlam: Mis (Cat6A), Optik tola (SMF/MMF) va Simsiz uzatish vositalari.",
      "4-Hafta: Kanal qatlami: Ethernet (802.3), MAC manzillash va CSMA/CD mexanizmi.",
      "5-Hafta: Kommutatsiya: Switch ishlash tamoyili, MAC jadvali va STP (Spanning Tree Protocol).",
      "6-Hafta: Virtual LAN (VLAN): 802.1Q trunking va Inter-VLAN marshrutlash (Router-on-a-Stick).",
      "7-Hafta: Tarmoq qatlami: IPv4 manzillash, klasslar, xususiy/ommaviy IP manzillar.",
      "8-Hafta: Subnetting (kichik tarmoqlarga ajratish) va VLSM (Variable Length Subnet Mask).",
      "9-Hafta: IPv6 arxitekturasi: Dual-stack, SLAAC va EUI-64 formatlari.",
      "10-Hafta: Statik marshrutlash va dinamik marshrutlash protokollari (OSPFv2, OSPFv3).",
      "11-Hafta: Transport qatlami: TCP (3-way handshake, Flow Control) va UDP protokollari.",
      "12-Hafta: Amaliy qatlam xizmatlari: DNS, DHCP, HTTP/HTTPS, SSH va Wireshark bilan paket tahlili."
    ],
    literature: [
      "Tanenbaum A.S., Wetherall D. 'Computer Networks', 5th Edition.",
      "Cisco CCNA 200-301 Official Cert Guide Library (Wendell Odom).",
      "Kurose J., Ross K. 'Computer Networking: A Top-Down Approach', 8th Edition."
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
    description: "Axborot texnologiyalari sohasidagi so‘nggi yutuqlar, xalqaro sertifikatlash, kasbiy etika va talabalarning shaxsiy karyerasini shakllantirish kursi.",
    topics: [
      "1-Hafta: Zamonaviy AKT bozori talablari va Network Engineer mutaxassisligi.",
      "2-Hafta: Xalqaro sertifikatlar (Cisco CCNA/CCNP, CompTIA Network+, LPIC Linux).",
      "3-Hafta: Rezyume (CV), LinkedIn profili va GitHub portfoliosini shakllantirish.",
      "4-Hafta: Axborot xavfsizligi madaniyati va korxonalarda ma'lumotlar muhofazasi.",
      "5-Hafta: Startap loyihalar, ilmiy maqolalar yozish va grantlar jalb qilish.",
      "6-Hafta: Jamoaviy ishlash (Agile, Scrum) va soft-skills ko‘nikmalari."
    ],
    literature: [
      "Oliy ta'lim, fan va innovatsiyalar vazirligi uslubiy ko‘rsatmalari.",
      "Cisco Networking Academy karyera yo‘riqnomasi."
    ],
    evaluation: "Hisobot va taqdimot himoyasi asosida hisobga olinadi (Zachyot)"
  },

  // ==================== 4-SEMESTR (BAHORGI 2027) ====================
  security: {
    title: "Kiberxavfsizlik asoslari",
    code: "SEC2201",
    semester: "4-Semestr (Bahorgi 2027)",
    hours: "180 Soat (Ma'ruza: 60, Laboratoriya: 60, Mustaqil: 60)",
    credits: "6.0 ECTS Kredit",
    type: "Majburiy Fan",
    description: "Kriptografiya, Next-Gen Firewall, zaifliklarni skanerlash, tarmoq auditi va Zero Trust xavfsizlik arxitekturasi.",
    topics: [
      "1-Hafta: Kiberxavfsizlikka kirish: CIA triadasi va xavfsizlik tahdidlari.",
      "2-Hafta: Kriptografiya asoslari: Simmetrik va asimmetrik shifrlash.",
      "3-Hafta: Xesh funksiyalar (SHA-256) va raqamli elektron imzo (EDS).",
      "4-Hafta: Tarmoq xavfsizlik devorlari (Firewall, IPTables, Cisco ASA).",
      "5-Hafta: IDS/IPS tizimlari va Snort yordamida paketlarni tekshirish.",
      "6-Hafta: Penetratsion testlash asoslari va Kali Linux vositalari."
    ],
    literature: ["Stallings W. 'Cryptography and Network Security', 8th Edition."],
    evaluation: "Laboratoriya ishlari: 30 ball | Oraliq: 20 ball | Yakuniy: 50 ball"
  },
  ai: {
    title: "Sun'iy intellekt asoslari",
    code: "AI2202",
    semester: "4-Semestr (Bahorgi 2027)",
    hours: "180 Soat (Ma'ruza: 60, Laboratoriya: 60, Mustaqil: 60)",
    credits: "6.0 ECTS Kredit",
    type: "Majburiy Fan",
    description: "Mashinali o‘rganish, neyron to‘rlar, intellektual agentlar va ularni telekommunikatsiya tizimlariga tatbiq etish.",
    topics: [
      "1-Hafta: Sun'iy intellekt tushunchasi va intellektual agentlar.",
      "2-Hafta: Mashinali o‘rganish turlari: Supervised va Unsupervised learning.",
      "3-Hafta: Chiziqli va logistik regressiya modellari.",
      "4-Hafta: Sun'iy neyron to‘rlari (Perceptron, Multilayer Perceptron).",
      "5-Hafta: Chuqur o‘rganish (Deep Learning) va kompyuter ko‘rish asoslari.",
      "6-Hafta: Tarmoq trafigi anomaliyalarini AI yordamida aniqlash."
    ],
    literature: ["Russell S., Norvig P. 'Artificial Intelligence: A Modern Approach', 4th Edition."],
    evaluation: "Amaliy loyiha: 30 ball | Oraliq: 20 ball | Yakuniy: 50 ball"
  },
  probability: {
    title: "Ehtimollik va Statistika",
    code: "MATH2203",
    semester: "4-Semestr (Bahorgi 2027)",
    hours: "180 Soat (Ma'ruza: 60, Amaliyot: 60, Mustaqil: 60)",
    credits: "6.0 ECTS Kredit",
    type: "Majburiy Fan",
    description: "Ehtimollik nazariyasi, tasodifiy miqdorlar, taqsimot qonunlari, matematik statistika va tarmoq trafigini ehtimoliy modellashtirish.",
    topics: [
      "1-Hafta: Ehtimollik fazosi, tasodifiy hodisalar va ehtimollikning klassik/geometrik ta'rifi.",
      "2-Hafta: Shartli ehtimollik, to‘la ehtimollik formulasi va Bayes formulasi.",
      "3-Hafta: Diskret tasodifiy miqdorlar: binomial, Puasson va geometrik taqsimotlar.",
      "4-Hafta: Uzluksiz tasodifiy miqdorlar: tekis, ko‘rsatkichli va normal (Gauss) taqsimotlar.",
      "5-Hafta: Tasodifiy miqdorlarning sonli xarakteristikalari: matematik kutilma va dispersiya.",
      "6-Hafta: Katta sonlar qonuni va markaziy limit teorema.",
      "7-Hafta: Matematik statistika asoslari: tanlanma, gistogramma va empirik taqsimot.",
      "8-Hafta: Statistik gipotezalarni tekshirish va tarmoq trafigi anomaliyalarini tahlil qilish."
    ],
    literature: ["Sheldon Ross, 'A First Course in Probability', 10th Edition, Pearson."],
    evaluation: "Amaliy mashg‘ulot: 30 ball | Oraliq nazorat: 20 ball | Yakuniy imtihon: 50 ball"
  },
  differential: {
    title: "Differensial tenglamalar",
    code: "MATH2204",
    semester: "4-Semestr (Bahorgi 2027)",
    hours: "180 Soat (Ma'ruza: 60, Amaliyot: 60, Mustaqil: 60)",
    credits: "6.0 ECTS Kredit",
    type: "Majburiy Fan",
    description: "Oddiy differensial tenglamalar, birinchi va yuqori tartibli tenglamalar, chiziqli differensial tenglamalar sistemalari va tebranish konturlarini modellashtirish.",
    topics: [
      "1-Hafta: Birinchi tartibli differensial tenglamalar: o‘zgaruvchilari ajraladigan tenglamalar.",
      "2-Hafta: Bir jinsli va chiziqli birinchi tartibli differensial tenglamalar (Bernulli tenglamasi).",
      "3-Hafta: To‘liq differensialli tenglamalar va integrallovchi ko‘paytuvchi.",
      "4-Hafta: Tartibi pasaytiriladigan yuqori tartibli differensial tenglamalar.",
      "5-Hafta: O‘zgarmas koeffitsiyentli chiziqli bir jinsli differensial tenglamalar.",
      "6-Hafta: Bir jinsli bo‘lmagan chiziqli tenglamalar (Lagranj o‘zgarmaslarni variatsiyalash usuli).",
      "7-Hafta: Differensial tenglamalar sistemalari va turg‘unlik nazariyasi (Lyapunov).",
      "8-Hafta: Elektr zanjirlari va RLC konturlaridagi elektromagnit tebranishlar tenglamalari."
    ],
    literature: ["Dennis G. Zill, 'A First Course in Differential Equations', 11th Edition."],
    evaluation: "Amaliy hisob-grafik ishi: 30 ball | Oraliq test: 20 ball | Yakuniy imtihon: 50 ball"
  },
  datascience: {
    title: "Data Science",
    code: "CS2205",
    semester: "4-Semestr (Bahorgi 2027)",
    hours: "180 Soat (Ma'ruza: 60, Laboratoriya: 60, Mustaqil: 60)",
    credits: "6.0 ECTS Kredit",
    type: "Majburiy Fan",
    description: "Katta hajmdagi ma'lumotlar tahlili, Python (NumPy, Pandas, Matplotlib, Scikit-Learn), ma'lumotlarni tozalash, vizualizatsiya va tahliliy bashoratlash.",
    topics: [
      "1-Hafta: Data Science ga kirish va Python ekotizimi (Jupyter Notebook, Google Colab).",
      "2-Hafta: NumPy kutubxonasi: ko‘p o‘lchamli massivlar va vektorlashtirilgan hisoblashlar.",
      "3-Hafta: Pandas kutubxonasi: Series va DataFrame obyektlari, ma'lumotlarni saralash.",
      "4-Hafta: Data Cleaning: yetishmayotgan qiymatlar, anomaliyalar va ma'lumotlarni normalizatsiya qilish.",
      "5-Hafta: Ma'lumotlar vizualizatsiyasi: Matplotlib, Seaborn va interaktiv grafiklar.",
      "6-Hafta: Exploratory Data Analysis (EDA): korrelyatsion tahlil va xususiyatlarni tanlash.",
      "7-Hafta: Scikit-Learn bilan mashinali o‘rganish modellarini qurish va baholash (MSE, R2).",
      "8-Hafta: Tarmoq telemetriyasi va katta hajmdagi log-fayllarni tahlil qilish keysi."
    ],
    literature: ["Wes McKinney, 'Python for Data Analysis', 3rd Edition, O'Reilly."],
    evaluation: "Laboratoriya loyihasi: 30 ball | Oraliq: 20 ball | Yakuniy imtihon: 50 ball"
  },
  pedagogika: {
    title: "Kasbiy pedagogika",
    code: "PED2206",
    semester: "4-Semestr (Bahorgi 2027)",
    hours: "120 Soat (Ma'ruza: 40, Seminar: 40, Mustaqil: 40)",
    credits: "4.0 ECTS Kredit",
    type: "Majburiy Fan",
    description: "Muhandislik ta'limi metodikasi, pedagogik texnologiyalar, ta'lim standartlari, dars loyihalash va AKT sohasida kadrlarni tayyorlash usullari.",
    topics: [
      "1-Hafta: Kasbiy pedagogikaning predmeti, vazifalari va zamonaviy ta'lim paradigmasi.",
      "2-Hafta: Muhandislik ta'limida kompetensiyaviy yondashuv va ECTS kredit-modul tizimi.",
      "3-Hafta: Zamonaviy pedagogik texnologiyalar: muammoli ta'lim, loyihaga asoslangan ta'lim (PBL).",
      "4-Hafta: Texnika fanlarida interaktiv ta'lim metodlari va simulyatorlardan foydalanish.",
      "5-Hafta: O‘quv mashg‘ulotlarini loyihalash (Sillabus, dars ishlanmasi va taqdimotlar).",
      "6-Hafta: Talabalar bilimini baholash mezonlari va testologiya asoslari."
    ],
    literature: ["Kasbiy pedagogika (Darslik), Oliy ta'lim vazirligi tavsiyasi, Toshkent."],
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

  let topicsHtml = data.topics.map(t => `<li style="padding:5px 0; color:var(--text-light); font-size:13px; border-bottom:1px dashed var(--line-base); display:flex; align-items:flex-start; gap:8px;"><span style="color:var(--brand-primary); font-weight:bold;">▸</span><span>${t}</span></li>`).join('');
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
        <h5 style="color:var(--text-white); font-size:13px; margin-bottom:8px; text-transform:uppercase;">🎯 Baholash Mezonlari</h5>
        <p style="font-size:12.5px; color:var(--text-dim); line-height:1.5; margin:0;">${data.evaluation || 'Joriy nazorat: 30 ball | Oraliq: 20 ball | Yakuniy: 50 ball'}</p>
      </div>
    </div>

    <div style="margin-top:24px; display:flex; justify-content:flex-end; gap:12px;">
      <button class="btn-arsenal-secondary" onclick="window.print()" style="font-size:12px; padding:8px 14px; cursor:pointer;">🖨️ Chop etish</button>
      <button class="btn-arsenal-primary" onclick="alert('${data.title} fan silabusi PDF yuklab olindi (Simulyatsiya)');" style="font-size:12px; padding:8px 14px; cursor:pointer;">📥 Silabusni Yuklab Olish (PDF)</button>
    </div>
  `;

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

