
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_MODELS } from '@/constants/api-constants';

interface GameGenerationSettings {
  category: string;
  difficulty?: string;
  useCanvas?: boolean;
}

interface GeneratedGame {
  title?: string;
  content: string;
  useCanvas?: boolean;
}

class AIGameGenerator {
  private static instance: AIGameGenerator;
  private genAI: GoogleGenerativeAI;
  private canvasMode: boolean = true;

  private constructor() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('VITE_GEMINI_API_KEY không được cấu hình');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  public static getInstance(): AIGameGenerator {
    if (!AIGameGenerator.instance) {
      AIGameGenerator.instance = new AIGameGenerator();
    }
    return AIGameGenerator.instance;
  }

  public setCanvasMode(useCanvas: boolean): void {
    this.canvasMode = useCanvas;
  }

  private buildGamePrompt(topic: string, settings: GameGenerationSettings): string {
    return `Tạo một minigame HTML5 hoàn chỉnh với chủ đề: "${topic}"

YÊU CẦU CHÍNH:
- Trò chơi phải hoàn chỉnh và có thể chạy độc lập
- Sử dụng HTML5 Canvas cho đồ họa tương tác
- Có âm thanh và hiệu ứng hấp dẫn
- Responsive design phù hợp mọi thiết bị
- Có hệ thống điểm số và feedback

CẤU TRÚC OUTPUT:
Trả về CHÍNH XÁC theo format:
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Game Title</title>
    <style>
        /* CSS styles here */
    </style>
</head>
<body>
    <!-- Game HTML here -->
    <script>
        // JavaScript game logic here
    </script>
</body>
</html>

ĐIỀU KIỆN QUAN TRỌNG:
- Game phải sử dụng Canvas để vẽ đồ họa
- Có animation và chuyển động mượt mà
- Bao gồm âm thanh khi có thể (Web Audio API)
- Có màn hình bắt đầu và kết thúc
- Hiển thị điểm số và thời gian
- Responsive cho mobile và desktop

Chủ đề: ${topic}
Danh mục: ${settings.category}
Độ khó: ${settings.difficulty || 'medium'}`;
  }

  public async generateMiniGame(topic: string, settings: GameGenerationSettings): Promise<GeneratedGame> {
    try {
      console.log('Đang tạo game với AI:', { topic, settings });
      
      const model = this.genAI.getGenerativeModel({ 
        model: GEMINI_MODELS.GEMINI_PRO 
      });
      
      const prompt = this.buildGamePrompt(topic, settings);
      const result = await model.generateContent(prompt);
      const response = result.response;
      let content = response.text();

      // Làm sạch và xử lý response
      content = this.cleanResponse(content);
      
      if (!content || content.length < 100) {
        throw new Error('Response quá ngắn hoặc không hợp lệ');
      }

      // Tạo title từ topic
      const title = this.generateTitle(topic, settings);

      console.log('Game đã được tạo thành công:', title);
      
      return {
        title,
        content,
        useCanvas: this.canvasMode
      };
    } catch (error) {
      console.error('Lỗi khi tạo game:', error);
      throw error;
    }
  }

  private cleanResponse(content: string): string {
    // Loại bỏ markdown code blocks
    content = content.replace(/```html\s*/g, '').replace(/```\s*/g, '');
    
    // Đảm bảo có DOCTYPE
    if (!content.includes('<!DOCTYPE')) {
      content = '<!DOCTYPE html>\n' + content;
    }
    
    return content.trim();
  }

  private generateTitle(topic: string, settings: GameGenerationSettings): string {
    const category = settings.category || 'Game';
    return `${category} - ${topic}`;
  }
}

export { AIGameGenerator };
export type { GeneratedGame, GameGenerationSettings };
