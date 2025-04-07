
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GameSettingsData } from '../types';
import { getGameTypeByTopic } from '../gameTypes';
import { MiniGame, AIGameGeneratorOptions } from './types';
import { createGeminiClient, getOpenAIKey, saveOpenAIKey, getUseOpenAIAsPrimary, saveUseOpenAIAsPrimary } from './apiUtils';
import { tryGeminiGeneration } from './geminiGenerator';
import { enhanceWithOpenAI } from './openaiGenerator';
import { createFallbackGame } from './fallbackGenerator';

export class AIGameGenerator {
  private model: any;
  private openAIKey: string | null = null;
  private modelName: string;
  private canvasMode: boolean = false;
  private useOpenAIAsPrimary: boolean = false;

  constructor(apiKey: string, options?: { modelName?: string; canvasMode?: boolean }) {
    console.log("🚀 AIGameGenerator: Khởi tạo bộ tạo game AI");
    this.modelName = options?.modelName || 'gemini-2.0-flash';
    
    // Get stored OpenAI key and primary flag
    const storedOpenAIKey = getOpenAIKey();
    this.useOpenAIAsPrimary = getUseOpenAIAsPrimary();
    
    // If there's no OpenAI key, automatically enable canvas mode
    this.canvasMode = options?.canvasMode || !storedOpenAIKey ? true : false;
    
    console.log(`🚀 AIGameGenerator: Sử dụng mô hình ${this.modelName}`);
    console.log(`🚀 AIGameGenerator: Chế độ canvas: ${this.canvasMode ? 'BẬT' : 'TẮT'}`);
    console.log(`🚀 AIGameGenerator: Sử dụng OpenAI làm API chính: ${this.useOpenAIAsPrimary ? 'BẬT' : 'TẮT'}`);
    
    this.model = createGeminiClient(apiKey);
    this.openAIKey = storedOpenAIKey;
    
    if (this.openAIKey) {
      console.log("🚀 AIGameGenerator: Có sẵn OpenAI key cho cải thiện game");
      if (this.useOpenAIAsPrimary) {
        console.log("🚀 AIGameGenerator: OpenAI sẽ được sử dụng làm API chính với mô hình gpt-4o-mini");
      }
    } else {
      console.log("🚀 AIGameGenerator: Không có OpenAI key, sẽ chỉ sử dụng Gemini với chế độ Canvas");
    }
  }

  setOpenAIKey(key: string, useAsPrimary: boolean = false): boolean {
    // Allow empty key to disable OpenAI enhancement
    const success = saveOpenAIKey(key);
    
    if (success) {
      console.log("🚀 AIGameGenerator: Đã lưu OpenAI key mới");
      this.openAIKey = key;
      
      // Save the primary flag
      this.useOpenAIAsPrimary = useAsPrimary && key.trim() !== '';
      saveUseOpenAIAsPrimary(this.useOpenAIAsPrimary);
      console.log(`🚀 AIGameGenerator: Sử dụng OpenAI làm API chính: ${this.useOpenAIAsPrimary ? 'BẬT' : 'TẮT'}`);
      
      // If the key is empty, automatically enable canvas mode
      if (!key) {
        this.canvasMode = true;
        this.useOpenAIAsPrimary = false;
        saveUseOpenAIAsPrimary(false);
        console.log("🚀 AIGameGenerator: Đã bật tự động chế độ Canvas do không có OpenAI key");
      }
    } else {
      console.log("🚀 AIGameGenerator: Không thể lưu OpenAI key");
    }
    return success;
  }

  setCanvasMode(enabled: boolean): void {
    this.canvasMode = enabled;
    console.log(`🚀 AIGameGenerator: Chế độ canvas đã ${enabled ? 'BẬT' : 'TẮT'}`);
  }

  hasOpenAIKey(): boolean {
    return this.openAIKey !== null && this.openAIKey !== '';
  }

  isCanvasModeEnabled(): boolean {
    return this.canvasMode;
  }

  isOpenAIPrimary(): boolean {
    return this.useOpenAIAsPrimary;
  }

