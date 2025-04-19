
/**
 * Module xử lý iframe và hiển thị nội dung game
 */

/**
 * Nâng cao nội dung iframe với các tính năng bổ sung
 */
export const enhanceIframeContent = (content: string, title: string = 'Interactive Game'): string => {
  if (!content) return '';
  
  try {
    // Thêm tập lệnh giao tiếp với ứng dụng chính nếu chưa có
    if (!content.includes('window.parent.postMessage')) {
      const communicationScript = `
<script>
// Communication with parent window
function sendGameStats(stats) {
  if (window.parent) {
    window.parent.postMessage({
      type: 'gameStats',
      payload: stats
    }, '*');
  }
}

// Khi game hoàn thành
function gameCompleted(score) {
  sendGameStats({
    completed: true,
    score: score,
    totalTime: performance.now() / 1000
  });
}

// Khi game bắt đầu
document.addEventListener('DOMContentLoaded', function() {
  // Đảm bảo tất cả các liên kết mở trong tab mới
  document.querySelectorAll('a').forEach(link => {
    if (link.getAttribute('href') && !link.getAttribute('target')) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    }
  });
  
  // Ghi lại bắt đầu trò chơi
  sendGameStats({
    started: true,
    timestamp: new Date().toISOString()
  });
});
</script>`;

      // Chèn vào trước thẻ đóng </body>
      if (content.includes('</body>')) {
        content = content.replace('</body>', `${communicationScript}\n</body>`);
      } else {
        content += communicationScript;
      }
    }
    
    // Đảm bảo sandbox cho iframe
    if (!content.includes('<meta http-equiv="Content-Security-Policy"')) {
      const cspMeta = `<meta http-equiv="Content-Security-Policy" content="default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: https:;">`;
      
      if (content.includes('</head>')) {
        content = content.replace('</head>', `  ${cspMeta}\n</head>`);
      } else if (content.includes('<head>')) {
        content = content.replace('<head>', `<head>\n  ${cspMeta}`);
      }
    }
    
    return content;
  } catch (error) {
    console.error('Error enhancing iframe content:', error);
    return content;
  }
};

/**
 * Xử lý các sự kiện từ iframe
 */
export const setupIframeEventListener = (callback: (data: any) => void): () => void => {
  const messageHandler = (event: MessageEvent) => {
    if (event.data && typeof event.data === 'object') {
      callback(event.data);
    }
  };
  
  window.addEventListener('message', messageHandler);
  
  // Return cleanup function
  return () => window.removeEventListener('message', messageHandler);
};

/**
 * Làm mới iframe
 */
export const reloadIframe = (iframeRef: React.RefObject<HTMLIFrameElement>, content: string): boolean => {
  try {
    if (iframeRef.current) {
      // Clearing iframe
      iframeRef.current.src = 'about:blank';
      
      // Set new content after a small delay
      setTimeout(() => {
        if (iframeRef.current) {
          iframeRef.current.srcdoc = content;
        }
      }, 100);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error reloading iframe:', error);
    return false;
  }
};

/**
 * Thiết lập iframe
 */
export const setupIframe = (iframeElement: HTMLIFrameElement, content: string): void => {
  if (!iframeElement) return;
  
  try {
    iframeElement.srcdoc = content;
  } catch (error) {
    console.error('Error setting iframe content:', error);
  }
};

/**
 * Thêm công cụ debug vào nội dung iframe
 */
export const injectDebugUtils = (content: string): string => {
  if (!content) return '';
  
  try {
    // Thêm công cụ debug nếu chưa có
    if (!content.includes('console.gameLog')) {
      const debugScript = `
<script>
// Debug utilities
window.gameErrors = [];
window.gameWarnings = [];
window.gameInfos = [];

// Ghi đè console để ghi lại lỗi
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
const originalConsoleLog = console.log;
const originalConsoleInfo = console.info;

console.error = function() {
  window.gameErrors.push(Array.from(arguments).join(' '));
  originalConsoleError.apply(console, arguments);
  
  // Gửi lỗi đến cửa sổ chính
  if (window.parent) {
    window.parent.postMessage({
      type: 'gameError',
      payload: Array.from(arguments).join(' ')
    }, '*');
  }
};

console.warn = function() {
  window.gameWarnings.push(Array.from(arguments).join(' '));
  originalConsoleWarn.apply(console, arguments);
};

console.info = function() {
  window.gameInfos.push(Array.from(arguments).join(' '));
  originalConsoleInfo.apply(console, arguments);
};

console.gameLog = function(type, message) {
  switch(type) {
    case 'error':
      console.error(message);
      break;
    case 'warn':
      console.warn(message);
      break;
    case 'info':
      console.info(message);
      break;
    default:
      originalConsoleLog(message);
  }
};

// Lắng nghe lỗi không bắt được
window.addEventListener('error', function(event) {
  console.error('Uncaught error:', event.message);
});
</script>`;

      // Chèn vào sau mở thẻ <head>
      if (content.includes('<head>')) {
        content = content.replace('<head>', `<head>\n${debugScript}`);
      } else if (content.includes('<!DOCTYPE html>')) {
        content = content.replace('<!DOCTYPE html>', `<!DOCTYPE html>\n<head>${debugScript}</head>`);
      } else {
        content = `<head>${debugScript}</head>${content}`;
      }
    }
    
    return content;
  } catch (error) {
    console.error('Error injecting debug utils:', error);
    return content;
  }
};
