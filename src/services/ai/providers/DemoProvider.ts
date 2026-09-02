import { AIProvider, ModelOption, GenerateParams, GenerateResult } from '../types';
import { calculateTechnicalMetrics } from '../metricsEngine';

export class DemoProvider implements AIProvider {
  id = 'demo' as const;
  name = 'حالت نمایشی آموزشی (Demo Mode)';
  englishName = 'Educational Demo Provider';
  status = 'demo' as const;
  statusMessageFa = 'حالت شبیه‌سازی هوشمند — بدون نیاز به کلید API و کاملاً پایدار برای تمرین';

  getModels(): ModelOption[] {
    return [
      {
        id: 'demo-claude-3-7',
        name: 'Claude 3.7 Sonnet (شبیه‌ساز Anthropic)',
        providerId: 'demo',
        providerName: 'Anthropic Simulation',
        version: '3.7-Sonnet',
        description: 'تسلط بی‌نظیر بر تگ‌های XML، استنتاج عمیق، پایبندی دقیق به چارچوب‌ها و قالب‌های ساختاری پیچیده.',
        contextWindow: '200K Tokens',
        badge: 'توصیه‌شده برای پرامپت ساختاریافته',
        status: 'demo',
        capabilities: {
          systemPrompt: true,
          streaming: true,
          temperature: true,
          maxTokens: true,
          jsonMode: true
        },
        specialtyFa: 'ساختاربندی XML و استدلال گام‌به‌گام'
      },
      {
        id: 'demo-gpt-4o',
        name: 'GPT-4o (شبیه‌ساز OpenAI)',
        providerId: 'demo',
        providerName: 'OpenAI Simulation',
        version: 'Omni-2024',
        description: 'پاسخ‌های صریح، کاربردی و سریع، عملکرد عالی در خلاصه‌سازی و انجام تسک‌های مستقیم تجاری.',
        contextWindow: '128K Tokens',
        badge: 'توصیه‌شده برای تسک‌های مستقیم',
        status: 'demo',
        capabilities: {
          systemPrompt: true,
          streaming: true,
          temperature: true,
          maxTokens: true,
          jsonMode: true
        },
        specialtyFa: 'پاسخ‌دهی سریع، لحن قاطع و عملیاتی'
      },
      {
        id: 'demo-gemini-2-5',
        name: 'Gemini 2.5 Flash (شبیه‌ساز Google)',
        providerId: 'demo',
        providerName: 'Google Simulation',
        version: '2.5-Flash',
        description: 'پردازش فوق‌سریع، پوشش چندوجهی اطلاعات و توانایی تحلیلی بالا در استخراج نکات کلیدی.',
        contextWindow: '1M Tokens',
        badge: 'کانتکست وسیع و پردازش سریع',
        status: 'demo',
        capabilities: {
          systemPrompt: true,
          streaming: true,
          temperature: true,
          maxTokens: true,
          jsonMode: true
        },
        specialtyFa: 'کانتکست بزرگ و دسته‌بندی موضوعی'
      },
      {
        id: 'demo-deepseek-r1',
        name: 'DeepSeek R1 (شبیه‌ساز Reasoning)',
        providerId: 'demo',
        providerName: 'DeepSeek Simulation',
        version: 'R1-Reasoning',
        description: 'نمایش فرآیند استنتاج داخلی و فکر کردن عمیق قبل از ارائه پاسخ نهایی.',
        contextWindow: '64K Tokens',
        badge: 'تفکر استدلالی و زنجیره منطقی',
        status: 'demo',
        capabilities: {
          systemPrompt: true,
          streaming: true,
          temperature: true,
          maxTokens: true,
          jsonMode: true
        },
        specialtyFa: 'استنتاج زنجیره‌ای و حل مسائل منطقی'
      }
    ];
  }

  validateConfiguration(): { valid: boolean; message?: string } {
    return {
      valid: true,
      message: 'حالت دمو همیشه فعال و آماده تست است.'
    };
  }

