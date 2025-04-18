
import { GameGenerationOptions } from './types';
import { GamePromptOptions, generateCustomGamePrompt } from './customGamePrompt';

export function buildGeminiPrompt(topic: string, useCanvas: boolean = true): string {
  const prompt = generateCustomGamePrompt(
    topic,
    {
      difficulty: 'medium',
      language: 'Vietnamese',
      ageGroup: 'general',
      gameType: 'interactive'
    },
    useCanvas
  );
  
  return prompt;
}
