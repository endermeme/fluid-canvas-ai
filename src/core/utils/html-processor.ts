
/**
 * HTML Processing utilities
 */

/**
 * Format and normalize HTML
 */
export const formatHtml = (html: string): string => {
  if (!html) return '';
  
  try {
    // Clean HTML content thoroughly
    let cleanHtml = html
      .replace(/```html|```css|```javascript|```js|```/g, '')  // Remove all code block markers
      .replace(/`/g, '')  // Remove single backticks
      .trim();  // Trim excess whitespace

    // Add DOCTYPE and HTML structure if missing
    if (!cleanHtml.includes('<!DOCTYPE html>')) {
      if (cleanHtml.includes('<html')) {
        cleanHtml = `<!DOCTYPE html>${cleanHtml}`;
      } else {
        cleanHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Interactive Game</title>
</head>
<body>
  ${cleanHtml}
</body>
</html>`;
      }
    }
    
    return cleanHtml;
  } catch (error) {
    console.error('Error formatting HTML:', error);
    return html;
  }
};

/**
 * Validate HTML structure has all necessary tags
 */
export const validateHtmlStructure = (html: string): boolean => {
  const requiredTags = ['<!DOCTYPE html>', '<html', '<head>', '<body>'];
  return requiredTags.every(tag => html.includes(tag));
};

/**
 * Enhance HTML with metadata and viewport
 */
export const enhanceHtml = (html: string, title: string = 'Interactive Game'): string => {
  // Add metadata if missing
  if (!html.includes('<meta name="viewport"')) {
    html = html.replace('</head>', `  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n</head>`);
  }
  
  // Add title if missing
  if (!html.includes('<title>')) {
    html = html.replace('</head>', `  <title>${title}</title>\n</head>`);
  }
  
  return html;
};

/**
 * Remove all Markdown from string
 */
export const removeMarkdown = (text: string): string => {
  if (!text) return '';
  
  return text
    .replace(/```(html|css|javascript|js)?([\s\S]*?)```/g, '$2')  // Remove code blocks with language name
    .replace(/`([^`]+)`/g, '$1')  // Remove inline code
    .replace(/\*\*([^*]+)\*\*/g, '$1')  // Remove bold
    .replace(/\*([^*]+)\*/g, '$1')  // Remove italic
    .replace(/#{1,6}\s+([^\n]+)/g, '$1')  // Remove headings
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')  // Remove links
    .replace(/>\s*([^\n]+)/g, '$1')  // Remove blockquotes
    .replace(/- ([^\n]+)/g, '$1')  // Remove unordered lists
    .replace(/\d+\.\s+([^\n]+)/g, '$1')  // Remove ordered lists
    .trim();
};

/**
 * Extract title from HTML
 */
export const extractTitle = (html: string): string | null => {
  // Look in title tag
  const titleMatch = html.match(/<title>(.*?)<\/title>/i);
  if (titleMatch && titleMatch[1]) {
    return titleMatch[1].trim();
  }
  
  // Or look in first h1
  const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
  if (h1Match && h1Match[1]) {
    return h1Match[1].replace(/<[^>]*>/g, '').trim(); // Remove any HTML tags inside h1
  }
  
  return null;
};
