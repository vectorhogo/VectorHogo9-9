import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { ToastNotification } from '../types';

interface ToastContainerProps {
  toasts: ToastNotification[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div 
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-5 left-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((t) => {
        const type = t.type || 'info';

        const iconMap = {
          success: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
          error: <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />,
          warning: <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />,
          info: <Info className="w-4 h-4 text-cyan-400 shrink-0" />
        };

        const borderMap = {
          success: 'border-emerald-500/30 shadow-[0_4px_20px_rgba(16,185,129,0.15)]',
          error: 'border-rose-500/30 shadow-[0_4px_20px_rgba(244,63,94,0.15)]',
          warning: 'border-amber-500/30 shadow-[0_4px_20px_rgba(245,158,11,0.15)]',
          info: 'border-cyan-500/30 shadow-[0_4px_20px_rgba(34,211,238,0.15)]'
        };

        return (
          <div
            key={t.id}
            role="status"
            className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#141417]/95 backdrop-blur-md border ${borderMap[type]} text-right transition-all animate-fadeIn font-vazir`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {iconMap[type]}
              <span className="text-xs sm:text-sm font-medium text-gray-100 truncate">
                {t.message}
              </span>
            </div>

            <button
              onClick={() => onDismiss(t.id)}
              className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors shrink-0"
              aria-label="بستن اعلان"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
