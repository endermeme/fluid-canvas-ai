
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

/**
 * Tạo URL placeholder cho hình ảnh
 * @param width Chiều rộng hình ảnh
 * @param height Chiều cao hình ảnh
 * @param text Văn bản hiển thị trên hình ảnh
 * @returns URL hình ảnh placeholder
 */
export const generatePlaceholderImage = (width: number = 400, height: number = 300, text: string = "Image"): string => {
  const encodedText = encodeURIComponent(text);
  return `https://via.placeholder.com/${width}x${height}?text=${encodedText}`;
};

/**
 * Xử lý lỗi tải hình ảnh
 * @param event Sự kiện lỗi
 */
export const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>): void => {
  const img = event.currentTarget;
  img.src = "https://via.placeholder.com/400x300?text=Image+Not+Found";
  img.alt = "Failed to load image";
};
