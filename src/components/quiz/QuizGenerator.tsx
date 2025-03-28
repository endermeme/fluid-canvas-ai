
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
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  async generateQuizFromContext(userMessage: string): Promise<QuizQuestion[] | null> {
    try {
      console.log("Đang tạo quiz cho chủ đề:", userMessage);
      
      const prompt = `Tạo một bài quiz tương tác về lập trình với các câu hỏi liên quan đến ${userMessage}. Bài quiz cần chứa các đoạn code minh họa và demo tương tác.

Yêu cầu chi tiết:
- Tạo 4 câu hỏi trắc nghiệm có liên quan đến ${userMessage}
- Mỗi câu hỏi phải đi kèm với một đoạn code thực tế bằng HTML, CSS, JavaScript hoặc React
- Mỗi câu hỏi nên có một demo tương tác - là một đoạn code HTML/CSS/JavaScript hoàn chỉnh để hiển thị trực quan (như một canvas, animation, hoặc component tương tác)
- Cung cấp 4 lựa chọn (A, B, C, D) cho mỗi câu hỏi
- Đánh dấu đáp án đúng
- Thêm phần giải thích ngắn gọn cho đáp án

Định dạng cho mỗi câu hỏi:
Câu hỏi: [Nội dung câu hỏi]

Code:
\`\`\`[ngôn ngữ]
[đoạn code minh họa]
\`\`\`

A. [Lựa chọn 1]
B. [Lựa chọn 2]
C. [Lựa chọn 3]
D. [Lựa chọn 4]
Đáp án đúng: [A/B/C/D]

Giải thích: [Giải thích ngắn gọn]

Demo tương tác:
\`\`\`html
<!-- Đây là đoạn HTML/CSS/JavaScript để tạo demo tương tác cho câu hỏi này -->
<!-- Code này sẽ được nhúng vào trang web để người dùng có thể tương tác -->
<!-- VD: một button để click, một animation, một component React, v.v... -->
<!DOCTYPE html>
<html>
<head>
<style>
/* CSS cho demo */
</style>
</head>
<body>
<!-- Nội dung HTML -->
<script>
// JavaScript cho demo
</script>
</body>
</html>
\`\`\`

LƯU Ý QUAN TRỌNG: 
- Đảm bảo đoạn code được hỗ trợ đầy đủ và có thể chạy được để minh họa.
- Tập trung vào khía cạnh thực hành và ứng dụng thực tế của code.
- Demo tương tác phải hoàn chỉnh và có thể hiển thị trực tiếp trên trình duyệt.
- VIẾT HOÀN TOÀN BẰNG TIẾNG VIỆT.
- Mỗi demo tương tác phải đơn giản nhưng đủ để minh họa vấn đề trong câu hỏi.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log("Kết quả quiz thô:", text);
      return this.parseQuizResponse(text);
    } catch (error) {
      console.error('Lỗi tạo Quiz:', error);
      return null;
    }
  }

  parseQuizResponse(rawText: string): QuizQuestion[] {
    try {
      console.log("Đang phân tích kết quả quiz:", rawText);
      
      // Phân tích câu hỏi từ phản hồi
      const questions: QuizQuestion[] = [];
      const questionBlocks = rawText.split('Câu hỏi:').filter(block => block.trim().length > 0);
      
      for (const questionBlock of questionBlocks) {
        const lines = questionBlock.trim().split('\n').filter(line => line.trim().length > 0);
        
        if (lines.length < 6) {
          console.warn("Bỏ qua khối câu hỏi không đúng định dạng:", questionBlock);
          continue;
        }
        
        // Tìm đoạn code
        let codeSnippet = '';
        let codeStartIndex = -1;
        let codeEndIndex = -1;
        
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].includes('```')) {
            if (codeStartIndex === -1) {
              codeStartIndex = i;
            } else {
              codeEndIndex = i;
              break;
            }
          }
        }
        
        if (codeStartIndex !== -1 && codeEndIndex !== -1) {
          codeSnippet = lines.slice(codeStartIndex + 1, codeEndIndex).join('\n');
        }
        
        // Tìm demo tương tác
        let interactiveDemo = '';
        let demoStartIndex = -1;
        let demoEndIndex = -1;
        
        // Tìm đoạn Demo tương tác
        let foundDemo = false;
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].includes('Demo tương tác:')) {
            foundDemo = true;
          }
          if (foundDemo && lines[i].includes('```html')) {
            demoStartIndex = i;
          } else if (foundDemo && demoStartIndex !== -1 && lines[i].includes('```')) {
            demoEndIndex = i;
            break;
          }
        }
        
        if (demoStartIndex !== -1 && demoEndIndex !== -1) {
          interactiveDemo = lines.slice(demoStartIndex + 1, demoEndIndex).join('\n');
        }
        
        // Tìm các lựa chọn
        const optionIndices: number[] = [];
        for (let i = 0; i < lines.length; i++) {
          if (/^[A-D]\.\s/.test(lines[i])) {
            optionIndices.push(i);
          }
        }
        
        if (optionIndices.length < 4) {
          console.warn("Không đủ lựa chọn cho câu hỏi:", questionBlock);
          continue;
        }
        
        const options = optionIndices.map(idx => {
          return lines[idx].replace(/^[A-D]\.\s*/, '').trim();
        });
        
        // Tìm đáp án đúng
        let correctAnswer = 'A'; // Mặc định nếu không tìm thấy
        const correctAnswerLine = lines.find(line => 
          line.includes('Đáp án đúng:') || 
          line.includes('Đáp án:') || 
          line.includes('Câu trả lời đúng:')
        );
        
        if (correctAnswerLine) {
          const match = correctAnswerLine.match(/[A-D]$/);
          if (match && match[0]) {
            correctAnswer = match[0];
          }
        }
        
        // Tìm giải thích
        let explanation = '';
        const explanationIndex = lines.findIndex(line => 
          line.includes('Giải thích:') || 
          line.includes('Lý giải:') || 
          line.includes('Giải thích đáp án:')
        );
        
        if (explanationIndex !== -1 && explanationIndex < lines.length - 1) {
          explanation = lines[explanationIndex + 1];
        }
        
        let questionText = lines[0].trim();
        if (codeStartIndex > 1) {
          // Nếu có nhiều dòng trước đoạn code, kết hợp chúng thành câu hỏi
          questionText = lines.slice(0, codeStartIndex).join(' ').trim();
        }
        
        questions.push({
          question: questionText,
          options,
          correctAnswer,
          codeSnippet,
          explanation,
          interactiveDemo
        });
      }
      
      console.log("Câu hỏi đã phân tích:", questions);
      return questions;
    } catch (error) {
      console.error("Lỗi phân tích kết quả quiz:", error);
      return [];
    }
  }
}

