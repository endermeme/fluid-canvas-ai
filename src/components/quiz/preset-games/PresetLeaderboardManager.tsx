import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Medal, Award, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface PresetLeaderboardEntry {
  player_name: string;
  score: number;
  total_questions: number;
  completion_time: number | null;
  scoring_data: any;
  completed_at: string;
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
  const [activeParticipants, setActiveParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchLeaderboard = async () => {
    try {
      // Get completed games from preset_leaderboard  
      const { data: completedGames, error: completedError } = await supabase
        .from('preset_leaderboard')
        .select('player_name, score, total_questions, completion_time, scoring_data, completed_at')
        .eq('game_id', gameId)
        .not('score', 'is', null)
        .order('score', { ascending: false })
        .limit(10);
        
      if (!completedError && completedGames) {
        setLeaderboard(completedGames);
      }

      // Get active participants (no score yet)
      const { data: activeGames, error: activeError } = await supabase
        .from('preset_leaderboard')
        .select('player_name, joined_at, is_active')
        .eq('game_id', gameId)
        .is('score', null)
        .eq('is_active', true)
        .order('joined_at', { ascending: true });
        
      if (!activeError && activeGames) {
        setActiveParticipants(activeGames);
      }
      
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error in fetchLeaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();

    // Set up polling
    const interval = setInterval(fetchLeaderboard, refreshInterval);

    return () => clearInterval(interval);
  }, [gameId, refreshInterval]);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 1:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 2:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold">{index + 1}</span>;
    }
  };

  const getScorePercentage = (score: number, totalQuestions: number): string => {
    if (totalQuestions === 0) return "0%";
    return `${Math.round((score / totalQuestions) * 100)}%`;
  };

  const formatCompletionTime = (timeInSeconds: number | null): string => {
    if (!timeInSeconds) return "N/A";
    
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    
    if (minutes > 0) {
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${seconds}s`;
  };

  const getScoreDisplay = (entry: PresetLeaderboardEntry) => {
    const isTimeBasedGame = ['memory', 'wordsearch', 'matching'].includes(gameType?.toLowerCase() || '');
    
    if (isTimeBasedGame && entry.completion_time) {
      return {
        primary: formatCompletionTime(entry.completion_time),
        secondary: entry.scoring_data?.moves ? `${entry.scoring_data.moves} moves` : null,
        type: 'time'
      };
    } else {
      return {
        primary: `${entry.score}/${entry.total_questions}`,
        secondary: getScorePercentage(entry.score, entry.total_questions),
        type: 'score'
      };
    }
  };

  const getMainScoreDisplay = (entry: PresetLeaderboardEntry) => {
    const scoreInfo = getScoreDisplay(entry);
    
    return (
      <div className="text-right">
        <div className="font-bold text-lg">
          {scoreInfo.primary}
        </div>
        {scoreInfo.secondary && (
          <div className="text-sm text-muted-foreground">
            {scoreInfo.secondary}
          </div>
        )}
        {entry.scoring_data?.hints && (
          <div className="text-xs text-muted-foreground">
            {entry.scoring_data.hints} hints used
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Bảng xếp hạng
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-4">
            <RefreshCw className="w-6 h-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Bảng xếp hạng
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchLeaderboard}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Completed Games Section */}
        {leaderboard.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Đã hoàn thành</h3>
            <div className="space-y-3">
              {leaderboard.map((entry, index) => (
                <div
                  key={`${entry.player_name}-${entry.completed_at}`}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8">
                      {getRankIcon(index)}
                    </div>
                    
                    <div>
                      <div className="font-medium">{entry.player_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(entry.completed_at).toLocaleTimeString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {getMainScoreDisplay(entry)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Active Participants Section */}
        {activeParticipants.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Đang chơi</h3>
            <div className="space-y-2">
              {activeParticipants.map((participant, index) => (
                <div
                  key={`${participant.player_name}-${participant.joined_at}`}
                  className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30"
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <div>
                    <div className="font-medium">{participant.player_name}</div>
                    <div className="text-sm text-muted-foreground">
                      Tham gia lúc {new Date(participant.joined_at).toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {leaderboard.length === 0 && activeParticipants.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Chưa có người chơi nào tham gia
          </div>
        )}
        
        <div className="text-xs text-muted-foreground text-center mt-4">
          Cập nhật lần cuối: {lastUpdate.toLocaleTimeString('vi-VN')}
        </div>
      </CardContent>
    </Card>
  );
};

export default PresetLeaderboardManager;