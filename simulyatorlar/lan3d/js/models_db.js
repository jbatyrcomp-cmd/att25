/* ==========================================================================
   LAN 3D HARDWARE MODELS DATABASE (3D MODELLAR BAZASI) — ULTRA REALISM EDITION
   High-Fidelity 3D Models with Procedural Keyboards, Screens, Ports & Controls
   Brands: Apple, Samsung, Xiaomi/Redmi, Acer, HP, Cisco, Dell, Lenovo
   ========================================================================== */

/* ==========================================================================
   1. PROCEDURAL TEXTURE GENERATOR (HTML5 Canvas -> THREE.CanvasTexture)
   ========================================================================== */

const _screenTextureCache = new Map();
const _keyboardTextureCache = new Map();

function createScreenTexture(osType, title = '', ip = '192.168.1.10'){
  const cacheKey = `${osType}_${title}_${ip}`;
  if(_screenTextureCache.has(cacheKey)) return _screenTextureCache.get(cacheKey);

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 320;
  const ctx = canvas.getContext('2d');

  if(osType === 'windows11'){
    // Windows 11 Bloom wallpaper
    const bgGrad = ctx.createLinearGradient(0, 0, 512, 320);
    bgGrad.addColorStop(0, '#0a1128');
    bgGrad.addColorStop(0.5, '#001f54');
    bgGrad.addColorStop(1, '#034078');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 512, 320);

    // Glowing silk wave
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(100, 320);
    ctx.bezierCurveTo(200, 120, 320, 260, 440, 80);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
    ctx.lineWidth = 38;
    ctx.filter = 'blur(16px)';
    ctx.stroke();
    ctx.restore();

    // Desktop icons
    const icons = ['💾 Bu Kompyuter', '🌐 Tarmoq', '🗑️ Savatcha', '⚡ LAN 3D'];
    icons.forEach((ic, i) => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.font = '10px sans-serif';
      ctx.fillText(ic, 14, 28 + i * 36);
    });

    // Network Terminal Window in center
    ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(140, 40, 340, 210, 6);
    ctx.fill();
    ctx.stroke();

    // Terminal Title Bar
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(140, 40, 340, 24, [6, 6, 0, 0]);
    ctx.fill();
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 10px monospace';
    ctx.fillText('Command Prompt — ping 192.168.1.1', 152, 56);
    // Window control buttons
    ['#ef4444', '#f59e0b', '#10b981'].forEach((col, idx) => {
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(454 + idx * 8, 52, 3.5, 0, Math.PI * 2);
      ctx.fill();
    });

    // Terminal Content
    ctx.fillStyle = '#38bdf8';
    ctx.font = '10px monospace';
    ctx.fillText(`C:\\Users\\Admin> ipconfig`, 150, 82);
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText(`Ethernet adapter Local Area Network:`, 150, 98);
    ctx.fillText(`   IPv4 Address. . . : ${ip || '192.168.1.10'}`, 150, 114);
    ctx.fillText(`   Subnet Mask . . . : 255.255.255.0`, 150, 130);
    ctx.fillText(`   Default Gateway . : 192.168.1.1`, 150, 146);
    ctx.fillStyle = '#00ff87';
    ctx.fillText(`Reply from 192.168.1.1: bytes=32 time=1ms TTL=64`, 150, 172);
    ctx.fillText(`Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)`, 150, 188);

    // Windows 11 Taskbar
    ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
    ctx.fillRect(0, 284, 512, 36);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.beginPath();
    ctx.moveTo(0, 284);
    ctx.lineTo(512, 284);
    ctx.stroke();

    // Center Taskbar Icons
    const taskIcons = ['🪟', '🔍', '📁', '🌐', '⚙️', '💻'];
    taskIcons.forEach((tIcon, idx) => {
      ctx.font = '14px sans-serif';
      ctx.fillText(tIcon, 200 + idx * 22, 307);
    });

    // Tray Clock
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '10px sans-serif';
    ctx.fillText('12:00', 470, 300);
    ctx.fillText('20/09/2026', 450, 313);
  }
  else if(osType === 'macos'){
    // macOS Sequoia / Sonoma wallpaper
    const bgGrad = ctx.createRadialGradient(256, 160, 40, 256, 160, 320);
    bgGrad.addColorStop(0, '#ff7b00');
    bgGrad.addColorStop(0.4, '#7928ca');
    bgGrad.addColorStop(0.8, '#1e1b4b');
    bgGrad.addColorStop(1, '#090a0f');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 512, 320);

    // Top Menu Bar
    ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
    ctx.fillRect(0, 0, 512, 20);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText('  Finder  File  Edit  View  Go  Window  Help', 12, 14);
    ctx.font = '10px sans-serif';
    ctx.fillText(`📶  100%  Sat 12:00`, 425, 14);

    // Terminal / Network Utility Window
    ctx.fillStyle = 'rgba(24, 24, 27, 0.9)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.beginPath();
    ctx.roundRect(80, 45, 350, 190, 8);
    ctx.fill();
    ctx.stroke();

    // Mac Window Controls
    ['#ff5f56', '#ffbd2e', '#27c93f'].forEach((c, i) => {
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(96 + i * 14, 58, 4.5, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.fillStyle = '#a1a1aa';
    ctx.font = 'bold 10px monospace';
    ctx.fillText(`macOS Terminal — zsh — ${title || 'Apple M3 Max'}`, 150, 61);

    ctx.fillStyle = '#38bdf8';
    ctx.font = '10px monospace';
    ctx.fillText(`admin@MacBook-Pro ~ % ifconfig en0`, 94, 88);
    ctx.fillStyle = '#f4f4f5';
    ctx.fillText(`en0: flags=8863<UP,BROADCAST,SMART,RUNNING,SIMPLEX,MULTICAST>`, 94, 104);
    ctx.fillText(`     inet ${ip || '192.168.1.15'} netmask 0xffffff00 broadcast 192.168.1.255`, 94, 120);
    ctx.fillText(`     status: active (10Gbase-T full-duplex)`, 94, 136);
    ctx.fillStyle = '#00ff87';
    ctx.fillText(`admin@MacBook-Pro ~ % ping -c 3 192.168.1.1`, 94, 160);
    ctx.fillText(`64 bytes from 192.168.1.1: icmp_seq=0 ttl=64 time=0.824 ms`, 94, 176);
    ctx.fillText(`--- 192.168.1.1 ping stats: 0.0% packet loss ---`, 94, 192);

    // Floating Glass Dock
    ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.roundRect(140, 275, 232, 38, 12);
    ctx.fill();
    ctx.stroke();

    const macDock = ['🧭', '✉️', '💬', '🎵', '💻', '⚙️', '📂'];
    macDock.forEach((dIcon, idx) => {
      ctx.font = '16px sans-serif';
      ctx.fillText(dIcon, 154 + idx * 31, 300);
      // Small indicator dot under active apps
      if(idx < 4){
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(162 + idx * 31, 307, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }
  else if(osType === 'oneui'){
    // Samsung One UI 6.1 (Galaxy S24 / Tab S9)
    ctx.fillStyle = '#030712';
    ctx.fillRect(0, 0, 512, 320);

    // Ambient wallpaper wave
    const g = ctx.createLinearGradient(0, 0, 512, 320);
    g.addColorStop(0, '#0c4a6e');
    g.addColorStop(0.5, '#1e1b4b');
    g.addColorStop(1, '#020617');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 512, 320);

    // Status bar
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText('12:00', 20, 22);
    ctx.fillText('📶 5G  Wi-Fi 7  98% 🔋', 380, 22);

    // Punch hole camera
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(256, 16, 7, 0, Math.PI * 2);
    ctx.fill();

    // Galaxy AI Clock Widget
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 42px sans-serif';
    ctx.fillText('12:00', 190, 95);
    ctx.font = '13px sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Shanba, 20-Sentabr • 24°C Toshkent', 145, 122);

    // One UI App Grid
    const samApps = [
      { n:'Telefon', c:'#22c55e', i:'📞' },
      { n:'Xabar', c:'#3b82f6', i:'💬' },
      { n:'Internet', c:'#a855f7', i:'🌐' },
      { n:'Galereya', c:'#ec4899', i:'🖼️' },
      { n:'Sozlamalar', c:'#64748b', i:'⚙️' },
      { n:'LAN 3D', c:'#00ff87', i:'⚡' }
    ];
    samApps.forEach((app, i) => {
      const x = 70 + (i % 6) * 65;
      const y = 175;
      ctx.fillStyle = app.c;
      ctx.beginPath();
      ctx.roundRect(x, y, 44, 44, 12);
      ctx.fill();
      ctx.font = '18px sans-serif';
      ctx.fillText(app.i, x + 13, y + 28);
      ctx.fillStyle = '#ffffff';
      ctx.font = '9.5px sans-serif';
      ctx.fillText(app.n, x + 4, y + 58);
    });

    // IP Info Pill
    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.beginPath();
    ctx.roundRect(140, 255, 232, 26, 13);
    ctx.fill();
    ctx.fillStyle = '#38bdf8';
    ctx.font = '10.5px monospace';
    ctx.fillText(`Wi-Fi IP: ${ip || '192.168.1.45'}`, 190, 272);

    // Navigation Pill
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(206, 310, 100, 4, 2);
    ctx.fill();
  }
  else if(osType === 'hyperos'){
    // Xiaomi Redmi HyperOS
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 512, 320);

    const grad = ctx.createLinearGradient(0, 0, 512, 320);
    grad.addColorStop(0, '#4c1d95');
    grad.addColorStop(0.6, '#0f172a');
    grad.addColorStop(1, '#020617');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 320);

    // Top status
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText('12:00', 25, 22);
    ctx.fillText('5G  📶  100W ⚡ 99%', 380, 22);

    // Bold Magazine Clock
    ctx.fillStyle = '#f8fafc';
    ctx.font = '900 68px sans-serif';
    ctx.fillText('12', 170, 110);
    ctx.fillText('00', 270, 110);
    ctx.font = '13px sans-serif';
    ctx.fillStyle = '#a78bfa';
    ctx.fillText('Redmi Note 13 Pro+ 5G • HyperOS', 150, 140);

    // Floating card with Network details
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.beginPath();
    ctx.roundRect(80, 170, 352, 90, 16);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('Wi-Fi 6 Connected: Xiaomi_BE7000', 100, 198);
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '11px monospace';
    ctx.fillText(`IP: ${ip || '192.168.1.75'}  |  Gateway: 192.168.1.1`, 100, 220);
    ctx.fillStyle = '#00ff87';
    ctx.fillText(`Link Speed: 2402 Mbps (160MHz) - Excellent`, 100, 240);
  }
  else if(osType === 'server_htop'){
    // Linux htop Monitoring Console
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, 512, 320);

    ctx.fillStyle = '#00ff87';
    ctx.font = '10px monospace';
    ctx.fillText(`1  [|||||||||||||||||||||||||||||||||||||||| 62.4%]   Tasks: 184, 982 thr; 2 running`, 14, 20);
    ctx.fillText(`2  [||||||||||||||||||||||||                  41.2%]   Load average: 1.15 1.08 0.95`, 14, 34);
    ctx.fillText(`3  [||||||||||||||||||||||||||||||||          52.8%]   Uptime: 42 days, 14:22:08`, 14, 48);
    ctx.fillText(`4  [||||||||||||||||                          28.0%]   Host: ${title || 'Dell-PowerEdge-R750'}`, 14, 62);
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(`Mem[|||||||||||||||||||||||||||||      18.4G/64.0G]   IP: ${ip || '192.168.1.100'}`, 14, 78);
    ctx.fillText(`Swp[|                                   256M/8.00G]   Interface: eth0 (10Gbps)`, 14, 92);

    // Process Table Header
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(10, 106, 492, 16);
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(`  PID USER      PRI  NI  VIRT   RES   SHR S CPU% MEM%   TIME+  Command`, 14, 118);

    // Process rows
    const procs = [
      { pid: '1042', user: 'root', cpu: '14.2', mem: '4.8', cmd: '/usr/sbin/cisco_ios_sim -d' },
      { pid: '1108', user: 'nginx', cpu: '8.4', mem: '2.1', cmd: 'nginx: worker process' },
      { pid: '1240', user: 'mysql', cpu: '12.0', mem: '16.5', cmd: '/usr/sbin/mysqld --daemon' },
      { pid: '1422', user: 'admin', cpu: '4.1', mem: '1.8', cmd: 'sshd: admin@pts/0' },
      { pid: '2014', user: 'root', cpu: '2.5', mem: '3.4', cmd: 'docker-containerd -l /run' },
      { pid: '3024', user: 'vlan', cpu: '6.8', mem: '2.0', cmd: 'vlan_trunk_forwarder --8021q' },
      { pid: '4110', user: 'root', cpu: '0.8', mem: '0.4', cmd: 'htop' }
    ];
    procs.forEach((p, idx) => {
      ctx.fillStyle = (idx % 2 === 0) ? '#f8fafc' : '#94a3b8';
      ctx.fillText(` ${p.pid.padEnd(5)} ${p.user.padEnd(9)} 20   0  1.4G  128M   32M S  ${p.cpu.padEnd(4)}  ${p.mem.padEnd(4)}  14:22.08 ${p.cmd}`, 14, 138 + idx * 16);
    });

    // Bottom htop function keys
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(0, 300, 512, 20);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 9.5px monospace';
    ctx.fillText('F1 Help  F2 Setup  F3 Search  F4 Filter  F5 Tree  F6 SortBy  F9 Kill  F10 Quit', 14, 314);
  }
  else if(osType === 'cisco_oled'){
    // Cisco OLED Status Display
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, 512, 320);

    ctx.fillStyle = '#00ff87';
    ctx.font = 'bold 18px monospace';
    ctx.fillText('CISCO SYSTEMS — HARDWARE STATUS', 20, 40);
    ctx.strokeStyle = '#00ff87';
    ctx.beginPath();
    ctx.moveTo(20, 52);
    ctx.lineTo(492, 52);
    ctx.stroke();

    ctx.font = '14px monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(`MODEL: ${title || 'Catalyst 9300'}`, 20, 85);
    ctx.fillText(`IP ADDR: ${ip || '192.168.1.254'}`, 20, 115);
    ctx.fillText(`VLAN ACTIVE: 1, 10, 20, 30`, 20, 145);
    ctx.fillText(`TRUNK 802.1Q: Gi0/1 - UP`, 20, 175);

    ctx.fillStyle = '#f59e0b';
    ctx.fillText(`FAN: 3800 RPM [NORMAL]`, 20, 215);
    ctx.fillText(`TEMP: 32°C [OPTIMAL]`, 20, 245);
    ctx.fillStyle = '#00ff87';
    ctx.fillText(`POWER: PoE+ 740W ACTIVE`, 20, 275);
  }
  else if(osType === 'printer_touch'){
    // HP LaserJet Enterprise MFP Touchscreen
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, 512, 320);

    // HP Blue Header
    ctx.fillStyle = '#0096d6';
    ctx.fillRect(0, 0, 512, 45);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('HP LaserJet Enterprise MFP M528', 16, 28);
    ctx.font = '12px sans-serif';
    ctx.fillText(`🟢 Tayyor | IP: ${ip || '192.168.1.50'}`, 330, 28);

    // Function Tiles
    const tiles = [
      { t: 'Nusxa Olish', i: '📄', c: '#e0f2fe', tc: '#0284c7' },
      { t: 'Elektron Pochtaga', i: '✉️', c: '#f0fdf4', tc: '#16a34a' },
      { t: 'USB Xotiradan', i: '💾', c: '#fef3c7', tc: '#d97706' },
      { t: 'Faks Yuborish', i: '📠', c: '#f3e8ff', tc: '#9333ea' }
    ];
    tiles.forEach((tl, i) => {
      const x = 30 + (i % 2) * 235;
      const y = 65 + Math.floor(i / 2) * 95;
      ctx.fillStyle = tl.c;
      ctx.beginPath();
      ctx.roundRect(x, y, 215, 80, 10);
      ctx.fill();
      ctx.font = '28px sans-serif';
      ctx.fillText(tl.i, x + 16, y + 50);
      ctx.fillStyle = tl.tc;
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText(tl.t, x + 65, y + 46);
    });

    // Toner Gauge
    ctx.fillStyle = '#334155';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText('Qora Toner (HP 89X): 92%', 30, 280);
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.roundRect(30, 290, 452, 14, 7);
    ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(30, 290, 415, 14, 7);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  _screenTextureCache.set(cacheKey, texture);
  return texture;
}

