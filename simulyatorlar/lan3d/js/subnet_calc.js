/* ==========================================================================
   SUBNET CALCULATOR — IP / Mask → Network, Broadcast, Hosts, CIDR
   ========================================================================== */

/** longToIp: 32-bit integer → "a.b.c.d" */
function longToIp(n) {
  n = n >>> 0;
  return [
    (n >>> 24) & 0xFF,
    (n >>> 16) & 0xFF,
    (n >>> 8)  & 0xFF,
     n         & 0xFF
  ].join('.');
}

/** maskToCidr: "255.255.255.0" → 24 */
function maskToCidr(mask) {
  const n = ipToLong(mask);
  let count = 0;
  for (let i = 31; i >= 0; i--) {
    if ((n >>> i) & 1) count++;
    else break;
  }
  return count;
}

/** cidrToMask: 24 → "255.255.255.0" */
function cidrToMask(cidr) {
  const n = cidr === 0 ? 0 : (0xFFFFFFFF << (32 - cidr)) >>> 0;
  return longToIp(n);
}

/** IP manzil turini aniqlash */
function getIpType(ip) {
  const n = ipToLong(ip);
  const a = (n >>> 24) & 0xFF;
  const b = (n >>> 16) & 0xFF;
  if (a === 10) return { label: 'Private (Class A)', color: '#6FE3C4' };
  if (a === 172 && b >= 16 && b <= 31) return { label: 'Private (Class B)', color: '#6FE3C4' };
  if (a === 192 && b === 168) return { label: 'Private (Class C)', color: '#6FE3C4' };
  if (a === 127) return { label: 'Loopback', color: '#A78BFA' };
  if (a >= 224 && a <= 239) return { label: 'Multicast', color: '#FFB454' };
  if (a === 169 && b === 254) return { label: 'Link-Local (APIPA)', color: '#FBBF24' };
  if (a >= 240) return { label: 'Reserved / Experimental', color: '#EF4444' };
  return { label: 'Public', color: '#38BDF8' };
}

/** Asosiy subnet hisoblash funksiyasi */
function calcSubnet(ip, mask) {
  const ipLong   = ipToLong(ip);
  const maskLong = ipToLong(mask);
  const notMask  = (~maskLong) >>> 0;

  const networkLong    = (ipLong & maskLong) >>> 0;
  const broadcastLong  = (networkLong | notMask) >>> 0;
  const firstHostLong  = networkLong + 1;
  const lastHostLong   = broadcastLong - 1;
  const totalHosts     = notMask + 1;
  const usableHosts    = Math.max(0, totalHosts - 2);
  const cidr           = maskToCidr(mask);

  return {
    ip:          longToIp(ipLong),
    mask:        mask,
    cidr,
    network:     longToIp(networkLong),
    broadcast:   longToIp(broadcastLong),
    firstHost:   usableHosts > 0 ? longToIp(firstHostLong) : '—',
    lastHost:    usableHosts > 0 ? longToIp(lastHostLong)  : '—',
    totalHosts,
    usableHosts,
    ipType:      getIpType(ip),
    isHostIp:    ipLong !== networkLong && ipLong !== broadcastLong,
    isNetwork:   ipLong === networkLong,
    isBroadcast: ipLong === broadcastLong
  };
}

/** VLSM — subnet bo'lish */
function splitSubnet(networkIp, cidr, newCidr) {
  if (newCidr <= cidr) return [];
  const base   = ipToLong(networkIp);
  const count  = 1 << (newCidr - cidr);
  const size   = 1 << (32 - newCidr);
  const result = [];
  for (let i = 0; i < count; i++) {
    const netLong = (base + i * size) >>> 0;
    const bcLong  = (netLong + size - 1) >>> 0;
    result.push({
      network:   longToIp(netLong),
      broadcast: longToIp(bcLong),
      firstHost: longToIp(netLong + 1),
      lastHost:  longToIp(bcLong - 1),
      hosts:     size - 2,
      cidr:      newCidr
    });
  }
  return result;
}

/* ---------- UI Controller ---------- */
let subnetPanelOpen = false;

