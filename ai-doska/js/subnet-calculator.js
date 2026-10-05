/* ==========================================================================
   ATT-25 AI DOSKA — OFFLINE IP & SUBNET CALCULATOR (subnet-calculator.js)
   IPv4 CIDR / VLSM, Wildcard, Xostlar diapazoni, Binary va Doskaga joylash
   ========================================================================== */

class SubnetCalculator {
  static parseIp(ipStr) {
    const parts = ipStr.trim().split('.');
    if (parts.length !== 4) return null;
    const nums = parts.map(p => parseInt(p, 10));
    for (let n of nums) {
      if (isNaN(n) || n < 0 || n > 255) return null;
    }
    return nums;
  }

  static ipToInt(parts) {
    return ((parts[0] << 24) >>> 0) + ((parts[1] << 16) >>> 0) + ((parts[2] << 8) >>> 0) + (parts[3] >>> 0);
  }

  static intToIp(intVal) {
    return [
      (intVal >>> 24) & 255,
      (intVal >>> 16) & 255,
      (intVal >>> 8) & 255,
      intVal & 255
    ].join('.');
  }

  static toBinaryString(intVal) {
    const bin = (intVal >>> 0).toString(2).padStart(32, '0');
    return `${bin.substring(0,8)}.${bin.substring(8,16)}.${bin.substring(16,24)}.${bin.substring(24,32)}`;
  }

  static calculate(ipInput, cidrInput) {
    // Agar ipInput ichida "192.168.1.1/24" kabi kelgan bo'lsa
    let ipStr = ipInput;
    let cidr = parseInt(cidrInput, 10);

    if (ipInput.includes('/')) {
      const slashParts = ipInput.split('/');
      ipStr = slashParts[0];
      cidr = parseInt(slashParts[1], 10);
    }

    if (isNaN(cidr) || cidr < 0 || cidr > 32) cidr = 24;

    const parts = this.parseIp(ipStr);
    if (!parts) {
      return { success: false, message: "Noto'g'ri IPv4 manzili kiritildi!" };
    }

    const ipInt = this.ipToInt(parts);
    const maskInt = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
    const wildcardInt = (~maskInt) >>> 0;

    const networkInt = (ipInt & maskInt) >>> 0;
    const broadcastInt = (networkInt | wildcardInt) >>> 0;

    const networkIp = this.intToIp(networkInt);
    const broadcastIp = this.intToIp(broadcastInt);
    const maskIp = this.intToIp(maskInt);
    const wildcardIp = this.intToIp(wildcardInt);

    // Xostlar soni
    let totalHosts = Math.pow(2, 32 - cidr);
    let usableHosts = 0;
    let firstUsableIp = '';
    let lastUsableIp = '';

    if (cidr === 32) {
      usableHosts = 1;
      firstUsableIp = networkIp;
      lastUsableIp = networkIp;
    } else if (cidr === 31) {
      usableHosts = 2; // RFC 3021 Point-to-Point
      firstUsableIp = networkIp;
      lastUsableIp = broadcastIp;
    } else {
      usableHosts = Math.max(0, totalHosts - 2);
      firstUsableIp = this.intToIp((networkInt + 1) >>> 0);
      lastUsableIp = this.intToIp((broadcastInt - 1) >>> 0);
    }

    // IP Sinfini aniqlash (Class A, B, C, D, E)
    const firstOctet = parts[0];
    let ipClass = 'C';
    let defaultCidr = 24;
    if (firstOctet >= 1 && firstOctet <= 126) { ipClass = 'A'; defaultCidr = 8; }
    else if (firstOctet >= 128 && firstOctet <= 191) { ipClass = 'B'; defaultCidr = 16; }
    else if (firstOctet >= 192 && firstOctet <= 223) { ipClass = 'C'; defaultCidr = 24; }
    else if (firstOctet >= 224 && firstOctet <= 239) { ipClass = 'D (Multicast)'; defaultCidr = 4; }
    else if (firstOctet >= 240 && firstOctet <= 255) { ipClass = 'E (Eksperimental)'; defaultCidr = 0; }

    // Xususiy (Private) yoki Ommaviy (Public)
    let scope = 'Ommaviy (Public)';
    if (firstOctet === 10) scope = 'Xususiy (RFC 1918 Class A)';
    else if (firstOctet === 172 && parts[1] >= 16 && parts[1] <= 31) scope = 'Xususiy (RFC 1918 Class B)';
    else if (firstOctet === 192 && parts[1] === 168) scope = 'Xususiy (RFC 1918 Class C)';
    else if (firstOctet === 127) scope = 'Loopback (Mahalliy)';
    else if (firstOctet === 169 && parts[1] === 254) scope = 'APIPA (Link-Local)';

    return {
      success: true,
      inputIp: parts.join('.'),
      cidr,
      networkIp,
      broadcastIp,
      maskIp,
      wildcardIp,
      firstUsableIp,
      lastUsableIp,
      totalHosts,
      usableHosts,
      ipClass,
      defaultCidr,
      scope,
      binaryIp: this.toBinaryString(ipInt),
      binaryMask: this.toBinaryString(maskInt),
      binaryNet: this.toBinaryString(networkInt)
    };
  }

