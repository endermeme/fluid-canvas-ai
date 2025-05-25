
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import GameSettings from '@/components/shared/GameSettings';
import { GameSettingsData } from '@/components/shared/types';

export interface PresetGameManagerProps {
  onBack: () => void;
  initialTopic: string;
}

const PresetGameManager: React.FC<PresetGameManagerProps> = ({
  onBack,
  initialTopic
}) => {
  const [gameSettingsVisible, setGameSettingsVisible] = useState(false);
  const [gameSettings, setGameSettings] = useState<GameSettingsData>({
    difficulty: 'medium',
    language: 'vi',
    useCanvas: true,
  });

  const handleStartGame = (settings: GameSettingsData) => {
    setGameSettings(settings);
    console.log('Starting game with settings:', settings);
  };

  const handleOpenSettings = () => {
    setGameSettingsVisible(true);
  };

  const handleCloseSettings = () => {
    setGameSettingsVisible(false);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <Card className="w-full max-w-md mx-auto my-16">
        <CardHeader>
          <CardTitle>Chơi nhanh</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Chơi nhanh một game có sẵn với chủ đề: {initialTopic}
          </p>
          <div className="mt-4 space-y-2">
            <Button variant="outline" onClick={handleOpenSettings}>
              Tùy chỉnh cài đặt
            </Button>
            <Button className="w-full" onClick={() => handleStartGame(gameSettings)}>
              Bắt đầu chơi
            </Button>
            <Button variant="ghost" onClick={onBack}>
              Quay lại
            </Button>
          </div>
        </CardContent>
      </Card>

      {gameSettingsVisible && (
        <GameSettings
          onStart={handleStartGame}
          initialSettings={gameSettings}
          onCancel={handleCloseSettings}
        />
      )}
    </div>
  );
};

export default PresetGameManager;
