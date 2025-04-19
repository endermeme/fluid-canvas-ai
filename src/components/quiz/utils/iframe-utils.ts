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
  
  // Optimized CSS styles with proper formatting - Cải thiện để tránh xung đột
  const optimizedStyles = `
<style>
  /* ===== BASE STYLES ===== */
  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 16px;
    line-height: 1.6;
    color: #333;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    scroll-behavior: smooth;
  }
  
  /* ===== LAYOUT ===== */
  body {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    background: linear-gradient(135deg, #f3f4f8 0%, #e5e9f2 100%);
    padding: 1.5rem;
    box-sizing: border-box;
    min-height: 100vh;
  }
  
  /* Box-sizing reset */
  *, *::before, *::after {
    box-sizing: border-box;
  }
  
  /* ===== CONTAINER STYLES ===== */
  #game-container, #root, #app, .container, .game-container, #game, .game, main, [class*="container"] {
    width: 100%;
    min-height: 500px;
    margin: 0 auto;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    max-width: 1600px;
    background-color: rgba(255, 255, 255, 0.98);
    border-radius: 1.25rem;
    box-shadow: 
      0 10px 25px -5px rgba(0, 0, 0, 0.1),
      0 10px 10px -5px rgba(0, 0, 0, 0.04);
    margin-top: 1rem;
    margin-bottom: 2rem;
    position: relative;
    overflow: hidden;
    border: 1px solid rgba(226, 232, 240, 0.8);
  }
  
  /* ===== CANVAS STYLES ===== */
  canvas {
    display: block;
    max-width: 100%;
    height: auto;
    margin: 0 auto;
    object-fit: contain;
    image-rendering: crisp-edges;
    max-height: 80vh;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    background-color: white;
  }
  
  /* Wheel container */
  .wheel-container {
    position: relative;
    width: 100%;
    max-width: 850px;
    margin: 1.5rem auto;
  }
  
  .wheel-container canvas {
    width: 100%;
    height: auto;
    display: block;
  }
  
  /* ===== TYPOGRAPHY ===== */
  h1, h2, h3, h4, h5, h6 {
    margin: 0.7em 0;
    text-align: center;
    color: #1a202c;
    font-weight: 700;
    letter-spacing: -0.015em;
    text-rendering: optimizeLegibility;
    max-width: 100%;
    word-wrap: break-word;
    overflow-wrap: break-word;
    line-height: 1.3;
  }
  
  h1 { 
    font-size: 2.5rem; 
    margin-top: 0.8em; 
    background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
  }
  
  h2 { 
    font-size: 2rem; 
    color: #2563eb;
  }
  
  h3 { 
    font-size: 1.75rem; 
    color: #3b82f6;
  }
  
  h4 { font-size: 1.5rem; }
  
  p, li, label, span, div {
    margin-bottom: 0.75em;
    line-height: 1.65;
    text-rendering: optimizeLegibility;
    max-width: 100%;
    word-wrap: break-word;
    overflow-wrap: break-word;
    font-size: 1.05rem;
    color: #4a5568;
  }
  
  /* Text selection */
  ::selection {
    background-color: rgba(59, 130, 246, 0.2);
    color: #2563eb;
  }
  
  /* ===== BUTTONS ===== */
  button, .button, [class*="btn"], input[type="button"], input[type="submit"] {
    cursor: pointer;
    padding: 0.75rem 1.5rem;
    margin: 0.75rem;
    background: #4f46e5;
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-size: 1.1rem;
    font-weight: 600;
    transition: all 0.2s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    white-space: nowrap;
    position: relative;
    overflow: hidden;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    text-decoration: none;
  }
  
  button:hover, .button:hover, [class*="btn"]:hover {
    background: #4338ca;
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
  
  button:active, .button:active, [class*="btn"]:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  button:focus, .button:focus, [class*="btn"]:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.4);
  }
  
  /* Button with hover effect */
  button::after, .button::after, [class*="btn"]::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: -100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: all 0.6s ease;
  }
  
  button:hover::after, .button:hover::after, [class*="btn"]:hover::after {
    left: 100%;
  }
  
  /* ===== FORM ELEMENTS ===== */
  input, select, textarea {
    padding: 0.75rem 1rem;
    margin: 0.5rem 0 1rem;
    border: 2px solid #e2e8f0;
    border-radius: 0.5rem;
    background-color: white;
    font-size: 1rem;
    width: 100%;
    max-width: 450px;
    transition: all 0.2s ease;
    color: #4a5568;
  }
  
  input:focus, select:focus, textarea:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.3);
  }
  
  label {
    font-weight: 500;
    color: #2d3748;
    margin-bottom: 0.5rem;
    display: block;
  }
  
  /* ===== UTILITIES ===== */
  /* Hide unnecessary elements */
  pre, code {
    display: none;
  }
  
  /* Fix transform text issues */
  [style*="transform"] {
    backface-visibility: hidden;
    -webkit-font-smoothing: subpixel-antialiased;
  }
  
  /* Game text elements */
  .score-text, .prompt-text, .question-text, .result-text, .game-text, .message-text, [class*="text"] {
    font-weight: 600;
    font-size: 1.25rem;
    color: #1a202c;
    line-height: 1.4;
    margin: 0.6em 0;
  }
  
  /* Text visibility enhancement */
  [class*="text"], [class*="label"], [class*="score"], [class*="prompt"], [class*="question"], [class*="message"], [class*="title"] {
    position: relative;
    z-index: 10;
    text-shadow: 
      0px 1px 1px rgba(255, 255, 255, 0.8),
      0px -1px 1px rgba(255, 255, 255, 0.8),
      1px 0px 1px rgba(255, 255, 255, 0.8),
      -1px 0px 1px rgba(255, 255, 255, 0.8);
    font-weight: 600;
  }
  
  /* ===== LAYOUT COMPONENTS ===== */
  .grid, .flex, .layout, .row, .column, [class*="grid"], [class*="flex"] {
    display: flex;
    flex-wrap: wrap;
    gap: 1.25rem;
    width: 100%;
    justify-content: center;
    margin: 1rem 0;
  }
  
  .column, [class*="column"] {
    flex-direction: column;
  }
  
  /* Card elements */
  .card, .item, .box, [class*="card"], [class*="item"], [class*="box"] {
    background: white;
    border-radius: 0.75rem;
    padding: 1.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    margin: 0.75rem;
    transition: all 0.25s ease;
    border: 1px solid rgba(226, 232, 240, 0.7);
  }
  
  .card:hover, .item:hover, .box:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  }
  
  /* ===== ANIMATIONS ===== */
  @keyframes fadeIn {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }
  
  @keyframes slideUp {
    0% { transform: translateY(20px); opacity: 0; }
    100% { transform: translateY(0); opacity: 1; }
  }
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  
  /* Apply animations */
  .fade-in {
    animation: fadeIn 0.5s ease forwards;
  }
  
  .slide-up {
    animation: slideUp 0.5s ease forwards;
  }
  
  .pulse {
    animation: pulse 2s infinite;
  }
  
  /* ===== SCROLLBAR STYLING ===== */
  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }
  
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 5px;
  }
  
  ::-webkit-scrollbar-thumb {
    background: #cbd5e0;
    border-radius: 5px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: #a0aec0;
  }
  
  /* ===== RESPONSIVE DESIGN ===== */
  @media (max-width: 768px) {
    html, body {
      font-size: 15px;
    }
    
    #game-container, #root, #app, .container, .game-container, #game, .game, main, [class*="container"] {
      padding: 1rem;
      min-height: 300px;
      border-radius: 1rem;
      margin: 0.5rem 0;
    }
    
    button, .button, [class*="btn"] {
      padding: 0.6rem 1.2rem;
      font-size: 1rem;
      margin: 0.5rem;
    }
    
    .wheel-container {
      max-width: 95%;
    }
    
    h1 { font-size: 2rem; }
    h2 { font-size: 1.75rem; }
    h3 { font-size: 1.5rem; }
    
    input, select, textarea {
      padding: 0.6rem 0.8rem;
    }
  }
  
  /* Larger screens */
  @media (min-width: 1200px) {
    #game-container, #root, #app, .container, .game-container, #game, .game, main, [class*="container"] {
      max-width: 1800px;
      padding: 2.5rem;
    }
    
    .wheel-container {
      max-width: 950px;
    }
    
    h1 { font-size: 2.75rem; }
    
    button, .button, [class*="btn"] {
      padding: 0.85rem 1.75rem;
      font-size: 1.15rem;
    }
  }
  
  /* Dark mode support */
  @media (prefers-color-scheme: dark) {
    body {
      background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%);
    }
    
    #game-container, #root, #app, .container, .game-container, #game, .game, main, [class*="container"] {
      background-color: rgba(26, 32, 44, 0.95);
      border-color: rgba(45, 55, 72, 0.8);
    }
    
    h1, h2, h3, h4, h5, h6 {
      color: #e2e8f0;
    }
    
    p, li, label, span, div {
      color: #cbd5e0;
    }
    
    button, .button, [class*="btn"] {
      background: #5a67d8;
    }
    
    button:hover, .button:hover, [class*="btn"]:hover {
      background: #4c51bf;
    }
    
    input, select, textarea {
      background-color: #2d3748;
      border-color: #4a5568;
      color: #e2e8f0;
    }
    
    input:focus, select:focus, textarea:focus {
      border-color: #5a67d8;
    }
    
    .card, .item, .box, [class*="card"], [class*="item"], [class*="box"] {
      background: #2d3748;
      border-color: #4a5568;
    }
    
    .score-text, .prompt-text, .question-text, .result-text, .game-text, .message-text, [class*="text"] {
      color: #e2e8f0;
    }
    
    [class*="text"], [class*="label"], [class*="score"], [class*="prompt"], [class*="question"], [class*="message"], [class*="title"] {
      text-shadow: 
        0px 1px 1px rgba(26, 32, 44, 0.8),
        0px -1px 1px rgba(26, 32, 44, 0.8),
        1px 0px 1px rgba(26, 32, 44, 0.8),
        -1px 0px 1px rgba(26, 32, 44, 0.8);
    }
  }
</style>`;
  
  // Insert the optimized styles into the head
  if (processedContent.includes('<head>')) {
    processedContent = processedContent.replace('<head>', `<head>${optimizedStyles}`);
  } else if (processedContent.includes('<html>')) {
    processedContent = processedContent.replace('<html>', `<html><head>${optimizedStyles}</head>`);
  } else {
    processedContent = `<!DOCTYPE html>
<html>
  <head>
    ${optimizedStyles}
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body>
    ${processedContent}
  </body>
</html>`;
  }
  console.log('🔄 Đã thêm CSS tối ưu vào head');
  
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
    
    // Hiển thị thông báo game trong overlay nếu cần
    if (message.toLowerCase().includes('error') || message.toLowerCase().includes('lỗi')) {
      window.onerror(message, '', 0, 0, null);
    }
  };
  
  // Auto-resize cho canvas elements
  document.addEventListener('DOMContentLoaded', function() {
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
        if (canvas.parentElement) {
          const parentWidth = canvas.parentElement.clientWidth;
          // Giữ nguyên aspect ratio
          const aspectRatio = canvas.width / canvas.height;
          const newWidth = Math.min(parentWidth, 1200); // Giới hạn kích thước tối đa
          canvas.style.width = newWidth + 'px';
          canvas.style.height = (newWidth / aspectRatio) + 'px';
        }
      });
    };
    
    // Resize ngay khi load và khi thay đổi kích thước màn hình
    resizeCanvases();
    window.addEventListener('resize', resizeCanvases);
    
    // Thêm hiệu ứng hover cho các nút
    document.querySelectorAll('button, .button, [class*="btn"]').forEach(button => {
      button.addEventListener('mouseover', function() {
        this.style.transform = 'translateY(-3px)';
        this.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)';
      });
      
      button.addEventListener('mouseout', function() {
        this.style.transform = '';
        this.style.boxShadow = '';
      });
    });
  });
