
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Gamepad, SparklesIcon, History, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

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

  const iconVariants = {
    hover: {
      rotate: 10,
      scale: 1.1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 10
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background p-4 relative overflow-hidden">
      {/* Background floating shapes */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
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

      <motion.div 
        className="w-full max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.header 
          className="text-center mb-12"
          variants={itemVariants}
        >
          <motion.h1 
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-4"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            AI Game Creator
          </motion.h1>
          <motion.p 
            className="text-xl text-muted-foreground"
            variants={itemVariants}
          >
            Tạo trò chơi tương tác bằng trí tuệ nhân tạo
          </motion.p>
        </motion.header>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8" 
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <Link to="/custom-game" className="block">
              <motion.div
                variants={cardVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Card className="p-8 h-full bg-gradient-to-br from-background to-primary/5 border-2 border-primary/20 overflow-hidden group relative">
                  <div className="absolute -right-16 -top-16 w-32 h-32 bg-primary/10 rounded-full transform group-hover:scale-150 transition-transform duration-500"></div>
                  <div className="relative z-10 flex flex-col items-center text-center gap-6">
                    <div className="relative">
                      <motion.div 
                        className="p-4 bg-primary/10 rounded-full"
                        variants={iconVariants}
                        whileHover="hover"
                      >
                        <SparklesIcon className="h-12 w-12 text-primary" />
                      </motion.div>
                      <Badge 
                        variant="default"
                        className="absolute -top-2 -right-2 bg-red-500 text-white font-bold"
                      >
                        BETA
                      </Badge>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-2">Tạo Game HTML</h3>
                      <p className="text-muted-foreground">
                        Sử dụng Gemini Flash để tạo game tương tác ngay lập tức
                      </p>
                    </div>
                    <Button variant="default" size="lg" className="w-full mt-4 group-hover:shadow-lg transition-all">
                      Bắt đầu tạo
                    </Button>
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
                <Card className="p-8 h-full bg-gradient-to-br from-background to-primary/5 border-2 border-primary/20 overflow-hidden group relative">
                  <div className="absolute -right-16 -top-16 w-32 h-32 bg-primary/10 rounded-full transform group-hover:scale-150 transition-transform duration-500"></div>
                  <div className="relative z-10 flex flex-col items-center text-center gap-6">
                    <div className="relative">
                      <motion.div 
                        className="p-4 bg-primary/10 rounded-full"
                        variants={iconVariants}
                        whileHover="hover"
                      >
                        <Gamepad className="h-12 w-12 text-primary" />
                      </motion.div>
                      <Badge 
                        variant="secondary"
                        className="absolute -top-2 -right-2 bg-primary text-white font-bold"
                      >
                        Chính thức
                      </Badge>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-2">Trò Chơi Có Sẵn</h3>
                      <p className="text-muted-foreground">
                        Sử dụng Gemini Pro để tạo trò chơi theo mẫu có sẵn
                      </p>
                    </div>
                    <Button variant="outline" size="lg" className="w-full mt-4 group-hover:shadow-lg transition-all">
                      Xem trò chơi
                    </Button>
                  </div>
                </Card>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Link to="/game-history">
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Card className="p-6 border border-primary/20 overflow-hidden relative bg-gradient-to-r hover:from-primary/5">
                <div className="flex items-center gap-4">
                  <motion.div 
                    className="p-3 bg-primary/10 rounded-full"
                    variants={iconVariants}
                    whileHover="hover"
                  >
                    <History className="h-6 w-6 text-primary" />
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">Lịch Sử Game</h3>
                    <p className="text-sm text-muted-foreground">
                      Xem và quản lý các trò chơi đã tạo
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
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
