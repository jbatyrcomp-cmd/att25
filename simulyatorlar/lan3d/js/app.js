/* ==========================================================================
   APP INITIALIZATION, DUAL CONTROLS (ORBIT & FPS WALKTHROUGH),
   POINTER LOCK, KEYBOARD WASD, MULTIPLAYER HOOKS & ANIMATION LOOP
   ========================================================================== */

/* Build Device Tray in Toolbar */
const tray = document.getElementById('devtray');
if(tray){
  ORDER.forEach(t=>{
    const b = document.createElement('button');
    b.className = 'devbtn';
    b.title = `${TYPES[t].label} modelini tanlash (Shift + Bosish: tezkor qo'shish)`;
    b.innerHTML = ICONS[t] + `<span>${TYPES[t].label}</span>`;
    b.addEventListener('click', (e)=>{
      if(e.shiftKey){
        const rec = addDevice(t);
        if(rec && typeof Multiplayer !== 'undefined' && Multiplayer.active){
          Multiplayer.broadcast({
            type: 'topo_add_device',
            deviceData: { id: rec.id, type: rec.type, name: rec.name, x: rec.group.position.x, z: rec.group.position.z, ip: rec.ip }
          });
        }
      } else {
        openModelPickerForType(t);
      }
    });
    tray.appendChild(b);
  });
}

/* ==========================================================================
   DEVICE PROPERTIES PANEL LOGIC
   ========================================================================== */
const panel = document.getElementById('panel');
const pName = document.getElementById('pName');
const pType = document.getElementById('pType');
const pNameInput = document.getElementById('pNameInput');
const pMAC = document.getElementById('pMAC');
const pCount = document.getElementById('pCount');
const connlist = document.getElementById('connlist');
const pIpInput = document.getElementById('pIpInput');
const pMaskInput = document.getElementById('pMaskInput');
const pGwInput = document.getElementById('pGwInput');
const pDnsInput = document.getElementById('pDnsInput');
const ipModeStatic = document.getElementById('ipModeStatic');
const ipModeDhcp = document.getElementById('ipModeDhcp');
const inboxList = document.getElementById('inboxList');

function selectDevice(id){
  selectedDeviceId = id;
  selRing.visible = true;
  openPanel();
  refreshPanel();
}

function closePanel(){
  if(panel) panel.classList.remove('show');
  selRing.visible = false;
  selectedDeviceId = null;
}

function openPanel(){
  if(panel) panel.classList.add('show');
}

const pCloseBtn = document.getElementById('pClose');
if(pCloseBtn) pCloseBtn.addEventListener('click', closePanel);

if(pNameInput){
  pNameInput.addEventListener('input', ()=>{
    const rec = devices.get(selectedDeviceId);
    if(!rec) return;
    rec.name = pNameInput.value || rec.name;
    if(pName) pName.textContent = rec.name;
    if(rec.label) rec.label.querySelector('.nm').textContent = rec.name;
    refreshConnList();
  });
}

const delDeviceBtn = document.getElementById('delDeviceBtn');
if(delDeviceBtn){
  delDeviceBtn.addEventListener('click', ()=>{
    if(!selectedDeviceId) return;
    const rec = devices.get(selectedDeviceId);
    if(confirm("O'chirilsinmi: " + rec.name + "?")){
      const devId = selectedDeviceId;
      removeDevice(devId);
      if(typeof Multiplayer !== 'undefined' && Multiplayer.active){
        Multiplayer.broadcast({ type: 'topo_remove_device', deviceId: devId });
      }
    }
  });
}

