import { TechnicalMetrics } from './types';

export function calculateTechnicalMetrics(
  prompt: string,
  output: string,
  responseTimeMs: number
): TechnicalMetrics {
  const trimmedOutput = output.trim();
  const characterCount = trimmedOutput.length;
  
  // Persian & English word counter
  const words = trimmedOutput ? trimmedOutput.split(/\s+/).filter(Boolean) : [];
  const wordCount = words.length;

  // Format detection
  let detectedFormat: TechnicalMetrics['detectedFormat'] = 'Plain Text';
  let isJsonValid: boolean | undefined = undefined;

  // JSON detection
  if (
    (trimmedOutput.startsWith('{') && trimmedOutput.endsWith('}')) ||
    (trimmedOutput.startsWith('[') && trimmedOutput.endsWith(']')) ||
    trimmedOutput.includes('```json')
  ) {
    detectedFormat = 'JSON';
    try {
      let jsonString = trimmedOutput;
      const jsonMatch = trimmedOutput.match(/```json([\s\S]*?)```/);
      if (jsonMatch) {
        jsonString = jsonMatch[1].trim();
      }
      JSON.parse(jsonString);
      isJsonValid = true;
    } catch {
      isJsonValid = false;
    }
  } else if (/\|[\s\S]*\|[\s\S]*\n\|[\s-:]+\|/.test(trimmedOutput)) {
    detectedFormat = 'Markdown Table';
  } else if (trimmedOutput.includes('```')) {
    detectedFormat = 'Code';
  } else if (/^\s*[-*•\d+.]\s+/m.test(trimmedOutput)) {
    detectedFormat = 'Bullet List';
  } else if (/#+\s|(\n\n[A-Z\u0600-\u06FF]+:)/.test(trimmedOutput)) {
    detectedFormat = 'Structured Text';
  }

  // XML tags presence
  const containsXmlTags = /<\/?[a-zA-Z_][a-zA-Z0-9_-]*>/.test(trimmedOutput) || /<\/?[a-zA-Z_][a-zA-Z0-9_-]*>/.test(prompt);

  // Approximate Token Calculation (1 token ~ 3.5 chars for Persian / 4 chars for English)
  const promptTokens = Math.ceil(prompt.length / 3.5);
  const outputTokens = Math.ceil(characterCount / 3.5);

  return {
    characterCount,
    wordCount,
    detectedFormat,
    isJsonValid,
    containsXmlTags,
    responseTimeMs,
    estimatedTokens: {
      inputTokens: promptTokens,
      promptTokens,
      outputTokens,
      totalTokens: promptTokens + outputTokens
    }
  };
}
