
import { GoogleGenerativeAI } from '@google/generative-ai';

interface DetailedGameSettings {
  difficulty: string;
  category: string;
  gameType: string;
  playerCount: string;
  timeLimit: number;
  complexity: number;
  useCanvas: boolean;
  includeSound: boolean;
  mobileOptimized: boolean;
  language: string;
  customSettings: string;
  prompt: string;
}

interface GeneratedGame {
  title: string;
  content: string;
  metadata?: {
    generationTime: number;
    retryCount: number;
    model: string;
    settings: DetailedGameSettings;
  };
}

class EnhancedGameGenerator {
  private static instance: EnhancedGameGenerator;
  private genAI: GoogleGenerativeAI;
  private readonly maxRetries = 5;
  private readonly retryDelay = 2000;

  private constructor() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('VITE_GEMINI_API_KEY không được cấu hình');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    console.log('🤖 [GENERATOR] Enhanced Game Generator initialized');
  }

  public static getInstance(): EnhancedGameGenerator {
    if (!EnhancedGameGenerator.instance) {
      EnhancedGameGenerator.instance = new EnhancedGameGenerator();
    }
    return EnhancedGameGenerator.instance;
  }

  private buildDetailedPrompt(settings: DetailedGameSettings): string {
    const difficultyMap = {
      'easy': 'dễ dàng, phù hợp trẻ em, controls đơn giản',
      'medium': 'trung bình, cần tập trung một chút',
      'hard': 'khó, đòi hỏi kỹ năng cao',
      'expert': 'cực kỳ khó, thử thách cực đại'
    };

    const categoryMap = {
      'action': 'hành động nhanh, phản xạ',
      'puzzle': 'logic, suy nghĩ',
      'arcade': 'giải trí, dễ chơi',
      'strategy': 'chiến thuật, lập kế hoạch',
      'adventure': 'khám phá, câu chuyện',
      'racing': 'tốc độ, điều khiển xe',
      'sports': 'thể thao, thi đấu',
      'educational': 'học tập, giáo dục'
    };

    return `
# YÊU CẦU TẠO GAME CHI TIẾT

## Mô tả game:
${settings.prompt}

## Thông số kỹ thuật:
- **Thể loại**: ${settings.category} (${categoryMap[settings.category as keyof typeof categoryMap] || 'tổng quát'})
- **Độ khó**: ${settings.difficulty} (${difficultyMap[settings.difficulty as keyof typeof difficultyMap] || 'trung bình'})
- **Kiểu chơi**: ${settings.playerCount}
- **Thời gian mỗi lượt**: ${settings.timeLimit} giây
- **Độ phức tạp**: ${settings.complexity}/10
- **Ngôn ngữ**: ${settings.language === 'vi' ? 'Tiếng Việt' : 'English'}
- **Tối ưu Canvas**: ${settings.useCanvas ? 'BẮT BUỘC sử dụng HTML5 Canvas' : 'Chỉ dùng DOM/CSS'}
- **Âm thanh**: ${settings.includeSound ? 'Có âm thanh Web Audio API' : 'Không có âm thanh'}
- **Mobile**: ${settings.mobileOptimized ? 'Tối ưu cho touch screen' : 'Desktop only'}

## Yêu cầu đặc biệt:
${settings.customSettings || 'Không có yêu cầu đặc biệt'}

## HƯỚNG DẪN KỸ THUẬT QUAN TRỌNG:

### Cấu trúc HTML:
\`\`\`html
<!DOCTYPE html>
<html lang="${settings.language}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[Tên Game]</title>
    <style>
        /* ALL CSS HERE */
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            ${settings.mobileOptimized ? 'touch-action: manipulation; -webkit-tap-highlight-color: transparent;' : ''}
        }
        
        ${settings.mobileOptimized ? `
        @media (max-width: 768px) {
            body { font-size: 14px; padding: 10px; }
            button { min-height: 44px; min-width: 44px; font-size: 16px; }
            .game-control { touch-action: manipulation; }
        }
        ` : ''}
    </style>
</head>
<body>
    <!-- Game HTML Structure -->
    ${settings.useCanvas ? '<canvas id="gameCanvas" width="800" height="600"></canvas>' : '<div id="gameContainer"></div>'}
    
    <script>
        // ALL JAVASCRIPT HERE
        console.log('🎮 Game loading...');
        
        ${settings.useCanvas ? this.getCanvasTemplate() : this.getDOMTemplate()}
        
        // Game logic implementation
        // ...your game code here...
        
        console.log('🎮 Game initialized successfully');
    </script>
</body>
</html>
\`\`\`

### QUY TẮC BẮT BUỘC:
1. **HOÀN CHỈNH**: Game phải chạy được ngay lập tức
2. **RESPONSIVE**: Tương thích mọi thiết bị  
3. **ERROR HANDLING**: Xử lý lỗi đầy đủ
4. **PERFORMANCE**: Tối ưu fps và memory
5. **UX**: Giao diện trực quan, dễ hiểu
6. **NO EXTERNAL DEPS**: Không sử dụng thư viện ngoài

### OUTPUT FORMAT:
Chỉ trả về HTML hoàn chỉnh, KHÔNG có markdown backticks hay giải thích thêm.
Bắt đầu ngay bằng <!DOCTYPE html>

Hãy tạo game theo đúng specification trên!
`;
  }

  private getCanvasTemplate(): string {
    return `
        // Canvas setup with error handling
        const canvas = document.getElementById('gameCanvas');
        if (!canvas) {
            console.error('Canvas element not found');
            document.body.innerHTML = '<div style="color: white; text-align: center;">Canvas không được hỗ trợ</div>';
            throw new Error('Canvas not supported');
        }
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error('2D context not available');
            document.body.innerHTML = '<div style="color: white; text-align: center;">Canvas 2D không được hỗ trợ</div>';
            throw new Error('Canvas 2D not supported');
        }
        
        // Responsive canvas
        function resizeCanvas() {
            const container = canvas.parentElement;
            const maxWidth = Math.min(800, container.clientWidth - 20);
            const maxHeight = Math.min(600, container.clientHeight - 20);
            
            canvas.width = maxWidth;
            canvas.height = maxHeight;
            canvas.style.border = '2px solid #fff';
            canvas.style.borderRadius = '8px';
        }
        
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        
        // Animation loop
        let gameRunning = false;
        function gameLoop() {
            if (!gameRunning) return;
            
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Game logic here
            
            requestAnimationFrame(gameLoop);
        }
    `;
  }

  private getDOMTemplate(): string {
    return `
        // DOM-based game setup
        const gameContainer = document.getElementById('gameContainer');
        if (!gameContainer) {
            console.error('Game container not found');
            throw new Error('Game container not found');
        }
        
        // Setup game area
        gameContainer.style.cssText = \`
            width: 100%;
            max-width: 800px;
            height: 600px;
            background: rgba(255,255,255,0.1);
            border: 2px solid rgba(255,255,255,0.3);
            border-radius: 12px;
            position: relative;
            overflow: hidden;
        \`;
        
        // Game state
        let gameRunning = false;
        
        // Game loop for DOM updates
        function gameLoop() {
            if (!gameRunning) return;
            
            // Game logic here
            
            requestAnimationFrame(gameLoop);
        }
    `;
  }

  public async generateGame(settings: DetailedGameSettings): Promise<GeneratedGame> {
    const startTime = Date.now();
    console.log('🚀 [GENERATOR] Starting detailed game generation...', {
      prompt: settings.prompt.substring(0, 100) + '...',
      settings: {
        difficulty: settings.difficulty,
        category: settings.category,
        useCanvas: settings.useCanvas,
        complexity: settings.complexity
      }
    });

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        console.log(`🔄 [GENERATOR] Attempt ${attempt}/${this.maxRetries}`);
        
        const model = this.genAI.getGenerativeModel({ 
          model: 'gemini-pro',
          generationConfig: {
            temperature: 0.8,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          }
        });
        
        const prompt = this.buildDetailedPrompt(settings);
        console.log('📝 [GENERATOR] Prompt length:', prompt.length);
        console.log('📝 [GENERATOR] Prompt preview:', prompt.substring(0, 300) + '...');
        
        const result = await model.generateContent(prompt);
        const response = result.response;
        
        console.log('📥 [GENERATOR] Raw response received:', {
          candidatesCount: response.candidates?.length || 0,
          hasText: !!response.text,
          responseKeys: Object.keys(response)
        });
        
        let content = response.text();
        console.log('📄 [GENERATOR] Content extracted:', {
          length: content.length,
          hasDoctype: content.includes('<!DOCTYPE'),
          hasHtml: content.includes('<html'),
          hasCanvas: content.includes('canvas'),
          preview: content.substring(0, 200)
        });
        
        if (!content || content.length < 100) {
          throw new Error(`Content too short: ${content.length} characters`);
        }
        
        // Clean and validate content
        content = this.cleanAndValidateContent(content, settings);
        
        const generationTime = Date.now() - startTime;
        console.log('✅ [GENERATOR] Game generated successfully!', {
          generationTime: `${generationTime}ms`,
          finalLength: content.length,
          attempt
        });
        
        return {
          title: this.extractTitle(content, settings),
          content,
          metadata: {
            generationTime,
            retryCount: attempt - 1,
            model: 'gemini-pro',
            settings
          }
        };
        
      } catch (error) {
        lastError = error as Error;
        console.error(`❌ [GENERATOR] Attempt ${attempt} failed:`, {
          error: lastError.message,
          stack: lastError.stack,
          willRetry: attempt < this.maxRetries
        });
        
        if (attempt < this.maxRetries) {
          const delay = this.retryDelay * attempt;
          console.log(`⏳ [GENERATOR] Waiting ${delay}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    console.error('💥 [GENERATOR] All attempts failed. Last error:', lastError);
    throw new Error(`Failed to generate game after ${this.maxRetries} attempts: ${lastError?.message}`);
  }

  private cleanAndValidateContent(content: string, settings: DetailedGameSettings): string {
    console.log('🧹 [GENERATOR] Cleaning content...');
    
    // Remove markdown formatting
    content = content.replace(/```html\s*/g, '').replace(/```\s*/g, '').trim();
    
    // Ensure DOCTYPE
    if (!content.includes('<!DOCTYPE')) {
      content = '<!DOCTYPE html>\n' + content;
    }
    
    // Validate structure
    const requiredElements = ['<html', '<head', '<body', '</html>'];
    const missing = requiredElements.filter(el => !content.includes(el));
    
    if (missing.length > 0) {
      console.warn('⚠️ [GENERATOR] Missing elements:', missing);
      throw new Error(`Invalid HTML structure. Missing: ${missing.join(', ')}`);
    }
    
    // Add error handling if missing
    if (!content.includes('window.onerror')) {
      const errorHandler = `
    <script>
        window.onerror = function(msg, url, line, col, error) {
            console.error('🎮 Game Error:', { msg, line, col, error: error?.message });
            return false;
        };
        
        window.addEventListener('unhandledrejection', function(event) {
            console.error('🎮 Unhandled Promise Rejection:', event.reason);
        });
    </script>`;
      
      content = content.replace('</body>', errorHandler + '\n</body>');
    }
    
    console.log('✨ [GENERATOR] Content cleaned and validated');
    return content;
  }

  private extractTitle(content: string, settings: DetailedGameSettings): string {
    const titleMatch = content.match(/<title>(.*?)<\/title>/i);
    if (titleMatch && titleMatch[1]) {
      return titleMatch[1].trim();
    }
    
    const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/i);
    if (h1Match && h1Match[1]) {
      return h1Match[1].replace(/<[^>]*>/g, '').trim();
    }
    
    return `${settings.category} Game - ${settings.prompt.substring(0, 30)}...`;
  }
}

export { EnhancedGameGenerator };
export type { DetailedGameSettings, GeneratedGame };
