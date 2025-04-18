
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { logInfo } from '@/components/quiz/generator/apiUtils';

interface CodeViewProps {
  content?: string;
  htmlContent?: string;
}

const CodeView: React.FC<CodeViewProps> = ({ content, htmlContent }) => {
  const codeToDisplay = htmlContent || content || '';

  // Log the content for debugging
  logInfo('CodeView', 'Displaying code content:', { length: codeToDisplay.length });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Game Code</CardTitle>
          <CardDescription>
            Complete HTML file with embedded CSS and JavaScript
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="p-4 bg-gray-100 rounded-md overflow-auto max-h-[500px] text-sm font-mono">
            <code>{codeToDisplay}</code>
          </pre>
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
