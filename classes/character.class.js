/**
 * Represents the main character (Pepe) in the game
 * @extends MoveableObject
 */
class Character extends MoveableObject{

    height = 260;
    x = 100; // Sichere Startposition
    y = 170;
    speed = 8;
    health = 100;
    coins = 0;
    bottles = 0;
    isJumping = false;
    isHurt = false;
    velocityY = 0;
    accelerationY = 0.5;
    isOnGround = true;
    throwableBottles = [];
    canThrowBottle = true;
    lastThrowTime = 0;
    throwCooldown = 500; // 500ms cooldown between throws
    lastActionTime = Date.now(); // Track when last action occurred
    isSleeping = false;
    IMAGES_WALKING = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png',
    ];
    IMAGES_JUMPING = [
        'img/2_character_pepe/3_jump/J-31.png',
        'img/2_character_pepe/3_jump/J-32.png',
        'img/2_character_pepe/3_jump/J-33.png',
        'img/2_character_pepe/3_jump/J-34.png',
        'img/2_character_pepe/3_jump/J-35.png',
        'img/2_character_pepe/3_jump/J-36.png',
        'img/2_character_pepe/3_jump/J-37.png',
        'img/2_character_pepe/3_jump/J-38.png',
        'img/2_character_pepe/3_jump/J-39.png',
    ];
    IMAGES_IDLE = [
        'img/2_character_pepe/1_idle/idle/I-1.png',
        'img/2_character_pepe/1_idle/idle/I-2.png',
        'img/2_character_pepe/1_idle/idle/I-3.png',
        'img/2_character_pepe/1_idle/idle/I-4.png',
        'img/2_character_pepe/1_idle/idle/I-5.png',
        'img/2_character_pepe/1_idle/idle/I-6.png',
        'img/2_character_pepe/1_idle/idle/I-7.png',
        'img/2_character_pepe/1_idle/idle/I-8.png',
        'img/2_character_pepe/1_idle/idle/I-9.png',
        'img/2_character_pepe/1_idle/idle/I-10.png',
    ];
    IMAGES_SLEEP = [
        'img/2_character_pepe/1_idle/long_idle/I-11.png',
        'img/2_character_pepe/1_idle/long_idle/I-12.png',
        'img/2_character_pepe/1_idle/long_idle/I-13.png',
        'img/2_character_pepe/1_idle/long_idle/I-14.png',
        'img/2_character_pepe/1_idle/long_idle/I-15.png',
        'img/2_character_pepe/1_idle/long_idle/I-16.png',
        'img/2_character_pepe/1_idle/long_idle/I-17.png',
        'img/2_character_pepe/1_idle/long_idle/I-18.png',
        'img/2_character_pepe/1_idle/long_idle/I-19.png',
        'img/2_character_pepe/1_idle/long_idle/I-20.png',
    ];
    IMAGES_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png',
    ];
    world;

    /**
     * Initializes the character with default properties and animations
     */
    constructor(){
        super();
        this.loadImage('img/2_character_pepe/1_idle/idle/I-1.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_SLEEP);
        this.loadImages(this.IMAGES_HURT);

        this.animate();
        
        // Initialize all status bars
        setTimeout(() => {
            this.updateHealthBar();
            this.updateCoinCounter();
            this.updateBottleCounter();
        }, 100);
    }

    /**
     * Sets up all animation loops for the character (movement, walking, jumping, hurt)
     */
    animate(){
        // Movement and jumping
        setInterval(() => {
            if (this.world && this.world.keyboard) {
                if (this.world.keyboard.RIGHT) {
                    this.x += this.speed;
                    this.otherDirection = false;
                }
                if (this.world.keyboard.LEFT && this.x > 0) {
                    this.x -= this.speed;
                    this.otherDirection = true;
                }
                if (this.world.keyboard.SPACE && this.isOnGround && !this.isHurt) {
                    this.jump();
                }
                if (this.world.keyboard.D && this.canThrowBottle) {
                    this.throwBottle();
                }
            }

            // Y-Bewegung (Sprung & Gravitation)
            this.y += this.velocityY;
            this.velocityY += this.accelerationY;

            // Boden-Kontakt prüfen
            if (this.y >= 170) {
                this.y = 170;
                this.velocityY = 0;
                this.isOnGround = true;
                this.isJumping = false;
            } else {
                this.isOnGround = false;
            }

            // Camera follow
            if (this.world) {
                this.world.camera_x = -this.x + 100;
            }
            
            // World boundary - prevent infinite running
            if (this.x > 3500) {
                this.x = 3500;
                // Show message that this is the end of the world
                if (!this.worldBoundaryMessageShown) {
                    this.showWorldBoundaryMessage();
                    this.worldBoundaryMessageShown = true;
                }
            } else {
                this.worldBoundaryMessageShown = false;
            }
        }, 1000 / 60);

        // Walking animation
        setInterval(() => {
            if (this.world && this.world.keyboard) {
                if ((this.world.keyboard.RIGHT || this.world.keyboard.LEFT) && !this.isJumping && !this.isHurt) {
                    let i = this.currentImage % this.IMAGES_WALKING.length;
                    let path = this.IMAGES_WALKING[i];
                    this.img = this.imageCache[path];
                    this.currentImage++; 
                    this.lastActionTime = Date.now();
                    this.isSleeping = false;
                }
            }
        }, 100);

        // Jumping animation
        setInterval(() => {
            if (this.isJumping && !this.isHurt) {
                let i = this.currentImage % this.IMAGES_JUMPING.length;
                let path = this.IMAGES_JUMPING[i];
                this.img = this.imageCache[path];
                this.currentImage++;
            }
        }, 150);

        // Idle and Sleep animation
        setInterval(() => {
            if (!this.isJumping && !this.isHurt && this.world && this.world.keyboard) {
                const currentTime = Date.now();
                const timeSinceLastAction = currentTime - this.lastActionTime;
                
                // Check if character should be sleeping (after 15 seconds)
                if (timeSinceLastAction > 15000) {
                    this.isSleeping = true;
                }
                
                // If no movement keys are pressed, show idle or sleep animation
                if (!this.world.keyboard.RIGHT && !this.world.keyboard.LEFT && !this.world.keyboard.SPACE && !this.world.keyboard.D) {
                    if (this.isSleeping) {
                        // Sleep animation
                        let i = this.currentImage % this.IMAGES_SLEEP.length;
                        let path = this.IMAGES_SLEEP[i];
                        this.img = this.imageCache[path];
                        this.currentImage++;
                    } else {
                        // Idle animation
                        let i = this.currentImage % this.IMAGES_IDLE.length;
                        let path = this.IMAGES_IDLE[i];
                        this.img = this.imageCache[path];
                        this.currentImage++;
                    }
                }
            }
        }, 200);

        // Hurt animation
        setInterval(() => {
            if (this.isHurt) {
                let i = this.currentImage % this.IMAGES_HURT.length;
                let path = this.IMAGES_HURT[i];
                this.img = this.imageCache[path];
                this.currentImage++;
            }
        }, 150);
    }

    /**
     * Makes the character jump if on ground and not hurt
     */
    jump(){
        if (this.isOnGround && !this.isHurt) {
            this.velocityY = -12;
            this.isOnGround = false;
            this.isJumping = true;
            this.currentImage = 0;
            this.lastActionTime = Date.now();
            this.isSleeping = false;
        }
    }

    /**
     * Handles character taking damage and updates health bar
     */
    hurt(){
        if (!this.isHurt) {
            this.health = Math.max(0, this.health - 20);
            this.isHurt = true;
            this.currentImage = 0;
            
            // Update health bar
            this.updateHealthBar();
            
            // Reset hurt state after animation
            setTimeout(() => {
                this.isHurt = false;
            }, 1000);
            
            if (this.health <= 0) {
                this.die();
            }
        }
    }

    /**
     * Collects a coin and updates the coin counter
     */
    collectCoin(){
        this.coins++;
        this.updateCoinCounter();
    }

    /**
     * Collects a bottle and updates the bottle counter
     */
    collectBottle(){
        // Maximum of 10 bottles
        if (this.bottles < 10) {
            this.bottles++;
            this.updateBottleCounter();
        }
    }

    /**
     * Updates the health bar display with current health percentage
     */
    updateHealthBar(){
        const healthBar = document.getElementById('healthBar');
        const healthText = document.getElementById('healthText');
        if (healthBar) {
            const healthPercentage = Math.max(0, this.health);
            
            // Use different images based on health percentage like in the reference
            let imagePath;
            if (healthPercentage >= 100) {
                imagePath = 'img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png';
            } else if (healthPercentage >= 80) {
                imagePath = 'img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png';
            } else if (healthPercentage >= 60) {
                imagePath = 'img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png';
            } else if (healthPercentage >= 40) {
                imagePath = 'img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png';
            } else if (healthPercentage >= 20) {
                imagePath = 'img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png';
            } else {
                imagePath = 'img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png';
            }
            
            // Only update if the image path has changed
            if (healthBar.src !== imagePath) {
                healthBar.src = imagePath;
            }
        }
        if (healthText) {
            healthText.textContent = Math.max(0, this.health) + '%';
        }
    }

    /**
     * Updates the coin counter display
     */
    updateCoinCounter(){
        const coinCounter = document.getElementById('coinCounter');
        const coinBar = document.getElementById('coinBar');
        if (coinCounter) {
            coinCounter.textContent = this.coins;
        }
        if (coinBar) {
            // Calculate coin percentage based on total coins in level
            const totalCoinsInLevel = 20; // Total coins available in level
            const coinPercentage = Math.min(100, (this.coins / totalCoinsInLevel) * 100);
            
            // Use different images based on coin percentage
            let imagePath;
            if (coinPercentage >= 100) {
                imagePath = 'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png';
            } else if (coinPercentage >= 80) {
                imagePath = 'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png';
            } else if (coinPercentage >= 60) {
                imagePath = 'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png';
            } else if (coinPercentage >= 40) {
                imagePath = 'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png';
            } else if (coinPercentage >= 20) {
                imagePath = 'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png';
            } else {
                imagePath = 'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png';
            }
            
            // Only update if the image path has changed
            if (coinBar.src !== imagePath) {
                coinBar.src = imagePath;
            }
        }
    }

    /**
     * Updates the bottle counter display
     */
    updateBottleCounter(){
        const bottleCounter = document.getElementById('bottleCounter');
        const bottleBar = document.getElementById('bottleBar');
        if (bottleCounter) {
            bottleCounter.textContent = this.bottles;
        }
        if (bottleBar) {
            // Calculate bottle percentage based on maximum of 10 bottles
            const maxBottles = 10;
            const bottlePercentage = Math.min(100, (this.bottles / maxBottles) * 100);
            
            // Use different images based on bottle percentage
            let imagePath;
            if (bottlePercentage >= 100) {
                imagePath = 'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/100.png';
            } else if (bottlePercentage >= 80) {
                imagePath = 'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/80.png';
            } else if (bottlePercentage >= 60) {
                imagePath = 'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/60.png';
            } else if (bottlePercentage >= 40) {
                imagePath = 'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/40.png';
            } else if (bottlePercentage >= 20) {
                imagePath = 'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/20.png';
            } else {
                imagePath = 'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/0.png';
            }
            
            // Only update if the image path has changed
            if (bottleBar.src !== imagePath) {
                bottleBar.src = imagePath;
            }
        }
    }

    /**
     * Initializes all status bars with correct default values
     */
    initializeStatusBars() {
        // Initialize status bars once with correct values
        this.updateHealthBar();
        this.updateCoinCounter();
        this.updateBottleCounter();
    }

    /**
     * Throws a bottle if the character has bottles available and cooldown is over
     */
    throwBottle(){
        const currentTime = Date.now();
        if (this.bottles > 0 && currentTime - this.lastThrowTime > this.throwCooldown) {
            this.bottles--;
            this.updateBottleCounter();
            this.lastThrowTime = currentTime;
            this.lastActionTime = Date.now();
            this.isSleeping = false;
            
            const bottleX = this.otherDirection ? this.x - 30 : this.x + this.width;
            const bottleY = this.y + 100;
            const direction = this.otherDirection ? -1 : 1;
            
            const bottle = new ThrowableBottle(bottleX, bottleY, direction);
            bottle.otherDirection = this.otherDirection;
            this.throwableBottles.push(bottle);
            
            // Remove bottle after 3 seconds
            setTimeout(() => {
                const index = this.throwableBottles.indexOf(bottle);
                if (index > -1) {
                    this.throwableBottles.splice(index, 1);
                }
            }, 3000);
        }
    }

    /**
     * Handles character death and triggers game over
     */
    die(){
        if (this.world) {
            this.world.gameOver();
        }
    }

    /**
     * Shows a temporary message when the character reaches the world boundary
     */
    showWorldBoundaryMessage() {
        // Create a temporary message element
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 20px;
            border-radius: 10px;
            font-size: 1.2em;
            z-index: 1000;
            text-align: center;
        `;
        message.textContent = 'Du hast das Ende der Welt erreicht!';
        document.body.appendChild(message);
        
        // Remove message after 3 seconds
        setTimeout(() => {
            if (document.body.contains(message)) {
                document.body.removeChild(message);
            }
        }, 3000);
    }

    /**
     * Checks if the character is colliding with another object
     * @param {MoveableObject} mo - The object to check collision with
     * @returns {boolean} True if collision detected, false otherwise
     */
    isColliding(mo) {
        if (!mo) return false;
        
        // Einfachere Kollisionserkennung für bessere Sprung-Mechanik
        const charHitbox = {
            x: this.x + 10,
            y: this.y + 20,
            width: this.width - 20,
            height: this.height - 40
        };
        
        const objHitbox = {
            x: mo.x + 5,
            y: mo.y + 5,
            width: mo.width - 10,
            height: mo.height - 10
        };
        
        return charHitbox.x + charHitbox.width > objHitbox.x &&
               charHitbox.x < objHitbox.x + objHitbox.width &&
               charHitbox.y + charHitbox.height > objHitbox.y &&
               charHitbox.y < objHitbox.y + objHitbox.height;
    }
}