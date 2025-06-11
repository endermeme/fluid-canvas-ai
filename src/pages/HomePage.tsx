
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
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background floating shapes */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-64 h-64 bg-sky-200/20 rounded-full blur-xl"
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
            className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6"
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
            className="text-xl md:text-2xl text-gray-600 font-medium"
            variants={itemVariants}
          >
            Tạo trò chơi tương tác bằng trí tuệ nhân tạo
          </motion.p>
          <motion.div 
            className="mt-4 w-24 h-1 bg-gradient-to-r from-sky-400 to-blue-500 mx-auto rounded-full"
            variants={itemVariants}
          />
        </motion.header>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12" 
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <Link to="/custom-game" className="block h-full">
              <motion.div
                variants={cardVariants}
                whileHover="hover"
                whileTap="tap"
                className="h-full"
              >
                <Card className="p-8 h-full bg-white/70 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-sky-400/10 via-blue-400/10 to-indigo-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute -right-20 -top-20 w-40 h-40 bg-gradient-to-br from-sky-200 to-blue-300 rounded-full opacity-20 transform group-hover:scale-150 transition-transform duration-500"></div>
                  
                  <div className="relative z-10 flex flex-col items-center text-center gap-6 h-full justify-center">
                    <motion.div 
                      className="p-6 bg-gradient-to-br from-sky-100 to-blue-100 rounded-2xl shadow-lg"
                      variants={iconVariants}
                      whileHover="hover"
                    >
                      <SparklesIcon className="h-12 w-12 text-sky-600" />
                    </motion.div>
                    <div>
                      <h3 className="text-2xl font-bold mb-3 text-gray-800">Tạo Game HTML</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Sử dụng Gemini Flash để tạo game tương tác ngay lập tức với HTML, CSS và JavaScript
                      </p>
                    </div>
                    <Button 
                      className="w-full mt-4 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 py-3 text-lg font-semibold" 
                      size="lg"
                    >
                      Bắt đầu tạo
                    </Button>
                  </div>
                </Card>
              </motion.div>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Link to="/preset-games" className="block h-full">
              <motion.div
                variants={cardVariants}
                whileHover="hover"
                whileTap="tap"
                className="h-full"
              >
                <Card className="p-8 h-full bg-white/70 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/10 via-purple-400/10 to-pink-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute -right-20 -top-20 w-40 h-40 bg-gradient-to-br from-indigo-200 to-purple-300 rounded-full opacity-20 transform group-hover:scale-150 transition-transform duration-500"></div>
                  
                  <div className="relative z-10 flex flex-col items-center text-center gap-6 h-full justify-center">
                    <motion.div 
                      className="p-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl shadow-lg"
                      variants={iconVariants}
                      whileHover="hover"
                    >
                      <Gamepad className="h-12 w-12 text-indigo-600" />
                    </motion.div>
                    <div>
                      <h3 className="text-2xl font-bold mb-3 text-gray-800">Trò Chơi Có Sẵn</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Sử dụng Gemini Pro để tạo trò chơi theo mẫu có sẵn với nội dung tùy chỉnh
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full mt-4 border-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-300 py-3 text-lg font-semibold bg-white/50" 
                      size="lg"
                    >
                      Xem trò chơi
                    </Button>
                  </div>
                </Card>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants} className="flex justify-center">
          <Link to="/game-history" className="w-full max-w-2xl">
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Card className="p-6 bg-white/60 backdrop-blur-md border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-teal-400/10 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 flex items-center gap-6">
                  <motion.div 
                    className="p-4 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl shadow-md"
                    variants={iconVariants}
                    whileHover="hover"
                  >
                    <History className="h-8 w-8 text-emerald-600" />
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="font-bold text-xl text-gray-800 mb-1">Lịch Sử Game</h3>
                    <p className="text-gray-600">
                      Xem và quản lý các trò chơi đã tạo trước đây
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </Link>
        </motion.div>
        
        <motion.footer 
          className="mt-16 text-center text-gray-500 text-sm"
          variants={itemVariants}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-0.5 bg-gradient-to-r from-transparent to-gray-300"></div>
            <span>© {new Date().getFullYear()} AI Game Creator</span>
            <div className="w-8 h-0.5 bg-gradient-to-l from-transparent to-gray-300"></div>
          </div>
          <p className="text-xs">Powered by Gemini AI</p>
        </motion.footer>
      </motion.div>
    </div>
  );
};

export default HomePage;
