
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getGameHistory, getRemainingTime, shareGameFromHistory, StoredGame } from '@/utils/gameExport';
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
import { 
  ArrowLeft, 
  History, 
  Share2, 
  Clock, 
  Play, 
  Trash, 
  AlertTriangle 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const GameHistory = () => {
  const [games, setGames] = useState<StoredGame[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadGames();
    
    // Refresh time remaining every minute
    const intervalId = setInterval(() => {
      loadGames();
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, []);

  const loadGames = () => {
    setGames(getGameHistory());
    setLoading(false);
  };

  const handleShare = (id: string) => {
    const shareUrl = shareGameFromHistory(id);
    
    if (shareUrl) {
      // Copy to clipboard
      navigator.clipboard.writeText(shareUrl);
      
      toast({
        title: "Link chia sẻ đã được tạo",
        description: "Đã sao chép vào clipboard. Link có hiệu lực trong 48 giờ.",
      });
      
      // Refresh the list
      loadGames();
    } else {
      toast({
        title: "Lỗi chia sẻ",
        description: "Không thể tạo link chia sẻ cho game này.",
        variant: "destructive"
      });
    }
  };

  const removeFromHistory = (id: string) => {
    const historyJson = localStorage.getItem('game_history');
    if (historyJson) {
      const history: StoredGame[] = JSON.parse(historyJson);
      const updatedHistory = history.filter(game => game.id !== id);
      localStorage.setItem('game_history', JSON.stringify(updatedHistory));
      
      setGames(updatedHistory);
      
      toast({
        title: "Đã xóa",
        description: "Game đã được xóa khỏi lịch sử"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="text-lg">Đang tải lịch sử...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <Link to="/quiz">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Lịch sử Game</h1>
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground">
          <History className="h-4 w-4 mr-1" />
          <span>Lưu trữ trong 10 ngày</span>
        </div>
      </div>
      
      {games.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <AlertTriangle size={48} className="text-muted-foreground" />
          <h2 className="text-xl font-semibold">Chưa có game nào trong lịch sử</h2>
          <p className="text-muted-foreground">Các game bạn tạo sẽ hiển thị tại đây</p>
          <Link to="/quiz">
            <Button>Tạo game mới</Button>
          </Link>
        </div>
      ) : (
        <Table>
          <TableCaption>Lưu trữ trong 10 ngày gần nhất.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Tên Game</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead>Thời gian còn lại</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {games.map((game) => (
              <TableRow key={game.id}>
                <TableCell className="font-medium">{game.title}</TableCell>
                <TableCell>{format(new Date(game.createdAt), 'dd/MM/yyyy HH:mm')}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>{getRemainingTime(game.expiresAt)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {game.isShared ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-500">
                      Đã chia sẻ
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-400">
                      Riêng tư
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="icon" title="Chia sẻ" onClick={() => handleShare(game.id)}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Link to={`/quiz/shared/${game.id}`}>
                      <Button variant="outline" size="icon" title="Chơi">
                        <Play className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      title="Xóa khỏi lịch sử"
                      onClick={() => removeFromHistory(game.id)}
                      className="hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default GameHistory;
