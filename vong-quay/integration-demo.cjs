/**
 * Demo mô phỏng cách tích hợp DirectHTMLParser vào AIGameGenerator
 * Phần này chỉ mô phỏng, cần tích hợp thực tế vào AIGameGenerator.ts
 */

// Import thư viện cần thiết
const fs = require('fs');
const path = require('path');
const { processGeminiHtml } = require('./direct-html-loader.cjs');

/**
 * Tích hợp trực tiếp vào AIGameGenerator - Phần mô phỏng
 * Thay đổi cách xử lý response từ API Gemini
 */
class AIGameGeneratorDemo {
  /**
   * Xử lý response HTML từ Gemini
   */
  processGeminiResponse(geminiResponse) {
    console.log('📌 Nhận response từ Gemini API...');
    
    try {
      // Cách cũ: Parse HTML, CSS, JS riêng biệt
      // const { html, css, js } = extractCodeFromMarkdown(text);
      // const formattedHTML = formatHTML(html);
      // const formattedCSS = formatCss(css);
      // const formattedJS = formatJavaScript(js);
      // const completeHtml = createCompleteHtml(formattedHTML, formattedCSS, formattedJS);
      
      // Cách mới: Xử lý HTML trực tiếp không tách file
      console.log('📌 Xử lý HTML trực tiếp không tách file...');
      const gameData = processGeminiHtml(geminiResponse);
      
      console.log('✅ Đã xử lý xong response!');
      return gameData;
    } catch (error) {
      console.error('❌ Lỗi khi xử lý response:', error);
      return this.createErrorResponse('Lỗi xử lý HTML');
    }
  }
  
  /**
   * Tạo response lỗi
   */
  createErrorResponse(errorMessage) {
    const errorHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Error</title>
        <style>
          body {
            font-family: system-ui, sans-serif;
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
          <h1>Error Processing Game</h1>
          <p>${errorMessage}</p>
          <p>Please try again or check the console for more details.</p>
        </div>
      </body>
      </html>
    `;
    
    return {
      title: 'Error',
      description: errorMessage,
      content: errorHtml,
      isSeparatedFiles: false
    };
  }
  
  /**
   * Demo generate game (mô phỏng)
   */
  async generateMiniGame(topic) {
    console.log(`📌 Đang tạo game với chủ đề: ${topic}...`);
    
    try {
      // Đọc HTML mẫu từ file (giả lập response từ Gemini)
      const htmlFile = path.join(__dirname, 'gemini-html-example.html');
      const htmlContent = fs.readFileSync(htmlFile, 'utf8');
      
      // Xử lý nội dung HTML
      const gameData = this.processGeminiResponse(htmlContent);
      
      console.log('✅ Đã tạo game thành công!');
      return gameData;
    } catch (error) {
      console.error('❌ Lỗi khi tạo game:', error);
      return this.createErrorResponse('Không thể tạo game');
    }
  }
}

// Demo
(async () => {
  // Tạo instance của AIGameGenerator
  const gameGenerator = new AIGameGeneratorDemo();
  
  // Tạo game
  console.log('🚀 Bắt đầu tạo game...');
  const game = await gameGenerator.generateMiniGame('Vòng Quay May Mắn');
  
  // Hiển thị thông tin game
  console.log('\n=== THÔNG TIN GAME ===');
  console.log('Title:', game.title);
  console.log('HTML có tách file?', game.isSeparatedFiles ? 'Có' : 'Không');
  
  // Ghi nội dung HTML ra file để kiểm tra
  fs.writeFileSync(path.join(__dirname, 'processed-game.html'), game.content, 'utf8');
  console.log('\n✅ Đã lưu HTML đã xử lý vào file processed-game.html');
  
  // Ghi tóm tắt nội dung HTML để kiểm tra (không ghi toàn bộ vì quá dài)
  const htmlPreview = game.content.substring(0, 500) + '...';
  console.log('\n=== HTML PREVIEW ===');
  console.log(htmlPreview);
})();

/**
 * Hướng dẫn tích hợp vào AIGameGenerator.ts thật
 * 
 * 1. Tạo file mới direct-html-parser.ts dựa trên direct-html-loader.cjs
 * 2. Import vào AIGameGenerator.ts:
 *    import { processGeminiHtml } from './direct-html-parser';
 * 
 * 3. Thay đổi phương thức xử lý response trong generateMiniGame:
 *    // Thay vì sử dụng parseGeminiResponse từ responseParser
 *    // const miniGame = parseGeminiResponse(geminiResponse, topic);
 *    
 *    // Sử dụng processGeminiHtml để xử lý trực tiếp
 *    const miniGame = processGeminiHtml(geminiResponse);
 * 
 * 4. Đảm bảo các trường cần thiết được trả về đúng định dạng MiniGame
 */ 