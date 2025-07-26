
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRemainingTime } from '@/utils/gameExport';
import { StoredGame } from '@/utils/types';
import QuizContainer from '@/components/quiz/QuizContainer';
import { useAccount } from '@/contexts/AccountContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Plus, Search, Filter, BarChart3, Download, Users } from 'lucide-react';
import AdminGameCard from '@/components/admin/AdminGameCard';
import { exportParticipantsToCSV } from '@/utils/gameParticipation';
import { useToast } from '@/hooks/use-toast';
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
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'expiring' | 'popular'>('newest');
  const [filterBy, setFilterBy] = useState<'all' | 'password' | 'public' | 'active'>('all');
  const navigate = useNavigate();
  const { accountId } = useAccount();
  const { toast } = useToast();
  
  useEffect(() => {
    loadGames();
  }, [accountId]);
  
  useEffect(() => {
    filterAndSortGames();
  }, [games, searchTerm, sortBy, filterBy]);
  
  const loadGames = async () => {
    if (!accountId) return;

    try {
      // Load from Supabase first - get ALL game fields for admin view
      const { data: dbGames, error } = await supabase
        .from('games')
        .select(`
          *,
          share_count,
          last_accessed_at,
          max_participants,
          show_leaderboard,
          require_registration,
          custom_duration,
          password,
          creator_ip,
          account_id
        `)
        .eq('account_id', accountId)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching account games:", error);
      }

      // Map Supabase games to enhanced StoredGame format
      const supabaseGames: StoredGame[] = dbGames?.map(game => ({
        id: game.id,
        title: game.title,
        gameType: game.game_type,
        description: game.description || '',
        htmlContent: game.html_content,
        createdAt: new Date(game.created_at).getTime(),
        expiresAt: new Date(game.expires_at).getTime(),
        shareUrl: `/game/${game.id}?acc=${accountId}`,
        // Admin-specific fields
        password: game.password,
        maxParticipants: game.max_participants,
        showLeaderboard: game.show_leaderboard,
        requireRegistration: game.require_registration,
        customDuration: game.custom_duration,
        creator_ip: game.creator_ip,
        account_id: game.account_id,
        shareCount: game.share_count || 0,
        lastAccessedAt: game.last_accessed_at
      })) || [];

      // Load from localStorage and filter by account
      const gamesJson = localStorage.getItem('shared_games');
      let localGames: StoredGame[] = [];
      
      if (gamesJson) {
        const parsedGames: StoredGame[] = JSON.parse(gamesJson);
        const now = Date.now();
        localGames = parsedGames.filter(game => {
          const expiryTime = typeof game.expiresAt === 'number' 
            ? game.expiresAt 
            : game.expiresAt.getTime();
          return expiryTime > now && 
                 (game as any).accountId === accountId; // Filter by account
        });
      }

      // Combine and deduplicate
      const allGames = [...supabaseGames];
      localGames.forEach(localGame => {
        if (!allGames.some(g => g.id === localGame.id)) {
          allGames.push(localGame);
        }
      });

      setGames(allGames);
    } catch (error) {
      console.error("Error loading games:", error);
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
        (game.description && game.description.toLowerCase().includes(term))
      );
    }

    // Filter by category
    switch (filterBy) {
      case 'password':
        result = result.filter(game => game.password);
        break;
      case 'public':
        result = result.filter(game => !game.password);
        break;
      case 'active':
        const now = Date.now();
        result = result.filter(game => {
          const expiryTime = typeof game.expiresAt === 'number' 
            ? game.expiresAt 
            : new Date(game.expiresAt).getTime();
          return expiryTime > now;
        });
        break;
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
      case 'popular':
        result.sort((a, b) => {
          const shareCountA = (a as any).shareCount || 0;
          const shareCountB = (b as any).shareCount || 0;
          return shareCountB - shareCountA;
        });
        break;
    }
    
    setFilteredGames(result);
  };
  
  const handleGameClick = (gameId: string) => {
    // Navigate to game with admin privileges - bypass all restrictions
    navigate(`/game/${gameId}?acc=${accountId}&admin=true&bypass=true`);
  };
  
  const handleCreateNew = () => {
    navigate('/custom-game');
  };
  
  const handleShareGame = (gameId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/game/${gameId}?acc=${accountId}`;
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        toast({
          title: "Đã sao chép!",
          description: "Liên kết game đã được sao chép vào clipboard",
        });
      })
      .catch(err => {
        console.error('Không thể sao chép liên kết:', err);
        toast({
          title: "Lỗi",
          description: "Không thể sao chép liên kết",
          variant: "destructive"
        });
      });
  };

  const handleViewLeaderboard = (gameId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/game/${gameId}/dashboard?acc=${accountId}`);
  };

  const handleViewParticipants = (gameId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/game/${gameId}/teacher?acc=${accountId}`);
  };

  const handleExportData = async (gameId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const csvData = await exportParticipantsToCSV(gameId);
      
      // Create and download CSV file
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `game_${gameId}_participants.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Xuất dữ liệu thành công!",
        description: "File CSV đã được tải xuống",
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: "Lỗi xuất dữ liệu",
        description: "Không thể xuất dữ liệu game",
        variant: "destructive"
      });
    }
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
            <Select value={filterBy} onValueChange={(value: 'all' | 'password' | 'public' | 'active') => setFilterBy(value)}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Lọc theo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="password">Có mật khẩu</SelectItem>
                <SelectItem value="public">Công khai</SelectItem>
                <SelectItem value="active">Đang hoạt động</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(value: 'newest' | 'oldest' | 'expiring' | 'popular') => setSortBy(value)}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Sắp xếp theo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Mới nhất</SelectItem>
                <SelectItem value="oldest">Cũ nhất</SelectItem>
                <SelectItem value="expiring">Sắp hết hạn</SelectItem>
                <SelectItem value="popular">Phổ biến</SelectItem>
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
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredGames.map(game => (
              <AdminGameCard
                key={game.id}
                game={game}
                onGameClick={handleGameClick}
                onShareGame={handleShareGame}
                onViewLeaderboard={handleViewLeaderboard}
                onExportData={handleExportData}
              />
            ))}
          </div>
        )}
      </div>
    </QuizContainer>
  );
};

export default GameHistoryPage;
