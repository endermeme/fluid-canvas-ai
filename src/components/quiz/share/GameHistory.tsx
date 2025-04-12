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
import { getAllGames, getStorageStats, SharedGame } from '@/services/storage';
import { 
  ArrowLeft, 
  ChevronRight, 
  BookOpen, 
  Clock, 
  Users, 
  Search, 
  BarChart3, 
  Trash2, 
  SortDesc, 
  SortAsc,
  Eye,
  Server
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const GameHistory: React.FC = () => {
  const [games, setGames] = useState<SharedGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'views'>('newest');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [stats, setStats] = useState<any | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadGames();
    loadStats();
  }, [sortBy, sortOrder]);

  const loadGames = () => {
    setLoading(true);
    const allGames = getAllGames();
    
    // Sắp xếp games theo các tiêu chí khác nhau
    let sortedGames = [...allGames];
    if (sortBy === 'newest') {
      sortedGames.sort((a, b) => sortOrder === 'desc' ? b.createdAt - a.createdAt : a.createdAt - b.createdAt);
    } else if (sortBy === 'popular') {
      sortedGames.sort((a, b) => {
        const aScore = a.analytics?.popularityScore || 0;
        const bScore = b.analytics?.popularityScore || 0;
        return sortOrder === 'desc' ? bScore - aScore : aScore - bScore;
      });
    } else if (sortBy === 'views') {
      sortedGames.sort((a, b) => {
        const aViews = a.viewCount || 0;
        const bViews = b.viewCount || 0;
        return sortOrder === 'desc' ? bViews - aViews : aViews - bViews;
      });
    }
    
    setGames(sortedGames);
    setLoading(false);
  };
  
  const loadStats = () => {
    const storageStats = getStorageStats();
    setStats(storageStats);
  };

  const handleViewDashboard = (gameId: string) => {
    navigate(`/game/${gameId}/dashboard`);
  };

  const handleViewGame = (gameId: string) => {
    navigate(`/game/${gameId}`);
  };
  
  const handleToggleSortOrder = () => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
  };

  const filteredGames = games.filter(game => 
    game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (game.description && game.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (game.tags && game.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
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
      
      {/* Dashboard thống kê */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Tổng số game</CardTitle>
              <CardDescription>Số game đã tạo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalGames}</div>
              <div className="mt-2 text-sm text-muted-foreground">
                {games.filter(game => game.isPublic).length} game công khai
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Tổng người tham gia</CardTitle>
              <CardDescription>Tổng người tham gia tất cả game</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalParticipants}</div>
              <div className="mt-2 text-sm text-muted-foreground">
                Trung bình {stats.totalGames ? (stats.totalParticipants / stats.totalGames).toFixed(1) : '0'} người/game
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Thông tin server</CardTitle>
              <CardDescription>Tình trạng máy chủ lưu trữ</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="flex-shrink-0 h-3 w-3 rounded-full bg-green-500"></div>
                <span className="text-sm">Server VPS đang hoạt động</span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <Server className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm">ai-games-vn.com</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      <div className="bg-background p-6 rounded-lg border shadow-sm mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-medium">
              Các game đã tạo ({games.length})
            </h2>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm game..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-full"
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <BarChart3 className="h-4 w-4" />
                  <span>
                    {sortBy === 'newest' && 'Mới nhất'}
                    {sortBy === 'popular' && 'Phổ biến nhất'}
                    {sortBy === 'views' && 'Xem nhiều nhất'}
                  </span>
                  {sortOrder === 'desc' ? <SortDesc className="h-3.5 w-3.5" /> : <SortAsc className="h-3.5 w-3.5" />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortBy('newest')}>
                  <Clock className="mr-2 h-4 w-4" />
                  <span>Mới nhất</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('popular')}>
                  <Users className="mr-2 h-4 w-4" />
                  <span>Phổ biến nhất</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('views')}>
                  <Eye className="mr-2 h-4 w-4" />
                  <span>Xem nhiều nhất</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleToggleSortOrder}>
                  {sortOrder === 'desc' ? <SortDesc className="mr-2 h-4 w-4" /> : <SortAsc className="mr-2 h-4 w-4" />}
                  <span>{sortOrder === 'desc' ? 'Giảm dần' : 'Tăng dần'}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {filteredGames.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên game</TableHead>
                <TableHead>Thời gian tạo</TableHead>
                <TableHead>Người tham gia</TableHead>
                <TableHead>Lượt xem</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGames.map((game) => (
                <TableRow key={game.id} className="cursor-pointer hover:bg-accent/40">
                  <TableCell onClick={() => handleViewGame(game.id)}>
                    <div className="font-medium truncate max-w-[200px]">
                      {game.title}
                      {game.isPublic && <Badge variant="secondary" className="ml-2 text-xs">Công khai</Badge>}
                    </div>
                    {game.tags && game.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {game.tags.slice(0, 3).map((tag, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {game.tags.length > 3 && <span className="text-xs text-muted-foreground">+{game.tags.length - 3}</span>}
                      </div>
                    )}
                  </TableCell>
                  <TableCell onClick={() => handleViewGame(game.id)}>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{new Date(game.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(game.createdAt).toLocaleTimeString()}
                    </div>
                  </TableCell>
                  <TableCell onClick={() => handleViewGame(game.id)}>
                    <div className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5 text-primary" />
                      <span>{game.participants.length}</span>
                    </div>
                    <Progress 
                      value={Math.min(100, (game.participants.length / 10) * 100)} 
                      className="h-1 mt-1" 
                    />
                  </TableCell>
                  <TableCell onClick={() => handleViewGame(game.id)}>
                    <div className="flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{game.viewCount || 0}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={() => handleViewGame(game.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Xem game</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleViewDashboard(game.id)}
                            >
                              <BarChart3 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Xem dashboard</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
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
