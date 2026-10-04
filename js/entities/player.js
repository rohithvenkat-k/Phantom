export class Player {
    constructor(canvas) {
        this.canvas = canvas;
        this.x = 150;
        this.y = this.canvas.height - 45;
        this.aimAngle = 0;
        this.recoilX = 0;
        this.height = 70;
        this.weaponType = "RIFLE";
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
            this.recoilX += 140 * dt;
            if (this.recoilX > 0) this.recoilX = 0;
        }
    }

    triggerRecoil() {
        this.recoilX = this.weaponType === "BAZOOKA" ? -18 : -10;
    }

    draw(ctx, time) {
        ctx.save();
        ctx.translate(this.x, this.y);

        const armorColor = "#0f172a";
        const skinColor = "#334155";
        const breatheY = Math.sin(time * 2.5) * 1.5;

        ctx.fillStyle = armorColor;
        ctx.fillRect(-10, -40, 12, 40);
        ctx.fillRect(8, -40, 12, 40);

        ctx.fillRect(-12, -75 + breatheY, 34, 40);

        ctx.fillStyle = skinColor;
        ctx.beginPath();
        ctx.arc(5, -85 + breatheY, 12, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#ef4444";
        ctx.fillRect(8, -88 + breatheY, 8, 3);

        ctx.save();
        ctx.translate(15, -60 + breatheY);
        ctx.rotate(this.aimAngle);
        ctx.translate(this.recoilX, 0);

        ctx.strokeStyle = skinColor;
        ctx.lineWidth = 8;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(25, 0);
        ctx.stroke();

        if (this.weaponType === "BAZOOKA") {
            this.drawEquippedBazooka(ctx);
        } else {
            this.drawEquippedRifle(ctx);
        }

        ctx.restore();
        ctx.restore();
    }

    drawEquippedRifle(ctx) {
        ctx.fillStyle = "#1e293b";
        ctx.fillRect(20, -7, 40, 14);

        ctx.fillStyle = "#334155";
        ctx.fillRect(60, -4, 25, 8);
        ctx.fillStyle = "#020617";
        ctx.fillRect(83, -6, 6, 12);

        ctx.fillStyle = "#0f172a";
        ctx.beginPath();
        ctx.moveTo(32, 7);
        ctx.lineTo(36, 22);
        ctx.lineTo(44, 20);
        ctx.lineTo(40, 7);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "#475569";
        ctx.fillRect(28, -14, 22, 6);
        ctx.fillStyle = "#ef4444";
        ctx.fillRect(49, -13, 2, 4);
    }

    drawEquippedBazooka(ctx) {
        ctx.fillStyle = "#1e293b";
        ctx.fillRect(10, -11, 70, 22);

        ctx.fillStyle = "#475569";
        ctx.fillRect(78, -13, 8, 26);

        ctx.fillStyle = "#ea580c";
        ctx.beginPath();
        ctx.moveTo(86, -8);
        ctx.lineTo(98, 0);
        ctx.lineTo(86, 8);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "#020617";
        ctx.fillRect(25, 11, 7, 16);
        ctx.fillRect(52, 11, 7, 16);

        ctx.fillStyle = "#38bdf8";
        ctx.fillRect(35, -18, 20, 6);
    }
}