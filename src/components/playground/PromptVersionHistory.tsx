import React, { useState } from 'react';
import { PromptVersion } from '../../types';
import { 
  History, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Copy, 
  Clock, 
  Award, 
  Check,
  FileText
} from 'lucide-react';

interface PromptVersionHistoryProps {
  versions: PromptVersion[];
  currentPrompt: string;
  onSaveSnapshot: (title: string) => void;
  onRestoreVersion: (version: PromptVersion) => void;
  onDeleteVersion?: (versionId: string) => void;
}

export const PromptVersionHistory: React.FC<PromptVersionHistoryProps> = ({
  versions,
  currentPrompt,
  onSaveSnapshot,
  onRestoreVersion,
  onDeleteVersion
}) => {
  const [snapshotTitle, setSnapshotTitle] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!snapshotTitle.trim()) return;
    onSaveSnapshot(snapshotTitle.trim());
    setSnapshotTitle('');
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#111115] border border-white/10 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#16161c] border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">تاریخچه نسخه‌ها (Version History)</h3>
            <p className="text-[11px] text-white/50">ثبت اسنپ‌شات و بازیابی نگارش‌های قبلی پرامپت</p>
          </div>
        </div>

        <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
          {versions.length} نسخه ثبت‌شده
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {/* Create Snapshot Input */}
        <form onSubmit={handleSave} className="flex gap-2">
          <input
            type="text"
            value={snapshotTitle}
            onChange={(e) => setSnapshotTitle(e.target.value)}
            placeholder="عنوان نسخه جدید (مثلاً: افزودن محدودیت‌های امنیتی)..."
            className="flex-1 px-3 py-2 rounded-xl bg-[#14141a] border border-white/10 text-xs text-white placeholder:text-white/30 focus:border-amber-500/50 outline-none"
          />
          <button
            type="submit"
            disabled={!snapshotTitle.trim()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-medium transition-colors disabled:opacity-40"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>ثبت نسخه</span>
          </button>
        </form>

        {/* Versions Timeline List */}
        {versions.length === 0 ? (
          <div className="text-center py-10 px-4 bg-[#14141a] rounded-xl border border-dashed border-white/10 space-y-2">
            <History className="w-8 h-8 text-white/20 mx-auto" />
            <h4 className="text-xs font-semibold text-white/80">هنوز نسخه‌ای ذخیره نشده است</h4>
            <p className="text-xs text-white/50 max-w-sm mx-auto font-vazir">
              با تغییرات در پرامپت، می‌توانید اسنپ‌شات‌های نام‌گذاری‌شده ثبت کنید تا در هر لحظه امکان بازگشت داشته باشید.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {versions.map((ver, idx) => (
              <div
                key={ver.id}
                className="p-3.5 rounded-xl bg-[#14141a] border border-white/5 hover:border-white/15 transition-all space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] font-mono text-cyan-400 font-bold">
                      v{ver.versionNumber || idx + 1}
                    </span>
                    <h4 className="text-xs font-semibold text-white">{ver.title || 'بدون عنوان'}</h4>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-white/40">
                    <Clock className="w-3 h-3" />
                    <span>{ver.createdAt}</span>
                  </div>
                </div>

                <p className="text-xs text-white/60 font-mono line-clamp-2 bg-[#0c0c10] p-2 rounded-lg border border-white/5" dir="auto">
                  {ver.userPrompt}
                </p>

                <div className="flex items-center justify-between pt-1 border-t border-white/5">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                    {ver.score && (
                      <>
                        <Award className="w-3.5 h-3.5" />
                        <span>امتیاز: {ver.score}</span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(ver.id, ver.userPrompt)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors text-xs"
                      title="کپی پرامپت"
                    >
                      {copiedId === ver.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => onRestoreVersion(ver)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/15 text-cyan-300 hover:bg-cyan-500/25 transition-colors text-xs font-medium"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>بازیابی</span>
                    </button>

                    {onDeleteVersion && (
                      <button
                        onClick={() => onDeleteVersion(ver.id)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-white/40 hover:text-rose-400 transition-colors text-xs"
                        title="حذف نسخه"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
