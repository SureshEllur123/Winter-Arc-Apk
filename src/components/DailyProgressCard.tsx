import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Flame, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DailyProgressCardProps {
  completedCount: number;
  totalHabits: number;
  completionRate: number;
  isPerfect: boolean;
  onFireCelebration?: () => void;
}

export const DailyProgressCard: React.FC<DailyProgressCardProps> = ({
  completedCount,
  totalHabits,
  completionRate,
  isPerfect,
}) => {
  const hasTriggeredConfettiRef = useRef(false);

  useEffect(() => {
    if (isPerfect && !hasTriggeredConfettiRef.current && totalHabits > 0) {
      hasTriggeredConfettiRef.current = true;
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#38bdf8', '#f97316', '#fbbf24', '#ffffff', '#06b6d4'],
          disableForReducedMotion: true,
        });
      } catch {
        // Safe fallback
      }
    } else if (!isPerfect) {
      hasTriggeredConfettiRef.current = false;
    }
  }, [isPerfect, totalHabits]);

  // Determine encouragement message based on progress
  const getEncouragement = () => {
    if (totalHabits === 0) return 'Add your habits to begin today.';
    if (completionRate === 100) return 'Flawless execution. You conquered today.';
    if (completionRate >= 75) return 'Almost there. Finish the day strong.';
    if (completionRate >= 50) return 'Halfway locked in. Keep pushing.';
    if (completionRate > 0) return 'Momentum started. Outwork yesterday.';
    return "Today's Mission begins now. Execute.";
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#111927] to-[#0D131F] border border-slate-800/80 p-5 shadow-xl">
      {/* Background ambient lighting */}
      <div 
        className={`absolute -top-12 -right-12 w-36 h-36 rounded-full blur-3xl transition-opacity duration-700 pointer-events-none ${
          isPerfect ? 'bg-orange-500/20 opacity-100' : 'bg-cyan-500/10 opacity-60'
        }`} 
      />

      <div className="relative z-10">
        {/* Header row with Title & Fraction */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isPerfect ? 'bg-orange-400 animate-ping' : 'bg-cyan-400'}`} />
            <span className="text-xs uppercase tracking-widest font-bold text-slate-400">
              Today's Progress
            </span>
          </div>

          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-white font-mono-num">
              {completedCount}
            </span>
            <span className="text-sm font-semibold text-slate-500 font-mono-num">
              / {totalHabits}
            </span>
            <span className="text-xs font-bold text-cyan-400 font-mono-num ml-1">
              ({completionRate}%)
            </span>
          </div>
        </div>

        {/* Progress Bar Container */}
        <div className="relative h-4 w-full bg-slate-900/90 rounded-full overflow-hidden p-0.5 border border-slate-800/90">
          <motion.div
            className={`h-full rounded-full transition-all duration-500 ${
              isPerfect
                ? 'bg-gradient-to-r from-cyan-400 via-amber-400 to-orange-500'
                : 'bg-gradient-to-r from-cyan-500 to-blue-500'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.max(0, Math.min(100, completionRate))}%` }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          />
        </div>

        {/* Dynamic Perfect Day or Motivation Banner */}
        <div className="mt-3.5 pt-3 border-t border-slate-800/60 flex items-center justify-between">
          <AnimatePresence mode="wait">
            {isPerfect ? (
              <motion.div
                key="perfect"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="flex items-center gap-2 text-orange-300 w-full"
              >
                <div className="w-7 h-7 rounded-lg bg-orange-500/20 border border-orange-500/40 flex items-center justify-center shrink-0">
                  <Flame className="w-4 h-4 text-orange-400" />
                </div>
                <div>
                  <div className="text-xs font-black tracking-wider uppercase text-amber-300 flex items-center gap-1.5 font-display">
                    🔥 PERFECT DAY
                  </div>
                  <div className="text-[11px] text-slate-300">
                    You completed today's Winter Arc.
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="in-progress"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="flex items-center justify-between w-full"
              >
                <span className="text-xs text-slate-300 font-medium">
                  {getEncouragement()}
                </span>
                {totalHabits > 0 && (
                  <span className="text-[11px] font-bold text-slate-400 font-mono-num">
                    {totalHabits - completedCount} left
                  </span>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
