
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
  
  // Format HTML with proper indentation and line breaks
  processedContent = formatHtmlContent(processedContent);
  console.log('🔄 Đã định dạng HTML với thụt lề phù hợp');
  
  // Fix comments that might "eat" code
  processedContent = fixInlineComments(processedContent);
  console.log('🔄 Đã sửa các comment "ăn" mất code');
  
  // Fix common JavaScript errors
  processedContent = fixJavaScriptErrors(processedContent);
  console.log('🔄 Đã sửa các lỗi JavaScript phổ biến');
  
  // Fix duplicated styles by limiting to one style tag in head
  processedContent = fixDuplicatedStyles(processedContent);
  console.log('🔄 Đã sửa các style CSS trùng lặp');
  
  // Add optimization CSS styles at the end, after fixing duplicated styles
  const optimizedStyles = getOptimizedStyles();
  
  // Ensure we only have one style tag in head
  if (processedContent.includes('<head>') && !processedContent.includes('<style id="optimized-iframe-styles">')) {
    processedContent = processedContent.replace('<head>', `<head>\n  <style id="optimized-iframe-styles">\n${optimizedStyles}\n  </style>`);
    console.log('🔄 Đã thêm CSS tối ưu vào head');
  }
  
  // Add a meta tag for Content Security Policy to improve security
  if (!processedContent.includes('content-security-policy')) {
    const cspTag = `<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;">`;
    processedContent = processedContent.replace('</head>', `  ${cspTag}\n</head>`);
    console.log('🔄 Đã thêm Content Security Policy');
  }
  
  // Thêm debug utility script vào cuối body
  const debugScript = `
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
    
    return true; // Ngăn lỗi hiển thị trong console
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
        // Đảm bảo canvas responsive trong container của nó
        if (canvas.parentElement && !canvas.hasAttribute('data-auto-sized')) {
          const parentWidth = canvas.parentElement.clientWidth;
          // Giữ nguyên aspect ratio
          const aspectRatio = canvas.width / canvas.height;
          const newWidth = Math.min(parentWidth * 0.95, canvas.width); // Giới hạn kích thước tối đa
          canvas.style.width = newWidth + 'px';
          canvas.style.height = (newWidth / aspectRatio) + 'px';
          canvas.setAttribute('data-auto-sized', 'true');
        }
      });
    };
    
    // Resize ngay khi load và khi thay đổi kích thước màn hình
    resizeCanvases();
    window.addEventListener('resize', resizeCanvases);
  });
</script>`;
  
  processedContent = processedContent.replace('</body>', `${debugScript}\n</body>`);
  console.log('🔄 Đã thêm debug utility script');
  
  console.log('✅ Đã hoàn thành xử lý! Code sẵn sàng để chạy.');
  return processedContent;
};

/**
 * Sửa lỗi trùng lặp style trong HTML
 */
const fixDuplicatedStyles = (html: string): string => {
  if (!html.includes('<style')) return html;

  try {
    // Extract all style tags
    const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
    const styleMatches = Array.from(html.matchAll(styleRegex));
    
    if (styleMatches.length <= 1) return html; // No duplication
    
    // Combine all styles into one
    let combinedStyles = '';
    styleMatches.forEach(match => {
      combinedStyles += match[1] + '\n';
    });
    
    // Remove all style tags
    let processedHtml = html.replace(styleRegex, '');
    
    // Add back single style tag in head
    if (processedHtml.includes('<head>')) {
      processedHtml = processedHtml.replace('<head>', `<head>\n  <style>\n${combinedStyles}\n  </style>`);
    } else {
      // If no head tag, add it
      processedHtml = processedHtml.replace('<html>', '<html>\n<head>\n  <style>\n${combinedStyles}\n  </style>\n</head>');
    }
    
    return processedHtml;
  } catch (error) {
    console.error('Error fixing duplicated styles:', error);
    return html;
  }
};

/**
 * Format JavaScript code with proper indentation and line breaks
 */
