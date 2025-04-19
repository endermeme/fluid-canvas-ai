
import { MiniGame } from './types';

/**
 * Trích xuất code từ định dạng markdown
 * @param text Phản hồi từ Gemini
 */
const extractCodeFromMarkdown = (text: string): { html: string, css: string, js: string } => {
  console.log("🔍 Bắt đầu trích xuất code từ markdown");
  
  // Khởi tạo các phần code
  let html = '';
  let css = '';
  let js = '';
  
  // Tìm code block HTML
  const htmlMatch = text.match(/```html\n([\s\S]*?)```/);
  if (htmlMatch && htmlMatch[1]) {
    html = htmlMatch[1].trim();
    console.log("✅ Đã tìm thấy HTML code block");
  } else {
    // Tìm HTML không nằm trong code block
    const htmlRegex = /<html[\s\S]*?<\/html>/i;
    const htmlTagMatch = text.match(htmlRegex);
    if (htmlTagMatch) {
      html = htmlTagMatch[0];
      console.log("✅ Đã tìm thấy tag HTML");
    }
  }
  
  // Tìm code block CSS
  const cssMatch = text.match(/```css\n([\s\S]*?)```/);
  if (cssMatch && cssMatch[1]) {
    css = cssMatch[1].trim();
    console.log("✅ Đã tìm thấy CSS code block");
  }
  
  // Tìm code block JavaScript
  const jsMatch = text.match(/```(js|javascript)\n([\s\S]*?)```/);
  if (jsMatch && jsMatch[2]) {
    js = jsMatch[2].trim();
    console.log("✅ Đã tìm thấy JS code block");
  }
  
  // Nếu không tìm thấy các block riêng biệt, kiểm tra xem có block chung không
  if (!html && !css && !js) {
    const codeBlockMatch = text.match(/```([\s\S]*?)```/);
    if (codeBlockMatch && codeBlockMatch[1]) {
      // Giả định đây là HTML có cả CSS và JS bên trong
      html = codeBlockMatch[1].trim();
      console.log("⚠️ Không tìm thấy code blocks riêng biệt, sử dụng toàn bộ code block");
    }
  }
  
  // Nếu vẫn không tìm thấy code, lấy toàn bộ text (có thể là HTML plain)
  if (!html && !css && !js) {
    // Loại bỏ các phần markdown không cần thiết
    html = text.replace(/^#.*$/gm, '').trim();
    console.log("⚠️ Không tìm thấy code blocks, sử dụng toàn bộ text");
  }
  
  // Trả về các phần code đã tìm thấy
  return { html, css, js };
};

/**
 * Định dạng nội dung game với HTML, CSS và JS
 * @param content Nội dung từ Gemini
 */
const formatGameContent = (content: string): string => {
  if (!content) return '';
  
  try {
    // Tìm xem content đã là HTML đầy đủ chưa
    const isFullHtml = content.includes('<!DOCTYPE html>') || content.includes('<html');
    
    if (isFullHtml) {
      console.log("🔄 Content đã là HTML đầy đủ, giữ nguyên");
      return content;
    }
    
    // Nếu không phải HTML đầy đủ, trích xuất các phần code
    const { html, css, js } = extractCodeFromMarkdown(content);
    
    // Tạo HTML đầy đủ
    const formattedContent = `
<!DOCTYPE html>
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

    return formattedContent;
  } catch (error) {
    console.error('❌ Lỗi khi định dạng nội dung:', error);
    return content;
  }
};

/**
 * Parse phản hồi từ Gemini
 * @param text Phản hồi từ Gemini
 * @param topic Chủ đề game
 */
export const parseGeminiResponse = (text: string, topic: string): MiniGame => {
  console.log("🔷 Gemini: Bắt đầu phân tích phản hồi");
  
  try {
    // Trích xuất nội dung HTML với định dạng tốt hơn
    const htmlContent = formatGameContent(text);
    
    // Log HTML đã định dạng để debug
    console.log("🔷 Gemini: HTML đã định dạng", htmlContent.substring(0, 500) + "...");
    
    // Trích xuất tiêu đề từ HTML
    let title = topic;
    const titleMatch = htmlContent.match(/<title>(.*?)<\/title>/i);
    if (titleMatch && titleMatch[1]) {
      title = titleMatch[1].replace(/<[^>]*>/g, '').trim();
    }
    
    return {
      title: title,
      description: "Generated HTML game content",
      content: htmlContent
    };
  } catch (error) {
    console.error("❌ Gemini: Lỗi khi trích xuất nội dung:", error);
    
    // Tạo trang lỗi tối thiểu
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
      content: errorHtml
    };
  }
};

// Thêm hàm trình bày cho cập nhật riêng
export const formatJavaScript = (code: string): string => {
  if (!code.trim()) return '';
  
  try {
    let formattedCode = code
      .replace(/\/\*[\s\S]*?\*\//g, '') // Loại bỏ block comments
      .replace(/\/\/[^\n]*/g, '') // Loại bỏ line comments
      .trim();
    
    // Định dạng JS với indentation và line breaks
    const lines = formattedCode.split('\n');
    let indentLevel = 1; // Bắt đầu với 1 mức indent (vì chúng ta đang ở trong thẻ script)
    let formattedLines = [];
    
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();
      if (!line) continue;
      
      // Giảm indent khi gặp dấu } đóng
      if (line.startsWith('}')) {
        indentLevel = Math.max(0, indentLevel - 1);
      }
      
      // Thêm indent hiện tại
      formattedLines.push('  '.repeat(indentLevel) + line);
      
      // Tăng indent sau khi gặp dấu { mở
      if (line.endsWith('{')) {
        indentLevel++;
      }
    }
    
    return formattedLines.join('\n');
  } catch (error) {
    console.error('❌ Lỗi khi định dạng JavaScript:', error);
    return code;
  }
};

export const formatCss = (code: string): string => {
  if (!code.trim()) return '';
  
  try {
    // Định dạng CSS cơ bản
    let formattedCode = code
      .replace(/\/\*[\s\S]*?\*\//g, '') // Loại bỏ comments
      .trim();
    
    // Định dạng CSS với indentation và line breaks
    formattedCode = formattedCode
      .replace(/\s*\{\s*/g, ' {\n  ')
      .replace(/;\s*/g, ';\n  ')
      .replace(/\s*}\s*/g, '\n}\n')
      .replace(/\n\s*\n/g, '\n'); // Loại bỏ double line breaks
    
    return formattedCode;
  } catch (error) {
    console.error('❌ Lỗi khi định dạng CSS:', error);
    return code;
  }
};
