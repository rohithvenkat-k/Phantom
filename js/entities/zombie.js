export class Zombie {
    constructor(canvas, word, speedMultiplier) {
        this.canvas = canvas;
        this.word = word;
        this.typedIndex = 0;
        this.isDead = false;

        this.x = canvas.width + 50;
        this.y = canvas.height - 45;
        this.speed = (25 + Math.random() * 15) * speedMultiplier;
        this.walkTimer = Math.random() * 100;
        this.height = 60;
    }

    update(dt) {
        if (this.isDead) return;
        this.x -= this.speed * dt;
        this.walkTimer += dt * (this.speed * 0.15);
    }

    draw(ctx) {
        if (this.isDead) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        const legOscillation = Math.sin(this.walkTimer) * 0.5;
        const bobY = Math.abs(Math.sin(this.walkTimer * 2)) * 3;

        const suitColor = "#2a3b29";
        const fleshColor = "#4a6b47";

        ctx.strokeStyle = suitColor;
        ctx.lineWidth = 5;
        ctx.lineCap = "round";

        ctx.beginPath();
        ctx.moveTo(0, -25 + bobY);
        ctx.lineTo(Math.sin(legOscillation) * 20, 0);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, -25 + bobY);
        ctx.lineTo(Math.sin(-legOscillation) * 20, 0);
        ctx.stroke();

        ctx.strokeStyle = suitColor;
        ctx.lineWidth = 14;
        ctx.beginPath();
        ctx.moveTo(0, -25 + bobY);
        ctx.lineTo(-12, -55 + bobY);
        ctx.stroke();
        
        ctx.fillStyle = fleshColor;
        ctx.beginPath();
        ctx.arc(-16, -65 + bobY, 10, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#dc2626";
        ctx.fillRect(-22, -68 + bobY, 4, 4);
        ctx.fillRect(-16, -68 + bobY, 4, 4);

        ctx.strokeStyle = fleshColor;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(-10, -50 + bobY);
        ctx.lineTo(10, -40 + bobY);
        ctx.stroke();

        ctx.restore();

        ctx.font = 'bold 18px "Courier New", monospace';
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";

        const completed = this.word.substring(0, this.typedIndex);
        const remaining = this.word.substring(this.typedIndex);
        const totalWidth = ctx.measureText(this.word).width;
        const textX = this.x - 16;
        const textY = this.y - 85;
        ctx.fillStyle = "#ef4444";
        ctx.fillText(completed, textX - (ctx.measureText(remaining).width/2), textY);

        ctx.fillStyle = "#fff";
        ctx.fillText(remaining, textX + (ctx.measureText(completed).width/2), textY);
    } 
}