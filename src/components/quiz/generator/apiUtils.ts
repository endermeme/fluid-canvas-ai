
/**
 * Utility functions for API logging and error handling
 */

/**
 * Log info messages with proper indentation
 * @param component Component name
 * @param message Message to log
 * @param data Optional data to log
 */
export const logInfo = (component: string, message: string, data?: any): void => {
  console.info(`[${component}] INFO: ${message}`);
  if (data) {
    console.info(JSON.stringify(data, null, 2));
  }
};

/**
 * Log error messages with proper indentation
 * @param component Component name
 * @param message Error message
 * @param error Error object or details
 */
export const logError = (component: string, message: string, error?: any): void => {
  console.error(`[${component}] ERROR: ${message}`);
  
  if (error) {
    if (error instanceof Error) {
      console.error(`Error name: ${error.name}`);
      console.error(`Error message: ${error.message}`);
      console.error(`Error stack: ${error.stack}`);
    } else if (typeof error === 'object') {
      console.error(JSON.stringify(error, null, 2));
    } else {
      console.error(error);
    }
  }
};

/**
 * Log warning messages with proper indentation
 * @param component Component name
 * @param message Warning message
 * @param data Optional data to log
 */
export const logWarning = (component: string, message: string, data?: any): void => {
  console.warn(`[${component}] WARNING: ${message}`);
  if (data) {
    console.warn(JSON.stringify(data, null, 2));
  }
};

/**
 * Sanitize log content to prevent XSS and formatting issues
 * @param content Content to sanitize
 * @returns Sanitized content
 */
export const sanitizeLogContent = (content: any): string => {
  if (typeof content === 'string') {
    return content;
  }
  
  try {
    return JSON.stringify(content, null, 2);
  } catch (error) {
    return String(content);
  }
};
