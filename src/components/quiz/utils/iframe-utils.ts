
export const enhanceIframeContent = (content: string, title?: string): string => {
  // Basic HTML wrapper for iframe content
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title || 'Game'}</title>
      <style>
        body { 
          margin: 0; 
          padding: 0; 
          display: flex; 
          justify-content: center; 
          align-items: center; 
          min-height: 100vh; 
          font-family: Arial, sans-serif; 
        }
      </style>
    </head>
    <body>
      ${content}
    </body>
    </html>
  `;
};
