/* ==========================================================================
   ATT-25 AI DOSKA — TEMPLATES LIBRARY (templates.js)
   Tarmoq, Dasturlash va Akademik Shablonlar
   ========================================================================== */

const BoardTemplates = {
  // 1. OSI 7 Qatlamli Modeli
  osi_model: {
    id: 'osi_model',
    title: '🌐 OSI 7 Qatlamli Modeli',
    desc: 'Barcha 7 ta qatlam: Amaliy, Taqdimot, Seans, Transport, Tarmoq, Kanal, Jismoniy',
    icon: '🌐',
    generate: (originX = -200, originY = -300) => {
      const layers = [
        { num: 7, name: 'Amaliy (Application)', proto: 'HTTP, HTTPS, DNS, FTP, SSH', color: '#EF4444', bg: '#FEE2E2' },
        { num: 6, name: 'Taqdimot (Presentation)', proto: 'SSL/TLS, JPEG, ASCII, MPEG', color: '#F97316', bg: '#FFEDD5' },
        { num: 5, name: 'Seans (Session)', proto: 'NetBIOS, RPC, Sockets', color: '#F59E0B', bg: '#FEF3C7' },
        { num: 4, name: 'Transport', proto: 'TCP, UDP, Portlar (80, 443)', color: '#10B981', bg: '#D1FAE5' },
        { num: 3, name: 'Tarmoq (Network)', proto: 'IP (IPv4/IPv6), ICMP, OSPF, BGP', color: '#06B6D4', bg: '#CFFAFE' },
        { num: 2, name: 'Kanal (Data Link)', proto: 'Ethernet, Wi-Fi, MAC, VLAN', color: '#3B82F6', bg: '#DBEAFE' },
        { num: 1, name: 'Jismoniy (Physical)', proto: 'Optik tola, UTP kabel, Bitlar', color: '#8B5CF6', bg: '#EDE9FE' }
      ];

      const objects = [];
      const w = 480;
      const h = 64;
      const gap = 16;

      layers.forEach((l, i) => {
        const y = originY + i * (h + gap);
        // Blok to'rtburchagi
        objects.push({
          type: 'rect',
          x: originX,
          y: y,
          width: w,
          height: h,
          color: l.color,
          strokeWidth: 2,
          filled: true,
          fillColor: l.bg
        });
        // Qatlam raqami va nomi
        objects.push({
          type: 'text',
          x: originX + 16,
          y: y + 12,
          text: `Qatlam ${l.num}: ${l.name}`,
          color: '#0F172A',
          fontSize: 15,
          fontWeight: 700
        });
        // Protokollar
        objects.push({
          type: 'text',
          x: originX + 16,
          y: y + 36,
          text: `Protokollar: ${l.proto}`,
          color: l.color,
          fontSize: 12,
          fontWeight: 600
        });
      });
      return objects;
    }
  },

  // 2. Yulduzsimon Tarmoq Topologiyasi
  star_topology: {
    id: 'star_topology',
    title: '⭐ Yulduzsimon Tarmoq Topologiyasi',
    desc: 'Markaziy Switch va unga ulangan 5 ta ishchi stansiya',
    icon: '⭐',
    generate: (originX = 0, originY = 0) => {
      const objects = [];
      // Markaziy Switch
      objects.push({
        type: 'net_node',
        x: originX,
        y: originY,
        nodeType: 'switch',
        label: 'Markaziy Switch',
        ip: '192.168.1.1'
      });

      // 5 ta atrofidagi PC
      const radius = 220;
      for (let i = 0; i < 5; i++) {
        const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
        const px = originX + radius * Math.cos(angle);
        const py = originY + radius * Math.sin(angle);

        // Bog'lovchi chiziq
        objects.push({
          type: 'line',
          x1: originX,
          y1: originY,
          x2: px,
          y2: py,
          color: '#38BDF8',
          strokeWidth: 2
        });

        // PC tuguni
        objects.push({
          type: 'net_node',
          x: px,
          y: py,
          nodeType: 'pc',
          label: `PC-${i + 1}`,
          ip: `192.168.1.${10 + i}`
        });
      }
      return objects;
    }
  },

  // 3. Client-Server Arxitekturasi
  client_server: {
    id: 'client_server',
    title: '💻 Client-Server Arxitekturasi',
    desc: 'Mijoz brauzeri, Internet buluti, Web Server va Maʼlumotlar bazasi',
    icon: '💻',
    generate: (originX = -300, originY = 0) => {
      const objects = [];
      // 1. Client
      objects.push({ type: 'net_node', x: originX, y: originY, nodeType: 'pc', label: 'Client (Brauzer)', ip: '192.168.1.50' });
      // 2. Cloud (Internet)
      objects.push({ type: 'net_node', x: originX + 240, y: originY, nodeType: 'cloud', label: 'Internet WAN', ip: 'Global IP' });
      // 3. Web Server
      objects.push({ type: 'net_node', x: originX + 480, y: originY, nodeType: 'server', label: 'Web Server (Nginx)', ip: '10.0.0.10' });
      // 4. Database
      objects.push({ type: 'net_node', x: originX + 680, y: originY, nodeType: 'server', label: 'PostgreSQL DB', ip: '10.0.0.20' });

      // Bog'lovchi strelkalar (So'rov va Javob)
      objects.push({ type: 'arrow', x1: originX + 40, y1: originY - 10, x2: originX + 200, y2: originY - 10, color: '#10B981', strokeWidth: 3 });
      objects.push({ type: 'arrow', x1: originX + 280, y1: originY - 10, x2: originX + 440, y2: originY - 10, color: '#10B981', strokeWidth: 3 });
      objects.push({ type: 'arrow', x1: originX + 520, y1: originY, x2: originX + 640, y2: originY, color: '#F59E0B', strokeWidth: 3 });

      // Tavsif stikeri
      objects.push({
        type: 'sticky',
        x: originX + 120,
        y: originY + 80,
        width: 220,
        height: 100,
        bgColor: '#FEF08A',
        textColor: '#1E293B',
        text: 'HTTPS GET /api/data\nTLS 1.3 shifrlangan kanal orqali xavfsiz so‘rov'
      });
      return objects;
    }
  },

  // 4. TCP 3-Way Handshake
  tcp_handshake: {
    id: 'tcp_handshake',
    title: '🤝 TCP 3-Way Handshake',
    desc: 'Mijoz va Server o‘rtasida ulanish o‘rnatish bosqichlari (SYN, SYN-ACK, ACK)',
    icon: '🤝',
    generate: (originX = -200, originY = -200) => {
      const objects = [];
      // Vertikal chiziqlar (Client & Server timeline)
      objects.push({ type: 'net_node', x: originX, y: originY, nodeType: 'pc', label: 'CLIENT', ip: 'Port: 54321' });
      objects.push({ type: 'net_node', x: originX + 400, y: originY, nodeType: 'server', label: 'SERVER', ip: 'Port: 80/443' });

      objects.push({ type: 'line', x1: originX, y1: originY + 40, x2: originX, y2: originY + 360, color: '#64748B', strokeWidth: 2 });
      objects.push({ type: 'line', x1: originX + 400, y1: originY + 40, x2: originX + 400, y2: originY + 360, color: '#64748B', strokeWidth: 2 });

      // 1-qadam: SYN
      objects.push({ type: 'arrow', x1: originX, y1: originY + 100, x2: originX + 400, y2: originY + 160, color: '#38BDF8', strokeWidth: 3 });
      objects.push({ type: 'text', x: originX + 130, y: originY + 105, text: '1. SYN (seq=100)', color: '#38BDF8', fontSize: 13, fontWeight: 700 });

      // 2-qadam: SYN-ACK
      objects.push({ type: 'arrow', x1: originX + 400, y1: originY + 180, x2: originX, y2: originY + 240, color: '#10B981', strokeWidth: 3 });
      objects.push({ type: 'text', x: originX + 110, y: originY + 185, text: '2. SYN-ACK (seq=300, ack=101)', color: '#10B981', fontSize: 13, fontWeight: 700 });

      // 3-qadam: ACK
      objects.push({ type: 'arrow', x1: originX, y1: originY + 260, x2: originX + 400, y2: originY + 320, color: '#F59E0B', strokeWidth: 3 });
      objects.push({ type: 'text', x: originX + 140, y: originY + 265, text: '3. ACK (ack=301)', color: '#F59E0B', fontSize: 13, fontWeight: 700 });

      // Status
      objects.push({ type: 'text', x: originX + 120, y: originY + 340, text: '✅ ESTABLISHED (Ulanish faol)', color: '#10B981', fontSize: 14, fontWeight: 700 });
      return objects;
    }
  },

  // 5. Algoritm Blok-Sxemasi (Flowchart)
  flowchart: {
    id: 'flowchart',
    title: '🔄 Algoritm Blok-Sxemasi',
    desc: 'Boshlanish, maʼlumot kiritish, shartni tekshirish, hisoblash va natija',
    icon: '🔄',
    generate: (originX = 0, originY = -220) => {
      const objects = [];
      const w = 180;
      const h = 56;

      // 1. Boshlanish
      objects.push({ type: 'circle', x: originX - 70, y: originY, radiusX: 70, radiusY: 28, color: '#10B981', strokeWidth: 2, filled: true, fillColor: 'rgba(16,185,129,0.2)' });
      objects.push({ type: 'text', x: originX - 44, y: originY + 18, text: 'Boshlash', color: '#F8FAFC', fontSize: 14, fontWeight: 700 });

      objects.push({ type: 'arrow', x1: originX, y1: originY + 56, x2: originX, y2: originY + 100, color: '#64748B', strokeWidth: 2 });

      // 2. Kiritish
      objects.push({ type: 'rect', x: originX - 90, y: originY + 100, width: w, height: h, color: '#38BDF8', strokeWidth: 2, filled: true, fillColor: 'rgba(56,189,248,0.2)' });
      objects.push({ type: 'text', x: originX - 60, y: originY + 118, text: 'A va B ni kiritish', color: '#F8FAFC', fontSize: 13, fontWeight: 600 });

      objects.push({ type: 'arrow', x1: originX, y1: originY + 156, x2: originX, y2: originY + 200, color: '#64748B', strokeWidth: 2 });

      // 3. Shart (Romb)
      objects.push({ type: 'diamond', x: originX - 90, y: originY + 200, width: w, height: 76, color: '#F59E0B', strokeWidth: 2, filled: true, fillColor: 'rgba(245,158,11,0.2)' });
      objects.push({ type: 'text', x: originX - 40, y: originY + 228, text: 'A > B mi?', color: '#F8FAFC', fontSize: 13, fontWeight: 700 });

      // Ha / Yo'q shoxlari
      objects.push({ type: 'arrow', x1: originX + 90, y1: originY + 238, x2: originX + 180, y2: originY + 238, color: '#10B981', strokeWidth: 2 });
      objects.push({ type: 'text', x: originX + 110, y: originY + 218, text: 'Ha (Max=A)', color: '#10B981', fontSize: 11, fontWeight: 600 });

      objects.push({ type: 'arrow', x1: originX, y1: originY + 276, x2: originX, y2: originY + 340, color: '#EF4444', strokeWidth: 2 });
      objects.push({ type: 'text', x: originX + 8, y: originY + 295, text: 'Yo‘q (Max=B)', color: '#EF4444', fontSize: 11, fontWeight: 600 });
      return objects;
    }
  },

  // 6. SWOT Tahlil Matritsasi
  swot: {
    id: 'swot',
    title: '📈 SWOT Tahlil Matritsasi',
    desc: 'Kuchli tomonlar (S), Zaifliklar (W), Imkoniyatlar (O), Xavflar (T)',
    icon: '📈',
    generate: (originX = -240, originY = -180) => {
      const objects = [];
      const w = 220;
      const h = 160;
      const gap = 20;

      // S - Strengths
      objects.push({ type: 'sticky', x: originX, y: originY, width: w, height: h, bgColor: '#BBF7D0', textColor: '#064E3B', text: '💪 KUCHLI TOMONLAR (S)\n• Yuqori tezlikdagi tarmoq\n• 3D interaktiv laboratoriya\n• Tajribali muhandislar' });
      // W - Weaknesses
      objects.push({ type: 'sticky', x: originX + w + gap, y: originY, width: w, height: h, bgColor: '#FECDD3', textColor: '#881337', text: '⚠️ ZAIF TOMONLAR (W)\n• Eski marshrutizatorlar\n• Zaxira quvvat manbai yetishmovchiligi\n• Hujjatlarning to‘liq emasligi' });
      // O - Opportunities
      objects.push({ type: 'sticky', x: originX, y: originY + h + gap, width: w, height: h, bgColor: '#BAE6FD', textColor: '#0C4A6E', text: '🚀 IMKONIYATLAR (O)\n• Wi-Fi 6 ga modernizatsiya\n• Bulutli boshqaruv tatbiqi\n• Yangi grant va investitsiya' });
      // T - Threats
      objects.push({ type: 'sticky', x: originX + w + gap, y: originY + h + gap, width: w, height: h, bgColor: '#FEF08A', textColor: '#713F12', text: '🛡️ XAVF-XATARLAR (T)\n• Kiberhujumlar va DDoS\n• Elektr taʼminoti uzilishlari\n• Apparat nosozliklari' });

      return objects;
    }
  },

  // 7. Matematika va Fizika Asosiy Formulalari
  math_formulas: {
    id: 'math_formulas',
    title: '📐 Matematika va Fizika Formulalari',
    desc: 'Pifagor, Eynshteyn (E=mc²), Ohm qonuni, Kvadrat tenglama, Eyler tengligi, Shennon sig‘imi',
    icon: '📐',
    generate: (originX = -320, originY = -220) => {
      const objects = [];
      const formulas = [
        { latex: 'a^2 + b^2 = c^2', title: 'Pifagor Teoremasi', color: '#10B981', desc: 'To‘g‘ri burchakli uchburchak' },
        { latex: 'E = mc^2', title: 'Eynshteyn Formulasi', color: '#38BDF8', desc: 'Massa va energiya' },
        { latex: 'I = \\frac{U}{R}', title: 'Ohm Qonuni', color: '#F59E0B', desc: 'Zanjir qismidagi tok kuchi' },
        { latex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}', title: 'Kvadrat Tenglama', color: '#EF4444', desc: 'Ildizlarni topish formulasi' },
        { latex: 'C = B \\log_2(1 + \\text{SNR})', title: 'Shennon Sig‘imi', color: '#A855F7', desc: 'Tarmoq kanal o‘tkazuvchanligi' },
        { latex: 'e^{i\\pi} + 1 = 0', title: 'Eyler Tengligi', color: '#EC4899', desc: 'Matematikaning 5 ta muhim soni' }
      ];

      const cols = 2;
      const w = 310;
      const h = 100;
      const gapX = 30;
      const gapY = 24;

      formulas.forEach((f, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = originX + col * (w + gapX);
        const y = originY + row * (h + gapY);

        objects.push({
          type: 'formula',
          x: x,
          y: y,
          width: w,
          height: h,
          latex: f.latex,
          color: f.color,
          fontSize: 24
        });

        objects.push({
          type: 'text',
          x: x + 10,
          y: y + h - 20,
          text: `• ${f.title}: ${f.desc}`,
          color: '#94A3B8',
          fontSize: 11,
          fontWeight: 600
        });
      });

      return objects;
    }
  },

  // 8. Tarmoq Xavfsizligi & DMZ Zonasi
  network_security: {
    id: 'network_security',
    title: '🛡️ Tarmoq Xavfsizligi & DMZ Zonasi',
    desc: 'Internet, Tashqi Firewall, DMZ (Web/Mail server), Ichki Firewall, DB Server va VPN',
    icon: '🛡️',
    generate: (originX = -380, originY = -120) => {
      const objects = [];
      // DMZ va Ichki Tarmoq fon zonalari
      objects.push({
        type: 'rect',
        x: originX + 220,
        y: originY - 60,
        width: 260,
        height: 280,
        color: '#F59E0B',
        strokeWidth: 2,
        filled: true,
        fillColor: 'rgba(245, 158, 11, 0.08)'
      });
      objects.push({
        type: 'text',
        x: originX + 240,
        y: originY - 40,
        text: '🛡️ DMZ Zonasi (Ommaviy Serverlar)',
        color: '#F59E0B',
        fontSize: 12,
        fontWeight: 700
      });

      objects.push({
        type: 'rect',
        x: originX + 560,
        y: originY - 60,
        width: 280,
        height: 280,
        color: '#10B981',
        strokeWidth: 2,
        filled: true,
        fillColor: 'rgba(16, 185, 129, 0.08)'
      });
      objects.push({
        type: 'text',
        x: originX + 580,
        y: originY - 40,
        text: '🔒 Ichki Himoyalangan LAN',
        color: '#10B981',
        fontSize: 12,
        fontWeight: 700
      });

      // Tugunlar
      objects.push({ type: 'net_node', x: originX, y: originY + 60, nodeType: 'cloud', label: 'Internet (WAN)', ip: 'Global Wan' });
      objects.push({ type: 'net_node', x: originX + 130, y: originY + 60, nodeType: 'firewall', label: 'Tashqi Firewall', ip: '192.168.100.1' });
      objects.push({ type: 'net_node', x: originX + 310, y: originY + 10, nodeType: 'server', label: 'Web Server', ip: '172.16.1.10' });
      objects.push({ type: 'net_node', x: originX + 310, y: originY + 120, nodeType: 'server', label: 'Mail Server', ip: '172.16.1.20' });
      objects.push({ type: 'net_node', x: originX + 490, y: originY + 60, nodeType: 'firewall', label: 'Ichki Firewall', ip: '172.16.1.1' });
      objects.push({ type: 'net_node', x: originX + 660, y: originY + 10, nodeType: 'server', label: 'SQL Database', ip: '10.0.0.5' });
      objects.push({ type: 'net_node', x: originX + 660, y: originY + 120, nodeType: 'pc', label: 'Admin PC', ip: '10.0.0.50' });

      // Aloqa chiziqlari
      objects.push({ type: 'arrow', x1: originX + 30, y1: originY + 60, x2: originX + 100, y2: originY + 60, color: '#EF4444', strokeWidth: 2 });
      objects.push({ type: 'arrow', x1: originX + 160, y1: originY + 50, x2: originX + 270, y2: originY + 20, color: '#38BDF8', strokeWidth: 2 });
      objects.push({ type: 'arrow', x1: originX + 160, y1: originY + 70, x2: originX + 270, y2: originY + 110, color: '#38BDF8', strokeWidth: 2 });
      objects.push({ type: 'arrow', x1: originX + 350, y1: originY + 20, x2: originX + 460, y2: originY + 50, color: '#F59E0B', strokeWidth: 2 });
      objects.push({ type: 'arrow', x1: originX + 520, y1: originY + 50, x2: originX + 620, y2: originY + 20, color: '#10B981', strokeWidth: 2 });
      objects.push({ type: 'arrow', x1: originX + 520, y1: originY + 70, x2: originX + 620, y2: originY + 110, color: '#10B981', strokeWidth: 2 });

      // Stiker izoh
      objects.push({
        type: 'sticky',
        x: originX,
        y: originY + 170,
        width: 210,
        height: 110,
        bgColor: '#FEF08A',
        textColor: '#1E293B',
        text: '🛡️ DMZ QOIDASI:\nTashqaridan faqat DMZ serverlariga ruxsat bor. Ichki LAN ga to‘g‘ridan-to‘g‘ri kirish qatʼiyan taqiqlangan.'
      });

      return objects;
    }
  },

  // 9. Agile Kanban Loyiha Doskasi
  kanban_board: {
    id: 'kanban_board',
    title: '📋 Agile Kanban Doskasi (Loyiha Rejasi)',
    desc: '4 ta ustun: Rejadagi ishlar, Jarayonda, Sinovda va Bajarildi stikerlari',
    icon: '📋',
    generate: (originX = -440, originY = -220) => {
      const objects = [];
      const cols = [
        { title: '📌 REJADA (TO DO)', color: '#38BDF8', bg: 'rgba(56, 189, 248, 0.08)' },
        { title: '⚡ JARAYONDA (DOING)', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.08)' },
        { title: '🧪 SINOVDA (TESTING)', color: '#A855F7', bg: 'rgba(168, 85, 247, 0.08)' },
        { title: '✅ BAJARILDI (DONE)', color: '#10B981', bg: 'rgba(16, 185, 129, 0.08)' }
      ];

      const colW = 210;
      const colH = 420;
      const gap = 16;

      cols.forEach((col, i) => {
        const cx = originX + i * (colW + gap);
        objects.push({
          type: 'rect',
          x: cx,
          y: originY,
          width: colW,
          height: colH,
          color: col.color,
          strokeWidth: 2,
          filled: true,
          fillColor: col.bg
        });
        objects.push({
          type: 'text',
          x: cx + 12,
          y: originY + 16,
          text: col.title,
          color: col.color,
          fontSize: 12,
          fontWeight: 700
        });
        objects.push({
          type: 'line',
          x1: cx,
          y1: originY + 40,
          x2: cx + colW,
          y2: originY + 40,
          color: col.color,
          strokeWidth: 1.5
        });
      });

      // Ustunlardagi stikerlar
      objects.push({ type: 'sticky', x: originX + 12, y: originY + 54, width: 186, height: 95, bgColor: '#BAE6FD', textColor: '#0C4A6E', text: '📝 Topshiriq #1:\nIPv6 marshrutlash jadvalini sozlash' });
      objects.push({ type: 'sticky', x: originX + 12, y: originY + 165, width: 186, height: 95, bgColor: '#BAE6FD', textColor: '#0C4A6E', text: '📡 Topshiriq #2:\nWi-Fi 6 qamrov zonasini o‘rganish' });
      objects.push({ type: 'sticky', x: originX + colW + gap + 12, y: originY + 54, width: 186, height: 95, bgColor: '#FEF08A', textColor: '#713F12', text: '⚙️ Bajarilmoqda:\nFirewall ACL filtr qoidalarini yozish' });
      objects.push({ type: 'sticky', x: originX + (colW + gap) * 2 + 12, y: originY + 54, width: 186, height: 95, bgColor: '#DDD6FE', textColor: '#4C1D95', text: '🔍 Tekshirilmoqda:\nPacket Tracer yuklama testi' });
      objects.push({ type: 'sticky', x: originX + (colW + gap) * 3 + 12, y: originY + 54, width: 186, height: 95, bgColor: '#BBF7D0', textColor: '#064E3B', text: '🎉 Muvaffaqiyatli:\nOSI modeli taqdimoti yakunlandi' });

      return objects;
    }
  },

  // 10. Telekommunikatsiya & Tarmoqlar Mindmap
  telecom_mindmap: {
    id: 'telecom_mindmap',
    title: '🧠 Telekommunikatsiya & Tarmoqlar Aqliy Daraxti',
    desc: 'Markaziy ATT-25 tuguni va 4 yo‘nalish: Protokollar, Simsiz Aloqa, Xavfsizlik va Bulut',
    icon: '🧠',
    generate: (originX = 0, originY = 0) => {
      const objects = [];
      const cw = 200, ch = 56;
      objects.push({
        type: 'rect',
        x: originX - cw / 2,
        y: originY - ch / 2,
        width: cw,
        height: ch,
        color: '#00FF87',
        strokeWidth: 3,
        filled: true,
        fillColor: 'rgba(0, 255, 135, 0.15)'
      });
      objects.push({
        type: 'text',
        x: originX - 86,
        y: originY - 6,
        text: 'ATT-25 TARMOQLAR',
        color: '#00FF87',
        fontSize: 14,
        fontWeight: 800
      });

      const branches = [
        { name: '🌐 TARMOQ PROTOKOLLARI', items: '• TCP / UDP\n• IPv4 va IPv6\n• BGP, OSPF, RIP\n• DNS, DHCP', x: originX - 340, y: originY - 170, color: '#38BDF8' },
        { name: '📡 SIMSIZ ALOQA & 5G', items: '• 5G NR va LTE\n• Wi-Fi 6 va Wi-Fi 7\n• Sunʼiy Yo‘ldosh\n• Modulyatsiya (QAM)', x: originX + 160, y: originY - 170, color: '#F59E0B' },
        { name: '🔒 KIBERXAVFSIZLIK', items: '• Next-Gen Firewall\n• VPN (IPsec, Wireguard)\n• IDS / IPS tizimlari\n• Shifrlash (AES, RSA)', x: originX - 340, y: originY + 80, color: '#EF4444' },
        { name: '☁️ BULUT & SERVERTARMOQ', items: '• SDN (Dasturiy tarmoq)\n• NFV virtualizatsiya\n• Docker va Kubernetes\n• CDN va Balansirovka', x: originX + 160, y: originY + 80, color: '#A855F7' }
      ];

      branches.forEach(b => {
        const targetCenterX = b.x + 95;
        const targetCenterY = b.y + 55;
        objects.push({
          type: 'line',
          x1: originX,
          y1: originY,
          x2: targetCenterX,
          y2: targetCenterY,
          color: b.color,
          strokeWidth: 2
        });
        objects.push({
          type: 'sticky',
          x: b.x,
          y: b.y,
          width: 190,
          height: 115,
          bgColor: '#1E293B',
          textColor: '#F8FAFC',
          text: `${b.name}\n\n${b.items}`
        });
      });

      return objects;
    }
  },

  // 11. Ikkilik Qidiruv Daraxti (Binary Search Tree)
  binary_tree: {
    id: 'binary_tree',
    title: '🌳 Ikkilik Qidiruv Daraxti (Binary Tree)',
    desc: 'Ildiz 50, chap shox (30, 20, 40) va o‘ng shox (70, 60, 80) hamda O(log n) izohi',
    icon: '🌳',
    generate: (originX = 0, originY = -180) => {
      const objects = [];
      const nodes = [
        { val: 50, x: originX, y: originY, level: 0 },
        { val: 30, x: originX - 140, y: originY + 90, level: 1 },
        { val: 70, x: originX + 140, y: originY + 90, level: 1 },
        { val: 20, x: originX - 200, y: originY + 180, level: 2 },
        { val: 40, x: originX - 80, y: originY + 180, level: 2 },
        { val: 60, x: originX + 80, y: originY + 180, level: 2 },
        { val: 80, x: originX + 200, y: originY + 180, level: 2 }
      ];

      const edges = [
        [0, 1], [0, 2],
        [1, 3], [1, 4],
        [2, 5], [2, 6]
      ];

      edges.forEach(([p, c]) => {
        objects.push({
          type: 'line',
          x1: nodes[p].x,
          y1: nodes[p].y,
          x2: nodes[c].x,
          y2: nodes[c].y,
          color: '#64748B',
          strokeWidth: 2
        });
      });

      nodes.forEach(n => {
        const isRoot = n.level === 0;
        objects.push({
          type: 'circle',
          x: n.x - 22,
          y: n.y - 22,
          radiusX: 22,
          radiusY: 22,
          color: isRoot ? '#10B981' : (n.val < 50 ? '#38BDF8' : '#F59E0B'),
          strokeWidth: 2,
          filled: true,
          fillColor: isRoot ? 'rgba(16,185,129,0.3)' : 'rgba(56,189,248,0.2)'
        });
        objects.push({
          type: 'text',
          x: n.x - 9,
          y: n.y - 6,
          text: String(n.val),
          color: '#FFFFFF',
          fontSize: 13,
          fontWeight: 700
        });
      });

      objects.push({
        type: 'sticky',
        x: originX - 310,
        y: originY + 220,
        width: 240,
        height: 95,
        bgColor: '#FEF08A',
        textColor: '#1E293B',
        text: '🌲 BST QOIDASI:\nChap tugunlar < Ildiz < O‘ng tugunlar.\nQidirish murakkabligi: O(log n)'
      });

      return objects;
    }
  },

  // 12. 5G Simsiz Aloqa Arxitekturasi
  wireless_5g: {
    id: 'wireless_5g',
    title: '📡 5G Simsiz Tarmoq Arxitekturasi',
    desc: 'Mobil qurilma (UE), gNodeB tayanch stansiyasi, 5G Core (UPF, AMF) va Internet',
    icon: '📡',
    generate: (originX = -320, originY = 0) => {
      const objects = [];
      objects.push({ type: 'net_node', x: originX, y: originY, nodeType: 'pc', label: '5G Smartfon (UE)', ip: '10.200.1.5' });
      objects.push({ type: 'net_node', x: originX + 200, y: originY, nodeType: 'router', label: 'gNodeB (Antenna)', ip: 'NG-RAN Tugun' });
      objects.push({ type: 'net_node', x: originX + 420, y: originY - 70, nodeType: 'server', label: '5G Core (AMF/SMF)', ip: 'Boshqaruv (CP)' });
      objects.push({ type: 'net_node', x: originX + 420, y: originY + 70, nodeType: 'server', label: 'UPF Gateway', ip: 'Foydalanuvchi (UP)' });
      objects.push({ type: 'net_node', x: originX + 640, y: originY, nodeType: 'cloud', label: 'Internet (WAN)', ip: 'Global Web' });

      objects.push({ type: 'line', x1: originX + 30, y1: originY, x2: originX + 170, y2: originY, color: '#38BDF8', strokeWidth: 3 });
      objects.push({ type: 'text', x: originX + 65, y: originY - 18, text: 'Simsiz NR (Uu)', color: '#38BDF8', fontSize: 11, fontWeight: 700 });

      objects.push({ type: 'arrow', x1: originX + 230, y1: originY - 15, x2: originX + 380, y2: originY - 55, color: '#F59E0B', strokeWidth: 2 });
      objects.push({ type: 'arrow', x1: originX + 230, y1: originY + 15, x2: originX + 380, y2: originY + 55, color: '#10B981', strokeWidth: 2 });
      objects.push({ type: 'arrow', x1: originX + 460, y1: originY + 70, x2: originX + 610, y2: originY + 10, color: '#10B981', strokeWidth: 3 });

      objects.push({
        type: 'sticky',
        x: originX + 80,
        y: originY + 120,
        width: 250,
        height: 100,
        bgColor: '#BBF7D0',
        textColor: '#064E3B',
        text: '⚡ 5G XUSUSIYATLARI:\n• Kechikish (Latency): < 1 ms\n• O‘tkazuvchanlik: 10-20 Gbit/s\n• Massive MIMO va Beamforming'
      });

      return objects;
    }
  },

  // 13. Elektr Zanjiri va Kirchhoff Qonunlari
  kirchhoff_circuit: {
    id: 'kirchhoff_circuit',
    title: '⚡ Elektr Zanjiri va Kirchhoff Qonunlari',
    desc: 'Tugunlar, parallel rezistorlar, tok oqimi va I hamda II Kirchhoff tenglamalari',
    icon: '⚡',
    generate: (originX = -260, originY = -120) => {
      const objects = [];
      const w = 360, h = 180;

      objects.push({ type: 'rect', x: originX, y: originY, width: w, height: h, color: '#38BDF8', strokeWidth: 2, filled: false, fillColor: 'transparent' });
      objects.push({ type: 'rect', x: originX + 130, y: originY - 12, width: 70, height: 24, color: '#F59E0B', strokeWidth: 2, filled: true, fillColor: 'rgba(245, 158, 11, 0.3)' });
      objects.push({ type: 'text', x: originX + 152, y: originY - 6, text: 'R1', color: '#F59E0B', fontSize: 13, fontWeight: 700 });

      objects.push({ type: 'rect', x: originX + w - 12, y: originY + 60, width: 24, height: 60, color: '#F59E0B', strokeWidth: 2, filled: true, fillColor: 'rgba(245, 158, 11, 0.3)' });
      objects.push({ type: 'text', x: originX + w - 8, y: originY + 84, text: 'R2', color: '#F59E0B', fontSize: 13, fontWeight: 700 });

      objects.push({ type: 'circle', x: originX - 16, y: originY + 70, radiusX: 16, radiusY: 16, color: '#10B981', strokeWidth: 2, filled: true, fillColor: 'rgba(16,185,129,0.3)' });
      objects.push({ type: 'text', x: originX - 6, y: originY + 76, text: 'E', color: '#10B981', fontSize: 13, fontWeight: 700 });

      objects.push({ type: 'arrow', x1: originX + 60, y1: originY, x2: originX + 110, y2: originY, color: '#EF4444', strokeWidth: 2 });
      objects.push({ type: 'text', x: originX + 80, y: originY - 18, text: 'I1 ➔', color: '#EF4444', fontSize: 11, fontWeight: 700 });

      objects.push({
        type: 'formula',
        x: originX + 20,
        y: originY + h + 30,
        width: 260,
        height: 80,
        latex: '\\sum I_{kir} = \\sum I_{chiq}',
        color: '#10B981',
        fontSize: 22
      });

      objects.push({
        type: 'sticky',
        x: originX + 310,
        y: originY + h + 20,
        width: 220,
        height: 100,
        bgColor: '#FEF08A',
        textColor: '#1E293B',
        text: '⚡ KIRCHHOFF QONUNI:\n1-Qonun (Tugunlar): ∑I = 0\n2-Qonun (Konturlar): ∑E = ∑(I · R)'
      });

      return objects;
    }
  },

  // 14. Relyatsion Ma'lumotlar Bazasi (ER Diagramma)
  database_er: {
    id: 'database_er',
    title: '🗄️ Relyatsion MB Arxitekturasi (ERD)',
    desc: 'Users, Orders va Products jadvallari orasidagi 1:N munosabatlar',
    icon: '🗄️',
    generate: (originX = -360, originY = -100) => {
      const objects = [];
      const tables = [
        {
          name: 'USERS',
          fields: ['🔑 id: INT (PK)', '• name: VARCHAR(100)', '• email: VARCHAR(150)', '• created_at: DATETIME'],
          x: originX,
          y: originY,
          color: '#38BDF8'
        },
        {
          name: 'ORDERS',
          fields: ['🔑 id: INT (PK)', '🔗 user_id: INT (FK)', '• total_price: DECIMAL', '• status: VARCHAR(20)'],
          x: originX + 250,
          y: originY,
          color: '#10B981'
        },
        {
          name: 'ORDER_ITEMS',
          fields: ['🔑 id: INT (PK)', '🔗 order_id: INT (FK)', '🔗 product_id: INT (FK)', '• quantity: INT'],
          x: originX + 500,
          y: originY,
          color: '#F59E0B'
        }
      ];

      const w = 200, h = 160;
      tables.forEach(t => {
        objects.push({
          type: 'rect',
          x: t.x,
          y: t.y,
          width: w,
          height: h,
          color: t.color,
          strokeWidth: 2,
          filled: true,
          fillColor: 'rgba(30, 41, 59, 0.9)'
        });
        objects.push({
          type: 'rect',
          x: t.x,
          y: t.y,
          width: w,
          height: 32,
          color: t.color,
          strokeWidth: 2,
          filled: true,
          fillColor: t.color
        });
        objects.push({
          type: 'text',
          x: t.x + 16,
          y: t.y + 8,
          text: `📊 ${t.name}`,
          color: '#070C14',
          fontSize: 12,
          fontWeight: 800
        });

        t.fields.forEach((f, idx) => {
          objects.push({
            type: 'text',
            x: t.x + 12,
            y: t.y + 44 + idx * 24,
            text: f,
            color: '#F8FAFC',
            fontSize: 11,
            fontWeight: 500
          });
        });
      });

      objects.push({ type: 'arrow', x1: originX + w, y1: originY + 75, x2: originX + 250, y2: originY + 75, color: '#38BDF8', strokeWidth: 2 });
      objects.push({ type: 'arrow', x1: originX + 250 + w, y1: originY + 75, x2: originX + 500, y2: originY + 75, color: '#10B981', strokeWidth: 2 });

      return objects;
    }
  },

  // 15. Akademik Dars va Taqdimot Konspekti
  lecture_plan: {
    id: 'lecture_plan',
    title: '📑 Akademik Dars va Taqdimot Konspekti',
    desc: 'Mavzu, Maqsadlar, Nazariya, Laboratoriya va Xulosa bo‘limlari',
    icon: '📑',
    generate: (originX = -320, originY = -180) => {
      const objects = [];
      objects.push({
        type: 'rect',
        x: originX,
        y: originY,
        width: 640,
        height: 48,
        color: '#38BDF8',
        strokeWidth: 2,
        filled: true,
        fillColor: 'rgba(56, 189, 248, 0.15)'
      });
      objects.push({
        type: 'text',
        x: originX + 20,
        y: originY + 14,
        text: '🎓 MA\'RUZA: KOMPYUTER TARMOQLARI VA PROTOKOLLAR',
        color: '#38BDF8',
        fontSize: 14,
        fontWeight: 800
      });

      const sections = [
        { title: '1. DARS MAQSADLARI', text: '• OSI va TCP/IP farqi\n• IP manzil turlari (A, B, C)\n• Paketlar harakatini kuzatish', bg: '#BAE6FD', textC: '#0C4A6E', x: originX, y: originY + 64 },
        { title: '2. ASOSIY TUSHUNCHALAR', text: '• Router — 3-qatlam qurilmasi\n• Switch — 2-qatlam MAC\n• Hub — fizik takrorlagich', bg: '#FEF08A', textC: '#713F12', x: originX + 330, y: originY + 64 },
        { title: '3. AMALIY LAB TOPSHIRIQLARI', text: '• Wireshark dasturida paket ushlash\n• Ping va Traceroute tahlili\n• Subnet mask hisoblash', bg: '#BBF7D0', textC: '#064E3B', x: originX, y: originY + 210 },
        { title: '4. SAVOLLAR VA XULOSA', text: '• Qaysi protokol ishonchli: TCP/UDP?\n• Nima uchun NAT kerak?\n• Uyga vazifa: Laboratoriya hisoboti', bg: '#FECDD3', textC: '#881337', x: originX + 330, y: originY + 210 }
      ];

      sections.forEach(s => {
        objects.push({
          type: 'sticky',
          x: s.x,
          y: s.y,
          width: 310,
          height: 125,
          bgColor: s.bg,
          textColor: s.textC,
          text: `${s.title}\n\n${s.text}`
        });
      });

      return objects;
    }
  }
};

window.BoardTemplates = BoardTemplates;

