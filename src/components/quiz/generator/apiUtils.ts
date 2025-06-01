
/**
 * Utility functions for API communication and logging
 */

export const SOURCE = "CUSTOM_GAME_GENERATOR";

// Error codes for better categorization
export const ERROR_CODES = {
  API_QUOTA_EXCEEDED: 'API_QUOTA_EXCEEDED',
  API_REQUEST_FAILED: 'API_REQUEST_FAILED', 
  API_TIMEOUT: 'API_TIMEOUT',
  API_NO_CONTENT: 'API_NO_CONTENT',
  API_CONTENT_TRUNCATED: 'API_CONTENT_TRUNCATED',
  NETWORK_ERROR: 'NETWORK_ERROR',
  PARSING_ERROR: 'PARSING_ERROR'
} as const;

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];

// Logging levels
export const LOG_LEVELS = {
  CRITICAL: 0,
  ERROR: 1, 
  WARNING: 2,
  INFO: 3,
  DEBUG: 4
} as const;

// Current log level (can be adjusted based on environment)
const CURRENT_LOG_LEVEL = LOG_LEVELS.INFO;

/**
 * Enhanced error with context and recovery suggestions
 */
export class APIError extends Error {
  constructor(
    public code: ErrorCode,
    public userMessage: string,
    public technicalDetails: string,
    public recoverySuggestions: string[] = [],
    public context?: any
  ) {
    super(technicalDetails);
    this.name = 'APIError';
  }
}

/**
 * Log information with level checking
 */
export function logInfo(context: string, message: string, data?: any) {
  if (CURRENT_LOG_LEVEL < LOG_LEVELS.INFO) return;
  
  console.log(
    `%c ${context} INFO %c ${message}`,
    'background: #0366d6; color: white; padding: 2px 6px; border-radius: 4px;',
    'color: #0366d6; font-weight: bold;'
  );
  
  if (data) {
    // Only log essential data, not full objects
    const essentialData = extractEssentialData(data);
    if (Object.keys(essentialData).length > 0) {
      console.log('%c 📊 Data:', 'color: #0366d6;', essentialData);
    }
  }
}

/**
 * Log success with minimal noise
 */
export function logSuccess(context: string, message: string, data?: any) {
  if (CURRENT_LOG_LEVEL < LOG_LEVELS.INFO) return;
  
  console.log(
    `%c ${context} SUCCESS %c ${message}`,
    'background: #2ea44f; color: white; padding: 2px 6px; border-radius: 4px;',
    'color: #2ea44f; font-weight: bold;'
  );
  
  // Only log timing and essential metrics for success
  if (data?.seconds) {
    console.log(`%c ⏱️ Duration: ${data.seconds}s`, 'color: #2ea44f;');
  }
}

/**
 * Log warning with context
 */
export function logWarning(context: string, message: string, data?: any) {
  if (CURRENT_LOG_LEVEL < LOG_LEVELS.WARNING) return;
  
  console.log(
    `%c ${context} WARNING %c ${message}`,
    'background: #f9a825; color: black; padding: 2px 6px; border-radius: 4px;',
    'color: #f9a825; font-weight: bold;'
  );
  
  if (data) {
    const essentialData = extractEssentialData(data);
    if (Object.keys(essentialData).length > 0) {
      console.log('%c ⚠️ Context:', 'color: #f9a825;', essentialData);
    }
  }
}

/**
 * Enhanced error logging with structured information
 */
export function logError(context: string, message: string, error?: any) {
  if (CURRENT_LOG_LEVEL < LOG_LEVELS.ERROR) return;
  
  console.error(
    `%c ${context} ERROR %c ${message}`,
    'background: #d73a49; color: white; padding: 2px 6px; border-radius: 4px;',
    'color: #d73a49; font-weight: bold;'
  );
  
  if (error) {
    if (error instanceof APIError) {
      console.error(`%c 🚨 Code: ${error.code}`, 'color: #d73a49; font-weight: bold;');
      console.error(`%c 👤 User Message: ${error.userMessage}`, 'color: #d73a49;');
      console.error(`%c 🔧 Technical: ${error.technicalDetails}`, 'color: #d73a49;');
      if (error.recoverySuggestions.length > 0) {
        console.error(`%c 💡 Suggestions:`, 'color: #d73a49; font-weight: bold;');
        error.recoverySuggestions.forEach((suggestion, index) => {
          console.error(`%c   ${index + 1}. ${suggestion}`, 'color: #d73a49;');
        });
      }
      if (error.context) {
        console.error(`%c 📋 Context:`, 'color: #d73a49;', extractEssentialData(error.context));
      }
    } else {
      console.error(error);
    }
  }
}

/**
 * Extract only essential data for logging to reduce noise
 */
