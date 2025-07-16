import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { SparklesIcon, Info, Code, Atom, FlaskConical, Microscope, TestTube, Telescope, Radiation, Calculator, Beaker, Dna } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { AIGameGenerator } from '../generator/geminiGenerator';
import { MiniGame } from '../generator/types';
import { GameSettingsData } from '../types';
import GameLoading from '../GameLoading';
import { motion } from 'framer-motion';
interface CustomGameFormProps {
  onGenerate: (content: string, game?: MiniGame) => void;
  onCancel: () => void;
}
const CustomGameForm: React.FC<CustomGameFormProps> = ({
  onGenerate,
  onCancel
}) => {
  const [content, setContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const {
    toast
  } = useToast();
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
    setIsGenerating(true);
    try {
      const settings: GameSettingsData = {
        category: 'custom'
      };
      const game = await gameGenerator.generateMiniGame(content, settings);
      if (game) {
        toast({
          title: "Đã tạo trò chơi",
          description: `Trò chơi đã được tạo thành công.`
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

  // Check loading state after all hooks are called
  if (isGenerating) {
    return <GameLoading topic={content} />;
  }
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-blue-100 dark:from-blue-950 dark:via-sky-950 dark:to-blue-950 relative">

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6
      }}>
          <Card className="max-w-3xl w-full mx-auto bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-2 border-blue-200/50 dark:border-blue-700/50 shadow-[0_0_50px_rgba(59,130,246,0.15)] rounded-3xl overflow-hidden">
            <div className="p-8 sm:p-10">
              <motion.div className="mb-8 text-center" initial={{
              opacity: 0,
              y: 10
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: 0.2,
              duration: 0.5
            }}>
                <div className="flex flex-col items-center gap-4 mb-6">
                  <motion.div className="p-4 rounded-2xl bg-gradient-to-br from-blue-100 to-sky-100 dark:from-blue-900/50 dark:to-sky-900/50 backdrop-blur-sm border border-blue-200/30 shadow-lg" whileHover={{
                  scale: 1.05,
                  rotate: 5
                }} transition={{
                  type: "spring",
                  stiffness: 300
                }}>
                    <Code className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </motion.div>
                  <div>
                    <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 via-sky-600 to-blue-700 bg-clip-text text-transparent">
                      Tạo trò chơi tùy chỉnh với AI
                    </h2>
                    <p className="text-muted-foreground mt-2.5 max-w-xl mx-auto text-lg">
                      Mô tả chi tiết game bạn muốn tạo và AI sẽ xây dựng nó cho bạn
                    </p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div className="space-y-8" initial={{
              opacity: 0
            }} animate={{
              opacity: 1
            }} transition={{
              delay: 0.4,
              duration: 0.5
            }}>
                <div className="relative">
                  <Label htmlFor="content" className="flex items-center justify-center gap-2.5 text-lg font-medium mb-4">
                    <SparklesIcon className="h-5 w-5 text-blue-600" /> 
                    Mô tả game của bạn
                  </Label>
                  <Textarea id="content" placeholder={getPlaceholderText()} value={content} onChange={e => setContent(e.target.value)} rows={7} className="font-mono text-sm border-2 border-blue-200/40 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md focus-visible:ring-blue-400/50 focus-visible:border-blue-400/60 rounded-2xl transition-all duration-300 resize-none shadow-lg" />
                </div>
                
                <motion.div className="flex items-start gap-3.5 p-5 bg-blue-50/80 dark:bg-blue-950/50 rounded-2xl border border-blue-200/30 backdrop-blur-sm" whileHover={{
                scale: 1.01
              }} transition={{
                type: "spring",
                stiffness: 300
              }}>
                  <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-slate-700 dark:text-slate-300">Game được tạo bởi AI không hẳn là hoàn hảo mà sẽ có một số lỗi có thể phát sinh trong quá trình tạo nên bạn hãy tạo lại nếu như có lỗi nhé !</p>
                </motion.div>
                
                <div className="flex justify-center gap-5 pt-4">
                  <Button variant="outline" onClick={handleCancel} className="min-w-[130px] border-2 border-blue-200/50 hover:border-blue-300/60 hover:bg-blue-50/50 rounded-xl transition-all duration-300">
                    Hủy
                  </Button>
                  <motion.div whileHover={{
                  scale: 1.02
                }} whileTap={{
                  scale: 0.98
                }}>
                    <Button onClick={handleSubmit} disabled={isGenerating || !content.trim()} className="min-w-[220px] bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-300 font-medium">
                      <SparklesIcon className="h-5 w-5 mr-2.5" />
                      Tạo với AI
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>;
};
export default CustomGameForm;