function refreshPanel(){
  const rec = devices.get(selectedDeviceId);
  if(!rec) return;
  if(pName) pName.textContent = rec.name;
  if(pType) pType.textContent = TYPES[rec.type].label + (rec.type === "modem" ? " · Tashqi IP" : rec.type === "switch" ? " · Kommutator (L2/L3)" : "");
  if(pNameInput) pNameInput.value = rec.name;
  if(pMAC) pMAC.textContent = rec.mac;
  if(pIpInput) pIpInput.value = rec.ip || '';
  if(pMaskInput) pMaskInput.value = rec.mask || '255.255.255.0';
  if(pGwInput) pGwInput.value = rec.gw || '192.168.1.1';
  if(pDnsInput) pDnsInput.value = rec.dns || '8.8.8.8';

  if(ipModeStatic && ipModeDhcp){
    if(rec.ipMode === 'dhcp'){
      ipModeDhcp.classList.add('active');
      ipModeStatic.classList.remove('active');
      if(pIpInput) pIpInput.disabled = true;
      if(pMaskInput) pMaskInput.disabled = true;
      if(pGwInput) pGwInput.disabled = true;
    } else {
      ipModeStatic.classList.add('active');
      ipModeDhcp.classList.remove('active');
      if(pIpInput) pIpInput.disabled = false;
      if(pMaskInput) pMaskInput.disabled = false;
      if(pGwInput) pGwInput.disabled = false;
    }
  }

  // Update 3D Model Switcher in panel
  const pModelSelect = document.getElementById('pModelSelect');
  const pModelContainer = document.getElementById('pModelSelectContainer');
  if(pModelSelect && pModelContainer){
    if(typeof MODELS_DB !== 'undefined' && MODELS_DB[rec.type]){
      pModelContainer.style.display = 'block';
      pModelSelect.innerHTML = '';
      const cat = MODELS_DB[rec.type];
      Object.keys(cat).forEach(k => {
        const opt = document.createElement('option');
        opt.value = k;
        opt.textContent = cat[k].name;
        if(rec.modelKey === k) opt.selected = true;
        pModelSelect.appendChild(opt);
      });
      pModelSelect.onchange = function(){
        changeDeviceModel(rec.id, this.value);
      };
    } else {
      pModelContainer.style.display = 'none';
    }
  }

  // Refresh inbox
  if(inboxList){
    if(!rec.inbox || rec.inbox.length === 0){
      inboxList.innerHTML = `<div class="empty" style="font-size:10px; color:var(--ink-dim); padding:4px;">Kelgan xabarlar mavjud emas</div>`;
    } else {
      inboxList.innerHTML = rec.inbox.map(m => `
        <div class="inbox-item">
          <div><b>${m.from}:</b> <span>${m.text}</span></div>
          <div class="time">${m.time}</div>
        </div>
      `).join('');
    }
  }

  // Update Wi-Fi card in panel
  const pWifiStatusCard = document.getElementById('pWifiStatusCard');
  const pWifiBadge = document.getElementById('pWifiBadge');
  const pWifiMode = document.getElementById('pWifiMode');
  const pWifiSsid = document.getElementById('pWifiSsid');
  const pWifiSignalRow = document.getElementById('pWifiSignalRow');
  const pWifiSignal = document.getElementById('pWifiSignal');
  const pWifiAdapterToggleSection = document.getElementById('pWifiAdapterToggleSection');

  if(pWifiStatusCard){
    if(rec.wifi && (rec.wifi.isAp || rec.wifi.hotspotMode)){
      pWifiStatusCard.style.display = 'flex';
      if(pWifiBadge){
        pWifiBadge.textContent = rec.wifi.enabled ? 'AP Faol' : 'O‘chirilgan';
        pWifiBadge.style.background = rec.wifi.enabled ? 'rgba(56,189,248,0.15)' : 'rgba(239,68,68,0.15)';
        pWifiBadge.style.color = rec.wifi.enabled ? '#38BDF8' : '#EF4444';
      }
      if(pWifiMode) pWifiMode.textContent = rec.wifi.hotspotMode ? 'Hotspot / Direct' : 'AP (Router)';
      if(pWifiSsid) pWifiSsid.textContent = rec.wifi.ssid;
      if(pWifiSignalRow) pWifiSignalRow.style.display = 'none';
    } else if(rec.wifi && rec.wifi.hasAdapter){
      pWifiStatusCard.style.display = 'flex';
      if(pWifiBadge){
        pWifiBadge.textContent = rec.wifi.connectedSsid ? 'Ulangan' : 'Ulanmagan';
        pWifiBadge.style.background = rec.wifi.connectedSsid ? 'rgba(0,255,135,0.15)' : 'rgba(255,180,84,0.15)';
        pWifiBadge.style.color = rec.wifi.connectedSsid ? '#00FF87' : '#FFB454';
      }
      if(pWifiMode) pWifiMode.textContent = 'Mijoz (Station)';
      if(pWifiSsid) pWifiSsid.textContent = rec.wifi.connectedSsid || '(Mavjud emas)';
      if(pWifiSignalRow){
        pWifiSignalRow.style.display = rec.wifi.connectedSsid ? 'flex' : 'none';
        if(pWifiSignal) pWifiSignal.textContent = rec.wifi.connectedSsid ? `📶 ${rec.wifi.signalRssi} dBm` : '—';
      }
    } else {
      pWifiStatusCard.style.display = 'none';
    }
  }

  // Update Wi-Fi adapter toggle section for desktop/server/tablet
  if(pWifiAdapterToggleSection){
    const canHaveAdapter = rec.type === 'desktop' || rec.type === 'server' || rec.type === 'tablet';
    if(canHaveAdapter && (!rec.wifi || !rec.wifi.hasAdapter)){
      pWifiAdapterToggleSection.style.display = 'block';
    } else {
      pWifiAdapterToggleSection.style.display = 'none';
    }
  }

  // Update VLAN section for switch/router in panel
  const pVlanSection = document.getElementById('pVlanSection');
  if(pVlanSection){
    pVlanSection.style.display = (rec.type === 'switch' || rec.type === 'router') ? 'block' : 'none';
  }

  refreshConnList();
}

function refreshConnList(){
  const rec = devices.get(selectedDeviceId);
  if(!rec) return;
  const list = [...connections.values()].filter(c => c.a === rec.id || c.b === rec.id);
  if(pCount) pCount.textContent = list.length;
  if(!connlist) return;
  connlist.innerHTML = "";
  if(list.length === 0){
    connlist.innerHTML = `<div class="empty">Hali ulanish yo'q</div>`;
    return;
  }
  list.forEach(c=>{
    const otherId = c.a === rec.id ? c.b : c.a;
    const other = devices.get(otherId);
    if(!other) return;
    const row = document.createElement('div');
    row.className = 'connrow';
    const colorHex = "#" + c.color.toString(16).padStart(6, '0');
    const myPort = c.a === rec.id ? c.portA : c.portB;
    const otherPort = c.a === rec.id ? c.portB : c.portA;
    const pObj = rec.ports ? rec.ports.find(p => p.id === myPort) : null;
    const vlanStr = (pObj && pObj.mode === 'trunk') ? ' [TRUNK]' : (pObj && pObj.vlan) ? ` [VLAN ${pObj.vlan}]` : '';
    const cableName = c.cableType === 'fiber' ? 'Fiber 10G' : c.cableType === 'crossover' ? 'Cross' : c.cableType === 'straight' ? 'Straight' : c.wireless ? 'Wi-Fi' : 'WAN';
    row.innerHTML = `<span class="lbl"><span class="seg" style="background:${colorHex}"></span><b>[${myPort || 'Port'}${vlanStr}]</b> ${other.name} <b>[${otherPort || 'Port'}]</b> <span style="font-size:9px; color:var(--ink-dim);">(${cableName})</span></span>`;
    const btn = document.createElement('button');
    btn.textContent = '✕';
    btn.title = "Ulanishni o'chirish";
    btn.addEventListener('click', ()=>{ removeConnection(c.id); refreshConnList(); });
    row.appendChild(btn);
    connlist.appendChild(row);
  });
}

