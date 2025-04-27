
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Quiz: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col items-center justify-center">
      <div className="max-w-md w-full space-y-6">
        <h1 className="text-2xl font-bold text-center">Trang Quiz</h1>
        <p className="text-center text-muted-foreground">
          Trang này đang được xây dựng lại. Vui lòng quay lại sau.
        </p>
        <Button onClick={handleBack} className="w-full">
          Quay lại trang chủ
        </Button>
      </div>
    </div>
  );
};

export default Quiz;
