
/**
 * Các hàm tiện ích để làm việc với iframe trong custom games
 */

/**
 * Thêm script vào iframe để gửi thông báo khi game đã tải xong
 */
export const injectLoadingCompleteScript = (content: string): string => {
  const loadingScript = `
    <script>
      // Thông báo cho parent window biết game đã tải xong
      try {
        // Sử dụng nhiều cơ chế để thông báo game đã tải xong
        window.onload = function() {
          sendLoadedNotification('window.onload');
        };
        
        document.addEventListener('DOMContentLoaded', function() {
          sendLoadedNotification('DOMContentLoaded');
        });
        
        // Thông báo ngay lập tức nếu document đã ready
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
          setTimeout(() => sendLoadedNotification('immediate'), 100);
        }
        
        // Thêm thời gian chờ dự phòng để đảm bảo thông báo được gửi
        setTimeout(() => sendLoadedNotification('timeout-backup'), 1500);
        
        function sendLoadedNotification(source) {
          try {
            window.parent.postMessage({ 
              type: 'GAME_LOADED', 
              source: source,
              timestamp: Date.now() 
            }, '*');
            console.log('Game loaded notification sent from: ' + source);
          } catch (err) {
            console.error('Error sending loaded notification:', err);
          }
        }
      } catch (e) {
        console.error('Error setting up load notifications', e);
      }
    </script>
  `;

  // Chèn script vào trước thẻ </body>
  if (content.includes('</body>')) {
    return content.replace('</body>', `${loadingScript}</body>`);
  } else {
    return content + loadingScript;
  }
};

/**
 * Thêm meta tag và các style cần thiết để game hiển thị tốt trên mobile
 */
export const addMobileOptimization = (content: string): string => {
  const mobileMetaTag = '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">';
  
  // Thêm meta tag nếu chưa có
  if (!content.includes('viewport')) {
    if (content.includes('</head>')) {
      content = content.replace('</head>', `${mobileMetaTag}</head>`);
    } else if (content.includes('<body')) {
      const bodyPos = content.indexOf('<body');
      content = content.substring(0, bodyPos) + `<head>${mobileMetaTag}</head>` + content.substring(bodyPos);
    }
  }
  
  // Thêm style để game chiếm hết màn hình và không có căn lề
  const fullscreenStyle = `
    <style>
      html, body {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }
      * { touch-action: manipulation; }
      
      /* Thêm style để khắc phục vấn đề trống trắng */
      body:empty::before {
        content: "Đang tải nội dung...";
        display: block;
        text-align: center;
        padding: 20px;
        font-family: sans-serif;
      }
      
      /* Style để khắc phục lỗi hiển thị canvas */
      canvas {
        display: block;
        margin: 0 auto;
        max-width: 100%;
      }
    </style>
  `;
  
  if (content.includes('</head>')) {
    content = content.replace('</head>', `${fullscreenStyle}</head>`);
  } else if (content.includes('<body')) {
    const bodyPos = content.indexOf('<body');
    content = content.substring(0, bodyPos) + `<head>${fullscreenStyle}</head>` + content.substring(bodyPos);
  }
  
  return content;
};

/**
 * Thêm error handling cho iframe content
 */
export const addErrorHandling = (content: string): string => {
  const errorHandlingScript = `
    <script>
      // Bắt và ghi lại các lỗi
      window.onerror = function(message, source, lineno, colno, error) {
        console.error('Game error:', { message, source, lineno, colno, error });
        
        // Hiển thị lỗi nếu ở môi trường phát triển
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
          const errorContainer = document.createElement('div');
          errorContainer.style.position = 'fixed';
          errorContainer.style.bottom = '10px';
          errorContainer.style.right = '10px';
          errorContainer.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
          errorContainer.style.color = 'white';
          errorContainer.style.padding = '10px';
          errorContainer.style.borderRadius = '5px';
          errorContainer.style.fontFamily = 'monospace';
          errorContainer.style.fontSize = '12px';
          errorContainer.style.maxWidth = '80%';
          errorContainer.style.zIndex = '9999';
          errorContainer.textContent = \`Error: \${message} at line \${lineno}:\${colno}\`;
          document.body.appendChild(errorContainer);
          
          setTimeout(() => {
            errorContainer.remove();
          }, 5000);
        }
        
        // Báo lỗi cho parent window để xử lý
        try {
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
        } catch (e) {
          console.error('Error sending error to parent:', e);
        }
        
        return true; // Ngăn chặn hiển thị lỗi mặc định của trình duyệt
      };
      
      // Cảnh báo về lỗi unhandled rejection
      window.addEventListener('unhandledrejection', function(event) {
        console.error('Unhandled promise rejection:', event.reason);
        
        // Báo lỗi cho parent window
        try {
          window.parent.postMessage({
            type: 'GAME_ERROR',
            error: {
              message: 'Unhandled Promise Rejection',
              reason: String(event.reason)
            }
          }, '*');
        } catch (e) {
          console.error('Error sending rejection to parent:', e);
        }
      });
    </script>
  `;

  // Chèn script vào trước thẻ </body>
  if (content.includes('</body>')) {
    return content.replace('</body>', `${errorHandlingScript}</body>`);
  } else {
    return content + errorHandlingScript;
  }
};

