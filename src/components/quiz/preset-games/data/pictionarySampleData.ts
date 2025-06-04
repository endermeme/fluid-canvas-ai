
/**
 * Sample data for Pictionary game
 * Contains fruit images from Unsplash for a picture guessing game
 */
export const pictionarySampleData = {
  title: "Đoán hình - Hoa quả",
  description: "Đoán tên các loại hoa quả qua hình ảnh thực tế",
  items: [
    {
      imageUrl: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop&crop=center",
      imageSearchTerm: "red apple fruit",
      answer: "Táo",
      hint: "Loại quả biểu tượng cho sức khỏe, màu đỏ",
      options: ["Chuối", "Táo", "Cam", "Lê"]
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop&crop=center",
      imageSearchTerm: "yellow banana fruit",
      answer: "Chuối",
      hint: "Loại quả có vỏ vàng, thường được khỉ thích",
      options: ["Chuối", "Dâu tây", "Nho", "Xoài"]
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=400&h=400&fit=crop&crop=center",
      imageSearchTerm: "orange citrus fruit",
      answer: "Cam",
      hint: "Giàu vitamin C, có múi, màu cam",
      options: ["Cam", "Bưởi", "Quýt", "Chanh"]
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=400&fit=crop&crop=center",
      imageSearchTerm: "strawberry red fruit",
      answer: "Dâu tây",
      hint: "Quả nhỏ, màu đỏ, thường dùng làm bánh",
      options: ["Dâu tây", "Mâm xôi", "Việt quất", "Cherry"]
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1605027990121-cbae9ff08743?w=400&h=400&fit=crop&crop=center",
      imageSearchTerm: "yellow mango fruit",
      answer: "Xoài",
      hint: "Quả ngọt, có hạt lớn, vỏ vàng khi chín",
      options: ["Xoài", "Đu đủ", "Mít", "Dứa"]
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=400&fit=crop&crop=center",
      imageSearchTerm: "watermelon red fruit",
      answer: "Dưa hấu",
      hint: "Quả to, vỏ xanh, ruột đỏ, nhiều nước",
      options: ["Dưa hấu", "Dưa lưới", "Dưa gang", "Bí ngô"]
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400&h=400&fit=crop&crop=center",
      imageSearchTerm: "purple grapes fruit",
      answer: "Nho",
      hint: "Quả nhỏ, mọc thành chùm, có màu tím",
      options: ["Nho", "Mận", "Sung", "Kiwi"]
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&crop=center",
      imageSearchTerm: "pineapple tropical fruit",
      answer: "Dứa",
      hint: "Vỏ xù xì, có mắt, vị chua ngọt",
      options: ["Dứa", "Ổi", "Thanh long", "Khế"]
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&h=400&fit=crop&crop=center",
      imageSearchTerm: "green pear fruit",
      answer: "Lê",
      hint: "Quả có hình dáng thon dài, vị ngọt mát",
      options: ["Lê", "Táo", "Mận", "Đào"]
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&h=400&fit=crop&crop=center",
      imageSearchTerm: "pomegranate red fruit",
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
