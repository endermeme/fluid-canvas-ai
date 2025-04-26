
import React from 'react';
import { enhanceIframeContent } from '../utils/iframe-utils';

interface GameIframeViewProps {
  content: string;
  title?: string;
  onLoad?: () => void;
  iframeRef: React.RefObject<HTMLIFrameElement>;
}

const GameIframeView = ({ content, title, onLoad, iframeRef }: GameIframeViewProps) => {
  return (
    <div className="relative w-full h-full">
      <iframe
        ref={iframeRef}
        className="w-full h-full"
        sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups"
        title={title || "Game tương tác"}
        onLoad={onLoad}
        style={{
          border: 'none',
          display: 'block',
          width: '100%',
          height: '100%'
        }}
      />
    </div>
  );
};

export default GameIframeView;
