import React, { useState } from 'react';
import { 
  PromptBuilderBlock, 
  PromptBlockType 
} from '../../types';
import { 
  UserCheck, 
  Layers, 
  CheckSquare, 
  Users, 
  ShieldAlert, 
  FileCode, 
  Sparkles, 
  Award,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Eye,
  Plus,
  Trash2,
  CheckCircle2
} from 'lucide-react';

interface PromptVisualBuilderProps {
  onAssemble: (assembledPrompt: string) => void;
  initialPrompt?: string;
}

const DEFAULT_BLOCKS: PromptBuilderBlock[] = [
  {
    id: 'block-role',
    type: 'ROLE',
    label: 'نقش و پرسونا',
    englishLabel: 'Role / Persona',
    value: 'تو یک استراتژیست ارشد و مشاور تخصصی هستی.',
    placeholder: 'مثال: شما یک معمار ارشد سیستم‌های ابری با ۱۰ سال سابقه هستید...',
    enabled: true
  },
  {
    id: 'block-context',
    type: 'CONTEXT',
    label: 'بستر و زمینه پروژه',
    englishLabel: 'Context & Background',
    value: 'ما در حال پیاده‌سازی یک قابلیت جدید در پلتفرم هستیم و نیاز به خروجی مستند داریم.',
    placeholder: 'اطلاعات پیش‌زمینه، صنعت، داده‌های اولیه یا موقعیت کاربر...',
    enabled: true
  },
  {
    id: 'block-task',
    type: 'TASK',
    label: 'وظیفه و هدف عملیاتی',
    englishLabel: 'Core Task & Objective',
    value: '',
    placeholder: 'دقیقاً چه خروجی، تحلیل یا متنی باید توسط مدل تولید شود؟',
    enabled: true
  },
  {
    id: 'block-audience',
    type: 'AUDIENCE',
    label: 'جامعه مخاطبان هدف',
    englishLabel: 'Target Audience',
    value: 'مدیران فنی و تصمیم‌گیرندگان پروژه',
    placeholder: 'چه کسانی قرار است این خروجی را بخوانند یا استفاده کنند؟',
    enabled: true
  },
  {
    id: 'block-constraints',
    type: 'CONSTRAINTS',
    label: 'قوانین بازدارنده و محدودیت‌ها',
    englishLabel: 'Constraints & Rules',
    value: '- از کلی‌گویی و مقدمه‌های زائد بپرهیزید.\n- حداکثر در ۵۰۰ کلمه خلاصه شود.\n- در صورت نیاز به داده بیشتر، پیش‌فرض‌ها را ذکر کنید.',
    placeholder: 'محدودیت‌های طول، لحن، خطوط قرمز و موارد ممنوعه...',
    enabled: true
  },
  {
    id: 'block-examples',
    type: 'EXAMPLES',
    label: 'نمونه‌های الگو (Few-Shot)',
    englishLabel: 'Few-Shot Examples',
    value: '',
    placeholder: 'یک یا دو نمونه ورودی و خروجی ایده‌آل برای آموزش الگو به مدل...',
    enabled: false
  },
  {
    id: 'block-output',
    type: 'OUTPUT_FORMAT',
    label: 'ساختار و قالب خروجی',
    englishLabel: 'Output Format',
    value: 'پاسخ را در قالب استاندارد Markdown با تیترهای مشخص، جدول مقایسه‌ای و بولت‌پوینت‌های تحلیلی ارائه دهید.',
    placeholder: 'قالب مورد نظر: JSON, Markdown, Table, Bullet points...',
    enabled: true
  },
  {
    id: 'block-criteria',
    type: 'SUCCESS_CRITERIA',
    label: 'معیارهای موفقیت و کیفیت',
    englishLabel: 'Success Criteria',
    value: 'پاسخ باید بدون حاشیه، مستند و بلافاصله قابل اجرا باشد.',
    placeholder: 'شاخص‌ها و معیارهایی که کیفیت پاسخ را مشخص می‌کنند...',
    enabled: true
  }
];

const BLOCK_ICONS: Record<PromptBlockType, React.ReactNode> = {
  ROLE: <UserCheck className="w-4 h-4 text-cyan-400" />,
  CONTEXT: <Layers className="w-4 h-4 text-blue-400" />,
  TASK: <CheckSquare className="w-4 h-4 text-emerald-400" />,
  AUDIENCE: <Users className="w-4 h-4 text-purple-400" />,
  CONSTRAINTS: <ShieldAlert className="w-4 h-4 text-amber-400" />,
  EXAMPLES: <Sparkles className="w-4 h-4 text-pink-400" />,
  OUTPUT_FORMAT: <FileCode className="w-4 h-4 text-teal-400" />,
  SUCCESS_CRITERIA: <Award className="w-4 h-4 text-indigo-400" />
};

