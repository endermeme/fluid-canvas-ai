interface ParsedCode {
  html: string;
  css: string;
  javascript: string;
  title?: string;
  description?: string;
}

/**
 * Parse markdown-style code blocks from a string response
 */
const parseCodeBlocks = (response: string): ParsedCode => {
  // Initialize result object
  const result: ParsedCode = {
    html: '',
    css: '',
    javascript: '',
    title: '',
    description: ''
  };

  try {
    // Split response into lines
    const lines = response.split('\n');
    let currentBlock = '';
    let isCollectingCode = false;
    let currentLanguage = '';

    // Extract title if it exists (usually after first **)
    const titleMatch = response.match(/\*\*(.*?)\*\*/);
    if (titleMatch) {
      result.title = titleMatch[1].trim();
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Check for code block start
      if (line.startsWith('```')) {
        // If we're already collecting code, this is an end marker
        if (isCollectingCode) {
          // Save collected code to appropriate section
          switch (currentLanguage) {
            case 'html':
              result.html = cleanCodeBlock(currentBlock);
              break;
            case 'css':
              result.css = cleanCodeBlock(currentBlock);
              break;
            case 'javascript':
            case 'js':
              result.javascript = cleanCodeBlock(currentBlock);
              break;
          }
          // Reset collection state
          isCollectingCode = false;
          currentBlock = '';
          currentLanguage = '';
        } else {
          // This is a start marker - get language
          const lang = line.replace('```', '').trim().toLowerCase();
          if (['html', 'css', 'javascript', 'js'].includes(lang)) {
            isCollectingCode = true;
            currentLanguage = lang;
            currentBlock = '';
          }
        }
        continue;
      }

      // If we're collecting code, add the line
      if (isCollectingCode) {
        currentBlock += line + '\n';
      } else if (!line.startsWith('**') && line.length > 0) {
        // If not in a code block and not a markdown header, treat as description
        result.description += line + ' ';
      }
    }

    // Clean up description
    result.description = result.description.trim();

    // Clean up the code blocks
    result.html = removeComments(result.html);
    result.css = removeComments(result.css);
    result.javascript = removeComments(result.javascript);

    // Convert parsed blocks into a single HTML file with embedded CSS and JS
    const combinedHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${result.title || "Interactive Game"}</title>
  <style>
    ${result.css}
  </style>
</head>
<body>
  ${result.html}
  <script>
    ${result.javascript}
  </script>
</body>
</html>`;

    // Update result with combined HTML
    result.html = combinedHtml;

    return result;
  } catch (error) {
    console.error('Error parsing code blocks:', error);
    return result;
  }
};

/**
 * Clean up a code block by removing extra whitespace and comments
 */
const cleanCodeBlock = (code: string): string => {
  return code
    .trim()
    .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '') // Remove comments
    .replace(/^\s*\n/gm, '') // Remove empty lines
    .replace(/\s+$/gm, ''); // Remove trailing whitespace
};

/**
 * Remove HTML/CSS/JS comments from code
 */
const removeComments = (code: string): string => {
  if (!code) return '';
  
  return code
    .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '') // Remove JS & CSS comments
    .replace(/<!--[\s\S]*?-->/g, '') // Remove HTML comments
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '') // Remove React comments
    .trim();
};

export { parseCodeBlocks, type ParsedCode };
