/**
 * Utility functions for enhancing iframe content
 */

/**
 * Enhances the HTML content to be rendered in an iframe
 * @param content - The original HTML content
 * @param title - Optional title for the iframe document
 * @returns Enhanced HTML content
 */
export const enhanceIframeContent = async (content: string, title?: string): Promise<string> => {
  if (!content || typeof content !== 'string') {
    console.error('Invalid content provided to enhanceIframeContent:', content);
    return '<html><body><h1>Error: Invalid content</h1></body></html>';
  }

  // Add default title if not provided
  const documentTitle = title || 'Interactive Game';
  
  // Base styles for the iframe content
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

  // Wrap content in proper HTML structure if it's not already
  const hasHtmlTag = /<html[^>]*>/i.test(content);
  const hasHeadTag = /<head[^>]*>/i.test(content);
  const hasBodyTag = /<body[^>]*>/i.test(content);

  let enhancedContent = '';

  if (hasHtmlTag && hasHeadTag && hasBodyTag) {
    // Content already has HTML structure, just add our enhancements
    enhancedContent = content
      .replace(/<head[^>]*>/, `<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${documentTitle}</title><style>${baseStyles}</style>`)
      .replace(/<\/body>/, `${communicationScript}</body>`);
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
      </head>
      <body>
        ${content}
        ${communicationScript}
      </body>
      </html>
    `;
  }

  return enhancedContent;
}; 