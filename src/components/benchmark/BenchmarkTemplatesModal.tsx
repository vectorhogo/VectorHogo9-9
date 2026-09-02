import React from 'react';
import { BENCHMARK_TEMPLATES, BenchmarkTemplate } from '../../data/benchmarkTemplates';
import { FlaskConical, X, Sparkles, ArrowLeft, Check, Layers } from 'lucide-react';

interface BenchmarkTemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: BenchmarkTemplate) => void;
}

export const BenchmarkTemplatesModal: React.FC<BenchmarkTemplatesModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-[#121218] border border-white/15 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#181822] border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-teal-500/20 border border-cyan-500/30 text-cyan-400">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-vazir">الگوهای آماده آزمایشگاهی (Benchmark Templates)</h3>
              <p className="text-xs text-white/50 font-vazir">انتخاب سناریوهای استاندارد برای مقایسه مستقیم تفاوت پرامپت‌ها</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Templates List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {BENCHMARK_TEMPLATES.map((tpl) => (
            <div
              key={tpl.id}
              className="p-4 rounded-2xl bg-[#161620] border border-white/10 hover:border-cyan-500/40 hover:bg-[#1a1a26] transition-all space-y-3 group"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/25 font-vazir">
                      {tpl.category}
                    </span>
                    <span className="text-[10px] text-white/40 font-mono">
                      {tpl.relatedSkill}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white font-vazir group-hover:text-cyan-300 transition-colors">
                    {tpl.title}
                  </h4>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onSelectTemplate(tpl);
                    onClose();
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 border border-cyan-500/30 text-xs font-semibold transition-all shrink-0 shadow-[0_0_10px_rgba(34,211,238,0.1)]"
                >
                  <span>بارگذاری این آزمایش</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-xs text-white/70 leading-relaxed font-vazir">
                {tpl.description}
              </p>

              {/* Hypothesis & Expected Difference */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1 text-[11px]">
                <div className="p-2.5 rounded-xl bg-black/30 border border-white/5 space-y-1">
                  <span className="text-teal-400 font-semibold block font-vazir">فرضیه تجربی:</span>
                  <p className="text-white/60 font-vazir leading-relaxed line-clamp-2">{tpl.hypothesis}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-black/30 border border-white/5 space-y-1">
                  <span className="text-amber-400 font-semibold block font-vazir">تفاوت مورد انتظار:</span>
                  <p className="text-white/60 font-vazir leading-relaxed line-clamp-2">{tpl.expectedDifferenceFa}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
