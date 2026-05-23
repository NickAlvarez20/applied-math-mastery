const XP_PER_LEVEL = 500;

export function xpToNextLevel(currentXP: number): number {
  return XP_PER_LEVEL - (currentXP % XP_PER_LEVEL);
}

export function xpProgressPercent(currentXP: number): number {
  return ((currentXP % XP_PER_LEVEL) / XP_PER_LEVEL) * 100;
}

export function levelFromXP(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

export function xpForDifficulty(difficulty: 1 | 2 | 3 | 4 | 5): number {
  const map = { 1: 10, 2: 20, 3: 35, 4: 55, 5: 80 };
  return map[difficulty];
}
