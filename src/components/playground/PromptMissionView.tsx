import React, { useState } from 'react';
import { PromptMission } from '../../types';
import { PROMPT_MISSIONS } from '../../data/promptMissions';
import { evaluateEducationalPrompt } from '../../utils/promptScoringEngine';
import { PromptEditor } from './PromptEditor';
import { 
  Flame, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  Lightbulb, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  ShieldCheck,
  Trophy,
  ArrowRight
} from 'lucide-react';

interface PromptMissionViewProps {
  onCompleteMission: (missionId: string, score: number, xpReward: number) => void;
  completedMissionIds?: string[];
}

export const PromptMissionView: React.FC<PromptMissionViewProps> = ({
  onCompleteMission,
  completedMissionIds = []
}) => {
  const [selectedMissionId, setSelectedMissionId] = useState<string>(PROMPT_MISSIONS[0].id);
  const [activePrompt, setActivePrompt] = useState<string>(PROMPT_MISSIONS[0].starterPrompt);
  const [evaluationResult, setEvaluationResult] = useState<{
    score: number;
    passed: boolean;
    strengths: string[];
    missed: string[];
    expertReview: string;
  } | null>(null);

  const activeMission = PROMPT_MISSIONS.find(m => m.id === selectedMissionId) || PROMPT_MISSIONS[0];
  const isMissionAlreadyCompleted = completedMissionIds.includes(activeMission.id);

  const handleSelectMission = (mission: PromptMission) => {
    setSelectedMissionId(mission.id);
    setActivePrompt(mission.starterPrompt);
    setEvaluationResult(null);
  };

  const handleEvaluateSubmission = () => {
    const evalRes = evaluateEducationalPrompt(activePrompt);
    const score = evalRes.totalScore;
    const passed = score >= 75;

    const missed: string[] = [];
    if (!evalRes.detectedComponents.hasRole) missed.push('عدم تعریف نقش و پرسونای تخصصی (Role)');
    if (!evalRes.detectedComponents.hasConstraints) missed.push('عدم تعیین قوانین بازدارنده و خطوط قرمز (Constraints)');
    if (!evalRes.detectedComponents.hasOutputFormat) missed.push('عدم تعیین ساختار شفاف برای قالب خروجی (Output Format)');
    if (!evalRes.detectedComponents.hasAudience) missed.push('عدم شفاف‌سازی مخاطبان هدف (Target Audience)');

    let expertReview = '';
    if (passed) {
      expertReview = 'آفرین! پرامپت شما تمامی استانداردهای مهندسی را پوشش داد و ساختاریافته است. خروجی در محیط پروداکشن بالاترین ضریب اطمینان را خواهد داشت.';
    } else {
      expertReview = 'پرامپت شما پایه خوبی دارد اما برای حل این چالش صنعتی نیازمند محدودیت‌های دقیق‌تر و شفاف‌سازی قالب خروجی است تا مدل به خطا نیفتد.';
    }

    setEvaluationResult({
      score,
      passed,
      strengths: evalRes.strengths,
      missed,
      expertReview
    });

    if (passed) {
      onCompleteMission(activeMission.id, score, activeMission.xpReward);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-full">
      {/* Left / Sidebar: Missions List */}
      <div className="w-full lg:w-80 flex flex-col bg-[#111115] border border-white/10 rounded-2xl overflow-hidden shrink-0">
        <div className="p-3.5 bg-[#16161c] border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">ماموریت‌های پرامپت (Missions)</h3>
              <p className="text-[10px] text-white/50">چالش‌های سناریومحور با داوری هوشمند</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
          {PROMPT_MISSIONS.map((mission, idx) => {
            const isSelected = mission.id === selectedMissionId;
            const isCompleted = completedMissionIds.includes(mission.id);

            return (
              <button
                key={mission.id}
                onClick={() => handleSelectMission(mission)}
                className={`w-full p-3 rounded-xl border text-right transition-all flex flex-col gap-1.5 ${
                  isSelected
                    ? 'bg-orange-500/15 border-orange-500/40 shadow-sm'
                    : 'bg-[#14141a] border-white/5 hover:border-white/15'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-[10px] font-mono text-orange-400">ماموریت #{idx + 1}</span>
                  {isCompleted ? (
                    <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>تکمیل شد</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-white/40">+{mission.xpReward} XP</span>
                  )}
                </div>

                <h4 className="text-xs font-semibold text-white truncate">{mission.title}</h4>
                <p className="text-[10px] text-white/50 truncate font-mono">{mission.category}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Workspace: Mission Details + Editor + Evaluation Panel */}
      <div className="flex-1 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
        {/* Mission Brief Card */}
        <div className="p-4 rounded-2xl bg-[#111115] border border-white/10 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-mono">
                  {activeMission.category}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white/5 text-white/60 text-xs font-mono">
                  سطح: {activeMission.difficulty}
                </span>
              </div>
              <h2 className="text-base font-bold text-white">{activeMission.title}</h2>
              <p className="text-xs font-mono text-white/40">{activeMission.englishTitle}</p>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>پاداش: {activeMission.xpReward} XP</span>
            </div>
          </div>

          <p className="text-xs text-white/80 font-vazir leading-relaxed bg-[#14141a] p-3 rounded-xl border border-white/5">
            {activeMission.brief}
          </p>

          {/* Requirements Checklist */}
          <div>
            <h4 className="text-xs font-semibold text-white/90 mb-2">چک‌لیست الزامات این ماموریت:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {activeMission.requirements.map((req, i) => (
                <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-white/5 text-xs text-white/80">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{req}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mission Prompt Editor */}
        <div className="min-h-[300px] flex-1">
          <PromptEditor
            prompt={activePrompt}
            onChange={setActivePrompt}
            placeholder="پرامپت نهایی خود را برای حل این ماموریت بنویسید..."
          />
        </div>

        {/* Submit & Evaluation Button */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-[#14141a] border border-white/10">
          <div className="text-xs text-white/60">
            <span>برای قبولی در این ماموریت کسب حداقل </span>
            <strong className="text-cyan-400 font-mono">۷۵ امتیاز</strong>
            <span> الزامی است.</span>
          </div>

          <button
            onClick={handleEvaluateSubmission}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold text-xs shadow-lg shadow-orange-500/20 hover:opacity-90 transition-opacity"
          >
            <Sparkles className="w-4 h-4" />
            <span>ارزیابی و ثبت راهکار ماموریت</span>
          </button>
        </div>

        {/* Evaluation Feedback Dashboard */}
        {evaluationResult && (
          <div className={`p-4 rounded-2xl border space-y-4 ${
            evaluationResult.passed 
              ? 'bg-emerald-500/[0.03] border-emerald-500/30' 
              : 'bg-amber-500/[0.03] border-amber-500/30'
          }`}>
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                {evaluationResult.passed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                )}
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {evaluationResult.passed ? 'ماموریت با موفقیت انجام شد! 🎉' : 'ماموریت نیاز به تکمیل دارد'}
                  </h3>
                  <p className="text-xs text-white/50">{evaluationResult.expertReview}</p>
                </div>
              </div>

              <div className="text-right">
                <span className={`text-base font-bold font-mono ${evaluationResult.passed ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {evaluationResult.score} / ۱۰۰
                </span>
              </div>
            </div>

            {/* Strengths & Missed */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#14141a] border border-white/5 space-y-1.5">
                <span className="font-semibold text-emerald-400 block">نقاط قوت راهکار شما:</span>
                {evaluationResult.strengths.map((str, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-white/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                    <span>{str}</span>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-[#14141a] border border-white/5 space-y-1.5">
                <span className="font-semibold text-amber-400 block">موارد جاافتاده یا قابل ارتقا:</span>
                {evaluationResult.missed.length > 0 ? (
                  evaluationResult.missed.map((m, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-white/70">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                      <span>{m}</span>
                    </div>
                  ))
                ) : (
                  <span className="text-white/40">تمام الزامات کلیدی پوشش داده شدند.</span>
                )}
              </div>
            </div>

            {/* Sample Winning Pro Prompt */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-cyan-300 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                <span>نمونه پرامپت پیروز (Winning Benchmark Solution):</span>
              </h4>
              <pre className="p-3.5 rounded-xl bg-[#0a0a0d] border border-white/10 text-cyan-100 font-mono text-xs leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
                {activeMission.sampleWinningPrompt}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
