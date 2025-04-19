
import fs from 'fs';
import path from 'path';

/**
 * Gets the HTML content of the iframe demo file
 * @returns HTML content as string
 */
export function getIframeDemo(): string {
  try {
    // Path to the HTML demo file
    const filePath = path.join(process.cwd(), 'src/components/quiz/demo/iframe-test.html');
    
    // Read file content
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    return fileContent;
  } catch (error) {
    console.error('Error reading demo file:', error);
    return '<div>Error loading demo content</div>';
  }
}
