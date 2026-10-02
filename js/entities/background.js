// js/entities/background.js

export class Background {
  constructor(canvas) {
    this.canvas = canvas;
    this.distantBuildings = [];
    this.midBuildings = [];
    this.smokeVents = [];
    this.smokeParticles = [];
    this.flickerTimer = 0;
    this.initialize();
  }

  initialize() {
    this.distantBuildings = [];
    this.midBuildings = [];
    this.smokeVents = [];
    this.smokeParticles = [];

    const groundH = 45;
    const baseLine = this.canvas.height - groundH;

    // Layer 1: Far background dense skyline
    let curX = -20;
    while (curX < this.canvas.width + 50) {
      const w = 25 + Math.random() * 45;
      const h = 70 + Math.random() * 160;
      this.distantBuildings.push({
        x: curX,
        y: baseLine - h,
        w: w,
        h: h,
        color: `hsl(220, 15%, ${8 + Math.random() * 4}%)`
      });
      curX += w * 0.75;
    }

    // Layer 2: Mid-distance broken skyline with windows/flicker
    curX = -20;
    while (curX < this.canvas.width + 50) {
      const w = 35 + Math.random() * 65;
      const h = 100 + Math.random() * 200;
      const isDamaged = Math.random() > 0.45;
      const windows = [];

      // Generate grid windows
      const rows = Math.floor(h / 16);
      const cols = Math.floor(w / 12);
      for (let r = 1; r < rows - 1; r++) {
        for (let c = 1; c < cols; c++) {
          if (Math.random() > 0.72) {
            windows.push({
              relX: c * 10,
              relY: r * 14,
              lit: Math.random() > 0.5,
              flickers: Math.random() > 0.6
            });
          }
        }
      }

      const bld = {
        x: curX,
        y: baseLine - h,
        w: w,
        h: h,
        color: `hsl(215, 12%, ${5 + Math.random() * 4}%)`,
        isDamaged: isDamaged,
        damageH: 15 + Math.random() * 30,
        windows: windows
      };

      this.midBuildings.push(bld);

      if (isDamaged && Math.random() > 0.3) {
        this.smokeVents.push({ x: curX + w / 2, y: baseLine - h });
      }

      curX += w * 0.85;
    }
  }

  update(dt) {
    this.flickerTimer += dt;

    // Spawn smoke
    this.smokeVents.forEach((vent) => {
      if (Math.random() < 0.2) {
        this.smokeParticles.push({
          x: vent.x + (Math.random() - 0.5) * 8,
          y: vent.y,
          vx: 8 + Math.random() * 12, // Drift right
          vy: -20 - Math.random() * 35,
          life: 2.5 + Math.random() * 2.5,
          maxLife: 5,
          size: 6 + Math.random() * 8
        });
      }
    });

    for (let i = this.smokeParticles.length - 1; i >= 0; i--) {
      const p = this.smokeParticles[i];
      p.life -= dt;
      if (p.life <= 0) {
        this.smokeParticles.splice(i, 1);
        continue;
      }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.size += 3 * dt;
    }
  }

  draw(ctx) {
    const baseLine = this.canvas.height - 45;

    // Distant horizon layer
    this.distantBuildings.forEach((b) => {
      ctx.fillStyle = b.color;
      ctx.fillRect(b.x, b.y, b.w, b.h);
    });

    // Smoke behind mid-layer
    ctx.save();
    this.smokeParticles.forEach((p) => {
      const alpha = p.life / p.maxLife;
      ctx.fillStyle = `rgba(75, 85, 99, ${alpha * 0.25})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();

    // Mid layer buildings
    this.midBuildings.forEach((b) => {
      ctx.fillStyle = b.color;
      if (b.isDamaged) {
        // Jagged broken roof
        ctx.beginPath();
        ctx.moveTo(b.x, baseLine);
        ctx.lineTo(b.x, b.y + b.damageH);
        ctx.lineTo(b.x + b.w * 0.4, b.y);
        ctx.lineTo(b.x + b.w * 0.7, b.y + b.damageH * 0.8);
        ctx.lineTo(b.x + b.w, b.y + b.damageH * 0.3);
        ctx.lineTo(b.x + b.w, baseLine);
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.fillRect(b.x, b.y, b.w, b.h);
      }

      // Windows (flickering amber/cyan blackout grid)
      b.windows.forEach((win) => {
        let isLit = win.lit;
        if (win.flickers) {
          isLit = Math.sin(this.flickerTimer * 10 + win.relX) > 0.3;
        }
        if (isLit) {
          ctx.fillStyle = "rgba(253, 224, 71, 0.4)";
          ctx.fillRect(b.x + win.relX, b.y + win.relY, 4, 6);
        }
      });
    });

    // Foreground Street Ground
    ctx.fillStyle = "#090a0f";
    ctx.fillRect(0, baseLine, this.canvas.width, 45);
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, baseLine, this.canvas.width, 2);
  }
}