
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const CustomGame: React.FC = () => {
  const navigate = useNavigate();

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
        <h1 className="text-2xl font-bold">Tạo Game Tùy Chỉnh</h1>
      </div>

      <div className="flex flex-col items-center justify-center p-12 border rounded-lg bg-muted/20">
        <div className="mb-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Tính năng đang được phát triển</h2>
          <p className="text-muted-foreground">
            Chức năng tạo game tùy chỉnh đang được phát triển và sẽ sớm được ra mắt.
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

export default CustomGame;