if(pIpInput){
  pIpInput.addEventListener('change', ()=>{
    const rec = devices.get(selectedDeviceId);
    if(!rec) return;
    const val = pIpInput.value.trim();
    if(val){
      rec.ip = val;
      if(rec.label) rec.label.querySelector('.ip').textContent = val;
      if(rec.cisco && rec.cisco.interfaces){
        const firstInt = Object.keys(rec.cisco.interfaces)[0];
        if(firstInt) rec.cisco.interfaces[firstInt].ip = val;
      }
      toast(`IP manzil saqlandi: ${val}`);
    }
  });
}
if(pMaskInput){
  pMaskInput.addEventListener('change', ()=>{
    const rec = devices.get(selectedDeviceId);
    if(rec){ rec.mask = pMaskInput.value.trim() || '255.255.255.0'; toast(`Subnet mask saqlandi: ${rec.mask}`); }
  });
}
if(pGwInput){
  pGwInput.addEventListener('change', ()=>{
    const rec = devices.get(selectedDeviceId);
    if(rec){ rec.gw = pGwInput.value.trim() || '192.168.1.1'; toast(`Default gateway saqlandi: ${rec.gw}`); }
  });
}
if(pDnsInput){
  pDnsInput.addEventListener('change', ()=>{
    const rec = devices.get(selectedDeviceId);
    if(rec){ rec.dns = pDnsInput.value.trim() || '8.8.8.8'; toast(`DNS server saqlandi: ${rec.dns}`); }
  });
}
if(ipModeStatic && ipModeDhcp){
  ipModeStatic.addEventListener('click', ()=>{
    const rec = devices.get(selectedDeviceId);
    if(!rec) return;
    rec.ipMode = 'static';
    refreshPanel();
    toast("Statik IP rejimi faollashdi");
  });
  ipModeDhcp.addEventListener('click', ()=>{
    const rec = devices.get(selectedDeviceId);
    if(!rec) return;
    rec.ipMode = 'dhcp';
    rec.ip = nextIP();
    rec.mask = '255.255.255.0';
    rec.gw = '192.168.1.1';
    rec.dns = '8.8.8.8';
    if(rec.label) rec.label.querySelector('.ip').textContent = rec.ip;
    refreshPanel();
    toast(`DHCP orqali IP olindi: ${rec.ip}`);
  });
}

/* ==========================================================================
   KEYBOARD WASD & FPS WALKTHROUGH CONTROLS
   ========================================================================== */
const keys = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  sprint: false,
  jump: false
};

