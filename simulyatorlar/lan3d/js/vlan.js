/* ==========================================================================
   VLAN (VIRTUAL LOCAL AREA NETWORK), 802.1Q TRUNKING & ROUTER-ON-A-STICK
   ========================================================================== */

const DEFAULT_VLAN_COLORS = {
  1:  '#6FE3C4', // Default — Zumrad yashil
  10: '#38BDF8', // Talabalar — Moviy
  20: '#F472B6', // O'qituvchilar — Pushti
  30: '#FBBF24', // Admin — Sariq
  40: '#EC4899', // Mehmonlar — Qizg'ish
  99: '#A78BFA'  // Native / Management — Binafsha
};

const DEFAULT_VLANS = [
  { id: 1,  name: 'default',     color: DEFAULT_VLAN_COLORS[1] },
  { id: 10, name: 'TALABALAR',   color: DEFAULT_VLAN_COLORS[10] },
  { id: 20, name: 'OQITUVCHILAR',color: DEFAULT_VLAN_COLORS[20] },
  { id: 30, name: 'ADMIN',       color: DEFAULT_VLAN_COLORS[30] },
  { id: 99, name: 'MANAGEMENT',  color: DEFAULT_VLAN_COLORS[99] }
];

let vlanViewEnabled = false;
let activeVlanSwitchId = null;
let selectedPaletteVlanId = 10;

/* ─── Switch VLAN va Portlarni initsializatsiya qilish ─── */
function initSwitchVlans(dev) {
  if (!dev || dev.type !== 'switch') return;
  if (!dev.vlans) {
    dev.vlans = JSON.parse(JSON.stringify(DEFAULT_VLANS));
  }
  if (!dev.ports) return;

  dev.ports.forEach((p, idx) => {
    if (typeof p.vlan === 'undefined') p.vlan = 1;
    if (typeof p.mode === 'undefined') {
      // Default: Gi0/1 va Gi0/2 yoki oxirgi portlar trunk qilinishi mumkin, boshqalari access
      p.mode = (p.id === 'Gi0/1' || p.id === 'Gi0/2') ? 'trunk' : 'access';
    }
    if (typeof p.nativeVlan === 'undefined') p.nativeVlan = 1;
    if (typeof p.allowedVlans === 'undefined') p.allowedVlans = 'all'; // 'all' yoki array [1,10,20]
  });

  // Cisco CLI state bilan sinxronlash
  if (dev.cisco) {
    dev.cisco.vlans = dev.vlans.map(v => ({
      id: v.id,
      name: v.name,
      ports: dev.ports.filter(p => p.mode === 'access' && p.vlan === v.id).map(p => p.id)
    }));
  }
}

/* ─── Router Sub-interfeyslarni initsializatsiya qilish ─── */
function initRouterSubinterfaces(dev) {
  if (!dev || dev.type !== 'router') return;
  if (!dev.subinterfaces) {
    dev.subinterfaces = {}; // e.g. 'Gi0/0.10': { subId: 10, basePort: 'Gi0/0', vlan: 10, ip: '192.168.10.1', mask: '255.255.255.0', status: 'up' }
  }
}

/* ─── VLAN CRUD Funksiyalari ─── */
function addVlan(dev, vlanId, name, color) {
  if (!dev || !dev.vlans) return false;
  vlanId = parseInt(vlanId);
  if (isNaN(vlanId) || vlanId < 1 || vlanId > 4094) return false;

  const existing = dev.vlans.find(v => v.id === vlanId);
  if (existing) {
    existing.name = name || existing.name;
    existing.color = color || existing.color;
  } else {
    dev.vlans.push({
      id: vlanId,
      name: name || `VLAN_${vlanId}`,
      color: color || DEFAULT_VLAN_COLORS[vlanId] || '#38BDF8'
    });
    dev.vlans.sort((a, b) => a.id - b.id);
  }

  syncSwitchVlanCiscoState(dev);
  if (typeof autosaveDebounced === 'function') autosaveDebounced();
  return true;
}

