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
import { parseCodeBlocks, ParsedCode } from './code-block-parser';

export const parseMarkdownContent = (content: string): GameStructure | null => {
  try {
    const parsedCode: ParsedCode = parseCodeBlocks(content);
    
    if (parsedCode.html || parsedCode.css || parsedCode.javascript) {
      return {
        html: parsedCode.html,
        css: parsedCode.css,
        javascript: parsedCode.javascript,
        meta: {
          title: parsedCode.title,
          description: parsedCode.description
        }
      };
    }
  } catch (e) {
    console.error('Error parsing markdown content:', e);
  }
  return null;
};
