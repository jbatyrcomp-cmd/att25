/* ==========================================================================
   3D BREADBOARD & ELECTRONICS WORKBENCH (THREE.JS WEBGL)
   ATT-25 Circuit Lab 3D Real-time Virtual Breadboard
   Realistic Dupont Jumper Wires, High-Luminance Glowing Bulb & Physical Electronics
   ========================================================================== */

class Breadboard3D {
  constructor(containerId, engine) {
    this.container = document.getElementById(containerId);
    this.engine = engine;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.clock = new THREE.Clock();
    
    this.componentMeshes = new Map(); // comp.id -> THREE.Group
    this.wireRecords = []; // { wire, curve, tubeMesh, particleMeshes: [] }
    this.clickableObjects = [];

    this.init();
  }

  init() {
    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x070C18);

    // 2. Camera
    const aspect = this.container.clientWidth / this.container.clientHeight || 1;
    this.camera = new THREE.PerspectiveCamera(36, aspect, 0.1, 100);
    this.camera.position.set(0, 13, 16.5);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.container.appendChild(this.renderer.domElement);

    // 4. OrbitControls
    if (window.THREE && window.THREE.OrbitControls) {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.maxPolarAngle = Math.PI / 2 - 0.04;
      this.controls.minDistance = 5;
      this.controls.maxDistance = 35;
      this.controls.target.set(0, 0.6, 0);
    }

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xE2E8F0, 0.6);
    this.scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xFFFFFF, 0.85);
    keyLight.position.set(8, 20, 12);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.001;
    this.scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x38BDF8, 0.35);
    fillLight.position.set(-12, 12, -8);
    this.scene.add(fillLight);

    // 6. Build Environment
    this.buildWorkbench();
    this.buildBreadboardModel();

    // 7. Raycasting for 3D clicks & Interactive Wiring
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.pinHitboxes = [];
    this.wiringStartPin = null;
    this.activeWireColor = '#38BDF8';

    // Glowing Hover Ring for Pins
    const ringGeo = new THREE.RingGeometry(0.12, 0.24, 24);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00FF87, side: THREE.DoubleSide });
    this.hoverRing = new THREE.Mesh(ringGeo, ringMat);
    this.hoverRing.rotation.x = -Math.PI / 2;
    this.hoverRing.visible = false;
    this.scene.add(this.hoverRing);

    // Event listeners
    this.renderer.domElement.addEventListener('pointerdown', (e) => this.onPointerDown(e));
    this.renderer.domElement.addEventListener('pointermove', (e) => this.onPointerMove(e));
    this.renderer.domElement.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.cancelWiring();
    });
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.cancelWiring();
    });

    // 8. Resize listener
    window.addEventListener('resize', () => this.onResize());

    // 9. Start loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  buildWorkbench() {
    // Electronics Workbench Surface (Dark anti-static ESD mat with grid)
    const matGeo = new THREE.PlaneGeometry(36, 26);
    const matMat = new THREE.MeshStandardMaterial({
      color: 0x091122,
      roughness: 0.9,
      metalness: 0.1
    });
    const matMesh = new THREE.Mesh(matGeo, matMat);
    matMesh.rotation.x = -Math.PI / 2;
    matMesh.position.y = -0.05;
    matMesh.receiveShadow = true;
    this.scene.add(matMesh);

    // Grid lines on ESD mat
    const gridHelper = new THREE.GridHelper(34, 34, 0x1E293B, 0x0F172A);
    gridHelper.position.y = -0.04;
    this.scene.add(gridHelper);
  }

  buildBreadboardModel() {
    this.breadboardGroup = new THREE.Group();

    // Breadboard Body (White/Cream plastic slab with beveled edges)
    const bbGeo = new THREE.BoxGeometry(16.5, 0.75, 6.0);
    const bbMat = new THREE.MeshStandardMaterial({
      color: 0xF8FAFC,
      roughness: 0.35,
      metalness: 0.05
    });
    const bbMesh = new THREE.Mesh(bbGeo, bbMat);
    bbMesh.position.y = 0.375;
    bbMesh.castShadow = true;
    bbMesh.receiveShadow = true;
    this.breadboardGroup.add(bbMesh);

    // Center DIP trough groove
    const troughGeo = new THREE.BoxGeometry(15.6, 0.2, 0.5);
    const troughMat = new THREE.MeshStandardMaterial({ color: 0xCBD5E1, roughness: 0.7 });
    const troughMesh = new THREE.Mesh(troughGeo, troughMat);
    troughMesh.position.set(0, 0.7, 0);
    this.breadboardGroup.add(troughMesh);

    // Power Rail Colored Silkscreen Lines
    const lineGeo = new THREE.BoxGeometry(15.2, 0.02, 0.07);
    const redMat = new THREE.MeshBasicMaterial({ color: 0xEF4444 });
    const blueMat = new THREE.MeshBasicMaterial({ color: 0x0284C7 });

    // Top + (Red) & - (Blue)
    const topRed = new THREE.Mesh(lineGeo, redMat);
    topRed.position.set(0, 0.76, -2.55);
    this.breadboardGroup.add(topRed);

    const topBlue = new THREE.Mesh(lineGeo, blueMat);
    topBlue.position.set(0, 0.76, -2.05);
    this.breadboardGroup.add(topBlue);

    // Bottom + (Red) & - (Blue)
    const botRed = new THREE.Mesh(lineGeo, redMat);
    botRed.position.set(0, 0.76, 2.1);
    this.breadboardGroup.add(botRed);

    const botBlue = new THREE.Mesh(lineGeo, blueMat);
    botBlue.position.set(0, 0.76, 2.6);
    this.breadboardGroup.add(botBlue);

    // Generate 3D Holes Grid
    const holeGeo = new THREE.PlaneGeometry(0.12, 0.12);
    const holeMat = new THREE.MeshBasicMaterial({ color: 0x0F172A });
    const cols = 30;
    const startX = -7.2;
    const stepX = 14.4 / cols;

    for (let c = 0; c < cols; c++) {
      const hx = startX + c * stepX;

      // Top 5 rows (a-e)
      for (let r = 0; r < 5; r++) {
        const hz = -1.55 + r * 0.27;
        const h = new THREE.Mesh(holeGeo, holeMat);
        h.rotation.x = -Math.PI / 2;
        h.position.set(hx, 0.76, hz);
        this.breadboardGroup.add(h);
      }

      // Bottom 5 rows (f-j)
      for (let r = 0; r < 5; r++) {
        const hz = 0.45 + r * 0.27;
        const h = new THREE.Mesh(holeGeo, holeMat);
        h.rotation.x = -Math.PI / 2;
        h.position.set(hx, 0.76, hz);
        this.breadboardGroup.add(h);
      }

      // Power rail holes
      const p1 = new THREE.Mesh(holeGeo, holeMat);
      p1.rotation.x = -Math.PI / 2;
      p1.position.set(hx, 0.76, -2.45);
      this.breadboardGroup.add(p1);

      const p2 = new THREE.Mesh(holeGeo, holeMat);
      p2.rotation.x = -Math.PI / 2;
      p2.position.set(hx, 0.76, -2.15);
      this.breadboardGroup.add(p2);

      const p3 = new THREE.Mesh(holeGeo, holeMat);
      p3.rotation.x = -Math.PI / 2;
      p3.position.set(hx, 0.76, 2.2);
      this.breadboardGroup.add(p3);

      const p4 = new THREE.Mesh(holeGeo, holeMat);
      p4.rotation.x = -Math.PI / 2;
      p4.position.set(hx, 0.76, 2.5);
      this.breadboardGroup.add(p4);
    }

    this.scene.add(this.breadboardGroup);
  }

  /* ==========================================================================
     SYNCHRONIZE 3D COMPONENTS & REALISTIC WIRES FROM 2D ENGINE
     ========================================================================== */
  syncFromEngine() {
    // 1. Remove old component meshes
    this.componentMeshes.forEach(mesh => this.scene.remove(mesh));
    this.componentMeshes.clear();

    // 2. Remove old wire tubes, boots, and particles
    this.wireRecords.forEach(wr => {
      this.scene.remove(wr.tubeMesh);
      if (wr.startBoot) this.scene.remove(wr.startBoot);
      if (wr.endBoot) this.scene.remove(wr.endBoot);
      wr.particleMeshes.forEach(p => this.scene.remove(p.mesh));
    });
    this.wireRecords = [];
    this.clickableObjects = [];

    // Intelligent physical breadboard layout
    // 9V Battery sits on the workbench to the left of the breadboard
    // Other components sit in organized terminal strip rows
    const comp3DPositions = new Map();
    let terminalColOffset = -4.5;

    for (const comp of this.engine.components) {
      if (comp.type === 'battery') {
        comp3DPositions.set(comp.id, new THREE.Vector3(-10.2, 0.0, 0));
      } else {
        // Distribute components across breadboard columns
        comp3DPositions.set(comp.id, new THREE.Vector3(terminalColOffset, 0.75, (comp.type === 'switch' ? -0.8 : (comp.type === 'bulb' ? 0.3 : 0))));
        terminalColOffset += 3.8;
      }
    }

    // 3. Build 3D Components
    for (const comp of this.engine.components) {
      const pos3 = comp3DPositions.get(comp.id) || new THREE.Vector3(0, 0.75, 0);
      const grp = new THREE.Group();
      grp.position.copy(pos3);
      grp.userData = { comp };

      if (comp.type === 'battery') {
        this.build3DBattery(grp, comp);
      } else if (comp.type === 'resistor') {
        this.build3DResistor(grp, comp);
      } else if (comp.type === 'bulb') {
        this.build3DBulb(grp, comp);
      } else if (comp.type === 'led') {
        this.build3DLed(grp, comp);
      } else if (comp.type === 'switch') {
        this.build3DSwitch(grp, comp);
      } else if (comp.type === 'buzzer') {
        this.build3DBuzzer(grp, comp);
      } else if (comp.type === 'potentiometer') {
        this.build3DPotentiometer(grp, comp);
      } else if (comp.type === 'ldr') {
        this.build3DLdr(grp, comp);
      } else if (comp.type === 'capacitor') {
        this.build3DCapacitor(grp, comp);
      } else if (comp.type === 'transistor_npn') {
        this.build3DTransistor(grp, comp);
      } else if (comp.type === 'motor') {
        this.build3DMotor(grp, comp);
      } else if (comp.type && comp.type.startsWith('gate_')) {
        this.build3DLogicGate(grp, comp);
      } else if (comp.type === 'seven_segment') {
        this.build3DSevenSegment(grp, comp);
      } else if (comp.type === 'timer_555') {
        this.build3DTimer555(grp, comp);
      } else if (comp.type === 'arduino_uno') {
        this.build3DArduino(grp, comp);
      }

      this.scene.add(grp);
      this.componentMeshes.set(comp.id, grp);
    }

    // 4. Build Realistic Dupont Jumper Wires
    const particleGeo = new THREE.SphereGeometry(0.08, 8, 8);
    const particleMat = new THREE.MeshBasicMaterial({ color: 0xFFEA00 }); // Brilliant incandescent gold

    let wireIndex = 0;
    for (const wire of this.engine.wires) {
      const pFrom = this.engine.getPinById(wire.fromPinId);
      const pTo = this.engine.getPinById(wire.toPinId);
      if (!pFrom || !pTo) continue;

      const grp1 = this.componentMeshes.get(pFrom.comp.id);
      const grp2 = this.componentMeshes.get(pTo.comp.id);
      if (!grp1 || !grp2) continue;

      // Exact pin terminal offset in 3D
      const getPinOffset3D = (comp, pin) => {
        if (comp.type === 'battery') {
          return new THREE.Vector3(pin.name === '+' ? -0.45 : 0.45, 2.65, 0);
        } else if (comp.type === 'resistor') {
          return new THREE.Vector3(pin.name === '1' ? -0.7 : 0.7, 0.05, 0);
        } else if (comp.type === 'bulb') {
          return new THREE.Vector3(pin.name === 'A' ? -0.65 : 0.65, 0.05, 0);
        } else if (comp.type === 'led') {
          return new THREE.Vector3(pin.name.includes('+') ? -0.25 : 0.25, 0.05, 0);
        } else if (comp.type === 'switch') {
          return new THREE.Vector3(pin.name === '1' ? -0.55 : 0.55, 0.05, 0);
        } else if (comp.type === 'buzzer') {
          return new THREE.Vector3(pin.name === '+' ? -0.45 : 0.45, 0.05, 0);
        } else if (comp.type === 'potentiometer') {
          if (pin.name === '1') return new THREE.Vector3(-0.6, 0.05, 0.35);
          if (pin.name === 'W') return new THREE.Vector3(0, 0.05, -0.35);
          if (pin.name === '2') return new THREE.Vector3(0.6, 0.05, 0.35);
        } else if (comp.type === 'ldr') {
          return new THREE.Vector3(pin.name === '1' ? -0.45 : 0.45, 0.05, 0);
        } else if (comp.type === 'capacitor') {
          return new THREE.Vector3(pin.name === '+' ? -0.35 : 0.35, 0.05, 0);
        } else if (comp.type === 'transistor_npn') {
          if (pin.name === 'C') return new THREE.Vector3(0.35, 0.05, -0.3);
          if (pin.name === 'B') return new THREE.Vector3(-0.35, 0.05, 0);
          if (pin.name === 'E') return new THREE.Vector3(0.35, 0.05, 0.3);
        } else if (comp.type === 'motor') {
          return new THREE.Vector3(pin.name === '+' ? -0.7 : 0.7, 0.05, 0);
        } else if (comp.type && comp.type.startsWith('gate_')) {
          if (pin.name === 'A') return new THREE.Vector3(-0.55, 0.05, -0.25);
          if (pin.name === 'B') return new THREE.Vector3(-0.55, 0.05, 0.25);
          if (pin.name === 'Y') return new THREE.Vector3(0.55, 0.05, 0);
        } else if (comp.type === 'seven_segment') {
          const idx = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'GND'].indexOf(pin.name);
          if (idx >= 0 && idx < 4) {
            return new THREE.Vector3(-0.6 + idx * 0.4, 0.05, -0.65);
          } else if (idx >= 4) {
            return new THREE.Vector3(-0.6 + (idx - 4) * 0.4, 0.05, 0.65);
          }
        } else if (comp.type === 'timer_555') {
          const pName = pin.name.split(':')[0];
          if (pName === '1') return new THREE.Vector3(-0.55, 0.05, -0.45);
          if (pName === '2') return new THREE.Vector3(-0.55, 0.05, -0.15);
          if (pName === '3') return new THREE.Vector3(-0.55, 0.05, 0.15);
          if (pName === '4') return new THREE.Vector3(-0.55, 0.05, 0.45);
          if (pName === '8') return new THREE.Vector3(0.55, 0.05, -0.45);
          if (pName === '7') return new THREE.Vector3(0.55, 0.05, -0.15);
          if (pName === '6') return new THREE.Vector3(0.55, 0.05, 0.15);
          if (pName === '5') return new THREE.Vector3(0.55, 0.05, 0.45);
        } else if (comp.type === 'arduino_uno') {
          return new THREE.Vector3(pin.relX * 0.045, 0.45, pin.relY * 0.045);
        }
        return new THREE.Vector3(0, 0.05, 0);
      };

      // 3b. Create Pin Hitboxes for Interactive 3D Wiring
      this.pinHitboxes = [];
      const hitboxGeo = new THREE.SphereGeometry(0.3, 8, 8);
      const hitboxMat = new THREE.MeshBasicMaterial({ visible: false });

      for (const comp of this.engine.components) {
        const grp = this.componentMeshes.get(comp.id);
        if (!grp) continue;
        for (const pin of comp.pins) {
          const offset = getPinOffset3D(comp, pin);
          const worldPos = grp.position.clone().add(offset);
          const hitMesh = new THREE.Mesh(hitboxGeo, hitboxMat);
          hitMesh.position.copy(worldPos);
          hitMesh.userData = { isPin: true, comp, pin, worldPos };
          this.scene.add(hitMesh);
          this.pinHitboxes.push(hitMesh);
        }
      }

      const startWorld = grp1.position.clone().add(getPinOffset3D(pFrom.comp, pFrom.pin));
      const endWorld = grp2.position.clone().add(getPinOffset3D(pTo.comp, pTo.pin));

      // Dupont Connector Boots (Sleek black/colored plastic collars with metal pins)
      const bootMat = new THREE.MeshStandardMaterial({
        color: 0x1E293B, // Classic black Dupont housing
        roughness: 0.4,
        metalness: 0.1
      });
      const pinMat = new THREE.MeshStandardMaterial({ color: 0xE2E8F0, metalness: 0.95 });

      const bootGeo = new THREE.BoxGeometry(0.2, 0.42, 0.2);
      const pinGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.35, 8);

      // Start Boot & Pin
      const startBoot = new THREE.Group();
      const sBody = new THREE.Mesh(bootGeo, bootMat);
      sBody.position.y = 0.21;
      sBody.castShadow = true;
      startBoot.add(sBody);
      const sPin = new THREE.Mesh(pinGeo, pinMat);
      sPin.position.y = -0.1;
      startBoot.add(sPin);
      startBoot.position.copy(startWorld);
      this.scene.add(startBoot);

      // End Boot & Pin
      const endBoot = new THREE.Group();
      const eBody = new THREE.Mesh(bootGeo, bootMat);
      eBody.position.y = 0.21;
      eBody.castShadow = true;
      endBoot.add(eBody);
      const ePin = new THREE.Mesh(pinGeo, pinMat);
      ePin.position.y = -0.1;
      endBoot.add(ePin);
      endBoot.position.copy(endWorld);
      this.scene.add(endBoot);

      // Graceful, natural 3D arching curve
      const dist = startWorld.distanceTo(endWorld);
      const archH = Math.max(1.2, 0.6 + dist * 0.28);

      // Stagger wire lateral curve so parallel wires don't overlap
      const lateralOffset = (wireIndex % 2 === 0 ? 1 : -1) * (0.35 + (wireIndex * 0.15));
      const midPoint = new THREE.Vector3(
        (startWorld.x + endWorld.x) / 2,
        Math.max(startWorld.y, endWorld.y) + archH,
        (startWorld.z + endWorld.z) / 2 + lateralOffset
      );

      const p0 = startWorld.clone().add(new THREE.Vector3(0, 0.42, 0));
      const p1 = startWorld.clone().add(new THREE.Vector3(0, 0.75, 0));
      const p2 = midPoint;
      const p3 = endWorld.clone().add(new THREE.Vector3(0, 0.75, 0));
      const p4 = endWorld.clone().add(new THREE.Vector3(0, 0.42, 0));

      const curve = new THREE.CatmullRomCurve3([p0, p1, p2, p3, p4]);
      const tubeGeo = new THREE.TubeGeometry(curve, 36, 0.058, 8, false);
      const tubeMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(wire.color || 0x38BDF8),
        roughness: 0.35,
        metalness: 0.15
      });
      const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
      tubeMesh.castShadow = true;
      this.scene.add(tubeMesh);

      // 6 Dynamic 3D Current Particles per wire
      const particleMeshes = [];
      for (let i = 0; i < 6; i++) {
        const pMesh = new THREE.Mesh(particleGeo, particleMat);
        pMesh.visible = false;
        this.scene.add(pMesh);
        particleMeshes.push({ mesh: pMesh, t: i / 6 });
      }

      this.wireRecords.push({ wire, curve, tubeMesh, startBoot, endBoot, particleMeshes });
      wireIndex++;
    }
  }

  /* ==========================================================================
     HIGH-FIDELITY 3D COMPONENT BUILDERS
     ========================================================================== */
  build3DBattery(grp, comp) {
    // 9V Krona Block Body (Sits on workbench beside breadboard)
    const bGeo = new THREE.BoxGeometry(1.7, 2.5, 1.1);
    const bMat = new THREE.MeshStandardMaterial({ color: 0x1E293B, roughness: 0.3, metalness: 0.3 });
    const bMesh = new THREE.Mesh(bGeo, bMat);
    bMesh.position.y = 1.25;
    bMesh.castShadow = true;
    grp.add(bMesh);

    // Battery Blue Label/Cap
    const capGeo = new THREE.BoxGeometry(1.7, 0.25, 1.1);
    const capMat = new THREE.MeshStandardMaterial({ color: 0x0284C7, roughness: 0.35 });
    const capMesh = new THREE.Mesh(capGeo, capMat);
    capMesh.position.y = 2.52;
    grp.add(capMesh);

    // Metal Snap Terminals (+ Hexagonal and - Round)
    const tMat = new THREE.MeshStandardMaterial({ color: 0xE2E8F0, metalness: 0.95, roughness: 0.15 });

    const tPos = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.35, 6), tMat);
    tPos.position.set(-0.45, 2.7, 0);
    tPos.castShadow = true;
    grp.add(tPos);

    const tNeg = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.35, 16), tMat);
    tNeg.position.set(0.45, 2.7, 0);
    tNeg.castShadow = true;
    grp.add(tNeg);
  }

  build3DResistor(grp, comp) {
    // Ceramic body
    const bodyGeo = new THREE.CylinderGeometry(0.26, 0.26, 1.15, 16);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xD6B588, roughness: 0.6 });
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    bodyMesh.rotation.z = Math.PI / 2;
    bodyMesh.position.y = 0.55;
    bodyMesh.castShadow = true;
    grp.add(bodyMesh);

    // Bent Metal Leads going into breadboard holes
    const leadMat = new THREE.MeshStandardMaterial({ color: 0xCBD5E1, metalness: 0.85, roughness: 0.25 });
    const l1 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.7, 8), leadMat);
    l1.position.set(-0.7, 0.25, 0);
    grp.add(l1);

    const l2 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.7, 8), leadMat);
    l2.position.set(0.7, 0.25, 0);
    grp.add(l2);

    // 4 Color Bands
    const bands = comp.getColorBands ? comp.getColorBands() : ['#8B4513', '#000000', '#EF4444', '#D4AF37'];
    const bPos = [-0.35, -0.15, 0.05, 0.3];
    bands.forEach((c, idx) => {
      const bandMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.27, 0.27, 0.08, 16),
        new THREE.MeshBasicMaterial({ color: new THREE.Color(c) })
      );
      bandMesh.rotation.z = Math.PI / 2;
      bandMesh.position.set(bPos[idx], 0.55, 0);
      grp.add(bandMesh);
    });
  }

  build3DBulb(grp, comp) {
    // 1. Socket Base (Black plastic breadboard holder with terminal screws)
    const holderGeo = new THREE.BoxGeometry(1.6, 0.35, 1.2);
    const holderMat = new THREE.MeshStandardMaterial({ color: 0x1E293B, roughness: 0.6 });
    const holderMesh = new THREE.Mesh(holderGeo, holderMat);
    holderMesh.position.y = 0.18;
    holderMesh.castShadow = true;
    grp.add(holderMesh);

    // Brass screw base
    const baseGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.6, 20);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0xD4AF37, metalness: 0.8, roughness: 0.25 });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = 0.55;
    baseMesh.castShadow = true;
    grp.add(baseMesh);

    // 2. Glass Envelope (Prominent, large, glowing globe)
    const glassGeo = new THREE.SphereGeometry(1.05, 28, 28);
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0xE8F0FE,
      emissive: 0x000000,
      emissiveIntensity: 0,
      roughness: 0.1,
      metalness: 0.05,
      transparent: true,
      opacity: 0.65
    });
    const glassMesh = new THREE.Mesh(glassGeo, glassMat);
    glassMesh.position.y = 1.65;
    glassMesh.castShadow = true;
    grp.add(glassMesh);

    // 3. Glowing Volfram Filament (Double-coiled tungsten loop)
    const fGeo = new THREE.TorusGeometry(0.28, 0.055, 10, 24, Math.PI);
    const filamentMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      emissive: 0x000000,
      emissiveIntensity: 0,
      roughness: 0.3
    });
    const fMesh = new THREE.Mesh(fGeo, filamentMat);
    fMesh.position.y = 1.6;
    grp.add(fMesh);

    // 4. White-Hot Luminous Center Core
    const coreGeo = new THREE.SphereGeometry(0.35, 16, 16);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xFFFFFF,
      transparent: true,
      opacity: 0.0
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.position.y = 1.65;
    grp.add(coreMesh);

    // 5. Inner Warm Glowing Plasma Volume (Additive blending)
    const haloGeo = new THREE.SphereGeometry(0.85, 16, 16);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xFFB703,
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    haloMesh.position.y = 1.65;
    grp.add(haloMesh);

    // 6. Outer Radiant Bloom Aura (Expands softly around bulb)
    const auraGeo = new THREE.SphereGeometry(1.8, 16, 16);
    const auraMat = new THREE.MeshBasicMaterial({
      color: 0xFFA500,
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending
    });
    const auraMesh = new THREE.Mesh(auraGeo, auraMat);
    auraMesh.position.y = 1.65;
    grp.add(auraMesh);

    // 7. Dynamic Warm PointLight (Illuminates bulb, base, breadboard, and workbench!)
    const bulbLight = new THREE.PointLight(0xFFA500, 0, 14, 1.2);
    bulbLight.position.set(0, 1.65, 0);
    bulbLight.castShadow = true;
    bulbLight.shadow.bias = -0.002;
    grp.add(bulbLight);

    // Store references in group for animate()
    grp.userData.bulbLight = bulbLight;
    grp.userData.filamentMat = filamentMat;
    grp.userData.glassMat = glassMat;
    grp.userData.coreMat = coreMat;
    grp.userData.haloMat = haloMat;
    grp.userData.auraMat = auraMat;
    grp.userData.haloMesh = haloMesh;
    grp.userData.auraMesh = auraMesh;
  }

  build3DLed(grp, comp) {
    const ledColor = comp.ledColor || '#EF4444';

    // Transparent Colored Dome
    const domeGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.75, 16);
    const ledDomeMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(ledColor),
      emissive: new THREE.Color(ledColor),
      emissiveIntensity: 0.1,
      transparent: true,
      opacity: 0.88,
      roughness: 0.2
    });
    const domeMesh = new THREE.Mesh(domeGeo, ledDomeMat);
    domeMesh.position.y = 0.55;
    grp.add(domeMesh);

    const topGeo = new THREE.SphereGeometry(0.35, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const topMesh = new THREE.Mesh(topGeo, ledDomeMat);
    topMesh.position.y = 0.92;
    grp.add(topMesh);

    // Metal Legs
    const legMat = new THREE.MeshStandardMaterial({ color: 0xCBD5E1, metalness: 0.9 });
    const leg1 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.6, 8), legMat);
    leg1.position.set(-0.25, 0.2, 0);
    grp.add(leg1);

    const leg2 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.6, 8), legMat);
    leg2.position.set(0.25, 0.2, 0);
    grp.add(leg2);

    // LED PointLight
    const ledLight = new THREE.PointLight(new THREE.Color(ledColor), 0, 7, 1.6);
    ledLight.position.set(0, 0.8, 0);
    grp.add(ledLight);

    grp.userData.ledLight = ledLight;
    grp.userData.ledDomeMat = ledDomeMat;
  }

  build3DSwitch(grp, comp) {
    // Switch Case
    const cGeo = new THREE.BoxGeometry(1.3, 0.65, 0.85);
    const cMat = new THREE.MeshStandardMaterial({ color: 0x1E293B, roughness: 0.5 });
    const cMesh = new THREE.Mesh(cGeo, cMat);
    cMesh.position.y = 0.32;
    cMesh.castShadow = true;
    grp.add(cMesh);

    // Toggle Lever
    const levGeo = new THREE.CylinderGeometry(0.09, 0.13, 0.85, 12);
    const levMat = new THREE.MeshStandardMaterial({ color: 0xEF4444, metalness: 0.3 });
    const levMesh = new THREE.Mesh(levGeo, levMat);
    levMesh.position.y = 0.85;
    levMesh.rotation.z = comp.isOpen ? 0.45 : -0.45;
    grp.add(levMesh);

    grp.userData.switchLeverMesh = levMesh;

    // Make clickable
    cMesh.userData = { isSwitch: true, comp, grp };
    levMesh.userData = { isSwitch: true, comp, grp };
    this.clickableObjects.push(cMesh, levMesh);
  }

  build3DBuzzer(grp, comp) {
    const bGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.8, 20);
    const bMat = new THREE.MeshStandardMaterial({ color: 0x0F172A, roughness: 0.6 });
    const bMesh = new THREE.Mesh(bGeo, bMat);
    bMesh.position.y = 0.4;
    bMesh.castShadow = true;
    grp.add(bMesh);

    // Center hole
    const hGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.05, 12);
    const hMat = new THREE.MeshBasicMaterial({ color: 0x020617 });
    const hMesh = new THREE.Mesh(hGeo, hMat);
    hMesh.position.y = 0.81;
    grp.add(hMesh);
  }

  build3DPotentiometer(grp, comp) {
    // Blue rectangular body
    const bodyGeo = new THREE.BoxGeometry(1.4, 0.7, 1.1);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x0284C7, roughness: 0.35, metalness: 0.2 });
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    bodyMesh.position.y = 0.35;
    bodyMesh.castShadow = true;
    grp.add(bodyMesh);

    // Rotary metal shaft/dial
    const dialGrp = new THREE.Group();
    dialGrp.position.set(0, 0.7, 0);

    const shaftGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.6, 20);
    const shaftMat = new THREE.MeshStandardMaterial({ color: 0xE2E8F0, metalness: 0.9, roughness: 0.2 });
    const shaftMesh = new THREE.Mesh(shaftGeo, shaftMat);
    shaftMesh.position.y = 0.3;
    shaftMesh.castShadow = true;
    dialGrp.add(shaftMesh);

    // Dial notch indicator
    const notchGeo = new THREE.BoxGeometry(0.08, 0.62, 0.16);
    const notchMat = new THREE.MeshBasicMaterial({ color: 0xEF4444 });
    const notchMesh = new THREE.Mesh(notchGeo, notchMat);
    notchMesh.position.set(0, 0.3, 0.22);
    dialGrp.add(notchMesh);

    grp.add(dialGrp);
    grp.userData.potDialGrp = dialGrp;

    // 3 Pins
    const pinMat = new THREE.MeshStandardMaterial({ color: 0xCBD5E1, metalness: 0.9 });
    const pGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.5, 8);
    const p1 = new THREE.Mesh(pGeo, pinMat); p1.position.set(-0.6, 0.1, 0.35); grp.add(p1);
    const pW = new THREE.Mesh(pGeo, pinMat); pW.position.set(0, 0.1, -0.35); grp.add(pW);
    const p2 = new THREE.Mesh(pGeo, pinMat); p2.position.set(0.6, 0.1, 0.35); grp.add(p2);
  }

  build3DLdr(grp, comp) {
    // Ceramic disc body
    const discGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.15, 24);
    const discMat = new THREE.MeshStandardMaterial({ color: 0xD97706, roughness: 0.65 });
    const discMesh = new THREE.Mesh(discGeo, discMat);
    discMesh.position.y = 0.55;
    discMesh.castShadow = true;
    grp.add(discMesh);

    // Sinuous serpentine CdS track
    const trackGeo = new THREE.TorusGeometry(0.3, 0.035, 8, 20);
    const trackMat = new THREE.MeshBasicMaterial({ color: 0xEF4444 });
    const trackMesh = new THREE.Mesh(trackGeo, trackMat);
    trackMesh.rotation.x = Math.PI / 2;
    trackMesh.position.y = 0.63;
    grp.add(trackMesh);

    // Transparent epoxy dome
    const domeGeo = new THREE.SphereGeometry(0.5, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const domeMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0.55, roughness: 0.1 });
    const domeMesh = new THREE.Mesh(domeGeo, domeMat);
    domeMesh.position.y = 0.62;
    grp.add(domeMesh);

    // Legs
    const legMat = new THREE.MeshStandardMaterial({ color: 0xCBD5E1, metalness: 0.85 });
    const l1 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.6, 8), legMat);
    l1.position.set(-0.45, 0.25, 0); grp.add(l1);
    const l2 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.6, 8), legMat);
    l2.position.set(0.45, 0.25, 0); grp.add(l2);
  }

  build3DCapacitor(grp, comp) {
    // Royal blue electrolytic can
    const canGeo = new THREE.CylinderGeometry(0.44, 0.44, 1.35, 20);
    const canMat = new THREE.MeshStandardMaterial({ color: 0x1E40AF, roughness: 0.35, metalness: 0.25 });
    const canMesh = new THREE.Mesh(canGeo, canMat);
    canMesh.position.y = 0.75;
    canMesh.castShadow = true;
    grp.add(canMesh);

    // Silver top vent cross
    const topGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.02, 20);
    const topMat = new THREE.MeshStandardMaterial({ color: 0xE2E8F0, metalness: 0.95, roughness: 0.15 });
    const topMesh = new THREE.Mesh(topGeo, topMat);
    topMesh.position.y = 1.43;
    grp.add(topMesh);

    // Negative polarity white stripe
    const stripeGeo = new THREE.PlaneGeometry(0.18, 1.3);
    const stripeMat = new THREE.MeshBasicMaterial({ color: 0xF8FAFC });
    const stripeMesh = new THREE.Mesh(stripeGeo, stripeMat);
    stripeMesh.position.set(0.445, 0.75, 0);
    stripeMesh.rotation.y = Math.PI / 2;
    grp.add(stripeMesh);

    // Legs (+ and -)
    const legMat = new THREE.MeshStandardMaterial({ color: 0xCBD5E1, metalness: 0.9 });
    const lPos = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.7, 8), legMat);
    lPos.position.set(-0.35, 0.25, 0); grp.add(lPos);
    const lNeg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.55, 8), legMat);
    lNeg.position.set(0.35, 0.25, 0); grp.add(lNeg);
  }

  build3DTransistor(grp, comp) {
    // TO-92 black epoxy body
    const bodyGeo = new THREE.CylinderGeometry(0.36, 0.36, 0.7, 16, 1, false, 0, Math.PI);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x1E293B, roughness: 0.4 });
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    bodyMesh.position.y = 0.55;
    bodyMesh.castShadow = true;
    grp.add(bodyMesh);

    // Flat front face
    const faceGeo = new THREE.BoxGeometry(0.72, 0.7, 0.06);
    const faceMesh = new THREE.Mesh(faceGeo, bodyMat);
    faceMesh.position.set(0, 0.55, 0);
    grp.add(faceMesh);

    // 3 Bent leads (Collector, Base, Emitter)
    const legMat = new THREE.MeshStandardMaterial({ color: 0xCBD5E1, metalness: 0.9 });
    const lC = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.6, 8), legMat);
    lC.position.set(0.35, 0.2, -0.3); grp.add(lC);
    const lB = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.6, 8), legMat);
    lB.position.set(-0.35, 0.2, 0); grp.add(lB);
    const lE = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.6, 8), legMat);
    lE.position.set(0.35, 0.2, 0.3); grp.add(lE);
  }

  build3DMotor(grp, comp) {
    // Metal motor can
    const mGeo = new THREE.CylinderGeometry(0.65, 0.65, 1.45, 24);
    const mMat = new THREE.MeshStandardMaterial({ color: 0x94A3B8, metalness: 0.85, roughness: 0.25 });
    const mMesh = new THREE.Mesh(mGeo, mMat);
    mMesh.rotation.z = Math.PI / 2;
    mMesh.position.y = 0.75;
    mMesh.castShadow = true;
    grp.add(mMesh);

    // Motor shaft
    const shaftGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.6, 12);
    const shaftMat = new THREE.MeshStandardMaterial({ color: 0xF8FAFC, metalness: 0.95 });
    const shaftMesh = new THREE.Mesh(shaftGeo, shaftMat);
    shaftMesh.position.set(0.9, 0.75, 0);
    shaftMesh.rotation.z = Math.PI / 2;
    grp.add(shaftMesh);

    // 3-Blade Propeller
    const propGrp = new THREE.Group();
    propGrp.position.set(1.15, 0.75, 0);
    propGrp.rotation.z = Math.PI / 2;

    const hubGeo = new THREE.SphereGeometry(0.2, 12, 12);
    const hubMat = new THREE.MeshStandardMaterial({ color: 0x0284C7 });
    const hubMesh = new THREE.Mesh(hubGeo, hubMat);
    propGrp.add(hubMesh);

    const bladeGeo = new THREE.BoxGeometry(0.14, 0.035, 0.95);
    const bladeMat = new THREE.MeshStandardMaterial({ color: 0xFBBF24, roughness: 0.3 }); // Yellow safety blades
    for (let i = 0; i < 3; i++) {
      const blade = new THREE.Mesh(bladeGeo, bladeMat);
      blade.rotation.y = (i * Math.PI * 2) / 3;
      blade.position.set(0, 0, 0.45);
      const pivot = new THREE.Group();
      pivot.rotation.y = (i * Math.PI * 2) / 3;
      pivot.add(blade);
      propGrp.add(pivot);
    }

    grp.add(propGrp);
    grp.userData.propellerMesh = propGrp;

    // Terminal wire tabs
    const tabMat = new THREE.MeshStandardMaterial({ color: 0xEF4444 });
    const t1 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.5, 8), tabMat);
    t1.position.set(-0.7, 0.3, 0); grp.add(t1);
    const t2 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.5, 8), new THREE.MeshStandardMaterial({ color: 0x1E293B }));
    t2.position.set(0.7, 0.3, 0); grp.add(t2);
  }

  build3DLogicGate(grp, comp) {
    // 14-pin DIP chip body (74-series logic IC)
    const chipGeo = new THREE.BoxGeometry(1.4, 0.35, 0.75);
    const chipMat = new THREE.MeshStandardMaterial({ color: 0x0F172A, roughness: 0.4 });
    const chipMesh = new THREE.Mesh(chipGeo, chipMat);
    chipMesh.position.y = 0.45;
    chipMesh.castShadow = true;
    grp.add(chipMesh);

    // Notch
    const notchGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.08, 12, 1, false, 0, Math.PI);
    const notchMat = new THREE.MeshBasicMaterial({ color: 0x38BDF8 });
    const notchMesh = new THREE.Mesh(notchGeo, notchMat);
    notchMesh.position.set(-0.7, 0.62, 0);
    notchMesh.rotation.z = Math.PI / 2;
    grp.add(notchMesh);

    // 14 Silver DIP Pins
    const pinMat = new THREE.MeshStandardMaterial({ color: 0xE2E8F0, metalness: 0.95 });
    const pGeo = new THREE.BoxGeometry(0.05, 0.35, 0.06);
    for (let i = 0; i < 7; i++) {
      const zPos = -0.5 + i * 0.17;
      const pL = new THREE.Mesh(pGeo, pinMat); pL.position.set(zPos, 0.25, -0.38); grp.add(pL);
      const pR = new THREE.Mesh(pGeo, pinMat); pR.position.set(zPos, 0.25, 0.38); grp.add(pR);
    }
  }

  build3DSevenSegment(grp, comp) {
    // 10-pin DIP 7-Segment Module
    const modGeo = new THREE.BoxGeometry(1.6, 0.55, 2.2);
    const modMat = new THREE.MeshStandardMaterial({ color: 0x0A0F1D, roughness: 0.6 });
    const modMesh = new THREE.Mesh(modGeo, modMat);
    modMesh.position.y = 0.55;
    modMesh.castShadow = true;
    grp.add(modMesh);

    // Segment Meshes
    const segMeshes = {};
    const segMatActive = new THREE.MeshBasicMaterial({ color: 0xEF4444 });
    const segMatInactive = new THREE.MeshStandardMaterial({ color: 0x2A1515, roughness: 0.8 });

    const createBar = (w, h, x, z) => {
      const bGeo = new THREE.BoxGeometry(w, 0.05, h);
      const bMesh = new THREE.Mesh(bGeo, segMatInactive);
      bMesh.position.set(x, 0.84, z);
      grp.add(bMesh);
      return bMesh;
    };

    segMeshes.a = createBar(0.65, 0.12, 0, -0.65);
    segMeshes.b = createBar(0.12, 0.55, 0.38, -0.32);
    segMeshes.c = createBar(0.12, 0.55, 0.38, 0.32);
    segMeshes.d = createBar(0.65, 0.12, 0, 0.65);
    segMeshes.e = createBar(0.12, 0.55, -0.38, 0.32);
    segMeshes.f = createBar(0.12, 0.55, -0.38, -0.32);
    segMeshes.g = createBar(0.65, 0.12, 0, 0);

    // DP Dot
    const dpGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.05, 12);
    const dpMesh = new THREE.Mesh(dpGeo, segMatInactive);
    dpMesh.position.set(0.6, 0.84, 0.65);
    grp.add(dpMesh);
    segMeshes.dp = dpMesh;

    grp.userData.segMeshes = segMeshes;
    grp.userData.segMatActive = segMatActive;
    grp.userData.segMatInactive = segMatInactive;
  }

  build3DTimer555(grp, comp) {
    // 8-pin DIP NE555 Chip
    const cGeo = new THREE.BoxGeometry(1.0, 0.38, 0.8);
    const cMat = new THREE.MeshStandardMaterial({ color: 0x0F172A, roughness: 0.35 });
    const cMesh = new THREE.Mesh(cGeo, cMat);
    cMesh.position.y = 0.45;
    cMesh.castShadow = true;
    grp.add(cMesh);

    // Notch
    const notchGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.08, 12, 1, false, 0, Math.PI);
    const notchMat = new THREE.MeshBasicMaterial({ color: 0x00FF87 });
    const notchMesh = new THREE.Mesh(notchGeo, notchMat);
    notchMesh.position.set(-0.5, 0.64, 0);
    notchMesh.rotation.z = Math.PI / 2;
    grp.add(notchMesh);

    // 8 Silver Pins
    const pinMat = new THREE.MeshStandardMaterial({ color: 0xE2E8F0, metalness: 0.95 });
    const pGeo = new THREE.BoxGeometry(0.06, 0.35, 0.06);
    for (let i = 0; i < 4; i++) {
      const zPos = -0.3 + i * 0.2;
      const pL = new THREE.Mesh(pGeo, pinMat); pL.position.set(zPos, 0.25, -0.42); grp.add(pL);
      const pR = new THREE.Mesh(pGeo, pinMat); pR.position.set(zPos, 0.25, 0.42); grp.add(pR);
    }
  }

  build3DArduino(grp, comp) {
    // 1. PCB Board (Arduino Teal Blue 0x00878F)
    const pcbGeo = new THREE.BoxGeometry(8.6, 0.22, 6.4);
    const pcbMat = new THREE.MeshStandardMaterial({
      color: 0x00878F,
      roughness: 0.35,
      metalness: 0.15
    });
    const pcbMesh = new THREE.Mesh(pcbGeo, pcbMat);
    pcbMesh.position.y = 0.11;
    pcbMesh.castShadow = true;
    pcbMesh.receiveShadow = true;
    grp.add(pcbMesh);

    // 2. USB Connector (Silver Metal Box on top-left)
    const usbGeo = new THREE.BoxGeometry(1.6, 1.2, 1.4);
    const usbMat = new THREE.MeshStandardMaterial({
      color: 0xCBD5E1,
      metalness: 0.95,
      roughness: 0.2
    });
    const usbMesh = new THREE.Mesh(usbGeo, usbMat);
    usbMesh.position.set(-3.8, 0.7, -1.8);
    usbMesh.castShadow = true;
    grp.add(usbMesh);

    // USB Opening
    const usbHoleGeo = new THREE.BoxGeometry(0.1, 0.6, 1.0);
    const usbHoleMat = new THREE.MeshBasicMaterial({ color: 0x020617 });
    const usbHole = new THREE.Mesh(usbHoleGeo, usbHoleMat);
    usbHole.position.set(-4.56, 0.7, -1.8);
    grp.add(usbHole);

    // 3. DC Power Barrel Jack (Black block on bottom-left)
    const dcGeo = new THREE.BoxGeometry(1.8, 1.3, 1.5);
    const dcMat = new THREE.MeshStandardMaterial({ color: 0x1E293B, roughness: 0.6 });
    const dcMesh = new THREE.Mesh(dcGeo, dcMat);
    dcMesh.position.set(-3.6, 0.75, 1.8);
    dcMesh.castShadow = true;
    grp.add(dcMesh);

    // DC Barrel metal center pin
    const dcPinGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.6, 12);
    const dcPinMat = new THREE.MeshStandardMaterial({ color: 0xD4AF37, metalness: 0.8 });
    const dcPin = new THREE.Mesh(dcPinGeo, dcPinMat);
    dcPin.rotation.z = Math.PI / 2;
    dcPin.position.set(-4.4, 0.75, 1.8);
    grp.add(dcPin);

    // 4. ATmega328P DIP-28 IC (Center black chip)
    const icGeo = new THREE.BoxGeometry(3.6, 0.35, 1.1);
    const icMat = new THREE.MeshStandardMaterial({ color: 0x0F172A, roughness: 0.4 });
    const icMesh = new THREE.Mesh(icGeo, icMat);
    icMesh.position.set(0.6, 0.32, 0.2);
    icMesh.castShadow = true;
    grp.add(icMesh);

    // IC Notch
    const icNotchGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.1, 12, 1, false, 0, Math.PI);
    const icNotchMat = new THREE.MeshBasicMaterial({ color: 0x38BDF8 });
    const icNotch = new THREE.Mesh(icNotchGeo, icNotchMat);
    icNotch.position.set(-1.2, 0.5, 0.2);
    icNotch.rotation.z = Math.PI / 2;
    grp.add(icNotch);

    // 5. 16 MHz Crystal Oscillator
    const oscGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.9, 16);
    const oscMat = new THREE.MeshStandardMaterial({ color: 0xE2E8F0, metalness: 0.9, roughness: 0.15 });
    const oscMesh = new THREE.Mesh(oscGeo, oscMat);
    oscMesh.rotation.z = Math.PI / 2;
    oscMesh.position.set(-1.8, 0.3, -0.6);
    grp.add(oscMesh);

    // 6. Reset Push Button
    const rstBaseGeo = new THREE.BoxGeometry(0.6, 0.35, 0.6);
    const rstBaseMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.5 });
    const rstBase = new THREE.Mesh(rstBaseGeo, rstBaseMat);
    rstBase.position.set(-3.5, 0.35, -0.6);
    grp.add(rstBase);

    const rstBtnGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.2, 16);
    const rstBtnMat = new THREE.MeshStandardMaterial({ color: 0xEF4444 });
    const rstBtn = new THREE.Mesh(rstBtnGeo, rstBtnMat);
    rstBtn.position.set(-3.5, 0.55, -0.6);
    grp.add(rstBtn);

    // 7. Female Headers (Black plastic sockets)
    const headerMat = new THREE.MeshStandardMaterial({ color: 0x020617, roughness: 0.6 });
    // Top Digital Header
    const topHdrGeo = new THREE.BoxGeometry(7.6, 0.45, 0.4);
    const topHdrMesh = new THREE.Mesh(topHdrGeo, headerMat);
    topHdrMesh.position.set(0.15, 0.38, -2.8);
    grp.add(topHdrMesh);

    // Bottom Power + Analog Header
    const btmHdrGeo = new THREE.BoxGeometry(6.6, 0.45, 0.4);
    const btmHdrMesh = new THREE.Mesh(btmHdrGeo, headerMat);
    btmHdrMesh.position.set(0.6, 0.38, 2.8);
    grp.add(btmHdrMesh);

    // 8. SMD LEDs:
    // Power 'ON' LED (Green)
    const onLedGeo = new THREE.SphereGeometry(0.1, 10, 10);
    const onLedMat = new THREE.MeshBasicMaterial({ color: 0x00FF87 });
    const onLed = new THREE.Mesh(onLedGeo, onLedMat);
    onLed.position.set(2.4, 0.26, -1.2);
    grp.add(onLed);

    const onLight = new THREE.PointLight(0x00FF87, 0.8, 4);
    onLight.position.set(2.4, 0.45, -1.2);
    grp.add(onLight);

    // Built-in 'L' LED (Pin 13 - Amber/Orange)
    const lLedMat = new THREE.MeshStandardMaterial({
      color: 0xFBBF24,
      emissive: 0xFBBF24,
      emissiveIntensity: 0.1
    });
    const lLed = new THREE.Mesh(onLedGeo, lLedMat);
    lLed.position.set(2.4, 0.26, -0.6);
    grp.add(lLed);

    const lLight = new THREE.PointLight(0xFBBF24, 0, 5);
    lLight.position.set(2.4, 0.45, -0.6);
    grp.add(lLight);

    grp.userData.arduinoLLed = lLed;
    grp.userData.arduinoLLedMat = lLedMat;
    grp.userData.arduinoLLight = lLight;

    // TX and RX LEDs
    const txMat = new THREE.MeshBasicMaterial({ color: 0x10B981 });
    const txLed = new THREE.Mesh(onLedGeo, txMat);
    txLed.position.set(2.4, 0.26, 0.0);
    grp.add(txLed);
    const rxLed = new THREE.Mesh(onLedGeo, txMat);
    rxLed.position.set(2.4, 0.26, 0.6);
    grp.add(rxLed);

    // Clickable Arduino opens code editor
    pcbMesh.userData = { isArduino: true, comp, grp };
    icMesh.userData = { isArduino: true, comp, grp };
    this.clickableObjects.push(pcbMesh, icMesh);
  }

  /* Interactive 3D Wiring System */
  onPointerMove(e) {
    if (!this.renderer || !this.container) return;
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const hits = this.raycaster.intersectObjects(this.pinHitboxes, false);

    if (hits.length > 0) {
      const hit = hits[0].object;
      this.renderer.domElement.style.cursor = 'crosshair';
      if (this.hoverRing) {
        this.hoverRing.position.copy(hit.userData.worldPos);
        this.hoverRing.position.y += 0.05;
        this.hoverRing.visible = true;
      }
      if (this.wiringStartPin) {
        this.updatePreviewWire(this.wiringStartPin.pos, hit.userData.worldPos);
      }
    } else {
      this.renderer.domElement.style.cursor = this.wiringStartPin ? 'crosshair' : 'default';
      if (this.hoverRing && !this.wiringStartPin) {
        this.hoverRing.visible = false;
      }
      if (this.wiringStartPin) {
        const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        const target = new THREE.Vector3();
        this.raycaster.ray.intersectPlane(plane, target);
        if (target) {
          target.y = 0.4;
          this.updatePreviewWire(this.wiringStartPin.pos, target);
        }
      }
    }
  }

  updatePreviewWire(startPos, endPos) {
    if (this.previewWireMesh) {
      this.scene.remove(this.previewWireMesh);
      this.previewWireMesh.geometry.dispose();
      this.previewWireMesh = null;
    }

    const dist = startPos.distanceTo(endPos);
    const archH = Math.max(0.8, 0.4 + dist * 0.25);
    const mid = new THREE.Vector3(
      (startPos.x + endPos.x) / 2,
      Math.max(startPos.y, endPos.y) + archH,
      (startPos.z + endPos.z) / 2
    );

    const curve = new THREE.CatmullRomCurve3([
      startPos.clone().add(new THREE.Vector3(0, 0.3, 0)),
      mid,
      endPos.clone().add(new THREE.Vector3(0, 0.3, 0))
    ]);

    const tubeGeo = new THREE.TubeGeometry(curve, 20, 0.05, 8, false);
    const tubeMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(this.activeWireColor || 0x38BDF8),
      wireframe: false
    });
    this.previewWireMesh = new THREE.Mesh(tubeGeo, tubeMat);
    this.scene.add(this.previewWireMesh);
  }

  cancelWiring() {
    this.wiringStartPin = null;
    if (this.hoverRing) this.hoverRing.visible = false;
    if (this.previewWireMesh) {
      this.scene.remove(this.previewWireMesh);
      this.previewWireMesh.geometry.dispose();
      this.previewWireMesh = null;
    }
    if (this.renderer) this.renderer.domElement.style.cursor = 'default';
  }

  onPointerDown(e) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    // 1. Check Pin Click for Interactive 3D Wiring
    const pinHits = this.raycaster.intersectObjects(this.pinHitboxes, false);
    if (pinHits.length > 0) {
      const hit = pinHits[0].object;
      const { comp, pin, worldPos } = hit.userData;

      if (!this.wiringStartPin) {
        this.wiringStartPin = { comp, pin, pos: worldPos.clone() };
        if (this.hoverRing) {
          this.hoverRing.position.copy(worldPos);
          this.hoverRing.visible = true;
        }
        if (window.toast) {
          window.toast(`🔌 1-pin tanlandi: ${comp.name} (${pin.name}). Endi 2-pinni bosing!`);
        }
      } else {
        if (pin.id === this.wiringStartPin.pin.id) {
          this.cancelWiring();
        } else {
          if (this.onWireCreated) {
            this.onWireCreated(this.wiringStartPin.pin.id, pin.id, this.activeWireColor || '#38BDF8');
          }
          if (window.toast) {
            window.toast(`✅ 3D Sim ulandi: ${this.wiringStartPin.pin.name} ➔ ${pin.name}`);
          }
          this.cancelWiring();
          this.rebuildScene();
        }
      }
      return;
    }

    // 2. Check Clickable Objects (Switches, Arduino)
    const hits = this.raycaster.intersectObjects(this.clickableObjects, true);

    if (hits.length > 0) {
      const hit = hits[0].object;
      if (hit.userData && hit.userData.isSwitch && hit.userData.comp) {
        hit.userData.comp.toggle();
        if (hit.userData.grp && hit.userData.grp.userData.switchLeverMesh) {
          hit.userData.grp.userData.switchLeverMesh.rotation.z = hit.userData.comp.isOpen ? 0.45 : -0.45;
        }
        if (window.playSwitchSound) window.playSwitchSound();
        if (window.toast) window.toast(hit.userData.comp.isOpen ? "3D: Kalit ochildi" : "3D: Kalit yopildi (Zanjir ulandi!)");
      } else if (hit.userData && hit.userData.isArduino && hit.userData.comp) {
        if (window.openArduinoCodeModal) {
          window.openArduinoCodeModal(hit.userData.comp);
        }
      }
    } else {
      if (this.wiringStartPin) {
        this.cancelWiring();
      }
    }
  }

  onResize() {
    if (!this.container || !this.renderer) return;
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  animate() {
    requestAnimationFrame(this.animate);
    const dt = Math.min(this.clock.getDelta(), 0.1);

    if (this.controls) this.controls.update();

    // 1. Update 3D Components Dynamic State (Bulb, LED, Switch)
    this.componentMeshes.forEach(grp => {
      const comp = grp.userData.comp;
      if (!comp) return;

      if (comp.type === 'bulb') {
        const I = Math.abs(comp.current || 0);
        const bright = comp.isBurned ? 0 : Math.min(1.0, I * 3.8);

        // Radiant PointLight
        if (grp.userData.bulbLight) {
          grp.userData.bulbLight.intensity = bright * 5.0;
        }

        // Hot Radiant Filament
        if (grp.userData.filamentMat) {
          if (bright > 0.05) {
            grp.userData.filamentMat.color.setHex(0xFFFFFF);
            grp.userData.filamentMat.emissive.setHex(0xFFCC00);
            grp.userData.filamentMat.emissiveIntensity = bright * 4.5;
          } else {
            grp.userData.filamentMat.color.setHex(comp.isBurned ? 0x18181B : 0x475569);
            grp.userData.filamentMat.emissive.setHex(0x000000);
            grp.userData.filamentMat.emissiveIntensity = 0;
          }
        }

        // Glowing Glass Globe
        if (grp.userData.glassMat) {
          if (bright > 0.05) {
            grp.userData.glassMat.color.setHex(0xFFFFAA);
            grp.userData.glassMat.emissive.setHex(0xFFAA00);
            grp.userData.glassMat.emissiveIntensity = bright * 1.8;
            grp.userData.glassMat.opacity = 0.9;
          } else {
            grp.userData.glassMat.color.setHex(comp.isBurned ? 0x27272A : 0xE8F0FE);
            grp.userData.glassMat.emissive.setHex(0x000000);
            grp.userData.glassMat.emissiveIntensity = 0;
            grp.userData.glassMat.opacity = 0.65;
          }
        }

        // White-Hot Luminous Core
        if (grp.userData.coreMat) {
          grp.userData.coreMat.opacity = bright * 0.95;
        }

        // Inner Warm Halo
        if (grp.userData.haloMat && grp.userData.haloMesh) {
          grp.userData.haloMat.opacity = bright * 0.85;
          const s = 1.0 + bright * 0.35;
          grp.userData.haloMesh.scale.set(s, s, s);
        }

        // Outer Radiant Bloom Aura
        if (grp.userData.auraMat && grp.userData.auraMesh) {
          grp.userData.auraMat.opacity = bright * 0.45;
          const s = 1.0 + bright * 0.25;
          grp.userData.auraMesh.scale.set(s, s, s);
        }
      } else if (comp.type === 'led') {
        const I = Math.abs(comp.current || 0);
        const bright = (comp.isBlown || comp.isBurned) ? 0 : Math.min(1.0, I * 45);

        if (grp.userData.ledLight) {
          grp.userData.ledLight.intensity = bright * 2.5;
        }
        if (grp.userData.ledDomeMat) {
          if (comp.isBlown || comp.isBurned) {
            grp.userData.ledDomeMat.color.setHex(0x27272A);
            grp.userData.ledDomeMat.emissive.setHex(0x000000);
            grp.userData.ledDomeMat.emissiveIntensity = 0;
            grp.userData.ledDomeMat.opacity = 0.95;
          } else {
            grp.userData.ledDomeMat.color.setStyle(comp.ledColor || '#EF4444');
            grp.userData.ledDomeMat.emissive.setStyle(comp.ledColor || '#EF4444');
            grp.userData.ledDomeMat.emissiveIntensity = 0.1 + bright * 1.6;
          }
        }
      } else if (comp.type === 'switch') {
        if (grp.userData.switchLeverMesh) {
          grp.userData.switchLeverMesh.rotation.z = comp.isOpen ? 0.45 : -0.45;
        }
      } else if (comp.type === 'motor') {
        if (grp.userData.propellerMesh && comp.speed) {
          grp.userData.propellerMesh.rotation.y += (comp.speed * 0.035 * dt);
        }
      } else if (comp.type === 'potentiometer') {
        if (grp.userData.potDialGrp && comp.ratio !== undefined) {
          grp.userData.potDialGrp.rotation.y = (comp.ratio - 0.5) * Math.PI * 1.6;
        }
      } else if (comp.type === 'seven_segment') {
        if (grp.userData.segMeshes && grp.userData.segMatActive && grp.userData.segMatInactive) {
          const gndV = comp.pins[7]?.voltage || 0;
          const isLit = (pin) => ((pin?.voltage || 0) - gndV) > 1.6;
          const segKeys = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
          segKeys.forEach((k, idx) => {
            const m = grp.userData.segMeshes[k];
            if (m) {
              m.material = isLit(comp.pins[idx]) ? grp.userData.segMatActive : grp.userData.segMatInactive;
            }
          });
        }
      } else if (comp.type === 'arduino_uno') {
        if (grp.userData.arduinoLLedMat) {
          const isL = comp.ledL;
          grp.userData.arduinoLLedMat.emissiveIntensity = isL ? 2.5 : 0.05;
          if (grp.userData.arduinoLLight) {
            grp.userData.arduinoLLight.intensity = isL ? 2.0 : 0;
          }
        }
      }
    });

    // 2. Animate 3D Current Particles along Dupont Jumper Wires (+ to -)
    for (const wr of this.wireRecords) {
      const I = wr.wire.current || 0;
      const isFlowing = Math.abs(I) > 0.002;
      const speed = Math.min(2.5, Math.abs(I) * 80.0) * (wr.wire.direction || 1);

      for (const pObj of wr.particleMeshes) {
        if (!isFlowing) {
          pObj.mesh.visible = false;
          continue;
        }
        pObj.mesh.visible = true;
        pObj.t += speed * dt * 0.2;
        if (pObj.t > 1.0) pObj.t -= 1.0;
        if (pObj.t < 0.0) pObj.t += 1.0;

        // Position on 3D curve
        const pt = wr.curve.getPointAt(pObj.t);
        pObj.mesh.position.copy(pt);
      }
    }

    this.renderer.render(this.scene, this.camera);
  }
}

window.Breadboard3D = Breadboard3D;
