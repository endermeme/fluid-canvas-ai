import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RefreshCw, Clock, Check, Search, HelpCircle } from 'lucide-react';
import { animateBlockCreation } from '@/lib/animations';

interface WordSearch {
  title: string;
  words: string[];
  hints?: string[];
}

interface WordSearchTemplateProps {
  content: WordSearch;
  topic: string;
}

// Helper function to generate a word search grid
const generateWordSearchGrid = (words: string[], size = 10) => {
  // Initialize grid with empty cells
  const grid: string[][] = Array(size).fill(null).map(() => Array(size).fill(''));
  const placedWords: {word: string, row: number, col: number, direction: string, positions: {row: number, col: number}[]}[] = [];
  const directions = ["horizontal", "vertical", "diagonal-down", "diagonal-up"];
  
  // Try to place each word
  for (const word of words) {
    // Skip words that are too long for the grid
    if (word.length > size) continue;
    
    let placed = false;
    let attempts = 0;
    const maxAttempts = 100;
    
    // Keep trying to place the word until successful or max attempts reached
    while (!placed && attempts < maxAttempts) {
      attempts++;
      
      // Choose a random direction
      const direction = directions[Math.floor(Math.random() * directions.length)];
      
      // Calculate valid starting positions based on direction and word length
      let rowStart = 0, rowEnd = size, colStart = 0, colEnd = size;
      
      if (direction === "horizontal") {
        colEnd = size - word.length + 1;
      } else if (direction === "vertical") {
        rowEnd = size - word.length + 1;
      } else if (direction === "diagonal-down") {
        rowEnd = size - word.length + 1;
        colEnd = size - word.length + 1;
      } else if (direction === "diagonal-up") {
        rowStart = word.length - 1;
        colEnd = size - word.length + 1;
      }
      
      // Pick a random starting position
      const row = Math.floor(Math.random() * (rowEnd - rowStart)) + rowStart;
      const col = Math.floor(Math.random() * (colEnd - colStart)) + colStart;
      
      // Check if the word can be placed without conflicts
      let canPlace = true;
      const positions: {row: number, col: number}[] = [];
      
      for (let i = 0; i < word.length; i++) {
        let r = row, c = col;
        
        if (direction === "horizontal") {
          c += i;
        } else if (direction === "vertical") {
          r += i;
        } else if (direction === "diagonal-down") {
          r += i;
          c += i;
        } else if (direction === "diagonal-up") {
          r -= i;
          c += i;
        }
        
        // Check if the cell is empty or contains the same letter
        if (grid[r][c] !== '' && grid[r][c] !== word[i].toUpperCase()) {
          canPlace = false;
          break;
        }
        
        positions.push({row: r, col: c});
      }
      
      // Place the word if possible
      if (canPlace) {
        for (let i = 0; i < word.length; i++) {
          const {row: r, col: c} = positions[i];
          grid[r][c] = word[i].toUpperCase();
        }
        
        placedWords.push({
          word: word.toUpperCase(),
          row, 
          col, 
          direction,
          positions
        });
        
        placed = true;
      }
    }
  }
  
  // Fill remaining cells with random letters
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (grid[i][j] === '') {
        grid[i][j] = letters.charAt(Math.floor(Math.random() * letters.length));
      }
    }
  }
  
  return { grid, placedWords };
};

