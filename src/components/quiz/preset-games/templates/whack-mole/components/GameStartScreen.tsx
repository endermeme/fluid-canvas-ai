
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

interface GameStartScreenProps {
  title: string;
  description: string;
  onStart: () => void;
}

const GameStartScreen: React.FC<GameStartScreenProps> = ({ title, description, onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <Card className="p-8 max-w-2xl w-full text-center">
        <div className="mb-6">
          <div className="text-8xl mb-4">🦔</div>
          <h1 className="text-3xl font-bold text-green-800 mb-4">{title}</h1>
          <p className="text-lg text-gray-600 mb-6">{description}</p>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <h3 className="text-xl font-semibold mb-4 text-blue-800">Cách chơi:</h3>
          <div className="text-left space-y-2 text-blue-700">
            <p>• 3 con chuột sẽ xuất hiện cùng lúc từ các lỗ</p>
            <p>• Nhấp vào chuột có đáp án đúng cho câu hỏi</p>
            <p>• Chuột xanh = đúng, chuột đỏ = sai</p>
            <p>• Thời gian có hạn, hãy nhanh tay!</p>
            <p>• Mỗi câu đúng được điểm, câu sai bị trừ điểm</p>
          </div>
        </div>

        <Button 
          onClick={onStart}
          size="lg"
          className="bg-gradient-to-r from-green-600 to-yellow-600 hover:from-green-700 hover:to-yellow-700 text-white px-8 py-4 text-xl"
        >
          <Play className="h-6 w-6 mr-2" />
          Bắt đầu chơi
        </Button>
      </Card>
    </div>
  );
};

export default GameStartScreen;
