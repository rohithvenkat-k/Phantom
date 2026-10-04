import { Background } from "./entities/background.js";
import { Player } from "./entities/player.js";
import { Zombie } from "./entities/zombie.js";
import { ParticleSystem } from "./entities/particles.js";
import { CinematicEngine } from "./entities/cinematic.js";
import { TypingEngine } from "./typing.js";
import { sounds } from "./audio.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const hud = document.getElementById("hud");
const waveDisplay = document.getElementById("wave-display");
const heartsDisplay = document.getElementById("hearts-display");
const killDisplay = document.getElementById("kill-display");
const weaponDisplay = document.getElementById("weapon-display");
const cheatBanner = document.getElementById("cheat-banner");
const cheatConsoleModal = document.getElementById("cheat-console-modal");
const cheatInput = document.getElementById("cheat-input");
const cinematicHud = document.getElementById("cinematic-hud");

const homeScreen = document.getElementById("home-screen");
const settingsScreen = document.getElementById("settings-screen");
const pauseScreen = document.getElementById("pause-screen");
const gameOverScreen = document.getElementById("game-over-screen");
const gameOverTitle = document.getElementById("game-over-title");
const gameOverStats = document.getElementById("game-over-stats");
const outroScreen = document.getElementById("outro-screen");
const outroText = document.getElementById("outro-text");

const btnPlay = document.getElementById("btn-play");
const btnSettings = document.getElementById("btn-settings");
const btnBackSettings = document.getElementById("btn-back-settings");
const toggleAudio = document.getElementById("toggle-audio");
const toggleBlood = document.getElementById("toggle-blood");
const btnSkipIntro = document.getElementById("btn-skip-intro");
const pauseBtn = document.getElementById("pause-btn");
const btnResume = document.getElementById("btn-resume");
const btnRestart = document.getElementById("btn-restart");
const btnQuit = document.getElementById("btn-quit");
const btnRetry = document.getElementById("btn-retry");
const btnGameOverMenu = document.getElementById("btn-gameover-menu");
const btnOutroHome = document.getElementById("btn-outro-home");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", () => {
  resize();
  if (bg && typeof bg.initialize === "function") bg.initialize();
  if (player) player.y = canvas.height - 45;
});

let bloodEnabled = true;
let bazookaActive = false;
let usedCheats = {
  GRENADE: false,
  BAZOOKA: false
};

const WAVE_CONFIG = [
  { wave: 1, totalZombies: 8,  spawnInterval: 2.2, speedMult: 1.1 },
  { wave: 2, totalZombies: 14, spawnInterval: 1.8, speedMult: 1.35 },
  { wave: 3, totalZombies: 20, spawnInterval: 1.5, speedMult: 1.6 },
  { wave: 4, totalZombies: 28, spawnInterval: 1.2, speedMult: 1.85 },
  { wave: 5, totalZombies: 36, spawnInterval: 1.0, speedMult: 2.1 },
  { wave: 6, totalZombies: 45, spawnInterval: 0.85, speedMult: 2.4 },
  { wave: 7, totalZombies: 60, spawnInterval: 0.7, speedMult: 2.8 }
];

const defaultWords = {
  tier1: ["run", "aim", "gun", "fog", "rot", "dead", "bite", "fire", "cold", "ash"],
  tier2: ["grave", "flesh", "wound", "stalk", "blood", "crawl", "pulse", "decay", "horde"],
  tier3: ["horror", "shadow", "plague", "lethal", "infect", "silence", "danger", "hunter"],
  tier4: ["breach", "phantom", "specter", "survival", "consume", "violence", "striker"],
  tier5: ["screaming", "outbreak", "pestilence", "merciless", "vengeance", "darkness"],
  tier6: ["annihilation", "quarantine", "devastation", "execution", "cataclysm"],
  tier7: ["apocalyptic", "obliteration", "retribution", "extermination", "insurmountable"]
};

let wordsData = defaultWords;
fetch("./words.json")
  .then((res) => {
    if (!res.ok) throw new Error("Fallback to default words");
    return res.json();
  })
  .then((data) => {
    if (data && typeof data === "object") wordsData = data;
  })
  .catch(() => {
    wordsData = defaultWords;
  });

