/* ==========================================================================
   TOPOLOGY TEMPLATES & SEED NETWORK GENERATION
   Includes Multi-Room Visual Partitions, Advanced VLAN, Data Center & Brand Models
   ========================================================================== */

/* --------------------------------------------------------------------------
   3D ROOM PARTITIONS & FLOOR ZONES ENGINE
   -------------------------------------------------------------------------- */
function clearRoomPartitions(){
  if(typeof clearAllRooms === 'function'){
    clearAllRooms();
  }
}

function createRoomPartition(cx, cz, width, depth, labelText, colorHex = '#38BDF8', vlanTag = ''){
  if(typeof addCustomRoom === 'function'){
    let vlanId = null;
    const m = (vlanTag || '').match(/VLAN\s*(\d+)/i);
    if(m) vlanId = parseInt(m[1]);

    const r = addCustomRoom({
      name: labelText,
      x: cx,
      z: cz,
      width: width,
      depth: depth,
      color: colorHex,
      vlanId: vlanId,
      select: false,
      silent: true
    });
    return r ? r.group : null;
  }
}

function clearAllNetwork(){
  clearRoomPartitions();
  // Snapshot keys first to avoid iterating a mutating Map
  const ids = [...devices.keys()];
  ids.forEach(id => removeDevice(id));
}

/* Helper to set device properties and UI label.
   Returns null if addDevice failed (e.g. device limit reached). */
function setupDevice(type, model, name, pos, ip = '', gw = ''){
  const dev = addDevice(type, model);
  if(!dev) return null; // addDevice can return null/undefined when limit is hit
  dev.name = name;
  if(ip) dev.ip = ip;
  if(gw) dev.gw = gw;
  if(dev.label){
    const nmEl = dev.label.querySelector('.nm');
    if(nmEl) nmEl.textContent = name;
    const ipEl = dev.label.querySelector('.ip');
    if(ipEl && ip) ipEl.textContent = ip;
  }
  if(dev.group && pos){
    dev.group.position.set(pos[0], pos[1] || 0, pos[2]);
  }
  return dev;
}

/* --------------------------------------------------------------------------
   TOPOLOGY LOADER MAIN DISPATCHER
   -------------------------------------------------------------------------- */
