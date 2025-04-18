
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { parseCodeBlocks } from '../utils/code-block-parser';

interface CodeViewProps {
  content: string;
}

const CodeView: React.FC<CodeViewProps> = ({ content }) => {
  const parsedCode = parseCodeBlocks(content);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{parsedCode.title || "Code Game"}</CardTitle>
          <CardDescription>
            {parsedCode.description || "Code của game được tách thành các phần HTML, CSS và JavaScript"}
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
                <code>{parsedCode.html || "No HTML content"}</code>
              </pre>
            </TabsContent>
            
            <TabsContent value="css">
              <pre className="p-4 bg-gray-100 rounded-md overflow-auto max-h-[500px] text-sm font-mono">
                <code>{parsedCode.css || "No CSS content"}</code>
              </pre>
            </TabsContent>
            
            <TabsContent value="js">
              <pre className="p-4 bg-gray-100 rounded-md overflow-auto max-h-[500px] text-sm font-mono">
                <code>{parsedCode.javascript || "No JavaScript content"}</code>
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
