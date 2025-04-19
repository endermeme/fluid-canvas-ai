
import { debugLog } from '@/utils/debug-utils';

export const enhanceIframeContent = (content: string, title?: string): string => {
  // Remove markdown code block syntax and backticks
  let processedContent = content.replace(/```html|```/g, '').replace(/`/g, '');
  
  debugLog('iframe-utils.ts', {
    original: content,
    parsed: processedContent
  });

  // Fix template literals syntax - add missing backticks around string templates
  processedContent = processedContent
    .replace(/=\s*Spins Left:\s*\$\{spinsLeft\}\s*\|\s*Score:\s*\$\{score\};/g, 
             '= `Spins Left: ${spinsLeft} | Score: ${score}`;')
    .replace(/=\s*Result:\s*\$\{winningSegment\.label\};/g, 
             '= `Result: ${winningSegment.label}`;')
    .replace(/\+=\s*\|\s*Game Over!\s*Final Score:\s*\$\{score\};/g, 
             '+= ` | Game Over! Final Score: ${score}`;')
    .replace(/=\s*rotate\(\$\{rotationAmount\}rad\);/g,
             '= `rotate(${rotationAmount}rad)`;')
    .replace(/=\s*rotate\(\$\{currentRotation\}rad\);/g,
             '= `rotate(${currentRotation}rad)`;');

  // Fix return statement not in function
  processedContent = processedContent.replace(
    /if \(!ctx\) \{ console\.error\('Canvas context not available'\); return; \}/g,
    'if (!ctx) { console.error(\'Canvas context not available\'); return; }'
  );

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
