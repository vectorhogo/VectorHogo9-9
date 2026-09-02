import React from 'react';
import { 
  CheckCircle2, 
  Lock, 
  ArrowLeft, 
  Sparkles, 
  Layers, 
  Clock, 
  Award, 
  BookOpen,
  ArrowDown,
  Play
} from 'lucide-react';
import { CURRICULUM_LEVELS } from '../data/curriculum';
import { useProgress } from '../context/ProgressContext';
import { LevelStatus } from '../types';

interface RoadmapViewProps {
  onNavigate: (view: string, lessonId?: string) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({ onNavigate }) => {
  const { progress, isLessonCompleted, isLevelLocked } = useProgress();

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-semibold text-cyan-400">CURRICULUM ROADMAP</span>
            <span className="text-xs text-gray-500">•</span>
            <span className="text-xs text-gray-400">۱۲ سطح مهارتی پیوسته</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            نقشه راه یادگیری مهندسی پرامپت
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-2xl">
            مسیر استاندارد پیشرفت از سطوح بنیادین تا ساخت سیستم‌های خودران ایجنتیک و داوری پیشرفته هوش مصنوعی.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 bg-[#141414] px-4 py-2 rounded-2xl border border-white/10 text-xs">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/30 border border-emerald-400" />
            <span>تکمیل شده</span>
          </div>
          <div className="flex items-center gap-1.5 text-cyan-400">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500/30 border border-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
            <span>سطح جاری</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-500">
            <span className="w-2.5 h-2.5 rounded-full bg-[#222] border border-gray-600" />
            <span>قفل شده</span>
          </div>
        </div>
      </div>

      {/* Vertical Connected Roadmap Grid */}
      <div className="relative max-w-5xl mx-auto space-y-6">
        
        {/* Timeline Center Guideline for desktop */}
        <div className="absolute top-12 bottom-12 right-6 md:right-8 w-0.5 bg-gradient-to-b from-cyan-400 via-violet-600 to-transparent hidden md:block opacity-20" />

        {CURRICULUM_LEVELS.map((level, index) => {
          const completedCount = level.lessons.filter((l) => isLessonCompleted(l.id)).length;
          const isComplete = completedCount === level.lessons.length;
          const isCurrent = level.id === progress.currentLevelId;
          const locked = isLevelLocked(level.id);

          let status: LevelStatus = 'locked';
          if (isComplete) status = 'completed';
          else if (!locked) status = 'current';

          return (
            <div
              key={level.id}
              className={`relative rounded-3xl transition-all duration-300 ${
                status === 'completed'
                  ? 'bg-[#141414] border border-emerald-500/30 hover:border-emerald-500/50'
                  : status === 'current'
                  ? 'bg-[#1a1a1a] border border-cyan-400/30 shadow-[0_0_25px_rgba(34,211,238,0.1)] scale-[1.01]'
                  : 'bg-[#0d0d0d] border border-white/5 opacity-70 hover:opacity-90'
              } p-6 sm:p-7`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                
                {/* Left side: Node info */}
                <div className="flex items-start gap-4">
                  
                  {/* Status Indicator Icon */}
                  <div className="shrink-0 mt-1">
                    {status === 'completed' ? (
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                    ) : status === 'current' ? (
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.4)]">
                        <Sparkles className="w-5 h-5" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500">
                        <Lock className="w-5 h-5" />
                      </div>
                    )}
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-white/5 text-gray-300 border border-white/10">
                        {level.code}
                      </span>
                      <span className="text-xs text-gray-500 font-mono hidden sm:inline">
                        {level.englishTitle}
                      </span>
                      {status === 'completed' && (
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                          تکمیل شده ✓
                        </span>
                      )}
                      {status === 'current' && (
                        <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-cyan-400/10 text-cyan-400 border border-cyan-400/20">
                          سطح جاری در حال مطالعه →
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                      {level.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                      {level.summary}
                    </p>

                    {/* Key skill acquired */}
                    <div className="pt-1 flex items-center gap-2 text-xs text-gray-500">
                      <span className="text-cyan-400 font-medium">مهارت کلیدی:</span>
                      <span className="text-gray-300">{level.keySkill}</span>
                    </div>
                  </div>
                </div>

                {/* Right side: Action & Details */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-white/5">
                  <div className="text-right text-xs space-y-1">
                    <div className="flex items-center gap-3 text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        {level.estimatedHours}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 text-gray-400" />
                        {level.lessons.length} درس
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-500">
                      تکمیل: {completedCount} از {level.lessons.length} درس
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate('lesson', level.lessons[0].id)}
                    disabled={status === 'locked'}
                    className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                      status === 'current'
                        ? 'bg-gradient-to-r from-violet-600 to-purple-600 hover:brightness-110 text-white font-bold shadow-[0_4px_15px_rgba(124,58,237,0.3)]'
                        : status === 'completed'
                        ? 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-200 border border-emerald-500/40'
                        : 'bg-white/5 text-gray-500 border border-white/5 cursor-not-allowed'
                    }`}
                  >
                    {status === 'current' ? (
                      <>
                        <span>شروع / ادامه درس</span>
                        <ArrowLeft className="w-4 h-4" />
                      </>
                    ) : status === 'completed' ? (
                      <>
                        <span>مرور درس‌ها</span>
                        <ArrowLeft className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>قفل است</span>
                      </>
                    )}
                  </button>
                </div>

              </div>

              {/* Sub-lessons list preview for active/completed levels */}
              {!locked && (
                <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {level.lessons.map((lesson) => {
                    const done = isLessonCompleted(lesson.id);
                    return (
                      <div
                        key={lesson.id}
                        onClick={() => onNavigate('lesson', lesson.id)}
                        className={`p-3 rounded-2xl border flex items-center justify-between text-xs cursor-pointer transition-all ${
                          done
                            ? 'bg-emerald-500/5 border-emerald-500/20 text-gray-300 hover:bg-emerald-500/10'
                            : 'bg-[#0d0d0d] border-white/5 text-gray-300 hover:border-cyan-400/30'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          {done ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          ) : (
                            <Play className="w-3 h-3 text-cyan-400 shrink-0 fill-current" />
                          )}
                          <span className="truncate font-medium">{lesson.title}</span>
                        </div>
                        <span className="text-[10px] text-gray-500 shrink-0 font-mono mr-2">{lesson.duration}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

      </div>
    </div>
  );
};
