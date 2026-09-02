import React, { useState, useEffect } from 'react';
import { 
  Code2, 
  Terminal, 
  CheckCircle2, 
  HelpCircle, 
  Eye, 
  Sparkles, 
  RotateCcw, 
  Check, 
  AlertTriangle,
  Award
} from 'lucide-react';
import { LessonExercise } from '../types';
import { evaluateEducationalPrompt } from '../utils/promptScoringEngine';
import { useProgress } from '../context/ProgressContext';

interface InteractiveExerciseCardProps {
  exercise: LessonExercise;
  onSuccess?: () => void;
}

const DEFAULT_CHECKLIST = [
  { id: 'goal', label: 'تعریف دقیق هدف و وظیفه اصلی', englishLabel: 'Goal / Task' },
  { id: 'context', label: 'اطلاعات پس‌زمینه و شرایط پروژه', englishLabel: 'Context' },
  { id: 'audience', label: 'مشخص کردن سطح مخاطب هدف', englishLabel: 'Audience' },
  { id: 'tone', label: 'تعیین لحن و سبک پاسخگویی', englishLabel: 'Tone & Style' },
  { id: 'constraints', label: 'قوانین منفی و خطوط قرمز', englishLabel: 'Constraints' },
  { id: 'format', label: 'قالب دقیق خروجی (JSON، بولت و...)', englishLabel: 'Output Format' },
];

