import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, UserPlus, Eye, Clock, Users, LinkIcon } from 'lucide-react';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { getGameById, addParticipant, getFakeIpAddress } from '@/services/storage';
import { loadGameFromVps } from '@/services/vpsStorage';
import GameShareButtons from './GameShareButtons';

// Form schema
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Tên phải có ít nhất 2 ký tự.",
  }),
});

const ShareGamePage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const [game, setGame] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasJoined, setHasJoined] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Đang kết nối tới server...");
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (!gameId) {
      navigate('/preset-games');
      return;
    }
    
    const loadGame = async () => {
      setLoading(true);
      setLoadingMessage("Đang kết nối tới server...");
      
      try {
        // Thử tải từ VPS trước
        setLoadingMessage("Đang tải game từ server...");
        const vpsResponse = await loadGameFromVps(gameId);
        
        if (vpsResponse.success && vpsResponse.data.game) {
          setGame(vpsResponse.data.game);
          toast({
            title: "Tải game thành công",
            description: "Game đã được tải từ server.",
          });
        } else {
          // Nếu không tìm thấy trên VPS, thử tải từ bộ nhớ cục bộ
          setLoadingMessage("Đang tìm kiếm trong bộ nhớ cục bộ...");
          const localGame = getGameById(gameId);
          
          if (localGame) {
            setGame(localGame);
            toast({
              title: "Tải game thành công",
              description: "Game đã được tải từ bộ nhớ cục bộ.",
            });
          } else {
            toast({
              title: "Game không tồn tại",
              description: "Game này không tồn tại hoặc đã bị xóa.",
              variant: "destructive",
            });
            navigate('/preset-games');
          }
        }
      } catch (error) {
        console.error("Error loading game:", error);
        toast({
          title: "Lỗi tải game",
          description: "Có lỗi xảy ra khi tải game. Vui lòng thử lại sau.",
          variant: "destructive",
        });
        navigate('/preset-games');
      } finally {
        setLoading(false);
      }
    };
    
    loadGame();
  }, [gameId, navigate, toast]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!gameId || !game) return;
    
    // Lấy thông tin thiết bị người dùng
    const deviceInfo = {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      screenSize: `${window.screen.width}x${window.screen.height}`
    };
    
    // Simulate IP address (in a real app, this would come from the server)
    const fakeIp = getFakeIpAddress();
    
    const result = addParticipant(gameId, values.name, fakeIp, deviceInfo);
    
    if (result.success) {
      toast({
        title: "Tham gia thành công!",
        description: `Chào mừng ${values.name} tham gia game.`,
      });
      setHasJoined(true);
    } else {
      toast({
        title: "Không thể tham gia",
        description: result.message,
        variant: "destructive",
      });
      
      // If they've retried too many times but we want to let them in anyway
      if (result.participant && result.participant.retryCount <= 2) {
        setHasJoined(true);
      }
    }
  };

  const viewDashboard = () => {
    navigate(`/game/${gameId}/dashboard`);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4 bg-gradient-to-b from-background to-background/80 p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="text-lg">{loadingMessage}</p>
        <p className="text-sm text-muted-foreground animate-pulse">Đang kết nối tới máy chủ VPS...</p>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-6 p-4 bg-gradient-to-b from-background to-background/80">
        <h1 className="text-2xl font-bold">Game không tồn tại</h1>
        <p className="text-muted-foreground text-center max-w-md">
          Game này có thể đã bị xóa hoặc link không hợp lệ. Vui lòng kiểm tra lại link của bạn.
        </p>
        <Button onClick={() => navigate('/preset-games')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
      </div>
    );
  }

  if (hasJoined) {
    return (
      <div className="flex-1 relative w-full h-full overflow-hidden">
        <iframe
          srcDoc={game.htmlContent}
          className="w-full h-screen border-0 mx-auto"
          sandbox="allow-scripts allow-popups allow-same-origin"
          title={game.title}
          style={{ maxWidth: '100%', height: '100%', margin: '0 auto' }}
        />
        
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-20">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/preset-games')} 
            className="flex items-center gap-1 bg-background/80 hover:bg-background/90 backdrop-blur-sm shadow-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Quay lại</span>
          </Button>
          
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={viewDashboard}
              className="flex items-center gap-1 bg-background/80 hover:bg-background/90 backdrop-blur-sm shadow-sm"
            >
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">Thống kê</span>
            </Button>
            
            <GameShareButtons
              gameId={gameId}
              shareUrl={game.shareUrl || `https://ai-games-vn.com/share/${gameId}`}
              title={game.title}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-background to-background/80">
      <div className="w-full max-w-md space-y-6 p-6 bg-background/90 backdrop-blur-sm rounded-xl border border-primary/20 shadow-xl">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">{game.title}</h1>
          <p className="text-sm text-muted-foreground">
            Vui lòng nhập tên của bạn để tham gia game
          </p>
        </div>
        
        <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{new Date(game.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>{game.participants?.length || 0} người tham gia</span>
          </div>
          <div className="flex items-center">
            <LinkIcon className="h-4 w-4 mr-1" />
            <span>{game.viewCount || 0} lượt xem</span>
          </div>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên của bạn</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Nhập tên của bạn" 
                      {...field} 
                      className="bg-background"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full" size="lg">
              <UserPlus className="mr-2 h-4 w-4" />
              Tham gia game
            </Button>
          </form>
        </Form>
        
        <div className="text-center pt-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={viewDashboard}
            className="text-xs"
          >
            <Eye className="mr-1 h-3 w-3" />
            Xem thống kê
          </Button>
        </div>
      </div>
      
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => navigate('/preset-games')} 
        className="mt-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Quay lại
      </Button>
    </div>
  );
};

export default ShareGamePage;
