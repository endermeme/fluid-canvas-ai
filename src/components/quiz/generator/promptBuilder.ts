
export const buildGeminiPrompt = (
  topic: string,
  useCanvas: boolean = true
): string => {
  const gameType = determineGameType(topic);
  const directHtmlPrompt = createDirectHtmlPrompt(topic, gameType, useCanvas);
  return directHtmlPrompt;
};

// Determine the appropriate game type based on topic keywords
function determineGameType(topic: string): string {
  const lowerTopic = topic.toLowerCase();
  
  if (lowerTopic.includes('quiz') || lowerTopic.includes('trivia')) {
    return 'quiz';
  } else if (lowerTopic.includes('memory') || lowerTopic.includes('matching')) {
    return 'memory';
  } else if (lowerTopic.includes('puzzle')) {
    return 'puzzle';
  } else if (lowerTopic.includes('word') || lowerTopic.includes('hangman')) {
    return 'word';
  } else if (lowerTopic.includes('math') || lowerTopic.includes('calculation')) {
    return 'math';
  } else if (lowerTopic.includes('reaction') || lowerTopic.includes('speed')) {
    return 'reaction';
  } else if (lowerTopic.includes('wheel') || lowerTopic.includes('fortune')) {
    return 'wheel';
  }
  
  return 'general';
}

// Create a prompt specifically for direct HTML generation
function createDirectHtmlPrompt(topic: string, gameType: string, useCanvas: boolean): string {
  const basePrompt = `Create an interactive HTML5 game about "${topic}".`;
  
  let specificInstructions = '';
  
  // Add game-type specific instructions
  if (gameType === 'quiz') {
    specificInstructions = 'Make a quiz game with multiple-choice questions and score tracking.';
  } else if (gameType === 'memory') {
    specificInstructions = 'Create a memory matching card game with flip animations.';
  } else if (gameType === 'puzzle') {
    specificInstructions = 'Design a puzzle game where pieces can be dragged and dropped into place.';
  } else if (gameType === 'word') {
    specificInstructions = 'Make a word game like hangman or word search related to the topic.';
  } else if (gameType === 'math') {
    specificInstructions = 'Create a math game with calculation challenges and a timer.';
  } else if (gameType === 'reaction') {
    specificInstructions = 'Design a reaction time game that tests player reflexes.';
  } else if (gameType === 'wheel') {
    specificInstructions = 'Create a spinning wheel game with different prize segments.';
  } else {
    specificInstructions = 'Make an engaging interactive game related to the topic.';
  }
  
  // Canvas specific instructions
  const canvasInstructions = useCanvas ? 
    'Use HTML5 Canvas for rendering graphics and animations.' : 
    'Use standard HTML elements for the game interface.';
  
  // Technical requirements
  const technicalRequirements = `
Technical requirements:
1. Generate a complete, self-contained HTML document with embedded CSS and JavaScript
2. Include responsive design that works on different screen sizes
3. Implement proper game mechanics with score tracking
4. Add visual feedback for user interactions
5. Include start/restart functionality
6. Use appropriate colors and layout for the theme
7. Implement proper error handling in JavaScript
${useCanvas ? '8. Use requestAnimationFrame for smooth canvas animations' : ''}

Your response should only contain the HTML code without any explanations or markdown formatting.
`;

  return `${basePrompt} ${specificInstructions} ${canvasInstructions} ${technicalRequirements}`;
}

export const getCanvasInstructions = (): string => {
  return `
    Canvas Game Development Guidelines:
    1. Efficient game loop implementation
    2. Dynamic canvas resizing
    3. Precise collision detection
    4. Optimized sprite animations
    5. State management techniques
    6. Performance-focused rendering
  `;
};
