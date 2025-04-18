
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { parseCodeBlocks } from '@/components/quiz/utils/code-block-parser';

interface CodeViewProps {
  content?: string;
  htmlContent?: string;
  cssContent?: string;
  jsContent?: string;
}

const CodeView: React.FC<CodeViewProps> = ({ content, htmlContent, cssContent, jsContent }) => {
  // Use the provided content directly if it exists, otherwise parse from the content prop
  let html = htmlContent || '';
  let css = cssContent || '';
  let js = jsContent || '';
  let title = '';
  let description = '';
  
  // If content is provided, parse it
  if (content) {
    const parsedCode = parseCodeBlocks(content);
    html = parsedCode.html || html;
    css = parsedCode.css || css;
    js = parsedCode.javascript || js;
    title = parsedCode.title || title;
    description = parsedCode.description || description;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{title || "Code Game"}</CardTitle>
          <CardDescription>
            {description || "Code của game được tách thành các phần HTML, CSS và JavaScript"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="html">
            <TabsList className="mb-4">
              <TabsTrigger value="html">HTML</TabsTrigger>
              <TabsTrigger value="css">CSS</TabsTrigger>
              <TabsTrigger value="js">JavaScript</TabsTrigger>
            </TabsList>
            
            <TabsContent value="html">
              <pre className="p-4 bg-gray-100 rounded-md overflow-auto max-h-[500px] text-sm font-mono">
                <code>{html || "No HTML content"}</code>
              </pre>
            </TabsContent>
            
            <TabsContent value="css">
              <pre className="p-4 bg-gray-100 rounded-md overflow-auto max-h-[500px] text-sm font-mono">
                <code>{css || "No CSS content"}</code>
              </pre>
            </TabsContent>
            
            <TabsContent value="js">
              <pre className="p-4 bg-gray-100 rounded-md overflow-auto max-h-[500px] text-sm font-mono">
                <code>{js || "No JavaScript content"}</code>
              </pre>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <div className="text-sm text-muted-foreground">
            Bạn có thể sao chép code để sử dụng trong các dự án khác.
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CodeView;