const formatJavaScript = (code: string): string => {
  if (!code || typeof code !== 'string') return '';
  
  try {
    // Basic JS formatting
    let formatted = code
      // Add line breaks after semicolons, opening braces, and before closing braces
      .replace(/;(?!\n)/g, ';\n')
      .replace(/{(?!\n)/g, '{\n')
      .replace(/(?<!\n)}/g, '\n}')
      // Add line breaks after function declarations
      .replace(/function\s+(\w+)\s*\([^)]*\)\s*{/g, 'function $1($2) {\n')
      // Format if statements with line breaks
      .replace(/if\s*\([^)]+\)\s*{/g, match => match + '\n')
      // Format for loops with line breaks
      .replace(/for\s*\([^)]+\)\s*{/g, match => match + '\n')
      // Format variable declarations with line breaks
      .replace(/(const|let|var)\s+([^;]+);/g, '$1 $2;\n')
      // Clean up excessive empty lines
      .replace(/\n\s*\n\s*\n/g, '\n\n');
    
    // Add proper indentation
    const lines = formatted.split('\n');
    let indentLevel = 1; // Start with 1 level as we're inside a self-executing function
    let indentedCode = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) {
        indentedCode += '\n';
        continue;
      }
      
      // Decrease indent for closing braces
      if (line.startsWith('}')) {
        indentLevel = Math.max(0, indentLevel - 1);
      }
      
      // Add current indentation
      indentedCode += '  '.repeat(indentLevel) + line + '\n';
      
      // Increase indent after opening braces
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
 * Format a script tag with proper indentation
 */
const formatScriptTag = (scriptTag: string): string => {
  if (!scriptTag || typeof scriptTag !== 'string') return '';
  
  try {
    // Extract content between script tags
    const content = scriptTag.match(/<script[^>]*>([\s\S]*?)<\/script>/i)?.[1] || '';
    
    if (!content.trim()) {
      return '<script>\n</script>';
    }
    
    // Get attributes from opening tag
    const attributes = scriptTag.match(/<script([^>]*)>/i)?.[1] || '';
    
    // Format the script content with indentation
    const formattedContent = formatJavaScript(content);
    
    // Return formatted script tag
    return `<script${attributes}>\n${formattedContent}</script>`;
  } catch (error) {
    console.error('Error formatting script tag:', error);
    return scriptTag;
  }
};

/**
 * Format HTML content with proper indentation and line breaks
 */
const formatHtmlContent = (html: string): string => {
  if (!html || typeof html !== 'string') return '';
  
  try {
    // Preserve content in script and style tags
    const scriptTags: string[] = [];
    const styleTags: string[] = [];
    
    // Extract and replace script tags with placeholders
    let processedHtml = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, (match) => {
      const placeholder = `__SCRIPT_PLACEHOLDER_${scriptTags.length}__`;
      scriptTags.push(match);
      return placeholder;
    });
    
    // Extract and replace style tags with placeholders
    processedHtml = processedHtml.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, (match) => {
      const placeholder = `__STYLE_PLACEHOLDER_${styleTags.length}__`;
      styleTags.push(match);
      return placeholder;
    });
    
    // Format HTML structure
    processedHtml = processedHtml
      // Add line breaks after opening tags
      .replace(/(<[^\/!][^>]*>)(?!\s*[\r\n])/g, '$1\n')
      // Add line breaks before closing tags
      .replace(/(?<!\s*[\r\n])(<\/[^>]+>)/g, '\n$1')
      // Add line breaks after self-closing tags
      .replace(/(<[^>]*\/>)(?!\s*[\r\n])/g, '$1\n')
      // Add line breaks after comments and DOCTYPE
      .replace(/(<!(?:DOCTYPE|--)[^>]*>)(?!\s*[\r\n])/g, '$1\n')
      // Clean up excessive empty lines
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      .trim();
    
    // Apply indentation
    const lines = processedHtml.split('\n');
    let indentLevel = 0;
    let formattedHtml = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      // Special case for DOCTYPE which doesn't get indented
      if (line.startsWith('<!DOCTYPE')) {
        formattedHtml += line + '\n';
        continue;
      }
      
      // Decrease indent for closing tags
      if (line.startsWith('</') && !line.startsWith('</script') && !line.startsWith('</style')) {
        indentLevel = Math.max(0, indentLevel - 1);
      }
      
      // Add current indentation
      formattedHtml += '  '.repeat(indentLevel) + line + '\n';
      
      // Increase indent after opening tags, but not for self-closing or special tags
      if (line.match(/<[^\/!][^>]*>/) && 
          !line.match(/<[^>]*\/>/) && 
          !line.match(/<(script|style|link|meta|br|hr|img|input)[^>]*>/i)) {
        indentLevel++;
      }
    }
    
    // Restore script tags
    scriptTags.forEach((script, index) => {
      const placeholder = `__SCRIPT_PLACEHOLDER_${index}__`;
      formattedHtml = formattedHtml.replace(placeholder, formatScriptTag(script));
    });
    
    // Restore style tags with formatting
    styleTags.forEach((style, index) => {
      const placeholder = `__STYLE_PLACEHOLDER_${index}__`;
      
      // Format the CSS content
      const formattedStyle = style.replace(/<style[^>]*>([\s\S]*?)<\/style>/i, (match, cssContent) => {
        const formattedCss = cssContent
          .replace(/{/g, ' {\n  ')
          .replace(/;/g, ';\n  ')
          .replace(/}/g, '\n}')
          .replace(/\s+/g, ' ')
          .replace(/\n\s*\n/g, '\n')
          .trim();
        
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
 * Tách comments và code thành các dòng riêng biệt để tránh lỗi comments "nuốt" code
 */
const fixInlineComments = (html: string): string => {
  if (!html || typeof html !== 'string') return html;
  
  try {
    // Tìm và sửa các dòng comment JavaScript
    return html.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, (match, scriptContent) => {
      // Tách comment và code thành các dòng riêng
      let fixedScript = scriptContent.replace(/(\/\/[^\n]*)(let|const|var|function)/g, '$1\n$2');
      
      // Đảm bảo comment và khai báo biến được tách thành dòng riêng
      fixedScript = fixedScript.replace(/(\/\/[^\n]*[\w\d]+)\s*=\s*/g, '$1\n$2 = ');
      
      // Sửa function easeOut có tham số đúng
      fixedScript = fixedScript.replace(/function\s+easeOut\s*\(\$2\)\s*{/, 'function easeOut(t, b, c, d) {');
      
      return match.replace(scriptContent, fixedScript);
    });
  } catch (error) {
    console.error('Error fixing inline comments:', error);
    return html;
  }
};

/**
 * Sửa lỗi JavaScript tổng quát từ AI
 * - Xử lý các vấn đề phổ biến trong mã được tạo bởi AI
 */
const fixJavaScriptErrors = (html: string): string => {
  if (!html || typeof html !== 'string') return html;
  
  try {
    // Xử lý lỗi trong các thẻ script
    return html.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, (match, scriptContent) => {
      console.log('🔍 Đang sửa JavaScript...');
      
      // Sửa lỗi tham số $2 trong các khai báo hàm
      let fixedScript = scriptContent.replace(
        /function\s+(\w+)\s*\(\$2\)/g, 
        (match, funcName) => {
          console.log(`  🛠️ Sửa hàm ${funcName} có tham số $2`);
          
          // Dựa vào tên hàm để xác định tham số phù hợp
          if (funcName === 'drawSegment') return 'function drawSegment(index)';
          if (funcName === 'getWinningSegment') return 'function getWinningSegment(finalAngle)';
          if (funcName === 'drawWheel' || funcName === 'spinWheel') return `function ${funcName}()`;
          
          // Với các hàm khác, mặc định không có tham số
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
          // Chỉ thêm backtick nếu chưa có
          if (!before.includes('`') && !after.includes('`')) {
            return `${prefix}\`${before}${interpStart}${content}${interpEnd}${after}\`;`;
          }
          return match;
        }
      );
      
      // Fix lỗi phổ biến: gọi setTimeout không có tham số time
      fixedScript = fixedScript.replace(
        /setTimeout\s*\(\s*([^,)]+)\s*\)\s*;/g,
        'setTimeout($1, 0);'
      );
      
      // Thêm xử lý cho lỗi canvas không lấy context 2d
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
 * Get optimized styles for the iframe content
 */
const getOptimizedStyles = (): string => {
  return `
    /* Reset CSS */
    *, *::before, *::after {
      box-sizing: border-box;
    }
    
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      font-size: 16px;
    }
    
    body {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px;
      background-color: #f9f9f9;
      color: #333;
    }
    
    /* Typography */
    h1, h2, h3, h4, h5, h6 {
      margin-top: 0.8em;
      margin-bottom: 0.5em;
      line-height: 1.4;
      font-weight: 600;
    }
    
    h1 { font-size: 2.25rem; }
    h2 { font-size: 1.75rem; }
    h3 { font-size: 1.5rem; }
    
    p { margin-bottom: 1rem; }
    
    /* Canvas and containers */
    canvas {
      display: block;
      max-width: 100%;
      height: auto;
      margin: 0 auto;
    }
    
    /* Container styles */
    .container, .game-container, #game-container {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 1rem;
    }
    
    /* Button styles */
    button {
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
      font-weight: 500;
      color: white;
      background-color: #4f46e5;
      border: none;
      border-radius: 0.375rem;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    button:hover:not(:disabled) {
      background-color: #4338ca;
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
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    
    /* Wheel specific styles */
    .wheel-container {
      position: relative;
      margin: 1rem auto;
      max-width: 100%;
    }
    
    /* Responsive styles */
    @media (max-width: 768px) {
      body { padding: 10px; }
      h1 { font-size: 1.75rem; }
      button { padding: 0.6rem 1.2rem; }
    }
  `;
};