function removeVlan(dev, vlanId) {
  if (!dev || !dev.vlans) return false;
  vlanId = parseInt(vlanId);
  if (vlanId === 1) return false; // Default VLAN 1 o'chirilmaydi

  dev.vlans = dev.vlans.filter(v => v.id !== vlanId);
  // Shu VLAN dagi portlarni VLAN 1 ga qaytarish
  if (dev.ports) {
    dev.ports.forEach(p => {
      if (p.vlan === vlanId) p.vlan = 1;
    });
  }

  syncSwitchVlanCiscoState(dev);
  if (typeof autosaveDebounced === 'function') autosaveDebounced();
  return true;
}

function setPortVlan(dev, portId, vlanId) {
  if (!dev || !dev.ports) return false;
  const port = dev.ports.find(p => p.id === portId);
  if (!port) return false;

  vlanId = parseInt(vlanId);
  port.vlan = vlanId;
  port.mode = 'access';

  // VLAN mavjudligini tekshirish, yo'q bo'lsa avtomatik yaratish
  if (dev.vlans && !dev.vlans.some(v => v.id === vlanId)) {
    addVlan(dev, vlanId, `VLAN_${vlanId}`);
  }

  syncSwitchVlanCiscoState(dev);
  applyVlanVisuals();
  if (typeof autosaveDebounced === 'function') autosaveDebounced();
  return true;
}

function setPortMode(dev, portId, mode) {
  if (!dev || !dev.ports) return false;
  const port = dev.ports.find(p => p.id === portId);
  if (!port) return false;

  port.mode = (mode === 'trunk') ? 'trunk' : 'access';
  syncSwitchVlanCiscoState(dev);
  applyVlanVisuals();
  if (typeof autosaveDebounced === 'function') autosaveDebounced();
  return true;
}

function setPortTrunkAllowed(dev, portId, allowed) {
  if (!dev || !dev.ports) return false;
  const port = dev.ports.find(p => p.id === portId);
  if (!port) return false;

  port.allowedVlans = allowed; // 'all' yoki [1, 10, 20]
  syncSwitchVlanCiscoState(dev);
  if (typeof autosaveDebounced === 'function') autosaveDebounced();
  return true;
}

function syncSwitchVlanCiscoState(dev) {
  if (!dev) return;
  if (!dev.cisco) return;
  if (!dev.vlans) return;

  dev.cisco.vlans = dev.vlans.map(v => ({
    id: v.id,
    name: v.name,
    ports: (dev.ports || []).filter(p => p.mode === 'access' && p.vlan === v.id).map(p => p.id)
  }));
}

/* ─── Router Sub-interfeyslarini boshqarish ─── */
function addRouterSubinterface(routerDev, basePort, subId, vlanId, ip, mask) {
  if (!routerDev || routerDev.type !== 'router') return false;
  initRouterSubinterfaces(routerDev);

  const subKey = `${basePort}.${subId}`;
  routerDev.subinterfaces[subKey] = {
    subKey,
    basePort,
    subId: parseInt(subId),
    vlan: parseInt(vlanId),
    ip: ip || 'unassigned',
    mask: mask || '255.255.255.0',
    status: 'up'
  };

  // Cisco CLI interfeyslariga ham qo'shish
  if (routerDev.cisco) {
    if (!routerDev.cisco.interfaces) routerDev.cisco.interfaces = {};
    routerDev.cisco.interfaces[subKey] = {
      ip: ip || 'unassigned',
      mask: mask || '255.255.255.0',
      status: 'up',
      encapsulation: `dot1Q ${vlanId}`
    };
  }

  if (typeof autosaveDebounced === 'function') autosaveDebounced();
  return true;
}

function removeRouterSubinterface(routerDev, subKey) {
  if (!routerDev || !routerDev.subinterfaces) return false;
  delete routerDev.subinterfaces[subKey];
  if (routerDev.cisco && routerDev.cisco.interfaces) {
    delete routerDev.cisco.interfaces[subKey];
  }
  if (typeof autosaveDebounced === 'function') autosaveDebounced();
  return true;
}

