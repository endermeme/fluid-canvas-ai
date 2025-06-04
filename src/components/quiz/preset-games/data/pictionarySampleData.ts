
/**
 * Sample data for Pictionary game
 * Contains diverse fruit images from various sources
 */
export const pictionarySampleData = {
  title: "Đoán hình - Hoa quả",
  description: "Đoán tên các loại hoa quả qua hình ảnh",
  items: [
    {
      imageUrl: "https://cdn.pixabay.com/photo/2016/01/05/13/58/apple-1122537_960_720.jpg",
      imageSearchTerm: "red apple fruit",
      answer: "Táo",
      hint: "Loại quả biểu tượng cho sức khỏe, màu đỏ",
      options: ["Chuối", "Táo", "Cam", "Lê"]
    },
    {
      imageUrl: "https://cdn.pixabay.com/photo/2016/04/15/08/04/banana-1330842_960_720.jpg",
      imageSearchTerm: "yellow banana fruit",
      answer: "Chuối",
      hint: "Loại quả có vỏ vàng, thường được khỉ thích",
      options: ["Chuối", "Dâu tây", "Nho", "Xoài"]
    },
    {
      imageUrl: "https://cdn.pixabay.com/photo/2017/01/20/15/06/orange-1995056_960_720.jpg",
      imageSearchTerm: "orange citrus fruit",
      answer: "Cam",
      hint: "Giàu vitamin C, có múi, màu cam",
      options: ["Cam", "Bưởi", "Quýt", "Chanh"]
    },
    {
      imageUrl: "https://cdn.pixabay.com/photo/2016/04/15/08/04/strawberry-1330459_960_720.jpg",
      imageSearchTerm: "strawberry red fruit",
      answer: "Dâu tây",
      hint: "Quả nhỏ, màu đỏ, thường dùng làm bánh",
      options: ["Dâu tây", "Mâm xôi", "Việt quất", "Cherry"]
    },
    {
      imageUrl: "https://cdn.pixabay.com/photo/2017/06/02/18/24/mango-2367439_960_720.jpg",
      imageSearchTerm: "yellow mango fruit",
      answer: "Xoài",
      hint: "Quả ngọt, có hạt lớn, vỏ vàng khi chín",
      options: ["Xoài", "Đu đủ", "Mít", "Dứa"]
    },
    {
      imageUrl: "https://cdn.pixabay.com/photo/2015/07/17/13/44/watermelon-849552_960_720.jpg",
      imageSearchTerm: "watermelon red fruit",
      answer: "Dưa hấu",
      hint: "Quả to, vỏ xanh, ruột đỏ, nhiều nước",
      options: ["Dưa hấu", "Dưa lưới", "Dưa gang", "Bí ngô"]
    },
    {
      imageUrl: "https://cdn.pixabay.com/photo/2016/09/20/22/35/grapes-1682916_960_720.jpg",
      imageSearchTerm: "purple grapes fruit",
      answer: "Nho",
      hint: "Quả nhỏ, mọc thành chùm, có màu tím",
      options: ["Nho", "Mận", "Sung", "Kiwi"]
    },
    {
      imageUrl: "https://cdn.pixabay.com/photo/2016/08/09/10/30/pineapple-1581650_960_720.jpg",
      imageSearchTerm: "pineapple tropical fruit",
      answer: "Dứa",
      hint: "Vỏ xù xì, có mắt, vị chua ngọt",
      options: ["Dứa", "Ổi", "Thanh long", "Khế"]
    },
    {
      imageUrl: "https://cdn.pixabay.com/photo/2016/07/22/08/39/pear-1534494_960_720.jpg",
      imageSearchTerm: "green pear fruit",
      answer: "Lê",
      hint: "Quả có hình dáng thon dài, vị ngọt mát",
      options: ["Lê", "Táo", "Mận", "Đào"]
    },
    {
      imageUrl: "https://cdn.pixabay.com/photo/2017/10/07/15/50/pomegranate-2825556_960_720.jpg",
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
