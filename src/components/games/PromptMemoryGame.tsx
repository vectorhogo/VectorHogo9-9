import React, { useState, useEffect } from 'react';
import { RotateCcw, Trophy, Sparkles, CheckCircle2, Lightbulb, Clock } from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';

interface MemoryCard {
  id: number;
  pairId: string;
  type: 'concept' | 'match';
  text: string;
  english: string;
  explanation: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const PROMPT_PAIRS = [
  {
    id: 'role-persona',
    concept: 'ROLE',
    match: 'Persona (شخصیت)',
    conceptEnglish: 'System Role Definition',
    matchEnglish: 'Expert Persona & Voice',
    explanation: 'Role/Persona زاویه دید، سطح تخصص و لحن مدل را مشخص می‌کند تا پاسخ‌ها با هویت کاری مورد انتظار هماهنگ شوند.'
  },
  {
    id: 'context-bg',
    concept: 'CONTEXT',
    match: 'Background (زمینه)',
    conceptEnglish: 'Task Context & History',
    matchEnglish: 'Domain Grounding Data',
    explanation: 'Context اطلاعات پایه‌ای و اسناد زمینه را به مدل می‌دهد تا به جای فرضیات کلی، بر بستر دقیق مسئله تصمیم بگیرد.'
  },
  {
    id: 'task-goal',
    concept: 'TASK',
    match: 'Goal (هدف و دستور)',
    conceptEnglish: 'Primary Directive',
    matchEnglish: 'Explicit Action Objective',
    explanation: 'Task فعل و عملیات مشخصی است که مدل باید اجرا کند؛ هرچه مستقیم‌تر و شفاف‌تر باشد، انحراف مدل کمتر است.'
  },
  {
    id: 'output-format',
    concept: 'OUTPUT',
    match: 'Format (قالب خروجی)',
    conceptEnglish: 'Structural Format',
    matchEnglish: 'JSON / Markdown Schema',
    explanation: 'Output Format ساختار نهایی پاسخ (مثل JSON معتبر یا جداول Markdown) را تعیین می‌کند تا برای سیستم‌های بعدی آماده باشد.'
  },
  {
    id: 'example-fewshot',
    concept: 'EXAMPLE',
    match: 'Few-Shot (نمونه‌ها)',
    conceptEnglish: 'In-Context Examples',
    matchEnglish: 'Pattern Demonstrations',
    explanation: 'Few-Shot با نشان دادن ۲ الی ۳ جفت نمونه ورودی/خروجی، الگوی دقیق ذهنی را بدون نیاز به توضیحات طولانی به مدل آموزش می‌دهد.'
  },
  {
    id: 'constraint-limit',
    concept: 'CONSTRAINT',
    match: 'Limitation (مرزها)',
    conceptEnglish: 'Negative Constraints',
    matchEnglish: 'Boundary Guardrails',
    explanation: 'Constraint مرزهای منفی و ممنوعیت‌ها را تعیین می‌کند (مثلاً «از ذکر قیمت فرضی خودداری کن»).'
  },
  {
    id: 'cot-chain',
    concept: 'COT',
    match: 'Chain-of-Thought',
    conceptEnglish: 'Step-by-Step Reasoning',
    matchEnglish: 'Deliberate Thinking Loop',
    explanation: 'CoT مدل را وادار می‌کند قبل از نتیجه نهایی، گام‌های تحلیل و استدلال خود را بررسی کند و از اشتباهات شهودی بپرهیزد.'
  },
  {
    id: 'guardrail-safety',
    concept: 'GUARDRAIL',
    match: 'Safety (ایمنی و مهار توهم)',
    conceptEnglish: 'Hallucination Mitigation',
    matchEnglish: 'Verification Checklist',
    explanation: 'Guardrailها فیلترهای اعتبارسنجی هستند که مانع از تولید اطلاعات ساختگی (Hallucination) یا خروجی‌های ناامن می‌شوند.'
  }
];

export const PromptMemoryGame: React.FC<{
  onClose?: () => void;
}> = ({ onClose }) => {
  const { progress, recordGameResult } = useProgress();
  const bestScore = progress.gameStats?.memoryBestScore || 0;
  const bestMoves = progress.gameStats?.memoryBestMoves || 0;

  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchedPairsCount, setMatchedPairsCount] = useState(0);
  const [lastMatchedExplanation, setLastMatchedExplanation] = useState<string | null>(null);
  const [lastMatchedTitle, setLastMatchedTitle] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Initialize and shuffle cards
  const initializeGame = () => {
    const deck: MemoryCard[] = [];
    let idCounter = 0;

    PROMPT_PAIRS.forEach(pair => {
      deck.push({
        id: idCounter++,
        pairId: pair.id,
        type: 'concept',
        text: pair.concept,
        english: pair.conceptEnglish,
        explanation: pair.explanation,
        isFlipped: false,
        isMatched: false
      });
      deck.push({
        id: idCounter++,
        pairId: pair.id,
        type: 'match',
        text: pair.match,
        english: pair.matchEnglish,
        explanation: pair.explanation,
        isFlipped: false,
        isMatched: false
      });
    });

    // Fisher-Yates shuffle
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    setCards(deck);
    setFlippedIndices([]);
    setMoves(0);
    setMatchedPairsCount(0);
    setLastMatchedExplanation(null);
    setLastMatchedTitle(null);
    setIsCompleted(false);
    setSeconds(0);
    setIsTimerRunning(true);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  // Timer tick
  useEffect(() => {
    if (!isTimerRunning || isCompleted) return;
    const interval = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning, isCompleted]);

  const handleCardClick = (index: number) => {
    if (cards[index].isFlipped || cards[index].isMatched || flippedIndices.length >= 2) {
      return;
    }

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [firstIdx, secondIdx] = newFlipped;
      const firstCard = newCards[firstIdx];
      const secondCard = newCards[secondIdx];

      if (firstCard.pairId === secondCard.pairId) {
        // MATCH!
        setTimeout(() => {
          setCards(prev => {
            const updated = [...prev];
            updated[firstIdx].isMatched = true;
            updated[secondIdx].isMatched = true;
            return updated;
          });
          setFlippedIndices([]);
          setMatchedPairsCount(c => {
            const nextCount = c + 1;
            if (nextCount === PROMPT_PAIRS.length) {
              handleGameComplete(moves + 1, seconds);
            }
            return nextCount;
          });
          setLastMatchedTitle(`${firstCard.text} ↔ ${secondCard.text}`);
          setLastMatchedExplanation(firstCard.explanation);
        }, 300);
      } else {
        // NO MATCH - flip back
        setTimeout(() => {
          setCards(prev => {
            const updated = [...prev];
            updated[firstIdx].isFlipped = false;
            updated[secondIdx].isFlipped = false;
            return updated;
          });
          setFlippedIndices([]);
        }, 900);
      }
    }
  };

