
/**
 * Enhances iframe content with error handling, responsive design, and other improvements
 */
export const enhanceIframeContent = (content: string, title?: string): string => {
  if (!content) return '';
  
  // Add base HTML structure if missing
  let enhancedContent = content;
  
  if (!enhancedContent.includes('<!DOCTYPE') && !enhancedContent.includes('<html')) {
    enhancedContent = `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title || 'Interactive Game'}</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        overflow: hidden;
        width: 100%;
        height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
    </style>
</head>
<body>
    ${enhancedContent}
</body>
</html>`;
  }
  
  // Add default error handling
  if (!enhancedContent.includes('window.onerror')) {
    enhancedContent = enhancedContent.replace('</body>', `
  <script>
    window.onerror = function(message, source, lineno, colno, error) {
      console.error('Game error:', { message, source, lineno, colno, error });
      if (document.getElementById('error-display')) return true;
      
      var errorEl = document.createElement('div');
      errorEl.id = 'error-display';
      errorEl.style.position = 'fixed';
      errorEl.style.bottom = '10px';
      errorEl.style.left = '10px';
      errorEl.style.right = '10px';
      errorEl.style.backgroundColor = 'rgba(220, 53, 69, 0.95)';
      errorEl.style.color = 'white';
      errorEl.style.padding = '10px';
      errorEl.style.borderRadius = '5px';
      errorEl.style.fontSize = '12px';
      errorEl.style.zIndex = '9999';
      errorEl.style.maxHeight = '100px';
      errorEl.style.overflow = 'auto';
      errorEl.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
      errorEl.innerHTML = '<strong>Error:</strong> ' + message;
      document.body.appendChild(errorEl);
      
      setTimeout(function() {
        if (errorEl.parentNode) {
          errorEl.parentNode.removeChild(errorEl);
        }
      }, 5000);
      
      return true;
    };
    
    // Define sendGameStats function if it doesn't exist
    if (typeof window.sendGameStats !== 'function') {
      window.sendGameStats = function(stats) {
        if (window.parent && window.parent.postMessage) {
          window.parent.postMessage({ type: 'gameStats', payload: stats }, '*');
        }
        console.log('Game stats:', stats);
      };
    }
  </script>
</body>`);
  }
  
  // Add meta viewport if missing
  if (!enhancedContent.includes('<meta name="viewport"')) {
    enhancedContent = enhancedContent.replace('<head>', '<head>\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">');
  }
  
  // Add charset if missing
  if (!enhancedContent.includes('<meta charset=')) {
    enhancedContent = enhancedContent.replace('<head>', '<head>\n    <meta charset="UTF-8">');
  }
  
  return enhancedContent;
};
