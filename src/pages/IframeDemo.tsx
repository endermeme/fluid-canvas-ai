
import { useState, useEffect } from 'react';
import { enhanceIframeContent } from '@/utils/iframe-utils';
import IframeDemoLayout from '@/components/layout/IframeDemoLayout';

export default function IframeDemo() {
  const [iframeHtml, setIframeHtml] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAndProcessHtml = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch the HTML content from a pre-defined demo file
      const response = await fetch('/iframe-test.html');
      
      if (!response.ok) {
        throw new Error(`Không thể tải nội dung. Trạng thái: ${response.status}`);
      }
      
      const htmlContent = await response.text();
      
      // Process HTML content with utility function
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
    <IframeDemoLayout>
      <div className="demo-container">
        <div className="demo-header">
          <h1 className="text-2xl font-bold">Canvas Demo Preview</h1>
          <p className="text-blue-600">Xem trước nội dung demo tương tác</p>
        </div>
        
        <div className="demo-content">
          <div className="flex items-center justify-between mb-6">
            <div>
              <button 
                onClick={fetchAndProcessHtml}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
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
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
              <p className="font-medium">Không thể tải nội dung:</p>
              <p>{error}</p>
            </div>
          )}
          
          {!isLoading && !error && (
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <div className="bg-gray-100 p-2 border-b border-gray-300 flex justify-between items-center">
                <span className="font-medium">Interactive Canvas Demo</span>
                <span className="text-xs text-gray-500">Kích thước: 500 x 300</span>
              </div>
              
              <div className="bg-white">
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
    </IframeDemoLayout>
  );
}
