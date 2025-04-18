
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { logInfo } from '@/components/quiz/generator/apiUtils';
import { Button } from '@/components/ui/button';
import { Copy, FileCode, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CodeViewProps {
  content?: string;
  htmlContent?: string;
}

const CodeView: React.FC<CodeViewProps> = ({ content, htmlContent }) => {
  const [codeToDisplay, setCodeToDisplay] = useState<string>('');
  const [htmlCssJs, setHtmlCssJs] = useState<string[]>(['', '', '']);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('full');

  useEffect(() => {
    // Prioritize content if both are provided
    const displayContent = content || htmlContent || '';
    setCodeToDisplay(displayContent);
    
    // Try to extract HTML, CSS, and JS from content
    try {
      const htmlMatch = displayContent.match(/<html[^>]*>([\s\S]*?)<\/html>/i);
      const bodyMatch = htmlMatch ? htmlMatch[0].match(/<body[^>]*>([\s\S]*?)<\/body>/i) : null;
      const styleMatch = htmlMatch ? htmlMatch[0].match(/<style[^>]*>([\s\S]*?)<\/style>/i) : null;
      const scriptMatch = htmlMatch ? htmlMatch[0].match(/<script[^>]*>([\s\S]*?)<\/script>/i) : null;
      
      const extractedHtml = bodyMatch ? bodyMatch[1].trim() : '';
      const extractedCss = styleMatch ? styleMatch[1].trim() : '';
      const extractedJs = scriptMatch ? scriptMatch[1].trim() : '';
      
      setHtmlCssJs([extractedHtml, extractedCss, extractedJs]);
    } catch (error) {
      console.error('Error extracting code sections:', error);
    }
    
    // Log for debugging
    logInfo('CodeView', 'Setting code content:', { 
      contentLength: displayContent.length,
      contentStart: displayContent.substring(0, 100) + '...'
    });
  }, [content, htmlContent]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeToDisplay)
      .then(() => {
        toast({
          title: "Đã sao chép",
          description: "Code đã được sao chép vào clipboard",
        });
      })
      .catch(err => {
        console.error('Không thể sao chép code:', err);
        toast({
          title: "Lỗi sao chép",
          description: "Không thể sao chép code",
          variant: "destructive"
        });
      });
  };

  const formatCodeBlock = (code: string) => {
    return (
      <pre className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md overflow-auto max-h-[500px] text-sm font-mono">
        <code>{code}</code>
      </pre>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Game Code</CardTitle>
            <CardDescription>
              Complete HTML file with embedded CSS and JavaScript
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleCopyCode} 
            className="text-xs"
          >
            <Copy className="h-3.5 w-3.5 mr-1.5" />
            Sao chép code
          </Button>
        </CardHeader>
        <CardContent>
          {codeToDisplay ? (
            <div>
              <Tabs defaultValue="full" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="full">
                    <FileCode className="h-3.5 w-3.5 mr-1.5" />
                    Full HTML
                  </TabsTrigger>
                  <TabsTrigger value="preview">
                    <Eye className="h-3.5 w-3.5 mr-1.5" />
                    Preview
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="full">
                  {formatCodeBlock(codeToDisplay)}
                </TabsContent>
                
                <TabsContent value="preview">
                  <div className="border rounded-md p-4 bg-white h-[500px] overflow-auto">
                    <iframe 
                      srcDoc={codeToDisplay}
                      title="Code Preview"
                      className="w-full h-full border-0"
                      sandbox="allow-scripts"
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md text-center text-muted-foreground">
              Không có code nào để hiển thị
            </div>
          )}
        </CardContent>
        <CardFooter>
          <div className="text-sm text-muted-foreground">
            HTML, CSS, và JavaScript đã được tích hợp trong một file
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CodeView;
