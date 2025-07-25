import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, AlertCircle, Users } from 'lucide-react';

interface GamePasswordFormProps {
  isOpen: boolean;
  onSubmit: (password: string, playerName: string) => void;
  onCancel: () => void;
  error?: string;
  isVerifying?: boolean;
  gameTitle?: string;
}

export const GamePasswordForm: React.FC<GamePasswordFormProps> = ({
  isOpen,
  onSubmit,
  onCancel,
  error,
  isVerifying = false,
  gameTitle
}) => {
  const [password, setPassword] = useState('');
  const [playerName, setPlayerName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim() && playerName.trim()) {
      onSubmit(password.trim(), playerName.trim());
    }
  };

  const handleClose = () => {
    setPassword('');
    setPlayerName('');
    onCancel();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Game được bảo vệ
          </DialogTitle>
          {gameTitle && (
            <DialogDescription>
              Vui lòng nhập mật khẩu và tên để tham gia game "{gameTitle}"
            </DialogDescription>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Mật khẩu game:</Label>
            <Input
              id="password"
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              disabled={isVerifying}
              autoFocus
              className="focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="playerName">Tên của bạn:</Label>
            <Input
              id="playerName"
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Nhập tên của bạn"
              disabled={isVerifying}
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
              disabled={isVerifying}
              className="flex-1"
            >
              Hủy
            </Button>
            <Button 
              type="submit" 
              disabled={!password.trim() || !playerName.trim() || isVerifying}
              className="flex-1"
            >
              {isVerifying ? 'Đang kiểm tra...' : 'Tham gia game'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};