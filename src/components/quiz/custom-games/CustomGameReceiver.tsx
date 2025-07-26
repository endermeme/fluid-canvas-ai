import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Lock, Users, Clock, Trophy } from 'lucide-react';
import { getSharedGame, getRemainingTime } from '@/utils/gameExport';
import { addParticipant } from '@/utils/gameParticipation';
import { CustomGameRenderer } from './CustomGameRenderer';
import UnifiedLeaderboardManager from '../share/UnifiedLeaderboardManager';
import { useToast } from '@/hooks/use-toast';
import { StoredGame } from '@/utils/types';
import { supabase } from '@/integrations/supabase/client';

export const CustomGameReceiver: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const [searchParams] = useSearchParams();
  const [game, setGame] = useState<StoredGame | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState('');
  const [password, setPassword] = useState('');
  const [hasJoined, setHasJoined] = useState(false);
  const [participantCount, setParticipantCount] = useState(0);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const { toast } = useToast();

  // Get account ID from URL params
  const accountId = searchParams.get('acc');

  // Check if user is creator
  const isCreator = (game: StoredGame): boolean => {
    // Check IP address (for anonymous users)
    const currentIp = 'localhost'; // In real app, get from headers
    if (game.creator_ip === currentIp) return true;
    
    // Check account ID (for logged in users)
    if (accountId && game.account_id === accountId) return true;
    
    return false;
  };

  useEffect(() => {
    if (gameId) {
      loadGame();
    }
  }, [gameId]);

  // Auto-join if creator
  useEffect(() => {
    if (game && !hasJoined) {
      if (isCreator(game)) {
        setPlayerName("Admin/Creator");
        setHasJoined(true);
        toast({
          title: "Chào mừng quản trị viên! 👑",
          description: "Bạn có quyền quản lý game này.",
        });
      }
    }
  }, [game, hasJoined]);

  const loadGame = async () => {
    if (!gameId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const gameData = await getSharedGame(gameId);
      
      if (!gameData) {
        setError('Game không tồn tại hoặc đã hết hạn');
        return;
      }
      
      setGame(gameData);
      
      // Check if this is a custom game from the games table
      if (gameData.gameType && gameData.htmlContent) {
        // This is a custom HTML game
        console.log('Loaded custom game:', gameData.title);
      }
      
    } catch (err) {
      console.error('Error loading game:', err);
      setError('Có lỗi xảy ra khi tải game');
    } finally {
      setLoading(false);
    }
  };

  const generatePlayerName = async () => {
    try {
      // Get current participant count from custom_leaderboard
      const { data: scores, error } = await supabase
        .from('custom_leaderboard')
        .select('player_name')
        .eq('game_id', game!.id);

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

  const handleJoinGame = async () => {
    if (!game) return;

    let finalPlayerName = playerName.trim();
    
    // For password-protected games, name is required
    if (game.password && !finalPlayerName) {
      toast({
        title: "Tên bắt buộc",
        description: "Vui lòng nhập tên để tham gia game có mật khẩu",
        variant: "destructive"
      });
      return;
    }

    // If no name provided for non-password games, generate auto name
    if (!finalPlayerName) {
      finalPlayerName = await generatePlayerName();
    }

    // Check password if required
    if (game.password && password !== game.password) {
      toast({
        title: "Sai mật khẩu",
        description: "Mật khẩu không đúng",
        variant: "destructive"
      });
      return;
    }

    try {
      const result = await addParticipant(
        game.id,
        finalPlayerName,
        'shared-game',
        accountId || undefined
      );

      if (result.success) {
        setPlayerName(finalPlayerName); // Update state with final name
        setHasJoined(true);
        toast({
          title: "Tham gia thành công! 🎉",
          description: `Chào mừng ${finalPlayerName} đến với game!`
        });
      } else {
        toast({
          title: "Không thể tham gia",
          description: result.message || "Có lỗi xảy ra",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error joining game:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tham gia game",
        variant: "destructive"
      });
    }
  };

  const handleSkip = async () => {
    if (!game) return;
    
    const autoName = await generatePlayerName();
    setPlayerName(autoName);
    handleJoinGame();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Đang tải game...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert className="max-w-md">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert className="max-w-md">
          <AlertDescription>Game không tồn tại</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!hasJoined) {
    const remainingTime = getRemainingTime(game.expiresAt);
    
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold mb-2">{game.title}</h1>
              {game.description && (
                <p className="text-muted-foreground mb-4">{game.description}</p>
              )}
              
              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{remainingTime}</span>
                </div>
                {game.maxParticipants && (
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{participantCount}/{game.maxParticipants}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="playerName">
                  Tên của bạn {game.password && <span className="text-red-500">*</span>}
                </Label>
                <Input
                  id="playerName"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder={game.password ? "Tên bắt buộc cho game có mật khẩu" : "Nhập tên để tham gia"}
                  className="mt-1"
                  required={!!game.password}
                />
              </div>

              {game.password && (
                <div>
                  <Label htmlFor="password" className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Mật khẩu <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu game"
                    className="mt-1"
                    required
                  />
                </div>
              )}

              <div className="flex gap-2">
                <Button 
                  onClick={handleJoinGame}
                  className="flex-1"
                  disabled={game.password && !playerName.trim()}
                >
                  {game.password 
                    ? 'Tham gia Game' 
                    : (playerName.trim() ? 'Tham gia Game' : 'Tham gia với tên tự động')
                  }
                </Button>
                
                {!game.password && (
                  <Button
                    variant="outline"
                    onClick={handleSkip}
                    className="flex-shrink-0"
                  >
                    Bỏ qua
                  </Button>
                )}
                
                {game.showLeaderboard && (
                  <Button
                    variant="outline"
                    onClick={() => setShowLeaderboard(!showLeaderboard)}
                    className="flex-shrink-0"
                  >
                    <Trophy className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            {showLeaderboard && (
              <div className="mt-6">
                <UnifiedLeaderboardManager 
                  gameId={game.id}
                  sourceTable="custom_games"
                  refreshInterval={10000}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Game joined - render the actual game
  return (
    <div className="min-h-screen">
      <div className="p-4 bg-background border-b">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">{game.title}</h1>
            <p className="text-sm text-muted-foreground">Chơi bởi: {playerName}</p>
          </div>
          
          {game.showLeaderboard && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLeaderboard(!showLeaderboard)}
            >
              <Trophy className="w-4 h-4 mr-2" />
              Bảng xếp hạng
            </Button>
          )}
        </div>
      </div>

      <div className="flex">
        <div className={`${showLeaderboard ? 'w-3/4' : 'w-full'} transition-all duration-300`}>
          <CustomGameRenderer
            htmlContent={game.htmlContent}
            gameType={game.gameType}
            gameId={game.id}
            playerName={playerName}
            onGameComplete={(score, totalQuestions, completionTime) => {
              console.log('Custom game completed:', {
                score,
                totalQuestions,
                completionTime,
                gameId: game.id,
                gameType: game.gameType
              });
            }}
          />
        </div>
        
        {showLeaderboard && (
          <div className="w-1/4 border-l bg-muted/50">
            <div className="p-4">
              <UnifiedLeaderboardManager 
                gameId={game.id}
                sourceTable="custom_games"
                refreshInterval={5000}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};