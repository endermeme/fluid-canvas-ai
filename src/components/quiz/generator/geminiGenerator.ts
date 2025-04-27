
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

// Hàm phân tích và tách mã nguồn từ phản hồi API
const extractComponentsFromResponse = (text: string): { html: string; css: string; js: string; rawResponse: string } => {
  console.log("%c🌐 API RAW RESPONSE:", "background: #222; color: #bada55; padding: 5px; border-radius: 3px;");
  console.log(text);
  
  // Lưu response thô
  const rawResponse = text;
  
  // Tìm các thẻ phân tách đặc biệt trong phản hồi
  let html = '', css = '', js = '';
  
  // Tìm HTML
  const htmlMatch = text.match(/<HTML>([\s\S]*?)<\/HTML>/i);
  if (htmlMatch && htmlMatch[1]) {
    html = htmlMatch[1].trim();
  } else {
    // Thử tìm mã HTML trong phản hồi markdown
    const docTypeMatch = text.match(/<!DOCTYPE[\s\S]*?<\/html>/i);
    if (docTypeMatch) {
      // Nếu có DOCTYPE, lấy toàn bộ HTML
      html = docTypeMatch[0];
      
      // Trích xuất CSS và JS từ mã HTML
      const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
      if (styleMatch) {
        css = styleMatch[1].trim();
        html = html.replace(/<style[^>]*>[\s\S]*?<\/style>/i, '');
      }
      
      const scriptMatch = html.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
      if (scriptMatch) {
        js = scriptMatch[1].trim();
        html = html.replace(/<script[^>]*>[\s\S]*?<\/script>/i, '');
      }
    } else {
      // Nếu không có thẻ, lấy toàn bộ text làm HTML
      html = text;
    }
  }
  
  // Tìm CSS
  const cssMatch = text.match(/<CSS>([\s\S]*?)<\/CSS>/i);
  if (cssMatch && cssMatch[1]) {
    css = cssMatch[1].trim();
  } else if (!css) {
    // Nếu chưa tìm được CSS từ tách HTML
    const styleMatch = text.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
    if (styleMatch) {
      css = styleMatch[1].trim();
    }
  }
  
  // Tìm JavaScript
  const jsMatch = text.match(/<JAVASCRIPT>([\s\S]*?)<\/JAVASCRIPT>/i);
  if (jsMatch && jsMatch[1]) {
    js = jsMatch[1].trim();
  } else if (!js) {
    // Nếu chưa tìm được JS từ tách HTML
    const scriptMatch = text.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
    if (scriptMatch) {
      js = scriptMatch[1].trim();
    }
  }
  
  // In ra console để kiểm tra
  console.log("%c🧩 SEPARATED COMPONENTS:", "background: #222; color: #bada55; padding: 5px; border-radius: 3px;");
  console.log("%c📄 HTML:", "color: #e44d26; font-weight: bold;");
  console.log(html);
  console.log("%c🎨 CSS:", "color: #264de4; font-weight: bold;");
  console.log(css);
  console.log("%c⚙️ JavaScript:", "color: #f0db4f; font-weight: bold;");
  console.log(js);
  
  return { html, css, js, rawResponse };
};

// Tạo HTML đầy đủ từ các thành phần
const createFullHtml = (html: string, css: string, js: string, title: string = 'Interactive Game'): string => {
  // Loại bỏ DOCTYPE và thẻ html nếu có
  let htmlContent = html.replace(/<!DOCTYPE[^>]*>|<html[^>]*>|<\/html>/gi, '');
  htmlContent = htmlContent.replace(/<head>[\s\S]*?<\/head>/i, '');
  htmlContent = htmlContent.replace(/<body[^>]*>|<\/body>/gi, '');
  
  return `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <title>${title}</title>
    <style>
${css}
    </style>
</head>
<body>
${htmlContent}
    <script>
${js}
    </script>
</body>
</html>`;
};

// Hàm tạo game với Gemini, đã được cải tiến để tách biệt rõ ràng HTML/CSS/JS
export const generateWithGemini = async (
  topic: string, 
  settings?: GameSettingsData
): Promise<MiniGame | null> => {
  const gameType = getGameTypeByTopic(topic);
  const useCanvas = settings?.useCanvas !== undefined ? settings.useCanvas : true;
  
  console.log(`%c🎮 Bắt đầu tạo game: "${topic}" %c(${useCanvas ? 'sử dụng Canvas' : 'không sử dụng Canvas'})`,
    'font-weight: bold; color: #4C75F2;', 'font-weight: normal; color: #718096;');

  // Tạo prompt cải tiến
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
    
    // Tách các thành phần HTML, CSS, JS
    const { html, css, js, rawResponse } = extractComponentsFromResponse(text);
    
    // Lấy tiêu đề từ nội dung HTML
    const titleMatch = html.match(/<title>(.*?)<\/title>/i) || 
                      html.match(/<h1[^>]*>(.*?)<\/h1>/i);
    const title = titleMatch ? titleMatch[1].replace(/<[^>]*>/g, '').trim() : topic;
    
    // Tạo nội dung HTML đầy đủ
    const fullContent = createFullHtml(html, css, js, title);
    
    // Tạo đối tượng game
    const game: MiniGame = {
      title: title,
      content: fullContent,
      html: html,
      css: css,
      js: js,
      useCanvas: useCanvas,
      rawResponse: rawResponse
    };
    
    console.log('%c🎯 Game đã được tạo thành công', 'color: #10B981; font-weight: bold;');
    
    return game;
  } catch (error) {
    console.error('🔴 Lỗi khi tạo game với Gemini:', error);
    throw error;
  }
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
