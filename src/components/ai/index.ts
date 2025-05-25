
// AI Game Generator - Entry point
export { 
  GameGenerator, 
  AIGameGenerator,
  generateGameFromTopic,
  generateGame,
  generateAlternativeGame
} from './gameGenerator';

export type { MiniGame, GameApiResponse, PromptOptions } from './types';

export { createFallbackGameHtml } from './gameProcessor';
export { createGamePrompt } from './promptManager';

// Tương thích với code cũ
export const tryGeminiGeneration = async (model: any, topic: string, settings?: any) => {
  const { generateGameFromTopic } = await import('./gameGenerator');
  return generateGameFromTopic(topic, settings);
};

export { default } from './gameGenerator';
