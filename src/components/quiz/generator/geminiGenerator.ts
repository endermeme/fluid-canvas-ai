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

// Default fallback image placeholders
const FALLBACK_IMAGE_PLACEHOLDERS = [
  'https://placehold.co/200x200/orange/white?text=Fallback1',
  'https://placehold.co/200x200/blue/white?text=Fallback2',
  'https://placehold.co/200x200/green/white?text=Fallback3',
  'https://placehold.co/200x200/red/white?text=Fallback4',
  'https://placehold.co/200x200/purple/white?text=Fallback5'
];

// Minimal valid transparent 1x1 png base64
const MINIMAL_VALID_BASE64_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';

// Valid small colored 20x20 images for fallback
const VALID_COLOR_BASE64_IMAGES = [
  // Red
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAAABh0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMC45bDN+TgAAAD1JREFUOhFjYBgFoyEwkCHw//9/ByD+D8XgMI0q0PDPP9gNBOFRF4LTIhpATEwMONwGTZgOBIPCI6oAAI/KEXhEr9TSAAAAAElFTkSuQmCC',
  // Blue
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAAABh0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMC45bDN+TgAAAD1JREFUOhFjYBgFoyEw+EPg////HID4PxSDwzSqQMM//2A3EIRHXYS+aYmJiQGH26AJ00FgUHhEWQAAj8oReK6e9hQAAAAASUVORK5CYII=',
  // Green
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAAABh0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMC45bDN+TgAAAD1JREFUOhFjYBgFoyEwdELg////HID4PxSDwzSqQMM//2A3EIRHXYT2aYmJiQGH26AJ00FgUHhE2QAAT8oReOArXHIAAAAASUVORK5CYII=',
  // Yellow
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAAABh0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMC45bDN+TgAAAD1JREFUOhFjYBgFoyEwdEPg////HID4PxSDwzSqQMM//2A3EIRHXYR+aYmJiQGH26AJ00FgUHhE2QYAT8oReBCQ5N4AAAAASUVORK5CYII=',
  // Purple 
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAAABh0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMC45bDN+TgAAAD1JREFUOhFjYBgFoyEw9EPg////HID4PxSDwzSqQMM//2A3EIRHXYR+aYmJiQGH26AJ00FgUHhEWQMAAMoReBYyLYUAAAAASUVORK5CYII='
];

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
 * Kiểm tra xem một chuỗi base64 có hợp lệ hay không
 * @param base64String Chuỗi base64 cần kiểm tra
 * @returns true nếu hợp lệ, false nếu không hợp lệ
 */
const isValidBase64 = (base64String: string): boolean => {
  if (!base64String) return false;
  
  // Kiểm tra định dạng data URL
  if (base64String.startsWith('data:image/')) {
    // Tách phần base64 từ data URL
    const base64Part = base64String.split(',')[1];
    if (!base64Part) return false;
    
    // Kiểm tra định dạng base64 (chỉ chứa ký tự base64 hợp lệ)
    const validBase64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
    return validBase64Regex.test(base64Part);
  }
  
  // Nếu không phải data URL, kiểm tra chuỗi base64 thuần túy
  const validBase64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
  return validBase64Regex.test(base64String);
};

/**
 * Sửa và thay thế chuỗi base64 không hợp lệ
 * @param content HTML content cần xử lý
 * @returns HTML content sau khi đã sửa các base64
 */
