/* ==========================================================================
   TOPOLOGY TEMPLATES & SEED NETWORK GENERATION
   ========================================================================== */

function clearAllNetwork(){
  [...devices.keys()].forEach(removeDevice);
}

function loadTopology(type){
  clearAllNetwork();

  if(type === 'star'){
    // ⭐ Yulduz (Star) Topologiyasi: markazda Switch (Kommutator), radial mijozlar
    const sw = addDevice('switch');
    sw.name = "Markaziy Switch";
    sw.label.querySelector('.nm').textContent = sw.name;
    sw.group.position.set(0, 0, 0);

    const endpoints = [
      { type:'router', pos:[0, 0, -4.2], name:'Gateway Router' },
      { type:'server', pos:[4.2, 0, 0], name:'Fayl Server' },
      { type:'desktop', pos:[2.6, 0, 3.2], name:'Menejer PC' },
      { type:'desktop', pos:[-2.6, 0, 3.2], name:'Buxgalteriya PC' },
      { type:'laptop', pos:[-4.2, 0, 0], name:'Admin Noutbuk' },
      { type:'printer', pos:[-2.6, 0, -3.2], name:'Tarmoq Printer' }
    ];

    endpoints.forEach(ep => {
      const dev = addDevice(ep.type);
      dev.name = ep.name;
      dev.label.querySelector('.nm').textContent = dev.name;
      dev.group.position.set(ep.pos[0], ep.pos[1], ep.pos[2]);
      addConnection(sw.id, dev.id);
    });

    toast("⭐ Yulduz (Star) topologiyasi yuklandi: 1 ta Markaziy Switch, 6 ta tugun");
  }
  else if(type === 'ring'){
    // ⭕ Halqa (Ring) Topologiyasi: qurilmalar ketma-ket aylana ulanadi
    const ringItems = [
      { type:'switch', name:'Switch A' },
      { type:'desktop', name:'PC-1' },
      { type:'laptop', name:'Noutbuk' },
      { type:'switch', name:'Switch B' },
      { type:'printer', name:'Ofis Printer' },
      { type:'desktop', name:'PC-2' }
    ];
    const r = 4.5;
    const created = [];
    const count = ringItems.length;

    ringItems.forEach((item, i)=>{
      const angle = (i / count) * Math.PI * 2;
      const dev = addDevice(item.type);
      dev.name = item.name;
      dev.label.querySelector('.nm').textContent = dev.name;
      dev.group.position.set(Math.cos(angle) * r, 0, Math.sin(angle) * r);
      created.push(dev);
    });

    for(let i = 0; i < count; i++){
      const next = (i + 1) % count;
      addConnection(created[i].id, created[next].id);
    }

    toast("⭕ Halqa (Ring) topologiyasi yuklandi (Ketma-ket aylana aloqa)");
  }
  else if(type === 'bus'){
    // 🚌 Shina (Bus) Topologiyasi: umumiy liniyada ketma-ket
    const busNodes = [
      { type:'server', x:-2.6, z:-4.2, name:'Bosh Server' },
      { type:'switch', x:2.6, z:-2.1, name:'Magistral Switch 1' },
      { type:'desktop', x:-2.6, z:0.0, name:'Kompyuter 1' },
      { type:'switch', x:2.6, z:2.1, name:'Magistral Switch 2' },
      { type:'printer', x:-2.6, z:4.2, name:'Tarmoq Printer' }
    ];

    const created = [];
    busNodes.forEach(bn => {
      const dev = addDevice(bn.type);
      dev.name = bn.name;
      dev.label.querySelector('.nm').textContent = dev.name;
      dev.group.position.set(bn.x, 0, bn.z);
      created.push(dev);
    });

    for(let i = 0; i < created.length - 1; i++){
      addConnection(created[i].id, created[i + 1].id);
    }

    toast("🚌 Shina (Bus) topologiyasi yuklandi (Magistral liniya)");
  }
  else if(type === 'tree'){
    // 🌳 Daraxt (Tree / Ierarxik) Topologiyasi (Core-Distribution-Access)
    const modem = addDevice('modem');
    modem.name = "Internet WAN";
    modem.label.querySelector('.nm').textContent = modem.name;
    modem.group.position.set(0, 0, -4.8);

    const coreRouter = addDevice('router');
    coreRouter.name = "Asosiy Core Router";
    coreRouter.label.querySelector('.nm').textContent = coreRouter.name;
    coreRouter.group.position.set(0, 0, -2.4);
    addConnection(modem.id, coreRouter.id);

    const distLeft = addDevice('switch');
    distLeft.name = "Filial Switch A";
    distLeft.label.querySelector('.nm').textContent = distLeft.name;
    distLeft.group.position.set(-3.6, 0, 0.4);
    addConnection(coreRouter.id, distLeft.id);

    const distRight = addDevice('switch');
    distRight.name = "Filial Switch B";
    distRight.label.querySelector('.nm').textContent = distRight.name;
    distRight.group.position.set(3.6, 0, 0.4);
    addConnection(coreRouter.id, distRight.id);

    // End devices under distLeft
    const srv = addDevice('server');
    srv.name = "Lokal Server";
    srv.label.querySelector('.nm').textContent = srv.name;
    srv.group.position.set(-5.0, 0, 3.4);
    addConnection(distLeft.id, srv.id);

    const pc1 = addDevice('desktop');
    pc1.name = "Dasturchi PC";
    pc1.label.querySelector('.nm').textContent = pc1.name;
    pc1.group.position.set(-2.4, 0, 3.4);
    addConnection(distLeft.id, pc1.id);

    // End devices under distRight
    const pc2 = addDevice('desktop');
    pc2.name = "Menejer PC";
    pc2.label.querySelector('.nm').textContent = pc2.name;
    pc2.group.position.set(2.4, 0, 3.4);
    addConnection(distRight.id, pc2.id);

    const lap = addDevice('laptop');
    lap.name = "Noutbuk Wi-Fi";
    lap.label.querySelector('.nm').textContent = lap.name;
    lap.group.position.set(5.0, 0, 3.4);
    addConnection(distRight.id, lap.id);

    toast("🌳 Daraxtsimon (Tree) ierarxik topologiya yuklandi");
  }
  else if(type === 'mesh'){
    // 🕸️ To‘r (Full Mesh) Topologiyasi: maksimal ishonchlilik
    const meshItems = [
      { type:'router', name:'Tugun Router 1' },
      { type:'switch', name:'Klaster Switch 1' },
      { type:'server', name:'Klaster Server 1' },
      { type:'switch', name:'Klaster Switch 2' },
      { type:'desktop', name:'NOC Monitoring' }
    ];
    const r = 4.0;
    const created = [];
    const count = meshItems.length;

    meshItems.forEach((item, i)=>{
      const angle = (i / count) * Math.PI * 2;
      const dev = addDevice(item.type);
      dev.name = item.name;
      dev.label.querySelector('.nm').textContent = dev.name;
      dev.group.position.set(Math.cos(angle) * r, 0, Math.sin(angle) * r);
      created.push(dev);
    });

    for(let i = 0; i < count; i++){
      for(let j = i + 1; j < count; j++){
        addConnection(created[i].id, created[j].id);
      }
    }

    toast("🕸️ To‘rsimon (Full Mesh) topologiya yuklandi (Maksimal ishonchlilik)");
  }
  else if(type === 'office'){
    // 🏠 Uy / Ofis Gibrid (LAN & Wi-Fi) Topologiyasi
    const modem = addDevice('modem');
    modem.name = "ISP Provayder";
    modem.label.querySelector('.nm').textContent = modem.name;
    modem.group.position.set(0, 0, -4.4);

    const router = addDevice('router');
    router.name = "Wi-Fi Gateway";
    router.label.querySelector('.nm').textContent = router.name;
    router.group.position.set(0, 0, -2.0);
    addConnection(modem.id, router.id);

    const sw = addDevice('switch');
    sw.name = "Ofis Switch";
    sw.label.querySelector('.nm').textContent = sw.name;
    sw.group.position.set(-1.8, 0, 0.6);
    addConnection(router.id, sw.id);

    // Simli LAN switch orqali
    const srv = addDevice('server');
    srv.name = "NAS Fayl Server";
    srv.label.querySelector('.nm').textContent = srv.name;
    srv.group.position.set(-4.0, 0, 0.6);
    addConnection(sw.id, srv.id);

    const pc = addDevice('desktop');
    pc.name = "Ishchi Kompyuter";
    pc.label.querySelector('.nm').textContent = pc.name;
    pc.group.position.set(-1.8, 0, 3.6);
    addConnection(sw.id, pc.id);

    const prn = addDevice('printer');
    prn.name = "Ofis Printer";
    prn.label.querySelector('.nm').textContent = prn.name;
    prn.group.position.set(-4.0, 0, 3.4);
    addConnection(sw.id, prn.id);

    // Simsiz Wi-Fi router orqali
    const lap = addDevice('laptop');
    lap.name = "Noutbuk (Wi-Fi)";
    lap.label.querySelector('.nm').textContent = lap.name;
    lap.group.position.set(2.4, 0, 1.6);
    addConnection(router.id, lap.id);

    const ph1 = addDevice('phone');
    ph1.name = "Smartfon 1";
    ph1.label.querySelector('.nm').textContent = ph1.name;
    ph1.group.position.set(4.0, 0, 3.2);
    addConnection(router.id, ph1.id);

    const ph2 = addDevice('phone');
    ph2.name = "Smartfon 2";
    ph2.label.querySelector('.nm').textContent = ph2.name;
    ph2.group.position.set(1.8, 0, 4.0);
    addConnection(router.id, ph2.id);

    toast("🏠 Uy va Ofis (Gibrid LAN/Wi-Fi) topologiyasi yuklandi");
  }
  else {
    seed();
    toast("Boshlang‘ich tarmoq yuklandi");
  }
}

