
/**
 * Instructions for image handling in games
 * @returns string with detailed image handling instructions
 */
export const getImageInstructions = (): string => {
  return `
    ## Hình ảnh
    - Ưu tiên sử dụng Unsplash API với định dạng: https://source.unsplash.com/random/?[search_term]
    - Thay thế [search_term] bằng từ khóa tìm kiếm liên quan đến nội dung
    - Cũng hỗ trợ các loại URL hình ảnh: wikipedia, pixabay, placeholder
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
 * Tạo URL Unsplash cho hình ảnh
 * @param keyword Từ khóa tìm kiếm
 * @param width Chiều rộng hình ảnh 
 * @param height Chiều cao hình ảnh
 * @returns URL hình ảnh từ Unsplash
 */
export const generateUnsplashImage = (keyword: string, width: number = 800, height: number = 600): string => {
  const encodedKeyword = encodeURIComponent(keyword);
  return `https://source.unsplash.com/random/${width}x${height}/?${encodedKeyword}`;
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
  const topic = img.alt || "image";
  img.src = generatePlaceholderImage(400, 300, `${topic} - Not Found`);
  img.alt = `Failed to load image: ${topic}`;
};

