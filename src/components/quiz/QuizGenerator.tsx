
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Check, X, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

const GEMINI_API_KEY = 'AIzaSyAvlzK-Meq-uEiTpAs4XHnWdiAmSE1kQiA';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

interface QuizOption {
  text: string;
  label: string;
}

interface QuizData {
  question: string;
  options: QuizOption[];
  correctAnswer: string;
}

interface QuizGeneratorProps {
  topic?: string;
  onQuizComplete?: () => void;
}

const QuizGenerator: React.FC<QuizGeneratorProps> = ({ 
  topic = "General Knowledge",
  onQuizComplete
}) => {
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    generateQuiz(topic);
  }, [topic]);

  const generateQuiz = async (quizTopic: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    setIsAnswered(false);
    setSelectedAnswer(null);

    try {
      const response = await axios.post(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        contents: [{
          parts: [{
            text: `Generate an interactive multiple-choice quiz about ${quizTopic} with 4 options. 
                   Format: 
                   Question: [Question Text]
                   A. [Option 1]
                   B. [Option 2]
                   C. [Option 3]
                   D. [Option 4]
                   Correct Answer: [A/B/C/D]`
          }]
        }]
      });

      const parsedQuiz = parseQuizResponse(response.data);
      setQuizData(parsedQuiz);
    } catch (error) {
      console.error('Quiz Generation Error:', error);
      setErrorMessage('Failed to generate quiz. Please try again later.');
      toast({
        title: "Quiz Error",
        description: "There was a problem generating the quiz.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const parseQuizResponse = (response: any): QuizData => {
    try {
      const text = response.candidates[0].content.parts[0].text;
      
      // Extract question
      const questionMatch = text.match(/Question:\s*(.+?)(?=\n[A-D]\.|\n\n)/s);
      const question = questionMatch ? questionMatch[1].trim() : "No question found";
      
      // Extract options
      const optionsMatches = [...text.matchAll(/([A-D])\.?\s*(.+?)(?=\n[A-D]\.|\n\n|$)/gs)];
      const options = optionsMatches.map(match => ({
        label: match[1],
        text: match[2].trim()
      }));
      
      // Extract correct answer
      const correctAnswerMatch = text.match(/Correct Answer:\s*([A-D])/i);
      const correctAnswer = correctAnswerMatch ? correctAnswerMatch[1] : "A";
      
      return {
        question,
        options,
        correctAnswer
      };
    } catch (error) {
      console.error('Error parsing quiz response:', error);
      return {
        question: "Could not parse the quiz question properly",
        options: [
          { label: 'A', text: 'Option A' },
          { label: 'B', text: 'Option B' },
          { label: 'C', text: 'Option C' },
          { label: 'D', text: 'Option D' },
        ],
        correctAnswer: 'A'
      };
    }
  };

  const handleOptionSelect = (optionLabel: string) => {
    if (isAnswered) return;
    setSelectedAnswer(optionLabel);
  };

  const checkAnswer = () => {
    if (!selectedAnswer || !quizData) return;
    
    setIsAnswered(true);
    
    if (selectedAnswer === quizData.correctAnswer) {
      toast({
        title: "Correct!",
        description: "You got the right answer!",
        className: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900",
      });
    } else {
      toast({
        title: "Incorrect",
        description: `The correct answer was ${quizData.correctAnswer}.`,
        variant: "destructive",
      });
    }
  };

  const handleNewQuiz = () => {
    generateQuiz(topic);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-lg border border-border">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        <p>Generating quiz about {topic}...</p>
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
        <Button onClick={() => generateQuiz(topic)}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6 p-6 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-lg border border-border">
      <div className="text-xl font-medium">
        {quizData?.question}
      </div>
      
      <div className="space-y-3">
        {quizData?.options.map((option) => (
          <button
            key={option.label}
            className={`w-full text-left p-3 rounded-md border transition-all ${
              selectedAnswer === option.label 
                ? isAnswered 
                  ? selectedAnswer === quizData.correctAnswer 
                    ? 'bg-green-100 dark:bg-green-900/20 border-green-300 dark:border-green-800'
                    : 'bg-red-100 dark:bg-red-900/20 border-red-300 dark:border-red-800'
                  : 'bg-primary/10 border-primary'
                : 'border-border hover:bg-secondary'
            }`}
            onClick={() => handleOptionSelect(option.label)}
            disabled={isAnswered}
          >
            <div className="flex items-center">
              <div className={`w-6 h-6 flex items-center justify-center rounded-full mr-2 ${
                selectedAnswer === option.label ? 'bg-primary text-white' : 'bg-secondary'
              }`}>
                {option.label}
              </div>
              <span>{option.text}</span>
              {isAnswered && quizData.correctAnswer === option.label && (
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
            onClick={handleNewQuiz}
          >
            Next Quiz <ArrowRight size={16} className="ml-2" />
          </Button>
        ) : (
          <Button 
            className="flex items-center"
            variant="default"
            onClick={checkAnswer}
            disabled={!selectedAnswer}
          >
            Check Answer
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuizGenerator;
