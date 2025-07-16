import React from 'react';
import { TimerMode } from '../types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Clock, Zap, Timer, Infinity } from 'lucide-react';

interface TimerModeSelectorProps {
  value: TimerMode;
  onChange: (mode: TimerMode) => void;
}

export const TimerModeSelector: React.FC<TimerModeSelectorProps> = ({ value, onChange }) => {
  const timerModes = [
    {
      value: 'normal' as TimerMode,
      label: 'Bình thường',
      description: 'Thời gian cố định cho mỗi câu',
      icon: <Clock className="h-4 w-4" />,
      color: 'bg-blue-100 text-blue-700'
    },
    {
      value: 'progressive' as TimerMode,
      label: 'Tăng dần',
      description: 'Thời gian giảm dần theo level',
      icon: <Timer className="h-4 w-4" />,
      color: 'bg-orange-100 text-orange-700'
    },
    {
      value: 'rush' as TimerMode,
      label: 'Tốc độ',
      description: 'Thời gian ngắn, điểm cao',
      icon: <Zap className="h-4 w-4" />,
      color: 'bg-red-100 text-red-700'
    },
    {
      value: 'relaxed' as TimerMode,
      label: 'Thư giãn',
      description: 'Không giới hạn thời gian',
      icon: <Infinity className="h-4 w-4" />,
      color: 'bg-green-100 text-green-700'
    }
  ];

  const selectedMode = timerModes.find(mode => mode.value === value);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Chế độ thời gian</label>
        {selectedMode && (
          <Badge className={`${selectedMode.color} border-0`}>
            {selectedMode.icon}
            <span className="ml-1">{selectedMode.label}</span>
          </Badge>
        )}
      </div>
      
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="border-primary/20 bg-white/50">
          <SelectValue placeholder="Chọn chế độ thời gian" />
        </SelectTrigger>
        <SelectContent>
          {timerModes.map((mode) => (
            <SelectItem key={mode.value} value={mode.value}>
              <div className="flex items-center space-x-3">
                <div className={`p-1.5 rounded-full ${mode.color}`}>
                  {mode.icon}
                </div>
                <div>
                  <div className="font-medium">{mode.label}</div>
                  <div className="text-xs text-muted-foreground">{mode.description}</div>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};