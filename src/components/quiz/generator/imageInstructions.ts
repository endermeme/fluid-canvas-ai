
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
    - Mô tả chi tiết khi cần hình ảnh
  `;
};

/**
 * Chuyển một đề tài thành mô tả hình ảnh
 * @param topic Chủ đề cần mô tả
 * @returns Mô tả hình ảnh
 */
export const topicToImageDescription = (topic: string): string => {
  return `Một hình ảnh minh họa cho ${topic}`;
};
