/* ==========================================================================
   DHCP SERVER SIMULYATSIYASI
   Router yoki Server da DHCP pool boshqaruvi, lease jadvali
   ========================================================================== */

const dhcpServers = new Map(); // devId -> DhcpServerConfig

/** DHCP server konfiguratsiyasi yaratish */
function initDhcpServer(devId, opts = {}) {
  const dev = devices.get(devId);
  if (!dev) return;
  if (dev.type !== 'router' && dev.type !== 'server') {
    toast('⚠️ Faqat Router yoki Server DHCP berishi mumkin!');
    return;
  }

  // IP dan subnet olish
  const netBase = dev.ip.split('.').slice(0, 3).join('.');
  const cfg = {
    enabled:       true,
    poolStart:     opts.poolStart  || `${netBase}.10`,
    poolEnd:       opts.poolEnd    || `${netBase}.254`,
    gateway:       opts.gateway    || dev.ip,
    dns:           opts.dns        || '8.8.8.8',
    leaseDuration: opts.lease      || 86400,   // sekund
    leases:        new Map(),                  // ip -> { devId, name, mac, grantedAt }
    excluded:      new Set(opts.excluded || [dev.ip])
  };
  dhcpServers.set(devId, cfg);
  dev.dhcpServer = cfg;

  toast(`🖥️ DHCP Server yoqildi: ${dev.name} (${cfg.poolStart}–${cfg.poolEnd})`);
  if (selectedDeviceId === devId) refreshPanel();
}

/** DHCP server o'chirish */
function disableDhcpServer(devId) {
  dhcpServers.delete(devId);
  const dev = devices.get(devId);
  if (dev) { delete dev.dhcpServer; }
  toast(`🛑 DHCP Server o'chirildi`);
  if (selectedDeviceId === devId) refreshPanel();
}

/** Berilgan DHCP serverdan keyingi bo'sh IP topish */
function dhcpNextFreeIp(cfg) {
  const startN = ipToLong(cfg.poolStart);
  const endN   = ipToLong(cfg.poolEnd);
  const usedIps = new Set([...cfg.leases.keys()].map(ip => ipToLong(ip)));
  // Excluded IP larni ham qo'shish
  cfg.excluded.forEach(ip => { try { usedIps.add(ipToLong(ip)); } catch(e){} });

  for (let n = startN; n <= endN; n++) {
    if (!usedIps.has(n)) return longToIp(n);
  }
  return null;
}

/** Qurilma DHCP so'rovi yuboradi */
function dhcpRequest(clientDevId) {
  const client = devices.get(clientDevId);
  if (!client) return false;

  // BFS orqali eng yaqin DHCP serverni topish
  let serverDevId = null;
  const queue   = [clientDevId];
  const visited = new Set([clientDevId]);

  while (queue.length > 0 && !serverDevId) {
    const curr = queue.shift();
    if (dhcpServers.has(curr) && dhcpServers.get(curr).enabled) {
      serverDevId = curr;
      break;
    }
    connections.forEach(c => {
      const n = c.a === curr ? c.b : c.b === curr ? c.a : null;
      if (n && !visited.has(n)) { visited.add(n); queue.push(n); }
    });
  }

  if (!serverDevId) {
    toast(`⚠️ ${client.name}: Tarmoqda DHCP server topilmadi!`);
    return false;
  }

  const cfg = dhcpServers.get(serverDevId);
  const server = devices.get(serverDevId);

  // Eski lease ni tozalash
  cfg.leases.forEach((lease, ip) => {
    if (lease.devId === clientDevId) cfg.leases.delete(ip);
  });

  // Yangi IP berish
  const newIp = dhcpNextFreeIp(cfg);
  if (!newIp) {
    toast(`⚠️ ${server.name}: DHCP pool tugadi! IP mavjud emas.`);
    logSimEvent(server.name, client.name, 'DHCP', server.name, 'Xatolik: Pool tugadi', 'No addresses available');
    return false;
  }

  // Lease saqlash
  cfg.leases.set(newIp, {
    devId:     clientDevId,
    name:      client.name,
    mac:       client.mac,
    grantedAt: Date.now(),
    expires:   Date.now() + cfg.leaseDuration * 1000
  });

  // Qurilma IP sini yangilash
  const oldIp  = client.ip;
  client.ip    = newIp;
  client.mask  = cidrToMask(maskToCidr(client.mask || '255.255.255.0'));
  client.gw    = cfg.gateway;
  client.dns   = cfg.dns;
  client.ipMode = 'dhcp';

  // Label yangilash
  if (client.label) {
    client.label.querySelector('.nm').textContent = client.name;
    client.label.querySelector('.ip').textContent  = client.ip;
  }

  // Paket animatsiyasi
  startPacketTransfer({
    srcId:    clientDevId,
    dstId:    serverDevId,
    type:     'http',
    fileName: 'DHCP DISCOVER/OFFER',
    fileSize: '342 bytes'
  });

  logSimEvent(client.name, server.name, 'DHCP', server.name, 'Muvaffaqiyatli', `IP berildi: ${newIp} (lease ${cfg.leaseDuration}s)`);
  toast(`✅ ${client.name} DHCP orqali IP oldi: ${newIp} (Server: ${server.name})`);

  if (selectedDeviceId === clientDevId || selectedDeviceId === serverDevId) refreshPanel();
  return true;
}

/** DHCP lease ni ozod qilish */
function dhcpRelease(clientDevId) {
  dhcpServers.forEach((cfg, srvId) => {
    cfg.leases.forEach((lease, ip) => {
      if (lease.devId === clientDevId) {
        cfg.leases.delete(ip);
        toast(`📤 DHCP release: ${ip} ozod qilindi`);
      }
    });
  });
}

