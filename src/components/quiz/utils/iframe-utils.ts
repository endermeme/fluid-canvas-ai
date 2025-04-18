
/**
 * Enhanced iframe utilities for custom games
 */

export const enhanceIframeContent = (content: string, title?: string): string => {
  if (!content) return '';

  try {
    // Add game communication channel
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
})();
</script>`;

    // Check if the content already has a body tag
    if (content.includes('</body>')) {
      // Insert the script before the closing body tag
      return content.replace('</body>', `${gameCommsScript}</body>`);
    } else {
      // Content doesn't have a body tag, create a minimal HTML document
      return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title || 'Interactive Game'}</title>
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
  ${gameCommsScript}
</body>
</html>`;
    }
  } catch (error) {
    console.error('Error enhancing iframe content:', error);
    return content; // Return original content on error
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
