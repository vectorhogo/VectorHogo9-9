export type AIProviderId = 'demo' | 'anthropic' | 'openai' | 'gemini';

export type ModelStatus = 'available' | 'demo' | 'not_configured' | 'error';

export interface ModelOption {
  id: string;
  name: string;
  providerId: AIProviderId;
  providerName: string;
  version: string;
  description: string;
  contextWindow: string;
  badge?: string;
  status: ModelStatus;
  capabilities: {
    systemPrompt: boolean;
    streaming: boolean;
    temperature: boolean;
    maxTokens: boolean;
    jsonMode: boolean;
  };
  specialtyFa: string;
}

export interface GenerateParams {
  systemPrompt?: string;
  userPrompt: string;
  modelId: string;
  temperature?: number;
  maxTokens?: number;
  onChunk?: (chunk: string, accumulated: string) => void;
  signal?: AbortSignal;
}

export interface TechnicalMetrics {
  characterCount: number;
  wordCount: number;
  detectedFormat: 'JSON' | 'Markdown Table' | 'Code' | 'Bullet List' | 'Structured Text' | 'Plain Text';
  isJsonValid?: boolean;
  containsXmlTags: boolean;
  keywordMatchRate?: number;
  responseTimeMs: number;
  estimatedTokens?: {
    inputTokens: number;
    promptTokens?: number;
    outputTokens: number;
    totalTokens: number;
  };
}

export interface ManualScorecard {
  clarity: number; // 1-5
  instructionFollowing: number; // 1-5
  relevance: number; // 1-5
  outputStructure: number; // 1-5
  consistency: number; // 1-5
  averageScore: number; // calculated 1-5
  userFeedback?: string;
}

export interface BenchmarkExperimentRecord {
  id: string;
  title: string;
  mode: 'single' | 'compare_models' | 'ab_prompts';
  createdAt: string;
  timestamp: number;
  hypothesis?: string;
  learnings?: string;
  relatedSkill?: string;
  relatedLessonId?: string;
  
  // Single or Compare
  modelA: string;
  providerA: AIProviderId;
  systemPromptA?: string;
  promptA: string;
  outputA: string;
  metricsA?: TechnicalMetrics;
  scorecardA?: ManualScorecard;
  
  // For Compare Models / AB Prompts
  modelB?: string;
  providerB?: AIProviderId;
  systemPromptB?: string;
  promptB?: string;
  outputB?: string;
  metricsB?: TechnicalMetrics;
  scorecardB?: ManualScorecard;
  
  mentorExplanation?: string;
  parameters: {
    temperature: number;
    maxTokens: number;
  };
}

export interface GenerateResult {
  text: string;
  modelId: string;
  providerId: AIProviderId;
  durationMs: number;
  usage?: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
  };
  metrics: TechnicalMetrics;
  isDemo: boolean;
}

export interface AIProvider {
  id: AIProviderId;
  name: string;
  englishName: string;
  status: ModelStatus;
  statusMessageFa: string;
  getModels(): ModelOption[];
  validateConfiguration(): { valid: boolean; message?: string };
  generate(params: GenerateParams): Promise<GenerateResult>;
}
