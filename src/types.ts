export type AnalysisType = "pros_cons" | "swot" | "comparison";

export interface DecisionItem {
  id: string;
  point: string;
  description: string;
  weight: number; // 1 to 5
}

export interface ProsConsAnalysis {
  title: string;
  overview: string;
  pros: DecisionItem[];
  cons: DecisionItem[];
  recommendation: string;
  confidence: number; // 0 - 100
}

export interface SwotItem {
  id: string;
  item: string;
  detail: string;
  weight: number; // Standard multiplier (e.g. 1 to 5) for user weighting
}

export interface SwotAnalysis {
  title: string;
  overview: string;
  strengths: SwotItem[];
  weaknesses: SwotItem[];
  opportunities: SwotItem[];
  threats: SwotItem[];
  recommendation: string;
}

export interface OptionCompare {
  id: string;
  name: string;
  scores: number[]; // Scores correspond to each criterion (1-5)
  details: string[]; // Context strings corresponding to each score
}

export interface ComparisonAnalysis {
  title: string;
  overview: string;
  criteria: string[];
  criteriaWeights?: number[]; // Interactive criteria weights (1-5) added by user
  options: OptionCompare[];
  recommendation: string;
}

export interface SavedDecision {
  id: string;
  timestamp: string;
  topic: string;
  context?: string;
  type: AnalysisType;
  // Hold whatever analysis type was generated (can be customized by user)
  result: ProsConsAnalysis | SwotAnalysis | ComparisonAnalysis;
}