const WordSearchTemplate: React.FC<WordSearchTemplateProps> = ({ content, topic }) => {
  const [grid, setGrid] = useState<string[][]>([]);
  const [placedWords, setPlacedWords] = useState<any[]>([]);
  const [selectedCells, setSelectedCells] = useState<{row: number, col: number}[]>([]);
  const [startCell, setStartCell] = useState<{row: number, col: number} | null>(null);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [timer, setTimer] = useState(0);
  const [showHints, setShowHints] = useState(false);
  const [size, setSize] = useState(10); // default grid size
  const gameRef = useRef<HTMLDivElement>(null);
  
  // Initialize the game
  useEffect(() => {
    if (content?.words && content.words.length > 0) {
      // Determine grid size based on longest word and number of words
      const longestWordLength = Math.max(...content.words.map(w => w.length));
      const wordCount = content.words.length;
      const calculatedSize = Math.max(10, Math.min(15, Math.max(longestWordLength + 2, Math.ceil(Math.sqrt(wordCount * 3)))));
      
      setSize(calculatedSize);
      resetGame(calculatedSize);
    }
  }, [content]);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isComplete) {
        setTimer(prev => prev + 1);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isComplete]);

  // Animation when component mounts
  useEffect(() => {
    if (gameRef.current) {
      gameRef.current.querySelectorAll('.grid-cell').forEach((element, index) => {
        setTimeout(() => {
          if (element instanceof HTMLElement) {
            animateBlockCreation(element);
          }
        }, index * 5); // Fast animation for grid cells
      });
    }
  }, [grid]);

  // Check for game completion
  useEffect(() => {
    if (content?.words && foundWords.length === content.words.length) {
      setIsComplete(true);
    }
  }, [foundWords, content]);

  // Reset the game
  const resetGame = (gridSize = size) => {
    if (content?.words) {
      const { grid, placedWords } = generateWordSearchGrid(content.words, gridSize);
      setGrid(grid);
      setPlacedWords(placedWords);
      setSelectedCells([]);
      setStartCell(null);
      setFoundWords([]);
      setIsComplete(false);
      setTimer(0);
    }
  };

  // Handle cell mousedown (start selection)
  const handleCellMouseDown = (row: number, col: number) => {
    setStartCell({row, col});
    setSelectedCells([{row, col}]);
  };

  // Handle cell mouseenter (continue selection)
  const handleCellMouseEnter = (row: number, col: number) => {
    if (!startCell) return;
    
    // Determine the direction of selection
    const { row: startRow, col: startCol } = startCell;
    let newSelectedCells: {row: number, col: number}[] = [];
    
    // Horizontal selection
    if (row === startRow) {
      const start = Math.min(startCol, col);
      const end = Math.max(startCol, col);
      for (let c = start; c <= end; c++) {
        newSelectedCells.push({row, col: c});
      }
    }
    // Vertical selection
    else if (col === startCol) {
      const start = Math.min(startRow, row);
      const end = Math.max(startRow, row);
      for (let r = start; r <= end; r++) {
        newSelectedCells.push({row: r, col});
      }
    }
    // Diagonal selection (if both row and col change by the same amount)
    else if (Math.abs(row - startRow) === Math.abs(col - startCol)) {
      const rowStep = row > startRow ? 1 : -1;
      const colStep = col > startCol ? 1 : -1;
      const steps = Math.abs(row - startRow);
      
      for (let i = 0; i <= steps; i++) {
        newSelectedCells.push({
          row: startRow + (i * rowStep),
          col: startCol + (i * colStep)
        });
      }
    }
    
    if (newSelectedCells.length > 0) {
      setSelectedCells(newSelectedCells);
    }
  };

  // Handle mouseup (end selection and check for word)
  const handleMouseUp = () => {
    if (selectedCells.length < 2) {
      setSelectedCells([]);
      setStartCell(null);
      return;
    }
    
    // Extract the selected word
    const selectedWord = selectedCells.map(cell => grid[cell.row][cell.col]).join('');
    
    // Check if it matches any of the placed words
    const matchedWord = placedWords.find(placedWord => 
      placedWord.word === selectedWord || placedWord.word === selectedWord.split('').reverse().join('')
    );
    
    if (matchedWord && !foundWords.includes(matchedWord.word)) {
      setFoundWords(prev => [...prev, matchedWord.word]);
    } else {
      // No match, clear selection
      setSelectedCells([]);
    }
    
    setStartCell(null);
  };

  // Format timer display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Check if a cell is in the selected cells
  const isCellSelected = (row: number, col: number) => {
    return selectedCells.some(cell => cell.row === row && cell.col === col);
  };

  // Check if a cell is part of a found word
  const isCellInFoundWord = (row: number, col: number) => {
    return placedWords.some(word => 
      foundWords.includes(word.word) && 
      word.positions.some(pos => pos.row === row && pos.col === col)
    );
  };

  if (!content || !content.words || content.words.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">Không có nội dung</h3>
          <p className="text-gray-500">Không tìm thấy từ cho trò chơi tìm từ này.</p>
        </div>
      </div>
    );
  }

  // Show completion screen
  if (isComplete) {
    const score = Math.max(100 - Math.floor(timer / 10), 60);
    
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 animate-fade-in">
        <Card className="w-full max-w-md p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Tìm thành công!</h2>
          
          <div className="mb-6">
            <div className="text-4xl font-bold mb-2">{score}%</div>
            <Progress value={score} className="h-2" />
          </div>
          
          <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-100 p-3 rounded-md">
              <p className="font-semibold">Thời gian</p>
              <p className="text-xl">{formatTime(timer)}</p>
            </div>
            <div className="bg-gray-100 p-3 rounded-md">
              <p className="font-semibold">Từ đã tìm</p>
              <p className="text-xl">{foundWords.length}/{content.words.length}</p>
            </div>
          </div>
          
          <Button onClick={() => resetGame()} className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            Chơi lại
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-4" ref={gameRef}>
      <div className="mb-4 flex justify-between items-center flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => resetGame()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Xáo trộn lại
          </Button>
          
          <Button 
            variant={showHints ? "default" : "outline"} 
            size="sm" 
            onClick={() => setShowHints(!showHints)}
          >
            <HelpCircle className="mr-2 h-4 w-4" />
            {showHints ? 'Ẩn gợi ý' : 'Hiện gợi ý'}
          </Button>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span className="text-sm">{formatTime(timer)}</span>
          </div>
          <div className="text-sm">
            <span className="font-medium">Tìm thấy:</span> {foundWords.length}/{content.words.length}
          </div>
        </div>
      </div>
      
      <Progress 
        value={(foundWords.length / content.words.length) * 100} 
        className="h-2 mb-4" 
      />
      
      <div className="flex flex-col md:flex-row gap-4">
        {/* Word search grid */}
        <div className="flex-1">
          <div 
            className="grid gap-1 w-fit mx-auto"
            style={{ gridTemplateColumns: `repeat(${size}, minmax(24px, 1fr))` }}
            onMouseLeave={handleMouseUp}
          >
            {grid.map((row, rowIndex) => (
              <React.Fragment key={`row-${rowIndex}`}>
                {row.map((cell, colIndex) => (
                  <div
                    key={`cell-${rowIndex}-${colIndex}`}
                    className={`
                      grid-cell w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center font-medium text-sm sm:text-base rounded-sm
                      select-none transition-colors cursor-pointer
                      ${isCellInFoundWord(rowIndex, colIndex) 
                        ? 'bg-green-200 text-green-900' 
                        : isCellSelected(rowIndex, colIndex)
                          ? 'bg-blue-200 text-blue-900'
                          : 'bg-white hover:bg-gray-100 border border-gray-200'}
                    `}
                    onMouseDown={() => handleCellMouseDown(rowIndex, colIndex)}
                    onMouseEnter={() => handleCellMouseEnter(rowIndex, colIndex)}
                    onMouseUp={handleMouseUp}
                  >
                    {cell}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
        
        {/* Word list */}
        <div className="md:w-64 space-y-1">
          <h3 className="font-medium text-lg mb-3 flex items-center gap-2">
            <Search className="h-4 w-4" />
            Tìm các từ sau:
          </h3>
          
          {content.words.map((word, index) => (
            <div 
              key={word}
              className={`
                p-2 rounded-md text-sm flex justify-between items-center
                ${foundWords.includes(word.toUpperCase()) 
                  ? 'bg-green-100 text-green-900' 
                  : 'bg-white border border-gray-200'}
              `}
            >
              <span>{word.toUpperCase()}</span>
              {foundWords.includes(word.toUpperCase()) && (
                <Check className="h-4 w-4 text-green-600" />
              )}
              {showHints && content.hints && content.hints[index] && !foundWords.includes(word.toUpperCase()) && (
                <span className="text-xs text-gray-500 italic">{content.hints[index]}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WordSearchTemplate;
