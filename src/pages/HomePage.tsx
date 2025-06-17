
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Gamepad, SparklesIcon, History, Share2, Zap, Atom, FlaskConical, Microscope, TestTube, Telescope, Radiation, Calculator, Beaker, Dna } from 'lucide-react';
import { motion } from 'framer-motion';
import BackgroundParticles from '@/components/ui/background-particles';

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
    hidden: { y: 27, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 90,
        damping: 9
      }
    }
  };

  const cardVariants = {
    hover: {
      scale: 1.027,
      boxShadow: "0 23px 45px rgba(0,0,0,0.135)",
      transition: {
        type: "spring",
        stiffness: 270,
        damping: 13.5
      }
    },
    tap: {
      scale: 0.982
    }
  };

  const iconVariants = {
    hover: {
      rotate: 9,
      scale: 1.09,
      transition: {
        type: "spring",
        stiffness: 270,
        damping: 9
      }
    }
  };

  // Science icons for background (stable positions)
  const scienceIcons = React.useMemo(() => [
    { Icon: Atom, position: { top: '10%', left: '8%' }, rotation: 324, duration: 22.5 },
    { Icon: FlaskConical, position: { top: '20%', right: '10%' }, rotation: -162, duration: 27 },
    { Icon: Microscope, position: { bottom: '25%', left: '5%' }, rotation: 162, duration: 31.5 },
    { Icon: TestTube, position: { top: '60%', right: '15%' }, rotation: -324, duration: 25.2 },
    { Icon: Telescope, position: { bottom: '15%', right: '25%' }, rotation: 243, duration: 28.8 },
    { Icon: Radiation, position: { top: '40%', left: '3%' }, rotation: -243, duration: 23.4 },
    { Icon: Calculator, position: { bottom: '50%', right: '8%' }, rotation: 162, duration: 21.6 },
    { Icon: Beaker, position: { top: '75%', left: '25%' }, rotation: -324, duration: 26.1 },
    { Icon: Dna, position: { top: '30%', left: '88%' }, rotation: 324, duration: 27.9 },
  ], []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-blue-100 dark:from-blue-950 dark:via-sky-950 dark:to-blue-950 relative overflow-hidden">
      {/* Optimized Background Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Neural Network Grid */}
        <div className="absolute inset-0 opacity-9">
          <svg className="w-full h-full" viewBox="0 0 900 900">
            <defs>
              <pattern id="neural-grid" x="0" y="0" width="90" height="90" patternUnits="userSpaceOnUse">
                <circle cx="45" cy="45" r="1.8" fill="currentColor" className="text-blue-500" />
                <line x1="45" y1="45" x2="90" y2="45" stroke="currentColor" strokeWidth="0.45" className="text-blue-400" />
                <line x1="45" y1="45" x2="45" y2="90" stroke="currentColor" strokeWidth="0.45" className="text-blue-400" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#neural-grid)" />
          </svg>
        </div>

        {/* Floating Quantum Particles */}
        <BackgroundParticles particleCount={13} />

        {/* Science Icons Animation */}
        {scienceIcons.map((item, index) => (
          <motion.div
            key={index}
            className="absolute opacity-7"
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
            <item.Icon className="w-10 h-10 text-blue-400/18" />
          </motion.div>
        ))}

        {/* Pulsing Energy Waves */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 w-72 h-72 border border-blue-300/18 rounded-full"
            style={{
              transform: 'translate(-50%, -50%)',
            }}
            animate={{
              scale: [1, 2.7, 1],
              opacity: [0.27, 0, 0.27],
            }}
            transition={{
              duration: 9,
              repeat: Infinity,
              delay: i * 2.97,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <motion.div 
        className="relative z-10 min-h-screen flex items-center justify-center p-5"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="w-full max-w-5xl mx-auto">
          <motion.header 
            className="text-center mb-14"
            variants={itemVariants}
          >
            <motion.div
              className="flex items-center justify-center mb-5"
              whileHover={{ scale: 1.045 }}
            >
              <motion.div
                animate={{
                  rotate: [0, 9, -9, 0],
                }}
                transition={{
                  duration: 3.6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Zap className="h-14 w-14 text-blue-500 mr-3" />
              </motion.div>
              <motion.h1 
                className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-sky-600 to-blue-700 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 7.2,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                AI Game Creator
              </motion.h1>
              <motion.div
                animate={{
                  rotate: [0, -9, 9, 0],
                }}
                transition={{
                  duration: 3.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.8
                }}
              >
                <Atom className="h-14 w-14 text-sky-500 ml-3" />
              </motion.div>
            </motion.div>
            <motion.p 
              className="text-xl text-slate-600 dark:text-slate-300 font-medium"
              variants={itemVariants}
            >
              Khám phá học tập tương tác với sức mạnh trí tuệ nhân tạo
            </motion.p>
          </motion.header>
          
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-7 mb-10" 
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
                  <Card className="p-9 h-full bg-gradient-to-br from-white/80 to-blue-50/80 dark:from-slate-800/80 dark:to-blue-950/80 border-2 border-blue-200/45 dark:border-blue-700/45 backdrop-blur-sm shadow-xl group relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-sky-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-450"></div>
                    <div className="absolute -right-18 -top-18 w-36 h-36 bg-blue-400/9 rounded-full transform group-hover:scale-135 transition-transform duration-630"></div>
                    
                    <div className="relative z-10 flex flex-col items-center text-center gap-7 h-full">
                      <motion.div 
                        className="p-5 bg-gradient-to-br from-blue-100 to-sky-100 dark:from-blue-900/45 dark:to-sky-900/45 rounded-full shadow-lg"
                        variants={iconVariants}
                        whileHover="hover"
                      >
                        <SparklesIcon className="h-14 w-14 text-blue-600 dark:text-blue-400" />
                      </motion.div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-3 text-blue-600 dark:text-blue-400">Custom Game</h3>
                      </div>
                      <Button variant="default" size="lg" className="w-full py-3 text-lg font-semibold bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 shadow-lg group-hover:shadow-xl transition-all">
                        <Zap className="h-4 w-4 mr-2" />
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
                  <Card className="p-9 h-full bg-gradient-to-br from-white/80 to-sky-50/80 dark:from-slate-800/80 dark:to-sky-950/80 border-2 border-blue-200/45 dark:border-blue-700/45 backdrop-blur-sm shadow-xl group relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-sky-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-450"></div>
                    <div className="absolute -right-18 -top-18 w-36 h-36 bg-blue-400/9 rounded-full transform group-hover:scale-135 transition-transform duration-630"></div>
                    
                    <div className="relative z-10 flex flex-col items-center text-center gap-7 h-full">
                      <motion.div 
                        className="p-5 bg-gradient-to-br from-blue-100 to-sky-100 dark:from-blue-900/45 dark:to-sky-900/45 rounded-full shadow-lg"
                        variants={iconVariants}
                        whileHover="hover"
                      >
                        <Gamepad className="h-14 w-14 text-blue-600 dark:text-blue-400" />
                      </motion.div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-3 text-blue-600 dark:text-blue-400">Preset Game</h3>
                      </div>
                      <Button variant="default" size="lg" className="w-full py-3 text-lg font-semibold bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 shadow-lg group-hover:shadow-xl transition-all">
                        <Atom className="h-4 w-4 mr-2" />
                        Xem trò chơi
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div variants={itemVariants} className="flex justify-center">
            <Link to="/game-history" className="w-full max-w-xl">
              <motion.div
                variants={cardVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Card className="p-7 border-2 border-blue-200/45 dark:border-blue-700/45 bg-gradient-to-r from-white/80 to-blue-50/80 dark:from-slate-800/80 dark:to-blue-950/80 backdrop-blur-sm shadow-xl group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-sky-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-450"></div>
                  
                  <div className="relative z-10 flex items-center gap-5">
                    <motion.div 
                      className="p-3 bg-gradient-to-br from-blue-100 to-sky-100 dark:from-blue-900/45 dark:to-sky-900/45 rounded-full shadow-lg"
                      variants={iconVariants}
                      whileHover="hover"
                    >
                      <History className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="font-bold text-xl mb-2 text-slate-800 dark:text-slate-100">Lịch Sử Game</h3>
                    </div>
                    <motion.div
                      animate={{
                        x: [0, 4.5, 0],
                      }}
                      transition={{
                        duration: 1.8,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <Share2 className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                    </motion.div>
                  </div>
                </Card>
              </motion.div>
            </Link>
          </motion.div>
          
          <motion.footer 
            className="mt-14 text-center text-slate-500 dark:text-slate-400"
            variants={itemVariants}
          >
            <motion.p 
              className="text-lg font-medium"
              animate={{
                opacity: [0.63, 0.9, 0.63],
              }}
              transition={{
                duration: 2.7,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              Created by CES GLOBAL {new Date().getFullYear()}
            </motion.p>
          </motion.footer>
        </div>
      </motion.div>
    </div>
  );
};

export default HomePage;