</script>`;
  
  processedContent = processedContent.replace('</body>', `${debugScript}\n</body>`);
  console.log('🔄 Đã thêm debug utility script');
  
  // Properly format and wrap JavaScript in script tags
  processedContent = processedContent.replace(/<script>([\s\S]*?)<\/script>/gi, (match, scriptContent) => {
    // Don't wrap already wrapped code or empty scripts
    if (!scriptContent.trim() || 
        scriptContent.includes('(function()') || 
        scriptContent.includes('(() =>')) {
      return formatScriptTag(match);
    }
    
    // Wrap in self-executing function with proper indentation and add debug log
    const modifiedScript = `// Game initialization
${formatJavaScript(scriptContent)}

// Log game ready
if (window.gameLog) {
  window.gameLog('Game đã khởi tạo thành công!');
}`;
    
    return `<script>\n(function() {\n${modifiedScript}\n})();\n</script>`;
  });
  console.log('🔄 Đã format và wrap JavaScript code');
  
  console.log('✅ Đã hoàn thành xử lý! Code sẵn sàng để chạy.');
  return processedContent;
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
      console.log('🔍 Đang sửa JavaScript, chiều dài: ' + scriptContent.length + ' ký tự');
      
      // Lưu vị trí dấu xuống dòng và spaces để giữ format
      const newlineIndices = [];
      const spaceRuns = [];
      
      // Lưu lại cấu trúc xuống dòng
      let lastNewlineIndex = -1;
      for (let i = 0; i < scriptContent.length; i++) {
        if (scriptContent[i] === '\n') {
          newlineIndices.push(i);
          let spaceCount = 0;
          for (let j = i + 1; j < scriptContent.length && scriptContent[j] === ' '; j++) {
            spaceCount++;
          }
          spaceRuns.push(spaceCount);
          lastNewlineIndex = i;
        }
      }
      
      // Sửa lỗi tham số $2 trong các khai báo hàm
      let fixedScript = scriptContent.replace(
        /function\s+(\w+)\s*\(\$2\)/g, 
        (match, funcName) => {
          // Dựa vào tên hàm để xác định tham số phù hợp
          console.log(`  🛠️ Sửa hàm ${funcName} có tham số $2`);
          if (funcName === 'drawSegment') return 'function drawSegment(index)';
          if (funcName === 'getWinningSegment') return 'function getWinningSegment(finalAngle)';
          if (funcName === 'drawWheel' || funcName === 'spinWheel') return `function ${funcName}()`;
          // Với các hàm khác, mặc định không có tham số
          return `function ${funcName}()`;
        }
      );
      
      // Sửa lỗi template literals bị mất backticks (`)
      // 1. Template literals trong transform
      let templateFixCount = 0;
      fixedScript = fixedScript.replace(
        /(\w+\.style\.transform\s*=\s*)rotate\(\$\{([^}]+)\}([^)]*)\);/g,
        (match, prefix, content, suffix) => {
          templateFixCount++;
          return `${prefix}\`rotate(\${${content}}${suffix})\`;`;
        }
      );
      
      // 2. Template literals trong textContent
      fixedScript = fixedScript.replace(
        /(\w+\.textContent\s*=\s*)([^;`"']*)(\$\{)([^}]+)(\})([^;]*);/g,
        (match, prefix, before, interpStart, content, interpEnd, after) => {
          // Chỉ thêm backtick nếu chưa có
          if (!before.includes('`') && !after.includes('`')) {
            templateFixCount++;
            return `${prefix}\`${before}${interpStart}${content}${interpEnd}${after}\`;`;
          }
          return match;
        }
      );
      
      // 3. Bất kỳ template literals nào trong code
      const templateLiteralRegex = /(\$\{[^}]+\})/g;
      let result;
      let lastIndex = 0;
      
      // Xử lý từng template literal một
      while ((result = templateLiteralRegex.exec(fixedScript)) !== null) {
        const fullMatch = result[0];
        const startIndex = result.index;
        const endIndex = startIndex + fullMatch.length;
        
        // Tìm từ đầu dòng đến kết thúc dòng
        let lineStartIndex = fixedScript.lastIndexOf('\n', startIndex);
        lineStartIndex = lineStartIndex === -1 ? 0 : lineStartIndex + 1;
        
        let lineEndIndex = fixedScript.indexOf('\n', endIndex);
        lineEndIndex = lineEndIndex === -1 ? fixedScript.length : lineEndIndex;
        
        // Lấy toàn bộ dòng chứa template literal
        const line = fixedScript.substring(lineStartIndex, lineEndIndex);
        
        // Nếu dòng chứa ${} nhưng không có backtick
        if (line.includes('${') && !line.includes('`')) {
          // Tìm vị trí assignment
          const assignIndex = line.indexOf('=');
          if (assignIndex !== -1) {
            // Tạo new line với backticks
            const prefix = line.substring(0, assignIndex + 1).trim();
            const content = line.substring(assignIndex + 1).trim();
            // Bỏ dấu ; cuối nếu có
            const contentWithoutSemicolon = content.endsWith(';') 
              ? content.substring(0, content.length - 1) 
              : content;
            
            const newLine = `${prefix} \`${contentWithoutSemicolon}\`;`;
            
            // Thay thế line cũ bằng line mới trong script
            fixedScript = fixedScript.substring(0, lineStartIndex) + 
                          newLine + 
                          fixedScript.substring(lineEndIndex);
            
            // Cập nhật lại các chỉ số
            const lengthDiff = newLine.length - line.length;
            templateLiteralRegex.lastIndex += lengthDiff;
            templateFixCount++;
          }
        }
        
        // Tránh vòng lặp vô hạn
        if (templateLiteralRegex.lastIndex === lastIndex) {
          templateLiteralRegex.lastIndex++;
        }
        lastIndex = templateLiteralRegex.lastIndex;
      }
      
      // Sửa lỗi tham chiếu tới biến không tồn tại
      // Lỗi phổ biến trong vòng lặp forEach
      let forEachFixCount = 0;
      fixedScript = fixedScript.replace(
        /\.forEach\(\(([^,)]+)(?:,[^)]+)?\)\s*=>\s*{/g,
        (match, param) => {
          // Thêm param vào các gọi hàm bên trong forEach nếu tham số chỉ là _
          if (param === '_') {
            forEachFixCount++;
            return match.replace('_', 'item, index');
          }
          return match;
        }
      );
      
      // Khôi phục cấu trúc xuống dòng và spaces
      if (newlineIndices.length > 0) {
        let result = '';
        let lastIndex = 0;
        
        for (let i = 0; i < newlineIndices.length; i++) {
          const originalNewlineIndex = newlineIndices[i];
          const spaces = ' '.repeat(spaceRuns[i] || 0);
          
          // Tìm vị trí tương ứng trong fixedScript
          const textBefore = scriptContent.substring(lastIndex, originalNewlineIndex);
          const textBeforeFixedIndex = fixedScript.indexOf(textBefore, lastIndex);
          
          if (textBeforeFixedIndex !== -1) {
            const fixedNewlineIndex = textBeforeFixedIndex + textBefore.length;
            result += fixedScript.substring(lastIndex, fixedNewlineIndex) + '\n' + spaces;
            lastIndex = fixedNewlineIndex;
          }
        }
        
        result += fixedScript.substring(lastIndex);
        fixedScript = result;
      }
      
      // Thêm xử lý cho lỗi canvas không lấy context 2d
      if (fixedScript.includes('canvas.getContext') && 
          !fixedScript.includes('if (!ctx)') &&
          fixedScript.includes('ctx.')) {
        fixedScript = fixedScript.replace(
          /const\s+ctx\s*=\s*canvas\.getContext\(['"]2d['"]\);/,
          `const ctx = canvas.getContext('2d');\n  if (!ctx) { console.error('Không thể lấy 2d context từ canvas'); return; }`
        );
        console.log('  🛠️ Đã thêm kiểm tra canvas context');
      }
      
      // Fix lỗi phổ biến: gọi setTimeout không có tham số time
      fixedScript = fixedScript.replace(
        /setTimeout\s*\(\s*([^,)]+)\s*\)\s*;/g,
        'setTimeout($1, 0);'
      );
      
      console.log(`  ✓ Đã sửa: ${templateFixCount} template literals, ${forEachFixCount} forEach callbacks`);
      return match.replace(scriptContent, fixedScript);
    });
  } catch (error) {
    console.error('❌ Lỗi khi sửa JavaScript:', error);
    return html;
  }
};

