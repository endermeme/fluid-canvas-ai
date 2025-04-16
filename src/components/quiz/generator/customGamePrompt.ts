
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

**STRICT REQUIREMENTS:**
- Format the code with proper indentation and line breaks for readability
- Output complete, runnable HTML code (HTML, CSS, JS combined) with proper formatting
- Use modern JavaScript (ES6+), no external libraries
- Clean, readable, maintainable code with descriptive names
- Strictly modular structure: init, update, render, game loop
- Use semantic HTML5, responsive layout
- No global variables unless absolutely needed
- Implement proper event handling, game state management, and error handling
- Optimize for cross-browser compatibility and performance
- Input validation and user-friendly interactions
- Use localStorage if persistence is needed
- Use HTML5 Canvas
- Efficient rendering, sprite optimization, dynamic resizing
- Smooth animation via requestAnimationFrame

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
