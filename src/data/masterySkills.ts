import { UserProgress } from '../types';

export type SkillTier = 'Beginner' | 'Developing' | 'Intermediate' | 'Advanced' | 'Mastery';

export interface SkillItem {
  id: string;
  nameFa: string;
  nameEn: string;
  description: string;
  score: number; // 0-100
  tier: SkillTier;
  tierFa: string;
  tierColor: string;
  keyAction: string;
}

export const SKILL_TIER_INFO: Record<SkillTier, { labelFa: string; color: string; badgeBg: string }> = {
  Beginner: {
    labelFa: 'مبتدی (Beginner)',
    color: 'text-gray-400',
    badgeBg: 'bg-gray-500/10 border-gray-500/30 text-gray-300'
  },
  Developing: {
    labelFa: 'در حال توسعه (Developing)',
    color: 'text-cyan-400',
    badgeBg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
  },
  Intermediate: {
    labelFa: 'متوسط (Intermediate)',
    color: 'text-violet-400',
    badgeBg: 'bg-violet-500/10 border-violet-500/30 text-violet-300'
  },
  Advanced: {
    labelFa: 'پیشرفته (Advanced)',
    color: 'text-amber-400',
    badgeBg: 'bg-amber-500/10 border-amber-500/30 text-amber-300'
  },
  Mastery: {
    labelFa: 'استادی و تسلط (Mastery)',
    color: 'text-emerald-400',
    badgeBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
  }
};

export function getTierForScore(score: number): SkillTier {
  if (score >= 81) return 'Mastery';
  if (score >= 61) return 'Advanced';
  if (score >= 41) return 'Intermediate';
  if (score >= 21) return 'Developing';
  return 'Beginner';
}

/**
 * Calculates the 9 core prompt engineering skills based on:
 * - Completed lessons
 * - Completed exercises & challenges
 * - Arena attempts & scores
 * - Playground usage
 */