window.addEventListener('keydown', (e)=>{
  // Don't intercept when typing in text inputs or Cisco CLI terminal
  if(e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;

  switch(e.code){
    case 'KeyW':
    case 'ArrowUp':
      keys.forward = true; break;
    case 'KeyS':
    case 'ArrowDown':
      keys.backward = true; break;
    case 'KeyA':
    case 'ArrowLeft':
      keys.left = true; break;
    case 'KeyD':
    case 'ArrowRight':
      keys.right = true; break;
    case 'ShiftLeft':
    case 'ShiftRight':
      keys.sprint = true; break;
    case 'Space':
      keys.jump = true; break;
    case 'KeyC':
      isCrouched = !isCrouched; break;
    case 'KeyE':
      // Interaction in FPS mode
      if(isFpsMode){
        const devId = pickDevice();
        if(devId){
          selectDevice(devId);
          // If router or switch, open CLI directly
          const rec = devices.get(devId);
          if(rec && (rec.type === 'router' || rec.type === 'switch')){
            openCiscoTerminal(devId);
          }
        }
      }
      break;
    case 'KeyT':
      // Focus multiplayer chat
      if(typeof Multiplayer !== 'undefined' && Multiplayer.active){
        const chatInput = document.getElementById('collabChatInput');
        if(chatInput){
          e.preventDefault();
          chatInput.focus();
        }
      }
      break;
    case 'Escape':
      closePanel();
      if(document.pointerLockElement === canvas){
        document.exitPointerLock();
      }
      break;
  }
});

window.addEventListener('keyup', (e)=>{
  switch(e.code){
    case 'KeyW':
    case 'ArrowUp':
      keys.forward = false; break;
    case 'KeyS':
    case 'ArrowDown':
      keys.backward = false; break;
    case 'KeyA':
    case 'ArrowLeft':
      keys.left = false; break;
    case 'KeyD':
    case 'ArrowRight':
      keys.right = false; break;
    case 'ShiftLeft':
    case 'ShiftRight':
      keys.sprint = false; break;
    case 'Space':
      keys.jump = false; break;
  }
});

/* Pointer Lock event listeners */
canvas.addEventListener('click', ()=>{
  if(isFpsMode && document.pointerLockElement !== canvas){
    try {
      canvas.requestPointerLock();
    } catch(err){}
  }
});

document.addEventListener('pointerlockchange', ()=>{
  const isLocked = document.pointerLockElement === canvas;
  const crosshair = document.getElementById('crosshair');
  if(crosshair){
    crosshair.classList.toggle('locked', isLocked);
  }
});

/* Mouse move for FPS camera orientation (Pointer Lock or Drag) */
document.addEventListener('mousemove', (e)=>{
  if(!isFpsMode) return;
  if(document.pointerLockElement === canvas){
    const sens = 0.0024;
    fpsYaw -= e.movementX * sens;
    fpsPitch -= e.movementY * sens;
    fpsPitch = Math.max(-1.45, Math.min(1.45, fpsPitch));
    updateCamera();
  }
});

/* ==========================================================================
   CANVAS POINTER & DRAG INTERACTION (ORBIT & FPS)
   ========================================================================== */
let dragDeviceId = null, dragMoved = false, dragStart = { x: 0, y: 0 };
let orbiting = false, lastX = 0, lastY = 0;

canvas.addEventListener('pointerdown', (e)=>{
  setMouse(e);
  hideHint();
  try{ canvas.setPointerCapture(e.pointerId); }catch(err){}
  const devId = pickDevice();

  if(devId){
    if(connectMode){
      handleConnectClick(devId);
      // connectMode da drag/orbit boshlashdan oldin pointer ni ozod qilish
      try{ canvas.releasePointerCapture(e.pointerId); }catch(err){}
      return;
    }
    if(!isFpsMode){
      dragDeviceId = devId;
      dragMoved = false;
      dragStart.x = e.clientX; dragStart.y = e.clientY;
      return;
    } else {
      // In FPS mode, clicking an aimed device selects it
      selectDevice(devId);
      return;
    }
  }

  if(!connectMode){
    const cid = pickConnection();
    if(cid){ selectConnectionPrompt(cid); return; }
  }

  orbiting = true; lastX = e.clientX; lastY = e.clientY;
});

canvas.addEventListener('pointermove', (e)=>{
  e.preventDefault();
  setMouse(e);
  if(dragDeviceId && !isFpsMode){
    const dx = e.clientX - dragStart.x, dy = e.clientY - dragStart.y;
    if(Math.hypot(dx, dy) > 4) dragMoved = true;
    if(dragMoved){
      const pt = floorPoint();
      if(pt){
        const rec = devices.get(dragDeviceId);
        const len = Math.hypot(pt.x, pt.z);
        const maxR = FLOOR_R - 0.6;
        if(len > maxR){ pt.x *= maxR / len; pt.z *= maxR / len; }
        rec.group.position.x = pt.x;
        rec.group.position.z = pt.z;

        // Broadcast move in multiplayer
        if(typeof Multiplayer !== 'undefined' && Multiplayer.active){
          Multiplayer.broadcast({
            type: 'topo_move_device',
            deviceId: dragDeviceId,
            x: pt.x,
            z: pt.z
          });
        }
      }
    }
    return;
  }
  if(orbiting){
    const dx = e.clientX - lastX, dy = e.clientY - lastY;
    lastX = e.clientX; lastY = e.clientY;

    if(!isFpsMode){
      camTheta -= dx * 0.006;
      camPhi   -= dy * 0.006;
      camPhi = Math.max(0.18, Math.min(Math.PI / 2 - 0.05, camPhi));
      updateCamera();
    } else if(document.pointerLockElement !== canvas){
      // Manual drag-look when pointer lock is not active
      fpsYaw -= dx * 0.004;
      fpsPitch -= dy * 0.004;
      fpsPitch = Math.max(-1.45, Math.min(1.45, fpsPitch));
      updateCamera();
    }
  }
});

window.addEventListener('pointerup', (e)=>{
  try{ canvas.releasePointerCapture(e.pointerId); }catch(err){}
  if(dragDeviceId && !dragMoved){
    selectDevice(dragDeviceId);
  }
  dragDeviceId = null; dragMoved = false;
  orbiting = false;
});

canvas.addEventListener('wheel', (e)=>{
  if(isFpsMode) return;
  e.preventDefault();
  camRadius += e.deltaY * 0.01;
  camRadius = Math.max(6, Math.min(42, camRadius));
  updateCamera();
}, { passive: false });

function handleConnectClick(devId){
  if(connectFirstId === null){
    connectFirstId = devId;
    linkRing.visible = true;
    toast("Endi ikkinchi qurilmani tanlang: " + devices.get(devId).name);
  } else if(connectFirstId === devId){
    connectFirstId = null;
    linkRing.visible = false;
  } else {
    openPortSelectModal(connectFirstId, devId);
  }
}

/* ==========================================================================
   TOOLBAR BUTTON HOOKS & CONTROLLERS
   ========================================================================== */
const camModeBtn = document.getElementById('camModeBtn');
if(camModeBtn){
  camModeBtn.addEventListener('click', ()=>setCameraMode(!isFpsMode));
}

const lightModeBtn = document.getElementById('lightModeBtn');
if(lightModeBtn){
  lightModeBtn.addEventListener('click', ()=>toggleLightingMode());
}

const collabToolbarBtn = document.getElementById('collabToolbarBtn');
if(collabToolbarBtn){
  collabToolbarBtn.addEventListener('click', ()=>{
    const modal = document.getElementById('collabModal');
    if(modal) modal.classList.toggle('show');
  });
}

const connectBtn = document.getElementById('connectModeBtn');
if(connectBtn){
  connectBtn.addEventListener('click', ()=>{
    connectMode = !connectMode;
    connectBtn.classList.toggle('on', connectMode);
    connectFirstId = null; linkRing.visible = false;
    toast(connectMode ? "Ulash rejimi yoqildi — ikkita qurilmani ketma-ket bosing" : "Ulash rejimi o'chirildi");
  });
}

const clearBtn = document.getElementById('clearBtn');
if(clearBtn){
  clearBtn.addEventListener('click', ()=>{
    if(devices.size === 0) return;
    if(!confirm("Butun tarmoq tozalansinmi?")) return;
    [...devices.keys()].forEach(removeDevice);
    toast("Tarmoq tozalandi");
  });
}

const pduModeBtn = document.getElementById('pduModeBtn');
if(pduModeBtn) pduModeBtn.addEventListener('click', ()=>openPduModal());

const ciscoTerminalBtn = document.getElementById('ciscoTerminalBtn');
if(ciscoTerminalBtn) ciscoTerminalBtn.addEventListener('click', ()=>openCiscoTerminal());

const simDockBtn = document.getElementById('simDockBtn');
if(simDockBtn) simDockBtn.addEventListener('click', ()=>toggleSimDock());

const panelCliBtn = document.getElementById('panelCliBtn');
if(panelCliBtn) panelCliBtn.addEventListener('click', ()=>{
  if(selectedDeviceId) openCiscoTerminal(selectedDeviceId);
});

const panelPduBtn = document.getElementById('panelPduBtn');
if(panelPduBtn) panelPduBtn.addEventListener('click', ()=>{
  if(selectedDeviceId) openPduModal(selectedDeviceId);
});

/* Xabar tugmalari */
const msgModeBtn = document.getElementById('msgModeBtn');
if(msgModeBtn) msgModeBtn.addEventListener('click', ()=> openMessageModal());

const panelMsgBtn = document.getElementById('panelMsgBtn');
if(panelMsgBtn) panelMsgBtn.addEventListener('click', ()=>{
  if(selectedDeviceId) openMessageModal(selectedDeviceId);
});

/* Wi-Fi & Panel hooks */
const wifiToolbarBtn = document.getElementById('wifiToolbarBtn');
if(wifiToolbarBtn) wifiToolbarBtn.addEventListener('click', ()=>openWifiModal());

const panelWifiBtn = document.getElementById('panelWifiBtn');
if(panelWifiBtn) panelWifiBtn.addEventListener('click', ()=>{
  if(selectedDeviceId) openWifiModal(selectedDeviceId);
});

const pAddWifiAdapterBtn = document.getElementById('pAddWifiAdapterBtn');
if(pAddWifiAdapterBtn) pAddWifiAdapterBtn.addEventListener('click', ()=>{
  if(selectedDeviceId) addWifiAdapter(selectedDeviceId);
});

/* ── Panel VLAN tugmasi ── */
const panelVlanBtn = document.getElementById('panelVlanBtn');
if(panelVlanBtn) panelVlanBtn.addEventListener('click', ()=>{
  if(selectedDeviceId && typeof openVlanModal === 'function') openVlanModal(selectedDeviceId);
});

/* ── Loyiha (Storage) tugmasi ── */
const storageBtn = document.getElementById('storageBtn');
if(storageBtn) storageBtn.addEventListener('click', openStorageModal);

/* ── Subnet Kalkulyator tugmasi ── */
const subnetBtn = document.getElementById('subnetBtn');
if(subnetBtn) subnetBtn.addEventListener('click', ()=>{
  if(subnetPanelOpen) closeSubnetPanel();
  else openSubnetPanel();
});

/* ── Quiz tugmasi ── */
const quizBtn = document.getElementById('quizBtn');
if(quizBtn) quizBtn.addEventListener('click', openQuizModal);

/* ── Undo/Redo tugmalari ── */
const histUndoBtn = document.getElementById('historyUndoBtn');
if(histUndoBtn) histUndoBtn.addEventListener('click', undo);

const histRedoBtn = document.getElementById('historyRedoBtn');
if(histRedoBtn) histRedoBtn.addEventListener('click', redo);

/* ── Autosave (qurilma / ulanish o'zgarishida) ── */
// addDevice va removeDevice wraplash orqali autosave
const _origAddDevice = addDevice;
window.addDevice = function(...args){
  const r = _origAddDevice(...args);
  if(r && typeof triggerAutosave === 'function') triggerAutosave();
  return r;
};

/* Fullscreen Toggle */
const lanFsBtn = document.getElementById('lanFsBtn');
if(lanFsBtn) {
  lanFsBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      const req = document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen || document.documentElement.mozRequestFullScreen || document.documentElement.msRequestFullscreen;
      if (req) req.call(document.documentElement).catch(() => {});
      toast("⛶ To‘liq ekran yoqildi");
    } else {
      const exit = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen;
      if (exit) exit.call(document).catch(() => {});
      toast("Oynaga qaytildi");
    }
  });
}

