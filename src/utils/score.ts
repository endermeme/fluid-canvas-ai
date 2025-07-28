// Utility for computing leaderboard score across mini-games
// --------------------------------------------------------
// Each game passes its own stats and weighting factors.

export interface ScoreStats {
  /** Number of correct answers / matches / words found */
  correct: number;
  /** Number of wrong answers / mistakes */
  wrong: number;
  /** Number of hints or skips used */
  hints: number;
  /** Base point for each correct unit (usually 1, can be 2 for Memory) */
  baseUnit: number;
  /** Seconds left when game ends */
  timeLeft: number;
  /** Total seconds given at game start */
  totalTime: number;
  /** Time bonus weight (0-1) */
  k: number;
  /** Penalty per wrong unit */
  w: number;
  /** Penalty per hint */
  h: number;
}

/**
 * Calculate final score for leaderboard.
 * Raw score scaled ×100 to spread range (0-1000 typical).
 */
export function calculateScore(stats: ScoreStats): number {
  const {
    correct,
    wrong,
    hints,
    baseUnit,
    timeLeft,
    totalTime,
    k,
    w,
    h,
  } = stats;

  const base = correct * baseUnit;
  const safeTotal = Math.max(totalTime, 1); // avoid div/0
  const timeBonus = k * (timeLeft / safeTotal) * base;
  const wrongPenalty = w * wrong;
  const hintPenalty = h * hints;

  const raw = base + timeBonus - wrongPenalty - hintPenalty;
  // Multiply by 100 then round to int for nicer leaderboard granularity
  return Math.max(0, Math.round(raw * 100));
}

export default calculateScore;
