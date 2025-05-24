import React, { useState, useEffect } from 'react';
import { testGeminiJsonProcessing } from '@/lib/iframe-utils.test';

const IframeTest: React.FC = () => {
  const [iframeHtml, setIframeHtml] = useState<string>('');
  const [testResults, setTestResults] = useState<any>(null);
  const [testStatus, setTestStatus] = useState<'idle' | 'running' | 'completed' | 'error'>('idle');

  const runTest = async () => {
    setTestStatus('running');
    try {
      const result = await testGeminiJsonProcessing();
      if (result.error) {
        console.error('Test error:', result.error);
        setTestStatus('error');
        return;
      }

      setIframeHtml(result.enhancedHtml);
      setTestResults(result.testResults);
      setTestStatus('completed');
    } catch (error) {
      console.error('Test failed:', error);
      setTestStatus('error');
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Test Xử Lý JSON Gemini cho Iframe</h1>
      
      <div className="mb-6">
        <button 
          onClick={runTest}
          disabled={testStatus === 'running'}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {testStatus === 'running' ? 'Đang chạy...' : 'Chạy test'}
        </button>
      </div>

      {testStatus === 'completed' && testResults && (
        <div className="mb-6 p-4 border rounded bg-gray-50">
          <h2 className="text-xl font-semibold mb-2">Kết quả kiểm tra:</h2>
          <ul className="list-disc pl-6">
            <li className={testResults.hasHtml ? "text-green-600" : "text-red-600"}>
              HTML: {testResults.hasHtml ? "✓ Đã tích hợp" : "✗ Không tìm thấy"}
            </li>
            <li className={testResults.hasCss ? "text-green-600" : "text-red-600"}>
              CSS: {testResults.hasCss ? "✓ Đã tích hợp" : "✗ Không tìm thấy"}
            </li>
            <li className={testResults.hasJs ? "text-green-600" : "text-red-600"}>
              JavaScript: {testResults.hasJs ? "✓ Đã tích hợp" : "✗ Không tìm thấy"}
            </li>
          </ul>
        </div>
      )}

      {testStatus === 'error' && (
        <div className="p-4 border border-red-300 bg-red-50 text-red-700 rounded mb-6">
          Lỗi khi chạy test. Xem console để biết chi tiết.
        </div>
      )}

      {iframeHtml && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Kết quả hiển thị trong iframe:</h2>
          <div className="border border-gray-300 rounded-lg p-1 bg-gray-100">
            <iframe 
              srcDoc={iframeHtml}
              title="Test iframe"
              className="w-full h-[500px] border-none"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default IframeTest; 