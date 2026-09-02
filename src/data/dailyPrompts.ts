export interface DailyChallenge {
  id: string;
  dayNumber: number;
  dateKey: string; // e.g. '2026-09-02'
  title: string;
  category: string;
  scenario: string;
  goal: string;
  quickRequirements: string[];
  starterPrompt: string;
  samplePrompt: string;
  xpReward: number;
}

export interface PromptOfTheDay {
  id: string;
  title: string;
  category: string;
  problem: string;
  prompt: string;
  whyItWorks: string;
  keyTechniques: string[];
  estimatedReadingTime: string; // e.g. '۴۵ ثانیه'
}

export const DAILY_CHALLENGES: DailyChallenge[] = [
  {
    id: 'daily-01-luxury-restaurant',
    dayNumber: 1,
    dateKey: '2026-09-02',
    title: 'تولید محتوای اینستاگرام برای رستوران مجلل',
    category: 'مارکتینگ و سوشال مدیا',
    scenario: 'یک رستوران مجلل با غذای اصیل و فضای اختصاصی VIP قصد دارد معرفی منوی ویژه پاییزه خود را در قالب یک کپشن گیرا همراه با Call to Action برای رزرو آنلاین میز منتشر کند.',
    goal: 'ساخت پرامپت با تعیین لحن باشکوه (Sophisticated & Warm)، محدودیت لحن عامیانه و فرمت استاندارد کپشن اینستاگرام.',
    quickRequirements: [
      'تعریف نقش کارشناس ارشد برندینگ لوکس',
      'تعیین کانتکست منوی پاییزی و میز VIP',
      'گاردریل: عدم استفاده از تخفیف یا قیمت‌گذاری چیپ',
      'فرمت: Hook + داستان طعم + CTA رزرو + ۳ هشتگ'
    ],
    starterPrompt: 'یک کپشن اینستاگرام برای معرفی منوی پاییزه رستوران بنویس.',
    samplePrompt: `<role>
شما یک مدیر خلاقیت برند و کپی‌رایتر تخصصی حوزه Hospitality و رستوران‌های لوکس و فاخر هستید.
</role>

<context>
رستوران ما ارائه‌دهنده غذاهای اصیل ایرانی با مواد اولیه ارگانیک در محیطی آرام با دکوراسیون مینیمال است و منوی پاییزی جدید خود را با سرآشپز بین‌المللی رونمایی می‌کند.
</context>

<instructions>
یک کپشن اینستاگرام بنویسید که حس گرما، طعم‌های پاییزی و تجربه منحصر‌به‌فرد رزرو میز VIP را القا کند.
</instructions>

<rules>
- از اصطلاحات تخفیفی، کلمات بازاری و شعارهای عمومی خودداری کنید.
- لحن متن باید محترمانه، صمیمی و فاخر باشد.
- حداکثر ۱۲۰ کلمه.
</rules>

<output_format>
[تیتر / Hook آغازین]
[پاراگراف توصیف تجربه حسی]
[فراخوان رزرو اختصاصی - Call to Action]
[۳ هشتگ لوکس]
</output_format>`,
    xpReward: 150
  },
  {
    id: 'daily-02-sql-generator',
    dayNumber: 2,
    dateKey: '2026-09-03',
    title: 'تولید کوئری‌های بهینه PostgreSQL برای تحلیل لاگ',
    category: 'داده و مهندسی نرم‌افزار',
    scenario: 'تیم تحلیل داده نیاز دارد پرامپتی بسازد که بر اساس اسکیمای پایگاه داده، کوئری‌های پیچیده با Window Functions بدون خطر SQL Injection و با رعایت ایندکس‌ها تولید کند.',
    goal: 'طراحی پرامپت تخصصی با نمونه اسکیمای جدول و قوانین سخت‌گیرانه برای عدم استفاده از `SELECT *`.',
    quickRequirements: [
      'نقش: DBA ارشد PostgreSQL',
      'کانتکست: اسکیمای جدول سفارشات با ۱۰ میلیون رکورد',
      'قوانین: ممنوعیت `SELECT *` و الزام استفاده از EXPLAIN ANALYZE',
      'خروجی: کد SQL + تحلیل هزینه محاسباتی'
    ],
    starterPrompt: 'یک کوئری بنویس که پرفروش‌ترین کاربران ماه قبل را بدهد.',
    samplePrompt: `<role>
شما یک معمار ارشد پایگاه داده و متخصص بهینه‌سازی PostgreSQL 16 هستید.
</role>

<context>
جدول orders با ۱۲ میلیون رکورد دارای ایندکس روی (user_id, created_at) و فیلدهای (id, user_id, amount_cents, status, created_at) است.
</context>

<instructions>
کوئری استخراج ۱۰ کاربر برتر بر اساس مجموع پرداختی در ۳۰ روز گذشته را با احتساب سفارشات موفق (status = 'paid') بنویسید.
</instructions>

<rules>
- استفاده از SELECT * اکیداً ممنوع است.
- از Common Table Expressions (CTE) یا Window Functions در صورت بهبود خوانایی استفاده کنید.
- دلیل انتخاب ساختار کوئری را از نظر استفاده از Index شرح دهید.
</rules>

<output_format>
\`\`\`sql
-- SQL Query
\`\`\`
- تحلیل Execution Plan و شاخص‌های ایندکس
</output_format>`,
    xpReward: 150
  }
];

