import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Sliders, Quote, Sparkles, CheckCircle2, Shield } from 'lucide-react';
import { DailyRecord, Habit, DayHabitSnapshot, MotivationQuote } from '../../types';
import { DailyProgressCard } from '../DailyProgressCard';
import { HabitCard } from '../HabitCard';

interface TodayTabProps {
  record: DailyRecord;
  habits: Habit[];
  quote: MotivationQuote;
  onToggleHabit: (habitId: string) => void;
  onOpenCreateHabit: () => void;
  onNavigateToManage: () => void;
}

export const TodayTab: React.FC<TodayTabProps> = ({
  record,
  habits,
  quote,
  onToggleHabit,
  onOpenCreateHabit,
  onNavigateToManage,
}) => {
  const activeHabitsMap = new Map<string, Habit>(habits.map((h) => [h.id, h]));
  const completedCount = record.completedCount;
  const totalHabits = record.totalHabits;
  const completionRate = record.completionRate;
  const isPerfect = record.isPerfect;

  return (
    <div className="space-y-5 pb-24">
      {/* Daily Motivation Quote */}
      <div className="relative overflow-hidden rounded-2xl bg-[#0C121F] border border-slate-800/80 p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <Quote className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-semibold text-slate-200 italic tracking-tight">
              "{quote.quote}"
            </p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">
                — {quote.author}
              </span>
              <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-slate-800 text-cyan-400 border border-slate-700/60">
                {quote.theme}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Progress Card */}
      <DailyProgressCard
        completedCount={completedCount}
        totalHabits={totalHabits}
        completionRate={completionRate}
        isPerfect={isPerfect}
      />

      {/* Today's Mission Header */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-4 bg-cyan-400 rounded-full" />
          <h2 className="text-sm uppercase tracking-widest font-black text-white font-display">
            Today's Mission
          </h2>
          <span className="text-xs text-slate-300 font-mono-num">
            ({completedCount}/{totalHabits})
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onNavigateToManage}
            className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-300 hover:border-slate-700 transition-colors"
            title="Manage Habits"
          >
            <Sliders className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenCreateHabit}
            className="px-2.5 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-bold flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* Routine Items List */}
      {record.habits.length === 0 ? (
        <div className="p-8 text-center rounded-2xl bg-[#0D1322] border border-dashed border-slate-800 space-y-3">
          <Shield className="w-8 h-8 text-slate-600 mx-auto" />
          <div>
            <h3 className="text-sm font-bold text-white">No active habits for today</h3>
            <p className="text-xs text-slate-400 mt-1">
              Customize your Winter Arc routine to start tracking your daily missions.
            </p>
          </div>
          <button
            onClick={onOpenCreateHabit}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-900/20"
          >
            Create First Habit
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          <AnimatePresence mode="popLayout">
            {record.habits.map((habitSnapshot) => {
              const baseHabit = activeHabitsMap.get(habitSnapshot.id);
              return (
                <HabitCard
                  key={habitSnapshot.id}
                  habit={habitSnapshot}
                  onToggle={onToggleHabit}
                  target={baseHabit?.target}
                />
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
