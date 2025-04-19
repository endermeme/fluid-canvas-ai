
interface DebugOptions {
  showFileNames?: boolean;
  showParseSteps?: boolean;
  showOriginal?: boolean;
}

export const debugLog = (
  fileName: string, 
  content: any, 
  options: DebugOptions = {}
) => {
  const { 
    showFileNames = true, 
    showParseSteps = true, 
    showOriginal = true 
  } = options;

  if (!window.__GPT_DEBUG__) return;

  const styles = {
    fileName: 'color: #3b82f6; font-weight: bold;',
    original: 'color: #059669;',
    parsed: 'color: #7c3aed;',
    separator: 'color: #6b7280;'
  };

  if (showFileNames) {
    console.group(`%c📁 ${fileName}`, styles.fileName);
  }

  if (showOriginal && content.original) {
    console.log('%c📄 Original Content:', styles.original);
    console.log(content.original);
  }

  if (showParseSteps) {
    console.log('%c🔄 Parse Steps:', styles.parsed);
    console.log(content.parsed || content);
  }

  if (showFileNames) {
    console.groupEnd();
  }

  console.log('%c-------------------', styles.separator);
};

declare global {
  interface Window {
    __GPT_DEBUG__: boolean;
    __SHOW_FILE_NAMES__: boolean;
    __SHOW_PARSE_STEPS__: boolean;
  }
}
