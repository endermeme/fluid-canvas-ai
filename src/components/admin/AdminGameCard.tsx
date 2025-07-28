// Legacy admin card - simplified version
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AdminGameCardProps {
  game: any;
  onGameClick?: () => void;
  onShareGame?: (gameId: string, e: React.MouseEvent) => void;
  onViewLeaderboard?: (gameId: string, e: React.MouseEvent) => void;
  onExportData?: (gameId: string, e: React.MouseEvent) => void;
}

const AdminGameCard: React.FC<AdminGameCardProps> = ({ 
  game, 
  onGameClick,
  onShareGame,
  onViewLeaderboard,
  onExportData
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{game.title || 'Game'}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Game ID: {game.id}</p>
        <p>Type: {game.gameType || 'unknown'}</p>
      </CardContent>
    </Card>
  );
};

export default AdminGameCard;