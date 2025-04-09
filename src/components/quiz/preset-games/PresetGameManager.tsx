import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import gameTemplates from './templates';
import { useToast } from '@/hooks/use-toast';

// Import Gemini API 
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyB-X13dE3qKEURW8DxLmK56Vx3lZ1c8IfA';
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Game play count storage key
const GAME_PLAY_COUNT_KEY = 'lovable_game_play_count';

interface PresetGameManagerProps {
  gameType: string;
  onBack: () => void;
  initialTopic?: string;
}

const PresetGameManager: React.FC<PresetGameManagerProps> = ({ gameType, onBack, initialTopic = "Learn interactively" }) => {
  const [loading, setLoading] = useState(true);
  const [gameContent, setGameContent] = useState(null);
  const [error, setError] = useState(null);
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);
  const [gamePlayCount, setGamePlayCount] = useState<number>(0);
  const { toast } = useToast();

  // Load and increment game play count
  useEffect(() => {
    // Load current count from localStorage
    try {
      const savedCount = localStorage.getItem(GAME_PLAY_COUNT_KEY);
      const currentCount = savedCount ? parseInt(savedCount, 10) : 0;
      setGamePlayCount(currentCount);
      
      // Increment count only when a game is loaded
      if (!loading && gameContent) {
        const newCount = currentCount + 1;
        localStorage.setItem(GAME_PLAY_COUNT_KEY, newCount.toString());
        setGamePlayCount(newCount);
        console.log(`Game play count: ${newCount}`);
      }
    } catch (err) {
      console.error("Error tracking game count:", err);
    }
  }, [loading, gameContent]);

  // Track game start time
  useEffect(() => {
    if (!loading && gameContent && !gameStartTime) {
      setGameStartTime(Date.now());
    }
  }, [loading, gameContent, gameStartTime]);

  const generateAIContent = async (prompt, type) => {
    setLoading(true);
    setError(null);
    setGameStartTime(null); // Reset game start time
    
    try {
      const generationConfig = {
        temperature: 0.7,
        topK: 1,
        topP: 0.95,
        maxOutputTokens: 8000,
      };
      
      let gamePrompt = `Create content for a ${type} game with the following requirements: ${prompt}. Output must be valid JSON. `;
      
      switch(type) {
        case 'quiz':
          gamePrompt += `JSON format: { "title": "title", "questions": [{"question": "question", "options": ["option 1", "option 2", "option 3", "option 4"], "correctAnswer": correct_answer_index, "explanation": "explanation"}], "settings": {"timePerQuestion": 30, "totalTime": 300, "bonusTimePerCorrect": 5} }`;
          break;
        case 'flashcards':
          gamePrompt += `JSON format: { "title": "title", "cards": [{"front": "front", "back": "back", "hint": "hint (if any)"}], "settings": {"autoFlip": true, "flipTime": 5, "totalTime": 180} }`;
          break;
        case 'matching':
          gamePrompt += `JSON format: { "title": "title", "pairs": [{"left": "left content", "right": "right content"}], "settings": {"timeLimit": 60, "bonusTimePerMatch": 5} }`;
          break;
        case 'memory':
          gamePrompt += `JSON format: { "title": "title", "cards": [{"id": id_number, "content": "content", "matched": false, "flipped": false}], "settings": {"timeLimit": 120, "allowHints": true, "hintPenalty": 5} }`;
          break;
        case 'ordering':
          gamePrompt += `JSON format: { "title": "title", "sentences": [{"words": ["word 1", "word 2", "word 3"], "correctOrder": [0, 1, 2]}], "settings": {"timeLimit": 180, "showHints": true, "bonusTimePerCorrect": 10} }`;
          break;
        case 'wordsearch':
          gamePrompt += `JSON format: { "title": "title", "description": "description", "words": [{"word": "word 1", "found": false}, {"word": "word 2", "found": false}], "grid": [["A", "B", "C"], ["D", "E", "F"], ["G", "H", "I"]], "settings": {"timeLimit": 300, "allowDiagonalWords": true, "showWordList": true, "bonusTimePerWord": 15} }`;
          break;
        case 'pictionary':
          gamePrompt += `JSON format: { "title": "title", "items": [{"imageUrl": "image URL", "answer": "answer", "options": ["option 1", "option 2", "option 3", "option 4"], "hint": "hint"}], "settings": {"timePerQuestion": 20, "showHints": true, "totalTime": 240} }`;
          break;
        case 'truefalse':
          gamePrompt += `JSON format: { "title": "title", "questions": [{"statement": "statement", "isTrue": true/false, "explanation": "explanation"}], "settings": {"timePerQuestion": 15, "showExplanation": true, "totalTime": 150, "bonusTimePerCorrect": 3} }`;
          break;
      }
      
      gamePrompt += " Return only JSON, no additional text.";
      
      console.log("Sending prompt to Gemini:", gamePrompt);
      
      const result = await model.generateContent(gamePrompt);
      const response = await result.response;
      const text = response.text();
      
      console.log("Received response from Gemini:", text);
      
      try {
        // Extract JSON if wrapped in backticks
        const jsonStr = text.includes('```json') 
          ? text.split('```json')[1].split('```')[0].trim() 
          : text.includes('```') 
            ? text.split('```')[1].split('```')[0].trim() 
            : text;
            
        console.log("Parsed JSON string:", jsonStr);
        
        const parsedContent = JSON.parse(jsonStr);
        
        // Ensure time settings are present
        if (!parsedContent.settings) {
          parsedContent.settings = {};
        }
        
        // Apply default time settings if not provided
        switch(type) {
          case 'quiz':
            if (!parsedContent.settings.timePerQuestion) parsedContent.settings.timePerQuestion = 30;
            if (!parsedContent.settings.totalTime) parsedContent.settings.totalTime = parsedContent.questions.length * parsedContent.settings.timePerQuestion;
            if (!parsedContent.settings.bonusTimePerCorrect) parsedContent.settings.bonusTimePerCorrect = 5;
            break;
          case 'flashcards':
            if (!parsedContent.settings.flipTime) parsedContent.settings.flipTime = 5;
            if (!parsedContent.settings.totalTime) parsedContent.settings.totalTime = 180;
            break;
          case 'matching':
          case 'memory':
          case 'ordering':
          case 'wordsearch':
            if (!parsedContent.settings.timeLimit) parsedContent.settings.timeLimit = 120;
            break;
          case 'pictionary':
            if (!parsedContent.settings.timePerQuestion) parsedContent.settings.timePerQuestion = 15;
            if (!parsedContent.settings.totalTime) parsedContent.settings.totalTime = parsedContent.items.length * parsedContent.settings.timePerQuestion;
            break;
          case 'truefalse':
            if (!parsedContent.settings.timePerQuestion) parsedContent.settings.timePerQuestion = 15;
            if (!parsedContent.settings.totalTime) parsedContent.settings.totalTime = parsedContent.questions.length * parsedContent.settings.timePerQuestion;
            if (!parsedContent.settings.bonusTimePerCorrect) parsedContent.settings.bonusTimePerCorrect = 3;
            break;
        }
        
        setGameContent(parsedContent);
        return parsedContent;
      } catch (parseError) {
        console.error("Error parsing AI response:", parseError);
        toast({
          title: "Format Error",
          description: "AI generated an invalid response format. Please try again.",
          variant: "destructive"
        });
        throw new Error('AI response format error');
      }
    } catch (err) {
      console.error("AI Error:", err);
      setError('Unable to generate content with AI. Please try again later.');
      toast({
        title: "AI Error",
        description: "Unable to generate content. Please try again later.",
        variant: "destructive"
      });
      
      // Fall back to sample data
      loadSampleData(type);
    } finally {
      setLoading(false);
    }
  };

  const loadSampleData = (type) => {
    // Dynamically import sample data based on type
    import(`./data/${type}SampleData.ts`).then(module => {
      let data = null;
      
      // Determine which data to use based on type and difficulty keywords in the topic
      if (type === 'wordsearch' && initialTopic) {
        const lowerTopic = initialTopic.toLowerCase();
        if (lowerTopic.includes('easy') || lowerTopic.includes('simple')) {
          data = module.easyWordSearchData || module.default || module[`${type}SampleData`];
        } else if (lowerTopic.includes('hard') || lowerTopic.includes('difficult')) {
          data = module.hardWordSearchData || module.default || module[`${type}SampleData`];
        } else {
          data = module.default || module[`${type}SampleData`];
        }
      } else {
        data = module.default || module[`${type}SampleData`];
      }
      
      // Ensure time settings are present in sample data
      if (data && !data.settings) {
        data.settings = {};
      }
      
      // Add default time settings to sample data if missing
      switch(type) {
        case 'quiz':
          if (!data.settings.timePerQuestion) data.settings.timePerQuestion = 30;
          if (!data.settings.totalTime) data.settings.totalTime = data.questions.length * data.settings.timePerQuestion;
          if (!data.settings.bonusTimePerCorrect) data.settings.bonusTimePerCorrect = 5;
          break;
        case 'flashcards':
          if (!data.settings.flipTime) data.settings.flipTime = 5;
          if (!data.settings.totalTime) data.settings.totalTime = 180;
          break;
        case 'matching':
        case 'memory':
        case 'ordering':
        case 'wordsearch':
          if (!data.settings.timeLimit) data.settings.timeLimit = 120;
          break;
        case 'pictionary':
          if (!data.settings.timePerQuestion) data.settings.timePerQuestion = 15;
          if (!data.settings.totalTime) data.settings.totalTime = data.items ? data.items.length * data.settings.timePerQuestion : 180;
          break;
        case 'truefalse':
          if (!data.settings.timePerQuestion) data.settings.timePerQuestion = 15;
          if (!data.settings.totalTime) data.settings.totalTime = data.questions ? data.questions.length * data.settings.timePerQuestion : 150;
          if (!data.settings.bonusTimePerCorrect) data.settings.bonusTimePerCorrect = 3;
          break;
      }
      
      setGameContent(data);
    }).catch(err => {
      console.error(`Error loading sample data for ${type}:`, err);
      setError(`Unable to load sample data for ${type}. Please try again.`);
    });
  };

  const handleRetry = () => {
    if (initialTopic && initialTopic.trim() !== "") {
      generateAIContent(initialTopic, gameType);
    } else {
      loadSampleData(gameType);
    }
  };

  useEffect(() => {
    // Use initialTopic from props if available
    const aiPrompt = initialTopic;
    
    if (aiPrompt && aiPrompt.trim() !== "") {
      // Use AI to generate content if prompt exists
      console.log(`Creating ${gameType} game with prompt: "${aiPrompt}"`);
      generateAIContent(aiPrompt, gameType);
    } else {
      // Otherwise use sample data for dev/test
      console.log(`Loading sample data for ${gameType} game`);
      loadSampleData(gameType);
      setLoading(false);
    }
  }, [gameType, initialTopic]);

  // Render appropriate template based on game type
  const renderGameTemplate = () => {
    const topic = initialTopic || "General Topic";
    const Template = gameTemplates[gameType];
    
    if (Template) {
      return <Template content={gameContent} topic={topic} />;
    }
    
    return (
      <div className="flex items-center justify-center h-full">
        <p>Template not found for game type: {gameType}</p>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium">Creating game with AI...</p>
          <p className="text-sm text-muted-foreground mt-2">This may take a few seconds</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">An error occurred</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <div className="flex gap-2">
            <Button onClick={onBack}>Go back</Button>
            <Button onClick={handleRetry} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {gamePlayCount > 0 && (
        <div className="absolute top-2 right-4 bg-primary/10 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium z-10">
          Games played: {gamePlayCount}
        </div>
      )}
      <div className="flex-grow overflow-auto">
        {gameContent ? renderGameTemplate() : (
          <div className="flex items-center justify-center h-full">
            <p>No game content available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PresetGameManager;
