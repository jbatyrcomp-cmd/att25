/* ==========================================================================
   PROJECT SAVE / LOAD — localStorage + .lan3d fayl import/eksport
   ========================================================================== */

const SAVE_VERSION   = 1;
const SAVE_PREFIX    = 'lan3d_slot_';
const AUTOSAVE_KEY   = 'lan3d_autosave';
const MAX_SLOTS      = 5;
let   autosaveTimer  = null;

/* ---------- Serialization ---------- */
function serializeProject(projectName) {
  return {
    version:    SAVE_VERSION,
    name:       projectName || 'Loyiha',
    savedAt:    Date.now(),
    idCounter,
    connCounter,
    lanCounter,
    devices: [...devices.values()].map(d => ({
      id:      d.id,
      type:    d.type,
      name:    d.name,
      modelKey: d.modelKey || null,
      ip:      d.ip,
      mask:    d.mask,
      gw:      d.gw,
      dns:     d.dns || '8.8.8.8',
      mac:     d.mac,
      ipMode:  d.ipMode,
      x:       +d.group.position.x.toFixed(4),
      z:       +d.group.position.z.toFixed(4),
      inbox:   d.inbox || [],
      vlans:   d.vlans || null,
      subinterfaces: d.subinterfaces || null,
      portsVlan: d.ports ? d.ports.map(p => ({ id: p.id, vlan: p.vlan, mode: p.mode, nativeVlan: p.nativeVlan, allowedVlans: p.allowedVlans })) : null,
      wifi: d.wifi ? {
        isAp:        d.wifi.isAp,
        enabled:     d.wifi.enabled,
        ssid:        d.wifi.ssid,
        security:    d.wifi.security,
        password:    d.wifi.password,
        band:        d.wifi.band,
        txPower:     d.wifi.txPower,
        radius:      d.wifi.radius,
        hidden:      d.wifi.hidden,
        hasAdapter:  d.wifi.hasAdapter,
        hotspotMode: d.wifi.hotspotMode,
        connectedApId:   d.wifi.connectedApId,
        connectedSsid:   d.wifi.connectedSsid
      } : null
    })),
    connections: [...connections.values()].map(c => ({
      a:         c.a,
      b:         c.b,
      portA:     c.portA,
      portB:     c.portB,
      cableType: c.cableType
    })),
    rooms: (typeof rooms !== 'undefined' && rooms.size > 0) ? [...rooms.values()].map(r => ({
      name:    r.name,
      x:       r.x,
      z:       r.z,
      width:   r.width,
      depth:   r.depth,
      color:   r.color,
      vlanId:  r.vlanId
    })) : []
  };
}