function openSubnetPanel() {
  const panel = document.getElementById('subnetPanel');
  if (!panel) return;
  subnetPanelOpen = true;
  panel.classList.add('show');
  // Agar tanlangan qurilma bo'lsa, uning IP sini to'ldirish
  if (selectedDeviceId) {
    const rec = devices.get(selectedDeviceId);
    if (rec) {
      const ipEl = document.getElementById('subnetIpInput');
      const mxEl = document.getElementById('subnetMaskInput');
      if (ipEl) ipEl.value  = rec.ip  || '192.168.1.1';
      if (mxEl) mxEl.value  = rec.mask || '255.255.255.0';
      runSubnetCalc();
    }
  }
}

function closeSubnetPanel() {
  const panel = document.getElementById('subnetPanel');
  if (panel) panel.classList.remove('show');
  subnetPanelOpen = false;
}

function runSubnetCalc() {
  const ipEl   = document.getElementById('subnetIpInput');
  const mxEl   = document.getElementById('subnetMaskInput');
  const resEl  = document.getElementById('subnetResults');
  if (!ipEl || !mxEl || !resEl) return;

  const ip   = ipEl.value.trim();
  let mask   = mxEl.value.trim();

  // CIDR notation qabul qilish
  if (mask.startsWith('/')) {
    const cidr = parseInt(mask.slice(1));
    if (isNaN(cidr) || cidr < 0 || cidr > 32) {
      resEl.innerHTML = '<div style="color:#EF4444;padding:8px;">Noto\'g\'ri CIDR notation</div>';
      return;
    }
    mask = cidrToMask(cidr);
    mxEl.value = mask;
  }
  if (mask.includes('/')) {
    const parts = mask.split('/');
    mask = parts[0].trim();
  }

  // Tekshirish
  const ipParts = ip.split('.');
  if (ipParts.length !== 4 || ipParts.some(p => isNaN(p) || +p < 0 || +p > 255)) {
    resEl.innerHTML = '<div style="color:#EF4444;padding:8px;">Noto\'g\'ri IP manzil formati</div>';
    return;
  }

  let r;
  try { r = calcSubnet(ip, mask); }
  catch(e) {
    resEl.innerHTML = '<div style="color:#EF4444;padding:8px;">Hisoblashda xato</div>';
    return;
  }

  const warn = r.isNetwork   ? '<div style="color:#FFB454;font-size:10.5px;margin-bottom:6px;">⚠️ Bu network manzili (host uchun ishlatilmaydi)</div>'
             : r.isBroadcast ? '<div style="color:#FFB454;font-size:10.5px;margin-bottom:6px;">⚠️ Bu broadcast manzili (host uchun ishlatilmaydi)</div>'
             : '';

  // Qurilmalar bilan moslik tekshiruvi
  let deviceCheck = '';
  if (devices.size > 0) {
    const incompatible = [...devices.values()].filter(d => {
      try {
        return !areInSameSubnet(ip, mask, d.ip, mask);
      } catch(e) { return false; }
    });
    if (incompatible.length > 0) {
      deviceCheck = `<div style="margin-top:8px;padding:6px;background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);border-radius:6px;font-size:10.5px;">
        ⚠️ Boshqa subnetda: ${incompatible.map(d=>d.name).join(', ')}
      </div>`;
    }
  }

  resEl.innerHTML = `
    ${warn}
    <div class="subnet-grid">
      <div class="subnet-row"><span class="subnet-label">Network</span><span class="subnet-val mono">${r.network}/${r.cidr}</span></div>
      <div class="subnet-row"><span class="subnet-label">Broadcast</span><span class="subnet-val mono" style="color:#FFB454;">${r.broadcast}</span></div>
      <div class="subnet-row"><span class="subnet-label">Birinchi host</span><span class="subnet-val mono" style="color:#6FE3C4;">${r.firstHost}</span></div>
      <div class="subnet-row"><span class="subnet-label">Oxirgi host</span><span class="subnet-val mono" style="color:#6FE3C4;">${r.lastHost}</span></div>
      <div class="subnet-row"><span class="subnet-label">Foydali hostlar</span><span class="subnet-val" style="color:#00FF87;font-weight:700;">${r.usableHosts.toLocaleString()}</span></div>
      <div class="subnet-row"><span class="subnet-label">Jami adreslar</span><span class="subnet-val">${r.totalHosts.toLocaleString()}</span></div>
      <div class="subnet-row"><span class="subnet-label">Subnet mask</span><span class="subnet-val mono">${r.mask}</span></div>
      <div class="subnet-row"><span class="subnet-label">Wildcard mask</span><span class="subnet-val mono">${longToIp((~ipToLong(mask))>>>0)}</span></div>
      <div class="subnet-row"><span class="subnet-label">IP turi</span><span class="subnet-val" style="color:${r.ipType.color};">${r.ipType.label}</span></div>
    </div>
    ${deviceCheck}

    <div style="margin-top:10px;">
      <div style="font-size:11px;font-weight:700;margin-bottom:4px;color:var(--ink-dim);">VLSM bo'lish:</div>
      <div style="display:flex;gap:6px;align-items:center;">
        <span style="font-size:11px;">/</span>
        <input type="number" id="vlsmCidrInput" class="ip-field-input" value="${Math.min(r.cidr + 1, 30)}" min="${r.cidr+1}" max="30" style="width:60px;padding:4px 6px;">
        <button class="actbtn" style="font-size:10.5px;padding:3px 9px;" onclick="runVlsmSplit()">Bo'lish</button>
      </div>
      <div id="vlsmResults" style="margin-top:6px;"></div>
    </div>
  `;
}

