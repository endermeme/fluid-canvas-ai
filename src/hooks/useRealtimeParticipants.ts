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
      let allParticipants: any[] = [];

      if (sourceTable === 'custom_games') {
        const { data, error } = await supabase
          .from('custom_leaderboard')
          .select('*')
          .eq('game_id', gameId)
          .order('joined_at', { ascending: true });

        if (error) {
          console.error('❌ [useRealtimeParticipants] Error fetching custom participants:', error);
        } else {
          allParticipants = data || [];
        }
      } else if (sourceTable === 'preset_games') {
        const { data, error } = await supabase
          .from('preset_leaderboard')
          .select('*')
          .eq('game_id', gameId)
          .order('joined_at', { ascending: true });

        if (error) {
          console.error('❌ [useRealtimeParticipants] Error fetching preset participants:', error);
        } else {
          allParticipants = data || [];
        }
      }

      console.log('📊 [useRealtimeParticipants] Found participants:', allParticipants.length);

      const mappedParticipants: GameParticipant[] = allParticipants.map((p: any) => ({
        id: p.id || `${p.player_name}-${Date.now()}`,
        name: p.player_name,
        ipAddress: p.ip_address || 'unknown',
        timestamp: p.joined_at,
        gameId: gameId,
        retryCount: 0,
        score: p.score || 0
      }));
      
      console.log('✅ [useRealtimeParticipants] Mapped participants:', mappedParticipants);
      setParticipants(mappedParticipants);
      onParticipantsUpdate?.(mappedParticipants);
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

    // Set up real-time subscription for both tables
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
          console.log('🔥 [useRealtimeParticipants] Custom leaderboard update received:', {
            event: payload.eventType,
            table: payload.table,
            new: payload.new,
            old: payload.old
          });
          fetchParticipants('custom_games');
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'preset_leaderboard',
          filter: `game_id=eq.${gameId}`
        },
        (payload) => {
          console.log('🔥 [useRealtimeParticipants] Preset leaderboard update received:', {
            event: payload.eventType,
            table: payload.table,
            new: payload.new,
            old: payload.old
          });
          fetchParticipants('preset_games');
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