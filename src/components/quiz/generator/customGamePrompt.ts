
/**
 * Interface for game prompt options
 */
export interface GamePromptOptions {
  difficulty?: 'easy' | 'medium' | 'hard';
  language?: string;
  ageGroup?: string;
  gameType?: string;
}

/**
 * Function to create a custom game prompt
 */
export function buildCustomGamePrompt(topic: string, useCanvas: boolean = true): string {
  return `Create an interactive educational game about "${topic}" 
${useCanvas ? 'that uses HTML Canvas for interactive graphics' : 'using simple HTML, CSS and JavaScript'}. 
The game should be educational, engaging, and suitable for students.`;
}

/**
 * Function to generate a custom game prompt with options
 */
export function generateCustomGamePrompt(topic: string, options: GamePromptOptions = {}, useCanvas: boolean = true): string {
  const { difficulty = 'medium', language = 'Vietnamese', ageGroup = 'general', gameType = 'quiz' } = options;
  
  return `Create an interactive educational ${gameType} about "${topic}" 
${useCanvas ? 'that uses HTML Canvas for interactive graphics' : 'using simple HTML, CSS and JavaScript'}.
Difficulty level: ${difficulty}
Primary language: ${language}
Target age group: ${ageGroup}
The game should be educational, engaging, and suitable for students.`;
}
