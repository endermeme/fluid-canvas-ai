import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, AlertCircle } from 'lucide-react';

interface GameNameFormProps {
  isOpen: boolean;
  onSubmit: (playerName: string) => void;
  onSkip?: () => void;
  onCancel: () => void;
  error?: string;
  isSubmitting?: boolean;
  gameTitle?: string;
}

export const GameNameForm: React.FC<GameNameFormProps> = ({
  isOpen,
  onSubmit,
  onSkip,
  onCancel,
  error,
  isSubmitting = false,
  gameTitle
}) => {
  const [playerName, setPlayerName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(playerName.trim());
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    }
  };

  const handleClose = () => {
    setPlayerName('');
    onCancel();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Tham gia game
          </DialogTitle>
          {gameTitle && (
            <DialogDescription>
              Vui lòng nhập tên để tham gia game "{gameTitle}"
            </DialogDescription>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="playerName">Tên của bạn:</Label>
            <Input
              id="playerName"
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Nhập tên của bạn"
              disabled={isSubmitting}
              autoFocus
              className="focus:ring-2 focus:ring-primary"
              minLength={2}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Hủy
            </Button>
            
            {onSkip && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleSkip}
                disabled={isSubmitting}
                className="flex-1"
              >
                Bỏ qua
              </Button>
            )}
            
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Đang xử lý...' : (playerName.trim() ? 'Tham gia game' : 'Tham gia với tên tự động')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};