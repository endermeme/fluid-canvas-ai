// Share Settings Form for Preset Games
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

interface PresetShareSettingsFormProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: (settings: any) => Promise<void>;
  isSharing: boolean;
}

export const PresetShareSettingsForm: React.FC<PresetShareSettingsFormProps> = ({
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
    customDuration: 48,
    singleParticipationOnly: false
  });

  const handleSubmit = async () => {
    await onShare(settings);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Preset Game Share Settings</DialogTitle>
          <DialogDescription>
            Configure sharing settings for your preset game
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="password">Password (optional)</Label>
            <Input
              id="password"
              type="password"
              value={settings.password}
              onChange={(e) => setSettings(prev => ({ ...prev, password: e.target.value }))}
              placeholder="Leave empty for no password"
            />
          </div>

          <div>
            <Label htmlFor="maxParticipants">Max Participants</Label>
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
            <Label htmlFor="showLeaderboard">Show Leaderboard</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="requireRegistration"
              checked={settings.requireRegistration}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, requireRegistration: checked }))}
            />
            <Label htmlFor="requireRegistration">Require Registration</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="singleParticipationOnly"
              checked={settings.singleParticipationOnly}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, singleParticipationOnly: checked }))}
            />
            <Label htmlFor="singleParticipationOnly">Single Participation Only</Label>
          </div>

          <div>
            <Label htmlFor="customDuration">Duration (hours)</Label>
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
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isSharing}>
            {isSharing ? 'Sharing...' : 'Share Game'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};