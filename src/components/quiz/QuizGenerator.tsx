
import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Button } from '@/components/ui/button';
import { Check, X, ArrowRight, Loader2, Gamepad, Share2, Link2, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { saveGameForSharing } from '@/utils/gameExport';
import { GameSettingsData } from '@/pages/Quiz';

const API_KEY = 'AIzaSyAvlzK-Meq-uEiTpAs4XHnWdiAmSE1kQiA';

interface MiniGame {
  title: string;
  description: string;
  htmlContent: string;
}

interface QuizGeneratorProps {
  topic?: string;
  onQuizComplete?: () => void;
  gameSettings?: GameSettingsData;
}

class AIGameGenerator {
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
        easy: "câu hỏi đơn giản, phù hợp cho trẻ em hoặc người mới bắt đầu",
        medium: "câu hỏi có độ khó vừa phải, phù hợp cho hầu hết người chơi",
        hard: "câu hỏi khó, đòi hỏi kiến thức chuyên sâu và tư duy nhanh"
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
      
      const prompt = `Tạo một minigame đơn giản và vui nhộn về chủ đề "${userMessage}" với ${gameSettings.questionCount} câu hỏi ở mức độ ${gameSettings.difficulty} (${difficultyDescriptions[gameSettings.difficulty as keyof typeof difficultyDescriptions]}) tập trung vào lĩnh vực ${gameSettings.category} (${categoryDescriptions[gameSettings.category as keyof typeof categoryDescriptions]}). Thời gian trả lời mỗi câu hỏi là ${gameSettings.timePerQuestion} giây.

Yêu cầu chi tiết:
- Tạo một minigame câu hỏi trắc nghiệm với đúng ${gameSettings.questionCount} câu hỏi
- Toàn bộ HTML, CSS và JavaScript phải nằm trong một file HTML duy nhất
- Minigame phải có tính tương tác cao, dễ chơi và thú vị
- Thiết kế phải màu sắc, bắt mắt, sinh động với nhiều màu sắc hài hòa
- Có điểm số và thời gian đếm ngược ${gameSettings.timePerQuestion} giây cho mỗi câu hỏi
- Có hướng dẫn rõ ràng và dễ hiểu
- Đảm bảo trò chơi đơn giản, không phức tạp, phù hợp để chơi trong vài phút
- Phải tương thích với các trình duyệt hiện đại
- VIẾT HOÀN TOÀN BẰNG TIẾNG VIỆT (nếu có nội dung hiển thị)
- KHÔNG sử dụng thư viện bên ngoài, chỉ dùng JavaScript thuần

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
- Minigame phải đủ đơn giản để người chơi hiểu ngay và chơi được trong vài phút.
- Không tạo minigame phức tạp như game platformer, game 3D, hoặc game cần đồ họa phức tạp.`;

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

const QuizGenerator = forwardRef<{ generateQuiz: (topic: string, settings?: GameSettingsData) => void }, QuizGeneratorProps>(({ 
  topic = "Minigame tương tác",
  onQuizComplete,
  gameSettings
}, ref) => {
  const [miniGame, setMiniGame] = useState<MiniGame | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();
  const [gameGenerator] = useState<AIGameGenerator>(new AIGameGenerator(API_KEY));

  useImperativeHandle(ref, () => ({
    generateQuiz: (topic: string, settings?: GameSettingsData) => {
      generateMiniGame(topic, settings);
    }
  }));

  const generateMiniGame = async (topic: string, settings?: GameSettingsData) => {
    setIsLoading(true);
    setErrorMessage(null);
    setMiniGame(null);
    setShareUrl(null);

    try {      
      const game = await gameGenerator.generateMiniGame(topic, settings);
      
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

  const handleShareGame = () => {
    if (!miniGame) return;
    
    try {
      const url = saveGameForSharing(
        miniGame.title,
        miniGame.description,
        miniGame.htmlContent
      );
      
      setShareUrl(url);
      
      // Copy to clipboard automatically
      navigator.clipboard.writeText(url).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      });
      
      toast({
        title: "Đã Tạo Liên Kết Chia Sẻ",
        description: "Liên kết có hiệu lực trong 48 giờ và đã được sao chép vào clipboard.",
      });
    } catch (error) {
      console.error('Lỗi khi chia sẻ game:', error);
      toast({
        title: "Lỗi Chia Sẻ",
        description: "Không thể tạo liên kết chia sẻ. Vui lòng thử lại.",
        variant: "destructive"
      });
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast({
        title: "Đã Sao Chép",
        description: "Liên kết đã được sao chép vào clipboard."
      });
    }).catch(err => {
      console.error('Lỗi khi sao chép:', err);
      toast({
        title: "Lỗi Sao Chép",
        description: "Không thể sao chép liên kết. Vui lòng thử lại.",
        variant: "destructive"
      });
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full space-y-4 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 backdrop-blur-sm">
        <div className="glass-morphism p-8 rounded-xl flex flex-col items-center">
          <Loader2 className="w-16 h-16 animate-spin text-primary mb-4" />
          <p className="text-xl font-medium">Đang tạo minigame từ chủ đề "{topic}"...</p>
          <p className="text-sm text-muted-foreground mt-2">Vui lòng đợi trong giây lát</p>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full space-y-6 bg-gradient-to-r from-red-500/10 to-orange-500/10">
        <div className="glass-morphism p-8 rounded-xl max-w-md text-center">
          <div className="bg-red-500/20 p-4 rounded-full inline-flex mb-4">
            <X size={48} className="text-red-500" />
          </div>
          <p className="text-xl font-medium mb-4">{errorMessage}</p>
          <Button 
            onClick={() => generateMiniGame(topic || "minigame vui")} 
            size="lg" 
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
          >
            Thử Lại
          </Button>
        </div>
      </div>
    );
  }

  if (!miniGame) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full space-y-6 py-10 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
        <div className="glass-morphism p-8 rounded-xl max-w-lg">
          <div className="text-primary mb-6 flex justify-center">
            <Gamepad size={80} className="text-primary/80" />
          </div>
          <h2 className="text-3xl font-bold text-center mb-4">Chào mừng đến với Trò Chơi Mini</h2>
          <p className="text-center text-lg mb-8">
            Nhập chủ đề vào thanh chat bên trái hoặc chọn một ý tưởng bên dưới để tạo minigame vui nhộn và tương tác.
          </p>
          <p className="text-center text-muted-foreground mb-6">Hoặc chọn một trong các ý tưởng sau:</p>
          
          <div className="flex flex-wrap justify-center gap-3 max-w-lg">
            {["Đố vui", "Xếp hình", "Nhớ hình", "Phản xạ", "Truy tìm", "Câu đố", "Vẽ tranh"].map((idea) => (
              <Button 
                key={idea}
                variant="outline" 
                className="rounded-full px-4 py-2 bg-white/50 dark:bg-black/20 backdrop-blur-sm border-primary/20 hover:bg-primary/20"
                onClick={() => generateMiniGame(idea)}
              >
                {idea}
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-hidden flex flex-col bg-gradient-to-r from-indigo-500/5 to-purple-500/5">
      {miniGame && (
        <>
          <div className="bg-background/80 backdrop-blur-sm border-b p-3 flex items-center justify-between">
            <h3 className="text-base font-medium truncate mr-2">
              {miniGame.title}
            </h3>
            <div className="flex items-center gap-2">
              {shareUrl ? (
                <div className="flex items-center gap-2 bg-muted/80 backdrop-blur-sm p-2 rounded-lg max-w-sm">
                  <input 
                    type="text" 
                    value={shareUrl} 
                    readOnly 
                    className="bg-transparent text-sm flex-1 min-w-0 outline-none px-2"
                  />
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-8 px-2 hover:bg-primary/10"
                    onClick={() => copyToClipboard(shareUrl)}
                  >
                    {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={handleShareGame} 
                  variant="outline" 
                  size="sm" 
                  className="h-9 bg-white/50 dark:bg-black/20 backdrop-blur-sm hover:bg-primary/20"
                >
                  <Share2 className="h-4 w-4 mr-1" />
                  Chia Sẻ (48h)
                </Button>
              )}
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <iframe
              srcDoc={miniGame.htmlContent}
              title={miniGame.title}
              sandbox="allow-scripts allow-same-origin"
              className="w-full h-full border-none"
              style={{ height: '100%', width: '100%' }}
            />
          </div>
        </>
      )}
    </div>
  );
});

QuizGenerator.displayName = "QuizGenerator";

export default QuizGenerator;
