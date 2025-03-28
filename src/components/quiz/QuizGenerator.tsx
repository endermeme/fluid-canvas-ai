
import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Button } from '@/components/ui/button';
import { Check, X, ArrowRight, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyAvlzK-Meq-uEiTpAs4XHnWdiAmSE1kQiA';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  codeSnippet?: string;
  explanation?: string;
  interactiveDemo?: string; // HTML/CSS/JS to render an interactive demo
}

interface QuizGeneratorProps {
  topic?: string;
  onQuizComplete?: () => void;
}

class AIQuizGenerator {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  }

  async generateQuizFromContext(userMessage: string): Promise<QuizQuestion[] | null> {
    try {
      console.log("Đang tạo web cho chủ đề:", userMessage);
      
      const prompt = `Tạo một trang web tương tác hoàn chỉnh về chủ đề ${userMessage}. Trang web cần bao gồm toàn bộ HTML, CSS và JavaScript trong một file duy nhất, và không được sử dụng liên kết tới các tài nguyên bên ngoài.

Yêu cầu chi tiết:
- Tạo một trang web hoàn chỉnh và đẹp mắt về chủ đề ${userMessage}.
- Toàn bộ HTML, CSS và JavaScript phải nằm trong một file HTML duy nhất.
- Trang web phải có tính tương tác cao và trải nghiệm người dùng tốt.
- Thiết kế phải đẹp mắt, hiện đại, màu sắc hài hòa và responsive.
- Sử dụng giao diện màu mè, sinh động với nhiều màu sắc hài hòa.
- Đảm bảo menu hiển thị đầy đủ và không bị giới hạn trong một góc.
- Bố cục phải cân đối, sử dụng đủ chiều rộng của trang.
- Sử dụng CSS hiện đại, có thể sử dụng Flexbox hoặc Grid.
- Phải tương thích với các trình duyệt hiện đại.
- VIẾT HOÀN TOÀN BẰNG TIẾNG VIỆT nếu có nội dung hiển thị.

Định dạng trả về:
Chỉ trả về một file HTML hoàn chỉnh bao gồm tất cả HTML, CSS và JavaScript.

\`\`\`html
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Trang Web Tương Tác</title>
    <style>
        /* CSS ở đây */
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
- Không sử dụng các framework bên ngoài như React, Vue, Bootstrap, v.v... mà không đưa vào file.
- Tất cả mã JavaScript phải nằm trong thẻ <script> của file HTML.
- Tất cả CSS phải nằm trong thẻ <style> của file HTML.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log("Kết quả web thô:", text);
      return this.parseQuizResponse(text);
    } catch (error) {
      console.error('Lỗi tạo Web:', error);
      return null;
    }
  }

  parseQuizResponse(rawText: string): QuizQuestion[] {
    try {
      console.log("Đang phân tích kết quả web:", rawText);
      
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
        return [];
      }

      // Tạo một quiz duy nhất chứa toàn bộ nội dung web
      const questions: QuizQuestion[] = [
        {
          question: 'Trang Web Tương Tác',
          options: ['Xem Trang Web', 'Tùy Chọn B', 'Tùy Chọn C', 'Tùy Chọn D'],
          correctAnswer: 'A',
          interactiveDemo: htmlContent
        }
      ];
      
      console.log("Web đã phân tích:", questions);
      return questions;
    } catch (error) {
      console.error("Lỗi phân tích kết quả web:", error);
      return [];
    }
  }
}

const QuizGenerator = forwardRef<{ generateQuiz: (topic: string) => void }, QuizGeneratorProps>(({ 
  topic = "Web tương tác",
  onQuizComplete
}, ref) => {
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();
  const [quizGenerator] = useState<AIQuizGenerator>(new AIQuizGenerator(API_KEY));
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useImperativeHandle(ref, () => ({
    generateQuiz: (topic: string) => {
      generateQuiz(topic);
    }
  }));

  const generateQuiz = async (context: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    setIsAnswered(false);
    setSelectedAnswer(null);
    setCurrentQuestionIndex(0);
    setQuizQuestions([]);
    setScore(0);
    setQuizCompleted(false);

    try {      
      const questions = await quizGenerator.generateQuizFromContext(context);
      
      if (questions && questions.length > 0) {
        setQuizQuestions(questions);
        toast({
          title: "Trang Web Đã Sẵn Sàng",
          description: `Đã tạo trang web tương tác về "${context}"`,
        });
      } else {
        throw new Error('Không thể tạo trang web');
      }
    } catch (error) {
      console.error('Lỗi Tạo Web:', error);
      setErrorMessage('Không thể tạo trang web. Vui lòng thử lại hoặc chọn chủ đề khác.');
      toast({
        title: "Lỗi Tạo Web",
        description: "Có vấn đề khi tạo trang web. Vui lòng thử lại với chủ đề khác.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionSelect = (optionIndex: number) => {
    if (isAnswered) return;
    
    const optionLetter = String.fromCharCode(65 + optionIndex);
    setSelectedAnswer(optionLetter);
  };

  const checkAnswer = () => {
    if (!selectedAnswer || currentQuestionIndex >= quizQuestions.length) return;
    
    setIsAnswered(true);
    const currentQuestion = quizQuestions[currentQuestionIndex];
    
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(score + 1);
      toast({
        title: "Chính xác!",
        description: currentQuestion.explanation || "Bạn đã trả lời đúng!",
        className: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900",
      });
    } else {
      toast({
        title: "Chưa chính xác",
        description: `Đáp án đúng là ${currentQuestion.correctAnswer}. ${currentQuestion.explanation || ''}`,
        variant: "destructive",
      });
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setQuizCompleted(true);
      if (onQuizComplete) {
        onQuizComplete();
      }
      toast({
        title: "Hoàn thành Quiz!",
        description: `Điểm số của bạn: ${score + (selectedAnswer === quizQuestions[currentQuestionIndex].correctAnswer ? 1 : 0)}/${quizQuestions.length}`,
      });
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setQuizCompleted(false);
  };

  const currentQuestion = quizQuestions[currentQuestionIndex];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-lg border border-border">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p>Đang tạo trang web tương tác từ chủ đề của bạn...</p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-lg border border-border">
        <div className="text-red-500 mb-2">
          <X size={36} />
        </div>
        <p>{errorMessage}</p>
        <Button onClick={() => generateQuiz(topic)}>Thử Lại</Button>
      </div>
    );
  }

  if (quizCompleted) {
    return (
      <div className="flex flex-col space-y-6 p-6 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-lg border border-border">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Trang Web Đã Hoàn Thành</h2>
          
          <div className="flex justify-center">
            <Button onClick={() => generateQuiz(topic)} className="mr-2">
              Tạo Trang Web Mới
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {quizQuestions.length > 0 && currentQuestion && (
        <div className="flex flex-col space-y-6 p-6 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-lg border border-border">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Trang Web Tương Tác</h3>
          </div>

          {currentQuestion.interactiveDemo && (
            <div className="border rounded-md w-full">
              <div className="bg-white rounded-md overflow-hidden">
                <iframe
                  srcDoc={currentQuestion.interactiveDemo}
                  title="Interactive Web"
                  className="w-full h-[600px] border-none"
                  sandbox="allow-scripts allow-same-origin"
                  style={{ width: '100%', minHeight: '600px' }}
                />
              </div>
            </div>
          )}
          
          <div className="flex justify-center space-x-3 pt-3">
            <Button 
              className="flex items-center"
              variant="outline"
              onClick={() => generateQuiz(topic)}
            >
              Tạo Trang Web Mới
            </Button>
          </div>
        </div>
      )}
    </div>
  );
});

QuizGenerator.displayName = "QuizGenerator";

export default QuizGenerator;

