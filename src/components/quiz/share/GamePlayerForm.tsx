
import React, { useState } from 'react';
import { StoredGame, getRemainingTime } from '@/utils/gameExport';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface GamePlayerFormProps {
  game: StoredGame;
  onJoin: (name: string) => void;
  onCancel: () => void;
}

const GamePlayerForm: React.FC<GamePlayerFormProps> = ({ game, onJoin, onCancel }) => {
  const [playerName, setPlayerName] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onJoin(playerName);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-6 p-4">
      <div className="max-w-md w-full bg-card p-6 rounded-lg shadow-lg border">
        <h1 className="text-2xl font-bold text-center mb-6">{game.title}</h1>
        <p className="text-center mb-6 text-muted-foreground">
          Nhập tên của bạn để tham gia game
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4">
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Tên của bạn"
              className="w-full p-2 border rounded-md"
              autoFocus
            />
          </div>
          
          <div className="flex flex-col space-y-2">
            <Button type="submit" className="w-full" disabled={!playerName.trim()}>
              Tham gia ngay
            </Button>
            <Button variant="outline" onClick={onCancel} className="w-full" type="button">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại
            </Button>
          </div>
        </form>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            Game còn: {getRemainingTime(game.expiresAt)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default GamePlayerForm;