function runVlsmSplit() {
  const ipEl    = document.getElementById('subnetIpInput');
  const mxEl    = document.getElementById('subnetMaskInput');
  const newCidr = parseInt(document.getElementById('vlsmCidrInput')?.value || 0);
  const resEl   = document.getElementById('vlsmResults');
  if (!resEl || !ipEl || !mxEl) return;

  const ip   = ipEl.value.trim();
  const mask = mxEl.value.trim();
  const cidr = maskToCidr(mask);

  if (newCidr <= cidr || newCidr > 30) {
    resEl.innerHTML = '<div style="color:#EF4444;font-size:10.5px;">Noto\'g\'ri CIDR</div>';
    return;
  }

  const r      = calcSubnet(ip, mask);
  const splits = splitSubnet(r.network, cidr, newCidr);
  if (splits.length > 32) {
    resEl.innerHTML = `<div style="color:#FFB454;font-size:10.5px;">Juda ko'p subnet (${splits.length} ta)</div>`;
    return;
  }

  resEl.innerHTML = `
    <div style="font-size:10px;color:var(--ink-dim);margin-bottom:4px;">${splits.length} ta /${newCidr} subnet (har birida ${splits[0].hosts} host):</div>
    <div style="max-height:120px;overflow-y:auto;display:flex;flex-direction:column;gap:2px;">
      ${splits.slice(0,16).map((s,i)=>`
        <div style="display:flex;gap:6px;font-size:10px;font-family:'JetBrains Mono',monospace;padding:2px 0;border-bottom:1px solid var(--line);">
          <span style="color:var(--ink-dim);min-width:18px;">${i+1}.</span>
          <span style="color:#38BDF8;">${s.network}/${newCidr}</span>
          <span style="color:var(--ink-dim);">→</span>
          <span style="color:#6FE3C4;">${s.firstHost}–${s.lastHost}</span>
        </div>
      `).join('')}
      ${splits.length > 16 ? `<div style="color:var(--ink-dim);font-size:10px;padding-top:2px;">... va yana ${splits.length - 16} ta</div>` : ''}
    </div>
  `;
}

// Real-vaqtda hisoblash
document.addEventListener('DOMContentLoaded', () => {
  const ipEl = document.getElementById('subnetIpInput');
  const mxEl = document.getElementById('subnetMaskInput');
  if (ipEl) ipEl.addEventListener('input', runSubnetCalc);
  if (mxEl) mxEl.addEventListener('input', runSubnetCalc);
});
