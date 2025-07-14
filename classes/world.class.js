/**
 * Represents the game world and manages all game objects and logic
 */
class World{
    character = new Character();
    currentLevel = 1;
    enemies = level1.enemies;
    clouds = level1.clouds;
    backgroundobjects = level1.backgroundobjects;
    coins = level1.coins;
    bottles = level1.bottles;
    ctx;
    canvas;
    keyboard;
    camera_x = -10;
    gameRunning = true;

    /**
     * Initializes the world with level data and sets up game objects
     */
    constructor(){
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.keyboard = new Keyboard();
        
        this.resetGame();
    }

    /**
     * Resets the game to initial state
     */
    resetGame(){
        // Reset to Level 1
        this.currentLevel = 1;
        this.gameRunning = true;
        this.camera_x = -10;
        
        // Store original positions from level1
        const originalEnemyPositions = [
            { type: 'Chicken', x: 800 },
            { type: 'Chicken', x: 1200 },
            { type: 'Chicken', x: 1600 },
            { type: 'Chicken', x: 2000 },
            { type: 'Chicken', x: 2200 },
            { type: 'Chicken', x: 2400 },
            { type: 'SmallChicken', x: 900 },
            { type: 'SmallChicken', x: 1400 },
            { type: 'SmallChicken', x: 1800 },
            { type: 'SmallChicken', x: 2200 },
            { type: 'SmallChicken', x: 2600 },
            { type: 'Endboss', x: 2800 }
        ];
        
        // Reload level data by creating fresh instances with exact original positions
        this.enemies = originalEnemyPositions.map((enemy, index) => {
            if (enemy.type === 'Chicken') {
                const newChicken = new Chicken(enemy.x);
                newChicken.world = this;
                return newChicken;
            } else if (enemy.type === 'SmallChicken') {
                const newSmallChicken = new SmallChicken(enemy.x);
                newSmallChicken.world = this;
                return newSmallChicken;
            } else if (enemy.type === 'Endboss') {
                const newEndboss = new Endboss(enemy.x);
                newEndboss.world = this;
                newEndboss.isAlerted = false;
                newEndboss.isAttacking = false;
                newEndboss.hitCount = 0;
                return newEndboss;
            }
        });
        
        this.clouds = level1.clouds.map(cloud => new Cloud());
        this.backgroundobjects = level1.backgroundobjects.map(bg => 
            new BackgroundObject(bg.img.src, bg.x)
        );
        this.coins = level1.coins.map(coin => new Coin(coin.x, coin.y));
        this.bottles = level1.bottles.map(bottle => new Bottle(bottle.x, bottle.y));
        
        this.setWorld();
        this.checkCollisions();
        
        // Reset character to safe starting position and all properties
        this.character.x = 100;
        this.character.y = 170;
        this.character.health = 100;
        this.character.coins = 0;
        this.character.bottles = 0;
        this.character.throwableBottles = [];
        this.character.velocityY = 0;
        this.character.isJumping = false;
        this.character.isHurt = false;
        this.character.isOnGround = true;
        this.character.isSleeping = false;
        this.character.lastActionTime = Date.now();
        
        // Initialize status bars immediately
        this.character.initializeStatusBars();
        
        // Show endboss status bar from the beginning
        const endbossStatus = document.getElementById('endbossStatus');
        if (endbossStatus) {
            endbossStatus.style.display = 'flex';
        }
        
        // Initialize endboss health display
        setTimeout(() => {
            this.updateEndbossHealth();
        }, 100);
    }

    /**
     * Sets the world reference for the character
     */
    setWorld(){
        this.character.world = this;
    }

    /**
     * Renders all game objects to the canvas
     */
    draw(){
        if (!this.gameRunning) return;
        
        this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0);

        this.addObjectsToMap(this.backgroundobjects);
        this.addObjectsToMap(this.coins);
        this.addObjectsToMap(this.bottles);
        this.addToMap(this.character);
        this.addObjectsToMap(this.character.throwableBottles);
        this.addObjectsToMap(this.enemies);
        this.addObjectsToMap(this.clouds);
        
        // Draw world boundary
        this.drawWorldBoundary();

