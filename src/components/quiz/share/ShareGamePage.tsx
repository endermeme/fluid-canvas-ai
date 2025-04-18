import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { getGameSession, addParticipant, getFakeIpAddress } from '@/utils/gameParticipation';
import { ArrowLeft, UserPlus, Eye } from 'lucide-react';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

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
      const gameSession = await getGameSession(gameId);
      if (gameSession) {
        setGame(gameSession);
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
    
    loadGame();
  }, [gameId, navigate, toast]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!gameId || !game) return;
    
    // Simulate IP address (in a real app, this would come from the server)
    const fakeIp = getFakeIpAddress();
    
    try {
      const result = await addParticipant(gameId, values.name, fakeIp);
      
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
    } catch (error) {
      console.error("Error joining game:", error);
      toast({
        title: "Lỗi",
        description: "Đã xảy ra lỗi khi tham gia game.",
        variant: "destructive",
      });
    }
  };

  const viewDashboard = () => {
    navigate(`/game/${gameId}/dashboard`);
  };

  // Enhanced function to properly prepare the content
  const enhanceIframeContent = (content: string): string => {
    // Remove any existing style tags to prevent conflicts
    let processedContent = content;
    
    // Add our new style definitions - maximizing display area
    const fullDisplayStyles = `
      <style>
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
          height: 100% !important;
          overflow: hidden !important;
        }
        
        *, *::before, *::after {
          box-sizing: border-box !important;
        }
        
        body > div, main, #root, #app, .container, .game-container, #game, .game {
          width: 100% !important;
          height: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          overflow: auto !important;
          display: flex !important;
          flex-direction: column !important;
        }
        
        canvas {
          display: block !important;
          max-width: 100% !important;
          max-height: 100% !important;
          margin: 0 auto !important;
          object-fit: contain !important;
        }
        
        pre, code {
          white-space: pre-wrap !important;
          word-break: break-word !important;
          max-width: 100% !important;
          margin: 0 !important;
          padding: 8px !important;
          background: rgba(0,0,0,0.05) !important;
          border-radius: 4px !important;
        }
      </style>
    `;
    
    // Insert our styles at the beginning of head or create a head if none exists
    if (processedContent.includes('<head>')) {
      processedContent = processedContent.replace('<head>', `<head>${fullDisplayStyles}`);
    } else if (processedContent.includes('<html>')) {
      processedContent = processedContent.replace('<html>', `<html><head>${fullDisplayStyles}</head>`);
    } else {
      // If no html structure, add complete html wrapper
      processedContent = `<!DOCTYPE html><html><head>${fullDisplayStyles}</head><body>${processedContent}</body></html>`;
    }
    
    return processedContent;
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
      <div className="flex flex-col items-center justify-center h-screen space-y-6 p-4">
        <h1 className="text-2xl font-bold">Game không tồn tại</h1>
        <Button onClick={() => navigate('/preset-games')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
      </div>
    );
  }

  if (hasJoined) {
    // Enhanced content with proper styling
    const enhancedContent = enhanceIframeContent(game.htmlContent);
    
    return (
      <div className="flex-1 relative w-full h-screen overflow-hidden">
        <iframe
          srcDoc={enhancedContent}
          className="w-full h-full"
          sandbox="allow-scripts allow-popups allow-same-origin"
          title={game.title}
          style={{ 
            border: 'none',
            margin: 0,
            padding: 0,
            width: '100%',
            height: '100%',
            display: 'block'
          }}
        />
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/preset-games')} 
          className="absolute top-4 left-4 z-20 flex items-center gap-1 bg-background/70 hover:bg-background/80 backdrop-blur-sm shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Quay lại</span>
        </Button>
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
