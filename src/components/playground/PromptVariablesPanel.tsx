import React, { useState, useEffect } from 'react';
import { PromptVariable } from '../../types';
import { 
  Variable, 
  Copy, 
  Check, 
  Sparkles, 
  RotateCcw,
  ArrowRight,
  Info
} from 'lucide-react';

interface PromptVariablesPanelProps {
  prompt: string;
  onApplyCompiledPrompt?: (compiled: string) => void;
}

export const PromptVariablesPanel: React.FC<PromptVariablesPanelProps> = ({
  prompt,
  onApplyCompiledPrompt
}) => {
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  // Extract all {{variable}} from prompt
  const extractedVariables: string[] = Array.from(
    new Set((prompt.match(/\{\{([a-zA-Z0-9_\u0600-\u06FF]+)\}\}/g) || []).map(m => m.replace(/[{}]/g, '')))
  );

  // Sync state when new variables appear
  useEffect(() => {
    setVariableValues(prev => {
      const updated = { ...prev };
      extractedVariables.forEach(v => {
        if (updated[v] === undefined) {
          updated[v] = '';
        }
      });
      return updated;
    });
  }, [prompt]);

  // Compute compiled prompt
  let compiledPrompt = prompt;
  extractedVariables.forEach(v => {
    const val = variableValues[v] || `{{${v}}}`;
    compiledPrompt = compiledPrompt.replaceAll(`{{${v}}}`, val);
  });

  const handleCopyCompiled = () => {
    if (!compiledPrompt) return;
    navigator.clipboard.writeText(compiledPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#111115] border border-white/10 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#16161c] border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Variable className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">متغیرهای پویا (Prompt Variables)</h3>
            <p className="text-[11px] text-white/50">تعریف الگوهای بازاستفاده با سینتکس {"{{نام_متغیر}}"}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300">
            {extractedVariables.length} متغیر یافت شد
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {extractedVariables.length === 0 ? (
          <div className="text-center py-10 px-4 bg-[#14141a] rounded-xl border border-dashed border-white/10 space-y-2">
            <Variable className="w-8 h-8 text-white/20 mx-auto" />
            <h4 className="text-xs font-semibold text-white/80">هیچ متغیری در پرامپت یافت نشد</h4>
            <p className="text-xs text-white/50 max-w-sm mx-auto font-vazir leading-relaxed">
              برای استفاده از متغیرها، هر کلمه دلخواه را در دو آکولاد مانند <code className="text-cyan-400 font-mono">{"{{product_name}}"}</code> یا <code className="text-cyan-400 font-mono">{"{{موضوع}}"}</code> بنویسید.
            </p>
          </div>
        ) : (
          <>
            {/* Variable Input Fields */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-white/80">مقداردهی به متغیرها:</h4>
              <div className="space-y-2.5">
                {extractedVariables.map((variable) => (
                  <div key={variable} className="p-3 rounded-xl bg-[#14141a] border border-white/5 space-y-1.5">
                    <label className="flex items-center justify-between text-xs font-mono text-cyan-300">
                      <span>{"{{" + variable + "}}"}</span>
                      <span className="text-[10px] text-white/40">متغیر پویا</span>
                    </label>
                    <input
                      type="text"
                      value={variableValues[variable] || ''}
                      onChange={(e) => setVariableValues({ ...variableValues, [variable]: e.target.value })}
                      placeholder={`مقدار جایگزین برای ${variable}...`}
                      className="w-full px-3 py-2 rounded-lg bg-[#0a0a0d] border border-white/10 text-xs text-white placeholder:text-white/20 focus:border-purple-500/50 outline-none transition-colors"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Compiled Live Preview */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-white/80">پیش‌نمایش پرامپت نهایی (Compiled):</h4>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyCompiled}
                    className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'کپی شد' : 'کپی خروجی'}</span>
                  </button>
                  {onApplyCompiledPrompt && (
                    <button
                      onClick={() => onApplyCompiledPrompt(compiledPrompt)}
                      className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 font-medium transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>اعمال در ادیتور</span>
                    </button>
                  )}
                </div>
              </div>

              <pre className="p-3.5 rounded-xl bg-[#0a0a0d] border border-white/10 text-white/80 font-mono text-xs leading-relaxed whitespace-pre-wrap max-h-56 overflow-y-auto">
                {compiledPrompt}
              </pre>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
