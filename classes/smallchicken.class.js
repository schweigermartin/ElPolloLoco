/**
 * Represents a small chicken enemy in the game
 * @extends MoveableObject
 */
class SmallChicken extends MoveableObject{

    height = 45; // Noch kleiner als normales Huhn
    width = 45; // Breite auch kleiner machen
    y = 365; // Etwas niedrigere Position
    isDead = false;
    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/3_w.png',
    ];
    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_small/2_dead/dead.png',
    ];

    /**
     * Initializes a small chicken enemy with random or specified position
     * @param {number|null} x - X position for the chicken, null for random position
     */
    constructor(x = null){
        super();
        this.loadImage('img/3_enemies_chicken/chicken_small/1_walk/1_w.png');

        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        
        // Wenn keine x-Position angegeben ist, zufällige Position verwenden
        if (x === null) {
            this.x = 200 + Math.random()*500;
        } else {
            this.x = x;
        }
        
        this.speed = 0.15 + Math.random() * 0.2; // Etwas schneller als normale Hühner

        this.animate();
    }

    /**
     * Sets up movement and animation loops for the small chicken
     */
    animate(){
        // Bewegung
        setInterval(() => {
            if (!this.isDead) {
                this.x -= this.speed;
            }
        }, 1000 / 60);

        // Animation
        setInterval(() => {
            if (!this.isDead) {
                let i = this.currentImage % this.IMAGES_WALKING.length;
                let path = this.IMAGES_WALKING[i];
                this.img = this.imageCache[path];
                this.currentImage++;
            } else {
                // Tote-Animation anzeigen
                this.img = this.imageCache[this.IMAGES_DEAD[0]];
            }
        }, 100);
    }

    /**
     * Handles small chicken death and changes to dead animation
     */
    die(){
        this.isDead = true;
        this.currentImage = 0;
    }
} 