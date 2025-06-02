
/**
 * Game Quality Validation System
 * Kiểm tra chất lượng game được tạo ra
 */

interface GameQualityMetrics {
  codeQuality: number;
  visualQuality: number;
  gameplayDepth: number;
  antiCheat: number;
  performance: number;
  overall: number;
}

interface QualityCheckResult {
  isValid: boolean;
  metrics: GameQualityMetrics;
  issues: string[];
  suggestions: string[];
}

export const validateGameQuality = (htmlContent: string): QualityCheckResult => {
  const issues: string[] = [];
  const suggestions: string[] = [];
  
  // Kiểm tra code quality
  const codeQuality = checkCodeQuality(htmlContent, issues, suggestions);
  
  // Kiểm tra visual quality
  const visualQuality = checkVisualQuality(htmlContent, issues, suggestions);
  
  // Kiểm tra gameplay depth
  const gameplayDepth = checkGameplayDepth(htmlContent, issues, suggestions);
  
  // Kiểm tra anti-cheat measures
  const antiCheat = checkAntiCheatMeasures(htmlContent, issues, suggestions);
  
  // Kiểm tra performance optimizations
  const performance = checkPerformanceOptimizations(htmlContent, issues, suggestions);
  
  const overall = (codeQuality + visualQuality + gameplayDepth + antiCheat + performance) / 5;
  
  return {
    isValid: overall >= 70 && issues.length < 5,
    metrics: {
      codeQuality,
      visualQuality,
      gameplayDepth,
      antiCheat,
      performance,
      overall
    },
    issues,
    suggestions
  };
};

const checkCodeQuality = (html: string, issues: string[], suggestions: string[]): number => {
  let score = 100;
  
  // Kiểm tra modern JavaScript
  if (!html.includes('const ') && !html.includes('let ')) {
    score -= 20;
    issues.push("Code sử dụng var thay vì const/let");
    suggestions.push("Sử dụng const/let cho variable declarations");
  }
  
  // Kiểm tra arrow functions
  if (!html.includes('=>')) {
    score -= 10;
    suggestions.push("Sử dụng arrow functions cho callbacks");
  }
  
  // Kiểm tra game loop
  if (!html.includes('requestAnimationFrame')) {
    score -= 25;
    issues.push("Không sử dụng requestAnimationFrame cho game loop");
    suggestions.push("Implement proper game loop với requestAnimationFrame");
  }
  
  // Kiểm tra error handling
  if (!html.includes('try') && !html.includes('catch')) {
    score -= 15;
    suggestions.push("Thêm error handling cho robustness");
  }
  
  // Kiểm tra code organization
  if (!html.includes('class ') && !html.includes('function ')) {
    score -= 20;
    issues.push("Code thiếu organization (classes/functions)");
  }
  
  return Math.max(0, score);
};

