/* ==========================================================================
   CIRCUIT SIMULATION ENGINE (NODAL ANALYSIS, OHM'S & KIRCHHOFF'S LAWS)
   ATT-25 Circuit Lab Real-time Physics & Solver Engine
   ========================================================================== */

class CircuitEngine {
  constructor() {
    this.components = [];
    this.wires = [];
    this.nodes = [];
    this.nodeMap = new Map(); // pinId -> nodeId
    this.isShortCircuit = false;
    this.shortCircuitMessage = '';
    this.simRunning = true;
    this.time = 0;
    this.timeStep = 0.01; // 10ms step
  }

  addComponent(comp) {
    this.components.push(comp);
    return comp;
  }

  removeComponent(comp) {
    // Remove connected wires first
    const pinIds = comp.pins.map(p => p.id);
    this.wires = this.wires.filter(w => !pinIds.includes(w.fromPinId) && !pinIds.includes(w.toPinId));
    this.components = this.components.filter(c => c !== comp);
  }

  addWire(fromPinId, toPinId, color = '#38BDF8') {
    if (fromPinId === toPinId) return null;
    // Check if wire already exists
    const exists = this.wires.some(w => 
      (w.fromPinId === fromPinId && w.toPinId === toPinId) ||
      (w.fromPinId === toPinId && w.toPinId === fromPinId)
    );
    if (exists) return null;

    const wire = {
      id: 'wire_' + Math.random().toString(36).substr(2, 9),
      fromPinId,
      toPinId,
      color,
      current: 0,
      particles: []
    };
    this.wires.push(wire);
    return wire;
  }

  removeWire(wire) {
    this.wires = this.wires.filter(w => w !== wire);
  }

  getPinById(pinId) {
    for (const comp of this.components) {
      for (const pin of comp.pins) {
        if (pin.id === pinId) return { pin, comp };
      }
    }
    return null;
  }

  /* ==========================================================================
     TOPOLOGY & NODAL PARTITIONING
     ========================================================================== */
  buildNodes() {
    this.nodeMap.clear();
    const parent = new Map();

    // Collect all pins
    const allPins = [];
    for (const comp of this.components) {
      for (const pin of comp.pins) {
        allPins.push(pin.id);
        parent.set(pin.id, pin.id);
      }
    }

    function find(i) {
      if (parent.get(i) === i) return i;
      const root = find(parent.get(i));
      parent.set(i, root);
      return root;
    }

    function union(i, j) {
      const rootI = find(i);
      const rootJ = find(j);
      if (rootI !== rootJ) parent.set(rootI, rootJ);
    }

    // Connect pins via wires
    for (const wire of this.wires) {
      if (parent.has(wire.fromPinId) && parent.has(wire.toPinId)) {
        union(wire.fromPinId, wire.toPinId);
      }
    }

    // Group pins into electrical nodes
    const nodeGroups = new Map();
    for (const pinId of allPins) {
      const root = find(pinId);
      if (!nodeGroups.has(root)) nodeGroups.set(root, []);
      nodeGroups.get(root).push(pinId);
    }

    this.nodes = [];
    let nodeId = 0;
    for (const [root, pinList] of nodeGroups.entries()) {
      const nodeObj = {
        id: nodeId++,
        pins: pinList,
        voltage: 0,
        isGround: false,
        isFixed: false
      };
      for (const pId of pinList) {
        this.nodeMap.set(pId, nodeObj);
      }
      this.nodes.push(nodeObj);
    }
  }

