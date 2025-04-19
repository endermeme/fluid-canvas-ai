
/**
 * JavaScript processing utilities for iframe content
 */

/**
 * Fix inline comments and code that might be "eaten" by comments
 */
export const fixInlineComments = (html: string): string => {
  if (!html || typeof html !== 'string') return html;
  
  try {
    return html.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, (match, scriptContent) => {
      let fixedScript = scriptContent.replace(/(\/\/[^\n]*)(let|const|var|function)/g, '$1\n$2');
      fixedScript = fixedScript.replace(/(\/\/[^\n]*[\w\d]+)\s*=\s*/g, '$1\n$2 = ');
      fixedScript = fixedScript.replace(/function\s+easeOut\s*\(\$2\)\s*{/, 'function easeOut(t, b, c, d) {');
      
      return match.replace(scriptContent, fixedScript);
    });
  } catch (error) {
    console.error('Error fixing inline comments:', error);
    return html;
  }
};

/**
 * Fix common JavaScript errors in generated code
 */
export const fixJavaScriptErrors = (html: string): string => {
  if (!html || typeof html !== 'string') return html;
  
  try {
    return html.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, (match, scriptContent) => {
      console.log('🔍 Đang sửa JavaScript...');
      
      let fixedScript = scriptContent;
      
      // Fix function parameters
      fixedScript = fixedScript.replace(
        /function\s+(\w+)\s*\(\$2\)/g, 
        (match, funcName) => {
          console.log(`  🛠️ Sửa hàm ${funcName} có tham số $2`);
          
          if (funcName === 'drawSegment') return 'function drawSegment(index)';
          if (funcName === 'getWinningSegment') return 'function getWinningSegment(finalAngle)';
          if (funcName === 'drawWheel' || funcName === 'spinWheel') return `function ${funcName}()`;
          
          return `function ${funcName}()`;
        }
      );
      
      // Fix template literals
      fixedScript = fixedScript.replace(
        /(\w+\.style\.transform\s*=\s*)rotate\(\$\{([^}]+)\}([^)]*)\);/g,
        (match, prefix, content, suffix) => {
          return `${prefix}\`rotate(\${${content}}${suffix})\`;`;
        }
      );
      
      // Fix template literals in textContent
      fixedScript = fixedScript.replace(
        /(\w+\.textContent\s*=\s*)([^;`"']*)(\$\{)([^}]+)(\})([^;]*);/g,
        (match, prefix, before, interpStart, content, interpEnd, after) => {
          if (!before.includes('`') && !after.includes('`')) {
            return `${prefix}\`${before}${interpStart}${content}${interpEnd}${after}\`;`;
          }
          return match;
        }
      );
      
      // Fix setTimeout calls
      fixedScript = fixedScript.replace(
        /setTimeout\s*\(\s*([^,)]+)\s*\)\s*;/g,
        'setTimeout($1, 0);'
      );
      
      // Add canvas context check
      if (fixedScript.includes('canvas.getContext') && 
          !fixedScript.includes('if (!ctx)') &&
          fixedScript.includes('ctx.')) {
        fixedScript = fixedScript.replace(
          /const\s+ctx\s*=\s*canvas\.getContext\(['"]2d['"]\);/,
          `const ctx = canvas.getContext('2d');\n  if (!ctx) { console.error('Không thể lấy 2d context từ canvas'); return; }`
        );
      }
      
      return match.replace(scriptContent, fixedScript);
    });
  } catch (error) {
    console.error('Error fixing JavaScript errors:', error);
    return html;
  }
};
