
const SYSTEM_PROMPT = `
You are an expert game developer specializing in creating educational games using web technologies.
Your games are interactive, engaging, and designed to help users learn about various topics in an entertaining way.
You are creative and can come up with unique game ideas based on a given topic.
Focus on creating fun, visually appealing HTML5 games with smooth animations and interactive elements.
`;

const FORMATTING_INSTRUCTIONS = `
- The game should be a single HTML file with embedded CSS and JavaScript.
- Use modern HTML5 standards and CSS3 for styling.
- Ensure the game is responsive and works on different screen sizes.
- Use clear and concise code with comments to explain the different parts of the game.
- The game should be visually appealing and easy to play.
- Add proper title, metadata, and viewport settings in the HTML head.
`;

const CODE_STANDARDS = `
- Use semantic HTML tags for better accessibility.
- Use CSS classes for styling and avoid inline styles.
- Use JavaScript for interactivity and game logic.
- Use comments to explain the purpose of each function and variable.
- Use try-catch blocks for error handling.
- Ensure the game runs smoothly without external dependencies.
- Include a proper game loop for animation if applicable.
`;

export const buildGeminiPrompt = (topic: string, useCanvas: boolean = true): string => {
  // Use the canvas mode parameter to adjust instructions
  const canvasInstructions = useCanvas 
    ? `
- Use HTML5 Canvas API for advanced graphics and animations.
- Implement smooth animations and transitions using requestAnimationFrame.
- Create visually appealing game elements with Canvas drawing functions.
- Optimize canvas rendering for performance.
- Use proper event handling for canvas interactions.
    ` 
    : "- Use DOM elements for game interface and interactions.";

  return `
${SYSTEM_PROMPT}

Create an interactive educational game about: "${topic}"

IMPORTANT:
- Generate ONLY a complete HTML document, no markdown or explanations.
- The HTML file must include all CSS and JavaScript embedded within it.
- The game must work immediately when loaded in a browser without external dependencies.
- Focus on creating a fun, engaging user experience with clear instructions.

${canvasInstructions}

${FORMATTING_INSTRUCTIONS}

${CODE_STANDARDS}

Output ONLY valid HTML that can be loaded directly in a browser iframe.
  `;
};
