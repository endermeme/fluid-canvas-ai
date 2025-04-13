
import { MiniGame } from './types';

/**
 * Attempts to extract and parse a MiniGame from Gemini's text response
 * @param text The raw text response from Gemini API
 * @param topic Fallback topic if extraction fails
 * @returns Parsed MiniGame object
 */
export const parseGeminiResponse = (text: string, topic: string): MiniGame => {
  console.log("🔷 Gemini: Response received, extracting JSON...");
  console.log("🔷 Gemini: Response length:", text.length);
  
  try {
    // First approach: Try to extract JSON directly
    const jsonRegex = /\{[\s\S]*\}/g;
    const jsonMatch = text.match(jsonRegex);
    
    if (jsonMatch && jsonMatch[0]) {
      try {
        // Try to parse the JSON directly
        const gameData = JSON.parse(jsonMatch[0]);
        
        console.log("🔷 Gemini: Successfully parsed JSON directly");
        console.log(`🔷 Gemini: Game title: "${gameData.title || 'No title'}"`);
        
        return {
          title: gameData.title || topic,
          description: gameData.description || "",
          content: gameData.content || ''
        };
      } catch (parseError) {
        console.log("🔷 Gemini: Direct JSON parse failed, trying with sanitization:", parseError.message);
        
        // Try again with sanitization
        let sanitizedJson = jsonMatch[0]
          .replace(/\\(?!["\\/bfnrt])/g, "\\\\") // Fix invalid escape sequences
          .replace(/\n/g, "\\n")               // Properly escape newlines
          .replace(/\r/g, "\\r")               // Properly escape carriage returns
          .replace(/\t/g, "\\t")               // Properly escape tabs
          .replace(/\f/g, "\\f")               // Properly escape form feeds
          .replace(/[\u0000-\u001F\u007F-\u009F]/g, ""); // Remove control characters
        
        try {
          const gameData = JSON.parse(sanitizedJson);
          console.log("🔷 Gemini: JSON parsed after sanitization");
          
          return {
            title: gameData.title || topic,
            description: gameData.description || "",
            content: gameData.content || ''
          };
        } catch (secondParseError) {
          console.log("🔷 Gemini: Sanitized JSON parse failed, moving to manual extraction:", secondParseError.message);
        }
      }
    }
    
    // Fallback: Manual extraction of HTML content
    console.log("🔷 Gemini: Attempting to extract HTML content directly...");
    const htmlRegex = /<!DOCTYPE html>[\s\S]*<\/html>/i;
    const htmlMatch = text.match(htmlRegex);
    
    if (htmlMatch && htmlMatch[0]) {
      console.log("🔷 Gemini: Successfully extracted HTML content");
      return {
        title: topic,
        description: "Generated HTML content",
        content: htmlMatch[0]
      };
    }
    
    // Final fallback: Get anything between <html> and </html>
    const fallbackHtmlRegex = /<html[\s\S]*<\/html>/i;
    const fallbackHtmlMatch = text.match(fallbackHtmlRegex);
    
    if (fallbackHtmlMatch && fallbackHtmlMatch[0]) {
      console.log("🔷 Gemini: Extracted HTML with fallback regex");
      const htmlContent = `<!DOCTYPE html>${fallbackHtmlMatch[0]}`;
      return {
        title: topic,
        description: "Generated HTML content with fallback method",
        content: htmlContent
      };
    }
    
    throw new Error("Unable to extract valid content from Gemini response");
  } catch (extractionError) {
    console.error("❌ Gemini: Content extraction error:", extractionError);
    throw extractionError;
  }
};
