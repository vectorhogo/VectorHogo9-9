import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Sparkles, 
  Copy, 
  Check, 
  Terminal, 
  Briefcase, 
  BookOpen, 
  Lightbulb, 
  Layers, 
  Code2, 
  Trophy, 
  ExternalLink, 
  Bookmark,
  Info,
  AlertTriangle
} from 'lucide-react';
import { 
  Lesson, 
  LessonSection, 
  ExplanationSection, 
  ConceptSection, 
  ComparisonSection, 
  AnatomySection, 
  ExampleSection, 
  CodeSection, 
  ExerciseSection, 
  ChallengeSection, 
  ResourceSection, 
  CheckpointSection 
} from '../types';
import { BadBetterProComparison } from './BadBetterProComparison';
import { PromptAnatomyVisualizer } from './PromptAnatomyVisualizer';
import { InteractiveExerciseCard } from './InteractiveExerciseCard';
import { ChallengeCard } from './ChallengeCard';

interface LessonRendererProps {
  lesson: Lesson;
  onCompleteLesson?: () => void;
  isCompleted?: boolean;
}

export const LessonRenderer: React.FC<LessonRendererProps> = ({
  lesson,
  onCompleteLesson,
  isCompleted = false
}) => {
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  // Render individual sections dynamically
  const renderSection = (section: LessonSection, index: number) => {
    switch (section.type) {
      case 'explanation': {
        const s = section as ExplanationSection;
        return (
          <section key={s.id || `expl-${index}`} className="p-6 rounded-3xl bg-[#141414] border border-white/5 space-y-4">
            {s.title && (
              <h3 className="font-bold text-white text-base sm:text-lg flex items-center gap-2">
                <span className="w-1.5 h-4 bg-cyan-400 rounded-full" />
                <span>{s.title}</span>
              </h3>
            )}
            <div className="text-xs sm:text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
              {s.content}
            </div>
            {s.callout && (
              <div className={`p-4 rounded-2xl border text-xs sm:text-sm flex items-start gap-3 ${
                s.callout.type === 'warning'
                  ? 'bg-amber-950/20 border-amber-500/30 text-amber-200'
                  : s.callout.type === 'tip'
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                  : 'bg-cyan-950/20 border-cyan-500/30 text-cyan-200'
              }`}>
                {s.callout.type === 'warning' ? <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" /> : <Info className="w-4 h-4 shrink-0 text-cyan-400 mt-0.5" />}
                <div>
                  {s.callout.title && <span className="font-bold block mb-1">{s.callout.title}</span>}
                  <p className="opacity-90">{s.callout.message}</p>
                </div>
              </div>
            )}
          </section>
        );
      }

      case 'concept': {
        const s = section as ConceptSection;
        return (
          <section key={s.id || `concept-${index}`} className="p-6 rounded-3xl bg-[#141414] border border-white/5 space-y-4">
            <h3 className="font-bold text-white text-base sm:text-lg flex items-center gap-2">
              <span className="w-1.5 h-4 bg-violet-400 rounded-full" />
              <span>{s.title || 'مفاهیم و اصول کلیدی'}</span>
            </h3>
            {s.summary && (
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                {s.summary}
              </p>
            )}
            {s.principles && s.principles.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {s.principles.map((pr, pIdx) => (
                  <div key={pIdx} className="p-4 rounded-2xl bg-[#1a1a1a] border border-white/5 space-y-1.5">
                    <div className="flex items-center justify-between">
                      {pr.title && <span className="font-bold text-violet-300 text-xs sm:text-sm">{pr.title}</span>}
                      {pr.tag && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
                          {pr.tag}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">{pr.description}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        );
      }

      case 'comparison': {
        const s = section as ComparisonSection;
        return (
          <BadBetterProComparison 
            key={s.id || `comp-${index}`} 
            comparison={s.comparison} 
            title={s.title}
          />
        );
      }

      case 'anatomy': {
        const s = section as AnatomySection;
        return (
          <PromptAnatomyVisualizer 
            key={s.id || `anatomy-${index}`} 
            initialBlockId={s.defaultActiveBlock}
          />
        );
      }

      case 'example': {
        const s = section as ExampleSection;
        return (
          <section key={s.id || `example-${index}`} className="p-6 rounded-3xl bg-[#141414] border border-violet-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-violet-400">
                <Briefcase className="w-5 h-5" />
                <h3 className="font-bold text-white text-base sm:text-lg">
                  {s.title || `کاربرد در دنیای واقعی و صنعت (${s.domain})`}
                </h3>
              </div>
              <span className="text-[11px] font-mono text-gray-500 px-2.5 py-0.5 rounded-full bg-white/5">
                {s.domain}
              </span>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-gray-300">
              <p><strong className="text-white">زمینه و سناریو:</strong> {s.context}</p>
              
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>پرامپت کاربردی در پروژه:</span>
                  <button
                    onClick={() => handleCopy(s.prompt, `ex-${index}`)}
                    className="text-xs text-violet-300 hover:text-white flex items-center gap-1"
                  >
                    {copiedCodeId === `ex-${index}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>کپی</span>
                  </button>
                </div>
                <div className="p-4 bg-[#0a0a0a] rounded-2xl border border-white/10 font-mono text-violet-200 whitespace-pre-wrap leading-relaxed text-xs sm:text-sm">
                  {s.prompt}
                </div>
              </div>

              {s.expectedOutput && (
                <div className="p-3 bg-black/40 rounded-xl border border-white/5 text-xs font-mono text-gray-300">
                  <span className="text-gray-500 block mb-1">خروجی سیستم:</span>
                  {s.expectedOutput}
                </div>
              )}

              <p className="text-emerald-400 font-semibold pt-1">
                📈 بازده و اثر تجاری: {s.businessImpact}
              </p>
            </div>
          </section>
        );
      }

      case 'code': {
        const s = section as CodeSection;
        return (
          <section key={s.id || `code-${index}`} className="p-6 rounded-3xl bg-[#141414] border border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-white text-base">{s.title || 'قطعه کد و الگوی فنی'}</h3>
              </div>
              <button
                onClick={() => handleCopy(s.code, `code-${index}`)}
                className="text-xs text-cyan-300 hover:text-white flex items-center gap-1"
              >
                {copiedCodeId === `code-${index}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>کپی کد</span>
              </button>
            </div>

            <div className="p-4 bg-[#090909] rounded-2xl border border-white/10 text-xs font-mono text-cyan-200 whitespace-pre-wrap leading-relaxed overflow-x-auto" dir="ltr">
              {s.code}
            </div>

            {s.explanation && (
              <p className="text-xs text-gray-400 leading-relaxed">{s.explanation}</p>
            )}
          </section>
        );
      }

      case 'exercise': {
        const s = section as ExerciseSection;
        return (
          <InteractiveExerciseCard 
            key={s.id || `exer-${index}`} 
            exercise={s.exercise}
          />
        );
      }

      case 'challenge': {
        const s = section as ChallengeSection;
        return (
          <ChallengeCard 
            key={s.id || `chal-${index}`} 
            challenge={s.challenge}
          />
        );
      }

      case 'resource': {
        const s = section as ResourceSection;
        return (
          <section key={s.id || `res-${index}`} className="p-6 rounded-3xl bg-[#141414] border border-white/5 space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-cyan-400" />
              <span>{s.title || 'منابع تکمیلی و مستندات رسمی'}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {s.resources.map((res, rIdx) => (
                <a
                  key={rIdx}
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-2xl bg-[#1a1a1a] border border-white/5 hover:border-cyan-400/30 transition-all group flex items-start justify-between"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors block">{res.title}</span>
                    <span className="text-[10px] text-gray-500 font-mono block">{res.source}</span>
                    {res.note && <p className="text-[11px] text-gray-400">{res.note}</p>}
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-500 group-hover:text-cyan-400 shrink-0 mt-1" />
                </a>
              ))}
            </div>
          </section>
        );
      }

      case 'checkpoint': {
        const s = section as CheckpointSection;
        return (
          <section key={s.id || `chk-${index}`} className="p-6 sm:p-7 rounded-3xl bg-[#141414] border border-white/5 space-y-4">
            <h3 className="font-bold text-white text-base sm:text-lg flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-cyan-400" />
              <span>{s.title || 'جمع‌بندی و نکات کلیدی درس'}</span>
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-gray-300">
              {s.takeaways.map((takeaway, tIdx) => (
                <li key={tIdx} className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                  <span>{takeaway}</span>
                </li>
              ))}
            </ul>
          </section>
        );
      }

      default:
        return null;
    }
  };

  // If the lesson has custom structured sections array, render them!
  if (lesson.sections && lesson.sections.length > 0) {
    return (
      <div className="space-y-7">
        {lesson.sections.map((sec, idx) => renderSection(sec, idx))}
      </div>
    );
  }

  // Fallback: Standard structured template rendering
  return (
    <div className="space-y-7">
      
      {/* 1. Concept Section */}
      {lesson.concept && (
        <section className="p-6 sm:p-7 rounded-3xl bg-[#141414] border border-white/5 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-cyan-400">
            <Lightbulb className="w-5 h-5" />
            <h3 className="font-bold text-white text-base sm:text-lg">۱. مفهوم و منطق مدل‌های زبانی</h3>
          </div>
          <div className="text-xs sm:text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
            {lesson.concept}
          </div>
        </section>
      )}

      {/* 2. Core Principles */}
      {lesson.corePrinciples && lesson.corePrinciples.length > 0 && (
        <section className="p-6 sm:p-7 rounded-3xl bg-[#141414] border border-white/5 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-violet-400">
            <Layers className="w-5 h-5" />
            <h3 className="font-bold text-white text-base sm:text-lg">۲. اصول و استانداردهای طراحی</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {lesson.corePrinciples.map((principle, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-[#1a1a1a] border border-white/5 text-xs text-gray-300 flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-1.5 shrink-0" />
                <span className="leading-relaxed">{principle}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. Bad → Better → Pro Comparison */}
      {lesson.comparison && (
        <BadBetterProComparison comparison={lesson.comparison} />
      )}

      {/* 4. Prompt Anatomy Visualizer (especially featured in Level 01 and Level 02) */}
      <PromptAnatomyVisualizer initialBlockId={lesson.levelId === 2 ? 'task' : 'role'} />

      {/* 5. Real World Use Case */}
      {lesson.realWorldUseCase && (
        <section className="p-6 sm:p-7 rounded-3xl bg-[#141414] border border-violet-500/30 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-violet-400">
              <Briefcase className="w-5 h-5" />
              <h3 className="font-bold text-white text-base sm:text-lg">
                کاربرد واقعی در صنعت و بیزینس ({lesson.realWorldUseCase.domain})
              </h3>
            </div>
            <span className="text-xs font-mono text-gray-400 px-3 py-1 rounded-full bg-white/5">
              {lesson.realWorldUseCase.domain}
            </span>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-gray-300">
            <p><strong className="text-white">زمینه سناریو:</strong> {lesson.realWorldUseCase.context}</p>
            <div className="p-4 bg-[#0a0a0a] rounded-2xl border border-white/10 font-mono text-violet-200 whitespace-pre-wrap leading-relaxed">
              {lesson.realWorldUseCase.practicalPrompt}
            </div>
            <p className="text-emerald-400 font-semibold pt-1">
              📈 بازده تجاری: {lesson.realWorldUseCase.businessImpact}
            </p>
          </div>
        </section>
      )}

      {/* 6. Key Takeaways & Checkpoint */}
      {lesson.keyTakeaways && lesson.keyTakeaways.length > 0 && (
        <section className="p-6 sm:p-7 rounded-3xl bg-[#141414] border border-white/5 space-y-4 shadow-xl">
          <h3 className="font-bold text-white text-base sm:text-lg flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-cyan-400" />
            <span>جمع‌بندی و نکات کلیدی درس</span>
          </h3>
          <ul className="space-y-2.5 text-xs sm:text-sm text-gray-300">
            {lesson.keyTakeaways.map((takeaway, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                <span>{takeaway}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

    </div>
  );
};
