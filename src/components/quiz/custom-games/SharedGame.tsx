
import React from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const SharedGame: React.FC = () => {
  const navigate = useNavigate();
  const { id, gameId, slug, gameType } = useParams();
  
  // This is a placeholder component
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
        <h1 className="text-2xl font-bold">Trò Chơi Được Chia Sẻ</h1>
      </div>

      <div className="flex flex-col items-center justify-center p-12 border rounded-lg bg-muted/20">
        <div className="mb-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Thông tin trò chơi</h2>
          <p className="text-muted-foreground">
            Game ID: {gameId || id || 'Không có ID'}<br />
            Loại: {gameType || 'Không xác định'}<br />
            Slug: {slug || 'Không có slug'}
          </p>
        </div>
        
        <Button 
          onClick={() => navigate('/')}
          className="mt-4"
        >
          Quay lại trang chủ
        </Button>
      </div>
    </div>
  );
};

export default SharedGame;
