
/**
 * Builds a prompt for generating HTML games
 * @param topic The topic of the game
 * @param useCanvas Whether to use canvas mode for HTML game generation
 * @returns Complete prompt string
 */
export const buildGeminiPrompt = (
  topic: string,
  useCanvas: boolean = true
): string => {
  const basePrompt = `
    Create an interactive HTML game based on this prompt: "${topic}"

    Your response should be a complete HTML file that includes CSS and JavaScript.
    
    IMPORTANT JAVASCRIPT REQUIREMENTS:
    - All JavaScript code MUST be fully functional without external libraries
    - Use modern JavaScript (ES6+) with proper error handling
    - Implement proper event listeners and game functionality
    - Use proper JavaScript scope and avoid global variables when possible
    - Include a scoring system that works correctly
    - Make sure all JavaScript references to HTML elements work correctly
    - Use requestAnimationFrame for animations
    - Include comments explaining the code
    
    BROWSER COMPATIBILITY:
    - Ensure the game works on modern browsers (Chrome, Firefox, Safari)
    - Use only standard Web APIs (no browser-specific features)
    - Test your code logic to ensure it's error-free
    
    ADDITIONAL REQUIREMENTS:
    - Make the game visually appealing with proper styling
    - Include clear game instructions for the player
    - Implement proper gameplay feedback (sounds, visual effects)
    - Ensure all game elements are positioned properly
    - Make the game responsive to work on different screen sizes
    - Add proper error handling to prevent crashes
    - Use local assets (don't depend on external URLs)

    RESPONSE FORMAT:
    You must respond ONLY with the complete HTML code for the game, nothing else.
  `;
  
  if (useCanvas) {
    return `${basePrompt}
    
    HTML5 CANVAS REQUIREMENTS:
    - Use HTML5 Canvas as the primary rendering approach for better graphics and animations
    - Implement proper canvas context (2d) initialization
    - Create a game loop with requestAnimationFrame
    - Handle canvas resizing properly for different screen sizes
    - Implement mouse/touch events specifically for canvas elements
    - Draw and update all game elements on the canvas
    - Clear the canvas before each frame redraw
    - Implement proper collision detection if needed
    - Use sprite-based animation if appropriate
    - Set canvas dimensions based on the viewport
    
    CANVAS CODE STRUCTURE:
    - Initialize the canvas and context
    - Define game objects and their properties
    - Create update and render functions
    - Implement a game loop with requestAnimationFrame
    - Handle user input (keyboard, mouse, touch)
    - Implement collision detection if needed
    - Track and display score/game state
    
    Here's a basic structure to follow:
    
    ```javascript
    // Initialize canvas
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    
    // Game objects and variables
    let score = 0;
    let gameObjects = [];
    
    // Update game state
    function update(deltaTime) {
      // Update game objects
    }
    
    // Render game objects
    function render() {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw game objects
    }
    
    // Game loop
    let lastTime = 0;
    function gameLoop(timestamp) {
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;
      
      update(deltaTime);
      render();
      
      requestAnimationFrame(gameLoop);
    }
    
    // Handle input
    function handleInput() {
      // Input handling code
    }
    
    // Initialize game
    function init() {
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
      // Set up event listeners
      
      // Start game loop
      requestAnimationFrame(gameLoop);
    }
    
    // Start the game
    init();
    ```
    `;
  } else {
    return `${basePrompt}
    
    DOM-BASED GAME REQUIREMENTS:
    - Use HTML elements and DOM manipulation for game objects
    - Implement proper event listeners for user interaction
    - Use CSS animations and transitions for visual effects
    - Structure HTML elements logically for game components
    - Use JavaScript to dynamically create and update game elements
    - Implement proper state management for game progress
    
    DOM CODE STRUCTURE:
    - Define HTML elements for game components
    - Use CSS for styling and animations
    - Implement JavaScript for game logic and DOM manipulation
    - Handle user input through event listeners
    - Update game state and UI accordingly
    - Track and display score/game state
    
    Here's a basic structure to follow:
    
    ```javascript
    // Game variables
    let score = 0;
    let gameRunning = false;
    
    // DOM elements
    const gameContainer = document.getElementById('game-container');
    const scoreDisplay = document.getElementById('score-display');
    
    // Initialize game
    function initGame() {
      // Set up game elements
      
      // Add event listeners
      
      // Start game
      startGame();
    }
    
    // Game logic
    function startGame() {
      gameRunning = true;
      updateScore(0);
      
      // Start game loop or set up timers
    }
    
    // Update score
    function updateScore(points) {
      score += points;
      scoreDisplay.textContent = score;
    }
    
    // Event handlers
    function handleInput(event) {
      // Handle user input
    }
    
    // Initialize on load
    document.addEventListener('DOMContentLoaded', initGame);
    ```
    `;
  }
};

/**
 * Gets specific instructions for Canvas-based HTML5 games
 * @returns Canvas-specific instructions as a string
 */
export const getCanvasInstructions = (): string => {
  return `
    For Canvas-based games:
    
    1. Create a game loop using requestAnimationFrame
    2. Handle canvas resizing for different screen sizes
    3. Implement proper collision detection
    4. Use sprite-based animation for game objects
    5. Clear the canvas before each frame redraw
    6. Track and display game state (score, lives, etc.)
  `;
};
