
import { GameSettingsData } from '../types';
import { getGameTypeByTopic } from '../gameTypes';
import { 
  logInfo, logError, logWarning, logSuccess, 
  measureExecutionTime
} from './apiUtils';
import { 
  GEMINI_MODELS, 
  API_VERSION, 
  getApiEndpoint,
  DEFAULT_GENERATION_SETTINGS 
} from '@/constants/api-constants';
import { createGameGenerationPrompt } from './geminiPrompt';
import type { MiniGame, GameApiResponse } from './types';

const SOURCE = "GEMINI";

// Export the MiniGame type for use in other files
export type { MiniGame } from './types';

// Tạo lớp AIGameGenerator để giữ tương thích với code cũ
export class AIGameGenerator {
  private static instance: AIGameGenerator | null = null;
  private canvasMode: boolean = true;

  private constructor() {}

  public static getInstance(): AIGameGenerator {
    if (!AIGameGenerator.instance) {
      AIGameGenerator.instance = new AIGameGenerator();
    }
    return AIGameGenerator.instance;
  }

  public setCanvasMode(mode: boolean): void {
    this.canvasMode = mode;
  }

  public async generateMiniGame(topic: string, settings?: GameSettingsData): Promise<MiniGame | null> {
    // Sử dụng biến canvasMode từ instance
    const useCanvasMode = settings?.useCanvas !== undefined ? settings.useCanvas : this.canvasMode;
    const updatedSettings = {
      ...settings,
      useCanvas: useCanvasMode
    };
    
    return tryGeminiGeneration(null, topic, updatedSettings);
  }
}

