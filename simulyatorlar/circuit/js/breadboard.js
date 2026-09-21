/* ==========================================================================
   VIRTUAL BREADBOARD RENDERER & COORDINATE SNAPPER
   ATT-25 Circuit Lab Breadboard Grid, Rails & Holes
   ========================================================================== */

class VirtualBreadboard {
  constructor(x = 120, y = 80, cols = 30) {
    this.x = x;
    this.y = y;
    this.cols = cols;
    this.pitch = 16; // 16px between holes
    this.width = cols * this.pitch + 80;
    this.height = 320;
    this.holes = [];
    this.initHoles();
  }

  initHoles() {
    this.holes = [];
    // Top Power Rails (+ and -)
    for (let c = 0; c < this.cols; c++) {
      const hx = this.x + 40 + c * this.pitch;
      this.holes.push({ x: hx, y: this.y + 24, type: 'rail_pos_top', col: c });
      this.holes.push({ x: hx, y: this.y + 42, type: 'rail_neg_top', col: c });
    }

    // Terminal Strip (Rows a, b, c, d, e)
    const rowsTop = ['a', 'b', 'c', 'd', 'e'];
    for (let r = 0; r < rowsTop.length; r++) {
      for (let c = 0; c < this.cols; c++) {
        const hx = this.x + 40 + c * this.pitch;
        const hy = this.y + 76 + r * this.pitch;
        this.holes.push({ x: hx, y: hy, type: 'terminal_top', row: rowsTop[r], col: c });
      }
    }

    // Terminal Strip (Rows f, g, h, i, j)
    const rowsBottom = ['f', 'g', 'h', 'i', 'j'];
    for (let r = 0; r < rowsBottom.length; r++) {
      for (let c = 0; c < this.cols; c++) {
        const hx = this.x + 40 + c * this.pitch;
        const hy = this.y + 180 + r * this.pitch;
        this.holes.push({ x: hx, y: hy, type: 'terminal_bottom', row: rowsBottom[r], col: c });
      }
    }

    // Bottom Power Rails (+ and -)
    for (let c = 0; c < this.cols; c++) {
      const hx = this.x + 40 + c * this.pitch;
      this.holes.push({ x: hx, y: this.y + 276, type: 'rail_pos_bot', col: c });
      this.holes.push({ x: hx, y: this.y + 294, type: 'rail_neg_bot', col: c });
    }
  }

  findNearestHole(px, py, maxDist = 18) {
    let nearest = null;
    let minDist = maxDist;
    for (const h of this.holes) {
      const d = Math.hypot(h.x - px, h.y - py);
      if (d < minDist) {
        minDist = d;
        nearest = h;
      }
    }
    return nearest;
  }

  draw(ctx) {
    ctx.save();

    // Breadboard White/Cream Body
    ctx.fillStyle = '#F1F5F9';
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(this.x, this.y, this.width, this.height, 12);
    ctx.fill(); ctx.stroke();

    // Center divider trough (DIP IC slot)
    ctx.fillStyle = '#CBD5E1';
    ctx.fillRect(this.x + 20, this.y + 158, this.width - 40, 14);

    // Power Rail Colored Lines
    ctx.lineWidth = 2.5;

    // Top + (Red) & - (Blue)
    ctx.strokeStyle = '#EF4444';
    ctx.beginPath();
    ctx.moveTo(this.x + 30, this.y + 16); ctx.lineTo(this.x + this.width - 30, this.y + 16);
    ctx.stroke();

    ctx.strokeStyle = '#38BDF8';
    ctx.beginPath();
    ctx.moveTo(this.x + 30, this.y + 50); ctx.lineTo(this.x + this.width - 30, this.y + 50);
    ctx.stroke();

    // Bottom + (Red) & - (Blue)
    ctx.strokeStyle = '#EF4444';
    ctx.beginPath();
    ctx.moveTo(this.x + 30, this.y + 268); ctx.lineTo(this.x + this.width - 30, this.y + 268);
    ctx.stroke();

    ctx.strokeStyle = '#38BDF8';
    ctx.beginPath();
    ctx.moveTo(this.x + 30, this.y + 302); ctx.lineTo(this.x + this.width - 30, this.y + 302);
    ctx.stroke();

    // Column numbers (1, 5, 10, 15, 20, 25, 30)
    ctx.fillStyle = '#64748B';
    ctx.font = '9px JetBrains Mono';
    ctx.textAlign = 'center';
    for (let c = 0; c < this.cols; c += 5) {
      const hx = this.x + 40 + c * this.pitch;
      ctx.fillText((c + 1).toString(), hx, this.y + 68);
      ctx.fillText((c + 1).toString(), hx, this.y + 262);
    }

    // Row letters (a-e, f-j)
    ctx.textAlign = 'right';
    const rowsTop = ['a', 'b', 'c', 'd', 'e'];
    rowsTop.forEach((l, i) => {
      ctx.fillText(l, this.x + 32, this.y + 80 + i * this.pitch);
    });
    const rowsBot = ['f', 'g', 'h', 'i', 'j'];
    rowsBot.forEach((l, i) => {
      ctx.fillText(l, this.x + 32, this.y + 184 + i * this.pitch);
    });

    // Draw all holes
    for (const h of this.holes) {
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(h.x - 2, h.y - 2, 4, 4);
    }

    ctx.restore();
  }
}

window.VirtualBreadboard = VirtualBreadboard;
