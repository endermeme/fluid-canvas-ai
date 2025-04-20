
/**
 * Utility function for enhancing iframe content
 * Simplified version that does minimal processing
 */
export const enhanceIframeContent = (htmlContent: string, title?: string): string => {
  if (!htmlContent) return '';
  
  try {
    // Add title if provided
    if (title) {
      htmlContent = htmlContent.replace(/<title>.*?<\/title>/i, `<title>${title}</title>`);
      if (!htmlContent.includes('<title>')) {
        htmlContent = htmlContent.replace(/<head>/i, `<head>\n  <title>${title}</title>`);
      }
    }
    
    // Add error handling script
    if (!htmlContent.includes('window.onerror')) {
      const errorScript = `
  <script>
    window.onerror = (message, source, lineno, colno, error) => {
      console.error('Game error:', { message, source, lineno, colno, stack: error?.stack });
      return true;
    };
  </script>`;
      
      htmlContent = htmlContent.replace('</body>', `${errorScript}\n</body>`);
    }
    
    return htmlContent;
  } catch (error) {
    console.error('Error enhancing iframe content:', error);
    return htmlContent;
  }
};

