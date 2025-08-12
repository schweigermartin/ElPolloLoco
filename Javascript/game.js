/**
 * Global game world instance
 * @type {World}
 */
let world;

/**
 * Flag indicating if the game is currently running
 * @type {boolean}
 */
let isGameRunning = false;

/**
 * Flag indicating if sound is muted
 * @type {boolean}
 */
let isMuted = false;

/**
 * Initializes the game and sets up event listeners
 */
function init() {
    setupEventListeners();
    showLandingPage();
}

/**
 * Sets up all event listeners for the game
 */
function setupEventListeners() {
    // Landing page buttons
    const startButton = document.getElementById('startButton');
    const optionsButton = document.getElementById('optionsButton');
    const controlsButton = document.getElementById('controlsButton');
    const explanationButton = document.getElementById('explanationButton');
    const imprintButton = document.getElementById('imprintButton');
    
    // Game over buttons
    const restartButton = document.getElementById('restartButton');
    const backToMenuButton = document.getElementById('backToMenuButton');
    
    // Mute button
    const muteButton = document.getElementById('muteButton');
    
    // Mobile controls
    const leftBtn = document.querySelector('.left-btn');
    const rightBtn = document.querySelector('.right-btn');
    const jumpBtn = document.querySelector('.jump-btn');
    const throwBtn = document.querySelector('.throw-btn');
    
    // Orientation change
    const orientationMessage = document.getElementById('orientationMessage');
    
    // Landing page buttons
    startButton.addEventListener('click', startGame);
    explanationButton.addEventListener('click', () => showDialog('gameExplanationDialog'));
    controlsButton.addEventListener('click', () => showDialog('controlsDialog'));
    // showStoryBtn.addEventListener('click', () => showDialog('storyDialog')); // This line was removed from the original file
    // showImpressumBtn.addEventListener('click', () => showDialog('impressumDialog')); // This line was removed from the original file
    
    // Game over buttons
    restartButton.addEventListener('click', restartGame);
    backToMenuButton.addEventListener('click', backToMenu);
    
    // Mute button
    muteButton.addEventListener('click', toggleMute);
    
    // Mobile controls
    setupMobileControls();
    
    // Orientation change
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);
}

/**
 * Shows the landing page and hides the game container
 */
function showLandingPage() {
    document.getElementById('landingPage').style.display = 'block';
    document.getElementById('gameContainer').style.display = 'none';
}

/**
 * Starts the game by creating a new world instance and beginning the game loop
 */
function startGame() {
    document.getElementById('landingPage').style.display = 'none';
    document.getElementById('gameContainer').style.display = 'block';
    
    // Create new world instance
    world = new World();
    isGameRunning = true;
    
    // Start game loop
    requestAnimationFrame(gameLoop);
}

/**
 * Main game loop that runs continuously while the game is active
 */
function gameLoop() {
    if (isGameRunning && world) {
        world.draw();
        world.update();
        requestAnimationFrame(gameLoop);
    }
}

/**
 * Shows a dialog by setting its display to flex
 * @param {string} dialogId - The ID of the dialog element to show
 */
function showDialog(dialogId) {
    document.getElementById(dialogId).style.display = 'flex';
}

/**
 * Closes a dialog by setting its display to none
 * @param {string} string} dialogId - The ID of the dialog element to close
 */
function closeDialog(dialogId) {
    document.getElementById(dialogId).style.display = 'none';
}

/**
 * Shows the game over screen with victory or defeat message
 */
function showGameOver(won = false) {
    // Prevent multiple calls
    if (!isGameRunning) return;
    
    isGameRunning = false;
    
    if (won) {
        // Directly show victory screen
        showGameOverScreen(won);
    } else {
        // Show game over image first, then the screen
        showGameOverImage();
    }
}

/**
 * Shows the game over image for 3 seconds before showing the game over screen
 */
function showGameOverImage() {
    // Check if overlay already exists
    if (document.getElementById('gameOverImageOverlay')) {
        return;
    }
    
    // Create overlay for the game over image
    const overlay = document.createElement('div');
    overlay.id = 'gameOverImageOverlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;
    
    // Create image element
    const gameOverImage = document.createElement('img');
    gameOverImage.src = 'img/9_intro_outro_screens/game_over/game over!.png';
    gameOverImage.style.cssText = `
        max-width: 80%;
        max-height: 80%;
        object-fit: contain;
    `;
    
    overlay.appendChild(gameOverImage);
    document.body.appendChild(overlay);
    
    // Remove image after 3 seconds and show game over screen
    setTimeout(() => {
        if (overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
        }
        showGameOverScreen(false);
    }, 3000);
}

/**
 * Shows the actual game over screen
 * @param {boolean} won - Whether the player won the game
 */
function showGameOverScreen(won = false) {
    const gameOverScreen = document.getElementById('gameOverScreen');
    const title = document.getElementById('gameOverTitle');
    const message = document.getElementById('gameOverMessage');
    const finalCoins = document.getElementById('finalCoins');
    const finalLevel = document.getElementById('finalLevel');
    
    if (won) {
        title.textContent = 'Gewonnen!';
        title.style.color = '#4CAF50';
        message.textContent = 'Du hast alle Gegner besiegt!';
    } else {
        title.textContent = 'Game Over!';
        title.style.color = '#ff6b6b';
        message.textContent = 'Du hast das Spiel verloren!';
    }
    
    if (world && world.character) {
        finalCoins.textContent = world.character.coins;
        finalLevel.textContent = world.currentLevel || 1;
    }
    
    gameOverScreen.style.display = 'flex';
}

