
import { debugLog } from '@/utils/debug-utils';

export const enhanceIframeContent = (content: string, title?: string): string => {
  // Remove markdown code block syntax and backticks
  let processedContent = content.replace(/```html|```/g, '').replace(/`/g, '');
  
  debugLog('iframe-utils.ts', {
    original: content,
    parsed: processedContent
  });

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
