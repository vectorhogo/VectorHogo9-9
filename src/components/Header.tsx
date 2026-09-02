import React from 'react';
import { Sparkles, Flame, Search, Award, BookOpen, Layers, Settings, ChevronLeft, Target, Coffee, Keyboard } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { CURRICULUM_LEVELS } from '../data/curriculum';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenSettings: () => void;
  onOpenShortcuts?: () => void;
  onNavigate: (view: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenSearch, 
  onOpenSettings, 
  onOpenShortcuts,
  onNavigate 
}) => {
  const { progress, totalLessonsCount, completedLessonsCount, toggleFocusMode } = useProgress();
  const currentLevel = CURRICULUM_LEVELS.find((lvl) => lvl.id === progress.currentLevelId) || CURRICULUM_LEVELS[0];
  const isFocusMode = !!progress.focusModeEnabled;

  return (
    <header className="sticky top-0 z-30 w-full bg-[#0d0d0d]/90 backdrop-blur-md border-b border-white/5 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-[1720px] mx-auto flex items-center justify-between gap-4">
        
        {/* Logo & Product Identity */}
        <div 
          onClick={() => onNavigate('dashboard')} 
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-600 to-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.5)] group-hover:scale-105 transition-transform">
            <span className="text-white font-bold text-xl">PL</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white">
                PromptLab
              </span>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                آزمایشگاه هوش مصنوعی
              </span>
            </div>
            <p className="text-xs text-gray-500 hidden sm:block">
              آموزش تخصصی مهندسی پرامپت از صفر تا سیستم‌های حرفه‌ای
            </p>
          </div>
        </div>

        {/* Global Search Bar Trigger */}
        <div className="flex-1 max-w-md hidden md:block">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-4 py-2 bg-[#141414] hover:bg-[#1a1a1a] border border-white/10 hover:border-cyan-500/30 rounded-full text-gray-400 hover:text-white text-xs transition-all shadow-inner"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-4 h-4 text-gray-500" />
              <span>جستجوی مهارت‌ها، دروس، تکنیک‌ها و پرامپت‌ها...</span>
            </div>
            <kbd className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] bg-[#222] border border-white/10 rounded-full text-gray-400 font-mono">
              Ctrl + K
            </kbd>
          </button>
        </div>

        {/* User Stats & Badges */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          
          {/* Focus Mode Toggle */}
          <button
            onClick={() => toggleFocusMode()}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              isFocusMode
                ? 'bg-violet-600 text-white shadow-[0_0_15px_rgba(124,58,237,0.4)] border border-violet-400/40'
                : 'bg-[#141414] hover:bg-[#1a1a1a] border border-white/10 text-gray-400 hover:text-white'
            }`}
            title="حالت تمرکز عمیق (Focus Mode)"
          >
            <Target className={`w-3.5 h-3.5 ${isFocusMode ? 'text-cyan-300 animate-spin' : 'text-gray-400'}`} />
            <span className="hidden sm:inline">{isFocusMode ? 'حالت تمرکز: روشن' : 'تمرکز عمیق'}</span>
          </button>

          {/* Quick Focus Lounge shortcut */}
          <button
            onClick={() => onNavigate('lounge')}
            className="p-2 rounded-full bg-[#141414] hover:bg-[#1a1a1a] border border-white/10 text-amber-400/80 hover:text-amber-400 transition-colors"
            title="اتاق استراحت (Focus Lounge)"
          >
            <Coffee className="w-4 h-4" />
          </button>

          {/* Mobile Search Button */}
          <button
            onClick={onOpenSearch}
            className="md:hidden p-2 rounded-full bg-[#141414] border border-white/10 text-gray-400 hover:text-white"
            title="جستجو"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Learning Streak */}
          <div 
            title={`تداوم یادگیری: ${progress.learningStreakDays} روز متوالی`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#141414] border border-white/10 text-orange-400 text-xs font-medium cursor-help"
          >
            <Flame className="w-4 h-4 text-orange-400 animate-pulse" />
            <span className="font-bold text-orange-400">{progress.learningStreakDays} روز</span>
          </div>

          <div className="hidden sm:block h-6 w-[1px] bg-white/10" />

          {/* Overall Progress Widget */}
          <div 
            onClick={() => onNavigate('roadmap')}
            className="hidden sm:flex items-center gap-3 px-3.5 py-1.5 rounded-2xl bg-[#141414] border border-white/10 hover:border-cyan-400/30 cursor-pointer transition-all group"
          >
            <div className="text-right">
              <div className="flex items-center justify-end gap-1 text-[11px] text-gray-400">
                <BookOpen className="w-3 h-3 text-cyan-400" />
                <span>{completedLessonsCount} از {totalLessonsCount} درس</span>
              </div>
              <div className="text-xs font-bold text-cyan-400">
                {progress.overallPercentage}٪ تکمیل
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center p-1 relative">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-gray-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-cyan-400 transition-all duration-500"
                  strokeDasharray={`${progress.overallPercentage}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
            </div>
          </div>

          {/* XP & Level Badge */}
          <div 
            onClick={() => onNavigate('profile')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#141414] border border-white/10 hover:border-violet-500/30 text-xs cursor-pointer transition-all"
          >
            <Award className="w-4 h-4 text-violet-400" />
            <div className="hidden lg:block text-right">
              <span className="font-bold text-white">{progress.xp} XP</span>
              <span className="text-[10px] text-violet-400 block font-mono">{currentLevel.code}</span>
            </div>
          </div>

          {/* Keyboard Shortcuts Helper Button */}
          {onOpenShortcuts && (
            <button
              id="header-shortcuts-btn"
              onClick={onOpenShortcuts}
              className="p-2 rounded-xl bg-[#141414] hover:bg-[#1a1a1a] border border-white/10 text-gray-400 hover:text-cyan-400 transition-colors"
              title="راهنمای کلیدهای میانبر (؟)"
            >
              <Keyboard className="w-4 h-4" />
            </button>
          )}

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-[#141414] hover:bg-[#1a1a1a] border border-white/10 text-gray-400 hover:text-white transition-colors"
            title="تنظیمات پلتفرم"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};
