/**
 * Utility functions for enhancing iframe content, particularly for quiz games.
 */

/**
 * Enhances the given HTML content for use in an iframe by adding necessary meta tags,
 * CSS resets, and a base tag for consistent relative URL resolution.
 *
 * @param {string} originalHtml - The original HTML content of the game.
 * @param {string} [gameTitle='Interactive Game'] - The title of the game, used for the document title.
 * @returns {string} - The enhanced HTML content with added meta tags, CSS resets, and base tag.
 */
export const enhanceIframeContent = (originalHtml: string, gameTitle: string = 'Interactive Game'): string => {
  const baseTag = '<base target="_blank" href="/" />';
  const enhancedHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <title>${gameTitle}</title>
      ${baseTag}
      <style>
        /* Reset some default styles to ensure consistency */
        body, html {
          margin: 0;
          padding: 0;
          overflow: hidden; /* Prevent scrollbars */
          font-family: sans-serif;
          background-color: #fff;
        }
        
        /* Ensure elements don't overflow the iframe */
        *, *:before, *:after {
          box-sizing: border-box;
        }
        
        /* Disable text selection to prevent unwanted highlighting */
        body {
          -webkit-user-select: none; /* Safari */
          -moz-user-select: none; /* Firefox */
          -ms-user-select: none; /* IE10+/Edge */
          user-select: none; /* Standard */
          
          /* Disable tap highlighting on mobile */
          -webkit-tap-highlight-color: transparent;
        }
        
        /* Improve touch interaction */
        button, a {
          touch-action: manipulation;
        }
      </style>
    </head>
    <body>
      ${originalHtml}
    </body>
    </html>
  `;
  return enhancedHtml;
};

/**
 * Shakes the iframe content by adding and removing a class that triggers a CSS animation.
 * This can be used to visually alert the user to an event within the iframe.
 *
 * @param {HTMLIFrameElement} iframe - The iframe element to shake.
 */
export const shake = (iframe: HTMLIFrameElement | null): void => {
  if (!iframe || !iframe.contentDocument || !iframe.contentDocument.body) {
    console.warn('Cannot shake: iframe not loaded or content not available.');
    return;
  }

  const iframeDocument = iframe.contentDocument;
  const body = iframeDocument.body;

  // Define the shake animation CSS within the iframe
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
      20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    .shake {
      animation: shake 0.5s;
    }
  `;
  iframeDocument.head.appendChild(style);

  body.classList.add('shake');

  // Remove the class after the animation completes
  setTimeout(() => {
    body.classList.remove('shake');
    iframeDocument.head.removeChild(style); // Clean up the style element
  }, 500);
};
