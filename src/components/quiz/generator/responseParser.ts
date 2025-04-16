
import { MiniGame } from './types';
import { injectImageUtils } from './imageGenerator';

/**
 * Extract HTML, CSS, and JS from markdown format
 */
const extractCodeFromMarkdown = (text: string): { html: string, css: string, js: string } => {
  const htmlMatch = text.match(/```html\n([\s\S]*?)```/);
  const cssMatch = text.match(/```css\n([\s\S]*?)```/);
  const jsMatch = text.match(/```js(?:cript)?\n([\s\S]*?)```/);

  const htmlCode = htmlMatch?.[1]?.trim() || '';
  const cssCode = cssMatch?.[1]?.trim() || '';
  const jsCode = jsMatch?.[1]?.trim() || '';

  return {
    html: htmlCode,
    css: cssCode,
    js: jsCode
  };
};

/**
 * Extract HTML, CSS, and JS from complete HTML
 */
const extractCodeFromFullHtml = (html: string): { html: string, css: string, js: string } => {
  // Find style tag
  const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/i);
  const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/i);

  let htmlCode = html;
  const cssCode = styleMatch?.[1]?.trim() || '';
  const jsCode = scriptMatch?.[1]?.trim() || '';

  // Remove style and script from HTML
  if (styleMatch) {
    htmlCode = htmlCode.replace(/<style>[\s\S]*?<\/style>/i, '');
  }
  if (scriptMatch) {
    htmlCode = htmlCode.replace(/<script>[\s\S]*?<\/script>/i, '');
  }

  return {
    html: htmlCode,
    css: cssCode,
    js: jsCode
  };
};

/**
 * Extract HTML, CSS, JS from unusual format (HTML with css and js at the end)
 */
const extractCodeFromMixedFormat = (text: string): { html: string, css: string, js: string } => {
  // Find complete HTML
  const htmlMatch = text.match(/<!DOCTYPE[\s\S]*?<\/html>/i);
  if (!htmlMatch) return { html: '', css: '', js: '' };

  // Get HTML
  const fullHtml = htmlMatch[0];
  
  // Find CSS section
  const cssMatch = text.match(/<\/html>[\s\S]*?css\s+([\s\S]*?)(?=js|$)/i);
  const jsMatch = text.match(/js\s+([\s\S]*?)$/i);

  // Extract parts
  const cssCode = cssMatch?.[1]?.trim() || '';
  const jsCode = jsMatch?.[1]?.trim() || '';

  // Extract HTML content from complete HTML
  const { html: htmlContent } = extractCodeFromFullHtml(fullHtml);

  return {
    html: htmlContent,
    css: cssCode,
    js: jsCode
  };
};

/**
 * NEW: Extract code when CSS and JS are marked with keywords in plain text
 * This handles cases where the response has format like:
 * <html>...</html> css <css_code> js <js_code>
 * or like:
 * <html content> css .container {...} js document.addEventListener...
 */
const extractCodeFromKeywordFormat = (text: string): { html: string, css: string, js: string } => {
  // Try to find HTML, CSS and JS sections by keywords
  let htmlContent = '';
  let cssContent = '';
  let jsContent = '';
  
  // Check if we have css and js markers
  const hasCssKeyword = text.includes(' css ') || text.match(/\bcss\s+\./);
  const hasJsKeyword = text.includes(' js ');
  
  if (hasCssKeyword && hasJsKeyword) {
    // Extract HTML (everything before css keyword)
    const cssIndex = text.indexOf(' css ');
    if (cssIndex > 0) {
      htmlContent = text.substring(0, cssIndex).trim();
    }
    
    // Extract CSS (between css and js keywords)
    const jsIndex = text.indexOf(' js ');
    if (cssIndex > 0 && jsIndex > cssIndex) {
      cssContent = text.substring(cssIndex + 5, jsIndex).trim();
    }
    
    // Extract JS (everything after js keyword)
    if (jsIndex > 0) {
      jsContent = text.substring(jsIndex + 4).trim();
    }
  }
  
  return {
    html: htmlContent,
    css: cssContent,
    js: jsContent
  };
};

/**
 * Format HTML with indentation and line breaks
 */
