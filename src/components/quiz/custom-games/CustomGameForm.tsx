
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { SparklesIcon, Info, Code, Zap, Brain, Layers, Settings, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { AIGameGenerator } from '../generator/geminiGenerator';
import { MiniGame } from '../generator/types';
import { AIModelType, GameSettingsData } from '../types';
import GameLoading from '../GameLoading';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';

interface CustomGameFormProps {
  onGenerate: (content: string, game?: MiniGame) => void;
  onCancel: () => void;
}

const CustomGameForm: React.FC<CustomGameFormProps> = ({ onGenerate, onCancel }) => {
  const [content, setContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiModelType, setAiModelType] = useState<AIModelType>('pro');
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  
  // Admin settings
  const [adminPassword, setAdminPassword] = useState('1234');
  const [expiryDays, setExpiryDays] = useState(30);
  const [maxParticipants, setMaxParticipants] = useState(50);
  const [requestPlayerInfo, setRequestPlayerInfo] = useState(true);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const gameGenerator = AIGameGenerator.getInstance();

  const getPlaceholderText = () => {
    return 'Mô tả chi tiết game bạn muốn tạo. Hãy bao gồm thể loại game, giao diện, cách chơi và bất kỳ yêu cầu đặc biệt nào.\n\nVí dụ: "Tạo một trò chơi xếp hình với 9 mảnh ghép hình ảnh về vũ trụ, có âm thanh khi hoàn thành và hiệu ứng ngôi sao khi người chơi thắng."';
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng mô tả game bạn muốn tạo",
        variant: "destructive"
      });
      return;
    }

    // Lưu cài đặt admin vào localStorage tạm thời
    localStorage.setItem('temp_admin_settings', JSON.stringify({
      adminPassword,
      expiryDays,
      maxParticipants,
      requestPlayerInfo
    }));

    setIsGenerating(true);
    
    try {
      gameGenerator.setModelType(aiModelType);
      
      const settings: GameSettingsData = {
        category: 'custom',
        aiModelType: aiModelType
      };
      
      const game = await gameGenerator.generateMiniGame(content, settings);
      
      if (game) {
        toast({
          title: "Đã tạo trò chơi",
          description: `Trò chơi đã được tạo thành công.`,
        });
        
        onGenerate(content, game);
      } else {
        throw new Error("Không thể tạo game");
      }
    } catch (error) {
      console.error("Lỗi khi tạo game:", error);
      
      toast({
        title: "Lỗi tạo game",
        description: "Có lỗi xảy ra khi tạo game. Vui lòng thử lại.",
        variant: "destructive"
      });
      onGenerate(content);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCancel = () => {
    if (window.location.pathname === '/quiz' && !window.location.search) {
      navigate('/');
    } else {
      onCancel();
    }
  };

  if (isGenerating) {
    return <GameLoading topic={content} />;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Card className="max-w-3xl w-full mx-auto bg-background/70 backdrop-blur-xl border border-primary/20 shadow-[0_0_50px_rgba(0,0,0,0.1)] rounded-3xl overflow-hidden">
        <div className="p-8 sm:p-10">
          <div className="mb-8 text-center">
            <div className="flex flex-col items-center gap-4 mb-6">
              <div className="p-3.5 rounded-2xl bg-primary/10 backdrop-blur-sm border border-primary/10 shadow-sm">
                <Code className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent">
                  Tạo trò chơi tùy chỉnh với AI
                </h2>
                <p className="text-muted-foreground mt-2.5 max-w-xl mx-auto">
                  Mô tả chi tiết game bạn muốn tạo và AI sẽ xây dựng nó cho bạn
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-8">
            <div className="relative">
              <Label htmlFor="content" className="flex items-center justify-center gap-2.5 text-lg font-medium mb-4">
                <SparklesIcon className="h-5 w-5 text-primary" /> 
                Mô tả game của bạn
              </Label>
              <Textarea
                id="content"
                placeholder={getPlaceholderText()}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={7}
                className="font-mono text-sm border-2 border-primary/20 bg-white/20 backdrop-blur-md focus-visible:ring-primary/30 focus-visible:border-primary/40 rounded-2xl transition-all duration-300 resize-none shadow-inner"
              />
              <div className="absolute -z-10 w-full h-full max-w-md blur-3xl bg-primary/5 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-50"></div>
            </div>
            
            {/* Chế độ AI */}
            <div className="relative">
              <Label className="flex items-center justify-center gap-2.5 text-lg font-medium mb-4">
                <Brain className="h-5 w-5 text-primary" /> 
                Chế độ AI
              </Label>
              
              <TooltipProvider>
                <RadioGroup 
                  value={aiModelType} 
                  onValueChange={(value) => setAiModelType(value as AIModelType)}
                  className="flex flex-col sm:flex-row gap-4 items-center justify-center"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem 
                      value="flash" 
                      id="flash" 
                      className="border-2 border-orange-400"
                    />
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Label 
                          htmlFor="flash" 
                          className="flex items-center cursor-pointer text-base font-medium"
                        >
                          <Zap className="h-4 w-4 text-orange-500 mr-2" />
                          Chế độ nhanh
                        </Label>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" sideOffset={5}>
                        <p className="max-w-xs">Dùng mô hình Gemini Flash - nhanh nhưng đơn giản hơn</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem 
                      value="pro" 
                      id="pro" 
                      className="border-2 border-primary"
                    />
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Label 
                          htmlFor="pro" 
                          className="flex items-center cursor-pointer text-base font-medium"
                        >
                          <SparklesIcon className="h-4 w-4 text-primary mr-2" />
                          Bình thường
                        </Label>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" sideOffset={5}>
                        <p className="max-w-xs">Dùng mô hình Gemini Pro - cân bằng giữa tốc độ và chất lượng</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem 
                      value="super-thinking" 
                      id="super" 
                      className="border-2 border-violet-500"
                    />
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Label 
                          htmlFor="super" 
                          className="flex items-center cursor-pointer text-base font-medium"
                        >
                          <Layers className="h-4 w-4 text-violet-500 mr-2" />
                          Super Thinking
                        </Label>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" sideOffset={5}>
                        <p className="max-w-xs">Kết hợp hai mô hình: Flash phân tích logic, Pro viết code - độ chính xác cao nhưng chậm hơn</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </RadioGroup>
              </TooltipProvider>
            </div>

            {/* Cài đặt nâng cao */}
            <Collapsible open={showAdvancedSettings} onOpenChange={setShowAdvancedSettings}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-4 border-2 border-dashed border-primary/20 rounded-xl hover:border-primary/40 transition-all">
                  <div className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-primary" />
                    <span className="font-medium">Cài đặt nâng cao</span>
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform ${showAdvancedSettings ? 'rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-6 mt-4">
                <div className="bg-primary/5 rounded-xl p-6 border border-primary/10">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="h-5 w-5 text-primary" />
                    <h3 className="font-medium text-lg">Cài đặt quản trị game</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="adminPassword" className="text-sm font-medium mb-2 block">
                        Mật khẩu quản trị
                      </Label>
                      <Input
                        id="adminPassword"
                        type="password"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        placeholder="Nhập mật khẩu quản trị"
                        className="bg-white/50"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="expiryDays" className="text-sm font-medium mb-2 block">
                        Thời gian hết hạn (ngày)
                      </Label>
                      <Input
                        id="expiryDays"
                        type="number"
                        min="1"
                        max="365"
                        value={expiryDays}
                        onChange={(e) => setExpiryDays(parseInt(e.target.value) || 30)}
                        className="bg-white/50"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="maxParticipants" className="text-sm font-medium mb-2 block">
                        Số người tham gia tối đa
                      </Label>
                      <Input
                        id="maxParticipants"
                        type="number"
                        min="1"
                        max="1000"
                        value={maxParticipants}
                        onChange={(e) => setMaxParticipants(parseInt(e.target.value) || 50)}
                        className="bg-white/50"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="requestPlayerInfo"
                        checked={requestPlayerInfo}
                        onChange={(e) => setRequestPlayerInfo(e.target.checked)}
                        className="rounded border-primary/30"
                      />
                      <Label htmlFor="requestPlayerInfo" className="text-sm font-medium">
                        Yêu cầu thông tin người chơi
                      </Label>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
            
            <div className="flex items-start gap-3.5 p-5 bg-primary/5 rounded-2xl border border-primary/15 backdrop-blur-sm">
              <Info className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="text-sm text-muted-foreground">
                <p className="mb-2">AI sẽ tạo một game hoàn chỉnh với HTML, CSS và JavaScript dựa trên mô tả của bạn.</p>
                <ul className="list-disc list-inside space-y-1 pl-2">
                  <li><span className="text-orange-500 font-medium">Chế độ nhanh:</span> Tạo game nhanh hơn, phù hợp với yêu cầu đơn giản</li>
                  <li><span className="text-primary font-medium">Bình thường:</span> Cân bằng giữa tốc độ và chất lượng code</li>
                  <li><span className="text-violet-500 font-medium">Super Thinking:</span> Kết hợp hai mô hình để tạo game chất lượng cao, ít lỗi hơn</li>
                </ul>
              </div>
            </div>
            
            <div className="flex justify-center gap-5 pt-4">
              <Button 
                variant="outline" 
                onClick={handleCancel}
                className="min-w-[130px] border-2 border-primary/20 hover:border-primary/30 hover:bg-primary/5 rounded-xl transition-all duration-300"
              >
                Hủy
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={isGenerating || !content.trim()}
                className="min-w-[220px] bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 rounded-xl shadow-lg shadow-primary/20 transition-all duration-300 font-medium"
              >
                <SparklesIcon className="h-5 w-5 mr-2.5" />
                Tạo với AI
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CustomGameForm;
