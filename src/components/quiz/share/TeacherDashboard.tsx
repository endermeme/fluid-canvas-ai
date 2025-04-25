
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSharedGame } from '@/utils/gameExport';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, Calendar, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getGameParticipants } from '../custom-games/utils/customGameAPI';

interface Participant {
  id: string;
  name: string;
  timestamp: string;
  ip_address?: string;
  retry_count?: number;
}

const TeacherDashboard: React.FC = () => {
  const { id, gameId } = useParams<{ id?: string; gameId?: string }>();
  const [game, setGame] = useState<any>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  const loadData = async () => {
    const gameIdentifier = gameId || id;
    if (!gameIdentifier) {
      setLoading(false);
      return;
    }

    try {
      // Tải thông tin game
      const loadedGame = await getSharedGame(gameIdentifier);
      setGame(loadedGame);

      if (loadedGame) {
        // Tải danh sách người tham gia
        const loadedParticipants = await getGameParticipants(loadedGame.id);
        setParticipants(loadedParticipants);
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
    }

    setLoading(false);
    setRefreshing(false);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  useEffect(() => {
    loadData();
  }, [id, gameId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <h1 className="text-2xl font-bold">Game không tồn tại</h1>
        <p className="text-muted-foreground">Không tìm thấy thông tin game</p>
        <Button onClick={() => navigate('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại trang chủ
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate(`/game/${game.id}`)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại game
          </Button>
          <h1 className="text-2xl font-bold hidden sm:block">{game.title}</h1>
        </div>
        
        <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
          <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Làm mới
        </Button>
      </div>
      
      <h1 className="text-2xl font-bold mb-4 sm:hidden">{game.title}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Người chơi ({participants.length})
            </CardTitle>
            <CardDescription>
              Danh sách người tham gia game
            </CardDescription>
          </CardHeader>
          <CardContent>
            {participants.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Chưa có người tham gia
              </div>
            ) : (
              <div className="space-y-4">
                {participants.map((participant, index) => (
                  <div key={participant.id} className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                    <div>
                      <p className="font-medium">{participant.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center">
                        <Calendar className="mr-1 h-3 w-3" />
                        {formatDate(participant.timestamp)}
                      </p>
                    </div>
                    <div className="flex items-center justify-center w-8 h-8 bg-primary/10 text-primary rounded-full">
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Thông tin game</CardTitle>
            <CardDescription>
              Chi tiết và cài đặt cho game này
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Tiêu đề</p>
                <p>{game.title}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Mô tả</p>
                <p>{game.description || "Không có mô tả"}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Loại game</p>
                <p>{game.gameType || "Game tùy chỉnh"}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Ngày tạo</p>
                <p>{formatDate(new Date(game.createdAt).toISOString())}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Hết hạn</p>
                <p>{formatDate(new Date(game.expiresAt).toISOString())}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">ID Game</p>
                <p className="text-xs font-mono bg-muted p-2 rounded">{game.id}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button variant="outline" onClick={() => navigate(`/`)}>
              Tạo game mới
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default TeacherDashboard;