  async generate(params: GenerateParams): Promise<GenerateResult> {
    const startTime = Date.now();
    const { systemPrompt = '', userPrompt, modelId, temperature = 0.7, onChunk, signal } = params;

    // Generate realistic tailored text response based on modelId & prompt characteristics
    const responseText = this.synthesizeResponse(systemPrompt, userPrompt, modelId, temperature);

    // Simulate streaming if onChunk is provided
    if (onChunk) {
      const chunks = this.tokenizeTextForStreaming(responseText);
      let accumulated = '';
      
      for (let i = 0; i < chunks.length; i++) {
        if (signal?.aborted) {
          throw new Error('درخواست توسط کاربر لغو شد.');
        }

        const chunk = chunks[i];
        accumulated += chunk;
        onChunk(chunk, accumulated);

        // Realistic delay based on model characteristics (Flash is faster, Reasoning is slower)
        const delay = modelId.includes('flash') ? 12 : modelId.includes('r1') ? 28 : 20;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    const durationMs = Date.now() - startTime;
    const fullPrompt = `${systemPrompt}\n\n${userPrompt}`.trim();
    const metrics = calculateTechnicalMetrics(fullPrompt, responseText, durationMs);

    return {
      text: responseText,
      modelId,
      providerId: this.id,
      durationMs,
      usage: metrics.estimatedTokens,
      metrics,
      isDemo: true
    };
  }

  private tokenizeTextForStreaming(text: string): string[] {
    // Split text into small readable chunks (1-3 words)
    const tokens: string[] = [];
    const regex = /(\s+|[^\s]+)/g;
    let match;
    let buffer = '';

    while ((match = regex.exec(text)) !== null) {
      buffer += match[0];
      if (buffer.length >= 6 || match[0].includes('\n')) {
        tokens.push(buffer);
        buffer = '';
      }
    }
    if (buffer) {
      tokens.push(buffer);
    }
    return tokens;
  }

  private synthesizeResponse(
    systemPrompt: string,
    userPrompt: string,
    modelId: string,
    temperature: number
  ): string {
    const combined = `${systemPrompt} ${userPrompt}`.toLowerCase();
    const isVaguePrompt = userPrompt.trim().split(/\s+/).length <= 5 && !userPrompt.includes('<') && !systemPrompt;
    
    // Check specific requests in prompt
    const wantsJson = combined.includes('json') || combined.includes('فرمت json') || combined.includes('{');
    const wantsTable = combined.includes('table') || combined.includes('جدول') || combined.includes('ستون');
    const wantsCode = combined.includes('code') || combined.includes('کد') || combined.includes('تابع') || combined.includes('python') || combined.includes('typescript');
    const hasXmlTags = /<\/?[a-zA-Z_][a-zA-Z0-9_-]*>/.test(userPrompt) || /<\/?[a-zA-Z_][a-zA-Z0-9_-]*>/.test(systemPrompt);
    const hasFewShot = combined.includes('مثال') || combined.includes('example') || combined.includes('ورودی:') || combined.includes('input:');
    const hasNegativeConstraint = combined.includes('نباید') || combined.includes('بدون') || combined.includes('خودداری') || combined.includes('never') || combined.includes('do not');

    // 1. If vague/short prompt, return a typical generic response showing the weakness of un-engineered prompts
    if (isVaguePrompt) {
      if (modelId.includes('claude')) {
        return `در پاسخ به درخواست کلی شما:

برای ارائه بهترین پاسخ، این موضوع دارای جنبه‌های مختلفی است:
1. بررسی اهداف و نیازمندی‌های اصلی
2. انتخاب استراتژی مناسب بر اساس اولویت‌ها
3. پیاده‌سازی گام‌به‌گام و ارزیابی نتایج

*نکته آموزشی دمو:* از آنجا که پرامپت فاقد کانتکست، نقش و فرمت مشخص بود، مدل پاسخی کلی ارائه داد. با افزودن جزئیات یا تگ‌های XML می‌توانید خروجی را دقیقاً مطابق انتظار تنظیم کنید.`;
      } else if (modelId.includes('gpt')) {
        return `سلام! برای پاسخ به این موضوع، مراحل اصلی به شرح زیر است:

• تعریف شفاف صورت مسئله
• جمع‌آوری اطلاعات و داده‌های لازم
• تدوین برنامه اجرایی و زمان‌بندی
• بازبینی و بهینه‌سازی نهایی

اگر نیاز به جزئیات بیشتری دارید، بفرمایید تا بررسی کنیم.`;
      } else if (modelId.includes('r1')) {
        return `<think>
کاربر درخواست بسیار کوتاهی ارائه داده است. کانتکست، جامعه هدف و خروجی مشخص نیست. باید پاسخی کلی اما منطقی و ساختاریافته ارائه دهم.
</think>

به عنوان یک پاسخ اولیه:
موضوع مدنظر شما نیازمند تعیین دقیق پارامترهای ورودی و چارچوب است. اصول پایه شامل شناخت مسئله، طراحی فرآیند و تست خروجی می‌باشد.`;
      } else {
        return `موضوع مطرح‌شده شامل ابعاد مختلفی است:
- شناخت مفاهیم پایه
- تعیین استراتژی اجرا
- مدیریت چالش‌ها و بهبود مستمر`;
      }
    }

    // 2. Specific JSON request
    if (wantsJson) {
      if (modelId.includes('claude')) {
        return `\`\`\`json
{
  "status": "success",
  "generated_by": "Claude 3.7 Sonnet (Demo)",
  "metadata": {
    "structured": true,
    "confidence_score": 0.98,
    "has_constraints_applied": ${hasNegativeConstraint}
  },
  "data": {
    "analysis_summary": "تحلیل ساختاریافته مطابق با درخواست پرامپت",
    "key_findings": [
      "رعایت دقیق نوع داده‌ها و فرمت کلیدها",
      "اعتبارسنجی تمام قیود مطرح‌شده در ورودی",
      "پرهیز از حاشیه‌پردازی و ارائه خروجی تمیز"
    ],
    "action_items": [
      {
        "priority": "HIGH",
        "action": "پیاده‌سازی گام اول با نظارت مستقیم",
        "impact_metric": "+24%"
      },
      {
        "priority": "MEDIUM",
        "action": "پایش شاخص‌های عملکردی دوره فصلی",
        "impact_metric": "+15%"
      }
    ]
  }
}
\`\`\``;
      } else if (modelId.includes('gpt')) {
        return `\`\`\`json
{
  "result": "success",
  "model": "GPT-4o",
  "items": [
    {
      "title": "مورد اول",
      "description": "پاسخ مستقیم و بهینه به درخواست ورودی",
      "priority": 1
    },
    {
      "title": "مورد دوم",
      "description": "تطبیق با قواعد اعلام‌شده در پرامپت",
      "priority": 2
    }
  ],
  "totalCount": 2
}
\`\`\``;
      } else {
        return `\`\`\`json
{
  "engine": "Gemini 2.5 Flash",
  "categories": {
    "overview": "خلاصه پردازش در ساختار JSON استاندارد",
    "metrics": {
      "execution_speed": "ultra_fast",
      "precision": "high"
    }
  }
}
\`\`\``;
      }
    }

    // 3. Table / Comparison request
    if (wantsTable) {
      if (modelId.includes('claude')) {
        return `بر اساس ساختار درخواستی و تحلیل داده‌های ورودی، جدول زیر تدوین شده است:

| شاخص / مؤلفه | وضعیت فعلی | هدف‌گذاری بهبود | نرخ رشد / تغییر | اولویت اقدام |
| :--- | :--- | :--- | :--- | :---: |
| **دقت ساختاری پرامپت** | ۶۵٪ (متوسط) | ۹۲٪ (حرفه‌ای) | +۲۷٪ | 🔴 فوری |
| **کنترل توهم (Hallucination)** | متوسط | صفر با Grounding | +۴۰٪ | 🔴 فوری |
| **بهینه‌سازی مصرف توکن** | ۱,۴۰۰ توکن | ۶۲۰ توکن | -۵۵٪ | 🟡 متوسط |
| **یکنواختی خروجی چندباره** | متغیر | ۱۰۰٪ پایدار با XML | +۳۵٪ | 🟢 مطلوب |

### نکات تکمیلی
- استفاده از تگ‌های ساختاریافته، تکرارپذیری جدول بالا را در اجرای چندباره تضمین می‌کند.
- برای تثبیت فرمت، ستون‌های مدنظر را به عنوان قالب پیش‌فرض در تگ \`<output_format>\` تعریف نمایید.`;
      } else {
        return `| ردیف | فاکتور ارزیابی | نتیجه بررسی | پیشنهاد عملی |
| :---: | :--- | :--- | :--- |
| ۱ | وضوح دستورالعمل | عالی | ادامه روند فعلی |
| ۲ | رعایت محدودیت‌ها | کامل | حفظ قیود منفی |
| ۳ | فرمت‌بندی خروجی | جدول استاندارد Markdown | تایید نهایی |`;
      }
    }

    // 4. Code request
    if (wantsCode) {
      return `\`\`\`typescript
/**
 * پیاده‌سازی ماژولار بر اساس اصول مهندسی پرامپت
 */
export interface EvaluationResult {
  score: number;
  isCompliant: boolean;
  insights: string[];
}

export function evaluatePromptOutput(input: string, criteria: string[]): EvaluationResult {
  const isCompliant = criteria.every(c => input.includes(c));
  const score = isCompliant ? 95 : 60;

  return {
    score,
    isCompliant,
    insights: [
      'تطبیق کامل با تمام قواعد تعریف شده',
      'سرعت پاسخ‌دهی در محدوده مجاز'
    ]
  };
}
\`\`\`

**توضیح فنی:**
این تابع ابتدا کلیه معیارهای ارزیابی را بررسی کرده و بر اساس آن امتیاز و وضعیت تطابق را برمی‌گرداند.`;
    }

    // 5. General Rich / Engineered Prompt (Claude Flavor)
    if (modelId.includes('claude')) {
      return `### تحلیل تخصصی و پاسخ ساختاریافته

با توجه به چارچوب تعریف‌شده${hasXmlTags ? ' و تفکیک اجزا در تگ‌های ورودی' : ''}، پاسخ به شرح زیر ارائه می‌گردد:

#### ۱. بررسی بنیادین و کانتکست
${hasXmlTags ? '- تگ‌های ساختاری ورودی پردازش شدند و نقش تخصصی اعمال گردید.' : '- نقش و اهداف تعیین‌شده مورد ارزیابی قرار گرفت.'}
- اولویت‌های اجرایی بر اساس بیشترین تاثیرگذاری و پایداری تفکیک شده‌اند.

#### ۲. راهکارهای کلیدی و اجرایی
1. **طراحی معماری محتوا:** اعمال قواعد شفاف برای جلوگیری از پاسخ‌های کلیشه‌ای و مبهم.
2. **اعمال قیود سلبی (Negative Constraints):** ${hasNegativeConstraint ? 'قید عدم حاشیه‌پردازی کاملاً رعایت شده است.' : 'جلوگیری از تولید محتوای زائد با تعیین صریح مرزهای پاسخ.'}
3. **بهینه‌سازی قالب‌بندی:** ارائه داده‌ها در قالب بخش‌های تیتربندی‌شده با تمرکز بر سهولت اسکن چشمی.

#### ۳. شاخص‌های موفقیت (Success Metrics)
- **دقت استنتاج:** بالا و عاری از ادعاهای تاییدنشده
- **انطباق با درخواست کاربر:** ۱۰۰٪ منطبق بر هدف اصلی

*نتیجه‌گیری:* مدل Claude در مواجهه با پرامپت‌های تفکیک‌شده (Modular)، ساختار منطقی عمیق‌تری تولید می‌کند.`;
    }

    // 6. GPT-4o Flavor
    if (modelId.includes('gpt')) {
      return `در پاسخ مستقیم و کاربردی به درخواست شما:

**خلاصه اجرایی:**
هدف اصلی شما با تمرکز بر بازدهی حداکثری و شفافیت در ۳ گام زیر پیاده‌سازی می‌شود:

1. **گام اول — تثبیت نیازمندی‌ها:** مشخص کردن ورودی‌های کلیدی و حذف موارد حاشیه‌ای.
2. **گام دوم — اجرا و پیاده‌سازی:** اعمال مستقیم تغییرات و استقرار چارچوب بهینه.
3. **گام سوم — کنترل کیفیت:** بازبینی نهایی خروجی در برابر استانداردهای مشخص شده.

**نکات کلیدی:**
• رویکرد متمرکز بر سرعت و کارایی
• تضمین کیفیت خروجی با رعایت تمام قیود اعلام شده
• قابلیت تعمیم به سناریوهای مشابه`;
    }

    // 7. DeepSeek R1 Flavor (with Chain of Thought)
    if (modelId.includes('r1')) {
      return `<think>
بررسی ورودی:
- کاربر درخواست تحلیل و ارائه پاسخ را دارد.
- نقش یا کانتکست مشخص است.
- باید ابتدا ابعاد موضوع را تحلیل کنم و سپس یک چارچوب منطقی و بدون ابهام ارائه دهم.
- فرآیند فکری: تفکیک مسئله -> بررسی راهکارها -> نتیجه‌گیری کاربردی.
</think>

### پاسخ منطقی و استدلالی:

پس از پردازش گام‌به‌گام مسئله، خروجی به شکل زیر تدوین شده است:

**تحلیل استنتاجی:**
اصلی‌ترین دلیل موفقیت این فرآیند، تعریف دقیق زنجیره منطقی (Chain-of-Thought) در طراحی اولیه است.

**نتایج به‌دست‌آمده:**
- ابهام‌زدایی کامل از مسیر اجرا
- تفکیک علت و معلول در تحلیل نتایج
- دستیابی به ثبات بالا در اجراهای متوالی`;
    }

    // 8. Gemini 2.5 Flash Flavor
    return `### جمع‌بندی تحلیلی (Google Gemini 2.5 Flash)

⚡ **دیدگاه چندجانبه به موضوع:**

- **از منظر فنی:** رعایت بهینگی پردازش و ساختاربندی تمیز داده‌ها.
- **از منظر کاربری:** وضوح حداکثری، سادگی در فهم و خوانایی بالا.
- **از منظر یادگیری:** امکان مقایسه آنی با سایر مدل‌ها و مشاهده تفاوت سبک پاسخ‌دهی.

**توصیه آزمایشگاه پرامپت:**
برای مقایسه عملکرد، همین پرامپت را روی مدل‌های دیگر آزمایش کنید تا تفاوت لحن، عمق و قالب‌بندی را از نزدیک لمس نمایید.`;
  }
}
