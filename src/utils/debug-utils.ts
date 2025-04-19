
interface DebugOptions {
  showOriginal?: boolean;
}

export const debugLog = (
  fileName: string, 
  content: { original: string; parsed: string },
  options: DebugOptions = {}
) => {
  if (!window.__GPT_DEBUG__) return;

  console.group(`📁 ${fileName}`);
  
  if (options.showOriginal) {
    console.log('Original markdown:');
    console.log(content.original);
  }

  console.log('Processed content:');
  console.log(content.parsed);
  
  console.groupEnd();
};

declare global {
  interface Window {
    __GPT_DEBUG__: boolean;
  }
}
