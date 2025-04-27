
/**
 * Xử lý phần JavaScript của game trong iframe
 */

export const enhanceScript = (jsContent: string): string => {
  // Thêm sandbox để tránh các vấn đề bảo mật
  const enhancementWrapper = `
    // Đảm bảo môi trường an toàn
    try {
      // Auto-reload prevention
      window.addEventListener('error', function(e) {
        e.preventDefault();
        console.error('Game error:', e.message);
        if (window.parent) {
          window.parent.postMessage({
            type: 'game-error',
            message: e.message
          }, '*');
        }
        return true;
      });

      // Wrapped game code
      ${jsContent}
      
      // Thông báo game đã sẵn sàng
      if (window.parent) {
        window.parent.postMessage({
          type: 'game-loaded'
        }, '*');
      }
      
    } catch (gameError) {
      console.error('Game initialization error:', gameError);
      if (window.parent) {
        window.parent.postMessage({
          type: 'game-error',
          message: gameError.message
        }, '*');
      }
    }
  `;
  
  return enhancementWrapper;
};

/**
 * Trích xuất nội dung JavaScript từ phản hồi API
 */
export const extractJsContent = (apiResponse: string): string => {
  try {
    // Tìm nội dung JavaScript giữa thẻ <JAVASCRIPT>...</JAVASCRIPT>
    const jsRegex = /<JAVASCRIPT>([\s\S]*?)<\/JAVASCRIPT>/i;
    const jsMatch = apiResponse.match(jsRegex);
    
    if (jsMatch && jsMatch[1]) {
      return jsMatch[1].trim();
    }
    
    // Nếu không tìm thấy định dạng chuẩn, thử tìm trong các cách đánh dấu khác
    const alternativeRegex = /```js(?:cript)?([\s\S]*?)```/i;
    const alternativeMatch = apiResponse.match(alternativeRegex);
    
    if (alternativeMatch && alternativeMatch[1]) {
      return alternativeMatch[1].trim();
    }
    
    return '';
  } catch (error) {
    console.error('Error extracting JavaScript content:', error);
    return '';
  }
};
