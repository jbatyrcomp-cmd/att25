/* ==========================================================================
   ATT-25 AI DOSKA — COMPARISON TABLES GENERATOR (comparison-tables.js)
   Texnik va Ilmiy Taqqoslash Jadvallari: TCP/UDP, OSI/TCP-IP, IPv4/IPv6 va h.k.
   ========================================================================== */

class ComparisonTablesEngine {
  static getPresets() {
    return {
      tcp_vs_udp: {
        id: 'tcp_vs_udp',
        title: '🌐 TCP va UDP Protokollari Taqqoslanishi',
        badge: 'TARMOQ VA TRANSPORT',
        color: '#38BDF8',
        cols: ['Parametr / Xususiyat', 'TCP (Transmission Control Protocol)', 'UDP (User Datagram Protocol)'],
        colWidths: [200, 260, 260],
        rows: [
          ['Ulanish turi', 'Ulanishli (3-Way Handshake: SYN, SYN-ACK, ACK)', 'Ulanishsiz (Connectionless, to\'g\'ridan-to\'g\'ri)'],
          ['Ishonchlilik', 'Kafolatlangan (Paketlar yo\'qolmaydi, qayta yuboriladi)', 'Kafolat yo\'q (Paketlar yo\'qolishi mumkin)'],
          ['Ketma-ketlik', 'Paketlar qat\'iy tartibda yig\'iladi (Sequence Num)', 'Tartibsiz kelishi mumkin'],
          ['Sarlavha hajmi', '20 – 60 Bayt (Ko\'p qo\'shimcha maydonlar)', 'Atigi 8 Bayt (Yengil va ixcham)'],
          ['Tezlik', 'O\'rtacha (Tekshirishlar va tasdiqlar sababli)', 'Juda yuqori (Minimal kechikish)'],
          ['Oqim nazorati', 'Mavjud (Sliding Window, Congestion Control)', 'Mavjud emas'],
          ['Qo\'llanish', 'HTTP/HTTPS, SSH, FTP, Email (SMTP/IMAP)', 'DNS, VoIP, Jonli Video Stream, Onlayn O\'yinlar']
        ],
        note: '💡 Xulosa: TCP ishonchli ma\'lumot uzatish uchun, UDP esa tezkorlik va minimal kechikish talab etiladigan joyda ishlatiladi.'
      },

      osi_vs_tcpip: {
        id: 'osi_vs_tcpip',
        title: '🏛️ OSI va TCP/IP Modellari Solishtirmasi',
        badge: 'ARXITEKTURA',
        color: '#10B981',
        cols: ['Qatlam Vazifasi', 'OSI 7 Qatlamli Modeli', 'TCP/IP 4 Qatlamli Modeli'],
        colWidths: [200, 260, 260],
        rows: [
          ['Foydalanuvchi interfeysi', '7. Amaliy (Application)', '4. Amaliy (Application)\n(HTTP, DNS, SSH, FTP)'],
          ['Format va shifrlash', '6. Taqdimot (Presentation)', '↑ Amaliy qatlam ichida'],
          ['Sessiya boshqaruvi', '5. Seans (Session)', '↑ Amaliy qatlam ichida'],
          ['Oxirigacha yetkazish', '4. Transport (TCP, UDP)', '3. Transport (TCP, UDP, Portlar)'],
          ['Marshrutlash va IP', '3. Tarmoq (IP, ICMP, OSPF)', '2. Internet (IPv4, IPv6, ICMP)'],
          ['Fizik manzillash / MAC', '2. Kanal (Ethernet, MAC, Switch)', '1. Tarmoqqa Kirish (Network Access)\n(Ethernet, Wi-Fi, UTP, Optika)'],
          ['Signal va bitlar', '1. Jismoniy (Kabel, Radio, Bit)', '↑ Tarmoqqa kirish ichida']
        ],
        note: '💡 Xulosa: OSI — bu nazariy etalon model, TCP/IP esa global Internetning amaliy ishchi standarti.'
      },

      ipv4_vs_ipv6: {
        id: 'ipv4_vs_ipv6',
        title: '🔢 IPv4 va IPv6 Manzillash Tizimi',
        badge: 'INTERNET PROTOKOL',
        color: '#A855F7',
        cols: ['Ko\'rsatkich', 'IPv4 (Internet Protocol v4)', 'IPv6 (Internet Protocol v6)'],
        colWidths: [200, 260, 260],
        rows: [
          ['Manzil uzunligi', '32 Bit (4 Bayt)', '128 Bit (16 Bayt)'],
          ['Jami manzillar soni', '4 294 967 296 (~4.3 Milyard)', '3.4 × 10³⁸ (Har bir qum zarrasiga yetarli)'],
          ['Yozilish formati', 'O\'nlik nuqtali: 192.168.1.1', 'O\'n oltilik ikki nuqtali: 2001:db8::1'],
          ['Sarlavha hajmi', 'O\'zgaruvchan: 20 – 60 Bayt', 'Qat\'iy belgilangan: 40 Bayt (Tez ishlov)'],
          ['Konfiguratsiya', 'Qo\'lda yoki DHCP server orqali', 'SLAAC (Avtomatik stateless) yoki DHCPv6'],
          ['Xavfsizlik (IPSec)', 'Ixtiyoriy (Qo\'shimcha o\'rnatiladi)', 'Protokol ichiga o\'rnatilgan (Native IPSec)'],
          ['Broadcast xabarlar', 'Mavjud (Tarmoqni yuklaydi)', 'Broadcast yo\'q, faqat Multicast / Anycast']
        ],
        note: '💡 Xulosa: IPv4 manzillari tugagan, zamonaviy tarmoqlar to\'liq IPv6 va dual-stack rejimiga o\'tmoqda.'
      },

      sql_vs_nosql: {
        id: 'sql_vs_nosql',
        title: '🗄️ SQL va NoSQL Ma\'lumotlar Bazalari',
        badge: 'DATABASE TECH',
        color: '#F59E0B',
        cols: ['Kategoriya', 'Relyatsion SQL (PostgreSQL, MySQL)', 'NoSQL (MongoDB, Redis, Neo4j)'],
        colWidths: [200, 260, 260],
        rows: [
          ['Ma\'lumot modeli', 'Jadvallar, qatorlar, qat\'iy sxema', 'Hujjat (JSON), Kalit-Qiymat, Graf'],
          ['Sxema', 'Oldindan belgilangan qat\'iy (Fixed Schema)', 'Dinamik va moslashuvchan (Schema-less)'],
          ['Masshtablash', 'Asosan Vertikal (Kuchliroq CPU/RAM)', 'Gorizontal (Ko\'plab serverlar klasteri)'],
          ['Tranzaksiyalar', 'ACID kafolatlari (Atomicity, Consistency...)', 'BASE modeli (Eventually Consistent)'],
          ['So\'rov tili', 'Strukturaviy SQL (JOIN, GROUP BY)', 'JSON so\'rovlar, MapReduce, Graph travers'],
          ['Qo\'llanish sohasi', 'Bank, Moliya, ERP, Buxgalteriya', 'Big Data, IoT, Real-time kesh, Ijtimoiy tarmoq']
        ],
        note: '💡 Xulosa: Ma\'lumotlar qat\'iy bog\'langan bo\'lsa SQL, moslashuvchan va katta hajm bo\'lsa NoSQL tanlanadi.'
      },

      crypto_sym_asym: {
        id: 'crypto_sym_asym',
        title: '🔐 Simmetrik va Asimmetrik Shifrlash',
        badge: 'KIBERXAVFSIZLIK',
        color: '#F43F5E',
        cols: ['Xususiyat', 'Simmetrik Kriptografiya', 'Asimmetrik Kriptografiya'],
        colWidths: [200, 260, 260],
        rows: [
          ['Kalitlar soni', '1 ta yagona maxfiy kalit', '2 ta kalit: Ochiq (Public) + Maxfiy (Private)'],
          ['Shifrlash / Deshifrlash', 'Ikkala tomon bitta kalitdan foydalanadi', 'Ochiq kalit bilan shifrlanadi, maxfiy bilan ochiladi'],
          ['Tezlik', 'Juda tez (Hardware tezlashuvi mavjud)', '100 – 1000 marta sekinroq'],
          ['Kalit uzunligi', '128, 256 Bit (yetarli darajada xavfsiz)', '2048, 4096 Bit (RSA) yoki 256 Bit (ECC)'],
          ['Asosiy muammo', 'Kalitni xavfsiz kanaldan yetkazish', 'Hisoblash resurslariga yuqori talab'],
          ['Mashhur algoritmlar', 'AES-256, ChaCha20, 3DES', 'RSA, ECC, Diffie-Hellman, Ed25519'],
          ['Zamonaviy amaliyot', 'Fayllar, Disklar, VPN tunnellari', 'SSL/TLS sessiya kalitini almashish, Raqamli imzo']
        ],
        note: '💡 Gibrid Kriptografiya: HTTPS da avval Asimmetrik (RSA/ECC) bilan xavfsiz kalit almashiladi, keyin Simmetrik (AES) bilan tezkor shifrlanadi.'
      },

      http1_vs_http2_vs_http3: {
        id: 'http1_vs_http2_vs_http3',
        title: '🚀 HTTP/1.1 vs HTTP/2 vs HTTP/3 Evolyutsiyasi',
        badge: 'WEB PROTOKOLLAR',
        color: '#00FF87',
        cols: ['Ko\'rsatkich', 'HTTP/1.1 (1997)', 'HTTP/2 (2015)', 'HTTP/3 (2022)'],
        colWidths: [180, 180, 180, 180],
        rows: [
          ['Transport protokoli', 'TCP', 'TCP', 'QUIC (UDP asosida)'],
          ['Format', 'Oddiy Matn (Plaintext)', 'Binar freymlar', 'Binar paketlar'],
          ['Multiplexing', 'Yo\'q (Pipelining sust)', 'Bitta TCP aloqada to\'liq', 'Mustaqil oqimlar (QUIC)'],
          ['Head-of-Line Bloklanish', 'Ilova darajasida mavjud', 'TCP darajasida mavjud', 'Mutlaqo yo\'q'],
          ['Sarlavha siqilishi', 'Mavjud emas', 'HPACK siqish', 'QPACK siqish'],
          ['Xavfsizlik (TLS)', 'Ixtiyoriy (HTTP / HTTPS)', 'Amalda har doim TLS 1.2+', 'Majburiy o\'rnatilgan TLS 1.3']
        ],
        note: '💡 Xulosa: HTTP/3 mobil tarmoqlarda IP o\'zgarganda ham aloqani uzmasdan bir zumda davom ettiradi (Connection Migration).'
      },

      rest_vs_graphql_vs_grpc: {
        id: 'rest_vs_graphql_vs_grpc',
        title: '⚡ REST vs GraphQL vs gRPC API Arxitekturalari',
        badge: 'DASTURIY ARXITEKTURA',
        color: '#06B6D4',
        cols: ['Xususiyat', 'REST API', 'GraphQL API', 'gRPC (Google RPC)'],
        colWidths: [180, 180, 180, 180],
        rows: [
          ['Protokol', 'HTTP/1.1 va HTTP/2', 'HTTP/1.1 va HTTP/2', 'HTTP/2 (Majburiy)'],
          ['Ma\'lumot formati', 'JSON / XML', 'JSON', 'Protocol Buffers (Protobuf)'],
          ['So\'rov turi', 'URL Endpoint (GET, POST...)', 'Yagona POST endpoint', 'Masofaviy funksiya chaqiruvi (RPC)'],
          ['Over/Under Fetching', 'Muammo mavjud', 'Yo\'q (Faqat kerakli maydonlar)', 'Yo\'q (Qat\'iy tuzilma)'],
          ['Streaming', 'Qiyin (SSE yoki WebSockets)', 'Subscriptions orqali', 'Native 4 xil Streaming turi'],
          ['Qo\'llanish', 'Ommaviy Public API lar', 'Mobil va Web frontendlar', 'Mikroxizmatlararo ichki aloqa']
        ],
        note: '💡 Xulosa: Tashqi mijozlar uchun REST/GraphQL, yuqori yuklamali mikroxizmatlar o\'rtasida gRPC ishlatiladi.'
      }
    };
  }

