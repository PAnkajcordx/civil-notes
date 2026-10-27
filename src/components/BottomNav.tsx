import React from 'react';
import { FileText, DollarSign, Bookmark, Sliders, Video, ShoppingBag } from 'lucide-react';

export type TabType = 'notes' | 'pricing' | 'purchases' | 'deck' | 'videos' | 'saved';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  savedCount?: number;
  purchasedCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  savedCount = 0,
  purchasedCount = 0,
}) => {
  const tabs = [
    {
      id: 'notes' as TabType,
      label: 'Notes',
      icon: FileText,
    },
    {
      id: 'pricing' as TabType,
      label: 'PDF Store',
      icon: DollarSign,
      subBadge: 'Table',
    },
    {
      id: 'purchases' as TabType,
      label: 'My PDFs',
      icon: ShoppingBag,
      badge: purchasedCount > 0 ? purchasedCount : null,
    },
    {
      id: 'deck' as TabType,
      label: 'Deck',
      icon: Sliders,
    },
    {
      id: 'videos' as TabType,
      label: 'Videos',
      icon: Video,
      subBadge: '₹49',
    },
    {
      id: 'saved' as TabType,
      label: 'Saved',
      icon: Bookmark,
      badge: savedCount > 0 ? savedCount : null,
    },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-1.5 px-1 sm:px-3">
      <div className="max-w-md mx-auto grid grid-cols-6 items-center">
        {tabs.map(tab => {
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
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                {tab.badge !== undefined && tab.badge !== null && (
                  <span className="absolute -top-1 -right-2 bg-emerald-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
                {tab.subBadge && (
                  <span className="absolute -top-1.5 -right-2.5 bg-amber-500 text-slate-950 text-[8px] font-extrabold px-1 rounded-full leading-tight">
                    {tab.subBadge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'font-bold' : 'font-medium'}`}>
                {tab.label}
              </span>
              {isActive && <span className="w-1 h-1 rounded-full bg-[#185a36] mt-0.5"></span>}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
