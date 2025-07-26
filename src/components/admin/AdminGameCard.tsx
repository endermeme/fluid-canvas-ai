import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  Users, 
  Eye, 
  Share2, 
  Lock, 
  UserPlus,
  Crown,
  Download,
  BarChart3,
  Calendar
} from 'lucide-react';
import { StoredGame } from '@/utils/types';
import { getRemainingTime } from '@/utils/gameExport';
import { supabase } from '@/integrations/supabase/client';

interface AdminGameCardProps {
  game: StoredGame & {
    totalPlays?: number;
    uniquePlayers?: number;
    shareCount?: number;
    lastAccessedAt?: string;
  };
  onGameClick: (gameId: string) => void;
  onShareGame: (gameId: string, e: React.MouseEvent) => void;
  onViewLeaderboard: (gameId: string, e: React.MouseEvent) => void;
  onExportData: (gameId: string, e: React.MouseEvent) => void;
}

const AdminGameCard: React.FC<AdminGameCardProps> = ({
  game,
  onGameClick,
  onShareGame,
  onViewLeaderboard,
  onExportData
}) => {
  const [gameStats, setGameStats] = useState({
    totalPlays: 0,
    uniquePlayers: 0,
    shareCount: 0
  });

  useEffect(() => {
    loadGameStats();
  }, [game.id]);

  const loadGameStats = async () => {
    try {
      // Get total plays and unique players from unified_game_scores
      const { data: scoreData, error: scoreError } = await supabase
        .from('unified_game_scores')
        .select('player_name')
        .eq('game_id', game.id)
        .eq('source_table', 'games');

      if (scoreError) {
        console.error('Error fetching score data:', scoreError);
        return;
      }

      const totalPlays = scoreData?.length || 0;
      const uniquePlayers = new Set(scoreData?.map(s => s.player_name) || []).size;

      // Get share count from games table
      const { data: gameData, error: gameError } = await supabase
        .from('games')
        .select('share_count')
        .eq('id', game.id)
        .single();

      if (gameError) {
        console.error('Error fetching game data:', gameError);
      }

      setGameStats({
        totalPlays,
        uniquePlayers,
        shareCount: gameData?.share_count || 0
      });
    } catch (error) {
      console.error('Error loading game stats:', error);
    }
  };

  const formatDate = (timestamp: number | Date | string) => {
    let date: Date;
    if (typeof timestamp === 'number') {
      date = new Date(timestamp);
    } else if (typeof timestamp === 'string') {
      date = new Date(timestamp);
    } else {
      date = timestamp;
    }
    
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getExpiryStatus = () => {
    const now = Date.now();
    const expiryTime = typeof game.expiresAt === 'number' 
      ? game.expiresAt 
      : new Date(game.expiresAt).getTime();
    
    const hoursLeft = (expiryTime - now) / (1000 * 60 * 60);
    
    if (hoursLeft < 0) return { status: 'expired', variant: 'destructive' as const };
    if (hoursLeft < 24) return { status: 'expiring', variant: 'destructive' as const };
    if (hoursLeft < 72) return { status: 'warning', variant: 'secondary' as const };
    return { status: 'active', variant: 'default' as const };
  };

  const expiryStatus = getExpiryStatus();

  return (
    <Card 
      className="group hover:shadow-lg transition-all cursor-pointer relative"
      onClick={() => onGameClick(game.id)}
    >
      {/* Admin Crown Badge */}
      <div className="absolute -top-2 -right-2 z-10">
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-300">
          <Crown size={12} className="mr-1" />
          Admin
        </Badge>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg line-clamp-2 pr-12">{game.title}</CardTitle>
        </div>
        
        {game.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{game.description}</p>
        )}
        
        {/* Security & Settings Indicators */}
        <div className="flex gap-2 flex-wrap">
          {game.password && (
            <Badge variant="outline" className="text-xs">
              <Lock size={10} className="mr-1" />
              Có mật khẩu
            </Badge>
          )}
          {game.requireRegistration && (
            <Badge variant="outline" className="text-xs">
              <UserPlus size={10} className="mr-1" />
              Bắt buộc đăng ký
            </Badge>
          )}
          {game.maxParticipants && (
            <Badge variant="outline" className="text-xs">
              <Users size={10} className="mr-1" />
              Tối đa {game.maxParticipants}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-2 bg-muted/50 rounded">
            <div className="text-lg font-semibold text-primary">{gameStats.totalPlays}</div>
            <div className="text-xs text-muted-foreground">Lượt chơi</div>
          </div>
          <div className="text-center p-2 bg-muted/50 rounded">
            <div className="text-lg font-semibold text-primary">{gameStats.uniquePlayers}</div>
            <div className="text-xs text-muted-foreground">Người chơi</div>
          </div>
          <div className="text-center p-2 bg-muted/50 rounded">
            <div className="text-lg font-semibold text-primary">{gameStats.shareCount}</div>
            <div className="text-xs text-muted-foreground">Chia sẻ</div>
          </div>
        </div>

        {/* Game Info */}
        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex items-center justify-between">
            <span className="flex items-center">
              <Calendar size={12} className="mr-1" />
              Tạo ngày:
            </span>
            <span>{formatDate(game.createdAt)}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="flex items-center">
              <Clock size={12} className="mr-1" />
              Còn lại:
            </span>
            <Badge variant={expiryStatus.variant} className="text-xs">
              {getRemainingTime(game.expiresAt)}
            </Badge>
          </div>

          {game.lastAccessedAt && (
            <div className="flex items-center justify-between">
              <span className="flex items-center">
                <Eye size={12} className="mr-1" />
                Truy cập:
              </span>
              <span>{formatDate(game.lastAccessedAt)}</span>
            </div>
          )}
        </div>

        {/* Admin Actions */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 text-xs"
            onClick={(e) => onViewLeaderboard(game.id, e)}
          >
            <BarChart3 size={12} className="mr-1" />
            Bảng xếp hạng
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 text-xs"
            onClick={(e) => onShareGame(game.id, e)}
          >
            <Share2 size={12} className="mr-1" />
            Chia sẻ
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 text-xs col-span-2"
            onClick={(e) => onExportData(game.id, e)}
          >
            <Download size={12} className="mr-1" />
            Xuất dữ liệu
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminGameCard;