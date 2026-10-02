// js/typing.js

export class TypingEngine {
  constructor(getZombies, onHit, onKill, onMiss) {
    this.getZombies = getZombies;
    this.onHit = onHit;
    this.onKill = onKill;
    this.onMiss = onMiss;
    this.currentTarget = null;
    this.enabled = true;

    window.addEventListener("keydown", (e) => this.handleKey(e));
  }

  handleKey(e) {
    if (!this.enabled || e.key.length !== 1 || e.ctrlKey || e.altKey || e.metaKey) return;
    const char = e.key.toLowerCase();
    const zombies = this.getZombies().filter((z) => !z.isDead);

    if (!this.currentTarget || this.currentTarget.isDead) {
      // Find eligible zombies whose first untyped letter matches
      const eligible = zombies
        .filter((z) => z.word[z.typedIndex] === char)
        .sort((a, b) => a.x - b.x);

      if (eligible.length > 0) {
        this.currentTarget = eligible[0];
        this.processChar();
      } else {
        // Wrong key with no locked target
        if (zombies.length > 0) {
          this.onMiss();
        }
      }
    } else {
      // Check against current locked target
      if (this.currentTarget.word[this.currentTarget.typedIndex] === char) {
        this.processChar();
      } else {
        // Wrong key while targeting
        this.onMiss();
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