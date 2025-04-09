
/**
 * Simplified image instructions
 * @returns string with basic image handling instructions
 */
export const getImageInstructions = (): string => {
  return `
    ## Hình ảnh
    - Hỗ trợ các loại URL hình ảnh sau: wikipedia, pixabay, placeholder, dummyimage
    - Sử dụng SVG và base64 cho hình ảnh nhỏ khi cần thiết
    - Luôn thêm alt text và onerror cho các thẻ <img>
  `;
};