let bg, player, particles, cinematic, typing;
let gameState = "MENU";
let currentWave = 1;
let zombiesSpawnedInWave = 0;
let zombies = [];
let waveTimer = 0;
let kills = 0;
let hearts = 3;
let typewriterInterval = null;

function initEntities() {
  bg = new Background(canvas);
  player = new Player(canvas);
  player.y = canvas.height - 45;
  particles = new ParticleSystem();
  cinematic = new CinematicEngine(canvas);
}
initEntities();

function updateHeartsDisplay() {
  if (heartsDisplay) {
    heartsDisplay.textContent = "❤".repeat(Math.max(0, hearts));
  }
}

function updateKillDisplay() {
  if (killDisplay) {
    killDisplay.textContent = `KILLS: ${kills}`;
  }
}

function updateWaveDisplay() {
  if (waveDisplay) {
    waveDisplay.textContent = `WAVE ${currentWave} / 7`;
  }
}

function showCheatAlert(msg, color = "#facc15") {
  if (!cheatBanner) return;
  cheatBanner.textContent = msg;
  cheatBanner.style.color = color;
  cheatBanner.classList.remove("hidden");
  setTimeout(() => {
    if (cheatBanner) cheatBanner.classList.add("hidden");
  }, 2200);
}

function runTypewriter(element, text, speed = 25, callback = null) {
  if (typewriterInterval) clearInterval(typewriterInterval);
  if (!element) return;
  element.textContent = "";
  let i = 0;
  typewriterInterval = setInterval(() => {
    element.textContent += text.charAt(i);
    i++;
    if (i >= text.length) {
      clearInterval(typewriterInterval);
      typewriterInterval = null;
      if (typeof callback === "function") callback();
    }
  }, speed);
}

function getWaveTier(wave) {
  const tierKey = `tier${Math.min(Math.max(wave, 1), 7)}`;
  return (wordsData && wordsData[tierKey]) || defaultWords[tierKey];
}

function spawnZombie() {
  const cfg = WAVE_CONFIG[currentWave - 1] || WAVE_CONFIG[0];
  const pool = getWaveTier(currentWave);
  const word = pool[Math.floor(Math.random() * pool.length)];
  const z = new Zombie(canvas, word, cfg.speedMult);
  z.y = canvas.height - 45;
  zombies.push(z);
  zombiesSpawnedInWave++;
}

function triggerGameOver(reason) {
  gameState = "GAMEOVER";
  if (typing) typing.enabled = false;
  if (hud) hud.classList.add("hidden");
  if (cinematicHud) cinematicHud.classList.add("hidden");
  if (gameOverTitle) gameOverTitle.textContent = reason;
  if (gameOverStats) {
    gameOverStats.textContent = `WAVE REACHED: ${currentWave} / 7 | TOTAL ELIMINATIONS: ${kills}`;
  }
  if (gameOverScreen) gameOverScreen.classList.remove("hidden");
}

function triggerOutro() {
  gameState = "OUTRO";
  if (typing) typing.enabled = false;
  if (hud) hud.classList.add("hidden");
  if (cinematicHud) cinematicHud.classList.add("hidden");
  if (outroScreen) outroScreen.classList.remove("hidden");
  if (btnOutroHome) btnOutroHome.classList.add("hidden");

  const cinematicEnding = 
    "The 7th wave falls into ash.\n\n" +
    "The world did not heal. The virus did not vanish.\n" +
    "Humanity survived, yet their prayers went unanswered in the smoke.\n\n" +
    "Standing over the mountain of steel and bone, he discarded his name.\n\n" +
    "This is the path he chose: to become a phantom who saves the world through violence.";

  runTypewriter(outroText, cinematicEnding, 35, () => {
    if (btnOutroHome) btnOutroHome.classList.remove("hidden");
  });
}

