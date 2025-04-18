
/**
 * Format code with proper indentation and spacing
 */
export const formatCode = (code: string, type: 'html' | 'css' | 'js'): string => {
  if (!code) return '';
  
  // Remove comments
  code = code.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');
  
  // Remove empty lines
  code = code.replace(/^\s*[\r\n]/gm, '');
  
  switch (type) {
    case 'html':
      return formatHTML(code);
    case 'css':
      return formatCSS(code);
    case 'js':
      return formatJS(code);
    default:
      return code;
  }
};

const formatHTML = (code: string): string => {
  let formatted = code;
  let indent = 0;
  const tab = '  ';
  
  // Format HTML tags
  formatted = formatted.replace(/(<\/?[^>]+>)/g, (match) => {
    let result = '';
    
    if (match.startsWith('</')) {
      indent--;
      result = `\n${tab.repeat(indent)}${match}`;
    } else if (match.endsWith('/>')) {
      result = `\n${tab.repeat(indent)}${match}`;
    } else {
      result = `\n${tab.repeat(indent)}${match}`;
      indent++;
    }
    
    return result;
  });
  
  // Clean up extra newlines
  return formatted.trim();
};

const formatCSS = (code: string): string => {
  let formatted = code;
  const tab = '  ';
  
  // Format CSS rules
  formatted = formatted.replace(/([^{]+)\{([^}]+)\}/g, (match, selector, rules) => {
    const formattedRules = rules.split(';')
      .filter(rule => rule.trim())
      .map(rule => `${tab}${rule.trim()};`)
      .join('\n');
    
    return `${selector.trim()} {\n${formattedRules}\n}`;
  });
  
  return formatted.trim();
};

const formatJS = (code: string): string => {
  let formatted = code;
  let indent = 0;
  const tab = '  ';
  
  // Format JavaScript
  formatted = formatted.replace(/[{;}]/g, (match) => {
    if (match === '{') {
      return ` {\n${tab.repeat(++indent)}`;
    } else if (match === '}') {
      return `\n${tab.repeat(--indent)}}`;
    } else {
      return `;\n${tab.repeat(indent)}`;
    }
  });
  
  return formatted.trim();
};

