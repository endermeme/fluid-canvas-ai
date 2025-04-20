
/**
 * Utility function for enhancing iframe content
 */
export const enhanceIframeContent = (htmlContent: string, title?: string): string => {
  if (!htmlContent) return '';
  
  try {
    const cleanedContent = htmlContent
      .replace(/```(html|css|javascript)?/g, '')  
      .replace(/`{1,3}/g, '')                    
      .replace(/\*\*/g, '')                      
      .replace(/\\n/g, '\n')                     
      .replace(/^> /gm, '')                      
      .trim();

    let processedContent = cleanedContent;
    
    // Add title if provided
    if (title) {
      processedContent = processedContent.replace(/<title>.*?<\/title>/i, `<title>${title}</title>`);
      if (!processedContent.includes('<title>')) {
        processedContent = processedContent.replace(/<head>/i, `<head>\n  <title>${title}</title>`);
      }
    }

    // Add error handling script
    if (!processedContent.includes('window.onerror')) {
      const errorScript = `
  <script>
    window.onerror = (message, source, lineno, colno, error) => {
      console.error('Game error:', { message, source, lineno, colno, stack: error?.stack });
      return true;
    };
    
    // API để giao tiếp với game container
    window.reportGameStats = (stats) => {
      window.parent.postMessage({
        type: 'gameStats',
        payload: stats
      }, '*');
    };
  </script>`;
      
      processedContent = processedContent.replace('</body>', `${errorScript}\n</body>`);
    }

    return processedContent;
    
  } catch (error) {
    console.error('Error enhancing iframe content:', error);
    return htmlContent;
  }
};