/* ─── Qurilmaning qaysi VLAN ga tegishliligini aniqlash ─── */
function getDeviceVlan(devId) {
  const dev = devices.get(devId);
  if (!dev) return null;

  // Agar qurilma switch bo'lmasa, unga ulangan switch portining VLAN ini olamiz
  for (const c of connections.values()) {
    if (c.a === devId || c.b === devId) {
      const otherId = c.a === devId ? c.b : c.a;
      const otherDev = devices.get(otherId);
      if (otherDev && otherDev.type === 'switch') {
        const switchPortId = c.a === devId ? c.portB : c.portA;
        const port = otherDev.ports ? otherDev.ports.find(p => p.id === switchPortId) : null;
        if (port) {
          return {
            switchId: otherDev.id,
            switchName: otherDev.name,
            portId: port.id,
            mode: port.mode,
            vlanId: port.vlan
          };
        }
      }
    }
  }
  return null;
}

/* ─── 3D Sahna VLAN Vizualizatsiyasi ─── */
function toggleVlanView(enable) {
  vlanViewEnabled = (typeof enable === 'boolean') ? enable : !vlanViewEnabled;
  applyVlanVisuals();
  toast(vlanViewEnabled ? "🌈 VLAN Ko'rinishi yoqildi (Ranglar faollashdi)" : "VLAN Ko'rinishi o'chirildi");

  const btn = document.getElementById('vlanViewToggleBtn');
  if (btn) btn.classList.toggle('active', vlanViewEnabled);
}

function applyVlanVisuals() {
  connections.forEach(c => {
    if (!c.mesh) return;
    const ra = devices.get(c.a);
    const rb = devices.get(c.b);
    if (!ra || !rb) return;

    if (!vlanViewEnabled) {
      // Standart ranglarga qaytarish
      const cableDef = (typeof CABLE_TYPES_DB !== 'undefined' && CABLE_TYPES_DB[c.cableType])
        ? CABLE_TYPES_DB[c.cableType] : null;
      let origColor = cableDef ? cableDef.color : (c.wan ? 0xFF8C4B : c.wireless ? 0x4FC7E8 : 0x6FE3C4);
      if (c.mesh.material) {
        c.mesh.material.color = new THREE.Color(origColor);
        if (c.mesh.material.emissive) c.mesh.material.emissive = new THREE.Color(origColor);
      }
      return;
    }

    // VLAN bo'yicha ranglash
    let vlanColorHex = null;
    let isTrunk = false;

    // Switch portlarini tekshirish
    if (ra.type === 'switch' && ra.ports) {
      const pA = ra.ports.find(p => p.id === c.portA);
      if (pA) {
        if (pA.mode === 'trunk') isTrunk = true;
        else {
          const v = ra.vlans ? ra.vlans.find(x => x.id === pA.vlan) : null;
          if (v) vlanColorHex = v.color;
        }
      }
    }
    if (rb.type === 'switch' && rb.ports && !vlanColorHex && !isTrunk) {
      const pB = rb.ports.find(p => p.id === c.portB);
      if (pB) {
        if (pB.mode === 'trunk') isTrunk = true;
        else {
          const v = rb.vlans ? rb.vlans.find(x => x.id === pB.vlan) : null;
          if (v) vlanColorHex = v.color;
        }
      }
    }

    if (isTrunk) {
      // Trunk kabel: Yorqin oq-binafsha pulsatsiya
      if (c.mesh.material) {
        c.mesh.material.color = new THREE.Color(0xFFFFFF);
        if (c.mesh.material.emissive) {
          c.mesh.material.emissive = new THREE.Color(0xA78BFA);
          c.mesh.material.emissiveIntensity = 0.8;
        }
      }
    } else if (vlanColorHex) {
      // Access port kabeli: mos VLAN rangi
      if (c.mesh.material) {
        c.mesh.material.color = new THREE.Color(vlanColorHex);
        if (c.mesh.material.emissive) {
          c.mesh.material.emissive = new THREE.Color(vlanColorHex);
          c.mesh.material.emissiveIntensity = 0.5;
        }
      }
    }
  });

  // 3D Device Labellarni yangilash (VLAN teglari)
  devices.forEach(dev => {
    if (!dev.label) return;
    let vlanBadge = dev.label.querySelector('.vlan-badge-tag');

    if (!vlanViewEnabled) {
      if (vlanBadge) vlanBadge.remove();
      return;
    }

    if (dev.type === 'desktop' || dev.type === 'laptop' || dev.type === 'server' || dev.type === 'printer') {
      const vInfo = getDeviceVlan(dev.id);
      if (vInfo) {
        const sw = devices.get(vInfo.switchId);
        const vDef = sw && sw.vlans ? sw.vlans.find(x => x.id === vInfo.vlanId) : null;
        const color = vDef ? vDef.color : '#38BDF8';
        const name = vDef ? vDef.name : `VLAN ${vInfo.vlanId}`;

        if (!vlanBadge) {
          vlanBadge = document.createElement('span');
          vlanBadge.className = 'vlan-badge-tag';
          dev.label.appendChild(vlanBadge);
        }
        vlanBadge.style.cssText = `
          display:inline-block; font-size:9.5px; font-weight:700; padding:1px 5px;
          border-radius:4px; margin-left:4px; background:${color}22;
          color:${color}; border:1px solid ${color}66;
        `;
        vlanBadge.textContent = `VLAN ${vInfo.vlanId}`;
      } else if (vlanBadge) {
        vlanBadge.remove();
      }
    }
  });
}

