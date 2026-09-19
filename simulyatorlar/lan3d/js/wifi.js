/* ==========================================================================
   WI-FI MANAGEMENT & WIRELESS SETTINGS SYSTEM
   ========================================================================== */

function initDeviceWifi(rec){
  const isRouter = (rec.type === 'router');
  const isLaptop = (rec.type === 'laptop');
  const isPhone = (rec.type === 'phone');
  const isPrinter = (rec.type === 'printer');

  rec.wifi = {
    isAp: isRouter,
    enabled: isRouter || isLaptop || isPhone || isPrinter,
    ssid: isRouter ? (rec.name.replace(/\s+/g, '_') + "_WiFi") : (rec.name.replace(/\s+/g, '_') + "_Hotspot"),
    security: 'wpa2',
    password: 'admin',
    band: '5GHz',
    channel: isRouter ? 36 : 6,
    txPower: 100,
    radius: isRouter ? 11 : 7,
    hidden: false,
    connectedClients: [],

    hasAdapter: isLaptop || isPhone || isPrinter,
    adapterEnabled: isLaptop || isPhone || isPrinter,
    connectedApId: null,
    connectedSsid: null,
    hotspotMode: false,
    signalRssi: -50,
  };
}

const wifiModal = document.getElementById('wifiModal');
const wifiModalDevName = document.getElementById('wifiModalDevName');
const wifiDevSelect = document.getElementById('wifiDevSelect');
const wifiModalClose = document.getElementById('wifiModalClose');
const wifiModalDoneBtn = document.getElementById('wifiModalDoneBtn');

// AP elements
const wifiApSection = document.getElementById('wifiApSection');
const wifiApRadioSwitch = document.getElementById('wifiApRadioSwitch');
const wifiApRadioStatus = document.getElementById('wifiApRadioStatus');
const wifiApSsidInput = document.getElementById('wifiApSsidInput');
const wifiApSecuritySelect = document.getElementById('wifiApSecuritySelect');
const wifiApPassRow = document.getElementById('wifiApPassRow');
const wifiApPassInput = document.getElementById('wifiApPassInput');
const wifiBandTabs = document.getElementById('wifiBandTabs');
const wifiTxTabs = document.getElementById('wifiTxTabs');
const wifiClientCount = document.getElementById('wifiClientCount');
const wifiConnectedClientsList = document.getElementById('wifiConnectedClientsList');

// Client elements
const wifiClientSection = document.getElementById('wifiClientSection');
const wifiClientAdapterName = document.getElementById('wifiClientAdapterName');
const wifiClientAdapterStatus = document.getElementById('wifiClientAdapterStatus');
const wifiClientScanBtn = document.getElementById('wifiClientScanBtn');
const wifiToggleHotspotBtn = document.getElementById('wifiToggleHotspotBtn');
const wifiCurrentConnCard = document.getElementById('wifiCurrentConnCard');
const wifiCurSsid = document.getElementById('wifiCurSsid');
const wifiCurIp = document.getElementById('wifiCurIp');
const wifiCurSignal = document.getElementById('wifiCurSignal');
const wifiDisconnectBtn = document.getElementById('wifiDisconnectBtn');
const wifiScannedList = document.getElementById('wifiScannedList');
const wifiConnectPromptCard = document.getElementById('wifiConnectPromptCard');
const wifiTargetSsid = document.getElementById('wifiTargetSsid');
const wifiTargetPassInput = document.getElementById('wifiTargetPassInput');
const wifiConfirmConnectBtn = document.getElementById('wifiConfirmConnectBtn');
const wifiCancelPromptBtn = document.getElementById('wifiCancelPromptBtn');

let activeWifiDevId = null;
let pendingConnectApId = null;

function getWifiDistance(devAId, devBId){
  const ra = devices.get(devAId), rb = devices.get(devBId);
  if(!ra || !rb) return 999;
  return ra.group.position.distanceTo(rb.group.position);
}

function calcRssi(dist){
  const rssi = Math.round(-35 - dist * 5.5);
  return Math.max(-95, Math.min(-30, rssi));
}

function getSignalBars(rssi){
  if(rssi >= -55) return 4;
  if(rssi >= -70) return 3;
  if(rssi >= -82) return 2;
  return 1;
}

