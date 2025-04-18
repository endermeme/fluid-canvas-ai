/**
 * Parser đơn giản để xử lý HTML tổng hợp từ Gemini
 * Không tách thành 3 file riêng biệt mà load trực tiếp HTML
 */

// Hàm parse phản hồi từ Gemini
function parseGeminiResponse(response) {
  // Kiểm tra xem response có phải một HTML fragment
  const isHtmlFragment = response.trim().startsWith('<') && !response.includes('<!DOCTYPE');
  
  // Kiểm tra xem response có phải HTML đầy đủ
  const isFullHtml = response.trim().startsWith('<!DOCTYPE') || response.trim().startsWith('<html');
  
  let finalHtml = '';
  
  if (isHtmlFragment) {
    // Trường hợp nhận fragment HTML, bọc nó trong HTML đầy đủ
    finalHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vòng Quay May Mắn</title>
</head>
<body>
  ${response}
</body>
</html>`;
  } else if (isFullHtml) {
    // Trường hợp đã nhận HTML đầy đủ
    finalHtml = response;
  } else {
    // Trường hợp nhận plaintext, bọc nó trong thẻ pre
    finalHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Content</title>
</head>
<body>
  <pre>${response}</pre>
</body>
</html>`;
  }
  
  // Log HTML đầy đủ không bị cắt
  console.log("=== FULL HTML CONTENT ===");
  console.log(finalHtml);
  
  return {
    content: finalHtml,
    // Vẫn trả về các trường cần thiết cho API hiện tại
    title: extractTitle(finalHtml),
    description: "Processed HTML content",
    isSeparatedFiles: false,
    // Không cần tách file nữa
    htmlContent: finalHtml,
    cssContent: "",
    jsContent: ""
  };
}

// Hàm trích xuất title từ HTML
function extractTitle(html) {
  const titleMatch = html.match(/<title>(.*?)<\/title>/i);
  return titleMatch ? titleMatch[1].trim() : "Generated Content";
}

// Ví dụ sử dụng
const rawGeminiResponse = `<head>
  <title>Vòng Quay May Mắn</title>
  <link rel="stylesheet" href="style.css">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
  <div class="container">
    <!-- Content here -->
  </div>
</body>`;

// Demo parser
const result = parseGeminiResponse(rawGeminiResponse);
console.log("\n=== PARSED RESULT ===");
console.log(result);

// Ví dụ với HTML đầy đủ
const fullHtmlExample = `<!DOCTYPE html>
<html>
<head>
  <title>Vòng Quay May Mắn - Full</title>
  <style>
    body { font-family: sans-serif; }
  </style>
</head>
<body>
  <h1>Vòng Quay May Mắn</h1>
  <div class="wheel"></div>
  <script>
    console.log("Loaded");
  </script>
</body>
</html>`;

console.log("\n=== EXAMPLE WITH FULL HTML ===");
const fullHtmlResult = parseGeminiResponse(fullHtmlExample);
console.log(fullHtmlResult.title);

module.exports = {
  parseGeminiResponse
}; 