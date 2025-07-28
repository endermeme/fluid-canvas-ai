import React from 'react';
import { Card } from '@/components/ui/card';
import CustomGameView from '@/components/quiz/custom-games/ui/CustomGameView';

interface SimpleGameViewProps {
  miniGame: {
    title?: string;
    content: string;
    gameType?: string;
    data?: any;
  };
  onReload?: () => void;
  className?: string;
  onBack?: () => void;
  hideHeader?: boolean;
  onShare?: () => Promise<string>;
  onNewGame?: () => void;
  extraButton?: React.ReactNode;
  isTeacher?: boolean;
  gameExpired?: boolean;
  gameId?: string;
  playerName?: string | null;
}

const SimpleGameView: React.FC<SimpleGameViewProps> = (props) => {
  // For now, just use CustomGameView for iframe-based games
  return <CustomGameView {...props} />;
};

export default SimpleGameView;