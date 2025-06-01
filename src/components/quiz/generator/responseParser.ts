
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
  
  // Check for truncation warning
  if (candidate.finishReason === 'MAX_TOKENS') {
    hasWarning = true;
    warningMessage = 'Response truncated due to length limit, but game should still work';
  }
  
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
  
  return { text, hasWarning, warningMessage };
}
