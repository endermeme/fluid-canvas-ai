
/**
 * Mô-đun chứa các scripts được thêm vào iframe để hỗ trợ trò chơi
 */

/**
 * Script xử lý lỗi và thông báo khi game đã tải xong
 */
export const errorHandlingScript = `
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
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'GAME_LOADED', success: true }, '*');
      }
      
      setTimeout(function() {
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({ type: 'GAME_LOADED', success: true }, '*');
        }
      }, 500);
    } catch (err) {
      console.error('Error notifying parent:', err);
    }
  });

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
</script>
`;

/**
 * Script phát hiện thiết bị và tối ưu hóa cho touch
 */
export const deviceDetectionScript = `
<script>
  (function() {
    // Device detection
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    document.documentElement.classList.add(isTouchDevice ? 'touch-device' : 'no-touch');
    document.documentElement.classList.add(isMobile ? 'mobile' : 'desktop');
    
    // Xử lý sự kiện touch để tránh double tap zoom
    if (isTouchDevice && !window.touchHandlerInitialized) {
      window.touchHandlerInitialized = true;
      let touchLastTap = 0;
      
      document.addEventListener('touchend', (e) => {
        const now = Date.now();
        if (now - touchLastTap < 300) {
          e.preventDefault();
        }
        touchLastTap = now;
      }, { passive: false });
    }
  })();
</script>
`;

/**
 * Script helper cho các chức năng phổ biến của game
 */
export const iframeHelperScript = `
<script>
  (function() {
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
        if (window.isTouchDevice && !btn.getAttribute('data-touch-optimized')) {
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
    window.centerElement = function(element) {
      if (!element) return;
      element.style.position = element.style.position || 'absolute';
      element.style.left = '50%';
      element.style.top = '50%';
      element.style.transform = 'translate(-50%, -50%)';
    };
    
    window.animateElement = function(element, keyframes, options) {
      if (!element || !keyframes) return;
      try {
        if (typeof element.animate === 'function') {
          return element.animate(keyframes, options);
        }
      } catch (err) {
        console.error('Animation error:', err);
      }
    };
    
    window.shake = function(element, intensity = 5, duration = 500) {
      if (!element) return;
      const originalTransform = element.style.transform || '';
      
      const backup = {
        transform: originalTransform,
        transition: element.style.transition
      };
      
      let start = null;
      const step = (timestamp) => {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        
        if (progress < duration) {
          const x = Math.sin(progress / 10) * intensity;
          element.style.transform = originalTransform + ' translateX(' + x + 'px)';
          requestAnimationFrame(step);
        } else {
          element.style.transform = backup.transform;
          element.style.transition = backup.transition;
        }
      };
      
      requestAnimationFrame(step);
    };
  })();
</script>
`;

/**
 * Script cho loading indicator
 */
export const loadingScript = `
<div id="loading-indicator" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(255,255,255,0.9);display:flex;align-items:center;justify-content:center;z-index:9999;">
  <div style="text-align:center">
    <div style="width:40px;height:40px;border:3px solid #333;border-radius:50%;border-top-color:transparent;margin:0 auto;animation:spin 1s linear infinite"></div>
    <p style="margin-top:10px;font-family:sans-serif;">Loading game...</p>
  </div>
</div>
<style>
  @keyframes spin { 
    0% { transform: rotate(0deg); } 
    100% { transform: rotate(360deg); } 
  }
  .hidden { 
    opacity: 0; 
    pointer-events: none; 
    transition: opacity 0.5s ease; 
  }
</style>
<script>
  (function() {
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
    
    document.body.classList.add('game-loaded');

    // Bảo vệ để đảm bảo nội dung được hiển thị
    setTimeout(function() {
      try {
        if (document.body.innerText.trim() === '' || document.body.childElementCount <= 1) {
          document.body.innerHTML = '<div style="text-align:center;padding:20px;font-family:sans-serif;"><h3>Không thể tải nội dung game</h3><p>Vui lòng thử làm mới trang</p><button onclick="window.location.reload()" style="padding:10px 20px;background:#4a90e2;color:white;border:none;border-radius:4px;cursor:pointer;">Tải lại</button></div>';
        }
      } catch(e) {
        console.error('Error checking content:', e);
      }
    }, 3000);
  })();
</script>
`;
