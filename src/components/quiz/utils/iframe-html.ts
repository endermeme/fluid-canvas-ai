
/**
 * Xử lý phần HTML của game trong iframe
 */

export const createHtmlStructure = (htmlContent: string, title: string = 'Game'): string => {
  // Xử lý các thẻ meta cần thiết
  return `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <title>${title}</title>
      <!-- CSS sẽ được chèn ở đây -->
      <style id="game-styles"></style>
    </head>
    <body>
      ${htmlContent || '<div id="game-container"></div>'}
      <!-- JavaScript sẽ được chèn ở đây -->
      <script id="game-script"></script>
    </body>
    </html>
  `;
};

/**
 * Trích xuất nội dung HTML từ phản hồi API
 */
export const extractHtmlContent = (apiResponse: string): string => {
  try {
    // Tìm nội dung HTML giữa thẻ <HTML>...</HTML>
    const htmlRegex = /<HTML>([\s\S]*?)<\/HTML>/i;
    const htmlMatch = apiResponse.match(htmlRegex);
    
    if (htmlMatch && htmlMatch[1]) {
      return htmlMatch[1].trim();
    }
    
    // Nếu không tìm thấy định dạng chuẩn, thử tìm trong các cách đánh dấu khác
    const alternativeRegex = /```html([\s\S]*?)```/i;
    const alternativeMatch = apiResponse.match(alternativeRegex);
    
    if (alternativeMatch && alternativeMatch[1]) {
      return alternativeMatch[1].trim();
    }
    
    return '';
  } catch (error) {
    console.error('Error extracting HTML content:', error);
    return '';
  }
};
