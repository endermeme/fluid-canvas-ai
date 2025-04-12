import { MiniGame } from './types';
import { GameSettingsData } from '../types';
import { getGameTypeByTopic } from '../gameTypes';
import { buildGeminiPrompt } from './promptBuilder';
import { parseGeminiResponse } from './responseParser';
import { processImagesToPixabay } from './imageInstructions';
import { 
  logInfo, logError, logWarning, logSuccess, 
  measureExecutionTime, formatLogObject 
} from './apiUtils';

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
  
  logInfo(SOURCE, `Starting game generation for "${topic}"`, {
    type: gameType?.name || "Not specified",
    settings: settings || {}
  });
  
  // Check if the game might require images
  const mightRequireImages = checkIfGameRequiresImages(topic);
  if (mightRequireImages) {
    logInfo(SOURCE, "This game likely requires images. Adding Pixabay image instructions.");
  }
  
  // Build the complete prompt with image instructions if needed
  const prompt = buildGeminiPrompt(topic, gameType?.id, settings);

  try {
    // Detailed logging for better debugging
    console.groupCollapsed(`%c ${SOURCE} %c Detailed Prompt`, 'background: #6f42c1; color: white;', '');
    console.log(prompt);
    console.groupEnd();
    
    logInfo(SOURCE, "Sending request to Gemini API");
    
    const startTime = Date.now();
    const result = await model.generateContent(prompt);
    const duration = measureExecutionTime(startTime);
    
    logSuccess(SOURCE, `Response received in ${duration.seconds}s (${duration.ms}ms)`);
    
    const response = result.response;
    const text = response.text();
    
    logInfo(SOURCE, `Response length: ${text.length} characters`, {
      preview: text.substring(0, 200) + (text.length > 200 ? '...' : '')
    });
    
    // Parse the response
    logInfo(SOURCE, "Parsing response JSON");
    let parsedResponse = await parseGeminiResponse(text, topic);
    
    // Process the game content for images if it contains items array
    if (parsedResponse && parsedResponse.items && Array.isArray(parsedResponse.items)) {
      logInfo(SOURCE, "Processing image search terms to Pixabay URLs");
      parsedResponse = await processImagesToPixabay(parsedResponse);
    }
    // Process the response to convert any non-Pixabay image URLs to Pixabay format in HTML content
    else if (parsedResponse && parsedResponse.content) {
      parsedResponse.content = replaceNonPixabayImageUrls(parsedResponse.content, topic);
    }
    
    // Return the generated game
    logSuccess(SOURCE, "Game generated successfully", {
      title: parsedResponse?.title || topic,
      contentSize: parsedResponse?.content?.length || 0
    });
    
    return parsedResponse;
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
  const maxRetries = 3; // Reduced number of retries
  
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

/**
 * Helper function to determine if a game likely requires images
 * @param topic The game topic
 * @returns Boolean indicating if images might be required
 */
function checkIfGameRequiresImages(topic: string): boolean {
  const imageRelatedKeywords = [
    'pictionary', 'picture', 'image', 'photo', 'hình', 'ảnh', 'đoán hình',
    'memory', 'matching', 'flashcard', 'thẻ nhớ', 'ghép hình', 'thẻ hình',
    'fruit', 'hoa quả', 'cây', 'animal', 'động vật', 'landmark', 'place',
    'địa danh', 'thắng cảnh'
  ];
  
  const lowerTopic = topic.toLowerCase();
  return imageRelatedKeywords.some(keyword => lowerTopic.includes(keyword));
}

/**
 * Replace non-Pixabay image URLs with Pixabay URLs in HTML content
 * @param content HTML content string
 * @param topic The game topic for fallback search
 * @returns Updated HTML content string
 */
function replaceNonPixabayImageUrls(content: string, topic: string): string {
  // Detect non-Pixabay image URLs in the content
  // This regex looks for image URLs that don't contain pixabay.com or cdn.pixabay.com
  const nonPixabayImageRegex = /(src=["'])(https?:\/\/(?!.*pixabay\.com|.*cdn\.pixabay\.com).+?)(["'])/gi;
  
  let replacementCount = 0;
  
  // Replace with Pixabay URLs
  const updatedContent = content.replace(nonPixabayImageRegex, (match, prefix, url, suffix) => {
    // Extract possible search term from URL
    let searchTerm = extractSearchTermFromUrl(url) || topic;
    // Sanitize the search term
    searchTerm = searchTerm.replace(/[^\w\s]/g, ' ').trim();
    
    // Use a direct Pixabay image URL from their CDN as a fallback
    // This is a static image that should exist
    const fallbackPixabayImage = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png';
    
    replacementCount++;
    logInfo(SOURCE, `Replacing non-Pixabay image URL (${replacementCount})`, {
      originalUrl: url,
      searchTerm,
      replacement: fallbackPixabayImage
    });
    
    return `${prefix}${fallbackPixabayImage}${suffix} data-search-term="${searchTerm}"`;
  });
  
  if (replacementCount > 0) {
    logInfo(SOURCE, `Replaced ${replacementCount} non-Pixabay image URLs`);
  }
  
  return updatedContent;
}

/**
 * Extract possible search terms from a URL
 * @param url The URL to analyze
 * @returns Possible search term or null if not found
 */
function extractSearchTermFromUrl(url: string): string | null {
  try {
    // Try to extract search terms from various URL patterns
    const patterns = [
      // Extract from URL path segments
      /\/([a-z0-9-]+)[-_][0-9]+\.[a-z]+$/i,
      // Extract from query parameters
      /[?&]q=([^&]+)/i,
      /[?&]query=([^&]+)/i,
      /[?&]search=([^&]+)/i,
      // Extract from filename
      /\/([a-z0-9-]+)\.[a-z]+$/i
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return decodeURIComponent(match[1]).replace(/[_-]/g, ' ');
      }
    }
    
    return null;
  } catch (error) {
    logError(SOURCE, 'Error extracting search term from URL', error);
    return null;
  }
}
