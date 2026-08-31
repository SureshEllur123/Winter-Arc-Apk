import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Flame, CheckCircle2, Calendar, Check, Circle } from 'lucide-react';
import { DailyRecord } from '../types';
import { formatDateDisplay } from '../services/storage';

interface DayDetailModalProps {
  isOpen: boolean;
  record: DailyRecord | null;
  dateStr: string;
  onClose: () => void;
  onToggleHabit?: (habitId: string) => void;
}

export const DayDetailModal: React.FC<DayDetailModalProps> = ({
  isOpen,
  record,
  dateStr,
  onClose,
  onToggleHabit,
}) => {
  if (!isOpen || !dateStr) return null;

  const formattedDate = formatDateDisplay(dateStr);
  const habits = record?.habits || [];
  const completedCount = record?.completedCount || 0;
  const totalHabits = record?.totalHabits || habits.length;
  const completionRate = record?.completionRate || 0;
  const isPerfect = record?.isPerfect || false;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md max-h-[85vh] flex flex-col rounded-3xl bg-[#0F1626] border border-slate-800 shadow-2xl z-10 overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-800/80 bg-[#121A2D] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                  Historical Record
                </span>
                <h3 className="text-base font-bold text-white tracking-tight leading-tight">
                  {formattedDate}
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body stats & snapshot checklist */}
          <div className="p-6 overflow-y-auto space-y-4">
            {/* Progress Summary Card */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-bold text-slate-300">Execution Score</div>
                <div className="flex items-baseline gap-1 text-sm font-bold text-white font-mono-num">
                  <span>{completedCount}</span>
                  <span className="text-slate-500">/ {totalHabits}</span>
                  <span className="text-cyan-400 ml-1">({completionRate}%)</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    isPerfect
                      ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                      : 'bg-gradient-to-r from-cyan-400 to-blue-500'
                  }`}
                  style={{ width: `${completionRate}%` }}
                />
              </div>

              {isPerfect && (
                <div className="mt-3 flex items-center gap-2 text-xs font-black text-amber-300 font-display">
                  <Flame className="w-4 h-4 text-orange-400" />
                  PERFECT DAY SNAPSHOT
                </div>
              )}
            </div>

            {/* Habit Items Snapshot */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                Routines Recorded on this Day ({habits.length})
              </div>

              {habits.length === 0 ? (
                <div className="p-6 text-center rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 text-slate-500 text-xs">
                  No routine logs recorded on this date.
                </div>
              ) : (
                <div className="space-y-2">
                  {habits.map((habit) => {
                    const isDone = habit.completed;
                    return (
                      <div
                        key={habit.id}
                        onClick={() => onToggleHabit && onToggleHabit(habit.id)}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
                          onToggleHabit ? 'cursor-pointer hover:border-slate-600' : ''
                        } ${
                          isDone
                            ? 'bg-cyan-950/20 border-cyan-500/20 text-slate-200'
                            : 'bg-slate-900/60 border-slate-800/80 text-slate-400'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <span className="text-base">{habit.icon}</span>
                          <span
                            className={`text-xs font-semibold truncate ${
                              isDone ? 'text-white' : 'text-slate-400'
                            }`}
                          >
                            {habit.name}
                          </span>
                        </div>

                        <div className="shrink-0 pl-2">
                          {isDone ? (
                            <span className="flex items-center gap-1 text-[11px] font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded-md border border-cyan-800/40">
                              <Check className="w-3 h-3 stroke-[3]" /> Done
                            </span>
                          ) : (
                            <span className="text-[11px] font-medium text-slate-500 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
                              Missed
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-slate-800/80 bg-[#121A2D] flex items-center justify-between text-xs text-slate-400">
            <span>Snapshot immutable to routine edits</span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
