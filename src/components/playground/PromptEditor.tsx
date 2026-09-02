import React, { useState, useEffect, useRef } from 'react';
import { 
  Copy, 
  Check, 
  Sparkles, 
  RotateCcw, 
  AlignRight, 
  AlignLeft, 
  Hash, 
  Maximize2, 
  Minimize2, 
  Wand2, 
  Layers,
  Terminal,
  Zap
} from 'lucide-react';

interface PromptEditorProps {
  prompt: string;
  onChange: (value: string) => void;
  onEvaluate?: () => void;
  onAutoImprove?: () => void;
  onReset?: () => void;
  onSave?: () => void;
  mode?: 'freeform' | 'builder';
  onToggleMode?: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export const PromptEditor: React.FC<PromptEditorProps> = ({
  prompt,
  onChange,
  onEvaluate,
  onAutoImprove,
  onReset,
  onSave,
  mode = 'freeform',
  onToggleMode,
  disabled = false,
  placeholder = 'پرامپت خود را اینجا بنویسید یا با تگ‌های <role>, <context>, <task> ساختاربندی کنید...'
}) => {
  const [copied, setCopied] = useState(false);
  const [isLtr, setIsLtr] = useState(false);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Word, char & token counts
  const charCount = prompt.length;
  const wordCount = prompt.trim() ? prompt.trim().split(/\s+/).length : 0;
  const estimatedTokens = Math.max(1, Math.round(charCount / 3.8));
  const lines = prompt.split('\n');
  const lineCount = lines.length;

  const handleCopy = () => {
    if (!prompt) return;
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Format / Beautify XML tags
  const handleFormat = () => {
    let formatted = prompt
      .replace(/></g, '>\n<')
      .replace(/(<\/[a-zA-Z0-9_]+>)/g, '$1\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    onChange(formatted);
  };

  // Keyboard shortcuts listener
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl/Cmd + Enter to trigger evaluation or analyze
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onEvaluate?.();
    }
    // Ctrl/Cmd + S to save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      onSave?.();
    }
    // Tab key handling for indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newValue = prompt.substring(0, start) + '  ' + prompt.substring(end);
      onChange(newValue);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  return (
    <div className={`flex flex-col bg-[#111115] border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 ${isFullscreen ? 'fixed inset-4 z-50 shadow-2xl bg-[#0e0e12]' : 'h-full'}`}>
      {/* Editor Header Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#16161c] border-b border-white/5 text-xs text-white/70">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 text-white/80 font-mono">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>Workspace Editor</span>
          </div>

          {onToggleMode && (
            <button
              onClick={onToggleMode}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all ${
                mode === 'builder' 
                  ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300 font-medium' 
                  : 'bg-white/5 border-transparent text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{mode === 'builder' ? 'ویژوال بیلدر فعال' : 'نمای کد آزاد'}</span>
            </button>
          )}

          {/* Quick Format Button */}
          <button
            onClick={handleFormat}
            title="مرتب‌سازی تگ‌ها و ساختار"
            className="flex items-center gap-1 px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Format XML</span>
          </button>
        </div>

        {/* Right Tools: Direction, Line numbers, Copy, Auto Improve */}
        <div className="flex items-center gap-1.5">
          {onAutoImprove && (
            <button
              onClick={onAutoImprove}
              title="بهینه‌سازی هوشمند پرامپت (Auto-Improve)"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25 transition-all text-xs font-medium"
            >
              <Wand2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>ارتقای خودکار (Auto)</span>
            </button>
          )}

          {/* Toggle RTL / LTR */}
          <button
            onClick={() => setIsLtr(!isLtr)}
            title={isLtr ? 'تغییر به راست‌به‌چپ (فارسی)' : 'Switch to LTR (English)'}
            className={`p-1.5 rounded transition-colors ${isLtr ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 text-white/60 hover:text-white'}`}
          >
            {isLtr ? <AlignLeft className="w-3.5 h-3.5" /> : <AlignRight className="w-3.5 h-3.5" />}
          </button>

          {/* Toggle Line numbers */}
          <button
            onClick={() => setShowLineNumbers(!showLineNumbers)}
            title="نمایش/عدم نمایش شماره خطوط"
            className={`p-1.5 rounded transition-colors ${showLineNumbers ? 'bg-white/15 text-white' : 'bg-white/5 text-white/50 hover:text-white'}`}
          >
            <Hash className="w-3.5 h-3.5" />
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            title="کپی متن کامل پرامپت"
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-white/80 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-medium">کپی شد</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>کپی</span>
              </>
            )}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'خروج از تمام‌صفحه' : 'نمایش تمام‌صفحه'}
            className="p-1.5 rounded bg-white/5 text-white/60 hover:text-white transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Textarea with Line Numbers */}
      <div className="relative flex flex-1 min-h-[340px] bg-[#0c0c10] overflow-hidden">
        {showLineNumbers && (
          <div className="select-none py-3 px-2 bg-[#09090c] border-l border-white/5 text-white/20 text-xs font-mono text-center min-w-[36px]">
            {Array.from({ length: Math.max(12, lineCount) }).map((_, i) => (
              <div key={i} className="leading-6 h-6">
                {i + 1}
              </div>
            ))}
          </div>
        )}

        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          dir={isLtr ? 'ltr' : 'rtl'}
          placeholder={placeholder}
          className={`flex-1 p-3.5 bg-transparent text-white/90 text-sm font-mono leading-6 outline-none resize-none focus:ring-0 ${
            isLtr ? 'text-left font-mono' : 'text-right font-vazir'
          } placeholder:text-white/25 selection:bg-cyan-500/30 selection:text-white`}
          spellCheck={false}
        />
      </div>

      {/* Editor Footer / Metadata Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#14141a] border-t border-white/5 text-xs text-white/60 font-mono">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="text-white/40">تعداد کلمات:</span>
            <span className="text-white font-medium">{wordCount.toLocaleString('fa-IR')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-white/40">کاراکتر:</span>
            <span className="text-white font-medium">{charCount.toLocaleString('fa-IR')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-white/40">توکن تخمینی:</span>
            <span className="text-cyan-400 font-medium">~{estimatedTokens.toLocaleString('fa-IR')}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1 text-white/40 text-[11px]">
            <span>کلید میانبر:</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/80 font-mono">Ctrl + Enter</kbd>
            <span>ارزیابی</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400/80">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px]">ذخیره‌سازی خودکار محلی</span>
          </div>
        </div>
      </div>
    </div>
  );
};
