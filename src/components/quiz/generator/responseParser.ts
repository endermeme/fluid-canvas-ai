import { MiniGame } from './types';
import { injectImageUtils } from './imageGenerator';

/**
 * Trích xuất HTML, CSS và JS từ markdown
 */
const extractCodeFromMarkdown = (text: string): { html: string, css: string, js: string } => {
  const htmlMatch = text.match(/```html\n([\s\S]*?)```/);
  const cssMatch = text.match(/```css\n([\s\S]*?)```/);
  const jsMatch = text.match(/```js(?:cript)?\n([\s\S]*?)```/);

  const htmlCode = htmlMatch?.[1]?.trim() || '';
  const cssCode = cssMatch?.[1]?.trim() || '';
  const jsCode = jsMatch?.[1]?.trim() || '';

  return {
    html: htmlCode,
    css: cssCode,
    js: jsCode
  };
};

/**
 * Trích xuất HTML, CSS và JS từ HTML hoàn chỉnh
 */
const extractCodeFromFullHtml = (html: string): { html: string, css: string, js: string } => {
  // Tìm style tag
  const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/i);
  const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/i);

  let htmlCode = html;
  const cssCode = styleMatch?.[1]?.trim() || '';
  const jsCode = scriptMatch?.[1]?.trim() || '';

  // Loại bỏ style và script khỏi HTML
  if (styleMatch) {
    htmlCode = htmlCode.replace(/<style>[\s\S]*?<\/style>/i, '');
  }
  if (scriptMatch) {
    htmlCode = htmlCode.replace(/<script>[\s\S]*?<\/script>/i, '');
  }

  return {
    html: htmlCode,
    css: cssCode,
    js: jsCode
  };
};

/**
 * Trích xuất HTML, CSS, JS từ định dạng lạ (HTML kèm css và js ở cuối)
 */
const extractCodeFromMixedFormat = (text: string): { html: string, css: string, js: string } => {
  // Tìm HTML hoàn chỉnh
  const htmlMatch = text.match(/<!DOCTYPE[\s\S]*?<\/html>/i);
  if (!htmlMatch) return { html: '', css: '', js: '' };

  // Nhận HTML
  const fullHtml = htmlMatch[0];
  
  // Tìm phần CSS
  const cssMatch = text.match(/<\/html>[\s\S]*?css\s+([\s\S]*?)(?=js|$)/i);
  const jsMatch = text.match(/js\s+([\s\S]*?)$/i);

  // Trích xuất các phần
  const cssCode = cssMatch?.[1]?.trim() || '';
  const jsCode = jsMatch?.[1]?.trim() || '';

  // Trích xuất nội dung HTML từ HTML hoàn chỉnh
  const { html: htmlContent } = extractCodeFromFullHtml(fullHtml);

  return {
    html: htmlContent,
    css: cssCode,
    js: jsCode
  };
};

/**
 * Định dạng HTML với thụt lề và xuống dòng
 */
const formatHTML = (code: string): string => {
  if (!code.trim()) return '';
  
  try {
    // Xử lý trường hợp HTML trên một dòng
    if (!code.includes('\n')) {
      return formatHTMLOneLineToMultiLine(code);
    }
    
    let formattedLines = [];
    let indentLevel = 0;
    const lines = code.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();
      if (!line) continue;
      
      // Giảm thụt lề cho thẻ đóng
      if (line.match(/^<\/\w+>/)) {
        indentLevel = Math.max(0, indentLevel - 1);
      }
      
      // Thêm thụt lề
      formattedLines.push('  '.repeat(indentLevel) + line);
      
      // Tăng thụt lề cho thẻ mở (không phải thẻ tự đóng)
      if (line.match(/<\w+[^>]*>/) && !line.match(/<\w+[^>]*\/>/)) {
        // Không tăng thụt lề cho các thẻ không cần đóng
        if (!line.match(/<(br|hr|img|input|link|meta)[^>]*>/i)) {
          indentLevel++;
        }
      }
    }
    
    return formattedLines.join('\n');
  } catch (error) {
    console.error('Error formatting HTML:', error);
    return code;
  }
};

