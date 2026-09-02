import React from 'react';
import { 
  Sparkles, 
  ArrowLeft, 
  Play, 
  Flame, 
  CheckCircle2, 
  Layers, 
  Award, 
  Terminal, 
  Cpu, 
  TrendingUp, 
  Zap, 
  Compass, 
  ArrowUpRight,
  ShieldCheck,
  Code2,
  Swords,
  FlaskConical,
  Coffee,
  BookOpen,
  Target,
  FileCode,
  Dumbbell
} from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { CURRICULUM_LEVELS } from '../data/curriculum';
import { DailyChallengeCard } from './DailyChallengeCard';
import { SkillRadarView } from './SkillRadarView';
import { getNextStepRecommendation } from '../utils/recommendationEngine';

interface DashboardViewProps {
  onNavigate: (view: string, lessonId?: string, starterPrompt?: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const { progress, totalLessonsCount, completedLessonsCount } = useProgress();

  // Find active lesson & level
  const activeLevel = CURRICULUM_LEVELS.find((lvl) => lvl.id === progress.currentLevelId) || CURRICULUM_LEVELS[0];
  const activeLesson = activeLevel.lessons.find((l) => l.id === progress.currentLessonId) || activeLevel.lessons[0];

  // Calculate recommendation
  const recommendation = getNextStepRecommendation(progress);

  const handleStartDailyChallenge = (starterPrompt: string) => {
    onNavigate('arena', undefined, starterPrompt);
  };

  return (
    <div className="space-y-8 pb-12 w-full max-w-[1720px] mx-auto animate-in fade-in duration-300">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-[#141414] via-[#101014] to-[#0a0a0d] border border-white/5 p-6 lg:p-8 2xl:p-10 shadow-2xl">
        {/* Background Watermark */}
        <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none select-none">
          <span className="text-8xl lg:text-9xl 2xl:text-[11rem] font-serif italic leading-none text-white">{activeLevel.code}</span>
        </div>

        <div className="relative z-10 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-8 2xl:gap-12">
          <div className="space-y-4 max-w-2xl 2xl:max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>نسل جدید یادگیری هوش مصنوعی تجاری و سیستماتیک</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl 2xl:text-5xl font-extrabold text-white tracking-tight leading-tight">
              به آزمایشگاه مهندسی پرامپت خوش آمدید
            </h1>
            
            <p className="text-gray-400 text-xs sm:text-sm 2xl:text-base leading-relaxed font-vazir max-w-2xl">
              از اولین پرامپت ساده تا طراحی سیستم‌های هوش مصنوعی پیشرفته با متدولوژی‌های استاندارد Anthropic و OpenAI.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigate('lesson', activeLesson.id)}
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:brightness-110 text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-[0_4px_15px_rgba(124,58,237,0.4)] transition-all"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>ادامه یادگیری درس فعال</span>
              </button>

              <button
                onClick={() => onNavigate('playground')}
                className="px-4 py-3 rounded-xl bg-white text-black hover:bg-cyan-400 text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors"
              >
                <Terminal className="w-4 h-4" />
                <span>ورود به Prompt Playground</span>
              </button>

              <button
                onClick={() => onNavigate('arena')}
                className="px-4 py-3 rounded-xl bg-[#1c1a24] text-violet-300 hover:text-white hover:bg-violet-900/40 border border-violet-500/30 text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors"
              >
                <Swords className="w-4 h-4" />
                <span>میدان چالش (Arena)</span>
              </button>
            </div>
          </div>

          {/* Master Progress Radial Card */}
          <div className="w-full xl:w-96 bg-[#141414] border border-white/10 rounded-3xl p-6 2xl:p-7 shadow-xl space-y-4 shrink-0">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400 italic">پیشرفت کلی دوره</span>
              <span className="text-white font-mono font-bold text-sm">{progress.overallPercentage}٪</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 via-violet-600 to-purple-600 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all duration-700"
                style={{ width: `${progress.overallPercentage}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-xl bg-[#1a1a1a] border border-white/5 text-center">
                <span className="text-gray-500 text-[11px] block">دروس گذرانده</span>
                <span className="text-base 2xl:text-lg font-bold text-cyan-400 font-mono">
                  {completedLessonsCount} / {totalLessonsCount}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#1a1a1a] border border-white/5 text-center">
                <span className="text-gray-500 text-[11px] block">مجموع XP</span>
                <span className="text-base 2xl:text-lg font-bold text-purple-400 font-mono">
                  {progress.xp}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Personalized "What's Next" Engine Card */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-violet-950/20 via-[#121217] to-[#0f0f13] border border-violet-500/30 p-5 sm:p-6 shadow-xl space-y-3 font-vazir">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-400/15 text-cyan-300 border border-cyan-400/25">
                {recommendation.badge}
              </span>
              <span className="text-xs text-gray-400 font-medium">پیشنهاد هوشمند برای گام بعدی شما</span>
              {recommendation.xpReward && (
                <span className="text-[10px] font-mono text-purple-400 font-bold">
                  +{recommendation.xpReward} XP
                </span>
              )}
            </div>

            <h3 className="text-base sm:text-lg font-extrabold text-white">
              {recommendation.title}
            </h3>
            
            <p className="text-xs text-gray-300 leading-relaxed max-w-3xl">
              <strong className="text-cyan-400 font-bold ml-1">چرا این مرحله؟</strong>
              {recommendation.reason}
            </p>
          </div>

          <button
            onClick={() => onNavigate(recommendation.actionView, recommendation.lessonId, recommendation.starterPrompt)}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-600 hover:brightness-110 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(34,211,238,0.2)] shrink-0"
          >
            <span>{recommendation.actionText}</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 3. Quick Start Actions Section */}
      <section className="space-y-3 font-vazir">
        <div className="flex items-center justify-between">
          <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>شروع سریع (Quick Start Actions)</span>
          </h3>
          <span className="text-xs text-gray-500">دسترسی بدون فوت وقت به ابزارهای کلیدی</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            {
              id: 'qs-continue',
              title: 'ادامه یادگیری',
              desc: 'ورود مستقیم به درس فعال',
              icon: BookOpen,
              color: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
              action: () => onNavigate('lesson', activeLesson.id)
            },
            {
              id: 'qs-playground',
              title: 'ساخت یک Prompt',
              desc: 'کارگاه پرامپت با تگ‌های استاندارد',
              icon: Terminal,
              color: 'text-violet-400 bg-violet-400/10 border-violet-400/20',
              action: () => onNavigate('playground')
            },
            {
              id: 'qs-exercises',
              title: 'تمرین سریع',
              desc: 'مرور تمرین‌ها و سوالات ۴گزینه‌ای',
              icon: Dumbbell,
              color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
              action: () => onNavigate('exercises')
            },
            {
              id: 'qs-daily',
              title: 'چالش امروز',
              desc: 'حل پرامپت روز و کسب استریک',
              icon: Flame,
              color: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
              action: () => onNavigate('arena')
            },
            {
              id: 'qs-benchmark',
              title: 'آزمایش یک Prompt',
              desc: 'مقایسه خروجی روی مدل‌های AI',
              icon: FlaskConical,
              color: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
              action: () => onNavigate('benchmark')
            },
            {
              id: 'qs-lounge',
              title: 'استراحت کوتاه',
              desc: 'اتاق تمرکز و مینی‌گیم‌ها',
              icon: Coffee,
              color: 'text-sky-400 bg-sky-400/10 border-sky-400/20',
              action: () => onNavigate('lounge')
            }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={item.action}
                className="p-3.5 rounded-2xl bg-[#141417] border border-white/5 hover:border-cyan-400/30 hover:bg-[#181820] transition-all cursor-pointer group flex flex-col justify-between space-y-2 shadow-sm"
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${item.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-gray-400 line-clamp-1">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Daily Challenge & Prompt of the Day */}
      <section className="space-y-3">
        <DailyChallengeCard onStartChallenge={handleStartDailyChallenge} />
      </section>

      {/* 5. Skill Radar Matrix (Compact) */}
      <section className="space-y-3">
        <SkillRadarView compact={true} />
      </section>

      {/* 6. Curriculum Pathways & Interactive Playground */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 2xl:gap-8">
        
        {/* Left 8 Cols (at xl/2xl): Course Modules & Playground Banner */}
        <div className="xl:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>سطوح و واحدهای آموزشی در دسترس</span>
            </h3>

            <button
              onClick={() => onNavigate('lessons')}
              className="text-xs text-gray-400 hover:text-cyan-400 flex items-center gap-1 transition-colors"
            >
              <span>مشاهده کل سرفصل‌ها</span>
              <ArrowLeft className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-4">
            {CURRICULUM_LEVELS.slice(0, 4).map((lvl) => {
              const isCurrent = lvl.id === progress.currentLevelId;
              const isCompleted = lvl.lessons.every((l) => progress.completedLessons.includes(l.id));

              return (
                <div
                  key={lvl.id}
                  onClick={() => onNavigate('lessons')}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer group flex flex-col justify-between ${
                    isCurrent
                      ? 'bg-[#181820] border-cyan-400/40 shadow-[0_0_20px_rgba(34,211,238,0.1)]'
                      : isCompleted
                      ? 'bg-[#111111] border-emerald-500/20'
                      : 'bg-[#111111] border-white/5 hover:border-white/10'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-xs font-bold text-cyan-400">
                        {lvl.code}
                      </span>

                      {isCompleted ? (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          تکمیل شده
                        </span>
                      ) : isCurrent ? (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-cyan-400/10 text-cyan-400 border border-cyan-400/20 animate-pulse">
                          سطح فعال
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/5 text-gray-400">
                          {lvl.difficulty}
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-sm text-white mb-1.5 font-vazir">
                      {lvl.title}
                    </h4>
                    <p className="text-xs text-gray-400 line-clamp-2 mb-3 leading-relaxed font-vazir">
                      {lvl.summary}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-gray-500 mt-auto">
                    <span>{lvl.lessons.length} درس تخصصی</span>
                    <span className="text-cyan-400 flex items-center gap-0.5 font-medium group-hover:translate-x-[-2px] transition-transform">
                      ورود
                      <ArrowLeft className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Playground Banner */}
          <div className="bg-[#111111] border border-white/5 rounded-2xl p-6 flex flex-col justify-between space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-xs text-violet-400 uppercase tracking-widest mb-1 font-mono">Terminal / Playground 2.0</div>
                <div className="text-lg font-bold text-white font-vazir">آزمایشگاه تعاملی پرامپت و دستیار هوشمند Mentor</div>
              </div>
              <button
                onClick={() => onNavigate('playground')}
                className="bg-white text-black text-xs font-bold px-4 py-2 rounded-lg hover:bg-cyan-400 transition-colors"
              >
                اجرای آزمایش
              </button>
            </div>

            <div className="bg-black/50 rounded-xl p-4 font-mono text-xs flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 sm:space-x-reverse border border-white/5">
              <div className="flex-1 text-gray-400">
                <span className="text-cyan-400">Input: </span>
                «شما یک مهندس ارشد سیستم‌های ابری هستید...»
              </div>
              <div className="hidden sm:block w-[1px] bg-white/10" />
              <div className="flex-1 text-gray-400">
                <span className="text-violet-400">Mentor: </span>
                «ساختار نقش و تگ‌ها عالی است؛ گاردریل‌های منفی را اضافه کنید.»
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 Cols (at xl/2xl): Anthropic Track Card & Lounge & Spotlight */}
        <div className="xl:col-span-4 space-y-6">
          
          {/* Anthropic Learning Track Teaser */}
          <div className="bg-[#0d0d0d] border border-white/5 rounded-3xl p-6 space-y-5 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Anthropic Track</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-violet-500/10 text-violet-400 border border-violet-500/20">Official</span>
            </div>

            <div className="space-y-3">
              <div 
                onClick={() => onNavigate('anthropic')}
                className="flex items-center space-x-3 space-x-reverse p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group border border-transparent hover:border-white/5"
              >
                <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-lg shrink-0">
                  📑
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors font-vazir">اصول ساختاردهی با تگ‌های XML</span>
                  <span className="text-[10px] text-gray-500 font-mono">Claude 3.7 Methodology</span>
                </div>
              </div>

              <div 
                onClick={() => onNavigate('anthropic')}
                className="flex items-center space-x-3 space-x-reverse p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group border border-transparent hover:border-white/5"
              >
                <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-lg shrink-0">
                  ⚙️
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors font-vazir">فراخوانی ابزارها و توابع (Tool Use)</span>
                  <span className="text-[10px] text-gray-500 font-mono">Structured Function Calling</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('anthropic')}
              className="w-full py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-white/10"
            >
              <span>مشاهده مسیر کلود</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* AI Benchmark Lab Card */}
          <div 
            onClick={() => onNavigate('benchmark')}
            className="bg-[#14141c] hover:bg-[#181824] border border-cyan-500/25 hover:border-cyan-500/50 rounded-3xl p-6 space-y-4 shadow-xl cursor-pointer transition-all group relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center text-sm">
                  <FlaskConical className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white font-vazir">آزمایشگاه بنچ‌مارک (AI Benchmark Lab)</h3>
                  <span className="text-[10px] text-gray-500 font-mono">Claude • GPT-4o • Gemini</span>
                </div>
              </div>
              <span className="text-[9px] px-2 py-0.5 rounded-full font-vazir bg-cyan-500/15 text-cyan-300 border border-cyan-500/20">
                مقایسه مدل‌ها
              </span>
            </div>

            <p className="text-xs text-gray-400 font-vazir leading-relaxed">
              پرامپت خود را در برابر مدل‌های مختلف بسنجید؛ زمان پاسخ‌دهی، تگ‌ها و خروجی ساختاریافته را مقایسه کنید.
            </p>

            <div className="flex items-center justify-between text-xs text-cyan-400 font-medium font-vazir pt-1 group-hover:translate-x-[-2px] transition-transform">
              <span>ورود به آزمایشگاه بنچ‌مارک</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Focus Lounge Teaser Card */}
          <div 
            onClick={() => onNavigate('lounge')}
            className="bg-[#141414] hover:bg-[#161616] border border-amber-500/20 hover:border-amber-500/40 rounded-3xl p-6 space-y-4 shadow-xl cursor-pointer transition-all group relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center text-sm">
                  ☕
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white font-vazir">اتاق استراحت (Focus Lounge)</h3>
                  <span className="text-[10px] text-gray-500 font-mono">Break Timer & Mini Games</span>
                </div>
              </div>
              <span className="text-[9px] px-2 py-0.5 rounded-full font-vazir bg-amber-500/15 text-amber-300 border border-amber-500/20">
                ۳ بازی
              </span>
            </div>

            <p className="text-xs text-gray-400 font-vazir leading-relaxed">
              چند دقیقه ذهن را با مار کلاسیک، ۲۰۴۸ یا حافظه پرامپت شارژ کنید.
            </p>

            <div className="flex items-center justify-between text-xs text-amber-400 font-medium font-vazir pt-1 group-hover:translate-x-[-2px] transition-transform">
              <span>ورود به اتاق تمرکز</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Achievement Spotlight Card */}
          <div 
            onClick={() => onNavigate('profile')}
            className="bg-gradient-to-br from-cyan-400/10 to-violet-600/10 border border-cyan-400/20 rounded-3xl p-6 flex flex-col items-center justify-center text-center space-y-2 cursor-pointer hover:border-cyan-400/40 transition-all"
          >
            <div className="text-3xl">🏆</div>
            <div className="text-sm font-bold text-white font-vazir">نشان Prompt Architect</div>
            <div className="text-[10px] text-cyan-400 uppercase tracking-widest font-mono">Unlocks at Level ۰۵</div>
            <span className="text-xs text-gray-400 pt-1 font-vazir">مشاهده کارنامه و نشان‌ها ←</span>
          </div>

        </div>

      </div>

    </div>
  );
};
