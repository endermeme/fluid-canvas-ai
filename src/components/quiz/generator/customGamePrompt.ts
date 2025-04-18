
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
Create an interactive HTML game based on: "${topic}"

**IMPORTANT: Return code in markdown format with \`\`\`html blocks**
- NO COMMENT CODE , NO COMMENT , NO BLACKSPLASHEEEEEEEEE
- Start your response with a \`\`\`html block
- Format code with proper line breaks and indentation
- End your response with \`\`\` closing block

**Game content must match:**
- Difficulty level: \`${difficulty}\`
- Category: \`${category}\`
- Language: \`${language === 'vi' ? 'Vietnamese' : 'English'}\`
`;

  return basePrompt;
};
