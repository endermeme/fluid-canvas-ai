
export const enhanceIframeContent = (content: string, title?: string): string => {
  let processedContent = content.replace(/```html|```/g, '');
  processedContent = processedContent.replace(/`/g, '');
  
  if (!processedContent.includes('<!DOCTYPE html>')) {
    if (processedContent.includes('<html')) {
      processedContent = `<!DOCTYPE html>${processedContent}`;
    } else {
      processedContent = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${title || 'Interactive Game'}</title></head><body>${processedContent}</body></html>`;
    }
  }
  
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
    </style>
  `;
  
  if (processedContent.includes('<head>')) {
    processedContent = processedContent.replace('<head>', `<head>${optimizedStyles}`);
  } else if (processedContent.includes('<html>')) {
    processedContent = processedContent.replace('<html>', `<html><head>${optimizedStyles}</head>`);
  } else {
    processedContent = `<!DOCTYPE html><html><head>${optimizedStyles}</head><body>${processedContent}</body></html>`;
  }
  
  return processedContent;
};