/* ─── VLAN Manager Modal UI ─── */
const vlanModal = document.getElementById('vlanModal');
const vlanSwitchSelect = document.getElementById('vlanSwitchSelect');
const vlanTableBody = document.getElementById('vlanTableBody');
const vlanPortMatrix = document.getElementById('vlanPortMatrix');
const vlanCloseBtn = document.getElementById('vlanCloseBtn');

function openVlanModal(targetSwitchId) {
  const switches = [...devices.values()].filter(d => d.type === 'switch');
  if (switches.length === 0) {
    toast("⚠️ Sahnada kamida bitta Switch (Kommutator) bo'lishi kerak!");
    return;
  }

  // Switch tanlash dropdown
  if (vlanSwitchSelect) {
    vlanSwitchSelect.innerHTML = '';
    switches.forEach(sw => {
      initSwitchVlans(sw);
      const opt = document.createElement('option');
      opt.value = sw.id;
      opt.textContent = `${sw.name} (${sw.modelName || 'Switch'})`;
      if (targetSwitchId && sw.id === targetSwitchId) opt.selected = true;
      vlanSwitchSelect.appendChild(opt);
    });
  }

  activeVlanSwitchId = targetSwitchId || (switches[0] ? switches[0].id : null);
  renderVlanModalContent();

  if (vlanModal) vlanModal.classList.add('show');
}

function closeVlanModal() {
  if (vlanModal) vlanModal.classList.remove('show');
}

if (vlanCloseBtn) vlanCloseBtn.addEventListener('click', closeVlanModal);
if (vlanSwitchSelect) {
  vlanSwitchSelect.addEventListener('change', () => {
    activeVlanSwitchId = vlanSwitchSelect.value;
    renderVlanModalContent();
  });
}

function renderVlanModalContent() {
  const sw = devices.get(activeVlanSwitchId);
  if (!sw) return;
  initSwitchVlans(sw);

  // 1. VLAN jadvalini chiqarish
  renderVlanTable(sw);

  // 2. Port matritsasini chiqarish (24 Fa + 2 Gi)
  renderPortMatrix(sw);

  // 3. Router sub-interfeyslar bo'limi
  renderRouterRoaSSection();
}