// Thêm CSS cải thiện UI cho iframe
const getEnhancedStyles = () => `
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
  
  body {
    margin: 0;
    padding: 20px;
    background-color: #ffffff;
    color: #333;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 16px;
    line-height: 1.6;
    overflow-x: hidden;
    max-width: 100%;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  h1, h2, h3, h4, h5, h6 {
    margin-bottom: 0.8em;
    line-height: 1.3;
    color: #111;
    font-weight: 600;
  }
  
  h1 {
    font-size: 2.5rem;
  }
  
  h2 {
    font-size: 2rem;
  }
  
  h3 {
    font-size: 1.75rem;
  }
  
  p, ul, ol {
    margin-bottom: 1rem;
    font-size: 1rem;
  }
  
  button, input, select, textarea {
    font-family: inherit;
    font-size: 1rem;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    border: 1px solid #ccc;
  }
  
  button {
    background-color: #3b82f6;
    color: white;
    border: none;
    padding: 0.6rem 1.2rem;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.2s;
  }
  
  button:hover {
    background-color: #2563eb;
  }
  
  input[type="text"], input[type="number"], select, textarea {
    width: 100%;
    padding: 0.75rem;
    margin-bottom: 1rem;
  }
  
  .container {
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 15px;
  }
  
  .row {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -15px;
  }
  
  .col {
    padding: 0 15px;
    flex: 1;
  }
  
  .card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }
  
  @media (max-width: 768px) {
    body {
      padding: 15px;
      font-size: 15px;
    }
    
    h1 {
      font-size: 2rem;
    }
    
    h2 {
      font-size: 1.7rem;
    }
    
    h3 {
      font-size: 1.4rem;
    }
    
    .row {
      flex-direction: column;
    }
  }
`;
