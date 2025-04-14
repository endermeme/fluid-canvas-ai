
import { MiniGame } from './types';
import { GameSettingsData } from '../types';
import { buildOpenAIPrompt } from './promptBuilder';
import { 
  logInfo, logError, logWarning, logSuccess, 
  measureExecutionTime
} from './apiUtils';

const SOURCE = "OPENAI";
const OPENAI_MODEL = "gpt-4o-mini";
const OPENAI_API_ENDPOINT = "https://api.openai.com/v1/chat/completions";

/**
 * Generates a game using OpenAI API
 * @param topic Topic for the game
 * @param settings Optional game settings
 * @returns MiniGame object or null if generation fails
 */
export const generateWithOpenAI = async (
  topic: string, 
  settings?: GameSettingsData
): Promise<MiniGame | null> => {
  const useCanvas = settings?.requestMetadata?.useCanvas || false;
  
  logInfo(SOURCE, `Starting game generation for "${topic}" using ${OPENAI_MODEL}`, {
    model: OPENAI_MODEL,
    type: "Custom Game",
    useCanvas: useCanvas,
    settings: settings || {}
  });
  
  // Build the prompt for OpenAI
  const prompt = buildOpenAIPrompt(topic, useCanvas);

  try {
    logInfo(SOURCE, `Sending request to OpenAI API using model ${OPENAI_MODEL}`);
    
    const startTime = Date.now();
    
    // Create payload for OpenAI API
    const payload = {
      model: OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content: "You are a game development assistant that creates HTML games. Return only valid HTML code with no additional text or explanation."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4000
    };
    
    // Get the API key from the window object
    const apiKey = (window as any).OPENAI_API_KEY;
    
    if (!apiKey) {
      throw new Error('Không tìm thấy OpenAI API Key');
    }
    
    // Make API call
    const response = await fetch(OPENAI_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.error?.message || `API request failed: ${response.status} ${response.statusText}`;
      
      // Specific handling for API key errors
      if (response.status === 401 || errorMessage.includes('API key') || errorMessage.includes('authentication')) {
        throw new Error(`API Key không hợp lệ: ${errorMessage}`);
      }
      
      throw new Error(errorMessage);
    }
    
    // Parse response
    const result = await response.json();
    const text = result?.choices?.[0]?.message?.content || '';
    
    if (!text) {
      throw new Error('No content returned from API');
    }
    
    const duration = measureExecutionTime(startTime);
    
    logSuccess(SOURCE, `Response received in ${duration.seconds}s (${duration.ms}ms)`);
    logInfo(SOURCE, `Response length: ${text.length} characters`);
    
    // Extract title from HTML
    let title = topic;
    const titleMatch = text.match(/<title>(.*?)<\/title>/i) || 
                      text.match(/<h1[^>]*>(.*?)<\/h1>/i);
    
    if (titleMatch && titleMatch[1]) {
      title = titleMatch[1].replace(/<[^>]*>/g, '').trim();
    }
    
    // Clean up HTML
    let htmlContent = text.trim();
    
    // If the response doesn't start with <!DOCTYPE html>, try to extract HTML content
    if (!htmlContent.startsWith('<!DOCTYPE html>')) {
      const htmlMatch = htmlContent.match(/<!DOCTYPE html>[\s\S]*<\/html>/i);
      if (htmlMatch && htmlMatch[0]) {
        htmlContent = htmlMatch[0];
      }
    }
    
    // Create MiniGame object
    const game: MiniGame = {
      title: title,
      content: htmlContent
    };
    
    logSuccess(SOURCE, "Game generated successfully", {
      title: title,
      contentSize: htmlContent.length
    });
    
    return game;
  } catch (error) {
    logError(SOURCE, "Error generating with OpenAI", error);
    throw error;
  }
};

/**
 * Attempts to generate a game with OpenAI, with retries on failure
 * @param topic Topic for the game
 * @param settings Optional game settings
 * @param retryCount Current retry count (internal use)
 * @returns MiniGame object or null if all retries fail
 */
export const tryOpenAIGeneration = async (
  topic: string, 
  settings?: GameSettingsData,
  retryCount = 0
): Promise<MiniGame | null> => {
  const maxRetries = 2;
  
  if (retryCount >= maxRetries) {
    logWarning(SOURCE, `Reached maximum retries (${maxRetries})`);
    return null;
  }
  
  try {
    logInfo(SOURCE, `Attempt ${retryCount + 1} for topic: "${topic}"`);
    return await generateWithOpenAI(topic, settings);
  } catch (error: any) {
    logError(SOURCE, `Attempt ${retryCount + 1} failed`, error);
    
    // API Key errors shouldn't be retried
    if (error.message && (
        error.message.includes('API Key') || 
        error.message.includes('authentication') ||
        error.message.includes('Unauthorized') ||
        error.message.includes('401')
    )) {
      throw error; // Propagate API key errors without retrying
    }
    
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
    
    return tryOpenAIGeneration(topic, settings, retryCount + 1);
  }
};
