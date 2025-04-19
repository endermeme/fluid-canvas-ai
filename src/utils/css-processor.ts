
export const formatCss = (css: string): string => {
  if (!css) return '';
  
  try {
    return css
      .replace(/\s*\{\s*/g, ' {\n  ')
      .replace(/;\s*/g, ';\n  ')
      .replace(/\s*}\s*/g, '\n}\n')
      .replace(/\n\s*\n/g, '\n')
      .trim();
  } catch (error) {
    console.error('Error formatting CSS:', error);
    return css;
  }
};

export const addBaseStyles = (): string => {
  return `
  /* Base responsive styles */
  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  }
  
  body {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    background-color: #f8f9fa;
  }
  
  canvas {
    display: block;
    max-width: 100%;
    height: auto;
    margin: 0 auto;
  }
  
  button {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    background: #4f46e5;
    color: white;
    cursor: pointer;
    font-size: 16px;
  }
  `;
};
