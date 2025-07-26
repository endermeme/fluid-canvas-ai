import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Filter, Calendar } from 'lucide-react';
import QuizContainer from '@/components/quiz/QuizContainer';
import AdminGameCard from '@/components/admin/AdminGameCard';
import { useAccount } from '@/contexts/AccountContext';
import { useToast } from '@/hooks/use-toast';
import { usePresetGameManager } from '@/hooks/usePresetGameManager';
import { useCustomGameManager } from '@/hooks/useCustomGameManager';

// Types để hiển thị unified
interface UnifiedGame {
  id: string;
  title: string;
  gameType: string;
  description?: string;
  createdAt: number;
  expiresAt: number;
  shareCount?: number;
  lastAccessedAt?: string;
  password?: string;
  maxParticipants?: number;
  showLeaderboard?: boolean;
  type: 'preset' | 'custom'; // To distinguish between game types
}

const GameHistoryPage: React.FC = () => {
  const [presetGames, setPresetGames] = useState<any[]>([]);
  const [customGames, setCustomGames] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'expiring' | 'popular'>('newest');
  const [filterBy, setFilterBy] = useState<'all' | 'password' | 'public' | 'active'>('all');
  const [activeTab, setActiveTab] = useState<'all' | 'preset' | 'custom'>('all');
  
  const navigate = useNavigate();
  const { accountId } = useAccount();
  const { toast } = useToast();
  
  const presetGameManager = usePresetGameManager();
  const customGameManager = useCustomGameManager();
  
  useEffect(() => {
    loadAllGames();
  }, [accountId]);
  
  const loadAllGames = async () => {
    if (!accountId) return;

    try {
      // Load preset games
      const presetGamesList = await presetGameManager.getPresetGamesList(accountId);
      setPresetGames(presetGamesList);
      
      // Load custom games  
      const customGamesList = await customGameManager.getCustomGamesList(accountId);
      setCustomGames(customGamesList);
    } catch (error) {
      console.error("Error loading games:", error);
      toast({
        title: "Lỗi tải dữ liệu",
        description: "Không thể tải danh sách game.",
        variant: "destructive"
      });
    }
  };
  
  // Convert to unified format for display
  const getUnifiedGames = (): UnifiedGame[] => {
    const allGames: UnifiedGame[] = [];
    
    // Add preset games
    presetGames.forEach(game => {
      allGames.push({
        id: game.id,
        title: game.title,
        gameType: game.preset_games?.game_type || 'preset',
        description: game.description,
        createdAt: new Date(game.created_at).getTime(),
        expiresAt: new Date(game.expires_at).getTime(),
        shareCount: game.share_count || 0,
        lastAccessedAt: game.last_accessed_at,
        password: game.password,
        maxParticipants: game.max_participants,
        showLeaderboard: game.show_leaderboard,
        type: 'preset'
      });
    });
    
    // Add custom games
    customGames.forEach(game => {
      allGames.push({
        id: game.id,
        title: game.title,
        gameType: 'custom',
        description: game.description,
        createdAt: new Date(game.created_at).getTime(),
        expiresAt: new Date(game.expires_at).getTime(),
        shareCount: game.share_count || 0,
        lastAccessedAt: game.last_accessed_at,
        password: game.password,
        maxParticipants: game.max_participants,
        showLeaderboard: game.show_leaderboard,
        type: 'custom'
      });
    });
    
    return allGames;
  };
  
  const filterAndSortGames = (): UnifiedGame[] => {
    let result = getUnifiedGames();
    
    // Filter by tab
    if (activeTab === 'preset') {
      result = result.filter(game => game.type === 'preset');
    } else if (activeTab === 'custom') {
      result = result.filter(game => game.type === 'custom');
    }
    
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
        result = result.filter(game => game.expiresAt > now);
        break;
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
      case 'popular':
        result.sort((a, b) => (b.shareCount || 0) - (a.shareCount || 0));
        break;
    }
    
    return result;
  };
  
  const handleGameClick = (game: UnifiedGame) => {
    // Navigate based on game type with admin privileges
    if (game.type === 'preset') {
      navigate(`/preset-game/${game.id}?acc=${accountId}&admin=true&bypass=true`);
    } else {
      navigate(`/custom-game/${game.id}?acc=${accountId}&admin=true&bypass=true`);
    }
  };
  
  const handleCreateNew = () => {
    if (activeTab === 'preset') {
      navigate('/preset-games');
    } else {
      navigate('/custom-game');
    }
  };
  
  const handleShareGame = (game: UnifiedGame, e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = game.type === 'preset' 
      ? `${window.location.origin}/preset-game/${game.id}?acc=${accountId}`
      : `${window.location.origin}/custom-game/${game.id}?acc=${accountId}`;
      
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

  const handleViewLeaderboard = (game: UnifiedGame, e: React.MouseEvent) => {
    e.stopPropagation();
    if (game.type === 'preset') {
      navigate(`/preset-game/${game.id}/dashboard?acc=${accountId}`);
    } else {
      navigate(`/custom-game/${game.id}/dashboard?acc=${accountId}`);
    }
  };

  const handleViewParticipants = (game: UnifiedGame, e: React.MouseEvent) => {
    e.stopPropagation();
    if (game.type === 'preset') {
      navigate(`/preset-game/${game.id}/teacher?acc=${accountId}`);
    } else {
      navigate(`/custom-game/${game.id}/teacher?acc=${accountId}`);
    }
  };

  const handleExportData = async (game: UnifiedGame, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      // This would need to be implemented based on the new API structure
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
  
  const handleDeleteGame = async (game: UnifiedGame) => {
    try {
      let success = false;
      
      if (game.type === 'preset') {
        success = await presetGameManager.deletePresetGame(game.id);
      } else {
        success = await customGameManager.deleteCustomGame(game.id);
      }
      
      if (success) {
        // Reload games after deletion
        loadAllGames();
      }
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
        <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">Tất cả ({getUnifiedGames().length})</TabsTrigger>
            <TabsTrigger value="preset">Preset Games ({presetGames.length})</TabsTrigger>
            <TabsTrigger value="custom">Custom Games ({customGames.length})</TabsTrigger>
          </TabsList>
        </Tabs>
        
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
                key={`${game.type}-${game.id}`}
                game={{
                  id: game.id,
                  title: game.title,
                  gameType: game.gameType,
                  description: game.description || '',
                  htmlContent: '', // Not needed for display
                  createdAt: game.createdAt,
                  expiresAt: game.expiresAt,
                  password: game.password,
                  maxParticipants: game.maxParticipants,
                  showLeaderboard: game.showLeaderboard,
                  shareCount: game.shareCount,
                  account_id: accountId,
                  creator_ip: '',
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
      </div>
    </QuizContainer>
  );
};

export default GameHistoryPage;