
import React, { useRef, useEffect } from 'react';

interface SimpleGameViewProps {
  gameHtml: string;
  gameTitle: string;
}

const SimpleGameView: React.FC<SimpleGameViewProps> = ({ gameHtml, gameTitle }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current && gameHtml) {
      const iframe = iframeRef.current;
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(gameHtml);
        iframeDoc.close();
      }
    }
  }, [gameHtml]);

  return (
    <div className="w-full h-full overflow-hidden bg-white">
      <iframe
        ref={iframeRef}
        className="w-full h-full border-none"
        title={gameTitle}
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
};

export default SimpleGameView;
