export class CinematicEngine {
    constructor(canvas) {
        this.canvas = canvas;
        this.currentChapter = 0;
        this.chapterTimer = 0;
        this.isFinished = false;
        this.shakeAmount = 0;
        this.globeAngle = 0;
        this.chapters = [
            {
                title: "ACT I : OUTBREAK ORBIT",
                text: "Deep beneath the atmosphere, a bio-hazard awakened.\nWithin days, the green plague encircled the globe.",
                duration: 6.5
            },
            {
                title: "ACT II : THE LAST MEAL",
                text: "A quiet lunch at home with his girlfriend and parents.\nThe glass shattered. The infected tore through the doorway.",
                duration: 6.5
            },
            {
                title: "ACT III : STEEL & BARBED WIRE",
                text: "Backed against the wall, he seized his barbed-wire baseball bat.\nScreaming in agony, he crushed their skulls with his own hands.",
                duration: 6.0
            },
            {
                title: "ACT IV : AN ARSENAL AT THE GRAVES",
                text: "Over their wooden crosses, he laid down the bat and gripped heavy artillery.\n'I swear on your souls... this world will burn until it is pure.'",
                duration: 7.0
            },
        ];
        this.totalChapters = this.chapters.length;
    }

    reset() {
        this.currentChapter = 0;
        this.chapterTimer = 0;
        this.isFinished = false;
        this.shakeAmount = 0;
        this.globeAngle = 0;
    }

    skip() {
        this.isFinished = true;
    }

    update(dt) {
        if (this.isFinished) return;
        if (this.currentChapter >= this.totalChapters) {
            this.isFinished = true;
            return;
        }
        this.chapterTimer += dt;
        this.globeAngle += dt * 0.45;

        if (this.shakeAmount > 0) {
            this.shakeAmount = Math.max(0, this.shakeAmount - dt * 25);
        }

        const cur = this.chapters[this.currentChapter];
        if (!cur) {
            this.isFinished = true;
            return;
        }
        if (this.chapterTimer >= cur.duration) {
            this.currentChapter++;
            this.chapterTimer = 0;
            this.shakeAmount = 10;
            if (this.currentChapter >= this.totalChapters) {
                this.isFinished = true;
            }
        }
    }

    draw(ctx) {
        if (this.isFinished) return;
        const w = this.canvas.width;
        const h = this.canvas.height;
        const t = this.chapterTimer;

        ctx.save();

        if (this.shakeAmount > 0) {
            const sx = (Math.random() - 0.5) * this.shakeAmount;
            const sy = (Math.random() - 0.5) * this.shakeAmount;
            ctx.translate(sx, sy);
        }

        ctx.fillStyle = "#020305";
        ctx.fillRect(0, 0, w, h);

        switch (this.currentChapter) {
            case 0:
                this.drawScene1_3DGlobe(ctx, w, h, t);
                break;
            case 1:
                this.drawScene2_Lunch(ctx, w, h, t);
                break;
            case 2:
                this.drawScene3_BatExecution(ctx, w, h, t);
                break;
            case 3:
                this.drawScene4_GraveyardArsenal(ctx, w, h, t);
                break;
        }

        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, w, 60);
        ctx.fillRect(0, h - 130, w, 130);

        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.strokeRect(40, 60, w - 80, h - 190);

