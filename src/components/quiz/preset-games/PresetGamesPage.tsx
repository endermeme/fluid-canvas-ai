
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameSelector from './GameSelector';
import PresetGameManager from './PresetGameManager';
import { GameSettingsData } from '../types';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { History, Atom, FlaskConical, Microscope, TestTube, Telescope, Radiation, Calculator, Beaker, Dna } from 'lucide-react';
import BackgroundParticles from '@/components/ui/background-particles';
import { motion } from 'framer-motion';

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

  // Show loading screen initially to prevent flash
  if (isLoading) {
    return (
      <div className="h-full flex flex-col overflow-hidden relative bg-gradient-to-br from-blue-50 via-sky-50 to-blue-100 dark:from-blue-950 dark:via-sky-950 dark:to-blue-950">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm font-medium">Đang tải...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-auto relative bg-gradient-to-br from-blue-50 via-sky-50 to-blue-100 dark:from-blue-950 dark:via-sky-950 dark:to-blue-950">
      {/* Background Animation - Only show when NOT in game */}
      {!selectedGameType && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Neural Network Grid */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 1000 1000">
              <defs>
                <pattern id="neural-grid-preset" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                  <circle cx="50" cy="50" r="2" fill="currentColor" className="text-blue-500" />
                  <line x1="50" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="0.5" className="text-blue-400" />
                  <line x1="50" y1="50" x2="50" y2="100" stroke="currentColor" strokeWidth="0.5" className="text-blue-400" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#neural-grid-preset)" />
            </svg>
          </div>

          {/* Floating Quantum Particles */}
          <BackgroundParticles particleCount={15} />

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
      )}

      {!selectedGameType && (
        <div className="absolute top-2 right-2 z-10">
          <Button 
            onClick={viewGameHistory}
            variant="outline" 
            size="sm"
            className="flex items-center gap-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-sm border-blue-200/45 dark:border-blue-700/45 text-xs px-2 py-1"
          >
            <History size={10} />
            <span>Lịch sử game</span>
          </Button>
        </div>
      )}
      
      <div className="relative z-10 min-h-full">
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
