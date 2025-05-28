
import React, { forwardRef } from 'react';

interface GameIframeRendererProps {
  title: string;
  isLoaded?: boolean;
}

const GameIframeRenderer = forwardRef<HTMLIFrameElement, GameIframeRendererProps>(
  ({ title, isLoaded }, ref) => {
    return (
      <iframe
        ref={ref}
        className="w-full h-full border-0 block"
        sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups"
        title={title}
        style={{
          border: 'none',
          display: 'block',
          width: '100%',
          height: '100%',
          margin: 0,
          padding: 0,
          backgroundColor: '#000000',
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out'
        }}
      />
    );
  }
);

GameIframeRenderer.displayName = 'GameIframeRenderer';

export default GameIframeRenderer;
