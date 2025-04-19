
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
