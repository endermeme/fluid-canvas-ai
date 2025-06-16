
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Gamepad, SparklesIcon, History, Share2, Zap, Atom, FlaskConical, Microscope, TestTube, Telescope, Radiation, Calculator, Beaker, Dna } from 'lucide-react';
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
      boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
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

  // Quantum particles animation
  const quantumParticles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    size: Math.random() * 10 + 3,
    delay: Math.random() * 10,
    duration: Math.random() * 20 + 10,
    x: Math.random() * 100,
    y: Math.random() * 100,
  }));

  // Science icons for background
  const scienceIcons = [
    { Icon: Atom, position: { top: '10%', left: '8%' }, rotation: 360, duration: 25 },
    { Icon: FlaskConical, position: { top: '20%', right: '10%' }, rotation: -180, duration: 30 },
    { Icon: Microscope, position: { bottom: '25%', left: '5%' }, rotation: 180, duration: 35 },
    { Icon: TestTube, position: { top: '60%', right: '15%' }, rotation: -360, duration: 28 },
    { Icon: Telescope, position: { bottom: '15%', right: '25%' }, rotation: 270, duration: 32 },
    { Icon: Radiation, position: { top: '40%', left: '3%' }, rotation: -270, duration: 26 },
    { Icon: Calculator, position: { bottom: '50%', right: '8%' }, rotation: 180, duration: 24 },
    { Icon: Beaker, position: { top: '75%', left: '25%' }, rotation: -360, duration: 29 },
    { Icon: Dna, position: { top: '30%', left: '88%' }, rotation: 360, duration: 31 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-blue-100 dark:from-blue-950 dark:via-sky-950 dark:to-blue-950 relative overflow-hidden">
      {/* Quantum Background Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Neural Network Grid */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 1000 1000">
            <defs>
              <pattern id="neural-grid" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <circle cx="50" cy="50" r="2" fill="currentColor" className="text-blue-500" />
                <line x1="50" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="0.5" className="text-blue-400" />
                <line x1="50" y1="50" x2="50" y2="100" stroke="currentColor" strokeWidth="0.5" className="text-blue-400" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#neural-grid)" />
          </svg>
        </div>

        {/* Floating Quantum Particles */}
        {quantumParticles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-gradient-to-r from-blue-400 to-sky-500 opacity-20"
            style={{
              width: particle.size,
              height: particle.size,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={{
              x: [0, 100, -50, 80, 0],
              y: [0, -80, 60, -40, 0],
              scale: [1, 1.5, 0.8, 1.2, 1],
              opacity: [0.2, 0.6, 0.3, 0.8, 0.2],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Science Icons Animation */}
        {scienceIcons.map((item, index) => (
          <motion.div
            key={index}
            className="absolute opacity-8"
            style={item.position}
            animate={{
              rotate: item.rotation,
            }}
            transition={{
              duration: item.duration,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <item.Icon className="w-12 h-12 text-blue-400/20" />
          </motion.div>
        ))}

        {/* Pulsing Energy Waves */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 w-80 h-80 border border-blue-300/20 rounded-full"
            style={{
              transform: 'translate(-50%, -50%)',
            }}
            animate={{
              scale: [1, 3, 1],
              opacity: [0.3, 0, 0.3],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              delay: i * 3.3,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <motion.div 
        className="relative z-10 min-h-screen flex items-center justify-center p-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="w-full max-w-6xl mx-auto">
          <motion.header 
            className="text-center mb-16"
            variants={itemVariants}
          >
            <motion.div
              className="flex items-center justify-center mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Zap className="h-16 w-16 text-blue-500 mr-4" />
              </motion.div>
              <motion.h1 
                className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-sky-600 to-blue-700 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                AI Game Creator
              </motion.h1>
              <motion.div
                animate={{
                  rotate: [0, -10, 10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2
                }}
              >
                <Atom className="h-16 w-16 text-sky-500 ml-4" />
              </motion.div>
            </motion.div>
            <motion.p 
              className="text-2xl text-slate-600 dark:text-slate-300 font-medium"
              variants={itemVariants}
            >
              Khám phá học tập tương tác với sức mạnh trí tuệ nhân tạo
            </motion.p>
          </motion.header>
          
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12" 
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
                  <Card className="p-10 h-full bg-gradient-to-br from-white/80 to-blue-50/80 dark:from-slate-800/80 dark:to-blue-950/80 border-2 border-blue-200/50 dark:border-blue-700/50 backdrop-blur-sm shadow-xl group relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-sky-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute -right-20 -top-20 w-40 h-40 bg-blue-400/10 rounded-full transform group-hover:scale-150 transition-transform duration-700"></div>
                    
                    <div className="relative z-10 flex flex-col items-center text-center gap-8 h-full">
                      <motion.div 
                        className="p-6 bg-gradient-to-br from-blue-100 to-sky-100 dark:from-blue-900/50 dark:to-sky-900/50 rounded-full shadow-lg"
                        variants={iconVariants}
                        whileHover="hover"
                      >
                        <SparklesIcon className="h-16 w-16 text-blue-600 dark:text-blue-400" />
                      </motion.div>
                      <div className="flex-1">
                        <h3 className="text-3xl font-bold mb-4 text-slate-800 dark:text-slate-100">Tạo Game HTML</h3>
                        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                          Sử dụng Gemini Flash để tạo game tương tác ngay lập tức với công nghệ AI tiên tiến
                        </p>
                      </div>
                      <Button variant="default" size="lg" className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 shadow-lg group-hover:shadow-xl transition-all">
                        <Zap className="h-5 w-5 mr-2" />
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
                  <Card className="p-10 h-full bg-gradient-to-br from-white/80 to-sky-50/80 dark:from-slate-800/80 dark:to-sky-950/80 border-2 border-sky-200/50 dark:border-sky-700/50 backdrop-blur-sm shadow-xl group relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute -right-20 -top-20 w-40 h-40 bg-sky-400/10 rounded-full transform group-hover:scale-150 transition-transform duration-700"></div>
                    
                    <div className="relative z-10 flex flex-col items-center text-center gap-8 h-full">
                      <motion.div 
                        className="p-6 bg-gradient-to-br from-sky-100 to-blue-100 dark:from-sky-900/50 dark:to-blue-900/50 rounded-full shadow-lg"
                        variants={iconVariants}
                        whileHover="hover"
                      >
                        <Gamepad className="h-16 w-16 text-sky-600 dark:text-sky-400" />
                      </motion.div>
                      <div className="flex-1">
                        <h3 className="text-3xl font-bold mb-4 text-slate-800 dark:text-slate-100">Trò Chơi Có Sẵn</h3>
                        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                          Sử dụng Gemini Pro để tạo trò chơi theo mẫu có sẵn với nhiều thể loại phong phú
                        </p>
                      </div>
                      <Button variant="outline" size="lg" className="w-full py-4 text-lg font-semibold border-2 border-sky-300 text-sky-700 hover:bg-sky-50 dark:border-sky-600 dark:text-sky-300 dark:hover:bg-sky-950/50 shadow-lg group-hover:shadow-xl transition-all">
                        <Atom className="h-5 w-5 mr-2" />
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
                <Card className="p-8 border-2 border-blue-200/50 dark:border-blue-700/50 bg-gradient-to-r from-white/80 to-blue-50/80 dark:from-slate-800/80 dark:to-blue-950/80 backdrop-blur-sm shadow-xl group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-sky-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative z-10 flex items-center gap-6">
                    <motion.div 
                      className="p-4 bg-gradient-to-br from-blue-100 to-sky-100 dark:from-blue-900/50 dark:to-sky-900/50 rounded-full shadow-lg"
                      variants={iconVariants}
                      whileHover="hover"
                    >
                      <History className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="font-bold text-2xl mb-2 text-slate-800 dark:text-slate-100">Lịch Sử Game</h3>
                      <p className="text-slate-600 dark:text-slate-300 text-lg">
                        Xem và quản lý các trò chơi đã tạo, theo dõi tiến trình học tập
                      </p>
                    </div>
                    <motion.div
                      animate={{
                        x: [0, 5, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <Share2 className="h-6 w-6 text-blue-500 dark:text-blue-400" />
                    </motion.div>
                  </div>
                </Card>
              </motion.div>
            </Link>
          </motion.div>
          
          <motion.footer 
            className="mt-16 text-center text-slate-500 dark:text-slate-400"
            variants={itemVariants}
          >
            <motion.p 
              className="text-lg font-medium"
              animate={{
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              © {new Date().getFullYear()} AI Game Creator | Powered by Quantum Learning & Gemini AI
            </motion.p>
          </motion.footer>
        </div>
      </motion.div>
    </div>
  );
};

export default HomePage;
