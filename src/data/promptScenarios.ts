export interface PromptScenario {
  id: string;
  roleTitle: string;
  roleTitleEn: string;
  avatarIcon: string;
  domain: string;
  scenarioDescription: string;
  typicalMistakePrompt: string;
  professionalPrompt: string;
  keyLearning: string;
  recommendedTemplateId: string;
}

export const PROMPT_SCENARIOS: PromptScenario[] = [
  {
    id: 'sc-01',
    roleTitle: 'مدیر بازاریابی (Marketing Manager)',
    roleTitleEn: 'Marketing Manager',
    avatarIcon: 'TrendingUp',
    domain: 'Growth & Ads',
    scenarioDescription: 'طراحی کمپین بلک‌فرایدی با هدف افزایش ۴۰ درصدی فروش محصولات دیجیتال بدون کاهش ارزش درک‌شده برند.',
    typicalMistakePrompt: 'برای بلک فرایدی چند تا متن تبلیغاتی خوب و تخفیفی بنویس.',
    professionalPrompt: `<role>
تو مدیر رشد و کپی‌رایتر ارشد کمپین‌های بزرگ خرید اینترنتی هستی.
</role>

<context>
رویداد: حراج بلک فرایدی فروشگاه لوازم دیجیتال
هدف: افزایش ۴۰ درصدی فروش بدون اینکه برند لوکس بودن و ارزش خود را با تخفیف‌های بی‌منطق از دست بدهد.
</context>

<instructions>
۳ کپی تبلیغاتی برای استوری‌های اینستاگرام با تمرکز بر FOMO (ترس از دست دادن) و پیشنهاد بسته‌های باندل (Bundle Offer) طراحی کن.
</instructions>

<rules>
- از عبارات مستعمل مثل «حراج استثنایی» پرهیز کن.
- ارزش افزوده‌ای مانند «گارانتی تعویض ۶ ماهه طلایی» را در متن برجسته ساز.
</rules>`,
    keyLearning: 'مشخص کردن پرسونای برند، پیشگیری از تخریب تصویر ذهنی با قوانین منفی و تعیین زاویه دید روانی (FOMO).',
    recommendedTemplateId: 'tpl-mkt-01'
  },
  {
    id: 'sc-02',
    roleTitle: 'توسعه‌دهنده نرم‌افزار (Fullstack Developer)',
    roleTitleEn: 'Software Engineer',
    avatarIcon: 'Code2',
    domain: 'Backend & DB',
    scenarioDescription: 'طراحی سیستم صف پیام و پردازش پس‌زمینه برای ارسال ۱۰۰ هزار ایمیل همزمان بدون مسدود شدن نخ اصلی.',
    typicalMistakePrompt: 'یک سیستم صف با Redis برای ارسال ایمیل در نودجی‌اس بساز.',
    professionalPrompt: `<role>
تو معمار ارشد سیستم‌های توزیع‌شده و مهندس ارشد Node.js با تسلط بر BullMQ و Redis هستی.
</role>

<task>
طراحی یک معماری مقاوم در برابر خطا (Fault-Tolerant) برای صف ارسال ایمیل‌های دسته‌ای با توان عملیاتی ۵۰۰ ایمیل در ثانیه.
</task>

<constraints>
- استفاده از BullMQ با TypeScript کامل.
- پیاده‌سازی مکانیزم Exponential Backoff Retry برای خطاهای شبکه.
- شامل الگوهای Dead Letter Queue برای پیام‌های مکرراً ناموفق.
</constraints>

<output_format>
۱. دیاگرام منطقی معماری به صورت Mermaid
۲. کدهای کلیدی Worker و Producer
۳. نکات بهینه‌سازی کانکشن‌پول Redis
</output_format>`,
    keyLearning: 'مشخص کردن معماری مقیاس‌پذیر، مدیریت صریح خطاها و الزام تایپ‌سیفتی با کتابخانه‌های تخصصی.',
    recommendedTemplateId: 'tpl-cod-01'
  },
  {
    id: 'sc-03',
    roleTitle: 'استاد و طراح آموزشی (Instructional Designer)',
    roleTitleEn: 'Instructional Designer & Educator',
    avatarIcon: 'GraduationCap',
    domain: 'EdTech & Learning',
    scenarioDescription: 'تفهیم مفهوم پیچیده «مدیریت حافظه در Rust و مفهوم Ownership» به دانشجویانی که فقط زبان پایتون بلدند.',
    typicalMistakePrompt: 'مفهوم Ownership در راست را به زبان ساده توضیح بده.',
    professionalPrompt: `<role>
تو یک استاد برجسته علوم کامپیوتر و متخصص متدولوژی آموزش مقایسه‌ای هستی.
</role>

<context>
دانشجویان تسلط عالی بر Python و مکانیزم Garbage Collection دارند اما هیچ آشنایی با اشاره‌گرها و مدیریت دستی حافظه ندارند.
</context>

<task>
مفاهیم Ownership, Borrowing و Lifetimes در زبان Rust را با مقایسه مستقیم رفتاری با پایتون تفهیم نما.
</task>

<rules>
- از یک استعاره کاربردی کتابخانه‌ای (امانت گرفتن کتاب) برای توضیح استفاده کن.
- کدهای معادل در هر دو زبان را در کنار هم نمایش بده.
</rules>`,
    keyLearning: 'تثبیت پیش‌زمینه مخاطب (Python background) و استفاده از استعاره‌های شناختی برای انتقال سریع دانش.',
    recommendedTemplateId: 'tpl-edu-01'
  },
  {
    id: 'sc-04',
    roleTitle: 'بنیان‌گذار استارتاپ (Startup Founder)',
    roleTitleEn: 'Startup Founder & CEO',
    avatarIcon: 'Briefcase',
    domain: 'Fundraising & Strategy',
    scenarioDescription: 'آماده‌سازی پیچ‌دک ۱۰ اسلایدی برای جذب سرمایه اولیه ۵۰۰ هزار دلاری از سرمایه‌گذاران جسورانه (VC).',
    typicalMistakePrompt: 'یک پیچ دک برای استارتاپ هوش مصنوعی ما بنویس.',
    professionalPrompt: `<role>
تو مشاور ارشد جذب سرمایه (Fundraising Partner) با سابقه هدایت استارتاپ‌های موفق Y Combinator هستی.
</role>

<context>
استارتاپ: پلتفرم خودکارسازی حسابداری هوشمند برای خرده‌فروشان
جذب هدف: ۵۰۰ هزار دلار Seed
کشش اولیه (Traction): ۲۰ مشتری وفادار با درآمد تکرارشونده ماهانه (MRR) ۱۰ هزار دلار و نرخ رشد ۱۵٪ ماهانه.
</context>

<task>
ساختار ۱۰ اسلاید استاندارد Sequoia را با تمرکز بر شفافیت اندازه بازار (TAM/SAM/SOM) و خندق دفاعی تکنولوژی تدوین کن.
</task>

<output_format>
جدول تفکیکی: شماره اسلاید / عنوان / پیام محوری (One-Liner) / داده‌های کلیدی مورد نیاز.
</output_format>`,
    keyLearning: 'تزریق شاخص‌های مالی واقعی (MRR, MoM Growth)، انتخاب چارچوب معتبر (Sequoia Pitch) و تمرکز بر خندق دفاعی (Moat).',
    recommendedTemplateId: 'tpl-bus-01'
  }
];
