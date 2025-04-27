
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MiniGame } from '../generator/types';
import EnhancedGameView from './EnhancedGameView';
import CustomGameForm from './CustomGameForm';
import GameLoading from '../GameLoading';
import { useNavigate } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";
import QuizContainer from '../QuizContainer';

interface GameControllerProps {
  initialTopic?: string;
  onGameGenerated?: (game: MiniGame) => void;
}

// Chuyển thẳng các hàm Supabase vào đây thay vì sử dụng file utils riêng
const saveCustomGameToSupabase = async (title: string, content: string, gameType: string = 'custom') => {
  try {
    console.log("🔄 Đang lưu game:", { title, gameType });
    
    // Lưu trực tiếp vào bảng games
    const { data: gameEntry, error: gameError } = await supabase
      .from('games')
      .insert([{
        title: title,
        html_content: content,
        game_type: gameType,
        description: 'Game tương tác tùy chỉnh',
        is_preset: false,
        content_type: 'html',
        expires_at: new Date(Date.now() + (48 * 60 * 60 * 1000)).toISOString() // 48 giờ
      }])
      .select()
      .single();

    if (gameError) throw gameError;

    // Tạo URL chia sẻ
    const shareUrl = `${window.location.origin}/game/${gameEntry.id}`;
    
    console.log("✅ Game đã được lưu với ID:", gameEntry.id);
    return { id: gameEntry.id, url: shareUrl };
  } catch (error) {
    console.error('❌ Lỗi khi lưu game:', error);
    throw error;
  }
};

const GameController: React.FC<GameControllerProps> = ({ 
  initialTopic = "", 
  onGameGenerated 
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentGame, setCurrentGame] = useState<MiniGame | null>(null);
  const [currentTopic, setCurrentTopic] = useState<string>(initialTopic);
  const [showForm, setShowForm] = useState(!currentGame);
  const [isSharing, setIsSharing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleGameGeneration = (content: string, game?: MiniGame) => {
    setCurrentTopic(content);
    
    if (game) {
      setCurrentGame(game);
      setShowForm(false);
      
      if (onGameGenerated) {
        onGameGenerated(game);
      }
      
      toast({
        title: "Minigame Đã Sẵn Sàng",
        description: `Minigame "${game.title || content}" đã được tạo thành công.`,
      });
    }
    
    setIsGenerating(false);
  };

  const handleBack = () => {
    if (currentGame) {
      setCurrentGame(null);
      setShowForm(true);
    } else {
      navigate('/');
    }
  };

  const handleNewGame = () => {
    setCurrentGame(null);
    setShowForm(true);
  };
  
  const handleShareGame = async () => {
    if (!currentGame || isSharing) return "";
    
    try {
      setIsSharing(true);
      toast({
        title: "Đang xử lý",
        description: "Đang tạo liên kết chia sẻ...",
      });
      
      // Sử dụng hàm đã di chuyển trực tiếp vào component
      const result = await saveCustomGameToSupabase(
        currentGame.title || "Minigame tương tác", 
        currentGame.content
      );
      
      // Sao chép URL vào clipboard
      await navigator.clipboard.writeText(result.url);
      
      navigate(`/game/${result.id}`);
      
      toast({
        title: "Game đã được chia sẻ",
        description: "Đường dẫn đã được sao chép vào clipboard.",
      });
      
      setIsSharing(false);
      return result.url;
    } catch (error) {
      console.error("Lỗi chia sẻ game:", error);
      toast({
        title: "Lỗi chia sẻ",
        description: "Không thể tạo liên kết chia sẻ. Vui lòng thử lại.",
        variant: "destructive"
      });
      setIsSharing(false);
      return "";
    }
  };

  const getContainerTitle = () => {
    if (isGenerating) {
      return `Đang tạo game: ${currentTopic}`;
    }
    if (currentGame) {
      return currentGame.title || "Minigame Tương Tác";
    }
    return "Tạo Game Tùy Chỉnh";
  };

  const renderContent = () => {
    if (isGenerating) {
      return <GameLoading topic={currentTopic} />;
    } 
    
    if (currentGame) {
      return (
        <div className="w-full h-full">
          <EnhancedGameView 
            miniGame={{
              title: currentGame.title || "Minigame Tương Tác",
              content: currentGame.content || "",
              html: currentGame.html,
              css: currentGame.css,
              js: currentGame.js
            }} 
            onBack={handleBack}
            onNewGame={handleNewGame}
            onShare={handleShareGame}
            hideHeader={false}
          />
        </div>
      );
    } 
    
    if (showForm) {
      return (
        <CustomGameForm 
          onGenerate={(content, game) => {
            setIsGenerating(true);
            setTimeout(() => handleGameGeneration(content, game), 500);
          }}
          onCancel={() => navigate('/')}
        />
      );
    }
    
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 bg-gradient-to-b from-background to-background/80">
        <div className="p-6 bg-background/90 rounded-xl shadow-lg border border-primary/10 max-w-md w-full">
          <p className="text-center mb-4">Không có nội dung trò chơi. Vui lòng tạo mới.</p>
          <Button 
            onClick={handleNewGame} 
            className="w-full"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Tạo Game Mới
          </Button>
        </div>
      </div>
    );
  };

  return (
    <QuizContainer
      title={getContainerTitle()}
      showBackButton={false}
      onBack={handleBack}
      showSettingsButton={false}
      showCreateButton={false}
      onCreate={handleNewGame}
      className="p-0 overflow-hidden"
      isCreatingGame={showForm}
    >
      <div className="h-full w-full overflow-hidden">
        {renderContent()}
      </div>
    </QuizContainer>
  );
};

export default GameController;
