/**
 * Represents a chicken enemy in the game
 * @extends MoveableObject
 */
class Chicken extends MoveableObject{

    height = 80;
    y = 350;
    isDead = false;
    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
    ];
    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_normal/2_dead/dead.png',
    ];

    /**
     * Initializes a chicken enemy with random or specified position
     * @param {number|null} x - X position for the chicken, null for random position
     */
    constructor(x = null){
        super();
        this.loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');

        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        
        // If no x position is provided, use random positioning
        if (x === null) {
            this.x = 200 + Math.random()*500;
        } else {
            this.x = x;
        }
        
        this.speed = 0.1 + Math.random() * 0.15

        this.animate();
    }

    /**
     * Sets up movement and animation loops for the chicken
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
     * Handles chicken death and changes to dead animation
     */
    die(){
        this.isDead = true;
        this.currentImage = 0;
    }
}