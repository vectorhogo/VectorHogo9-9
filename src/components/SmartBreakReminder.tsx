import React, { useState, useEffect } from 'react';
import { Coffee, X, ArrowRight, Brain } from 'lucide-react';

interface SmartBreakReminderProps {
  onTakeBreak: () => void;
}

export const SmartBreakReminder: React.FC<SmartBreakReminderProps> = ({ onTakeBreak }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasDismissedThisSession, setHasDismissedThisSession] = useState(false);

  useEffect(() => {
    // Show after 12 minutes of active session if not dismissed
    const timer = setTimeout(() => {
      if (!hasDismissedThisSession) {
        setIsVisible(true);
      }
    }, 12 * 60 * 1000);

    return () => clearTimeout(timer);
  }, [hasDismissedThisSession]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 z-40 max-w-sm w-full bg-[#141414]/95 border border-cyan-500/30 backdrop-blur-xl rounded-3xl p-5 shadow-[0_10px_35px_rgba(0,0,0,0.6)] animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 shadow-sm">
          <Brain className="w-5 h-5" />
        </div>

        <div className="space-y-2 flex-1">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white font-vazir">پیشنهاد هوشمند استراحت</h4>
            <button
              onClick={() => {
                setIsVisible(false);
                setHasDismissedThisSession(true);
              }}
              className="text-gray-500 hover:text-gray-300 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs text-gray-300 leading-relaxed font-vazir">
            چند دقیقه است که داری تمرین می‌کنی. یک استراحت کوتاه در اتاق تمرکز می‌تونه کمکت کنه.
          </p>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => {
                setIsVisible(false);
                onTakeBreak();
              }}
              className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-[11px] rounded-xl font-vazir flex items-center gap-1.5 transition-all shadow-md"
            >
              <Coffee className="w-3 h-3" />
              <span>استراحت کوتاه</span>
            </button>

            <button
              onClick={() => {
                setIsVisible(false);
                setHasDismissedThisSession(true);
              }}
              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-[11px] rounded-xl font-vazir transition-colors"
            >
              ادامه میدم
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
