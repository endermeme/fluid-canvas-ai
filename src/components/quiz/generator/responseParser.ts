
import { formatHtml, validateHtmlStructure } from '@/utils/html-processor';
import { formatCss, addBaseStyles } from '@/utils/css-processor';
import { formatJavaScript, addErrorHandling } from '@/utils/js-processor';
import { MiniGame } from './types';

export const parseGeminiResponse = (text: string, topic: string): MiniGame => {
  console.log("🔷 Bắt đầu phân tích phản hồi");
  
  try {
    // Extract code blocks
    const { html, css, js } = extractCodeBlocks(text);
    
    // Format each part
    const formattedHtml = formatHtml(html);
    const formattedCss = css ? formatCss(css) : addBaseStyles();
    const formattedJs = js ? addErrorHandling(formatJavaScript(js)) : '';
    
    // Combine into final HTML
    const finalContent = createFinalHtml(formattedHtml, formattedCss, formattedJs);
    
    return {
      title: topic,
      description: "Generated game content",
      content: finalContent
    };
  } catch (error) {
    console.error("❌ Lỗi khi xử lý phản hồi:", error);
    return createErrorGame(topic);
  }
};

const extractCodeBlocks = (text: string): { html: string, css: string, js: string } => {
  let html = '', css = '', js = '';
  
  // Extract HTML
  const htmlMatch = text.match(/```html\n([\s\S]*?)```/) || text.match(/<html[\s\S]*?<\/html>/);
  if (htmlMatch) html = htmlMatch[1] || htmlMatch[0];
  
  // Extract CSS
  const cssMatch = text.match(/```css\n([\s\S]*?)```/);
  if (cssMatch) css = cssMatch[1];
  
  // Extract JavaScript
  const jsMatch = text.match(/```(js|javascript)\n([\s\S]*?)```/);
  if (jsMatch) js = jsMatch[2];
  
  return { html, css, js };
};

const createFinalHtml = (html: string, css: string, js: string): string => {
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
  <script>${js}</script>
</body>
</html>`;
};

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
