
import React, { useEffect, useRef } from 'react';
import { MiniGame } from './types';

interface GameRendererProps {
  game: MiniGame;
  className?: string;
}

const GameRenderer: React.FC<GameRendererProps> = ({ game, className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current || !game) return;
    
    // Xóa nội dung cũ nếu có
    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild);
    }
    
    // Tạo script element
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.text = game.js || '';
    
    // Tạo style element
    const style = document.createElement('style');
    style.textContent = game.css || '';
    
    // Thêm HTML
    containerRef.current.innerHTML = game.html || '';
    
    // Thêm style và script vào container
    document.head.appendChild(style);
    document.body.appendChild(script);
    
    return () => {
      // Dọn dẹp khi component unmount
      document.head.removeChild(style);
      document.body.removeChild(script);
    };
  }, [game]);
  
  return (
    <div 
      ref={containerRef} 
      className={`game-container w-full h-full ${className || ''}`}
      id="game-container"
    />
  );
};

export default GameRenderer;
