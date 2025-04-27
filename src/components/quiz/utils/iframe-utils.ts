export const enhanceIframeContent = (content: string, title?: string): string => {
  // Tách phần head, body và style, script nếu có
  let head = '';
  let body = '';
  let html = content;

  // Kiểm tra và chuẩn hóa cấu trúc HTML
  if (!html.includes('<!DOCTYPE') && !html.includes('<html')) {
    html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>${title || 'Interactive Game'}</title>
</head>
<body>
  ${html}
</body>
</html>`;
  }

  // Extract head và body
  const headMatch = html.match(/<head>([\s\S]*?)<\/head>/i);
  if (headMatch && headMatch[1]) {
    head = headMatch[1];
  }

  const bodyMatch = html.match(/<body>([\s\S]*?)<\/body>/i);
  if (bodyMatch && bodyMatch[1]) {
    body = bodyMatch[1];
  }

  // Thêm các script và style thiết yếu
  const errorHandlingScript = `
    <script>
      // Error handling
      window.onerror = function(message, source, lineno, colno, error) {
        console.error('Game error:', message, source, lineno, colno);
        if (error && error.stack) console.error(error.stack);
        
        // Không hiển thị lỗi quá dài trong UI
        const shortenedMessage = message.length > 100 ? message.substring(0, 100) + '...' : message;
        
        // Chỉ thêm UI error message nếu chưa có
        if (!document.getElementById('game-error')) {
          const errorDiv = document.createElement('div');
          errorDiv.id = 'game-error';
          errorDiv.style.cssText = 'position:fixed; bottom:0; left:0; right:0; background:rgba(220,50,50,0.9); color:white; padding:10px; font-family:sans-serif; font-size:14px; z-index:10000;';
          errorDiv.innerHTML = '<b>Error:</b> ' + shortenedMessage + ' <small>Check console for details</small>';
          document.body.appendChild(errorDiv);
          
          // Auto-hide sau 5 giây
          setTimeout(() => {
            if (errorDiv.parentNode) {
              errorDiv.parentNode.removeChild(errorDiv);
            }
          }, 5000);
        }
        
        return true; // Prevent default handling
      };
      
      // Xử lý sự kiện touch tốt hơn
      let lastTap = 0;
      document.addEventListener('touchend', (e) => {
        const now = Date.now();
        if (now - lastTap < 300) {
          e.preventDefault();
        }
        lastTap = now;
      }, { passive: false });
    </script>
  `;

  const deviceDetectionScript = `
    <script>
      // Device detection
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      document.documentElement.classList.add(isTouchDevice ? 'touch-device' : 'no-touch');
      document.documentElement.classList.add(isMobile ? 'mobile' : 'desktop');
    </script>
  `;

  const touchStyles = `
    <style>
      /* Base styles */
      body {
        margin: 0;
        padding: 0;
        overflow-x: hidden;
        touch-action: manipulation;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', sans-serif;
      }
      
      /* Touch optimization */
      * {
        -webkit-tap-highlight-color: transparent;
        box-sizing: border-box;
      }
      
      /* Better buttons for touch */
      .touch-device button,
      .touch-device [role="button"],
      .touch-device input[type="button"],
      .touch-device input[type="submit"],
      .touch-device .clickable {
        min-width: 44px;
        min-height: 44px;
      }
      
      /* Better canvas scaling */
      canvas {
        touch-action: none;
        max-width: 100%;
        display: block;
        margin: 0 auto;
      }
      
      /* Loading indicator styles */
      #loading-indicator {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255,255,255,0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        transition: opacity 0.3s;
      }
      #loading-indicator.hidden {
        opacity: 0;
        pointer-events: none;
      }
      
      @media (hover: hover) and (pointer: fine) {
        /* Mouse-specific styles */
        .no-touch button:hover,
        .no-touch [role="button"]:hover {
          cursor: pointer;
          opacity: 0.9;
        }
      }
    </style>
  `;

  // Thêm loading indicator
  const loadingIndicator = `
    <div id="loading-indicator">
      <div style="text-align:center">
        <div style="width:40px;height:40px;border:3px solid #333;border-radius:50%;border-top-color:transparent;margin:0 auto;animation:spin 1s linear infinite"></div>
        <p style="margin-top:10px">Loading game...</p>
      </div>
    </div>
    <script>
      window.addEventListener('load', function() {
        const loadingEl = document.getElementById('loading-indicator');
        if (loadingEl) {
          loadingEl.classList.add('hidden');
          setTimeout(() => {
            if (loadingEl.parentNode) {
              loadingEl.parentNode.removeChild(loadingEl);
            }
          }, 500);
        }
      });
    </script>
  `;

  // Tạo viewport meta nếu chưa có
  const viewportMeta = '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">';
  if (!head.includes('viewport')) {
    head = viewportMeta + head;
  }

  // Thêm title nếu được cung cấp và chưa có
  if (title && !head.includes('<title>')) {
    head += `<title>${title}</title>`;
  }

  // Thêm các script và style vào head và body
  head = touchStyles + head;
  body = loadingIndicator + body + errorHandlingScript + deviceDetectionScript;

  // Tái tạo HTML đầy đủ
  const enhancedHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  ${head}
</head>
<body>
  ${body}
</body>
</html>`;

  return enhancedHTML;
};
