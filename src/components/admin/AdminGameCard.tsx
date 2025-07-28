// Legacy admin card - simplified version
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AdminGameCardProps {
  game: any;
}

const AdminGameCard: React.FC<AdminGameCardProps> = ({ game }) => {
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