
import { GoogleGenerativeAI } from '@google/generative-ai';

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

  async generateMiniGame(userMessage: string): Promise<MiniGame | null> {
    try {
      console.log("Đang tạo minigame cho chủ đề:", userMessage);
      
      const prompt = `Tạo một minigame đơn giản và vui nhộn về chủ đề "${userMessage}". Minigame phải gọn nhẹ, dễ chơi và có tính tương tác cao.

Yêu cầu chi tiết:
- Tạo một minigame đơn giản, vui nhộn về chủ đề ${userMessage}
- Toàn bộ HTML, CSS và JavaScript phải nằm trong một file HTML duy nhất
- Minigame phải có tính tương tác cao, dễ chơi và thú vị
- Thiết kế phải màu sắc, bắt mắt, sinh động với nhiều màu sắc hài hòa
- Có điểm số hoặc thông báo kết quả cho người chơi
- Có hướng dẫn rõ ràng và dễ hiểu
- Đảm bảo trò chơi đơn giản, không phức tạp, phù hợp để chơi trong vài phút
- Phải tương thích với các trình duyệt hiện đại
- VIẾT HOÀN TOÀN BẰNG TIẾNG VIỆT (nếu có nội dung hiển thị)

Một số ý tưởng minigame phù hợp:
- Trò chơi câu hỏi/đố vui
- Trò chơi phản xạ/nhấp chuột
- Trò chơi ghép cặp/nhớ hình
- Trò chơi né vật thể
- Trò chơi xếp hình đơn giản
- Trò chơi sắp xếp/phân loại
- Trò chơi vẽ và đoán

Định dạng trả về:
Chỉ trả về một file HTML hoàn chỉnh bao gồm tất cả HTML, CSS và JavaScript.

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
        // JavaScript ở đây
    </script>
</body>
</html>
\`\`\`

LƯU Ý QUAN TRỌNG: 
- KHÔNG trả về bất kỳ giải thích nào, chỉ trả về một file HTML hoàn chỉnh.
- Đảm bảo code chạy được ngay mà không cần sửa đổi thêm.
- Không sử dụng các framework bên ngoài.
- Tất cả mã JavaScript phải nằm trong thẻ <script> của file HTML.
- Tất cả CSS phải nằm trong thẻ <style> của file HTML.
- Minigame phải đủ đơn giản để người chơi hiểu ngay và chơi được trong vài phút.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log("Kết quả minigame thô:", text);
      return this.parseMiniGameResponse(text, userMessage);
    } catch (error) {
      console.error('Lỗi tạo Minigame:', error);
      return null;
    }
  }

  parseMiniGameResponse(rawText: string, topic: string): MiniGame | null {
    try {
      console.log("Đang phân tích kết quả minigame:", rawText);
      
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
