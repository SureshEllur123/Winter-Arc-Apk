import React from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import { DayHabitSnapshot } from '../types';

interface HabitCardProps {
  habit: DayHabitSnapshot;
  onToggle: (id: string) => void;
  target?: string;
}

export const HabitCard: React.FC<HabitCardProps> = ({ habit, onToggle, target }) => {
  const isChecked = habit.completed;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileTap={{ scale: 0.985 }}
      onClick={() => onToggle(habit.id)}
      className={`group relative flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
        isChecked
          ? 'bg-[#0B111D]/80 border-cyan-500/30 text-slate-400 shadow-sm'
          : 'bg-[#101726] border-slate-800/90 hover:border-slate-700 text-slate-100 hover:bg-[#131C2E] shadow-md'
      }`}
    >
      {/* Left: Icon & Details */}
      <div className="flex items-center gap-3.5 flex-1 min-w-0 pr-3">
        {/* Habit Icon Emoji */}
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 transition-transform ${
            isChecked
              ? 'bg-slate-900/90 grayscale-[30%] opacity-80'
              : 'bg-slate-800/90 border border-slate-700/60 shadow-inner group-hover:scale-105'
          }`}
        >
          <span>{habit.icon}</span>
        </div>

        {/* Text Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3
              className={`text-[15px] font-bold tracking-tight truncate transition-colors ${
                isChecked ? 'line-through text-slate-400 font-medium' : 'text-white'
              }`}
            >
              {habit.name}
            </h3>
            {target && (
              <span className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md shrink-0 ${
                isChecked 
                  ? 'bg-slate-900 text-slate-500' 
                  : 'bg-cyan-950/70 text-cyan-300 border border-cyan-800/40'
              }`}>
                {target}
              </span>
            )}
          </div>

          {habit.description && (
            <p
              className={`text-xs mt-0.5 line-clamp-1 transition-colors ${
                isChecked ? 'text-slate-400' : 'text-slate-400'
              }`}
            >
              {habit.description}
            </p>
          )}
        </div>
      </div>

      {/* Right: Large Modern Tactile Checkbox */}
      <div className="shrink-0 pl-1">
        <button
          type="button"
          aria-label={isChecked ? `Mark ${habit.name} incomplete` : `Mark ${habit.name} complete`}
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 border-2 ${
            isChecked
              ? 'bg-gradient-to-br from-cyan-400 to-blue-500 border-cyan-400 shadow-md shadow-cyan-500/20'
              : 'bg-slate-900/90 border-slate-700 hover:border-cyan-400/60'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onToggle(habit.id);
          }}
        >
          <motion.div
            initial={false}
            animate={{ scale: isChecked ? 1 : 0, opacity: isChecked ? 1 : 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
          >
            <Check className="w-5 h-5 text-slate-950 stroke-[3.5]" />
          </motion.div>
        </button>
      </div>
    </motion.div>
  );
};
