/* ==========================================================================
   CIRCUIT STORAGE & EXPORT/IMPORT MANAGER
   ATT-25 Circuit Lab JSON Save/Load, LocalStorage, and Image Export
   ========================================================================== */

class CircuitStorage {
  constructor(engine, getBreadboard3D, getCanvas) {
    this.engine = engine;
    this.getBreadboard3D = getBreadboard3D;
    this.getCanvas = getCanvas;
  }

  // 1. Serialize Circuit to JSON Object
  serialize() {
    const data = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      components: this.engine.components.map(c => ({
        id: c.id,
        type: c.type,
        name: c.name,
        x: c.x,
        y: c.y,
        rotation: c.rotation || 0,
        voltage: c.voltage,
        resistance: c.resistance,
        maxResistance: c.maxResistance,
        ratio: c.ratio,
        lightLevel: c.lightLevel,
        capacitance: c.capacitance,
        beta: c.beta,
        ledColor: c.ledColor,
        isOpen: c.isOpen,
        isBurned: c.isBurned
      })),
      wires: this.engine.wires.map(w => ({
        id: w.id,
        fromPinId: w.fromPinId,
        toPinId: w.toPinId,
        color: w.color || '#38BDF8'
      }))
    };
    return data;
  }

  // 2. Deserialize and Load Circuit
  deserialize(data, callbacks = {}) {
    if (!data || !Array.isArray(data.components)) {
      throw new Error("Noto‘g‘ri sxema fayl formati!");
    }

    if (callbacks.clearCircuit) callbacks.clearCircuit();
    else {
      this.engine.components = [];
      this.engine.wires = [];
    }

    const idMap = new Map(); // oldId -> newComponent

    for (const cData of data.components) {
      let comp = null;
      const type = cData.type;
      const x = cData.x || 200;
      const y = cData.y || 200;

      if (type === 'battery' || type === 'battery_9v') comp = new CircuitComponents.Battery(x, y, cData.voltage || 9.0);
      else if (type === 'battery_1v5') comp = new CircuitComponents.Battery(x, y, 1.5);
      else if (type === 'resistor') comp = new CircuitComponents.Resistor(x, y, cData.resistance || 220);
      else if (type === 'resistor_1k') comp = new CircuitComponents.Resistor(x, y, cData.resistance || 1000);
      else if (type === 'bulb') comp = new CircuitComponents.Bulb(x, y, cData.voltage || 6.0);
      else if (type === 'led') comp = new CircuitComponents.Led(x, y, cData.ledColor || '#EF4444');
      else if (type === 'led_green') comp = new CircuitComponents.Led(x, y, '#10B981');
      else if (type === 'switch') {
        comp = new CircuitComponents.Switch(x, y);
        if (cData.isOpen !== undefined) comp.isOpen = cData.isOpen;
      }
      else if (type === 'buzzer') comp = new CircuitComponents.Buzzer(x, y);
      else if (type === 'ground') comp = new CircuitComponents.Ground(x, y);
      else if (type === 'potentiometer') {
        comp = new CircuitComponents.Potentiometer(x, y, cData.maxResistance || 10000);
        if (cData.ratio !== undefined) comp.ratio = cData.ratio;
      }
      else if (type === 'ldr') {
        comp = new CircuitComponents.Ldr(x, y);
        if (cData.lightLevel !== undefined) comp.lightLevel = cData.lightLevel;
      }
      else if (type === 'capacitor') {
        comp = new CircuitComponents.Capacitor(x, y, cData.capacitance || 0.0001);
      }
      else if (type === 'transistor_npn') {
        comp = new CircuitComponents.TransistorNpn(x, y);
      }
      else if (type === 'motor') {
        comp = new CircuitComponents.DcMotor(x, y);
      }
      else if (type === 'gate_and' || type === 'gate_or' || type === 'gate_not' || type === 'gate_nand' || type === 'gate_nor' || type === 'gate_xor') {
        const gateType = type.replace('gate_', '');
        comp = new CircuitComponents.LogicGate(x, y, gateType);
      }
      else if (type === 'logic_gate') {
        comp = new CircuitComponents.LogicGate(x, y, cData.gateType || 'and');
      }
      else if (type === 'seven_segment') {
        comp = new CircuitComponents.SevenSegment(x, y);
      }
      else if (type === 'timer_555') {
        comp = new CircuitComponents.Timer555(x, y);
      }
      else if (type === 'arduino_uno' || type === 'arduino') {
        if (window.CircuitComponents && window.CircuitComponents.Arduino) {
          comp = new window.CircuitComponents.Arduino(x, y);
          if (cData.code) comp.code = cData.code;
        }
      }
      // === YANGI KOMPONENTLAR ===
      else if (type === 'ammeter') {
        comp = new CircuitComponents.Ammeter(x, y);
      }
      else if (type === 'voltmeter') {
        comp = new CircuitComponents.Voltmeter(x, y);
      }
      else if (type === 'diode') {
        comp = new CircuitComponents.Diode(x, y);
      }
      else if (type === 'dc_source') {
        comp = new CircuitComponents.DcSource(x, y, cData.voltage || 5.0);
      }
      // === FAZA 1: YANGI KOMPONENTLAR ===
      else if (type === 'transistor_pnp') {
        comp = new CircuitComponents.TransistorPnp(x, y);
        if (cData.beta !== undefined) comp.beta = cData.beta;
      }
      else if (type === 'mosfet_n') {
        comp = new CircuitComponents.MOSFETn(x, y);
        if (cData.Vth !== undefined) comp.Vth = cData.Vth;
        if (cData.K !== undefined) comp.K = cData.K;
      }
      else if (type === 'mosfet_p') {
        comp = new CircuitComponents.MOSFETp(x, y);
        if (cData.Vth !== undefined) comp.Vth = cData.Vth;
        if (cData.K !== undefined) comp.K = cData.K;
      }
      else if (type === 'inductor') {
        comp = new CircuitComponents.Inductor(x, y, cData.inductance || 0.001);
      }
      else if (type === 'transformer') {
        comp = new CircuitComponents.Transformer(x, y, cData.n1 || 1, cData.n2 || 1);
      }

      if (comp) {
        comp.rotation = cData.rotation || 0;
        comp.isBurned = !!cData.isBurned;
        this.engine.addComponent(comp);
        idMap.set(cData.id, comp);
      }
    }

    // Map old pin IDs to new pin IDs
    if (Array.isArray(data.wires)) {
      for (const wData of data.wires) {
        // Find which component and pin this was
        let newFromPinId = null;
        let newToPinId = null;

        for (const [oldCompId, newComp] of idMap.entries()) {
          if (wData.fromPinId && wData.fromPinId.startsWith(oldCompId)) {
            const suffix = wData.fromPinId.substring(oldCompId.length);
            newFromPinId = newComp.id + suffix;
          }
          if (wData.toPinId && wData.toPinId.startsWith(oldCompId)) {
            const suffix = wData.toPinId.substring(oldCompId.length);
            newToPinId = newComp.id + suffix;
          }
        }

        if (newFromPinId && newToPinId) {
          this.engine.addWire(newFromPinId, newToPinId, wData.color || '#38BDF8');
        }
      }
    }

    const bb3d = this.getBreadboard3D ? this.getBreadboard3D() : null;
    if (bb3d) bb3d.syncFromEngine();
  }

  // 3. Save to JSON File
  saveToFile(filename = 'att25_sxema.circuit.json') {
    const data = this.serialize();
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // 4. Load from JSON File via File Picker
  loadFromFile(callbacks = {}) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const parsed = JSON.parse(evt.target.result);
          this.deserialize(parsed, callbacks);
          if (callbacks.onSuccess) callbacks.onSuccess(file.name);
        } catch (err) {
          if (callbacks.onError) callbacks.onError(err.message);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }

  // 5. Browser LocalStorage Manager
  saveToBrowser(name) {
    if (!name) name = 'Sxema_' + new Date().toLocaleDateString('uz-UZ').replace(/\//g, '-');
    const data = this.serialize();
    const key = 'att25_circuit_' + name;
    localStorage.setItem(key, JSON.stringify(data));

    // Update index list
    const list = this.getBrowserSaves();
    if (!list.includes(name)) list.push(name);
    localStorage.setItem('att25_circuit_index', JSON.stringify(list));
    return name;
  }

  getBrowserSaves() {
    try {
      const raw = localStorage.getItem('att25_circuit_index');
      return raw ? JSON.parse(raw) : [];
    } catch(e) {
      return [];
    }
  }

  loadFromBrowser(name, callbacks = {}) {
    const key = 'att25_circuit_' + name;
    const raw = localStorage.getItem(key);
    if (!raw) throw new Error("Sxema topilmadi!");
    const parsed = JSON.parse(raw);
    this.deserialize(parsed, callbacks);
  }

  deleteBrowserSave(name) {
    localStorage.removeItem('att25_circuit_' + name);
    let list = this.getBrowserSaves();
    list = list.filter(n => n !== name);
    localStorage.setItem('att25_circuit_index', JSON.stringify(list));
  }

  // 6. Export as High-Res PNG Image
  exportImage(filename = 'sxema_chizma.png') {
    const canvas = this.getCanvas ? this.getCanvas() : null;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}

window.CircuitStorage = CircuitStorage;
