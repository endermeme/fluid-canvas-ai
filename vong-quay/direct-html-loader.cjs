/**
 * Module để xử lý và load HTML trực tiếp từ Gemini
 * Không tách thành 3 file riêng biệt mà load trực tiếp HTML
 */

// Import simple parser
const { parseGeminiResponse } = require('./simple-parser.cjs');

/**
 * Chuẩn bị HTML để hiển thị trong iframe
 * Thêm các tính năng cần thiết vào HTML mà không tách ra thành 3 file
 */
function prepareHtml(html) {
  // Kiểm tra xem HTML đã có viewport chưa
  const hasViewport = html.includes('<meta name="viewport"');
  
  // Kiểm tra xem HTML đã có charset chưa
  const hasCharset = html.includes('<meta charset="');
  
  // Kiểm tra xem HTML đã có style trong head chưa 
  const hasStyleInHead = html.includes('<style>') && html.includes('</head>');
  
  // Kiểm tra xem HTML đã có script ở cuối body chưa
  const hasScriptInBody = html.includes('<script>') && html.includes('</body>');
  
  // Thêm các phần còn thiếu vào HTML
  let enhancedHtml = html;
  
  // Thêm viewport nếu chưa có
  if (!hasViewport && enhancedHtml.includes('</head>')) {
    enhancedHtml = enhancedHtml.replace('</head>', '  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n</head>');
  }
  
  // Thêm charset nếu chưa có
  if (!hasCharset && enhancedHtml.includes('</head>')) {
    enhancedHtml = enhancedHtml.replace('</head>', '  <meta charset="UTF-8">\n</head>');
  }
  
  // Thêm style cơ bản nếu chưa có style
  if (!hasStyleInHead && enhancedHtml.includes('</head>')) {
    enhancedHtml = enhancedHtml.replace('</head>', `  <style>
    /* Base responsive styles */
    body {
      margin: 0;
      padding: 0;
      font-family: sans-serif;
    }
    * {
      box-sizing: border-box;
    }
  </style>
</head>`);
  }
  
  // Thêm script giao tiếp với parent app nếu chưa có script
  if (!hasScriptInBody && enhancedHtml.includes('</body>')) {
    enhancedHtml = enhancedHtml.replace('</body>', `  <script>
    // Game communication utils
    window.sendGameStats = function(stats) {
      // Gửi thống kê game lên ứng dụng cha
      if (window.parent && typeof window.parent.sendGameStats === 'function') {
        window.parent.sendGameStats(stats);
      } else {
        console.log('Game stats:', stats);
      }
    };
    
    // Thêm sự kiện khi game hoàn thành
    document.addEventListener('game-completed', function(e) {
      window.sendGameStats({
        completed: true,
        score: e.detail?.score || 0,
        completedAt: new Date().toISOString()
      });
    });
  </script>
</body>`);
  }
  
  return enhancedHtml;
}

/**
 * Xử lý phản hồi từ Gemini và chuẩn bị HTML
 */
function processGeminiHtml(geminiResponse) {
  // Parse response và nhận HTML đầy đủ
  const parsedResponse = parseGeminiResponse(geminiResponse);
  
  // Chuẩn bị HTML với các tính năng cần thiết
  const enhancedHtml = prepareHtml(parsedResponse.content);
  
  // Trả về kết quả cuối cùng
  return {
    ...parsedResponse,
    content: enhancedHtml,
    htmlContent: enhancedHtml,
  };
}

// Demo với đầu vào từ Gemini
const geminiRawResponse = `<head>
  <title>Vòng Quay May Mắn</title>
  <link rel="stylesheet" href="style.css">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
  <div class="container">
    <h1>Vòng Quay May Mắn</h1>
    <div class="wheel-container">
      <div class="pointer">▼</div>
      <div class="wheel"></div>
      <button id="spin-btn">Quay!</button>
      <div id="result"></div>
    </div>
  </div>
</body>`;

// Xử lý và hiển thị kết quả
const processedResult = processGeminiHtml(geminiRawResponse);
console.log("\n=== ENHANCED HTML FOR DISPLAY ===");
console.log(processedResult.content);

// Export các hàm để sử dụng
module.exports = {
  parseGeminiResponse,
  prepareHtml,
  processGeminiHtml
}; 