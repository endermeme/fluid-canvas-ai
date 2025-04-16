
import { MiniGame } from './types';
import { injectImageUtils } from './imageGenerator';

/**
 * Formats HTML content with proper indentation and line breaks
 * @param content The HTML content to format
 * @returns Formatted HTML content
 */
const formatGameContent = (content: string): string => {
  if (!content) return '';
  
  try {
    // First remove any code block markers if present
    let formattedContent = content.replace(/```html|```/g, '').trim();
    
    // Basic formatting for HTML structure
    formattedContent = formattedContent
      // Add line breaks after opening tags
      .replace(/(<[^\/!][^>]*>)(?!\s*[\r\n])/g, '$1\n')
      // Add line breaks before closing tags
      .replace(/(?<!\s*[\r\n])(<\/[^>]+>)/g, '\n$1')
      // Add line breaks after self-closing tags
      .replace(/(<[^>]*\/>)(?!\s*[\r\n])/g, '$1\n')
      // Add line breaks after <!DOCTYPE>, <!-- comments -->, etc.
      .replace(/(<!(?:DOCTYPE|--)[^>]*>)(?!\s*[\r\n])/g, '$1\n')
      // Add double line breaks before <head>, <body>, <script>, <style> tags
      .replace(/(<(?:head|body|script|style)[^>]*>)/g, '\n\n$1\n')
      // Add double line breaks after </head>, </body>, </script>, </style> tags
      .replace(/(<\/(?:head|body|script|style)>)/g, '\n$1\n\n')
      // Ensure proper indentation for JavaScript blocks
      .replace(/(<script[^>]*>)(\s*)([\s\S]*?)(\s*)(<\/script>)/g, (match, openTag, ws1, code, ws2, closeTag) => {
        // Format JavaScript code with line breaks and indentation
        const formattedJs = code
          .replace(/\{/g, '{\n  ')
          .replace(/\}/g, '\n}\n')
          .replace(/;(?!\s*[\r\n])/g, ';\n  ')
          .replace(/\}\s*else/g, '} else')
          .replace(/if\s*\(([^)]+)\)\s*\{/g, 'if ($1) {');
        
        return `${openTag}\n  ${formattedJs}\n${closeTag}`;
      })
      // Ensure proper indentation for CSS blocks
      .replace(/(<style[^>]*>)(\s*)([\s\S]*?)(\s*)(<\/style>)/g, (match, openTag, ws1, code, ws2, closeTag) => {
        // Format CSS code with line breaks and indentation
        const formattedCss = code
          .replace(/\{/g, ' {\n  ')
          .replace(/;/g, ';\n  ')
          .replace(/\}/g, '\n}\n');
        
        return `${openTag}\n  ${formattedCss}\n${closeTag}`;
      });
    
    // Remove excessive empty lines
    formattedContent = formattedContent
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      .trim();
    
    return formattedContent;
  } catch (error) {
    console.error('Error formatting HTML content:', error);
    return content;
  }
};

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
        // Format the content
        content = formatGameContent(content);
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
          // Format the content
          content = formatGameContent(content);
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
      
      // Format the content
      let enhancedHtml = formatGameContent(htmlMatch[0]);
      // Add image utilities
      enhancedHtml = injectImageUtils(enhancedHtml);
      
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
      // Format the content
      let enhancedHtml = formatGameContent(htmlContent);
      // Add image utilities
      enhancedHtml = injectImageUtils(enhancedHtml);
      
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
