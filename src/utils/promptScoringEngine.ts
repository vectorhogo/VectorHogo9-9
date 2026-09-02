import { PromptScoreResult, PromptQualityLevel } from '../types';

/**
 * Educational Prompt Scoring Engine 2.0 (Prompt Doctor)
 * Evaluates prompts across the 8 standard pillars (Total: 100 pts)
 * 
 * Weights:
 * - Clarity: 20
 * - Context: 15
 * - Task: 20
 * - Constraints: 15
 * - Output Control: 15
 * - Audience: 5
 * - Examples: 5
 * - Success Criteria: 5
 * Total: 100
 */
export function evaluateEducationalPrompt(
  prompt: string,
  targetContext?: {
    requiredKeywords?: string[];
    expectedRole?: boolean;
    expectedFormat?: string;
  }
): PromptScoreResult {
  const cleanPrompt = prompt.trim();
  const lowerPrompt = cleanPrompt.toLowerCase();

  // 1. Role / Persona Detection
  const roleRegex = /(نقش|شما یک|به عنوان|پرسونا|متخصص|مشاور|مهندس|نویسنده|تحلیلگر|مترجم|طراح|مدیر|استراتژیست|you are|act as|as an?|role:|persona:|<role>|<persona>)/i;
  const hasRole = roleRegex.test(cleanPrompt);

  // 2. Task / Goal Specification (Max 20 pts)
  const taskRegex = /(وظیفه|هدف|دستورالعمل|انجام دهید|بنویسید|تحلیل کنید|خلاصه کنید|ایجاد کنید|تولید کنید|استخراج کنید|طراحی کنید|بررسی کنید|task:|goal:|instruction:|objective:|write|generate|analyze|create|summarize|extract|<task>|<instructions>)/i;
  const hasExplicitTask = taskRegex.test(cleanPrompt);
  let taskScore = 0;
  if (hasExplicitTask) {
    taskScore = cleanPrompt.length > 50 ? 20 : 15;
  } else if (cleanPrompt.length > 30) {
    taskScore = 8;
  }

  // 3. Clarity & Specificity (Max 20 pts)
  // Evaluates absence of pure vague queries ("یک چیزی بنویس", "خوب باشه") and presence of detailed instruction
  const isTooVague = /^(یک متن بنویس|یک مقاله بنویس|کمکم کن|چیزی بگو|توضیح بده)$/i.test(cleanPrompt);
  let clarityScore = 0;
  if (!isTooVague && cleanPrompt.length > 15) {
    clarityScore += 8;
    if (cleanPrompt.length > 60) clarityScore += 6;
    if (cleanPrompt.includes('\n') || cleanPrompt.includes('،') || cleanPrompt.includes('؛') || cleanPrompt.includes(':') || cleanPrompt.includes('-')) clarityScore += 6;
  } else {
    clarityScore = cleanPrompt.length > 5 ? 5 : 0;
  }
  clarityScore = Math.min(20, clarityScore);

  // 4. Context & Background (Max 15 pts)
  const contextRegex = /(زمینه|کانتکست|پیش‌زمینه|شرایط|وضعیت|داستان|موقعیت|پروژه|کسب‌وکار|شرکت|فروشگاه|محصول|داده|اطلاعات|context:|background:|scenario:|given that|in a situation where|<context>|<background>)/i;
  const hasContextKeywords = contextRegex.test(cleanPrompt);
  const hasSufficientLength = cleanPrompt.length > 100;
  const hasContext = hasContextKeywords || (hasSufficientLength && cleanPrompt.split('\n').length >= 3);
  let contextScore = 0;
  if (hasContextKeywords && cleanPrompt.length > 60) {
    contextScore = 15;
  } else if (hasContextKeywords || hasSufficientLength) {
    contextScore = 10;
  } else if (cleanPrompt.length > 40) {
    contextScore = 5;
  }

  // 5. Constraints & Negative Guidance (Max 15 pts)
  const constraintsRegex = /(محدودیت|قوانین|نباید|فقط|حداکثر|حداقل|کلمه|پاراگراف|بدون|اجتناب|صرفاً|الزام|عدم|قاعده|constraints:|rules:|do not|avoid|must not|max|maximum|limit to|only|strictly|<rules>|<constraints>)/i;
  const hasConstraints = constraintsRegex.test(cleanPrompt);
  let constraintsScore = hasConstraints ? 15 : 0;

  // 6. Output Format Control (Max 15 pts)
  const outputFormatRegex = /(فرمت خروجی|ساختار خروجی|قالب|json|markdown|جدول|بولت|شماره‌گذاری|فهرست|کد|xml|html|output format:|format:|structure:|as json|in markdown|table|bullet points|<output_format>|<output>)/i;
  const hasOutputFormat = outputFormatRegex.test(cleanPrompt);
  let outputScore = hasOutputFormat ? 15 : 0;

  // 7. Target Audience (Max 5 pts)
  const audienceRegex = /(مخاطب|خواننده|کاربر|مشتری|مدیران|برنامه‌نویسان|دانشجویان|کودکان|متخصصان|مبتدیان|عموم|سرمایه‌گذار|audience:|target audience:|for readers|for developers|for users|for clients|<audience>)/i;
  const hasAudience = audienceRegex.test(cleanPrompt);
  let audienceScore = hasAudience ? 5 : 0;

  // 8. Examples / Few-shot Cues (Max 5 pts)
  const examplesRegex = /(نمونه|مثال|الگو|برای مثال|مانند|example:|few-shot|sample:|e\.g\.|such as|<example>|<examples>)/i;
  const hasExamples = examplesRegex.test(cleanPrompt);
  let examplesScore = hasExamples ? 5 : 0;

  // 9. Success Criteria (Max 5 pts)
  const criteriaRegex = /(معیار|موفقیت|استاندارد|شاخص|کیفیت|دقت|kpi|ارزیابی|ملاک|success criteria:|criteria:|metric:|quality standard:|definition of done|<success_criteria>)/i;
  const hasSuccessCriteria = criteriaRegex.test(cleanPrompt);
  let successCriteriaScore = hasSuccessCriteria ? 5 : 0;

  // Calculate Total Score (0 - 100)
  const totalScore = Math.min(
    100,
    clarityScore + contextScore + taskScore + constraintsScore + outputScore + audienceScore + examplesScore + successCriteriaScore
  );

  // Quality Level Mapping
  let qualityLevel: PromptQualityLevel = 'Beginner';
  let qualityLevelFa = 'مبتدی (Beginner)';

  if (totalScore >= 90) {
    qualityLevel = 'Expert';
    qualityLevelFa = 'متخصص (Expert)';
  } else if (totalScore >= 75) {
    qualityLevel = 'Advanced';
    qualityLevelFa = 'پیشرفته (Advanced)';
  } else if (totalScore >= 60) {
    qualityLevel = 'Good';
    qualityLevelFa = 'خوب (Good)';
  } else if (totalScore >= 40) {
    qualityLevel = 'Developing';
    qualityLevelFa = 'در حال توسعه (Developing)';
  } else {
    qualityLevel = 'Beginner';
    qualityLevelFa = 'مبتدی (Beginner)';
  }

  const passed = totalScore >= 60;

  // Dimensional normalized summary (0 - 100)
  const structureDimension = Math.min(100, Math.round(((hasRole ? 0.3 : 0) + (outputScore / 15) * 0.4 + (hasConstraints ? 0.3 : 0)) * 100));
  const clarityDimension = Math.min(100, Math.round(((clarityScore / 20) * 0.5 + (taskScore / 20) * 0.5) * 100));
  const contextDimension = Math.min(100, Math.round(((contextScore / 15) * 0.7 + (audienceScore / 5) * 0.3) * 100));
  const constraintsDimension = Math.min(100, Math.round((constraintsScore / 15) * 100));
  const outputDimension = Math.min(100, Math.round(((outputScore / 15) * 0.7 + (successCriteriaScore / 5) * 0.3) * 100));

  // Strengths identification
  const strengths: string[] = [];
  if (hasExplicitTask) strengths.push('هدف مشخص و دستورالعمل صریح است');
  if (hasContext) strengths.push('Context و اطلاعات زمینه به خوبی پوشش داده شده است');
  if (hasRole) strengths.push('نقش و پرسونا برای هدایت عمق پاسخ تعریف شده است');
  if (hasConstraints) strengths.push('محدودیت‌ها و خطوط قرمز خروجی معین شده‌اند');
  if (hasOutputFormat) strengths.push('فرمت و ساختار مورد نظر برای خروجی مشخص است');
  if (hasAudience) strengths.push('مخاطب هدف خروجی به روشنی تفکیک شده است');
  if (hasExamples) strengths.push('نمونه یا الگوی Few-Shot به مدل آموزش داده شده است');
  if (hasSuccessCriteria) strengths.push('معیارهای سنجش موفقیت و کیفیت تعریف شده‌اند');

  // Warnings identification
  const warnings: string[] = [];
  if (!hasAudience) warnings.push('Audience مشخص نشده است (لحن ممکن است برای مخاطب غیرهدف مناسب نباشد)');
  if (!hasSuccessCriteria) warnings.push('Success Criteria و معیارهای شفاف ارزیابی وجود ندارد');
  if (!hasConstraints) warnings.push('محدودیت‌ها و قوانین بازدارنده تعیین نشده‌اند');
  if (!hasOutputFormat) warnings.push('قالب خروجی مشخص نیست (ممکن است مدل طولانی یا بی‌ساختار پاسخ دهد)');
  if (!hasRole) warnings.push('نقش و پرسونای تخصصی غایب است');
  if (!hasContext) warnings.push('اطلاعات زمینه ناکافی است و ممکن است به توهم مدل منجر شود');
  if (isTooVague) warnings.push('دستور بسیار کلی و فاقد جزئیات عملیاتی است');

  // Actionable Top 3 Recommendations
  const recommendations: string[] = [];
  if (!hasRole) {
    recommendations.push('افزودن نقش تخصصی (مثال: «تو یک استراتژیست ارشد بازاریابی B2B هستی...»)');
  }
  if (!hasContext) {
    recommendations.push('تزریق کانتکست و داده‌های ورودی در قالب تگ‌های <context> یا بخش مشخص');
  }
  if (!hasConstraints) {
    recommendations.push('تعیین حداقل ۲ محدودیت صریح (مانند سقف ۳۰۰ کلمه، اجتناب از کلی‌گویی)');
  }
  if (!hasOutputFormat && recommendations.length < 3) {
    recommendations.push('تعریف ساختار خروجی استاندارد (مانند جدول Markdown یا آبجکت JSON)');
  }
  if (!hasAudience && recommendations.length < 3) {
    recommendations.push('مشخص کردن دقیق پرسونای مخاطبان (مانند مدیران فنی یا کاربران مبتدی)');
  }
  if (!hasSuccessCriteria && recommendations.length < 3) {
    recommendations.push('تعریف شاخص‌های کلیدی کیفیت خروجی و انتظارات شفاف پروژه');
  }

  return {
    totalScore,
    qualityLevel,
    qualityLevelFa,
    passed,
    breakdown: {
      clarityScore,
      contextScore,
      taskScore,
      constraintsScore,
      outputScore,
      audienceScore,
      examplesScore,
      successCriteriaScore,
      structureDimension,
      clarityDimension,
      contextDimension,
      constraintsDimension,
      outputDimension
    },
    strengths,
    warnings,
    recommendations: recommendations.slice(0, 3),
    detectedComponents: {
      hasRole,
      hasContext,
      hasTask: hasExplicitTask,
      hasAudience,
      hasConstraints,
      hasOutputFormat,
      hasExamples,
      hasSuccessCriteria
    }
  };
}
