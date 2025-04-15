import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getSharedGame, getRemainingTime } from '@/utils/gameExport';
import { addParticipant, getFakeIpAddress } from '@/utils/gameParticipation';
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

const GameSharePage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const [game, setGame] = useState<StoredGame | null>(null);
  const [playerName, setPlayerName] = useState('');
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [participants, setParticipants] = useState<GameParticipant[]>([]);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('game');
  
  useEffect(() => {
    const loadGame = async () => {
      if (gameId) {
        const loadedGame = await getSharedGame(gameId);
        setGame(loadedGame);
        
        // Load participants if available
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
    
    loadGame();
  }, [gameId]);
  
  const handleBack = () => {
    navigate('/game-history');
  };
  
  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}/game/${gameId}`;
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Không thể sao chép liên kết:', err);
      });
  };
  
  const handleJoinGame = async () => {
    if (!playerName.trim() || !gameId || !game) return;
    
    // Simulate IP address (in a real app, this would come from the server)
    const fakeIp = getFakeIpAddress();
    
    const result = await addParticipant(gameId, playerName, fakeIp);
    
    if (result.success) {
      setParticipants(prev => result.participant ? [...prev, result.participant] : prev);
      setShowNameDialog(false);
    } else if (result.participant) {
      // Already participated, just update the list
      setParticipants(prev => 
        prev.map(p => p.id === result.participant?.id ? result.participant : p)
      );
      setShowNameDialog(false);
    }
  };
  
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  if (!game) {
    return (
      <QuizContainer
        title="Game không tồn tại"
        showBackButton={true}
        onBack={handleBack}
        className="p-0 overflow-hidden"
      >
        <div className="flex flex-col items-center justify-center h-full p-6 bg-gradient-to-b from-background to-background/80">
          <div className="p-8 bg-background/90 rounded-xl shadow-lg border border-primary/10 max-w-md w-full">
            <p className="text-center mb-6 text-muted-foreground">Game đã hết hạn hoặc không tồn tại.</p>
            <Button onClick={handleBack} className="w-full">Quay lại</Button>
          </div>
        </div>
      </QuizContainer>
    );
  }
  
  const shareUrl = `${window.location.origin}/game/${gameId}`;
  
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
            <TabsTrigger value="participants">Người tham gia ({participants.length})</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            <span>Còn lại: {getRemainingTime(game.expiresAt)}</span>
          </div>
        </div>
        
        <TabsContent value="game" className="h-[calc(100%-48px)] m-0">
          <EnhancedGameView 
            miniGame={{
              title: game.title,
              content: game.htmlContent
            }}
            onBack={handleBack}
            extraButton={
              <Button 
                size="sm" 
                variant="outline" 
                className="text-xs"
                onClick={() => setShowNameDialog(true)}
              >
                <Users className="h-3.5 w-3.5 mr-1" />
                Tham gia
              </Button>
            }
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
                  Tham gia game
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
                <CardTitle>Danh sách người tham gia</CardTitle>
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
                  Tham gia game
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Dialog for entering player name */}
      <Dialog open={showNameDialog} onOpenChange={setShowNameDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tham gia game</DialogTitle>
            <DialogDescription>
              Nhập tên của bạn để tham gia game "{game.title}"
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="player-name">Tên của bạn</Label>
            <Input 
              id="player-name" 
              value={playerName} 
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Nhập tên của bạn"
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNameDialog(false)}>
              Hủy
            </Button>
            <Button onClick={handleJoinGame} disabled={!playerName.trim()}>
              Tham gia
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </QuizContainer>
  );
};

export default GameSharePage;
