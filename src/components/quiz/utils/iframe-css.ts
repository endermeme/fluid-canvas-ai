
/**
 * Xử lý phần CSS của game trong iframe
 */

export const optimizeStyles = (cssContent: string): string => {
  // Thêm các styles mặc định để đảm bảo trải nghiệm tốt trên mobile
  const baseStyles = `
    * {
      box-sizing: border-box;
      -webkit-tap-highlight-color: transparent;
    }
    
    body {
      margin: 0;
      padding: 0;
      overflow: hidden;
      font-family: Arial, sans-serif;
      touch-action: manipulation;
      height: 100vh;
      width: 100vw;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    
    #game-container {
      width: 100%;
      height: 100%;
      max-width: 800px;
      position: relative;
      margin: 0 auto;
    }

    button, [role="button"] {
      min-width: 44px;
      min-height: 44px;
      cursor: pointer;
    }
  `;
  
  // Kết hợp styles mặc định với styles từ API
  return baseStyles + '\n\n' + cssContent;
};

/**
 * Trích xuất nội dung CSS từ phản hồi API
 */
export const extractCssContent = (apiResponse: string): string => {
  try {
    // Tìm nội dung CSS giữa thẻ <CSS>...</CSS>
    const cssRegex = /<CSS>([\s\S]*?)<\/CSS>/i;
    const cssMatch = apiResponse.match(cssRegex);
    
    if (cssMatch && cssMatch[1]) {
      return cssMatch[1].trim();
    }
    
    // Nếu không tìm thấy định dạng chuẩn, thử tìm trong các cách đánh dấu khác
    const alternativeRegex = /```css([\s\S]*?)```/i;
    const alternativeMatch = apiResponse.match(alternativeRegex);
    
    if (alternativeMatch && alternativeMatch[1]) {
      return alternativeMatch[1].trim();
    }
    
    return '';
  } catch (error) {
    console.error('Error extracting CSS content:', error);
    return '';
  }
};
