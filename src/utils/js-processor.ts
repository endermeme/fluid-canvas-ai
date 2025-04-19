
export const formatJavaScript = (js: string): string => {
  if (!js) return '';
  
  try {
    // Fix template literals
    let formattedJs = js
      .replace(/(\w+\.style\.transform\s*=\s*)rotate\(\$\{([^}]+)\}([^)]*)\)/g, "$1`rotate(${$2}$3)`")
      .replace(/(\w+\.textContent\s*=\s*)([^;"`']*)\$\{([^}]+)\}([^;"`']*);/g, "$1`$2${$3}$4`;")
      .replace(/\\`/g, '`');

    // Fix function parameters
    formattedJs = formattedJs.replace(
      /function\s+(\w+)\s*\(\$2\)/g,
      (match, funcName) => {
        const paramMap: Record<string, string> = {
          drawSegment: '(index, color, text)',
          spinWheel: '()',
          getWinningSegment: '(finalAngle)',
          drawWheel: '()'
        };
        return `function ${funcName}${paramMap[funcName] || '()'}`;
      }
    );

    return formattedJs;
  } catch (error) {
    console.error('Error formatting JavaScript:', error);
    return js;
  }
};

export const addErrorHandling = (js: string): string => {
  return `
try {
  ${js}
} catch (error) {
  console.error('Game error:', error);
}
`;
};
