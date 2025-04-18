
import { MiniGame } from './types';

/**
 * Parse Gemini API response into a directly usable HTML format
 */
export function parseGeminiResponse(response: string): MiniGame {
  console.log("🔷 Gemini: Starting direct HTML parsing");
  
  try {
    // Detect if response is a full HTML document or fragment
    const isFullHtml = response.trim().startsWith('<!DOCTYPE') || response.trim().startsWith('<html');
    const isHtmlFragment = response.trim().startsWith('<') && !isFullHtml;
    
    console.log("🔷 Gemini: Response format analysis:", {
      isFullHtml,
      isHtmlFragment
    });
    
    let fullHtml = '';
    
    if (isFullHtml) {
      // Full HTML document case
      console.log("🔷 Gemini: Processing complete HTML");
      fullHtml = response;
    } else if (isHtmlFragment) {
      // HTML fragment case
      console.log("🔷 Gemini: Processing HTML fragment");
      fullHtml = wrapHtmlFragment(response);
    } else {
      // Check if response contains HTML within markdown code blocks
      const htmlMatch = response.match(/```html\n([\s\S]*?)```/);
      const cssMatch = response.match(/```css\n([\s\S]*?)```/);
      const jsMatch = response.match(/```js\n([\s\S]*?)```/);
      
      if (htmlMatch || cssMatch || jsMatch) {
        console.log("🔷 Gemini: Processing code blocks from markdown");
        const html = htmlMatch?.[1]?.trim() || '';
        const css = cssMatch?.[1]?.trim() || '';
        const js = jsMatch?.[1]?.trim() || '';
        
        fullHtml = createCompleteHtml(html, css, js);
      } else {
        // Fallback: treat as text
        console.log("🔷 Gemini: Processing text/unknown format");
        fullHtml = wrapTextContent(response);
      }
    }
    
    // Enhance HTML with additional features
    const enhancedHtml = prepareHtml(fullHtml);
    
    // Extract title
    const title = extractTitle(enhancedHtml);
    
    console.log("🔷 Gemini: Successfully processed HTML content");
    
    // Return processed game
    return {
      title: title,
      description: "Generated HTML content",
      content: enhancedHtml
    };
  } catch (error) {
    console.error("❌ Gemini: Direct HTML processing error:", error);
    
    // Create error page
    const errorHtml = createErrorPage("Error processing content");
    
    return {
      title: `Error`,
      description: "Error processing content",
      content: errorHtml
    };
  }
}

/**
 * Wrap HTML fragment in a complete HTML document
 */
function wrapHtmlFragment(fragment: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generated Game</title>
</head>
<body>
  ${fragment}
</body>
</html>`;
}

/**
 * Create a complete HTML document from separate HTML, CSS, and JS
 */
function createCompleteHtml(html: string, css: string, js: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generated Game</title>
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
}

/**
 * Wrap text content in a complete HTML document
 */
function wrapTextContent(text: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generated Content</title>
</head>
<body>
  <div class="content">
    <pre>${text}</pre>
  </div>
</body>
</html>`;
}

/**
 * Enhance HTML with additional features
 */
function prepareHtml(html: string): string {
  // Check if HTML already has viewport
  const hasViewport = html.includes('<meta name="viewport"');
  
  // Check if HTML already has charset
  const hasCharset = html.includes('<meta charset="');
  
  // Check if HTML already has style in head
  const hasStyleInHead = html.includes('<style>') && html.includes('</head>');
  
  // Check if HTML already has script at the end of body
  const hasScriptInBody = html.includes('<script>') && html.includes('</body>');
  
  // Add missing parts to HTML
  let enhancedHtml = html;
  
  // Add viewport if missing
  if (!hasViewport && enhancedHtml.includes('</head>')) {
    enhancedHtml = enhancedHtml.replace('</head>', '  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n</head>');
  }
  
  // Add charset if missing
  if (!hasCharset && enhancedHtml.includes('</head>')) {
    enhancedHtml = enhancedHtml.replace('</head>', '  <meta charset="UTF-8">\n</head>');
  }
  
  // Add basic style if no style exists
  if (!hasStyleInHead && enhancedHtml.includes('</head>')) {
    enhancedHtml = enhancedHtml.replace('</head>', `  <style>
    /* Base responsive styles */
    body {
      margin: 0;
      padding: 0;
      font-family: sans-serif;
    }
    * {
      box-sizing: border-box;
    }
  </style>
</head>`);
  }
  
  // Add communication script
  if (!hasScriptInBody && enhancedHtml.includes('</body>')) {
    enhancedHtml = enhancedHtml.replace('</body>', `  <script>
    // Game communication utils
    window.sendGameStats = function(stats) {
      // Send game stats to parent app
      if (window.parent && typeof window.parent.sendGameStats === 'function') {
        window.parent.sendGameStats(stats);
      } else {
        console.log('Game stats:', stats);
      }
    };
    
    // Add event listener for game completion
    document.addEventListener('game-completed', function(e) {
      window.sendGameStats({
        completed: true,
        score: e.detail?.score || 0,
        completedAt: new Date().toISOString()
      });
    });
  </script>
</body>`);
  }
  
  return enhancedHtml;
}

/**
 * Extract title from HTML
 */
function extractTitle(html: string): string {
  const titleMatch = html.match(/<title>(.*?)<\/title>/i);
  if (titleMatch && titleMatch[1]) {
    return titleMatch[1].replace(/<[^>]*>/g, '').trim();
  }
  
  // Try to extract from h1 if no title found
  const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
  if (h1Match && h1Match[1]) {
    return h1Match[1].replace(/<[^>]*>/g, '').trim();
  }
  
  return "Generated Game";
}

/**
 * Create an error page
 */
function createErrorPage(errorMessage: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Error</title>
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
    <h1>Error Processing Game</h1>
    <p>${errorMessage}</p>
    <p>Please try again or check the console for more details.</p>
  </div>
</body>
</html>
  `;
}

// Export functions for use in other files
export const processGeminiHtml = parseGeminiResponse;
