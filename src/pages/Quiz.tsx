
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CustomGamesPage from './CustomGamesPage';

const Quiz: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Handle redirection to CustomGamesPage with any query parameters
  React.useEffect(() => {
    toast({
      title: "Chuyển hướng",
      description: "Đang chuyển hướng đến trang Games Tùy Chỉnh",
    });
  }, [toast]);
  
  return <CustomGamesPage />;
};

export default Quiz;
