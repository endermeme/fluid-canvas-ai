
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getSharedGame, getRemainingTime } from '@/utils/gameExport';
import { addParticipant, getFakeIpAddress, getGameParticipants } from '@/utils/gameParticipation';
import { StoredGame, GameParticipant } from '@/utils/types';
import QuizContainer from '@/components/quiz/QuizContainer';
import GameViewSelector from '@/components/quiz/custom-games/ui/GameViewSelector';
import { GamePasswordForm } from '@/components/game-share/GamePasswordForm';
import { GameNameForm } from '@/components/game-share/GameNameForm';
import ShareSection from '@/components/game-share/ShareSection';
import { UnifiedParticipantsLeaderboard } from '@/components/quiz/share/UnifiedParticipantsLeaderboard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, Users } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAccount } from '@/contexts/AccountContext';
import { supabase } from '@/integrations/supabase/client';

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
    
    console.log('🔄 [GameSharePage] refreshParticipants called for gameId:', gameId);
    try {
      const updatedParticipants = await getGameParticipants(gameId);
      console.log('📊 [GameSharePage] refreshParticipants result:', updatedParticipants.length, 'participants');
      setParticipants(updatedParticipants);
    } catch (error) {
      console.error('❌ [GameSharePage] Error refreshing participants:', error);
      console.log('🔄 [GameSharePage] Falling back to localStorage for participants');
      const sessionsJson = localStorage.getItem('game_sessions');
      if (sessionsJson) {
        const sessions = JSON.parse(sessionsJson);
        const session = sessions.find((s: any) => s.id === gameId);
        if (session && session.participants) {
          console.log('📦 [GameSharePage] Found participants in localStorage:', session.participants.length);
          setParticipants(session.participants);
        } else {
          console.log('📭 [GameSharePage] No participants found in localStorage');
        }
      } else {
        console.log('📭 [GameSharePage] No game_sessions in localStorage');
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
            let gameType = loadedGame.gameType;
            let gameData = loadedGame.data;
            let gameContent = loadedGame.htmlContent || loadedGame.content || '';
            
            console.log('🎮 [GameSharePage] Processing game:', {
              gameType: loadedGame.gameType,
              hasData: !!loadedGame.data,
              hasHtmlContent: !!loadedGame.htmlContent,
              hasContent: !!loadedGame.content
            });
            
            // For preset games, use the data property directly
            if (loadedGame.data && loadedGame.gameType) {
              gameData = loadedGame.data;
              gameType = loadedGame.gameType;
              gameContent = loadedGame.data; // Use data as content for preset games
            } else {
              // For custom games, try to parse HTML content
              try {
                const jsonData = JSON.parse(gameContent);
                if (jsonData.type === "preset-game") {
                  gameData = jsonData.data;
                  gameType = jsonData.gameType;
                }
              } catch {
                // If not JSON, treat as HTML content (custom games)
              }
            }
            
            // Create miniGame object with proper format
            const miniGameData = {
              title: loadedGame.title,
              content: gameContent,
              gameType: gameType,
              data: gameData
            };
            
            console.log('🎮 [GameSharePage] Created miniGameData:', miniGameData);
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

  // Check if user is creator
  const isCreator = (game: StoredGame): boolean => {
    // Check IP address (for anonymous users)
    const currentIp = 'localhost'; // In real app, get from headers
    if (game.creator_ip === currentIp) return true;
    
    // Check account ID (for logged in users)
    if (accountId && game.account_id === accountId) return true;
    
    return false;
  };

  // Auto show join form when game loads (unless user is creator)
  useEffect(() => {
    if (game && !hasRegistered && !gameExpired) {
      if (isCreator(game)) {
        // Creator bypasses all forms and joins directly
        setHasRegistered(true);
        setCurrentPlayerName("Admin/Creator");
        toast({
          title: "Chào mừng quản trị viên! 👑",
          description: "Bạn có quyền quản lý game này.",
        });
      } else {
        handleShowJoinForm();
      }
    }
  }, [game, hasRegistered, gameExpired]);
  
  const handleBack = () => {
    navigate(`/game-history?acc=${accountId}`);
  };
  
  const generatePlayerName = async () => {
    if (!gameId) return 'Player 1';
    
    try {
      // Get current participant count from leaderboard tables
      const { data: customScores } = await supabase
        .from('custom_leaderboard')
        .select('player_name')
        .eq('game_id', gameId);

      const { data: presetScores } = await supabase
        .from('preset_leaderboard')
        .select('player_name')
        .eq('game_id', gameId);

      const allScores = [...(customScores || []), ...(presetScores || [])];
      
      // Count unique players and generate next number
      const uniquePlayers = new Set(allScores.map(s => s.player_name));
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
      console.log('❌ [GameSharePage] Max participants limit reached:', participants.length, '>=', game.maxParticipants);
      toast({
        title: "Giới hạn tham gia",
        description: `Game này chỉ cho phép tối đa ${game.maxParticipants} người chơi.`,
        variant: "destructive"
      });
      return;
    }
    
    console.log('⏳ [GameSharePage] Starting participant addition process');
    setIsSubmitting(true);
    
    try {
      const fakeIp = getFakeIpAddress();
      console.log('📡 [GameSharePage] Calling addParticipant with:', { gameId, finalPlayerName, fakeIp, accountId });
      const result = await addParticipant(gameId, finalPlayerName, fakeIp, accountId);
      
      console.log('📋 [GameSharePage] addParticipant result:', result);
      
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
    if (!game) return;
    
    console.log('🎯 handleShowJoinForm called', {
      hasPassword: !!game?.password,
      password: game?.password,
      showPasswordDialog,
      showNameDialog,
      hasRegistered,
      gameId,
      isCreator: isCreator(game)
    });
    
    // Creator bypasses all forms
    if (isCreator(game)) {
      setHasRegistered(true);
      setCurrentPlayerName("Admin/Creator");
      return;
    }
    
    // Non-creator logic based on password requirement
    if (game.password) {
      console.log('🔒 Showing password dialog (name required)');
      setShowPasswordDialog(true);
    } else {
      console.log('👤 Showing name dialog (can skip)');
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
  
  // Removed join button - auto-show form instead

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
            {(game.showLeaderboard || isCreator(game)) && (
              <TabsTrigger value="leaderboard">
                Bảng xếp hạng
                {isCreator(game) && <span className="ml-1 text-yellow-500">👑</span>}
              </TabsTrigger>
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
            gameExpired={gameExpired}
            gameId={gameId}
            playerName={currentPlayerName}
          />
        </TabsContent>
        
        <TabsContent value="share" className="h-[calc(100%-48px)] m-0 p-4 overflow-auto">
          <ShareSection 
            game={game}
            gameId={gameId!}
          />
        </TabsContent>
        
        <TabsContent value="participants" className="h-[calc(100%-48px)] m-0 p-4 overflow-auto">
          <UnifiedParticipantsLeaderboard
            gameId={gameId!}
            sourceTable="custom_games"
            onParticipantsUpdate={(count) => {
              console.log(`Participants updated: ${count}`);
              setParticipants(prev => prev.slice(0, count));
            }}
          />
        </TabsContent>

        {(game.showLeaderboard || isCreator(game)) && (
          <TabsContent value="leaderboard" className="h-[calc(100%-48px)] m-0 p-4 overflow-auto">
            <div className="max-w-2xl mx-auto">
              {isCreator(game) && (
                <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                    <span className="text-lg">👑</span>
                    <span className="font-medium">Quyền quản trị viên</span>
                  </div>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                    Bạn có thể xem đầy đủ thông tin và quản lý game này.
                  </p>
                </div>
              )}
              <UnifiedParticipantsLeaderboard
                gameId={gameId!}
                sourceTable="custom_games"
                onParticipantsUpdate={(count) => {
                  console.log(`Leaderboard updated: ${count}`);
                }}
              />
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
        gameId={gameId!}
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
