import { enhanceIframeContent } from './iframe-utils';

/**
 * Hàm kiểm tra khi ứng dụng chạy trên trình duyệt
 * Bạn có thể gọi hàm này từ console để test
 */
export async function testGeminiJsonProcessing() {
  // Mẫu JSON từ Gemini API (giống như bạn đã cung cấp)
  const sampleGeminiJson = {
    "candidates": [
      {
        "content": {
          "parts": [
            {
              "text": "Dưới đây là code HTML, CSS và JavaScript để tạo một game đơn giản:\n\n**`index.html`**\n```html\n<!DOCTYPE html>\n<html lang=\"vi\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>Game Đơn Giản</title>\n    <link rel=\"stylesheet\" href=\"style.css\">\n</head>\n<body>\n    <div class=\"container\">\n        <h1>Game Đơn Giản</h1>\n        <div id=\"game-area\">\n            <div id=\"player\"></div>\n        </div>\n        <div id=\"score\">Điểm: 0</div>\n    </div>\n\n    <script src=\"script.js\"></script>\n</body>\n</html>\n```\n\n**`style.css`**\n```css\nbody {\n    font-family: Arial, sans-serif;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    min-height: 100vh;\n    background-color: #f0f0f0;\n    margin: 0;\n}\n\n.container {\n    text-align: center;\n    background-color: #fff;\n    padding: 20px;\n    border-radius: 10px;\n    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);\n}\n\n#game-area {\n    width: 300px;\n    height: 300px;\n    border: 2px solid #333;\n    position: relative;\n    margin: 20px auto;\n    background-color: #f9f9f9;\n    overflow: hidden;\n}\n\n#player {\n    width: 30px;\n    height: 30px;\n    background-color: red;\n    position: absolute;\n    top: 50%;\n    left: 50%;\n    transform: translate(-50%, -50%);\n    border-radius: 50%;\n}\n\n#score {\n    font-size: 20px;\n    font-weight: bold;\n    margin-top: 10px;\n}\n```\n\n**`script.js`**\n```javascript\ndocument.addEventListener('DOMContentLoaded', () => {\n    const player = document.getElementById('player');\n    const gameArea = document.getElementById('game-area');\n    const scoreDisplay = document.getElementById('score');\n    \n    let score = 0;\n    let playerX = 150;\n    let playerY = 150;\n    \n    // Giới hạn khu vực di chuyển\n    const maxX = gameArea.offsetWidth - player.offsetWidth;\n    const maxY = gameArea.offsetHeight - player.offsetHeight;\n    \n    // Update vị trí player\n    function updatePlayerPosition() {\n        player.style.left = playerX + 'px';\n        player.style.top = playerY + 'px';\n    }\n    \n    // Xử lý phím di chuyển\n    document.addEventListener('keydown', (e) => {\n        const speed = 10;\n        \n        switch(e.key) {\n            case 'ArrowUp':\n                playerY = Math.max(0, playerY - speed);\n                break;\n            case 'ArrowDown':\n                playerY = Math.min(maxY, playerY + speed);\n                break;\n            case 'ArrowLeft':\n                playerX = Math.max(0, playerX - speed);\n                break;\n            case 'ArrowRight':\n                playerX = Math.min(maxX, playerX + speed);\n                break;\n        }\n        \n        updatePlayerPosition();\n        score++;\n        scoreDisplay.textContent = `Điểm: ${score}`;\n    });\n    \n    // Khởi tạo vị trí ban đầu\n    updatePlayerPosition();\n});\n```"
            }
          ],
          "role": "model"
        }
      }
    ]
  };

  const jsonString = JSON.stringify(sampleGeminiJson);
  
  // Thử nghiệm xử lý với enhanceIframeContent
  try {
    console.log('Bắt đầu test xử lý JSON Gemini...');
    const enhancedHtml = await enhanceIframeContent(jsonString, 'Test Game');
    
    // Log kết quả để kiểm tra
    console.log('Kết quả xử lý:');
    console.log(enhancedHtml);
    
    // Kiểm tra xem kết quả có chứa nội dung từ các code block không
    const hasHtml = enhancedHtml.includes('<div class="container">');
    const hasCss = enhancedHtml.includes('background-color: #f0f0f0;');
    const hasJs = enhancedHtml.includes('document.addEventListener(\'DOMContentLoaded\'');
    
    console.log('Kết quả kiểm tra:');
    console.log(`- Chứa HTML: ${hasHtml ? 'OK' : 'FAIL'}`);
    console.log(`- Chứa CSS: ${hasCss ? 'OK' : 'FAIL'}`);
    console.log(`- Chứa JavaScript: ${hasJs ? 'OK' : 'FAIL'}`);
    
    return {
      enhancedHtml,
      testResults: { hasHtml, hasCss, hasJs }
    };
  } catch (error) {
    console.error('Test thất bại với lỗi:', error);
    return { error };
  }
}

// Tự động chạy test khi import file này trong môi trường browser
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.testGeminiJsonProcessing = testGeminiJsonProcessing;
  console.log('Test function available as window.testGeminiJsonProcessing()');
} 