export const generateWithGemini = async (
  topic: string, 
  settings?: GameSettingsData
): Promise<MiniGame | null> => {
  const gameType = getGameTypeByTopic(topic);
  const useCanvas = settings?.useCanvas !== undefined ? settings.useCanvas : true;
  
  logInfo(SOURCE, `Starting game generation for "${topic}"`, {
    model: GEMINI_MODELS.CUSTOM_GAME,
    apiVersion: API_VERSION,
    type: gameType?.name || "Not specified",
    settings: settings || {},
    canvasMode: useCanvas ? "enabled" : "disabled"
  });

  // Tạo prompt với template cải tiến từ geminiPrompt.ts
  const prompt = createGameGenerationPrompt({
    topic,
    useCanvas,
    language: settings?.language || 'en',
    difficulty: settings?.difficulty || 'medium',
    category: settings?.category || 'general'
  });

  try {
    logInfo(SOURCE, `Sending request to Gemini API`);
    
    const startTime = Date.now();
    
    const payload = {
      contents: [{
        parts: [{text: prompt}]
      }],
      generationConfig: {
        ...DEFAULT_GENERATION_SETTINGS,
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192
      }
    };
    
    const response = await fetch(getApiEndpoint(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const result = await response.json();
    const text = result?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    if (!text) {
      throw new Error('No content returned from API');
    }
    
    const duration = measureExecutionTime(startTime);
    logSuccess(SOURCE, `Response received in ${duration.seconds}s`);
    
    // Tạo phiên bản gỡ lỗi để xem code gốc
    logInfo(SOURCE, `Generated Game Code (Original):`, text.substring(0, 500) + '...');
    
    // Xử lý code để extract thông tin và clean
    const { title, content } = processGameCode(text);
    
    // Tạo đối tượng game
    const game: MiniGame = {
      title: title || topic,
      content: content,
      useCanvas: useCanvas
    };
    
    logSuccess(SOURCE, "Game generated successfully", {
      title: game.title,
      contentLength: game.content.length,
      hasDocType: game.content.includes('<!DOCTYPE')
    });
    
    return game;
  } catch (error) {
    logError(SOURCE, "Error generating with Gemini", error);
    throw error;
  }
};

/**
 * Xử lý mã code trả về từ Gemini để extract thông tin và làm sạch
 */
const processGameCode = (text: string): { title: string, content: string } => {
  // Loại bỏ hoàn toàn cú pháp markdown nếu có
  let cleanedContent = text.trim();
  
  // 1. Phát hiện và xử lý nhiều định dạng khác nhau từ API
  
  // Xử lý mã trong khối markdown
  const codeBlockRegexes = [
    /^```(?:html|javascript|js|typescript|ts)?\s*([\s\S]*?)```$/m, // Khối code chuẩn
    /(<html[\s\S]*<\/html>)/i, // HTML đầy đủ
    /<!DOCTYPE\s+html[\s\S]*?>/i // Bắt đầu với DOCTYPE
  ];
  
  let extracted = false;
  
  for (const regex of codeBlockRegexes) {
    const match = cleanedContent.match(regex);
    if (match && match[1]) {
      cleanedContent = match[1].trim();
      extracted = true;
      break;
    }
  }
  
  // Nếu vẫn không tìm thấy khối code, thử tìm HTML inline
  if (!extracted) {
    // Xóa các dòng không liên quan đến mã HTML (như hướng dẫn, giải thích)
    const lines = cleanedContent.split('\n');
    const htmlLines = lines.filter(line => {
      const trimmed = line.trim();
      return trimmed.startsWith('<') || trimmed.includes('</') || 
             trimmed.includes('function') || trimmed.includes('const ') || 
             trimmed.includes('let ') || trimmed.includes('var ') ||
             trimmed.includes('style') || trimmed.includes('script');
    });
    
    if (htmlLines.length > 0) {
      cleanedContent = htmlLines.join('\n');
    }
  }
  
  // Loại bỏ các chú thích markdown và text không liên quan
  cleanedContent = cleanedContent
    .replace(/^(Here's|This is) (a|the) (complete|HTML|interactive) (code|game|implementation).*$/gim, '')
    .replace(/^I've created an interactive game.*$/gim, '')
    .replace(/^The game works as follows.*$/gim, '')
    .replace(/^Let me explain.*$/gim, '')
    .replace(/^```html|```javascript|```typescript|```$/gim, '')
    .trim();
  
  // 2. Đảm bảo code HTML đầy đủ và đúng cấu trúc
  const hasDoctype = cleanedContent.toLowerCase().includes('<!doctype html>') ||
                     cleanedContent.toLowerCase().includes('<!doctype');
  const hasHtmlTag = cleanedContent.toLowerCase().includes('<html');

  if (!hasDoctype && !hasHtmlTag) {
    // Tìm HTML trong văn bản nếu không có doctype
    const htmlPattern = /<html[\s\S]*?<\/html>/i;
    const htmlMatch = cleanedContent.match(htmlPattern);
    
    if (htmlMatch && htmlMatch[0]) {
      cleanedContent = `<!DOCTYPE html>\n${htmlMatch[0]}`;
    } else {
      // Nếu không có thẻ HTML đầy đủ, tìm body
      const bodyPattern = /<body[\s\S]*?<\/body>/i;
      const bodyMatch = cleanedContent.match(bodyPattern);
      
      if (bodyMatch && bodyMatch[0]) {
        cleanedContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${cleanedContent.match(/<title>(.*?)<\/title>/i)?.[1] || 'Interactive Game'}</title>
</head>
${bodyMatch[0]}
</html>`;
      } else {
        // Nếu không có body, bọc toàn bộ nội dung
        cleanedContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${cleanedContent.match(/<h1[^>]*>(.*?)<\/h1>/i)?.[1] || 'Interactive Game'}</title>
  <style>
    body { margin: 0; padding: 20px; font-family: sans-serif; }
    .container { max-width: 800px; margin: 0 auto; }
  </style>
</head>
<body>
  <div class="container">
    ${cleanedContent}
  </div>
</body>
</html>`;
      }
    }
  }
  
  // 3. Kiểm tra và sửa lỗi nếu không có thẻ head hoặc body
  if (!cleanedContent.toLowerCase().includes('<head>')) {
    const htmlOpenPos = cleanedContent.toLowerCase().indexOf('<html');
    if (htmlOpenPos !== -1) {
      const afterHtmlTagPos = cleanedContent.indexOf('>', htmlOpenPos) + 1;
      cleanedContent = cleanedContent.substring(0, afterHtmlTagPos) + 
        '\n<head><meta charset="UTF-8"><title>Interactive Game</title></head>\n' +
        cleanedContent.substring(afterHtmlTagPos);
    }
  }
  
  if (!cleanedContent.toLowerCase().includes('<body>')) {
    const headClosePos = cleanedContent.toLowerCase().indexOf('</head>');
    if (headClosePos !== -1) {
      const afterHeadPos = headClosePos + 7;
      cleanedContent = cleanedContent.substring(0, afterHeadPos) + 
        '\n<body>\n<div class="container">' +
        cleanedContent.substring(afterHeadPos);
      
      // Thêm đóng thẻ body nếu cần
      if (!cleanedContent.toLowerCase().includes('</body>')) {
        const htmlClosePos = cleanedContent.toLowerCase().indexOf('</html>');
        if (htmlClosePos !== -1) {
          cleanedContent = cleanedContent.substring(0, htmlClosePos) + 
            '\n</div>\n</body>\n' + cleanedContent.substring(htmlClosePos);
        } else {
          cleanedContent += '\n</div>\n</body>\n</html>';
        }
      }
    }
  }
  
  // 4. Sửa các lỗi cú pháp JavaScript phổ biến
  let sanitized = cleanedContent;
  
  // Sửa các template literals bị lỗi
  sanitized = sanitized.replace(/(\w+\.(?:style\.transform|innerHTML|textContent|innerText)\s*=\s*)(['"])?([^'"`;]*)\$\{([^}]+)\}([^'"`;]*)(['"])?;?/g, 
    (match, prefix, openQuote, before, expr, after, closeQuote) => {
      // Nếu đã có backticks thì giữ nguyên
      if (!openQuote && !closeQuote) return match;
      
      // Thay thế quotes bằng backticks
      return `${prefix}\`${before}\${${expr}}${after}\`;`;
    });
  
  // Sửa các template literals không đúng
  sanitized = sanitized.replace(/(\w+\.(?:style\.transform|innerHTML|textContent|innerText)\s*=\s*)(['"])([^'"]*)\${([^}]+)}([^'"]*)(['"])/g,
    (match, prefix, openQuote, before, expr, after, closeQuote) => {
      return `${prefix}\`${before}\${${expr}}${after}\``;
    });
  
  // Sửa các function declarations bị lỗi tham số
  sanitized = sanitized.replace(/function\s+(\w+)\s*\(\$(\d+)\)/g, (match, funcName, paramNum) => {
    const paramNames = {
      'drawSegment': 'index',
      'getWinningSegment': 'finalAngle',
      'spinWheel': '',
      'drawWheel': '',
      'updateScore': 'points',
      'checkAnswer': 'selectedOption',
      'startGame': '',
      'endGame': '',
      'resetGame': '',
    };
    
    if (paramNames.hasOwnProperty(funcName)) {
      return `function ${funcName}(${paramNames[funcName]})`;
    }
    
    // Nếu không có trong danh sách, thay thế bằng param + số
    return `function ${funcName}(param${paramNum})`;
  });
  
  // 5. Đảm bảo xử lý lỗi cho canvas
  if (sanitized.includes('getContext') && !sanitized.includes('if (!ctx)')) {
    sanitized = sanitized.replace(
      /const\s+ctx\s*=\s*canvas\.getContext\(['"]2d['"]\);/g,
      "const ctx = canvas.getContext('2d');\n  if (!ctx) { console.error('Canvas context not available'); return; }"
    );
  }
  
  // 6. Đảm bảo có thẻ đóng script nếu có mở
  const scriptOpenTags = (sanitized.match(/<script/g) || []).length;
  const scriptCloseTags = (sanitized.match(/<\/script>/g) || []).length;
  
  if (scriptOpenTags > scriptCloseTags) {
    // Thêm thẻ đóng script nếu thiếu
    for (let i = 0; i < scriptOpenTags - scriptCloseTags; i++) {
      if (sanitized.toLowerCase().includes('</body>')) {
        sanitized = sanitized.replace('</body>', '</script>\n</body>');
      } else if (sanitized.toLowerCase().includes('</html>')) {
        sanitized = sanitized.replace('</html>', '</script>\n</html>');
      } else {
        sanitized += '\n</script>';
      }
    }
  }
  
  // 7. Đảm bảo tất cả CSS được đặt trong thẻ <style>
  const cssBlockMatch = sanitized.match(/\/\*\s*CSS\s*\*\/([\s\S]*?)\/\*\s*End CSS\s*\*\//i);
  if (cssBlockMatch && cssBlockMatch[1] && !cssBlockMatch[0].includes('<style>')) {
    const cssContent = cssBlockMatch[1].trim();
    sanitized = sanitized.replace(
      cssBlockMatch[0],
      `<style>\n${cssContent}\n</style>`
    );
  }
  
  // 8. Thêm xử lý lỗi window.onerror nếu chưa có
  if (!sanitized.includes('window.onerror')) {
    const errorHandlingScript = `
  <script>
    window.onerror = (message, source, lineno, colno, error) => {
      console.error('Game error:', { message, source, lineno, colno, stack: error?.stack });
      return true;
    };
  </script>`;
    
    if (sanitized.includes('</body>')) {
      sanitized = sanitized.replace('</body>', `${errorHandlingScript}\n</body>`);
    } else if (sanitized.includes('</html>')) {
      sanitized = sanitized.replace('</html>', `${errorHandlingScript}\n</html>`);
    }
  }
  
  // 9. Extract title
  let title = '';
  const titleTag = sanitized.match(/<title>(.*?)<\/title>/is);
  if (titleTag && titleTag[1]) {
    title = titleTag[1].trim();
  } else {
    const h1Tag = sanitized.match(/<h1[^>]*>(.*?)<\/h1>/is);
    if (h1Tag && h1Tag[1]) {
      title = h1Tag[1].replace(/<[^>]*>/g, '').trim();
    }
  }
  
  // 10. Kiểm tra và sửa lỗi DOCTYPE không đúng
  if (!sanitized.toLowerCase().includes('<!doctype html>') && 
      !sanitized.toLowerCase().includes('<!doctype')) {
    sanitized = `<!DOCTYPE html>\n${sanitized}`;
  }

  // 11. Đảm bảo có thẻ html, head và body nếu chưa có
  if (!sanitized.toLowerCase().includes('<html')) {
    sanitized = sanitized.replace('<!DOCTYPE html>', '<!DOCTYPE html>\n<html lang="en">');
    sanitized += '\n</html>';
  }
  
  // 12. Sửa lỗi chữ bị lật ngược và CSS không đúng
  sanitized = fixTextDirectionAndCSS(sanitized);
  
  return {
    title,
    content: sanitized
  };
};

/**
 * Sửa lỗi chữ bị lật ngược và CSS không đúng
 */
const fixTextDirectionAndCSS = (content: string): string => {
  let fixedContent = content;
  
  // 1. Thêm direction và rtl CSS để đảm bảo văn bản hiển thị đúng
  if (!content.includes('direction:') && !content.includes('direction=')) {
    // Thêm CSS để đảm bảo chữ không bị lật ngược
    const directionCSS = `
    * {
      direction: ltr;
      text-align: initial;
    }
    [dir="rtl"] {
      direction: rtl;
    }
    `;
    
    // Chèn CSS vào thẻ style nếu có
    if (content.includes('</style>')) {
      fixedContent = fixedContent.replace('</style>', `${directionCSS}\n</style>`);
    } else if (content.includes('</head>')) {
      fixedContent = fixedContent.replace('</head>', `<style>${directionCSS}</style>\n</head>`);
    }
  }
  
  // 2. Sửa các thuộc tính transform có thể gây lật ngược
  fixedContent = fixedContent.replace(/transform\s*:\s*scaleX\(-1\)/g, 'transform: scaleX(1)');
  
  // 3. Sửa lỗi thanh CSS với overflow gây lỗi layout
  fixedContent = fixedContent.replace(/overflow\s*:\s*hidden;/g, 'overflow: auto;');
  
  // 4. Sửa lỗi font-size quá nhỏ
  fixedContent = fixedContent.replace(/font-size\s*:\s*([0-9.]+)px/g, (match, size) => {
    const fontSize = parseFloat(size);
    if (fontSize < 12) {
      return `font-size: ${Math.max(12, fontSize)}px`;
    }
    return match;
  });
  
  // 5. Đảm bảo các phần tử control đủ lớn cho mobile
  fixedContent = fixedContent.replace(/(\.|#)([a-zA-Z0-9_-]+)(\s*\{[^}]*?)(width\s*:\s*)([0-9.]+)(px)([^}]*?\})/g, 
    (match, prefix, className, beforeWidth, widthDecl, widthVal, unit, afterWidth) => {
      if (className.includes('button') || className.includes('btn') || className.includes('control')) {
        const width = parseFloat(widthVal);
        if (width < 44) {
          return `${prefix}${className}${beforeWidth}${widthDecl}${Math.max(44, width)}${unit}${afterWidth}`;
        }
      }
      return match;
    });
  
  // 6. Thêm meta viewport nếu chưa có
  if (!fixedContent.includes('viewport')) {
    const metaViewport = '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">';
    
    if (fixedContent.includes('</head>')) {
      fixedContent = fixedContent.replace('</head>', `${metaViewport}\n</head>`);
    } else if (fixedContent.includes('<head>')) {
      fixedContent = fixedContent.replace('<head>', `<head>\n${metaViewport}`);
    }
  }
  
  // 7. Sửa các thuộc tính position có thể gây lỗi hiển thị
  fixedContent = fixedContent.replace(/position\s*:\s*absolute\s*;/g, 'position: absolute; z-index: 1;');
  
  return fixedContent;
};

export const tryGeminiGeneration = async (
  model: any,
  topic: string, 
  settings?: GameSettingsData,
  retryCount = 0
): Promise<MiniGame | null> => {
  const maxRetries = 3;
  
  if (retryCount >= maxRetries) {
    logWarning(SOURCE, `Reached maximum retries (${maxRetries})`);
    return null;
  }
  
  try {
    return await generateWithGemini(topic, settings);
  } catch (error) {
    logError(SOURCE, `Attempt ${retryCount + 1} failed`, error);
    
    const waitTime = (retryCount + 1) * 1500;
    await new Promise(resolve => setTimeout(resolve, waitTime));
    
    return tryGeminiGeneration(null, topic, settings, retryCount + 1);
  }
};

