/* ==========================================================================
   APP INITIALIZATION, CONTROLS, PANEL, EVENT LISTENERS & ANIMATION LOOP
   ========================================================================== */

/* Build Device Tray in Toolbar */
const tray = document.getElementById('devtray');
if(tray){
  ORDER.forEach(t=>{
    const b = document.createElement('button');
    b.className = 'devbtn';
    b.title = "Qo'shish: " + TYPES[t].label;
    b.innerHTML = ICONS[t] + `<span>${TYPES[t].label}</span>`;
    b.addEventListener('click', ()=>addDevice(t));
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
      removeDevice(selectedDeviceId);
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

  // Update Wi-Fi adapter toggle section for desktop/server
  if(pWifiAdapterToggleSection){
    if((rec.type === 'desktop' || rec.type === 'server') && (!rec.wifi || !rec.wifi.hasAdapter)){
      pWifiAdapterToggleSection.style.display = 'block';
    } else {
      pWifiAdapterToggleSection.style.display = 'none';
    }
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
    const cableName = c.cableType === 'fiber' ? 'Fiber 10G' : c.cableType === 'crossover' ? 'Cross' : c.cableType === 'straight' ? 'Straight' : c.wireless ? 'Wi-Fi' : 'WAN';
    row.innerHTML = `<span class="lbl"><span class="seg" style="background:${colorHex}"></span><b>[${myPort || 'Port'}]</b> ${other.name} <b>[${otherPort || 'Port'}]</b> <span style="font-size:9px; color:var(--ink-dim);">(${cableName})</span></span>`;
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
   CANVAS POINTER & DRAG INTERACTION
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
      return;
    }
    dragDeviceId = devId;
    dragMoved = false;
    dragStart.x = e.clientX; dragStart.y = e.clientY;
    return;
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
  if(dragDeviceId){
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
      }
    }
    return;
  }
  if(orbiting){
    const dx = e.clientX - lastX, dy = e.clientY - lastY;
    lastX = e.clientX; lastY = e.clientY;
    camTheta -= dx * 0.006;
    camPhi   -= dy * 0.006;
    camPhi = Math.max(0.18, Math.min(Math.PI / 2 - 0.05, camPhi));
    updateCamera();
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
  e.preventDefault();
  camRadius += e.deltaY * 0.01;
  camRadius = Math.max(6, Math.min(30, camRadius));
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
   TOOLBAR BUTTON HOOKS
   ========================================================================== */
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
   ANIMATION LOOP
   ========================================================================== */
const clock = new THREE.Clock();

function animate(){
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05);

  updateConnectionsGeometry();
  updatePackets(dt);
  update3DTransfers(dt);
  updateLabels();
  updateRings();
  updateWifiCoverageVisual();
  spawnWifiPulses(dt);
  updateWifiPulses(dt);

  renderer.render(scene, camera);
}

/* Check URL query on start (e.g. ?topo=star) */
const urlParams = new URLSearchParams(window.location.search);
const qTopo = urlParams.get('topo') || window.location.hash.replace('#', '');
if(qTopo && ['star', 'ring', 'bus', 'tree', 'mesh', 'office'].includes(qTopo)){
  loadTopology(qTopo);
} else {
  seed();
}

animate();
