
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Code, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';

interface CustomGameSettingsProps {
  onGenerate: (prompt: string, useCanvas: boolean) => void;
  isGenerating?: boolean;
}

const CustomGameSettings: React.FC<CustomGameSettingsProps> = ({ 
  onGenerate, 
  isGenerating = false
}) => {
  const [prompt, setPrompt] = useState('');
  // Canvas mode luôn bật theo mặc định
  const [useCanvas] = useState(true);

  const handleSubmit = () => {
    if (prompt.trim()) {
      onGenerate(prompt, useCanvas);
    }
  };

  const getPlaceholderText = () => {
    return 'Mô tả chi tiết game bạn muốn tạo (ví dụ: Tạo trò chơi xếp hình với 9 mảnh ghép về hệ mặt trời)';
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-4 animate-fade-in">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-2xl"
      >
        <Card className="relative overflow-hidden bg-gradient-to-b from-background/90 to-background/70 backdrop-blur-lg border-primary/20 p-8 shadow-xl rounded-xl hover:shadow-2xl transition-all duration-500">
          {/* Hiệu ứng ánh sáng nền */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 via-primary/5 to-primary/20 rounded-xl blur-xl opacity-50 animate-pulse-soft"></div>
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-xl blur-3xl opacity-30 animate-breathe"></div>
          
          <div className="relative z-10">
            <motion.div className="flex flex-col items-center mb-8" variants={itemVariants}>
              <div className="flex items-center justify-center p-4 mb-4 rounded-full bg-gradient-to-r from-primary/10 to-primary/20 backdrop-blur-sm shadow-lg animate-float">
                <Code className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-3">
                Tạo Game Tương Tác
              </h2>
              <p className="text-sm text-center text-muted-foreground max-w-md">
                Mô tả game bạn muốn và AI sẽ tạo ra một trò chơi tương tác với Canvas
              </p>
            </motion.div>
            
            <motion.div 
              className="space-y-6" 
              variants={itemVariants}
            >
              <div>
                <Label 
                  htmlFor="prompt" 
                  className="flex items-center gap-2 text-lg font-medium mb-2 text-primary"
                >
                  <Sparkles className="h-5 w-5 text-primary animate-pulse" /> 
                  Mô tả game của bạn
                </Label>
                <div className="relative mt-2 group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
                  <Textarea
                    id="prompt"
                    placeholder={getPlaceholderText()}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={6}
                    className="relative font-mono text-base border-primary/20 focus-visible:ring-primary/30 bg-white/50 backdrop-blur-sm transition-all duration-300 hover:bg-white/70 focus:bg-white/90 rounded-lg"
                  />
                </div>
              </div>
              
              <div className="pt-2">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-sm text-primary/80">
                    <Zap className="h-4 w-4 text-primary animate-pulse" />
                    <span>Chế độ Canvas luôn được bật</span>
                  </div>
                </div>
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    onClick={handleSubmit}
                    disabled={!prompt.trim() || isGenerating}
                    className="w-full h-12 bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden relative"
                  >
                    {/* Hiệu ứng ánh sáng khi hover */}
                    <div className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-20 transform -translate-x-full group-hover:translate-x-0 transition-all duration-500"></div>
                    <Sparkles className="h-5 w-5 mr-2 animate-pulse group-hover:animate-spin" />
                    {isGenerating ? 'Đang tạo game...' : 'Tạo game với AI'}
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default CustomGameSettings;
