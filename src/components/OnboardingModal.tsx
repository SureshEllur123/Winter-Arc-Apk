import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Flame, Shield, Check, ArrowRight, Sparkles } from 'lucide-react';
import { Habit } from '../types';
import { DEFAULT_HABITS } from '../data/defaultHabits';

interface OnboardingModalProps {
  onComplete: (selectedHabits: Habit[]) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onComplete }) => {
  const [habits, setHabits] = useState<Habit[]>(DEFAULT_HABITS);

  const toggleHabit = (id: string) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, isActive: !h.isActive } : h))
    );
  };

  const handleStart = () => {
    onComplete(habits);
  };

  const activeCount = habits.filter((h) => h.isActive).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#05080F]/95 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-lg my-auto rounded-3xl bg-gradient-to-b from-[#101726] to-[#0A0E1A] border border-slate-800 p-6 sm:p-8 shadow-2xl text-left"
      >
        {/* Header Badge & Title */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-extrabold uppercase tracking-widest font-display">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            The Winter Arc Initiation
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-sans">
            Welcome to your Winter Arc.
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            90 Days of cold focus, daily non-negotiables, and total transformation. 
            All stored 100% offline on your device.
          </p>
        </div>

        {/* Selected Routine Counter */}
        <div className="flex items-center justify-between px-2 mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Select Your Starting Routines ({activeCount} Active)
          </span>
          <span className="text-[11px] text-cyan-400 font-semibold">
            Tap to toggle
          </span>
        </div>

        {/* Habits Checklist Grid */}
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {habits.map((habit) => {
            const isSelected = habit.isActive;
            return (
              <div
                key={habit.id}
                onClick={() => toggleHabit(habit.id)}
                className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#131D30] border-cyan-500/40 text-white shadow-sm'
                    : 'bg-slate-900/40 border-slate-800/80 text-slate-500 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="text-lg">{habit.icon}</span>
                  <div className="truncate">
                    <div className="text-xs font-bold truncate">{habit.name}</div>
                    {habit.target && (
                      <div className="text-[10px] text-slate-400">{habit.target}</div>
                    )}
                  </div>
                </div>

                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                    isSelected
                      ? 'bg-cyan-500 border-cyan-400 text-slate-950'
                      : 'border-slate-700 bg-slate-900'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3.5]" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 space-y-2">
          <button
            onClick={handleStart}
            disabled={activeCount === 0}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm uppercase tracking-wider shadow-xl shadow-cyan-900/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <span>Lock In & Begin Today</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>

          <p className="text-[11px] text-center text-slate-400">
            You can customize, reorder, or add habits anytime in Settings.
          </p>
        </div>
      </motion.div>
    </div>
  );
};
