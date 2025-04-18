
/**
 * Function to create a custom game prompt
 */
export function buildCustomGamePrompt(topic: string, useCanvas: boolean = true): string {
  return `Create an interactive educational game about "${topic}" 
${useCanvas ? 'that uses HTML Canvas for interactive graphics' : 'using simple HTML, CSS and JavaScript'}. 
The game should be educational, engaging, and suitable for students.`;
}