function loadTopology(type){
  clearAllNetwork();

  /* =========================================================================
     1. KO'P XONALI (MULTI-ROOM) TOPOLOGIYALAR
     ========================================================================= */

  if(type === 'multi_room_office'){
    // 🏢 4 Xonali Korporativ Ofis (Multi-Room Enterprise)
    // Xona 1: Rahbariyat (VLAN 10)
    createRoomPartition(-4.6, -3.4, 7.2, 5.4, "🏢 XONA 1: RAHBARIYAT", "#A78BFA", "VLAN 10: RAHBAR (192.168.10.0/24)");
    const devImac = setupDevice('desktop', 'apple_imac_24', 'Apple iMac 24" M3', [-6.0, 0, -4.2], '192.168.10.10', '192.168.10.1');
    const devMacbook = setupDevice('laptop', 'apple_macbook_pro_16', 'MacBook Pro 16" M3', [-3.6, 0, -4.2], '192.168.10.11', '192.168.10.1');
    const devPhone1 = setupDevice('phone', 'cisco_ip_phone_8845', 'Cisco 8845 IP Phone', [-4.8, 0, -2.4], '192.168.10.15', '192.168.10.1');

    // Xona 2: Buxgalteriya & Moliya (VLAN 20)
    createRoomPartition(4.6, -3.4, 7.2, 5.4, "💼 XONA 2: BUXGALTERIYA", "#F472B6", "VLAN 20: MOLIYA (192.168.20.0/24)");
    const devOptiplex = setupDevice('desktop', 'dell_optiplex_7090', 'Dell OptiPlex 7090', [3.6, 0, -4.2], '192.168.20.10', '192.168.20.1');
    const devHpLap = setupDevice('laptop', 'hp_elitebook_840', 'HP EliteBook 840', [6.0, 0, -4.2], '192.168.20.11', '192.168.20.1');
    const devPrinter = setupDevice('printer', 'hp_laserjet_m528', 'HP LaserJet Enterprise', [4.8, 0, -2.4], '192.168.20.25', '192.168.20.1');

    // Xona 3: IT & Dasturchilar (VLAN 30)
    createRoomPartition(-4.6, 3.4, 7.2, 5.4, "💻 XONA 3: IT & DASTURCHILAR", "#38BDF8", "VLAN 30: IT_DEV (192.168.30.0/24)");
    const devOdyssey = setupDevice('desktop', 'samsung_odyssey_g9', 'Samsung Odyssey G9 PC', [-6.0, 0, 4.2], '192.168.30.10', '192.168.30.1');
    const devPredator = setupDevice('desktop', 'acer_predator_orion', 'Acer Predator Orion', [-3.6, 0, 4.2], '192.168.30.11', '192.168.30.1');
    const devThinkpad = setupDevice('laptop', 'lenovo_thinkpad_x1', 'ThinkPad X1 Carbon', [-4.8, 0, 2.4], '192.168.30.12', '192.168.30.1');

    // Xona 4: Markaziy Serverxona (VLAN 99 / Trunk)
    createRoomPartition(4.6, 3.4, 7.2, 5.4, "🛡️ XONA 4: SERVERXONA", "#FBBF24", "VLAN 99: SERVER & MGMT (192.168.99.0/24)");
    const swCore = setupDevice('switch', 'cisco_catalyst_9300', 'Cisco Catalyst 9300 Core', [4.6, 0, 2.4]);
    const rtrCore = setupDevice('router', 'cisco_isr_4451', 'Cisco ISR 4451 (RoaS)', [4.6, 0, 4.4], '192.168.99.1');
    const devServer = setupDevice('server', 'dell_poweredge_r750', 'Dell PowerEdge R750', [3.2, 0, 4.4], '192.168.99.10', '192.168.99.1');
    const devNas = setupDevice('server', 'synology_ds923_plus', 'Synology DS923+ NAS', [6.0, 0, 4.4], '192.168.99.20', '192.168.99.1');

    // VLAN & 802.1Q Konfiguratsiyasi
    if(typeof initSwitchVlans === 'function'){
      initSwitchVlans(swCore);
      addVlan(swCore, 10, 'RAHBAR', '#A78BFA');
      addVlan(swCore, 20, 'MOLIYA', '#F472B6');
      addVlan(swCore, 30, 'IT_DEV', '#38BDF8');
      addVlan(swCore, 99, 'SERVER', '#FBBF24');
    }

    if(typeof addRouterSubinterface === 'function'){
      addRouterSubinterface(rtrCore, 'GigabitEthernet0/0', '10', 10, '192.168.10.1', '255.255.255.0');
      addRouterSubinterface(rtrCore, 'GigabitEthernet0/0', '20', 20, '192.168.20.1', '255.255.255.0');
      addRouterSubinterface(rtrCore, 'GigabitEthernet0/0', '30', 30, '192.168.30.1', '255.255.255.0');
      addRouterSubinterface(rtrCore, 'GigabitEthernet0/0', '99', 99, '192.168.99.1', '255.255.255.0');
    }

    // Switch ↔ Router 802.1Q Trunk
    if(swCore && rtrCore) addConnection(swCore.id, rtrCore.id, { portA: 'Gi0/1', portB: 'Gi0/0', cableType: 'fiber_single' });
    if(typeof setPortMode === 'function' && swCore) setPortMode(swCore, 'Gi0/1', 'trunk');

    // Serverxona ulanishlari (VLAN 99)
    if(swCore && devServer) addConnection(swCore.id, devServer.id, { portA: 'Fa0/23', cableType: 'fiber' });
    if(typeof setPortVlan === 'function' && swCore) setPortVlan(swCore, 'Fa0/23', 99);
    if(swCore && devNas) addConnection(swCore.id, devNas.id, { portA: 'Fa0/24', cableType: 'cat6' });
    if(typeof setPortVlan === 'function' && swCore) setPortVlan(swCore, 'Fa0/24', 99);

    // Xona 1 ulanishlari (VLAN 10)
    if(swCore && devImac) addConnection(swCore.id, devImac.id, { portA: 'Fa0/1', cableType: 'cat6' });
    if(typeof setPortVlan === 'function' && swCore) setPortVlan(swCore, 'Fa0/1', 10);
    if(swCore && devMacbook) addConnection(swCore.id, devMacbook.id, { portA: 'Fa0/2', cableType: 'cat6' });
    if(typeof setPortVlan === 'function' && swCore) setPortVlan(swCore, 'Fa0/2', 10);
    if(swCore && devPhone1) addConnection(swCore.id, devPhone1.id, { portA: 'Fa0/3', cableType: 'cat6' });
    if(typeof setPortVlan === 'function' && swCore) setPortVlan(swCore, 'Fa0/3', 10);

    // Xona 2 ulanishlari (VLAN 20)
    if(swCore && devOptiplex) addConnection(swCore.id, devOptiplex.id, { portA: 'Fa0/5', cableType: 'cat6' });
    if(typeof setPortVlan === 'function' && swCore) setPortVlan(swCore, 'Fa0/5', 20);
    if(swCore && devHpLap) addConnection(swCore.id, devHpLap.id, { portA: 'Fa0/6', cableType: 'cat6' });
    if(typeof setPortVlan === 'function' && swCore) setPortVlan(swCore, 'Fa0/6', 20);
    if(swCore && devPrinter) addConnection(swCore.id, devPrinter.id, { portA: 'Fa0/7', cableType: 'cat6' });
    if(typeof setPortVlan === 'function' && swCore) setPortVlan(swCore, 'Fa0/7', 20);

    // Xona 3 ulanishlari (VLAN 30)
    if(swCore && devOdyssey) addConnection(swCore.id, devOdyssey.id, { portA: 'Fa0/9', cableType: 'cat6' });
    if(typeof setPortVlan === 'function' && swCore) setPortVlan(swCore, 'Fa0/9', 30);
    if(swCore && devPredator) addConnection(swCore.id, devPredator.id, { portA: 'Fa0/10', cableType: 'cat6' });
    if(typeof setPortVlan === 'function' && swCore) setPortVlan(swCore, 'Fa0/10', 30);
    if(swCore && devThinkpad) addConnection(swCore.id, devThinkpad.id, { portA: 'Fa0/11', cableType: 'cat6' });
    if(typeof setPortVlan === 'function' && swCore) setPortVlan(swCore, 'Fa0/11', 30);

    if(typeof toggleVlanView === 'function') toggleVlanView(true);
    if(typeof camRadius !== 'undefined'){
      camRadius = 22;
      if(typeof updateCamera === 'function') updateCamera();
    }
    toast("🏢 4 Xonali Korporativ Ofis yuklandi: 3D zonalar, 4 ta alohida VLAN va 802.1Q RoaS");
  }
  else if(type === 'multi_room_campus'){
    // 🏫 3 Xonali Universitet / O'quv Markazi Campus
    // 1-Xona: Kompyuter Laboratoriyasi (VLAN 10)
    createRoomPartition(-5.5, 0, 6.8, 8.8, "🔬 1-XONA: KOMPYUTER LAB", "#38BDF8", "VLAN 10: TALABALAR (192.168.10.0/24)");
    const swLab = setupDevice('switch', 'cisco_catalyst_2960x', 'Lab Switch (Access)', [-5.5, 0, -2.8]);
    const pcL1 = setupDevice('desktop', 'acer_predator_orion', 'Talaba PC-1', [-7.0, 0, 0.4], '192.168.10.11', '192.168.10.1');
    const pcL2 = setupDevice('desktop', 'dell_optiplex_7090', 'Talaba PC-2', [-4.0, 0, 0.4], '192.168.10.12', '192.168.10.1');
    const pcL3 = setupDevice('desktop', 'acer_predator_helios', 'Talaba PC-3', [-7.0, 0, 2.8], '192.168.10.13', '192.168.10.1');
    const pcL4 = setupDevice('desktop', 'samsung_odyssey_g9', 'Talaba PC-4', [-4.0, 0, 2.8], '192.168.10.14', '192.168.10.1');

    // 2-Xona: O'qituvchilar Xonasi (VLAN 20)
    createRoomPartition(0, -3.2, 4.8, 5.6, "📚 2-XONA: O'QITUVCHILAR", "#F472B6", "VLAN 20: USTOZLAR (192.168.20.0/24)");
    const lapT1 = setupDevice('laptop', 'apple_macbook_pro_16', 'Ustoz MacBook M3', [-1.2, 0, -3.6], '192.168.20.10', '192.168.20.1');
    const lapT2 = setupDevice('laptop', 'lenovo_thinkpad_x1', 'Ustoz ThinkPad X1', [1.2, 0, -3.6], '192.168.20.11', '192.168.20.1');
    const prnT = setupDevice('printer', 'hp_laserjet_m528', 'Ustozlar Printeri', [0, 0, -1.8], '192.168.20.25', '192.168.20.1');

    // 3-Xona: Ma'muriyat & Server (VLAN 30)
    createRoomPartition(5.5, 0, 6.8, 8.8, "🏛️ 3-XONA: DEKANAT & SERVER", "#6FE3C4", "VLAN 30: SERVER & ADMIN (192.168.30.0/24)");
    const swCore = setupDevice('switch', 'cisco_catalyst_9300', 'Campus Core Switch', [5.5, 0, -2.8]);
    const rtrCore = setupDevice('router', 'cisco_isr_4451', 'Campus Router (RoaS)', [5.5, 0, 3.2], '192.168.30.1');
    const srvUni = setupDevice('server', 'dell_poweredge_r750', 'Universitet Serveri', [7.0, 0, 0.4], '192.168.30.10', '192.168.30.1');
    const pcDekan = setupDevice('desktop', 'apple_imac_24', 'Dekan iMac 24"', [4.0, 0, 0.4], '192.168.30.15', '192.168.30.1');

    // VLAN & Trunk konfiguratsiyasi
    if(typeof initSwitchVlans === 'function'){
      initSwitchVlans(swLab);
      initSwitchVlans(swCore);
      addVlan(swLab, 10, 'TALABALAR', '#38BDF8');
      addVlan(swLab, 20, 'USTOZLAR', '#F472B6');
      addVlan(swCore, 10, 'TALABALAR', '#38BDF8');
      addVlan(swCore, 20, 'USTOZLAR', '#F472B6');
      addVlan(swCore, 30, 'ADMIN_SRV', '#6FE3C4');
    }

    if(typeof addRouterSubinterface === 'function'){
      addRouterSubinterface(rtrCore, 'GigabitEthernet0/0', '10', 10, '192.168.10.1', '255.255.255.0');
      addRouterSubinterface(rtrCore, 'GigabitEthernet0/0', '20', 20, '192.168.20.1', '255.255.255.0');
      addRouterSubinterface(rtrCore, 'GigabitEthernet0/0', '30', 30, '192.168.30.1', '255.255.255.0');
    }

    // Switch Lab ↔ Switch Core 802.1Q Trunk aloqasi
    addConnection(swLab.id, swCore.id, { portA: 'Gi0/1', portB: 'Gi0/1', cableType: 'fiber' });
    if(typeof setPortMode === 'function'){
      setPortMode(swLab, 'Gi0/1', 'trunk');
      setPortMode(swCore, 'Gi0/1', 'trunk');
    }

    // Switch Core ↔ Router RoaS Trunk
    addConnection(swCore.id, rtrCore.id, { portA: 'Gi0/2', portB: 'Gi0/0', cableType: 'fiber_single' });
    if(typeof setPortMode === 'function') setPortMode(swCore, 'Gi0/2', 'trunk');

    // Lab Switch portlari (VLAN 10)
    addConnection(swLab.id, pcL1.id, { portA: 'Fa0/1', cableType: 'cat6' });
    if(typeof setPortVlan === 'function') setPortVlan(swLab, 'Fa0/1', 10);
    addConnection(swLab.id, pcL2.id, { portA: 'Fa0/2', cableType: 'cat6' });
    if(typeof setPortVlan === 'function') setPortVlan(swLab, 'Fa0/2', 10);
    addConnection(swLab.id, pcL3.id, { portA: 'Fa0/3', cableType: 'cat6' });
    if(typeof setPortVlan === 'function') setPortVlan(swLab, 'Fa0/3', 10);
    addConnection(swLab.id, pcL4.id, { portA: 'Fa0/4', cableType: 'cat6' });
    if(typeof setPortVlan === 'function') setPortVlan(swLab, 'Fa0/4', 10);

    // O'qituvchilar xonasi ulanishlari (Switch Core Fa0/5,6,7 -> VLAN 20)
    addConnection(swCore.id, lapT1.id, { portA: 'Fa0/5', cableType: 'cat6' });
    if(typeof setPortVlan === 'function') setPortVlan(swCore, 'Fa0/5', 20);
    addConnection(swCore.id, lapT2.id, { portA: 'Fa0/6', cableType: 'cat6' });
    if(typeof setPortVlan === 'function') setPortVlan(swCore, 'Fa0/6', 20);
    addConnection(swCore.id, prnT.id, { portA: 'Fa0/7', cableType: 'cat6' });
    if(typeof setPortVlan === 'function') setPortVlan(swCore, 'Fa0/7', 20);

    // Dekanat & Server (Switch Core Fa0/9, 10 -> VLAN 30)
    addConnection(swCore.id, srvUni.id, { portA: 'Fa0/9', cableType: 'fiber' });
    if(typeof setPortVlan === 'function') setPortVlan(swCore, 'Fa0/9', 30);
    addConnection(swCore.id, pcDekan.id, { portA: 'Fa0/10', cableType: 'cat6' });
    if(typeof setPortVlan === 'function') setPortVlan(swCore, 'Fa0/10', 30);

    if(typeof toggleVlanView === 'function') toggleVlanView(true);
    if(typeof camRadius !== 'undefined'){
      camRadius = 22;
      if(typeof updateCamera === 'function') updateCamera();
    }
    toast("🏫 3 Xonali Universitet Campus yuklandi: Lab, O'qituvchilar va Dekanat zonalari");
  }

  /* =========================================================================
     2. ILG'OR VLAN & ROUTING ARXITEKTURALARI
     ========================================================================= */

  else if(type === 'vlan_svi_l3'){
    // ⚡ L3 Switch Inter-VLAN Routing (SVI — Switch Virtual Interface)
    const swL3 = setupDevice('switch', 'cisco_catalyst_9300', 'Cisco 9300 (Layer 3 Switch)', [0, 0, 0]);

    if(typeof initSwitchVlans === 'function'){
      initSwitchVlans(swL3);
      addVlan(swL3, 10, 'TALABALAR', '#38BDF8');
      addVlan(swL3, 20, 'XODIMLAR', '#F472B6');
      addVlan(swL3, 30, 'SERVERLAR', '#FBBF24');
    }

    // VLAN 10 (Talabalar)
    const pc1 = setupDevice('desktop', 'acer_predator_orion', 'Talaba PC-1', [-3.8, 0, -2.6], '192.168.10.10', '192.168.10.1');
    const pc2 = setupDevice('desktop', 'dell_optiplex_7090', 'Talaba PC-2', [-1.4, 0, -2.6], '192.168.10.11', '192.168.10.1');
    addConnection(swL3.id, pc1.id, { portA: 'Fa0/1', cableType: 'cat6' });
    if(typeof setPortVlan === 'function') setPortVlan(swL3, 'Fa0/1', 10);
    addConnection(swL3.id, pc2.id, { portA: 'Fa0/2', cableType: 'cat6' });
    if(typeof setPortVlan === 'function') setPortVlan(swL3, 'Fa0/2', 10);

    // VLAN 20 (Xodimlar)
    const lap1 = setupDevice('laptop', 'apple_macbook_pro_16', 'Xodim MacBook M3', [1.4, 0, -2.6], '192.168.20.10', '192.168.20.1');
    const lap2 = setupDevice('laptop', 'lenovo_thinkpad_x1', 'Xodim ThinkPad X1', [3.8, 0, -2.6], '192.168.20.11', '192.168.20.1');
    addConnection(swL3.id, lap1.id, { portA: 'Fa0/5', cableType: 'cat6' });
    if(typeof setPortVlan === 'function') setPortVlan(swL3, 'Fa0/5', 20);
    addConnection(swL3.id, lap2.id, { portA: 'Fa0/6', cableType: 'cat6' });
    if(typeof setPortVlan === 'function') setPortVlan(swL3, 'Fa0/6', 20);

    // VLAN 30 (Serverlar)
    const srv = setupDevice('server', 'dell_poweredge_r750', 'App Server R750', [-2.4, 0, 2.8], '192.168.30.10', '192.168.30.1');
    const nas = setupDevice('server', 'synology_ds923_plus', 'Synology NAS', [2.4, 0, 2.8], '192.168.30.20', '192.168.30.1');
    addConnection(swL3.id, srv.id, { portA: 'Fa0/9', cableType: 'fiber' });
    if(typeof setPortVlan === 'function') setPortVlan(swL3, 'Fa0/9', 30);
    addConnection(swL3.id, nas.id, { portA: 'Fa0/10', cableType: 'cat6' });
    if(typeof setPortVlan === 'function') setPortVlan(swL3, 'Fa0/10', 30);

    if(typeof toggleVlanView === 'function') toggleVlanView(true);
    toast("⚡ L3 Switch Inter-VLAN Routing (SVI) yuklandi: Router kerak emas, apparat tezligida routing");
  }
  else if(type === 'vlan_voice_data'){
    // ☎️ Voice & Data VLAN (Cisco IP Phone + PC Daisy-Chain)
    const sw = setupDevice('switch', 'cisco_catalyst_9300', 'Cisco Catalyst 9300 (PoE+)', [0, 0, -1.8]);
    const rtr = setupDevice('router', 'cisco_isr_4451', 'Voice Gateway Router', [0, 0, -4.2], '192.168.10.1');

    if(typeof initSwitchVlans === 'function'){
      initSwitchVlans(sw);
      addVlan(sw, 10, 'DATA', '#38BDF8');
      addVlan(sw, 100, 'VOICE', '#F472B6');
    }

    if(typeof addRouterSubinterface === 'function'){
      addRouterSubinterface(rtr, 'GigabitEthernet0/0', '10', 10, '192.168.10.1', '255.255.255.0');
      addRouterSubinterface(rtr, 'GigabitEthernet0/0', '100', 100, '192.168.100.1', '255.255.255.0');
    }

    // Switch ↔ Router Trunk
    addConnection(sw.id, rtr.id, { portA: 'Gi0/1', portB: 'Gi0/0', cableType: 'fiber_single' });
    if(typeof setPortMode === 'function') setPortMode(sw, 'Gi0/1', 'trunk');

    // 1-Ishchi o'rni: Cisco Phone 8845 + Apple iMac (Fa0/1)
    const ph1 = setupDevice('phone', 'cisco_ip_phone_8845', 'Cisco 8845 IP Phone (Voice VLAN 100)', [-3.2, 0, 0.8], '192.168.100.10', '192.168.100.1');
    const pc1 = setupDevice('desktop', 'apple_imac_24', 'Apple iMac (Data VLAN 10)', [-3.2, 0, 3.4], '192.168.10.10', '192.168.10.1');
    addConnection(sw.id, ph1.id, { portA: 'Fa0/1', cableType: 'cat6' });
    addConnection(ph1.id, pc1.id, { cableType: 'cat6' });
    if(typeof setPortVlan === 'function') setPortVlan(sw, 'Fa0/1', 10);

    // 2-Ishchi o'rni: Cisco Phone 8845 + Dell OptiPlex (Fa0/2)
    const ph2 = setupDevice('phone', 'cisco_ip_phone_8845', 'Cisco 8845 IP Phone 2 (Voice VLAN 100)', [3.2, 0, 0.8], '192.168.100.11', '192.168.100.1');
    const pc2 = setupDevice('desktop', 'dell_optiplex_7090', 'Dell OptiPlex (Data VLAN 10)', [3.2, 0, 3.4], '192.168.10.11', '192.168.10.1');
    addConnection(sw.id, ph2.id, { portA: 'Fa0/2', cableType: 'cat6' });
    addConnection(ph2.id, pc2.id, { cableType: 'cat6' });
    if(typeof setPortVlan === 'function') setPortVlan(sw, 'Fa0/2', 10);

    if(typeof toggleVlanView === 'function') toggleVlanView(true);
    toast("☎️ Voice & Data VLAN yuklandi: Bitta portda ham kompyuter (Data 10), ham IP Telefon (Voice 100)");
  }
  else if(type === 'vlan_3building'){
    // 🌐 3-Binoli Korporativ 802.1Q Campus Trunk
    createRoomPartition(0, -3.8, 6.0, 4.8, "🏢 BINO A: BOSH OFIS (HQ)", "#A78BFA");
    const swA = setupDevice('switch', 'cisco_catalyst_9300', 'Bino A Core Switch', [0, 0, -4.4]);
    const srvA = setupDevice('server', 'dell_poweredge_r750', 'HQ Data Server', [-1.8, 0, -3.0], '192.168.30.10');
    const pcA = setupDevice('desktop', 'apple_mac_studio', 'HQ Mac Studio M2', [1.8, 0, -3.0], '192.168.10.10');

    createRoomPartition(-4.6, 2.8, 5.8, 4.8, "🏭 BINO B: 1-FILIAL", "#38BDF8");
    const swB = setupDevice('switch', 'cisco_catalyst_2960x', 'Bino B Switch', [-4.6, 0, 1.8]);
    const pcB = setupDevice('laptop', 'lenovo_thinkpad_x1', 'Bino B ThinkPad', [-5.6, 0, 3.6], '192.168.10.11');
    const prnB = setupDevice('printer', 'hp_laserjet_m528', 'Bino B Printer', [-3.6, 0, 3.6], '192.168.20.20');

    createRoomPartition(4.6, 2.8, 5.8, 4.8, "🏬 BINO C: 2-FILIAL", "#F472B6");
    const swC = setupDevice('switch', 'cisco_catalyst_2960x', 'Bino C Switch', [4.6, 0, 1.8]);
    const pcC = setupDevice('desktop', 'samsung_odyssey_g9', 'Bino C Odyssey PC', [3.6, 0, 3.6], '192.168.10.12');
    const phC = setupDevice('phone', 'cisco_ip_phone_8845', 'Bino C IP Phone', [5.6, 0, 3.6], '192.168.20.10');

    if(typeof initSwitchVlans === 'function'){
      [swA, swB, swC].forEach(sw => {
        initSwitchVlans(sw);
        addVlan(sw, 10, 'TALABALAR', '#38BDF8');
        addVlan(sw, 20, 'USTOZLAR', '#F472B6');
        addVlan(sw, 30, 'SERVERLAR', '#FBBF24');
      });
    }

    // 802.1Q Optik Trunk magistrallari (A ↔ B, A ↔ C, B ↔ C)
    addConnection(swA.id, swB.id, { portA: 'Gi0/1', portB: 'Gi0/1', cableType: 'fiber' });
    addConnection(swA.id, swC.id, { portA: 'Gi0/2', portB: 'Gi0/1', cableType: 'fiber' });
    addConnection(swB.id, swC.id, { portA: 'Gi0/2', portB: 'Gi0/2', cableType: 'fiber' });

    if(typeof setPortMode === 'function'){
      setPortMode(swA, 'Gi0/1', 'trunk');
      setPortMode(swA, 'Gi0/2', 'trunk');
      setPortMode(swB, 'Gi0/1', 'trunk');
      setPortMode(swB, 'Gi0/2', 'trunk');
      setPortMode(swC, 'Gi0/1', 'trunk');
      setPortMode(swC, 'Gi0/2', 'trunk');
    }

    // Local port assignments
    addConnection(swA.id, srvA.id, { portA: 'Fa0/9', cableType: 'fiber' });
    if(typeof setPortVlan === 'function') setPortVlan(swA, 'Fa0/9', 30);
    addConnection(swA.id, pcA.id, { portA: 'Fa0/1', cableType: 'cat6' });
    if(typeof setPortVlan === 'function') setPortVlan(swA, 'Fa0/1', 10);

    addConnection(swB.id, pcB.id, { portA: 'Fa0/1', cableType: 'cat6' });
    if(typeof setPortVlan === 'function') setPortVlan(swB, 'Fa0/1', 10);
    addConnection(swB.id, prnB.id, { portA: 'Fa0/5', cableType: 'cat6' });
    if(typeof setPortVlan === 'function') setPortVlan(swB, 'Fa0/5', 20);

    addConnection(swC.id, pcC.id, { portA: 'Fa0/1', cableType: 'cat6' });
    if(typeof setPortVlan === 'function') setPortVlan(swC, 'Fa0/1', 10);
    addConnection(swC.id, phC.id, { portA: 'Fa0/5', cableType: 'cat6' });
    if(typeof setPortVlan === 'function') setPortVlan(swC, 'Fa0/5', 20);

    if(typeof toggleVlanView === 'function') toggleVlanView(true);
    toast("🌐 3-Binoli Korporativ Campus Trunk yuklandi: Bino A, B, C o'rtasida 802.1Q magistral");
  }
  else if(type === 'vlan_guest_isolation'){
    // 🛡️ Mehmonlar va Korporativ VLAN Izolatsiyasi
    const sw = setupDevice('switch', 'cisco_catalyst_9300', 'Cisco 9300 (Access Switch)', [0, 0, 0]);
    const rtr = setupDevice('router', 'cisco_isr_4451', 'Security Gateway', [0, 0, -3.6], '192.168.10.1');

    if(typeof initSwitchVlans === 'function'){
      initSwitchVlans(sw);
      addVlan(sw, 10, 'KORPORATIV', '#38BDF8');
      addVlan(sw, 50, 'MEHMON_GUEST', '#F87171');
    }

    if(typeof addRouterSubinterface === 'function'){
      addRouterSubinterface(rtr, 'GigabitEthernet0/0', '10', 10, '192.168.10.1', '255.255.255.0');
      addRouterSubinterface(rtr, 'GigabitEthernet0/0', '50', 50, '192.168.50.1', '255.255.255.0');
    }

    addConnection(sw.id, rtr.id, { portA: 'Gi0/1', portB: 'Gi0/0', cableType: 'fiber_single' });
    if(typeof setPortMode === 'function') setPortMode(sw, 'Gi0/1', 'trunk');

    // Korporativ VLAN 10
    const srv = setupDevice('server', 'dell_poweredge_r750', 'Lokal Korporativ Server', [-3.6, 0, 1.8], '192.168.10.10', '192.168.10.1');
    const pcCorp = setupDevice('desktop', 'dell_optiplex_7090', 'Boshqaruv PC', [-1.4, 0, 3.4], '192.168.10.11', '192.168.10.1');
    addConnection(sw.id, srv.id, { portA: 'Fa0/1', cableType: 'fiber' });
    if(typeof setPortVlan === 'function') setPortVlan(sw, 'Fa0/1', 10);
    addConnection(sw.id, pcCorp.id, { portA: 'Fa0/2', cableType: 'cat6' });
    if(typeof setPortVlan === 'function') setPortVlan(sw, 'Fa0/2', 10);

    // Mehmonlar Wi-Fi VLAN 50
    const guest1 = setupDevice('phone', 'apple_iphone_16_pro', 'Mehmon iPhone 16', [1.8, 0, 2.4], '192.168.50.10', '192.168.50.1');
    const guest2 = setupDevice('phone', 'samsung_galaxy_s24', 'Mehmon Galaxy S24', [3.8, 0, 2.4], '192.168.50.11', '192.168.50.1');
    addConnection(sw.id, guest1.id, { portA: 'Fa0/9', cableType: 'cat6' });
    if(typeof setPortVlan === 'function') setPortVlan(sw, 'Fa0/9', 50);
    addConnection(sw.id, guest2.id, { portA: 'Fa0/10', cableType: 'cat6' });
    if(typeof setPortVlan === 'function') setPortVlan(sw, 'Fa0/10', 50);

    if(typeof toggleVlanView === 'function') toggleVlanView(true);
    toast("🛡️ Mehmonlar va Korporativ VLAN Izolatsiyasi yuklandi: VLAN 50 mehmonlar uchun alohida");
  }

  /* =========================================================================
     3. DATA CENTER & ENTERPRISE ARXITEKTURALARI
     ========================================================================= */

  else if(type === 'datacenter_leafspine'){
    // ⚡ Data Center Leaf-Spine (Fat-Tree) Topologiyasi
    // 2x Spine Switches (Top layer)
    const spine1 = setupDevice('switch', 'cisco_catalyst_9300', 'Spine Switch 1', [-2.4, 0, -3.8]);
    const spine2 = setupDevice('switch', 'cisco_catalyst_9300', 'Spine Switch 2', [2.4, 0, -3.8]);

    // 3x Leaf Switches (Middle layer)
    const leaf1 = setupDevice('switch', 'cisco_catalyst_9300', 'Leaf Switch 1', [-4.2, 0, -0.6]);
    const leaf2 = setupDevice('switch', 'cisco_catalyst_9300', 'Leaf Switch 2', [0, 0, -0.6]);
    const leaf3 = setupDevice('switch', 'cisco_catalyst_9300', 'Leaf Switch 3', [4.2, 0, -0.6]);

    // Full Mesh between Spine and Leaf (Bipartite graph) via 40G/10G Fiber
    addConnection(spine1.id, leaf1.id, { cableType: 'fiber' });
    addConnection(spine1.id, leaf2.id, { cableType: 'fiber' });
    addConnection(spine1.id, leaf3.id, { cableType: 'fiber' });
    addConnection(spine2.id, leaf1.id, { cableType: 'fiber' });
    addConnection(spine2.id, leaf2.id, { cableType: 'fiber' });
    addConnection(spine2.id, leaf3.id, { cableType: 'fiber' });

    // End Servers (Bottom layer)
    const srv1 = setupDevice('server', 'dell_poweredge_r750', 'Compute Node 1', [-4.2, 0, 3.2], '10.0.1.10');
    const srv2 = setupDevice('server', 'dell_poweredge_r750', 'Compute Node 2', [0, 0, 3.2], '10.0.2.10');
    const nas = setupDevice('server', 'synology_ds923_plus', 'SAN / Storage Cluster', [4.2, 0, 3.2], '10.0.3.10');

    addConnection(leaf1.id, srv1.id, { cableType: 'fiber' });
    addConnection(leaf2.id, srv2.id, { cableType: 'fiber' });
    addConnection(leaf3.id, nas.id, { cableType: 'fiber' });

    toast("⚡ Data Center Leaf-Spine (Fat-Tree) yuklandi: 2x Spine + 3x Leaf to'liq optik magistral");
  }
  else if(type === 'dmz_secure'){
    // 🛡️ DMZ & Dual-Homed Server Farm
    const edgeRtr = setupDevice('router', 'cisco_isr_4451', 'Edge Firewall / Router', [0, 0, -4.5], '203.0.113.1');

    // DMZ Zone
    createRoomPartition(-3.8, 0, 5.8, 5.0, "🛡️ DMZ ZONE (OCHIQ HUHUD)", "#F87171");
    const swDmz = setupDevice('switch', 'cisco_catalyst_2960x', 'DMZ Switch', [-3.8, 0, -1.2]);
    const srvWeb = setupDevice('server', 'dell_poweredge_r750', 'Public Web Server', [-5.0, 0, 1.4], '203.0.113.80');
    const srvMail = setupDevice('server', 'dell_poweredge_r750', 'Public Mail Server', [-2.6, 0, 1.4], '203.0.113.25');
    addConnection(edgeRtr.id, swDmz.id, { cableType: 'fiber' });
    addConnection(swDmz.id, srvWeb.id, { cableType: 'cat6' });
    addConnection(swDmz.id, srvMail.id, { cableType: 'cat6' });

    // Internal Secure LAN Zone
    createRoomPartition(3.8, 0, 5.8, 5.0, "🔒 ICHKI XAVFSIZ LAN", "#38BDF8");
    const swLan = setupDevice('switch', 'cisco_catalyst_9300', 'Internal Core Switch', [3.8, 0, -1.2]);
    const srvDb = setupDevice('server', 'dell_poweredge_r750', 'Ichki DB Server', [2.6, 0, 1.4], '192.168.1.100');
    const pcSec = setupDevice('desktop', 'apple_mac_studio', 'Admin Mac Studio', [5.0, 0, 1.4], '192.168.1.50');
    addConnection(edgeRtr.id, swLan.id, { cableType: 'fiber' });
    addConnection(swLan.id, srvDb.id, { cableType: 'cat6' });
    addConnection(swLan.id, pcSec.id, { cableType: 'cat6' });

    toast("🛡️ DMZ & Xavfsiz Server Farm yuklandi: Ochiq Web/Mail DMZ va Ichki Baza tarmog'i");
  }
  else if(type === 'p2p_wan'){
    // 🌉 Point-to-Point (P2P) Site-to-Site WAN
    createRoomPartition(-4.6, 0, 6.4, 7.6, "🏢 TOSHKENT BOSH OFIS", "#38BDF8");
    const rtrTsh = setupDevice('router', 'cisco_isr_4451', 'Toshkent HQ Router', [-2.4, 0, -2.4], '192.168.1.1');
    const swTsh = setupDevice('switch', 'cisco_catalyst_9300', 'Toshkent Switch', [-4.6, 0, 0]);
    const srvTsh = setupDevice('server', 'dell_poweredge_r750', 'Toshkent ERP Server', [-6.0, 0, 2.6], '192.168.1.10');
    const pcTsh = setupDevice('desktop', 'apple_imac_24', 'Toshkent Menejer', [-3.4, 0, 2.6], '192.168.1.20');
    addConnection(rtrTsh.id, swTsh.id, { cableType: 'cat6' });
    addConnection(swTsh.id, srvTsh.id, { cableType: 'fiber' });
    addConnection(swTsh.id, pcTsh.id, { cableType: 'cat6' });

    createRoomPartition(4.6, 0, 6.4, 7.6, "🏬 SAMARQAND FILIAL", "#6FE3C4");
    const rtrSam = setupDevice('router', 'cisco_isr_4451', 'Samarqand Branch Router', [2.4, 0, -2.4], '192.168.2.1');
    const swSam = setupDevice('switch', 'cisco_catalyst_2960x', 'Samarqand Switch', [4.6, 0, 0]);
    const pcSam = setupDevice('laptop', 'lenovo_thinkpad_x1', 'Samarqand Noutbuk', [3.4, 0, 2.6], '192.168.2.10');
    const prnSam = setupDevice('printer', 'hp_laserjet_m528', 'Samarqand Printer', [6.0, 0, 2.6], '192.168.2.25');
    addConnection(rtrSam.id, swSam.id, { cableType: 'cat6' });
    addConnection(swSam.id, pcSam.id, { cableType: 'cat6' });
    addConnection(swSam.id, prnSam.id, { cableType: 'cat6' });

    // WAN P2P Leased Line Optik magistral
    addConnection(rtrTsh.id, rtrSam.id, { cableType: 'fiber_single' });

    toast("🌉 Point-to-Point (P2P) Site-to-Site WAN yuklandi: Toshkent Bosh Ofis ↔ Samarqand Filial");
  }

  /* =========================================================================
     4. SIMSIZ & SMART GADJETLAR TOPOLOGIYALARI
     ========================================================================= */

  else if(type === 'smart_office_iot'){
    // 📱 Smart Office IoT (Wi-Fi 7 & 5G Dual WAN)
    const modem5g = setupDevice('modem', 'huawei_gpon_ont', 'ZTE 5G / GPON Modem', [0, 0, -4.8]);
    const rtrWifi7 = setupDevice('router', 'router_wifi_archer', 'Xiaomi Router BE7000 (Wi-Fi 7)', [0, 0, -2.2]);
    addConnection(modem5g.id, rtrWifi7.id, { cableType: 'cat6' });

    const sw = setupDevice('switch', 'cisco_catalyst_9300', 'Smart Office Switch', [-2.4, 0, 0.4]);
    addConnection(rtrWifi7.id, sw.id, { cableType: 'cat6' });

    // Wired clients
    const imac = setupDevice('desktop', 'apple_imac_24', 'Apple iMac 24" M3', [-4.8, 0, 0.4], '192.168.1.10');
    const prn = setupDevice('printer', 'hp_laserjet_m528', 'HP LaserJet MFP', [-4.8, 0, 3.4], '192.168.1.25');
    const phone = setupDevice('phone', 'cisco_ip_phone_8845', 'Cisco 8845 IP Phone', [-2.0, 0, 3.4], '192.168.1.15');
    addConnection(sw.id, imac.id, { cableType: 'cat6' });
    addConnection(sw.id, prn.id, { cableType: 'cat6' });
    addConnection(sw.id, phone.id, { cableType: 'cat6' });

    // Wireless clients (Wi-Fi 7)
    const mbp = setupDevice('laptop', 'apple_macbook_pro_16', 'MacBook Pro 16" M3 Max', [2.2, 0, 1.2], '192.168.1.101');
    const s24 = setupDevice('phone', 'samsung_galaxy_s24', 'Samsung S24 Ultra', [4.4, 0, 1.2], '192.168.1.102');
    const tab = setupDevice('tablet', 'apple_ipad_pro_m4', 'iPad Pro 13" M4 Kiosk', [2.2, 0, 3.6], '192.168.1.103');
    const redmi = setupDevice('phone', 'apple_iphone_16_pro', 'iPhone 16 Pro Max', [4.4, 0, 3.6], '192.168.1.104');

    addConnection(rtrWifi7.id, mbp.id, { wireless: true });
    addConnection(rtrWifi7.id, s24.id, { wireless: true });
    addConnection(rtrWifi7.id, tab.id, { wireless: true });
    addConnection(rtrWifi7.id, redmi.id, { wireless: true });

    toast("📱 Smart Office & IoT yuklandi: Wi-Fi 7, Apple M3, Samsung S24 Ultra va iPad Pro");
  }

  /* =========================================================================
     5. KLASSIK VA BOSHQA TOPOLOGIYALAR (YANGILANGAN BRENDLAR BILAN)
     ========================================================================= */

  else if(type === 'star'){
    // ⭐ Yulduz (Star) Topologiyasi
    const sw = setupDevice('switch', 'cisco_catalyst_9300', 'Cisco 9300 Switch', [0, 0, 0]);
    const endpoints = [
      { type:'router', model:'cisco_isr_4451', pos:[0, 0, -4.2], name:'Cisco 4451 Gateway', cable:'cat6', ip:'192.168.1.1' },
      { type:'server', model:'dell_poweredge_r750', pos:[4.2, 0, 0], name:'Dell R750 Server', cable:'fiber', ip:'192.168.1.10' },
      { type:'desktop', model:'apple_mac_studio', pos:[2.6, 0, 3.2], name:'Mac Studio Workstation', cable:'cat6', ip:'192.168.1.20' },
      { type:'desktop', model:'acer_predator_orion', pos:[-2.6, 0, 3.2], name:'Acer Predator PC', cable:'cat6', ip:'192.168.1.21' },
      { type:'laptop', model:'lenovo_thinkpad_x1', pos:[-4.2, 0, 0], name:'ThinkPad X1 Laptop', cable:'cat6', ip:'192.168.1.22' },
      { type:'printer', model:'hp_laserjet_m528', pos:[-2.6, 0, -3.2], name:'HP LaserJet MFP', cable:'cat6', ip:'192.168.1.30' }
    ];

    endpoints.forEach(ep => {
      const dev = setupDevice(ep.type, ep.model, ep.name, ep.pos, ep.ip, '192.168.1.1');
      addConnection(sw.id, dev.id, { cableType: ep.cable });
    });

    toast("⭐ Yulduz (Star) topologiyasi yuklandi: Cisco Catalyst 9300 va 6 ta real brend qurilma");
  }
  else if(type === 'ring'){
    // ⭕ Halqa (Ring) Topologiyasi
    const ringItems = [
      { type:'switch', model:'cisco_catalyst_9300', name:'Switch A' },
      { type:'desktop', model:'acer_predator_orion', name:'Acer Predator PC' },
      { type:'laptop', model:'lenovo_thinkpad_x1', name:'ThinkPad X1' },
      { type:'switch', model:'cisco_catalyst_2960x', name:'Switch B' },
      { type:'printer', model:'hp_laserjet_m528', name:'HP LaserJet MFP' },
      { type:'desktop', model:'apple_imac_24', name:'Apple iMac 24"' }
    ];
    const r = 4.5;
    const created = [];
    const count = ringItems.length;

    ringItems.forEach((item, i)=>{
      const angle = (i / count) * Math.PI * 2;
      const dev = setupDevice(item.type, item.model, item.name, [Math.cos(angle) * r, 0, Math.sin(angle) * r]);
      created.push(dev);
    });

    for(let i = 0; i < count; i++){
      const next = (i + 1) % count;
      addConnection(created[i].id, created[next].id, { cableType: 'cat6' });
    }

    toast("⭕ Halqa (Ring) topologiyasi yuklandi (Ketma-ket aylana aloqa)");
  }
  else if(type === 'bus'){
    // 🚌 Shina (Bus) Topologiyasi
    const busNodes = [
      { type:'server', model:'dell_poweredge_r750', x:-2.6, z:-4.2, name:'Dell R750 Server' },
      { type:'switch', model:'cisco_catalyst_9300', x:2.6, z:-2.1, name:'Magistral Switch 1' },
      { type:'desktop', model:'samsung_odyssey_g9', x:-2.6, z:0.0, name:'Samsung Odyssey PC' },
      { type:'switch', model:'cisco_catalyst_2960x', x:2.6, z:2.1, name:'Magistral Switch 2' },
      { type:'printer', model:'hp_laserjet_m528', x:-2.6, z:4.2, name:'HP LaserJet' }
    ];

    const created = [];
    busNodes.forEach(bn => {
      const dev = setupDevice(bn.type, bn.model, bn.name, [bn.x, 0, bn.z]);
      created.push(dev);
    });

    for(let i = 0; i < created.length - 1; i++){
      addConnection(created[i].id, created[i + 1].id, { cableType: 'cat6' });
    }

    toast("🚌 Shina (Bus) topologiyasi yuklandi (Magistral liniya)");
  }
  else if(type === 'tree'){
    // 🌳 Daraxt (Tree / Ierarxik) Topologiyasi
    const modem = setupDevice('modem', 'huawei_gpon_ont', 'Huawei GPON ONT', [0, 0, -4.8]);
    const coreRouter = setupDevice('router', 'cisco_isr_4451', 'Cisco ISR 4451 Core', [0, 0, -2.4]);
    addConnection(modem.id, coreRouter.id, { cableType: 'cat6' });

    const distLeft = setupDevice('switch', 'cisco_catalyst_9300', 'Filial Switch A', [-3.6, 0, 0.4]);
    addConnection(coreRouter.id, distLeft.id, { cableType: 'fiber' });

    const distRight = setupDevice('switch', 'cisco_catalyst_2960x', 'Filial Switch B', [3.6, 0, 0.4]);
    addConnection(coreRouter.id, distRight.id, { cableType: 'fiber' });

    const srv = setupDevice('server', 'dell_poweredge_r750', 'Lokal Dell Server', [-5.0, 0, 3.4]);
    addConnection(distLeft.id, srv.id, { cableType: 'fiber' });

    const pc1 = setupDevice('desktop', 'acer_predator_orion', 'Dasturchi PC', [-2.4, 0, 3.4]);
    addConnection(distLeft.id, pc1.id, { cableType: 'cat6' });

    const pc2 = setupDevice('desktop', 'apple_mac_studio', 'Menejer Mac Studio', [2.4, 0, 3.4]);
    addConnection(distRight.id, pc2.id, { cableType: 'cat6' });

    const lap = setupDevice('laptop', 'lenovo_thinkpad_x1', 'ThinkPad Noutbuk', [5.0, 0, 3.4]);
    addConnection(distRight.id, lap.id, { cableType: 'cat6' });

    toast("🌳 Daraxtsimon (Tree) ierarxik topologiya yuklandi");
  }
  else if(type === 'mesh'){
    // 🕸️ To‘r (Full Mesh) Topologiyasi
    const meshItems = [
      { type:'router', model:'cisco_isr_4451', name:'Cisco 4451 Router 1' },
      { type:'router', model:'cisco_isr_4451', name:'Cisco 4451 Router 2' },
      { type:'switch', model:'cisco_catalyst_9300', name:'Catalyst 9300' },
      { type:'server', model:'dell_poweredge_r750', name:'Dell R750 Server' },
      { type:'desktop', model:'apple_mac_studio', name:'NOC Mac Studio' }
    ];
    const r = 4.0;
    const created = [];
    const count = meshItems.length;

    meshItems.forEach((item, i)=>{
      const angle = (i / count) * Math.PI * 2;
      const dev = setupDevice(item.type, item.model, item.name, [Math.cos(angle) * r, 0, Math.sin(angle) * r]);
      created.push(dev);
    });

    for(let i = 0; i < count; i++){
      for(let j = i + 1; j < count; j++){
        addConnection(created[i].id, created[j].id, { cableType: 'fiber' });
      }
    }

    toast("🕸️ To‘rsimon (Full Mesh) topologiya yuklandi (Maksimal ishonchlilik)");
  }
  else if(type === 'office'){
    // 🏠 Uy / Ofis Gibrid (LAN & Wi-Fi) Topologiyasi
    const modem = setupDevice('modem', 'huawei_gpon_ont', 'GPON ONT', [0, 0, -4.8]);
    const router = setupDevice('router', 'router_wifi_archer', 'Wi-Fi 6 Router', [0, 0, -2.2]);
    addConnection(modem.id, router.id, { cableType: 'cat6' });

    const sw = setupDevice('switch', 'cisco_catalyst_2960x', 'Ofis Switch', [-1.8, 0, 0.6]);
    addConnection(router.id, sw.id, { cableType: 'cat6' });

    const srv = setupDevice('server', 'synology_ds923_plus', 'Synology NAS', [-4.5, 0, 0.6]);
    addConnection(sw.id, srv.id, { cableType: 'cat6' });

    const pc = setupDevice('desktop', 'apple_imac_24', 'Apple iMac M3', [-2.0, 0, 3.8]);
    addConnection(sw.id, pc.id, { cableType: 'cat6' });

    const prn = setupDevice('printer', 'hp_laserjet_m528', 'HP LaserJet MFP', [-4.5, 0, 3.8]);
    addConnection(sw.id, prn.id, { cableType: 'cat6' });

    const lap = setupDevice('laptop', 'lenovo_thinkpad_x1', 'ThinkPad X1', [2.4, 0, 1.6]);
    addConnection(router.id, lap.id, { wireless: true });

    const ph1 = setupDevice('phone', 'cisco_ip_phone_8845', 'Cisco 8845 IP Phone', [4.2, 0, 3.8]);
    addConnection(sw.id, ph1.id, { cableType: 'cat6' });

    const tab = setupDevice('tablet', 'apple_ipad_pro_m4', 'iPad Pro Stend', [4.5, 0, 1.6]);
    addConnection(router.id, tab.id, { wireless: true });

    toast("🏠 Uy va Ofis (Gibrid LAN/Wi-Fi) topologiyasi yuklandi");
  }
  else if(type === 'vlan_roas'){
    // 🏢 VLAN & Router-on-a-Stick (Inter-VLAN Routing) Topologiyasi
    const router = setupDevice('router', 'cisco_isr_4451', 'Core Router (RoaS)', [0, 0, -3.4]);

    if(typeof addRouterSubinterface === 'function'){
      addRouterSubinterface(router, 'GigabitEthernet0/0', '10', 10, '192.168.10.1', '255.255.255.0');
      addRouterSubinterface(router, 'GigabitEthernet0/0', '20', 20, '192.168.20.1', '255.255.255.0');
      addRouterSubinterface(router, 'GigabitEthernet0/0', '30', 30, '192.168.30.1', '255.255.255.0');
    }

    const sw = setupDevice('switch', 'cisco_catalyst_9300', 'Markaziy Switch (VLAN)', [0, 0, 0]);

    if(typeof initSwitchVlans === 'function'){
      initSwitchVlans(sw);
      addVlan(sw, 10, 'TALABALAR', '#38BDF8');
      addVlan(sw, 20, 'OQITUVCHILAR', '#F472B6');
      addVlan(sw, 30, 'SERVERLAR', '#FBBF24');
    }

    // Switch Gi0/1 ↔ Router Gi0/0 Trunk aloqasi
    addConnection(sw.id, router.id, { portA: 'Gi0/1', portB: 'Gi0/0', cableType: 'fiber_single' });
    if(typeof setPortMode === 'function') setPortMode(sw, 'Gi0/1', 'trunk');

    // VLAN 10 (Talabalar)
    const pc1 = setupDevice('desktop', 'acer_predator_orion', 'Talaba PC-1', [-3.6, 0, 3.2], '192.168.10.10', '192.168.10.1');
    addConnection(sw.id, pc1.id, { portA: 'Fa0/1', cableType: 'cat6' });
    if(typeof setPortVlan === 'function') setPortVlan(sw, 'Fa0/1', 10);

    const pc2 = setupDevice('desktop', 'dell_optiplex_7090', 'Talaba PC-2', [-1.4, 0, 3.2], '192.168.10.11', '192.168.10.1');
    addConnection(sw.id, pc2.id, { portA: 'Fa0/2', cableType: 'cat6' });
    if(typeof setPortVlan === 'function') setPortVlan(sw, 'Fa0/2', 10);

    // VLAN 20 (O'qituvchilar)
    const pc3 = setupDevice('desktop', 'apple_mac_studio', 'Ustoz Mac Studio', [1.4, 0, 3.2], '192.168.20.10', '192.168.20.1');
    addConnection(sw.id, pc3.id, { portA: 'Fa0/5', cableType: 'cat6' });
    if(typeof setPortVlan === 'function') setPortVlan(sw, 'Fa0/5', 20);

    const pc4 = setupDevice('laptop', 'lenovo_thinkpad_x1', 'Ustoz ThinkPad', [3.6, 0, 3.2], '192.168.20.11', '192.168.20.1');
    addConnection(sw.id, pc4.id, { portA: 'Fa0/6', cableType: 'cat6' });
    if(typeof setPortVlan === 'function') setPortVlan(sw, 'Fa0/6', 20);

    // VLAN 30 (Server)
    const srv = setupDevice('server', 'dell_poweredge_r750', 'Dell R750 Server', [-4.5, 0, 0], '192.168.30.10', '192.168.30.1');
    addConnection(sw.id, srv.id, { portA: 'Fa0/9', cableType: 'fiber' });
    if(typeof setPortVlan === 'function') setPortVlan(sw, 'Fa0/9', 30);

    if(typeof toggleVlanView === 'function') toggleVlanView(true);
    toast("🏢 VLAN & Router-on-a-Stick topologiyasi yuklandi: VLAN 10, 20, 30 va 802.1Q Trunk");
  }
  else if(type === 'vlan_trunk'){
    // 🔀 Multi-Switch 802.1Q Trunking Topologiyasi
    const swA = setupDevice('switch', 'cisco_catalyst_2960x', 'Switch A (Filial 1)', [-2.8, 0, 0]);
    const swB = setupDevice('switch', 'cisco_catalyst_2960x', 'Switch B (Filial 2)', [2.8, 0, 0]);

    if(typeof initSwitchVlans === 'function'){
      initSwitchVlans(swA);
      initSwitchVlans(swB);
      addVlan(swA, 10, 'TALABALAR', '#38BDF8');
      addVlan(swA, 20, 'OQITUVCHILAR', '#F472B6');
      addVlan(swB, 10, 'TALABALAR', '#38BDF8');
      addVlan(swB, 20, 'OQITUVCHILAR', '#F472B6');
    }

    addConnection(swA.id, swB.id, { portA: 'Fa0/24', portB: 'Fa0/24', cableType: 'cat6' });
    if(typeof setPortMode === 'function'){
      setPortMode(swA, 'Fa0/24', 'trunk');
      setPortMode(swB, 'Fa0/24', 'trunk');
    }

    const pcA1 = setupDevice('desktop', 'acer_predator_orion', 'Talaba A1 (VLAN 10)', [-4.5, 0, 2.8], '192.168.10.10');
    addConnection(swA.id, pcA1.id, { portA: 'Fa0/1', cableType: 'cat6' });
    if(typeof setPortVlan === 'function') setPortVlan(swA, 'Fa0/1', 10);

    const pcA2 = setupDevice('desktop', 'apple_mac_studio', 'Ustoz A2 (VLAN 20)', [-1.8, 0, 2.8], '192.168.20.10');
    addConnection(swA.id, pcA2.id, { portA: 'Fa0/5', cableType: 'cat6' });
    if(typeof setPortVlan === 'function') setPortVlan(swA, 'Fa0/5', 20);

    const pcB1 = setupDevice('desktop', 'samsung_odyssey_g9', 'Talaba B1 (VLAN 10)', [1.8, 0, 2.8], '192.168.10.11');
    addConnection(swB.id, pcB1.id, { portA: 'Fa0/1', cableType: 'cat6' });
    if(typeof setPortVlan === 'function') setPortVlan(swB, 'Fa0/1', 10);

    const pcB2 = setupDevice('laptop', 'lenovo_thinkpad_x1', 'Ustoz B2 (VLAN 20)', [4.5, 0, 2.8], '192.168.20.11');
    addConnection(swB.id, pcB2.id, { portA: 'Fa0/5', cableType: 'cat6' });
    if(typeof setPortVlan === 'function') setPortVlan(swB, 'Fa0/5', 20);

    if(typeof toggleVlanView === 'function') toggleVlanView(true);
    toast("🔀 Multi-Switch 802.1Q Trunking yuklandi (Fa0/24 orqali Trunk aloqa)");
  }
  else {
    seed();
    toast("Boshlang‘ich tarmoq yuklandi");
  }
}

