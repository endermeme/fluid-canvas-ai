
import { MiniGame } from './types';
import { GameSettingsData } from '../types';
import { getGameTypeByTopic } from '../gameTypes';
import { logInfo, logError, logWarning, logSuccess, measureExecutionTime } from './apiUtils';
import { makeGeminiRequest } from './api/geminiClient';
import { sanitizeGameCode } from './utils/codeSanitizer';
import { extractGameContent } from './utils/contentExtractor';
import { buildGeminiPrompt } from './promptBuilder';
import { generateCustomGamePrompt } from './customGamePrompt';

const SOURCE = "GEMINI";

export const generateWithGemini = async (
  topic: string, 
  settings?: GameSettingsData
): Promise<MiniGame | null> => {
  const gameType = getGameTypeByTopic(topic);
  const useCanvas = settings?.useCanvas !== undefined ? settings.useCanvas : true;
  
  logInfo(SOURCE, `Starting game generation for "${topic}"`, {
    type: gameType?.name || "Not specified",
    settings: settings || {},
    canvasMode: useCanvas ? "enabled" : "disabled"
  });

  const promptOptions = {
    topic,
    useCanvas,
    language: settings?.language || 'en',
    difficulty: settings?.difficulty || 'medium',
    category: settings?.category || 'general'
  };

  const formattingInstructions = `
IMPORTANT CODE FORMATTING INSTRUCTIONS:
1. Return a SINGLE, complete, self-contained HTML file with all CSS and JavaScript included
2. Use proper HTML structure with DOCTYPE, html, head, and body tags
3. Include all JavaScript inside a SINGLE script tag at the end of the body
4. Format all CSS and JavaScript code with proper indentation
5. Use template literals correctly with backticks (\\\`) not regular quotes for dynamic content
6. Use clear parameter names in function declarations (NOT $2 or placeholder variables)
7. Include proper error handling for canvas operations
8. Make sure all HTML elements are properly closed
9. DO NOT include markdown syntax (\\\`\\\`\\\`) in your response
`;

  const prompt = generateCustomGamePrompt(promptOptions) + formattingInstructions;

  try {
    const startTime = Date.now();
    
    const { text } = await makeGeminiRequest({ prompt });
    
    const duration = measureExecutionTime(startTime);
    logSuccess(SOURCE, `Response received in ${duration.seconds}s`);
    
    console.log('%c Generated Game Code:', 'font-weight: bold; color: #6f42c1;');
    console.log(text);
    
    const game = extractGameContent(text, topic, useCanvas);
    game.content = sanitizeGameCode(game.content);
    
    logSuccess(SOURCE, "Game generated successfully");
    
    return game;
  } catch (error) {
    logError(SOURCE, "Error generating with Gemini", error);
    throw error;
  }
};

export const tryGeminiGeneration = async (
  model: any,
  topic: string, 
  settings?: GameSettingsData,
  retryCount = 0
): Promise<MiniGame | null> => {
  const maxRetries = 3;
  
  if (retryCount >= maxRetries) {
    logWarning(SOURCE, `Reached maximum retries (${maxRetries})`);
    return null;
  }
  
  try {
    return await generateWithGemini(topic, settings);
  } catch (error) {
    logError(SOURCE, `Attempt ${retryCount + 1} failed`, error);
    
    const waitTime = (retryCount + 1) * 1500;
    await new Promise(resolve => setTimeout(resolve, waitTime));
    
    return tryGeminiGeneration(null, topic, settings, retryCount + 1);
  }
};
