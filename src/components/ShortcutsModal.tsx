import React, { useState, useEffect, useMemo } from 'react';
import { 
  Keyboard, 
  X, 
  Search, 
  Terminal, 
  Layers, 
  Navigation, 
  Gamepad2, 
  Sparkles, 
  Check, 
  Copy, 
  ExternalLink,
  Laptop,
  Command
} from 'lucide-react';
import { SHORTCUTS_DATA, SHORTCUT_CATEGORIES } from '../data/shortcuts';
import { ShortcutItem } from '../types';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (view: string) => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isMac, setIsMac] = useState<boolean>(() => {
    if (typeof navigator !== 'undefined') {
      return /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform || navigator.userAgent);
    }
    return false;
  });
  const [pressedKeys, setPressedKeys] = useState<string[]>([]);
  const [activeHighlightId, setActiveHighlightId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Live keyboard listener for highlighting matching shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if typing in search input
      if ((e.target as HTMLElement)?.tagName === 'INPUT') {
        if (e.key === 'Escape') {
          onClose();
        }
        return;
      }

      if (e.key === 'Escape') {
        onClose();
        return;
      }

      const activeKeys: string[] = [];
      if (e.ctrlKey || e.metaKey) activeKeys.push(isMac ? '⌘' : 'Ctrl');
      if (e.shiftKey) activeKeys.push('Shift');
      if (e.altKey) activeKeys.push('Alt');

      const mainKey = e.key.length === 1 ? e.key.toUpperCase() : e.key;
      if (!['Control', 'Meta', 'Shift', 'Alt'].includes(e.key)) {
        activeKeys.push(mainKey);
      }

      setPressedKeys(activeKeys);

      // Find matching shortcut
      const match = SHORTCUTS_DATA.find((item) => {
        const itemKeys = (isMac ? item.macKeys : item.keys).map((k) => k.toLowerCase());
        const keyName = e.key.toLowerCase();
        
        if (e.ctrlKey || e.metaKey) {
          if (keyName === 'k' && item.id.includes('search')) return true;
          if (keyName === 'enter' && item.id.includes('evaluate')) return true;
          if (keyName === 's' && item.id.includes('save')) return true;
          if (e.shiftKey && keyName === 'i' && item.id.includes('improve')) return true;
          if (e.shiftKey && keyName === 's' && item.id.includes('settings')) return true;
          if (e.shiftKey && keyName === 'f' && item.id.includes('focus')) return true;
        }

        if (e.key === '?' && item.id === 'global-help') return true;
        if (e.key === 'Escape' && item.id === 'global-esc') return true;
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key) && item.id === 'game-arrows') return true;
        if (e.code === 'Space' && item.id === 'game-pause') return true;
        if (keyName === 'r' && item.id === 'game-restart') return true;

        return false;
      });

      if (match) {
        setActiveHighlightId(match.id);
        const timer = setTimeout(() => {
          setActiveHighlightId(null);
        }, 1200);
        return () => clearTimeout(timer);
      }
    };

    const handleKeyUp = () => {
      setTimeout(() => {
        setPressedKeys([]);
      }, 350);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isOpen, isMac, onClose]);

  // Filtered shortcuts based on category and search query
  const filteredShortcuts = useMemo(() => {
    return SHORTCUTS_DATA.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const keysText = [...item.keys, ...item.macKeys].join(' ').toLowerCase();
      const descText = item.description.toLowerCase();
      const actionText = (item.actionName || '').toLowerCase();

      return keysText.includes(q) || descText.includes(q) || actionText.includes(q);
    });
  }, [selectedCategory, searchQuery]);

  const handleCopyShortcut = (item: ShortcutItem) => {
    const keys = isMac ? item.macKeys : item.keys;
    const text = `${item.actionName}: ${keys.join(' + ')}`;
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  if (!isOpen) return null;

  return (
    <div 
      id="keyboard-shortcuts-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="w-full max-w-3xl max-h-[90vh] bg-[#121217] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-right"
        dir="rtl"
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-white/10 bg-[#15151c] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shadow-inner">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">راهنمای کلیدهای میانبر (Keyboard Shortcuts)</h2>
                <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-gray-400">
                  {filteredShortcuts.length} میانبر
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                فهرست کامل و پویای تمام کلیدهای فوری برای تسریع یادگیری، ادیتور و ناوبری
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* OS Switcher */}
            <button
              onClick={() => setIsMac(!isMac)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-300 transition-colors"
              title="تغییر نمایش کلیدها بین ویندوز و مک"
            >
              {isMac ? (
                <>
                  <Command className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="font-mono text-[11px]">macOS</span>
                </>
              ) : (
                <>
                  <Laptop className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="font-mono text-[11px]">Windows / Linux</span>
                </>
              )}
            </button>

            <button
              id="shortcuts-modal-close"
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="بستن"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Interactive Key Tester Strip */}
        <div className="px-5 py-2.5 bg-[#0e0e13] border-b border-white/5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-gray-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>تست زنده: کلیدهای کیبورد را فشار دهید تا میانبر مرتبط در جدول روشن شود:</span>
          </div>

          <div className="flex items-center gap-1.5 font-mono">
            {pressedKeys.length > 0 ? (
              pressedKeys.map((k, i) => (
                <span 
                  key={i} 
                  className="px-2 py-0.5 rounded bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-bold text-xs shadow-sm animate-bounce"
                >
                  {k}
                </span>
              ))
            ) : (
              <span className="text-[11px] text-gray-500 font-vazir">در انتظار فشردن کلید...</span>
            )}
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="p-4 bg-[#14141a] border-b border-white/5 space-y-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجو در نام میانبر، کلید (مثال: Ctrl+K یا Enter) یا عملکرد..."
              className="w-full pl-9 pr-9 py-2 rounded-xl bg-[#0b0b0e] border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {SHORTCUT_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'bg-white/5 text-gray-400 hover:text-gray-200 hover:bg-white/10 border border-transparent'
                  }`}
                >
                  {cat.id === 'all' && <Layers className="w-3.5 h-3.5" />}
                  {cat.id === 'global' && <Navigation className="w-3.5 h-3.5" />}
                  {cat.id === 'playground' && <Terminal className="w-3.5 h-3.5" />}
                  {cat.id === 'palette' && <Search className="w-3.5 h-3.5" />}
                  {cat.id === 'games' && <Gamepad2 className="w-3.5 h-3.5" />}
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Shortcuts List Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filteredShortcuts.length === 0 ? (
            <div className="py-12 text-center text-gray-500 space-y-2">
              <Keyboard className="w-8 h-8 mx-auto opacity-40 text-gray-400" />
              <p className="text-sm">میانبری منطبق با عبارت «{searchQuery}» یافت نشد.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="text-xs text-cyan-400 hover:underline"
              >
                پاک‌کردن فیلترها
              </button>
            </div>
          ) : (
            filteredShortcuts.map((item) => {
              const keys = isMac ? item.macKeys : item.keys;
              const isHighlighted = activeHighlightId === item.id;
              const isCopied = copiedId === item.id;

              return (
                <div
                  key={item.id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl border transition-all duration-200 gap-3 ${
                    isHighlighted
                      ? 'bg-cyan-500/15 border-cyan-400 shadow-lg shadow-cyan-500/10 ring-2 ring-cyan-500/30 scale-[1.01]'
                      : 'bg-[#16161d]/80 hover:bg-[#191922] border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <div className={`p-2 rounded-lg mt-0.5 sm:mt-0 ${
                      item.category === 'global' ? 'bg-blue-500/10 text-blue-400' :
                      item.category === 'playground' ? 'bg-cyan-500/10 text-cyan-400' :
                      item.category === 'palette' ? 'bg-violet-500/10 text-violet-400' :
                      'bg-amber-500/10 text-amber-400'
                    }`}>
                      {item.category === 'global' && <Navigation className="w-4 h-4" />}
                      {item.category === 'playground' && <Terminal className="w-4 h-4" />}
                      {item.category === 'palette' && <Search className="w-4 h-4" />}
                      {item.category === 'games' && <Gamepad2 className="w-4 h-4" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white">
                          {item.actionName}
                        </span>
                        {item.targetView && onNavigate && (
                          <button
                            onClick={() => {
                              onClose();
                              onNavigate(item.targetView!);
                            }}
                            className="text-[10px] text-cyan-400 hover:underline flex items-center gap-0.5"
                            title="پرش مستقیم به این بخش"
                          >
                            <span>ورود</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Keys Badges */}
                  <div className="flex items-center justify-end gap-1.5 shrink-0 mr-auto sm:mr-0">
                    <div className="flex items-center gap-1 font-mono">
                      {keys.map((k, kidx) => (
                        <React.Fragment key={kidx}>
                          <kbd className="min-w-[28px] px-2.5 py-1 text-center rounded-lg bg-[#0b0b0f] border border-white/15 text-cyan-300 font-semibold text-xs shadow-inner shadow-black/60">
                            {k}
                          </kbd>
                          {kidx < keys.length - 1 && (
                            <span className="text-gray-500 text-xs font-bold">+</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>

                    <button
                      onClick={() => handleCopyShortcut(item)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors mr-1"
                      title="کپی کردن میانبر"
                    >
                      {isCopied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#14141a] border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <span className="text-gray-500">کلید میانبر سراسری برای باز کردن این پنجره:</span>
            <kbd className="px-2 py-0.5 rounded bg-[#0a0a0e] border border-white/15 text-cyan-300 font-mono text-xs font-bold">
              ?
            </kbd>
            <span className="text-gray-500">یا</span>
            <kbd className="px-2 py-0.5 rounded bg-[#0a0a0e] border border-white/15 text-cyan-300 font-mono text-xs font-bold">
              Shift + /
            </kbd>
          </div>

          <div className="flex items-center gap-2 justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition-colors shadow-lg shadow-cyan-500/20"
            >
              متوجه شدم
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
