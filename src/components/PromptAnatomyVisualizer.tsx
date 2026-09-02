import React, { useState } from 'react';
import { 
  UserCheck, 
  Layers, 
  Target, 
  ShieldAlert, 
  FileCode2, 
  LayoutTemplate, 
  CheckCircle2, 
  Sparkles, 
  Copy, 
  Check, 
  ArrowLeft,
  ChevronDown
} from 'lucide-react';
import { AnatomyBlock, AnatomyBlockId } from '../types';

export const ANATOMY_BLOCKS_DATA: AnatomyBlock[] = [
  {
    id: 'role',
    label: 'نقش و پرسونا',
    englishLabel: 'ROLE & PERSONA',
    whatIsIt: 'تعیین هویت تخصصی، تخصص حرفه‌ای و موضع فکری مدل هوش مصنوعی در پاسخگویی.',
    whyItMatters: 'پاسخ مدل را متمرکز بر اصطلاحات، استانداردها و سطح تجربه آن حوزه خاص می‌کند و از پاسخ‌های عمومی و سطحی جلوگیری می‌کند.',
    whenToUse: 'زمانی که نیازمند تحلیل فنی، ادبیات کاری ویژه، یا سطح تصمیم‌گیری ارشد هستید.',
    example: 'شما یک معمار ارشد سیستم‌های ابری با ۱۰ سال سابقه در طراحی زیرساخت‌های با دسترسی بالا (High Availability) هستید.',
    tag: 'هویت پاسخ‌دهنده'
  },
  {
    id: 'context',
    label: 'زمینه و بستر',
    englishLabel: 'CONTEXT & BACKGROUND',
    whatIsIt: 'شرح شرایط مساله، اطلاعات پیش‌نیاز، محدودیت‌های کسب‌وکار و اهداف پنهان پشت درخواست.',
    whyItMatters: 'بدون بستر مناسب، مدل فرضیات غلط می‌سازد و راه‌حل‌های غیرعملیاتی پیشنهاد می‌دهد.',
    whenToUse: 'همیشه! هر زمان که درخواست شما وابسته به شرایط خاص تجاری، سازمانی یا فنی است.',
    example: 'ما یک پلتفرم فروشگاهی B2B داریم که ماهانه ۱۰ هزار تراکنش را پردازش می‌کند و قصد داریم زمان پاسخگویی API را از ۸۰۰ms به کمتر از ۲۰۰ms برسانیم.',
    tag: 'محیط تصمیم‌گیری'
  },
  {
    id: 'task',
    label: 'وظیفه و دستور اصلی',
    englishLabel: 'TASK & INSTRUCTION',
    whatIsIt: 'کاری که مدل باید صریحاً و بدون ابهام انجام دهد (با افعال کنشی مشخص).',
    whyItMatters: 'هسته اصلی پرامپت است و جهت‌گیری کل فرآیند تفکر مدل را مشخص می‌کند.',
    whenToUse: 'در تمامی پرامپت‌ها بدون استثنا.',
    example: 'سه استراتژی اصلی برای بهینه‌سازی کوئری‌های پایگاه داده PostgreSQL و کش‌گذاری لایه کاربردی با Redis پیشنهاد دهید.',
    tag: 'اکشن اصلی'
  },
  {
    id: 'constraints',
    label: 'محدودیت‌ها و قوانین',
    englishLabel: 'CONSTRAINTS & RULES',
    whatIsIt: 'مرزهای پاسخگویی، کارهایی که مدل نباید انجام دهد، و سقف طول یا تکنولوژی‌های ممنوع.',
    whyItMatters: 'کیفیت و کنترل‌پذیری خروجی را تضمین می‌کند و مانع رفتارهای ناخواسته یا زیاده‌گویی می‌شود.',
    whenToUse: 'هنگام نیاز به پاسخ‌های خلاصه، بدون تعارفات، بدون استفاده از ابزارهای خاص، یا در فرمت‌های مقید.',
    example: '۱. از پیشنهاد تغییر دیتابیس خودداری کنید.\n۲. متن مقدماتی و تعارفات معمول ننویسید.\n۳. حداکثر در ۳۵۰ کلمه توضیح دهید.',
    tag: 'خطوط قرمز'
  },
  {
    id: 'examples',
    label: 'نمونه‌ها (Few-Shot)',
    englishLabel: 'EXAMPLES & FEW-SHOT',
    whatIsIt: 'ارائه یک یا چند جفت ورودی/خروجی نمونه به عنوان الگوی ذهنی برای مدل.',
    whyItMatters: 'قدرتمندترین روش برای تثبیت سبک، نحوه تفکر و فرمت دقیق خروجی است.',
    whenToUse: 'هنگام دسته‌بندی داده‌ها، استخراج اطلاعات پیچیده، یا رعایت الگوهای دشوار ساختاری.',
    example: 'مثال:\nورودی: زمان لود صفحه محصول ۳ ثانیه است.\nخروجی: [اولویت: بالا] -> پیشنهاد: فشرده‌سازی تصاویر WebP و CDN.',
    tag: 'الگوی یادگیری'
  },
  {
    id: 'output_format',
    label: 'فرمت و ساختار خروجی',
    englishLabel: 'OUTPUT FORMAT',
    whatIsIt: 'مشخص کردن قالب نهایی پاسخ (JSON، جدول، مارک‌داون، لیست نشانه‌دار، کد یا تگ‌های XML).',
    whyItMatters: 'امکان اتصال مستقیم خروجی به برنامه‌ها و سیستم‌های نرم‌افزاری را بدون نیاز به پردازش دستی فراهم می‌کند.',
    whenToUse: 'هر زمان که خروجی باید تمیز، ساختاریافته یا قابل پردازش خودکار باشد.',
    example: 'خروجی را منحصراً در قالب یک جدول ۳ ستونه Markdown شامل [نام روش | میزان اثر | پیچیدگی پیاده‌سازی] ارائه دهید.',
    tag: 'قالب‌بندی'
  },
  {
    id: 'success_criteria',
    label: 'معیار موفقیت و سنجش',
    englishLabel: 'SUCCESS CRITERIA',
    whatIsIt: 'شاخص‌هایی که مدل باید قبل از نهایی کردن پاسخ خود را با آنها ارزیابی کند.',
    whyItMatters: 'باعث تحریک فرآیند خوداصلاحی (Self-Correction) در مدل‌های زبانی می‌شود.',
    whenToUse: 'در پرامپت‌های پیچیده، استراتژیک، کدنویسی، یا وظایف چندمرحله‌ای حساس.',
    example: 'پاسخ موفق باید کاملاً قابل پیاده‌سازی در نسخه‌های فعلی باشد، نیاز به دان‌تایم نداشته باشد، و ریسک امنیت داده را صفر نگه دارد.',
    tag: 'سنجش کیفیت'
  }
];

