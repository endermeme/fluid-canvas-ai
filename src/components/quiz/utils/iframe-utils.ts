
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
    // Communication with parent window
    function reportGameStats(stats) {
      window.parent.postMessage({
        type: 'gameStats',
        payload: stats
      }, '*');
    }
    
    // When game completes, report it
    function reportGameCompleted(score) {
      reportGameStats({
        completed: true,
        score: score || 0,
        totalTime: Date.now() - window.gameStartTime
      });
    }
    
    // Track game start time
    window.gameStartTime = Date.now();
    
    // Intercept console logs for debugging
    const originalConsole = { 
      log: console.log, 
      error: console.error, 
      warn: console.warn 
    };
    
    console.log = function() {
      originalConsole.log.apply(console, arguments);
      try {
        window.parent.postMessage({
          type: 'console',
          method: 'log',
          args: Array.from(arguments).map(arg => {
            try { return JSON.stringify(arg); } 
            catch(e) { return String(arg); }
          })
        }, '*');
      } catch(e) {}
    };
    
    console.error = function() {
      originalConsole.error.apply(console, arguments);
      try {
        window.parent.postMessage({
          type: 'console',
          method: 'error',
          args: Array.from(arguments).map(arg => {
            try { return JSON.stringify(arg); } 
            catch(e) { return String(arg); }
          })
        }, '*');
      } catch(e) {}
    };
    
    console.warn = function() {
      originalConsole.warn.apply(console, arguments);
      try {
        window.parent.postMessage({
          type: 'console',
          method: 'warn',
          args: Array.from(arguments).map(arg => {
            try { return JSON.stringify(arg); } 
            catch(e) { return String(arg); }
          })
        }, '*');
      } catch(e) {}
    };
    
    // Report initial load complete
    window.addEventListener('load', function() {
      reportGameStats({ loaded: true });
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
${htmlContent || ''}
  <script>
${jsContent || ''}
  </script>
</body>
</html>`;

  return enhanceIframeContent(html, title);
};
