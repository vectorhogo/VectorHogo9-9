import React, { useState } from 'react';
import { Sparkles, ArrowLeft, ArrowRight, Check, Compass, Target, Layers, BookOpen, X } from 'lucide-react';
import { ExperienceLevel, PrimaryGoal, OnboardingState } from '../types';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (state: OnboardingState, targetLessonId?: string) => void;
  onSkip: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onComplete, onSkip }) => {
  const [step, setStep] = useState<number>(1);
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('some_experience');
  const [primaryGoal, setPrimaryGoal] = useState<PrimaryGoal>('build_pro_prompts');

  if (!isOpen) return null;

  // Derive recommended path
  const getRecommendation = () => {
    if (experienceLevel === 'beginner' || primaryGoal === 'learn_foundations') {
      return {
        levelCode: 'LEVEL 01',
        lessonId: 'l01-01',
        title: 'مسیر مبانی مهندسی پرامپت (Foundations)',
        pathText: 'مبانی توکن‌ها (L01) ← ساختار پرامپت (L02) ← شفافیت و ابهام‌زدایی (L03)',
        description: 'شروع از اصول بنیادین تفکر مدل‌های زبانی بزرگ، ساختار نقش و کانتکست اولیه.'
      };
    } else if (experienceLevel === 'advanced' || primaryGoal === 'build_ai_workflows' || primaryGoal === 'real_world_projects') {
      return {
        levelCode: 'LEVEL 07',
        lessonId: 'l07-01',
        title: 'مسیر پیشرفته و سیستم‌های هوشمند (Advanced AI Systems)',
        pathText: 'تکنیک‌های پیشرفته (L07) ← گاردریل‌ها (L08) ← بنچ‌مارک (L09) ← سیستم‌ها و ایجنت‌ها (L11-L12)',
        description: 'تمرکز بر ساختاردهی رسمی، تفکیک کانتکست، تگ‌های XML و معماری ابزارها.'
      };
    } else {
      return {
        levelCode: 'LEVEL 02',
        lessonId: 'l02-01',
        title: 'مسیر ساختاردهی و مهندسی پرامپت (Standard Track)',
        pathText: 'ساختار استاندارد (L02) ← مهندسی کانتکست (L03) ← کنترل خروجی (L04) ← یادگیری چندنمونه‌ای (L05)',
        description: 'یادگیری چارچوب‌های صنعتی، تکنیک Few-Shot و قالب‌بندی ساختاریافته خروجی (JSON / XML).'
      };
    }
  };

  const recommendation = getRecommendation();

  const handleFinish = () => {
    onComplete(
      {
        completed: true,
        experienceLevel,
        primaryGoal,
        recommendedStartingLessonId: recommendation.lessonId,
        completedAt: new Date().toISOString(),
        skipped: false
      },
      recommendation.lessonId
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
        className="w-full max-w-xl bg-[#141417] border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 text-right relative overflow-hidden font-vazir"
      >
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 blur-3xl pointer-events-none -z-0" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-400/10 blur-3xl pointer-events-none -z-0" />

        {/* Top Header: Step Indicator & Skip button */}
        <div className="flex items-center justify-between relative z-10 border-b border-white/5 pb-4">
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === step
                    ? 'w-8 bg-cyan-400'
                    : i < step
                    ? 'w-4 bg-violet-500/80'
                    : 'w-2 bg-white/10'
                }`}
              />
            ))}
            <span className="text-[11px] text-gray-400 mr-2 font-mono">گام {step} از ۴</span>
          </div>

          <button
            onClick={onSkip}
            className="text-xs text-gray-400 hover:text-white px-2.5 py-1 rounded-lg hover:bg-white/5 transition-colors"
          >
            رد کردن راهنما
          </button>
        </div>

        {/* STEP 1: Welcome */}
        {step === 1 && (
          <div className="space-y-4 py-2 relative z-10 animate-fadeIn">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-400 flex items-center justify-center text-white shadow-[0_0_20px_rgba(124,58,237,0.4)]">
              <Sparkles className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h2 id="onboarding-title" className="text-xl sm:text-2xl font-extrabold text-white">
                به PromptLab خوش آمدید
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                اینجا قراره مهندسی پرامپت (Prompt Engineering) رو از اصول پایه تا طراحی سیستم‌های حرفه‌ای هوش مصنوعی یاد بگیری.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#0d0d10] border border-white/5 space-y-1">
                <span className="font-bold text-cyan-400 block">۱۲ سطح آموزشی استاندارد</span>
                <span className="text-gray-400 text-[11px]">بر اساس متدولوژی‌های معتبر Anthropic و OpenAI</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#0d0d10] border border-white/5 space-y-1">
                <span className="font-bold text-violet-400 block">محیط آزمایش تعاملی</span>
                <span className="text-gray-400 text-[11px]">کارگاه پرامپت، دستیار هوشمند، و میدان چالش Arena</span>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <span className="text-[11px] text-gray-500">پیکربندی هوشمند در ۳۰ ثانیه</span>
              <button
                onClick={() => setStep(2)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:brightness-110 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md"
              >
                <span>ادامه و شخصی‌سازی</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Experience Level */}
        {step === 2 && (
          <div className="space-y-4 py-2 relative z-10 animate-fadeIn">
            <div className="space-y-1">
              <span className="text-xs font-mono text-cyan-400 block">سطح تجربه شما</span>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                چقدر با کار با مدل‌های هوش مصنوعی آشنا هستید؟
              </h3>
            </div>

            <div className="space-y-2.5 pt-1">
              {[
                { id: 'beginner', title: 'کاملاً مبتدی', desc: 'تازه شروع کرده‌ام و می‌خواهم مفاهیم را از پایه بیاموزم.' },
                { id: 'some_experience', title: 'کمی تجربه دارم', desc: 'گاهی با ChatGPT یا Claude صحبت می‌کنم، اما چارچوب ساختاریافته ندارم.' },
                { id: 'intermediate', title: 'متوسط', desc: 'با اصول نوشتن پرامپت آشنام و می‌خواهم تکنیک‌های صنعتی را یاد بگیرم.' },
                { id: 'advanced', title: 'پیشرفته', desc: 'برای سیستم‌ها، ایجنت‌ها، APIها و کسب‌وکار به دنبال استانداردهای پیشرفته هستم.' }
              ].map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => setExperienceLevel(opt.id as ExperienceLevel)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    experienceLevel === opt.id
                      ? 'bg-violet-600/15 border-violet-500/50 shadow-[0_0_15px_rgba(124,58,237,0.15)]'
                      : 'bg-[#0d0d10] border-white/5 hover:border-white/15'
                  }`}
                >
                  <div className="space-y-1">
                    <span className="text-sm font-bold text-white block">{opt.title}</span>
                    <span className="text-xs text-gray-400 block">{opt.desc}</span>
                  </div>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                    experienceLevel === opt.id ? 'border-cyan-400 bg-cyan-400/20 text-cyan-400' : 'border-white/20'
                  }`}>
                    {experienceLevel === opt.id && <Check className="w-3 h-3" />}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 flex items-center justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-xl text-xs text-gray-400 hover:text-white flex items-center gap-1.5"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>بازگشت</span>
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md"
              >
                <span>مرحله بعد: هدف یادگیری</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Primary Goal */}
        {step === 3 && (
          <div className="space-y-4 py-2 relative z-10 animate-fadeIn">
            <div className="space-y-1">
              <span className="text-xs font-mono text-violet-400 block">هدف اصلی</span>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                بزرگ‌ترین اولویت شما در استفاده از PromptLab چیست؟
              </h3>
            </div>

            <div className="space-y-2.5 pt-1">
              {[
                { id: 'learn_foundations', title: 'یادگیری از صفر', desc: 'تسلط بر مفاهیم بنیادین و تئوری کار با هوش مصنوعی.' },
                { id: 'build_pro_prompts', title: 'ساخت پرامپت‌های حرفه‌ای', desc: 'تولید خروجی‌های دقیق، تگ‌گذاری XML و حذف توهمات مدل.' },
                { id: 'work_productivity', title: 'استفاده در کار و بهره‌وری روزمره', desc: 'تسریع امور اداری، تولید محتوا، تحلیل داده و گزارش‌نویسی.' },
                { id: 'build_ai_workflows', title: 'ساخت AI Workflow و ایجنت‌ها', desc: 'ترکیب چند مدل، فراخوانی ابزارها (Tool Use) و اتوماسیون.' },
                { id: 'real_world_projects', title: 'آمادگی برای پروژه‌های واقعی', desc: 'حل چالش‌های تخصصی سازمانی و بنچ‌مارک کیفیت مدل‌ها.' }
              ].map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => setPrimaryGoal(opt.id as PrimaryGoal)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    primaryGoal === opt.id
                      ? 'bg-cyan-500/15 border-cyan-400/50 shadow-[0_0_15px_rgba(34,211,238,0.15)]'
                      : 'bg-[#0d0d10] border-white/5 hover:border-white/15'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="text-sm font-bold text-white block">{opt.title}</span>
                    <span className="text-xs text-gray-400 block">{opt.desc}</span>
                  </div>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                    primaryGoal === opt.id ? 'border-cyan-400 bg-cyan-400/20 text-cyan-400' : 'border-white/20'
                  }`}>
                    {primaryGoal === opt.id && <Check className="w-3 h-3" />}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 flex items-center justify-between">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2 rounded-xl text-xs text-gray-400 hover:text-white flex items-center gap-1.5"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>بازگشت</span>
              </button>
              <button
                onClick={() => setStep(4)}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md"
              >
                <span>مشاهده مسیر پیشنهادی</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Recommendation & Launch */}
        {step === 4 && (
          <div className="space-y-5 py-2 relative z-10 animate-fadeIn">
            <div className="space-y-1">
              <span className="text-xs font-mono text-emerald-400 block">مسیر اختصاصی آماده شد</span>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                برنامه پیشنهادی متناسب با سطح و هدف شما:
              </h3>
            </div>

            <div className="p-5 rounded-2xl bg-[#0d0d12] border border-cyan-400/30 space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-cyan-400 px-2.5 py-0.5 rounded-full bg-cyan-400/10 border border-cyan-400/20">
                  {recommendation.levelCode}
                </span>
                <span className="text-xs text-gray-400">پیشنهاد شخصی‌سازی‌شده</span>
              </div>

              <h4 className="text-base font-bold text-white">
                {recommendation.title}
              </h4>

              <p className="text-xs text-gray-300 leading-relaxed">
                {recommendation.description}
              </p>

              <div className="p-3 bg-black/50 rounded-xl border border-white/5 text-[11px] text-gray-300 font-mono">
                {recommendation.pathText}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={() => setStep(3)}
                className="px-4 py-2 rounded-xl text-xs text-gray-400 hover:text-white flex items-center gap-1.5"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>ویرایش انتخاب‌ها</span>
              </button>

              <button
                onClick={handleFinish}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:brightness-110 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)]"
              >
                <BookOpen className="w-4 h-4" />
                <span>شروع یادگیری اولین درس</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
