import React, { useState } from "react";
import { PRESETS, DecisionPreset } from "../presets";
import { AnalysisType } from "../types";
import { Sparkles, HelpCircle, Plus, Trash2, ArrowRight } from "lucide-react";

interface DecisionFormProps {
  onAnalyze: (payload: {
    topic: string;
    type: AnalysisType;
    context: string;
    options?: string[];
  }) => void;
  isLoading: boolean;
}

export default function DecisionForm({ onAnalyze, isLoading }: DecisionFormProps) {
  const [topic, setTopic] = useState("");
  const [context, setContext] = useState("");
  const [type, setType] = useState<AnalysisType>("pros_cons");
  const [options, setOptions] = useState<string[]>(["Option A", "Option B"]);

  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  const handleUpdateOption = (index: number, val: string) => {
    const updated = [...options];
    updated[index] = val;
    setOptions(updated);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) return; // Keep at least 2 for comparison
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleApplyPreset = (preset: DecisionPreset) => {
    setTopic(preset.topic);
    setContext(preset.context);
    setType(preset.type);
    if (preset.options) {
      setOptions(preset.options);
    } else {
      setOptions(["Option A", "Option B"]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    onAnalyze({
      topic: topic.trim(),
      type,
      context: context.trim(),
      options: type === "comparison" ? options.filter((o) => o.trim() !== "") : undefined,
    });
  };

  return (
    <div id="decision-form-container" className="bg-[#0F0F11] border border-[#222222] rounded-2xl p-6 shadow-2xl space-y-6">
      {/* Title */}
      <div>
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] mb-1">Dilemma Advisor</p>
        <h2 className="text-xl font-serif text-white tracking-wide flex items-center gap-2 mt-0">
          <Sparkles className="w-5 h-5 text-[#C5A059]" />
          Confront a Decision
        </h2>
        <p className="text-xs text-[#888888] mt-1.5 leading-relaxed">
          Tell us about the choice, trade-off, or dilemma you are facing. AI will structure a framework that you can interactively fine-tune.
        </p>
      </div>

      {/* Preset Clips */}
      <div className="space-y-2.5">
        <span className="text-[9px] font-mono tracking-[0.25em] text-[#666666] uppercase">Bespoke Sandbox Templates</span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              id={`preset-btn-${preset.id}`}
              onClick={() => handleApplyPreset(preset)}
              className="group text-left p-3.5 bg-[#0A0A0B] border border-[#202022] rounded-xl hover:border-[#C5A059] hover:bg-[#121213] transition-all text-xs cursor-pointer focus:outline-none"
            >
              <div className="font-serif italic text-[#D1D1D1] group-hover:text-[#C5A059] transition-colors leading-snug">
                {preset.topic.length > 36 ? preset.topic.substring(0, 36) + "..." : preset.topic}
              </div>
              <p className="text-[#666666] text-[10px] mt-1 line-clamp-2 leading-relaxed group-hover:text-[#888888] transition-colors">{preset.context}</p>
              <div className="mt-2.5 flex items-center justify-between text-[9px] font-mono tracking-widest text-[#444444] uppercase group-hover:text-[#C5A059]">
                <span>
                  {preset.type === "pros_cons" ? "Pros & Cons" : preset.type === "swot" ? "SWOT Analysis" : "Comparison Grid"}
                </span>
                <ArrowRight className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </div>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-[#1A1A1A]">
        {/* Toggle Framework Type */}
        <div className="space-y-1.5">
          <label className="text-xs text-[#888888] tracking-wide flex items-center gap-1.5 font-medium">
            <span>Framework Strategy</span>
            <HelpCircle className="w-3.5 h-3.5 text-[#444444] cursor-help hover:text-[#C5A059] transition-colors" title="Pros & Cons suits simple YES/NO trade-offs. SWOT supports strategic initiatives. Comparison structures multi-option decisions." />
          </label>
          <div className="grid grid-cols-3 gap-1 p-1 bg-[#0A0A0B] rounded-lg border border-[#202022]">
            {(["pros_cons", "comparison", "swot"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                id={`mode-tab-${mode}`}
                onClick={() => setType(mode)}
                className={`text-[10px] tracking-widest uppercase py-2 rounded-md font-medium transition-all cursor-pointer ${
                  type === mode
                    ? "bg-[#C5A059] text-black font-semibold"
                    : "text-[#666666] hover:text-white"
                }`}
              >
                {mode === "pros_cons" ? "Pros & Cons" : mode === "comparison" ? "Comparison Grid" : "SWOT Matrix"}
              </button>
            ))}
          </div>
        </div>

        {/* Topic Input */}
        <div className="space-y-1.5">
          <label htmlFor="topic-input" className="text-xs text-[#888888] tracking-wide font-medium">
            The Decision Question
          </label>
          <input
            id="topic-input"
            type="text"
            required
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder={
              type === "pros_cons"
                ? "Should I accept the relocation offer to San Francisco?"
                : type === "comparison"
                ? "What vacation destination should we select for summer?"
                : "Should I launch a premium tech newsletter?"
            }
            className="w-full text-xs px-3.5 py-2.5 bg-[#0A0A0B] border border-[#202022] text-white rounded-xl focus:bg-[#121213] focus:border-[#C5A059] focus:outline-none transition-all placeholder:text-[#444444]"
          />
        </div>

        {/* Options Input (Only when comparison is selected) */}
        {type === "comparison" && (
          <div className="space-y-2 py-1">
            <div className="flex justify-between items-center">
              <label className="text-xs text-[#888888] tracking-wide font-medium">Options to Compare</label>
              <button
                type="button"
                id="add-option-btn"
                onClick={handleAddOption}
                className="text-[11px] text-[#C5A059] hover:text-[#d6b26b] font-medium flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Add Option
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {options.map((option, idx) => (
                <div key={idx} className="flex gap-1.5 items-center">
                  <span className="text-[10px] font-mono text-[#666666] w-4 font-bold">{idx + 1}.</span>
                  <div className="relative flex-1">
                    <input
                      type="text"
                      required
                      value={option}
                      onChange={(e) => handleUpdateOption(idx, e.target.value)}
                      placeholder={`Option ${idx + 1}`}
                      className="w-full text-xs px-3 py-1.5 bg-[#0A0A0B] border border-[#202022] text-white rounded-lg focus:bg-[#121213] focus:border-[#C5A059] focus:outline-none transition-all"
                    />
                  </div>
                  {options.length > 2 && (
                    <button
                      type="button"
                      id={`remove-option-${idx}`}
                      onClick={() => handleRemoveOption(idx)}
                      className="text-[#666666] hover:text-red-800 p-1.5 rounded-lg hover:bg-[#121213] transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Context Input */}
        <div className="space-y-1.5">
          <label htmlFor="context-input" className="text-xs text-[#888888] tracking-wide font-medium flex justify-between">
            <span>Context & Notes (Highly Recommended)</span>
            <span className="text-[10px] font-mono text-[#444444]">Optional</span>
          </label>
          <textarea
            id="context-input"
            rows={3}
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Introduce constraints, budget limits, your feelings, timeline requirements, or values to customize AI analysis."
            className="w-full text-xs p-3 bg-[#0A0A0B] border border-[#202022] text-white rounded-xl focus:bg-[#121213] focus:border-[#C5A059] focus:outline-none transition-all placeholder:text-[#444444] resize-none leading-relaxed"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          id="submit-analysis-btn"
          disabled={isLoading || !topic.trim()}
          className="w-full bg-[#C5A059] text-black font-semibold hover:bg-[#d6b26b] disabled:bg-[#1A1A1A] disabled:text-[#444444] py-3 rounded-xl text-xs uppercase tracking-widest transition-all focus:outline-none flex items-center justify-center gap-2 cursor-pointer border border-[#333333]"
        >
          {isLoading ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-[#1A1A1A] border-t-[#C5A059] rounded-full animate-spin" />
              <span>Consulting Decision Engine...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              <span>Analyze Dilemma</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
