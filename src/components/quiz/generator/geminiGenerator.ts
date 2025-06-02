
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
  private modelType: string = GEMINI_MODELS.CUSTOM_GAME; // Mặc định là model hiện tại

  private constructor() {}

  public static getInstance(): AIGameGenerator {
    if (!AIGameGenerator.instance) {
      AIGameGenerator.instance = new AIGameGenerator();
    }
    return AIGameGenerator.instance;
  }
  
  /**
   * Cài đặt loại mô hình AI sử dụng
   * @param modelType Loại mô hình AI sử dụng (flash, pro, super-thinking)
   */
  public setModelType(modelType: string): void {
    // Ánh xạ từ AIModelType sang model thực tế
    switch(modelType) {
      case 'flash':
        this.modelType = GEMINI_MODELS.FLASH;
        break;
      case 'super-thinking':
        this.modelType = GEMINI_MODELS.SUPER_THINKING;
        break;
      case 'pro':
      default:
        this.modelType = GEMINI_MODELS.PRO;
        break;
    }
  }

  public async generateMiniGame(topic: string, settings?: GameSettingsData): Promise<MiniGame | null> {
    // Nếu là chế độ Super Thinking, sử dụng flow đặc biệt
    if (this.modelType === GEMINI_MODELS.SUPER_THINKING) {
      return this.generateWithSuperThinking(topic, settings);
    }
    
    // Nếu không, sử dụng flow bình thường với mô hình được chọn
    return tryGeminiGeneration(this.modelType, topic, settings);
  }
  
  // Phương thức xử lý chế độ Super Thinking - sửa lỗi timeout và xử lý kết quả
  private async generateWithSuperThinking(topic: string, settings?: GameSettingsData): Promise<MiniGame | null> {
    try {
      logInfo(SOURCE, "Starting Super Thinking mode - Step 1: Analysis");
      
      // Bước 1: Sử dụng Flash model để phân tích logic game (timeout 45s)
      const thinkingPrompt = `
# Yêu cầu Game
${topic}

# Nhiệm vụ của bạn
Hãy phân tích chi tiết game cần tạo dựa trên yêu cầu trên. Hãy mô tả rõ các phần sau:

1. Thể loại game và cơ chế chính
2. Các thành phần chính cần có
3. Luồng chơi (gameplay flow)
4. Logic xử lý game chính
5. Điều kiện thắng/thua
6. Giao diện người dùng và trải nghiệm
7. Tương tác/animation quan trọng (cho cả mobile và PC)

Lưu ý: không viết code, chỉ mô tả chi tiết logic và cơ chế trong 200 từ.`;
      
      // Gọi Flash model để phân tích với timeout dài hơn
      const analysisStartTime = Date.now();
      const thinkingResponse = await Promise.race([
        callGeminiApi(GEMINI_MODELS.FLASH, thinkingPrompt),
        new Promise<null>((_, reject) => 
          setTimeout(() => reject(new Error("Analysis timeout")), 45000)
        )
      ]);
      
      const analysisDuration = measureExecutionTime(analysisStartTime);
      logInfo(SOURCE, `Analysis completed in ${analysisDuration.seconds}s`);
      
      if (!thinkingResponse) {
        logWarning(SOURCE, "Flash analysis failed, falling back to PRO model");
        return tryGeminiGeneration(GEMINI_MODELS.PRO, topic, settings);
      }
      
      logInfo(SOURCE, "Starting Super Thinking mode - Step 2: Enhanced Generation");
      
      // Bước 2: Kết hợp phân tích với yêu cầu ban đầu để tạo prompt nâng cao
      const enhancedPrompt = `
# Yêu cầu Game Gốc
${topic}

# Phân tích Chi tiết
${thinkingResponse.substring(0, 1000)} // Giới hạn độ dài để tránh prompt quá lớn

# Tạo Game HTML5 
Dựa trên phân tích trên, hãy tạo một game HTML5 hoàn chỉnh với:
- HTML, CSS, JavaScript embed trong một file duy nhất
- Tối ưu cho cả desktop và mobile
- UI đẹp và dễ sử dụng
- Logic game rõ ràng dựa trên phân tích

Trả về file HTML hoàn chỉnh có thể chạy trực tiếp.`;
      
      // Gọi Pro model với prompt nâng cao và timeout dài hơn
      const generationStartTime = Date.now();
      const finalGame = await Promise.race([
        generateWithCustomPrompt(GEMINI_MODELS.PRO, topic, enhancedPrompt, settings),
        new Promise<MiniGame | null>((_, reject) => 
          setTimeout(() => reject(new Error("Generation timeout")), 60000)
        )
      ]);
      
      const generationDuration = measureExecutionTime(generationStartTime);
      
      // Kiểm tra kết quả và xử lý đúng cách
      if (finalGame && finalGame.content) {
        logSuccess(SOURCE, `Super Thinking completed in ${generationDuration.seconds}s`);
        return finalGame;
      } else {
        logWarning(SOURCE, "Super Thinking generated empty result, falling back to PRO model");
        return tryGeminiGeneration(GEMINI_MODELS.PRO, topic, settings);
      }
      
    } catch (error) {
      logError(SOURCE, "Super Thinking mode failed", error);
      logWarning(SOURCE, "Falling back to PRO model");
      
      // Fallback to regular PRO model if Super Thinking fails
      return tryGeminiGeneration(GEMINI_MODELS.PRO, topic, settings);
    }
  }
}

