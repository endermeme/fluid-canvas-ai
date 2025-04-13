
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cleanupExpiredGames, getRemainingTime, StoredGame } from '@/utils/gameExport';
import { getGamesFromServer, checkServerStatus } from '@/utils/serverStorage';
import QuizContainer from '@/components/quiz/QuizContainer';
import { Button } from '@/components/ui/button';
import { Plus, Clock, ExternalLink, Server, WifiOff, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const GameHistoryPage: React.FC = () => {
  const [games, setGames] = useState<StoredGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [serverGames, setServerGames] = useState<StoredGame[]>([]);
  const [isServerAvailable, setIsServerAvailable] = useState(true);
  const [activeTab, setActiveTab] = useState<'server' | 'local'>('server');
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    const checkServer = async () => {
      const isOnline = await checkServerStatus();
      setIsServerAvailable(isOnline);
      
      if (!isOnline) {
        toast({
          title: "Không thể kết nối đến máy chủ",
          description: "Đang hiển thị game được lưu trữ cục bộ",
          variant: "destructive"
        });
        setActiveTab('local');
      }
    };
    
    checkServer();
    loadGames();
  }, []);
  
  const loadGames = async () => {
    setLoading(true);
    
    // Tải game từ server
    if (isServerAvailable) {
      try {
        const serverResponse = await getGamesFromServer(1, 100, 'newest');
        if (serverResponse.success && serverResponse.data) {
          setServerGames(serverResponse.data.games);
        } else {
          setIsServerAvailable(false);
          setActiveTab('local');
          toast({
            title: "Không thể tải game từ máy chủ",
            description: "Đang hiển thị game được lưu trữ cục bộ",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Error loading server games:", error);
        setIsServerAvailable(false);
        setActiveTab('local');
      }
    }
    
    // Luôn tải game từ localStorage để backup
    cleanupExpiredGames();
    const gamesJson = localStorage.getItem('shared_games');
    if (gamesJson) {
      const parsedGames: StoredGame[] = JSON.parse(gamesJson);
      const now = Date.now();
      const validGames = parsedGames.filter(game => game.expiresAt > now);
      setGames(validGames);
    } else {
      setGames([]);
    }
    
    setLoading(false);
  };
  
  const handleGameClick = (gameId: string, isServerGame: boolean = false) => {
    if (isServerGame) {
      navigate(`/share/${gameId}`);
    } else {
      navigate(`/game/${gameId}`);
    }
  };
  
  const handleCreateNew = () => {
    navigate('/custom-game');
  };
  
  const renderGames = (gameList: StoredGame[], isServerGame: boolean = false) => {
    if (gameList.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-10">
          <p className="text-center mb-4 text-muted-foreground">Chưa có game nào được tạo</p>
          <Button onClick={handleCreateNew} className="flex items-center gap-2">
            <Plus size={16} />
            Tạo Game Mới
          </Button>
        </div>
      );
    }
    
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {gameList.map(game => (
          <div 
            key={game.id}
            className="border rounded-lg p-4 hover:bg-accent/40 transition-colors cursor-pointer"
            onClick={() => handleGameClick(game.id, isServerGame)}
          >
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-medium">{game.title}</h3>
              {isServerGame ? (
                <Server size={16} className="text-primary" />
              ) : (
                <WifiOff size={16} className="text-muted-foreground" />
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{game.description}</p>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center">
                <Clock size={14} className="mr-1" />
                <span>Còn lại: {getRemainingTime(game.expiresAt || (game.createdAt + 30 * 24 * 60 * 60 * 1000))}</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  handleGameClick(game.id, isServerGame);
                }}
              >
                <ExternalLink size={12} className="mr-1" />
                Mở
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <QuizContainer
      title="Lịch Sử Game"
      showBackButton={true}
      onBack={() => navigate('/')}
    >
      <div className="p-4 h-full overflow-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Đang tải lịch sử game...</p>
          </div>
        ) : (
          <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value as 'server' | 'local')}>
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger 
                  value="server" 
                  disabled={!isServerAvailable}
                  className="flex items-center gap-2"
                >
                  <Server size={14} />
                  Game Từ Máy Chủ
                </TabsTrigger>
                <TabsTrigger 
                  value="local"
                  className="flex items-center gap-2"
                >
                  <WifiOff size={14} />
                  Game Cục Bộ
                </TabsTrigger>
              </TabsList>
              
              <Button onClick={handleCreateNew} variant="outline" size="sm" className="flex items-center gap-1">
                <Plus size={14} />
                Tạo Mới
              </Button>
            </div>
            
            {!isServerAvailable && (
              <div className="flex items-center p-2 mb-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
                <p className="text-sm text-yellow-700">
                  Không thể kết nối đến máy chủ. Chỉ hiển thị game lưu trữ cục bộ.
                </p>
              </div>
            )}
            
            <TabsContent value="server">
              {renderGames(serverGames, true)}
            </TabsContent>
            
            <TabsContent value="local">
              {renderGames(games, false)}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </QuizContainer>
  );
};

export default GameHistoryPage;
