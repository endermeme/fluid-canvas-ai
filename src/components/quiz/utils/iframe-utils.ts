
export const enhanceIframeContent = (content: string, title?: string): string => {
  // Clean the content
  let processedContent = content.replace(/```html|```/g, '');
  processedContent = processedContent.replace(/`/g, '');
  
  // Add DOCTYPE and HTML structure if missing
  if (!processedContent.includes('<!DOCTYPE html>')) {
    if (processedContent.includes('<html')) {
      processedContent = `<!DOCTYPE html>${processedContent}`;
    } else {
      processedContent = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>${title || 'Interactive Game'}</title>
  </head>
  <body>
    ${processedContent}
  </body>
</html>`;
    }
  }
  
  // Format HTML with proper indentation and line breaks
  processedContent = formatHtmlContent(processedContent);
  
  // Fix comments that might "eat" code
  processedContent = fixInlineComments(processedContent);
  
  // Optimized CSS styles with proper formatting
  const optimizedStyles = `
<style>
  html, body {
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
    height: 100% !important;
    overflow: hidden !important;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif !important;
  }
  
  body {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%) !important;
  }
  
  *, *::before, *::after {
    box-sizing: border-box !important;
  }
  
  #game-container, #root, #app, .container, .game-container, #game, .game, main, [class*="container"] {
    width: 100% !important;
    height: 100% !important;
    margin: 0 auto !important;
    padding: 0 !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    max-width: 100% !important;
  }
  
  canvas {
    display: block !important;
    max-width: 100% !important;
    max-height: 100% !important;
    margin: 0 auto !important;
    object-fit: contain !important;
  }
  
  h1, h2, h3, h4, h5, h6 {
    margin: 0.5em 0 !important;
    text-align: center !important;
  }
  
  button {
    cursor: pointer !important;
    padding: 8px 16px !important;
    margin: 8px !important;
    background: #4f46e5 !important;
    color: white !important;
    border: none !important;
    border-radius: 4px !important;
    font-size: 16px !important;
    transition: background 0.2s !important;
  }
  
  button:hover {
    background: #4338ca !important;
  }
  
  pre, code {
    display: none !important;
  }
</style>`;
  
  // Insert the optimized styles into the head
  if (processedContent.includes('<head>')) {
    processedContent = processedContent.replace('<head>', `<head>${optimizedStyles}`);
  } else if (processedContent.includes('<html>')) {
    processedContent = processedContent.replace('<html>', `<html><head>${optimizedStyles}</head>`);
  } else {
    processedContent = `<!DOCTYPE html>
<html>
  <head>
    ${optimizedStyles}
  </head>
  <body>
    ${processedContent}
  </body>
</html>`;
  }
  
  // Remove any references to gptengineer.js
  processedContent = processedContent.replace(/<script[^>]*src=["']https:\/\/cdn\.gpteng\.co\/gptengineer\.js["'][^>]*><\/script>/g, '');
  processedContent = processedContent.replace(/gptengineer\./g, 'game.');
  
  // Add a meta tag for Content Security Policy to improve security
  if (!processedContent.includes('content-security-policy')) {
    const cspTag = `<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;">`;
    processedContent = processedContent.replace('</head>', `  ${cspTag}\n</head>`);
  }
  
  // Properly format and wrap JavaScript in script tags
  processedContent = processedContent.replace(/<script>([\s\S]*?)<\/script>/gi, (match, scriptContent) => {
    // Don't wrap already wrapped code or empty scripts
    if (!scriptContent.trim() || 
        scriptContent.includes('(function()') || 
        scriptContent.includes('(() =>')) {
      return formatScriptTag(match);
    }
    
    // Check for syntax errors in the script content
    try {
      // Simple check for basic syntax errors
      // eslint-disable-next-line no-new-func
      new Function(scriptContent);
    } catch (error) {
      console.error('Syntax error detected in script:', error);
      // Fix common syntax errors
      scriptContent = scriptContent
        .replace(/(\w+):/g, '"$1":') // Fix object literal syntax
        .replace(/'/g, '"')          // Replace single quotes with double quotes
        .replace(/,\s*}/g, '}')      // Remove trailing commas
        .replace(/,\s*]/g, ']');     // Remove trailing commas in arrays
    }
    
    // Wrap in self-executing function with proper indentation
    return `<script>\n(function() {\n${formatJavaScript(scriptContent)}\n})();\n</script>`;
  });
  
  return processedContent;
};

