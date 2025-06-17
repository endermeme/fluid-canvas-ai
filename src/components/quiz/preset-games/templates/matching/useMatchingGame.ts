
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface MatchingItem {
  id: number;
  text: string;
  matched: boolean;
}

interface UseMatchingGameProps {
  pairs: any[];
  timeLimit: number;
  difficulty: string;
}

export const useMatchingGame = ({ pairs, timeLimit, difficulty }: UseMatchingGameProps) => {
  const [leftItems, setLeftItems] = useState<MatchingItem[]>([]);
  const [rightItems, setRightItems] = useState<MatchingItem[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [selectedRight, setSelectedRight] = useState<number | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(timeLimit);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameWon, setGameWon] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const { toast } = useToast();

  const totalPairs = pairs.length;

  const initializeGame = () => {
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
      setTimeLeft(timeLimit);
      setMatchedPairs(0);
      setScore(0);
      setGameOver(false);
      setGameWon(false);
      setSelectedLeft(null);
      setSelectedRight(null);
    }
  };

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

  // Initialize game
  useEffect(() => {
    initializeGame();
  }, [pairs, timeLimit]);

  // Timer logic
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

  // Check win condition
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

  // Match checking logic
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

  return {
    leftItems,
    rightItems,
    selectedLeft,
    selectedRight,
    matchedPairs,
    timeLeft,
    gameOver,
    gameWon,
    score,
    totalPairs,
    handleLeftItemClick,
    handleRightItemClick,
    handleRestart: initializeGame
  };
};
