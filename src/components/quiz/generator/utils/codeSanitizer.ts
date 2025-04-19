
/**
 * Làm sạch và sửa chữa code HTML, CSS và JavaScript từ Gemini
 */
export const sanitizeGameCode = (content: string): string => {
  let sanitized = content;
  
  // Loại bỏ cú pháp markdown code block
  sanitized = sanitized.replace(/```html|```css|```js|```javascript|```/g, '');
  
  // Loại bỏ backticks thừa
  sanitized = sanitized.replace(/`/g, '');
  
  // Sửa tham số hàm
  sanitized = sanitized.replace(/function\s+(\w+)\s*\(\$2\)/g, (match, funcName) => {
    if (funcName === 'drawSegment') return 'function drawSegment(index, color, text)';
    if (funcName === 'getWinningSegment') return 'function getWinningSegment(finalAngle)';
    if (funcName === 'spinWheel') return 'function spinWheel()';
    if (funcName === 'drawWheel') return 'function drawWheel()';
    if (funcName.includes('ease') || funcName.includes('animate')) 
      return `function ${funcName}(t, b, c, d)`;
    return match;
  });
  
  // Sửa template literals
  sanitized = sanitized.replace(/(\w+\.style\.transform\s*=\s*)rotate\(\$\{([^}]+)\}([^)]*)\)/g, 
    "$1`rotate(${$2}$3)`");
  
  sanitized = sanitized.replace(/(\w+\.textContent\s*=\s*)([^;"`']*)\$\{([^}]+)\}([^;"`']*);/g, 
    "$1`$2${$3}$4`;");
  
  // Sửa escaping backticks trong template literals
  sanitized = sanitized.replace(/\\`/g, '`');
  
  // Đảm bảo thẻ script đóng đúng cách
  if (sanitized.includes('<script>') && !sanitized.includes('</script>')) {
    sanitized += '\n</script>';
  }
  
  // Thêm xử lý lỗi cho ngữ cảnh canvas
  if (sanitized.includes('getContext') && !sanitized.includes('if (!ctx)')) {
    sanitized = sanitized.replace(
      /const\s+ctx\s*=\s*canvas\.getContext\(['"]2d['"]\);/g,
      "const ctx = canvas.getContext('2d');\n  if (!ctx) { console.error('Canvas context not available'); return; }"
    );
  }
  
  // Đảm bảo JavaScript được bọc trong hàm tự thực thi
  if (sanitized.includes('<script>') && !sanitized.includes('window.onload') && !sanitized.includes('(function() {')) {
    sanitized = sanitized.replace(
      /<script>([\s\S]*?)<\/script>/g,
      "<script>\n(function() {\n$1\n})();\n</script>"
    );
  }
  
  // Sửa document.getElementById calls để kiểm tra null
  sanitized = sanitized.replace(
    /const\s+(\w+)\s*=\s*document\.getElementById\(['"]([^'"]+)['"]\);/g,
    "const $1 = document.getElementById('$2');\nif (!$1) { console.error('Element #$2 not found'); return; }"
  );
  
  // Thêm xử lý lỗi toàn cục
  if (!sanitized.includes('window.onerror')) {
    sanitized = sanitized.replace(
      /<\/body>/,
      `  <script>
    window.onerror = (message, source, lineno, colno, error) => {
      console.error('Game error:', { message, source, lineno, colno, stack: error?.stack });
      return true;
    };
    
    // Đảm bảo DOM đã được tải hoàn toàn trước khi thực thi script
    document.addEventListener('DOMContentLoaded', function() {
      console.log('Game DOM fully loaded and ready');
    });
  </script>
</body>`
    );
  }
  
  // Đảm bảo có DOCTYPE và cấu trúc HTML cơ bản
  if (!sanitized.includes('<!DOCTYPE html>')) {
    if (sanitized.includes('<html')) {
      sanitized = `<!DOCTYPE html>${sanitized}`;
    } else {
      sanitized = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Interactive Game</title>
</head>
<body>
  ${sanitized}
</body>
</html>`;
    }
  }
  
  // Thêm log để debug
  console.log("🧹 Sanitized game code:", sanitized.substring(0, 200) + "...");
  
  return sanitized;
};

/**
 * Trích xuất phần HTML, CSS và JavaScript riêng biệt
 * từ code HTML tổng hợp
 */
export const extractCodeParts = (htmlContent: string): { html: string, css: string, js: string } => {
  const result = {
    html: htmlContent,
    css: '',
    js: ''
  };
  
  // Trích xuất CSS từ thẻ style
  const styleMatches = htmlContent.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
  if (styleMatches) {
    result.css = styleMatches.map(match => {
      return match.replace(/<\/?style[^>]*>/gi, '');
    }).join('\n\n');
  }
  
  // Trích xuất JavaScript từ thẻ script
  const scriptMatches = htmlContent.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
  if (scriptMatches) {
    result.js = scriptMatches.map(match => {
      return match.replace(/<\/?script[^>]*>/gi, '');
    }).join('\n\n');
  }
  
  // Loại bỏ các thẻ style và script khỏi HTML
  result.html = htmlContent
    .replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, '')
    .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '')
    .trim();
  
  return result;
};
