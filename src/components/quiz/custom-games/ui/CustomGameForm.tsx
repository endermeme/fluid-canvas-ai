import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { SparklesIcon, Info, Code, Lock, Shield, Clock, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { AIGameGenerator } from '../../generator/geminiGenerator';
import { MiniGame } from '../../generator/types';
import { GameSettingsData } from '../../types';
import GameLoading from '../../GameLoading';
import { GEMINI_MODELS } from '@/constants/api-constants';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';

// Thêm custom css cho accordion
import "./customGameForm.css";

interface CustomGameFormProps {
  onGenerate: (content: string, game?: MiniGame) => void;
  onCancel: () => void;
}

const CustomGameForm: React.FC<CustomGameFormProps> = ({ onGenerate, onCancel }) => {
  const [content, setContent] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [expiryDays, setExpiryDays] = useState(30);
  const [maxParticipants, setMaxParticipants] = useState(50);
  const [isGenerating, setIsGenerating] = useState(false);
  const [enableSecurity, setEnableSecurity] = useState(true);
  const [requestPlayerInfo, setRequestPlayerInfo] = useState(true);
  const [limitParticipants, setLimitParticipants] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Use the singleton pattern
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

    setIsGenerating(true);
    
    try {
      // Luôn sử dụng canvas mode
      gameGenerator.setCanvasMode(true);
      
      // Minimal settings
      const settings: GameSettingsData = {
        category: 'custom'
      };
      
      const game = await gameGenerator.generateMiniGame(content, settings);
      
      if (game) {
        // Lưu cài đặt admin nếu có
        if (enableSecurity) {
          try {
            localStorage.setItem('temp_admin_settings', JSON.stringify({
              adminPassword: adminPassword || '1234',
              expiryDays,
              maxParticipants: limitParticipants ? maxParticipants : 0,
              requestPlayerInfo
            }));
          } catch (error) {
            console.error("Không thể lưu cài đặt admin:", error);
          }
        }
        
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
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-gradient-to-br from-background via-background/95 to-primary/5 overflow-y-auto">
      <Card className="max-w-3xl w-full mx-auto bg-background/70 backdrop-blur-xl border border-primary/20 shadow-[0_0_50px_rgba(0,0,0,0.1)] rounded-3xl overflow-hidden overflow-fix">
        <div className="p-8 sm:p-10 overflow-y-auto">
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
            
            <div className="accordion-container">
              <Accordion type="single" collapsible className="w-full" defaultValue="admin-settings">
                <AccordionItem value="admin-settings" className="border border-primary/15 rounded-2xl accordion-item">
                  <AccordionTrigger className="px-5 py-3">
                    <div className="flex items-center">
                      <Shield className="w-5 h-5 text-primary mr-2" />
                      <span>Cài đặt bảo mật & quản trị</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-5 pb-5 accordion-content">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="enable-security" className="flex items-center space-x-2">
                          <Lock className="h-4 w-4 text-primary" />
                          <span>Bật tính năng bảo mật</span>
                        </Label>
                        <Switch 
                          id="enable-security"
                          checked={enableSecurity}
                          onCheckedChange={setEnableSecurity}
                        />
                      </div>
                      
                      {enableSecurity && (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="admin-password">Mật khẩu quản trị</Label>
                            <Input
                              id="admin-password"
                              type="password"
                              placeholder="Nhập mật khẩu quản trị (mặc định: 1234)"
                              value={adminPassword}
                              onChange={(e) => setAdminPassword(e.target.value)}
                              className="bg-white/20 backdrop-blur-md"
                            />
                            <p className="text-xs text-muted-foreground">
                              Sử dụng để truy cập trang quản trị (nếu để trống sẽ dùng 1234)
                            </p>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="expiry-days" className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-primary" />
                              <span>Thời gian hết hạn (ngày)</span>
                            </Label>
                            <Input
                              id="expiry-days"
                              type="number"
                              min="1"
                              max="365"
                              placeholder="Số ngày game có hiệu lực"
                              value={expiryDays}
                              onChange={(e) => setExpiryDays(parseInt(e.target.value) || 30)}
                              className="bg-white/20 backdrop-blur-md"
                            />
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="request-player-info"
                              checked={requestPlayerInfo}
                              onCheckedChange={(checked) => setRequestPlayerInfo(!!checked)}
                            />
                            <Label htmlFor="request-player-info">
                              Yêu cầu thông tin người chơi (tên, tuổi)
                            </Label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="limit-participants"
                              checked={limitParticipants}
                              onCheckedChange={(checked) => setLimitParticipants(!!checked)}
                            />
                            <Label htmlFor="limit-participants">
                              Giới hạn số người tham gia
                            </Label>
                          </div>
                          
                          {limitParticipants && (
                            <div className="space-y-2 pl-6">
                              <Label htmlFor="max-participants" className="flex items-center space-x-2">
                                <Users className="h-4 w-4 text-primary" />
                                <span>Số người tham gia tối đa</span>
                              </Label>
                              <Input
                                id="max-participants"
                                type="number"
                                min="1"
                                max="1000"
                                placeholder="Số lượng người chơi tối đa"
                                value={maxParticipants}
                                onChange={(e) => setMaxParticipants(parseInt(e.target.value) || 50)}
                                className="bg-white/20 backdrop-blur-md"
                              />
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            
            <div className="flex items-start gap-3.5 p-5 bg-primary/5 rounded-2xl border border-primary/15 backdrop-blur-sm">
              <Info className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">
                AI sẽ tạo một game hoàn chỉnh với HTML, CSS và JavaScript dựa trên mô tả của bạn. Game sẽ sử dụng HTML5 Canvas cho hiệu ứng đồ họa tốt hơn.
              </p>
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
