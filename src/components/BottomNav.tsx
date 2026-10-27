import React from 'react';
import { FileText, BookOpen, Bookmark, MessageSquare } from 'lucide-react';

export type TabType = 'notes' | 'subjects' | 'saved' | 'community';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  savedCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  savedCount = 0
}) => {
  const tabs = [
    {
      id: 'notes' as TabType,
      label: 'Notes',
      icon: FileText
    },
    {
      id: 'subjects' as TabType,
      label: 'Subjects',
      icon: BookOpen
    },
    {
      id: 'saved' as TabType,
      label: 'Saved',
      icon: Bookmark,
      badge: savedCount > 0 ? savedCount : null
    },
    {
      id: 'community' as TabType,
      label: 'Community',
      icon: MessageSquare
    }
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-1.5 px-3">
      <div className="max-w-md mx-auto grid grid-cols-4 items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-1 transition-all cursor-pointer relative ${
                isActive ? 'text-[#185a36]' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
                {tab.badge && (
                  <span className="absolute -top-1 -right-2 bg-emerald-700 text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[11px] mt-1 font-semibold ${isActive ? 'text-[#185a36]' : 'text-slate-500'}`}>
                {tab.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 bg-[#185a36] rounded-full mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
