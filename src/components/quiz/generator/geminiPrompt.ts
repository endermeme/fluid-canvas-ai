/**
 * Prompt template để tạo game từ Gemini API
 */

export const GEMINI_HTML_FORMAT_INSTRUCTIONS = `
IMPORTANT FORMATTING RULES (FOLLOW THESE EXACTLY):
1. Your answer MUST be a COMPLETE, VALID HTML document with proper DOCTYPE declaration.
2. Place ALL JavaScript in a SINGLE <script> tag at the END of the body section.
3. Place ALL CSS in a SINGLE <style> tag in the head section.
4. Use modern JavaScript (ES6+) with proper syntax and error handling.
5. DO NOT use external dependencies or CDN links.
6. DO NOT use markdown code blocks (\`\`\` or ~~~) in your response.
7. Make the game FULLY INTERACTIVE and TOUCH-FRIENDLY for mobile devices.
8. Include clear instructions for players directly in the game UI.
9. Make the game centered and responsive for both desktop and mobile.
10. Include a title and game description in the HTML.

EXAMPLE CODE STRUCTURE:
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Game Title</title>
  <style>
    /* ALL CSS HERE */
  </style>
</head>
<body>
  <!-- Game HTML here -->
  
  <script>
    // ALL JavaScript code here
  </script>
</body>
</html>
`;

export const GEMINI_IMAGES_INSTRUCTIONS = `
WHEN USING IMAGES IN GAMES, FOLLOW THESE RULES:
1. Always provide BOTH methods for images:
   a) A placeholder Base64 image (small, valid, properly formatted)
   b) A fallback URL to a placeholder image

2. CORRECT Way to Use Base64 Images:
   <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAS0lEQVR4AWP4//8/RRirICkYQQ6gaCA2YMkLzw6gGMurV68OoCjgdQCpGMUB5GIMAYocQAmGOwCbeICRiA2jQUgyHk1EIzmRkIwB+U5/FS9tKasAAAAASUVORK5CYII=" 
        alt="Description"
        onerror="this.onerror=null; this.src='https://placehold.co/100x100/orange/white?text=Fallback';" />

3. Always include error handling for images that fail to load with the onerror attribute.

4. For game data arrays with images, use this structure:
   const gameData = [
     {
       imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
       fallbackSrc: "https://placehold.co/200x200/blue/white?text=Item1",
       text: "Item 1"
     },
     // more items
   ];

5. When displaying images from game data:
   <img src="\${item.imageSrc}" alt="\${item.text}" onerror="this.onerror=null; this.src='\${item.fallbackSrc}';" />
`;

export const GEMINI_CANVAS_INSTRUCTIONS = `
CANVAS IMPLEMENTATION RULES:
1. Use proper error handling for canvas operations:
   - Check if context is available after calling getContext
   - Include proper bounds checking in drawing functions
2. Add window resize handlers to keep canvas responsive
3. Use requestAnimationFrame for animations
4. Include touch events for mobile compatibility
5. Use proper scaling for high-DPI screens

EXAMPLE CANVAS INITIALIZATION:
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
if (!ctx) {
  console.error('Canvas rendering context not available');
  document.body.innerHTML = '<p>Your browser does not support canvas</p>';
  return;
}

// Set proper canvas dimensions
function resizeCanvas() {
  const container = canvas.parentElement;
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;
  
  // Re-draw after resize
  drawGame();
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
`;

export function createGameGenerationPrompt(options: {
  topic: string;
  useCanvas?: boolean;
  language?: string;
  difficulty?: string;
  category?: string;
}): string {
  const { topic, useCanvas = true, language = 'en', difficulty = 'medium', category = 'general' } = options;
  
  let prompt = `Create an interactive HTML5 mini-game about "${topic}" for educational purposes.

${GEMINI_HTML_FORMAT_INSTRUCTIONS}

${GEMINI_IMAGES_INSTRUCTIONS}

Game Requirements:
- Difficulty level: ${difficulty}
- Category: ${category}
- Main language: ${language}
- Use ${useCanvas ? 'HTML5 Canvas' : 'DOM manipulation'} for the game
- Make the game educational and fun
- Include clear instructions for players
- Add scoring and progress tracking
- Design the game to be visually appealing with good colors
- Make it responsive for both desktop and mobile
- All images should be base64 encoded with fallback URLs
${useCanvas ? GEMINI_CANVAS_INSTRUCTIONS : ''}

IMPORTANT: Return ONLY the complete HTML document. Do not include any explanation, commentary, or markdown syntax around your code.
`;

  return prompt;
}

export default createGameGenerationPrompt; 