import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getSharedGame, getRemainingTime } from '@/utils/gameExport';
import { addParticipant, getFakeIpAddress, getGameParticipants } from '@/utils/gameParticipation';
import { submitGameScore } from '@/utils/scoreSubmission';
import { StoredGame, GameParticipant } from '@/utils/types';
import QuizContainer from '@/components/quiz/QuizContainer';
import EnhancedGameView from '@/components/quiz/custom-games/EnhancedGameView';
import GameShareForm from '@/components/game-share/GameShareForm';
import ParticipantsList from '@/components/game-share/ParticipantsList';
import ShareSection from '@/components/game-share/ShareSection';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, Users } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

const playerFormSchema = z.object({
  playerName: z.string().min(2, {
    message: "Tên phải có ít nhất 2 ký tự",
  }),
  playerAge: z.string().refine((val) => {
    const age = parseInt(val, 10);
    return !isNaN(age) && age >= 6 && age <= 100;
  }, {
    message: "Tuổi phải từ 6 đến 100",
  })
});

type PlayerFormValues = z.infer<typeof playerFormSchema>;

const GameSharePage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const [game, setGame] = useState<StoredGame | null>(null);
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [hasRegistered, setHasRegistered] = useState(false);
  const [participants, setParticipants] = useState<GameParticipant[]>([]);
  const [activeTab, setActiveTab] = useState('game');
  const [gameExpired, setGameExpired] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPlayerName, setCurrentPlayerName] = useState<string>('');
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
                
                // Get player name from localStorage
                const playerDataStr = localStorage.getItem(`player_${gameId}`);
                if (playerDataStr) {
                  const playerData = JSON.parse(playerDataStr);
                  setCurrentPlayerName(playerData.name || 'Người chơi');
                }
              } else {
                setShowNameDialog(true);
              }
            } else {
              setShowNameDialog(true);
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
    navigate('/game-history');
  };
  
  // Handler for submitting quiz score - only called once per game completion
  const handleQuizScoreSubmit = async (score: number, totalQuestions: number) => {
    if (!gameId || !hasRegistered || !currentPlayerName) return;
    
    try {
      console.log(`Submitting quiz score: ${score}/${totalQuestions} for game ${gameId} by ${currentPlayerName}`);
      
      await submitGameScore({
        gameId: gameId,
        playerName: currentPlayerName,
        score: score,
        totalQuestions: totalQuestions,
        ipAddress: getFakeIpAddress(),
        gameType: 'quiz'
      });
      
      toast({
        title: "Điểm số đã được ghi nhận! 🎉",
        description: `Bạn đạt ${score}/${totalQuestions} điểm và đã được lưu vào bảng xếp hạng.`,
        variant: "default",
      });
    } catch (error) {
      console.error("Error submitting quiz score:", error);
      toast({
        title: "Điểm số đã được ghi nhận cục bộ",
        description: `Bạn đạt ${score}/${totalQuestions} điểm (lưu trữ cục bộ).`,
        variant: "default",
      });
    }
  };
  
  const handleJoinGame = async (values: PlayerFormValues) => {
    if (!gameId || !game || isSubmitting) return;
    
    setIsSubmitting(true);
    const playerDisplayName = `${values.playerName} (${values.playerAge} tuổi)`;
    
    try {
      const fakeIp = getFakeIpAddress();
      const result = await addParticipant(gameId, playerDisplayName, fakeIp);
      
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
        
        setCurrentPlayerName(playerDisplayName);
        localStorage.setItem(`player_${gameId}`, JSON.stringify({
          name: playerDisplayName,
          age: values.playerAge
        }));
        
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
          name: `${values.playerName} (${values.playerAge} tuổi)`,
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
        
        setCurrentPlayerName(playerDisplayName);
        localStorage.setItem(`player_${gameId}`, JSON.stringify({
          name: playerDisplayName,
          age: values.playerAge
        }));
        
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

  const joinGameButton = (
    <Button 
      size="sm" 
      variant="outline" 
      className="text-xs"
      onClick={() => setShowNameDialog(true)}
      disabled={isSubmitting}
    >
      <Users className="h-3.5 w-3.5 mr-1" />
      {hasRegistered ? "Cập nhật thông tin" : "Tham gia"}
    </Button>
  );
  
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
          </TabsList>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            <span>Còn lại: {game && getRemainingTime(game.expiresAt)}</span>
          </div>
        </div>
        
        <TabsContent value="game" className="h-[calc(100%-48px)] m-0">
          <EnhancedGameView 
            miniGame={{
              title: game.title,
              content: game.htmlContent
            }}
            onBack={handleBack}
            hideHeader={true}
            extraButton={!hasRegistered ? joinGameButton : undefined}
            gameExpired={gameExpired}
            isSharedMode={true}
            onQuizScoreSubmit={hasRegistered ? handleQuizScoreSubmit : undefined}
          />
        </TabsContent>
        
        <TabsContent value="share" className="h-[calc(100%-48px)] m-0 p-4 overflow-auto">
          <ShareSection 
            game={game}
            gameId={gameId!}
            hasRegistered={hasRegistered}
            isSubmitting={isSubmitting}
            onJoinGame={() => setShowNameDialog(true)}
          />
        </TabsContent>
        
        <TabsContent value="participants" className="h-[calc(100%-48px)] m-0 p-4 overflow-auto">
          <div className="max-w-md mx-auto space-y-6">
            <ParticipantsList 
              participants={participants}
              hasRegistered={hasRegistered}
              isSubmitting={isSubmitting}
              onRefresh={refreshParticipants}
              onJoinGame={() => setShowNameDialog(true)}
            />
          </div>
        </TabsContent>
      </Tabs>
      
      <GameShareForm 
        showDialog={showNameDialog}
        setShowDialog={setShowNameDialog}
        gameTitle={game.title}
        hasRegistered={hasRegistered}
        isSubmitting={isSubmitting}
        onSubmit={handleJoinGame}
      />
    </QuizContainer>
  );
};

export default GameSharePage;
