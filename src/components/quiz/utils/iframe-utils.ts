
import { debugLog } from '@/utils/debug-utils';

export const enhanceIframeContent = (content: string, title?: string): string => {
  // Remove markdown code block syntax and backticks
  let processedContent = content.replace(/```html|```/g, '').replace(/`/g, '');
  
  debugLog('iframe-utils.ts', {
    original: content,
    parsed: processedContent
  });

  // Fix template literals syntax - add missing backticks and correct rotate() syntax
  processedContent = processedContent
    .replace(/resultDisplay\.textContent\s*=\s*Result:\s*\$\{winningSegment\.label\};/g, 
             'resultDisplay.textContent = `Result: ${winningSegment.label}`;')
    .replace(/gameStateDisplay\.textContent\s*=\s*Spins Left:\s*\$\{spinsLeft\}\s*\|\s*Score:\s*\$\{score\};/g, 
             'gameStateDisplay.textContent = `Spins Left: ${spinsLeft} | Score: ${score}`;')
    .replace(/resultDisplay\.textContent\s*\+=\s*\|\s*Game Over!\s*Final Score:\s*\$\{score\};/g, 
             'resultDisplay.textContent += ` | Game Over! Final Score: ${score}`;')
    .replace(/canvas\.style\.transform\s*=\s*rotate\(\$\{rotationAmount\}rad\);/g,
             'canvas.style.transform = `rotate(${rotationAmount}rad)`;')
    .replace(/canvas\.style\.transform\s*=\s*rotate\(\$\{currentRotation\}rad\);/g,
             'canvas.style.transform = `rotate(${currentRotation}rad)`;');

  // Add basic HTML structure if missing
  if (!processedContent.includes('<!DOCTYPE html>')) {
    processedContent = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title || 'Interactive Game'}</title>
  </head>
  <body>
    ${processedContent}
  </body>
</html>`;
  }

  // Normalize line breaks
  processedContent = processedContent
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .trim();

  return processedContent;
};
