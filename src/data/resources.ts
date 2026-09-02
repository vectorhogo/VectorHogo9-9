import { ResourceItem } from '../types';

export const CURATED_RESOURCES: ResourceItem[] = [
  // 1. مهندسی پرامپت
  {
    id: 'res-pe-01',
    title: 'مستندات رسمی مهندسی پرامپت کلود',
    englishTitle: 'Anthropic Claude Prompt Engineering Interactive Guide',
    source: 'Anthropic Platform',
    category: 'مهندسی پرامپت',
    difficulty: 'مقدماتی',
    shortDescription: 'راهنمای تعاملی و جامع رسمی آنتروپیک برای تسلط بر پرامپت‌نویسی، استفاده از تگ‌های XML و تکنیک‌های پیشرفته.',
    link: 'https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview',
    tags: ['Claude', 'XML Tags', 'Best Practices', 'System Prompts'],
    isOfficial: true
  },
  {
    id: 'res-pe-02',
    title: 'راهنمای مهندسی پرامپت OpenAI',
    englishTitle: 'OpenAI Official Prompt Engineering Guide',
    source: 'OpenAI Docs',
    category: 'مهندسی پرامپت',
    difficulty: 'مقدماتی',
    shortDescription: 'اصول ۶ گانه OpenAI برای بهبود عملکرد GPT-4o و مدل‌های سری o1 شامل استراتژی‌های کانتکست و زمان تفکر.',
    link: 'https://platform.openai.com/docs/guides/prompt-engineering',
    tags: ['GPT-4o', 'Reasoning', 'OpenAI', 'Zero-Shot'],
    isOfficial: true
  },
  {
    id: 'res-pe-03',
    title: 'راهنمای جامع LearnPrompting.org',
    englishTitle: 'LearnPrompting Full Curriculum',
    source: 'LearnPrompting',
    category: 'مهندسی پرامپت',
    difficulty: 'متوسط',
    shortDescription: 'دایره‌المعارف بازمتن تکنیک‌های پرامپتینگ از مبانی تا تکنیک‌های پیچیده آکادمیک و ایمنی هوش مصنوعی.',
    link: 'https://learnprompting.org/',
    tags: ['Open Source', 'Comprehensive', 'Academic', 'Techniques']
  },

  // 2. مبانی هوش مصنوعی
  {
    id: 'res-ai-01',
    title: 'دوره جامع هوش مصنوعی برای همه',
    englishTitle: 'AI for Everyone by Andrew Ng',
    source: 'DeepLearning.AI',
    category: 'مبانی هوش مصنوعی',
    difficulty: 'مقدماتی',
    shortDescription: 'دوره مشهور پروفسور اندرو ان‌جی برای درک شهودی مفاهیم یادگیری ماشین، هوش مصنوعی مولد و اثرات تجاری آن.',
    link: 'https://www.deeplearning.ai/courses/ai-for-everyone/',
    tags: ['Andrew Ng', 'Foundations', 'Business AI']
  },
  {
    id: 'res-ai-02',
    title: 'مقدمه‌ای بر مدل‌های ترنسفورمر',
    englishTitle: 'Transformers Explained Visual Guide',
    source: 'Jay Alammar Blog',
    category: 'مبانی هوش مصنوعی',
    difficulty: 'متوسط',
    shortDescription: 'تصویرسازی‌های فوق‌العاده و شهودی از نحوه کارکرد معماری ترنسفورمر، مکانیزم Self-Attention و توکن‌ها.',
    link: 'https://jalammar.github.io/illustrated-transformer/',
    tags: ['Architecture', 'Attention Mechanism', 'Visual Learning']
  },

  // 3. مدل‌های زبانی بزرگ (LLMs)
  {
    id: 'res-llm-01',
    title: 'دوره توسعه کاربردهای مبتنی بر LLM با LangChain',
    englishTitle: 'LangChain for LLM Application Development',
    source: 'DeepLearning.AI',
    category: 'مدل‌های زبانی بزرگ',
    difficulty: 'متوسط',
    shortDescription: 'آموزش اتصال مدل‌های زبانی به حافظه، زنجیره‌ها و پایگاه‌های داده وکتوری.',
    link: 'https://www.deeplearning.ai/short-courses/langchain-for-llm-application-development/',
    tags: ['LangChain', 'Vector DB', 'Chains', 'Embeddings']
  },
  {
    id: 'res-llm-02',
    title: 'کاغذ پژوهشی توجه تنها چیزی است که نیاز دارید',
    englishTitle: 'Attention Is All You Need (Original Paper)',
    source: 'Google Research (arXiv)',
    category: 'مدل‌های زبانی بزرگ',
    difficulty: 'پیشرفته',
    shortDescription: 'مقاله انقلابی سال ۲۰۱۷ محققان گوگل که پایه و اساس تمامی مدل‌های زبانی امروزی را بنا نهاد.',
    link: 'https://arxiv.org/abs/1706.03762',
    tags: ['Research Paper', 'Foundational', 'Google Research']
  },

  // 4. مهندسی کانتکست (Context Engineering)
  {
    id: 'res-ctx-01',
    title: 'معماری و تکنیک‌های پیشرفته RAG',
    englishTitle: 'Advanced RAG Techniques & Context Management',
    source: 'LlamaIndex Docs',
    category: 'مهندسی کانتکست',
    difficulty: 'پیشرفته',
    shortDescription: 'راهکارهای قطعه‌بندی اسناد (Chunking)، بازرتبه‌بندی (Re-ranking) و اتصال بهینه‌ترین متن به پرامپت.',
    link: 'https://docs.llamaindex.ai/en/stable/optimizing/advanced_retrieval/advanced_rag/',
    tags: ['RAG', 'Chunking', 'Re-ranking', 'Context Window']
  },
  {
    id: 'res-ctx-02',
    title: 'تحلیل پدیده Lost in the Middle در کانتکست‌های طولانی',
    englishTitle: 'Lost in the Middle: How Language Models Use Long Contexts',
    source: 'Stanford University (arXiv)',
    category: 'مهندسی کانتکست',
    difficulty: 'پیشرفته',
    shortDescription: 'پژوهش استنفورد درباره میزان دقت مدل‌ها در ابتدا، میانه و انتهای متون طولانی و راهکارهای غلبه بر آن.',
    link: 'https://arxiv.org/abs/2307.03172',
    tags: ['Stanford', 'Attention Bias', 'Context Strategy']
  },

  // 5. ایجنت‌های هوشمند (AI Agents)
  {
    id: 'res-agent-01',
    title: 'معماری ایجنت‌های خودمختار با LangGraph',
    englishTitle: 'Building Reliable Multi-Agent Systems with LangGraph',
    source: 'LangChain Official',
    category: 'ایجنت‌های هوشمند',
    difficulty: 'حرفه‌ای',
    shortDescription: 'طراحی عامل‌های هوشمند چندگانه با قابلیت کنترل حالت (Stateful Graph)، چرخه‌های تصمیم‌گیری و تایید انسانی.',
    link: 'https://langchain-ai.github.io/langgraph/',
    tags: ['Agents', 'Multi-Agent', 'State Machine', 'Graph AI']
  },
  {
    id: 'res-agent-02',
    title: 'مقاله ReAct: استدلال و اقدام هماهنگ در مدل‌های زبانی',
    englishTitle: 'ReAct: Synergizing Reasoning and Acting in Language Models',
    source: 'Princeton University & Google',
    category: 'ایجنت‌های هوشمند',
    difficulty: 'پیشرفته',
    shortDescription: 'مقاله علمی تشریح الگوی تفکر قبل از اقدام در چرخه‌های ابزارمحور هوش مصنوعی.',
    link: 'https://arxiv.org/abs/2210.03629',
    tags: ['ReAct', 'Tool Calling', 'Princeton']
  },

  // 6. ارزیابی پرامپت (Prompt Evaluation)
  {
    id: 'res-eval-01',
    title: 'چارچوب ارزیابی و بنچمارک Ragas برای سامانه‌های RAG',
    englishTitle: 'Ragas: Evaluation Framework for LLM Pipelines',
    source: 'Ragas Official',
    category: 'ارزیابی پرامپت',
    difficulty: 'پیشرفته',
    shortDescription: 'ابزار سنجش علمی شاخص‌های Faithfulness، Answer Relevance و Context Recall در پایپ‌لاین‌های هوش مصنوعی.',
    link: 'https://docs.ragas.io/',
    tags: ['Benchmarking', 'Evals', 'Metrics', 'Faithfulness']
  },
  {
    id: 'res-eval-02',
    title: 'راهنمای LLM-as-a-Judge توسط LMSYS',
    englishTitle: 'Judging LLM-as-a-Judge with MT-Bench & Chatbot Arena',
    source: 'LMSYS Org',
    category: 'ارزیابی پرامپت',
    difficulty: 'حرفه‌ای',
    shortDescription: 'تحلیل سوگیری‌های داوری هوش مصنوعی و طراحی روبریک‌های کالیبره‌شده برای مقایسه مدل‌ها.',
    link: 'https://chat.lmsys.org/',
    tags: ['LMSYS', 'Chatbot Arena', 'Evaluation Rubrics']
  },

  // 7. کدنویسی با AI (AI Coding)
  {
    id: 'res-code-01',
    title: 'راهنمای توسعه پرامپت‌های توسعه نرم‌افزار در کلسور (Cursor Rules)',
    englishTitle: 'Cursor Rules & System Prompt Architecture for Developers',
    source: 'Cursor Directory',
    category: 'کدنویسی با AI',
    difficulty: 'متوسط',
    shortDescription: 'مجموعه‌ای از پرامپت‌های سیستم برای ساخت کدهای بهینه با هوش مصنوعی در IDEها.',
    link: 'https://cursor.directory/',
    tags: ['Cursor', 'Developer Prompts', 'IDE Rules']
  },

  // 8. تولید تصویر با AI (AI Image Generation)
  {
    id: 'res-img-01',
    title: 'راهنمای پرامپت‌نویسی حرفه‌ای Midjourney & Imagen',
    englishTitle: 'Advanced Image Prompting & Lighting Formulas',
    source: 'Midjourney Docs',
    category: 'تولید تصویر با AI',
    difficulty: 'مقدماتی',
    shortDescription: 'فرمول‌های توصیف لنز دوربین، نورپردازی استودیویی، متریال، بافت و سبک‌های هنری در مدل‌های تولید تصویر.',
    link: 'https://docs.midjourney.com/',
    tags: ['Midjourney', 'Lighting', 'Camera Angles', 'Styles']
  },

  // 9. اتوماسیون با AI (AI Automation)
  {
    id: 'res-auto-01',
    title: 'اتصال پرامپت‌های LLM به ابزارهای خودکارسازی با Make و n8n',
    englishTitle: 'AI Workflow Automation Guide with n8n & Webhooks',
    source: 'n8n Community',
    category: 'اتوماسیون با AI',
    difficulty: 'متوسط',
    shortDescription: 'طراحی پایپ‌لاین‌های خودکار بدون کدنویسی جهت اتصال پرامپت‌های هوش مصنوعی به ایمیل، CRM و پایگاه‌های داده.',
    link: 'https://n8n.io/',
    tags: ['n8n', 'No-Code', 'Automation', 'Workflows']
  }
];
