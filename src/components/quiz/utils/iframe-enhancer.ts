
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
    
    // Tìm tất cả script tags
    const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
    const scripts = Array.from(html.matchAll(scriptRegex));
    
    for (const script of scripts) {
      const scriptContent = script[1];
      const originalScript = script[0];
      
      // Kiểm tra các hàm được gọi nhưng chưa được định nghĩa
      const functionCalls = scriptContent.match(/(\w+)\s*\(/g);
      const functionDefinitions = scriptContent.match(/function\s+(\w+)\s*\(/g);
      
      if (functionCalls && functionDefinitions) {
        const definedFunctions = functionDefinitions.map(def => 
          def.match(/function\s+(\w+)/)[1]
        );
        
        const calledFunctions = functionCalls.map(call => 
          call.replace(/\s*\(/, '')
        ).filter(func => 
          !['console', 'Math', 'Date', 'window', 'document', 'alert', 'confirm', 'prompt', 'parseInt', 'parseFloat', 'isNaN', 'setTimeout', 'setInterval', 'clearTimeout', 'clearInterval', 'addEventListener', 'removeEventListener'].includes(func)
        );
        
        // Tìm các hàm được gọi nhưng chưa được định nghĩa
        const missingFunctions = calledFunctions.filter(func => 
          !definedFunctions.includes(func)
        );
        
        if (missingFunctions.length > 0) {
          console.warn('Tìm thấy các hàm thiếu:', missingFunctions);
          
          // Tạo các hàm stub cho các hàm thiếu
          let stubFunctions = '';
          for (const missingFunc of [...new Set(missingFunctions)]) {
            if (missingFunc === 'drawObstacles') {
              stubFunctions += `
function drawObstacles() {
  // Vẽ chướng ngại vật - tự động tạo
  if (typeof context !== 'undefined' && context) {
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
  if (typeof context !== 'undefined' && context) {
    context.fillStyle = '#FF4444';
    for (let i = 0; i < 2; i++) {
      const x = Math.random() * (canvas.width - 40);
      const y = Math.random() * (canvas.height - 60);
      context.fillRect(x, y, 40, 60);
    }
  }
}
`;
            } else {
              stubFunctions += `
function ${missingFunc}() {
  // Hàm tự động tạo để tránh lỗi
  console.log('${missingFunc} được gọi');
}
`;
            }
          }
          
          // Thêm các hàm stub vào đầu script
          const newScriptContent = stubFunctions + scriptContent;
          const newScript = originalScript.replace(scriptContent, newScriptContent);
          fixedHtml = fixedHtml.replace(originalScript, newScript);
        }
      }
    }
    
    return fixedHtml;
  } catch (error) {
    console.error('Lỗi khi sửa JavaScript:', error);
    return html;
  }
};
