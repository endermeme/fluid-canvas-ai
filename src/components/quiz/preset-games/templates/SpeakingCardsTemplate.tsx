
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  Trophy, 
  RefreshCw, 
  Mic,
  Clock,
  ArrowLeft,
  Play,
  Pause,
  SkipForward,
  Star,
  Volume2
} from 'lucide-react';

interface SpeakingCardsProps {
  data: any;
  onBack: () => void;
  topic: string;
  content: any;
}

interface Card {
  id: string;
  prompt: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number;
}

const SpeakingCardsTemplate: React.FC<SpeakingCardsProps> = ({ data, onBack, topic }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [completedCards, setCompletedCards] = useState<number[]>([]);
  const [totalScore, setTotalScore] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (data && data.cards) {
      setCards(data.cards);
      setTimeLeft(data.cards[0]?.timeLimit || 60);
    }
  }, [data]);

  useEffect(() => {
    if (isActive && !isPaused && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    if (timeLeft === 0 && isActive) {
      handleTimeUp();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, isPaused, timeLeft]);

  const startGame = () => {
    setGameStarted(true);
    toast({
      title: "🎤 Game bắt đầu!",
      description: "Thực hành nói với các thẻ luyện tập!",
    });
  };

  const startTimer = () => {
    setIsActive(true);
    setIsPaused(false);
    toast({
      title: "⏰ Bắt đầu nói!",
      description: `Bạn có ${timeLeft} giây để trả lời`,
    });
  };

  const pauseTimer = () => {
    setIsPaused(true);
    toast({
      title: "⏸️ Đã tạm dừng",
      description: "Timer đã được tạm dừng",
    });
  };

  const resumeTimer = () => {
    setIsPaused(false);
    toast({
      title: "▶️ Tiếp tục",
      description: "Timer đã được tiếp tục",
    });
  };

  const handleTimeUp = () => {
    setIsActive(false);
    setIsPaused(false);
    setCompletedCards(prev => [...prev, currentCardIndex]);
    
    // Award points based on difficulty
    const currentCard = cards[currentCardIndex];
    let points = 0;
    switch (currentCard.difficulty) {
      case 'easy': points = 10; break;
      case 'medium': points = 20; break;
      case 'hard': points = 30; break;
    }
    setTotalScore(prev => prev + points);

    toast({
      title: "⏰ Hết giờ!",
      description: `Bạn được ${points} điểm cho thẻ này`,
    });

    // Auto move to next card after 2 seconds
    setTimeout(() => {
      nextCard();
    }, 2000);
  };

  const nextCard = () => {
    if (currentCardIndex < cards.length - 1) {
      const nextIndex = currentCardIndex + 1;
      setCurrentCardIndex(nextIndex);
      setTimeLeft(cards[nextIndex].timeLimit);
      setIsActive(false);
      setIsPaused(false);
    } else {
      // Game completed
      setGameCompleted(true);
      toast({
        title: "🎊 Hoàn thành!",
        description: `Bạn đã hoàn thành tất cả ${cards.length} thẻ!`,
      });
    }
  };

  const skipCard = () => {
    setIsActive(false);
    setIsPaused(false);
    nextCard();
    toast({
      title: "⏭️ Đã bỏ qua",
      description: "Chuyển sang thẻ tiếp theo",
    });
  };

  const resetGame = () => {
    setCurrentCardIndex(0);
    setTimeLeft(cards[0]?.timeLimit || 60);
    setIsActive(false);
    setIsPaused(false);
    setGameStarted(false);
    setGameCompleted(false);
    setCompletedCards([]);
    setTotalScore(0);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'from-green-400 to-green-600';
      case 'medium': return 'from-yellow-400 to-orange-500';
      case 'hard': return 'from-red-400 to-red-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!data) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
        <Card className="p-8 max-w-md">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4">Đang tải game...</h3>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          </div>
        </Card>
      </div>
    );
  }

  const currentCard = cards[currentCardIndex];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="flex flex-col h-screen">
        {/* Header */}
        <Card className="m-4 p-4 bg-white/80 backdrop-blur-sm border-green-200 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button
                onClick={onBack}
                variant="ghost"
                className="mr-4 text-green-700 hover:bg-green-100"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Quay lại
              </Button>
              <div className="bg-gradient-to-r from-green-500 to-blue-600 p-3 rounded-xl mr-4">
                <Mic className="h-7 w-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{data.title}</h2>
                <p className="text-gray-600">
                  <span className="font-medium">{topic}</span> • 
                  <span className="ml-2 text-green-600">{cards.length} thẻ luyện tập</span>
                </p>
              </div>
            </div>
            
            {gameStarted && (
              <div className="flex items-center gap-4 text-lg font-medium">
                <div className="flex items-center text-green-600">
                  <Clock className="mr-2 h-5 w-5" />
                  {currentCardIndex + 1}/{cards.length}
                </div>
                <div className="flex items-center text-blue-600">
                  <Star className="mr-2 h-5 w-5" />
                  {totalScore} điểm
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Game Content */}
        <div className="flex-1 p-4">
          {!gameStarted ? (
            <div className="flex items-center justify-center h-full">
              <Card className="p-8 max-w-md bg-white/90 backdrop-blur-sm shadow-xl">
                <div className="text-center">
                  <div className="bg-gradient-to-r from-green-500 to-blue-600 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                    <Mic className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Thẻ Luyện Nói</h3>
                  <p className="text-gray-600 mb-6">
                    Thực hành kỹ năng nói với {cards.length} thẻ luyện tập. Mỗi thẻ có thời gian giới hạn khác nhau.
                  </p>
                  <Button onClick={startGame} size="lg" className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                    Bắt Đầu Game
                  </Button>
                </div>
              </Card>
            </div>
          ) : gameCompleted ? (
            <div className="flex items-center justify-center h-full">
              <Card className="p-8 max-w-2xl bg-white/90 backdrop-blur-sm shadow-xl">
                <div className="text-center mb-6">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <Trophy className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-2">
                    Hoàn thành! Tổng điểm: {totalScore}
                  </h3>
                  <p className="text-gray-600">
                    Bạn đã hoàn thành {completedCards.length}/{cards.length} thẻ luyện nói
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-green-100 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-700">{completedCards.length}</div>
                    <div className="text-sm text-green-600">Thẻ hoàn thành</div>
                  </div>
                  <div className="bg-blue-100 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-700">{totalScore}</div>
                    <div className="text-sm text-blue-600">Tổng điểm</div>
                  </div>
                  <div className="bg-purple-100 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-700">
                      {Math.round((completedCards.length / cards.length) * 100)}%
                    </div>
                    <div className="text-sm text-purple-600">Hoàn thành</div>
                  </div>
                </div>

                <div className="flex gap-3 justify-center">
                  <Button onClick={resetGame} variant="outline" className="border-green-300 text-green-700 hover:bg-green-50">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Chơi lại
                  </Button>
                  <Button onClick={onBack} className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                    Kết thúc
                  </Button>
                </div>
              </Card>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              {/* Progress Bar */}
              <Card className="p-4 mb-6 bg-white/90 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">
                    Tiến độ: {currentCardIndex + 1}/{cards.length}
                  </span>
                  <span className="text-sm font-medium text-gray-600">
                    {Math.round(((currentCardIndex + 1) / cards.length) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentCardIndex + 1) / cards.length) * 100}%` }}
                  ></div>
                </div>
              </Card>

              {/* Main Card */}
              <Card className={`p-8 bg-gradient-to-br ${getDifficultyColor(currentCard.difficulty)} text-white shadow-xl mb-6`}>
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyBadge(currentCard.difficulty).replace('text-', 'text-').replace('bg-', 'bg-white/20 ')}`}>
                      {currentCard.category}
                    </span>
                    <span className="mx-3">•</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium bg-white/20`}>
                      {currentCard.difficulty.toUpperCase()}
                    </span>
                  </div>
                  
                  <h3 className="text-3xl font-bold mb-4">Câu hỏi luyện nói</h3>
                  <p className="text-xl font-medium leading-relaxed">
                    {currentCard.prompt}
                  </p>
                </div>

                {/* Timer */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center bg-white/20 rounded-full px-6 py-3">
                    <Clock className="h-6 w-6 mr-2" />
                    <span className="text-2xl font-bold">
                      {formatTime(timeLeft)}
                    </span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex justify-center gap-4">
                  {!isActive ? (
                    <Button
                      onClick={startTimer}
                      size="lg"
                      className="bg-white/20 hover:bg-white/30 border-white/50"
                      variant="outline"
                    >
                      <Play className="mr-2 h-5 w-5" />
                      Bắt đầu nói
                    </Button>
                  ) : (
                    <>
                      {isPaused ? (
                        <Button
                          onClick={resumeTimer}
                          size="lg"
                          className="bg-white/20 hover:bg-white/30 border-white/50"
                          variant="outline"
                        >
                          <Play className="mr-2 h-5 w-5" />
                          Tiếp tục
                        </Button>
                      ) : (
                        <Button
                          onClick={pauseTimer}
                          size="lg"
                          className="bg-white/20 hover:bg-white/30 border-white/50"
                          variant="outline"
                        >
                          <Pause className="mr-2 h-5 w-5" />
                          Tạm dừng
                        </Button>
                      )}
                    </>
                  )}
                  
                  <Button
                    onClick={skipCard}
                    size="lg"
                    className="bg-white/20 hover:bg-white/30 border-white/50"
                    variant="outline"
                  >
                    <SkipForward className="mr-2 h-5 w-5" />
                    Bỏ qua
                  </Button>
                </div>
              </Card>

              {/* Speaking Tips */}
              <Card className="p-4 bg-white/90 backdrop-blur-sm">
                <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                  <Volume2 className="mr-2 h-5 w-5 text-blue-600" />
                  Gợi ý khi nói:
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Nói rõ ràng và từ tốn</li>
                  <li>• Sử dụng các từ nối để liên kết ý tưởng</li>
                  <li>• Đưa ra ví dụ cụ thể để minh họa</li>
                  <li>• Sử dụng hết thời gian được cho</li>
                </ul>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpeakingCardsTemplate;
