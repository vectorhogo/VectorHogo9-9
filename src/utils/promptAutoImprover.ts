import { evaluateEducationalPrompt } from './promptScoringEngine';

export interface PromptImprovementResult {
  originalPrompt: string;
  improvedPrompt: string;
  changesMade: string[];
  improvementsExplanation: string;
  roleAdded?: string;
  contextAdded?: string;
  constraintsAdded?: string[];
  outputFormatAdded?: string;
}

/**
 * Deterministic Auto-Improver for Educational Prompt Engineering
 * Analyzes the user's raw prompt and transforms it into a robust, structured prompt
 * adhering to industry standards (Role, Context, Task, Audience, Constraints, Output Format).
 */
export function autoImprovePrompt(rawPrompt: string): PromptImprovementResult {
  const clean = rawPrompt.trim();
  const evaluation = evaluateEducationalPrompt(clean);
  const changesMade: string[] = [];

  // Determine domain/topic hints from the user prompt
  let detectedDomain = 'General';
  let suggestedRole = 'تو یک متخصص و مشاور ارشد در حوزه تخصصی مربوطه هستی.';
  let suggestedAudience = 'مدیران و تصمیم‌گیرندگان فنی و تجاری';

  if (/(کد|برنامه|پایتون|تایپ‌اسکریپت|جاوا|باگ|تابع|api|sql|react|typescript|python|code)/i.test(clean)) {
    detectedDomain = 'Software Engineering';
    suggestedRole = 'تو یک معمار ارشد سیستم‌های نرم‌افزاری و مهندس ارشد فول‌استک هستی.';
    suggestedAudience = 'توسعه‌دهندگان نرم‌افزار و تیم‌های مهندسی محصول';
  } else if (/(تبلیغ|بازاریابی|فروش|سئو|کمپین|مارکتینگ|ایمیل مارکتینگ|marketing|seo|sales|copywrite)/i.test(clean)) {
    detectedDomain = 'Growth & Marketing';
    suggestedRole = 'تو یک استراتژیست ارشد بازاریابی دیجیتال و کپی‌رایتر حرفه‌ای Conversion-Driven هستی.';
    suggestedAudience = 'مشتریان بالقوه B2B و تصمیم‌گیرندگان خرید سازمانی';
  } else if (/(مقاله|پژوهش|تحقیق|خلاصه|تحلیل|آمار|academic|research|paper|data)/i.test(clean)) {
    detectedDomain = 'Research & Data Analysis';
    suggestedRole = 'تو یک پژوهشگر ارشد و تحلیلگر ارشد داده‌های پژوهشی هستی.';
    suggestedAudience = 'محققان دانشگاهی و سرمایه‌گذاران استراتژیک';
  } else if (/(آموزش|درس|تدریس|مفاهیم|دانشجو|دانش‌آموز|learn|teach|tutor)/i.test(clean)) {
    detectedDomain = 'Education';
    suggestedRole = 'تو یک مدرس برجسته و طراح دوره‌های آموزشی تعاملی با متدولوژی فاینمن هستی.';
    suggestedAudience = 'دانشجویان و متخصصانی که قصد یادگیری عمیق و کاربردی دارند';
  }

  // Build improved structured prompt
  const parts: string[] = [];

  // 1. Role
  if (!evaluation.detectedComponents.hasRole) {
    parts.push(`<role>\n${suggestedRole}\n</role>`);
    changesMade.push('افزودن نقش و پرسونای تخصصی (Role)');
  }

  // 2. Context
  if (!evaluation.detectedComponents.hasContext) {
    parts.push(`<context>\nپروژه و داده‌های ورودی در این زمینه قرار دارند. هدف ایجاد خروجی مستند، عملیاتی و با بالاترین ضریب اطمینان است.\n</context>`);
    changesMade.push('تثبیت بستر کانتکست و زمینه پروژه (Context)');
  }

  // 3. Task (Cleaned raw prompt or structured instruction)
  const taskContent = clean || 'دستورالعمل و وظیفه اصلی را اجرا نما.';
  parts.push(`<instructions>\n${taskContent}\n</instructions>`);
  if (clean.length < 30) {
    changesMade.push('شفاف‌سازی و تفکیک هدف و وظیفه عملیاتی (Task)');
  }

  // 4. Audience
  if (!evaluation.detectedComponents.hasAudience) {
    parts.push(`<audience>\n${suggestedAudience}\n</audience>`);
    changesMade.push('تعیین مخاطبان هدف و تطبیق لحن (Audience)');
  }

  // 5. Constraints
  if (!evaluation.detectedComponents.hasConstraints) {
    parts.push(`<rules>\n- بدون مقدمه‌چینی اضافه یا خوش‌آمدگویی، مستقیماً به سراغ اصل پاسخ بروید.\n- تمام نکات به صورت شفاف، دسته‌بندی‌شده و همراه با استدلال تحلیلی ارائه شوند.\n- در صورت وجود ابهام یا پیش‌فرض‌های نامعلوم، فرضیات خود را در ابتدا قید کنید.\n</rules>`);
    changesMade.push('تزریق محدودیت‌های کیفی و قوانین بازدارنده (Rules & Constraints)');
  }

  // 6. Output Format
  if (!evaluation.detectedComponents.hasOutputFormat) {
    parts.push(`<output_format>\nپاسخ را در قالب استاندارد Markdown با عناوین مشخص (H2/H3)، بولت‌پوینت‌های تحلیلی و جداول مقایسه‌ای مورد نیاز ساختاربندی کنید.\n</output_format>`);
    changesMade.push('تعیین قالب ساختاریافته خروجی (Markdown Output Format)');
  }

  // 7. Success Criteria
  if (!evaluation.detectedComponents.hasSuccessCriteria) {
    parts.push(`<success_criteria>\nخروجی زمانی موفق در نظر گرفته می‌شود که عملیاتی، بدون حاشیه و آماده استفاده مستقیم در محیط کاربری باشد.\n</success_criteria>`);
    changesMade.push('تعریف شاخص و معیارهای سنجش موفقیت (Success Criteria)');
  }

  const improvedPrompt = parts.join('\n\n');

  return {
    originalPrompt: rawPrompt,
    improvedPrompt,
    changesMade,
    improvementsExplanation: `پرامپت اولیه شما از یک دستور کلی به یک ساختار چندلایه مهندسی‌شده ارتقا یافت. ${changesMade.length} رکن کلیدی افزوده شدند تا خطای مدل به حداقل برسد و خروجی قابل پیش‌بینی‌تر شود.`
  };
}
