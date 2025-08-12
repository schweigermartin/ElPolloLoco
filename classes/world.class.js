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
        // Zurück zu Level 1
        this.currentLevel = 1;
        this.gameRunning = true;
        this.camera_x = -10;
        
        // Ursprüngliche Positionen aus level1 speichern
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
        
        // Level-Daten neu laden durch Erstellen frischer Instanzen mit exakten ursprünglichen Positionen
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
        
        // Charakter auf sichere Startposition und alle Eigenschaften zurücksetzen
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
        
        // Statusleisten sofort initialisieren
        this.character.initializeStatusBars();
        
        // Endboss-Statusleiste von Anfang an anzeigen
        const endbossStatus = document.getElementById('endbossStatus');
        if (endbossStatus) {
            endbossStatus.style.display = 'flex';
        }
        
        // Endboss-Gesundheitsanzeige initialisieren
        setTimeout(() => {
            this.updateEndbossHealth();
        }, 100);
    }

    /**
     * Sets the world reference for all game objects
     */
    setWorld(){
        this.character.world = this;
        this.enemies.forEach(enemy => {
            enemy.world = this;
        });
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
        
        // Welt-Grenze zeichnen
        this.drawWorldBoundary();

        this.ctx.translate(-this.camera_x, 0);
    }

    /**
     * Draws a wall at the end of the world
     */
    drawWorldBoundary() {
        // Eine Wand am Ende der Welt zeichnen
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(3500, 0, 100, 480);
        
        // Einige visuelle Elemente hinzufügen, um es wie eine Wand aussehen zu lassen
        this.ctx.fillStyle = '#654321';
        this.ctx.fillRect(3500, 0, 100, 20);
        this.ctx.fillRect(3500, 460, 100, 20);
    }

    /**
     * Updates game logic
     */
    update(){
        // Spiel-Logik hier aktualisieren, falls nötig
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
            
            // Kollisionen mit Gegnern prüfen
            this.enemies.forEach(enemy => {
                if (this.character.isColliding(enemy) && !enemy.isDead) {
                    // Prüfen, ob Charakter auf Gegner springt
                    const isFalling = this.character.velocityY > 0;
                    const isAboveEnemy = this.character.y + this.character.height < enemy.y + enemy.height * 0.9;
                    const isOverlappingHorizontally = this.character.x + this.character.width > enemy.x + 10 && 
                                                    this.character.x < enemy.x + enemy.width - 10;
                    
                    if (isFalling && isAboveEnemy && isOverlappingHorizontally) {
                        // Charakter fällt auf Gegner - Gegner töten
                        if ((enemy instanceof Chicken || enemy instanceof SmallChicken) && !enemy.isDead) {
                            enemy.die();
                            // Charakter hochspringen lassen
                            this.character.velocityY = -8;
                            // Mehrfache Tötungen auf denselben Gegner verhindern
                            setTimeout(() => {
                                if (enemy.isDead) {
                                    // Gegner bestätigt tot
                                }
                            }, 100);
                        }
                        // Endboss kann nicht durch Springen getötet werden
                    } else if (!enemy.isDead) {
                        // Normale Kollision - Charakter verletzen
                        this.character.hurt();
                    }
                }
            });

            // Kollisionen mit Münzen prüfen
            for (let i = this.coins.length - 1; i >= 0; i--) {
                if (this.character.isColliding(this.coins[i])) {
                    this.character.collectCoin();
                    this.coins.splice(i, 1);
                }
            }

            // Kollisionen mit Flaschen prüfen
            for (let i = this.bottles.length - 1; i >= 0; i--) {
                if (this.character.isColliding(this.bottles[i])) {
                    this.character.collectBottle();
                    this.bottles.splice(i, 1);
                }
            }

            // Geworfene Flaschen prüfen, die Gegner treffen
            for (let bottleIndex = this.character.throwableBottles.length - 1; bottleIndex >= 0; bottleIndex--) {
                const bottle = this.character.throwableBottles[bottleIndex];
                let bottleHit = false;
                
                for (let enemyIndex = this.enemies.length - 1; enemyIndex >= 0; enemyIndex--) {
                    const enemy = this.enemies[enemyIndex];
                    
                    if (bottle.isColliding(enemy) && !enemy.isDead && !bottleHit && !bottle.hasHit) {
                        if (enemy instanceof Endboss) {
                            // Endboss braucht mehr Treffer
                            if (!enemy.hitCount) enemy.hitCount = 0;
                            enemy.hitCount++;
                            
                            // Endboss-Gesundheitsanzeige aktualisieren
                            this.updateEndbossHealth();
                            
                            // Endboss stirbt nach 5 Treffern
                            if (enemy.hitCount >= 5) {
                                enemy.die();
                                
                                // Endboss-Statusleiste ausblenden
                                const endbossStatus = document.getElementById('endbossStatus');
                                if (endbossStatus) {
                                    endbossStatus.style.display = 'none';
                                }
                            }
                        } else if (enemy instanceof Chicken || enemy instanceof SmallChicken) {
                            // Normaler Gegner stirbt sofort
                            enemy.die();
                        }
                        
                        // Flaschen-Splash-Animation auslösen
                        bottle.hit();
                        bottleHit = true;
                        break; // Gegner-Schleife nach Treffer verlassen
                    }
                }
            }

            // Level-Abschluss prüfen
            this.checkLevelCompletion();
        }, 50); // Noch höhere Frequenz für bessere Reaktionsfähigkeit
    }

    /**
     * Checks if the level is completed
     */
    checkLevelCompletion() {
        // Prüfen, ob Endboss besiegt wurde
        const endboss = this.enemies.find(enemy => enemy instanceof Endboss);
        if (endboss && endboss.isDead) {
            this.levelCompleted();
        }
    }

    /**
     * Handles level completion
     */
    levelCompleted() {
        // Mehrfache Aufrufe verhindern
        if (this.levelCompletedCalled) return;
        this.levelCompletedCalled = true;
        
        // Globale showGameOver-Funktion aufrufen
        if (typeof showGameOver === 'function') {
            showGameOver(true);
        }
    }

    /**
     * Handles game over
     */
    gameOver() {
        // Mehrfache Aufrufe verhindern
        if (this.gameOverCalled) return;
        this.gameOverCalled = true;
        
        // Globale showGameOver-Funktion mit won=true aufrufen
        if (typeof showGameOver === 'function') {
            showGameOver(false);
        }
    }

    /**
     * Updates the endboss health display
     */
    updateEndbossHealth() {
        const endboss = this.enemies.find(enemy => enemy instanceof Endboss);
        const endbossHealthBar = document.getElementById('endbossHealthBar');
        
        if (endboss && endbossHealthBar) {
            const remainingHealth = Math.max(0, 5 - endboss.hitCount);
            const healthPercentage = (remainingHealth / 5) * 100;
            
            // Unterschiedliche Bilder je nach verbleibender Gesundheit wie in der Referenz
            let imagePath;
            if (healthPercentage >= 100) {
                imagePath = 'img/7_statusbars/2_statusbar_endboss/green.png';
            } else if (healthPercentage >= 80) {
                imagePath = 'img/7_statusbars/2_statusbar_endboss/green.png';
            } else if (healthPercentage >= 60) {
                imagePath = 'img/7_statusbars/2_statusbar_endboss/orange.png';
            } else if (healthPercentage >= 40) {
                imagePath = 'img/7_statusbars/2_statusbar_endboss/orange.png';
            } else if (healthPercentage >= 20) {
                imagePath = 'img/7_statusbars/2_statusbar_endboss/orange.png';
            } else {
                imagePath = 'img/7_statusbars/2_statusbar_endboss/blue.png';
            }
            
            // Nur aktualisieren, wenn sich der Bildpfad geändert hat
            if (endbossHealthBar.src !== imagePath) {
                endbossHealthBar.src = imagePath;
            }
        }
    }
}