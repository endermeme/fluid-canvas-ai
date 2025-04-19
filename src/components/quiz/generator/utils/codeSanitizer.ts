
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
  
  // Fix backtick escaping in template literals
  sanitized = sanitized.replace(/\\`/g, '`');
  
  // Ensure script tags are properly closed
  if (sanitized.includes('<script>') && !sanitized.includes('</script>')) {
    sanitized += '\n</script>';
  }
  
  // Add canvas context error handling
  if (sanitized.includes('getContext') && !sanitized.includes('if (!ctx)')) {
    sanitized = sanitized.replace(
      /const\s+ctx\s*=\s*canvas\.getContext\(['"]2d['"]\);/g,
      "const ctx = canvas.getContext('2d');\n  if (!ctx) { console.error('Canvas context not available'); return; }"
    );
  }
  
  // Ensure JavaScript is wrapped in self-executing function for scope isolation
  if (sanitized.includes('<script>') && !sanitized.includes('window.onload') && !sanitized.includes('(function() {')) {
    sanitized = sanitized.replace(
      /<script>([\s\S]*?)<\/script>/g,
      "<script>\n(function() {\n$1\n})();\n</script>"
    );
  }
  
  // Fix document.getElementById calls that might be null
  sanitized = sanitized.replace(
    /const\s+(\w+)\s*=\s*document\.getElementById\(['"]([^'"]+)['"]\);/g,
    "const $1 = document.getElementById('$2');\nif (!$1) { console.error('Element #$2 not found'); return; }"
  );
  
  // Add global error handling
  if (!sanitized.includes('window.onerror')) {
    sanitized = sanitized.replace(
      /<\/body>/,
      `  <script>
    window.onerror = (message, source, lineno, colno, error) => {
      console.error('Game error:', { message, source, lineno, colno, stack: error?.stack });
      return true;
    };
    
    // Ensure DOM is fully loaded before executing scripts
    document.addEventListener('DOMContentLoaded', function() {
      console.log('Game DOM fully loaded and ready');
    });
  </script>
</body>`
    );
  }
  
  return sanitized;
};