  /* ==========================================================================
     DOSKAGA FORMATLANGAN IP/SUBNET JADVALINI JOYLASH
     ========================================================================== */
  static generateBoardTable(calc, ox = 0, oy = 0) {
    if (!calc || !calc.success) return [];
    const objects = [];

    const w = 540;
    const h = 330;

    // Asosiy fon kartochkasi
    objects.push({
      type: 'rect',
      x: ox,
      y: oy,
      width: w,
      height: h,
      color: '#38BDF8',
      strokeWidth: 2,
      filled: true,
      fillColor: 'rgba(15, 23, 42, 0.94)'
    });

    // Sarlavha
    objects.push({
      type: 'rect',
      x: ox,
      y: oy,
      width: w,
      height: 48,
      color: '#38BDF8',
      strokeWidth: 1,
      filled: true,
      fillColor: 'rgba(56, 189, 248, 0.18)'
    });

    objects.push({
      type: 'text',
      x: ox + 18,
      y: oy + 14,
      text: `🌐 IP & SUBNET HISOBI: ${calc.inputIp} /${calc.cidr}`,
      color: '#38BDF8',
      fontSize: 14,
      fontWeight: 800
    });

    // Ma'lumot qatorlari
    const rows = [
      { label: 'Tarmoq Manzili (Network ID):', val: `${calc.networkIp} /${calc.cidr}`, color: '#10B981' },
      { label: 'Tarmoq Niqobi (Subnet Mask):', val: calc.maskIp, color: '#F8FAFC' },
      { label: 'Teskari Niqob (Wildcard):', val: calc.wildcardIp, color: '#F59E0B' },
      { label: 'Foydalanuvchi IP diapazoni:', val: `${calc.firstUsableIp}  ⟶  ${calc.lastUsableIp}`, color: '#00FF87' },
      { label: 'Broadcast (Tarqatish) IP:', val: calc.broadcastIp, color: '#F43F5E' },
      { label: 'Foydalanish mumkin xostlar:', val: `${calc.usableHosts.toLocaleString()} ta (${calc.totalHosts.toLocaleString()} jami)`, color: '#A855F7' },
      { label: 'IP Sinfi va Doirasi:', val: `Class ${calc.ipClass}  •  ${calc.scope}`, color: '#38BDF8' },
      { label: 'Ikkilik (Binary) Niqob:', val: calc.binaryMask, color: '#94A3B8' }
    ];

    rows.forEach((r, idx) => {
      const rowY = oy + 60 + idx * 32;

      // Zebra qator foni
      if (idx % 2 === 0) {
        objects.push({
          type: 'rect',
          x: ox + 10,
          y: rowY - 4,
          width: w - 20,
          height: 28,
          color: 'transparent',
          strokeWidth: 0,
          filled: true,
          fillColor: 'rgba(255, 255, 255, 0.03)'
        });
      }

      objects.push({
        type: 'text',
        x: ox + 18,
        y: rowY,
        text: r.label,
        color: '#94A3B8',
        fontSize: 12,
        fontWeight: 600
      });

      objects.push({
        type: 'text',
        x: ox + 240,
        y: rowY,
        text: r.val,
        color: r.color,
        fontSize: 12,
        fontWeight: 700
      });
    });

    return objects;
  }

