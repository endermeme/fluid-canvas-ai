
export const enhanceIframeContent = (content: string, title?: string): string => {
  // Loại bỏ cú pháp markdown nếu có
  let processedContent = content.replace(/```html|```/g, '');
  
  console.log('📝 Bắt đầu xử lý HTML & JavaScript...');
  
  // Thêm DOCTYPE và cấu trúc HTML nếu thiếu
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
  
  // Chuẩn hóa HTML với indentation phù hợp
  processedContent = formatHtmlContent(processedContent);
  
  // Sửa lỗi comments
  processedContent = fixComments(processedContent);
  
  // Sửa lỗi JavaScript phổ biến
  processedContent = fixJavaScriptErrors(processedContent);
  
  // Sửa lỗi style trùng lặp
  processedContent = fixDuplicatedStyles(processedContent);
  
  // Thêm CSS cơ bản cho responsive
  processedContent = addBaseStyles(processedContent);
  
  // Thêm debug và utility scripts
  processedContent = addDebugUtilities(processedContent);
  
  console.log('✅ HTML/CSS/JS đã được xử lý thành công');
  return processedContent;
};

/**
 * Định dạng nội dung HTML với thụt đầu dòng phù hợp
 */
const formatHtmlContent = (html: string): string => {
  if (!html || typeof html !== 'string') return '';
  
  try {
    // Bảo vệ nội dung trong các thẻ script và style
    const scriptTags: string[] = [];
    const styleTags: string[] = [];
    
    // Trích xuất và thay thế script tags bằng placeholders
    let processedHtml = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, (match) => {
      const placeholder = `__SCRIPT_PLACEHOLDER_${scriptTags.length}__`;
      scriptTags.push(match);
      return placeholder;
    });
    
    // Trích xuất và thay thế style tags bằng placeholders
    processedHtml = processedHtml.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, (match) => {
      const placeholder = `__STYLE_PLACEHOLDER_${styleTags.length}__`;
      styleTags.push(match);
      return placeholder;
    });
    
    // Định dạng cấu trúc HTML
    processedHtml = processedHtml
      // Thêm line breaks sau thẻ mở
      .replace(/(<[^\/!][^>]*>)(?!\s*[\r\n])/g, '$1\n')
      // Thêm line breaks trước thẻ đóng
      .replace(/(?<!\s*[\r\n])(<\/[^>]+>)/g, '\n$1')
      // Thêm line breaks sau thẻ tự đóng
      .replace(/(<[^>]*\/>)(?!\s*[\r\n])/g, '$1\n')
      // Thêm line breaks sau comments và DOCTYPE
      .replace(/(<!(?:DOCTYPE|--)[^>]*>)(?!\s*[\r\n])/g, '$1\n')
      // Loại bỏ multiple empty lines
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      .trim();
    
    // Thêm indentation
    const lines = processedHtml.split('\n');
    let indentLevel = 0;
    let formattedHtml = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      // Trường hợp đặc biệt cho DOCTYPE không được thụt lề
      if (line.startsWith('<!DOCTYPE')) {
        formattedHtml += line + '\n';
        continue;
      }
      
      // Giảm indent cho các thẻ đóng
      if (line.startsWith('</') && !line.startsWith('</script') && !line.startsWith('</style')) {
        indentLevel = Math.max(0, indentLevel - 1);
      }
      
      // Thêm indentation hiện tại
      formattedHtml += '  '.repeat(indentLevel) + line + '\n';
      
      // Tăng indent sau các thẻ mở, nhưng không phải cho thẻ tự đóng hoặc thẻ đặc biệt
      if (line.match(/<[^\/!][^>]*>/) && 
          !line.match(/<[^>]*\/>/) && 
          !line.match(/<(script|style|link|meta|br|hr|img|input)[^>]*>/i)) {
        indentLevel++;
      }
    }
    
    // Khôi phục script tags với định dạng
    scriptTags.forEach((script, index) => {
      const placeholder = `__SCRIPT_PLACEHOLDER_${index}__`;
      
      // Định dạng nội dung JavaScript
      const formattedScript = script.replace(/<script[^>]*>([\s\S]*?)<\/script>/i, (match, jsContent) => {
        const formattedJs = formatJavaScript(jsContent);
        return `<script>\n${formattedJs}\n</script>`;
      });
      
      formattedHtml = formattedHtml.replace(placeholder, formattedScript);
    });
    
    // Khôi phục style tags với định dạng
    styleTags.forEach((style, index) => {
      const placeholder = `__STYLE_PLACEHOLDER_${index}__`;
      
      // Định dạng nội dung CSS
      const formattedStyle = style.replace(/<style[^>]*>([\s\S]*?)<\/style>/i, (match, cssContent) => {
        const formattedCss = formatCss(cssContent);
        return `<style>\n  ${formattedCss}\n</style>`;
      });
      
      formattedHtml = formattedHtml.replace(placeholder, formattedStyle);
    });
    
    return formattedHtml;
  } catch (error) {
    console.error('Error formatting HTML content:', error);
    return html;
  }
};

