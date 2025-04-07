
import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RefreshCw, Clock } from 'lucide-react';
import { animateBlockCreation } from '@/lib/animations';

interface MemoryCard {
  id: number;
  term: string;
  definition: string;
  image?: string;
}

interface MemoryTemplateProps {
  content: MemoryCard[];
  topic: string;
}

const MemoryTemplate: React.FC<MemoryTemplateProps> = ({ content, topic }) => {
  const [cards, setCards] = useState<Array<MemoryCard & { isFlipped: boolean; isMatched: boolean }>>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const gameRef = useRef<HTMLDivElement>(null);

  // Initialize the game
  useEffect(() => {
    if (content && content.length > 0) {
      resetGame();
    }
  }, [content]);

  // Setup timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Check for game completion
  useEffect(() => {
    if (matchedPairs.length > 0 && matchedPairs.length === content.length) {
      setIsComplete(true);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [matchedPairs, content]);

  // Check for matches when two cards are flipped
  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards;
      const firstCard = cards.find(card => card.id === first);
      const secondCard = cards.find(card => card.id === second);
      
      if (firstCard && secondCard && firstCard.term === secondCard.term) {
        // Match found
        setCards(cards.map(card => 
          card.id === first || card.id === second 
            ? { ...card, isMatched: true } 
            : card
        ));
        setMatchedPairs(prev => [...prev, first, second]);
        setFlippedCards([]);
      } else {
        // No match, flip them back after a delay
        setTimeout(() => {
          setCards(cards.map(card => 
            card.id === first || card.id === second 
              ? { ...card, isFlipped: false } 
              : card
          ));
          setFlippedCards([]);
        }, 1000);
      }
      
      // Increment moves counter
      setMoves(moves + 1);
    }
  }, [flippedCards, cards, moves]);

  // Apply animations to elements
  useEffect(() => {
    if (gameRef.current) {
      gameRef.current.querySelectorAll('.memory-card').forEach((element, index) => {
        setTimeout(() => {
          if (element instanceof HTMLElement) {
            animateBlockCreation(element);
          }
        }, index * 30);
      });
    }
  }, [cards]);

  const handleCardClick = (index: number) => {
    // Ignore if 2 cards are already flipped or this card is already flipped/matched
    if (flippedCards.length >= 2 || 
        cards[index].isFlipped || 
        cards[index].isMatched ||
        flippedCards.includes(cards[index].id)) {
      return;
    }
    
    // Flip the card
    setCards(cards.map((card, idx) => 
      idx === index ? { ...card, isFlipped: true } : card
    ));
    
    // Add to flipped cards
    setFlippedCards([...flippedCards, cards[index].id]);
  };

  const resetGame = () => {
    // Create pairs of cards
    let gameCards: Array<MemoryCard & { isFlipped: boolean; isMatched: boolean }> = [];
    
    // Use content to create pairs
    content.forEach((item, index) => {
      // Card for the term
      gameCards.push({
        ...item,
        isFlipped: false,
        isMatched: false
      });
      
      // Card for the definition (with same id to match)
      gameCards.push({
        id: item.id + content.length, // Ensure unique ID for the pair
        term: item.term, // Same term to match
        definition: item.definition,
        isFlipped: false,
        isMatched: false
      });
    });
    
    // Shuffle the cards
    gameCards = gameCards.sort(() => Math.random() - 0.5);
    
    setCards(gameCards);
    setFlippedCards([]);
    setMatchedPairs([]);
    setMoves(0);
    setTimer(0);
    setIsComplete(false);
    
    // Restart timer
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
  };

  // Format timer display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Calculate optimum moves (pairs * 2)
  const optimalMoves = content.length * 2;
  
  // Calculate score based on moves and optimal moves
  const calculateScore = () => {
    const maxScore = 100;
    const movesPenalty = Math.max(0, moves - optimalMoves) * 5;
    return Math.max(0, maxScore - movesPenalty);
  };

  if (!content || content.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">Không có nội dung</h3>
          <p className="text-gray-500">Không tìm thấy thẻ nhớ cho trò chơi này.</p>
        </div>
      </div>
    );
  }

  // Show completion screen
  if (isComplete) {
    const score = calculateScore();
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
              <p className="font-semibold">Số lượt</p>
              <p className="text-xl">{moves}</p>
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

  // Determine grid columns based on number of cards
  const getGridClass = () => {
    const totalCards = cards.length;
    if (totalCards <= 8) return 'grid-cols-2 sm:grid-cols-4';
    if (totalCards <= 12) return 'grid-cols-3 sm:grid-cols-4';
    if (totalCards <= 16) return 'grid-cols-4';
    if (totalCards <= 24) return 'grid-cols-4 sm:grid-cols-6';
    return 'grid-cols-4 sm:grid-cols-6 md:grid-cols-8';
  };

  return (
    <div className="flex flex-col h-full p-4 max-w-5xl mx-auto">
      <div className="mb-4 flex justify-between items-center">
        <Button variant="outline" size="sm" onClick={resetGame}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Bắt đầu lại
        </Button>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span className="text-sm">{formatTime(timer)}</span>
          </div>
          <div className="text-sm">
            <span className="font-medium">Lượt:</span> {moves}
          </div>
          <div className="text-sm">
            <span className="font-medium">Cặp:</span> {matchedPairs.length/2}/{content.length}
          </div>
        </div>
      </div>
      
      <Progress 
        value={(matchedPairs.length / (content.length * 2)) * 100} 
        className="h-2 mb-4" 
      />
      
      <div ref={gameRef} className={`grid ${getGridClass()} gap-3 flex-grow`}>
        {cards.map((card, index) => (
          <div
            key={`card-${index}`}
            className={`
              memory-card aspect-square perspective-1000 cursor-pointer
              ${card.isMatched ? 'opacity-70' : ''}
            `}
            onClick={() => handleCardClick(index)}
          >
            <div className={`
              relative w-full h-full transition-transform duration-500 transform-style-3d
              ${(card.isFlipped || card.isMatched) ? 'rotate-y-180' : ''}
            `}>
              {/* Card Back */}
              <div className="absolute w-full h-full backface-hidden bg-primary/10 border border-primary/30 rounded-lg flex items-center justify-center">
                <span className="text-3xl font-bold text-primary/50">?</span>
              </div>
              
              {/* Card Front */}
              <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-white border border-border rounded-lg p-2 flex items-center justify-center text-center overflow-hidden">
                <div className="text-sm">
                  {card.id >= content.length ? card.definition : card.term}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Add necessary styles for 3D card effect
const style = document.createElement('style');
style.textContent = `
  .perspective-1000 { perspective: 1000px; }
  .transform-style-3d { transform-style: preserve-3d; }
  .backface-hidden { backface-visibility: hidden; }
  .rotate-y-180 { transform: rotateY(180deg); }
`;
document.head.appendChild(style);

export default MemoryTemplate;
