
/**
 * Generates instructions for handling images in games
 * @returns string with simplified image handling instructions
 */
export const getImageInstructions = (): string => {
  return `
## 🖼️ Image Handling
- Use images from reliable sources: Wikipedia, Pixabay, or Google Images cache
- Example URLs:
  - Wikipedia: https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_processing_1.png/300px-Image_processing_1.png
  - Pixabay: https://pixabay.com/get/[image_id].jpg
  - Google Images: https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS[...]
  - Placeholder: https://via.placeholder.com/300x200.png?text=Example
- Always include alt text for accessibility
- Add error handling for images:
  \`<img src="URL" alt="Description" onerror="this.onerror=null; this.src='BACKUP_URL'; this.alt='Image failed to load';">\`
- Use SVG or Unicode/ASCII art as a backup when images fail to load
`;
};
