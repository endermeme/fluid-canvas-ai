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

  const fetchParticipants = async () => {
    try {
      const { data, error } = await supabase.rpc('get_game_participants_realtime', {
        target_game_id: gameId
      });

      if (!error && data) {
        const mappedParticipants: GameParticipant[] = data.map((p: any) => ({
          id: p.id,
          name: p.player_name,
          ipAddress: p.ip_address || 'unknown',
          timestamp: p.joined_at,
          gameId: gameId,
          retryCount: 0,
          score: 0
        }));
        
        setParticipants(mappedParticipants);
        onParticipantsUpdate?.(mappedParticipants);
      }
    } catch (error) {
      console.error('Error fetching participants:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!gameId) return;

    // Initial fetch
    fetchParticipants();

    // Set up real-time subscription
    const channel = supabase
      .channel(`game_participants_${gameId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'game_participants',
          filter: `game_id=eq.${gameId}`
        },
        (payload) => {
          console.log('Real-time participant update:', payload);
          // Refetch participants when there's a change
          fetchParticipants();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [gameId]);

  return { participants, isLoading, refreshParticipants: fetchParticipants };
};