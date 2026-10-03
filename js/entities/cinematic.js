export class CinematicEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.currentChapter = 0;
    this.chapterTimer = 0;
    this.isFinished = false;
    this.shakeAmount = 0;
    this.chapters = [
      {
        title: "ACT I : PATIENT ZERO",
        text: "The contagion spread across borders in silence.\nWithin days, civilization collapsed into ash and rot.",
        duration: 5.5
      },
      {
        title: "ACT II : THE BETRAYAL OF FLESH",
        text: "Inside the shelter, their eyes turned hollow and crimson.\nHis mother. His father. His love.\nThe virus devoured them from within.",
        duration: 6.0
      },
      {
        title: "ACT III : THE SACRIFICE",
        text: "They lunged with bared teeth.\nHis hands trembled... but his finger pulled the cold iron trigger.\nHe silenced them with his own hands.",
        duration: 5.8
      },
      {
        title: "ACT IV : AN OATH OF BLOOD",
        text: "Kneeling over the graves, sorrow turned to absolute rage.\nGathering arms of destruction, he forged an oath:\n'I will purify this rotten world until none remain.'",
        duration: 6.5
      }
    ];
    this.totalChapters = this.chapters.length;
  }

  reset() {
    this.currentChapter = 0;
    this.chapterTimer = 0;
    this.isFinished = false;
    this.shakeAmount = 0;
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
      this.shakeAmount = 8;

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
        this.drawScene1_Outbreak(ctx, w, h, t);
        break;
      case 1:
        this.drawScene2_Infection(ctx, w, h, t);
        break;
      case 2:
        this.drawScene3_Execution(ctx, w, h, t);
        break;
      case 3:
        this.drawScene4_Vow(ctx, w, h, t);
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

  drawScene1_Outbreak(ctx, w, h, t) {
    const ground = h - 130;

    ctx.fillStyle = "rgba(185, 28, 28, 0.4)";
    ctx.beginPath();
    ctx.arc(w * 0.75, ground - 180, 70, 0, Math.PI * 2);
    ctx.fill();

    this.drawSpeedlines(ctx, w, h, 15);

    ctx.fillStyle = "#08090d";
    ctx.beginPath();
    ctx.moveTo(0, ground);

    for (let x = 0; x < w; x += 40) {
      const bh = 100 + Math.sin(x * 0.05) * 80;
      ctx.lineTo(x, ground - bh);
      ctx.lineTo(x + 35, ground - bh);
    }

    ctx.lineTo(w, ground);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#dc2626";

    for (let i = 0; i < 25; i++) {
      const px = (i * 70 + t * 40) % w;
      const py =
        ground -
        20 -
        (i * 12 + Math.sin(t * 3 + i) * 20);

      ctx.beginPath();
      ctx.arc(px, py, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawScene2_Infection(ctx, w, h, t) {
    const cx = w * 0.5;
    const cy = h * 0.55;

    ctx.fillStyle = "#0b0c10";
    ctx.fillRect(cx - 250, cy - 180, 500, 240);

    this.drawMangaFigure(
      ctx,
      cx - 140,
      cy,
      -0.2,
      true,
      t,
      "#7f1d1d"
    );

    this.drawMangaFigure(
      ctx,
      cx + 140,
      cy,
      0.2,
      true,
      t + 1,
      "#7f1d1d"
    );

    this.drawMangaFigure(
      ctx,
      cx,
      cy - 10,
      Math.sin(t * 4) * 0.08,
      true,
      t + 2,
      "#b91c1c"
    );

    if (Math.sin(t * 20) > 0.8) {
      ctx.fillStyle = "rgba(220, 38, 38, 0.15)";
      ctx.fillRect(0, 60, w, h - 190);
    }
  }

  drawScene3_Execution(ctx, w, h, t) {
    const cx = w * 0.45;
    const cy = h * 0.55;

    this.drawRadialSpeedlines(
      ctx,
      cx + 60,
      cy - 40,
      w,
      h
    );

    ctx.save();
    ctx.translate(cx - 80, cy);

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 14;
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(15, -45);
    ctx.stroke();

    ctx.lineWidth = 8;

    ctx.beginPath();
    ctx.moveTo(15, -40);
    ctx.lineTo(80, -42);
    ctx.stroke();

    ctx.fillStyle = "#e5e7eb";
    ctx.beginPath();
    ctx.arc(10, -65, 12, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#60a5fa";
    ctx.fillRect(
      14,
      -60 + (t * 50) % 30,
      2,
      5
    );

    if (
      t < 0.6 ||
      (t > 1.8 && t < 2.2)
    ) {
      ctx.fillStyle = "#fef08a";
      ctx.beginPath();
      ctx.arc(95, -42, 28, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#dc2626";

      for (let s = 0; s < 16; s++) {
        ctx.fillRect(
          160 + Math.cos(s) * (s * 8),
          -40 + Math.sin(s) * (s * 8),
          6,
          6
        );
      }
    }

    ctx.restore();
  }

  drawScene4_Vow(ctx, w, h, t) {
    const ground = h - 130;
    const cx = w * 0.5;

    ctx.strokeStyle = "#9ca3af";
    ctx.lineWidth = 4;

    [-120, -50, 20].forEach((ox) => {
      ctx.beginPath();
      ctx.moveTo(cx + ox, ground);
      ctx.lineTo(cx + ox, ground - 60);
      ctx.moveTo(cx + ox - 14, ground - 45);
      ctx.lineTo(cx + ox + 14, ground - 45);
      ctx.stroke();
    });

    ctx.save();
    ctx.translate(cx + 110, ground);

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

    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 6;

    ctx.beginPath();
    ctx.moveTo(35, 0);
    ctx.lineTo(55, -85);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(50, 0);
    ctx.lineTo(65, -70);
    ctx.stroke();

    ctx.restore();
  }

  drawMangaFigure(
    ctx,
    x,
    y,
    tilt,
    isZombie,
    t,
    eyeColor
  ) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(tilt);

    ctx.strokeStyle = "#111827";
    ctx.lineWidth = 12;
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -50);
    ctx.stroke();

    ctx.fillStyle = "#1f2937";
    ctx.beginPath();
    ctx.arc(0, -68, 15, 0, Math.PI * 2);
    ctx.fill();

    if (isZombie) {
      ctx.fillStyle = eyeColor;
      ctx.fillRect(-6, -72, 4, 4);
      ctx.fillRect(2, -72, 4, 4);
    }

    ctx.lineWidth = 6;

    ctx.beginPath();
    ctx.moveTo(0, -42);
    ctx.lineTo(
      -24 + Math.sin(t * 6) * 4,
      -30
    );
    ctx.moveTo(0, -42);
    ctx.lineTo(
      24 + Math.cos(t * 6) * 4,
      -30
    );
    ctx.stroke();

    ctx.restore();
  }

  drawRadialSpeedlines(ctx, cx, cy, w, h) {
    ctx.save();

    ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
    ctx.lineWidth = 1.5;

    for (let a = 0; a < Math.PI * 2; a += 0.12) {
      const r1 = 120 + Math.random() * 40;
      const r2 = Math.max(w, h);

      ctx.beginPath();
      ctx.moveTo(
        cx + Math.cos(a) * r1,
        cy + Math.sin(a) * r1
      );
      ctx.lineTo(
        cx + Math.cos(a) * r2,
        cy + Math.sin(a) * r2
      );
      ctx.stroke();
    }

    ctx.restore();
  }

  drawSpeedlines(ctx, w, h, count) {
    ctx.save();

    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = 1;

    for (let i = 0; i < count; i++) {
      const y = 80 + Math.random() * (h - 220);

      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(
        w,
        y + (Math.random() - 0.5) * 40
      );
      ctx.stroke();
    }

    ctx.restore();
  }

  drawDialogue(ctx, w, h) {
    const cur = this.chapters[this.currentChapter];

    if (!cur) return;

    ctx.font = "bold 13px 'Courier New', monospace";
    ctx.fillStyle = "#ef4444";
    ctx.textAlign = "left";
    ctx.fillText(cur.title, 55, h - 95);

    ctx.font = "14px 'Courier New', monospace";
    ctx.fillStyle = "#e5e7eb";

    const lines = cur.text.split("\n");

    lines.forEach((line, idx) => {
      ctx.fillText(
        line,
        55,
        h - 72 + idx * 20
      );
    });
  }
}