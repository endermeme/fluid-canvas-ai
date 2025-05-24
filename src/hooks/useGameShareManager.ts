
import { useState } from 'react';

export const useGameShareManager = (miniGame: any, toast: any, onShare?: () => Promise<string>) => {
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    if (onShare) {
      setIsSharing(true);
      try {
        await onShare();
      } catch (error) {
        console.error('Error sharing:', error);
      } finally {
        setIsSharing(false);
      }
    }
  };

  return {
    isSharing,
    handleShare
  };
};
