/* ==========================================================================
   UNDO / REDO HISTORY SYSTEM — Ctrl+Z / Ctrl+Y
   ========================================================================== */

const historyStack = [];
let historyIndex = -1;
const MAX_HISTORY = 30;

/**
 * Yangi amal tarixga qo'shiladi.
 * action = { description: string, undo: fn, redo: fn }
 */
function pushHistory(action) {
  // Redo branch ni tozalash
  if (historyIndex < historyStack.length - 1) {
    historyStack.splice(historyIndex + 1);
  }
  historyStack.push(action);
  if (historyStack.length > MAX_HISTORY) {
    historyStack.shift();
    historyIndex = Math.max(-1, historyIndex - 1);
  }
  historyIndex = historyStack.length - 1;
  updateHistoryUI();
}

function undo() {
  if (historyIndex < 0) {
    toast('↩ Bekor qilish uchun amal mavjud emas');
    return;
  }
  const action = historyStack[historyIndex];
  try {
    action.undo();
  } catch(e) {
    console.warn('Undo xatosi:', e);
  }
  historyIndex--;
  updateHistoryUI();
  toast(`↩ Bekor qilindi: ${action.description}`);
}

function redo() {
  if (historyIndex >= historyStack.length - 1) {
    toast('↪ Takrorlash uchun amal mavjud emas');
    return;
  }
  historyIndex++;
  const action = historyStack[historyIndex];
  try {
    action.redo();
  } catch(e) {
    console.warn('Redo xatosi:', e);
    historyIndex--;
  }
  updateHistoryUI();
  toast(`↪ Takrorlandi: ${action.description}`);
}

function updateHistoryUI() {
  const undoBtn = document.getElementById('historyUndoBtn');
  const redoBtn = document.getElementById('historyRedoBtn');
  if (undoBtn) {
    undoBtn.disabled = historyIndex < 0;
    undoBtn.style.opacity = historyIndex < 0 ? '0.35' : '1';
    undoBtn.title = historyIndex >= 0
      ? `Bekor qilish: ${historyStack[historyIndex].description}`
      : 'Bekor qilish uchun amal yo\'q (Ctrl+Z)';
  }
  if (redoBtn) {
    const canRedo = historyIndex < historyStack.length - 1;
    redoBtn.disabled = !canRedo;
    redoBtn.style.opacity = !canRedo ? '0.35' : '1';
    redoBtn.title = canRedo
      ? `Takrorlash: ${historyStack[historyIndex + 1].description}`
      : 'Takrorlash uchun amal yo\'q (Ctrl+Y)';
  }
}

/** Tarix orqali device qo'shish (undo/redo bilan) */
function addDeviceWithHistory(type, modelKey) {
  const rec = addDevice(type, modelKey);
  if (!rec) return null;
  const savedId = rec.id;
  const savedPos = { x: rec.group.position.x, z: rec.group.position.z };

  pushHistory({
    description: `${rec.name} qo'shildi`,
    undo: () => { if (devices.has(savedId)) removeDevice(savedId); },
    redo: () => {
      const r = addDevice(type, modelKey);
      if (r) {
        r.group.position.set(savedPos.x, 0, savedPos.z);
      }
    }
  });
  return rec;
}

/** Tarix orqali device o'chirish */
function removeDeviceWithHistory(id) {
  const rec = devices.get(id);
  if (!rec) return;

  // Holatni saqlash (serialization)
  const snap = {
    type: rec.type, modelKey: rec.modelKey, name: rec.name,
    ip: rec.ip, mask: rec.mask, gw: rec.gw, dns: rec.dns,
    mac: rec.mac, ipMode: rec.ipMode,
    x: rec.group.position.x, z: rec.group.position.z
  };
  // Ulanishlarni ham saqlash
  const connSnaps = [...connections.values()]
    .filter(c => c.a === id || c.b === id)
    .map(c => ({ a: c.a, b: c.b, portA: c.portA, portB: c.portB, cableType: c.cableType }));

  removeDevice(id);

  pushHistory({
    description: `${snap.name} o'chirildi`,
    undo: () => {
      const r = addDevice(snap.type, snap.modelKey);
      if (!r) return;
      r.name = snap.name;
      r.ip = snap.ip; r.mask = snap.mask; r.gw = snap.gw;
      r.dns = snap.dns; r.mac = snap.mac; r.ipMode = snap.ipMode;
      r.group.position.set(snap.x, 0, snap.z);
      if (r.label) {
        r.label.querySelector('.nm').textContent = r.name;
        r.label.querySelector('.ip').textContent = r.ip;
      }
    },
    redo: () => { if (devices.has(id)) removeDevice(id); }
  });
}

/** Tarix orqali ulanish qo'shish */
function addConnectionWithHistory(aId, bId, opts) {
  const before = [...connections.keys()];
  addConnection(aId, bId, opts);
  const after = [...connections.keys()];
  const newId = after.find(k => !before.includes(k));
  if (!newId) return;

  const ra = devices.get(aId), rb = devices.get(bId);
  pushHistory({
    description: `${ra ? ra.name : aId} ↔ ${rb ? rb.name : bId} ulandi`,
    undo: () => { if (connections.has(newId)) removeConnection(newId); },
    redo: () => addConnection(aId, bId, opts)
  });
}

/** Tarix orqali ulanish o'chirish */
function removeConnectionWithHistory(cid) {
  const c = connections.get(cid);
  if (!c) return;
  const snap = { a: c.a, b: c.b, portA: c.portA, portB: c.portB, cableType: c.cableType };
  const ra = devices.get(c.a), rb = devices.get(c.b);
  removeConnection(cid);
  pushHistory({
    description: `${ra ? ra.name : c.a} ↔ ${rb ? rb.name : c.b} uzildi`,
    undo: () => addConnection(snap.a, snap.b, { portA: snap.portA, portB: snap.portB, cableType: snap.cableType }),
    redo: () => {
      const existing = getConnectionBetween(snap.a, snap.b);
      if (existing) removeConnection(existing.id);
    }
  });
}

// Klaviatura qisqichlari (INPUT ichida bo'lmasa ishlaydi)
document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;
  if (e.ctrlKey && !e.shiftKey && e.code === 'KeyZ') { e.preventDefault(); undo(); }
  if ((e.ctrlKey && e.code === 'KeyY') || (e.ctrlKey && e.shiftKey && e.code === 'KeyZ')) {
    e.preventDefault(); redo();
  }
});