export const PromptVisualBuilder: React.FC<PromptVisualBuilderProps> = ({
  onAssemble
}) => {
  const [blocks, setBlocks] = useState<PromptBuilderBlock[]>(DEFAULT_BLOCKS);
  const [expandedBlockId, setExpandedBlockId] = useState<string | null>('block-task');

  const updateBlockValue = (id: string, value: string) => {
    const updated = blocks.map(b => b.id === id ? { ...b, value } : b);
    setBlocks(updated);
    assembleToPrompt(updated);
  };

  const toggleBlockEnabled = (id: string) => {
    const updated = blocks.map(b => b.id === id ? { ...b, enabled: !b.enabled } : b);
    setBlocks(updated);
    assembleToPrompt(updated);
  };

  const assembleToPrompt = (currentBlocks: PromptBuilderBlock[]) => {
    const parts: string[] = [];

    currentBlocks.forEach(b => {
      if (!b.enabled || !b.value.trim()) return;

      switch (b.type) {
        case 'ROLE':
          parts.push(`<role>\n${b.value.trim()}\n</role>`);
          break;
        case 'CONTEXT':
          parts.push(`<context>\n${b.value.trim()}\n</context>`);
          break;
        case 'TASK':
          parts.push(`<instructions>\n${b.value.trim()}\n</instructions>`);
          break;
        case 'AUDIENCE':
          parts.push(`<audience>\n${b.value.trim()}\n</audience>`);
          break;
        case 'CONSTRAINTS':
          parts.push(`<rules>\n${b.value.trim()}\n</rules>`);
          break;
        case 'EXAMPLES':
          parts.push(`<examples>\n${b.value.trim()}\n</examples>`);
          break;
        case 'OUTPUT_FORMAT':
          parts.push(`<output_format>\n${b.value.trim()}\n</output_format>`);
          break;
        case 'SUCCESS_CRITERIA':
          parts.push(`<success_criteria>\n${b.value.trim()}\n</success_criteria>`);
          break;
      }
    });

    onAssemble(parts.join('\n\n'));
  };

  const handleResetAll = () => {
    setBlocks(DEFAULT_BLOCKS);
    assembleToPrompt(DEFAULT_BLOCKS);
  };

  const activeCount = blocks.filter(b => b.enabled && b.value.trim()).length;

  return (
    <div className="flex flex-col h-full bg-[#111115] border border-white/10 rounded-2xl overflow-hidden">
      {/* Visual Builder Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#16161c] border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">معماری بصری پرامپت (Visual Prompt Builder)</h3>
            <p className="text-[11px] text-white/50">تکمیل بلوک‌های ۸ گانه برای تولید پرامپت استاندارد ساختاریافته</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono">
            <span>{activeCount} از ۸ بلوک فعال</span>
          </div>

          <button
            onClick={handleResetAll}
            title="بازنشانی بلوک‌ها"
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Blocks List */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5 custom-scrollbar">
        {blocks.map((block) => {
          const isExpanded = expandedBlockId === block.id;
          const hasContent = !!block.value.trim();

          return (
            <div
              key={block.id}
              className={`border rounded-xl transition-all duration-200 ${
                block.enabled
                  ? hasContent
                    ? 'bg-[#14141a] border-white/15 shadow-sm'
                    : 'bg-[#14141a]/60 border-white/10'
                  : 'bg-[#0e0e12]/40 border-white/5 opacity-50'
              }`}
            >
              {/* Block Header */}
              <div className="flex items-center justify-between p-3 select-none">
                <div 
                  className="flex items-center gap-2.5 flex-1 cursor-pointer"
                  onClick={() => setExpandedBlockId(isExpanded ? null : block.id)}
                >
                  <div className="p-1.5 rounded-lg bg-white/5 border border-white/5">
                    {BLOCK_ICONS[block.type]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-white">{block.label}</span>
                      <span className="text-[10px] font-mono text-white/40">{block.englishLabel}</span>
                    </div>
                    {hasContent && !isExpanded && (
                      <p className="text-[11px] text-white/50 truncate max-w-md mt-0.5 font-vazir">
                        {block.value}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Enable / Disable switch */}
                  <button
                    onClick={() => toggleBlockEnabled(block.id)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                      block.enabled
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-white/5 text-white/40 hover:text-white'
                    }`}
                  >
                    {block.enabled ? 'فعال' : 'غیرفعال'}
                  </button>

                  {/* Expand / Collapse toggle */}
                  <button
                    onClick={() => setExpandedBlockId(isExpanded ? null : block.id)}
                    className="p-1 rounded text-white/50 hover:text-white"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Expanded Textarea */}
              {isExpanded && (
                <div className="px-3 pb-3 pt-1 border-t border-white/5">
                  <textarea
                    value={block.value}
                    onChange={(e) => updateBlockValue(block.id, e.target.value)}
                    disabled={!block.enabled}
                    placeholder={block.placeholder}
                    rows={3}
                    className="w-full p-2.5 bg-[#0a0a0d] border border-white/10 rounded-lg text-xs font-vazir text-white/90 leading-5 outline-none focus:border-cyan-500/50 resize-none transition-colors placeholder:text-white/20"
                  />
                  
                  <div className="flex items-center justify-between mt-2 text-[10px] text-white/40">
                    <span>تگ تولیدی: &lt;{block.type.toLowerCase()}&gt;</span>
                    <span>{block.value.length} کاراکتر</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
