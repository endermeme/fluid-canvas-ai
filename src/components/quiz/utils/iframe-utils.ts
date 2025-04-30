
import { processImageSource } from '@/utils/media-utils';

export const enhanceIframeContent = async (content: string, title?: string): Promise<string> => {
  // Process all image sources in the content
  let processedContent = content;
  
  try {
    // Find all img tags and process their sources
    const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/g;
    const imgMatches = content.matchAll(imgRegex);
    
    for (const match of imgMatches) {
      const originalSrc = match[1];
      try {
        const processedSrc = await processImageSource(originalSrc);
        processedContent = processedContent.replace(originalSrc, processedSrc);
      } catch (err) {
        console.warn('Failed to process image:', originalSrc, err);
      }
    }
    
    // Find all CSS background-image urls and process them
    const bgRegex = /background-image:\s*url\(['"]?([^'")\s]+)['"]?\)/g;
    const bgMatches = content.matchAll(bgRegex);
    
    for (const match of bgMatches) {
      const originalUrl = match[1];
      try {
        const processedUrl = await processImageSource(originalUrl);
        processedContent = processedContent.replace(originalUrl, processedUrl);
      } catch (err) {
        console.warn('Failed to process background image:', originalUrl, err);
      }
    }
  } catch (err) {
    console.error('Error processing image sources:', err);
  }

  // Tách phần head, body và style, script nếu có
  let head = '';
  let body = '';
  let html = processedContent;

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

  try {
    // Extract head và body
    const headMatch = html.match(/<head>([\s\S]*?)<\/head>/i);
    if (headMatch && headMatch[1]) {
      head = headMatch[1];
    }

    const bodyMatch = html.match(/<body>([\s\S]*?)<\/body>/i);
    if (bodyMatch && bodyMatch[1]) {
      body = bodyMatch[1];
    }
  } catch (err) {
    console.error('Error extracting head/body:', err);
    // Mặc định sử dụng nội dung gốc trong trường hợp có lỗi
    head = `<title>${title || 'Interactive Game'}</title>`;
    body = html;
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
        
        // Gửi thông tin lỗi lên parent frame
        try {
          if (window.parent && window.parent !== window) {
            window.parent.postMessage({ 
              type: 'GAME_ERROR', 
              error: {
                message: message,
                source: source,
                lineno: lineno,
                colno: colno,
                stack: error?.stack
              }
            }, '*');
          }
        } catch (err) {
          console.error('Error sending error message to parent:', err);
        }
        
        return true; // Prevent default handling
      };

      // Thông báo cho parent frame khi game đã load xong
      window.addEventListener('load', function() {
        try {
          console.log('Game loaded successfully');
          // Thử gửi thông báo đến parent frame
          if (window.parent && window.parent !== window) {
            window.parent.postMessage({ 
              type: 'GAME_LOADED', 
              success: true, 
              source: 'window.load',
              timestamp: Date.now() 
            }, '*');
          }
          
          // Thông báo thêm một lần nữa sau một khoảng thời gian (phòng trường hợp lần đầu bị lỡ)
          setTimeout(function() {
            if (window.parent && window.parent !== window) {
              window.parent.postMessage({ 
                type: 'GAME_LOADED', 
                success: true,
                source: 'window.load-delayed',
                timestamp: Date.now()
              }, '*');
            }
          }, 800);
        } catch (err) {
          console.error('Error notifying parent:', err);
        }
        
        // Thêm class cho body để chỉ ra rằng trang đã tải xong
        document.body.classList.add('game-fully-loaded');
      });

      // Backup notification khi DOM loaded
      document.addEventListener('DOMContentLoaded', function() {
        try {
          console.log('DOM fully loaded');
          if (window.parent && window.parent !== window) {
            window.parent.postMessage({ 
              type: 'GAME_LOADED', 
              success: true, 
              source: 'DOMContentLoaded',
              timestamp: Date.now()
            }, '*');
          }
        } catch (err) {
          console.error('Error sending DOMContentLoaded message:', err);
        }
        
        // Thêm class để chỉ ra rằng DOM đã load
        document.documentElement.classList.add('dom-loaded');
        
        // Kiểm tra các hình ảnh và tài nguyên khác
        setTimeout(function() {
          const allImages = document.querySelectorAll('img');
          let loadedImages = 0;
          
          // Đếm số ảnh đã load xong
          allImages.forEach(img => {
            if (img.complete) loadedImages++;
          });
          
          console.log('Resources check: ' + loadedImages + '/' + allImages.length + ' images loaded');
          
          try {
            window.parent.postMessage({
              type: 'GAME_RESOURCES',
              loaded: loadedImages,
              total: allImages.length,
              timestamp: Date.now()
            }, '*');
          } catch (e) {}
        }, 1000);
      });
      
      // Phát hiện khi tài nguyên thay đổi
      const observer = new MutationObserver(function(mutations) {
        let significant = false;
        
        mutations.forEach(function(mutation) {
          // Chỉ báo cáo khi có thêm/xóa nút hoặc thay đổi thuộc tính quan trọng
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            significant = true;
          } else if (mutation.type === 'attributes' && 
                     (mutation.attributeName === 'style' || 
                      mutation.attributeName === 'class' || 
                      mutation.attributeName === 'src')) {
            significant = true;
          }
        });
        
        if (significant) {
          try {
            // Báo cáo rằng DOM đã thay đổi đáng kể
            window.parent.postMessage({
              type: 'GAME_DOM_UPDATED',
              timestamp: Date.now()
            }, '*');
          } catch (e) {}
        }
      });
      
      // Theo dõi thay đổi trong body và các thuộc tính
      observer.observe(document.body, { 
        childList: true, 
        subtree: true, 
        attributes: true,
        characterData: false,
        attributeFilter: ['style', 'class', 'src']
      });
    </script>
  `;

  const deviceDetectionScript = `
    <script>
      // Device detection
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      document.documentElement.classList.add(isTouchDevice ? 'touch-device' : 'no-touch');
      document.documentElement.classList.add(isMobile ? 'mobile' : 'desktop');
      
      // Cảnh báo về thiết bị và trình duyệt
      if (isMobile) {
        console.log('Mobile device detected: optimizing for touch input');
        
        // Disable zooming on double-tap
        let lastTapTime = 0;
        document.addEventListener('touchend', function(e) {
          const now = Date.now();
          if (now - lastTapTime < 300) {
            e.preventDefault();
          }
          lastTapTime = now;
        }, { passive: false });
      }
      
      // Capabilities detection
      const hasWebGL = (function() {
        try {
          const canvas = document.createElement('canvas');
          return !!window.WebGLRenderingContext && 
            (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
        } catch(e) {
          return false;
        }
      })();
      
      // Thêm class cho body để chỉ ra khả năng của trình duyệt
      document.documentElement.classList.add(hasWebGL ? 'has-webgl' : 'no-webgl');
      
      // Báo cáo thông tin thiết bị cho parent frame
      try {
        window.parent.postMessage({
          type: 'DEVICE_INFO',
          info: {
            userAgent: navigator.userAgent,
            isMobile: isMobile,
            isTouchDevice: isTouchDevice,
            hasWebGL: hasWebGL,
            screenSize: {
              width: window.screen.width,
              height: window.screen.height
            },
            viewportSize: {
              width: window.innerWidth,
              height: window.innerHeight
            },
            pixelRatio: window.devicePixelRatio || 1
          }
        }, '*');
      } catch (e) {}
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
            
            // Thử sửa lỗi canvas không hiển thị
            if (canvas.width === 0 || canvas.height === 0) {
              console.log('Fixing zero-sized canvas');
              // Đặt chiều rộng và chiều cao tối thiểu
              canvas.width = canvas.width || 300;
              canvas.height = canvas.height || 150;
              canvas.style.width = '100%';
              canvas.style.height = 'auto';
            }
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
      
      // Fix cho lỗi phổ biến với trình duyệt trên mobile
      setTimeout(function() {
        try {
          // Giải quyết vấn đề với viewport sai trên một số trình duyệt cũ
          const viewportMeta = document.querySelector('meta[name="viewport"]');
          if (viewportMeta) {
            viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
          }
          
          // Ngăn chặn lỗi vật lý trình duyệt trên iOS Safari
          document.addEventListener('touchmove', function(event) {
            if (event.scale !== 1) {
              event.preventDefault();
            }
          }, { passive: false });
          
          // Làm cho canvas resize đúng khi xoay màn hình
          window.addEventListener('resize', function() {
            const canvases = document.querySelectorAll('canvas');
            canvases.forEach(canvas => {
              // Lưu trữ context hiện tại
              const ctx = canvas.getContext('2d');
              if (!ctx) return;
              
              const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
              const oldWidth = canvas.width;
              const oldHeight = canvas.height;
              
              // Resize canvas dựa trên container
              const container = canvas.parentElement;
              if (container) {
                canvas.width = container.clientWidth;
                canvas.height = container.clientHeight || oldHeight * (container.clientWidth / oldWidth);
              }
              
              // Cố gắng lưu trữ/phục hồi hình ảnh
              try {
                ctx.putImageData(imageData, 0, 0);
              } catch (e) {
                // Bỏ qua nếu kích thước đã thay đổi và không thể phục hồi
              }
            });
          });
        } catch (e) {
          console.error('Error applying mobile fixes:', e);
        }
      }, 500);
    </script>
  `;

  const touchStyles = `
    <style>
      /* Base styles */
      body {
        margin: 0;
        padding: 0;
        overflow-x: hidden; /* Prevent scrolling */
        touch-action: manipulation; /* Prevent zooming on mobile */
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
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
      .touch-device a.button,
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
      
      /* Fallback styles cho nếu game không load được đúng */
      #game-fallback {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255,255,255,0.95);
        z-index: 1000;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 20px;
        text-align: center;
      }
      body:empty #game-fallback,
      html:not(.dom-loaded) #game-fallback {
        display: flex;
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
      
      /* Fix một số lỗi phổ biến */
      img {
        max-width: 100%;
        height: auto;
      }
      
      /* Đảm bảo các input fields hiển thị đúng */
      input, textarea, select {
        font-size: 16px; /* Ngăn iOS zoom vào input */
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
    
    <div id="game-fallback">
      <h3>Game đang tải...</h3>
      <p>Nếu trò chơi không xuất hiện sau vài giây, hãy thử các giải pháp sau:</p>
      <ul style="text-align:left;margin-top:10px">
        <li>Kiểm tra kết nối mạng</li>
        <li>Tải lại trang</li>
        <li>Sử dụng trình duyệt khác (Chrome hoặc Edge)</li>
      </ul>
      <button onclick="window.location.reload()" style="margin-top:20px;padding:10px 20px;background:#4a90e2;color:white;border:none;border-radius:4px;cursor:pointer;font-size:16px">
        Tải lại trang
      </button>
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
        
        // Ẩn fallback khi game đã tải
        const fallbackEl = document.getElementById('game-fallback');
        if (fallbackEl) {
          fallbackEl.style.display = 'none';
        }
      });
      
      // Xóa fallback sau timeout dài
      setTimeout(function() {
        const fallbackEl = document.getElementById('game-fallback');
        if (fallbackEl && fallbackEl.style.display !== 'none') {
          fallbackEl.style.display = 'none';
        }
      }, 8000);
      
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
      }, 3000);
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
  try {
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
  } catch (err) {
    console.error('Error generating enhanced HTML:', err);
    
    // Trả về nội dung với phần bọc tối thiểu nếu có lỗi
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title || 'Interactive Game'}</title>
  ${touchStyles}
</head>
<body>
  ${loadingIndicator}
  <div id="error-recovery-container">
    ${content}
  </div>
  ${errorHandlingScript}
</body>
</html>`;
  }
};
