export const CANDIDATE_GEMINI_MODELS = [
  "gemini-3.5-flash-lite",
  "gemini-3.5-flash",
  "gemini-3.6-flash",
  "gemini-3.7-flash",
  "gemini-2.5-flash",
];

export interface IAIResponsesSummary {
  executiveSummary: string;
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
  keyThemes: string[];
  recommendations: string[];
  responseCount: number;
}
