/* ==========================================================================
   TEXTURES & PROCEDURAL SILKSCREEN GENERATOR
   ATT-25 Hardware 3D - Ultra-Realistic Motherboard Textures
   ========================================================================== */
const HARDWARE_TEXTURES = (function(){
  "use strict";

  /* Helper to create offscreen canvas */
  function createCanvas(w, h){
    const cvs = document.createElement('canvas');
    cvs.width = w; cvs.height = h;
    const ctx = cvs.getContext('2d');
    return { cvs, ctx };
  }

  /* 1. ULTRA-REALISTIC PCB TEXTURE (Silkscreen, Copper Traces, Serpentine Lines) */
  function createPcbTextures(){
    const size = 2048;
    const { cvs, ctx } = createCanvas(size, size);
    const bumpObj = createCanvas(size, size);
    const bCtx = bumpObj.ctx;

    // A. Base FR4 Substrate (Matte dark emerald-black)
    ctx.fillStyle = '#08130C';
    ctx.fillRect(0, 0, size, size);

    bCtx.fillStyle = '#808080';
    bCtx.fillRect(0, 0, size, size);

    // Subtle fiberglass weave pattern
    ctx.fillStyle = 'rgba(15, 35, 22, 0.35)';
    for(let x = 0; x < size; x += 4){
      ctx.fillRect(x, 0, 1, size);
    }
    for(let y = 0; y < size; y += 4){
      ctx.fillRect(0, y, size, 1);
    }

    // B. Ground Plane Copper Pour Hatching & Zones
    ctx.strokeStyle = '#0E2919';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for(let i = 0; i < size; i += 18){
      ctx.moveTo(i, 0); ctx.lineTo(i + size, size);
      ctx.moveTo(0, i); ctx.lineTo(size, i + size);
    }
    ctx.stroke();

    // C. Glowing Audio Isolation Trace (Yellow/Amber line separating bottom-left)
    ctx.save();
    ctx.strokeStyle = '#FBBF24';
    ctx.lineWidth = 6;
    ctx.shadowColor = '#F59E0B';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.moveTo(size * 0.03, size * 0.58);
    ctx.lineTo(size * 0.18, size * 0.58);
    ctx.lineTo(size * 0.22, size * 0.72);
    ctx.lineTo(size * 0.22, size * 0.95);
    ctx.stroke();
    ctx.restore();

    // Silkscreen text on Audio zone
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 16px "JetBrains Mono", monospace';
    ctx.fillText('SUPREME-FX AUDIO ISOLATION', size * 0.04, size * 0.62);
    ctx.font = '12px "JetBrains Mono", monospace';
    ctx.fillStyle = '#94A3B8';
    ctx.fillText('120dB SNR STEREO DAC • NICHICON GOLD CAPS', size * 0.04, size * 0.64);

    // D. Serpentine Trace Lines (Length-matched high-frequency memory & PCIe buses)
    function drawSerpentine(startX, startY, endX, endY, waveCount, amp, color){
      ctx.strokeStyle = color || '#00E676';
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      ctx.moveTo(startX, startY);

      const dx = (endX - startX) / waveCount;
      for(let i = 0; i < waveCount; i++){
        const cx = startX + i * dx + dx * 0.5;
        const cy = startY + (i % 2 === 0 ? amp : -amp);
        ctx.quadraticCurveTo(cx, cy, startX + (i + 1) * dx, endY);
      }
      ctx.stroke();

      // Bump map for traces
      bCtx.strokeStyle = '#FFFFFF';
      bCtx.lineWidth = 2.0;
      bCtx.stroke();
    }

    // Serpentine traces from CPU Socket to DDR5 Slots
    const cpuRightX = size * 0.58;
    const ramLeftX = size * 0.72;
    for(let y = size * 0.22; y <= size * 0.44; y += 12){
      drawSerpentine(cpuRightX, y, ramLeftX, y + (Math.random() - 0.5) * 8, 8, 6, 'rgba(0, 230, 118, 0.65)');
    }

    // PCIe 5.0 Differential Pairs (Dual parallel serpentine traces)
    const cpuBottomY = size * 0.46;
    const pcieTopY = size * 0.62;
    for(let x = size * 0.35; x <= size * 0.65; x += 16){
      drawSerpentine(x, cpuBottomY, x + (Math.random() - 0.5) * 12, pcieTopY, 6, 5, 'rgba(56, 189, 248, 0.6)');
      drawSerpentine(x + 4, cpuBottomY, x + 4 + (Math.random() - 0.5) * 12, pcieTopY, 6, 5, 'rgba(56, 189, 248, 0.6)');
    }

    // E. Golden Solder Pads and Test Points
    ctx.fillStyle = '#FBBF24';
    bCtx.fillStyle = '#FFFFFF';
    for(let i = 0; i < 280; i++){
      const px = Math.random() * size * 0.9 + size * 0.05;
      const py = Math.random() * size * 0.9 + size * 0.05;
      ctx.beginPath();
      ctx.arc(px, py, 2.5, 0, Math.PI * 2);
      ctx.fill();
      bCtx.beginPath();
      bCtx.arc(px, py, 2.5, 0, Math.PI * 2);
      bCtx.fill();
    }

    // F. Silkscreen Labels and Board Markings (White)
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '800 32px "Oswald", sans-serif';
    ctx.fillText('ATT-25 APEX Z790-E GAMING', size * 0.32, size * 0.12);

    ctx.font = '600 16px "JetBrains Mono", monospace';
    ctx.fillStyle = '#00FF87';
    ctx.fillText('PCIe 5.0 READY • DDR5 6400+ (OC) • 16+1+1 POWER STAGES', size * 0.32, size * 0.145);

    ctx.fillStyle = '#E2E8F0';
    ctx.font = '14px "JetBrains Mono", monospace';
    ctx.fillText('LGA1700 SOCKET FOR 13TH/14TH GEN INTEL PROCESSORS', size * 0.34, size * 0.21);
    ctx.fillText('DIMM_A1  DIMM_A2 (FIRST)  DIMM_B1  DIMM_B2 (FIRST)', size * 0.68, size * 0.18);
    ctx.fillText('PCIEX16(G5)_1  [PRIMARY GPU x16 HIGH SPEED BUS]', size * 0.32, size * 0.68);
    ctx.fillText('M.2_1 (SOCKET3) PCIE 4.0 X4 NVME 2280', size * 0.36, size * 0.55);
    ctx.fillText('CHA_FAN1   CPU_FAN   AIO_PUMP', size * 0.55, size * 0.08);
    ctx.fillText('ATX_12V_1 (8-PIN)   ATX_12V_2 (4-PIN)', size * 0.12, size * 0.08);
    ctx.fillText('24-PIN EATX POWER', size * 0.88, size * 0.48);

    // Front Panel & SATA Silkscreen
    ctx.fillText('SATA6G_1_2', size * 0.88, size * 0.72);
    ctx.fillText('SATA6G_3_4', size * 0.88, size * 0.78);
    ctx.fillText('U32G2_C FRONT', size * 0.88, size * 0.62);
    ctx.fillText('PANEL: PWR_SW / RESET / HDD_LED', size * 0.74, size * 0.96);

    // Corner Mounting Hole Silkscreen Rings
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    [[size*0.06, size*0.06], [size*0.94, size*0.06], [size*0.06, size*0.94], [size*0.94, size*0.94]].forEach(([hx, hy])=>{
      ctx.beginPath(); ctx.arc(hx, hy, 28, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(hx, hy, 36, 0, Math.PI * 2); ctx.stroke();
    });

    const map = new THREE.CanvasTexture(cvs);
    map.anisotropy = 8;
    const bumpMap = new THREE.CanvasTexture(bumpObj.cvs);
    bumpMap.anisotropy = 8;

    return { map, bumpMap };
  }

  /* 2. REALISTIC CPU IHS TEXTURE (Intel Core i9-13900K Laser Etch & DataMatrix) */
  function createCpuIhsTexture(){
    const size = 1024;
    const { cvs, ctx } = createCanvas(size, size);

    // Nickel-plated brushed copper background
    const grad = ctx.createLinearGradient(0, 0, size, size);
    grad.addColorStop(0, '#D4DCD7');
    grad.addColorStop(0.3, '#E6ECE9');
    grad.addColorStop(0.5, '#C8D2CC');
    grad.addColorStop(0.8, '#DCE4DF');
    grad.addColorStop(1, '#BCC8C1');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    // Micro brushed metal lines
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.04)';
    ctx.lineWidth = 1;
    for(let y = 0; y < size; y += 2){
      ctx.beginPath();
      ctx.moveTo(0, y + (Math.random() - 0.5) * 2);
      ctx.lineTo(size, y + (Math.random() - 0.5) * 2);
      ctx.stroke();
    }

    // Outer beveled edge shading
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.lineWidth = 16;
    ctx.strokeRect(8, 8, size - 16, size - 16);

    // Pin 1 Gold Triangle in bottom-left corner
    ctx.fillStyle = '#FBBF24';
    ctx.beginPath();
    ctx.moveTo(35, size - 35);
    ctx.lineTo(85, size - 35);
    ctx.lineTo(35, size - 85);
    ctx.closePath();
    ctx.fill();

    // Laser Etched Intel Typography (Deep dark grey with subtle emboss)
    ctx.fillStyle = '#2B3530';
    ctx.font = 'bold 54px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('intel®', 140, 240);

    ctx.font = '800 68px "Oswald", sans-serif';
    ctx.fillText('CORE™ i9', 140, 320);

    ctx.font = '700 48px "Oswald", sans-serif';
    ctx.fillStyle = '#3A4741';
    ctx.fillText('i9-13900K', 140, 380);

    ctx.font = '500 32px "JetBrains Mono", monospace';
    ctx.fillStyle = '#47554E';
    ctx.fillText('SRMBH 3.00GHZ', 140, 440);
    ctx.fillText('MALAY L234B567', 140, 485);
    ctx.fillText('V348J912 (e4)', 140, 530);

    // 2D DataMatrix barcode representation in top right
    const bx = size - 260, by = 180, bsize = 180;
    ctx.fillStyle = '#222A26';
    ctx.fillRect(bx, by, bsize, bsize);
    ctx.fillStyle = '#D4DCD7';
    const cells = 12;
    const cSize = bsize / cells;
    for(let r = 0; r < cells; r++){
      for(let c = 0; c < cells; c++){
        if((r === 0 || r === cells - 1 || c === 0) || Math.random() > 0.45){
          ctx.fillRect(bx + c * cSize, by + r * cSize, cSize - 1, cSize - 1);
        }
      }
    }

    const tex = new THREE.CanvasTexture(cvs);
    tex.anisotropy = 8;
    return tex;
  }

  /* 3. REALISTIC CR2032 CMOS COIN BATTERY TEXTURE */
  function createCmosBatteryTexture(){
    const size = 512;
    const { cvs, ctx } = createCanvas(size, size);

    // Stainless steel circular radial gradient
    const rGrad = ctx.createRadialGradient(size/2, size/2, 20, size/2, size/2, size/2);
    rGrad.addColorStop(0, '#FFFFFF');
    rGrad.addColorStop(0.6, '#D8E2DC');
    rGrad.addColorStop(0.9, '#9EAAA3');
    rGrad.addColorStop(1, '#6B7770');
    ctx.fillStyle = rGrad;
    ctx.beginPath();
    ctx.arc(size/2, size/2, size/2 - 4, 0, Math.PI * 2);
    ctx.fill();

    // Stamped Text
    ctx.fillStyle = '#2A332E';
    ctx.textAlign = 'center';
    ctx.font = '800 48px "Oswald", sans-serif';
    ctx.fillText('CR2032', size/2, size/2 - 30);
    ctx.font = '700 28px "JetBrains Mono", monospace';
    ctx.fillText('LITHIUM 3V', size/2, size/2 + 15);
    ctx.font = '900 64px sans-serif';
    ctx.fillText('+', size/2, size/2 + 90);
    ctx.font = '600 20px "JetBrains Mono", monospace';
    ctx.fillText('JAPAN STD', size/2, size/2 + 140);

    const tex = new THREE.CanvasTexture(cvs);
    return tex;
  }

  /* 4. REALISTIC DDR5 RAM HEATSPREADER TEXTURE */
  function createRamTexture(){
    const w = 1024, h = 256;
    const { cvs, ctx } = createCanvas(w, h);

    // Matte dark graphite anodized aluminum
    ctx.fillStyle = '#141C17';
    ctx.fillRect(0, 0, w, h);

    // Brushed metal streak texture
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    for(let y = 0; y < h; y += 3){
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    // Geometric gaming accent cuts
    ctx.fillStyle = '#00E676';
    ctx.beginPath();
    ctx.moveTo(w * 0.45, 20);
    ctx.lineTo(w * 0.55, 20);
    ctx.lineTo(w * 0.52, 35);
    ctx.lineTo(w * 0.42, 35);
    ctx.closePath();
    ctx.fill();

    // Brand & Spec typography
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '800 36px "Oswald", sans-serif';
    ctx.fillText('ATT-25 TRIDENT DDR5', 60, 90);

    ctx.font = '600 20px "JetBrains Mono", monospace';
    ctx.fillStyle = '#00FF87';
    ctx.fillText('6400MHz  CL32-39-39-102  1.35V  INTEL XMP 3.0', 60, 130);

    // Barcode sticker
    ctx.fillStyle = '#E2E8F0';
    ctx.fillRect(w - 320, 50, 260, 140);
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 14px "JetBrains Mono", monospace';
    ctx.fillText('PN: ATT25-DDR5-32G-K2', w - 305, 75);

    // Barcode lines
    let bx = w - 305;
    while(bx < w - 80){
      const bw = Math.random() > 0.5 ? 3 : 1.5;
      ctx.fillRect(bx, 90, bw, 50);
      bx += bw + (Math.random() * 3 + 1.5);
    }
    ctx.fillText('SN: 20260920X914', w - 305, 165);

    const tex = new THREE.CanvasTexture(cvs);
    return tex;
  }

  /* 5. M.2 NVME HEATSINK & CONTROLLER TEXTURE */
  function createM2Texture(){
    const w = 1024, h = 256;
    const { cvs, ctx } = createCanvas(w, h);

    ctx.fillStyle = '#16221A';
    ctx.fillRect(0, 0, w, h);

    // Chamfered edges
    ctx.strokeStyle = '#00E676';
    ctx.lineWidth = 4;
    ctx.strokeRect(8, 8, w - 16, h - 16);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '800 42px "Oswald", sans-serif';
    ctx.fillText('M.2 SHIELD FROZR', 70, 95);

    ctx.font = '600 22px "JetBrains Mono", monospace';
    ctx.fillStyle = '#FBBF24';
    ctx.fillText('PCIe Gen 4.0 x4  •  7300 MB/s NVMe 1.4', 70, 145);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '16px "JetBrains Mono", monospace';
    ctx.fillText('THERMAL GUARD WITH DIRECT HEAT DISSIPATION', 70, 185);

    const tex = new THREE.CanvasTexture(cvs);
    return tex;
  }

  return {
    createPcbTextures,
    createCpuIhsTexture,
    createCmosBatteryTexture,
    createRamTexture,
    createM2Texture
  };
})();
