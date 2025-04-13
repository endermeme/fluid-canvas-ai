
import { GameSettingsData } from '../types';
import { getGameSpecificInstructions, getSettingsPrompt } from './gameInstructions';
import { getImageInstructions } from './imageInstructions';

/**
 * Builds a complete prompt for the Gemini API based on game parameters
 * @param topic The topic of the game
 * @param gameTypeId Optional game type ID
 * @param settings Optional game settings
 * @param useCanvas Whether to use canvas mode for HTML game generation
 * @returns Complete prompt string for Gemini API
 */
export const buildGeminiPrompt = (
  topic: string, 
  gameTypeId: string | undefined, 
  settings?: GameSettingsData,
  useCanvas: boolean = false
): string => {
  const gameSpecificInstructions = getGameSpecificInstructions(gameTypeId, topic);
  const settingsPrompt = getSettingsPrompt(settings);
  const imageInstructions = getImageInstructions();
  const canvasInstructions = getCanvasInstructions();

  return `
    # 🎮 Interactive Education Game Generator – All-in-One HTML File

    ## 🎯 Objective
    Generate a fully self-contained interactive educational game based on the topic: "${topic}".

    ---

    ## ✅ Core Requirements
    - All in **one HTML file** (HTML, CSS, JS inline)
    - **No external libraries**, only **Vanilla JavaScript**
    - Responsive layout (works on desktop & mobile)
    - Valid HTML5 structure
    - JavaScript must run after \`DOMContentLoaded\`
    - Use \`try-catch\` and validate all inputs
    - **Include a timer** for the game (both per question and total game time)
    - **Track player score** and provide final results

    ---

    ## 🎓 Game Logic
    - Consider multiple formats: quiz, flashcards, matching, memory, ordering, word search, etc.
    - Provide clear instructions to players
    - Implement proper time management (countdown timers)
    - Show **instant feedback** (right/wrong + highlight correct)
    - Track score and display final result with a performance message
    - Allow players to restart the game

    ---

    ${gameSpecificInstructions}

    ---

    ${useCanvas ? canvasInstructions : ''}

    ---

    ## ⏱️ Time Management Requirements
    - Include per-question timer where appropriate (e.g., quiz, pictionary)
    - Include total game timer for all games
    - Add time settings in the JSON output:
      \`\`\`json
      "settings": {
        "timePerQuestion": 30,
        "totalTime": 300,
        "timeLimit": 180,
        "bonusTimePerCorrect": 5
      }
      \`\`\`
    - Adjust timer difficulty based on game type and settings
    - Show remaining time visually to the player

    ---

    ## 🖼️ Image Instructions (CRITICAL)
    - NEVER include actual image URLs in your response
    - For games requiring images (like Pictionary), ONLY provide specific search terms for each item
    - DO NOT use 'imageUrl' in your JSON - instead use 'imageSearchTerm'
    - Example format for image questions:
      \`\`\`json
      {
        "imageSearchTerm": "red apple fruit detailed",
        "answer": "Apple",
        "options": ["Banana", "Apple", "Orange", "Grape"],
        "hint": "Keeps the doctor away"
      }
      \`\`\`
    - Make search terms very specific (e.g., "red apple fruit" not just "apple")
    - Our system will handle all image fetching from Pixabay API using your search terms
    - Search terms should be in English for best results, even for non-English games

    ${imageInstructions}

    ---

    ## ⚠️ Common Mistakes to Avoid
    - Don't use broken or undefined variables
    - Ensure all event listeners are properly attached
    - Avoid unnecessary DOM manipulation or deeply nested loops
    - Prevent layout overflow or broken UI on small screens
    - Always handle errors with \`try-catch\`
    - Escape all special characters properly in JSON output
    - NEVER include actual image URLs in your response
    - Don't forget to implement both per-question and total game timers

    ---

    ${settingsPrompt}

    ---

    ## 📤 Output Format
    Return a **valid JSON object**:

    \`\`\`json
    {
      "title": "Game Title",
      "description": "Short game description",
      "content": "A full, escaped HTML document string (\\\\", \\\\\\\\ escaped properly)"
    }
    \`\`\`
  `;
};

