import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  Trash2, 
  Plus, 
  Scale, 
  HelpCircle, 
  Archive, 
  CornerDownRight, 
  Flame, 
  TrendingUp, 
  ThumbsUp, 
  ThumbsDown, 
  Compass, 
  RefreshCw, 
  CheckCircle2, 
  BookOpen, 
  Save, 
  History, 
  X, 
  Shuffle,
  ChevronRight,
  AlertCircle
} from "lucide-react";
import DecisionForm from "./components/DecisionForm";
import TieBalanceScale from "./components/TieBalanceScale";
import { 
  AnalysisType, 
  SavedDecision, 
  ProsConsAnalysis, 
  SwotAnalysis, 
  ComparisonAnalysis,
  DecisionItem,
  SwotItem
} from "./types";

// Deep fallbacks to guarantee instant visualization out of the box (zero-delay trial)
const INITIAL_PROS_CONS: ProsConsAnalysis = {
  title: " relocated to San Francisco (Silicon Valley relocate)",
  overview: "Evaluating a relocation offer with a 25% salary bump against doubled rental costs and career compromises for my partner.",
  pros: [
    { id: "p-1", point: "Salary & Financial Upside", description: "25% immediate base bump plus pre-IPO equity grants.", weight: 4 },
    { id: "p-2", point: "Tech Network & Careers", description: "Unparalleled proximity to AI startups, founders, and venture partners.", weight: 5 },
    { id: "p-3", point: "Partner Career Path", description: "Silicon Valley has a dense job market for partner's tech-sales career.", weight: 3 },
    { id: "p-4", point: "Outdoor & Climate Lifestyle", description: "Year-round mild weather and access to elite hiking and surfing spots.", weight: 3 },
  ],
  cons: [
    { id: "c-1", point: "Drastic Cost of Living", description: "Strictly calculated rental costs will more than double for smaller space.", weight: 5 },
    { id: "c-2", point: "Commute & Stress levels", description: "Daily reliance on high-stress Bay Area freeways or public transit.", weight: 3 },
    { id: "c-3", point: "Distance from Family", description: "Changes direct flights from 1 hour to a full day of exhausting travel.", weight: 4 },
  ],
  recommendation: "Take the leap. The career gravity and physical network density in SF outweigh the transient high costs of living, provided you view rent strictly as a marketing cost for your personal brand.",
  confidence: 76
};

const INITIAL_SWOT: SwotAnalysis = {
  title: "Launching DIY Smart-Home Substack Newsletter",
  overview: "Assessing the strategic viability of launching a paid educational hub for residential automation systems.",
  strengths: [
    { id: "s-1", item: "Deep Domain Authority", detail: "10 years of personal experience in Zigbee, Home Assistant, and low-voltage microcontrollers.", weight: 5 },
    { id: "s-2", item: "Proprietary Blueprints", detail: "Ready-to-publish hardware diagrams and custom YAML scripts that do not exist elsewhere.", weight: 4 }
  ],
  weaknesses: [
    { id: "w-1", item: "Severe Time Constraints", detail: "Already committed 45 hours weekly to my lead engineering corporate job.", weight: 5 },
    { id: "w-2", item: "Zero Initial Audience Size", detail: "Starting with a mailing pool of less than 150 legacy industry contacts.", weight: 4 }
  ],
  opportunities: [
    { id: "o-1", item: "Underserved Niche Growth", detail: "Consumer desperation is rising for secure, local-only offline alternative homes.", weight: 5 },
    { id: "o-2", item: "Sponsorship Pipeline", detail: "Affiliate commissions from hardware manufacturers can offset early user acquisition costs.", weight: 3 }
  ],
  threats: [
    { id: "t-1", item: "High Platform Fatigue", detail: "Users are heavily cutting down active subscriptions during general economic tightness.", weight: 4 },
    { id: "t-2", item: "AI Code Generator Clones", detail: "Novice creators can quickly synthesize basic Home Assistant configurations with LLMs.", weight: 3 }
  ],
  recommendation: "Launch immediately as an 'Alpha' free product. Build up trust and validate subscriber interest for 90 days before pushing the paid tier. This addresses the lack of audience and high subscription fatigue simultaneously."
};

const INITIAL_COMPARISON: ComparisonAnalysis = {
  title: "Company Annual Retreat Location Selection",
  overview: "Comparing three potential destinations against varying corporate guidelines, team sizes, and travel budgets.",
  criteria: ["Cost Efficiency", "Team Inclusivity/Vibe", "Logistical Simplicity", "Outdoor Recreation"],
  criteriaWeights: [4, 5, 3, 4],
  options: [
    {
      id: "opt-1",
      name: "Kyoto, Japan",
      scores: [2, 5, 2, 4],
      details: ["High flight overhead; expensive packages.", "Cultural masterpiece; outstanding culinary appeal.", "14-hour flights could introduce severe jetlag issues.", "Serene shrine walks and nearby mountain treks."]
    },
    {
      id: "opt-2",
      name: "Amalfi Coast, Italy",
      scores: [1, 4, 3, 5],
      details: ["Extremely high summer rates and premium transport transfers.", "Breathtaking scenic backdrop; supreme group morale.", "Involves connecting flights and regional shuttle coaches.", "Mediterranean swimming, coastal paths, boat tours."]
    },
    {
      id: "opt-3",
      name: "Banff, Canada",
      scores: [5, 4, 5, 5],
      details: ["Highly affordable group lodge packages and flight rates.", "Cozy lodge aesthetic; strong team bonding dynamics.", "Straightforward 1-hour bus shuttle from Calgary hub.", "World-class alpine hiking, hot springs, and clean air."]
    }
  ],
  recommendation: "Banff represents the optimal tactical compromise. It scores absolute maximums in logistics and cost-efficiency while providing pristine outdoor adventure and team closeness."
};

