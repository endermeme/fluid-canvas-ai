
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Gamepad, SparklesIcon, History, 
  Zap, Play, Brain, Code2, 
  ArrowRight, Sparkles 
} from 'lucide-react';
import { motion } from 'framer-motion';

const HomePage: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const cardVariants = {
    hover: {
      scale: 1.02,
      y: -8,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15
      }
    },
    tap: {
      scale: 0.98
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-3xl"></div>
        <div className="relative px-6 py-16 lg:py-24">
          <motion.div 
            className="text-center max-w-5xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div 
              className="inline-flex items-center gap-2 bg-primary/10 px-6 py-3 rounded-full text-primary font-medium mb-8"
              variants={itemVariants}
            >
              <Zap className="h-5 w-5" />
              Tạo game học tập thông minh với AI
            </motion.div>
            
            <motion.h1 
              className="text-5xl sm:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-8"
              variants={itemVariants}
            >
              AI Game Creator
            </motion.h1>
            
            <motion.p 
              className="text-xl sm:text-2xl text-muted-foreground max-w-4xl mx-auto mb-12 leading-relaxed"
              variants={itemVariants}
            >
              Biến việc học thành trải nghiệm thú vị với các trò chơi được tạo bởi trí tuệ nhân tạo. 
              Chỉ cần nhập chủ đề, chúng tôi sẽ tạo ra game phù hợp ngay lập tức.
            </motion.p>
          </motion.div>
        </div>
      </div>

      <div className="px-6 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Main Action Cards */}
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12" 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Custom Game Card */}
            <motion.div variants={itemVariants}>
              <Link to="/custom-game" className="block">
                <motion.div
                  variants={cardVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Card className="relative overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-slate-700 h-full">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
                    <div className="absolute -right-16 -top-16 w-32 h-32 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-full transform group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="relative z-10 p-10">
                      <div className="flex flex-col gap-8">
                        <div className="flex items-center gap-4">
                          <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                            <Code2 className="h-10 w-10 text-white" />
                          </div>
                          <div>
                            <h3 className="text-3xl font-bold mb-2 text-foreground">Tạo Game HTML</h3>
                            <p className="text-lg text-muted-foreground">
                              Sử dụng Gemini Flash để tạo game tương tác ngay lập tức
                            </p>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 text-muted-foreground">
                            <Sparkles className="h-5 w-5 text-primary" />
                            <span>Game HTML tùy chỉnh hoàn toàn</span>
                          </div>
                          <div className="flex items-center gap-3 text-muted-foreground">
                            <Brain className="h-5 w-5 text-primary" />
                            <span>Được tạo bởi AI thông minh</span>
                          </div>
                          <div className="flex items-center gap-3 text-muted-foreground">
                            <Zap className="h-5 w-5 text-primary" />
                            <span>Tạo nhanh chỉ trong vài giây</span>
                          </div>
                        </div>
                        
                        <Button 
                          size="lg" 
                          className="w-full h-14 text-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold shadow-lg group-hover:shadow-xl transition-all"
                        >
                          <Play className="mr-3 h-5 w-5" />
                          Bắt đầu tạo
                          <ArrowRight className="ml-3 h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </Link>
            </motion.div>

            {/* Preset Games Card */}
            <motion.div variants={itemVariants}>
              <Link to="/preset-games" className="block">
                <motion.div
                  variants={cardVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Card className="relative overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-white to-green-50 dark:from-slate-800 dark:to-slate-700 h-full">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-teal-500/5"></div>
                    <div className="absolute -right-16 -top-16 w-32 h-32 bg-gradient-to-r from-green-500/20 to-teal-600/20 rounded-full transform group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="relative z-10 p-10">
                      <div className="flex flex-col gap-8">
                        <div className="flex items-center gap-4">
                          <div className="p-4 bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl shadow-lg">
                            <Gamepad className="h-10 w-10 text-white" />
                          </div>
                          <div>
                            <h3 className="text-3xl font-bold mb-2 text-foreground">Trò Chơi Có Sẵn</h3>
                            <p className="text-lg text-muted-foreground">
                              Sử dụng Gemini Pro để tạo trò chơi theo mẫu có sẵn
                            </p>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 text-muted-foreground">
                            <Sparkles className="h-5 w-5 text-green-600" />
                            <span>7 loại game đa dạng</span>
                          </div>
                          <div className="flex items-center gap-3 text-muted-foreground">
                            <Brain className="h-5 w-5 text-green-600" />
                            <span>Tối ưu cho việc học tập</span>
                          </div>
                          <div className="flex items-center gap-3 text-muted-foreground">
                            <Zap className="h-5 w-5 text-green-600" />
                            <span>Chất lượng đảm bảo</span>
                          </div>
                        </div>
                        
                        <Button 
                          variant="outline" 
                          size="lg" 
                          className="w-full h-14 text-lg border-2 border-green-500/30 bg-white/80 backdrop-blur-sm hover:bg-green-50 hover:border-green-500/50 text-green-700 font-semibold shadow-lg hover:shadow-xl transition-all"
                        >
                          <Gamepad className="mr-3 h-5 w-5" />
                          Xem trò chơi
                          <ArrowRight className="ml-3 h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>

          {/* Game History Card */}
          <motion.div 
            className="max-w-2xl mx-auto"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <Link to="/game-history">
              <motion.div
                variants={cardVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-r from-white to-orange-50 dark:from-slate-800 dark:to-slate-700">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-amber-500/5"></div>
                  <div className="relative z-10 p-8">
                    <div className="flex items-center gap-6">
                      <div className="p-4 bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl shadow-lg">
                        <History className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-2xl mb-2 text-foreground">Lịch Sử Game</h3>
                        <p className="text-lg text-muted-foreground">
                          Xem và quản lý các trò chơi đã tạo trước đó
                        </p>
                      </div>
                      <ArrowRight className="h-6 w-6 text-muted-foreground" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </div>
      
      {/* Footer */}
      <motion.footer 
        className="py-8 text-center text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <p className="text-lg">© {new Date().getFullYear()} AI Game Creator | Powered by Gemini AI</p>
      </motion.footer>
    </div>
  );
};

export default HomePage;
