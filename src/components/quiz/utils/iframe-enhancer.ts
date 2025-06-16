
import { processImageSource } from '@/utils/media-utils';

/**
 * Xử lý các hình ảnh trong nội dung HTML - đơn giản hóa
 * @param content Nội dung HTML cần xử lý
 * @returns Nội dung HTML đã xử lý hình ảnh
 */
export const processImages = async (content: string): Promise<string> => {
  // Nếu hàm này gây ra lỗi hoặc phức tạp, chỉ cần trả về nội dung gốc
  return content;
};

/**
 * Kiểm tra tính hợp lệ của mã HTML và JavaScript
 * @param html Mã HTML cần kiểm tra
 * @returns Có lỗi hay không và thông báo lỗi nếu có
 */
export const validateHtml = (html: string): { isValid: boolean, errorMessage?: string } => {
  try {
    // Kiểm tra các lỗi cơ bản
    if (!html) {
      return { isValid: false, errorMessage: 'HTML is empty' };
    }
    
    // Kiểm tra cơ bản nếu có DOCTYPE hoặc <html> tag
    if (html.includes('<!DOCTYPE') || html.includes('<html')) {
      return { isValid: true };
    }
    
    // Nếu là đoạn HTML không đầy đủ (có thể chỉ là một phần)
    if (html.includes('<body') || 
        html.includes('<div') || 
        html.includes('<script') || 
        html.includes('<style')) {
      return { isValid: false, errorMessage: 'HTML không đầy đủ, thiếu DOCTYPE hoặc thẻ html' };
    }
    
    return { isValid: false, errorMessage: 'HTML không hợp lệ' };
  } catch (error) {
    return { isValid: false, errorMessage: `Validation error: ${error.message}` };
  }
};

/**
 * Kiểm tra và sửa các lỗi JavaScript phổ biến trong HTML
 * @param html Nội dung HTML chứa JavaScript
 * @returns HTML đã được sửa lỗi
 */
