
import { generateUnsplashImage } from "../../generator/imageInstructions";

export const pictionarySampleData = {
  title: "Đoán hình - Hoa quả",
  description: "Đoán tên các loại hoa quả qua hình ảnh",
  items: [
    {
      imageUrl: generateUnsplashImage("red apple fruit", 800, 600),
      answer: "Táo",
      hint: "Loại quả biểu tượng cho sức khỏe",
      options: ["Chuối", "Táo", "Cam", "Lê"]
    },
    {
      imageUrl: generateUnsplashImage("banana fruit bunch", 800, 600),
      answer: "Chuối",
      hint: "Loại quả có vỏ vàng, thường được khỉ thích",
      options: ["Chuối", "Dâu tây", "Nho", "Xoài"]
    },
    {
      imageUrl: generateUnsplashImage("orange fruit", 800, 600),
      answer: "Cam",
      hint: "Giàu vitamin C, có múi",
      options: ["Cam", "Bưởi", "Quýt", "Chanh"]
    },
    {
      imageUrl: generateUnsplashImage("strawberry fruit", 800, 600),
      answer: "Dâu tây",
      hint: "Quả nhỏ, màu đỏ, thường dùng làm bánh",
      options: ["Dâu tây", "Mâm xôi", "Việt quất", "Cherry"]
    },
    {
      imageUrl: generateUnsplashImage("mango fruit", 800, 600),
      answer: "Xoài",
      hint: "Quả ngọt, có hạt lớn, vỏ vàng khi chín",
      options: ["Xoài", "Đu đủ", "Mít", "Dứa"]
    },
    {
      imageUrl: generateUnsplashImage("watermelon fruit", 800, 600),
      answer: "Dưa hấu",
      hint: "Quả to, vỏ xanh, ruột đỏ, nhiều nước",
      options: ["Dưa hấu", "Dưa lưới", "Dưa gang", "Bí ngô"]
    },
    {
      imageUrl: generateUnsplashImage("grape fruit bunch", 800, 600),
      answer: "Nho",
      hint: "Quả nhỏ, mọc thành chùm",
      options: ["Nho", "Mận", "Sung", "Kiwi"]
    },
    {
      imageUrl: generateUnsplashImage("pineapple fruit", 800, 600),
      answer: "Dứa",
      hint: "Vỏ xù xì, có mắt, vị chua ngọt",
      options: ["Dứa", "Ổi", "Thanh long", "Khế"]
    },
    {
      imageUrl: generateUnsplashImage("pear fruit", 800, 600),
      answer: "Lê",
      hint: "Quả có hình dáng thon dài, vị ngọt mát",
      options: ["Lê", "Táo", "Mận", "Đào"]
    },
    {
      imageUrl: generateUnsplashImage("pomegranate fruit", 800, 600),
      answer: "Lựu",
      hint: "Quả có nhiều hạt đỏ mọng bên trong",
      options: ["Lựu", "Chanh dây", "Bơ", "Sầu riêng"]
    }
  ],
  settings: {
    timePerQuestion: 20,
    showHints: true,
    shuffleQuestions: true
  }
};
