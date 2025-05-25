
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Play } from 'lucide-react';
import GameSettings from '../shared/GameSettings';
import { GameSettingsData } from '../shared/types';

interface PresetGameManagerProps {
  gameType: string;
  onBack: () => void;
  initialTopic?: string;
}

const PresetGameManager: React.FC<PresetGameManagerProps> = ({
  gameType,
  onBack,
  initialTopic = ""
}) => {
  const [topic, setTopic] = useState(initialTopic);
  const [showSettings, setShowSettings] = useState(!initialTopic);

  const gameTypeNames: Record<string, string> = {
    quiz: 'Trắc Nghiệm',
    flashcards: 'Thẻ Ghi Nhớ',
    matching: 'Nối Từ',
    memory: 'Trò Chơi Ghi Nhớ',
    ordering: 'Sắp Xếp Câu',
    wordsearch: 'Tìm Từ Ẩn',
    pictionary: 'Đoán Hình',
    truefalse: 'Đúng hay Sai'
  };

  const handleStartGame = (settings: GameSettingsData) => {
    console.log('Starting game:', gameType, 'with settings:', settings);
    // TODO: Implement game generation logic
  };

  if (showSettings) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <h2 className="text-2xl font-bold">
            Cài đặt {gameTypeNames[gameType] || gameType}
          </h2>
        </div>

        <div className="max-w-2xl mx-auto">
          <GameSettings
            topic={topic || `game ${gameType}`}
            onStart={handleStartGame}
            onCancel={onBack}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
        <h2 className="text-2xl font-bold">
          {gameTypeNames[gameType] || gameType}
        </h2>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Sẵn sàng chơi {gameTypeNames[gameType]}
          </CardTitle>
          <CardDescription>
            Game đã được tạo và sẵn sàng để chơi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-lg mb-4">
              Game {gameTypeNames[gameType]} về "{topic}" đã sẵn sàng!
            </p>
            <Button onClick={() => setShowSettings(true)}>
              Chơi ngay
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PresetGameManager;
