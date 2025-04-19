
import React from 'react';

export const enhanceIframeContent = (content: string, title?: string): string => {
  // Clean the content - remove all markdown code blocks and backtick artifacts
  let processedContent = content.replace(/```html|```/g, '');
  processedContent = processedContent.replace(/`/g, '');
  
  console.log('📝 Bắt đầu xử lý HTML & JavaScript...');
  
  // Kiểm tra xem đã có cấu trúc HTML đầy đủ chưa
  const hasDoctype = processedContent.includes('<!DOCTYPE html>');
  const hasHtmlTag = processedContent.includes('<html');
  const hasHeadTag = processedContent.includes('<head>');
  const hasBodyTag = processedContent.includes('<body>');
  
  // Add DOCTYPE and HTML structure if missing
  if (!hasDoctype) {
    if (hasHtmlTag) {
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
  
  // Xử lý JavaScript trong thẻ script
  processedContent = processedContent.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, (match, scriptContent) => {
    // Fix template literals
    let fixedScript = scriptContent
      .replace(/(\w+\.style\.transform\s*=\s*)rotate\(\$\{([^}]+)\}([^)]*)\)/g, "$1`rotate(${$2}$3)`")
      .replace(/(\w+\.textContent\s*=\s*)([^;"`']*)\$\{([^}]+)\}([^;"`']*);/g, "$1`$2${$3}$4`;")
      .replace(/\\`/g, '`'); // Fix escaped backticks
    
    // Fix function parameters
    fixedScript = fixedScript.replace(/function\s+(\w+)\s*\(\$2\)/g, (match, funcName) => {
      if (funcName === 'drawSegment') return 'function drawSegment(index, color, text)';
      if (funcName === 'spinWheel') return 'function spinWheel()';
      if (funcName.includes('ease')) return `function ${funcName}(t, b, c, d)`;
      return `function ${funcName}(param)`;
    });
    
    // Add error handling for DOM elements
    fixedScript = fixedScript.replace(
      /const\s+(\w+)\s*=\s*document\.getElementById\(['"]([^'"]+)['"]\);((?!\s*if\s*\(!\1\)))/g,
      "const $1 = document.getElementById('$2');\nif (!$1) { console.error('Element #$2 not found'); } else { $3"
    );
    
    // Proper event listener attachment
    fixedScript = fixedScript.replace(
      /(\w+)\.addEventListener\(['"](\w+)['"]\s*,\s*([^)]+)\)/g,
      "if ($1) { $1.addEventListener('$2', $3); }"
    );
    
    // Wrap in self-executing function if needed
    if (!fixedScript.includes('(function()') && !fixedScript.includes('(() =>')) {
      fixedScript = `(function() {\n${fixedScript}\n})();`;
    }
    
    return `<script>\n${fixedScript}\n</script>`;
  });
  
  // Add safety margin to ensure scripts load after DOM
  if (!processedContent.includes('DOMContentLoaded')) {
    processedContent = processedContent.replace('</body>', `
<script>
  // Ensure all scripts run after DOM is fully loaded
  document.addEventListener('DOMContentLoaded', function() {
    console.log('Game DOM fully loaded and parser completed');
    
    // Run any initialization needed after DOM is ready
    const gameElements = document.querySelectorAll('button, canvas, .wheel, .game-element');
    gameElements.forEach(el => {
      if (el.classList) el.classList.add('ready');
    });
  });
  
  // Global error handler
  window.onerror = function(message, source, lineno, colno, error) {
    console.error('Game error:', { message, source, lineno, colno });
    return true;
  };
</script>
</body>`);
  }
  
  // Đảm bảo rằng CSS được giữ nguyên
  const styleTagRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  const styleMatches = [...processedContent.matchAll(styleTagRegex)];
  const hasStyles = styleMatches.length > 0;

  // Thêm base styles nếu chưa có style nào
  if (!hasStyles && processedContent.includes('</head>')) {
    const baseStyles = `
  <style>
    /* Base styles for games */
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    
    body {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
      background-color: #f8f9fa;
      box-sizing: border-box;
    }
    
    /* Game container */
    .container, .game-container, #game-container {
      width: 100%;
      max-width: 800px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    /* Canvas element */
    canvas {
      display: block;
      max-width: 100%;
      height: auto;
      margin: 0 auto;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    /* Buttons */
    button {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      background: #4f46e5;
      color: white;
      cursor: pointer;
      font-size: 16px;
      font-weight: 500;
      margin: 10px 0;
      transition: background 0.2s, transform 0.1s;
    }
    
    button:hover {
      background: #4338ca;
    }
    
    button:active {
      transform: translateY(1px);
    }
    
    /* Wheel games specific */
    .wheel {
      transition: transform 4s cubic-bezier(0.22, 1, 0.36, 1);
    }
    
    /* Animations */
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    .fade-in {
      animation: fadeIn 0.5s ease forwards;
    }
    
    /* Responsive design */
    @media (max-width: 768px) {
      canvas {
        max-width: 90%;
      }
      
      button {
        padding: 8px 16px;
        font-size: 14px;
      }
    }
  </style>`;
    
    processedContent = processedContent.replace('</head>', `${baseStyles}\n</head>`);
    console.log('🎨 Đã thêm CSS cơ bản cho game');
  }
  
  console.log('✅ HTML/CSS/JS đã được xử lý thành công');
  return processedContent;
};

/**
 * Hàm này đảm bảo iframe được tạo và tải đúng cách
 */
export const setupIframe = (iframe: HTMLIFrameElement, content: string): void => {
  if (!iframe) return;
  
  // Sử dụng srcdoc thay vì srcDoc
  iframe.srcdoc = content;
  
  // Thêm event listener để theo dõi khi iframe đã tải xong
  iframe.onload = () => {
    console.log('Iframe đã tải xong, kích hoạt JavaScript');
    
    try {
      // Truy cập nội dung iframe và thực thi JavaScript
      const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDocument) throw new Error('Không thể truy cập tài liệu iframe');
      
      // Đảm bảo tất cả scripts được thực thi
      const scripts = iframeDocument.querySelectorAll('script');
      scripts.forEach(originalScript => {
        // Clone và thêm các script vào lại document để đảm bảo thực thi
        const script = iframeDocument.createElement('script');
        
        Array.from(originalScript.attributes).forEach(attr => {
          script.setAttribute(attr.name, attr.value);
        });
        
        script.textContent = originalScript.textContent;
        iframeDocument.body.appendChild(script);
      });
      
      console.log('JavaScript trong iframe đã được kích hoạt');
    } catch (error) {
      console.error('Lỗi khi kích hoạt JavaScript trong iframe:', error);
    }
  };
};
