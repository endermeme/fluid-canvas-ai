
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, Clock, RotateCcw, Search, LayoutGrid } from 'lucide-react';

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
  const [gridSize, setGridSize] = useState('medium');
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
      // First click - set start position
      setSelectedStart({ row, col });
    } else if (!selectedEnd) {
      // Second click - set end position and check word
      setSelectedEnd({ row, col });
      
      // Check if this is a valid word selection
      const wordFound = checkForWord(selectedStart.row, selectedStart.col, row, col);
      
      if (wordFound) {
        // Add to found words
        setFoundWords([...foundWords, {
          word: wordFound,
          startRow: selectedStart.row,
          startCol: selectedStart.col,
          endRow: row,
          endCol: col
        }]);
        
        toast({
          title: "Tìm thấy từ!",
          description: `Bạn đã tìm thấy từ "${wordFound}"`,
          variant: "default",
        });
      } else {
        toast({
          title: "Không tìm thấy từ",
          description: "Không có từ nào ở đây.",
          variant: "destructive",
        });
      }
      
      // Reset selection
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
      // Horizontal word
      const row = startRow;
      const start = Math.min(startCol, endCol);
      const end = Math.max(startCol, endCol);
      
      for (let col = start; col <= end; col++) {
        extractedLetters += grid[row][col];
      }
      isValidSelection = true;
    } else if (startCol === endCol) {
      // Vertical word
      const col = startCol;
      const start = Math.min(startRow, endRow);
      const end = Math.max(startRow, endRow);
      
      for (let row = start; row <= end; row++) {
        extractedLetters += grid[row][col];
      }
      isValidSelection = true;
    } else if (allowDiagonalWords) {
      // Diagonal word (if allowed)
      const rowDiff = endRow - startRow;
      const colDiff = endCol - startCol;
      
      // Check if it's a proper diagonal (same number of steps in both directions)
      if (Math.abs(rowDiff) === Math.abs(colDiff)) {
        const rowStep = rowDiff > 0 ? 1 : -1;
        const colStep = colDiff > 0 ? 1 : -1;
        const steps = Math.abs(rowDiff);
        
        for (let i = 0; i <= steps; i++) {
          const row = startRow + (i * rowStep);
          const col = startCol + (i * colStep);
          extractedLetters += grid[row][col];
        }
        isValidSelection = true;
      }
    }
    
    if (!isValidSelection) return null;
    
    // Check if this matches any word in our list
    const foundWord = words.find((w: any) => !w.found && w.word === extractedLetters);
    
    if (foundWord) {
      // Mark this word as found
      const updatedWords = words.map((w: any) => 
        w.word === foundWord.word ? { ...w, found: true } : w
      );
      
      // Update the content object with found words
      if (content) {
        content.words = updatedWords;
      }
      
      return foundWord.word;
    }
    
    // Check reverse word too
    const reversedLetters = extractedLetters.split('').reverse().join('');
    const foundReversedWord = words.find((w: any) => !w.found && w.word === reversedLetters);
    
    if (foundReversedWord) {
      // Mark this word as found
      const updatedWords = words.map((w: any) => 
        w.word === foundReversedWord.word ? { ...w, found: true } : w
      );
      
      // Update the content object with found words
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
    
    // Check if in same row (horizontal)
    if (selectedStart.row === endPos.row && row === selectedStart.row) {
      const startCol = Math.min(selectedStart.col, endPos.col);
      const endCol = Math.max(selectedStart.col, endPos.col);
      return col >= startCol && col <= endCol;
    }
    
    // Check if in same column (vertical)
    if (selectedStart.col === endPos.col && col === selectedStart.col) {
      const startRow = Math.min(selectedStart.row, endPos.row);
      const endRow = Math.max(selectedStart.row, endPos.row);
      return row >= startRow && row <= endRow;
    }
    
    // Check if in diagonal path (if allowed)
    if (allowDiagonalWords) {
      const rowDiff = endPos.row - selectedStart.row;
      const colDiff = endPos.col - selectedStart.col;
      
      if (Math.abs(rowDiff) === Math.abs(colDiff)) {
        const rowDir = rowDiff > 0 ? 1 : -1;
        const colDir = colDiff > 0 ? 1 : -1;
        
        let checkRow = selectedStart.row;
        let checkCol = selectedStart.col;
        
        for (let i = 0; i <= Math.abs(rowDiff); i++) {
          if (checkRow === row && checkCol === col) {
            return true;
          }
          checkRow += rowDir;
          checkCol += colDir;
        }
      }
    }
    
    return false;
  };

  const isInFoundWord = (row: number, col: number): WordLocation | undefined => {
    return foundWords.find(word => {
      // Check if horizontal word
      if (word.startRow === word.endRow && row === word.startRow) {
        const startCol = Math.min(word.startCol, word.endCol);
        const endCol = Math.max(word.startCol, word.endCol);
        return col >= startCol && col <= endCol;
      }
      
      // Check if vertical word
      if (word.startCol === word.endCol && col === word.startCol) {
        const startRow = Math.min(word.startRow, word.endRow);
        const endRow = Math.max(word.startRow, word.endRow);
        return row >= startRow && row <= endRow;
      }
      
      // Check if diagonal word
      if (allowDiagonalWords) {
        const rowDiff = word.endRow - word.startRow;
        const colDiff = word.endCol - word.startCol;
        
        if (Math.abs(rowDiff) === Math.abs(colDiff)) {
          const rowDir = rowDiff > 0 ? 1 : -1;
          const colDir = colDiff > 0 ? 1 : -1;
          
          let checkRow = word.startRow;
          let checkCol = word.startCol;
          
          for (let i = 0; i <= Math.abs(rowDiff); i++) {
            if (checkRow === row && checkCol === col) {
              return true;
            }
            checkRow += rowDir;
            checkCol += colDir;
          }
        }
      }
      
      return false;
    });
  };

  const handleRestart = () => {
    // Reset the game state
    setSelectedStart(null);
    setSelectedEnd(null);
    setHoveredCell(null);
    setFoundWords([]);
    setTimeLeft(content?.settings?.timeLimit || 300);
    setGameOver(false);
    setGameWon(false);
    
    // Reset found status for words
    if (content && content.words) {
      content.words = content.words.map((w: any) => ({ ...w, found: false }));
    }
  };

  if (!content || !grid.length || !words.length) {
    return <div className="p-4">Không có dữ liệu trò chơi tìm từ</div>;
  }

  const progressPercentage = (foundWords.length / totalWords) * 100;

  const handleResetSelection = () => {
    setSelectedStart(null);
    setSelectedEnd(null);
  };

  const progressBarText = () => {
    if (gameWon) {
      return "Hoàn thành!";
    } else {
      return `Đã tìm: ${foundWords.length}/${totalWords}`;
    }
  };

  const handleChangeGridSize = (size: string) => {
    setGridSize(size);
  };

  // Calculate cell size based on grid size
  const getCellSize = () => {
    switch (gridSize) {
      case 'small':
        return 'w-6 h-6 sm:w-8 sm:h-8 text-sm';
      case 'large':
        return 'w-10 h-10 sm:w-12 sm:h-12 text-lg';
      default: // medium
        return 'w-8 h-8 sm:w-10 sm:h-10 text-lg';
    }
  };

  return (
    <div className="game-container">
      {/* Header with progress and timer */}
      <div className="game-header">
        <div className="flex justify-between items-center mb-2">
          <div className="text-xs sm:text-sm font-medium px-2 py-1 bg-muted rounded-full text-primary">
            {progressBarText()}
          </div>
          <div className="text-xs sm:text-sm font-medium flex items-center px-2 py-1 bg-muted rounded-full">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-primary" />
            <span className="text-primary">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
          </div>
        </div>
        <Progress value={progressPercentage} className="h-1.5 sm:h-2" />
      </div>

      {/* Game content */}
      <div className="game-content">
        <div className="responsive-card mx-auto grid grid-cols-1 lg:grid-cols-4 gap-2 sm:gap-4">
          {/* Word grid */}
          <div className="lg:col-span-3">
            <Card className="p-2 sm:p-4 bg-white border">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm sm:text-lg font-medium text-primary">Tìm từ ẩn</h3>
                <div className="flex items-center space-x-1">
                  <Button
                    variant={gridSize === 'small' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleChangeGridSize('small')}
                    className="px-1 sm:px-2 py-1 h-6 sm:h-8 text-xs"
                  >
                    <LayoutGrid className="h-2 w-2 sm:h-3 sm:w-3 mr-0 sm:mr-1" />
                    <span className="hidden sm:inline">Nhỏ</span>
                  </Button>
                  <Button
                    variant={gridSize === 'medium' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleChangeGridSize('medium')}
                    className="px-1 sm:px-2 py-1 h-6 sm:h-8 text-xs"
                  >
                    <LayoutGrid className="h-2 w-2 sm:h-4 sm:w-4 mr-0 sm:mr-1" />
                    <span className="hidden sm:inline">Vừa</span>
                  </Button>
                  <Button
                    variant={gridSize === 'large' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleChangeGridSize('large')}
                    className="px-1 sm:px-2 py-1 h-6 sm:h-8 text-xs"
                  >
                    <LayoutGrid className="h-2 w-2 sm:h-5 sm:w-5 mr-0 sm:mr-1" />
                    <span className="hidden sm:inline">Lớn</span>
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-1 place-content-center">
                {grid.map((row: string[], rowIndex: number) => (
                  <div key={`row-${rowIndex}`} className="flex justify-center gap-1">
                    {row.map((cell: string, colIndex: number) => {
                      const isSelected = selectedStart?.row === rowIndex && selectedStart?.col === colIndex;
                      const isInPath = isInSelectedPath(rowIndex, colIndex);
                      const foundWord = isInFoundWord(rowIndex, colIndex);
                      
                      return (
                        <button
                          key={`cell-${rowIndex}-${colIndex}`}
                          className={`${getCellSize()} flex items-center justify-center rounded-md font-medium transition-all ${
                            isSelected ? 'bg-primary text-white' : ''
                          } ${
                            isInPath && !isSelected ? 'bg-primary/30' : ''
                          } ${
                            foundWord ? 'bg-green-500/20 text-green-800' : (!isSelected && !isInPath ? 'bg-muted border border-border hover:bg-muted/80' : '')
                          }`}
                          onClick={() => handleCellClick(rowIndex, colIndex)}
                          onMouseEnter={() => handleCellHover(rowIndex, colIndex)}
                          disabled={gameOver || gameWon || Boolean(foundWord)}
                        >
                          {cell}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </Card>
          </div>
          
          {/* Word list */}
          {content?.settings?.showWordList && (
            <div className="lg:col-span-1">
              <Card className="p-2 sm:p-4 bg-white border">
                <h3 className="text-sm sm:text-lg font-medium mb-2 flex items-center text-primary">
                  <Search className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  Danh sách từ
                </h3>
                <ul className="space-y-1">
                  {words.map((word: any, index: number) => (
                    <li 
                      key={index}
                      className={`py-1 sm:py-2 px-2 sm:px-3 rounded text-xs sm:text-sm ${
                        word.found || foundWords.some(fw => fw.word === word.word)
                          ? 'line-through opacity-70 bg-green-100 text-green-800'
                          : 'bg-muted border border-border'
                      }`}
                    >
                      {word.word}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="game-controls">
        <div className="responsive-card mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={handleResetSelection}
              disabled={!selectedStart}
              className="text-xs sm:text-sm"
            >
              <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Hủy chọn
            </Button>
            
            <div className="text-center text-xs sm:text-sm text-primary/70">
              Sử dụng nút làm mới ở header để chơi lại
            </div>
          </div>
        </div>
      </div>
      
      {/* Game over or win state */}
      {(gameOver || gameWon) && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="compact-card p-4 sm:p-6 text-center bg-white border">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-muted">
              {gameWon ? (
                <div className="text-green-500 text-2xl sm:text-3xl">🎉</div>
              ) : (
                <div className="text-amber-500 text-2xl sm:text-3xl">⏰</div>
              )}
            </div>
            
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-primary">
              {gameWon ? 'Chúc mừng!' : 'Hết thời gian!'}
            </h2>
            
            <p className="mb-4 text-sm sm:text-base text-primary">
              {gameWon 
                ? `Bạn đã tìm thấy tất cả ${totalWords} từ!` 
                : `Bạn đã tìm thấy ${foundWords.length} trong tổng số ${totalWords} từ.`
              }
            </p>
            
            <p className="mb-4 sm:mb-6 text-xs sm:text-sm text-primary">
              Thời gian còn lại: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </p>
            
            <div className="text-center text-xs sm:text-sm text-primary/70">
              Sử dụng nút làm mới ở header để chơi lại
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default WordSearchTemplate;
