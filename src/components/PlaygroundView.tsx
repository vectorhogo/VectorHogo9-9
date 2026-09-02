import React, { useState, useEffect } from 'react';
import { useProgress } from '../context/ProgressContext';
import { 
  SavedPrompt, 
  PromptTemplate, 
  PromptVersion, 
  PromptExperiment, 
  PromptNote 
} from '../types';
import { evaluateEducationalPrompt } from '../utils/promptScoringEngine';
import { autoImprovePrompt, PromptImprovementResult } from '../utils/promptAutoImprover';
import { PromptEditor } from './playground/PromptEditor';
import { PromptVisualBuilder } from './playground/PromptVisualBuilder';
import { PromptMentorPanel } from './playground/PromptMentorPanel';
import { PromptDoctorPanel } from './playground/PromptDoctorPanel';
import { PromptAnatomyLive } from './playground/PromptAnatomyLive';
import { PromptVariablesPanel } from './playground/PromptVariablesPanel';
import { PromptComparisonDiff } from './playground/PromptComparisonDiff';
import { PromptVersionHistory } from './playground/PromptVersionHistory';
import { PromptTemplateLibrary } from './playground/PromptTemplateLibrary';
import { PromptMissionView } from './playground/PromptMissionView';
import { PromptExperimentView } from './playground/PromptExperimentView';
import { PromptNotebookView } from './playground/PromptNotebookView';
import { KeyboardShortcutsModal } from './playground/KeyboardShortcutsModal';
import { PROMPT_SCENARIOS } from '../data/promptScenarios';
import { EDUCATIONAL_INSIGHTS } from '../data/educationalInsights';
import { 
  Terminal, 
  Sparkles, 
  Save, 
  RotateCcw, 
  Copy, 
  Check, 
  Play, 
  Stethoscope, 
  Layers, 
  Variable, 
  History, 
  ArrowRightLeft, 
  Bookmark, 
  Flame, 
  FlaskConical, 
  BookMarked, 
  Keyboard, 
  Sliders, 
  Cpu, 
  FileCode, 
  CheckCircle2, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Wand2,
  Info,
  Brain
} from 'lucide-react';

const INITIAL_STARTER_PROMPT = `<role>
تو یک معمار ارشد سیستم‌های نرم‌افزاری و مهندس فول‌استک با ۱۰ سال سابقه در طراحی مایکروسرویس‌ها هستی.
</role>

<context>
پروژه ما یک پلتفرم تجارت الکترونیک با ترافیک بیش از ۵۰ هزار درخواست در ثانیه است و از پایگاه داده PostgreSQL استفاده می‌کند.
</context>

<instructions>
یک سیستم صف پیام با استفاده از Redis Streams و Node.js برای مدیریت رویدادهای سفارش طراحی کن که تضمین Exactly-Once Delivery داشته باشد.
</instructions>

<audience>
تیم مهندسی بک‌اند و مهندسان قابلیت اطمینان سیستم (SRE).
</audience>

<rules>
- تمام کدهای نمونه را با TypeScript Strict و همراه با مدیریت خطای صریح بنویس.
- از کتابخانه‌های متفرقه و نامعتبر استفاده نکن.
- دیاگرام توالی پردازش پیام‌ها را شرح بده.
</rules>

<output_format>
۱. معماری کلیدی و منطق پردازش صف
۲. کدهای Worker و Producer در بلوک کد استاندارد
۳. استراتژی بازیابی خطای Dead Letter Queue
</output_format>`;

interface PlaygroundViewProps {
  initialPrompt?: string | null;
  onNavigate?: (view: string, lessonId?: string) => void;
}

