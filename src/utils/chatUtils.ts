
import { BlockType } from '@/lib/block-utils';

export interface Message {
  role: 'user' | 'ai';
  message: string;
  timestamp: Date;
}

export const generateAIResponse = (message: string): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Tôi đang tạo trò chơi học tập tương tác theo yêu cầu của bạn. Vui lòng đợi trong giây lát...");
    }, 500);
  });
};

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const getInitialMessage = (): Message => {
  return { 
    role: 'ai', 
    message: 'Xin chào! Tôi là trợ lý AI giáo dục. Hãy nhập chủ đề học tập bạn muốn, tôi sẽ tạo minigame tương tác theo yêu cầu của bạn. Bạn có thể yêu cầu các trò chơi toán học, từ vựng, lịch sử, khoa học, hoặc bất kỳ chủ đề giáo dục nào!', 
    timestamp: new Date() 
  };
};
