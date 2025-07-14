class ThrowableBottle extends MoveableObject {
    height = 40;  // Angepasst an Referenz
    width = 40;   // Angepasst an Referenz
    speedX = 8;   // Horizontale Geschwindigkeit
    speedY = -12; // Vertikale Geschwindigkeit (negativ = nach oben)
    gravity = 0.6; // Gravitation für realistische Flugkurve
    direction = 1; // 1 = rechts, -1 = links
    hasHit = false;
    
    IMAGES_BOTTLE = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];
    
    IMAGES_SPLASH = [
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ];

    constructor(x, y, direction) {
        super();
        this.loadImage('img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png');
        this.loadImages(this.IMAGES_BOTTLE);
        this.loadImages(this.IMAGES_SPLASH);
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.animate();
    }

    animate() {
        // Movement mit realistische Flugkurve
        setInterval(() => {
            if (!this.hasHit) {
                // Horizontale Bewegung
                this.x += this.speedX * this.direction;
                
                // Vertikale Bewegung mit Gravitation
                this.y += this.speedY;
                this.speedY += this.gravity;
                
                // Boden-Kollision
                if (this.y >= 350) { // Boden-Höhe
                    this.hit();
                }
            }
        }, 1000 / 60);

        // Animation - schneller für bessere Rotation
        setInterval(() => {
            if (this.hasHit) {
                // Show splash animation
                let i = this.currentImage % this.IMAGES_SPLASH.length;
                let path = this.IMAGES_SPLASH[i];
                this.img = this.imageCache[path];
                this.currentImage++;
                
                // Remove bottle after splash animation completes
                if (this.currentImage >= this.IMAGES_SPLASH.length) {
                    this.removeBottle();
                }
            } else {
                // Show rotation animation - schneller für bessere Rotation
                let i = this.currentImage % this.IMAGES_BOTTLE.length;
                let path = this.IMAGES_BOTTLE[i];
                this.img = this.imageCache[path];
                this.currentImage++;
            }
        }, 80); // Schneller für bessere Rotation
    }

    /**
     * Handles bottle hit and starts splash animation
     */
    hit() {
        this.hasHit = true;
        this.currentImage = 0;
        this.speedX = 0;
        this.speedY = 0;
    }

    /**
     * Removes the bottle from the game
     */
    removeBottle() {
        if (this.world && this.world.character) {
            const index = this.world.character.throwableBottles.indexOf(this);
            if (index > -1) {
                this.world.character.throwableBottles.splice(index, 1);
            }
        }
    }

    isColliding(mo) {
        if (!mo) return false;
        
        // Präzisere Kollisionserkennung für Flaschen
        const bottleHitbox = {
            x: this.x + 8,
            y: this.y + 8,
            width: this.width - 16,
            height: this.height - 16
        };
        
        const objHitbox = {
            x: mo.x + 15,
            y: mo.y + 15,
            width: mo.width - 30,
            height: mo.height - 30
        };
        
        return bottleHitbox.x + bottleHitbox.width > objHitbox.x &&
               bottleHitbox.x < objHitbox.x + objHitbox.width &&
               bottleHitbox.y + bottleHitbox.height > objHitbox.y &&
               bottleHitbox.y < objHitbox.y + objHitbox.height;
    }
} 