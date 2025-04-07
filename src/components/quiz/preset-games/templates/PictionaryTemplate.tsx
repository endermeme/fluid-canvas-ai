
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Check, X, Lightbulb, ChevronRight, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { animateBlockCreation } from '@/lib/animations';

interface PictionaryItem {
  word: string;
  hint: string;
  imageUrls: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
}

interface PictionaryTemplateProps {
  content: PictionaryItem[];
  topic: string;
}

const PictionaryTemplate: React.FC<PictionaryTemplateProps> = ({ content, topic }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const [userGuess, setUserGuess] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [currentImageLoaded, setCurrentImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // Reset state when content changes or new index
    setImageIndex(0);
    setUserGuess('');
    setShowHint(false);
    setIsCorrect(false);
    setAttemptsLeft(3);
    setShowAnswer(false);
    setCurrentImageLoaded(false);
    setImageError(false);
  }, [content, currentIndex]);

  // Apply animations
  useEffect(() => {
    const elements = document.querySelectorAll('.animate-item');
    elements.forEach((element, index) => {
      setTimeout(() => {
        if (element instanceof HTMLElement) {
          animateBlockCreation(element);
        }
      }, index * 100);
    });
  }, [currentIndex, showHint, isCorrect, showAnswer]);

  if (!content || content.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">Không có nội dung</h3>
          <p className="text-gray-500">Không tìm thấy hình ảnh cho trò chơi này.</p>
        </div>
      </div>
    );
  }

  const currentItem = content[currentIndex];
  const progress = ((currentIndex) / content.length) * 100;

  const handleGuess = () => {
    const normalizedGuess = userGuess.trim().toLowerCase();
    const normalizedAnswer = currentItem.word.toLowerCase();
    
    if (normalizedGuess === normalizedAnswer) {
      setIsCorrect(true);
      setScore(score + Math.max(1, attemptsLeft));
    } else {
      setAttemptsLeft(attemptsLeft - 1);
      if (attemptsLeft <= 1) {
        setShowAnswer(true);
      }
    }
  };

  const handleNextImage = () => {
    if (imageIndex < currentItem.imageUrls.length - 1) {
      setImageIndex(imageIndex + 1);
      setCurrentImageLoaded(false);
      setImageError(false);
    } else {
      setShowHint(true);
    }
  };

  const handleNextWord = () => {
    if (currentIndex < content.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setImageIndex(0);
      setUserGuess('');
      setShowHint(false);
      setIsCorrect(false);
      setAttemptsLeft(3);
      setShowAnswer(false);
      setCurrentImageLoaded(false);
      setImageError(false);
    } else {
      setGameComplete(true);
    }
  };

  const restartGame = () => {
    setCurrentIndex(0);
    setImageIndex(0);
    setUserGuess('');
    setShowHint(false);
    setIsCorrect(false);
    setAttemptsLeft(3);
    setShowAnswer(false);
    setScore(0);
    setGameComplete(false);
    setCurrentImageLoaded(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setCurrentImageLoaded(true);
  };

  // Completion screen
  if (gameComplete) {
    const percentage = Math.round((score / (content.length * 3)) * 100);
    let message = "Thử lại để đạt điểm cao hơn!";
    
    if (percentage >= 90) {
      message = "Tuyệt vời! Bạn thật giỏi nhận biết hình ảnh!";
    } else if (percentage >= 70) {
      message = "Rất giỏi! Bạn có khả năng quan sát tốt!";
    } else if (percentage >= 50) {
      message = "Khá tốt! Hãy tiếp tục luyện tập!";
    }

    return (
      <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto p-4 animate-fade-in">
        <Card className="w-full p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Kết quả trò chơi đoán hình</h2>
          
          <div className="relative mb-6 pt-4">
            <div className="text-4xl font-bold mb-2">{score} điểm</div>
            <Progress value={percentage} className="h-2" />
            <p className="mt-2 text-sm text-gray-500">
              Tỷ lệ đúng: {percentage}%
            </p>
          </div>
          
          <p className="mb-6">{message}</p>
          
          <Button onClick={restartGame} className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            Chơi lại
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col max-w-3xl mx-auto p-4 h-full">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium">
            Hình ảnh {currentIndex + 1}/{content.length}
          </span>
          <span className="text-sm font-medium">
            Điểm: {score}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="flex-grow p-6 mb-4 flex flex-col">
        <div className="flex-grow flex flex-col items-center justify-center">
          {/* Image display area */}
          <div className="mb-6 w-full max-w-md animate-item relative">
            <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden">
              {currentItem.imageUrls[imageIndex] && !imageError ? (
                <>
                  {!currentImageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                      <p className="ml-2 text-primary">Đang tải hình...</p>
                    </div>
                  )}
                  <img 
                    src={currentItem.imageUrls[imageIndex]} 
                    alt={`Hình ảnh để đoán từ ${currentIndex + 1}`} 
                    className={`w-full h-full object-contain ${currentImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onError={handleImageError}
                    onLoad={handleImageLoad}
                  />
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <X className="mx-auto h-12 w-12 text-red-500 mb-2" />
                    <p>Không thể tải hình ảnh</p>
                    {currentItem.imageUrls.length > 1 && imageIndex < currentItem.imageUrls.length - 1 && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2" 
                        onClick={handleNextImage}
                      >
                        Xem hình khác
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {currentImageLoaded && currentItem.imageUrls.length > 1 && imageIndex < currentItem.imageUrls.length - 1 && (
              <div className="mt-2 text-center">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleNextImage}
                >
                  Xem hình khác ({imageIndex + 1}/{currentItem.imageUrls.length})
                </Button>
              </div>
            )}
          </div>

          {/* Guess input area */}
          {!isCorrect && !showAnswer && (
            <div className="w-full max-w-md animate-item">
              <div className="flex items-center gap-2 mb-2">
                <Input
                  type="text"
                  placeholder="Nhập từ bạn đoán..."
                  value={userGuess}
                  onChange={(e) => setUserGuess(e.target.value)}
                  disabled={isCorrect || showAnswer}
                  className="flex-grow"
                  onKeyPress={(e) => e.key === 'Enter' && handleGuess()}
                />
                <Button onClick={handleGuess} disabled={isCorrect || showAnswer || !userGuess.trim()}>
                  Đoán
                </Button>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-sm">
                  <span className="font-medium">Lượt đoán còn lại:</span> {attemptsLeft}
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowHint(!showHint)} 
                  className="text-sm flex items-center"
                >
                  <Lightbulb className="h-4 w-4 mr-1" />
                  {showHint ? 'Ẩn gợi ý' : 'Hiện gợi ý'}
                </Button>
              </div>
              
              {showHint && (
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md text-sm animate-fade-in">
                  <p className="font-medium mb-1">Gợi ý:</p>
                  <p>{currentItem.hint}</p>
                </div>
              )}
            </div>
          )}

          {/* Correct answer display */}
          {(isCorrect || showAnswer) && (
            <div className="w-full max-w-md p-4 rounded-lg animate-item animate-fade-in">
              <div className={`text-center p-3 rounded-md ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <div className="flex items-center justify-center mb-2">
                  {isCorrect ? (
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <Check className="h-6 w-6 text-green-600" />
                    </div>
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                      <X className="h-6 w-6 text-red-600" />
                    </div>
                  )}
                </div>
                
                <h3 className="text-lg font-medium mb-1">
                  {isCorrect ? 'Đúng rồi!' : 'Rất tiếc, bạn đã hết lượt đoán'}
                </h3>
                
                <p className="mb-3">
                  Từ đúng là: <span className="font-bold">{currentItem.word}</span>
                </p>
                
                <Button onClick={handleNextWord} className="w-full mt-2 flex items-center justify-center">
                  {currentIndex < content.length - 1 ? 'Tiếp theo' : 'Xem kết quả'}
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default PictionaryTemplate;
