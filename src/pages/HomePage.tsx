
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Gamepad, History, 
  Zap, Play, Brain, Code2, 
  ArrowRight, Sparkles, Star,
  Lightbulb, Target
} from 'lucide-react';
import { motion } from 'framer-motion';

const HomePage: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const cardVariants = {
    hover: {
      scale: 1.02,
      y: -4,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-sky-400/20 to-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-sky-300/10 to-blue-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <motion.div 
          className="px-6 py-12 lg:py-20"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="text-center max-w-6xl mx-auto">
            <motion.div 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-500/10 to-blue-500/10 backdrop-blur-sm border border-sky-200/30 px-6 py-3 rounded-full text-sky-700 dark:text-sky-300 font-medium mb-8"
              variants={itemVariants}
            >
              <Zap className="h-5 w-5" />
              Tạo game học tập thông minh với AI
              <Sparkles className="h-4 w-4" />
            </motion.div>
            
            <motion.h1 
              className="text-6xl sm:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-8 leading-tight"
              variants={itemVariants}
            >
              AI Game Creator
            </motion.h1>
            
            <motion.p 
              className="text-xl sm:text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto mb-16 leading-relaxed"
              variants={itemVariants}
            >
              Biến việc học thành trải nghiệm thú vị với các trò chơi được tạo bởi trí tuệ nhân tạo.
              <br />
              Chỉ cần nhập chủ đề, chúng tôi sẽ tạo ra game phù hợp ngay lập tức.
            </motion.p>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="px-6 pb-20">
          <div className="max-w-7xl mx-auto">
            {/* Main Action Cards */}
            <motion.div 
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Custom Game Card */}
              <motion.div variants={itemVariants}>
                <Link to="/custom-game" className="block group">
                  <motion.div variants={cardVariants} whileHover="hover">
                    <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white/80 to-sky-50/80 dark:from-slate-800/80 dark:to-blue-900/50 backdrop-blur-xl h-full">
                      <div className="absolute inset-0 bg-gradient-to-r from-sky-500/5 to-blue-500/5"></div>
                      <div className="absolute -right-20 -top-20 w-40 h-40 bg-gradient-to-r from-sky-400/20 to-blue-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                      
                      <div className="relative z-10 p-8 lg:p-10">
                        <div className="flex items-start gap-6 mb-8">
                          <div className="p-4 bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow">
                            <Code2 className="h-10 w-10 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-3xl font-bold mb-3 text-slate-800 dark:text-slate-100">Tạo Game HTML</h3>
                            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                              Sử dụng Gemini Flash để tạo game tương tác ngay lập tức
                            </p>
                          </div>
                        </div>
                        
                        <div className="space-y-4 mb-8">
                          <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-sky-100 dark:bg-sky-900/30 rounded-lg">
                              <Sparkles className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                            </div>
                            <span className="text-slate-600 dark:text-slate-300">Game HTML tùy chỉnh hoàn toàn</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                              <Brain className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <span className="text-slate-600 dark:text-slate-300">Được tạo bởi AI thông minh</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                              <Zap className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <span className="text-slate-600 dark:text-slate-300">Tạo nhanh chỉ trong vài giây</span>
                          </div>
                        </div>
                        
                        <Button 
                          size="lg" 
                          className="w-full h-14 text-lg bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold shadow-lg group-hover:shadow-xl transition-all rounded-xl"
                        >
                          <Play className="mr-3 h-5 w-5" />
                          Bắt đầu tạo
                          <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                </Link>
              </motion.div>

              {/* Preset Games Card */}
              <motion.div variants={itemVariants}>
                <Link to="/preset-games" className="block group">
                  <motion.div variants={cardVariants} whileHover="hover">
                    <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white/80 to-emerald-50/80 dark:from-slate-800/80 dark:to-emerald-900/50 backdrop-blur-xl h-full">
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5"></div>
                      <div className="absolute -right-20 -top-20 w-40 h-40 bg-gradient-to-r from-emerald-400/20 to-teal-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                      
                      <div className="relative z-10 p-8 lg:p-10">
                        <div className="flex items-start gap-6 mb-8">
                          <div className="p-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow">
                            <Gamepad className="h-10 w-10 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-3xl font-bold mb-3 text-slate-800 dark:text-slate-100">Trò Chơi Có Sẵn</h3>
                            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                              Sử dụng Gemini Pro để tạo trò chơi theo mẫu có sẵn
                            </p>
                          </div>
                        </div>
                        
                        <div className="space-y-4 mb-8">
                          <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                              <Star className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <span className="text-slate-600 dark:text-slate-300">7 loại game đa dạng</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
                              <Target className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                            </div>
                            <span className="text-slate-600 dark:text-slate-300">Tối ưu cho việc học tập</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg">
                              <Lightbulb className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                            </div>
                            <span className="text-slate-600 dark:text-slate-300">Chất lượng đảm bảo</span>
                          </div>
                        </div>
                        
                        <Button 
                          variant="outline" 
                          size="lg" 
                          className="w-full h-14 text-lg border-2 border-emerald-200 dark:border-emerald-700 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:border-emerald-300 dark:hover:border-emerald-600 text-emerald-700 dark:text-emerald-300 font-semibold shadow-lg hover:shadow-xl transition-all rounded-xl"
                        >
                          <Gamepad className="mr-3 h-5 w-5" />
                          Xem trò chơi
                          <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                </Link>
              </motion.div>
            </motion.div>

            {/* Game History Card */}
            <motion.div 
              className="max-w-3xl mx-auto"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <Link to="/game-history" className="block group">
                <motion.div variants={cardVariants} whileHover="hover">
                  <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-r from-white/80 to-amber-50/80 dark:from-slate-800/80 dark:to-amber-900/50 backdrop-blur-xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-orange-500/5"></div>
                    <div className="absolute -right-16 -top-16 w-32 h-32 bg-gradient-to-r from-amber-400/20 to-orange-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                    
                    <div className="relative z-10 p-8">
                      <div className="flex items-center gap-6">
                        <div className="p-4 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow">
                          <History className="h-8 w-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-2xl mb-2 text-slate-800 dark:text-slate-100">Lịch Sử Game</h3>
                          <p className="text-lg text-slate-600 dark:text-slate-300">
                            Xem và quản lý các trò chơi đã tạo trước đó
                          </p>
                        </div>
                        <ArrowRight className="h-6 w-6 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
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
          className="py-8 text-center text-slate-500 dark:text-slate-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-lg">© {new Date().getFullYear()} AI Game Creator | Powered by Gemini AI</p>
        </motion.footer>
      </div>
    </div>
  );
};

export default HomePage;
