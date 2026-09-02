import React, { useState } from 'react';
import { PromptExperiment } from '../../types';
import { 
  BookOpen, 
  FlaskConical, 
  Save, 
  Trash2, 
  Copy, 
  Download, 
  Check, 
  X, 
  Lightbulb, 
  TrendingUp, 
  Plus, 
  Clock, 
  ExternalLink,
  Sparkles
} from 'lucide-react';

interface BenchmarkNotebookDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  hypothesis: string;
  setHypothesis: (h: string) => void;
  observations: string;
  setObservations: (o: string) => void;
  learnings: string;
  setLearnings: (l: string) => void;
  onSaveCurrentExperiment: () => void;
  savedExperiments: PromptExperiment[];
  onLoadExperiment: (exp: PromptExperiment) => void;
  onDeleteExperiment?: (id: string) => void;
  onExportExperiment: (exp: Partial<PromptExperiment>) => void;
}

export const BenchmarkNotebookDrawer: React.FC<BenchmarkNotebookDrawerProps> = ({
  isOpen,
  onClose,
  hypothesis,
  setHypothesis,
  observations,
  setObservations,
  learnings,
  setLearnings,
  onSaveCurrentExperiment,
  savedExperiments,
  onLoadExperiment,
  onDeleteExperiment,
  onExportExperiment
}) => {
  const [activeTab, setActiveTab] = useState<'notebook' | 'history'>('notebook');
  const [justSaved, setJustSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveCurrentExperiment();
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-[#111116] border-r border-white/10 h-full flex flex-col shadow-2xl animate-in slide-in-from-left duration-200">
        
        {/* Header */}
        <div className="p-4 bg-[#161620] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-500/15 text-teal-400 border border-teal-500/30">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-vazir">نوت‌بوک و تاریخچه آزمایش‌ها (Experiment Notebook)</h3>
              <p className="text-[11px] text-white/50 font-vazir">ثبت فرضیات علمی، یادداشت مشاهدات و درس‌آموخته‌ها</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sub-tabs */}
        <div className="flex items-center gap-1 p-2 bg-[#13131a] border-b border-white/5 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('notebook')}
            className={`flex-1 py-1.5 rounded-xl text-center font-vazir font-semibold transition-all ${
              activeTab === 'notebook'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30 shadow-sm'
                : 'text-white/50 hover:text-white'
            }`}
          >
            یادداشت‌های آزمایش فعلی
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-1.5 rounded-xl text-center font-vazir font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                : 'text-white/50 hover:text-white'
            }`}
          >
            <span>تاریخچه آزمایش‌ها</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10 font-mono">
              {savedExperiments.length}
            </span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4">
          {activeTab === 'notebook' ? (
            <div className="space-y-4">
              {/* Hypothesis */}
              <div className="space-y-1.5 p-3.5 rounded-2xl bg-[#15151e] border border-teal-500/20">
                <label className="text-xs font-bold text-teal-300 flex items-center gap-1.5 font-vazir">
                  <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                  <span>فرضیه تجربی (Hypothesis):</span>
                </label>
                <textarea
                  value={hypothesis}
                  onChange={(e) => setHypothesis(e.target.value)}
                  rows={3}
                  placeholder="مثال: افزودن تگ‌های XML و تعیین ساختار جدول، خطاهای ساختاری مدل را تا ۹۰٪ کاهش می‌دهد..."
                  className="w-full p-2.5 rounded-xl bg-[#0d0d12] border border-white/10 text-xs text-white/90 outline-none resize-none font-vazir leading-relaxed focus:border-teal-500/40"
                />
              </div>

              {/* Observations */}
              <div className="space-y-1.5 p-3.5 rounded-2xl bg-[#15151e] border border-white/10">
                <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5 font-vazir">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  <span>مشاهدات و مقایسه عینی (Observations):</span>
                </label>
                <textarea
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  rows={4}
                  placeholder="چه تغییراتی در سرعت، دقت، لحن، رعایت قیود و تعداد کلمات مشاهده شد؟"
                  className="w-full p-2.5 rounded-xl bg-[#0d0d12] border border-white/10 text-xs text-white/90 outline-none resize-none font-vazir leading-relaxed focus:border-amber-500/40"
                />
              </div>

              {/* Learnings & Conclusion */}
              <div className="space-y-1.5 p-3.5 rounded-2xl bg-[#15151e] border border-white/10">
                <label className="text-xs font-bold text-cyan-300 flex items-center gap-1.5 font-vazir">
                  <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                  <span>نتیجه‌گیری و درس‌آموخته (Learnings & Rules):</span>
                </label>
                <textarea
                  value={learnings}
                  onChange={(e) => setLearnings(e.target.value)}
                  rows={3}
                  placeholder="از این مقایسه چه اصل یا قاعده‌ای برای پرامپت‌های بعدی استخراج شد؟"
                  className="w-full p-2.5 rounded-xl bg-[#0d0d12] border border-white/10 text-xs text-white/90 outline-none resize-none font-vazir leading-relaxed focus:border-cyan-500/40"
                />
              </div>

              {/* Save Button */}
              <button
                type="button"
                onClick={handleSave}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-black font-vazir font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(20,184,166,0.2)]"
              >
                {justSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                <span>{justSaved ? 'آزمایش با موفقیت ذخیره شد' : 'ذخیره این آزمایش در تاریخچه'}</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {savedExperiments.length === 0 ? (
                <div className="p-8 text-center text-white/40 space-y-2">
                  <FlaskConical className="w-8 h-8 mx-auto text-white/20" />
                  <p className="text-xs font-vazir">هنوز آزمایشی ذخیره نشده است.</p>
                  <p className="text-[11px] text-white/30 font-vazir">
                    پس از اجرای تست پرامپت یا مقایسه مدل‌ها، آن را در نوت‌بوک ذخیره کنید.
                  </p>
                </div>
              ) : (
                savedExperiments.map((exp) => (
                  <div
                    key={exp.id}
                    className="p-3.5 rounded-2xl bg-[#15151e] border border-white/10 hover:border-cyan-500/30 transition-all space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <span className="text-[10px] text-white/40 font-mono block">
                          {exp.createdAt}
                        </span>
                        <h4 className="text-xs font-bold text-white font-vazir truncate">
                          {exp.title || 'آزمایش بدون عنوان'}
                        </h4>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => onExportExperiment(exp)}
                          title="خروجی گرفتن"
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            onLoadExperiment(exp);
                            onClose();
                          }}
                          title="بارگذاری در ورک‌اسپیس"
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 text-xs font-vazir font-semibold transition-all"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>باز کردن</span>
                        </button>
                      </div>
                    </div>

                    {exp.hypothesis && (
                      <p className="text-[11px] text-teal-300/80 font-vazir bg-black/30 p-2 rounded-lg line-clamp-2">
                        <strong>فرضیه:</strong> {exp.hypothesis}
                      </p>
                    )}

                    {exp.learnings && (
                      <p className="text-[11px] text-cyan-300/80 font-vazir bg-black/30 p-2 rounded-lg line-clamp-2">
                        <strong>نتیجه:</strong> {exp.learnings}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
