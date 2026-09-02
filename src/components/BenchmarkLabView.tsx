import React, { useState, useRef } from 'react';
import { useProgress } from '../context/ProgressContext';
import { aiProviderRegistry } from '../services/ai/providerRegistry';
import { 
  AIProviderId, 
  ModelOption, 
  GenerateParams, 
  GenerateResult, 
  TechnicalMetrics, 
  ManualScorecard,
  BenchmarkExperimentRecord 
} from '../services/ai/types';
import { ModelSelectorBar } from './benchmark/ModelSelectorBar';
import { TechnicalMetricsBadge } from './benchmark/TechnicalMetricsBadge';
import { BenchmarkScorecard } from './benchmark/BenchmarkScorecard';
import { MentorDifferenceInsight } from './benchmark/MentorDifferenceInsight';
import { BenchmarkTemplatesModal } from './benchmark/BenchmarkTemplatesModal';
import { BenchmarkNotebookDrawer } from './benchmark/BenchmarkNotebookDrawer';
import { ExportExperimentModal } from './benchmark/ExportExperimentModal';
import { BenchmarkTemplate } from '../data/benchmarkTemplates';
import { 
  FlaskConical, 
  Sparkles, 
  Play, 
  Square, 
  RotateCcw, 
  ArrowRightLeft, 
  BookOpen, 
  Download, 
  Save, 
  Layers, 
  Sliders, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Info, 
  AlertCircle,
  Cpu,
  Terminal,
  Brain,
  Code2,
  FileCode,
  BookmarkPlus
} from 'lucide-react';

interface BenchmarkLabViewProps {
  onNavigate?: (view: string, lessonId?: string) => void;
}

