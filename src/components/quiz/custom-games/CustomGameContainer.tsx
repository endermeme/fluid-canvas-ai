
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import QuizContainer from '@/components/quiz/QuizContainer';
import EnhancedGameView from '@/components/quiz/custom-games/EnhancedGameView';
import ShareGameDialog from './components/ShareGameDialog';
import CodeView from './components/CodeView';
import ShareInfoView from './components/ShareInfoView';
import { createGameSession } from '@/utils/gameParticipation';
import { useToast } from '@/hooks/use-toast';
import { logInfo } from '@/components/quiz/generator/apiUtils';

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
  const [combinedContent, setCombinedContent] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Create the minigame state
  const [miniGame] = useState({
    title: title,
    content: content,
    htmlContent: htmlContent,
    cssContent: cssContent,
    jsContent: jsContent,
    isSeparatedFiles: isSeparatedFiles
  });
  
  // Generate combined content when component mounts or when relevant props change
  useEffect(() => {
    try {
      // Create combined HTML content
      let fullContent = '';
      
      if (isSeparatedFiles && htmlContent && cssContent && jsContent) {
        fullContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
${cssContent}
  </style>
</head>
<body>
${htmlContent}
  <script>
${jsContent}
  </script>
</body>
</html>`;
      } else {
        fullContent = content || '';
      }
      
      setCombinedContent(fullContent);
      
      // Log for debugging
      logInfo('CustomGameContainer', 'Generated combined content:', {
        isSeparatedFiles: isSeparatedFiles,
        contentLength: fullContent.length,
        hasOriginalContent: !!content,
        hasHtml: !!htmlContent,
        hasCss: !!cssContent,
        hasJs: !!jsContent,
        contentPreview: fullContent.substring(0, 200) + '...'
      });
    } catch (error) {
      console.error('Error generating combined content:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tạo nội dung game. Vui lòng thử lại.",
        variant: "destructive"
      });
    }
  }, [content, htmlContent, cssContent, jsContent, isSeparatedFiles, title]);
  
  const handleBack = () => {
    navigate('/');
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        
        toast({
          title: "Link đã được sao chép",
          description: "Bạn có thể gửi link cho người khác để họ tham gia.",
        });
      })
      .catch(err => {
        console.error('Không thể sao chép liên kết:', err);
        toast({
          title: "Lỗi sao chép",
          description: "Không thể sao chép link",
          variant: "destructive"
        });
      });
  };
  
  const handleShareGame = async () => {
    if (!combinedContent) {
      toast({
        title: "Không có nội dung",
        description: "Không thể chia sẻ game vì không có nội dung.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const gameSession = await createGameSession(
        miniGame.title || "Minigame tương tác",
        combinedContent
      );
      
      const shareUrl = `${window.location.origin}/game/${gameSession.id}`;
      setShareUrl(shareUrl);
      setShowShareDialog(true);
      
      toast({
        title: "Game đã được chia sẻ",
        description: "Bạn có thể gửi link cho người khác để họ tham gia.",
      });
    } catch (error) {
      console.error("Error sharing game:", error);
      toast({
        title: "Lỗi chia sẻ",
        description: "Không thể chia sẻ game. Vui lòng thử lại sau.",
        variant: "destructive"
      });
    }
  };
  
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
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="game" className="h-[calc(100%-48px)] m-0">
          <EnhancedGameView 
            miniGame={{
              title: miniGame.title,
              content: combinedContent
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
        
        <TabsContent value="code" className="h-[calc(100%-48px)] m-0 p-4 overflow-auto">
          <CodeView content={combinedContent} />
        </TabsContent>
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
