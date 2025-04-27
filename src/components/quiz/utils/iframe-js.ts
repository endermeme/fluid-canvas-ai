
/**
 * JavaScript enhancement for games in iframe
 */

import { wheelHelpers } from './game-helpers/wheel-helpers';
import { gameHelpers } from './game-helpers/general-helpers';

export const enhanceScript = (jsContent: string): string => {
  // Add helper functions to the script
  const helpers = `
    // Add game helpers to window object
    window.wheelHelpers = ${JSON.stringify(wheelHelpers)};
    window.gameHelpers = ${JSON.stringify(gameHelpers)};
    
    // Create CSS animation for result display
    (function() {
      const styleSheet = document.createElement('style');
      styleSheet.textContent = \`
        @keyframes scale-in {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      \`;
      document.head.appendChild(styleSheet);
    })();
    
    // Ensure console logs are visible in parent window
    (function() {
      const originalConsoleLog = console.log;
      console.log = function() {
        originalConsoleLog.apply(console, arguments);
        try {
          window.parent.postMessage({
            type: 'console.log',
            args: Array.from(arguments).map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg)
          }, '*');
        } catch(e) {
          originalConsoleLog('Error sending log to parent:', e);
        }
      }
    })();
  `;
  
  // Always include helpers at the beginning of the script
  return helpers + '\n\n' + jsContent;
};

/**
 * Extract JavaScript content from API response
 */
export const extractJsContent = (apiResponse: string): string => {
  try {
    // Find content between <JAVASCRIPT> tags
    const jsRegex = /<JAVASCRIPT>([\s\S]*?)<\/JAVASCRIPT>/i;
    const jsMatch = apiResponse.match(jsRegex);
    
    if (jsMatch && jsMatch[1]) {
      return jsMatch[1].trim();
    }
    
    // Try alternative format
    const alternativeRegex = /```js(?:cript)?([\s\S]*?)```/i;
    const alternativeMatch = apiResponse.match(alternativeRegex);
    
    if (alternativeMatch && alternativeMatch[1]) {
      return alternativeMatch[1].trim();
    }
    
    return '';
  } catch (error) {
    console.error('Error extracting JavaScript content:', error);
    return '';
  }
};
