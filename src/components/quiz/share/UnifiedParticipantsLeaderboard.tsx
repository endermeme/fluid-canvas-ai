import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { Trophy, Users, Clock, Target } from 'lucide-react';

interface ParticipantData {
  player_name: string;
  score: number | null;
  total_questions: number | null;
  completion_time: number | null;
  joined_at: string;
  last_active_at: string;
  is_active: boolean;
  status: 'completed' | 'playing';
}

interface UnifiedParticipantsLeaderboardProps {
  gameId: string;
  sourceTable: 'custom_games' | 'preset_games';
  onParticipantsUpdate?: (count: number) => void;
}

export const UnifiedParticipantsLeaderboard: React.FC<UnifiedParticipantsLeaderboardProps> = ({
  gameId,
  sourceTable,
  onParticipantsUpdate
}) => {
  const [participants, setParticipants] = useState<ParticipantData[]>([]);
  const [stats, setStats] = useState({
    total_participants: 0,
    total_scores: 0,
    average_score: 0,
    best_score: 0,
    completion_rate: 0,
    active_participants: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      // Fetch participants and leaderboard
      const { data: participantsData, error: participantsError } = await supabase.rpc(
        'get_unified_leaderboard_with_participants',
        {
          target_game_id: gameId,
          target_source_table: sourceTable,
          limit_count: 50
        }
      );

      // Fetch stats
      const { data: statsData, error: statsError } = await supabase.rpc(
        'get_unified_game_stats',
        {
          target_game_id: gameId,
          target_source_table: sourceTable
        }
      );

      if (!participantsError && participantsData) {
        const mappedData = participantsData.map((p: any) => ({
          ...p,
          status: (p.status === 'completed' || p.status === 'playing') ? p.status : 'playing'
        })) as ParticipantData[];
        setParticipants(mappedData);
        onParticipantsUpdate?.(mappedData.length);
      }

      if (!statsError && statsData && statsData.length > 0) {
        setStats(statsData[0]);
      }
    } catch (error) {
      console.error('Error fetching unified data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!gameId) return;

    fetchData();

    // Set up real-time subscription
    const leaderboardTable = sourceTable === 'custom_games' ? 'custom_leaderboard' : 'preset_leaderboard';
    const channel = supabase
      .channel(`unified_leaderboard_${gameId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: leaderboardTable,
          filter: `game_id=eq.${gameId}`
        },
        () => {
          console.log('Real-time update received, refreshing data...');
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [gameId, sourceTable]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
        <div className="h-64 bg-muted animate-pulse rounded-lg" />
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{stats.total_participants}</div>
            <div className="text-sm text-muted-foreground">Người tham gia</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="h-6 w-6 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{stats.best_score || 0}</div>
            <div className="text-sm text-muted-foreground">Điểm cao nhất</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-6 w-6 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{Math.round(stats.average_score || 0)}</div>
            <div className="text-sm text-muted-foreground">Điểm trung bình</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{Math.round(stats.completion_rate || 0)}%</div>
            <div className="text-sm text-muted-foreground">Tỉ lệ hoàn thành</div>
          </CardContent>
        </Card>
      </div>

      {/* Participants & Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Bảng xếp hạng & Người tham gia
          </CardTitle>
        </CardHeader>
        <CardContent>
          {participants.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Chưa có người tham gia nào
            </div>
          ) : (
            <div className="space-y-2">
              {participants.map((participant, index) => (
                <div
                  key={`${participant.player_name}-${participant.joined_at}`}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-medium text-muted-foreground min-w-[2rem]">
                      #{index + 1}
                    </div>
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {participant.player_name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{participant.player_name}</div>
                      <div className="text-xs text-muted-foreground">
                        Tham gia: {new Date(participant.joined_at).toLocaleTimeString('vi-VN')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge variant={participant.status === 'completed' ? 'default' : 'secondary'}>
                      {participant.status === 'completed' ? 'Hoàn thành' : 'Đang chơi'}
                    </Badge>
                    
                    {participant.score !== null && (
                      <div className="text-right">
                        <div className="font-bold text-primary">{participant.score} điểm</div>
                        {participant.completion_time && (
                          <div className="text-xs text-muted-foreground">
                            {formatTime(participant.completion_time)}
                          </div>
                        )}
                      </div>
                    )}
                    
                    {participant.is_active && participant.status === 'playing' && (
                      <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};