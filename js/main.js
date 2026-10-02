// js/main.js
import { Background } from "./entities/background.js";
import { Player } from "./entities/player.js";
import { Zombie } from "./entities/zombie.js";
import { ParticleSystem } from "./entities/particles.js";
import { TypingEngine } from "./typing.js";
import { sounds } from "./audio.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// UI Elements
const hud = document.getElementById("hud");
const waveDisplay = document.getElementById("wave-display");
const heartsDisplay = document.getElementById("hearts-display");
const killDisplay = document.getElementById("kill-display");

const homeScreen = document.getElementById("home-screen");
const settingsScreen = document.getElementById("settings-screen");
const storyScreen = document.getElementById("story-screen");
const storyText = document.getElementById("story-text");
const pauseScreen = document.getElementById("pause-screen");
const gameOverScreen = document.getElementById("game-over-screen");
const gameOverTitle = document.getElementById("game-over-title");
const gameOverStats = document.getElementById("game-over-stats");
const outroScreen = document.getElementById("outro-screen");
const outroText = document.getElementById("outro-text");

// Buttons
const btnPlay = document.getElementById("btn-play");
const btnSettings = document.getElementById("btn-settings");
const btnBackSettings = document.getElementById("btn-back-settings");
const toggleAudio = document.getElementById("toggle-audio");
const toggleBlood = document.getElementById("toggle-blood");
const btnStartWave = document.getElementById("btn-start-wave");
const pauseBtn = document.getElementById("pause-btn");
const btnResume = document.getElementById("btn-resume");
const btnRestart = document.getElementById("btn-restart");
const btnQuit = document.getElementById("btn-quit");
const btnRetry = document.getElementById("btn-retry");
const btnOutroHome = document.getElementById("btn-outro-home");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", () => {
  resize();
  if (bg) bg.initialize();
  if (player) player.y = canvas.height - 110;
});

// Settings State
let bloodEnabled = true;

