import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface CustomLeaderboardEntry {
  player_name: string;
  score: number;
  total_questions: number;
  completion_time: number | null;
  completed_at: string;
}

interface CustomLeaderboardManagerProps {
  gameId: string;
  refreshInterval?: number;
}

const CustomLeaderboardManager: React.FC<CustomLeaderboardManagerProps> = ({ 
  gameId, 
  refreshInterval = 5000 
}) => {
  const [leaderboard, setLeaderboard] = useState<CustomLeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('custom_leaderboard')
        .select('*')
        .eq('game_id', gameId)
        .not('score', 'is', null)
        .order('score', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching custom leaderboard:', error);
        return;
      }

      setLeaderboard(data || []);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error in fetchCustomLeaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    
    const interval = setInterval(fetchLeaderboard, refreshInterval);
    
    const channel = supabase
      .channel('custom-leaderboard-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'custom_leaderboard',
          filter: `game_id=eq.${gameId}`
        },
        () => fetchLeaderboard()
      )
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [gameId, refreshInterval]);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 1:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 2:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-sm font-bold text-muted-foreground">#{index + 1}</span>;
    }
  };

  const getScorePercentage = (score: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((score / total) * 100);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Bảng xếp hạng Custom Game
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Bảng xếp hạng Custom Game
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchLeaderboard}
              className="h-8 w-8 p-0"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Badge variant="secondary" className="text-xs">
              {leaderboard.length} người chơi
            </Badge>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Cập nhật lần cuối: {lastUpdate.toLocaleTimeString('vi-VN')}
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        {leaderboard.length === 0 ? (
          <div className="text-center p-8">
            <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Chưa có điểm số nào được ghi nhận</p>
          </div>
        ) : (
          <div className="space-y-3">
            {leaderboard.map((entry, index) => (
              <div
                key={`${entry.player_name}-${entry.completed_at}`}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  index === 0 
                    ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-800' 
                    : 'bg-background border-border'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8">
                    {getRankIcon(index)}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{entry.player_name}</p>
                     <div className="flex items-center gap-3 text-xs text-muted-foreground">
                       <span>{getScorePercentage(entry.score, entry.total_questions)}% chính xác</span>
                       <span>{entry.score}/{entry.total_questions} câu</span>
                     </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{entry.score}</p>
                  <p className="text-xs text-muted-foreground">điểm</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CustomLeaderboardManager;