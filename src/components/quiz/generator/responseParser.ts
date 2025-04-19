
import { GameApiResponse, MiniGame } from './types';

export function parseGeminiResponse(response: string): MiniGame | null {
  try {
    // Xóa hoàn toàn tất cả các đánh dấu Markdown
    let cleanedResponse = response
      .replace(/```html|```css|```javascript|```js|```/g, '')  // Xóa tất cả các đánh dấu code block
      .replace(/`/g, '')  // Xóa các backtick đơn
      .trim();  // Cắt bỏ khoảng trắng thừa
    
    console.log("🧹 Cleaned response from Markdown:", cleanedResponse.substring(0, 100) + "...");
    
    // Check if the response is already HTML
    if (cleanedResponse.trim().toLowerCase().startsWith('<!doctype html') || 
        cleanedResponse.trim().toLowerCase().startsWith('<html')) {
      return {
        title: extractTitle(cleanedResponse) || "Custom Game",
        content: cleanedResponse,
        isSeparatedFiles: false
      };
    }

    // Handle HTML fragments (starting with any HTML tag)
    if (cleanedResponse.trim().startsWith('<') && cleanedResponse.includes('>')) {
      // Check if it's likely an incomplete HTML fragment
      if (!cleanedResponse.includes('<html') && !cleanedResponse.includes('<!doctype')) {
        // Wrap it in a proper HTML structure
        cleanedResponse = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Custom Game</title>
</head>
<body>
  ${cleanedResponse}
</body>
</html>`;
      }
      
      return {
        title: extractTitle(cleanedResponse) || "Custom Game",
        content: cleanedResponse,
        isSeparatedFiles: false
      };
    }
    
    // Try to parse as JSON if not HTML
    try {
      const jsonResponse = JSON.parse(cleanedResponse) as GameApiResponse;
      
      if (jsonResponse.content) {
        return {
          title: jsonResponse.title || "Custom Game",
          content: jsonResponse.content,
          description: jsonResponse.description,
          isSeparatedFiles: false
        };
      }
    } catch (jsonError) {
      // Not valid JSON, continue with other parsing methods
      console.log("Not a valid JSON response:", jsonError);
    }
    
    // Last resort: treat the entire response as content
    return {
      title: "Custom Game",
      content: cleanedResponse,
      isSeparatedFiles: false
    };
  } catch (error) {
    console.error('Error parsing response:', error);
    return null;
  }
}

// Hàm helper để trích xuất tiêu đề từ HTML
function extractTitle(html: string): string | null {
  // Tìm trong thẻ title
  const titleMatch = html.match(/<title>(.*?)<\/title>/i);
  if (titleMatch && titleMatch[1]) {
    return titleMatch[1].trim();
  }
  
  // Hoặc tìm trong thẻ h1 đầu tiên
  const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
  if (h1Match && h1Match[1]) {
    return h1Match[1].replace(/<[^>]*>/g, '').trim(); // Loại bỏ bất kỳ HTML tag nào bên trong h1
  }
  
  return null;
}
