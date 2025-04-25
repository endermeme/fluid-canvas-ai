
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSharedGame, getRemainingTime } from '@/utils/gameExport';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Eye } from 'lucide-react';
import { enhanceIframeContent } from '../utils/iframe-utils';
import GameContainer from '../components/GameContainer';
import { useToast } from '@/hooks/use-toast';
import { recordGameParticipant } from '../custom-games/utils/customGameAPI';

const SharedGame: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [game, setGame] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [iframeRef] = useState(React.createRef<HTMLIFrameElement>());
  const [playerName, setPlayerName] = useState<string>('');
  const [hasJoined, setHasJoined] = useState<boolean>(false);
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
        console.log("Đang tải game có ID:", id);
        const loadedGame = await getSharedGame(id);
        
        if (loadedGame) {
          console.log("Đã tải game thành công:", loadedGame);
          setGame(loadedGame);
          
          // Kiểm tra tên người chơi trong localStorage
          const storedName = localStorage.getItem(`player_${id}`);
          if (storedName) {
            setPlayerName(storedName);
            setHasJoined(true);
          }
        } else {
          console.error("Không tìm thấy game có ID:", id);
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

  const handleJoinGame = async () => {
    if (!playerName || playerName.trim() === '') {
      toast({
        title: "Tên không hợp lệ",
        description: "Vui lòng nhập tên của bạn",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Lưu tham gia vào cơ sở dữ liệu
      if (id) {
        await recordGameParticipant(id, playerName);
        
        // Lưu tên người chơi vào localStorage để lần sau không cần nhập lại
        localStorage.setItem(`player_${id}`, playerName);
        
        setHasJoined(true);
        
        toast({
          title: "Tham gia thành công",
          description: `Chào mừng ${playerName} đến với game`,
        });
      }
    } catch (error) {
      console.error("Lỗi khi ghi nhận người tham gia:", error);
      // Vẫn cho phép chơi ngay cả khi có lỗi ghi nhận
      setHasJoined(true);
    }
  };

  const handleReload = () => {
    if (!game) return;
    
    try {
      if (iframeRef.current) {
        const enhancedContent = enhanceIframeContent(game.htmlContent, game.title);
        iframeRef.current.srcdoc = enhancedContent;
        
        toast({
          title: "Đã tải lại",
          description: "Game đã được tải lại thành công",
        });
      }
    } catch (error) {
      console.error("Lỗi khi tải lại game:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải lại game",
        variant: "destructive"
      });
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

  if (!hasJoined) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-6 p-4">
        <div className="max-w-md w-full bg-card p-6 rounded-lg shadow-lg border">
          <h1 className="text-2xl font-bold text-center mb-6">{game.title}</h1>
          <p className="text-center mb-6 text-muted-foreground">
            Nhập tên của bạn để tham gia game
          </p>
          
          <div className="mb-4">
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Tên của bạn"
              className="w-full p-2 border rounded-md"
            />
          </div>
          
          <div className="flex flex-col space-y-2">
            <Button onClick={handleJoinGame} className="w-full">
              Tham gia ngay
            </Button>
            <Button variant="outline" onClick={() => navigate('/')} className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại
            </Button>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Game còn: {getRemainingTime(game.expiresAt)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Parse game content data if available
  let gameContent = null;
  try {
    // Try to find encoded data in the HTML content
    const contentMatch = game.htmlContent.match(/data-game-content="([^"]*)"/);
    if (contentMatch && contentMatch[1]) {
      gameContent = JSON.parse(decodeURIComponent(contentMatch[1]));
      console.log("Đã trích xuất dữ liệu game:", gameContent);
    }
  } catch (error) {
    console.error("Lỗi khi phân tích dữ liệu game:", error);
  }

  const enhancedContent = enhanceIframeContent(game.htmlContent, game.title);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <header className="bg-background/80 backdrop-blur-sm p-4 flex items-center justify-between border-b">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <div className="ml-4 hidden sm:block">
            <span className="font-medium">{game.title}</span>
            <span className="ml-2 text-sm text-muted-foreground">
              (Chơi với tên: {playerName})
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground hidden sm:block">
            Còn lại: {getRemainingTime(game.expiresAt)}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate(`/game/${game.id}/dashboard`)}
          >
            <Eye className="h-4 w-4 mr-2" />
            Thống kê
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        <GameContainer
          iframeRef={iframeRef}
          content={enhancedContent}
          title={game.title}
          onReload={handleReload}
        />
      </main>
    </div>
  );
};

export default SharedGame;