function createKeyboardTexture(type = 'standard', isRgb = false){
  const cacheKey = `${type}_${isRgb}`;
  if(_keyboardTextureCache.has(cacheKey)) return _keyboardTextureCache.get(cacheKey);

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 200;
  const ctx = canvas.getContext('2d');

  // Base plate
  ctx.fillStyle = type === 'apple_silver' ? '#d1d5db' : '#0f172a';
  ctx.fillRect(0, 0, 512, 200);

  // RGB Backlight glow
  if(isRgb){
    const grad = ctx.createLinearGradient(0, 0, 512, 200);
    grad.addColorStop(0, 'rgba(239, 68, 68, 0.45)');
    grad.addColorStop(0.25, 'rgba(234, 179, 8, 0.45)');
    grad.addColorStop(0.5, 'rgba(34, 197, 94, 0.45)');
    grad.addColorStop(0.75, 'rgba(56, 189, 248, 0.45)');
    grad.addColorStop(1, 'rgba(168, 85, 247, 0.45)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 200);
  }

  // Keycap rendering
  const keyColor = type === 'apple_silver' ? '#f3f4f6' : '#1e293b';
  const textColor = type === 'apple_silver' ? '#1f2937' : '#94a3b8';

  // Function row (Esc, F1-F12)
  for(let c = 0; c < 14; c++){
    ctx.fillStyle = keyColor;
    ctx.beginPath();
    ctx.roundRect(14 + c * 34, 10, 28, 18, 3);
    ctx.fill();
    ctx.fillStyle = textColor;
    ctx.font = '8px monospace';
    ctx.fillText(c === 0 ? 'ESC' : `F${c}`, 18 + c * 34, 22);
  }

  // Main 4 keyboard rows (QWERTY layout)
  const rows = [
    ['~', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'BACK'],
    ['TAB', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'],
    ['CAPS', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", 'ENTER'],
    ['SHIFT', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'SHIFT']
  ];

  rows.forEach((r, rIdx) => {
    let curX = 14;
    const y = 35 + rIdx * 30;
    r.forEach((k) => {
      const w = (k === 'BACK' || k === 'TAB' || k === 'CAPS' || k === 'ENTER' || k === 'SHIFT') ? 48 : 28;
      // Gaming WASD highlight
      if(isRgb && (k === 'W' || k === 'A' || k === 'S' || k === 'D')){
        ctx.fillStyle = '#38bdf8';
      } else {
        ctx.fillStyle = keyColor;
      }
      ctx.beginPath();
      ctx.roundRect(curX, y, w, 24, 3);
      ctx.fill();

      ctx.fillStyle = (isRgb && (k === 'W' || k === 'A' || k === 'S' || k === 'D')) ? '#000000' : textColor;
      ctx.font = 'bold 9px monospace';
      ctx.fillText(k, curX + 6, y + 16);
      curX += w + 6;
    });
  });

  // Bottom row (Ctrl, Alt, Space, etc.)
  ctx.fillStyle = keyColor;
  ctx.beginPath();
  ctx.roundRect(14, 155, 42, 26, 3);
  ctx.roundRect(62, 155, 38, 26, 3);
  ctx.roundRect(106, 155, 230, 26, 4); // SPACEBAR
  ctx.roundRect(342, 155, 38, 26, 3);
  ctx.roundRect(386, 155, 42, 26, 3);
  ctx.fill();

  // ThinkPad TrackPoint (Red Dot)
  if(type === 'thinkpad'){
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(238, 105, 5.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#991b1b';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = true;
  _keyboardTextureCache.set(cacheKey, texture);
  return texture;
}

/* ==========================================================================
   2. PROCEDURAL 3D PORT & HARDWARE BUILDERS
   ========================================================================== */

function buildRj45Port(label = ''){
  const g = new THREE.Group();
  // Shielded Metal Port Cage
  const cage = box(0.08, 0.065, 0.075, mat(0x94A3B8, {metalness:0.85, roughness:0.25}));
  g.add(cage);

  // Dark Inner Jack Cavity
  const cavity = box(0.062, 0.046, 0.06, mat(0x0A0F17, {roughness:0.9}));
  cavity.position.z = 0.01;
  g.add(cavity);

  // 8 Gold Contact Pins
  const pins = box(0.044, 0.008, 0.04, mat(0xF59E0B, {metalness:0.95, roughness:0.1}));
  pins.position.set(0, 0.015, 0.015);
  g.add(pins);

  // Dual Status LEDs (Link = Green, Activity = Amber)
  const ledL = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.008, 0.005), emissiveMat(0x00FF87, 2.5));
  ledL.position.set(-0.026, 0.026, 0.038);
  const ledR = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.008, 0.005), emissiveMat(0xFFB454, 2.0));
  ledR.position.set(0.026, 0.026, 0.038);
  g.add(ledL, ledR);

  return g;
}

function buildSfpCage(){
  const g = new THREE.Group();
  const cage = box(0.075, 0.06, 0.12, mat(0x64748B, {metalness:0.9, roughness:0.2}));
  const latch = box(0.055, 0.015, 0.04, mat(0x00FF87));
  latch.position.set(0, 0.025, -0.04);
  g.add(cage, latch);
  return g;
}

function buildUsbCPort(){
  const g = new THREE.Group();
  const rim = box(0.042, 0.018, 0.02, mat(0x94A3B8, {metalness:0.9}));
  const inner = box(0.034, 0.01, 0.022, mat(0x0F172A));
  const tongue = box(0.024, 0.003, 0.015, mat(0xD1D5DB, {metalness:0.95}));
  g.add(rim, inner, tongue);
  return g;
}

function buildUsbAPort(){
  const g = new THREE.Group();
  const rim = box(0.065, 0.028, 0.025, mat(0x94A3B8, {metalness:0.9}));
  const inner = box(0.055, 0.018, 0.028, mat(0x0F172A));
  const blueTongue = box(0.045, 0.008, 0.018, mat(0x0284C7)); // USB 3.0 Blue
  blueTongue.position.y = 0.005;
  g.add(rim, inner, blueTongue);
  return g;
}

function buildAntennaMesh(height = 0.65){
  const g = new THREE.Group();
  // Gold SMA connector
  const sma = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.035, 12), mat(0xF59E0B, {metalness:0.95}));
  sma.position.y = 0.0175;
  // Knurled Knuckle joint
  const joint = new THREE.Mesh(new THREE.SphereGeometry(0.026, 12, 12), mat(0x1E293B, {metalness:0.5}));
  joint.position.y = 0.045;
  // Matte Antenna Shaft
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.024, height, 12), mat(0x0F172A, {roughness:0.7}));
  shaft.position.y = 0.045 + height / 2;
  g.add(sma, joint, shaft);
  return g;
}

function buildPowerButton(color = 0x38BDF8){
  const g = new THREE.Group();
  const bezel = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.032, 0.01, 16), mat(0x334155, {metalness:0.8}));
  bezel.rotation.x = Math.PI / 2;
  const btn = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.012, 16), mat(0x0F172A, {metalness:0.5}));
  btn.rotation.x = Math.PI / 2;
  const ring = new THREE.Mesh(new THREE.RingGeometry(0.014, 0.019, 16), emissiveMat(color, 2.8));
  ring.position.z = 0.008;
  g.add(bezel, btn, ring);
  return g;
}

/* ==========================================================================
   3. MODELS DATABASE DEFINITION (APPLE, SAMSUNG, ACER, HP, CISCO, XIAOMI)
   ========================================================================== */

