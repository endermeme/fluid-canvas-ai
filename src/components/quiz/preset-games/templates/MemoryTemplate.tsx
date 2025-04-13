import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, Clock, Trophy, Lightbulb, ArrowLeft, Share2 } from 'lucide-react';
import { saveGameForSharing } from '@/utils/gameExport';

interface MemoryTemplateProps {
  content: any;
  topic: string;
  onBack?: () => void;
}

const MemoryTemplate: React.FC<MemoryTemplateProps> = ({ content, topic, onBack }) => {
  const [cards, setCards] = useState<Array<{id: number, content: string, matched: boolean, flipped: boolean}>>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(content?.settings?.timeLimit || 120);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameWon, setGameWon] = useState<boolean>(false);
  const [canFlip, setCanFlip] = useState<boolean>(true);
  const { toast } = useToast();

  const memoryCards = content?.cards || [];
  const totalPairs = memoryCards.length / 2;

  useEffect(() => {
    if (memoryCards.length > 0) {
      const shuffledCards = [...memoryCards].sort(() => Math.random() - 0.5).map(card => ({
        ...card,
        flipped: false
      }));
      
      setCards(shuffledCards);
      setTimeLeft(content?.settings?.timeLimit || 120);
      setMoves(0);
      setMatchedPairs(0);
      setFlippedCards([]);
      setGameOver(false);
      setGameWon(false);
    }
  }, [memoryCards, content?.settings?.timeLimit]);

  useEffect(() => {
    if (timeLeft > 0 && !gameOver && !gameWon) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !gameOver && !gameWon) {
      setGameOver(true);
      toast({
        title: "Hết thời gian!",
        description: "Bạn đã hết thời gian chơi.",
        variant: "destructive",
      });
    }
  }, [timeLeft, gameOver, gameWon, toast]);

  useEffect(() => {
    if (matchedPairs === totalPairs && totalPairs > 0) {
      setGameWon(true);
      toast({
        title: "Chúc mừng!",
        description: "Bạn đã hoàn thành trò chơi.",
        variant: "default",
      });
    }
  }, [matchedPairs, totalPairs, toast]);

  useEffect(() => {
    if (flippedCards.length === 2) {
      setCanFlip(false);
      
      const [firstIndex, secondIndex] = flippedCards;
      
      if (cards[firstIndex].content === cards[secondIndex].content) {
        setCards(cards.map((card, idx) => 
          idx === firstIndex || idx === secondIndex 
            ? {...card, matched: true} 
            : card
        ));
        setMatchedPairs(matchedPairs + 1);
        setFlippedCards([]);
        setCanFlip(true);
        
        toast({
          title: "Tuyệt vời!",
          description: "Bạn đã tìm thấy một cặp khớp.",
          variant: "default",
        });
      } else {
        setTimeout(() => {
          setCards(cards.map((card, idx) => 
            idx === firstIndex || idx === secondIndex 
              ? {...card, flipped: false} 
              : card
          ));
          setFlippedCards([]);
          setCanFlip(true);
        }, 1000);
      }
      
      setMoves(moves + 1);
    }
  }, [flippedCards, cards, matchedPairs, moves, toast]);

  const handleCardClick = (index: number) => {
    if (gameOver || gameWon || !canFlip || flippedCards.length >= 2 || cards[index].flipped || cards[index].matched) {
      return;
    }
    
    setCards(cards.map((card, idx) => 
      idx === index ? {...card, flipped: true} : card
    ));
    
    setFlippedCards([...flippedCards, index]);
  };

  const handleHint = () => {
    const unmatchedCards = cards.filter(card => !card.matched && !card.flipped);
    
    if (unmatchedCards.length > 0) {
      const randomCard = unmatchedCards[Math.floor(Math.random() * unmatchedCards.length)];
      const randomCardIndex = cards.findIndex(card => card.id === randomCard.id);
      
      const matchingCardIndex = cards.findIndex((card, idx) => 
        card.content === randomCard.content && idx !== randomCardIndex
      );
      
      setCards(cards.map((card, idx) => 
        idx === randomCardIndex || idx === matchingCardIndex 
          ? {...card, flipped: true} 
          : card
      ));
      
      setTimeout(() => {
        setCards(cards.map((card, idx) => 
          (idx === randomCardIndex || idx === matchingCardIndex) && !card.matched 
            ? {...card, flipped: false} 
            : card
        ));
      }, 1000);
      
      setTimeLeft(Math.max(0, timeLeft - 10));
      
      toast({
        title: "Đã dùng gợi ý",
        description: "Thời gian bị trừ 10 giây.",
        variant: "default",
      });
    }
  };

  const handleRestart = () => {
    if (memoryCards.length > 0) {
      const shuffledCards = [...memoryCards].sort(() => Math.random() - 0.5).map(card => ({
        ...card,
        flipped: false,
        matched: false
      }));
      
      setCards(shuffledCards);
      setTimeLeft(content?.settings?.timeLimit || 120);
      setMoves(0);
      setMatchedPairs(0);
      setFlippedCards([]);
      setGameOver(false);
      setGameWon(false);
    }
  };

  const handleShare = async () => {
    try {
      const gameContent = `
        <html>
        <head>
          <title>${content.title || "Trò chơi ghi nhớ"}</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; margin: 0; padding: 20px; background: #f9f9ff; }
            .container { max-width: 800px; margin: 0 auto; }
            .game-title { text-align: center; margin-bottom: 20px; }
            .game-board { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 20px; }
            @media (min-width: 640px) { .game-board { grid-template-columns: repeat(4, 1fr); } }
            .card { aspect-ratio: 1; display: flex; align-items: center; justify-content: center; background: linear-gradient(to bottom right, #818cf8, #6366f1); border-radius: 8px; cursor: pointer; font-size: 20px; font-weight: bold; color: white; box-shadow: 0 2px 10px rgba(0,0,0,0.1); transition: transform 0.3s; }
            .card:hover { transform: scale(1.05); }
            .card.flipped { background: white; color: #6366f1; border: 2px solid #6366f1; }
            .footer { margin-top: 20px; text-align: center; }
            .score { display: inline-block; padding: 8px 16px; background: #fff; border-radius: 20px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); }
          </style>
        </head>
        <body>
          <div class="container">
            <h2 class="game-title">${content.title || topic}</h2>
            <div class="game-board" id="game-board">
              ${memoryCards.map((card: any, index: number) => 
                `<div class="card" data-id="${index}" data-content="${card.content}">&nbsp;</div>`
              ).join('')}
            </div>
            <div class="footer">
              <div class="score">Trò chơi ghi nhớ - Chia sẻ bởi QuizWhiz</div>
            </div>
          </div>
          <script>
            document.addEventListener('DOMContentLoaded', function() {
              const cards = document.querySelectorAll('.card');
              let flippedCards = [];
              let matchedPairs = 0;
              let canFlip = true;
              
              cards.forEach(card => {
                card.addEventListener('click', function() {
                  if (!canFlip || this.classList.contains('flipped')) return;
                  
                  this.textContent = this.dataset.content;
                  this.classList.add('flipped');
                  flippedCards.push(this);
                  
                  if (flippedCards.length === 2) {
                    canFlip = false;
                    const [first, second] = flippedCards;
                    
                    if (first.dataset.content === second.dataset.content) {
                      matchedPairs++;
                      flippedCards = [];
                      canFlip = true;
                      
                      if (matchedPairs === ${memoryCards.length / 2}) {
                        setTimeout(() => {
                          alert('Chúc mừng! Bạn đã hoàn thành trò chơi.');
                        }, 500);
                      }
                    } else {
                      setTimeout(() => {
                        first.textContent = '&nbsp;';
                        second.textContent = '&nbsp;';
                        first.classList.remove('flipped');
                        second.classList.remove('flipped');
                        flippedCards = [];
                        canFlip = true;
                      }, 1000);
                    }
                  }
                });
              });
            });
          </script>
        </body>
        </html>
      `;
      
      const shareUrl = await saveGameForSharing(
        content.title || "Trò chơi ghi nhớ", 
        topic, 
        gameContent
      );
      
      if (shareUrl) {
        navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link chia sẻ đã được sao chép",
          description: "Đã sao chép liên kết vào clipboard. Link có hiệu lực trong 48 giờ.",
        });
      } else {
        throw new Error("Không thể tạo URL chia sẻ");
      }
    } catch (error) {
      console.error("Lỗi khi chia sẻ:", error);
      toast({
        title: "Lỗi chia sẻ",
        description: "Không thể tạo link chia sẻ. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  };

  if (!content || !memoryCards.length) {
    return <div className="p-4">Không có dữ liệu trò chơi ghi nhớ</div>;
  }

  const progressPercentage = (matchedPairs / totalPairs) * 100;

  return (
    <div className="flex flex-col p-4 h-full bg-gradient-to-b from-background to-background/80 relative">
      {onBack && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onBack} 
          className="absolute top-4 left-4 z-10 flex items-center gap-1 bg-background/80 hover:bg-background/90 backdrop-blur-sm shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Quay lại</span>
        </Button>
      )}

      <div className="mb-4 mt-12">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm font-medium px-3 py-1 bg-primary/10 rounded-full">
            Cặp đã ghép: {matchedPairs}/{totalPairs}
          </div>
          <div className="text-sm font-medium px-3 py-1 bg-primary/10 rounded-full flex items-center">
            <Clock className="h-4 w-4 mr-1 text-primary" />
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </div>
        </div>
        <Progress value={progressPercentage} className="h-2 bg-secondary" />
      </div>

      {gameWon ? (
        <div className="flex-grow flex items-center justify-center">
          <Card className="p-8 text-center max-w-md bg-gradient-to-br from-primary/5 to-secondary/20 backdrop-blur-sm border-primary/20">
            <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4 text-primary">Chúc mừng!</h2>
            <p className="mb-2 text-lg">Bạn đã hoàn thành trò chơi với {moves} lượt.</p>
            <p className="mb-6">Thời gian còn lại: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</p>
            <div className="grid grid-cols-2 gap-3">
              <Button onClick={handleRestart} className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary">
                <RefreshCw className="mr-2 h-4 w-4" />
                Chơi lại
              </Button>
              <Button onClick={handleShare} variant="outline" className="w-full bg-gradient-to-r from-primary/10 to-background border-primary/20">
                <Share2 className="mr-2 h-4 w-4" />
                Chia sẻ
              </Button>
            </div>
          </Card>
        </div>
      ) : gameOver ? (
        <div className="flex-grow flex items-center justify-center">
          <Card className="p-8 text-center max-w-md bg-gradient-to-br from-destructive/5 to-background backdrop-blur-sm border-destructive/20">
            <h2 className="text-3xl font-bold mb-4 text-destructive">Hết thời gian!</h2>
            <p className="mb-4 text-lg">Bạn đã tìm được {matchedPairs} trong tổng số {totalPairs} cặp thẻ.</p>
            <div className="grid grid-cols-2 gap-3">
              <Button onClick={handleRestart} className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" />
                Chơi lại
              </Button>
              <Button onClick={handleShare} variant="outline" className="w-full">
                <Share2 className="h-4 w-4 mr-1" />
                Chia sẻ
              </Button>
            </div>
          </Card>
        </div>
      ) : (
        <div className="flex-grow">
          <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mb-4">
            {cards.map((card, index) => (
              <div 
                key={index}
                className={`aspect-square flex items-center justify-center rounded-xl cursor-pointer transition-all duration-300 transform ${
                  card.flipped || card.matched 
                    ? 'bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30 border-2 scale-105 shadow-lg hover:shadow-xl' 
                    : 'bg-gradient-to-br from-secondary/80 to-secondary/20 border-transparent border-2 hover:scale-105'
                } ${!canFlip ? 'pointer-events-none' : ''}`}
                onClick={() => handleCardClick(index)}
              >
                {(card.flipped || card.matched) ? (
                  <div className="text-2xl font-bold text-primary/90">{card.content}</div>
                ) : (
                  <div className="text-2xl font-bold text-secondary/80">?</div>
                )}
              </div>
            ))}
          </div>
          
          <div className="flex items-center justify-between mt-3">
            <div className="text-sm font-medium px-3 py-1 bg-primary/10 rounded-full">
              Lượt đã chơi: {moves}
            </div>
            
            <div className="flex gap-2">
              {content?.settings?.allowHints && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleHint}
                  className="bg-gradient-to-r from-primary/10 to-background border-primary/20"
                >
                  <Lightbulb className="h-4 w-4 mr-1 text-yellow-500" />
                  Gợi ý (-10s)
                </Button>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="bg-gradient-to-r from-primary/10 to-background border-primary/20"
              >
                <Share2 className="h-4 w-4 mr-1" />
                Chia sẻ
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleRestart}
                className="bg-gradient-to-r from-secondary/50 to-background border-primary/20"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Làm lại
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemoryTemplate;
