
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, School } from 'lucide-react';

const PresetGamesPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background/50 to-background p-4">
      <div className="max-w-md w-full bg-background/95 backdrop-blur-lg rounded-lg border border-primary/20 p-6 shadow-lg">
        <div className="mb-6 flex justify-center">
          <div className="bg-primary/10 p-4 rounded-full">
            <School className="h-10 w-10 text-primary" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-center mb-2">Trò Chơi Có Sẵn</h1>
        <p className="text-center text-muted-foreground mb-6">
          Thư viện trò chơi giáo dục đang được xây dựng. Vui lòng quay lại sau.
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

export default PresetGamesPage;
