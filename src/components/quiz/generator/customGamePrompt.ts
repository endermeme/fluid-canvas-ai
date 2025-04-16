
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
    Create an interactive HTML game based on this prompt: "${topic}"

    STRICT CODE GENERATION REQUIREMENTS:
    - Produce fully functional HTML, CSS, and JavaScript code
    - Use modern JavaScript (ES6+) without external libraries
    - Implement proper event listeners and game mechanics
    - Ensure clean, readable code with meaningful variable and function names
    - Break down complex logic into focused functions
    - Maintain clean, concise code structure
    - Prioritize code readability and performance
    - Implement error handling gracefully
    - Ensure cross-browser compatibility
    - Create responsive design for various screen sizes
    - Avoid unnecessary global variables
    - Use semantic HTML5 elements
    - Implement proper game state management
    - DO NOT include comments in the code, use descriptive names instead
    
    PERFORMANCE AND BEST PRACTICES:
    - Use requestAnimationFrame for smooth animations
    - Optimize memory usage and prevent memory leaks
    - Handle user interactions efficiently
    - Implement proper input validation
    - Create intuitive user experience
    - Use local storage for persistent game state if needed

    ${useCanvas ? `
    CANVAS RENDERING REQUIREMENTS:
    - Use HTML5 Canvas for advanced graphics
    - Implement efficient rendering techniques
    - Handle canvas resizing dynamically
    - Create smooth, performant animations
    - Use sprite-based rendering when appropriate
    - Optimize canvas drawing operations` : ''}

    GAME STRUCTURE:
    - Clear initialization function
    - Modular game loop
    - Separate update and render functions
    - Implement game state tracking
    - Create reusable game object methods
    - Handle game start, progress, and end states
    - Make the game appropriate for ${difficulty} difficulty
    - Focus on ${category} category content

    LANGUAGE SETTINGS:
    - Use ${language === 'vi' ? 'Vietnamese' : 'English'} for all text and instructions

    OUTPUT FORMAT:
    Respond ONLY with complete, runnable HTML code for the game.
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
