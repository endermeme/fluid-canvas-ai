
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameSelector from './GameSelector';
import PresetGameManager from './PresetGameManager';
import { GameSettingsData } from '../types';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { BarChart3, History, Atom, FlaskConical, Microscope, TestTube, Telescope, Radiation, Calculator, Beaker, Dna } from 'lucide-react';
import { motion } from 'framer-motion';
import BackgroundParticles from '@/components/ui/background-particles';

const PresetGamesPage: React.FC = () => {
  const [selectedGameType, setSelectedGameType] = useState<string | null>(null);
  const [gameTopic, setGameTopic] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Extract topic from URL if provided
  const searchParams = new URLSearchParams(location.search);
  const topicFromUrl = searchParams.get('topic');
  
  // Use URL topic if present and no game topic is set yet
  React.useEffect(() => {
    if (topicFromUrl && !gameTopic) {
      setGameTopic(topicFromUrl);
    }
    // Set loading to false after component mounts
    setIsLoading(false);
  }, [topicFromUrl, gameTopic]);

  const handleSelectGame = (gameType: string) => {
    setSelectedGameType(gameType);
  };
  
  const handleBackToSelector = () => {
    setSelectedGameType(null);
    setGameTopic('');
    navigate('/preset-games', { replace: true });
  };
  
  const handleQuickStart = (gameType: string, prompt: string, settings: GameSettingsData) => {
    // Update settings to include the prompt
    const updatedSettings = {
      ...settings,
      prompt: prompt
    };
    
    setSelectedGameType(gameType);
    setGameTopic(prompt);
    
    toast({
      title: "Trò chơi đang được tạo",
      description: `Đang tạo trò chơi ${gameType} với nội dung "${prompt}"`,
    });
  };

  const viewGameHistory = () => {
    navigate('/game-history');
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

  // Show loading screen initially to prevent flash
  if (isLoading) {
    return (
      <div className="h-full flex flex-col overflow-auto relative bg-gradient-to-br from-blue-50 via-sky-50 to-blue-100 dark:from-blue-950 dark:via-sky-950 dark:to-blue-950">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="h-10 w-10 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-lg font-medium">Đang tải...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-auto relative bg-gradient-to-br from-blue-50 via-sky-50 to-blue-100 dark:from-blue-950 dark:via-sky-950 dark:to-blue-950">
      {/* Optimized Background Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Neural Network Grid */}
        <div className="absolute inset-0 opacity-9">
          <svg className="w-full h-full" viewBox="0 0 900 900">
            <defs>
              <pattern id="neural-grid-preset" x="0" y="0" width="90" height="90" patternUnits="userSpaceOnUse">
                <circle cx="45" cy="45" r="1.8" fill="currentColor" className="text-blue-500" />
                <line x1="45" y1="45" x2="90" y2="45" stroke="currentColor" strokeWidth="0.45" className="text-blue-400" />
                <line x1="45" y1="45" x2="45" y2="90" stroke="currentColor" strokeWidth="0.45" className="text-blue-400" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#neural-grid-preset)" />
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

      {!selectedGameType && (
        <div className="absolute top-3 right-3 z-10">
          <Button 
            onClick={viewGameHistory}
            variant="outline" 
            size="sm"
            className="flex items-center gap-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-sm border-blue-200/45 dark:border-blue-700/45 text-sm px-3 py-1"
          >
            <History size={14} />
            <span>Lịch sử game</span>
          </Button>
        </div>
      )}
      
      <div className="relative z-10 h-full">
        {selectedGameType ? (
          <PresetGameManager 
            gameType={selectedGameType} 
            onBack={handleBackToSelector}
            initialTopic={gameTopic}
          />
        ) : (
          <GameSelector 
            onSelectGame={handleSelectGame} 
            onQuickStart={handleQuickStart}
          />
        )}
      </div>
    </div>
  );
};

export default PresetGamesPage;
