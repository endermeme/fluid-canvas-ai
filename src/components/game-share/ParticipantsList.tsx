
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, BarChart3 } from 'lucide-react';
import { GameParticipant } from '@/types/shared';
import { useRealtimeParticipants } from '@/hooks/useRealtimeParticipants';

interface ParticipantsListProps {
  gameId: string;
  hasRegistered: boolean;
  isSubmitting: boolean;
  onRefresh: () => void;
  onJoinGame: () => void;
  maxParticipants?: number;
  onParticipantsUpdate?: (participants: GameParticipant[]) => void;
}

const ParticipantsList: React.FC<ParticipantsListProps> = ({
  gameId,
  hasRegistered,
  isSubmitting,
  onRefresh,
  onJoinGame,
  maxParticipants,
  onParticipantsUpdate
}) => {
  console.log('🎮 [ParticipantsList] Component render with props:', { 
    gameId, 
    hasRegistered, 
    isSubmitting, 
    maxParticipants 
  });

  // Use real-time participants hook
  const { participants, isLoading, refreshParticipants } = useRealtimeParticipants({
    gameId,
    onParticipantsUpdate: (newParticipants) => {
      console.log('🔄 [ParticipantsList] Participants updated via real-time:', newParticipants.length, 'participants');
      onParticipantsUpdate?.(newParticipants);
    }
  });

  console.log('📊 [ParticipantsList] Current state:', { 
    participantsCount: participants.length, 
    isLoading, 
    participants: participants.map(p => ({ id: p.id, name: p.name }))
  });

  // Handle manual refresh
  const handleRefresh = () => {
    console.log('🔄 [ParticipantsList] Manual refresh triggered');
    refreshParticipants();
    onRefresh();
  };
  const formatDate = (timestamp: number | Date) => {
    const date = typeof timestamp === 'number' ? new Date(timestamp) : timestamp;
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Danh sách người chơi
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleRefresh}
            className="text-xs"
            disabled={isLoading}
          >
            {isLoading ? "⏳" : "🔄"} Làm mới
          </Button>
        </CardTitle>
        <CardDescription>
          {participants.length > 0 
            ? `${participants.length}${maxParticipants ? `/${maxParticipants}` : ''} người đã tham gia game này` 
            : 'Chưa có ai tham gia game này'}
          {maxParticipants && participants.length >= maxParticipants && (
            <span className="block text-red-500 text-sm mt-1">Đã đạt giới hạn tham gia</span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-6 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-2 opacity-50 animate-pulse" />
            <p>Đang tải danh sách người chơi...</p>
          </div>
        ) : participants.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Chưa có ai tham gia game này</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={onJoinGame}
              disabled={isSubmitting || (maxParticipants && participants.length >= maxParticipants)}
            >
              {isSubmitting ? "Đang xử lý..." : (maxParticipants && participants.length >= maxParticipants ? "Đã đầy" : "Tham gia ngay")}
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {participants.map((participant, index) => (
              <div 
                key={participant.id}
                className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium mr-3">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{participant.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Tham gia: {formatDate(typeof participant.timestamp === 'string' ? new Date(participant.timestamp) : participant.timestamp)}
                    </p>
                  </div>
                </div>
                {participant.retryCount > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {participant.retryCount} lần thử lại
                  </Badge>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <div className="flex gap-2">
          <Button 
            className="flex-1" 
            onClick={onJoinGame}
            disabled={isSubmitting || (maxParticipants && participants.length >= maxParticipants)}
          >
            <Users className="h-4 w-4 mr-2" />
            {isSubmitting ? "Đang xử lý..." : 
             (maxParticipants && participants.length >= maxParticipants) ? "Đã đạt giới hạn" :
             "Tham gia game"}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.open(`/game/${gameId}/dashboard`, '_blank')}
          >
            <BarChart3 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ParticipantsList;