function extractEssentialData(data: any): any {
  if (!data || typeof data !== 'object') return data;
  
  const essential: any = {};
  
  // Only include essential fields
  const essentialFields = [
    'topic', 'model', 'timeout', 'status', 'finishReason', 
    'candidatesCount', 'hasContent', 'contentLength', 'duration',
    'attempts', 'maxAttempts', 'errorCode', 'userMessage'
  ];
  
  essentialFields.forEach(field => {
    if (data[field] !== undefined) {
      essential[field] = data[field];
    }
  });
  
  // Handle nested objects
  if (data.candidates && Array.isArray(data.candidates)) {
    essential.candidatesCount = data.candidates.length;
  }
  
  if (data.usageMetadata) {
    essential.usage = {
      promptTokens: data.usageMetadata.promptTokenCount,
      responseTokens: data.usageMetadata.candidatesTokenCount
    };
  }
  
  return essential;
}

/**
 * Create structured API error with recovery suggestions
 */
export function createAPIError(
  code: ErrorCode, 
  technicalDetails: string,
  context?: any
): APIError {
  const errorMap = {
    [ERROR_CODES.API_QUOTA_EXCEEDED]: {
      userMessage: "API đã đạt giới hạn. Vui lòng thử lại sau ít phút.",
      suggestions: [
        "Chờ 1-2 phút rồi thử lại",
        "Thử tạo game đơn giản hơn",
        "Kiểm tra quota API key"
      ]
    },
    [ERROR_CODES.API_REQUEST_FAILED]: {
      userMessage: "Không thể kết nối đến dịch vụ AI. Vui lòng thử lại.",
      suggestions: [
        "Kiểm tra kết nối internet",
        "Thử lại sau vài giây",
        "Liên hệ hỗ trợ nếu lỗi tiếp tục"
      ]
    },
    [ERROR_CODES.API_TIMEOUT]: {
      userMessage: "Yêu cầu quá lâu (hơn 3 phút). Thử tạo game đơn giản hơn.",
      suggestions: [
        "Rút ngắn mô tả game",
        "Chọn chủ đề đơn giản hơn",
        "Thử lại với prompt ngắn gọn hơn"
      ]
    },
    [ERROR_CODES.API_NO_CONTENT]: {
      userMessage: "AI không tạo được nội dung game. Vui lòng thử chủ đề khác.",
      suggestions: [
        "Thay đổi chủ đề game",
        "Mô tả rõ ràng hơn về game muốn tạo",
        "Thử với cài đặt khác"
      ]
    },
    [ERROR_CODES.API_CONTENT_TRUNCATED]: {
      userMessage: "Nội dung game bị cắt ngắn. Game vẫn có thể hoạt động.",
      suggestions: [
        "Kiểm tra game có hoạt động không",
        "Thử tạo lại nếu game lỗi",
        "Chọn game đơn giản hơn"
      ]
    },
    [ERROR_CODES.NETWORK_ERROR]: {
      userMessage: "Lỗi kết nối mạng. Vui lòng kiểm tra internet.",
      suggestions: [
        "Kiểm tra kết nối internet",
        "Thử lại sau vài giây",
        "Tải lại trang nếu cần"
      ]
    },
    [ERROR_CODES.PARSING_ERROR]: {
      userMessage: "Lỗi xử lý dữ liệu từ AI. Vui lòng thử lại.",
      suggestions: [
        "Thử lại ngay lập tức",
        "Thay đổi mô tả game",
        "Liên hệ hỗ trợ nếu lỗi tiếp tục"
      ]
    }
  };
  
  const errorInfo = errorMap[code] || {
    userMessage: "Có lỗi xảy ra. Vui lòng thử lại.",
    suggestions: ["Thử lại", "Liên hệ hỗ trợ"]
  };
  
  return new APIError(
    code,
    errorInfo.userMessage,
    technicalDetails,
    errorInfo.suggestions,
    context
  );
}

/**
 * Measure execution time
 */
export function measureExecutionTime(startTime: number) {
  const endTime = Date.now();
  const ms = endTime - startTime;
  const seconds = (ms / 1000).toFixed(2);
  return { ms, seconds };
}

/**
 * Detect network vs API errors
 */
export function categorizeError(error: any): ErrorCode {
  if (error.name === 'AbortError' || error.message?.includes('timeout')) {
    return ERROR_CODES.API_TIMEOUT;
  }
  
  if (error.message?.includes('fetch') || error.message?.includes('network')) {
    return ERROR_CODES.NETWORK_ERROR;
  }
  
  if (error.message?.includes('quota') || error.message?.includes('limit')) {
    return ERROR_CODES.API_QUOTA_EXCEEDED;
  }
  
  if (error.message?.includes('No content') || error.message?.includes('Empty content')) {
    return ERROR_CODES.API_NO_CONTENT;
  }
  
  return ERROR_CODES.API_REQUEST_FAILED;
}
