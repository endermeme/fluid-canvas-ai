
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
import { 
  createGameGenerationPrompt, 
  createFlashGamePrompt, 
  createSuperThinkingAnalysisPrompt 
} from './geminiPrompt';
import { validateGameQuality, generateQualityReport } from './gameQualityValidator';
import type { MiniGame, GameApiResponse } from './types';

const SOURCE = "GEMINI";

// Export the MiniGame type for use in other files
export type { MiniGame } from './types';

// Tạo lớp AIGameGenerator để giữ tương thích với code cũ
export class AIGameGenerator {
  private static instance: AIGameGenerator | null = null;
  private modelType: string = GEMINI_MODELS.CUSTOM_GAME;

  private constructor() {}

  public static getInstance(): AIGameGenerator {
    if (!AIGameGenerator.instance) {
      AIGameGenerator.instance = new AIGameGenerator();
    }
    return AIGameGenerator.instance;
  }
  
  public setModelType(modelType: string): void {
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
    if (this.modelType === GEMINI_MODELS.SUPER_THINKING) {
      return this.generateWithSuperThinking(topic, settings);
    }
    
    return tryGeminiGeneration(this.modelType, topic, settings);
  }
  
  private async generateWithSuperThinking(topic: string, settings?: GameSettingsData): Promise<MiniGame | null> {
    try {
      logInfo(SOURCE, "🧠 Super Thinking Mode - Bước 1: Phân tích game design");
      
      // Bước 1: Phân tích chi tiết với Flash model
      const analysisPrompt = createSuperThinkingAnalysisPrompt(topic);
      
      const analysisStartTime = Date.now();
      const analysisResponse = await Promise.race([
        callGeminiApi(GEMINI_MODELS.FLASH, analysisPrompt),
        new Promise<null>((_, reject) => 
          setTimeout(() => reject(new Error("Analysis timeout")), 60000)
        )
      ]);
      
      const analysisDuration = measureExecutionTime(analysisStartTime);
      logInfo(SOURCE, `✅ Phân tích hoàn thành trong ${analysisDuration.seconds}s`);
      
      if (!analysisResponse) {
        logWarning(SOURCE, "⚠️ Phân tích thất bại, chuyển sang Pro model");
        return this.generateWithEnhancedPrompt(GEMINI_MODELS.PRO, topic, settings);
      }
      
      logInfo(SOURCE, "🎯 Super Thinking Mode - Bước 2: Tạo game với insights");
      
      // Bước 2: Tạo game với insights từ phân tích
      const enhancedPrompt = this.createEnhancedPrompt(topic, analysisResponse);
      
      const generationStartTime = Date.now();
      const finalGame = await Promise.race([
        this.generateGameWithPrompt(GEMINI_MODELS.PRO, enhancedPrompt, topic, settings),
        new Promise<MiniGame | null>((_, reject) => 
          setTimeout(() => reject(new Error("Generation timeout")), 90000)
        )
      ]);
      
      const generationDuration = measureExecutionTime(generationStartTime);
      
      if (finalGame && finalGame.content && finalGame.content.length > 500) {
        logSuccess(SOURCE, `🚀 Super Thinking hoàn thành trong ${generationDuration.seconds}s`);
        
        // Validate quality
        const qualityResult = validateGameQuality(finalGame.content);
        logInfo(SOURCE, `📊 Quality Score: ${qualityResult.metrics.overall.toFixed(1)}/100`);
        
        if (qualityResult.metrics.overall < 60) {
          logWarning(SOURCE, "⚠️ Chất lượng thấp, thử lại với Pro model");
          return this.generateWithEnhancedPrompt(GEMINI_MODELS.PRO, topic, settings);
        }
        
        return finalGame;
      } else {
        logWarning(SOURCE, "⚠️ Kết quả không hợp lệ, fallback to Pro");
        return this.generateWithEnhancedPrompt(GEMINI_MODELS.PRO, topic, settings);
      }
      
    } catch (error) {
      logError(SOURCE, "❌ Super Thinking thất bại", error);
      return this.generateWithEnhancedPrompt(GEMINI_MODELS.PRO, topic, settings);
    }
  }
  
