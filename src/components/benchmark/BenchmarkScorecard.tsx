import React from 'react';
import { ManualScorecard } from '../../services/ai/types';
import { Star, Award, Info, Sparkles } from 'lucide-react';

interface BenchmarkScorecardProps {
  scorecard: ManualScorecard;
  onChange: (updated: ManualScorecard) => void;
  variantLabel?: string;
}

const CRITERIA = [
  { key: 'clarity' as const, label: 'شفافیت و وضوح بیان (Clarity)', desc: 'میزان روانی، سادگی و بدون ابهام بودن متن' },
  { key: 'instructionFollowing' as const, label: 'پیروی از دستورات (Instruction Following)', desc: 'رعایت تمام قیود، تگ‌ها و قوانین مطرح‌شده در پرامپت' },
  { key: 'relevance' as const, label: 'ارتباط با هدف (Relevance)', desc: 'پاسخ مستقیم به صورت مسئله بدون حاشیه‌پردازی زائد' },
  { key: 'outputStructure' as const, label: 'ساختار و قالب‌بندی (Output Structure)', desc: 'نظم در تیترها، جداول، کدهای تمیز یا فرمت درخواستی' },
  { key: 'consistency' as const, label: 'ثبات و عدم تناقض (Consistency)', desc: 'همگامی منطقی بخش‌های مختلف بدون ادعاهای متضاد' }
];

export const BenchmarkScorecard: React.FC<BenchmarkScorecardProps> = ({
  scorecard,
  onChange,
  variantLabel = 'ارزیابی خروجی'
}) => {
  const handleScoreChange = (key: keyof Omit<ManualScorecard, 'averageScore' | 'userFeedback'>, val: number) => {
    const updated = { ...scorecard, [key]: val };
    const avg = Number(
      ((updated.clarity + updated.instructionFollowing + updated.relevance + updated.outputStructure + updated.consistency) / 5).toFixed(1)
    );
    updated.averageScore = avg;
    onChange(updated);
  };

  return (
    <div className="p-4 rounded-2xl bg-[#14141a] border border-white/10 space-y-4">
      {/* Header with Average */}
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white font-vazir">{variantLabel}</h4>
            <span className="text-[10px] text-white/50 font-vazir">کارت ارزیابی ۵ معیاره دستی</span>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30">
          <span className="text-[10px] text-amber-300 font-vazir">میانگین امتیاز:</span>
          <span className="font-mono text-sm font-bold text-amber-300">{scorecard.averageScore} / ۵</span>
        </div>
      </div>

      {/* 5 Sliders/Star Rows */}
      <div className="space-y-3">
        {CRITERIA.map(({ key, label, desc }) => {
          const currentVal = scorecard[key] || 3;
          return (
            <div key={key} className="p-2.5 rounded-xl bg-[#0d0d12] border border-white/5 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-white/90 font-vazir">{label}</span>
                <span className="font-mono font-bold text-cyan-400">{currentVal} از ۵</span>
              </div>
              <p className="text-[10px] text-white/40 font-vazir leading-relaxed">{desc}</p>
              
              {/* 1 to 5 clickable rating buttons */}
              <div className="flex items-center gap-1.5 pt-1">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleScoreChange(key, num)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center justify-center gap-1 ${
                      num <= currentVal
                        ? 'bg-gradient-to-r from-amber-500/30 to-amber-600/30 border border-amber-500/40 text-amber-200 shadow-[0_0_8px_rgba(245,158,11,0.15)]'
                        : 'bg-white/5 border border-white/5 text-white/40 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Star className={`w-3 h-3 ${num <= currentVal ? 'fill-amber-400 text-amber-400' : ''}`} />
                    <span>{num}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Note / Disclaimer */}
      <div className="p-2.5 rounded-xl bg-cyan-500/5 border border-cyan-500/15 flex items-start gap-2 text-[11px] text-cyan-300/80 font-vazir leading-relaxed">
        <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
        <span>
          <strong>یادآوری آموزشی:</strong> این امتیازات بر اساس داوری کیفی شما ثبت می‌شوند تا مهارت ارزیابی تجربی و مقایسه پرامپت‌ها تقویت گردد.
        </span>
      </div>
    </div>
  );
};
