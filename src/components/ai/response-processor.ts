
export class ResponseProcessor {
  static processGameResponse(rawResponse: string): string {
    let processed = rawResponse;
    
    // Loại bỏ markdown formatting
    processed = this.removeMarkdownFormatting(processed);
    
    // Xử lý HTML structure
    processed = this.fixHtmlStructure(processed);
    
    // Enhance với mobile optimization
    processed = this.addMobileOptimization(processed);
    
    // Thêm error handling
    processed = this.addErrorHandling(processed);
    
    return processed;
  }

  private static removeMarkdownFormatting(content: string): string {
    return content
      .replace(/```html\s*/g, '')
      .replace(/```javascript\s*/g, '')
      .replace(/```css\s*/g, '')
      .replace(/```\s*/g, '')
      .replace(/^\s*html\s*/gm, '')
      .trim();
  }

  private static fixHtmlStructure(content: string): string {
    // Đảm bảo có DOCTYPE
    if (!content.includes('<!DOCTYPE')) {
      content = '<!DOCTYPE html>\n' + content;
    }
    
    // Đảm bảo có meta viewport
    if (!content.includes('viewport')) {
      content = content.replace(
        '<head>',
        '<head>\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">'
      );
    }
    
    return content;
  }

  private static addMobileOptimization(content: string): string {
    // Thêm CSS cho mobile nếu chưa có
    const mobileCSS = `
      @media (max-width: 768px) {
        body { font-size: 14px; margin: 0; padding: 10px; }
        canvas { max-width: 100%; height: auto; }
        button { min-height: 44px; font-size: 16px; }
      }
    `;
    
    if (!content.includes('@media') && content.includes('</style>')) {
      content = content.replace('</style>', mobileCSS + '\n    </style>');
    }
    
    return content;
  }

  private static addErrorHandling(content: string): string {
    // Thêm basic error handling cho JavaScript
    const errorHandler = `
      window.onerror = function(msg, url, line, col, error) {
        console.log('Game Error:', msg, 'at line', line);
        return false;
      };
    `;
    
    if (content.includes('<script>') && !content.includes('window.onerror')) {
      content = content.replace('<script>', '<script>\n    ' + errorHandler);
    }
    
    return content;
  }

  static validateGameContent(content: string): boolean {
    const required = ['<html', '<head', '<body', '<script'];
    return required.every(tag => content.includes(tag));
  }

  static extractGameTitle(content: string): string {
    const titleMatch = content.match(/<title>(.*?)<\/title>/i);
    return titleMatch ? titleMatch[1] : 'Game Tương Tác';
  }
}
