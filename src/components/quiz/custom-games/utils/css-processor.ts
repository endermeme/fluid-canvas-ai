
/**
 * CSS processing utilities for iframe content
 */

/**
 * Get optimized base styles for iframe content
 */
export const getOptimizedStyles = (): string => {
  return `
    /* Reset CSS */
    *, *::before, *::after {
      box-sizing: border-box;
    }
    
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      font-size: 16px;
    }
    
    body {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px;
      background-color: #f9f9f9;
      color: #333;
    }
    
    /* Typography */
    h1, h2, h3, h4, h5, h6 {
      margin-top: 0.8em;
      margin-bottom: 0.5em;
      line-height: 1.4;
      font-weight: 600;
    }
    
    h1 { font-size: 2.25rem; }
    h2 { font-size: 1.75rem; }
    h3 { font-size: 1.5rem; }
    
    p { margin-bottom: 1rem; }
    
    /* Canvas and containers */
    canvas {
      display: block;
      max-width: 100%;
      height: auto;
      margin: 0 auto;
    }
    
    /* Container styles */
    .container, .game-container, #game-container {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 1rem;
    }
    
    /* Button styles */
    button {
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
      font-weight: 500;
      color: white;
      background-color: #4f46e5;
      border: none;
      border-radius: 0.375rem;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    button:hover:not(:disabled) {
      background-color: #4338ca;
    }
    
    button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    
    /* Animations */
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    
    /* Wheel specific styles */
    .wheel-container {
      position: relative;
      margin: 1rem auto;
      max-width: 100%;
    }
    
    /* Responsive styles */
    @media (max-width: 768px) {
      body { padding: 10px; }
      h1 { font-size: 1.75rem; }
      button { padding: 0.6rem 1.2rem; }
    }
  `;
};

/**
 * Fix duplicated style tags in HTML
 */
export const fixDuplicatedStyles = (html: string): string => {
  if (!html.includes('<style')) return html;

  try {
    // Extract all style tags
    const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
    const styleMatches = Array.from(html.matchAll(styleRegex));
    
    if (styleMatches.length <= 1) return html;
    
    // Combine all styles into one
    let combinedStyles = '';
    styleMatches.forEach(match => {
      combinedStyles += match[1] + '\n';
    });
    
    // Remove all style tags
    let processedHtml = html.replace(styleRegex, '');
    
    // Add back single style tag in head
    if (processedHtml.includes('<head>')) {
      processedHtml = processedHtml.replace('<head>', `<head>\n  <style>\n${combinedStyles}\n  </style>`);
    } else {
      processedHtml = processedHtml.replace('<html>', '<html>\n<head>\n  <style>\n${combinedStyles}\n  </style>\n</head>');
    }
    
    return processedHtml;
  } catch (error) {
    console.error('Error fixing duplicated styles:', error);
    return html;
  }
};
