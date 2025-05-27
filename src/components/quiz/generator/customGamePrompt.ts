
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
Create a minimalist, full-screen HTML5 game about: "${topic}"

**CRITICAL REQUIREMENTS:**
- FULL SCREEN GAME - NO wasted space, NO excessive text or instructions
- Game area must fill 100% of viewport (100vw x 100vh)
- Minimal UI - only essential elements (score, simple controls)
- NO lengthy instructions or descriptions in the game
- Immediate gameplay - game starts right away
- Language: ${language === 'vi' ? 'Vietnamese' : 'English'}
- Difficulty: ${difficulty}

**RESPONSIVE DESIGN:**
- Use viewport units (100vw, 100vh) for full screen
- Game canvas/area: width: 100vw, height: 100vh
- Remove all margins, padding from body and html
- Position UI elements as overlays, not separate sections

**GAME STRUCTURE:**
1. Full-screen game area (canvas or div)
2. Minimal overlay UI (score in corner)
3. Touch/mouse controls
4. NO instruction screens - controls should be intuitive
5. NO excessive text or descriptions

**CODE FORMAT:**
- Complete HTML with DOCTYPE
- CSS: body { margin: 0; padding: 0; overflow: hidden; width: 100vw; height: 100vh; }
- Game area: { width: 100vw; height: 100vh; position: relative; }
- All JavaScript in single script tag
- NO external dependencies
- Start with \`\`\`html and end with \`\`\`

**TOUCH/MOUSE SUPPORT:**
- Support both touch events and mouse events
- Touch targets minimum 44px
- Responsive controls for all devices

Focus on creating an engaging, full-screen gaming experience with minimal UI clutter!
`;

  return basePrompt;
};
