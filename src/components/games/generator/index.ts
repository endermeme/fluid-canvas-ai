/**
 * Game Generator - Entry point
 * 
 * Module này xuất tất cả các thành phần cần thiết từ Game Generator
 */

// Xuất các class và hàm chính
export { 
  GameGenerator, 
  AIGameGenerator,
  generateGameFromTopic 
} from './gameGenerator';

// Xuất các types
export type { MiniGame, GameApiResponse, PromptOptions } from './types';

// Re-export các utility functions
export { createFallbackGameHtml } from './gameProcessor';
export { createGamePrompt } from './promptManager';

// Tương thích với code cũ
export const tryGeminiGeneration = async (model: any, topic: string, settings?: any) => {
  // Re-route sang hàm mới tương đương
  const { generateGameFromTopic } = await import('./gameGenerator');
  return generateGameFromTopic(topic, settings);
};

// Re-export the default export
export { default } from './gameGenerator'; 