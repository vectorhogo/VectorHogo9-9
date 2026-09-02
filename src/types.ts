export type LevelStatus = 'completed' | 'current' | 'locked';

export type DifficultyLevel = 'مقدماتی' | 'متوسط' | 'پیشرفته' | 'حرفه‌ای';

export type ResourceCategory = 
  | 'مهندسی پرامپت'
  | 'مبانی هوش مصنوعی'
  | 'مدل‌های زبانی بزرگ'
  | 'مهندسی کانتکست'
  | 'ایجنت‌های هوشمند'
  | 'ارزیابی پرامپت'
  | 'کدنویسی با AI'
  | 'تولید تصویر با AI'
  | 'اتوماسیون با AI';

// ==========================================
// 1. SCORING & ANATOMY TYPES
// ==========================================

export type AnatomyBlockId = 
  | 'role' 
  | 'context' 
  | 'task' 
  | 'audience'
  | 'constraints' 
  | 'examples' 
  | 'output_format' 
  | 'success_criteria';

export type PromptQualityLevel = 'Beginner' | 'Developing' | 'Good' | 'Advanced' | 'Expert';

export interface AnatomyBlock {
  id: AnatomyBlockId;
  label: string;
  englishLabel: string;
  whatIsIt: string;
  whyItMatters: string;
  whenToUse: string;
  example: string;
  tag?: string;
  relatedLessonId?: string;
}

export interface PromptScoringBreakdown {
  clarityScore: number;         // Max 20
  contextScore: number;         // Max 15
  taskScore: number;            // Max 20
  constraintsScore: number;     // Max 15
  outputScore: number;          // Max 15
  audienceScore: number;        // Max 5
  examplesScore: number;        // Max 5
  successCriteriaScore: number; // Max 5
  
  // Dimensional summary (0-100)
  structureDimension: number;
  clarityDimension: number;
  contextDimension: number;
  constraintsDimension: number;
  outputDimension: number;
}

export interface PromptScoreResult {
  totalScore: number; // 0-100
  qualityLevel: PromptQualityLevel;
  qualityLevelFa: string;
  passed: boolean;
  breakdown: PromptScoringBreakdown;
  strengths: string[];
  warnings: string[];
  recommendations: string[];
  detectedComponents: {
    hasRole: boolean;
    hasContext: boolean;
    hasTask: boolean;
    hasAudience: boolean;
    hasConstraints: boolean;
    hasOutputFormat: boolean;
    hasExamples: boolean;
    hasSuccessCriteria: boolean;
  };
}

// ==========================================
// 1.5 PLAYGROUND 2.0 CORE DATA MODELS
// ==========================================

export type PromptBlockType = 
  | 'ROLE'
  | 'CONTEXT'
  | 'TASK'
  | 'AUDIENCE'
  | 'CONSTRAINTS'
  | 'EXAMPLES'
  | 'OUTPUT_FORMAT'
  | 'SUCCESS_CRITERIA';

export interface PromptBuilderBlock {
  id: string;
  type: PromptBlockType;
  label: string;
  englishLabel: string;
  value: string;
  placeholder: string;
  enabled: boolean;
}

export interface PromptVariable {
  name: string;
  value: string;
  defaultValue?: string;
  description?: string;
}

export interface PromptVersion {
  id: string;
  versionNumber: number;
  title: string;
  userPrompt: string;
  systemPrompt?: string;
  createdAt: string;
  score?: number;
  changesDescription?: string;
}

export interface SavedPrompt {
  id: string;
  title: string;
  systemPrompt?: string;
  userPrompt: string;
  model: string;
  createdAt: string;
  tags: string[];
  collectionId?: string;
  versions?: PromptVersion[];
  score?: number;
  variables?: Record<string, string>;
}

export interface PromptCollection {
  id: string;
  title: string;
  description?: string;
  iconName?: string;
  color?: string;
  createdAt: string;
}

