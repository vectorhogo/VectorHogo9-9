import React from 'react';
import { PromptImprovementResult } from '../../utils/promptAutoImprover';
import { evaluateEducationalPrompt } from '../../utils/promptScoringEngine';
import { 
  ArrowRightLeft, 
  Check, 
  Sparkles, 
  TrendingUp, 
  FileText, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface PromptComparisonDiffProps {
  improvement: PromptImprovementResult;
  onApplyImproved: (improvedPrompt: string) => void;
  onClose?: () => void;
}

export const PromptComparisonDiff: React.FC<PromptComparisonDiffProps> = ({
  improvement,
  onApplyImproved,
  onClose
}) => {
  const scoreBefore = evaluateEducationalPrompt(improvement.originalPrompt).totalScore;
  const scoreAfter = evaluateEducationalPrompt(improvement.improvedPrompt).totalScore;
  const scoreGain = Math.max(0, scoreAfter - scoreBefore);

  return (
    <div className="flex flex-col h-full bg-[#111115] border border-white/10 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#16161c] border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <ArrowRightLeft className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">مقایسه تحلیلی نسخه قبل و بعد (Diff & Comparison)</h3>
            <p className="text-[11px] text-white/50">بررسی تغییرات ساختاری و ارتقای امتیاز کیفیت</p>
          </div>
        </div>

        {/* Score Gain Badge */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+{scoreGain} امتیاز ارتقا ({scoreBefore} ← {scoreAfter})</span>
          </div>

          <button
            onClick={() => onApplyImproved(improvement.improvedPrompt)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-medium text-xs shadow-lg shadow-cyan-500/20 hover:opacity-90 transition-opacity"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>اعمال نسخه بهینه‌شده در ادیتور</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {/* Changes Summary Banner */}
        <div className="p-3.5 rounded-xl bg-[#14141a] border border-white/5 space-y-2">
          <h4 className="text-xs font-semibold text-white flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>تغییرات اعمال‌شده توسط موتور ارتقای خودکار:</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {improvement.changesMade.map((change, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-white/80 bg-white/5 p-2 rounded-lg">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{change}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Side-by-Side Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Before */}
          <div className="flex flex-col border border-rose-500/20 bg-rose-500/[0.02] rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 bg-rose-500/10 border-b border-rose-500/20 text-xs">
              <span className="font-semibold text-rose-300">نسخه اولیه (قبل از بهینه‌سازی)</span>
              <span className="font-mono text-rose-400">{scoreBefore} / ۱۰۰</span>
            </div>
            <pre className="p-3.5 text-xs text-white/70 font-mono leading-relaxed whitespace-pre-wrap flex-1 bg-[#0c0c10]/70">
              {improvement.originalPrompt || '(پرامپت خالی)'}
            </pre>
          </div>

          {/* After */}
          <div className="flex flex-col border border-emerald-500/20 bg-emerald-500/[0.02] rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 bg-emerald-500/10 border-b border-emerald-500/20 text-xs">
              <span className="font-semibold text-emerald-300">نسخه بهینه‌شده (پس از مهندسی پرامپت)</span>
              <span className="font-mono text-emerald-400 font-bold">{scoreAfter} / ۱۰۰</span>
            </div>
            <pre className="p-3.5 text-xs text-emerald-100 font-mono leading-relaxed whitespace-pre-wrap flex-1 bg-[#0c0c10]/70">
              {improvement.improvedPrompt}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
