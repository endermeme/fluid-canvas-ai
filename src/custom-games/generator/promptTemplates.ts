
/**
 * Prompt templates for AI game generation
 */
import { GameSettingsData } from '../../types/game';

/**
 * Generate prompt for game creation
 */
export function generateGamePrompt(
  topic: string,
  settings: GameSettingsData,
  useCanvas: boolean = false
): string {
  const { difficulty = 'medium', questionCount = 10, category = 'general' } = settings;
  
  // Prepare info about devices and browsers
  const deviceInfo = useCanvas 
    ? "The game will be played in a canvas/iframe context, so make it work well as a standalone component."
    : "The game should work across different devices and browsers, including mobile.";
  
  // Base prompt template
  const prompt = `
Create an engaging interactive HTML web game about "${topic}". 

REQUIREMENTS:
- Create a SINGLE self-contained HTML file with embedded CSS and JavaScript
- The game should have clear instructions, interaction, and feedback
- Design should be clean, responsive, and visually appealing
- Code should be well-structured and commented
- Game difficulty level: ${difficulty}
- Number of questions/elements: ${questionCount}
- Category: ${category}
- ${deviceInfo}

Please include:
1. A title and brief intro
2. Clear instructions for gameplay
3. Interactive elements that work with mouse/touch
4. Scoring or progress tracking
5. Visual feedback for user actions
6. A completion state with results
7. Basic animations where appropriate

The game should be educational and fun, focused on the topic. Make sure to use modern CSS and JavaScript practices. Please respond only with valid code that will render in a browser directly.

Ensure the code is free of syntax errors and is contained within a single HTML file that includes all necessary CSS and JavaScript. The game should start automatically when loaded. Do not include markdown code blocks or explanations outside the code - just provide the functional HTML file.
`;

  return prompt;
}

/**
 * Generate prompt for quiz game
 */
export function generateQuizPrompt(
  topic: string,
  settings: GameSettingsData
): string {
  const { difficulty = 'medium', questionCount = 10, timePerQuestion = 30 } = settings;

  return `
Create an interactive quiz game about "${topic}".

REQUIREMENTS:
- Create a self-contained HTML file with embedded CSS and JavaScript
- Include ${questionCount} questions about ${topic}
- Difficulty level: ${difficulty}
- Time per question: ${timePerQuestion} seconds
- Multiple choice format with 4 options per question
- Include a scoring system
- Show correct answers after each question
- Display final score at the end
- Clean, responsive design with animations

The quiz should be educational, engaging and visually appealing. Please respond only with valid code that will render in a browser directly.
`;
}

/**
 * Generate prompt for matching game
 */
export function generateMatchingPrompt(
  topic: string, 
  settings: GameSettingsData
): string {
  const { difficulty = 'medium', questionCount = 8 } = settings;

  return `
Create a matching pairs/memory game about "${topic}".

REQUIREMENTS:
- Create a self-contained HTML file with embedded CSS and JavaScript
- Include ${questionCount} pairs related to ${topic}
- Difficulty level: ${difficulty}
- Timer and score tracking
- Animation for flipping cards
- Match verification
- Game completion state
- Responsive design that works on mobile

The game should involve matching related items (terms with definitions, images with labels, etc.) related to ${topic}. Please respond only with valid code that will render in a browser directly.
`;
}
