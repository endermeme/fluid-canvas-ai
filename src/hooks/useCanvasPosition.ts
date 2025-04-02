
import { useCallback } from 'react';
import { snapToGrid } from '@/lib/block-utils';

export const useCanvasPosition = () => {
  const getCanvasCenter = useCallback((canvasRect?: DOMRect) => {
    return {
      x: ((canvasRect?.width || 800) / 2) - 150,
      y: ((canvasRect?.height || 600) / 2) - 100
    };
  }, []);

  const getCanvasElement = useCallback(() => {
    return document.querySelector('.canvas-grid');
  }, []);

  const getCanvasRect = useCallback(() => {
    const canvasElement = getCanvasElement();
    return canvasElement?.getBoundingClientRect() as DOMRect;
  }, []);

  const getSnappedPosition = useCallback((position: { x: number; y: number }) => {
    return {
      x: snapToGrid(position.x),
      y: snapToGrid(position.y)
    };
  }, []);

  return {
    getCanvasCenter,
    getCanvasElement,
    getCanvasRect,
    getSnappedPosition
  };
};
