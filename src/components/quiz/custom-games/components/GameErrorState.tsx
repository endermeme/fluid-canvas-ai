
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface GameErrorStateProps {
  errorMessage: string;
  onRetry: () => void;
}

const GameErrorState: React.FC<GameErrorStateProps> = ({ 
  errorMessage, 
  onRetry 
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <Alert variant="destructive" className="max-w-md">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Lỗi tải game</AlertTitle>
        <AlertDescription>
          {errorMessage}
          <div className="mt-2">
            <button 
              onClick={onRetry}
              className="text-sm font-medium underline cursor-pointer hover:text-primary"
            >
              Thử tải lại
            </button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default GameErrorState;
