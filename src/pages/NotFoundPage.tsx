
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { HomeIcon, ArrowLeft } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-background/80">
      <div className="text-9xl font-bold text-primary/30 mb-6">404</div>
      
      <h1 className="text-3xl font-bold mb-2 text-center">Trang không tồn tại</h1>
      <p className="text-lg text-center text-muted-foreground mb-8 max-w-md">
        Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={() => navigate(-1)} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
        
        <Button onClick={() => navigate('/')}>
          <HomeIcon className="h-4 w-4 mr-2" />
          Trang chủ
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