function renderSignalBarsHtml(bars){
  return `
    <div class="wifi-signal-bars" title="Signal: ${bars}/4">
      <div class="wifi-bar ${bars >= 1 ? 'active' : ''}"></div>
      <div class="wifi-bar ${bars >= 2 ? 'active' : ''}"></div>
      <div class="wifi-bar ${bars >= 3 ? 'active' : ''}"></div>
      <div class="wifi-bar ${bars >= 4 ? 'active' : ''}"></div>
    </div>
  `;
}

function openWifiModal(devId){
  if(devices.size === 0){
    toast("Avval sahnaga kamida bitta qurilma qo‘shing!");
    return;
  }
  activeWifiDevId = devId || selectedDeviceId || [...devices.keys()][0];
  populateWifiDevSelect();
  renderWifiModalContent();
  if(wifiModal) wifiModal.classList.add('show');
}

function closeWifiModal(){
  if(wifiModal) wifiModal.classList.remove('show');
  if(wifiConnectPromptCard) wifiConnectPromptCard.style.display = 'none';
}

function populateWifiDevSelect(){
  if(!wifiDevSelect) return;
  wifiDevSelect.innerHTML = '';
  devices.forEach(d => {
    const opt = document.createElement('option');
    opt.value = d.id;
    opt.textContent = `${d.name} (${TYPES[d.type].label})`;
    if(d.id === activeWifiDevId) opt.selected = true;
    wifiDevSelect.appendChild(opt);
  });
}

function renderWifiModalContent(){
  const dev = devices.get(activeWifiDevId);
  if(!dev) return;
  if(!dev.wifi) initDeviceWifi(dev);

  if(wifiModalDevName) wifiModalDevName.textContent = `${dev.name} [${TYPES[dev.type].label}]`;

  const isApMode = dev.wifi.isAp || dev.wifi.hotspotMode;

  if(isApMode){
    if(wifiApSection) wifiApSection.style.display = 'flex';
    if(wifiClientSection) wifiClientSection.style.display = 'none';

    if(wifiApRadioSwitch) wifiApRadioSwitch.checked = dev.wifi.enabled;
    if(wifiApRadioStatus){
      wifiApRadioStatus.textContent = dev.wifi.enabled ? 'YOQILGAN' : 'O‘CHIRILGAN';
      wifiApRadioStatus.style.color = dev.wifi.enabled ? '#38BDF8' : '#EF4444';
    }

    if(wifiApSsidInput) wifiApSsidInput.value = dev.wifi.ssid;
    if(wifiApSecuritySelect) wifiApSecuritySelect.value = dev.wifi.security;
    if(wifiApPassInput) wifiApPassInput.value = dev.wifi.password;
    if(wifiApPassRow) wifiApPassRow.style.display = (dev.wifi.security === 'open') ? 'none' : 'flex';

    if(wifiBandTabs){
      wifiBandTabs.querySelectorAll('.proto-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.band === dev.wifi.band);
      });
    }
    if(wifiTxTabs){
      wifiTxTabs.querySelectorAll('.proto-btn').forEach(b => {
        b.classList.toggle('active', parseInt(b.dataset.tx) === dev.wifi.txPower);
      });
    }

    const clients = dev.wifi.connectedClients || [];
    if(wifiClientCount) wifiClientCount.textContent = clients.length;
    if(wifiConnectedClientsList){
      if(clients.length === 0){
        wifiConnectedClientsList.innerHTML = `<div class="empty" style="font-size:10.5px; color:var(--ink-dim); padding:6px;">Hozirda simsiz ulangan mijozlar yo‘q.</div>`;
      } else {
        wifiConnectedClientsList.innerHTML = clients.map(cl => {
          const clientDev = devices.get(cl.devId);
          const dist = clientDev ? getWifiDistance(dev.id, clientDev.id).toFixed(1) : '—';
          const rssi = clientDev ? calcRssi(dist) : cl.rssi;
          return `
            <div class="wifi-net-item">
              <div class="wifi-net-info">
                <div class="wifi-net-title">${cl.name} <span class="mono" style="font-size:10px; color:#6FE3C4;">${cl.ip}</span></div>
                <div class="wifi-net-meta">MAC: ${cl.mac} · Masofa: ${dist}m · Signal: ${rssi} dBm</div>
              </div>
              <button class="actbtn warn" style="font-size:10px; padding:3px 7px;" onclick="window.disconnectWifiClient('${cl.devId}')">Uzish</button>
            </div>
          `;
        }).join('');
      }
    }
  } else {
    if(wifiApSection) wifiApSection.style.display = 'none';
    if(wifiClientSection) wifiClientSection.style.display = 'flex';

    if(wifiClientAdapterName) wifiClientAdapterName.textContent = `${dev.name} Wi-Fi Adapter (WLAN0)`;
    if(wifiClientAdapterStatus){
      wifiClientAdapterStatus.textContent = dev.wifi.adapterEnabled ? 'Holat: Faol / Ishlamoqda' : 'Holat: O‘chirilgan';
      wifiClientAdapterStatus.style.color = dev.wifi.adapterEnabled ? '#6FE3C4' : '#EF4444';
    }

    if(wifiToggleHotspotBtn){
      wifiToggleHotspotBtn.textContent = dev.wifi.hotspotMode ? '🔥 Hotspotni o‘chirish' : '🔥 Hotspot / Direct yoqish';
      wifiToggleHotspotBtn.classList.toggle('on', dev.wifi.hotspotMode);
    }

    if(dev.wifi.connectedSsid && dev.wifi.connectedApId){
      const apDev = devices.get(dev.wifi.connectedApId);
      const dist = apDev ? getWifiDistance(dev.id, apDev.id).toFixed(1) : '—';
      const rssi = apDev ? calcRssi(dist) : dev.wifi.signalRssi;
      const bars = getSignalBars(rssi);

      if(wifiCurrentConnCard) wifiCurrentConnCard.style.display = 'block';
      if(wifiCurSsid) wifiCurSsid.innerHTML = `📶 ${dev.wifi.connectedSsid} (${apDev ? apDev.name : 'AP'})`;
      if(wifiCurIp) wifiCurIp.textContent = dev.ip;
      if(wifiCurSignal) wifiCurSignal.innerHTML = `${renderSignalBarsHtml(bars)} <span style="margin-left:4px;">${rssi} dBm (${dist}m)</span>`;
    } else {
      if(wifiCurrentConnCard) wifiCurrentConnCard.style.display = 'none';
    }

    renderScannedNetworks();
  }
}

