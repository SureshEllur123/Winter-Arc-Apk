import React, { useState, useRef } from 'react';
import {
  Sliders,
  RotateCcw,
  Trash2,
  Download,
  Upload,
  Smartphone,
  ShieldCheck,
  Volume2,
  VolumeX,
  Vibrate,
  Info,
  ChevronRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { AppSettings } from '../../types';
import { ConfirmationModal } from '../ConfirmationModal';

interface SettingsTabProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onNavigateToManage: () => void;
  onResetToday: () => void;
  onResetAllData: () => void;
  onExportJSON: () => void;
  onImportJSON: (jsonStr: string) => void;
  onOpenPwaModal: () => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  settings,
  onUpdateSettings,
  onNavigateToManage,
  onResetToday,
  onResetAllData,
  onExportJSON,
  onImportJSON,
  onOpenPwaModal,
}) => {
  const [resetTodayOpen, setResetTodayOpen] = useState(false);
  const [resetAllOpen, setResetAllOpen] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onImportJSON(content);
        setImportStatus('Backup restored successfully!');
        setTimeout(() => setImportStatus(null), 4000);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6 pb-24 text-left">
      {/* Manage Habits Navigation Banner */}
      <div
        onClick={onNavigateToManage}
        className="p-4 rounded-2xl bg-gradient-to-r from-[#121E33] to-[#0E1729] border border-cyan-500/40 flex items-center justify-between cursor-pointer hover:border-cyan-400 transition-all shadow-md group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
              Manage Routine & Habits
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Add, edit, delete & reorder your daily checklist items
            </p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-cyan-400 group-hover:translate-x-1 transition-transform" />
      </div>

      {/* Preferences Section */}
      <div className="p-5 rounded-3xl bg-[#0F1626] border border-slate-800 space-y-4">
        <h3 className="text-xs uppercase tracking-widest font-bold text-slate-400 font-display">
          Challenge Preferences
        </h3>

        {/* Streak Threshold */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <div className="text-xs font-bold text-white">Streak Threshold</div>
            <div className="text-[11px] text-slate-400">
              Required completion rate to maintain daily streak
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => onUpdateSettings({ streakThresholdPercent: 100 })}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                settings.streakThresholdPercent === 100
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              100% (Strict)
            </button>
            <button
              onClick={() => onUpdateSettings({ streakThresholdPercent: 80 })}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                settings.streakThresholdPercent === 80
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              80% (Lenient)
            </button>
          </div>
        </div>

        {/* Sound Effects */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
          <div>
            <div className="text-xs font-bold text-white">Audio & Synthesized Chimes</div>
            <div className="text-[11px] text-slate-400">
              Tactile check clicks and celebratory chimes (offline)
            </div>
          </div>

          <button
            onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
            className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors ${
              settings.soundEnabled ? 'bg-cyan-500' : 'bg-slate-700'
            }`}
          >
            <div
              className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${
                settings.soundEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Data Backup, Export & Import */}
      <div className="p-5 rounded-3xl bg-[#0F1626] border border-slate-800 space-y-4">
        <h3 className="text-xs uppercase tracking-widest font-bold text-slate-400 font-display">
          Local Storage & Backup
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {/* Export */}
          <button
            onClick={onExportJSON}
            className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-200 flex flex-col items-center justify-center gap-1.5 transition-colors"
          >
            <Download className="w-5 h-5 text-cyan-400" />
            <span className="text-xs font-bold">Export Backup</span>
            <span className="text-[10px] text-slate-500">Save JSON file</span>
          </button>

          {/* Import */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-200 flex flex-col items-center justify-center gap-1.5 transition-colors"
          >
            <Upload className="w-5 h-5 text-purple-400" />
            <span className="text-xs font-bold">Import Backup</span>
            <span className="text-[10px] text-slate-500">Restore JSON</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".json"
            className="hidden"
          />
        </div>

        {importStatus && (
          <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{importStatus}</span>
          </div>
        )}

        {/* APK / PWA Guide */}
        <button
          onClick={onOpenPwaModal}
          className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-900/80 border border-slate-800 hover:border-cyan-500/40 flex items-center justify-between text-left transition-colors"
        >
          <div className="flex items-center gap-3">
            <Smartphone className="w-5 h-5 text-cyan-400" />
            <div>
              <div className="text-xs font-bold text-white">
                Android APK & Offline WebApp
              </div>
              <div className="text-[11px] text-slate-400">
                Install as standalone app on your Android phone
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>
      </div>

      {/* Danger Zone */}
      <div className="p-5 rounded-3xl bg-[#0F1626] border border-rose-950/50 space-y-3">
        <h3 className="text-xs uppercase tracking-widest font-bold text-rose-400 font-display">
          Danger Zone
        </h3>

        <div className="space-y-2">
          {/* Reset Today */}
          <button
            onClick={() => setResetTodayOpen(true)}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold flex items-center justify-between transition-colors"
          >
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-amber-400" />
              <span>Reset Today's Progress</span>
            </div>
            <span className="text-[10px] text-slate-500">Uncheck today</span>
          </button>

          {/* Reset All Data */}
          <button
            onClick={() => setResetAllOpen(true)}
            className="w-full py-2.5 px-4 rounded-xl bg-rose-950/30 hover:bg-rose-950/60 border border-rose-800/40 text-rose-300 text-xs font-bold flex items-center justify-between transition-colors"
          >
            <div className="flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-rose-400" />
              <span>Reset All App Data</span>
            </div>
            <span className="text-[10px] text-rose-400">Erase all history</span>
          </button>
        </div>
      </div>

      {/* About Application */}
      <div className="p-5 rounded-3xl bg-[#0F1626] border border-slate-800 text-center space-y-2">
        <div className="flex items-center justify-center gap-1.5 text-xs font-black tracking-widest text-cyan-400 uppercase font-display">
          <ShieldCheck className="w-4 h-4" />
          Winter Arc Routine Tracker v1.0.0
        </div>
        <p className="text-[11px] text-slate-400 max-w-xs mx-auto leading-relaxed">
          100% Offline • Zero Remote APIs • No Tracking • Local Persistence on Device
        </p>
      </div>

      {/* Reset Modals */}
      <ConfirmationModal
        isOpen={resetTodayOpen}
        title="Reset Today's Progress?"
        message="This will uncheck all habits for today and reset your today execution to 0%. Historical records for previous days will not be affected."
        confirmLabel="Reset Today"
        onConfirm={() => {
          onResetToday();
          setResetTodayOpen(false);
        }}
        onCancel={() => setResetTodayOpen(false)}
      />

      <ConfirmationModal
        isOpen={resetAllOpen}
        title="Erase All Data?"
        message="Warning: This action will permanently erase all habits, streaks, historical logs, and statistics from your device. This cannot be undone."
        confirmLabel="Erase Everything"
        isDestructive
        onConfirm={() => {
          onResetAllData();
          setResetAllOpen(false);
        }}
        onCancel={() => setResetAllOpen(false)}
      />
    </div>
  );
};
