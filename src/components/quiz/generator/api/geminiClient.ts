
import { logInfo, logError } from '../apiUtils';
import { 
  GEMINI_MODELS, 
  API_VERSION, 
  getApiEndpoint,
  DEFAULT_GENERATION_SETTINGS 
} from '@/constants/api-constants';

const SOURCE = "GEMINI_CLIENT";

interface GeminiRequest {
  prompt: string;
}

interface GeminiResponse {
  text: string;
  status: number;
  statusText: string;
}

export const makeGeminiRequest = async ({ prompt }: GeminiRequest): Promise<GeminiResponse> => {
  logInfo(SOURCE, `Sending request to Gemini API`);
  
  const payload = {
    contents: [{
      parts: [{text: prompt}]
    }],
    generationConfig: {
      ...DEFAULT_GENERATION_SETTINGS,
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 8192
    }
  };

  try {
    // Thêm timeout để tránh chờ quá lâu
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 giây timeout
    
    const response = await fetch(getApiEndpoint(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    
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

    return {
      text,
      status: response.status,
      statusText: response.statusText
    };
  } catch (error) {
    logError(SOURCE, "Network error when calling Gemini API", error);
    
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Vui lòng thử lại sau.');
    }
    
    if (error.message.includes('NetworkError')) {
      throw new Error('Không thể kết nối đến API. Vui lòng kiểm tra kết nối mạng và thử lại.');
    }
    
    throw error;
  }
};
