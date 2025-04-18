
/**
 * Utilities for parsing game content
 */

interface GameStructure {
  html: string;
  css: string;
  javascript: string;
  meta?: {
    title?: string;
    description?: string;
    viewport?: string;
  };
}

/**
 * Parses content as JSON game structure
 */
export const parseJsonContent = (content: string): GameStructure | null => {
  try {
    const gameStructure = JSON.parse(content);
    if (gameStructure.html && gameStructure.css && gameStructure.javascript) {
      return gameStructure;
    }
  } catch (e) {
    console.log('Content is not in JSON format');
  }
  return null;
};

/**
 * Parses content as markdown-style blocks
 */
export const parseMarkdownContent = (content: string): GameStructure | null => {
  try {
    const hasCssSection = content.includes('css ');
    const hasJsSection = content.includes('js ');
    
    let htmlContent = content;
    let cssContent = '';
    let jsContent = '';
    
    if (hasCssSection || hasJsSection) {
      const sections = content.split(/\s*(css|js)\s+/);
      
      if (sections.length >= 1) {
        htmlContent = sections[0].trim();
      }
      
      for (let i = 1; i < sections.length; i += 2) {
        if (i + 1 < sections.length) {
          if (sections[i] === 'css') {
            cssContent = sections[i + 1].trim();
          } else if (sections[i] === 'js') {
            jsContent = sections[i + 1].trim();
          }
        }
      }
      
      return {
        html: htmlContent,
        css: cssContent,
        javascript: jsContent
      };
    }
  } catch (e) {
    console.error('Error parsing markdown content:', e);
  }
  return null;
};