  const handleGameComplete = (finalMoves: number, timeSpent: number) => {
    setIsCompleted(true);
    setIsTimerRunning(false);

    // Calculate score based on speed and moves
    const baseScore = 1000;
    const movePenalty = Math.max(0, (finalMoves - 8) * 20);
    const timePenalty = Math.max(0, timeSpent * 2);
    const calculatedScore = Math.max(100, baseScore - movePenalty - timePenalty);

    recordGameResult('memory', calculatedScore, { moves: finalMoves });
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center p-3 select-none max-w-2xl mx-auto">
      
      {/* Header Info */}
      <div className="w-full flex items-center justify-between mb-4 bg-[#141414] px-5 py-3 rounded-2xl border border-white/5">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-400 font-vazir">تعداد حرکت:</span>
            <span className="text-base font-bold font-mono text-cyan-400">{moves}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-xs font-mono text-gray-300">{formatTime(seconds)}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs text-gray-400 font-vazir">بهترین حرکت:</span>
            <span className="text-sm font-bold font-mono text-amber-400">
              {bestMoves && bestMoves !== 999 ? bestMoves : '-'}
            </span>
          </div>
          <button
            onClick={initializeGame}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            title="شروع مجدد"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Concept Match Explanation Banner */}
      {lastMatchedExplanation && (
        <div className="w-full mb-3 p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-right animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2 mb-1">
            <Lightbulb className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="text-xs font-bold text-cyan-300 font-mono">{lastMatchedTitle}</span>
            <span className="text-[10px] text-emerald-400 font-vazir mr-auto flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              تطبیق موفق
            </span>
          </div>
          <p className="text-xs text-cyan-100/90 leading-relaxed font-vazir">
            {lastMatchedExplanation}
          </p>
        </div>
      )}

