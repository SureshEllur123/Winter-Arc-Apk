import React from 'react';
import { motion } from 'motion/react';
import {
  Flame,
  Trophy,
  CheckCircle2,
  Percent,
  TrendingUp,
  Award,
  Zap,
  Target,
  Shield,
  Lock,
} from 'lucide-react';
import { StreakStats, DailyRecord } from '../../types';
import { BADGES } from '../../data/badges';
import { formatDayOfWeek, formatDateShort } from '../../services/storage';

interface StatsTabProps {
  stats: StreakStats;
  records: Record<string, DailyRecord>;
  streakThresholdPercent: number;
}

export const StatsTab: React.FC<StatsTabProps> = ({
  stats,
  records,
  streakThresholdPercent,
}) => {
  // Generate last 7 days chart data
  const last7Days = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${day}`;
    const rec = records[dateStr];

    last7Days.push({
      dateStr,
      dayName: formatDayOfWeek(dateStr),
      shortDate: formatDateShort(dateStr),
      rate: rec ? rec.completionRate : 0,
      isPerfect: rec?.isPerfect || false,
    });
  }

  return (
    <div className="space-y-6 pb-24 text-left">
      {/* 4 Core Hero Metric Cards in 2x2 Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Current Streak */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#121B2B] to-[#0D1422] border border-amber-500/30 shadow-lg glow-flame">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
              Current Streak
            </span>
            <Flame className="w-5 h-5 text-orange-400 animate-pulse" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-white font-mono-num">
              {stats.currentStreak}
            </span>
            <span className="text-xs font-semibold text-slate-400">Days</span>
          </div>
          <div className="mt-1 text-[11px] text-amber-200/80">
            {stats.currentStreak > 0 ? 'Locked in & active' : 'Start streak today'}
          </div>
        </div>

        {/* Best Streak */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#121B2B] to-[#0D1422] border border-cyan-500/30 shadow-lg glow-ice">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-300">
              Best Streak
            </span>
            <Trophy className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-white font-mono-num">
              {stats.bestStreak}
            </span>
            <span className="text-xs font-semibold text-slate-400">Days</span>
          </div>
          <div className="mt-1 text-[11px] text-cyan-200/80">All-time record</div>
        </div>

        {/* Perfect Days */}
        <div className="p-4 rounded-2xl bg-[#0F1626] border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Perfect Days
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-white font-mono-num">
              {stats.perfectDaysCount}
            </span>
            <span className="text-xs font-semibold text-slate-500">Days</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400">100% completions</div>
        </div>

        {/* Completion Rate */}
        <div className="p-4 rounded-2xl bg-[#0F1626] border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Avg Execution
            </span>
            <Percent className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-white font-mono-num">
              {stats.averageCompletionRate}
            </span>
            <span className="text-xs font-semibold text-slate-500">%</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400">All routines combined</div>
        </div>
      </div>

      {/* Secondary Stats Row */}
      <div className="p-4 rounded-2xl bg-[#0F1626] border border-slate-800 flex items-center justify-around text-center">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Habits Checked</span>
          <div className="text-xl font-bold text-white font-mono-num mt-0.5">
            {stats.totalHabitsDone}
          </div>
        </div>
        <div className="h-8 w-px bg-slate-800" />
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400">Days Tracked</span>
          <div className="text-xl font-bold text-white font-mono-num mt-0.5">
            {stats.totalRecordedDays}
          </div>
        </div>
        <div className="h-8 w-px bg-slate-800" />
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400">Target Benchmark</span>
          <div className="text-xl font-bold text-cyan-400 font-mono-num mt-0.5">
            {streakThresholdPercent}%
          </div>
        </div>
      </div>

      {/* 7-Day Consistency Visual Chart */}
      <div className="p-5 rounded-3xl bg-[#0F1626] border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs uppercase tracking-widest font-bold text-white font-display">
              Last 7 Days Execution
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">Consistency Trend</span>
        </div>

        {/* Vertical Bars */}
        <div className="grid grid-cols-7 gap-2 items-end h-32 pt-2 pb-1">
          {last7Days.map((d) => (
            <div key={d.dateStr} className="flex flex-col items-center h-full justify-end group">
              <div className="text-[10px] font-mono-num text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                {d.rate}%
              </div>
              <div className="w-full max-w-[28px] bg-slate-900 rounded-t-lg overflow-hidden flex flex-col justify-end h-20 border border-slate-800">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${d.rate}%` }}
                  transition={{ duration: 0.5 }}
                  className={`w-full rounded-t-sm ${
                    d.isPerfect
                      ? 'bg-gradient-to-t from-amber-500 to-orange-400'
                      : d.rate >= streakThresholdPercent
                      ? 'bg-gradient-to-t from-emerald-500 to-cyan-400'
                      : d.rate > 0
                      ? 'bg-cyan-600/80'
                      : 'bg-transparent'
                  }`}
                />
              </div>
              <span className="text-[11px] font-bold text-slate-400 mt-2">{d.dayName}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Badges & Milestones */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs uppercase tracking-widest font-bold text-white font-display">
              Milestones & Badges
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {BADGES.map((badge) => {
            const isUnlocked = badge.condition(stats, stats.totalRecordedDays);
            return (
              <div
                key={badge.id}
                className={`p-3.5 rounded-2xl border flex items-start gap-3 transition-all ${
                  isUnlocked
                    ? 'bg-[#111A2C] border-amber-500/30 text-white shadow-sm'
                    : 'bg-slate-900/40 border-slate-800/80 text-slate-500 opacity-60'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${
                    isUnlocked
                      ? 'bg-amber-950/60 border border-amber-500/40 text-amber-300'
                      : 'bg-slate-900 border border-slate-800'
                  }`}
                >
                  {isUnlocked ? badge.icon : <Lock className="w-4 h-4 text-slate-600" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-white truncate">{badge.title}</h4>
                    {isUnlocked && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                        Unlocked
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">
                    {badge.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
