import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { getAllGameSessions } from '@/lib/gameParticipation';
import { GameSession } from '@/types/types';
import { ArrowLeft, ChevronRight, BookOpen, Clock, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';

const GameHistory: React.FC = () => {
  const [games, setGames] = useState<GameSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    try {
      const gameSessions = await getAllGameSessions();
      // Sort by creation date (newest first)
      const sortedSessions = gameSessions.sort((a, b) => b.createdAt - a.createdAt);
      setGames(sortedSessions);
    } catch (error) {
      console.error("Error loading games:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDashboard = (gameId: string) => {
    navigate(`/game/${gameId}/dashboard`);
  };

  const handleViewGame = (gameId: string) => {
    navigate(`/game/${gameId}`);
  };

  const filteredGames = games.filter(game => 
    game.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="text-lg">Đang tải lịch sử game...</p>
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
            onClick={() => navigate('/preset-games')} 
            className="flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Quay lại</span>
          </Button>
          <h1 className="text-2xl font-bold">Lịch sử game</h1>
        </div>
      </div>
      
      <div className="bg-background p-6 rounded-lg border shadow-sm mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <h2 className="text-lg font-medium flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Các game đã tạo ({games.length})
          </h2>
          
          <div className="w-full md:w-64">
            <Input
              placeholder="Tìm kiếm game..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
        
        {filteredGames.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên game</TableHead>
                <TableHead>Thời gian tạo</TableHead>
                <TableHead>Số người tham gia</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGames.map((game) => (
                <TableRow key={game.id} className="cursor-pointer hover:bg-accent/40">
                  <TableCell className="font-medium">{game.title}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{new Date(game.createdAt).toLocaleString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5 text-primary" />
                      <span>{game.participants.length}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleViewGame(game.id)}
                      >
                        Xem
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleViewDashboard(game.id)}
                      >
                        <ChevronRight className="h-4 w-4" />
                        Dashboard
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            {searchTerm ? "Không tìm thấy game nào phù hợp" : "Chưa có game nào được tạo"}
          </div>
        )}
        
        {games.length === 0 && (
          <div className="flex justify-center mt-4">
            <Button 
              onClick={() => navigate('/preset-games')} 
              className="mt-2"
            >
              Tạo game mới
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameHistory;