  /* ==========================================================================
     DOSKAGA TAQQOSLASH JADVALINI JOYLASH
     ========================================================================== */
  static generateBoardTable(presetKey, ox = 0, oy = 0) {
    const presets = this.getPresets();
    const data = presets[presetKey] || presets.tcp_vs_udp;
    const objects = [];

    const colWidths = data.colWidths;
    const totalW = colWidths.reduce((a, b) => a + b, 0) + 30;
    const rowH = 38;
    const headerH = 48;
    const tableHeaderH = 38;
    const noteH = data.note ? 56 : 0;
    const totalH = headerH + tableHeaderH + (data.rows.length * rowH) + noteH + 24;

    // Asosiy fon
    objects.push({
      type: 'rect',
      x: ox,
      y: oy,
      width: totalW,
      height: totalH,
      color: data.color,
      strokeWidth: 2,
      filled: true,
      fillColor: 'rgba(15, 23, 42, 0.94)'
    });

    // Yuqori sarlavha paneli
    objects.push({
      type: 'rect',
      x: ox,
      y: oy,
      width: totalW,
      height: headerH,
      color: data.color,
      strokeWidth: 1,
      filled: true,
      fillColor: data.color + '22'
    });

    objects.push({
      type: 'text',
      x: ox + 18,
      y: oy + 14,
      text: `${data.title}  [${data.badge}]`,
      color: data.color,
      fontSize: 14,
      fontWeight: 800
    });

    // Ustunlar sarlavhalari
    let curX = ox + 15;
    const tableHeaderY = oy + headerH + 8;

    objects.push({
      type: 'rect',
      x: ox + 12,
      y: tableHeaderY - 4,
      width: totalW - 24,
      height: tableHeaderH,
      color: 'rgba(255, 255, 255, 0.1)',
      strokeWidth: 1,
      filled: true,
      fillColor: 'rgba(255, 255, 255, 0.06)'
    });

    data.cols.forEach((colTitle, idx) => {
      objects.push({
        type: 'text',
        x: curX + 6,
        y: tableHeaderY + 6,
        text: colTitle,
        color: '#F8FAFC',
        fontSize: 12,
        fontWeight: 700
      });
      curX += colWidths[idx];
    });

    // Qatorlar
    let curY = tableHeaderY + tableHeaderH + 6;

    data.rows.forEach((row, rIdx) => {
      const isEven = rIdx % 2 === 0;

      // Qator foni
      objects.push({
        type: 'rect',
        x: ox + 12,
        y: curY - 3,
        width: totalW - 24,
        height: rowH - 4,
        color: 'transparent',
        strokeWidth: 0,
        filled: true,
        fillColor: isEven ? 'rgba(255, 255, 255, 0.03)' : 'rgba(255, 255, 255, 0.01)'
      });

      let cellX = ox + 15;
      row.forEach((cellVal, cIdx) => {
        const isParamCol = cIdx === 0;
        const color = isParamCol ? '#94A3B8' : (cIdx === 1 ? '#38BDF8' : (cIdx === 2 ? '#10B981' : '#F59E0B'));
        const cleanVal = cellVal.replace(/\n/g, ' / ');

        objects.push({
          type: 'text',
          x: cellX + 6,
          y: curY + 6,
          text: cleanVal.length > 44 ? cleanVal.substring(0, 42) + '...' : cleanVal,
          color: color,
          fontSize: 11,
          fontWeight: isParamCol ? 600 : 500
        });

        cellX += colWidths[cIdx];
      });

      curY += rowH;
    });

    // Pastki izoh stikeri
    if (data.note) {
      objects.push({
        type: 'rect',
        x: ox + 12,
        y: curY + 4,
        width: totalW - 24,
        height: noteH - 8,
        color: 'rgba(255, 255, 255, 0.1)',
        strokeWidth: 1,
        filled: true,
        fillColor: 'rgba(56, 189, 248, 0.08)'
      });

      objects.push({
        type: 'text',
        x: ox + 22,
        y: curY + 14,
        text: data.note,
        color: '#CBD5E1',
        fontSize: 11,
        fontWeight: 600
      });
    }

    return objects;
  }
}

if (typeof window !== 'undefined') {
  window.ComparisonTablesEngine = ComparisonTablesEngine;
}