const MODELS_DB = {
  /* ── 1. DESKTOP & WORKSTATION ── */
  desktop: {
    // 1. Apple iMac 24" M3
    apple_imac_24: {
      name: "Apple iMac 24\" M3 All-in-One",
      brand: "Apple",
      category: "desktop",
      desc: "Yupqa 11.5mm unibody alyuminiy korpus, 4.5K Retina ekran (macOS Sequoia), Magic Keyboard va Magic Mouse 2.",
      ports: ["Fa0/1", "Gi0/1"],
      builder: function(){
        const g = new THREE.Group();
        // Aluminum L-Stand
        const standBase = box(0.32, 0.012, 0.24, mat(0xE2E8F0, {metalness:0.9, roughness:0.2}));
        standBase.position.set(0, 0.15, 0);
        const standArm = box(0.14, 0.42, 0.016, mat(0xE2E8F0, {metalness:0.9, roughness:0.2}));
        standArm.position.set(0, 0.34, -0.05);
        standArm.rotation.x = -0.15;
        g.add(standBase, standArm);

        // Ultra-thin Unibody Display Chassis (11.5mm)
        const chassis = box(1.12, 0.72, 0.022, mat(0x38BDF8, {metalness:0.75, roughness:0.3})); // Blue iMac
        chassis.position.set(0, 0.68, 0);
        // Front White Bezel
        const whiteBezel = box(1.1, 0.7, 0.005, mat(0xF8FAFC));
        whiteBezel.position.set(0, 0.68, 0.012);
        // 4.5K Retina Display with macOS texture
        const screenMat = new THREE.MeshBasicMaterial({ map: createScreenTexture('macos', 'Apple iMac 24" M3') });
        const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.02, 0.54), screenMat);
        screen.position.set(0, 0.72, 0.016);
        // iMac White Chin
        const chin = box(1.02, 0.12, 0.006, mat(0xE2E8F0, {metalness:0.8}));
        chin.position.set(0, 0.39, 0.016);
        g.add(chassis, whiteBezel, screen, chin);

        // Rear Ports: 2x Thunderbolt 4 + 2x USB-C + Power In
        const rjPort = buildRj45Port();
        rjPort.position.set(0.35, 0.55, -0.015);
        rjPort.rotation.y = Math.PI;
        g.add(rjPort);

        // Apple Magic Keyboard with Touch ID & Magic Mouse
        const kbMat = new THREE.MeshBasicMaterial({ map: createKeyboardTexture('apple_silver') });
        const kbMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.52, 0.18), kbMat);
        kbMesh.rotation.x = -Math.PI / 2;
        const kbBase = box(0.54, 0.012, 0.19, mat(0xE2E8F0, {metalness:0.85}));
        kbBase.position.set(-0.12, 0.12, 0.4);
        kbMesh.position.set(-0.12, 0.128, 0.4);
        const mouse = box(0.08, 0.022, 0.13, mat(0xF8FAFC, {roughness:0.1}));
        mouse.position.set(0.28, 0.12, 0.4);
        g.add(kbBase, kbMesh, mouse);

        g.userData.portOffset = new THREE.Vector3(0.35, 0.55, -0.03);
        return g;
      }
    },

    // 2. Apple Mac Studio M2 & Studio Display
    apple_mac_studio: {
      name: "Apple Mac Studio M2 & Studio Display",
      brand: "Apple",
      category: "desktop",
      desc: "M2 Ultra quvvatiga ega ixcham alyuminiy blok, 27\" 5K Studio Display, orqada 10GbE RJ45 va 4x Thunderbolt 4.",
      ports: ["Gi0/1", "Gi0/2"],
      builder: function(){
        const g = new THREE.Group();
        // Mac Studio Solid Aluminum Block
        const studio = box(0.42, 0.22, 0.42, mat(0xD1D5DB, {metalness:0.9, roughness:0.2}));
        studio.position.set(0.65, 0.22, 0);
        // Front Ports: 2x Thunderbolt + SDXC
        const usbC1 = buildUsbCPort(); usbC1.position.set(0.55, 0.22, 0.215);
        const usbC2 = buildUsbCPort(); usbC2.position.set(0.62, 0.22, 0.215);
        const pwrLed = new THREE.Mesh(new THREE.SphereGeometry(0.008, 8, 8), emissiveMat(0xFFFFFF, 2.5));
        pwrLed.position.set(0.48, 0.22, 0.215);
        g.add(studio, usbC1, usbC2, pwrLed);

        // Rear 10GbE Port
        const rj10g = buildRj45Port();
        rj10g.position.set(0.65, 0.18, -0.215);
        rj10g.rotation.y = Math.PI;
        g.add(rj10g);

        // Studio Display 27" 5K
        const standBase = box(0.35, 0.015, 0.28, mat(0xD1D5DB, {metalness:0.9}));
        standBase.position.set(-0.35, 0.15, 0);
        const standArm = box(0.12, 0.48, 0.02, mat(0xD1D5DB, {metalness:0.9}));
        standArm.position.set(-0.35, 0.38, -0.06);
        standArm.rotation.x = -0.12;
        const displayBody = box(1.15, 0.72, 0.03, mat(0x1F2937, {metalness:0.8}));
        displayBody.position.set(-0.35, 0.68, 0);
        const screenMat = new THREE.MeshBasicMaterial({ map: createScreenTexture('macos', 'Mac Studio 10GbE') });
        const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.08, 0.65), screenMat);
        screen.position.set(-0.35, 0.68, 0.018);
        g.add(standBase, standArm, displayBody, screen);

        // Magic Keyboard Space Black & Trackpad
        const kbMat = new THREE.MeshBasicMaterial({ map: createKeyboardTexture('apple_silver') });
        const kbMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 0.19), kbMat);
        kbMesh.rotation.x = -Math.PI / 2;
        const kbBase = box(0.56, 0.012, 0.2, mat(0x1E293B));
        kbBase.position.set(-0.35, 0.12, 0.4);
        kbMesh.position.set(-0.35, 0.128, 0.4);
        const mouse = box(0.08, 0.022, 0.13, mat(0x1E293B));
        mouse.position.set(0.12, 0.12, 0.4);
        g.add(kbBase, kbMesh, mouse);

        g.userData.portOffset = new THREE.Vector3(0.65, 0.18, -0.23);
        return g;
      }
    },

    // 3. Samsung Odyssey OLED G9 49" Curved Gaming Rig
    samsung_odyssey_rig: {
      name: "Samsung Odyssey OLED G9 49\" Gaming Rig",
      brand: "Samsung",
      category: "desktop",
      desc: "32:9 kavisli ultra-keng gaming monitor, CoreSync RGB aylanuvchi chirog'i, suyuqlik bilan sovutiluvchi kuchli PC.",
      ports: ["Fa0/1", "Gi0/1"],
      builder: function(){
        const g = new THREE.Group();
        // High-End Gaming PC Tower
        const pcCase = box(0.44, 1.05, 0.52, mat(0x0F172A, {metalness:0.85, roughness:0.25}));
        pcCase.position.set(0.85, 0.525, 0);
        // Tempered Glass Panel
        const glass = box(0.01, 0.98, 0.48, new THREE.MeshPhysicalMaterial({ color: 0x38BDF8, transparent: true, opacity: 0.35, transmission: 0.85 }));
        glass.position.set(0.625, 0.525, 0);
        // 3 Front ARGB Fans
        for(let i = 0; i < 3; i++){
          const ring = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.014, 8, 16), emissiveMat(i === 0 ? 0x38BDF8 : i === 1 ? 0x00FF87 : 0xA78BFA, 2.5));
          ring.position.set(0.72, 0.3 + i * 0.25, 0.255);
          g.add(ring);
        }
        // Power Button with glowing ring
        const pBtn = buildPowerButton(0x38BDF8);
        pBtn.position.set(0.85, 1.055, 0.22);
        g.add(pcCase, glass, pBtn);

        // Rear RJ45 port
        const rj = buildRj45Port();
        rj.position.set(0.85, 0.42, -0.265);
        rj.rotation.y = Math.PI;
        g.add(rj);

        // 49" Ultra-Wide 32:9 Curved Monitor
        const standBase = box(0.55, 0.02, 0.32, mat(0x1E293B, {metalness:0.9}));
        standBase.position.set(-0.35, 0.15, 0);
        const standPole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.52, 12), mat(0x1E293B, {metalness:0.9}));
        standPole.position.set(-0.35, 0.42, -0.12);
        // Curved display structure
        const monBody = box(1.65, 0.55, 0.08, mat(0x0F172A, {roughness:0.3}));
        monBody.position.set(-0.35, 0.68, 0);
        // Samsung CoreSync RGB Ring on rear
        const coreRing = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.025, 12, 24), emissiveMat(0x00F0FF, 3.0));
        coreRing.position.set(-0.35, 0.68, -0.05);
        // Screen with Windows 11 texture
        const screenMat = new THREE.MeshBasicMaterial({ map: createScreenTexture('windows11', 'Samsung Odyssey G9 OLED') });
        const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.58, 0.48), screenMat);
        screen.position.set(-0.35, 0.68, 0.042);
        g.add(standBase, standPole, monBody, coreRing, screen);

        // RGB Mechanical Keyboard & Gaming Mouse
        const kbMat = new THREE.MeshBasicMaterial({ map: createKeyboardTexture('standard', true) });
        const kbMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.68, 0.22), kbMat);
        kbMesh.rotation.x = -Math.PI / 2;
        const kbBase = box(0.7, 0.018, 0.24, mat(0x0F172A));
        kbBase.position.set(-0.35, 0.12, 0.42);
        kbMesh.position.set(-0.35, 0.13, 0.42);
        const mouse = box(0.09, 0.025, 0.14, mat(0x0F172A));
        mouse.position.set(0.18, 0.12, 0.42);
        g.add(kbBase, kbMesh, mouse);

        g.userData.portOffset = new THREE.Vector3(0.85, 0.42, -0.28);
        return g;
      }
    },

    // 4. Acer Predator Orion 7000
    acer_predator_orion: {
      name: "Acer Predator Orion 7000 ARGB",
      brand: "Acer",
      category: "desktop",
      desc: "EMI-himoyalangan oynali yon panel, oldinda 2 ta 140mm ARGB FrostBlade kulerlari, yoritilgan moviy Predator timsoli.",
      ports: ["Fa0/1", "Gi0/1"],
      builder: function(){
        const g = new THREE.Group();
        // Predator Tower Chassis
        const tower = box(0.42, 1.08, 0.5, mat(0x0B0F19, {metalness:0.8, roughness:0.3}));
        tower.position.set(0.75, 0.54, 0);
        // Front Mesh Bezel
        const frontMesh = box(0.4, 1.04, 0.04, mat(0x111827, {roughness:0.9}));
        frontMesh.position.set(0.75, 0.54, 0.26);
        // Illuminated Predator Teal Logo
        const logo = new THREE.Mesh(new THREE.OctahedronGeometry(0.035), emissiveMat(0x00F0FF, 3.0));
        logo.position.set(0.75, 0.92, 0.285);
        // Dual 140mm ARGB FrostBlade fans
        for(let i = 0; i < 2; i++){
          const fan = new THREE.Mesh(new THREE.TorusGeometry(0.095, 0.016, 8, 16), emissiveMat(0x00F0FF, 2.8));
          fan.position.set(0.75, 0.38 + i * 0.32, 0.27);
          g.add(fan);
        }
        g.add(tower, frontMesh, logo);

        // Rear RJ45 2.5G Port
        const rj = buildRj45Port();
        rj.position.set(0.75, 0.42, -0.255);
        rj.rotation.y = Math.PI;
        g.add(rj);

        // Acer Nitro 27" 165Hz IPS Display
        const standBase = box(0.38, 0.018, 0.26, mat(0x111827, {metalness:0.8}));
        standBase.position.set(-0.35, 0.15, 0);
        const standPole = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.5, 8), mat(0x111827, {metalness:0.8}));
        standPole.position.set(-0.35, 0.4, -0.08);
        const monitor = box(1.05, 0.62, 0.038, mat(0x111827, {roughness:0.4}));
        monitor.position.set(-0.35, 0.65, 0);
        const screenMat = new THREE.MeshBasicMaterial({ map: createScreenTexture('windows11', 'Acer Predator Orion') });
        const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.98, 0.55), screenMat);
        screen.position.set(-0.35, 0.65, 0.021);
        g.add(standBase, standPole, monitor, screen);

        // Predator RGB Mechanical Keyboard
        const kbMat = new THREE.MeshBasicMaterial({ map: createKeyboardTexture('standard', true) });
        const kbMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.64, 0.22), kbMat);
        kbMesh.rotation.x = -Math.PI / 2;
        const kbBase = box(0.66, 0.016, 0.24, mat(0x111827));
        kbBase.position.set(-0.35, 0.12, 0.42);
        kbMesh.position.set(-0.35, 0.129, 0.42);
        const mouse = box(0.09, 0.025, 0.14, mat(0x111827));
        mouse.position.set(0.14, 0.12, 0.42);
        g.add(kbBase, kbMesh, mouse);

        g.userData.portOffset = new THREE.Vector3(0.75, 0.42, -0.27);
        return g;
      }
    },

    // 5. HP OMEN 45L Cryo Chamber Desktop
    hp_omen_45l: {
      name: "HP OMEN 45L Cryo Chamber Gaming Desktop",
      brand: "HP",
      category: "desktop",
      desc: "Patented OMEN Cryo Chamber alohida suyuqlik sovutish kamerasi, 3 ta ARGB kuler, romb shaklidagi OMEN oq logotipi.",
      ports: ["Fa0/1", "Gi0/1"],
      builder: function(){
        const g = new THREE.Group();
        // Lower PC Main Chassis
        const chassis = box(0.44, 0.88, 0.5, mat(0x0F172A, {metalness:0.8, roughness:0.3}));
        chassis.position.set(0.75, 0.44, 0);
        // Cryo Chamber on top (separated cooling zone)
        const cryoChamber = box(0.42, 0.18, 0.48, mat(0x1E293B, {metalness:0.9}));
        cryoChamber.position.set(0.75, 0.98, 0);
        const cryoGap = box(0.38, 0.04, 0.44, mat(0x020617));
        cryoGap.position.set(0.75, 0.87, 0);
        // Illuminated OMEN Diamond Logo
        const omenLogo = new THREE.Mesh(new THREE.OctahedronGeometry(0.038), emissiveMat(0xFFFFFF, 3.0));
        omenLogo.position.set(0.75, 0.65, 0.26);
        omenLogo.rotation.z = Math.PI / 4;
        g.add(chassis, cryoChamber, cryoGap, omenLogo);

        // Rear RJ45 port
        const rj = buildRj45Port();
        rj.position.set(0.75, 0.35, -0.255);
        rj.rotation.y = Math.PI;
        g.add(rj);

        // HP 27" QHD Monitor with Windows 11
        const standBase = box(0.35, 0.015, 0.25, mat(0x1E293B, {metalness:0.8}));
        standBase.position.set(-0.35, 0.15, 0);
        const standPole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.48, 8), mat(0x1E293B, {metalness:0.8}));
        standPole.position.set(-0.35, 0.39, -0.06);
        const monitor = box(1.02, 0.6, 0.038, mat(0x0F172A, {roughness:0.4}));
        monitor.position.set(-0.35, 0.65, 0);
        const screenMat = new THREE.MeshBasicMaterial({ map: createScreenTexture('windows11', 'HP OMEN 45L') });
        const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.95, 0.53), screenMat);
        screen.position.set(-0.35, 0.65, 0.021);
        g.add(standBase, standPole, monitor, screen);

        // OMEN Keyboard & Mouse
        const kbMat = new THREE.MeshBasicMaterial({ map: createKeyboardTexture('standard', true) });
        const kbMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.2), kbMat);
        kbMesh.rotation.x = -Math.PI / 2;
        const kbBase = box(0.64, 0.015, 0.22, mat(0x1E293B));
        kbBase.position.set(-0.35, 0.12, 0.4);
        kbMesh.position.set(-0.35, 0.128, 0.4);
        const mouse = box(0.09, 0.025, 0.14, mat(0x1E293B));
        mouse.position.set(0.12, 0.12, 0.4);
        g.add(kbBase, kbMesh, mouse);

        g.userData.portOffset = new THREE.Vector3(0.75, 0.35, -0.27);
        return g;
      }
    },

    // 6. Dell OptiPlex 7090 Tower
    dell_optiplex_7090: {
      name: "Dell OptiPlex 7090 Tower",
      brand: "Dell",
      category: "desktop",
      desc: "Klassik korporativ qora rombli panjara, DVD-RW drayver, Dell 24\" IPS monitor, klaviatura va sichqoncha.",
      ports: ["Fa0/1"],
      builder: function(){
        const g = new THREE.Group();
        const tower = box(0.38, 0.95, 0.42, mat(0x1E2430, {metalness:0.4, roughness:0.6}));
        tower.position.set(0.55, 0.475, 0);
        const frontBezel = box(0.37, 0.93, 0.03, mat(0x111620, {roughness:0.8}));
        frontBezel.position.set(0.55, 0.475, 0.225);
        const dvdDrive = box(0.3, 0.04, 0.01, mat(0x283244));
        dvdDrive.position.set(0.55, 0.82, 0.242);
        const pwrLed = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 8), emissiveMat(0x38BDF8, 2.0));
        pwrLed.position.set(0.66, 0.88, 0.242);
        g.add(tower, frontBezel, dvdDrive, pwrLed);

        // Rear RJ45
        const rj = buildRj45Port();
        rj.position.set(0.55, 0.35, -0.215);
        rj.rotation.y = Math.PI;
        g.add(rj);

        // Monitor with Windows 11
        const standBase = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.2, 0.025, 16), mat(0x2A3448, {metalness:0.7}));
        standBase.position.set(-0.35, 0.15, 0);
        const standPole = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.45, 8), mat(0x2A3448, {metalness:0.7}));
        standPole.position.set(-0.35, 0.38, -0.05);
        const monitor = box(0.92, 0.58, 0.04, mat(0x151B26, {roughness:0.4}));
        monitor.position.set(-0.35, 0.62, 0);
        const screenMat = new THREE.MeshBasicMaterial({ map: createScreenTexture('windows11', 'Dell OptiPlex 7090') });
        const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.85, 0.51), screenMat);
        screen.position.set(-0.35, 0.62, 0.022);
        g.add(standBase, standPole, monitor, screen);

        // Keyboard & Mouse
        const kbMat = new THREE.MeshBasicMaterial({ map: createKeyboardTexture('standard') });
        const kbMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.2), kbMat);
        kbMesh.rotation.x = -Math.PI / 2;
        const kb = box(0.65, 0.02, 0.22, mat(0x1A2230));
        kb.position.set(-0.35, 0.12, 0.4);
        kbMesh.position.set(-0.35, 0.13, 0.4);
        const mouse = box(0.09, 0.025, 0.14, mat(0x1A2230));
        mouse.position.set(0.15, 0.12, 0.4);
        g.add(kb, kbMesh, mouse);

        g.userData.portOffset = new THREE.Vector3(0.55, 0.35, -0.23);
        return g;
      }
    }
  },

  /* ── 2. LAPTOPS (NOUTBUKLAR) ── */
  laptop: {
    // 1. Apple MacBook Pro 16" M3 Max
    apple_macbook_pro_16: {
      name: "Apple MacBook Pro 16\" M3 Max",
      brand: "Apple",
      category: "laptop",
      desc: "Space Black alyuminiy korpus, Liquid Retina XDR (Notch qirqimi, macOS), MagSafe 3, HDMI, 3x Thunderbolt 4.",
      ports: ["Fa0/1", "WLAN0"],
      builder: function(){
        const g = new THREE.Group();
        // Lower Base (Space Black Anodized Aluminum)
        const base = box(1.05, 0.05, 0.68, mat(0x18181B, {metalness:0.85, roughness:0.25}));
        base.position.y = 0.05;
        g.add(base);

        // Black Keyboard Well with Scissor Keys
        const kbMat = new THREE.MeshBasicMaterial({ map: createKeyboardTexture('apple_silver') });
        const kb = new THREE.Mesh(new THREE.PlaneGeometry(0.85, 0.32), kbMat);
        kb.rotation.x = -Math.PI / 2;
        kb.position.set(0, 0.076, -0.06);
        // Force Touch Glass Trackpad
        const trackpad = box(0.38, 0.005, 0.22, mat(0x27272A, {roughness:0.3}));
        trackpad.position.set(0, 0.076, 0.2);
        g.add(kb, trackpad);

        // Left Ports: MagSafe 3 + 2x TB4
        const usb1 = buildUsbCPort(); usb1.position.set(-0.526, 0.05, -0.15); usb1.rotation.y = -Math.PI / 2;
        const usb2 = buildUsbCPort(); usb2.position.set(-0.526, 0.05, -0.08); usb2.rotation.y = -Math.PI / 2;
        g.add(usb1, usb2);

        // Display Lid & Hinge
        const hinge = new THREE.Group();
        hinge.position.set(0, 0.075, -0.34);
        const lid = box(1.05, 0.68, 0.024, mat(0x18181B, {metalness:0.85, roughness:0.25}));
        lid.position.set(0, 0.34, -0.012);
        lid.rotation.x = -0.32;
        hinge.add(lid);

        // Screen with macOS texture & Camera Notch
        const screenMat = new THREE.MeshBasicMaterial({ map: createScreenTexture('macos', 'MacBook Pro 16" M3 Max') });
        const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.98, 0.6), screenMat);
        screen.position.set(0, 0.34, 0.005);
        screen.rotation.x = -0.32;
        // Camera Notch
        const notch = box(0.08, 0.02, 0.008, mat(0x000000));
        notch.position.set(0, 0.62, 0.098);
        notch.rotation.x = -0.32;
        hinge.add(screen, notch);
        g.add(hinge);

        g.userData.portOffset = new THREE.Vector3(-0.53, 0.05, -0.1);
        return g;
      }
    },

    // 2. Acer Predator Helios 18 Gaming Laptop
    acer_predator_helios: {
      name: "Acer Predator Helios 18 Gaming Laptop",
      brand: "Acer",
      category: "laptop",
      desc: "18\" 240Hz Mini-LED displey, orqa neon RGB svetomuzika tasmalar, har bir tugmasi alohida RGB yonuvchi klaviatura, Turbo tugmasi.",
      ports: ["Fa0/1", "WLAN0"],
      builder: function(){
        const g = new THREE.Group();
        // Aggressive Gaming Base
        const base = box(1.15, 0.07, 0.74, mat(0x0B0F19, {metalness:0.8, roughness:0.3}));
        base.position.y = 0.06;
        // Rear RGB Lightbar
        const rearLightbar = box(0.8, 0.02, 0.015, emissiveMat(0x00F0FF, 3.0));
        rearLightbar.position.set(0, 0.065, -0.365);
        g.add(base, rearLightbar);

        // Per-Key RGB Keyboard
        const kbMat = new THREE.MeshBasicMaterial({ map: createKeyboardTexture('standard', true) });
        const kb = new THREE.Mesh(new THREE.PlaneGeometry(0.95, 0.36), kbMat);
        kb.rotation.x = -Math.PI / 2;
        kb.position.set(0, 0.096, -0.06);
        const trackpad = box(0.35, 0.005, 0.22, mat(0x111827));
        trackpad.position.set(0, 0.096, 0.22);
        g.add(kb, trackpad);

        // Rear RJ45 2.5G Killer Ethernet Port
        const rj = buildRj45Port();
        rj.position.set(0.3, 0.06, -0.368);
        rj.rotation.y = Math.PI;
        g.add(rj);

        // Display Lid
        const hinge = new THREE.Group();
        hinge.position.set(0, 0.095, -0.36);
        const lid = box(1.15, 0.74, 0.025, mat(0x0B0F19, {metalness:0.8}));
        lid.position.set(0, 0.37, -0.012);
        lid.rotation.x = -0.32;
        // Predator Teal Emblem on Lid
        const logo = new THREE.Mesh(new THREE.OctahedronGeometry(0.03), emissiveMat(0x00F0FF, 3.0));
        logo.position.set(0, 0.37, -0.03);
        hinge.add(lid, logo);

        // 18" 240Hz Screen
        const screenMat = new THREE.MeshBasicMaterial({ map: createScreenTexture('windows11', 'Acer Predator Helios 18') });
        const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.08, 0.66), screenMat);
        screen.position.set(0, 0.37, 0.005);
        screen.rotation.x = -0.32;
        hinge.add(screen);
        g.add(hinge);

        g.userData.portOffset = new THREE.Vector3(0.3, 0.06, -0.38);
        return g;
      }
    },

    // 3. HP EliteBook 840 G10 Enterprise Laptop
    hp_elitebook_840: {
      name: "HP EliteBook 840 G10 Enterprise",
      brand: "HP",
      category: "laptop",
      desc: "CNC kumush alyuminiy korpus, Bang & Olufsen dinamik panjaralari, HP Wolf Security emblemasi, 5MP veb-kamera.",
      ports: ["Fa0/1", "WLAN0"],
      builder: function(){
        const g = new THREE.Group();
        // Silver CNC Aluminum Base
        const base = box(1.02, 0.05, 0.65, mat(0xD1D5DB, {metalness:0.85, roughness:0.2}));
        base.position.y = 0.05;
        g.add(base);

        // Keyboard & B&O Speaker Grilles
        const kbMat = new THREE.MeshBasicMaterial({ map: createKeyboardTexture('standard') });
        const kb = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.3), kbMat);
        kb.rotation.x = -Math.PI / 2;
        kb.position.set(0, 0.076, -0.05);
        const trackpad = box(0.32, 0.005, 0.2, mat(0xE5E7EB, {metalness:0.7}));
        trackpad.position.set(0, 0.076, 0.2);
        g.add(kb, trackpad);

        // Display Lid
        const hinge = new THREE.Group();
        hinge.position.set(0, 0.075, -0.32);
        const lid = box(1.02, 0.65, 0.022, mat(0xD1D5DB, {metalness:0.85}));
        lid.position.set(0, 0.32, -0.01);
        lid.rotation.x = -0.32;
        const screenMat = new THREE.MeshBasicMaterial({ map: createScreenTexture('windows11', 'HP EliteBook 840 G10') });
        const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.95, 0.58), screenMat);
        screen.position.set(0, 0.32, 0.005);
        screen.rotation.x = -0.32;
        hinge.add(lid, screen);
        g.add(hinge);

        g.userData.portOffset = new THREE.Vector3(-0.51, 0.05, -0.1);
        return g;
      }
    },

    // 4. Samsung Galaxy Book4 Ultra
    samsung_galaxy_book: {
      name: "Samsung Galaxy Book4 Ultra AMOLED",
      brand: "Samsung",
      category: "laptop",
      desc: "Moonstone Gray alyuminiy korpus, 3K Dynamic AMOLED 2X sensorli ekran, AKG dinamiklari, HDMI 2.1 va Thunderbolt 4.",
      ports: ["Fa0/1", "WLAN0"],
      builder: function(){
        const g = new THREE.Group();
        const base = box(1.04, 0.05, 0.66, mat(0x374151, {metalness:0.85, roughness:0.25}));
        base.position.y = 0.05;
        const kbMat = new THREE.MeshBasicMaterial({ map: createKeyboardTexture('standard') });
        const kb = new THREE.Mesh(new THREE.PlaneGeometry(0.85, 0.32), kbMat);
        kb.rotation.x = -Math.PI / 2;
        kb.position.set(0, 0.076, -0.06);
        const trackpad = box(0.36, 0.005, 0.22, mat(0x4B5563));
        trackpad.position.set(0, 0.076, 0.2);
        g.add(base, kb, trackpad);

        const hinge = new THREE.Group();
        hinge.position.set(0, 0.075, -0.33);
        const lid = box(1.04, 0.66, 0.022, mat(0x374151, {metalness:0.85}));
        lid.position.set(0, 0.33, -0.01);
        lid.rotation.x = -0.32;
        const screenMat = new THREE.MeshBasicMaterial({ map: createScreenTexture('windows11', 'Samsung Galaxy Book4 Ultra') });
        const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.98, 0.59), screenMat);
        screen.position.set(0, 0.33, 0.005);
        screen.rotation.x = -0.32;
        hinge.add(lid, screen);
        g.add(hinge);

        g.userData.portOffset = new THREE.Vector3(-0.52, 0.05, -0.1);
        return g;
      }
    },

    // 5. Lenovo ThinkPad X1 Carbon Gen 11
    lenovo_thinkpad_x1: {
      name: "Lenovo ThinkPad X1 Carbon Gen 11",
      brand: "Lenovo",
      category: "laptop",
      desc: "Uglerod tolali mat qora korpus, afsonaviy qizil TrackPoint nubi, 3 ta jismoniy sichqoncha tugmalari, to'liq RJ45 adapterli ulanish.",
      ports: ["Fa0/1", "WLAN0"],
      builder: function(){
        const g = new THREE.Group();
        const base = box(1.0, 0.05, 0.64, mat(0x18181B, {roughness:0.7}));
        base.position.y = 0.05;
        const kbMat = new THREE.MeshBasicMaterial({ map: createKeyboardTexture('thinkpad') });
        const kb = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.32), kbMat);
        kb.rotation.x = -Math.PI / 2;
        kb.position.set(0, 0.076, -0.06);
        // TrackPoint 3 Physical Buttons
        const tpBtns = box(0.25, 0.006, 0.04, mat(0x27272A));
        tpBtns.position.set(0, 0.076, 0.08);
        const trackpad = box(0.28, 0.005, 0.18, mat(0x27272A));
        trackpad.position.set(0, 0.076, 0.2);
        g.add(base, kb, tpBtns, trackpad);

        const hinge = new THREE.Group();
        hinge.position.set(0, 0.075, -0.32);
        const lid = box(1.0, 0.64, 0.022, mat(0x18181B, {roughness:0.7}));
        lid.position.set(0, 0.32, -0.01);
        lid.rotation.x = -0.32;
        const screenMat = new THREE.MeshBasicMaterial({ map: createScreenTexture('windows11', 'Lenovo ThinkPad X1') });
        const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.92, 0.56), screenMat);
        screen.position.set(0, 0.32, 0.005);
        screen.rotation.x = -0.32;
        hinge.add(lid, screen);
        g.add(hinge);

        g.userData.portOffset = new THREE.Vector3(-0.5, 0.05, -0.1);
        return g;
      }
    }
  },

  /* ── 3. PHONES (SMARTFONLAR) ── */
  phone: {
    // 1. Apple iPhone 16 Pro Max
    apple_iphone_16_pro: {
      name: "Apple iPhone 16 Pro Max",
      brand: "Apple",
      category: "phone",
      desc: "Natural Titanium titan rom, Dynamic Island, Action Button, Camera Control sensorli tugmasi, 3 ta ulkan sapfir kamera.",
      ports: ["WLAN0"],
      builder: function(){
        const g = new THREE.Group();
        // Stand base
        const standBase = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.03, 16), mat(0x27272A, {metalness:0.8}));
        standBase.position.y = 0.015;
        g.add(standBase);

        // Titanium Phone Chassis
        const phone = new THREE.Group();
        phone.position.set(0, 0.34, 0);
        phone.rotation.x = -0.18;

        const body = box(0.28, 0.58, 0.028, mat(0x78716C, {metalness:0.9, roughness:0.25})); // Natural Titanium
        // Screen with iOS / Dynamic Island
        const screenMat = new THREE.MeshBasicMaterial({ map: createScreenTexture('oneui', 'iPhone 16 Pro Max') });
        const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.26, 0.55), screenMat);
        screen.position.z = 0.015;
        // Dynamic Island pill
        const di = box(0.065, 0.016, 0.005, mat(0x000000));
        di.position.set(0, 0.24, 0.018);

        // Rear Triple Camera Plateau
        const camPlateau = box(0.12, 0.12, 0.015, mat(0x57534E, {metalness:0.9}));
        camPlateau.position.set(-0.06, 0.18, -0.02);
        // 3 Large Sapphire Lenses
        [[-0.08, 0.2], [-0.08, 0.15], [-0.03, 0.175]].forEach(([cx, cy]) => {
          const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.012, 16), mat(0x0C0A09, {metalness:0.9, roughness:0.1}));
          lens.rotation.x = Math.PI / 2;
          lens.position.set(cx, cy, -0.028);
          phone.add(lens);
        });

        // Bottom USB-C Port
        const usbc = buildUsbCPort();
        usbc.position.set(0, -0.29, 0);
        usbc.rotation.x = Math.PI / 2;

        phone.add(body, screen, di, camPlateau, usbc);
        g.add(phone);

        g.userData.portOffset = new THREE.Vector3(0, 0.28, 0.05);
        return g;
      }
    },

    // 2. Samsung Galaxy S24 Ultra
    samsung_galaxy_s24_ultra: {
      name: "Samsung Galaxy S24 Ultra",
      brand: "Samsung",
      category: "phone",
      desc: "Titan rom, 6.8\" yassi Dynamic AMOLED 2X ekran, korpus ichidan chiquvchi S-Pen, 4 ta suzuvchi kamera metall halqasi bilan.",
      ports: ["WLAN0"],
      builder: function(){
        const g = new THREE.Group();
        const standBase = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.03, 16), mat(0x1F2937));
        standBase.position.y = 0.015;
        g.add(standBase);

        const phone = new THREE.Group();
        phone.position.set(0, 0.34, 0);
        phone.rotation.x = -0.18;

        // Titanium Gray Body with Sharp Corners
        const body = box(0.29, 0.59, 0.026, mat(0x4B5563, {metalness:0.85, roughness:0.25}));
        const screenMat = new THREE.MeshBasicMaterial({ map: createScreenTexture('oneui', 'Galaxy S24 Ultra') });
        const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.27, 0.56), screenMat);
        screen.position.z = 0.014;

        // Rear Floating Quad Cameras (Individual rings)
        [[-0.08, 0.21], [-0.08, 0.15], [-0.08, 0.09], [-0.02, 0.18]].forEach(([cx, cy]) => {
          const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.01, 16), mat(0x9CA3AF, {metalness:0.95}));
          ring.rotation.x = Math.PI / 2;
          ring.position.set(cx, cy, -0.018);
          phone.add(ring);
        });

        // S-Pen Silo on Bottom Corner
        const spenCap = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.008, 12), mat(0x1F2937));
        spenCap.position.set(-0.11, -0.295, 0);
        phone.add(spenCap);

        phone.add(body, screen);
        g.add(phone);

        g.userData.portOffset = new THREE.Vector3(0, 0.28, 0.05);
        return g;
      }
    },

    // 3. Xiaomi Redmi Note 13 Pro+ 5G
    redmi_note_13_pro: {
      name: "Xiaomi Redmi Note 13 Pro+ 5G",
      brand: "Xiaomi / Redmi",
      category: "phone",
      desc: "Kavisli 1.5K AMOLED displey, Aurora Purple ekologik charm orqa panel, 200MP OIS kamera halqasi, 120W HyperCharge.",
      ports: ["WLAN0"],
      builder: function(){
        const g = new THREE.Group();
        const standBase = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.03, 16), mat(0x1F2937));
        standBase.position.y = 0.015;
        g.add(standBase);

        const phone = new THREE.Group();
        phone.position.set(0, 0.34, 0);
        phone.rotation.x = -0.18;

        // Curved Back (Aurora Purple)
        const body = box(0.28, 0.58, 0.026, mat(0x7C3AED, {metalness:0.6, roughness:0.4}));
        const screenMat = new THREE.MeshBasicMaterial({ map: createScreenTexture('hyperos', 'Redmi Note 13 Pro+') });
        const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.26, 0.55), screenMat);
        screen.position.z = 0.014;

        // 200MP Big Gold Camera Ring
        const bigRing = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.012, 16), mat(0xF59E0B, {metalness:0.95}));
        bigRing.rotation.x = Math.PI / 2;
        bigRing.position.set(-0.06, 0.19, -0.019);
        const secondRing = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.01, 16), mat(0xF59E0B, {metalness:0.95}));
        secondRing.rotation.x = Math.PI / 2;
        secondRing.position.set(-0.06, 0.12, -0.018);

        phone.add(body, screen, bigRing, secondRing);
        g.add(phone);

        g.userData.portOffset = new THREE.Vector3(0, 0.28, 0.05);
        return g;
      }
    },

    // 4. Cisco 8845 HD Video IP Phone
    cisco_ip_phone_8845: {
      name: "Cisco 8845 HD Video IP Phone",
      brand: "Cisco",
      category: "phone",
      desc: "5\" 720p rangli ekran, 720p HD aylanuvchi kamera, ergonomik trubka, 10 ta dasturlanuvchi chiziq tugmalari, 2x Gigabit LAN.",
      ports: ["Fa0/1", "Gi0/1"],
      builder: function(){
        const g = new THREE.Group();
        // Angled Base Stand
        const base = box(0.85, 0.18, 0.72, mat(0x1E293B, {metalness:0.4, roughness:0.7}));
        base.position.set(0, 0.15, 0);
        base.rotation.x = -0.32;
        g.add(base);

        // 5" Color Screen with Cisco OLED UI
        const screenMat = new THREE.MeshBasicMaterial({ map: createScreenTexture('cisco_oled', 'Cisco IP Phone 8845') });
        const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.38, 0.24), screenMat);
        screen.position.set(-0.15, 0.26, 0.05);
        screen.rotation.x = -0.32;
        // HD Video Camera on top of screen
        const cam = box(0.12, 0.035, 0.04, mat(0x0F172A));
        cam.position.set(-0.15, 0.41, -0.01);
        g.add(screen, cam);

        // Handset Cradle & Coiled Handset
        const handset = box(0.14, 0.72, 0.12, mat(0x0F172A, {roughness:0.5}));
        handset.position.set(0.32, 0.3, 0.04);
        handset.rotation.x = -0.32;
        g.add(handset);

        // Numeric Keypad (0-9, *, #)
        for(let r = 0; r < 4; r++){
          for(let c = 0; c < 3; c++){
            const key = box(0.04, 0.02, 0.03, mat(0x334155));
            key.position.set(-0.2 + c * 0.055, 0.12 + (3 - r) * 0.04, 0.18 + r * 0.02);
            key.rotation.x = -0.32;
            g.add(key);
          }
        }

        // Dual Rear Gigabit RJ45 Ports (Network + PC)
        const rj1 = buildRj45Port('SW'); rj1.position.set(-0.1, 0.12, -0.28); rj1.rotation.y = Math.PI;
        const rj2 = buildRj45Port('PC'); rj2.position.set(0.1, 0.12, -0.28); rj2.rotation.y = Math.PI;
        g.add(rj1, rj2);

        g.userData.portOffset = new THREE.Vector3(-0.1, 0.12, -0.3);
        return g;
      }
    }
  },

  /* ── 4. TABLETS (PLANSHETLAR) ── */
  tablet: {
    // 1. Apple iPad Pro 13" M4 with Magic Keyboard
    apple_ipad_pro_m4: {
      name: "Apple iPad Pro 13\" M4 with Magic Keyboard",
      brand: "Apple",
      category: "tablet",
      desc: "Rekord 5.1mm yupqalik, Tandem OLED displey, suzuvchi magnitli Magic Keyboard, magnitda quvvatlanuvchi Apple Pencil Pro.",
      ports: ["WLAN0"],
      builder: function(){
        const g = new THREE.Group();
        // Magic Keyboard Aluminum Base with Trackpad
        const kbBase = box(0.95, 0.016, 0.65, mat(0x1F2937, {metalness:0.85}));
        kbBase.position.set(0, 0.12, 0.15);
        const kbMat = new THREE.MeshBasicMaterial({ map: createKeyboardTexture('apple_silver') });
        const kbMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.82, 0.28), kbMat);
        kbMesh.rotation.x = -Math.PI / 2;
        kbMesh.position.set(0, 0.13, 0.08);
        const trackpad = box(0.32, 0.005, 0.18, mat(0x374151));
        trackpad.position.set(0, 0.13, 0.35);
        g.add(kbBase, kbMesh, trackpad);

        // Floating Cantilever Magnetic Hinge
        const hingeArm = box(0.85, 0.24, 0.015, mat(0x1F2937, {metalness:0.9}));
        hingeArm.position.set(0, 0.24, -0.12);
        hingeArm.rotation.x = 0.45;
        g.add(hingeArm);

        // iPad Pro 13" Ultra-Thin Slab (5.1mm)
        const ipad = box(0.96, 0.68, 0.012, mat(0x374151, {metalness:0.9, roughness:0.25}));
        ipad.position.set(0, 0.48, -0.06);
        ipad.rotation.x = -0.25;
        const screenMat = new THREE.MeshBasicMaterial({ map: createScreenTexture('macos', 'iPad Pro M4') });
        const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.92, 0.64), screenMat);
        screen.position.set(0, 0.48, -0.053);
        screen.rotation.x = -0.25;
        g.add(ipad, screen);

        // Apple Pencil Pro magnetically attached on top
        const pencil = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, 0.65, 12), mat(0xF8FAFC));
        pencil.rotation.z = Math.PI / 2;
        pencil.position.set(0, 0.78, -0.15);
        g.add(pencil);

        g.userData.portOffset = new THREE.Vector3(0.48, 0.48, -0.06);
        return g;
      }
    },

    // 2. Samsung Galaxy Tab S9 Ultra
    samsung_galaxy_tab_s9: {
      name: "Samsung Galaxy Tab S9 Ultra",
      brand: "Samsung",
      category: "tablet",
      desc: "Katta 14.6\" Dynamic AMOLED 2X ekran, DeX ish stoli rejimi, qo'shaloq old kamera, orqada magnitli S-Pen zaryadlash zovuri.",
      ports: ["WLAN0"],
      builder: function(){
        const g = new THREE.Group();
        const standBase = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.03, 16), mat(0x1F2937));
        standBase.position.y = 0.015;
        g.add(standBase);

        const tablet = new THREE.Group();
        tablet.position.set(0, 0.42, 0);
        tablet.rotation.x = -0.2;

        const body = box(1.05, 0.68, 0.014, mat(0x374151, {metalness:0.85, roughness:0.3}));
        const screenMat = new THREE.MeshBasicMaterial({ map: createScreenTexture('oneui', 'Galaxy Tab S9 Ultra (DeX)') });
        const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.01, 0.64), screenMat);
        screen.position.z = 0.008;

        // Dual camera notch at top
        const notch = box(0.04, 0.012, 0.005, mat(0x000000));
        notch.position.set(0, 0.32, 0.009);

        // S-Pen Magnetic Groove on Back
        const spenGroove = box(0.015, 0.55, 0.006, mat(0x111827));
        spenGroove.position.set(0.38, 0, -0.009);

        tablet.add(body, screen, notch, spenGroove);
        g.add(tablet);

        g.userData.portOffset = new THREE.Vector3(0, 0.35, 0.08);
        return g;
      }
    }
  },

  /* ── 5. ROUTERS (ROUTERLAR) ── */
  router: {
    // 1. Xiaomi Router BE7000 Wi-Fi 7
    xiaomi_be7000_wifi7: {
      name: "Xiaomi Router BE7000 Wi-Fi 7",
      brand: "Xiaomi",
      category: "router",
      desc: "Stealth fighter burchakli qora korpus, 7 ta kuchli tashqi antenna, 4 ta 2.5GbE port + USB 3.0, Wi-Fi 7 tezligi.",
      ports: ["Gi0/0", "Gi0/1", "Gi0/2", "Gi0/3", "WLAN0"],
      builder: function(){
        const g = new THREE.Group();
        // Angular Stealth Chassis
        const body = box(1.8, 0.28, 1.15, mat(0x0F172A, {roughness:0.6, metalness:0.4}));
        body.position.y = 0.16;
        // Center Gaming RGB Lightbar
        const rgbBar = box(0.8, 0.025, 0.02, emissiveMat(0x00FF87, 3.2));
        rgbBar.position.set(0, 0.305, 0.45);
        g.add(body, rgbBar);

        // 7 External Antennas with gold rings (3 rear, 2 left, 2 right)
        const antPositions = [
          [-0.7, -0.5], [-0.35, -0.5], [0, -0.5], [0.35, -0.5], [0.7, -0.5],
          [-0.85, 0], [0.85, 0]
        ];
        antPositions.forEach(([x, z]) => {
          const ant = buildAntennaMesh(0.65);
          ant.position.set(x, 0.28, z);
          g.add(ant);
        });

        // 4x 2.5GbE RJ45 Ports on rear + 1x USB 3.0
        for(let i = 0; i < 4; i++){
          const rj = buildRj45Port(`LAN${i+1}`);
          rj.position.set(-0.35 + i * 0.16, 0.18, -0.575);
          rj.rotation.y = Math.PI;
          g.add(rj);
        }
        const usb = buildUsbAPort();
        usb.position.set(0.45, 0.18, -0.575);
        usb.rotation.y = Math.PI;
        g.add(usb);

        g.userData.portOffset = new THREE.Vector3(-0.35, 0.18, -0.6);
        return g;
      }
    },

    // 2. Cisco ISR 4451 Enterprise Modular Router
    cisco_isr_4451: {
      name: "Cisco ISR 4451 Modular Router",
      brand: "Cisco",
      category: "router",
      desc: "2U korporativ modulli marshrutizator, NIM va SM-X slotlari, 4x Gigabit Combo RJ45/SFP, konsol porti.",
      ports: ["Gi0/0", "Gi0/1", "Gi0/2", "Gi0/3", "WLAN0"],
      builder: function(){
        const g = new THREE.Group();
        // 2U Rackmount Body
        const body = box(1.85, 0.42, 1.25, mat(0x1E293B, {metalness:0.6, roughness:0.4}));
        body.position.y = 0.21;
        // Front Bezel with Cisco OLED
        const oledMat = new THREE.MeshBasicMaterial({ map: createScreenTexture('cisco_oled', 'Cisco ISR 4451') });
        const oled = new THREE.Mesh(new THREE.PlaneGeometry(0.48, 0.16), oledMat);
        oled.position.set(-0.55, 0.24, 0.63);
        g.add(body, oled);

        // 4 Gigabit RJ45 Ports on Front
        for(let i = 0; i < 4; i++){
          const rj = buildRj45Port(`Gi0/0/${i}`);
          rj.position.set(0.12 + i * 0.14, 0.22, 0.63);
          g.add(rj);
        }
        // Dual SFP Cages
        const sfp1 = buildSfpCage(); sfp1.position.set(0.72, 0.22, 0.6);
        g.add(sfp1);

        g.userData.portOffset = new THREE.Vector3(0.12, 0.22, 0.65);
        return g;
      }
    },

    // 3. TP-Link Archer AX73 Wi-Fi 6 Router
    tp_link_archer_ax73: {
      name: "TP-Link Archer AX73 Wi-Fi 6",
      brand: "TP-Link",
      category: "router",
      desc: "Slanted qirrali rombli shamollatish panjarasi, 6 ta tashqi antenna, 5x Gigabit RJ45 portlari, USB 3.0.",
      ports: ["Gi0/0", "Gi0/1", "Gi0/2", "Gi0/3", "WLAN0"],
      builder: function(){
        const g = new THREE.Group();
        const body = box(1.7, 0.24, 1.05, mat(0x0F172A, {roughness:0.6}));
        body.position.y = 0.15;
        // 6 High-Gain Antennas
        [[-0.7, -0.45], [0, -0.45], [0.7, -0.45], [-0.8, 0.2], [0.8, 0.2], [0, 0.45]].forEach(([x, z]) => {
          const ant = buildAntennaMesh(0.58);
          ant.position.set(x, 0.25, z);
          g.add(ant);
        });
        // 5x Gigabit Ports on rear (1 WAN Blue, 4 LAN Orange)
        for(let i = 0; i < 5; i++){
          const rj = buildRj45Port(i === 0 ? 'WAN' : `LAN${i}`);
          rj.position.set(-0.35 + i * 0.15, 0.15, -0.525);
          rj.rotation.y = Math.PI;
          g.add(rj);
        }
        g.add(body);
        g.userData.portOffset = new THREE.Vector3(-0.35, 0.15, -0.55);
        return g;
      }
    }
  },

  /* ── 6. SWITCHES (KOMMUTATORLAR) ── */
  switch: {
    // 1. Cisco Catalyst 9300 24P PoE+
    cisco_catalyst_9300: {
      name: "Cisco Catalyst 9300 24P PoE+ & 4x 10G SFP+",
      brand: "Cisco",
      category: "switch",
      desc: "1U korporativ L2/L3 kommutator, 24 ta alohida RJ45 port (LED li), 4x 10G SFP+ uplink moduli, konsol porti.",
      ports: ["Fa0/1", "Fa0/2", "Gi0/1", "Gi0/2"],
      builder: function(){
        const g = new THREE.Group();
        // 1U Rack Chassis
        const body = box(1.85, 0.22, 1.15, mat(0x1E293B, {metalness:0.65, roughness:0.35}));
        body.position.y = 0.12;
        // Rackmount Ears
        [[-0.95, 0.12], [0.95, 0.12]].forEach(([x, y]) => {
          const ear = box(0.06, 0.24, 0.35, mat(0x334155, {metalness:0.8}));
          ear.position.set(x, y, 0.35);
          g.add(ear);
        });

        // 24 Individual RJ45 Ports in 2 Rows (12 cols x 2)
        for(let col = 0; col < 12; col++){
          const px = -0.65 + col * 0.095;
          const rjTop = buildRj45Port(); rjTop.position.set(px, 0.16, 0.58);
          const rjBot = buildRj45Port(); rjBot.position.set(px, 0.08, 0.58);
          g.add(rjTop, rjBot);
        }

        // 4x 10G SFP+ Uplink Cages on Right
        for(let s = 0; s < 4; s++){
          const sfp = buildSfpCage();
          sfp.position.set(0.55 + (s % 2) * 0.09, 0.15 - Math.floor(s / 2) * 0.07, 0.56);
          g.add(sfp);
        }

        // Blue UID Beacon LED + Mode Button
        const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.015, 8, 8), emissiveMat(0x38BDF8, 3.0));
        beacon.position.set(-0.8, 0.16, 0.58);
        g.add(body, beacon);

        g.userData.portOffset = new THREE.Vector3(-0.65, 0.16, 0.6);
        return g;
      }
    },

    // 2. Cisco Catalyst 2960-X 24TS-L
    cisco_catalyst_2960x: {
      name: "Cisco Catalyst 2960-X 24TS-L Switch",
      brand: "Cisco",
      category: "switch",
      desc: "Klassik Cisco 2960 seriyali 24 portli Gigabit Ethernet switch, 2 ta SFP optik port, FlexStack yordami.",
      ports: ["Fa0/1", "Fa0/2", "Gi0/1", "Gi0/2"],
      builder: function(){
        const g = new THREE.Group();
        const body = box(1.85, 0.22, 1.1, mat(0x064E3B, {metalness:0.4, roughness:0.5})); // Cisco Green
        body.position.y = 0.12;
        // 24 Ports
        for(let col = 0; col < 12; col++){
          const px = -0.65 + col * 0.095;
          const rjTop = buildRj45Port(); rjTop.position.set(px, 0.15, 0.555);
          const rjBot = buildRj45Port(); rjBot.position.set(px, 0.08, 0.555);
          g.add(rjTop, rjBot);
        }
        // Dual SFP
        const sfp1 = buildSfpCage(); sfp1.position.set(0.62, 0.12, 0.54);
        g.add(body, sfp1);
        g.userData.portOffset = new THREE.Vector3(-0.65, 0.15, 0.58);
        return g;
      }
    },

    // 3. Ubiquiti UniFi Pro 24 PoE Layer 3
    ubiquiti_unifi_pro_24: {
      name: "Ubiquiti UniFi Pro 24 PoE Layer 3",
      brand: "Ubiquiti",
      category: "switch",
      desc: "Kumushrang CNC unibody korpus, 1.3\" rangli LCM sensorli ekran (oqim animatsiyasi), 24x PoE+ va 2x 10G SFP+.",
      ports: ["Fa0/1", "Fa0/2", "Gi0/1", "Gi0/2"],
      builder: function(){
        const g = new THREE.Group();
        const body = box(1.85, 0.22, 1.15, mat(0xD1D5DB, {metalness:0.85, roughness:0.25}));
        body.position.y = 0.12;

        // 1.3" Touchscreen LCM Display
        const lcm = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 0.12), emissiveMat(0x38BDF8, 2.0));
        lcm.position.set(-0.72, 0.12, 0.58);
        g.add(body, lcm);

        // 24 White-lit RJ45 ports
        for(let col = 0; col < 12; col++){
          const px = -0.52 + col * 0.09;
          const rjTop = buildRj45Port(); rjTop.position.set(px, 0.15, 0.58);
          const rjBot = buildRj45Port(); rjBot.position.set(px, 0.08, 0.58);
          g.add(rjTop, rjBot);
        }
        g.userData.portOffset = new THREE.Vector3(-0.52, 0.15, 0.6);
        return g;
      }
    }
  },

  /* ── 7. PRINTERS (PRINTERLAR) ── */
  printer: {
    // 1. HP LaserJet Enterprise MFP M528dn
    hp_laserjet_m528: {
      name: "HP LaserJet Enterprise MFP M528dn",
      brand: "HP",
      category: "printer",
      desc: "Katta 8\" aylanuvchi sensorli ekran (HP UI), 100-varaqli ikki tomonlama ADF skaner, tortiluvchi qog'oz kassetasi, Gigabit LAN.",
      ports: ["Fa0/1", "WLAN0"],
      builder: function(){
        const g = new THREE.Group();
        // Lower Main Engine Chassis
        const chassis = box(1.05, 0.65, 0.85, mat(0xF8FAFC, {roughness:0.4}));
        chassis.position.y = 0.35;
        // Paper Tray Cassette with Level Gauge
        const tray = box(0.95, 0.14, 0.75, mat(0xE2E8F0));
        tray.position.set(0, 0.12, 0.05);
        const trayHandle = box(0.25, 0.03, 0.02, mat(0x64748B));
        trayHandle.position.set(0, 0.12, 0.43);
        g.add(chassis, tray, trayHandle);

        // Output Bin Cavity
        const outBin = box(0.85, 0.18, 0.65, mat(0x0F172A));
        outBin.position.set(0, 0.5, 0.08);
        g.add(outBin);

        // Top ADF Scanner Flatbed
        const scanner = box(1.05, 0.22, 0.85, mat(0xF8FAFC));
        scanner.position.set(0, 0.78, 0);
        const adfTray = box(0.65, 0.04, 0.45, mat(0x1E293B));
        adfTray.position.set(0, 0.91, -0.05);
        g.add(scanner, adfTray);

        // 8" Rotating Color Touchscreen with HP Printer UI
        const screenMat = new THREE.MeshBasicMaterial({ map: createScreenTexture('printer_touch', 'HP LaserJet M528') });
        const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.35, 0.22), screenMat);
        screen.position.set(0.42, 0.68, 0.44);
        screen.rotation.x = -0.35;
        g.add(screen);

        // Rear Gigabit RJ45 Port
        const rj = buildRj45Port();
        rj.position.set(-0.35, 0.35, -0.43);
        rj.rotation.y = Math.PI;
        g.add(rj);

        g.userData.portOffset = new THREE.Vector3(-0.35, 0.35, -0.45);
        return g;
      }
    },

    // 2. Canon imageRUNNER ADVANCE C3530i
    canon_imagerunner: {
      name: "Canon imageRUNNER ADVANCE C3530i",
      brand: "Canon",
      category: "printer",
      desc: "Og'ir polga o'rnatiluvchi rangli lazerli ofis MFP kombayni, ikkita 550 varaqli kasseta, sensorli ekran.",
      ports: ["Fa0/1", "WLAN0"],
      builder: function(){
        const g = new THREE.Group();
        const base = box(1.1, 1.35, 0.95, mat(0xF1F5F9, {roughness:0.5}));
        base.position.y = 0.68;
        const screen = box(0.35, 0.22, 0.03, mat(0x1E293B));
        screen.position.set(0.42, 1.25, 0.45);
        screen.rotation.x = -0.3;
        g.add(base, screen);
        const rj = buildRj45Port();
        rj.position.set(-0.4, 0.5, -0.48);
        rj.rotation.y = Math.PI;
        g.add(rj);
        g.userData.portOffset = new THREE.Vector3(-0.4, 0.5, -0.5);
        return g;
      }
    }
  },

  /* ── 8. SERVERS (SERVERLAR) ── */
  server: {
    // 1. Dell PowerEdge R750 2U Server
    dell_poweredge_r750: {
      name: "Dell PowerEdge R750 2U Enterprise",
      brand: "Dell",
      category: "server",
      desc: "2U korporativ server, 24x 2.5\" hot-swap SAS/NVMe disk kassetalari (LED li), orqada 4x 10GbE RJ45 + 2x 25G SFP28.",
      ports: ["Gi0/1", "Gi0/2"],
      builder: function(){
        const g = new THREE.Group();
        // 2U Chassis
        const chassis = box(1.85, 0.42, 1.65, mat(0x1E293B, {metalness:0.7, roughness:0.3}));
        chassis.position.y = 0.22;
        // Honeycomb Security Bezel with Dell Logo
        const bezel = box(1.82, 0.4, 0.04, mat(0x0F172A, {roughness:0.8}));
        bezel.position.set(0, 0.22, 0.84);
        const dellLogo = new THREE.Mesh(new THREE.RingGeometry(0.02, 0.04, 16), emissiveMat(0x38BDF8, 2.5));
        dellLogo.position.set(0, 0.22, 0.865);
        g.add(chassis, bezel, dellLogo);

        // 24x 2.5" Hot-Swap Drive Bays with Activity LEDs
        for(let r = 0; r < 2; r++){
          for(let c = 0; c < 12; c++){
            const px = -0.72 + c * 0.12;
            const py = 0.14 + r * 0.16;
            const drive = box(0.1, 0.14, 0.02, mat(0x334155, {metalness:0.6}));
            drive.position.set(px, py, 0.85);
            const led = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.008, 0.004), emissiveMat(c % 3 === 0 ? 0x00FF87 : 0x38BDF8, 2.0));
            led.position.set(px + 0.035, py + 0.05, 0.862);
            g.add(drive, led);
          }
        }

        // Rear Quad 10GbE RJ45 Ports
        for(let i = 0; i < 4; i++){
          const rj = buildRj45Port(`10GbE_${i+1}`);
          rj.position.set(-0.35 + i * 0.15, 0.2, -0.835);
          rj.rotation.y = Math.PI;
          g.add(rj);
        }

        g.userData.portOffset = new THREE.Vector3(-0.35, 0.2, -0.85);
        return g;
      }
    },

    // 2. Synology DiskStation DS923+ 4-Bay NAS
    synology_ds923_plus: {
      name: "Synology DiskStation DS923+ 4-Bay NAS",
      brand: "Synology",
      category: "server",
      desc: "Ixcham 4-bay tarmoq xotirasi (NAS), qulflanuvchi disk tovoqlari, qo'shaloq Gigabit RJ45, eSATA.",
      ports: ["Gi0/1", "Gi0/2"],
      builder: function(){
        const g = new THREE.Group();
        const body = box(0.75, 0.85, 0.95, mat(0x0F172A, {roughness:0.6}));
        body.position.y = 0.43;
        // 4 Drive Bays
        for(let i = 0; i < 4; i++){
          const bay = box(0.12, 0.65, 0.03, mat(0x1E293B));
          bay.position.set(-0.24 + i * 0.16, 0.43, 0.485);
          const led = new THREE.Mesh(new THREE.SphereGeometry(0.01, 8, 8), emissiveMat(0x00FF87, 2.0));
          led.position.set(-0.24 + i * 0.16, 0.78, 0.495);
          g.add(bay, led);
        }
        // Dual Rear RJ45 Ports
        const rj1 = buildRj45Port('LAN1'); rj1.position.set(-0.1, 0.25, -0.485); rj1.rotation.y = Math.PI;
        const rj2 = buildRj45Port('LAN2'); rj2.position.set(0.1, 0.25, -0.485); rj2.rotation.y = Math.PI;
        g.add(body, rj1, rj2);

        g.userData.portOffset = new THREE.Vector3(-0.1, 0.25, -0.5);
        return g;
      }
    }
  },

  /* ── 9. MODEMS (MODEMLAR) ── */
  modem: {
    // 1. Huawei EchoLife HG8245H GPON ONT
    huawei_gpon_ont: {
      name: "Huawei EchoLife GPON Optical ONT",
      brand: "Huawei",
      category: "modem",
      desc: "Klassik oq optik GPON modem, pastida SC/APC yashil optik port, 4x Gigabit LAN, ikkita antenna.",
      ports: ["WAN", "LAN1"],
      builder: function(){
        const g = new THREE.Group();
        const body = box(1.3, 0.32, 0.95, mat(0xF8FAFC, {roughness:0.5}));
        body.position.y = 0.17;
        // Dual Antennas
        [[-0.45, -0.3], [0.45, -0.3]].forEach(([x, z]) => {
          const ant = buildAntennaMesh(0.48);
          ant.position.set(x, 0.32, z);
          g.add(ant);
        });
        // Green SC/APC Optical Port (WAN)
        const optPort = box(0.06, 0.05, 0.04, mat(0x22C55E)); // Green SC
        optPort.position.set(-0.35, 0.16, -0.485);
        // 4 LAN Ports
        for(let i = 0; i < 4; i++){
          const rj = buildRj45Port(`LAN${i+1}`);
          rj.position.set(-0.1 + i * 0.14, 0.16, -0.485);
          rj.rotation.y = Math.PI;
          g.add(rj);
        }
        // Status LEDs
        for(let i = 0; i < 5; i++){
          const led = new THREE.Mesh(new THREE.SphereGeometry(0.015, 8, 8), emissiveMat(i === 0 ? 0x00FF87 : 0x38BDF8, 2.2));
          led.position.set(-0.4 + i * 0.2, 0.33, 0.32);
          g.add(led);
        }
        g.add(body, optPort);
        g.userData.portOffset = new THREE.Vector3(-0.35, 0.16, -0.5);
        return g;
      }
    },

    // 2. ZTE 5G Indoor Router MC801A
    zte_5g_cpe: {
      name: "ZTE 5G Indoor Router MC801A",
      brand: "ZTE",
      category: "modem",
      desc: "Oq aerodinamik silindrsimon 5G router, 5G uyali aloqa indikatori, ikkita Gigabit Ethernet port.",
      ports: ["WAN", "LAN1"],
      builder: function(){
        const g = new THREE.Group();
        const cylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.38, 0.95, 24), mat(0xF8FAFC, {roughness:0.3}));
        cylinder.position.y = 0.48;
        // 5G Signal LED Bar
        for(let i = 0; i < 4; i++){
          const bar = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.04 + i * 0.02, 0.01), emissiveMat(0x00FF87, 2.5));
          bar.position.set(-0.06 + i * 0.04, 0.65, 0.37);
          g.add(bar);
        }
        // Dual Gigabit RJ45 Ports on rear
        const rj1 = buildRj45Port('WAN/LAN'); rj1.position.set(-0.06, 0.25, -0.37); rj1.rotation.y = Math.PI;
        const rj2 = buildRj45Port('LAN'); rj2.position.set(0.06, 0.25, -0.37); rj2.rotation.y = Math.PI;
        g.add(cylinder, rj1, rj2);

        g.userData.portOffset = new THREE.Vector3(-0.06, 0.25, -0.39);
        return g;
      }
    }
  }
};

