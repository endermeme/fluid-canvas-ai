
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSharedGame, getRemainingTime, StoredGame } from '@/utils/gameExport';
import { addParticipant, getFakeIpAddress, GameParticipant } from '@/utils/gameParticipation';
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
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { QRCodeSVG } from 'qrcode.react';
import { useToast } from '@/hooks/use-toast';

const SharedGame: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [game, setGame] = useState<StoredGame | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joinOpen, setJoinOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [participants, setParticipants] = useState<GameParticipant[]>([]);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  
  useEffect(() => {
    if (!id) {
      setError('No game ID provided');
      setLoading(false);
      return;
    }
    
    try {
      const sharedGame = getSharedGame(id);
      if (!sharedGame) {
        setError('Game not found or has expired');
        setLoading(false);
        return;
      }
      
      setGame(sharedGame);
      
      // Check remaining time
      const remaining = getRemainingTime(sharedGame);
      setRemainingTime(remaining);
      
      // Set up timer to update remaining time
      const interval = setInterval(() => {
        const newRemaining = getRemainingTime(sharedGame);
        setRemainingTime(newRemaining);
        
        if (newRemaining <= 0) {
          clearInterval(interval);
          setError('This game has expired');
        }
      }, 60000); // Update every minute
      
      setLoading(false);
      
      return () => clearInterval(interval);
    } catch (err) {
      console.error('Error loading shared game:', err);
      setError('Failed to load game');
      setLoading(false);
    }
  }, [id]);
  
  const handleJoin = () => {
    if (!id || !userName.trim()) return;
    
    const fakeIp = getFakeIpAddress();
    const result = addParticipant(id, userName, fakeIp);
    
    if (result.success) {
      toast({
        title: 'Tham gia thành công',
        description: `Chào mừng ${userName} đến với trò chơi!`,
      });
      setJoinOpen(false);
      // Reload participants
      // loadParticipants();
    } else {
      toast({
        title: 'Không thể tham gia',
        description: result.message,
        variant: 'destructive',
      });
    }
  };
  
  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}/quiz/shared/${id}`;
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setCopied(true);
        toast({
          title: 'Đã sao chép',
          description: 'Liên kết đã được sao chép vào clipboard',
        });
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Could not copy text: ', err);
        toast({
          title: 'Lỗi sao chép',
          description: 'Không thể sao chép liên kết',
          variant: 'destructive',
        });
      });
  };
  
  const formatTimeRemaining = (milliseconds: number) => {
    if (milliseconds <= 0) return 'Hết hạn';
    
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours} giờ ${minutes} phút`;
    }
    return `${minutes} phút`;
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium">Đang tải trò chơi...</p>
        </div>
      </div>
    );
  }
  
  if (error || !game) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <Card className="max-w-md w-full p-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Không thể tải trò chơi</CardTitle>
            <CardDescription className="text-muted-foreground">
              {error || 'Trò chơi không tồn tại hoặc đã hết hạn.'}
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại trang chủ
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4 min-h-screen flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
        
        <div className="flex items-center gap-2">
          {remainingTime !== null && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatTimeRemaining(remainingTime)}
            </Badge>
          )}
        </div>
      </div>
      
      <Card className="mx-auto max-w-4xl w-full mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">{game.title}</CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCopyLink}
              className="flex items-center gap-1"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Đã sao chép' : 'Sao chép link'}
            </Button>
          </div>
          <CardDescription>{game.description}</CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="game">
            <TabsList className="mb-4">
              <TabsTrigger value="game">Trò chơi</TabsTrigger>
              <TabsTrigger value="share">Chia sẻ</TabsTrigger>
            </TabsList>
            
            <TabsContent value="game">
              <div 
                className="bg-card rounded-md p-4 min-h-[300px] border"
                dangerouslySetInnerHTML={{ __html: game.htmlContent }}
              />
            </TabsContent>
            
            <TabsContent value="share">
              <div className="flex flex-col items-center space-y-4 py-4">
                <div className="p-4 bg-white rounded-lg">
                  <QRCodeSVG 
                    value={`${window.location.origin}/quiz/shared/${id}`} 
                    size={200}
                  />
                </div>
                
                <div className="w-full space-y-2">
                  <Label htmlFor="share-link">Liên kết chia sẻ</Label>
                  <div className="flex">
                    <Input 
                      id="share-link" 
                      value={`${window.location.origin}/quiz/shared/${id}`} 
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
                
                <Button
                  onClick={() => setJoinOpen(true)}
                  className="w-full md:w-auto mt-4"
                >
                  Tham gia trò chơi
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Dialog open={joinOpen} onOpenChange={setJoinOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tham gia trò chơi</DialogTitle>
            <DialogDescription>
              Nhập tên của bạn để tham gia trò chơi này.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Tên của bạn</Label>
              <Input 
                id="name" 
                value={userName} 
                onChange={(e) => setUserName(e.target.value)} 
                placeholder="Nhập tên của bạn"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              onClick={handleJoin}
              disabled={!userName.trim()}
            >
              Tham gia
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SharedGame;
