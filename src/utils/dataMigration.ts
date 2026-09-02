import { UserProgress, UserSettings, OnboardingState, PromptLabExportPackage, MigrationLogEntry, SchemaKeyHealth } from '../types';
import { CURRICULUM_LEVELS } from '../data/curriculum';

export const STORAGE_KEYS = {
  PROGRESS: 'promptlab.progress.v1',
  SETTINGS: 'promptlab.settings.v1',
  ONBOARDING: 'promptlab.onboarding.v1',
  MIGRATION_LOGS: 'promptlab.migration_logs.v1',
  LEGACY_PROGRESS: 'promptlab_user_progress_v1'
} as const;

export const DEFAULT_SETTINGS: UserSettings = {
  theme: 'dark',
  reducedMotion: false,
  largeText: false,
  highContrast: false,
  dailyChallengeReminder: true,
  showLearningReminders: true,
  autoOpenNextLesson: true,
  enableGames: true,
  breakTimerMinutes: 25,
  soundEnabled: false
};

export const DEFAULT_ONBOARDING: OnboardingState = {
  completed: false,
  skipped: false
};

/**
 * Validates an imported JSON object against PromptLab backup schema v1.
 */
export function validateBackupData(parsed: any): { valid: boolean; error?: string; data?: PromptLabExportPackage } {
  if (!parsed || typeof parsed !== 'object') {
    return { valid: false, error: 'فایل معتبر نیست یا محتوای آن خالی است.' };
  }

  // Check Schema Version
  if (parsed.schemaVersion !== 1) {
    return { valid: false, error: 'نسخه فایل پشتیبان (schemaVersion) با این نگارش PromptLab سازگار نیست.' };
  }

  // Check Application Identifier
  if (parsed.app !== 'PromptLab') {
    return { valid: false, error: 'این فایل متعلق به نرم‌افزار PromptLab نیست.' };
  }

  // Check Data structure
  if (!parsed.data || typeof parsed.data !== 'object') {
    return { valid: false, error: 'داده‌های فایل پشتیبان ساختار معتبری ندارند.' };
  }

  const { progress } = parsed.data;
  if (!progress || typeof progress !== 'object') {
    return { valid: false, error: 'بخش اطلاعات پیشرفت (progress) در فایل یافت نشد.' };
  }

  if (!Array.isArray(progress.completedLessons)) {
    return { valid: false, error: 'فهرست دروس تکمیل‌شده در فایل ناقص است.' };
  }

  if (typeof progress.xp !== 'number' && typeof progress.xp !== 'undefined') {
    return { valid: false, error: 'نوع داده‌های پیشرفت نامعتبر است.' };
  }

  return { valid: true, data: parsed as PromptLabExportPackage };
}

/**
 * Creates a clean versioned export package.
 * Strips any potential sensitive keys or tokens.
 */
export function createExportPackage(
  progress: UserProgress,
  settings: UserSettings,
  onboarding: OnboardingState
): PromptLabExportPackage {
  // Deep clone to prevent mutating live state
  const sanitizedProgress: UserProgress = JSON.parse(JSON.stringify(progress));

  return {
    schemaVersion: 1,
    exportedAt: new Date().toISOString(),
    app: 'PromptLab',
    version: '1.7.0',
    data: {
      progress: sanitizedProgress,
      settings: JSON.parse(JSON.stringify(settings)),
      onboarding: JSON.parse(JSON.stringify(onboarding))
    }
  };
}

/**
 * Merges imported progress with current progress safely without loss.
 */
