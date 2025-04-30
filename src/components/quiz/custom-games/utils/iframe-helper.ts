
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
        window.onload = function() {
          setTimeout(() => {
            window.parent.postMessage({ type: 'GAME_LOADED' }, '*');
            console.log('Game loaded notification sent');
          }, 100);
        };
      } catch (e) {
        console.error('Error sending loaded notification', e);
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
        
        return true; // Ngăn chặn hiển thị lỗi mặc định của trình duyệt
      };
    </script>
  `;

  // Chèn script vào trước thẻ </body>
  if (content.includes('</body>')) {
    return content.replace('</body>', `${errorHandlingScript}</body>`);
  } else {
    return content + errorHandlingScript;
  }
};
