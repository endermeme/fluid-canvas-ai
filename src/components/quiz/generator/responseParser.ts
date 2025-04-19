
import { formatHtml, validateHtmlStructure } from '@/utils/html-processor';
import { formatCss, addBaseStyles } from '@/utils/css-processor';
import { formatJavaScript, addErrorHandling } from '@/utils/js-processor';
import { MiniGame } from './types';
import { injectDebugUtils } from '@/utils/iframe-handler';
import { logInfo, logError } from './apiUtils';

const SOURCE = "RESPONSE_PARSER";

/**
 * Phân tích và xử lý phản hồi từ Gemini AI thành MiniGame
 */
export const parseGeminiResponse = (text: string, topic: string): MiniGame => {
  logInfo(SOURCE, "Bắt đầu phân tích phản hồi");
  
  try {
    // Trích xuất các khối code
    const { html, css, js } = extractCodeBlocks(text);
    
    // Định dạng từng phần
    const formattedHtml = formatHtml(html);
    const formattedCss = css ? formatCss(css) : addBaseStyles();
    const formattedJs = js ? addErrorHandling(formatJavaScript(js)) : '';
    
    // Tạo HTML cuối cùng
    const finalContent = createFinalHtml(formattedHtml, formattedCss, formattedJs);
    
    // Thêm debug utils
    const contentWithDebug = injectDebugUtils(finalContent);
    
    // Validate cấu trúc HTML
    if (!validateHtmlStructure(contentWithDebug)) {
      logInfo(SOURCE, "Phát hiện HTML không hợp lệ, tự động sửa chữa");
    }
    
    return {
      title: extractTitle(topic, formattedHtml),
      description: "Generated game content",
      content: contentWithDebug
    };
  } catch (error) {
    logError(SOURCE, "Lỗi khi xử lý phản hồi", error);
    return createErrorGame(topic);
  }
};

/**
 * Trích xuất các khối code từ phản hồi Markdown
 */
const extractCodeBlocks = (text: string): { html: string, css: string, js: string } => {
  let html = '', css = '', js = '';
  
  // Trích xuất HTML (tìm khối markdown hoặc trực tiếp HTML)
  const htmlMatch = text.match(/```html\n([\s\S]*?)```/) || text.match(/<html[\s\S]*?<\/html>/);
  if (htmlMatch) html = htmlMatch[1] || htmlMatch[0];
  
  // Trích xuất CSS
  const cssMatch = text.match(/```css\n([\s\S]*?)```/);
  if (cssMatch) css = cssMatch[1];
  
  // Trích xuất JavaScript
  const jsMatch = text.match(/```(js|javascript)\n([\s\S]*?)```/);
  if (jsMatch) js = jsMatch[2];
  
  return { html, css, js };
};

/**
 * Trích xuất tiêu đề từ HTML hoặc sử dụng chủ đề
 */
const extractTitle = (topic: string, html: string): string => {
  const titleMatch = html.match(/<title>(.*?)<\/title>/i) || 
                     html.match(/<h1[^>]*>(.*?)<\/h1>/i);
                     
  return titleMatch && titleMatch[1] ? 
    titleMatch[1].replace(/<[^>]*>/g, '').trim() : 
    topic;
};

/**
 * Tạo HTML cuối cùng kết hợp HTML, CSS và JavaScript
 */
const createFinalHtml = (html: string, css: string, js: string): string => {
  // Nếu đã có HTML đầy đủ, chèn CSS và JS vào
  if (html.includes('<html')) {
    // Chèn CSS vào head
    html = html.replace('</head>', `<style>${css}</style></head>`);
    
    // Chèn JS vào trước đóng body
    if (js) {
      html = html.replace('</body>', `<script>${js}</script></body>`);
    }
    
    return html;
  }
  
  // Nếu chỉ có fragment HTML, tạo trang HTML đầy đủ
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Interactive Game</title>
  <style>${css}</style>
</head>
<body>
  ${html}
  ${js ? `<script>${js}</script>` : ''}
</body>
</html>`;
};

/**
 * Tạo game lỗi khi không thể phân tích phản hồi
 */
const createErrorGame = (topic: string): MiniGame => {
  const errorHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Error</title>
  <style>
    body { font-family: system-ui; padding: 2rem; text-align: center; }
    .error { color: #ef4444; }
  </style>
</head>
<body>
  <h1 class="error">Error Generating Game</h1>
  <p>Could not create game for topic: ${topic}</p>
</body>
</html>`;

  return {
    title: `Error: ${topic}`,
    description: "Error generating content",
    content: errorHtml
  };
};
