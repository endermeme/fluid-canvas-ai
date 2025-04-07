
import { GamePresetType } from './types';

export const gamePresets: GamePresetType[] = [
  {
    id: 'quiz',
    name: 'Trắc nghiệm ABCD',
    icon: 'brain-circuit',
    shortDescription: 'Trò chơi trắc nghiệm kiến thức',
    description: 'Trò chơi trắc nghiệm với 4 lựa chọn cho mỗi câu hỏi. Người chơi chọn đáp án đúng để đạt điểm.',
    customizeInstruction: 'Nhập chủ đề hoặc danh sách câu hỏi cho trò chơi trắc nghiệm của bạn.',
    inputPlaceholder: 'Ví dụ: Lịch sử Việt Nam, hoặc danh sách câu hỏi và đáp án',
    inputHelper: 'AI sẽ tạo các câu hỏi trắc nghiệm dựa trên nội dung bạn nhập. Càng chi tiết càng tốt!',
    tags: ['Kiến thức', 'Trắc nghiệm', 'Đố vui'],
    promptTemplate: 'Tạo một trò chơi trắc nghiệm về chủ đề: {{content}}. Mỗi câu hỏi có 4 lựa chọn A, B, C, D với một đáp án đúng.'
  },
  {
    id: 'flashcards',
    name: 'Thẻ Ghi Nhớ',
    icon: 'book-text',
    shortDescription: 'Học thuộc bằng thẻ ghi nhớ',
    description: 'Trò chơi thẻ ghi nhớ giúp học từ vựng, khái niệm nhanh chóng. Lật thẻ để xem đáp án.',
    customizeInstruction: 'Nhập danh sách thuật ngữ, khái niệm hoặc từ vựng cần học.',
    inputPlaceholder: 'Ví dụ: Từ vựng tiếng Anh về động vật, Các công thức toán học, Khái niệm lịch sử',
    inputHelper: 'AI sẽ tạo các thẻ ghi nhớ với mặt trước và mặt sau dựa trên nội dung của bạn.',
    tags: ['Ghi nhớ', 'Từ vựng', 'Học tập'],
    promptTemplate: 'Tạo một bộ thẻ ghi nhớ về: {{content}}. Mỗi thẻ có mặt trước là khái niệm/từ và mặt sau là định nghĩa/giải thích.'
  },
  {
    id: 'matching',
    name: 'Trò Chơi Ghép Cặp',
    icon: 'puzzle-piece',
    shortDescription: 'Ghép từ với định nghĩa',
    description: 'Trò chơi ghép cặp từ/khái niệm với định nghĩa tương ứng. Kéo thả hoặc chọn các cặp phù hợp.',
    customizeInstruction: 'Nhập chủ đề hoặc danh sách các khái niệm cần ghép cặp.',
    inputPlaceholder: 'Ví dụ: Ghép quốc gia với thủ đô, Ghép động vật với môi trường sống',
    inputHelper: 'AI sẽ tạo các cặp khái niệm và định nghĩa để người chơi ghép.',
    tags: ['Ghép cặp', 'Liên kết', 'Logic'],
    promptTemplate: 'Tạo một trò chơi ghép cặp về: {{content}}. Mỗi cặp gồm một khái niệm/từ và một định nghĩa/mô tả tương ứng.'
  },
  {
    id: 'wordsearch',
    name: 'Tìm Từ Ẩn',
    icon: 'lightbulb',
    shortDescription: 'Tìm từ trong bảng chữ',
    description: 'Trò chơi tìm các từ ẩn trong bảng chữ cái. Tìm và đánh dấu các từ theo danh sách.',
    customizeInstruction: 'Nhập chủ đề hoặc danh sách các từ bạn muốn đưa vào trò chơi tìm từ.',
    inputPlaceholder: 'Ví dụ: Các loài hoa, Tên các thành phố châu Á, Dụng cụ nhà bếp',
    inputHelper: 'AI sẽ tạo bảng chữ và danh sách từ cần tìm dựa trên chủ đề của bạn.',
    tags: ['Tìm kiếm', 'Từ vựng', 'Giải đố'],
    promptTemplate: 'Tạo một trò chơi tìm từ ẩn về chủ đề: {{content}}. Bao gồm một bảng chữ và danh sách từ cần tìm.'
  },
  {
    id: 'truefalse',
    name: 'Đúng hay Sai',
    icon: 'dices',
    shortDescription: 'Trò chơi phán đoán',
    description: 'Trò chơi đưa ra các phát biểu, người chơi phải xác định đúng hay sai. Kiểm tra hiểu biết nhanh chóng.',
    customizeInstruction: 'Nhập chủ đề hoặc lĩnh vực kiến thức để tạo câu hỏi đúng/sai.',
    inputPlaceholder: 'Ví dụ: Sự kiện lịch sử, Kiến thức khoa học, Sự thật thú vị về động vật',
    inputHelper: 'AI sẽ tạo các phát biểu đúng và sai về chủ đề của bạn cho người chơi xác định.',
    tags: ['Đúng/Sai', 'Phán đoán', 'Xác minh'],
    promptTemplate: 'Tạo một trò chơi đúng hay sai về chủ đề: {{content}}. Mỗi câu là một phát biểu và người chơi phải xác định đúng hay sai.'
  },
  {
    id: 'sentence',
    name: 'Điền Vào Chỗ Trống',
    icon: 'message-square',
    shortDescription: 'Hoàn thành câu',
    description: 'Trò chơi điền vào chỗ trống trong câu. Người chơi cần điền từ thích hợp để hoàn thành câu có ý nghĩa.',
    customizeInstruction: 'Nhập chủ đề hoặc loại câu bạn muốn tạo bài tập điền vào chỗ trống.',
    inputPlaceholder: 'Ví dụ: Ngữ pháp tiếng Anh, Câu danh ngôn, Lời bài hát nổi tiếng',
    inputHelper: 'AI sẽ tạo các câu có chỗ trống để người chơi điền vào.',
    tags: ['Điền từ', 'Ngôn ngữ', 'Hoàn thành'],
    promptTemplate: 'Tạo một trò chơi điền vào chỗ trống về chủ đề: {{content}}. Mỗi câu hỏi có một từ bị thiếu được thay bằng dấu gạch ngang hoặc ô trống.'
  }
];

// Utility function to get preset by ID
export const getPresetById = (id: string): GamePresetType | undefined => {
  return gamePresets.find(preset => preset.id === id);
};

// Utility function to format prompt with content
export const formatPromptTemplate = (preset: GamePresetType, content: string): string => {
  return preset.promptTemplate.replace('{{content}}', content);
};
