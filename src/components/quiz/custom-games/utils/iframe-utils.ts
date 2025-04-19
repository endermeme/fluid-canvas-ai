
import { formatHtmlContent } from './html-processor';
import { fixInlineComments, fixJavaScriptErrors } from './js-processor';
import { getOptimizedStyles, fixDuplicatedStyles } from './css-processor';

export const enhanceIframeContent = (content: string, title?: string): string => {
  // Clean the content
  let processedContent = content.replace(/```html|```/g, '');
  processedContent = processedContent.replace(/`/g, '');
  
  console.log('📝 Bắt đầu xử lý HTML & JavaScript...');
  
  // Add DOCTYPE and HTML structure if missing
  if (!processedContent.includes('<!DOCTYPE html>')) {
    if (processedContent.includes('<html')) {
      processedContent = `<!DOCTYPE html>${processedContent}`;
    } else {
      processedContent = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title || 'Interactive Game'}</title>
  </head>
  <body>
    ${processedContent}
  </body>
</html>`;
    }
    console.log('🔄 Đã thêm doctype và cấu trúc HTML');
  }
  
  // Apply all processors
  processedContent = formatHtmlContent(processedContent);
  console.log('🔄 Đã định dạng HTML với thụt lề phù hợp');
  
  processedContent = fixInlineComments(processedContent);
  console.log('🔄 Đã sửa các comment "ăn" mất code');
  
  processedContent = fixJavaScriptErrors(processedContent);
  console.log('🔄 Đã sửa các lỗi JavaScript phổ biến');
  
  processedContent = fixDuplicatedStyles(processedContent);
  console.log('🔄 Đã sửa các style CSS trùng lặp');
  
  // Add optimization CSS styles at the end
  if (processedContent.includes('<head>') && !processedContent.includes('<style id="optimized-iframe-styles">')) {
    processedContent = processedContent.replace('<head>', `<head>\n  <style id="optimized-iframe-styles">\n${getOptimizedStyles()}\n  </style>`);
    console.log('🔄 Đã thêm CSS tối ưu vào head');
  }
  
  // Add Content Security Policy
  if (!processedContent.includes('content-security-policy')) {
    const cspTag = `<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;">`;
    processedContent = processedContent.replace('</head>', `  ${cspTag}\n</head>`);
    console.log('🔄 Đã thêm Content Security Policy');
  }
  
  // Add debug utility script
  const debugScript = getDebugScript();
  processedContent = processedContent.replace('</body>', `${debugScript}\n</body>`);
  console.log('🔄 Đã thêm debug utility script');
  
  console.log('✅ Đã hoàn thành xử lý! Code sẵn sàng để chạy.');
  return processedContent;
};

const getDebugScript = (): string => {
  return `
<script>
  // Utility để debug các game - hiển thị lỗi trong iframe
  window.onerror = function(message, source, lineno, colno, error) {
    console.error('🔴 Lỗi Game:', message);
    
    // Tạo error overlay nếu chưa có
    if (!document.getElementById('error-overlay')) {
      const overlay = document.createElement('div');
      overlay.id = 'error-overlay';
      overlay.style.cssText = 'position:fixed;bottom:0;left:0;right:0;background:rgba(239,68,68,0.95);color:white;padding:15px;font-family:monospace;z-index:9999;max-height:40%;overflow:auto;border-top:2px solid #b91c1c;box-shadow:0 -4px 10px rgba(0,0,0,0.2);';
      
      const title = document.createElement('div');
      title.textContent = 'Có lỗi xảy ra trong game';
      title.style.cssText = 'font-weight:bold;font-size:16px;margin-bottom:10px;';
      
      const closeBtn = document.createElement('button');
      closeBtn.textContent = 'Đóng';
      closeBtn.style.cssText = 'position:absolute;top:10px;right:10px;background:#fff;color:#ef4444;border:none;border-radius:4px;padding:4px 8px;font-weight:bold;cursor:pointer;';
      closeBtn.onclick = function() { overlay.style.display = 'none'; };
      
      overlay.appendChild(title);
      overlay.appendChild(closeBtn);
      document.body.appendChild(overlay);
    }
    
    // Hiển thị thông báo lỗi
    const errorOverlay = document.getElementById('error-overlay');
    const errorMsg = document.createElement('div');
    errorMsg.textContent = \`⚠️ \${message} (dòng \${lineno})\`;
    errorMsg.style.cssText = 'margin:5px 0;padding:5px;background:rgba(255,255,255,0.1);border-radius:4px;';
    errorOverlay.appendChild(errorMsg);
    
    return true;
  };
  
  // Utility để log thông báo game
  window.gameLog = function(message) {
    console.log('🎮 Game:', message);
  };
  
  // Auto-resize cho canvas elements
  document.addEventListener('DOMContentLoaded', function() {
    console.log('Game đã được khởi tạo thành công');
    
    // Thêm animation cho các elements khi trang load
    document.querySelectorAll('h1, h2, h3, p, button, .card, .item, .box').forEach((el, index) => {
      el.style.opacity = '0';
      el.style.animation = \`fadeIn 0.5s ease \${index * 0.1}s forwards, slideUp 0.5s ease \${index * 0.1}s forwards\`;
    });
    
    // Tự động resize canvas
    const resizeCanvases = function() {
      const canvases = document.querySelectorAll('canvas');
      canvases.forEach(canvas => {
        if (canvas.parentElement && !canvas.hasAttribute('data-auto-sized')) {
          const parentWidth = canvas.parentElement.clientWidth;
          const aspectRatio = canvas.width / canvas.height;
          const newWidth = Math.min(parentWidth * 0.95, canvas.width);
          canvas.style.width = newWidth + 'px';
          canvas.style.height = (newWidth / aspectRatio) + 'px';
          canvas.setAttribute('data-auto-sized', 'true');
        }
      });
    };
    
    resizeCanvases();
    window.addEventListener('resize', resizeCanvases);
  });
</script>`;
};

export {
  formatHtmlContent,
  fixJavaScriptErrors,
  fixInlineComments,
  getOptimizedStyles,
  fixDuplicatedStyles
};
