
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
    
    // Preserve line breaks and indentation from original source
    // This is critical for maintaining proper code formatting
    
    // Check if the content is already properly formatted with line breaks
    if (!formattedContent.includes('\n')) {
      // If no line breaks are present, we need to reconstruct formatting
      // Convert HTML tags to add proper line breaks and indentation
      formattedContent = formattedContent
        // Add line breaks after opening tags
        .replace(/(<[^\/!][^>]*>)/g, '$1\n')
        // Add line breaks before closing tags
        .replace(/(<\/[^>]+>)/g, '\n$1')
        // Add line breaks after self-closing tags
        .replace(/(<[^>]*\/>)/g, '$1\n')
        // Format <style> blocks with line breaks
        .replace(/<style[^>]*>(.*?)<\/style>/g, (match, styleContent) => {
          return match.replace(styleContent, styleContent
            .replace(/\{/g, ' {\n  ')
            .replace(/;/g, ';\n  ')
            .replace(/}/g, '\n}\n')
          );
        })
        // Format <script> blocks with line breaks
        .replace(/<script[^>]*>(.*?)<\/script>/g, (match, scriptContent) => {
          return match.replace(scriptContent, scriptContent
            .replace(/\{/g, ' {\n  ')
            .replace(/;(?!\n)/g, ';\n  ')
            .replace(/}/g, '\n}\n')
          );
        });
    }
    
    // Make sure we have proper DOCTYPE and HTML structure
    if (!formattedContent.includes('<!DOCTYPE html>')) {
      if (formattedContent.includes('<html')) {
        formattedContent = `<!DOCTYPE html>\n${formattedContent}`;
      } else {
        formattedContent = `<!DOCTYPE html>\n<html>\n<head>\n<meta charset="UTF-8">\n<title>Interactive Game</title>\n</head>\n<body>\n${formattedContent}\n</body>\n</html>`;
      }
    }

    // Properly format HTML structure with indentation
    const lines = formattedContent.split('\n');
    let indentLevel = 0;
    let formattedLines = [];
    
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();
      if (!line) continue;
      
      // Decrease indent for closing tags
      if (line.startsWith('</') && !line.startsWith('</script') && !line.startsWith('</style')) {
        indentLevel = Math.max(0, indentLevel - 1);
      }
      
      // Add current indentation
      formattedLines.push('  '.repeat(indentLevel) + line);
      
      // Increase indent after opening tags (excluding self-closing or special tags)
      if (line.match(/<[^\/!][^>]*>/) && 
          !line.match(/<[^>]*\/>/) && 
          !line.match(/<(script|style|link|meta|br|hr|img|input)[^>]*>/i)) {
        indentLevel++;
      }
    }
    
    formattedContent = formattedLines.join('\n');

    // Format JavaScript in script tags
    formattedContent = formattedContent.replace(/<script[^>]*>([\s\S]*?)<\/script>/g, (match, code) => {
      const formattedJs = formatJavaScript(code);
      return `<script>\n${formattedJs}\n</script>`;
    });
    
    // Format CSS in style tags
    formattedContent = formattedContent.replace(/<style[^>]*>([\s\S]*?)<\/style>/g, (match, code) => {
      const formattedCss = formatCss(code);
      return `<style>\n${formattedCss}\n</style>`;
    });

    return formattedContent;
  } catch (error) {
    console.error('Error formatting content:', error);
    return content;
  }
};

// Helper function to format JavaScript with proper indentation
const formatJavaScript = (code: string): string => {
  if (!code.trim()) return '';
  
  try {
    let formattedCode = code
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
      .replace(/\/\/[^\n]*/g, '') // Remove line comments
      .trim();
    
    // Format JS with indentation and line breaks
    const lines = formattedCode.split('\n');
    let indentLevel = 1; // Start with 1 indent level (we're inside a script tag)
    let formattedLines = [];
    
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();
      if (!line) continue;
      
      // Decrease indent for closing braces
      if (line.startsWith('}')) {
        indentLevel = Math.max(0, indentLevel - 1);
      }
      
      // Add current indentation
      formattedLines.push('  '.repeat(indentLevel) + line);
      
      // Increase indent after opening braces
      if (line.endsWith('{')) {
        indentLevel++;
      }
    }
    
    return formattedLines.join('\n');
  } catch (error) {
    console.error('Error formatting JavaScript:', error);
    return code;
  }
};

// Helper function to format CSS with proper indentation
const formatCss = (code: string): string => {
  if (!code.trim()) return '';
  
  try {
    // Basic CSS formatting
    let formattedCode = code
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
      .trim();
    
    // Format CSS with indentation and line breaks
    formattedCode = formattedCode
      .replace(/\s*\{\s*/g, ' {\n  ')
      .replace(/;\s*/g, ';\n  ')
      .replace(/\s*}\s*/g, '\n}\n')
      .replace(/\n\s*\n/g, '\n'); // Remove double line breaks
    
    return formattedCode;
  } catch (error) {
    console.error('Error formatting CSS:', error);
    return code;
  }
};

export const parseGeminiResponse = (text: string, topic: string): MiniGame => {
  console.log("🔷 Gemini: Starting response parsing");
  
  try {
    // Extract HTML content with better formatting preservation
    const htmlContent = formatGameContent(text);
    
    // Log the formatted HTML for debugging
    console.log("🔷 Gemini: Formatted HTML content", htmlContent.substring(0, 500) + "...");
    
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
