import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, X, ArrowRight, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyAvlzK-Meq-uEiTpAs4XHnWdiAmSE1kQiA';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
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
      console.log("Generating quiz for topic:", userMessage);
      
      const prompt = `Based on the following context, create an interactive multiple-choice quiz:

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
Correct Answer: [A/B/C/D]`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log("Raw quiz response:", text);
      return this.parseQuizResponse(text);
    } catch (error) {
      console.error('Quiz Generation Error:', error);
      return null;
    }
  }

  parseQuizResponse(rawText: string): QuizQuestion[] {
    try {
      console.log("Parsing quiz response:", rawText);
      
      // Parse questions from the response
      const questions: QuizQuestion[] = [];
      const questionBlocks = rawText.split('Question:').filter(block => block.trim().length > 0);
      
      for (const questionBlock of questionBlocks) {
        const lines = questionBlock.trim().split('\n').filter(line => line.trim().length > 0);
        
        if (lines.length < 6) {
          console.warn("Skipping malformed question block:", questionBlock);
          continue;
        }
        
        const optionLines = lines.slice(1, 5);
        const options = optionLines.map(line => {
          const optionText = line.replace(/^[A-D]\.\s*/, '').trim();
          return optionText;
        });
        
        // Find correct answer line
        const correctAnswerLine = lines.find(line => line.includes('Correct Answer:'));
        let correctAnswer = 'A'; // Default to A if not found
        
        if (correctAnswerLine) {
          const match = correctAnswerLine.match(/Correct Answer:\s*([A-D])/);
          if (match && match[1]) {
            correctAnswer = match[1];
          }
        }
        
        questions.push({
          question: lines[0].trim(),
          options,
          correctAnswer
        });
      }
      
      console.log("Parsed questions:", questions);
      return questions;
    } catch (error) {
      console.error("Error parsing quiz response:", error);
      return [];
    }
  }
}

const QuizGenerator = forwardRef<{ generateQuiz: (topic: string) => void }, QuizGeneratorProps>(({ 
  topic = "General Knowledge",
  onQuizComplete
}, ref) => {
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [userInput, setUserInput] = useState(topic);
  const { toast } = useToast();
  const [quizGenerator] = useState<AIQuizGenerator>(new AIQuizGenerator(API_KEY));

  useImperativeHandle(ref, () => ({
    generateQuiz: (topic: string) => {
      generateQuiz(topic);
    }
  }));

  useEffect(() => {
    setUserInput(topic);
  }, [topic]);

  const generateQuiz = async (context: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    setIsAnswered(false);
    setSelectedAnswer(null);
    setCurrentQuestionIndex(0);
    setQuizQuestions([]);

    try {      
      const questions = await quizGenerator.generateQuizFromContext(context);
      
      if (questions && questions.length > 0) {
        setQuizQuestions(questions);
        toast({
          title: "Quiz Generated",
          description: `Created ${questions.length} questions about "${context}"`,
        });
      } else {
        throw new Error('No questions generated');
      }
    } catch (error) {
      console.error('Quiz Generation Error:', error);
      setErrorMessage('Failed to generate quiz. Please try again or use a different topic.');
      toast({
        title: "Quiz Error",
        description: "There was a problem generating the quiz. Please try again with a different topic.",
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

  const handleTryAgain = () => {
    setErrorMessage(null);
    generateQuiz(userInput);
  };

  const currentQuestion = quizQuestions[currentQuestionIndex];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-lg border border-border">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
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
        <Button onClick={handleTryAgain}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
});

QuizGenerator.displayName = "QuizGenerator";

export default QuizGenerator;
