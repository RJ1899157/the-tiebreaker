import { AnalysisType } from "./types";

export interface DecisionPreset {
  id: string;
  topic: string;
  context: string;
  type: AnalysisType;
  options?: string[];
  icon: string;
}

export const PRESETS: DecisionPreset[] = [
  {
    id: "p1",
    topic: "Should I accept a relocation offer to San Francisco?",
    context: "The offer has a 25% salary bump, but rent will double. My partner would need to find a new job, but I love the tech ecosystem and year-round outdoor sports.",
    type: "pros_cons",
    icon: "Briefcase"
  },
  {
    id: "p2",
    topic: "Choosing where to host our company's next annual retreat",
    context: "Comparing team feedback for different atmospheres. Some prefer nature/relaxation, others want fine dining and vibrant nightlife.",
    type: "comparison",
    options: ["Kyoto, Japan", "Amalfi Coast, Italy", "Banff, Canada"],
    icon: "MapPin"
  },
  {
    id: "p3",
    topic: "Launching a paid Substack newsletter centered on DIY smart-home automation",
    context: "I have 10 years of experience, but limited time due to my full-time job. AI tools could speed up writing, but the market might be saturated.",
    type: "swot",
    icon: "Sparkles"
  }
];