// Wave Progression Rules: Zombie count scales wave-by-wave
const WAVE_CONFIG = [
  { wave: 1, totalZombies: 6,  spawnInterval: 3.2, speedMult: 1.0 },
  { wave: 2, totalZombies: 9,  spawnInterval: 2.8, speedMult: 1.2 },
  { wave: 3, totalZombies: 12, spawnInterval: 2.5, speedMult: 1.4 },
  { wave: 4, totalZombies: 16, spawnInterval: 2.1, speedMult: 1.65 },
  { wave: 5, totalZombies: 20, spawnInterval: 1.8, speedMult: 1.9 },
  { wave: 6, totalZombies: 25, spawnInterval: 1.5, speedMult: 2.2 },
  { wave: 7, totalZombies: 30, spawnInterval: 1.2, speedMult: 2.6 }
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
  .then((res) => res.json())
  .then((data) => { if (data) wordsData = data; })
  .catch(() => {});

// Game State
let bg, player, particles, typing;
let gameState = "MENU"; // MENU, STORY, PLAYING, PAUSED, GAMEOVER, OUTRO
let currentWave = 1;
let zombiesSpawnedInWave = 0;
let zombies = [];
let waveTimer = 0;
let kills = 0;
let hearts = 3;

function initEntities() {
  bg = new Background(canvas);
  player = new Player(canvas);
  particles = new ParticleSystem();
}
initEntities();

function updateHeartsDisplay() {
  heartsDisplay.textContent = "❤".repeat(Math.max(0, hearts));
}

function updateKillDisplay() {
  killDisplay.textContent = `KILLS: ${kills}`;
}

function updateWaveDisplay() {
  waveDisplay.textContent = `WAVE ${currentWave} / 7`;
}

function getWaveTier(wave) {
  const tierKey = `tier${Math.min(wave, 7)}`;
  return wordsData[tierKey] || defaultWords[tierKey];
}

function spawnZombie() {
  const cfg = WAVE_CONFIG[currentWave - 1];
  const pool = getWaveTier(currentWave);
  const word = pool[Math.floor(Math.random() * pool.length)];
  zombies.push(new Zombie(canvas, word, cfg.speedMult));
  zombiesSpawnedInWave++;
}

function onHit(target) {
  sounds.playShot();
  player.triggerRecoil();

  const muzzleX = player.x + Math.cos(player.aimAngle) * 65;
  const muzzleY = player.y - 60 + Math.sin(player.aimAngle) * 65;

  particles.addMuzzleFlash(muzzleX, muzzleY, player.aimAngle);
  particles.addBulletTracer(muzzleX, muzzleY, target.x - 16, target.y - 65);
}

function onKill(target) {
  sounds.playKill();
  if (bloodEnabled) {
    particles.addBloodExplosion(target.x - 16, target.y - 60);
  }
  kills++;
  updateKillDisplay();

  setTimeout(() => {
    zombies = zombies.filter((z) => z !== target);
    checkWaveCompletion();
  }, 40);
}

// Rule 1: Lose a heart on miss
function onMiss() {
  if (gameState !== "PLAYING") return;
  sounds.playError();
  hearts--;
  updateHeartsDisplay();

  if (hearts <= 0) {
    triggerGameOver("CARTRIDGE DEPLETED // INCORRECT FIRES");
  }
}

function checkWaveCompletion() {
  const cfg = WAVE_CONFIG[currentWave - 1];
  if (zombiesSpawnedInWave >= cfg.totalZombies && zombies.length === 0) {
    if (currentWave < 7) {
      currentWave++;
      zombiesSpawnedInWave = 0;
      waveTimer = 0;
      updateWaveDisplay();
      // Wave bonus: restore 1 heart up to 3
      hearts = Math.min(3, hearts + 1);
      updateHeartsDisplay();
    } else {
      triggerOutro();
    }
  }
}

function triggerGameOver(reason) {
  gameState = "GAMEOVER";
  typing.enabled = false;
  hud.classList.add("hidden");
  gameOverTitle.textContent = reason;
  gameOverStats.textContent = `WAVE REACHED: ${currentWave} / 7 | TOTAL ELIMINATIONS: ${kills}`;
  gameOverScreen.classList.remove("hidden");
}

function triggerOutro() {
  gameState = "OUTRO";
  typing.enabled = false;
  hud.classList.add("hidden");
  outroText.textContent =
    "The 7th wave collapses.\nSilence settles over the burning ruins.\n\n" +
    "This is the path he chose: to become a phantom who saves the world through violence.";
  outroScreen.classList.remove("hidden");
}

function resetGame() {
  currentWave = 1;
  zombiesSpawnedInWave = 0;
  zombies = [];
  waveTimer = 0;
  kills = 0;
  hearts = 3;
  updateHeartsDisplay();
  updateKillDisplay();
  updateWaveDisplay();
  typing.clearTarget();
  initEntities();
}

// Wiring Typing
typing = new TypingEngine(() => zombies, onHit, onKill, onMiss);
typing.enabled = false;

// UI & Menu Listeners
btnPlay.addEventListener("click", () => {
  sounds.init();
  homeScreen.classList.add("hidden");
  storyText.textContent =
    "The virus took over the world.\nYet humanity still survives... but in vain.\n\n" +
    "Armed with cold steel and unmatched reflex, you stand alone on the boulevard.";
  storyScreen.classList.remove("hidden");
  gameState = "STORY";
});

btnSettings.addEventListener("click", () => {
  homeScreen.classList.add("hidden");
  settingsScreen.classList.remove("hidden");
});

btnBackSettings.addEventListener("click", () => {
  settingsScreen.classList.add("hidden");
  homeScreen.classList.remove("hidden");
});

toggleAudio.addEventListener("click", () => {
  sounds.muted = !sounds.muted;
  toggleAudio.textContent = sounds.muted ? "MUTED" : "ENABLED";
});

toggleBlood.addEventListener("click", () => {
  bloodEnabled = !bloodEnabled;
  toggleBlood.textContent = bloodEnabled ? "ENABLED" : "DISABLED";
});

btnStartWave.addEventListener("click", () => {
  storyScreen.classList.add("hidden");
  hud.classList.remove("hidden");
  resetGame();
  gameState = "PLAYING";
  typing.enabled = true;
  spawnZombie();
});

pauseBtn.addEventListener("click", () => {
  if (gameState !== "PLAYING") return;
  gameState = "PAUSED";
  typing.enabled = false;
  pauseScreen.classList.remove("hidden");
});

btnResume.addEventListener("click", () => {
  pauseScreen.classList.add("hidden");
  gameState = "PLAYING";
  typing.enabled = true;
});

btnRestart.addEventListener("click", () => {
  pauseScreen.classList.add("hidden");
  hud.classList.remove("hidden");
  resetGame();
  gameState = "PLAYING";
  typing.enabled = true;
  spawnZombie();
});

btnQuit.addEventListener("click", () => {
  pauseScreen.classList.add("hidden");
  hud.classList.add("hidden");
  homeScreen.classList.remove("hidden");
  gameState = "MENU";
  typing.enabled = false;
  resetGame();
});

btnRetry.addEventListener("click", () => {
  gameOverScreen.classList.add("hidden");
  hud.classList.remove("hidden");
  resetGame();
  gameState = "PLAYING";
  typing.enabled = true;
  spawnZombie();
});

btnOutroHome.addEventListener("click", () => {
  outroScreen.classList.add("hidden");
  homeScreen.classList.remove("hidden");
  gameState = "MENU";
  resetGame();
});

// Render & Animation Loop
let lastTime = performance.now();

function loop(currentTime) {
  const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
  lastTime = currentTime;

  if (gameState === "PLAYING") {
    const cfg = WAVE_CONFIG[currentWave - 1];

    // Spawn control
    if (zombiesSpawnedInWave < cfg.totalZombies) {
      waveTimer += dt;
      if (waveTimer >= cfg.spawnInterval) {
        spawnZombie();
        waveTimer = 0;
      }
    }

    // Rule 1: Instant casualty if zombie breaches player line
    for (const z of zombies) {
      if (!z.isDead && z.x <= player.x + 35) {
        triggerGameOver("BREACHED // PHYSICAL OVERRUN");
        break;
      }
    }

    bg.update(dt);
    player.update(dt, typing.currentTarget);
    zombies.forEach((z) => z.update(dt));
    particles.update(dt);
  } else if (gameState === "MENU" || gameState === "STORY") {
    bg.update(dt);
  }

  // Draw scene
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  bg.draw(ctx);

  if (gameState === "PLAYING" || gameState === "PAUSED" || gameState === "GAMEOVER") {
    player.draw(ctx, currentTime / 1000);
    zombies.forEach((z) => z.draw(ctx));
    particles.draw(ctx);
  }

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);