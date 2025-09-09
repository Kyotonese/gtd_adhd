import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}分`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}時間${remainingMinutes}分` : `${hours}時間`;
}

export function getDifficultyColor(difficulty: 1 | 2 | 3 | 4 | 5): string {
  const colors = {
    1: 'text-green-600 bg-green-50 border-green-200',
    2: 'text-blue-600 bg-blue-50 border-blue-200',
    3: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    4: 'text-orange-600 bg-orange-50 border-orange-200',
    5: 'text-red-600 bg-red-50 border-red-200',
  };
  return colors[difficulty];
}

export function getDifficultyLabel(difficulty: 1 | 2 | 3 | 4 | 5): string {
  const labels = {
    1: '超簡単',
    2: '簡単',
    3: '普通',
    4: '難しい',
    5: '超難しい',
  };
  return labels[difficulty];
}

export function getEnergyLevelColor(level: 'low' | 'medium' | 'high'): string {
  const colors = {
    low: 'text-gray-600 bg-gray-50',
    medium: 'text-blue-600 bg-blue-50',
    high: 'text-green-600 bg-green-50',
  };
  return colors[level];
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function getCurrentJapaneseTime(): Date {
  return new Date();
}

export function isTaskDoableNow(task: any, userState: any): boolean {
  // エネルギーレベルチェック
  if (task.energyLevel === 'high' && userState.currentEnergyLevel === 'low') {
    return false;
  }
  
  // 推定時間チェック
  if (task.estimatedTime && task.estimatedTime > userState.availableTime) {
    return false;
  }
  
  // コンテキストチェック
  if (task.context && task.context.length > 0) {
    const hasMatchingContext = task.context.some((ctx: string) => 
      userState.currentContext.includes(ctx)
    );
    if (!hasMatchingContext) {
      return false;
    }
  }
  
  return true;
}