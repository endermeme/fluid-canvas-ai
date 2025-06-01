
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
 * Simple success logging
 */
export function logSuccess(context: string, message: string, data?: any) {
  console.log(`✅ ${context}: ${message}${data?.seconds ? ` (${data.seconds}s)` : ''}`);
}

/**
 * Simple error logging
 */
export function logError(context: string, message: string, error?: any) {
  console.error(`❌ ${context}: ${message}`);
  if (error) {
    console.error(error);
  }
}

/**
 * Create basic API error
 */
export function createAPIError(
  code: ErrorCode, 
  technicalDetails: string,
  context?: any
): APIError {
  return new APIError(
    code,
    "API Error occurred",
    technicalDetails,
    [],
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
