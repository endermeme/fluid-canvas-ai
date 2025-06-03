import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getSharedGame, getRemainingTime } from '@/utils/gameExport';
import { addParticipant, getFakeIpAddress, getGameParticipants } from '@/utils/gameParticipation';
import { StoredGame, GameParticipant } from '@/utils/types';
import QuizContainer from '@/components/quiz/QuizContainer';
import EnhancedGameView from '@/components/quiz/custom-games/EnhancedGameView';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Share2, Users, Clock, Copy, Check } from 'lucide-react';
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

// Định nghĩa schema validation cho form đăng ký
const playerFormSchema = z.object({
  playerName: z.string().min(2, {
    message: "Tên phải có ít nhất 2 ký tự",
  }),
  playerAge: z.string().refine((val) => {
    const age = parseInt(val, 10);
    return !isNaN(age) && age >= 6 && age <= 100;
  }, {
    message: "Tuổi phải từ 6 đến 100",
  })
});

type PlayerFormValues = z.infer<typeof playerFormSchema>;

const GameSharePage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const [game, setGame] = useState<StoredGame | null>(null);
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [hasRegistered, setHasRegistered] = useState(false);
  const [participants, setParticipants] = useState<GameParticipant[]>([]);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('game');
  const [gameExpired, setGameExpired] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<PlayerFormValues>({
    resolver: zodResolver(playerFormSchema),
    defaultValues: {
      playerName: "",
      playerAge: ""
    },
  });
  
  // Hàm để refresh danh sách người tham gia
  const refreshParticipants = async () => {
    if (!gameId) return;
    
    try {
      const updatedParticipants = await getGameParticipants(gameId);
      setParticipants(updatedParticipants);
    } catch (error) {
      console.error("Error refreshing participants:", error);
      // Fallback: đọc từ localStorage
      const sessionsJson = localStorage.getItem('game_sessions');
      if (sessionsJson) {
        const sessions = JSON.parse(sessionsJson);
        const session = sessions.find((s: any) => s.id === gameId);
        if (session && session.participants) {
          setParticipants(session.participants);
        }
      }
    }
  };
  
  useEffect(() => {
    const loadGame = async () => {
      if (gameId) {
        try {
          const loadedGame = await getSharedGame(gameId);
          
          if (loadedGame) {
            const completeGame: StoredGame = {
              ...loadedGame,
              description: loadedGame.description || `Shared game: ${loadedGame.title}`
            };
            setGame(completeGame);
            
            // Kiểm tra game có hết hạn chưa
            if (loadedGame.expiresAt) {
              const expiryTime = new Date(loadedGame.expiresAt).getTime();
              if (expiryTime < Date.now()) {
                setGameExpired(true);
              }
            }
            
            // Load danh sách người tham gia
            await refreshParticipants();
            
            // Kiểm tra xem người chơi đã đăng ký chưa
            const registeredGamesStr = localStorage.getItem('registered_games');
            if (registeredGamesStr) {
              const registeredGames = JSON.parse(registeredGamesStr);
              if (registeredGames.includes(gameId)) {
                setHasRegistered(true);
              } else {
                // Hiển thị dialog đăng ký ngay
                setShowNameDialog(true);
              }
            } else {
              setShowNameDialog(true);
            }
          } else {
            setGameExpired(true);
          }
        } catch (error) {
          console.error("Không thể tải game:", error);
          setGameExpired(true);
        }
      }
    };
    
    loadGame();
  }, [gameId]);

  // Auto refresh participants mỗi 10 giây
  useEffect(() => {
    if (!gameId || gameExpired) return;
    
    const interval = setInterval(() => {
      refreshParticipants();
    }, 10000); // 10 giây
    
    return () => clearInterval(interval);
  }, [gameId, gameExpired]);
  
  const handleBack = () => {
    navigate('/game-history');
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
  
  const handleJoinGame = async (values: PlayerFormValues) => {
    if (!gameId || !game || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const fakeIp = getFakeIpAddress();
      
      // Thử thêm vào Supabase trước
      const result = await addParticipant(gameId, `${values.playerName} (${values.playerAge} tuổi)`, fakeIp);
      
      if (result.success) {
        // Cập nhật danh sách participants ngay lập tức
        if (result.participant) {
          setParticipants(prev => {
            // Kiểm tra xem participant đã tồn tại chưa để tránh duplicate
            const exists = prev.some(p => p.id === result.participant?.id);
            if (!exists) {
              return [...prev, result.participant];
            }
            return prev;
          });
        }
        
        // Đóng dialog và reset form
        setShowNameDialog(false);
        setHasRegistered(true);
        form.reset();
        
        // Lưu game ID vào danh sách đã đăng ký
        const registeredGamesStr = localStorage.getItem('registered_games');
        let registeredGames = registeredGamesStr ? JSON.parse(registeredGamesStr) : [];
        if (!registeredGames.includes(gameId)) {
          registeredGames.push(gameId);
          localStorage.setItem('registered_games', JSON.stringify(registeredGames));
        }
        
        toast({
          title: "Tham gia thành công! 🎉",
          description: "Bạn đã được thêm vào danh sách người chơi.",
        });
        
        // Refresh participants sau 1 giây để đảm bảo sync
        setTimeout(() => {
          refreshParticipants();
        }, 1000);
        
      } else {
        // Fallback: Lưu vào localStorage khi Supabase fail
        console.log("Supabase failed, using localStorage fallback");
        
        const newParticipant: GameParticipant = {
          id: crypto.randomUUID(),
          name: `${values.playerName} (${values.playerAge} tuổi)`,
          ipAddress: fakeIp,
          timestamp: Date.now(),
          gameId: gameId,
          retryCount: 0,
          score: 0
        };
        
        // Lưu vào localStorage
        const sessionsJson = localStorage.getItem('game_sessions');
        const sessions = sessionsJson ? JSON.parse(sessionsJson) : [];
        
        let sessionIndex = sessions.findIndex((s: any) => s.id === gameId);
        if (sessionIndex >= 0) {
          if (!sessions[sessionIndex].participants) {
            sessions[sessionIndex].participants = [];
          }
          sessions[sessionIndex].participants.push(newParticipant);
        } else {
          sessions.push({
            id: gameId,
            participants: [newParticipant]
          });
        }
        
        localStorage.setItem('game_sessions', JSON.stringify(sessions));
        
        setParticipants(prev => [...prev, newParticipant]);
        
        // Đóng dialog và reset form
        setShowNameDialog(false);
        setHasRegistered(true);
        form.reset();
        
        // Lưu game ID vào danh sách đã đăng ký
        const registeredGamesStr = localStorage.getItem('registered_games');
        let registeredGames = registeredGamesStr ? JSON.parse(registeredGamesStr) : [];
        if (!registeredGames.includes(gameId)) {
          registeredGames.push(gameId);
          localStorage.setItem('registered_games', JSON.stringify(registeredGames));
        }
        
        toast({
          title: "Tham gia thành công! 🎉",
          description: "Bạn đã được thêm vào danh sách người chơi (dữ liệu lưu cục bộ).",
        });
      }
    } catch (error) {
      console.error("Lỗi khi tham gia game:", error);
      toast({
        title: "Lỗi hệ thống",
        description: "Đã xảy ra lỗi khi xử lý yêu cầu. Vui lòng thử lại.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
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
      disabled={isSubmitting}
    >
      <Users className="h-3.5 w-3.5 mr-1" />
      {hasRegistered ? "Cập nhật thông tin" : "Tham gia"}
    </Button>
  );
  
  return (
    <QuizContainer
      title={game.title}
      showBackButton={true}
      onBack={handleBack}
      className="p-0 overflow-hidden"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full">
        <div className="border-b px-4 py-2 flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="game">Game</TabsTrigger>
            <TabsTrigger value="share">Chia sẻ</TabsTrigger>
            <TabsTrigger value="participants">
              Người chơi ({participants.length})
              {participants.length > 0 && (
                <span className="ml-1 text-green-500">●</span>
              )}
            </TabsTrigger>
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
                  disabled={isSubmitting}
                >
                  <Users className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Đang xử lý..." : (hasRegistered ? "Cập nhật thông tin" : "Tham gia game")}
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
                <CardTitle className="flex items-center justify-between">
                  Danh sách người chơi
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={refreshParticipants}
                    className="text-xs"
                  >
                    🔄 Làm mới
                  </Button>
                </CardTitle>
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
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Đang xử lý..." : "Tham gia ngay"}
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
                  disabled={isSubmitting}
                >
                  <Users className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Đang xử lý..." : (hasRegistered ? "Cập nhật thông tin" : "Tham gia game")}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      <Dialog open={showNameDialog} onOpenChange={(open) => !isSubmitting && setShowNameDialog(open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tham gia game</DialogTitle>
            <DialogDescription>
              Vui lòng nhập thông tin để tham gia game "{game.title}"
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleJoinGame)} className="space-y-4">
              <FormField
                control={form.control}
                name="playerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên của bạn</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nhập tên của bạn" disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="playerAge"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tuổi</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min="6" max="100" placeholder="Nhập tuổi của bạn" disabled={isSubmitting} />
                    </FormControl>
                    <FormDescription>
                      Thông tin này chỉ dùng cho mục đích thống kê
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="mt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowNameDialog(false)}
                  disabled={isSubmitting}
                >
                  Hủy
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Đang xử lý..." : (hasRegistered ? "Cập nhật" : "Tham gia")}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </QuizContainer>
  );
};

export default GameSharePage;