export interface PromptTemplate {
  id: string;
  title: string;
  englishTitle: string;
  category: 
    | 'Marketing' 
    | 'Writing' 
    | 'Coding' 
    | 'Research' 
    | 'Business' 
    | 'Education' 
    | 'Data Analysis' 
    | 'Social Media' 
    | 'Productivity' 
    | 'AI Assistant';
  categoryFa: string;
  difficulty: DifficultyLevel;
  useCase: string;
  template: string;
  defaultVariables: Record<string, string>;
  tags: string[];
  iconName: string;
}

export interface PromptMission {
  id: string;
  title: string;
  englishTitle: string;
  category: string;
  difficulty: DifficultyLevel;
  brief: string;
  goal: string;
  requirements: string[];
  starterPrompt: string;
  sampleWinningPrompt: string;
  xpReward: number;
  evaluationCriteria: {
    minClarity: number;
    minContext: number;
    requiredElements: PromptBlockType[];
  };
}

export interface PromptMissionSubmission {
  missionId: string;
  submittedPrompt: string;
  score: number;
  passed: boolean;
  strengths: string[];
  missed: string[];
  expertReview: string;
  submittedAt: string;
}

export interface PromptExperiment {
  id: string;
  title: string;
  hypothesis: string;
  promptA: string;
  promptB: string;
  outputA: string;
  outputB: string;
  observations: string;
  learnings: string;
  createdAt: string;
}

export interface PromptNote {
  id: string;
  title: string;
  content: string;
  tags: string[];
  linkedLessonId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AIProviderConfig {
  id: 'anthropic' | 'openai' | 'gemini' | 'simulated';
  name: string;
  models: string[];
  defaultModel: string;
  isAvailable: boolean;
  description: string;
}

// ==========================================
// 2. BAD → BETTER → PRO COMPARISON
// ==========================================

export interface PromptComparison {
  badPrompt: string;
  badOutput: string;
  badCritique: string[];
  
  betterPrompt: string;
  betterOutput: string;
  betterCritique: string[];

  proPrompt: string;
  proOutput: string;
  proStrengths: string[];
  
  whyItMatters: string;
  highlights?: {
    hasRole?: boolean;
    hasContext?: boolean;
    hasAudience?: boolean;
    hasGoal?: boolean;
    hasConstraints?: boolean;
    hasOutputFormat?: boolean;
  };
  technicalBreakdown: {
    title: string;
    description: string;
    tag?: string;
  }[];
}

// ==========================================
// 3. EXERCISES & CHALLENGES
// ==========================================

export interface ExerciseChecklistItem {
  id: string;
  label: string;
  englishLabel: string;
  detectedHint?: string;
}

export interface LessonExercise {
  id: string;
  title: string;
  scenario: string;
  objective: string;
  initialPrompt: string;
  checklist?: ExerciseChecklistItem[];
  expectedKeywords: string[];
  minimumLength?: number;
  sampleSolution: string;
  hint: string;
  simulatedResponse?: (userPrompt: string) => {
    output: string;
    score: number;
    feedback: string;
    passed: boolean;
    checklistChecks?: { [key: string]: boolean };
  };
}

export interface LessonChallenge {
  id: string;
  title: string;
  difficulty: DifficultyLevel;
  brief: string;
  requirements: string[];
  starterPrompt: string;
  sampleWinningPrompt: string;
  evaluationCriteria: string[];
}

export type Exercise = LessonExercise;
export type Challenge = LessonChallenge;

// ==========================================
// 4. SECTION-BASED MODULAR COURSE ARCHITECTURE
// ==========================================

export type SectionType = 
  | 'explanation'
  | 'concept'
  | 'comparison'
  | 'anatomy'
  | 'example'
  | 'code'
  | 'exercise'
  | 'challenge'
  | 'resource'
  | 'checkpoint';

export interface BaseSection {
  id: string;
  type: SectionType;
  title?: string;
}

export interface ExplanationSection extends BaseSection {
  type: 'explanation';
  content: string;
  callout?: {
    type: 'info' | 'warning' | 'tip' | 'quote';
    title?: string;
    message: string;
  };
}

export interface ConceptSection extends BaseSection {
  type: 'concept';
  summary: string;
  principles: { title?: string; description: string; tag?: string }[];
}

export interface ComparisonSection extends BaseSection {
  type: 'comparison';
  comparison: PromptComparison;
}

export interface AnatomySection extends BaseSection {
  type: 'anatomy';
  description?: string;
  defaultActiveBlock?: AnatomyBlockId;
}

export interface ExampleSection extends BaseSection {
  type: 'example';
  domain: string;
  context: string;
  prompt: string;
  expectedOutput?: string;
  businessImpact: string;
}

export interface CodeSection extends BaseSection {
  type: 'code';
  language: string;
  code: string;
  explanation?: string;
}

export interface ExerciseSection extends BaseSection {
  type: 'exercise';
  exercise: LessonExercise;
}

export interface ChallengeSection extends BaseSection {
  type: 'challenge';
  challenge: LessonChallenge;
}

export interface ResourceSection extends BaseSection {
  type: 'resource';
  resources: { title: string; source: string; url: string; note?: string }[];
}

export interface CheckpointSection extends BaseSection {
  type: 'checkpoint';
  takeaways: string[];
  nextLessonSuggestion?: string;
}

export type LessonSection = 
  | ExplanationSection
  | ConceptSection
  | ComparisonSection
  | AnatomySection
  | ExampleSection
  | CodeSection
  | ExerciseSection
  | ChallengeSection
  | ResourceSection
  | CheckpointSection;

// ==========================================
// 5. LESSON, MODULE, LEVEL & COURSE
// ==========================================

export interface Lesson {
  id: string;
  levelId: number;
  moduleId?: string;
  title: string;
  englishTitle: string;
  duration: string;
  estimatedMinutes?: number;
  difficulty: DifficultyLevel;
  shortDescription: string;
  learningObjectives?: string[];
  
