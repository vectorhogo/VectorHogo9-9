import React, { useState } from 'react';
import { PromptExperiment } from '../../types';
import { evaluateEducationalPrompt } from '../../utils/promptScoringEngine';
import { 
  FlaskConical, 
  Sparkles, 
  Save, 
  ArrowRightLeft, 
  Plus, 
  Check, 
  Lightbulb, 
  TrendingUp, 
  FileText
} from 'lucide-react';

interface PromptExperimentViewProps {
  onSaveExperiment?: (exp: Omit<PromptExperiment, 'id' | 'createdAt'>) => void;
}

export const PromptExperimentView: React.FC<PromptExperimentViewProps> = ({
  onSaveExperiment
}) => {
  const [title, setTitle] = useState('آزمایش شماره ۱: تاثیر افزودن تگ‌های XML بر ساختاربندی');
  const [hypothesis, setHypothesis] = useState('افزودن تگ‌های <rules> و <output_format> خطاهای ساختاری مدل را حذف و امتیاز را بالای ۸۵ می‌برد.');
  const [promptA, setPromptA] = useState(`یک گزارش تحلیل فروش فصلی بنویس. اعداد باید دقیق باشند.`);
  const [promptB, setPromptB] = useState(`<role>
تو تحلیلگر ارشد هوش تجاری هستی.
</role>

<instructions>
گزارش تحلیل فروش فصلی را تدوین کن.
</instructions>

<rules>
- تمام محاسبات باید با قید درصد رشد باشند.
- از کلی‌گویی خودداری کن.
</rules>

<output_format>
جدول Markdown با ستون‌های [دوره / فروش / درصد تغییر / نتیجه‌گیری].
</output_format>`);
  
  const [observations, setObservations] = useState('نسخه B شفافیت فوق‌العاده بالاتری در تعیین ستون‌های جدول دارد.');
  const [learnings, setLearnings] = useState('استفاده از تگ‌های XML و تعیین پیشاپیش ستون‌ها، ابهام مدل را به صفر رساند.');
  const [isSaved, setIsSaved] = useState(false);

  const evalA = evaluateEducationalPrompt(promptA);
  const evalB = evaluateEducationalPrompt(promptB);

  const handleSave = () => {
    if (!onSaveExperiment) return;
    onSaveExperiment({
      title,
      hypothesis,
      promptA,
      promptB,
      outputA: 'پاسخ متنی کلی و بدون ستون‌های مدنظر',
      outputB: 'پاسخ کاملاً تمیز در قالب جدول Markdown با ستون‌های تعریف‌شده',
      observations,
      learnings
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="flex flex-col h-full bg-[#111115] border border-white/10 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#16161c] border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <FlaskConical className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">حالت آزمایشگاهی و فرضیه‌سنجی (Experiment Lab)</h3>
            <p className="text-[11px] text-white/50">تست A/B پرامپت‌ها، ثبت فرضیات و یادگیری تجربی</p>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/30 text-xs font-medium transition-colors"
        >
          {isSaved ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Save className="w-3.5 h-3.5" />}
          <span>{isSaved ? 'آزمایش ذخیره شد' : 'ذخیره آزمایش در نوت‌بوک'}</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {/* Title & Hypothesis Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#14141a] border border-white/5">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-white/80">عنوان آزمایش:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#0a0a0d] border border-white/10 text-xs text-white outline-none focus:border-teal-500/50"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-teal-300">فرضیه تجربی (Hypothesis):</label>
            <input
              type="text"
              value={hypothesis}
              onChange={(e) => setHypothesis(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#0a0a0d] border border-white/10 text-xs text-white outline-none focus:border-teal-500/50"
            />
          </div>
        </div>

        {/* Side-by-Side Prompt A vs Prompt B */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Variant A */}
          <div className="flex flex-col border border-white/10 rounded-xl overflow-hidden bg-[#14141a]">
            <div className="flex items-center justify-between px-3.5 py-2 bg-white/5 border-b border-white/5 text-xs">
              <span className="font-semibold text-white/80">پرامپت A (کنترل / پایه)</span>
              <span className="font-mono text-cyan-400 font-bold">{evalA.totalScore} / ۱۰۰</span>
            </div>
            <textarea
              value={promptA}
              onChange={(e) => setPromptA(e.target.value)}
              rows={8}
              className="p-3 bg-transparent text-xs font-mono text-white/80 resize-none outline-none leading-relaxed"
            />
          </div>

          {/* Variant B */}
          <div className="flex flex-col border border-teal-500/30 rounded-xl overflow-hidden bg-teal-500/[0.02]">
            <div className="flex items-center justify-between px-3.5 py-2 bg-teal-500/10 border-b border-teal-500/20 text-xs">
              <span className="font-semibold text-teal-300">پرامپت B (آزمایشی با فرضیه جدید)</span>
              <span className="font-mono text-emerald-400 font-bold">{evalB.totalScore} / ۱۰۰</span>
            </div>
            <textarea
              value={promptB}
              onChange={(e) => setPromptB(e.target.value)}
              rows={8}
              className="p-3 bg-transparent text-xs font-mono text-teal-100 resize-none outline-none leading-relaxed"
            />
          </div>
        </div>

        {/* Observation & Learnings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1.5 p-3 rounded-xl bg-[#14141a] border border-white/5">
            <label className="text-xs font-semibold text-white/80 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>مشاهدات و مقایسه نتایج:</span>
            </label>
            <textarea
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              rows={3}
              placeholder="چه تفاوت‌هایی در ساختار یا پاسخ مدل مشاهده شد؟"
              className="w-full p-2.5 rounded-lg bg-[#0a0a0d] border border-white/10 text-xs text-white/90 outline-none resize-none font-vazir leading-relaxed"
            />
          </div>

          <div className="space-y-1.5 p-3 rounded-xl bg-[#14141a] border border-white/5">
            <label className="text-xs font-semibold text-teal-300 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-teal-400" />
              <span>درس‌آموخته‌های کلیدی (Key Learnings):</span>
            </label>
            <textarea
              value={learnings}
              onChange={(e) => setLearnings(e.target.value)}
              rows={3}
              placeholder="از این آزمایش چه اصلی برای پرامپت‌های بعدی استخراج شد؟"
              className="w-full p-2.5 rounded-lg bg-[#0a0a0d] border border-white/10 text-xs text-white/90 outline-none resize-none font-vazir leading-relaxed"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
