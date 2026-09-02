import { UserProgress, NextStepRecommendation } from '../types';
import { CURRICULUM_LEVELS } from '../data/curriculum';
import { calculateUserSkills } from '../data/masterySkills';
import { DAILY_CHALLENGES } from '../data/dailyPrompts';
import { ARENA_MISSIONS } from '../data/arenaMissions';

/**
 * Deterministic recommendation engine for PromptLab.
 * Strict rule-based prioritization:
 * 1. Resume active unfinished lesson
 * 2. Next uncompleted lesson in current module/level
 * 3. Daily challenge if not completed today
 * 4. Weakest mastery skill training
 * 5. Playground prompt experimentation
 * 6. Arena battle mission
 * 7. Benchmark model comparison
 */
export function getNextStepRecommendation(progress: UserProgress): NextStepRecommendation {
  const today = new Date().toISOString().split('T')[0];

  // 1. Check if active lesson is unfinished
  const currentLevel = CURRICULUM_LEVELS.find((l) => l.id === progress.currentLevelId) || CURRICULUM_LEVELS[0];
  const activeLesson = currentLevel.lessons.find((l) => l.id === progress.currentLessonId);

  if (activeLesson && !progress.completedLessons.includes(activeLesson.id)) {
    return {
      id: 'rec-resume-lesson',
      title: `ادامه درس: ${activeLesson.title}`,
      subtitle: `${currentLevel.code} • زمان مطالعه تقریبی: ${activeLesson.duration}`,
      badge: 'درس فعال',
      reason: 'شما این درس را آغاز کرده‌اید و برای تثبیت مفاهیم پیش‌نیاز، بهتر است آن را تکمیل کنید.',
      actionText: 'ادامه مطالعه و تمرین',
      actionView: 'lesson',
      lessonId: activeLesson.id,
      iconName: 'BookOpen',
      priority: 1,
      xpReward: 100
    };
  }

  // 2. Check next uncompleted lesson in the current level
  const nextLessonInLevel = currentLevel.lessons.find((l) => !progress.completedLessons.includes(l.id));
  if (nextLessonInLevel) {
    return {
      id: 'rec-next-lesson',
      title: `درس بعدی: ${nextLessonInLevel.title}`,
      subtitle: `${currentLevel.code} • ${nextLessonInLevel.difficulty}`,
      badge: 'مسیر آموزشی',
      reason: 'برای پیشرفت ساختاریافته در این سطح، این درس گام منطقی بعدی در فرآیند یادگیری شماست.',
      actionText: 'شروع درس جدید',
      actionView: 'lesson',
      lessonId: nextLessonInLevel.id,
      iconName: 'Play',
      priority: 2,
      xpReward: 100
    };
  }

  // 3. Check Daily Challenge for today
  const isDailyCompletedToday = progress.dailyChallengeStatus?.lastCompletedDate === today;
  if (!isDailyCompletedToday && DAILY_CHALLENGES.length > 0) {
    const todayChallenge = DAILY_CHALLENGES[0];
    return {
      id: 'rec-daily-challenge',
      title: `چالش روز: ${todayChallenge.title}`,
      subtitle: `دسته‌بندی: ${todayChallenge.category}`,
      badge: 'چالش روزانه',
      reason: 'حل چالش‌های روزانه علاوه بر افزایش تداوم یادگیری (Streak)، تکنیک‌های سریع را محک می‌زند.',
      actionText: 'ورود به چالش روزانه',
      actionView: 'arena',
      starterPrompt: todayChallenge.starterPrompt,
      iconName: 'Flame',
      priority: 3,
      xpReward: todayChallenge.xpReward
    };
  }

  // 4. Weakest Mastery Skill
  const skills = calculateUserSkills(progress);
  const weakestSkill = [...skills].sort((a, b) => a.score - b.score)[0];
  if (weakestSkill && weakestSkill.score < 65) {
    return {
      id: `rec-skill-${weakestSkill.id}`,
      title: `تقویت مهارت: ${weakestSkill.nameFa}`,
      subtitle: `امتیاز فعلی: ${weakestSkill.score} از ۱۰۰ • سطح ${weakestSkill.tierFa}`,
      badge: 'بهبود مهارت',
      reason: `برای ساخت سیستم‌های حرفه‌ای، ارتقای «${weakestSkill.nameEn}» به شما در نگارش پرامپت‌های پایدارتر کمک می‌کند.`,
      actionText: 'تمرین در کارگاه پرامپت',
      actionView: 'playground',
      iconName: 'Target',
      priority: 4,
      xpReward: 75
    };
  }

  // 5. Arena Mission
  const uncompletedArena = ARENA_MISSIONS.find((m) => {
    const history = progress.arenaHistory?.[m.id];
    return !history?.completed;
  });

  if (uncompletedArena) {
    return {
      id: 'rec-arena-mission',
      title: `ماموریت عملی نبرد: ${uncompletedArena.title}`,
      subtitle: `دسته‌بندی: ${uncompletedArena.category} • سطح ${uncompletedArena.difficulty}`,
      badge: 'میدان چالش',
      reason: 'اجرای سناریوهای واقعی B2B و تجاری شما را برای پروژه‌های جدی آماده می‌کند.',
      actionText: 'پذیرش ماموریت Arena',
      actionView: 'arena',
      starterPrompt: uncompletedArena.starterPrompt,
      iconName: 'Swords',
      priority: 5,
      xpReward: uncompletedArena.xpReward
    };
  }

  // 6. Benchmark Lab
  return {
    id: 'rec-benchmark-lab',
    title: 'تست مقایسه‌ای پرامپت در Benchmark Lab',
    subtitle: 'Claude 3.7 vs GPT-4o vs Gemini 2.5',
    badge: 'آزمایشگاه بنچ‌مارک',
    reason: 'پرامپت‌های خود را روی چندین مدل همزمان اجرا کرده و سرعت، خروجی و انطباق فرمت را ارزیابی کنید.',
    actionText: 'ورود به بنچ‌مارک',
    actionView: 'benchmark',
    iconName: 'FlaskConical',
    priority: 6,
    xpReward: 50
  };
}
