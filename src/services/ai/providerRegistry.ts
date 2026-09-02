import { AIProvider, AIProviderId, ModelOption, GenerateParams, GenerateResult } from './types';
import { DemoProvider } from './providers/DemoProvider';

class AIProviderRegistry {
  private providers: Map<AIProviderId, AIProvider> = new Map();
  private activeProviderId: AIProviderId = 'demo';

  constructor() {
    // Register Demo Provider (always available & safe)
    const demo = new DemoProvider();
    this.providers.set('demo', demo);
  }

  getProviders(): AIProvider[] {
    return Array.from(this.providers.values());
  }

  getProvider(id: AIProviderId): AIProvider | undefined {
    return this.providers.get(id);
  }

  getAllModels(): ModelOption[] {
    const models: ModelOption[] = [];
    for (const provider of this.providers.values()) {
      models.push(...provider.getModels());
    }
    return models;
  }

  getModel(modelId: string): ModelOption | undefined {
    return this.getAllModels().find((m) => m.id === modelId);
  }

  getActiveProvider(): AIProvider {
    return this.providers.get(this.activeProviderId) || this.providers.get('demo')!;
  }

  setActiveProvider(id: AIProviderId) {
    if (this.providers.has(id)) {
      this.activeProviderId = id;
    }
  }

  async generate(params: GenerateParams): Promise<GenerateResult> {
    const model = this.getModel(params.modelId);
    const providerId = model?.providerId || this.activeProviderId;
    const provider = this.getProvider(providerId) || this.getProvider('demo')!;

    return provider.generate(params);
  }
}

export const aiProviderRegistry = new AIProviderRegistry();
