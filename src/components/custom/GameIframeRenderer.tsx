
import React, { forwardRef, useEffect, useState } from 'react';
import { enhanceIframeContent } from '@/components/quiz/utils/iframe-utils';

interface GameIframeRendererProps {
  title: string;
  isLoaded?: boolean;
}

const GameIframeRenderer = forwardRef<HTMLIFrameElement, GameIframeRendererProps>(
  ({ title, isLoaded = false }, ref) => {
    const [iframeContent, setIframeContent] = useState<string>('');

    useEffect(() => {
      const initializeIframe = async () => {
        if (ref && typeof ref === 'object' && ref.current) {
          const iframe = ref.current;
          
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
          
          iframe.srcdoc = loadingHtml;
          setIframeContent(loadingHtml);
        }
      };

      initializeIframe();
    }, [ref, title]);

    const updateIframeContent = async (content: string) => {
      try {
        console.log('🎮 Updating iframe with content:', {
          contentLength: content.length,
          hasHTML: content.includes('<html'),
          title
        });

        if (ref && typeof ref === 'object' && ref.current) {
          const iframe = ref.current;
          
          // Enhance content trước khi set
          const enhancedContent = await enhanceIframeContent(content, title);
          
          console.log('🎮 Enhanced content:', {
            originalLength: content.length,
            enhancedLength: enhancedContent.length,
            hasDoctype: enhancedContent.includes('<!DOCTYPE')
          });

          iframe.srcdoc = enhancedContent;
          setIframeContent(enhancedContent);
          
          // Thêm event listener để detect khi iframe load xong
          iframe.onload = () => {
            console.log('🎮 Iframe loaded successfully');
            
            try {
              // Thử truy cập iframe content để check
              const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
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

    // Expose method to parent
    React.useImperativeHandle(ref, () => ({
      updateContent: updateIframeContent,
      getCurrentContent: () => iframeContent
    }));

    return (
      <iframe
        ref={ref}
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