/**
 * Format JavaScript code with proper indentation and line breaks
 */
const formatJavaScript = (code: string): string => {
  if (!code || typeof code !== 'string') return '';
  
  try {
    // Basic JS formatting
    let formatted = code
      // Add line breaks after semicolons, opening braces, and before closing braces
      .replace(/;(?!\n)/g, ';\n')
      .replace(/{(?!\n)/g, '{\n')
      .replace(/(?<!\n)}/g, '\n}')
      // Add line breaks after function declarations
      .replace(/function\s+(\w+)\s*\([^)]*\)\s*{/g, 'function $1($2) {\n')
      // Format if statements with line breaks
      .replace(/if\s*\([^)]+\)\s*{/g, match => match + '\n')
      // Format for loops with line breaks
      .replace(/for\s*\([^)]+\)\s*{/g, match => match + '\n')
      // Format variable declarations with line breaks
      .replace(/(const|let|var)\s+([^;]+);/g, '$1 $2;\n')
      // Clean up excessive empty lines
      .replace(/\n\s*\n\s*\n/g, '\n\n');
    
    // Add proper indentation
    const lines = formatted.split('\n');
    let indentLevel = 1; // Start with 1 level as we're inside a self-executing function
    let indentedCode = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) {
        indentedCode += '\n';
        continue;
      }
      
      // Decrease indent for closing braces
      if (line.startsWith('}')) {
        indentLevel = Math.max(0, indentLevel - 1);
      }
      
      // Add current indentation
      indentedCode += '  '.repeat(indentLevel) + line + '\n';
      
      // Increase indent after opening braces
      if (line.endsWith('{')) {
        indentLevel++;
      }
    }
    
    return indentedCode;
  } catch (error) {
    console.error('Error formatting JavaScript:', error);
    return '  ' + code.trim().split('\n').join('\n  ');
  }
};

/**
 * Format a script tag with proper indentation
 */
const formatScriptTag = (scriptTag: string): string => {
  if (!scriptTag || typeof scriptTag !== 'string') return '';
  
  try {
    // Extract content between script tags
    const content = scriptTag.match(/<script[^>]*>([\s\S]*?)<\/script>/i)?.[1] || '';
    
    if (!content.trim()) {
      return '<script>\n</script>';
    }
    
    // Get attributes from opening tag
    const attributes = scriptTag.match(/<script([^>]*)>/i)?.[1] || '';
    
    // Format the script content with indentation
    const formattedContent = formatJavaScript(content);
    
    // Return formatted script tag
    return `<script${attributes}>\n${formattedContent}</script>`;
  } catch (error) {
    console.error('Error formatting script tag:', error);
    return scriptTag;
  }
};

/**
 * Format HTML content with proper indentation and line breaks
 */
