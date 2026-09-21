/* ==========================================================================
   SMART GRID 3D PANORAMIC WORLD & THREE.JS ENGINE
   ATT-25 Smart Grid: Tog', Daryo, GES, Dala LEP, Shahar, Qishloq va Xonadon
   ========================================================================== */

class GridScene3D {
  constructor(containerId, engine) {
    this.container = document.getElementById(containerId);
    this.engine = engine;

    // Hotspot Camera Presets
    this.hotspots = {
      ges: {
        pos: new THREE.Vector3(-85, 45, -95),
        target: new THREE.Vector3(-70, 15, -70),
        name: "🏔️ Gidroelektr Stansiya & To'g'on"
      },
      substation: {
        pos: new THREE.Vector3(-45, 22, -50),
        target: new THREE.Vector3(-40, 6, -40),
        name: "⚡ 220 kV Kuchaytiruvchi Podstansiya (ORU)"
      },
      pylon: {
        pos: new THREE.Vector3(0, 20, -10),
        target: new THREE.Vector3(5, 12, 0),
        name: "🌾 Dala Magistral LEP Ustuni"
      },
      gpp: {
        pos: new THREE.Vector3(55, 25, 30),
        target: new THREE.Vector3(65, 8, 40),
        name: "🏭 Tuman Bosh Podstansiyasi (GPP)"
      },
      ktp: {
        pos: new THREE.Vector3(90, 15, 75),
        target: new THREE.Vector3(98, 4, 82),
        name: "🛖 Mahalla KTP Transformatori (10/0.4 kV)"
      },
      house: {
        pos: new THREE.Vector3(125, 10, 105),
        target: new THREE.Vector3(132, 6, 110),
        name: "🏠 Xonadon va Smart Hisoblagich"
      },
      solar: {
        pos: new THREE.Vector3(25, 20, -55),
        target: new THREE.Vector3(20, 4, -45),
        name: "☀️ Quyosh Fotoelektr Stansiyasi (SES)"
      },
      wind: {
        pos: new THREE.Vector3(-30, 45, 65),
        target: new THREE.Vector3(-25, 25, 75),
        name: "🌬️ Shamol Elektr Stansiyasi (VET)"
      },
      bess: {
        pos: new THREE.Vector3(75, 18, 55),
        target: new THREE.Vector3(70, 4, 48),
        name: "🔋 BESS Megapack Akkumulyator Tizimi (50 MWh)"
      }
    };

    this.currentHotspot = 'ges';
    this.targetCamPos = this.hotspots.ges.pos.clone();
    this.targetCamLook = this.hotspots.ges.target.clone();

    // Dynamic elements
    this.nightLights = [];
    this.currentParticles = [];
    this.windRotors = [];
    this.solarPanels = [];
    this.bessLeds = [];
    this.clouds = [];
    this.trafficCars = [];
    this.mistParticles = [];
    this.isDroneTourActive = false;
    this.droneTourProgress = 0;

    this.initThree();
    this.buildWorld();
    this.initDroneTourSpline();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  initThree() {
    const w = this.container.clientWidth || window.innerWidth;
    const h = this.container.clientHeight || window.innerHeight;

    // 1. Scene & Fog
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87CEEB); // Daytime sky
    this.scene.fog = new THREE.FogExp2(0x87CEEB, 0.0025);

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(45, w / h, 0.5, 800);
    this.camera.position.copy(this.hotspots.ges.pos);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;
    this.container.appendChild(this.renderer.domElement);

    // 4. OrbitControls
    if (window.THREE && THREE.OrbitControls) {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.06;
      this.controls.maxDistance = 250;
      this.controls.minDistance = 3;
      this.controls.target.copy(this.hotspots.ges.target);
    }

    // 5. Lighting
    this.ambientLight = new THREE.HemisphereLight(0xFFFFFF, 0x334422, 0.65);
    this.scene.add(this.ambientLight);

    this.sunLight = new THREE.DirectionalLight(0xFFFBE8, 1.3);
    this.sunLight.position.set(-60, 100, -60);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 10;
    this.sunLight.shadow.camera.far = 400;
    const d = 160;
    this.sunLight.shadow.camera.left = -d;
    this.sunLight.shadow.camera.right = d;
    this.sunLight.shadow.camera.top = d;
    this.sunLight.shadow.camera.bottom = -d;
    this.scene.add(this.sunLight);

    this.clock = new THREE.Clock();
    window.addEventListener('resize', () => this.onResize());
  }

