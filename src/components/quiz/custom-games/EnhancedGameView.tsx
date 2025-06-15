
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Share2, ArrowLeft } from 'lucide-react';
import GameIframeRenderer from './game-components/GameIframeRenderer';
import { useGameShareManager } from '../hooks/useGameShareManager';

interface MiniGame {
  title?: string;
  content: string;
}

interface EnhancedGameViewProps {
  miniGame: MiniGame;
  onBack?: () => void;
  hideHeader?: boolean;
  extraButton?: React.ReactNode;
  gameExpired?: boolean;
  isSharedMode?: boolean;
  onQuizScoreSubmit?: (score: number, totalQuestions: number) => void;
}

const EnhancedGameView: React.FC<EnhancedGameViewProps> = ({ 
  miniGame, 
  onBack, 
  hideHeader = false, 
  extraButton,
  gameExpired = false,
  isSharedMode = false,
  onQuizScoreSubmit
}) => {
  const { toast } = useToast();
  const { isSharing, handleShare } = useGameShareManager(miniGame, toast);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  const handleShareGame = async () => {
    try {
      const url = await handleShare();
      if (url) {
        navigator.clipboard.writeText(url);
        toast({
          title: "Đã sao chép liên kết",
          description: "Liên kết chia sẻ đã được sao chép vào clipboard.",
        });
      }
    } catch (error) {
      console.error("Error sharing game:", error);
    }
  };

  useEffect(() => {
    if (iframeRef.current && miniGame.content) {
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      
      if (doc) {
        doc.open();
        
        // Inject score submission functionality for shared mode
        let enhancedContent = miniGame.content;
        
        if (isSharedMode && onQuizScoreSubmit) {
          enhancedContent = miniGame.content.replace(
            '</head>',
            `<script>
              window.submitQuizScore = function(score, totalQuestions) {
                window.parent.postMessage({
                  type: 'QUIZ_SCORE_SUBMIT',
                  score: score,
                  totalQuestions: totalQuestions
                }, '*');
              };
            </script></head>`
          );
        }
        
        doc.write(enhancedContent);
        doc.close();
      }
    }
  }, [miniGame.content, isSharedMode, onQuizScoreSubmit]);

  useEffect(() => {
    if (isSharedMode && onQuizScoreSubmit) {
      const handleMessage = (event: MessageEvent) => {
        if (event.data.type === 'QUIZ_SCORE_SUBMIT') {
          onQuizScoreSubmit(event.data.score, event.data.totalQuestions);
        }
      };

      window.addEventListener('message', handleMessage);
      return () => window.removeEventListener('message', handleMessage);
    }
  }, [isSharedMode, onQuizScoreSubmit]);

  return (
    <div className="w-full h-full flex flex-col bg-gray-50">
      {!hideHeader && (
        <div className="flex items-center justify-between p-4 bg-white border-b shadow-sm">
          <div className="flex items-center space-x-4">
            {onBack && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onBack}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Quay lại
              </Button>
            )}
            <h1 className="text-lg font-semibold text-gray-900">
              {miniGame.title || 'Game Tương Tác'}
            </h1>
          </div>
          
          <div className="flex items-center space-x-2">
            {extraButton}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleShareGame}
              disabled={isSharing || gameExpired}
              className="flex items-center gap-2"
            >
              <Share2 className="h-4 w-4" />
              {isSharing ? 'Đang chia sẻ...' : 'Chia sẻ'}
            </Button>
          </div>
        </div>
      )}
      
      <div className="flex-1 overflow-hidden">
        <GameIframeRenderer 
          ref={iframeRef}
          title={miniGame.title || 'Game Tương Tác'}
          isLoaded={true}
        />
      </div>
    </div>
  );
};

export default EnhancedGameView;
