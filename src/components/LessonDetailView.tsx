import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  CheckCircle2, 
  BookOpen, 
  Code2, 
  Trophy, 
  Terminal, 
  Layers, 
  Clock, 
  Sparkles, 
  Share2, 
  Bookmark,
  Play
} from 'lucide-react';
import { CURRICULUM_LEVELS } from '../data/curriculum';
import { useProgress } from '../context/ProgressContext';
import { LessonRenderer } from './LessonRenderer';
import { InteractiveExerciseCard } from './InteractiveExerciseCard';
import { ChallengeCard } from './ChallengeCard';

interface LessonDetailViewProps {
  lessonId: string;
  onNavigate: (view: string, lessonId?: string, starterPrompt?: string) => void;
}

export const LessonDetailView: React.FC<LessonDetailViewProps> = ({
  lessonId,
  onNavigate
}) => {
  const { progress, markLessonCompleted, setCurrentLesson } = useProgress();
  const [activeTab, setActiveTab] = useState<'content' | 'exercise' | 'challenge' | 'playground'>('content');
  const [justCompleted, setJustCompleted] = useState(false);

  // Flatten all lessons across all 12 curriculum levels
  const allLessons = CURRICULUM_LEVELS.flatMap((lvl) => lvl.lessons);
  const currentLessonIndex = allLessons.findIndex((l) => l.id === lessonId);
  const currentLesson = allLessons[currentLessonIndex] || allLessons[0];
  const currentLevel = CURRICULUM_LEVELS.find((lvl) => lvl.id === currentLesson.levelId) || CURRICULUM_LEVELS[0];

  const prevLesson = currentLessonIndex > 0 ? allLessons[currentLessonIndex - 1] : null;
  const nextLesson = currentLessonIndex < allLessons.length - 1 ? allLessons[currentLessonIndex + 1] : null;

  const isCompleted = progress.completedLessons.includes(currentLesson.id);

  // Sync active lesson on mount
  useEffect(() => {
    setCurrentLesson(currentLesson.id, currentLesson.levelId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveTab('content');
    setJustCompleted(false);
  }, [lessonId]);

  const handleCompleteLesson = () => {
    markLessonCompleted(currentLesson.id);
    setJustCompleted(true);
  };

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-300">
      
      {/* 1. Breadcrumbs & Top Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <button 
            onClick={() => onNavigate('lessons')}
            className="hover:text-white transition-colors"
          >
            فهرست دروس
          </button>
          <span>/</span>
          <span className="text-cyan-400 font-mono">{currentLevel.code}</span>
          <span>/</span>
          <span className="text-white font-medium truncate max-w-[200px] sm:max-w-xs">{currentLesson.title}</span>
        </div>

        {/* Previous / Next Lesson Quick Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => prevLesson && onNavigate('lesson', prevLesson.id)}
            disabled={!prevLesson}
            className={`p-2 rounded-xl bg-[#141414] border border-white/5 text-xs flex items-center gap-1 transition-colors ${
              prevLesson ? 'text-gray-300 hover:text-white hover:border-white/20' : 'text-gray-600 opacity-40 cursor-not-allowed'
            }`}
            title={prevLesson ? `درس قبلی: ${prevLesson.title}` : 'درس اول'}
          >
            <ArrowRight className="w-4 h-4" />
            <span className="hidden sm:inline">درس قبل</span>
          </button>

          <button
            onClick={() => nextLesson && onNavigate('lesson', nextLesson.id)}
            disabled={!nextLesson}
            className={`p-2 rounded-xl bg-[#141414] border border-white/5 text-xs flex items-center gap-1 transition-colors ${
              nextLesson ? 'text-cyan-300 hover:text-white hover:border-cyan-400/40' : 'text-gray-600 opacity-40 cursor-not-allowed'
            }`}
            title={nextLesson ? `درس بعدی: ${nextLesson.title}` : 'درس آخر'}
          >
            <span className="hidden sm:inline">درس بعد</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Hero Lesson Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-[#161616] to-[#0f0f0f] border border-white/5 p-6 sm:p-8 shadow-2xl space-y-4">
        {/* Top ambient color glow */}
        <div className="absolute top-0 right-0 left-0 h-[2px] bg-gradient-to-r from-cyan-400 via-violet-500 to-purple-500" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-400/10 text-cyan-300 border border-cyan-400/30">
                {currentLevel.code} • درس {currentLesson.id}
              </span>
              <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-white/5 text-gray-400">
                سطح: {currentLesson.difficulty}
              </span>
              <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-white/5 text-gray-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-cyan-400" />
                <span>{currentLesson.duration}</span>
              </span>
              {isCompleted && (
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <Check className="w-3 h-3 stroke-[3]" />
                  <span>تکمیل شده</span>
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              {currentLesson.title}
            </h1>
            
            <p className="text-xs sm:text-sm font-mono text-cyan-400/80">
              {currentLesson.englishTitle}
            </p>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed pt-1">
              {currentLesson.shortDescription}
            </p>
          </div>

          {/* Quick Lesson Completion Badge / Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleCompleteLesson}
              className={`px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-lg ${
                isCompleted
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
              }`}
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{isCompleted ? 'تکمیل شده ✓' : 'علامت‌گذاری به عنوان تکمیل شده'}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="pt-4 border-t border-white/5 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('content')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'content'
                ? 'bg-cyan-400 text-black shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                : 'bg-[#141414] text-gray-400 hover:text-white border border-white/5'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>آموزش و محتوای درس</span>
          </button>

          <button
            onClick={() => setActiveTab('exercise')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'exercise'
                ? 'bg-emerald-400 text-black shadow-[0_0_15px_rgba(52,211,153,0.3)]'
                : 'bg-[#141414] text-gray-400 hover:text-white border border-white/5'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>تمرین تعاملی درس</span>
            {progress.completedExercises.includes(currentLesson.exercise.id) && (
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('challenge')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'challenge'
                ? 'bg-amber-400 text-black shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                : 'bg-[#141414] text-gray-400 hover:text-white border border-white/5'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>چالش مهارتی (+۱۵۰ XP)</span>
            {progress.completedChallenges.includes(currentLesson.challenge.id) && (
              <span className="w-2 h-2 rounded-full bg-amber-400" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('playground')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'playground'
                ? 'bg-violet-500 text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]'
                : 'bg-[#141414] text-gray-400 hover:text-white border border-white/5'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>کارگاه آزمایشی (Sandbox)</span>
          </button>
        </div>
      </div>

      {/* 3. MAIN TAB CONTENT */}
      
      {/* TAB 1: Core Educational Content */}
      {activeTab === 'content' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <LessonRenderer 
            lesson={currentLesson} 
            isCompleted={isCompleted}
            onCompleteLesson={handleCompleteLesson}
          />

          {/* Bottom Completion & Next Lesson Section */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#141414] border border-cyan-400/20 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
            <div className="space-y-1 text-center sm:text-right">
              <span className="text-xs text-cyan-400 font-bold block">
                {isCompleted ? '✓ این درس در کارنامه شما ثبت شده است' : 'گام بعدی خود را تثبیت کنید'}
              </span>
              <h4 className="text-white font-bold text-base">
                آماده یادگیری مبحث بعدی هستید؟
              </h4>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleCompleteLesson}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>{isCompleted ? 'تکمیل شده ✓' : 'درس را کامل کردم (+۱۰۰ XP)'}</span>
              </button>

              {nextLesson && (
                <button
                  onClick={() => onNavigate('lesson', nextLesson.id)}
                  className="px-6 py-3 rounded-xl bg-white text-black hover:bg-cyan-400 font-bold text-xs sm:text-sm flex items-center gap-2 transition-colors"
                >
                  <span>ورود به درس بعدی: {nextLesson.title}</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Interactive Exercise */}
      {activeTab === 'exercise' && (
        <div className="animate-in fade-in duration-200">
          <InteractiveExerciseCard 
            exercise={currentLesson.exercise}
            onSuccess={() => {
              if (!isCompleted) markLessonCompleted(currentLesson.id);
            }}
          />
        </div>
      )}

      {/* TAB 3: Challenge */}
      {activeTab === 'challenge' && (
        <div className="animate-in fade-in duration-200">
          <ChallengeCard 
            challenge={currentLesson.challenge}
            onCompleted={() => {
              if (!isCompleted) markLessonCompleted(currentLesson.id);
            }}
          />
        </div>
      )}

      {/* TAB 4: In-Lesson Sandbox Playground */}
      {activeTab === 'playground' && (
        <div className="p-6 rounded-3xl bg-[#141414] border border-white/5 space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">کارگاه آزمایش سریع: {currentLesson.title}</h3>
              <p className="text-xs text-gray-400">پرامپت را تغییر دهید و اثر تغییرات را در خروجی مدل بررسی کنید.</p>
            </div>
            <button
              onClick={() => onNavigate('playground', undefined, currentLesson.comparison?.proPrompt || currentLesson.realWorldUseCase?.practicalPrompt)}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
            >
              <span>باز کردن کارگاه تمام‌صفحه</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-300 block">ویرایشگر پرامپت</label>
              <textarea
                defaultValue={currentLesson.comparison?.proPrompt || ''}
                rows={10}
                className="w-full p-4 bg-[#0a0a0a] border border-white/10 rounded-2xl text-xs font-mono text-gray-200 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-300 block">پیش‌نمایش خروجی شبیه‌سازی‌شده هوش مصنوعی</label>
              <div className="w-full h-[220px] p-4 bg-[#070707] border border-white/5 rounded-2xl text-xs font-mono text-cyan-300 overflow-y-auto whitespace-pre-wrap">
                {currentLesson.comparison?.proOutput || ''}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
