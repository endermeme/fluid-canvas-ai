
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
    { Icon: Atom, position: { top: '10%', left: '8%' }, rotation: 360, duration: 25 },
    { Icon: FlaskConical, position: { top: '20%', right: '10%' }, rotation: -180, duration: 30 },
    { Icon: Microscope, position: { bottom: '25%', left: '5%' }, rotation: 180, duration: 35 },
    { Icon: TestTube, position: { top: '60%', right: '15%' }, rotation: -360, duration: 28 },
    { Icon: Telescope, position: { bottom: '15%', right: '25%' }, rotation: 270, duration: 32 },
    { Icon: Radiation, position: { top: '40%', left: '3%' }, rotation: -270, duration: 26 },
    { Icon: Calculator, position: { bottom: '50%', right: '8%' }, rotation: 180, duration: 24 },
    { Icon: Beaker, position: { top: '75%', left: '25%' }, rotation: -360, duration: 29 },
    { Icon: Dna, position: { top: '30%', left: '88%' }, rotation: 360, duration: 31 },
  ], []);

  // Show loading screen initially to prevent flash
  if (isLoading) {
    return (
      <div className="h-full flex flex-col overflow-auto relative bg-gradient-to-br from-blue-50 via-sky-50 to-blue-100 dark:from-blue-950 dark:via-sky-950 dark:to-blue-950">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="h-11 w-11 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3.8"></div>
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
          <svg className="w-full h-full" viewBox="0 0 950 950">
            <defs>
              <pattern id="neural-grid-preset" x="0" y="0" width="95" height="95" patternUnits="userSpaceOnUse">
                <circle cx="47.5" cy="47.5" r="1.9" fill="currentColor" className="text-blue-500" />
                <line x1="47.5" y1="47.5" x2="95" y2="47.5" stroke="currentColor" strokeWidth="0.47" className="text-blue-400" />
                <line x1="47.5" y1="47.5" x2="47.5" y2="95" stroke="currentColor" strokeWidth="0.47" className="text-blue-400" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#neural-grid-preset)" />
          </svg>
        </div>

        {/* Floating Quantum Particles */}
        <BackgroundParticles particleCount={14} />

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
            <item.Icon className="w-11 h-11 text-blue-400/19" />
          </motion.div>
        ))}

        {/* Pulsing Energy Waves */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 w-76 h-76 border border-blue-300/19 rounded-full"
            style={{
              transform: 'translate(-50%, -50%)',
            }}
            animate={{
              scale: [1, 2.85, 1],
              opacity: [0.28, 0, 0.28],
            }}
            transition={{
              duration: 9.5,
              repeat: Infinity,
              delay: i * 3.1,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {!selectedGameType && (
        <div className="absolute top-3.8 right-3.8 z-10">
          <Button 
            onClick={viewGameHistory}
            variant="outline" 
            size="sm"
            className="flex items-center gap-1.4 bg-white/76 dark:bg-slate-900/76 backdrop-blur-sm shadow-sm border-blue-200/47 dark:border-blue-700/47"
          >
            <History size={15} />
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