function renderScannedNetworks(){
  if(!wifiScannedList) return;
  const networks = scanWifiNetworks(activeWifiDevId);
  if(networks.length === 0){
    wifiScannedList.innerHTML = `<div class="empty" style="font-size:10.5px; color:var(--ink-dim); padding:8px;">Atrofda faol Wi-Fi tarmoqlari topilmadi. Router yoki Hotspot qo‘shing.</div>`;
    return;
  }

  const clientDev = devices.get(activeWifiDevId);
  const curApId = clientDev ? clientDev.wifi.connectedApId : null;

  wifiScannedList.innerHTML = networks.map(net => {
    const isConnected = (net.apId === curApId);
    const lockIcon = net.security === 'open' ? '🔓 Ochiq' : '🔒 ' + net.security.toUpperCase();
    return `
      <div class="wifi-net-item">
        <div class="wifi-net-info">
          <div class="wifi-net-title">
            <span>${net.ssid}</span>
            <span style="font-size:9.5px; padding:1px 5px; border-radius:3px; background:rgba(56,189,248,0.15); color:#38BDF8;">${net.band}</span>
            ${isConnected ? '<span style="font-size:9.5px; padding:1px 5px; border-radius:3px; background:rgba(0,255,135,0.15); color:#00FF87;">Ulangan</span>' : ''}
          </div>
          <div class="wifi-net-meta">
            <span>${lockIcon}</span>
            <span>Masofa: ${net.dist}m</span>
            <span>${net.rssi} dBm</span>
            ${renderSignalBarsHtml(net.bars)}
          </div>
        </div>
        <div>
          ${isConnected ? `
            <button class="actbtn warn" style="font-size:10px; padding:3px 8px;" onclick="window.disconnectWifiClient('${activeWifiDevId}')">Uzish</button>
          ` : `
            <button class="actbtn on" style="font-size:10px; padding:3px 10px; background:#38BDF8; color:#03140A; border-color:#38BDF8; font-weight:700;" onclick="window.promptWifiConnect('${net.apId}', '${escapeHtml(net.ssid)}', '${net.security}')">Ulanish</button>
          `}
        </div>
      </div>
    `;
  }).join('');
}

