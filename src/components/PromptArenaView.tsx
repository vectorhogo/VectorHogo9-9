import React, { useState } from 'react';
import { 
  Swords, 
  Sparkles, 
  Trophy, 
  ArrowLeft, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  Layers, 
  Play, 
  Copy, 
  Check, 
  BookOpen, 
  ChevronRight, 
  Zap, 
  Award,
  Flame,
  HelpCircle,
  Stethoscope
} from 'lucide-react';
import { ARENA_MISSIONS, ArenaMission } from '../data/arenaMissions';
import { evaluateEducationalPrompt } from '../utils/promptScoringEngine';
import { useProgress } from '../context/ProgressContext';
import { PromptScoreResult } from '../types';

export const PromptArenaView: React.FC = () => {
  const { progress, recordArenaAttempt } = useProgress();
  
  const [selectedMission, setSelectedMission] = useState<ArenaMission>(ARENA_MISSIONS[0]);
  const [userPrompt, setUserPrompt] = useState<string>(ARENA_MISSIONS[0].starterPrompt);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [currentResult, setCurrentResult] = useState<PromptScoreResult | null>(null);
  const [showWinningBenchmark, setShowWinningBenchmark] = useState<boolean>(false);
  const [copiedBenchmark, setCopiedBenchmark] = useState<boolean>(false);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);

  // Retrieve attempt history for the active mission from progress
  const missionHistory = progress.arenaHistory?.[selectedMission.id]?.attempts || [];
  const bestScore = progress.arenaHistory?.[selectedMission.id]?.bestScore || 0;

  // Select a new mission
  const handleSelectMission = (mission: ArenaMission) => {
    setSelectedMission(mission);
    setUserPrompt(mission.starterPrompt);
    setCurrentResult(null);
    setShowWinningBenchmark(false);
    setShowCelebration(false);
  };

  // Submit attempt
  const handleSubmitAttempt = () => {
    if (!userPrompt.trim()) return;
    setIsSubmitting(true);
    
    setTimeout(() => {
      const evalResult = evaluateEducationalPrompt(userPrompt);
      setCurrentResult(evalResult);
      setIsSubmitting(false);

      // Record in progress context
      recordArenaAttempt(selectedMission.id, evalResult.totalScore, userPrompt);

      // Trigger minimal celebration on 90+ score
      if (evalResult.totalScore >= 90) {
        setShowCelebration(true);
      }
    }, 600);
  };

  // Calculate improvement delta between first and latest attempt
  const firstAttemptScore = missionHistory.length > 0 ? missionHistory[0].score : (currentResult?.totalScore || 0);
  const latestAttemptScore = currentResult ? currentResult.totalScore : (missionHistory[missionHistory.length - 1]?.score || 0);
  const improvementDelta = latestAttemptScore - firstAttemptScore;

  const handleCopyBenchmark = () => {
    navigator.clipboard.writeText(selectedMission.sampleWinningPrompt);
    setCopiedBenchmark(true);
    setTimeout(() => setCopiedBenchmark(false), 2000);
  };

  return (
    <div className="space-y-6 pb-16 animate-fadeIn text-xs">
      
      {/* 1. Arena Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-[#16141e] via-[#111115] to-[#0a0a0d] border border-violet-500/20 p-6 lg:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/10 blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 text-xs font-mono font-semibold">
              <Swords className="w-3.5 h-3.5 text-violet-400" />
              <span>⚔️ PROMPT ARENA — میدان ارزیابی و تسلط</span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white font-vazir leading-tight">
              چالش‌های واقعی صنعت و تکامل گام‌به‌گام پرامپت
            </h1>

            <p className="text-xs sm:text-sm text-gray-400 font-vazir leading-relaxed">
              پرامپت اولیه را بنویسید، امتیاز و نقاط ضعف را دریافت کنید، بهبود دهید و تا رسیدن به رتبه استادی (Mastery 90+) بازنویسی کنید.
            </p>
          </div>

          {/* Master Stats */}
          <div className="flex items-center gap-3 bg-[#0d0d12] border border-white/10 px-5 py-3.5 rounded-2xl shadow-xl shrink-0">
            <div>
              <span className="text-[11px] text-gray-400 block font-vazir">بالاترین رکورد شما:</span>
              <span className="text-xl font-extrabold text-emerald-400 font-mono">{bestScore} / ۱۰۰</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Trophy className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Mission Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {ARENA_MISSIONS.map((m) => {
          const isSelected = selectedMission.id === m.id;
          const missionData = progress.arenaHistory?.[m.id];
          const isPassed = (missionData?.bestScore || 0) >= m.evaluationCriteria.minScore;

          return (
            <div
              key={m.id}
              onClick={() => handleSelectMission(m)}
              className={`p-4 rounded-2xl cursor-pointer border transition-all space-y-2 ${
                isSelected
                  ? 'bg-[#181824] border-violet-500/50 shadow-[0_0_20px_rgba(124,58,237,0.15)]'
                  : 'bg-[#111115] border-white/5 hover:border-white/10 opacity-80 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-gray-400">
                  {m.category}
                </span>
                {isPassed ? (
                  <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    پاس شد ({missionData?.bestScore}٪)
                  </span>
                ) : (
                  <span className="text-[10px] text-violet-400 font-mono">+{m.xpReward} XP</span>
                )}
              </div>

              <h3 className="font-bold text-white text-xs font-vazir line-clamp-1">
                {m.title}
              </h3>

              <div className="flex items-center justify-between text-[11px] text-gray-500 font-vazir pt-1 border-t border-white/5">
                <span>سطح: {m.difficulty}</span>
                <span className="text-violet-400 font-medium">انتخاب ماموریت ←</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Main Arena Battle Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left 6 Cols: Mission Brief & Workspace */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Mission Brief Card */}
          <div className="p-5 rounded-3xl bg-[#111115] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-violet-300 font-mono uppercase tracking-wider">
                ماموریت فعال: {selectedMission.englishTitle}
              </span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20 font-mono">
                حداقل امتیاز قبولی: {selectedMission.evaluationCriteria.minScore}
              </span>
            </div>

            <div className="text-gray-300 text-xs font-vazir leading-relaxed">
              <span className="text-white font-bold block mb-1">سناریوی مسئله (Brief):</span>
              {selectedMission.scenarioBrief}
            </div>

            <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-2">
              <span className="text-[11px] font-bold text-cyan-400 block font-vazir">
                الزامات و ارکان مورد نیاز پرامپت (Requirements):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-gray-400 font-vazir">
                {selectedMission.requiredPillars.map((p, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <span className="text-violet-400 font-bold">•</span>
                    <div>
                      <span className="text-white font-medium">{p.name} ({p.english}): </span>
                      <span>{p.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Prompt Editor in Arena */}
          <div className="p-5 rounded-3xl bg-[#111115] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">کادر نگارش پرامپت (Build Prompt)</span>
                <span className="text-[10px] text-gray-500 font-mono">XML & Persian Supported</span>
              </div>
              
              <button
                onClick={() => setUserPrompt(selectedMission.starterPrompt)}
                className="text-[11px] text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>بازنشانی به پرامپت اولیه</span>
              </button>
            </div>

            <textarea
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              rows={10}
              placeholder="پرامپت مهندسی‌شده خود را اینجا بنویسید..."
              className="w-full p-4 rounded-2xl bg-[#09090c] border border-white/10 text-gray-200 font-mono text-xs leading-relaxed outline-none focus:border-violet-500/50 resize-y custom-scrollbar"
            />

            <div className="flex items-center justify-between pt-1">
              <div className="text-[11px] text-gray-500 font-mono">
                طول پرامپت: {userPrompt.length} کاراکتر
              </div>

              <button
                onClick={handleSubmitAttempt}
                disabled={isSubmitting || !userPrompt.trim()}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:brightness-110 text-white font-bold text-xs flex items-center gap-2 shadow-[0_4px_15px_rgba(124,58,237,0.3)] transition-all disabled:opacity-40"
              >
                <Play className={`w-3.5 h-3.5 fill-current ${isSubmitting ? 'animate-spin' : ''}`} />
                <span>{isSubmitting ? 'در حال ارزیابی در Arena...' : 'ارسال و ارزیابی (Submit)'}</span>
              </button>
            </div>
          </div>

        </div>

        {/* Right 6 Cols: Evaluation, Score Evolution & Feedback */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Score Evolution Banner (Critical Feature) */}
          <div className="p-5 rounded-3xl bg-[#111115] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-white text-xs">روند تکامل و بهبود کیفیت (Score Evolution)</h3>
              </div>
              <span className="text-[10px] text-gray-400 font-mono">
                {missionHistory.length} تلاش ثبت‌شده
              </span>
            </div>

            {missionHistory.length > 0 ? (
              <div className="space-y-3">
                {/* Evolution Chain Display */}
                <div className="p-3.5 rounded-2xl bg-[#09090c] border border-white/5 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {missionHistory.map((att, idx) => (
                      <React.Fragment key={idx}>
                        <div className="flex flex-col items-center bg-[#15151c] px-3 py-1.5 rounded-xl border border-white/5">
                          <span className="text-[9px] text-gray-500 font-mono">Attempt {idx + 1}</span>
                          <span className={`text-xs font-bold font-mono ${att.score >= 85 ? 'text-emerald-400' : att.score >= 65 ? 'text-cyan-300' : 'text-amber-400'}`}>
                            {att.score}
                          </span>
                        </div>
                        {idx < missionHistory.length - 1 && (
                          <span className="text-gray-600 text-xs">→</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  {improvementDelta > 0 && (
                    <div className="px-3 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono font-bold text-xs flex items-center gap-1">
                      <span>+{improvementDelta}</span>
                      <span className="font-vazir text-[10px]">بهبود کیفیت</span>
                    </div>
                  )}
                </div>

                <p className="text-[11px] text-gray-400 font-vazir leading-relaxed">
                  مهندسی پرامپت یک فرآیند تکرارپذیر (Iterative) است؛ ارزیابی نتایج و افزودن مداوم گاردریل‌ها کلید ساخت سیستم‌های پایدار است.
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-[#09090c] text-center text-gray-500 text-xs font-vazir">
                هنوز تلاشی برای این ماموریت ثبت نشده است. پرامپت خود را بنویسید و دکمه ارسال را بزنید.
              </div>
            )}
          </div>

          {/* Minimal Celebration Banner when 90+ achieved */}
          {showCelebration && (
            <div className="p-4 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-violet-950/40 border border-emerald-500/40 space-y-2 shadow-[0_0_30px_rgba(16,185,129,0.15)] animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <Sparkles className="w-4 h-4" />
                  <span>🔥 عالی بود! تبریک می‌گوییم</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">
                  Mastery Achieved
                </span>
              </div>
              <p className="text-xs text-white/90 font-vazir leading-relaxed">
                Prompt شما وارد سطح <strong>Advanced / Mastery</strong> شد و با موفقیت گاردریل‌های سخت‌گیرانه صنعتی را پاس کرد.
              </p>
            </div>
          )}

          {/* Current Evaluation Report Card */}
          {currentResult && (
            <div className="p-5 rounded-3xl bg-[#111115] border border-white/10 space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <div>
                  <span className="text-xs text-gray-400 block font-vazir">نتیجه ارزیابی پرامپت:</span>
                  <div className="text-xl font-bold text-white font-mono flex items-center gap-2">
                    <span>{currentResult.totalScore} / ۱۰۰</span>
                    <span className="text-xs font-vazir text-cyan-400">({currentResult.qualityLevelFa})</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-gray-500 font-mono block">وضعیت قبولی</span>
                  <span className={`text-xs font-bold font-vazir ${currentResult.totalScore >= selectedMission.evaluationCriteria.minScore ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {currentResult.totalScore >= selectedMission.evaluationCriteria.minScore ? '✓ پذیرفته شد' : 'نیازمند بهبود بیشتر'}
                  </span>
                </div>
              </div>

              {/* 8-Pillar Scoring Breakdown Bars */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-white/80 block font-vazir">
                  تفکیک امتیاز ابعاد ۸ گانه (8-Pillar Breakdown):
                </span>
                
                <div className="grid grid-cols-2 gap-2 text-[11px] font-vazir">
                  <div className="p-2 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                    <span className="text-gray-400">شفافیت (Clarity):</span>
                    <span className="font-mono text-cyan-300 font-bold">{currentResult.breakdown.clarityScore} / ۲۰</span>
                  </div>
                  <div className="p-2 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                    <span className="text-gray-400">وظیفه صریح (Task):</span>
                    <span className="font-mono text-cyan-300 font-bold">{currentResult.breakdown.taskScore} / ۲۰</span>
                  </div>
                  <div className="p-2 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                    <span className="text-gray-400">کانتکست (Context):</span>
                    <span className="font-mono text-cyan-300 font-bold">{currentResult.breakdown.contextScore} / ۱۵</span>
                  </div>
                  <div className="p-2 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                    <span className="text-gray-400">گاردریل‌ها (Constraints):</span>
                    <span className="font-mono text-cyan-300 font-bold">{currentResult.breakdown.constraintsScore} / ۱۵</span>
                  </div>
                  <div className="p-2 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                    <span className="text-gray-400">کنترل خروجی (Output):</span>
                    <span className="font-mono text-cyan-300 font-bold">{currentResult.breakdown.outputScore} / ۱۵</span>
                  </div>
                  <div className="p-2 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                    <span className="text-gray-400">مخاطب (Audience):</span>
                    <span className="font-mono text-cyan-300 font-bold">{currentResult.breakdown.audienceScore} / ۵</span>
                  </div>
                  <div className="p-2 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                    <span className="text-gray-400">مثال‌ها (Examples):</span>
                    <span className="font-mono text-cyan-300 font-bold">{currentResult.breakdown.examplesScore} / ۵</span>
                  </div>
                  <div className="p-2 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                    <span className="text-gray-400">معیار موفقیت (Criteria):</span>
                    <span className="font-mono text-cyan-300 font-bold">{currentResult.breakdown.successCriteriaScore} / ۵</span>
                  </div>
                </div>
              </div>

              {/* What You Did Well & What Can Improve */}
              <div className="space-y-2 pt-2 border-t border-white/5 font-vazir text-xs">
                {currentResult.strengths.length > 0 && (
                  <div className="space-y-1">
                    <div className="text-emerald-400 font-bold flex items-center gap-1">
                      <span>✓</span>
                      <span>نقاط قوت پرامپت شما (What you did well):</span>
                    </div>
                    <ul className="list-disc list-inside text-gray-300 space-y-0.5 pr-2">
                      {currentResult.strengths.map((str, idx) => (
                        <li key={idx}>{str}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {currentResult.recommendations.length > 0 && (
                  <div className="space-y-1 pt-1">
                    <div className="text-amber-400 font-bold flex items-center gap-1">
                      <span>⚠️</span>
                      <span>موارد قابل ارتقا برای تلاش بعدی (What you can improve):</span>
                    </div>
                    <ul className="list-disc list-inside text-gray-300 space-y-0.5 pr-2">
                      {currentResult.recommendations.map((rec, idx) => (
                        <li key={idx}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* Winning Benchmark Toggle (Only after at least 1 attempt) */}
          <div className="p-4 rounded-3xl bg-[#111115] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-white text-xs block font-vazir">
                  الگوی مرجع و استاندارد مهندسی (Benchmark Solution)
                </span>
                <span className="text-[11px] text-gray-400 font-vazir">
                  مشاهده ساختار استاندارد بدون اسپویل اولیه
                </span>
              </div>

              <button
                onClick={() => setShowWinningBenchmark(!showWinningBenchmark)}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs font-semibold transition-all border border-white/10"
              >
                {showWinningBenchmark ? 'مخفی کردن الگو' : 'نمایش پرامپت برنده'}
              </button>
            </div>

            {showWinningBenchmark && (
              <div className="space-y-2 pt-2 border-t border-white/5 animate-fadeIn">
                <div className="flex items-center justify-between text-[10px] text-cyan-400 font-mono">
                  <span>الگوی مهندسی‌شده طلایی:</span>
                  <button
                    onClick={handleCopyBenchmark}
                    className="flex items-center gap-1 hover:text-white"
                  >
                    {copiedBenchmark ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedBenchmark ? 'کپی شد' : 'کپی الگو'}</span>
                  </button>
                </div>
                <pre className="p-3 rounded-2xl bg-black text-cyan-200/90 font-mono text-[11px] leading-relaxed whitespace-pre-wrap max-h-56 overflow-y-auto custom-scrollbar border border-white/5">
                  {selectedMission.sampleWinningPrompt}
                </pre>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
