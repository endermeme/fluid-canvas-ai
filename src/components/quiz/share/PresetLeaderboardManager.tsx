import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface PresetLeaderboardEntry {
  player_name: string;
  score: number;
  total_questions: number;
  completion_time: number | null;
  completed_at: string;
  scoring_data?: any;
}

interface PresetLeaderboardManagerProps {
  gameId: string;
  gameType?: string;
  refreshInterval?: number;
}

const PresetLeaderboardManager: React.FC<PresetLeaderboardManagerProps> = ({ 
  gameId,
  gameType,
  refreshInterval = 5000 
}) => {
  const [leaderboard, setLeaderboard] = useState<PresetLeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Time-based games (completion time is primary metric)
  const isTimeBasedGame = gameType && ['memory', 'wordsearch', 'matching'].includes(gameType);

  const fetchLeaderboard = async () => {
    try {
      const orderBy = isTimeBasedGame ? 'completion_time' : 'score';
      const ascending = isTimeBasedGame; // Time-based: ascending (faster = better), Score-based: descending (higher = better)
      
      const { data, error } = await supabase
        .from('preset_leaderboard')
        .select('*')
        .eq('game_id', gameId)
        .not('score', 'is', null)
        .order(orderBy, { ascending })
        .limit(10);

      if (error) {
        console.error('Error fetching preset leaderboard:', error);
        return;
      }

      setLeaderboard(data || []);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error in fetchPresetLeaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    
    const interval = setInterval(fetchLeaderboard, refreshInterval);
    
    const channel = supabase
      .channel('preset-leaderboard-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'preset_leaderboard',
          filter: `game_id=eq.${gameId}`
        },
        () => fetchLeaderboard()
      )
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [gameId, refreshInterval, isTimeBasedGame]);

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

  const getGameTypeFromScoringData = (scoringData: any) => {
    if (scoringData?.details) {
      const details = Array.isArray(scoringData.details) ? scoringData.details : [scoringData.details];
      return details[0]?.metricData?.gameType || 'quiz';
    }
    return 'quiz';
  };

  const getAdvancedScoreDisplay = (entry: PresetLeaderboardEntry) => {
    return {
      primary: `${entry.score}/${entry.total_questions}`,
      secondary: null,
      type: 'score'
    };
  };

  const getScorePercentage = (score: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((score / total) * 100);
  };

  const formatCompletionTime = (seconds: number | null) => {
    if (!seconds) return 'N/A';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${remainingSeconds}s`;
  };

  const getScoreDisplay = (entry: PresetLeaderboardEntry) => {
    return `${entry.score}/${entry.total_questions}`;
  };

  const getMainScoreDisplay = (entry: PresetLeaderboardEntry) => {
    if (isTimeBasedGame) {
      return (
        <>
          <p className="font-bold text-lg">{formatCompletionTime(entry.completion_time)}</p>
          <p className="text-xs text-muted-foreground">thời gian</p>
        </>
      );
    } else {
      return (
        <>
          <p className="font-bold text-lg">{entry.score}</p>
          <p className="text-xs text-muted-foreground">điểm</p>
        </>
      );
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Bảng xếp hạng Preset Game
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
            Bảng xếp hạng {gameType ? `(${gameType})` : 'Preset Game'}
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
                      <span>{getScoreDisplay(entry)}</span>
                    </div>
                  </div>
                </div>
                 <div className="text-right">
                   {(() => {
                     const scoreDisplay = getAdvancedScoreDisplay(entry);
                     return (
                       <>
                         <div className="font-bold text-lg">{scoreDisplay.primary}</div>
                         {scoreDisplay.secondary && (
                           <p className="text-xs text-muted-foreground">{scoreDisplay.secondary}</p>
                         )}
                       </>
                     );
                   })()}
                 </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PresetLeaderboardManager;