/**
 * Thêm các chức năng theo dõi hoạt động game để phát hiện sự cố hang
 */
export const addGameMonitoring = (content: string): string => {
  const monitoringScript = `
    <script>
      // Giám sát hoạt động game
      (function() {
        let lastUpdateTime = Date.now();
        let isResponsive = true;
        
        // Kiểm tra trạng thái game mỗi 2 giây
        const checkInterval = setInterval(() => {
          const now = Date.now();
          
          // Cập nhật thời gian hoạt động
          document.body.addEventListener('mousemove', updateLastActivity);
          document.body.addEventListener('click', updateLastActivity);
          document.body.addEventListener('keydown', updateLastActivity);
          document.body.addEventListener('touchstart', updateLastActivity);
          
          function updateLastActivity() {
            lastUpdateTime = Date.now();
            
            if (!isResponsive) {
              isResponsive = true;
              try {
                window.parent.postMessage({ type: 'GAME_RESPONSIVE', timestamp: Date.now() }, '*');
              } catch (err) {}
            }
          }
          
          // Nếu không có hoạt động trong 30 giây
          if (now - lastUpdateTime > 30000 && isResponsive) {
            isResponsive = false;
            try {
              window.parent.postMessage({ 
                type: 'GAME_UNRESPONSIVE',
                lastActivity: lastUpdateTime
              }, '*');
            } catch (err) {
              console.error('Error sending unresponsive status:', err);
            }
          }
        }, 2000);
        
        // Ping parent định kỳ để báo game vẫn đang hoạt động
        setInterval(() => {
          try {
            window.parent.postMessage({ 
              type: 'GAME_PING',
              timestamp: Date.now(),
              memoryUsage: performance?.memory?.usedJSHeapSize || 'unknown'
            }, '*');
          } catch (err) {}
        }, 5000);
        
        // Dọn dẹp khi game bị hủy
        window.addEventListener('beforeunload', () => {
          clearInterval(checkInterval);
          try {
            window.parent.postMessage({ type: 'GAME_UNLOADED' }, '*');
          } catch (err) {}
        });
      })();
    </script>
  `;
  
  // Chèn script vào trước thẻ </body>
  if (content.includes('</body>')) {
    return content.replace('</body>', `${monitoringScript}</body>`);
  } else {
    return content + monitoringScript;
  }
};

/**
 * Thêm tính năng offline fallback
 */
export const addOfflineFallback = (content: string): string => {
  const offlineScript = `
    <script>
      // Kiểm tra kết nối mạng và cung cấp fallback khi mất kết nối
      window.addEventListener('offline', function() {
        console.log('Game is now offline');
        showOfflineNotification();
      });
      
      window.addEventListener('online', function() {
        console.log('Game is back online');
        hideOfflineNotification();
      });
      
      function showOfflineNotification() {
        if (document.getElementById('offline-notification')) return;
        
        const notification = document.createElement('div');
        notification.id = 'offline-notification';
        notification.style.cssText = 'position:fixed;top:0;left:0;right:0;background:#f44336;color:white;text-align:center;padding:10px;z-index:10000;';
        notification.innerHTML = 'Bạn đang offline. Một số tính năng có thể không hoạt động.';
        document.body.appendChild(notification);
        
        try {
          window.parent.postMessage({ type: 'GAME_OFFLINE' }, '*');
        } catch (e) {}
      }
      
      function hideOfflineNotification() {
        const notification = document.getElementById('offline-notification');
        if (notification) {
          notification.remove();
        }
        
        try {
          window.parent.postMessage({ type: 'GAME_ONLINE' }, '*');
        } catch (e) {}
      }
      
      // Kiểm tra trạng thái mạng ngay khi game tải
      if (!navigator.onLine) {
        showOfflineNotification();
      }
    </script>
  `;
  
  // Chèn script vào trước thẻ </body>
  if (content.includes('</body>')) {
    return content.replace('</body>', `${offlineScript}</body>`);
  } else {
    return content + offlineScript;
  }
};

