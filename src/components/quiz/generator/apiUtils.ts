
/**
 * Logs an informational message
 * @param source Source of the log
 * @param message Message to log
 * @param data Optional data to include
 */
export const logInfo = (source: string, message: string, data?: any): void => {
  console.log(`[${source}] INFO: ${message}`, data || '');
};

/**
 * Logs an error message
 * @param source Source of the error
 * @param message Error message
 * @param error Optional error object
 */
export const logError = (source: string, message: string, error?: any): void => {
  console.error(`[${source}] ERROR: ${message}`, error || '');
};

/**
 * Logs a warning message
 * @param source Source of the warning
 * @param message Warning message
 * @param data Optional data to include
 */
export const logWarning = (source: string, message: string, data?: any): void => {
  console.warn(`[${source}] WARNING: ${message}`, data || '');
};

/**
 * Logs a success message
 * @param source Source of the success
 * @param message Success message
 * @param data Optional data to include
 */
export const logSuccess = (source: string, message: string, data?: any): void => {
  console.log(`[${source}] SUCCESS: ${message}`, data || '');
};

/**
 * Measures execution time
 * @param startTime Start time in milliseconds
 * @returns Object with time measurements
 */
export const measureExecutionTime = (startTime: number): { milliseconds: number; seconds: string } => {
  const elapsed = Date.now() - startTime;
  return {
    milliseconds: elapsed,
    seconds: (elapsed / 1000).toFixed(2)
  };
};
