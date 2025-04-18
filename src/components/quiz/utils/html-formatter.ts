
/**
 * Utilities for formatting HTML content
 */

const DEFAULT_VIEWPORT = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';

/**
 * Creates a formatted HTML document from separate HTML, CSS, and JS content
 */
export const createFormattedHtml = (
  html: string, 
  css: string, 
  js: string, 
  title?: string,
  viewport: string = DEFAULT_VIEWPORT
): string => {
  const viewportMeta = `<meta name="viewport" content="${viewport}">`;
  const formattedCss = formatStyles(css);
  const formattedJs = formatGameScript(js);
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  ${viewportMeta}
  <title>${title || 'Interactive Game'}</title>
  ${formattedCss}
</head>
<body>
  ${html}
  ${formattedJs}
</body>
</html>`;
};

/**
 * Formats CSS with responsive base styles
 */
const formatStyles = (userCss: string): string => {
  return `
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
  ${userCss ? `\n  ${userCss.replace(/\n/g, '\n  ')}` : ''}
</style>`;
};

/**
 * Formats JavaScript with game communication utilities
 */
const formatGameScript = (userJs: string): string => {
  return `
<script>
// Game communication utilities
(function() {
  window.sendGameStats = function(stats) {
    if (window.parent) {
      window.parent.postMessage({
        type: 'gameStats',
        payload: stats
      }, '*');
    }
  };
  
  window.completeGame = function(score) {
    window.sendGameStats({
      completed: true,
      score: score,
      completedAt: new Date().toISOString()
    });
  };

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
  
  window.addEventListener('load', reportHeight);
  window.addEventListener('resize', reportHeight);
  
  var observer = new MutationObserver(reportHeight);
  
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
${userJs ? `\n${userJs}` : ''}
</script>`;
};