function checkWaveCompletion() {
  const cfg = WAVE_CONFIG[currentWave - 1] || WAVE_CONFIG[WAVE_CONFIG.length - 1];
  if (zombiesSpawnedInWave >= cfg.totalZombies && zombies.length === 0) {
    if (currentWave < 7) {
      currentWave++;
      zombiesSpawnedInWave = 0;
      waveTimer = 0;
      updateWaveDisplay();
      hearts = Math.min(3, hearts + 1);
      updateHeartsDisplay();
    } else {
      triggerOutro();
    }
  }
}

function onHit(target) {
  sounds.playShot();
  if (player && typeof player.triggerRecoil === "function") {
    player.triggerRecoil();
  }

  const muzzleX = player.x + Math.cos(player.aimAngle) * 65;
  const muzzleY = player.y - 60 + Math.sin(player.aimAngle) * 65;

  particles.addMuzzleFlash(muzzleX, muzzleY, player.aimAngle);
  particles.addBulletTracer(muzzleX, muzzleY, target.x - 16, target.y - 60);
}

function onKill(target) {
  sounds.playKill();
  if (bloodEnabled) {
    particles.addBloodExplosion(target.x - 16, target.y - 60);
  }
  kills++;
  updateKillDisplay();

  if (bazookaActive) {
    const extra = zombies.find((z) => !z.isDead && z !== target);
    if (extra) {
      extra.isDead = true;
      kills++;
      updateKillDisplay();
      if (bloodEnabled) particles.addBloodExplosion(extra.x - 16, extra.y - 60);
      setTimeout(() => {
        zombies = zombies.filter((z) => z !== extra);
        checkWaveCompletion();
      }, 40);
    }
  }

  setTimeout(() => {
    zombies = zombies.filter((z) => z !== target);
    checkWaveCompletion();
  }, 40);
}

function onMiss() {
  if (gameState !== "PLAYING") return;
  sounds.playError();
  hearts--;
  updateHeartsDisplay();

  if (hearts <= 0) {
    triggerGameOver("CARTRIDGE DEPLETED // INCORRECT FIRES");
  }
}

function handleCheat(type) {
  if (gameState !== "PLAYING") return;

  if (type === "GRENADE") {
    if (usedCheats.GRENADE) {
      showCheatAlert("GRENADE DEPLETED (ALREADY USED)", "#ef4444");
      return;
    }
    usedCheats.GRENADE = true;
    showCheatAlert("GRENADE DETONATED // 5 CASUALTIES");
    sounds.playKill();
    const targets = zombies.filter((z) => !z.isDead).slice(0, 5);
    targets.forEach((z) => {
      z.isDead = true;
      kills++;
      if (bloodEnabled) particles.addBloodExplosion(z.x - 16, z.y - 60);
    });
    updateKillDisplay();
    setTimeout(() => {
      zombies = zombies.filter((z) => !targets.includes(z));
      checkWaveCompletion();
    }, 40);
  } else if (type === "NUKE") {
    showCheatAlert("SECTOR PURGED // WAVE CLEARED");
    sounds.playKill();
    zombies.forEach((z) => {
      z.isDead = true;
      kills++;
      if (bloodEnabled) particles.addBloodExplosion(z.x - 16, z.y - 60);
    });
    zombiesSpawnedInWave = (WAVE_CONFIG[currentWave - 1] || {}).totalZombies || 8;
    updateKillDisplay();
    setTimeout(() => {
      zombies = [];
      checkWaveCompletion();
    }, 40);
  } else if (type === "BAZOOKA") {
    if (usedCheats.BAZOOKA) {
      showCheatAlert("BAZOOKA ALREADY ISSUED", "#ef4444");
      return;
    }
    usedCheats.BAZOOKA = true;
    bazookaActive = true;
    if (player) player.weaponType = "BAZOOKA";
    if (weaponDisplay) {
      weaponDisplay.textContent = "WEAPON: BAZOOKA (2X SPLASH)";
      weaponDisplay.style.color = "#f97316";
    }
    showCheatAlert("HEAVY WEAPON UNLOCKED: BAZOOKA");
  }
}

