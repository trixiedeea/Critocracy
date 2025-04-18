// Main entry point for Critocracy game

import { initializeUI, setupPlayerCountUI } from './ui.js';
import { setupBoard } from './board.js'; 
import './animations.js'; // Import animations module
import { setupDecks } from './cards.js';
import { initLogging } from './logging.js';
import { getGameState } from './game.js';

// Initialize the UI when the DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    console.log("DOM fully loaded. Initializing Critocracy UI...");

    try {
        // Initialize logging first to capture all events
        initLogging();
        console.log("Logging system initialized");
        
        // Ensure the start screen is visible first - with inline styles for maximum compatibility
        document.querySelectorAll('.screen').forEach(screen => {
            screen.style.display = 'none';
            screen.classList.remove('active');
            screen.style.opacity = '0';
        });
        
        const startScreen = document.getElementById('start-screen');
        if (startScreen) {
            startScreen.style.display = 'flex';
            startScreen.classList.add('active');
            startScreen.style.opacity = '1';
            startScreen.style.zIndex = '100';
            console.log("Start screen set to display:flex, active, opacity:1");
        } else {
            console.error("Start screen element not found!");
        }
        
        // 1. Initialize Board Module (Load images, set up canvas)
        const boardReady = await setupBoard(); 
        if (!boardReady) {
            throw new Error("Board module failed to initialize (images/canvas).");
        }
        console.log("Board setup complete");
        
        // 2. Initialize card decks
        const decksReady = await setupDecks();
        if (!decksReady) {
            throw new Error("Card decks failed to initialize.");
        }
        console.log("Card decks initialized");

        // 3. Initialize UI (Setup screens, event listeners)
        const uiReady = initializeUI();
        if (!uiReady) {
            throw new Error("UI failed to initialize.");
        }
        console.log("UI initialization complete");
        
        // 4. Check all core systems are ready
        const gameState = getGameState();
        console.log("Current game state:", gameState.gamePhase);
        
        console.log("Critocracy UI ready. Setting up automatic transition to player count screen...");
        
        // Define the function to show player count screen
        function showPlayerCountScreen() {
            console.log("Showing player count screen...");
            
            // Set up player count UI
            setupPlayerCountUI();
            
            // Show player count screen with direct DOM manipulation for reliability
            const playerCountScreen = document.getElementById('player-count-screen');
            if (playerCountScreen) {
                // Hide all screens first
                document.querySelectorAll('.screen').forEach(screen => {
                    screen.style.display = 'none';
                    screen.classList.remove('active');
                    screen.style.opacity = '0';
                });
                
                // Show player count screen
                playerCountScreen.style.display = 'flex';
                playerCountScreen.classList.add('active');
                playerCountScreen.style.opacity = '1';
                playerCountScreen.style.zIndex = '100';
                console.log("Player count screen displayed");
            } else {
                console.error("Player count screen element not found!");
            }
        }
        
        // Set up automatic transition to player count screen after delay
        let autoTransitionTimeout = setTimeout(() => {
            showPlayerCountScreen();
        }, 3000); // 3 second delay
        
        // Also keep the manual button for users who want to skip the wait
        const startGameBtn = document.getElementById('start-game-btn');
        if (startGameBtn) {
            // Remove existing event listeners
            const newStartBtn = startGameBtn.cloneNode(true);
            startGameBtn.parentNode.replaceChild(newStartBtn, startGameBtn);
            
            // Add our new event listener for manual transition
            newStartBtn.addEventListener('click', () => {
                console.log("Start button clicked - going directly to player count screen");
                clearTimeout(autoTransitionTimeout); // Cancel auto-transition
                showPlayerCountScreen();            // Go directly to player count
            });
        } else {
            console.error("Start game button not found!");
        }
        
    } catch (error) {
        console.error("CRITICAL ERROR during initial setup:", error);
        // Display a user-friendly error message
        const body = document.querySelector('body');
        if (body) {
             body.innerHTML = '<div style="color: red; padding: 20px; background: black;"><h1>Setup Error</h1><p>Could not prepare the game interface. Please check the console (F12) for details and try refreshing.</p><p>Error: ' + error.message + '</p></div>';
        }
    }
});