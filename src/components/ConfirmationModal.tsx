import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false,
  onConfirm,
  onCancel,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 12 }}
            className="relative w-full max-w-sm rounded-2xl bg-[#0F1626] border border-slate-800 p-6 shadow-2xl z-10"
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  isDestructive
                    ? 'bg-rose-950/80 border border-rose-500/40 text-rose-400'
                    : 'bg-amber-950/80 border border-amber-500/40 text-amber-400'
                }`}
              >
                <AlertTriangle className="w-5 h-5" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-white tracking-tight">{title}</h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{message}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 mt-6 pt-4 border-t border-slate-800/80">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white rounded-xl hover:bg-slate-800/60 transition-colors"
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className={`px-4 py-2 text-xs font-bold rounded-xl shadow-md transition-all ${
                  isDestructive
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/30'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-900/30'
                }`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
