
import { MiniGame } from './types';

/**
 * Attempts to extract and parse a MiniGame from Gemini's text response
 * @param text The raw text response from Gemini API
 * @param topic Fallback topic if extraction fails
 * @returns Parsed MiniGame object
 */
export const parseGeminiResponse = (text: string, topic: string): MiniGame => {
  console.log("Response received, length:", text.length);
  
  try {
    // First approach: Try to extract JSON directly
    const jsonRegex = /\{[\s\S]*\}/g;
    const jsonMatch = text.match(jsonRegex);
    
    if (jsonMatch && jsonMatch[0]) {
      try {
        // Clean up the JSON string (remove backticks, etc.)
        let cleanJson = jsonMatch[0].replace(/```json|```/g, '').trim();
        
        // Parse the JSON
        const gameData = JSON.parse(cleanJson);
        
        console.log("Successfully parsed JSON");
        
        return {
          title: gameData.title || topic,
          description: gameData.description || "",
          content: gameData.content || ''
        };
      } catch (parseError) {
        console.log("JSON parse failed:", parseError.message);
      }
    }
    
    // Fallback: Try to extract HTML directly
    const htmlRegex = /<!DOCTYPE html>[\s\S]*<\/html>/i;
    const htmlMatch = text.match(htmlRegex);
    
    if (htmlMatch && htmlMatch[0]) {
      console.log("Extracted HTML directly");
      return {
        title: topic,
        description: "Generated HTML content",
        content: htmlMatch[0]
      };
    }
    
    // Last resort: Wrap the text in a basic HTML template
    console.log("Fallback: Creating basic HTML template");
    return {
      title: topic,
      description: "Basic game",
      content: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${topic}</title>
          <style>
            body { font-family: sans-serif; margin: 0; padding: 20px; text-align: center; }
          </style>
        </head>
        <body>
          <h1>${topic}</h1>
          <div id="game-container">
            <p>Simple game based on: ${topic}</p>
          </div>
          <script>
            // Basic script
            document.getElementById('game-container').innerHTML += '<p>Click to interact</p><button onclick="alert(\\'Game started!\\')">Play</button>';
          </script>
        </body>
        </html>
      `
    };
  } catch (error) {
    console.error("Error parsing response:", error);
    throw error;
  }
};
