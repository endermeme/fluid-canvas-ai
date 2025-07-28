import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
// Game sharing moved to separate handlers
import QuizHeader from './QuizHeader';

interface QuizContainerProps {
  children: React.ReactNode;
  title?: string;
  showBackButton?: boolean;
  showHomeButton?: boolean;
  showRefreshButton?: boolean;
  showSettingsButton?: boolean;
  showCreateButton?: boolean;
  isGameCreated?: boolean;
  gameContent?: unknown;
  onBack?: () => void;
  onRefresh?: () => void;
  onSettings?: () => void;
  onCreate?: () => void;
  footerContent?: React.ReactNode;
  headerRight?: React.ReactNode;
  className?: string;
  isCreatingGame?: boolean;
  onHandleCreate?: () => void;
}

const QuizContainer: React.FC<QuizContainerProps> = ({
  children,
  title = "", // Changed default title to empty string
  showBackButton = true,
  showHomeButton = false,
  showRefreshButton = false,
  showSettingsButton = false,
  showCreateButton = false,
  isGameCreated = false,
  gameContent = null,
  onBack,
  onRefresh,
  onSettings,
  onCreate,
  footerContent,
  headerRight,
  className,
  isCreatingGame = false,
  onHandleCreate = () => { }
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/');
    }
  };
  
  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      window.location.reload();
    }
  };

  const handleCreate = () => {
    if (onCreate) {
      onCreate();
    } else if (onHandleCreate) {
      onHandleCreate();
    } else {
      navigate('/quiz?create=true');
    }
  };


  return (
    <div className={cn("relative h-full w-full flex flex-col overflow-hidden", className)}>
      {/* Sử dụng component QuizHeader mới */}
      {!isCreatingGame && (
        <QuizHeader 
          showBackButton={showBackButton}
          showCreateButton={showCreateButton}
          onBack={handleBack}
          onCreate={handleCreate}
          headerRight={headerRight}
        />
      )}
      
      {/* Main content */}
      <div className="flex-1 overflow-hidden relative">
        {children}
      </div>
      
      {/* Footer (optional) */}
      {footerContent && (
        <div className="bg-background/90 backdrop-blur-md p-2 border-t border-primary/10">
          {footerContent}
        </div>
      )}

    </div>
  );
};

export default QuizContainer;
