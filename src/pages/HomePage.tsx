
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
      scale: 1.03,
      boxShadow: "0 20px 30px rgba(0,0,0,0.1)",
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
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-b from-primary/5 to-background">
      {/* Background text */}
      <div className="absolute inset-0 flex items-center justify-center -z-10 select-none pointer-events-none">
        <h1 className="text-[12rem] md:text-[16rem] font-bold text-primary/5 whitespace-nowrap">
          Học cùng AI
        </h1>
      </div>

      {/* Background floating shapes */}
      <div className="absolute inset-0 -z-20 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-64 h-64 bg-primary/5 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              delay: i * 1.5,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-4">
            AI Game Creator
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Tạo trò chơi tương tác bằng trí tuệ nhân tạo
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <motion.div variants={itemVariants}>
            <Link to="/custom-game" className="block">
              <motion.div
                variants={cardVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Card className="p-8 hover:shadow-xl transition-all duration-300 hover:border-primary hover:bg-primary/5 cursor-pointer transform hover:scale-105 border-border">
                  <div className="flex flex-col items-center text-center gap-6 h-full">
                    <div className="p-4 bg-primary/10 rounded-full">
                      <SparklesIcon className="h-12 w-12 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-3">Tạo Game HTML</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Sử dụng Gemini Flash để tạo game tương tác ngay lập tức
                      </p>
                    </div>
                    <div className="mt-auto w-full">
                      <div className="flex items-center justify-center px-4 py-2 rounded-lg bg-gradient-to-r from-primary/20 to-primary/10 text-primary text-sm font-medium">
                        <SparklesIcon className="h-4 w-4 mr-2" />
                        Tạo với AI
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Link to="/preset-games" className="block">
              <motion.div
                variants={cardVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Card className="p-8 hover:shadow-xl transition-all duration-300 hover:border-primary hover:bg-primary/5 cursor-pointer transform hover:scale-105 border-border">
                  <div className="flex flex-col items-center text-center gap-6 h-full">
                    <div className="p-4 bg-primary/10 rounded-full">
                      <Gamepad className="h-12 w-12 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-3">Trò Chơi Có Sẵn</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Sử dụng Gemini Pro để tạo trò chơi theo mẫu có sẵn
                      </p>
                    </div>
                    <div className="mt-auto w-full">
                      <div className="flex items-center justify-center px-4 py-2 rounded-lg bg-gradient-to-r from-primary/20 to-primary/10 text-primary text-sm font-medium">
                        <SparklesIcon className="h-4 w-4 mr-2" />
                        Tạo với AI
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Link to="/game-history" className="block">
              <motion.div
                variants={cardVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Card className="p-8 hover:shadow-xl transition-all duration-300 hover:border-primary hover:bg-primary/5 cursor-pointer transform hover:scale-105 border-border">
                  <div className="flex flex-col items-center text-center gap-6 h-full">
                    <div className="p-4 bg-primary/10 rounded-full">
                      <History className="h-12 w-12 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-3">Lịch Sử Game</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Xem và quản lý các trò chơi đã tạo
                      </p>
                    </div>
                    <div className="mt-auto w-full">
                      <div className="flex items-center justify-center px-4 py-2 rounded-lg bg-gradient-to-r from-primary/20 to-primary/10 text-primary text-sm font-medium">
                        <SparklesIcon className="h-4 w-4 mr-2" />
                        Tạo với AI
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </Link>
          </motion.div>
        </div>
        
        <motion.footer 
          className="mt-12 text-center text-muted-foreground text-sm"
          variants={itemVariants}
        >
          <p>© {new Date().getFullYear()} AI Game Creator | Powered by Gemini AI</p>
        </motion.footer>
      </div>
    </div>
  );
};

export default HomePage;
