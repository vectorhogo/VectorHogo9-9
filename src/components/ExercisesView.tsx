import React, { useState } from 'react';
import { 
  Code2, 
  Trophy, 
  CheckCircle2, 
  Search, 
  Filter, 
  Play, 
  Check, 
  HelpCircle, 
  Eye, 
  Sparkles, 
  Flame,
  Award,
  Terminal
} from 'lucide-react';
import { CURRICULUM_LEVELS } from '../data/curriculum';
import { useProgress } from '../context/ProgressContext';
import { Exercise, Challenge } from '../types';
import { evaluateEducationalPrompt } from '../utils/promptScoringEngine';

export const ExercisesView: React.FC = () => {
  const { progress, markExerciseCompleted, markChallengeCompleted } = useProgress();
  const [activeTab, setActiveTab] = useState<'exercises' | 'challenges'>('exercises');
  const [searchQuery, setSearchQuery] = useState('');

  // Collect all exercises
  const allExercises = CURRICULUM_LEVELS.flatMap((lvl) => 
    lvl.lessons.map((lesson) => ({
      ...lesson.exercise,
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      levelCode: lvl.code
    }))
  );

  // Collect all challenges
  const allChallenges = CURRICULUM_LEVELS.flatMap((lvl) => 
    lvl.lessons.map((lesson) => ({
      ...lesson.challenge,
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      levelCode: lvl.code
    }))
  );

  // Selected item state for solving
  const [selectedExercise, setSelectedExercise] = useState<typeof allExercises[0] | null>(allExercises[0]);
  const [selectedChallenge, setSelectedChallenge] = useState<typeof allChallenges[0] | null>(allChallenges[0]);
  
  const [exerciseInput, setExerciseInput] = useState(allExercises[0]?.initialPrompt || '');
  const [challengeInput, setChallengeInput] = useState(allChallenges[0]?.starterPrompt || '');

  const [exerciseResult, setExerciseResult] = useState<{
    output: string;
    score: number;
    feedback: string;
    passed: boolean;
  } | null>(null);

  const [challengePassed, setChallengePassed] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const handleSelectExercise = (ex: typeof allExercises[0]) => {
    setSelectedExercise(ex);
    setExerciseInput(ex.initialPrompt);
    setExerciseResult(null);
    setShowHint(false);
    setShowSolution(false);
  };

  const handleSelectChallenge = (ch: typeof allChallenges[0]) => {
    setSelectedChallenge(ch);
    setChallengeInput(ch.starterPrompt);
    setChallengePassed(false);
    setShowSolution(false);
  };

  const handleRunExercise = () => {
    if (!selectedExercise) return;
    if (selectedExercise.simulatedResponse) {
      const res = selectedExercise.simulatedResponse(exerciseInput);
      setExerciseResult(res);
      if (res.passed) {
        markExerciseCompleted(selectedExercise.id);
      }
    } else {
      const evalRes = evaluateEducationalPrompt(exerciseInput, {
        requiredKeywords: selectedExercise.expectedKeywords
      });
      const res = {
        output: evalRes.passed 
          ? '✅ پرامپت شما استانداردهای ساختاری را برآورده ساخت و خروجی بهینه‌سازی شده را فعال کرد.'
          : '⚠️ پرامپت نیازمند تقویت ارکان ساختاری و رفع ابهام است.',
        score: evalRes.totalScore,
        feedback: evalRes.passed 
          ? 'ارکان کلیدی پرامپت با موفقیت تشخیص داده شد.'
          : evalRes.recommendations.join(' • '),
        passed: evalRes.passed
      };
      setExerciseResult(res);
      if (res.passed) {
        markExerciseCompleted(selectedExercise.id);
      }
    }
  };

  const handleRunChallenge = () => {
    if (!selectedChallenge) return;
    setChallengePassed(true);
    markChallengeCompleted(selectedChallenge.id);
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-semibold text-cyan-400">PRACTICE & VALIDATION HUB</span>
            <span className="text-xs text-gray-500">•</span>
            <span className="text-xs text-gray-400">تمرین‌های تعاملی و چالش‌های صنعتی</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            کارگاه حل مسئله و آزمون‌های مهارتی
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            مهارت‌های خود را در اصلاح پرامپت‌های معیوب، قالب‌بندی JSON، مهار توهم و طراحی ایجنت‌ها بسنجید.
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
            <span className="font-bold">{progress.completedExercises.length}</span> تمرین پاس شده
          </div>
          <div className="px-4 py-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2">
            <span className="font-bold">{progress.completedChallenges.length}</span> چالش حل شده
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/5 pb-2">
        <button
          onClick={() => setActiveTab('exercises')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'exercises'
              ? 'bg-violet-600 text-white shadow-[0_0_15px_rgba(124,58,237,0.4)]'
              : 'text-gray-400 hover:text-white bg-[#141414] border border-white/5'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>تمرین‌های تعاملی با اعتبارسنجی خودکار ({allExercises.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('challenges')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'challenges'
              ? 'bg-amber-500 text-black font-extrabold shadow-[0_0_15px_rgba(245,158,11,0.4)]'
              : 'text-gray-400 hover:text-white bg-[#141414] border border-white/5'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>چالش‌های صنعتی و سناریوهای پیچیده ({allChallenges.length})</span>
        </button>
      </div>

      {/* EXERCISES SECTION */}
      {activeTab === 'exercises' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Exercises List */}
          <div className="space-y-2 max-h-[700px] overflow-y-auto pr-1">
            {allExercises.map((ex) => {
              const isCompleted = progress.completedExercises.includes(ex.id);
              const isSelected = selectedExercise?.id === ex.id;

              return (
                <div
                  key={ex.id}
                  onClick={() => handleSelectExercise(ex)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#1e1330] border-violet-500/50 shadow-[0_0_15px_rgba(124,58,237,0.2)]'
                      : isCompleted
                      ? 'bg-[#141414] border-emerald-500/30 hover:border-emerald-500/50'
                      : 'bg-[#141414] border-white/5 hover:border-white/10 hover:bg-[#1a1a1a]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-mono text-cyan-400 font-bold">{ex.levelCode}</span>
                    {isCompleted ? (
                      <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
                        <Check className="w-3 h-3" /> پاس شده
                      </span>
                    ) : (
                      <span className="text-gray-500">حل نشده</span>
                    )}
                  </div>
                  <h4 className="font-bold text-xs text-white line-clamp-1">{ex.title}</h4>
                  <p className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">{ex.scenario}</p>
                </div>
              );
            })}
          </div>

          {/* Active Exercise Solver Pane */}
          {selectedExercise && (
            <div className="lg:col-span-2 p-6 rounded-3xl bg-[#141414] border border-white/5 space-y-5">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-cyan-400 px-2.5 py-0.5 rounded-full bg-cyan-400/10 border border-cyan-400/20">
                      {selectedExercise.levelCode}
                    </span>
                    <h3 className="font-bold text-white text-base">{selectedExercise.title}</h3>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <button
                      onClick={() => setShowHint(!showHint)}
                      className="text-amber-400 hover:text-amber-300 flex items-center gap-1 px-3 py-1 rounded-xl bg-amber-400/10 border border-amber-400/20"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>{showHint ? 'بستن راهنما' : 'راهنما'}</span>
                    </button>
                    <button
                      onClick={() => setShowSolution(!showSolution)}
                      className="text-violet-400 hover:text-violet-300 flex items-center gap-1 px-3 py-1 rounded-xl bg-violet-600/10 border border-violet-500/20"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{showSolution ? 'مخفی‌سازی پاسخ' : 'مشاهده حل نمونه'}</span>
                    </button>
                  </div>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed">
                  <strong className="text-white">سناریو:</strong> {selectedExercise.scenario}
                </p>
                <p className="text-xs text-cyan-400 font-semibold">
                  🎯 هدف تمرین: {selectedExercise.objective}
                </p>
              </div>

              {showHint && (
                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-xs text-amber-200">
                  💡 {selectedExercise.hint}
                </div>
              )}

              {showSolution && (
                <div className="p-4 bg-violet-950/20 border border-violet-500/30 rounded-2xl text-xs font-mono text-violet-200 whitespace-pre-wrap">
                  {selectedExercise.sampleSolution}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs text-gray-400 block font-medium">پرامپت تصحیح‌شده شما:</label>
                <textarea
                  value={exerciseInput}
                  onChange={(e) => setExerciseInput(e.target.value)}
                  rows={8}
                  className="w-full p-4 bg-[#0d0d0d] border border-white/10 rounded-2xl text-xs font-mono text-white focus:outline-none focus:border-cyan-400/50"
                  placeholder="پرامپت مهندسی‌شده را اینجا وارد کنید..."
                />
              </div>

              <button
                onClick={handleRunExercise}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>ارزیابی و داوری خودکار پرامپت</span>
              </button>

              {exerciseResult && (
                <div className={`p-5 rounded-2xl border ${
                  exerciseResult.passed
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                    : 'bg-amber-950/20 border-amber-500/30 text-amber-200'
                } space-y-3 animate-in fade-in`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm">
                      {exerciseResult.passed ? '🎉 تبریک! پرامپت با موفقیت تایید شد (+۵۰ XP)' : '⚠️ نیاز به بهبود دستورات'}
                    </span>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-black/50 border border-white/10">
                      نمره کیفیت: {exerciseResult.score} / ۱۰۰
                    </span>
                  </div>
                  <p className="text-xs font-mono">{exerciseResult.output}</p>
                  <p className="text-xs opacity-90 border-t border-white/10 pt-2">{exerciseResult.feedback}</p>
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {/* CHALLENGES SECTION */}
      {activeTab === 'challenges' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Challenges List */}
          <div className="space-y-2 max-h-[700px] overflow-y-auto pr-1">
            {allChallenges.map((ch) => {
              const isCompleted = progress.completedChallenges.includes(ch.id);
              const isSelected = selectedChallenge?.id === ch.id;

              return (
                <div
                  key={ch.id}
                  onClick={() => handleSelectChallenge(ch)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#291b38] border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                      : isCompleted
                      ? 'bg-[#141414] border-amber-500/30'
                      : 'bg-[#141414] border-white/5 hover:border-white/10 hover:bg-[#1a1a1a]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-mono text-amber-400 font-bold">{ch.levelCode}</span>
                    <span className="text-gray-400 font-medium">سطح {ch.difficulty}</span>
                  </div>
                  <h4 className="font-bold text-xs text-white line-clamp-1">{ch.title}</h4>
                  <p className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">{ch.brief}</p>
                </div>
              );
            })}
          </div>

          {/* Active Challenge Pane */}
          {selectedChallenge && (
            <div className="lg:col-span-2 p-6 rounded-3xl bg-[#141414] border border-white/5 space-y-5">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-400 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                      {selectedChallenge.levelCode}
                    </span>
                    <h3 className="font-bold text-white text-base">{selectedChallenge.title}</h3>
                  </div>
                  <span className="text-xs text-amber-400 font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30">
                    +۱۵۰ XP
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  {selectedChallenge.brief}
                </p>
              </div>

              {/* Requirements */}
              <div className="p-4 rounded-2xl bg-[#0d0d0d] border border-white/5 space-y-2">
                <span className="text-xs font-bold text-amber-300 block">معیارهای قبولی در چالش:</span>
                <ul className="space-y-1.5 text-xs text-gray-300">
                  {selectedChallenge.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-gray-400 block font-medium">طراحی پرامپت نهایی چالش:</label>
                <textarea
                  value={challengeInput}
                  onChange={(e) => setChallengeInput(e.target.value)}
                  rows={8}
                  className="w-full p-4 bg-[#0d0d0d] border border-white/10 rounded-2xl text-xs font-mono text-white focus:outline-none focus:border-amber-500/50"
                  placeholder="پرامپت مهندسی‌شده را برای ثبت نهایی وارد کنید..."
                />
              </div>

              <button
                onClick={handleRunChallenge}
                className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all"
              >
                <Trophy className="w-4 h-4" />
                <span>ثبت چالش در کارنامه و بازگشایی نشان (+۱۵۰ XP)</span>
              </button>

              {challengePassed && (
                <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-2xl text-emerald-200 text-xs space-y-2 animate-in fade-in">
                  <span className="font-bold block">🎉 چالش ثبت شد و امتیاز آن در پروفایل شما درج گردید!</span>
                  <div className="p-3 bg-black/60 rounded-xl font-mono text-[11px] text-gray-300 whitespace-pre-wrap border border-white/5">
                    {selectedChallenge.sampleWinningPrompt}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      )}

    </div>
  );
};
