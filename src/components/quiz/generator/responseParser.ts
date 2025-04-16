
import { MiniGame } from './types';
import { injectImageUtils } from './imageGenerator';

// Improved markdown and code block parsing
const extractCodeFromMarkdown = (text: string): string => {
  // First try to get content between ```html and ``` tags
  const htmlMatch = text.match(/```html\n([\s\S]*?)```/);
  if (htmlMatch && htmlMatch[1]) {
    return htmlMatch[1].trim();
  }

  // Then try just the content between any ``` marks
  const codeMatch = text.match(/```([\s\S]*?)```/);
  if (codeMatch && codeMatch[1]) {
    return codeMatch[1].trim();
  }

  // If no markdown blocks found, return the original text
  return text;
};

const formatGameContent = (content: string): string => {
  if (!content) return '';
  
  try {
    // Remove markdown code block markers
    let formattedContent = extractCodeFromMarkdown(content);
    
    // Preserve line breaks and indentation
    formattedContent = formattedContent
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n');

    // Make sure we have proper DOCTYPE and HTML structure
    if (!formattedContent.includes('<!DOCTYPE html>')) {
      if (formattedContent.includes('<html')) {
        formattedContent = `<!DOCTYPE html>\n${formattedContent}`;
      } else {
        formattedContent = `<!DOCTYPE html>\n<html>\n<head>\n<meta charset="UTF-8">\n<title>Interactive Game</title>\n</head>\n<body>\n${formattedContent}\n</body>\n</html>`;
      }
    }

    // Format HTML structure
    formattedContent = formattedContent
      // Add line breaks after opening tags
      .replace(/(<[^\/!][^>]*>)/g, '$1\n')
      // Add line breaks before closing tags
      .replace(/(<\/[^>]+>)/g, '\n$1')
      // Add line breaks after self-closing tags
      .replace(/(<[^>]*\/>)/g, '$1\n')
      // Add double line breaks before major sections
      .replace(/(<(?:head|body|script|style)[^>]*>)/g, '\n\n$1\n')
      // Format JavaScript in script tags
      .replace(/<script[^>]*>([\s\S]*?)<\/script>/g, (match, code) => {
        const formattedJs = code
          .replace(/\{/g, '{\n  ')
          .replace(/\}/g, '\n}\n')
          .replace(/;(?!\n)/g, ';\n  ')
          .trim();
        return `<script>\n  ${formattedJs}\n</script>`;
      })
      // Format CSS in style tags
      .replace(/<style[^>]*>([\s\S]*?)<\/style>/g, (match, code) => {
        const formattedCss = code
          .replace(/\{/g, ' {\n  ')
          .replace(/;/g, ';\n  ')
          .replace(/\}/g, '\n}\n')
          .trim();
        return `<style>\n  ${formattedCss}\n</style>`;
      });

    // Clean up excessive empty lines
    formattedContent = formattedContent
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      .trim();

    return formattedContent;
  } catch (error) {
    console.error('Error formatting content:', error);
    return content;
  }
};

export const parseGeminiResponse = (text: string, topic: string): MiniGame => {
  console.log("🔷 Gemini: Starting response parsing");
  
  try {
    // First try to extract HTML content
    const htmlContent = formatGameContent(text);
    
    // Extract title from HTML content
    let title = topic;
    const titleMatch = htmlContent.match(/<title>(.*?)<\/title>/i);
    if (titleMatch && titleMatch[1]) {
      title = titleMatch[1].replace(/<[^>]*>/g, '').trim();
    }
    
    // Add image utilities
    const enhancedHtml = injectImageUtils(htmlContent);
    
    return {
      title: title,
      description: "Generated HTML game content",
      content: enhancedHtml
    };
  } catch (error) {
    console.error("❌ Gemini: Content extraction error:", error);
    
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
          h1 { color: #b91c1c; }
        </style>
      </head>
      <body>
        <div class="error-container">
          <h1>Error Generating Game</h1>
          <p>Sorry, there was a problem creating your game about "${topic}".</p>
          <p>Please try again or check the console for more details.</p>
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

