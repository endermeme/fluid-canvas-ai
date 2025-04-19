
export const formatHtml = (html: string): string => {
  if (!html) return '';
  
  try {
    // Clean HTML content
    let cleanHtml = html
      .replace(/```html|```/g, '')
      .replace(/`/g, '');

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

export const validateHtmlStructure = (html: string): boolean => {
  const requiredTags = ['<!DOCTYPE html>', '<html', '<head>', '<body>'];
  return requiredTags.every(tag => html.includes(tag));
};
