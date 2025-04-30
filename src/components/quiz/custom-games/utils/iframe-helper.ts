
/**
 * Các hàm tiện ích đơn giản để làm việc với iframe trong custom games
 * File đã được đơn giản hóa - loại bỏ tất cả các hàm sửa lỗi và chỉnh sửa HTML
 */

/**
 * Thêm script vào iframe để gửi thông báo khi game đã tải xong
 */
export const injectLoadingCompleteScript = (content: string): string => {
  const loadingScript = `
    <script>
      // Thông báo cho parent window biết game đã tải xong
      window.onload = function() {
        try {
          window.parent.postMessage({ type: 'GAME_LOADED' }, '*');
          console.log('Game loaded notification sent');
        } catch (e) {
          console.error('Error sending loaded notification:', e);
        }
      };
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
  
  // Thêm thông báo khi game đã tải xong
  processedContent = injectLoadingCompleteScript(processedContent);
  
  return processedContent;
};
