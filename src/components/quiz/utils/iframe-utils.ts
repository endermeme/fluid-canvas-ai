/**
 * Enhanced iframe utilities for custom games
 */

export const enhanceIframeContent = (content: string, title?: string): string => {
  if (!content) return '';

  try {
    // Check if content already has proper HTML structure or contains CSS/JS markers
    const hasCssSection = content.includes('css ');
    const hasJsSection = content.includes('js ');
    
    // Extract CSS and JS if they exist in the content
    let htmlContent = content;
    let cssContent = '';
    let jsContent = '';
    
    if (hasCssSection || hasJsSection) {
      // Split content into HTML, CSS, and JS sections
      const sections = content.split(/\s*(css|js)\s+/);
      
      if (sections.length >= 1) {
        htmlContent = sections[0].trim();
      }
      
      for (let i = 1; i < sections.length; i += 2) {
        if (i + 1 < sections.length) {
          if (sections[i] === 'css') {
            cssContent = sections[i + 1].trim();
          } else if (sections[i] === 'js') {
            jsContent = sections[i + 1].trim();
          }
        }
      }
    }

    // Add viewport meta and basic styling to ensure proper display
    const viewportMeta = '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">';
    
    // Basic responsive styling
    let responsiveStyles = `
<style>
  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    box-sizing: border-box;
  }
  
  body {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
    line-height: 1.5;
    color: #333;
    display: flex;
    flex-direction: column;
  }
  
  img, canvas {
    max-width: 100%;
    height: auto;
    display: block;
  }
  
  * {
    box-sizing: border-box;
  }
  
  .container, .game-container, #game, .game, main {
    width: 100%;
    margin: 0 auto;
    padding: 0;
  }
  
  /* User provided CSS */
  ${cssContent ? `\n  ${cssContent.replace(/\n/g, '\n  ')}` : ''}
</style>`;

    // Game communication utilities script
    const gameCommsScript = `
<script>
// Game communication utilities
(function() {
  // Send game stats to parent
  window.sendGameStats = function(stats) {
    if (window.parent) {
      window.parent.postMessage({
        type: 'gameStats',
        payload: stats
      }, '*');
    }
  };
  
  // Game completion handler
  window.completeGame = function(score) {
    window.sendGameStats({
      completed: true,
      score: score,
      completedAt: new Date().toISOString()
    });
  };

  // Setup window error handling
  window.addEventListener('error', function(event) {
    console.error('Game error:', event.error);
    if (window.parent) {
      window.parent.postMessage({
        type: 'gameError',
        payload: {
          message: event.message,
          source: event.filename,
          line: event.lineno,
          column: event.colno
        }
      }, '*');
    }
  });
  
  // Send resize message to parent
  function reportHeight() {
    if (window.parent) {
      const height = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      );
      
      window.parent.postMessage({
        type: 'setHeight',
        height: height
      }, '*');
    }
  }
  
  // Report height on load and resize
  window.addEventListener('load', reportHeight);
  window.addEventListener('resize', reportHeight);
  
  // Set up a mutation observer to detect DOM changes and report height
  var observer = new MutationObserver(function() {
    reportHeight();
  });
  
  // Start observing when DOM is ready
  document.addEventListener('DOMContentLoaded', function() {
    observer.observe(document.body, { 
      childList: true, 
      subtree: true,
      attributes: true,
      characterData: true
    });
    reportHeight();
  });
})();

/* User provided JavaScript */
${jsContent ? `\n${jsContent}` : ''}
</script>`;

    // Create properly formatted HTML structure
    const formattedHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  ${viewportMeta}
  <title>${title || 'Interactive Game'}</title>
  ${responsiveStyles}
</head>
<body>
  ${htmlContent}
  ${gameCommsScript}
</body>
</html>`;

    return formattedHtml;
  } catch (error) {
    console.error('Error enhancing iframe content:', error);
    return content;
  }
};

/**
 * Wrap content in iframe-safe HTML if it's not already HTML
 */
export const wrapContentInHtml = (content: string, title?: string): string => {
  // Check if content is already HTML (has html tags)
  if (content.includes('<html') || content.includes('<!DOCTYPE html>')) {
    return enhanceIframeContent(content, title);
  }
  
  // Wrap in minimal HTML
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title || 'Interactive Content'}</title>
  <style>
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
      margin: 0;
      padding: 20px;
      max-width: 100%;
      overflow-x: hidden;
      box-sizing: border-box;
    }
  </style>
</head>
<body>
  ${content}
</body>
</html>`;
};
