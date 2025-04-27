
/**
 * Xử lý phần JavaScript của game trong iframe
 */

export const enhanceScript = (jsContent: string): string => {
  // Thêm các chức năng xử lý logic cho vòng quay và game khác
  const wheelHelpers = `
    // Định nghĩa các hàm hỗ trợ cho game vòng quay
    window.wheelHelpers = {
      // Hàm để tạo và định vị văn bản trong các phân khúc vòng quay
      positionWheelTexts: function() {
        try {
          // Tìm tất cả phần text trong vòng quay
          const segmentTexts = document.querySelectorAll('.segment-text');
          if (segmentTexts.length === 0) return false;

          console.log('Đang định vị lại text cho ' + segmentTexts.length + ' phân khúc');
          
          // Tìm wheel element
          const wheelElement = document.querySelector('.wheel') || document.querySelector('#wheel');
          if (!wheelElement) return false;
          
          // Lấy kích thước của wheel
          const wheelRect = wheelElement.getBoundingClientRect();
          const centerX = wheelRect.width / 2;
          const centerY = wheelRect.height / 2;
          const radius = Math.min(centerX, centerY) * 0.7; // 70% của bán kính để văn bản không quá gần viền
          
          // Số lượng phân khúc
          const segmentCount = segmentTexts.length;
          const anglePerSegment = (2 * Math.PI) / segmentCount;
          
          // Cập nhật vị trí cho từng text
          segmentTexts.forEach((text, index) => {
            // Tính góc ở giữa phân khúc
            const midAngle = index * anglePerSegment + (anglePerSegment / 2);
            
            // Tính vị trí dựa trên góc và bán kính
            const x = centerX + Math.cos(midAngle) * (radius * 0.7);
            const y = centerY + Math.sin(midAngle) * (radius * 0.7);
            
            // Áp dụng vị trí
            text.setAttribute('x', x);
            text.setAttribute('y', y);
            
            // Tính góc quay để văn bản dọc theo phân khúc và dễ đọc
            let rotationAngle = (midAngle * 180 / Math.PI) + 90;
            if (rotationAngle > 180) rotationAngle -= 180;
            
            text.setAttribute('transform', \`rotate(\${rotationAngle} \${x} \${y})\`);
            text.style.fontSize = (radius / 12) + 'px';
            
            console.log('Phân khúc #' + index + ' - Góc: ' + (midAngle * 180 / Math.PI).toFixed(1) + '°, Văn bản: ' + text.textContent);
          });
          
          return true;
        } catch (err) {
          console.error('Lỗi khi định vị văn bản vòng quay:', err);
          return false;
        }
      },
      
      // Xác định kết quả dựa trên góc cuối cùng của vòng quay
      determineWheelResult: function(finalAngle, segments) {
        try {
          // Chuẩn hóa góc về khoảng 0-2PI
          let normalizedAngle = finalAngle % (2 * Math.PI);
          if (normalizedAngle < 0) normalizedAngle += 2 * Math.PI;
          
          console.log('Góc sau khi xoay:', finalAngle.toFixed(2) + ' rad');
          console.log('Góc chuẩn hóa:', normalizedAngle.toFixed(2) + ' rad');
          
          // Góc của mỗi phần
          const segmentAngle = (2 * Math.PI) / segments.length;
          console.log('Góc mỗi phân khúc:', segmentAngle.toFixed(2) + ' rad');
          
          // Vị trí con trỏ (thường ở trên cùng = 3*PI/2)
          const pointerAngle = 1.5 * Math.PI;
          console.log('Góc con trỏ:', pointerAngle.toFixed(2) + ' rad');
          
          // Tính góc tương đối với vị trí con trỏ
          let relativeAngle = (pointerAngle - normalizedAngle) % (2 * Math.PI);
          if (relativeAngle < 0) relativeAngle += 2 * Math.PI;
          console.log('Góc tương đối:', relativeAngle.toFixed(2) + ' rad');
          
          // Xác định phân khúc thắng
          const segmentIndex = Math.floor(relativeAngle / segmentAngle);
          console.log('Chỉ số phân khúc thắng:', segmentIndex);
          
          if (segmentIndex >= 0 && segmentIndex < segments.length) {
            console.log('Kết quả:', segments[segmentIndex]);
            return segments[segmentIndex];
          }
          
          // Mặc định trả về phân khúc đầu tiên nếu không thể xác định
          console.warn('Không thể xác định kết quả, trả về phân khúc đầu tiên');
          return segments[0];
        } catch (err) {
          console.error('Lỗi khi xác định kết quả vòng quay:', err);
          return segments[0];
        }
      },
      
      // Tạo hàm cộng điểm kết quả
      displayWheelResult: function(result) {
        try {
          const resultText = typeof result === 'object' ? 
            (result.label || result.value || result.text || JSON.stringify(result)) : 
            result.toString();
          
          // Tìm phần tử hiển thị kết quả
          const resultDisplay = document.querySelector('.result-display') || 
                               document.querySelector('#result') ||
                               document.querySelector('[data-result]');
          
          if (resultDisplay) {
            resultDisplay.textContent = resultText;
            resultDisplay.style.animation = 'none';
            setTimeout(() => {
              resultDisplay.style.animation = 'scale-in 0.5s forwards';
            }, 10);
          } else {
            // Tạo phần tử hiển thị kết quả nếu chưa có
            const newResultDisplay = document.createElement('div');
            newResultDisplay.className = 'result-display';
            newResultDisplay.textContent = resultText;
            newResultDisplay.style.animation = 'scale-in 0.5s forwards';
            
            // Thêm vào DOM
            const container = document.querySelector('#game-container') || document.body;
            container.appendChild(newResultDisplay);
          }
          
          console.log('Hiển thị kết quả:', resultText);
          return true;
        } catch (err) {
          console.error('Lỗi khi hiển thị kết quả vòng quay:', err);
          return false;
        }
      },
      
      // Kiểm tra và cải thiện DOM của vòng quay
      enhanceWheelDOM: function() {
        try {
          // Tìm wheel element
          const wheel = document.querySelector('.wheel') || document.querySelector('#wheel');
          if (!wheel) return false;
          
          console.log('Tìm thấy wheel element, đang cải thiện...');
          
          // Đảm bảo wheel có các thuộc tính quan trọng
          if (!wheel.style.transformOrigin) {
            wheel.style.transformOrigin = 'center';
          }
          
          // Tìm tất cả phân khúc
          const segments = document.querySelectorAll('.wheel-segment');
          if (segments.length === 0) {
            // Thử tìm với các lớp khác
            const paths = wheel.querySelectorAll('path');
            if (paths.length > 0) {
              console.log('Thêm class wheel-segment cho ' + paths.length + ' phân khúc');
              paths.forEach(path => path.classList.add('wheel-segment'));
            }
          }
          
          // Kiểm tra con trỏ
          const pointer = document.querySelector('.wheel-pointer');
          if (!pointer) {
            // Tạo con trỏ nếu chưa có
            const newPointer = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            newPointer.setAttribute('class', 'wheel-pointer');
            newPointer.setAttribute('points', '0,0 10,20 -10,20');
            newPointer.setAttribute('fill', 'red');
            
            // Thêm vào DOM tại vị trí phía trên wheel
            const wheelContainer = wheel.parentElement;
            if (wheelContainer) {
              wheelContainer.insertBefore(newPointer, wheel);
            }
          }
          
          // Gọi hàm định vị văn bản
          this.positionWheelTexts();
          
          return true;
        } catch (err) {
          console.error('Lỗi khi cải thiện DOM vòng quay:', err);
          return false;
        }
      }
    };
    
    // Tạo CSS animation cho hiệu ứng scale-in
    (function() {
      const styleSheet = document.createElement('style');
      styleSheet.textContent = \`
        @keyframes scale-in {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      \`;
      document.head.appendChild(styleSheet);
    })();
  `;
  
  // Thêm sandbox để tránh các vấn đề bảo mật
  const enhancementWrapper = `
    // Đảm bảo môi trường an toàn
    try {
      // Thêm các hàm hỗ trợ
      ${wheelHelpers}
      
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
      
      // Cải thiện game sau khi load
      window.addEventListener('DOMContentLoaded', function() {
        // Kiểm tra xem có phải là game vòng quay không
        if (document.querySelector('.wheel') || document.querySelector('#wheel')) {
          console.log('Đã phát hiện game vòng quay, áp dụng các cải thiện...');
          
          // Cải thiện DOM vòng quay
          if (window.wheelHelpers) {
            window.wheelHelpers.enhanceWheelDOM();
            
            // Backup các hàm gốc
            if (typeof window.spinWheel === 'function' && !window.originalSpinWheel) {
              window.originalSpinWheel = window.spinWheel;
              
              // Ghi đè hàm spinWheel để đảm bảo kết quả chính xác
              window.spinWheel = function() {
                let result = window.originalSpinWheel.apply(this, arguments);
                
                // Trì hoãn để đảm bảo animation hoàn thành
                setTimeout(() => {
                  if (window.currentAngle !== undefined && window.segments) {
                    const wheelResult = window.wheelHelpers.determineWheelResult(window.currentAngle, window.segments);
                    window.wheelHelpers.displayWheelResult(wheelResult);
                  }
                }, 3500); // Thời gian animation + thêm chút trì hoãn
                
                return result;
              };
            }
            
            // Ghi đè hàm determineResult nếu có
            if (typeof window.determineResult === 'function' && !window.originalDetermineResult) {
              window.originalDetermineResult = window.determineResult;
              
              window.determineResult = function() {
                if (window.currentAngle !== undefined && window.segments) {
                  return window.wheelHelpers.determineWheelResult(window.currentAngle, window.segments);
                }
                return window.originalDetermineResult.apply(this, arguments);
              };
            }
          }
        }
      });
      
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
    .replace(/let segments = \[(.*?)\];/gs, 'window.segments = [$1];')
    .replace(/let currentAngle = 0;/g, 'window.currentAngle = 0;')
    .replace(/const currentAngle = 0;/g, 'window.currentAngle = 0;')
    .replace(/currentAngle =/g, 'window.currentAngle =')
    
    // Sửa hàm xác định kết quả
    .replace(
      /function determineResult\(\)/g,
      `window.determineResult = function()`
    )
    .replace(
      /const determineResult = \(\) =>/g,
      `window.determineResult = () =>`
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
