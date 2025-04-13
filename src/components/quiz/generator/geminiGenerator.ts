
import { MiniGame } from './types';
import { GameSettingsData } from '../types';
import { getGameTypeByTopic } from '../gameTypes';
import { 
  logInfo, logError, logWarning, logSuccess, 
  measureExecutionTime
} from './apiUtils';
import { 
  GEMINI_MODELS, 
  API_VERSION, 
  getApiEndpoint,
  DEFAULT_GENERATION_SETTINGS 
} from '@/constants/api-constants';
import { buildGeminiPrompt } from './promptBuilder';

const SOURCE = "GEMINI";

/**
 * Generates a game using direct API calls to Google's Gemini API
 * @param topic Topic for the game
 * @param settings Optional game settings
 * @returns MiniGame object or null if generation fails
 */
export const generateWithGemini = async (
  topic: string, 
  settings?: GameSettingsData
): Promise<MiniGame | null> => {
  // Get game type from topic to provide better context for the AI
  const gameType = getGameTypeByTopic(topic);
  
  logInfo(SOURCE, `Starting game generation for "${topic}" using ${GEMINI_MODELS.DEFAULT}`, {
    model: GEMINI_MODELS.DEFAULT,
    apiVersion: API_VERSION,
    type: gameType?.name || "Not specified",
    settings: settings || {}
  });
  
  // Use the improved prompt builder
  const useCanvas = settings?.category === 'canvas' || false;
  const prompt = buildGeminiPrompt(topic, useCanvas);

  try {
    logInfo(SOURCE, `Sending request to Gemini API using model ${GEMINI_MODELS.DEFAULT} (${API_VERSION})`);
    
    const startTime = Date.now();
    
    // Create payload
    const payload = {
      contents: [{
        parts: [{text: prompt}]
      }],
      generationConfig: {
        ...DEFAULT_GENERATION_SETTINGS,
        temperature: 0.7, // Slightly higher for more creative games
        topK: 40,
        topP: 0.95
      }
    };
    
    // Make API call
    const response = await fetch(getApiEndpoint(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    // Parse response
    const result = await response.json();
    const text = result?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    if (!text) {
      throw new Error('No content returned from API');
    }
    
    const duration = measureExecutionTime(startTime);
    
    logSuccess(SOURCE, `Response received in ${duration.seconds}s (${duration.ms}ms)`);
    logInfo(SOURCE, `Response length: ${text.length} characters`);
    
    // Extract title from JSON or HTML
    let title = topic;
    let content = text;
    
    // Try to parse as JSON first
    try {
      // Find JSON object in response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch && jsonMatch[0]) {
        const parsedJson = JSON.parse(jsonMatch[0]);
        if (parsedJson.title) {
          title = parsedJson.title;
        }
        if (parsedJson.content) {
          content = parsedJson.content;
        }
      }
    } catch (err) {
      // If JSON parsing fails, look for HTML title
      const titleMatch = text.match(/<title>(.*?)<\/title>/i) || 
                        text.match(/<h1[^>]*>(.*?)<\/h1>/i);
      
      if (titleMatch && titleMatch[1]) {
        title = titleMatch[1].replace(/<[^>]*>/g, '').trim();
      }
      
      // Extract HTML if it's not JSON
      const htmlMatch = text.match(/<!DOCTYPE html>[\s\S]*<\/html>/i) || 
                        text.match(/<html[\s\S]*<\/html>/i);
      
      if (htmlMatch) {
        content = htmlMatch[0];
      }
    }
    
    // Create MiniGame object
    const game: MiniGame = {
      title: title,
      content: content
    };
    
    logSuccess(SOURCE, "Game generated successfully", {
      title: title,
      contentSize: content.length
    });
    
    return game;
  } catch (error) {
    logError(SOURCE, "Error generating with Gemini", error);
    throw error;
  }
};

/**
 * Attempts to generate a game with Gemini, with retries on failure
 * @param model This parameter is no longer used but kept for compatibility
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
    return await generateWithGemini(topic, settings);
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
    
    return tryGeminiGeneration(null, topic, settings, retryCount + 1);
  }
};