/**
 * Gets specific instructions for Canvas-based HTML5 games
 * @returns Canvas-specific instructions as a string
 */
export const getCanvasInstructions = (): string => {
  return `
    ## 🎨 Canvas-Specific Requirements (Gemini 2.5 Pro)
    
    Your game MUST use HTML5 Canvas as the primary rendering approach:
    
    1. **Canvas Setup**
      - Create a responsive canvas that fills most of the viewport
      - Handle window resize events to adjust canvas dimensions
      - Set appropriate width and height attributes AND style properties
      - Example:
        \`\`\`html
        <canvas id="gameCanvas" width="800" height="600"></canvas>
        \`\`\`
        \`\`\`js
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        
        // Make canvas responsive
        function resizeCanvas() {
          canvas.width = window.innerWidth * 0.9;
          canvas.height = window.innerHeight * 0.8;
          // Redraw everything after resize
          draw();
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas(); // Initial sizing
        \`\`\`
    
    2. **Game Loop Implementation**
      - Use requestAnimationFrame for smooth animation
      - Implement a proper game loop with update and render functions
      - Track time between frames for consistent movement
      - Example:
        \`\`\`js
        let lastTime = 0;
        function gameLoop(timestamp) {
          const deltaTime = timestamp - lastTime;
          lastTime = timestamp;
          
          // Clear canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // Update game state
          update(deltaTime);
          
          // Render game objects
          render();
          
          // Continue loop
          requestAnimationFrame(gameLoop);
        }
        requestAnimationFrame(gameLoop);
        \`\`\`
    
    3. **Drawing and Rendering**
      - Use appropriate canvas methods (fillRect, drawImage, etc.)
      - Implement sprite/asset management if needed
      - Create visual effects using canvas gradient, shadow, and composition operations
      - Ensure smooth animations by properly calculating position changes
      - Example:
        \`\`\`js
        function render() {
          // Draw background
          ctx.fillStyle = 'skyblue';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Draw player
          ctx.fillStyle = 'red';
          ctx.beginPath();
          ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
          ctx.fill();
          
          // Draw text
          ctx.font = '24px Arial';
          ctx.fillStyle = 'black';
          ctx.fillText(\`Score: \${score}\`, 20, 40);
        }
        \`\`\`
    
    4. **Input Handling for Canvas Games**
      - Track mouse position relative to canvas
      - Handle click, touch, and key events appropriately
      - Account for canvas position and scaling
      - Example:
        \`\`\`js
        // Get canvas-relative coordinates
        function getMousePos(canvas, evt) {
          const rect = canvas.getBoundingClientRect();
          return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
          };
        }
        
        canvas.addEventListener('click', function(e) {
          const mousePos = getMousePos(canvas, e);
          checkCollisions(mousePos);
        });
        
        document.addEventListener('keydown', function(e) {
          // Handle keyboard input
          if (e.key === 'ArrowRight') player.moveRight();
          if (e.key === 'ArrowLeft') player.moveLeft();
        });
        \`\`\`
    
    5. **Performance Optimization**
      - Limit canvas operations for better performance
      - Use off-screen canvases for complex, static elements
      - Implement object pooling for repetitive elements
      - Only redraw elements that have changed when possible
      - Example:
        \`\`\`js
        // Create off-screen canvas for background
        const bgCanvas = document.createElement('canvas');
        const bgCtx = bgCanvas.getContext('2d');
        bgCanvas.width = canvas.width;
        bgCanvas.height = canvas.height;
        
        // Draw complex background once
        function drawBackground() {
          // Draw complex background on bgCanvas
          // ...
        }
        
        // In main render, just draw the pre-rendered background
        function render() {
          ctx.drawImage(bgCanvas, 0, 0);
          // Draw dynamic elements
          // ...
        }
        \`\`\`
    
    6. **Collision Detection**
      - Implement appropriate collision detection for game objects
      - For simple games, use bounding box/circle collision
      - For complex games, implement spatial partitioning or other optimization
      - Example:
        \`\`\`js
        function checkCollision(obj1, obj2) {
          // Circle collision
          const dx = obj1.x - obj2.x;
          const dy = obj1.y - obj2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          return distance < obj1.radius + obj2.radius;
        }
        \`\`\`
  `;
};
