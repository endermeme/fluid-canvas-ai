
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getSharedGame, getRemainingTime } from '@/utils/gameExport';
import { addParticipant, getFakeIpAddress, getGameParticipants } from '@/utils/gameParticipation';
import { StoredGame, GameParticipant } from '@/utils/types';
import QuizContainer from '@/components/quiz/QuizContainer';
import GameViewSelector from '@/components/quiz/custom-games/ui/GameViewSelector';
import { GamePasswordForm } from '@/components/game-share/GamePasswordForm';
import { GameNameForm } from '@/components/game-share/GameNameForm';
import ParticipantsList from '@/components/game-share/ParticipantsList';
import ShareSection from '@/components/game-share/ShareSection';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, Users } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAccount } from '@/contexts/AccountContext';
import { supabase } from '@/integrations/supabase/client';
import LeaderboardManager from '@/components/quiz/share/LeaderboardManager';
// Removed zod import - no longer needed

// Removed old player form schema - no longer needed

const GameSharePage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const { accountId } = useAccount();
  const [game, setGame] = useState<StoredGame | null>(null);
  const [miniGame, setMiniGame] = useState<any>(null);
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [hasRegistered, setHasRegistered] = useState(false);
  const [participants, setParticipants] = useState<GameParticipant[]>([]);
  const [activeTab, setActiveTab] = useState('game');
  const [gameExpired, setGameExpired] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPlayerName, setCurrentPlayerName] = useState<string | null>(null);
  const { toast } = useToast();
  
  const refreshParticipants = async () => {
    if (!gameId) return;
    
    try {
      const updatedParticipants = await getGameParticipants(gameId);
      setParticipants(updatedParticipants);
    } catch (error) {
      console.error("Error refreshing participants:", error);
      const sessionsJson = localStorage.getItem('game_sessions');
      if (sessionsJson) {
        const sessions = JSON.parse(sessionsJson);
        const session = sessions.find((s: any) => s.id === gameId);
        if (session && session.participants) {
          setParticipants(session.participants);
        }
      }
    }
  };
  
  useEffect(() => {
    const loadGame = async () => {
      if (gameId) {
        try {
          const loadedGame = await getSharedGame(gameId);
          
          if (loadedGame) {
            const completeGame: StoredGame = {
              ...loadedGame,
              description: loadedGame.description || `Shared game: ${loadedGame.title}`
            };
            setGame(completeGame);
            
            // Password protection will be handled by conditional form display
            
            // Parse game content for preset games
            let gameType = null;
            let gameData = null;
            let gameContent = loadedGame.htmlContent || loadedGame.content || '';
            
            try {
              // Try to parse as JSON first (preset games)
              const jsonData = JSON.parse(gameContent);
              if (jsonData.type === "preset-game") {
                gameData = jsonData.data;
                gameType = jsonData.gameType;
              }
            } catch {
              // If not JSON, treat as HTML content (custom games)
            }
            
            // Create miniGame object with proper format
            const miniGameData = {
              title: loadedGame.title,
              content: gameContent,
              gameType: gameType,
              data: gameData
            };
            setMiniGame(miniGameData);
            
            if (loadedGame.expiresAt) {
              const expiryTime = new Date(loadedGame.expiresAt).getTime();
              if (expiryTime < Date.now()) {
                setGameExpired(true);
              }
            }
            
            await refreshParticipants();
            
            const registeredGamesStr = localStorage.getItem('registered_games');
            if (registeredGamesStr) {
              const registeredGames = JSON.parse(registeredGamesStr);
              if (registeredGames.includes(gameId)) {
                setHasRegistered(true);
              }
            }
          } else {
            setGameExpired(true);
          }
        } catch (error) {
          console.error("Không thể tải game:", error);
          setGameExpired(true);
        }
      }
    };
    
    loadGame();
  }, [gameId]);

  useEffect(() => {
    if (!gameId || gameExpired) return;
    
    const interval = setInterval(() => {
      refreshParticipants();
    }, 10000);
    
    return () => clearInterval(interval);
  }, [gameId, gameExpired]);
  
  const handleBack = () => {
    navigate(`/game-history?acc=${accountId}`);
  };
  
  const generatePlayerName = async () => {
    if (!gameId) return 'Player 1';
    
    try {
      // Get current participant count from unified_game_scores
      const { data: scores, error } = await supabase
        .from('unified_game_scores')
        .select('player_name')
        .eq('game_id', gameId)
        .eq('source_table', 'games');

      if (error) {
        console.error('Error getting participant count:', error);
        return 'Player 1';
      }

      // Count unique players and generate next number
      const uniquePlayers = new Set(scores?.map(s => s.player_name) || []);
      const playerCount = uniquePlayers.size;
      return `Player ${playerCount + 1}`;
    } catch (error) {
      console.error('Error generating player name:', error);
      return 'Player 1';
    }
  };
  
  const handleJoinGame = async (playerName: string) => {
    if (!gameId || !game || isSubmitting) return;
    
    let finalPlayerName = playerName.trim();
    
    // If no name provided, generate auto name
    if (!finalPlayerName) {
      finalPlayerName = await generatePlayerName();
    }
    
    // Check max participants limit
    if (game.maxParticipants && participants.length >= game.maxParticipants) {
      toast({
        title: "Giới hạn tham gia",
        description: `Game này chỉ cho phép tối đa ${game.maxParticipants} người chơi.`,
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const fakeIp = getFakeIpAddress();
      const result = await addParticipant(gameId, finalPlayerName, fakeIp, accountId);
      
      if (result.success) {
        if (result.participant) {
          setParticipants(prev => {
            const exists = prev.some(p => p.id === result.participant?.id);
            if (!exists) {
              return [...prev, result.participant];
            }
            return prev;
          });
        }
        
        setShowNameDialog(false);
        setHasRegistered(true);
        
        const registeredGamesStr = localStorage.getItem('registered_games');
        let registeredGames = registeredGamesStr ? JSON.parse(registeredGamesStr) : [];
        if (!registeredGames.includes(gameId)) {
          registeredGames.push(gameId);
          localStorage.setItem('registered_games', JSON.stringify(registeredGames));
        }
        
        toast({
          title: "Tham gia thành công! 🎉",
          description: "Bạn đã được thêm vào danh sách người chơi.",
        });
        
        setTimeout(() => {
          refreshParticipants();
        }, 1000);
        
      } else {
        console.log("Supabase failed, using localStorage fallback");
        
        const newParticipant: GameParticipant = {
          id: crypto.randomUUID(),
          name: finalPlayerName,
          ipAddress: fakeIp,
          timestamp: Date.now(),
          gameId: gameId,
          retryCount: 0,
          score: 0
        };
        
        const sessionsJson = localStorage.getItem('game_sessions');
        const sessions = sessionsJson ? JSON.parse(sessionsJson) : [];
        
        let sessionIndex = sessions.findIndex((s: any) => s.id === gameId);
        if (sessionIndex >= 0) {
          if (!sessions[sessionIndex].participants) {
            sessions[sessionIndex].participants = [];
          }
          sessions[sessionIndex].participants.push(newParticipant);
        } else {
          sessions.push({
            id: gameId,
            participants: [newParticipant]
          });
        }
        
        localStorage.setItem('game_sessions', JSON.stringify(sessions));
        setParticipants(prev => [...prev, newParticipant]);
        
        setShowNameDialog(false);
        setHasRegistered(true);
        setCurrentPlayerName(finalPlayerName);
        
        const registeredGamesStr = localStorage.getItem('registered_games');
        let registeredGames = registeredGamesStr ? JSON.parse(registeredGamesStr) : [];
        if (!registeredGames.includes(gameId)) {
          registeredGames.push(gameId);
          localStorage.setItem('registered_games', JSON.stringify(registeredGames));
        }
        
        toast({
          title: "Tham gia thành công! 🎉",
          description: "Bạn đã được thêm vào danh sách người chơi (dữ liệu lưu cục bộ).",
        });
      }
    } catch (error) {
      console.error("Lỗi khi tham gia game:", error);
      toast({
        title: "Lỗi hệ thống",
        description: "Đã xảy ra lỗi khi xử lý yêu cầu. Vui lòng thử lại.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (password: string, playerName: string) => {
    if (!gameId || !game || isSubmitting) return;
    
    // First verify password
    if (game.password && game.password !== password) {
      toast({
        title: "Mật khẩu không đúng",
        description: "Vui lòng nhập đúng mật khẩu để tham gia game.",
        variant: "destructive"
      });
      return;
    }
    
    setShowPasswordDialog(false);
    
    // Then join the game
    await handleJoinGame(playerName);
  };

  const handleSkip = async () => {
    const autoName = await generatePlayerName();
    await handleJoinGame(autoName);
  };

  const handlePasswordSkip = async (password: string) => {
    // Verify password first
    if (!game?.password || password !== game.password) {
      toast({
        title: "Sai mật khẩu",
        description: "Mật khẩu không đúng",
        variant: "destructive"
      });
      return;
    }
    
    const autoName = await generatePlayerName();
    setShowPasswordDialog(false);
    await handleJoinGame(autoName);
  };

  const handleShowJoinForm = () => {
    if (game?.password) {
      setShowPasswordDialog(true);
    } else {
      setShowNameDialog(true);
    }
  };
  
  if (!game && !gameExpired) {
    return (
      <QuizContainer
        title="Đang tải game..."
        showBackButton={true}
        onBack={handleBack}
        className="p-0 overflow-hidden"
      >
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
            <p className="text-primary font-medium">Đang tải thông tin game...</p>
          </div>
        </div>
      </QuizContainer>
    );
  }
  
  if (gameExpired) {
    return (
      <QuizContainer
        title="Game không khả dụng"
        showBackButton={true}
        onBack={handleBack}
        className="p-0 overflow-hidden"
      >
        <div className="flex flex-col items-center justify-center h-full p-6 bg-gradient-to-b from-background to-background/80">
          <div className="p-8 bg-background/90 rounded-xl shadow-lg border border-primary/10 max-w-md w-full">
            <h2 className="text-xl font-bold text-center mb-4">Game đã hết hạn hoặc không tồn tại</h2>
            <p className="text-center mb-6 text-muted-foreground">Game này đã hết thời hạn hoặc không còn khả dụng.</p>
            <Button onClick={handleBack} className="w-full">Quay lại</Button>
          </div>
        </div>
      </QuizContainer>
    );
  }

  const isMaxParticipantsReached = game && game.maxParticipants && participants.length >= game.maxParticipants;
  
  const joinGameButton = (
    <Button 
      size="sm" 
      variant="outline" 
      className="text-xs"
      onClick={handleShowJoinForm}
      disabled={isSubmitting || isMaxParticipantsReached}
    >
      <Users className="h-3.5 w-3.5 mr-1" />
      {isMaxParticipantsReached ? "Đã đầy" : (hasRegistered ? "Cập nhật thông tin" : "Tham gia")}
    </Button>
  );

  // Use parsed miniGame or fallback to default structure
  const gameForView = miniGame || {
    title: game.title,
    content: game.htmlContent || '',
    gameType: game.gameType,
    data: game.content
  };
  
  return (
    <QuizContainer
      title={game.title}
      showBackButton={true}
      onBack={handleBack}
      className="p-0 overflow-hidden"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full">
        <div className="border-b px-4 py-2 flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="game">Game</TabsTrigger>
            <TabsTrigger value="share">Chia sẻ</TabsTrigger>
            <TabsTrigger value="participants">
              Người chơi ({participants.length})
              {participants.length > 0 && (
                <span className="ml-1 text-green-500">●</span>
              )}
            </TabsTrigger>
            {game.showLeaderboard && (
              <TabsTrigger value="leaderboard">Bảng xếp hạng</TabsTrigger>
            )}
          </TabsList>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            <span>Còn lại: {game && getRemainingTime(game.expiresAt)}</span>
          </div>
        </div>
        
        <TabsContent value="game" className="h-[calc(100%-48px)] m-0">
          <GameViewSelector 
            miniGame={gameForView}
            onBack={handleBack}
            hideHeader={true}
            extraButton={!hasRegistered ? joinGameButton : undefined}
            gameExpired={gameExpired}
            gameId={gameId}
            playerName={currentPlayerName}
          />
        </TabsContent>
        
        <TabsContent value="share" className="h-[calc(100%-48px)] m-0 p-4 overflow-auto">
          <ShareSection 
            game={game}
            gameId={gameId!}
            hasRegistered={hasRegistered}
            isSubmitting={isSubmitting}
            onJoinGame={handleShowJoinForm}
          />
        </TabsContent>
        
        <TabsContent value="participants" className="h-[calc(100%-48px)] m-0 p-4 overflow-auto">
          <div className="max-w-md mx-auto space-y-6">
              <ParticipantsList
                participants={participants}
                hasRegistered={hasRegistered}
                isSubmitting={isSubmitting}
                onRefresh={refreshParticipants}
                onJoinGame={handleShowJoinForm}
                maxParticipants={game.maxParticipants}
              />
          </div>
        </TabsContent>

        {game.showLeaderboard && (
          <TabsContent value="leaderboard" className="h-[calc(100%-48px)] m-0 p-4 overflow-auto">
            <div className="max-w-2xl mx-auto">
              <LeaderboardManager gameId={gameId!} />
            </div>
          </TabsContent>
        )}
      </Tabs>
      
      {/* Game Name Form for games without password */}
      <GameNameForm
        isOpen={showNameDialog}
        onSubmit={handleJoinGame}
        onSkip={handleSkip}
        onCancel={() => setShowNameDialog(false)}
        isSubmitting={isSubmitting}
        gameTitle={game?.title}
      />
      
      {/* Password Form for protected games */}
      <GamePasswordForm
        isOpen={showPasswordDialog}
        onSubmit={handlePasswordSubmit}
        onSkip={handlePasswordSkip}
        onCancel={() => setShowPasswordDialog(false)}
        isVerifying={isSubmitting}
        gameTitle={game?.title}
      />
    </QuizContainer>
  );
};

export default GameSharePage;
