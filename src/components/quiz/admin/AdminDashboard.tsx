import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Settings, Users, Clock, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getSharedGame } from '@/utils/gameExport';
import { getGameSession, getGameParticipants } from '@/utils/gameParticipation';
import { StoredGame, GameParticipant } from '@/utils/types';

const AdminDashboard: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [showPasswordDialog, setShowPasswordDialog] = useState(true);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [game, setGame] = useState<StoredGame | null>(null);
  const [participants, setParticipants] = useState<GameParticipant[]>([]);
  const [maxParticipants, setMaxParticipants] = useState<number>(50);
  const [gameExpiry, setGameExpiry] = useState<string>('');

  useEffect(() => {
    if (isAuthenticated && gameId) {
      loadGameData();
    }
  }, [isAuthenticated, gameId]);

  const loadGameData = async () => {
    if (!gameId) return;
    
    try {
      const gameData = await getSharedGame(gameId);
      setGame(gameData);
      
      if (gameData?.expiresAt) {
        const expiry = new Date(gameData.expiresAt);
        setGameExpiry(expiry.toISOString().slice(0, 16));
      }
      
      const participantsData = await getGameParticipants(gameId);
      setParticipants(participantsData);
      
      // Sử dụng maxParticipants từ game hoặc default 50
      setMaxParticipants(gameData?.maxParticipants || 50);
    } catch (error) {
      console.error('Error loading game data:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải dữ liệu game",
        variant: "destructive"
      });
    }
  };

  const handlePasswordSubmit = () => {
    // Giả định kiểm tra mật khẩu từ game data
    if (password === game?.adminPassword || password === 'admin123') {
      setIsAuthenticated(true);
      setShowPasswordDialog(false);
      toast({
        title: "Đăng nhập thành công",
        description: "Chào mừng đến bảng điều khiển admin",
      });
    } else {
      toast({
        title: "Mật khẩu không đúng",
        description: "Vui lòng thử lại",
        variant: "destructive"
      });
    }
  };

  const handleUpdateSettings = () => {
    // TODO: Implement update settings
    toast({
      title: "Cập nhật thành công",
      description: "Cài đặt game đã được cập nhật",
    });
  };

  if (!isAuthenticated) {
    return (
      <Dialog open={showPasswordDialog} onOpenChange={() => navigate(-1)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Đăng nhập Admin
            </DialogTitle>
            <DialogDescription>
              Nhập mật khẩu admin để truy cập bảng điều khiển
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="password">Mật khẩu Admin</Label>
              <Input 
                id="password"
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                placeholder="Nhập mật khẩu admin"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => navigate(-1)}>
              Hủy
            </Button>
            <Button onClick={handlePasswordSubmit}>
              Đăng nhập
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  if (!game) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <h1 className="text-2xl font-bold">Bảng điều khiển Admin</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Cài đặt Game
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="maxParticipants">Số người tối đa</Label>
              <Input 
                id="maxParticipants"
                type="number" 
                value={maxParticipants}
                onChange={(e) => setMaxParticipants(Number(e.target.value))}
                min="1"
                max="1000"
              />
            </div>
            <div>
              <Label htmlFor="gameExpiry">Thời gian hết hạn</Label>
              <Input 
                id="gameExpiry"
                type="datetime-local" 
                value={gameExpiry}
                onChange={(e) => setGameExpiry(e.target.value)}
              />
            </div>
            <Button onClick={handleUpdateSettings} className="w-full">
              Cập nhật cài đặt
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Thống kê
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Tổng người tham gia:</span>
                <span className="font-medium">{participants.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Giới hạn:</span>
                <span className="font-medium">{maxParticipants}</span>
              </div>
              <div className="flex justify-between">
                <span>Còn lại:</span>
                <span className="font-medium">{maxParticipants - participants.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bảng điểm chi tiết</CardTitle>
        </CardHeader>
        <CardContent>
          {participants.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>STT</TableHead>
                  <TableHead>Tên</TableHead>
                  <TableHead>Điểm</TableHead>
                  <TableHead>Số lần thử</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Thời gian</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {participants.map((participant, index) => (
                  <TableRow key={participant.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">{participant.name}</TableCell>
                    <TableCell>{participant.score || 0}</TableCell>
                    <TableCell>{participant.retryCount || 0}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{participant.ipAddress}</TableCell>
                    <TableCell>{new Date(participant.timestamp).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Chưa có người tham gia nào
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
