import React, { useState, useRef, useMemo } from 'react';
import { 
  Settings, 
  X, 
  Download, 
  Upload, 
  Trash2, 
  Check, 
  AlertTriangle, 
  ShieldCheck, 
  Moon, 
  Sun, 
  Monitor, 
  Eye, 
  Type, 
  Sliders, 
  Bell, 
  Coffee, 
  Volume2, 
  VolumeX, 
  Keyboard, 
  Database, 
  Info, 
  Sparkles,
  RefreshCw,
  FileJson,
  CheckCircle2,
  AlertCircle,
  History,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ArrowLeftRight,
  FileText,
  HardDrive,
  ExternalLink
} from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { ThemeMode, PromptLabExportPackage, MigrationLogEntry } from '../types';
import { playSuccessChime } from '../utils/soundEffects';
import { inspectSchemaKeyHealth } from '../utils/dataMigration';
import { ShortcutsModal } from './ShortcutsModal';
import { SHORTCUTS_DATA } from '../data/shortcuts';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestartOnboarding?: () => void;
}

type TabType = 'appearance' | 'learning' | 'shortcuts' | 'data' | 'about';

export const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose,
  onRestartOnboarding 
}) => {
  const { 
    progress, 
    settings, 
    updateSettings, 
    resetProgressOnly, 
    resetAllData, 
    exportFullBackupJSON, 
    validateAndPrepareImport, 
    executeImport,
    resetOnboarding,
    migrationLogs = [],
    verifySchemaIntegrity,
    clearMigrationLogsHistory
  } = useProgress();

  const [activeTab, setActiveTab] = useState<TabType>('appearance');
  const [isShortcutsHelperOpen, setIsShortcutsHelperOpen] = useState(false);
  
  // Data management state
  const [importJsonText, setImportJsonText] = useState('');
  const [validatedPackage, setValidatedPackage] = useState<PromptLabExportPackage | null>(null);
  const [importMode, setImportMode] = useState<'merge' | 'replace'>('merge');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  // Migration Log state
  const [isVerifyingSchema, setIsVerifyingSchema] = useState(false);
  const [logFilter, setLogFilter] = useState<'all' | 'verified' | 'imported' | 'success' | 'warning'>('all');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [confirmClearLogs, setConfirmClearLogs] = useState(false);
  const [exportLogsSuccess, setExportLogsSuccess] = useState(false);

  // Reset confirmation state
  const [confirmMode, setConfirmMode] = useState<'none' | 'progress_only' | 'all_data'>('none');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtered migration logs
  const filteredMigrationLogs = useMemo(() => {
    if (logFilter === 'all') return migrationLogs;
    return migrationLogs.filter((log) => log.status === logFilter);
  }, [migrationLogs, logFilter]);

  // Keys Health analysis
  const schemaHealth = useMemo(() => {
    return inspectSchemaKeyHealth(progress);
  }, [progress, migrationLogs]);

  // Handle Run Schema Verification
  const handleRunVerification = () => {
    setIsVerifyingSchema(true);
    setTimeout(() => {
      const entry = verifySchemaIntegrity();
      if (entry?.id) {
        setExpandedLogId(entry.id);
      }
      setIsVerifyingSchema(false);
    }, 400);
  };

  // Handle Export Migration Diagnostics
  const handleExportDiagnostics = () => {
    const data = {
      exportTimestamp: new Date().toISOString(),
      currentSchemaVersion: '1.0',
      systemHealth: 'HEALTHY',
      schemaKeys: schemaHealth,
      migrationHistory: migrationLogs,
      summary: {
        completedLessons: progress.completedLessons.length,
        savedPrompts: progress.savedPrompts.length,
        xp: progress.xp,
        streakDays: progress.learningStreakDays
      }
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `promptlab-schema-diagnostics-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExportLogsSuccess(true);
    setTimeout(() => setExportLogsSuccess(false), 2500);
  };

  if (!isOpen) return null;

  // Handle Export Download
  const handleExportDownload = () => {
    const jsonStr = exportFullBackupJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `promptlab-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  };

  // Handle File Input for Import
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      processImportContent(content);
    };
    reader.readAsText(file);
  };

  // Validate Import JSON
  const processImportContent = (rawJson: string) => {
    setImportJsonText(rawJson);
    setValidationError(null);
    setValidatedPackage(null);

    const result = validateAndPrepareImport(rawJson);
    if (!result.valid || !result.data) {
      setValidationError(result.error || 'فایل معتبر نیست یا با نسخه فعلی PromptLab سازگار نیست.');
    } else {
      setValidatedPackage(result.data);
    }
  };

  // Execute Import
  const handleApplyImport = () => {
    if (!validatedPackage) return;
    const ok = executeImport(validatedPackage, importMode);
    if (ok) {
      setImportSuccess(true);
      setTimeout(() => {
        setImportSuccess(false);
        setValidatedPackage(null);
        setImportJsonText('');
        onClose();
      }, 1500);
    }
  };

  // Handle Reset Execution
  const handleExecuteReset = () => {
    if (confirmMode === 'progress_only') {
      resetProgressOnly();
    } else if (confirmMode === 'all_data') {
      resetAllData();
    }
    setConfirmMode('none');
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div 
        role="dialog"
        aria-modal="true"
        aria-label="تنظیمات پلتفرم و مدیریت داده‌ها"
        className="w-full max-w-2xl bg-[#141417] border border-white/10 rounded-3xl shadow-2xl overflow-hidden text-right font-vazir flex flex-col max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/5 flex items-center justify-between bg-[#111114]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-400/10 text-cyan-400 flex items-center justify-center border border-cyan-400/20">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">تنظیمات پلتفرم و مدیریت داده‌ها</h2>
              <p className="text-[11px] text-gray-400">شخصی‌سازی ظاهر، یادگیری، کلیدهای میانبر و پشتیبان‌گیری</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#0d0d10] text-gray-400 hover:text-white border border-white/5"
            aria-label="بستن پنجره"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 p-2 bg-[#0c0c0e] border-b border-white/5 overflow-x-auto custom-scrollbar">
          {[
            { id: 'appearance', label: 'ظاهر و دسترسی', icon: Sliders },
            { id: 'learning', label: 'یادگیری و تمرکز', icon: Bell },
            { id: 'shortcuts', label: 'کلیدهای میانبر', icon: Keyboard },
            { id: 'data', label: 'پشتیبان و داده‌ها', icon: Database },
            { id: 'about', label: 'درباره', icon: Info }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition-all shrink-0 ${
                  isActive
                    ? 'bg-cyan-400/15 text-cyan-300 border border-cyan-400/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs text-right custom-scrollbar">
          
          {/* TAB 1: APPEARANCE & ACCESSIBILITY */}
          {activeTab === 'appearance' && (
            <div className="space-y-4 animate-fadeIn">
              
              {/* Theme Selector */}
              <div className="p-4 rounded-2xl bg-[#0d0d10] border border-white/5 space-y-3">
                <span className="font-bold text-white block text-sm">تم بصری (Theme)</span>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: 'dark', title: 'تیره (پیش‌فرض)', icon: Moon, desc: 'حالت استاندارد مهندسی' },
                    { id: 'light', title: 'روشن', icon: Sun, desc: 'کنتراست در محیط پرنور' },
                    { id: 'system', title: 'سیستم', icon: Monitor, desc: 'هماهنگ با سیستم‌عامل' }
                  ].map((thm) => {
                    const Icon = thm.icon;
                    const isSelected = settings.theme === thm.id;
                    return (
                      <div
                        key={thm.id}
                        onClick={() => updateSettings({ theme: thm.id as ThemeMode })}
                        className={`p-3 rounded-xl border transition-all cursor-pointer text-center space-y-1.5 ${
                          isSelected
                            ? 'bg-cyan-500/15 border-cyan-400/50 text-cyan-300'
                            : 'bg-[#141417] border-white/5 text-gray-400 hover:border-white/20'
                        }`}
                      >
                        <Icon className="w-4 h-4 mx-auto" />
                        <span className="font-bold text-white block text-xs">{thm.title}</span>
                        <span className="text-[10px] text-gray-500 block">{thm.desc}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Accessibility Toggles */}
              <div className="p-4 rounded-2xl bg-[#0d0d10] border border-white/5 space-y-3">
                <span className="font-bold text-white block text-sm">دسترس‌پذیری و ارگونومی (Accessibility)</span>
                
                <div className="space-y-3 pt-1">
                  {/* Reduced Motion */}
                  <label className="flex items-center justify-between cursor-pointer p-2.5 rounded-xl hover:bg-white/5 transition-colors">
                    <div>
                      <span className="font-medium text-white block">کاهش پویانمایی‌ها (Reduced Motion)</span>
                      <span className="text-gray-400 text-[11px]">غیرفعال‌سازی افکت‌ها و انیمیشن‌های سنگین جهت افزایش تمرکز و روانی سیستم</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.reducedMotion}
                      onChange={(e) => updateSettings({ reducedMotion: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-600 accent-cyan-400 cursor-pointer"
                    />
                  </label>

                  {/* High Contrast */}
                  <label className="flex items-center justify-between cursor-pointer p-2.5 rounded-xl hover:bg-white/5 transition-colors">
                    <div>
                      <span className="font-medium text-white block">کنتراست بالا (High Contrast)</span>
                      <span className="text-gray-400 text-[11px]">افزایش شفافیت مرز کارت‌ها و کنتراست متن‌ها برای خوانایی حداکثری</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.highContrast}
                      onChange={(e) => updateSettings({ highContrast: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-600 accent-cyan-400 cursor-pointer"
                    />
                  </label>

                  {/* Larger Text */}
                  <label className="flex items-center justify-between cursor-pointer p-2.5 rounded-xl hover:bg-white/5 transition-colors">
                    <div>
                      <span className="font-medium text-white block">متن بزرگتر (Larger Text)</span>
                      <span className="text-gray-400 text-[11px]">افزایش مقیاس فونت متن توضیحات و مفاهیم دروس جهت سهولت مطالعه</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.largeText}
                      onChange={(e) => updateSettings({ largeText: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-600 accent-cyan-400 cursor-pointer"
                    />
                  </label>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: LEARNING & FOCUS */}
          {activeTab === 'learning' && (
            <div className="space-y-4 animate-fadeIn">
              
              {/* Learning Reminders */}
              <div className="p-4 rounded-2xl bg-[#0d0d10] border border-white/5 space-y-3">
                <span className="font-bold text-white block text-sm">تنظیمات یادگیری (Learning Preferences)</span>
                
                <div className="space-y-3">
                  <label className="flex items-center justify-between cursor-pointer p-2.5 rounded-xl hover:bg-white/5 transition-colors">
                    <div>
                      <span className="font-medium text-white block">یادآور چالش روزانه</span>
                      <span className="text-gray-400 text-[11px]">نمایش وضعیت حل پرامپت روز در داشبورد و حفظ زنجیره استریک (Streak)</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.dailyChallengeReminder}
                      onChange={(e) => updateSettings({ dailyChallengeReminder: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-600 accent-cyan-400 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer p-2.5 rounded-xl hover:bg-white/5 transition-colors">
                    <div>
                      <span className="font-medium text-white block">باز کردن خودکار درس بعدی</span>
                      <span className="text-gray-400 text-[11px]">پس از تکمیل هر درس، درس بعدی به صورت خودکار به عنوان درس فعال مشخص شود</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.autoOpenNextLesson}
                      onChange={(e) => updateSettings({ autoOpenNextLesson: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-600 accent-cyan-400 cursor-pointer"
                    />
                  </label>
                </div>
              </div>

              {/* Focus Lounge Settings */}
              <div className="p-4 rounded-2xl bg-[#0d0d10] border border-white/5 space-y-3">
                <span className="font-bold text-white block text-sm">اتاق استراحت و تمرکز (Focus Lounge)</span>
                
                <div className="space-y-3">
                  <label className="flex items-center justify-between cursor-pointer p-2.5 rounded-xl hover:bg-white/5 transition-colors">
                    <div>
                      <span className="font-medium text-white block">فعال بودن بازی‌های تعاملی</span>
                      <span className="text-gray-400 text-[11px]">دسترسی به بازی‌های ۲۰۴۸، مار و حافظه پرامپت در اتاق استراحت</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.enableGames}
                      onChange={(e) => updateSettings({ enableGames: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-600 accent-cyan-400 cursor-pointer"
                    />
                  </label>

                  {/* Timer Preference */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl">
                    <div>
                      <span className="font-medium text-white block">فاصله استراحت هوشمند</span>
                      <span className="text-gray-400 text-[11px]">مدت زمان فوکوس قبل از یادآوری استراحت کوتاه</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {[25, 45, 60].map((mins) => (
                        <button
                          key={mins}
                          onClick={() => updateSettings({ breakTimerMinutes: mins })}
                          className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                            settings.breakTimerMinutes === mins
                              ? 'bg-cyan-400 text-black font-bold'
                              : 'bg-[#141417] text-gray-400 hover:text-white border border-white/5'
                          }`}
                        >
                          {mins} دقیقه
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sound Preferences */}
              <div className="p-4 rounded-2xl bg-[#0d0d10] border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {settings.soundEnabled ? (
                      <Volume2 className="w-4 h-4 text-cyan-400" />
                    ) : (
                      <VolumeX className="w-4 h-4 text-gray-500" />
                    )}
                    <div>
                      <span className="font-medium text-white block">افکت‌های صوتی بازخورد (Sound Feedback)</span>
                      <span className="text-gray-400 text-[11px]">پخش ملایم صدای سینتی‌سایزر هنگام موفقیت یا ثبت پرامپت (پیش‌فرض: غیرفعال)</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {settings.soundEnabled && (
                      <button
                        onClick={() => playSuccessChime(true)}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-cyan-300 text-[11px]"
                      >
                        تست صدا
                      </button>
                    )}
                    <input
                      type="checkbox"
                      checked={settings.soundEnabled}
                      onChange={(e) => updateSettings({ soundEnabled: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-600 accent-cyan-400 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: KEYBOARD SHORTCUTS */}
          {activeTab === 'shortcuts' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Interactive Modal Promo Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-[#151520] to-[#121218] border border-cyan-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                    <Keyboard className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">راهنمای تعاملی و پالت کامل میانبرها</span>
                      <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold">
                        Interactive Helper
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs mt-0.5">
                      مشاهده، تست زنده با فشردن کلیدها، فیلتر موضوعی و کپی سریع تمامی کلیدهای فوری
                    </p>
                  </div>
                </div>

                <button
                  id="open-shortcuts-helper-btn"
                  onClick={() => setIsShortcutsHelperOpen(true)}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all shrink-0"
                >
                  <Keyboard className="w-4 h-4" />
                  <span>باز کردن پنجره راهنما (؟)</span>
                </button>
              </div>

              {/* Quick List in Settings */}
              <div className="p-4 rounded-2xl bg-[#0d0d10] border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white block text-sm">میانبرهای پرکاربرد سیستم (Quick Overview)</span>
                  <button 
                    onClick={() => setIsShortcutsHelperOpen(true)}
                    className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <span>مشاهده کامل ({SHORTCUTS_DATA.length} میانبر)</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-2 pt-1">
                  {SHORTCUTS_DATA.slice(0, 7).map((s) => (
                    <div key={s.id} className="flex items-center justify-between p-2.5 rounded-xl bg-[#141417] border border-white/5">
                      <span className="text-gray-300 text-xs">{s.description}</span>
                      <div className="flex items-center gap-1 shrink-0 font-mono text-[11px]">
                        {s.keys.map((k, ki) => (
                          <kbd key={ki} className="px-2 py-1 bg-black/60 border border-white/10 rounded-md text-cyan-300 font-bold">
                            {k}
                          </kbd>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DATA MANAGEMENT & BACKUP */}
          {activeTab === 'data' && (
            <div className="space-y-4 animate-fadeIn">
              
              {/* Summary Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
                <div className="p-3 rounded-2xl bg-[#0d0d10] border border-white/5">
                  <span className="text-lg font-bold text-cyan-400 font-mono block">{progress.completedLessons.length}</span>
                  <span className="text-[10px] text-gray-400">دروس تکمیل‌شده</span>
                </div>
                <div className="p-3 rounded-2xl bg-[#0d0d10] border border-white/5">
                  <span className="text-lg font-bold text-violet-400 font-mono block">{progress.savedPrompts.length}</span>
                  <span className="text-[10px] text-gray-400">پرامپت‌های ذخیره</span>
                </div>
                <div className="p-3 rounded-2xl bg-[#0d0d10] border border-white/5">
                  <span className="text-lg font-bold text-emerald-400 font-mono block">{progress.xp}</span>
                  <span className="text-[10px] text-gray-400">مجموع XP</span>
                </div>
                <div className="p-3 rounded-2xl bg-[#0d0d10] border border-white/5">
                  <span className="text-lg font-bold text-amber-400 font-mono block">{progress.learningStreakDays} روز</span>
                  <span className="text-[10px] text-gray-400">زنجیره یادگیری</span>
                </div>
              </div>

              {/* Export Section */}
              <div className="p-4 rounded-2xl bg-[#0d0d10] border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white block text-sm">پشتیبان‌گیری کامل (Export Data)</span>
                    <span className="text-gray-400 text-[11px]">دانلود پکیج کامل شامل پیشرفت، پرامپت‌ها، آزمایش‌ها، یادداشت‌ها و تنظیمات در قالب JSON نسخه ۱</span>
                  </div>
                  <button
                    onClick={handleExportDownload}
                    className="px-4 py-2 rounded-xl bg-cyan-400/15 hover:bg-cyan-400/25 border border-cyan-400/30 text-cyan-300 font-bold flex items-center gap-1.5 transition-colors shrink-0"
                  >
                    <Download className="w-4 h-4" />
                    <span>{exportSuccess ? 'دانلود شد ✓' : 'دانلود پشتیبان JSON'}</span>
                  </button>
                </div>
              </div>

              {/* Import Section */}
              <div className="p-4 rounded-2xl bg-[#0d0d10] border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white block text-sm">بازیابی اطلاعات از فایل پشتیبان (Import Data)</span>
                    <span className="text-gray-400 text-[11px]">پشتیبان دانلودشده را انتخاب کنید یا محتوای آن را الصاق نمایید</span>
                  </div>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 flex items-center gap-1.5 shrink-0"
                  >
                    <FileJson className="w-3.5 h-3.5" />
                    <span>انتخاب فایل</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json,application/json"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>

                <textarea
                  value={importJsonText}
                  onChange={(e) => processImportContent(e.target.value)}
                  rows={3}
                  placeholder="محتوای فایل JSON پشتیبان را اینجا الصاق کنید..."
                  className="w-full p-3 bg-[#141417] border border-white/10 rounded-xl font-mono text-[11px] text-white focus:outline-none focus:border-cyan-400/50 resize-none"
                />

                {/* Validation status feedback */}
                {validationError && (
                  <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{validationError}</span>
                  </div>
                )}

                {validatedPackage && (
                  <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>فایل پشتیبان معتبر است و آماده واردسازی می‌باشد.</span>
                    </div>

                    <div className="text-[11px] text-gray-300 flex items-center gap-4 flex-wrap pt-1 font-mono">
                      <span>نسخه: {validatedPackage.version}</span>
                      <span>دروس: {validatedPackage.data.progress.completedLessons.length}</span>
                      <span>پرامپت‌ها: {validatedPackage.data.progress.savedPrompts.length}</span>
                      <span>XP: {validatedPackage.data.progress.xp}</span>
                    </div>

                    {/* Import Mode Selector */}
                    <div className="pt-2 border-t border-emerald-500/20 flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="importMode"
                            checked={importMode === 'merge'}
                            onChange={() => setImportMode('merge')}
                            className="accent-cyan-400"
                          />
                          <span className="text-gray-200 text-xs">ادغام با اطلاعات فعلی (پیش‌فرض)</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="importMode"
                            checked={importMode === 'replace'}
                            onChange={() => setImportMode('replace')}
                            className="accent-cyan-400"
                          />
                          <span className="text-rose-300 text-xs">جایگزینی کامل</span>
                        </label>
                      </div>

                      <button
                        onClick={handleApplyImport}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{importSuccess ? 'انجام شد ✓' : 'اعمال و ذخیره پشتیبان'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* MIGRATION LOG UTILITY & SCHEMA INTEGRITY */}
              <div className="p-4 rounded-2xl bg-[#0d0d10] border border-white/5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
                      <History className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">تاریخچه نسخه‌های اسکیما و گزارش مهاجرت (Migration Logs)</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold">
                          Schema v1.0 پایدار
                        </span>
                      </div>
                      <p className="text-gray-400 text-[11px] mt-0.5">
                        بررسی و نظارت بر انتقال صحیح کلیدهای محلی، اعتبارسنجی ساختار داده‌ها و ردیابی ارتقای نسخه‌ها
                      </p>
                    </div>
                  </div>

                  {/* Verification and Diagnostic Action Buttons */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={handleRunVerification}
                      disabled={isVerifyingSchema}
                      className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                      title="بررسی صحت ساختار داده‌ها و ایجاد لاگ اعتبارسنجی جدید"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isVerifyingSchema ? 'animate-spin' : ''}`} />
                      <span>{isVerifyingSchema ? 'در حال اعتبارسنجی...' : 'بررسی و اعتبارسنجی انتقال'}</span>
                    </button>

                    <button
                      onClick={handleExportDiagnostics}
                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
                      title="دریافت فایل گزارش تشخیصی سلامت دیتابیس محلی"
                    >
                      <FileText className="w-3.5 h-3.5 text-gray-400" />
                      <span>{exportLogsSuccess ? 'گزارش صادر شد ✓' : 'خروجی گزارش'}</span>
                    </button>

                    {migrationLogs.length > 0 && (
                      <button
                        onClick={() => setConfirmClearLogs(true)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="پاکسازی تاریخچه لاگ‌ها"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Confirm clear logs popup */}
                {confirmClearLogs && (
                  <div className="p-3 bg-rose-950/30 border border-rose-500/30 rounded-xl flex items-center justify-between text-xs">
                    <span className="text-rose-300">آیا مطمئنید که تاریخچه گزارش‌های مهاجرت پاکسازی شود؟ (داده‌های آموزشی شما حفظ می‌گردد)</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setConfirmClearLogs(false)}
                        className="px-2.5 py-1 rounded bg-white/5 text-gray-300 hover:bg-white/10"
                      >
                        انصراف
                      </button>
                      <button
                        onClick={() => {
                          clearMigrationLogsHistory();
                          setConfirmClearLogs(false);
                        }}
                        className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold"
                      >
                        بله، پاک شود
                      </button>
                    </div>
                  </div>
                )}

                {/* Storage Keys Health Grid */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-gray-400 px-1">
                    <div className="flex items-center gap-1.5">
                      <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
                      <span>وضعیت سلامت و نگاشت کلیدهای فضای محلی (Storage Keys Health):</span>
                    </div>
                    <span className="text-emerald-400 font-mono text-[10px]">
                      {schemaHealth.filter(k => k.status === 'healthy' || k.status === 'migrated').length} از {schemaHealth.length} کلید سالم
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {schemaHealth.map((item, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-[#141418] border border-white/5 flex items-center justify-between gap-2 text-xs">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-white text-[11px] truncate">{item.key}</span>
                            <span className={`px-1.5 py-0.2 text-[9px] rounded-full font-medium ${
                              item.status === 'healthy' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                              item.status === 'migrated' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                              item.status === 'empty' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                              'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                            }`}>
                              {item.status === 'healthy' ? 'سالم' : item.status === 'migrated' ? 'منتقل‌شده' : item.status === 'empty' ? 'خالی' : 'ناموجود'}
                            </span>
                          </div>
                          <p className="text-[10px] text-gray-500 truncate mt-0.5">{item.description}</p>
                        </div>

                        <div className="text-left font-mono text-[10px] text-gray-400 shrink-0">
                          <div>{item.recordCount !== undefined ? `${item.recordCount} رکورد` : '-'}</div>
                          <div className="text-gray-600">{(item.byteSize ? (item.byteSize / 1024).toFixed(1) : '0')} KB</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Migration Logs History List & Filter */}
                <div className="space-y-2.5 pt-2">
                  <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
                    <span className="font-semibold text-gray-300">گزارش‌های انتقال و اعتبارسنجی اسکیما:</span>
                    
                    {/* Filter tabs */}
                    <div className="flex items-center gap-1 bg-[#141418] p-1 rounded-xl border border-white/5 text-[11px]">
                      {[
                        { id: 'all', label: 'همه' },
                        { id: 'verified', label: 'اعتبارسنجی‌ها' },
                        { id: 'imported', label: 'واردسازی‌ها' },
                        { id: 'success', label: 'ارتقاها' },
                        { id: 'warning', label: 'هشدارها' }
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setLogFilter(tab.id as any)}
                          className={`px-2.5 py-0.5 rounded-lg transition-colors ${
                            logFilter === tab.id
                              ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                              : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Log items */}
                  {filteredMigrationLogs.length === 0 ? (
                    <div className="p-6 text-center text-gray-500 rounded-xl bg-[#141418] border border-white/5 text-xs">
                      گزارشی در این دسته‌بندی یافت نشد. با کلیک بر روی دکمه «بررسی و اعتبارسنجی انتقال»، وضعیت فعلی اسکیما ارزیابی و ثبت می‌گردد.
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                      {filteredMigrationLogs.map((log) => {
                        const isExpanded = expandedLogId === log.id;
                        const statusBadge = 
                          log.status === 'verified' ? { text: 'تایید سلامت اسکیما', bg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' } :
                          log.status === 'success' ? { text: 'ارتقا موفق', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' } :
                          log.status === 'imported' ? { text: 'انتقال پشتیبان', bg: 'bg-violet-500/10 text-violet-400 border-violet-500/30' } :
                          { text: 'تغییر وضعیت / هشدار', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30' };

                        return (
                          <div 
                            key={log.id} 
                            className={`rounded-xl border transition-all ${
                              isExpanded 
                                ? 'bg-[#15151c] border-cyan-500/40 shadow-lg' 
                                : 'bg-[#141418] border-white/5 hover:border-white/10'
                            }`}
                          >
                            <div 
                              onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                              className="p-3 cursor-pointer flex items-center justify-between gap-3 text-xs"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className={`px-2 py-0.5 rounded-md border text-[10px] font-bold ${statusBadge.bg} shrink-0`}>
                                  {statusBadge.text}
                                </div>

                                <div className="min-w-0">
                                  <div className="flex items-center gap-2 font-semibold text-white">
                                    <span className="truncate">{log.title}</span>
                                    <div className="hidden sm:flex items-center gap-1 text-[10px] text-gray-400 font-mono">
                                      <span className="text-gray-500">{log.fromVersion}</span>
                                      <span>←</span>
                                      <span className="text-cyan-400">{log.toVersion}</span>
                                    </div>
                                  </div>
                                  <div className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-3">
                                    <span>{new Date(log.timestamp).toLocaleDateString('fa-IR')} - {new Date(log.timestamp).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}</span>
                                    <span className="text-gray-600">|</span>
                                    <span className="truncate text-gray-500">{log.details}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                <span className="text-[10px] text-gray-500">
                                  {isExpanded ? 'بستن جزئیات' : 'مشاهده جزئیات'}
                                </span>
                                {isExpanded ? <ChevronUp className="w-4 h-4 text-cyan-400" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                              </div>
                            </div>

                            {/* Expanded details */}
                            {isExpanded && (
                              <div className="p-3 pt-0 border-t border-white/5 space-y-3 text-xs animate-fadeIn mt-1">
                                <div className="p-2.5 rounded-lg bg-[#0e0e12] border border-white/5 text-gray-300 leading-relaxed text-[11px]">
                                  {log.details}
                                </div>

                                {/* Summary items */}
                                {log.countsSummary && (
                                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-[10px]">
                                    <div className="p-2 rounded bg-black/40 border border-white/5">
                                      <span className="text-gray-400 block">دروس گذرانده</span>
                                      <span className="font-mono text-cyan-300 font-bold text-xs">{log.countsSummary.completedLessons}</span>
                                    </div>
                                    <div className="p-2 rounded bg-black/40 border border-white/5">
                                      <span className="text-gray-400 block">پرامپت‌های شخصی</span>
                                      <span className="font-mono text-violet-300 font-bold text-xs">{log.countsSummary.savedPrompts}</span>
                                    </div>
                                    <div className="p-2 rounded bg-black/40 border border-white/5">
                                      <span className="text-gray-400 block">امتیاز مهارتی (XP)</span>
                                      <span className="font-mono text-emerald-300 font-bold text-xs">{log.countsSummary.xp}</span>
                                    </div>
                                    <div className="p-2 rounded bg-black/40 border border-white/5">
                                      <span className="text-gray-400 block">زنجیره یادگیری</span>
                                      <span className="font-mono text-amber-300 font-bold text-xs">{log.countsSummary.streakDays} روز</span>
                                    </div>
                                    <div className="p-2 rounded bg-black/40 border border-white/5 col-span-2 sm:col-span-1">
                                      <span className="text-gray-400 block">تمرین‌های حل‌شده</span>
                                      <span className="font-mono text-blue-300 font-bold text-xs">{log.countsSummary.exercises}</span>
                                    </div>
                                  </div>
                                )}

                                {/* Key Health at verification time */}
                                {log.keysHealth && log.keysHealth.length > 0 && (
                                  <div className="space-y-1">
                                    <span className="text-[10px] text-gray-400 font-semibold block">نتایج اعتبارسنجی کلیدها در این گزارش:</span>
                                    <div className="space-y-1">
                                      {log.keysHealth.map((kh, kidx) => (
                                        <div key={kidx} className="flex items-center justify-between p-1.5 rounded bg-black/30 border border-white/5 text-[10px]">
                                          <div className="flex items-center gap-2">
                                            <span className="font-mono text-gray-300">{kh.key}</span>
                                            <span className="text-gray-500">({kh.description})</span>
                                          </div>
                                          <div className="flex items-center gap-2 font-mono">
                                            {kh.recordCount !== undefined && <span className="text-cyan-400">{kh.recordCount} رکورد</span>}
                                            <span className="text-emerald-400">✓ تایید شد</span>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Danger Zone: Reset Operations */}
              <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/20 space-y-3">
                <span className="font-bold text-rose-300 block text-sm">عملیات بازنشانی داده‌ها (Reset Zone)</span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Reset Progress Only */}
                  <div className="p-3 rounded-xl bg-[#141417] border border-rose-500/20 flex items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-gray-200 block text-xs">بازنشانی پیشرفت آموزشی</span>
                      <span className="text-[10px] text-gray-400">شروع مجدد دوره (پرامپت‌های شما حفظ می‌شوند)</span>
                    </div>
                    <button
                      onClick={() => setConfirmMode('progress_only')}
                      className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-semibold shrink-0"
                    >
                      بازنشانی دوره
                    </button>
                  </div>

                  {/* Reset All Data */}
                  <div className="p-3 rounded-xl bg-[#141417] border border-rose-500/20 flex items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-rose-400 block text-xs">بازنشانی تمام داده‌ها</span>
                      <span className="text-[10px] text-gray-400">پاکسازی کامل کلیه پرامپت‌ها و داده‌های محلی</span>
                    </div>
                    <button
                      onClick={() => setConfirmMode('all_data')}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shrink-0"
                    >
                      حذف کامل
                    </button>
                  </div>
                </div>

                {/* Confirm Dialog */}
                {confirmMode !== 'none' && (
                  <div className="p-4 bg-black/80 rounded-xl border border-rose-500/40 space-y-2.5 mt-2 animate-fadeIn">
                    <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>
                        {confirmMode === 'progress_only'
                          ? 'آیا از بازنشانی پیشرفت آموزشی و آزمون‌ها اطمینان دارید؟'
                          : 'هشدار: تمامی پرامپت‌ها، نتایج و سوابق ذخیره‌شده پاک خواهند شد. آیا مطمئنید؟'}
                      </span>
                    </div>
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        onClick={() => setConfirmMode('none')}
                        className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-xs"
                      >
                        انصراف
                      </button>
                      <button
                        onClick={handleExecuteReset}
                        className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
                      >
                        بله، بازنشانی شود
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 5: ABOUT */}
          {activeTab === 'about' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-5 rounded-2xl bg-[#0d0d10] border border-white/5 space-y-4 text-center">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-400 flex items-center justify-center text-white mx-auto shadow-[0_0_20px_rgba(124,58,237,0.3)]">
                  <Sparkles className="w-6 h-6" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-extrabold text-white">PromptLab</h3>
                  <p className="text-xs font-mono text-cyan-400">From Simple Prompts to Professional AI Systems</p>
                  <p className="text-[11px] text-gray-400">پلتفرم جامع مهندسی پرامپت، ارزیابی مدل و طراحی سیستم‌های هوش مصنوعی</p>
                </div>

                <div className="p-3 bg-[#141417] rounded-xl border border-white/5 text-[11px] text-gray-400 text-right space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span>نسخه نرم‌افزار:</span>
                    <span className="font-mono font-bold text-white">v1.7.0 (Phase 07)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>معماری داده‌ها:</span>
                    <span className="text-emerald-400 font-bold">Local-First (حفظ ۱۰۰٪ حریم خصوصی در مرورگر شما)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>استانداردهای مهندسی:</span>
                    <span className="text-gray-300">Anthropic Prompt Engineering & OpenAI Best Practices</span>
                  </div>
                </div>

                {/* Restart Onboarding */}
                <div className="pt-2">
                  <button
                    onClick={() => {
                      resetOnboarding();
                      if (onRestartOnboarding) onRestartOnboarding();
                      onClose();
                    }}
                    className="px-4 py-2 rounded-xl bg-violet-600/15 hover:bg-violet-600/25 border border-violet-500/30 text-violet-300 text-xs font-bold flex items-center gap-2 mx-auto transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>اجرای مجدد راهنمای شروع (Onboarding)</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3 border-t border-white/5 bg-[#0d0d10] flex items-center justify-between text-[11px] text-gray-500">
          <span>PromptLab Engineering Platform</span>
          <span>داده‌ها به صورت آفلاین در مرورگر شما نگهداری می‌شوند</span>
        </div>
      </div>

      {/* Dynamic Keyboard Shortcuts Helper Modal */}
      <ShortcutsModal 
        isOpen={isShortcutsHelperOpen} 
        onClose={() => setIsShortcutsHelperOpen(false)} 
      />
    </div>
  );
};
