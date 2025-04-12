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
  timer: 'background: #586069; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold;'
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
      }
      
      // Log network request for debugging
      console.log(`%c API REQUEST %c ${customRequest.method} ${customRequest.url}`, 
        styles.api, '', customRequest);
      
      const startTime = Date.now();
      
      try {
        const response = await fetch(customRequest.url, {
          method: customRequest.method,
          headers: customRequest.headers,
          body: customRequest.body
        });
        
        const duration = Date.now() - startTime;
        console.log(`%c API RESPONSE %c Status: ${response.status} (${duration}ms)`, 
          styles.api, '', response.ok ? 'Success' : 'Failed');
        
        // Clone response to keep original intact
        return response;
      } catch (error) {
        console.error(`%c API ERROR %c Request failed`, styles.error, '', error);
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
    return JSON.stringify(obj, null, 2);
  } catch (e) {
    return `[Object không thể serialize: ${typeof obj}]`;
  }
};

// Debug API request/response
export const logApiRequest = (method: string, url: string, data?: any) => {
  console.groupCollapsed(`%c API REQUEST %c ${method} ${new URL(url).pathname}`, styles.api, '');
  console.log('URL:', url);
  console.log('Method:', method);
  if (data) console.log('Data:', data);
  console.groupEnd();
};

export const logApiResponse = (url: string, status: number, data: any, duration: number) => {
  const statusStyle = status >= 200 && status < 300 ? styles.success : styles.error;
  console.groupCollapsed(`%c API RESPONSE %c ${status} ${new URL(url).pathname} (${duration}ms)`, statusStyle, '');
  console.log('Status:', status);
  console.log('Duration:', `${duration}ms`);
  console.log('Data:', data);
  console.groupEnd();
};
