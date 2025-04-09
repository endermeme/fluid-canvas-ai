
import { GameSettingsData } from '../../types';
import { tryGeminiGeneration } from '../../generator/geminiGenerator';
import { defaultGeminiModel } from './geminiClient';
import { useToast } from '@/hooks/use-toast';

// Function to generate game content
export const generateGameContent = async (
  topic: string, 
  gameType: string, 
  settings: GameSettingsData,
  onSuccess: (gameData: any) => void,
  onError: (error: string) => void,
  loadSampleData: (type: string) => void
) => {
  try {
    // Use optimized Gemini generation approach
    const game = await tryGeminiGeneration(defaultGeminiModel, topic, settings);
    
    if (game && (game.content || Object.keys(game).length > 0)) {
      console.log(`Successfully generated ${gameType} game:`, game);
      
      // Handle direct JSON objects for certain game types
      if (typeof game.content === 'string') {
        if (game.content.trim().startsWith('{') && (
          gameType === 'matching' || gameType === 'quiz' || 
          gameType === 'flashcards' || gameType === 'wordsearch'
        )) {
          try {
            // Try to parse the JSON
            const parsedContent = JSON.parse(game.content);
            onSuccess(parsedContent);
          } catch (e) {
            console.error("Failed to parse game content as JSON:", e);
            onSuccess(game);
          }
        } else {
          onSuccess(game);
        }
      } else {
        onSuccess(game);
      }
      
      return true;
    } else {
      throw new Error("Không thể tạo nội dung game");
    }
  } catch (err) {
    console.error("AI Error:", err);
    onError('Không thể tạo nội dung với AI. Vui lòng thử lại sau.');
    
    // Fall back to sample data
    loadSampleData(gameType);
    return false;
  }
};

// Helper function to get a readable game type name
export const getGameTypeName = (type: string): string => {
  switch (type) {
    case 'quiz': return 'Trắc Nghiệm';
    case 'flashcards': return 'Thẻ Ghi Nhớ';
    case 'matching': return 'Nối Từ';
    case 'memory': return 'Trò Chơi Ghi Nhớ';
    case 'ordering': return 'Sắp Xếp Câu';
    case 'wordsearch': return 'Tìm Từ';
    case 'pictionary': return 'Đoán Hình';
    case 'truefalse': return 'Đúng hay Sai';
    default: return 'Trò Chơi';
  }
};
