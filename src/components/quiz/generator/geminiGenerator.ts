
import { MiniGame } from './types';
import { GameSettingsData } from '../types';
import { getGameTypeByTopic } from '../gameTypes';
import { 
  logInfo, logError, logWarning, logSuccess, 
  measureExecutionTime
} from './apiUtils';
import { GEMINI_MODELS } from '@/constants/api-constants';

const SOURCE = "GEMINI";

/**
 * Generates a game using Google's Gemini API
 * @param model Gemini model instance
 * @param topic Topic for the game
 * @param settings Optional game settings
 * @returns MiniGame object or null if generation fails
 */
export const generateWithGemini = async (
  model: any, 
  topic: string, 
  settings?: GameSettingsData
): Promise<MiniGame | null> => {
  // Get game type from topic to provide better context for the AI
  const gameType = getGameTypeByTopic(topic);
  
  logInfo(SOURCE, `Starting game generation for "${topic}" using ${GEMINI_MODELS.DEFAULT}`, {
    model: GEMINI_MODELS.DEFAULT,
    type: gameType?.name || "Not specified",
    settings: settings || {}
  });
  
  // Simple prompt for HTML game generation
  const prompt = `
Create an HTML game based on this topic: "${topic}"

Requirements:
- Create a fun, interactive game that works in a browser
- Use HTML, CSS, and JavaScript only (no external libraries)
- The game should be fully self-contained in a single HTML file
- Make the game visually appealing and user-friendly
- Include a title, instructions, and scoring system
- Handle all user interactions and game logic
- Make sure the game is responsive and works on different screen sizes
- Add appropriate error handling

Return only the complete HTML code with inline CSS and JavaScript.
`;

  try {
    logInfo(SOURCE, `Sending request to Gemini API using model ${GEMINI_MODELS.DEFAULT}`);
    
    const startTime = Date.now();
    const result = await model.generateContent(prompt);
    const duration = measureExecutionTime(startTime);
    
    logSuccess(SOURCE, `Response received in ${duration.seconds}s (${duration.ms}ms)`);
    
    const response = result.response;
    const text = response.text();
    
    logInfo(SOURCE, `Response length: ${text.length} characters`);
    
    // Extract title from HTML
    let title = topic;
    const titleMatch = text.match(/<title>(.*?)<\/title>/i) || 
                      text.match(/<h1[^>]*>(.*?)<\/h1>/i);
    
    if (titleMatch && titleMatch[1]) {
      title = titleMatch[1].replace(/<[^>]*>/g, '').trim();
    }
    
    // Create MiniGame object
    const game: MiniGame = {
      title: title,
      content: text
    };
    
    logSuccess(SOURCE, "Game generated successfully", {
      title: title,
      contentSize: text.length
    });
    
    return game;
  } catch (error) {
    logError(SOURCE, "Error generating with Gemini", error);
    throw error;
  }
};

/**
 * Attempts to generate a game with Gemini, with retries on failure
 * @param model Gemini model instance
 * @param topic Topic for the game
 * @param settings Optional game settings
 * @param retryCount Current retry count (internal use)
 * @returns MiniGame object or null if all retries fail
 */
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
    logInfo(SOURCE, `Attempt ${retryCount + 1} for topic: "${topic}"`);
    return await generateWithGemini(model, topic, settings);
  } catch (error) {
    logError(SOURCE, `Attempt ${retryCount + 1} failed`, error);
    
    // Wait a bit before retrying
    const waitTime = (retryCount + 1) * 1500;
    logInfo(SOURCE, `Waiting ${waitTime/1000} seconds before retrying...`);
    await new Promise(resolve => setTimeout(resolve, waitTime));
    
    // Display retry information
    console.log(
      `%c ${SOURCE} RETRY %c Attempt ${retryCount + 2}/${maxRetries+1}`,
      'background: #f9a825; color: black; padding: 2px 6px; border-radius: 4px; font-weight: bold;',
      ''
    );
    
    return tryGeminiGeneration(model, topic, settings, retryCount + 1);
  }
};