/* ---------- Deserialization ---------- */
function deserializeProject(data) {
  if (!data || data.version !== SAVE_VERSION) {
    toast('⚠️ Noto\'g\'ri fayl formati!');
    return false;
  }

  // Sahna tozalash
  [...devices.keys()].forEach(id => removeDevice(id));
  if (typeof clearAllRooms === 'function') clearAllRooms();

  // Xonalarni tiklash
  if (Array.isArray(data.rooms) && typeof addCustomRoom === 'function') {
    data.rooms.forEach(rData => {
      addCustomRoom({
        name:   rData.name,
        x:      rData.x,
        z:      rData.z,
        width:  rData.width,
        depth:  rData.depth,
        color:  rData.color,
        vlanId: rData.vlanId
      });
    });
  }

  // Hisoblagichlarni tiklash
  if (data.idCounter)   idCounter   = data.idCounter;
  if (data.lanCounter)  lanCounter  = data.lanCounter;
  if (data.connCounter) connCounter = data.connCounter;

  // Qurilmalarni tiklash
  const tempIdMap = new Map(); // saved_id -> new rec
  data.devices.forEach(dData => {
    const rec = addDevice(dData.type, dData.modelKey);
    if (!rec) return;

    // ID ni saved id ga override qilish
    const generatedId = rec.id;
    rec.id = dData.id;
    devices.delete(generatedId);
    devices.set(rec.id, rec);
    rec.group.traverse(o => { if (o.isMesh) o.userData.deviceId = rec.id; });
    if (rec.hitBox) rec.hitBox.userData.deviceId = rec.id;

    // Xususiyatlarni tiklash
    rec.name    = dData.name;
    rec.ip      = dData.ip;
    rec.mask    = dData.mask    || '255.255.255.0';
    rec.gw      = dData.gw     || '192.168.1.1';
    rec.dns     = dData.dns    || '8.8.8.8';
    rec.mac     = dData.mac;
    rec.ipMode  = dData.ipMode || 'static';
    rec.inbox   = dData.inbox  || [];
    rec.group.position.set(dData.x, 0, dData.z);

    // Wi-Fi holatini tiklash
    if (dData.wifi && rec.wifi) {
      Object.assign(rec.wifi, dData.wifi);
    }

    // VLAN va subinterfeyslarni tiklash
    if (dData.vlans) rec.vlans = dData.vlans;
    if (dData.subinterfaces) rec.subinterfaces = dData.subinterfaces;
    if (dData.portsVlan && rec.ports) {
      dData.portsVlan.forEach(pv => {
        const port = rec.ports.find(p => p.id === pv.id);
        if (port) {
          if (typeof pv.vlan !== 'undefined') port.vlan = pv.vlan;
          if (typeof pv.mode !== 'undefined') port.mode = pv.mode;
          if (typeof pv.nativeVlan !== 'undefined') port.nativeVlan = pv.nativeVlan;
          if (typeof pv.allowedVlans !== 'undefined') port.allowedVlans = pv.allowedVlans;
        }
      });
    }

    // Label yangilash
    if (rec.label) {
      rec.label.querySelector('.nm').textContent = rec.name;
      rec.label.querySelector('.ip').textContent  = rec.ip;
    }

    tempIdMap.set(dData.id, rec);
  });

  // Ulanishlarni tiklash
  if (data.connections) {
    data.connections.forEach(cData => {
      if (devices.has(cData.a) && devices.has(cData.b)) {
        addConnection(cData.a, cData.b, {
          portA:     cData.portA,
          portB:     cData.portB,
          cableType: cData.cableType || 'auto'
        });
      }
    });
  }

  // Wi-Fi ulangan mijozlarni tiklash
  devices.forEach(d => {
    if (d.wifi && d.wifi.connectedApId) {
      const ap = devices.get(d.wifi.connectedApId);
      if (ap && ap.wifi && ap.wifi.connectedClients) {
        if (!ap.wifi.connectedClients.some(cl => cl.devId === d.id)) {
          ap.wifi.connectedClients.push({ devId: d.id, name: d.name, ip: d.ip, mac: d.mac, rssi: -55 });
        }
      }
    }
  });

  return true;
}

/* ---------- localStorage CRUD ---------- */
function getSavedSlots() {
  const slots = [];
  for (let i = 1; i <= MAX_SLOTS; i++) {
    const raw = localStorage.getItem(SAVE_PREFIX + i);
    if (raw) {
      try {
        const data = JSON.parse(raw);
        slots.push({ slot: i, name: data.name, savedAt: data.savedAt, deviceCount: (data.devices || []).length });
      } catch(e) {
        slots.push({ slot: i, name: 'Buzilgan fayl', savedAt: 0, deviceCount: 0 });
      }
    } else {
      slots.push({ slot: i, name: null, savedAt: null, deviceCount: 0 });
    }
  }
  return slots;
}

function saveToSlot(slot, name) {
  try {
    const data = serializeProject(name);
    localStorage.setItem(SAVE_PREFIX + slot, JSON.stringify(data));
    localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(data));
    toast(`💾 Loyiha saqlandi: "${name}" (Slot ${slot})`);
    renderStorageModal();
  } catch(e) {
    toast('⚠️ Saqlashda xatolik: ' + e.message);
  }
}

function loadFromSlot(slot) {
  const raw = localStorage.getItem(SAVE_PREFIX + slot);
  if (!raw) { toast('⚠️ Bu slotda loyiha yo\'q!'); return; }
  try {
    const data = JSON.parse(raw);
    if (confirm(`"${data.name}" loyihasini yuklashni tasdiqlaysizmi?\nHozirgi tarmoq o'chib ketadi!`)) {
      const ok = deserializeProject(data);
      if (ok) toast(`📂 Loyiha yuklandi: "${data.name}"`);
      closeStorageModal();
    }
  } catch(e) {
    toast('⚠️ Yuklashda xatolik: ' + e.message);
  }
}