const checkVisualQuality = (html: string, issues: string[], suggestions: string[]): number => {
  let score = 100;
  
  // Kiểm tra CSS animations
  if (!html.includes('transition') && !html.includes('animation')) {
    score -= 25;
    issues.push("Thiếu animations và transitions");
    suggestions.push("Thêm CSS animations cho better UX");
  }
  
  // Kiểm tra modern CSS
  if (!html.includes('flex') && !html.includes('grid')) {
    score -= 20;
    issues.push("Không sử dụng modern CSS layout");
    suggestions.push("Sử dụng Flexbox/Grid cho layout");
  }
  
  // Kiểm tra visual effects
  if (!html.includes('box-shadow') && !html.includes('gradient')) {
    score -= 15;
    suggestions.push("Thêm visual effects (shadows, gradients)");
  }
  
  // Kiểm tra responsive design
  if (!html.includes('viewport') || !html.includes('@media')) {
    score -= 20;
    issues.push("Thiếu responsive design");
    suggestions.push("Implement responsive design cho mobile");
  }
  
  // Kiểm tra color scheme
  const colorCount = (html.match(/#[0-9a-fA-F]{6}/g) || []).length;
  if (colorCount < 3) {
    score -= 10;
    suggestions.push("Sử dụng color palette phong phú hơn");
  }
  
  return Math.max(0, score);
};

const checkGameplayDepth = (html: string, issues: string[], suggestions: string[]): number => {
  let score = 100;
  
  // Kiểm tra game states
  const hasGameStates = html.includes('PLAYING') || html.includes('GAME_OVER') || html.includes('PAUSED');
  if (!hasGameStates) {
    score -= 30;
    issues.push("Game thiếu state management");
    suggestions.push("Implement proper game states");
  }
  
  // Kiểm tra scoring system
  if (!html.includes('score') && !html.includes('point')) {
    score -= 20;
    issues.push("Thiếu scoring system");
    suggestions.push("Thêm scoring system cho motivation");
  }
  
  // Kiểm tra difficulty progression
  if (!html.includes('level') && !html.includes('difficulty')) {
    score -= 15;
    suggestions.push("Thêm difficulty progression");
  }
  
  // Kiểm tra user input handling
  const hasInputHandling = html.includes('addEventListener') || html.includes('onclick');
  if (!hasInputHandling) {
    score -= 25;
    issues.push("Thiếu user input handling");
  }
  
  // Kiểm tra game mechanics variety
  const mechanicsCount = [
    html.includes('collision'),
    html.includes('timer'),
    html.includes('spawn'),
    html.includes('powerup'),
    html.includes('combo')
  ].filter(Boolean).length;
  
  if (mechanicsCount < 2) {
    score -= 20;
    suggestions.push("Thêm game mechanics đa dạng hơn");
  }
  
  return Math.max(0, score);
};

const checkAntiCheatMeasures = (html: string, issues: string[], suggestions: string[]): number => {
  let score = 100;
  
  // Kiểm tra input validation
  if (!html.includes('Math.random') && !html.includes('validation')) {
    score -= 25;
    suggestions.push("Thêm input validation và randomization");
  }
  
  // Kiểm tra obfuscation
  if (html.includes('score') && !html.includes('Math.floor')) {
    score -= 15;
    suggestions.push("Obfuscate critical game variables");
  }
  
  // Kiểm tra time-based validation
  if (!html.includes('Date.now') && !html.includes('timestamp')) {
    score -= 20;
    suggestions.push("Implement time-based validation");
  }
  
  // Kiểm tra rate limiting
  if (!html.includes('cooldown') && !html.includes('lastAction')) {
    score -= 15;
    suggestions.push("Thêm rate limiting cho user actions");
  }
  
  return Math.max(0, score);
};

const checkPerformanceOptimizations = (html: string, issues: string[], suggestions: string[]): number => {
  let score = 100;
  
  // Kiểm tra efficient DOM manipulation
  if (html.includes('innerHTML') && !html.includes('textContent')) {
    score -= 15;
    suggestions.push("Sử dụng textContent thay vì innerHTML khi có thể");
  }
  
  // Kiểm tra memory management
  if (!html.includes('removeEventListener') && html.includes('addEventListener')) {
    score -= 20;
    issues.push("Thiếu cleanup cho event listeners");
    suggestions.push("Cleanup event listeners để tránh memory leaks");
  }
  
  // Kiểm tra efficient animations
  if (html.includes('setInterval') && !html.includes('requestAnimationFrame')) {
    score -= 25;
    issues.push("Sử dụng setInterval thay vì requestAnimationFrame");
  }
  
  // Kiểm tra object pooling hints
  if (html.includes('new ') && !html.includes('pool')) {
    score -= 10;
    suggestions.push("Consider object pooling cho frequent objects");
  }
  
  return Math.max(0, score);
};

export const generateQualityReport = (result: QualityCheckResult): string => {
  const { metrics, issues, suggestions } = result;
  
  let report = `🎮 GAME QUALITY REPORT\n\n`;
  report += `📊 Overall Score: ${metrics.overall.toFixed(1)}/100\n\n`;
  
  report += `📋 Detailed Metrics:\n`;
  report += `• Code Quality: ${metrics.codeQuality}/100\n`;
  report += `• Visual Quality: ${metrics.visualQuality}/100\n`;
  report += `• Gameplay Depth: ${metrics.gameplayDepth}/100\n`;
  report += `• Anti-Cheat: ${metrics.antiCheat}/100\n`;
  report += `• Performance: ${metrics.performance}/100\n\n`;
  
  if (issues.length > 0) {
    report += `⚠️ Critical Issues:\n`;
    issues.forEach(issue => report += `• ${issue}\n`);
    report += `\n`;
  }
  
  if (suggestions.length > 0) {
    report += `💡 Suggestions:\n`;
    suggestions.forEach(suggestion => report += `• ${suggestion}\n`);
  }
  
  return report;
};
