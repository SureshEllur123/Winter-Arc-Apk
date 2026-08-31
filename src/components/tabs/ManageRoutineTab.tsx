import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  Check,
  Shield,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Habit } from '../../types';
import { ManageHabitModal } from '../ManageHabitModal';
import { ConfirmationModal } from '../ConfirmationModal';

interface ManageRoutineTabProps {
  habits: Habit[];
  onSaveHabit: (habitData: Partial<Habit>, editId?: string) => void;
  onDeleteHabit: (habitId: string) => void;
  onToggleHabitActive: (habitId: string) => void;
  onReorderHabits: (habits: Habit[]) => void;
}

export const ManageRoutineTab: React.FC<ManageRoutineTabProps> = ({
  habits,
  onSaveHabit,
  onDeleteHabit,
  onToggleHabitActive,
  onReorderHabits,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleOpenAdd = () => {
    setEditingHabit(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (habit: Habit) => {
    setEditingHabit(habit);
    setModalOpen(true);
  };

  const handleSaveModal = (data: Partial<Habit>) => {
    onSaveHabit(data, editingHabit ? editingHabit.id : undefined);
    setModalOpen(false);
    setEditingHabit(null);
  };

  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    const next = [...habits];
    const temp = next[index - 1];
    next[index - 1] = next[index];
    next[index] = temp;
    // Update orders
    next.forEach((h, i) => (h.order = i));
    onReorderHabits(next);
  };

  const handleMoveDown = (index: number) => {
    if (index >= habits.length - 1) return;
    const next = [...habits];
    const temp = next[index + 1];
    next[index + 1] = next[index];
    next[index] = temp;
    next.forEach((h, i) => (h.order = i));
    onReorderHabits(next);
  };

  const activeCount = habits.filter((h) => h.isActive).length;

  return (
    <div className="space-y-6 pb-24 text-left">
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight font-sans">
            Manage Routine
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {activeCount} of {habits.length} habits active in today's mission
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-900/30 transition-colors"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Habit</span>
        </button>
      </div>

      {/* Notice about historical safety */}
      <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 text-slate-300 text-xs flex items-start gap-2.5">
        <Shield className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <span className="leading-relaxed">
          <strong>Immutable History Guarantee:</strong> Adding, editing, or reordering habits here will only affect today and future days. Past historical records remain preserved exactly as they were recorded.
        </span>
      </div>

      {/* Habit List */}
      <div className="space-y-2.5">
        {habits.map((habit, index) => {
          const isActive = habit.isActive;
          return (
            <div
              key={habit.id}
              className={`p-4 rounded-2xl border transition-all ${
                isActive
                  ? 'bg-[#0F1626] border-slate-800 text-white'
                  : 'bg-slate-900/40 border-slate-800/80 text-slate-500 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                {/* Left: Emoji + Title + Target */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="text-2xl shrink-0">{habit.icon}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white truncate">{habit.name}</h4>
                      {habit.target && (
                        <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700/60 shrink-0">
                          {habit.target}
                        </span>
                      )}
                    </div>
                    {habit.description && (
                      <p className="text-xs text-slate-400 truncate mt-0.5">
                        {habit.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  {/* Move Up */}
                  <button
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    aria-label={`Move ${habit.name} up in list`}
                    className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>

                  {/* Move Down */}
                  <button
                    onClick={() => handleMoveDown(index)}
                    disabled={index === habits.length - 1}
                    aria-label={`Move ${habit.name} down in list`}
                    className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  {/* Edit */}
                  <button
                    onClick={() => handleOpenEdit(habit)}
                    aria-label={`Edit ${habit.name}`}
                    className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-300"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => setDeleteConfirmId(habit.id)}
                    aria-label={`Delete ${habit.name}`}
                    className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Active Toggle Switch */}
                  <button
                    onClick={() => onToggleHabitActive(habit.id)}
                    aria-label={`Toggle active state for ${habit.name}`}
                    className={`ml-1.5 w-10 h-6 flex items-center rounded-full p-0.5 transition-colors ${
                      isActive ? 'bg-cyan-500' : 'bg-slate-700'
                    }`}
                  >
                    <div
                      className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${
                        isActive ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit/Create Modal */}
      <ManageHabitModal
        isOpen={modalOpen}
        habitToEdit={editingHabit}
        onSave={handleSaveModal}
        onClose={() => {
          setModalOpen(false);
          setEditingHabit(null);
        }}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteConfirmId !== null}
        title="Delete Habit?"
        message="Are you sure you want to remove this habit from your routine? It will remain in past historical snapshots."
        confirmLabel="Delete Habit"
        isDestructive
        onConfirm={() => {
          if (deleteConfirmId) {
            onDeleteHabit(deleteConfirmId);
            setDeleteConfirmId(null);
          }
        }}
        onCancel={() => setDeleteConfirmId(null)}
      />
    </div>
  );
};