export const InteractiveExerciseCard: React.FC<InteractiveExerciseCardProps> = ({
  exercise,
  onSuccess
}) => {
  const { progress, markExerciseCompleted } = useProgress();
  const [userPrompt, setUserPrompt] = useState(exercise.initialPrompt);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [evaluation, setEvaluation] = useState<{
    output: string;
    score: number;
    feedback: string;
    passed: boolean;
    strengths?: string[];
    recommendations?: string[];
  } | null>(null);

  const isAlreadyCompleted = progress.completedExercises.includes(exercise.id);

  // Live component detections
  const [liveChecks, setLiveChecks] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const roleRegex = /(نقش|شما یک|به عنوان|پرسونا|متخصص|مهندس|نویسنده|تحلیلگر|you are|act as)/i;
    const contextRegex = /(زمینه|کانتکست|پروژه|شرایط|وضعیت|کسب‌وکار|context:|background:)/i;
    const taskRegex = /(وظیفه|هدف|بنویسید|تحلیل کنید|خلاصه کنید|انجام دهید|task:|goal:|instruction:)/i;
    const audienceRegex = /(مخاطب|کاربر|توسعه‌دهنده|مشتری|خواننده|audience:)/i;
    const constraintsRegex = /(محدودیت|نباید|فقط|حداکثر|بدون|قوانین|constraints:|do not|avoid)/i;
    const formatRegex = /(فرمت|قالب|json|markdown|جدول|بولت|ساختار|output format:)/i;

    setLiveChecks({
      goal: taskRegex.test(userPrompt) || userPrompt.length > 40,
      context: contextRegex.test(userPrompt) || (userPrompt.length > 70 && userPrompt.includes('\n')),
      audience: audienceRegex.test(userPrompt),
      tone: roleRegex.test(userPrompt) || /لحن|سبک|تخصصی|رسمی/i.test(userPrompt),
      constraints: constraintsRegex.test(userPrompt),
      format: formatRegex.test(userPrompt)
    });
  }, [userPrompt]);

  const handleEvaluate = () => {
    if (exercise.simulatedResponse) {
      const customRes = exercise.simulatedResponse(userPrompt);
      setEvaluation(customRes);
      if (customRes.passed) {
        markExerciseCompleted(exercise.id);
        if (onSuccess) onSuccess();
      }
    } else {
      const scoreRes = evaluateEducationalPrompt(userPrompt, {
        requiredKeywords: exercise.expectedKeywords
      });

      setEvaluation({
        output: scoreRes.passed
          ? '✅ پرامپت شما تمامی استانداردهای کیفی این درس را برآورده ساخت و هوش مصنوعی خروجی بهینه را بازمی‌گرداند.'
          : '⚠️ پرامپت نیازمند غنی‌سازی ارکان کلیدی (نقش، محدودیت‌ها یا فرمت خروجی) است.',
        score: scoreRes.totalScore,
        feedback: scoreRes.passed
          ? 'ساختار عالی! تفکیک اجزا باعث هدایت بهینه مدل به سمت پاسخ عمیق می‌شود.'
          : scoreRes.recommendations.join(' • '),
        passed: scoreRes.passed,
        strengths: scoreRes.strengths,
        recommendations: scoreRes.recommendations
      });

      if (scoreRes.passed) {
        markExerciseCompleted(exercise.id);
        if (onSuccess) onSuccess();
      }
    }
  };

  const handleReset = () => {
    setUserPrompt(exercise.initialPrompt);
    setEvaluation(null);
  };

  return (
    <div className="rounded-3xl bg-[#141414] border border-white/5 p-5 sm:p-7 space-y-6 shadow-xl relative">
      {/* Top Tag & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <Code2 className="w-3.5 h-3.5" />
              <span>تمرین تعاملی مهندسی پرامپت</span>
            </span>
            {isAlreadyCompleted && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-black flex items-center gap-1">
                <Check className="w-3 h-3 stroke-[3]" />
                <span>حل شده (+۵۰ XP)</span>
              </span>
            )}
          </div>
          <h3 className="font-bold text-white text-base sm:text-lg">{exercise.title}</h3>
        </div>

        <button
          onClick={handleReset}
          className="self-start sm:self-auto text-xs text-gray-400 hover:text-white flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>بازنشانی به پرامپت اولیه</span>
        </button>
      </div>

      {/* Scenario & Objective */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs sm:text-sm">
        <div className="p-4 rounded-2xl bg-[#0e0e0e] border border-white/5 space-y-1">
          <span className="font-bold text-gray-300 block">📖 سناریوی تمرین:</span>
          <p className="text-gray-400 leading-relaxed">{exercise.scenario}</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0e0e0e] border border-cyan-400/20 space-y-1">
          <span className="font-bold text-cyan-300 block">🎯 هدف تمرین:</span>
          <p className="text-gray-300 leading-relaxed">{exercise.objective}</p>
        </div>
      </div>

      {/* Live Checklist */}
      <div className="p-4 rounded-2xl bg-[#0d0d0d] border border-white/5 space-y-3">
        <span className="text-xs font-bold text-gray-300 block">
          چک‌لیست ارکان پرامپت (تشخیص زنده در حین نوشتن):
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {DEFAULT_CHECKLIST.map((item) => {
            const isChecked = !!liveChecks[item.id];
            return (
              <div
                key={item.id}
                className={`p-2 rounded-xl border text-right transition-all ${
                  isChecked
                    ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                    : 'bg-[#141414] border-white/5 text-gray-500'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono">{item.englishLabel}</span>
                  {isChecked ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <span className="w-3.5 h-3.5 rounded-full border border-gray-600 block" />
                  )}
                </div>
                <span className="text-[11px] font-medium block truncate">{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Prompt Editor */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>پرامپت مهندسی‌شده خود را بازنویسی و کامل کنید:</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowHint(!showHint)}
              className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{showHint ? 'بستن راهنما' : '💡 راهنمای حل'}</span>
            </button>
            <button
              onClick={() => setShowSolution(!showSolution)}
              className="text-violet-400 hover:text-violet-300 flex items-center gap-1 font-medium transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{showSolution ? 'مخفی‌سازی پاسخ' : 'مشاهده پاسخ نمونه'}</span>
            </button>
          </div>
        </div>

        {showHint && (
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs text-amber-200 animate-in fade-in space-y-1">
            <span className="font-bold block">💡 راهنما:</span>
            <p className="leading-relaxed">{exercise.hint}</p>
          </div>
        )}

        {showSolution && (
          <div className="p-4 bg-violet-500/10 border border-violet-500/30 rounded-2xl text-xs text-violet-200 animate-in fade-in space-y-1">
            <span className="font-bold block">نمونه پاسخ پیشنهادی معمار پرامپت:</span>
            <pre className="font-mono whitespace-pre-wrap leading-relaxed pt-1 text-[11px]">
              {exercise.sampleSolution}
            </pre>
          </div>
        )}

        <textarea
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          rows={6}
          className="w-full p-4 bg-[#0a0a0a] border border-white/10 rounded-2xl text-xs sm:text-sm font-mono text-gray-200 focus:outline-none focus:border-cyan-400 transition-colors leading-relaxed"
          placeholder="پرامپت ساختاریافته خود را اینجا وارد کنید..."
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-[11px] text-gray-500 font-mono">
            طول پرامپت: {userPrompt.length} کاراکتر
          </div>

          <button
            onClick={handleEvaluate}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all"
          >
            <Terminal className="w-4 h-4" />
            <span>اجرا و اعتبارسنجی خودکار پرامپت (+۵۰ XP)</span>
          </button>
        </div>
      </div>

      {/* Evaluation Results Card */}
      {evaluation && (
        <div className={`p-5 rounded-2xl border ${
          evaluation.passed
            ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
            : 'bg-amber-950/20 border-amber-500/40 text-amber-200'
        } space-y-3 animate-in fade-in`}>
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm flex items-center gap-2">
              {evaluation.passed ? '🎉 پرامپت با موفقیت تایید شد!' : '⚠️ پرامپت نیازمند بازبینی است'}
            </span>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-black/50 border border-white/10">
              امتیاز آموزشی پرامپت: {evaluation.score} / ۱۰۰
            </span>
          </div>

          <p className="text-xs leading-relaxed font-mono whitespace-pre-wrap">{evaluation.output}</p>
          <div className="text-xs opacity-90 border-t border-white/5 pt-2 flex items-center gap-2">
            <span>💡 بازخورد:</span>
            <span>{evaluation.feedback}</span>
          </div>
        </div>
      )}
    </div>
  );
};
