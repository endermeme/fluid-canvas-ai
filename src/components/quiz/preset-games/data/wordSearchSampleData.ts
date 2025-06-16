
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
    { word: "HỒNG", found: false }, // Ngang ở dòng 1 và 12
    { word: "LAN", found: false }, // Ngang ở dòng 2
    { word: "CÚC", found: false }, // Dọc từ (1,6) xuống (3,6)
    { word: "SEN", found: false }, // Ngang ở dòng 6
    { word: "HOA", found: false }, // Ngang ở dòng 1 và 9
    { word: "MAI", found: false }, // Ngang ở dòng 9
    { word: "HƯỚNG", found: false }, // Dọc từ (7,6) xuống (12,6)
    { word: "THIÊN", found: false }, // Ngang ở dòng 10
    { word: "CAM", found: false }, // Ngang ở dòng 4
  ],
  settings: {
    timeLimit: 300,
    allowDiagonalWords: true,
    showWordList: true
  }
};

// Cấp độ dễ với từ đơn giản và vị trí rõ ràng
export const easyWordSearchData = {
  title: "Tìm từ - Trái cây (Dễ)",
  description: "Tìm tên các loại trái cây được giấu trong bảng chữ cái",
  grid: [
    ["C", "A", "M", "S", "Ấ", "U", "X", "Y"],
    ["H", "X", "O", "À", "I", "T", "K", "L"],
    ["U", "Ổ", "I", "D", "Ứ", "A", "M", "O"],
    ["Ố", "M", "T", "C", "H", "O", "N", "I"],
    ["I", "Đ", "À", "O", "B", "M", "G", "P"],
    ["T", "H", "O", "M", "B", "Ơ", "V", "A"],
    ["K", "L", "Y", "N", "H", "Q", "R", "S"],
    ["B", "N", "M", "K", "L", "O", "P", "T"]
  ],
  words: [
    { word: "CAM", found: false }, // Ngang dòng 1
    { word: "XOÀI", found: false }, // Dọc cột 2
    { word: "DỨA", found: false }, // Ngang dòng 3
    { word: "ỔI", found: false }, // Dọc cột 2
    { word: "SẦU", found: false }, // Ngang dòng 1
    { word: "THƠM", found: false }, // Ngang dòng 6
    { word: "BƠ", found: false }, // Dọc cột 5
  ],
  settings: {
    timeLimit: 180,
    allowDiagonalWords: false,
    showWordList: true
  }
};

// Cấp độ khó với từ dài và vị trí phức tạp
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
    { word: "VOI", found: false }, // Ngang dòng 1
    { word: "CHÓ", found: false }, // Ngang dòng 2
    { word: "MÈO", found: false }, // Dọc cột 8
    { word: "GÀ", found: false }, // Dọc cột 2
    { word: "LỢN", found: false }, // Dọc cột 6
    { word: "CÁ", found: false }, // Dọc cột 12
    { word: "HEO", found: false }, // Dọc cột 9
    { word: "NGỰA", found: false }, // Dọc cột 11
    { word: "BÒ", found: false }, // Dọc cột 14
    { word: "DÊ", found: false }, // Dọc cột 14
    { word: "CHUỘT", found: false }, // Ngang dòng 13
    { word: "KIẾN", found: false }, // Dọc cột 7
  ],
  settings: {
    timeLimit: 480,
    allowDiagonalWords: true,
    showWordList: true
  }
};