export const PROMPTS_OF_THE_DAY: PromptOfTheDay[] = [
  {
    id: 'potd-01-chain-of-thought',
    title: 'تکنیک Chain of Thought با تگ‌های تفکر ساختاریافته',
    category: 'Advanced Reasoning',
    problem: 'وقتی از مدل زبانی محاسبات یا تحلیل پیچیده بدون هدایت مسیر فکر می‌خواهیم، مدل دچار حدس‌های شتاب‌زده (Premature Hallucination) می‌شود.',
    prompt: `<role>
شما یک مشاور ارشد ارزیابی ریسک مالی و امنیت سیستم‌های بانکی هستید.
</role>

<instructions>
پیش از ارائه پاسخ نهایی، مرحله به مرحله استدلال کنید و تفکر خود را درون تگ <thinking> بنویسید. سپس ارزیابی قطعی را در <verdict> قرار دهید.
</instructions>

<thinking>
۱. شناسایی دارایی‌های در معرض خطر
۲. تخمین احتمال وقوع بر اساس سناریو
۳. برآورد خسارت مادی و اعتباری
</thinking>

<verdict>
سطح ریسک: [کم / متوسط / بالا / بحرانی]
اقدام پیشنهادی: [شرح اقدام فوری]
</verdict>`,
    whyItWorks: 'مجبور کردن مدل به نگارش تفکر در تگ <thinking> توکن‌های استدلال واسط را در کانتکست درج می‌کند که نرخ خطای منطقی را بیش از ۶۰ درصد کاهش می‌دهد.',
    keyTechniques: ['Explicit Scratchpad / Thinking Tag', 'Role Anchoring', 'Structured Verdict Output'],
    estimatedReadingTime: '۴۵ ثانیه'
  },
  {
    id: 'potd-02-negative-constraints',
    title: 'گاردریل معکوس و حذف اصطلاحات کلیشه‌ای بازاریابی',
    category: 'Editorial & Guardrails',
    problem: 'مدل‌های هوش مصنوعی به صورت پیش‌فرض تمایل شدیدی به استفاده از کلمات پر زرق و برق و توخالی مثل "شگفت‌انگیز"، "انقلابی" و "بی‌نظیر" دارند.',
    prompt: `<role>
شما سردبیر ارشد یک نشریه تخصصی فناوری در سطح MIT Technology Review هستید.
</role>

<instructions>
مقاله زیر را بازنویسی کنید تا برای محققان و سرمایه‌گذاران حوزه DeepTech معتبر و مستند به نظر برسد.
</instructions>

<rules>
- کلمات زیر اکیداً ممنوع هستند: «انقلابی»، «شگفت‌انگیز»، «جادویی»، «تحول‌آفرین»، «بی‌سابقه».
- هر ادعایی باید با یک داده یا مکانیزم فنی همراه باشد.
- از کاربرد صفات مطلق خودداری کرده و با رویکرد نقادانه بنویسید.
</rules>`,
    whyItWorks: 'تعریف یک لیست سیاه صریح (Negative Keyword Blacklist) احتمال انتخاب توکن‌های کلیشه‌ای را به صفر نزدیک می‌کند و خروجی را با لحن تخصصی هم‌تراز می‌سازد.',
    keyTechniques: ['Negative Keyword Blacklist', 'Persona Calibration', 'Critical Tone Guidance'],
    estimatedReadingTime: '۵۰ ثانیه'
  }
];
