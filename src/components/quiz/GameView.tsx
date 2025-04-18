
import React, { useEffect, useRef } from 'react';
import { MiniGame } from './generator/types';

interface GameViewProps {
  miniGame: MiniGame;
  onBack?: () => void;
}

const GameView: React.FC<GameViewProps> = ({ miniGame, onBack }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  useEffect(() => {
    if (!iframeRef.current || !miniGame.content) return;
    
    // Get the iframe document
    const iframeDoc = iframeRef.current.contentDocument || 
      (iframeRef.current.contentWindow?.document);
    
    if (iframeDoc) {
      // Clear the document first
      iframeDoc.open();
      
      // Write the HTML content
      iframeDoc.write(miniGame.content);
      
      // Close the document after writing
      iframeDoc.close();
      
      // Add event listener to handle messages from the iframe
      const handleMessage = (event: MessageEvent) => {
        if (event.data && event.data.type === 'gameScore') {
          console.log('Received game score:', event.data.score);
        }
      };
      
      window.addEventListener('message', handleMessage);
      
      // Clean up on unmount
      return () => {
        window.removeEventListener('message', handleMessage);
      };
    }
  }, [miniGame.content]);
  
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 relative overflow-hidden">
        {miniGame.content ? (
          <iframe 
            ref={iframeRef}
            className="w-full h-full border-none"
            title={miniGame.title || "Interactive Game"}
            sandbox="allow-scripts allow-same-origin allow-forms"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <div className="text-center p-6">
              <h2 className="text-2xl font-bold mb-4">{miniGame.title}</h2>
              <p className="text-muted-foreground">{miniGame.description || "Interactive minigame"}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameView;
