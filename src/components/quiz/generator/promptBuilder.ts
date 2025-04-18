
export const buildGeminiPrompt = (
  topic: string,
  useCanvas: boolean = true
): string => {
  return `Create a game about ${topic}`;
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