/**
 * Chuyển HTML từ một dòng sang nhiều dòng
 */
const formatHTMLOneLineToMultiLine = (code: string): string => {
  let formattedCode = code
    .replace(/></g, '>\n<')
    .replace(/>\s*([^<]+)\s*</g, '>\n$1\n<');
  
  return formatHTML(formattedCode);
};

/**
 * Định dạng JavaScript với thụt lề và xuống dòng
 */
const formatJavaScript = (code: string): string => {
  if (!code.trim()) return '';
  
  try {
    // Xử lý trường hợp JS trên một dòng
    if (!code.includes('\n')) {
      code = formatJSOneLineToMultiLine(code);
    }
    
    let formattedCode = code
      .replace(/\/\*[\s\S]*?\*\//g, '') // Xóa block comments
      .replace(/\/\/[^\n]*/g, '')       // Xóa line comments
      .trim();
    
    const lines = formattedCode.split('\n');
    let indentLevel = 0;
    let formattedLines = [];
    
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();
      if (!line) continue;
      
      // Giảm thụt lề cho dấu }
      if (line.startsWith('}')) {
        indentLevel = Math.max(0, indentLevel - 1);
      }
      
      // Thêm thụt lề hiện tại
      formattedLines.push('  '.repeat(indentLevel) + line);
      
      // Tăng thụt lề sau dấu {
      if (line.endsWith('{')) {
        indentLevel++;
      }
    }
    
    return formattedLines.join('\n');
  } catch (error) {
    console.error('Error formatting JavaScript:', error);
    return code;
  }
};

/**
 * Chuyển JS từ một dòng sang nhiều dòng
 */
const formatJSOneLineToMultiLine = (code: string): string => {
  return code
    .replace(/;/g, ';\n')
    .replace(/{/g, '{\n')
    .replace(/}/g, '}\n')
    .replace(/\) {/g, ') {\n')
    .replace(/\}\s*else\s*{/g, '}\nelse {')
    .replace(/\}\s*else\s*if\s*\(/g, '}\nelse if (');
};

/**
 * Định dạng CSS với thụt lề và xuống dòng
 */
