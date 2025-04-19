
/**
 * Gemini response parser
 */
import { MiniGame } from '../../types/game';
import { removeMarkdown, formatHtml, extractTitle } from '../../core/utils/html-processor';

/**
 * Parse response from Gemini into a MiniGame
 */
export function parseGeminiResponse(response: string): MiniGame | null {
  try {
    // Completely remove all Markdown markers
    let cleanedResponse = response
      .replace(/```html|```css|```javascript|```js|```/g, '')  // Remove all code block markers
      .replace(/`/g, '')  // Remove single backticks
      .trim();  // Trim excess whitespace
    
    console.log("🧹 Cleaned response from Markdown:", cleanedResponse.substring(0, 100) + "...");
    
    // Check if the response is already HTML
    if (cleanedResponse.trim().toLowerCase().startsWith('<!doctype html') || 
        cleanedResponse.trim().toLowerCase().startsWith('<html')) {
      return {
        title: extractTitle(cleanedResponse) || "Custom Game",
        content: cleanedResponse,
        isSeparatedFiles: false
      };
    }

    // Handle HTML fragments (starting with any HTML tag)
    if (cleanedResponse.trim().startsWith('<') && cleanedResponse.includes('>')) {
      // Check if it's likely an incomplete HTML fragment
      if (!cleanedResponse.includes('<html') && !cleanedResponse.includes('<!doctype')) {
        // Wrap it in a proper HTML structure
        cleanedResponse = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Custom Game</title>
</head>
<body>
  ${cleanedResponse}
</body>
</html>`;
      }
      
      return {
        title: extractTitle(cleanedResponse) || "Custom Game",
        content: cleanedResponse,
        isSeparatedFiles: false
      };
    }
    
    // Try to parse as JSON if not HTML
    try {
      // Use type assertion for the parsed JSON
      const jsonResponse = JSON.parse(cleanedResponse) as {
        title?: string;
        content: string;
        description?: string;
      };
      
      if (jsonResponse.content) {
        return {
          title: jsonResponse.title || "Custom Game",
          content: jsonResponse.content,
          description: jsonResponse.description,
          isSeparatedFiles: false
        };
      }
    } catch (jsonError) {
      // Not valid JSON, continue with other parsing methods
      console.log("Not a valid JSON response:", jsonError);
    }
    
    // Last resort: treat the entire response as content
    return {
      title: "Custom Game",
      content: cleanedResponse,
      isSeparatedFiles: false
    };
  } catch (error) {
    console.error('Error parsing response:', error);
    return null;
  }
}
