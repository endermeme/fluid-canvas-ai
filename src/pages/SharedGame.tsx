import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSharedGame, getRemainingTime, StoredGame } from '@/utils/gameExport';
import { addParticipant, getFakeIpAddress, GameParticipant } from '@/utils/gameParticipation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, AlertTriangle, Plus, Users, Share2, Copy, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { QRCodeSVG } from 'qrcode.react';

const SharedGame = () => {
  const { id } = useParams<{ id: string }>();
  const [game, setGame] = useState<StoredGame | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState('');
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [participants, setParticipants] = useState<GameParticipant[]>([]);
  const [copied, setCopied] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      setError('ID trò chơi không hợp lệ');
      setLoading(false);
      return;
    }

    const loadGame = () => {
      const loadedGame = getSharedGame(id);
      setGame(loadedGame);
      
      if (loadedGame) {
        setTimeLeft(getRemainingTime(loadedGame.expiresAt));
        
        // Load participants if available
        const sessionsJson = localStorage.getItem('game_sessions');
        if (sessionsJson) {
          const sessions = JSON.parse(sessionsJson);
          const session = sessions.find((s: any) => s.id === id);
          if (session && session.participants) {
            setParticipants(session.participants);
          }
        }
      } else {
        setError('Trò chơi không tồn tại hoặc đã hết hạn');
      }
      
      setLoading(false);
    };

    loadGame();
    
    // Update remaining time every minute
    const intervalId = setInterval(() => {
      if (game) {
        setTimeLeft(getRemainingTime(game.expiresAt));
      }
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, [id, game]);

  const handleCreateNewGame = () => {
    navigate('/');
  };
  
  const handleJoinGame = () => {
    if (!playerName.trim() || !id) return;
    
    const ipAddress = getFakeIpAddress();
    const result = addParticipant(id, playerName, ipAddress);
    
    if (result.success && result.participant) {
      setParticipants(prev => [...prev, result.participant]);
      setShowNameDialog(false);
    } else if (result.participant) {
      // Already participated, just update the list
      setParticipants(prev => 
        prev.map(p => p.id === result.participant?.id ? result.participant : p)
      );
      setShowNameDialog(false);
    }
  };
  
  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}/game/${id}`;
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Không thể sao chép liên kết:', err);
      });
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
        <p className="text-lg">Đang tải trò chơi...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-6 p-4">
        <AlertTriangle className="text-destructive h-16 w-16" />
        <h1 className="text-2xl font-bold">{error}</h1>
        <p className="text-muted-foreground text-center max-w-md">
          Liên kết này có thể đã hết hạn hoặc không tồn tại. Trò chơi chỉ có hiệu lực trong 48 giờ.
        </p>
        <Button onClick={() => navigate('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại màn hình chính
        </Button>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-6 p-4">
        <AlertTriangle className="text-destructive h-16 w-16" />
        <h1 className="text-2xl font-bold">Trò chơi không tìm thấy</h1>
        <Button onClick={() => navigate('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Tạo trò chơi mới
        </Button>
      </div>
    );
  }

  // Enhanced content with proper styling
  const enhancedContent = enhanceIframeContent(game.htmlContent);
  const shareUrl = `${window.location.origin}/game/${id}`;

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <header className="bg-background/80 backdrop-blur-sm p-2 flex justify-between items-center z-10">
        <Button variant="outline" size="sm" onClick={() => navigate('/')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            <span>Còn lại: {timeLeft}</span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="h-4 w-4 mr-1" />
            <span>{participants.length} người tham gia</span>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowNameDialog(true)}
          >
            <Users className="h-4 w-4 mr-2" />
            Tham gia
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowShareDialog(true)}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Chia sẻ
          </Button>
        </div>
      </header>
      
      <main className="flex-1 overflow-hidden w-full h-full">
        <iframe
          srcDoc={enhancedContent}
          sandbox="allow-scripts allow-same-origin"
          className="w-full h-full"
          style={{ 
            border: 'none',
            margin: 0,
            padding: 0,
            width: '100%',
            height: '100%',
            display: 'block'
          }}
        />
      </main>

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
      
      {/* Dialog for sharing game */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Chia sẻ game</DialogTitle>
            <DialogDescription>
              Chia sẻ game này với bạn bè để họ có thể tham gia chơi
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
    </div>
  );
};

export default SharedGame;
