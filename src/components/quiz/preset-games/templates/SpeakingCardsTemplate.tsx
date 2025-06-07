
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Mic, MicOff, RefreshCw, Play, ArrowRight, ArrowLeft, Clock, Trophy, Volume2 } from 'lucide-react';

interface SpeakingCardsProps {
  content: any;
  topic: string;
  onBack?: () => void;
}

interface SpeakingCard {
  id: string;
  prompt: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number;
}

const SpeakingCardsTemplate: React.FC<SpeakingCardsProps> = ({ content, topic, onBack }) => {
  const { toast } = useToast();
  
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
      title: '🎤 Bắt đầu nói!',
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
      title: '✅ Hoàn thành thẻ!',
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
      case 'easy': return 'text-green-600 bg-green-100 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'hard': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
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
  
  const progress = ((currentCardIndex + (cardStarted ? 1 : 0)) / cards.length) * 100;
  
  if (!gameStarted) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <Card className="text-center bg-white/95 backdrop-blur-md border border-white/30 shadow-2xl rounded-2xl p-8">
            <div className="mb-8">
              <Volume2 className="h-24 w-24 text-indigo-500 mx-auto mb-6 animate-pulse" />
            </div>
            
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Thẻ Luyện Nói
            </h2>
            <p className="text-xl text-gray-700 mb-2 font-medium">🗣️ Chủ đề: {topic}</p>
            <p className="text-gray-600 mb-8 text-lg">Luyện tập kỹ năng nói với các chủ đề đa dạng</p>
            
            <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-6 mb-8">
              <div className="grid grid-cols-2 gap-6 text-sm">
                <div className="flex items-center gap-3 p-3 bg-white/70 rounded-xl">
                  <Mic className="h-6 w-6 text-indigo-500" />
                  <span className="font-medium text-gray-700">{cards.length} thẻ luyện tập</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/70 rounded-xl">
                  <Clock className="h-6 w-6 text-purple-500" />
                  <span className="font-medium text-gray-700">Có thời gian giới hạn</span>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={startGame} 
              className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white text-xl font-bold py-6 rounded-2xl"
            >
              🎤 Bắt đầu luyện tập
            </Button>
          </Card>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto h-full flex flex-col">
        {/* Header */}
        <Card className="mb-6 bg-white/90 backdrop-blur-md border border-white/50 shadow-lg rounded-2xl flex-shrink-0">
          <div className="p-6 flex flex-col lg:flex-row justify-between items-center gap-4">
            <div className="text-center lg:text-left">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Thẻ Luyện Nói
              </h2>
              <p className="text-gray-600 text-lg font-medium">{topic}</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl">
                <Volume2 className="h-6 w-6 text-indigo-500" />
                <span className="font-bold text-indigo-700 text-xl">
                  Thẻ {currentCardIndex + 1}/{cards.length}
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl">
                <Trophy className="h-6 w-6 text-green-500" />
                <span className="font-bold text-green-700 text-xl">
                  {completedCards.length} hoàn thành
                </span>
              </div>
            </div>
          </div>
          <div className="px-6 pb-6">
            <Progress value={progress} className="h-3 rounded-full" />
            <p className="text-sm text-gray-500 mt-2 text-center font-medium">
              Tiến độ: {Math.round(progress)}%
            </p>
          </div>
        </Card>
        
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-2xl">
            <Card className="p-8 bg-white/95 backdrop-blur-md border border-white/50 shadow-lg rounded-2xl">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(currentCard.difficulty)}`}>
                    {getDifficultyText(currentCard.difficulty)}
                  </span>
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">
                    {currentCard.category}
                  </span>
                </div>
                
                {cardStarted && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl">
                    <Clock className={`h-5 w-5 ${timeLeft < 30 ? 'text-red-500' : 'text-blue-500'}`} />
                    <span className={`font-bold text-lg ${timeLeft < 30 ? 'text-red-500 animate-pulse' : 'text-blue-500'}`}>
                      {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </span>
                    {isRecording && (
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse ml-2"></div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 leading-relaxed">
                  {currentCard.prompt}
                </h3>
                
                {!cardStarted && (
                  <p className="text-gray-600 text-lg">
                    Thời gian: {currentCard.timeLimit} giây
                  </p>
                )}
              </div>
              
              <div className="flex justify-center mb-8">
                {!cardStarted ? (
                  <Button 
                    onClick={startCard} 
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 text-lg font-bold rounded-2xl shadow-lg transform transition-all duration-200 hover:scale-105"
                  >
                    <Mic className="mr-3 h-6 w-6" />
                    Bắt đầu nói ({currentCard.timeLimit}s)
                  </Button>
                ) : (
                  <Button 
                    onClick={stopRecording} 
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-4 text-lg font-bold rounded-2xl shadow-lg"
                    disabled={!isRecording}
                  >
                    <MicOff className="mr-3 h-6 w-6" />
                    Dừng ghi âm
                  </Button>
                )}
              </div>
            </Card>
          </div>
        </div>
        
        {/* Navigation */}
        <div className="flex justify-between items-center mt-6 flex-shrink-0">
          <Button
            onClick={prevCard}
            disabled={currentCardIndex === 0}
            variant="outline"
            className="border-2 border-gray-300 hover:border-gray-400 px-6 py-3 text-lg font-semibold rounded-2xl disabled:opacity-50"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Thẻ trước
          </Button>
          
          <div className="flex gap-4">
            <Button 
              onClick={resetGame} 
              variant="outline"
              className="border-2 border-gray-300 hover:border-gray-400 px-6 py-3 text-lg font-semibold rounded-2xl"
            >
              <RefreshCw className="mr-2 h-5 w-5" />
              Chơi lại
            </Button>
            {onBack && (
              <Button 
                onClick={onBack} 
                variant="outline"
                className="border-2 border-gray-300 hover:border-gray-400 px-6 py-3 text-lg font-semibold rounded-2xl"
              >
                Quay lại
              </Button>
            )}
          </div>
          
          <Button
            onClick={nextCard}
            disabled={currentCardIndex === cards.length - 1}
            variant="outline"
            className="border-2 border-gray-300 hover:border-gray-400 px-6 py-3 text-lg font-semibold rounded-2xl disabled:opacity-50"
          >
            Thẻ sau
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SpeakingCardsTemplate;
