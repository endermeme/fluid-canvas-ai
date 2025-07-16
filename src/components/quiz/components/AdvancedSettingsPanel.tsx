import React, { useState } from 'react';
import { GameSettingsData } from '../types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { 
  ChevronDown, 
  ChevronRight, 
  Settings2, 
  Clock, 
  Gamepad2, 
  Target,
  Brain
} from 'lucide-react';

interface AdvancedSettingsPanelProps {
  settings: GameSettingsData;
  gameType: string;
  onChange: (settings: Partial<GameSettingsData>) => void;
}

export const AdvancedSettingsPanel: React.FC<AdvancedSettingsPanelProps> = ({
  settings,
  gameType,
  onChange
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const renderTimerAdvancedSettings = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-medium flex items-center gap-2">
        <Clock className="h-4 w-4" />
        Cài đặt thời gian nâng cao
      </h4>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">Performance Bonus</label>
          <div className="flex items-center space-x-2">
            <Switch
              checked={settings.performanceBonus || false}
              onCheckedChange={(value) => onChange({ performanceBonus: value })}
            />
            <span className="text-xs">+5s khi đúng 3 câu liên tiếp</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">Time Penalty</label>
          <div className="flex items-center space-x-2">
            <Switch
              checked={settings.timePenalty || false}
              onCheckedChange={(value) => onChange({ timePenalty: value })}
            />
            <span className="text-xs">-3s khi trả lời sai</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-xs text-muted-foreground">Speed Bonus</label>
        <div className="flex items-center space-x-2">
          <Switch
            checked={settings.speedBonus || false}
            onCheckedChange={(value) => onChange({ speedBonus: value })}
          />
          <span className="text-xs">Điểm thưởng cho answers nhanh</span>
        </div>
      </div>
    </div>
  );

  const renderGameSpecificAdvanced = () => {
    switch (gameType) {
      case 'quiz':
        return (
          <div className="space-y-4">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              Quiz nâng cao
            </h4>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Timing giải thích</label>
                <Select
                  value="after_each"
                  onValueChange={(value) => onChange({ showExplanation: value === 'immediate' })}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Ngay lập tức</SelectItem>
                    <SelectItem value="after_each">Sau mỗi câu</SelectItem>
                    <SelectItem value="end_only">Cuối game</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.shuffleOptions || false}
                  onCheckedChange={(value) => onChange({ shuffleOptions: value })}
                />
                <span className="text-xs">Trộn thứ tự đáp án</span>
              </div>
            </div>
          </div>
        );
        
      case 'memory':
        return (
          <div className="space-y-4">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Memory nâng cao
            </h4>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Card Flip Duration</label>
                <Select
                  value={settings.flipSpeed || 'normal'}
                  onValueChange={(value) => onChange({ flipSpeed: value as any })}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="slow">Chậm (2s)</SelectItem>
                    <SelectItem value="normal">Bình thường (1s)</SelectItem>
                    <SelectItem value="fast">Nhanh (0.5s)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.progressiveHints || false}
                  onCheckedChange={(value) => onChange({ progressiveHints: value })}
                />
                <span className="text-xs">Hints tăng dần theo độ khó</span>
              </div>
            </div>
          </div>
        );
        
      case 'flashcards':
        return (
          <div className="space-y-4">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Gamepad2 className="h-4 w-4" />
              Flashcards nâng cao
            </h4>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Flip Speed</label>
                <Select
                  value={settings.flipSpeed || 'normal'}
                  onValueChange={(value) => onChange({ flipSpeed: value as any })}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="slow">Chậm (2s)</SelectItem>
                    <SelectItem value="normal">Bình thường (1s)</SelectItem>
                    <SelectItem value="fast">Nhanh (0.5s)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.showProgress || false}
                  onCheckedChange={(value) => onChange({ showProgress: value })}
                />
                <span className="text-xs">Hiện progress bar</span>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  const advancedSettingsCount = [
    settings.performanceBonus,
    settings.timePenalty,
    settings.speedBonus,
    settings.shuffleOptions,
    settings.progressiveHints,
    settings.showProgress
  ].filter(Boolean).length;

  return (
    <Card className="border-primary/20">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-between p-4 h-auto"
          >
            <div className="flex items-center gap-2">
              <Settings2 className="h-4 w-4" />
              <span className="font-medium">Cài đặt nâng cao</span>
              {advancedSettingsCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {advancedSettingsCount} đang bật
                </Badge>
              )}
            </div>
            {isOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className="px-4 pb-4 space-y-6">
            {renderTimerAdvancedSettings()}
            {renderGameSpecificAdvanced()}
            
            <div className="pt-4 border-t">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.debugMode || false}
                  onCheckedChange={(value) => onChange({ debugMode: value })}
                />
                <span className="text-xs text-muted-foreground">Debug Mode</span>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};