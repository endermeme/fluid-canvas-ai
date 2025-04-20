
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

    return processedContent;
    
  } catch (error) {
    console.error('Error enhancing iframe content:', error);
    return htmlContent;
  }
};