function scanWifiNetworks(clientDevId){
  const client = devices.get(clientDevId);
  if(!client) return [];
  const list = [];
  devices.forEach(ap => {
    if(ap.id === clientDevId) return;
    if(ap.wifi && ap.wifi.enabled && (ap.wifi.isAp || ap.wifi.hotspotMode)){
      const dist = getWifiDistance(clientDevId, ap.id);
      const maxR = (ap.wifi.radius || 10) * 1.15;
      const inRange = (dist <= maxR);
      const rssi = calcRssi(dist);
      const bars = getSignalBars(rssi);
      list.push({
        apId: ap.id,
        name: ap.name,
        ssid: ap.wifi.ssid,
        security: ap.wifi.security,
        band: ap.wifi.band,
        dist: dist.toFixed(1),
        inRange,
        rssi,
        bars
      });
    }
  });
  return list;
}

window.promptWifiConnect = function(apId, ssid, security){
  pendingConnectApId = apId;
  if(wifiTargetSsid) wifiTargetSsid.textContent = ssid;
  if(wifiTargetPassInput) wifiTargetPassInput.value = '';
  if(security === 'open'){
    connectWifi(activeWifiDevId, apId, '');
  } else {
    if(wifiConnectPromptCard){
      wifiConnectPromptCard.style.display = 'flex';
      if(wifiTargetPassInput) wifiTargetPassInput.focus();
    }
  }
};

window.disconnectWifiClient = function(devId){
  disconnectWifi(devId);
};

function connectWifi(clientDevId, apId, inputPassword){
  const client = devices.get(clientDevId);
  const ap = devices.get(apId);
  if(!client || !ap) return false;

  if(!client.wifi.hasAdapter){
    toast("Qurilmada Wi-Fi adapteri yo‘q!");
    return false;
  }

  const dist = getWifiDistance(clientDevId, apId);
  const maxR = (ap.wifi.radius || 10) * 1.15;
  if(dist > maxR){
    toast("⚠️ Signal juda zaif! Qurilma Wi-Fi qamrov doirasidan tashqarida.");
    return false;
  }

  if(ap.wifi.security !== 'open' && (inputPassword || '').trim() !== (ap.wifi.password || '').trim()){
    toast("❌ Parol noto‘g‘ri! Qayta urinib ko‘ring.");
    return false;
  }

  let portClient = client.ports.find(p => p.type === 'wireless' || p.id === 'WLAN0');
  if(!portClient){
    portClient = { id: 'WLAN0', name: 'Wi-Fi (WLAN0)', type: 'wireless', connectedTo: null };
    client.ports.push(portClient);
  }

  let portAp = ap.ports.find(p => p.type === 'wireless' || p.id === 'WLAN0');
  if(!portAp){
    portAp = { id: 'WLAN0', name: 'Wi-Fi AP (WLAN0)', type: 'wireless', connectedTo: null };
    ap.ports.push(portAp);
  }

  const oldConn = getConnectionBetween(clientDevId, apId);
  if(oldConn) removeConnection(oldConn.id);

  addConnection(clientDevId, apId, {
    portA: portClient.id,
    portB: portAp.id,
    cableType: 'wireless'
  });

  client.wifi.connectedApId = apId;
  client.wifi.connectedSsid = ap.wifi.ssid;
  client.wifi.signalRssi = calcRssi(dist);

  if(client.type !== 'router'){
    client.ipMode = 'dhcp';
    client.ip = nextIP();
    client.mask = '255.255.255.0';
    client.gw = ap.ip;
    if(client.label) client.label.querySelector('.ip').textContent = client.ip;
  }

  if(!ap.wifi.connectedClients) ap.wifi.connectedClients = [];
  if(!ap.wifi.connectedClients.some(c => c.devId === clientDevId)){
    ap.wifi.connectedClients.push({
      devId: clientDevId,
      name: client.name,
      ip: client.ip,
      mac: client.mac,
      rssi: client.wifi.signalRssi
    });
  }

  toast(`📶 ${client.name} "${ap.wifi.ssid}" tarmog‘iga muvaffaqiyatli ulandi!`);
  if(typeof refreshPanel === 'function') refreshPanel();
  renderWifiModalContent();
  if(wifiConnectPromptCard) wifiConnectPromptCard.style.display = 'none';
  return true;
}

