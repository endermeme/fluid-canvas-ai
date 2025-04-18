// File kiểm tra cấu trúc dữ liệu game đơn giản
const gameDemo = require('./game.cjs');

console.log("=================== GAME STRUCTURE ===================");
console.log("Title:", gameDemo.gameStructure.meta.title);
console.log("Description:", gameDemo.gameStructure.meta.description);

console.log("\n=================== HTML CONTENT ===================");
console.log(gameDemo.gameStructure.html.substring(0, 200) + "...");

console.log("\n=================== CSS CONTENT ===================");
console.log(gameDemo.gameStructure.css.substring(0, 200) + "...");

console.log("\n=================== JS CONTENT ===================");
console.log(gameDemo.gameStructure.javascript.substring(0, 200) + "...");

// Kiểm tra định dạng để hệ thống responseParser.ts phân tích
// Định dạng markdown
const markdownFormat = 
`# ${gameDemo.gameStructure.meta.title}

${gameDemo.gameStructure.meta.description}

## HTML

\`\`\`html
${gameDemo.gameStructure.html}
\`\`\`

## CSS

\`\`\`css
${gameDemo.gameStructure.css}
\`\`\`

## JavaScript

\`\`\`javascript
${gameDemo.gameStructure.javascript}
\`\`\`
`;

// In ra console để kiểm tra
console.log("\n=================== MARKDOWN FORMAT EXAMPLE ===================");
console.log(markdownFormat.substring(0, 500) + "...");

// Định dạng HTML đầy đủ
const fullHtmlFormat = 
`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${gameDemo.gameStructure.meta.title}</title>
  <style>
${gameDemo.gameStructure.css}
  </style>
</head>
<body>
${gameDemo.gameStructure.html}
  <script>
${gameDemo.gameStructure.javascript}
  </script>
</body>
</html>`;

console.log("\n=================== FULL HTML FORMAT EXAMPLE ===================");
console.log(fullHtmlFormat.substring(0, 500) + "..."); 