/* ==========================================================================
   4. BACKWARD COMPATIBILITY ALIASES (Eski topologiyalar va saqlangan loyihalar uchun)
   ========================================================================== */

// Desktop
MODELS_DB.desktop.pc_office_tower   = MODELS_DB.desktop.dell_optiplex_7090;
MODELS_DB.desktop.pc_gaming_rgb     = MODELS_DB.desktop.acer_predator_orion;
MODELS_DB.desktop.pc_all_in_one     = MODELS_DB.desktop.apple_imac_24;
MODELS_DB.desktop.workstation_triple = MODELS_DB.desktop.apple_mac_studio;
MODELS_DB.desktop.pc_mini_sff       = MODELS_DB.desktop.hp_elitedesk_mini || MODELS_DB.desktop.dell_optiplex_7090;

// Laptop
MODELS_DB.laptop.laptop_thinkpad    = MODELS_DB.laptop.lenovo_thinkpad_x1;
MODELS_DB.laptop.laptop_macbook     = MODELS_DB.laptop.apple_macbook_pro_16;
MODELS_DB.laptop.laptop_gaming      = MODELS_DB.laptop.acer_predator_helios;
MODELS_DB.laptop.laptop_ultrabook   = MODELS_DB.laptop.hp_elitebook_840;

// Phone & Tablet
MODELS_DB.phone.phone_cisco_8845    = MODELS_DB.phone.cisco_ip_phone_8845;
MODELS_DB.phone.phone_smartphone    = MODELS_DB.phone.apple_iphone_16_pro;
MODELS_DB.phone.phone_polycom_vvx   = MODELS_DB.phone.cisco_ip_phone_8845;
MODELS_DB.tablet.tablet_stand       = MODELS_DB.tablet.apple_ipad_pro_m4;
MODELS_DB.tablet.tablet_rugged      = MODELS_DB.tablet.samsung_galaxy_tab_s9;

