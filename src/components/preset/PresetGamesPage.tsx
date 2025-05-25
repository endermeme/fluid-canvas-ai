
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import PresetGameManager from './PresetGameManager';

const PresetGamesPage = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [showGameManager, setShowGameManager] = useState(false);

  const presetGames = [
    {
      id: 'math-quiz',
      title: 'Quiz Toán Học',
      description: 'Trò chơi câu hỏi toán học cơ bản với nhiều cấp độ khác nhau',
      topic: 'toán học cơ bản'
    },
    {
      id: 'vocabulary',
      title: 'Từ Vựng Tiếng Anh',
      description: 'Game học từ vựng tiếng Anh thông qua hình ảnh và âm thanh',
      topic: 'từ vựng tiếng anh'
    },
    {
      id: 'geography',
      title: 'Địa Lý Việt Nam',
      description: 'Khám phá bản đồ và kiến thức địa lý Việt Nam',
      topic: 'địa lý việt nam'
    },
    {
      id: 'science',
      title: 'Khoa Học Tự Nhiên',
      description: 'Thí nghiệm ảo và câu hỏi về khoa học tự nhiên',
      topic: 'khoa học tự nhiên'
    },
    {
      id: 'history',
      title: 'Lịch Sử Việt Nam',
      description: 'Timeline lịch sử và các sự kiện quan trọng',
      topic: 'lịch sử việt nam'
    },
    {
      id: 'puzzle',
      title: 'Trò Chơi Giải Đố',
      description: 'Các câu đố logic và trò chơi tư duy',
      topic: 'giải đố logic'
    }
  ];

  const handleSelectGame = (gameId: string, topic: string) => {
    setSelectedGame(topic);
    setShowGameManager(true);
  };

  const handleBack = () => {
    setShowGameManager(false);
    setSelectedGame(null);
  };

  if (showGameManager && selectedGame) {
    return (
      <PresetGameManager
        onBack={handleBack}
        initialTopic={selectedGame}
      />
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Game Có Sẵn</h1>
        <p className="text-muted-foreground">
          Chọn một trong những game được tạo sẵn để chơi ngay
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {presetGames.map((game) => (
          <Card key={game.id} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl">{game.title}</CardTitle>
              <CardDescription>{game.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full"
                onClick={() => handleSelectGame(game.id, game.topic)}
              >
                Chơi Ngay
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PresetGamesPage;
