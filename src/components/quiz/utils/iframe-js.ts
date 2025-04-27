
/**
 * Xử lý phần JavaScript của game trong iframe
 */

export const enhanceScript = (jsContent: string): string => {
  // Thêm các chức năng xử lý logic cho vòng quay và game khác
  const additionalFunctions = `
    // Hàm xác định chính xác vị trí quay dừng cho vòng quay
    if (typeof window.determineWheelResult === 'undefined') {
      window.determineWheelResult = function(finalAngle, segments) {
        // Chuẩn hóa góc về 0-2PI và điều chỉnh cho hướng xoay
        let normalizedAngle = finalAngle % (2 * Math.PI);
        if (normalizedAngle < 0) normalizedAngle += 2 * Math.PI;
        
        // Góc của mỗi phần
        const segmentAngle = (2 * Math.PI) / segments.length;
        
        // Vị trí mũi tên (thường ở trên cùng - PI/2)
        const pointerAngle = 1.5 * Math.PI; // Con trỏ ở vị trí trên cùng
        
        // Tính góc tương đối với vị trí con trỏ
        let relativeAngle = (pointerAngle - normalizedAngle) % (2 * Math.PI);
        if (relativeAngle < 0) relativeAngle += 2 * Math.PI;
        
        // Xác định phân khúc
        const segmentIndex = Math.floor(relativeAngle / segmentAngle);
        
        console.log('Góc cuối cùng:', finalAngle);
        console.log('Góc chuẩn hóa:', normalizedAngle);
        console.log('Số phân khúc:', segments.length);
        console.log('Góc mỗi phân khúc:', segmentAngle);
        console.log('Chỉ số phân khúc:', segmentIndex);
        
        // Kiểm tra tính hợp lệ của chỉ số
        if (segmentIndex >= 0 && segmentIndex < segments.length) {
          console.log('Kết quả:', segments[segmentIndex]);
          return segments[segmentIndex];
        }
        
        // Trường hợp không tìm thấy phân khúc phù hợp
        console.error('Không thể xác định kết quả vòng quay');
        return segments[0];
      }
    }
    
    // Hàm trợ giúp định vị text trong wheel segment
    if (typeof window.positionWheelTexts === 'undefined') {
      window.positionWheelTexts = function() {
        const wheelTexts = document.querySelectorAll('.segment-text');
        if (wheelTexts.length === 0) return;
        
        const wheel = document.querySelector('.wheel');
        if (!wheel) return;
        
        const centerX = parseInt(wheel.getAttribute('cx') || '0');
        const centerY = parseInt(wheel.getAttribute('cy') || '0');
        const radius = parseInt(wheel.getAttribute('r') || '0');
        
        wheelTexts.forEach(text => {
          const segment = text.parentElement;
          if (!segment) return;
          
          const startAngle = parseFloat(segment.dataset.startAngle || '0');
          const endAngle = parseFloat(segment.dataset.endAngle || '0');
          const midAngle = (startAngle + endAngle) / 2;
          
          // Định vị text vào giữa segment
          const x = centerX + (radius * 0.75) * Math.cos(midAngle);
          const y = centerY + (radius * 0.75) * Math.sin(midAngle);
          
          // Áp dụng vị trí và xoay text
          text.setAttribute('x', x);
          text.setAttribute('y', y);
          
          // Xoay text để đọc được từ ngoài vào trong
          let textAngle = (midAngle * 180 / Math.PI) + 90;
          if (textAngle > 180) textAngle -= 180;
          
          text.setAttribute('transform', \`rotate(\${textAngle} \${x} \${y})\`);
        });
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
      
      // Sửa chữa các vấn đề với vòng quay sau khi load
      setTimeout(() => {
        // Kiểm tra xem có phải là game vòng quay không
        if (document.querySelector('.wheel') || document.querySelector('#wheel')) {
          console.log('Đã phát hiện game vòng quay, áp dụng các sửa chữa...');
          
          // Sửa chữa vị trí văn bản
          if (typeof window.positionWheelTexts === 'function') {
            window.positionWheelTexts();
          }
          
          // Đảm bảo kết quả trả về chính xác
          const determineResultFn = window.determineResult;
          if (typeof determineResultFn === 'function') {
            window.determineResult = function() {
              if (typeof window.determineWheelResult === 'function' && 
                  typeof window.currentAngle !== 'undefined' && 
                  Array.isArray(window.segments)) {
                const result = window.determineWheelResult(window.currentAngle, window.segments);
                const resultDisplay = document.querySelector('.result-display') || document.querySelector('#result');
                if (resultDisplay && result) {
                  resultDisplay.textContent = result.label || result;
                }
                return result;
              } else {
                // Gọi hàm gốc nếu không thể sử dụng hàm nâng cao
                return determineResultFn.apply(this, arguments);
              }
            };
          }
        }
      }, 500);
      
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
    // Đảm bảo biến toàn cục cho các hàm trợ giúp
    .replace(/const segments = \[(.*?)\];/gs, 'window.segments = [$1];')
    .replace(/let currentAngle = 0;/g, 'window.currentAngle = 0;')
    .replace(/currentAngle =/g, 'window.currentAngle =')
    
    // Chuẩn hóa góc
    .replace(
      /const finalAngle = currentAngle % \(2 \* Math\.PI\);/g,
      `// Chuẩn hóa góc về khoảng 0-2PI
      let finalAngle = window.currentAngle % (2 * Math.PI);
      if (finalAngle < 0) finalAngle += 2 * Math.PI;`
    )
    
    // Sửa hàm xác định kết quả
    .replace(
      /function determineResult\(\)/g,
      `window.determineResult = function()`
    )
    .replace(
      /const determineResult = \(\) =>/g,
      `window.determineResult = () =>`
    )
    .replace(
      /(window\.determineResult = function\(\) {)[\s\S]*?(})/gs,
      `$1
        // Sử dụng hàm cải tiến để xác định kết quả
        if (typeof window.determineWheelResult === 'function') {
          const result = window.determineWheelResult(window.currentAngle, window.segments);
          const resultDisplay = document.querySelector('.result-display') || document.querySelector('#result');
          if (resultDisplay && result) {
            resultDisplay.textContent = result.label || result;
          }
          return result;
        }
        
        // Fallback to existing code
        $2`
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
