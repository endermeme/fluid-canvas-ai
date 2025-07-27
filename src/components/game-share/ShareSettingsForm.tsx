import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Share2, Lock, Users, Clock, Trophy, UserCheck, ShieldCheck } from 'lucide-react';

export interface ShareSettings {
  password?: string;
  maxParticipants?: number;
  showLeaderboard: boolean;
  requireRegistration: boolean;
  customDuration?: number; // in hours
  singleParticipationOnly?: boolean; // new field for single participation
}

interface ShareSettingsFormProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: (settings: ShareSettings) => Promise<void>;
  isSharing: boolean;
}

const DURATION_OPTIONS = [
  { value: 1, label: '1 giờ' },
  { value: 6, label: '6 giờ' },
  { value: 24, label: '1 ngày' },
  { value: 72, label: '3 ngày' },
  { value: 168, label: '7 ngày' },
];

export const ShareSettingsForm: React.FC<ShareSettingsFormProps> = ({
  isOpen,
  onClose,
  onShare,
  isSharing
}) => {
  const [settings, setSettings] = useState<ShareSettings>({
    showLeaderboard: true,
    requireRegistration: false,
    singleParticipationOnly: false,
  });
  const [usePassword, setUsePassword] = useState(false);
  const [limitParticipants, setLimitParticipants] = useState(false);
  const [customDuration, setCustomDuration] = useState(false);

  // Auto-enable requireRegistration when password is enabled
  const handlePasswordToggle = (checked: boolean) => {
    setUsePassword(checked);
    if (checked) {
      setSettings(prev => ({ ...prev, requireRegistration: true }));
    }
  };

  const handleSubmit = async () => {
    const finalSettings: ShareSettings = {
      ...settings,
      password: usePassword ? settings.password : undefined,
      maxParticipants: limitParticipants ? settings.maxParticipants : undefined,
      customDuration: customDuration ? settings.customDuration : undefined,
    };
    
    await onShare(finalSettings);
  };

  const resetForm = () => {
    setSettings({
      showLeaderboard: true,
      requireRegistration: false,
      singleParticipationOnly: false,
    });
    setUsePassword(false);
    setLimitParticipants(false);
    setCustomDuration(false);
  };

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open && !isSharing) {
          onClose();
          resetForm();
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Cài đặt chia sẻ game
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Password Protection */}
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  <Label>Bảo vệ bằng mật khẩu</Label>
                </div>
                <Switch 
                  checked={usePassword}
                  onCheckedChange={handlePasswordToggle}
                />
              </div>
              {usePassword && (
                <Input
                  type="password"
                  placeholder="Nhập mật khẩu"
                  value={settings.password || ''}
                  onChange={(e) => setSettings({ ...settings, password: e.target.value })}
                />
              )}
            </CardContent>
          </Card>

          {/* Participant Limit */}
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <Label>Giới hạn số người tham gia</Label>
                </div>
                <Switch 
                  checked={limitParticipants}
                  onCheckedChange={setLimitParticipants}
                />
              </div>
              {limitParticipants && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>5 người</span>
                    <span>{settings.maxParticipants || 20} người</span>
                    <span>100 người</span>
                  </div>
                  <Slider
                    value={[settings.maxParticipants || 20]}
                    onValueChange={([value]) => setSettings({ ...settings, maxParticipants: value })}
                    min={5}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Custom Duration */}
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <Label>Thời gian mở game</Label>
                </div>
                <Switch 
                  checked={customDuration}
                  onCheckedChange={setCustomDuration}
                />
              </div>
              {customDuration && (
                <Select
                  value={settings.customDuration?.toString()}
                  onValueChange={(value) => setSettings({ ...settings, customDuration: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn thời gian" />
                  </SelectTrigger>
                  <SelectContent>
                    {DURATION_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value.toString()}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </CardContent>
          </Card>

          {/* Show Leaderboard */}
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  <Label>Hiển thị bảng xếp hạng</Label>
                </div>
                <Switch 
                  checked={settings.showLeaderboard}
                  onCheckedChange={(checked) => setSettings({ ...settings, showLeaderboard: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Require Registration */}
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4" />
                  <Label>Bắt buộc nhập thông tin</Label>
                </div>
                <Switch 
                  checked={settings.requireRegistration}
                  onCheckedChange={(checked) => setSettings({ ...settings, requireRegistration: checked })}
                  disabled={usePassword} // Disabled when password is enabled
                />
              </div>
              {usePassword && (
                <p className="text-xs text-muted-foreground mt-2">
                  Tự động bật khi có mật khẩu
                </p>
              )}
            </CardContent>
          </Card>

          {/* Single Participation Only */}
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  <Label>Chỉ tham gia một lần</Label>
                </div>
                <Switch 
                  checked={settings.singleParticipationOnly}
                  onCheckedChange={(checked) => setSettings({ ...settings, singleParticipationOnly: checked })}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Người chơi chỉ được tham gia và làm bài một lần như thi đấu
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-2 pt-4">
          <Button 
            variant="outline" 
            onClick={() => {
              onClose();
              resetForm();
            }}
            disabled={isSharing}
            className="flex-1"
          >
            Hủy
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSharing || (usePassword && !settings.password)}
            className="flex-1"
          >
            {isSharing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Đang tạo...
              </>
            ) : (
              'Tạo link chia sẻ'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};