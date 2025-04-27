
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

  const promptOptions = {
    topic,
    useCanvas,
    language: settings?.language || 'en',
    difficulty: settings?.difficulty || 'medium',
    category: settings?.category || 'general'
  };

  // Tạo prompt cho mã game không cần chỉnh sửa quá nhiều
  const prompt = generateCustomGamePrompt(promptOptions);

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
    
    console.log('%c Generated Game Code:', 'font-weight: bold; color: #6f42c1;');
    console.log(text);
    
    // Trích xuất thông tin game và content từ phản hồi
    let content = extractGameCodeFromResponse(text);
    let title = extractGameTitle(content, topic);
    
    // Kiểm tra xem mã game có hợp lệ không và tối ưu hóa
    content = optimizeGameCode(content);
    
    const game: MiniGame = {
      title: title,
      content: content,
      useCanvas: useCanvas
    };
    
    logSuccess(SOURCE, "Game generated successfully");
    
    return game;
  } catch (error) {
    logError(SOURCE, "Error generating with Gemini", error);
    throw error;
  }
};

// Hàm trích xuất mã HTML game từ phản hồi API
const extractGameCodeFromResponse = (text: string): string => {
  // Loại bỏ các dấu markdown nếu có
  let content = text;
  
  // Xóa backticks và text "html" nếu có
  content = content.replace(/```html|```/g, '').trim();
  
  // Kiểm tra nếu nội dung không bắt đầu với <!DOCTYPE hoặc <html
  if (!content.trim().startsWith('<!DOCTYPE') && !content.trim().startsWith('<html')) {
    // Tìm mã HTML trong phản hồi
    const htmlMatch = text.match(/<!DOCTYPE[\s\S]*<\/html>/i) || 
                      text.match(/<html[\s\S]*<\/html>/i);
    
    if (htmlMatch && htmlMatch[0]) {
      content = htmlMatch[0];
    } else {
      // Nếu không tìm thấy mã HTML hoàn chỉnh, thử thêm thẻ DOCTYPE và HTML
      content = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <title>${text.substring(0, 30)}...</title>
</head>
<body>
    ${content}
</body>
</html>`;
    }
  }
  
  return content;
};

// Hàm tối ưu hóa mã game để tải nhanh hơn
const optimizeGameCode = (content: string): string => {
  try {
    // Thêm meta viewport nếu chưa có để đảm bảo responsive
    if (!content.includes('<meta name="viewport"')) {
      content = content.replace('</head>', 
      '<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">\n</head>');
    }
    
    // Thêm các thuộc tính touch-action để cải thiện trải nghiệm trên thiết bị cảm ứng
    if (!content.includes('touch-action')) {
      content = content.replace('<style>', '<style>\n* { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }\n');
    }
    
    // Thêm code preload để đảm bảo game tải nhanh
    content = content.replace('</head>', 
    '<script>\nwindow.addEventListener("load", function() { document.body.classList.add("loaded"); });\n</script>\n</head>');
    
    return content;
  } catch (error) {
    console.error("Error optimizing game code:", error);
    return content;  // Return original content if optimization fails
  }
};

// Trích xuất tiêu đề game từ nội dung HTML
const extractGameTitle = (content: string, defaultTopic: string): string => {
  let title = defaultTopic;
  
  // Tìm tiêu đề từ thẻ title hoặc h1
  const titleMatch = content.match(/<title>(.*?)<\/title>/i) || 
                    content.match(/<h1[^>]*>(.*?)<\/h1>/i);
  
  if (titleMatch && titleMatch[1]) {
    title = titleMatch[1].replace(/<[^>]*>/g, '').trim();
  }
  
  return title;
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
    
    // Tăng thời gian chờ giữa các lần thử lại
    const waitTime = (retryCount + 1) * 2000;
    await new Promise(resolve => setTimeout(resolve, waitTime));
    
    return tryGeminiGeneration(null, topic, settings, retryCount + 1);
  }
};