/**
 * Định dạng mã JavaScript với indentation phù hợp
 */
const formatJavaScript = (code: string): string => {
  if (!code || typeof code !== 'string') return '';
  
  try {
    // Định dạng JS cơ bản
    let formatted = code
      // Thêm line breaks sau dấu chấm phẩy, dấu ngoặc mở và trước dấu ngoặc đóng
      .replace(/;(?!\n)/g, ';\n')
      .replace(/{(?!\n)/g, '{\n')
      .replace(/(?<!\n)}/g, '\n}')
      // Thêm line breaks sau function declarations
      .replace(/function\s+(\w+)\s*\([^)]*\)\s*{/g, 'function $1($2) {\n')
      // Định dạng if statements với line breaks
      .replace(/if\s*\([^)]+\)\s*{/g, match => match + '\n')
      // Định dạng for loops với line breaks
      .replace(/for\s*\([^)]+\)\s*{/g, match => match + '\n')
      // Định dạng khai báo biến với line breaks
      .replace(/(const|let|var)\s+([^;]+);/g, '$1 $2;\n')
      // Dọn dẹp dòng trống thừa
      .replace(/\n\s*\n\s*\n/g, '\n\n');
    
    // Thêm indentation thích hợp
    const lines = formatted.split('\n');
    let indentLevel = 1; // Bắt đầu với 1 cấp độ vì chúng ta đang ở trong script tag
    let indentedCode = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) {
        indentedCode += '\n';
        continue;
      }
      
      // Giảm indent cho dấu ngoặc đóng
      if (line.startsWith('}')) {
        indentLevel = Math.max(0, indentLevel - 1);
      }
      
      // Thêm indentation hiện tại
      indentedCode += '  '.repeat(indentLevel) + line + '\n';
      
      // Tăng indent sau dấu ngoặc mở
      if (line.endsWith('{')) {
        indentLevel++;
      }
    }
    
    return indentedCode;
  } catch (error) {
    console.error('Error formatting JavaScript:', error);
    return '  ' + code.trim().split('\n').join('\n  ');
  }
};

/**
 * Định dạng CSS 
 */
const formatCss = (code: string): string => {
  if (!code || typeof code !== 'string') return '';
  
  try {
    // Định dạng CSS cơ bản
    let formattedCss = code
      .replace(/\s*\{\s*/g, ' {\n  ')
      .replace(/;\s*/g, ';\n  ')
      .replace(/\s*}\s*/g, '\n}\n')
      .replace(/\n\s*\n/g, '\n')
      .trim();
    
    return formattedCss;
  } catch (error) {
    console.error('Error formatting CSS:', error);
    return code;
  }
};

/**
 * Sửa lỗi cho comments bị "ăn" code
 */
const fixComments = (html: string): string => {
  if (!html || typeof html !== 'string') return html;
  
  try {
    // Tìm và sửa các dòng comment JavaScript
    return html.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, (match, scriptContent) => {
      // Tách comment và code thành các dòng riêng
      let fixedScript = scriptContent.replace(/(\/\/[^\n]*)(let|const|var|function)/g, '$1\n$2');
      
      // Đảm bảo comment và khai báo biến được tách thành dòng riêng
      fixedScript = fixedScript.replace(/(\/\/[^\n]*[\w\d]+)\s*=\s*/g, '$1\n$2 = ');
      
      // Sửa các tham số function thành tên có ý nghĩa
      fixedScript = fixedScript.replace(/function\s+easeOut\s*\(\$2\)\s*{/, 'function easeOut(t, b, c, d) {');
      
      return match.replace(scriptContent, fixedScript);
    });
  } catch (error) {
    console.error('Error fixing comments:', error);
    return html;
  }
};

/**
 * Sửa lỗi JavaScript phổ biến
 */
