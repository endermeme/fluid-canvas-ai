import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, RefreshCw, Clock, Mic, ThumbsUp, SkipForward, Timer } from 'lucide-react';

interface SpeakingCardsProps {
  content: any;
  topic: string;
}

interface SpeakingCard {
  id: string;
  prompt: string;
  category: string;
  timeLimit: number;
  difficulty: 'easy' | 'medium' | 'hard';
  hints?: string[];
}

const SpeakingCardsTemplate: React.FC<SpeakingCardsProps> = ({ content, topic }) => {
  const { toast } = useToast();
  
  // Data mẫu nếu không có content
  const cards: SpeakingCard[] = content?.cards || [
    {
      id: '1',
      prompt: 'Nêu 3 lý do tại sao internet lại quan trọng trong cuộc sống hiện đại.',
      category: 'Công nghệ',
      timeLimit: 45,
      difficulty: 'easy',
      hints: ['Kết nối toàn cầu', 'Nguồn thông tin', 'Thương mại điện tử']
    },
    {
      id: '2',
      prompt: 'Mô tả một cuốn sách bạn đã đọc gần đây và lý do bạn thích nó.',
      category: 'Văn học',
      timeLimit: 60,
      difficulty: 'medium',
      hints: ['Cốt truyện', 'Nhân vật', 'Bài học']
    },
    {
      id: '3',
      prompt: 'Nếu bạn có thể phát minh một thiết bị công nghệ mới, đó sẽ là gì và tại sao?',
      category: 'Sáng tạo',
      timeLimit: 75,
      difficulty: 'hard',
      hints: ['Mục đích', 'Tính năng', 'Lợi ích']
    },
    {
      id: '4',
      prompt: 'Nói về một kỷ niệm đáng nhớ trong cuộc đời bạn.',
      category: 'Cá nhân',
      timeLimit: 45,
      difficulty: 'medium',
      hints: ['Thời điểm', 'Cảm xúc', 'Bài học']
    },
    {
      id: '5',
      prompt: 'Giải thích cách bạn sẽ giải quyết vấn đề biến đổi khí hậu.',
      category: 'Môi trường',
      timeLimit: 90,
      difficulty: 'hard',
      hints: ['Giải pháp cá nhân', 'Chính sách', 'Công nghệ']
    }
  ];

  // State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showHints, setShowHints] = useState(false);
  const [completedCards, setCompletedCards] = useState<string[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selfRating, setSelfRating] = useState<number | null>(null);
  const [gameCompleted, setGameCompleted] = useState(false);
  
  const currentCard = cards[currentIndex];
  
  // Đặt lại thời gian khi chuyển card
  useEffect(() => {
    if (currentCard) {
      setTimeLeft(currentCard.timeLimit);
    }
  }, [currentIndex, currentCard]);
  
  // Xử lý đếm ngược
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isPlaying && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (isPlaying && timeLeft === 0) {
      handleTimeUp();
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isPlaying, timeLeft]);
  
  // Xử lý khi hết thời gian
  const handleTimeUp = () => {
    setIsPlaying(false);
    setIsSpeaking(false);
    
    toast({
      title: 'Hết giờ!',
      description: 'Thời gian trả lời đã kết thúc.',
      variant: 'default',
    });
  };
  
  // Bắt đầu nói
  const startSpeaking = () => {
    setIsPlaying(true);
    setIsSpeaking(true);
    setShowHints(false);
    setSelfRating(null);
    
    toast({
      title: 'Bắt đầu nói!',
      description: `Bạn có ${currentCard.timeLimit} giây để trả lời.`,
      variant: 'default',
    });
  };
  
  // Dừng nói
  const stopSpeaking = () => {
    setIsPlaying(false);
    setIsSpeaking(false);
    
    toast({
      title: 'Hoàn thành!',
      description: 'Hãy đánh giá bài nói của bạn.',
      variant: 'default',
    });
  };
  
  // Xử lý đánh giá
  const handleRating = (rating: number) => {
    setSelfRating(rating);
    setCompletedCards([...completedCards, currentCard.id]);
    
    toast({
      title: 'Đã ghi nhận!',
      description: 'Bạn có thể tiếp tục với thẻ tiếp theo.',
      variant: 'default',
    });
  };
  
  // Đi tới thẻ tiếp theo
  const goToNextCard = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsPlaying(false);
      setIsSpeaking(false);
      setShowHints(false);
      setSelfRating(null);
    } else {
      setGameCompleted(true);
    }
  };
  
  // Bỏ qua thẻ hiện tại
  const skipCurrentCard = () => {
    toast({
      title: 'Đã bỏ qua',
      description: 'Đã chuyển sang thẻ tiếp theo.',
      variant: 'default',
    });
    
    goToNextCard();
  };
  
  // Khởi động lại trò chơi
  const resetGame = () => {
    setCurrentIndex(0);
    setIsPlaying(false);
    setTimeLeft(cards[0]?.timeLimit || 60);
    setShowHints(false);
    setCompletedCards([]);
    setSelfRating(null);
    setIsSpeaking(false);
    setGameCompleted(false);
  };
  
  // Format thời gian
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Hiển thị màn hình kết thúc trò chơi
  if (gameCompleted) {
    return (
      <div className="min-h-[500px] p-6">
        <Card className="p-6 max-w-md mx-auto text-center">
          <ThumbsUp className="h-16 w-16 text-green-500 mx-auto mb-4" />
          
          <h2 className="text-2xl font-bold mb-4">Hoàn thành!</h2>
          
          <p className="mb-6">
            Bạn đã hoàn thành {completedCards.length}/{cards.length} thẻ nói.
            Tiếp tục luyện tập để cải thiện kỹ năng nói của bạn!
          </p>
          
          <Button onClick={resetGame} className="bg-blue-600 hover:bg-blue-700">
            <RefreshCw className="mr-2 h-4 w-4" />
            Bắt đầu lại
          </Button>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="min-h-[500px] p-6">
      <Card className="p-4 w-full mb-4 flex justify-between items-center">
        <div className="flex items-center">
          <MessageSquare className="h-6 w-6 mr-2 text-blue-500" />
          <h2 className="text-xl font-bold">Thẻ Nói Ngẫu Nhiên: {topic}</h2>
        </div>
        <div className="flex items-center gap-2">
          {isPlaying && (
            <>
              <Clock className="h-5 w-5 text-blue-500" />
              <span className={`font-medium ${timeLeft < 10 ? 'text-red-500' : 'text-blue-500'}`}>
                {formatTime(timeLeft)}
              </span>
            </>
          )}
        </div>
      </Card>
      
      <div className="mb-4">
        <Progress value={((currentIndex) / cards.length) * 100} className="h-2" />
        <div className="flex justify-between mt-1 text-sm text-gray-500">
          <span>Thẻ {currentIndex + 1}</span>
          <span>Tổng {cards.length} thẻ</span>
        </div>
      </div>
      
      <Card className="p-6 mb-4 relative">
        <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${
          currentCard.difficulty === 'easy' 
            ? 'bg-green-100 text-green-800' 
            : currentCard.difficulty === 'medium' 
            ? 'bg-yellow-100 text-yellow-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {currentCard.difficulty === 'easy' && 'Dễ'}
          {currentCard.difficulty === 'medium' && 'Trung bình'}
          {currentCard.difficulty === 'hard' && 'Khó'}
        </div>
        
        <div className="flex flex-col gap-4">
          <div>
            <div className="text-sm text-blue-600 font-medium mb-1">{currentCard.category}</div>
            <h3 className="text-xl font-medium mb-4">{currentCard.prompt}</h3>
            
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
              <Timer className="h-4 w-4" />
              <span>Thời gian nói: {formatTime(currentCard.timeLimit)}</span>
            </div>
          </div>
          
          {!isPlaying && !selfRating && (
            <Button
              onClick={startSpeaking}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Mic className="mr-2 h-4 w-4" />
              Bắt đầu nói
            </Button>
          )}
          
          {isPlaying && isSpeaking && (
            <Button
              onClick={stopSpeaking}
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              Dừng lại
            </Button>
          )}
          
          {!isPlaying && !isSpeaking && !selfRating && completedCards.includes(currentCard.id) && (
            <Button
              onClick={goToNextCard}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Thẻ tiếp theo
            </Button>
          )}
          
          {!isPlaying && !isSpeaking && !selfRating && !completedCards.includes(currentCard.id) && (
            <div className="flex justify-between">
              <Button
                onClick={() => setShowHints(!showHints)}
                variant="outline"
                className="text-yellow-600 border-yellow-300 hover:bg-yellow-50"
              >
                {showHints ? 'Ẩn gợi ý' : 'Xem gợi ý'}
              </Button>
              
              <Button
                onClick={skipCurrentCard}
                variant="outline"
              >
                <SkipForward className="mr-2 h-4 w-4" />
                Bỏ qua
              </Button>
            </div>
          )}
          
          {showHints && currentCard.hints && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <div className="font-medium mb-1">Gợi ý:</div>
              <ul className="list-disc list-inside text-sm">
                {currentCard.hints.map((hint, index) => (
                  <li key={index}>{hint}</li>
                ))}
              </ul>
            </div>
          )}
          
          {!isPlaying && !isSpeaking && !selfRating && completedCards.includes(currentCard.id) && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-800">Bạn đã hoàn thành thẻ này!</p>
            </div>
          )}
          
          {!isPlaying && !isSpeaking && selfRating === null && !completedCards.includes(currentCard.id) && (
            <div className="mt-2">
              <h4 className="font-medium mb-2">Đánh giá bài nói của bạn:</h4>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Button
                    key={rating}
                    onClick={() => handleRating(rating)}
                    variant="outline"
                    className="flex-1"
                  >
                    {rating}
                  </Button>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Cần cải thiện</span>
                <span>Xuất sắc</span>
              </div>
            </div>
          )}
          
          {!isPlaying && selfRating !== null && (
            <div className="flex justify-center mt-2">
              <Button
                onClick={goToNextCard}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Tiếp tục
              </Button>
            </div>
          )}
        </div>
      </Card>
      
      <div className="flex justify-between">
        <Button
          onClick={resetGame}
          variant="outline"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Làm lại
        </Button>
      </div>
    </div>
  );
};

export default SpeakingCardsTemplate;
