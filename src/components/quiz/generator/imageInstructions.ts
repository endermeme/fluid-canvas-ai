
/**
 * Generates instructions for handling images in games
 * @returns string with detailed image handling instructions
 */
export const getImageInstructions = (): string => {
  return `
    ## Hình ảnh trong trò chơi
    
    Nếu cần hình ảnh, hãy sử dụng một trong các cách sau:
    - URL hình ảnh từ Wikipedia: 'https://upload.wikimedia.org/wikipedia/commons/thumb/[...].jpg'
    - URL hình ảnh từ Pixabay: 'https://pixabay.com/get/[image_id].jpg'
    - URL hình ảnh từ Google Images cache: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS[...]'
    - Placeholder: 'https://via.placeholder.com/[width]x[height].png?text=[text]'
    - SVG trực tiếp trong HTML khi cần đồ họa đơn giản
    
    Luôn thêm thuộc tính onerror cho tất cả thẻ <img> để xử lý lỗi hình ảnh.
  `;
};
