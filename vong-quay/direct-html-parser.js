/**
 * Mô-đun xử lý HTML trực tiếp từ Gemini API
 * Không tách thành các tệp riêng biệt HTML, CSS, JS
 */

// Interface cho game đã xử lý
interface MiniGame {
  title: string;
  description?: string;
  content?: string;
  htmlContent?: string;
  cssContent?: string;
  jsContent?: string;
  isSeparatedFiles?: boolean;
}

/**
 * Parse phản hồi từ Gemini API
 */
export function parseGeminiResponse(response: string): MiniGame {
  console.log("🔷 Gemini: Starting direct HTML parsing");
  
  try {
    // Xác định trường hợp HTML fragment hoặc HTML đầy đủ 
    const isFullHtml = response.trim().startsWith('<!DOCTYPE') || response.trim().startsWith('<html');
    const isHtmlFragment = response.trim().startsWith('<') && !isFullHtml;
    
    console.log("🔷 Gemini: Response format analysis:", {
      isFullHtml,
      isHtmlFragment
    });
    
    let fullHtml = '';
    
    if (isFullHtml) {
      // Trường hợp HTML đầy đủ
      console.log("🔷 Gemini: Processing complete HTML");
      fullHtml = response;
    } else if (isHtmlFragment) {
      // Trường hợp HTML fragment
      console.log("🔷 Gemini: Processing HTML fragment");
      fullHtml = wrapHtmlFragment(response);
    } else {
      // Trường hợp khác, có thể là text hoặc định dạng không rõ
      console.log("🔷 Gemini: Processing text/unknown format");
      fullHtml = wrapTextContent(response);
    }
    
    // Chuẩn bị HTML với các tính năng bổ sung
    const enhancedHtml = prepareHtml(fullHtml);
    
    // Trích xuất tiêu đề
    const title = extractTitle(enhancedHtml);
    
    console.log("🔷 Gemini: Successfully processed HTML content");
    
    // Trả về game đã xử lý
    return {
      title: title,
      description: "Generated HTML content",
      content: enhancedHtml,
      htmlContent: enhancedHtml,
      cssContent: "",
      jsContent: "",
      isSeparatedFiles: false
    };
  } catch (error) {
    console.error("❌ Gemini: Direct HTML processing error:", error);
    
    // Tạo trang lỗi
    const errorHtml = createErrorPage("Error processing content");
    
    return {
      title: `Error`,
      description: "Error processing content",
      content: errorHtml,
      isSeparatedFiles: false
    };
  }
}

/**
 * Bọc HTML fragment trong một trang HTML đầy đủ
 */
function wrapHtmlFragment(fragment: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generated Game</title>
</head>
<body>
  ${fragment}
</body>
</html>`;
}

/**
 * Bọc nội dung văn bản trong một trang HTML
 */
function wrapTextContent(text: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generated Content</title>
</head>
<body>
  <div class="content">
    <pre>${text}</pre>
  </div>
</body>
</html>`;
}

/**
 * Chuẩn bị HTML với các tính năng bổ sung
 */
function prepareHtml(html: string): string {
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
 * Trích xuất tiêu đề từ HTML
 */
function extractTitle(html: string): string {
  const titleMatch = html.match(/<title>(.*?)<\/title>/i);
  return titleMatch && titleMatch[1] ? titleMatch[1].replace(/<[^>]*>/g, '').trim() : "Generated Game";
}

/**
 * Tạo trang lỗi
 */
function createErrorPage(errorMessage: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Error</title>
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
    <h1>Error Processing Game</h1>
    <p>${errorMessage}</p>
    <p>Please try again or check the console for more details.</p>
  </div>
</body>
</html>
  `;
}

// Export các hàm quan trọng
export const processGeminiHtml = parseGeminiResponse; 