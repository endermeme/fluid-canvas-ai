// Hệ thống tính điểm cho tất cả các game
// Công thức: finalScore = max(0, base + timeBonus - wrongPenalty - hintPenalty)

export interface ScoreStats {
  correct: number;
  wrong: number;
  hints: number;
  baseUnit: number;     // điểm/đơn vị đúng (1 hoặc 2)
  timeLeft: number;
  totalTime: number;
  k: number;           // hệ số timeBonus
  w: number;           // hệ số wrongPenalty  
  h: number;           // hệ số hintPenalty
}

export interface GameScoreConfig {
  baseUnit: number;
  timeWeight: number;    // k
  wrongPenalty: number;  // w
  hintPenalty: number;   // h
}

// Cấu hình mặc định cho từng loại game
export const GAME_SCORE_CONFIGS: Record<string, GameScoreConfig> = {
  quiz: {
    baseUnit: 1,
    timeWeight: 0.7,
    wrongPenalty: 0.25,
    hintPenalty: 0
  },
  trueFalse: {
    baseUnit: 1,
    timeWeight: 0.7,
    wrongPenalty: 0.25,
    hintPenalty: 0
  },
  ordering: {
    baseUnit: 1,
    timeWeight: 0.5,
    wrongPenalty: 0,
    hintPenalty: 0.2
  },
  matching: {
    baseUnit: 1,
    timeWeight: 0.6,
    wrongPenalty: 0.1,
    hintPenalty: 0
  },
  memory: {
    baseUnit: 2,
    timeWeight: 0.8,
    wrongPenalty: 0.2,
    hintPenalty: 0.15
  },
  wordSearch: {
    baseUnit: 1,
    timeWeight: 0.6,
    wrongPenalty: 0.1,
    hintPenalty: 0
  },
  flashcards: {
    baseUnit: 1,
    timeWeight: 0,
    wrongPenalty: 0,
    hintPenalty: 0
  }
};

/**
 * Tính điểm cuối cùng theo công thức thống nhất
 */
export function calculateScore({
  correct,
  wrong,
  hints,
  baseUnit,
  timeLeft,
  totalTime,
  k,
  w,
  h
}: ScoreStats): number {
  const base = correct * baseUnit;
  const timeBonus = k * (timeLeft / totalTime) * base;
  const wrongPenalty = w * wrong;
  const hintPenalty = h * hints;
  
  const finalScore = base + timeBonus - wrongPenalty - hintPenalty;
  
  // Nhân 100 để có thang điểm 0-1000, làm tròn và đảm bảo >= 0
  return Math.max(0, Math.round(finalScore * 100));
}

/**
 * Tính điểm với cấu hình mặc định của game
 */
export function calculateGameScore(
  gameType: string,
  correct: number,
  wrong: number,
  hints: number,
  timeLeft: number,
  totalTime: number
): number {
  const config = GAME_SCORE_CONFIGS[gameType] || GAME_SCORE_CONFIGS.quiz;
  
  return calculateScore({
    correct,
    wrong,
    hints,
    baseUnit: config.baseUnit,
    timeLeft,
    totalTime,
    k: config.timeWeight,
    w: config.wrongPenalty,
    h: config.hintPenalty
  });
}

/**
 * Tính điểm với advanced settings tùy chỉnh
 */
export function calculateAdvancedScore(
  gameType: string,
  correct: number,
  wrong: number,
  hints: number,
  timeLeft: number,
  totalTime: number,
  advancedSettings?: {
    timeBonus?: boolean;
    negativeMarking?: boolean;
    wrongPenalty?: number;
    hintPenalty?: number;
    timeWeight?: number;
    bonusTime?: number;
    comboBonus?: boolean;
  }
): number {
  const config = GAME_SCORE_CONFIGS[gameType] || GAME_SCORE_CONFIGS.quiz;
  
  // Apply advanced settings overrides
  const timeWeight = advancedSettings?.timeBonus ? 
    (advancedSettings?.timeWeight || config.timeWeight) : 0;
  
  const wrongPenalty = advancedSettings?.negativeMarking ? 
    (advancedSettings?.wrongPenalty || config.wrongPenalty) : 0;
    
  const hintPenalty = advancedSettings?.hintPenalty || config.hintPenalty;
  
  return calculateScore({
    correct,
    wrong,
    hints,
    baseUnit: config.baseUnit,
    timeLeft,
    totalTime,
    k: timeWeight,
    w: wrongPenalty,
    h: hintPenalty
  });
}