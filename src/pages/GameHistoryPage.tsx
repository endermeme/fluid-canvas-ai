import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRemainingTime } from '@/lib/gameExport';
import QuizContainer from '@/components/shared/QuizContainer';
import { Button } from '@/components/ui/button';
import { Plus, Clock, ExternalLink, Search, Trash2, Share2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface StoredGame {
  id: string;
  title: string;
  description: string;
  createdAt: number | Date;
  expiresAt: number | Date;
  category?: string;
}

const GameHistoryPage: React.FC = () => {
  const [games, setGames] = useState<StoredGame[]>([]);
  const [filteredGames, setFilteredGames] = useState<StoredGame[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [deleteGameId, setDeleteGameId] = useState<string | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    loadGames();
  }, []);
  
  useEffect(() => {
    filterAndSortGames();
  }, [games, searchTerm, sortBy]);
  
  const loadGames = () => {
    const gamesJson = localStorage.getItem('shared_games');
    if (gamesJson) {
      const parsedGames = JSON.parse(gamesJson);
      const now = Date.now();
      const validGames = parsedGames.filter((game: StoredGame) => {
        const expiryTime = typeof game.expiresAt === 'number' ? game.expiresAt : game.expiresAt.getTime();
        return expiryTime > now;
      });
      setGames(validGames);
    } else {
      setGames([]);
    }
  };
  
  const filterAndSortGames = () => {
    let result = [...games];
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter((game: StoredGame) => 
        game.title.toLowerCase().includes(term) || 
        game.description.toLowerCase().includes(term)
      );
    }
    
    // Sort games
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => {
          const timeA = typeof a.createdAt === 'number' ? a.createdAt : a.createdAt.getTime();
          const timeB = typeof b.createdAt === 'number' ? b.createdAt : b.createdAt.getTime();
          return timeB - timeA;
        });
        break;
      case 'oldest':
        result.sort((a, b) => {
          const timeA = typeof a.createdAt === 'number' ? a.createdAt : a.createdAt.getTime();
          const timeB = typeof b.createdAt === 'number' ? b.createdAt : b.createdAt.getTime();
          return timeA - timeB;
        });
        break;
      case 'expiring':
        result.sort((a, b) => {
          const timeA = typeof a.expiresAt === 'number' ? a.expiresAt : a.expiresAt.getTime();
          const timeB = typeof b.expiresAt === 'number' ? b.expiresAt : b.expiresAt.getTime();
          return timeA - timeB;
        });
        break;
    }
    
    setFilteredGames(result);
  };
  
  const handleGameClick = (gameId: string) => {
    navigate(`/game/${gameId}`);
  };
  
  const handleCreateNew = () => {
    navigate('/custom-game');
  };
  
  const handleShareGame = (gameId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/game/${gameId}`;
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        alert('Đã sao chép liên kết vào clipboard!');
      })
      .catch(err => {
        console.error('Không thể sao chép liên kết:', err);
      });
  };
  
  const handleDeleteGame = (gameId: string) => {
    const gamesJson = localStorage.getItem('shared_games');
    if (gamesJson) {
      const parsedGames: StoredGame[] = JSON.parse(gamesJson);
      const updatedGames = parsedGames.filter(game => game.id !== gameId);
      localStorage.setItem('shared_games', JSON.stringify(updatedGames));
      setGames(updatedGames);
    }
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
    <QuizContainer
      title="Lịch Sử Game"
      showBackButton={true}
      onBack={() => navigate('/')}
    >
      <div className="p-4 h-full overflow-auto">
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm game..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sắp xếp theo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Mới nhất</SelectItem>
                <SelectItem value="oldest">Cũ nhất</SelectItem>
                <SelectItem value="expiring">Sắp hết hạn</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={handleCreateNew}
            className="w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tạo game mới
          </Button>
        </div>
        
        {filteredGames.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎮</div>
            <h3 className="text-lg font-semibold mb-2">
              {games.length === 0 ? 'Chưa có game nào' : 'Không tìm thấy game phù hợp'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {games.length === 0 
                ? 'Hãy tạo game đầu tiên của bạn!' 
                : 'Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc.'}
            </p>
            {games.length === 0 && (
              <Button onClick={handleCreateNew}>
                <Plus className="w-4 h-4 mr-2" />
                Tạo game đầu tiên
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredGames.map((game) => (
              <Card 
                key={game.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleGameClick(game.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg line-clamp-2 pr-2">
                      {game.title}
                    </CardTitle>
                    <div className="flex gap-1 ml-2 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => handleShareGame(game.id, e)}
                        title="Chia sẻ"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteGameId(game.id);
                            }}
                            title="Xóa"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                            <AlertDialogDescription>
                              Bạn có chắc chắn muốn xóa game "{game.title}"? Hành động này không thể hoàn tác.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteGame(game.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Xóa
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="line-clamp-3">
                    {game.description}
                  </CardDescription>
                </CardContent>
                <CardFooter className="pt-0 flex-col items-start space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground w-full">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>Tạo: {formatDate(game.createdAt)}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground w-full">
                    <span className="text-orange-600">
                      Còn: {getRemainingTime(game.expiresAt)}
                    </span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGameClick(game.id);
                    }}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Chơi game
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </QuizContainer>
  );
};

export default GameHistoryPage;
