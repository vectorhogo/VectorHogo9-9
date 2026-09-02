export interface MentorAnalysisIssue {
  id: string;
  category: 'role' | 'task' | 'context' | 'constraints' | 'output_format' | 'audience' | 'examples' | 'success_criteria' | 'clarity';
  severity: 'high' | 'medium' | 'low';
  title: string;
  explanation: string; // "مدل باید دقیقاً بداند چه کاری باید انجام دهد."
  hint1: string;       // Small clue: "به مخاطب فکر کن."
  hint2: string;       // Specific guidance: "مشخص کن این Prompt برای چه کسی تولید محتوا می‌کند."
  hint3: string;       // Almost complete direction: "یک Audience مشخص مثل مدیران کسب‌وکار تعریف کن."
  suggestedSnippet: string; // The concrete XML/text improvement
  relatedConcept: string;
}

export interface MentorFeedback {
  overallAssessment: string;
  praise: string;
  primaryIssue: MentorAnalysisIssue | null;
  secondaryIssues: MentorAnalysisIssue[];
  teachingPrinciple: string;
  suggestedPrompt: string;
  score: number;
}

export interface MentorProvider {
  id: string;
  name: string;
  analyzePrompt: (prompt: string, context?: Record<string, unknown>) => Promise<MentorFeedback>;
}
