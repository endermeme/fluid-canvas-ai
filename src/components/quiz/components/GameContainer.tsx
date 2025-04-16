
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Code, Eye } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface GameContainerProps {
  iframeRef: React.RefObject<HTMLIFrameElement>;
  content: string;
  title?: string;
  error: string | null;
  onReload: () => void;
  htmlContent?: string;
  cssContent?: string;
  jsContent?: string;
  isSeparatedFiles?: boolean;
}

const GameContainer: React.FC<GameContainerProps> = ({
  iframeRef,
  content,
  title,
  error,
  onReload,
  htmlContent,
  cssContent,
  jsContent,
  isSeparatedFiles
}) => {
  const [viewMode, setViewMode] = useState<'game' | 'code'>('game');
  const [codeTab, setCodeTab] = useState<'html' | 'css' | 'js' | 'full'>('html');

  const formatCodeForDisplay = (code: string, language: string) => {
    return (
      <pre className="p-4 bg-gray-100 rounded-md overflow-auto max-h-[500px] text-sm font-mono">
        <code>{code}</code>
      </pre>
    );
  };

  return (
    <div className="flex-1 relative overflow-hidden">
      {error ? (
        <div className="flex flex-col items-center justify-center h-full p-6 bg-destructive/10">
          <p className="text-destructive mb-4">{error}</p>
          <Button 
            variant="outline" 
            onClick={onReload}
          >
            <RefreshCw className="h-4 w-4 mr-1.5" />
            Tải lại
          </Button>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          <div className="flex justify-end gap-2 p-2 bg-gray-100 border-b">
            <Button 
              variant={viewMode === 'game' ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode('game')}
            >
              <Eye className="h-4 w-4 mr-1.5" />
              Xem Game
            </Button>
            <Button 
              variant={viewMode === 'code' ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode('code')}
            >
              <Code className="h-4 w-4 mr-1.5" />
              Xem Code
            </Button>
          </div>
          
          <div className="flex-1 overflow-auto">
            {viewMode === 'game' ? (
              <iframe
                ref={iframeRef}
                className="w-full h-full"
                sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups"
                title={title || "Custom Game"}
                srcDoc={content}
                style={{ border: 'none', display: 'block', width: '100%', height: '100%' }}
              />
            ) : (
              <div className="p-4">
                {isSeparatedFiles ? (
                  <Tabs
                    defaultValue="html"
                    value={codeTab}
                    onValueChange={(value) => setCodeTab(value as any)}
                    className="w-full"
                  >
                    <TabsList className="mb-4">
                      <TabsTrigger value="html">HTML</TabsTrigger>
                      <TabsTrigger value="css">CSS</TabsTrigger>
                      <TabsTrigger value="js">JavaScript</TabsTrigger>
                      <TabsTrigger value="full">Tất cả</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="html">
                      <h3 className="text-lg font-medium mb-2">HTML</h3>
                      {formatCodeForDisplay(htmlContent || '', 'html')}
                    </TabsContent>
                    
                    <TabsContent value="css">
                      <h3 className="text-lg font-medium mb-2">CSS</h3>
                      {formatCodeForDisplay(cssContent || '', 'css')}
                    </TabsContent>
                    
                    <TabsContent value="js">
                      <h3 className="text-lg font-medium mb-2">JavaScript</h3>
                      {formatCodeForDisplay(jsContent || '', 'javascript')}
                    </TabsContent>
                    
                    <TabsContent value="full">
                      <h3 className="text-lg font-medium mb-2">HTML đầy đủ</h3>
                      {formatCodeForDisplay(content, 'html')}
                    </TabsContent>
                  </Tabs>
                ) : (
                  <div>
                    <h3 className="text-lg font-medium mb-2">HTML đầy đủ</h3>
                    {formatCodeForDisplay(content, 'html')}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GameContainer;