export const BenchmarkLabView: React.FC<BenchmarkLabViewProps> = ({ onNavigate }) => {
  const { progress, saveExperiment, recordBenchmarkRun, savePlaygroundPrompt } = useProgress();

  // Mode: single | compare_models | ab_prompts
  const [mode, setMode] = useState<'single' | 'compare_models' | 'ab_prompts'>('compare_models');

  // Models
  const [modelA, setModelA] = useState<string>('demo-claude-3-7');
  const [modelB, setModelB] = useState<string>('demo-gpt-4o');

  // Prompts
  const [systemPromptA, setSystemPromptA] = useState<string>('You are an expert AI consultant. Always format outputs in clear structured Markdown.');
  const [systemPromptB, setSystemPromptB] = useState<string>('You are a senior pragmatic engineer. Give concise, actionable answers.');
  const [showSystemPrompt, setShowSystemPrompt] = useState<boolean>(false);

  const [promptA, setPromptA] = useState<string>(`<role>
تو مشاور ارشد تحول دیجیتال و استراتژی هوش مصنوعی هستی.
</role>

<task>
یک برنامه ۳ مرحله‌ای برای استقرار مهندسی پرامپت در یک سازمان ۵۰ نفره تدوین کن.
</task>

<rules>
- خروجی باید کاملاً ساختاریافته و دارای جدول زمان‌بندی باشد.
- از کلی‌گویی خودداری کن.
</rules>

<output_format>
جدول Markdown با ستون‌های [فاز / اقدامات کلیدی / خروجی ملموس / زمان تخمینی].
</output_format>`);

  const [promptB, setPromptB] = useState<string>(`یک برنامه ۳ مرحله‌ای برای آموزش هوش مصنوعی به کارمندان بنویس که زمان‌بندی هم داشته باشه.`);

  // Parameters
  const [temperature, setTemperature] = useState<number>(0.7);
  const [maxTokens, setMaxTokens] = useState<number>(2048);
  const [showAdvancedParams, setShowAdvancedParams] = useState<boolean>(false);

  // Execution State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const [errorA, setErrorA] = useState<string | null>(null);
  const [errorB, setErrorB] = useState<string | null>(null);

  // Outputs & Results
  const [outputA, setOutputA] = useState<string>(`بر اساس ساختار درخواستی، برنامه استقرار مهندسی پرامپت سازمانی به شرح زیر تدوین شده است:

| فاز اجرایی | اقدامات کلیدی | خروجی ملموس | زمان تخمینی |
| :--- | :--- | :--- | :---: |
| **فاز ۱: ارزیابی و استانداردسازی** | شناسایی سناریوهای تکراری و تدوین کتابخانه پرامپت‌های سازمانی | ریپازیتوری پرامپت‌های استاندارد (XML-based) | ۲ هفته |
| **فاز ۲: توانمندسازی و کارگاه عملی** | برگزاری جلسات تمرین در محیط آزمایشگاهی و کنترل توهم | گذراندن دوره توسط ۸۰٪ پرسنل کلیدی | ۳ هفته |
| **فاز ۳: پایش کیفیت و بازدهی** | سنجش صرفه‌جویی زمانی و یکنواختی خروجی‌ها در فرآیندها | گزارش ROI و بهبود ۲۵٪ سرعت تولید اسناد | مستمر |

### اصول تضمین پایداری:
1. استفاده مداوم از الگوهای ساختاریافته چندبخشی
2. بازبینی دوره‌ای پرامپت‌ها بر اساس تغییرات مدل‌های زبانی`);
  const [metricsA, setMetricsA] = useState<TechnicalMetrics | undefined>({
    characterCount: 820,
    wordCount: 138,
    detectedFormat: 'Markdown Table',
    containsXmlTags: true,
    responseTimeMs: 650,
    estimatedTokens: { promptTokens: 95, outputTokens: 235, totalTokens: 330 }
  });

  const [outputB, setOutputB] = useState<string>(`برنامه آموزش هوش مصنوعی برای کارمندان:

۱. مرحله اول: آشنایی با مبانی و ابزارهای پرکاربرد (هفته ۱ تا ۲)
۲. مرحله دوم: تمرین روی وظایف روزمره و نوشتن پرامپت‌های کاری (هفته ۳ تا ۴)
۳. مرحله سوم: ارزیابی کارایی و ارائه بازخورد به تیم‌ها (هفته ۵)

امیدوارم این برنامه برای سازمان شما مفید باشد.`);
  const [metricsB, setMetricsB] = useState<TechnicalMetrics | undefined>({
    characterCount: 310,
    wordCount: 58,
    detectedFormat: 'Bullet List',
    containsXmlTags: false,
    responseTimeMs: 380,
    estimatedTokens: { promptTokens: 35, outputTokens: 90, totalTokens: 125 }
  });

  // Scorecards
  const [scorecardA, setScorecardA] = useState<ManualScorecard>({
    clarity: 5,
    instructionFollowing: 5,
    relevance: 5,
    outputStructure: 5,
    consistency: 4,
    averageScore: 4.8
  });

  const [scorecardB, setScorecardB] = useState<ManualScorecard>({
    clarity: 3,
    instructionFollowing: 2,
    relevance: 4,
    outputStructure: 2,
    consistency: 3,
    averageScore: 2.8
  });

  // Notebook & Metadata
  const [experimentTitle, setExperimentTitle] = useState<string>('آزمایش استقرار سازمانی: مقایسه پرامپت ساختاریافته و ساده');
  const [hypothesis, setHypothesis] = useState<string>('افزودن جدول و تعیین تگ‌های ساختاریافته، خروجی را از حالت کلی‌گویی به یک پروپوزال اجرایی تبدیل می‌کند.');
  const [observations, setObservations] = useState<string>('نسخه A یک جدول دقیق با ستون‌های درخواستی تولید کرد، در حالی که نسخه B تنها لیستی سطحی از مراحل ارائه داد.');
  const [learnings, setLearnings] = useState<string>('برای خروجی‌های مدیریتی و سازمانی، تعریف صریح ساختار جدول Markdown الزامی است.');

  // Modals & Drawers
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isNotebookOpen, setIsNotebookOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [savedToLibrarySuccess, setSavedToLibrarySuccess] = useState(false);

  // Execute Generation
  const handleRun = async () => {
    if (isGenerating) return;

    if (!promptA.trim()) {
      setErrorA('لطفاً متن پرامپت ورودی را وارد نمایید.');
      return;
    }
    if (mode === 'ab_prompts' && !promptB.trim()) {
      setErrorB('لطفاً متن پرامپت نسخه B را وارد نمایید.');
      return;
    }

    setIsGenerating(true);
    setErrorA(null);
    setErrorB(null);

    const controller = new AbortController();
    setAbortController(controller);

    const testedModelIds = [modelA];
    if (mode === 'compare_models') {
      testedModelIds.push(modelB);
    }
    recordBenchmarkRun(mode, testedModelIds);

    try {
      if (mode === 'single') {
        setOutputA('');
        const resA = await aiProviderRegistry.generate({
          systemPrompt: showSystemPrompt ? systemPromptA : undefined,
          userPrompt: promptA,
          modelId: modelA,
          temperature,
          maxTokens,
          signal: controller.signal,
          onChunk: (_, accumulated) => setOutputA(accumulated)
        });
        setOutputA(resA.text);
        setMetricsA(resA.metrics);
      } else if (mode === 'compare_models') {
        setOutputA('');
        setOutputB('');

        // Run both models concurrently
        const [resA, resB] = await Promise.all([
          aiProviderRegistry.generate({
            systemPrompt: showSystemPrompt ? systemPromptA : undefined,
            userPrompt: promptA,
            modelId: modelA,
            temperature,
            maxTokens,
            signal: controller.signal,
            onChunk: (_, acc) => setOutputA(acc)
          }),
          aiProviderRegistry.generate({
            systemPrompt: showSystemPrompt ? systemPromptA : undefined,
            userPrompt: promptA,
            modelId: modelB,
            temperature,
            maxTokens,
            signal: controller.signal,
            onChunk: (_, acc) => setOutputB(acc)
          })
        ]);

        setOutputA(resA.text);
        setMetricsA(resA.metrics);
        setOutputB(resB.text);
        setMetricsB(resB.metrics);
      } else if (mode === 'ab_prompts') {
        setOutputA('');
        setOutputB('');

        // Run prompt A vs prompt B with modelA
        const [resA, resB] = await Promise.all([
          aiProviderRegistry.generate({
            systemPrompt: showSystemPrompt ? systemPromptA : undefined,
            userPrompt: promptA,
            modelId: modelA,
            temperature,
            maxTokens,
            signal: controller.signal,
            onChunk: (_, acc) => setOutputA(acc)
          }),
          aiProviderRegistry.generate({
            systemPrompt: showSystemPrompt ? systemPromptB : undefined,
            userPrompt: promptB,
            modelId: modelA,
            temperature,
            maxTokens,
            signal: controller.signal,
            onChunk: (_, acc) => setOutputB(acc)
          })
        ]);

        setOutputA(resA.text);
        setMetricsA(resA.metrics);
        setOutputB(resB.text);
        setMetricsB(resB.metrics);
      }
    } catch (err: any) {
      if (err?.message && !err.message.includes('لغو شد')) {
        setErrorA('اتصال به سرویس هوش مصنوعی برقرار نشد یا با خطا مواجه شد. مجدداً تلاش کنید.');
      }
    } finally {
      setIsGenerating(false);
      setAbortController(null);
    }
  };

  const handleStop = () => {
    if (abortController) {
      abortController.abort();
    }
    setIsGenerating(false);
  };

  const handleApplyTemplate = (tpl: BenchmarkTemplate) => {
    setMode('ab_prompts');
    setExperimentTitle(tpl.title);
    setHypothesis(tpl.hypothesis);
    setPromptA(tpl.promptA);
    setPromptB(tpl.promptB);
    setLearnings(`اصل استخراج‌شده از این آزمایش: ${tpl.expectedDifferenceFa}`);
    setObservations('');
  };

  const handleSaveToNotebook = () => {
    saveExperiment({
      title: experimentTitle || 'آزمایش بنچ‌مارک پرامپت',
      hypothesis,
      promptA,
      promptB: mode !== 'single' ? promptB : '',
      outputA,
      outputB: mode !== 'single' ? outputB : '',
      observations,
      learnings
    });
  };

  const handleSaveToPromptLibrary = () => {
    savePlaygroundPrompt({
      title: experimentTitle || 'پرامپت برگزیده از Benchmark Lab',
      systemPrompt: showSystemPrompt ? systemPromptA : undefined,
      userPrompt: promptA,
      model: modelA,
      tags: ['Benchmark', 'Optimized', mode]
    });
    setSavedToLibrarySuccess(true);
    setTimeout(() => setSavedToLibrarySuccess(false), 2500);
  };

  const handleCopyText = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1800);
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      
      {/* 1. Header Banner & Workspace Controls */}
      <div className="bg-[#111116] border border-white/10 p-4 sm:p-6 rounded-3xl shadow-2xl relative overflow-hidden">
        {/* Subtle Ambient Background */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-violet-500/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold font-vazir">
              <FlaskConical className="w-3.5 h-3.5" />
              <span>🧪 AI Benchmark Lab</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-400/20 text-cyan-300">نسل ۲.۰</span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight font-vazir">
              آزمایشگاه بنچ‌مارک و مقایسه هوش مصنوعی
            </h1>

            <p className="text-xs sm:text-sm text-white/60 font-vazir leading-relaxed">
              پرامپت خود را در برابر مدل‌های مختلف آزمایش کن؛ فرضیات را بسنج، تفاوت سبک پاسخ‌دهی را لمس کن و بهترین نسخه را استخراج نما.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center flex-wrap gap-2 w-full xl:w-auto justify-end">
            <button
              type="button"
              onClick={() => setIsTemplatesOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 text-xs font-semibold transition-all font-vazir"
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>الگوهای آماده آزمایش</span>
            </button>

            <button
              type="button"
              onClick={() => setIsNotebookOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-500/15 hover:bg-teal-500/25 text-teal-300 border border-teal-500/30 text-xs font-semibold transition-all font-vazir shadow-[0_0_10px_rgba(20,184,166,0.1)]"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>نوت‌بوک فرضیات ({progress.experiments?.length || 0})</span>
            </button>

            <button
              type="button"
              onClick={() => setIsExportOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 text-xs font-medium transition-all font-vazir"
            >
              <Download className="w-3.5 h-3.5" />
              <span>خروجی MD / JSON</span>
            </button>

            <button
              type="button"
              onClick={handleSaveToPromptLibrary}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-violet-500/20 hover:bg-violet-500/30 text-violet-200 border border-violet-500/30 text-xs font-semibold transition-all font-vazir"
            >
              {savedToLibrarySuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <BookmarkPlus className="w-3.5 h-3.5 text-violet-400" />}
              <span>{savedToLibrarySuccess ? 'در کتابخانه ذخیره شد' : 'ذخیره در Prompt Library'}</span>
            </button>
          </div>
        </div>

        {/* Experiment Title Bar */}
        <div className="mt-4 pt-3.5 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-white/40 font-vazir shrink-0">عنوان آزمایش:</span>
            <input
              type="text"
              value={experimentTitle}
              onChange={(e) => setExperimentTitle(e.target.value)}
              className="w-full sm:w-96 px-3 py-1.5 rounded-xl bg-[#0a0a0e] border border-white/10 text-xs text-white font-vazir outline-none focus:border-cyan-500/50"
            />
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#0a0a0e] border border-white/5 text-xs font-vazir">
            <button
              type="button"
              onClick={() => setMode('single')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                mode === 'single'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30 shadow-sm'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              تک مدل (Single)
            </button>

            <button
              type="button"
              onClick={() => setMode('compare_models')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                mode === 'compare_models'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30 shadow-sm'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              مقایسه مدل‌ها (Model A vs B)
            </button>

            <button
              type="button"
              onClick={() => setMode('ab_prompts')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                mode === 'ab_prompts'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30 shadow-sm'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              تست A/B پرامپت (Prompt A vs B)
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Workspace Layout (30-35% Left vs 65-70% Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* LEFT 4 Columns (33%): Prompt Input & Model Configurations */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#111116] border border-white/10 rounded-2xl p-4 shadow-xl space-y-4">
            
            {/* Model Selector A */}
            <ModelSelectorBar
              selectedModelId={modelA}
              onSelectModel={setModelA}
              label={mode === 'compare_models' ? 'مدل زبانی A (اولیه):' : 'مدل زبانی انتخابی:'}
            />

            {/* Model Selector B (Only in compare_models mode) */}
            {mode === 'compare_models' && (
              <ModelSelectorBar
                selectedModelId={modelB}
                onSelectModel={setModelB}
                label="مدل زبانی B (جهت مقایسه):"
              />
            )}

            {/* System Prompt Toggle & Input */}
            <div className="space-y-2 pt-1 border-t border-white/5">
              <div className="flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => setShowSystemPrompt(!showSystemPrompt)}
                  className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors font-vazir font-semibold"
                >
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>دستورات سیستمی (System Prompt)</span>
                  {showSystemPrompt ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
                <span className="text-[10px] text-white/40 font-mono">اختیاری</span>
              </div>

              {showSystemPrompt && (
                <div className="space-y-2 animate-in fade-in duration-150">
                  <textarea
                    value={systemPromptA}
                    onChange={(e) => setSystemPromptA(e.target.value)}
                    rows={3}
                    placeholder="نقش کلی یا اصول پایدار مدل را مشخص کنید..."
                    className="w-full p-2.5 rounded-xl bg-[#0a0a0d] border border-white/10 text-xs font-mono text-cyan-100/90 resize-none outline-none leading-relaxed focus:border-cyan-500/40"
                  />
                  {mode === 'ab_prompts' && (
                    <div className="space-y-1">
                      <span className="text-[10px] text-teal-400 font-vazir">دستور سیستمی B:</span>
                      <textarea
                        value={systemPromptB}
                        onChange={(e) => setSystemPromptB(e.target.value)}
                        rows={2}
                        className="w-full p-2 rounded-xl bg-[#0a0a0d] border border-white/10 text-xs font-mono text-teal-100/90 resize-none outline-none focus:border-teal-500/40"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* User Prompt Input A */}
            <div className="space-y-2 pt-1 border-t border-white/5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-white/90 flex items-center gap-1.5 font-vazir">
                  <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{mode === 'ab_prompts' ? 'پرامپت A (کنترل / پایه):' : 'پرامپت ورودی (User Prompt):'}</span>
                </label>
                <span className="text-[10px] text-white/40 font-mono">
                  {promptA.length} کاراکتر
                </span>
              </div>

              <textarea
                value={promptA}
                onChange={(e) => setPromptA(e.target.value)}
                rows={mode === 'ab_prompts' ? 6 : 10}
                placeholder="دستورات، تگ‌های XML یا سوال خود را اینجا وارد کنید..."
                className="w-full p-3 rounded-xl bg-[#0a0a0e] border border-white/10 text-xs font-mono text-white/90 resize-none outline-none leading-relaxed focus:border-cyan-500/50 shadow-inner"
              />
            </div>

            {/* User Prompt Input B (Only in ab_prompts mode) */}
            {mode === 'ab_prompts' && (
              <div className="space-y-2 pt-2 border-t border-teal-500/20">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-semibold text-teal-300 flex items-center gap-1.5 font-vazir">
                    <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                    <span>پرامپت B (نسخه آزمایشی):</span>
                  </label>
                  <span className="text-[10px] text-teal-400/60 font-mono">
                    {promptB.length} کاراکتر
                  </span>
                </div>

                <textarea
                  value={promptB}
                  onChange={(e) => setPromptB(e.target.value)}
                  rows={6}
                  placeholder="نسخه دوم پرامپت جهت مقایسه..."
                  className="w-full p-3 rounded-xl bg-[#0a0a0e] border border-teal-500/30 text-xs font-mono text-teal-100 resize-none outline-none leading-relaxed focus:border-teal-400/50 shadow-inner"
                />
              </div>
            )}

            {/* Advanced Parameters (Temperature & MaxTokens) */}
            <div className="pt-2 border-t border-white/5 space-y-3">
              <button
                type="button"
                onClick={() => setShowAdvancedParams(!showAdvancedParams)}
                className="flex items-center justify-between w-full text-xs text-white/60 hover:text-white transition-colors font-vazir"
              >
                <div className="flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                  <span>پارامترهای پیشرفته تولید (Parameters)</span>
                </div>
                {showAdvancedParams ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showAdvancedParams && (
                <div className="p-3 rounded-xl bg-[#0a0a0e] border border-white/5 space-y-3 animate-in fade-in duration-150">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/70 font-vazir">خلاقیت (Temperature):</span>
                      <span className="font-mono text-cyan-400 font-bold">{temperature}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={temperature}
                      onChange={(e) => setTemperature(parseFloat(e.target.value))}
                      className="w-full accent-cyan-400 h-1 bg-white/10 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[9px] text-white/40 font-vazir">
                      <span>دقیق و قطعی (۰.۰)</span>
                      <span>متعادل (۰.۷)</span>
                      <span>خلاقانه (۱.۰)</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/70 font-vazir">حداکثر طول خروجی (Max Tokens):</span>
                      <span className="font-mono text-cyan-400 font-bold">{maxTokens}</span>
                    </div>
                    <input
                      type="range"
                      min="256"
                      max="4096"
                      step="256"
                      value={maxTokens}
                      onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                      className="w-full accent-cyan-400 h-1 bg-white/10 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Action Bar (Run / Stop / Clear) */}
            <div className="pt-2 flex items-center gap-2">
              {!isGenerating ? (
                <button
                  type="button"
                  onClick={handleRun}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-black font-vazir font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(34,211,238,0.25)]"
                >
                  <Play className="w-4 h-4 fill-black" />
                  <span>اجرای بنچ‌مارک (Run Test)</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleStop}
                  className="flex-1 py-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-vazir font-bold text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <Square className="w-4 h-4 fill-rose-400" />
                  <span>توقف تولید (Stop)</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setPromptA('');
                  setPromptB('');
                  setOutputA('');
                  setOutputB('');
                }}
                title="پاکسازی محیط"
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

        {/* RIGHT 8 Columns (67%): Output & Side-by-Side Analysis */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Error Banner if any */}
          {(errorA || errorB) && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between text-xs text-rose-300 font-vazir">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorA || errorB}</span>
              </div>
              <button
                type="button"
                onClick={handleRun}
                className="px-3 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/40 font-bold text-[11px]"
              >
                تلاش مجدد
              </button>
            </div>
          )}

          {/* Outputs Area */}
          {mode === 'single' ? (
            /* Single Output Card */
            <div className="bg-[#111116] border border-white/10 rounded-2xl overflow-hidden shadow-xl flex flex-col min-h-[420px]">
              <div className="px-4 py-3 bg-[#161620] border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white font-vazir">خروجی مدل هوش مصنوعی</h3>
                    <span className="text-[10px] text-white/50 font-mono">{modelA}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyText(outputA, 1)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-[11px] transition-colors"
                  >
                    {copiedIndex === 1 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedIndex === 1 ? 'کپی شد' : 'کپی خروجی'}</span>
                  </button>
                </div>
              </div>

              {/* Output Content */}
              <div className="p-4 flex-1 overflow-y-auto bg-[#0d0d12] custom-scrollbar">
                {outputA ? (
                  <pre className="text-xs font-mono text-white/90 whitespace-pre-wrap leading-relaxed select-text font-vazir">
                    {outputA}
                  </pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-white/30 space-y-2 py-12">
                    <Terminal className="w-8 h-8" />
                    <p className="text-xs font-vazir">پرامپت را وارد کرده و دکمه اجرای بنچ‌مارک را بزنید.</p>
                  </div>
                )}
              </div>

              {/* Technical Metrics & Scorecard */}
              {metricsA && (
                <div className="p-3 bg-[#14141c] border-t border-white/5 space-y-3">
                  <TechnicalMetricsBadge metrics={metricsA} isDemo={true} />
                </div>
              )}
            </div>
          ) : (
            /* Multi-Model or Prompt A/B Side-by-Side Dual View */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Output Variant A */}
              <div className="bg-[#111116] border border-white/10 rounded-2xl overflow-hidden shadow-xl flex flex-col min-h-[420px]">
                <div className="px-3.5 py-2.5 bg-[#161620] border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
                    <span className="text-xs font-bold text-white font-vazir truncate">
                      {mode === 'compare_models' ? `خروجی A (${modelA})` : 'خروجی پرامپت A (کنترل)'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopyText(outputA, 1)}
                    className="p-1 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                  >
                    {copiedIndex === 1 ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>

                <div className="p-3.5 flex-1 overflow-y-auto bg-[#0d0d12] custom-scrollbar text-xs font-mono text-white/90 whitespace-pre-wrap leading-relaxed select-text font-vazir">
                  {outputA || <span className="text-white/30 italic">در انتظار اجرا...</span>}
                </div>

                {metricsA && (
                  <div className="p-2.5 bg-[#14141c] border-t border-white/5 space-y-2">
                    <TechnicalMetricsBadge metrics={metricsA} isDemo={true} />
                    <BenchmarkScorecard
                      scorecard={scorecardA}
                      onChange={setScorecardA}
                      variantLabel="ارزیابی کیفیت خروجی A"
                    />
                  </div>
                )}
              </div>

              {/* Output Variant B */}
              <div className="bg-[#111116] border border-teal-500/20 rounded-2xl overflow-hidden shadow-xl flex flex-col min-h-[420px]">
                <div className="px-3.5 py-2.5 bg-teal-500/10 border-b border-teal-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2 h-2 rounded-full bg-teal-400 shrink-0" />
                    <span className="text-xs font-bold text-teal-300 font-vazir truncate">
                      {mode === 'compare_models' ? `خروجی B (${modelB})` : 'خروجی پرامپت B (آزمایشی)'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopyText(outputB, 2)}
                    className="p-1 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                  >
                    {copiedIndex === 2 ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>

                <div className="p-3.5 flex-1 overflow-y-auto bg-[#0d0d12] custom-scrollbar text-xs font-mono text-teal-100/90 whitespace-pre-wrap leading-relaxed select-text font-vazir">
                  {outputB || <span className="text-white/30 italic">در انتظار اجرا...</span>}
                </div>

                {metricsB && (
                  <div className="p-2.5 bg-[#14141c] border-t border-white/5 space-y-2">
                    <TechnicalMetricsBadge metrics={metricsB} isDemo={true} />
                    <BenchmarkScorecard
                      scorecard={scorecardB}
                      onChange={setScorecardB}
                      variantLabel="ارزیابی کیفیت خروجی B"
                    />
                  </div>
                )}
              </div>

            </div>
          )}

          {/* 3. AI Mentor Insight & Lesson Bridge (Always accessible below outputs) */}
          {(outputA || outputB) && (
            <MentorDifferenceInsight
              mode={mode}
              modelA={modelA}
              modelB={modelB}
              promptA={promptA}
              promptB={promptB}
              outputA={outputA}
              outputB={outputB}
              onNavigateLesson={(lessonId) => {
                if (onNavigate) {
                  onNavigate('lesson', lessonId);
                }
              }}
            />
          )}

        </div>
      </div>

      {/* 4. Modals & Drawers */}
      <BenchmarkTemplatesModal
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
        onSelectTemplate={handleApplyTemplate}
      />

      <BenchmarkNotebookDrawer
        isOpen={isNotebookOpen}
        onClose={() => setIsNotebookOpen(false)}
        hypothesis={hypothesis}
        setHypothesis={setHypothesis}
        observations={observations}
        setObservations={setObservations}
        learnings={learnings}
        setLearnings={setLearnings}
        onSaveCurrentExperiment={handleSaveToNotebook}
        savedExperiments={progress.experiments || []}
        onLoadExperiment={(exp) => {
          setExperimentTitle(exp.title);
          setHypothesis(exp.hypothesis);
          setPromptA(exp.promptA);
          setPromptB(exp.promptB);
          setOutputA(exp.outputA);
          setOutputB(exp.outputB);
          setObservations(exp.observations);
          setLearnings(exp.learnings);
        }}
        onExportExperiment={(exp) => {
          setIsExportOpen(true);
        }}
      />

      <ExportExperimentModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        experiment={{
          title: experimentTitle,
          mode,
          hypothesis,
          learnings,
          modelA,
          modelB: mode !== 'single' ? modelB : undefined,
          promptA,
          promptB: mode !== 'single' ? promptB : undefined,
          outputA,
          outputB: mode !== 'single' ? outputB : undefined,
          metricsA,
          metricsB: mode !== 'single' ? metricsB : undefined,
          scorecardA,
          scorecardB: mode !== 'single' ? scorecardB : undefined,
          parameters: { temperature, maxTokens }
        }}
      />

    </div>
  );
};
