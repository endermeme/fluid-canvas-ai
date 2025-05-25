
/**
 * API Utilities - Helper functions for logging and debugging API calls
 */

export type LogLevel = 'info' | 'warning' | 'error' | 'success';

export interface LogEntry {
  timestamp: number;
  level: LogLevel;
  source: string;
  message: string;
  data?: any;
}

const logs: LogEntry[] = [];
const MAX_LOGS = 100;

export const logInfo = (source: string, message: string, data?: any) => {
  addLog('info', source, message, data);
  console.log(`[${source}] ${message}`, data || '');
};

export const logWarning = (source: string, message: string, data?: any) => {
  addLog('warning', source, message, data);
  console.warn(`[${source}] ${message}`, data || '');
};

export const logError = (source: string, message: string, data?: any) => {
  addLog('error', source, message, data);
  console.error(`[${source}] ${message}`, data || '');
};

export const logSuccess = (source: string, message: string, data?: any) => {
  addLog('success', source, message, data);
  console.log(`[${source}] ✓ ${message}`, data || '');
};

const addLog = (level: LogLevel, source: string, message: string, data?: any) => {
  const entry: LogEntry = {
    timestamp: Date.now(),
    level,
    source,
    message,
    data
  };
  
  logs.unshift(entry);
  
  if (logs.length > MAX_LOGS) {
    logs.splice(MAX_LOGS);
  }
};

export const getLogs = (level?: LogLevel): LogEntry[] => {
  if (level) {
    return logs.filter(log => log.level === level);
  }
  return [...logs];
};

export const clearLogs = () => {
  logs.length = 0;
};