// Router & Switch
MODELS_DB.router.router_cisco_2911  = MODELS_DB.router.cisco_isr_4451;
MODELS_DB.router.router_cisco_4331  = MODELS_DB.router.cisco_isr_4451;
MODELS_DB.router.router_wifi_archer = MODELS_DB.router.tp_link_archer_ax73;
MODELS_DB.switch.switch_cisco_2960  = MODELS_DB.switch.cisco_catalyst_2960x;
MODELS_DB.switch.switch_cisco_3850  = MODELS_DB.switch.cisco_catalyst_9300;
MODELS_DB.switch.switch_cisco_nexus = MODELS_DB.switch.cisco_catalyst_9300;

// Printer, Server, Modem
MODELS_DB.printer.printer_canon_copier = MODELS_DB.printer.canon_imagerunner;
MODELS_DB.printer.printer_hp_laser     = MODELS_DB.printer.hp_laserjet_m528;
MODELS_DB.server.server_dell_r740      = MODELS_DB.server.dell_poweredge_r750;
MODELS_DB.server.server_hpe_dl380      = MODELS_DB.server.dell_poweredge_r750;
MODELS_DB.server.storage_nas_synology  = MODELS_DB.server.synology_ds923_plus;
MODELS_DB.modem.modem_gpon_ont         = MODELS_DB.modem.huawei_gpon_ont;

