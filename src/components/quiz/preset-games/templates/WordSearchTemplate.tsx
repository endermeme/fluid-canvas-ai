
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, Clock, Search, Sparkles, Target, Trophy, Zap, Check } from 'lucide-react';

interface WordSearchTemplateProps {
  content: any;
  topic: string;
}

interface WordLocation {
  word: string;
  startRow: number;
  startCol: number;
  endRow: number;
  endCol: number;
}

const WordSearchTemplate: React.FC<WordSearchTemplateProps> = ({ content, topic }) => {
  const [selectedStart, setSelectedStart] = useState<{row: number, col: number} | null>(null);
  const [selectedEnd, setSelectedEnd] = useState<{row: number, col: number} | null>(null);
  const [hoveredCell, setHoveredCell] = useState<{row: number, col: number} | null>(null);
  const [foundWords, setFoundWords] = useState<WordLocation[]>([]);
  const [timeLeft, setTimeLeft] = useState(content?.settings?.timeLimit || 300);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [celebratingWord, setCelebratingWord] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const { toast } = useToast();

  const grid = content?.grid || [];
  const words = content?.words || [];
  const totalWords = words.length;
  const allowDiagonalWords = content?.settings?.allowDiagonalWords || false;

  // Timer countdown
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
        description: "Bạn đã hết thời gian tìm từ.",
        variant: "destructive",
      });
    }
  }, [timeLeft, gameOver, gameWon, toast]);

  // Check if all words are found
  useEffect(() => {
    if (foundWords.length === totalWords && totalWords > 0) {
      setGameWon(true);
      toast({
        title: "Chúc mừng!",
        description: "Bạn đã tìm thấy tất cả các từ.",
        variant: "default",
      });
    }
  }, [foundWords.length, totalWords, toast]);

  const handleCellClick = (row: number, col: number) => {
    if (gameOver || gameWon) return;
    
    if (!selectedStart) {
      setSelectedStart({ row, col });
    } else if (!selectedEnd) {
      setSelectedEnd({ row, col });
      
      const wordFound = checkForWord(selectedStart.row, selectedStart.col, row, col);
      
      if (wordFound) {
        setCelebratingWord(wordFound);
        
        setFoundWords([...foundWords, {
          word: wordFound,
          startRow: selectedStart.row,
          startCol: selectedStart.col,
          endRow: row,
          endCol: col
        }]);
        
        setTimeout(() => {
          setCelebratingWord(null);
          toast({
            title: "Tìm thấy từ! ✨",
            description: `Bạn đã tìm thấy từ "${wordFound}"`,
            variant: "default",
          });
        }, 1000);
      } else {
        toast({
          title: "Không tìm thấy từ 🔍",
          description: "Không có từ nào ở đây.",
          variant: "destructive",
        });
      }
      
      setSelectedStart(null);
      setSelectedEnd(null);
    }
  };

  const handleCellHover = (row: number, col: number) => {
    if (selectedStart && !selectedEnd) {
      setHoveredCell({ row, col });
    }
  };

  const checkForWord = (startRow: number, startCol: number, endRow: number, endCol: number): string | null => {
    let extractedLetters = '';
    let isValidSelection = false;
    
    if (startRow === endRow) {
      const row = startRow;
      const start = Math.min(startCol, endCol);
      const end = Math.max(startCol, endCol);
      
      for (let col = start; col <= end; col++) {
        extractedLetters += grid[row][col];
      }
      isValidSelection = true;
    } else if (startCol === endCol) {
      const col = startCol;
      const start = Math.min(startRow, endRow);
      const end = Math.max(startRow, endRow);
      
      for (let row = start; row <= end; row++) {
        extractedLetters += grid[row][col];
      }
      isValidSelection = true;
    } else if (allowDiagonalWords) {
      const rowDiff = endRow - startRow;
      const colDiff = endCol - startCol;
      
      if (Math.abs(rowDiff) === Math.abs(colDiff)) {
        const rowDir = rowDiff > 0 ? 1 : -1;
        const colDir = colDiff > 0 ? 1 : -1;
        const steps = Math.abs(rowDiff);
        
        for (let i = 0; i <= steps; i++) {
          const checkRow = startRow + (i * rowDir);
          const checkCol = startCol + (i * colDir);
          extractedLetters += grid[checkRow][checkCol];
        }
        isValidSelection = true;
      }
    }
    
    if (!isValidSelection) return null;
    
    const foundWord = words.find((w: any) => !w.found && w.word === extractedLetters);
    
    if (foundWord) {
      const updatedWords = words.map((w: any) => 
        w.word === foundWord.word ? { ...w, found: true } : w
      );
      
      if (content) {
        content.words = updatedWords;
      }
      
      return foundWord.word;
    }
    
    const reversedLetters = extractedLetters.split('').reverse().join('');
    const foundReversedWord = words.find((w: any) => !w.found && w.word === reversedLetters);
    
    if (foundReversedWord) {
      const updatedWords = words.map((w: any) => 
        w.word === foundReversedWord.word ? { ...w, found: true } : w
      );
      
      if (content) {
        content.words = updatedWords;
      }
      
      return foundReversedWord.word;
    }
    
    return null;
  };

  const isInSelectedPath = (row: number, col: number): boolean => {
    if (!selectedStart || (!selectedEnd && !hoveredCell)) return false;
    
    const endPos = selectedEnd || hoveredCell;
    if (!endPos) return false;
    
    if (selectedStart.row === endPos.row && row === selectedStart.row) {
      const startCol = Math.min(selectedStart.col, endPos.col);
      const endCol = Math.max(selectedStart.col, endPos.col);
      return col >= startCol && col <= endCol;
    }
    
    if (selectedStart.col === endPos.col && col === selectedStart.col) {
      const startRow = Math.min(selectedStart.row, endPos.row);
      const endRow = Math.max(selectedStart.row, endPos.row);
      return row >= startRow && row <= endRow;
    }
    
    if (allowDiagonalWords) {
      const rowDiff = endPos.row - selectedStart.row;
      const colDiff = endPos.col - selectedStart.col;
      
      if (Math.abs(rowDiff) === Math.abs(colDiff)) {
        const rowDir = rowDiff > 0 ? 1 : -1;
        const colDir = colDiff > 0 ? 1 : -1;
        const steps = Math.abs(rowDiff);
        
        for (let i = 0; i <= steps; i++) {
          const checkRow = selectedStart.row + (i * rowDir);
          const checkCol = selectedStart.col + (i * colDir);
          if (checkRow === row && checkCol === col) {
            return true;
          }
        }
      }
    }
    
    return false;
  };

  const isInFoundWord = (row: number, col: number): boolean => {
    return foundWords.some(word => {
      if (word.startRow === word.endRow && row === word.startRow) {
        const startCol = Math.min(word.startCol, word.endCol);
        const endCol = Math.max(word.startCol, word.endCol);
        return col >= startCol && col <= endCol;
      }
      
      if (word.startCol === word.endCol && col === word.startCol) {
        const startRow = Math.min(word.startRow, word.endRow);
        const endRow = Math.max(word.startRow, word.endRow);
        return row >= startRow && row <= endRow;
      }
      
      const rowDiff = word.endRow - word.startRow;
      const colDiff = word.endCol - word.startCol;
      
      if (Math.abs(rowDiff) === Math.abs(colDiff)) {
        const rowDir = rowDiff > 0 ? 1 : -1;
        const colDir = colDiff > 0 ? 1 : -1;
        const steps = Math.abs(rowDiff);
        
        for (let i = 0; i <= steps; i++) {
          const checkRow = word.startRow + (i * rowDir);
          const checkCol = word.startCol + (i * colDir);
          if (checkRow === row && checkCol === col) {
            return true;
          }
        }
      }
      
      return false;
    });
  };

  const handleRestart = () => {
    setSelectedStart(null);
    setSelectedEnd(null);
    setHoveredCell(null);
    setFoundWords([]);
    setTimeLeft(content?.settings?.timeLimit || 300);
    setGameOver(false);
    setGameWon(false);
    setCelebratingWord(null);
    setShowHint(false);
    
    if (content?.words) {
      content.words.forEach((w: any) => {
        w.found = false;
      });
    }
  };

  const handleHint = () => {
    if (showHint) return;
    
    const unFoundWords = words.filter((w: any) => !w.found);
    if (unFoundWords.length > 0) {
      setShowHint(true);
      setTimeLeft(Math.max(30, timeLeft - 30));
      
      toast({
        title: "Gợi ý được kích hoạt! 💡",
        description: "Thời gian bị trừ 30 giây. Quan sát grid kỹ hơn!",
        variant: "default",
      });
      
      setTimeout(() => setShowHint(false), 3000);
    }
  };

  if (!content || !grid.length) {
    return <div className="p-4">Không có dữ liệu trò chơi tìm từ</div>;
  }

  if (gameWon) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 bg-gradient-to-br from-background via-background/95 to-green-500/10">
        <Card className="max-w-md w-full p-8 text-center bg-gradient-to-br from-primary/5 via-card/95 to-green-500/10 backdrop-blur-sm border-primary/20 shadow-2xl animate-scale-in">
          <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center bg-gradient-to-br from-green-500/20 to-green-400/10 animate-glow">
            <Trophy className="h-12 w-12 text-green-500 animate-celebration" />
          </div>
          <h2 className="text-3xl font-bold mb-4 text-primary animate-fade-in">Xuất sắc! 🎉</h2>
          <p className="text-lg mb-4">Bạn đã tìm thấy tất cả <span className="font-bold text-green-600">{totalWords}</span> từ!</p>
          <div className="mb-6 p-4 bg-gradient-to-r from-green-50/80 to-emerald-50/80 rounded-lg border border-green-200/50">
            <p className="text-green-700 font-medium flex items-center justify-center">
              <Clock className="h-5 w-5 mr-2" />
              Thời gian còn lại: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </p>
          </div>
          <Button onClick={handleRestart} className="w-full bg-gradient-to-r from-primary via-primary/90 to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg transition-all duration-300 hover:scale-105 btn-enhanced">
            <RefreshCw className="mr-2 h-4 w-4" />
            Chơi lại
          </Button>
        </Card>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 bg-gradient-to-br from-background via-background/95 to-red-500/5">
        <Card className="max-w-md w-full p-8 text-center bg-gradient-to-br from-card via-card/95 to-red-500/5 border-red-200/30 shadow-2xl animate-scale-in">
          <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center bg-gradient-to-br from-red-500/20 to-red-400/10">
            <Clock className="h-12 w-12 text-red-500 animate-pulse" />
          </div>
          <h2 className="text-3xl font-bold mb-4 text-red-600 animate-fade-in">Hết thời gian! ⏰</h2>
          <p className="text-lg mb-4">Bạn đã tìm được <span className="font-bold text-primary">{foundWords.length}</span> trong tổng số <span className="font-bold">{totalWords}</span> từ.</p>
          <Button onClick={handleRestart} className="w-full bg-gradient-to-r from-primary via-primary/90 to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg transition-all duration-300 hover:scale-105 btn-enhanced">
            <RefreshCw className="mr-2 h-4 w-4" />
            Thử lại
          </Button>
        </Card>
      </div>
    );
  }

  const progressPercentage = (foundWords.length / totalWords) * 100;

  return (
    <div className="flex flex-col p-4 h-full bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="mb-4 mt-12">
        <div className="flex justify-between items-center mb-3">
          <div className="text-sm font-medium px-4 py-2 bg-gradient-to-r from-primary/15 to-primary/10 rounded-full border border-primary/20 backdrop-blur-sm">
            <Search className="inline h-4 w-4 mr-1 text-primary" />
            Đã tìm: {foundWords.length}/{totalWords}
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm font-medium flex items-center px-3 py-2 bg-gradient-to-r from-blue-500/15 to-blue-400/10 rounded-full border border-blue-300/30 backdrop-blur-sm">
              <Clock className="h-4 w-4 mr-1 text-blue-600 animate-pulse" />
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
          </div>
        </div>
        <Progress 
          value={progressPercentage} 
          className="h-3 shadow-lg animate-progress-glow" 
        />
      </div>

      <div className="flex-grow grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3">
          <Card className={`p-4 bg-gradient-to-br from-card/80 to-card/60 border-2 border-primary/10 shadow-lg backdrop-blur-sm ${
            showHint ? 'animate-glow' : ''
          }`}>
            <h3 className="text-lg font-semibold mb-3 text-center text-primary">Lưới từ</h3>
            <div className="grid gap-1 justify-center" style={{ gridTemplateColumns: `repeat(${grid[0]?.length || 0}, 1fr)` }}>
              {grid.map((row: string[], rowIndex: number) =>
                row.map((letter: string, colIndex: number) => (
                  <button
                    key={`${rowIndex}-${colIndex}`}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                    onMouseEnter={() => handleCellHover(rowIndex, colIndex)}
                    onMouseLeave={() => setHoveredCell(null)}
                    className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg font-bold text-sm transition-all duration-200 transform relative overflow-hidden ${
                      isInFoundWord(rowIndex, colIndex)
                        ? 'bg-gradient-to-r from-green-500/30 to-green-400/20 border-green-500/40 text-green-800 scale-105 shadow-lg animate-glow'
                        : isInSelectedPath(rowIndex, colIndex)
                          ? 'bg-gradient-to-r from-primary/30 to-primary/20 border-primary/40 text-primary scale-105 shadow-md'
                          : 'bg-gradient-to-r from-secondary/80 to-secondary/60 hover:from-primary/20 hover:to-primary/10 border-transparent hover:border-primary/30 hover:scale-110 hover:shadow-md interactive-scale'
                    } border-2`}
                  >
                    {letter.toUpperCase()}
                    {celebratingWord && isInFoundWord(rowIndex, colIndex) && (
                      <div className="absolute inset-0 bg-gradient-to-r from-green-400/50 to-emerald-400/50 animate-pulse rounded-lg"></div>
                    )}
                  </button>
                ))
              )}
            </div>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <Card className="p-4 bg-gradient-to-br from-card/80 to-card/60 border-2 border-primary/10 shadow-lg backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-3 text-center text-primary flex items-center justify-center">
              <Target className="h-5 w-5 mr-2" />
              Danh sách từ
            </h3>
            <div className="space-y-2">
              {words.map((word: any, index: number) => {
                const isFound = foundWords.some(fw => fw.word === word.word);
                const isCelebrating = celebratingWord === word.word;
                
                return (
                  <div
                    key={index}
                    className={`p-3 rounded-lg transition-all duration-300 transform ${
                      isFound
                        ? 'bg-gradient-to-r from-green-100/80 to-green-50/80 border border-green-300/50 text-green-800 line-through scale-95'
                        : 'bg-gradient-to-r from-secondary/50 to-secondary/30 border border-secondary/20'
                    } ${isCelebrating ? 'animate-celebration scale-110 shadow-lg' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-medium ${isFound ? 'text-green-700' : 'text-primary'}`}>
                        {word.word.toUpperCase()}
                      </span>
                      {isFound && (
                        <Check className="h-4 w-4 text-green-600 animate-fade-in" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      <div className="mt-4 flex gap-3">
        <Button
          variant="outline"
          onClick={handleHint}
          disabled={showHint}
          className={`transition-all duration-300 hover:scale-105 ${
            showHint 
              ? 'opacity-50 bg-card/50 border-primary/10' 
              : 'bg-gradient-to-r from-yellow-500/15 to-yellow-400/10 border-yellow-300/30 text-yellow-700 hover:bg-yellow-50 hover:border-yellow-400 btn-enhanced'
          }`}
          size="sm"
        >
          <Sparkles className="h-4 w-4 mr-1 text-yellow-500" />
          {showHint ? 'Đã dùng gợi ý' : 'Gợi ý (-30s)'}
        </Button>
        
        <Button
          variant="outline"
          onClick={handleRestart}
          className="flex-1 bg-card/70 border-primary/20 hover:bg-primary/10 hover:border-primary/40 transition-all duration-300 hover:scale-105 btn-enhanced"
          size="sm"
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Làm lại
        </Button>
      </div>
    </div>
  );
};

export default WordSearchTemplate;