function disconnectWifi(clientDevId){
  const client = devices.get(clientDevId);
  if(!client || !client.wifi.connectedApId) return;

  const apId = client.wifi.connectedApId;
  const ap = devices.get(apId);

  const c = getConnectionBetween(clientDevId, apId);
  if(c) removeConnection(c.id);

  client.wifi.connectedApId = null;
  client.wifi.connectedSsid = null;

  if(ap && ap.wifi && ap.wifi.connectedClients){
    ap.wifi.connectedClients = ap.wifi.connectedClients.filter(cl => cl.devId !== clientDevId);
  }

  toast(`📶 Wi-Fi aloqasi uzildi: ${client.name}`);
  if(typeof refreshPanel === 'function') refreshPanel();
  renderWifiModalContent();
}

function toggleHotspot(devId){
  const dev = devices.get(devId);
  if(!dev) return;

  dev.wifi.hotspotMode = !dev.wifi.hotspotMode;
  dev.wifi.isAp = dev.wifi.hotspotMode;

  if(dev.wifi.hotspotMode){
    dev.wifi.ssid = `${dev.name.replace(/\s+/g, '_')}_Direct`;
    dev.wifi.password = '12345678';
    dev.wifi.radius = 7;
    dev.wifi.enabled = true;
    toast(`🔥 ${dev.name} da Shaxsiy Hotspot / Wi-Fi Direct yoqildi (${dev.wifi.ssid})`);
  } else {
    toast(`Hotspot o‘chirildi: ${dev.name}`);
  }
  if(typeof refreshPanel === 'function') refreshPanel();
  renderWifiModalContent();
}

function addWifiAdapter(devId){
  const dev = devices.get(devId);
  if(!dev) return;
  if(!dev.wifi) initDeviceWifi(dev);
  dev.wifi.hasAdapter = true;
  dev.wifi.adapterEnabled = true;
  if(!dev.ports.some(p => p.id === 'WLAN0')){
    dev.ports.push({ id: 'WLAN0', name: 'Wi-Fi 6 (PCIe WLAN0)', type: 'wireless', connectedTo: null });
  }
  toast(`📶 ${dev.name} ga Wi-Fi adapter (WLAN0) muvaffaqiyatli o‘rnatildi!`);
  if(typeof refreshPanel === 'function') refreshPanel();
  openWifiModal(devId);
}

// Wi-Fi Modal Event Handlers
if(wifiModalClose) wifiModalClose.addEventListener('click', closeWifiModal);
if(wifiModalDoneBtn) wifiModalDoneBtn.addEventListener('click', closeWifiModal);

if(wifiDevSelect){
  wifiDevSelect.addEventListener('change', ()=>{
    activeWifiDevId = wifiDevSelect.value;
    renderWifiModalContent();
  });
}

// AP Inputs
if(wifiApRadioSwitch){
  wifiApRadioSwitch.addEventListener('change', ()=>{
    const dev = devices.get(activeWifiDevId);
    if(!dev) return;
    dev.wifi.enabled = wifiApRadioSwitch.checked;
    renderWifiModalContent();
    if(typeof refreshPanel === 'function') refreshPanel();
    toast(`Wi-Fi Radiosi ${dev.wifi.enabled ? 'yoqildi' : 'o‘chirildi'}`);
  });
}

if(wifiApSsidInput){
  wifiApSsidInput.addEventListener('change', ()=>{
    const dev = devices.get(activeWifiDevId);
    if(dev){
      dev.wifi.ssid = wifiApSsidInput.value.trim() || dev.wifi.ssid;
      toast(`SSID yangilandi: ${dev.wifi.ssid}`);
      if(typeof refreshPanel === 'function') refreshPanel();
    }
  });
}

