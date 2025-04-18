
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import QuizContainer from '@/components/quiz/QuizContainer';
import EnhancedGameView from '@/components/quiz/custom-games/EnhancedGameView';
import ShareGameDialog from './components/ShareGameDialog';
import CodeView from './components/CodeView';
import ShareInfoView from './components/ShareInfoView';
import { createGameSession } from '@/utils/gameParticipation';
import { useToast } from '@/hooks/use-toast';

interface CustomGameContainerProps {
  title?: string;
  content?: string;
  htmlContent?: string;
  cssContent?: string;
  jsContent?: string;
  isSeparatedFiles?: boolean;
}

const CustomGameContainer: React.FC<CustomGameContainerProps> = ({ 
  title = "Minigame Tương Tác", 
  content = "",
  htmlContent = "",
  cssContent = "",
  jsContent = "",
  isSeparatedFiles = false
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('game');
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleBack = () => {
    navigate('/');
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Không thể sao chép liên kết:', err);
      });
  };
  
  const handleShareGame = async () => {
    if (!miniGame) return;
    
    try {
      const gameSession = await createGameSession(
        miniGame.title || "Minigame tương tác",
        miniGame.content
      );
      
      navigate(`/game/${gameSession.id}`);
      
      toast({
        title: "Game đã được chia sẻ",
        description: "Bạn có thể gửi link cho người khác để họ tham gia.",
      });
    } catch (error) {
      console.error("Error sharing game:", error);
    }
  };
  
  const [miniGame] = useState({
    title: title,
    content: content,
    htmlContent: htmlContent,
    cssContent: cssContent,
    jsContent: jsContent,
    isSeparatedFiles: isSeparatedFiles
  });
  
  return (
    <QuizContainer
      title={miniGame.title}
      showBackButton={true}
      onBack={handleBack}
      className="p-0 overflow-hidden"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full">
        <div className="border-b px-4 py-2 flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="game">Game</TabsTrigger>
            <TabsTrigger value="share">Chia sẻ</TabsTrigger>
            {isSeparatedFiles && <TabsTrigger value="code">Code</TabsTrigger>}
          </TabsList>
        </div>
        
        <TabsContent value="game" className="h-[calc(100%-48px)] m-0">
          <EnhancedGameView 
            miniGame={{
              title: miniGame.title,
              content: miniGame.content,
              htmlContent: miniGame.htmlContent,
              cssContent: miniGame.cssContent,
              jsContent: miniGame.jsContent,
              isSeparatedFiles: miniGame.isSeparatedFiles
            }}
            onBack={handleBack}
          />
        </TabsContent>
        
        <TabsContent value="share" className="h-[calc(100%-48px)] m-0 p-4 overflow-auto">
          <ShareInfoView
            shareUrl={shareUrl}
            copied={copied}
            onCopyLink={handleCopyLink}
            title={miniGame.title}
          />
        </TabsContent>
        
        {isSeparatedFiles && (
          <TabsContent value="code" className="h-[calc(100%-48px)] m-0 p-4 overflow-auto">
            <CodeView
              htmlContent={miniGame.htmlContent}
              cssContent={miniGame.cssContent}
              jsContent={miniGame.jsContent}
            />
          </TabsContent>
        )}
      </Tabs>
      
      <ShareGameDialog
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
        shareUrl={shareUrl}
        copied={copied}
        onCopyLink={handleCopyLink}
      />
    </QuizContainer>
  );
};

export default CustomGameContainer;
