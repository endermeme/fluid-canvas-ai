
export interface GamePromptOptions {
  topic: string;
  useCanvas?: boolean;
  language?: string;
  difficulty?: string;
  category?: string;
}

export const generateCustomGamePrompt = (options: GamePromptOptions): string => {
  const { 
    topic, 
    language = 'en',
    difficulty = 'medium',
    category = 'general'
  } = options;

  const basePrompt = `
Create a simple, ready-to-play HTML game about: "${topic}"

**IMPORTANT GAME REQUIREMENTS:**
- Game must be playable immediately without complex setup
- Full support for both touch screens and mouse interactions
- Must work flawlessly on both mobile and desktop devices (cross-device compatibility)
- Keep the UI clean, intuitive and visually appealing
- Focus on core gameplay mechanics only
- Language: ${language === 'vi' ? 'Vietnamese' : 'English'}
- Difficulty: ${difficulty}
- Category: ${category}

**CROSS-DEVICE COMPATIBILITY:**
1. Touch screen support (CRITICAL):
   - All interactive elements MUST work with touch events (touchstart, touchmove, touchend)
   - Include proper touch event handling for all interactive elements
   - Support multi-touch where appropriate for gameplay
   - Use proper touch target sizes (minimum 44px square)
   - Add visual touch feedback (clear visual response to interactions)
   - Prevent unwanted zooming and scrolling during gameplay

2. Mouse support:
   - All interactions must also work perfectly with mouse events
   - Support hover states where appropriate
   - Maintain consistent behavior across devices

**RESPONSIVE DESIGN:**
- Use viewport-relative units (vw, vh) for sizing
- Implement fluid layouts that adapt to both portrait and mobile orientations
- Auto-detect device capabilities and adjust UI accordingly
- Test layouts for both small mobile screens and large desktop displays

**CODE REQUIREMENTS:**
- Return complete HTML file with all CSS/JS included
- NO EXTERNAL DEPENDENCIES or CDN links
- Start with \`\`\`html
- Format code properly with indentation
- End with \`\`\`
- NO COMMENTS in the code

**GAME STRUCTURE:**
1. Clear game title and simple instructions
2. Immediate start button (touch-friendly size)
3. Core gameplay area with touch/mouse support
4. Basic score/progress display
5. Quick restart option
6. Device-appropriate controls
7. Responsive layout for all screen sizes

Focus on making the game instantly playable, fun, and fully functional on ANY device!
`;

  return basePrompt;
};