  onResize() {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  // Hotspot Transition
  gotoHotspot(key) {
    if (this.hotspots[key]) {
      this.currentHotspot = key;
      this.targetCamPos.copy(this.hotspots[key].pos);
      this.targetCamLook.copy(this.hotspots[key].target);
      if (window.toast) {
        window.toast(`📍 Kamera: <b>${this.hotspots[key].name}</b> ga yo'naltirildi`);
      }
    }
  }

  // =========================================================================
  // BUILD 3D WORLD
  // =========================================================================
  buildWorld() {
    this.buildTerrainAndRiver();
    this.buildHydroPlantAndDam();
    this.buildStepUpSubstation();
    this.buildTransmissionLine();
    this.buildDistrictSubstation();
    this.buildCityAndIndustry();
    this.buildVillageAndKtp();
    this.buildHouseInterior();
    this.buildSolarFarm();
    this.buildWindFarm();
    this.buildBessBatteryPark();
    this.buildFoliageAndForests();
    this.buildRoadsAndTraffic();
    this.buildAtmosphericCloudsAndStars();
    this.buildWaterfallAndSpray();
  }

  // 1. Terrain, River and Green Plains
  buildTerrainAndRiver() {
    // Ground Plains (Grass Green with subtle variation)
    const groundGeo = new THREE.PlaneGeometry(500, 500, 40, 40);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x3D632E, // Lush green meadow
      roughness: 0.9,
      metalness: 0.05
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // River flowing from Dam (-70, -70) down to City & Village
    const riverGeo = new THREE.PlaneGeometry(28, 380);
    const riverMat = new THREE.MeshStandardMaterial({
      color: 0x1E5B82,
      roughness: 0.1,
      metalness: 0.7,
      transparent: true,
      opacity: 0.88
    });
    const river = new THREE.Mesh(riverGeo, riverMat);
    river.rotation.x = -Math.PI / 2;
    river.position.set(-25, 0.15, 40);
    river.rotation.z = 0.25;
    this.scene.add(river);

    // Mountains in the background (Near GES at -90, -90)
    for (let i = 0; i < 9; i++) {
      const h = 55 + Math.random() * 45;
      const r = 35 + Math.random() * 25;
      const mGeo = new THREE.ConeGeometry(r, h, 8);
      const mMat = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? 0x475569 : 0x334155,
        roughness: 0.95
      });
      const mMesh = new THREE.Mesh(mGeo, mMat);
      mMesh.position.set(-140 + (i % 3) * 45, h / 2, -150 + Math.floor(i / 3) * 40);
      mMesh.castShadow = true;
      mMesh.receiveShadow = true;
      this.scene.add(mMesh);

      // Snow peak caps
      const snowGeo = new THREE.ConeGeometry(r * 0.35, h * 0.35, 8);
      const snowMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.4 });
      const snow = new THREE.Mesh(snowGeo, snowMat);
      snow.position.set(mMesh.position.x, h * 0.825, mMesh.position.z);
      this.scene.add(snow);
    }
  }

  // 2. Hydroelectric Dam, Penstocks & Turbine Hall
  buildHydroPlantAndDam() {
    const gesGrp = new THREE.Group();
    gesGrp.position.set(-70, 0, -75);

    // Concrete Dam Wall (Arched Dam)
    const damGeo = new THREE.BoxGeometry(75, 38, 14);
    const damMat = new THREE.MeshStandardMaterial({ color: 0x8A929A, roughness: 0.6 });
    const dam = new THREE.Mesh(damGeo, damMat);
    dam.position.set(0, 19, -15);
    dam.castShadow = true;
    dam.receiveShadow = true;
    gesGrp.add(dam);

    // Upper Reservoir Water (Blue Lake behind dam)
    const lakeGeo = new THREE.BoxGeometry(85, 34, 60);
    const lakeMat = new THREE.MeshStandardMaterial({
      color: 0x0E7490,
      roughness: 0.15,
      metalness: 0.5,
      transparent: true,
      opacity: 0.92
    });
    const lake = new THREE.Mesh(lakeGeo, lakeMat);
    lake.position.set(0, 17, -50);
    gesGrp.add(lake);

    // 2 Large Penstock Steel Pipes (Pressure conduits)
    for (let p = 0; p < 2; p++) {
      const penstockGeo = new THREE.CylinderGeometry(2.2, 2.2, 34, 16);
      const penstockMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.3 });
      const pipe = new THREE.Mesh(penstockGeo, penstockMat);
      pipe.position.set(-10 + p * 20, 12, 0);
      pipe.rotation.x = Math.PI / 4;
      pipe.castShadow = true;
      gesGrp.add(pipe);
    }

    // Turbine & Powerhouse Building
    const houseGeo = new THREE.BoxGeometry(45, 16, 24);
    const houseMat = new THREE.MeshStandardMaterial({ color: 0xE2E8F0, roughness: 0.4 });
    const powerhouse = new THREE.Mesh(houseGeo, houseMat);
    powerhouse.position.set(0, 8, 14);
    powerhouse.castShadow = true;
    gesGrp.add(powerhouse);

    // Cutaway / Glass Window to see the Francis Turbine & Generator Rotor
    const glassGeo = new THREE.PlaneGeometry(24, 10);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x38BDF8,
      transmission: 0.9,
      opacity: 1,
      transparent: true,
      roughness: 0.1
    });
    const windowMesh = new THREE.Mesh(glassGeo, glassMat);
    windowMesh.position.set(0, 8, 26.1);
    gesGrp.add(windowMesh);

    // Inside Turbine Rotor (Spins with water flow)
    const rotorGeo = new THREE.CylinderGeometry(4.5, 4.5, 3.5, 12);
    const rotorMat = new THREE.MeshStandardMaterial({ color: 0xF59E0B, metalness: 0.9, roughness: 0.2 });
    this.turbineRotor = new THREE.Mesh(rotorGeo, rotorMat);
    this.turbineRotor.position.set(0, 7, 14);
    gesGrp.add(this.turbineRotor);

    // Water discharge spray / splash effect at outlet
    const sprayGeo = new THREE.ConeGeometry(5, 8, 12);
    const sprayMat = new THREE.MeshBasicMaterial({ color: 0xBAE6FD, transparent: true, opacity: 0.65 });
    const spray = new THREE.Mesh(sprayGeo, sprayMat);
    spray.rotation.x = Math.PI / 2;
    spray.position.set(0, 2, 28);
    gesGrp.add(spray);

    this.scene.add(gesGrp);
  }

  // 3. Step-Up Substation (ORU-220 kV) near GES
  buildStepUpSubstation() {
    const oruGrp = new THREE.Group();
    oruGrp.position.set(-42, 0, -42);

    // Gravel yard base
    const yardGeo = new THREE.BoxGeometry(36, 0.4, 32);
    const yardMat = new THREE.MeshStandardMaterial({ color: 0x64748B, roughness: 0.95 });
    const yard = new THREE.Mesh(yardGeo, yardMat);
    yard.position.y = 0.2;
    yard.receiveShadow = true;
    oruGrp.add(yard);

    // T-1 Step-Up Power Transformer (10.5 / 220 kV)
    const t1BodyGeo = new THREE.BoxGeometry(8, 6, 7);
    const t1Mat = new THREE.MeshStandardMaterial({ color: 0x1E293B, metalness: 0.6, roughness: 0.4 });
    const t1 = new THREE.Mesh(t1BodyGeo, t1Mat);
    t1.position.set(-6, 3.4, 0);
    t1.castShadow = true;
    oruGrp.add(t1);

    // Conservator oil tank (cylinder on top)
    const tankGeo = new THREE.CylinderGeometry(1.2, 1.2, 6, 12);
    const tankMat = new THREE.MeshStandardMaterial({ color: 0x334155 });
    const tank = new THREE.Mesh(tankGeo, tankMat);
    tank.rotation.z = Math.PI / 2;
    tank.position.set(-6, 7.2, -1.8);
    oruGrp.add(tank);

    // High Voltage Bushings (3 Porcelain Insulator Horns for 220 kV phases)
    for (let b = 0; b < 3; b++) {
      const bushGeo = new THREE.CylinderGeometry(0.25, 0.45, 3.2, 8);
      const bushMat = new THREE.MeshStandardMaterial({ color: 0x94A3B8, roughness: 0.3 });
      const bushing = new THREE.Mesh(bushGeo, bushMat);
      bushing.position.set(-8.5 + b * 2.5, 8.0, 1.2);
      bushing.rotation.x = -0.25;
      oruGrp.add(bushing);
    }

    // Steel Gantry Frames & Busbars
    for (let g = 0; g < 2; g++) {
      const gantryP1 = this.createSteelPillar(14);
      gantryP1.position.set(6, 7, -10 + g * 20);
      oruGrp.add(gantryP1);

      const gantryP2 = this.createSteelPillar(14);
      gantryP2.position.set(6, 7, -5 + g * 20);
      oruGrp.add(gantryP2);

      const crossbar = new THREE.Mesh(
        new THREE.BoxGeometry(0.6, 0.6, 6),
        new THREE.MeshStandardMaterial({ color: 0xCBD5E1, metalness: 0.8 })
      );
      crossbar.position.set(6, 14, -7.5 + g * 20);
      oruGrp.add(crossbar);
    }

    // Substation Night Floodlight
    const floodLight = new THREE.PointLight(0xFFEA00, 0, 45);
    floodLight.position.set(0, 12, 0);
    oruGrp.add(floodLight);
    this.nightLights.push({ light: floodLight, targetIntensity: 2.2 });

    this.scene.add(oruGrp);
  }

  // 4. 220 kV Overhead Transmission Line (LEP Pylons across fields)
  buildTransmissionLine() {
    this.pylonPositions = [
      new THREE.Vector3(-25, 0, -25),
      new THREE.Vector3(5, 0, 5),
      new THREE.Vector3(35, 0, 35)
    ];

    for (let i = 0; i < this.pylonPositions.length; i++) {
      const pos = this.pylonPositions[i];
      const pylon = this.buildPylonModel();
      pylon.position.copy(pos);
      this.scene.add(pylon);
    }

    // Create Sagging 3-Phase Conductors between Pylons
    const wirePoints = [
      new THREE.Vector3(-42, 14, -42), // From Substation gantry
      new THREE.Vector3(-25, 24, -25), // Pylon 1
      new THREE.Vector3(5, 24, 5),     // Pylon 2
      new THREE.Vector3(35, 24, 35),   // Pylon 3
      new THREE.Vector3(55, 14, 45)    // To GPP Substation gantry
    ];

    for (let w = 0; w < wirePoints.length - 1; w++) {
      const p1 = wirePoints[w];
      const p2 = wirePoints[w + 1];

      // Draw 3 separate phase wires with catenary sag
      const phaseOffsets = [-1.6, 0, 1.6];
      for (const off of phaseOffsets) {
        const curve = new THREE.QuadraticBezierCurve3(
          new THREE.Vector3(p1.x + off, p1.y, p1.z - off),
          new THREE.Vector3((p1.x + p2.x) / 2 + off, (p1.y + p2.y) / 2 - 3.8, (p1.z + p2.z) / 2 - off),
          new THREE.Vector3(p2.x + off, p2.y, p2.z - off)
        );

        const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.1, 8, false);
        const tubeMat = new THREE.MeshStandardMaterial({
          color: 0x94A3B8,
          metalness: 0.9,
          roughness: 0.25
        });
        const wireMesh = new THREE.Mesh(tubeGeo, tubeMat);
        this.scene.add(wireMesh);

        // Animated current flow particles along wires
        for (let pt = 0; pt < 4; pt++) {
          const particle = new THREE.Mesh(
            new THREE.SphereGeometry(0.24, 8, 8),
            new THREE.MeshBasicMaterial({ color: 0x00FF87 })
          );
          this.scene.add(particle);
          this.currentParticles.push({
            mesh: particle,
            curve: curve,
            t: pt * 0.25
          });
        }
      }
    }
  }

  // Build Lattice Steel Pylon Model (LEP Ustuni)
  buildPylonModel() {
    const pylon = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color: 0xCBD5E1, metalness: 0.85, roughness: 0.3 });

    // 4 Corner Legs (Tapered upward)
    const height = 28;
    for (let x = -1; x <= 1; x += 2) {
      for (let z = -1; z <= 1; z += 2) {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.4, height, 6), mat);
        leg.position.set(x * 1.5, height / 2, z * 1.5);
        pylon.add(leg);
      }
    }

    // Crossarms (Traversalar) at height 20 and 24
    const cross1 = new THREE.Mesh(new THREE.BoxGeometry(10, 0.6, 0.6), mat);
    cross1.position.set(0, 22, 0);
    pylon.add(cross1);

    const cross2 = new THREE.Mesh(new THREE.BoxGeometry(8, 0.6, 0.6), mat);
    cross2.position.set(0, 26, 0);
    pylon.add(cross2);

    // Hanging Disc Insulator Strings
    for (let ins = -1; ins <= 1; ins++) {
      const insGeo = new THREE.CylinderGeometry(0.3, 0.3, 2.2, 8);
      const insMat = new THREE.MeshStandardMaterial({ color: 0x38BDF8, roughness: 0.2 });
      const insulator = new THREE.Mesh(insGeo, insMat);
      insulator.position.set(ins * 4, 20.8, 0);
      pylon.add(insulator);
    }

    return pylon;
  }

  createSteelPillar(h) {
    const geo = new THREE.CylinderGeometry(0.3, 0.4, h, 8);
    const mat = new THREE.MeshStandardMaterial({ color: 0x94A3B8, metalness: 0.8 });
    return new THREE.Mesh(geo, mat);
  }

  // 5. District Step-Down Substation (GPP-220/35/10 kV)
  buildDistrictSubstation() {
    const gppGrp = new THREE.Group();
    gppGrp.position.set(65, 0, 42);

    // Base
    const yard = new THREE.Mesh(
      new THREE.BoxGeometry(40, 0.4, 36),
      new THREE.MeshStandardMaterial({ color: 0x64748B })
    );
    yard.position.y = 0.2;
    gppGrp.add(yard);

    // 220/10 kV Step-Down Transformer
    const trGeo = new THREE.BoxGeometry(9, 6.5, 8);
    const trMat = new THREE.MeshStandardMaterial({ color: 0x1E293B, metalness: 0.6 });
    const tr = new THREE.Mesh(trGeo, trMat);
    tr.position.set(-6, 3.6, 0);
    gppGrp.add(tr);

    // Control Room Building
    const ctrlGeo = new THREE.BoxGeometry(16, 8, 12);
    const ctrlMat = new THREE.MeshStandardMaterial({ color: 0xF1F5F9 });
    const ctrl = new THREE.Mesh(ctrlGeo, ctrlMat);
    ctrl.position.set(10, 4.4, -4);
    gppGrp.add(ctrl);

    // GPP Night Light
    const pl = new THREE.PointLight(0xFFEA00, 0, 40);
    pl.position.set(0, 10, 0);
    gppGrp.add(pl);
    this.nightLights.push({ light: pl, targetIntensity: 2.0 });

    this.scene.add(gppGrp);
  }

  // 6. City Area with High-Rise Buildings & Factory
  buildCityAndIndustry() {
    const cityGrp = new THREE.Group();
    cityGrp.position.set(85, 0, -10);

    // 5 High-Rise Urban Buildings
    const bldColors = [0x1E293B, 0x334155, 0x0F172A, 0x475569];
    for (let b = 0; b < 6; b++) {
      const bh = 22 + Math.random() * 32;
      const bw = 10 + Math.random() * 6;
      const bGeo = new THREE.BoxGeometry(bw, bh, bw);
      const bMat = new THREE.MeshStandardMaterial({
        color: bldColors[b % bldColors.length],
        roughness: 0.3
      });
      const bld = new THREE.Mesh(bGeo, bMat);
      bld.position.set(-15 + (b % 3) * 18, bh / 2, -20 + Math.floor(b / 3) * 22);
      bld.castShadow = true;
      cityGrp.add(bld);
    }

    // Industrial Plant Factory with Smokestack
    const factGeo = new THREE.BoxGeometry(26, 12, 18);
    const factMat = new THREE.MeshStandardMaterial({ color: 0x64748B });
    const fact = new THREE.Mesh(factGeo, factMat);
    fact.position.set(25, 6, 15);
    cityGrp.add(fact);

    const chimneyGeo = new THREE.CylinderGeometry(1.2, 2.0, 28, 12);
    const chimneyMat = new THREE.MeshStandardMaterial({ color: 0xDC2626 });
    const chimney = new THREE.Mesh(chimneyGeo, chimneyMat);
    chimney.position.set(32, 14, 15);
    cityGrp.add(chimney);

    this.scene.add(cityGrp);
  }

  // 7. Village Area with Houses & KTP-10/0.4 kV Transformer Booth
  buildVillageAndKtp() {
    const vilGrp = new THREE.Group();
    vilGrp.position.set(98, 0, 80);

    // KTP-10/0.4 kV Metal Transformer Kiosk (Budka)
    const ktpGeo = new THREE.BoxGeometry(3.6, 3.8, 3.2);
    const ktpMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.7, roughness: 0.4 });
    const ktp = new THREE.Mesh(ktpGeo, ktpMat);
    ktp.position.set(0, 1.9, 0);
    ktp.castShadow = true;
    vilGrp.add(ktp);

    // High Voltage Warning Plate ⚡ (Yellow Triangle)
    const signGeo = new THREE.PlaneGeometry(0.8, 0.8);
    const signMat = new THREE.MeshBasicMaterial({ color: 0xFBBF24 });
    const sign = new THREE.Mesh(signGeo, signMat);
    sign.position.set(0, 2.4, 1.62);
    vilGrp.add(sign);

    // 0.4 kV Concrete Poles (SV-95 style) along village street
    for (let p = 0; p < 4; p++) {
      const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.24, 9, 8),
        new THREE.MeshStandardMaterial({ color: 0xCBD5E1 })
      );
      pole.position.set(10 + p * 12, 4.5, 10);
      vilGrp.add(pole);

      // Insulated Cable Line (SIP-4)
      if (p < 3) {
        const cable = new THREE.Mesh(
          new THREE.CylinderGeometry(0.06, 0.06, 12, 6),
          new THREE.MeshBasicMaterial({ color: 0x020617 })
        );
        cable.rotation.z = Math.PI / 2;
        cable.position.set(16 + p * 12, 8.5, 10);
        vilGrp.add(cable);
      }
    }

    // Rural Houses
    for (let h = 0; h < 4; h++) {
      const hBase = new THREE.Mesh(
        new THREE.BoxGeometry(8, 4.5, 7),
        new THREE.MeshStandardMaterial({ color: 0xF8FAFC })
      );
      hBase.position.set(12 + (h % 2) * 16, 2.25, 20 + Math.floor(h / 2) * 14);
      vilGrp.add(hBase);

      const roof = new THREE.Mesh(
        new THREE.ConeGeometry(6.2, 3.2, 4),
        new THREE.MeshStandardMaterial({ color: 0xDC2626 })
      );
      roof.rotation.y = Math.PI / 4;
      roof.position.set(hBase.position.x, 5.8, hBase.position.z);
      vilGrp.add(roof);
    }

    this.scene.add(vilGrp);
  }

  // 8. Target House Interior & Distribution Box
  buildHouseInterior() {
    const houseGrp = new THREE.Group();
    houseGrp.position.set(132, 0, 110);

    // House Walls (Cutaway style so interior is clearly visible)
    const floor = new THREE.Mesh(
      new THREE.BoxGeometry(16, 0.4, 14),
      new THREE.MeshStandardMaterial({ color: 0xCA8A04, roughness: 0.7 }) // Wood floor
    );
    floor.position.y = 0.2;
    houseGrp.add(floor);

    // Back Wall
    const backWall = new THREE.Mesh(
      new THREE.BoxGeometry(16, 8, 0.4),
      new THREE.MeshStandardMaterial({ color: 0xF1F5F9 })
    );
    backWall.position.set(0, 4.2, -7);
    houseGrp.add(backWall);

    // Side Wall
    const sideWall = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 8, 14),
      new THREE.MeshStandardMaterial({ color: 0xF8FAFC })
    );
    sideWall.position.set(-8, 4.2, 0);
    houseGrp.add(sideWall);

    // Electrical Distribution Panel (VRU Shchitok) on Back Wall
    const panelGeo = new THREE.BoxGeometry(2.4, 3.4, 0.4);
    const panelMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.6 });
    const panel = new THREE.Mesh(panelGeo, panelMat);
    panel.position.set(-4.5, 4.8, -6.6);
    houseGrp.add(panel);

    // Smart Electric Meter (Sanxing style) inside panel
    const meterGeo = new THREE.BoxGeometry(1.4, 1.8, 0.3);
    const meterMat = new THREE.MeshStandardMaterial({ color: 0x0F172A });
    const meter = new THREE.Mesh(meterGeo, meterMat);
    meter.position.set(-4.5, 5.2, -6.35);
    houseGrp.add(meter);

    // LCD screen of meter (Glowing Cyan)
    const lcdGeo = new THREE.PlaneGeometry(1.0, 0.55);
    const lcdMat = new THREE.MeshBasicMaterial({ color: 0x38BDF8 });
    const lcd = new THREE.Mesh(lcdGeo, lcdMat);
    lcd.position.set(-4.5, 5.45, -6.18);
    houseGrp.add(lcd);

    // Room Furniture & Appliances
    // 1. Smart TV on wall
    const tv = new THREE.Mesh(
      new THREE.BoxGeometry(5.2, 3.2, 0.2),
      new THREE.MeshStandardMaterial({ color: 0x020617, roughness: 0.1 })
    );
    tv.position.set(2.5, 4.5, -6.8);
    houseGrp.add(tv);

    // 2. Air Conditioner on top of wall
    const ac = new THREE.Mesh(
      new THREE.BoxGeometry(3.6, 1.1, 0.9),
      new THREE.MeshStandardMaterial({ color: 0xFFFFFF })
    );
    ac.position.set(-1.0, 7.2, -6.5);
    houseGrp.add(ac);

    // 3. Kitchen Table & Electric Kettle
    const table = new THREE.Mesh(
      new THREE.BoxGeometry(5.5, 0.3, 3.5),
      new THREE.MeshStandardMaterial({ color: 0x78350F })
    );
    table.position.set(-3.5, 2.6, 1.5);
    houseGrp.add(table);

    const kettle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.35, 0.45, 0.9, 12),
      new THREE.MeshStandardMaterial({ color: 0xEF4444, metalness: 0.8 })
    );
    kettle.position.set(-3.5, 3.2, 1.5);
    houseGrp.add(kettle);

    // Room Ceiling Light (Toggles with House Breaker)
    this.houseLight = new THREE.PointLight(0xFFFBE8, 1.5, 20);
    this.houseLight.position.set(0, 7.5, 0);
    houseGrp.add(this.houseLight);

    this.scene.add(houseGrp);
  }

  // =========================================================================
  // TIME OF DAY & WEATHER CONTROLLER
  // =========================================================================
  setTimeOfDay(hour) {
    // hour: 0 to 24
    const isNight = hour < 6 || hour > 19;
    const sunAngle = ((hour - 6) / 12) * Math.PI;

    if (!isNight) {
      // Daytime Sun
      this.sunLight.intensity = 1.3 * Math.sin(sunAngle);
      this.sunLight.position.x = -80 * Math.cos(sunAngle);
      this.sunLight.position.y = 120 * Math.sin(sunAngle);
      this.sunLight.color.setHex(hour < 8 || hour > 17 ? 0xFDBA74 : 0xFFFBE8); // Golden hour

      this.scene.background.setHex(0x87CEEB);
      this.scene.fog.color.setHex(0x87CEEB);
      this.ambientLight.intensity = 0.65;

      // Turn off night floodlights
      this.nightLights.forEach(nl => nl.light.intensity = 0);
    } else {
      // Nighttime Moonlight
      this.sunLight.intensity = 0.08;
      this.sunLight.color.setHex(0x38BDF8);
      this.scene.background.setHex(0x020617); // Deep night sky
      this.scene.fog.color.setHex(0x020617);
      this.ambientLight.intensity = 0.15;

      // Turn on night floodlights
      this.nightLights.forEach(nl => nl.light.intensity = nl.targetIntensity);
    }
  }

  // =========================================================================
  // ANIMATION LOOP
  // =========================================================================
  animate() {
    requestAnimationFrame(this.animate);
    const dt = this.clock.getDelta();

    // 1. Smooth Camera Transition to Target Hotspot
    this.camera.position.lerp(this.targetCamPos, 0.04);
    if (this.controls) {
      this.controls.target.lerp(this.targetCamLook, 0.04);
      this.controls.update();
    }

    // 2. Rotate Hydro Turbine Rotor based on water flow & gate opening
    if (this.turbineRotor && this.engine.ges.isRunning) {
      const speed = (this.engine.ges.gateOpenPercent / 100.0) * 8.0;
      this.turbineRotor.rotation.y += speed * dt;
    }

    // 3. Animate Current Flow Particles along Transmission Wires
    const isFlowing = this.engine.lep220.current > 1.0;
    const particleSpeed = Math.min(1.8, (this.engine.lep220.current / 400.0) + 0.2);

    for (const p of this.currentParticles) {
      if (!isFlowing) {
        p.mesh.visible = false;
        continue;
      }
      p.mesh.visible = true;
      p.t += particleSpeed * dt * 0.18;
      if (p.t > 1.0) p.t -= 1.0;

      const pos = p.curve.getPointAt(p.t);
      p.mesh.position.copy(pos);
    }

    // 4. Update House Ceiling Light according to breaker state
    if (this.houseLight) {
      const hasPower = this.engine.house.voltage > 100 && this.engine.house.appliances.lights.on;
      this.houseLight.intensity = hasPower ? 1.5 : 0;
    }

    // 5. Rotate Wind Turbines based on windSpeed
    const windSpeed = this.engine.wind.windSpeed;
    const isWindRunning = windSpeed >= this.engine.wind.cutInSpeed && windSpeed <= this.engine.wind.cutOutSpeed;
    const rotSpeed = isWindRunning ? Math.min(4.5, (windSpeed / 12.0) * 2.8) : 0;

    for (const rotor of this.windRotors) {
      rotor.rotation.z += rotSpeed * dt;
    }

    // 6. Tilt Solar Panels tracking the sun angle
    const isDay = this.engine.timeOfDay >= 6 && this.engine.timeOfDay <= 18;
    if (isDay) {
      const tiltAngle = ((this.engine.timeOfDay - 12) / 6) * 0.45;
      for (const panel of this.solarPanels) {
        panel.rotation.x = tiltAngle;
      }
    }

    // 7. Update BESS Status LEDs
    const bessP = this.engine.bess.powerMW;
    let bessColor = 0x64748B; // Idle
    if (bessP < -0.5) bessColor = 0x38BDF8; // Charging (Cyan)
    else if (bessP > 0.5) bessColor = 0x00FF87; // Discharging (Green)
    for (const led of this.bessLeds) {
      led.material.color.setHex(bessColor);
    }

    // 8. Animate Volumetric Clouds across the sky
    const cloudSpeed = Math.max(0.5, this.engine.wind.windSpeed * 0.25);
    for (const c of this.clouds) {
      c.position.x += cloudSpeed * dt;
      if (c.position.x > 240) c.position.x = -240;
    }

    // 9. Animate Moving Cars along Roads
    for (const car of this.trafficCars) {
      car.progress += dt * car.speed * 0.05;
      if (car.progress > 1.0) car.progress = 0;
      const pt = car.curve.getPointAt(car.progress);
      car.mesh.position.copy(pt);
      const tangent = car.curve.getTangentAt(car.progress);
      car.mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tangent);
    }

    // 10. Animate Waterfall Mist & Spray Particles
    for (const m of this.mistParticles) {
      m.mesh.position.y += dt * 3.5;
      m.mesh.position.x += (Math.random() - 0.5) * dt * 2.0;
      m.scale += dt * 0.4;
      m.mesh.scale.set(m.scale, m.scale, m.scale);
      m.mesh.material.opacity = Math.max(0, 0.6 - (m.mesh.position.y - 2) * 0.08);

      if (m.mesh.position.y > 9.0) {
        m.mesh.position.set(-70 + (Math.random() - 0.5) * 16, 2.0, -60 + (Math.random() - 0.5) * 4);
        m.scale = 0.5 + Math.random() * 0.5;
        m.mesh.scale.set(m.scale, m.scale, m.scale);
        m.mesh.material.opacity = 0.6;
      }
    }

    // 11. Drone Inspection Tour Mode (Cinematic Flythrough)
    if (this.isDroneTourActive && this.droneCurve) {
      this.droneTourProgress += dt * 0.016; // ~60 seconds total tour
      if (this.droneTourProgress > 1.0) {
        this.stopDroneInspection();
      } else {
        const camPos = this.droneCurve.getPointAt(this.droneTourProgress);
        this.camera.position.copy(camPos);
        const lookPos = this.droneCurve.getPointAt(Math.min(1.0, this.droneTourProgress + 0.03));
        if (this.controls) {
          this.controls.target.copy(lookPos);
        }
      }
    }

    this.renderer.render(this.scene, this.camera);
  }

  // =========================================================================
  // 9. BUILD SOLAR FARM (SES)
  // =========================================================================
  buildSolarFarm() {
    const solarGrp = new THREE.Group();
    solarGrp.position.set(20, 0, -45);

    // Gravel base pad
    const pad = new THREE.Mesh(
      new THREE.BoxGeometry(45, 0.3, 35),
      new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.9 })
    );
    pad.position.y = 0.15;
    pad.receiveShadow = true;
    solarGrp.add(pad);

    // 4 Rows of 5 Solar Panel Tables
    const panelGeo = new THREE.BoxGeometry(3.6, 0.1, 2.2);
    const panelMat = new THREE.MeshStandardMaterial({
      color: 0x0A2540, // Deep photovoltaic blue
      roughness: 0.15,
      metalness: 0.8
    });

    const standMat = new THREE.MeshStandardMaterial({ color: 0xCBD5E1, metalness: 0.8 });

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 5; c++) {
        const table = new THREE.Group();
        table.position.set(-16 + c * 8, 1.2, -12 + r * 8);

        // Stand legs
        const leg1 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.2), standMat);
        leg1.position.set(-1.2, -0.6, 0);
        table.add(leg1);
        const leg2 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.2), standMat);
        leg2.position.set(1.2, -0.6, 0);
        table.add(leg2);

        // Tiltable panel table
        const panelMesh = new THREE.Mesh(panelGeo, panelMat);
        panelMesh.rotation.x = -0.35; // Initial tilt towards south
        panelMesh.castShadow = true;
        table.add(panelMesh);

        this.solarPanels.push(panelMesh);
        solarGrp.add(table);
      }
    }

    // Central Inverter Kiosk
    const inv = new THREE.Mesh(
      new THREE.BoxGeometry(4.5, 3.2, 3.0),
      new THREE.MeshStandardMaterial({ color: 0xE2E8F0 })
    );
    inv.position.set(16, 1.6, 0);
    solarGrp.add(inv);

    this.scene.add(solarGrp);
  }

  // =========================================================================
  // 10. BUILD WIND FARM (VET)
  // =========================================================================
  buildWindFarm() {
    const windPositions = [
      new THREE.Vector3(-30, 0, 70),
      new THREE.Vector3(-10, 0, 85),
      new THREE.Vector3(-45, 0, 95)
    ];

    const towerMat = new THREE.MeshStandardMaterial({ color: 0xF1F5F9, roughness: 0.4 });
    const bladeMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.3 });

    for (let i = 0; i < windPositions.length; i++) {
      const pos = windPositions[i];
      const turbine = new THREE.Group();
      turbine.position.copy(pos);

      // Tower (32m high)
      const tower = new THREE.Mesh(
        new THREE.CylinderGeometry(0.8, 1.6, 32, 16),
        towerMat
      );
      tower.position.y = 16;
      tower.castShadow = true;
      turbine.add(tower);

      // Nacelle (Engine box on top)
      const nacelle = new THREE.Mesh(
        new THREE.BoxGeometry(2.4, 2.2, 5.0),
        towerMat
      );
      nacelle.position.set(0, 32, 0.8);
      nacelle.castShadow = true;
      turbine.add(nacelle);

      // Aviation Red Beacon Light on Nacelle
      const beacon = new THREE.PointLight(0xEF4444, 1.5, 18);
      beacon.position.set(0, 33.6, -1.2);
      turbine.add(beacon);

      // Rotor Hub (Nose cone)
      const rotor = new THREE.Group();
      rotor.position.set(0, 32, 3.4);

      const hub = new THREE.Mesh(
        new THREE.ConeGeometry(1.0, 1.8, 12),
        towerMat
      );
      hub.rotation.x = Math.PI / 2;
      rotor.add(hub);

      // 3 Blades (120 degrees apart)
      for (let b = 0; b < 3; b++) {
        const bladeGrp = new THREE.Group();
        bladeGrp.rotation.z = b * (Math.PI * 2 / 3);

        const blade = new THREE.Mesh(
          new THREE.BoxGeometry(0.7, 13, 0.15),
          bladeMat
        );
        blade.position.y = 6.5;
        blade.castShadow = true;
        bladeGrp.add(blade);
        rotor.add(bladeGrp);
      }

      turbine.add(rotor);
      this.windRotors.push(rotor);
      this.scene.add(turbine);
    }
  }

  // =========================================================================
  // 11. BUILD BESS BATTERY STORAGE PARK (50 MWh)
  // =========================================================================
  buildBessBatteryPark() {
    const bessGrp = new THREE.Group();
    bessGrp.position.set(70, 0, 50);

    // Concrete Pad
    const pad = new THREE.Mesh(
      new THREE.BoxGeometry(32, 0.3, 24),
      new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.9 })
    );
    pad.position.y = 0.15;
    pad.receiveShadow = true;
    bessGrp.add(pad);

    // 6 Tesla Megapack Style Battery Containers (2 rows of 3)
    const contGeo = new THREE.BoxGeometry(7.2, 3.0, 2.6);
    const contMat = new THREE.MeshStandardMaterial({
      color: 0xF8FAFC, // Crisp white industrial coating
      roughness: 0.3
    });

    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 3; c++) {
        const cont = new THREE.Mesh(contGeo, contMat);
        cont.position.set(-8 + c * 8, 1.6, -5 + r * 10);
        cont.castShadow = true;
        bessGrp.add(cont);

        // Status Indicator LED Bar on Container Front
        const ledBarGeo = new THREE.PlaneGeometry(1.6, 0.18);
        const ledBarMat = new THREE.MeshBasicMaterial({ color: 0x00FF87 });
        const ledBar = new THREE.Mesh(ledBarGeo, ledBarMat);
        ledBar.position.set(-8 + c * 8, 2.6, -5 + r * 10 + 1.32);
        bessGrp.add(ledBar);
        this.bessLeds.push(ledBar);
      }
    }

    // Bi-directional Inverter / PCS Station
    const pcs = new THREE.Mesh(
      new THREE.BoxGeometry(5.5, 3.5, 4.0),
      new THREE.MeshStandardMaterial({ color: 0x1E293B, metalness: 0.7 })
    );
    pcs.position.set(13, 1.8, 0);
    pcs.castShadow = true;
    bessGrp.add(pcs);

    this.scene.add(bessGrp);
  }

  // =========================================================================
  // 12. BUILD FOLIAGE & FORESTS (1,200+ Trees via InstancedMesh)
  // =========================================================================
  buildFoliageAndForests() {
    // 1. Pine Trees (700 instances) - Mountain ridges and hills
    const pineGeo = new THREE.ConeGeometry(2.4, 7.5, 6);
    const pineMat = new THREE.MeshStandardMaterial({ color: 0x1E3A1E, roughness: 0.8 });
    const pineMesh = new THREE.InstancedMesh(pineGeo, pineMat, 700);

    const dummy = new THREE.Object3D();
    let pineIdx = 0;

    // Mountain canyon forests
    for (let i = 0; i < 700; i++) {
      let x, z, y;
      // Clusters in mountain slopes and rural outskirts
      if (i < 450) {
        x = -130 + Math.random() * 110;
        z = -130 + Math.random() * 90;
        y = 3.5 + Math.random() * 8;
      } else {
        x = -80 + Math.random() * 180;
        z = 40 + Math.random() * 120;
        y = 3.5;
      }

      // Avoid placing trees in the river
      if (Math.abs(x - (-25 + z * 0.15)) < 16) continue;

      dummy.position.set(x, y, z);
      const s = 0.6 + Math.random() * 0.8;
      dummy.scale.set(s, s, s);
      dummy.rotation.y = Math.random() * Math.PI * 2;
      dummy.updateMatrix();
      pineMesh.setMatrixAt(pineIdx++, dummy.matrix);
    }
    pineMesh.count = pineIdx;
    pineMesh.castShadow = true;
    pineMesh.receiveShadow = true;
    this.scene.add(pineMesh);

    // 2. Deciduous & Poplar Trees (500 instances) - Village, riverbanks, city parks
    const popGeo = new THREE.SphereGeometry(2.5, 7, 7);
    const popMat = new THREE.MeshStandardMaterial({ color: 0x2D5A27, roughness: 0.7 });
    const popMesh = new THREE.InstancedMesh(popGeo, popMat, 500);

    let popIdx = 0;
    for (let i = 0; i < 500; i++) {
      let x, z;
      if (i < 250) {
        // Village gardens and street trees
        x = 80 + Math.random() * 70;
        z = 60 + Math.random() * 70;
      } else {
        // Riverbanks and road buffers
        x = -15 + Math.random() * 40;
        z = -40 + Math.random() * 140;
      }

      dummy.position.set(x, 4.0 + Math.random() * 2, z);
      const s = 0.7 + Math.random() * 0.9;
      dummy.scale.set(s, s * 1.3, s);
      dummy.rotation.y = Math.random() * Math.PI * 2;
      dummy.updateMatrix();
      popMesh.setMatrixAt(popIdx++, dummy.matrix);
    }
    popMesh.count = popIdx;
    popMesh.castShadow = true;
    this.scene.add(popMesh);
  }

  // =========================================================================
  // 13. BUILD ROADS & TRAFFIC (Asphalt Highway, Bridge & Moving Cars)
  // =========================================================================
  buildRoadsAndTraffic() {
    // 1. Concrete Bridge over the River
    const bridgeGeo = new THREE.BoxGeometry(10, 1.8, 38);
    const bridgeMat = new THREE.MeshStandardMaterial({ color: 0x94A3B8, roughness: 0.6 });
    const bridge = new THREE.Mesh(bridgeGeo, bridgeMat);
    bridge.position.set(-25, 2.2, 20);
    bridge.rotation.y = 0.25;
    bridge.castShadow = true;
    this.scene.add(bridge);

    // Bridge Guardrails
    for (let s = -1; s <= 1; s += 2) {
      const rail = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 1.1, 38),
        new THREE.MeshStandardMaterial({ color: 0xCBD5E1 })
      );
      rail.position.set(s * 4.8, 1.2, 0);
      bridge.add(rail);
    }

    // 2. Main Highway Curve (GES ➔ Substation ➔ Bridge ➔ GPP ➔ City/Village)
    const roadCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-65, 0.25, -55),
      new THREE.Vector3(-45, 0.25, -35),
      new THREE.Vector3(-25, 2.3, 20), // Across Bridge
      new THREE.Vector3(15, 0.25, 30),
      new THREE.Vector3(55, 0.25, 40), // Near GPP
      new THREE.Vector3(85, 0.25, 25), // Into City
      new THREE.Vector3(100, 0.25, 75) // Into Village
    ]);

    const roadGeo = new THREE.TubeGeometry(roadCurve, 64, 4.0, 4, false);
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x1E293B, roughness: 0.85 });
    const roadMesh = new THREE.Mesh(roadGeo, roadMat);
    roadMesh.scale.set(1, 0.05, 1); // Flatten into a ribbon road
    this.scene.add(roadMesh);

    // 3. Moving 3D Cars and Trucks along Highway
    const carColors = [0xDC2626, 0x2563EB, 0xFBBF24, 0xF8FAFC];
    for (let c = 0; c < 5; c++) {
      const carGrp = new THREE.Group();

      // Car body
      const body = new THREE.Mesh(
        new THREE.BoxGeometry(2.2, 1.2, 4.2),
        new THREE.MeshStandardMaterial({ color: carColors[c % carColors.length], roughness: 0.3 })
      );
      body.position.y = 0.8;
      body.castShadow = true;
      carGrp.add(body);

      // Cabin / Roof
      const roof = new THREE.Mesh(
        new THREE.BoxGeometry(1.8, 0.9, 2.4),
        new THREE.MeshStandardMaterial({ color: 0x0F172A })
      );
      roof.position.set(0, 1.8, -0.2);
      carGrp.add(roof);

      // Headlights (Twin white spots)
      const hl = new THREE.PointLight(0xFFFBE8, 0, 25);
      hl.position.set(0, 0.9, 2.5);
      carGrp.add(hl);
      this.nightLights.push({ light: hl, targetIntensity: 2.0 });

      this.scene.add(carGrp);
      this.trafficCars.push({
        mesh: carGrp,
        curve: roadCurve,
        progress: c * 0.2,
        speed: 0.8 + Math.random() * 0.4
      });
    }
  }

  // =========================================================================
  // 14. BUILD VOLUMETRIC CLOUDS & NIGHT STARS
  // =========================================================================
  buildAtmosphericCloudsAndStars() {
    // 1. Drifting Volumetric Cloud Clusters
    const cloudMat = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF,
      roughness: 0.9,
      transparent: true,
      opacity: 0.75
    });

    for (let i = 0; i < 14; i++) {
      const cloudGrp = new THREE.Group();
      const puffCount = 5 + Math.floor(Math.random() * 4);
      for (let p = 0; p < puffCount; p++) {
        const puff = new THREE.Mesh(
          new THREE.SphereGeometry(12 + Math.random() * 8, 8, 8),
          cloudMat
        );
        puff.position.set(
          (p - puffCount / 2) * 12 + Math.random() * 6,
          Math.random() * 5,
          Math.random() * 12
        );
        cloudGrp.add(puff);
      }
      cloudGrp.position.set(
        -200 + Math.random() * 400,
        95 + Math.random() * 35,
        -200 + Math.random() * 400
      );
      this.scene.add(cloudGrp);
      this.clouds.push(cloudGrp);
    }

    // 2. Starfield for Night Sky
    const starGeo = new THREE.BufferGeometry();
    const starCount = 1200;
    const starPos = new Float32Array(starCount * 3);
    for (let s = 0; s < starCount * 3; s += 3) {
      starPos[s] = (Math.random() - 0.5) * 800;
      starPos[s + 1] = 80 + Math.random() * 300;
      starPos[s + 2] = (Math.random() - 0.5) * 800;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xFFFFFF, size: 1.5, transparent: true, opacity: 0 });
    this.starPoints = new THREE.Points(starGeo, starMat);
    this.scene.add(this.starPoints);
  }

  // =========================================================================
  // 15. BUILD WATERFALL & MIST PARTICLES AT DAM
  // =========================================================================
  buildWaterfallAndSpray() {
    // Spillway foam cascade on dam face (-70, 10, -68)
    const fallGeo = new THREE.PlaneGeometry(16, 22);
    const fallMat = new THREE.MeshBasicMaterial({
      color: 0xBAE6FD,
      transparent: true,
      opacity: 0.8
    });
    const waterfall = new THREE.Mesh(fallGeo, fallMat);
    waterfall.position.set(-70, 11, -67.9);
    this.scene.add(waterfall);

    // Mist spray particles rising at base of dam
    const mistGeo = new THREE.SphereGeometry(1.8, 6, 6);
    for (let m = 0; m < 30; m++) {
      const mistMat = new THREE.MeshBasicMaterial({
        color: 0xE0F2FE,
        transparent: true,
        opacity: 0.5
      });
      const mist = new THREE.Mesh(mistGeo, mistMat);
      mist.position.set(-70 + (Math.random() - 0.5) * 16, 2.0 + Math.random() * 6, -62 + Math.random() * 6);
      this.scene.add(mist);
      this.mistParticles.push({
        mesh: mist,
        scale: 0.8 + Math.random() * 0.6
      });
    }
  }

  // =========================================================================
  // 16. DRONE INSPECTION TOUR (Cinematic Flythrough)
  // =========================================================================
  initDroneTourSpline() {
    this.droneCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-95, 55, -110), // Above Dam & Mountain
      new THREE.Vector3(-70, 22, -65),  // Hydro Powerhouse & Turbines
      new THREE.Vector3(-45, 20, -45),  // 220 kV Substation
      new THREE.Vector3(-25, 28, -20),  // Pylon 1 in fields
      new THREE.Vector3(20, 22, -45),   // Solar Farm
      new THREE.Vector3(-25, 45, 75),   // Wind Turbines
      new THREE.Vector3(55, 26, 35),    // GPP Substation
      new THREE.Vector3(75, 18, 55),    // BESS Battery Park
      new THREE.Vector3(95, 16, 78),    // Village KTP
      new THREE.Vector3(126, 10, 106)   // Inside Target House
    ]);
  }

  startDroneInspection() {
    this.isDroneTourActive = true;
    this.droneTourProgress = 0;
    if (window.toast) {
      window.toast("🚁 <b>Dron Ekskursiyasi Faol:</b> Kamera GESdan to xonadongacha butun elektr zanjiri bo'ylab uchmoqda!", 5000);
    }
  }

  stopDroneInspection() {
    this.isDroneTourActive = false;
    if (typeof this.onDroneTourEnd === 'function') {
      this.onDroneTourEnd();
    }
    if (window.toast) {
      window.toast("⏹️ Dron ekskursiyasi yakunlandi. Boshqaruv qo'lingizda.");
    }
  }
}

window.GridScene3D = GridScene3D;

