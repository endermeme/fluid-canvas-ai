import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, ArrowUp, ArrowDown, Check, Clock, Shuffle, Lightbulb, ArrowLeft, Share2 } from 'lucide-react';
import { saveGameForSharing } from '@/services/storage';

interface OrderingTemplateProps {
  content: any;
  topic: string;
  onBack?: () => void;
}

const OrderingTemplate: React.FC<OrderingTemplateProps> = ({ content, topic, onBack }) => {
  const [currentSentence, setCurrentSentence] = useState(0);
  const [shuffledWords, setShuffledWords] = useState<string[]>([]);
  const [orderedWords, setOrderedWords] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(content?.settings?.timeLimit || 180);
  const [timerRunning, setTimerRunning] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [hasShownHint, setHasShownHint] = useState(false);
  const { toast } = useToast();

  const sentences = content?.sentences || [];
  const isLastSentence = currentSentence === sentences.length - 1;

  useEffect(() => {
    if (sentences[currentSentence]) {
      const currentWords = [...sentences[currentSentence].words];
      const shuffled = [...currentWords].sort(() => Math.random() - 0.5);
      setShuffledWords(shuffled);
      setOrderedWords([]);
      setIsChecking(false);
      setHasShownHint(false);
    }
  }, [currentSentence, sentences]);

  useEffect(() => {
    if (timeLeft > 0 && timerRunning) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && timerRunning) {
      setTimerRunning(false);
      setShowResult(true);
      toast({
        title: "Hết thời gian!",
        description: "Bạn đã hết thời gian làm bài.",
        variant: "destructive",
      });
    }
  }, [timeLeft, timerRunning, toast]);

  const handleWordSelect = (word: string, index: number) => {
    if (isChecking) return;
    
    const newShuffled = [...shuffledWords];
    newShuffled.splice(index, 1);
    setShuffledWords(newShuffled);
    
    setOrderedWords([...orderedWords, word]);
  };

  const handleWordRemove = (word: string, index: number) => {
    if (isChecking) return;
    
    const newOrdered = [...orderedWords];
    newOrdered.splice(index, 1);
    setOrderedWords(newOrdered);
    
    setShuffledWords([...shuffledWords, word]);
  };

  const handleShuffleWords = () => {
    if (isChecking || shuffledWords.length === 0) return;
    
    setShuffledWords([...shuffledWords].sort(() => Math.random() - 0.5));
  };

  const handleCheck = () => {
    if (orderedWords.length !== sentences[currentSentence].words.length) {
      toast({
        title: "Chưa đủ từ",
        description: "Hãy sắp xếp tất cả các từ trước khi kiểm tra.",
        variant: "destructive",
      });
      return;
    }
    
    setIsChecking(true);
    
    const correctOrder = sentences[currentSentence].correctOrder;
    const originalWords = sentences[currentSentence].words;
    
    let isCorrect = true;
    for (let i = 0; i < correctOrder.length; i++) {
      if (orderedWords[i] !== originalWords[correctOrder[i]]) {
        isCorrect = false;
        break;
      }
    }
    
    if (isCorrect) {
      setScore(score + 1);
      toast({
        title: "Chính xác!",
        description: "Bạn đã sắp xếp đúng thứ tự các từ.",
        variant: "default",
      });
    } else {
      toast({
        title: "Chưa chính xác!",
        description: "Thứ tự các từ chưa đúng.",
        variant: "destructive",
      });
    }
    
    setTimeout(() => {
      if (isLastSentence) {
        setShowResult(true);
      } else {
        setCurrentSentence(currentSentence + 1);
      }
    }, 2000);
  };

  const handleHint = () => {
    if (isChecking || hasShownHint) return;
    
    const correctOrder = sentences[currentSentence].correctOrder;
    const originalWords = sentences[currentSentence].words;
    
    const firstCorrectWordIndex = correctOrder[0];
    const firstCorrectWord = originalWords[firstCorrectWordIndex];
    
    if (orderedWords[0] === firstCorrectWord) {
      for (let i = 1; i < correctOrder.length; i++) {
        const correctWordIndex = correctOrder[i];
        const correctWord = originalWords[correctWordIndex];
        
        if (orderedWords[i] !== correctWord) {
          const shuffledIndex = shuffledWords.indexOf(correctWord);
          if (shuffledIndex !== -1) {
            const newShuffled = [...shuffledWords];
            newShuffled.splice(shuffledIndex, 1);
            
            const newOrdered = [...orderedWords];
            if (i < newOrdered.length) {
              newShuffled.push(newOrdered[i]);
            }
            newOrdered[i] = correctWord;
            
            setShuffledWords(newShuffled);
            setOrderedWords(newOrdered);
            break;
          }
        }
      }
    } else {
      const shuffledIndex = shuffledWords.indexOf(firstCorrectWord);
      if (shuffledIndex !== -1) {
        const newShuffled = [...shuffledWords];
        newShuffled.splice(shuffledIndex, 1);
        
        const newOrdered = [...orderedWords];
        if (newOrdered.length > 0) {
          newShuffled.push(newOrdered[0]);
        }
        newOrdered[0] = firstCorrectWord;
        
        setShuffledWords(newShuffled);
        setOrderedWords(newOrdered);
      }
    }
    
    setHasShownHint(true);
    setTimeLeft(Math.max(10, timeLeft - 30));
    
    toast({
      title: "Đã dùng gợi ý",
      description: "Thời gian bị trừ 30 giây.",
      variant: "default",
    });
  };

  const handleRestart = () => {
    setCurrentSentence(0);
    setScore(0);
    setShowResult(false);
    setTimeLeft(content?.settings?.timeLimit || 180);
    setTimerRunning(true);
    setIsChecking(false);
    
    if (sentences[0]) {
      const currentWords = [...sentences[0].words];
      const shuffled = [...currentWords].sort(() => Math.random() - 0.5);
      setShuffledWords(shuffled);
      setOrderedWords([]);
    }
  };

  const handleShare = async () => {
    try {
      const gameContent = `
        <html>
        <head>
          <title>${content.title || "Sắp xếp thứ tự"}</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: system-ui, sans-serif; margin: 0; padding: 20px; background: #f5f7ff; }
            .container { max-width: 800px; margin: 0 auto; }
            .game-title { text-align: center; margin-bottom: 20px; }
            .items-container { margin-bottom: 20px; }
            .item { background: white; border: 2px solid #6366f1; border-radius: 8px; padding: 15px; margin-bottom: 10px; cursor: move; transition: transform 0.2s, box-shadow 0.2s; }
            .item:hover { transform: translateY(-2px); box-shadow: 0 5px 10px rgba(0,0,0,0.1); }
            .item.correct { border-color: #10b981; background: #d1fae5; }
            .item.incorrect { border-color: #ef4444; background: #fee2e2; }
            .controls { display: flex; justify-content: center; gap: 10px; margin: 20px 0; }
            .button { padding: 10px 20px; background: #6366f1; color: white; border: none; border-radius: 5px; cursor: pointer; display: flex; align-items: center; gap: 5px; }
            .result-panel { background: white; border-radius: 10px; padding: 20px; text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.1); display: none; }
            .result-panel.visible { display: block; }
            .trophy { width: 60px; height: 60px; margin: 0 auto 15px; color: #eab308; }
            .message { font-size: 24px; font-weight: bold; margin-bottom: 15px; }
            .score { font-size: 18px; margin-bottom: 20px; }
            .dragging { opacity: 0.5; }
            .drag-over { border-top: 2px dashed #6366f1; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2 class="game-title">${content.title || topic}</h2>
            
            <div id="instructions" style="background: #e0e7ff; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
              <p style="margin: 0;">${content?.instructions || "Kéo và thả các mục để sắp xếp chúng theo đúng thứ tự."}</p>
            </div>
            
            <div class="items-container" id="items-container">
              ${content.items.map((item, i) => 
                `<div class="item" draggable="true" data-index="${i}">${item.content}</div>`
              ).join('')}
            </div>
            
            <div class="controls">
              <button class="button" id="check-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                Kiểm tra
              </button>
              
              <button class="button" id="reset-btn" style="background: #6b7280;">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38"/></svg>
                Làm lại
              </button>
            </div>
            
            <div class="result-panel" id="result-panel">
              <svg xmlns="http://www.w3.org/2000/svg" class="trophy" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
              <div class="message" id="result-message">Chúc mừng!</div>
              <div class="score" id="result-score">Bạn đã hoàn thành đúng thứ tự.</div>
              <button class="button" id="play-again-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38"/></svg>
                Chơi lại
              </button>
            </div>
            
            <div class="footer">
              <div>Trò chơi sắp xếp thứ tự - Chia sẻ bởi QuizWhiz</div>
            </div>
          </div>
          
          <script>
            document.addEventListener('DOMContentLoaded', function() {
              const container = document.getElementById('items-container');
              const items = Array.from(container.querySelectorAll('.item'));
              const checkBtn = document.getElementById('check-btn');
              const resetBtn = document.getElementById('reset-btn');
              const resultPanel = document.getElementById('result-panel');
              const resultMessage = document.getElementById('result-message');
              const resultScore = document.getElementById('result-score');
              const playAgainBtn = document.getElementById('play-again-btn');
              
              // Shuffle items on load
              shuffleItems();
              
              // Set up drag and drop
              items.forEach(item => {
                item.addEventListener('dragstart', dragStart);
                item.addEventListener('dragover', dragOver);
                item.addEventListener('dragleave', dragLeave);
                item.addEventListener('drop', drop);
                item.addEventListener('dragend', dragEnd);
              });
              
              // Check order button
              checkBtn.addEventListener('click', checkOrder);
              
              // Reset button
              resetBtn.addEventListener('click', resetGame);
              
              // Play again button
              playAgainBtn.addEventListener('click', resetGame);
              
              let draggedItem = null;
              
              function dragStart() {
                draggedItem = this;
                setTimeout(() => this.classList.add('dragging'), 0);
              }
              
              function dragOver(e) {
                e.preventDefault();
                this.classList.add('drag-over');
              }
              
              function dragLeave() {
                this.classList.remove('drag-over');
              }
              
              function drop() {
                this.classList.remove('drag-over');
                if (this !== draggedItem) {
                  const allItems = Array.from(container.querySelectorAll('.item'));
                  const draggedIndex = allItems.indexOf(draggedItem);
                  const targetIndex = allItems.indexOf(this);
                  
                  if (draggedIndex < targetIndex) {
                    this.parentNode.insertBefore(draggedItem, this.nextSibling);
                  } else {
                    this.parentNode.insertBefore(draggedItem, this);
                  }
                }
              }
              
              function dragEnd() {
                this.classList.remove('dragging');
              }
              
              function shuffleItems() {
                const itemsArray = Array.from(items);
                for (let i = itemsArray.length - 1; i > 0; i--) {
                  const j = Math.floor(Math.random() * (i + 1));
                  container.appendChild(itemsArray[j]);
                }
              }
              
              function checkOrder() {
                const currentOrder = Array.from(container.querySelectorAll('.item'))
                  .map(item => parseInt(item.dataset.index));
                
                const correctOrder = ${JSON.stringify(content.items.map((_, i) => i))};
                let isCorrect = true;
                
                currentOrder.forEach((index, position) => {
                  const item = container.querySelectorAll('.item')[position];
                  
                  if (index === correctOrder[position]) {
                    item.classList.add('correct');
                    item.classList.remove('incorrect');
                  } else {
                    item.classList.add('incorrect');
                    item.classList.remove('correct');
                    isCorrect = false;
                  }
                });
                
                if (isCorrect) {
                  resultMessage.textContent = 'Chúc mừng!';
                  resultScore.textContent = 'Bạn đã hoàn thành đúng thứ tự.';
                } else {
                  resultMessage.textContent = 'Chưa chính xác!';
                  resultScore.textContent = 'Vui lòng kiểm tra lại các mục đang sai thứ tự.';
                }
                
                resultPanel.classList.add('visible');
              }
              
              function resetGame() {
                const allItems = container.querySelectorAll('.item');
                allItems.forEach(item => {
                  item.classList.remove('correct', 'incorrect');
                });
                
                shuffleItems();
                resultPanel.classList.remove('visible');
              }
            });
          </script>
        </body>
        </html>
      `;
      
      const shareUrl = await saveGameForSharing(
        content.title || `Trò chơi sắp xếp thứ tự - ${topic}`,
        `Sắp xếp các mục theo đúng thứ tự với chủ đề "${topic}".`,
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

  if (!content || !sentences.length) {
    return <div className="p-4">Không có dữ liệu câu</div>;
  }

  if (showResult) {
    const percentage = Math.round((score / sentences.length) * 100);
    
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <Card className="max-w-md w-full p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Kết quả</h2>
          <p className="text-lg mb-4">
            Chủ đề: <span className="font-semibold">{content.title || topic}</span>
          </p>
          
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span>Điểm số của bạn</span>
              <span className="font-bold">{percentage}%</span>
            </div>
            <Progress value={percentage} className="h-3" />
          </div>
          
          <div className="text-2xl font-bold mb-6">
            {score} / {sentences.length}
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Button onClick={handleRestart} className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Làm lại
            </Button>
            <Button onClick={handleShare} variant="outline" className="w-full">
              <Share2 className="mr-2 h-4 w-4" />
              Chia sẻ
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const progress = ((currentSentence + 1) / sentences.length) * 100;

  return (
    <div className="flex flex-col p-4 h-full">
      <div className="mb-4 relative">
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
            Câu {currentSentence + 1}/{sentences.length}
          </div>
          <div className="text-sm font-medium flex items-center px-3 py-1 bg-primary/10 rounded-full">
            <Clock className="h-4 w-4 mr-1" />
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="flex-grow">
        <div className="mb-4 text-center">
          <h3 className="text-lg font-medium mb-1">Sắp xếp lại từng từ để tạo thành câu hoàn chỉnh</h3>
          <p className="text-muted-foreground text-sm">Chọn từ theo đúng thứ tự</p>
        </div>
        
        <Card className="p-4 mb-4 min-h-[100px] flex flex-wrap gap-2 items-start content-start border border-primary/30 bg-background/80">
          {orderedWords.map((word, index) => (
            <button
              key={`ordered-${index}`}
              onClick={() => handleWordRemove(word, index)}
              disabled={isChecking}
              className={`py-2 px-3 rounded-lg ${
                isChecking 
                  ? sentences[currentSentence].correctOrder[index] === sentences[currentSentence].words.indexOf(word)
                    ? 'bg-green-100 border border-green-500'
                    : 'bg-red-100 border border-red-500'
                  : 'bg-primary/20 hover:bg-primary/30'
              }`}
            >
              {word}
            </button>
          ))}
          {orderedWords.length === 0 && (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground p-4">
              <p>Chọn từ bên dưới để bắt đầu sắp xếp</p>
            </div>
          )}
        </Card>
        
        <div className="p-4 bg-secondary/20 rounded-lg mb-4 flex flex-wrap gap-2 border border-primary/10">
          {shuffledWords.map((word, index) => (
            <button
              key={`shuffled-${index}`}
              onClick={() => handleWordSelect(word, index)}
              disabled={isChecking}
              className="py-2 px-3 bg-secondary hover:bg-secondary/80 rounded-lg"
            >
              {word}
            </button>
          ))}
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            onClick={handleShuffleWords}
            disabled={isChecking || shuffledWords.length === 0}
            size="sm"
          >
            <Shuffle className="h-4 w-4 mr-1" />
            Xáo trộn
          </Button>
          
          {content?.settings?.showHints && (
            <Button
              variant="outline"
              onClick={handleHint}
              disabled={isChecking || hasShownHint}
              className={hasShownHint ? 'opacity-50' : ''}
              size="sm"
            >
              <Lightbulb className="h-4 w-4 mr-1" />
              Gợi ý
            </Button>
          )}
          
          <Button
            onClick={handleCheck}
            disabled={orderedWords.length !== sentences[currentSentence].words.length || isChecking}
            className={orderedWords.length !== sentences[currentSentence].words.length ? 'opacity-50' : ''}
            size="sm"
          >
            <Check className="h-4 w-4 mr-1" />
            Kiểm tra
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mt-3">
        <Button
          variant="outline"
          size="sm"
          onClick={handleRestart}
          className="bg-background/70 border-primary/20"
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Làm lại
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
          className="bg-background/70 border-primary/20"
        >
          <Share2 className="h-4 w-4 mr-1" />
          Chia sẻ
        </Button>
      </div>
    </div>
  );
};

export default OrderingTemplate;