        this.ctx.translate(-this.camera_x, 0);
    }
    
    /**
     * Draws the world boundary wall at the end of the level
     */
    drawWorldBoundary() {
        // Draw a wall at the end of the world
        const wallX = 3500;
        const wallY = 0;
        const wallWidth = 100;
        const wallHeight = 480;
        
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(wallX, wallY, wallWidth, wallHeight);
        
        // Add some visual elements to make it look like a wall
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.fillRect(wallX + 10, wallY + 50, 80, 10);
        this.ctx.fillRect(wallX + 10, wallY + 150, 80, 10);
        this.ctx.fillRect(wallX + 10, wallY + 250, 80, 10);
        this.ctx.fillRect(wallX + 10, wallY + 350, 80, 10);
    }

    /**
     * Updates game logic and checks for game over conditions
     */
    update(){
        // Update game logic here if needed
        if (this.character.health <= 0) {
            this.gameOver();
        }
    }

    /**
     * Adds multiple objects to the map for rendering
     * @param {Array} objects - Array of objects to add to the map
     */
    addObjectsToMap(objects){
        objects.forEach(o => {
            this.addToMap(o);
        });
    }
    
    /**
     * Adds a single object to the map for rendering
     * @param {MoveableObject} mo - The object to add to the map
     */
    addToMap(mo) {
        if (mo.otherDirection) {
            this.ctx.save();
            this.ctx.translate(mo.x + mo.width, mo.y);
            this.ctx.scale(-1, 1);
            this.ctx.drawImage(mo.img, 0, 0, mo.width, mo.height);
            this.ctx.restore();
        } else {
            this.ctx.drawImage(mo.img, mo.x, mo.y, mo.width, mo.height);
        }
    }

    /**
     * Checks for collisions between character and other game objects
     */
    checkCollisions(){
        setInterval(() => {
            if (!this.gameRunning) return;
            
            // Check collisions with enemies
            this.enemies.forEach(enemy => {
                if (this.character.isColliding(enemy) && !enemy.isDead) {
                    // Check if character is jumping on enemy
                    const isFalling = this.character.velocityY > 0;
                    const isAboveEnemy = this.character.y + this.character.height < enemy.y + enemy.height * 0.9;
                    const isOverlappingHorizontally = this.character.x + this.character.width > enemy.x + 10 && 
                                                    this.character.x < enemy.x + enemy.width - 10;
                    
                    if (isFalling && isAboveEnemy && isOverlappingHorizontally) {
                        // Character is falling on enemy - kill enemy
                        if ((enemy instanceof Chicken || enemy instanceof SmallChicken) && !enemy.isDead) {
                            enemy.die();
                            // Bounce character up
                            this.character.velocityY = -8;
                            // Prevent multiple kills on same enemy
                            setTimeout(() => {
                                if (enemy.isDead) {
                                    // Enemy confirmed dead
                                }
                            }, 100);
                        }
                        // Endboss cannot be killed by jumping
                    } else if (!enemy.isDead) {
                        // Normal collision - hurt character
                        this.character.hurt();
                    }
                }
            });

            // Check collisions with coins
            for (let i = this.coins.length - 1; i >= 0; i--) {
                if (this.character.isColliding(this.coins[i])) {
                    this.character.collectCoin();
                    this.coins.splice(i, 1);
                }
            }

            // Check collisions with bottles
            for (let i = this.bottles.length - 1; i >= 0; i--) {
                if (this.character.isColliding(this.bottles[i])) {
                    this.character.collectBottle();
                    this.bottles.splice(i, 1);
                }
            }

            // Check throwable bottles hitting enemies
            for (let bottleIndex = this.character.throwableBottles.length - 1; bottleIndex >= 0; bottleIndex--) {
                const bottle = this.character.throwableBottles[bottleIndex];
                let bottleHit = false;
                
                for (let enemyIndex = this.enemies.length - 1; enemyIndex >= 0; enemyIndex--) {
                    const enemy = this.enemies[enemyIndex];
                    
                    if (bottle.isColliding(enemy) && !enemy.isDead && !bottleHit && !bottle.hasHit) {
                        if (enemy instanceof Endboss) {
                            // Endboss takes more hits
                            if (!enemy.hitCount) enemy.hitCount = 0;
                            enemy.hitCount++;
                            
                            // Update endboss health display
                            this.updateEndbossHealth();
                            
                            // Endboss dies after 5 hits
                            if (enemy.hitCount >= 5) {
                                enemy.die();
                                
                                // Hide endboss status bar
                                const endbossStatus = document.getElementById('endbossStatus');
                                if (endbossStatus) {
                                    endbossStatus.style.display = 'none';
                                }
                            }
                        } else if (enemy instanceof Chicken || enemy instanceof SmallChicken) {
                            // Normal enemy dies immediately
                            enemy.die();
                        }
                        
                        // Trigger bottle splash animation
                        bottle.hit();
                        bottleHit = true;
                        break; // Exit enemy loop after hit
                    }
                }
            }

            // Check level completion
            this.checkLevelCompletion();
        }, 50); // Even higher frequency for better responsiveness
    }

    /**
     * Checks if the level is completed (endboss defeated)
     */
    checkLevelCompletion(){
        // Check if endboss is defeated
        const endbossExists = this.enemies.some(enemy => enemy instanceof Endboss && !enemy.isDead);
        if (!endbossExists) {
            this.showVictoryScreen();
        }
    }

    /**
     * Updates the endboss health bar display
     */
    updateEndbossHealth(){
        const endboss = this.enemies.find(enemy => enemy instanceof Endboss);
        if (endboss) {
            const endbossBar = document.getElementById('endbossBar');
            const endbossText = document.getElementById('endbossText');
            
            if (endbossBar && endbossText) {
                const maxHits = 5;
                const currentHits = endboss.hitCount || 0;
                const remainingHealth = maxHits - currentHits;
                
                // Use different images based on remaining health like in the reference
                let imagePath;
                if (remainingHealth >= 4) {
                    imagePath = 'img/7_statusbars/2_statusbar_endboss/blue.png';
                } else if (remainingHealth >= 2) {
                    imagePath = 'img/7_statusbars/2_statusbar_endboss/green.png';
                } else {
                    imagePath = 'img/7_statusbars/2_statusbar_endboss/orange.png';
                }
                
                // Only update if the image path has changed
                if (endbossBar.src !== imagePath) {
                    endbossBar.src = imagePath;
                }
                
                endbossText.textContent = `${remainingHealth}/${maxHits}`;
            }
        }
    }

    /**
     * Handles game over and shows the game over screen
     */
    gameOver(){
        // Prevent multiple calls
        if (!this.gameRunning) return;
        
        this.gameRunning = false;
        // Call the global showGameOver function
        if (typeof showGameOver === 'function') {
            showGameOver(false);
        }
    }

    /**
     * Shows the victory screen when the game is won
     */
    showVictoryScreen(){
        // Prevent multiple calls
        if (!this.gameRunning) return;
        
        this.gameRunning = false;
        // Call the global showGameOver function with won=true
        if (typeof showGameOver === 'function') {
            showGameOver(true);
        }
    }
}