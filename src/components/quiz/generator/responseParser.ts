import { MiniGame } from './types';
import { injectImageUtils } from './imageGenerator';

const extractCodeFromMarkdown = (text: string): { html: string, css: string, js: string } => {
  const htmlMatch = text.match(/```html\n([\s\S]*?)```/);
  const cssMatch = text.match(/```css\n([\s\S]*?)```/);
  const jsMatch = text.match(/```js\n([\s\S]*?)```/);

  return {
    html: htmlMatch?.[1]?.trim() || '',
    css: cssMatch?.[1]?.trim() || '',
    js: jsMatch?.[1]?.trim() || ''
  };
};

const formatGameContent = (content: string): string => {
  if (!content) return '';
  
  try {
    const { html, css, js } = extractCodeFromMarkdown(content);
    
    // Create a properly structured HTML document
    const formattedContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Interactive Game</title>
  <style>
${css}
  </style>
</head>
<body>
${html}
  <script>
${js}
  </script>
</body>
</html>`;

    return formattedContent;
  } catch (error) {
    console.error('Error formatting content:', error);
    return content;
  }
};

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
