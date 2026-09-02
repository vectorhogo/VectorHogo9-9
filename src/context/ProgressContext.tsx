import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  UserProgress, 
  SavedPrompt, 
  UserSettings, 
  OnboardingState, 
  ToastNotification, 
  ToastType,
  PromptLabExportPackage,
  MigrationLogEntry
} from '../types';
import { CURRICULUM_LEVELS } from '../data/curriculum';
import { ACHIEVEMENTS } from '../data/achievements';
import { 
  STORAGE_KEYS, 
  DEFAULT_SETTINGS, 
  DEFAULT_ONBOARDING, 
  validateBackupData, 
  createExportPackage, 
  mergeProgress, 
  migrateLegacyStorage,
  getMigrationLogs,
  runSchemaVerification,
  clearMigrationLogs,
  ensureBaselineMigrationLog,
  inspectSchemaKeyHealth,
  addMigrationLog
} from '../utils/dataMigration';
import { playSuccessChime, playClickTone } from '../utils/soundEffects';

const INITIAL_PROGRESS: UserProgress = {
  overallPercentage: 8,
  completedLessons: ['l01-01'], // Give an initial completed lesson for immediate visual feedback
  completedExercises: ['ex-01-01'],
  completedChallenges: [],
  currentLessonId: 'l01-02',
  currentLevelId: 1,
  learningStreakDays: 3,
  lastActiveDate: new Date().toISOString().split('T')[0],
  savedPrompts: [
    {
      id: 'saved-01',
      title: 'سیستم پرامپت تحلیلگر ارشد داده و هوش تجاری',
      systemPrompt: 'You are a Senior BI Analyst. Always structure outputs in Markdown tables with actionable recommendations.',
      userPrompt: 'اطلاعات فروش سه ماهه پاییز را بر اساس کانال‌های تبلیغاتی تحلیل کن و ۳ فرصت رشد مشخص نما.',
      model: 'Claude 3.7 Sonnet',
      createdAt: new Date().toLocaleDateString('fa-IR'),
      tags: ['BI', 'Data Analysis', 'Enterprise']
    }
  ],
  unlockedAchievements: ['ach-first-prompt', 'ach-streak-3'],
  xp: 350
};

interface ProgressContextType {
  progress: UserProgress;
  settings: UserSettings;
  onboarding: OnboardingState;
  toasts: ToastNotification[];
  totalLessonsCount: number;
  completedLessonsCount: number;
  activeLevelId: number;
  activeLessonId: string;
  addToast: (message: string, type?: ToastType, duration?: number) => void;
  dismissToast: (id: string) => void;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  completeOnboarding: (state: OnboardingState, startingLessonId?: string) => void;
  resetOnboarding: () => void;
  setActiveLessonId: (lessonId: string) => void;
  setCurrentLesson: (lessonId: string, levelId?: number) => void;
  markLessonCompleted: (lessonId: string) => void;
  markExerciseCompleted: (exerciseId: string) => void;
  markChallengeCompleted: (challengeId: string) => void;
  savePlaygroundPrompt: (prompt: Omit<SavedPrompt, 'id' | 'createdAt'>) => void;
  deletePlaygroundPrompt: (id: string) => void;
  completeMission: (missionId: string, score: number, xpReward: number) => void;
  recordArenaAttempt: (missionId: string, score: number, prompt: string) => void;
  markDailyChallengeCompleted: (challengeId: string, xpReward: number) => void;
  saveExperiment: (exp: Omit<import('../types').PromptExperiment, 'id' | 'createdAt'>) => void;
  addNote: (note: Omit<import('../types').PromptNote, 'id' | 'createdAt' | 'updatedAt'>) => void;
  deleteNote: (id: string) => void;
  createCollection: (title: string) => void;
  resetProgress: () => void;
  resetProgressOnly: () => void;
  resetAllData: () => void;
  exportFullBackupJSON: () => string;
  exportProgressJSON: () => string;
  validateAndPrepareImport: (jsonString: string) => { valid: boolean; error?: string; data?: PromptLabExportPackage };
  executeImport: (pkg: PromptLabExportPackage, mode: 'merge' | 'replace') => boolean;
  importProgressJSON: (jsonString: string) => boolean;
  isLessonCompleted: (lessonId: string) => boolean;
  isLevelCompleted: (levelId: number) => boolean;
  isLevelLocked: (levelId: number) => boolean;
  recordGameResult: (game: 'snake' | '2048' | 'memory', score: number, meta?: { moves?: number; highestTile?: number }) => void;
  recordBreakCompleted: () => void;
  recordBenchmarkRun: (mode: 'single' | 'compare_models' | 'ab_prompts', modelIds: string[]) => void;
  toggleFocusMode: (enabled?: boolean) => void;
  migrationLogs: MigrationLogEntry[];
  verifySchemaIntegrity: () => MigrationLogEntry;
  clearMigrationLogsHistory: () => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Run migration if legacy key exists
  useEffect(() => {
    migrateLegacyStorage();
    ensureBaselineMigrationLog(progress, settings);
    setMigrationLogs(getMigrationLogs());
  }, []);

