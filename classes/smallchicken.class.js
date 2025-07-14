/**
 * Represents a small chicken enemy in the game
 * @extends MoveableObject
 */
class SmallChicken extends MoveableObject{

    height = 45; // Even smaller than normal chicken
    width = 45; // Make width smaller too
    y = 365; // Slightly lower position
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
     * @param {number|null} x - X position for the small chicken, null for random position
     */
    constructor(x = null){
        super();
        this.loadImage('img/3_enemies_chicken/chicken_small/1_walk/1_w.png');

        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        
        // If no x position is provided, use random positioning
        if (x === null) {
            this.x = 200 + Math.random()*500;
        } else {
            this.x = x;
        }
        
        this.speed = 0.15 + Math.random() * 0.2; // Slightly faster than normal chickens

        this.animate();
    }

    /**
     * Sets up movement and animation loops for the small chicken
     */
    animate(){
        // Movement
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
                // Show dead animation
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