function seed(){
  const modem = addDevice('modem');
  modem.group.position.set(0, 0, -4.4);

  const router = addDevice('router');
  router.group.position.set(0, 0, -2.0);
  addConnection(modem.id, router.id);

  const sw = addDevice('switch');
  sw.group.position.set(-1.4, 0, 0.6);
  addConnection(router.id, sw.id);

  const server = addDevice('server');
  server.group.position.set(-3.8, 0, 0.6);
  addConnection(sw.id, server.id);

  const desktop = addDevice('desktop');
  desktop.group.position.set(-1.4, 0, 3.6);
  addConnection(sw.id, desktop.id);

  const laptop = addDevice('laptop');
  laptop.group.position.set(2.0, 0, 1.8);
  addConnection(router.id, laptop.id);

  const phone = addDevice('phone');
  phone.group.position.set(3.4, 0, 3.6);
  addConnection(router.id, phone.id);
}

/* Dropdown UI interaction */
const topoBtn = document.getElementById('topoBtn');
const topoMenu = document.getElementById('topoMenu');
if(topoBtn && topoMenu){
  topoBtn.addEventListener('click', (e)=>{
    e.stopPropagation();
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

/* Support postMessage from parent portal (index.html) */
window.addEventListener('message', (e)=>{
  if(e.data && e.data.action === 'loadTopology'){
    loadTopology(e.data.type);
  }
});
