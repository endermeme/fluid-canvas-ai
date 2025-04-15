
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Gamepad, SparklesIcon, History, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';

const HomePage: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background p-4 flex flex-col justify-center items-center">
      <motion.div 
        className="w-full max-w-4xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.header 
          className="text-center mb-12"
          variants={itemVariants}
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-4">
            AI Game Creator
          </h1>
          <p className="text-xl text-muted-foreground">
            Tạo trò chơi tương tác bằng trí tuệ nhân tạo
          </p>
        </motion.header>
        
        <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8" variants={containerVariants}>
          <motion.div variants={itemVariants}>
            <Link to="/custom-game" className="block transform transition-all duration-300 hover:scale-[1.02]">
              <Card className="p-8 h-full hover:shadow-lg transition-all hover:border-primary hover:bg-primary/5 cursor-pointer border-2 border-primary/20 overflow-hidden group relative">
                <div className="absolute -right-16 -top-16 w-32 h-32 bg-primary/10 rounded-full transform group-hover:scale-110 transition-transform"></div>
                <div className="relative z-10 flex flex-col items-center text-center gap-6">
                  <div className="p-4 bg-primary/10 rounded-full transform group-hover:scale-110 transition-transform">
                    <SparklesIcon className="h-12 w-12 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Tạo Game HTML</h3>
                    <p className="text-muted-foreground">
                      Sử dụng Gemini Flash để tạo game tương tác ngay lập tức
                    </p>
                  </div>
                  <Button variant="default" size="lg" className="w-full mt-4">
                    Bắt đầu tạo
                  </Button>
                </div>
              </Card>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Link to="/preset-games" className="block transform transition-all duration-300 hover:scale-[1.02]">
              <Card className="p-8 h-full hover:shadow-lg transition-all hover:border-primary hover:bg-primary/5 cursor-pointer border-2 border-primary/20 overflow-hidden group relative">
                <div className="absolute -right-16 -top-16 w-32 h-32 bg-primary/10 rounded-full transform group-hover:scale-110 transition-transform"></div>
                <div className="relative z-10 flex flex-col items-center text-center gap-6">
                  <div className="p-4 bg-primary/10 rounded-full transform group-hover:scale-110 transition-transform">
                    <Gamepad className="h-12 w-12 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Trò Chơi Có Sẵn</h3>
                    <p className="text-muted-foreground">
                      Sử dụng Gemini Pro để tạo trò chơi theo mẫu có sẵn
                    </p>
                  </div>
                  <Button variant="outline" size="lg" className="w-full mt-4">
                    Xem trò chơi
                  </Button>
                </div>
              </Card>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Link to="/game-history">
            <Card className="p-6 hover:shadow-lg transition-all hover:border-primary/50 hover:bg-primary/5 border border-primary/20 overflow-hidden transform hover:scale-[1.02] duration-300">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <History className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">Lịch Sử Game</h3>
                  <p className="text-sm text-muted-foreground">
                    Xem và quản lý các trò chơi đã tạo
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        </motion.div>
        
        <motion.footer 
          className="mt-12 text-center text-muted-foreground text-sm"
          variants={itemVariants}
        >
          <p>© {new Date().getFullYear()} AI Game Creator | Powered by Gemini AI</p>
        </motion.footer>
      </motion.div>
    </div>
  );
};

export default HomePage;
