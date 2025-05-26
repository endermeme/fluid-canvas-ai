
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GameApiResponse, GeneratorSettings } from './types';

const MODEL_NAME = 'gemini-1.5-pro-001';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

const model = genAI.getGenerativeModel({
  model: MODEL_NAME,
  generationConfig: {
    temperature: 0.7,
    topK: 30,
    topP: 0.9,
    maxOutputTokens: 8192,
  },
});

export const generateWithGemini = async (
  prompt: string,
  settings: GeneratorSettings = {}
): Promise<GameApiResponse> => {
  const startTime = Date.now();
  
  try {
    const generationConfig = {
      temperature: settings.temperature || 0.7,
      topK: settings.topK || 30,
      topP: settings.topP || 0.9,
      maxOutputTokens: settings.maxOutputTokens || 8192,
    };

    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      generationConfig,
    });
    
    const response = await model.generateContent(prompt);
    const responseTime = Date.now() - startTime;
    
    if (!response.response) {
      throw new Error('No response received from Gemini');
    }

    const content = response.response.text();
    
    // Xử lý và làm sạch content từ Gemini
    const processedContent = cleanGeminiResponse(content);
    
    return {
      success: true,
      content: processedContent,
      metrics: {
        tokensUsed: estimateTokens(content),
        responseTime
      }
    };
  } catch (error) {
    console.error('Gemini generation error:', error);
    const responseTime = Date.now() - startTime;
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      metrics: {
        tokensUsed: 0,
        responseTime
      }
    };
  }
};

// Làm sạch và xử lý response từ Gemini
const cleanGeminiResponse = (content: string): string => {
  // Loại bỏ markdown code blocks
  let cleaned = content.replace(/```html\s*/g, '').replace(/```\s*/g, '');
  
  // Loại bỏ các ký tự không mong muốn
  cleaned = cleaned.trim();
  
  // Đảm bảo có DOCTYPE nếu chưa có
  if (!cleaned.includes('<!DOCTYPE')) {
    cleaned = `<!DOCTYPE html>\n${cleaned}`;
  }
  
  // Đảm bảo có meta viewport cho responsive
  if (!cleaned.includes('viewport')) {
    cleaned = cleaned.replace(
      '<head>',
      '<head>\n    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">'
    );
  }
  
  return cleaned;
};

// Ước tính số tokens
const estimateTokens = (text: string): number => {
  return Math.ceil(text.length / 4);
};

export const countTokens = async (text: string): Promise<number> => {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const { totalTokens } = await model.countTokens(text);
    return totalTokens;
  } catch (error) {
    console.error("Error counting tokens:", error);
    return estimateTokens(text);
  }
};
