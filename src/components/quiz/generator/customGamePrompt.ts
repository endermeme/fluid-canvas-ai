
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
- Keep the UI clean and intuitive
- Focus on core gameplay mechanics only
- Support both desktop and mobile play
- Language: ${language === 'vi' ? 'Vietnamese' : 'English'}
- Difficulty: ${difficulty}
- Category: ${category}

**IMAGE GUIDELINES:**
- ONLY use images from Wikipedia API
- NEVER include direct image URLs or external resources
- For each image needed, provide a descriptive search term 
- Use English search terms for better results
- Example: "red apple fruit"

**CODE REQUIREMENTS:**
- Return complete HTML file with all CSS/JS included
- NO EXTERNAL DEPENDENCIES or CDN links
- Start with \`\`\`html
- Format code properly with indentation
- End with \`\`\`
- NO COMMENTS in the code

**GAME STRUCTURE:**
1. Clear game title and simple instructions
2. Immediate start button
3. Core gameplay area
4. Basic score/progress display
5. Quick restart option

Focus on making the game instantly playable and fun!
`;

  return basePrompt;
};
