
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { 
  getGameSession, 
  exportParticipantsToCSV,
  maskIpAddress,
  GameParticipant,
  GameSession
} from '@/utils/gameParticipation';
import { ArrowLeft, Download, Users, RefreshCw, Share2, Eye } from 'lucide-react';

const GameDashboard: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const [game, setGame] = useState<GameSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [maskIps, setMaskIps] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!gameId) {
      navigate('/preset-games');
      return;
    }
    
    loadGameData();
  }, [gameId, navigate]);
  
  const loadGameData = () => {
    const gameSession = getGameSession(gameId || '');
    if (gameSession) {
      setGame(gameSession);
    } else {
      toast({
        title: "Game không tồn tại",
        description: "Game này không tồn tại hoặc đã bị xóa.",
        variant: "destructive",
      });
      navigate('/preset-games');
    }
    setLoading(false);
  };

  const handleExport = () => {
    if (!gameId || !game) return;
    
    const csvContent = exportParticipantsToCSV(gameId);
    
    // Create a CSV file and trigger download
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
  };

  const handleShareLink = () => {
    if (!gameId) return;
    
    const shareUrl = `${window.location.origin}/game/${gameId}`;
    navigator.clipboard.writeText(shareUrl);
    
    toast({
      title: "Đã sao chép liên kết",
      description: "Đường dẫn tham gia game đã được sao chép.",
    });
  };

  const viewGame = () => {
    navigate(`/game/${gameId}`);
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
            onClick={() => navigate('/game-history')} 
            className="flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Quay lại</span>
          </Button>
          <h1 className="text-2xl font-bold">{game.title}</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadGameData}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Làm mới
          </Button>
          
          <Button variant="outline" size="sm" onClick={handleShareLink}>
            <Share2 className="h-4 w-4 mr-1" />
            Chia sẻ
          </Button>
          
          <Button variant="outline" size="sm" onClick={viewGame}>
            <Eye className="h-4 w-4 mr-1" />
            Xem game
          </Button>
        </div>
      </div>
      
      <div className="bg-background p-6 rounded-lg border shadow-sm mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-medium">
              Người tham gia ({game.participants.length})
            </h2>
          </div>
          
          <div className="flex items-center gap-2">
            <Button onClick={() => setMaskIps(!maskIps)} variant="ghost" size="sm">
              {maskIps ? 'Hiện đầy đủ IP' : 'Ẩn IP'}
            </Button>
            
            <Button onClick={handleExport} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Xuất CSV
            </Button>
          </div>
        </div>
        
        {game.participants.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên</TableHead>
                <TableHead>Địa chỉ IP</TableHead>
                <TableHead>Thời gian tham gia</TableHead>
                <TableHead>Số lần thử</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {game.participants.map((participant: GameParticipant) => (
                <TableRow key={participant.id}>
                  <TableCell className="font-medium">{participant.name}</TableCell>
                  <TableCell>
                    {maskIps ? maskIpAddress(participant.ipAddress) : participant.ipAddress}
                  </TableCell>
                  <TableCell>
                    {new Date(participant.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <span className={participant.retryCount > 0 ? "text-amber-500 font-medium" : ""}>
                      {participant.retryCount}
                    </span>
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

export default GameDashboard;
