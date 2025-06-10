
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { GameSettingsData } from '../../types';
import { 
  GEMINI_API_KEY, 
  GEMINI_MODELS, 
  getApiEndpoint, 
  DEFAULT_GENERATION_SETTINGS 
} from '@/constants/api-constants';

export const useGameGeneration = () => {
  const [generating, setGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const { toast } = useToast();

  const generateAIContent = async (prompt: string, type: string, gameSettings: GameSettingsData) => {
    setGenerating(true);
    setGenerationProgress(0);

    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 4 + 1;
      });
    }, 300);

    try {
      const difficultyLevel = gameSettings.difficulty;
      const questionCount = gameSettings.questionCount;
      const timePerQuestion = gameSettings.timePerQuestion;
      const category = gameSettings.category;
      const totalTime = gameSettings.totalTime;
      const bonusTime = gameSettings.bonusTime;
      const promptContent = gameSettings.prompt || prompt;

      let gamePrompt = `Create content for a ${type} game with the following requirements:
- Topic: ${promptContent}
- Difficulty: ${difficultyLevel}
- Number of items: ${questionCount}
- Time per item: ${timePerQuestion} seconds
- Category: ${category}
- Total time limit: ${totalTime || 'not specified'} seconds
- Bonus time: ${bonusTime || 'not specified'} seconds

Output must be valid JSON. `;

      // Add specific prompts for each game type
      switch(type) {
        case 'quiz':
          gamePrompt += `JSON format: { "title": "title", "questions": [{"question": "question", "options": ["option 1", "option 2", "option 3", "option 4"], "correctAnswer": correct_answer_index, "explanation": "explanation"}], "settings": {"timePerQuestion": ${timePerQuestion}, "totalTime": ${totalTime || questionCount * timePerQuestion}, "bonusTimePerCorrect": ${bonusTime || 5}} }`;
          break;
        case 'flashcards':
          gamePrompt += `JSON format: { "title": "title", "cards": [{"front": "front", "back": "back", "hint": "hint (if any)"}], "settings": {"autoFlip": true, "flipTime": ${timePerQuestion}, "totalTime": ${totalTime || 180}} }`;
          break;
        case 'matching':
          gamePrompt += `JSON format: { "title": "title", "pairs": [{"left": "left content", "right": "right content"}], "settings": {"timeLimit": ${totalTime || 60}, "bonusTimePerMatch": ${bonusTime || 5}} }`;
          break;
        case 'memory':
          gamePrompt += `JSON format: { "title": "title", "cards": [{"id": id_number, "content": "content", "matched": false, "flipped": false}], "settings": {"timeLimit": ${totalTime || 120}, "allowHints": true, "hintPenalty": ${bonusTime || 5}} }`;
          break;
        case 'ordering':
          gamePrompt += `JSON format: { "title": "title", "sentences": [{"words": ["word 1", "word 2", "word 3"], "correctOrder": [0, 1, 2]}], "settings": {"timeLimit": ${totalTime || 180}, "showHints": true, "bonusTimePerCorrect": ${bonusTime || 10}} }`;
          break;
        case 'wordsearch':
          gamePrompt += `JSON format: { "title": "title", "description": "description", "words": [{"word": "word 1", "found": false}, {"word": "word 2", "found": false}], "grid": [["A", "B", "C"], ["D", "E", "F"], ["G", "H", "I"]], "settings": {"timeLimit": ${totalTime || 300}, "allowDiagonalWords": true, "showWordList": true, "bonusTimePerWord": ${bonusTime || 15}} }`;
          break;
        case 'pictionary':
          gamePrompt += `JSON format: { "title": "title", "items": [{"imageUrl": "URL ảnh từ internet", "answer": "answer", "options": ["option 1", "option 2", "option 3", "option 4"], "hint": "hint"}], "settings": {"timePerQuestion": ${timePerQuestion}, "showHints": true, "totalTime": ${totalTime || questionCount * timePerQuestion}} }

QUAN TRỌNG cho game Pictionary: 
- imageUrl PHẢI là URL ảnh thật từ internet dạng link
- Tìm ảnh từ các nguồn internet phù hợp với chủ đề
- KHÔNG sử dụng placeholder hay ảnh giả
- Mỗi ảnh phải phù hợp với đáp án và chủ đề`;
          break;
        case 'truefalse':
          gamePrompt += `JSON format: { "title": "title", "questions": [{"statement": "statement", "isTrue": true/false, "explanation": "explanation"}], "settings": {"timePerQuestion": ${timePerQuestion}, "showExplanation": true, "totalTime": ${totalTime || questionCount * timePerQuestion}, "bonusTimePerCorrect": ${bonusTime || 3}} }`;
          break;
        case 'groupsort':
          gamePrompt += `JSON format: { "title": "title", "items": [{"id": "1", "text": "item text", "group": "group name"}], "groups": [{"id": "group1", "name": "Group Name", "items": []}], "settings": {"timeLimit": ${totalTime || 120}, "bonusTimePerCorrect": ${bonusTime || 10}} }

HƯỚNG DẪN CHI TIẾT cho game GroupSort:
- Tạo CHÍNH XÁC ${questionCount || 12} items để phân nhóm
- Tạo 3-4 groups phù hợp và cân bằng với chủ đề "${promptContent}"
- Mỗi item phải có: id duy nhất (item1, item2...), text mô tả rõ ràng, group chính xác
- Groups phải có: id duy nhất (group1, group2...), name rõ ràng, items array rỗng []
- Phân bố items ĐỀU NHAU giữa các groups (mỗi group 3-4 items)
- Items phải thú vị, đa dạng và liên quan chặt chẽ đến chủ đề
- Group names phải khác biệt rõ ràng, không gây nhầm lẫn`;
          break;
        case 'spinwheel':
          gamePrompt += `JSON format: { "title": "title", "segments": [{"id": "1", "text": "segment text", "color": "#FF6B6B", "points": 10}], "settings": {"allowMultipleSpins": true, "maxSpins": 10}} }`;
          break;
        case 'completesentence':
          gamePrompt += `JSON format: { "title": "title", "sentences": [{"sentence": "Sentence with _____ blanks", "blanks": ["word1", "word2"], "options": ["option1", "option2", "option3", "option4"]}], "settings": {"timePerQuestion": ${timePerQuestion}, "showHints": true, "totalTime": ${totalTime || questionCount * timePerQuestion}} }`;
          break;
        case 'anagram':
          gamePrompt += `JSON format: { "title": "title", "words": [{"id": "1", "original": "original word", "scrambled": "scrambled", "hint": "hint text"}], "settings": {"timePerQuestion": ${timePerQuestion}, "showHints": true, "totalTime": ${totalTime || questionCount * timePerQuestion}} }`;
          break;
        case 'openbox':
          gamePrompt += `JSON format: { "title": "title", "boxes": [{"id": "1", "content": "box content", "type": "question/reward/challenge", "points": 10, "opened": false}], "settings": {"allowHints": true, "bonusTimePerBox": ${bonusTime || 5}} }`;
          break;
        case 'speakingcards':
          gamePrompt += `JSON format: { "title": "title", "cards": [{"id": "1", "prompt": "speaking prompt", "category": "category", "difficulty": "easy/medium/hard", "timeLimit": 60}], "settings": {"defaultTimeLimit": ${timePerQuestion || 60}, "allowExtension": true}} }`;
          break;
        case 'neuronpaths':
          gamePrompt += `JSON format: { "title": "title", "nodes": [{"id": "node1", "data": {"label": "concept name", "level": "basic|intermediate|advanced", "category": "category"}, "position": {"x": 100, "y": 100}, "type": "default"}], "settings": {"timeLimit": ${totalTime || 300}, "allowHints": true}} }`;
          break;
      }

      gamePrompt += " Return only JSON, no additional text.";

      console.log("Sending prompt to Gemini:", gamePrompt);

      const payload = {
        contents: [{
          role: "user",
          parts: [{text: gamePrompt}]
        }],
        generationConfig: {
          ...DEFAULT_GENERATION_SETTINGS,
          temperature: 0.7
        }
      };

      const response = await fetch(getApiEndpoint(GEMINI_MODELS.PRESET_GAME), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error: ${response.status} ${response.statusText}`, errorText);
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      const text = result?.candidates?.[0]?.content?.parts?.[0]?.text || '';

      if (!text) {
        throw new Error('No content returned from API');
      }

      console.log("Received response from Gemini:", text);

      try {
        const jsonStr = text.includes('```json') 
          ? text.split('```json')[1].split('```')[0].trim() 
          : text.includes('```') 
            ? text.split('```')[1].split('```')[0].trim() 
            : text;

        console.log("Parsed JSON string:", jsonStr);

        const parsedContent = JSON.parse(jsonStr);

        if (!parsedContent.settings) {
          parsedContent.settings = {};
        }

        // Apply settings based on game type
        switch(type) {
          case 'quiz':
            parsedContent.settings.timePerQuestion = timePerQuestion;
            parsedContent.settings.totalTime = totalTime || questionCount * timePerQuestion;
            parsedContent.settings.bonusTimePerCorrect = bonusTime || 5;
            break;
          case 'flashcards':
            parsedContent.settings.flipTime = timePerQuestion;
            parsedContent.settings.totalTime = totalTime || 180;
            break;
          case 'matching':
          case 'memory':
            parsedContent.settings.timeLimit = totalTime || 120;
            break;
          case 'ordering':
            parsedContent.settings.timeLimit = totalTime || 180;
            parsedContent.settings.bonusTimePerCorrect = bonusTime || 10;
            break;
          case 'wordsearch':
            parsedContent.settings.timeLimit = totalTime || 300;
            parsedContent.settings.bonusTimePerWord = bonusTime || 15;
            break;
          case 'pictionary':
            parsedContent.settings.timePerQuestion = timePerQuestion;
            parsedContent.settings.totalTime = totalTime || questionCount * timePerQuestion;
            break;
          case 'truefalse':
            parsedContent.settings.timePerQuestion = timePerQuestion;
            parsedContent.settings.totalTime = totalTime || questionCount * timePerQuestion;
            parsedContent.settings.bonusTimePerCorrect = bonusTime || 3;
            break;
          case 'neuronpaths':
            parsedContent.settings.timeLimit = totalTime || 300;
            parsedContent.settings.allowHints = true;
            break;
        }

        clearInterval(progressInterval);
        setGenerationProgress(100);

        setTimeout(() => {
          setGenerating(false);
        }, 500);

        return parsedContent;
      } catch (parseError) {
        console.error("Error parsing AI response:", parseError);
        clearInterval(progressInterval);
        toast({
          title: "Lỗi định dạng",
          description: "AI tạo phản hồi không hợp lệ. Vui lòng thử lại.",
          variant: "destructive"
        });
        throw new Error('AI response format error');
      }
    } catch (err) {
      console.error("AI Error:", err);
      clearInterval(progressInterval);
      toast({
        title: "Lỗi AI",
        description: "Không thể tạo nội dung. Vui lòng thử lại sau.",
        variant: "destructive"
      });
      throw err;
    } finally {
      setGenerating(false);
    }
  };

  return {
    generating,
    generationProgress,
    generateAIContent
  };
};
