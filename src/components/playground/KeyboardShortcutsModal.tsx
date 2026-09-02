import React from 'react';
import { Keyboard, X } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const SHORTCUTS = [
    { key: 'Ctrl + Enter', macKey: '⌘ + Enter', desc: 'ارزیابی و تحلیل لحظه‌ای پرامپت در پزشک پرامپت' },
    { key: 'Ctrl + S', macKey: '⌘ + S', desc: 'ذخیره پرامپت جاری در دفترچه پرامپت' },
    { key: 'Ctrl + Shift + I', macKey: '⌘ + ⇧ + I', desc: 'ارتقای خودکار پرامپت (Auto-Improve)' },
    { key: 'Tab', macKey: 'Tab', desc: 'درج ۲ فاصله (Indentation) در ادیتور' },
    { key: 'Esc', macKey: 'Esc', desc: 'بستن پنجره‌های بازشو یا خروج از تمام‌صفحه' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-[#16161c] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-white/5 bg-[#14141a]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Keyboard className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">کلیدهای میانبر پلی‌گراند (Shortcuts)</h3>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-2.5">
          {SHORTCUTS.map((s, idx) => (
            <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 text-xs">
              <span className="text-white/80 font-vazir">{s.desc}</span>
              <kbd className="px-2 py-1 rounded bg-[#0a0a0d] border border-white/10 font-mono text-cyan-300 text-[11px] font-semibold">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="p-3 bg-[#111115] border-t border-white/5 text-center">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-medium transition-colors"
          >
            متوجه شدم
          </button>
        </div>
      </div>
    </div>
  );
};
