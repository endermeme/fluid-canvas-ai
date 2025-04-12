import { GoogleGenerativeAI } from '@google/generative-ai';

// API key cứng
const API_KEY = 'AIzaSyB-X13dE3qKEURW8DxLmK56Vx3lZ1c8IfA';

// Styles for console messages
const styles = {
  info: 'background: #0366d6; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold;',
  success: 'background: #2ea44f; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold;',
  warning: 'background: #f9a825; color: black; padding: 2px 6px; border-radius: 4px; font-weight: bold;',
  error: 'background: #d73a49; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold;',
  api: 'background: #6f42c1; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold;',
  timer: 'background: #586069; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold;',
  network: 'background: #e36209; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold;'
};

// Gemini client creation with custom headers
export const createGeminiClient = (apiKey: string = API_KEY) => {
  console.log(`%c API %c Initializing Gemini client`, styles.api, '');
  
  // Add custom headers for network debugging
  const transport = {
    async fetch(request: any) {
      // Clone the request to avoid modifying the original
      const customRequest = structuredClone(request);
      
      // Add custom headers for better visibility in network tab
      if (customRequest.headers) {
        customRequest.headers['X-Debug-Method'] = 'GeminiAPI.generateContent';
        customRequest.headers['X-Debug-Source'] = 'AIGameCreator';
        customRequest.headers['X-Debug-Timestamp'] = new Date().toISOString();
        customRequest.headers['X-Debug-RequestID'] = `gemini-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
      }
      
      // Log detailed network request
      console.groupCollapsed(`%c NETWORK REQUEST %c ${customRequest.method} ${new URL(customRequest.url).pathname}`, styles.network, '');
      console.log('URL:', customRequest.url);
      console.log('Method:', customRequest.method);
      console.log('Headers:', customRequest.headers);
      
      // Safely log body if it exists and is readable
      if (customRequest.body) {
        try {
          // Try to parse the body if it's JSON
          if (typeof customRequest.body === 'string') {
            const bodyData = JSON.parse(customRequest.body);
            console.log('Body:', bodyData);
          } else {
            console.log('Body:', customRequest.body);
          }
        } catch (e) {
          console.log('Body: [Unreadable body content]');
        }
      }
      console.groupEnd();
      
      const startTime = Date.now();
      
      try {
        const response = await fetch(customRequest.url, {
          method: customRequest.method,
          headers: customRequest.headers,
          body: customRequest.body
        });
        
        const duration = Date.now() - startTime;
        const statusStyle = response.ok ? styles.success : styles.error;
        
        // Clone response to be able to read it twice
        const clonedResponse = response.clone();
        let responseData;
        
        try {
          // Try to get the response data
          responseData = await clonedResponse.text();
          try {
            // Try to parse as JSON if possible
            responseData = JSON.parse(responseData);
          } catch { /* Continue with text if not JSON */ }
        } catch (e) {
          responseData = '[Không thể đọc response data]';
        }
        
        // Log detailed response
        console.groupCollapsed(`%c NETWORK RESPONSE %c ${response.status} ${new URL(customRequest.url).pathname} (${duration}ms)`, statusStyle, '');
        console.log('Status:', response.status, response.statusText);
        console.log('Duration:', `${duration}ms`);
        console.log('Headers:', Object.fromEntries([...response.headers.entries()]));
        console.log('Response Data:', responseData);
        console.groupEnd();
        
        // Clone response to keep original intact
        return response;
      } catch (error) {
        const duration = Date.now() - startTime;
        console.groupCollapsed(`%c NETWORK ERROR %c ${customRequest.method} ${new URL(customRequest.url).pathname} (${duration}ms)`, styles.error, '');
        console.error('Error Object:', error);
        console.error('Stack:', error.stack);
        console.groupEnd();
        throw error;
      }
    }
  };

  // Luôn sử dụng API_KEY cứng
  const genAI = new GoogleGenerativeAI(API_KEY, { transport });
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  
  console.log(`%c API %c Gemini client initialized with model: gemini-2.0-flash`, styles.success, '');
  return model;
};

// Enhanced logging utilities
export const logInfo = (source: string, message: string, data?: any) => {
  if (data) {
    console.log(`%c ${source} %c ${message}`, styles.info, '', data);
  } else {
    console.log(`%c ${source} %c ${message}`, styles.info, '');
  }
};

export const logSuccess = (source: string, message: string, data?: any) => {
  if (data) {
    console.log(`%c ${source} %c ${message}`, styles.success, '', data);
  } else {
    console.log(`%c ${source} %c ${message}`, styles.success, '');
  }
};

export const logError = (source: string, message: string, error?: any) => {
  console.groupCollapsed(`%c ${source} ERROR %c ${message}`, styles.error, '');
  console.error(error || 'No error details provided');
  console.trace('Stack trace:');
  console.groupEnd();
};

export const logWarning = (source: string, message: string, data?: any) => {
  if (data) {
    console.log(`%c ${source} WARNING %c ${message}`, styles.warning, '', data);
  } else {
    console.log(`%c ${source} WARNING %c ${message}`, styles.warning, '');
  }
};

export const measureExecutionTime = (startTime: number): { seconds: string, ms: number } => {
  const ms = Date.now() - startTime;
  return { 
    seconds: (ms / 1000).toFixed(2),
    ms
  };
};

// Format object để log dễ đọc
export const formatLogObject = (obj: any): string => {
  if (!obj) return 'undefined';
  
  try {
    const result = JSON.stringify(obj, (key, value) => {
      // Xử lý các trường hợp đặc biệt
      if (value instanceof Error) {
        return {
          name: value.name,
          message: value.message,
          stack: value.stack
        };
      }
      // Giới hạn độ dài của chuỗi
      if (typeof value === 'string' && value.length > 500) {
        return value.substring(0, 500) + '... [Nội dung dài]';
      }
      return value;
    }, 2);
    
    return result;
  } catch (e) {
    return `[Object không thể serialize: ${typeof obj}]`;
  }
};

// Debug API request/response
export const logApiRequest = (method: string, url: string, data?: any) => {
  console.groupCollapsed(`%c API REQUEST %c ${method} ${new URL(url).pathname}`, styles.api, '');
  console.log('URL:', url);
  console.log('Method:', method);
  console.log('Timestamp:', new Date().toISOString());
  console.log('Request ID:', `req-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`);
  if (data) console.log('Data:', data);
  console.trace('Request stack:');
  console.groupEnd();
};

export const logApiResponse = (url: string, status: number, data: any, duration: number) => {
  const statusStyle = status >= 200 && status < 300 ? styles.success : styles.error;
  console.groupCollapsed(`%c API RESPONSE %c ${status} ${new URL(url).pathname} (${duration}ms)`, statusStyle, '');
  console.log('Status:', status);
  console.log('Duration:', `${duration}ms`);
  console.log('Timestamp:', new Date().toISOString());
  console.log('Response Size:', typeof data === 'string' ? `${data.length} chars` : 
    (data instanceof Object ? `${JSON.stringify(data).length} chars` : 'Unknown'));
  console.log('Data:', data);
  console.groupEnd();
};