const formatHTML = (code: string): string => {
  if (!code.trim()) return '';
  
  try {
    // Handle one-line HTML
    if (!code.includes('\n')) {
      return formatHTMLOneLineToMultiLine(code);
    }
    
    let formattedLines = [];
    let indentLevel = 0;
    const lines = code.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();
      if (!line) continue;
      
      // Decrease indent for closing tags
      if (line.match(/^<\/\w+>/)) {
        indentLevel = Math.max(0, indentLevel - 1);
      }
      
      // Add indent
      formattedLines.push('  '.repeat(indentLevel) + line);
      
      // Increase indent for opening tags (not self-closing)
      if (line.match(/<\w+[^>]*>/) && !line.match(/<\w+[^>]*\/>/)) {
        // Don't increase indent for tags that don't need closing
        if (!line.match(/<(br|hr|img|input|link|meta)[^>]*>/i)) {
          indentLevel++;
        }
      }
    }
    
    return formattedLines.join('\n');
  } catch (error) {
    console.error('Error formatting HTML:', error);
    return code;
  }
};

/**
 * Convert HTML from one line to multi-line
 */
const formatHTMLOneLineToMultiLine = (code: string): string => {
  let formattedCode = code
    .replace(/></g, '>\n<')
    .replace(/>\s*([^<]+)\s*</g, '>\n$1\n<');
  
  return formatHTML(formattedCode);
};

/**
 * Format JavaScript with indentation and line breaks
 */
const formatJavaScript = (code: string): string => {
  if (!code.trim()) return '';
  
  try {
    // Handle one-line JS
    if (!code.includes('\n')) {
      code = formatJSOneLineToMultiLine(code);
    }
    
    let formattedCode = code
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
      .replace(/\/\/[^\n]*/g, '')       // Remove line comments
      .trim();
    
    const lines = formattedCode.split('\n');
    let indentLevel = 0;
    let formattedLines = [];
    
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();
      if (!line) continue;
      
      // Decrease indent for }
      if (line.startsWith('}')) {
        indentLevel = Math.max(0, indentLevel - 1);
      }
      
      // Add current indent
      formattedLines.push('  '.repeat(indentLevel) + line);
      
      // Increase indent after {
      if (line.endsWith('{')) {
        indentLevel++;
      }
    }
    
    return formattedLines.join('\n');
  } catch (error) {
    console.error('Error formatting JavaScript:', error);
    return code;
  }
};

/**
 * Convert JS from one line to multi-line
 */
const formatJSOneLineToMultiLine = (code: string): string => {
  return code
    .replace(/;/g, ';\n')
    .replace(/{/g, '{\n')
    .replace(/}/g, '}\n')
    .replace(/\) {/g, ') {\n')
    .replace(/\}\s*else\s*{/g, '}\nelse {')
    .replace(/\}\s*else\s*if\s*\(/g, '}\nelse if (');
};

/**
 * Format CSS with indentation and line breaks
 */
const formatCss = (code: string): string => {
  if (!code.trim()) return '';
  
  try {
    // Handle one-line CSS
    if (!code.includes('\n')) {
      code = formatCSSOneLineToMultiLine(code);
    }
    
    let formattedCode = code
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
      .trim();
    
    // Format CSS with indentation and line breaks
    formattedCode = formattedCode
      .replace(/\s*\{\s*/g, ' {\n  ')
      .replace(/;\s*/g, ';\n  ')
      .replace(/\s*}\s*/g, '\n}\n')
      .replace(/\n\s*\n/g, '\n'); // Remove duplicate empty lines
    
    return formattedCode;
  } catch (error) {
    console.error('Error formatting CSS:', error);
    return code;
  }
};

/**
 * Convert CSS from one line to multi-line
 */
const formatCSSOneLineToMultiLine = (code: string): string => {
  return code
    .replace(/}/g, '}\n')
    .replace(/{/g, '{\n')
    .replace(/;/g, ';\n');
};

/**
 * Create complete HTML from separate parts
 */
const createCompleteHtml = (html: string, css: string, js: string): string => {
  const docType = '<!DOCTYPE html>';
  return `
${docType}
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Interactive Game</title>
  <style>
${css}
  </style>
</head>
<body>
${html}
  <script>
${js}
  </script>
</body>
</html>`;
};

/**
 * Parse and analyze response from Gemini
 */