/**
 * Tối ưu hóa quá trình tải cho game trong iframe
 */
export const optimizeGameLoading = (content: string): string => {
  const optimizationScript = `
    <script>
      // Preload và tối ưu tài nguyên
      (function() {
        // Tạo preloads cho các hình ảnh
        const imgRegex = /<img[^>]+src=['"]([^'"]+)['"]/g;
        let match;
        
        while ((match = imgRegex.exec(document.body.innerHTML)) !== null) {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'image';
          link.href = match[1];
          document.head.appendChild(link);
        }
        
        // Đặt độ ưu tiên thấp cho các hình ảnh không nằm trong viewport
        const lazyLoadImages = () => {
          const inViewport = (el) => {
            const rect = el.getBoundingClientRect();
            return (
              rect.top >= 0 &&
              rect.left >= 0 &&
              rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
              rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
          };
          
          document.querySelectorAll('img:not([loading])').forEach(img => {
            if (!inViewport(img)) {
              img.setAttribute('loading', 'lazy');
            }
          });
        };
        
        // Thêm defer cho các script không quan trọng
        document.querySelectorAll('script:not([src])').forEach(script => {
          if (!script.textContent.includes('window.onload') && 
              !script.textContent.includes('DOMContentLoaded')) {
            script.defer = true;
          }
        });
        
        // Gọi lazy load sau khi trang đã tải xong
        if (document.readyState === 'complete') {
          lazyLoadImages();
        } else {
          window.addEventListener('load', lazyLoadImages);
        }
        
        // Thông báo tài nguyên đã tải xong
        window.addEventListener('load', () => {
          console.log('All resources loaded');
          // Tính toán thời gian tải
          const loadTime = window.performance 
            ? Math.round(performance.now()) 
            : 'unknown';
          
          try {
            window.parent.postMessage({ 
              type: 'GAME_RESOURCES_LOADED', 
              loadTime: loadTime
            }, '*');
          } catch (e) {}
        });
      })();
    </script>
  `;
  
  // Chèn script vào trước thẻ </body>
  if (content.includes('</body>')) {
    return content.replace('</body>', `${optimizationScript}</body>`);
  } else {
    return content + optimizationScript;
  }
};

/**
 * Xử lý và tối ưu nội dung HTML cho iframe
 * Hàm chính để xử lý toàn bộ nội dung trước khi đưa vào iframe
 */
export const processIframeContent = (content: string, title?: string): string => {
  if (!content || typeof content !== 'string') {
    console.error('Nội dung iframe không hợp lệ:', content);
    return `<!DOCTYPE html>
      <html>
        <head><title>Lỗi nội dung</title></head>
        <body>
          <div style="text-align:center;padding:20px;">
            <h3>Không thể tải nội dung game</h3>
            <p>Nội dung game không hợp lệ hoặc bị trống.</p>
          </div>
        </body>
      </html>`;
  }
  
  // Chuẩn hoá mã nguồn
  let processedContent = content.trim();
  
  // Đảm bảo mã HTML có cấu trúc đúng
  if (!processedContent.includes('<!DOCTYPE') && !processedContent.includes('<html')) {
    processedContent = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>${title || 'Interactive Game'}</title>
</head>
<body>
  ${processedContent}
</body>
</html>`;
  }
  
  // Áp dụng các cải tiến
  processedContent = injectLoadingCompleteScript(processedContent);
  processedContent = addMobileOptimization(processedContent);
  processedContent = addErrorHandling(processedContent);
  processedContent = addGameMonitoring(processedContent);
  processedContent = addOfflineFallback(processedContent);
  processedContent = optimizeGameLoading(processedContent);
  
  return processedContent;
};
