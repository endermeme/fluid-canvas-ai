import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSharedGame, getRemainingTime } from '@/utils/gameExport';
import { getGameParticipants, exportParticipantsToCSV, maskIpAddress, deleteParticipant } from '@/utils/gameParticipation';
import { supabase } from '@/integrations/supabase/client';
import { StoredGame, GameParticipant } from '@/utils/types';
import QuizContainer from '@/components/quiz/QuizContainer';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  Download, 
  Users, 
  RefreshCw, 
  Trash2, 
  Lock, 
  CalendarIcon,
  Settings,
  UserMinus,
  Edit
} from 'lucide-react';
import { getGameAdminSettings, updateGameAdminSettings, verifyAdminPassword } from '@/utils/gameAdmin';

const GameAdminPage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [game, setGame] = useState<StoredGame | null>(null);
  const [participants, setParticipants] = useState<GameParticipant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPasswordDialog, setShowPasswordDialog] = useState(true);
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [maxParticipants, setMaxParticipants] = useState<number>(50);
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(undefined);
  const [maskIps, setMaskIps] = useState(true);
  const [deletingParticipant, setDeletingParticipant] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('participants');
  const [isEditingSettings, setIsEditingSettings] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  useEffect(() => {
    const loadGame = async () => {
      if (!gameId || !authenticated) return;
      
      try {
        setLoading(true);
        const loadedGame = await getSharedGame(gameId);
        
        if (loadedGame) {
          setGame(loadedGame);
          
          // Đặt giá trị mặc định từ dữ liệu game
          if (loadedGame.expiresAt) {
            setExpiryDate(new Date(loadedGame.expiresAt));
          }
          
          // Tải danh sách người tham gia
          const participantsList = await getGameParticipants(gameId);
          setParticipants(participantsList);
          
          // Lấy cấu hình admin từ database
          const adminSettings = await getGameAdminSettings(gameId);
          if (adminSettings) {
            setMaxParticipants(adminSettings.maxParticipants || 50);
            setAdminPassword(adminSettings.adminPassword || '1234');
          }
        } else {
          toast({
            title: "Game không tồn tại",
            description: "Game này không tồn tại hoặc đã bị xóa",
            variant: "destructive"
          });
          navigate('/game-history');
        }
      } catch (error) {
        console.error("Không thể tải game:", error);
        toast({
          title: "Lỗi tải dữ liệu",
          description: "Không thể tải thông tin game",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadGame();
  }, [gameId, authenticated, navigate, toast]);
  
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!gameId) return;
    
    try {
      const isValid = await verifyAdminPassword(gameId, password);
      
      if (isValid) {
        setAuthenticated(true);
        setShowPasswordDialog(false);
        toast({
          title: "Xác thực thành công",
          description: "Bạn đã đăng nhập vào bảng quản trị game"
        });
      } else {
        toast({
          title: "Mật khẩu không đúng",
          description: "Vui lòng kiểm tra lại mật khẩu",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Lỗi xác thực:", error);
      toast({
        title: "Lỗi xác thực",
        description: "Không thể xác thực mật khẩu",
        variant: "destructive"
      });
    }
  };
  
  const handleBack = () => {
    navigate(`/game/${gameId}`);
  };
  
  const handleExportCSV = async () => {
    if (!gameId) return;
    
    try {
      const csvContent = await exportParticipantsToCSV(gameId);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `participants_${gameId}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Xuất dữ liệu thành công",
        description: "Danh sách người tham gia đã được tải xuống"
      });
    } catch (error) {
      console.error("Lỗi xuất CSV:", error);
      toast({
        title: "Lỗi xuất dữ liệu",
        description: "Không thể xuất dữ liệu CSV",
        variant: "destructive"
      });
    }
  };
  
  const handleRefresh = async () => {
    if (!gameId || !authenticated) return;
    
    try {
      setLoading(true);
      const participantsList = await getGameParticipants(gameId);
      setParticipants(participantsList);
      
      toast({
        title: "Làm mới thành công",
        description: "Danh sách người tham gia đã được cập nhật"
      });
    } catch (error) {
      console.error("Lỗi làm mới:", error);
      toast({
        title: "Lỗi làm mới",
        description: "Không thể cập nhật danh sách người tham gia",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const confirmDeleteParticipant = (participantId: string) => {
    setDeletingParticipant(participantId);
    setShowDeleteDialog(true);
  };
  
  const handleDeleteParticipant = async () => {
    if (!deletingParticipant || !gameId) {
      setShowDeleteDialog(false);
      return;
    }
    
    try {
      // Xóa người tham gia bằng hàm utility
      const success = await deleteParticipant(deletingParticipant);
      
      if (!success) {
        throw new Error("Không thể xóa người tham gia");
      }
      
      // Xóa khỏi state
      setParticipants(prev => prev.filter(p => p.id !== deletingParticipant));
      
      toast({
        title: "Xóa thành công",
        description: "Người tham gia đã được xóa khỏi danh sách"
      });
    } catch (error) {
      console.error("Lỗi xóa người tham gia:", error);
      toast({
        title: "Lỗi xóa",
        description: "Không thể xóa người tham gia",
        variant: "destructive"
      });
    } finally {
      setShowDeleteDialog(false);
      setDeletingParticipant(null);
    }
  };
  
  const saveGameSettings = async () => {
    if (!gameId || !game) return;
    
    try {
      // Kiểm tra mật khẩu xác nhận
      if (adminPassword !== confirmPassword && confirmPassword.trim() !== '') {
        toast({
          title: "Mật khẩu không khớp",
          description: "Mật khẩu xác nhận không khớp với mật khẩu mới",
          variant: "destructive"
        });
        return;
      }
      
      // Lưu cài đặt admin vào database
      const success = await updateGameAdminSettings({
        gameId,
        adminPassword: adminPassword.trim() ? adminPassword : '1234',
        maxParticipants
      });
      
      if (!success) {
        throw new Error("Không thể cập nhật cài đặt admin");
      }
      
      // Cập nhật ngày hết hạn trên Supabase
      if (expiryDate) {
        const { error } = await supabase
          .from('games')
          .update({
            expires_at: expiryDate.toISOString()
          })
          .eq('id', gameId);
        
        if (error) {
          throw error;
        }
      }
      
      toast({
        title: "Lưu thành công",
        description: "Cài đặt game đã được cập nhật"
      });
      
      // Tắt chế độ chỉnh sửa
      setIsEditingSettings(false);
      setConfirmPassword(''); // Reset mật khẩu xác nhận
    } catch (error) {
      console.error("Lỗi lưu cài đặt:", error);
      toast({
        title: "Lỗi lưu",
        description: "Không thể cập nhật cài đặt game",
        variant: "destructive"
      });
    }
  };
  
  // Hiển thị dialog xác thực nếu chưa đăng nhập
  if (!authenticated) {
    return (
      <QuizContainer
        title="Xác thực quản trị viên"
        showBackButton={true}
        onBack={handleBack}
        className="flex items-center justify-center"
      >
        <div className="max-w-md w-full p-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Nhập mật khẩu quản trị</CardTitle>
              <CardDescription>
                Vui lòng nhập mật khẩu để truy cập bảng quản trị game
              </CardDescription>
            </CardHeader>
            <form onSubmit={handlePasswordSubmit}>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Mật khẩu</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Nhập mật khẩu quản trị"
                        required
                      />
                      <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Mật khẩu mặc định là 1234 nếu bạn chưa đặt mật khẩu khác
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex justify-between w-full">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                  >
                    Quay lại
                  </Button>
                  <Button type="submit">
                    Đăng nhập
                  </Button>
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </QuizContainer>
    );
  }
  
  if (loading) {
    return (
      <QuizContainer
        title="Đang tải..."
        showBackButton={true}
        onBack={handleBack}
      >
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </QuizContainer>
    );
  }
  
  if (!game) {
    return (
      <QuizContainer
        title="Không tìm thấy game"
        showBackButton={true}
        onBack={handleBack}
      >
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-xl font-bold mb-4">Game không tồn tại hoặc đã bị xóa</h2>
          <Button onClick={handleBack}>Quay lại</Button>
        </div>
      </QuizContainer>
    );
  }
  
  return (
    <QuizContainer
      title={`Quản lý: ${game.title}`}
      showBackButton={true}
      onBack={handleBack}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full">
        <div className="p-4">
          <TabsList className="w-full">
            <TabsTrigger value="participants">
              <Users className="h-4 w-4 mr-2" />
              Người tham gia ({participants.length})
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Cài đặt game
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="participants" className="p-4 overflow-auto h-[calc(100%-56px)]">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Danh sách người tham gia</CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setMaskIps(!maskIps)}
                  >
                    {maskIps ? 'Hiện IP' : 'Ẩn IP'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Làm mới
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleExportCSV}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Xuất CSV
                  </Button>
                </div>
              </div>
              <CardDescription>
                Hiển thị {participants.length} người đã tham gia game này
              </CardDescription>
            </CardHeader>
            <CardContent>
              {participants.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tên người chơi</TableHead>
                      <TableHead>Địa chỉ IP</TableHead>
                      <TableHead>Số lần thử</TableHead>
                      <TableHead>Thời gian tham gia</TableHead>
                      <TableHead>Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {participants.map((participant) => (
                      <TableRow key={participant.id}>
                        <TableCell className="font-medium">
                          {participant.name}
                        </TableCell>
                        <TableCell>
                          {maskIps ? maskIpAddress(participant.ipAddress) : participant.ipAddress}
                        </TableCell>
                        <TableCell>
                          <span className={participant.retryCount > 1 ? "text-amber-500 font-medium" : ""}>
                            {participant.retryCount || 0}
                          </span>
                        </TableCell>
                        <TableCell>
                          {new Date(participant.timestamp).toLocaleString('vi-VN')}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => confirmDeleteParticipant(participant.id)}
                          >
                            <span className="sr-only">Xóa</span>
                            <UserMinus className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-2 opacity-30" />
                  <p>Chưa có người tham gia nào</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="p-4 overflow-auto h-[calc(100%-56px)]">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Cài đặt game</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingSettings(!isEditingSettings)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  {isEditingSettings ? 'Hủy' : 'Chỉnh sửa'}
                </Button>
              </div>
              <CardDescription>
                Quản lý các thông số và cài đặt của game
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Thời gian hết hạn</Label>
                {isEditingSettings ? (
                  <div className="flex flex-col space-y-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {expiryDate ? format(expiryDate, 'PPP', { locale: vi }) : "Chọn ngày hết hạn"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={expiryDate}
                          onSelect={setExpiryDate}
                          initialFocus
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                    <p className="text-xs text-muted-foreground">
                      Game sẽ tự động hết hạn vào ngày này
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center p-2 rounded bg-muted/50">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    <span>{expiryDate ? format(expiryDate, 'PPP', { locale: vi }) : "Chưa đặt"}</span>
                    <span className="ml-2 text-sm text-muted-foreground">
                      ({game.expiresAt ? getRemainingTime(game.expiresAt) : "Không xác định"})
                    </span>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label>Số người tham gia tối đa</Label>
                {isEditingSettings ? (
                  <div className="flex flex-col space-y-2">
                    <Input
                      type="number"
                      min="1"
                      max="1000"
                      value={maxParticipants}
                      onChange={(e) => setMaxParticipants(parseInt(e.target.value) || 50)}
                      placeholder="Nhập số người tham gia tối đa"
                    />
                    <p className="text-xs text-muted-foreground">
                      Khi đạt giới hạn, game sẽ không cho phép người chơi mới tham gia
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center p-2 rounded bg-muted/50">
                    <Users className="mr-2 h-4 w-4" />
                    <span>{maxParticipants} người</span>
                    <span className="ml-2 text-sm text-muted-foreground">
                      (đã có {participants.length} người tham gia)
                    </span>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label>Mật khẩu quản trị</Label>
                {isEditingSettings ? (
                  <div className="space-y-2">
                    <Input
                      type="password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="Nhập mật khẩu mới"
                    />
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Xác nhận mật khẩu mới"
                    />
                    <p className="text-xs text-muted-foreground">
                      Để trống nếu bạn muốn giữ mật khẩu hiện tại
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center p-2 rounded bg-muted/50">
                    <Lock className="mr-2 h-4 w-4" />
                    <span>••••••••</span>
                  </div>
                )}
              </div>
            </CardContent>
            {isEditingSettings && (
              <CardFooter className="flex justify-end">
                <Button onClick={saveGameSettings}>
                  Lưu thay đổi
                </Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Dialog xác nhận xóa người tham gia */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa người chơi này? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteParticipant}
            >
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </QuizContainer>
  );
};

export default GameAdminPage; 