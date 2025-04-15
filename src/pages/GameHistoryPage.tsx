import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRemainingTime } from '@/utils/gameExport';
import { StoredGame } from '@/utils/types';
import QuizContainer from '@/components/quiz/QuizContainer';
import { Button } from '@/components/ui/button';
import { Plus, Clock, ExternalLink, Search, Trash2, Share2, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const GameHistoryPage: React.FC = () => {
  const [games, setGames] = useState<StoredGame[]>([]);
  const [filteredGames, setFilteredGames] = useState<StoredGame[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'expiring'>('newest');
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
      const parsedGames: StoredGame[] = JSON.parse(gamesJson);
      const now = Date.now();
      const validGames = parsedGames.filter(game => game.expiresAt > now);
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
      result = result.filter(game => 
        game.title.toLowerCase().includes(term) || 
        game.description.toLowerCase().includes(term)
      );
    }
    
    // Sort games
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => b.createdAt - a.createdAt);
        break;
      case 'oldest':
        result.sort((a, b) => a.createdAt - b.createdAt);
        break;
      case 'expiring':
        result.sort((a, b) => a.expiresAt - b.expiresAt);
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
  
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
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
            <Select value={sortBy} onValueChange={(value: 'newest' | 'oldest' | 'expiring') => setSortBy(value)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sắp xếp theo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Mới nhất</SelectItem>
                <SelectItem value="oldest">Cũ nhất</SelectItem>
                <SelectItem value="expiring">Sắp hết hạn</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleCreateNew} className="flex items-center gap-2">
              <Plus size={16} />
              Tạo Game Mới
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {filteredGames.length} game {searchTerm ? 'phù hợp với tìm kiếm' : 'đã tạo'}
            </p>
          </div>
        </div>
        
        {filteredGames.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[50vh] p-8 border rounded-lg bg-muted/20">
            <p className="text-center mb-4 text-muted-foreground">
              {searchTerm 
                ? 'Không tìm thấy game nào phù hợp với tìm kiếm' 
                : 'Chưa có game nào được tạo'}
            </p>
            <Button onClick={handleCreateNew} className="flex items-center gap-2">
              <Plus size={16} />
              Tạo Game Mới
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredGames.map(game => (
              <Card 
                key={game.id}
                className="group hover:shadow-md transition-all cursor-pointer"
                onClick={() => handleGameClick(game.id)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg line-clamp-1">{game.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{game.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center text-xs text-muted-foreground mb-2">
                    <Clock size={14} className="mr-1" />
                    <span>Còn lại: {getRemainingTime(game.expiresAt)}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Tạo ngày: {formatDate(game.createdAt)}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-2 border-t">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGameClick(game.id);
                    }}
                  >
                    <ExternalLink size={12} className="mr-1" />
                    Mở
                  </Button>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 text-xs"
                      onClick={(e) => handleShareGame(game.id, e)}
                    >
                      <Share2 size={12} className="mr-1" />
                      Chia sẻ
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 text-xs text-destructive hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteGameId(game.id);
                          }}
                        >
                          <Trash2 size={12} className="mr-1" />
                          Xóa
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Xác nhận xóa game</AlertDialogTitle>
                          <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa game "{game.title}"? Hành động này không thể hoàn tác.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Hủy</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={(e) => {
                              e.stopPropagation();
                              if (deleteGameId) {
                                handleDeleteGame(deleteGameId);
                                setDeleteGameId(null);
                              }
                            }}
                          >
                            Xóa
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
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
