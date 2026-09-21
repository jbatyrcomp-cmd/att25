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
  }
};

window.BoardTemplates = BoardTemplates;

