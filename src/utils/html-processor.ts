
/**
 * Module xử lý và định dạng HTML
 */

/**
 * Định dạng và chuẩn hóa HTML
 */
export const formatHtml = (html: string): string => {
  if (!html) return '';
  
  try {
    // Làm sạch nội dung HTML triệt để hơn
    let cleanHtml = html
      .replace(/```html|```css|```javascript|```js|```/g, '')  // Xóa tất cả các đánh dấu code block
      .replace(/`/g, '')  // Xóa các backtick đơn
      .trim();  // Cắt bỏ khoảng trắng thừa

    // Thêm DOCTYPE và cấu trúc HTML nếu thiếu
    if (!cleanHtml.includes('<!DOCTYPE html>')) {
      if (cleanHtml.includes('<html')) {
        cleanHtml = `<!DOCTYPE html>${cleanHtml}`;
      } else {
        cleanHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Interactive Game</title>
</head>
<body>
  ${cleanHtml}
</body>
</html>`;
      }
    }
    
    return cleanHtml;
  } catch (error) {
    console.error('Error formatting HTML:', error);
    return html;
  }
};

/**
 * Xác thực cấu trúc HTML có đầy đủ các thẻ cần thiết
 */
export const validateHtmlStructure = (html: string): boolean => {
  const requiredTags = ['<!DOCTYPE html>', '<html', '<head>', '<body>'];
  return requiredTags.every(tag => html.includes(tag));
};

/**
 * Hoàn thiện HTML với metadata và viewport
 */
export const enhanceHtml = (html: string, title: string = 'Interactive Game'): string => {
  // Thêm metadata nếu thiếu
  if (!html.includes('<meta name="viewport"')) {
    html = html.replace('</head>', `  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n</head>`);
  }
  
  // Thêm title nếu thiếu
  if (!html.includes('<title>')) {
    html = html.replace('</head>', `  <title>${title}</title>\n</head>`);
  }
  
  return html;
};

/**
 * Xóa tất cả các đánh dấu Markdown từ chuỗi
 */
export const removeMarkdown = (text: string): string => {
  if (!text) return '';
  
  return text
    .replace(/```(html|css|javascript|js)?([\s\S]*?)```/g, '$2')  // Xóa code blocks với tên ngôn ngữ
    .replace(/`([^`]+)`/g, '$1')  // Xóa inline code
    .replace(/\*\*([^*]+)\*\*/g, '$1')  // Xóa bold
    .replace(/\*([^*]+)\*/g, '$1')  // Xóa italic
    .replace(/#{1,6}\s+([^\n]+)/g, '$1')  // Xóa headings
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')  // Xóa links
    .replace(/>\s*([^\n]+)/g, '$1')  // Xóa blockquotes
    .replace(/- ([^\n]+)/g, '$1')  // Xóa unordered lists
    .replace(/\d+\.\s+([^\n]+)/g, '$1')  // Xóa ordered lists
    .trim();
};
