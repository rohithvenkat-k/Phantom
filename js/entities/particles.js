// js/entities/particles.js

export class ParticleSystem {
  constructor() {
    this.particles = [];
    this.tracers = [];
    this.muzzleFlashes = [];
  }

  addMuzzleFlash(x, y, angle) {
    this.muzzleFlashes.push({
      x,
      y,
      angle,
      life: 0.05,
      maxLife: 0.05,
    });
  }

  addBulletTracer(fromX, fromY, toX, toY) {
    this.tracers.push({
      fromX,
      fromY,
      toX,
      toY,
      life: 0.06,
      maxLife: 0.06,
    });
  }

  addBloodExplosion(x, y) {
    const count = 28;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 40 + Math.random() * 220;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 50,
        size: 2 + Math.random() * 4,
        color: Math.random() > 0.3 ? "#ef4444" : "#991b1b",
        life: 0.4 + Math.random() * 0.4,
        maxLife: 0.8,
      });
    }
  }

  update(dt) {
    // Tracers decay
    for (let i = this.tracers.length - 1; i >= 0; i--) {
      this.tracers[i].life -= dt;
      if (this.tracers[i].life <= 0) this.tracers.splice(i, 1);
    }

    // Muzzle flashes decay
    for (let i = this.muzzleFlashes.length - 1; i >= 0; i--) {
      this.muzzleFlashes[i].life -= dt;
      if (this.muzzleFlashes[i].life <= 0) this.muzzleFlashes.splice(i, 1);
    }

    // Blood particles update
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 380 * dt; // Gravity
    }
  }

  draw(ctx) {
    // 1. Draw bullet tracers
    ctx.save();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = "#fef08a";
    this.tracers.forEach((t) => {
      ctx.beginPath();
      ctx.moveTo(t.fromX, t.fromY);
      ctx.lineTo(t.toX, t.toY);
      ctx.stroke();
    });
    ctx.restore();

    // 2. Draw muzzle flashes
    ctx.save();
    this.muzzleFlashes.forEach((f) => {
      ctx.translate(f.x, f.y);
      ctx.rotate(f.angle);
      ctx.fillStyle = "#facc15";
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(16, -6);
      ctx.lineTo(24, 0);
      ctx.lineTo(16, 6);
      ctx.closePath();
      ctx.fill();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    });
    ctx.restore();

    // 3. Draw blood particles
    ctx.save();
    this.particles.forEach((p) => {
      const alpha = p.life / p.maxLife;
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, alpha);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }
}