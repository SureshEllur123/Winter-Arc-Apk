import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Smartphone, Download, ShieldCheck, CheckCircle2, Share2, Sparkles, ArrowDownToLine, Zap } from 'lucide-react';
import { exportDataAsJSON } from '../services/storage';

interface PwaInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt?: any;
  onTriggerInstall?: () => void;
}

export const PwaInstallModal: React.FC<PwaInstallModalProps> = ({
  isOpen,
  onClose,
  deferredPrompt,
  onTriggerInstall,
}) => {
  if (!isOpen) return null;

  const handleDownloadBackup = () => {
    const jsonStr = exportDataAsJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `WinterArc_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

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
          className="relative w-full max-w-md max-h-[85vh] flex flex-col rounded-3xl bg-[#0F1626] border border-slate-800 shadow-2xl z-10 overflow-hidden text-left"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-800/80 bg-[#121A2D] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-cyan-400" />
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Android APK & Phone Installation
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

          {/* Content */}
          <div className="p-6 overflow-y-auto space-y-4 text-xs">
            {deferredPrompt && (
              <button
                type="button"
                onClick={() => {
                  if (onTriggerInstall) onTriggerInstall();
                }}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all transform active:scale-98"
              >
                <Zap className="w-5 h-5 fill-slate-950" />
                <span>Install Native Android App Now</span>
              </button>
            )}

            <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-slate-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-cyan-300 text-sm">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                Native Android WebAPK Support
              </div>
              <p className="text-slate-300 leading-relaxed">
                Android automatically creates a native <strong>WebAPK</strong> when installed from Chrome or Brave. This puts the standalone Winter Arc app icon into your phone's app drawer and home screen with fullscreen mode and zero internet dependency.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
                3-Step 10-Second Android Installation:
              </h4>

              <div className="space-y-2.5">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center font-bold text-cyan-400 shrink-0 text-[10px]">
                    1
                  </div>
                  <div>
                    <span className="font-bold text-white">Open in Chrome or Brave</span>
                    <p className="text-slate-400 mt-0.5">Open this URL on your Android phone.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center font-bold text-cyan-400 shrink-0 text-[10px]">
                    2
                  </div>
                  <div>
                    <span className="font-bold text-white">Tap Chrome Menu (⋮)</span>
                    <p className="text-slate-400 mt-0.5">Tap the 3 dots icon in the top-right corner.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center font-bold text-cyan-400 shrink-0 text-[10px]">
                    3
                  </div>
                  <div>
                    <span className="font-bold text-white">Tap "Install App" or "Add to Home screen"</span>
                    <p className="text-slate-400 mt-0.5">Android's Google Play Services will compile the WebAPK directly on your device.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Offline Bundle Download */}
            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={handleDownloadBackup}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4 text-cyan-400" />
                <span>Download Offline Backup File (JSON)</span>
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-slate-800/80 bg-[#121A2D] flex items-center justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition-colors"
            >
              Got it
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