function resetGame() {
  currentWave = 1;
  zombiesSpawnedInWave = 0;
  zombies = [];
  waveTimer = 0;
  kills = 0;
  hearts = 3;
  bazookaActive = false;
  usedCheats.GRENADE = false;
  usedCheats.BAZOOKA = false;
  if (player) player.weaponType = "RIFLE";
  if (weaponDisplay) {
    weaponDisplay.textContent = "WEAPON: RIFLE";
    weaponDisplay.style.color = "#60a5fa";
  }
  updateHeartsDisplay();
  updateKillDisplay();
  updateWaveDisplay();
  if (typing && typeof typing.clearTarget === "function") {
    typing.clearTarget();
  }
  if (cheatConsoleModal) cheatConsoleModal.classList.add("hidden");
  if (cinematicHud) cinematicHud.classList.add("hidden");
  initEntities();
}

function openCheatConsole() {
  if (gameState !== "PLAYING") return;
  if (typing) typing.enabled = false;
  if (cheatConsoleModal) cheatConsoleModal.classList.remove("hidden");
  if (cheatInput) {
    cheatInput.value = "";
    requestAnimationFrame(() => {
      cheatInput.focus();
    });
  }
}

function closeCheatConsole() {
  if (cheatConsoleModal) cheatConsoleModal.classList.add("hidden");
  if (cheatInput) cheatInput.value = "";
  if (gameState === "PLAYING" && typing) {
    typing.enabled = true;
  }
}

if (cheatInput) {
  cheatInput.addEventListener("paste", (e) => {
    e.preventDefault();
    showCheatAlert("PASTE DISABLED // MANUAL KEY INPUT REQUIRED", "#ef4444");
  });
  cheatInput.addEventListener("drop", (e) => e.preventDefault());
  cheatInput.addEventListener("contextmenu", (e) => e.preventDefault());

  cheatInput.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      closeCheatConsole();
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      const code = cheatInput.value.trim().toLowerCase();

      if (code === "grenade" || code === "granade") {
        handleCheat("GRENADE");
      } else if (
        code === "phenomonoultramicroscopicsilicovalcoanoconiyasis" ||
        code === "phenomonoultramicroscopicsilicovalcanoconiyais" ||
        code === "pneumonoultramicroscopicsilicovolcanoconiosis"
      ) {
        handleCheat("NUKE");
      } else if (code === "rohitvenkatkonduru") {
        handleCheat("BAZOOKA");
      } else if (code.length > 0) {
        showCheatAlert("INVALID KEYCODE", "#ef4444");
      }

      closeCheatConsole();
    }
  });
}

function startCinematic() {
  gameState = "CINEMATIC";
  if (homeScreen) homeScreen.classList.add("hidden");
  if (hud) hud.classList.add("hidden");
  if (cinematicHud) cinematicHud.classList.remove("hidden");
  if (cinematic && typeof cinematic.reset === "function") {
    cinematic.reset();
  }
}

function startGameplay() {
  if (cinematicHud) cinematicHud.classList.add("hidden");
  if (hud) hud.classList.remove("hidden");
  resetGame();
  gameState = "PLAYING";
  if (typing) typing.enabled = true;
  spawnZombie();
}

window.addEventListener("keydown", (e) => {
  if (gameState === "CINEMATIC" && e.code === "Space") {
    e.preventDefault();
    if (cinematic && typeof cinematic.skip === "function") cinematic.skip();
    startGameplay();
  }
});

typing = new TypingEngine(
  () => zombies,
  onHit,
  onKill,
  onMiss,
  handleCheat,
  openCheatConsole
);
typing.enabled = false;

if (btnPlay) {
  btnPlay.addEventListener("click", () => {
    sounds.init();
    startCinematic();
  });
}

if (btnSkipIntro) {
  btnSkipIntro.addEventListener("click", () => {
    if (cinematic && typeof cinematic.skip === "function") cinematic.skip();
    startGameplay();
  });
}

if (btnSettings) {
  btnSettings.addEventListener("click", () => {
    if (homeScreen) homeScreen.classList.add("hidden");
    if (settingsScreen) settingsScreen.classList.remove("hidden");
  });
}