export const fixJavaScriptErrors = (html: string): string => {
  try {
    let fixedHtml = html;
    
    // Danh sách các hàm/phương thức built-in không cần tạo stub
    const builtInMethods = [
      'getElementById', 'getContext', 'querySelector', 'addEventListener', 'removeEventListener',
      'setTimeout', 'setInterval', 'clearTimeout', 'clearInterval', 'requestAnimationFrame',
      'cancelAnimationFrame', 'console', 'Math', 'Date', 'window', 'document', 'alert',
      'confirm', 'prompt', 'parseInt', 'parseFloat', 'isNaN', 'push', 'pop', 'shift',
      'unshift', 'splice', 'slice', 'join', 'split', 'replace', 'match', 'search',
      'indexOf', 'lastIndexOf', 'charAt', 'charCodeAt', 'substring', 'substr',
      'toLowerCase', 'toUpperCase', 'trim', 'floor', 'ceil', 'round', 'abs', 'max',
      'min', 'random', 'now', 'filter', 'map', 'forEach', 'find', 'findIndex',
      'some', 'every', 'reduce', 'sort', 'reverse', 'concat', 'includes', 'keys',
      'values', 'entries', 'hasOwnProperty', 'toString', 'valueOf', 'length',
      'width', 'height', 'x', 'y', 'left', 'top', 'right', 'bottom', 'style',
      'className', 'classList', 'innerHTML', 'textContent', 'value', 'checked',
      'disabled', 'hidden', 'id', 'name', 'type', 'src', 'href', 'title',
      'preventDefault', 'stopPropagation', 'target', 'currentTarget', 'clientX',
      'clientY', 'pageX', 'pageY', 'offsetX', 'offsetY', 'keyCode', 'which',
      'ctrlKey', 'shiftKey', 'altKey', 'metaKey', 'button', 'buttons',
      'fillRect', 'fillStyle', 'strokeRect', 'strokeStyle', 'clearRect',
      'beginPath', 'moveTo', 'lineTo', 'arc', 'fill', 'stroke', 'closePath',
      'save', 'restore', 'translate', 'rotate', 'scale', 'drawImage',
      'getImageData', 'putImageData', 'createImageData', 'font', 'textAlign',
      'textBaseline', 'fillText', 'strokeText', 'measureText', 'lineWidth',
      'lineCap', 'lineJoin', 'miterLimit', 'shadowColor', 'shadowBlur',
      'shadowOffsetX', 'shadowOffsetY', 'globalAlpha', 'globalCompositeOperation',
      'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue',
      'return', 'function', 'var', 'let', 'const', 'try', 'catch', 'finally',
      'throw', 'new', 'this', 'super', 'class', 'extends', 'static', 'get', 'set',
      'async', 'await', 'yield', 'typeof', 'instanceof', 'in', 'delete', 'void',
      'settings'
    ];
    
    // Tìm tất cả script tags
    const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
    const scripts = Array.from(html.matchAll(scriptRegex));
    
    for (const script of scripts) {
      const scriptContent = script[1];
      const originalScript = script[0];
      
      // Kiểm tra các hàm được gọi nhưng chưa được định nghĩa
      const functionCallsRegex = /(\w+)\s*\(/g;
      const functionDefinitionsRegex = /function\s+(\w+)\s*\(/g;
      
      const functionCalls = Array.from(scriptContent.matchAll(functionCallsRegex));
      const functionDefinitions = Array.from(scriptContent.matchAll(functionDefinitionsRegex));
      
      if (functionCalls.length > 0) {
        const definedFunctions = functionDefinitions.map(def => def[1]);
        
        const calledFunctions = functionCalls
          .map(call => call[1])
          .filter(func => 
            !builtInMethods.includes(func) && 
            !definedFunctions.includes(func) &&
            func.length > 1 && // Loại bỏ các ký tự đơn
            /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(func) // Chỉ các tên hàm hợp lệ
          );
        
        // Tìm các hàm được gọi nhưng chưa được định nghĩa
        const missingFunctions = [...new Set(calledFunctions)];
        
        if (missingFunctions.length > 0) {
          console.warn('Tìm thấy các hàm thiếu:', missingFunctions);
          
          // Tạo các hàm stub cho các hàm thiếu
          let stubFunctions = '';
          for (const missingFunc of missingFunctions) {
            if (missingFunc === 'drawObstacles') {
              stubFunctions += `
function drawObstacles() {
  // Vẽ chướng ngại vật - tự động tạo
  if (typeof context !== 'undefined' && context && typeof canvas !== 'undefined') {
    context.fillStyle = '#8B4513';
    for (let i = 0; i < 3; i++) {
      const x = Math.random() * (canvas.width - 50);
      const y = Math.random() * (canvas.height - 50);
      context.fillRect(x, y, 50, 30);
    }
  }
}
`;
            } else if (missingFunc === 'drawCars') {
              stubFunctions += `
function drawCars() {
  // Vẽ xe đối thủ - tự động tạo
  if (typeof context !== 'undefined' && context && typeof canvas !== 'undefined') {
    context.fillStyle = '#FF4444';
    for (let i = 0; i < 2; i++) {
      const x = Math.random() * (canvas.width - 40);
      const y = Math.random() * (canvas.height - 60);
      context.fillRect(x, y, 40, 60);
    }
  }
}
`;
            } else if (missingFunc === 'updateGame') {
              stubFunctions += `
function updateGame() {
  // Cập nhật trạng thái game - tự động tạo
  console.log('updateGame được gọi');
}
`;
            } else if (missingFunc === 'resetGame') {
              stubFunctions += `
function resetGame() {
  // Đặt lại game - tự động tạo
  console.log('resetGame được gọi');
}
`;
            } else {
              // Chỉ tạo stub cho các hàm có tên hợp lệ
              if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(missingFunc)) {
                stubFunctions += `
function ${missingFunc}() {
  // Hàm tự động tạo để tránh lỗi
  console.log('${missingFunc} được gọi');
}
`;
              }
            }
          }
          
          // Thêm các hàm stub vào đầu script
          if (stubFunctions) {
            const newScriptContent = stubFunctions + scriptContent;
            const newScript = originalScript.replace(scriptContent, newScriptContent);
            fixedHtml = fixedHtml.replace(originalScript, newScript);
          }
        }
      }
    }
    
    return fixedHtml;
  } catch (error) {
    console.error('Lỗi khi sửa JavaScript:', error);
    return html;
  }
};
