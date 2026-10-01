export class TypingEngine {
    constructor(getZombies, onHit, onKill) {
        this.getZombies = getZombies;
        this.onHit = onHit;
        this.onKill = onKill;
        this.currentTarget = null;

        window.addEventListener("keydown", (e) => this.handleKey(e));
    }


    handleKey(e) {
        if (e.key.length !== 1) return;
        const char = e.key.toLowerCase();
        const zombies = this.getZombies().filter((z) => !z.isDead);

        if (!this.currentTarget || this.currentTarget.isDead){
            const eligible = zombies
                .filter((z) => z.word[z.typedIndex] === char)
                .sort((a, b) => a.x - b.x);
            if (eligible.length > 0) {
                this.currentTarget = eligible[0];
                this.processChar();
            }
        } else {
            if (this.currentTarget.word[this.currentTarget.typedIndex] === char) {
                this.processChar();
            }
        }
    }

    processChar() {
        this.currentTarget.typedIndex++;
        this.onHit(this.currentTarget);
        if(this.currentTarget.typedIndex >= this.currentTarget.word.length) {
            this.currentTarget.isDead = true;
            this.onKill(this.currentTarget);
            this.currentTarget = null;
        }
    }

    clearTarget() {
        this.currentTarget = null;
    }
}