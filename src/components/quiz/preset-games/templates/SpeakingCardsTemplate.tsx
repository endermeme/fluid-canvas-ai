
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Mic, MicOff, RefreshCw, Play, ArrowRight, ArrowLeft } from 'lucide-react';

interface SpeakingCardsProps {
  content: any;
  topic: string;
}

interface SpeakingCard {
  id: string;
  prompt: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number;
}

const SpeakingCardsTemplate: React.FC<SpeakingCardsProps> = ({ content, topic }) => {
  const { toast } = useToast();
  
  // Data mẫu nếu không có content
  const cards: SpeakingCard[] = content?.cards || [
    { id: '1', prompt: 'Hãy kể về gia đình của bạn', category: 'Cá nhân', difficulty: 'easy', timeLimit: 60 },
    { id: '2', prompt: 'Mô tả món ăn yêu thích của bạn', category: 'Ẩm thực', difficulty: 'easy', timeLimit: 45 },
    { id: '3', prompt: 'Bạn nghĩ gì về biến đổi khí hậu?', category: 'Môi trường', difficulty: 'medium', timeLimit: 90 },
    { id: '4', prompt: 'Kể về một kỷ niệm đáng nhớ', category: 'Cá nhân', difficulty: 'medium', timeLimit: 75 },
    { id: '5', prompt: 'Giải thích tầm quan trọng của giáo dục', category: 'Xã hội', difficulty: 'hard', timeLimit: 120 }
  ];
  
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [cardStarted, setCardStarted] = useState(false);
  const [completedCards, setCompletedCards] = useState<string[]>([]);
  
  const currentCard = cards[currentCardIndex];
  
  // Đếm ngược thời gian cho thẻ hiện tại
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timeLeft > 0 && cardStarted) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && cardStarted) {
      handleCardComplete();
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [timeLeft, cardStarted]);
  
  const startGame = () => {
    setGameStarted(true);
  };
  
  const startCard = () => {
    setCardStarted(true);
    setTimeLeft(currentCard.timeLimit);
    setIsRecording(true);
    
    toast({
      title: 'Bắt đầu nói!',
      description: `Bạn có ${currentCard.timeLimit} giây để hoàn thành`,
      variant: 'default',
    });
  };
  
  const stopRecording = () => {
    setIsRecording(false);
    handleCardComplete();
  };
  
  const handleCardComplete = () => {
    setCardStarted(false);
    setIsRecording(false);
    setCompletedCards(prev => [...prev, currentCard.id]);
    
    toast({
      title: 'Hoàn thành thẻ!',
      description: 'Bạn đã hoàn thành thẻ này',
      variant: 'default',
    });
  };
  
  const nextCard = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setCardStarted(false);
      setTimeLeft(0);
    }
  };
  
  const prevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setCardStarted(false);
      setTimeLeft(0);
    }
  };
  
  const resetGame = () => {
    setGameStarted(false);
    setCurrentCardIndex(0);
    setCardStarted(false);
    setIsRecording(false);
    setTimeLeft(0);
    setCompletedCards([]);
  };
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };
  
  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Dễ';
      case 'medium': return 'Trung bình';
      case 'hard': return 'Khó';
      default: return 'Không xác định';
    }
  };
  
  if (!gameStarted) {
    return (
      <div className="min-h-[500px] p-6">
        <Card className="p-6 max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Thẻ Luyện Nói: {topic}</h2>
          <p className="mb-6">Luyện tập kỹ năng nói với các chủ đề đa dạng</p>
          <Button onClick={startGame} className="bg-blue-600 hover:bg-blue-700">
            <Play className="mr-2 h-4 w-4" />
            Bắt đầu luyện tập
          </Button>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="min-h-[500px] p-6">
      <Card className="p-4 w-full mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">Thẻ Luyện Nói: {topic}</h2>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">
            Thẻ {currentCardIndex + 1}/{cards.length}
          </span>
          <span className="text-sm text-gray-500">
            Hoàn thành: {completedCards.length}/{cards.length}
          </span>
        </div>
      </Card>
      
      <div className="max-w-2xl mx-auto">
        <Card className="p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(currentCard.difficulty)}`}>
                {getDifficultyText(currentCard.difficulty)}
              </span>
              <span className="text-sm text-gray-500">{currentCard.category}</span>
            </div>
            
            {cardStarted && (
              <div className="flex items-center gap-2">
                <span className={`font-medium ${timeLeft < 30 ? 'text-red-500' : 'text-blue-500'}`}>
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </span>
                {isRecording && (
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                )}
              </div>
            )}
          </div>
          
          <h3 className="text-lg font-medium mb-6">{currentCard.prompt}</h3>
          
          <div className="flex justify-center gap-4">
            {!cardStarted ? (
              <Button onClick={startCard} className="bg-green-600 hover:bg-green-700">
                <Mic className="mr-2 h-4 w-4" />
                Bắt đầu nói ({currentCard.timeLimit}s)
              </Button>
            ) : (
              <Button 
                onClick={stopRecording} 
                className="bg-red-600 hover:bg-red-700"
                disabled={!isRecording}
              >
                <MicOff className="mr-2 h-4 w-4" />
                Dừng ghi âm
              </Button>
            )}
          </div>
        </Card>
        
        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            onClick={prevCard}
            disabled={currentCardIndex === 0}
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Thẻ trước
          </Button>
          
          <Button onClick={resetGame} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Chơi lại
          </Button>
          
          <Button
            onClick={nextCard}
            disabled={currentCardIndex === cards.length - 1}
            variant="outline"
          >
            Thẻ sau
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        {/* Progress */}
        <div className="mt-6">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${(completedCards.length / cards.length) * 100}%` }}
            />
          </div>
          <p className="text-center text-sm text-gray-500 mt-2">
            Tiến độ: {completedCards.length}/{cards.length} thẻ hoàn thành
          </p>
        </div>
      </div>
    </div>
  );
};

export default SpeakingCardsTemplate;
