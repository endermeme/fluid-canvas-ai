
import React, { forwardRef } from 'react';

interface GameIframeRendererProps {
  title: string;
  isLoaded: boolean;
}

const GameIframeRenderer = forwardRef<HTMLIFrameElement, GameIframeRendererProps>(
  ({ title, isLoaded }, ref) => {
    return (
      <iframe
        ref={ref}
        title={title}
        className={`w-full h-full border-0 transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        sandbox="allow-scripts allow-same-origin allow-forms"
        loading="lazy"
      />
    );
  }
);

GameIframeRenderer.displayName = 'GameIframeRenderer';

export default GameIframeRenderer;
