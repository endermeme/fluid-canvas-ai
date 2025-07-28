// Share Settings Form for Custom Games
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface CustomShareSettingsFormProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: (settings: any) => Promise<void>;
  isSharing: boolean;
}

export const CustomShareSettingsForm: React.FC<CustomShareSettingsFormProps> = ({
  isOpen,
  onClose,
  onShare,
  isSharing
}) => {
  const [settings, setSettings] = useState({
    password: '',
    maxParticipants: 50,
    showLeaderboard: true,
    requireRegistration: false,
    customDuration: 48
  });

  const handleSubmit = async () => {
    await onShare(settings);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cài đặt chia sẻ Game tùy chỉnh</DialogTitle>
          <DialogDescription>
            Thiết lập các tùy chọn chia sẻ cho game tùy chỉnh của bạn
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="password">Mật khẩu (tùy chọn)</Label>
            <Input
              id="password"
              type="password"
              value={settings.password}
              onChange={(e) => setSettings(prev => ({ ...prev, password: e.target.value }))}
              placeholder="Để trống nếu không cần mật khẩu"
            />
          </div>

          <div>
            <Label htmlFor="maxParticipants">Số người tham gia tối đa</Label>
            <Input
              id="maxParticipants"
              type="number"
              min="1"
              max="100"
              value={settings.maxParticipants}
              onChange={(e) => setSettings(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) }))}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="showLeaderboard"
              checked={settings.showLeaderboard}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, showLeaderboard: checked }))}
            />
            <Label htmlFor="showLeaderboard">Hiển thị bảng xếp hạng</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="requireRegistration"
              checked={settings.requireRegistration}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, requireRegistration: checked }))}
            />
            <Label htmlFor="requireRegistration">Yêu cầu đăng ký</Label>
          </div>

          <div>
            <Label htmlFor="customDuration">Thời hạn (giờ)</Label>
            <Input
              id="customDuration"
              type="number"
              min="1"
              max="168"
              value={settings.customDuration}
              onChange={(e) => setSettings(prev => ({ ...prev, customDuration: parseInt(e.target.value) }))}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Hủy</Button>
          <Button onClick={handleSubmit} disabled={isSharing}>
            {isSharing ? 'Đang chia sẻ...' : 'Chia sẻ Game'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};