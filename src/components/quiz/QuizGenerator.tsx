
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, X, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

const GEMINI_API_KEY = 'AIzaSyAvlzK-Meq-uEiTpAs4XHnWdiAmSE1kQiA';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface QuizGeneratorProps {
  topic?: string;
  onQuizComplete?: () => void;
}

class GeminiQuizGenerator {
  private apiKey: string;
  private GEMINI_API_URL: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
  }

  async generateQuizFromContext(userMessage: string): Promise<QuizQuestion[] | null> {
    try {
      const response = await axios.post(`${this.GEMINI_API_URL}?key=${this.apiKey}`, {
        contents: [{
          parts: [{
            text: `Based on the following context, create an interactive multiple-choice quiz:

Context: ${userMessage}

Quiz Requirements:
- Generate 4 multiple-choice questions
- Each question should test understanding of key details
- Provide 4 options (A, B, C, D) for each question
- Include the correct answer

Format for each question:
Question: [Question Text]
A. [Option 1]
B. [Option 2]
C. [Option 3]
D. [Option 4]
Correct Answer: [A/B/C/D]`
          }]
        }]
      });

      return this.parseQuizResponse(response.data);
    } catch (error) {
      console.error('Quiz Generation Error:', error);
      return null;
    }
  }

  parseQuizResponse(response: any): QuizQuestion[] {
    const rawText = response.candidates[0].content.parts[0].text;
    
    // Parse questions from the response
    const questions = rawText.split('Question:').slice(1).map(questionBlock => {
      const lines = questionBlock.trim().split('\n');
      return {
        question: lines[0].trim(),
        options: [
          lines[1].replace('A. ', '').trim(),
          lines[2].replace('B. ', '').trim(),
          lines[3].replace('C. ', '').trim(),
          lines[4].replace('D. ', '').trim()
        ],
        correctAnswer: lines[5].replace('Correct Answer: ', '').trim()
      };
    });

    return questions;
  }
}

const QuizGenerator: React.FC<QuizGeneratorProps> = ({ 
  topic = "General Knowledge",
  onQuizComplete
}) => {
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [userInput, setUserInput] = useState(topic);
  const { toast } = useToast();
  const quizGeneratorRef = useRef<GeminiQuizGenerator | null>(null);

  useEffect(() => {
    // Initialize the quiz generator
    quizGeneratorRef.current = new GeminiQuizGenerator(GEMINI_API_KEY);
    
    // Generate quiz on mount with the default topic
    if (topic) {
      generateQuiz(topic);
    }
  }, []);

  const generateQuiz = async (context: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    setIsAnswered(false);
    setSelectedAnswer(null);
    setCurrentQuestionIndex(0);

    try {
      if (!quizGeneratorRef.current) {
        quizGeneratorRef.current = new GeminiQuizGenerator(GEMINI_API_KEY);
      }
      
      const questions = await quizGeneratorRef.current.generateQuizFromContext(context);
      
      if (questions && questions.length > 0) {
        setQuizQuestions(questions);
      } else {
        throw new Error('No questions generated');
      }
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

  const handleOptionSelect = (optionIndex: number) => {
    if (isAnswered) return;
    
    // Convert index to letter (0 -> 'A', 1 -> 'B', etc.)
    const optionLetter = String.fromCharCode(65 + optionIndex);
    setSelectedAnswer(optionLetter);
  };

  const checkAnswer = () => {
    if (!selectedAnswer || currentQuestionIndex >= quizQuestions.length) return;
    
    setIsAnswered(true);
    const currentQuestion = quizQuestions[currentQuestionIndex];
    
    if (selectedAnswer === currentQuestion.correctAnswer) {
      toast({
        title: "Correct!",
        description: "You got the right answer!",
        className: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900",
      });
    } else {
      toast({
        title: "Incorrect",
        description: `The correct answer was ${currentQuestion.correctAnswer}.`,
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
      // Quiz is complete
      if (onQuizComplete) {
        onQuizComplete();
      }
      toast({
        title: "Quiz Complete!",
        description: "You've completed all questions.",
      });
    }
  };

  const handleGenerateQuiz = () => {
    generateQuiz(userInput);
  };

  // Current question
  const currentQuestion = quizQuestions[currentQuestionIndex];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-lg border border-border">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        <p>Generating quiz based on your input...</p>
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
        <Button onClick={handleGenerateQuiz}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="p-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-lg border border-border">
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <Input 
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Enter a topic or context for quiz generation..."
            className="flex-1"
          />
          <Button onClick={handleGenerateQuiz}>Generate Quiz</Button>
        </div>
      </div>

      {quizQuestions.length > 0 && currentQuestion && (
        <div className="flex flex-col space-y-6 p-6 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-lg border border-border">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Question {currentQuestionIndex + 1} of {quizQuestions.length}</h3>
          </div>
          
          <div className="text-xl font-medium">
            {currentQuestion.question}
          </div>
          
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
                {currentQuestionIndex < quizQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'} 
                <ArrowRight size={16} className="ml-2" />
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
      )}
    </div>
  );
};

export default QuizGenerator;