const formatCss = (code: string): string => {
  if (!code.trim()) return '';
  
  try {
    // Xử lý trường hợp CSS trên một dòng
    if (!code.includes('\n')) {
      code = formatCSSOneLineToMultiLine(code);
    }
    
    let formattedCode = code
      .replace(/\/\*[\s\S]*?\*\//g, '') // Xóa comments
      .trim();
    
    // Định dạng CSS với thụt lề và xuống dòng
    formattedCode = formattedCode
      .replace(/\s*\{\s*/g, ' {\n  ')
      .replace(/;\s*/g, ';\n  ')
      .replace(/\s*}\s*/g, '\n}\n')
      .replace(/\n\s*\n/g, '\n'); // Xóa dòng trống kép
    
    return formattedCode;
  } catch (error) {
    console.error('Error formatting CSS:', error);
    return code;
  }
};

/**
 * Chuyển CSS từ một dòng sang nhiều dòng
 */
const formatCSSOneLineToMultiLine = (code: string): string => {
  return code
    .replace(/}/g, '}\n')
    .replace(/{/g, '{\n')
    .replace(/;/g, ';\n');
};

/**
 * Tạo HTML hoàn chỉnh từ các phần riêng biệt
 */
const createCompleteHtml = (html: string, css: string, js: string): string => {
  const docType = '<!DOCTYPE html>';
  return `
${docType}
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Interactive Game</title>
  <style>
${css}
  </style>
</head>
<body>
${html}
  <script>
${js}
  </script>
</body>
</html>`;
};

/**
 * Xử lý và phân tích phản hồi từ Gemini
 */
export const parseGeminiResponse = (text: string, topic: string): MiniGame => {
  console.log("🔷 Gemini: Starting response parsing");
  
  try {
    // Phân tích loại phản hồi
    const isCompleteHtml = text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html');
    const hasMarkdownBlocks = text.includes('```html') && (text.includes('```css') || text.includes('```js'));
    const isMixedFormat = text.includes('</html>') && (text.includes(' css ') || text.includes(' js '));
    
    console.log("🔷 Gemini: Response format analysis:", {
      isCompleteHtml,
      hasMarkdownBlocks,
      isMixedFormat
    });
    
    // Trích xuất code dựa vào định dạng
    let html = '', css = '', js = '';
    
    if (hasMarkdownBlocks) {
      console.log("🔷 Gemini: Extracting code from markdown blocks");
      const extracted = extractCodeFromMarkdown(text);
      html = extracted.html;
      css = extracted.css;
      js = extracted.js;
    } else if (isMixedFormat) {
      console.log("🔷 Gemini: Extracting code from mixed format (HTML with css/js keywords)");
      const extracted = extractCodeFromMixedFormat(text);
      html = extracted.html;
      css = extracted.css;
      js = extracted.js;
    } else if (isCompleteHtml) {
      console.log("🔷 Gemini: Extracting code from complete HTML");
      const extracted = extractCodeFromFullHtml(text);
      html = extracted.html;
      css = extracted.css;
      js = extracted.js;
    } else {
      // Định dạng không xác định, thử phát hiện
      console.log("🔷 Gemini: Unknown format, attempting detection");
      if (text.includes('<html') && text.includes('<style') && text.includes('<script')) {
        const extracted = extractCodeFromFullHtml(text);
        html = extracted.html;
        css = extracted.css;
        js = extracted.js;
      } else {
        // Nếu không thể trích xuất, sử dụng toàn bộ text làm HTML
        html = text;
      }
    }
    
    // Định dạng code
    const formattedHTML = formatHTML(html);
    const formattedCSS = formatCss(css);
    const formattedJS = formatJavaScript(js);
    
    // Tạo HTML hoàn chỉnh cho hiển thị
    const completeHtml = createCompleteHtml(formattedHTML, formattedCSS, formattedJS);
    const enhancedHtml = injectImageUtils(completeHtml);
    
    // Trích xuất tiêu đề
    let title = topic;
    const titleMatch = enhancedHtml.match(/<title>(.*?)<\/title>/i);
    if (titleMatch && titleMatch[1]) {
      title = titleMatch[1].replace(/<[^>]*>/g, '').trim();
    }
    
    console.log("🔷 Gemini: Successfully parsed game content");
    
    // Trả về game với cả dạng đầy đủ và tách biệt
    return {
      title: title,
      description: "Generated HTML game content",
      content: enhancedHtml,
      htmlContent: formattedHTML,
      cssContent: formattedCSS,
      jsContent: formattedJS,
      isSeparatedFiles: true
    };
  } catch (error) {
    console.error("❌ Gemini: Content extraction error:", error);
    
    // Tạo trang lỗi
    const errorHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Error: ${topic}</title>
        <style>
          body {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
            text-align: center;
            color: #333;
          }
          .error-container {
            background-color: #fee2e2;
            border: 1px solid #ef4444;
            border-radius: 8px;
            padding: 20px;
          }
          h1 { color: #b91c1c; }
        </style>
      </head>
      <body>
        <div class="error-container">
          <h1>Error Generating Game</h1>
          <p>Sorry, there was a problem creating your game about "${topic}".</p>
          <p>Please try again or check the console for more details.</p>
        </div>
      </body>
      </html>
    `;
    
    return {
      title: `Error: ${topic}`,
      description: "Error generating content",
      content: errorHtml,
      isSeparatedFiles: false
    };
  }
};
