import React from 'react';
import { 
  Home, 
  Milestone, 
  BookOpen, 
  Terminal, 
  Trophy, 
  Library, 
  Cpu, 
  Swords, 
  Code2, 
  ChevronRight, 
  ChevronLeft,
  Coffee,
  Sparkles,
  FlaskConical
} from 'lucide-react';
import { useProgress } from '../context/ProgressContext';

interface SidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onNavigate,
  isCollapsed,
  onToggleCollapse
}) => {
  const { progress } = useProgress();

  const primaryNavItems = [
    {
      id: 'dashboard',
      label: 'داشبورد اصلی',
      englishLabel: 'Home Dashboard',
      icon: Home,
      badge: null
    },
    {
      id: 'roadmap',
      label: 'نقشه راه یادگیری',
      englishLabel: 'Learning Roadmap',
      icon: Milestone,
      badge: '۱۲ سطح'
    },
    {
      id: 'lessons',
      label: 'فهرست درس‌ها',
      englishLabel: 'Curriculum & Lessons',
      icon: BookOpen,
      badge: null
    },
    {
      id: 'anthropic',
      label: 'مسیر آموزشی Anthropic',
      englishLabel: 'Anthropic Official Track',
      icon: Cpu,
      badge: 'رسمی',
      special: true
    },
    {
      id: 'playground',
      label: 'Prompt Playground',
      englishLabel: 'Interactive AI Lab',
      icon: Terminal,
      badge: 'زنده',
      glow: true
    },
    {
      id: 'benchmark',
      label: 'AI Benchmark Lab',
      englishLabel: 'AI Model Comparison Lab',
      icon: FlaskConical,
      badge: 'جدید',
      glow: true
    },
    {
      id: 'arena',
      label: 'میدان نبرد پرامپت',
      englishLabel: 'Prompt Arena',
      icon: Swords,
      badge: 'چالش',
      glow: false
    },
    {
      id: 'exercises',
      label: 'تمرین‌ها و چالش‌ها',
      englishLabel: 'Exercises & Challenges',
      icon: Code2,
      badge: progress.completedChallenges.length > 0 ? `${progress.completedChallenges.length} حل شده` : null
    },
    {
      id: 'resources',
      label: 'کتابخانه منابع',
      englishLabel: 'Curated Resource Library',
      icon: Library,
      badge: null
    }
  ];

  const loungeNavItem = {
    id: 'lounge',
    label: 'اتاق استراحت هوشمند',
    englishLabel: '☕ Focus Lounge',
    icon: Coffee,
    badge: 'بازی و استراحت',
    isLounge: true
  };

  const secondaryNavItems = [
    {
      id: 'profile',
      label: 'پیشرفت و دستاوردها',
      englishLabel: 'Achievements & Profile',
      icon: Trophy,
      badge: `${progress.unlockedAchievements.length} نشان`
    }
  ];

  return (
    <aside
      className={`fixed top-[65px] right-0 bottom-0 z-20 bg-[#0d0d0d] border-l border-white/5 transition-all duration-300 flex flex-col justify-between shadow-2xl ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Navigation list */}
      <div className="p-3 space-y-1 overflow-y-auto flex-1 custom-scrollbar">
        
        {/* Collapse toggle bar */}
        <div className="flex items-center justify-between px-3 py-2 mb-2 text-gray-500 border-b border-white/5 text-xs">
          {!isCollapsed && <span className="font-medium text-gray-400 font-vazir">ناوبری پلتفرم</span>}
          <button
            onClick={onToggleCollapse}
            className="p-1 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors mr-auto"
            title={isCollapsed ? 'باز کردن منو' : 'جمع کردن منو'}
          >
            {isCollapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        {/* Primary Learning Tools */}
        {primaryNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-white/5 text-cyan-400 border border-cyan-500/20 shadow-[0_0_10px_rgba(34,211,238,0.1)]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              {isActive ? (
                <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)] shrink-0" />
              ) : (
                <div
                  className={`p-1 rounded-lg transition-colors ${
                    item.special
                      ? 'bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20'
                      : 'bg-white/5 text-gray-400 group-hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                </div>
              )}

              {!isCollapsed && (
                <div className="flex-1 text-right flex items-center justify-between overflow-hidden">
                  <div className="truncate">
                    <span className="block font-semibold font-vazir">{item.label}</span>
                    <span className="text-[10px] text-gray-500 block truncate font-mono">{item.englishLabel}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-normal shrink-0 font-vazir ${
                        item.special
                          ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                          : isActive
                          ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/30'
                          : 'bg-[#1a1a1a] text-gray-400 border border-white/5'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}

              {/* Tooltip in collapsed mode */}
              {isCollapsed && (
                <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-[#141414] border border-white/10 text-white text-xs rounded-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-2xl font-vazir">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}

        {/* Clean subtle divider before Lounge */}
        <div className="py-2">
          <div className="h-px bg-white/5 mx-2" />
        </div>

        {/* Focus Lounge nav item */}
        {(() => {
          const item = loungeNavItem;
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.15)]'
                  : 'text-gray-400 hover:text-amber-300 hover:bg-amber-500/5 border border-transparent'
              }`}
            >
              {isActive ? (
                <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)] shrink-0" />
              ) : (
                <div className="p-1 rounded-lg bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20 transition-colors">
                  <Icon className="w-4 h-4 shrink-0" />
                </div>
              )}

              {!isCollapsed && (
                <div className="flex-1 text-right flex items-center justify-between overflow-hidden">
                  <div className="truncate">
                    <span className="block font-semibold font-vazir text-amber-300/90">{item.label}</span>
                    <span className="text-[10px] text-amber-400/60 block truncate font-mono">{item.englishLabel}</span>
                  </div>

                  {item.badge && (
                    <span className="text-[9px] px-2 py-0.5 rounded-full font-vazir bg-amber-500/15 text-amber-300 border border-amber-500/20 shrink-0">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}

              {isCollapsed && (
                <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-[#141414] border border-amber-500/20 text-amber-300 text-xs rounded-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-2xl font-vazir">
                  {item.label}
                </div>
              )}
            </button>
          );
        })()}

        {/* Secondary items (Profile & Progress) */}
        {secondaryNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-white/5 text-violet-400 border border-violet-500/20 shadow-[0_0_10px_rgba(139,92,246,0.1)]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              {isActive ? (
                <span className="w-2 h-2 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(139,92,246,0.8)] shrink-0" />
              ) : (
                <div className="p-1 rounded-lg bg-white/5 text-gray-400 group-hover:text-white transition-colors">
                  <Icon className="w-4 h-4 shrink-0" />
                </div>
              )}

              {!isCollapsed && (
                <div className="flex-1 text-right flex items-center justify-between overflow-hidden">
                  <div className="truncate">
                    <span className="block font-semibold font-vazir">{item.label}</span>
                    <span className="text-[10px] text-gray-500 block truncate font-mono">{item.englishLabel}</span>
                  </div>

                  {item.badge && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-vazir bg-[#1a1a1a] text-gray-400 border border-white/5 shrink-0">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}

              {isCollapsed && (
                <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-[#141414] border border-white/10 text-white text-xs rounded-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-2xl font-vazir">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}

      </div>

      {/* Footer info & User avatar in sidebar */}
      {!isCollapsed ? (
        <div className="p-4 border-t border-white/5 bg-[#0a0a0a]/50 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#1a1a1a] border border-white/10 flex items-center justify-center font-bold text-xs text-white shrink-0">
              PL
            </div>
            <div className="flex flex-col text-right truncate">
              <span className="text-xs font-bold text-white truncate font-vazir">معمار پرامپت (کاربر)</span>
              <span className="text-[10px] text-gray-500 font-mono">Prompt Architect • Level ۰۱</span>
            </div>
          </div>

          <div className="w-full bg-[#141414] rounded-xl p-2.5 border border-white/5 flex items-center justify-between text-[11px]">
            <span className="text-gray-400 font-vazir">پیشرفت کل دوره:</span>
            <span className="font-bold text-cyan-400 font-mono">{progress.overallPercentage}٪</span>
          </div>
        </div>
      ) : (
        <div className="p-3 border-t border-white/5 flex justify-center">
          <div className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-white/10 flex items-center justify-center font-bold text-xs text-cyan-400">
            {progress.overallPercentage}٪
          </div>
        </div>
      )}
    </aside>
  );
};