/* ==========================================================================
   MODELLAR KATALOGI (3D HARDWARE & CABLES CATALOG) CONTROLLER
   ========================================================================== */
const modelsCatalogBtn = document.getElementById('modelsCatalogBtn');
const modelsCatalogModal = document.getElementById('modelsCatalogModal');
const modelsCatalogClose = document.getElementById('modelsCatalogClose');
const modelsCatalogGrid = document.getElementById('modelsCatalogGrid');
const catalogCategoryTabs = document.getElementById('catalogCategoryTabs');
const catalogSearchInput = document.getElementById('catalogSearchInput');

let currentCatalogCat = 'all';
let currentCatalogBrand = 'all';
let currentCatalogSearch = '';

function openModelPickerForType(type){
  currentCatalogCat = type || 'all';
  currentCatalogBrand = 'all';
  currentCatalogSearch = '';
  if(catalogSearchInput) catalogSearchInput.value = '';

  const catalogBrandTabs = document.getElementById('catalogBrandTabs');
  if(catalogBrandTabs){
    catalogBrandTabs.querySelectorAll('.proto-btn').forEach(b => b.classList.toggle('active', b.dataset.brand === 'all'));
  }

  // Update tabs active state
  if(catalogCategoryTabs){
    catalogCategoryTabs.querySelectorAll('.proto-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.cat === currentCatalogCat);
    });
  }

  // Update modal title to highlight selected device type
  const modalTitle = document.querySelector('#modelsCatalogModal .modal-head h3');
  if(modalTitle){
    if(type && type !== 'all'){
      const label = TYPES[type] ? TYPES[type].label : type;
      modalTitle.textContent = `${label} — 3D Modelini Tanlang`;
    } else {
      modalTitle.textContent = '3D Qurilmalar va Kabellar Modellar Katalogi';
    }
  }

  if(modelsCatalogModal){
    modelsCatalogModal.classList.add('show');
    renderModelsCatalog();
  }
}

