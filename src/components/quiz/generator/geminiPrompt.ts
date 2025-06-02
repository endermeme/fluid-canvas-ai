import { PromptOptions } from './types';

export const createGameGenerationPrompt = (options: PromptOptions): string => {
  const { topic, useCanvas = true, language = 'en', difficulty = 'medium', category = 'general' } = options;
  
  const gamePrompt = `Create an interactive ${topic} game with the following specifications:

**Game Requirements:**
- Topic: ${topic}
- Difficulty: ${difficulty}
- Language: ${language}
- Category: ${category}
- Canvas Mode: ${useCanvas ? 'Enabled' : 'Disabled'}

**Technical Requirements:**
- Create a complete HTML page with embedded CSS and JavaScript
- Use modern web technologies (HTML5, CSS3, ES6+)
- Responsive design that works on both desktop and mobile
- Interactive elements and engaging gameplay
- Clear instructions and feedback for users
- Score tracking and game completion detection

**Output Format:**
Please provide a complete, standalone HTML file that includes:
1. DOCTYPE declaration
2. Proper HTML structure
3. Embedded CSS styles
4. JavaScript functionality
5. Game logic and interactivity

The game should be immediately playable when loaded in a browser.`;

  return gamePrompt;
};
