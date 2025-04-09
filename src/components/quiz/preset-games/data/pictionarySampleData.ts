
/**
 * Sample data for Pictionary game
 * Contains fruit images for a simple picture guessing game
 */
export const pictionarySampleData = {
  title: "Đoán hình - Hoa quả",
  description: "Đoán tên các loại hoa quả qua hình ảnh",
  items: [
    {
      imageUrl: "https://cdn.pixabay.com/photo/2017/09/26/13/21/apple-2788599_640.jpg",
      answer: "Táo",
      hint: "Loại quả biểu tượng cho sức khỏe",
      options: ["Chuối", "Táo", "Cam", "Lê"]
    },
    {
      imageUrl: "https://cdn.pixabay.com/photo/2019/02/10/14/15/banana-3987447_640.jpg",
      answer: "Chuối",
      hint: "Loại quả có vỏ vàng, thường được khỉ thích",
      options: ["Chuối", "Dâu tây", "Nho", "Xoài"]
    },
    {
      imageUrl: "https://cdn.pixabay.com/photo/2017/01/20/15/12/orange-1995079_640.jpg",
      answer: "Cam",
      hint: "Giàu vitamin C, có múi",
      options: ["Cam", "Bưởi", "Quýt", "Chanh"]
    },
    {
      imageUrl: "https://cdn.pixabay.com/photo/2018/04/29/11/54/strawberries-3359755_640.jpg",
      answer: "Dâu tây",
      hint: "Quả nhỏ, màu đỏ, thường dùng làm bánh",
      options: ["Dâu tây", "Mâm xôi", "Việt quất", "Cherry"]
    },
    {
      imageUrl: "https://cdn.pixabay.com/photo/2018/04/25/13/18/mango-3349256_640.jpg",
      answer: "Xoài",
      hint: "Quả ngọt, có hạt lớn, vỏ vàng khi chín",
      options: ["Xoài", "Đu đủ", "Mít", "Dứa"]
    },
    {
      imageUrl: "https://cdn.pixabay.com/photo/2015/07/08/10/32/watermelon-835991_640.jpg",
      answer: "Dưa hấu",
      hint: "Quả to, vỏ xanh, ruột đỏ, nhiều nước",
      options: ["Dưa hấu", "Dưa lưới", "Dưa gang", "Bí ngô"]
    },
    {
      imageUrl: "https://cdn.pixabay.com/photo/2020/05/17/21/54/grapes-5183776_640.jpg",
      answer: "Nho",
      hint: "Quả nhỏ, mọc thành chùm",
      options: ["Nho", "Mận", "Sung", "Kiwi"]
    },
    {
      imageUrl: "https://cdn.pixabay.com/photo/2015/02/14/18/15/pineapple-636562_640.jpg",
      answer: "Dứa",
      hint: "Vỏ xù xì, có mắt, vị chua ngọt",
      options: ["Dứa", "Ổi", "Thanh long", "Khế"]
    },
    {
      imageUrl: "https://cdn.pixabay.com/photo/2016/07/22/09/59/fruits-1534494_640.jpg",
      answer: "Lê",
      hint: "Quả có hình dáng thon dài, vị ngọt mát",
      options: ["Lê", "Táo", "Mận", "Đào"]
    },
    {
      imageUrl: "https://cdn.pixabay.com/photo/2014/07/23/11/51/pomegranate-400976_640.jpg",
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
