import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getSharedGame, getRemainingTime } from '@/utils/gameExport';
import { addParticipant, getFakeIpAddress, getGameParticipants } from '@/utils/gameParticipation';
import { StoredGame, GameParticipant, GameSession } from '@/utils/types';
import QuizContainer from '@/components/quiz/QuizContainer';
import EnhancedGameView from '@/components/quiz/custom-games/ui/EnhancedGameView';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Share2, Users, Clock, Copy, Check, Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { QRCodeSVG } from 'qrcode.react';
import { useToast } from '@/hooks/use-toast';
import { getGameAdminSettings, checkPlayerInfoRequired } from '@/utils/gameAdmin';

// Định nghĩa schema validation cho form đăng ký
const playerFormSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên của bạn"),
  age: z.coerce.number().min(1).max(120).optional()
});

// Định nghĩa kiểu dữ liệu cho form values
type PlayerFormValues = z.infer<typeof playerFormSchema>;

const GameSharePage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const [game, setGame] = useState<StoredGame | null>(null);
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [hasRegistered, setHasRegistered] = useState(false);
  const [participants, setParticipants] = useState<GameParticipant[]>([]);
  const [currentUser, setCurrentUser] = useState<GameParticipant | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('game');
  const [gameExpired, setGameExpired] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [hasAdminAccess, setHasAdminAccess] = useState(false);
  const { toast } = useToast();
  const [requirePlayerInfo, setRequirePlayerInfo] = useState<boolean>(true);
  
  const form = useForm<PlayerFormValues>({
    resolver: zodResolver(playerFormSchema),
    defaultValues: {
      name: "",
      age: undefined
    },
  });
  
  useEffect(() => {
    const loadGame = async () => {
      if (!gameId) return;
      
      try {
        setIsRegistering(true);
        const loadedGame = await getSharedGame(gameId);
        
        if (loadedGame) {
          setGame(loadedGame);
          
          // Kiểm tra xem game có yêu cầu thông tin người chơi không
          const requireInfo = await checkPlayerInfoRequired(gameId);
          setRequirePlayerInfo(requireInfo);
          
          // Kiểm tra số người tham gia
          const loadedParticipants = await getGameParticipants(gameId);
          setParticipants(loadedParticipants);

          // Kiểm tra xem user đã đăng ký chưa
          const userId = localStorage.getItem(`game_participant_${gameId}`);
          if (userId) {
            const participant = loadedParticipants.find(p => p.id === userId);
            if (participant) {
              setHasRegistered(true);
              form.reset();
            }
          }
          
          // Kiểm tra xem game đã hết hạn chưa
          const expTime = new Date(loadedGame.expiresAt).getTime();
          const now = new Date().getTime();
          if (expTime < now) {
            setGameExpired(true);
          }
          
          // Kiểm tra game có tính năng admin không
          const adminSettings = await getGameAdminSettings(gameId);
          setHasAdminAccess(!!adminSettings);
        } else {
          toast({
            title: "Game không tồn tại",
            description: "Game này không tồn tại hoặc đã bị xóa",
            variant: "destructive"
          });
          navigate('/game-history');
        }
      } catch (error) {
        console.error("Error loading game:", error);
        toast({
          title: "Lỗi tải dữ liệu",
          description: "Không thể tải thông tin game",
          variant: "destructive"
        });
      } finally {
        setIsRegistering(false);
      }
    };
    
    loadGame();
  }, [gameId, navigate, toast]);
  
  const handleBack = () => {
    navigate('/game-history');
  };

  const goToAdminPanel = () => {
    navigate(`/game/${gameId}/admin`);
  };
  
  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}/game/${gameId}`;
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast({
          title: "Đã sao chép",
          description: "Đường dẫn đã được sao chép vào clipboard.",
        });
      })
      .catch(err => {
        console.error('Không thể sao chép liên kết:', err);
        toast({
          title: "Lỗi sao chép", 
          description: "Không thể sao chép liên kết.",
          variant: "destructive"
        });
      });
  };
  
  const handlePlayerSubmit = async (values: PlayerFormValues) => {
    if (!gameId || !game) return;
    
    try {
      // Khởi tạo dữ liệu người tham gia
      const newParticipant: Partial<GameParticipant> = {
        name: values.name,
        gameId,
        ipAddress: await getFakeIpAddress()
      };
      
      // Chỉ thêm tuổi nếu có và nếu yêu cầu thông tin người chơi
      if (requirePlayerInfo && values.age) {
        newParticipant.age = values.age;
      }
      
      // Thêm người tham gia vào database
      const participantId = await addParticipant(newParticipant);
      
      if (participantId) {
        // Lưu ID người tham gia vào localStorage
        localStorage.setItem(`game_participant_${gameId}`, participantId);
        
        // Cập nhật state
        setHasRegistered(true);
        setCurrentUser({
          id: participantId,
          ...newParticipant,
          timestamp: new Date().toISOString(),
          retryCount: 0
        } as GameParticipant);
        
        // Đóng dialog
        setShowNameDialog(false);
        
        toast({
          title: "Tham gia thành công",
          description: "Bạn đã tham gia trò chơi thành công",
        });
      } else {
        throw new Error("Không thể thêm người tham gia");
      }
    } catch (error) {
      console.error("Error adding participant:", error);
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi thêm người tham gia",
        variant: "destructive"
      });
    }
  };

  const handlePlayAnonymously = async () => {
    if (!gameId || !game) return;
    
    try {
      setIsRegistering(true);
      
      // Tạo tên ẩn danh ngẫu nhiên
      const anonymousName = `Người chơi ẩn danh #${Math.floor(Math.random() * 10000)}`;
      
      // Khởi tạo dữ liệu người tham gia ẩn danh
      const anonymousParticipant: Partial<GameParticipant> = {
        name: anonymousName,
        gameId,
        ipAddress: await getFakeIpAddress()
      };
      
      // Thêm người tham gia vào database
      const participantId = await addParticipant(anonymousParticipant);
      
      if (participantId) {
        // Lưu ID người tham gia vào localStorage
        localStorage.setItem(`game_participant_${gameId}`, participantId);
        
        // Cập nhật state
        setHasRegistered(true);
        setCurrentUser({
          id: participantId,
          ...anonymousParticipant,
          timestamp: new Date().toISOString(),
          retryCount: 0
        } as GameParticipant);
        
        // Đóng dialog
        setShowNameDialog(false);
        
        toast({
          title: "Tham gia thành công",
          description: "Bạn đã tham gia vào game này với tên ẩn danh!",
        });
      } else {
        throw new Error("Không thể thêm người tham gia");
      }
    } catch (error) {
      console.error("Lỗi khi tham gia game:", error);
      toast({
        title: "Lỗi hệ thống",
        description: "Đã xảy ra lỗi khi xử lý yêu cầu. Vui lòng thử lại.",
        variant: "destructive"
      });
    } finally {
      setIsRegistering(false);
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
  
  if (!game && !gameExpired) {
    return (
      <QuizContainer
        title="Đang tải game..."
        showBackButton={true}
        onBack={handleBack}
        className="p-0 overflow-hidden"
      >
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
            <p className="text-primary font-medium">Đang tải thông tin game...</p>
          </div>
        </div>
      </QuizContainer>
    );
  }
  
  if (gameExpired) {
    return (
      <QuizContainer
        title="Game không khả dụng"
        showBackButton={true}
        onBack={handleBack}
        className="p-0 overflow-hidden"
      >
        <div className="flex flex-col items-center justify-center h-full p-6 bg-gradient-to-b from-background to-background/80">
          <div className="p-8 bg-background/90 rounded-xl shadow-lg border border-primary/10 max-w-md w-full">
            <h2 className="text-xl font-bold text-center mb-4">Game đã hết hạn hoặc không tồn tại</h2>
            <p className="text-center mb-6 text-muted-foreground">Game này đã hết thời hạn hoặc không còn khả dụng.</p>
            <Button onClick={handleBack} className="w-full">Quay lại</Button>
          </div>
        </div>
      </QuizContainer>
    );
  }
  
  const shareUrl = `${window.location.origin}/game/${gameId}`;

  const joinGameButton = (
    <Button 
      size="sm" 
      variant="outline" 
      className="text-xs"
      onClick={() => setShowNameDialog(true)}
    >
      <Users className="h-3.5 w-3.5 mr-1" />
      {hasRegistered ? "Cập nhật thông tin" : "Tham gia"}
    </Button>
  );

  const adminButton = hasAdminAccess ? (
    <Button
      size="sm"
      variant="outline"
      className="text-xs ml-2"
      onClick={goToAdminPanel}
    >
      <Settings className="h-3.5 w-3.5 mr-1" />
      Quản trị
    </Button>
  ) : null;
  
  return (
    <QuizContainer
      title={game?.title || 'Game'}
      showBackButton={true}
      onBack={handleBack}
      className="p-0 overflow-hidden"
      headerRight={adminButton}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full">
        <div className="border-b px-4 py-2 flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="game">Game</TabsTrigger>
            <TabsTrigger value="share">Chia sẻ</TabsTrigger>
            <TabsTrigger value="participants">Người chơi ({participants.length})</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            <span>Còn lại: {game && getRemainingTime(game.expiresAt)}</span>
          </div>
        </div>
        
        <TabsContent value="game" className="h-[calc(100%-48px)] m-0">
          <EnhancedGameView 
            miniGame={{
              title: game.title,
              content: game.htmlContent
            }}
            onBack={handleBack}
            hideHeader={true}
            extraButton={!hasRegistered ? joinGameButton : undefined}
            gameExpired={gameExpired}
            gameId={gameId}
          />
        </TabsContent>
        
        <TabsContent value="share" className="h-[calc(100%-48px)] m-0 p-4 overflow-auto">
          <div className="max-w-md mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Chia sẻ game</CardTitle>
                <CardDescription>
                  Chia sẻ game này với bạn bè để họ có thể tham gia chơi
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center p-4 bg-white rounded-lg">
                  <QRCodeSVG value={shareUrl} size={200} />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="share-link">Liên kết chia sẻ</Label>
                  <div className="flex">
                    <Input 
                      id="share-link" 
                      value={shareUrl} 
                      readOnly 
                      className="rounded-r-none"
                    />
                    <Button 
                      variant="outline" 
                      className="rounded-l-none"
                      onClick={handleCopyLink}
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => setShowNameDialog(true)}
                >
                  <Users className="h-4 w-4 mr-2" />
                  {hasRegistered ? "Cập nhật thông tin" : "Tham gia game"}
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Thông tin game</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tiêu đề:</span>
                  <span className="font-medium">{game.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ngày tạo:</span>
                  <span>{formatDate(game.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hết hạn sau:</span>
                  <span>{getRemainingTime(game.expiresAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Số người tham gia:</span>
                  <span>{participants.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="participants" className="h-[calc(100%-48px)] m-0 p-4 overflow-auto">
          <div className="max-w-md mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Danh sách người chơi</CardTitle>
                <CardDescription>
                  {participants.length > 0 
                    ? `${participants.length} người đã tham gia game này` 
                    : 'Chưa có ai tham gia game này'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {participants.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Chưa có ai tham gia game này</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setShowNameDialog(true)}
                    >
                      Tham gia ngay
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {participants.map((participant, index) => (
                      <div 
                        key={participant.id}
                        className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50"
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium mr-3">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{participant.name}</p>
                            <p className="text-xs text-muted-foreground">
                              Tham gia: {formatDate(typeof participant.timestamp === 'string' 
                                ? new Date(participant.timestamp).getTime() 
                                : participant.timestamp)}
                            </p>
                          </div>
                        </div>
                        {participant.retryCount > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {participant.retryCount} lần thử lại
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => setShowNameDialog(true)}
                >
                  <Users className="h-4 w-4 mr-2" />
                  {hasRegistered ? "Cập nhật thông tin" : "Tham gia game"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      <Dialog open={showNameDialog} onOpenChange={setShowNameDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Nhập thông tin của bạn</DialogTitle>
            <DialogDescription>
              {requirePlayerInfo 
                ? "Vui lòng nhập tên và tuổi của bạn để tham gia trò chơi."
                : "Vui lòng nhập tên của bạn để tham gia trò chơi."}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handlePlayerSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên của bạn</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tên" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {requirePlayerInfo && (
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tuổi</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Nhập tuổi" 
                          {...field} 
                          onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <DialogFooter>
                <Button type="submit">Tham gia ngay</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </QuizContainer>
  );
};

export default GameSharePage;
