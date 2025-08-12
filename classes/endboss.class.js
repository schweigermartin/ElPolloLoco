/**
 * Stellt den Endboss-Feind im Spiel dar
 * @extends MoveableObject
 */
class Endboss extends MoveableObject {

    height = 200;
    width = 150;
    y = 250;
    speed = 2.0; // Erhöhte Geschwindigkeit
    isDead = false;
    isAlerted = false;
    isAttacking = false;
    hitCount = 0;
    lastAttackTime = 0;
    attackCooldown = 1500; // 1,5 Sekunden zwischen Angriffen
    attackRange = 250; // Erhöhter Angriffsbereich
    alertRange = 300; // Bereich für Alarmierung

    IMAGES_WALKING = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png',
    ];
    IMAGES_ALERT = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png',
    ];
    IMAGES_ATTACK = [
        'img/4_enemie_boss_chicken/3_attack/G13.png',
        'img/4_enemie_boss_chicken/3_attack/G14.png',
        'img/4_enemie_boss_chicken/3_attack/G15.png',
        'img/4_enemie_boss_chicken/3_attack/G16.png',
        'img/4_enemie_boss_chicken/3_attack/G17.png',
        'img/4_enemie_boss_chicken/3_attack/G18.png',
        'img/4_enemie_boss_chicken/3_attack/G19.png',
        'img/4_enemie_boss_chicken/3_attack/G20.png',
    ];
    IMAGES_HURT = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png',
    ];
    IMAGES_DEAD = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png',
    ];

    constructor(x) {
        super();
        this.loadImage('img/4_enemie_boss_chicken/1_walk/G1.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.x = x;
        this.animate();
    }

    animate() {
        // Bewegung und Angriffslogik
        setInterval(() => {
            if (!this.isDead && this.world && this.world.character) {
                const distance = Math.abs(this.x - this.world.character.x);
                
                // Prüfen, ob Spieler nah genug ist für Alarmierung
                if (distance < this.alertRange && !this.isAlerted) {
                    this.isAlerted = true;
                    this.currentImage = 0;
                }
                
                if (this.isAlerted && !this.isAttacking) {
                    // Bewegung und Angriffslogik
                    if (distance < this.attackRange) {
                        // Angriff starten
                        this.startAttack();
                    } else {
                        // Zum Spieler bewegen
                        this.moveTowardsPlayer();
                    }
                }
            }
        }, 1000 / 60);

        // Animation
        setInterval(() => {
            if (this.isDead) {
                // Tote-Animation anzeigen
                let i = this.currentImage % this.IMAGES_DEAD.length;
                let path = this.IMAGES_DEAD[i];
                this.img = this.imageCache[path];
                this.currentImage++;
            } else if (this.isAttacking) {
                // Angriffs-Animation
                let i = this.currentImage % this.IMAGES_ATTACK.length;
                let path = this.IMAGES_ATTACK[i];
                this.img = this.imageCache[path];
                this.currentImage++;
                
                // Angriff beenden, wenn Animation abgeschlossen ist
                if (this.currentImage >= this.IMAGES_ATTACK.length) {
                    this.isAttacking = false;
                    this.currentImage = 0;
                }
            } else if (this.isAlerted) {
                // Alarmierungs-Animation
                let i = this.currentImage % this.IMAGES_ALERT.length;
                let path = this.IMAGES_ALERT[i];
                this.img = this.imageCache[path];
                this.currentImage++;
            } else {
                // Geh-Animation
                let i = this.currentImage % this.IMAGES_WALKING.length;
                let path = this.IMAGES_WALKING[i];
                this.img = this.imageCache[path];
                this.currentImage++;
            }
        }, 150);
    }

    moveTowardsPlayer() {
        if (!this.world || !this.world.character) return;
        
        // Zum Spieler bewegen, wenn nicht zu nah
        const distance = this.x - this.world.character.x;
        if (Math.abs(distance) > 50) {
            if (distance > 0) {
                this.x -= this.speed;
                this.otherDirection = true; // Nach links schauen beim Rechtsbewegung (korrigiert)
            } else {
                this.x += this.speed;
                this.otherDirection = false; // Nach rechts schauen beim Linksbewegung (korrigiert)
            }
        }
    }

    startAttack() {
        const currentTime = Date.now();
        // Angreifen, wenn nah genug und Cooldown vorbei ist
        if (currentTime - this.lastAttackTime > this.attackCooldown) {
            this.isAttacking = true;
            this.currentImage = 0;
            this.lastAttackTime = currentTime;
            
            // Angriff auf Charakter, wenn nah genug - nur während Angriffsanimation
            setTimeout(() => {
                if (this.world && this.world.character && this.isAttacking) {
                    const distance = Math.abs(this.x - this.world.character.x);
                    if (distance < 100) { // Viel kleinerer Angriffsbereich für tatsächlichen Schaden
                        this.world.character.hurt();
                    }
                }
            }, 1000); // Angriff passiert 1 Sekunde in die Angriffsanimation
        }
    }

    die() {
        this.isDead = true;
        this.currentImage = 0;
    }

    /**
     * Prüft, ob der Endboss mit einem anderen Objekt kollidiert
     * @param {MoveableObject} mo - Das Objekt, mit dem die Kollision überprüft werden soll
     * @returns {boolean} True, wenn eine Kollision erkannt wurde, false sonst
     */
    isColliding(mo) {
        if (!mo) return false;
        
        // Präzisere Kollisionserkennung für den Endboss
        const bossHitbox = {
            x: this.x + 20,
            y: this.y + 30,
            width: this.width - 40,
            height: this.height - 60
        };
        
        const objHitbox = {
            x: mo.x + 10,
            y: mo.y + 10,
            width: mo.width - 20,
            height: mo.height - 20
        };
        
        return bossHitbox.x + bossHitbox.width > objHitbox.x &&
               bossHitbox.x < objHitbox.x + objHitbox.width &&
               bossHitbox.y + bossHitbox.height > objHitbox.y &&
               bossHitbox.y < objHitbox.y + objHitbox.height;
    }
} 