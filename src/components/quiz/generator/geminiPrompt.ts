
/**
 * Prompt template nâng cao cho game chất lượng cao
 */

import { PromptOptions } from './types';

export const createGameGenerationPrompt = (options: PromptOptions): string => {
  const { topic, language = 'vi' } = options;
  
  // Prompt chi tiết và chuyên nghiệp
  const prompt = `# NHIỆM VỤ: Tạo game HTML5 chuyên nghiệp về "${topic}"

## YÊU CẦU CHẤT LƯỢNG CAO:

### 🎮 LOGIC GAME CHUYÊN NGHIỆP:
- Code như một senior developer: clean, modular, well-structured
- Implement proper game states: MENU, PLAYING, PAUSED, GAME_OVER, WIN
- Anti-cheat mechanisms: validate moves, prevent console manipulation
- Smart AI logic nếu có bot/enemy
- Collision detection chính xác
- Physics realistic (gravity, momentum, friction)
- Event handling robust, prevent spam clicking
- Score system cannot be easily hacked
- Progress saving và validation

### 🎨 GRAPHICS & UI EXCELLENCE:
- Modern UI design với CSS3 animations
- Gradient backgrounds, shadows, transitions
- Particle effects với Canvas 2D
- Smooth animations (60fps target)
- Responsive design cho mọi màn hình
- Beautiful color palette và typography
- Loading animations và micro-interactions
- Visual feedback cho mọi action
- Progressive difficulty với visual indicators

### 🔧 TECHNICAL REQUIREMENTS:
- Full viewport coverage: 100vw x 100vh, no margins/padding
- Touch-friendly: minimum 44px touch targets
- Performance optimized: requestAnimationFrame
- Memory management: cleanup intervals/listeners
- Error handling và graceful degradation
- Cross-browser compatibility
- Mobile-first responsive design
- Accessibility features (keyboard navigation)

### 🎯 GAME MECHANICS DEPTH:
- Multiple difficulty levels
- Achievement system
- Combo systems và multipliers
- Power-ups và special abilities
- Dynamic obstacles/challenges
- Procedural generation elements
- Sound effects (HTML5 Audio)
- Visual effects và screen shake
- Meaningful player choices

### 🛡️ ANTI-BYPASS MEASURES:
- Obfuscated critical variables
- Server-side style validation (simulate)
- Time-based challenges cannot be skipped
- Multiple validation layers
- Hidden checkpoints
- Randomized game elements
- Input rate limiting
- Prevent inspect element cheating

## OUTPUT FORMAT:
Trả về CHÍNH XÁC file HTML5 hoàn chỉnh với:
- DOCTYPE html declaration
- Meta viewport cho mobile
- Embedded CSS với advanced styling
- JavaScript với modern ES6+ features
- Game loop với requestAnimationFrame
- Proper error handling
- Performance monitoring
- Debug console logs

## STYLE GUIDELINES:
- Use CSS Grid/Flexbox cho layout
- CSS Variables cho theming
- Smooth transitions: transition: all 0.3s ease
- Box shadows: box-shadow: 0 10px 30px rgba(0,0,0,0.3)
- Modern borders: border-radius: 15px
- Typography: system fonts, proper line-height
- Color theory: complementary colors
- Visual hierarchy: size, color, spacing

## JAVASCRIPT BEST PRACTICES:
- Use const/let, avoid var
- Arrow functions cho callbacks
- Template literals cho strings
- Destructuring assignments
- Classes cho game objects
- Modules pattern
- Error boundaries
- Performance profiling

QUAN TRỌNG: Không giải thích, chỉ trả về HTML hoàn chỉnh. Game phải thể hiện skill coding senior level!`;

  return prompt;
};

// Prompt riêng cho chế độ Flash - tập trung vào speed và efficiency
export const createFlashGamePrompt = (options: PromptOptions): string => {
  const { topic, language = 'vi' } = options;
  
  const prompt = `# FLASH MODE: Tạo game "${topic}" - Tốc độ cao, Logic thông minh

## FOCUS AREAS:
1. **Code Efficiency**: Minimal DOM manipulation, efficient algorithms
2. **Smart Logic**: Clever game mechanics, anti-cheat built-in
3. **Visual Impact**: Maximum visual appeal với minimal code
4. **Performance**: 60fps guaranteed, memory optimized

## CORE REQUIREMENTS:
- Single HTML file với embedded CSS/JS
- Game loop tối ưu với requestAnimationFrame
- Smart state management
- Touch + keyboard controls
- Auto-scaling UI cho mọi device
- Beautiful animations với CSS transforms
- Anti-bypass logic embedded
- Professional game feel

## ADVANCED FEATURES:
- Procedural difficulty scaling
- Visual feedback hệ thống
- Particle effects nhẹ
- Sound integration ready
- Achievement tracking
- Combo/streak systems
- Dynamic theming
- Error recovery mechanisms

Trả về HTML hoàn chỉnh, ready-to-play, professional quality!`;

  return prompt;
};

// Prompt cho Super Thinking mode - phân tích sâu
export const createSuperThinkingAnalysisPrompt = (topic: string): string => {
  return `# PHÂN TÍCH GAME DESIGN CHO: "${topic}"

Hãy phân tích chi tiết các khía cạnh sau:

## 1. GAME MECHANICS ANALYSIS:
- Core gameplay loop và player motivation
- Difficulty curve và progression system
- Win/lose conditions và balance
- Player agency và meaningful choices
- Replayability factors

## 2. TECHNICAL ARCHITECTURE:
- Optimal code structure cho performance
- State management strategy
- Event handling patterns
- Animation và rendering approach
- Memory management considerations

## 3. UI/UX DESIGN:
- Visual hierarchy và information architecture
- Color psychology và branding
- Accessibility considerations
- Mobile-first responsive strategy
- User flow optimization

## 4. ANTI-CHEAT STRATEGY:
- Common exploit patterns to prevent
- Validation layers needed
- Obfuscation techniques
- Time-based security measures
- Client-side protection methods

## 5. ENHANCEMENT OPPORTUNITIES:
- Advanced features để differentiate
- Performance optimization points
- User engagement mechanics
- Scalability considerations
- Future feature hooks

Trả về phân tích chi tiết trong 300 từ, tập trung vào implementation specifics.`;
};

export default createGameGenerationPrompt;
