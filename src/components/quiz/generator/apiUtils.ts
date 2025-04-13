
/**
 * Utility functions for API communication and logging
 */

export const SOURCE = "CUSTOM_GAME_GENERATOR";

/**
 * Log information to the console with proper formatting
 * @param context The logging context/source
 * @param message The message to log
 * @param data Optional data to log
 */
export function logInfo(context: string, message: string, data?: any) {
  console.log(
    `%c ${context} INFO %c ${message}`,
    'background: #0366d6; color: white; padding: 2px 6px; border-radius: 4px;',
    'color: #0366d6; font-weight: bold;'
  );
  
  if (data) {
    console.log('%c 📊 Data:', 'color: #0366d6;', data);
  }
}

/**
 * Log success to the console with proper formatting
 * @param context The logging context/source
 * @param message The message to log
 * @param data Optional data to log
 */
export function logSuccess(context: string, message: string, data?: any) {
  console.log(
    `%c ${context} SUCCESS %c ${message}`,
    'background: #2ea44f; color: white; padding: 2px 6px; border-radius: 4px;',
    'color: #2ea44f; font-weight: bold;'
  );
  
  if (data) {
    console.log('%c 📊 Data:', 'color: #2ea44f;', data);
  }
}

/**
 * Log warning to the console with proper formatting
 * @param context The logging context/source
 * @param message The message to log
 * @param data Optional data to log
 */
export function logWarning(context: string, message: string, data?: any) {
  console.log(
    `%c ${context} WARNING %c ${message}`,
    'background: #f9a825; color: black; padding: 2px 6px; border-radius: 4px;',
    'color: #f9a825; font-weight: bold;'
  );
  
  if (data) {
    console.log('%c 📊 Data:', 'color: #f9a825;', data);
  }
}

/**
 * Log error to the console with proper formatting
 * @param context The logging context/source
 * @param message The message to log
 * @param error Optional error object
 */
export function logError(context: string, message: string, error?: any) {
  console.error(
    `%c ${context} ERROR %c ${message}`,
    'background: #d73a49; color: white; padding: 2px 6px; border-radius: 4px;',
    'color: #d73a49; font-weight: bold;'
  );
  
  if (error) {
    console.error(error);
  }
}

/**
 * Format an object for logging
 * @param obj Object to format
 * @returns Formatted object for logging
 */
export function formatLogObject(obj: any): string {
  try {
    if (typeof obj === 'string') return obj;
    return JSON.stringify(obj, null, 2);
  } catch (error) {
    return 'Unable to stringify object for logging';
  }
}

/**
 * Measure execution time
 * @param startTime Start time in milliseconds
 * @returns Object with execution time in milliseconds and seconds
 */
export function measureExecutionTime(startTime: number) {
  const endTime = Date.now();
  const ms = endTime - startTime;
  const seconds = (ms / 1000).toFixed(2);
  return { ms, seconds };
}
