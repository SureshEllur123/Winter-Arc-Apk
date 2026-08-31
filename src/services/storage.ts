import { Habit, DailyRecord, DayHabitSnapshot, StreakStats, AppSettings } from '../types';
import { DEFAULT_HABITS } from '../data/defaultHabits';

const STORAGE_KEYS = {
  HABITS: 'winter_arc_habits_v1',
  RECORDS: 'winter_arc_records_v1',
  SETTINGS: 'winter_arc_settings_v1',
};

export const DEFAULT_SETTINGS: AppSettings = {
  hasCompletedOnboarding: false,
  streakThresholdPercent: 100, // 100% for full Winter Arc discipline, can be adjusted to 80%
  soundEnabled: true,
  hapticEnabled: true,
  theme: 'obsidian',
  winterArcStartDate: getTodayDateString(),
  targetDays: 90,
};

export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDateDisplay(dateStr: string): string {
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function formatDateShort(dateStr: string): string {
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function formatDayOfWeek(dateStr: string): string {
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  } catch {
    return '';
  }
}

// Storage Operations
export function loadHabits(): Habit[] {
  if (typeof window === 'undefined') return DEFAULT_HABITS;
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.HABITS);
    if (!stored) {
      saveHabits(DEFAULT_HABITS);
      return DEFAULT_HABITS;
    }
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.sort((a, b) => a.order - b.order);
    }
    return DEFAULT_HABITS;
  } catch {
    return DEFAULT_HABITS;
  }
}

export function saveHabits(habits: Habit[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
  } catch (err) {
    console.error('Failed to save habits to local storage:', err);
  }
}

export function loadSettings(): AppSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!stored) {
      return DEFAULT_SETTINGS;
    }
    return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings:', err);
  }
}

export function loadAllRecords(): Record<string, DailyRecord> {
  if (typeof window === 'undefined') return {};
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.RECORDS);
    if (!stored) return {};
    return JSON.parse(stored);
  } catch {
    return {};
  }
}

export function saveAllRecords(records: Record<string, DailyRecord>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
  } catch (err) {
    console.error('Failed to save records:', err);
  }
}

/**
 * Gets or initializes the record for a given date.
 * If today has no record yet, snapshots the current active habits list.
 */
export function getOrCreateRecordForDate(dateStr: string, currentHabits?: Habit[], thresholdPercent: number = 100): DailyRecord {
  const records = loadAllRecords();
  const existing = records[dateStr];

  if (existing) {
    // If it's today and active habits were modified (e.g. new habit added), synchronize non-destructively
    const isToday = dateStr === getTodayDateString();
    if (isToday && currentHabits) {
      const activeHabits = currentHabits.filter(h => h.isActive);
      const existingMap = new Map(existing.habits.map(h => [h.id, h]));
      
      const mergedHabits: DayHabitSnapshot[] = activeHabits.map(h => {
        const prev = existingMap.get(h.id);
        return {
          id: h.id,
          name: h.name,
          icon: h.icon,
          description: h.description,
          completed: prev ? prev.completed : false,
          completedAt: prev ? prev.completedAt : undefined,
        };
      });

      const completedCount = mergedHabits.filter(h => h.completed).length;
      const totalHabits = mergedHabits.length;
      const completionRate = totalHabits > 0 ? Math.round((completedCount / totalHabits) * 100) : 0;
      const isPerfect = totalHabits > 0 && completedCount === totalHabits;
      const isCompletedThreshold = completionRate >= thresholdPercent;

      const updatedRecord: DailyRecord = {
        ...existing,
        habits: mergedHabits,
        totalHabits,
        completedCount,
        completionRate,
        isPerfect,
        isCompletedThreshold,
        updatedAt: new Date().toISOString(),
      };

      records[dateStr] = updatedRecord;
      saveAllRecords(records);
      return updatedRecord;
    }
    return existing;
  }

  // Brand new record for this date: snapshot active habits
  const habitsList = currentHabits || loadHabits();
  const activeHabits = habitsList.filter(h => h.isActive);
  const snapshots: DayHabitSnapshot[] = activeHabits.map(h => ({
    id: h.id,
    name: h.name,
    icon: h.icon,
    description: h.description,
    completed: false,
  }));

  const totalHabits = snapshots.length;
  const newRecord: DailyRecord = {
    date: dateStr,
    habits: snapshots,
    totalHabits,
    completedCount: 0,
    completionRate: 0,
    isPerfect: false,
    isCompletedThreshold: false,
    updatedAt: new Date().toISOString(),
  };

  records[dateStr] = newRecord;
  saveAllRecords(records);
  return newRecord;
}

/**
 * Toggle completion of a habit for a given date
 */
export function toggleHabitCompletion(dateStr: string, habitId: string, thresholdPercent: number = 100): DailyRecord {
  const records = loadAllRecords();
  let record = records[dateStr];

  if (!record) {
    record = getOrCreateRecordForDate(dateStr, undefined, thresholdPercent);
  }

  const updatedHabits = record.habits.map(h => {
    if (h.id === habitId) {
      const nextCompleted = !h.completed;
      return {
        ...h,
        completed: nextCompleted,
        completedAt: nextCompleted ? new Date().toISOString() : undefined,
      };
    }
    return h;
  });

  const completedCount = updatedHabits.filter(h => h.completed).length;
  const totalHabits = updatedHabits.length;
  const completionRate = totalHabits > 0 ? Math.round((completedCount / totalHabits) * 100) : 0;
  const isPerfect = totalHabits > 0 && completedCount === totalHabits;
  const isCompletedThreshold = completionRate >= thresholdPercent;

  const updatedRecord: DailyRecord = {
    ...record,
    habits: updatedHabits,
    totalHabits,
    completedCount,
    completionRate,
    isPerfect,
    isCompletedThreshold,
    updatedAt: new Date().toISOString(),
  };

  records[dateStr] = updatedRecord;
  saveAllRecords(records);
  return updatedRecord;
}

