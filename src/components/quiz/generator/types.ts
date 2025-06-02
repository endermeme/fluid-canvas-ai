
import { GameSettingsData } from '../types';

export interface MiniGame {
  id?: string;
  title?: string;
  code?: string;        // Mã JavaScript/React của game
  content?: string;     // Giữ lại để tương thích ngược
  description?: string; // Mô tả ngắn gọn
  topic?: string;       // Chủ đề của game
  settings?: any;       // Cài đặt game
  createdAt?: string;   // Thời gian tạo
  type?: string;        // Loại game
}

export interface GameApiResponse {
  success: boolean;
  game?: MiniGame;
  error?: string;
}

export interface PromptOptions {
  topic: string;
  language?: string;
  enhancedPrompt?: string;  // Thêm trường này để hỗ trợ Super Thinking
  aiModelType?: string;     // Loại mô hình AI
}

export interface GeneratorSettings {
  temperature?: number;
}
