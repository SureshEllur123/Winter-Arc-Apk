import React from 'react';
import { Flame, Volume2, VolumeX, Shield, Sparkles } from 'lucide-react';
import { formatDateDisplay } from '../services/storage';

interface HeaderProps {
  currentDateStr: string;
  currentStreak: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenManage?: () => void;
  dayCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentDateStr,
  currentStreak,
  soundEnabled,
  onToggleSound,
  dayCount = 1,
}) => {
  const formattedDate = formatDateDisplay(currentDateStr);

  return (
    <header className="px-5 pt-4 pb-3 border-b border-slate-800/80 bg-[#070A11]/90 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Brand & Date */}
        <div>
          <div className="flex items-center gap-2">
            <span className="font-display tracking-widest text-xs font-bold text-cyan-400 uppercase flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              Winter Arc
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-800/90 text-slate-300 border border-slate-700/60">
              Day {dayCount} of 90
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mt-0.5 font-sans">
            {formattedDate}
          </h1>
        </div>

        {/* Right Controls: Streak & Sound */}
        <div className="flex items-center gap-2">
          {/* Streak Badge */}
          <div 
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-bold text-xs transition-all ${
              currentStreak > 0 
                ? 'bg-amber-950/40 border-amber-500/40 text-amber-300 glow-flame' 
                : 'bg-slate-900/60 border-slate-800 text-slate-400'
            }`}
            title={`${currentStreak} Days Current Streak`}
          >
            <Flame className={`w-4 h-4 ${currentStreak > 0 ? 'text-orange-400 animate-pulse' : 'text-slate-500'}`} />
            <span className="font-mono-num">{currentStreak}</span>
            <span className="text-[10px] uppercase tracking-wider text-slate-400">Streak</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            aria-label={soundEnabled ? "Mute audio" : "Unmute audio"}
            className="w-8 h-8 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-cyan-300 hover:border-cyan-500/40 transition-colors"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-cyan-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