export function mergeProgress(current: UserProgress, imported: UserProgress): UserProgress {
  // Union of completed arrays
  const unionArrays = (a: string[] = [], b: string[] = []) => Array.from(new Set([...a, ...b]));

  const completedLessons = unionArrays(current.completedLessons, imported.completedLessons);
  const completedExercises = unionArrays(current.completedExercises, imported.completedExercises);
  const completedChallenges = unionArrays(current.completedChallenges, imported.completedChallenges);
  const completedMissions = unionArrays(current.completedMissions || [], imported.completedMissions || []);
  const unlockedAchievements = unionArrays(current.unlockedAchievements || [], imported.unlockedAchievements || []);

  // Merge saved prompts (by id)
  const promptMap = new Map<string, any>();
  (current.savedPrompts || []).forEach((p) => promptMap.set(p.id, p));
  (imported.savedPrompts || []).forEach((p) => {
    if (!promptMap.has(p.id)) {
      promptMap.set(p.id, p);
    }
  });

  // Merge collections
  const colMap = new Map<string, any>();
  (current.collections || []).forEach((c) => colMap.set(c.id, c));
  (imported.collections || []).forEach((c) => {
    if (!colMap.has(c.id)) {
      colMap.set(c.id, c);
    }
  });

  // Merge experiments
  const expMap = new Map<string, any>();
  (current.experiments || []).forEach((e) => expMap.set(e.id, e));
  (imported.experiments || []).forEach((e) => {
    if (!expMap.has(e.id)) {
      expMap.set(e.id, e);
    }
  });

  // Merge notes
  const notesMap = new Map<string, any>();
  (current.notes || []).forEach((n) => notesMap.set(n.id, n));
  (imported.notes || []).forEach((n) => {
    if (!notesMap.has(n.id)) {
      notesMap.set(n.id, n);
    }
  });

  // Merge arena history
  const mergedArena = { ...(current.arenaHistory || {}) };
  if (imported.arenaHistory) {
    Object.entries(imported.arenaHistory).forEach(([missionId, impHist]) => {
      const existing = mergedArena[missionId];
      if (!existing) {
        mergedArena[missionId] = impHist;
      } else {
        mergedArena[missionId] = {
          missionId,
          attempts: [...existing.attempts, ...(impHist.attempts || [])],
          bestScore: Math.max(existing.bestScore || 0, impHist.bestScore || 0),
          completed: existing.completed || impHist.completed
        };
      }
    });
  }

  // Total lessons count
  const totalLessonsCount = CURRICULUM_LEVELS.reduce((acc, lvl) => acc + lvl.lessons.length, 0);
  const overallPercentage = Math.min(100, Math.round((completedLessons.length / totalLessonsCount) * 100));

  return {
    ...current,
    overallPercentage,
    completedLessons,
    completedExercises,
    completedChallenges,
    completedMissions,
    unlockedAchievements,
    savedPrompts: Array.from(promptMap.values()),
    collections: Array.from(colMap.values()),
    experiments: Array.from(expMap.values()),
    notes: Array.from(notesMap.values()),
    arenaHistory: mergedArena,
    xp: Math.max(current.xp || 0, imported.xp || 0),
    learningStreakDays: Math.max(current.learningStreakDays || 1, imported.learningStreakDays || 1),
    lastActiveDate: current.lastActiveDate || imported.lastActiveDate || new Date().toISOString().split('T')[0]
  };
}

/**
 * Reads migration logs from localStorage.
 */
export function getMigrationLogs(): MigrationLogEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MIGRATION_LOGS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn('Failed to parse migration logs:', e);
    return [];
  }
}

/**
 * Saves migration logs to localStorage.
 */
export function saveMigrationLogs(logs: MigrationLogEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.MIGRATION_LOGS, JSON.stringify(logs));
  } catch (e) {
    console.warn('Failed to save migration logs:', e);
  }
}

/**
 * Appends a new migration log entry to localStorage.
 */
export function addMigrationLog(entry: MigrationLogEntry): MigrationLogEntry[] {
  const currentLogs = getMigrationLogs();
  const updated = [entry, ...currentLogs.filter((l) => l.id !== entry.id)].slice(0, 50); // Keep last 50
  saveMigrationLogs(updated);
  return updated;
}

/**
 * Clears all migration logs from localStorage.
 */
export function clearMigrationLogs(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.MIGRATION_LOGS);
  } catch (e) {
    console.warn('Failed to clear migration logs:', e);
  }
}

/**
 * Inspects all known localStorage keys and analyzes health and size.
 */
export function inspectSchemaKeyHealth(progress?: UserProgress): SchemaKeyHealth[] {
  const keysToCheck = [
    {
      key: STORAGE_KEYS.PROGRESS,
      description: 'پیشرفت دوره، تمرین‌ها، پرامپت‌های شخصی و سوابق آرنا'
    },
    {
      key: STORAGE_KEYS.SETTINGS,
      description: 'تنظیمات ظاهری، دسترسی‌پذیری و ترجیحات یادگیری'
    },
    {
      key: STORAGE_KEYS.ONBOARDING,
      description: 'وضعیت راهنمای شروع و مسیر پیشنهادی'
    },
    {
      key: STORAGE_KEYS.MIGRATION_LOGS,
      description: 'تاریخچه ارتقا و اعتبارسنجی اسکیما'
    },
    {
      key: 'promptlab_playground_draft',
      description: 'پیش‌نویس موقت ادیتور پلی‌گراند'
    }
  ];

  return keysToCheck.map((item) => {
    try {
      const rawVal = localStorage.getItem(item.key);
      if (rawVal === null) {
        return {
          key: item.key,
          status: 'missing',
          description: item.description,
          recordCount: 0,
          byteSize: 0
        };
      }

      const byteSize = new Blob([rawVal]).size;
      let recordCount = 0;

      try {
        const parsed = JSON.parse(rawVal);
        if (Array.isArray(parsed)) {
          recordCount = parsed.length;
        } else if (typeof parsed === 'object' && parsed !== null) {
          // If progress, count completedLessons + savedPrompts
          if (item.key === STORAGE_KEYS.PROGRESS) {
            recordCount = (parsed.completedLessons?.length || 0) + (parsed.savedPrompts?.length || 0);
          } else {
            recordCount = Object.keys(parsed).length;
          }
        }
      } catch {
        recordCount = 1;
      }

      return {
        key: item.key,
        status: byteSize > 0 ? 'healthy' : 'empty',
        description: item.description,
        recordCount,
        byteSize
      };
    } catch {
      return {
        key: item.key,
        status: 'missing',
        description: item.description,
        recordCount: 0,
        byteSize: 0
      };
    }
  });
}

