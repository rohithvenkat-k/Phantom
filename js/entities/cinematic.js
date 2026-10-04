export class CinematicEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.mode = "INTRO";
    this.currentChapter = 0;
    this.chapterTimer = 0;
    this.isFinished = false;
    this.shakeAmount = 0;
    this.globeAngle = 0;

    this.introChapters = [
      {
        title: "OUTBREAK ORBIT",
        speaker: "NARRATION",
        dialogue: "Deep beneath the atmosphere, a bio-hazard awakened.\nWithin days, the green plague encircled the entire globe.",
        duration: 6.5
      },
      {
        title: "THE LAST MEAL",
        speaker: "EMMA",
        dialogue: "Pass the bread, please...\nWait... what is that noise at the front door?!",
        duration: 6.5
      },
      {
        title: "STEEL & BARBED WIRE",
        speaker: "HERO",
        dialogue: "GET AWAY FROM THEM!\nForgive me... I have to silence you with my own hands!",
        duration: 6.0
      },
      {
        title: "AN ARSENAL AT THE GRAVES",
        speaker: "HERO",
        dialogue: "I swear upon your souls...\nI will burn this rot until the world is purified.",
        duration: 7.0
      }
    ];

    this.outroChapters = [
      {
        title: "OVERHEATED STEEL",
        speaker: "HERO",
        dialogue: "Sustained fire until the barrel melts...\nThey never stop coming.",
        duration: 6.0
      },
      {
        title: "BLADE OF PURGATORY",
        speaker: "HERO",
        dialogue: "Guns won't be fast enough for this swarm.\n*Unsheathes Katana* ...Die.",
        duration: 7.0
      },
      {
        title: "ROADKILL CARNAGE",
        speaker: "HERO",
        dialogue: "Engine stalled out... choked on dead flesh.\nTime to finish this from the roof!",
        duration: 7.5
      },
      {
        title: "THE SUMMIT",
        speaker: "HERO",
        dialogue: "Look upon what you created.\nI will never stop. I am your Phantom.",
        duration: 7.5
      },
      {
        title: "THE PHANTOM",
        speaker: "",
        dialogue: "",
        duration: 9999.0
      }
    ];
  }

  startIntro() {
    this.mode = "INTRO";
    this.currentChapter = 0;
    this.chapterTimer = 0;
    this.isFinished = false;
    this.shakeAmount = 0;
    this.globeAngle = 0;
  }

  startOutro() {
    this.mode = "OUTRO";
    this.currentChapter = 0;
    this.chapterTimer = 0;
    this.isFinished = false;
    this.shakeAmount = 0;
  }

  skip() {
    this.isFinished = true;
  }

  getActiveChapters() {
    return this.mode === "INTRO" ? this.introChapters : this.outroChapters;
  }

  update(dt) {
    if (this.isFinished) return;

    const chapters = this.getActiveChapters();
    if (this.currentChapter >= chapters.length) {
      this.isFinished = true;
      return;
    }

    this.chapterTimer += dt;
    this.globeAngle += dt * 0.45;

    if (this.shakeAmount > 0) {
      this.shakeAmount = Math.max(0, this.shakeAmount - dt * 25);
    }

    const cur = chapters[this.currentChapter];
    if (cur && this.chapterTimer >= cur.duration) {
      this.currentChapter++;
      this.chapterTimer = 0;
      this.shakeAmount = 10;
      if (this.currentChapter >= chapters.length) {
        this.isFinished = true;
      }
    }
  }

  draw(ctx, stats = { kills: 0, wave: 7 }) {
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

    if (this.mode === "INTRO") {
      switch (this.currentChapter) {
        case 0: this.drawScene1_3DGlobe(ctx, w, h, t); break;
        case 1: this.drawScene2_Lunch(ctx, w, h, t); break;
        case 2: this.drawScene3_BatExecution(ctx, w, h, t); break;
        case 3: this.drawScene4_GraveyardArsenal(ctx, w, h, t); break;
      }
    } else {
      switch (this.currentChapter) {
        case 0: this.drawOutro1_RedHotMuzzle(ctx, w, h, t); break;
        case 1: this.drawOutro2_KatanaDecapitation(ctx, w, h, t); break;
        case 2: this.drawOutro3_JeepGrindAndStall(ctx, w, h, t); break;
        case 3: this.drawOutro4_CorpseMountainDrag(ctx, w, h, t); break;
        case 4: this.drawOutro5_PhantomDominanceTitle(ctx, w, h, t); break;
      }
    }

    if (!(this.mode === "OUTRO" && this.currentChapter === 4)) {
      this.drawMangaSpeechBubble(ctx, w, h);
    }

    ctx.restore();
  }

  drawScene1_3DGlobe(ctx, w, h, t) {
    const cx = w * 0.5;
    const cy = h * 0.5;
    const R = Math.min(w, h) * 0.35;

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

    ctx.strokeStyle = "rgba(74, 222, 128, 0.25)";
    ctx.lineWidth = 1.5;
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
        ctx.lineTo(sx + Math.sin(v) * 25, sy + Math.cos(v) * 22);
        ctx.stroke();
      }
    }
  }

  drawScene2_Lunch(ctx, w, h, t) {
    const ground = h - 60;
    const cx = w * 0.5;

    ctx.fillStyle = "#0a0c10";
    ctx.fillRect(0, 0, w, ground);

    ctx.fillStyle = "#030406";
    ctx.fillRect(cx - 70, ground - 340, 140, 240);
    ctx.strokeStyle = "#dc2626";
    ctx.lineWidth = 3;
    ctx.strokeRect(cx - 70, ground - 340, 140, 240);

    ctx.fillStyle = "#ef4444";
    ctx.fillRect(cx - 30, ground - 260, 6, 6);
    ctx.fillRect(cx - 15, ground - 260, 6, 6);
    ctx.fillRect(cx + 15, ground - 240, 6, 6);
    ctx.fillRect(cx + 30, ground - 240, 6, 6);

    ctx.fillStyle = "#3f2818";
    ctx.fillRect(cx - 220, ground - 90, 440, 24);
    ctx.fillRect(cx - 200, ground - 66, 16, 66);
    ctx.fillRect(cx + 184, ground - 66, 16, 66);

    ctx.fillStyle = "#9ca3af";
    ctx.fillRect(cx - 140, ground - 100, 45, 10);
    ctx.fillRect(cx - 25, ground - 100, 45, 10);
    ctx.fillRect(cx + 90, ground - 100, 45, 10);

    this.drawSeatedFigure(ctx, cx - 170, ground - 90, "#1e293b", "MOM");
    this.drawSeatedFigure(ctx, cx - 60, ground - 90, "#1e293b", "DAD");
    this.drawSeatedFigure(ctx, cx + 60, ground - 90, "#334155", "EMMA");
    this.drawSeatedFigure(ctx, cx + 170, ground - 90, "#475569", "HERO");
  }

  drawScene3_BatExecution(ctx, w, h, t) {
    const ground = h - 60;
    const cx = w * 0.45;
    const cy = ground - 40;

    this.drawSpeedlines(ctx, w, h, 24);

    ctx.save();
    ctx.translate(cx - 80, cy);
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 14;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(20, -60);
    ctx.stroke();

    ctx.fillStyle = "#e5e7eb";
    ctx.beginPath();
    ctx.arc(20, -84, 15, 0, Math.PI * 2);
    ctx.fill();

    ctx.lineWidth = 9;
    ctx.beginPath();
    ctx.moveTo(15, -55);
    ctx.lineTo(70, -80);
    ctx.stroke();

    this.drawBarbedBat(ctx, 70, -80, -0.65);
    ctx.restore();

    ctx.save();
    ctx.translate(cx + 160, cy);
    ctx.strokeStyle = "#7f1d1d";
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-40, -55);
    ctx.stroke();

    ctx.fillStyle = "#dc2626";
    for (let i = 0; i < 28; i++) {
      ctx.fillRect(-60 + Math.cos(i * 1.5) * (i * 9), -60 + Math.sin(i * 1.5) * (i * 9), 6, 6);
    }
    ctx.restore();
  }

  drawScene4_GraveyardArsenal(ctx, w, h, t) {
    const ground = h - 60;
    const cx = w * 0.5;

    const names = ["MOTHER", "FATHER", "EMMA"];
    [-220, -110, 0].forEach((ox, idx) => {
      ctx.strokeStyle = "#6b7280";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(cx + ox, ground);
      ctx.lineTo(cx + ox, ground - 95);
      ctx.moveTo(cx + ox - 24, ground - 70);
      ctx.lineTo(cx + ox + 24, ground - 70);
      ctx.stroke();

      ctx.fillStyle = "#ef4444";
      ctx.font = "bold 12px monospace";
      ctx.fillText(names[idx], cx + ox - 24, ground - 105);
    });

    this.drawBarbedBat(ctx, cx - 180, ground - 10, Math.PI / 2);

    ctx.save();
    ctx.translate(cx + 110, ground);
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 12;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(-20, 0);
    ctx.lineTo(0, -30);
    ctx.lineTo(30, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -30);
    ctx.lineTo(-12, -70);
    ctx.stroke();

    ctx.fillStyle = "#e5e7eb";
    ctx.beginPath();
    ctx.arc(-16, -85, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    this.drawDetailedBazooka(ctx, cx + 180, ground - 100, -0.2);
    this.drawDetailedRifle(ctx, cx + 230, ground - 80, 0.15, 0);
    this.drawGrenade(ctx, cx + 150, ground - 15);
    this.drawGrenade(ctx, cx + 165, ground - 15);
  }

  drawOutro1_RedHotMuzzle(ctx, w, h, t) {
    const cx = w * 0.5;
    const cy = h * 0.62;

    this.drawSpeedlines(ctx, w, h, 20);

    ctx.save();
    ctx.translate(cx - 80, cy);

    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.arc(0, -110, 30, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ef4444";
    ctx.fillRect(10, -112, 16, 5);

    ctx.fillStyle = "#0f172a";
    ctx.fillRect(-28, -80, 60, 100);

    const isFiring = t < 3.8;
    const recoilKick = isFiring ? (Math.random() - 0.5) * 4 : 0;

    const rifleAngle = -0.35 + recoilKick * 0.05;
    ctx.save();
    ctx.translate(35, -45);
    ctx.rotate(rifleAngle);

    const heatLevel = Math.min(1.0, t / 3.0);
    this.drawDetailedRifle(ctx, 0, 0, 0, heatLevel);

    if (isFiring && Math.sin(t * 45) > 0.0) {
      ctx.fillStyle = "#facc15";
      ctx.fillRect(106, -9, 36, 14);
      ctx.fillStyle = "#ea580c";
      ctx.fillRect(122, -6, 20, 8);
    }
    ctx.restore();

    if (heatLevel > 0.3) {
      for (let s = 0; s < 5; s++) {
        const hx = 130 + Math.cos(t * 10 + s) * 15;
        const hy = -85 - (s * 14) - (t * 20) % 40;
        ctx.fillStyle = `rgba(239, 68, 68, ${0.4 - s * 0.07})`;
        ctx.beginPath();
        ctx.arc(hx, hy, 4 + s * 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  }

  // OUTRO 2: Dropping all weapons, pulling out Katana, Dash, and Clean Decapitation
  drawOutro2_KatanaDecapitation(ctx, w, h, t) {
    const ground = h - 60;
    const cx = w * 0.5;

    // Blood sky
    const sky = ctx.createLinearGradient(0, 0, 0, ground);
    sky.addColorStop(0, "#450a0a");
    sky.addColorStop(1, "#09090b");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, ground);

    // City outline
    ctx.fillStyle = "#020305";
    for (let x = 0; x < w; x += 36) {
      const bh = 110 + Math.sin(x * 0.05) * 60;
      ctx.fillRect(x, ground - bh, 34, bh);
    }

    // Dropped Firearms on the floor behind
    this.drawDetailedRifle(ctx, 80, ground - 6, Math.PI / 2, 0.4);
    this.drawDetailedBazooka(ctx, 115, ground - 8, Math.PI / 2);
    this.drawBarbedBat(ctx, 60, ground - 6, 1.4);

    const isSlashing = t > 2.8;

    // Player position (stands, then dashes through the swarm)
    let playerX = 170;
    if (t > 2.2 && t <= 2.8) {
      const dashProgress = (t - 2.2) / 0.6;
      playerX = 170 + dashProgress * (w * 0.65);
      this.drawSpeedlines(ctx, w, h, 35);
    } else if (t > 2.8) {
      playerX = w * 0.85; // Sheathing position on the other side
    }

    // DRAW PLAYER
    ctx.save();
    ctx.translate(playerX, ground);

    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 13;
    ctx.lineCap = "round";

    if (t < 2.2) {
      // Stance: Unsheathing Katana
      ctx.beginPath();
      ctx.moveTo(-8, -35);
      ctx.lineTo(-12, 0);
      ctx.moveTo(8, -35);
      ctx.lineTo(12, 0);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, -35);
      ctx.lineTo(0, -80);
      ctx.stroke();

      ctx.fillStyle = "#e5e7eb";
      ctx.beginPath();
      ctx.arc(0, -96, 14, 0, Math.PI * 2);
      ctx.fill();

      // Gleaming Katana Blade drawn forward
      this.drawKatana(ctx, 10, -55, -0.45);
    } else if (t <= 2.8) {
      // Forward Dash Attack pose
      ctx.beginPath();
      ctx.moveTo(-10, -25);
      ctx.lineTo(-25, 0);
      ctx.moveTo(10, -25);
      ctx.lineTo(25, 0);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, -25);
      ctx.lineTo(25, -60);
      ctx.stroke();

      ctx.fillStyle = "#e5e7eb";
      ctx.beginPath();
      ctx.arc(35, -70, 14, 0, Math.PI * 2);
      ctx.fill();

      // Slanted Katana thrust
      this.drawKatana(ctx, 40, -50, 0.2);
    } else {
      // Cool post-slash Sheathing pose
      ctx.beginPath();
      ctx.moveTo(-6, -35);
      ctx.lineTo(-10, 0);
      ctx.moveTo(6, -35);
      ctx.lineTo(10, 0);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, -35);
      ctx.lineTo(-5, -80);
      ctx.stroke();

      ctx.fillStyle = "#e5e7eb";
      ctx.beginPath();
      ctx.arc(-5, -96, 14, 0, Math.PI * 2);
      ctx.fill();

      // Katana held downwards dripping blood
      this.drawKatana(ctx, 8, -45, 1.6);
    }
    ctx.restore();

    // FULL SCREEN SWORD SLASH ARC (at t = 2.8s)
    if (t >= 2.6 && t <= 3.1) {
      ctx.save();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(160, ground - 40);
      ctx.lineTo(w * 0.9, ground - 110);
      ctx.stroke();

      ctx.strokeStyle = "rgba(239, 68, 68, 0.75)";
      ctx.lineWidth = 18;
      ctx.beginPath();
      ctx.moveTo(160, ground - 40);
      ctx.lineTo(w * 0.9, ground - 110);
      ctx.stroke();
      ctx.restore();
    }

    // THE ZOMBIES (Pre-slash vs Decapitated Falling Bodies)
    const zombieCount = 10;
    const startZX = w * 0.32;
    const spacing = 48;

    for (let i = 0; i < zombieCount; i++) {
      const zx = startZX + i * spacing;

      ctx.save();
      if (!isSlashing) {
        // Normal charging zombies before the slash
        ctx.translate(zx, ground);
        ctx.strokeStyle = "#374151";
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(0, -30);
        ctx.lineTo(-8, 0);
        ctx.moveTo(0, -30);
        ctx.lineTo(8, 0);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, -30);
        ctx.lineTo(-6, -72);
        ctx.stroke();

        // Intact head
        ctx.fillStyle = "#1f2937";
        ctx.beginPath();
        ctx.arc(-6, -86, 13, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#ef4444";
        ctx.fillRect(-13, -88, 4, 4);

        // Arms reaching
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.moveTo(-6, -58);
        ctx.lineTo(-28, -55);
        ctx.stroke();
      } else {
        // POST-SLASH: Head is severed flying up; body collapsing!
        const elapsed = t - 2.8;
        const headFlyY = ground - 86 - elapsed * 80 + (elapsed * elapsed * 140);
        const headFlyX = zx + Math.sin(i * 1.5) * 45;

        // Flying severed head with blood fountain
        ctx.save();
        ctx.translate(headFlyX, Math.min(ground - 10, headFlyY));
        ctx.rotate(elapsed * 8 + i);
        ctx.fillStyle = "#1f2937";
        ctx.beginPath();
        ctx.arc(0, 0, 13, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#ef4444";
        ctx.fillRect(-4, -4, 4, 4);
        ctx.restore();

        // Blood fountain from neck stump
        ctx.fillStyle = "#dc2626";
        for (let b = 0; b < 6; b++) {
          ctx.fillRect(zx - 4 + (Math.random() - 0.5) * 8, ground - 65 - Math.random() * 25, 4, 4);
        }

        // Collapsing headless body falling to the floor
        const fallTilt = Math.min(Math.PI / 2, elapsed * 4.5);
        ctx.translate(zx, ground);
        ctx.rotate((i % 2 === 0 ? 1 : -1) * fallTilt);

        ctx.strokeStyle = "#374151";
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(0, -10);
        ctx.lineTo(0, -60);
        ctx.stroke();

        // Bloody stump at top of neck
        ctx.fillStyle = "#dc2626";
        ctx.fillRect(-6, -64, 12, 6);
      }
      ctx.restore();
    }
  }

  // OUTRO 3: Jeep crushes zombies beneath tires, stalls, player climbs to shoot
  drawOutro3_JeepGrindAndStall(ctx, w, h, t) {
    const ground = h - 60;
    const isMoving = t < 4.2;
    const wheelRot = isMoving ? t * 15 : 4.2 * 15;
    const cx = isMoving ? w * 0.35 + (t / 4.2) * (w * 0.12) : w * 0.47;

    this.drawSpeedlines(ctx, w, h, isMoving ? 26 : 8);

    ctx.fillStyle = "#7f1d1d";
    ctx.fillRect(0, ground - 10, w, 10);

    ctx.save();
    ctx.translate(cx, ground - 48);

    ctx.fillStyle = "#1e293b";
    ctx.fillRect(-110, -42, 220, 54);

    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.moveTo(-55, -42);
    ctx.lineTo(-18, -84);
    ctx.lineTo(75, -84);
    ctx.lineTo(95, -42);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#475569";
    ctx.fillRect(105, -22, 32, 34);
    ctx.strokeStyle = "#dc2626";
    ctx.lineWidth = 5;
    for (let sp = -18; sp <= 10; sp += 9) {
      ctx.beginPath();
      ctx.moveTo(137, sp);
      ctx.lineTo(158, sp + 4);
      ctx.stroke();
    }

    this.drawSpinningWheel(ctx, -68, 14, wheelRot);
    this.drawSpinningWheel(ctx, 68, 14, wheelRot);

    // Zombies crushed and dragged beneath the chassis/bumper
    ctx.save();
    ctx.translate(130, 2);
    ctx.fillStyle = "#1f2937";
    ctx.fillRect(-15, -4, 45, 14);
    ctx.fillRect(25, -25, 14, 25);
    ctx.fillStyle = "#dc2626";
    ctx.fillRect(-20, 2, 60, 6);
    ctx.restore();

    ctx.save();
    ctx.translate(-72, 10);
    ctx.fillStyle = "#111827";
    ctx.fillRect(-15, -2, 35, 12);
    ctx.fillStyle = "#7f1d1d";
    ctx.fillRect(-25, 4, 50, 6);
    ctx.restore();

    // Engine smoke when it stalls
    if (!isMoving) {
      ctx.fillStyle = "rgba(100, 116, 139, 0.6)";
      ctx.beginPath();
      ctx.arc(115, -35, 14 + Math.sin(t * 10) * 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Player standing on the roof firing
    if (!isMoving) {
      ctx.save();
      ctx.translate(28, -84);
      ctx.strokeStyle = "#f3f4f6";
      ctx.lineWidth = 12;
      ctx.lineCap = "round";

      ctx.beginPath();
      ctx.moveTo(-10, 0);
      ctx.lineTo(-14, -30);
      ctx.moveTo(10, 0);
      ctx.lineTo(14, -30);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, -30);
      ctx.lineTo(5, -68);
      ctx.stroke();

      ctx.fillStyle = "#f3f4f6";
      ctx.beginPath();
      ctx.arc(5, -82, 13, 0, Math.PI * 2);
      ctx.fill();

      ctx.save();
      ctx.translate(14, -55);
      this.drawDetailedRifle(ctx, 0, 0, 0.1, 1.0);
      if (Math.sin(t * 35) > 0.0) {
        ctx.fillStyle = "#facc15";
        ctx.fillRect(106, -7, 36, 12);
      }
      ctx.restore();
      ctx.restore();
    }

    ctx.restore();

    // Approaching zombies being gunned down
    for (let c = 0; c < 4; c++) {
      const zx = cx + 180 + c * 38;
      const zy = ground;
      ctx.save();
      ctx.translate(zx, zy);
      ctx.strokeStyle = "#374151";
      ctx.lineWidth = 9;
      ctx.beginPath();
      ctx.moveTo(0, -28);
      ctx.lineTo(-6, -65);
      ctx.stroke();
      ctx.fillStyle = "#1f2937";
      ctx.beginPath();
      ctx.arc(-6, -78, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ef4444";
      ctx.fillRect(-12, -80, 4, 4);

      if (!isMoving && Math.sin(t * 35) > 0.3) {
        ctx.fillStyle = "#dc2626";
        ctx.fillRect(-10, -50, 15, 15);
      }
      ctx.restore();
    }
  }

  // OUTRO 4: Dragging corpses to the summit
  drawOutro4_CorpseMountainDrag(ctx, w, h, t) {
    const ground = h - 60;
    const cx = w * 0.5;

    const sunset = ctx.createLinearGradient(0, 0, 0, ground);
    sunset.addColorStop(0, "#450a0a");
    sunset.addColorStop(0.4, "#991b1b");
    sunset.addColorStop(0.75, "#ea580c");
    sunset.addColorStop(1, "#18181b");
    ctx.fillStyle = sunset;
    ctx.fillRect(0, 0, w, ground);

    ctx.fillStyle = "#fef08a";
    ctx.beginPath();
    ctx.arc(cx, ground - 140, 95, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#09090b";
    ctx.beginPath();
    ctx.moveTo(0, ground);
    ctx.lineTo(cx - 200, ground - 110);
    ctx.lineTo(cx, ground - 240);
    ctx.lineTo(cx + 200, ground - 110);
    ctx.lineTo(w, ground);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "#450a0a";
    ctx.lineWidth = 6;
    for (let m = -280; m <= 280; m += 40) {
      const py = ground - 240 + Math.abs(m) * 0.65;
      ctx.beginPath();
      ctx.moveTo(cx + m, py);
      ctx.lineTo(cx + m + 22, py + 16);
      ctx.stroke();

      ctx.fillStyle = "#dc2626";
      ctx.fillRect(cx + m + 7, py + 5, 10, 5);
    }

    if (t < 3.2) {
      const dragProgress = t / 3.2;
      const dragX = (cx - 180) + dragProgress * 150;
      const dragY = (ground - 100) - dragProgress * 110;

      ctx.save();
      ctx.translate(dragX, dragY);
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 12;
      ctx.lineCap = "round";

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(16, -50);
      ctx.stroke();

      ctx.fillStyle = "#000000";
      ctx.beginPath();
      ctx.arc(20, -64, 12, 0, Math.PI * 2);
      ctx.fill();

      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.moveTo(10, -40);
      ctx.lineTo(-28, -20);
      ctx.stroke();

      ctx.fillStyle = "#1e293b";
      ctx.fillRect(-52, -16, 32, 14);
      ctx.fillStyle = "#dc2626";
      ctx.fillRect(-26, -16, 8, 14);
      ctx.restore();
    } else {
      const sumX = cx;
      const sumY = ground - 240;

      ctx.save();
      ctx.translate(sumX, sumY);
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 14;
      ctx.lineCap = "round";

      ctx.beginPath();
      ctx.moveTo(-12, 0);
      ctx.lineTo(-9, -40);
      ctx.moveTo(12, 0);
      ctx.lineTo(9, -40);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, -40);
      ctx.lineTo(0, -90);
      ctx.stroke();

      ctx.fillStyle = "#000000";
      ctx.beginPath();
      ctx.arc(0, -106, 15, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#ef4444";
      ctx.fillRect(-5, -108, 4, 4);
      ctx.fillRect(3, -108, 4, 4);

      ctx.fillStyle = "#09090b";
      ctx.beginPath();
      ctx.moveTo(0, -80);
      ctx.lineTo(-50 + Math.sin(t * 8) * 14, -45);
      ctx.lineTo(-85 + Math.sin(t * 7) * 20, -10);
      ctx.lineTo(-12, -45);
      ctx.closePath();
      ctx.fill();

      this.drawBarbedBat(ctx, 26, -10, 0.35);

      ctx.save();
      ctx.translate(14, -80);
      ctx.rotate(-0.85);
      this.drawDetailedRifle(ctx, 0, 0, 0, 1.0);
      ctx.restore();

      ctx.restore();
    }
  }

  // OUTRO 5: Player in Shadow, Blood-Covered PHANTOM Logo with Zombie 'M'
  drawOutro5_PhantomDominanceTitle(ctx, w, h, t) {
    const cx = w * 0.5;
    const cy = h * 0.46;

    ctx.fillStyle = "#020305";
    ctx.fillRect(0, 0, w, h);

    const aura = ctx.createRadialGradient(cx, cy - 20, 40, cx, cy - 20, Math.max(w, h) * 0.6);
    aura.addColorStop(0, "rgba(185, 28, 28, 0.45)");
    aura.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = aura;
    ctx.fillRect(0, 0, w, h);

    // Player Silhouette in Shadow
    ctx.save();
    ctx.translate(cx, cy + 120);
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 18;
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(-16, 0);
    ctx.lineTo(-11, -55);
    ctx.moveTo(16, 0);
    ctx.lineTo(11, -55);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, -55);
    ctx.lineTo(0, -120);
    ctx.stroke();

    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.arc(0, -138, 19, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ef4444";
    ctx.fillRect(-7, -142, 5, 4);
    ctx.fillRect(3, -142, 5, 4);

    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.moveTo(0, -110);
    ctx.lineTo(-75 + Math.sin(t * 6) * 12, -55);
    ctx.lineTo(-110 + Math.sin(t * 5) * 16, 12);
    ctx.lineTo(-12, -55);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    this.drawZombiePhantomTitle(ctx, cx, cy - 60);

    ctx.font = "bold 1.2rem 'Courier New', monospace";
    ctx.fillStyle = "#d1d5db";
    ctx.textAlign = "center";
    ctx.fillText("HE WILL NOT STOP.", cx, cy + 30);

    // Attribution
    ctx.font = "bold 1.15rem 'Courier New', monospace";
    ctx.fillStyle = "#e5e7eb";
    ctx.textAlign = "right";
    ctx.fillText("made by rohitvenkatkoduru", w - 40, h - 36);
  }

  drawZombiePhantomTitle(ctx, cx, y) {
    const letters = ["P", "H", "A", "N", "T", "O", "M"];
    const spacing = 58;
    const startX = cx - ((letters.length - 1) * spacing) / 2;

    ctx.font = "900 4.4rem 'Courier New', monospace";
    ctx.textAlign = "center";

    letters.forEach((char, idx) => {
      const lx = startX + idx * spacing;

      if (char === "M") {
        ctx.save();
        ctx.translate(lx, y);

        ctx.fillStyle = "#991b1b";
        ctx.fillText("M", 0, 0);

        // Glowing red zombie eyes inside the arches of M
        ctx.fillStyle = "#fef08a";
        ctx.beginPath();
        ctx.arc(-13, -32, 5, 0, Math.PI * 2);
        ctx.arc(13, -32, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#dc2626";
        ctx.fillRect(-14, -33, 4, 4);
        ctx.fillRect(12, -33, 4, 4);

        // Snarling zombie fangs across center of M
        ctx.fillStyle = "#f3f4f6";
        ctx.beginPath();
        ctx.moveTo(-14, -10);
        ctx.lineTo(-9, 3);
        ctx.lineTo(-5, -10);
        ctx.lineTo(0, 4);
        ctx.lineTo(5, -10);
        ctx.lineTo(9, 3);
        ctx.lineTo(14, -10);
        ctx.closePath();
        ctx.fill();

        // Blood drips down legs of M
        ctx.fillStyle = "#ef4444";
        ctx.fillRect(-26, 4, 5, 22);
        ctx.fillRect(22, 4, 5, 18);
        ctx.restore();
      } else {
        ctx.fillStyle = "#b91c1c";
        ctx.fillText(char, lx, y);

        ctx.fillStyle = "#ef4444";
        if (idx % 2 === 0) {
          ctx.fillRect(lx - 2, y + 4, 4, 18);
          ctx.beginPath();
          ctx.arc(lx, y + 23, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    });
  }

  drawKatana(ctx, x, y, angle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    // Tsuka (Handle)
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(-25, -3, 25, 6);

    // Tsuba (Handguard)
    ctx.fillStyle = "#d97706";
    ctx.fillRect(0, -8, 4, 16);

    // Blade (Habaki + Steel Blade)
    ctx.fillStyle = "#e2e8f0";
    ctx.beginPath();
    ctx.moveTo(4, -3);
    ctx.lineTo(75, -2);
    ctx.lineTo(82, 0); // Tip
    ctx.lineTo(75, 3);
    ctx.lineTo(4, 3);
    ctx.closePath();
    ctx.fill();

    // Sharp edge shine
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.restore();
  }

  drawMangaSpeechBubble(ctx, w, h) {
    const chapters = this.getActiveChapters();
    const cur = chapters[this.currentChapter];
    if (!cur || !cur.dialogue) return;

    const bx = 65;
    const by = 80;
    const bw = Math.min(w - 130, 460);
    const bh = 110;

    ctx.save();
    ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.roundRect(bx, by, bw, bh, 14);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(bx + 40, by + bh);
    ctx.lineTo(bx + 25, by + bh + 18);
    ctx.lineTo(bx + 60, by + bh);
    ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
    ctx.fill();
    ctx.stroke();

    ctx.font = "900 13px 'Courier New', monospace";
    ctx.fillStyle = "#dc2626";
    ctx.textAlign = "left";
    ctx.fillText(`${cur.speaker} // ${cur.title}`, bx + 18, by + 28);

    ctx.font = "bold 14px 'Courier New', monospace";
    ctx.fillStyle = "#111827";
    const lines = cur.dialogue.split("\n");
    lines.forEach((line, idx) => {
      ctx.fillText(line, bx + 18, by + 56 + idx * 22);
    });

    ctx.restore();
  }

  drawSpinningWheel(ctx, x, y, rot) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = "#020617";
    ctx.beginPath();
    ctx.arc(0, 0, 24, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(0, 0, 15, 0, Math.PI * 2);
    ctx.stroke();

    ctx.rotate(rot);
    ctx.beginPath();
    ctx.moveTo(-15, 0);
    ctx.lineTo(15, 0);
    ctx.moveTo(0, -15);
    ctx.lineTo(0, 15);
    ctx.stroke();
    ctx.restore();
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

  drawDetailedRifle(ctx, x, y, angle, heat = 0.0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, -7, 55, 14);

    ctx.fillStyle = heat > 0.4 ? "#f97316" : "#334155";
    ctx.fillRect(55, -4, 45, 8);

    ctx.fillStyle = heat > 0.2 ? "#ef4444" : "#0f172a";
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
    ctx.font = "9px monospace";
    ctx.textAlign = "center";
    ctx.fillText(label, 0, -74);
    ctx.restore();
  }

  drawSpeedlines(ctx, w, h, count) {
    ctx.save();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.18)";
    ctx.lineWidth = 1.5;
    for (let i = 0; i < count; i++) {
      const y = Math.random() * h;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y + (Math.random() - 0.5) * 40);
      ctx.stroke();
    }
    ctx.restore();
  }
}