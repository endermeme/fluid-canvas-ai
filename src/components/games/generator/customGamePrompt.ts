
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
- Support both touch screens and mouse interactions
- Must work on both mobile and desktop devices
- Keep the UI clean and intuitive
- Focus on core gameplay mechanics only
- Language: ${language === 'vi' ? 'Vietnamese' : 'English'}
- Difficulty: ${difficulty}
- Category: ${category}

**DEVICE COMPATIBILITY:**
1. Touch screen support:
   - All interactions must work with touch events (touchstart, touchmove, touchend)
   - Include proper touch event handling
   - Support multi-touch where appropriate
   - Use proper touch target sizes (min 44px)
   - Add touch feedback (visual response to interactions)

2. Mouse support:
   - All interactions must also work with mouse events
   - Support hover states where appropriate
   - Maintain consistent behavior across devices

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

Focus on making the game instantly playable and fun on any device!
`;

  return basePrompt;
};
