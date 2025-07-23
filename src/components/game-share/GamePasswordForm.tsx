import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, AlertCircle } from 'lucide-react';

interface GamePasswordFormProps {
  isOpen: boolean;
  onSubmit: (password: string) => void;
  onCancel: () => void;
  error?: string;
  isVerifying?: boolean;
}

export const GamePasswordForm: React.FC<GamePasswordFormProps> = ({
  isOpen,
  onSubmit,
  onCancel,
  error,
  isVerifying = false
}) => {
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim()) {
      onSubmit(password.trim());
    }
  };

  const handleClose = () => {
    setPassword('');
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
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Nhập mật khẩu để tham gia game:</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mật khẩu game"
              disabled={isVerifying}
              autoFocus
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
              disabled={!password.trim() || isVerifying}
              className="flex-1"
            >
              {isVerifying ? 'Đang kiểm tra...' : 'Xác nhận'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};