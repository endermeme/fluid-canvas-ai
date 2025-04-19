
export const sanitizeGameCode = (content: string): string => {
  let sanitized = content;
  
  // Remove markdown code block syntax
  sanitized = sanitized.replace(/```html|```/g, '');
  
  // Fix function parameters
  sanitized = sanitized.replace(/function\s+(\w+)\s*\(\$2\)/g, (match, funcName) => {
    if (funcName === 'drawSegment') return 'function drawSegment(index, color, text)';
    if (funcName === 'getWinningSegment') return 'function getWinningSegment(finalAngle)';
    if (funcName === 'spinWheel') return 'function spinWheel()';
    if (funcName === 'drawWheel') return 'function drawWheel()';
    if (funcName.includes('ease') || funcName.includes('animate')) 
      return `function ${funcName}(t, b, c, d)`;
    return match;
  });
  
  // Fix template literals
  sanitized = sanitized.replace(/(\w+\.style\.transform\s*=\s*)rotate\(\$\{([^}]+)\}([^)]*)\)/g, 
    "$1`rotate(${$2}$3)`");
  
  sanitized = sanitized.replace(/(\w+\.textContent\s*=\s*)([^;"`']*)\$\{([^}]+)\}([^;"`']*);/g, 
    "$1`$2${$3}$4`;");
  
  // Add canvas context error handling
  if (sanitized.includes('getContext') && !sanitized.includes('if (!ctx)')) {
    sanitized = sanitized.replace(
      /const\s+ctx\s*=\s*canvas\.getContext\(['"]2d['"]\);/g,
      "const ctx = canvas.getContext('2d');\n  if (!ctx) { console.error('Canvas context not available'); return; }"
    );
  }
  
  // Add global error handling
  if (!sanitized.includes('window.onerror')) {
    sanitized = sanitized.replace(
      /<\/body>/,
      `  <script>
    window.onerror = (message, source, lineno, colno, error) => {
      console.error('Game error:', { message, source, lineno, colno, stack: error?.stack });
      return true;
    };
  </script>
</body>`
    );
  }
  
  return sanitized;
};
