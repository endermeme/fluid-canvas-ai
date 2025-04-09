
import { generateUnsplashImage } from "../../generator/imageInstructions";

export const pictionarySampleData = {
  title: "Đoán hình - Danh lam thắng cảnh Việt Nam",
  description: "Đoán tên các danh lam thắng cảnh của Việt Nam qua hình ảnh",
  items: [
    {
      imageUrl: generateUnsplashImage("ha long bay vietnam", 800, 600),
      answer: "Vịnh Hạ Long",
      hint: "Di sản thiên nhiên thế giới ở Quảng Ninh",
      options: ["Vịnh Hạ Long", "Phong Nha Kẻ Bàng", "Tràng An", "Phú Quốc"]
    },
    {
      imageUrl: generateUnsplashImage("hue imperial city vietnam", 800, 600),
      answer: "Kinh thành Huế",
      hint: "Cố đô của Việt Nam thời nhà Nguyễn",
      options: ["Kinh thành Huế", "Hội An", "Lăng Bác", "Thăng Long"]
    },
    {
      imageUrl: generateUnsplashImage("one pillar pagoda hanoi", 800, 600),
      answer: "Chùa Một Cột",
      hint: "Công trình kiến trúc độc đáo ở Hà Nội",
      options: ["Chùa Một Cột", "Chùa Thiên Mụ", "Chùa Bái Đính", "Chùa Hương"]
    },
    {
      imageUrl: generateUnsplashImage("hoi an ancient town vietnam", 800, 600),
      answer: "Phố cổ Hội An",
      hint: "Di sản văn hóa thế giới ở Quảng Nam",
      options: ["Phố cổ Hội An", "Phố cổ Hà Nội", "Đà Lạt", "Nha Trang"]
    },
    {
      imageUrl: generateUnsplashImage("son doong cave vietnam", 800, 600),
      answer: "Hang Sơn Đoòng",
      hint: "Hang động lớn nhất thế giới ở Quảng Bình",
      options: ["Hang Sơn Đoòng", "Động Phong Nha", "Động Thiên Đường", "Động Hương Tích"]
    }
  ],
  settings: {
    timePerQuestion: 20,
    showHints: true,
    shuffleQuestions: true
  }
};
