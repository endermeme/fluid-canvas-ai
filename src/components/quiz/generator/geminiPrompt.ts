
import gamePromptsData from './gamePrompts.json';

export const createGameGenerationPrompt = (options: {
  topic: string;
}): string => {
  const { topic } = options;
  const promptData = gamePromptsData.customGamePrompt;
  
  // Tạo prompt từ JSON data
  const designPrinciplesText = promptData.designPrinciples
    .map(principle => `- ${principle}`)
    .join('\n');
  
  const prompt = `${promptData.base.replace('{topic}', topic)}

NGUYÊN TẮC THIẾT KẾ:
${designPrinciplesText}

${promptData.instruction}
`;

  return prompt;
};

export default createGameGenerationPrompt;
