export interface Habit {
  id: string;
  name: string;
  icon: string;
  description?: string;
  category?: 'fitness' | 'mindset' | 'nutrition' | 'discipline' | 'recovery';
  target?: string;
  isActive: boolean;
  order: number;
  createdAt: string;
}

export interface DayHabitSnapshot {
  id: string;
  name: string;
  icon: string;
  description?: string;
  completed: boolean;
  completedAt?: string;
}

export interface DailyRecord {
  date: string; // ISO format 'YYYY-MM-DD'
  habits: DayHabitSnapshot[];
  totalHabits: number;
  completedCount: number;
  completionRate: number; // 0 to 100
  isPerfect: boolean;
  isCompletedThreshold: boolean;
  notes?: string;
  updatedAt: string;
}

export interface StreakStats {
  currentStreak: number;
  bestStreak: number;
  totalCompletedDays: number;
  totalHabitsDone: number;
  perfectDaysCount: number;
  totalRecordedDays: number;
  averageCompletionRate: number;
}

export interface AppSettings {
  hasCompletedOnboarding: boolean;
  streakThresholdPercent: number; // default 100 or 80
  soundEnabled: boolean;
  hapticEnabled: boolean;
  theme: 'obsidian' | 'ice' | 'ember' | 'nordic';
  userName?: string;
  winterArcStartDate: string;
  targetDays: number; // default 90 days (Winter Arc classic)
}

export interface MotivationQuote {
  id: number;
  quote: string;
  author: string;
  theme: 'discipline' | 'grit' | 'consistency' | 'focus';
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  condition: (stats: StreakStats, totalDays: number) => boolean;
}

export type TabType = 'today' | 'history' | 'stats' | 'settings' | 'manage';
