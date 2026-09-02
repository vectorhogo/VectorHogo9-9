import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, 
  X, 
  BookOpen, 
  Layers, 
  Library, 
  ArrowLeft, 
  Terminal, 
  Cpu, 
  Flame, 
  Swords, 
  FlaskConical, 
  Coffee, 
  Trophy, 
  Settings, 
  Sparkles, 
  CheckCircle2, 
  Compass, 
  Play, 
  Target,
  FileCode,
  FolderHeart,
  Bookmark,
  ExternalLink
} from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { CURRICULUM_LEVELS } from '../data/curriculum';
import { CURATED_RESOURCES } from '../data/resources';
import { ANTHROPIC_TRACK_ITEMS } from '../data/anthropicTrack';
import { PLAYGROUND_TEMPLATES } from '../data/playgroundTemplates';
import { BENCHMARK_TEMPLATES } from '../data/benchmarkTemplates';
import { ARENA_MISSIONS } from '../data/arenaMissions';
import { PROMPT_MISSIONS } from '../data/promptMissions';
import { ACHIEVEMENTS } from '../data/achievements';
import { calculateUserSkills } from '../data/masterySkills';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string, lessonId?: string, starterPrompt?: string) => void;
  onOpenSettings?: () => void;
}

interface SearchResultItem {
  id: string;
  category: 'COURSES' | 'LESSONS' | 'PROMPTS' | 'MISSIONS' | 'RESOURCES' | 'SKILLS' | 'ACHIEVEMENTS' | 'COMMANDS';
  categoryFa: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  badge?: string;
  isCompleted?: boolean;
  action: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ 
  isOpen, 
  onClose, 
  onNavigate,
  onOpenSettings 
}) => {
  const { progress } = useProgress();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Focus on open and reset query
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Command palette quick items when query is empty
  const commandItems: SearchResultItem[] = useMemo(() => [
    {
      id: 'cmd-continue-learning',
      category: 'COMMANDS',
      categoryFa: 'دستورات اصلی',
      title: 'ادامه یادگیری درس فعال',
      subtitle: 'ورود مستقیم به درس فعال و ادامه آموزش و تمرین',
      icon: Play,
      badge: 'Enter',
      action: () => onNavigate('lesson', progress.currentLessonId)
    },
    {
      id: 'cmd-playground',
      category: 'COMMANDS',
      categoryFa: 'ابزارهای تعاملی',
      title: 'کارگاه پرامپت (Playground 2.0)',
      subtitle: 'طراحی، تست و ارزیابی زنده پرامپت با بلوک‌های استاندارد',
      icon: Terminal,
      action: () => onNavigate('playground')
    },
    {
      id: 'cmd-arena',
      category: 'COMMANDS',
      categoryFa: 'ابزارهای تعاملی',
      title: 'میدان چالش و نبرد پرامپت (Arena)',
      subtitle: 'حل سناریوهای واقعی B2B و کسب امتیاز XP',
      icon: Swords,
      action: () => onNavigate('arena')
    },
    {
      id: 'cmd-benchmark',
      category: 'COMMANDS',
      categoryFa: 'ابزارهای تعاملی',
      title: 'آزمایشگاه بنچ‌مارک (Benchmark Lab)',
      subtitle: 'مقایسه خروجی مدل‌های هوش مصنوعی Claude، GPT و Gemini',
      icon: FlaskConical,
      action: () => onNavigate('benchmark')
    },
    {
      id: 'cmd-anthropic',
      category: 'COMMANDS',
      categoryFa: 'مسیر رسمی',
      title: 'مسیر آموزشی رسمی Anthropic',
      subtitle: 'تکنیک‌های تگ‌گذاری XML، سیستم پرامپت و فراخوانی ابزار',
      icon: Cpu,
      badge: 'Official',
      action: () => onNavigate('anthropic')
    },
    {
      id: 'cmd-daily-challenge',
      category: 'COMMANDS',
      categoryFa: 'چالش روز',
      title: 'شروع چالش روزانه (Daily Challenge)',
      subtitle: 'حل پرامپت روز و تداوم زنجیره یادگیری',
      icon: Flame,
      action: () => onNavigate('arena')
    },
    {
      id: 'cmd-lounge',
      category: 'COMMANDS',
      categoryFa: 'استراحت',
      title: 'اتاق استراحت و تمرکز (Focus Lounge)',
      subtitle: 'بازی‌های ۲۰۴۸، مار و تقویت حافظه پرامپت',
      icon: Coffee,
      action: () => onNavigate('lounge')
    },
    {
      id: 'cmd-resources',
      category: 'COMMANDS',
      categoryFa: 'مراجع',
      title: 'کتابخانه مراجع هوش مصنوعی',
      subtitle: 'مقاله‌ها، مستندات رسمی و راهنماهای مهندسی پرامپت',
      icon: Library,
      action: () => onNavigate('resources')
    },
    {
      id: 'cmd-profile',
      category: 'COMMANDS',
      categoryFa: 'پیشرفت',
      title: 'کارنامه، مهارت‌ها و نشان‌ها',
      subtitle: 'مشاهده آمار پیشرفت، رادار مهارت و افتخارات',
      icon: Trophy,
      action: () => onNavigate('profile')
    },
    {
      id: 'cmd-settings',
      category: 'COMMANDS',
      categoryFa: 'تنظیمات',
      title: 'تنظیمات پلتفرم و مدیریت داده‌ها',
      subtitle: 'خروجی JSON، بازیابی پشتیبان و تنظیمات ظاهری',
      icon: Settings,
      action: () => onOpenSettings ? onOpenSettings() : onNavigate('dashboard')
    }
  ], [progress.currentLessonId, onNavigate, onOpenSettings]);

  // Search Results computed across the application
  const searchResults: SearchResultItem[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const results: SearchResultItem[] = [];

    // Helper for matching text
    const match = (...texts: (string | undefined)[]) => {
      return texts.some((t) => t && t.toLowerCase().includes(q));
    };

    // 1. COURSES & LEVELS
    CURRICULUM_LEVELS.forEach((lvl) => {
      if (match(lvl.title, lvl.englishTitle, lvl.code, lvl.summary, lvl.keySkill)) {
        const isCompleted = lvl.lessons.every((l) => progress.completedLessons.includes(l.id));
        results.push({
          id: `level-${lvl.id}`,
          category: 'COURSES',
          categoryFa: 'سطوح دوره',
          title: `${lvl.code}: ${lvl.title}`,
          subtitle: lvl.summary,
          icon: Layers,
          badge: lvl.difficulty,
          isCompleted,
          action: () => onNavigate('lessons')
        });
      }
    });

    // 2. LESSONS
    CURRICULUM_LEVELS.forEach((lvl) => {
      lvl.lessons.forEach((l) => {
        if (match(l.title, l.englishTitle, l.shortDescription, l.concept, ...(l.corePrinciples || []))) {
          const isCompleted = progress.completedLessons.includes(l.id);
          results.push({
            id: `lesson-${l.id}`,
            category: 'LESSONS',
            categoryFa: 'دروس آموزشی',
            title: l.title,
            subtitle: `${lvl.code} • ${l.englishTitle} • ${l.duration}`,
            icon: BookOpen,
            badge: l.difficulty,
            isCompleted,
            action: () => onNavigate('lesson', l.id)
          });
        }
      });
    });

    // 3. ANTHROPIC TRACK
    ANTHROPIC_TRACK_ITEMS.forEach((item) => {
      if (match(item.title, item.englishTitle, item.overview, ...(item.claudeSpecifics || []), ...(item.topics || []))) {
        results.push({
          id: `anthropic-${item.id}`,
          category: 'LESSONS',
          categoryFa: 'مسیر Anthropic',
          title: item.title,
          subtitle: `Claude Official • ${item.englishTitle}`,
          icon: Cpu,
          badge: item.difficulty,
          action: () => onNavigate('anthropic')
        });
      }
    });

    // 4. PROMPT TEMPLATES (Playground & Benchmark)
    PLAYGROUND_TEMPLATES.forEach((tpl) => {
      if (match(tpl.title, tpl.englishTitle, tpl.categoryFa, tpl.useCase, ...(tpl.tags || []))) {
        results.push({
          id: `tpl-${tpl.id}`,
          category: 'PROMPTS',
          categoryFa: 'الگوهای پرامپت',
          title: tpl.title,
          subtitle: `${tpl.categoryFa} • ${tpl.useCase}`,
          icon: FileCode,
          badge: tpl.difficulty,
          action: () => onNavigate('playground')
        });
      }
    });

    BENCHMARK_TEMPLATES.forEach((bt) => {
      if (match(bt.title, bt.category, bt.description, bt.hypothesis)) {
        results.push({
          id: `bt-${bt.id}`,
          category: 'PROMPTS',
          categoryFa: 'الگوهای بنچ‌مارک',
          title: bt.title,
          subtitle: `${bt.category} • ${bt.description}`,
          icon: FlaskConical,
          action: () => onNavigate('benchmark')
        });
      }
    });

    // 5. SAVED USER PROMPTS & COLLECTIONS
    (progress.savedPrompts || []).forEach((p) => {
      if (match(p.title, p.userPrompt, ...(p.tags || []))) {
        results.push({
          id: `saved-${p.id}`,
          category: 'PROMPTS',
          categoryFa: 'پرامپت‌های من',
          title: p.title,
          subtitle: `ذخیره‌شده در ${p.createdAt} • مدل: ${p.model}`,
          icon: Bookmark,
          badge: 'شخصی',
          action: () => onNavigate('playground')
        });
      }
    });

    (progress.collections || []).forEach((c) => {
      if (match(c.title)) {
        results.push({
          id: `col-${c.id}`,
          category: 'PROMPTS',
          categoryFa: 'مجموعه‌ها',
          title: `مجموعه: ${c.title}`,
          subtitle: `ساخته‌شده در ${c.createdAt}`,
          icon: FolderHeart,
          action: () => onNavigate('playground')
        });
      }
    });

    // 6. ARENA & PROMPT MISSIONS
    ARENA_MISSIONS.forEach((m) => {
      if (match(m.title, m.englishTitle, m.category, m.scenarioBrief, m.businessGoal)) {
        const history = progress.arenaHistory?.[m.id];
        results.push({
          id: `arena-${m.id}`,
          category: 'MISSIONS',
          categoryFa: 'میدان چالش Arena',
          title: m.title,
          subtitle: `${m.category} • ${m.businessGoal}`,
          icon: Swords,
          badge: `${m.xpReward} XP`,
          isCompleted: history?.completed,
          action: () => onNavigate('arena', undefined, m.starterPrompt)
        });
      }
    });

    PROMPT_MISSIONS.forEach((pm) => {
      if (match(pm.title, pm.englishTitle, pm.category, pm.brief, pm.goal)) {
        results.push({
          id: `mission-${pm.id}`,
          category: 'MISSIONS',
          categoryFa: 'ماموریت‌های کاربردی',
          title: pm.title,
          subtitle: `${pm.category} • ${pm.goal}`,
          icon: Target,
          badge: pm.difficulty,
          action: () => onNavigate('arena', undefined, pm.starterPrompt)
        });
      }
    });

    // 7. RESOURCES
    CURATED_RESOURCES.forEach((r) => {
      if (match(r.title, r.englishTitle, r.category, r.shortDescription, ...(r.tags || []))) {
        results.push({
          id: `res-${r.id}`,
          category: 'RESOURCES',
          categoryFa: 'کتابخانه مراجع',
          title: r.title,
          subtitle: `${r.category} • ${r.source}`,
          icon: Library,
          badge: r.isOfficial ? 'رسمی' : undefined,
          action: () => onNavigate('resources')
        });
      }
    });

    // 8. MASTERY SKILLS
    const userSkills = calculateUserSkills(progress);
    userSkills.forEach((s) => {
      if (match(s.nameFa, s.nameEn, s.description, s.keyAction)) {
        results.push({
          id: `skill-${s.id}`,
          category: 'SKILLS',
          categoryFa: 'مهارت‌های تخصصی',
          title: `${s.nameFa} (${s.nameEn})`,
          subtitle: `${s.description} • سطح: ${s.tierFa}`,
          icon: Target,
          badge: `${s.score}/100`,
          action: () => onNavigate('profile')
        });
      }
    });

    // 9. ACHIEVEMENTS
    ACHIEVEMENTS.forEach((ach) => {
      if (match(ach.title, ach.englishTitle, ach.description, ach.conditionDescription)) {
        const isUnlocked = progress.unlockedAchievements?.includes(ach.id);
        results.push({
          id: `ach-${ach.id}`,
          category: 'ACHIEVEMENTS',
          categoryFa: 'دستاوردها',
          title: ach.title,
          subtitle: `${ach.description} • شرط: ${ach.conditionDescription}`,
          icon: Trophy,
          badge: isUnlocked ? 'آزاد شده' : 'قفل',
          isCompleted: isUnlocked,
          action: () => onNavigate('profile')
        });
      }
    });

    return results;
  }, [query, progress, onNavigate]);

  const displayedItems = query.trim() ? searchResults : commandItems;

  // Clamp selection index
  useEffect(() => {
    if (selectedIndex >= displayedItems.length) {
      setSelectedIndex(Math.max(0, displayedItems.length - 1));
    }
  }, [displayedItems.length, selectedIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < displayedItems.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : displayedItems.length - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (displayedItems[selectedIndex]) {
          displayedItems[selectedIndex].action();
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, displayedItems, selectedIndex, onClose]);

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.children[selectedIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-start justify-center pt-12 sm:pt-20 p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div 
        role="dialog"
        aria-modal="true"
        aria-label="جستجوی سراسری و پالت دستورات"
        className="w-full max-w-2xl bg-[#141417] border border-white/10 rounded-3xl shadow-2xl overflow-hidden text-right font-vazir relative flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar Input */}
        <div className="relative p-4 sm:p-5 border-b border-white/5 flex items-center gap-3 bg-[#111114]">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="جستجو در درس‌ها، الگوها، مأموریت‌ها، منابع و مهارت‌ها..."
            className="w-full bg-transparent text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none font-vazir"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="p-1 rounded-lg text-gray-400 hover:text-white"
              title="پاک کردن"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#0d0d10] hover:bg-white/10 text-gray-400 hover:text-white border border-white/5 shrink-0"
            title="بستن (Esc)"
          >
            <span className="text-[10px] font-mono px-1">Esc</span>
          </button>
        </div>

        {/* Results / Commands List */}
        <div 
          ref={listRef}
          className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 custom-scrollbar"
        >
          {displayedItems.length > 0 ? (
            displayedItems.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    item.action();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 text-right ${
                    isSelected
                      ? 'bg-gradient-to-l from-violet-600/20 to-cyan-500/10 border-cyan-400/40 shadow-[0_0_15px_rgba(34,211,238,0.1)]'
                      : 'bg-[#0d0d10] border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-cyan-400 text-black' : 'bg-white/5 text-gray-400'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="space-y-0.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs sm:text-sm font-bold text-white truncate">
                          {item.title}
                        </span>
                        {item.isCompleted && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        )}
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-400 font-mono">
                          {item.categoryFa}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-1">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.badge && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-400/10 text-cyan-300 border border-cyan-400/20">
                        {item.badge}
                      </span>
                    )}
                    <ArrowLeft className={`w-4 h-4 transition-transform ${
                      isSelected ? 'text-cyan-400 -translate-x-1' : 'text-gray-600'
                    }`} />
                  </div>
                </div>
              );
            })
          ) : (
            /* Empty State */
            <div className="py-12 px-4 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-gray-500 mx-auto flex items-center justify-center">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">چیزی پیدا نشد</h4>
              <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
                عبارت دیگری را امتحان کن. می‌توانی از کلمات کلیدی فارسی یا انگلیسی مانند «XML»، «Few-Shot»، «کانتکست»، «مدل» یا «نقش» استفاده کنی.
              </p>
            </div>
          )}
        </div>

        {/* Keyboard navigation footer */}
        <div className="p-3 border-t border-white/5 bg-[#0d0d10] flex items-center justify-between text-[11px] text-gray-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded font-mono text-[10px]">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded font-mono text-[10px]">↓</kbd>
              <span>جابجایی</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded font-mono text-[10px]">Enter</kbd>
              <span>انتخاب</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded font-mono text-[10px]">Esc</kbd>
              <span>بستن</span>
            </span>
          </div>

          <span className="text-gray-500 hidden sm:inline">
            {query.trim() ? `${searchResults.length} نتیجه یافت شد` : 'پالت دستورات PromptLab'}
          </span>
        </div>
      </div>
    </div>
  );
};
