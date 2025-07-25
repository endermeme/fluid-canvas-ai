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
        className="w-full h-full"
        sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups"
        title={title}
        style={{
          border: 'none',
          display: 'block',
          width: '100%',
          height: '100%',
          backgroundColor: '#ffffff',
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        }}
      />
    );
  }
);

GameIframeRenderer.displayName = 'GameIframeRenderer';

export default GameIframeRenderer;