const fixBase64Images = (content: string): string => {
  let fixedContent = content;
  
  // Tìm tất cả data URL trong HTML
  const dataUrlRegex = /("data:image\/[^"]+base64,[^"]+"|'data:image\/[^']+base64,[^']+')/g;
  let match;
  let index = 0;
  
  while ((match = dataUrlRegex.exec(content)) !== null) {
    const dataUrl = match[0].slice(1, -1); // Loại bỏ dấu ngoặc kép hoặc đơn
    
    if (!isValidBase64(dataUrl)) {
      // Thay thế bằng ảnh hợp lệ
      const replacement = VALID_COLOR_BASE64_IMAGES[index % VALID_COLOR_BASE64_IMAGES.length];
      fixedContent = fixedContent.replace(dataUrl, replacement);
      index++;
    }
  }
  
  // Tìm tất cả mảng gameData hoặc mảng dữ liệu chứa base64
  const fixGameDataArrays = (htmlContent: string): string => {
    // Tìm các biến mảng như gameData, quizData, etc.
    const arrayDefinitionRegex = /(const|let|var)\s+(\w+(?:Data|Items|Questions|Images))\s*=\s*\[([\s\S]*?)\];/g;
    
    return htmlContent.replace(arrayDefinitionRegex, (match, declarationType, arrayName, arrayContent) => {
      // Xử lý từng mục trong mảng
      const fixedArrayContent = arrayContent.replace(/({[\s\S]*?imageSrc\s*:\s*)(['"]data:image\/[^'"]+['"])/g, 
        (itemMatch, prefix, base64) => {
          const dataUrl = base64.slice(1, -1); // Bỏ dấu ngoặc
          
          if (!isValidBase64(dataUrl)) {
            // Tạo fallback phù hợp
            const replacementImg = VALID_COLOR_BASE64_IMAGES[Math.floor(Math.random() * VALID_COLOR_BASE64_IMAGES.length)];
            return `${prefix}'${replacementImg}', fallbackSrc: '${FALLBACK_IMAGE_PLACEHOLDERS[Math.floor(Math.random() * FALLBACK_IMAGE_PLACEHOLDERS.length)]}'`;
          }
          
          // Nếu base64 hợp lệ nhưng không có fallbackSrc
          if (!itemMatch.includes('fallbackSrc')) {
            return `${prefix}${base64}, fallbackSrc: '${FALLBACK_IMAGE_PLACEHOLDERS[Math.floor(Math.random() * FALLBACK_IMAGE_PLACEHOLDERS.length)]}'`;
          }
          
          return itemMatch;
        });
      
      return `${declarationType} ${arrayName} = [${fixedArrayContent}];`;
    });
  };
  
  // Thêm xử lý onerror cho tất cả thẻ img
  const addErrorHandlingToImages = (htmlContent: string): string => {
    return htmlContent.replace(/<img([^>]*)src=['"]([^'"]+)['"]([^>]*)>/gi, (match, before, src, after) => {
      if (match.includes('onerror=')) {
        return match; // Đã có onerror, giữ nguyên
      }
      
      // Thêm thuộc tính onerror với fallback
      const fallback = FALLBACK_IMAGE_PLACEHOLDERS[Math.floor(Math.random() * FALLBACK_IMAGE_PLACEHOLDERS.length)];
      return `<img${before}src="${src}"${after} onerror="this.onerror=null; this.src='${fallback}';">`;
    });
  };
  
  // Áp dụng các sửa đổi
  fixedContent = fixGameDataArrays(fixedContent);
  fixedContent = addErrorHandlingToImages(fixedContent);
  
  return fixedContent;
};

/**
 * Xử lý mã code trả về từ Gemini để extract thông tin và làm sạch
 */
const processGameCode = (text: string): { title: string, content: string } => {
  // Loại bỏ hoàn toàn cú pháp markdown nếu có
  let cleanedContent = text.trim();
  
  // 1. Loại bỏ markdown code block syntax
  const codeBlockRegex = /^```(?:html|javascript)?\s*([\s\S]*?)```$/;
  const codeBlockMatch = cleanedContent.match(codeBlockRegex);
  
  if (codeBlockMatch && codeBlockMatch[1]) {
    cleanedContent = codeBlockMatch[1].trim();
  } else {
    // Nếu không tìm thấy, vẫn xóa các dấu hiệu markdown
    cleanedContent = cleanedContent.replace(/```html|```javascript|```/g, '').trim();
  }
  
  // 2. Đảm bảo code HTML đầy đủ và đúng cấu trúc
  if (!cleanedContent.toLowerCase().includes('<!doctype html>') && 
      !cleanedContent.toLowerCase().startsWith('<html') &&
      !cleanedContent.toLowerCase().startsWith('<!--')) {
    // Tìm HTML trong văn bản nếu không có doctype
    const htmlPattern = /<html[\s\S]*?<\/html>/i;
    const htmlMatch = cleanedContent.match(htmlPattern);
    
    if (htmlMatch && htmlMatch[0]) {
      cleanedContent = `<!DOCTYPE html>\n${htmlMatch[0]}`;
    } else {
      // Nếu không có thẻ HTML đầy đủ, bọc nội dung lại
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
  <script>
    // Console error catching
    window.onerror = (msg, src, line, col, err) => {
      console.error('Game error:', msg, 'at', line, ':', col);
      return true;
    }
  </script>
</body>
</html>`;
    }
  }
  
  // 3. Sửa các lỗi cú pháp JavaScript phổ biến
  let sanitized = cleanedContent;
  
  // Sửa các template literals bị lỗi - ghi đè bằng regexp phức tạp hơn
  sanitized = sanitized.replace(/(\w+\.(?:style\.transform|innerHTML|textContent|innerText)\s*=\s*)(['"])?([^'"`;]*)\$\{([^}]+)\}([^'"`;]*)(['"])?;?/g, 
    (match, prefix, openQuote, before, expr, after, closeQuote) => {
      // Nếu đã có backticks thì giữ nguyên
      if (!openQuote && !closeQuote) return match;
      
      // Thay thế quotes bằng backticks
      return `${prefix}\`${before}\${${expr}}${after}\`;`;
    });
  
  // Sửa các tham số hàm bị lỗi
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
    
    if (Object.prototype.hasOwnProperty.call(paramNames, funcName)) {
      return `function ${funcName}(${paramNames[funcName]})`;
    }
    
    // Nếu không có trong danh sách, thay thế bằng param + số
    return `function ${funcName}(param${paramNum})`;
  });
  
  // 4. Đảm bảo xử lý lỗi cho canvas
  if (sanitized.includes('getContext') && !sanitized.includes('if (!ctx)')) {
    sanitized = sanitized.replace(
      /const\s+ctx\s*=\s*canvas\.getContext\(['"]2d['"]\);/g,
      "const ctx = canvas.getContext('2d');\n  if (!ctx) { console.error('Canvas context not available'); return; }"
    );
  }
  
  // 5. Đảm bảo tất cả CSS được đặt trong thẻ <style>
  const cssBlockMatch = sanitized.match(/\/\*\s*CSS\s*\*\/([\s\S]*?)\/\*\s*End CSS\s*\*\//i);
  if (cssBlockMatch && cssBlockMatch[1] && !cssBlockMatch[0].includes('<style>')) {
    const cssContent = cssBlockMatch[1].trim();
    sanitized = sanitized.replace(
      cssBlockMatch[0],
      `<style>\n${cssContent}\n</style>`
    );
  }
  
  // 6. Thêm xử lý lỗi window.onerror nếu chưa có
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
  
  // 7. Sửa và thay thế base64 không hợp lệ
  sanitized = fixBase64Images(sanitized);
  
  // 8. Extract title
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
  
  return {
    title,
    content: sanitized
  };
};

export const tryGeminiGeneration = async (
  model: unknown,
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
