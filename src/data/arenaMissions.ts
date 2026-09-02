import { DifficultyLevel } from '../types';

export interface ArenaMission {
  id: string;
  title: string;
  englishTitle: string;
  category: string;
  difficulty: DifficultyLevel;
  scenarioBrief: string;
  businessGoal: string;
  requiredPillars: {
    name: string;
    english: string;
    description: string;
  }[];
  starterPrompt: string;
  sampleWinningPrompt: string;
  xpReward: number;
  evaluationCriteria: {
    minScore: number;
    requiredKeywords: string[];
    requiredTags: string[];
  };
}

export const ARENA_MISSIONS: ArenaMission[] = [
  {
    id: 'arena-01-saas-linkedin',
    title: 'تولید محتوای لینکدین برای شرکت SaaS B2B',
    englishTitle: 'B2B SaaS LinkedIn Thought Leadership Prompt',
    category: 'Marketing & Content',
    difficulty: 'متوسط',
    scenarioBrief: 'یک شرکت SaaS ارائه‌دهنده نرم‌افزار مدیریت ارتباط با مشتری (CRM) هوشمند می‌خواهد برای مدیران فروش پست‌های تفکر رهبری (Thought Leadership) در لینکدین تولید کند که نرخ تعامل بالا و ارزش کاربردی داشته باشد.',
    businessGoal: 'طراحی یک پرامپت چندبارمصرف و استاندارد که لحن حرفه‌ای، داده‌محور، بدون کلیشه‌های بازاریابی و با ساختار تگ‌گذاری‌شده تولید کند.',
    requiredPillars: [
      { name: 'نقش تخصصی', english: 'Role', description: 'استراتژیست محتوای B2B با ۱۰ سال سابقه در حوزه SaaS' },
      { name: 'کانتکست تجاری', english: 'Context', description: 'توضیح جامعه هدف و نرم‌افزار CRM ابری' },
      { name: 'مخاطب هدف', english: 'Audience', description: 'مدیران ارشد فروش (VP of Sales) و مدیران عامل استارتاپ‌ها' },
      { name: 'هدف و وظیفه', english: 'Goal', description: 'نوشتن یک پست با Hook قوی، ۳ درس عملی و Call to Action' },
      { name: 'محدودیت‌ها و گاردریل‌ها', english: 'Constraints', description: 'ممنوعیت استفاده از جملات کلیشه‌ای، رعایت سقف ۱۵۰ کلمه، حداکثر ۳ هشتگ' },
      { name: 'فرمت خروجی', english: 'Output Format', description: 'تفکیک Hook، بدنه و CTA با ایموجی‌های مینیمال' },
      { name: 'معیار موفقیت', english: 'Success Criteria', description: 'پست باید نرخ کامنت‌گذاری متخصصان را تحریک کند' }
    ],
    starterPrompt: 'یک پست لینکدین درباره هوش مصنوعی در فروش برای ما بنویس.',
    sampleWinningPrompt: `<role>
شما یک استراتژیست ارشد بازاریابی محتوای B2B با تخصص در نرم‌افزارهای ابری (SaaS) و بازارهای سازمانی هستید.
</role>

<context>
شرکت ما ارائه‌دهنده یک CRM هوش مصنوعی است که زمان پاسخ‌دهی به لیدهای ورودی را از ۶ ساعت به ۴ دقیقه کاهش می‌دهد.
</context>

<instructions>
یک پست تحلیلی و معتبر برای لینکدین تولید کنید که به چالش «سوختن لیدهای فروش به دلیل تاخیر در پاسخگویی» بپردازد.
پست باید شامل یک Hook گیرا در خط اول، ۲ آمار تحلیلی و ۳ گام عملی برای تیم‌های فروش باشد.
</instructions>

<audience>
مدیران ارشد فروش (VP of Sales)، رهبران Revenue Operations و بنیان‌گذاران استارتاپ‌های B2B.
</audience>

<rules>
- از اصطلاحات شعاری مانند «تحول شگفت‌انگیز» یا «معجزه هوش مصنوعی» اکیداً خودداری کنید.
- طول کل پست حداکثر ۱۸۰ کلمه باشد.
- حداکثر ۳ هشتگ تخصصی در انتهای متن قرار دهید.
- لحن باید واقع‌بینانه، حرفه‌ای و داده‌محور باشد.
</rules>

<output_format>
[قلاب اولیه - Hook]
[چالش و تحلیل آماری]
[۳ گام عملیاتی]
[پرسش پایانی جهت تعامل]
[هشتگ‌ها]
</output_format>

<success_criteria>
خروجی باید بدون نیاز به ویرایش انسانی، قابل انتشار توسط مدیرعامل باشد.
</success_criteria>`,
    xpReward: 300,
    evaluationCriteria: {
      minScore: 85,
      requiredKeywords: ['b2b', 'saas', 'crm', 'لینکدین', 'مدیران'],
      requiredTags: ['role', 'context', 'instructions', 'rules', 'output_format']
    }
  },
  {
    id: 'arena-02-sre-postmortem',
    title: 'تحلیلگر حادثه و گزارش ریشه‌یابی SRE',
    englishTitle: 'SRE Incident Post-Mortem & Root Cause Analyzer',
    category: 'Engineering & DevOps',
    difficulty: 'پیشرفته',
    scenarioBrief: 'تیم زیرساخت پس از یک قطعی ۴۵ دقیقه‌ای در درگاه پرداخت، لاگ‌ها و داده‌های مانیتورینگ را جمع‌آوری کرده و نیازمند یک پرامپت خودکار برای تدوین گزارش بی‌طرفانه Root-Cause و تدوین اقدامات پیشگیرانه است.',
    businessGoal: 'ساخت پرامپت مهندسی با گاردریل‌های سخت‌گیرانه برای تفکیک فرضیات از شواهد مستند و خروجی در قالب جدول استاندارد مانیتورینگ.',
    requiredPillars: [
      { name: 'نقش تخصصی', english: 'Role', description: 'مهندس ارشد قابلیت اطمینان سیستم (Staff SRE)' },
      { name: 'کانتکست سیستمی', english: 'Context', description: 'معماری مایکروسرویس با پایگاه داده توزیع‌شده' },
      { name: 'مخاطب', english: 'Audience', description: 'تیم توسعه بک‌اند و مدیران فنی سازمان' },
      { name: 'وظیفه', english: 'Task', description: 'تحلیل لاگ، بازسازی خط زمانی (Timeline) و تعیین علت ریشه‌ای' },
      { name: 'گاردریل‌ها', english: 'Constraints', description: 'فرهنگ بدون سرزنش (Blameless)، عدم ذکر نام افراد، تفکیک فکت از حدس' },
      { name: 'فرمت خروجی', english: 'Output Format', description: 'جدول مارک‌داون شامل زمان، رویداد، اثر و Action Item با اولویت P0 تا P2' },
      { name: 'معیار موفقیت', english: 'Success Criteria', description: 'اقدامات پیشگیرانه باید به طور مستقیم مانع تکرار حادثه شوند' }
    ],
    starterPrompt: 'این لاگ‌ها را بخوان و بگو چرا سیستم قطع شده بود.',
    sampleWinningPrompt: `<role>
شما یک مهندس ارشد قابلیت اطمینان سایت (Staff SRE) با تخصص در تحلیل حوادث بحرانی در معماری‌های ابری هستید.
</role>

<context>
درگاه پرداخت توزیع‌شده به مدت ۴۵ دقیقه دچار خطای ۵۰۴ Gateway Timeout شد. لاگ‌های ارسالی نشان‌دهنده نشت اتصال در Connection Pool پایگاه داده هستند.
</context>

<instructions>
لاگ‌های حادثه را تحلیل کرده و گزارش رسمی کالبدشکافی حادثه (Blameless Post-Mortem) را تدوین کنید:
۱. بازسازی کرونولوژیک خط زمانی از لحظه شروع تا بازیابی
۲. شناسایی علت ریشه‌ای مستقیم (Direct Root Cause) و عوامل زمینه‌ساز (Contributing Factors)
۳. تعریف اقدامات اصلاحی با اولویت‌بندی P0، P1 و P2
</instructions>

<audience>
معماران فنی، مدیران ارشد مهندسی و تیم‌های توسعه سرویس.
</audience>

<rules>
- رویکرد باید کاملاً بدون سرزنش فردی (Blameless) باشد؛ نام هیچ مهندسی ذکر نشود.
- بین «شواهد قطعی لاگ» و «فرضیات تحلیلی» مرز مشخص بگذارید.
- از ارائه راهکارهای کلی مانند «سیستم باید بهتر شود» بپرهیزید؛ اقدامات باید دارای شاخص فنی باشند.
</rules>

<output_format>
# 📋 گزارش کالبدشکافی حادثه (Incident Post-Mortem)
## ۱. خلاصه مدیریتی و ضریب اثر
## ۲. خط زمانی وقایع (جدول Markdown شامل: ساعت، رخداد، سیستم)
## ۳. تحلیل علت ریشه‌ای (Root Cause Analysis)
## ۴. ماتریس اقدامات اصلاحی (شامل: عنوان، اولویت P0-P2، شاخص موفقیت)
</output_format>

<success_criteria>
گزارش باید استانداردهای Google SRE Book را برای مستندسازی سوانح پاس کند.
</success_criteria>`,
    xpReward: 400,
    evaluationCriteria: {
      minScore: 88,
      requiredKeywords: ['sre', 'post-mortem', 'لاگ', 'ریشه‌یابی', 'p0'],
      requiredTags: ['role', 'context', 'instructions', 'rules', 'output_format', 'success_criteria']
    }
  },
  {
    id: 'arena-03-support-refund-agent',
    title: 'ایجنت پشتیبانی مشتریان با گاردریل‌های سخت‌گیرانه مالی',
    englishTitle: 'Customer Support Refund Agent with Strict Guardrails',
    category: 'AI Agents & Automation',
    difficulty: 'حرفه‌ای',
    scenarioBrief: 'یک فروشگاه اینترنتی بین‌المللی قصد دارد پاسخ‌دهی به تیکت‌های استرداد وجه (Refund) را با ایجنت هوش مصنوعی اتوماتیک کند. ایجنت باید شرایط گارانتی ۷ روزه را ارزیابی کرده و در صورت رد درخواست، با همدلی پاسخ دهد و خروجی ساختاریافته JSON تولید کند.',
    businessGoal: 'ساخت پرامپت ایجنت بدون ریسک مالی، با تفکیک حالت تایید و رد، و خروجی JSON معتبر برای فراخوانی API بانکی.',
    requiredPillars: [
      { name: 'نقش ایجنت', english: 'Role', description: 'دستیار خودکار واحد مالی و پشتیبانی مشتریان' },
      { name: 'کانتکست قوانین', english: 'Context', description: 'قوانین بازگشت وجه: کالاهای دیجیتال حداکثر ۴۸ ساعت، کالای فیزیکی ۷ روز بدون باز شدن پلمپ' },
      { name: 'مخاطب', english: 'Audience', description: 'مشتری شاکی یا متقاضی بازپرداخت' },
      { name: 'وظیفه', english: 'Task', description: 'ارزیابی وضعیت خرید، تصمیم‌گیری و تولید پیام پاسخ همراه با شیء JSON' },
      { name: 'گاردریل‌ها', english: 'Constraints', description: 'عدم قول بازپرداخت خارج از آیین‌نامه، لحن همدلانه در صورت رد، خروجی JSON کاملاً معتبر' },
      { name: 'فرمت خروجی', english: 'Output Format', description: 'یک بلوک JSON خالص با کلیدهای eligibility، reason، refund_amount و customer_reply' },
      { name: 'معیار موفقیت', english: 'Success Criteria', description: 'تولید JSON بدون خطا برای وب‌هوک سیستم مالی' }
    ],
    starterPrompt: 'به این مشتری بگو پولش را پس می‌دهیم یا نه.',
    sampleWinningPrompt: `<role>
شما ایجنت هوشمند اعتبارسنجی قوانین بازگشت وجه و پشتیبانی مالی مشتریان هستید.
</role>

<context>
سیاست مالی شرکت:
۱. دوره‌های آموزشی آنلاین در صورتی که کمتر از ۱۰٪ مشاهده شده باشند تا ۴۸ ساعت قابل استرداد هستند.
۲. اشتراک‌های ماهانه تمدید شده غیرقابل استرداد هستند مگر در صورت قطعی فنی سرویس به مدت بیش از ۱۲ ساعت.
</context>

<instructions>
درخواست تیکت کاربر را بر اساس سیاست‌های فوق ارزیابی کنید.
اگر واجد شرایط است، مبلغ استرداد را محاسبه کنید.
اگر واجد شرایط نیست، با لحنی کاملاً مودبانه و همدلانه دلیل را توضیح داده و کد تخفیف ۲۰ درصدی جایگزین ارائه دهید.
</instructions>

<rules>
- خارج از قوانین تعیین‌شده به هیچ عنوان وعده استرداد وجه ندهید.
- هیچ متنی خارج از بلوک JSON خروجی ارسال نکنید.
- کلیدهای JSON باید دقیقاً مطابق ساختار درخواستی باشد.
</rules>

<output_format>
{
  "ticket_id": "string",
  "is_eligible": true | false,
  "decision_reason": "string",
  "refund_amount_irr": number,
  "customer_reply_text": "string (متن فارسی رسمی و همدلانه)",
  "requires_human_review": true | false
}
</output_format>

<success_criteria>
خروجی باید مستقیماً با استاندارد JSON.parse در وب‌هوک سیستم پرداخت بدون خطای سینتکس اجرا شود.
</success_criteria>`,
    xpReward: 500,
    evaluationCriteria: {
      minScore: 90,
      requiredKeywords: ['استرداد', 'json', 'تیکت', 'قوانین', 'همدلانه'],
      requiredTags: ['role', 'context', 'instructions', 'rules', 'output_format']
    }
  }
];
