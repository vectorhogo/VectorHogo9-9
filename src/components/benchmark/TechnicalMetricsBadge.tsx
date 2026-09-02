import React from 'react';
import { TechnicalMetrics } from '../../services/ai/types';
import { 
  FileText, 
  Clock, 
  Hash, 
  CheckCircle2, 
  AlertCircle, 
  Layout, 
  Code2, 
  Braces,
  Cpu
} from 'lucide-react';

interface TechnicalMetricsBadgeProps {
  metrics?: TechnicalMetrics;
  isDemo?: boolean;
}

export const TechnicalMetricsBadge: React.FC<TechnicalMetricsBadgeProps> = ({
  metrics,
  isDemo = true
}) => {
  if (!metrics) return null;

  return (
    <div className="flex items-center flex-wrap gap-2 p-2.5 rounded-xl bg-[#0e0e13] border border-white/5 text-xs">
      <div className="flex items-center gap-1.5 text-white/50 pl-2 border-l border-white/10 font-vazir text-[11px]">
        <Cpu className="w-3.5 h-3.5 text-cyan-400" />
        <span>بررسی‌های فنی خودکار:</span>
      </div>

      {isDemo && (
        <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono text-[10px]">
          شبیه‌ساز دمو (Demo Mode)
        </span>
      )}

      {/* Word and Char count */}
      <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 text-white/80 font-mono text-[11px]">
        <Hash className="w-3 h-3 text-cyan-400" />
        <span>{metrics.wordCount} کلمه</span>
        <span className="text-white/30">|</span>
        <span>{metrics.characterCount} کاراکتر</span>
      </div>

      {/* Response time */}
      <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 text-white/80 font-mono text-[11px]">
        <Clock className="w-3 h-3 text-amber-400" />
        <span>{metrics.responseTimeMs} ms</span>
      </div>

      {/* Detected Format */}
      <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-mono text-[11px]">
        <Layout className="w-3 h-3" />
        <span>قالب: {metrics.detectedFormat}</span>
      </div>

      {/* JSON Validity Check */}
      {metrics.isJsonValid !== undefined && (
        <div
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-mono ${
            metrics.isJsonValid
              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
              : 'bg-rose-500/10 text-rose-300 border-rose-500/20'
          }`}
        >
          {metrics.isJsonValid ? (
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          ) : (
            <AlertCircle className="w-3 h-3 text-rose-400" />
          )}
          <span>{metrics.isJsonValid ? 'JSON Valid' : 'JSON Syntax Error'}</span>
        </div>
      )}

      {/* XML Tag presence */}
      {metrics.containsXmlTags && (
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-violet-500/10 text-violet-300 border border-violet-500/20 text-[11px] font-mono">
          <Code2 className="w-3 h-3" />
          <span>تگ‌های XML شناسایی شد</span>
        </div>
      )}

      {/* Token Estimate */}
      {metrics.estimatedTokens && (
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 text-white/60 font-mono text-[11px] mr-auto">
          <span>~{metrics.estimatedTokens.totalTokens} توکن تخمینی</span>
        </div>
      )}
    </div>
  );
};