export const generateWithGemini = async (
  topic: string, 
  modelId: string | null = null,
  settings?: GameSettingsData
): Promise<MiniGame | null> => {
  const gameType = getGameTypeByTopic(topic);
  
  // Sử dụng mô hình được truyền vào hoặc mặc định
  const selectedModel = modelId || GEMINI_MODELS.CUSTOM_GAME;
  
  logInfo(SOURCE, `Starting game generation for "${topic}"`, {
    model: selectedModel,
    apiVersion: API_VERSION,
    type: gameType?.name || "Not specified",
    settings: settings || {}
  });

  // Tạo prompt với template cải tiến từ geminiPrompt.ts
  const prompt = createGameGenerationPrompt({
    topic,
    language: settings?.language || 'vi'
  });

  try {
    logInfo(SOURCE, `Sending request to Gemini API using model ${selectedModel}`);
    
    const startTime = Date.now();
    
    // Đơn giản hóa payload API request
    const payload = {
      contents: [{
        role: "user",
        parts: [{text: prompt}]
      }],
      generationConfig: {
        ...DEFAULT_GENERATION_SETTINGS,
        temperature: 0.7
      }
    };
    
    const response = await fetch(getApiEndpoint(selectedModel), {
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
      content: content
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
 * Xử lý mã code trả về từ Gemini - đơn giản hóa tối đa
 */
const processGameCode = (text: string): { title: string, content: string } => {
  // Loại bỏ cú pháp markdown đơn giản
  let cleanedContent = text.trim();
  let title = 'Interactive Game';
  
  // 1. Xử lý markdown code blocks - chỉ lấy nội dung HTML trong block
  const codeBlockRegex = /```(?:html|javascript)?\s*([\s\S]*?)```/g;
  const allMatches = [...cleanedContent.matchAll(codeBlockRegex)];
  
  if (allMatches.length > 0) {
    // Tìm block chứa HTML đầy đủ (ưu tiên có DOCTYPE hoặc thẻ html)
    const htmlBlockMatch = allMatches.find(match => 
      match[1] && (
        match[1].includes('<!DOCTYPE html>') || 
        match[1].includes('<html')
      )
    );
    
    if (htmlBlockMatch && htmlBlockMatch[1]) {
      cleanedContent = htmlBlockMatch[1].trim();
    } else {
      // Nếu không tìm thấy block HTML hoàn chỉnh, dùng block đầu tiên
      cleanedContent = allMatches[0][1].trim();
    }
  } else {
    // Không tìm thấy code block, giữ nguyên nội dung nhưng xóa các dấu markdown
    cleanedContent = cleanedContent.replace(/```html|```javascript|```/g, '').trim();
  }

  // 2. Trích xuất tiêu đề từ HTML nếu có
  const titleMatch = cleanedContent.match(/<title[^>]*>(.*?)<\/title>/i);
  if (titleMatch && titleMatch[1]) {
    title = titleMatch[1].trim();
  } else {
    // Thử tìm trong H1
    const h1Match = cleanedContent.match(/<h1[^>]*>(.*?)<\/h1>/i);
    if (h1Match && h1Match[1]) {
      title = h1Match[1].trim().replace(/<[^>]+>/g, ''); // Loại bỏ các thẻ HTML trong tiêu đề
    }
  }
  
  return { 
    title, 
    content: cleanedContent 
  };
};

// Thêm hàm mới để gọi trực tiếp API Gemini với một model cụ thể - tăng timeout
export const callGeminiApi = async (modelId: string, promptText: string): Promise<string | null> => {
  try {
    logInfo(SOURCE, `Calling Gemini API with model: ${modelId}`);
    
    // Đơn giản hóa payload API request
    const payload = {
      contents: [{
        role: "user",
        parts: [{text: promptText}]
      }],
      generationConfig: {
        ...DEFAULT_GENERATION_SETTINGS,
        temperature: 0.7
      }
    };
    
    // Tăng timeout cho API call
    const response = await Promise.race([
      fetch(getApiEndpoint(modelId), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      }),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error("API call timeout")), 45000)
      )
    ]);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('Empty response from API');
    }
    
    const textContent = data.candidates[0].content.parts[0].text;
    return textContent;
    
  } catch (error) {
    logError(SOURCE, `Gemini API call failed for model ${modelId}`, error);
    return null;
  }
};

export const tryGeminiGeneration = async (
  model: string | null,
  topic: string, 
  settings?: GameSettingsData,
  retryCount = 0
): Promise<MiniGame | null> => {
  const maxRetries = 2; // Giảm retry để tránh tình trạng kẹt
  
  if (retryCount >= maxRetries) {
    logWarning(SOURCE, `Reached maximum retries (${maxRetries})`);
    return null;
  }
  
  try {
    // Nếu có enhancedPrompt từ Super Thinking, sử dụng nó
    if (settings?.enhancedPrompt) {
      return await generateWithCustomPrompt(model || GEMINI_MODELS.PRO, topic, settings.enhancedPrompt, settings);
    }
    
    // Nếu không, sử dụng flow bình thường với model được chỉ định
    return await generateWithGemini(topic, model, settings);
  } catch (error) {
    logError(SOURCE, `Attempt ${retryCount + 1} failed`, error);
    
    const waitTime = (retryCount + 1) * 1000; // Giảm thời gian chờ
    await new Promise(resolve => setTimeout(resolve, waitTime));
    
    return tryGeminiGeneration(model, topic, settings, retryCount + 1);
  }
};

export const generateWithCustomPrompt = async (
  modelId: string,
  topic: string,
  customPrompt: string,
  settings?: GameSettingsData
): Promise<MiniGame | null> => {
  try {
    logInfo(SOURCE, `Starting game generation with custom prompt`);
    
    const textResponse = await callGeminiApi(modelId, customPrompt);
    
    if (!textResponse) {
      throw new Error('Failed to get response from API');
    }
    
    // Xử lý kết quả trả về và tạo game
    const { title, content } = processGameCode(textResponse);
    
    // Kiểm tra nội dung có hợp lệ không
    if (!content || content.length < 100) {
      throw new Error('Generated content is too short or empty');
    }
    
    // Trả về đối tượng MiniGame
    return {
      id: `game-${Date.now()}`,
      title: title || `Custom Game: ${topic.substring(0, 30)}...`,
      description: `Game created from prompt: ${topic.substring(0, 50)}...`,
      topic,
      code: content,
      settings: settings || {},
      createdAt: new Date().toISOString(),
      type: 'custom',
      content: content // Thêm content để tương thích
    };
  } catch (error) {
    logError(SOURCE, 'Failed to generate with custom prompt', error);
    return null;
  }
};
