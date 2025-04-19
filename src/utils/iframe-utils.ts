/**
 * Enhances iframe HTML content with additional CSS and scripts
 */
export function enhanceIframeContent(htmlContent: string): string {
  // CSS styles để cải thiện hiển thị
  const additionalStyles = `
    <style>
      * {
        font-family: 'Arial', sans-serif;
        box-sizing: border-box;
      }
      body {
        margin: 0;
        padding: 20px;
        overflow-x: hidden;
        background-color: #f9f9f9;
      }
      .container {
        max-width: 100%;
        width: 100%;
        margin: 0 auto;
      }
      h1, h2, h3, h4, h5, h6 {
        font-weight: 600;
        line-height: 1.5;
        margin-bottom: 1rem;
      }
      p {
        line-height: 1.6;
        margin-bottom: 1rem;
      }
      button {
        cursor: pointer;
        padding: 8px 16px;
        border-radius: 4px;
        border: 1px solid #ddd;
        background: #fff;
        font-size: 14px;
        transition: all 0.2s;
      }
      button:hover {
        background: #f0f0f0;
      }
      .game-container {
        width: 100%;
        min-height: 400px;
        border: 1px solid #ddd;
        border-radius: 8px;
        overflow: hidden;
        margin-bottom: 20px;
        background: white;
        padding: 15px;
      }
    </style>
  `;

  // Thêm scripts nếu cần
  const additionalScripts = `
    <script>
      // Có thể thêm script để xử lý các tương tác trong iframe
      document.addEventListener('DOMContentLoaded', function() {
        console.log('Iframe content loaded');
      });
    </script>
  `;

  // Thêm CSS và scripts vào phần head
  let enhancedContent = htmlContent;
  if (htmlContent.includes('</head>')) {
    enhancedContent = htmlContent.replace('</head>', `${additionalStyles}${additionalScripts}</head>`);
  } else {
    // Nếu không có thẻ head, thêm vào đầu body
    enhancedContent = htmlContent.replace('<body', `<head>${additionalStyles}${additionalScripts}</head><body`);
  }

  return enhancedContent;
} 