  // Section-based data architecture
  sections?: LessonSection[];
  
  // Core properties for backward-compatibility and quick rendering
  concept: string;
  corePrinciples: string[];
  comparison: PromptComparison;
  realWorldUseCase: {
    domain: string;
    context: string;
    practicalPrompt: string;
    businessImpact: string;
  };
  exercise: LessonExercise;
  challenge: LessonChallenge;
  keyTakeaways: string[];
}

export interface Module {
  id: string;
  title: string;
  englishTitle?: string;
  description: string;
  order: number;
  levelId: number;
  lessons: Lesson[];
  challenge?: LessonChallenge;
}

export interface Level {
  id: number;
  title: string;
  englishTitle: string;
  code: string;
  summary: string;
  estimatedHours: string;
  difficulty: DifficultyLevel;
  iconName: string;
  lessons: Lesson[];
  modules?: Module[];
  keySkill: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  levels: Level[];
}

// ==========================================
// 6. ANTHROPIC TRACK, RESOURCES, PROFILE
// ==========================================

export interface AnthropicTrackItem {
  id: string;
  title: string;
  englishTitle: string;
  officialSourceUrl: string;
  difficulty: DifficultyLevel;
  estimatedTime: string;
  topics: string[];
  overview: string;
  claudeSpecifics: string[];
  xmlStructureExample: string;
  practicalTips: string[];
  practicePrompt: {
    initial: string;
    goal: string;
    solution: string;
  };
}

export interface ResourceItem {
  id: string;
  title: string;
  englishTitle: string;
  source: string;
  category: ResourceCategory;
  difficulty: DifficultyLevel;
  shortDescription: string;
  link: string;
  tags: string[];
  isOfficial?: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  englishTitle: string;
  description: string;
  icon: string;
  category: 'completion' | 'mastery' | 'playground' | 'streak';
  unlockedAt?: string;
  conditionDescription: string;
}

export interface ArenaAttempt {
  timestamp: string;
  score: number;
  prompt: string;
}

export interface ArenaMissionHistory {
  missionId: string;
  attempts: ArenaAttempt[];
  bestScore: number;
  completed: boolean;
}

export interface DailyChallengeStatus {
  lastCompletedDate?: string;
  completedCount: number;
}

export interface GameStats {
  snakeBestScore: number;
  game2048BestScore: number;
  memoryBestScore: number;
  memoryBestMoves: number;
  breaksCompletedCount: number;
  gamesPlayedCount: number;
  favoriteGame?: 'snake' | '2048' | 'memory';
}

export interface UserProgress {
  overallPercentage: number;
  completedLessons: string[]; // lesson ids
  completedExercises: string[]; // exercise ids
  completedChallenges: string[]; // challenge ids
  completedMissions?: string[]; // mission ids
  currentLessonId: string;
  currentLevelId: number;
  currentModuleId?: string;
  learningStreakDays: number;
  lastActiveDate: string;
  savedPrompts: SavedPrompt[];
  collections?: PromptCollection[];
  experiments?: PromptExperiment[];
  missionSubmissions?: PromptMissionSubmission[];
  notes?: PromptNote[];
  arenaHistory?: Record<string, ArenaMissionHistory>;
  dailyChallengeStatus?: DailyChallengeStatus;
  mentorHintsUsedCount?: number;
  gameStats?: GameStats;
  focusModeEnabled?: boolean;
  unlockedAchievements: string[];
  xp: number;
}

// ==========================================
// 7. PHASE 07: SETTINGS, ONBOARDING, TOASTS & BACKUP
// ==========================================

export type ThemeMode = 'dark' | 'light' | 'system';

export interface UserSettings {
  theme: ThemeMode;
  reducedMotion: boolean;
  largeText: boolean;
  highContrast: boolean;
  dailyChallengeReminder: boolean;
  showLearningReminders: boolean;
  autoOpenNextLesson: boolean;
  enableGames: boolean;
  breakTimerMinutes: number; // 25, 45, 60
  soundEnabled: boolean;
}

export type ExperienceLevel = 'beginner' | 'some_experience' | 'intermediate' | 'advanced';
export type PrimaryGoal = 
  | 'learn_foundations' 
  | 'build_pro_prompts' 
  | 'work_productivity' 
  | 'build_ai_workflows' 
  | 'real_world_projects';

export interface OnboardingState {
  completed: boolean;
  experienceLevel?: ExperienceLevel;
  primaryGoal?: PrimaryGoal;
  recommendedStartingLevelId?: number;
  recommendedStartingLessonId?: string;
  completedAt?: string;
  skipped?: boolean;
}

export interface PromptLabExportPackage {
  schemaVersion: 1;
  exportedAt: string;
  app: 'PromptLab';
  version: string;
  data: {
    progress: UserProgress;
    settings: UserSettings;
    onboarding: OnboardingState;
  };
}

export interface NextStepRecommendation {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  reason: string;
  actionText: string;
  actionView: string;
  lessonId?: string;
  starterPrompt?: string;
  iconName: string;
  priority: number;
  xpReward?: number;
}

export type ToastType = 'success' | 'info' | 'warning' | 'error';

export interface ToastNotification {
  id: string;
  message: string;
  type?: ToastType;
  duration?: number;
}

export type MigrationStatus = 'success' | 'verified' | 'imported' | 'warning';

export interface SchemaKeyHealth {
  key: string;
  status: 'healthy' | 'migrated' | 'empty' | 'missing';
  description: string;
  recordCount?: number;
  byteSize?: number;
}

export interface MigrationLogEntry {
  id: string;
  timestamp: string; // ISO string
  fromVersion: string;
  toVersion: string;
  status: MigrationStatus;
  title: string;
  details: string;
  keysHealth: SchemaKeyHealth[];
  countsSummary?: {
    completedLessons: number;
    savedPrompts: number;
    xp: number;
    streakDays: number;
    exercises: number;
  };
}

export interface ShortcutItem {
  id: string;
  keys: string[];
  macKeys: string[];
  description: string;
  category: 'global' | 'playground' | 'palette' | 'games';
  actionName?: string;
  targetView?: string;
}