/** Muddati o'tgan leaselarni tozalash (har daqiqada chaqiriladi) */
function dhcpCleanExpiredLeases() {
  const now = Date.now();
  dhcpServers.forEach(cfg => {
    cfg.leases.forEach((lease, ip) => {
      if (lease.expires && lease.expires < now) {
        cfg.leases.delete(ip);
      }
    });
  });
}
setInterval(dhcpCleanExpiredLeases, 60_000);

/* ---------- DHCP Konflikт aniqlash ---------- */
function checkDhcpConflicts() {
  const ipMap = new Map(); // ip -> [devId, ...]
  devices.forEach(d => {
    if (!ipMap.has(d.ip)) ipMap.set(d.ip, []);
    ipMap.get(d.ip).push(d.id);
  });
  const conflicts = [];
  ipMap.forEach((ids, ip) => {
    if (ids.length > 1) {
      conflicts.push({ ip, devices: ids.map(id => devices.get(id)?.name || id) });
    }
  });
  return conflicts;
}

/* ---------- DHCP Panel UI ---------- */
function renderDhcpSection(devId) {
  const dev = devices.get(devId);
  if (!dev) return '';
  if (dev.type !== 'router' && dev.type !== 'server') return '';

  const cfg = dhcpServers.get(devId);
  if (!cfg) {
    return `
      <div class="p-section">
        <div class="p-section-title" style="color:#FBBF24;">⚡ DHCP Server</div>
        <div style="font-size:11px;color:var(--ink-dim);margin-bottom:8px;">Bu qurilmada DHCP server o'chirilgan</div>
        <button class="actbtn on" style="width:100%;font-size:11px;" onclick="initDhcpServer('${devId}')">
          ▶ DHCP Serverni yoqish
        </button>
      </div>
    `;
  }

  const now   = Date.now();
  const total = (() => {
    const s = ipToLong(cfg.poolStart), e = ipToLong(cfg.poolEnd);
    return e - s + 1;
  })();
  const used  = cfg.leases.size;
  const free  = total - used;
  const pct   = Math.round((used / total) * 100);

  const leaseRows = [...cfg.leases.entries()].map(([ip, lease]) => {
    const d   = devices.get(lease.devId);
    const ago = Math.round((now - lease.grantedAt) / 60000);
    return `
      <div class="dhcp-lease-row">
        <span class="mono" style="color:#6FE3C4;">${ip}</span>
        <span style="font-size:10.5px;">${d ? d.name : lease.name}</span>
        <span style="font-size:10px;color:var(--ink-dim);">${ago}m oldin</span>
        <button class="actbtn warn" style="font-size:9px;padding:2px 6px;" onclick="dhcpRelease('${lease.devId}');initDhcpServer('${devId}')">⊗</button>
      </div>
    `;
  }).join('');

  return `
    <div class="p-section">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div class="p-section-title" style="color:#FBBF24;">⚡ DHCP Server</div>
        <button class="actbtn warn" style="font-size:9px;padding:2px 7px;" onclick="disableDhcpServer('${devId}')">O'chirish</button>
      </div>
      <div style="font-size:11px;margin-bottom:6px;">
        <span style="color:var(--ink-dim);">Pool:</span>
        <span class="mono" style="color:#38BDF8;">${cfg.poolStart}</span>
        <span style="color:var(--ink-dim);">–</span>
        <span class="mono" style="color:#38BDF8;">${cfg.poolEnd}</span>
      </div>
      <div style="display:flex;gap:6px;margin-bottom:8px;font-size:11px;">
        <span>🟢 Band: <b>${used}</b></span>
        <span>⚪ Bosh: <b>${free}</b></span>
        <span>📊 ${pct}%</span>
      </div>
      <div style="background:var(--line);border-radius:4px;height:5px;margin-bottom:8px;">
        <div style="width:${pct}%;height:100%;border-radius:4px;background:${pct>80?'#EF4444':pct>50?'#FFB454':'#00FF87'};"></div>
      </div>
      ${leaseRows ? `<div style="max-height:90px;overflow-y:auto;">${leaseRows}</div>` : '<div style="font-size:10.5px;color:var(--ink-dim);">Lease yo\'q</div>'}
    </div>
  `;
}

function renderDhcpClientSection(devId) {
  const dev = devices.get(devId);
  if (!dev || dev.type === 'router' || dev.type === 'switch') return '';
  const hasDhcp = [...dhcpServers.values()].some(c => c.leases.has(dev.ip) && c.leases.get(dev.ip).devId === devId);
  return `
    <div class="p-section">
      <div class="p-section-title" style="color:#38BDF8;">🔌 IP Sozlamalari</div>
      <div style="display:flex;gap:6px;">
        <button class="actbtn ${dev.ipMode !== 'dhcp' ? 'on' : ''}" style="flex:1;font-size:10.5px;" onclick="setDeviceIpMode('${devId}', 'static')">
          Static
        </button>
        <button class="actbtn ${dev.ipMode === 'dhcp' ? 'on' : ''}" style="flex:1;font-size:10.5px;" onclick="dhcpRequest('${devId}')">
          📡 DHCP so'rov
        </button>
      </div>
      ${hasDhcp ? `<div style="margin-top:4px;font-size:10px;color:#6FE3C4;">✓ DHCP orqali: ${dev.ip}</div>` : ''}
    </div>
  `;
}

function setDeviceIpMode(devId, mode) {
  const dev = devices.get(devId);
  if (!dev) return;
  dev.ipMode = mode;
  if (mode === 'dhcp') dhcpRequest(devId);
  else refreshPanel();
}
