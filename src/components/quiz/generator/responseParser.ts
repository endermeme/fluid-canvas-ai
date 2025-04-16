
import { MiniGame } from './types';
import { injectImageUtils } from './imageGenerator';

/**
 * Attempts to extract and parse a MiniGame from Gemini's text response
 * @param text The raw text response from Gemini API
 * @param topic Fallback topic if extraction fails
 * @returns Parsed MiniGame object
 */
export const parseGeminiResponse = (text: string, topic: string): MiniGame => {
  console.log("🔷 Gemini: Response received, extracting content...");
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
        
        let content = gameData.content || '';
        // Add image utilities
        content = injectImageUtils(content);
        
        return {
          title: gameData.title || topic,
          description: gameData.description || "",
          content: content
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
          
          let content = gameData.content || '';
          // Add image utilities
          content = injectImageUtils(content);
          
          return {
            title: gameData.title || topic,
            description: gameData.description || "",
            content: content
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
      
      // Extract title from HTML content
      let title = topic;
      const titleMatch = htmlMatch[0].match(/<title>(.*?)<\/title>/i);
      
      if (titleMatch && titleMatch[1]) {
        title = titleMatch[1].replace(/<[^>]*>/g, '').trim();
      }
      
      // Add image utilities
      const enhancedHtml = injectImageUtils(htmlMatch[0]);
      
      return {
        title: title,
        description: "Generated HTML content",
        content: enhancedHtml
      };
    }
    
    // Final fallback: Get anything between <html> and </html>
    const fallbackHtmlRegex = /<html[\s\S]*<\/html>/i;
    const fallbackHtmlMatch = text.match(fallbackHtmlRegex);
    
    if (fallbackHtmlMatch && fallbackHtmlMatch[0]) {
      console.log("🔷 Gemini: Extracted HTML with fallback regex");
      
      // Extract title if available
      let title = topic;
      const titleMatch = fallbackHtmlMatch[0].match(/<title>(.*?)<\/title>/i);
      
      if (titleMatch && titleMatch[1]) {
        title = titleMatch[1].replace(/<[^>]*>/g, '').trim();
      }
      
      const htmlContent = `<!DOCTYPE html>${fallbackHtmlMatch[0]}`;
      // Add image utilities
      const enhancedHtml = injectImageUtils(htmlContent);
      
      return {
        title: title,
        description: "Generated HTML content with fallback method",
        content: enhancedHtml
      };
    }
    
    // Last resort: Just wrap the entire text in HTML
    console.log("🔷 Gemini: Using last resort HTML wrapping");
    
    // Basic HTML wrapper for the content
    const wrappedHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${topic}</title>
        <style>
          body {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.6;
          }
          pre {
            background: #f5f5f5;
            padding: 10px;
            border-radius: 5px;
            overflow-x: auto;
          }
        </style>
      </head>
      <body>
        <h1>${topic}</h1>
        <div id="content">
          <pre>${text}</pre>
        </div>
      </body>
      </html>
    `;
    
    // Add image utilities
    const enhancedHtml = injectImageUtils(wrappedHtml);
    
    return {
      title: topic,
      description: "Generated text content",
      content: enhancedHtml
    };
  } catch (extractionError) {
    console.error("❌ Gemini: Content extraction error:", extractionError);
    
    // Create a minimal error page
    const errorHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Error: ${topic}</title>
        <style>
          body {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
            text-align: center;
            color: #333;
          }
          .error-container {
            background-color: #fee2e2;
            border: 1px solid #ef4444;
            border-radius: 8px;
            padding: 20px;
          }
          h1 {
            color: #b91c1c;
          }
        </style>
      </head>
      <body>
        <div class="error-container">
          <h1>Error Generating Game</h1>
          <p>Sorry, there was a problem creating your game about "${topic}".</p>
          <p>Please try again with a different description or check the console for more details.</p>
        </div>
      </body>
      </html>
    `;
    
    return {
      title: `Error: ${topic}`,
      description: "Error generating content",
      content: errorHtml
    };
  }
};