const formatHtmlContent = (html: string): string => {
  if (!html || typeof html !== 'string') return '';
  
  try {
    // Preserve content in script and style tags
    const scriptTags: string[] = [];
    const styleTags: string[] = [];
    
    // Extract and replace script tags with placeholders
    let processedHtml = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, (match) => {
      const placeholder = `__SCRIPT_PLACEHOLDER_${scriptTags.length}__`;
      scriptTags.push(match);
      return placeholder;
    });
    
    // Extract and replace style tags with placeholders
    processedHtml = processedHtml.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, (match) => {
      const placeholder = `__STYLE_PLACEHOLDER_${styleTags.length}__`;
      styleTags.push(match);
      return placeholder;
    });
    
    // Format HTML structure
    processedHtml = processedHtml
      // Add line breaks after opening tags
      .replace(/(<[^\/!][^>]*>)(?!\s*[\r\n])/g, '$1\n')
      // Add line breaks before closing tags
      .replace(/(?<!\s*[\r\n])(<\/[^>]+>)/g, '\n$1')
      // Add line breaks after self-closing tags
      .replace(/(<[^>]*\/>)(?!\s*[\r\n])/g, '$1\n')
      // Add line breaks after comments and DOCTYPE
      .replace(/(<!(?:DOCTYPE|--)[^>]*>)(?!\s*[\r\n])/g, '$1\n')
      // Clean up excessive empty lines
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      .trim();
    
    // Apply indentation
    const lines = processedHtml.split('\n');
    let indentLevel = 0;
    let formattedHtml = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      // Special case for DOCTYPE which doesn't get indented
      if (line.startsWith('<!DOCTYPE')) {
        formattedHtml += line + '\n';
        continue;
      }
      
      // Decrease indent for closing tags
      if (line.startsWith('</') && !line.startsWith('</script') && !line.startsWith('</style')) {
        indentLevel = Math.max(0, indentLevel - 1);
      }
      
      // Add current indentation
      formattedHtml += '  '.repeat(indentLevel) + line + '\n';
      
      // Increase indent after opening tags, but not for self-closing or special tags
      if (line.match(/<[^\/!][^>]*>/) && 
          !line.match(/<[^>]*\/>/) && 
          !line.match(/<(script|style|link|meta|br|hr|img|input)[^>]*>/i)) {
        indentLevel++;
      }
    }
    
    // Restore script tags
    scriptTags.forEach((script, index) => {
      const placeholder = `__SCRIPT_PLACEHOLDER_${index}__`;
      formattedHtml = formattedHtml.replace(placeholder, formatScriptTag(script));
    });
    
    // Restore style tags with formatting
    styleTags.forEach((style, index) => {
      const placeholder = `__STYLE_PLACEHOLDER_${index}__`;
      
      // Format the CSS content
      const formattedStyle = style.replace(/<style[^>]*>([\s\S]*?)<\/style>/i, (match, cssContent) => {
        const formattedCss = cssContent
          .replace(/{/g, ' {\n  ')
          .replace(/;/g, ';\n  ')
          .replace(/}/g, '\n}')
          .replace(/\s+/g, ' ')
          .replace(/\n\s*\n/g, '\n')
          .trim();
        
        return `<style>\n  ${formattedCss}\n</style>`;
      });
      
      formattedHtml = formattedHtml.replace(placeholder, formattedStyle);
    });
    
    return formattedHtml;
  } catch (error) {
    console.error('Error formatting HTML content:', error);
    return html;
  }
};

/**
 * Tách comments và code thành các dòng riêng biệt để tránh lỗi comments "nuốt" code
 */
const fixInlineComments = (html: string): string => {
  if (!html || typeof html !== 'string') return html;
  
  try {
    // Tìm và sửa các dòng comment JavaScript
    return html.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, (match, scriptContent) => {
      // Tách comment và code thành các dòng riêng
      let fixedScript = scriptContent.replace(/(\/\/[^\n]*)(let|const|var|function)/g, '$1\n$2');
      
      // Đảm bảo comment và khai báo biến được tách thành dòng riêng
      fixedScript = fixedScript.replace(/(\/\/[^\n]*[\w\d]+)\s*=\s*/g, '$1\n$2 = ');
      
      // Sửa function easeOut có tham số đúng
      fixedScript = fixedScript.replace(/function\s+easeOut\s*\(\$2\)\s*{/, 'function easeOut(t, b, c, d) {');
      
      return match.replace(scriptContent, fixedScript);
    });
  } catch (error) {
    console.error('Error fixing inline comments:', error);
    return html;
  }
};
