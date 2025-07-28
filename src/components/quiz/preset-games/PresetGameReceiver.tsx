import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PresetGameView from './ui/PresetGameView';

interface PresetGameReceiverProps {
  game: {
    id: string;
    title: string;
    gameType: string;
    data?: any;
    content?: any;
    settings?: {
      password?: string;
      showLeaderboard?: boolean;
    };
  };
}

const PresetGameReceiver: React.FC<PresetGameReceiverProps> = ({ game }) => {
  const { toast } = useToast();
  const [hasJoined, setHasJoined] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJoinGame = async () => {
    if (!playerName.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tên của bạn",
        variant: "destructive"
      });
      return;
    }

    if (game.settings?.password && password !== game.settings.password) {
      toast({
        title: "Lỗi", 
        description: "Mật khẩu không chính xác",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      setHasJoined(true);
      
      toast({
        title: "Thành công",
        description: "Đã tham gia game!"
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tham gia game",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    if (!game.settings?.password) {
      const autoName = `Player_${Date.now().toString().slice(-4)}`;
      setPlayerName(autoName);
      setHasJoined(true);
    }
  };

  if (!hasJoined) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>{game.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="playerName">Tên của bạn</Label>
              <Input
                id="playerName"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Nhập tên..."
              />
            </div>
            
            {game.settings?.password && (
              <div>
                <Label htmlFor="password">Mật khẩu</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu..."
                />
              </div>
            )}

            <div className="flex gap-2">
              <Button 
                onClick={handleJoinGame}
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Đang tham gia...' : 'Tham gia'}
              </Button>
              
              {!game.settings?.password && (
                <Button 
                  variant="outline"
                  onClick={handleSkip}
                  disabled={loading}
                >
                  Bỏ qua
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PresetGameView
        miniGame={{
          title: game.title,
          gameType: game.gameType,
          data: game.data || game.content
        }}
        gameId={game.id}
        playerName={playerName}
        isTeacher={false}
      />
    </div>
  );
};

export default PresetGameReceiver;