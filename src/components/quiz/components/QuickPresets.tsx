import React from 'react';
import { GameSettingsData, TimerMode } from '../types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles, Target, Zap, BookOpen } from 'lucide-react';

interface QuickPresetsProps {
  onPresetSelect: (settings: Partial<GameSettingsData>) => void;
}

export const QuickPresets: React.FC<QuickPresetsProps> = ({ onPresetSelect }) => {
  const presets = [
    {
      name: 'Dễ dàng',
      description: 'Phù hợp cho người mới học',
      icon: <BookOpen className="h-4 w-4" />,
      color: 'bg-green-50 border-green-200 hover:bg-green-100',
      iconColor: 'text-green-600',
      settings: {
        difficulty: 'easy' as const,
        questionCount: 8,
        timePerQuestion: 45,
        timerMode: 'relaxed' as TimerMode,
        performanceBonus: false,
        timePenalty: false,
        speedBonus: false,
        allowHints: true,
        showExplanation: true
      }
    },
    {
      name: 'Chuẩn',
      description: 'Cài đặt cân bằng và phổ biến',
      icon: <Target className="h-4 w-4" />,
      color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
      iconColor: 'text-blue-600',
      settings: {
        difficulty: 'medium' as const,
        questionCount: 10,
        timePerQuestion: 30,
        timerMode: 'normal' as TimerMode,
        performanceBonus: true,
        timePenalty: false,
        speedBonus: true,
        allowHints: false,
        showExplanation: true
      }
    },
    {
      name: 'Thử thách',
      description: 'Cho người muốn thử thách bản thân',
      icon: <Zap className="h-4 w-4" />,
      color: 'bg-red-50 border-red-200 hover:bg-red-100',
      iconColor: 'text-red-600',
      settings: {
        difficulty: 'hard' as const,
        questionCount: 15,
        timePerQuestion: 20,
        timerMode: 'progressive' as TimerMode,
        performanceBonus: true,
        timePenalty: true,
        speedBonus: true,
        allowHints: false,
        showExplanation: false
      }
    },
    {
      name: 'Tốc độ',
      description: 'Tập trung vào phản xạ nhanh',
      icon: <Sparkles className="h-4 w-4" />,
      color: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
      iconColor: 'text-orange-600',
      settings: {
        difficulty: 'medium' as const,
        questionCount: 20,
        timePerQuestion: 15,
        timerMode: 'rush' as TimerMode,
        performanceBonus: true,
        timePenalty: true,
        speedBonus: true,
        allowHints: false,
        showExplanation: false
      }
    }
  ];

  return (
    <Card className="p-4 border-primary/20">
      <h3 className="text-sm font-semibold mb-3 text-primary">Thiết lập nhanh</h3>
      <div className="grid grid-cols-2 gap-2">
        {presets.map((preset) => (
          <Button
            key={preset.name}
            variant="outline"
            className={`h-auto p-3 flex flex-col items-start text-left ${preset.color}`}
            onClick={() => onPresetSelect(preset.settings)}
          >
            <div className="flex items-center gap-2 mb-1">
              <div className={preset.iconColor}>
                {preset.icon}
              </div>
              <span className="font-medium text-sm">{preset.name}</span>
            </div>
            <span className="text-xs text-muted-foreground">{preset.description}</span>
          </Button>
        ))}
      </div>
    </Card>
  );
};