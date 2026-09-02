export interface EducationalInsight {
  id: string;
  title: string;
  source: string;
  sourceUrl?: string;
  category: 'Structure' | 'Context' | 'XML' | 'Evaluation' | 'Few-Shot';
  principleFa: string;
  principleEn: string;
  exampleSnippet: string;
  actionableTip: string;
}

export const EDUCATIONAL_INSIGHTS: EducationalInsight[] = [
  {
    id: 'ins-01',
    title: 'تگ‌های XML برای جداسازی ساختاری ورودی‌ها',
    source: 'Anthropic Prompt Engineering Interactive Guide',
    sourceUrl: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/use-xml-tags',
    category: 'XML',
    principleFa: 'مدل‌های هوش مصنوعی مانند Claude و GPT زمانی که داده‌های ورودی، دستورالعمل‌ها، و پرسونای مدل با تگ‌های معنادار مانند <instructions>, <context>, <data> احاطه شده باشند، دقت استنتاج بسیار بالاتری دارند و در برابر Prompt Injection مصون‌ترند.',
    principleEn: 'Use XML tags to structure prompts and clearly delineate separate sections.',
    exampleSnippet: `<context>\nداده‌های متنی گزارش فصلی شرکت...\n</context>\n\n<instructions>\nاین داده‌ها را تحلیل کن.\n</instructions>`,
    actionableTip: 'همیشه داده‌های نامطمئن کاربر یا متون طولانی را در یک تگ XML اختصاصی قرار دهید تا مدل آن را با دستور اشتباه نگیرد.'
  },
  {
    id: 'ins-02',
    title: 'ارائه نمونه‌های Few-Shot برای تثبیت الگوی خروجی',
    source: 'Anthropic Prompt Engineering Tutorial',
    category: 'Few-Shot',
    principleFa: 'به جای صرفاً توصیف فرمت خروجی، ۱ یا ۲ نمونه کامل از ورودی و خروجی ایده‌آل را در تگ <example> در اختیار مدل قرار دهید.',
    principleEn: 'Provide few-shot examples to show, not just tell, the desired format and style.',
    exampleSnippet: `<example>\nورودی: کاربر پیام لغو اشتراک داد.\nخروجی:\n{\n  "intent": "churn_risk",\n  "severity": "high"\n}\n</example>`,
    actionableTip: 'حتی یک نمونه کامل (One-shot) می‌تواند خطاهای ساختاری JSON را تا بیش از ۹۰٪ کاهش دهد.'
  },
  {
    id: 'ins-03',
    title: 'دادن زمان تفکر و استدلال به مدل (Think Step-by-Step / Chain of Thought)',
    source: 'Anthropic & Google DeepMind Research',
    category: 'Structure',
    principleFa: 'پیش از تولید پاسخ نهایی، از مدل بخواهید استدلال‌ها، فرضیات و گام‌های منطقی خود را در تگ <thinking> بنویسد.',
    principleEn: 'Give the model room to think before providing the final answer.',
    exampleSnippet: `پیش از نوشتن پاسخ، گام‌های منطقی و محاسبات خود را درون تگ <thinking>...</thinking> بنویسید و سپس پاسخ نهایی را در <answer> ارائه دهید.`,
    actionableTip: 'این روش خطای محاسبات منطقی و برنامه‌نویسی را به میزان چشمگیری کاهش می‌دهد.'
  },
  {
    id: 'ins-04',
    title: 'دستورالعمل‌های منفی شفاف و بدون ابهام (Clear Negative Constraints)',
    source: 'Anthropic Interactive Prompt Course',
    category: 'Context',
    principleFa: 'به جای گفتن «زیاد ننویس»، بگویید «پاسخ را به حداکثر ۳ بولت‌پوینت و کمتر از ۱۰۰ کلمه محدود کنید و از هرگونه مقدمه یا خوش‌آمدگویی بپرهیزید».',
    principleEn: 'Be specific about what NOT to do using explicit rules.',
    exampleSnippet: `<rules>\n- هرگز حدس نزنید؛ در صورت عدم وجود داده بنویسید "اطلاعات ناکافی است".\n- حداکثر ۳ خط برای هر پاراگراف.\n</rules>`,
    actionableTip: 'محدودیت‌ها را صریح، کمی و با مرزهای مشخص بیان کنید.'
  }
];
