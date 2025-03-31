
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GameSettingsData } from '@/pages/Quiz';

export interface MiniGame {
  title: string;
  description: string;
  htmlContent: string;
}

export class AIGameGenerator {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  }

  async generateMiniGame(userMessage: string, settings?: GameSettingsData): Promise<MiniGame | null> {
    try {
      console.log("Đang tạo minigame cho chủ đề:", userMessage);
      console.log("Với các cài đặt:", settings);
      
      // Default settings
      const gameSettings = settings || {
        difficulty: 'medium',
        questionCount: 10,
        timePerQuestion: 30,
        category: 'general'
      };
      
      const difficultyDescriptions = {
        easy: "dễ, phù hợp cho trẻ em hoặc người mới bắt đầu",
        medium: "độ khó vừa phải, phù hợp cho hầu hết người chơi",
        hard: "khó, đòi hỏi suy nghĩ nhanh và kiến thức sâu"
      };
      
      const categoryDescriptions = {
        general: "kiến thức chung về nhiều lĩnh vực",
        history: "các sự kiện lịch sử, nhân vật và giai đoạn lịch sử quan trọng",
        science: "khoa học, phát minh, và nguyên lý khoa học",
        geography: "địa lý, quốc gia, thủ đô và địa hình",
        arts: "nghệ thuật, âm nhạc, hội họa và văn học",
        sports: "thể thao, vận động viên và giải đấu",
        math: "toán học, câu đố logic và tính toán"
      };
      
      const prompt = `Tạo một minigame tương tác và vui nhộn về chủ đề "${userMessage}" với mức độ ${gameSettings.difficulty} (${difficultyDescriptions[gameSettings.difficulty as keyof typeof difficultyDescriptions]}) phù hợp với lĩnh vực ${gameSettings.category} (${categoryDescriptions[gameSettings.category as keyof typeof categoryDescriptions]}).

Yêu cầu chi tiết:
- Phân tích yêu cầu của người dùng và tạo trò chơi tương tác phù hợp dựa trên chủ đề "${userMessage}"
- Nếu chủ đề giống như câu đố kiến thức, hãy tạo trò chơi trắc nghiệm với ${gameSettings.questionCount} câu hỏi và thời gian ${gameSettings.timePerQuestion} giây/câu
- Nếu chủ đề là về phản xạ, hãy tạo trò chơi phản xạ nhanh với các yếu tố hấp dẫn
- Nếu chủ đề là về xếp hình, hãy tạo trò chơi xếp hình tương tác
- Nếu chủ đề là về trò chơi ký ức, hãy tạo trò chơi lật thẻ nhớ hình
- Nếu chủ đề là về từ vựng, hãy tạo trò chơi từ vựng thú vị
- Nếu là yêu cầu khác, hãy tạo trò chơi tương ứng phù hợp với chủ đề
- Toàn bộ trò chơi phải nằm trong một file HTML duy nhất
- Minigame phải có tính tương tác cao, dễ chơi và thú vị
- Thiết kế phải màu sắc, bắt mắt, sinh động với nhiều màu sắc hài hòa
- Có điểm số và hệ thống phản hồi cho người chơi
- Có hướng dẫn rõ ràng và dễ hiểu
- Đảm bảo trò chơi đơn giản, không phức tạp, phù hợp để chơi trong vài phút
- Phải tương thích với các trình duyệt hiện đại
- VIẾT HOÀN TOÀN BẰNG TIẾNG VIỆT (nếu có nội dung hiển thị)
- Trò chơi phải có đồ họa bắt mắt, màu sắc phù hợp, và hiệu ứng âm thanh nếu cần

Định dạng trả về:
Chỉ trả về một file HTML hoàn chỉnh bao gồm tất cả mã cần thiết.

\`\`\`html
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Minigame: ${userMessage}</title>
    <style>
        /* CSS ở đây */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            user-select: none;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            overflow: hidden;
            height: 100vh;
            display: flex;
            flex-direction: column;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        /* Thêm CSS của bạn ở đây */
    </style>
</head>
<body>
    <!-- HTML ở đây -->
    
    <script>
        // Mã JavaScript ở đây
    </script>
</body>
</html>
\`\`\`

LƯU Ý QUAN TRỌNG: 
- KHÔNG trả về bất kỳ giải thích nào, chỉ trả về một file HTML hoàn chỉnh.
- Đảm bảo code chạy được ngay mà không cần sửa đổi thêm.
- Không sử dụng các thư viện bên ngoài.
- Tất cả mã phải nằm trong file HTML.
- Minigame phải đủ đơn giản để người chơi hiểu ngay và chơi được trong vài phút.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log("Kết quả minigame thô:", text.substring(0, 200) + "...");
      return this.parseMiniGameResponse(text, userMessage);
    } catch (error) {
      console.error('Lỗi tạo Minigame:', error);
      return null;
    }
  }

  parseMiniGameResponse(rawText: string, topic: string): MiniGame | null {
    try {
      console.log("Đang phân tích kết quả minigame...");
      
      // Tìm nội dung HTML
      let htmlContent = '';
      const htmlMatch = rawText.match(/```html([\s\S]*?)```/);
      
      if (htmlMatch && htmlMatch[1]) {
        htmlContent = htmlMatch[1].trim();
      } else if (!rawText.includes('```')) {
        // Nếu không có định dạng markdown, xử lý text thô
        htmlContent = rawText.trim();
      }
      
      if (!htmlContent) {
        console.error('Không tìm thấy nội dung HTML hợp lệ');
        return null;
      }

      // Tạo đối tượng MiniGame
      return {
        title: `Minigame: ${topic}`,
        description: `Minigame tương tác về chủ đề ${topic}`,
        htmlContent: htmlContent
      };
    } catch (error) {
      console.error("Lỗi phân tích kết quả minigame:", error);
      return null;
    }
  }
}
