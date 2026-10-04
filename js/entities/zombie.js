export class Zombie {
    constructor(canvas, word, speedMult = 1.0, isBoss = false) {
        this.canvas = canvas;
        this.word = word;
        this.typedIndex = 0;
        this.isDead = false;
        this.speedMult = speedMult;
        this.isBoss = isBoss;

        this.x = canvas.width + 40;
        this.y = canvas.height - 45;
        this.speed = (isBoss ? 16 : 28 + Math.random() * 14) * speedMult;
        this.animTimer = Math.random() * 10;

        this.isCrawling = !isBoss && Math.random() < 0.25;
        this.hasLostLeftArm = false;
        this.hasLostRightArm = false;
        this.hasPoppedEye = false;

        this.scale = isBoss ? 1.7 : 1.0;
    
    }

    update(dt) {
        if (this.isDead) return;
        this.animTimer += dt * (this.isCrawling ? 3.5 : 5.0);
        this.x -= this.speed * dt;
    }

    draw(ctx) {
        if (this.isDead) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.scale(this.scale, this.scale);

        const s = Math.sin(this.animTimer);
        const c = Math.cos(this.animTimer);

        if (this.isBoss) {
            ctx.fillStyle = "rgba(220, 38, 38, 0.18)";
            ctx.beginPath();
            ctx.arc(0, -50, 45, 0, Math.PI * 2);
            ctx.fill();
        }

        if (this.isCrawling) {
            ctx.strokeStyle = "#1f2937";
            ctx.lineWidth = 10;
            ctx.lineCap = "round";

            ctx.beginPath();
            ctx.moveTo(-15, -12);
            ctx.lineTo(20, -14);
            ctx.stroke();

            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.moveTo(20, -14);
            ctx.lineTo(40 + s * 6, -6);
            ctx.stroke();

            if (!this.hasLostLeftArm) {
                ctx.beginPath();
                ctx.moveTo(0, -12);
                ctx.lineTo(-24 + c * 10, -2);
                ctx.stroke();
            }

            ctx.fillStyle = "#111827";
            ctx.beginPath();
            ctx.arc(-22, -22, 10, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = "#ef4444";
            ctx.fillRect(-26, -24, 3, 3);
        } else {
            ctx.strokeStyle = this.isBoss ? "#450a0a" : "#1f2937";
            ctx.lineWidth = 8;
            ctx.lineCap = "round";

            ctx.beginPath();
            ctx.beginPath();
            ctx.lineTo(-10 + s * 8, 0);
            ctx.moveTo(0, -32);
            ctx.lineTo(10 - s * 8, 0);
            ctx.stroke();

            ctx.lineWidth = 6;
            if (!this.hasLostLeftArm) {
                ctx.beginPath();
                ctx.moveTo(-3, -56);
                ctx.lineTo(-26 + s * 4, -48 + c * 4);
                ctx.stroke();
            }
            if (!this.hasLostRightArm) {
                ctx.beginPath();
                ctx.moveTo(-3, -52);
                ctx.lineTo(-24 - s * 4, -42 - c * 4);
                ctx.stroke();
            }

            ctx.fillStyle = this.isBoss ? "#3f1515" : "#111827";
            ctx.beginPath();
            ctx.arc(-6, -78, 12, 0, Math.PI * 2);
            ctx.fill();

            if (!this.hasPoppedEye) {
                ctx.fillStyle = "#ef4444";
                ctx.fillRect(-12, -81, 4, 4);
            }
        }
        ctx.restore();

        this.drawWord(ctx);
    }

    drawWord(ctx) {
        const wordY = this.isCrawling ? this.y - 40 : this.y - (this.isBoss ? 155 : 95);
        ctx.font = this.isBoss ? "bold 20px 'Courier New', monospace" : "bold 15px 'Courier New', monospace";
        ctx.textAlign = "center";

        const typedPart = this.word.substring(0, this.typedIndex);
        const untypedPart = this.word.substring(this.typedIndex);

        const fullWidth = ctx.measureText(this.word).width;
        const typedWidth = ctx.measureText(typedPart).width;

        const startX = this.x - fullWidth / 2;

        if (this.isBoss) {
            ctx.fillStyle = "rgba(220, 38, 38, 0.4)";
            ctx.fillRect(startX - 8, wordY - 18, fullWidth + 16, 24);
        }

        ctx.textAlign = "left";
        ctx.fillStyle = "#22c55e";
        ctx.fillText(typedPart, startX, wordY);

        ctx.fillStyle = this.isBoss ? "#f87171" : "#f3f4f6";
        ctx.fillText(untypedPart, startX + typedWidth, wordY);
    }
}