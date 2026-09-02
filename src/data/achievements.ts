import { Achievement } from '../types';

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-first-prompt',
    title: 'اولین Prompt حرفه‌ای',
    englishTitle: 'First Professional Prompt',
    description: 'تکمیل موفقیت‌آمیز اولین درس و تبدیل یک پرامپت ضعیف به یک پرامپت ساختاریافته.',
    icon: 'Sparkles',
    category: 'completion',
    conditionDescription: 'تکمیل درس ۱ از سطح ۱'
  },
  {
    id: 'ach-first-challenge',
    title: 'اولین چالش مهارتی',
    englishTitle: 'First Challenge Solved',
    description: 'حل موفقیت‌آمیز اولین چالش پرامپتینگ بدون مشاهده راه‌حل.',
    icon: 'Trophy',
    category: 'mastery',
    conditionDescription: 'حل موفق ۱ چالش'
  },
  {
    id: 'ach-prompt-architect',
    title: 'معمار پرامپت (Prompt Architect)',
    englishTitle: 'Prompt Architect',
    description: 'تسلط بر تگ‌های XML و چیدمان استاندارد اجزا در سطوح ۱ و ۲.',
    icon: 'Layout',
    category: 'mastery',
    conditionDescription: 'تکمیل سطوح ۰۱ و ۰۲'
  },
  {
    id: 'ach-context-master',
    title: 'استاد کانتکست (Context Master)',
    englishTitle: 'Context Master',
    description: 'تسلط بر بهینه‌سازی پنجره کانتکست و تکنیک‌های پیشرفته ارجاع و نفی‌زدایی.',
    icon: 'Compass',
    category: 'mastery',
    conditionDescription: 'تکمیل سطح ۰۳'
  },
  {
    id: 'ach-few-shot-specialist',
    title: 'متخصص Few-Shot (Few-Shot Specialist)',
    englishTitle: 'Few-Shot Specialist',
    description: 'طراحی پرامپت‌های یادگیری درون‌کانتکستی با پوشش موارد لبه (Edge Cases).',
    icon: 'Copy',
    category: 'mastery',
    conditionDescription: 'تکمیل سطح ۰۶'
  },
  {
    id: 'ach-hallucination-hunter',
    title: 'مهارکننده توهم (Hallucination Hunter)',
    englishTitle: 'Hallucination Hunter',
    description: 'ایمن‌سازی پرامپت‌ها در برابر استنتاج‌های غلط و اجبار به استناد قطعی.',
    icon: 'ShieldCheck',
    category: 'mastery',
    conditionDescription: 'تکمیل سطح ۰۸'
  },
  {
    id: 'ach-agent-engineer',
    title: 'مهندس ایجنت‌های هوشمند (Agentic AI)',
    englishTitle: 'Agentic AI Engineer',
    description: 'طراحی پرامپت‌های مبتنی بر ReAct و فراخوانی ابزارهای خارجی (Tool Calling).',
    icon: 'Network',
    category: 'mastery',
    conditionDescription: 'تکمیل سطح ۱۲'
  },
  {
    id: 'ach-playground-pro',
    title: 'دانشمند آزمایشگاه (Lab Scientist)',
    englishTitle: 'Lab Scientist',
    description: 'ذخیره حداقل ۳ پرامپت سفارشی در کارگاه تعاملی پرامپت (Prompt Playground).',
    icon: 'FlaskConical',
    category: 'playground',
    conditionDescription: 'ذخیره ۳ پرامپت در کارگاه'
  },
  {
    id: 'ach-streak-3',
    title: 'پیوستگی یادگیری (3-Day Streak)',
    englishTitle: 'Consistency Streak',
    description: 'استمرار در تمرین و یادگیری مهندسی پرامپت برای ۳ روز متوالی.',
    icon: 'Flame',
    category: 'streak',
    conditionDescription: 'استمرار یادگیری ۳ روزه'
  },
  {
    id: 'ach-snake-rookie',
    title: 'تازه کار مار (Snake Rookie)',
    englishTitle: 'Snake Rookie',
    description: 'انجام اولین دور بازی مار در اتاق استراحت هوشمند (Focus Lounge).',
    icon: 'Sparkles',
    category: 'playground',
    conditionDescription: 'اولین بازی Snake در Focus Lounge'
  },
  {
    id: 'ach-2048-starter',
    title: 'استاد ادغام (2048 Starter)',
    englishTitle: '2048 Starter',
    description: 'رسیدن به خانه ۵۱۲ یا بالاتر در بازی ۲۰۴۸ اتاق تمرکز.',
    icon: 'Layout',
    category: 'mastery',
    conditionDescription: 'رسیدن به عدد ۵۱۲ در ۲۰۴۸'
  },
  {
    id: 'ach-memory-master',
    title: 'استاد تطبیق مفاهیم (Memory Master)',
    englishTitle: 'Prompt Memory Master',
    description: 'تکمیل موفقیت‌آمیز بازی حافظه آموزشی و تطبیق تمام مفاهیم مهندسی پرامپت.',
    icon: 'Compass',
    category: 'mastery',
    conditionDescription: 'تکمیل یک بازی Prompt Memory'
  },
  {
    id: 'ach-break-taken',
    title: 'استراحت آگاهانه (Break Taken)',
    englishTitle: 'Mindful Break Taken',
    description: 'تکمیل یک جلسه استراحت زمان‌بندی‌شده با Break Timer برای بازسازی تمرکز ذهنی.',
    icon: 'Flame',
    category: 'streak',
    conditionDescription: 'تکمیل حداقل یک نشست Break Timer'
  },
  {
    id: 'ach-first-experiment',
    title: 'اولین آزمایش بنچ‌مارک (First Experiment)',
    englishTitle: 'First Benchmark Experiment',
    description: 'اجرای اولین تست و آزمایش پرامپت در آزمایشگاه بنچ‌مارک هوش مصنوعی.',
    icon: 'FlaskConical',
    category: 'playground',
    conditionDescription: 'اجرای ۱ آزمایش در Benchmark Lab'
  },
  {
    id: 'ach-first-ab-test',
    title: 'اولین تست مقایسه‌ای (First A/B Test)',
    englishTitle: 'First A/B Test',
    description: 'انجام اولین تست مقایسه‌ای دو پرامپت یا دو مدل مختلف در حالت Compare Mode.',
    icon: 'ArrowRightLeft',
    category: 'mastery',
    conditionDescription: 'اجرای ۱ تست A/B در Benchmark Lab'
  },
  {
    id: 'ach-prompt-scientist',
    title: 'دانشمند پرامپت (Prompt Scientist)',
    englishTitle: 'Prompt Scientist',
    description: 'ثبت فرضیه، مشاهدات و درس‌آموخته تجربی در نوت‌بوک آزمایشگاه.',
    icon: 'Brain',
    category: 'mastery',
    conditionDescription: 'ثبت آزمایش با فرضیه و نتیجه در نوت‌بوک'
  },
  {
    id: 'ach-benchmark-explorer',
    title: 'کاشف مدل‌های زبانی (Benchmark Explorer)',
    englishTitle: 'Benchmark Explorer',
    description: 'آزمایش و مقایسه پرامپت در مدل‌های زبانی مختلف (Claude, GPT, Gemini).',
    icon: 'Sparkles',
    category: 'mastery',
    conditionDescription: 'تست پرامپت روی حداقل ۳ مدل مختلف'
  }
];