interface PromptAnatomyVisualizerProps {
  initialBlockId?: AnatomyBlockId;
  onSelectBlock?: (blockId: AnatomyBlockId) => void;
  compact?: boolean;
}

export const PromptAnatomyVisualizer: React.FC<PromptAnatomyVisualizerProps> = ({
  initialBlockId = 'role',
  onSelectBlock,
  compact = false
}) => {
  const [activeBlockId, setActiveBlockId] = useState<AnatomyBlockId>(initialBlockId);
  const [copied, setCopied] = useState(false);

  const activeBlock = ANATOMY_BLOCKS_DATA.find((b) => b.id === activeBlockId) || ANATOMY_BLOCKS_DATA[0];

  const handleSelect = (id: AnatomyBlockId) => {
    setActiveBlockId(id);
    if (onSelectBlock) onSelectBlock(id);
  };

  const handleCopyExample = () => {
    navigator.clipboard.writeText(activeBlock.example);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getIcon = (id: AnatomyBlockId) => {
    switch (id) {
      case 'role': return <UserCheck className="w-4 h-4" />;
      case 'context': return <Layers className="w-4 h-4" />;
      case 'task': return <Target className="w-4 h-4" />;
      case 'constraints': return <ShieldAlert className="w-4 h-4" />;
      case 'examples': return <FileCode2 className="w-4 h-4" />;
      case 'output_format': return <LayoutTemplate className="w-4 h-4" />;
      case 'success_criteria': return <CheckCircle2 className="w-4 h-4" />;
    }
  };

  return (
    <div className="rounded-3xl bg-[#141414] border border-white/5 p-5 sm:p-7 space-y-6 shadow-xl relative overflow-hidden">
      {/* Subtle top RGB glow bar */}
      <div className="absolute top-0 right-0 left-0 h-[2px] bg-gradient-to-r from-cyan-400 via-violet-500 to-purple-500 opacity-60" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-400/10 text-cyan-300 border border-cyan-400/30">
              آناتومی تعاملی
            </span>
            <h3 className="font-bold text-white text-base sm:text-lg">
              بلوک‌های ساختاری یک پرامپت استاندارد (Prompt Anatomy)
            </h3>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            روی هر یک از ۷ ارکان کلیدی کلیک کنید تا کاربرد، چرایی و نمونه عملی آن را بررسی نمایید.
          </p>
        </div>

        <span className="text-[11px] font-mono text-gray-500 self-start sm:self-auto">
          ۷ رکن بنیادین
        </span>
      </div>

      {/* Interactive Flow Bar / Pipeline Blocks */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {ANATOMY_BLOCKS_DATA.map((block, idx) => {
          const isActive = block.id === activeBlockId;
          return (
            <button
              key={block.id}
              onClick={() => handleSelect(block.id)}
              className={`p-3 rounded-2xl text-right transition-all relative flex flex-col justify-between group ${
                isActive
                  ? 'bg-gradient-to-b from-[#1f1f1f] to-[#161616] border border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.25)] scale-[1.02]'
                  : 'bg-[#0e0e0e] border border-white/5 hover:border-white/20 hover:bg-[#161616]'
              }`}
            >
              {/* Order Indicator */}
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-mono font-bold ${isActive ? 'text-cyan-400' : 'text-gray-500'}`}>
                  0{idx + 1}
                </span>
                <div className={`${isActive ? 'text-cyan-400' : 'text-gray-400 group-hover:text-white'}`}>
                  {getIcon(block.id)}
                </div>
              </div>

              {/* Title & English Subtitle */}
              <div>
                <span className={`block text-xs font-bold truncate ${isActive ? 'text-white' : 'text-gray-300'}`}>
                  {block.label}
                </span>
                <span className="block text-[9px] text-gray-500 font-mono truncate mt-0.5">
                  {block.englishLabel}
                </span>
              </div>

              {/* Active bottom highlight indicator */}
              {isActive && (
                <div className="absolute -bottom-1 left-3 right-3 h-[2px] bg-cyan-400 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Active Block Inspector Panel */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0b0b0b] border border-cyan-400/20 space-y-5 animate-in fade-in duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-400/10 border border-cyan-400/30 text-cyan-300">
              {getIcon(activeBlock.id)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-bold text-white">{activeBlock.label}</h4>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-gray-400 border border-white/10">
                  {activeBlock.englishLabel}
                </span>
              </div>
              <span className="text-xs text-cyan-400 font-medium">{activeBlock.tag}</span>
            </div>
          </div>

          <button
            onClick={handleCopyExample}
            className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-300 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>کپی نمونه بلوک</span>
          </button>
        </div>

        {/* 3 Explanation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-4 rounded-xl bg-[#141414] border border-white/5 space-y-1.5">
            <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
              <span>❓ این بلوک چیست؟</span>
            </span>
            <p className="text-xs text-gray-300 leading-relaxed">{activeBlock.whatIsIt}</p>
          </div>

          <div className="p-4 rounded-xl bg-[#141414] border border-white/5 space-y-1.5">
            <span className="text-xs font-bold text-violet-300 flex items-center gap-1.5">
              <span>💡 چرا اهمیت دارد؟</span>
            </span>
            <p className="text-xs text-gray-300 leading-relaxed">{activeBlock.whyItMatters}</p>
          </div>

          <div className="p-4 rounded-xl bg-[#141414] border border-white/5 space-y-1.5">
            <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <span>🎯 چه زمانی استفاده کنیم؟</span>
            </span>
            <p className="text-xs text-gray-300 leading-relaxed">{activeBlock.whenToUse}</p>
          </div>
        </div>

        {/* Live Example Box */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-gray-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>نمونه عملیاتی استاندارد (Live Example):</span>
          </span>
          <div className="p-4 rounded-xl bg-[#070707] border border-white/10 text-xs sm:text-sm font-mono text-cyan-200 whitespace-pre-wrap leading-relaxed">
            {activeBlock.example}
          </div>
        </div>
      </div>
    </div>
  );
};
