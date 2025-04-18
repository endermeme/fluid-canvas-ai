
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import QuizContainer from '@/components/quiz/QuizContainer';
import { Loader2 } from 'lucide-react';

const SharedGame: React.FC = () => {
  const { id, gameType, slug, gameId } = useParams<{ 
    id?: string; 
    gameType?: string; 
    slug?: string; 
    gameId?: string; 
  }>();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
      setError('Game functionality has been simplified in this version');
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [id, gameId]);

  if (loading) {
    return (
      <QuizContainer title="Đang tải game...">
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </QuizContainer>
    );
  }

  return (
    <QuizContainer
      title="Game Interface"
      showBackButton={true}
      onBack={() => navigate('/preset-games')}
    >
      <div className="flex flex-col items-center justify-center h-full p-6">
        <p className="text-center mb-6 text-muted-foreground">{error}</p>
      </div>
    </QuizContainer>
  );
};

export default SharedGame;
