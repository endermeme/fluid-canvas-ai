
import { createAPIError, ERROR_CODES } from './apiUtils';

/**
 * Parse API response and extract essential information
 */
export function parseAPIResponse(result: any): { text: string, hasWarning: boolean, warningMessage?: string } {
  // Essential validation only
  if (!result?.candidates || result.candidates.length === 0) {
    throw createAPIError(
      ERROR_CODES.API_NO_CONTENT,
      'No candidates returned from API',
      { candidatesCount: 0 }
    );
  }
  
  const candidate = result.candidates[0];
  let hasWarning = false;
  let warningMessage = '';
  
  // Extract text content efficiently
  let text = '';
  if (candidate.content?.parts?.[0]?.text) {
    text = candidate.content.parts[0].text;
  } else if (candidate.content?.parts) {
    // Fallback: concatenate all text parts
    const parts = candidate.content.parts || [];
    for (const part of parts) {
      if (part.text) {
        text += part.text;
      }
    }
  }
  
  // Check for truncation AFTER getting text - important change!
  if (candidate.finishReason === 'MAX_TOKENS' && text.trim()) {
    hasWarning = true;
    warningMessage = 'Content truncated but usable';
    // Don't treat this as an error if we have content
  } else if (!text || text.trim().length === 0) {
    // Only throw error if truly no content
    throw createAPIError(
      ERROR_CODES.API_NO_CONTENT,
      `No content returned. Finish reason: ${candidate.finishReason || 'unknown'}`,
      { finishReason: candidate.finishReason }
    );
  }
  
  return { text, hasWarning, warningMessage };
}