  /* ==========================================================================
     CIRCUIT SOLVER (MODIFIED NODAL ANALYSIS / ITERATIVE KCL & KVL)
     ========================================================================== */
  solve() {
    if (!this.simRunning) return;
    this.isShortCircuit = false;
    this.shortCircuitMessage = '';
    this.buildNodes();

    if (this.nodes.length === 0) return;

    // Reset pin voltages and currents
    for (const comp of this.components) {
      comp.current = 0;
      comp.voltageDrop = 0;
      for (const pin of comp.pins) {
        pin.voltage = 0;
      }
    }

    // 1. Identify Ground (0V Reference)
    let groundNode = null;
    // Look for explicit Ground component
    for (const comp of this.components) {
      if (comp.type === 'ground') {
        const n = this.nodeMap.get(comp.pins[0].id);
        if (n) {
          n.isGround = true;
          n.voltage = 0;
          n.isFixed = true;
          groundNode = n;
        }
      }
    }

    // If no ground component, pick negative terminal of the first active voltage source
    if (!groundNode) {
      for (const comp of this.components) {
        if ((comp.type === 'battery' || comp.type === 'dc_source') && comp.pins.length >= 2) {
          const negPin = comp.pins[1]; // Negative terminal
          const n = this.nodeMap.get(negPin.id);
          if (n) {
            n.isGround = true;
            n.voltage = 0;
            n.isFixed = true;
            groundNode = n;
            break;
          }
        }
      }
    }

    if (!groundNode && this.nodes.length > 0) {
      this.nodes[0].isGround = true;
      this.nodes[0].voltage = 0;
      this.nodes[0].isFixed = true;
    }

    // 2. Check for Direct Short Circuit on Voltage Sources
    for (const comp of this.components) {
      if (comp.type === 'battery' || comp.type === 'dc_source') {
        const nPos = this.nodeMap.get(comp.pins[0].id);
        const nNeg = this.nodeMap.get(comp.pins[1].id);
        if (nPos && nNeg && nPos === nNeg) {
          this.isShortCircuit = true;
          this.shortCircuitMessage = `⚠️ QISQA TUTASHUV (KЗ)! ${comp.name} musbat va manfiy qutbi to'g'ridan-to'g'ri tutashdi!`;
          comp.current = 50.0; // Extreme current
          return;
        }
      }
    }

    // 3. Iterative Relaxation Solver (Gauss-Seidel with dynamic component models)
    const MAX_ITER = 120;
    const DAMPING = 0.65;

    for (let iter = 0; iter < MAX_ITER; iter++) {
      // Apply voltage sources
      for (const comp of this.components) {
        if (comp.type === 'battery' || comp.type === 'dc_source') {
          const nPos = this.nodeMap.get(comp.pins[0].id);
          const nNeg = this.nodeMap.get(comp.pins[1].id);
          if (nPos && nNeg && nPos !== nNeg) {
            const vSource = comp.voltage;
            if (nNeg.isFixed && !nPos.isFixed) {
              nPos.voltage = nNeg.voltage + vSource;
            } else if (nPos.isFixed && !nNeg.isFixed) {
              nNeg.voltage = nPos.voltage - vSource;
            } else if (!nPos.isFixed && !nNeg.isFixed) {
              const mid = (nPos.voltage + nNeg.voltage) / 2;
              nPos.voltage = mid + vSource / 2;
              nNeg.voltage = mid - vSource / 2;
            }
          }
        }
      }

      // Evaluate Active ICs & Logic Gates
      for (const comp of this.components) {
        if (comp.evaluate) {
          for (const p of comp.pins) {
            const nd = this.nodeMap.get(p.id);
            if (nd) p.voltage = nd.voltage;
          }
          const outV = comp.evaluate();
          const outPin = comp.type === 'timer_555' ? comp.pins[2] : comp.pins[comp.pins.length - 1];
          const nOut = this.nodeMap.get(outPin.id);
          if (nOut && !nOut.isFixed) {
            nOut.voltage = nOut.voltage * (1 - DAMPING) + outV * DAMPING;
          }
        }
      }

      // KCL balance at every non-fixed node
      for (const node of this.nodes) {
        if (node.isFixed) continue;

        let totalConductance = 0;
        let targetVoltageSum = 0;

        for (const pinId of node.pins) {
          const { comp, pin } = this.getPinById(pinId);
          if (!comp) continue;

          // Process 2-terminal components
          if (comp.pins.length === 2) {
            const otherPin = comp.pins[0].id === pinId ? comp.pins[1] : comp.pins[0];
            const otherNode = this.nodeMap.get(otherPin.id);
            if (!otherNode) continue;

            let g = 0;
            if (comp.isBurned || comp.isBlown) {
              g = 1e-9; // Blown open
            } else if (comp.type === 'ldr') {
              g = 1 / comp.getResistance();
            } else if (comp.type === 'capacitor') {
              // Equivalent conductance for capacitor transient (R_int = 20 ohm)
              g = 1 / 20;
            } else if (comp.type === 'ammeter') {
              // Ampermetr — deyarli nol qarshilik (0.001Ω)
              g = 1 / (comp.resistance || 0.001);
            } else if (comp.type === 'voltmeter') {
              // Voltmetr — deyarli cheksiz qarshilik (1MΩ)
              g = 1 / (comp.resistance || 1000000);
            } else if (comp.type === 'diode') {
              // Diod — bir yo'nalishli o'tkazish
              g = comp.getConductance ? comp.getConductance(node.voltage - otherNode.voltage) : 1e-9;
            } else if (comp.getConductance) {
              g = comp.getConductance(node.voltage - otherNode.voltage);
            } else {
              g = 1 / (comp.resistance || 1000);
            }

            if (g > 0) {
              totalConductance += g;
              // For capacitor, offset by internal stored charge
              if (comp.type === 'capacitor') {
                const isPos = (comp.pins[0].id === pinId);
                const vcOffset = isPos ? (comp.chargeVoltage || 0) : -(comp.chargeVoltage || 0);
                targetVoltageSum += g * (otherNode.voltage + vcOffset);
              } else {
                targetVoltageSum += g * otherNode.voltage;
              }
            }
          }

          // Process 3-terminal components: Potentiometer (pins: 1, W, 2)
          else if (comp.type === 'potentiometer' && comp.pins.length === 3) {
            const pin1 = comp.pins[0];
            const pinW = comp.pins[1];
            const pin2 = comp.pins[2];
            const r1 = Math.max(1, comp.maxResistance * comp.ratio);
            const r2 = Math.max(1, comp.maxResistance * (1 - comp.ratio));

            if (pinId === pinW.id) {
              // Wiper connects to both Pin 1 and Pin 2
              const n1 = this.nodeMap.get(pin1.id);
              const n2 = this.nodeMap.get(pin2.id);
              if (n1) {
                const g1 = 1 / r1;
                totalConductance += g1;
                targetVoltageSum += g1 * n1.voltage;
              }
              if (n2) {
                const g2 = 1 / r2;
                totalConductance += g2;
                targetVoltageSum += g2 * n2.voltage;
              }
            } else if (pinId === pin1.id) {
              const nW = this.nodeMap.get(pinW.id);
              if (nW) {
                const g1 = 1 / r1;
                totalConductance += g1;
                targetVoltageSum += g1 * nW.voltage;
              }
            } else if (pinId === pin2.id) {
              const nW = this.nodeMap.get(pinW.id);
              if (nW) {
                const g2 = 1 / r2;
                totalConductance += g2;
                targetVoltageSum += g2 * nW.voltage;
              }
            }
          }

          // Process 3-terminal components: NPN Bipolar Transistor (pins: C, B, E)
          else if (comp.type === 'transistor_npn' && comp.pins.length === 3) {
            const pinC = comp.pins[0];
            const pinB = comp.pins[1];
            const pinE = comp.pins[2];
            const nC = this.nodeMap.get(pinC.id);
            const nB = this.nodeMap.get(pinB.id);
            const nE = this.nodeMap.get(pinE.id);

            const vB = nB ? nB.voltage : 0;
            const vE = nE ? nE.voltage : 0;
            const vC = nC ? nC.voltage : 0;
            const vBE = vB - vE;
            const isConducting = vBE > 0.65;

            if (pinId === pinB.id && nE) {
              const gB = isConducting ? 1 / 120 : 1e-7;
              totalConductance += gB;
              targetVoltageSum += gB * (nE.voltage + 0.65);
            } else if (pinId === pinE.id && nB) {
              const gB = isConducting ? 1 / 120 : 1e-7;
              totalConductance += gB;
              targetVoltageSum += gB * (nB.voltage - 0.65);
            } else if (pinId === pinC.id && nE) {
              // Collector-Emitter channel
              const ib = isConducting ? Math.max(0, (vBE - 0.65) / 120) : 0;
              const gCE = isConducting ? Math.min(8.0, Math.max(0.01, (comp.beta * ib) / Math.max(0.1, vC - vE))) : 1e-7;
              totalConductance += gCE;
              targetVoltageSum += gCE * nE.voltage;
            }
          }

          // Process 7-Segment LED Display (8 pins: a-g + GND)
          else if (comp.type === 'seven_segment' && comp.pins.length === 8) {
            const gndPin = comp.pins[7];
            const nGnd = this.nodeMap.get(gndPin.id);
            const vGnd = nGnd ? nGnd.voltage : 0;

            if (pinId === gndPin.id) {
              for (let s = 0; s < 7; s++) {
                const sp = comp.pins[s];
                const ns = this.nodeMap.get(sp.id);
                if (ns && (ns.voltage - vGnd) > 1.8) {
                  const gSeg = 1 / 150;
                  totalConductance += gSeg;
                  targetVoltageSum += gSeg * (ns.voltage - 1.8);
                }
              }
            } else {
              if (nGnd && (node.voltage - vGnd) > 1.8) {
                const gSeg = 1 / 150;
                totalConductance += gSeg;
                targetVoltageSum += gSeg * (vGnd + 1.8);
              }
            }
          }
        }

        if (totalConductance > 0) {
          const vTarget = targetVoltageSum / totalConductance;
          node.voltage = node.voltage * (1 - DAMPING) + vTarget * DAMPING;
        }
      }
    }

    // 4. Update Component States, Voltages, and Branch Currents
    const dt = this.timeStep || 0.016;

    for (const comp of this.components) {
      if (comp.pins.length >= 2) {
        const n1 = this.nodeMap.get(comp.pins[0].id);
        const n2 = this.nodeMap.get(comp.pins[1].id);
        const v1 = n1 ? n1.voltage : 0;
        const v2 = n2 ? n2.voltage : 0;
        comp.pins[0].voltage = v1;
        comp.pins[1].voltage = v2;
        comp.voltageDrop = v1 - v2;

        if (comp.isBurned) {
          comp.current = 0;
          continue;
        }

        if (comp.type === 'battery' || comp.type === 'dc_source') {
          // Current is calculated from connected load
          let loadCurrent = 0;
          if (n1) {
            for (const pId of n1.pins) {
              if (pId === comp.pins[0].id) continue;
              const { comp: c2 } = this.getPinById(pId);
              if (c2 && c2 !== comp && c2.current) {
                loadCurrent += Math.abs(c2.current);
              }
            }
          }
          comp.current = loadCurrent;
        } else if (comp.type === 'switch') {
          comp.current = comp.isOpen ? 0 : (comp.voltageDrop / (comp.resistance || 0.001));
        } else if (comp.type === 'resistor') {
          comp.current = comp.voltageDrop / (comp.resistance || 100);
          // Resistor Power Dissipation Check (P = I^2 * R)
          const power = Math.abs(comp.current * comp.voltageDrop);
          if (power > 0.35) { // Exceeds 0.35W limit for 1/4W resistor
            comp.isBurned = true;
            comp.burnSmoke = true;
            comp.current = 0;
          }
        } else if (comp.type === 'bulb') {
          const r = comp.resistance || 100;
          comp.current = comp.voltageDrop / r;
          // Overvoltage check (Bulb rated 6V, pops at > 10V)
          if (Math.abs(comp.voltageDrop) > 10.5) {
            comp.isBurned = true;
            comp.burnSmoke = true;
            comp.current = 0;
          }
        } else if (comp.type === 'potentiometer') {
          // Current through Wiper
          const nW = comp.pins[1] ? this.nodeMap.get(comp.pins[1].id) : null;
          const vW = nW ? nW.voltage : 0;
          const r1 = Math.max(1, comp.maxResistance * comp.ratio);
          comp.current = Math.abs(v1 - vW) / r1;
        } else if (comp.type === 'ldr') {
          const r = comp.getResistance();
          comp.current = comp.voltageDrop / r;
        } else if (comp.type === 'capacitor') {
          // RC transient integration
          const rInt = 20;
          const vApplied = comp.voltageDrop;
          const iCap = (vApplied - (comp.chargeVoltage || 0)) / rInt;
          comp.current = iCap;
          const capVal = comp.capacitance || 0.0001; // 100 uF
          comp.chargeVoltage = (comp.chargeVoltage || 0) + (iCap * dt) / capVal;
        } else if (comp.type === 'led') {
          const vf = comp.forwardVoltage || 1.8;
          if (comp.voltageDrop > vf) {
            const rd = comp.internalResistance || 15;
            comp.current = (comp.voltageDrop - vf) / rd;
          } else {
            comp.current = 0;
          }
          // LED burnout protection / pop (> 45mA)
          if (comp.current > 0.045) {
            comp.isBlown = true;
            comp.isBurned = true;
            comp.current = 0;
          }
        } else if (comp.type === 'diode') {
          // 1N4007 yarimo'tkazgich diod: Vf = 0.7V
          const vf = comp.forwardVoltage || 0.7;
          if (comp.voltageDrop > vf) {
            const rd = comp.internalResistance || 2;
            comp.current = (comp.voltageDrop - vf) / rd;
          } else {
            comp.current = 0; // Teskari yo'nalish — tok o'tmaydi
          }
        } else if (comp.type === 'ammeter') {
          // Ampermetr: serie ulanadi, ichki qarshilik ≈ 0 (0.001Ω)
          // Zanjirdagi tok kuchini O'lchaydi
          comp.current = comp.voltageDrop / (comp.resistance || 0.001);
          comp.overloaded = (Math.abs(comp.current) > (comp.maxCurrent || 5.0));
        } else if (comp.type === 'voltmeter') {
          // Voltmetr: parallel ulanadi, ichki qarshilik ≈ ∞ (1MΩ)
          // Zanjirga deyarli ta'sir qilmaydi
          comp.current = comp.voltageDrop / (comp.resistance || 1000000);
          comp.overloaded = (Math.abs(comp.voltageDrop) > (comp.maxVoltage || 50.0));
        } else if (comp.type === 'dc_source') {
          // Sozlanuvchi DC manba — batareya kabi ishlaydi
          let loadCurrent = 0;
          const n1 = this.nodeMap.get(comp.pins[0].id);
          if (n1) {
            for (const pId of n1.pins) {
              if (pId === comp.pins[0].id) continue;
              const { comp: c2 } = this.getPinById(pId);
              if (c2 && c2 !== comp && c2.current) {
                loadCurrent += Math.abs(c2.current);
              }
            }
          }
          comp.current = loadCurrent;
        } else if (comp.type === 'buzzer') {
          comp.current = comp.voltageDrop > 1.5 ? comp.voltageDrop / (comp.resistance || 80) : 0;
        } else if (comp.type === 'motor') {
          comp.current = comp.voltageDrop / (comp.resistance || 25);
          comp.speed = comp.current * 800; // RPM
        } else if (comp.type === 'transistor_npn') {
          const nC = this.nodeMap.get(comp.pins[0].id);
          const nB = this.nodeMap.get(comp.pins[1].id);
          const nE = this.nodeMap.get(comp.pins[2].id);
          const vB = nB ? nB.voltage : 0;
          const vE = nE ? nE.voltage : 0;
          const vC = nC ? nC.voltage : 0;
          const vBE = vB - vE;
          if (vBE > 0.65) {
            const ib = (vBE - 0.65) / 120;
            comp.current = Math.min(2.0, (comp.beta || 100) * ib);
          } else {
            comp.current = 0;
          }
        }
      }
    }

    // 5. Update Wires Current Flow
    for (const wire of this.wires) {
      const pFrom = this.getPinById(wire.fromPinId);
      const pTo = this.getPinById(wire.toPinId);
      if (pFrom && pTo) {
        const vFrom = pFrom.pin.voltage || 0;
        const vTo = pTo.pin.voltage || 0;
        // Direction and magnitude
        const c1 = pFrom.comp.current || 0;
        const c2 = pTo.comp.current || 0;
        wire.current = (Math.abs(c1) + Math.abs(c2)) / 2;
        wire.direction = vFrom >= vTo ? 1 : -1; // Positive to negative (conventional)
      }
    }
  }

