
export const createIframeDocument = (content: string, title?: string): Document => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, 'text/html');
  if (title) {
    doc.title = title;
  }
  return doc;
};

export const validateIframeContent = (content: string): boolean => {
  return content !== null && content !== undefined && content.trim() !== '';
};
