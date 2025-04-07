
export const wordSearchSampleData = {
  title: "Tìm từ - Các loại hoa",
  description: "Tìm tên các loại hoa được giấu trong bảng chữ cái",
  grid: [
    ["H", "O", "A", "H", "Ồ", "N", "G", "K", "C"],
    ["L", "A", "N", "T", "D", "C", "Ú", "C", "D"],
    ["H", "K", "L", "B", "I", "R", "S", "H", "À"],
    ["H", "C", "A", "M", "T", "Ú", "C", "Ú", "L"],
    ["Ò", "A", "Y", "K", "O", "C", "H", "C", "I"],
    ["N", "M", "H", "O", "A", "S", "E", "N", "A"],
    ["G", "T", "U", "J", "W", "E", "V", "S", "T"],
    ["X", "Ú", "Ệ", "P", "H", "U", "Ợ", "N", "G"],
    ["S", "C", "H", "O", "A", "M", "A", "I", "G"]
  ],
  words: [
    { word: "HỒNG", found: false },
    { word: "LAN", found: false },
    { word: "CÚC", found: false },
    { word: "ĐÀO", found: false },
    { word: "MAI", found: false },
    { word: "SEN", found: false },
    { word: "HƯỚNG", found: false },
    { word: "CAMTÚCẦU", found: false }
  ],
  settings: {
    timeLimit: 300,
    allowDiagonalWords: false,
    showWordList: true
  }
};
