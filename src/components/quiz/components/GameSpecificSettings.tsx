import React from 'react';
import { GameSettingsData, GameType, GridSize, FlipSpeed } from '../types';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { 
  Shuffle, Eye, SkipForward, Grid3X3, Lightbulb, 
  RotateCcw, Gauge, Search, Users, Target, Award 
} from 'lucide-react';

interface GameSpecificSettingsProps {
  gameType: GameType;
  settings: GameSettingsData;
  onSettingChange: (key: keyof GameSettingsData, value: any) => void;
}

export const GameSpecificSettings: React.FC<GameSpecificSettingsProps> = ({
  gameType,
  settings,
  onSettingChange
}) => {
  const renderQuizSettings = () => (
    <Card className="p-4 border-primary/20">
      <h3 className="text-sm font-semibold mb-3 text-primary">Cài đặt Trắc nghiệm</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="shuffleQuestions" className="flex items-center gap-2 text-sm">
            <Shuffle className="h-4 w-4 text-primary" />
            Xáo trộn câu hỏi
          </Label>
          <Switch
            id="shuffleQuestions"
            checked={settings.shuffleQuestions || false}
            onCheckedChange={(checked) => onSettingChange('shuffleQuestions', checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="shuffleOptions" className="flex items-center gap-2 text-sm">
            <Shuffle className="h-4 w-4 text-primary" />
            Xáo trộn đáp án
          </Label>
          <Switch
            id="shuffleOptions"
            checked={settings.shuffleOptions || false}
            onCheckedChange={(checked) => onSettingChange('shuffleOptions', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="showExplanation" className="flex items-center gap-2 text-sm">
            <Eye className="h-4 w-4 text-primary" />
            Hiện giải thích
          </Label>
          <Switch
            id="showExplanation"
            checked={settings.showExplanation || false}
            onCheckedChange={(checked) => onSettingChange('showExplanation', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="allowSkip" className="flex items-center gap-2 text-sm">
            <SkipForward className="h-4 w-4 text-primary" />
            Cho phép bỏ qua
          </Label>
          <Switch
            id="allowSkip"
            checked={settings.allowSkip || false}
            onCheckedChange={(checked) => onSettingChange('allowSkip', checked)}
          />
        </div>
      </div>
    </Card>
  );

  const renderMemorySettings = () => (
    <Card className="p-4 border-primary/20">
      <h3 className="text-sm font-semibold mb-3 text-primary">Cài đặt Trò chơi Trí nhớ</h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="gridSize" className="flex items-center gap-2 text-sm">
            <Grid3X3 className="h-4 w-4 text-primary" />
            Kích thước lưới
          </Label>
          <Select 
            value={settings.gridSize || '4x4'} 
            onValueChange={(value) => onSettingChange('gridSize', value as GridSize)}
          >
            <SelectTrigger className="border-primary/20 bg-white/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3x4">3x4 (12 thẻ)</SelectItem>
              <SelectItem value="4x4">4x4 (16 thẻ)</SelectItem>
              <SelectItem value="4x5">4x5 (20 thẻ)</SelectItem>
              <SelectItem value="5x6">5x6 (30 thẻ)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="allowHints" className="flex items-center gap-2 text-sm">
            <Lightbulb className="h-4 w-4 text-primary" />
            Cho phép gợi ý
          </Label>
          <Switch
            id="allowHints"
            checked={settings.allowHints || false}
            onCheckedChange={(checked) => onSettingChange('allowHints', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="progressiveHints" className="flex items-center gap-2 text-sm">
            <Target className="h-4 w-4 text-primary" />
            Gợi ý tăng dần
          </Label>
          <Switch
            id="progressiveHints"
            checked={settings.progressiveHints || false}
            onCheckedChange={(checked) => onSettingChange('progressiveHints', checked)}
          />
        </div>
      </div>
    </Card>
  );

  const renderFlashcardSettings = () => (
    <Card className="p-4 border-primary/20">
      <h3 className="text-sm font-semibold mb-3 text-primary">Cài đặt Thẻ ghi nhớ</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="autoFlip" className="flex items-center gap-2 text-sm">
            <RotateCcw className="h-4 w-4 text-primary" />
            Tự động lật thẻ
          </Label>
          <Switch
            id="autoFlip"
            checked={settings.autoFlip || false}
            onCheckedChange={(checked) => onSettingChange('autoFlip', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="shuffleCards" className="flex items-center gap-2 text-sm">
            <Shuffle className="h-4 w-4 text-primary" />
            Xáo trộn thẻ
          </Label>
          <Switch
            id="shuffleCards"
            checked={settings.shuffleCards || false}
            onCheckedChange={(checked) => onSettingChange('shuffleCards', checked)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="flipSpeed" className="flex items-center gap-2 text-sm">
            <Gauge className="h-4 w-4 text-primary" />
            Tốc độ lật thẻ
          </Label>
          <Select 
            value={settings.flipSpeed || 'normal'} 
            onValueChange={(value) => onSettingChange('flipSpeed', value as FlipSpeed)}
          >
            <SelectTrigger className="border-primary/20 bg-white/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="slow">Chậm (1.5s)</SelectItem>
              <SelectItem value="normal">Bình thường (1s)</SelectItem>
              <SelectItem value="fast">Nhanh (0.5s)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="showProgress" className="flex items-center gap-2 text-sm">
            <Target className="h-4 w-4 text-primary" />
            Hiện tiến độ
          </Label>
          <Switch
            id="showProgress"
            checked={settings.showProgress || false}
            onCheckedChange={(checked) => onSettingChange('showProgress', checked)}
          />
        </div>
      </div>
    </Card>
  );

  const renderWordSearchSettings = () => (
    <Card className="p-4 border-primary/20">
      <h3 className="text-sm font-semibold mb-3 text-primary">Cài đặt Tìm từ ẩn</h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="gridSize" className="flex items-center gap-2 text-sm">
            <Grid3X3 className="h-4 w-4 text-primary" />
            Kích thước lưới
          </Label>
          <Select 
            value={settings.gridSize || '4x4'} 
            onValueChange={(value) => onSettingChange('gridSize', value as GridSize)}
          >
            <SelectTrigger className="border-primary/20 bg-white/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3x4">3x4</SelectItem>
              <SelectItem value="4x4">4x4</SelectItem>
              <SelectItem value="4x5">4x5</SelectItem>
              <SelectItem value="5x6">5x6</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="allowDiagonalWords" className="flex items-center gap-2 text-sm">
            <Search className="h-4 w-4 text-primary" />
            Từ theo đường chéo
          </Label>
          <Switch
            id="allowDiagonalWords"
            checked={settings.allowDiagonalWords || false}
            onCheckedChange={(checked) => onSettingChange('allowDiagonalWords', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="showWordList" className="flex items-center gap-2 text-sm">
            <Eye className="h-4 w-4 text-primary" />
            Hiện danh sách từ
          </Label>
          <Switch
            id="showWordList"
            checked={settings.showWordList || false}
            onCheckedChange={(checked) => onSettingChange('showWordList', checked)}
          />
        </div>
      </div>
    </Card>
  );

  const renderMatchingSettings = () => (
    <Card className="p-4 border-primary/20">
      <h3 className="text-sm font-semibold mb-3 text-primary">Cài đặt Nối từ</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="allowPartialMatching" className="flex items-center gap-2 text-sm">
            <Target className="h-4 w-4 text-primary" />
            Cho phép nối một phần
          </Label>
          <Switch
            id="allowPartialMatching"
            checked={settings.allowPartialMatching || false}
            onCheckedChange={(checked) => onSettingChange('allowPartialMatching', checked)}
          />
        </div>
      </div>
    </Card>
  );

  const renderOrderingSettings = () => (
    <Card className="p-4 border-primary/20">
      <h3 className="text-sm font-semibold mb-3 text-primary">Cài đặt Sắp xếp</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="allowMultipleAttempts" className="flex items-center gap-2 text-sm">
            <RotateCcw className="h-4 w-4 text-primary" />
            Cho phép thử lại
          </Label>
          <Switch
            id="allowMultipleAttempts"
            checked={settings.allowMultipleAttempts || false}
            onCheckedChange={(checked) => onSettingChange('allowMultipleAttempts', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="caseSensitive" className="flex items-center gap-2 text-sm">
            <Target className="h-4 w-4 text-primary" />
            Phân biệt hoa thường
          </Label>
          <Switch
            id="caseSensitive"
            checked={settings.caseSensitive || false}
            onCheckedChange={(checked) => onSettingChange('caseSensitive', checked)}
          />
        </div>
      </div>
    </Card>
  );

  const renderTrueFalseSettings = () => (
    <Card className="p-4 border-primary/20">
      <h3 className="text-sm font-semibold mb-3 text-primary">Cài đặt Đúng/Sai</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="progressiveScoring" className="flex items-center gap-2 text-sm">
            <Award className="h-4 w-4 text-primary" />
            Điểm tăng dần
          </Label>
          <Switch
            id="progressiveScoring"
            checked={settings.progressiveScoring || false}
            onCheckedChange={(checked) => onSettingChange('progressiveScoring', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="confidenceMode" className="flex items-center gap-2 text-sm">
            <Target className="h-4 w-4 text-primary" />
            Chế độ độ tin cậy
          </Label>
          <Switch
            id="confidenceMode"
            checked={settings.confidenceMode || false}
            onCheckedChange={(checked) => onSettingChange('confidenceMode', checked)}
          />
        </div>
      </div>
    </Card>
  );

  // Return appropriate settings based on game type
  switch (gameType.id) {
    case 'quiz':
      return renderQuizSettings();
    case 'flashcards':
      return renderFlashcardSettings();
    case 'wordsearch':
      return renderWordSearchSettings();
    case 'matching':
      return renderMatchingSettings();
    case 'unjumble':
      return renderOrderingSettings();
    case 'truefalse':
      return renderTrueFalseSettings();
    default:
      return renderMemorySettings();
  }
};