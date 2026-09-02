import React from 'react';
import { useProgress } from '../context/ProgressContext';
import { calculateUserSkills, SKILL_TIER_INFO } from '../data/masterySkills';
import { Sparkles, ShieldCheck, TrendingUp, Info } from 'lucide-react';

interface SkillRadarViewProps {
  compact?: boolean;
}

export const SkillRadarView: React.FC<SkillRadarViewProps> = ({ compact = false }) => {
  const { progress } = useProgress();
  const skills = calculateUserSkills(progress);

  const averageScore = Math.round(skills.reduce((acc, s) => acc + s.score, 0) / skills.length);

  return (
    <div className="bg-[#141414] border border-white/5 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-5 bg-gradient-to-b from-cyan-400 to-violet-500 rounded-full" />
            <h3 className="text-sm sm:text-base font-bold text-white">
              نمودار ماتریس تسلط مهارتی (Skill Radar Matrix)
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-400/10 text-cyan-300 border border-cyan-400/20">
              شاخص آموزشی
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1 font-vazir">
            سنجش پیوسته و هوشمند مهارت‌های ۹ گانه مهندسی پرامپت بر اساس دروس و عملکرد در میدان نبرد (Arena).
          </p>
        </div>

        <div className="flex items-center gap-3 bg-[#0a0a0d] px-4 py-2 rounded-2xl border border-white/5 shrink-0">
          <div className="text-right">
            <span className="text-[10px] text-gray-400 block font-vazir">میانگین تسلط:</span>
            <span className="text-base font-extrabold text-cyan-300 font-mono">{averageScore} / ۱۰۰</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Grid of 9 Skills with Minimal Visual Bars */}
      <div className={`grid gap-3.5 ${compact ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
        {skills.map((skill) => {
          const tierInfo = SKILL_TIER_INFO[skill.tier];

          return (
            <div
              key={skill.id}
              className="p-3.5 rounded-2xl bg-[#0e0e11] border border-white/5 hover:border-white/10 transition-all space-y-2.5 group"
            >
              {/* Skill Top Title & Score */}
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-white text-xs truncate" title={skill.nameFa}>
                  {skill.nameEn}
                </span>
                <span className="font-mono text-xs font-bold text-cyan-300">
                  {skill.score}٪
                </span>
              </div>

              {/* Minimal Progress Bar */}
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-violet-500 rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(34,211,238,0.2)]"
                  style={{ width: `${skill.score}%` }}
                />
              </div>

              {/* Tier Badge & Persian Context */}
              <div className="flex items-center justify-between text-[11px] pt-0.5">
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium border ${tierInfo.badgeBg}`}>
                  {skill.tierFa}
                </span>
                <span className="text-gray-400 text-[10px] truncate max-w-[130px]" title={skill.keyAction}>
                  {skill.keyAction}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Educational Disclaimer */}
      <div className="p-3 rounded-2xl bg-[#0a0a0d] border border-white/5 flex items-start gap-2.5 text-[11px] text-gray-400 leading-relaxed font-vazir">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <span>
          این شاخص‌ها به عنوان یک راهنمای پیشرفت آموزشی طراحی شده‌اند تا حوزه‌های نیازمند تمرین بیشتر (مانند Few-Shot یا کنترل خروجی) را برای شما مشخص کنند. با تکمیل درس‌های تخصصی و ماموریت‌های Arena، امتیاز مهارت‌ها به طور خودکار رشد خواهد کرد.
        </span>
      </div>

    </div>
  );
};