/* ==========================================================================
   5. CABLE TYPES & 3D CONNECTORS
   ========================================================================== */

const CABLE_TYPES_DB = {
  cat6: {
    id: "cat6",
    name: "Cat6 UTP (Unshielded Twisted Pair)",
    color: 0x38BDF8,
    hexColor: "#38BDF8",
    diameter: 0.035,
    speed: "1 Gbps / 10 Gbps (55m)",
    desc: "Klassik moviy egiluvchan ofis kabeli, shaffof RJ-45 konnektori bilan.",
    connectorType: "rj45_transparent"
  },
  cat7: {
    id: "cat7",
    name: "Cat7 S/FTP (Shielded Foiled Twisted Pair)",
    color: 0x1E293B,
    hexColor: "#475569",
    diameter: 0.045,
    speed: "10 Gbps (100m)",
    desc: "Shovqinga chidamli metall ekranli qalin to‘q kulrang kabel.",
    connectorType: "rj45_metal"
  },
  fiber_single: {
    id: "fiber_single",
    name: "Singlemode Fiber (OS2 9/125µm)",
    color: 0xF59E0B,
    hexColor: "#F59E0B",
    diameter: 0.025,
    speed: "10G / 40G / 100G (10km+)",
    desc: "Sariq rangli ingichka optik kabel, ko‘k duplex LC konnektori bilan.",
    connectorType: "lc_duplex_blue"
  },
  fiber_multi: {
    id: "fiber_multi",
    name: "Multimode Fiber (OM4 50/125µm)",
    color: 0x06B6D4,
    hexColor: "#06B6D4",
    diameter: 0.028,
    speed: "10G / 40G / 100G (400m)",
    desc: "Aqua feruza rangli yuqori tezlikdagi optik kabel, feruza LC konnektor bilan.",
    connectorType: "lc_duplex_aqua"
  },
  dac_twinax: {
    id: "dac_twinax",
    name: "10G SFP+ DAC Twinax Copper",
    color: 0x0B0F17,
    hexColor: "#00FF87",
    diameter: 0.05,
    speed: "10 Gbps Direct Server Attach",
    desc: "Qalin qora mis kabel, ikkala uchida to‘liq metall SFP+ modullari bilan.",
    connectorType: "sfp_twinax"
  },
  console: {
    id: "console",
    name: "Cisco Console (Rollover RJ45-to-DB9)",
    color: 0x60A5FA,
    hexColor: "#60A5FA",
    diameter: 0.025,
    speed: "9600 - 115200 Baud Serial",
    desc: "Yassi moviy tasma kabel, routerni konsol orqali boshqarish uchun.",
    connectorType: "rj45_console"
  },
  crossover: {
    id: "crossover",
    name: "Crossover Ethernet Cable",
    color: 0xEF4444,
    hexColor: "#EF4444",
    diameter: 0.035,
    speed: "1 Gbps",
    desc: "Yorqin qizil kabel, bir xil qurilmalarni to‘g‘ridan-to‘g‘ri ulash uchun.",
    connectorType: "rj45_red"
  }
};

