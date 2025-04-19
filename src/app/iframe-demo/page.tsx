'use client';

import { useState, useEffect } from 'react';
import { enhanceIframeContent } from '@/components/quiz/custom-games/utils/iframe-utils';

export default function IframeDemo() {
  const [iframeHtml, setIframeHtml] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAndProcessHtml = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/get-iframe-demo');
      
      if (!response.ok) {
        throw new Error(`Không thể tải nội dung. Trạng thái: ${response.status}`);
      }
      
      const htmlContent = await response.text();
      
      const enhancedHtml = enhanceIframeContent(htmlContent);
      setIframeHtml(enhancedHtml);
    } catch (err) {
      console.error('Error fetching iframe content:', err);
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi khi tải nội dung');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAndProcessHtml();
  }, []);

  return (
    <div className="demo-container">
      <div className="demo-header">
        <h1 className="text-2xl font-bold">Canvas Demo Preview</h1>
        <p className="text-blue-100">Xem trước nội dung demo tương tác</p>
      </div>
      
      <div className="demo-content">
        <div className="flex items-center justify-between mb-6">
          <div>
            <button 
              onClick={fetchAndProcessHtml}
              className="demo-button"
            >
              Tải lại nội dung
            </button>
          </div>
          
          <div className="text-sm text-gray-500">
            <span className="bg-gray-100 px-2 py-1 rounded">iframe-test.html</span>
          </div>
        </div>
        
        {isLoading && (
          <div className="p-8 text-center bg-gray-50 border border-gray-200 rounded-lg">
            <div className="loading-spinner mb-2"></div>
            <p>Đang tải nội dung demo...</p>
          </div>
        )}
        
        {error && (
          <div className="error-message">
            <p className="font-medium">Không thể tải nội dung:</p>
            <p>{error}</p>
          </div>
        )}
        
        {!isLoading && !error && (
          <div className="iframe-wrapper">
            <div className="iframe-header">
              <span className="font-medium">Interactive Canvas Demo</span>
              <span className="text-xs text-gray-500">Kích thước: 500 x 300</span>
            </div>
            
            <div className="iframe-container">
              <iframe 
                srcDoc={iframeHtml}
                className="w-full"
                style={{ height: '600px' }}
                sandbox="allow-scripts allow-popups allow-same-origin"
                title="Demo Content"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
