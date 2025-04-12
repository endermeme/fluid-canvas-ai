import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, ArrowUp, ArrowDown, Check, Clock, Shuffle, Lightbulb, ArrowLeft, Share2 } from 'lucide-react';
import { saveGameForSharing } from '@/utils/gameExport';

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

  const handleShare = () => {
    try {
      const gameContent = `
        <html>
        <head>
          <title>${content.title || "Trò chơi sắp xếp thứ tự"}</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; margin: 0; padding: 20px; background: #f9f9ff; }
            .container { max-width: 800px; margin: 0 auto; }
            .game-title { text-align: center; margin-bottom: 20px; }
            .game-description { text-align: center; margin-bottom: 20px; color: #666; }
            .ordered-area { min-height: 100px; padding: 15px; background: white; border-radius: 8px; margin-bottom: 15px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); border: 1px dashed #6366f1; }
            .words-area { padding: 15px; background: #f0f0f8; border-radius: 8px; margin-bottom: 15px; }
            .word { display: inline-block; margin: 5px; padding: 8px 16px; background: #6366f1; color: white; border-radius: 4px; cursor: pointer; }
            .ordered-word { display: inline-block; margin: 5px; padding: 8px 16px; background: white; color: #6366f1; border: 1px solid #6366f1; border-radius: 4px; cursor: pointer; }
            .controls { display: flex; justify-content: space-between; }
            .button { padding: 8px 16px; background: white; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; display: flex; align-items: center; gap: 5px; }
            .button:hover { background: #f0f0f0; }
            .check-button { background: #6366f1; color: white; border: none; }
            .check-button:hover { background: #5254c5; }
            .progress { height: 8px; background: #eee; border-radius: 4px; margin-bottom: 15px; overflow: hidden; }
            .progress-bar { height: 100%; background: #6366f1; transition: width 0.3s; }
            .timer { padding: 8px 16px; background: white; border-radius: 20px; display: inline-block; margin-bottom: 15px; }
            .result-screen { text-align: center; padding: 30px; background: white; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); margin: 20px auto; max-width: 500px; }
            .score { font-size: 24px; font-weight: bold; margin: 20px 0; }
            .footer { margin-top: 20px; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container" id="game-container">
            <h2 class="game-title">${content.title || topic}</h2>
            
            <div class="progress">
              <div class="progress-bar" id="progress-bar" style="width: ${100 / sentences.length}%;"></div>
            </div>
            
            <div class="timer" id="timer">
              <span id="minutes">3</span>:<span id="seconds">00</span>
            </div>
            
            <h3 class="game-description">Sắp xếp các từ theo đúng thứ tự</h3>
            
            <div class="ordered-area" id="ordered-area">
              <!-- Ordered words will go here -->
            </div>
            
            <div class="words-area" id="words-area">
              ${sentences[0]?.words.map((word: string) => 
                `<span class="word">${word}</span>`
              ).join('')}
            </div>
            
            <div class="controls">
              <button class="button" id="shuffle-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22"/><path d="m18 2 4 4-4 4"/><path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2"/><path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8"/><path d="m18 14 4 4-4 4"/></svg>
                Xáo trộn
              </button>
              
              <button class="button check-button" id="check-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                Kiểm tra
              </button>
            </div>
            
            <div class="footer">
              <div>Trò chơi sắp xếp thứ tự - Chia sẻ bởi QuizWhiz</div>
            </div>
          </div>
          
          <div id="result-container" style="display: none;">
            <div class="result-screen">
              <h2 id="result-title">Kết quả</h2>
              <p>Chủ đề: <span class="font-semibold">${content.title || topic}</span></p>
              
              <div class="score">
                <span id="score">0</span> / <span id="total">${sentences.length}</span>
              </div>
              
              <div class="progress" style="margin-bottom: 30px;">
                <div class="progress-bar" id="result-progress-bar" style="width: 0%;"></div>
              </div>
              
              <button class="button check-button" id="restart-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21h5v-5"/></svg>
                Làm lại
              </button>
            </div>
          </div>
          
          <script>
            document.addEventListener('DOMContentLoaded', function() {
              const sentences = ${JSON.stringify(sentences)};
              let currentSentence = 0;
              let score = 0;
              let orderedWords = [];
              let timeLeft = ${content?.settings?.timeLimit || 180};
              let timer;
              
              const orderedArea = document.getElementById('ordered-area');
              const wordsArea = document.getElementById('words-area');
              const progressBar = document.getElementById('progress-bar');
              const shuffleBtn = document.getElementById('shuffle-btn');
              const checkBtn = document.getElementById('check-btn');
              const minutesElement = document.getElementById('minutes');
              const secondsElement = document.getElementById('seconds');
              const gameContainer = document.getElementById('game-container');
              const resultContainer = document.getElementById('result-container');
              const scoreElement = document.getElementById('score');
              const totalElement = document.getElementById('total');
              const resultProgressBar = document.getElementById('result-progress-bar');
              const restartBtn = document.getElementById('restart-btn');
              
              // Initialize words
              function initializeWords() {
                // Update progress
                progressBar.style.width = \`\${((currentSentence + 1) / sentences.length) * 100}%\`;
                
                // Clear areas
                orderedArea.innerHTML = '';
                wordsArea.innerHTML = '';
                orderedWords = [];
                
                // Add words to the words area
                sentences[currentSentence].words.forEach(word => {
                  const wordElement = document.createElement('span');
                  wordElement.className = 'word';
                  wordElement.textContent = word;
                  wordElement.addEventListener('click', function() {
                    moveToOrdered(word, this);
                  });
                  wordsArea.appendChild(wordElement);
                });
              }
              
              function moveToOrdered(word, element) {
                element.remove();
                
                const orderedWordElement = document.createElement('span');
                orderedWordElement.className = 'ordered-word';
                orderedWordElement.textContent = word;
                orderedWordElement.addEventListener('click', function() {
                  moveToWords(word, this);
                });
                
                orderedArea.appendChild(orderedWordElement);
                orderedWords.push(word);
              }
              
              function moveToWords(word, element) {
                element.remove();
                
                const wordElement = document.createElement('span');
                wordElement.className = 'word';
                wordElement.textContent = word;
                wordElement.addEventListener('click', function() {
                  moveToOrdered(word, this);
                });
                
                wordsArea.appendChild(wordElement);
                
                // Remove from ordered words
                const index = orderedWords.indexOf(word);
                if (index !== -1) {
                  orderedWords.splice(index, 1);
                }
              }
              
              function shuffleWords() {
                const words = Array.from(wordsArea.children);
                for (let i = words.length - 1; i > 0; i--) {
                  const j = Math.floor(Math.random() * (i + 1));
                  wordsArea.appendChild(words[j]);
                }
              }
              
              function checkAnswer() {
                if (orderedWords.length !== sentences[currentSentence].words.length) {
                  alert('Hãy sắp xếp tất cả các từ trước khi kiểm tra.');
                  return;
                }
                
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
                  score++;
                  alert('Chính xác!');
                } else {
                  alert('Chưa chính xác!');
                }
                
                // Move to next sentence or show results
                setTimeout(() => {
                  if (currentSentence < sentences.length - 1) {
                    currentSentence++;
                    initializeWords();
                  } else {
                    showResults();
                  }
                }, 500);
              }
              
              function updateTimer() {
                const minutes = Math.floor(timeLeft / 60);
                const seconds = timeLeft % 60;
                
                minutesElement.textContent = minutes;
                secondsElement.textContent = seconds < 10 ? \`0\${seconds}\` : seconds;
                
                if (timeLeft <= 0) {
                  clearInterval(timer);
                  showResults();
                } else {
                  timeLeft--;
                }
              }
              
              function showResults() {
                clearInterval(timer);
                
                gameContainer.style.display = 'none';
                resultContainer.style.display = 'block';
                
                const percentage = Math.round((score / sentences.length) * 100);
                
                scoreElement.textContent = score;
                totalElement.textContent = sentences.length;
                resultProgressBar.style.width = \`\${percentage}%\`;
                
                document.getElementById('result-title').textContent = percentage >= 70 
                  ? 'Chúc mừng!' 
                  : 'Kết quả';
              }
              
              function restart() {
                score = 0;
                currentSentence = 0;
                timeLeft = ${content?.settings?.timeLimit || 180};
                
                gameContainer.style.display = 'block';
                resultContainer.style.display = 'none';
                
                initializeWords();
                clearInterval(timer);
                timer = setInterval(updateTimer, 1000);
                updateTimer();
              }
              
              // Set up event listeners
              shuffleBtn.addEventListener('click', shuffleWords);
              checkBtn.addEventListener('click', checkAnswer);
              restartBtn.addEventListener('click', restart);
              
              // Initialize the game
              initializeWords();
              timer = setInterval(updateTimer, 1000);
              updateTimer();
            });
          </script>
        </body>
        </html>
      `;
      
      const shareUrl = saveGameForSharing(
        content.title || "Trò chơi sắp xếp thứ tự", 
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
