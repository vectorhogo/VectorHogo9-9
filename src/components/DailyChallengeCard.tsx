import React, { useState } from 'react';
import { 
  Flame, 
  Sparkles, 
  ArrowLeft, 
  CheckCircle2, 
  BookOpen, 
  Copy, 
  Check, 
  Clock, 
  Lightbulb, 
  Code2, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';
import { DAILY_CHALLENGES, PROMPTS_OF_THE_DAY } from '../data/dailyPrompts';
import { useProgress } from '../context/ProgressContext';

interface DailyChallengeCardProps {
  onStartChallenge: (starterPrompt: string, title: string) => void;
}

export const DailyChallengeCard: React.FC<DailyChallengeCardProps> = ({ onStartChallenge }) => {
  const { progress, markDailyChallengeCompleted } = useProgress();
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [showFullExplanation, setShowFullExplanation] = useState(false);

  // Current day items
  const dailyChallenge = DAILY_CHALLENGES[0];
  const promptOfTheDay = PROMPTS_OF_THE_DAY[0];

  const todayKey = new Date().toISOString().split('T')[0];
  const isCompletedToday = progress.dailyChallengeStatus?.lastCompletedDate === todayKey;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleStart = () => {
    onStartChallenge(dailyChallenge.starterPrompt, dailyChallenge.title);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* 1. Daily Prompt Challenge Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#16141a] to-[#0e0d12] border border-orange-500/20 p-6 shadow-xl flex flex-col justify-between space-y-5">
        
        {/* Top Glow Accent */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-500/10 blur-2xl pointer-events-none" />

        <div className="space-y-3 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30">
                <Flame className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-orange-400 uppercase tracking-wider font-mono">
                🔥 Daily Prompt Challenge
              </span>
            </div>

            {isCompletedToday ? (
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                تکمیل شده امروز
              </span>
            ) : (
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-300 border border-orange-500/20 font-mono">
                +{dailyChallenge.xpReward} XP
              </span>
            )}
          </div>

          <h3 className="text-lg font-bold text-white font-vazir leading-snug">
            {dailyChallenge.title}
          </h3>

          <p className="text-xs text-gray-300 leading-relaxed font-vazir">
            {dailyChallenge.scenario}
          </p>

          {/* Quick checklist */}
          <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1.5">
            <div className="text-[11px] font-semibold text-white/70">الزامات این چالش:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-gray-400 font-vazir">
              {dailyChallenge.quickRequirements.map((req, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <span className="text-orange-400 text-xs">▪</span>
                  <span>{req}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex items-center justify-between gap-3 relative z-10">
          <div className="text-[11px] text-gray-400 font-vazir">
            بدون جریمه در صورت غیبت • تمرین مستمر
          </div>

          <button
            onClick={handleStart}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:brightness-110 text-white font-bold text-xs flex items-center gap-1.5 shadow-[0_4px_15px_rgba(249,115,22,0.3)] transition-all shrink-0"
          >
            <span>شروع Challenge</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* 2. Prompt of the Day (💡 پرامپت برگزیده روز) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#12161c] to-[#0c0e12] border border-cyan-500/20 p-6 shadow-xl flex flex-col justify-between space-y-4">
        
        {/* Top Glow Accent */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/10 blur-2xl pointer-events-none" />

        <div className="space-y-3 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <Lightbulb className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">
                💡 Prompt of the Day
              </span>
            </div>

            <div className="flex items-center gap-1 text-[11px] text-gray-400 font-mono">
              <Clock className="w-3 h-3" />
              <span>{promptOfTheDay.estimatedReadingTime}</span>
            </div>
          </div>

          <h3 className="text-lg font-bold text-white font-vazir leading-snug">
            {promptOfTheDay.title}
          </h3>

          {/* Problem Statement */}
          <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-xs text-gray-300 font-vazir leading-relaxed">
            <span className="text-cyan-400 font-bold ml-1">مسئله:</span>
            <span>{promptOfTheDay.problem}</span>
          </div>

          {/* Prompt Code Block */}
          <div className="relative rounded-xl bg-[#08080a] border border-white/10 p-3">
            <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono mb-1.5 pb-1 border-b border-white/5">
              <span>الگوی مهندسی‌شده (Prompt):</span>
              <button
                onClick={() => handleCopy(promptOfTheDay.prompt)}
                className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-sans"
              >
                {copiedPrompt ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedPrompt ? 'کپی شد' : 'کپی پرامپت'}</span>
              </button>
            </div>
            <pre className="text-[11px] font-mono text-cyan-200/90 leading-relaxed whitespace-pre-wrap max-h-28 overflow-y-auto custom-scrollbar">
              {promptOfTheDay.prompt}
            </pre>
          </div>

          {/* Why it works & techniques */}
          <div className="space-y-1.5 text-xs">
            <div className="text-gray-300 font-vazir leading-relaxed">
              <span className="text-emerald-400 font-bold ml-1">چرا موثر است؟</span>
              <span>{promptOfTheDay.whyItWorks}</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {promptOfTheDay.keyTechniques.map((tech, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] text-gray-400 font-mono">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
