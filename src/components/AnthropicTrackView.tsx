import React, { useState } from 'react';
import { 
  Cpu, 
  ExternalLink, 
  Clock, 
  Sparkles, 
  Copy, 
  Check, 
  BookOpen, 
  CheckCircle2, 
  Code2, 
  ShieldCheck, 
  ArrowLeft,
  Flame,
  Terminal
} from 'lucide-react';
import { ANTHROPIC_TRACK_ITEMS } from '../data/anthropicTrack';
import { AnthropicTrackItem } from '../types';

export const AnthropicTrackView: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<AnthropicTrackItem>(ANTHROPIC_TRACK_ITEMS[0]);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [practiceInput, setPracticeInput] = useState(selectedItem.practicePrompt.initial);
  const [showPracticeSolution, setShowPracticeSolution] = useState(false);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleSelectModule = (item: AnthropicTrackItem) => {
    setSelectedItem(item);
    setPracticeInput(item.practicePrompt.initial);
    setShowPracticeSolution(false);
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#180f26] via-[#120e20] to-[#0a0a0a] border border-violet-500/20 p-6 lg:p-8 shadow-2xl">
        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-600/15 border border-violet-500/30 text-violet-300 text-xs font-semibold">
            <Cpu className="w-3.5 h-3.5 text-violet-400" />
            <span>Anthropic Claude Official Methodology Track</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            مسیر تخصصی مهندسی پرامپت با معماری Anthropic Claude
          </h1>

          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            راهنمای جامع کار با مدل‌های پیشرفته Claude 3.5 Sonnet و Claude 3.7 بر اساس آموزش‌ها، متدولوژی‌های XML و تجارب عملی تیم رسمی هوش مصنوعی شرکت Anthropic.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
            <a
              href="https://github.com/anthropics/prompt-eng-interactive-tutorial"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-2xl bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/30 text-violet-200 flex items-center gap-1.5 transition-colors"
            >
              <span>مستندات گیت‌هاب آنتروپیک</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <a
              href="https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 flex items-center gap-1.5 transition-colors"
            >
              <span>پرتال توسعه‌دهندگان کلود</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Module Selector Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {ANTHROPIC_TRACK_ITEMS.map((item, idx) => {
          const isSelected = selectedItem.id === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleSelectModule(item)}
              className={`p-4 rounded-3xl text-right transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#1e1330] border border-violet-500/50 shadow-[0_0_20px_rgba(124,58,237,0.25)]'
                  : 'bg-[#141414] border border-white/5 hover:border-white/10 hover:bg-[#1a1a1a]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-[11px] mb-2">
                  <span className="font-mono text-violet-400 font-bold">ماژول ۰{idx + 1}</span>
                  <span className="text-gray-400">{item.difficulty}</span>
                </div>
                <h3 className="font-bold text-xs sm:text-sm text-white line-clamp-2 mb-1">
                  {item.title}
                </h3>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {item.estimatedTime}
                </span>
                <span className={isSelected ? 'text-violet-300 font-bold' : 'text-gray-500'}>
                  {isSelected ? 'فعال ✓' : 'انتخاب'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Module Deep Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Comprehensive Breakdown & XML Example */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Overview & Core Insight */}
          <div className="p-6 rounded-3xl bg-[#141414] border border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-violet-400 block">{selectedItem.englishTitle}</span>
                <h2 className="text-xl font-bold text-white mt-0.5">{selectedItem.title}</h2>
              </div>
              <a
                href={selectedItem.officialSourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1"
              >
                <span>مشاهده منبع اصلی</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              {selectedItem.overview}
            </p>

            {/* Key Topics List */}
            <div className="pt-2">
              <span className="text-xs font-bold text-gray-300 block mb-2">سرفصل‌های محوری این ماژول:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedItem.topics.map((top, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-[#1a1a1a] border border-white/5 text-xs text-gray-300 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
                    <span>{top}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* XML Tags Architecture Example */}
          <div className="p-6 rounded-3xl bg-[#141414] border border-cyan-400/20 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
                <Code2 className="w-4 h-4 text-cyan-400" />
                <span>الگوی استاندارد تگ‌های ساختاریافته XML در کلود</span>
              </div>
              <button
                onClick={() => handleCopy(selectedItem.xmlStructureExample, 'xml')}
                className="px-3 py-1 rounded-xl bg-cyan-400/10 hover:bg-cyan-400/20 border border-cyan-400/30 text-xs text-cyan-200 flex items-center gap-1"
              >
                {copiedSection === 'xml' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>کپی ساختار</span>
              </button>
            </div>

            <div className="p-4 bg-[#0d0d0d] rounded-2xl border border-white/5 text-xs font-mono text-cyan-200 whitespace-pre-wrap leading-relaxed">
              {selectedItem.xmlStructureExample}
            </div>
          </div>

          {/* Practice Prompt Section */}
          <div className="p-6 rounded-3xl bg-[#141414] border border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-white text-base">تمرین کارگاهی ماژول</h3>
              </div>
              <button
                onClick={() => setShowPracticeSolution(!showPracticeSolution)}
                className="text-xs text-violet-400 hover:text-violet-300"
              >
                {showPracticeSolution ? 'مخفی‌سازی پاسخ استاندارد' : 'مشاهده حل نمونه'}
              </button>
            </div>

            <div className="space-y-2 text-xs sm:text-sm text-gray-300">
              <p><strong className="text-white">پرامپت اولیه غیرحرفه‌ای:</strong> {selectedItem.practicePrompt.initial}</p>
              <p className="text-amber-300 font-medium">🎯 هدف: {selectedItem.practicePrompt.goal}</p>
            </div>

            <textarea
              value={practiceInput}
              onChange={(e) => setPracticeInput(e.target.value)}
              rows={5}
              className="w-full p-4 bg-[#0d0d0d] border border-white/10 rounded-2xl text-xs font-mono text-white focus:outline-none focus:border-violet-500/50"
              placeholder="پرامپت مهندسی‌شده با تگ‌های XML را اینجا بنویسید..."
            />

            {showPracticeSolution && (
              <div className="p-4 bg-violet-950/20 border border-violet-500/30 rounded-2xl text-xs font-mono text-violet-200 whitespace-pre-wrap animate-in fade-in">
                {selectedItem.practicePrompt.solution}
              </div>
            )}
          </div>

        </div>

        {/* Right 1 Col: Claude-Specific Insights & Practical Tips */}
        <div className="space-y-6">
          
          {/* Claude-Specific Nuances */}
          <div className="p-5 rounded-3xl bg-[#181126] border border-violet-500/30 space-y-3">
            <div className="flex items-center gap-2 text-violet-300 font-bold text-sm">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span>ظرافت‌های ویژه مدل‌های Claude</span>
            </div>

            <ul className="space-y-2.5 text-xs text-gray-300">
              {selectedItem.claudeSpecifics.map((spec, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-violet-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{spec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Practical Tips */}
          <div className="p-5 rounded-3xl bg-[#141414] border border-white/5 space-y-3">
            <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>نکات طلایی آنتروپیک در محیط پروداکشن</span>
            </div>

            <div className="space-y-2 text-xs text-gray-300">
              {selectedItem.practicalTips.map((tip, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-[#1a1a1a] border border-white/5">
                  {tip}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
