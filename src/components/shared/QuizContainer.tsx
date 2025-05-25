
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Settings, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuizContainerProps {
  children: React.ReactNode;
  title: string;
  showBackButton?: boolean;
  onBack?: () => void;
  showSettingsButton?: boolean;
  onSettings?: () => void;
  showCreateButton?: boolean;
  onCreate?: () => void;
  isCreatingGame?: boolean;
  className?: string;
}

const QuizContainer: React.FC<QuizContainerProps> = ({
  children,
  title,
  showBackButton = false,
  onBack,
  showSettingsButton = false,
  onSettings,
  showCreateButton = false,
  onCreate,
  isCreatingGame = false,
  className
}) => {
  return (
    <div className={cn("flex flex-col h-screen bg-background", className)}>
      <header className="border-b px-4 py-3 flex items-center justify-between bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-3">
          {showBackButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lại
            </Button>
          )}
          <h1 className="text-xl font-semibold truncate">{title}</h1>
        </div>
        
        <div className="flex items-center gap-2">
          {showCreateButton && (
            <Button
              variant="outline"
              size="sm"
              onClick={onCreate}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              {isCreatingGame ? "Tạo mới" : "Tạo lại"}
            </Button>
          )}
          {showSettingsButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onSettings}
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Cài đặt
            </Button>
          )}
        </div>
      </header>
      
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
};

export default QuizContainer;
