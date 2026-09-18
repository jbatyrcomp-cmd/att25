/**
 * ATT-25 AKADEMIK VA AMALIY PORTALI
 * Arsenal.com Yashil Uslubidagi Interaktiv Logika va Simulyatorlar Dvigateli
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initSubnetCalculator();
  initPingSimulator();
  initOsiInspector();
  initArenaControls();
  initSearchModal();
  initSettingsModal();
  initArticleReader();
  initVideoPlayer();
  initPresentationModal();
  initCategoryFilters();
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
      window.open('3d.html', '_blank');
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

/* ==========================================================================
   6. QIDIRUV (SEARCH) MODALI
   ========================================================================== */
const SEARCH_INDEX = [
  { title: "3D LAN Simulyatori", category: "Simulyator", link: "#simulyatorlar", desc: "Interaktiv 3D muhitda tarmoq qurish va paketlar harakatini kuzatish" },
  { title: "IP Subnet & VLSM Kalkulyatori", category: "Simulyator", link: "#subnet-calc", desc: "IP manzil va CIDR maskasi bo‘yicha tarmoq parametrlarini hisoblash" },
  { title: "Jonli Ping & Latency Terminali", category: "Simulyator", link: "#ping-terminal", desc: "ICMP paketlar yuborish va tarmoq kechikishini sinovdan o‘tkazish" },
  { title: "OSI 7 Qatlamli Model Inspektori", category: "Simulyator", link: "#osi-inspector", desc: "OSI qatlamlari, protokollari va apparat jihozlarini tahlil qilish" },
  { title: "Cisco Routing & Switching (CCNA)", category: "O‘quv Dasturi", link: "#oquv-dasturi", desc: "OSPF, VLAN, Inter-VLAN va BGP marshrutlash protokollari" },
  { title: "Kiberxavfsizlik va Next-Gen Firewall", category: "O‘quv Dasturi", link: "#oquv-dasturi", desc: "Tarmoq xavfsizligi, IDS/IPS va tarmoq himoyasi qoidalari" },
  { title: "Tolali optik aloqa liniyalari laboratoriyasi", category: "Media & Lab", link: "#media-hub", desc: "Optik tolani payvandlash (Fusion Splicer) va reflektometr (OTDR)" },
  { title: "Wireshark Paket Tahlili Qo‘llanmasi", category: "Darslik", link: "#taqdimotlar", desc: "TCP 3-way handshake va DNS paketlarini chuqur o‘rganish" },
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
   7. SOZLAMALAR (SETTINGS) MODALI
   ========================================================================== */
function initSettingsModal() {
  const settingsModal = document.getElementById('settingsModal');
  const settingsBtn = document.getElementById('openSettingsBtn');
  const settingsClose = document.getElementById('settingsModalClose');
  const contrastToggle = document.getElementById('contrastToggle');
  const fontToggle = document.getElementById('fontToggle');

  if (!settingsModal) return;

  function openSettings() { settingsModal.classList.add('open'); }
  function closeSettings() { settingsModal.classList.remove('open'); }

  if (settingsBtn) settingsBtn.addEventListener('click', openSettings);
  if (settingsClose) settingsClose.addEventListener('click', closeSettings);

  settingsModal.addEventListener('click', (e) => {
    if (e.target === settingsModal) closeSettings();
  });

  if (contrastToggle) {
    contrastToggle.addEventListener('change', (e) => {
      if (e.target.checked) {
        document.body.classList.add('mode-high-contrast');
      } else {
        document.body.classList.remove('mode-high-contrast');
      }
    });
  }

  if (fontToggle) {
    fontToggle.addEventListener('change', (e) => {
      if (e.target.checked) {
        document.body.classList.add('font-large');
      } else {
        document.body.classList.remove('font-large');
      }
    });
  }
}

/* ==========================================================================
   8. MAQOLALARNI O'QISH (ARTICLE READER) MODALI
   ========================================================================== */
const ARTICLES_CONTENT = {
  1: {
    category: "Tarmoq Arxitekturasi",
    date: "18-Sentabr, 2026",
    title: "Kvant shifrlash va zamonaviy optik magistrallarning kelajagi",
    author: "ATT-25 Ilmiy Guruhi",
    content: `
      <p style="margin-bottom:14px;">Zamonaviy optik aloqa tizimlarida ma'lumotlar oqimi yildan-yilga karrali ravishda ortib bormoqda. ATT-25 yo‘nalishida o‘rganilayotgan Dense Wavelength Division Multiplexing (DWDM) texnologiyasi bitta jismoniy tolada 80 dan ortiq to‘lqin uzunligida 800 Gbps tezlikka erishish imkonini beradi.</p>
      <p style="margin-bottom:14px;">Kvant kompyuterlarining rivojlanishi an'anaviy RSA va ECC shifrlash algoritmlariga xavf solmoqda. Shuning uchun hozirda Quantum Key Distribution (QKD) protokoli - xususan BB84 algoritmi optik magistrallarga tatbiq etilmoqda.</p>
      <h4 style="color:var(--brand-primary); margin:16px 0 8px;">ATT-25 Laboratoriyasidagi Amaliy Sinovlar</h4>
      <p style="margin-bottom:14px;">Laboratoriya stendlarida 1550 nm to‘lqin uzunligida fotonlar polarizatsiyasi orqali kvant kalitlarini xavfsiz almashish simulyatsiyalari o‘tkazildi. Tajribalar shuni ko‘rsatdiki, toladagi har qanday noqonuniy ulanish (eavesdropping) fotonlar holatini o‘zgartirib, tizimni darhol ogohlantiradi.</p>
    `
  },
  2: {
    category: "Kiberxavfsizlik",
    date: "15-Sentabr, 2026",
    title: "Korxona tarmoqlarida Zero Trust xavfsizlik arxitekturasi",
    author: "Kafedra Kiber-Laboratoriyasi",
    content: `
      <p style="margin-bottom:14px;">"Hech kimga ishonma, doim tekshir" (Never Trust, Always Verify) tamoyiliga asoslangan Zero Trust arxitekturasi an'anaviy perimetr xavfsizligidan tubdan farq qiladi.</p>
      <p style="margin-bottom:14px;">ATT-25 amaliy dasturida Cisco ISE (Identity Services Engine), 802.1X autentifikatsiyasi va mikrosegmentatsiya amaliyotlari o‘rgatiladi. Tarmoq ichidagi har bir foydalanuvchi va server faqat o‘ziga tegishli resurslargina kirish huquqiga ega bo‘ladi.</p>
    `
  },
  3: {
    category: "Amaliy Tajriba",
    date: "10-Sentabr, 2026",
    title: "Wi-Fi 7 va 5G xususiy korporativ tarmoqlar integratsiyasi",
    author: "Telestudio & Tarmoqlar Laboratoriyasi",
    content: `
      <p style="margin-bottom:14px;">Wi-Fi 7 (IEEE 802.11be) standarti 320 MHz kanal kengligi va Multi-Link Operation (MLO) orqali kechikish vaqtini 5 millisekunddan kamaytirishga muvaffaq bo‘ldi.</p>
      <p style="margin-bottom:14px;">Ushbu maqolada xususiy 5G (Private 5G) tarmoqlari bilan Wi-Fi 7 ning o‘zaro uzluksiz roamingo (seamless handover) masalalari tahlil qilingan.</p>
    `
  }
};

function initArticleReader() {
  const articleModal = document.getElementById('articleModal');
  const articleClose = document.getElementById('articleModalClose');
  const cards = document.querySelectorAll('.article-card');

  if (!articleModal) return;

  function closeArticle() { articleModal.classList.remove('open'); }
  if (articleClose) articleClose.addEventListener('click', closeArticle);

  articleModal.addEventListener('click', (e) => {
    if (e.target === articleModal) closeArticle();
  });

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.articleId || 1;
      const data = ARTICLES_CONTENT[id] || ARTICLES_CONTENT[1];

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
   9. VIDEO PLAYER MODALI
   ========================================================================== */
function initVideoPlayer() {
  const videoModal = document.getElementById('videoModal');
  const videoClose = document.getElementById('videoModalClose');
  const playTrigger = document.getElementById('videoPlayTrigger');

  if (!videoModal || !playTrigger) return;

  playTrigger.addEventListener('click', () => {
    videoModal.classList.add('open');
  });

  if (videoClose) {
    videoClose.addEventListener('click', () => {
      videoModal.classList.remove('open');
    });
  }

  videoModal.addEventListener('click', (e) => {
    if (e.target === videoModal) videoModal.classList.remove('open');
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
   11. KATEGORIYA FILTRLARI
   ========================================================================== */
function initCategoryFilters() {
  const filterBtns = document.querySelectorAll('.section-filters .filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const parent = btn.parentElement;
      parent.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}
