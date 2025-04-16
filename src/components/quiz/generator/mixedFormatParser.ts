
/**
 * Parses code in the format where HTML, CSS, and JS are mixed together
 * with CSS and JS denoted by keywords
 */
export const parseMixedFormatCode = (content: string): { 
  html: string, 
  css: string, 
  js: string 
} => {
  // Look for CSS and JS markers
  const cssMarker = content.indexOf('css ');
  const jsMarker = content.indexOf('js ');
  
  let html = '';
  let css = '';
  let js = '';
  
  // Extract content based on markers
  if (cssMarker > -1 && jsMarker > -1) {
    // HTML is everything before CSS marker
    html = content.substring(0, cssMarker).trim();
    
    // CSS is between CSS marker and JS marker
    css = content.substring(cssMarker + 4, jsMarker).trim();
    
    // JS is everything after JS marker
    js = content.substring(jsMarker + 3).trim();
  } else if (cssMarker > -1) {
    // Only CSS marker exists
    html = content.substring(0, cssMarker).trim();
    css = content.substring(cssMarker + 4).trim();
  } else if (jsMarker > -1) {
    // Only JS marker exists
    html = content.substring(0, jsMarker).trim();
    js = content.substring(jsMarker + 3).trim();
  } else {
    // No markers, treat everything as HTML
    html = content.trim();
  }
  
  return { html, css, js };
};

/**
 * Combines separate HTML, CSS, and JS into a complete HTML document
 */
export const combineHtmlCssJs = (html: string, css: string, js: string): string => {
  // Create a basic HTML document structure if only content is provided
  if (!html.includes('<!DOCTYPE') && !html.includes('<html')) {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Interactive Game</title>
  <style>
${css}
  </style>
</head>
<body>
  <div class="container">
    ${html}
    
    <div class="game-area">
      <canvas id="wheelCanvas" width="400" height="400"></canvas>
      <div>
        <button id="spinButton">Spin the Wheel</button>
      </div>
      <div id="resultText">Click Spin to start!</div>
    </div>
  </div>

  <script>
${js}
  </script>
</body>
</html>`;
  }
  
  // If complete HTML is provided, inject CSS and JS
  let result = html;
  
  // Add style tag if not already present
  if (css && !result.includes('<style>')) {
    const headEnd = result.indexOf('</head>');
    if (headEnd !== -1) {
      result = result.slice(0, headEnd) + `<style>${css}</style>` + result.slice(headEnd);
    } else {
      // No head tag, add one
      const htmlStart = result.indexOf('<html>');
      if (htmlStart !== -1) {
        result = result.slice(0, htmlStart + 6) + 
                 '<head><style>${css}</style></head>' + 
                 result.slice(htmlStart + 6);
      }
    }
  }
  
  // Add script tag if not already present
  if (js && !result.includes('<script>')) {
    const bodyEnd = result.indexOf('</body>');
    if (bodyEnd !== -1) {
      result = result.slice(0, bodyEnd) + `<script>${js}</script>` + result.slice(bodyEnd);
    } else {
      // No body tag, add before end of HTML
      const htmlEnd = result.indexOf('</html>');
      if (htmlEnd !== -1) {
        result = result.slice(0, htmlEnd) + `<script>${js}</script>` + result.slice(htmlEnd);
      } else {
        // No HTML end tag, add at the end
        result += `<script>${js}</script>`;
      }
    }
  }
  
  return result;
};
