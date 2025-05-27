
import React, { forwardRef, useEffect, useState, useImperativeHandle } from 'react';
import { enhanceIframeContent } from '@/components/quiz/utils/iframe-utils';

interface GameIframeRendererProps {
  title: string;
  isLoaded?: boolean;
}

export interface GameIframeRef extends HTMLIFrameElement {
  updateContent: (content: string) => Promise<void>;
  getCurrentContent: () => string;
}

const GameIframeRenderer = forwardRef<GameIframeRef, GameIframeRendererProps>(
  ({ title, isLoaded = false }, ref) => {
    const [iframeContent, setIframeContent] = useState<string>('');
    const [iframeElement, setIframeElement] = useState<HTMLIFrameElement | null>(null);

    useEffect(() => {
      const initializeIframe = async () => {
        if (iframeElement) {
          // Tạo loading content
          const loadingHtml = `
            <!DOCTYPE html>
            <html lang="vi">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>${title}</title>
              <style>
                body {
                  margin: 0;
                  padding: 40px;
                  font-family: 'Segoe UI', sans-serif;
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  min-height: 100vh;
                  color: white;
                  text-align: center;
                }
                .loading {
                  animation: pulse 2s infinite;
                }
                @keyframes pulse {
                  0%, 100% { opacity: 1; }
                  50% { opacity: 0.5; }
                }
              </style>
            </head>
            <body>
              <div class="loading">
                <h2>🎮 Đang tải game...</h2>
                <p>Vui lòng đợi trong giây lát</p>
              </div>
            </body>
            </html>
          `;
          
          iframeElement.srcdoc = loadingHtml;
          setIframeContent(loadingHtml);
        }
      };

      initializeIframe();
    }, [iframeElement, title]);

    const updateIframeContent = async (content: string) => {
      try {
        console.log('🎮 Updating iframe with content:', {
          contentLength: content.length,
          hasHTML: content.includes('<html'),
          title
        });

        if (iframeElement) {
          // Enhance content trước khi set
          const enhancedContent = await enhanceIframeContent(content, title);
          
          console.log('🎮 Enhanced content:', {
            originalLength: content.length,
            enhancedLength: enhancedContent.length,
            hasDoctype: enhancedContent.includes('<!DOCTYPE')
          });

          iframeElement.srcdoc = enhancedContent;
          setIframeContent(enhancedContent);
          
          // Thêm event listener để detect khi iframe load xong
          iframeElement.onload = () => {
            console.log('🎮 Iframe loaded successfully');
            
            try {
              // Thử truy cập iframe content để check
              const iframeDoc = iframeElement.contentDocument || iframeElement.contentWindow?.document;
              if (iframeDoc) {
                console.log('🎮 Iframe document accessible:', {
                  title: iframeDoc.title,
                  bodyContent: iframeDoc.body?.innerHTML ? 'Present' : 'Missing'
                });
              }
            } catch (e) {
              console.warn('🎮 Cannot access iframe content (expected in some cases):', e);
            }
          };
        }
      } catch (error) {
        console.error('🎮 Error updating iframe content:', error);
      }
    };

    // Expose methods to parent with proper null checking
    useImperativeHandle(ref, () => {
      // Tạo một object tạm thời để return khi iframe chưa sẵn sàng
      const createTempRef = (): GameIframeRef => {
        const tempDiv = document.createElement('iframe') as HTMLIFrameElement;
        
        return Object.assign(tempDiv, {
          updateContent: async (content: string) => {
            console.log('🎮 updateContent called but iframe not ready, queuing...');
            // Đợi iframe sẵn sàng
            const checkIframe = () => {
              if (iframeElement) {
                updateIframeContent(content);
              } else {
                setTimeout(checkIframe, 100);
              }
            };
            checkIframe();
          },
          getCurrentContent: () => {
            console.log('🎮 getCurrentContent called but iframe not ready');
            return iframeContent;
          }
        }) as GameIframeRef;
      };

      // Nếu iframe element chưa sẵn sàng, trả về temp ref
      if (!iframeElement) {
        console.log('🎮 Iframe element not ready, returning temp ref');
        return createTempRef();
      }
      
      // Nếu iframe element đã sẵn sàng, trả về ref thực
      return Object.assign(iframeElement, {
        updateContent: updateIframeContent,
        getCurrentContent: () => iframeContent
      }) as GameIframeRef;
    }, [iframeElement, iframeContent, updateIframeContent]);

    return (
      <iframe
        ref={setIframeElement}
        title={title}
        className={`w-full h-full border-0 bg-white transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-90'
        }`}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
        loading="eager"
        style={{
          minHeight: '400px',
          backgroundColor: '#f8fafc'
        }}
      />
    );
  }
);

GameIframeRenderer.displayName = 'GameIframeRenderer';

export default GameIframeRenderer;
