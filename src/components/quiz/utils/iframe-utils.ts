
import { createHtmlStructure, extractHtmlContent } from './iframe-html';
import { optimizeStyles, extractCssContent } from './iframe-css';
import { enhanceScript, extractJsContent } from './iframe-js';

/**
 * Tăng cường nội dung iframe với HTML, CSS và JS
 */
export const enhanceIframeContent = (content: string, title?: string): string => {
  if (!content) return '';
  
  try {
    // Kiểm tra xem content có phải là ba phần riêng biệt hay không
    if (content.includes('<HTML>') || content.includes('<CSS>') || content.includes('<JAVASCRIPT>')) {
      // Trích xuất từng phần
      const htmlContent = extractHtmlContent(content);
      const cssContent = optimizeStyles(extractCssContent(content));
      const jsContent = enhanceScript(extractJsContent(content));
      
      // Tạo HTML cơ bản
      let htmlDoc = createHtmlStructure(htmlContent, title);
      
      // Chèn CSS vào thẻ style
      htmlDoc = htmlDoc.replace('<style id="game-styles"></style>', `<style id="game-styles">${cssContent}</style>`);
      
      // Chèn JavaScript vào thẻ script
      htmlDoc = htmlDoc.replace('<script id="game-script"></script>', `<script id="game-script">${jsContent}</script>`);
      
      // Thêm IIFE để đảm bảo code chạy sau khi DOM đã tải
      const wrappedScript = `<script>
        document.addEventListener('DOMContentLoaded', function() {
          ${jsContent}
        });
      </script>`;
      
      // Chèn script vào cuối body
      htmlDoc = htmlDoc.replace('</body>', `${wrappedScript}</body>`);
      
      return htmlDoc;
    }
    
    // Nếu content không có định dạng ba phần riêng biệt, xử lý theo cách thông thường
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title || 'Game'}</title>
        <style>
          body { 
            margin: 0; 
            padding: 0; 
            display: flex; 
            justify-content: center; 
            align-items: center; 
            min-height: 100vh; 
            font-family: Arial, sans-serif; 
          }
        </style>
      </head>
      <body>
        ${content}
        <script>
          // Script to enable console.log access in iframe
          (function() {
            const originalConsoleLog = console.log;
            console.log = function() {
              originalConsoleLog.apply(console, arguments);
              try {
                window.parent.postMessage({
                  type: 'console.log',
                  args: Array.from(arguments).map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg)
                }, '*');
              } catch(e) {}
            }
          })();
        </script>
      </body>
      </html>
    `;
  } catch (error) {
    console.error('Error enhancing iframe content:', error);
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Error</title>
      </head>
      <body>
        <div style="color: red;">Error loading game content</div>
      </body>
      </html>
    `;
  }
};

/**
 * Xử lý phản hồi API từ Gemini và tách thành HTML, CSS, JS
 */
export const processGeminiResponse = (apiResponse: string): { 
  html: string; 
  css: string; 
  js: string;
  fullHtml: string;
} => {
  const html = extractHtmlContent(apiResponse);
  const css = extractCssContent(apiResponse);
  const js = extractJsContent(apiResponse);
  
  // Tạo HTML đầy đủ
  let fullHtml = createHtmlStructure(html, "Custom Game");
  fullHtml = fullHtml.replace('<style id="game-styles"></style>', `<style id="game-styles">${optimizeStyles(css)}</style>`);
  fullHtml = fullHtml.replace('<script id="game-script"></script>', `<script id="game-script">${enhanceScript(js)}</script>`);
  
  return {
    html,
    css,
    js,
    fullHtml
  };
};

/**
 * Tạo nội dung iframe từ các phần riêng biệt
 */
export const createIframeContent = (
  html: string, 
  css: string, 
  js: string, 
  title: string = 'Game'
): string => {
  // Tạo HTML cơ bản
  let htmlDoc = createHtmlStructure(html, title);
  
  // Chèn CSS vào thẻ style
  htmlDoc = htmlDoc.replace('<style id="game-styles"></style>', `<style id="game-styles">${optimizeStyles(css)}</style>`);
  
  // Chèn JavaScript vào thẻ script
  htmlDoc = htmlDoc.replace('<script id="game-script"></script>', `<script id="game-script">${enhanceScript(js)}</script>`);
  
  // Thêm IIFE để đảm bảo code chạy sau khi DOM đã tải
  const wrappedScript = `<script>
    document.addEventListener('DOMContentLoaded', function() {
      try {
        ${js}
      } catch(e) {
        console.error("Game script error:", e);
      }
    });
  </script>`;
  
  // Chèn script vào cuối body
  htmlDoc = htmlDoc.replace('</body>', `${wrappedScript}</body>`);
  
  return htmlDoc;
};
