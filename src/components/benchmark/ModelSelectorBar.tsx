import React, { useState } from 'react';
import { ModelOption } from '../../services/ai/types';
import { aiProviderRegistry } from '../../services/ai/providerRegistry';
import { Cpu, ChevronDown, Check, Sparkles, ShieldCheck, Zap, Info } from 'lucide-react';

interface ModelSelectorBarProps {
  selectedModelId: string;
  onSelectModel: (modelId: string) => void;
  label?: string;
  compact?: boolean;
}

export const ModelSelectorBar: React.FC<ModelSelectorBarProps> = ({
  selectedModelId,
  onSelectModel,
  label = 'مدل زبانی هوش مصنوعی (AI Model)',
  compact = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const models = aiProviderRegistry.getAllModels();
  const currentModel = models.find((m) => m.id === selectedModelId) || models[0];

  return (
    <div className="relative">
      {label && !compact && (
        <div className="flex items-center justify-between mb-1.5 text-xs text-white/70">
          <span className="font-semibold flex items-center gap-1.5 font-vazir">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>{label}</span>
          </span>
          <span className="text-[10px] text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 font-vazir flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" />
            <span>حالت آموزشی دمو</span>
          </span>
        </div>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between bg-[#14141a] hover:bg-[#181822] border ${
          isOpen ? 'border-cyan-500/50 shadow-[0_0_12px_rgba(34,211,238,0.15)]' : 'border-white/10'
        } rounded-xl px-3.5 py-2 text-right transition-all`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
            <Cpu className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-white truncate font-vazir">
                {currentModel.name}
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-400/10 text-cyan-300 border border-cyan-400/20 font-mono">
                {currentModel.contextWindow}
              </span>
            </div>
            {!compact && (
              <span className="text-[10px] text-white/40 block truncate font-vazir">
                {currentModel.specialtyFa}
              </span>
            )}
          </div>
        </div>

        <ChevronDown className={`w-4 h-4 text-white/50 transition-transform ${isOpen ? 'rotate-180 text-cyan-400' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full right-0 left-0 mt-2 z-50 bg-[#14141a] border border-white/15 rounded-2xl p-2 shadow-2xl space-y-1.5 max-h-80 overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95 duration-150">
            <div className="px-2.5 py-1 text-[10px] text-white/40 border-b border-white/5 flex items-center justify-between">
              <span>مدل‌های قابل انتخاب برای بنچ‌مارک:</span>
              <span className="font-mono text-cyan-400">{models.length} مدل فعال</span>
            </div>

            {models.map((model) => {
              const isSelected = model.id === currentModel.id;
              return (
                <button
                  key={model.id}
                  type="button"
                  onClick={() => {
                    onSelectModel(model.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-right p-2.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'bg-cyan-500/10 border-cyan-500/30 text-white shadow-[0_0_10px_rgba(34,211,238,0.08)]'
                      : 'bg-white/[0.02] hover:bg-white/[0.06] border-white/5 text-white/80'
                  }`}
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-white font-vazir">{model.name}</span>
                      {model.badge && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/5 text-gray-400 border border-white/10 font-vazir">
                          {model.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-white/50 leading-relaxed font-vazir line-clamp-2">
                      {model.description}
                    </p>
                    <div className="flex items-center gap-2 pt-0.5 text-[10px] text-cyan-400/80 font-mono">
                      <span>پنجره کانتکست: {model.contextWindow}</span>
                      <span>•</span>
                      <span>تخصص: {model.specialtyFa}</span>
                    </div>
                  </div>

                  <div className="shrink-0 pt-1">
                    {isSelected ? (
                      <div className="p-1 rounded-full bg-cyan-400 text-black">
                        <Check className="w-3 h-3" />
                      </div>
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-white/20" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
