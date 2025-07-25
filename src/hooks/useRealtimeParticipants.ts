import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { GameParticipant } from '@/utils/types';

interface UseRealtimeParticipantsProps {
  gameId: string;
  onParticipantsUpdate?: (participants: GameParticipant[]) => void;
}

export const useRealtimeParticipants = ({ gameId, onParticipantsUpdate }: UseRealtimeParticipantsProps) => {
  const [participants, setParticipants] = useState<GameParticipant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchParticipants = async (sourceTable: 'custom_games' | 'preset_games' = 'custom_games') => {
    console.log('🔄 [useRealtimeParticipants] Fetching participants for gameId:', gameId, 'sourceTable:', sourceTable);
    try {
      const { data, error } = await supabase.rpc('get_unified_leaderboard_with_participants', {
        target_game_id: gameId,
        target_source_table: sourceTable,
        limit_count: 50
      });

      console.log('📊 [useRealtimeParticipants] RPC response:', { data, error });

      if (!error && data) {
        const mappedParticipants: GameParticipant[] = data.map((p: any) => ({
          id: p.id || `${p.player_name}-${Date.now()}`,
          name: p.player_name,
          ipAddress: 'unknown',
          timestamp: p.joined_at,
          gameId: gameId,
          retryCount: 0,
          score: p.score || 0
        }));
        
        console.log('✅ [useRealtimeParticipants] Mapped participants:', mappedParticipants);
        setParticipants(mappedParticipants);
        onParticipantsUpdate?.(mappedParticipants);
      } else {
        console.error('❌ [useRealtimeParticipants] Error fetching participants:', error);
      }
    } catch (error) {
      console.error('💥 [useRealtimeParticipants] Exception in fetchParticipants:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!gameId) {
      console.log('⚠️ [useRealtimeParticipants] No gameId provided, skipping setup');
      return;
    }

    console.log('🚀 [useRealtimeParticipants] Setting up real-time subscription for gameId:', gameId);

    // Initial fetch
    fetchParticipants();

    // Set up real-time subscription
    const channelName = `game_participants_${gameId}`;
    console.log('📡 [useRealtimeParticipants] Creating channel:', channelName);
    
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'custom_leaderboard',
          filter: `game_id=eq.${gameId}`
        },
        (payload) => {
          console.log('🔥 [useRealtimeParticipants] Real-time participant update received:', {
            event: payload.eventType,
            table: payload.table,
            new: payload.new,
            old: payload.old
          });
          // Refetch participants when there's a change
          fetchParticipants();
        }
      )
      .subscribe((status) => {
        console.log('📶 [useRealtimeParticipants] Subscription status:', status);
      });

    return () => {
      console.log('🔌 [useRealtimeParticipants] Cleaning up subscription for gameId:', gameId);
      supabase.removeChannel(channel);
    };
  }, [gameId]);

  return { participants, isLoading, refreshParticipants: fetchParticipants };
};