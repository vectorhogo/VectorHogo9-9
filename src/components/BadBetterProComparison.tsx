import React, { useState } from 'react';
import { 
  AlertOctagon, 
  AlertTriangle, 
  Flame, 
  Copy, 
  Check, 
  Terminal, 
  CheckCircle2, 
  HelpCircle,
  Sparkles,
  Layers,
  ArrowDown
} from 'lucide-react';
import { PromptComparison } from '../types';

interface BadBetterProComparisonProps {
  comparison: PromptComparison;
  title?: string;
  subtitle?: string;
}

export const BadBetterProComparison: React.FC<BadBetterProComparisonProps> = ({
  comparison,
  title = 'مقایسه عینی: سیر تکامل پرامپت از مبتدی تا حرفه‌ای',
  subtitle = 'مشاهده تفاوت مستقیم بین یک درخواست عامیانه و یک پرامپت مهندسی‌شده صنعتی'
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const defaultHighlights = {
    hasRole: true,
    hasContext: true,
    hasAudience: true,
    hasGoal: true,
    hasConstraints: true,
    hasOutputFormat: true,
    ...comparison.highlights
  };

  return (
    <div className="rounded-3xl bg-[#121212] border border-white/5 p-5 sm:p-7 space-y-7 shadow-2xl relative overflow-hidden">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-400/10 text-cyan-300 border border-cyan-400/30">
              Bad → Better → Pro
            </span>
            <h3 className="font-bold text-white text-base sm:text-lg">{title}</h3>
          </div>
          <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-mono">
          <span className="w-2 h-2 rounded-full bg-rose-500" />
          <span>→</span>
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          <span>→</span>
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
        </div>
      </div>

      {/* 3 Step Comparison Blocks */}
      <div className="space-y-5">
        
        {/* Step 1: ❌ BAD PROMPT */}
        <div className="rounded-2xl bg-[#161616] border border-rose-900/30 p-5 space-y-4 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <AlertOctagon className="w-4 h-4" />
              <span>❌ پرامپت خام و ضعیف (Bad Prompt)</span>
            </div>
            <button
              onClick={() => handleCopy(comparison.badPrompt, 'bad')}
              className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors px-2 py-1 rounded bg-white/5"
            >
              {copiedKey === 'bad' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>کپی</span>
            </button>
          </div>

          <div className="p-3.5 bg-black/60 rounded-xl border border-rose-900/20 text-xs font-mono text-rose-100 whitespace-pre-wrap leading-relaxed">
            {comparison.badPrompt}
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-rose-300 block">چرا این پرامپت شکست می‌خورد؟</span>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-400">
              {comparison.badCritique.map((critique, idx) => (
                <li key={idx} className="flex items-start gap-1.5 bg-rose-950/10 p-2 rounded-lg border border-rose-900/20">
                  <span className="text-rose-400 text-sm leading-none">•</span>
                  <span>{critique}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Down Arrow separator */}
        <div className="flex justify-center -my-2">
          <div className="w-7 h-7 rounded-full bg-[#1e1e1e] border border-white/10 flex items-center justify-center text-gray-500">
            <ArrowDown className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Step 2: ⚠️ BETTER PROMPT */}
        <div className="rounded-2xl bg-[#161616] border border-amber-900/30 p-5 space-y-4 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>⚠️ پرامپت بهبودیافته (Better Prompt)</span>
            </div>
            <button
              onClick={() => handleCopy(comparison.betterPrompt, 'better')}
              className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors px-2 py-1 rounded bg-white/5"
            >
              {copiedKey === 'better' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>کپی</span>
            </button>
          </div>

          <div className="p-3.5 bg-black/60 rounded-xl border border-amber-900/20 text-xs font-mono text-amber-100 whitespace-pre-wrap leading-relaxed">
            {comparison.betterPrompt}
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-amber-300 block">ارزیابی وضعیت:</span>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-400">
              {comparison.betterCritique.map((critique, idx) => (
                <li key={idx} className="flex items-start gap-1.5 bg-amber-950/10 p-2 rounded-lg border border-amber-900/20">
                  <span className="text-amber-400 text-sm leading-none">•</span>
                  <span>{critique}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Down Arrow separator */}
        <div className="flex justify-center -my-2">
          <div className="w-7 h-7 rounded-full bg-[#1e1e1e] border border-cyan-400/30 flex items-center justify-center text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.3)]">
            <ArrowDown className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Step 3: 🔥 PROFESSIONAL PROMPT */}
        <div className="rounded-2xl bg-[#161616] border border-cyan-400/40 p-5 sm:p-6 space-y-5 shadow-[0_0_30px_rgba(34,211,238,0.12)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-cyan-300 font-extrabold text-sm sm:text-base">
              <Flame className="w-5 h-5 text-cyan-400 fill-current" />
              <span>🔥 پرامپت مهندسی‌شده حرفه‌ای (Professional Prompt)</span>
            </div>
            <button
              onClick={() => handleCopy(comparison.proPrompt, 'pro')}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-400/10 hover:bg-cyan-400/20 border border-cyan-400/30 text-xs text-cyan-300 flex items-center gap-1.5 transition-colors font-medium"
            >
              {copiedKey === 'pro' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>کپی پرامپت استاندارد</span>
            </button>
          </div>

          {/* Code / Prompt box */}
          <div className="p-4 bg-[#0a0a0a] rounded-xl border border-cyan-400/20 text-xs sm:text-sm font-mono text-cyan-200 whitespace-pre-wrap leading-relaxed">
            {comparison.proPrompt}
          </div>

          {/* Expected AI Output */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-gray-400 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>خروجی استاندارد تولیدشده توسط مدل:</span>
            </span>
            <div className="p-4 bg-[#080808] rounded-xl border border-white/5 text-xs font-mono text-gray-300 whitespace-pre-wrap leading-relaxed max-h-52 overflow-y-auto">
              {comparison.proOutput}
            </div>
          </div>

          {/* Strengths */}
          <div className="pt-3 border-t border-white/5 space-y-2">
            <span className="text-xs font-bold text-cyan-300">ارکان برتری پرامپت نهایی:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {comparison.proStrengths.map((str, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-[#0f0f0f] border border-white/5 text-xs text-gray-300 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{str}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* WHY IS THE PROFESSIONAL VERSION BETTER? (تحلیل فنی و ارکان) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0a0a0a] border border-white/10 space-y-5">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-violet-400" />
          <h4 className="font-bold text-white text-sm sm:text-base">
            چرا نسخه حرفه‌ای برتر است؟ (Why is the Professional Version Better?)
          </h4>
        </div>

        {/* Checklist tags */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          <div className="p-2.5 rounded-xl bg-cyan-400/5 border border-cyan-400/20 text-center">
            <span className="text-xs font-bold text-cyan-300 block">✓ نقش (Role)</span>
            <span className="text-[10px] text-gray-400">تثبیت پرسونا</span>
          </div>

          <div className="p-2.5 rounded-xl bg-violet-400/5 border border-violet-400/20 text-center">
            <span className="text-xs font-bold text-violet-300 block">✓ بستر (Context)</span>
            <span className="text-[10px] text-gray-400">بدون ابهام</span>
          </div>

          <div className="p-2.5 rounded-xl bg-purple-400/5 border border-purple-400/20 text-center">
            <span className="text-xs font-bold text-purple-300 block">✓ مخاطب (Audience)</span>
            <span className="text-[10px] text-gray-400">تطبیق سطح</span>
          </div>

          <div className="p-2.5 rounded-xl bg-emerald-400/5 border border-emerald-400/20 text-center">
            <span className="text-xs font-bold text-emerald-300 block">✓ هدف (Goal)</span>
            <span className="text-[10px] text-gray-400">افعال کنشی صریح</span>
          </div>

          <div className="p-2.5 rounded-xl bg-amber-400/5 border border-amber-400/20 text-center">
            <span className="text-xs font-bold text-amber-300 block">✓ قوانین (Rules)</span>
            <span className="text-[10px] text-gray-400">کنترل خطاهای مدل</span>
          </div>

          <div className="p-2.5 rounded-xl bg-teal-400/5 border border-teal-400/20 text-center">
            <span className="text-xs font-bold text-teal-300 block">✓ فرمت (Format)</span>
            <span className="text-[10px] text-gray-400">خروجی ساختاریافته</span>
          </div>
        </div>

        {/* Technical breakdown cards */}
        {comparison.technicalBreakdown && comparison.technicalBreakdown.length > 0 && (
          <div className="space-y-2.5 pt-2 border-t border-white/5">
            <span className="text-xs font-bold text-gray-400 block">تحلیل فنی مکانیزم‌های بکاررفته:</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {comparison.technicalBreakdown.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-[#141414] border border-white/5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cyan-300 text-xs">{item.title}</span>
                    {item.tag && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-400/10 text-cyan-400 border border-cyan-400/20">
                        {item.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
