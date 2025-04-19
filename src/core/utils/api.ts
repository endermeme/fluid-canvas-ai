
/**
 * Core API utilities
 */
import { GEMINI_API_KEY, GEMINI_MODELS } from './constants';

const API_TIMEOUT = 60000; // 60 seconds timeout

/**
 * Fetch with timeout
 */
export const fetchWithTimeout = async (url: string, options: RequestInit, timeout = API_TIMEOUT): Promise<Response> => {
  const controller = new AbortController();
  const { signal } = controller;
  
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, { ...options, signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

/**
 * Gemini API client
 */
export const callGeminiAPI = async (
  prompt: string, 
  model: string = GEMINI_MODELS.CUSTOM_GAME,
  maxRetries: number = 2
): Promise<any> => {
  let retries = 0;
  
  while (retries <= maxRetries) {
    try {
      const response = await fetchWithTimeout(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: prompt }]
            }],
            generationConfig: {
              temperature: 0.9,
              topK: 32,
              topP: 1,
              maxOutputTokens: 8192,
              stopSequences: []
            },
            safetySettings: []
          })
        }
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('No response from Gemini API');
      }
      
      return data;
    } catch (error: any) {
      retries++;
      
      if (error.name === 'AbortError') {
        console.error('Gemini API request timed out');
      } else {
        console.error(`Gemini API error (attempt ${retries}/${maxRetries + 1}):`, error);
      }
      
      if (retries > maxRetries) {
        throw error;
      }
      
      // Exponential backoff before retry
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retries)));
    }
  }
};

/**
 * Get text from Gemini API response
 */
export const getTextFromGeminiResponse = (response: any): string => {
  try {
    if (
      response && 
      response.candidates && 
      response.candidates[0] && 
      response.candidates[0].content && 
      response.candidates[0].content.parts && 
      response.candidates[0].content.parts[0]
    ) {
      return response.candidates[0].content.parts[0].text || '';
    }
    return '';
  } catch (error) {
    console.error('Error parsing Gemini response:', error);
    return '';
  }
};
