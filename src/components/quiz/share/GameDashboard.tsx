import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import { ArrowLeft, Eye, Download, RefreshCw, Clock, Globe, Copy, Share2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { getGameById, exportParticipantsToCSV, maskIpAddress } from '@/services/storage';
import { checkVpsStatus } from '@/services/vpsStorage';
import GameShareButtons from './GameShareButtons';

const GameDashboard: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const [game, setGame] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [vpsStatus, setVpsStatus] = useState<any | null>(null);
  const [loadingVpsStatus, setLoadingVpsStatus] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!gameId) {
      navigate('/preset-games');
      return;
    }
    
    loadGameData();
    fetchVpsStatus();
  }, [gameId, navigate]);

  const loadGameData = () => {
    setLoading(true);
    const loadedGame = getGameById(gameId);
    
    if (loadedGame) {
      setGame(loadedGame);
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
  
  const fetchVpsStatus = async () => {
    setLoadingVpsStatus(true);
    try {
      const status = await checkVpsStatus();
      setVpsStatus(status);
    } catch (error) {
      console.error("Error fetching VPS status:", error);
    } finally {
      setLoadingVpsStatus(false);
    }
  };

  const handleViewGame = () => {
    navigate(`/game/${gameId}`);
  };

  const handleExportCSV = () => {
    if (!gameId) return;
    
    const csvContent = exportParticipantsToCSV(gameId);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', `game-participants-${gameId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Xuất dữ liệu thành công",
      description: "Dữ liệu người tham gia đã được tải xuống.",
    });
  };

  const formatTimestamp = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString();
  };

  const calculateDiskUsagePercent = () => {
    if (!vpsStatus || !vpsStatus.diskSpace) return 0;
    return Math.round((vpsStatus.diskSpace.used / vpsStatus.diskSpace.total) * 100);
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
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
      <div className="flex flex-col items-center justify-center h-screen space-y-6">
        <h1 className="text-2xl font-bold">Game không tồn tại</h1>
        <Button onClick={() => navigate('/preset-games')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Quay lại</span>
          </Button>
          <h1 className="text-xl font-bold md:text-2xl">Thống kê của Game</h1>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={handleViewGame}
          >
            <Eye className="mr-2 h-4 w-4" />
            Xem Game
          </Button>
          
          <GameShareButtons 
            gameId={gameId || ''} 
            shareUrl={game.shareUrl || `https://ai-games-vn.com/share/${gameId}`} 
            title={game.title}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Tổng người tham gia</CardTitle>
            <CardDescription>Số người đã tham gia game</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{game.participants.length}</div>
          </CardContent>
          <CardFooter className="text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5 mr-1" />
            <span>Cập nhật lần cuối: {formatTimestamp(game.updatedAt)}</span>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Lượt xem</CardTitle>
            <CardDescription>Số lượt xem trang game</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{game.viewCount || 0}</div>
            <div className="flex items-center mt-2">
              <Progress value={(game.analytics?.uniqueUsers || 0) / Math.max(game.viewCount || 1, 1) * 100} className="h-2" />
              <span className="ml-2 text-xs text-muted-foreground">{game.analytics?.uniqueUsers || 0} người dùng duy nhất</span>
            </div>
          </CardContent>
          <CardFooter className="text-xs text-muted-foreground">
            <Globe className="h-3.5 w-3.5 mr-1" />
            <span>Tạo ngày: {formatTimestamp(game.createdAt)}</span>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Server VPS</CardTitle>
            <CardDescription>Tình trạng máy chủ lưu trữ</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingVpsStatus ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                <span className="text-sm">Đang tải...</span>
              </div>
            ) : vpsStatus ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Dung lượng đĩa:</span>
                  <Badge variant={calculateDiskUsagePercent() > 80 ? "destructive" : "secondary"}>
                    {calculateDiskUsagePercent()}%
                  </Badge>
                </div>
                <Progress value={calculateDiskUsagePercent()} className="h-2" />
                <div className="text-xs text-muted-foreground">
                  {formatBytes(vpsStatus.diskSpace.used * 1024 * 1024)} / {formatBytes(vpsStatus.diskSpace.total * 1024 * 1024)}
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">Không thể kết nối máy chủ</div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" onClick={fetchVpsStatus} disabled={loadingVpsStatus}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loadingVpsStatus ? 'animate-spin' : ''}`} />
              Cập nhật
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Thông tin chi tiết</CardTitle>
          <CardDescription>Chi tiết về game của bạn</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-1">Tiêu đề</h3>
              <p className="text-muted-foreground">{game.title}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1">Link chia sẻ</h3>
              <div className="flex items-center">
                <p className="text-muted-foreground text-sm truncate mr-2">
                  {game.shareUrl || `https://ai-games-vn.com/share/${gameId}`}
                </p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 w-7 p-0"
                        onClick={() => {
                          navigator.clipboard.writeText(game.shareUrl || `https://ai-games-vn.com/share/${gameId}`);
                          toast({
                            title: "Link đã được sao chép",
                            description: "Link chia sẻ đã được sao chép vào clipboard.",
                          });
                        }}
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Sao chép link</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1">Ngày tạo</h3>
              <p className="text-muted-foreground">{formatTimestamp(game.createdAt)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1">Cập nhật lần cuối</h3>
              <p className="text-muted-foreground">{formatTimestamp(game.updatedAt)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1">Trạng thái</h3>
              <Badge variant={game.isPublic ? "secondary" : "outline"}>
                {game.isPublic ? "Công khai" : "Riêng tư"}
              </Badge>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1">Tags</h3>
              <div className="flex flex-wrap gap-1">
                {game.tags && game.tags.length > 0 ? (
                  game.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">Không có tags</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Danh sách người tham gia</CardTitle>
            <CardDescription>Người chơi đã tham gia vào game này</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            <Download className="mr-2 h-4 w-4" />
            Xuất CSV
          </Button>
        </CardHeader>
        <CardContent>
          {game.participants && game.participants.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead>Thiết bị</TableHead>
                  <TableHead>Thời gian</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {game.participants.map((participant: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{participant.name}</TableCell>
                    <TableCell>{maskIpAddress(participant.ipAddress)}</TableCell>
                    <TableCell className="truncate max-w-[200px]">
                      {participant.deviceInfo?.platform || 'Unknown'}
                    </TableCell>
                    <TableCell>{formatTimestamp(participant.timestamp)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              Chưa có người tham gia nào
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GameDashboard;
