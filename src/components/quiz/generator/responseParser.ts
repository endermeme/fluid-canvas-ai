
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
    // Clean up the response - remove any non-JSON text
    let cleanedText = text.trim();
    
    // Remove markdown code blocks if present
    cleanedText = cleanedText.replace(/```json|```/g, '');
    
    // Try to find valid JSON in the response
    const jsonRegex = /\{[\s\S]*\}/g;
    const jsonMatch = cleanedText.match(jsonRegex);
    
    if (jsonMatch && jsonMatch[0]) {
      try {
        // Try to parse the JSON directly
        const gameData = JSON.parse(jsonMatch[0]);
        
        console.log("🔷 Gemini: Successfully parsed JSON directly");
        console.log(`🔷 Gemini: Game title: "${gameData.title || 'No title'}"`);
        
        // Verify HTML content exists and is properly formatted
        if (gameData.content && typeof gameData.content === 'string') {
          // Clean the HTML content - remove any extra backticks or markdown artifacts
          let htmlContent = gameData.content.trim();
          
          // Ensure the HTML content has proper doctype
          if (!htmlContent.includes('<!DOCTYPE html>')) {
            htmlContent = `<!DOCTYPE html>${htmlContent}`;
          }
          
          return {
            title: gameData.title || topic,
            description: gameData.description || "",
            content: htmlContent
          };
        } else {
          throw new Error("JSON parsed but no valid HTML content found");
        }
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
          
          // Verify and process HTML content
          if (gameData.content && typeof gameData.content === 'string') {
            let htmlContent = gameData.content.trim();
            
            // Remove any markdown or code block artifacts
            htmlContent = htmlContent.replace(/```html|```/g, '');
            
            if (!htmlContent.includes('<!DOCTYPE html>')) {
              htmlContent = `<!DOCTYPE html>${htmlContent}`;
            }
            
            return {
              title: gameData.title || topic,
              description: gameData.description || "",
              content: htmlContent
            };
          } else {
            throw new Error("JSON parsed but no valid HTML content found after sanitization");
          }
        } catch (secondParseError) {
          console.log("🔷 Gemini: Sanitized JSON parse failed, moving to manual extraction:", secondParseError.message);
        }
      }
    }
    
    // Fallback: Try to extract JSON using a more lenient approach
    console.log("🔷 Gemini: Attempting lenient JSON extraction...");
    try {
      // Look for patterns like {"title": "xxx", "content": "xxx"}
      const titleMatch = cleanedText.match(/"title"\s*:\s*"([^"]+)"/);
      const contentMatch = cleanedText.match(/"content"\s*:\s*"([\s\S]+?)(?="[,}]|$)/);
      
      if (titleMatch && contentMatch) {
        const extractedTitle = titleMatch[1];
        let extractedContent = contentMatch[1];
        
        // Unescape the content
        extractedContent = extractedContent.replace(/\\"/g, '"').replace(/\\n/g, '\n').replace(/\\\\/g, '\\');
        
        // Ensure it has the DOCTYPE
        if (!extractedContent.includes('<!DOCTYPE html>')) {
          extractedContent = `<!DOCTYPE html>${extractedContent}`;
        }
        
        console.log("🔷 Gemini: Extracted JSON using pattern matching");
        return {
          title: extractedTitle,
          description: "",
          content: extractedContent
        };
      }
    } catch (patternError) {
      console.log("🔷 Gemini: Pattern matching failed:", patternError.message);
    }
    
    // Ultimate fallback: Just extract any HTML
    console.log("🔷 Gemini: Attempting to extract HTML content directly...");
    const htmlRegex = /<!DOCTYPE html>[\s\S]*<\/html>/i;
    const htmlMatch = cleanedText.match(htmlRegex);
    
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
    const fallbackHtmlMatch = cleanedText.match(fallbackHtmlRegex);
    
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
