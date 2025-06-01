
/**
 * Utility functions for API communication and logging
 */

export const SOURCE = "GEMINI";

// Error codes for better categorization
export const ERROR_CODES = {
  API_QUOTA_EXCEEDED: 'API_QUOTA_EXCEEDED',
  API_REQUEST_FAILED: 'API_REQUEST_FAILED', 
  API_TIMEOUT: 'API_TIMEOUT',
  API_NO_CONTENT: 'API_NO_CONTENT',
  NETWORK_ERROR: 'NETWORK_ERROR',
  PARSING_ERROR: 'PARSING_ERROR'
} as const;

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];

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
 * Minimal success logging
 */
export function logSuccess(context: string, message: string, data?: any) {
  console.log(`✅ ${context}: ${message}${data?.seconds ? ` (${data.seconds}s)` : ''}`);
}

/**
 * Essential warning logging
 */
export function logWarning(context: string, message: string, data?: any) {
  console.warn(`⚠️ ${context}: ${message}`);
  if (data?.duration) console.warn(`Duration: ${data.duration}`);
}

/**
 * Essential error logging
 */
export function logError(context: string, message: string, error?: any) {
  console.error(`❌ ${context}: ${message}`);
  
  if (error instanceof APIError) {
    console.error(`Code: ${error.code}`);
    console.error(`User: ${error.userMessage}`);
    console.error(`Tech: ${error.technicalDetails}`);
    if (error.context) {
      console.error('Context:', error.context);
    }
  } else if (error) {
    console.error(error);
  }
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
      userMessage: "API limit reached. Please try again in a few minutes.",
      suggestions: ["Wait 1-2 minutes", "Try simpler game", "Check API quota"]
    },
    [ERROR_CODES.API_REQUEST_FAILED]: {
      userMessage: "Cannot connect to AI service. Please try again.",
      suggestions: ["Check internet", "Retry in few seconds", "Contact support"]
    },
    [ERROR_CODES.API_TIMEOUT]: {
      userMessage: "Request took too long (over 3 minutes). Try simpler game.",
      suggestions: ["Shorter description", "Simpler topic", "Retry with concise prompt"]
    },
    [ERROR_CODES.API_NO_CONTENT]: {
      userMessage: "AI couldn't generate game content. Try different topic.",
      suggestions: ["Change game topic", "More detailed description", "Try different settings"]
    },
    [ERROR_CODES.NETWORK_ERROR]: {
      userMessage: "Network error. Please check your internet connection.",
      suggestions: ["Check internet", "Retry in few seconds", "Reload page"]
    },
    [ERROR_CODES.PARSING_ERROR]: {
      userMessage: "Error processing AI response. Please try again.",
      suggestions: ["Retry immediately", "Change description", "Contact support"]
    }
  };
  
  const errorInfo = errorMap[code] || {
    userMessage: "An error occurred. Please try again.",
    suggestions: ["Retry", "Contact support"]
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
