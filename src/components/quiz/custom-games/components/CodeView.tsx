
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { parseCodeBlocks } from '@/components/quiz/utils/code-block-parser';

interface CodeViewProps {
  content?: string;
  htmlContent?: string;
}

const CodeView: React.FC<CodeViewProps> = ({ content, htmlContent }) => {
  let html = htmlContent || '';
  let title = '';
  let description = '';
  
  if (content) {
    const parsedCode = parseCodeBlocks(content);
    html = parsedCode.html;
    title = parsedCode.title || '';
    description = parsedCode.description || '';
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{title || "Game Code"}</CardTitle>
          <CardDescription>
            {description || "Complete HTML file with embedded CSS and JavaScript"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="p-4 bg-gray-100 rounded-md overflow-auto max-h-[500px] text-sm font-mono">
            <code>{html || "No content available"}</code>
          </pre>
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
