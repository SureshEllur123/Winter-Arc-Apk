import React from 'react';
import { motion } from 'motion/react';
import { CheckSquare, Calendar, BarChart3, Settings, Flame } from 'lucide-react';
import { TabType } from '../types';

interface BottomNavProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  isTodayPerfect?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  isTodayPerfect,
}) => {
  const tabs = [
    {
      id: 'today' as TabType,
      label: 'Today',
      icon: CheckSquare,
      hasBadge: isTodayPerfect,
    },
    {
      id: 'history' as TabType,
      label: 'History',
      icon: Calendar,
    },
    {
      id: 'stats' as TabType,
      label: 'Stats',
      icon: BarChart3,
    },
    {
      id: 'settings' as TabType,
      label: 'Settings',
      icon: Settings,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#070A11]/95 backdrop-blur-lg border-t border-slate-800/80 pb-safe">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive =
            activeTab === tab.id || (activeTab === 'manage' && tab.id === 'settings');

          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`relative flex flex-col items-center justify-center w-16 h-12 rounded-2xl transition-all duration-200 ${
                isActive ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {/* Active Tab Indicator Pill */}
              {isActive && (
                <motion.div
                  layoutId="activeTabPill"
                  className="absolute inset-0 bg-cyan-500/10 rounded-2xl border border-cyan-500/30"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}

              <div className="relative z-10 flex flex-col items-center">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                <span className="text-[10px] font-bold tracking-wider mt-0.5 font-sans">
                  {tab.label}
                </span>

                {/* Optional flame badge on Today tab when perfect */}
                {tab.hasBadge && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-orange-400 animate-ping" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
