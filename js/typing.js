// js/typing.js

export class TypingEngine {
  constructor(getZombies, onHit, onKill, onMiss, onCheat, onOpenConsole) {
    this.getZombies = getZombies;
    this.onHit = onHit;
    this.onKill = onKill;
    this.onMiss = onMiss;
    this.onCheat = onCheat;
    this.onOpenConsole = onOpenConsole;
    this.currentTarget = null;
    this.enabled = true;

    // Use capturing phase so no input or child element intercepts it
    window.addEventListener("keydown", (e) => this.handleKey(e), true);
  }

  handleKey(e) {
    // Single key trigger: Backslash ("\")
    if (e.key === "\\" || e.code === "Backslash") {
      // Don't re-trigger if typing inside the input field
      if (e.target && e.target.tagName === "INPUT") return;

      e.preventDefault();
      e.stopPropagation();
      if (this.onOpenConsole) {
        this.onOpenConsole();
      }
      return;
    }

    if (!this.enabled) return;
    if (e.key.length !== 1 || e.ctrlKey || e.altKey || e.metaKey) return;

    const char = e.key.toLowerCase();
    const zombies = this.getZombies().filter((z) => !z.isDead);

    if (!this.currentTarget || this.currentTarget.isDead) {
      const eligible = zombies
        .filter((z) => z.word[z.typedIndex] === char)
        .sort((a, b) => a.x - b.x);

      if (eligible.length > 0) {
        this.currentTarget = eligible[0];
        this.processChar();
      } else {
        if (zombies.length > 0 && this.onMiss) {
          this.onMiss();
        }
      }
    } else {
      if (this.currentTarget.word[this.currentTarget.typedIndex] === char) {
        this.processChar();
      } else {
        if (this.onMiss) {
          this.onMiss();
        }
      }
    }
  }

  processChar() {
    this.currentTarget.typedIndex++;
    this.onHit(this.currentTarget);

    if (this.currentTarget.typedIndex >= this.currentTarget.word.length) {
      this.currentTarget.isDead = true;
      this.onKill(this.currentTarget);
      this.currentTarget = null;
    }
  }

  clearTarget() {
    this.currentTarget = null;
  }
}