import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Plus, Check } from 'lucide-react';
import { Habit } from '../types';
import { HABIT_ICONS } from '../data/defaultHabits';

interface ManageHabitModalProps {
  isOpen: boolean;
  habitToEdit?: Habit | null;
  onSave: (habitData: Partial<Habit>) => void;
  onClose: () => void;
}

export const ManageHabitModal: React.FC<ManageHabitModalProps> = ({
  isOpen,
  habitToEdit,
  onSave,
  onClose,
}) => {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('🏋️');
  const [target, setTarget] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'fitness' | 'mindset' | 'nutrition' | 'discipline' | 'recovery'>('fitness');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (habitToEdit) {
      setName(habitToEdit.name || '');
      setIcon(habitToEdit.icon || '🏋️');
      setTarget(habitToEdit.target || '');
      setDescription(habitToEdit.description || '');
      setCategory(habitToEdit.category || 'fitness');
      setIsActive(habitToEdit.isActive !== false);
    } else {
      setName('');
      setIcon('🏋️');
      setTarget('');
      setDescription('');
      setCategory('fitness');
      setIsActive(true);
    }
  }, [habitToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      name: name.trim(),
      icon,
      target: target.trim() || undefined,
      description: description.trim() || undefined,
      category,
      isActive,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-md max-h-[90vh] flex flex-col rounded-3xl bg-[#0F1626] border border-slate-800 shadow-2xl z-10 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-[#121A2D]">
              <div className="flex items-center gap-2">
                <span className="text-xl">{icon}</span>
                <h2 className="text-base font-bold text-white tracking-tight">
                  {habitToEdit ? 'Edit Habit' : 'Create Winter Arc Habit'}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Form */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-left">
              {/* Habit Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Habit Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cold Shower, 100 Pushups, Read 30m"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Icon Picker */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Select Icon
                </label>
                <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto p-2 bg-slate-900/80 rounded-xl border border-slate-800">
                  {HABIT_ICONS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setIcon(emoji)}
                      className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-all ${
                        icon === emoji
                          ? 'bg-cyan-500/20 border-2 border-cyan-400 scale-110'
                          : 'hover:bg-slate-800 border border-transparent'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target / Goal */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Target / Metric
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 45 min, 10k steps"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
                  >
                    <option value="fitness">Fitness & Body</option>
                    <option value="discipline">Discipline & Will</option>
                    <option value="mindset">Mindset & Study</option>
                    <option value="nutrition">Nutrition & Water</option>
                    <option value="recovery">Sleep & Recovery</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Description / Purpose
                </label>
                <textarea
                  rows={2}
                  placeholder="Why is this non-negotiable for your Winter Arc?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 resize-none"
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <div>
                  <div className="text-xs font-bold text-white">Daily Active Status</div>
                  <div className="text-[11px] text-slate-400">Include in today's active checklist</div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsActive(!isActive)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    isActive ? 'bg-cyan-500' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      isActive ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!name.trim()}
                  className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-900/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  {habitToEdit ? 'Save Changes' : 'Add to Routine'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