  /* ==========================================================================
     DOSKAGA REAL TOPOLOGIYA SXEMASINI JOYLASH
     ========================================================================== */
  static generateNetworkTopology(calc, ox = 0, oy = 0) {
    if (!calc || !calc.success) return [];
    const objects = [];

    // 1. Sarlavha
    objects.push({
      type: 'rect',
      x: ox - 320,
      y: oy - 180,
      width: 640,
      height: 42,
      color: '#10B981',
      strokeWidth: 2,
      filled: true,
      fillColor: 'rgba(16, 185, 129, 0.15)'
    });
    objects.push({
      type: 'text',
      x: ox - 300,
      y: oy - 168,
      text: `🌐 TARMOQ TOPOLOGIYASI: ${calc.networkIp}/${calc.cidr} (${calc.usableHosts} xost)`,
      color: '#10B981',
      fontSize: 14,
      fontWeight: 800
    });

    // 2. Gateway Router (R1)
    objects.push({
      type: 'net_node',
      x: ox,
      y: oy - 90,
      nodeType: 'router',
      label: 'Gateway Router (R1)',
      ip: calc.firstUsableIp
    });

    // 3. Markaziy Switch (SW1)
    objects.push({
      type: 'net_node',
      x: ox,
      y: oy + 20,
      nodeType: 'switch',
      label: 'Core Switch (SW1)',
      ip: 'VLAN 1'
    });

    // Router <-> Switch kabel
    objects.push({
      type: 'arrow',
      x1: ox,
      y1: oy - 64,
      x2: ox,
      y2: oy - 6,
      color: '#10B981',
      strokeWidth: 3
    });

    // 4. Server (DHCP / DNS)
    const serverIp = calc.cidr <= 29 ? SubnetCalculator.intToIp((SubnetCalculator.ipToInt(SubnetCalculator.parseIp(calc.firstUsableIp)) + 1) >>> 0) : calc.firstUsableIp;
    objects.push({
      type: 'net_node',
      x: ox - 220,
      y: oy + 120,
      nodeType: 'server',
      label: 'DNS / Web Server',
      ip: serverIp
    });

    // 5. Ishchi Stansiya PC-1
    const pc1Ip = calc.cidr <= 29 ? SubnetCalculator.intToIp((SubnetCalculator.ipToInt(SubnetCalculator.parseIp(calc.firstUsableIp)) + 5) >>> 0) : calc.firstUsableIp;
    objects.push({
      type: 'net_node',
      x: ox,
      y: oy + 120,
      nodeType: 'pc',
      label: 'Ishchi PC-1',
      ip: pc1Ip
    });

    // 6. Ishchi Stansiya PC-2
    objects.push({
      type: 'net_node',
      x: ox + 220,
      y: oy + 120,
      nodeType: 'pc',
      label: 'Ishchi PC-2',
      ip: calc.lastUsableIp
    });

    // Switch -> Qurilmalar kabellari
    objects.push({ type: 'line', x1: ox, y1: oy + 46, x2: ox - 220, y2: oy + 94, color: '#38BDF8', strokeWidth: 2 });
    objects.push({ type: 'line', x1: ox, y1: oy + 46, x2: ox, y2: oy + 94, color: '#38BDF8', strokeWidth: 2 });
    objects.push({ type: 'line', x1: ox, y1: oy + 46, x2: ox + 220, y2: oy + 94, color: '#38BDF8', strokeWidth: 2 });

    // Stiker (Tarmoq xarakteristikasi)
    objects.push({
      type: 'sticky',
      x: ox - 320,
      y: oy + 170,
      width: 640,
      height: 90,
      bgColor: '#FEF3C7',
      textColor: '#78350F',
      text: `📌 SUBNET KO'RSATGICHLARI:\n• Mask: ${calc.maskIp}  |  Wildcard: ${calc.wildcardIp}\n• Gateway: ${calc.firstUsableIp}  |  Broadcast: ${calc.broadcastIp}\n• Ping tekshirish: ping -c 4 ${calc.firstUsableIp}`
    });

    return objects;
  }
}

if (typeof window !== 'undefined') {
  window.SubnetCalculator = SubnetCalculator;
}
