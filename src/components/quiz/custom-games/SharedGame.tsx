
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertCircle } from 'lucide-react';

const SharedGame: React.FC = () => {
  const { id, gameId, slug, gameType } = useParams();
  const navigate = useNavigate();
  
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background/50 to-background p-4">
      <div className="max-w-md w-full bg-background/95 backdrop-blur-lg rounded-lg border border-primary/20 p-6 shadow-lg">
        <div className="mb-6 flex justify-center">
          <div className="bg-destructive/10 p-4 rounded-full">
            <AlertCircle className="h-10 w-10 text-destructive" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-center mb-2">Game không khả dụng</h1>
        <p className="text-center text-muted-foreground mb-6">
          Chức năng chia sẻ game đang được phát triển. Vui lòng quay lại sau.
        </p>
        
        <div className="flex justify-center">
          <Button
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại trang chủ
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SharedGame;
