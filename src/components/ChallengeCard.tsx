import React, { useState } from 'react';
import { 
  Trophy, 
  Sparkles, 
  Terminal, 
  CheckCircle2, 
  ShieldCheck, 
  ChevronDown, 
  Award,
  Layers,
  Check,
  AlertCircle
} from 'lucide-react';
import { LessonChallenge, PromptScoreResult } from '../types';
import { evaluateEducationalPrompt } from '../utils/promptScoringEngine';
import { useProgress } from '../context/ProgressContext';

interface ChallengeCardProps {
  challenge: LessonChallenge;
  onCompleted?: () => void;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  onCompleted
}) => {
  const { progress, markChallengeCompleted } = useProgress();
  const [userPrompt, setUserPrompt] = useState(challenge.starterPrompt || '');
  const [evaluation, setEvaluation] = useState<PromptScoreResult | null>(null);
  const [showWinningPrompt, setShowWinningPrompt] = useState(false);

  const isCompleted = progress.completedChallenges.includes(challenge.id);

  const handleEvaluate = () => {
    const result = evaluateEducationalPrompt(userPrompt);
    setEvaluation(result);

    if (result.passed) {
      markChallengeCompleted(challenge.id);
      if (onCompleted) onCompleted();
    }
  };

  return (
    <div className="rounded-3xl bg-[#141414] border border-amber-500/20 p-5 sm:p-7 space-y-6 shadow-[0_0_30px_rgba(245,158,11,0.08)] relative overflow-hidden">
      {/* Top ambient gold accent */}
      <div className="absolute top-0 right-0 left-0 h-[2px] bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-400" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>چالش صنعتی ارزیابی مهارت</span>
            </span>
            <span className="text-xs text-gray-400">سطح دشواری: {challenge.difficulty}</span>
            {isCompleted && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 flex items-center gap-1">
                <Check className="w-3 h-3 stroke-[3]" />
                <span>ثبت شده (+۱۵۰ XP)</span>
              </span>
            )}
          </div>
          <h3 className="font-bold text-white text-base sm:text-lg">{challenge.title}</h3>
        </div>

        <span className="text-xs font-mono font-bold text-amber-400 self-start sm:self-auto px-3 py-1 bg-amber-500/10 rounded-xl border border-amber-500/20">
          جایزه: +۱۵۰ XP
        </span>
      </div>

      {/* Brief */}
      <div className="p-4 rounded-2xl bg-[#0d0d0d] border border-white/5 space-y-2 text-xs sm:text-sm">
        <span className="font-bold text-gray-300 block">📋 شرح و زمینه چالش:</span>
        <p className="text-gray-300 leading-relaxed">{challenge.brief}</p>
      </div>

      {/* Requirements List */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-gray-300 block">
          نیازمندی‌های ضروری چالش جهت کسب تاییدیه:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {challenge.requirements.map((req, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-[#0f0f0f] border border-white/5 text-xs text-gray-300 flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
              <span>{req}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Editor Box */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>پرامپت نهایی خود را برای موتور داوری طراحی کنید:</span>
          {isCompleted && (
            <button
              onClick={() => setShowWinningPrompt(!showWinningPrompt)}
              className="text-amber-400 hover:text-amber-300 flex items-center gap-1 text-xs"
            >
              <span>{showWinningPrompt ? 'مخفی‌سازی پرامپت برنده' : 'مشاهده پرامپت استاندارد برنده'}</span>
            </button>
          )}
        </div>

        {showWinningPrompt && (
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs text-amber-200 animate-in fade-in space-y-1">
            <span className="font-bold block">پرامپت استاندارد معمار (Sample Winning Prompt):</span>
            <pre className="font-mono whitespace-pre-wrap leading-relaxed pt-1 text-[11px]">
              {challenge.sampleWinningPrompt}
            </pre>
          </div>
        )}

        <textarea
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          rows={7}
          className="w-full p-4 bg-[#0a0a0a] border border-white/10 rounded-2xl text-xs sm:text-sm font-mono text-gray-200 focus:outline-none focus:border-amber-400 transition-colors leading-relaxed"
          placeholder="پرامپت کامل، با تگ‌ها یا نشانگرها، نقش، محدودیت‌ها و خروجی ساختاریافته را بنویسید..."
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-[11px] text-gray-500 font-mono">
            طول پرامپت: {userPrompt.length} کاراکتر
          </div>

          <button
            onClick={handleEvaluate}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all"
          >
            <Trophy className="w-4 h-4" />
            <span>ارزیابی توسط موتور داوری آموزشی و ثبت (+۱۵۰ XP)</span>
          </button>
        </div>
      </div>

      {/* Evaluation & Scoring Breakdown Dashboard */}
      {evaluation && (
        <div className={`p-5 rounded-2xl border ${
          evaluation.passed
            ? 'bg-emerald-950/20 border-emerald-500/40'
            : 'bg-amber-950/20 border-amber-500/40'
        } space-y-4 animate-in fade-in`}>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
            <div className="flex items-center gap-2">
              <span className={`text-sm font-bold ${evaluation.passed ? 'text-emerald-400' : 'text-amber-400'}`}>
                {evaluation.passed ? '🎉 تبریک! چالش با موفقیت گذرانده شد' : '⚠️ چالش نیازمند ارتقاء ارکان است'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">امتیاز آموزشی داوری:</span>
              <span className="text-base font-bold font-mono text-white bg-black/60 px-3 py-1 rounded-xl border border-white/10">
                {evaluation.totalScore} / ۱۰۰
              </span>
            </div>
          </div>

          {/* 5 Dimensional Radar/Progress Bars */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-gray-300 block">ابعاد کیفیت پرامپت بر اساس استاندارد:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                  <span>ساختار (Structure)</span>
                  <span className="text-cyan-400">{evaluation.breakdown.structureDimension}٪</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${evaluation.breakdown.structureDimension}%` }} />
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                  <span>شفافیت (Clarity)</span>
                  <span className="text-violet-400">{evaluation.breakdown.clarityDimension}٪</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-violet-400 rounded-full" style={{ width: `${evaluation.breakdown.clarityDimension}%` }} />
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                  <span>بستر (Context)</span>
                  <span className="text-purple-400">{evaluation.breakdown.contextDimension}٪</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-400 rounded-full" style={{ width: `${evaluation.breakdown.contextDimension}%` }} />
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                  <span>محدودیت‌ها (Rules)</span>
                  <span className="text-amber-400">{evaluation.breakdown.constraintsDimension}٪</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: `${evaluation.breakdown.constraintsDimension}%` }} />
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                  <span>کنترل خروجی (Output)</span>
                  <span className="text-emerald-400">{evaluation.breakdown.outputDimension}٪</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${evaluation.breakdown.outputDimension}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Strengths and Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-2">
            {evaluation.strengths.length > 0 && (
              <div className="p-3 rounded-xl bg-black/40 border border-emerald-500/20 space-y-1">
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>نقاط قوت پرامپت:</span>
                </span>
                <ul className="space-y-1 text-gray-300">
                  {evaluation.strengths.map((str, i) => (
                    <li key={i}>• {str}</li>
                  ))}
                </ul>
              </div>
            )}

            {evaluation.recommendations.length > 0 && (
              <div className="p-3 rounded-xl bg-black/40 border border-amber-500/20 space-y-1">
                <span className="font-bold text-amber-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>پیشنهادات ارتقاء:</span>
                </span>
                <ul className="space-y-1 text-gray-300">
                  {evaluation.recommendations.map((rec, i) => (
                    <li key={i}>• {rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
};
