import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { MiniGame } from './generator/types';
import GameLoading from './GameLoading';
import GameError from './GameError';
import EnhancedGameView from './custom-games/EnhancedGameView';
import { GameSettingsData } from './types';
import { getGameTypeByTopic } from './gameTypes';
import { useNavigate } from 'react-router-dom';
import { createGameSession } from '@/utils/gameParticipation';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { GEMINI_API_KEY, GEMINI_MODELS } from '@/constants/api-constants';
import { tryGeminiGeneration } from './generator/geminiGenerator';

interface QuizGeneratorProps {
  topic?: string;
  onQuizComplete?: () => void;
}

const QuizGenerator = forwardRef<{ generateQuiz: (topic: string, settings?: GameSettingsData) => void }, QuizGeneratorProps>(({ 
  topic = "Minigame tương tác",
  onQuizComplete,
}, ref) => {
  const [miniGame, setMiniGame] = useState<MiniGame | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentTopic, setCurrentTopic] = useState<string>(topic);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [canvasMode] = useState<boolean>(true);
  
  const defaultSettings: GameSettingsData = {
    difficulty: 'medium',
    questionCount: 10,
    timePerQuestion: 30,
    category: 'general',
  };
  
  useEffect(() => {
    localStorage.setItem('canvas_mode', 'true');
  }, []);

  useImperativeHandle(ref, () => ({
    generateQuiz: (topic: string, settings?: GameSettingsData) => {
      if (topic.trim()) {
        setCurrentTopic(topic);
        generateMiniGame(topic, settings || getSettingsFromTopic(topic));
      }
    }
  }));

  const getSettingsFromTopic = (topic: string): GameSettingsData => {
    const gameType = getGameTypeByTopic(topic);
    if (gameType) {
      return {...gameType.defaultSettings};
    }
    
    let settings = {...defaultSettings};
    
    const lowerTopic = topic.toLowerCase();
    
    if (lowerTopic.includes('trí nhớ') || lowerTopic.includes('ghi nhớ')) {
      settings.questionCount = 8;
      settings.timePerQuestion = 3;
    } else if (lowerTopic.includes('xếp hình') || lowerTopic.includes('ghép hình')) {
      settings.questionCount = 5;
      settings.timePerQuestion = 60;
    } else if (lowerTopic.includes('phản xạ') || lowerTopic.includes('nhanh')) {
      settings.questionCount = 15;
      settings.timePerQuestion = 5;
    } else if (lowerTopic.includes('vẽ') || lowerTopic.includes('drawing')) {
      settings.category = 'arts';
      settings.questionCount = 4;
      settings.timePerQuestion = 60;
    } else if (lowerTopic.includes('câu đố') || lowerTopic.includes('đố')) {
      settings.questionCount = 8;
      settings.timePerQuestion = 40;
    } else if (lowerTopic.includes('ghép cặp') || lowerTopic.includes('từ nam châm')) {
      settings.questionCount = 8;
      settings.timePerQuestion = 45;
    }
    
    if (lowerTopic.includes('lịch sử')) {
      settings.category = 'history';
    } else if (lowerTopic.includes('khoa học')) {
      settings.category = 'science';
    } else if (lowerTopic.includes('địa lý')) {
      settings.category = 'geography';
    } else if (lowerTopic.includes('nghệ thuật') || lowerTopic.includes('âm nhạc')) {
      settings.category = 'arts';
    } else if (lowerTopic.includes('thể thao')) {
      settings.category = 'sports';
    } else if (lowerTopic.includes('toán')) {
      settings.category = 'math';
    }
    
    console.log("Settings for topic:", topic, settings);
    return settings;
  };

  const generateMiniGame = async (topic: string, settings: GameSettingsData = defaultSettings) => {
    setIsLoading(true);
    setErrorMessage(null);
    setMiniGame(null);
    setCurrentTopic(topic);

    console.log("Starting minigame generation for topic:", topic);
    console.log("Starting game with settings:", settings);
    console.log("Using model:", GEMINI_MODELS.CUSTOM_GAME);

    try {      
      if (topic.toLowerCase().includes('vòng quay') || topic.toLowerCase().includes('wheel')) {
        const wheelGameHTML = await fetch('/vong-quay/index.html')
          .then(response => {
            if (!response.ok) {
              throw new Error(`Failed to load wheel game template: ${response.status}`);
            }
            return response.text();
          });
        
        const wheelGameCSS = await fetch('/vong-quay/style.css').then(r => r.text());
        const wheelGameJS = await fetch('/vong-quay/script.js').then(r => r.text()).catch(() => '');
        
        const combinedHTML = `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vòng Quay May Mắn</title>
    <style>
    ${wheelGameCSS}
    </style>
</head>
<body>
    <div class="wheel-container">
        <div class="pointer">▼</div>
        <div class="wheel">
        </div>

        <button id="spin-btn">Quay!</button>
        <div id="result"></div>
    </div>

    <script>
    const items = [
        "Giải nhất", 
        "Giải nhì", 
        "Giải ba", 
        "May mắn", 
        "Tiếp tục", 
        "Thử lại", 
        "Quà đặc biệt", 
        "Chúc may mắn"
    ];

    const colors = [
        "#f44336", "#e91e63", "#9c27b0", "#673ab7", 
        "#3f51b5", "#2196f3", "#03a9f4", "#00bcd4"
    ];

    const wheel = document.querySelector('.wheel');
    const spinBtn = document.getElementById('spin-btn');
    const result = document.getElementById('result');

    function createWheel() {
        const totalItems = items.length;
        const anglePerItem = 360 / totalItems;
        const offsetAngle = anglePerItem / 2;

        for (let i = 0; i < totalItems; i++) {
            const segment = document.createElement('div');
            segment.className = 'segment';
            segment.style.transform = \`rotate(\${i * anglePerItem + offsetAngle}deg)\`;
            segment.style.backgroundColor = colors[i % colors.length];

            const text = document.createElement('span');
            text.textContent = items[i];
            segment.appendChild(text);

            wheel.appendChild(segment);
        }
    }

    window.addEventListener('DOMContentLoaded', createWheel);

    let isSpinning = false;

    spinBtn.addEventListener('click', () => {
        if (isSpinning) return;
        
        isSpinning = true;
        spinBtn.disabled = true;
        result.textContent = '';
        
        const totalRotation = 1080 + Math.floor(Math.random() * 1080);
        
        wheel.style.transition = 'transform 4s ease-out';
        wheel.style.transform = \`rotate(\${totalRotation}deg)\`;
        
        setTimeout(() => {
            const finalRotation = totalRotation % 360;
            const anglePerItem = 360 / items.length;
            let selectedIndex = Math.floor(finalRotation / anglePerItem);
            selectedIndex = (items.length - selectedIndex) % items.length;
            
            result.textContent = \`Kết quả: \${items[selectedIndex]}\`;
            
            isSpinning = false;
            spinBtn.disabled = false;

            const event = new CustomEvent('game-completed', {
                detail: { score: 100, result: items[selectedIndex] }
            });
            document.dispatchEvent(event);
        }, 4000);
    });
    </script>
</body>
</html>
        `;
        
        const wheelGame: MiniGame = {
          title: "Vòng Quay May Mắn",
          content: combinedHTML,
          useCanvas: false
        };
        
        setMiniGame(wheelGame);
        toast({
          title: "Vòng Quay May Mắn",
          description: "Vòng quay may mắn đã sẵn sàng!",
        });
      } else {
        const game = await tryGeminiGeneration(null, topic, settings);
        
        if (game) {
          console.log("Minigame generated successfully:", game.title);
          setMiniGame(game);
          toast({
            title: "Minigame Đã Sẵn Sàng",
            description: `Đã tạo minigame về "${topic}" với Gemini ${GEMINI_MODELS.CUSTOM_GAME}`,
          });
        } else {
          throw new Error('Không thể tạo minigame');
        }
      }
    } catch (error) {
      console.error('Lỗi Tạo Minigame:', error);
      setErrorMessage('Không thể tạo minigame. Vui lòng thử lại hoặc chọn chủ đề khác.');
      toast({
        title: "Lỗi Tạo Minigame",
        description: "Có vấn đề khi tạo minigame. Vui lòng thử lại với chủ đề khác.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleShareGame = async () => {
    if (!miniGame) return;
    
    try {
      const gameSession = await createGameSession(
        miniGame.title || "Minigame tương tác",
        miniGame.content
      );
      
      if (gameSession.id) {
        const gameTitle = miniGame.title || "Minigame tương tác";
        const slug = gameTitle.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-');
        const shareUrl = `${window.location.origin}/play/custom-game/${slug}/${gameSession.id}`;
        
        navigate(`/play/custom-game/${slug}/${gameSession.id}`);
        
        toast({
          title: "Game đã được chia sẻ",
          description: "Bạn có thể gửi link cho người khác để họ tham gia.",
        });
      } else {
        toast({
          title: "Không thể chia sẻ game",
          description: "Đã xảy ra lỗi khi chia sẻ game. Vui lòng thử lại.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error sharing game:", error);
      toast({
        title: "Không thể chia sẻ game",
        description: "Đã xảy ra lỗi khi chia sẻ game. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <GameLoading topic={currentTopic} />;
  }

  if (errorMessage) {
    return <GameError 
      errorMessage={errorMessage} 
      onRetry={() => generateMiniGame(topic || "minigame vui", defaultSettings)} 
      topic={topic} 
    />;
  }

  if (!miniGame) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full space-y-6 py-10 bg-gradient-to-b from-background to-background/80">
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-primary/30 animate-pulse"></div>
          </div>
        </div>
        <p className="text-lg text-center max-w-md px-4">Vui lòng nhập chủ đề vào thanh chat để tạo minigame</p>
        <h3 className="text-xl font-bold cursor-pointer select-none text-primary">
          Trợ Lý Tạo Web
        </h3>
      </div>
    );
  }

  return (
    <>
      <EnhancedGameView 
        miniGame={{
          title: miniGame.title || "Minigame Tương Tác",
          content: miniGame.content || ""
        }} 
        extraButton={
          <Button 
            size="sm" 
            variant="secondary"
            className="ml-2 bg-background/80 backdrop-blur-sm border border-primary/20 shadow-md" 
            onClick={handleShareGame}
          >
            <Share2 size={14} className="mr-1" />
            Chia Sẻ & Theo Dõi
          </Button>
        }
      />
      <div className="absolute top-4 right-4">
        <h3 className="text-sm font-medium text-primary/60 cursor-pointer select-none">
          Trợ Lý Tạo Web
        </h3>
      </div>
    </>
  );
});

QuizGenerator.displayName = "QuizGenerator";

export default QuizGenerator;