export const parseGeminiResponse = (text: string, topic: string): MiniGame => {
  console.log("🔷 Gemini: Starting response parsing");
  
  try {
    // Analyze response type
    const isCompleteHtml = text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html');
    const hasMarkdownBlocks = text.includes('```html') && (text.includes('```css') || text.includes('```js'));
    const isMixedFormat = text.includes('</html>') && (text.includes(' css ') || text.includes(' js '));
    const hasKeywordFormat = (text.includes(' css ') || text.match(/\bcss\s+\./)) && text.includes(' js ');
    
    console.log("🔷 Gemini: Response format analysis:", {
      isCompleteHtml,
      hasMarkdownBlocks,
      isMixedFormat,
      hasKeywordFormat
    });
    
    // Extract code based on format
    let html = '', css = '', js = '';
    
    if (hasMarkdownBlocks) {
      console.log("🔷 Gemini: Extracting code from markdown blocks");
      const extracted = extractCodeFromMarkdown(text);
      html = extracted.html;
      css = extracted.css;
      js = extracted.js;
    } else if (isMixedFormat) {
      console.log("🔷 Gemini: Extracting code from mixed format (HTML with css/js keywords)");
      const extracted = extractCodeFromMixedFormat(text);
      html = extracted.html;
      css = extracted.css;
      js = extracted.js;
    } else if (hasKeywordFormat) {
      console.log("🔷 Gemini: Extracting code from keyword format (plain text with css/js markers)");
      const extracted = extractCodeFromKeywordFormat(text);
      html = extracted.html;
      css = extracted.css;
      js = extracted.js;
    } else if (isCompleteHtml) {
      console.log("🔷 Gemini: Extracting code from complete HTML");
      const extracted = extractCodeFromFullHtml(text);
      html = extracted.html;
      css = extracted.css;
      js = extracted.js;
    } else {
      // Unknown format, try detection
      console.log("🔷 Gemini: Unknown format, attempting detection");
      if (text.includes('<html') && text.includes('<style') && text.includes('<script')) {
        const extracted = extractCodeFromFullHtml(text);
        html = extracted.html;
        css = extracted.css;
        js = extracted.js;
      } else {
        // Try keyword format as last resort
        const extracted = extractCodeFromKeywordFormat(text);
        if (extracted.css && extracted.js) {
          console.log("🔷 Gemini: Successfully extracted using keyword format");
          html = extracted.html;
          css = extracted.css;
          js = extracted.js;
        } else {
          // If can't extract, use entire text as HTML
          html = text;
        }
      }
    }
    
    // Handle specifically the case where html is empty but we have DIV content in the text
    if (!html && text.includes('<div') && css && js) {
      const divMatch = text.match(/(<div[\s\S]*?<\/div>)/);
      if (divMatch) {
        html = divMatch[1];
      }
    }
    
    // Log extracted content for debugging
    console.log("🔷 Gemini: Extracted HTML:", html ? html.substring(0, 100) + "..." : "None");
    console.log("🔷 Gemini: Extracted CSS:", css ? css.substring(0, 100) + "..." : "None");
    console.log("🔷 Gemini: Extracted JS:", js ? js.substring(0, 100) + "..." : "None");
    
    // Format code
    const formattedHTML = formatHTML(html);
    const formattedCSS = formatCss(css);
    const formattedJS = formatJavaScript(js);
    
    // Create complete HTML for display
    const completeHtml = createCompleteHtml(formattedHTML, formattedCSS, formattedJS);
    const enhancedHtml = injectImageUtils(completeHtml);
    
    // Extract title
    let title = topic;
    const titleMatch = enhancedHtml.match(/<title>(.*?)<\/title>/i);
    if (titleMatch && titleMatch[1]) {
      title = titleMatch[1].replace(/<[^>]*>/g, '').trim();
    }
    
    console.log("🔷 Gemini: Successfully parsed game content");
    console.log("HTML Content Length:", formattedHTML.length);
    console.log("CSS Content Length:", formattedCSS.length);
    console.log("JS Content Length:", formattedJS.length);
    
    // Return game with both full and separated formats
    return {
      title: title,
      description: "Generated HTML game content",
      content: enhancedHtml,
      htmlContent: formattedHTML,
      cssContent: formattedCSS,
      jsContent: formattedJS,
      isSeparatedFiles: true
    };
  } catch (error) {
    console.error("❌ Gemini: Content extraction error:", error);
    
    // Create error page
    const errorHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Error: ${topic}</title>
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
          <h1>Error Generating Game</h1>
          <p>Sorry, there was a problem creating your game about "${topic}".</p>
          <p>Please try again or check the console for more details.</p>
        </div>
      </body>
      </html>
    `;
    
    return {
      title: `Error: ${topic}`,
      description: "Error generating content",
      content: errorHtml,
      isSeparatedFiles: false
    };
  }
};
