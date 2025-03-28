
import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Button } from '@/components/ui/button';
import { Check, X, ArrowRight, Loader2, Gamepad } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyAvlzK-Meq-uEiTpAs4XHnWdiAmSE1kQiA';

interface MiniGame {
  title: string;
  description: string;
  htmlContent: string;
}

interface QuizGeneratorProps {
  topic?: string;
  onQuizComplete?: () => void;
}

class AIGameGenerator {
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

const QuizGenerator = forwardRef<{ generateQuiz: (topic: string) => void }, QuizGeneratorProps>(({ 
  topic = "Minigame tương tác",
  onQuizComplete
}, ref) => {
  const [miniGame, setMiniGame] = useState<MiniGame | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();
  const [gameGenerator] = useState<AIGameGenerator>(new AIGameGenerator(API_KEY));

  useImperativeHandle(ref, () => ({
    generateQuiz: (topic: string) => {
      generateMiniGame(topic);
    }
  }));

  const generateMiniGame = async (topic: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    setMiniGame(null);

    try {      
      const game = await gameGenerator.generateMiniGame(topic);
      
      if (game) {
        setMiniGame(game);
        toast({
          title: "Minigame Đã Sẵn Sàng",
          description: `Đã tạo minigame về "${topic}"`,
        });
      } else {
        throw new Error('Không thể tạo minigame');
      }
    } catch (error) {
      console.error('Lỗi Tạo Minigame:', error);
      setErrorMessage('Không thể tạo minigame. Vui lòng thử lại hoặc chọn chủ đề khác.');
      toast({
        title: "Lỗi Tạo Minigame",
        description: "Có vấn đề khi tạo minigame. Vui lòng thử lại với chủ đề khác.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-lg">Đang tạo minigame từ chủ đề của bạn...</p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full space-y-6">
        <div className="text-red-500">
          <X size={48} />
        </div>
        <p className="text-lg text-center">{errorMessage}</p>
        <Button onClick={() => generateMiniGame(topic || "minigame vui")} size="lg">Thử Lại</Button>
      </div>
    );
  }

  if (!miniGame) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full space-y-6 py-10">
        <div className="text-primary mb-4">
          <Gamepad size={64} />
        </div>
        <h2 className="text-2xl font-bold text-center">Chào mừng đến với Trò Chơi Mini</h2>
        <p className="text-center max-w-md">
          Nhập chủ đề vào thanh chat bên trái để tạo một minigame vui nhộn và tương tác.
        </p>
        <div className="flex flex-wrap justify-center gap-3 max-w-lg mt-4">
          {["Đố vui", "Xếp hình", "Nhớ hình", "Phản xạ", "Truy tìm", "Câu đố", "Vẽ tranh"].map((idea) => (
            <Button 
              key={idea}
              variant="outline" 
              className="rounded-full"
              onClick={() => generateMiniGame(idea)}
            >
              {idea}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-hidden">
      {miniGame && (
        <div className="flex flex-col h-full">
          <iframe
            srcDoc={miniGame.htmlContent}
            title={miniGame.title}
            sandbox="allow-scripts allow-same-origin"
            className="w-full h-full border-none"
            style={{ height: '100%', width: '100%' }}
          />
        </div>
      )}
    </div>
  );
});

QuizGenerator.displayName = "QuizGenerator";

export default QuizGenerator;