function seed(){
  clearAllNetwork();

  // 1. GPON Optical ONT Modem
  const modem = setupDevice('modem', 'huawei_gpon_ont', 'Huawei GPON ONT', [0, 0, -5.2]);

  // 2. Cisco ISR 4451 Core Router
  const router = setupDevice('router', 'cisco_isr_4451', 'Cisco ISR 4451 Router', [0, 0, -2.4], '192.168.1.1');
  addConnection(modem.id, router.id, { cableType: 'cat6' });

  // 3. Cisco Catalyst 9300 Switch
  const sw = setupDevice('switch', 'cisco_catalyst_9300', 'Cisco Catalyst 9300', [-1.6, 0, 0.6]);
  addConnection(router.id, sw.id, { cableType: 'cat6' });

  // 4. Dell PowerEdge R750 Enterprise Server (connected via Fiber 10G)
  const server = setupDevice('server', 'dell_poweredge_r750', 'Dell PowerEdge R750', [-4.5, 0, 0.6], '192.168.1.10', '192.168.1.1');
  addConnection(sw.id, server.id, { cableType: 'fiber' });

  // 5. Samsung Odyssey OLED G9 Gaming / Creator PC
  const desktop = setupDevice('desktop', 'samsung_odyssey_g9', 'Samsung Odyssey G9 PC', [-2.0, 0, 4.0], '192.168.1.20', '192.168.1.1');
  addConnection(sw.id, desktop.id, { cableType: 'cat6' });

  // 6. Apple Mac Studio M2 Ultra + Studio Display
  const ws = setupDevice('desktop', 'apple_mac_studio', 'Apple Mac Studio M2', [1.4, 0, 4.0], '192.168.1.21', '192.168.1.1');
  addConnection(sw.id, ws.id, { cableType: 'cat6' });

  // 7. HP LaserJet Enterprise MFP M528dn
  const printer = setupDevice('printer', 'hp_laserjet_m528', 'HP LaserJet Enterprise', [-4.5, 0, 4.0], '192.168.1.30', '192.168.1.1');
  addConnection(sw.id, printer.id, { cableType: 'cat6' });

  // 8. Cisco 8845 HD Video IP Phone
  const phone = setupDevice('phone', 'cisco_ip_phone_8845', 'Cisco 8845 IP Phone', [3.8, 0, 4.0], '192.168.1.15', '192.168.1.1');
  // Phone is connected to the switch, not directly to the router
  if(phone) addConnection(sw.id, phone.id, { cableType: 'cat6' });

  // 9. Lenovo ThinkPad X1 Carbon Gen 11 (Wi-Fi)
  const laptop = setupDevice('laptop', 'lenovo_thinkpad_x1', 'ThinkPad X1 Carbon', [2.4, 0, 1.6], '192.168.1.101', '192.168.1.1');
  addConnection(router.id, laptop.id, { wireless: true });

  // 10. Apple iPad Pro 13" M4 (Wi-Fi)
  const tablet = setupDevice('tablet', 'apple_ipad_pro_m4', 'iPad Pro 13" M4', [4.5, 0, 1.6], '192.168.1.102', '192.168.1.1');
  addConnection(router.id, tablet.id, { wireless: true });
}

/* Dropdown UI interaction */
const topoBtn = document.getElementById('topoBtn');
const topoMenu = document.getElementById('topoMenu');
if(topoBtn && topoMenu){
  topoBtn.addEventListener('click', (e)=>{
    e.stopPropagation();
    ['roomMenu', 'cableMenu', 'exportDropdown'].forEach(id => {
      const el = document.getElementById(id);
      if(el) el.classList.remove('show');
    });
    topoMenu.classList.toggle('show');
  });
  document.addEventListener('click', ()=>{ topoMenu.classList.remove('show'); });
  topoMenu.querySelectorAll('.topo-item').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      e.stopPropagation();
      topoMenu.classList.remove('show');
      loadTopology(btn.dataset.topo);
    });
  });
}

/* Support postMessage from parent portal */
window.addEventListener('message', (e)=>{
  if(e.data && e.data.action === 'loadTopology'){
    loadTopology(e.data.type);
  }
});
