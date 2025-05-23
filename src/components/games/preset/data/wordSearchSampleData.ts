
export const wordSearchSampleData = {
  title: "Tìm từ - Các loại hoa",
  description: "Tìm tên các loại hoa được giấu trong bảng chữ cái",
  grid: [
    ["H", "O", "A", "H", "Ồ", "N", "G", "K", "C", "L", "A", "N", "H"],
    ["L", "A", "N", "T", "D", "C", "Ú", "C", "D", "A", "B", "C", "Ư"],
    ["H", "K", "L", "B", "I", "R", "S", "H", "À", "L", "Y", "Ê", "Ớ"],
    ["H", "C", "A", "M", "T", "Ú", "C", "Ú", "L", "I", "A", "E", "N"],
    ["Ò", "A", "Y", "K", "O", "C", "H", "C", "I", "L", "S", "N", "G"],
    ["N", "M", "H", "O", "A", "S", "E", "N", "A", "Y", "O", "H", "T"],
    ["G", "T", "U", "J", "W", "E", "V", "S", "T", "T", "H", "Ủ", "H"],
    ["X", "Ú", "Ệ", "P", "H", "U", "Ợ", "N", "G", "Ư", "Ơ", "Y", "Ợ"],
    ["S", "C", "H", "O", "A", "M", "A", "I", "G", "M", "N", "S", "P"],
    ["T", "H", "I", "Ê", "N", "L", "Ý", "H", "G", "N", "G", "N", "L"],
    ["T", "Ư", "Ơ", "I", "H", "O", "A", "C", "Ú", "C", "T", "R", "O"],
    ["N", "G", "H", "I", "Ê", "N", "H", "O", "A", "H", "Ồ", "N", "G"],
    ["T", "Ư", "Ờ", "N", "G", "V", "I", "G", "H", "U", "I", "O", "K"]
  ],
  words: [
    { word: "HỒNG", found: false },
    { word: "LAN", found: false },
    { word: "CÚC", found: false },
    { word: "ĐÀO", found: false },
    { word: "MAI", found: false },
    { word: "SEN", found: false },
    { word: "HƯỚNG", found: false },
    { word: "CAMTÚCẦU", found: false },
    { word: "HOASEN", found: false },
    { word: "HOACÚC", found: false },
    { word: "THIÊNLÝ", found: false },
    { word: "LYLI", found: false }
  ],
  settings: {
    timeLimit: 300,
    allowDiagonalWords: true,
    showWordList: true
  }
};

// Cấp độ dễ (Grid nhỏ hơn)
export const easyWordSearchData = {
  title: "Tìm từ - Trái cây (Dễ)",
  description: "Tìm tên các loại trái cây được giấu trong bảng chữ cái",
  grid: [
    ["C", "A", "M", "S", "Ấ", "U"],
    ["H", "X", "O", "À", "I", "T"],
    ["U", "Ổ", "I", "D", "Ứ", "A"],
    ["Ố", "M", "T", "C", "H", "O"],
    ["I", "Đ", "À", "O", "B", "L"],
    ["T", "H", "O", "M", "B", "I"]
  ],
  words: [
    { word: "CAM", found: false },
    { word: "XOÀI", found: false },
    { word: "DỨA", found: false },
    { word: "ỔI", found: false },
    { word: "SẦU", found: false },
    { word: "THƠM", found: false },
    { word: "BƠ", found: false }
  ],
  settings: {
    timeLimit: 180,
    allowDiagonalWords: false,
    showWordList: true
  }
};

// Cấp độ khó (Grid lớn hơn)
export const hardWordSearchData = {
  title: "Tìm từ - Động vật (Khó)",
  description: "Tìm tên các loại động vật được giấu trong bảng chữ cái",
  grid: [
    ["V", "O", "I", "T", "H", "Ỏ", "H", "M", "È", "O", "P", "L", "S", "R", "T"],
    ["C", "H", "Ó", "S", "Ó", "I", "I", "K", "H", "Ỉ", "N", "H", "Y", "S", "K"],
    ["G", "À", "C", "Y", "G", "V", "H", "U", "O", "U", "T", "Ư", "H", "U", "A"],
    ["H", "B", "K", "V", "R", "Ọ", "P", "K", "N", "S", "R", "Ơ", "C", "T", "X"],
    ["I", "Ấ", "U", "N", "K", "I", "P", "H", "G", "Ư", "Ỡ", "N", "G", "J", "I"],
    ["G", "U", "G", "A", "Y", "L", "Ợ", "N", "B", "T", "N", "G", "Ò", "M", "Y"],
    ["M", "T", "I", "G", "Ư", "U", "A", "G", "H", "Y", "J", "H", "P", "Ư", "O"],
    ["È", "Ọ", "K", "R", "U", "N", "A", "C", "H", "I", "M", "B", "O", "C", "Y"],
    ["O", "S", "Ử", "T", "Ử", "K", "I", "H", "O", "Ả", "N", "G", "V", "Ư", "H"],
    ["O", "H", "G", "Ư", "H", "Ơ", "U", "B", "T", "V", "K", "L", "W", "H", "Y"],
    ["V", "H", "J", "O", "G", "K", "Y", "Ợ", "N", "H", "L", "U", "I", "D", "Y"],
    ["C", "Á", "D", "U", "G", "H", "J", "K", "T", "K", "T", "A", "K", "H", "Ổ"],
    ["H", "Y", "Y", "N", "C", "O", "G", "Ậ", "U", "T", "R", "U", "C", "V", "O"],
    ["U", "G", "R", "T", "G", "À", "Y", "Ọ", "Y", "I", "Z", "H", "U", "W", "Y"],
    ["M", "U", "C", "Ọ", "P", "H", "U", "Ơ", "U", "Y", "O", "R", "Ư", "I", "V"]
  ],
  words: [
    { word: "VOI", found: false },
    { word: "CHÓ", found: false },
    { word: "MÈO", found: false },
    { word: "GÀ", found: false },
    { word: "LỢN", found: false },
    { word: "HOẴNG", found: false },
    { word: "CÁ", found: false },
    { word: "CỌPHU", found: false },
    { word: "CHIMSẺ", found: false },
    { word: "KHỈNHỌ", found: false },
    { word: "SƯTỬ", found: false },
    { word: "GẤUTRÚC", found: false },
    { word: "HƯƠU", found: false }
  ],
  settings: {
    timeLimit: 480,
    allowDiagonalWords: true,
    showWordList: true
  }
};
