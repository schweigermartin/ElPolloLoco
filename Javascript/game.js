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
    document.getElementById('startGameBtn').addEventListener('click', startGame);
    document.getElementById('showGameExplanationBtn').addEventListener('click', () => showDialog('gameExplanationDialog'));
    document.getElementById('showControlsBtn').addEventListener('click', () => showDialog('controlsDialog'));
    document.getElementById('showStoryBtn').addEventListener('click', () => showDialog('storyDialog'));
    document.getElementById('showImpressumBtn').addEventListener('click', () => showDialog('impressumDialog'));
    
    // Game over buttons
    document.getElementById('restartBtn').addEventListener('click', restartGame);
    document.getElementById('backToMenuBtn').addEventListener('click', backToMenu);
    
    // Mute button
    document.getElementById('muteBtn').addEventListener('click', toggleMute);
    
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
 * Shows the game over screen with appropriate message based on win/loss
 * @param {boolean} won - Whether the player won the game
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
 * Shows the game over image for a few seconds before showing the game over screen
 */
function showGameOverImage() {
    // Check if overlay already exists
    if (document.getElementById('gameOverImageOverlay')) {
        return;
    }
    
    // Create overlay for the game over image
    const gameOverOverlay = document.createElement('div');
    gameOverOverlay.id = 'gameOverImageOverlay';
    gameOverOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2500;
        backdrop-filter: blur(5px);
    `;
    
    // Create image element
    const gameOverImage = document.createElement('img');
    gameOverImage.src = 'img/9_intro_outro_screens/game_over/oh no you lost!.png';
    gameOverImage.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        object-fit: contain;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    `;
    
    gameOverOverlay.appendChild(gameOverImage);
    document.body.appendChild(gameOverOverlay);
    
    // Remove image after 3 seconds and show game over screen
    setTimeout(() => {
        if (document.body.contains(gameOverOverlay)) {
            document.body.removeChild(gameOverOverlay);
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
 * Toggles the mute state and updates the button text accordingly
 */
function toggleMute() {
    isMuted = !isMuted;
    const muteBtn = document.getElementById('muteBtn');
    muteBtn.textContent = isMuted ? 'Mute' : 'Sound';
    
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
 * Handles orientation changes and shows/hides appropriate content based on device orientation
 */
function handleOrientationChange() {
    const gameContainer = document.getElementById('gameContainer');
    const portraitWarning = document.getElementById('portraitWarning');
    
    if (window.innerWidth <= 768 && window.innerHeight > window.innerWidth) {
        // Portrait mode on mobile
        gameContainer.style.display = 'none';
        portraitWarning.style.display = 'flex';
    } else {
        // Landscape mode or desktop
        portraitWarning.style.display = 'none';
        if (isGameRunning) {
            gameContainer.style.display = 'block';
        }
    }
}

// Load mute state on page load
window.addEventListener('load', () => {
    const savedMuteState = localStorage.getItem('elPolloLocoMuted');
    if (savedMuteState !== null) {
        isMuted = savedMuteState === 'true';
        const muteBtn = document.getElementById('muteBtn');
        muteBtn.textContent = isMuted ? 'Mute' : 'Sound';
    }
});

// Close dialogs when clicking outside
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('dialog-overlay')) {
        e.target.style.display = 'none';
    }
});

// Prevent context menu on mobile buttons
document.addEventListener('contextmenu', (e) => {
    if (e.target.classList.contains('mobile-btn')) {
        e.preventDefault();
    }
});

// Keyboard event listeners
window.addEventListener('keydown', (event) => {
    if (event.key == 'ArrowRight') {
        if (world && world.keyboard) world.keyboard.RIGHT = true;
    }
    if (event.key == 'ArrowLeft') {
        if (world && world.keyboard) world.keyboard.LEFT = true;
    }
    if (event.key == 'ArrowUp') {
        if (world && world.keyboard) world.keyboard.UP = true;
    }
    if (event.key == 'ArrowDown') {
        if (world && world.keyboard) world.keyboard.DOWN = true;
    }
    if (event.key == ' ') {
        if (world && world.keyboard) world.keyboard.SPACE = true;
    }
    if (event.key == 'd' || event.key == 'D' || event.key == 'x' || event.key == 'X') {
        if (world && world.keyboard) world.keyboard.D = true;
    }
});

window.addEventListener('keyup', (event) => {
    if (event.key == 'ArrowRight') {
        if (world && world.keyboard) world.keyboard.RIGHT = false;
    }
    if (event.key == 'ArrowLeft') {
        if (world && world.keyboard) world.keyboard.LEFT = false;
    }
    if (event.key == 'ArrowUp') {
        if (world && world.keyboard) world.keyboard.UP = false;
    }
    if (event.key == 'ArrowDown') {
        if (world && world.keyboard) world.keyboard.DOWN = false;
    }
    if (event.key == ' ') {
        if (world && world.keyboard) world.keyboard.SPACE = false;
    }
    if (event.key == 'd' || event.key == 'D' || event.key == 'x' || event.key == 'X') {
        if (world && world.keyboard) world.keyboard.D = false;
    }
});