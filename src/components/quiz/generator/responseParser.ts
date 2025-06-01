
/**
 * Parse API response and extract text content
 */
export function parseAPIResponse(result: any): string {
  // Check for candidates
  if (!result?.candidates || result.candidates.length === 0) {
    throw new Error('No candidates returned from API');
  }
  
  const candidate = result.candidates[0];
  
  // Extract text content
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
  
  // Check if we have content
  if (!text || text.trim().length === 0) {
    const finishReason = candidate.finishReason || 'unknown';
    console.error(`❌ No content returned. Finish reason: ${finishReason}`);
    throw new Error(`No content returned from API. Finish reason: ${finishReason}`);
  }
  
  return text;
}
