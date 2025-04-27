
/**
 * Xử lý phần CSS của game trong iframe
 */

export const optimizeStyles = (cssContent: string): string => {
  // Thêm các styles mặc định để đảm bảo trải nghiệm tốt trên mobile
  const baseStyles = `
    * {
      box-sizing: border-box;
      -webkit-tap-highlight-color: transparent;
      position: relative;
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
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    /* Cải thiện hiển thị văn bản cho tất cả các game */
    .game-text,
    .text-element,
    text,
    .question-text,
    .answer-text,
    .card-text,
    .instruction-text {
      text-align: center;
      font-family: Arial, sans-serif;
      transform-origin: center;
      line-height: 1.4;
      margin: 0;
      padding: 0;
    }

    /* SVG text alignment */
    svg text,
    .svg-text {
      text-anchor: middle;
      dominant-baseline: middle;
      alignment-baseline: middle;
    }

    /* Wheel game specific */
    .wheel-segment text,
    .wheel-text {
      transform-origin: center !important;
      text-anchor: middle !important;
      dominant-baseline: central !important;
      alignment-baseline: middle !important;
      font-weight: bold;
    }

    /* Game elements common styles */
    .game-element {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      user-select: none;
    }

    /* Interactive elements */
    button, 
    [role="button"],
    .clickable {
      min-width: 44px;
      min-height: 44px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.5rem 1rem;
      border-radius: 0.25rem;
      font-weight: 500;
      transition: all 0.2s ease;
      user-select: none;
      -webkit-user-select: none;
    }

    /* Game cards common styles */
    .card {
      perspective: 1000px;
      transform-style: preserve-3d;
      transition: transform 0.6s;
    }

    .card-front,
    .card-back {
      backface-visibility: hidden;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
    }

    /* Responsive grid layouts */
    .game-grid {
      display: grid;
      gap: 1rem;
      width: 100%;
      max-width: 100%;
      margin: 0 auto;
      padding: 1rem;
    }

    /* Ensure proper text wrapping */
    .word-wrap {
      word-wrap: break-word;
      overflow-wrap: break-word;
      hyphens: auto;
    }

    /* Animations */
    .animated {
      animation-duration: 0.3s;
      animation-fill-mode: both;
    }

    @media (max-width: 768px) {
      .game-text,
      .text-element {
        font-size: 0.9em;
      }
      
      .game-grid {
        gap: 0.5rem;
        padding: 0.5rem;
      }
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
