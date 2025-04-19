
/**
 * Module xử lý và sửa lỗi JavaScript
 */

/**
 * Định dạng và sửa lỗi phổ biến trong JavaScript
 */
export const formatJavaScript = (js: string): string => {
  if (!js) return '';
  
  try {
    // Sửa template literals
    let formattedJs = js
      .replace(/(\w+\.style\.transform\s*=\s*)rotate\(\$\{([^}]+)\}([^)]*)\)/g, "$1`rotate(${$2}$3)`")
      .replace(/(\w+\.textContent\s*=\s*)([^;"`']*)\$\{([^}]+)\}([^;"`']*);/g, "$1`$2${$3}$4`;")
      .replace(/\\`/g, '`');

    // Sửa tham số hàm
    formattedJs = formattedJs.replace(
      /function\s+(\w+)\s*\(\$2\)/g,
      (match, funcName) => {
        const paramMap: Record<string, string> = {
          drawSegment: '(index, color, text)',
          spinWheel: '()',
          getWinningSegment: '(finalAngle)',
          drawWheel: '()'
        };
        return `function ${funcName}${paramMap[funcName] || '()'}`;
      }
    );

    return formattedJs;
  } catch (error) {
    console.error('Error formatting JavaScript:', error);
    return js;
  }
};

/**
 * Thêm xử lý lỗi vào code JavaScript
 */
export const addErrorHandling = (js: string): string => {
  return `
try {
  ${js}
} catch (error) {
  console.error('Game error:', error);
}
`;
};

/**
 * Sửa các lỗi phổ biến trong JavaScript
 */
export const fixCommonJsErrors = (js: string): string => {
  if (!js) return '';
  
  let fixed = js;
  
  // Sửa lỗi canvas context
  fixed = fixed.replace(
    /const\s+ctx\s*=\s*canvas\.getContext\(['"]2d['"]\);/g,
    "const ctx = canvas.getContext('2d');\nif (!ctx) { console.error('Failed to get canvas context'); return; }"
  );
  
  // Sửa lỗi getElementById không kiểm tra null
  fixed = fixed.replace(
    /const\s+(\w+)\s*=\s*document\.getElementById\(['"]([^'"]+)['"]\);(?!\s*if\s*\(!\1\))/g,
    "const $1 = document.getElementById('$2');\nif (!$1) { console.error('Element #$2 not found'); return; }"
  );
  
  // Sửa lỗi setTimeout không có thời gian
  fixed = fixed.replace(
    /setTimeout\(\s*([^,)]+)\s*\);/g,
    "setTimeout($1, 0);"
  );
  
  return fixed;
};
