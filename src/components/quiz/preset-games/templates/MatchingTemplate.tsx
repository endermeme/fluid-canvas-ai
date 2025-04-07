
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Shuffle, Check, RefreshCw } from 'lucide-react';
import { animateBlockCreation } from '@/lib/animations';

interface MatchingPair {
  term: string;
  definition: string;
  hint?: string;
}

interface MatchingTemplateProps {
  content: MatchingPair[];
  topic: string;
}

const MatchingTemplate: React.FC<MatchingTemplateProps> = ({ content, topic }) => {
  const [terms, setTerms] = useState<Array<MatchingPair & { id: number }>>([]);
  const [definitions, setDefinitions] = useState<Array<MatchingPair & { id: number }>>([]);
  const [selectedTerm, setSelectedTerm] = useState<number | null>(null);
  const [selectedDefinition, setSelectedDefinition] = useState<number | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
  const [showHints, setShowHints] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [mistakes, setMistakes] = useState<number>(0);
  const [timer, setTimer] = useState<number>(0);
  const [animateSuccess, setAnimateSuccess] = useState<boolean>(false);

  // Initialize the game
  useEffect(() => {
    if (content && content.length > 0) {
      resetGame();
    }
  }, [content]);

  // Timer effect
  useEffect(() => {
    if (!isComplete) {
      const interval = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isComplete]);

  // Check if a match is made
  useEffect(() => {
    if (selectedTerm !== null && selectedDefinition !== null) {
      const termItem = terms.find(t => t.id === selectedTerm);
      const defItem = definitions.find(d => d.id === selectedDefinition);
      
      if (termItem && defItem && termItem.id === defItem.id) {
        // Correct match
        setMatchedPairs(prev => [...prev, termItem.id]);
        setAnimateSuccess(true);
        setTimeout(() => setAnimateSuccess(false), 1000);
      } else {
        // Incorrect match
        setMistakes(prev => prev + 1);
      }
      
      // Clear selections after a short delay
      setTimeout(() => {
        setSelectedTerm(null);
        setSelectedDefinition(null);
      }, 500);
    }
  }, [selectedTerm, selectedDefinition]);

  // Check if game is complete
  useEffect(() => {
    if (content && matchedPairs.length === content.length) {
      setIsComplete(true);
    }
  }, [matchedPairs, content]);

  const resetGame = () => {
    // Create arrays with IDs
    const termsWithIds = content.map((item, index) => ({
      ...item,
      id: index
    }));
    
    // Shuffle the definitions
    const shuffledDefinitions = [...termsWithIds].sort(() => Math.random() - 0.5);
    
    setTerms(termsWithIds);
    setDefinitions(shuffledDefinitions);
    setSelectedTerm(null);
    setSelectedDefinition(null);
    setMatchedPairs([]);
    setMistakes(0);
    setTimer(0);
    setIsComplete(false);
    setShowHints(false);
  };

  // Format timer display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Apply animations to elements
  useEffect(() => {
    document.querySelectorAll('.matching-item').forEach((element, index) => {
      setTimeout(() => {
        if (element instanceof HTMLElement) {
          animateBlockCreation(element);
        }
      }, index * 50);
    });
  }, [terms, definitions]);

  if (!content || content.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">Không có nội dung</h3>
          <p className="text-gray-500">Không tìm thấy các cặp ghép cho trò chơi này.</p>
        </div>
      </div>
    );
  }

  // Show completion screen
  if (isComplete) {
    const score = Math.max(100 - (mistakes * 10), 0);
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 animate-fade-in">
        <Card className="w-full max-w-md p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Hoàn thành!</h2>
          
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
              <p className="font-semibold">Số lỗi</p>
              <p className="text-xl">{mistakes}</p>
            </div>
          </div>
          
          <Button onClick={resetGame} className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            Chơi lại
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto p-4">
      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={resetGame}>
            <Shuffle className="mr-2 h-4 w-4" />
            Trộn lại
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowHints(!showHints)}
          >
            {showHints ? 'Ẩn gợi ý' : 'Hiện gợi ý'}
          </Button>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-sm">
            <span className="font-medium">Thời gian:</span> {formatTime(timer)}
          </div>
          <div className="text-sm">
            <span className="font-medium">Lỗi:</span> {mistakes}
          </div>
          <div className="text-sm">
            <span className="font-medium">Tiến độ:</span> {matchedPairs.length}/{content.length}
          </div>
        </div>
      </div>
      
      <Progress 
        value={(matchedPairs.length / content.length) * 100} 
        className="h-2 mb-4" 
      />
      
      {animateSuccess && (
        <div className="fixed inset-0 bg-green-500/20 flex items-center justify-center z-50 pointer-events-none animate-fade-out">
          <div className="bg-white rounded-full p-4 shadow-lg animate-scale-in">
            <Check className="h-12 w-12 text-green-500" />
          </div>
        </div>
      )}
      
      <div className="flex flex-col md:flex-row gap-4 flex-grow">
        {/* Terms column */}
        <div className="flex-1 space-y-3">
          <h3 className="font-medium text-lg mb-3 text-center">Thuật ngữ</h3>
          {terms.map((term) => (
            <div key={`term-${term.id}`} className="relative">
              <button
                className={`
                  matching-item w-full p-4 rounded-lg border text-left transition-all
                  ${matchedPairs.includes(term.id) 
                    ? 'bg-green-100 border-green-500 opacity-70' 
                    : selectedTerm === term.id
                      ? 'bg-blue-100 border-blue-500'
                      : 'hover:bg-accent hover:border-primary/30 border-border'
                  }
                  ${matchedPairs.includes(term.id) ? 'cursor-default' : 'cursor-pointer'}
                `}
                onClick={() => {
                  if (!matchedPairs.includes(term.id)) {
                    setSelectedTerm(term.id);
                  }
                }}
                disabled={matchedPairs.includes(term.id)}
              >
                {term.term}
              </button>
              
              {showHints && term.hint && !matchedPairs.includes(term.id) && (
                <div className="mt-1 ml-2 text-xs text-gray-500 italic">
                  Gợi ý: {term.hint}
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Definitions column */}
        <div className="flex-1 space-y-3">
          <h3 className="font-medium text-lg mb-3 text-center">Định nghĩa</h3>
          {definitions.map((def) => (
            <button
              key={`def-${def.id}`}
              className={`
                matching-item w-full p-4 rounded-lg border text-left transition-all
                ${matchedPairs.includes(def.id) 
                  ? 'bg-green-100 border-green-500 opacity-70' 
                  : selectedDefinition === def.id
                    ? 'bg-blue-100 border-blue-500'
                    : 'hover:bg-accent hover:border-primary/30 border-border'
                }
                ${matchedPairs.includes(def.id) ? 'cursor-default' : 'cursor-pointer'}
              `}
              onClick={() => {
                if (!matchedPairs.includes(def.id)) {
                  setSelectedDefinition(def.id);
                }
              }}
              disabled={matchedPairs.includes(def.id)}
            >
              {def.definition}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MatchingTemplate;