export const PlaygroundView: React.FC<PlaygroundViewProps> = ({ initialPrompt, onNavigate }) => {
  const { 
    progress, 
    savePlaygroundPrompt, 
    deletePlaygroundPrompt, 
    completeMission, 
    saveExperiment, 
    addNote, 
    deleteNote, 
    createCollection,
    setActiveLessonId 
  } = useProgress();

  // Top-level Navigation Mode
  const [mainTab, setMainTab] = useState<'workspace' | 'templates' | 'missions' | 'experiments' | 'notebook' | 'scenarios' | 'insights'>('workspace');

  // Workspace View State
  const [editorMode, setEditorMode] = useState<'freeform' | 'builder'>('freeform');
  const [userPrompt, setUserPrompt] = useState<string>(initialPrompt || INITIAL_STARTER_PROMPT);
  const [systemPrompt, setSystemPrompt] = useState<string>('شما یک دستیار هوشمند و سیستم ارزیابی مهندسی پرامپت هستید.');
  const [showSystemPrompt, setShowSystemPrompt] = useState(false);

  // Sync when initialPrompt prop updates from navigation
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      setUserPrompt(initialPrompt);
      setMainTab('workspace');
    }
  }, [initialPrompt]);
  
  // Right Analysis Panel Sub-tab
  const [analysisTab, setAnalysisTab] = useState<'mentor' | 'doctor' | 'anatomy' | 'variables' | 'versions' | 'diff'>('mentor');
  
  // Versions
  const [versions, setVersions] = useState<PromptVersion[]>([
    {
      id: 'ver-init',
      versionNumber: 1,
      title: 'نسخه اولیه استاندارد (Initial Architecture)',
      userPrompt: INITIAL_STARTER_PROMPT,
      createdAt: new Date().toLocaleDateString('fa-IR'),
      score: 95
    }
  ]);

  // Modals & UI States
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveTitle, setSaveTitle] = useState('');
  const [saveTags, setSaveTags] = useState('Architecture, Backend');
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [diffImprovement, setDiffImprovement] = useState<PromptImprovementResult | null>(null);

  // Simulated Execution Runner
  const [selectedModel, setSelectedModel] = useState('Claude 3.7 Sonnet (Anthropic)');
  const [temperature, setTemperature] = useState(0.2);
  const [isRunning, setIsRunning] = useState(false);
  const [simulatedOutput, setSimulatedOutput] = useState<string | null>(null);

  // Real-time evaluation
  const evaluation = evaluateEducationalPrompt(userPrompt);

  // Auto-Save prompt to localStorage draft
  useEffect(() => {
    try {
      const draft = localStorage.getItem('promptlab_playground_draft');
      if (draft) {
        setUserPrompt(draft);
      }
    } catch {
      // ignore
    }
  }, []);

  const handlePromptChange = (val: string) => {
    setUserPrompt(val);
    try {
      localStorage.setItem('promptlab_playground_draft', val);
    } catch {
      // ignore
    }
  };

  // Auto Improve Trigger
  const handleTriggerAutoImprove = () => {
    const res = autoImprovePrompt(userPrompt);
    setDiffImprovement(res);
    setAnalysisTab('diff');
  };

  // Save Snapshot / Version
  const handleSaveSnapshot = (title: string) => {
    const newVer: PromptVersion = {
      id: 'ver-' + Date.now(),
      versionNumber: versions.length + 1,
      title,
      userPrompt,
      createdAt: new Date().toLocaleDateString('fa-IR'),
      score: evaluation.totalScore
    };
    setVersions([newVer, ...versions]);
  };

  // Save to Notebook
  const handleConfirmSaveToNotebook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!saveTitle.trim()) return;
    savePlaygroundPrompt({
      title: saveTitle.trim(),
      userPrompt,
      systemPrompt,
      model: selectedModel,
      tags: saveTags.split(',').map(t => t.trim()).filter(Boolean),
      score: evaluation.totalScore
    });
    setShowSaveModal(false);
    setSaveTitle('');
  };

  // Run Simulated Model Execution
  const handleRunExecution = () => {
    setIsRunning(true);
    setSimulatedOutput('در حال اعتبارسنجی کانتکست و پردازش در موتور هوش مصنوعی...');
    setTimeout(() => {
      setIsRunning(false);
      const isJsonRequested = /json/i.test(userPrompt);
      const isCodeRequested = /typescript|python|کد|sql|node/i.test(userPrompt);

      if (isJsonRequested) {
        setSimulatedOutput(`{\n  "status": "success",\n  "model": "${selectedModel}",\n  "timestamp": "${new Date().toISOString()}",\n  "result": {\n    "evaluation_score": ${evaluation.totalScore},\n    "quality_level": "${evaluation.qualityLevel}",\n    "execution_time_ms": 412,\n    "verified_guardrails": true\n  }\n}`);
      } else if (isCodeRequested) {
        setSimulatedOutput(`\`\`\`typescript
// معماری پردازش صف رویدادها با Redis Streams و Node.js
import { createClient } from 'redis';

interface OrderEvent {
  orderId: string;
  userId: string;
  totalAmount: number;
  timestamp: number;
}

export class OrderStreamProducer {
  private client: ReturnType<typeof createClient>;

  constructor(redisUrl: string) {
    this.client = createClient({ url: redisUrl });
  }

  async publishOrder(event: OrderEvent): Promise<string> {
    await this.client.connect();
    // درج رویداد در استریم با شناسه یکتا جهت تضمین Idempotency
    const messageId = await this.client.xAdd('stream:orders', '*', {
      payload: JSON.stringify(event),
      publishedAt: Date.now().toString()
    });
    return messageId;
  }
}
\`\`\`
\n✓ خروجی با موفقیت تولید شد و تمامی گاردریل‌های درخواستی رعایت گردید.`);
      } else {
        setSimulatedOutput(`### تحلیل و خروجی مدل ${selectedModel}:\n\nبر اساس پرامپت مهندسی‌شده و کانتکست ارائه‌شده:\n\n۱. **ساختار و چارچوب کلی**: درخواست شما با بالاترین ضریب اطمینان در لایه تحلیلی بررسی شد.\n۲. **انطباق با محدودیت‌ها**: تمامی خطوط قرمز تعریف شده در تگ <rules> لحاظ گردید.\n۳. **نتیجه‌گیری نهایی**: پرامپت به دلیل برخورداری از نقش مشخص و فرمت خروجی، بدون هیچ‌گونه توهم یا انحراف پاسخ داده شد.`);
      }
    }, 700);
  };

  const handleCopyFullPrompt = () => {
    navigator.clipboard.writeText(userPrompt);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  const handleNewPrompt = () => {
    setUserPrompt('');
    setSimulatedOutput(null);
  };

  const handleResetPrompt = () => {
    setUserPrompt(INITIAL_STARTER_PROMPT);
    setSimulatedOutput(null);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-68px)] w-full max-w-[1720px] mx-auto p-3 sm:p-4 lg:p-5 gap-3.5 animate-fadeIn">
      {/* Top Header & Navigation Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#111115] border border-white/10 p-3.5 rounded-2xl shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-teal-500/20 border border-cyan-500/30 text-cyan-400">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white tracking-wide">Prompt Playground 2.0</h1>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[10px] font-mono">
                AI Engineering Lab
              </span>
            </div>
            <p className="text-xs text-white/50 font-vazir">ایده‌ات را به یک Prompt حرفه‌ای تبدیل کن.</p>
          </div>
        </div>

        {/* Global Toolbar Actions */}
        <div className="flex items-center flex-wrap gap-1.5 w-full sm:w-auto justify-end">
          <button
            onClick={() => {
              setMainTab('workspace');
              setAnalysisTab('mentor');
            }}
            title="تحلیل عمیق پرامپت با هوش مصنوعی آموزشی"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-violet-600/30 to-purple-600/30 hover:from-violet-600/40 hover:to-purple-600/40 text-violet-200 border border-violet-500/40 text-xs font-semibold transition-all shadow-[0_0_12px_rgba(139,92,246,0.15)]"
          >
            <Brain className="w-3.5 h-3.5 text-violet-300" />
            <span>منتور پرامپت (Mentor)</span>
          </button>

          <button
            onClick={handleNewPrompt}
            title="ایجاد پرامپت جدید"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>پرامپت جدید</span>
          </button>

          <button
            onClick={handleResetPrompt}
            title="بازنشانی به الگوی پیش‌فرض"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors text-xs"
          >
            <span>الگوی مرجع</span>
          </button>

          <button
            onClick={handleCopyFullPrompt}
            title="کپی کامل پرامپت"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 transition-colors text-xs"
          >
            {copiedNotification ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedNotification ? 'کپی شد' : 'کپی'}</span>
          </button>

          <button
            onClick={() => setShowSaveModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 text-xs font-medium transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>ذخیره پرامپت</span>
          </button>

          <button
            onClick={() => setShowShortcutsModal(true)}
            title="کلیدهای میانبر"
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <Keyboard className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Mode Navigation Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-[#111115] border border-white/5 overflow-x-auto custom-scrollbar text-xs">
        <button
          onClick={() => setMainTab('workspace')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-all ${
            mainTab === 'workspace'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-medium'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>میز کار و پزشک پرامپت (Workspace)</span>
        </button>

        <button
          onClick={() => setMainTab('templates')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-all ${
            mainTab === 'templates'
              ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30 font-medium'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>کتابخانه الگوها (Templates)</span>
        </button>

        <button
          onClick={() => setMainTab('missions')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-all ${
            mainTab === 'missions'
              ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30 font-medium'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>ماموریت‌های سناریومحور (Missions)</span>
        </button>

        <button
          onClick={() => setMainTab('experiments')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-all ${
            mainTab === 'experiments'
              ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30 font-medium'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <FlaskConical className="w-3.5 h-3.5" />
          <span>آزمایشگاه A/B (Experiments)</span>
        </button>

        <button
          onClick={() => setMainTab('notebook')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-all ${
            mainTab === 'notebook'
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-medium'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <BookMarked className="w-3.5 h-3.5" />
          <span>دفترچه پرامپت (Notebook)</span>
        </button>

        <button
          onClick={() => setMainTab('scenarios')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-all ${
            mainTab === 'scenarios'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 font-medium'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <Lightbulb className="w-3.5 h-3.5" />
          <span>سناریوهای واقعی مشاغل (Scenarios)</span>
        </button>

        <button
          onClick={() => setMainTab('insights')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-all ${
            mainTab === 'insights'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>استانداردهای Anthropic & Best Practices</span>
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 min-h-0">
        {mainTab === 'workspace' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 h-full">
            {/* Left 7 Columns: Workspace & Editor / Builder + Simulated Execution */}
            <div className="lg:col-span-7 flex flex-col gap-3 h-full overflow-hidden">
              {/* Optional System Prompt Collapsible Drawer */}
              <div className="bg-[#111115] border border-white/10 rounded-xl overflow-hidden shrink-0">
                <button
                  onClick={() => setShowSystemPrompt(!showSystemPrompt)}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs text-white/60 hover:text-white hover:bg-white/5 transition-colors select-none"
                >
                  <div className="flex items-center gap-2">
                    <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                    <span>دستورالعمل سیستمی مدل (System Prompt)</span>
                  </div>
                  {showSystemPrompt ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {showSystemPrompt && (
                  <div className="p-3 border-t border-white/5 bg-[#0a0a0d]">
                    <textarea
                      value={systemPrompt}
                      onChange={(e) => setSystemPrompt(e.target.value)}
                      rows={2}
                      placeholder="پرسونا یا دستور سیستمی مدل..."
                      className="w-full p-2 rounded-lg bg-transparent text-xs text-white/80 font-mono outline-none resize-none border border-white/10"
                    />
                  </div>
                )}
              </div>

              {/* Editor Workspace Component */}
              <div className="flex-1 min-h-[360px]">
                {editorMode === 'freeform' ? (
                  <PromptEditor
                    prompt={userPrompt}
                    onChange={handlePromptChange}
                    onEvaluate={() => setAnalysisTab('doctor')}
                    onAutoImprove={handleTriggerAutoImprove}
                    onReset={handleResetPrompt}
                    onSave={() => setShowSaveModal(true)}
                    mode="freeform"
                    onToggleMode={() => setEditorMode('builder')}
                  />
                ) : (
                  <div className="flex flex-col h-full gap-2">
                    <div className="flex justify-end">
                      <button
                        onClick={() => setEditorMode('freeform')}
                        className="text-xs text-cyan-400 hover:text-cyan-300 font-medium px-2 py-1 rounded bg-cyan-500/10"
                      >
                        بازگشت به ادیتور متنی ←
                      </button>
                    </div>
                    <div className="flex-1 min-h-0">
                      <PromptVisualBuilder
                        onAssemble={(assembled) => {
                          setUserPrompt(assembled);
                          handlePromptChange(assembled);
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Model Execution & Simulated Playground Runner Bar */}
              <div className="p-3 rounded-2xl bg-[#111115] border border-white/10 flex flex-col gap-2.5 shrink-0">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      className="px-2.5 py-1.5 rounded-lg bg-[#16161c] border border-white/10 text-white text-xs outline-none cursor-pointer"
                    >
                      <option value="Claude 3.7 Sonnet (Anthropic)">Claude 3.7 Sonnet</option>
                      <option value="Claude 3.5 Haiku">Claude 3.5 Haiku</option>
                      <option value="Gemini 2.5 Pro">Gemini 2.5 Pro</option>
                      <option value="GPT-4o (OpenAI)">GPT-4o</option>
                    </select>

                    <div className="hidden sm:flex items-center gap-1 text-white/50 text-[11px]">
                      <span>دمای خلاقیت (Temp):</span>
                      <span className="font-mono text-cyan-300">{temperature}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleRunExecution}
                    disabled={isRunning || !userPrompt.trim()}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-semibold text-xs shadow-lg shadow-cyan-500/20 hover:opacity-90 transition-all disabled:opacity-40"
                  >
                    <Play className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
                    <span>{isRunning ? 'در حال اجرای شبیه‌ساز...' : 'تست پرامپت در مدل'}</span>
                  </button>
                </div>

                {simulatedOutput && (
                  <div className="mt-1 p-3 rounded-xl bg-[#0a0a0d] border border-white/5 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-white/40 font-mono">
                      <span>خروجی شبیه‌سازی‌شده (Simulated Preview):</span>
                      <span className="text-emerald-400">✓ اعتبارسنجی ساختار موفق</span>
                    </div>
                    <pre className="text-xs text-white/80 font-mono leading-relaxed whitespace-pre-wrap max-h-40 overflow-y-auto">
                      {simulatedOutput}
                    </pre>
                  </div>
                )}
              </div>
            </div>

            {/* Right 5 Columns: Analysis Intelligence Lab (Mentor / Doctor / Anatomy / Variables / Versions / Diff) */}
            <div className="lg:col-span-5 flex flex-col h-full bg-[#111115] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
              {/* Analysis Sub-tabs Header */}
              <div className="flex items-center gap-1 p-2 bg-[#16161c] border-b border-white/5 overflow-x-auto custom-scrollbar text-xs">
                <button
                  onClick={() => setAnalysisTab('mentor')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg whitespace-nowrap transition-all ${
                    analysisTab === 'mentor'
                      ? 'bg-violet-500/20 text-violet-300 font-semibold border border-violet-500/30'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  <Brain className="w-3.5 h-3.5 text-violet-400" />
                  <span>منتور هوشمند (Mentor)</span>
                </button>

                <button
                  onClick={() => setAnalysisTab('doctor')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg whitespace-nowrap transition-all ${
                    analysisTab === 'doctor'
                      ? 'bg-emerald-500/20 text-emerald-300 font-medium'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  <Stethoscope className="w-3.5 h-3.5" />
                  <span>پزشک پرامپت</span>
                </button>

                <button
                  onClick={() => setAnalysisTab('anatomy')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg whitespace-nowrap transition-all ${
                    analysisTab === 'anatomy'
                      ? 'bg-cyan-500/20 text-cyan-300 font-medium'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>آناتومی زنده</span>
                </button>

                <button
                  onClick={() => setAnalysisTab('variables')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg whitespace-nowrap transition-all ${
                    analysisTab === 'variables'
                      ? 'bg-purple-500/20 text-purple-300 font-medium'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  <Variable className="w-3.5 h-3.5" />
                  <span>متغیرها</span>
                </button>

                <button
                  onClick={() => setAnalysisTab('versions')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg whitespace-nowrap transition-all ${
                    analysisTab === 'versions'
                      ? 'bg-amber-500/20 text-amber-300 font-medium'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  <History className="w-3.5 h-3.5" />
                  <span>نسخه‌ها ({versions.length})</span>
                </button>

                {diffImprovement && (
                  <button
                    onClick={() => setAnalysisTab('diff')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg whitespace-nowrap transition-all ${
                      analysisTab === 'diff'
                        ? 'bg-teal-500/20 text-teal-300 font-medium'
                        : 'text-white/50 hover:text-white'
                    }`}
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                    <span>مقایسه Diff</span>
                  </button>
                )}
              </div>

              {/* Analysis Active View */}
              <div className="flex-1 min-h-0">
                {analysisTab === 'mentor' && (
                  <PromptMentorPanel
                    prompt={userPrompt}
                    onApplyImprovement={(improved) => {
                      setUserPrompt(improved);
                      handlePromptChange(improved);
                    }}
                  />
                )}

                {analysisTab === 'doctor' && (
                  <PromptDoctorPanel
                    evaluation={evaluation}
                    onNavigateToLesson={(lessonId) => setActiveLessonId(lessonId)}
                  />
                )}

                {analysisTab === 'anatomy' && (
                  <PromptAnatomyLive
                    evaluation={evaluation}
                    onNavigateToLesson={(lessonId) => setActiveLessonId(lessonId)}
                  />
                )}

                {analysisTab === 'variables' && (
                  <PromptVariablesPanel
                    prompt={userPrompt}
                    onApplyCompiledPrompt={(compiled) => {
                      setUserPrompt(compiled);
                      handlePromptChange(compiled);
                    }}
                  />
                )}

                {analysisTab === 'versions' && (
                  <PromptVersionHistory
                    versions={versions}
                    currentPrompt={userPrompt}
                    onSaveSnapshot={handleSaveSnapshot}
                    onRestoreVersion={(ver) => {
                      setUserPrompt(ver.userPrompt);
                      handlePromptChange(ver.userPrompt);
                    }}
                    onDeleteVersion={(id) => setVersions(versions.filter(v => v.id !== id))}
                  />
                )}

                {analysisTab === 'diff' && diffImprovement && (
                  <PromptComparisonDiff
                    improvement={diffImprovement}
                    onApplyImproved={(imp) => {
                      setUserPrompt(imp);
                      handlePromptChange(imp);
                      setAnalysisTab('doctor');
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Templates Tab */}
        {mainTab === 'templates' && (
          <PromptTemplateLibrary
            onSelectTemplate={(tpl) => {
              setUserPrompt(tpl.template);
              handlePromptChange(tpl.template);
              setMainTab('workspace');
              setAnalysisTab('doctor');
            }}
          />
        )}

        {/* Missions Tab */}
        {mainTab === 'missions' && (
          <PromptMissionView
            onCompleteMission={(missionId, score, xp) => completeMission(missionId, score, xp)}
            completedMissionIds={progress.completedMissions || []}
          />
        )}

        {/* Experiments Tab */}
        {mainTab === 'experiments' && (
          <PromptExperimentView
            onSaveExperiment={(exp) => saveExperiment(exp)}
          />
        )}

        {/* Notebook Tab */}
        {mainTab === 'notebook' && (
          <PromptNotebookView
            savedPrompts={progress.savedPrompts}
            collections={progress.collections || []}
            experiments={progress.experiments || []}
            notes={progress.notes || []}
            onLoadPrompt={(p) => {
              setUserPrompt(p.userPrompt);
              if (p.systemPrompt) setSystemPrompt(p.systemPrompt);
              handlePromptChange(p.userPrompt);
              setMainTab('workspace');
            }}
            onDeletePrompt={(id) => deletePlaygroundPrompt(id)}
            onCreateNote={(note) => addNote(note)}
            onDeleteNote={(id) => deleteNote(id)}
            onCreateCollection={(title) => createCollection(title)}
          />
        )}

        {/* Real-World Scenarios Tab */}
        {mainTab === 'scenarios' && (
          <div className="flex flex-col h-full bg-[#111115] border border-white/10 rounded-2xl overflow-hidden p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">سناریوهای واقعی و اشتباهات رایج مشاغل (Job Scenarios)</h3>
                <p className="text-xs text-white/50">مقایسه پرامپت‌های ضعیف و پرامپت‌های استاندارد در نقش‌های مختلف</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto custom-scrollbar">
              {PROMPT_SCENARIOS.map((sc) => (
                <div key={sc.id} className="p-4 rounded-xl bg-[#14141a] border border-white/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white">{sc.roleTitle}</h4>
                      <span className="text-[10px] font-mono text-cyan-400">{sc.domain}</span>
                    </div>
                  </div>

                  <p className="text-xs text-white/70 font-vazir leading-relaxed">
                    {sc.scenarioDescription}
                  </p>

                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300">
                      <span className="text-[10px] block text-rose-400 font-bold mb-0.5">اشتباه متداول (آماتور):</span>
                      <p className="font-mono text-xs">{sc.typicalMistakePrompt}</p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                      <span className="text-[10px] block text-emerald-400 font-bold mb-0.5">پرامپت استاندارد مهندسی‌شده:</span>
                      <pre className="font-mono text-[11px] whitespace-pre-wrap max-h-36 overflow-y-auto leading-relaxed">{sc.professionalPrompt}</pre>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <p className="text-[11px] text-amber-300/80 font-vazir"><strong>نکته:</strong> {sc.keyLearning}</p>
                    <button
                      onClick={() => {
                        setUserPrompt(sc.professionalPrompt);
                        handlePromptChange(sc.professionalPrompt);
                        setMainTab('workspace');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-cyan-500/15 text-cyan-300 hover:bg-cyan-500/25 text-xs font-medium shrink-0"
                    >
                      تست در ادیتور
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Anthropic Educational Insights Tab */}
        {mainTab === 'insights' && (
          <div className="flex flex-col h-full bg-[#111115] border border-white/10 rounded-2xl overflow-hidden p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">اصول رسمی مهندسی پرامپت Anthropic & Research Guidelines</h3>
                <p className="text-xs text-white/50">رهنمودهای اثبات‌شده برای بیشترین بازدهی مدل‌های هوش مصنوعی</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto custom-scrollbar">
              {EDUCATIONAL_INSIGHTS.map((ins) => (
                <div key={ins.id} className="p-4 rounded-xl bg-[#14141a] border border-white/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-cyan-300">{ins.title}</h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-white/40">{ins.source}</span>
                  </div>

                  <p className="text-xs text-white/80 font-vazir leading-relaxed">{ins.principleFa}</p>

                  <pre className="p-2.5 rounded-lg bg-[#0a0a0d] border border-white/5 text-xs font-mono text-cyan-100" dir="ltr">
                    {ins.exampleSnippet}
                  </pre>

                  <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 font-vazir">
                    <strong>نکته عملیاتی:</strong> {ins.actionableTip}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Save Prompt Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <form onSubmit={handleConfirmSaveToNotebook} className="w-full max-w-md bg-[#16161c] border border-white/10 rounded-2xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="text-sm font-bold text-white">ذخیره پرامپت در دفترچه پرامپت (Notebook)</h3>
              <span className="text-xs font-mono text-cyan-400">امتیاز: {evaluation.totalScore}</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-white/70">عنوان پرامپت:</label>
              <input
                type="text"
                required
                value={saveTitle}
                onChange={(e) => setSaveTitle(e.target.value)}
                placeholder="مثلاً: معماری صف Redis در نودجی‌اس..."
                className="w-full px-3 py-2 rounded-xl bg-[#0a0a0d] border border-white/10 text-xs text-white outline-none focus:border-cyan-500/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-white/70">برچسب‌ها (با کاما جدا کنید):</label>
              <input
                type="text"
                value={saveTags}
                onChange={(e) => setSaveTags(e.target.value)}
                placeholder="مثلاً: Backend, Redis, Architecture"
                className="w-full px-3 py-2 rounded-xl bg-[#0a0a0d] border border-white/10 text-xs text-white outline-none focus:border-cyan-500/50"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowSaveModal(false)}
                className="px-3 py-1.5 rounded-xl bg-white/5 text-white/60 text-xs hover:bg-white/10"
              >
                انصراف
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs transition-colors"
              >
                ذخیره در دفترچه
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        isOpen={showShortcutsModal}
        onClose={() => setShowShortcutsModal(false)}
      />
    </div>
  );
};
