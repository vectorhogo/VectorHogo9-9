import React, { useState } from 'react';
import { BenchmarkExperimentRecord } from '../../services/ai/types';
import { Download, Copy, Check, X, FileText, Code, Sparkles } from 'lucide-react';

interface ExportExperimentModalProps {
  isOpen: boolean;
  onClose: () => void;
  experiment: Partial<BenchmarkExperimentRecord>;
}

export const ExportExperimentModal: React.FC<ExportExperimentModalProps> = ({
  isOpen,
  onClose,
  experiment
}) => {
  const [format, setFormat] = useState<'markdown' | 'json'>('markdown');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generateMarkdown = (): string => {
    return `# 🧪 آزمایش بنچ‌مارک پرامپت: ${experiment.title || 'بدون عنوان'}
تاریخ ثبت: ${experiment.createdAt || new Date().toLocaleDateString('fa-IR')}
حالت آزمایش: ${experiment.mode === 'ab_prompts' ? 'تست مقایسه‌ای A/B پرامپت' : experiment.mode === 'compare_models' ? 'مقایسه مدل‌ها' : 'اجرای تک مدل'}

---

## 🎯 فرضیه تجربی (Hypothesis)
${experiment.hypothesis || 'فرضیه‌ای ثبت نشده است.'}

## 📝 پرامپت A (${experiment.modelA || 'مدل A'})
\`\`\`text
${experiment.systemPromptA ? `[System Prompt]\n${experiment.systemPromptA}\n\n` : ''}${experiment.promptA || ''}
\`\`\`

### 📊 خروجی A
\`\`\`text
${experiment.outputA || 'خروجی ثبت نشده است.'}
\`\`\`
${experiment.scorecardA ? `- میانگین امتیاز ارزیابی: ${experiment.scorecardA.averageScore} / 5` : ''}

${
  experiment.promptB || experiment.outputB
    ? `---

## 📝 پرامپت B (${experiment.modelB || 'مدل B'})
\`\`\`text
${experiment.systemPromptB ? `[System Prompt]\n${experiment.systemPromptB}\n\n` : ''}${experiment.promptB || ''}
\`\`\`

### 📊 خروجی B
\`\`\`text
${experiment.outputB || 'خروجی ثبت نشده است.'}
\`\`\`
${experiment.scorecardB ? `- میانگین امتیاز ارزیابی: ${experiment.scorecardB.averageScore} / 5` : ''}
`
    : ''
}

---

## 💡 درس‌آموخته و نتیجه‌گیری (Learnings & Conclusion)
${experiment.learnings || 'نتیجه‌گیری ثبت نشده است.'}

---
*تولید شده توسط PromptLab — آزمایشگاه مهندسی پرامپت*
`;
  };

  const generateJSON = (): string => {
    const safeData = {
      title: experiment.title,
      mode: experiment.mode,
      createdAt: experiment.createdAt,
      hypothesis: experiment.hypothesis,
      learnings: experiment.learnings,
      parameters: experiment.parameters,
      variantA: {
        model: experiment.modelA,
        systemPrompt: experiment.systemPromptA,
        prompt: experiment.promptA,
        output: experiment.outputA,
        metrics: experiment.metricsA,
        scorecard: experiment.scorecardA
      },
      variantB: experiment.outputB
        ? {
            model: experiment.modelB,
            systemPrompt: experiment.systemPromptB,
            prompt: experiment.promptB,
            output: experiment.outputB,
            metrics: experiment.metricsB,
            scorecard: experiment.scorecardB
          }
        : undefined
    };
    return JSON.stringify(safeData, null, 2);
  };

  const content = format === 'markdown' ? generateMarkdown() : generateJSON();

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename = `promptlab-experiment-${Date.now()}.${format === 'markdown' ? 'md' : 'json'}`;
    const blob = new Blob([content], { type: format === 'markdown' ? 'text/markdown' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#121218] border border-white/15 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#181822] border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-vazir">خروجی و گزارش آزمایش (Export Experiment)</h3>
              <p className="text-xs text-white/50 font-vazir">دریافت گزارش مستندسازی‌شده بدون کلیدهای امنیتی</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Selector */}
        <div className="p-4 bg-[#14141c] border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFormat('markdown')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                format === 'markdown'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>قالب Markdown (.md)</span>
            </button>

            <button
              type="button"
              onClick={() => setFormat('json')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                format === 'json'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>داده‌های استاندارد JSON (.json)</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 text-xs font-medium transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'کپی شد' : 'کپی متن'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-500 text-black hover:bg-cyan-400 text-xs font-bold transition-all shadow-[0_0_12px_rgba(34,211,238,0.3)]"
            >
              <Download className="w-3.5 h-3.5" />
              <span>دانلود فایل</span>
            </button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 p-4 overflow-y-auto bg-[#0a0a0d] custom-scrollbar">
          <pre className="text-xs font-mono text-cyan-100/90 whitespace-pre-wrap leading-relaxed select-all">
            {content}
          </pre>
        </div>
      </div>
    </div>
  );
};