function buildConnectorMesh(type){
  const g = new THREE.Group();

  if(type === 'rj45_transparent' || type === 'rj45_red' || type === 'rj45_console'){
    const bootColor = type === 'rj45_red' ? 0xEF4444 : type === 'rj45_console' ? 0x60A5FA : 0x38BDF8;
    const boot = box(0.065, 0.065, 0.12, mat(bootColor, {roughness:0.6}));
    boot.position.z = -0.06;
    const plug = box(0.055, 0.05, 0.09, new THREE.MeshPhysicalMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0.6, roughness: 0.1 }));
    plug.position.z = 0.045;
    const pins = box(0.04, 0.01, 0.03, mat(0xF59E0B, {metalness:0.9}));
    pins.position.set(0, 0.022, 0.06);
    g.add(boot, plug, pins);
  } else if(type === 'rj45_metal'){
    const boot = box(0.07, 0.07, 0.14, mat(0x94A3B8, {metalness:0.9, roughness:0.2}));
    g.add(boot);
  } else if(type === 'lc_duplex_blue' || type === 'lc_duplex_aqua'){
    const col = type === 'lc_duplex_blue' ? 0x2563EB : 0x06B6D4;
    const clip = box(0.09, 0.06, 0.15, mat(col));
    const ferruleL = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.06, 8), mat(0xFFFFFF));
    ferruleL.rotation.x = Math.PI / 2; ferruleL.position.set(-0.025, 0, 0.1);
    const ferruleR = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.06, 8), mat(0xFFFFFF));
    ferruleR.rotation.x = Math.PI / 2; ferruleR.position.set(0.025, 0, 0.1);
    g.add(clip, ferruleL, ferruleR);
  } else if(type === 'sfp_twinax'){
    const sfp = box(0.08, 0.06, 0.22, mat(0x64748B, {metalness:0.95, roughness:0.15}));
    const latch = box(0.06, 0.02, 0.08, mat(0x00FF87));
    latch.position.set(0, 0.035, -0.05);
    g.add(sfp, latch);
  }

  return g;
}

// Global scope export
window.MODELS_DB = MODELS_DB;
window.CABLE_TYPES_DB = CABLE_TYPES_DB;
window.buildConnectorMesh = buildConnectorMesh;
window.createScreenTexture = createScreenTexture;
window.createKeyboardTexture = createKeyboardTexture;
window.buildRj45Port = buildRj45Port;
window.buildUsbCPort = buildUsbCPort;
window.buildUsbAPort = buildUsbAPort;
window.buildAntennaMesh = buildAntennaMesh;
window.buildPowerButton = buildPowerButton;
window.buildSfpCage = buildSfpCage;
