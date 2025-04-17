
export const enhanceIframeContent = (content: string, title?: string): string => {
  // Add viewport meta tag for responsive layout if not present
  if (!content.includes('<meta name="viewport"')) {
    content = content.replace('<head>', '<head>\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">');
  }
  
  // Make clickable elements visible and add pointer cursor
  if (!content.includes('user-select: none')) {
    content = content.replace('</head>', `  <style>
    button, a, input[type="button"], input[type="submit"], .clickable, [role="button"] {
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }
    ::selection {
      background-color: rgba(79, 70, 229, 0.2);
    }
    html, body {
      overscroll-behavior: none;
      overflow: hidden;
      position: relative;
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
    }
    * {
      box-sizing: border-box;
    }
    img {
      -webkit-user-drag: none;
      user-select: none;
    }
    canvas {
      touch-action: none;
    }
  </style>
</head>`);
  }
  
  // Add title if provided
  if (title && !content.includes('<title>')) {
    content = content.replace('<head>', `<head>\n  <title>${title}</title>`);
  }
  
  // Add communication with parent window
  if (!content.includes('window.parent.postMessage')) {
    content = content.replace('</body>', `
  <script>
    // Communication with parent window - fixed for cross-origin safety
    function reportGameStats(stats) {
      try {
        window.parent.postMessage({
          type: 'gameStats',
          payload: stats
        }, '*');
      } catch(e) {
        console.error("Error posting message to parent:", e);
      }
    }
    
    // When game completes, report it
    function reportGameCompleted(score) {
      try {
        reportGameStats({
          completed: true,
          score: score || 0,
          totalTime: Date.now() - window.gameStartTime
        });
      } catch(e) {
        console.error("Error reporting game completion:", e);
      }
    }
    
    // Track game start time
    window.gameStartTime = Date.now();
    
    // Intercept console logs for debugging with safe cross-origin handling
    const originalConsole = { 
      log: console.log, 
      error: console.error, 
      warn: console.warn 
    };
    
    console.log = function() {
      originalConsole.log.apply(console, arguments);
      try {
        const args = Array.from(arguments).map(arg => {
          try { 
            return typeof arg === 'object' ? JSON.stringify(arg) : String(arg);
          } catch(e) { 
            return String(arg); 
          }
        });
        window.parent.postMessage({
          type: 'console',
          method: 'log',
          args: args
        }, '*');
      } catch(e) {
        // Silent fail for console interception
      }
    };
    
    console.error = function() {
      originalConsole.error.apply(console, arguments);
      try {
        const args = Array.from(arguments).map(arg => {
          try { 
            return typeof arg === 'object' ? JSON.stringify(arg) : String(arg);
          } catch(e) { 
            return String(arg); 
          }
        });
        window.parent.postMessage({
          type: 'console',
          method: 'error',
          args: args
        }, '*');
      } catch(e) {
        // Silent fail for console interception
      }
    };
    
    console.warn = function() {
      originalConsole.warn.apply(console, arguments);
      try {
        const args = Array.from(arguments).map(arg => {
          try { 
            return typeof arg === 'object' ? JSON.stringify(arg) : String(arg);
          } catch(e) { 
            return String(arg); 
          }
        });
        window.parent.postMessage({
          type: 'console',
          method: 'warn',
          args: args
        }, '*');
      } catch(e) {
        // Silent fail for console interception
      }
    };
    
    // Report initial load complete
    window.addEventListener('load', function() {
      try {
        reportGameStats({ loaded: true });
      } catch(e) {
        console.error("Error reporting game load:", e);
      }
    });
  </script>
</body>`);
  }
  
  return content;
};

// Utility to create a complete HTML document from separated HTML, CSS, and JS files
export const createCompleteHtmlFromParts = (
  htmlContent: string, 
  cssContent: string, 
  jsContent: string,
  title?: string
): string => {
  // Fix template literals in JavaScript to prevent syntax errors
  const fixedJsContent = jsContent
    .replace(/`([^`]*)`/g, function(match) {
      // Escape backticks and replace newlines with proper escaped newlines
      return match.replace(/\n/g, "\\n").replace(/\r/g, "\\r");
    });
    
  const docType = '<!DOCTYPE html>';
  const html = `
${docType}
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${title ? `<title>${title}</title>` : '<title>Interactive Game</title>'}
  <style>
${cssContent || ''}
  </style>
</head>
<body>
${htmlContent.includes('<!DOCTYPE html>') 
  ? htmlContent.split('<body>')[1].split('</body>')[0] 
  : htmlContent || ''}
  <script>
${fixedJsContent || ''}
  </script>
</body>
</html>`;

  return enhanceIframeContent(html, title);
};
