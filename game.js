// Game version
const GAME_VERSION = '1.4.0';

// Game state
let tacos = 0;
let clickPower = 1;
let upgradeCost = 10;
let autoClickerCost = 50;
let autoClickers = 0;

// DOM elements
const counterElement = document.getElementById('counter');
const clickPowerElement = document.getElementById('clickPower');
const clickButton = document.getElementById('clickButton');
const upgradeButton = document.getElementById('upgradeClick');
const upgradeCostElement = document.getElementById('upgradeCost');
const autoClickerButton = document.getElementById('autoClickerButton');
const autoClickerCostElement = document.getElementById('autoClickerCost');
const resetButton = document.getElementById('resetButton');
const saveButton = document.getElementById('saveButton');
const saveStatus = document.getElementById('saveStatus');

// Format large numbers
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return Math.floor(num);
}

// Update display
function updateDisplay() {
    counterElement.textContent = formatNumber(tacos);
    clickPowerElement.textContent = formatNumber(clickPower);
    upgradeCostElement.textContent = formatNumber(upgradeCost);
    autoClickerCostElement.textContent = formatNumber(autoClickerCost);
    
    // Disable buttons if can't afford
    upgradeButton.disabled = tacos < upgradeCost;
    autoClickerButton.disabled = tacos < autoClickerCost;

    // Update title with taco count
    document.title = `${formatNumber(tacos)} Tacos - Super Taco Clicker`;
}

// Click handler with particle effect
clickButton.addEventListener('click', () => {
    tacos += clickPower;
    
    // Create click particle
    const particle = document.createElement('span');
    particle.textContent = '🌮 +' + formatNumber(clickPower);
    particle.style.position = 'absolute';
    particle.style.left = (event.clientX - 10) + 'px';
    particle.style.top = (event.clientY - 10) + 'px';
    particle.style.color = '#e67e22';
    particle.style.fontSize = '20px';
    particle.style.pointerEvents = 'none';
    particle.style.userSelect = 'none';
    particle.style.animation = 'particle 1s ease-out';
    document.body.appendChild(particle);

    setTimeout(() => particle.remove(), 1000);
    
    // Add click animation
    clickButton.style.transform = 'scale(0.95) translateY(2px)';
    setTimeout(() => {
        clickButton.style.transform = 'scale(1) translateY(0)';
    }, 100);
    
    updateDisplay();
});

// Upgrade click power
upgradeButton.addEventListener('click', () => {
    if (tacos >= upgradeCost) {
        tacos -= upgradeCost;
        clickPower += Math.ceil(clickPower * 0.2); // 20% increase
        upgradeCost = Math.floor(upgradeCost * 1.5);
        updateDisplay();
    }
});

// Buy auto clicker
autoClickerButton.addEventListener('click', () => {
    if (tacos >= autoClickerCost) {
        tacos -= autoClickerCost;
        autoClickers += 1;
        autoClickerCost = Math.floor(autoClickerCost * 1.5);
        updateDisplay();
    }
});

// Auto clicker function
setInterval(() => {
    if (autoClickers > 0) {
        tacos += autoClickers * 0.1;
        updateDisplay();
    }
}, 100);

// Add CSS animation for particles
const style = document.createElement('style');
style.textContent = `
@keyframes particle {
    0% {
        transform: translateY(0) scale(1);
        opacity: 1;
    }
    100% {
        transform: translateY(-50px) scale(1.5);
        opacity: 0;
    }
}`;
document.head.appendChild(style);

// Save game progress with visual feedback
function saveGame() {
    const gameState = {
        version: GAME_VERSION,
        tacos,
        clickPower,
        upgradeCost,
        autoClickerCost,
        autoClickers
    };
    localStorage.setItem('clickerGameSave', JSON.stringify(gameState));
    
    // Show save status
    saveStatus.textContent = 'Game Saved!';
    saveStatus.classList.add('show');
    setTimeout(() => {
        saveStatus.classList.remove('show');
    }, 2000);
}

// Reset game progress
function resetGame() {
    tacos = 0;
    clickPower = 1;
    upgradeCost = 10;
    autoClickerCost = 50;
    autoClickers = 0;
    localStorage.removeItem('clickerGameSave');
    updateDisplay();
    
    // Show reset status
    saveStatus.textContent = 'Game Reset!';
    saveStatus.style.color = '#ff4757';
    saveStatus.classList.add('show');
    setTimeout(() => {
        saveStatus.classList.remove('show');
        saveStatus.style.color = '#2ecc71';
    }, 2000);
}

// Add button listeners
resetButton.addEventListener('click', resetGame);
saveButton.addEventListener('click', saveGame);

// Auto-save game every 30 seconds
setInterval(saveGame, 30000);

// Save game when window closes
window.addEventListener('beforeunload', saveGame);

// Load game when page loads
function loadGame() {
    const savedGame = localStorage.getItem('clickerGameSave');
    if (savedGame) {
        const gameState = JSON.parse(savedGame);
        
        // Check if save is from an older version
        if (!gameState.version || gameState.version !== GAME_VERSION) {
            resetGame();
            return;
        }

        tacos = gameState.tacos || 0;
        clickPower = gameState.clickPower || 1;
        upgradeCost = gameState.upgradeCost || 10;
        autoClickerCost = gameState.autoClickerCost || 50;
        autoClickers = gameState.autoClickers || 0;
        updateDisplay();
    }
}

// Initialize the game
updateDisplay();
loadGame();