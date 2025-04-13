
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getSharedGame, getRemainingTime, StoredGame } from '@/utils/gameExport';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, AlertTriangle, Plus } from 'lucide-react';

const SharedGame = () => {
  const { id } = useParams<{ id: string }>();
  const [game, setGame] = useState<StoredGame | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      setError('ID trò chơi không hợp lệ');
      setLoading(false);
      return;
    }

    const loadGame = () => {
      const loadedGame = getSharedGame(id);
      setGame(loadedGame);
      
      if (loadedGame) {
        setTimeLeft(getRemainingTime(loadedGame.expiresAt));
      } else {
        setError('Trò chơi không tồn tại hoặc đã hết hạn');
      }
      
      setLoading(false);
    };

    loadGame();
    
    // Update remaining time every minute
    const intervalId = setInterval(() => {
      if (game) {
        setTimeLeft(getRemainingTime(game.expiresAt));
      }
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, [id, game]);

  const handleCreateNewGame = () => {
    // Navigate to root path using react-router
    navigate('/');
  };

  // Hàm cải thiện HTML content để tránh hiển thị bị bóp méo
  const enhanceHtmlContent = (content: string): string => {
    const enhancementStyles = `
      <style>
        body, html {
          margin: 0 !important;
          padding: 0 !important;
          overflow: auto !important;
          width: 100% !important;
          height: 100% !important;
          box-sizing: border-box !important;
        }
        
        body > div, .container, main, #game, .game, #app, #root {
          width: 100% !important;
          height: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          box-sizing: border-box !important;
        }
        
        canvas {
          display: block !important;
          margin: 0 auto !important;
          max-width: 100% !important;
          max-height: 100% !important;
        }
        
        pre, code {
          white-space: pre-wrap !important;
          overflow-wrap: break-word !important;
          max-width: 100% !important;
        }
      </style>
    `;
    
    // Insert our custom styles just before the closing </head> tag
    if (content.includes('</head>')) {
      return content.replace('</head>', `${enhancementStyles}</head>`);
    } else {
      // If no head tag, add styles at the beginning
      return enhancementStyles + content;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="text-lg">Đang tải trò chơi...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-6 p-4">
        <AlertTriangle className="text-destructive h-16 w-16" />
        <h1 className="text-2xl font-bold">{error}</h1>
        <p className="text-muted-foreground text-center max-w-md">
          Liên kết này có thể đã hết hạn hoặc không tồn tại. Trò chơi chỉ có hiệu lực trong 48 giờ.
        </p>
        <Button onClick={() => navigate('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại màn hình chính
        </Button>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-6 p-4">
        <AlertTriangle className="text-destructive h-16 w-16" />
        <h1 className="text-2xl font-bold">Trò chơi không tìm thấy</h1>
        <Button onClick={() => navigate('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Tạo trò chơi mới
        </Button>
      </div>
    );
  }

  // Tạo phiên bản cải tiến của HTML content
  const enhancedContent = enhanceHtmlContent(game.htmlContent);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <header className="bg-background border-b p-3 flex justify-between items-center">
        <Button variant="outline" size="sm" onClick={() => navigate('/')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
        
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="h-4 w-4 mr-1" />
          <span>Còn lại: {timeLeft}</span>
        </div>
      </header>
      
      <main className="flex-1 overflow-hidden">
        <iframe
          srcDoc={enhancedContent}
          sandbox="allow-scripts allow-same-origin"
          className="w-full h-full border-none"
          style={{ 
            height: '100%', 
            width: '100%',
            margin: '0 auto'
          }}
        />
      </main>

      <div className="absolute bottom-4 right-4 flex space-x-2">
        <Button 
          size="sm" 
          variant="ghost"
          className="bg-primary/10" 
          onClick={handleCreateNewGame}
        >
          <Plus size={16} className="mr-1" />
          Quay Về
        </Button>
      </div>
    </div>
  );
};

export default SharedGame;
