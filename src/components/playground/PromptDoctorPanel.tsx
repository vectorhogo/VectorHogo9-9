import React from 'react';
import { PromptScoreResult, PromptQualityLevel } from '../../types';
import { 
  Stethoscope, 
  CheckCircle2, 
  AlertTriangle, 
  Lightbulb, 
  ArrowUpRight, 
  ShieldCheck, 
  Layers, 
  Sparkles,
  Info,
  ChevronLeft
} from 'lucide-react';

interface PromptDoctorPanelProps {
  evaluation: PromptScoreResult;
  onApplyRecommendation?: (rec: string) => void;
  onNavigateToLesson?: (lessonId: string) => void;
}

const QUALITY_LEVEL_CONFIG: Record<PromptQualityLevel, { color: string; badgeBg: string; border: string; desc: string }> = {
  Beginner: {
    color: 'text-rose-400',
    badgeBg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
    desc: 'پرامپت بسیار کوتاه یا فاقد ارکان اساسی است. نیاز به تعریف نقش و جزئیات دارد.'
  },
  Developing: {
    color: 'text-amber-400',
    badgeBg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    desc: 'هدف کلی مشخص است اما زمینه و محدودیت‌ها برای جلوگیری از خطای مدل کافی نیستند.'
  },
  Good: {
    color: 'text-blue-400',
    badgeBg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    desc: 'ساختار پرامپت قابل قبول و کاربردی است. با افزودن معیارهای سنجش و فرمت خروجی به حد کمال می‌رسد.'
  },
  Advanced: {
    color: 'text-teal-400',
    badgeBg: 'bg-teal-500/10',
    border: 'border-teal-500/30',
    desc: 'پرامپت مهندسی‌شده با پوشش اکثر ارکان حیاتی و تفکیک شفاف نیازمندی‌ها.'
  },
  Expert: {
    color: 'text-emerald-400',
    badgeBg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    desc: 'پرامپت استاندارد سازمانی با بالاترین ضریب اطمینان و ساختاربندی حرفه‌ای.'
  }
};