if(wifiApSecuritySelect){
  wifiApSecuritySelect.addEventListener('change', ()=>{
    const dev = devices.get(activeWifiDevId);
    if(dev){
      dev.wifi.security = wifiApSecuritySelect.value;
      if(wifiApPassRow) wifiApPassRow.style.display = (dev.wifi.security === 'open') ? 'none' : 'flex';
      toast(`Xavfsizlik turi: ${dev.wifi.security.toUpperCase()}`);
    }
  });
}

if(wifiApPassInput){
  wifiApPassInput.addEventListener('change', ()=>{
    const dev = devices.get(activeWifiDevId);
    if(dev){
      dev.wifi.password = wifiApPassInput.value.trim();
      toast("Wi-Fi paroli saqlandi");
    }
  });
}

if(wifiBandTabs){
  wifiBandTabs.querySelectorAll('.proto-btn').forEach(btn => {
    btn.addEventListener('click', ()=>{
      wifiBandTabs.querySelectorAll('.proto-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const dev = devices.get(activeWifiDevId);
      if(dev){
        dev.wifi.band = btn.dataset.band;
        toast(`Chastota: ${dev.wifi.band}`);
      }
    });
  });
}

if(wifiTxTabs){
  wifiTxTabs.querySelectorAll('.proto-btn').forEach(btn => {
    btn.addEventListener('click', ()=>{
      wifiTxTabs.querySelectorAll('.proto-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const dev = devices.get(activeWifiDevId);
      if(dev){
        dev.wifi.txPower = parseInt(btn.dataset.tx);
        dev.wifi.radius = (dev.wifi.txPower === 25 ? 4 : dev.wifi.txPower === 50 ? 7 : 11);
        toast(`Signal quvvati: ${dev.wifi.txPower}% (Radius: ${dev.wifi.radius}m)`);
      }
    });
  });
}

// Client Handlers
if(wifiClientScanBtn){
  wifiClientScanBtn.addEventListener('click', ()=>{
    renderScannedNetworks();
    toast("Wi-Fi tarmoqlari yangilandi 🔄");
  });
}

if(wifiToggleHotspotBtn){
  wifiToggleHotspotBtn.addEventListener('click', ()=>{
    toggleHotspot(activeWifiDevId);
  });
}

if(wifiDisconnectBtn){
  wifiDisconnectBtn.addEventListener('click', ()=>{
    disconnectWifi(activeWifiDevId);
  });
}

if(wifiConfirmConnectBtn){
  wifiConfirmConnectBtn.addEventListener('click', ()=>{
    if(!pendingConnectApId) return;
    const pass = wifiTargetPassInput ? wifiTargetPassInput.value : '';
    connectWifi(activeWifiDevId, pendingConnectApId, pass);
  });
}

if(wifiCancelPromptBtn){
  wifiCancelPromptBtn.addEventListener('click', ()=>{
    if(wifiConnectPromptCard) wifiConnectPromptCard.style.display = 'none';
  });
}

function updateWifiPulses(dt){
  wifiPulses.forEach(w=>{ w.t += dt; });
  for(let i = wifiPulses.length - 1; i >= 0; i--){
    const w = wifiPulses[i];
    const k = w.t / 1.6;
    if(k >= 1){
      scene.remove(w.mesh);
      w.mesh.geometry.dispose();
      wifiPulses.splice(i, 1);
      continue;
    }
    w.mesh.scale.setScalar(0.3 + k * 2.2);
    w.mesh.material.opacity = 0.5 * (1 - k);
  }
}

let wifiSpawnTimer = 0;
function spawnWifiPulses(dt){
  wifiSpawnTimer += dt;
  if(wifiSpawnTimer < 1.6) return;
  wifiSpawnTimer = 0;
  devices.forEach(rec=>{
    if(rec.type !== "router") return;
    const hasWireless = [...connections.values()].some(c => (c.a === rec.id || c.b === rec.id) && c.wireless);
    if(!hasWireless) return;
    const geo = new THREE.RingGeometry(0.35, 0.42, 32);
    const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: 0x4FC7E8, transparent: true, opacity: 0.5, side: THREE.DoubleSide }));
    m.rotation.x = -Math.PI / 2;
    m.position.set(rec.group.position.x, 0.05, rec.group.position.z);
    scene.add(m);
    wifiPulses.push({ mesh: m, t: 0 });
  });
}
