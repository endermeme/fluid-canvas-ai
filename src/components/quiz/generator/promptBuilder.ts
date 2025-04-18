import { GamePromptOptions, generateCustomGamePrompt } from './customGamePrompt';

export const buildGeminiPrompt = (
  topic: string,
  useCanvas: boolean = true
): string => {
  const options: GamePromptOptions = {
    topic,
    useCanvas
  };

  const formattingInstructions = `
Please format your response using markdown code blocks with proper indentation and line breaks:

1. Use three backticks with language specification:
\`\`\`html
<!-- Your properly indented HTML here -->
\`\`\`

\`\`\`css
/* Your properly indented CSS here */
\`\`\`

\`\`\`js
// Your properly indented JavaScript here
\`\`\`

2. Formatting Requirements:
   - Each HTML tag on a new line with proper nesting indentation
   - CSS rules properly spaced with properties on new lines
   - JavaScript with clear function and block indentation
   - Use 2 spaces for indentation
   - Add line breaks between logical sections
   - Include proper comments for code sections
   - No minified or single-line code

Example Format:
\`\`\`html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Game Title</title>
  </head>
  <body>
    <div class="container">
      <h1>Game Title</h1>
    </div>
  </body>
</html>
\`\`\`
`;

  return generateCustomGamePrompt(options) + formattingInstructions;
};

export const getCanvasInstructions = (): string => {
  return `
    Canvas Game Development Guidelines:
    1. Efficient game loop implementation
    2. Dynamic canvas resizing
    3. Precise collision detection
    4. Optimized sprite animations
    5. State management techniques
    6. Performance-focused rendering
  `;
};
