import React, { useRef, useEffect, useState } from 'react';

import { enhanceIframeContent } from '../utils/iframe-utils';
import GameIframeRenderer from './game-components/GameIframeRenderer';

interface CustomGameRendererProps {
  htmlContent: string;
  gameType: string;
  gameId: string;
  playerName: string;
  onGameComplete?: (score: number, totalQuestions: number, completionTime?: number) => void;
}

export const CustomGameRenderer: React.FC<CustomGameRendererProps> = ({
  htmlContent,
  gameType,
  gameId,
  playerName,
  onGameComplete
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  

  // Message listener for score communication
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (!event.data.type) return;
      
      switch (event.data.type) {
        case 'GAME_SCORE_UPDATE':
          const { score, totalQuestions } = event.data.data;
          console.log('Score update:', score, totalQuestions);
          break;
          
        case 'GAME_COMPLETE':
          const { score: finalScore, totalQuestions: total, completionTime, extraData } = event.data.data;
          
          if (onGameComplete) {
            onGameComplete(finalScore, total, completionTime);
          }
          break;
          
        case 'GAME_LOADED':
          console.log('Custom game loaded successfully');
          setIsLoaded(true);
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [gameId, gameType, playerName, onGameComplete]);

  useEffect(() => {
    const loadContent = async () => {
      if (iframeRef.current && htmlContent) {
        try {
          // Enhance HTML content with game API
          const enhancedContent = await enhanceIframeContent(htmlContent, `Custom Game - ${gameType}`);
          
          // Set the enhanced HTML content
          iframeRef.current.srcdoc = enhancedContent;
          
          // Handle iframe load
          iframeRef.current.onload = () => {
            setIsLoaded(true);
          };
        } catch (error) {
          console.error('Error loading custom game content:', error);
        }
      }
    };

    loadContent();
  }, [htmlContent, gameType]);

  return (
    <div className="w-full h-screen">
      <GameIframeRenderer 
        ref={iframeRef}
        title={`Custom Game - ${gameType}`}
        isLoaded={isLoaded}
      />
    </div>
  );
};