if (btnBackSettings) {
  btnBackSettings.addEventListener("click", () => {
    if (settingsScreen) settingsScreen.classList.add("hidden");
    if (homeScreen) homeScreen.classList.remove("hidden");
  });
}

toggleAudio.addEventListener("click", () => {
  sounds.muted = !sounds.muted;
  toggleAudio.textContent = sounds.muted ? "MUTED" : "ENABLED";
});

toggleBlood.addEventListener("click", () => {
  bloodEnabled = !bloodEnabled;
  toggleBlood.textContent = bloodEnabled ? "ENABLED" : "DISABLED";
});

pauseBtn.addEventListener("click", () => {
  if (gameState !== "PLAYING") return;
  gameState = "PAUSED";
  if (typing) typing.enabled = false;
  if (pauseScreen) pauseScreen.classList.remove("hidden");
});

btnResume.addEventListener("click", () => {
  if (pauseScreen) pauseScreen.classList.add("hidden");
  gameState = "PLAYING";
  if (typing) typing.enabled = true;
});

btnRestart.addEventListener("click", () => {
  if (pauseScreen) pauseScreen.classList.add("hidden");
  if (hud) hud.classList.remove("hidden");
  resetGame();
  gameState = "PLAYING";
  if (typing) typing.enabled = true;
  spawnZombie();
});

btnQuit.addEventListener("click", () => {
  if (pauseScreen) pauseScreen.classList.add("hidden");
  if (hud) hud.classList.add("hidden");
  if (cinematicHud) cinematicHud.classList.add("hidden");
  if (homeScreen) homeScreen.classList.remove("hidden");
  gameState = "MENU";
  if (typing) typing.enabled = false;
  resetGame();
});

btnRetry.addEventListener("click", () => {
  if (gameOverScreen) gameOverScreen.classList.add("hidden");
  if (hud) hud.classList.remove("hidden");
  resetGame();
  gameState = "PLAYING";
  if (typing) typing.enabled = true;
  spawnZombie();
});

btnGameOverMenu.addEventListener("click", () => {
  gameOverScreen.classList.add("hidden");
  if (cinematicHud) cinematicHud.classList.add("hidden");
  if (homeScreen) homeScreen.classList.remove("hidden");
  gameState = "MENU";
  if (typing) typing.enabled = false;
  resetGame();
});

btnOutroHome.addEventListener("click", () => {
  if (outroScreen) outroScreen.classList.add("hidden");
  if (cinematicHud) cinematicHud.classList.add("hidden");
  if (homeScreen) homeScreen.classList.remove("hidden");
  gameState = "MENU";
  resetGame();
});

let lastTime = performance.now();

function loop(currentTime) {
  const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
  lastTime = currentTime;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (gameState === "CINEMATIC") {
    cinematic.update(dt);
    cinematic.draw(ctx);
    if (cinematic.isFinished) {
      if (cinematicHud) cinematicHud.classList.add("hidden");
      startGameplay();
    }
  } else if (gameState === "PLAYING") {
    const cfg = WAVE_CONFIG[currentWave - 1] || WAVE_CONFIG[0];

    if (zombiesSpawnedInWave < cfg.totalZombies) {
      waveTimer += dt;
      if (waveTimer >= cfg.spawnInterval) {
        spawnZombie();
        waveTimer = 0;
      }
    }

    for (const z of zombies) {
      if (!z.isDead && z.x <= player.x + 35) {
        triggerGameOver("BREACHED // PHYSICAL OVERRUN");
        break;
      }
    }

    bg.update(dt);
    player.update(dt, typing ? typing.currentTarget : null);
    zombies.forEach((z) => z.update(dt));
    particles.update(dt);

    bg.draw(ctx);
    player.draw(ctx, currentTime / 1000);
    zombies.forEach((z) => z.draw(ctx));
    particles.draw(ctx);
  } else {
    bg.update(dt);
    bg.draw(ctx);

    if (gameState === "PAUSED" || gameState === "GAMEOVER") {
      player.draw(ctx, currentTime / 1000);
      zombies.forEach((z) => z.draw(ctx));
      particles.draw(ctx);
    }
  }

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
