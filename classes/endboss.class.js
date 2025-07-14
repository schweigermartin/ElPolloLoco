/**
 * Represents the endboss enemy in the game
 * @extends MoveableObject
 */
class Endboss extends MoveableObject {
    height = 200;
    width = 150;
    y = 200;
    speed = 2.0; // Increased speed
    isAlerted = false;
    isAttacking = false;
    hitCount = 0;
    lastAttackTime = 0;
    attackCooldown = 1500; // 1.5 seconds between attacks
    attackRange = 250; // Increased attack range
    alertRange = 600;
    
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

    /**
     * Initializes the endboss with specified position
     * @param {number} x - X position for the endboss
     */
    constructor(x) {
        super();
        this.loadImage('img/4_enemie_boss_chicken/1_walk/G1.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.x = x;
        this.isDead = false;

        this.animate();
    }

    /**
     * Sets up all animation and behavior loops for the endboss
     */
    animate() {
        // Check if player is close enough to alert
        setInterval(() => {
            if (this.world && this.world.character && !this.isDead) {
                const distance = Math.abs(this.x - this.world.character.x);
                if (distance < this.alertRange && !this.isAlerted) {
                    this.alert();
                }
            }
        }, 200);

        // Movement and attack logic
        setInterval(() => {
            if (this.isAlerted && !this.isDead) {
                this.moveTowardsPlayer();
                this.checkForAttack();
            }
        }, 1000 / 60);

        // Walking animation
        setInterval(() => {
            if (!this.isAlerted && !this.isAttacking && !this.isDead) {
                let i = this.currentImage % this.IMAGES_WALKING.length;
                let path = this.IMAGES_WALKING[i];
                this.img = this.imageCache[path];
                this.currentImage++;
            }
        }, 200);

        // Alert animation
        setInterval(() => {
            if (this.isAlerted && !this.isAttacking && !this.isDead) {
                let i = this.currentImage % this.IMAGES_ALERT.length;
                let path = this.IMAGES_ALERT[i];
                this.img = this.imageCache[path];
                this.currentImage++;
            }
        }, 150);

        // Attack animation
        setInterval(() => {
            if (this.isAttacking && !this.isDead) {
                let i = this.currentImage % this.IMAGES_ATTACK.length;
                let path = this.IMAGES_ATTACK[i];
                this.img = this.imageCache[path];
                this.currentImage++;
            }
        }, 100);
    }

    /**
     * Moves the endboss towards the player when alerted
     */
    moveTowardsPlayer() {
        if (this.world && this.world.character) {
            const playerX = this.world.character.x;
            const distance = Math.abs(this.x - playerX);
            const oldX = this.x;
            
            // Move towards player if not too close
            if (distance > 50) {
                if (this.x < playerX - 20) {
                    this.x += this.speed;
                    this.otherDirection = true; // Face left when moving right (corrected)
                } else if (this.x > playerX + 20) {
                    this.x -= this.speed;
                    this.otherDirection = false; // Face right when moving left (corrected)
                }
            }
        }
    }

    /**
     * Checks if the endboss should attack the player
     */
    checkForAttack() {
        if (this.world && this.world.character) {
            const distance = Math.abs(this.x - this.world.character.x);
            const currentTime = Date.now();
            const timeSinceLastAttack = currentTime - this.lastAttackTime;
            
            // Attack if close enough and cooldown is over
            if (distance < this.attackRange && timeSinceLastAttack > this.attackCooldown && !this.isAttacking) {
                this.attack();
            }
        }
    }

    /**
     * Alerts the endboss to start pursuing the player
     */
    alert() {
        this.isAlerted = true;
        this.currentImage = 0;

    }

    /**
     * Initiates an attack sequence against the player
     */
    attack() {
        this.isAttacking = true;
        this.currentImage = 0;
        this.lastAttackTime = Date.now();
        
        // Attack the character if close enough - only during attack animation
        setTimeout(() => {
            if (this.world && this.world.character && this.isAttacking) {
                const distance = Math.abs(this.x - this.world.character.x);
                if (distance < 100) { // Much smaller attack range for actual damage
                    this.world.character.hurt();
                }
            }
        }, 1000); // Attack happens 1 second into the attack animation
        
        setTimeout(() => {
            this.isAttacking = false;
        }, 2000);
    }

    /**
     * Handles endboss death and stops all behaviors
     */
    die() {
        this.isDead = true;
        this.isAlerted = false;
        this.isAttacking = false;

    }

    /**
     * Checks if the endboss is colliding with another object
     * @param {MoveableObject} mo - The object to check collision with
     * @returns {boolean} True if collision detected, false otherwise
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