      {/* 4x4 Grid of Cards */}
      <div className="relative w-full">
        <div className="grid grid-cols-4 gap-2.5 sm:gap-3 w-full">
          {cards.map((card, idx) => {
            const isFlippedOrMatched = card.isFlipped || card.isMatched;

            return (
              <button
                key={card.id}
                onClick={() => handleCardClick(idx)}
                disabled={isFlippedOrMatched}
                className={`h-20 sm:h-24 rounded-2xl p-2 sm:p-2.5 flex flex-col items-center justify-center text-center transition-all duration-300 border ${
                  card.isMatched
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.2)] cursor-default'
                    : card.isFlipped
                    ? 'bg-violet-950/60 border-violet-500/60 text-white shadow-[0_0_15px_rgba(139,92,246,0.3)] scale-102'
                    : 'bg-[#141414] hover:bg-[#1a1a1a] border-white/5 text-gray-500 hover:border-white/10 active:scale-98'
                }`}
              >
                {isFlippedOrMatched ? (
                  <div className="animate-in fade-in zoom-in-95 duration-200 w-full">
                    <div className={`font-bold font-mono tracking-tight text-xs sm:text-sm line-clamp-2 ${
                      card.type === 'concept' ? 'text-cyan-300 font-extrabold' : 'text-violet-300'
                    }`}>
                      {card.text}
                    </div>
                    <span className="text-[9px] text-gray-400 font-mono block mt-1 truncate">
                      {card.english}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-1">
                    <Sparkles className="w-5 h-5 text-gray-600" />
                    <span className="text-[10px] text-gray-600 font-mono">PROMPT</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Completed Modal Overlay */}
        {isCompleted && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center p-6 text-center z-20 animate-in fade-in duration-300">
            <div className="space-y-4 max-w-sm">
              <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-400 p-[2px] shadow-[0_0_20px_rgba(16,185,129,0.5)]">
                <div className="w-full h-full bg-[#0d0d0d] rounded-full flex items-center justify-center text-emerald-400">
                  <Trophy className="w-7 h-7" />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-white font-vazir">تسلط کامل بر مفاهیم! 🎉</h3>
                <p className="text-xs text-gray-300 font-vazir mt-1">
                  تمام ۸ مفهوم کلیدی مهندسی پرامپت را با موفقیت تطبیق دادید.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-[#171717] p-3 rounded-2xl border border-white/5 text-center">
                <div>
                  <span className="text-[11px] text-gray-400 block font-vazir">تعداد حرکت</span>
                  <span className="text-base font-bold font-mono text-cyan-400">{moves} حرکت</span>
                </div>
                <div>
                  <span className="text-[11px] text-gray-400 block font-vazir">زمان ثبت‌شده</span>
                  <span className="text-base font-bold font-mono text-emerald-400">{formatTime(seconds)}</span>
                </div>
              </div>

              <button
                onClick={initializeGame}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 font-vazir transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>بازی مجدد</span>
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
