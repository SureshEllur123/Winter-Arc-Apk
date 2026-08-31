import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  Flame,
  Calendar as CalendarIcon,
  CheckCircle2,
  ListFilter,
} from 'lucide-react';
import { DailyRecord } from '../../types';
import { formatDateDisplay, formatDateShort, getTodayDateString } from '../../services/storage';

interface HistoryTabProps {
  records: Record<string, DailyRecord>;
  onSelectDate: (dateStr: string) => void;
  streakThresholdPercent: number;
}

export const HistoryTab: React.FC<HistoryTabProps> = ({
  records,
  onSelectDate,
  streakThresholdPercent,
}) => {
  const todayStr = getTodayDateString();
  const [currentMonthDate, setCurrentMonthDate] = useState(() => new Date());

  // Month navigation
  const prevMonth = () => {
    setCurrentMonthDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonthDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  };

  const currentYear = currentMonthDate.getFullYear();
  const currentMonthIndex = currentMonthDate.getMonth();
  const monthName = currentMonthDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  // Calculate calendar grid days
  const firstDayOfMonth = new Date(currentYear, currentMonthIndex, 1);
  const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 (Sun) to 6 (Sat)
  const daysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();

  const calendarDays = [];
  // Empty slots before 1st of month
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push({ dayNumber: null, dateStr: '' });
  }
  // Days of current month
  for (let d = 1; d <= daysInMonth; d++) {
    const mStr = String(currentMonthIndex + 1).padStart(2, '0');
    const dStr = String(d).padStart(2, '0');
    const fullDateStr = `${currentYear}-${mStr}-${dStr}`;
    calendarDays.push({ dayNumber: d, dateStr: fullDateStr });
  }

  // Get past history list (sorted descending)
  const sortedDates = Object.keys(records)
    .sort()
    .reverse()
    .filter((d) => d <= todayStr);

  return (
    <div className="space-y-6 pb-24 text-left">
      {/* Calendar Section */}
      <div className="rounded-3xl bg-[#0F1626] border border-slate-800 p-5 shadow-xl">
        {/* Month Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-cyan-400" />
            <h2 className="text-base font-bold text-white tracking-tight">{monthName}</h2>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={prevMonth}
              className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextMonth}
              className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((dw) => (
            <span key={dw} className="text-[11px] font-bold text-slate-500 uppercase">
              {dw}
            </span>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1.5">
          {calendarDays.map((item, idx) => {
            if (!item.dayNumber) {
              return <div key={`empty-${idx}`} className="h-10 rounded-xl" />;
            }

            const isToday = item.dateStr === todayStr;
            const isFuture = item.dateStr > todayStr;
            const record = records[item.dateStr];
            const isPerfect = record?.isPerfect;
            const isThresholdMet =
              record && record.completionRate >= streakThresholdPercent && record.completedCount > 0;
            const isPartial =
              record && record.completionRate > 0 && !isThresholdMet;
            const isMissed =
              record && record.completionRate === 0 && !isFuture;

            // Status indicator color
            let statusDot = 'bg-slate-800';
            let bgClass = 'bg-slate-900/50 hover:bg-slate-800/80 border-slate-800';

            if (isFuture) {
              statusDot = 'bg-slate-700/40';
              bgClass = 'bg-slate-950/30 border-transparent text-slate-600 opacity-60';
            } else if (isPerfect) {
              statusDot = 'bg-amber-400 shadow-sm shadow-amber-400';
              bgClass = 'bg-amber-950/20 border-amber-500/30 text-amber-200';
            } else if (isThresholdMet) {
              statusDot = 'bg-emerald-400 shadow-sm shadow-emerald-400';
              bgClass = 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200';
            } else if (isPartial) {
              statusDot = 'bg-yellow-400';
              bgClass = 'bg-yellow-950/20 border-yellow-500/30 text-yellow-200';
            } else if (isMissed) {
              statusDot = 'bg-rose-500';
              bgClass = 'bg-rose-950/10 border-rose-500/20 text-rose-300';
            }

            if (isToday) {
              bgClass += ' ring-2 ring-cyan-400/80';
            }

            return (
              <button
                key={item.dateStr}
                onClick={() => onSelectDate(item.dateStr)}
                disabled={isFuture}
                className={`h-11 rounded-xl flex flex-col items-center justify-center p-1 border transition-all ${bgClass}`}
              >
                <span className="text-xs font-bold font-mono-num leading-none">
                  {item.dayNumber}
                </span>
                <div className="mt-1 flex items-center justify-center">
                  {isPerfect ? (
                    <Flame className="w-2.5 h-2.5 text-orange-400" />
                  ) : (
                    <div className={`w-1.5 h-1.5 rounded-full ${statusDot}`} />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Perfect (100%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-yellow-400" />
            <span>Partial</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>Missed</span>
          </div>
        </div>
      </div>

      {/* History Log List */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-4 bg-cyan-400 rounded-full" />
            <h3 className="text-sm uppercase tracking-widest font-black text-white font-display">
              Previous Days Log
            </h3>
          </div>
          <span className="text-xs text-slate-300 font-mono-num">
            {sortedDates.length} recorded
          </span>
        </div>

        {sortedDates.length === 0 ? (
          <div className="p-6 text-center rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 text-slate-500 text-xs">
            No past history records yet. Keep tracking daily!
          </div>
        ) : (
          <div className="space-y-2.5">
            {sortedDates.map((dateStr) => {
              const record = records[dateStr];
              const isToday = dateStr === todayStr;
              const formatted = formatDateDisplay(dateStr);
              const completed = record.completedCount;
              const total = record.totalHabits;
              const rate = record.completionRate;
              const isPerfect = record.isPerfect;

              return (
                <div
                  key={dateStr}
                  onClick={() => onSelectDate(dateStr)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer hover:border-slate-700 ${
                    isToday
                      ? 'bg-[#10192A] border-cyan-500/40 shadow-sm'
                      : 'bg-[#0E1524] border-slate-800/90'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white tracking-tight">
                          {formatted}
                        </span>
                        {isToday && (
                          <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                            Today
                          </span>
                        )}
                        {isPerfect && (
                          <span className="text-[10px] uppercase font-extrabold tracking-wider px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-700/50 flex items-center gap-1 font-display">
                            <Flame className="w-3 h-3 text-orange-400" /> Perfect Day
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-baseline gap-1 text-xs font-bold text-white font-mono-num">
                      <span>{completed}</span>
                      <span className="text-slate-500">/ {total}</span>
                      <span className="text-cyan-400 ml-1">({rate}%)</span>
                    </div>
                  </div>

                  {/* Visual Progress Line */}
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        isPerfect
                          ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                          : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                      }`}
                      style={{ width: `${rate}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
