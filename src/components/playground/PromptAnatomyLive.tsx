import React, { useState } from 'react';
import { PromptScoreResult } from '../../types';
import { 
  UserCheck, 
  Layers, 
  CheckSquare, 
  Users, 
  ShieldAlert, 
  FileCode, 
  Sparkles, 
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ChevronLeft
} from 'lucide-react';

interface PromptAnatomyLiveProps {
  evaluation: PromptScoreResult;
  onNavigateToLesson?: (lessonId: string) => void;
}

interface PillarDetail {
  id: string;
  name: string;
  nameEn: string;
  detected: boolean;
  tag: string;
  description: string;
  whyItMatters: string;
  suggestedSnippet: string;
  lessonId: string;
  lessonTitle: string;
  icon: React.ReactNode;
}

export const PromptAnatomyLive: React.FC<PromptAnatomyLiveProps> = ({
  evaluation,
  onNavigateToLesson
}) => {
  const [selectedPillarId, setSelectedPillarId] = useState<string>('role');
  const { detectedComponents } = evaluation;

  const PILLARS: PillarDetail[] = [
    {
      id: 'role',
      name: 'نقش و پرسونا',
      nameEn: 'Role / Persona',
      detected: detectedComponents.hasRole,
      tag: '<role>',
      description: 'هویت، تخصص، سوگیری فکری و چهارچوب پاسخگویی مدل را معین می‌کند.',
      whyItMatters: 'مشخص کردن نقش، مدل را به زیرمجموعه واژگان و دانش تخصصی مناسب هدایت می‌کند.',
      suggestedSnippet: '<role>\nتو یک معمار ارشد سیستم و کارشناس امنیت نرم‌افزار هستی.\n</role>',
      lessonId: 'l01-02',
      lessonTitle: 'درس ۱.۲: ارکان اساسی پرامپت',
      icon: <UserCheck className="w-4 h-4 text-cyan-400" />
    },
    {
      id: 'context',
      name: 'زمینه و بستر',
      nameEn: 'Context & Background',
      detected: detectedComponents.hasContext,
      tag: '<context>',
      description: 'اطلاعات اولیه، سناریو، پیش‌نیازها و محدودیت‌های دامنه مسئله را فراهم می‌سازد.',
      whyItMatters: 'کانتکست ناکافی اصلی‌ترین عامل توهم (Hallucination) و پاسخ‌های کلیشه‌ای در مدل‌هاست.',
      suggestedSnippet: '<context>\nپلتفرم ما یک سرویس تجارت الکترونیک با ۵۰۰ هزار کاربر فعال است.\n</context>',
      lessonId: 'l01-02',
      lessonTitle: 'درس ۱.۲: ارکان پرامپت',
      icon: <Layers className="w-4 h-4 text-blue-400" />
    },
    {
      id: 'task',
      name: 'وظیفه و هدف عملیاتی',
      nameEn: 'Task & Objective',
      detected: detectedComponents.hasTask,
      tag: '<instructions>',
      description: 'دستورالعمل صریح و فعل عملیاتی که مدل باید انجام دهد (مانند تحلیل، کدنویسی، خلاصه).',
      whyItMatters: 'افعال مبهم مانند «یک نگاهی بنداز» خروجی‌های غیرقابل پیش‌بینی تولید می‌کنند.',
      suggestedSnippet: '<instructions>\nکد زیر را از نظر خطاهای مدیریت حافظه ممیزی کن و گزارش تحلیلی بده.\n</instructions>',
      lessonId: 'l01-01',
      lessonTitle: 'درس ۱.۱: مقدمه مهندسی پرامپت',
      icon: <CheckSquare className="w-4 h-4 text-emerald-400" />
    },
    {
      id: 'audience',
      name: 'جامعه مخاطب',
      nameEn: 'Target Audience',
      detected: detectedComponents.hasAudience,
      tag: '<audience>',
      description: 'سطح دانش، اصطلاحات رایج و پرسونای فردی که قرار است خروجی را مطالعه کند.',
      whyItMatters: 'پاسخ برای یک مدیرعامل با پاسخ برای یک دانشجوی مبتدی نیازمند لحن و عمق متفاوتی است.',
      suggestedSnippet: '<audience>\nمخاطب: مدیران ارشد فناوری با فرصت مطالعه کمتر از ۲ دقیقه.\n</audience>',
      lessonId: 'l01-02',
      lessonTitle: 'درس ۱.۲: ارکان پرامپت',
      icon: <Users className="w-4 h-4 text-purple-400" />
    },
    {
      id: 'constraints',
      name: 'محدودیت‌ها و قوانین بازدارنده',
      nameEn: 'Constraints & Rules',
      detected: detectedComponents.hasConstraints,
      tag: '<rules>',
      description: 'مرزهای پاسخ، خطوط قرمز، سقف طول، ممنوعیت اصطلاحات خاص و شروط منفی.',
      whyItMatters: 'هدایت منفی صریح، خروجی‌های نامطلوب را فیلتر و بهره‌وری را دوچندان می‌کند.',
      suggestedSnippet: '<rules>\n- از هرگونه مقدمه یا تعارفات رسمی بپرهیزید.\n- حداکثر ۳۰۰ کلمه.\n</rules>',
      lessonId: 'l02-03',
      lessonTitle: 'درس ۲.۳: تکنیک‌های منفی و هدایت',
      icon: <ShieldAlert className="w-4 h-4 text-amber-400" />
    },
    {
      id: 'output',
      name: 'فرمت و ساختار خروجی',
      nameEn: 'Output Format',
      detected: detectedComponents.hasOutputFormat,
      tag: '<output_format>',
      description: 'ساختار ظاهری یا فنی داده خروجی (مانند JSON, Markdown Table, Bulleted List).',
      whyItMatters: 'امکان اتصال خروجی به سیستم‌های نرم‌افزاری و خوانایی بالاتر برای انسان.',
      suggestedSnippet: '<output_format>\nپاسخ را در قالب یک جدول Markdown با ستون‌های: [عنوان / اقدام / ریسک] ارائه دهید.\n</output_format>',
      lessonId: 'l01-03',
      lessonTitle: 'درس ۱.۳: کنترل فرمت و ساختار',
      icon: <FileCode className="w-4 h-4 text-teal-400" />
    },
    {
      id: 'examples',
      name: 'نمونه‌های الگو (Few-Shot)',
      nameEn: 'Few-Shot Examples',
      detected: detectedComponents.hasExamples,
      tag: '<example>',
      description: 'ارائه ۱ تا ۳ نمونه واقعی از ورودی و خروجی مورد انتظار جهت یادگیری درون‌کانتکست مدل.',
      whyItMatters: 'بسیار موثرتر از هزار کلمه توضیحات متنی برای تثبیت سبک پاسخ.',
      suggestedSnippet: '<example>\nورودی: داده‌های کاربر\nخروجی: { "status": "approved" }\n</example>',
      lessonId: 'l02-01',
      lessonTitle: 'درس ۲.۱: تکنیک Few-Shot Prompting',
      icon: <Sparkles className="w-4 h-4 text-pink-400" />
    },
    {
      id: 'criteria',
      name: 'معیارهای موفقیت',
      nameEn: 'Success Criteria',
      detected: detectedComponents.hasSuccessCriteria,
      tag: '<success_criteria>',
      description: 'تعریف شرایط و استانداردهایی که نشان می‌دهد وظیفه به درستی انجام شده است.',
      whyItMatters: 'معیار ارزیابی دقیق برای مدل‌های استدلال‌گر تا پاسخ خود را پیش از تحویل بازبینی کنند.',
      suggestedSnippet: '<success_criteria>\nخروجی زمانی موفق است که تمام ۵ تست امنیتی ذکر شده را پوشش دهد.\n</success_criteria>',
      lessonId: 'l02-02',
      lessonTitle: 'درس ۲.۲: Chain of Thought و استدلال',
      icon: <Award className="w-4 h-4 text-indigo-400" />
    }
  ];

  const activePillar = PILLARS.find(p => p.id === selectedPillarId) || PILLARS[0];

  return (
    <div className="flex flex-col h-full bg-[#111115] border border-white/10 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#16161c] border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">آناتومی زنده پرامپت (Live Anatomy)</h3>
            <p className="text-[11px] text-white/50">شناسایی لحظه‌ای ارکان ساختاری پرامپت شما</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {/* 8-Pillar Status Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PILLARS.map((pillar) => {
            const isSelected = pillar.id === selectedPillarId;

            return (
              <button
                key={pillar.id}
                onClick={() => setSelectedPillarId(pillar.id)}
                className={`p-2.5 rounded-xl border text-right transition-all flex flex-col justify-between min-h-[72px] ${
                  isSelected 
                    ? 'bg-cyan-500/15 border-cyan-500/40 shadow-sm' 
                    : pillar.detected
                      ? 'bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/10'
                      : 'bg-white/5 border-white/5 hover:bg-white/10 opacity-70'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="p-1 rounded bg-white/5">
                    {pillar.icon}
                  </div>
                  {pillar.detected ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-white/30" />
                  )}
                </div>

                <div className="mt-2">
                  <div className="text-xs font-medium text-white truncate">{pillar.name}</div>
                  <div className="text-[10px] font-mono text-white/40">{pillar.tag}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Pillar Detailed Insight Box */}
        {activePillar && (
          <div className="p-4 rounded-xl bg-[#14141a] border border-white/10 space-y-3">
            <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-white/5">
                  {activePillar.icon}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{activePillar.name} ({activePillar.nameEn})</h4>
                  <span className="text-[10px] font-mono text-cyan-400">{activePillar.tag}</span>
                </div>
              </div>

              <div className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                activePillar.detected ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}>
                {activePillar.detected ? 'شناسایی شد ✓' : 'موجود نیست ✗'}
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-white/40 block mb-0.5 text-[11px]">تعریف رکن:</span>
                <p className="text-white/80 font-vazir leading-relaxed">{activePillar.description}</p>
              </div>

              <div>
                <span className="text-white/40 block mb-0.5 text-[11px]">چرا اهمیت دارد؟</span>
                <p className="text-amber-300/80 font-vazir leading-relaxed">{activePillar.whyItMatters}</p>
              </div>

              <div>
                <span className="text-white/40 block mb-1 text-[11px]">نمونه تگ استاندارد:</span>
                <pre className="p-2.5 rounded-lg bg-[#0a0a0d] border border-white/5 text-cyan-300 font-mono text-[11px] overflow-x-auto text-left" dir="ltr">
                  {activePillar.suggestedSnippet}
                </pre>
              </div>
            </div>

            {onNavigateToLesson && (
              <div className="pt-2 border-t border-white/5 flex items-center justify-end">
                <button
                  onClick={() => onNavigateToLesson(activePillar.lessonId)}
                  className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                >
                  <span>مشاهده {activePillar.lessonTitle}</span>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