function deleteSlot(slot) {
  if (confirm(`Slot ${slot} dagi loyihani o'chirasizmi?`)) {
    localStorage.removeItem(SAVE_PREFIX + slot);
    renderStorageModal();
    toast(`🗑️ Slot ${slot} tozalandi`);
  }
}

/* ---------- Autosave ---------- */
function scheduleAutosave() {
  clearTimeout(autosaveTimer);
  autosaveTimer = setTimeout(() => {
    try {
      localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(serializeProject('Autosave')));
    } catch(e) {}
  }, 3000);
}

function loadAutosave() {
  const raw = localStorage.getItem(AUTOSAVE_KEY);
  if (!raw) return false;
  try {
    const data = JSON.parse(raw);
    if (data && data.devices && data.devices.length > 0) {
      const ago = Math.round((Date.now() - data.savedAt) / 60000);
      if (confirm(`Oxirgi sessiyadan autosave topildi (${ago} daqiqa oldin, ${data.devices.length} qurilma).\nYuklashni xohlaysizmi?`)) {
        deserializeProject(data);
        toast('🔄 Autosave tiklandi');
        return true;
      }
    }
  } catch(e) {}
  return false;
}

/* ---------- Fayl Eksport / Import ---------- */
function exportProjectFile() {
  const name = prompt('Loyiha nomini kiriting:', 'Mening Tarmoqim') || 'loyiha';
  const data = serializeProject(name);
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = name.replace(/\s+/g, '_') + '.lan3d';
  a.click();
  URL.revokeObjectURL(url);
  toast(`📤 Loyiha fayli yuklab olindi: ${a.download}`);
}

function importProjectFile(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      if (confirm(`"${data.name || 'Nomsiz'}" loyihasini yuklashni tasdiqlaysizmi?\nHozirgi tarmoq o'chib ketadi!`)) {
        const ok = deserializeProject(data);
        if (ok) {
          toast(`📥 Loyiha fayli yuklandi: ${file.name}`);
          closeStorageModal();
        }
      }
    } catch(err) {
      toast('⚠️ Noto\'g\'ri .lan3d fayl formati!');
    }
  };
  reader.readAsText(file);
}

/* ---------- Modal UI ---------- */
function openStorageModal() {
  renderStorageModal();
  const modal = document.getElementById('storageModal');
  if (modal) modal.classList.add('show');
}

function closeStorageModal() {
  const modal = document.getElementById('storageModal');
  if (modal) modal.classList.remove('show');
}

function renderStorageModal() {
  const container = document.getElementById('storageSlotsContainer');
  if (!container) return;
  const slots = getSavedSlots();

  container.innerHTML = slots.map(s => {
    const dateStr = s.savedAt ? new Date(s.savedAt).toLocaleString('uz-UZ') : '—';
    const isEmpty = !s.name;
    return `
      <div class="storage-slot ${isEmpty ? 'empty' : ''}">
        <div class="storage-slot-info">
          <div class="storage-slot-num">Slot ${s.slot}</div>
          ${isEmpty ? `
            <div class="storage-slot-name" style="color:var(--ink-dim); font-style:italic;">Bo'sh</div>
          ` : `
            <div class="storage-slot-name">${s.name}</div>
            <div class="storage-slot-meta">${s.deviceCount} qurilma · ${dateStr}</div>
          `}
        </div>
        <div class="storage-slot-actions">
          <button class="actbtn on" style="font-size:10px; padding:4px 10px;" onclick="saveToSlot(${s.slot}, prompt('Loyiha nomi:', '${s.name || 'Loyiha ' + s.slot}') || 'Loyiha ${s.slot}')">
            💾 Saqlash
          </button>
          ${!isEmpty ? `
            <button class="actbtn" style="font-size:10px; padding:4px 10px;" onclick="loadFromSlot(${s.slot})">
              📂 Yuklash
            </button>
            <button class="actbtn warn" style="font-size:10px; padding:3px 8px;" onclick="deleteSlot(${s.slot})" title="O'chirish">🗑</button>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');
}

/* ---------- Avtomatik autosave hook ---------- */
// Bu funksiya app.js dan chaqiriladi
function triggerAutosave() { scheduleAutosave(); }
