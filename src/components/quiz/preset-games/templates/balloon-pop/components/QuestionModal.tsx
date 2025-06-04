
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Clock } from 'lucide-react';

interface QuestionModalProps {
  question: any;
  questionIndex: number;
  selectedAnswer: number | null;
  showExplanation: boolean;
  onAnswerSelect: (index: number) => void;
  onNext: () => void;
  score: number;
  timeLeft: number;
  totalQuestions: number;
}

const QuestionModal: React.FC<QuestionModalProps> = ({
  question,
  questionIndex,
  selectedAnswer,
  showExplanation,
  onAnswerSelect,
  onNext,
  score,
  timeLeft,
  totalQuestions
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="question-modal-overlay">
      <div className="question-modal-container">
        <div className="question-header">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-white">🎈 Bóng Bay Nổ</h1>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <Clock className="h-4 w-4 text-white" />
                <span className="text-white">{formatTime(timeLeft)}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-yellow-500/90 backdrop-blur-sm rounded-full px-4 py-2">
                <span className="text-white font-bold">🏆 {score} điểm</span>
              </div>
              <div className="bg-blue-500/90 backdrop-blur-sm rounded-full px-4 py-2">
                <span className="text-white">
                  {questionIndex + 1}/{totalQuestions}
                </span>
              </div>
            </div>
          </div>

          <Progress value={(questionIndex / totalQuestions) * 100} className="mb-6 h-2" />
        </div>

        <Card className="question-card">
          <div className="text-center mb-8">
            <div className="balloon-pop-animation mb-6">
              <div className="popped-balloon">💥</div>
            </div>
            <h3 className="text-3xl font-bold mb-4 text-gray-800">
              Câu hỏi {questionIndex + 1}
            </h3>
            <p className="text-xl text-gray-700 leading-relaxed">
              {question.question}
            </p>
          </div>

          {!showExplanation ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {question.options.map((option: string, index: number) => (
                <Button
                  key={index}
                  variant={selectedAnswer === index ? 
                    (index === question.correctAnswer ? "default" : "destructive") : 
                    "outline"
                  }
                  className="answer-option"
                  onClick={() => onAnswerSelect(index)}
                  disabled={selectedAnswer !== null}
                >
                  <span className="font-bold mr-3 text-xl">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  <span className="text-lg">{option}</span>
                </Button>
              ))}
            </div>
          ) : (
            <div className="explanation-section">
              <div className="explanation-card">
                <h4 className="font-bold mb-3 text-lg text-blue-800">
                  💡 Giải thích:
                </h4>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {question.explanation}
                </p>
              </div>
              <div className="text-center mt-6">
                <Button onClick={onNext} size="lg" className="next-button">
                  {questionIndex >= totalQuestions - 1 ? '🏁 Kết thúc' : '➡️ Câu tiếp theo'}
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default QuestionModal;