/**
 * Compute Streaks & All-time Statistics
 */
export function calculateStreakStats(records: Record<string, DailyRecord>, thresholdPercent: number = 100): StreakStats {
  const dates = Object.keys(records).sort(); // ascending 'YYYY-MM-DD'
  const todayStr = getTodayDateString();

  let totalCompletedDays = 0;
  let totalHabitsDone = 0;
  let perfectDaysCount = 0;
  let totalRateSum = 0;

  for (const date of dates) {
    const rec = records[date];
    totalHabitsDone += rec.completedCount;
    if (rec.isPerfect) perfectDaysCount++;
    if (rec.completionRate >= thresholdPercent && rec.completedCount > 0) {
      totalCompletedDays++;
    }
    totalRateSum += rec.completionRate;
  }

  const totalRecordedDays = dates.length;
  const averageCompletionRate = totalRecordedDays > 0 ? Math.round(totalRateSum / totalRecordedDays) : 0;

  // Compute Current Streak
  let currentStreak = 0;
  const todayRec = records[todayStr];
  const todayMeetsThreshold = todayRec && todayRec.completionRate >= thresholdPercent && todayRec.completedCount > 0;

  // Start checking backwards from today or yesterday
  let checkDate = new Date();
  if (!todayMeetsThreshold) {
    // If today hasn't met threshold yet, see if yesterday maintained the streak
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (true) {
    const y = checkDate.getFullYear();
    const m = String(checkDate.getMonth() + 1).padStart(2, '0');
    const d = String(checkDate.getDate()).padStart(2, '0');
    const dStr = `${y}-${m}-${d}`;

    const rec = records[dStr];
    if (rec && rec.completionRate >= thresholdPercent && rec.completedCount > 0) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  // Compute Best Streak Across All Time
  let bestStreak = 0;
  let tempStreak = 0;

  // Walk day by day from the earliest record to today
  if (dates.length > 0) {
    const [startYear, startMonth, startDay] = dates[0].split('-').map(Number);
    const cursor = new Date(startYear, startMonth - 1, startDay);
    const end = new Date();

    while (cursor <= end) {
      const y = cursor.getFullYear();
      const m = String(cursor.getMonth() + 1).padStart(2, '0');
      const d = String(cursor.getDate()).padStart(2, '0');
      const dStr = `${y}-${m}-${d}`;

      const rec = records[dStr];
      if (rec && rec.completionRate >= thresholdPercent && rec.completedCount > 0) {
        tempStreak++;
        if (tempStreak > bestStreak) bestStreak = tempStreak;
      } else {
        // If cursor is today and today is in progress, do not reset tempStreak if yesterday was a hit
        if (dStr === todayStr && !todayMeetsThreshold) {
          // today in progress
        } else {
          tempStreak = 0;
        }
      }
      cursor.setDate(cursor.getDate() + 1);
    }
  }

  bestStreak = Math.max(bestStreak, currentStreak);

  return {
    currentStreak,
    bestStreak,
    totalCompletedDays,
    totalHabitsDone,
    perfectDaysCount,
    totalRecordedDays,
    averageCompletionRate,
  };
}

/**
 * Reset Today's progress only
 */
export function resetTodayProgress(): DailyRecord {
  const todayStr = getTodayDateString();
  const records = loadAllRecords();
  const currentHabits = loadHabits().filter(h => h.isActive);

  const resetHabits: DayHabitSnapshot[] = currentHabits.map(h => ({
    id: h.id,
    name: h.name,
    icon: h.icon,
    description: h.description,
    completed: false,
  }));

  const newRecord: DailyRecord = {
    date: todayStr,
    habits: resetHabits,
    totalHabits: resetHabits.length,
    completedCount: 0,
    completionRate: 0,
    isPerfect: false,
    isCompletedThreshold: false,
    updatedAt: new Date().toISOString(),
  };

  records[todayStr] = newRecord;
  saveAllRecords(records);
  return newRecord;
}

/**
 * Reset All Data to Initial Factory State
 */
export function resetAllData(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.HABITS);
  localStorage.removeItem(STORAGE_KEYS.RECORDS);
  localStorage.removeItem(STORAGE_KEYS.SETTINGS);
}

/**
 * Export data to a JSON blob for download
 */
export function exportDataAsJSON(): string {
  const data = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    habits: loadHabits(),
    records: loadAllRecords(),
    settings: loadSettings(),
  };
  return JSON.stringify(data, null, 2);
}

/**
 * Import data from a JSON string with schema validation
 */
export function importDataFromJSON(jsonString: string): { success: boolean; message: string } {
  try {
    const data = JSON.parse(jsonString);
    if (!data.habits || !Array.isArray(data.habits) || !data.records) {
      return { success: false, message: 'Invalid backup file structure.' };
    }

    saveHabits(data.habits);
    saveAllRecords(data.records);
    if (data.settings) {
      saveSettings(data.settings);
    }
    return { success: true, message: 'Data imported successfully!' };
  } catch (err) {
    return { success: false, message: 'Failed to parse JSON file: ' + (err instanceof Error ? err.message : 'Unknown error') };
  }
}
