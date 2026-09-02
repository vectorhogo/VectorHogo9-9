import { AnthropicTrackItem } from '../types';

export const ANTHROPIC_TRACK_ITEMS: AnthropicTrackItem[] = [
  {
    id: 'anthropic-01',
    title: 'آموزش تعاملی مهندسی پرامپت آنتروپیک',
    englishTitle: 'Anthropic Interactive Prompt Engineering Tutorial',
    officialSourceUrl: 'https://github.com/anthropics/prompt-eng-interactive-tutorial',
    difficulty: 'مقدماتی',
    estimatedTime: '۳ ساعت',
    topics: [
      'اصول مدل‌های کلود (Claude 3.5 & Claude 3.7)',
      'استفاده از تگ‌های ساختاریافته XML (<instructions>, <context>, <rules>)',
      'شفافیت و صراحت دستورالعمل‌ها (Clarity & Directness)',
      'پیش‌پر کردن خروجی کمکی (Pre-filling Claude’s Output)'
    ],
    overview: 'این دوره تعاملی رسمی که توسط تیم Developer Relations شرکت آنتروپیک توسعه یافته، استاندارد مرجع برای درک عمیق نحوه ارتباط با مدل‌های سری Claude است. در این مسیر، شما می‌آموزید که چگونه با استفاده از تگ‌های XML و دستورات بدون ابهام، رفتارهای غیرمنتظره مدل را مهار کنید.',
    claudeSpecifics: [
      'کلود به صورت بومی روی متون دارای تگ‌های XML آموزش دیده و به آن‌ها واکنش فوق‌العاده‌ای نشان می‌دهد.',
      'تکنیک Pre-filling: می‌توانید پیام دستیار (Assistant message) را با یک کاراکتر یا تگ مانند <json> یا { شروع کنید تا کلود ملزم شود پاسخ را فوراً از همان نقطه ادامه دهد.',
      'کلود بسیار مطیع است؛ اگر به او بگویید کارهای مؤدبانه و مکالمه‌ای را حذف کند، خروجی ۱۰۰٪ تمیز تحویل می‌دهد.'
    ],
    xmlStructureExample: `<system>
You are an expert financial analyst for Claude.
</system>

<context>
Here is the Q3 balance sheet of the company.
<balance_sheet>
Revenue: $4.5M
Operating Expenses: $3.1M
Net Margin: 31%
</balance_sheet>
</context>

<instructions>
Extract the net profit in USD and summarize financial health in 2 bullet points.
Wrap your thoughts inside <thinking> and final output inside <analysis>.
</instructions>`,
    practicalTips: [
      'همیشه متغیرها و مستندات بزرگ را درون تگ‌های با نام معنادار مانند <document> یا <contract> قرار دهید.',
      'برای جلوگیری از فراموشی دستورات، تگ <instructions> را بعد از تگ <document> قرار دهید.',
      'از تگ <thinking> برای افزایش چشمگیر دقت در محاسبات و استدلال‌های چندمرحله‌ای استفاده نمایید.'
    ],
    practicePrompt: {
      initial: 'متن زیر رو تحلیل کن و نظر بده: [گزارش]',
      goal: 'تبدیل به پرامپت ساختاریافته با تگ‌های <document> و <instructions> و <output_format>',
      solution: `<instructions>
گزارش مالی موجود در تگ <document> را بررسی کرده و ریسک‌های نقدینگی را در قالب ۳ بند کوتاه استخراج نمایید.
</instructions>

<document>
[متن گزارش مالی]
</document>

<output_format>
- ریسک ۱: ...
- ریسک ۲: ...
- ریسک ۳: ...
</output_format>`
    }
  },
  {
    id: 'anthropic-02',
    title: 'پرامپتینگ در دنیای واقعی با کلود',
    englishTitle: 'Real World Prompting with Claude',
    officialSourceUrl: 'https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview',
    difficulty: 'متوسط',
    estimatedTime: '۴ ساعت',
    topics: [
      'مدیریت پنجره کانتکست ۲۰۰ هزار توکنی (Long Context Management)',
      'استخراج داده از اسناد طولانی حقوقی و مالی',
      'کاهش نرخ رد کردن ناخواسته (False Refusals Mitigation)',
      'پایپ‌لاین‌های چندمرحله‌ای و زنجیره‌سازی پرامپت‌ها'
    ],
    overview: 'راهنمای جامع مهندسی پرامپت در سیستم‌های در مقیاس تولید (Production-Scale). تمرکز این بخش بر نحوه استخراج اطلاعات از کتاب‌ها و فایل‌های PDF چندصد صفحه‌ای و بهینه‌سازی هزینه و سرعت است.',
    claudeSpecifics: [
      'در کانتکست‌های بزرگ، سوالات و دستورات دقیق را در انتهای پرامپت بگذارید تا توجه مدل در بالاترین سطح بماند.',
      'برای تحلیل فایل‌های PDF، تصاویر یا نمودارها، متن سوال را هم‌ارز با تصویر بفرستید.',
      'اگر کلود به اشتباه درخواستی را به دلایل ایمنی رد می‌کند، زمینه تجاری و بی‌خطر بودن سناریو را در پرامپت سیستم شفاف سازید.'
    ],
    xmlStructureExample: `<documents>
<document index="1">
[متن سند اول]
</document>
<document index="2">
[متن سند دوم]
</document>
</documents>

<instructions>
Find all conflicting clauses between Document 1 and Document 2 regarding intellectual property ownership.
Quote the exact text and cite the document index.
</instructions>`,
    practicalTips: [
      'از ایندکس‌گذاری اسناد با <document index="1"> برای ارجاع آسان مدل استفاده کنید.',
      'به جای یک پرامپت غول‌پیکر با ۱۰ وظیفه متفاوت، آن را به ۳ پرامپت زنجیره‌ای (Chained Prompts) خرد کنید.'
    ],
    practicePrompt: {
      initial: 'دو تا قرارداد رو مقایسه کن ببین کجاش تناقض داره: [سند ۱] [سند ۲]',
      goal: 'طراحی پرامپت مقایسه‌ای چندسندی با ارجاع دقیق به شماره بندها',
      solution: `<documents>
<doc id="A">[قرارداد اول]</doc>
<doc id="B">[قرارداد دوم]</doc>
</documents>

<task>
Compare <doc id="A"> and <doc id="B">. List all discrepancies in warranty terms in a table format:
| Topic | Doc A Clause | Doc B Clause | Legal Impact |
</task>`
    }
  },
  {
    id: 'anthropic-03',
    title: 'ارزیابی و بنچمارک پرامپت در آنتروپیک',
    englishTitle: 'Prompt Evaluations & Metaprompting',
    officialSourceUrl: 'https://github.com/anthropics/courses',
    difficulty: 'پیشرفته',
    estimatedTime: '۳.۵ ساعت',
    topics: [
      'طراحی مجموعه داده‌های تست (Golden Datasets)',
      'سنجش دقت خروجی با استفاده از روبریک‌های درجه‌بندی',
      'تکنیک تولید خودکار پرامپت توسط کلود (Claude Metaprompt)',
      'تست رگرسیون برای پیشگیری از تخریب رفتار مدل'
    ],
    overview: 'آموزش سیستماتیک تست و اعتبارسنجی پرامپت‌ها قبل از عرضه عمومی. این آموزش به شما یاد می‌دهد چگونه مانند تیم هوش مصنوعی آنتروپیک، پرامپت‌های خود را با بنچمارک‌های عددی بسنجید و با Metaprompt پرامپت‌های کامل بسازید.',
    claudeSpecifics: [
      'ابزار Metaprompt آنتروپیک از کلود برای نوشتن پرامپت‌های پرسونامحور با تمام تگ‌های XML استفاده می‌کند.',
      'استفاده از کلود به عنوان داور (LLM-as-a-Judge) برای ارزیابی خروجی مدل‌های سبک‌تر مثل Claude 3.5 Haiku.',
      'محاسبه شاخص توافق انسانی (Human Agreement Correlation).'
    ],
    xmlStructureExample: `<evaluation_criteria>
Score the output from 1 to 5 based on:
1. Technical Correctness (Did it use TypeScript properly?)
2. Security (Did it prevent SQL Injection?)
3. Efficiency (Is the time complexity optimal?)
</evaluation_criteria>

<test_case>
[کد نمونه تولید شده]
</test_case>`,
    practicalTips: [
      'حداقل ۳۰ الی ۵۰ نمونه تست از سناریوهای واقعی و لبه تهیه کنید.',
      'قبل از انتشار پرامپت جدید، اطمینان حاصل کنید که امتیاز تست‌های قبلی افت نکرده است.'
    ],
    practicePrompt: {
      initial: 'ببین این ترجمه خوبه یا نه از ۱ تا ۱۰ نمره بده.',
      goal: 'طراحی سیستم داوری دقیق بر مبنای روبریک ۳ فاکتوره',
      solution: `<eval_rubric>
Evaluate the Persian translation of the technical text:
- Terminology Accuracy (1-5)
- Natural Persian Phrasing (1-5)
- No omitted sentences (1-5)
Provide evidence for any deduction.
</eval_rubric>`
    }
  },
  {
    id: 'anthropic-04',
    title: 'فراخوانی ابزارها و Function Calling در کلود',
    englishTitle: 'Tool Use & Function Calling with Claude',
    officialSourceUrl: 'https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview',
    difficulty: 'حرفه‌ای',
    estimatedTime: '۴ ساعت',
    topics: [
      'تعریف JSON Schema برای ابزارهای خارجی',
      'فراخوانی همزمان چند ابزار (Parallel Tool Calling)',
      'مدیریت خطاهای API در داخل چرخه تصمیم‌گیری کلود',
      'ایمن‌سازی فراخوانی ابزارها و تایید انسانی (Human-in-the-Loop)'
    ],
    overview: 'یاد بگیرید چگونه کلود را به دنیای واقعی، پایگاه‌های داده SQL، سامانه‌های ارسال ایمیل و وب متصل کنید. بررسی الگوهای تعریف ابزار و فرمت‌های استاندارد آنتروپیک.',
    claudeSpecifics: [
      'کلود ۳.۵ و ۳.۷ دارای بالاترین ضریب دقت در انتخاب ابزار صحیح و ارسال پارامترهای بدون خطا هستند.',
      'می‌توانید ابزارها را مجبور کنید (Forced Tool Use) یا به کلود اجازه انتخاب پویا بدهید.',
      'پشتیبانی از ساختارهای تودرتوی JSON Schema.'
    ],
    xmlStructureExample: `<tools>
<tool_description>
<tool_name>search_knowledge_base</tool_name>
<description>Searches internal company docs for HR and IT policies.</description>
<parameters>
<parameter>
<name>query</name>
<type>string</type>
<description>Keywords to search for.</description>
</parameter>
</parameters>
</tool_description>
</tools>`,
    practicalTips: [
      'توضیحات ابزار (Description) را بسیار غنی و با ذکر کاربرد بنویسید؛ مدل بر اساس توضیحات ابزار تصمیم می‌گیرد.',
      'برای ابزارهای حساس مالی، همیشه یک مرحله تاییدیه اضافه کنید.'
    ],
    practicePrompt: {
      initial: 'از توابع زیر برای چک کردن آب و هوا استفاده کن.',
      goal: 'طراحی اسکیمای کامل ابزار با شرح پارامترها و خطاهای احتمالی',
      solution: `<available_tools>
{
  "name": "get_stock_price",
  "description": "Returns current stock price and P/E ratio for a given ticker symbol.",
  "parameters": {
    "ticker": { "type": "string", "description": "e.g. AAPL, MSFT, FOOLAD" }
  }
}
</available_tools>`
    }
  },
  {
    id: 'anthropic-05',
    title: 'بهترین تجربیات و اصول کلیدی پرامپتینگ آنتروپیک',
    englishTitle: 'Anthropic Prompting Best Practices',
    officialSourceUrl: 'https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview',
    difficulty: 'متوسط',
    estimatedTime: '۲.۵ ساعت',
    topics: [
      'شفافیت مطلق در برابر ایجاز افراطی',
      'طراحی پیام سیستم (System Prompts) پایدار',
      'استفاده از نقل‌قول‌ها جهت اثبات ادعاها',
      'تکنیک‌های جلوگیری از پاسخ‌های طولانی و خسته‌کننده'
    ],
    overview: 'مجموعه طلایی از دستورالعمل‌ها و چک‌لیست‌های مستقیم مهندسان ارشد هوش مصنوعی آنتروپیک برای رسیدن به حداکثر بهره‌وری، سرعت و اطمینان در کار با مدل‌های زبانی.',
    claudeSpecifics: [
      'کلود تفکر منطقی را زمانی به بهترین شکل پیاده می‌کند که کانتکست غنی باشد.',
      'از دادن پرامپت‌های متناقض خودداری کنید؛ کلود در مواجهه با تناقض تلاش می‌کند میانگین را بگیرد که ممکن است مطلوب نباشد.',
      'برای خروجی‌های برنامه‌نویسی، ساختار کامل فایل‌ها را مطالبه کنید.'
    ],
    xmlStructureExample: `<system_prompt>
You are an expert technical editor.
Your goal is to enforce high code quality and clear documentation.
Always be concise, factual, and direct.
</system_prompt>`,
    practicalTips: [
      'پرامپت‌های خود را مانند قراردادهای حقوقی شفاف و بدون واژه‌های دوپهلو بنویسید.',
      'از مثال‌های Few-Shot برای تثبیت سبک نگارش سازمانی استفاده کنید.'
    ],
    practicePrompt: {
      initial: 'متن فنی رو ویرایش کن و بگو چطوره.',
      goal: 'طراحی پرامپت سیستم و قوانین ویرایش تخصصی',
      solution: `<system>
شما یک ویراستار متون تخصصی نرم‌افزار هستید.
قوانین:
۱. اصطلاحات انگلیسی را با رسم‌الخط مصوب در پرانتز قرار دهید.
۲. جملات مجهول را به معلوم تبدیل کنید.
۳. خروجی فقط متن ویرایش شده بدون توضیحات باشد.
</system>`
    }
  }
];
