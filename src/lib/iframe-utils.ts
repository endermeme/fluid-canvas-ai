/**
 * Utilities for processing and enhancing iframe content from Gemini API
 */

interface GeminiCodeBlock {
  type: 'html' | 'css' | 'js' | 'other';
  content: string;
}

/**
 * Enhances HTML content to be properly displayed in an iframe
 * @param content - Raw content (can be HTML string or Gemini API JSON response)
 * @param title - Optional title for the iframe document
 * @returns Enhanced HTML content ready for iframe rendering
 */
export const enhanceIframeContent = async (content: string, title?: string): Promise<string> => {
  if (!content || typeof content !== 'string') {
    console.error('Invalid content provided to enhanceIframeContent:', content);
    return '<html><body><h1>Error: Invalid content</h1></body></html>';
  }

  // Try to parse content as JSON (Gemini API format)
  let parsedContent: any = null;
  let htmlContent = content;
  let cssContent = '';
  let jsContent = '';

  try {
    // Check if content is a JSON from Gemini API
    parsedContent = JSON.parse(content);
    
    // Extract from Gemini API format
    if (parsedContent?.candidates?.[0]?.content?.parts?.[0]?.text) {
      // Process Gemini response
      const rawText = parsedContent.candidates[0].content.parts[0].text;
      
      // Extract code blocks from markdown
      const codeBlocks = extractCodeBlocks(rawText);
      
      // Separate HTML, CSS, and JS code blocks
      for (const block of codeBlocks) {
        switch (block.type) {
          case 'html':
            htmlContent = block.content;
            break;
          case 'css':
            cssContent = block.content;
            break;
          case 'js':
            jsContent = block.content;
            break;
        }
      }
    }
  } catch (e) {
    // Not a JSON, treat as direct HTML
    console.log('Content is not a Gemini API response, treating as raw HTML');
  }

  // Create a proper HTML document
  const documentTitle = title || 'Interactive Game';
  
  // Define base styles for the iframe content (always applied)
  const baseStyles = `
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 0;
      height: 100vh;
      width: 100%;
      overflow: hidden;
    }
    * {
      box-sizing: border-box;
    }
    canvas {
      display: block;
      margin: 0 auto;
    }
  `;

  // Communication script to notify parent when loading is complete
  const communicationScript = `
    <script>
      document.addEventListener('DOMContentLoaded', function() {        
        // Notify parent that iframe content is loaded
        window.parent.postMessage({ type: 'GAME_LOADED' }, '*');
        console.log('Iframe content loaded and message sent to parent');
      });
    </script>
  `;

  // Check if content already has HTML structure
  const hasHtmlTag = /<html[^>]*>/i.test(htmlContent);
  const hasHeadTag = /<head[^>]*>/i.test(htmlContent);
  const hasBodyTag = /<body[^>]*>/i.test(htmlContent);

  let enhancedContent = '';

  if (hasHtmlTag && hasHeadTag && hasBodyTag) {
    // Content already has HTML structure, enhance it
    enhancedContent = htmlContent
      .replace(/<head[^>]*>/, `<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${documentTitle}</title><style>${baseStyles}</style>${cssContent ? `<style>${cssContent}</style>` : ''}`)
      .replace(/<\/body>/, `${jsContent ? `<script>${jsContent}</script>` : ''}${communicationScript}</body>`);
  } else {
    // Create a complete HTML structure
    enhancedContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${documentTitle}</title>
        <style>${baseStyles}</style>
        ${cssContent ? `<style>${cssContent}</style>` : ''}
      </head>
      <body>
        ${htmlContent}
        ${jsContent ? `<script>${jsContent}</script>` : ''}
        ${communicationScript}
      </body>
      </html>
    `;
  }

  return enhancedContent;
};

/**
 * Extracts code blocks from markdown text
 * @param markdownText - Text from Gemini API containing markdown code blocks
 * @returns Array of code blocks with type and content
 */
function extractCodeBlocks(markdownText: string): GeminiCodeBlock[] {
  const codeBlocks: GeminiCodeBlock[] = [];
  
  // Regular expression to match code blocks
  // Format: ```language\ncode\n```
  const codeBlockRegex = /```([a-z]*)\n([\s\S]*?)```/g;
  
  let match;
  while ((match = codeBlockRegex.exec(markdownText)) !== null) {
    const language = match[1].toLowerCase();
    const code = match[2].trim();
    
    // Determine type based on language
    let type: GeminiCodeBlock['type'] = 'other';
    if (language === 'html') {
      type = 'html';
    } else if (language === 'css') {
      type = 'css';
    } else if (language === 'javascript' || language === 'js') {
      type = 'js';
    }
    
    codeBlocks.push({
      type,
      content: code
    });
  }
  
  return codeBlocks;
} 