  private createEnhancedPrompt(topic: string, analysis: string): string {
    return `# ENHANCED GAME CREATION với ANALYSIS INSIGHTS

## TOPIC: ${topic}

## DESIGN ANALYSIS:
${analysis.substring(0, 1200)}

## IMPLEMENTATION REQUIREMENTS:
Dựa trên analysis trên, tạo game HTML5 với:

### 🎯 CORE IMPLEMENTATION:
- Apply tất cả insights từ analysis
- Professional code architecture
- Advanced game mechanics như đã phân tích
- Anti-cheat measures được recommend
- Performance optimizations được đề xuất

### 🎨 VISUAL EXCELLENCE:
- Modern UI design với CSS3
- Smooth animations 60fps
- Beautiful color schemes
- Professional typography
- Responsive cho mọi device

### 🔧 TECHNICAL EXCELLENCE:
- Clean, maintainable code
- Proper error handling
- Memory management
- Performance monitoring
- Cross-browser compatibility

Trả về HTML hoàn chỉnh ready-to-play, implement tất cả insights từ analysis!`;
  }
  
  private async generateWithEnhancedPrompt(model: string, topic: string, settings?: GameSettingsData): Promise<MiniGame | null> {
    const prompt = model === GEMINI_MODELS.FLASH 
      ? createFlashGamePrompt({ topic, language: settings?.language || 'vi' })
      : createGameGenerationPrompt({ topic, language: settings?.language || 'vi' });
      
    return this.generateGameWithPrompt(model, prompt, topic, settings);
  }
  
  private async generateGameWithPrompt(model: string, prompt: string, topic: string, settings?: GameSettingsData): Promise<MiniGame | null> {
    const textResponse = await callGeminiApi(model, prompt);
    
    if (!textResponse) {
      throw new Error('Failed to get response from API');
    }
    
    const { title, content } = processGameCode(textResponse);
    
    if (!content || content.length < 500) {
      throw new Error('Generated content is insufficient');
    }
    
    // Quality validation
    const qualityResult = validateGameQuality(content);
    if (qualityResult.metrics.overall < 50) {
      logWarning(SOURCE, `⚠️ Low quality game: ${qualityResult.metrics.overall.toFixed(1)}/100`);
      logInfo(SOURCE, generateQualityReport(qualityResult));
    } else {
      logSuccess(SOURCE, `✅ High quality game: ${qualityResult.metrics.overall.toFixed(1)}/100`);
    }
    
    return {
      id: `game-${Date.now()}`,
      title: title || `Game: ${topic}`,
      description: `Professional game: ${topic}`,
      topic,
      code: content,
      settings: settings || {},
      createdAt: new Date().toISOString(),
      type: 'custom',
      content: content
    };
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
 * Xử lý mã code trả về từ Gemini - cải thiện để extract chất lượng cao
 */
const processGameCode = (text: string): { title: string, content: string } => {
  let cleanedContent = text.trim();
  let title = 'Professional Game';
  
  // 1. Extract HTML từ markdown với priority cho HTML5 compliant
  const codeBlockRegex = /```(?:html|javascript|css)?\s*([\s\S]*?)```/g;
  const allMatches = [...cleanedContent.matchAll(codeBlockRegex)];
  
  if (allMatches.length > 0) {
    // Tìm block HTML5 hoàn chỉnh
    const htmlBlockMatch = allMatches.find(match => 
      match[1] && (
        match[1].includes('<!DOCTYPE html>') || 
        (match[1].includes('<html') && match[1].includes('<head') && match[1].includes('<body'))
      )
    );
    
    if (htmlBlockMatch && htmlBlockMatch[1]) {
      cleanedContent = htmlBlockMatch[1].trim();
    } else if (allMatches.length > 0) {
      // Fallback to largest block
      const largestBlock = allMatches.reduce((prev, current) => 
        (current[1]?.length || 0) > (prev[1]?.length || 0) ? current : prev
      );
      cleanedContent = largestBlock[1]?.trim() || cleanedContent;
    }
  } else {
    // Clean markdown artifacts
    cleanedContent = cleanedContent
      .replace(/```html|```javascript|```css|```/g, '')
      .trim();
  }

  // 2. Extract title với multiple fallbacks
  const titleSources = [
    cleanedContent.match(/<title[^>]*>(.*?)<\/title>/i)?.[1],
    cleanedContent.match(/<h1[^>]*>(.*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g, ''),
    cleanedContent.match(/\/\*\s*Game:\s*(.*?)\s*\*\//i)?.[1],
    cleanedContent.match(/\/\/\s*Game:\s*(.*?)$/im)?.[1]
  ];
  
  const extractedTitle = titleSources.find(t => t && t.trim().length > 0);
  if (extractedTitle) {
    title = extractedTitle.trim();
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
