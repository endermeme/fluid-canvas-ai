'use client';

import { useState, useEffect, useRef } from 'react';
import { enhanceIframeContent } from '@/utils/iframe-utils';

export default function IframeDemo() {
  const [iframeHtml, setIframeHtml] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDemo, setSelectedDemo] = useState<string>('wheel-demo');
  
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const fetchAndProcessHtml = async (demoFile = selectedDemo) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Gọi API endpoint để lấy nội dung HTML
      const response = await fetch(`/api/get-iframe-demo?file=${demoFile}`);
      
      if (!response.ok) {
        throw new Error(`Không thể tải nội dung. Trạng thái: ${response.status}`);
      }
      
      const htmlContent = await response.text();
      
      // Xử lý nội dung HTML bằng utility function
      const enhancedHtml = enhanceIframeContent(htmlContent);
      setIframeHtml(enhancedHtml);
    } catch (err) {
      console.error('Error fetching iframe content:', err);
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi khi tải nội dung');
    } finally {
      setIsLoading(false);
    }
  };

  // Change demo
  const changeDemo = (demoFile: string) => {
    setSelectedDemo(demoFile);
    fetchAndProcessHtml(demoFile);
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
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => fetchAndProcessHtml()}
              className="demo-button"
            >
              Tải lại nội dung
            </button>
            
            <select 
              value={selectedDemo}
              onChange={(e) => changeDemo(e.target.value)}
              className="bg-white text-gray-800 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="wheel-demo">Vòng Quay May Mắn</option>
              <option value="iframe-test">Canvas Vẽ Tay</option>
            </select>
          </div>
          
          <div className="text-sm text-gray-500">
            <span className="bg-gray-100 px-2 py-1 rounded">{selectedDemo}.html</span>
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
              <span className="font-medium">
                {selectedDemo === 'wheel-demo' ? 'Vòng Quay May Mắn' : 'Interactive Canvas Demo'}
              </span>
              <span className="text-xs text-gray-500">
                {selectedDemo === 'wheel-demo' ? 'Canvas 400 x 400' : 'Canvas 500 x 300'}
              </span>
            </div>
            
            <div className="iframe-container bg-gray-900">
              <iframe 
                ref={iframeRef}
                srcDoc={iframeHtml}
                className="w-full"
                style={{ 
                  height: selectedDemo === 'wheel-demo' ? '700px' : '600px',
                  backgroundColor: selectedDemo === 'wheel-demo' ? '#1e2130' : '#f9f9f9' 
                }}
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