
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import EnhancedGameView from '@/components/custom/EnhancedGameView';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const GameSharePage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const [gameData, setGameData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchGame = async () => {
      if (!gameId) {
        setError('ID game không hợp lệ');
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('games')
          .select('*')
          .eq('id', gameId)
          .single();

        if (error) {
          throw error;
        }

        if (!data) {
          setError('Không tìm thấy game');
          return;
        }

        setGameData(data);
      } catch (err) {
        console.error('Error fetching game:', err);
        setError('Không thể tải game. Vui lòng thử lại.');
        toast({
          title: "Lỗi",
          description: "Không thể tải game. Vui lòng thử lại.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [gameId, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Đang tải game...</p>
        </Card>
      </div>
    );
  }

  if (error || !gameData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-xl font-bold mb-4">Lỗi tải game</h2>
          <p className="text-muted-foreground">{error || 'Game không tồn tại'}</p>
        </Card>
      </div>
    );
  }

  const miniGame = {
    title: gameData.title || 'Game Chia Sẻ',
    content: gameData.html_content || gameData.content || ''
  };

  return (
    <div className="min-h-screen">
      <EnhancedGameView 
        miniGame={miniGame}
        hideHeader={false}
        isTeacher={false}
      />
    </div>
  );
};

export default GameSharePage;
