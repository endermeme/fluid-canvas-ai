
export interface GamePromptOptions {
  topic: string;
  useCanvas?: boolean;
  language?: string;
}

export const generateCustomGamePrompt = (options: GamePromptOptions): string => {
  const { 
    topic, 
    useCanvas = true, 
    language = 'en'
  } = options;

  const basePrompt = `
Create an interactive HTML game based on: "${topic}"

**IMPORTANT: Return code in markdown format with \`\`\`html blocks**

**STRICT REQUIREMENTS:**
- NO COMMENT CODE , NO COMMENT , NO BLACKSPLASHEEEEEEEEE
- Start your response with a \`\`\`html block
- Format code with proper line breaks and indentation
- End your response with \`\`\` closing block
- Use modern JavaScript (ES6+), no external libraries
- Clean, readable, maintainable code with descriptive names
- Strictly modular structure: init, update, render, game loop
- Use semantic HTML5, responsive layout
- No global variables unless absolutely needed
- Implement proper event handling, game state management
- Use localStorage if persistence is needed
${useCanvas ? '- Use HTML5 Canvas for rendering' : ''}
- Efficient rendering, proper sizing, smooth animations

**Game content must match:**
- Language: \`${language === 'vi' ? 'Vietnamese' : 'English'}\`
`;

  return basePrompt;
};
