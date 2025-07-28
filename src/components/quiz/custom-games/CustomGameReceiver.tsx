import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Lock, Users, Clock, Trophy } from 'lucide-react';
import { getCustomGame } from '@/utils/customGameExport';
import { getPresetGame } from '@/utils/presetGameExport';
import { addParticipant } from '@/utils/gameParticipation';
import { CustomGameRenderer } from './CustomGameRenderer';
import CustomLeaderboardManager from './CustomLeaderboardManager';
import PresetLeaderboardManager from '../preset-games/PresetLeaderboardManager';
import { useToast } from '@/hooks/use-toast';
import { StoredGame } from '@/utils/types';
import { supabase } from '@/integrations/supabase/client';
import { playerStorageUtils } from '@/utils/playerStorage';

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
      // Try custom game first
      let gameData = await getCustomGame(gameId);
      
      // If not found, try preset game
      if (!gameData) {
        const presetGame = await getPresetGame(gameId);
        if (presetGame) {
          gameData = {
            id: presetGame.id,
            title: presetGame.title,
            gameType: presetGame.gameType,
            content: presetGame.content,
            htmlContent: '',
            description: presetGame.description,
            expiresAt: presetGame.expiresAt,
            createdAt: presetGame.createdAt,
            password: presetGame.password,
            maxParticipants: presetGame.maxParticipants,
            showLeaderboard: presetGame.showLeaderboard,
            requireRegistration: presetGame.requireRegistration,
            customDuration: presetGame.customDuration,
            data: presetGame.data
          };
        }
      }
      
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

  // Auto-join logic for returning players
  useEffect(() => {
    if (game && !hasJoined && !isCreator(game)) {
      console.log('🔍 [DEBUG] Checking auto-join for gameId:', game.id);
      
      // Check if player should bypass form
      const shouldBypass = playerStorageUtils.shouldBypassJoinForm(game.id, game.singleParticipationOnly);
      
      if (shouldBypass) {
        const existingPlayerName = playerStorageUtils.getOrGeneratePlayerName(game.id);
        console.log('🎯 [DEBUG] Auto-joining with existing name:', existingPlayerName);
        
        setPlayerName(existingPlayerName);
        // Auto-join silently
        handleAutoJoin(existingPlayerName);
      }
    }
  }, [game, hasJoined]);

  const handleAutoJoin = async (autoPlayerName: string) => {
    if (!game) return;
    
    console.log('🤖 [DEBUG] Auto-joining game with name:', autoPlayerName);
    
    try {
      const result = await addParticipant(
        game.id,
        autoPlayerName,
        'shared-game',
        accountId || undefined
      );

      if (result.success) {
        setPlayerName(autoPlayerName);
        setHasJoined(true);
        
        // Update localStorage with join info
        playerStorageUtils.markPlayerAsJoined(game.id, autoPlayerName, game.gameType || 'custom');
        
        toast({
          title: "Chào mừng trở lại! 🎉",
          description: `Chào ${autoPlayerName}, bạn đã tự động tham gia lại game!`
        });
      }
    } catch (error) {
      console.error('Auto-join failed:', error);
      // If auto-join fails, user can still join manually
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

    // If no name provided for non-password games, use playerStorage utility
    if (!finalPlayerName) {
      finalPlayerName = playerStorageUtils.getOrGeneratePlayerName(game.id);
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
        
        // Save to localStorage for future auto-join
        playerStorageUtils.markPlayerAsJoined(game.id, finalPlayerName, game.gameType || 'custom');
        
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
    
    const autoName = playerStorageUtils.getOrGeneratePlayerName(game.id);
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

  // Inline utility for remaining time
  const getRemainingTimeInline = (expiresAt: Date | number): string => {
    const now = new Date();
    const expTimestamp = typeof expiresAt === 'number' ? expiresAt : expiresAt.getTime();
    const diff = expTimestamp - now.getTime();
    
    if (diff <= 0) return 'Đã hết hạn';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days} ngày ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  if (!hasJoined) {
    const remainingTime = getRemainingTimeInline(game.expiresAt);
    
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
                <CustomLeaderboardManager 
                  gameId={game.id}
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
              <CustomLeaderboardManager 
                gameId={game.id}
                refreshInterval={5000}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};