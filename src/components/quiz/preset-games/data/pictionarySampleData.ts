
/**
 * Sample data for Pictionary game
 * Contains real fruit images from public sources
 */
export const pictionarySampleData = {
  title: "Đoán hình - Hoa quả",
  description: "Đoán tên các loại hoa quả qua hình ảnh",
  items: [
    {
      imageUrl: "https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=500",
      imageSearchTerm: "red apple fruit",
      answer: "Táo",
      hint: "Loại quả biểu tượng cho sức khỏe, màu đỏ",
      options: ["Chuối", "Táo", "Cam", "Lê"]
    },
    {
      imageUrl: "https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg?auto=compress&cs=tinysrgb&w=500",
      imageSearchTerm: "yellow banana fruit",
      answer: "Chuối",
      hint: "Loại quả có vỏ vàng, thường được khỉ thích",
      options: ["Chuối", "Dâu tây", "Nho", "Xoài"]
    },
    {
      imageUrl: "https://images.pexels.com/photos/327098/pexels-photo-327098.jpeg?auto=compress&cs=tinysrgb&w=500",
      imageSearchTerm: "orange citrus fruit",
      answer: "Cam",
      hint: "Giàu vitamin C, có múi, màu cam",
      options: ["Cam", "Bưởi", "Quýt", "Chanh"]
    },
    {
      imageUrl: "https://images.pexels.com/photos/89778/strawberry-red-fruit-sweet-89778.jpeg?auto=compress&cs=tinysrgb&w=500",
      imageSearchTerm: "strawberry red fruit",
      answer: "Dâu tây",
      hint: "Quả nhỏ, màu đỏ, thường dùng làm bánh",
      options: ["Dâu tây", "Mâm xôi", "Việt quất", "Cherry"]
    },
    {
      imageUrl: "https://images.pexels.com/photos/918327/pexels-photo-918327.jpeg?auto=compress&cs=tinysrgb&w=500",
      imageSearchTerm: "yellow mango fruit",
      answer: "Xoài",
      hint: "Quả ngọt, có hạt lớn, vỏ vàng khi chín",
      options: ["Xoài", "Đu đủ", "Mít", "Dứa"]
    },
    {
      imageUrl: "https://images.pexels.com/photos/1313267/pexels-photo-1313267.jpeg?auto=compress&cs=tinysrgb&w=500",
      imageSearchTerm: "watermelon red fruit",
      answer: "Dưa hấu",
      hint: "Quả to, vỏ xanh, ruột đỏ, nhiều nước",
      options: ["Dưa hấu", "Dưa lưới", "Dưa gang", "Bí ngô"]
    },
    {
      imageUrl: "https://images.pexels.com/photos/708777/pexels-photo-708777.jpeg?auto=compress&cs=tinysrgb&w=500",
      imageSearchTerm: "purple grapes fruit",
      answer: "Nho",
      hint: "Quả nhỏ, mọc thành chùm, có màu tím",
      options: ["Nho", "Mận", "Sung", "Kiwi"]
    },
    {
      imageUrl: "https://images.pexels.com/photos/947879/pexels-photo-947879.jpeg?auto=compress&cs=tinysrgb&w=500",
      imageSearchTerm: "pineapple tropical fruit",
      answer: "Dứa",
      hint: "Vỏ xù xì, có mắt, vị chua ngọt",
      options: ["Dứa", "Ổi", "Thanh long", "Khế"]
    },
    {
      imageUrl: "https://images.pexels.com/photos/568641/pexels-photo-568641.jpeg?auto=compress&cs=tinysrgb&w=500",
      imageSearchTerm: "green pear fruit",
      answer: "Lê",
      hint: "Quả có hình dáng thon dài, vị ngọt mát",
      options: ["Lê", "Táo", "Mận", "Đào"]
    },
    {
      imageUrl: "https://images.pexels.com/photos/434295/pexels-photo-434295.jpeg?auto=compress&cs=tinysrgb&w=500",
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