const QuizGenerator = forwardRef<{ generateQuiz: (topic: string) => void }, QuizGeneratorProps>(({ 
  topic = "Kiến thức cơ bản",
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
          title: "Bài Quiz Đã Sẵn Sàng",
          description: `Đã tạo ${questions.length} câu hỏi về "${context}"`,
        });
      } else {
        throw new Error('Không thể tạo câu hỏi');
      }
    } catch (error) {
      console.error('Lỗi Tạo Quiz:', error);
      setErrorMessage('Không thể tạo quiz. Vui lòng thử lại hoặc chọn chủ đề khác.');
      toast({
        title: "Lỗi Tạo Quiz",
        description: "Có vấn đề khi tạo bài quiz. Vui lòng thử lại với chủ đề khác.",
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
        <p>Đang tạo bài quiz tương tác từ chủ đề của bạn...</p>
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
          <h2 className="text-2xl font-bold mb-2">Kết Quả Bài Quiz</h2>
          <p className="text-xl mb-4">
            Điểm số của bạn: {score}/{quizQuestions.length}
          </p>
          
          <div className="flex justify-center">
            <Button onClick={handleRestartQuiz} className="mr-2">Làm Lại Quiz</Button>
            <Button 
              onClick={() => generateQuiz(topic)}
              variant="outline"
            >
              Tạo Quiz Mới
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
            <h3 className="text-lg font-medium">Câu hỏi {currentQuestionIndex + 1}/{quizQuestions.length}</h3>
            <div className="text-muted-foreground">Điểm: {score}/{currentQuestionIndex}</div>
          </div>
          
          <div className="text-xl font-medium">
            {currentQuestion.question}
          </div>

          {currentQuestion.codeSnippet && (
            <div className="bg-slate-900 text-white p-4 rounded-md overflow-auto font-mono text-sm">
              <pre>{currentQuestion.codeSnippet}</pre>
            </div>
          )}

          {currentQuestion.interactiveDemo && (
            <div className="border rounded-md p-4 bg-white">
              <h4 className="text-sm font-medium mb-2">Demo Tương Tác:</h4>
              <div className="bg-gray-50 rounded-md p-4 min-h-[200px] overflow-hidden">
                <iframe
                  srcDoc={currentQuestion.interactiveDemo}
                  title="Interactive Demo"
                  className="w-full h-[300px] border-none"
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
            </div>
          )}
          
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                className={`w-full text-left p-3 rounded-md border transition-all ${
                  selectedAnswer === String.fromCharCode(65 + index)
                    ? isAnswered 
                      ? selectedAnswer === currentQuestion.correctAnswer 
                        ? 'bg-green-100 dark:bg-green-900/20 border-green-300 dark:border-green-800'
                        : 'bg-red-100 dark:bg-red-900/20 border-red-300 dark:border-red-800'
                      : 'bg-primary/10 border-primary'
                    : 'border-border hover:bg-secondary'
                }`}
                onClick={() => handleOptionSelect(index)}
                disabled={isAnswered}
              >
                <div className="flex items-center">
                  <div className={`w-6 h-6 flex items-center justify-center rounded-full mr-2 ${
                    selectedAnswer === String.fromCharCode(65 + index) ? 'bg-primary text-white' : 'bg-secondary'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span>{option}</span>
                  {isAnswered && currentQuestion.correctAnswer === String.fromCharCode(65 + index) && (
                    <Check className="ml-auto text-green-500" />
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="flex justify-end space-x-3 pt-3">
            {isAnswered ? (
              <Button 
                className="flex items-center"
                variant="default"
                onClick={handleNextQuestion}
              >
                {currentQuestionIndex < quizQuestions.length - 1 ? 'Câu Hỏi Tiếp Theo' : 'Hoàn Thành Quiz'} 
                <ArrowRight size={16} className="ml-2" />
              </Button>
            ) : (
              <Button 
                className="flex items-center"
                variant="default"
                onClick={checkAnswer}
                disabled={!selectedAnswer}
              >
                Kiểm Tra Đáp Án
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

QuizGenerator.displayName = "QuizGenerator";

export default QuizGenerator;