  async generateMiniGame(topic: string, settings?: GameSettingsData): Promise<MiniGame | null> {
    try {
      console.log(`🚀 AIGameGenerator: Bắt đầu tạo game cho chủ đề: "${topic}"`);
      console.log(`🚀 AIGameGenerator: Cài đặt:`, settings);
      console.log(`🚀 AIGameGenerator: Chế độ canvas: ${this.canvasMode ? 'BẬT' : 'TẮT'}`);
      console.log(`🚀 AIGameGenerator: OpenAI làm API chính: ${this.useOpenAIAsPrimary ? 'BẬT' : 'TẮT'}`);
      
      const gameType = getGameTypeByTopic(topic);
      if (gameType) {
        console.log(`🚀 AIGameGenerator: Đã xác định loại game: ${gameType.name}`);
      }
      
      const startTime = Date.now();
      
      // If OpenAI is set as primary API and we have a key, use it directly
      if (this.useOpenAIAsPrimary && this.hasOpenAIKey()) {
        console.log(`🚀 AIGameGenerator: Tạo game trực tiếp với OpenAI GPT-4o-mini...`);
        
        try {
          const gamePrompt = `
Create an interactive HTML mini-game on the topic: "${topic}".

Include these requirements:
1. Create a fully functional, engaging game that works in a single HTML file
2. Use HTML, CSS, and vanilla JavaScript (no external libraries)
3. Make the game responsive and mobile-friendly
4. Include clear instructions for the player
5. Add visual elements, animations and game mechanics appropriate for the topic
6. Ensure the game has a clear objective and scoring system
7. Keep the code clean and well-documented
8. Return ONLY the complete HTML code without any explanations

The game should be educational and fun, focused specifically on the topic: "${topic}".
`;

          console.log(`🚀 AIGameGenerator: Gửi prompt trực tiếp đến GPT-4o-mini: ${gamePrompt.substring(0, 100)}...`);
          
          // Log full API key format (censored) for debugging
          const keyPreview = this.openAIKey ? 
            `${this.openAIKey.substring(0, 7)}...${this.openAIKey.substring(this.openAIKey.length - 4)}` : 
            'không có';
          console.log(`🚀 AIGameGenerator: Kiểu key OpenAI: ${this.openAIKey?.startsWith('sk-proj-') ? 'Project key' : 'Regular key'}, Format: ${keyPreview}`);
          
          const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.openAIKey}`
            },
            body: JSON.stringify({
              model: 'gpt-4o-mini',
              messages: [{ role: 'user', content: gamePrompt }],
              temperature: 0.7,
              max_tokens: 4000
            })
          });

          if (!response.ok) {
            const errorData = await response.text();
            console.error(`❌ AIGameGenerator: Lỗi từ API OpenAI: ${response.status} - ${errorData}`);
            throw new Error(`OpenAI API error: ${response.status}`);
          }

          const data = await response.json();
          console.log(`🚀 AIGameGenerator: Đã nhận phản hồi từ GPT-4o-mini`);
          
          const content = data.choices && data.choices[0] && data.choices[0].message 
            ? data.choices[0].message.content 
            : null;
          
          if (content && content.length > 500) {
            console.log(`🚀 AIGameGenerator: Độ dài phản hồi: ${content.length} ký tự`);
            console.log(`🚀 AIGameGenerator: Trích xuất mã HTML từ nội dung...`);
            
            // Improve HTML extraction with multiple patterns
            let gameHtml = content;
            
            // First try to extract standard HTML document
            const htmlMatch = content.match(/<(!DOCTYPE|html)[\s\S]*<\/html>/i);
            if (htmlMatch) {
              gameHtml = htmlMatch[0];
            } 
            // If not found, look for code blocks
            else if (content.includes('```html')) {
              const codeMatch = content.match(/```html\s*([\s\S]*?)\s*```/);
              if (codeMatch && codeMatch[1]) {
                gameHtml = codeMatch[1];
              }
            }
            
            console.log(`🚀 AIGameGenerator: Đã trích xuất HTML thành công, độ dài: ${gameHtml.length} ký tự`);
            
            const openAITime = ((Date.now() - startTime) / 1000).toFixed(2);
            console.log(`🚀 AIGameGenerator: Tạo game với OpenAI hoàn tất sau ${openAITime}s`);
            
            const gameTitle = topic.charAt(0).toUpperCase() + topic.slice(1);
            return {
              title: gameTitle,
              description: `Game về chủ đề ${topic}`,
              content: gameHtml
            };
          } else {
            console.log(`❌ AIGameGenerator: Phản hồi quá ngắn hoặc không có nội dung, độ dài: ${content ? content.length : 0} ký tự`);
            throw new Error("OpenAI response too short or empty");
          }
        } catch (error) {
          console.error("❌ AIGameGenerator: Lỗi khi tạo game với OpenAI:", error);
          console.log("⚠️ AIGameGenerator: Chuyển sang sử dụng Gemini do lỗi OpenAI");
        }
      }

      // Fall back to Gemini if OpenAI direct generation fails or isn't enabled
      console.log(`🚀 AIGameGenerator: Bắt đầu tạo game với ${this.modelName}...`);
      const geminiResult = await tryGeminiGeneration(this.model, topic, settings);
      
      const geminiTime = ((Date.now() - startTime) / 1000).toFixed(2);
      console.log(`🚀 AIGameGenerator: Tạo với Gemini hoàn tất sau ${geminiTime}s`);
      
      if (geminiResult) {
        console.log(`🚀 AIGameGenerator: Đã tạo thành công game với Gemini: "${geminiResult.title}"`);
        console.log(`🚀 AIGameGenerator: Kích thước mã: ${geminiResult.content.length.toLocaleString()} ký tự`);
        
        // If OpenAI key is available and not set as primary, enhance the game
        if (this.hasOpenAIKey() && !this.useOpenAIAsPrimary) {
          console.log("🚀 AIGameGenerator: Có OpenAI key, đang cải thiện game...");
          const enhanceStartTime = Date.now();
          
          const enhancedGame = await enhanceWithOpenAI(
            this.openAIKey, 
            geminiResult, 
            topic, 
            this.canvasMode
          );
          
          const enhanceTime = ((Date.now() - enhanceStartTime) / 1000).toFixed(2);
          console.log(`🚀 AIGameGenerator: Quá trình cải thiện OpenAI hoàn tất sau ${enhanceTime}s`);
          
          // Only use the enhanced game if enhancing was successful
          if (enhancedGame && enhancedGame.content && enhancedGame.content.length > 100) {
            console.log("🚀 AIGameGenerator: Đã cải thiện thành công game với OpenAI");
            console.log(`🚀 AIGameGenerator: Kích thước mã gốc vs mới: ${geminiResult.content.length.toLocaleString()} → ${enhancedGame.content.length.toLocaleString()} ký tự`);
            
            const totalTime = ((Date.now() - startTime) / 1000).toFixed(2);
            console.log(`🚀 AIGameGenerator: Tổng thời gian tạo game: ${totalTime}s`);
            
            return enhancedGame;
          } else {
            console.log("🚀 AIGameGenerator: Cải thiện OpenAI thất bại hoặc trả về nội dung không hợp lệ, sử dụng kết quả Gemini");
            return geminiResult;
          }
        }
        
        const totalTime = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log(`🚀 AIGameGenerator: Tổng thời gian tạo game: ${totalTime}s`);
        
        return geminiResult;
      }
      
      console.log("⚠️ AIGameGenerator: Tạo với Gemini thất bại, sử dụng game dự phòng");
      return createFallbackGame(topic);
      
    } catch (error) {
      console.error("❌ AIGameGenerator: Lỗi trong generateMiniGame:", error);
      console.log("⚠️ AIGameGenerator: Đang tạo game dự phòng do gặp lỗi");
      return createFallbackGame(topic);
    }
  }
}

// Re-export types for convenience
export type { MiniGame };
