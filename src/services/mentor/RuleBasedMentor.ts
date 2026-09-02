import { MentorProvider, MentorFeedback, MentorAnalysisIssue } from './types';
import { evaluateEducationalPrompt } from '../../utils/promptScoringEngine';

/**
 * RuleBasedMentor: High-precision prompt engineering tutor.
 * Implements pedagogy-first feedback:
 * 1. Identify primary mistake
 * 2. Explain why LLMs fail or hallucinate without it
 * 3. Offer 3 graded hint levels (Small Clue -> Specific Guidance -> Complete Direction)
 * 4. Withhold full solution until requested
 */
export class RuleBasedMentor implements MentorProvider {
  id = 'rule_based_mentor';
  name = 'Rule-Based Pedagogical Mentor';

  async analyzePrompt(prompt: string): Promise<MentorFeedback> {
    const clean = prompt.trim();
    const evaluation = evaluateEducationalPrompt(clean);
    const issues: MentorAnalysisIssue[] = [];

    // 1. Check Task / Goal
    if (evaluation.breakdown.taskScore < 15) {
      issues.push({
        id: 'missing-task',
        category: 'task',
        severity: 'high',
        title: 'هدف و وظیفه مشخص نیست (Ambiguous Task)',
        explanation: 'مدل‌های هوش مصنوعی نیازمند دستوری مشخص هستند تا بدانند دقیقاً چه فرآیندی (خلاصه‌سازی، تحلیل، تولید کد یا بازنویسی) باید روی داده‌ها اعمال شود.',
        hint1: 'به خروجی نهایی فکر کن؛ مدل دقیقاً چه عملی باید انجام دهد؟',
        hint2: 'با افعال صریح و مشخص شروع کن: «تحلیل کن»، «خلاصه کن»، «استخراج کن» یا «طراحی کن».',
        hint3: 'دستور کار را داخل تگ <instructions> با ۳ گام مشخص بنویس تا مدل در اولویت‌بندی دچار سردرگمی نشود.',
        suggestedSnippet: `<instructions>\n۱. داده‌های ورودی را بررسی و ۳ نکته کلیدی را استخراج کن.\n۲. راهکارهای عملی با ذکر اولویت ارائه بده.\n</instructions>`,
        relatedConcept: 'Task Decomposition & Direct Imperatives'
      });
    }

    // 2. Check Role / Persona
    if (!evaluation.detectedComponents.hasRole) {
      issues.push({
        id: 'missing-role',
        category: 'role',
        severity: 'medium',
        title: 'پرسونا و نقش متخصص تعریف نشده است (Undefined Role)',
        explanation: 'تعیین نقش تخصصی به مدل می‌گوید وزن کدام نورون‌ها و الگوهای واژگانی را افزایش دهد و سطح فنی پاسخ را در چه رده‌ای تنظیم کند.',
        hint1: 'اگر یک انسان قرار بود این کار را انجام دهد، چه عنوانی در سازمان داشت؟',
        hint2: 'تخصص، سابقه کار و حیطه تمرکز مدل را به عنوان یک کارشناس ارشد تعریف کن.',
        hint3: 'در ابتدای پرامپت تگ <role> قرار بده: «تو یک معمار ارشد سیستم / متخصص دیجیتال مارکتینگ با ۱۰ سال تجربه هستی».',
        suggestedSnippet: `<role>\nتو یک تحلیلگر ارشد کسب‌وکار با تسلط بر مدل‌های رشد داده‌محور هستی.\n</role>`,
        relatedConcept: 'Role-Based Prompting & Tone Calibration'
      });
    }

    // 3. Check Context & Background
    if (evaluation.breakdown.contextScore < 10) {
      issues.push({
        id: 'missing-context',
        category: 'context',
        severity: 'high',
        title: 'پیش‌زمینه و موقعیت پروژه غایب است (Missing Context)',
        explanation: 'بدون کانتکست کافی، مدل هوش مصنوعی مجبور به حدس زدن شرایط فرضی می‌شود که منجر به پاسخ‌های کلی، بی‌روح و کم‌ارزش تجاری خواهد شد.',
        hint1: 'شرایط فعلی و صنعتی که این پرامپت در آن اجرا می‌شود چیست؟',
        hint2: 'توضیح بده چه پلتفرم، مخاطب، محصول یا وضعیتی در جریان است.',
        hint3: 'بخش <context> اضافه کن و اندازه شرکت، ابزارهای مورد استفاده و هدف پروژه را شرح بده.',
        suggestedSnippet: `<context>\nما یک استارتاپ B2B در حوزه فناوری مالی هستیم که در حال ورود به بازار بین‌المللی با تمرکز بر پرداخت‌های خرد می‌باشیم.\n</context>`,
        relatedConcept: 'Context Grounding & Ambiguity Reduction'
      });
    }

    // 4. Check Constraints / Guardrails
    if (evaluation.breakdown.constraintsScore === 0) {
      issues.push({
        id: 'missing-constraints',
        category: 'constraints',
        severity: 'high',
        title: 'گاردریل‌ها و خطوط قرمز تعیین نشده‌اند (No Negative Guidance)',
        explanation: 'اگر نگویید مدل «چه کارهایی نباید بکند»، مدل فرضیات غلط اضافه کرده یا بیش از حد توضیح می‌دهد. گاردریل‌ها ضامن پایداری سیستم در محیط واقعی هستند.',
        hint1: 'چه چیزهایی نباید در خروجی آورده شود؟ (طول متن، اصطلاحات ممنوعه، حدس‌های تاییدنشده)',
        hint2: 'محدودیت‌های فنی، طول کلمات یا فرمت‌های ممنوع را ذکر کن.',
        hint3: 'تگ <rules> را اضافه کن و با ۳ بولت منفی مثل «از مقدمه‌چینی بپرهیز» و «فراتر از ۲۰۰ کلمه ننویس» مشخص کن.',
        suggestedSnippet: `<rules>\n- از ادعاهای بدون منبع آماری خودداری کن.\n- پاسخ را بدون مقدمه و تشکر و صرفاً در قالب مشخص‌شده ارائه بده.\n- حداکثر طول خروجی ۳۰۰ کلمه باشد.\n</rules>`,
        relatedConcept: 'Negative Constraints & Guardrailing'
      });
    }

    // 5. Check Output Format Control
    if (evaluation.breakdown.outputScore === 0) {
      issues.push({
        id: 'missing-output-format',
        category: 'output_format',
        severity: 'medium',
        title: 'ساختار و فرمت خروجی کنترل نشده است (Unconstrained Output)',
        explanation: 'مدل باید دقیقاً بداند خروجی را به صورت JSON معتبر، جدول Markdown یا فهرست شماره‌گذاری‌شده تحویل دهد تا قابلیت پردازش خودکار در خط تولید فراهم باشد.',
        hint1: 'خروجی را در چه قالبی می‌خواهی کپی یا پردازش کنی؟',
        hint2: 'ساختار مورد نظرت را نام ببر (مثلاً Markdown با تیترهای استاندارد یا JSON).',
        hint3: 'بلوک <output_format> اضافه کن و ترتیب بخش‌ها یا کلیدهای JSON مورد نیاز را لیست کن.',
        suggestedSnippet: `<output_format>\nپاسخ را در یک ساختار JSON معتبر با کلیدهای زیر بازگردان:\n{\n  "summary": "خلاصه در ۲ خط",\n  "action_items": ["مورد ۱", "مورد ۲"],\n  "risk_score": 1-10\n}\n</output_format>`,
        relatedConcept: 'Deterministic Output Formatting'
      });
    }

    // 6. Check Target Audience
    if (evaluation.breakdown.audienceScore === 0) {
      issues.push({
        id: 'missing-audience',
        category: 'audience',
        severity: 'low',
        title: 'مخاطب هدف خروجی مبهم است (Undefined Audience)',
        explanation: 'زبان و سطح پیچیدگی توضیح برای یک مدیر ارشد اجرایی (C-Level) با یک مهندس جونیور یا یک مشتری عادی کاملاً متفاوت است.',
        hint1: 'به مخاطب نهایی این متن فکر کن.',
        hint2: 'مشخص کن این خروجی برای چه قشری با چه میزان دانش قبلی نوشته می‌شود.',
        hint3: 'یک تگ <audience> با عبارت «مدیران اجرایی که فرصت کمی برای مطالعه دارند» اضافه کن.',
        suggestedSnippet: `<audience>\nمدیران محصول و رهبران تیم‌های فنی با دانش پایه در حوزه هوش مصنوعی.\n</audience>`,
        relatedConcept: 'Audience Calibration & Lexical Density'
      });
    }

    // 7. Check Few-Shot Examples
    if (evaluation.breakdown.examplesScore === 0 && clean.length > 80) {
      issues.push({
        id: 'missing-examples',
        category: 'examples',
        severity: 'low',
        title: 'نمونه الگوی Few-Shot برای افزایش دقت اضافه نشده است',
        explanation: 'ارائه حتی یک مثال خوب (One-Shot Example) نرخ دقت و انطباق مدل با سبک مورد نظر شما را تا ۸۰ درصد ارتقا می‌دهد.',
        hint1: 'آیا می‌توانی یک نمونه ورودی و خروجی ایده‌آل به مدل نشان دهی؟',
        hint2: 'یک بلوک <example> برای سبک یا قالب مورد نظرت به پرامپت ضمیمه کن.',
        hint3: 'تگ <examples> با یک جفت <input> و <ideal_output> درون پرامپت بگنجان.',
        suggestedSnippet: `<examples>\n<example>\n<input>درخواست لغو اشتراک کاربر</input>\n<output>سلام، لغو انجام شد. تا پایان ماه سرویس فعال است.</output>\n</example>\n</examples>`,
        relatedConcept: 'In-Context Few-Shot Learning'
      });
    }

    const primaryIssue = issues[0] || null;
    const secondaryIssues = issues.slice(1);

    // Assess overall
    let overallAssessment = 'پرامپت شما پایه خوبی دارد اما نیاز به گاردریل‌های قوی‌تر و تگ‌گذاری استاندارد دارد.';
    let praise = 'دستور اصلی شما قابل درک است.';

    if (evaluation.totalScore >= 90) {
      overallAssessment = 'فوق‌العاده! پرامپت شما کاملاً مهندسی‌شده، دقیق و منطبق با متدولوژی استاندارد سیستم‌های هوش مصنوعی است.';
      praise = 'تمام ابعاد ۸ گانه شامل نقش، کانتکست، محدودیت‌ها و فرمت خروجی به شکل دقیق تعیین شده‌اند.';
    } else if (evaluation.totalScore >= 70) {
      overallAssessment = 'کیفیت پرامپت در سطح خوبی قرار دارد، اما برای تضمین عملکرد بی‌نقص در مقیاس صنعتی می‌توانید جزییات خروجی را شفاف‌تر کنید.';
      praise = 'هدف کلی و کانتکست به خوبی در پرامپت بیان شده است.';
    } else if (evaluation.totalScore < 45) {
      overallAssessment = 'پرامپت بسیار کلی است و مدل به دلیل نبود ساختار احتمالاً پاسخ‌های ناقص یا غیرقابل استفاده تولید خواهد کرد.';
      praise = 'ایده اولیه کار مشخص است و می‌توان آن را گسترش داد.';
    }

    // Build suggested prompt
    let suggested = clean;
    if (!evaluation.detectedComponents.hasRole) {
      suggested = `<role>\nشما یک متخصص ارشد و با تجربه در این حوزه هستید.\n</role>\n\n` + suggested;
    }
    if (evaluation.breakdown.constraintsScore === 0) {
      suggested += `\n\n<rules>\n- از کلی‌گویی و ارائه مقدمه بپرهیز.\n- اطلاعات را به صورت ساختاریافته و با بالاترین دقت ارائه کن.\n</rules>`;
    }
    if (evaluation.breakdown.outputScore === 0) {
      suggested += `\n\n<output_format>\nپاسخ را در قالب بخش‌های شماره‌گذاری‌شده با سرفصل‌های مشخص ارائه بده.\n</output_format>`;
    }

    return {
      overallAssessment,
      praise,
      primaryIssue,
      secondaryIssues,
      teachingPrinciple: primaryIssue 
        ? primaryIssue.relatedConcept 
        : 'SOTA Prompt Engineering Excellence',
      suggestedPrompt: suggested,
      score: evaluation.totalScore
    };
  }
}

export const defaultMentorProvider = new RuleBasedMentor();
