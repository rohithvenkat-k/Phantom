export class Player {
    constructor(canvas) {
        this.canvas = canvas;
        this.x = 150;
        this.y = this.canvas.height - 45;
        this.aimAngle = 0;
        this.recoilX = 0;
        this.height = 70;
    }

    update(dt, targetZombie) {
        if (targetZombie) {
            const dx = targetZombie.x - (this.x + 20);
            const dy = targetZombie.y - 70 - (this.y - 45);
            this.aimAngle = Math.atan2(dy, dx);
        } else {
            this.aimAngle = 0;
        }

        if (this.recoilX < 0) {
            this.recoilX += 120 * dt;
            if (this.recoilX > 0) this.recoilX = 0;
        }
    }
    triggerRecoil() {
        this.recoilX = -10;
    }

    draw(ctx, time) {
        ctx.save();
        ctx.translate(this.x, this.y);

        const armorColor = "#1a1d21";
        const skinColor = "#444";
        const gunColor = "#333";
        const highlight = "#ef4444";

        ctx.fillStyle = armorColor;
        ctx.fillRect(-10, -40, 12, 40);
        ctx.fillRect(8, -40, 12, 40);

        const breatheY = Math.sin(time * 2) * 1.5;
        ctx.fillStyle = armorColor;
        ctx.fillRect(-12, -75 + breatheY, 34, 40);

        ctx.fillStyle = skinColor;
        ctx.beginPath();
        ctx.arc(5, -85 + breatheY, 12, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = highlight;
        ctx.fillRect(8, -88 + breatheY, 8, 3);

        ctx.save();
        ctx.translate(15, -60 + breatheY);
        ctx.rotate(this.aimAngle);
        ctx.translate(this.recoilX, 0);

        ctx.strokeStyle = skinColor;
        ctx.lineWidth = 9;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(25, 0);
        ctx.stroke();

        ctx.fillStyle = gunColor;
        ctx.fillRect(20, -6, 35, 12);
        ctx.fillRect(50, -3, 15, 6);
        ctx.fillStyle = "#111";
        ctx.fillRect(25, 6, 8, 15);
        ctx.fillStyle = highlight;
        ctx.fillRect(52, -1, 3, 3);
        ctx.restore();
        ctx.restore();
    }
}