export function calculateUserSkills(progress: UserProgress): SkillItem[] {
  const completedCount = progress.completedLessons.length;
  const challengeCount = progress.completedChallenges.length;
  const exerciseCount = progress.completedExercises.length;
  const missionCount = progress.completedMissions?.length || 0;
  
  // Calculate raw factors
  const baseFactor = Math.min(100, Math.round((completedCount / 36) * 100));
  const practiceFactor = Math.min(100, (exerciseCount * 8) + (challengeCount * 15) + (missionCount * 20));

  // 1. Prompt Structure
  const structureScore = Math.min(100, Math.max(25, Math.round(baseFactor * 0.5 + (progress.savedPrompts.length > 0 ? 30 : 0) + (progress.completedLessons.includes('l01-01') ? 25 : 0))));
  
  // 2. Clarity
  const clarityScore = Math.min(100, Math.max(30, Math.round(baseFactor * 0.6 + (exerciseCount > 0 ? 25 : 0) + 15)));

  // 3. Context
  const contextScore = Math.min(100, Math.max(20, Math.round(baseFactor * 0.7 + (challengeCount > 0 ? 30 : 10))));

  // 4. Role Prompting
  const roleScore = Math.min(100, Math.max(35, Math.round(baseFactor * 0.55 + (progress.savedPrompts.length > 1 ? 30 : 15))));

  // 5. Output Control
  const outputScore = Math.min(100, Math.max(20, Math.round(baseFactor * 0.5 + (exerciseCount > 1 ? 30 : 10))));

  // 6. Few-Shot
  const fewShotScore = Math.min(100, Math.max(15, Math.round(baseFactor * 0.4 + (missionCount > 0 ? 35 : 10))));

  // 7. Reliability
  const reliabilityScore = Math.min(100, Math.max(20, Math.round(baseFactor * 0.45 + (challengeCount > 0 ? 30 : 10))));

  // 8. Prompt Evaluation
  const evalScore = Math.min(100, Math.max(25, Math.round(baseFactor * 0.5 + (progress.experiments?.length ? 30 : 10))));

  // 9. Advanced Prompting
  const advancedScore = Math.min(100, Math.max(15, Math.round(baseFactor * 0.35 + (missionCount > 1 ? 40 : 5))));

  const skillsRaw = [
    {
      id: 'prompt_structure',
      nameFa: 'ساختار و تگ‌گذاری (Prompt Structure)',
      nameEn: 'Prompt Structure',
      description: 'تسلط بر تگ‌های XML، بخش‌بندی استاندارد و تفکیک اجزا',
      score: structureScore,
      keyAction: 'استفاده از تگ‌های <role> و <instructions>'
    },
    {
      id: 'clarity',
      nameFa: 'وضوح و صراحت دستور (Clarity)',
      nameEn: 'Clarity',
      description: 'حذف ابهام، افعال مستقیم و دستورالعمل‌های شفاف',
      score: clarityScore,
      keyAction: 'پرهیز از کلی‌گویی و دستورات چندپهلوی زبانی'
    },
    {
      id: 'context',
      nameFa: 'مهندسی کانتکست (Context Grounding)',
      nameEn: 'Context',
      description: 'تزریق داده‌های سازمانی و پیش‌زمینه دقیق به مدل',
      score: contextScore,
      keyAction: 'تعریف وضعیت، دامنه‌مساله و پیش‌فرض‌ها'
    },
    {
      id: 'role_prompting',
      nameFa: 'تعریف نقش و پرسونا (Role Prompting)',
      nameEn: 'Role Prompting',
      description: 'هدایت زاویه دید، سطح تخصص و لحن پاسخ‌دهی هوش مصنوعی',
      score: roleScore,
      keyAction: 'تنظیم سابقه کاری و تخصص تخصصی در پرامپت'
    },
    {
      id: 'output_control',
      nameFa: 'کنترل فرمت خروجی (Output Control)',
      nameEn: 'Output Control',
      description: 'تولید JSON پایدار، جداول Markdown و ساختارهای قطعی',
      score: outputScore,
      keyAction: 'تعریف اسکیمای خروجی و فیلدهای مورد نیاز'
    },
    {
      id: 'few_shot',
      nameFa: 'یادگیری درون‌کانتکستی (Few-Shot Prompting)',
      nameEn: 'Few-Shot',
      description: 'ارائه مثال‌های الگو برای بهبود دقت و هم‌ترازی رفتار مدل',
      score: fewShotScore,
      keyAction: 'ضمیمه کردن جفت‌های ورودی و خروجی نمونه'
    },
    {
      id: 'reliability',
      nameFa: 'پایداری و گاردریل‌ها (Reliability & Guardrails)',
      nameEn: 'Reliability',
      description: 'تعریف خطوط قرمز، گاردریل‌های منفی و جلوگیری از خطا',
      score: reliabilityScore,
      keyAction: 'تنظیم تگ <rules> با شروط منفی و محدودیت‌ها'
    },
    {
      id: 'prompt_evaluation',
      nameFa: 'سنجش و ارزیابی پرامپت (Prompt Evaluation)',
      nameEn: 'Prompt Evaluation',
      description: 'اندازه‌گیری سیستماتیک کیفیت، تست A/B و مقایسه مدل‌ها',
      score: evalScore,
      keyAction: 'آزمایش و بنچمارک سناریوهای مختلف در آزمایشگاه'
    },
    {
      id: 'advanced_prompting',
      nameFa: 'تکنیک‌های پیشرفته و استدلال (Advanced Prompting)',
      nameEn: 'Advanced Prompting',
      description: 'زنجیره تفکر (CoT)، ایجنت‌ها و استدلال چندمرحله‌ای',
      score: advancedScore,
      keyAction: 'استفاده از تگ‌های <thinking> و تفکر گام‌به‌گام'
    }
  ];

  return skillsRaw.map(s => {
    const tier = getTierForScore(s.score);
    const info = SKILL_TIER_INFO[tier];
    return {
      ...s,
      tier,
      tierFa: info.labelFa,
      tierColor: info.color
    };
  });
}
