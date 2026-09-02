import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Sparkles, 
  HelpCircle, 
  AlertTriangle, 
  Lightbulb, 
  ChevronRight, 
  CheckCircle2, 
  Copy, 
  Check, 
  Wand2, 
  ArrowLeft, 
  Layers, 
  ShieldAlert,
  GraduationCap,
  Eye,
  RefreshCw,
  Zap
} from 'lucide-react';
import { MentorFeedback, MentorAnalysisIssue } from '../../services/mentor/types';
import { defaultMentorProvider } from '../../services/mentor/RuleBasedMentor';

interface PromptMentorPanelProps {
  prompt: string;
  onApplyImprovement?: (improvedPrompt: string) => void;
}

export const PromptMentorPanel: React.FC<PromptMentorPanelProps> = ({
  prompt,
  onApplyImprovement
}) => {
  const [feedback, setFeedback] = useState<MentorFeedback | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hintLevel, setHintLevel] = useState<number>(0); // 0 = none, 1 = clue, 2 = specific, 3 = complete
  const [showExplanation, setShowExplanation] = useState<boolean>(true);
  const [showSuggestion, setShowSuggestion] = useState<boolean>(false);
  const [showExampleSnippet, setShowExampleSnippet] = useState<boolean>(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [appliedNotification, setAppliedNotification] = useState(false);

  // Auto-analyze or trigger manual analyze
  const analyzePromptNow = async () => {
    if (!prompt.trim()) return;
    setIsAnalyzing(true);
    // Simulate natural thinking latency
    setTimeout(async () => {
      const result = await defaultMentorProvider.analyzePrompt(prompt);
      setFeedback(result);
      setIsAnalyzing(false);
      // Reset disclosure states on new analysis
      setHintLevel(0);
      setShowSuggestion(false);
      setShowExampleSnippet(false);
    }, 400);
  };

  useEffect(() => {
    if (prompt.trim()) {
      analyzePromptNow();
    }
  }, [prompt]);

  const handleNextHint = () => {
    if (hintLevel < 3) {
      setHintLevel(prev => prev + 1);
    }
  };

  const handleCopySnippet = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const handleApply = () => {
    if (feedback?.suggestedPrompt && onApplyImprovement) {
      onApplyImprovement(feedback.suggestedPrompt);
      setAppliedNotification(true);
      setTimeout(() => setAppliedNotification(false), 2000);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#111115] text-gray-200 overflow-hidden text-xs">
      
      {/* Header */}
      <div className="p-3.5 bg-[#16161c] border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-xl bg-violet-500/20 text-violet-300 border border-violet-500/30">
            <Brain className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-xs">🧠 Prompt Mentor</h3>
              <span className="px-1.5 py-0.2 rounded bg-violet-500/10 text-violet-300 text-[10px] font-mono">
                AI Instructor
              </span>
            </div>
            <p className="text-[11px] text-emerald-400 font-medium">
              {isAnalyzing ? 'در حال تحلیل عمیق پرامپت...' : 'آماده بررسی Prompt شما'}
            </p>
          </div>
        </div>

        <button
          onClick={analyzePromptNow}
          disabled={isAnalyzing || !prompt.trim()}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all disabled:opacity-30 text-[11px]"
          title="تحلیل مجدد پرامپت"
        >
          <RefreshCw className={`w-3 h-3 ${isAnalyzing ? 'animate-spin' : ''}`} />
          <span>تحلیل مجدد</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-3.5 overflow-y-auto custom-scrollbar space-y-3.5">
        
        {!prompt.trim() ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 opacity-60">
            <GraduationCap className="w-10 h-10 text-violet-400" />
            <p className="text-xs text-gray-400 leading-relaxed max-w-xs">
              در کادر ادیتور متنی یا سازنده بصری، یک پرامپت بنویسید تا منتور مهندسی هوش مصنوعی آن را تحلیل کند.
            </p>
          </div>
        ) : isAnalyzing ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-8 h-8 mx-auto border-2 border-violet-500/30 border-t-violet-400 rounded-full animate-spin" />
            <p className="text-xs text-white/60">منتور در حال بررسی ابعاد ۸ گانه مهندسی پرامپت است...</p>
          </div>
        ) : feedback ? (
          <>
            {/* Overall Assessment Banner */}
            <div className="p-3 rounded-xl bg-gradient-to-r from-violet-950/30 to-indigo-950/20 border border-violet-500/20 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-violet-300 flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5" />
                  ارزیابی منتور آموزشی
                </span>
                <span className="font-mono text-cyan-400 font-bold">امتیاز: {feedback.score} / ۱۰۰</span>
              </div>
              <p className="text-[12px] text-white/90 leading-relaxed">
                {feedback.overallAssessment}
              </p>
              <div className="text-[11px] text-emerald-400 flex items-center gap-1 pt-0.5">
                <span>✓</span>
                <span>{feedback.praise}</span>
              </div>
            </div>

            {/* Teaching Logic: Identify Issue First */}
            {feedback.primaryIssue ? (
              <div className="p-3.5 rounded-xl bg-[#141419] border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4" />
                    <span>اشکال اصلی شناسایی‌شده (Primary Flaw)</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 font-mono">
                    {feedback.primaryIssue.relatedConcept}
                  </span>
                </div>

                {/* 1. State the Mistake */}
                <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 space-y-1">
                  <div className="text-white font-semibold text-xs flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>{feedback.primaryIssue.title}</span>
                  </div>
                  <p className="text-white/70 text-[11px] leading-relaxed pr-3">
                    {feedback.primaryIssue.explanation}
                  </p>
                </div>

                {/* 2. Interactive 3-Tier Hint System */}
                <div className="p-3 rounded-lg bg-violet-950/20 border border-violet-500/20 space-y-2.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-violet-300 flex items-center gap-1">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                      <span>سیستم راهنمایی گام‌به‌گام (Graded Hints)</span>
                    </span>
                    <span className="text-[10px] text-white/50 font-mono">
                      سطح {hintLevel} از ۳
                    </span>
                  </div>

                  {hintLevel === 0 && (
                    <div className="text-[11px] text-white/60">
                      منتور پاسخ کامل را فوراً فاش نمی‌کند تا تفکر تحلیلی تقویت شود. برای شروع کلیک کنید:
                    </div>
                  )}

                  {/* Hint Level 1 */}
                  {hintLevel >= 1 && (
                    <div className="p-2.5 rounded-lg bg-[#181822] border border-cyan-500/30 text-white/90 space-y-1 animate-fadeIn">
                      <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider font-mono">
                        💡 HINT 1 — سرنخ اولیه (Small Clue)
                      </div>
                      <p className="text-[11.5px] leading-relaxed font-vazir">
                        «{feedback.primaryIssue.hint1}»
                      </p>
                    </div>
                  )}

                  {/* Hint Level 2 */}
                  {hintLevel >= 2 && (
                    <div className="p-2.5 rounded-lg bg-[#181822] border border-violet-500/30 text-white/90 space-y-1 animate-fadeIn">
                      <div className="text-[10px] text-violet-400 font-bold uppercase tracking-wider font-mono">
                        🔍 HINT 2 — راهنمایی ملموس (Specific Guidance)
                      </div>
                      <p className="text-[11.5px] leading-relaxed font-vazir">
                        «{feedback.primaryIssue.hint2}»
                      </p>
                    </div>
                  )}

                  {/* Hint Level 3 */}
                  {hintLevel >= 3 && (
                    <div className="p-2.5 rounded-lg bg-[#181822] border border-emerald-500/30 text-white/90 space-y-1 animate-fadeIn">
                      <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider font-mono">
                        🎯 HINT 3 — دستورالعمل نهایی (Complete Direction)
                      </div>
                      <p className="text-[11.5px] leading-relaxed font-vazir">
                        «{feedback.primaryIssue.hint3}»
                      </p>
                    </div>
                  )}

                  {/* Action to reveal next hint */}
                  <div className="flex items-center justify-between pt-1">
                    {hintLevel < 3 ? (
                      <button
                        onClick={handleNextHint}
                        className="px-3 py-1.5 rounded-lg bg-violet-600/30 hover:bg-violet-600/50 text-violet-200 border border-violet-500/40 text-[11px] font-medium flex items-center gap-1.5 transition-all"
                      >
                        <HelpCircle className="w-3 h-3" />
                        <span>{hintLevel === 0 ? 'دریافت راهنمایی ۱ (Give Hint)' : `دریافت راهنمایی ${hintLevel + 1}`}</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>تمام سرنخ‌ها بازگشایی شدند.</span>
                      </span>
                    )}

                    <button
                      onClick={() => setShowExampleSnippet(!showExampleSnippet)}
                      className="text-[11px] text-cyan-400 hover:text-cyan-300 underline font-medium"
                    >
                      {showExampleSnippet ? 'بستن نمونه کد' : 'نمایش نمونه الگو (Show Example)'}
                    </button>
                  </div>
                </div>

                {/* Example Snippet */}
                {showExampleSnippet && (
                  <div className="p-3 rounded-lg bg-black/60 border border-cyan-500/30 space-y-2 animate-fadeIn">
                    <div className="flex items-center justify-between text-[10px] text-cyan-300 font-mono">
                      <span>نمونه بلوک ساختاریافته (Recommended Snippet):</span>
                      <button
                        onClick={() => handleCopySnippet(feedback.primaryIssue!.suggestedSnippet)}
                        className="flex items-center gap-1 hover:text-white"
                      >
                        {copiedSnippet ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedSnippet ? 'کپی شد' : 'کپی بلوک'}</span>
                      </button>
                    </div>
                    <pre className="p-2 rounded bg-[#09090c] text-cyan-200/90 font-mono text-[11px] leading-relaxed whitespace-pre-wrap overflow-x-auto border border-white/5">
                      {feedback.primaryIssue.suggestedSnippet}
                    </pre>
                  </div>
                )}

                {/* Improvement Suggestion (Only upon explicit request) */}
                <div className="pt-1 border-t border-white/5">
                  {!showSuggestion ? (
                    <button
                      onClick={() => setShowSuggestion(true)}
                      className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border border-white/10"
                    >
                      <Wand2 className="w-3.5 h-3.5 text-violet-400" />
                      <span>نمایش پیشنهاد بازنویسی کامل پرامپت (Suggest Improvement)</span>
                    </button>
                  ) : (
                    <div className="p-3 rounded-xl bg-[#0e0e13] border border-violet-500/30 space-y-2 animate-fadeIn">
                      <div className="flex items-center justify-between text-xs font-bold text-violet-300">
                        <span className="flex items-center gap-1">
                          <Wand2 className="w-3.5 h-3.5" />
                          <span>پرامپت پیشنهادی منتور:</span>
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopySnippet(feedback.suggestedPrompt)}
                            className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-[10px]"
                          >
                            {copiedSnippet ? 'کپی شد' : 'کپی پرامپت'}
                          </button>
                          {onApplyImprovement && (
                            <button
                              onClick={handleApply}
                              className="px-2.5 py-0.5 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-[10px] font-medium"
                            >
                              {appliedNotification ? 'اعمال شد!' : 'اعمال در ادیتور'}
                            </button>
                          )}
                        </div>
                      </div>

                      <pre className="p-2.5 rounded-lg bg-black text-gray-300 font-mono text-[10.5px] leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto border border-white/5">
                        {feedback.suggestedPrompt}
                      </pre>
                    </div>
                  )}
                </div>

              </div>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-center space-y-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-white text-xs">کیفیت پرامپت شما در سطح استادی است!</h4>
                <p className="text-[11px] text-white/70 leading-relaxed">
                  هیچ نقص ساختاری بازدارنده‌ای مشاهده نشد. پرامپت شما آماده ورود به میدان رقابت (Prompt Arena) و اجرا در محیط تجاری است.
                </p>
              </div>
            )}

            {/* Secondary Issues checklist */}
            {feedback.secondaryIssues.length > 0 && (
              <div className="p-3 rounded-xl bg-[#141419] border border-white/5 space-y-2">
                <div className="text-[11px] font-bold text-white/70">
                  سایر پیشنهادات تکمیلی منتور ({feedback.secondaryIssues.length} مورد):
                </div>
                <div className="space-y-1.5">
                  {feedback.secondaryIssues.map((issue, idx) => (
                    <div key={issue.id} className="p-2 rounded-lg bg-white/[0.02] border border-white/5 flex items-start gap-2">
                      <span className="text-[10px] font-mono text-cyan-400 mt-0.5">{idx + 1}.</span>
                      <div>
                        <div className="text-white text-[11px] font-medium">{issue.title}</div>
                        <p className="text-white/50 text-[10.5px]">{issue.explanation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : null}

      </div>

    </div>
  );
};