  // 2. Migration Logs State
  const [migrationLogs, setMigrationLogs] = useState<MigrationLogEntry[]>(() => getMigrationLogs());

  // 2. Progress State
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROGRESS) || localStorage.getItem(STORAGE_KEYS.LEGACY_PROGRESS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return INITIAL_PROGRESS;
  });

  // 3. User Settings State
  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_SETTINGS;
  });

  // 4. Onboarding State
  const [onboarding, setOnboarding] = useState<OnboardingState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ONBOARDING);
      if (saved) {
        return { ...DEFAULT_ONBOARDING, ...JSON.parse(saved) };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_ONBOARDING;
  });

  // 5. Toasts State
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const addToast = useCallback((message: string, type: ToastType = 'info', duration: number = 3500) => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6);
    const newToast: ToastNotification = { id, message, type, duration };
    setToasts((prev) => [...prev.slice(-2), newToast]); // Limit stack to max 3 items

    if (type === 'success') {
      playSuccessChime(settings.soundEnabled);
    }

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, [settings.soundEnabled]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const totalLessonsCount = CURRICULUM_LEVELS.reduce((acc, lvl) => acc + lvl.lessons.length, 0);
  const completedLessonsCount = progress.completedLessons.length;

  // Persist progress to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
    } catch (e) {
      console.error('Failed to persist progress', e);
    }
  }, [progress]);

  // Persist settings to local storage & sync HTML attributes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));

      const root = document.documentElement;
      // Reduced motion
      if (settings.reducedMotion) {
        root.classList.add('reduced-motion');
      } else {
        root.classList.remove('reduced-motion');
      }

      // Large text
      if (settings.largeText) {
        root.classList.add('large-text');
      } else {
        root.classList.remove('large-text');
      }

      // High contrast
      if (settings.highContrast) {
        root.classList.add('high-contrast');
      } else {
        root.classList.remove('high-contrast');
      }

      // Theme
      if (settings.theme === 'light') {
        root.classList.add('theme-light');
      } else {
        root.classList.remove('theme-light');
      }
    } catch (e) {
      console.error('Failed to persist settings', e);
    }
  }, [settings]);

  // Persist onboarding state
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ONBOARDING, JSON.stringify(onboarding));
    } catch (e) {
      console.error('Failed to persist onboarding', e);
    }
  }, [onboarding]);

  const updateSettings = useCallback((newSettings: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    addToast('تنظیمات با موفقیت ذخیره شد.', 'success');
  }, [addToast]);

  const completeOnboarding = useCallback((state: OnboardingState, startingLessonId?: string) => {
    setOnboarding(state);
    if (startingLessonId) {
      const level = CURRICULUM_LEVELS.find((lvl) => lvl.lessons.some((l) => l.id === startingLessonId));
      setProgress((prev) => ({
        ...prev,
        currentLessonId: startingLessonId,
        currentLevelId: level ? level.id : prev.currentLevelId
      }));
    }
    addToast('شروع مسیر یادگیری اختصاصی ثبت شد.', 'success');
  }, [addToast]);

  const resetOnboarding = useCallback(() => {
    setOnboarding(DEFAULT_ONBOARDING);
    try {
      localStorage.removeItem(STORAGE_KEYS.ONBOARDING);
    } catch {
      // Ignore
    }
    addToast('راهنمای شروع مجدداً فعال شد.', 'info');
  }, [addToast]);

  // Calculate percentage & check achievements
  const updateProgressAndAchievements = (newProgress: Partial<UserProgress>) => {
    setProgress((prev) => {
      const updated = { ...prev, ...newProgress };
      const percentage = Math.min(100, Math.round((updated.completedLessons.length / totalLessonsCount) * 100));
      updated.overallPercentage = percentage;

      // Auto check achievements
      const newlyUnlocked = [...updated.unlockedAchievements];
      
      if (updated.completedLessons.length >= 1 && !newlyUnlocked.includes('ach-first-prompt')) {
        newlyUnlocked.push('ach-first-prompt');
        addToast('دستاورد جدید باز شد: اولین گام در مهندسی پرامپت 🏆', 'success');
      }
      if (updated.completedChallenges.length >= 1 && !newlyUnlocked.includes('ach-first-challenge')) {
        newlyUnlocked.push('ach-first-challenge');
        addToast('دستاورد جدید باز شد: حل اولین چالش تخصصی 🏆', 'success');
      }
      if (updated.completedLessons.includes('l01-01') && updated.completedLessons.includes('l01-02') && !newlyUnlocked.includes('ach-prompt-architect')) {
        newlyUnlocked.push('ach-prompt-architect');
      }
      if (updated.savedPrompts.length >= 3 && !newlyUnlocked.includes('ach-playground-pro')) {
        newlyUnlocked.push('ach-playground-pro');
      }

      updated.unlockedAchievements = newlyUnlocked;
      return updated;
    });
  };

  const markLessonCompleted = (lessonId: string) => {
    if (!progress.completedLessons.includes(lessonId)) {
      const newCompleted = [...progress.completedLessons, lessonId];
      updateProgressAndAchievements({
        completedLessons: newCompleted,
        xp: progress.xp + 100
      });
      addToast('درس با موفقیت تکمیل شد (+100 XP)', 'success');
    }
  };

  const markExerciseCompleted = (exerciseId: string) => {
    if (!progress.completedExercises.includes(exerciseId)) {
      updateProgressAndAchievements({
        completedExercises: [...progress.completedExercises, exerciseId],
        xp: progress.xp + 50
      });
      addToast('تمرین با موفقیت ثبت شد (+50 XP)', 'success');
    }
  };

  const markChallengeCompleted = (challengeId: string) => {
    if (!progress.completedChallenges.includes(challengeId)) {
      updateProgressAndAchievements({
        completedChallenges: [...progress.completedChallenges, challengeId],
        xp: progress.xp + 150
      });
      addToast('چالش با موفقیت حل شد (+150 XP)', 'success');
    }
  };

  const setActiveLessonId = (lessonId: string) => {
    const level = CURRICULUM_LEVELS.find((lvl) => lvl.lessons.some((l) => l.id === lessonId));
    setProgress((prev) => ({
      ...prev,
      currentLessonId: lessonId,
      currentLevelId: level ? level.id : prev.currentLevelId
    }));
  };

  const setCurrentLesson = (lessonId: string, levelId?: number) => {
    const today = new Date().toISOString().split('T')[0];
    setProgress((prev) => {
      let newStreak = prev.learningStreakDays;
      if (prev.lastActiveDate !== today) {
        newStreak = prev.learningStreakDays + 1;
      }
      return {
        ...prev,
        currentLessonId: lessonId,
        currentLevelId: levelId || (CURRICULUM_LEVELS.find((lvl) => lvl.lessons.some((l) => l.id === lessonId))?.id || prev.currentLevelId),
        lastActiveDate: today,
        learningStreakDays: newStreak
      };
    });
  };

  const savePlaygroundPrompt = (prompt: Omit<SavedPrompt, 'id' | 'createdAt'>) => {
    const newPrompt: SavedPrompt = {
      ...prompt,
      id: 'saved-' + Date.now(),
      createdAt: new Date().toLocaleDateString('fa-IR')
    };
    updateProgressAndAchievements({
      savedPrompts: [newPrompt, ...progress.savedPrompts],
      xp: progress.xp + 25
    });
    addToast('Prompt در کارگاه ذخیره شد.', 'success');
  };

  const deletePlaygroundPrompt = (id: string) => {
    setProgress((prev) => ({
      ...prev,
      savedPrompts: prev.savedPrompts.filter((p) => p.id !== id)
    }));
    addToast('پرامپت حذف شد.', 'info');
  };

  const completeMission = (missionId: string, score: number, xpReward: number) => {
    const prevCompleted = progress.completedMissions || [];
    if (!prevCompleted.includes(missionId)) {
      updateProgressAndAchievements({
        completedMissions: [...prevCompleted, missionId],
        xp: progress.xp + xpReward
      });
      addToast(`ماموریت با امتیاز ${score} تکمیل شد (+${xpReward} XP)`, 'success');
    }
  };

  const recordArenaAttempt = (missionId: string, score: number, prompt: string) => {
    const history = progress.arenaHistory || {};
    const existing = history[missionId] || { missionId, attempts: [], bestScore: 0, completed: false };
    
    const newAttempt = {
      timestamp: new Date().toLocaleTimeString('fa-IR'),
      score,
      prompt
    };

    const newAttempts = [...existing.attempts, newAttempt];
    const newBest = Math.max(existing.bestScore, score);
    const completed = newBest >= 85;

    const updatedHistory = {
      ...history,
      [missionId]: {
        missionId,
        attempts: newAttempts,
        bestScore: newBest,
        completed
      }
    };

    const xpBonus = score >= 90 ? 100 : score >= 75 ? 50 : 20;

    updateProgressAndAchievements({
      arenaHistory: updatedHistory,
      xp: progress.xp + xpBonus
    });
    addToast(`تلاش نبرد ثبت شد: امتیاز ${score} (+${xpBonus} XP)`, 'info');
  };

  const markDailyChallengeCompleted = (challengeId: string, xpReward: number) => {
    const today = new Date().toISOString().split('T')[0];
    const currentStatus = progress.dailyChallengeStatus || { completedCount: 0 };
    
    if (currentStatus.lastCompletedDate !== today) {
      updateProgressAndAchievements({
        dailyChallengeStatus: {
          lastCompletedDate: today,
          completedCount: currentStatus.completedCount + 1
        },
        learningStreakDays: progress.learningStreakDays + 1,
        xp: progress.xp + xpReward
      });
      addToast(`چالش روزانه با موفقیت تکمیل شد (+${xpReward} XP)`, 'success');
    }
  };

  const saveExperiment = (exp: Omit<import('../types').PromptExperiment, 'id' | 'createdAt'>) => {
    const newExp: import('../types').PromptExperiment = {
      ...exp,
      id: 'exp-' + Date.now(),
      createdAt: new Date().toLocaleDateString('fa-IR')
    };

    const currentExps = [newExp, ...(progress.experiments || [])];
    const newlyUnlocked = [...progress.unlockedAchievements];

    if (!newlyUnlocked.includes('ach-first-experiment')) {
      newlyUnlocked.push('ach-first-experiment');
    }
    if (currentExps.length >= 3 && !newlyUnlocked.includes('ach-prompt-scientist')) {
      newlyUnlocked.push('ach-prompt-scientist');
    }

    updateProgressAndAchievements({
      experiments: currentExps,
      unlockedAchievements: newlyUnlocked,
      xp: progress.xp + 40
    });
    addToast('آزمایش جدید در بنچ‌مارک ذخیره شد.', 'success');
  };

  const recordBenchmarkRun = (mode: 'single' | 'compare_models' | 'ab_prompts', modelIds: string[]) => {
    const newlyUnlocked = [...progress.unlockedAchievements];

    if (!newlyUnlocked.includes('ach-first-experiment')) {
      newlyUnlocked.push('ach-first-experiment');
    }
    if ((mode === 'ab_prompts' || mode === 'compare_models') && !newlyUnlocked.includes('ach-first-ab-test')) {
      newlyUnlocked.push('ach-first-ab-test');
    }
    if (modelIds.length >= 2 && !newlyUnlocked.includes('ach-benchmark-explorer')) {
      newlyUnlocked.push('ach-benchmark-explorer');
    }

    if (newlyUnlocked.length > progress.unlockedAchievements.length) {
      updateProgressAndAchievements({
        unlockedAchievements: newlyUnlocked,
        xp: progress.xp + 25
      });
    }
  };

  const addNote = (note: Omit<import('../types').PromptNote, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toLocaleDateString('fa-IR');
    const newNote: import('../types').PromptNote = {
      ...note,
      id: 'note-' + Date.now(),
      createdAt: now,
      updatedAt: now
    };
    updateProgressAndAchievements({
      notes: [newNote, ...(progress.notes || [])]
    });
    addToast('یادداشت جدید ذخیره شد.', 'success');
  };

  const deleteNote = (id: string) => {
    setProgress((prev) => ({
      ...prev,
      notes: (prev.notes || []).filter((n) => n.id !== id)
    }));
    addToast('یادداشت حذف شد.', 'info');
  };

  const createCollection = (title: string) => {
    const newCol: import('../types').PromptCollection = {
      id: 'col-' + Date.now(),
      title,
      createdAt: new Date().toLocaleDateString('fa-IR')
    };
    updateProgressAndAchievements({
      collections: [newCol, ...(progress.collections || [])]
    });
    addToast(`مجموعه «${title}» ایجاد شد.`, 'success');
  };

  // RESET PROGRESS (Clears learning progress, keeps saved prompts, collections, settings)
  const resetProgressOnly = () => {
    const updatedProgress: UserProgress = {
      ...INITIAL_PROGRESS,
      savedPrompts: progress.savedPrompts,
      collections: progress.collections,
      experiments: progress.experiments,
      notes: progress.notes
    };
    setProgress(updatedProgress);

    const logEntry: MigrationLogEntry = {
      id: 'reset-progress-' + Date.now(),
      timestamp: new Date().toISOString(),
      fromVersion: 'v1.0 (Active)',
      toVersion: 'v1.0 (Reset Progress)',
      status: 'warning',
      title: 'بازنشانی پیشرفت دوره آموزشی',
      details: 'پیشرفت و نمرات کاربر بازنشانی شد اما پرامپت‌ها و مجموعه‌های کاربر محفوظ ماندند.',
      keysHealth: inspectSchemaKeyHealth(updatedProgress),
      countsSummary: {
        completedLessons: 0,
        savedPrompts: updatedProgress.savedPrompts?.length || 0,
        xp: 0,
        streakDays: 1,
        exercises: 0
      }
    };
    const updatedLogs = addMigrationLog(logEntry);
    setMigrationLogs(updatedLogs);

    addToast('پیشرفت آموزشی با موفقیت بازنشانی شد. پرامپت‌های شما حفظ گردیدند.', 'info');
  };

  // RESET ALL DATA (Complete purge)
  const resetAllData = () => {
    setProgress(INITIAL_PROGRESS);
    setSettings(DEFAULT_SETTINGS);
    setOnboarding(DEFAULT_ONBOARDING);
    try {
      localStorage.removeItem(STORAGE_KEYS.PROGRESS);
      localStorage.removeItem(STORAGE_KEYS.SETTINGS);
      localStorage.removeItem(STORAGE_KEYS.ONBOARDING);
      localStorage.removeItem(STORAGE_KEYS.LEGACY_PROGRESS);
    } catch {
      // Ignore
    }

    const logEntry: MigrationLogEntry = {
      id: 'reset-all-' + Date.now(),
      timestamp: new Date().toISOString(),
      fromVersion: 'v1.0 (Active)',
      toVersion: 'v1.0 (Clean State)',
      status: 'warning',
      title: 'پاکسازی و بازنشانی کامل داده‌های محلی',
      details: 'تمامی سوابق آموزشی، پرامپت‌ها و تنظیمات به مقادیر اولیه بازنشانی شدند.',
      keysHealth: inspectSchemaKeyHealth(INITIAL_PROGRESS),
      countsSummary: {
        completedLessons: 0,
        savedPrompts: 0,
        xp: 0,
        streakDays: 1,
        exercises: 0
      }
    };
    const updatedLogs = addMigrationLog(logEntry);
    setMigrationLogs(updatedLogs);

    addToast('تمامی داده‌های محلی و تنظیمات با موفقیت بازنشانی شدند.', 'warning');
  };

  // Backward compatible resetProgress
  const resetProgress = () => {
    resetProgressOnly();
  };

  // EXPORT BACKUP
  const exportFullBackupJSON = () => {
    const pkg = createExportPackage(progress, settings, onboarding);
    addToast('اطلاعات با موفقیت Export شد.', 'success');
    return JSON.stringify(pkg, null, 2);
  };

  const exportProgressJSON = () => {
    return exportFullBackupJSON();
  };

  // IMPORT BACKUP
  const validateAndPrepareImport = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      return validateBackupData(parsed);
    } catch {
      return { valid: false, error: 'فایل معتبر نیست یا با نسخه فعلی PromptLab سازگار نیست.' };
    }
  };

  const executeImport = (pkg: PromptLabExportPackage, mode: 'merge' | 'replace'): boolean => {
    try {
      let newProgress: UserProgress;
      if (mode === 'replace') {
        newProgress = pkg.data.progress;
        setProgress(newProgress);
        if (pkg.data.settings) setSettings(pkg.data.settings);
        if (pkg.data.onboarding) setOnboarding(pkg.data.onboarding);
      } else {
        newProgress = mergeProgress(progress, pkg.data.progress);
        setProgress(newProgress);
        if (pkg.data.settings) {
          setSettings((prev) => ({ ...prev, ...pkg.data.settings }));
        }
      }

      // Record migration log for import
      const importLog: MigrationLogEntry = {
        id: 'import-' + Date.now(),
        timestamp: new Date().toISOString(),
        fromVersion: `Backup (${pkg.version || 'v1.0'})`,
        toVersion: 'v1.0 (Current)',
        status: 'imported',
        title: mode === 'merge' ? 'ادغام موفقیت‌آمیز داده‌های پشتیبان' : 'جایگزینی کامل داده‌ها با پشتیبان',
        details: `پکیج پشتیبان شامل ${pkg.data.progress.completedLessons?.length || 0} درس و ${pkg.data.progress.savedPrompts?.length || 0} پرامپت با موفقیت وارد گردید.`,
        keysHealth: inspectSchemaKeyHealth(newProgress),
        countsSummary: {
          completedLessons: newProgress.completedLessons?.length || 0,
          savedPrompts: newProgress.savedPrompts?.length || 0,
          xp: newProgress.xp || 0,
          streakDays: newProgress.learningStreakDays || 1,
          exercises: newProgress.completedExercises?.length || 0
        }
      };
      const updated = addMigrationLog(importLog);
      setMigrationLogs(updated);

      addToast('اطلاعات با موفقیت Import شد.', 'success');
      return true;
    } catch (e) {
      console.error('Import execution error', e);
      addToast('خطا در بارگذاری اطلاعات پشتیبان', 'error');
      return false;
    }
  };

  const verifySchemaIntegrity = useCallback(() => {
    const newLog = runSchemaVerification(progress, settings);
    setMigrationLogs(getMigrationLogs());
    addToast('اعتبارسنجی اسکیمای محلی با موفقیت انجام شد.', 'success');
    return newLog;
  }, [progress, settings, addToast]);

  const clearMigrationLogsHistory = useCallback(() => {
    clearMigrationLogs();
    setMigrationLogs([]);
    addToast('تاریخچه گزارش‌های مهاجرت با موفقیت پاکسازی شد.', 'info');
  }, [addToast]);

  // Backward-compatible importProgressJSON
  const importProgressJSON = (jsonString: string): boolean => {
    const val = validateAndPrepareImport(jsonString);
    if (val.valid && val.data) {
      return executeImport(val.data, 'merge');
    }
    // Also support legacy raw UserProgress json
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && typeof parsed.overallPercentage === 'number') {
        const merged = mergeProgress(progress, parsed);
        setProgress(merged);
        addToast('اطلاعات با موفقیت Import شد.', 'success');
        return true;
      }
    } catch {
      // Ignore
    }
    return false;
  };

  const isLessonCompleted = (lessonId: string) => {
    return progress.completedLessons.includes(lessonId);
  };

  const isLevelCompleted = (levelId: number) => {
    const level = CURRICULUM_LEVELS.find((lvl) => lvl.id === levelId);
    if (!level) return false;
    return level.lessons.every((l) => progress.completedLessons.includes(l.id));
  };

  const isLevelLocked = (levelId: number) => {
    if (levelId === 1) return false;
    const prevLevel = CURRICULUM_LEVELS.find((lvl) => lvl.id === levelId - 1);
    if (!prevLevel) return false;
    return !prevLevel.lessons.some((l) => progress.completedLessons.includes(l.id));
  };

  const recordGameResult = (game: 'snake' | '2048' | 'memory', score: number, meta?: { moves?: number; highestTile?: number }) => {
    const currentStats = progress.gameStats || {
      snakeBestScore: 0,
      game2048BestScore: 0,
      memoryBestScore: 0,
      memoryBestMoves: 999,
      breaksCompletedCount: 0,
      gamesPlayedCount: 0,
      favoriteGame: game
    };

    const newlyUnlocked = [...progress.unlockedAchievements];

    let newSnakeBest = currentStats.snakeBestScore;
    let new2048Best = currentStats.game2048BestScore;
    let newMemoryBest = currentStats.memoryBestScore;
    let newMemoryMoves = currentStats.memoryBestMoves;

    if (game === 'snake') {
      newSnakeBest = Math.max(currentStats.snakeBestScore, score);
      if (!newlyUnlocked.includes('ach-snake-rookie')) {
        newlyUnlocked.push('ach-snake-rookie');
      }
    } else if (game === '2048') {
      new2048Best = Math.max(currentStats.game2048BestScore, score);
      if ((meta?.highestTile || 0) >= 512 && !newlyUnlocked.includes('ach-2048-starter')) {
        newlyUnlocked.push('ach-2048-starter');
      }
    } else if (game === 'memory') {
      newMemoryBest = Math.max(currentStats.memoryBestScore, score);
      if (meta?.moves) {
        newMemoryMoves = currentStats.memoryBestMoves === 999 ? meta.moves : Math.min(currentStats.memoryBestMoves, meta.moves);
      }
      if (!newlyUnlocked.includes('ach-memory-master')) {
        newlyUnlocked.push('ach-memory-master');
      }
    }

    setProgress((prev) => ({
      ...prev,
      unlockedAchievements: newlyUnlocked,
      gameStats: {
        snakeBestScore: newSnakeBest,
        game2048BestScore: new2048Best,
        memoryBestScore: newMemoryBest,
        memoryBestMoves: newMemoryMoves,
        breaksCompletedCount: currentStats.breaksCompletedCount,
        gamesPlayedCount: (currentStats.gamesPlayedCount || 0) + 1,
        favoriteGame: game
      }
    }));
  };

  const recordBreakCompleted = () => {
    const currentStats = progress.gameStats || {
      snakeBestScore: 0,
      game2048BestScore: 0,
      memoryBestScore: 0,
      memoryBestMoves: 999,
      breaksCompletedCount: 0,
      gamesPlayedCount: 0
    };

    const newlyUnlocked = [...progress.unlockedAchievements];
    if (!newlyUnlocked.includes('ach-break-taken')) {
      newlyUnlocked.push('ach-break-taken');
    }

    setProgress((prev) => ({
      ...prev,
      unlockedAchievements: newlyUnlocked,
      gameStats: {
        ...currentStats,
        breaksCompletedCount: (currentStats.breaksCompletedCount || 0) + 1
      }
    }));
  };

  const toggleFocusMode = (enabled?: boolean) => {
    setProgress((prev) => ({
      ...prev,
      focusModeEnabled: enabled !== undefined ? enabled : !prev.focusModeEnabled
    }));
  };

  return (
    <ProgressContext.Provider
      value={{
        progress,
        settings,
        onboarding,
        toasts,
        totalLessonsCount,
        completedLessonsCount,
        activeLevelId: progress.currentLevelId,
        activeLessonId: progress.currentLessonId,
        addToast,
        dismissToast,
        updateSettings,
        completeOnboarding,
        resetOnboarding,
        setActiveLessonId,
        setCurrentLesson,
        markLessonCompleted,
        markExerciseCompleted,
        markChallengeCompleted,
        savePlaygroundPrompt,
        deletePlaygroundPrompt,
        completeMission,
        recordArenaAttempt,
        markDailyChallengeCompleted,
        saveExperiment,
        addNote,
        deleteNote,
        createCollection,
        resetProgress,
        resetProgressOnly,
        resetAllData,
        exportFullBackupJSON,
        exportProgressJSON,
        validateAndPrepareImport,
        executeImport,
        importProgressJSON,
        isLessonCompleted,
        isLevelCompleted,
        isLevelLocked,
        recordGameResult,
        recordBreakCompleted,
        recordBenchmarkRun,
        toggleFocusMode,
        migrationLogs,
        verifySchemaIntegrity,
        clearMigrationLogsHistory
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};
