
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSharedGame, getRemainingTime, StoredGame, formatRemainingTime } from '@/utils/gameExport';
import { addParticipant, getFakeIpAddress, GameParticipant } from '@/utils/gameParticipation';
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
import { useToast } from '@/hooks/use-toast';

const SharedGame: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [game, setGame] = useState<StoredGame | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [participantName, setParticipantName] = useState('');
  const [showParticipantDialog, setShowParticipantDialog] = useState(false);
  const [participants, setParticipants] = useState<GameParticipant[]>([]);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    if (!gameId) {
      setError('Game ID is missing');
      setLoading(false);
      return;
    }
    
    try {
      const loadedGame = getSharedGame(gameId);
      if (!loadedGame) {
        setError('Game not found or has expired');
        setLoading(false);
        return;
      }
      
      setGame(loadedGame);
      
      // Get remaining time
      const timeLeft = getRemainingTime(loadedGame);
      setRemainingTime(timeLeft);
      
      // Set up timer to update remaining time
      const interval = setInterval(() => {
        const newTimeLeft = getRemainingTime(loadedGame);
        setRemainingTime(newTimeLeft);
        
        if (newTimeLeft <= 0) {
          clearInterval(interval);
          setError('This game has expired');
        }
      }, 60000); // Update every minute
      
      setLoading(false);
      
      return () => clearInterval(interval);
    } catch (err) {
      console.error('Error loading shared game:', err);
      setError('Failed to load game data');
      setLoading(false);
    }
  }, [gameId]);
  
  const handleAddParticipant = () => {
    if (!gameId || !participantName.trim()) return;
    
    const fakeIp = getFakeIpAddress();
    const result = addParticipant(gameId, participantName, fakeIp);
    
    if (result.success) {
      toast({
        title: 'Success',
        description: `${participantName} has joined the game!`,
      });
      setShowParticipantDialog(false);
      // Refresh participants list
      // fetchParticipants();
    } else {
      toast({
        title: 'Error',
        description: result.message || 'Failed to join the game',
        variant: 'destructive'
      });
    }
  };
  
  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}/game/${gameId}`;
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setCopied(true);
        toast({
          title: 'Link copied',
          description: 'The share link has been copied to clipboard',
        });
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Could not copy text: ', err);
        toast({
          title: 'Error',
          description: 'Failed to copy link to clipboard',
          variant: 'destructive'
        });
      });
  };
  
  const formatTimeRemaining = (milliseconds: number) => {
    if (milliseconds <= 0) return 'Expired';
    
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours} hours ${minutes} minutes`;
    }
    return `${minutes} minutes`;
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium">Loading shared game...</p>
        </div>
      </div>
    );
  }
  
  if (error || !game) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <Card className="max-w-md w-full p-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Unable to load game</CardTitle>
            <CardDescription className="text-muted-foreground">
              {error || 'The game could not be found or has expired.'}
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Return to Home
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-4 px-4 h-screen flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate(-1)}
          className="gap-1.5"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        
        <div className="flex items-center gap-2">
          {remainingTime !== null && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatRemainingTime(remainingTime)}
            </Badge>
          )}
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShareDialogOpen(true)}
            className="gap-1.5"
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto bg-background rounded-lg border p-4">
        <h1 className="text-2xl font-bold mb-4">{game.title}</h1>
        {game.description && (
          <p className="text-muted-foreground mb-4">{game.description}</p>
        )}
        
        <div 
          className="mt-4 game-content"
          dangerouslySetInnerHTML={{ __html: game.htmlContent }}
        />
      </div>
      
      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Game</DialogTitle>
            <DialogDescription>
              Share this game with others to play together
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center space-y-4 py-4">
            <div className="p-4 bg-white rounded-lg">
              <QRCodeSVG value={`${window.location.origin}/game/${gameId}`} size={200} />
            </div>
            
            <div className="w-full space-y-2">
              <Label htmlFor="share-link">Share Link</Label>
              <div className="flex">
                <Input 
                  id="share-link" 
                  value={`${window.location.origin}/game/${gameId}`} 
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
              onClick={() => setShowParticipantDialog(true)}
              className="w-full md:w-auto mt-4"
            >
              <Users className="h-4 w-4 mr-2" />
              Join as Player
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Join as Participant Dialog */}
      <Dialog open={showParticipantDialog} onOpenChange={setShowParticipantDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Join Game</DialogTitle>
            <DialogDescription>
              Enter your name to join this game
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Your Name</Label>
              <Input 
                id="name" 
                value={participantName} 
                onChange={(e) => setParticipantName(e.target.value)} 
                placeholder="Enter your name"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              onClick={handleAddParticipant}
              disabled={!participantName.trim()}
            >
              Join
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SharedGame;