/**
 * Restarts the game by hiding the game over screen and creating a completely new world instance
 */
function restartGame() {
    document.getElementById('gameOverScreen').style.display = 'none';
    
    // Create a completely new world instance for a fresh start
    world = new World();
    
    // Restart game loop
    isGameRunning = true;
    requestAnimationFrame(gameLoop);
}

/**
 * Returns to the main menu by hiding the game over screen and showing the landing page
 */
function backToMenu() {
    document.getElementById('gameOverScreen').style.display = 'none';
    showLandingPage();
}

/**
 * Toggles the mute state and saves it to localStorage
 */
function toggleMute() {
    isMuted = !isMuted;
    const muteButton = document.getElementById('muteButton');
    if (muteButton) {
        muteButton.textContent = isMuted ? '🔊' : '🔇';
    }
    
    // Save mute state to localStorage
    localStorage.setItem('elPolloLocoMuted', isMuted);
    
    // TODO: Implement actual sound muting when sound system is added
}

/**
 * Sets up touch event listeners for mobile control buttons
 */
function setupMobileControls() {
    const leftBtn = document.querySelector('.left-btn');
    const rightBtn = document.querySelector('.right-btn');
    const jumpBtn = document.querySelector('.jump-btn');
    const throwBtn = document.querySelector('.throw-btn');
    
    // Left button
    leftBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (world && world.keyboard) {
            world.keyboard.LEFT = true;
        }
    });
    
    leftBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        if (world && world.keyboard) {
            world.keyboard.LEFT = false;
        }
    });
    
    // Right button
    rightBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (world && world.keyboard) {
            world.keyboard.RIGHT = true;
        }
    });
    
    rightBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        if (world && world.keyboard) {
            world.keyboard.RIGHT = false;
        }
    });
    
    // Jump button
    jumpBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (world && world.keyboard) {
            world.keyboard.SPACE = true;
        }
    });
    
    jumpBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        if (world && world.keyboard) {
            world.keyboard.SPACE = false;
        }
    });
    
    // Throw button
    throwBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (world && world.keyboard) {
            world.keyboard.D = true;
        }
    });
    
    throwBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        if (world && world.keyboard) {
            world.keyboard.D = false;
        }
    });
}

/**
 * Handles orientation changes for mobile devices
 */
function handleOrientationChange() {
    const orientationMessage = document.getElementById('orientationMessage');
    const mobileControls = document.querySelector('.mobile-controls');
    
    if (window.innerHeight > window.innerWidth) {
        // Portrait mode on mobile
        if (orientationMessage) orientationMessage.style.display = 'flex';
        if (mobileControls) mobileControls.style.display = 'none';
    } else {
        // Landscape mode or desktop
        if (orientationMessage) orientationMessage.style.display = 'none';
        if (mobileControls) mobileControls.style.display = 'flex';
    }
}

/**
 * Loads the saved mute state from localStorage
 */
function loadMuteState() {
    // Load mute state on page load
    const savedMuteState = localStorage.getItem('elPolloLocoMuted');
    if (savedMuteState !== null) {
        isMuted = savedMuteState === 'true';
        const muteButton = document.getElementById('muteButton');
        if (muteButton) {
            muteButton.textContent = isMuted ? '🔊' : '🔇';
        }
    }
}

/**
 * Sets up click outside functionality for dialogs
 */
function setupClickOutside() {
    // Close dialogs when clicking outside
    document.addEventListener('click', (e) => {
        const dialogs = document.querySelectorAll('.dialog');
        dialogs.forEach(dialog => {
            if (!dialog.contains(e.target) && !e.target.closest('[data-dialog]')) {
                dialog.style.display = 'none';
            }
        });
    });
}

/**
 * Prevents context menu on mobile control buttons
 */
function preventContextMenu() {
    // Prevent context menu on mobile buttons
    const mobileButtons = document.querySelectorAll('.mobile-controls button');
    mobileButtons.forEach(button => {
        button.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    });
}

/**
 * Sets up keyboard event listeners
 */
function setupKeyboardEvents() {
    // Keyboard event listeners
    document.addEventListener('keydown', (e) => {
        if (world && world.keyboard) {
            switch(e.code) {
                case 'ArrowLeft':
                case 'KeyA':
                    world.keyboard.LEFT = true;
                    break;
                case 'ArrowRight':
                case 'KeyD':
                    world.keyboard.RIGHT = true;
                    break;
                case 'Space':
                    world.keyboard.SPACE = true;
                    break;
                case 'KeyD':
                    world.keyboard.D = true;
                    break;
            }
        }
    });

    document.addEventListener('keyup', (e) => {
        if (world && world.keyboard) {
            switch(e.code) {
                case 'ArrowLeft':
                case 'KeyA':
                    world.keyboard.LEFT = false;
                    break;
                case 'ArrowRight':
                case 'KeyD':
                    world.keyboard.RIGHT = false;
                    break;
                case 'Space':
                    world.keyboard.SPACE = false;
                    break;
                case 'KeyD':
                    world.keyboard.D = false;
                    break;
            }
        }
    });
}