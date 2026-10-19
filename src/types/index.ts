export type MoodType = 'romantic' | 'flirty' | 'spicy' | 'funny' | 'casual' | 'motivating';

export type LengthType = 'short' | 'medium' | 'long';

export interface ReplyOption {
  id: string;
  label: string;
  text: string;
  whyItWorks: string;
  vibe?: string;
}

export interface DatingMetrics {
  interestScore: number;
  dryTexterWarning: boolean;
  redFlags?: string[];
  greenFlags?: string[];
  recommendedNextMove: string;
}

export interface AnalysisResult {
  detectedChatSummary?: string;
  interestLevel: 'Low' | 'Medium' | 'High';
  interestWhy: string;
  signaling: string;
  replies: ReplyOption[];
  quickTip: string;
  datingMetrics: DatingMetrics;
  engine?: string;
  modelUsed?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface DatingConcept {
  term: string;
  tag: string;
  definition: string;
  wingmanRule: string;
  example: string;
}
