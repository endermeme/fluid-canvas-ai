import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, Clock, ArrowLeft, Trophy, Share2 } from 'lucide-react';
import { saveGameForSharing } from '@/services/storage';

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

  const handleShare = async () => {
    try {
      const gameContent = `
        <html>
        <head>
          <title>${content.title || "Trò chơi ghép cặp"}</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; margin: 0; padding: 20px; background: #f5f7ff; }
            .container { max-width: 800px; margin: 0 auto; }
            .game-title { text-align: center; margin-bottom: 20px; }
            .matching-area { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
            @media (max-width: 640px) { .matching-area { grid-template-columns: 1fr; } }
            .column { display: flex; flex-direction: column; gap: 10px; }
            .card { background: white; border-radius: 8px; padding: 15px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; border: 2px solid transparent; }
            .card:hover { transform: translateY(-2px); box-shadow: 0 6px 12px rgba(0,0,0,0.15); }
            .card.selected { border-color: #6366f1; background-color: rgba(99, 102, 241, 0.1); }
            .card.matched { border-color: #10b981; background-color: rgba(16, 185, 129, 0.1); }
            .card.incorrect { border-color: #ef4444; background-color: rgba(239, 68, 68, 0.1); }
            .controls { display: flex; justify-content: center; gap: 10px; margin: 20px 0; }
            .button { padding: 10px 20px; background: #6366f1; color: white; border: none; border-radius: 5px; cursor: pointer; display: flex; align-items: center; gap: 5px; }
            .result-panel { background: white; border-radius: 10px; padding: 20px; text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.1); display: none; }
            .result-panel.visible { display: block; }
            .trophy { width: 60px; height: 60px; margin: 0 auto 15px; color: #eab308; }
            .message { font-size: 24px; font-weight: bold; margin-bottom: 15px; }
            .score { font-size: 18px; margin-bottom: 20px; }
            .progress { height: 6px; background: #e2e8f0; margin-bottom: 15px; border-radius: 3px; overflow: hidden; }
            .progress-bar { height: 100%; background: #6366f1; transition: width 0.3s; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2 class="game-title">${content.title || topic}</h2>
            
            <div class="progress">
              <div class="progress-bar" id="progress-bar" style="width: 0%"></div>
            </div>
            
            <div id="instructions" style="background: #e0e7ff; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
              <p style="margin: 0;">${content?.instructions || "Nhấp vào một mục bên trái, sau đó nhấp vào mục tương ứng bên phải để ghép cặp."}</p>
            </div>
            
            <div class="matching-area">
              <div class="column" id="left-column">
                ${content.pairs.map((pair, i) => 
                  `<div class="card" data-index="${i}" data-side="left">${pair.left}</div>`
                ).join('')}
              </div>
              <div class="column" id="right-column">
                ${content.pairs.map((pair, i) => 
                  `<div class="card" data-index="${i}" data-side="right">${pair.right}</div>`
                ).join('')}
              </div>
            </div>
            
            <div class="controls">
              <button class="button" id="reset-btn" style="background: #6b7280;">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38"/></svg>
                Làm lại
              </button>
              
              <button class="button" id="shuffle-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22"/><path d="m18 2 4 4-4 4"/><path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2"/><path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8"/><path d="m18 14 4 4-4 4"/></svg>
                Xáo trộn
              </button>
            </div>
            
            <div class="result-panel" id="result-panel">
              <svg xmlns="http://www.w3.org/2000/svg" class="trophy" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
              <div class="message" id="result-message">Chúc mừng!</div>
              <div class="score" id="result-score">Bạn đã hoàn thành tất cả các ghép cặp.</div>
              <button class="button" id="play-again-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38"/></svg>
                Chơi lại
              </button>
            </div>
            
            <div class="footer">
              <div>Trò chơi ghép cặp - Chia sẻ bởi QuizWhiz</div>
            </div>
          </div>
          
          <script>
            document.addEventListener('DOMContentLoaded', function() {
              const leftColumn = document.getElementById('left-column');
              const rightColumn = document.getElementById('right-column');
              const resetBtn = document.getElementById('reset-btn');
              const shuffleBtn = document.getElementById('shuffle-btn');
              const resultPanel = document.getElementById('result-panel');
              const resultMessage = document.getElementById('result-message');
              const resultScore = document.getElementById('result-score');
              const playAgainBtn = document.getElementById('play-again-btn');
              const progressBar = document.getElementById('progress-bar');
              
              const totalPairs = ${content.pairs.length};
              let matchedPairs = 0;
              let selectedCard = null;
              
              // Initialize
              shuffleCards();
              
              // Set up click handlers
              const cards = document.querySelectorAll('.card');
              cards.forEach(card => {
                card.addEventListener('click', handleCardClick);
              });
              
              // Set up button handlers
              resetBtn.addEventListener('click', resetGame);
              shuffleBtn.addEventListener('click', shuffleCards);
              playAgainBtn.addEventListener('click', resetGame);
              
              function handleCardClick() {
                // If already matched, ignore click
                if (this.classList.contains('matched')) {
                  return;
                }
                
                // If no card is selected, select this one
                if (!selectedCard) {
                  selectedCard = this;
                  this.classList.add('selected');
                  return;
                }
                
                // If same card is clicked, deselect it
                if (selectedCard === this) {
                  selectedCard.classList.remove('selected');
                  selectedCard = null;
                  return;
                }
                
                // If card is from same side, switch selection
                const selectedSide = selectedCard.dataset.side;
                if (this.dataset.side === selectedSide) {
                  selectedCard.classList.remove('selected');
                  selectedCard = this;
                  this.classList.add('selected');
                  return;
                }
                
                // Check if the pair matches
                const selectedIndex = selectedCard.dataset.index;
                const thisIndex = this.dataset.index;
                
                if (selectedIndex === thisIndex) {
                  // Match found
                  selectedCard.classList.remove('selected');
                  selectedCard.classList.add('matched');
                  this.classList.add('matched');
                  selectedCard = null;
                  matchedPairs++;
                  
                  // Update progress
                  updateProgress();
                  
                  // Check if game is complete
                  if (matchedPairs === totalPairs) {
                    setTimeout(showGameComplete, 500);
                  }
                } else {
                  // No match
                  this.classList.add('incorrect');
                  selectedCard.classList.add('incorrect');
                  
                  setTimeout(() => {
                    this.classList.remove('incorrect');
                    selectedCard.classList.remove('incorrect', 'selected');
                    selectedCard = null;
                  }, 1000);
                }
              }
              
              function shuffleCards() {
                // Shuffle right column only
                const rightCards = Array.from(rightColumn.children);
                for (let i = rightCards.length - 1; i > 0; i--) {
                  const j = Math.floor(Math.random() * (i + 1));
                  rightColumn.appendChild(rightCards[j]);
                }
              }
              
              function resetGame() {
                // Reset all cards
                const cards = document.querySelectorAll('.card');
                cards.forEach(card => {
                  card.classList.remove('selected', 'matched', 'incorrect');
                });
                
                // Reset variables
                selectedCard = null;
                matchedPairs = 0;
                
                // Shuffle cards
                shuffleCards();
                
                // Update progress
                updateProgress();
                
                // Hide results
                resultPanel.classList.remove('visible');
              }
              
              function updateProgress() {
                const progressPercent = (matchedPairs / totalPairs) * 100;
                progressBar.style.width = \`\${progressPercent}%\`;
              }
              
              function showGameComplete() {
                resultPanel.classList.add('visible');
              }
            });
          </script>
        </body>
        </html>
      `;
      
      // Lưu và chia sẻ game
      const shareUrl = await saveGameForSharing(
        content.title || `Trò chơi ghép cặp - ${topic}`,
        `Ghép cặp các mục với chủ đề "${topic}".`,
        gameContent
      );
      
      if (shareUrl) {
        navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Đã chia sẻ!",
          description: "Liên kết đã được sao chép vào clipboard.",
          variant: "default",
        });
      } else {
        throw new Error("Không thể tạo liên kết chia sẻ");
      }
    } catch (error) {
      console.error("Lỗi khi chia sẻ trò chơi:", error);
      toast({
        title: "Lỗi chia sẻ",
        description: "Không thể chia sẻ trò chơi. Vui lòng thử lại sau.",
        variant: "destructive"
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
