/**
 * GeminiClient - Module xử lý kết nối với Gemini API
 * 
 * Module này cung cấp các hàm để gọi Gemini API một cách an toàn,
 * với xử lý lỗi phù hợp và đóng kết nối đúng cách
 */

import {
  GEMINI_MODELS,
  API_VERSION,
  getApiEndpoint,
  DEFAULT_GENERATION_SETTINGS,
  REQUEST_TIMEOUT,
  MAX_RETRY_ATTEMPTS
} from '@/constants/api-constants';

import {
  logInfo,
  logError,
  logWarning,
  logSuccess,
  measureExecutionTime
} from './apiUtils';

// Constants
const SOURCE = "GEMINI_CLIENT";

// Types
export interface GeminiRequestOptions {
  prompt: string;
  model?: string;
  temperature?: number;
  topK?: number;
  topP?: number;
  maxOutputTokens?: number;
  timeout?: number;
  signal?: AbortSignal;
}

export interface GeminiResponse {
  success: boolean;
  content?: string;
  error?: string;
  metrics?: {
    tokens?: number;
    timeMs?: number;
    attempts?: number;
  };
}

/**
 * Gọi Gemini API với xử lý lỗi và retry logic
 */
export async function callGeminiAPI(options: GeminiRequestOptions): Promise<GeminiResponse> {
  const {
    prompt,
    model = GEMINI_MODELS.CUSTOM_GAME,
    temperature = DEFAULT_GENERATION_SETTINGS.temperature,
    topK = DEFAULT_GENERATION_SETTINGS.topK,
    topP = DEFAULT_GENERATION_SETTINGS.topP,
    maxOutputTokens = DEFAULT_GENERATION_SETTINGS.maxOutputTokens,
    timeout = REQUEST_TIMEOUT,
  } = options;

  // Tạo AbortController để hủy request nếu quá timeout
  const controller = new AbortController();
  const { signal } = controller;
  
  // Thiết lập timeout
  const timeoutId = setTimeout(() => {
    controller.abort();
    logWarning(SOURCE, `Request aborted due to timeout (${timeout}ms)`);
  }, timeout);

  let attempts = 0;
  let lastError: Error | null = null;

  logInfo(SOURCE, `Starting API call with model: ${model}`, {
    promptLength: prompt.length,
    temperature,
    maxOutputTokens
  });

  const startTime = Date.now();
  
  try {
    while (attempts < MAX_RETRY_ATTEMPTS) {
      attempts++;
      
      try {
        logInfo(SOURCE, `Attempt ${attempts}/${MAX_RETRY_ATTEMPTS}`);
        
        const payload = {
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature,
            topK,
            topP,
            maxOutputTokens
          }
        };
        
        const response = await fetch(getApiEndpoint(model), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
          signal
        });
        
        // Xóa timeout khi có response
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
        }
        
        const result = await response.json();
        const text = result?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        
        if (!text) {
          throw new Error('No content returned from API');
        }
        
        const { ms } = measureExecutionTime(startTime);
        logSuccess(SOURCE, `API call succeeded in ${ms}ms (attempt ${attempts}/${MAX_RETRY_ATTEMPTS})`);
        
        return {
          success: true,
          content: text,
          metrics: {
            tokens: text.split(/\s+/).length,
            timeMs: ms,
            attempts
          }
        };
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          lastError = new Error(`Request timed out after ${timeout}ms`);
          logError(SOURCE, `Timeout on attempt ${attempts}/${MAX_RETRY_ATTEMPTS}`, lastError);
          
          // Vẫn retry sau khi timeout nếu chưa đạt số lần tối đa
          if (attempts < MAX_RETRY_ATTEMPTS) {
            const delayMs = Math.pow(2, attempts - 1) * 1000;
            logInfo(SOURCE, `Retrying after timeout in ${delayMs}ms...`);
            await new Promise(resolve => setTimeout(resolve, delayMs));
            continue;
          }
          
          break; // Dừng nếu đã đạt số lần retry tối đa
        }
        
        lastError = error instanceof Error ? error : new Error(String(error));
        logError(SOURCE, `Error on attempt ${attempts}/${MAX_RETRY_ATTEMPTS}`, lastError);
        
        // Chỉ retry nếu chưa đạt số lần tối đa
        if (attempts < MAX_RETRY_ATTEMPTS) {
          // Exponential backoff: 1s, 2s, 4s, ...
          const delayMs = Math.pow(2, attempts - 1) * 1000;
          logInfo(SOURCE, `Retrying in ${delayMs}ms...`);
          await new Promise(resolve => setTimeout(resolve, delayMs));
        }
      }
    }
    
    // Nếu đã thử hết số lần và vẫn lỗi
    const { ms } = measureExecutionTime(startTime);
    logError(SOURCE, `All ${attempts} attempts failed after ${ms}ms`, lastError);
    
    return {
      success: false,
      error: lastError?.message || 'Unknown error occurred',
      metrics: {
        timeMs: ms,
        attempts
      }
    };
  } finally {
    // Đảm bảo luôn clear timeout để tránh memory leak
    clearTimeout(timeoutId);
  }
}

/**
 * Hàm tiện ích để kiểm tra kết nối với Gemini API
 */
export async function testGeminiConnection(): Promise<boolean> {
  try {
    const response = await callGeminiAPI({
      prompt: "Test connection. Please respond with 'Connection successful'.",
      maxOutputTokens: 20,
      temperature: 0,
      timeout: 5000
    });
    
    return response.success && response.content?.includes('Connection successful');
  } catch (error) {
    logError(SOURCE, "Connection test failed", error);
    return false;
  }
}

export default {
  callGeminiAPI,
  testGeminiConnection
}; 