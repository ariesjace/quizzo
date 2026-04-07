export interface Question {
  num: number;
  difficulty: string;
  topic: string;
  scenario: string;
  question: string;
  options: Record<string, string>;
  correct: string;
  rationale: string;
}

export type QuizMode = 'home' | 'quiz' | 'results';
export type FilterMode = 'all' | 'topic' | 'difficulty';
