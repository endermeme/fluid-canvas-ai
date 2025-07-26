import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Medal, Award, RefreshCw, Users, Clock, PlayCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface UnifiedParticipantEntry {
  player_name: string;
  status: 'completed' | 'playing';
  score: number;
  total_questions: number;
  completion_time: number | null;
  scoring_data: any;
  completed_at: string | null;
  joined_at: string;
  game_type: string | null;
  is_active: boolean;
}

interface UnifiedParticipantsLeaderboardProps {
  gameId: string;
  refreshInterval?: number;
  autoSwitchToPlayersTab?: boolean;
}

const UnifiedParticipantsLeaderboard: React.FC<UnifiedParticipantsLeaderboardProps> = ({ 
  gameId, 
  refreshInterval = 5000,
  autoSwitchToPlayersTab = false
}) => {
  console.log('🚀 [UnifiedParticipantsLeaderboard] Component initialized with gameId:', gameId);
  
  const [entries, setEntries] = useState<UnifiedParticipantEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<'players' | 'leaderboard'>('players');

  const fetchData = async () => {
    console.log('🔄 [UnifiedParticipantsLeaderboard] Fetching unified data for gameId:', gameId);
    try {
      const { data, error } = await supabase.rpc('get_unified_participants_leaderboard', {
        target_game_id: gameId,
        limit_count: 50
      });

      console.log('📊 [UnifiedParticipantsLeaderboard] RPC response:', { data, error });

      if (error) {
        console.error('❌ [UnifiedParticipantsLeaderboard] Error fetching data:', error);
        return;
      }

      setEntries((data || []) as UnifiedParticipantEntry[]);
      setLastUpdate(new Date());
      console.log('✅ [UnifiedParticipantsLeaderboard] Data updated:', data?.length || 0, 'entries');
    } catch (error) {
      console.error('💥 [UnifiedParticipantsLeaderboard] Exception in fetchData:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!gameId) {
      console.log('⚠️ [UnifiedParticipantsLeaderboard] No gameId provided, skipping setup');
      return;
    }

    console.log('🚀 [UnifiedParticipantsLeaderboard] Setting up real-time subscription for gameId:', gameId);

    // Initial fetch
    fetchData();

    // Set up real-time subscription for both participants and scores
    const channelName = `unified_game_data_${gameId}`;
    console.log('📡 [UnifiedParticipantsLeaderboard] Creating channel:', channelName);
    
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'game_participants',
          filter: `game_id=eq.${gameId}`
        },
        (payload) => {
          console.log('🔥 [UnifiedParticipantsLeaderboard] Participant update:', payload);
          fetchData();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'unified_game_scores',
          filter: `game_id=eq.${gameId}`
        },
        (payload) => {
          console.log('🔥 [UnifiedParticipantsLeaderboard] Score update:', payload);
          fetchData();
        }
      )
      .subscribe((status) => {
        console.log('📶 [UnifiedParticipantsLeaderboard] Subscription status:', status);
      });

    // Polling interval
    const interval = setInterval(fetchData, refreshInterval);

    return () => {
      console.log('🔌 [UnifiedParticipantsLeaderboard] Cleaning up subscription for gameId:', gameId);
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [gameId, refreshInterval]);

  // Auto-switch to players tab when requested
  useEffect(() => {
    if (autoSwitchToPlayersTab) {
      console.log('🎯 [UnifiedParticipantsLeaderboard] Auto-switching to players tab');
      setActiveTab('players');
    }
  }, [autoSwitchToPlayersTab]);

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

  const formatCompletionTime = (seconds: number | null) => {
    if (!seconds) return 'N/A';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${remainingSeconds}s`;
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreDisplay = (entry: UnifiedParticipantEntry) => {
    if (entry.status === 'playing') {
      return 'Đang chơi...';
    }
    
    // If completion_time exists and score is 0, this is likely a time-based game
    if (entry.completion_time && entry.score === 0) {
      return `Hoàn thành: ${formatCompletionTime(entry.completion_time)}`;
    } else if (entry.total_questions > 0) {
      const percentage = Math.round((entry.score / entry.total_questions) * 100);
      return `${percentage}% (${entry.score}/${entry.total_questions})`;
    } else {
      return `${entry.score} điểm`;
    }
  };

  const getMainScoreDisplay = (entry: UnifiedParticipantEntry) => {
    if (entry.status === 'playing') {
      return (
        <>
          <PlayCircle className="h-5 w-5 text-blue-500" />
          <p className="text-xs text-muted-foreground">đang chơi</p>
        </>
      );
    }

    // If completion_time exists and score is 0, show time as main metric
    if (entry.completion_time && entry.score === 0) {
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

  const playingEntries = entries.filter(e => e.status === 'playing');
  const completedEntries = entries.filter(e => e.status === 'completed');
  const totalParticipants = entries.length;
  const completionRate = totalParticipants > 0 ? Math.round((completedEntries.length / totalParticipants) * 100) : 0;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Người chơi & Bảng xếp hạng
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
            <Users className="h-5 w-5" />
            Người chơi & Bảng xếp hạng
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchData}
              className="h-8 w-8 p-0"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Badge variant="secondary" className="text-xs">
              {totalParticipants} người tham gia
            </Badge>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Cập nhật lần cuối: {lastUpdate.toLocaleTimeString('vi-VN')}
          </p>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-xs">
              {playingEntries.length} đang chơi
            </Badge>
            <Badge variant="outline" className="text-xs">
              {completedEntries.length} hoàn thành
            </Badge>
            <Badge variant="outline" className="text-xs">
              {completionRate}% tỷ lệ hoàn thành
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'players' | 'leaderboard')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="players" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Người chơi ({totalParticipants})
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Bảng xếp hạng ({completedEntries.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="players" className="mt-4">
            {entries.length === 0 ? (
              <div className="text-center p-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Chưa có ai tham gia game</p>
              </div>
            ) : (
              <div className="space-y-3">
                {entries.map((entry, index) => (
                  <div
                    key={`${entry.player_name}-${entry.joined_at}`}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      entry.status === 'completed'
                        ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800'
                        : entry.is_active
                        ? 'bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800'
                        : 'bg-background border-border'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8">
                        <span className="text-sm font-bold text-muted-foreground">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">{entry.player_name}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>Tham gia: {formatDate(entry.joined_at)}</span>
                          {entry.status === 'completed' && entry.completed_at && (
                            <span>Hoàn thành: {formatDate(entry.completed_at)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-2">
                      {getMainScoreDisplay(entry)}
                      <Badge variant={entry.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                        {entry.status === 'completed' ? 'Hoàn thành' : 'Đang chơi'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="leaderboard" className="mt-4">
            {completedEntries.length === 0 ? (
              <div className="text-center p-8">
                <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Chưa có điểm số nào được ghi nhận</p>
              </div>
            ) : (
              <div className="space-y-3">
                {completedEntries.map((entry, index) => (
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
                          <span>
                            {getScoreDisplay(entry)}
                          </span>
                          {entry.completion_time && (
                            <span>⏱️ {formatCompletionTime(entry.completion_time)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {getMainScoreDisplay(entry)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default UnifiedParticipantsLeaderboard;