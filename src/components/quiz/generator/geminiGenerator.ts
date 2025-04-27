
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
import { buildGeminiPrompt } from './promptBuilder';
import { generateCustomGamePrompt } from './customGamePrompt';
import type { MiniGame, GameApiResponse } from './types';

const SOURCE = "GEMINI";

export type { MiniGame } from './types';

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
    const useCanvasMode = settings?.useCanvas !== undefined ? settings.useCanvas : this.canvasMode;
    const updatedSettings = {
      ...settings,
      useCanvas: useCanvasMode
    };
    
    return tryGeminiGeneration(null, topic, updatedSettings);
  }
}

// Hàm phân tích và tách mã HTML thành các thành phần riêng biệt
const extractComponents = (htmlContent: string) => {
  const htmlDoc = document.createElement('div');
  htmlDoc.innerHTML = htmlContent;
  
  // Tách CSS
  let cssContent = '';
  const styleElements = htmlDoc.querySelectorAll('style');
  styleElements.forEach(style => {
    cssContent += style.innerHTML;
    style.remove();
  });
  
  // Tách JavaScript
  let jsContent = '';
  const scriptElements = htmlDoc.querySelectorAll('script');
  scriptElements.forEach(script => {
    jsContent += script.innerHTML;
    script.remove();
  });
  
  // Phần HTML còn lại
  const htmlPart = htmlDoc.innerHTML;
  
  return {
    html: htmlPart,
    css: cssContent,
    js: jsContent
  };
};

// Đơn giản hóa hàm tạo game, tập trung vào việc lấy mã HTML nguyên bản từ API
export const generateWithGemini = async (
  topic: string, 
  settings?: GameSettingsData
): Promise<MiniGame | null> => {
  const gameType = getGameTypeByTopic(topic);
  const useCanvas = settings?.useCanvas !== undefined ? settings.useCanvas : true;
  
  console.log(`%c🎮 Bắt đầu tạo game: "${topic}" %c(${useCanvas ? 'sử dụng Canvas' : 'không sử dụng Canvas'})`,
    'font-weight: bold; color: #4C75F2;', 'font-weight: normal; color: #718096;');

  // Tạo prompt đơn giản hơn
  const promptOptions = {
    topic,
    useCanvas,
    language: settings?.language || 'vi',
    difficulty: settings?.difficulty || 'medium',
    category: settings?.category || 'general'
  };

  const prompt = generateCustomGamePrompt(promptOptions);

  try {
    console.log('🌐 Đang gọi API Gemini...');
    
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
      throw new Error('Không nhận được nội dung từ API');
    }
    
    const duration = measureExecutionTime(startTime);
    console.log(`%c✅ Nhận phản hồi sau ${duration.seconds}s`, 'color: #10B981; font-weight: bold;');
    
    // Lấy nội dung HTML từ phản hồi API
    let content = extractHTMLFromResponse(text);
    let title = extractGameTitleFromContent(content, topic);
    
    // Tách các thành phần
    const components = extractComponents(content);
    
    const game: MiniGame = {
      title: title,
      content: content,
      html: components.html,
      css: components.css,
      js: components.js,
      useCanvas: useCanvas
    };
    
    console.log('%c🎯 Game đã được tạo thành công', 'color: #10B981; font-weight: bold;');
    
    return game;
  } catch (error) {
    console.error('🔴 Lỗi khi tạo game với Gemini:', error);
    throw error;
  }
};

// Hàm đơn giản để trích xuất mã HTML từ phản hồi API
const extractHTMLFromResponse = (text: string): string => {
  // Loại bỏ các dấu markdown nếu có
  let content = text.trim();
  
  // Loại bỏ backticks và nhãn html nếu có
  content = content.replace(/```html|```/g, '').trim();
  
  // Tìm mã HTML trong phản hồi nếu chưa đúng định dạng
  if (!content.startsWith('<!DOCTYPE') && !content.startsWith('<html')) {
    const htmlMatch = text.match(/<!DOCTYPE[\s\S]*<\/html>/i) || 
                     text.match(/<html[\s\S]*<\/html>/i);
    
    if (htmlMatch && htmlMatch[0]) {
      content = htmlMatch[0];
    } else {
      // Bao bọc nội dung trong thẻ HTML nếu cần
      content = `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <title>Game: ${text.substring(0, 30)}...</title>
    <style>
      * { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
      body { font-family: system-ui, sans-serif; }
    </style>
</head>
<body>
    ${content}
    <script>
      // Cải thiện hiệu suất touch trên thiết bị di động
      document.addEventListener('touchstart', function() {}, {passive: true});
    </script>
</body>
</html>`;
    }
  }
  
  // Thêm meta viewport nếu chưa có
  if (!content.includes('<meta name="viewport"')) {
    content = content.replace('</head>', 
    '<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">\n</head>');
  }
  
  return content;
};

// Hàm đơn giản để trích xuất tiêu đề từ nội dung HTML
const extractGameTitleFromContent = (content: string, defaultTopic: string): string => {
  let title = defaultTopic;
  
  const titleMatch = content.match(/<title>(.*?)<\/title>/i) || 
                    content.match(/<h1[^>]*>(.*?)<\/h1>/i);
  
  if (titleMatch && titleMatch[1]) {
    title = titleMatch[1].replace(/<[^>]*>/g, '').trim();
  }
  
  return title;
};

// Hàm thử lại khi gặp lỗi
export const tryGeminiGeneration = async (
  model: any,
  topic: string, 
  settings?: GameSettingsData,
  retryCount = 0
): Promise<MiniGame | null> => {
  const maxRetries = 2;  // Giảm số lần thử lại xuống 2 cho nhanh hơn
  
  if (retryCount >= maxRetries) {
    console.warn(`⚠️ Đã đạt đến số lần thử lại tối đa (${maxRetries})`);
    return null;
  }
  
  try {
    return await generateWithGemini(topic, settings);
  } catch (error) {
    console.error(`❌ Lần thử ${retryCount + 1} thất bại:`, error);
    
    // Tăng thời gian chờ giữa các lần thử lại
    const waitTime = (retryCount + 1) * 1500;
    await new Promise(resolve => setTimeout(resolve, waitTime));
    
    return tryGeminiGeneration(null, topic, settings, retryCount + 1);
  }
};
