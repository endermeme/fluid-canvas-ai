
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface WheelSection {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  color: string;
  explanation: string;
}

interface QuestionAnswerModalProps {
  section: WheelSection;
  onAnswerSelect: (answerIndex: number) => void;
  selectedAnswer: number | null;
  showExplanation: boolean;
  onNext: () => void;
  answeredCount: number;
  totalQuestions: number;
}

const QuestionAnswerModal: React.FC<QuestionAnswerModalProps> = ({
  section,
  onAnswerSelect,
  selectedAnswer,
  showExplanation,
  onNext,
  answeredCount,
  totalQuestions
}) => {
  return (
    <div className="flex items-center justify-center min-h-[500px] p-6">
      <Card className="p-8 max-w-2xl w-full">
        <div className="text-center mb-6">
          <div 
            className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold shadow-lg"
            style={{ backgroundColor: section.color }}
          >
            🎯
          </div>
          <h3 className="text-2xl font-bold mb-2">Câu hỏi {answeredCount + 1}</h3>
          <p className="text-xl text-gray-700">{section.question}</p>
        </div>

        {!showExplanation ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {section.options.map((option, index) => (
              <Button
                key={index}
                variant={selectedAnswer === index ? 
                  (index === section.correctAnswer ? "default" : "destructive") : 
                  "outline"
                }
                className="p-6 h-auto text-left justify-start text-wrap"
                onClick={() => onAnswerSelect(index)}
                disabled={selectedAnswer !== null}
              >
                <span className="font-semibold mr-3 text-lg">{String.fromCharCode(65 + index)}.</span>
                <span className="text-base">{option}</span>
              </Button>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold mb-3 text-lg text-blue-800">Giải thích:</h4>
              <p className="text-blue-700">{section.explanation}</p>
            </div>
            <div className="text-center">
              <Button 
                onClick={onNext}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {answeredCount >= totalQuestions - 1 ? 'Kết thúc' : 'Quay tiếp'}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default QuestionAnswerModal;
