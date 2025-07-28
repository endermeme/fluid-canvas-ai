import React, { useRef, useEffect, useState } from 'react';
import GameIframeRenderer from './game-components/GameIframeRenderer';

interface CustomGameRendererProps {
  htmlContent: string;
  gameType: string;
}

export const CustomGameRenderer: React.FC<CustomGameRendererProps> = ({
  htmlContent,
  gameType
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  

  // Handle iframe load
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.data.type === 'GAME_LOADED') {
        console.log('Custom game loaded successfully');
        setIsLoaded(true);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    if (iframeRef.current && htmlContent) {
      try {
        // Set the HTML content directly
        iframeRef.current.srcdoc = htmlContent;
        
        // Handle iframe load
        iframeRef.current.onload = () => {
          setIsLoaded(true);
        };
      } catch (error) {
        console.error('Error loading custom game content:', error);
      }
    }
  }, [htmlContent]);

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