        this.drawDialogue(ctx, w, h);
        ctx.restore();
    }

    drawScene1_3DGlobe(ctx, w, h, t) {
        const cx = w * 0.5;
        const cy = h * 0.48;
        const R = Math.min(w, h) * 0.28;
        const gradient = ctx.createRadialGradient(cx, cy, R * 0.7, cx, cy, R * 1.35);
        gradient.addColorStop(0, "rgba(34, 197, 94, 0.25)");
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(cx, cy, R * 1.3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#030a06";
        ctx.beginPath();
        ctx.arc(cx, cy, R, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "rgba(74, 222, 128, 0.2)";
        ctx.lineWidth = 1;
        for (let i = 0; i < 12; i++) {
            const lon = this.globeAngle + (i * Math.PI) / 6;
            const rx = Math.cos(lon) * R;
            ctx.beginPath();
            ctx.ellipse(cx, cy, Math.abs(rx), R, 0, 0, Math.PI * 2);
            ctx.stroke();
        }

        for (let j = 1; j < 6; j++) {
            const latY = (j / 6 - 0.5) * 1.7 * R;
            const latR = Math.sqrt(Math.max(0, R * R - latY * latY));
            ctx.beginPath();
            ctx.ellipse(cx, cy + latY, latR, latR * 0.25, 0, 0, Math.PI * 2);
            ctx.stroke();
        }

        ctx.fillStyle = "#22c55e";
        ctx.strokeStyle = "#4ade80";
        ctx.lineWidth = 2;
        for (let v = 0; v < 18; v++) {
            const phi = (v * 0.7) + this.globeAngle;
            const theta = (v * 1.1) - 1.2;
            const x3d = Math.cos(theta) * Math.sin(phi);
            const y3d = Math.sin(theta);
            const z3d = Math.cos(theta) * Math.cos(phi);

            if (z3d > 0) {
                const sx = cx + x3d * R;
                const sy = cy + y3d * R;
                const pulse = 3 + Math.sin(t * 8 + v) * 2;
                ctx.beginPath();
                ctx.arc(sx, sy, pulse, 0, Math.PI * 2);
                ctx.fill();

                ctx.beginPath();
                ctx.moveTo(sx, sy);
                ctx.lineTo(sx + Math.sin(v) * 22, sy + Math.cos(v) * 20);
                ctx.stroke();
            }
        }
    }
    drawScene2_Lunch(ctx, w, h, t) {
        const ground = h - 130;
        const cx = w * 0.5;
        ctx.fillStyle = "#0a0c10";
        ctx.fillRect(cx - 320, 70, 640, ground - 70);
        ctx.fillStyle = "#030406";
        ctx.fillRect(cx - 50, 90, 100, 160);
        ctx.strokeStyle = "#dc2626";
        ctx.strokeRect(cx - 50, 90, 100, 160);

        ctx.fillStyle = "#ef4444";
        ctx.fillRect(cx - 20, 140, 5, 5);
        ctx.fillRect(cx - 10, 140, 5, 5);
        ctx.fillRect(cx + 10, 150, 5, 5);
        ctx.fillRect(cx + 20, 150, 5, 5);

        ctx.fillStyle = "#3f2818";
        ctx.fillRect(cx - 150, ground - 75, 300, 18);

        ctx.fillRect(cx - 150, ground - 75, 300, 18);
        ctx.fillRect(cx + 128, ground - 57, 12, 57);

        ctx.fillStyle = "#9ca3af";
        ctx.fillRect(cx - 90, ground - 82, 35, 7);
        ctx.fillRect(cx - 15, ground - 82, 35, 7);
        ctx.fillRect(cx + 60, ground - 82, 35, 7);

        this.drawSeatedFigure(ctx, cx - 110, ground - 75, "#1e293b", "MOM");
        this.drawSeatedFigure(ctx, cx - 40, ground - 75, "#1e293b", "DAD");
        this.drawSeatedFigure(ctx, cx + 40, ground - 75, "#334155", "GIRLFRIEND");
        this.drawSeatedFigure(ctx, cx + 110, ground - 75, "#475569", "HERO");
    }
    drawScene3_BatExecution(ctx, w, h, t) {
        const cx = w * 0.45;
        const cy = h * 0.54;

        this.drawSpeedlines(ctx, w, h, 20);

        ctx.save();
        ctx.translate(cx - 60, cy);

        ctx.strokeStyle = "#e5e7eb";
        ctx.lineWidth = 14;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(20, -50);
        ctx.stroke();

        ctx.fillStyle = "#e5e7eb";
        ctx.beginPath();
        ctx.arc(20, -72, 13, 0, Math.PI * 2);
        ctx.fill();

        ctx.lineWidth = 9;
        ctx.beginPath();
        ctx.moveTo(15, -45);
        ctx.lineTo(60, -65);
        ctx.stroke();

        this.drawBarbedBat(ctx, 60, -65, -0.65);

        ctx.restore();

        ctx.save();
        ctx.translate(cx + 140, cy);
        ctx.strokeStyle = "#7f1d1d";
        ctx.lineWidth = 12;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-30, -45);
        ctx.stroke();

        ctx.fillStyle = "#dc2626";
        for (let i = 0; i < 20; i++) {
            ctx.fillRect(
                -50 + Math.cos(i * 1.5) * (i * 7),
                -50 + Math.sin(i * 1.5) * (i * 7),
                5,
                5
            );
        }
        ctx.restore();
    }

    drawScene4_GraveyardArsenal(ctx, w, h, t) {
        const ground = h - 130;
        const cx = w * 0.5;

        const names = ["MOTHER", "FATHER", "EMMA"];
        [-170, -90, -10].forEach((ox, idx) => {
            ctx.strokeStyle = "#6b7280";
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(cx + ox, ground);
            ctx.lineTo(cx + ox, ground - 75);
            ctx.moveTo(cx + ox - 18, ground - 55);
            ctx.lineTo(cx + ox + 18, ground - 55);
            ctx.stroke();

            ctx.fillStyle = "#ef4444";
            ctx.font = "bold 10px monospace";
            ctx.fillText(names[idx], cx + ox - 18, ground - 82);
        });

        this.drawBarbedBat(ctx, cx - 140, ground - 8, Math.PI / 2);

        ctx.save();
        ctx.translate(cx + 80, ground);
        ctx.strokeStyle = "#e5e7eb";
        ctx.lineWidth = 10;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(-15, 0);
        ctx.lineTo(0, -25);
        ctx.lineTo(25, 0);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, -25);
        ctx.lineTo(-10, -55);
        ctx.stroke();

        ctx.fillStyle = "#e5e7eb";
        ctx.beginPath();
        ctx.arc(-14, -68, 11, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();


        this.drawDetailedBazooka(ctx, cx + 140, ground - 80, -0.2);
        this.drawDetailedRifle(ctx, cx + 180, ground - 65, 0.15);
        this.drawGrenade(ctx, cx + 115, ground - 12);
        this.drawGrenade(ctx, cx + 128, ground - 12);
    }

    drawBarbedBat(ctx, x, y, angle) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        ctx.fillStyle = "#854d0e";
        ctx.fillRect(0, -6, 25, 12);
        ctx.fillStyle = "#a16207";
        ctx.beginPath();
        ctx.moveTo(25, -6);
        ctx.lineTo(85, -11);
        ctx.lineTo(92, 0);
        ctx.lineTo(85, 11);
        ctx.lineTo(25, 6);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "#d1d5db";
        ctx.fillRect(4, -7, 18, 14);

        ctx.strokeStyle = "#94a3b8";
        ctx.lineWidth = 2;
        for (let bx = 45; bx < 85; bx += 8) {
            ctx.beginPath();
            ctx.moveTo(bx, -12);
            ctx.lineTo(bx + 4, 12);
            ctx.stroke();

            ctx.fillStyle = "#cbd5e1";
            ctx.fillRect(bx - 2, -13, 3, 3);
            ctx.fillRect(bx + 3, 11, 3, 3);
        }

        ctx.fillStyle = "rgba(185, 28, 28, 0.85)";
        ctx.fillRect(72, -9, 18, 18);

        ctx.restore();
    }
    drawDetailedBazooka(ctx, x, y, angle) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        ctx.fillStyle = "#1e293b";
        ctx.fillRect(-15, -10, 95, 20);

        ctx.fillStyle = "#0f172a";
        ctx.beginPath();
        ctx.moveTo(-15, -14);
        ctx.lineTo(0, -10);
        ctx.lineTo(0, 10);
        ctx.lineTo(-15, 14);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "#334155";
        ctx.fillRect(78, -12, 10, 24);

        ctx.fillStyle = "#ea580c";
        ctx.beginPath();
        ctx.moveTo(88, -8);
        ctx.lineTo(104, 0);
        ctx.lineTo(88, 8);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "#475569";
        ctx.fillRect(25, -18, 30, 8);
        ctx.fillStyle = "#38bdf8";
        ctx.fillRect(23, -17, 3, 6);

        ctx.fillStyle = "#0f172a";
        ctx.fillRect(20, 10, 8, 20);
        ctx.fillRect(55, 10, 8, 20);

        ctx.restore();
    }

    drawDetailedRifle(ctx, x, y, angle) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        ctx.fillStyle = "#1e293b";
        ctx.fillRect(0, -7, 55, 14);

        ctx.fillStyle = "#334155";
        ctx.fillRect(55, -4, 45, 8);
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(98, -6, 8, 12);

        ctx.fillStyle = "#0f172a";
        ctx.beginPath();
        ctx.moveTo(22, 7);
        ctx.lineTo(28, 28);
        ctx.lineTo(38, 26);
        ctx.lineTo(32, 7);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "#475569";
        ctx.fillRect(15, -16, 28, 8);
        ctx.fillStyle = "#ef4444";
        ctx.fillRect(41, -15, 3, 6);

        ctx.fillStyle = "#0f172a";
        ctx.fillRect(-22, -6, 22, 12);

        ctx.restore();
    }
    drawGrenade(ctx, x, y) {
        ctx.save();
        ctx.translate(x, y);
        ctx.fillStyle = "#166534";
        ctx.beginPath();
        ctx.ellipse(0, 0, 7, 10, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#94a3b8";
        ctx.fillRect(-2, -13, 4, 4);
        ctx.fillRect(0, -11, 7, 3);
        ctx.restore();
    }

    drawSeatedFigure(ctx, x, y, color, label) {
        ctx.save();
        ctx.translate(x, y);

        ctx.fillStyle = color;
        ctx.fillRect(-12, -45, 24, 45);

        ctx.beginPath();
        ctx.arc(0, -56, 11, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#64748b";
        ctx.font = "8px monospace";
        ctx.textAlign = "center";
        ctx.fillText(label, 0, -72);

        ctx.restore();
    }

    drawSpeedlines(ctx, w, h, count) {
        ctx.save();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.18)";
        ctx.lineWidth = 1;
        for (let i = 0; i < count; i++) {
            const y = 80 + Math.random() * (h - 220);
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y + (Math.random() - 0.5) * 40);
            ctx.stroke();
        }
        ctx.restore();
    }

    drawDialogue(ctx, w, h) {
        const cur = this.chapters[this.currentChapter];
        if (!cur) return;

        ctx.font = "bold 13px 'Courier New', monospace";
        ctx.fillStyle = "#22c55e";
        ctx.textAlign = "left";
        ctx.fillText(cur.title, 55, h - 95);

        ctx.font = "14px 'Courier New', monospace";
        ctx.fillStyle = "#e5e7eb";

        const lines = cur.text.split("\n");
        lines.forEach((line, idx) => {
            ctx.fillText(line, 55, h - 72 + idx * 20);
        });
    }
}