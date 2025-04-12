import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, Clock, ArrowLeft, Trophy, Share2 } from 'lucide-react';
import { saveGameForSharing } from '@/utils/gameExport';

interface MatchingTemplateProps {
  content: any;
  topic: string;
  onBack?: () => void;
}

interface MatchingItem {
  id: number;
  text: string;
  matched: boolean;
}

const MatchingTemplate: React.FC<MatchingTemplateProps> = ({ content, topic, onBack }) => {
  const [leftItems, setLeftItems] = useState<MatchingItem[]>([]);
  const [rightItems, setRightItems] = useState<MatchingItem[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [selectedRight, setSelectedRight] = useState<number | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(content?.settings?.timeLimit || 60);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameWon, setGameWon] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const { toast } = useToast();

  const pairs = content?.pairs || [];
  const totalPairs = pairs.length;
  const difficulty = content?.settings?.difficulty || "medium";

  useEffect(() => {
    if (pairs.length > 0) {
      const shuffledLeftItems = pairs.map((pair: any, index: number) => ({
        id: index,
        text: pair.left,
        matched: false
      })).sort(() => Math.random() - 0.5);
      
      const shuffledRightItems = pairs.map((pair: any, index: number) => ({
        id: index,
        text: pair.right,
        matched: false
      })).sort(() => Math.random() - 0.5);
      
      setLeftItems(shuffledLeftItems);
      setRightItems(shuffledRightItems);
      setTimeLeft(content?.settings?.timeLimit || 60);
      setMatchedPairs(0);
      setScore(0);
      setGameOver(false);
      setGameWon(false);
      setSelectedLeft(null);
      setSelectedRight(null);
    }
  }, [pairs, content?.settings?.timeLimit]);

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
        description: "Bạn đã hết thời gian làm bài.",
        variant: "destructive",
      });
    }
  }, [timeLeft, gameOver, gameWon, toast]);

  useEffect(() => {
    if (matchedPairs === totalPairs && totalPairs > 0 && !gameWon) {
      setGameWon(true);
      const finalScore = calculateFinalScore();
      setScore(finalScore);
      
      toast({
        title: "Chúc mừng!",
        description: `Bạn đã hoàn thành trò chơi với ${totalPairs} cặp từ và đạt ${finalScore} điểm.`,
        variant: "default",
      });
    }
  }, [matchedPairs, totalPairs, gameWon, toast]);

  const calculateFinalScore = () => {
    const baseScore = matchedPairs * 10;
    const timeBonus = Math.floor(timeLeft / 5);
    let difficultyMultiplier = 1;
    switch (difficulty) {
      case "easy": difficultyMultiplier = 1; break;
      case "medium": difficultyMultiplier = 1.5; break;
      case "hard": difficultyMultiplier = 2; break;
      default: difficultyMultiplier = 1;
    }
    
    return Math.floor((baseScore + timeBonus) * difficultyMultiplier);
  };

  const handleLeftItemClick = (id: number) => {
    if (gameOver || gameWon) return;
    
    if (leftItems.find(item => item.id === id)?.matched) return;
    
    setSelectedLeft(id);
  };

  const handleRightItemClick = (id: number) => {
    if (gameOver || gameWon) return;
    
    if (rightItems.find(item => item.id === id)?.matched) return;
    
    setSelectedRight(id);
  };

  useEffect(() => {
    if (selectedLeft !== null && selectedRight !== null) {
      const checkMatch = () => {
        if (selectedLeft === selectedRight) {
          setLeftItems(prevLeftItems => 
            prevLeftItems.map(item => 
              item.id === selectedLeft ? {...item, matched: true} : item
            )
          );
          
          setRightItems(prevRightItems => 
            prevRightItems.map(item => 
              item.id === selectedRight ? {...item, matched: true} : item
            )
          );
          
          setMatchedPairs(prev => prev + 1);
          
          setScore(prev => prev + 10);
          
          toast({
            title: "Tuyệt vời!",
            description: "Bạn đã ghép đúng một cặp.",
            variant: "default",
          });
        } else {
          setScore(prev => Math.max(0, prev - 2));
          
          toast({
            title: "Không khớp",
            description: "Hãy thử lại với cặp khác.",
            variant: "destructive",
          });
        }
      };
      
      checkMatch();
      
      const timer = setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [selectedLeft, selectedRight, toast]);

  const handleRestart = () => {
    if (pairs.length > 0) {
      const shuffledLeftItems = pairs.map((pair: any, index: number) => ({
        id: index,
        text: pair.left,
        matched: false
      })).sort(() => Math.random() - 0.5);
      
      const shuffledRightItems = pairs.map((pair: any, index: number) => ({
        id: index,
        text: pair.right,
        matched: false
      })).sort(() => Math.random() - 0.5);
      
      setLeftItems(shuffledLeftItems);
      setRightItems(shuffledRightItems);
      setSelectedLeft(null);
      setSelectedRight(null);
      setMatchedPairs(0);
      setScore(0);
      setTimeLeft(content?.settings?.timeLimit || 60);
      setGameOver(false);
      setGameWon(false);
    }
  };

  const handleShare = () => {
    try {
      const gameContent = `
        <html>
        <head>
          <title>${content.title || "Trò chơi nối từ"}</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; margin: 0; padding: 20px; background: #f9f9ff; }
            .container { max-width: 800px; margin: 0 auto; }
            .game-title { text-align: center; margin-bottom: 20px; }
            .columns { display: flex; flex-direction: column; gap: 15px; }
            @media (min-width: 768px) { .columns { flex-direction: row; } }
            .column { flex: 1; padding: 15px; background: #fff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .column h3 { text-align: center; margin-top: 0; padding: 5px; background: rgba(99, 102, 241, 0.1); border-radius: 4px; }
            .item { margin-bottom: 8px; padding: 10px; border-radius: 4px; background: #f0f0f8; cursor: pointer; }
            .item.matched { background: #d1fae5; }
            .item.selected { background: rgba(99, 102, 241, 0.2); border: 1px solid rgba(99, 102, 241, 0.8); }
            .footer { margin-top: 20px; text-align: center; }
            .score { display: inline-block; padding: 8px 16px; background: #fff; border-radius: 20px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); }
          </style>
        </head>
        <body>
          <div class="container">
            <h2 class="game-title">${content.title || topic}</h2>
            <div class="columns">
              <div class="column">
                <h3>Cột A</h3>
                <div id="left-items">
                  ${pairs.map((pair: any, index: number) => 
                    `<div class="item" data-id="${index}">${pair.left}</div>`
                  ).join('')}
                </div>
              </div>
              <div class="column">
                <h3>Cột B</h3>
                <div id="right-items">
                  ${pairs.map((pair: any, index: number) => 
                    `<div class="item" data-id="${index}">${pair.right}</div>`
                  ).join('')}
                </div>
              </div>
            </div>
            <div class="footer">
              <div class="score">Trò chơi nối từ - Chia sẻ bởi QuizWhiz</div>
            </div>
          </div>
          <script>
            document.addEventListener('DOMContentLoaded', function() {
              const leftItems = document.querySelectorAll('#left-items .item');
              const rightItems = document.querySelectorAll('#right-items .item');
              
              let selectedLeft = null;
              let selectedRight = null;
              let matchedPairs = 0;
              
              leftItems.forEach(item => {
                item.addEventListener('click', function() {
                  if (this.classList.contains('matched')) return;
                  
                  leftItems.forEach(i => i.classList.remove('selected'));
                  this.classList.add('selected');
                  selectedLeft = this.dataset.id;
                  
                  checkForMatch();
                });
              });
              
              rightItems.forEach(item => {
                item.addEventListener('click', function() {
                  if (this.classList.contains('matched')) return;
                  
                  rightItems.forEach(i => i.classList.remove('selected'));
                  this.classList.add('selected');
                  selectedRight = this.dataset.id;
                  
                  checkForMatch();
                });
              });
              
              function checkForMatch() {
                if (selectedLeft !== null && selectedRight !== null) {
                  if (selectedLeft === selectedRight) {
                    const matchedLeftItem = document.querySelector(\`#left-items .item[data-id="\${selectedLeft}"]\`);
                    const matchedRightItem = document.querySelector(\`#right-items .item[data-id="\${selectedRight}"]\`);
                    
                    matchedLeftItem.classList.add('matched');
                    matchedRightItem.classList.add('matched');
                    
                    matchedLeftItem.classList.remove('selected');
                    matchedRightItem.classList.remove('selected');
                    
                    matchedPairs++;
                    
                    if (matchedPairs === ${pairs.length}) {
                      alert('Chúc mừng! Bạn đã hoàn thành trò chơi.');
                    }
                  } else {
                    setTimeout(() => {
                      leftItems.forEach(i => i.classList.remove('selected'));
                      rightItems.forEach(i => i.classList.remove('selected'));
                    }, 1000);
                  }
                  
                  selectedLeft = null;
                  selectedRight = null;
                }
              }
            });
          </script>
        </body>
        </html>
      `;
      
      const shareUrl = saveGameForSharing(
        content.title || "Trò chơi nối từ", 
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

  if (!content || !pairs.length) {
    return <div className="p-4">Không có dữ liệu trò chơi nối từ</div>;
  }

  const progressPercentage = (matchedPairs / totalPairs) * 100;

  const getItemSize = (text: string) => {
    if (difficulty === "hard") return "min-h-14 text-sm";
    if (difficulty === "easy") return "min-h-16 text-lg";
    
    return text.length > 15 
      ? "min-h-16 text-sm" 
      : text.length > 8 
        ? "min-h-14 text-base" 
        : "min-h-12 text-lg";
  };

  return (
    <div className="flex flex-col p-4 h-full">
      <div className="relative mb-4">
        {onBack && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack} 
            className="absolute top-0 left-0 z-10 flex items-center gap-1 bg-background/80 hover:bg-background/90 backdrop-blur-sm shadow-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Quay lại</span>
          </Button>
        )}
        
        <div className="flex justify-between items-center mb-2 mt-12">
          <div className="text-sm font-medium px-3 py-1 bg-primary/10 rounded-full">
            Đã ghép: {matchedPairs}/{totalPairs}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center text-sm font-medium px-3 py-1 bg-primary/10 rounded-full">
              <Trophy className="h-4 w-4 mr-1 text-yellow-500" />
              Điểm: {score}
            </div>
            <div className="text-sm font-medium flex items-center px-3 py-1 bg-primary/10 rounded-full">
              <Clock className="h-4 w-4 mr-1" />
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
          </div>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      {gameWon ? (
        <div className="flex-grow flex items-center justify-center">
          <Card className="p-6 text-center max-w-md">
            <h2 className="text-2xl font-bold mb-4">Chúc mừng!</h2>
            <p className="mb-2">Bạn đã hoàn thành trò chơi với {totalPairs} cặp từ.</p>
            <p className="mb-2 text-xl font-bold text-primary">Điểm số: {score}</p>
            <p className="mb-6">Thời gian còn lại: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</p>
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={handleRestart}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Chơi lại
              </Button>
              <Button onClick={handleShare} variant="outline">
                <Share2 className="mr-2 h-4 w-4" />
                Chia sẻ
              </Button>
            </div>
          </Card>
        </div>
      ) : gameOver ? (
        <div className="flex-grow flex items-center justify-center">
          <Card className="p-6 text-center max-w-md">
            <h2 className="text-2xl font-bold mb-4">Hết thời gian!</h2>
            <p className="mb-2">Bạn đã ghép được {matchedPairs} trong tổng số {totalPairs} cặp từ.</p>
            <p className="mb-2 text-xl font-bold text-primary">Điểm số: {score}</p>
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={handleRestart}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Chơi lại
              </Button>
              <Button onClick={handleShare} variant="outline">
                <Share2 className="mr-2 h-4 w-4" />
                Chia sẻ
              </Button>
            </div>
          </Card>
        </div>
      ) : (
        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-3 bg-background/50 border border-primary/10">
            <h3 className="text-base font-medium mb-2 text-center bg-primary/10 py-1 px-2 rounded-md">Cột A</h3>
            <div className="space-y-2">
              {leftItems.map((item) => (
                <button
                  key={`left-${item.id}`}
                  className={`w-full p-3 rounded-lg text-left break-words ${getItemSize(item.text)} flex items-center ${
                    item.matched 
                      ? 'bg-green-100 border-green-500 border opacity-50 cursor-not-allowed'
                      : selectedLeft === item.id
                        ? 'bg-primary/20 border-primary border'
                        : 'bg-secondary hover:bg-secondary/80 border-transparent border'
                  }`}
                  onClick={() => handleLeftItemClick(item.id)}
                  disabled={item.matched}
                >
                  <span className="line-clamp-2">{item.text}</span>
                </button>
              ))}
            </div>
          </Card>
          
          <Card className="p-3 bg-background/50 border border-primary/10">
            <h3 className="text-base font-medium mb-2 text-center bg-primary/10 py-1 px-2 rounded-md">Cột B</h3>
            <div className="space-y-2">
              {rightItems.map((item) => (
                <button
                  key={`right-${item.id}`}
                  className={`w-full p-3 rounded-lg text-left break-words ${getItemSize(item.text)} flex items-center ${
                    item.matched 
                      ? 'bg-green-100 border-green-500 border opacity-50 cursor-not-allowed'
                      : selectedRight === item.id
                        ? 'bg-primary/20 border-primary border'
                        : 'bg-secondary hover:bg-secondary/80 border-transparent border'
                  }`}
                  onClick={() => handleRightItemClick(item.id)}
                  disabled={item.matched}
                >
                  <span className="line-clamp-2">{item.text}</span>
                </button>
              ))}
            </div>
          </Card>
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <Button 
          variant="outline" 
          onClick={handleRestart}
          className="w-1/2 bg-gradient-to-r from-secondary/30 to-background/90 border-primary/20"
          size="sm"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Làm lại
        </Button>
        <Button 
          variant="outline" 
          onClick={handleShare}
          className="w-1/2 bg-gradient-to-r from-primary/10 to-background/90 border-primary/20"
          size="sm"
        >
          <Share2 className="mr-2 h-4 w-4" />
          Chia sẻ
        </Button>
      </div>
    </div>
  );
};

export default MatchingTemplate;
