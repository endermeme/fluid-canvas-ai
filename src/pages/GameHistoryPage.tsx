import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search } from 'lucide-react';
import QuizContainer from '@/components/quiz/QuizContainer';
import AdminGameCard from '@/components/admin/AdminGameCard';
import { useAccount } from '@/contexts/AccountContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Types để hiển thị lịch sử game
interface HistoryGame {
  id: string;
  title: string;
  game_type: string;
  description?: string;
  created_at: string;
  expires_at: string;
  share_count?: number;
  last_accessed_at?: string;
  password?: string;
  max_participants?: number;
  show_leaderboard?: boolean;
  html_content: string;
  creator_ip?: string;
  account_id?: string;
  participant_count?: number;
  completed_count?: number;
  completion_rate?: number;
}

const GameHistoryPage: React.FC = () => {
  const [games, setGames] = useState<HistoryGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'expiring' | 'popular'>('newest');
  const [filterBy, setFilterBy] = useState<'all' | 'password' | 'public' | 'active'>('all');
  
  const navigate = useNavigate();
  const { accountId } = useAccount();
  const { toast } = useToast();
  
  useEffect(() => {
    loadGames();
  }, [accountId]);
  
  const loadGames = async () => {
    if (!accountId) return;
    
    setLoading(true);
    try {
      // Load games with participant counts
      const { data: gamesData, error: gamesError } = await supabase
        .from('games')
        .select('*,share_count,last_accessed_at,max_participants,show_leaderboard,require_registration,custom_duration,password,creator_ip,account_id')
        .eq('account_id', accountId)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (gamesError) throw gamesError;
      
      // For each game, get participant statistics
      const gamesWithStats = await Promise.all(
        (gamesData || []).map(async (game) => {
          try {
            const { data: participants, error: participantsError } = await supabase
              .from('game_participants')
              .select('id')
              .eq('game_id', game.id);
            
            const { data: scores, error: scoresError } = await supabase
              .from('unified_game_scores')
              .select('id')
              .eq('game_id', game.id)
              .eq('source_table', 'games');

            const participantCount = participants?.length || 0;
            const completedCount = scores?.length || 0;
            
            console.log(`📊 [GameHistoryPage] Game ${game.title}: ${participantCount} participants, ${completedCount} completed`);
            
            return {
              ...game,
              participant_count: participantCount,
              completed_count: completedCount,
              completion_rate: participantCount > 0 ? Math.round((completedCount / participantCount) * 100) : 0
            };
          } catch (error) {
            console.error(`Error fetching stats for game ${game.id}:`, error);
            return {
              ...game,
              participant_count: 0,
              completed_count: 0,
              completion_rate: 0
            };
          }
        })
      );
      
      setGames(gamesWithStats);
    } catch (error) {
      console.error("Error loading games:", error);
      toast({
        title: "Lỗi tải dữ liệu",
        description: "Không thể tải lịch sử game.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const filterAndSortGames = (): HistoryGame[] => {
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
        const now = new Date();
        result = result.filter(game => new Date(game.expires_at) > now);
        break;
    }
    
    // Sort games
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case 'expiring':
        result.sort((a, b) => new Date(a.expires_at).getTime() - new Date(b.expires_at).getTime());
        break;
      case 'popular':
        result.sort((a, b) => (b.share_count || 0) - (a.share_count || 0));
        break;
    }
    
    return result;
  };
  
  const handleGameClick = (game: HistoryGame) => {
    navigate(`/game/${game.id}?acc=${accountId}&admin=true&bypass=true`);
  };
  
  const handleCreateNew = () => {
    navigate('/preset-games');
  };
  
  const handleShareGame = (game: HistoryGame, e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/game/${game.id}?acc=${accountId}`;
      
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

  const handleViewLeaderboard = (game: HistoryGame, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/game/${game.id}/dashboard?acc=${accountId}`);
  };

  const handleViewParticipants = (game: HistoryGame, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/game/${game.id}?acc=${accountId}&tab=participants`);
  };

  const handleExportData = async (game: HistoryGame, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      toast({
        title: "Tính năng đang phát triển",
        description: "Tính năng xuất dữ liệu sẽ sớm được cập nhật",
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
  
  const handleDeleteGame = async (game: HistoryGame) => {
    try {
      const { error } = await supabase
        .from('games')
        .delete()
        .eq('id', game.id)
        .eq('account_id', accountId);
      
      if (error) throw error;
      
      toast({
        title: "Game đã được xóa",
        description: "Game đã được xóa thành công.",
      });
      
      loadGames(); // Reload games after deletion
    } catch (error) {
      console.error('Error deleting game:', error);
      toast({
        title: "Lỗi xóa game",
        description: "Không thể xóa game. Vui lòng thử lại.",
        variant: "destructive"
      });
    }
  };
  
  const filteredGames = filterAndSortGames();
  
  return (
    <QuizContainer
      title="Lịch Sử Game"
      showBackButton={true}
      onBack={() => navigate('/')}
    >
      <div className="p-4 h-full overflow-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p className="text-lg">Đang tải lịch sử game...</p>
          </div>
        ) : (
          <>
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
                <Select value={filterBy} onValueChange={(value: any) => setFilterBy(value)}>
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
                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
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
                    game={{
                      id: game.id,
                      title: game.title,
                      gameType: game.game_type,
                      description: game.description || '',
                      htmlContent: game.html_content,
                      createdAt: new Date(game.created_at).getTime(),
                      expiresAt: new Date(game.expires_at).getTime(),
                      password: game.password,
                      maxParticipants: game.max_participants,
                      showLeaderboard: game.show_leaderboard,
                      shareCount: game.share_count,
                      account_id: accountId,
                      creator_ip: game.creator_ip || '',
                      requireRegistration: false,
                      customDuration: undefined
                    }}
                    onGameClick={() => handleGameClick(game)}
                    onShareGame={(gameId, e) => handleShareGame(game, e)}
                    onViewLeaderboard={(gameId, e) => handleViewLeaderboard(game, e)}
                    onExportData={(gameId, e) => handleExportData(game, e)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </QuizContainer>
  );
};

export default GameHistoryPage;