  /* Reset any burned/blown components */
  resetBurned() {
    for (const comp of this.components) {
      comp.isBurned = false;
      comp.isBlown = false;
      comp.burnSmoke = false;
      if (comp.type === 'resistor' && comp.defaultResistance) {
        comp.resistance = comp.defaultResistance;
      }
    }
  }

  /* ==========================================================================
     UPDATE PARTICLES (CONVENTIONAL CURRENT FLOW: + TO -)
     ========================================================================== */
  updateParticles(dt) {
    const SPEED_SCALE = 60.0; // Visual speed

    for (const wire of this.wires) {
      if (!wire.particles) wire.particles = [];
      const I = wire.current || 0;

      // Adjust particle count based on current
      const targetCount = Math.min(12, Math.max(0, Math.floor(Math.abs(I) * 150)));
      while (wire.particles.length < targetCount) {
        wire.particles.push(Math.random());
      }
      while (wire.particles.length > targetCount) {
        wire.particles.pop();
      }

      // Animate particles along wire
      const step = Math.min(1.5, Math.abs(I) * SPEED_SCALE) * dt * (wire.direction || 1);
      for (let i = 0; i < wire.particles.length; i++) {
        wire.particles[i] += step;
        if (wire.particles[i] > 1.0) wire.particles[i] -= 1.0;
        if (wire.particles[i] < 0.0) wire.particles[i] += 1.0;
      }
    }
  }
}

// Global engine instance
window.CircuitEngine = CircuitEngine;
