export class Background {
    constructor() {
        this.canvas = canvas;
        this.buildings = [];
        this.smokeParticles = [];
        this.smokingVents = [];
        this.initialize();
    }
    initialize() {
        let currentX = -50;
        while (currentX < this.canvas.width + 100) {
            const width = 60 + Math.random() * 120;
            const height = 150 + Math.random() * 300;
            this.buildings.push({
                x: currentX,
                y: this.canvas.height - height,
                w: width,
                h: height,
                color: `hsl(210, 10%, ${10 + Math.random() * 8}%)`,
            });
            currentX += width * (0.6 + Math.random() * 0.6);
        } 

        for (let i = 0; i < 5; i++) {
            const b = this.buildings[Math.floor(Math.random() * this.buildings.length)];
            this.smokingVents.push({x: b.x + b.w / 2, y: b.y });
        }
    }

    update(dt) {
        this.smokingVents.forEach((vent) => {
            if (Math.random() < 0.15) {
                this.smokeParticles.push({
                    x: vent.x + (Math.random() - 0.5) * 10,
                    y: vent.y,
                    vx: (Math.random() - 0.2) * 15,
                    vy: -30 - Math.random() * 50,
                    life: 2 + Math.random() * 3,
                    maxLife: 5,
                    size: 8 + Math.random() * 10,
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
            p.vy += 10 * dt;
            p.vx += 2 * dt;
        }
    }

    draw(ctx) {
        ctx.fillStyle = "#070809";
        ctx.fillRect(b.x, b.y, b.w, b.h);

        this.smokeParticles.forEach((p) => {
            ctx.fillStyle = b.color;
            ctx.fillRect(b.x, b.y, b.w, b.h);
            ctx.fillStyle = "rgba(0,0,0,0.5)";
            for(let i = 0; i < 3; i++){
                if (Math.random() > 0.6){
                    ctx.fillRect(b.x + b.w/4 + (Math.random()*b.w/2), b.y + 30 + (i*40), 10, 15);
                }
            }
        });
        
        ctx.save();
        this.smokeParticles.forEach((p) => {
            const alpha = p.life / p.maxLife;
            ctx.fillStyle = `rgba(100, 100, 100, ${alpha * 0.4})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * (2 - alpha), 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.restore();
    }
}