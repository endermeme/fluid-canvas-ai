
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const GameController: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/preset-games');
  };

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col items-center justify-center">
      <div className="max-w-md w-full space-y-6">
        <h1 className="text-2xl font-bold text-center">Game tùy chỉnh</h1>
        <p className="text-center text-muted-foreground">
          Tính năng tạo game tùy chỉnh đang được xây dựng lại. Vui lòng quay lại sau.
        </p>
        <Button onClick={handleBack} className="w-full">
          Quay lại danh sách game
        </Button>
      </div>
    </div>
  );
};

export default GameController;
