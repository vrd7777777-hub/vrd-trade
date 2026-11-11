import React, { useState } from 'react';
import {
  Terminal,
  Cpu,
  FileCode2,
  Sparkles,
  CheckCircle2,
  ShieldAlert,
  TrendingUp,
  Percent,
  Timer,
  Zap,
  Building2,
  Sliders,
  Flame,
  ArrowRight
} from 'lucide-react';
import { ReframeLog } from '../types/trading';

interface ReframeStudioProps {
  prompt: string;
  setPrompt: (p: string) => void;
  isReframing: boolean;
  onExecuteReframe: (customPrompt?: string) => void;
  reframeHistory: ReframeLog[];
}

export const ReframeStudio: React.FC<ReframeStudioProps> = ({
  prompt,
  setPrompt,
  isReframing,
  onExecuteReframe,
  reframeHistory,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<"ALL" | "STOPLOSS" | "FUNDAMENTALS" | "HOLDING">("ALL");

  const quickActionModifiers = [
    {
      category: "STOPLOSS",
      label: "🛡️ Set Strict 1.8% Stop-Loss Across All Stocks",
      prompt: "Set strict stop loss to 1.8% below CMP across all stocks in the universe, prioritizing capital preservation.",
      badge: "Capital Shield",
      color: "border-rose-500/40 text-rose-300 bg-rose-950/20",
    },
    {
      category: "STOPLOSS",
      label: "📐 Widen Stop Loss to 2.5x ATR (High Volatility Buffer)",
      prompt: "Adjust stop loss to 2.5x ATR buffer below CMP for all swing holdings to avoid premature market whipsaws.",
      badge: "Volatility Buffer",
      color: "border-amber-500/40 text-amber-300 bg-amber-950/20",
    },
    {
      category: "FUNDAMENTALS",
      label: "🏛️ Union Budget Capex Boost (+15% PAT to Defense & Infra)",
      prompt: "Inject 15% capex and PAT growth into defense, infrastructure, power, and capital goods stocks; upgrade Mojo score by +5 points.",
      badge: "Capex Injection",
      color: "border-cyan-500/40 text-cyan-300 bg-cyan-950/20",
    },
    {
      category: "FUNDAMENTALS",
      label: "💎 Zero Debt & Undervalued High-FCF Compounders",
      prompt: "Prioritize stocks with debt-to-equity < 0.2 and free cash flow margin > 15%; upgrade conviction to Strong Buy.",
      badge: "Balance Sheet Filter",
      color: "border-emerald-500/40 text-emerald-300 bg-emerald-950/20",
    },
    {
      category: "FUNDAMENTALS",
      label: "💰 Conservative Margin of Safety (P/E Target Multiples -12%)",
      prompt: "Reduce target P/E valuation multiples by 12% to enforce conservative margin of safety against global headwinds.",
      badge: "Valuation Discount",
      color: "border-purple-500/40 text-purple-300 bg-purple-950/20",
    },
    {
      category: "HOLDING",
      label: "⚡ Shorten Hold Horizon to 25 Days (Fast Momentum Swing)",
      prompt: "Shorten optimal holding duration to 25-30 days to maximize capital rotation velocity and capture quick breakouts.",
      badge: "Velocity Swing",
      color: "border-teal-500/40 text-teal-300 bg-teal-950/20",
    },
    {
      category: "HOLDING",
      label: "📈 Long-Term 90-Day Positional Compounding Mode",
      prompt: "Extend optimal holding horizon to 75-90 trading days to capture full quarterly earnings revisions.",
      badge: "Positional Compounder",
      color: "border-blue-500/40 text-blue-300 bg-blue-950/20",
    },
    {
      category: "FUNDAMENTALS",
      label: "🏦 RBI Repo Rate-Cut Liquidity Injection (Overweight Banking)",
      prompt: "Overweight banking and financial services sector expecting 50 bps RBI repo rate cuts; upgrade banking targets by 10%.",
      badge: "Monetary Easing",
      color: "border-indigo-500/40 text-indigo-300 bg-indigo-950/20",
    },
  ];

  const filteredModifiers = quickActionModifiers.filter(
    (m) => selectedCategory === "ALL" || m.category === selectedCategory
  );

  const handleApplyPreset = (presetPrompt: string) => {
    setPrompt(presetPrompt);
    onExecuteReframe(presetPrompt);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* STUDIO PANEL */}
      <div className="bg-[#0c121d] border border-purple-500/40 rounded-2xl p-6 shadow-2xl relative overflow-hidden space-y-5">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-emerald-500 text-white shadow-lg shadow-purple-500/20">
              <Terminal className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <span>AI Reframe Prompt Studio</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  LIVE QUANT COMPILER
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Edit the entire application, its fundamentals, stop-loss rules, holding durations, and valuation models via natural language instructions.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 bg-[#070b12] border border-slate-800 p-1 rounded-xl text-xs">
            {(["ALL", "STOPLOSS", "FUNDAMENTALS", "HOLDING"] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                  selectedCategory === cat
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {cat === "ALL" ? "All Presets" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* QUICK ACTION ONE-CLICK MODIFIERS */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Instant AI Action Presets (One-Click Execute):</span>
            </label>
            <span className="text-[11px] text-slate-500 font-mono">
              Clicking directly recompiles app fundamentals
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {filteredModifiers.map((mod, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border ${mod.color} flex flex-col justify-between hover:scale-[1.01] transition-all text-xs`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-extrabold text-white text-[12px]">{mod.label}</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-black/40 border border-white/10 uppercase">
                      {mod.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">{mod.prompt}</p>
                </div>

                <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-mono">
                    Affects: All active Indian stocks
                  </span>
                  <button
                    onClick={() => handleApplyPreset(mod.prompt)}
                    disabled={isReframing}
                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-[11px] flex items-center gap-1 transition-all"
                  >
                    <span>Execute Modifier</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CUSTOM NATURAL LANGUAGE PROMPT EDITOR */}
        <div className="p-4 rounded-xl bg-[#060910] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-white flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-purple-400" />
              <span>Custom Natural Language Prompt Command:</span>
            </label>
            <span className="text-[11px] text-purple-400 font-mono">
              NLP Engine: Active
            </span>
          </div>

          <textarea
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full bg-[#0b1019] border border-slate-700/80 rounded-xl p-3.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-purple-500 leading-relaxed shadow-inner"
            placeholder="Type any prompt instruction e.g. 'Set stop loss to strict 1.5% and raise target price by 10% for defense stocks'..."
          ></textarea>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-[11px] text-slate-400">
              💡 Tip: Try <em>"Tighten stop loss to 2%"</em> or <em>"Boost PAT growth by 20% in Banking"</em>.
            </div>

            <button
              onClick={() => onExecuteReframe(prompt)}
              disabled={isReframing}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-emerald-500 hover:opacity-95 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
            >
              <Cpu className={`w-4 h-4 ${isReframing ? "animate-spin" : ""}`} />
              <span>{isReframing ? "Re-synthesizing Fundamentals..." : "Compile & Edit App Now"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* REFRAME EXECUTION AUDIT & CHANGELOG */}
      <div className="bg-[#0c121d] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <FileCode2 className="w-4 h-4 text-purple-400" />
            <span>AI Reframe Modification Changelog</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {reframeHistory.length} Prompt Transformations Logged
          </span>
        </div>

        <div className="space-y-2.5">
          {reframeHistory.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-[#070b12] border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              <div className="flex items-start space-x-3">
                <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded mt-0.5 shrink-0 border border-purple-500/20">
                  {item.time}
                </span>
                <p className="text-xs font-mono text-slate-300">{item.prompt}</p>
              </div>

              <div className="flex items-center space-x-2 shrink-0 self-end sm:self-auto">
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Applied</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
