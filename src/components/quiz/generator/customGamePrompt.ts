
export interface GamePromptOptions {
  topic: string;
  useCanvas?: boolean;
  language?: string;
  difficulty?: string;
  category?: string;
}

export const generateCustomGamePrompt = (options: GamePromptOptions): string => {
  const { 
    topic, 
    useCanvas = true, 
    language = 'en', 
    difficulty = 'medium',
    category = 'general'
  } = options;

  const basePrompt = `
Create an interactive HTML game based on: "${topic}"

**CRITICAL FORMATTING REQUIREMENTS:**
- You MUST return code in markdown format with SEPARATE \`\`\`html, \`\`\`css, and \`\`\`js blocks
- NEVER return a full HTML document - only return separate code blocks
- NEVER put all code on one line - use proper line breaks and indentation for EACH section
- Each HTML tag MUST be on its own line with proper indentation
- Each CSS rule MUST have properties on separate lines
- Each JavaScript function MUST have proper spacing and formatting
- Format exactly like professional code in a modern IDE
- Your code WILL be split into separate HTML, CSS, and JS files

**EXAMPLE FORMAT (MANDATORY):**

\`\`\`html
<div class="container">
  <h1>Game Title</h1>
  <div class="game-area">
    <!-- Game content -->
  </div>
</div>
\`\`\`

\`\`\`css
.container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.game-area {
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
}
\`\`\`

\`\`\`js
document.addEventListener('DOMContentLoaded', () => {
  // Game initialization
  const gameArea = document.querySelector('.game-area');
  
  function startGame() {
    console.log('Game started');
    // Game logic
  }
  
  startGame();
});
\`\`\`

**STRICT REQUIREMENTS:**
- Well-structured, modular code with init, update, render functions
- Use modern JavaScript (ES6+), no external libraries
- Clean, descriptive variable and function names
- Use semantic HTML5 with responsive layout
- Proper event handling and game state management
- Use localStorage if persistence is needed
${useCanvas ? '- Use HTML5 Canvas for rendering with proper sizing and efficient drawing' : ''}
- Smooth animations and transitions

**Game content must match:**
- Difficulty level: \`${difficulty}\`
- Category: \`${category}\`
- Language: \`${language === 'vi' ? 'Vietnamese' : 'English'}\`
`;

  return basePrompt;
};

export const getGameInstructionsByType = (gameType: string): string => {
  const instructions: Record<string, string> = {
    'memory': 'Create a memory matching card game with flippable cards',
    'quiz': 'Create a quiz game with multiple-choice questions',
    'puzzle': 'Create a sliding puzzle or jigsaw puzzle game',
    'typing': 'Create a typing practice game with word challenges',
    'math': 'Create a math practice game with arithmetic problems',
    'canvas': 'Create a canvas-based action or drawing game',
    'default': 'Create an engaging interactive game'
  };

  return instructions[gameType] || instructions.default;
};

export const getDifficultyInstructions = (level: string): string => {
  const difficultySettings: Record<string, string> = {
    'easy': 'Simple mechanics, clear instructions, slow pace, forgiving gameplay',
    'medium': 'Balanced difficulty, moderate complexity, standard pace',
    'hard': 'Complex mechanics, challenging puzzles, fast pace, precise timing required',
    'expert': 'Very difficult challenges, complex systems, requires strategic thinking'
  };

  return difficultySettings[level] || difficultySettings.medium;
};

export const getCategoryInstructions = (category: string): string => {
  const categorySettings: Record<string, string> = {
    'general': 'General knowledge content',
    'math': 'Mathematics and arithmetic content',
    'science': 'Science concepts and facts',
    'history': 'Historical events and figures',
    'geography': 'World geography and landmarks',
    'language': 'Language learning and vocabulary',
    'arts': 'Art, music, and creative content',
    'sports': 'Sports and physical activities'
  };

  return categorySettings[category] || categorySettings.general;
};
