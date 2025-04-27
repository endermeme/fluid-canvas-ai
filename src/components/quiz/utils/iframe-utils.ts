

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

      // Thông báo cho parent frame khi game đã load xong
      window.addEventListener('load', function() {
        try {
          console.log('Game loaded successfully');
          // Thử gửi thông báo đến parent frame
          if (window.parent && window.parent !== window) {
            window.parent.postMessage({ type: 'GAME_LOADED', success: true }, '*');
          }
          
          // Thông báo thêm một lần nữa sau một khoảng thời gian (phòng trường hợp lần đầu bị lỡ)
          setTimeout(function() {
            if (window.parent && window.parent !== window) {
              window.parent.postMessage({ type: 'GAME_LOADED', success: true }, '*');
            }
          }, 500);
        } catch (err) {
          console.error('Error notifying parent:', err);
        }
      });

      // Backup notification khi DOM loaded
      document.addEventListener('DOMContentLoaded', function() {
        setTimeout(function() {
          if (window.parent && window.parent !== window) {
            try {
              window.parent.postMessage({ type: 'GAME_LOADED', success: true, source: 'DOMContentLoaded' }, '*');
            } catch (err) {
              console.error('Error sending DOMContentLoaded message:', err);
            }
          }
        }, 200);
      });
      
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

  const iframeHelperScript = `
    <script>
      // Đảm bảo tất cả scripts được executed sau khi DOM đã sẵn sàng
      document.addEventListener('DOMContentLoaded', function() {
        console.log('DOM fully loaded');
        
        // Đảm bảo các phần tử canvas được khởi tạo đúng
        const canvases = document.querySelectorAll('canvas');
        if (canvases.length > 0) {
          console.log('Found', canvases.length, 'canvas elements');
          canvases.forEach((canvas, index) => {
            if (!canvas.style.width) canvas.style.width = '100%';
            if (!canvas.style.maxWidth) canvas.style.maxWidth = '800px';
            if (!canvas.style.margin) canvas.style.margin = '0 auto';
            console.log('Canvas', index, 'dimensions:', canvas.width, 'x', canvas.height);
          });
        }
        
        // Tự động thêm handlers cho các button
        const buttons = document.querySelectorAll('button:not([data-handled])');
        buttons.forEach(btn => {
          btn.setAttribute('data-handled', 'true');
          if (!btn.style.cursor) btn.style.cursor = 'pointer';
          if (isTouchDevice && !btn.getAttribute('data-touch-optimized')) {
            btn.setAttribute('data-touch-optimized', 'true');
            if (parseInt(getComputedStyle(btn).minHeight || '0', 10) < 44) {
              btn.style.minHeight = '44px';
            }
            if (parseInt(getComputedStyle(btn).minWidth || '0', 10) < 44) {
              btn.style.minWidth = '44px';
            }
          }
        });
      });
      
      // Một số helper functions phổ biến cho game
      function centerElement(element) {
        if (!element) return;
        element.style.position = element.style.position || 'absolute';
        element.style.left = '50%';
        element.style.top = '50%';
        element.style.transform = 'translate(-50%, -50%)';
      }
      
      function animateElement(element, keyframes, options) {
        if (!element || !keyframes) return;
        try {
          if (typeof element.animate === 'function') {
            return element.animate(keyframes, options);
          }
        } catch (err) {
          console.error('Animation error:', err);
        }
      }
      
      function shake(element, intensity = 5, duration = 500) {
        if (!element) return;
        const originalTransform = element.style.transform || '';
        
        // Backup current position/transform
        const backup = {
          transform: originalTransform,
          transition: element.style.transition
        };
        
        // Create shake animation
        let start = null;
        const step = (timestamp) => {
          if (!start) start = timestamp;
          const progress = timestamp - start;
          
          if (progress < duration) {
            const x = Math.sin(progress / 10) * intensity;
            element.style.transform = originalTransform + ' translateX(' + x + 'px)';
            requestAnimationFrame(step);
          } else {
            // Restore original styles
            element.style.transform = backup.transform;
            element.style.transition = backup.transition;
          }
        };
        
        requestAnimationFrame(step);
      }
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

      /* Debugging styles */
      .debug-info {
        position: fixed;
        top: 0;
        right: 0;
        background: rgba(0,0,0,0.7);
        color: #fff;
        font-size: 12px;
        padding: 5px;
        max-width: 300px;
        max-height: 150px;
        overflow: auto;
        z-index: 9999;
        font-family: monospace;
      }

      /* Ensure all the content is rendered properly */
      html, body {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        background-color: #ffffff;
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
      
      // Animation styles
      if (!document.getElementById('animation-styles')) {
        const styleTag = document.createElement('style');
        styleTag.id = 'animation-styles';
        styleTag.textContent = '@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }';
        document.head.appendChild(styleTag);
      }

      // Thêm một class vào body để ghi nhận rằng game đang hoạt động
      document.body.classList.add('game-loaded');

      // Thêm một lớp bảo vệ để đảm bảo script thực sự chạy và nội dung được hiển thị
      setTimeout(function() {
        try {
          if (document.body.innerText === '' || document.body.childElementCount <= 1) {
            // Có thể nội dung không load được
            document.body.innerHTML = '<div style="text-align:center;padding:20px;"><h3>Không thể tải nội dung game</h3><p>Vui lòng thử làm mới trang</p><button onclick="window.location.reload()" style="padding:10px 20px;background:#4a90e2;color:white;border:none;border-radius:4px;cursor:pointer;">Tải lại</button></div>';
          }
        } catch(e) {
          console.error('Error checking content:', e);
        }
      }, 2000);
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

  // Thêm debug mode
  const debugTools = `
    <script>
      // Debug tools - chỉ hiển thị khi có URL param debug=true
      if (window.location.href.includes('debug=true')) {
        const debugDiv = document.createElement('div');
        debugDiv.className = 'debug-info';
        document.body.appendChild(debugDiv);
        
        // Override console.log để hiển thị trong debug div
        const originalConsoleLog = console.log;
        console.log = function() {
          originalConsoleLog.apply(console, arguments);
          const args = Array.from(arguments);
          const text = args.map(arg => {
            if (typeof arg === 'object') return JSON.stringify(arg);
            return arg;
          }).join(' ');
          
          if (debugDiv.childNodes.length > 20) {
            debugDiv.removeChild(debugDiv.firstChild);
          }
          
          const logLine = document.createElement('div');
          logLine.textContent = text;
          debugDiv.appendChild(logLine);
        }
      }
    </script>
  `;

  // Thêm các script và style vào head và body
  head = touchStyles + head;
  body = loadingIndicator + body + errorHandlingScript + deviceDetectionScript + iframeHelperScript + debugTools;

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

