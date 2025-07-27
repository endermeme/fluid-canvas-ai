/**
 * Game Validation Utilities
 * Các hàm validation cho custom và preset games
 */

// Custom Game Validation
export const validateCustomGame = (gameData: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!gameData) {
    errors.push('Game data is required');
    return { isValid: false, errors };
  }
  
  if (!gameData.title || gameData.title.trim().length === 0) {
    errors.push('Game title is required');
  }
  
  if (!gameData.content || gameData.content.trim().length === 0) {
    errors.push('Game content is required');
  }
  
  // Check for basic HTML structure in custom games
  if (gameData.content && !gameData.content.includes('<')) {
    errors.push('Custom game content should contain HTML');
  }
  
  // Check content size
  if (gameData.content && gameData.content.length > 500000) {
    errors.push('Game content is too large (max 500KB)');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Preset Game Validation
export const validatePresetGame = (gameData: any, gameType: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!gameData) {
    errors.push('Game data is required');
    return { isValid: false, errors };
  }
  
  if (!gameType || gameType.trim().length === 0) {
    errors.push('Game type is required');
  }
  
  // Validate based on game type
  switch (gameType.toLowerCase()) {
    case 'quiz':
      return validateQuizData(gameData);
    case 'flashcards':
      return validateFlashcardsData(gameData);
    case 'memory':
      return validateMemoryData(gameData);
    case 'matching':
      return validateMatchingData(gameData);
    case 'wordsearch':
      return validateWordSearchData(gameData);
    case 'truefalse':
      return validateTrueFalseData(gameData);
    default:
      errors.push(`Unsupported game type: ${gameType}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Quiz Game Validation
const validateQuizData = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!data.questions || !Array.isArray(data.questions)) {
    errors.push('Quiz must have questions array');
    return { isValid: false, errors };
  }
  
  if (data.questions.length === 0) {
    errors.push('Quiz must have at least one question');
  }
  
  data.questions.forEach((question: any, index: number) => {
    if (!question.question || question.question.trim().length === 0) {
      errors.push(`Question ${index + 1}: Question text is required`);
    }
    
    if (!question.options || !Array.isArray(question.options) || question.options.length < 2) {
      errors.push(`Question ${index + 1}: Must have at least 2 options`);
    }
    
    if (question.correctAnswer === undefined || question.correctAnswer === null) {
      errors.push(`Question ${index + 1}: Correct answer is required`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Flashcards Game Validation
const validateFlashcardsData = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!data.cards || !Array.isArray(data.cards)) {
    errors.push('Flashcards must have cards array');
    return { isValid: false, errors };
  }
  
  if (data.cards.length === 0) {
    errors.push('Flashcards must have at least one card');
  }
  
  data.cards.forEach((card: any, index: number) => {
    if (!card.front || card.front.trim().length === 0) {
      errors.push(`Card ${index + 1}: Front text is required`);
    }
    
    if (!card.back || card.back.trim().length === 0) {
      errors.push(`Card ${index + 1}: Back text is required`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Memory Game Validation
const validateMemoryData = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!data.pairs || !Array.isArray(data.pairs)) {
    errors.push('Memory game must have pairs array');
    return { isValid: false, errors };
  }
  
  if (data.pairs.length < 2) {
    errors.push('Memory game must have at least 2 pairs');
  }
  
  if (data.pairs.length > 20) {
    errors.push('Memory game cannot have more than 20 pairs');
  }
  
  data.pairs.forEach((pair: any, index: number) => {
    if (!pair.first || pair.first.trim().length === 0) {
      errors.push(`Pair ${index + 1}: First item is required`);
    }
    
    if (!pair.second || pair.second.trim().length === 0) {
      errors.push(`Pair ${index + 1}: Second item is required`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Matching Game Validation
const validateMatchingData = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!data.items || !Array.isArray(data.items)) {
    errors.push('Matching game must have items array');
    return { isValid: false, errors };
  }
  
  if (data.items.length < 3) {
    errors.push('Matching game must have at least 3 items');
  }
  
  data.items.forEach((item: any, index: number) => {
    if (!item.term || item.term.trim().length === 0) {
      errors.push(`Item ${index + 1}: Term is required`);
    }
    
    if (!item.definition || item.definition.trim().length === 0) {
      errors.push(`Item ${index + 1}: Definition is required`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Word Search Game Validation
const validateWordSearchData = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!data.words || !Array.isArray(data.words)) {
    errors.push('Word search must have words array');
    return { isValid: false, errors };
  }
  
  if (data.words.length < 5) {
    errors.push('Word search must have at least 5 words');
  }
  
  if (data.words.length > 20) {
    errors.push('Word search cannot have more than 20 words');
  }
  
  data.words.forEach((word: string, index: number) => {
    if (!word || word.trim().length === 0) {
      errors.push(`Word ${index + 1}: Word is required`);
    }
    
    if (word && word.length > 12) {
      errors.push(`Word ${index + 1}: Word too long (max 12 characters)`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// True/False Game Validation
const validateTrueFalseData = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!data.statements || !Array.isArray(data.statements)) {
    errors.push('True/False game must have statements array');
    return { isValid: false, errors };
  }
  
  if (data.statements.length === 0) {
    errors.push('True/False game must have at least one statement');
  }
  
  data.statements.forEach((statement: any, index: number) => {
    if (!statement.text || statement.text.trim().length === 0) {
      errors.push(`Statement ${index + 1}: Statement text is required`);
    }
    
    if (typeof statement.isTrue !== 'boolean') {
      errors.push(`Statement ${index + 1}: Must specify if statement is true or false`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Share Settings Validation
export const validateShareSettings = (settings: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (settings.maxParticipants && (settings.maxParticipants < 1 || settings.maxParticipants > 100)) {
    errors.push('Max participants must be between 1 and 100');
  }
  
  if (settings.customDuration && (settings.customDuration < 1 || settings.customDuration > 168)) {
    errors.push('Custom duration must be between 1 and 168 hours');
  }
  
  if (settings.password && settings.password.length < 4) {
    errors.push('Password must be at least 4 characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export default {
  validateCustomGame,
  validatePresetGame,
  validateShareSettings
};