const fixJavaScriptErrors = (html: string): string => {
  if (!html || typeof html !== 'string') return html;
  
  try {
    return html.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, (match, scriptContent) => {
      let fixedScript = scriptContent;
      
      // Sửa lỗi tham số placeholder $2 trong khai báo hàm
      fixedScript = fixedScript.replace(
        /function\s+(\w+)\s*\(\$2\)/g, 
        (match, funcName) => {
          // Xác định tham số dựa vào tên hàm
          if (funcName === 'drawSegment') return 'function drawSegment(index, color, text)';
          if (funcName === 'getWinningSegment') return 'function getWinningSegment(finalAngle)';
          if (funcName === 'drawWheel') return 'function drawWheel()';
          if (funcName === 'spinWheel') return 'function spinWheel()';
          if (funcName.includes('ease') || funcName.includes('animate')) return `function ${funcName}(t, b, c, d)`;
          
          // Mặc định không tham số
          return `function ${funcName}()`;
        }
      );
      
      // Sửa lỗi template literals không có backticks
      fixedScript = fixedScript.replace(
        /(\w+\.style\.transform\s*=\s*)rotate\(\$\{([^}]+)\}([^)]*)\);/g,
        (match, prefix, content, suffix) => {
          return `${prefix}\`rotate(\${${content}}${suffix})\`;`;
        }
      );
      
      // Sửa lỗi template literals trong textContent
      fixedScript = fixedScript.replace(
        /(\w+\.textContent\s*=\s*)([^;`"']*)(\$\{)([^}]+)(\})([^;]*);/g,
        (match, prefix, before, interpStart, content, interpEnd, after) => {
          if (!before.includes('`') && !after.includes('`')) {
            return `${prefix}\`${before}${interpStart}${content}${interpEnd}${after}\`;`;
          }
          return match;
        }
      );
      
      // Sửa lỗi setTimeout không có tham số time
      fixedScript = fixedScript.replace(
        /setTimeout\s*\(\s*([^,)]+)\s*\)\s*;/g,
        'setTimeout($1, 0);'
      );
      
      // Thêm kiểm tra ctx cho canvas
      if (fixedScript.includes('canvas.getContext') && 
          !fixedScript.includes('if (!ctx)') &&
          fixedScript.includes('ctx.')) {
        fixedScript = fixedScript.replace(
          /const\s+ctx\s*=\s*canvas\.getContext\(['"]2d['"]\);/,
          `const ctx = canvas.getContext('2d');\n  if (!ctx) { console.error('Không thể lấy 2d context từ canvas'); return; }`
        );
      }
      
      return match.replace(scriptContent, fixedScript);
    });
  } catch (error) {
    console.error('Error fixing JavaScript errors:', error);
    return html;
  }
};

/**
 * Sửa lỗi style CSS trùng lặp
 */
const fixDuplicatedStyles = (html: string): string => {
  if (!html.includes('<style')) return html;

  try {
    // Trích xuất tất cả style tags
    const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
    const styleMatches = Array.from(html.matchAll(styleRegex));
    
    if (styleMatches.length <= 1) return html; // Không có trùng lặp
    
    // Kết hợp tất cả style vào một
    let combinedStyles = '';
    styleMatches.forEach(match => {
      combinedStyles += match[1] + '\n';
    });
    
    // Loại bỏ tất cả style tags
    let processedHtml = html.replace(styleRegex, '');
    
    // Thêm lại một style tag duy nhất trong head
    if (processedHtml.includes('<head>')) {
      processedHtml = processedHtml.replace('<head>', `<head>\n  <style>\n${combinedStyles}\n  </style>`);
    } else {
      // Nếu không có head tag, thêm nó vào
      processedHtml = processedHtml.replace('<html>', '<html>\n<head>\n  <style>\n${combinedStyles}\n  </style>\n</head>');
    }
    
    return processedHtml;
  } catch (error) {
    console.error('Error fixing duplicated styles:', error);
    return html;
  }
};

/**
 * Thêm CSS cơ bản cho game
 */
const addBaseStyles = (html: string): string => {
  const baseStyles = `
    /* Base CSS for responsive games */
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
    }
    
    body {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px;
      background-color: #f9f9f9;
      color: #333;
    }
    
    /* Containers */
    .container, .game-container, #game-container {
      width: 100%;
      max-width: 1000px;
      margin: 0 auto;
    }
    
    /* Canvas */
    canvas {
      display: block;
      max-width: 100%;
      height: auto;
      margin: 0 auto;
    }
    
    /* Controls */
    button {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      background: #4f46e5;
      color: white;
      cursor: pointer;
      font-size: 16px;
      transition: background 0.2s;
    }
    
    button:hover:not(:disabled) {
      background: #4338ca;
    }
    
    button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    
    /* Animations */
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes slideUp {
      from { transform: translateY(20px); }
      to { transform: translateY(0); }
    }
  `;
  
  if (html.includes('<head>') && !html.includes('<style id="base-game-styles">')) {
    return html.replace('</head>', `  <style id="base-game-styles">${baseStyles}\n  </style>\n</head>`);
  }
  
  return html;
};

/**
 * Thêm debug utilities vào cuối body
 */
const addDebugUtilities = (html: string): string => {
  const debugScript = `
<script>
  // Debug utilities cho game trong iframe
  window.onerror = function(message, source, lineno, colno, error) {
    console.error('🔴 Lỗi Game:', message);
    
    // Tạo error overlay để hiển thị lỗi
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
    
    return true; // Ngăn lỗi hiển thị trong console
  };
  
  // Auto-resize cho canvas
  document.addEventListener('DOMContentLoaded', function() {
    console.log('Game đã được khởi tạo thành công');
    
    // Thêm animation cho các thành phần khi trang tải
    document.querySelectorAll('h1, h2, h3, p, button, .card, .item, .box').forEach((el, index) => {
      if (!el.style.animation) {
        el.style.opacity = '0';
        el.style.animation = \`fadeIn 0.5s ease \${index * 0.1}s forwards, slideUp 0.5s ease \${index * 0.1}s forwards\`;
      }
    });
    
    // Tự động điều chỉnh kích thước canvas
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
  
  if (!html.includes('window.onerror')) {
    return html.replace('</body>', `${debugScript}\n</body>`);
  }
  
  return html;
};
