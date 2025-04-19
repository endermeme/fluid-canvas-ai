
import React, { useRef, useEffect, useState } from 'react';
import { MiniGame } from '../../types/game';
import { Button } from '@/components/ui/button';
import { createIframe, setIframeContent, injectDebugUtils, setupIframeMessageListener } from '../../core/utils/iframe-handler';
import { formatHtml } from '../../core/utils/html-processor';
import { ArrowLeft, RefreshCw, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';

interface EnhancedGameViewProps {
  miniGame: MiniGame;
  onBack?: () => void;
  extraButton?: React.ReactNode;
}

const EnhancedGameView: React.FC<EnhancedGameViewProps> = ({ miniGame, onBack, extraButton }) => {
  const iframeContainerId = 'enhanced-game-container';
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [consoleMessages, setConsoleMessages] = useState<any[]>([]);
  const [zoom, setZoom] = useState(100);

  useEffect(() => {
    // Create and setup iframe
    try {
      const iframe = createIframe(iframeContainerId);
      iframeRef.current = iframe;
      
      // Format the HTML content to ensure it's clean
      const formattedHtml = formatHtml(miniGame.content);
      
      // Set content to iframe
      setIframeContent(iframe, formattedHtml);
      
      // Inject debug utilities
      injectDebugUtils(iframe);
      
      // Setup message listener
      const removeListener = setupIframeMessageListener((message) => {
        if (message.type === 'console') {
          setConsoleMessages((prev) => [...prev, message]);
        } else if (message.type === 'error') {
          console.error('Error in iframe:', message);
        }
      });
      
      return () => {
        removeListener();
      };
    } catch (error) {
      console.error('Error setting up iframe:', error);
    }
  }, [miniGame]);

  const handleRefresh = () => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      setIframeContent(iframe, formatHtml(miniGame.content));
      injectDebugUtils(iframe);
    }
  };

  const handleZoomIn = () => {
    setZoom((prevZoom) => Math.min(prevZoom + 10, 200));
  };

  const handleZoomOut = () => {
    setZoom((prevZoom) => Math.max(prevZoom - 10, 50));
  };

  return (
    <div className={`flex flex-col h-full relative ${isFullscreen ? 'fixed inset-0 z-50 bg-background' : ''}`}>
      <div className="flex items-center justify-between p-3 bg-background/90 backdrop-blur-sm border-b">
        <div className="flex items-center gap-2">
          {onBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Quay lại</span>
            </Button>
          )}
          <h2 className="text-lg font-medium">{miniGame.title || 'Game tương tác'}</h2>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomOut}
              className="h-8 w-8 p-0"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-xs w-12 text-center">{zoom}%</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomIn}
              className="h-8 w-8 p-0"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="h-8 w-8 p-0"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          
          {extraButton}
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden relative">
        <div 
          id={iframeContainerId} 
          className="w-full h-full overflow-hidden"
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'center top',
            height: `${100 / (zoom / 100)}%`,
            width: `${zoom < 100 ? 100 : 100 / (zoom / 100)}%`,
            margin: '0 auto'
          }}
        ></div>
      </div>
    </div>
  );
};

export default EnhancedGameView;