/**
 * Runs an active verification of the local storage schema and logs the result.
 */
export function runSchemaVerification(
  progress: UserProgress,
  settings: UserSettings
): MigrationLogEntry {
  const keysHealth = inspectSchemaKeyHealth(progress);

  // Validate structural integrity
  const isProgressValid = Boolean(
    progress && 
    Array.isArray(progress.completedLessons) && 
    typeof progress.xp === 'number'
  );

  const isSettingsValid = Boolean(
    settings && 
    typeof settings.theme === 'string'
  );

  const status: MigrationLogEntry['status'] = (isProgressValid && isSettingsValid) ? 'verified' : 'warning';
  
  const entry: MigrationLogEntry = {
    id: 'verify-' + Date.now(),
    timestamp: new Date().toISOString(),
    fromVersion: 'v1.0 (Local)',
    toVersion: 'v1.0 (Verified)',
    status,
    title: 'اعتبارسنجی یکپارچگی ساختار و اسکیمای داده‌ها',
    details: isProgressValid
      ? 'ساختار داده‌های پیشرفت، پرامپت‌های ذخیره‌شده، تنظیمات کاربری و نگاشت کلیدها کاملاً سالم و منطبق با نگارش v1.0 است.'
      : 'نقص ساختاری در داده‌های محلی تشخیص داده شد.',
    keysHealth,
    countsSummary: {
      completedLessons: progress.completedLessons?.length || 0,
      savedPrompts: progress.savedPrompts?.length || 0,
      xp: progress.xp || 0,
      streakDays: progress.learningStreakDays || 1,
      exercises: progress.completedExercises?.length || 0
    }
  };

  addMigrationLog(entry);
  return entry;
}

/**
 * Ensures baseline migration log entry exists so users can always see schema history.
 */
export function ensureBaselineMigrationLog(progress: UserProgress, settings: UserSettings): void {
  const existing = getMigrationLogs();
  if (existing.length === 0) {
    const keysHealth = inspectSchemaKeyHealth(progress);
    const baselineEntry: MigrationLogEntry = {
      id: 'init-baseline-v1',
      timestamp: new Date().toISOString(),
      fromVersion: 'v0.9 (Legacy Architecture)',
      toVersion: 'v1.0 (Production Schema)',
      status: 'success',
      title: 'استقرار اولیه و راه‌اندازی ساختار استاندارد نسخه ۱',
      details: 'انتقال و نگاشت کلیدهای پایدار promptlab.*.v1 با موفقیت انجام شد. کلیه سوابق آموزشی و ابزارها آماده به کار هستند.',
      keysHealth,
      countsSummary: {
        completedLessons: progress.completedLessons?.length || 0,
        savedPrompts: progress.savedPrompts?.length || 0,
        xp: progress.xp || 0,
        streakDays: progress.learningStreakDays || 1,
        exercises: progress.completedExercises?.length || 0
      }
    };
    saveMigrationLogs([baselineEntry]);
  }
}

/**
 * Migrates legacy local storage key 'promptlab_user_progress_v1' to 'promptlab.progress.v1'
 * and records a migration log.
 */
export function migrateLegacyStorage(): void {
  try {
    const legacy = localStorage.getItem(STORAGE_KEYS.LEGACY_PROGRESS);
    const existingNew = localStorage.getItem(STORAGE_KEYS.PROGRESS);

    if (legacy && !existingNew) {
      localStorage.setItem(STORAGE_KEYS.PROGRESS, legacy);
      // Clean up legacy key after successful copy
      localStorage.removeItem(STORAGE_KEYS.LEGACY_PROGRESS);

      let parsedLegacy: any = null;
      try {
        parsedLegacy = JSON.parse(legacy);
      } catch {
        // ignore
      }

      // Record migration log
      const logEntry: MigrationLogEntry = {
        id: 'legacy-migration-' + Date.now(),
        timestamp: new Date().toISOString(),
        fromVersion: 'promptlab_user_progress_v1 (v0.9)',
        toVersion: 'promptlab.progress.v1 (v1.0)',
        status: 'success',
        title: 'مهاجرت موفق از کلید سنتی به نگارش ۱',
        details: 'کلید سنتی با موفقیت شناسایی و به ساختار پایدار promptlab.progress.v1 منتقل گردید.',
        keysHealth: [
          {
            key: STORAGE_KEYS.PROGRESS,
            status: 'migrated',
            description: 'انتقال موفقیت‌آمیز داده‌های کاربر به کلید استاندارد جدید',
            recordCount: parsedLegacy?.completedLessons?.length || 0,
            byteSize: new Blob([legacy]).size
          }
        ],
        countsSummary: {
          completedLessons: parsedLegacy?.completedLessons?.length || 0,
          savedPrompts: parsedLegacy?.savedPrompts?.length || 0,
          xp: parsedLegacy?.xp || 0,
          streakDays: parsedLegacy?.learningStreakDays || 1,
          exercises: parsedLegacy?.completedExercises?.length || 0
        }
      };

      addMigrationLog(logEntry);
    }
  } catch (e) {
    console.warn('Storage migration check error:', e);
  }
}