function renderModelsCatalog(){
  if(!modelsCatalogGrid || typeof MODELS_DB === 'undefined') return;
  modelsCatalogGrid.innerHTML = '';

  const q = currentCatalogSearch.toLowerCase().trim();

  // 1. Render Cables if selected
  if(currentCatalogCat === 'all' || currentCatalogCat === 'cables'){
    if(typeof CABLE_TYPES_DB !== 'undefined'){
      Object.keys(CABLE_TYPES_DB).forEach(k => {
        const c = CABLE_TYPES_DB[k];
        if(q && !c.name.toLowerCase().includes(q) && !c.desc.toLowerCase().includes(q)) return;

        const card = document.createElement('div');
        card.className = 'model-card cable-card';
        card.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:6px;">
            <div style="display:flex; align-items:center; gap:8px;">
              <span class="cable-color-dot" style="background:${c.hexColor || '#FFF'}; box-shadow:0 0 8px ${c.hexColor};"></span>
              <b style="font-size:12.5px; color:var(--ink);">${c.name}</b>
            </div>
            <span class="mono" style="font-size:9.5px; padding:2px 6px; border-radius:4px; background:rgba(255,180,84,0.15); color:var(--accent); font-weight:700;">${c.speed}</span>
          </div>
          <p style="font-size:11px; color:var(--ink-dim); line-height:1.4; margin-bottom:8px;">${c.desc}</p>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:auto;">
            <span style="font-size:10px; color:#A78BFA; font-weight:600;">Ulagich: ${c.connectorType}</span>
            <span style="font-size:10px; color:var(--ink-dim);">Ulash rejimida tanlanadi</span>
          </div>
        `;
        modelsCatalogGrid.appendChild(card);
      });
    }
  }

  // 2. Render Hardware Devices
  if(currentCatalogCat !== 'cables'){
    Object.keys(MODELS_DB).forEach(cat => {
      if(currentCatalogCat !== 'all' && currentCatalogCat !== cat) return;
      const models = MODELS_DB[cat];

      Object.keys(models).forEach(mKey => {
        const m = models[mKey];
        if(currentCatalogBrand !== 'all' && !m.brand.toLowerCase().includes(currentCatalogBrand.toLowerCase())) return;
        if(q && !m.name.toLowerCase().includes(q) && !m.brand.toLowerCase().includes(q) && !m.desc.toLowerCase().includes(q)) return;

        const card = document.createElement('div');
        card.className = 'model-card';
        const portTags = m.ports.map(p => `<span class="port-tag">${p}</span>`).join('');

        card.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:4px;">
            <div>
              <span class="brand-badge">${m.brand}</span>
              <b style="font-size:12.5px; color:var(--ink); display:block; margin-top:2px;">${m.name}</b>
            </div>
            <span class="cat-badge">${TYPES[cat] ? TYPES[cat].label : cat}</span>
          </div>
          <p style="font-size:11px; color:var(--ink-dim); line-height:1.4; margin:6px 0 10px;">${m.desc}</p>
          <div style="display:flex; align-items:center; gap:4px; margin-bottom:10px; flex-wrap:wrap;">
            <span style="font-size:10px; color:var(--ink-dim); margin-right:4px;">Portlar:</span>
            ${portTags}
          </div>
          <button class="actbtn on add-model-btn" style="width:100%; justify-content:center; padding:6px; font-size:11.5px; font-weight:700;">
            ➕ Maydonga Qo‘shish
          </button>
        `;

        card.querySelector('.add-model-btn').addEventListener('click', ()=>{
          const newRec = addDevice(cat, mKey);
          if(newRec && typeof Multiplayer !== 'undefined' && Multiplayer.active){
            Multiplayer.broadcast({
              type: 'topo_add_device',
              deviceData: { id: newRec.id, type: newRec.type, name: newRec.name, x: newRec.group.position.x, z: newRec.group.position.z, ip: newRec.ip }
            });
          }
          if(modelsCatalogModal) modelsCatalogModal.classList.remove('show');
        });

        modelsCatalogGrid.appendChild(card);
      });
    });
  }

  if(modelsCatalogGrid.children.length === 0){
    modelsCatalogGrid.innerHTML = `<div class="empty" style="grid-column:1/-1; padding:30px; font-size:12px; color:var(--ink-dim);">Mos keluvchi model topilmadi.</div>`;
  }
}

