import React from 'react';
import { 
  Trophy, 
  Award, 
  Flame, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  Terminal, 
  BookOpen, 
  Code2, 
  ShieldCheck, 
  Layout, 
  Compass, 
  Copy, 
  Network, 
  FlaskConical,
  Lock,
  Download,
  Share2
} from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { ACHIEVEMENTS } from '../data/achievements';
import { CURRICULUM_LEVELS } from '../data/curriculum';
import { SkillRadarView } from './SkillRadarView';

export const ProfileView: React.FC = () => {
  const { progress, totalLessonsCount, completedLessonsCount } = useProgress();

  const iconMap: Record<string, React.ReactNode> = {
    Sparkles: <Sparkles className="w-5 h-5" />,
    Trophy: <Trophy className="w-5 h-5" />,
    Layout: <Layout className="w-5 h-5" />,
    Compass: <Compass className="w-5 h-5" />,
    Copy: <Copy className="w-5 h-5" />,
    ShieldCheck: <ShieldCheck className="w-5 h-5" />,
    Network: <Network className="w-5 h-5" />,
    FlaskConical: <FlaskConical className="w-5 h-5" />,
    Flame: <Flame className="w-5 h-5" />
  };

  const currentLevel = CURRICULUM_LEVELS.find((l) => l.id === progress.currentLevelId) || CURRICULUM_LEVELS[0];

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      
      {/* Profile Identity Card */}
      <div className="relative overflow-hidden rounded-3xl bg-[#141414] border border-white/5 p-6 lg:p-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-400 p-[2px] shadow-[0_0_20px_rgba(124,58,237,0.3)]">
              <div className="w-full h-full bg-[#0d0d0d] rounded-2xl flex items-center justify-center text-cyan-400 font-extrabold text-2xl">
                PL
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-white font-vazir">
                  مهندس پرامپت (Prompt Engineer)
                </h1>
                <span className="text-xs px-3 py-1 rounded-full bg-cyan-400/10 text-cyan-300 border border-cyan-400/20 font-mono">
                  سطح {currentLevel.code}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1 font-vazir">
                کارنامه مهارتی، ماتریس تسلط و نشان‌های افتخار در پلتفرم PromptLab
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-left bg-[#0d0d0d] px-5 py-3 rounded-2xl border border-white/5">
              <span className="text-gray-400 text-[11px] block font-vazir">مجموع امتیاز مهارتی:</span>
              <span className="text-lg font-extrabold text-violet-400 font-mono">{progress.xp} XP</span>
            </div>
          </div>

        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#141414] border border-white/5 p-5 rounded-3xl">
          <span className="text-xs text-gray-400 block mb-1 font-vazir">دروس گذرانده</span>
          <div className="text-xl font-bold text-white font-mono">{completedLessonsCount} / {totalLessonsCount}</div>
          <span className="text-[11px] text-cyan-400 font-medium font-vazir">{progress.overallPercentage}٪ دوره</span>
        </div>

        <div className="bg-[#141414] border border-white/5 p-5 rounded-3xl">
          <span className="text-xs text-gray-400 block mb-1 font-vazir">استمرار روزانه (Streak)</span>
          <div className="text-xl font-bold text-white font-mono">{progress.learningStreakDays} روز</div>
          <span className="text-[11px] text-amber-400 font-medium font-vazir">پیوستگی بدون وقفه</span>
        </div>

        <div className="bg-[#141414] border border-white/5 p-5 rounded-3xl">
          <span className="text-xs text-gray-400 block mb-1 font-vazir">تمرین‌های حل‌شده</span>
          <div className="text-xl font-bold text-white font-mono">{progress.completedExercises.length}</div>
          <span className="text-[11px] text-emerald-400 font-medium font-vazir">اعتبارسنجی شده</span>
        </div>

        <div className="bg-[#141414] border border-white/5 p-5 rounded-3xl">
          <span className="text-xs text-gray-400 block mb-1 font-vazir">چالش‌های Arena & Mission</span>
          <div className="text-xl font-bold text-white font-mono">{Object.keys(progress.arenaHistory || {}).length + (progress.completedMissions?.length || 0)}</div>
          <span className="text-[11px] text-violet-400 font-medium font-vazir">پروژه‌های صنعتی</span>
        </div>
      </div>

      {/* Skill Radar Matrix */}
      <section>
        <SkillRadarView compact={false} />
      </section>

      {/* Achievements Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2 font-vazir">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>نشان‌های افتخار و مدال‌های مهارتی (Badges & Achievements)</span>
            </h2>
            <p className="text-xs text-gray-400 font-vazir">
              {progress.unlockedAchievements.length} از {ACHIEVEMENTS.length} نشان بازگشایی شده است.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ACHIEVEMENTS.map((ach) => {
            const isUnlocked = progress.unlockedAchievements.includes(ach.id);
            const icon = iconMap[ach.icon] || <Sparkles className="w-5 h-5" />;

            return (
              <div
                key={ach.id}
                className={`p-6 rounded-3xl border transition-all ${
                  isUnlocked
                    ? 'bg-[#141414] border-violet-500/30 shadow-[0_0_20px_rgba(124,58,237,0.15)]'
                    : 'bg-[#141414]/50 border-white/5 opacity-50'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                    isUnlocked
                      ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30'
                      : 'bg-white/5 text-gray-500 border border-white/5'
                  }`}>
                    {isUnlocked ? icon : <Lock className="w-4 h-4" />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-white font-vazir">
                        {ach.title}
                      </h3>
                      {isUnlocked && (
                        <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-0.5 font-vazir">
                          <CheckCircle2 className="w-3 h-3" />
                          باز شده
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-gray-500 font-mono block">
                      {ach.englishTitle}
                    </span>
                    <p className="text-xs text-gray-300 leading-relaxed pt-1 font-vazir">
                      {ach.description}
                    </p>
                    <div className="pt-2 text-[10px] text-gray-500 font-vazir">
                      شرط: {ach.conditionDescription}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Graduation / Certificate Teaser */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#180f26] via-[#141414] to-[#0a0a0a] border border-violet-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-right">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-violet-400" />
            <h3 className="font-bold text-white text-base font-vazir">گواهی‌نامه صلاحیت مهندسی پرامپت (PromptLab Certified)</h3>
          </div>
          <p className="text-xs text-gray-300 max-w-xl font-vazir leading-relaxed">
            با تکمیل ۱۲ سطح آموزشی، ماتریس تسلط مهارتی و چالش‌های Arena، گواهی دیجیتال استاندارد مهندسی پرامپت با شناسه اعتبارسنجی یکتا برای شما صادر خواهد شد.
          </p>
          <div className="text-xs text-violet-300 font-semibold font-vazir">
            وضعیت فعلی: {progress.overallPercentage}٪ به سوی گواهی نهایی
          </div>
        </div>

        <button
          disabled={progress.overallPercentage < 100}
          className="px-6 py-3 rounded-2xl bg-violet-600 disabled:bg-[#1a1a1a] disabled:text-gray-500 disabled:border-white/5 text-white font-bold text-xs flex items-center gap-2 whitespace-nowrap shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all font-vazir"
        >
          <Download className="w-4 h-4" />
          <span>{progress.overallPercentage === 100 ? 'دانلود مدرک رسمی' : 'قفل تا اتمام دوره'}</span>
        </button>
      </div>

    </div>
  );
};
