import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Download, Users, BarChart3, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import CustomLeaderboardManager from '../custom-games/CustomLeaderboardManager';
import PresetLeaderboardManager from '../preset-games/PresetLeaderboardManager';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { maskIpAddress } from '@/utils/gameParticipation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const GameDashboard = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [game, setGame] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [maskIps, setMaskIps] = useState(true);

  useEffect(() => {
    loadGameData();
  }, [gameId]);

  const loadGameData = async () => {
    if (!gameId) return;
    setLoading(true);
    
    try {
      // Try to fetch from custom_games first, then preset_games
      let gameInfo = null;
      let participantsData = [];
      
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
          participantsData = customParticipants || [];
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
            participantsData = presetParticipants || [];
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

      setGame(gameInfo);

      // Format participants data
      const formattedParticipants = participantsData.map(p => ({
        id: p.id,
        name: p.player_name,
        ipAddress: p.ip_address || 'N/A',
        score: p.score,
        totalQuestions: p.total_questions,
        completionTime: p.completion_time,
        timestamp: p.completed_at
      }));

      setParticipants(formattedParticipants);
    } catch (error) {
      console.error('Error loading game data:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải dữ liệu game",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    if (!game || participants.length === 0) {
      toast({
        title: "Không có dữ liệu",
        description: "Chưa có người chơi nào để xuất dữ liệu",
        variant: "destructive"
      });
      return;
    }

    try {
      const headers = ['Tên', 'Điểm số', 'Tổng câu hỏi', 'Thời gian hoàn thành (giây)', 'IP Address', 'Thời gian tham gia'];
      const csvContent = [
        headers.join(','),
        ...participants.map(p => [
          `"${p.name}"`,
          p.score || 0,
          p.totalQuestions || 0,
          p.completionTime || 0,
          maskIpAddress(p.ipAddress),
          new Date(p.timestamp).toLocaleString('vi-VN')
        ].join(','))
      ].join('\n');

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
      console.error('Error exporting data:', error);
      toast({
        title: "Lỗi xuất dữ liệu",
        description: "Không thể xuất dữ liệu. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="text-lg">Đang tải thông tin game...</p>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-6 p-4">
        <h1 className="text-2xl font-bold">Game không tồn tại</h1>
        <Button onClick={() => navigate('/preset-games')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
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
          <Button onClick={handleExport} disabled={participants.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Xuất CSV
          </Button>
        </div>
      </div>

      <Tabs defaultValue="leaderboard" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="leaderboard" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Bảng xếp hạng
          </TabsTrigger>
          <TabsTrigger value="participants" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Người tham gia ({participants.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="leaderboard" className="mt-6">
          {game?.game_type ? (
            <PresetLeaderboardManager 
              gameId={gameId!} 
              gameType={game.game_type}
              refreshInterval={10000}
            />
          ) : (
            <CustomLeaderboardManager 
              gameId={gameId!} 
              refreshInterval={10000}
            />
          )}
        </TabsContent>

        <TabsContent value="participants" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Danh sách người tham gia ({participants.length})
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setMaskIps(!maskIps)}
                >
                  {maskIps ? 'Hiện IP' : 'Ẩn IP'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {participants.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tên</TableHead>
                      <TableHead>Điểm số</TableHead>
                      <TableHead>Tổng câu hỏi</TableHead>
                      <TableHead>Thời gian hoàn thành</TableHead>
                      <TableHead>Địa chỉ IP</TableHead>
                      <TableHead>Thời gian tham gia</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {participants.map((participant) => (
                      <TableRow key={participant.id}>
                        <TableCell className="font-medium">
                          {participant.name}
                        </TableCell>
                        <TableCell>
                          {participant.score || 0}
                        </TableCell>
                        <TableCell>
                          {participant.totalQuestions || 0}
                        </TableCell>
                        <TableCell>
                          {participant.completionTime ? `${participant.completionTime}s` : 'N/A'}
                        </TableCell>
                        <TableCell>
                          {maskIps ? maskIpAddress(participant.ipAddress) : participant.ipAddress}
                        </TableCell>
                        <TableCell>
                          {new Date(participant.timestamp).toLocaleString('vi-VN')}
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GameDashboard;
