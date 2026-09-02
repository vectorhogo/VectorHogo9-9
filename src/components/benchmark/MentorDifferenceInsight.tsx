import React from 'react';
import { Brain, Sparkles, ArrowLeft, Lightbulb, BookOpen, Layers, CheckCircle2 } from 'lucide-react';

interface MentorDifferenceInsightProps {
  mode: 'compare_models' | 'ab_prompts' | 'single';
  modelA: string;
  modelB?: string;
  promptA: string;
  promptB?: string;
  outputA: string;
  outputB?: string;
  relatedLessonId?: string;
  relatedSkill?: string;
  onNavigateLesson?: (lessonId: string) => void;
}

export const MentorDifferenceInsight: React.FC<MentorDifferenceInsightProps> = ({
  mode,
  modelA,
  modelB,
  promptA,
  promptB,
  outputA,
  outputB,
  relatedLessonId = 'l01-01',
  relatedSkill = 'Context & Structure Engineering',
  onNavigateLesson
}) => {
  // Generate deterministic educational insights based on the differences
  const getAnalysis = () => {
    if (mode === 'ab_prompts') {
      const isXmlInB = (promptB || '').includes('<') && !(promptA || '').includes('<');
      const isContextInB = (promptB || '').length > (promptA || '').length * 1.5;
      const isJsonInB = (promptB || '').toLowerCase().includes('json');

      if (isXmlInB) {
        return {
          title: 'تحلیل منتور: تاثیر تفکیک تگ‌های XML',
          summary: 'پرامپت B با تفکیک وظایف در تگ‌های ساختاریافته (<role>، <context>، <rules>) ابهام کانتکستی را برطرف کرده و مدل بدون انحراف، دقیقاً مطابق با ساختار درخواستی پاسخ داده است.',
          keyDifferences: [
            'شفافیت در مرزبندی ورودی‌ها و جلوگیری از تداخل داده‌ها با دستورات',
            'پایبندی ۱۰۰٪ به فرمت خروجی اعلام‌شده بدون نیاز به متن‌های حاشیه‌ای',
            'بهبود کنترل توهم و افزایش تکرارپذیری در چند بار اجرای متوالی'
          ],
          skillName: 'تگ‌های ساختاری XML و تفکیک ماژولار',
          suggestedLessonId: 'l01-02'
        };
      } else if (isJsonInB) {
        return {
          title: 'تحلیل منتور: کنترل فرمت و خروجی ساختاریافته (JSON)',
          summary: 'تعریف شمای کلیدها و قید "فقط JSON بدون متن اضافه" در نسخه B باعث تولید خروجی کاملاً قابل پردازش توسط کدهای برنامه‌نویسی شده است.',
          keyDifferences: [
            'تولید خروجی معتبر و تست‌پذیر بدون کامنت یا مقدمه‌چینی زائد',
            'کاهش مصرف توکن‌های اضافی در مقایسه با تولید متن باز',
            'تسهیل اتصال پرامپت به وب‌سرویس‌ها و APIهای بک‌اند'
          ],
          skillName: 'کنترل فرمت خروجی و الگوهای JSON',
          suggestedLessonId: 'l04-01'
        };
      } else if (isContextInB) {
        return {
          title: 'تحلیل منتور: نقش کانتکست غنی در شخصی‌سازی',
          summary: 'افزودن جزئیات پس‌زمینه در پرامپت B سبب شد تا مدل از پاسخ‌های کلیشه‌ای عبور کند و راه‌حل‌های کاملاً عملیاتی و متناسب با شرایط واقعی ارائه دهد.',
          keyDifferences: [
            'حذف فرضیات غیرواقعی مدل به دلیل در دسترس بودن پیش‌فرض‌ها',
            'پاسخ متناسب با جامعه هدف و منابع موجود',
            'ارتقای سطح استنتاج از سطح عمومی به مشاوره ارشد'
          ],
          skillName: 'مهندسی کانتکست و پیشگیری از توهم',
          suggestedLessonId: 'l03-01'
        };
      }
    }

    if (mode === 'compare_models') {
      return {
        title: 'تحلیل منتور: مقایسه رفتار مدل‌های زبانی',
        summary: `مدل‌های مختلف با رویکردهای متفاوتی پرامپت یکسان را تفسیر می‌کنند. مدلی مانند Claude در تفسیر ساختارهای چندبخشی و XML قوی‌تر است، در حالی که مدل‌هایی مانند GPT-4o پاسخی مستقیم‌تر و سریع‌تر تولید می‌نمایند.`,
        keyDifferences: [
          'تفاوت در لحن، عمق پردازش و سبک فرمت‌بندی پیش‌فرض',
          'میزان حساسیت به تگ‌های ساختاریافته و قیود منفی',
          'استراتژی بهینه: طراحی پرامپت چندمنظوره و استاندارد'
        ],
        skillName: 'سازگاری مدل‌ها و بنچ‌مارک تجربی',
        suggestedLessonId: 'l02-01'
      };
    }

    return {
      title: 'تحلیل منتور پرامپت',
      summary: 'طراحی ساختاریافته پرامپت، تعیین نقش صریح و مشخص کردن فرمت، تکرارپذیری پاسخ هوش مصنوعی را تضمین می‌کند.',
      keyDifferences: [
        'شفافیت در تعیین وظیفه اصلی و جامعه هدف',
        'استفاده از قیود سلبی برای جلوگیری از تولید محتوای نامطلوب'
      ],
      skillName: 'اصول بنیادین مهندسی پرامپت',
      suggestedLessonId: 'l01-01'
    };
  };

  const insight = getAnalysis();
  const targetLessonId = relatedLessonId || insight.suggestedLessonId;

  return (
    <div className="p-4 rounded-2xl bg-gradient-to-br from-[#161622] to-[#121218] border border-violet-500/20 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-violet-500/15 text-violet-300 border border-violet-500/30">
            <Brain className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white font-vazir flex items-center gap-1.5">
              <span>{insight.title}</span>
              <Sparkles className="w-3 h-3 text-violet-400" />
            </h4>
            <span className="text-[10px] text-violet-300/70 font-vazir">بینش آموزشی هوشمند آزمایشگاه</span>
          </div>
        </div>

        {onNavigateLesson && (
          <button
            type="button"
            onClick={() => onNavigateLesson(targetLessonId)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-500/20 hover:bg-violet-500/30 text-violet-200 border border-violet-500/30 text-xs font-semibold transition-all group"
          >
            <span>یادگیری این مفهوم در درس</span>
            <ArrowLeft className="w-3.5 h-3.5 group-hover:translate-x-[-2px] transition-transform" />
          </button>
        )}
      </div>

      {/* Summary */}
      <p className="text-xs text-white/80 leading-relaxed font-vazir">
        {insight.summary}
      </p>

      {/* Key Differences Bullet Points */}
      <div className="space-y-1.5 pt-1">
        <span className="text-[11px] font-semibold text-violet-300 block font-vazir">
          نکات کلیدی این آزمایش:
        </span>
        <div className="grid grid-cols-1 gap-1.5">
          {insight.keyDifferences.map((diff, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2 p-2 rounded-lg bg-black/20 border border-white/5 text-[11px] text-white/70 font-vazir leading-relaxed"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-violet-400 shrink-0 mt-0.5" />
              <span>{diff}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Skill linkage tag */}
      <div className="pt-2 flex items-center justify-between text-[11px] border-t border-white/5">
        <div className="flex items-center gap-1.5 text-white/50 font-vazir">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>مهارت مرتبط در نقشه راه:</span>
          <span className="font-semibold text-cyan-300">{insight.skillName}</span>
        </div>

        {onNavigateLesson && (
          <button
            type="button"
            onClick={() => onNavigateLesson(targetLessonId)}
            className="text-cyan-400 hover:text-cyan-300 font-vazir text-[11px] underline"
          >
            مشاهده سرفصل‌های سطح مرتبط →
          </button>
        )}
      </div>
    </div>
  );
};
