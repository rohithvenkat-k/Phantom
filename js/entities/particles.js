export class ParticleSystem {
    constructor() {
        this.particles = [];
        this.limbs = [];
    }

    addBloodExplosion(x, y) {
        for (let i = 0; i < 24; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 180 + 40;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 60,
                size: Math.random() * 4 + 2,
                color: Math.random() > 0.4 ? "#dc2626" : "#7f1d1d",
                alpha: 1.0,
                decay: Math.random() * 0.8 + 0.6,
                type: "blood"
            });
        }
    }

    addSeveredLimb(x, y, limbType, groundY) {
        const vx = (Math.random() - 0.3) * 160 + 40;
        const vy = -(Math.random() * 140 + 80);
        this.limbs.push({
            x: x,
            y: y,
            vx: vx,
            vy: vy,
            rot: Math.random() * Math.PI * 2,
            vRot: (Math.random() - 0.5) * 12,
            groundY: groundY,
            type: limbType,
            alpha: 1.0,
            bounces: 0
        });
    }

    addMuzzleFlash(x, y, angle) {
        for (let i = 0; i < 6; i++) {
            const spread = (Math.random() - 0.5) * 0.35;
            const speed = Math.random() * 220 + 80;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle + spread) * speed,
                vy: Math.sin(angle + spread) * speed,
                size: Math.random() * 3 + 2,
                color: Math.random() > 0.5 ? "#fef08a" : "#f97316",
                alpha: 1.0,
                decay: 3.5,
                type: "spark"
            });
        }
    }

    addBulletTracer(x1, y1, x2, y2) {
        this.particles.push({
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2,
            alpha: 1.0,
            decay: 14.0,
            type: "tracer"
        });
    }

    update(dt) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.alpha -= p.decay * dt;

            if (p.type === "blood" || p.type === "spark") {
                p.x += p.vx * dt;
                p.y += p.vy * dt;
                p.vy += 380 * dt;
            }

            if (p.alpha <= 0) {
                this.particles.splice(i, 1);
            }
        }

        for (let j = this.limbs.length - 1; j >= 0; j--) {
            const l = this.limbs[j];
            l.x += l.vx * dt;
            l.y += l.vy * dt;
            l.vy += 520 * dt;
            l.rot += l.vRot * dt;

            if (l.y >= l.groundY) {
                l.y = l.groundY;
                if (l.bounces < 2) {
                    l.vy = -l.vy * 0.35;
                    l.vx *= 0.6;
                    l.bounces++;
                } else {
                    l.vx = 0;
                    l.vy = 0;
                    l.vRot = 0;
                    l.alpha -= 0.15 * dt; // Slowly sink into ground
                }
            }

            if (l.alpha <= 0) {
                this.limbs.splice(j, 1);
            }
        }
    }

    draw(ctx) {
        for (const p of this.particles) {
            ctx.save();
            ctx.globalAlpha = Math.max(0, p.alpha);

            if (p.type === "tracer") {
                ctx.strokeStyle = "#fef08a";
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.moveTo(p.x1, p.y1);
                ctx.lineTo(p.x2, p.y2);
                ctx.stroke();
            } else {
                ctx.fillStyle = p.color;
                ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
            }
            ctx.restore();
        }

        for (const l of this.limbs) {
            ctx.save();
            ctx.globalAlpha = Math.max(0, l.alpha);
            ctx.translate(l.x, l.y);
            ctx.rotate(l.rot);

            if (l.type === "ARM") {
                ctx.fillStyle = "#374151";
                ctx.fillRect(-3, -12, 6, 24);
                ctx.fillStyle = "#dc2626";
                ctx.fillRect(-3, -14, 6, 4);
            } else if (l.type === "HAND") {
                ctx.fillStyle = "#4b5563";
                ctx.fillRect(-2, -4, 5, 9);
                ctx.fillStyle = "#ef4444";
                ctx.fillRect(-2, -5, 5, 2);
            } else if (l.type === "HEAD") {
                ctx.fillStyle = "#1f2937";
                ctx.beginPath();
                ctx.arc(0, 0, 10, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = "#dc2626";
                ctx.fillRect(-6, 7, 12, 4);
            } else if (l.type === "EYE") {
                ctx.fillStyle = "#ffffff";
                ctx.beginPath();
                ctx.arc(0, 0, 4, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = "#dc2626";
                ctx.beginPath();
                ctx.arc(1, 0, 2, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.restore();
        }
    }
}