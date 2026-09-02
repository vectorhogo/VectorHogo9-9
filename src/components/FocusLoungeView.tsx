import React, { useState, useEffect } from 'react';
import { 
  Coffee, 
  Sparkles, 
  Play, 
  Trophy, 
  Clock, 
  RotateCcw, 
  X, 
  Maximize2, 
  Minimize2, 
  Gamepad2, 
  Compass, 
  Flame, 
  ArrowRight,
  Brain,
  ShieldCheck,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { SnakeGame } from './games/SnakeGame';
import { Game2048 } from './games/Game2048';
import { PromptMemoryGame } from './games/PromptMemoryGame';

export const FocusLoungeView: React.FC<{
  onNavigate?: (view: string, lessonId?: string) => void;
}> = ({ onNavigate }) => {
  const { progress, recordBreakCompleted } = useProgress();
  const gameStats = progress.gameStats || {
    snakeBestScore: 0,
    game2048BestScore: 0,
    memoryBestScore: 0,
    memoryBestMoves: 0,
    breaksCompletedCount: 0,
    gamesPlayedCount: 0
  };

  // Active game modal state
  const [activeGame, setActiveGame] = useState<'snake' | '2048' | 'memory' | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Break Timer State
  const [selectedDurationMinutes, setSelectedDurationMinutes] = useState<number>(5);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [isBreakFinished, setIsBreakFinished] = useState<boolean>(false);

  // Timer Tick
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isTimerRunning && timerSecondsLeft > 0) {
      interval = setInterval(() => {
        setTimerSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            setIsBreakFinished(true);
            recordBreakCompleted();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSecondsLeft, recordBreakCompleted]);

  const startBreakTimer = (minutes: number) => {
    setSelectedDurationMinutes(minutes);
    setTimerSecondsLeft(minutes * 60);
    setIsTimerRunning(true);
    setIsBreakFinished(false);
  };

  const stopBreakTimer = () => {
    setIsTimerRunning(false);
    setTimerSecondsLeft(0);
    setIsBreakFinished(false);
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const timerProgressPercent = timerSecondsLeft > 0
    ? Math.round(((selectedDurationMinutes * 60 - timerSecondsLeft) / (selectedDurationMinutes * 60)) * 100)
    : 0;

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-300">
      
      {/* Hero / Identity Card */}
      <div className="relative overflow-hidden rounded-3xl bg-[#141414] border border-white/5 p-6 lg:p-8 shadow-2xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                <Coffee className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-vazir">
                  اتاق استراحت و تمرکز (Focus Lounge)
                </h1>
                <p className="text-xs sm:text-sm text-gray-400 font-vazir mt-0.5">
                  چند دقیقه استراحت کن، بعد برگرد سراغ Promptها.
                </p>
              </div>
            </div>
            
            <p className="text-xs text-gray-400 leading-relaxed font-vazir pt-2">
              مهندسی پرامپت نیازمند وضوح فکری بالا و تمرکز عمیق است. با مینی‌گیم‌های سبک و تایمر استراحت آگاهانه، ذهن خود را بازیابی کنید.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <div className="bg-[#0d0d0d] px-5 py-3.5 rounded-2xl border border-white/5 flex items-center gap-4 w-full lg:w-auto justify-between">
              <div>
                <span className="text-[11px] text-gray-400 block font-vazir">جلسات استراحت:</span>
                <span className="text-base font-bold font-mono text-amber-400">{gameStats.breaksCompletedCount || 0} جلسه</span>
              </div>
              <div className="w-px h-8 bg-white/5" />
              <div>
                <span className="text-[11px] text-gray-400 block font-vazir">بازی‌های انجام‌شده:</span>
                <span className="text-base font-bold font-mono text-cyan-400">{gameStats.gamesPlayedCount || 0} دور</span>
              </div>
            </div>
          </div>

        </div>

        {/* Ambient Glow */}
        <div className="absolute top-0 left-1/4 w-80 h-80 bg-amber-500/5 blur-[90px] pointer-events-none -z-0" />
      </div>

      {/* Break Timer Suite */}
      <section className="bg-[#141414] border border-white/5 rounded-3xl p-6 lg:p-7 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="space-y-2 text-right w-full md:w-auto">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base font-bold text-white font-vazir">تایمر استراحت آگاهانه (Mindful Break Timer)</h2>
            </div>
            <p className="text-xs text-gray-400 font-vazir max-w-lg leading-relaxed">
              یک بازه کوتاه انتخاب کنید. در این مدت می‌توانید بازی کنید یا چشمان خود را استراحت دهید؛ در پایان به شما یادآوری خواهیم کرد.
            </p>
          </div>

          {/* Preset Buttons or Running Countdown */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end flex-wrap">
            {isTimerRunning ? (
              <div className="flex items-center gap-4 bg-[#0d0d0d] px-6 py-3 rounded-2xl border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                <div className="text-right">
                  <span className="text-[10px] text-cyan-400 font-vazir block">زمان باقی‌مانده:</span>
                  <span className="text-xl font-bold font-mono text-white tracking-widest">{formatTime(timerSecondsLeft)}</span>
                </div>
                <button
                  onClick={stopBreakTimer}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-rose-400 transition-colors"
                  title="توقف استراحت"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : isBreakFinished ? (
              <div className="flex flex-col sm:flex-row items-center gap-3 bg-emerald-950/40 border border-emerald-500/30 px-5 py-3 rounded-2xl animate-in zoom-in-95 duration-300">
                <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold font-vazir">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>وقتشه برگردیم سراغ Promptها 🚀</span>
                </div>
                {onNavigate && (
                  <button
                    onClick={() => onNavigate('dashboard')}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs font-vazir flex items-center gap-1.5 transition-all shadow-md"
                  >
                    <span>بازگشت به آموزش</span>
                    <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                  </button>
                )}
                <button
                  onClick={() => setIsBreakFinished(false)}
                  className="px-3 py-2 text-xs text-gray-400 hover:text-white font-vazir"
                >
                  بستن
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-[#0d0d0d] p-1.5 rounded-2xl border border-white/5">
                {[5, 10, 15].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => startBreakTimer(mins)}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/5 transition-all font-vazir flex items-center gap-1.5"
                  >
                    <Coffee className="w-3.5 h-3.5 text-amber-400" />
                    <span>{mins} دقیقه</span>
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Linear progress bar if active */}
        {isTimerRunning && (
          <div className="w-full bg-[#0d0d0d] h-1.5 rounded-full overflow-hidden mt-4 border border-white/5">
            <div
              className="h-full bg-gradient-to-r from-amber-400 via-cyan-400 to-emerald-400 transition-all duration-1000"
              style={{ width: `${timerProgressPercent}%` }}
            />
          </div>
        )}
      </section>

      {/* 3 Mini Games Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2 font-vazir">
              <Gamepad2 className="w-5 h-5 text-cyan-400" />
              <span>مینی‌گیم‌های تمرکز و رفع خستگی (Mini Games)</span>
            </h2>
            <p className="text-xs text-gray-400 font-vazir mt-0.5">
              بازی‌های سبک و هدفمند بدون ثبت زمان به عنوان ساعات درسی
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Game 1: Snake */}
          <div className="group bg-[#141414] hover:bg-[#161616] border border-white/5 hover:border-emerald-500/30 rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between shadow-xl hover:shadow-[0_0_25px_rgba(16,185,129,0.1)] relative overflow-hidden">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl">
                  🐍
                </div>
                <div className="flex items-center gap-1.5 bg-[#0d0d0d] px-3 py-1.5 rounded-xl border border-white/5">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-xs font-mono font-bold text-amber-400">
                    {gameStats.snakeBestScore || 0}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-white font-vazir">مار کلاسیک (Snake)</h3>
                <span className="text-[11px] text-gray-500 font-mono block">Minimal RGB Snake</span>
                <p className="text-xs text-gray-300 leading-relaxed font-vazir mt-2">
                  چند دقیقه ذهن را آزاد کن. با مار هدایت‌شونده دانه‌های نورانی را جمع‌آوری کنید.
                </p>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={() => setActiveGame('snake')}
                className="w-full py-3 rounded-2xl bg-[#1c1c1c] group-hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all font-vazir shadow-md group-hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>شروع بازی Snake</span>
              </button>
            </div>
          </div>

          {/* Game 2: 2048 */}
          <div className="group bg-[#141414] hover:bg-[#161616] border border-white/5 hover:border-cyan-500/30 rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between shadow-xl hover:shadow-[0_0_25px_rgba(6,182,212,0.1)] relative overflow-hidden">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center text-xl font-bold font-mono">
                  2048
                </div>
                <div className="flex items-center gap-1.5 bg-[#0d0d0d] px-3 py-1.5 rounded-xl border border-white/5">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-xs font-mono font-bold text-amber-400">
                    {gameStats.game2048BestScore || 0}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-white font-vazir">بازی عددی ۲۰۴۸ (2048)</h3>
                <span className="text-[11px] text-gray-500 font-mono block">Strategic Grid Merge</span>
                <p className="text-xs text-gray-300 leading-relaxed font-vazir mt-2">
                  تمرکز و پیش‌بینی چند گام جلوتر با ادغام خانه‌های هم‌ارزش تا رسیدن به عدد ۲۰۴۸.
                </p>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={() => setActiveGame('2048')}
                className="w-full py-3 rounded-2xl bg-[#1c1c1c] group-hover:bg-cyan-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all font-vazir shadow-md group-hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>شروع بازی 2048</span>
              </button>
            </div>
          </div>

          {/* Game 3: Prompt Memory */}
          <div className="group bg-[#141414] hover:bg-[#161616] border border-white/5 hover:border-violet-500/30 rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between shadow-xl hover:shadow-[0_0_25px_rgba(139,92,246,0.1)] relative overflow-hidden">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center text-xl">
                  🧩
                </div>
                <div className="flex items-center gap-1.5 bg-[#0d0d0d] px-3 py-1.5 rounded-xl border border-white/5">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-xs font-mono font-bold text-amber-400">
                    {gameStats.memoryBestMoves && gameStats.memoryBestMoves !== 999 ? `${gameStats.memoryBestMoves} حرکت` : '-'}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-white font-vazir">حافظه پرامپت (Prompt Memory)</h3>
                <span className="text-[11px] text-gray-500 font-mono block">Educational Concept Pairs</span>
                <p className="text-xs text-gray-300 leading-relaxed font-vazir mt-2">
                  تطبیق کارتی مفاهیم کلیدی پرامپتینگ (Role, Context, Few-Shot) به همراه توضیحات کوتاه.
                </p>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={() => setActiveGame('memory')}
                className="w-full py-3 rounded-2xl bg-[#1c1c1c] group-hover:bg-violet-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all font-vazir shadow-md group-hover:shadow-[0_0_15px_rgba(139,92,246,0.3)]"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>شروع بازی Memory</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Zen Advice & AI Engineer Mental Tips */}
      <section className="bg-gradient-to-r from-[#181124] via-[#141414] to-[#0d0d0d] border border-violet-500/20 rounded-3xl p-6 lg:p-7">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center shrink-0">
            <Brain className="w-5 h-5" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-sm font-bold text-white font-vazir">نکته تمرکز برای مهندسان هوش مصنوعی</h3>
            <p className="text-xs text-gray-300 leading-relaxed font-vazir">
              هنگام برخورد با پرامپت‌های پیچیده یا دیباگ سیستم‌های ایجنتی چندمرحله‌ای، ۱۵ دقیقه فاصله گرفتن از مانیتور و اکسیژن‌گیری عمیق، بازدهی حل مسئله را تا ۴۰٪ بهبود می‌بخشد.
            </p>
          </div>
        </div>
      </section>

      {/* Game Modal / Focused Environment */}
      {activeGame && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className={`w-full bg-[#111] border border-white/10 rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 flex flex-col ${
            isFullscreen ? 'h-full max-w-5xl' : 'max-w-2xl max-h-[90vh]'
          }`}>
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-[#141414]">
              <div className="flex items-center gap-2.5">
                <span className="text-lg">
                  {activeGame === 'snake' ? '🐍' : activeGame === '2048' ? '🔢' : '🧩'}
                </span>
                <span className="text-sm font-bold text-white font-vazir">
                  {activeGame === 'snake' ? 'مار کلاسیک (Snake)' : activeGame === '2048' ? 'بازی ۲۰۴۸ (2048)' : 'حافظه پرامپت (Prompt Memory)'}
                </span>
                {isTimerRunning && (
                  <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-full border border-cyan-500/30 flex items-center gap-1 mr-2">
                    <Clock className="w-3 h-3" />
                    {formatTime(timerSecondsLeft)}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                  title={isFullscreen ? 'کوچک‌نمایی' : 'تمام‌صفحه'}
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setActiveGame(null)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-rose-400 transition-colors"
                  title="خروج از بازی"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body with Active Game */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex items-center justify-center">
              {activeGame === 'snake' && <SnakeGame onClose={() => setActiveGame(null)} />}
              {activeGame === '2048' && <Game2048 onClose={() => setActiveGame(null)} />}
              {activeGame === 'memory' && <PromptMemoryGame onClose={() => setActiveGame(null)} />}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
