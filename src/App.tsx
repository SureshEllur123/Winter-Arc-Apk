import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Habit,
  DailyRecord,
  StreakStats,
  AppSettings,
  TabType,
} from './types';
import {
  loadHabits,
  saveHabits,
  loadSettings,
  saveSettings,
  loadAllRecords,
  saveAllRecords,
  getOrCreateRecordForDate,
  toggleHabitCompletion,
  calculateStreakStats,
  resetTodayProgress,
  resetAllData,
  exportDataAsJSON,
  importDataFromJSON,
  getTodayDateString,
} from './services/storage';
import { sound } from './services/sound';
import { getQuoteForDay } from './data/quotes';

import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { TodayTab } from './components/tabs/TodayTab';
import { HistoryTab } from './components/tabs/HistoryTab';
import { StatsTab } from './components/tabs/StatsTab';
import { SettingsTab } from './components/tabs/SettingsTab';
import { ManageRoutineTab } from './components/tabs/ManageRoutineTab';
import { OnboardingModal } from './components/OnboardingModal';
import { ManageHabitModal } from './components/ManageHabitModal';
import { DayDetailModal } from './components/DayDetailModal';
import { PwaInstallModal } from './components/PwaInstallModal';

export default function App() {
  const todayStr = useMemo(() => getTodayDateString(), []);

  // State
  const [habits, setHabits] = useState<Habit[]>(() => loadHabits());
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());
  const [records, setRecords] = useState<Record<string, DailyRecord>>(() => loadAllRecords());
  const [activeTab, setActiveTab] = useState<TabType>('today');

  // Modals & Sheets
  const [createHabitModalOpen, setCreateHabitModalOpen] = useState(false);
  const [selectedHistoryDate, setSelectedHistoryDate] = useState<string | null>(null);
  const [pwaModalOpen, setPwaModalOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Capture beforeinstallprompt for instant Android WebAPK install
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleTriggerInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setPwaModalOpen(false);
      }
    }
  };

  // Sync sound settings
  useEffect(() => {
    sound.setMuted(!settings.soundEnabled);
  }, [settings.soundEnabled]);

  // Today's record
  const todayRecord: DailyRecord = useMemo(() => {
    return getOrCreateRecordForDate(
      todayStr,
      habits,
      settings.streakThresholdPercent
    );
  }, [todayStr, habits, records, settings.streakThresholdPercent]);

  // Daily Quote (deterministic for today)
  const todayQuote = useMemo(() => getQuoteForDay(todayStr), [todayStr]);

  // Streak Statistics
  const streakStats: StreakStats = useMemo(() => {
    return calculateStreakStats(records, settings.streakThresholdPercent);
  }, [records, settings.streakThresholdPercent]);

  // Calculate day count into the Winter Arc challenge
  const dayCount = useMemo(() => {
    try {
      const start = new Date(settings.winterArcStartDate || todayStr);
      const current = new Date(todayStr);
      const diffTime = Math.abs(current.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return Math.min(diffDays, settings.targetDays || 90);
    } catch {
      return 1;
    }
  }, [settings.winterArcStartDate, todayStr, settings.targetDays]);

  // Toggle habit on Today screen
  const handleToggleTodayHabit = useCallback((habitId: string) => {
    const updated = toggleHabitCompletion(
      todayStr,
      habitId,
      settings.streakThresholdPercent
    );

    const habitSnapshot = updated.habits.find((h) => h.id === habitId);
    if (habitSnapshot?.completed) {
      sound.playCheckSound();
      sound.triggerHaptic();
      if (updated.isPerfect) {
        sound.playPerfectDayChime();
      }
    } else {
      sound.playUncheckSound();
    }

    setRecords((prev) => ({
      ...prev,
      [todayStr]: updated,
    }));
  }, [todayStr, settings.streakThresholdPercent]);

  // Toggle habit in Historical Snapshot Modal
  const handleToggleHistoryHabit = useCallback((habitId: string) => {
    if (!selectedHistoryDate) return;
    const updated = toggleHabitCompletion(
      selectedHistoryDate,
      habitId,
      settings.streakThresholdPercent
    );

    const habitSnapshot = updated.habits.find((h) => h.id === habitId);
    if (habitSnapshot?.completed) {
      sound.playCheckSound();
      sound.triggerHaptic();
    } else {
      sound.playUncheckSound();
    }

    setRecords((prev) => ({
      ...prev,
      [selectedHistoryDate]: updated,
    }));
  }, [selectedHistoryDate, settings.streakThresholdPercent]);

  // Habit management operations
  const handleSaveHabit = (data: Partial<Habit>, editId?: string) => {
    if (editId) {
      // Edit existing
      const updated = habits.map((h) =>
        h.id === editId ? { ...h, ...data } : h
      );
      setHabits(updated);
      saveHabits(updated);
    } else {
      // Create new
      const newHabit: Habit = {
        id: `habit-${Date.now()}`,
        name: data.name || 'New Routine',
        icon: data.icon || '⚡',
        description: data.description || '',
        category: data.category || 'fitness',
        target: data.target || '',
        isActive: data.isActive !== false,
        order: habits.length,
        createdAt: new Date().toISOString(),
      };
      const updated = [...habits, newHabit];
      setHabits(updated);
      saveHabits(updated);
    }
  };

  const handleDeleteHabit = (habitId: string) => {
    const updated = habits.filter((h) => h.id !== habitId);
    setHabits(updated);
    saveHabits(updated);
  };

  const handleToggleHabitActive = (habitId: string) => {
    const updated = habits.map((h) =>
      h.id === habitId ? { ...h, isActive: !h.isActive } : h
    );
    setHabits(updated);
    saveHabits(updated);
  };

  const handleReorderHabits = (newHabits: Habit[]) => {
    setHabits(newHabits);
    saveHabits(newHabits);
  };

  // Settings & Reset operations
  const handleUpdateSettings = (newSettings: Partial<AppSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    saveSettings(updated);
  };

  const handleResetToday = () => {
    const resetRec = resetTodayProgress();
    setRecords((prev) => ({
      ...prev,
      [todayStr]: resetRec,
    }));
  };

  const handleResetAllData = () => {
    resetAllData();
    window.location.reload();
  };

  const handleExportJSON = () => {
    const jsonStr = exportDataAsJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `WinterArc_Backup_${todayStr}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (jsonStr: string) => {
    const result = importDataFromJSON(jsonStr);
    if (result.success) {
      setHabits(loadHabits());
      setRecords(loadAllRecords());
      setSettings(loadSettings());
    } else {
      alert(result.message);
    }
  };

  const handleCompleteOnboarding = (selectedHabits: Habit[]) => {
    setHabits(selectedHabits);
    saveHabits(selectedHabits);
    const updatedSettings: AppSettings = {
      ...settings,
      hasCompletedOnboarding: true,
      winterArcStartDate: todayStr,
    };
    setSettings(updatedSettings);
    saveSettings(updatedSettings);
  };

  return (
    <div className="min-h-screen bg-[#070A11] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30">
      {/* First-launch Onboarding Modal */}
      {!settings.hasCompletedOnboarding && (
        <OnboardingModal onComplete={handleCompleteOnboarding} />
      )}

      {/* Persistent App Header */}
      <Header
        currentDateStr={todayStr}
        currentStreak={streakStats.currentStreak}
        soundEnabled={settings.soundEnabled}
        onToggleSound={() =>
          handleUpdateSettings({ soundEnabled: !settings.soundEnabled })
        }
        dayCount={dayCount}
      />

      {/* Main Tab Screen Area */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 pt-4">
        <AnimatePresence mode="wait">
          {activeTab === 'today' && (
            <motion.div
              key="today"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
            >
              <TodayTab
                record={todayRecord}
                habits={habits}
                quote={todayQuote}
                onToggleHabit={handleToggleTodayHabit}
                onOpenCreateHabit={() => setCreateHabitModalOpen(true)}
                onNavigateToManage={() => setActiveTab('manage')}
              />
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
            >
              <HistoryTab
                records={records}
                onSelectDate={(dateStr) => setSelectedHistoryDate(dateStr)}
                streakThresholdPercent={settings.streakThresholdPercent}
              />
            </motion.div>
          )}

          {activeTab === 'stats' && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
            >
              <StatsTab
                stats={streakStats}
                records={records}
                streakThresholdPercent={settings.streakThresholdPercent}
              />
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
            >
              <SettingsTab
                settings={settings}
                onUpdateSettings={handleUpdateSettings}
                onNavigateToManage={() => setActiveTab('manage')}
                onResetToday={handleResetToday}
                onResetAllData={handleResetAllData}
                onExportJSON={handleExportJSON}
                onImportJSON={handleImportJSON}
                onOpenPwaModal={() => setPwaModalOpen(true)}
              />
            </motion.div>
          )}

          {activeTab === 'manage' && (
            <motion.div
              key="manage"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
            >
              <ManageRoutineTab
                habits={habits}
                onSaveHabit={handleSaveHabit}
                onDeleteHabit={handleDeleteHabit}
                onToggleHabitActive={handleToggleHabitActive}
                onReorderHabits={handleReorderHabits}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onChangeTab={(tab) => setActiveTab(tab)}
        isTodayPerfect={todayRecord.isPerfect}
      />

      {/* Create Habit Modal */}
      <ManageHabitModal
        isOpen={createHabitModalOpen}
        onSave={(data) => {
          handleSaveHabit(data);
          setCreateHabitModalOpen(false);
        }}
        onClose={() => setCreateHabitModalOpen(false)}
      />

      {/* Historical Day Snapshot Modal */}
      <DayDetailModal
        isOpen={selectedHistoryDate !== null}
        dateStr={selectedHistoryDate || ''}
        record={selectedHistoryDate ? records[selectedHistoryDate] || null : null}
        onClose={() => setSelectedHistoryDate(null)}
        onToggleHabit={handleToggleHistoryHabit}
      />

      {/* Android WebAPK & Offline Guide */}
      <PwaInstallModal
        isOpen={pwaModalOpen}
        onClose={() => setPwaModalOpen(false)}
        deferredPrompt={deferredPrompt}
        onTriggerInstall={handleTriggerInstall}
      />
    </div>
  );
}
