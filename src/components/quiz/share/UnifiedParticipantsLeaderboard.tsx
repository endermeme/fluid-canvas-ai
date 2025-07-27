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
      console.log('🔄 [UnifiedParticipantsLeaderboard] Fetching data for gameId:', gameId, 'sourceTable:', sourceTable);
      
      // Determine which table to query
      const tableName = sourceTable === 'custom_games' ? 'custom_leaderboard' : 'preset_leaderboard';
      
      // Fetch participants using direct database query (same as working getGameParticipants)
      const { data: participantsData, error: participantsError } = await supabase
        .from(tableName)
        .select('*')
        .eq('game_id', gameId)
        .order('joined_at', { ascending: false });

      if (participantsError) {
        console.error('❌ [UnifiedParticipantsLeaderboard] Error fetching participants:', participantsError);
        return;
      }

      console.log('📊 [UnifiedParticipantsLeaderboard] Raw participants data:', participantsData);

      if (participantsData) {
        // Map participants data to expected format
        const mappedData = participantsData.map((p: any) => ({
          player_name: p.player_name,
          score: p.score,
          total_questions: p.total_questions,
          completion_time: p.completion_time,
          joined_at: p.joined_at,
          last_active_at: p.last_active_at,
          is_active: p.is_active,
          status: p.score !== null ? 'completed' : 'playing'
        })) as ParticipantData[];

        console.log('✅ [UnifiedParticipantsLeaderboard] Mapped participants:', mappedData);
        setParticipants(mappedData);
        onParticipantsUpdate?.(mappedData.length);

        // Calculate stats from the participants data
        const completedParticipants = mappedData.filter(p => p.score !== null);
        const scores = completedParticipants.map(p => p.score!);
        
        const calculatedStats = {
          total_participants: mappedData.length,
          total_scores: completedParticipants.length,
          average_score: scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0,
          best_score: scores.length > 0 ? Math.max(...scores) : 0,
          completion_rate: mappedData.length > 0 ? (completedParticipants.length / mappedData.length) * 100 : 0,
          active_participants: mappedData.filter(p => p.is_active && p.status === 'playing').length
        };

        console.log('📈 [UnifiedParticipantsLeaderboard] Calculated stats:', calculatedStats);
        setStats(calculatedStats);
      }
    } catch (error) {
      console.error('💥 [UnifiedParticipantsLeaderboard] Error fetching data:', error);
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