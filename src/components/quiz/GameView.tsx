import React, { useState, useEffect } from 'react';
import { Share2, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { saveGameForSharing } from '@/utils/gameExport';
import { MiniGame } from './AIGameGenerator';
import { useIsMobile } from '@/hooks/use-mobile';
import { ScrollArea } from '@/components/ui/scroll-area';

interface GameViewProps {
  miniGame: MiniGame;
}

const GameView: React.FC<GameViewProps> = ({ miniGame }) => {
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();
  const [isFrameLoaded, setIsFrameLoaded] = useState(false);
  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Reset loaded state when game changes
    setIsFrameLoaded(false);
  }, [miniGame]);

  const handleShareGame = () => {
    try {
      if (!miniGame.content) {
        throw new Error('Game content is missing');
      }
      
      const url = saveGameForSharing(
        miniGame.title,
        miniGame.description,
        miniGame.content
      );
      
      setShareUrl(url);
      
      // Copy to clipboard automatically
      navigator.clipboard.writeText(url).catch(() => {
        // Silent fallback if clipboard API fails
      });
      
      toast({
        title: "Đã Tạo Liên Kết Chia Sẻ",
        description: "Liên kết có hiệu lực trong 48 giờ và đã được sao chép vào clipboard."
      });
    } catch (error) {
      console.error('Lỗi khi chia sẻ game:', error);
      toast({
        title: "Lỗi Chia Sẻ",
        description: "Không thể tạo liên kết chia sẻ. Vui lòng thử lại.",
        variant: "destructive"
      });
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast({
        title: "Đã Sao Chép",
        description: "Liên kết đã được sao chép vào clipboard."
      });
    }).catch(err => {
      console.error('Lỗi khi sao chép:', err);
      toast({
        title: "Lỗi Sao Chép",
        description: "Không thể sao chép liên kết. Vui lòng thử lại.",
        variant: "destructive"
      });
    });
  };

  const handleFrameLoad = () => {
    setIsFrameLoaded(true);
    
    // Animate the iframe container when content loads
    const container = iframeRef.current?.parentElement;
    if (container) {
      container.classList.add('animate-fade-in');
    }
    
    // Remove any headers or unwanted elements from the iframe
    injectClickEffectScript();
  };

  // Thêm mã CSS cho hiệu ứng click và xóa header
  const injectClickEffectScript = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        const iframeDocument = iframeRef.current.contentWindow.document;
        const style = iframeDocument.createElement('style');
        style.textContent = `
          * {
            -webkit-tap-highlight-color: transparent;
          }
          
          /* Prevent scrolling */
          html, body {
            margin: 0;
            padding: 0;
            overflow: hidden;
            width: 100%;
            height: 100%;
            position: fixed;
          }
          
          /* Remove any headers */
          header, 
          .header,
          [class*="header"],
          [id*="header"],
          [class*="title-bar"],
          [class*="navbar"],
          [class*="nav-bar"],
          [id*="navbar"],
          [id*="nav-bar"] {
            display: none !important;
          }
          
          button, a, [role="button"], input[type="submit"], input[type="button"], .clickable {
            position: relative;
            overflow: hidden;
            cursor: pointer;
          }
          
          button:active, a:active, [role="button"]:active, 
          input[type="submit"]:active, input[type="button"]:active, .clickable:active {
            transform: scale(0.97);
          }
          
          .click-ripple {
            position: absolute;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.4);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
          }
          
          @keyframes ripple {
            to {
              transform: scale(4);
              opacity: 0;
            }
          }
          
          @media (max-width: 768px) {
            button, a, input[type="submit"], input[type="button"] {
              min-height: 38px; /* Làm cho các nút dễ bấm hơn trên thiết bị di động */
              padding: 8px 16px;
            }
          }
        `;
        iframeDocument.head.appendChild(style);
        
        // Thêm script xử lý hiệu ứng click và xóa header
        const script = iframeDocument.createElement('script');
        script.textContent = `
          // Xóa bất kỳ header hoặc thanh điều hướng nào
          function removeHeaders() {
            const selectors = [
              'header', '.header', '[class*="header"]', '[id*="header"]',
              '[class*="title-bar"]', '[class*="navbar"]', '[class*="nav-bar"]',
              '[id*="navbar"]', '[id*="nav-bar"]'
            ];
            
            selectors.forEach(selector => {
              const elements = document.querySelectorAll(selector);
              elements.forEach(el => {
                if (el) el.style.display = 'none';
              });
            });
            
            // Xóa bất kỳ phần tử nào có text chứa từ khóa header
            document.querySelectorAll('*').forEach(el => {
              if (el.innerText && 
                 (el.innerText.toLowerCase().includes('challenge') || 
                  el.innerText.toLowerCase().includes('challeng') ||
                  el.innerText.match(/^\\s*[a-zA-Z0-9\\s]+\\s*$/))) {
                const parent = el.parentNode;
                if (parent && 
                    parent.children.length <= 3 && 
                    parent !== document.body && 
                    !parent.querySelector('canvas') &&
                    !parent.querySelector('input') &&
                    !parent.querySelector('button')) {
                  parent.style.display = 'none';
                }
              }
            });
          }
          
          // Run initially
          removeHeaders();
          
          // Run again after a slight delay to catch dynamically added elements
          setTimeout(removeHeaders, 500);
          setTimeout(removeHeaders, 1500);
          
          // Set up observer to keep removing headers
          const observer = new MutationObserver(removeHeaders);
          observer.observe(document.body, { childList: true, subtree: true });
          
          document.addEventListener('click', function(e) {
            // Kiểm tra xem có phải là phần tử tương tác không
            const isInteractive = e.target.matches('button, a, [role="button"], input[type="submit"], input[type="button"], .clickable') ||
                                  e.target.closest('button, a, [role="button"], input[type="submit"], input[type="button"], .clickable');
            
            if (isInteractive) {
              const target = e.target.matches('button, a, [role="button"], input[type="submit"], input[type="button"], .clickable') ? 
                            e.target : 
                            e.target.closest('button, a, [role="button"], input[type="submit"], input[type="button"], .clickable');
              
              const ripple = document.createElement('span');
              ripple.classList.add('click-ripple');
              
              const rect = target.getBoundingClientRect();
              const size = Math.max(rect.width, rect.height);
              
              ripple.style.width = ripple.style.height = size + 'px';
              ripple.style.left = (e.clientX - rect.left - size/2) + 'px';
              ripple.style.top = (e.clientY - rect.top - size/2) + 'px';
              
              target.appendChild(ripple);
              
              ripple.addEventListener('animationend', () => {
                ripple.remove();
              });
            }
          });
          
          // Thêm tính năng thích ứng màn hình
          const meta = document.querySelector('meta[name="viewport"]');
          if (!meta) {
            const newMeta = document.createElement('meta');
            newMeta.name = 'viewport';
            newMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
            document.head.appendChild(newMeta);
          } else {
            meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
          }
        `;
        iframeDocument.body.appendChild(script);
      } catch (error) {
        console.error('Không thể thêm hiệu ứng click vào iframe:', error);
      }
    }
  };

  useEffect(() => {
    if (isFrameLoaded) {
      // Chờ một chút để đảm bảo iframe đã tải hoàn toàn
      const timer = setTimeout(() => {
        injectClickEffectScript();
      }, 200);
      
      return () => clearTimeout(timer);
    }
  }, [isFrameLoaded]);

  return (
    <div className="h-full w-full overflow-hidden flex flex-col">
      <div className={`bg-background border-b p-2 flex items-center justify-between shadow-sm ${isMobile ? 'flex-col gap-2' : ''}`}>
        <h3 className="text-sm font-medium truncate mr-2">
          {miniGame.title}
        </h3>
        <div className="flex items-center gap-2">
          {shareUrl ? (
            <div className="flex items-center gap-2 bg-muted p-1.5 rounded-md max-w-sm transition-all animate-scale-in">
              <input 
                type="text" 
                value={shareUrl} 
                readOnly 
                className="bg-transparent text-xs flex-1 min-w-0 outline-none px-2"
              />
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-7 px-2 transition-transform active:scale-95"
                onClick={() => copyToClipboard(shareUrl)}
              >
                {isCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
          ) : (
            <Button 
              onClick={handleShareGame} 
              variant="outline" 
              size="sm" 
              className="h-8 transition-transform active:scale-95 animate-float-in neo-button"
            >
              <Share2 className="h-4 w-4 mr-1" />
              Chia Sẻ (48h)
            </Button>
          )}
        </div>
      </div>
      
      <div className="relative flex-1 overflow-hidden">
        {!isFrameLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-background z-10">
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full border-4 border-t-primary border-r-primary border-b-transparent border-l-transparent animate-spin"></div>
              <p className="text-sm font-medium text-muted-foreground animate-pulse">Đang tải minigame...</p>
            </div>
          </div>
        )}
        
        <iframe
          ref={iframeRef}
          srcDoc={miniGame.content}
          title={miniGame.title}
          sandbox="allow-scripts allow-same-origin"
          className={`w-full h-full border-none ${isFrameLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ height: '100%', width: '100%', overflow: 'hidden', position: 'absolute' }}
          onLoad={handleFrameLoad}
          scrolling="no"
        />
      </div>
    </div>
  );
};

export default GameView;