function renderVlanTable(sw) {
  if (!vlanTableBody) return;
  vlanTableBody.innerHTML = '';

  sw.vlans.forEach(v => {
    const portCount = (sw.ports || []).filter(p => p.mode === 'access' && p.vlan === v.id).length;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><span class="vlan-color-dot" style="background:${v.color};"></span><b>${v.id}</b></td>
      <td><span style="font-weight:600; color:var(--ink);">${v.name}</span></td>
      <td><span class="badge" style="background:${v.color}20; color:${v.color}; border:1px solid ${v.color}40;">${portCount} port</span></td>
      <td>
        <button class="tq-btn" onclick="selectPaletteVlan(${v.id})" style="padding:2px 7px; font-size:11px; ${selectedPaletteVlanId === v.id ? 'border-color:var(--accent); background:rgba(255,180,84,0.15);' : ''}">
          ${selectedPaletteVlanId === v.id ? 'Tanlangan ✓' : 'Tanlash'}
        </button>
        ${v.id !== 1 ? `<button class="tq-btn" onclick="onDeleteVlan(${v.id})" style="color:#EF4444; padding:2px 6px; font-size:11px; margin-left:4px;">✕</button>` : ''}
      </td>
    `;
    vlanTableBody.appendChild(tr);
  });
}

function selectPaletteVlan(vlanId) {
  selectedPaletteVlanId = vlanId;
  const sw = devices.get(activeVlanSwitchId);
  if (sw) renderVlanTable(sw);
  toast(`Portlarga berish uchun VLAN ${vlanId} tanlandi. Endi portlar ustiga bosing.`);
}

function onDeleteVlan(vlanId) {
  const sw = devices.get(activeVlanSwitchId);
  if (!sw) return;
  if (confirm(`VLAN ${vlanId} o'chirilsinmi? Unga biriktirilgan portlar avtomatik VLAN 1 ga o'tadi.`)) {
    removeVlan(sw, vlanId);
    renderVlanModalContent();
    toast(`VLAN ${vlanId} o'chirildi`);
  }
}

function onAddNewVlan() {
  const sw = devices.get(activeVlanSwitchId);
  if (!sw) return;

  const vlanIdInput = document.getElementById('newVlanIdInput');
  const vlanNameInput = document.getElementById('newVlanNameInput');
  const vlanColorInput = document.getElementById('newVlanColorInput');

  if (!vlanIdInput || !vlanNameInput) return;
  const id = parseInt(vlanIdInput.value);
  const name = vlanNameInput.value.trim().toUpperCase() || `VLAN_${id}`;
  const color = vlanColorInput ? vlanColorInput.value : DEFAULT_VLAN_COLORS[id] || '#38BDF8';

  if (isNaN(id) || id < 1 || id > 4094) {
    toast("⚠️ VLAN ID 1 va 4094 oralig'ida bo'lishi kerak!");
    return;
  }

  addVlan(sw, id, name, color);
  selectedPaletteVlanId = id;
  vlanIdInput.value = '';
  vlanNameInput.value = '';
  renderVlanModalContent();
  toast(`VLAN ${id} (${name}) yaratildi!`);
}

function renderPortMatrix(sw) {
  if (!vlanPortMatrix) return;
  vlanPortMatrix.innerHTML = '';

  if (!sw.ports) return;

  sw.ports.forEach(port => {
    const portBtn = document.createElement('div');
    portBtn.className = 'vlan-port-card';

    const isTrunk = port.mode === 'trunk';
    const vDef = sw.vlans ? sw.vlans.find(v => v.id === port.vlan) : null;
    const color = isTrunk ? '#A78BFA' : (vDef ? vDef.color : '#6FE3C4');
    const isOccupied = !!port.connectedTo;

    portBtn.style.borderColor = `${color}66`;
    portBtn.innerHTML = `
      <div class="vlan-port-header">
        <span class="vlan-port-id">${port.id.replace('FastEthernet', 'Fa').replace('GigabitEthernet', 'Gi')}</span>
        <span class="vlan-port-led" style="background:${isOccupied ? '#00FF87' : '#4B5563'};"></span>
      </div>
      <div class="vlan-port-body">
        <span class="vlan-port-mode-badge ${isTrunk ? 'trunk' : 'access'}" style="background:${color}22; color:${color}; border-color:${color}44;">
          ${isTrunk ? 'TRUNK' : `VLAN ${port.vlan}`}
        </span>
      </div>
    `;

    // Port bosilganda VLAN biriktirish yoki Trunk ga almashtirish
    portBtn.addEventListener('click', (e) => {
      // Shift yoki o'ng tugma bo'lsa Trunk rejimiga o'tadi, aks holda tanlangan VLAN
      if (e.shiftKey) {
        const newMode = (port.mode === 'trunk') ? 'access' : 'trunk';
        setPortMode(sw, port.id, newMode);
        toast(`${port.id} rejimi: ${newMode.toUpperCase()}`);
      } else {
        if (port.mode === 'trunk') {
          // Trunk dan Access ga qaytarish
          setPortMode(sw, port.id, 'access');
          setPortVlan(sw, port.id, selectedPaletteVlanId);
        } else {
          setPortVlan(sw, port.id, selectedPaletteVlanId);
        }
        toast(`${port.id} ➔ VLAN ${selectedPaletteVlanId}`);
      }
      renderPortMatrix(sw);
      renderVlanTable(sw);
    });

    portBtn.title = `${port.id}: ${port.mode.toUpperCase()} (VLAN ${port.vlan})\nBosing: VLAN ${selectedPaletteVlanId} ni berish\nShift+Klik: Access/Trunk almashtirish`;
    vlanPortMatrix.appendChild(portBtn);
  });
}

/* ─── Tezkor Presets (Shablonlar) ─── */
function applyVlanPreset(type) {
  const sw = devices.get(activeVlanSwitchId);
  if (!sw || !sw.ports) return;

  if (type === 'half') {
    // 1-12: VLAN 10 (Talabalar), 13-24: VLAN 20 (O'qituvchilar), Gi: Trunk
    addVlan(sw, 10, 'TALABALAR', DEFAULT_VLAN_COLORS[10]);
    addVlan(sw, 20, 'OQITUVCHILAR', DEFAULT_VLAN_COLORS[20]);
    sw.ports.forEach((p, idx) => {
      if (p.id.startsWith('Gi')) {
        p.mode = 'trunk';
      } else {
        p.mode = 'access';
        p.vlan = (idx < 12) ? 10 : 20;
      }
    });
    toast("Preset qo'llandi: Fa0/1-12 ➔ VLAN 10, Fa0/13-24 ➔ VLAN 20, Gi0/1-2 ➔ Trunk");
  } else if (type === 'three') {
    // 1-8: VLAN 10, 9-16: VLAN 20, 17-22: VLAN 30, 23-24/Gi: Trunk
    addVlan(sw, 10, 'TALABALAR', DEFAULT_VLAN_COLORS[10]);
    addVlan(sw, 20, 'OQITUVCHILAR', DEFAULT_VLAN_COLORS[20]);
    addVlan(sw, 30, 'ADMIN', DEFAULT_VLAN_COLORS[30]);
    sw.ports.forEach((p, idx) => {
      if (p.id.startsWith('Gi') || p.id === 'Fa0/23' || p.id === 'Fa0/24') {
        p.mode = 'trunk';
      } else if (idx < 8) {
        p.mode = 'access'; p.vlan = 10;
      } else if (idx < 16) {
        p.mode = 'access'; p.vlan = 20;
      } else {
        p.mode = 'access'; p.vlan = 30;
      }
    });
    toast("Preset qo'llandi: 3 ta VLAN (10, 20, 30) va Trunk portlar");
  } else if (type === 'reset') {
    // Barchasini VLAN 1 (Default) ga qaytarish
    sw.ports.forEach(p => {
      p.mode = p.id.startsWith('Gi') ? 'trunk' : 'access';
      p.vlan = 1;
    });
    toast("Barcha portlar standart VLAN 1 holatiga qaytarildi");
  }

  syncSwitchVlanCiscoState(sw);
  applyVlanVisuals();
  renderVlanModalContent();
}

/* ─── Router-on-a-Stick (RoaS) Bo'limi ─── */
function renderRouterRoaSSection() {
  const roasContainer = document.getElementById('vlanRoasSubinterfaces');
  if (!roasContainer) return;
  roasContainer.innerHTML = '';

  const routers = [...devices.values()].filter(d => d.type === 'router');
  if (routers.length === 0) {
    roasContainer.innerHTML = `<div class="empty" style="padding:8px; font-size:11px; color:var(--ink-dim);">Sahnada Router mavjud emas. Inter-VLAN routing uchun Router qo'shing.</div>`;
    return;
  }

  routers.forEach(r => {
    initRouterSubinterfaces(r);
    const subKeys = Object.keys(r.subinterfaces);
    const card = document.createElement('div');
    card.style.cssText = "background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); border-radius:8px; padding:10px; margin-bottom:8px;";

    let subListHtml = subKeys.length === 0
      ? `<div style="font-size:11px; color:var(--ink-dim); padding:4px 0;">Sub-interfeyslar mavjud emas. Quyidagi formadan yarating.</div>`
      : subKeys.map(k => {
          const sub = r.subinterfaces[k];
          return `
            <div style="display:flex; justify-content:space-between; align-items:center; font-size:11px; padding:4px 6px; background:rgba(0,0,0,0.2); border-radius:4px; margin-top:4px;">
              <span><b>${sub.subKey}</b> ➔ VLAN ${sub.vlan} (IP: <code style="color:#6FE3C4;">${sub.ip}</code>/${sub.mask})</span>
              <button class="tq-btn" onclick="onDeleteRouterSub('${r.id}', '${k}')" style="color:#EF4444; padding:1px 5px; font-size:10px;">✕</button>
            </div>
          `;
        }).join('');

    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
        <span style="font-weight:700; color:var(--accent);">🌐 ${r.name} (Router-on-a-Stick)</span>
        <span style="font-size:10px; color:var(--ink-dim);">${subKeys.length} sub-int</span>
      </div>
      <div>${subListHtml}</div>
      <div style="display:grid; grid-template-columns:1fr 1fr 1.5fr auto; gap:6px; margin-top:8px;">
        <input type="text" id="roasSubId_${r.id}" placeholder="Sub ID (10)" style="font-size:11px; padding:3px 6px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:4px; color:var(--ink);">
        <input type="number" id="roasVlanId_${r.id}" placeholder="VLAN (10)" style="font-size:11px; padding:3px 6px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:4px; color:var(--ink);">
        <input type="text" id="roasIp_${r.id}" placeholder="IP (192.168.10.1)" style="font-size:11px; padding:3px 6px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:4px; color:var(--ink);">
        <button class="tq-btn" onclick="onAddRouterSub('${r.id}')" style="padding:3px 8px; font-size:11px; background:rgba(56,189,248,0.2); border-color:#38BDF8; color:#38BDF8;">+ Qo'shish</button>
      </div>
    `;
    roasContainer.appendChild(card);
  });
}

function onAddRouterSub(routerId) {
  const r = devices.get(routerId);
  if (!r) return;

  const subIdInput = document.getElementById(`roasSubId_${routerId}`);
  const vlanInput = document.getElementById(`roasVlanId_${routerId}`);
  const ipInput = document.getElementById(`roasIp_${routerId}`);

  const subId = subIdInput ? subIdInput.value.trim() : '';
  const vlan = vlanInput ? parseInt(vlanInput.value) : 0;
  const ip = ipInput ? ipInput.value.trim() : '';

  if (!subId || isNaN(vlan) || vlan < 1 || !ip) {
    toast("⚠️ Barcha maydonlarni to'g'ri to'ldiring: Sub ID, VLAN, IP");
    return;
  }

  addRouterSubinterface(r, 'GigabitEthernet0/0', subId, vlan, ip, '255.255.255.0');
  renderRouterRoaSSection();
  toast(`Sub-interfeys Gi0/0.${subId} (VLAN ${vlan}) yaratildi!`);
}

function onDeleteRouterSub(routerId, subKey) {
  const r = devices.get(routerId);
  if (!r) return;
  removeRouterSubinterface(r, subKey);
  renderRouterRoaSSection();
  toast(`Sub-interfeys ${subKey} o'chirildi`);
}

// Global scope ga eksport qilish
window.initSwitchVlans = initSwitchVlans;
window.initRouterSubinterfaces = initRouterSubinterfaces;
window.addVlan = addVlan;
window.removeVlan = removeVlan;
window.setPortVlan = setPortVlan;
window.setPortMode = setPortMode;
window.setPortTrunkAllowed = setPortTrunkAllowed;
window.addRouterSubinterface = addRouterSubinterface;
window.removeRouterSubinterface = removeRouterSubinterface;
window.getDeviceVlan = getDeviceVlan;
window.toggleVlanView = toggleVlanView;
window.applyVlanVisuals = applyVlanVisuals;
window.openVlanModal = openVlanModal;
window.closeVlanModal = closeVlanModal;
window.selectPaletteVlan = selectPaletteVlan;
window.onDeleteVlan = onDeleteVlan;
window.onAddNewVlan = onAddNewVlan;
window.applyVlanPreset = applyVlanPreset;
window.onAddRouterSub = onAddRouterSub;
window.onDeleteRouterSub = onDeleteRouterSub;
