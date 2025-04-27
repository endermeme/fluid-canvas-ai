
/**
 * Xử lý phần JavaScript của game trong iframe
 */

export const enhanceScript = (jsContent: string): string => {
  // Thêm các chức năng xử lý logic cho vòng quay và game khác
  const additionalFunctions = `
    // Hàm xác định chính xác vị trí quay dừng cho vòng quay
    if (typeof determineWheelResult === 'undefined') {
      function determineWheelResult(finalAngle, segments) {
        // Chuẩn hóa góc về 0-2PI và điều chỉnh cho hướng xoay
        let normalizedAngle = finalAngle % (2 * Math.PI);
        if (normalizedAngle < 0) normalizedAngle += 2 * Math.PI;
        
        // Góc của mỗi phần
        const segmentAngle = (2 * Math.PI) / segments.length;
        
        // Vị trí muỗi tên (thường ở trên cùng - PI/2)
        const pointerAngle = 1.5 * Math.PI; // Con trỏ ở vị trí trên cùng
        
        // Tính góc tương đối với vị trí con trỏ
        let relativeAngle = (pointerAngle - normalizedAngle) % (2 * Math.PI);
        if (relativeAngle < 0) relativeAngle += 2 * Math.PI;
        
        // Xác định phân khúc
        const segmentIndex = Math.floor(relativeAngle / segmentAngle);
        
        // Kiểm tra tính hợp lệ của chỉ số
        if (segmentIndex >= 0 && segmentIndex < segments.length) {
          return segments[segmentIndex];
        }
        
        // Trường hợp không tìm thấy phân khúc phù hợp
        console.error('Không thể xác định kết quả vòng quay');
        return segments[0];
      }
    }
  `;
  
  // Thêm sandbox để tránh các vấn đề bảo mật
  const enhancementWrapper = `
    // Đảm bảo môi trường an toàn
    try {
      // Thêm các hàm hỗ trợ
      ${additionalFunctions}
      
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
  
  // Sửa lỗi phổ biến trong logic vòng quay
  let fixedScript = jsContent
    .replace(
      /const finalAngle = currentAngle % \(2 \* Math\.PI\);/g,
      `// Chuẩn hóa góc về khoảng 0-2PI
      let finalAngle = currentAngle % (2 * Math.PI);
      if (finalAngle < 0) finalAngle += 2 * Math.PI;`
    )
    .replace(
      /function determineResult\(\)/g,
      `function determineResult() {
        // Sử dụng hàm cải tiến để xác định kết quả
        if (typeof determineWheelResult === 'function') {
          const result = determineWheelResult(currentAngle, segments);
          resultDisplay.textContent = result ? result.label : 'Hãy thử lại!';
          return;
        }`
    );
  
  // Thêm hàm cải tiến vào mã nguồn
  return enhancementWrapper.replace('${jsContent}', fixedScript);
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