if(modelsCatalogBtn){
  modelsCatalogBtn.addEventListener('click', ()=>{
    openModelPickerForType('all');
  });
}

if(modelsCatalogClose){
  modelsCatalogClose.addEventListener('click', ()=>{
    if(modelsCatalogModal) modelsCatalogModal.classList.remove('show');
  });
}

if(catalogCategoryTabs){
  catalogCategoryTabs.querySelectorAll('.proto-btn').forEach(btn => {
    btn.addEventListener('click', ()=>{
      catalogCategoryTabs.querySelectorAll('.proto-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCatalogCat = btn.dataset.cat || 'all';
      const modalTitle = document.querySelector('#modelsCatalogModal .modal-head h3');
      if(modalTitle){
        if(currentCatalogCat !== 'all' && currentCatalogCat !== 'cables' && TYPES[currentCatalogCat]){
          modalTitle.textContent = `${TYPES[currentCatalogCat].label} — 3D Modelini Tanlang`;
        } else if(currentCatalogCat === 'cables'){
          modalTitle.textContent = 'Aloqa Kabellari Rusumlari (7)';
        } else {
          modalTitle.textContent = '3D Qurilmalar va Kabellar Modellar Katalogi';
        }
      }
      renderModelsCatalog();
    });
  });
}

const catalogBrandTabs = document.getElementById('catalogBrandTabs');
if(catalogBrandTabs){
  catalogBrandTabs.querySelectorAll('.proto-btn').forEach(btn => {
    btn.addEventListener('click', ()=>{
      catalogBrandTabs.querySelectorAll('.proto-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCatalogBrand = btn.dataset.brand || 'all';
      renderModelsCatalog();
    });
  });
}

if(catalogSearchInput){
  catalogSearchInput.addEventListener('input', (e)=>{
    currentCatalogSearch = e.target.value;
    renderModelsCatalog();
  });
}

/* ==========================================================================
   MULTIPLAYER MODAL & CHAT UI HOOKS
   ========================================================================== */
const collabModalCloseBtn = document.getElementById('collabModalClose');
if(collabModalCloseBtn){
  collabModalCloseBtn.addEventListener('click', ()=>{
    const m = document.getElementById('collabModal');
    if(m) m.classList.remove('show');
  });
}

const collabJoinBtn = document.getElementById('collabJoinBtn');
if(collabJoinBtn){
  collabJoinBtn.addEventListener('click', ()=>{
    const roomInput = document.getElementById('collabRoomInput');
    const nameInput = document.getElementById('collabNameInput');
    const room = roomInput ? roomInput.value.trim() : 'ATT-LAB-01';
    const name = nameInput ? nameInput.value.trim() : '';
    Multiplayer.joinRoom(room, name);
    const m = document.getElementById('collabModal');
    if(m) m.classList.remove('show');
  });
}

const collabLeaveBtn = document.getElementById('collabLeaveBtn');
if(collabLeaveBtn){
  collabLeaveBtn.addEventListener('click', ()=>{
    Multiplayer.leaveRoom();
  });
}

const collabChatSendBtn = document.getElementById('collabChatSendBtn');
const collabChatInput = document.getElementById('collabChatInput');
if(collabChatSendBtn && collabChatInput){
  const send = ()=>{
    const val = collabChatInput.value;
    if(val){
      Multiplayer.sendChat(val);
      collabChatInput.value = '';
    }
  };
  collabChatSendBtn.addEventListener('click', send);
  collabChatInput.addEventListener('keydown', (e)=>{
    if(e.key === 'Enter') send();
  });
}

/* Remote Topology Helpers for Multiplayer Sync */
window.addDeviceFromData = function(data){
  if(!data || devices.has(data.id)) return;
  const dev = addDevice(data.type, data.modelKey);
  if(!dev) return;

  // ID ni server yuborgan id ga moslashtirish (multiplayer sync uchun)
  const oldId = dev.id;
  dev.id = data.id;
  devices.delete(oldId);
  devices.set(dev.id, dev);

  // Qurilma nomini va IP ni yangilash
  if(data.name) dev.name = data.name;
  if(data.ip){ dev.ip = data.ip; }
  if(data.x !== undefined) dev.group.position.x = data.x;
  if(data.z !== undefined) dev.group.position.z = data.z;

  // Barcha pick meshlarni yangi id ga yangilash
  dev.group.traverse(o => { if(o.isMesh) o.userData.deviceId = data.id; });

  // Label ni yangilash
  if(dev.label){
    dev.label.querySelector('.nm').textContent = dev.name;
    dev.label.querySelector('.ip').textContent = dev.ip;
  }
  if(typeof updateConnectionsGeometry === 'function') updateConnectionsGeometry();
  if(typeof updateRings === 'function') updateRings();
  if(typeof updateLabels === 'function') updateLabels();

  toast(`➕ Boshqa talaba yangi qurilma qo'shdi: ${dev.name}`);
};

window.moveDeviceRemote = function(devId, x, z){
  const dev = devices.get(devId);
  if(dev){
    dev.group.position.x = x;
    dev.group.position.z = z;
    if(typeof updateConnectionsGeometry === 'function') updateConnectionsGeometry();
    if(typeof updateRings === 'function') updateRings();
    if(typeof updateLabels === 'function') updateLabels();
  }
};

window.connectDevicesRemote = function(aId, bId, opts){
  if(devices.has(aId) && devices.has(bId)){
    const optObj = (typeof opts === 'object' && opts !== null)
      ? opts
      : { cableType: opts || 'auto' };
    addConnection(aId, bId, optObj);
  }
};

window.removeDeviceRemote = function(devId){
  if(devices.has(devId)){
    removeDevice(devId);
  }
};

window.removeConnectionRemote = function(connId){
  if(connections.has(connId)){
    removeConnection(connId);
  }
};

window.spawnPacketVisualRemote = function(fromId, toId, colorHex, protocol){
  let c = getConnectionBetween(fromId, toId);
  if(c && c.packets){
    const col = colorHex ? parseInt(colorHex.replace('#', '0x')) : 0x00FF87;
    c.packets.push({
      t: 0,
      speed: 0.35,
      mesh: (typeof getPacketMesh === 'function') ? getPacketMesh(col) : null
    });
  }
};

/* ==========================================================================
   ANIMATION LOOP & PHYSICS UPDATE
   ========================================================================== */
const clock = new THREE.Clock();

function updateFpsMovement(dt){
  if(!isFpsMode) return;

  const speed = keys.sprint ? 9.0 : 4.8;
  const moveDir = new THREE.Vector3();

  // Forward & Backward along horizontal camera plane
  if(keys.forward)  moveDir.z -= 1;
  if(keys.backward) moveDir.z += 1;
  if(keys.left)     moveDir.x -= 1;
  if(keys.right)    moveDir.x += 1;

  if(moveDir.lengthSq() > 0){
    moveDir.normalize();

    // Rotate movement vector by current FPS Yaw
    const sinY = Math.sin(fpsYaw);
    const cosY = Math.cos(fpsYaw);
    const worldX = moveDir.x * cosY - moveDir.z * sinY;
    const worldZ = moveDir.x * sinY + moveDir.z * cosY;

    fpsVel.x += worldX * speed * dt * 10;
    fpsVel.z += worldZ * speed * dt * 10;
  }

  // Apply friction / damping
  fpsVel.x *= Math.max(0, 1 - 10 * dt);
  fpsVel.z *= Math.max(0, 1 - 10 * dt);

  // Update position with room boundary collision constraints
  fpsPos.x += fpsVel.x * dt;
  fpsPos.z += fpsVel.z * dt;

  fpsPos.x = Math.max(-ARENA_HALF_W, Math.min(ARENA_HALF_W, fpsPos.x));
  fpsPos.z = Math.max(-ARENA_HALF_L, Math.min(ARENA_HALF_L, fpsPos.z));

  updateCamera();

  // Update Crosshair aim & target HUD
  const crosshair = document.getElementById('crosshair');
  const targetBadge = document.getElementById('fpsTargetBadge');
  const devId = pickDevice();
  if(devId){
    const dev = devices.get(devId);
    if(crosshair) crosshair.classList.add('locked');
    if(targetBadge){
      targetBadge.style.display = 'block';
      targetBadge.innerHTML = `<b>[E]</b> ${dev.name} <span style="font-size:9.5px; opacity:0.8;">(${TYPES[dev.type].label}) — Boshqarish</span>`;
    }
  } else {
    if(crosshair) crosshair.classList.remove('locked');
    if(targetBadge) targetBadge.style.display = 'none';
  }
}

function animate(){
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05);

  updateFpsMovement(dt);
  updateRackLeds(clock.elapsedTime);
  updateConnectionsGeometry();
  updatePackets(dt);
  update3DTransfers(dt);
  updateLabels();
  updateRings();
  updateWifiCoverageVisual();
  spawnWifiPulses(dt);
  updateWifiPulses(dt);
  updateMiniRadar();

  renderer.render(scene, camera);
}

// Initialize Multiplayer
if(typeof Multiplayer !== 'undefined'){
  Multiplayer.init();
}

/* Check URL query on start (e.g. ?topo=star) */
const urlParams = new URLSearchParams(window.location.search);
const qTopo = urlParams.get('topo') || window.location.hash.replace('#', '');
// 'seed' ham ro'yxatga qo'shildi
if(qTopo && ['star', 'ring', 'bus', 'tree', 'mesh', 'office', 'seed'].includes(qTopo)){
  if(qTopo === 'seed'){
    seed();
  } else {
    loadTopology(qTopo);
  }
} else {
  // Autosave tekshirish (storage.js yoqlangan bo'lsa)
  const autoLoaded = (typeof loadAutosave === 'function') && loadAutosave();
  if(!autoLoaded) seed();
}

animate();
