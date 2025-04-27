
export const getBaseStyles = (): string => `
  body { 
    margin: 0; 
    padding: 0; 
    display: flex; 
    justify-content: center; 
    align-items: center; 
    min-height: 100vh; 
    font-family: Arial, sans-serif; 
  }
`;

export const injectStyles = (doc: Document, additionalStyles?: string): void => {
  const styleElement = doc.createElement('style');
  styleElement.textContent = `
    ${getBaseStyles()}
    ${additionalStyles || ''}
  `;
  doc.head.appendChild(styleElement);
};
