
import React, { useEffect, useRef, useState } from 'react';
import { MiniGame } from './generator/AIGameGenerator';
import { Button } from '@/components/ui/button';
import { Share2, Home } from 'lucide-react';
import { saveGameForSharing } from '@/utils/gameExport';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface GameViewProps {
  miniGame: MiniGame;
}

const GameView: React.FC<GameViewProps> = ({ miniGame }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [iframeError, setIframeError] = useState<string | null>(null);

  // Save the game to history when it loads
  useEffect(() => {
    if (miniGame && miniGame.content) {
      try {
        // Save game to local storage for history
        saveGameForSharing(
          miniGame.title || "Minigame tương tác", 
          "", // Empty description
          miniGame.content
        );
      } catch (e) {
        console.error("Error saving game to history:", e);
      }
    }
  }, [miniGame]);

  // Handle sharing the game
  const handleShare = () => {
    try {
      const shareUrl = saveGameForSharing(
        miniGame.title || "Minigame tương tác",
        "", // Empty description
        miniGame.content
      );
      
      navigator.clipboard.writeText(shareUrl);
      
      toast({
        title: "Link Chia Sẻ Đã Được Sao Chép",
        description: "Đã sao chép liên kết vào clipboard. Link có hiệu lực trong 48 giờ.",
      });
    } catch (error) {
      toast({
        title: "Lỗi Chia Sẻ",
        description: "Không thể tạo link chia sẻ. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  };

  // Handle returning to home
  const handleBackToHome = () => {
    window.location.href = '/';
  };

  // Apply game optimization and fix script errors when iframe loads
  const handleIframeLoad = () => {
    try {
      if (!iframeRef.current) return;
      
      // Reset any previous errors
      setIframeError(null);

      const iframe = iframeRef.current;
      
      try {
        const iframeDoc = iframe.contentDocument;
        
        if (!iframeDoc) {
          console.warn("Cannot access iframe content document - possible cross-origin restriction");
          return;
        }
        
        // Add CSS to fix the game display
        const styleElement = iframeDoc.createElement('style');
        styleElement.textContent = `
          body {
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
            position: fixed !important;
            width: 100% !important;
            height: 100% !important;
          }
          
          /* Prevent answer spoilers in HTML comments */
          .comment, comment, [class*="comment"] {
            display: none !important;
            visibility: hidden !important;
          }
          
          /* Fix for potentially incorrect game logic */
          .incorrect.answer-chosen {
            background-color: #FFDDDD !important;
            border-color: #FF0000 !important;
          }
          
          .correct.answer-chosen {
            background-color: #DDFFDD !important;
            border-color: #00AA00 !important;
          }
          
          /* Ensure proper answer highlight */
          .answer.correct {
            background-color: #DDFFDD !important;
            border-color: #00AA00 !important;
          }
          
          h1, h2, h3, h4, h5, h6, header, .header, [class*="header"], [id*="header"], 
          [class*="title"], [id*="title"], .title-container, .game-title {
            display: none !important;
            visibility: hidden !important;
            height: 0 !important;
            overflow: hidden !important;
          }
          main, .main, #main, .game, #game, .game-container {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .next-button, .back-button, .restart-button, .other-button {
            position: fixed !important;
            bottom: 10px;
            z-index: 9999 !important;
          }
          html {
            overflow: hidden !important;
          }
          
          /* Fix for blocked images */
          img[src^="http"] {
            visibility: visible !important;
            display: block !important;
          }
        `;
        iframeDoc.head.appendChild(styleElement);
        
        // Add JavaScript to fix game logic and prevent scrolling
        try {
          const scriptElement = iframeDoc.createElement('script');
          scriptElement.textContent = `
            // Prevent scrolling
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
            
            // Fix potential quiz logic issues
            function fixQuizLogic() {
              // Fix click handlers if they're not working
              document.querySelectorAll('.answer, .option, .choice, button[data-option]').forEach(element => {
                if (!element.onclick) {
                  element.onclick = function() {
                    const isCorrect = this.classList.contains('correct') || 
                                     this.getAttribute('data-correct') === 'true' ||
                                     this.getAttribute('data-answer') === 'correct';
                    
                    // Mark selected answer
                    this.classList.add('answer-chosen');
                    
                    // Show correct answer if not already visible
                    if (!isCorrect) {
                      document.querySelectorAll('.correct, [data-correct="true"], [data-answer="correct"]').forEach(el => {
                        el.classList.add('highlight-correct');
                        el.style.backgroundColor = '#DDFFDD';
                        el.style.borderColor = '#00AA00';
                      });
                    }
                  };
                }
              });
              
              // Fix images that might be blocked
              document.querySelectorAll('img').forEach(img => {
                img.onerror = function() {
                  this.style.border = '1px dashed #999';
                  this.style.padding = '10px';
                  this.style.width = '100px';
                  this.style.height = '100px';
                  this.alt = 'Hình ảnh không thể tải';
                  this.src = 'data:image/svg+xml;charset=utf-8,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 width%3D%22100%22 height%3D%22100%22%3E%3Ctext x%3D%2250%25%22 y%3D%2250%25%22 text-anchor%3D%22middle%22 fill%3D%22%23999%22%3EHình ảnh bị thiếu%3C%2Ftext%3E%3C%2Fsvg%3E';
                };
              });
            }
            
            // Wait for DOM to be fully loaded then fix quiz logic
            if (document.readyState === 'loading') {
              document.addEventListener('DOMContentLoaded', fixQuizLogic);
            } else {
              fixQuizLogic();
            }
            
            // Also observe DOM changes to fix logic when content changes
            const observer = new MutationObserver(fixQuizLogic);
            observer.observe(document.body, {
              childList: true,
              subtree: true
            });
            
            // Prevent scrolling events
            window.addEventListener('scroll', function(e) {
              e.preventDefault();
              window.scrollTo(0, 0);
            }, { passive: false });
            
            document.addEventListener('touchmove', function(e) {
              e.preventDefault();
            }, { passive: false });
          `;
          iframeDoc.body.appendChild(scriptElement);
        } catch (scriptError) {
          console.warn("Error executing script in iframe:", scriptError);
        }
      } catch (crossOriginError) {
        console.warn("Cross-origin restriction prevented accessing iframe content:", crossOriginError);
        setIframeError("Không thể tương tác với minigame do hạn chế bảo mật. Vui lòng thử tải lại trang.");
      }
    } catch (e) {
      console.error("General error in handleIframeLoad:", e);
      setIframeError("Lỗi khi tải minigame. Vui lòng thử lại.");
    }
  };

  // Pre-process HTML content to fix potential issues and improve game logic
  const processHtmlContent = (html: string): string => {
    if (!html) return '';
    
    // Fix common issues in Gemini-generated content
    let processedHtml = html
      // Fix image handling
      .replace(/<img\s+/gi, '<img crossorigin="anonymous" onerror="this.onerror=null; this.style.border=\'1px dashed #999\'; this.alt=\'Hình ảnh không thể tải\'; this.style.width=\'100px\'; this.style.height=\'100px\';" ')
      
      // Ensure scripts run in the right order
      .replace(/<\/body>/i, '<script>document.addEventListener("DOMContentLoaded", function() { if(typeof initGame === "function") initGame(); });</script></body>')
      
      // Fix broken JSON that might cause logic issues
      .replace(/JSON\.parse\(['"](.+?)['"]\)/g, function(match, p1) {
        // Properly escape JSON string
        return 'JSON.parse(\'' + p1.replace(/'/g, "\\'").replace(/\\"/g, '\\\\"') + '\')';
      });
    
    return processedHtml;
  };

  if (!miniGame || !miniGame.content) {
    return <div>Không thể tải minigame</div>;
  }

  return (
    <div className="flex flex-col h-full w-full items-center justify-center overflow-hidden">
      <div className="flex-1 relative w-full h-full overflow-hidden flex items-center justify-center">
        {iframeError ? (
          <div className="bg-destructive/10 text-destructive p-4 rounded-md flex flex-col items-center m-4">
            <p>{iframeError}</p>
            <Button 
              variant="outline" 
              className="mt-3" 
              onClick={() => window.location.reload()}
            >
              Tải lại trang
            </Button>
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            srcDoc={processHtmlContent(miniGame.content)}
            className="w-full h-full border-0 mx-auto"
            sandbox="allow-scripts allow-popups allow-same-origin"
            onLoad={handleIframeLoad}
            title={miniGame.title || "Minigame"}
            style={{ maxWidth: '100%', height: '100%', margin: '0 auto' }}
          />
        )}
      </div>
      
      {/* Control buttons */}
      <div className="absolute bottom-4 right-4 flex space-x-2 z-10">
        <Button 
          size="sm" 
          variant="ghost"
          className="bg-primary/10" 
          onClick={handleBackToHome}
        >
          <Home size={16} className="mr-1" />
          Trở Về
        </Button>
        
        <Button 
          size="sm" 
          variant="ghost"
          className="bg-primary/10" 
          onClick={handleShare}
        >
          <Share2 size={16} className="mr-1" />
          Chia Sẻ
        </Button>
      </div>
    </div>
  );
};

export default GameView;