export default function App() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "saved">("dashboard");
  const [topic, setTopic] = useState("");
  const [context, setContext] = useState("");
  const [type, setType] = useState<AnalysisType>("pros_cons");
  
  // Custom interactive editing states
  const [prosCons, setProsCons] = useState<ProsConsAnalysis>(INITIAL_PROS_CONS);
  const [swot, setSwot] = useState<SwotAnalysis>(INITIAL_SWOT);
  const [comparison, setComparison] = useState<ComparisonAnalysis>(INITIAL_COMPARISON);

  // General App states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isOfflineFallback, setIsOfflineFallback] = useState(false);
  const [savedDecisions, setSavedDecisions] = useState<SavedDecision[]>([]);
  
  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Adding Custom factor forms
  const [newProText, setNewProText] = useState("");
  const [newProWeight, setNewProWeight] = useState(3);
  const [newConText, setNewConText] = useState("");
  const [newConWeight, setNewConWeight] = useState(3);

  // SWOT Custom Adders
  const [newSwotText, setNewSwotText] = useState("");
  const [newSwotDetail, setNewSwotDetail] = useState("");
  const [newSwotCategory, setNewSwotCategory] = useState<"strengths" | "weaknesses" | "opportunities" | "threats">("strengths");

  // Comparison Custom options adders
  const [newOptionName, setNewOptionName] = useState("");

  // Load Saved Decisions from Local Storage on startup
  useEffect(() => {
    try {
      const blob = localStorage.getItem("the_tiebreaker_saved_v2");
      if (blob) {
        setSavedDecisions(JSON.parse(blob));
      }
    } catch (e) {
      console.warn("Could not read local saved decisions", e);
    }
  }, []);

  const triggerToast = (text: string) => {
    setToastMessage(text);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const saveToLocalStorage = (list: SavedDecision[]) => {
    try {
      localStorage.setItem("the_tiebreaker_saved_v2", JSON.stringify(list));
      setSavedDecisions(list);
    } catch (e) {
      console.error(e);
    }
  };

  // Submit decision request to our sophisticated backend /api/analyze
  const handleAnalyze = async (payload: {
    topic: string;
    type: AnalysisType;
    context: string;
    options?: string[];
  }) => {
    setIsLoading(true);
    setErrorMsg(null);
    setIsOfflineFallback(false);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errData: any = {};
        try {
          errData = await response.json();
        } catch (_) {}
        throw new Error(errData.error || `HTTP issue: Server returned code ${response.status}`);
      }

      const parsed = await response.json();
      setIsOfflineFallback(!!parsed.isFallback);

      if (payload.type === "pros_cons") {
        // Enforce IDs on returned lists
        const formattedPros = (parsed.pros || []).map((p: any, idx: number) => ({
          id: `pro-ai-${Date.now()}-${idx}`,
          point: p.point || "Advantage Point",
          description: p.description || "",
          weight: Number(p.weight) || 3
        }));
        const formattedCons = (parsed.cons || []).map((c: any, idx: number) => ({
          id: `con-ai-${Date.now()}-${idx}`,
          point: c.point || "Disadvantage Point",
          description: c.description || "",
          weight: Number(c.weight) || 3
        }));

        const result: ProsConsAnalysis = {
          title: parsed.title || payload.topic,
          overview: parsed.overview || payload.context,
          pros: formattedPros,
          cons: formattedCons,
          recommendation: parsed.recommendation || "Proceed with caution.",
          confidence: Number(parsed.confidence) || 50
        };
        setProsCons(result);
        setType("pros_cons");
        triggerToast("Pros & Cons matrix populated successfully.");
      } else if (payload.type === "swot") {
        const formattedS = (parsed.strengths || []).map((s: any, idx: number) => ({
          id: `s-ai-${Date.now()}-${idx}`,
          item: s.item || s.point || "Strength",
          detail: s.detail || s.description || "",
          weight: 4
        }));
        const formattedW = (parsed.weaknesses || []).map((w: any, idx: number) => ({
          id: `w-ai-${Date.now()}-${idx}`,
          item: w.item || w.point || "Weakness",
          detail: w.detail || w.description || "",
          weight: 4
        }));
        const formattedO = (parsed.opportunities || []).map((o: any, idx: number) => ({
          id: `o-ai-${Date.now()}-${idx}`,
          item: o.item || o.point || "Opportunity",
          detail: o.detail || o.description || "",
          weight: 4
        }));
        const formattedT = (parsed.threats || []).map((t: any, idx: number) => ({
          id: `t-ai-${Date.now()}-${idx}`,
          item: t.item || t.point || "Threat",
          detail: t.detail || t.description || "",
          weight: 4
        }));

        const result: SwotAnalysis = {
          title: parsed.title || payload.topic,
          overview: parsed.overview || payload.context,
          strengths: formattedS,
          weaknesses: formattedW,
          opportunities: formattedO,
          threats: formattedT,
          recommendation: parsed.recommendation || "Strategy formulated."
        };
        setSwot(result);
        setType("swot");
        triggerToast("SWOT blueprint populated successfully.");
      } else if (payload.type === "comparison") {
        const formattedOptions = (parsed.options || []).map((opt: any, idx: number) => ({
          id: `opt-ai-${Date.now()}-${idx}`,
          name: opt.name || `Option ${idx + 1}`,
          scores: Array.isArray(opt.scores) ? opt.scores.map(Number) : [],
          details: Array.isArray(opt.details) ? opt.details : []
        }));

        const result: ComparisonAnalysis = {
          title: parsed.title || payload.topic,
          overview: parsed.overview || payload.context,
          criteria: Array.isArray(parsed.criteria) ? parsed.criteria : ["Criterion A", "Criterion B"],
          criteriaWeights: Array.isArray(parsed.criteria) ? parsed.criteria.map(() => 4) : [4, 4],
          options: formattedOptions,
          recommendation: parsed.recommendation || "Comparison parsed."
        };
        setComparison(result);
        setType("comparison");
        triggerToast("Comparison blueprint populated successfully.");
      }

      setTopic(payload.topic);
      setContext(payload.context);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to make decision analysis.");
    } finally {
      setIsLoading(false);
    }
  };

  // Keep a clean calculation for ProsCons Dynamic Balance
  const totalProsWeight = prosCons.pros.reduce((sum, item) => sum + item.weight, 0);
  const totalConsWeight = prosCons.cons.reduce((sum, item) => sum + item.weight, 0);

  // Interactively update individual Pro weight
  const handleUpdateProWeight = (id: string, newWeight: number) => {
    setProsCons(prev => ({
      ...prev,
      pros: prev.pros.map(p => p.id === id ? { ...p, weight: newWeight } : p)
    }));
  };

  // Interactively update individual Con weight
  const handleUpdateConWeight = (id: string, newWeight: number) => {
    setProsCons(prev => ({
      ...prev,
      cons: prev.cons.map(c => c.id === id ? { ...c, weight: newWeight } : c)
    }));
  };

  // Remove a Pro
  const handleRemovePro = (id: string) => {
    setProsCons(prev => ({
      ...prev,
      pros: prev.pros.filter(p => p.id !== id)
    }));
    triggerToast("Pro factor deleted.");
  };

  // Remove a Con
  const handleRemoveCon = (id: string) => {
    setProsCons(prev => ({
      ...prev,
      cons: prev.cons.filter(c => c.id !== id)
    }));
    triggerToast("Con factor deleted.");
  };

  // Add individual custom Pro on the fly
  const handleAddCustomPro = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProText.trim()) return;
    const newItem: DecisionItem = {
      id: `custom-pro-${Date.now()}`,
      point: newProText.trim(),
      description: "Custom user-inserted factor",
      weight: newProWeight
    };
    setProsCons(prev => ({
      ...prev,
      pros: [...prev.pros, newItem]
    }));
    setNewProText("");
    setNewProWeight(3);
    triggerToast("Custom Pro added to live balance.");
  };

  // Add individual custom Con on the fly
  const handleAddCustomCon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newConText.trim()) return;
    const newItem: DecisionItem = {
      id: `custom-con-${Date.now()}`,
      point: newConText.trim(),
      description: "Custom user-inserted factor",
      weight: newConWeight
    };
    setProsCons(prev => ({
      ...prev,
      cons: [...prev.cons, newItem]
    }));
    setNewConText("");
    setNewConWeight(3);
    triggerToast("Custom Con added to live balance.");
  };

  // Delete SWOT Item
  const handleDeleteSwotItem = (id: string, category: "strengths" | "weaknesses" | "opportunities" | "threats") => {
    setSwot(prev => ({
      ...prev,
      [category]: (prev[category] as SwotItem[]).filter(item => item.id !== id)
    }));
    triggerToast("Strategic SWOT point deleted.");
  };

  // User input custom point directly onto strategic SWOT Matrix
  const handleAddCustomSwot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSwotText.trim()) return;
    const newItem: SwotItem = {
      id: `custom-swot-${Date.now()}`,
      item: newSwotText.trim(),
      detail: newSwotDetail.trim() || "User introduced factor details",
      weight: 4
    };
    setSwot(prev => ({
      ...prev,
      [newSwotCategory]: [...prev[newSwotCategory], newItem]
    }));
    setNewSwotText("");
    setNewSwotDetail("");
    triggerToast(`Added to SWOT ${newSwotCategory} quadrant.`);
  };

  // Handle active editing of Option comparison values
  const handleUpdateOptionScore = (optionId: string, criterionIndex: number, val: number) => {
    setComparison(prev => ({
      ...prev,
      options: prev.options.map(opt => {
        if (opt.id === optionId) {
          const nextScores = [...opt.scores];
          nextScores[criterionIndex] = val;
          return { ...opt, scores: nextScores };
        }
        return opt;
      })
    }));
  };

  // Handle criteria weight interactive updates
  const handleUpdateCriteriaWeight = (criterionIndex: number, val: number) => {
    setComparison(prev => {
      const nextWeights = prev.criteriaWeights ? [...prev.criteriaWeights] : prev.criteria.map(() => 4);
      nextWeights[criterionIndex] = val;
      return { ...prev, criteriaWeights: nextWeights };
    });
  };

  // Dynamic calculations for the multi-criteria decision comparison grid
  const calculateOptionStats = (opt: typeof comparison.options[0]) => {
    const weights = comparison.criteriaWeights || comparison.criteria.map(() => 4);
    let totalScoreTimesWeight = 0;
    let totalWeightValue = 0;

    for (let i = 0; i < comparison.criteria.length; i++) {
      const score = opt.scores[i] !== undefined ? opt.scores[i] : 3;
      const weight = weights[i] !== undefined ? weights[i] : 4;
      totalScoreTimesWeight += score * weight;
      totalWeightValue += weight;
    }

    const calculatedAvg = totalWeightValue > 0 ? (totalScoreTimesWeight / totalWeightValue).toFixed(2) : "0.00";
    return {
      title: opt.name,
      overallRating: Number(calculatedAvg),
      percentage: Math.round((Number(calculatedAvg) / 5) * 100)
    };
  };

  // Identify who the calculated victor is in real-time
  const getVictoriousOption = () => {
    if (comparison.options.length === 0) return null;
    let bestOpt = comparison.options[0];
    let bestRating = Number(calculateOptionStats(bestOpt).overallRating);

    for (let i = 1; i < comparison.options.length; i++) {
      const rating = Number(calculateOptionStats(comparison.options[i]).overallRating);
      if (rating > bestRating) {
        bestRating = rating;
        bestOpt = comparison.options[i];
      }
    }
    return { name: bestOpt.name, rating: bestRating };
  };

  const handleAddCustomOption = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOptionName.trim()) return;

    const scores = comparison.criteria.map(() => 3); // Start with neutral score of 3
    const details = comparison.criteria.map(() => "User entered rating");
    const newItem = {
      id: `custom-opt-${Date.now()}`,
      name: newOptionName.trim(),
      scores,
      details
    };

    setComparison(prev => ({
      ...prev,
      options: [...prev.options, newItem]
    }));
    setNewOptionName("");
    triggerToast(`Added custom option '${newItem.name}' to evaluation grid.`);
  };

  const handleRemoveOptionFromComparison = (id: string) => {
    if (comparison.options.length <= 2) {
      alert("Please retain at least 2 comparison options to compute the Tiebreaker victor.");
      return;
    }
    setComparison(prev => ({
      ...prev,
      options: prev.options.filter(o => o.id !== id)
    }));
    triggerToast("Option removed.");
  };

  // Persist Current Decision Sandbox to locally saved session archive
  const handleSaveDecisionToArchive = () => {
    const activeResult = type === "pros_cons" ? prosCons : type === "swot" ? swot : comparison;
    const activeTopic = type === "pros_cons" ? prosCons.title : type === "swot" ? swot.title : comparison.title;
    
    const newRecord: SavedDecision = {
      id: `saved-${Date.now()}`,
      timestamp: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }),
      topic: activeTopic || topic || "Untitled Dilemma",
      context: context,
      type,
      result: JSON.parse(JSON.stringify(activeResult)) // deep copy state
    };

    const nextList = [newRecord, ...savedDecisions];
    saveToLocalStorage(nextList);
    triggerToast("Dilemma framework persisted to Archive.");
  };

  const handleLoadFromArchive = (record: SavedDecision) => {
    setType(record.type);
    setTopic(record.topic);
    setContext(record.context || "");
    
    if (record.type === "pros_cons") {
      setProsCons(record.result as ProsConsAnalysis);
    } else if (record.type === "swot") {
      setSwot(record.result as SwotAnalysis);
    } else if (record.type === "comparison") {
      setComparison(record.result as ComparisonAnalysis);
    }

    setActiveTab("dashboard");
    triggerToast(`Loaded: ${record.topic.substring(0, 30)}...`);
  };

  const handleDeleteFromArchive = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = savedDecisions.filter(d => d.id !== id);
    saveToLocalStorage(filtered);
    triggerToast("Dilemma deleted from Archive.");
  };

  return (
    <div id="tiebreaker-root" className="min-h-screen bg-[#0A0A0B] text-[#D1D1D1] flex flex-col font-sans select-none antialiased selection:bg-[#C5A059] selection:text-black">
      
      {/* Toast Notification Top Center */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-[#C5A059] text-black text-xs font-mono uppercase tracking-widest px-6 py-3 rounded-md shadow-2xl border border-black/25 z-50 flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Navigation */}
      <header className="flex items-center justify-between px-8 py-6 border-b border-[#222222] bg-[#0A0A0B]">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 border-2 border-[#C5A059] flex items-center justify-center rotate-45">
            <span className="-rotate-45 font-serif text-[#C5A059] font-bold text-base">T</span>
          </div>
          <h1 className="text-lg font-serif tracking-[0.25em] text-white uppercase select-none">
            The Tiebreaker
          </h1>
        </div>

        <nav className="flex items-center space-x-8 text-[10px] uppercase tracking-widest text-[#888888]">
          <button 
            type="button" 
            onClick={() => setActiveTab("dashboard")} 
            className={`cursor-pointer hover:text-white transition-colors pb-1 ${activeTab === "dashboard" ? "text-[#C5A059] border-b border-[#C5A059]" : ""}`}
          >
            Advisor Dashboard
          </button>
          
          <button 
            type="button" 
            onClick={() => setActiveTab("saved")} 
            className={`cursor-pointer hover:text-white transition-colors pb-1 flex items-center gap-1.5 ${activeTab === "saved" ? "text-[#C5A059] border-b border-[#C5A059]" : ""}`}
          >
            <History className="w-3 h-3 text-[#C5A059]" />
            Archive ({savedDecisions.length})
          </button>
        </nav>
      </header>

      {/* System Warning banner if GEMINI_API_KEY could be needed */}
      {errorMsg && (
        <div className="mx-8 mt-6 p-4 bg-red-950/20 border border-red-900/50 rounded-xl flex items-start gap-3 text-xs text-red-200">
          <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
          <div>
            <p className="font-bold uppercase tracking-wider text-red-500">API connection issue detected</p>
            <p className="mt-1 leading-relaxed opacity-85">{errorMsg}</p>
            <p className="mt-2 text-[#888888] font-mono text-[10px]">
              Tip: You can absolutely continue using, typing, and modifying the active sandbox completely offline by editing the sliders, weights, and items manually!
            </p>
          </div>
          <button type="button" onClick={() => setErrorMsg(null)} className="ml-auto text-[#666666] hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Active AI High-Demand Fallback Framework indication */}
      {isOfflineFallback && (
        <div className="mx-8 mt-6 p-4 bg-[#C5A059]/10 border border-[#C5A059]/30 rounded-xl flex items-start gap-3 text-xs text-amber-200/90 antialiased">
          <Sparkles className="w-4 h-4 text-[#C5A059] mt-0.5 shrink-0 animate-pulse" />
          <div>
            <p className="font-bold uppercase tracking-wider text-[#C5A059]">Uptime Fallback Matrix Active</p>
            <p className="mt-1 leading-relaxed opacity-85">
              The Gemini API is currently experiencing peak global volumes or temporary latency spikes. We've instantly generated a high-fidelity diagnostic roadmap model baseline below. 
              You have full creative agency—manipulate weights, drag sliders, or customize items interactively below!
            </p>
          </div>
          <button type="button" onClick={() => setIsOfflineFallback(false)} className="ml-auto text-[#C5A059] hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Primary Workspace */}
      {activeTab === "dashboard" && (
        <>
          {/* Active Dilemma Banner */}
          <section className="px-8 py-8 border-b border-[#1A1A1A] bg-[#0E0E0F]">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="max-w-3xl">
                <p className="text-[9px] uppercase tracking-[0.3em] text-[#C5A059] mb-2.5 font-mono select-none">
                  Currently Evaluation Sandbox
                </p>
                <h2 className="text-2xl md:text-3xl font-serif italic text-white leading-tight">
                  {type === "pros_cons" ? prosCons.title : type === "swot" ? swot.title : comparison.title}
                </h2>
                <p className="mt-2 text-xs leading-relaxed text-[#AAAAAA] italic">
                  &ldquo;{type === "pros_cons" ? prosCons.overview : type === "swot" ? swot.overview : comparison.overview}&rdquo;
                </p>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleSaveDecisionToArchive}
                  className="px-5 py-2.5 bg-[#0F0F11] border border-[#222222] hover:border-[#C5A059] text-[10px] uppercase tracking-widest text-slate-100 hover:text-[#C5A059] font-semibold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Framework
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (type === "pros_cons") setProsCons(INITIAL_PROS_CONS);
                    else if (type === "swot") setSwot(INITIAL_SWOT);
                    else setComparison(INITIAL_COMPARISON);
                    triggerToast("Sandbox reset to catalog template baseline.");
                  }}
                  className="px-5 py-2.5 border border-[#222222] text-[10px] uppercase tracking-widest hover:bg-white hover:text-black hover:border-white transition-all cursor-pointer"
                >
                  Reset Sandbox
                </button>
              </div>
            </div>
          </section>

          {/* Grid Layout of the Application */}
          <main className="flex-1 max-w-7xl w-full mx-auto p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Side: Dynamic Formulation Panel */}
            <div className="lg:col-span-4 space-y-6">
              <DecisionForm onAnalyze={handleAnalyze} isLoading={isLoading} />
              
              {/* Local Storage Archive Sidebar Quickview */}
              <div className="bg-[#0F0F11] border border-[#222222] rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-3">
                  <h4 className="text-[10px] font-mono tracking-widest uppercase text-[#888888] flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5 text-[#C5A059]" />
                    Archive Quick-load
                  </h4>
                  <span className="text-[9px] font-mono bg-[#1A1A1A] text-[#888888] px-2 py-0.5 rounded-full">
                    {savedDecisions.length} saved
                  </span>
                </div>

                {savedDecisions.length === 0 ? (
                  <div className="text-center py-6">
                    <Archive className="w-5 h-5 text-[#333333] mx-auto mb-2" />
                    <p className="text-[10px] text-[#555555] uppercase tracking-wider">No active saved archives</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {savedDecisions.map((record) => (
                      <div
                        key={record.id}
                        id={`archive-${record.id}`}
                        onClick={() => handleLoadFromArchive(record)}
                        className="group flex items-start justify-between p-2.5 bg-[#0A0A0B] hover:bg-[#121213] border border-[#1A1A1A] hover:border-[#C5A059] rounded-lg transition-all cursor-pointer"
                      >
                        <div className="flex-1 min-w-0 pr-3">
                          <p className="text-[10px] font-serif italic text-[#D1D1D1] truncate group-hover:text-white">
                            {record.topic}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1 text-[8px] uppercase tracking-wider text-[#555555]">
                            <span className="text-[#C5A059] font-mono">{record.timestamp}</span>
                            <span>•</span>
                            <span>{record.type.replace("_", " ")}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          id={`del-archive-button-${record.id}`}
                          onClick={(e) => handleDeleteFromArchive(record.id, e)}
                          className="text-[#444444] hover:text-red-800 p-1 rounded-sm hover:bg-[#1A1A1A]"
                          title="Delete from local archives"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Side: The Sandbox Workstation (Dynamic View based on type) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* VIEW 1: PROS & CONS EVALUATION ENGINE */}
              {type === "pros_cons" && (
                <div id="workspace-pros-cons" className="space-y-6">
                  
                  {/* Balance scale widget */}
                  <div id="interactive-balance-area">
                    <TieBalanceScale
                      leftName="Pros"
                      leftWeight={totalProsWeight}
                      rightName="Cons"
                      rightWeight={totalConsWeight}
                      colorLeft="#C5A059" // elegant gold
                      colorRight="#991b1b" // deep crimson
                    />
                  </div>

                  {/* Splits: Pros vs Cons lists */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* PROS LIST CARD */}
                    <div className="bg-[#0F0F11] border border-[#222222] rounded-2xl p-6 flex flex-col justify-between">
                      <div>
                        <h3 className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] mb-4 flex items-center">
                          <ThumbsUp className="w-3.5 h-3.5 mr-2" />
                          The Pros ({prosCons.pros.length})
                        </h3>
                        <div className="space-y-4">
                          {prosCons.pros.map((pro, index) => (
                            <div key={pro.id} id={`pro-card-${pro.id}`} className="p-3 bg-[#0A0A0B] border border-[#1A1A1A] rounded-xl hover:border-[#333333] transition-all">
                              <div className="flex items-start justify-between gap-1.5">
                                <span className="text-[#C5A059] font-serif italic text-xs shrink-0 pt-0.5 select-none">
                                  0{index + 1}.
                                </span>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-xs font-serif text-[#D1D1D1]">{pro.point}</h4>
                                  <p className="text-[10px] text-[#666666] leading-relaxed mt-0.5">{pro.description}</p>
                                </div>
                                <button
                                  type="button"
                                  id={`remove-pro-${pro.id}`}
                                  onClick={() => handleRemovePro(pro.id)}
                                  className="text-[#444444] hover:text-[#C5A059] transition-colors cursor-pointer"
                                  title="Delete pro item"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>

                              {/* Interactive weight slider */}
                              <div className="mt-3 pt-2.5 border-t border-[#151516] flex items-center justify-between gap-3 select-none">
                                <span className="text-[8px] font-mono text-[#555555] uppercase tracking-wider">Advantage Gravity:</span>
                                <div className="flex items-center gap-2 flex-grow max-w-[120px]">
                                  <input
                                    type="range"
                                    min="1"
                                    max="5"
                                    value={pro.weight}
                                    onChange={(e) => handleUpdateProWeight(pro.id, Number(e.target.value))}
                                    className="w-full accent-[#C5A059] cursor-pointer h-1 rounded-sm bg-[#1A1A1A] select-none"
                                  />
                                  <span className="text-[10px] font-mono font-bold text-[#C5A059] min-w-[8px]">{pro.weight}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Add Custom Pro Form */}
                      <form onSubmit={handleAddCustomPro} className="mt-6 pt-5 border-t border-[#1A1A1A] space-y-3">
                        <span className="text-[8.5px] font-mono tracking-[0.2em] text-[#666666] uppercase">Inject advantage factor</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            required
                            value={newProText}
                            onChange={(e) => setNewProText(e.target.value)}
                            placeholder="Type a custom Pro..."
                            className="flex-grow text-[11px] px-3 py-1.5 bg-[#0A0A0B] border border-[#202022] text-white rounded-md placeholder:text-[#555555] focus:outline-none focus:border-[#C5A059]"
                          />
                          <div className="flex items-center gap-1.5 shrink-0 bg-[#0A0A0B] border border-[#202022] px-2 py-1 rounded-md">
                            <span className="text-[9px] font-mono text-[#555555]">WT</span>
                            <select
                              value={newProWeight}
                              onChange={(e) => setNewProWeight(Number(e.target.value))}
                              className="bg-transparent text-[10px] font-mono text-[#C5A059] focus:outline-none cursor-pointer"
                            >
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4">4</option>
                              <option value="5">5</option>
                            </select>
                          </div>
                          <button
                            type="submit"
                            id="add-pro-sub-btn"
                            className="bg-[#C5A059] hover:bg-[#d6b26b] text-black font-bold p-1.5 rounded-md transition-colors cursor-pointer"
                            title="Add Pro factor"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* CONS LIST CARD */}
                    <div className="bg-[#0F0F11] border border-[#222222] rounded-2xl p-6 flex flex-col justify-between">
                      <div>
                        <h3 className="text-[10px] uppercase tracking-[0.25em] text-[#991b1b] mb-4 flex items-center">
                          <ThumbsDown className="w-3.5 h-3.5 mr-2 text-red-800" />
                          The Cons ({prosCons.cons.length})
                        </h3>
                        <div className="space-y-4">
                          {prosCons.cons.map((con, index) => (
                            <div key={con.id} id={`con-card-${con.id}`} className="p-3 bg-[#0A0A0B] border border-[#1A1A1A] rounded-xl hover:border-[#333333] transition-all">
                              <div className="flex items-start justify-between gap-1.5">
                                <span className="text-red-800 font-bold text-xs shrink-0 pt-0.5 select-none">
                                  —
                                </span>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-xs font-serif text-[#D1D1D1]">{con.point}</h4>
                                  <p className="text-[10px] text-[#666666] leading-relaxed mt-0.5">{con.description}</p>
                                </div>
                                <button
                                  type="button"
                                  id={`remove-con-${con.id}`}
                                  onClick={() => handleRemoveCon(con.id)}
                                  className="text-[#444444] hover:text-red-800 transition-colors cursor-pointer"
                                  title="Delete con item"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>

                              {/* Interactive weight slider */}
                              <div className="mt-3 pt-2.5 border-t border-[#151516] flex items-center justify-between gap-3 select-none">
                                <span className="text-[8px] font-mono text-[#555555] uppercase tracking-wider">Disadvantage Gravity:</span>
                                <div className="flex items-center gap-2 flex-grow max-w-[120px]">
                                  <input
                                    type="range"
                                    min="1"
                                    max="5"
                                    value={con.weight}
                                    onChange={(e) => handleUpdateConWeight(con.id, Number(e.target.value))}
                                    className="w-full accent-red-800 cursor-pointer h-1 rounded-sm bg-[#1A1A1A] select-none"
                                  />
                                  <span className="text-[10px] font-mono font-bold text-red-500 min-w-[8px]">{con.weight}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Add Custom Con Form */}
                      <form onSubmit={handleAddCustomCon} className="mt-6 pt-5 border-t border-[#1A1A1A] space-y-3">
                        <span className="text-[8.5px] font-mono tracking-[0.2em] text-[#666666] uppercase">Inject resistance factor</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            required
                            value={newConText}
                            onChange={(e) => setNewConText(e.target.value)}
                            placeholder="Type a custom Con..."
                            className="flex-grow text-[11px] px-3 py-1.5 bg-[#0A0A0B] border border-[#202022] text-white rounded-md placeholder:text-[#555555] focus:outline-none focus:border-red-800"
                          />
                          <div className="flex items-center gap-1.5 shrink-0 bg-[#0A0A0B] border border-[#202022] px-2 py-1 rounded-md">
                            <span className="text-[9px] font-mono text-[#555555]">WT</span>
                            <select
                              value={newConWeight}
                              onChange={(e) => setNewConWeight(Number(e.target.value))}
                              className="bg-transparent text-[10px] font-mono text-red-500 focus:outline-none cursor-pointer"
                            >
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4">4</option>
                              <option value="5">5</option>
                            </select>
                          </div>
                          <button
                            type="submit"
                            id="add-con-sub-btn"
                            className="bg-red-800 hover:bg-red-700 text-white font-bold p-1.5 rounded-md transition-colors cursor-pointer"
                            title="Add Con factor"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>

                  {/* Summary / Core recommendation bar */}
                  <div className="bg-[#0F0F11] border border-[#222222] p-6 rounded-2xl relative overflow-hidden">
                    <div className="absolute right-0 top-0 h-full w-1.5 bg-[#C5A059]" />
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 select-none">
                      <div className="flex-1">
                        <p className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-mono mb-2">
                          Tiebreaker Verdict Recommendation
                        </p>
                        <p className="text-[#D1D1D1] font-serif italic text-base leading-relaxed">
                          &ldquo;{prosCons.recommendation}&rdquo;
                        </p>
                      </div>

                      {/* Confidences Gauge */}
                      <div className="bg-[#050505] p-4 border border-[#1A1A1A] rounded-xl shrink-0 text-center min-w-[130px]">
                        <span className="text-[8px] font-mono tracking-widest text-[#666666] uppercase">Confidence</span>
                        <div className="text-3xl font-bold text-white tracking-widest font-serif mt-1">
                          {prosCons.confidence}%
                        </div>
                        <div className="w-full bg-[#151516] h-[3px] rounded-full mt-2.5 overflow-hidden">
                          <div 
                            className="bg-[#C5A059] h-full transition-all duration-1000" 
                            style={{ width: `${prosCons.confidence}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* VIEW 2: MULTI-OPTION COMPARISON GRID ENGINE */}
              {type === "comparison" && (
                <div id="workspace-comparison" className="space-y-6">
                  
                  {/* Real-time Dynamic Victor Plaque */}
                  {getVictoriousOption() && (
                    <div className="bg-[#C5A059]/10 border border-[#C5A059]/30 rounded-2xl p-6 relative overflow-hidden shadow-xl flex items-center gap-5">
                      <div className="w-12 h-12 bg-[#C5A059] text-black rounded-lg flex items-center justify-center font-serif text-2xl font-bold tracking-tight select-none rotate-3">
                        V
                      </div>
                      <div className="space-y-1 select-none">
                        <span className="text-[8.5px] font-mono tracking-[0.3em] text-[#C5A059] uppercase block font-semibold">
                          Calculated Victor Target
                        </span>
                        <h4 className="text-xl font-serif italic text-white">
                          {getVictoriousOption()?.name}
                        </h4>
                        <p className="text-[10px] text-[#888888]">
                          Achieved an aggregate strength vector of <span className="text-[#C5A059] font-bold font-mono">{getVictoriousOption()?.rating}</span> based on your current customized parameters.
                        </p>
                      </div>
                      <div className="ml-auto hidden md:block">
                        <span className="text-[9px] border border-[#C5A059] text-[#C5A059] px-3 py-1 font-mono uppercase tracking-[0.15em] rounded-full">
                          Maximum Alignment
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Grid of options to evaluate */}
                  <div className="bg-[#0F0F11] border border-[#222222] rounded-2xl p-6 space-y-6">
                    <div>
                      <h3 className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] mb-1">
                        Evaluation parameters
                      </h3>
                      <p className="text-xs text-[#666666] leading-relaxed">
                        Customize how important each criterion is to your final choice. Each option is scored from 1 (poor) to 5 (elite).
                      </p>
                    </div>

                    {/* Criteria Weights interactive panel */}
                    <div className="bg-[#050505] border border-[#1A1A1A] p-4 rounded-xl space-y-4">
                      <span className="text-[9px] font-mono tracking-widest text-[#888888] uppercase block">
                        Adjust Criteria Gravity Weights
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {comparison.criteria.map((cName, cIdx) => {
                          const weight = (comparison.criteriaWeights || [])[cIdx] || 4;
                          return (
                            <div key={cIdx} className="bg-[#0C0C0D] p-3 border border-[#1A1A1A] rounded-lg">
                              <span className="text-[10px] text-white block mt-0.5 truncate">{cName}</span>
                              <div className="flex items-center justify-between gap-1.5 mt-2">
                                <input
                                  type="range"
                                  min="1"
                                  max="5"
                                  value={weight}
                                  onChange={(e) => handleUpdateCriteriaWeight(cIdx, Number(e.target.value))}
                                  className="w-full accent-[#C5A059] h-1.5 bg-[#1F1F20] rounded-lg cursor-pointer"
                                />
                                <span className="text-[10px] font-mono text-[#C5A059] font-bold">{weight}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Options list cards */}
                    <div className="space-y-4">
                      {comparison.options.map((opt) => {
                        const stats = calculateOptionStats(opt);
                        const isWinner = getVictoriousOption()?.name === opt.name;

                        return (
                          <div
                            key={opt.id}
                            id={`opt-calc-card-${opt.id}`}
                            className={`p-5 rounded-xl border transition-all ${
                              isWinner
                                ? "bg-[#121213] border-[#C5A059]/40"
                                : "bg-[#0A0A0B] border-[#1A1A1A] hover:border-[#222222]"
                            }`}
                          >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1A1A1A]">
                              <div className="flex items-center gap-3">
                                <h4 className="text-[15px] font-serif text-white tracking-wide">{opt.name}</h4>
                                {isWinner && (
                                  <span className="bg-[#C5A059] text-black text-[8px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-sm font-semibold select-none">
                                    Determined Victor
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-5">
                                <div className="text-right">
                                  <span className="text-[8px] tracking-widest text-[#666666] uppercase block">Weighted Aggregate Score</span>
                                  <strong className="text-lg font-mono text-white mt-0.5 block">{stats.overallRating} <span className="text-xs text-[#555555]">/ 5</span></strong>
                                </div>
                                <button
                                  type="button"
                                  id={`remove-opt-${opt.id}`}
                                  onClick={() => handleRemoveOptionFromComparison(opt.id)}
                                  className="text-slate-600 hover:text-red-800 p-2 rounded-lg hover:bg-slate-900 transition-colors"
                                  title="Delete Option"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Scores detail lists */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                              {comparison.criteria.map((crt, cIdx) => {
                                const score = opt.scores[cIdx] !== undefined ? opt.scores[cIdx] : 3;
                                return (
                                  <div key={cIdx} className="bg-[#050505] border border-[#1A1A1A] p-2.5 rounded-lg">
                                    <span className="text-[9px] text-[#666666] uppercase block truncate">{crt}</span>
                                    <div className="flex items-center justify-between gap-2 mt-1">
                                      <select
                                        value={score}
                                        onChange={(e) => handleUpdateOptionScore(opt.id, cIdx, Number(e.target.value))}
                                        className="bg-transparent text-[#C5A059] text-[11px] font-mono focus:outline-none cursor-pointer font-bold"
                                      >
                                        <option value="1">1 (Poor)</option>
                                        <option value="2">2 (Weak)</option>
                                        <option value="3">3 (Fair)</option>
                                        <option value="4">4 (Great)</option>
                                        <option value="5">5 (Elite)</option>
                                      </select>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            {/* Individual Detail context */}
                            {opt.details && opt.details.length > 0 && (
                              <p className="mt-3 text-[10px] text-[#666666] italic leading-relaxed border-t border-[#121213] pt-2.5">
                                Context notes: {opt.details.join(" | ")}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Add Custom Option form */}
                    <form onSubmit={handleAddCustomOption} className="pt-4 border-t border-[#1A1A1A] flex flex-col md:flex-row md:items-center gap-3">
                      <div className="flex-grow">
                        <span className="text-[8.5px] font-mono tracking-[0.2em] text-[#666666] uppercase block mb-1">Incorporate secondary competitor alternative</span>
                        <input
                          type="text"
                          required
                          value={newOptionName}
                          onChange={(e) => setNewOptionName(e.target.value)}
                          placeholder="e.g. Banff, Canada"
                          className="w-full text-xs px-3 py-2 bg-[#0A0A0B] border border-[#202022] text-white rounded-md placeholder:text-[#555555] focus:outline-none focus:border-[#C5A059]"
                        />
                      </div>
                      <button
                        type="submit"
                        className="bg-white text-black hover:bg-[#C5A059] font-bold text-[10px] tracking-widest uppercase px-5 py-2 hover:text-black rounded-md mt-4 md:mt-0 transition-all shrink-0 cursor-pointer border border-[#333333]"
                      >
                        Add alternative
                      </button>
                    </form>
                  </div>

                  {/* Recommendations */}
                  <div className="bg-[#0F0F11] border border-[#222222] p-6 rounded-2xl relative overflow-hidden">
                    <div className="absolute left-0 top-0 h-full w-1 bg-[#C5A059]" />
                    <p className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-mono mb-2">
                      Strategic Choice recommendation
                    </p>
                    <p className="text-[#D1D1D1] font-serif italic text-base leading-relaxed">
                      &ldquo;{comparison.recommendation}&rdquo;
                    </p>
                  </div>
                </div>
              )}

              {/* VIEW 3: SWOT STRATEGIC ANALYTICS MATRIX */}
              {type === "swot" && (
                <div id="workspace-swot" className="space-y-6">
                
                  {/* Master 2x2 SWOT grid layout */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* STRENGTHS - Quadrant 1 */}
                    <div className="bg-[#0F0F11] border border-[#222222] p-6 rounded-2xl relative min-h-[220px] flex flex-col justify-between">
                      <span className="absolute top-3 right-4 text-[9px] font-mono uppercase tracking-[0.15em] text-[#C5A059] opacity-40">Internal Helpful</span>
                      
                      <div>
                        <h4 className="text-sm font-serif italic text-[#C5A059] flex items-center gap-1.5 mb-4">
                          <span className="w-2 h-[1px] bg-[#C5A059]" />
                          Strengths (S)
                        </h4>
                        
                        <ul className="space-y-3">
                          {swot.strengths.map((str) => (
                            <li key={str.id} className="text-xs group leading-relaxed text-[#AAAAAA] flex items-start gap-1 justify-between bg-[#0A0A0B] p-2.5 rounded-lg border border-[#1A1A1A]">
                              <div>
                                <strong className="text-white block font-serif tracking-wide">{str.item}</strong>
                                <span className="text-[10px] text-[#666666] leading-relaxed block mt-0.5">{str.detail}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleDeleteSwotItem(str.id, "strengths")}
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-[#444444] hover:text-red-800 p-0.5 shrink-0"
                                title="Delete parameter"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* WEAKNESSES - Quadrant 2 */}
                    <div className="bg-[#0F0F11] border border-[#222222] p-6 rounded-2xl relative min-h-[220px] flex flex-col justify-between">
                      <span className="absolute top-3 right-4 text-[9px] font-mono uppercase tracking-[0.15em] text-red-800 opacity-40">Internal Harmful</span>
                      
                      <div>
                        <h4 className="text-sm font-serif italic text-red-800 flex items-center gap-1.5 mb-4">
                          <span className="w-2 h-[1px] bg-red-800" />
                          Weaknesses (W)
                        </h4>
                        
                        <ul className="space-y-3">
                          {swot.weaknesses.map((wk) => (
                            <li key={wk.id} className="text-xs group leading-relaxed text-[#AAAAAA] flex items-start gap-1 justify-between bg-[#0A0A0B] p-2.5 rounded-lg border border-[#1A1A1A]">
                              <div>
                                <strong className="text-white block font-serif tracking-wide">{wk.item}</strong>
                                <span className="text-[10px] text-[#666666] leading-relaxed block mt-0.5">{wk.detail}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleDeleteSwotItem(wk.id, "weaknesses")}
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-[#444444] hover:text-red-800 p-0.5 shrink-0"
                                title="Delete parameter"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* OPPORTUNITIES - Quadrant 3 */}
                    <div className="bg-[#0F0F11] border border-[#222222] p-6 rounded-2xl relative min-h-[220px] flex flex-col justify-between">
                      <span className="absolute top-3 right-4 text-[9px] font-mono uppercase tracking-[0.15em] text-[#C5A059] opacity-40">External Helpful</span>
                      
                      <div>
                        <h4 className="text-sm font-serif italic text-[#C5A059] flex items-center gap-1.5 mb-4">
                          <span className="w-2 h-[1px] bg-[#C5A059]" />
                          Opportunities (O)
                        </h4>
                        
                        <ul className="space-y-3">
                          {swot.opportunities.map((opp) => (
                            <li key={opp.id} className="text-xs group leading-relaxed text-[#AAAAAA] flex items-start gap-1 justify-between bg-[#0A0A0B] p-2.5 rounded-lg border border-[#1A1A1A]">
                              <div>
                                <strong className="text-white block font-serif tracking-wide">{opp.item}</strong>
                                <span className="text-[10px] text-[#666666] leading-relaxed block mt-0.5">{opp.detail}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleDeleteSwotItem(opp.id, "opportunities")}
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-[#444444] hover:text-red-800 p-0.5 shrink-0"
                                title="Delete parameter"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* THREATS - Quadrant 4 */}
                    <div className="bg-[#0F0F11] border border-[#222222] p-6 rounded-2xl relative min-h-[220px] flex flex-col justify-between">
                      <span className="absolute top-3 right-4 text-[9px] font-mono uppercase tracking-[0.15em] text-red-800 opacity-40">External Harmful</span>
                      
                      <div>
                        <h4 className="text-sm font-serif italic text-red-800 flex items-center gap-1.5 mb-4">
                          <span className="w-2 h-[1px] bg-red-800" />
                          Threats (T)
                        </h4>
                        
                        <ul className="space-y-3">
                          {swot.threats.map((thr) => (
                            <li key={thr.id} className="text-xs group leading-relaxed text-[#AAAAAA] flex items-start gap-1 justify-between bg-[#0A0A0B] p-2.5 rounded-lg border border-[#1A1A1A]">
                              <div>
                                <strong className="text-white block font-serif tracking-wide">{thr.item}</strong>
                                <span className="text-[10px] text-[#666666] leading-relaxed block mt-0.5">{thr.detail}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleDeleteSwotItem(thr.id, "threats")}
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-[#444444] hover:text-red-800 p-0.5 shrink-0"
                                title="Delete parameter"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                  </div>

                  {/* Add Strategic Factor Form */}
                  <div className="bg-[#0F0F11] border border-[#222222] p-5 rounded-2xl">
                    <span className="text-[9px] font-mono tracking-widest text-[#888888] uppercase block mb-3">
                      Inject local Strategic Matrix factor
                    </span>
                    <form onSubmit={handleAddCustomSwot} className="grid grid-cols-1 md:grid-cols-12 gap-3">
                      <div className="md:col-span-3">
                        <select
                          value={newSwotCategory}
                          onChange={(e: any) => setNewSwotCategory(e.target.value)}
                          className="w-full text-xs px-3 py-2 bg-[#0A0A0B] border border-[#202022] text-[#C5A059] rounded-md focus:outline-none cursor-pointer"
                        >
                          <option value="strengths">Strength (Internal)</option>
                          <option value="weaknesses">Weakness (Internal)</option>
                          <option value="opportunities">Opportunity (External)</option>
                          <option value="threats">Threat (External)</option>
                        </select>
                      </div>
                      <div className="md:col-span-4">
                        <input
                          type="text"
                          required
                          value={newSwotText}
                          onChange={(e) => setNewSwotText(e.target.value)}
                          placeholder="e.g. Industry authority"
                          className="w-full text-xs px-3 py-2 bg-[#0A0A0B] border border-[#202022] text-white rounded-md placeholder:text-[#555555] focus:outline-none"
                        />
                      </div>
                      <div className="md:col-span-3">
                        <input
                          type="text"
                          value={newSwotDetail}
                          onChange={(e) => setNewSwotDetail(e.target.value)}
                          placeholder="Detail explanation (optional)..."
                          className="w-full text-xs px-3 py-2 bg-[#0A0A0B] border border-[#202022] text-white rounded-md placeholder:text-[#555555] focus:outline-none"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <button
                          type="submit"
                          className="w-full bg-[#C5A059] text-black font-bold text-[10px] tracking-widest uppercase py-2 hover:bg-[#d6b26b] transition-colors rounded-md cursor-pointer border border-[#333333]"
                        >
                          Add point
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Recommendation block */}
                  <div className="p-6 bg-[#C5A059]/5 border border-[#C5A059]/20 rounded-2xl relative overflow-hidden">
                    <div className="absolute left-0 top-0 h-full w-1.5 bg-[#C5A059]" />
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] mb-2 font-mono">
                      Strategic Synthesis recommendations
                    </p>
                    <p className="text-sm font-serif italic text-white leading-relaxed">
                      &ldquo;{swot.recommendation}&rdquo;
                    </p>
                  </div>
                </div>
              )}

            </div>
          </main>
        </>
      )}

      {/* VIEW: ARCHIVE HISTORY VIEW PANEL */}
      {activeTab === "saved" && (
        <main className="flex-1 max-w-4xl w-full mx-auto p-8 space-y-6">
          <div className="flex items-center space-x-3 mb-4">
            <Archive className="w-5 h-5 text-[#C5A059]" />
            <h2 className="text-2xl font-serif italic text-white">The Tiebreaker Archives</h2>
          </div>
          
          <p className="text-xs text-[#888888] leading-relaxed">
            Review and reload previously structural frameworks computed on this workspace. Saved locally for continuous access.
          </p>

          {savedDecisions.length === 0 ? (
            <div className="text-center py-16 bg-[#0F0F11] border border-[#222222] rounded-2xl">
              <History className="w-10 h-10 text-[#444444] mx-auto mb-4" />
              <p className="text-sm text-slate-400 font-serif mb-1">No dilemma frameworks found in your deep storage archives.</p>
              <p className="text-xs text-[#666666]">Go back to the Advisor Dashboard to run and save your decision analysis.</p>
              <button
                type="button"
                onClick={() => setActiveTab("dashboard")}
                className="mt-6 px-6 py-2.5 bg-[#C5A059] text-black text-xs font-bold uppercase tracking-widest rounded-lg cursor-pointer transition-colors hover:bg-[#d6b26b]"
              >
                Go to Advisor Board
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {savedDecisions.map((record) => (
                <div
                  key={record.id}
                  id={`saved-decision-archive-row-${record.id}`}
                  onClick={() => handleLoadFromArchive(record)}
                  className="bg-[#0F0F11] border border-[#222222] rounded-xl p-5 hover:border-[#C5A059]/60 hover:bg-[#121213] transition-all cursor-pointer group flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono tracking-widest text-[#C5A059] uppercase px-2 py-0.5 bg-[#151516] border border-[#222222] rounded-sm font-semibold">
                        {record.type.replace("_", " ")}
                      </span>
                      <span className="text-[10px] font-mono text-[#555555]">
                        {record.timestamp}
                      </span>
                    </div>

                    <h3 className="text-lg font-serif italic text-white group-hover:text-[#C5A059] transition-colors pt-2 leading-snug">
                      {record.topic}
                    </h3>
                    
                    {record.context && (
                      <p className="text-xs text-[#666666] line-clamp-1 italic">
                        Context: {record.context}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-4 shrink-0 justify-end">
                    <span className="text-[10px] font-mono tracking-widest uppercase text-slate-400 group-hover:text-white flex items-center gap-1 transition-colors">
                      Reload
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>

                    <button
                      type="button"
                      id={`delete-archive-btn-row-${record.id}`}
                      onClick={(e) => handleDeleteFromArchive(record.id, e)}
                      className="text-slate-600 hover:text-red-800 p-2 text-xs rounded-lg hover:bg-slate-900 transition-colors"
                      title="Permanently Delete Archive Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      )}

      {/* Footer Bar */}
      <footer className="h-12 bg-[#050505] border-t border-[#1A1A1A] flex items-center px-8 justify-between text-[9px] uppercase tracking-[0.4em] text-[#444444]">
        <span>System Online: Decision Engine v4.2.0</span>
        <span>© 2026 The Tiebreaker Collective</span>
        <span className="text-[#C5A059] select-none">Priority Mode Active</span>
      </footer>

    </div>
  );
}
