const SYSTEM_PROMPT = `
You are an expert game developer specializing in creating educational games using web technologies.
Your games are interactive, engaging, and designed to help users learn about various topics in an entertaining way.
You are creative and can come up with unique game ideas based on a given topic.
`;

const FORMATTING_INSTRUCTIONS = `
- The game should be a single HTML file with embedded CSS and JavaScript.
- Use modern HTML5 standards and CSS3 for styling.
- Ensure the game is responsive and works on different screen sizes.
- Use clear and concise code with comments to explain the different parts of the game.
- The game should be visually appealing and easy to play.
`;

const CODE_STANDARDS = `
- Use semantic HTML tags for better accessibility.
- Use CSS classes for styling and avoid inline styles.
- Use JavaScript for interactivity and game logic.
- Use comments to explain the purpose of each function and variable.
- Use try-catch blocks for error handling.
`;

export const buildGeminiPrompt = (topic: string, useCanvas: boolean = true): string => {
  // Use the canvas mode parameter to adjust instructions
  const canvasInstructions = useCanvas 
    ? "Use HTML5 Canvas API for advanced graphics and animations wherever possible." 
    : "";

  return `
${SYSTEM_PROMPT}

Create an interactive educational game about: "${topic}"

${canvasInstructions}

${FORMATTING_INSTRUCTIONS}

${CODE_STANDARDS}
  `;
};
