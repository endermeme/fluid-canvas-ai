import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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

import QuizContainer from '@/components/quiz/QuizContainer';
import EnhancedGameView from '@/components/quiz/custom-games/EnhancedGameView';
import { createGameSession } from '@/utils/gameParticipation';
import { useToast } from '@/hooks/use-toast';

interface CustomGameContainerProps {
  title?: string;
  content?: string;
}

const CustomGameContainer: React.FC<CustomGameContainerProps> = ({ title = "Minigame Tương Tác", content = "" }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('game');
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleBack = () => {
    navigate('/');
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Không thể sao chép liên kết:', err);
      });
  };
  
  const handleShareGame = async () => {
    if (!miniGame) return;
    
    try {
      const gameSession = await createGameSession(
        miniGame.title || "Minigame tương tác",
        miniGame.content
      );
      
      navigate(`/game/${gameSession.id}`);
      
      toast({
        title: "Game đã được chia sẻ",
        description: "Bạn có thể gửi link cho người khác để họ tham gia.",
      });
    } catch (error) {
      console.error("Error sharing game:", error);
    }
  };
  
  const [miniGame] = useState({
    title: title,
    content: content
  });
  
  return (
    <QuizContainer
      title={miniGame.title}
      showBackButton={true}
      onBack={handleBack}
      className="p-0 overflow-hidden"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full">
        <div className="border-b px-4 py-2 flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="game">Game</TabsTrigger>
            <TabsTrigger value="share">Chia sẻ</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="game" className="h-[calc(100%-48px)] m-0">
          <EnhancedGameView 
            miniGame={{
              title: miniGame.title,
              content: miniGame.content
            }}
            onBack={handleBack}
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
                <Button className="w-full">
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
                  <span className="font-medium">{miniGame.title}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Dialog for entering player name */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Chia sẻ game</DialogTitle>
            <DialogDescription>
              Sao chép hoặc quét mã QR để chia sẻ game này với bạn bè
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4 py-4">
            <div className="p-4 bg-white rounded-lg">
              <QRCodeSVG value={shareUrl} size={200} />
            </div>
            
            <div className="w-full space-y-2">
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
          </div>
          <DialogFooter>
            <Button onClick={() => setShowShareDialog(false)}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </QuizContainer>
  );
};

export default CustomGameContainer;
