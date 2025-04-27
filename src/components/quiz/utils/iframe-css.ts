
/**
 * Xử lý phần CSS của game trong iframe
 */

export const optimizeStyles = (cssContent: string): string => {
  // Thêm các styles mặc định để đảm bảo trải nghiệm tốt trên mobile
  const baseStyles = `
    * {
      box-sizing: border-box;
      -webkit-tap-highlight-color: transparent;
      margin: 0;
      padding: 0;
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
      background-color: #f8f9fa;
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

    /* Game elements common styles */
    .game-element {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      user-select: none;
    }

    /* Common text styles */
    .game-text,
    .text-element,
    .question-text,
    .answer-text,
    .card-text,
    .instruction-text {
      text-align: center;
      font-family: Arial, sans-serif;
      line-height: 1.4;
      margin: 0;
      padding: 0;
    }

    /* Wheel game styles - completely revised */
    .wheel-container {
      position: relative;
      width: 90%;
      max-width: 500px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    
    .wheel {
      transform-origin: center;
      transition: transform 3s cubic-bezier(0.2, 0.8, 0.2, 1);
    }
    
    /* Wheel segments and text */
    .wheel-segment {
      fill-opacity: 0.8;
      transition: fill-opacity 0.3s;
    }
    
    .wheel-segment:hover {
      fill-opacity: 1;
    }
    
    .segment-text {
      font-weight: bold;
      font-size: 14px;
      fill: #fff;
      pointer-events: none;
      text-anchor: middle;
      dominant-baseline: central;
      filter: drop-shadow(1px 1px 1px rgba(0,0,0,0.5));
    }
    
    /* Wheel pointer styles */
    .wheel-pointer {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 30px;
      height: 30px;
      z-index: 10;
    }
    
    /* Result display */
    .result-display {
      margin-top: 20px;
      padding: 10px 20px;
      font-size: 1.5rem;
      font-weight: bold;
      text-align: center;
      min-height: 60px;
      background-color: rgba(255,255,255,0.8);
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    /* Buttons */
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
      background-color: #3498db;
      color: white;
      border: none;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }

    button:hover {
      background-color: #2980b9;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    }

    button:active {
      transform: translateY(0);
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    /* SVG text alignment */
    svg text {
      text-anchor: middle;
      dominant-baseline: central;
      alignment-baseline: middle;
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
      .wheel-container {
        width: 90%;
      }
      
      .segment-text {
        font-size: 12px;
      }
      
      .result-display {
        font-size: 1.2rem;
        padding: 8px 16px;
      }
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

    /* Word wrap */
    .word-wrap {
      word-wrap: break-word;
      overflow-wrap: break-word;
      hyphens: auto;
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