export const PromptDoctorPanel: React.FC<PromptDoctorPanelProps> = ({
  evaluation,
  onApplyRecommendation,
  onNavigateToLesson
}) => {
  const { totalScore, qualityLevel, qualityLevelFa, breakdown, strengths, warnings, recommendations } = evaluation;
  const config = QUALITY_LEVEL_CONFIG[qualityLevel];

  // Map recommendations to relevant lessons
  const getRelevantLesson = (rec: string): { title: string; id: string } | null => {
    if (rec.includes('نقش') || rec.includes('Role')) return { title: 'درس ۱.۲: معماری ارکان پرامپت', id: 'l01-02' };
    if (rec.includes('Context') || rec.includes('کانتکست')) return { title: 'درس ۱.۲: زمینه و کانتکست', id: 'l01-02' };
    if (rec.includes('محدودیت') || rec.includes('Constraints')) return { title: 'درس ۲.۳: تکنیک‌های منفی', id: 'l02-03' };
    if (rec.includes('فرمت') || rec.includes('Output')) return { title: 'درس ۱.۳: کنترل فرمت و ساختار', id: 'l01-03' };
    if (rec.includes('نمونه') || rec.includes('Few-Shot')) return { title: 'درس ۲.۱: Few-Shot Prompting', id: 'l02-01' };
    return { title: 'درس ۱.۲: ارکان پرامپت', id: 'l01-02' };
  };

  return (
    <div className="flex flex-col h-full bg-[#111115] border border-white/10 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#16161c] border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Stethoscope className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">پزشک پرامپت (Prompt Doctor)</h3>
            <p className="text-[11px] text-white/50">تحلیل عمیق قواعد و استانداردهای کیفی مهندسی پرامپت</p>
          </div>
        </div>

        {/* Total Score Badge */}
        <div className={`flex items-center gap-2 px-3 py-1 rounded-xl border ${config.badgeBg} ${config.border}`}>
          <div className="text-right">
            <span className={`text-sm font-bold font-mono ${config.color}`}>
              {totalScore} / ۱۰۰
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {/* Quality Level Hero Card */}
        <div className={`p-3.5 rounded-xl border ${config.badgeBg} ${config.border}`}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-white/70 font-medium">سطح کیفی پرامپت:</span>
            <span className={`text-xs font-bold ${config.color}`}>{qualityLevelFa}</span>
          </div>
          <p className="text-xs text-white/60 leading-relaxed font-vazir">
            {config.desc}
          </p>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-black/40 rounded-full mt-3 overflow-hidden p-0.5 border border-white/5">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                totalScore >= 75 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' :
                totalScore >= 50 ? 'bg-gradient-to-r from-amber-500 to-emerald-400' :
                'bg-gradient-to-r from-rose-500 to-amber-500'
              }`}
              style={{ width: `${Math.max(6, totalScore)}%` }}
            />
          </div>
        </div>

        {/* 8-Category Detailed Breakdown */}
        <div className="bg-[#14141a] border border-white/5 rounded-xl p-3.5">
          <h4 className="text-xs font-semibold text-white mb-3 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>تفکیک امتیازات ۸ گانه استاندارد</span>
          </h4>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
              <span className="text-white/60">شفافیت (Clarity):</span>
              <span className="font-mono text-cyan-300 font-medium">{breakdown.clarityScore} / ۲۰</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
              <span className="text-white/60">وظیفه (Task):</span>
              <span className="font-mono text-cyan-300 font-medium">{breakdown.taskScore} / ۲۰</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
              <span className="text-white/60">کانتکست (Context):</span>
              <span className="font-mono text-blue-300 font-medium">{breakdown.contextScore} / ۱۵</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
              <span className="text-white/60">محدودیت‌ها (Constraints):</span>
              <span className="font-mono text-amber-300 font-medium">{breakdown.constraintsScore} / ۱۵</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
              <span className="text-white/60">فرمت خروجی (Output):</span>
              <span className="font-mono text-teal-300 font-medium">{breakdown.outputScore} / ۱۵</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
              <span className="text-white/60">مخاطب (Audience):</span>
              <span className="font-mono text-purple-300 font-medium">{breakdown.audienceScore} / ۵</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
              <span className="text-white/60">نمونه‌ها (Few-Shot):</span>
              <span className="font-mono text-pink-300 font-medium">{breakdown.examplesScore} / ۵</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
              <span className="text-white/60">معیار موفقیت (Criteria):</span>
              <span className="font-mono text-indigo-300 font-medium">{breakdown.successCriteriaScore} / ۵</span>
            </div>
          </div>
        </div>

        {/* Strengths (نقاط قوت) */}
        {strengths.length > 0 && (
          <div className="bg-[#14141a] border border-white/5 rounded-xl p-3.5">
            <h4 className="text-xs font-semibold text-emerald-400 mb-2.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>نقاط قوت و ارکان رعایت‌شده ({strengths.length})</span>
            </h4>
            <ul className="space-y-1.5">
              {strengths.map((str, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-white/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Warnings & Missed Components */}
        {warnings.length > 0 && (
          <div className="bg-[#14141a] border border-white/5 rounded-xl p-3.5">
            <h4 className="text-xs font-semibold text-amber-400 mb-2.5 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>نقص‌ها و هشدارهای ساختاری ({warnings.length})</span>
            </h4>
            <ul className="space-y-1.5">
              {warnings.map((warn, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-white/70">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span>{warn}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Top 3 Concrete Recommendations */}
        {recommendations.length > 0 && (
          <div className="bg-[#14141a] border border-white/5 rounded-xl p-3.5">
            <h4 className="text-xs font-semibold text-cyan-300 mb-2.5 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>۳ پیشنهاد عملیاتی برای ارتقا</span>
            </h4>
            <div className="space-y-2.5">
              {recommendations.map((rec, idx) => {
                const lesson = getRelevantLesson(rec);
                return (
                  <div key={idx} className="p-2.5 rounded-lg bg-white/5 border border-white/5 space-y-2">
                    <div className="flex items-start gap-2 text-xs text-white/90">
                      <span className="font-mono text-cyan-400 font-bold text-[11px] mt-0.5">#{idx + 1}</span>
                      <p className="font-vazir leading-relaxed">{rec}</p>
                    </div>

                    {lesson && onNavigateToLesson && (
                      <div className="flex items-center justify-end">
                        <button
                          onClick={() => onNavigateToLesson(lesson.id)}
                          className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
                        >
                          <span>آموزش در {lesson.title}</span>
                          <ChevronLeft className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Educational Disclaimer */}
        <div className="flex items-start gap-2 p-3 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-white/40">
          <Info className="w-3.5 h-3.5 text-white/30 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            این نمره یک شاخص آموزشی بر اساس الگوهای مهندسی پرامپت است و عملکرد مدل‌های مختلف زبانی ممکن است بر اساس کانتکست متفاوت باشد.
          </p>
        </div>
      </div>
    </div>
  );
};
