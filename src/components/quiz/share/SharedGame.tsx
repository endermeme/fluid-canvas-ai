
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSharedGame } from '@/utils/gameExport';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Eye } from 'lucide-react';
import { enhanceIframeContent } from '../utils/iframe-utils';
import GameContainer from '../components/GameContainer';
import { useToast } from '@/hooks/use-toast';

const SharedGame: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [game, setGame] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [iframeError, setIframeError] = useState<string | null>(null);
  const [iframeRef] = useState(React.createRef<HTMLIFrameElement>());
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const loadGame = async () => {
      if (!id) {
        setError('ID game không hợp lệ');
        setLoading(false);
        return;
      }

      try {
        const loadedGame = await getSharedGame(id);
        if (loadedGame) {
          setGame(loadedGame);
        } else {
          setError('Game không tồn tại hoặc đã hết hạn');
        }
      } catch (err) {
        console.error('Error loading game:', err);
        setError('Không thể tải game. Vui lòng thử lại sau.');
      }
      setLoading(false);
    };

    loadGame();
  }, [id]);

  const handleReload = () => {
    if (!game) return;
    
    if (iframeRef.current) {
      const enhancedContent = enhanceIframeContent(game.htmlContent, game.title);
      iframeRef.current.srcdoc = enhancedContent;
      setIframeError(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="text-lg">Đang tải game...</p>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-6">
        <h1 className="text-2xl font-bold">Game không tồn tại</h1>
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={() => navigate('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
      </div>
    );
  }

  const enhancedContent = enhanceIframeContent(game.htmlContent, game.title);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <header className="bg-background/80 backdrop-blur-sm p-4 flex items-center justify-between border-b">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate(`/game/${game.id}/dashboard`)}
        >
          <Eye className="h-4 w-4 mr-2" />
          Thống kê
        </Button>
      </header>

      <main className="flex-1 overflow-hidden">
        <GameContainer
          iframeRef={iframeRef}
          content={enhancedContent}
          title={game.title}
          error={iframeError}
          onReload={handleReload}
        />
      </main>
    </div>
  );
};

export default SharedGame;
