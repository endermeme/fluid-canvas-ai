
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Users, RefreshCw } from 'lucide-react';
import { getGameSession, exportParticipantsToCSV, maskIpAddress } from '@/utils/gameParticipation';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const TeacherDashboard = () => {
  const { gameId } = useParams();
  const [game, setGame] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadGameData();
  }, [gameId]);

  const loadGameData = async () => {
    if (!gameId) return;
    setLoading(true);
    try {
      // Try to fetch from custom_games first, then preset_games
      let gameInfo = null;
      let participants = [];
      
      // Try custom_games first
      const { data: customGame, error: customGameError } = await supabase
        .from('custom_games')
        .select('*')
        .eq('id', gameId)
        .single();

      if (!customGameError && customGame) {
        gameInfo = customGame;
        
        // Fetch participants from custom_leaderboard
        const { data: customParticipants, error: customParticipantsError } = await supabase
          .from('custom_leaderboard')
          .select('*')
          .eq('game_id', gameId)
          .order('completed_at', { ascending: false });

        if (!customParticipantsError) {
          participants = customParticipants || [];
        }
      } else {
        // Try preset_games
        const { data: presetGame, error: presetGameError } = await supabase
          .from('preset_games')
          .select('*')
          .eq('id', gameId)
          .single();

        if (!presetGameError && presetGame) {
          gameInfo = presetGame;
          
          // Fetch participants from preset_leaderboard
          const { data: presetParticipants, error: presetParticipantsError } = await supabase
            .from('preset_leaderboard')
            .select('*')
            .eq('game_id', gameId)
            .order('completed_at', { ascending: false });

          if (!presetParticipantsError) {
            participants = presetParticipants || [];
          }
        }
      }

      if (!gameInfo) {
        toast({
          title: "Lỗi",
          description: "Không thể tải thông tin game",
          variant: "destructive"
        });
        return;
      }

      // Format participants data to match expected structure
      const formattedParticipants = participants.map(p => ({
        id: p.id,
        name: p.player_name,
        ipAddress: p.ip_address || 'N/A',
        score: p.score,
        retryCount: 1, // Default as this isn't tracked
        timestamp: p.completed_at
      }));

      const gameSession = {
        id: gameInfo.id,
        title: gameInfo.title,
        gameType: gameInfo.game_type,
        htmlContent: gameInfo.html_content,
        description: gameInfo.description,
        expiresAt: new Date(gameInfo.expires_at),
        createdAt: new Date(gameInfo.created_at).getTime(),
        participants: formattedParticipants
      };

      setGame(gameSession);
    } catch (error) {
      console.error('Error loading game:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải thông tin game",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    if (!gameId || !game) return;
    
    try {
      const csvContent = await exportParticipantsToCSV(gameId);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${game.title}_participants.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Xuất dữ liệu thành công",
        description: "Dữ liệu người tham gia đã được tải xuống.",
      });
    } catch (error) {
      toast({
        title: "Lỗi xuất dữ liệu",
        description: "Không thể xuất dữ liệu. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <h1 className="text-2xl font-bold">Game không tồn tại</h1>
        <Button onClick={() => navigate('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại trang chủ
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <h1 className="text-2xl font-bold">{game.title}</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadGameData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Làm mới
          </Button>
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Xuất CSV
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-medium">
            Danh sách người tham gia ({game.participants?.length || 0})
          </h2>
        </div>

        {game.participants && game.participants.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên</TableHead>
                <TableHead>Điểm số</TableHead>
                <TableHead>Thời gian tham gia</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {game.participants.map((participant: any) => (
                <TableRow key={participant.id}>
                  <TableCell className="font-medium">
                    {participant.name}
                  </TableCell>
                  <TableCell>
                    {participant.score || 0}
                  </TableCell>
                  <TableCell>
                    {new Date(participant.joined_at || participant.timestamp).toLocaleString('vi-VN')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Chưa có người tham gia nào
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
