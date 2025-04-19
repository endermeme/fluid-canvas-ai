
/**
 * HTML processing utilities for iframe content
 */

/**
 * Format HTML content with proper indentation and line breaks
 */
export const formatHtmlContent = (html: string): string => {
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
      .replace(/(<[^\/!][^>]*>)(?!\s*[\r\n])/g, '$1\n')
      .replace(/(?<!\s*[\r\n])(<\/[^>]+>)/g, '\n$1')
      .replace(/(<[^>]*\/>)(?!\s*[\r\n])/g, '$1\n')
      .replace(/(<!(?:DOCTYPE|--)[^>]*>)(?!\s*[\r\n])/g, '$1\n')
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      .trim();
    
    // Apply indentation
    const lines = processedHtml.split('\n');
    let indentLevel = 0;
    let formattedHtml = '';
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;
      
      if (trimmedLine.startsWith('<!DOCTYPE')) {
        formattedHtml += trimmedLine + '\n';
        continue;
      }
      
      if (trimmedLine.startsWith('</')) {
        indentLevel = Math.max(0, indentLevel - 1);
      }
      
      formattedHtml += '  '.repeat(indentLevel) + trimmedLine + '\n';
      
      if (trimmedLine.match(/<[^\/!][^>]*>/) && 
          !trimmedLine.match(/<[^>]*\/>/) && 
          !trimmedLine.match(/<(script|style|link|meta|br|hr|img|input)[^>]*>/i)) {
        indentLevel++;
      }
    }
    
    // Restore script and style tags with formatting
    formattedHtml = restoreTagsWithFormatting(formattedHtml, scriptTags, styleTags);
    
    return formattedHtml;
  } catch (error) {
    console.error('Error formatting HTML content:', error);
    return html;
  }
};

const restoreTagsWithFormatting = (html: string, scriptTags: string[], styleTags: string[]): string => {
  let result = html;
  
  // Restore script tags
  scriptTags.forEach((script, index) => {
    const placeholder = `__SCRIPT_PLACEHOLDER_${index}__`;
    const formattedScript = formatScriptTag(script);
    result = result.replace(placeholder, formattedScript);
  });
  
  // Restore style tags
  styleTags.forEach((style, index) => {
    const placeholder = `__STYLE_PLACEHOLDER_${styleTags.length}__`;
    const formattedStyle = formatStyleTag(style);
    result = result.replace(placeholder, formattedStyle);
  });
  
  return result;
};

const formatScriptTag = (scriptTag: string): string => {
  if (!scriptTag || typeof scriptTag !== 'string') return '';
  
  try {
    const content = scriptTag.match(/<script[^>]*>([\s\S]*?)<\/script>/i)?.[1] || '';
    const attributes = scriptTag.match(/<script([^>]*)>/i)?.[1] || '';
    
    if (!content.trim()) {
      return '<script>\n</script>';
    }
    
    return `<script${attributes}>\n${formatJavaScript(content)}</script>`;
  } catch (error) {
    console.error('Error formatting script tag:', error);
    return scriptTag;
  }
};

const formatStyleTag = (styleTag: string): string => {
  return styleTag.replace(/<style[^>]*>([\s\S]*?)<\/style>/i, (_, cssContent) => {
    const formattedCss = cssContent
      .replace(/{/g, ' {\n  ')
      .replace(/;/g, ';\n  ')
      .replace(/}/g, '\n}')
      .replace(/\s+/g, ' ')
      .replace(/\n\s*\n/g, '\n')
      .trim();
    
    return `<style>\n  ${formattedCss}\n</style>`;
  });
};

const formatJavaScript = (code: string): string => {
  if (!code || typeof code !== 'string') return '';
  
  try {
    let formatted = code
      .replace(/;(?!\n)/g, ';\n')
      .replace(/{(?!\n)/g, '{\n')
      .replace(/(?<!\n)}/g, '\n}')
      .replace(/function\s+(\w+)\s*\([^)]*\)\s*{/g, 'function $1($2) {\n')
      .replace(/if\s*\([^)]+\)\s*{/g, match => match + '\n')
      .replace(/for\s*\([^)]+\)\s*{/g, match => match + '\n')
      .replace(/(const|let|var)\s+([^;]+);/g, '$1 $2;\n')
      .replace(/\n\s*\n\s*\n/g, '\n\n');
    
    const lines = formatted.split('\n');
    let indentLevel = 1;
    let indentedCode = '';
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) {
        indentedCode += '\n';
        continue;
      }
      
      if (trimmedLine.startsWith('}')) {
        indentLevel = Math.max(0, indentLevel - 1);
      }
      
      indentedCode += '  '.repeat(indentLevel) + trimmedLine + '\n';
      
      if (trimmedLine.endsWith('{')) {
        indentLevel++;
      }
    }
    
    return indentedCode;
  } catch (error) {
    console.error('Error formatting JavaScript:', error);
    return '  ' + code.trim().split('\n').join('\n  ');
  }
};
